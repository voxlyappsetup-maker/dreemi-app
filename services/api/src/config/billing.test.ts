import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  ALLOWED_LEMON_VARIANT_IDS,
  doesSubscriptionStatusGrantPaidAccess,
  isAllowedCheckoutVariantId,
  mapLemonSubscriptionStatus,
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
