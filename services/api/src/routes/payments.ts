import { Router, Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../services/prisma.service";
import {
  stripe,
  createCheckoutSession,
  createPortalSession,
  planFromPriceId,
} from "../services/stripe.service";
import { authenticateToken } from "../middleware/auth.middleware";

export const paymentsRouter = Router();

/* ------------------------------------------------------------------ */
/*  POST /api/payments/create-checkout  (protected)                   */
/* ------------------------------------------------------------------ */

const CheckoutSchema = z.object({
  priceId: z.string().min(1),
});

paymentsRouter.post(
  "/create-checkout",
  authenticateToken,
  async (req: Request, res: Response) => {
    try {
      const { priceId } = CheckoutSchema.parse(req.body);
      const userId = req.userId!;

      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user) {
        res.status(404).json({ success: false, error: "المستخدم غير موجود" });
        return;
      }

      const session = await createCheckoutSession(
        userId,
        priceId,
        user.email,
        user.stripeId,
      );

      res.json({ success: true, url: session.url });
    } catch (err) {
      if (err instanceof z.ZodError) {
        res.status(400).json({ success: false, error: err.errors });
        return;
      }
      console.error("[Payments] checkout error:", err);
      res.status(500).json({ success: false, error: "فشل إنشاء جلسة الدفع" });
    }
  },
);

/* ------------------------------------------------------------------ */
/*  POST /api/payments/create-portal  (protected)                     */
/* ------------------------------------------------------------------ */

paymentsRouter.post(
  "/create-portal",
  authenticateToken,
  async (req: Request, res: Response) => {
    try {
      const userId = req.userId!;
      const user = await prisma.user.findUnique({ where: { id: userId } });

      if (!user?.stripeId) {
        res
          .status(400)
          .json({ success: false, error: "لا يوجد اشتراك مرتبط بحسابك" });
        return;
      }

      const session = await createPortalSession(user.stripeId);
      res.json({ success: true, url: session.url });
    } catch (err) {
      console.error("[Payments] portal error:", err);
      res.status(500).json({ success: false, error: "فشل فتح بوابة الاشتراك" });
    }
  },
);

/* ------------------------------------------------------------------ */
/*  POST /api/payments/cancel-subscription  (protected)               */
/* ------------------------------------------------------------------ */

paymentsRouter.post(
  "/cancel-subscription",
  authenticateToken,
  async (req: Request, res: Response) => {
    try {
      const userId = req.userId!;
      const subscription = await prisma.subscription.findUnique({
        where: { userId },
      });

      if (!subscription || subscription.status === "canceled") {
        res.status(400).json({ success: false, error: "لا يوجد اشتراك نشط" });
        return;
      }

      // Cancel at period end — user keeps access until billing cycle ends
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const updated: any = await stripe.subscriptions.update(
        subscription.stripeSubscriptionId,
        { cancel_at_period_end: true },
      );

      await prisma.subscription.update({
        where: { userId },
        data: { cancelAtPeriodEnd: true },
      });

      const periodEnd = new Date(
        (updated.current_period_end ?? 0) * 1000,
      );

      console.log(
        `[Payments] ✓ subscription cancel scheduled: user=${userId} ends=${periodEnd.toISOString()}`,
      );

      res.json({
        success: true,
        message: "سيتم إلغاء الاشتراك في نهاية الفترة الحالية",
        periodEnd: periodEnd.toISOString(),
      });
    } catch (err) {
      console.error("[Payments] cancel-subscription error:", err);
      res.status(500).json({ success: false, error: "فشل إلغاء الاشتراك" });
    }
  },
);

/* ------------------------------------------------------------------ */
/*  POST /api/payments/webhook  (NOT protected — called by Stripe)    */
/* ------------------------------------------------------------------ */

paymentsRouter.post(
  "/webhook",
  async (req: Request, res: Response) => {
    const sig = req.headers["stripe-signature"];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let event: any;

    if (webhookSecret && sig) {
      try {
        event = stripe.webhooks.constructEvent(
          req.body as Buffer,
          sig as string,
          webhookSecret,
        );
      } catch (err) {
        console.error("[Webhook] signature verification failed:", err);
        res.status(400).json({ error: "Invalid signature" });
        return;
      }
    } else {
      event = req.body;
    }

    try {
      const eventType = event.type as string;

      switch (eventType) {
        case "checkout.session.completed":
          await handleCheckoutCompleted(event.data.object);
          break;

        case "customer.subscription.updated":
          await handleSubscriptionUpdated(event.data.object);
          break;

        case "customer.subscription.deleted":
          await handleSubscriptionDeleted(event.data.object);
          break;

        default:
          console.log(`[Webhook] unhandled event: ${eventType}`);
      }

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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function handleCheckoutCompleted(session: any): Promise<void> {
  const userId = session.metadata?.userId as string | undefined;
  if (!userId) {
    console.warn("[Webhook] checkout.session.completed missing userId metadata");
    return;
  }

  const customerId =
    typeof session.customer === "string"
      ? session.customer
      : session.customer?.id;

  const subscriptionId =
    typeof session.subscription === "string"
      ? session.subscription
      : session.subscription?.id;

  if (!subscriptionId) {
    console.warn("[Webhook] checkout.session.completed missing subscription");
    return;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sub: any = await stripe.subscriptions.retrieve(subscriptionId);
  const priceId: string = sub.items.data[0]?.price.id ?? "";
  const plan = planFromPriceId(priceId);

  const periodStart = new Date(
    (sub.current_period_start ?? sub.items?.data?.[0]?.current_period_start ?? 0) * 1000,
  );
  const periodEnd = new Date(
    (sub.current_period_end ?? sub.items?.data?.[0]?.current_period_end ?? 0) * 1000,
  );

  if (customerId) {
    await prisma.user.update({
      where: { id: userId },
      data: { stripeId: customerId, plan },
    });
  }

  await prisma.subscription.upsert({
    where: { userId },
    create: {
      userId,
      stripeSubscriptionId: subscriptionId,
      stripePriceId: priceId,
      status: mapStripeStatus(sub.status),
      plan,
      currentPeriodStart: periodStart,
      currentPeriodEnd: periodEnd,
      cancelAtPeriodEnd: sub.cancel_at_period_end ?? false,
    },
    update: {
      stripeSubscriptionId: subscriptionId,
      stripePriceId: priceId,
      status: mapStripeStatus(sub.status),
      plan,
      currentPeriodStart: periodStart,
      currentPeriodEnd: periodEnd,
      cancelAtPeriodEnd: sub.cancel_at_period_end ?? false,
    },
  });

  console.log(
    `[Webhook] ✓ checkout completed: user=${userId} plan=${plan} sub=${subscriptionId}`,
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function handleSubscriptionUpdated(sub: any): Promise<void> {
  const existing = await prisma.subscription.findUnique({
    where: { stripeSubscriptionId: sub.id },
  });

  if (!existing) {
    console.warn(`[Webhook] subscription.updated for unknown sub: ${sub.id}`);
    return;
  }

  const priceId = sub.items?.data?.[0]?.price?.id ?? existing.stripePriceId;
  const plan = planFromPriceId(priceId);

  await prisma.subscription.update({
    where: { stripeSubscriptionId: sub.id },
    data: {
      stripePriceId: priceId,
      status: mapStripeStatus(sub.status),
      plan,
      currentPeriodStart: new Date(sub.current_period_start * 1000),
      currentPeriodEnd: new Date(sub.current_period_end * 1000),
      cancelAtPeriodEnd: sub.cancel_at_period_end ?? false,
    },
  });

  await prisma.user.update({
    where: { id: existing.userId },
    data: { plan },
  });

  console.log(
    `[Webhook] ✓ subscription updated: sub=${sub.id} plan=${plan} status=${sub.status}`,
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function handleSubscriptionDeleted(sub: any): Promise<void> {
  const existing = await prisma.subscription.findUnique({
    where: { stripeSubscriptionId: sub.id },
  });

  if (!existing) {
    console.warn(`[Webhook] subscription.deleted for unknown sub: ${sub.id}`);
    return;
  }

  await prisma.subscription.update({
    where: { stripeSubscriptionId: sub.id },
    data: { status: "canceled", cancelAtPeriodEnd: false },
  });

  await prisma.user.update({
    where: { id: existing.userId },
    data: { plan: "FREE" },
  });

  console.log(
    `[Webhook] ✓ subscription deleted: sub=${sub.id} user=${existing.userId} → FREE`,
  );
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                           */
/* ------------------------------------------------------------------ */

function mapStripeStatus(
  status: string,
): "active" | "canceled" | "past_due" | "trialing" {
  switch (status) {
    case "active":
      return "active";
    case "trialing":
      return "trialing";
    case "past_due":
      return "past_due";
    default:
      return "canceled";
  }
}
