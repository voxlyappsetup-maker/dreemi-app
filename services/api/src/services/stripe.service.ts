import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  console.warn("[Stripe] STRIPE_SECRET_KEY not set — Stripe calls will fail");
}

/** Shared Stripe client. Uses a dummy key if env var is missing to avoid crash at import. */
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_missing_key_placeholder");

/** Access the underlying Stripe namespace for type references. */
export type { Stripe };

/**
 * Map a Stripe Price ID back to the internal Plan enum value.
 * Falls back to `"FREE"` for unknown prices.
 */
export function planFromPriceId(priceId: string): "FREE" | "INDIVIDUAL" | "FAMILY" {
  const map: Record<string, "INDIVIDUAL" | "FAMILY"> = {};

  if (process.env.STRIPE_PRICE_INDIVIDUAL_MONTHLY)
    map[process.env.STRIPE_PRICE_INDIVIDUAL_MONTHLY] = "INDIVIDUAL";
  if (process.env.STRIPE_PRICE_INDIVIDUAL_YEARLY)
    map[process.env.STRIPE_PRICE_INDIVIDUAL_YEARLY] = "INDIVIDUAL";
  if (process.env.STRIPE_PRICE_FAMILY_MONTHLY)
    map[process.env.STRIPE_PRICE_FAMILY_MONTHLY] = "FAMILY";

  return map[priceId] ?? "FREE";
}

/** Create a Stripe Checkout session for a subscription. */
export async function createCheckoutSession(
  userId: string,
  priceId: string,
  userEmail: string,
  stripeCustomerId?: string | null,
) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const params: any = {
    mode: "subscription",
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${process.env.FRONTEND_URL ?? "http://localhost:3000"}/dashboard?success=true`,
    cancel_url: `${process.env.FRONTEND_URL ?? "http://localhost:3000"}/pricing`,
    metadata: { userId },
  };

  if (stripeCustomerId) {
    params.customer = stripeCustomerId;
  } else {
    params.customer_email = userEmail;
  }

  return stripe.checkout.sessions.create(params);
}

/** Create a Stripe Customer Portal session so users can manage billing. */
export async function createPortalSession(stripeCustomerId: string) {
  return stripe.billingPortal.sessions.create({
    customer: stripeCustomerId,
    return_url: `${process.env.FRONTEND_URL ?? "http://localhost:3000"}/dashboard`,
  });
}

/** Retrieve a Stripe Subscription by ID. */
export async function getSubscription(stripeSubscriptionId: string) {
  return stripe.subscriptions.retrieve(stripeSubscriptionId);
}
