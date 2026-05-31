import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  ALLOWED_LEMON_VARIANT_IDS,
  isAllowedCheckoutVariantId,
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
