# D3M FastSpring Trial Store Setup Record

## Status

This is a docs-only FastSpring trial store setup record.

A FastSpring store exists in **testing/trial mode**.

FastSpring store is **not Live**.

No FastSpring product/subscription was created in this phase.
No checkout/test order was executed in this phase.
No API/webhook integration was executed.
No payout account was activated in this phase.
No tax profile was submitted in this phase.
No env/secrets were read, printed, verified, or modified.

Production billing remains **NO-GO**.

## Purpose

- Record user-observed FastSpring trial/test store state after manual dashboard access.
- Convert official FastSpring setup/activation guidance into a Dreemi-specific readiness checklist.
- Define safe dashboard rules (no secrets, no bank/tax/identity data in repo).
- Register payment/launch gates for trial store vs Live production readiness.

## Current Baseline

- Latest stable commit: `bac08d8 Record Supabase inactivity warning`
- Primary payment candidate: **FastSpring**
- Backup candidate: **Creem**
- Lemon Squeezy: **REJECTED / NOT ACTIVE**
- Prior preflight contact: `docs/D3M_FASTSPRING_CONTACT_FORM_SUBMISSION_RECORD.md`

## Source Availability

| Source | Status |
| --- | --- |
| User-observed FastSpring dashboard (trial mode) | Available (summary only) |
| Official FastSpring setup checklist | Referenced — https://developer.fastspring.com/docs/setup-checklist |
| `docs/D3M_ENTITY_AND_PAYOUT_DECISION.md` | Available |
| `docs/D3M_PAYMENT_PRICING_AND_REFUND_DECISION.md` | Available |
| FastSpring API credentials / account IDs | **Not recorded** (forbidden) |
| `.env` / webhook secrets | **Not inspected** (forbidden) |

## Explicit Non-Goals

- No product/subscription creation in dashboard.
- No test order or live payment.
- No checkout, webhook, or API configuration.
- No User Agreement signing, tax profile submission, or payout activation.
- No Live activation request.
- No runtime/code/env integration changes.
- No screenshots or sensitive dashboard values in repo.

## Observed FastSpring Store State

| Field | Value |
| --- | --- |
| Dashboard reachable | Yes (user manual observation) |
| Store mode | **Testing / trial mode** |
| Live mode | **Not active** |
| Activation review | **Pending minimum requirements** |

**Dashboard message observed (paraphrased):**

> This Store is currently in testing/trial mode. Once you have met the minimum requirements for Store activation, we will automatically review your account. Please allow up to 1-3 business days.

No sensitive account IDs, seller IDs, payout IDs, or private contact values were recorded.

## Official Activation Context

Per FastSpring setup/activation guidance (see [FastSpring setup checklist](https://developer.fastspring.com/docs/setup-checklist)):

- Store starts in **Test mode**.
- **Live** activation requires store configuration, website preparation, and activation/final review.
- At least **one product or subscription offering** must be created.
- Product names and unit prices should **match the public website**.
- **Business details**, **User Agreement**, **tax profile**, and **verification documents** are part of activation readiness.
- A **test order** may be required in Test mode before Live activation.
- **Payout activation** comes after Live approval — do not treat payout as complete until FastSpring approves the store.

## What Was Not Done

- No live payment.
- No test order.
- No product/subscription creation.
- No price/catalog setup.
- No checkout configuration.
- No webhook/API configuration.
- No User Agreement signing.
- No tax profile submission.
- No payout activation.
- No bank/PayPal/tax/identity details copied to repo.
- No screenshot committed.

## Safe Dashboard Rules

Future FastSpring dashboard work must follow these rules:

- Do **not** copy bank details into repo or chat.
- Do **not** copy PayPal private details into repo or chat.
- Do **not** copy tax IDs or identity document numbers into repo or chat.
- Do **not** commit screenshots.
- Do **not** commit API keys or webhook secrets.
- Do **not** create products/prices until a dedicated checklist phase approves catalog setup.
- Do **not** run test orders until a dedicated test-mode phase.
- Do **not** request Live activation until all gates and checklist items are ready.
- Record **status and decisions only** — never record secret or sensitive identifiers.

## Store Activation Readiness Areas

| Area | Required Later? | Current Status | Risk | Next Phase |
| --- | --- | --- | --- | --- |
| Catalog/product setup | Yes | **Not configured** | Activation blocked | `D3M-Payments-FastSpring-Catalog-Plan` |
| Subscription/pricing setup | Yes | **Not configured** | Website/catalog mismatch risk | Catalog plan + activation checklist |
| Fulfillment strategy | Yes | **Not decided in dashboard** | Entitlement mapping risk | Activation checklist |
| Website Terms/Privacy/Refund visibility | Yes | **Partial** — Terms/Privacy live; refund wording draft | Compliance review risk | Legal/Terms + activation checklist |
| Business details | Yes | **Incomplete** | KYC delay | Manual dashboard (outside repo) |
| User Agreement | Yes | **Not signed** | Activation blocked | Manual dashboard (outside repo) |
| Tax profile | Yes | **Not submitted** | Activation blocked | Manual dashboard (outside repo) |
| Identity/KYC verification | Yes | **Not completed** | Activation blocked | Manual dashboard (outside repo) |
| Test checkout/order | Yes | **Not executed** | Live gate blocked | Dedicated test-mode phase |
| Webhook/API integration | Yes | **Not implemented** | Runtime billing blocked | Dedicated integration phase |
| Entitlement integration | Yes | **Not verified** | Paid access risk | Post-integration phase |
| Live activation request | Yes | **Not requested** | Store remains Test | After checklist complete |
| Payout activation | Yes | **Not activated** | No payout until Live | After Live approval |

## Product / Subscription Setup Requirements

Planned Dreemi catalog (from entity/pricing decisions — configure in dashboard only in approved phase):

| Plan | Billing | Target price (USD) | Launch status |
| --- | --- | --- | --- |
| Individual | Monthly | 4.99 | Launch-critical |
| Individual | Yearly | 47.90 | Launch-critical |
| Family | Monthly | 9.99 | Launch-critical |
| Family | Yearly | 95.90 | Launch-critical |
| School | — | Deferred | Not launch-critical |

Requirements before Live:

- Product/subscription names and prices must match public website pricing page.
- School plan remains deferred unless explicitly enabled later.

## Website Compliance Requirements

| Item | Public URL / status | FastSpring alignment |
| --- | --- | --- |
| Website | https://www.dreemi.app/ | Required for review |
| Privacy | https://www.dreemi.app/en/privacy | Required |
| Terms | https://www.dreemi.app/en/terms | Required |
| Refund policy | Draft / pending final wording | Must be finalized before Live |
| Support contact | contact@dreemi.app | Required |
| Demo (if requested) | Google Drive link on file in preflight docs | Already verified before preflight send |

## Business / Tax / Verification Requirements

- Individual / natural person seller path (Saudi Arabia) documented in `docs/D3M_ENTITY_AND_PAYOUT_DECISION.md`.
- Payout candidates: Saudi bank or PayPal — **configure only in dashboard when approved**; never copy details to repo.
- Tax/VAT posture: **LEGAL/TAX_CONFIRMATION_REQUIRED** before final tax profile submission.
- KYC/identity documents: complete manually in FastSpring dashboard when ready — **no document numbers in repo**.

## Test Mode Requirements

Before Live activation, FastSpring may require:

- At least one catalog item configured.
- Test-mode checkout or test order completed.
- Store configuration aligned with public website.

**Rule:** test orders only in a **dedicated test-mode phase** — not in this record phase.

## Live Activation Requirements

- Minimum FastSpring store requirements met (catalog, website, business/tax/KYC per FastSpring review).
- Automatic review after requirements met — allow **1–3 business days** per dashboard message.
- Dreemi checklist complete (see below).
- No Live request until payment/integration gates are intentionally opened in later phases.

## Payout Activation Requirements

- Payout activation is **after Live approval**.
- Do not treat payout as production-ready until FastSpring confirms Live store and payout path.
- Bank/PayPal setup remains manual dashboard work outside repo.

## Dreemi-Specific Activation Checklist

- [ ] Confirm FastSpring eligibility response / account status
- [ ] Configure Individual monthly subscription
- [ ] Configure Individual yearly subscription
- [ ] Configure Family monthly subscription
- [ ] Configure Family yearly subscription
- [ ] Keep School deferred unless explicitly enabled
- [ ] Verify public website pricing matches FastSpring catalog
- [ ] Verify Terms page
- [ ] Verify Privacy page
- [ ] Add/finalize Refund Policy wording
- [ ] Decide fulfillment approach for SaaS entitlement
- [ ] Decide checkout type: Web Checkout first unless later changed
- [ ] Run test checkout only in dedicated phase
- [ ] Configure webhooks only in dedicated integration phase
- [ ] Complete tax profile manually outside repo when ready
- [ ] Complete KYC/business verification manually outside repo when ready
- [ ] Request activation only after checklist completion
- [ ] Activate payout only after Live approval

See also: `docs/D3M_FASTSPRING_ACTIVATION_CHECKLIST.md`

## Blocker Register

| Blocker | Area | Severity | Current Status | Required Evidence | Recommended Phase |
| --- | --- | --- | --- | --- | --- |
| FastSpring eligibility still not explicitly confirmed | Provider | Critical | **OPEN** | Written eligibility/activation guidance | Response record + activation checklist |
| Store not Live | Provider | Critical | **OPEN** | Live store approval | Activation checklist |
| Catalog not configured | Catalog | Critical | **OPEN** | Products/subscriptions in Test | Catalog plan |
| Refund policy wording not final | Legal/website | High | **OPEN** | Final public refund text | Legal/Terms review |
| Tax profile not completed | Tax | High | **OPEN** | Tax profile submitted in dashboard | Manual dashboard + legal/tax |
| KYC/identity verification not completed | KYC | High | **OPEN** | FastSpring verification complete | Manual dashboard |
| Payout not activated | Payout | Critical | **OPEN** | Payout active post-Live | Post-Live phase |
| Webhook/API integration not implemented | Integration | Critical | **OPEN** | Controlled integration + smoke | Integration phase |
| Test order not executed | Test mode | High | **OPEN** | Test checkout evidence | Dedicated test-mode phase |
| Production billing NO-GO | Billing | Critical | **BLOCKED** | Live + integration + entitlement proof | Multiple phases |

## Payment Readiness Impact

FastSpring moved from **contact-only** to **trial/test store** state.

This is progress, but **not production readiness**.

Production billing remains **NO-GO** until store is Live, provider approval is complete, checkout/webhook integration is implemented, and entitlement mapping is verified.

## Launch Gate Impact

| Gate | Status |
| --- | --- |
| Payment provider gate | **PARTIAL** — trial/test store exists; Live not active |
| Checkout gate | **BLOCKED** — no checkout/test order/integration |
| Webhook gate | **BLOCKED** — not configured/tested |
| Payout gate | **BLOCKED** — not activated |
| Production billing | **NO-GO** |

## Recommended Next Phase

**Primary:** **`D3M-Payments-FastSpring-Activation-Checklist`** — prepare safe checklist for catalog, website, tax/KYC, test order, and activation review.

**Alternative:** **`D3M-Payments-FastSpring-Catalog-Plan`** — plan products/subscriptions before dashboard setup.

## Notes For Next Chat

- Trial/test store observed; **not Live**; activation review pending minimum requirements.
- **Follow-up:** catalog plan at `docs/D3M_FASTSPRING_CATALOG_PLAN.md`; no dashboard changes in catalog plan phase.
- Do not create catalog, run test orders, or request Live from repo phases without explicit phase approval.
- Do not copy bank/tax/identity/API secrets into docs.
- Production billing remains No-Go.

## Related Artifacts

- Activation checklist: `docs/D3M_FASTSPRING_ACTIVATION_CHECKLIST.md`
- Contact submission: `docs/D3M_FASTSPRING_CONTACT_FORM_SUBMISSION_RECORD.md`
- Manual send packet (historical): `docs/D3M_FASTSPRING_MANUAL_SEND_PACKET.md`
- Pricing/refund: `docs/D3M_PAYMENT_PRICING_AND_REFUND_DECISION.md`
