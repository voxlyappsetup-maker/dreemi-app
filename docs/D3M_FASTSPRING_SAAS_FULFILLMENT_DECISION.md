# D3M FastSpring SaaS Fulfillment Decision

## Status

This is a docs-only SaaS fulfillment decision record.

No FastSpring dashboard change was made.

No fulfillment action was configured in FastSpring.

No checkout was opened.

No test order was executed.

No FastSpring API call was made.

No webhook was configured.

No provider credentials were added.

No env/secrets were read, printed, verified, or modified.

No tax/KYC/payout action was performed.

No Live activation was requested.

Production billing remains **NO-GO**.

## Purpose

Define how Dreemi should describe and handle FastSpring fulfillment as a SaaS subscription product for activation review, without configuring dashboard fulfillment, checkout, webhooks, or runtime entitlement changes in this phase.

## Current Baseline

Latest stable commit: `2f4ef4e` Align FastSpring refund policy visibility

Prior activation state: FastSpring trial/test store exists; catalog and website pricing aligned; Refund Policy public; test order planned but not executed; runtime checkout fail-closed; production billing **NO-GO**.

## Source Availability

| Source | Available | Notes |
| --- | --- | --- |
| `docs/D3M_FASTSPRING_CATALOG_PLAN.md` | Yes | SaaS access note; proposed product paths |
| `docs/D3M_FASTSPRING_CATALOG_DASHBOARD_SETUP_RECORD.md` | Yes | Four launch subscriptions created in test/trial dashboard |
| `docs/D3M_FASTSPRING_ACTIVATION_GAP_AUDIT.md` | Yes | Fulfillment decision was open |
| `docs/D3M_FASTSPRING_REFUND_POLICY_ALIGNMENT.md` | Yes | Refund Policy visibility complete |
| `docs/D3M_FASTSPRING_TEST_ORDER_PLAN.md` | Yes | Safe test checkout plan; no execution |
| `docs/D3M_FASTSPRING_TEST_ORDER_EVIDENCE_POLICY.md` | Yes | Evidence rules; no secrets |
| `docs/D3M_PAYMENT_TRACK_STATE_RECONCILIATION.md` | Yes | Runtime payment unavailable/fail-closed |
| `docs/ENTITLEMENT_MODEL_DESIGN_LOCK.md` | Assumed | Provider-neutral entitlement direction (not re-opened here) |

## Explicit Non-Goals

- No FastSpring dashboard fulfillment configuration
- No checkout or test order execution
- No webhook or API integration
- No runtime entitlement mapping implementation
- No production billing enablement
- No tax/KYC/payout/User Agreement actions
- No Live activation request

## Decision Summary

**Decision:** Dreemi fulfillment is SaaS access / subscription entitlement, not file delivery, license key delivery, download fulfillment, or static digital-good delivery.

FastSpring should be treated as the Merchant of Record and subscription/payment event source. Dreemi should grant or revoke internal plan entitlements only after secure runtime integration verifies provider events.

## Product Fulfillment Classification

Dreemi is an AI-assisted children's storytelling SaaS.

Customers buy access to app features and subscription limits.

Fulfillment means account access and entitlement state inside Dreemi.

Fulfillment does not mean delivering a downloadable file.

## What Dreemi Does Not Fulfill

- No downloadable software
- No file download
- No license key
- No PDF/e-book delivery
- No music/video/photo/media delivery
- No physical goods
- No marketplace seller payout
- No creator payout
- No one-time digital file product

## What Dreemi Does Fulfill

- Plan entitlement after verified subscription activation
- Subscription lifecycle handling
- Access to paid plan limits
- Individual plan entitlement
- Family plan entitlement
- Downgrade to Free when subscription is canceled/expired according to policy

## FastSpring Catalog Context

Launch offerings in the test/trial catalog:

| Product path | Price | Billing | Internal plan |
| --- | --- | --- | --- |
| `dreemi-individual-monthly` | USD 4.99 | Monthly | INDIVIDUAL |
| `dreemi-individual-yearly` | USD 47.90 | Yearly | INDIVIDUAL |
| `dreemi-family-monthly` | USD 9.99 | Monthly | FAMILY |
| `dreemi-family-yearly` | USD 95.90 | Yearly | FAMILY |

**School:** School remains deferred and should not be fulfilled through FastSpring at this stage.

## Fulfillment Decision For Activation Review

For FastSpring activation review, Dreemi should describe fulfillment as **SaaS account access**. After payment/subscription confirmation, the app will provide access to the purchased plan through the user's Dreemi account. No downloadable product is delivered.

Until checkout/webhook integration is implemented and reviewed, the production app must remain fail-closed and must not automatically grant paid entitlements.

## Future Entitlement Fulfillment Model

| FastSpring State / Event | Dreemi Internal Result | Plan | Notes |
| --- | --- | --- | --- |
| Subscription active for `dreemi-individual-monthly` or `dreemi-individual-yearly` | Grant/maintain paid access | INDIVIDUAL | After verified webhook/event only |
| Subscription active for `dreemi-family-monthly` or `dreemi-family-yearly` | Grant/maintain paid access | FAMILY | After verified webhook/event only |
| Subscription canceled or expired | Downgrade effective entitlement | FREE | Per subscription policy and provider timing |
| Unknown product path / SKU | Reject; no entitlement update | — | Fail closed |
| Refund / chargeback / payment failure | Policy decision required before implementation | — | Must not leave stale paid access without explicit policy |

See also: `docs/D3M_FASTSPRING_FULFILLMENT_TO_ENTITLEMENT_MAPPING.md`

## Webhook Dependency

Automated fulfillment depends on a future secure webhook integration.

Webhook implementation must verify signatures before processing payloads.

Unknown product IDs must not update entitlements.

Webhook handling must fail closed.

No raw webhook payloads or secrets should be committed.

## Manual Activation / Test Mode Position

A future FastSpring test order may verify checkout display and provider-side order flow.

That test order should **not** grant Dreemi entitlement automatically because runtime integration is not implemented.

Any manual entitlement change during testing must remain outside production billing and outside automated fulfillment until webhook integration is reviewed and approved.

## Dashboard Configuration Guidance

- Do not configure file download fulfillment
- Do not configure license key fulfillment
- Do not configure PDF/e-book fulfillment
- Do not configure media delivery
- Do not create School fulfillment
- If FastSpring dashboard requires a fulfillment step before activation, record the available non-sensitive options and **stop for review** before selecting one

Preferred direction: treat products as **subscription SaaS access** with entitlement granted inside Dreemi after verified provider events—not as downloadable or license-key products.

## Risks If Misconfigured

| Risk | Impact | Mitigation |
| --- | --- | --- |
| Configuring file/license fulfillment incorrectly | Customer expects download; Dreemi delivers account access only | Document SaaS fulfillment; avoid file/license dashboard actions |
| Granting entitlement before verified payment | Unauthorized paid access | Fail-closed runtime; webhook signature verification |
| Unknown product IDs granting plans | Wrong plan or free paid access | Reject unknown paths; no default paid grant |
| Refund/cancel events not downgrading user | Over-retained paid access | Map cancel/expiry events in future webhook phase |
| Webhook without signature verification | Forged entitlement updates | Verify signatures before any plan change |
| Public claim that billing is live before approval | Compliance/trust risk | Keep checkout fail-closed; no Live billing claims |

## Required Before Production Billing

- [ ] Confirm FastSpring fulfillment expectations for SaaS access
- [ ] Execute safe FastSpring test-mode checkout
- [x] Plan webhook integration — **docs-only plan complete** (`docs/D3M_FASTSPRING_WEBHOOK_INTEGRATION_PLAN.md`, entitlement mapping plan, webhook test plan)
- [ ] Implement webhook signature verification
- [ ] Map FastSpring product paths to internal plan entitlements
- [ ] Add tests for activation, cancellation, unknown product, and failure paths
- [ ] Complete FastSpring Live approval
- [ ] Complete payout readiness after approval
- [ ] Keep runtime checkout fail-closed until all gates pass

## What Was Not Done

- No checkout opened
- No test order executed
- No dashboard fulfillment configured
- No API/webhook configured
- No entitlement mapping implemented
- No tax/KYC submitted
- No User Agreement signed
- No payout activated
- No Live activation requested

## Blocker Register

| Blocker | Area | Severity | Current Status | Required Evidence | Recommended Phase |
| --- | --- | --- | --- | --- | --- |
| Actual test order not executed | Activation / checkout | High | **OPEN** | Safe test-mode Individual Monthly order evidence | `D3M-Payments-FastSpring-Test-Order-Manual-Execution` |
| Webhook integration not implemented | Runtime / payments | Critical | **PLANNED (docs-only)** | Webhook route + signature verification | Official docs verification then runtime implementation |
| Entitlement runtime mapping not implemented | Runtime / billing | Critical | **OPEN** | Product path → plan mapping in runtime | Future webhook implementation phase |
| User Agreement not documented as signed | Business / legal | High | **OPEN** | Signed User Agreement record | Activation checklist follow-up |
| Tax profile not documented as completed | Business / tax | High | **OPEN** | Tax profile completion evidence | Activation checklist follow-up |
| KYC readiness not documented | Business / KYC | High | **OPEN** | KYC readiness evidence | Activation checklist follow-up |
| Activation request not sent | Activation | High | **OPEN** | Post-requirements activation request | Activation request phase |
| Payout not activated | Payout | High | **OPEN** | Payout activation after Live approval | Post-approval phase |
| Production DB uptime decision pending | Infrastructure | Medium | **OPEN** | DB uptime decision doc | `D3M-Infra-Database-Uptime-Decision` |
| Production billing NO-GO | Launch | Critical | **BLOCKED** | All payment/activation gates resolved | Multi-phase |

## Payment Readiness Impact

The SaaS fulfillment decision improves FastSpring activation readiness by clarifying that Dreemi fulfillment is account-based subscription access, not file or license delivery. It does not enable production billing. Production billing remains **NO-GO** until safe test checkout, webhook/entitlement integration, provider Live approval, payout readiness, business/tax/KYC readiness, and infrastructure blockers are resolved.

## Launch Gate Impact

- SaaS fulfillment decision gate: **PASS**
- FastSpring minimum requirements: still **PARTIAL** until test order and business/tax/KYC/activation request are complete
- Actual test checkout gate: **PASS on retry** — see `docs/D3M_FASTSPRING_TEST_ORDER_RETRY_EXECUTION.md`
- Webhook gate: **BLOCKED**
- Entitlement runtime gate: **BLOCKED**
- Live billing gate: **BLOCKED**
- Payout gate: **BLOCKED**
- Production billing: **NO-GO**

## Recommended Next Phase

**Primary:** `D3M-Payments-FastSpring-Activation-Request-Sent-Record` — after user sends activation email manually

Activation email draft: `docs/D3M_FASTSPRING_ACTIVATION_REQUEST_EMAIL.md`

Retry test execution **PASS** (`docs/D3M_FASTSPRING_TEST_ORDER_RETRY_EXECUTION.md`). First attempt **BLOCKED** (`docs/D3M_FASTSPRING_TEST_ORDER_MANUAL_EXECUTION.md`).

## Notes For Next Chat

- Dreemi fulfillment for FastSpring is **SaaS account entitlement**, not file/license/download delivery
- Do not configure FastSpring dashboard fulfillment as download/license without explicit review
- Test order may proceed for provider-side verification only; it must not auto-grant Dreemi entitlement until webhook integration exists
- Runtime checkout remains fail-closed; production billing remains **NO-GO**
