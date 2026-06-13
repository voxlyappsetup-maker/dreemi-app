# D3M FastSpring Catalog Plan

## Status

This is a docs-only FastSpring catalog plan.

No FastSpring dashboard change was made.
No FastSpring product/subscription was created.
No checkout/test order was executed.
No API/webhook integration was executed.
No runtime code was changed.
No env/secrets were read, printed, verified, or modified.

Production billing remains **NO-GO**.

## Purpose

- Define the planned FastSpring product/subscription catalog before any dashboard setup.
- Map offerings to internal Dreemi plan entitlements (FREE / INDIVIDUAL / FAMILY / SCHOOL).
- Specify proposed product IDs, public labels, and website consistency requirements.
- Provide dashboard setup and integration checklists for later manual phases.

## Current Baseline

- Latest stable commit: `4b11129 Record FastSpring trial store setup`
- Trial store record: `docs/D3M_FASTSPRING_TRIAL_STORE_SETUP_RECORD.md`
- Pricing decisions: `docs/D3M_PAYMENT_PRICING_AND_REFUND_DECISION.md`

## Source Availability

| Source | Status |
| --- | --- |
| `docs/D3M_FASTSPRING_TRIAL_STORE_SETUP_RECORD.md` | Available |
| `docs/D3M_FASTSPRING_ACTIVATION_CHECKLIST.md` | Available |
| `docs/D3M_PAYMENT_PRICING_AND_REFUND_DECISION.md` | Available |
| `docs/D3M_ENTITY_AND_PAYOUT_DECISION.md` | Available |
| `docs/CURRENT_PROJECT_STATE.md` (entitlement limits) | Available |
| FastSpring dashboard / API credentials | **Not accessed** |

## Explicit Non-Goals

- No FastSpring product/subscription creation.
- No checkout, test order, or Live activation.
- No webhook/API configuration.
- No runtime code, pricing UI, or env changes.
- No claim of provider approval or Live readiness.

## Current FastSpring State

| Field | Status |
| --- | --- |
| Store mode | Testing / trial mode |
| Live mode | **NO** |
| Catalog/product setup | **Pending** |
| Activation review | Pending minimum requirements |
| Production billing | **NO-GO** |

## Catalog Planning Principles

- Keep catalog **minimal** for first launch.
- Only create **Individual** and **Family** paid plans initially.
- Keep **School** deferred unless explicitly enabled later.
- Use **USD** pricing.
- Use clear product names that **match the public website**.
- Avoid hidden products or confusing plan names.
- Avoid creating dashboard entries until the plan is approved.
- Map each FastSpring subscription to **one internal entitlement plan**.
- Do **not** treat catalog planning as provider approval.

## Public Website Consistency Requirement

FastSpring catalog product names and unit prices must **match the public Dreemi website** before activation review.

If the public pricing page still shows payments unavailable, that is acceptable **before** launch, but the **final activation-ready website** must show the same plan names/prices configured in FastSpring.

Do not change the website in this phase.

## Planned Launch Catalog

| Offering | Billing Interval | Public Name | Internal Plan | Price | Currency | Launch Status | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Dreemi Individual — Monthly | Monthly | Individual | INDIVIDUAL | USD 4.99 | USD | PLANNED_FOR_LAUNCH | Primary paid tier |
| Dreemi Individual — Yearly | Yearly | Individual | INDIVIDUAL | USD 47.90 | USD | PLANNED_FOR_LAUNCH | Annual discount vs monthly |
| Dreemi Family — Monthly | Monthly | Family | FAMILY | USD 9.99 | USD | PLANNED_FOR_LAUNCH | Multi-child tier |
| Dreemi Family — Yearly | Yearly | Family | FAMILY | USD 95.90 | USD | PLANNED_FOR_LAUNCH | Annual discount vs monthly |

## Deferred Catalog Items

| Item | Status | Reason |
| --- | --- | --- |
| School plan | **DEFERRED / NOT LAUNCH-CRITICAL** | Requires clearer B2B/school policy, pricing, support, invoicing, and entitlement model before launch |

Proposed ID `dreemi-school` is reserved but **must not be created** until explicitly approved.

## Product / Subscription Matrix

| Internal Plan | Intervals | Child Limit | Story Limit (documented) | Checkout at Launch |
| --- | --- | --- | --- | --- |
| FREE | — | 1 | 3 stories/month | No (default tier) |
| INDIVIDUAL | Monthly, Yearly | 1 | Unlimited paid (per entitlement docs) | Yes |
| FAMILY | Monthly, Yearly | 4 | Unlimited paid (per entitlement docs) | Yes |
| SCHOOL | Deferred | Infinity (when enabled) | TBD | No at launch |

## Proposed FastSpring Product IDs / Paths

| Offering | Proposed ID / Path | Internal Plan | Price | Status | Notes |
| --- | --- | --- | --- | --- | --- |
| Individual monthly | `dreemi-individual-monthly` | INDIVIDUAL | USD 4.99 | **PROPOSED** | Not created yet |
| Individual yearly | `dreemi-individual-yearly` | INDIVIDUAL | USD 47.90 | **PROPOSED** | Not created yet |
| Family monthly | `dreemi-family-monthly` | FAMILY | USD 9.99 | **PROPOSED** | Not created yet |
| Family yearly | `dreemi-family-yearly` | FAMILY | USD 95.90 | **PROPOSED** | Not created yet |
| School | `dreemi-school` | SCHOOL | TBD | **DEFERRED_DO_NOT_CREATE_YET** | Reserved only |

These are **proposed IDs only**. They are not created in FastSpring in this phase.

Final IDs should be confirmed before dashboard setup because changing IDs later may affect integration/webhook mapping.

## Internal Entitlement Mapping

| FastSpring Offering | FastSpring Event / Subscription Meaning | Internal Plan | Expected Entitlement | Child Limit | Story Limit / Notes |
| --- | --- | --- | --- | --- | --- |
| `dreemi-individual-monthly` | Active Individual monthly subscription | INDIVIDUAL | Paid Individual access | 1 | Unlimited paid (verify before runtime integration) |
| `dreemi-individual-yearly` | Active Individual yearly subscription | INDIVIDUAL | Paid Individual access | 1 | Unlimited paid (verify before runtime integration) |
| `dreemi-family-monthly` | Active Family monthly subscription | FAMILY | Paid Family access | 4 | Unlimited paid (verify before runtime integration) |
| `dreemi-family-yearly` | Active Family yearly subscription | FAMILY | Paid Family access | 4 | Unlimited paid (verify before runtime integration) |
| No active paid subscription | Free / expired / canceled | FREE | Free tier access | 1 | 3 stories/month |
| `dreemi-school` (future) | School subscription (deferred) | SCHOOL | School access (TBD) | Infinity | TBD — not launch-critical |

Runtime mapping is **planned only** — not implemented in this phase.

## Fulfillment Strategy

Dreemi is **SaaS access**, not downloadable fulfillment.

FastSpring fulfillment should later trigger subscription lifecycle events that map to internal entitlements.

No fulfillment automation is implemented in this phase.

Future implementation must verify webhook signatures and **fail closed**.

## Checkout Strategy

- Use **FastSpring hosted/web checkout first** for lower implementation risk.
- Do **not** build custom embedded checkout until provider approval and basic hosted checkout are validated.

## Refund / Cancellation Position

- Refund period: **7 days**.
- Final refund wording remains **pending final public policy review**.
- Cancellation/renewal behavior must align with FastSpring subscription behavior and public Terms.

## Website Pricing Requirements

Before activation review, the public site must align with this catalog:

- [ ] Pricing page plan names match FastSpring catalog
- [ ] Pricing page prices match FastSpring catalog
- [ ] Payment unavailable state remains until runtime/provider config is ready
- [ ] Terms URL exists — https://www.dreemi.app/en/terms
- [ ] Privacy URL exists — https://www.dreemi.app/en/privacy
- [ ] Refund policy wording exists or is linked clearly (final wording pending)

## Dashboard Setup Checklist For Later Phase

- [ ] Confirm FastSpring eligibility / trial store status
- [ ] Confirm final product IDs
- [ ] Create Individual monthly subscription
- [ ] Create Individual yearly subscription
- [ ] Create Family monthly subscription
- [ ] Create Family yearly subscription
- [ ] Do not create School unless explicitly approved
- [ ] Enter USD prices exactly
- [ ] Verify displayed product names
- [ ] Verify public website pricing consistency
- [ ] Do not enable Live
- [ ] Do not create API/webhook credentials in dashboard setup phase
- [ ] Do not run test checkout until dedicated test-mode phase

See: `docs/D3M_FASTSPRING_CATALOG_DASHBOARD_SETUP_CHECKLIST.md`

## Test Mode Requirements For Later Phase

A future test-mode phase should run **only after** catalog setup is complete and documented.

- Test order must be **non-live / test mode only**.
- No real payment should be used.
- Evidence should not include buyer personal data or secrets.

## Webhook / API Integration Impact

Future required mapping (implementation deferred):

| Event / condition | Expected behavior |
| --- | --- |
| Subscription created/activated | Set plan **INDIVIDUAL** or **FAMILY** per product ID |
| Subscription renewed | Maintain plan |
| Subscription canceled/expired | Downgrade to **FREE** |
| Payment failed / refunded / chargeback | Define policy before runtime integration |
| Unknown product ID | Reject / no entitlement update |
| All webhook handlers | Signature verification required |

Do not implement in this phase.

## Blocker Register

| Blocker | Area | Severity | Current Status | Required Evidence | Recommended Phase |
| --- | --- | --- | --- | --- | --- |
| Catalog not created | Catalog | Critical | **OPEN** | Products in FastSpring Test mode | Dashboard setup |
| FastSpring Live not active | Provider | Critical | **OPEN** | Live approval | Activation checklist |
| Website pricing may not match final catalog | Website | High | **OPEN** | Aligned pricing page | Website pricing alignment |
| Refund wording not final | Legal | High | **OPEN** | Final public refund text | Legal/Terms review |
| Tax/KYC not completed | Provider | High | **OPEN** | Dashboard verification | Manual dashboard |
| Test order not executed | Test mode | High | **OPEN** | Test checkout evidence | Dedicated test-mode phase |
| Webhooks/API not integrated | Integration | Critical | **OPEN** | Controlled integration | Integration phase |
| Entitlement mapping not implemented | Runtime | Critical | **OPEN** | FastSpring webhook → plan mapping | Integration phase |
| Payout not activated | Payout | Critical | **OPEN** | Post-Live payout | Post-Live phase |
| Production billing NO-GO | Billing | Critical | **BLOCKED** | Full payment path evidence | Multiple phases |

## Payment Readiness Impact

FastSpring catalog plan **improves readiness** but does **not** activate billing.

Production billing remains **unavailable/fail-closed** until catalog setup, provider review, test checkout, webhook integration, entitlement mapping, and activation are complete.

## Launch Gate Impact

| Gate | Status |
| --- | --- |
| Payment provider gate | **PARTIAL** — trial/test store exists; catalog plan created |
| Catalog gate | **COMPLETE** for planned test/trial offerings (dashboard setup confirmed) |
| Checkout gate | **BLOCKED** — no checkout/test order |
| Webhook gate | **BLOCKED** — no integration |
| Entitlement gate | **BLOCKED** — mapping planned only |
| Payout gate | **BLOCKED** — not activated |
| Production billing | **NO-GO** |

## Recommended Next Phase

**Primary:** **`D3M-Payments-FastSpring-Refund-Policy-Alignment`**.

**Alternative:** **`D3M-Payments-FastSpring-SaaS-Fulfillment-Decision`**.

Catalog plan follow-up: activation gap audit `docs/D3M_FASTSPRING_ACTIVATION_GAP_AUDIT.md`; test-order plan `docs/D3M_FASTSPRING_TEST_ORDER_PLAN.md`.

## Notes For Next Chat

- Catalog is **planned only** — do not create products without explicit dashboard-setup phase approval.
- Confirm final product IDs before dashboard entry.
- School remains **deferred**.
- Production billing remains No-Go.

## Related Artifacts

- Dashboard setup record: `docs/D3M_FASTSPRING_CATALOG_DASHBOARD_SETUP_RECORD.md` — manual setup **COMPLETE** (test/trial catalog configured)
- Dashboard setup checklist: `docs/D3M_FASTSPRING_CATALOG_DASHBOARD_SETUP_CHECKLIST.md`
- Activation checklist: `docs/D3M_FASTSPRING_ACTIVATION_CHECKLIST.md`
- Trial store record: `docs/D3M_FASTSPRING_TRIAL_STORE_SETUP_RECORD.md`
