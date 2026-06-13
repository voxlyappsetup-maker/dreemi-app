# D3M FastSpring Activation Gap Audit

## Status

**COMPLETE** — docs-only activation gap audit. No dashboard, checkout, or provider actions performed.

**Follow-up (Refund Policy alignment):** Refund Policy visibility gap addressed by `docs/D3M_FASTSPRING_REFUND_POLICY_ALIGNMENT.md` — public `/refund` routes and footer links added.

**Follow-up (SaaS fulfillment decision):** Fulfillment gap addressed by `docs/D3M_FASTSPRING_SAAS_FULFILLMENT_DECISION.md` — Dreemi fulfillment is SaaS account entitlement, not file/license delivery.

**Follow-up (Test order manual execution):** Individual Monthly test attempted — **BLOCKED** (`docs/D3M_FASTSPRING_TEST_ORDER_MANUAL_EXECUTION.md`). Checkout reached in test mode; SAR 22.99 displayed (not USD 4.99); order not completed.

**Follow-up (Test order retry execution):** Individual Monthly test **PASS** (`docs/D3M_FASTSPRING_TEST_ORDER_RETRY_EXECUTION.md`). Test-mode order completed; localized SAR at checkout; Monthly confirmed.

This is a docs-only activation gap audit.
No checkout was opened.
No test order was executed.
No FastSpring dashboard change was made.
No FastSpring API call was made.
No webhook was configured.
No provider credentials were added.
No env/secrets were read, printed, verified, or modified.
No tax/KYC/payout action was performed.
No Live activation was requested.
Production billing remains **NO-GO**.

## Purpose

Compare Dreemi's current FastSpring-related state against FastSpring's published minimum activation requirements. Answer whether Dreemi is ready for automatic review/activation request, identify gaps, and define safe next phases — without executing any provider or runtime action.

## Current Baseline

- Latest stable commit: `ca466ab` — Add FastSpring test order plan
- FastSpring store: **testing/trial mode** (user-observed dashboard message still present after 3+ days with no written FastSpring response)
- Confirmed catalog (test/trial): Individual/Family monthly/yearly — USD prices aligned with website
- Website pricing alignment: **COMPLETE** (`docs/D3M_FASTSPRING_WEBSITE_PRICING_ALIGNMENT.md`)
- Test order plan: **COMPLETE** (`docs/D3M_FASTSPRING_TEST_ORDER_PLAN.md`); execution **NOT DONE**
- Runtime checkout: **fail-closed**; production billing **NO-GO**

## Source Availability

| Source | Available | Notes |
| --- | --- | --- |
| `docs/D3M_FASTSPRING_CATALOG_DASHBOARD_SETUP_RECORD.md` | Yes | Four subscriptions created in test/trial dashboard |
| `docs/D3M_FASTSPRING_WEBSITE_PRICING_ALIGNMENT.md` | Yes | Public pricing aligned; refund visibility partial |
| `docs/D3M_FASTSPRING_TEST_ORDER_PLAN.md` | Yes | Safe test-order plan; not executed |
| `docs/D3M_FASTSPRING_TEST_ORDER_EVIDENCE_POLICY.md` | Yes | Evidence rules |
| `docs/D3M_FASTSPRING_ACTIVATION_CHECKLIST.md` | Yes | Prior checklist; updated by this audit |
| `docs/D3M_FASTSPRING_TRIAL_STORE_SETUP_RECORD.md` | Yes | Trial store observed; not Live |
| `docs/D3M_PAYMENT_PRICING_AND_REFUND_DECISION.md` | Yes | 7-day refund decision; public wording pending |
| `docs/D3M_DATABASE_UPTIME_DECISION.md` | Yes | Production DB uptime decision pending |
| FastSpring dashboard live state (business/tax/KYC/User Agreement) | **Not verified in repo** | Manual dashboard only — no secrets in docs |
| FastSpring written eligibility response | **Not received** | User reported no response after 3+ days |

## Explicit Non-Goals

- Opening checkout or executing test orders
- FastSpring dashboard changes
- User Agreement signing, tax profile submission, KYC submission
- Live mode or payout activation
- Activation request email sent in this phase
- Webhook/API/runtime integration
- Env/secrets access

## User Question

The user asked whether Dreemi has completed the minimum FastSpring requirements for automatic review/activation after more than 3 days with no response and the store still showing testing/trial mode.

## Current FastSpring Dashboard Message

User-observed message (paraphrased — not copied from dashboard secrets):

```text
This Store is currently in testing/trial mode. Once you have met the minimum requirements for Store activation, we will automatically review your account. Please allow up to 1-3 business days.
```

**Audit note:** The message indicates automatic review is conditional on meeting minimum requirements. Lack of response after 3+ days is consistent with **requirements not yet fully met** and/or **no activation request to a representative** — not proof of rejection.

## FastSpring Activation Requirement Summary

Official guidance groups activation into three areas:

### Configure store

- Create at least one offering
- Configure products/subscriptions, pricing, and names
- Ensure product names and unit prices match the public website
- Assign fulfillment actions where applicable
- Complete business details
- Sign the FastSpring User Agreement
- Complete tax profile
- Prepare business/identity verification

### Prepare website

- Add clear Terms and Conditions, Privacy Policy, and Refund Policy links
- Match website product names/prices with FastSpring catalog
- Choose checkout style
- Place a test order in Test mode

### Request activation

- Contact the FastSpring representative
- Complete final review / KYC
- Switch to Live only after approval
- Activate payout account after Live approval

## Current Dreemi Completion Summary

| Area | Summary |
| --- | --- |
| Store mode | Testing/trial — not Live |
| Catalog | **Complete** — four planned subscriptions |
| Website pricing | **Complete** — matches catalog |
| Website legal | **Partial** — Terms/Privacy/Refund linked; SaaS fulfillment documented; business items remain |
| Fulfillment | **Not resolved** for FastSpring activation review |
| Test order | **PASS on retry** (Individual Monthly, test mode) | `docs/D3M_FASTSPRING_TEST_ORDER_RETRY_EXECUTION.md` |
| Business/tax/KYC/User Agreement | **Not documented as complete** |
| Activation request | **Not sent** after requirements completion |
| Dreemi runtime integration | **Not implemented** (webhooks, entitlements) |
| Payout | **Not activated** |

## Minimum Requirements Matrix

See also `docs/D3M_FASTSPRING_MINIMUM_REQUIREMENTS_MATRIX.md`.

| Requirement Area | FastSpring Requirement | Dreemi Current Status | Evidence | Gap | Severity | Next Action |
| --- | --- | --- | --- | --- | --- | --- |
| Catalog/offering created | ≥1 offering configured | **Complete** — 4 subscriptions | Catalog dashboard setup record | None for launch SKUs | — | Maintain catalog parity |
| Product names/prices match website | Names/prices match public site | **Complete** | Website pricing alignment doc | None for Individual/Family | — | Re-verify after any price change |
| Website Terms page | Clear Terms link | **Likely met** — localized `/terms`; expected public URL documented | Pricing footer; decision pack URLs | Public production URL not re-verified in this audit | Low | Confirm live Terms link in Refund Policy phase |
| Website Privacy page | Clear Privacy link | **Likely met** — localized `/privacy` | Pricing footer; decision pack URLs | Public production URL not re-verified in this audit | Low | Confirm live Privacy link in Refund Policy phase |
| Refund Policy visibility | Clear Refund Policy link/section | **Complete** — public `/refund` (en/ar/fr); footer links | `docs/D3M_FASTSPRING_REFUND_POLICY_ALIGNMENT.md` | Addressed in follow-up phase | — | Re-verify public URLs at deploy |
| Fulfillment decision for SaaS | Assign fulfillment where applicable | **Complete** — SaaS account entitlement documented | `docs/D3M_FASTSPRING_SAAS_FULFILLMENT_DECISION.md` | Addressed in follow-up phase | — | Do not configure file/license fulfillment in dashboard |
| Checkout style | Choose checkout approach | **Planned** — Web Checkout first (docs) | Catalog plan | Not confirmed in dashboard for activation | Medium | Confirm Web Checkout in dashboard when manually ready |
| Test order | Test-mode order | **PASS on retry** — localized SAR; Monthly confirmed | Retry execution record | Localized currency noted | Low | Activation request phase |
| Business details | Complete in dashboard | **Unverified / not documented complete** | Entity/payout docs (high level) | Cannot claim complete from repo | **Critical** | Manual dashboard completion outside repo |
| User Agreement | Sign in FastSpring | **Not documented as signed** | — | Unknown completion | **Critical** | Sign manually when ready |
| Tax profile | Complete tax profile | **Not documented as submitted** | Tax posture pending legal review | Unknown completion | **Critical** | Submit manually when legal/tax ready |
| KYC/identity/business verification | Prepare and complete verification | **Not documented as complete** | Preflight/entity docs | Unknown completion | **Critical** | Prepare docs manually outside repo |
| Activation request/contact representative | Contact rep after requirements met | **Not sent** (preflight demo form submitted earlier; not activation request) | Contact form submission record | No post-requirements activation request | **High** | Activation request email phase |
| Live mode | Live only after approval | **Not enabled** | Trial store record | Expected — not a gap until prior steps done | — | Do not enable until approved |
| Payout account | Activate after Live approval | **Not activated** | — | Expected pre-Live | — | Post-Live manual step |
| Webhook/runtime integration | Not FastSpring minimum for store review, but Dreemi production blocker | **Not implemented** | Payment track reconciliation | Production billing blocked | **Critical** (Dreemi) | Webhook integration plan phase |
| Entitlement mapping | Dreemi production blocker | **Not implemented** | Entitlement docs | No purchase → plan mapping | **Critical** (Dreemi) | Webhook + entitlement phase |

## Completed Items

- FastSpring trial/test store exists.
- Four subscription offerings were created in test/trial catalog (`dreemi-individual-monthly/yearly`, `dreemi-family-monthly/yearly`).
- Website pricing matches FastSpring catalog (Individual/Family monthly/yearly USD prices).
- School is deferred and not created in FastSpring or as a paid website SKU.
- Test order plan exists (`docs/D3M_FASTSPRING_TEST_ORDER_PLAN.md`).
- Evidence policy exists (`docs/D3M_FASTSPRING_TEST_ORDER_EVIDENCE_POLICY.md`).
- Runtime checkout remains fail-closed; Pro not purchasable from Dreemi app.
- Terms, Privacy, and Refund Policy routes linked on pricing footer (localized internal routes; public URLs documented).
- Support contact documented: contact@dreemi.app.
- Preflight/demo contact submitted 2026-06-07 (not equivalent to activation request after requirements met).

## Incomplete / Unverified Items

- Individual Monthly test checkout **PASS on retry** in test mode (`docs/D3M_FASTSPRING_TEST_ORDER_RETRY_EXECUTION.md`); first attempt BLOCKED.
- Fulfillment action/decision for SaaS is documented for activation review (`docs/D3M_FASTSPRING_SAAS_FULFILLMENT_DECISION.md`).
- Business details are not documented as complete in FastSpring dashboard.
- FastSpring User Agreement is not documented as signed.
- Tax profile is not documented as submitted.
- KYC/business/identity verification readiness is not documented as complete.
- Activation request has not been sent after requirements completion.
- Live mode is not enabled (expected until approval).
- Payout is not activated (expected until post-Live).
- Webhook/runtime entitlement integration is not implemented (Dreemi production blocker).
- FastSpring written eligibility/onboarding response not received (user-reported 3+ days).
- Production database uptime decision still pending (`docs/D3M_DATABASE_UPTIME_DECISION.md`).

## Activation Readiness Verdict

**Verdict: PARTIAL / NOT READY FOR ACTIVATION REQUEST YET.**

**Reason:** Dreemi has completed catalog setup, website pricing alignment, Refund Policy visibility, SaaS fulfillment decision, and a successful Individual Monthly test checkout retry (PASS). Open items include business/User Agreement/tax/KYC readiness and activation request to the FastSpring representative.

**Answer to user question:** Dreemi has **not** fully met FastSpring's minimum requirements for activation review. Catalog and website pricing alignment are complete; remaining gaps explain why the store may still show testing/trial mode without automatic review completion.

## Required Before Contacting FastSpring For Activation

Ordered checklist (manual + docs phases):

- [ ] Confirm Terms page is public and linked
- [ ] Confirm Privacy page is public and linked
- [ ] Add or confirm clear Refund Policy link/section
- [x] Decide SaaS fulfillment handling for FastSpring activation review — `docs/D3M_FASTSPRING_SAAS_FULFILLMENT_DECISION.md`
- [ ] Confirm checkout style: Web Checkout first
- [ ] Execute one safe test-mode order for Individual Monthly (`dreemi-individual-monthly`)
- [ ] Complete/sign User Agreement manually in FastSpring when ready
- [ ] Complete Tax Profile manually in FastSpring when ready
- [ ] Prepare KYC/identity/business verification documents manually outside repo
- [x] Draft activation request email to Louis/FastSpring representative — **draft ready** (`docs/D3M_FASTSPRING_ACTIVATION_REQUEST_EMAIL.md`); not sent
- [ ] Send activation request only after manual review; record in sent-record phase

## Safe Next Actions

Recommended sequence:

1. ~~**`D3M-Payments-FastSpring-Refund-Policy-Alignment`**~~ — **complete**
2. ~~**`D3M-Payments-FastSpring-SaaS-Fulfillment-Decision`**~~ — **complete**
3. ~~**`D3M-Payments-FastSpring-Test-Order-Manual-Execution`**~~ — **attempted — BLOCKED** (see `docs/D3M_FASTSPRING_TEST_ORDER_MANUAL_EXECUTION.md`)
4. ~~**`D3M-Payments-FastSpring-Test-Order-Followup`**~~ — **complete** (`docs/D3M_FASTSPRING_TEST_ORDER_FOLLOWUP.md`)
5. ~~**`D3M-Payments-FastSpring-Test-Mode-Support-Question`**~~ — resolved by successful retry (optional support still available)
6. ~~**`D3M-Payments-FastSpring-Activation-Request-Email`**~~ — **draft complete** (`docs/D3M_FASTSPRING_ACTIVATION_REQUEST_EMAIL.md`)
7. **`D3M-Payments-FastSpring-Activation-Request-Sent-Record`** — after user sends manually

Do **not** request Live activation or enable payouts until FastSpring approves and Dreemi webhook/entitlement phases are scoped separately.

## What Was Not Done

No checkout opened.
No test order executed.
No dashboard changes.
No API/webhook configured.
No entitlement mapping implemented.
No tax/KYC submitted.
No User Agreement signed.
No payout activated.
No Live activation requested.

## Blocker Register

| Blocker | Area | Severity | Current Status | Required Evidence | Recommended Phase |
| --- | --- | --- | --- | --- | --- |
| Refund Policy visibility not confirmed | Website/legal | High | **CLOSED** | Public refund routes/links | — |
| SaaS fulfillment decision missing | Catalog/activation | High | **CLOSED** | Documented SaaS entitlement decision | Test order or webhook plan |
| Actual test order not executed | Provider validation | High | **CLOSED — PASS on retry** | Retry execution record | Activation request |
| Checkout currency/localization decision pending | Test evidence | High | **PARTIAL** | Localized SAR accepted for retry evidence | Optional override if FastSpring requires USD |
| Test-mode payment support unclear | Test checkout | Critical | **CLOSED on retry** | Test order completed in test mode | — |
| User Agreement not documented as signed | Provider/legal | Critical | **OPEN** | Dashboard completion (manual) | Manual dashboard (outside repo) |
| Tax profile not documented as completed | Provider/tax | Critical | **OPEN** | Tax profile submitted (manual) | Manual dashboard (outside repo) |
| KYC readiness not documented | Provider/KYC | Critical | **OPEN** | KYC docs submitted (manual) | Manual dashboard (outside repo) |
| Activation request not sent | Provider comms | High | **OPEN** | Post-requirements email sent | Activation request email |
| Webhook integration not implemented | Dreemi runtime | Critical | **OPEN** | Webhook plan + tests | Webhook integration plan |
| Entitlement mapping not implemented | Dreemi runtime | Critical | **OPEN** | Event → plan mapping | Webhook + entitlement phase |
| Payout not activated | Payout | Critical | **OPEN** | Post-Live payout active | Post-Live manual step |
| Production DB uptime decision pending | Infra | High | **OPEN** | Uptime decision | Database uptime decision |
| Production billing NO-GO | Billing | Critical | **BLOCKED** | Full payment path | Multiple phases |

## Payment Readiness Impact

The audit clarifies that Dreemi is not yet fully activation-ready despite completing catalog and website pricing alignment. Production billing remains **NO-GO** until the remaining FastSpring activation requirements, test checkout, webhook/entitlement integration, Live approval, payout readiness, and infrastructure blockers are resolved.

## Launch Gate Impact

| Gate | Status |
| --- | --- |
| Activation gap audit gate | **PASS** |
| FastSpring minimum requirements | **PARTIAL** |
| Actual test checkout gate | **BLOCKED / NOT_EXECUTED** |
| Business/tax/KYC readiness gate | **BLOCKED / UNVERIFIED** |
| Webhook gate | **BLOCKED** |
| Entitlement runtime gate | **BLOCKED** |
| Live billing gate | **BLOCKED** |
| Payout gate | **BLOCKED** |
| Production billing | **NO-GO** |

## Recommended Next Phase

**Primary:** `D3M-Payments-FastSpring-Activation-Request-Sent-Record` — after user sends activation email manually

**Alternative:** `D3M-Payments-FastSpring-Webhook-Integration-Plan` — plan webhook and entitlement mapping before runtime implementation

## Notes For Next Chat

- Do not interpret "1–3 business days" as elapsed approval time while requirements remain partial.
- Preflight Request Demo (2026-06-07) ≠ post-requirements activation request.
- Do not paste dashboard secrets, tax IDs, or KYC details into repo/chat.
- Even after FastSpring store activation, Dreemi production billing stays NO-GO until webhook/entitlement/runtime gates pass.
- User-reported no FastSpring response after 3+ days: follow up only after closing documented gaps or sending a structured activation request.

## Related Artifacts

- Matrix: `docs/D3M_FASTSPRING_MINIMUM_REQUIREMENTS_MATRIX.md`
- Test order: `docs/D3M_FASTSPRING_TEST_ORDER_PLAN.md`
- Catalog: `docs/D3M_FASTSPRING_CATALOG_DASHBOARD_SETUP_RECORD.md`
- Website: `docs/D3M_FASTSPRING_WEBSITE_PRICING_ALIGNMENT.md`
