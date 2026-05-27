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

export const paymentsRouter = Router();

/* ------------------------------------------------------------------ */
/*  POST /api/payments/checkout  (protected)                          */
/* ------------------------------------------------------------------ */

const CheckoutSchema = z.object({
  variantId: z.number().int().positive(),
});

paymentsRouter.post(
  "/checkout",
  authenticateToken,
  async (req: Request, res: Response) => {
    try {
      const { variantId } = CheckoutSchema.parse(req.body);
      const userId = req.userId!;

      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user) {
        res.status(404).json({ success: false, error: "USER_NOT_FOUND" });
        return;
      }

      const redirectUrl = `${process.env.FRONTEND_URL ?? "http://localhost:3000"}/dashboard?success=true`;
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
/*  POST /api/payments/webhook  (NOT protected — called by Lemon)     */
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

function planFromVariantId(variantId: number): "INDIVIDUAL" | "FAMILY" | "SCHOOL" | "FREE" {
  const id = Number(variantId);
  if ([1712541, 1712569].includes(id)) return "INDIVIDUAL";
  if ([1712590, 1712596].includes(id)) return "FAMILY";
  if ([1712619, 1712634].includes(id)) return "SCHOOL";
  return "FREE";
}

function mapLemonStatus(status: string): "active" | "canceled" | "past_due" | "trialing" {
  switch (status) {
    case "active":
      return "active";
    case "trialing":
      return "trialing";
    case "past_due":
    case "unpaid":
      return "past_due";
    default:
      return "canceled";
  }
}

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
    console.log("[Webhook] ✓ subscription_payment_success: acknowledged (no plan update)");
    return;
  }

  const subId = String(event?.data?.id ?? "");
  const attrs = event?.data?.attributes ?? {};
  const variantId = Number(attrs?.variant_id ?? attrs?.variant?.id ?? 0);
  const plan = planFromVariantId(variantId);
  const status = mapLemonStatus(String(attrs?.status ?? ""));

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
    console.log(`[Webhook] ✓ ${eventName}: sub=${subId} → FREE`);
    return;
  }

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
    data: { plan, stripeId: attrs?.customer_id ? String(attrs.customer_id) : undefined },
  });

  await prisma.subscription.upsert({
    where: { userId },
    create: {
      userId,
      stripeSubscriptionId: subId,
      stripePriceId: String(variantId || ""),
      status,
      plan: plan === "FREE" ? "FREE" : plan,
      currentPeriodStart: currentStart,
      currentPeriodEnd: renewsAt,
      cancelAtPeriodEnd: Boolean(attrs?.cancelled ?? false),
    },
    update: {
      stripeSubscriptionId: subId,
      stripePriceId: String(variantId || ""),
      status,
      plan: plan === "FREE" ? "FREE" : plan,
      currentPeriodEnd: renewsAt,
      cancelAtPeriodEnd: Boolean(attrs?.cancelled ?? false),
    },
  });

  console.log(`[Webhook] ✓ ${eventName}: user=${userId} plan=${plan} sub=${subId}`);
}
