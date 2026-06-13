# D3M FastSpring Test Order Plan

## Status

**COMPLETE** — docs-only FastSpring test order plan. No checkout opened. No test order executed.

This is a docs-only FastSpring test order plan.
No checkout was opened.
No test order was executed.
No live payment was attempted.
No FastSpring API call was made.
No webhook was configured.
No provider credentials were added.
No env/secrets were read, printed, verified, or modified.
No runtime payment code was changed.
Production billing remains **NO-GO**.

## Purpose

Define preconditions, scope, evidence rules, and stop conditions for a **future** manual FastSpring test-mode checkout. This phase prepares execution only — it does not run checkout or change runtime payment behavior.

## Current Baseline

- Latest stable commit: `d977425` — Align FastSpring website pricing
- Prior payment milestones:
  - FastSpring catalog dashboard setup **COMPLETE** (`docs/D3M_FASTSPRING_CATALOG_DASHBOARD_SETUP_RECORD.md`)
  - Website pricing alignment **COMPLETE** (`docs/D3M_FASTSPRING_WEBSITE_PRICING_ALIGNMENT.md`)
- Confirmed catalog offerings (test/trial mode):

| FastSpring Path | Price | Currency | Interval | Internal Plan |
| --- | --- | --- | --- | --- |
| `dreemi-individual-monthly` | 4.99 | USD | Monthly | INDIVIDUAL |
| `dreemi-individual-yearly` | 47.90 | USD | Yearly | INDIVIDUAL |
| `dreemi-family-monthly` | 9.99 | USD | Monthly | FAMILY |
| `dreemi-family-yearly` | 95.90 | USD | Yearly | FAMILY |

## Source Availability

| Source | Available | Notes |
| --- | --- | --- |
| `docs/D3M_FASTSPRING_CATALOG_DASHBOARD_SETUP_RECORD.md` | Yes | Catalog complete in test/trial dashboard |
| `docs/D3M_FASTSPRING_WEBSITE_PRICING_ALIGNMENT.md` | Yes | Public pricing aligned |
| `docs/D3M_FASTSPRING_CATALOG_PLAN.md` | Yes | Planned IDs and mapping |
| `docs/D3M_FASTSPRING_ACTIVATION_CHECKLIST.md` | Yes | Activation preconditions |
| `docs/D3M_FASTSPRING_TRIAL_STORE_SETUP_RECORD.md` | Yes | Trial store observed; not Live |
| Runtime checkout / webhook / entitlement integration | No | Fail-closed; not implemented |
| FastSpring test payment instructions | Not captured in repo | Must be read from official dashboard/docs at execution time only |

## Explicit Non-Goals

- Opening checkout in this phase
- Executing a test order
- Live payment or Live mode activation
- FastSpring API calls
- Webhook creation or configuration
- API key creation
- Entitlement runtime mapping
- Database writes
- Env/secrets changes
- Runtime payment code changes
- Payout / tax / KYC activation
- Recording order IDs, transaction IDs, or buyer PII in repo/chat

## Current Payment State

FastSpring store is in testing/trial mode.
FastSpring catalog is complete for Individual and Family monthly/yearly subscriptions.
Website pricing is aligned with FastSpring catalog.
Live payments are not enabled.
Runtime checkout remains unavailable/fail-closed.
Webhook integration is not implemented.
Entitlement runtime mapping is not implemented.
Payout is not activated.
Production billing remains **NO-GO**.

## Test Order Goal

The future test order should prove that FastSpring test-mode checkout can present the correct catalog item, price, currency, and billing interval without using live payment rails and without enabling production billing.

The first test order should not be used to activate production billing.
The first test order should not update Dreemi entitlements automatically unless a later webhook/runtime integration phase exists.

## Preconditions Before Any Test Order

- [ ] Confirm FastSpring store remains in testing/trial mode
- [ ] Confirm Live mode is not enabled
- [ ] Confirm selected product is one of the four planned offerings
- [ ] Confirm displayed product name matches catalog
- [ ] Confirm displayed price matches catalog
- [ ] Confirm displayed currency is USD
- [ ] Confirm billing interval is correct
- [ ] Confirm no API keys/webhooks are required for this manual test
- [ ] Confirm no real card or real payment instrument will be used
- [ ] Confirm no customer personal data will be copied into repo/chat
- [ ] Confirm no order IDs/transaction IDs will be copied into repo/chat
- [ ] Confirm no payout/tax/KYC settings will be touched

## Test Mode Boundary

Only FastSpring test/trial mode may be used.
Do not switch to Live.
Do not request activation.
Do not use a real payment method.
Do not process a real payment.
Do not connect the result to production entitlements.

## Offerings To Test

| Offering | FastSpring Path | Expected Price | Currency | Billing Interval | Internal Plan | Priority |
| --- | --- | --- | --- | --- | --- | --- |
| Dreemi Individual — Monthly | `dreemi-individual-monthly` | 4.99 | USD | Monthly | INDIVIDUAL | P1 |
| Dreemi Family — Monthly | `dreemi-family-monthly` | 9.99 | USD | Monthly | FAMILY | P2 |
| Dreemi Individual — Yearly | `dreemi-individual-yearly` | 47.90 | USD | Yearly | INDIVIDUAL | P3 |
| Dreemi Family — Yearly | `dreemi-family-yearly` | 95.90 | USD | Yearly | FAMILY | P4 |

**Deferred:** School, Free, one-time products — not in FastSpring launch catalog.

## Recommended Test Sequence

**First future test:** Dreemi Individual — Monthly only (`dreemi-individual-monthly`).

**Reason:** lowest price, simplest monthly subscription, maps to INDIVIDUAL.

Do not test all four offerings in the first execution unless the first test is successful and the user explicitly approves expanding scope.

Suggested expansion order after P1 success: P2 → P3 → P4, one offering per approved execution.

## Allowed Test Evidence

See `docs/D3M_FASTSPRING_TEST_ORDER_EVIDENCE_POLICY.md` for full rules. Summary:

| Field | Allowed |
| --- | --- |
| Test mode confirmed | Yes/No |
| Offering tested | Public product path/name only (e.g. `dreemi-individual-monthly`) |
| Displayed price/currency/interval | Safe values only (e.g. USD 4.99, Monthly) |
| Checkout reached | Yes/No |
| Test order completed | Yes/No |
| High-level result | PASS / PARTIAL / BLOCKED |
| Non-sensitive dashboard message if blocked | Generic text only — no IDs or PII |
| Screenshot | No — unless explicitly scrubbed and approved in a later phase |

## Forbidden Test Evidence

- Order ID
- Transaction ID
- Customer ID
- Subscription ID
- Checkout session URL
- Private account IDs
- Email address used for checkout
- Billing address
- Card number
- Payment method details
- Tax ID
- IP address
- Raw receipt
- Raw webhook payload
- Screenshots containing personal, transaction, or account data

## Test Buyer Data Rules

Use only non-sensitive test data approved by FastSpring's test-mode flow.
Do not use real customer data.
Do not use a personal email that should be kept private in repo/chat.
Do not paste buyer email into repo/chat.
Do not paste billing address into repo/chat.

Do not invent specific FastSpring test card numbers or test payment details in this plan.

The future execution phase must use only FastSpring-supported test-mode payment instructions visible in the official dashboard/docs at execution time.

## Checkout Safety Rules

Before opening checkout, confirm test/trial mode visually.
If any page indicates Live mode, stop.
If any real payment method is requested, stop.
If checkout requires tax/KYC/payout activation first, stop.
If checkout creates webhooks/API credentials, stop.
If checkout exposes secrets, stop.

Do not open checkout from Dreemi production runtime — provider-side manual test only until a dedicated integration phase approves app checkout.

## Runtime / Entitlement Expectations

Current Dreemi runtime payment remains fail-closed.
The test order is a provider-side manual test only.
No Dreemi user entitlement should be changed in this phase.
No database write should occur.
No webhook event should be consumed by Dreemi until a dedicated webhook integration phase.

Paid buttons on the public pricing page remain disabled/unavailable via existing fail-closed logic.

## Webhook Expectations

Webhooks are not configured in this phase.
No webhook secret is created.
No webhook payload is captured.
A later webhook planning phase must define signature verification, event mapping, unknown product rejection, cancellation handling, and fail-closed behavior.

Recommended follow-up: `D3M-Payments-FastSpring-Webhook-Integration-Plan`.

## Stop Conditions

Stop if store is not clearly in testing/trial mode.
Stop if Live activation appears required.
Stop if a real card/payment method is requested.
Stop if any API key/webhook secret is requested or displayed.
Stop if tax/KYC/payout information is requested.
Stop if buyer personal data would need to be copied into repo/chat.
Stop if checkout item price/currency/interval does not match catalog.
Stop if School/free/one-time product appears in checkout scope.

## Manual Execution Checklist For Later Phase

Use in **`D3M-Payments-FastSpring-Test-Order-Manual-Execution`** only:

- [ ] User confirms test/trial mode
- [ ] User selects Dreemi Individual — Monthly
- [ ] User verifies product path/name (`dreemi-individual-monthly`)
- [ ] User verifies USD 4.99
- [ ] User verifies monthly interval
- [ ] User confirms no Live mode
- [ ] User follows only official FastSpring test-mode payment instructions
- [ ] User records only safe evidence per evidence policy
- [ ] User does not paste order/customer/payment IDs
- [ ] User stops if any forbidden condition appears

## What Was Not Done In This Phase

No checkout opened.
No test order executed.
No real payment attempted.
No API/webhook configured.
No entitlement mapping implemented.
No database write.
No env/secrets touched.
No FastSpring dashboard change.
No activation request.

## Blocker Register

| Blocker | Area | Severity | Current Status | Required Evidence | Recommended Phase |
| --- | --- | --- | --- | --- | --- |
| Test order not executed | Provider validation | High | **OPEN** | Safe test-mode checkout PASS for P1 | Manual execution phase |
| Webhook integration not implemented | Integration | Critical | **OPEN** | Webhook plan + controlled test | Webhook integration plan |
| Entitlement runtime mapping not implemented | Runtime | Critical | **OPEN** | Event → plan mapping verified | Webhook + entitlement phase |
| Provider Live approval not complete | Provider | Critical | **OPEN** | Live approval evidence | Activation checklist |
| Payout not activated | Payout | Critical | **OPEN** | Payout readiness | Post-Live phase |
| Tax/KYC not completed | Legal/tax | Critical | **OPEN** | Tax profile evidence | Activation checklist |
| Refund wording finalization pending | Legal | Medium | **OPEN** | Final public refund text | Legal/Terms review |
| Production DB uptime decision pending | Infra | High | **OPEN** | Uptime decision | `D3M-Infra-Database-Uptime-Decision` |
| Production billing NO-GO | Billing | Critical | **BLOCKED** | Full payment path | Multiple phases |

## Payment Readiness Impact

This test order plan improves control over the next provider-side validation step, but it does not enable production billing.

Production billing remains **NO-GO** until a safe test checkout is executed, webhook integration is implemented, entitlement mapping is verified, provider Live approval is complete, payout readiness is complete, and production infrastructure blockers are resolved.

## Launch Gate Impact

| Gate | Status |
| --- | --- |
| Test order planning gate | **PASS** |
| Actual test checkout gate | **BLOCKED / NOT_EXECUTED** |
| Webhook gate | **BLOCKED** |
| Entitlement runtime gate | **BLOCKED** |
| Live billing gate | **BLOCKED** |
| Payout gate | **BLOCKED** |
| Production billing | **NO-GO** |

## Recommended Next Phase

**Primary:** `D3M-Payments-FastSpring-Test-Mode-Support-Question` — resolve blockers from follow-up (`docs/D3M_FASTSPRING_TEST_ORDER_FOLLOWUP.md`)

**Alternative:** `D3M-Payments-FastSpring-Checkout-Currency-Override-Decision` — decide USD override before retry

## Notes For Next Chat

- Do not execute test order until manual execution phase is explicitly approved.
- First test scope: `dreemi-individual-monthly` only.
- Runtime checkout remains fail-closed; Plan screen / pricing buttons must not enable live purchase.
- Follow `docs/D3M_FASTSPRING_TEST_ORDER_EVIDENCE_POLICY.md` for any future evidence recording.
- Do not paste order IDs, checkout URLs, or buyer PII into repo or chat.
- Manual execution **BLOCKED** — `docs/D3M_FASTSPRING_TEST_ORDER_MANUAL_EXECUTION.md`.
- Follow-up **COMPLETE** — `docs/D3M_FASTSPRING_TEST_ORDER_FOLLOWUP.md` (SAR likely localization; test-mode payment unresolved).

## Related Artifacts

- Evidence policy: `docs/D3M_FASTSPRING_TEST_ORDER_EVIDENCE_POLICY.md`
- Catalog: `docs/D3M_FASTSPRING_CATALOG_DASHBOARD_SETUP_RECORD.md`
- Website alignment: `docs/D3M_FASTSPRING_WEBSITE_PRICING_ALIGNMENT.md`
- Activation: `docs/D3M_FASTSPRING_ACTIVATION_CHECKLIST.md`
