# D3M FastSpring Activation Checklist

## Status

**Checklist only — no dashboard actions executed in this phase.**

Catalog dashboard setup **COMPLETE** for Individual/Family monthly/yearly in test/trial dashboard. Website pricing alignment **COMPLETE** (`docs/D3M_FASTSPRING_WEBSITE_PRICING_ALIGNMENT.md`). Test-order planning **COMPLETE** (`docs/D3M_FASTSPRING_TEST_ORDER_PLAN.md`); actual test checkout **pending**. Activation remains blocked by test execution, webhooks, Live approval, and payout.

FastSpring store exists in **testing/trial mode**. Store is **not Live**. Production billing **NO-GO**.

Reference: `docs/D3M_FASTSPRING_TRIAL_STORE_SETUP_RECORD.md`

## Purpose

Concise activation readiness checklist derived from FastSpring setup guidance and Dreemi pricing/legal decisions. Safe for repo — no sensitive values.

## Activation Preconditions

- [ ] Trial/test store confirmed (observed)
- [ ] FastSpring written eligibility or onboarding guidance received (if applicable)
- [ ] Public website, Privacy, Terms URLs verified
- [ ] Refund policy wording finalized on website
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
- [ ] Refund policy visible and final
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
- [ ] Test checkout/order executed in **dedicated test-mode phase only**
- [ ] Test order evidence recorded (no payment secrets)

## Integration / Webhooks

- [ ] Web Checkout approach confirmed (default: Web Checkout first)
- [ ] Fulfillment/entitlement strategy documented
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
| Store not Live | Open |
| Catalog not configured | Open |
| Refund wording not final | Open |
| Tax/KYC incomplete | Open |
| Test order not done | Open |
| Integration not implemented | Open |
| Payout not activated | Open |

## Next Phase

**Primary:** `D3M-Payments-FastSpring-Activation-Checklist` execution planning (or `D3M-Payments-FastSpring-Catalog-Plan` first if catalog setup is next).

**Rule:** dashboard catalog/test/Live actions require explicit phase approval.
