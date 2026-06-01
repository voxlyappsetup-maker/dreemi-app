import { Plan } from "@prisma/client";

export type BillingCycle = "monthly" | "yearly";
type PaidPlan = Exclude<Plan, "FREE">;
export type LemonLocalSubscriptionStatus = "active" | "trialing" | "past_due" | "canceled";
export type BillingProvider = "LEMONSQUEEZY" | "NONE";
export type PaymentsGateErrorCode = "PAYMENTS_DISABLED" | "PROVIDER_NOT_APPROVED";

export type PaymentsRuntimeState = {
  isProduction: boolean;
  paymentsEnabled: boolean;
  providerApproved: boolean;
  activeProvider: BillingProvider;
};

export type PaymentsGateDecision = PaymentsRuntimeState & {
  canStartCheckout: boolean;
  errorCode: PaymentsGateErrorCode | null;
};

export type LemonVariantCatalogEntry = {
  variantId: number;
  plan: PaidPlan;
  billingCycle: BillingCycle;
};

export const LEMON_VARIANT_CATALOG: readonly LemonVariantCatalogEntry[] = Object.freeze([
  { variantId: 1712541, plan: "INDIVIDUAL", billingCycle: "monthly" },
  { variantId: 1712569, plan: "INDIVIDUAL", billingCycle: "yearly" },
  { variantId: 1712590, plan: "FAMILY", billingCycle: "monthly" },
  { variantId: 1712596, plan: "FAMILY", billingCycle: "yearly" },
  { variantId: 1712619, plan: "SCHOOL", billingCycle: "monthly" },
  { variantId: 1712634, plan: "SCHOOL", billingCycle: "yearly" },
]);

const LEMON_VARIANT_LOOKUP = new Map(
  LEMON_VARIANT_CATALOG.map((entry) => [entry.variantId, entry]),
);

export const ALLOWED_LEMON_VARIANT_IDS = Object.freeze(
  LEMON_VARIANT_CATALOG.map((entry) => entry.variantId),
);

function parseBooleanEnv(value: string | undefined, defaultValue: boolean): boolean {
  const normalized = String(value ?? "").trim().toLowerCase();
  if (!normalized) return defaultValue;
  if (["1", "true", "yes", "on"].includes(normalized)) return true;
  if (["0", "false", "no", "off"].includes(normalized)) return false;
  return defaultValue;
}

function normalizeBillingProvider(value: string | undefined): BillingProvider {
  const normalized = String(value ?? "").trim().toUpperCase();
  if (normalized === "LEMONSQUEEZY") return "LEMONSQUEEZY";
  return "NONE";
}

export function getPaymentsRuntimeState(env: NodeJS.ProcessEnv = process.env): PaymentsRuntimeState {
  const isProduction = String(env.NODE_ENV ?? "").trim().toLowerCase() === "production";
  return {
    isProduction,
    // Keep local workflows usable by default; production is fail-closed by default.
    paymentsEnabled: parseBooleanEnv(env.PAYMENTS_ENABLED, !isProduction),
    providerApproved: parseBooleanEnv(env.PAYMENT_PROVIDER_APPROVED, false),
    activeProvider: normalizeBillingProvider(env.PAYMENT_ACTIVE_PROVIDER ?? "LEMONSQUEEZY"),
  };
}

export function resolvePaymentsGateDecision(env: NodeJS.ProcessEnv = process.env): PaymentsGateDecision {
  const state = getPaymentsRuntimeState(env);
  if (!state.paymentsEnabled) {
    return {
      ...state,
      canStartCheckout: false,
      errorCode: "PAYMENTS_DISABLED",
    };
  }
  if (state.activeProvider !== "LEMONSQUEEZY") {
    return {
      ...state,
      canStartCheckout: false,
      errorCode: "PROVIDER_NOT_APPROVED",
    };
  }
  if (state.isProduction && !state.providerApproved) {
    return {
      ...state,
      canStartCheckout: false,
      errorCode: "PROVIDER_NOT_APPROVED",
    };
  }
  return {
    ...state,
    canStartCheckout: true,
    errorCode: null,
  };
}

export function resolveLemonVariant(variantId: number): LemonVariantCatalogEntry | null {
  return LEMON_VARIANT_LOOKUP.get(Number(variantId)) ?? null;
}

export function resolvePlanFromLemonVariantId(variantId: number): Plan | null {
  return resolveLemonVariant(variantId)?.plan ?? null;
}

export function isAllowedCheckoutVariantId(variantId: number): boolean {
  return resolveLemonVariant(variantId) !== null;
}

export function mapLemonSubscriptionStatus(status: string): LemonLocalSubscriptionStatus {
  const normalized = String(status ?? "").trim().toLowerCase();
  switch (normalized) {
    case "active":
      return "active";
    case "trialing":
    case "on_trial":
      return "trialing";
    case "past_due":
      return "past_due";
    case "unpaid":
    case "cancelled":
    case "canceled":
    case "expired":
    default:
      return "canceled";
  }
}

export function doesSubscriptionStatusGrantPaidAccess(status: LemonLocalSubscriptionStatus): boolean {
  return status === "active" || status === "trialing" || status === "past_due";
}

export function resolveEffectiveUserPlanForSubscription(
  subscriptionPlan: Plan,
  status: LemonLocalSubscriptionStatus,
): Plan {
  if (subscriptionPlan === "FREE") return "FREE";
  return doesSubscriptionStatusGrantPaidAccess(status) ? subscriptionPlan : "FREE";
}
