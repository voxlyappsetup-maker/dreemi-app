# D3M FastSpring Catalog Dashboard Setup Record

## Status

This is a manual FastSpring test/trial catalog setup record.

Repository changes are **docs-only**.

**Manual setup result: NOT_STARTED** — user safe confirmations were not received in this phase session; dashboard catalog creation status is unconfirmed.

No runtime code was changed.
No checkout/test order was executed.
No API/webhook integration was executed.
No FastSpring Live activation was requested.
No payout, tax, KYC, bank, PayPal, or identity details were recorded in the repository.

Production billing remains **NO-GO**.

## Purpose

- Guide manual creation of four planned subscription offerings in FastSpring test/trial dashboard.
- Record safe user-reported setup results without secrets or sensitive IDs.
- Update payment readiness posture after catalog dashboard work.

## Current Baseline

- Latest stable commit: `1c992f7 Add FastSpring catalog plan`
- Catalog plan: `docs/D3M_FASTSPRING_CATALOG_PLAN.md`
- Dashboard checklist: `docs/D3M_FASTSPRING_CATALOG_DASHBOARD_SETUP_CHECKLIST.md`

## Source Availability

| Source | Status |
| --- | --- |
| `docs/D3M_FASTSPRING_CATALOG_PLAN.md` | Available |
| `docs/D3M_FASTSPRING_CATALOG_DASHBOARD_SETUP_CHECKLIST.md` | Available |
| User safe dashboard confirmations | **Not received** in this phase session |
| FastSpring dashboard (Cursor access) | **Not accessed** (forbidden) |

## Explicit Non-Goals

- No Live mode, checkout, test order, API/webhook credentials.
- No payout, tax profile, User Agreement, or KYC in this phase.
- No runtime integration or entitlement code changes.
- No secrets, screenshots, or private account IDs in repo.

## Manual Dashboard Work Model

1. User opens FastSpring dashboard in **test/trial mode** manually.
2. User creates only the four planned subscription offerings (see below).
3. User reports **safe facts only** back to Cursor (created/not created, public name, path/ID if matches plan, price, currency, interval, non-sensitive blocker text).
4. Cursor updates this record and tracking docs — **no dashboard access from repo**.

## Planned Offerings

| Offering | Planned Product ID / Path | Type | Price | Currency | Billing Interval | Internal Plan | Expected Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Dreemi Individual — Monthly | `dreemi-individual-monthly` | Subscription | USD 4.99 | USD | Monthly | INDIVIDUAL | Launch |
| Dreemi Individual — Yearly | `dreemi-individual-yearly` | Subscription | USD 47.90 | USD | Yearly | INDIVIDUAL | Launch |
| Dreemi Family — Monthly | `dreemi-family-monthly` | Subscription | USD 9.99 | USD | Monthly | FAMILY | Launch |
| Dreemi Family — Yearly | `dreemi-family-yearly` | Subscription | USD 95.90 | USD | Yearly | FAMILY | Launch |

## Manual Setup Result

**NOT_STARTED**

Do not mark **COMPLETE** until the user confirms all four offerings were created with correct name, price, currency, and interval, and all safety boundaries below are confirmed.

## Offering Setup Results

| Offering | Created? | Observed Public Name | Observed Product Path / ID | Observed Price | Observed Currency | Observed Billing Interval | Internal Plan | Result | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Dreemi Individual — Monthly | Pending | — | `dreemi-individual-monthly` (planned) | USD 4.99 (planned) | USD | Monthly | INDIVIDUAL | Pending | Awaiting user confirmation |
| Dreemi Individual — Yearly | Pending | — | `dreemi-individual-yearly` (planned) | USD 47.90 (planned) | USD | Yearly | INDIVIDUAL | Pending | Awaiting user confirmation |
| Dreemi Family — Monthly | Pending | — | `dreemi-family-monthly` (planned) | USD 9.99 (planned) | USD | Monthly | FAMILY | Pending | Awaiting user confirmation |
| Dreemi Family — Yearly | Pending | — | `dreemi-family-yearly` (planned) | USD 95.90 (planned) | USD | Yearly | FAMILY | Pending | Awaiting user confirmation |

## Deferred / Not Created Items

| Item | Expected | Status |
| --- | --- | --- |
| School plan (`dreemi-school`) | **Do not create** | Assumed not created — confirm with user |
| Free plan product | **Do not create** | Assumed not created — confirm with user |
| One-time purchase products | **Do not create** | Assumed not created — confirm with user |

## Safety Confirmations

Pending user confirmation:

- [ ] No Live mode enabled
- [ ] No checkout/test order executed
- [ ] No API keys created
- [ ] No webhook secrets created
- [ ] No payout activation
- [ ] No tax profile submission
- [ ] No KYC/identity details copied
- [ ] No bank/PayPal private details copied
- [ ] No secrets committed
- [ ] No runtime code changed
- [ ] School plan not created

## What Was Not Done

- No live payment
- No test order
- No checkout integration
- No webhook/API integration
- No entitlement runtime update
- No activation request
- No payout activation
- No tax/KYC submission
- No confirmed dashboard catalog creation (status unconfirmed)

## Dashboard Blockers / Deviations

None recorded — user confirmations not received.

If FastSpring requires different path formatting than planned IDs, record the **safe public path only** (no private internal IDs) in a follow-up update.

## Catalog Consistency Review

Future activation requires **website pricing to match the FastSpring catalog**.

Website pricing alignment remains a **separate phase** unless already verified.

Reference: `D3M-Payments-FastSpring-Website-Pricing-Alignment`

## Entitlement Mapping Review

| FastSpring offering (when created) | Internal plan |
| --- | --- |
| Individual monthly/yearly | INDIVIDUAL |
| Family monthly/yearly | FAMILY |
| No active paid subscription | FREE |
| School (deferred) | SCHOOL — not created |

No runtime implementation in this phase.

## Payment Readiness Impact

Catalog dashboard setup **does not enable production billing** until completed and verified.

Production billing remains **NO-GO** until provider approval, website alignment, test checkout, webhook integration, entitlement mapping, and Live activation are complete.

## Launch Gate Impact

| Gate | Status |
| --- | --- |
| Catalog gate | **NOT_STARTED** — no confirmed manual dashboard evidence |
| Checkout gate | **BLOCKED** |
| Webhook gate | **BLOCKED** |
| Entitlement runtime gate | **BLOCKED** |
| Payout gate | **BLOCKED** |
| Live billing gate | **BLOCKED** |
| Production billing | **NO-GO** |

## Blocker Register

| Blocker | Area | Severity | Current Status | Required Evidence | Recommended Phase |
| --- | --- | --- | --- | --- | --- |
| Catalog setup not confirmed | Catalog | Critical | **OPEN** | User safe confirmations + offering table filled | This phase follow-up or **`D3M-Payments-FastSpring-Catalog-Dashboard-Setup-Followup`** |
| Website pricing alignment pending | Website | High | **OPEN** | Public pricing matches catalog | Website pricing alignment |
| Refund wording finalization pending | Legal | High | **OPEN** | Final public refund text | Legal/Terms review |
| Test checkout not executed | Test mode | High | **OPEN** | Test-mode checkout evidence | Test order plan |
| Webhook/API integration not implemented | Integration | Critical | **OPEN** | Controlled integration | Integration phase |
| Entitlement runtime mapping not implemented | Runtime | Critical | **OPEN** | Webhook → plan mapping | Integration phase |
| FastSpring Live activation not complete | Provider | Critical | **OPEN** | Live approval | Activation checklist |
| Payout not activated | Payout | Critical | **OPEN** | Post-Live payout | Post-Live phase |
| Production billing NO-GO | Billing | Critical | **BLOCKED** | Full payment path | Multiple phases |

## Recommended Next Phase

**If user completes dashboard setup:** update this record to COMPLETE/PARTIAL, then **`D3M-Payments-FastSpring-Website-Pricing-Alignment`**.

**If setup incomplete or blocked:** **`D3M-Payments-FastSpring-Catalog-Dashboard-Setup-Followup`**.

**Alternative after catalog complete:** **`D3M-Payments-FastSpring-Test-Order-Plan`**.

## Notes For Next Chat

User must confirm (safe facts only):

1. Were all four planned offerings created?
2. Public names exact or near-exact?
3. Prices exact (4.99, 47.90, 9.99, 95.90 USD)?
4. Currency USD?
5. Intervals monthly/yearly correct?
6. School not created?
7. Live mode not enabled?
8. No checkout/test order?
9. No API keys/webhooks created?
10. No tax/KYC/payout touched?
11. No secrets copied?

Do **not** paste API keys, webhook secrets, payout/bank/tax/identity details, or checkout URLs.

## Manual Dashboard Instructions (User)

Create **only** these four subscriptions in FastSpring **test/trial** mode:

1. **Dreemi Individual — Monthly** — path `dreemi-individual-monthly`, USD 4.99, monthly
2. **Dreemi Individual — Yearly** — path `dreemi-individual-yearly`, USD 47.90, yearly
3. **Dreemi Family — Monthly** — path `dreemi-family-monthly`, USD 9.99, monthly
4. **Dreemi Family — Yearly** — path `dreemi-family-yearly`, USD 95.90, yearly

**Do not create:** School, free products, one-time products, or run checkout/test orders.

**Do not touch:** Live mode, payouts, tax, KYC, API credentials, webhooks, activation request.

## Related Artifacts

- Catalog plan: `docs/D3M_FASTSPRING_CATALOG_PLAN.md`
- Setup checklist: `docs/D3M_FASTSPRING_CATALOG_DASHBOARD_SETUP_CHECKLIST.md`
