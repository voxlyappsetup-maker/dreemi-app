# D3M FastSpring Activation Checklist

## Status

**Checklist only — no dashboard actions executed in this phase.**

Catalog dashboard setup **COMPLETE**. Website pricing alignment **COMPLETE**. Refund Policy visibility **COMPLETE** (`docs/D3M_FASTSPRING_REFUND_POLICY_ALIGNMENT.md`). SaaS fulfillment decision **COMPLETE** (`docs/D3M_FASTSPRING_SAAS_FULFILLMENT_DECISION.md`). FastSpring response **RECEIVED** — under team review via email continuation. Webhook/entitlement runtime **planned (docs-only)**; not implemented. Activation remains blocked by FastSpring approval, business/tax/KYC/User Agreement, webhook implementation, Live approval, and payout.

FastSpring store exists in **testing/trial mode**. Store is **not Live**. Production billing **NO-GO**.

Reference: `docs/D3M_FASTSPRING_TRIAL_STORE_SETUP_RECORD.md`

## Purpose

Concise activation readiness checklist derived from FastSpring setup guidance and Dreemi pricing/legal decisions. Safe for repo — no sensitive values.

## Activation Preconditions

- [ ] Trial/test store confirmed (observed)
- [ ] FastSpring written eligibility or onboarding guidance received (if applicable)
- [ ] Public website, Privacy, Terms URLs verified
- [x] Refund policy wording finalized on website — public `/refund` (en/ar/fr); see `docs/D3M_FASTSPRING_REFUND_POLICY_ALIGNMENT.md`
- [ ] Safe dashboard rules understood (no secrets in repo)

## Catalog Setup

- [x] Individual monthly subscription (USD 4.99) — created in dashboard
- [x] Individual yearly subscription (USD 47.90) — created in dashboard
- [x] Family monthly subscription (USD 9.99) — created in dashboard
- [x] Family yearly subscription (USD 95.90) — created in dashboard
- [x] Family monthly subscription (USD 9.99) — created in dashboard
- [x] Family yearly subscription (USD 95.90) — created in dashboard
- [x] School plan remains deferred (contact-only on website)
- [x] Product names match public website (Individual, Family, Free; School deferred)

## Pricing Setup

- [x] Unit prices match public pricing page (Individual/Family monthly/yearly)
- [ ] Currency USD confirmed for launch plans
- [ ] No undocumented plan SKUs

## Website Compliance

- [ ] Terms: https://www.dreemi.app/en/terms
- [ ] Privacy: https://www.dreemi.app/en/privacy
- [x] Refund policy visible and final — `/en/refund`, `/ar/refund`, `/fr/refund`; footer links on pricing/landing/Terms/Privacy/settings
- [ ] Support: contact@dreemi.app
- [ ] Website describes SaaS subscription accurately (not marketplace)

## Business / Tax / KYC

- [ ] Business details completed in dashboard (manual — outside repo)
- [ ] User Agreement signed (manual — outside repo)
- [ ] Tax profile submitted when legal/tax posture confirmed (manual — outside repo)
- [ ] Identity/KYC documents submitted (manual — outside repo; no IDs in repo)
- [ ] Payout path chosen (Saudi bank or PayPal) — configure only in dashboard

## Test Mode

- [ ] Catalog configured in Test mode
- [x] Test checkout/order completed in test mode — **PASS on retry** (`docs/D3M_FASTSPRING_TEST_ORDER_RETRY_EXECUTION.md`); first attempt BLOCKED

## Integration / Webhooks

- [ ] Web Checkout approach confirmed (default: Web Checkout first)
- [x] Fulfillment/entitlement strategy documented — `docs/D3M_FASTSPRING_SAAS_FULFILLMENT_DECISION.md`, `docs/D3M_FASTSPRING_FULFILLMENT_TO_ENTITLEMENT_MAPPING.md`
- [ ] Webhooks configured in **dedicated integration phase**
- [ ] Entitlement mapping verified before Live

## Activation Review

- [ ] Minimum FastSpring requirements met
- [ ] Allow 1–3 business days for automatic review after requirements met
- [ ] Live activation **not requested** until checklist complete

## Payout Activation

- [ ] Live store approved by FastSpring
- [ ] Payout activated only after Live approval
- [ ] No bank/tax details copied to repo

## Blockers

| Blocker | Status |
| --- | --- |
| Store not Live | Open (expected) |
| Catalog not configured | **Closed** — four subscriptions in test/trial dashboard |
| Refund wording not final / not public | **Closed** — public Refund Policy aligned (`docs/D3M_FASTSPRING_REFUND_POLICY_ALIGNMENT.md`) |
| SaaS fulfillment not decided | **Closed** — SaaS entitlement decision documented (`docs/D3M_FASTSPRING_SAAS_FULFILLMENT_DECISION.md`) |
| Tax/KYC/User Agreement incomplete | **Open / unverified** — manual dashboard |
| Test order not done | **Closed — PASS on retry** (`docs/D3M_FASTSPRING_TEST_ORDER_RETRY_EXECUTION.md`) |
| Activation request not sent | **Closed — SENT 2026-06-13** | `docs/D3M_FASTSPRING_ACTIVATION_REQUEST_SENT_RECORD.md` |
| Integration not implemented | Open |
| Payout not activated | Open (expected pre/post-Live) |

Gap audit: `docs/D3M_FASTSPRING_ACTIVATION_GAP_AUDIT.md`

## Next Phase

**Primary:** `D3M-Payments-FastSpring-Followup-Email-Sent-Record`

**Alternative:** `D3M-Payments-FastSpring-Webhook-Official-Docs-Verification`

**Rule:** dashboard catalog/test/Live actions require explicit phase approval.
