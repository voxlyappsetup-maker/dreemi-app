# D3M FastSpring Minimum Requirements Matrix

## Status

**ACTIVE** — derived from `docs/D3M_FASTSPRING_ACTIVATION_GAP_AUDIT.md`. Docs-only; no provider actions performed.

## Purpose

Concise matrix view of FastSpring minimum activation requirements vs Dreemi current state for quick gate review.

## Requirement Matrix

| # | Requirement | Dreemi Status | Ready? |
| --- | --- | --- | --- |
| 1 | Store in test/trial mode (pre-Live) | Observed | Yes (expected) |
| 2 | ≥1 offering in catalog | 4 subscriptions created | **Yes** |
| 3 | Product names match website | Individual, Family aligned | **Yes** |
| 4 | Unit prices match website | USD 4.99 / 47.90 / 9.99 / 95.90 | **Yes** |
| 5 | Terms page linked | Localized routes + documented URLs | **Partial** — confirm public |
| 6 | Privacy page linked | Localized routes + documented URLs | **Partial** — confirm public |
| 7 | Refund Policy visible | Public `/refund` routes + footer links; 7-day policy | **Yes** |
| 8 | SaaS fulfillment decision | Documented SaaS account entitlement | **Yes** |
| 9 | Checkout style chosen | Web Checkout planned in docs | **Partial** |
| 10 | Test order (test mode) | Attempted — BLOCKED (checkout reached; USD mismatch) | **No** |
| 11 | Business details complete | Not documented | **Unverified** |
| 12 | User Agreement signed | Not documented | **Unverified** |
| 13 | Tax profile complete | Not documented | **Unverified** |
| 14 | KYC/identity ready | Not documented | **Unverified** |
| 15 | Contact rep / activation request | Not sent post-requirements | **No** |
| 16 | Live mode | Not enabled | N/A (post-approval) |
| 17 | Payout activated | Not activated | N/A (post-Live) |

## Not Ready Items

- Test order execution — **BLOCKED attempt** (`docs/D3M_FASTSPRING_TEST_ORDER_MANUAL_EXECUTION.md`)
- Business details / User Agreement / tax / KYC (dashboard — manual)
- Activation request after requirements met
- Dreemi webhook + entitlement integration (production billing blocker)

## Ready Items

- Trial store exists
- Catalog complete (four launch subscriptions)
- Website pricing aligned with catalog
- Refund Policy public visibility (`docs/D3M_FASTSPRING_REFUND_POLICY_ALIGNMENT.md`)
- SaaS fulfillment decision (`docs/D3M_FASTSPRING_SAAS_FULFILLMENT_DECISION.md`)
- School deferred
- Test order plan + evidence policy
- Runtime fail-closed (no accidental live checkout from app)

## Next

1. `D3M-Payments-FastSpring-Test-Mode-Support-Question`
2. `D3M-Payments-FastSpring-Checkout-Currency-Override-Decision`
3. Safe test-order retry (after guidance)

**Verdict:** **PARTIAL — not ready for activation request yet.**
