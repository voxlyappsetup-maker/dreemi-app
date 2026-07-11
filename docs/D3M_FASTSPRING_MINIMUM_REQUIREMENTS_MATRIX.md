# D3M FastSpring Minimum Requirements Matrix

## Status

**HISTORICAL — FastSpring DECLINED; superseded by `docs/D3M_FASTSPRING_FINAL_DECLINE_RECONCILIATION.md`.** Derived from gap audit. Docs-only; no provider actions performed.

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
| 10 | Test order (test mode) | PASS on retry — Individual Monthly; localized SAR | **Yes** |
| 11 | Business details complete | Not documented | **Unverified** |
| 12 | User Agreement signed | Not documented | **Unverified** |
| 13 | Tax profile complete | Not documented | **Unverified** |
| 14 | KYC/identity ready | Not documented | **Unverified** |
| 15 | Contact rep / activation request | **SENT 2026-06-13** to Louis / FastSpring support | **Yes** |
| 16 | Company registration response | **SENT 2026-07-01** to Louis / FastSpring support | **Yes** |
| 17 | Individual/natural-person onboarding support | Superseded by final decline | **Closed** |
| 18 | Live mode | Not enabled | N/A — path closed |
| 19 | Payout activated | Not activated | N/A — path closed |
| 20 | Final onboarding outcome | **DECLINED** — gateway product-category restriction | **Closed** |

## Not Ready Items

- FastSpring path **CLOSED** — payment reroute required
- No active production payment provider
- Provider category preflight not completed
- Dreemi webhook + entitlement integration — **FROZEN** for FastSpring; blocked until new provider acceptance

## Ready Items

- Trial store exists
- Catalog complete (four launch subscriptions)
- Website pricing aligned with catalog
- Refund Policy public visibility (`docs/D3M_FASTSPRING_REFUND_POLICY_ALIGNMENT.md`)
- SaaS fulfillment decision (`docs/D3M_FASTSPRING_SAAS_FULFILLMENT_DECISION.md`)
- Test order PASS on retry (`docs/D3M_FASTSPRING_TEST_ORDER_RETRY_EXECUTION.md`)
- Activation request sent (`docs/D3M_FASTSPRING_ACTIVATION_REQUEST_SENT_RECORD.md`)
- Follow-up sent (`docs/D3M_FASTSPRING_FOLLOWUP_EMAIL_SENT_RECORD.md`)
- School deferred
- Test order plan + evidence policy
- Runtime fail-closed (no accidental live checkout from app)

## Next

1. `D3M-Payments-Provider-Preflight-Outreach`
2. `D3M-Product-Paid-Launch-Risk-Reduction-Implementation-Plan`

**Verdict:** **CLOSED — FastSpring DECLINED; payment reroute with preflight required. Production billing NO-GO.**
