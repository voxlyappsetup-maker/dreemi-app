# D3M FastSpring Fulfillment To Entitlement Mapping

## Status

**PLANNING ONLY** — docs-only mapping reference. No runtime webhook or entitlement code was implemented in this phase.

Production billing remains **NO-GO**.

## Purpose

Concise reference for future FastSpring webhook/runtime integration: map catalog product paths to Dreemi internal plan entitlements and failure rules.

Parent decision: `docs/D3M_FASTSPRING_SAAS_FULFILLMENT_DECISION.md`

## Product Paths

| Product path | Price | Billing | Catalog plan |
| --- | --- | --- | --- |
| `dreemi-individual-monthly` | USD 4.99 | Monthly | INDIVIDUAL |
| `dreemi-individual-yearly` | USD 47.90 | Yearly | INDIVIDUAL |
| `dreemi-family-monthly` | USD 9.99 | Monthly | FAMILY |
| `dreemi-family-yearly` | USD 95.90 | Yearly | FAMILY |

School: **deferred** — no FastSpring fulfillment mapping at this stage.

## Entitlement Mapping

| Verified FastSpring event / active subscription on product path | Dreemi `User.plan` (effective) | Subscription catalog plan | Child limit (current model) |
| --- | --- | --- | --- |
| Active on `dreemi-individual-monthly` or `dreemi-individual-yearly` | INDIVIDUAL | INDIVIDUAL | 1 |
| Active on `dreemi-family-monthly` or `dreemi-family-yearly` | FAMILY | FAMILY | 4 |
| Canceled / expired (per policy) | FREE | — | 1 (FREE) |
| No active paid subscription | FREE | — | 1 (FREE) |

Fulfillment is **account access**, not file or license delivery.

## Failure Rules

- **Unknown product path:** log safely; do not update entitlement; fail closed
- **Missing/invalid webhook signature:** reject payload; do not update entitlement
- **Duplicate/replayed events:** idempotent handling required in future implementation (design TBD)
- **Refund/chargeback/payment failure:** no automatic mapping until policy phase defines downgrade timing
- **Test-mode orders before runtime integration:** must not grant production entitlement automatically

## Future Webhook Requirements

- Verify provider webhook signatures before parsing business logic
- Map only known product paths listed above
- Preserve fail-closed checkout until integration is tested and approved
- Do not commit raw payloads, secrets, or buyer PII to the repo
- Align cancel/expiry handling with public Refund Policy and Terms

## Notes

- Current runtime still uses Lemon-oriented paths and fail-closed billing gates; FastSpring mapping is future work
- See `docs/D3M_FASTSPRING_TEST_ORDER_PLAN.md` for safe test checkout scope (provider verification only)
- See `docs/D3M_PAYMENT_TRACK_STATE_RECONCILIATION.md` for payment track state
