import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  ALLOWED_LEMON_VARIANT_IDS,
  doesSubscriptionStatusGrantPaidAccess,
  getPaymentsRuntimeState,
  isAllowedCheckoutVariantId,
  mapLemonSubscriptionStatus,
  resolvePaymentsGateDecision,
  resolveEffectiveUserPlanForSubscription,
  resolveLemonVariant,
  resolvePlanFromLemonVariantId,
} from "./billing.js";

describe("billing catalog", () => {
  it("maps known Lemon variant IDs to expected paid plans", () => {
    assert.equal(resolvePlanFromLemonVariantId(1712541), "INDIVIDUAL");
    assert.equal(resolvePlanFromLemonVariantId(1712569), "INDIVIDUAL");
    assert.equal(resolvePlanFromLemonVariantId(1712590), "FAMILY");
    assert.equal(resolvePlanFromLemonVariantId(1712596), "FAMILY");
    assert.equal(resolvePlanFromLemonVariantId(1712619), "SCHOOL");
    assert.equal(resolvePlanFromLemonVariantId(1712634), "SCHOOL");
  });

  it("returns null for unknown variant IDs (not FREE fallback)", () => {
    assert.equal(resolvePlanFromLemonVariantId(9999999), null);
    assert.equal(resolveLemonVariant(9999999), null);
    assert.equal(isAllowedCheckoutVariantId(9999999), false);
  });

  it("exports the allowed checkout variant IDs", () => {
    assert.deepEqual(ALLOWED_LEMON_VARIANT_IDS, [
      1712541,
      1712569,
      1712590,
      1712596,
      1712619,
      1712634,
    ]);
  });
});

describe("subscription status entitlement policy", () => {
  it("active grants paid access", () => {
    const status = mapLemonSubscriptionStatus("active");
    assert.equal(status, "active");
    assert.equal(doesSubscriptionStatusGrantPaidAccess(status), true);
    assert.equal(resolveEffectiveUserPlanForSubscription("FAMILY", status), "FAMILY");
  });

  it("trialing grants paid access", () => {
    const status = mapLemonSubscriptionStatus("trialing");
    assert.equal(status, "trialing");
    assert.equal(doesSubscriptionStatusGrantPaidAccess(status), true);
    assert.equal(resolveEffectiveUserPlanForSubscription("INDIVIDUAL", status), "INDIVIDUAL");
  });

  it("on_trial maps to trialing and grants paid access", () => {
    const status = mapLemonSubscriptionStatus("on_trial");
    assert.equal(status, "trialing");
    assert.equal(doesSubscriptionStatusGrantPaidAccess(status), true);
    assert.equal(resolveEffectiveUserPlanForSubscription("SCHOOL", status), "SCHOOL");
  });

  it("past_due grants paid access for V1", () => {
    const status = mapLemonSubscriptionStatus("past_due");
    assert.equal(status, "past_due");
    assert.equal(doesSubscriptionStatusGrantPaidAccess(status), true);
    assert.equal(resolveEffectiveUserPlanForSubscription("FAMILY", status), "FAMILY");
  });

  it("unpaid maps to canceled and resolves effective user plan to FREE", () => {
    const status = mapLemonSubscriptionStatus("unpaid");
    assert.equal(status, "canceled");
    assert.equal(doesSubscriptionStatusGrantPaidAccess(status), false);
    assert.equal(resolveEffectiveUserPlanForSubscription("FAMILY", status), "FREE");
  });

  it("unknown status resolves effective user plan to FREE", () => {
    const status = mapLemonSubscriptionStatus("unknown_future_status");
    assert.equal(status, "canceled");
    assert.equal(doesSubscriptionStatusGrantPaidAccess(status), false);
    assert.equal(resolveEffectiveUserPlanForSubscription("INDIVIDUAL", status), "FREE");
  });
});

describe("payments runtime safety gate", () => {
  it("defaults to fail-closed in production", () => {
    const decision = resolvePaymentsGateDecision({
      NODE_ENV: "production",
      PAYMENTS_ENABLED: undefined,
      PAYMENT_PROVIDER_APPROVED: undefined,
      PAYMENT_ACTIVE_PROVIDER: undefined,
    });
    assert.equal(decision.canStartCheckout, false);
    assert.equal(decision.errorCode, "PAYMENTS_DISABLED");
    assert.equal(decision.activeProvider, "LEMONSQUEEZY");
  });

  it("blocks production checkout when provider is not approved", () => {
    const decision = resolvePaymentsGateDecision({
      NODE_ENV: "production",
      PAYMENTS_ENABLED: "true",
      PAYMENT_PROVIDER_APPROVED: "false",
      PAYMENT_ACTIVE_PROVIDER: "LEMONSQUEEZY",
    });
    assert.equal(decision.canStartCheckout, false);
    assert.equal(decision.errorCode, "PROVIDER_NOT_APPROVED");
  });

  it("allows production checkout only when enabled and approved", () => {
    const decision = resolvePaymentsGateDecision({
      NODE_ENV: "production",
      PAYMENTS_ENABLED: "true",
      PAYMENT_PROVIDER_APPROVED: "true",
      PAYMENT_ACTIVE_PROVIDER: "LEMONSQUEEZY",
      LEMONSQUEEZY_API_KEY: "configured",
      LEMONSQUEEZY_STORE_ID: "configured",
    });
    assert.equal(decision.canStartCheckout, true);
    assert.equal(decision.errorCode, null);
  });

  it("blocks checkout when provider config is incomplete even if enabled and approved", () => {
    const decision = resolvePaymentsGateDecision({
      NODE_ENV: "production",
      PAYMENTS_ENABLED: "true",
      PAYMENT_PROVIDER_APPROVED: "true",
      PAYMENT_ACTIVE_PROVIDER: "LEMONSQUEEZY",
      LEMONSQUEEZY_API_KEY: "configured",
      LEMONSQUEEZY_STORE_ID: "",
    });
    assert.equal(decision.canStartCheckout, false);
    assert.equal(decision.errorCode, "CHECKOUT_PROVIDER_CONFIG_INCOMPLETE");
  });

  it("keeps non-production runtime enabled by default", () => {
    const state = getPaymentsRuntimeState({
      NODE_ENV: "development",
      PAYMENTS_ENABLED: undefined,
      PAYMENT_PROVIDER_APPROVED: undefined,
      PAYMENT_ACTIVE_PROVIDER: undefined,
    });
    assert.equal(state.paymentsEnabled, true);
    assert.equal(state.providerApproved, false);
    assert.equal(state.activeProvider, "LEMONSQUEEZY");
  });

  it("marks non-production checkout unavailable when Lemon checkout config is incomplete", () => {
    const decision = resolvePaymentsGateDecision({
      NODE_ENV: "development",
      PAYMENTS_ENABLED: "true",
      PAYMENT_ACTIVE_PROVIDER: "LEMONSQUEEZY",
      LEMONSQUEEZY_API_KEY: "",
      LEMONSQUEEZY_STORE_ID: "",
    });
    assert.equal(decision.canStartCheckout, false);
    assert.equal(decision.errorCode, "CHECKOUT_PROVIDER_CONFIG_INCOMPLETE");
  });
});
