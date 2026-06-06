import { Router, Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../services/prisma.service";
import { authenticateToken } from "../middleware/auth.middleware";
import {
  cancelSubscription,
  createCheckoutUrl,
  getSubscription,
  verifyLemonSqueezyWebhook,
} from "../services/lemonsqueezy.service";
import {
  getPaymentsRuntimeState,
  isAllowedCheckoutVariantId,
  mapLemonSubscriptionStatus,
  resolvePaymentsGateDecision,
  resolveEffectiveUserPlanForSubscription,
  resolvePlanFromLemonVariantId,
} from "../config/billing";

export const paymentsRouter = Router();

/* ------------------------------------------------------------------ */
/*  POST /api/payments/checkout  (protected)                          */
/* ------------------------------------------------------------------ */

const CheckoutSchema = z.object({
  variantId: z.number().int().positive(),
});

paymentsRouter.get(
  "/status",
  (_req: Request, res: Response) => {
    const gate = resolvePaymentsGateDecision();
    const runtime = getPaymentsRuntimeState();
    res.json({
      success: true,
      payments: {
        providerSelected: gate.providerSelected,
        providerRuntimeEnabled: gate.providerRuntimeEnabled,
        checkoutProviderConfigComplete: gate.checkoutProviderConfigComplete,
        checkoutOfferable: gate.checkoutOfferable,
        canStartCheckout: gate.canStartCheckout,
        errorCode: gate.errorCode,
        activeProvider: runtime.activeProvider,
      },
    });
  },
);

function getCheckoutFrontendUrl(): string | null {
  const configured = String(process.env.FRONTEND_URL ?? "").trim();
  if (configured) return configured.replace(/\/+$/, "");
  if (process.env.NODE_ENV === "production") return null;
  return "http://localhost:3000";
}

paymentsRouter.post(
  "/checkout",
  authenticateToken,
  async (req: Request, res: Response) => {
    try {
      const { variantId } = CheckoutSchema.parse(req.body);
      const gate = resolvePaymentsGateDecision();
      if (!gate.canStartCheckout) {
        const checkoutGateCode =
          gate.errorCode === "PROVIDER_NOT_APPROVED"
            ? "PROVIDER_NOT_APPROVED"
            : gate.errorCode === "CHECKOUT_PROVIDER_CONFIG_INCOMPLETE"
              ? "CHECKOUT_PROVIDER_CONFIG_INCOMPLETE"
              : "PAYMENTS_DISABLED";
        res.status(503).json({
          success: false,
          error: checkoutGateCode,
          code: checkoutGateCode,
        });
        return;
      }

      const userId = req.userId!;
      if (!isAllowedCheckoutVariantId(variantId)) {
        res.status(400).json({ success: false, error: "UNKNOWN_CHECKOUT_VARIANT" });
        return;
      }

      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user) {
        res.status(404).json({ success: false, error: "USER_NOT_FOUND" });
        return;
      }

      const frontendUrl = getCheckoutFrontendUrl();
      if (!frontendUrl) {
        console.error("[Payments] FRONTEND_URL is missing in production environment");
        res.status(500).json({ success: false, error: "FRONTEND_URL_NOT_CONFIGURED" });
        return;
      }
      const redirectUrl = `${frontendUrl}/dashboard?success=true`;
      const url = await createCheckoutUrl({
        variantId,
        userId,
        userEmail: user.email,
        redirectUrl,
      });

      res.json({ success: true, url });
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ success: false, error: err.errors });
        return;
      }
      if (
        err instanceof Error &&
        (err.message.includes("LEMONSQUEEZY_STORE_ID is not set") ||
          err.message.includes("LEMONSQUEEZY_API_KEY is not set"))
      ) {
        res.status(503).json({
          success: false,
          error: "CHECKOUT_PROVIDER_CONFIG_INCOMPLETE",
          code: "CHECKOUT_PROVIDER_CONFIG_INCOMPLETE",
        });
        return;
      }
      console.error("[Payments] checkout error:", err);
      res.status(500).json({ success: false, error: "CHECKOUT_CREATE_FAILED" });
    }
  },
);

/* ------------------------------------------------------------------ */
/*  GET /api/payments/subscription  (protected)                       */
/* ------------------------------------------------------------------ */

paymentsRouter.get(
  "/subscription",
  authenticateToken,
  async (req: Request, res: Response) => {
    try {
      const userId = req.userId!;
      const subscription = await prisma.subscription.findUnique({ where: { userId } });
      if (!subscription) {
        res.status(404).json({ success: false, error: "SUBSCRIPTION_NOT_FOUND" });
        return;
      }

      const remote = await getSubscription(subscription.stripeSubscriptionId);
      res.json({ success: true, subscription, remote });
    } catch (err) {
      console.error("[Payments] subscription error:", err);
      res.status(500).json({ success: false, error: "SUBSCRIPTION_FETCH_FAILED" });
    }
  },
);

/* ------------------------------------------------------------------ */
/*  POST /api/payments/cancel  (protected)                            */
/* ------------------------------------------------------------------ */

paymentsRouter.post(
  "/cancel",
  authenticateToken,
  async (req: Request, res: Response) => {
    try {
      const userId = req.userId!;
      const subscription = await prisma.subscription.findUnique({
        where: { userId },
      });

      if (!subscription || subscription.status === "canceled") {
        res.status(400).json({ success: false, error: "NO_ACTIVE_SUBSCRIPTION" });
        return;
      }

      await cancelSubscription(subscription.stripeSubscriptionId);
      await prisma.subscription.update({
        where: { userId },
        data: { cancelAtPeriodEnd: true },
      });
      res.json({
        success: true,
        message: "SUBSCRIPTION_CANCEL_REQUESTED",
      });
    } catch (err) {
      console.error("[Payments] cancel-subscription error:", err);
      res.status(500).json({ success: false, error: "SUBSCRIPTION_CANCEL_FAILED" });
    }
  },
);

/* ------------------------------------------------------------------ */
/*  POST /api/payments/webhook  (NOT protected - called by Lemon)     */
/* ------------------------------------------------------------------ */

paymentsRouter.post(
  "/webhook",
  async (req: Request, res: Response) => {
    try {
      const raw = req.body as Buffer;
      const signature = req.headers["x-signature"] as string | undefined;
      const ok = verifyLemonSqueezyWebhook(raw, signature);
      if (!ok) {
        res.status(401).json({ error: "Invalid signature" });
        return;
      }

      const event = JSON.parse(raw.toString("utf8")) as any;
      const eventName = event?.meta?.event_name as string | undefined;
      if (!eventName) {
        res.status(400).json({ error: "Missing event_name" });
        return;
      }

      await handleLemonSubscriptionEvent(eventName, event);

      res.json({ received: true });
    } catch (err) {
      console.error("[Webhook] handler error:", err);
      res.status(500).json({ error: "Webhook handler failed" });
    }
  },
);

/* ------------------------------------------------------------------ */
/*  Webhook Handlers                                                  */
/* ------------------------------------------------------------------ */

async function resolveUserIdFromWebhook(event: any): Promise<string | null> {
  const attrs = event?.data?.attributes ?? {};

  const customUserId = event?.meta?.custom_data?.user_id;
  if (customUserId) {
    const user = await prisma.user.findUnique({
      where: { id: String(customUserId) },
    });
    if (user) return user.id;
  }

  const email = attrs?.user_email;
  if (typeof email === "string" && email.length > 0) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (user) return user.id;
  }

  return null;
}

async function handleLemonSubscriptionEvent(eventName: string, event: any): Promise<void> {
  // Payment success is notification-only; payload has no variant_id and must not touch plan.
  if (eventName === "subscription_payment_success") {
    console.log("[Webhook] [ok] subscription_payment_success: acknowledged (no plan update)");
    return;
  }

  const subId = String(event?.data?.id ?? "");
  const attrs = event?.data?.attributes ?? {};
  const variantId = Number(attrs?.variant_id ?? attrs?.variant?.id ?? 0);
  const status = mapLemonSubscriptionStatus(String(attrs?.status ?? ""));

  if (!subId) {
    console.warn(`[Webhook] missing subscription id for ${eventName}`);
    return;
  }

  let userId = await resolveUserIdFromWebhook(event);

  if (eventName === "subscription_cancelled" || eventName === "subscription_expired") {
    const existing = await prisma.subscription.findUnique({ where: { stripeSubscriptionId: subId } });
    if (existing) {
      await prisma.subscription.update({
        where: { stripeSubscriptionId: subId },
        data: { status: "canceled", cancelAtPeriodEnd: false, plan: existing.plan },
      });
      await prisma.user.update({ where: { id: existing.userId }, data: { plan: "FREE" } });
    } else if (userId) {
      await prisma.user.update({ where: { id: userId }, data: { plan: "FREE" } });
    }
    console.log(`[Webhook] [ok] ${eventName}: sub=${subId} -> FREE`);
    return;
  }

  const plan = resolvePlanFromLemonVariantId(variantId);
  if (!plan) {
    console.warn(`[Webhook] ${eventName} unknown variant_id=${variantId}; skipping plan update`);
    return;
  }
  const effectiveUserPlan = resolveEffectiveUserPlanForSubscription(plan, status);

  if (!userId) {
    userId = String(event?.meta?.custom_data?.user_id ?? "");
    if (!userId) {
      console.warn(
        `[Webhook] ${eventName} could not resolve user (custom.user_id and email fallback failed)`,
      );
      return;
    }
  }

  const renewsAt = attrs?.renews_at ? new Date(String(attrs.renews_at)) : new Date();
  const currentStart = attrs?.created_at ? new Date(String(attrs.created_at)) : new Date();

  await prisma.user.update({
    where: { id: userId },
    data: { plan: effectiveUserPlan, stripeId: attrs?.customer_id ? String(attrs.customer_id) : undefined },
  });

  await prisma.subscription.upsert({
    where: { userId },
    create: {
      userId,
      stripeSubscriptionId: subId,
      stripePriceId: String(variantId || ""),
      status,
      plan,
      currentPeriodStart: currentStart,
      currentPeriodEnd: renewsAt,
      cancelAtPeriodEnd: Boolean(attrs?.cancelled ?? false),
    },
    update: {
      stripeSubscriptionId: subId,
      stripePriceId: String(variantId || ""),
      status,
      plan,
      currentPeriodEnd: renewsAt,
      cancelAtPeriodEnd: Boolean(attrs?.cancelled ?? false),
    },
  });

  console.log(
    `[Webhook] [ok] ${eventName}: user=${userId} subscriptionPlan=${plan} effectiveUserPlan=${effectiveUserPlan} sub=${subId}`,
  );
}
