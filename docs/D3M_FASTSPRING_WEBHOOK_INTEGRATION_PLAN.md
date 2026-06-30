# D3M FastSpring Webhook Integration Plan

## Status

This is a docs-only FastSpring webhook integration plan.

No webhook route was implemented.

No FastSpring webhook was created.

No FastSpring API call was made.

No FastSpring dashboard change was made.

No provider credentials were added.

No env/secrets were read, printed, verified, or modified.

No runtime checkout behavior was changed.

No entitlement runtime behavior was changed.

No database schema or migration was changed.

No tax/KYC/payout action was performed.

No Live mode was enabled.

Production billing remains **NO-GO**.

## Purpose

Define the future FastSpring webhook integration approach, security model, product mapping, event handling categories, fail-closed behavior, idempotency requirements, entitlement update rules, testing strategy, and implementation gates — without implementing runtime code or creating provider resources.

Related plans:

- `docs/D3M_FASTSPRING_ENTITLEMENT_RUNTIME_MAPPING_PLAN.md`
- `docs/D3M_FASTSPRING_WEBHOOK_TEST_PLAN.md`
- `docs/D3M_FASTSPRING_WEBHOOK_SECURITY_MODEL.md`
- `docs/D3M_FASTSPRING_RUNTIME_IMPLEMENTATION_GATES.md`
- `docs/D3M_FASTSPRING_FULFILLMENT_TO_ENTITLEMENT_MAPPING.md`

## Current Baseline

Latest stable commit: `812063b` Record FastSpring response status

## Source Availability

| Source | Available | Notes |
| --- | --- | --- |
| `docs/D3M_FASTSPRING_RESPONSE_RECORD.md` | Yes | FastSpring under team review |
| `docs/D3M_FASTSPRING_SAAS_FULFILLMENT_DECISION.md` | Yes | SaaS entitlement model |
| `docs/D3M_FASTSPRING_FULFILLMENT_TO_ENTITLEMENT_MAPPING.md` | Yes | Product path mapping |
| `docs/D3M_FASTSPRING_CATALOG_PLAN.md` | Yes | Catalog SKUs |
| `docs/D3M_FASTSPRING_CATALOG_DASHBOARD_SETUP_RECORD.md` | Yes | Dashboard catalog setup |
| `docs/D3M_FASTSPRING_TEST_ORDER_RETRY_EXECUTION.md` | Yes | Test checkout PASS |
| Official FastSpring webhook docs | **Not verified in repo** | Pending verification phase |

## Explicit Non-Goals

- No webhook route implementation
- No FastSpring webhook creation in dashboard
- No API key creation
- No runtime checkout enablement
- No entitlement runtime updates
- No schema migration
- No env/secrets changes
- No inventing official FastSpring event names without verification

## Current Payment State

- FastSpring review is under team review.
- FastSpring approval has not been received.
- FastSpring rejection has not been received.
- Runtime checkout is fail-closed.
- Webhook/API integration is not implemented.
- Entitlement runtime mapping is not implemented.
- Production billing remains **NO-GO**.

## Integration Principles

- Fail closed by default.
- Verify webhook authenticity before parsing/trusting payload data.
- Do not grant paid access for unsigned, invalid, unknown, duplicated, or unsupported events.
- Map only known FastSpring product paths to known Dreemi plans.
- Reject unknown products without entitlement changes.
- Make webhook processing idempotent.
- Never trust client-side checkout data for entitlement changes.
- Entitlement changes must be server-side only.
- Avoid storing sensitive payment data.
- Log only minimal non-sensitive operational facts.
- Do not expose webhook diagnostics to users.

## Required Official FastSpring Verification

Before implementation, verify the following against official FastSpring documentation and/or FastSpring support:

- Current webhook signature verification method.
- Required raw-body handling requirements, if any.
- Official event names for subscription creation, renewal, cancellation, expiration, refund, chargeback, payment failure, and subscription update.
- Which event should trigger initial entitlement grant.
- Which event should trigger downgrade to FREE.
- Whether test-mode events match live-mode event shapes.
- Required retry/idempotency behavior.
- Recommended use of order, subscription, account, or product identifiers.
- How localized checkout currency appears in webhook payloads.

**Important:** Any event names used during planning are category placeholders only until verified against official FastSpring documentation. See `D3M-Payments-FastSpring-Webhook-Official-Docs-Verification` recommended phase.

## Future Webhook Endpoint Concept

Future endpoint: server-side FastSpring webhook receiver.

Provider: FastSpring.

Purpose: receive subscription/payment lifecycle events and update Dreemi entitlements.

Runtime status: **not implemented**.

Security status: pending official signature verification design.

Candidate endpoint path: `/api/payments/fastspring/webhook`

Status: **proposed only, not implemented**

Do not treat the candidate path as final until implementation design is approved.

## Security Model

See also: `docs/D3M_FASTSPRING_WEBHOOK_SECURITY_MODEL.md`

- Webhook signature verification must happen before trusting payload data.
- Invalid signature: reject, no entitlement change.
- Missing signature: reject, no entitlement change.
- Malformed payload: reject, no entitlement change.
- Unknown event: acknowledge or reject based on final provider guidance, but never change entitlement.
- Unknown product path: no entitlement change.
- Duplicate event: no duplicate entitlement change.
- Secrets must be stored only in deployment/provider secret storage, never in repo.

## Event Handling Categories

Do not treat the categories below as official FastSpring event names. They are planning categories pending official documentation verification.

| Category (planning) | Intended behavior | Entitlement action |
| --- | --- | --- |
| Subscription activated / paid successfully | Grant or maintain mapped plan after verification | Grant/maintain mapped plan |
| Subscription renewed / recurring payment successful | Maintain mapped plan after verification | Maintain mapped plan |
| Subscription cancelled but still active until period end | Policy decision required: maintain until paid period end or downgrade immediately based on official provider semantics | Pending official semantics |
| Subscription expired / deactivated | Downgrade to FREE after verified event | Downgrade to FREE |
| Refund / chargeback / payment reversal | Downgrade to FREE after verified event | Downgrade to FREE |
| Payment failed / payment overdue | Policy decision required; likely maintain temporarily until provider marks inactive/expired unless provider guidance says otherwise | Pending official semantics |
| Subscription product changed | Update mapped plan only if new product path is known and verified | Update mapped plan if known |
| Unknown event category | No entitlement change; record minimal internal diagnostic | No change |

## Idempotency Model

- Each webhook delivery must be processed idempotently.
- Use a provider-supplied stable event identifier or deduplication key once official docs confirm the correct field(s).
- Duplicate deliveries must not create duplicate entitlement updates.
- Partial processing must be safe to retry without double-granting or double-downgrading.
- Idempotency store design is TBD in implementation phase; do not add schema in this planning phase.

## Product Mapping

| FastSpring Product Path | Display Name | Dreemi Plan | Billing Interval | Runtime Action | Status |
| --- | --- | --- | --- | --- | --- |
| `dreemi-individual-monthly` | Dreemi Individual — Monthly | INDIVIDUAL | Monthly | grant/maintain INDIVIDUAL | planned |
| `dreemi-individual-yearly` | Dreemi Individual — Yearly | INDIVIDUAL | Yearly | grant/maintain INDIVIDUAL | planned |
| `dreemi-family-monthly` | Dreemi Family — Monthly | FAMILY | Monthly | grant/maintain FAMILY | planned |
| `dreemi-family-yearly` | Dreemi Family — Yearly | FAMILY | Yearly | grant/maintain FAMILY | planned |
| `dreemi-school` | School | SCHOOL | deferred/contact-only | no runtime action yet | deferred/not configured |
| unknown | unknown | none | unknown | no entitlement change | reject/fail closed |

Free plan: internal only; no FastSpring product.

## Unknown Product / Unknown Event Policy

- Unknown product path: reject processing for entitlement purposes; no `User.plan` change.
- Unknown event category: no entitlement change; minimal internal diagnostic only.
- Unsupported plan value after mapping: resolve to FREE (fail closed).
- Never grant paid access based on ambiguous payload fields.

## Entitlement Update Rules

- Only verified server-side FastSpring lifecycle events may update `User.plan`.
- FREE is the safe fallback.
- Unknown product path must not update `User.plan`.
- Unknown or unsupported plan value must resolve to FREE.
- Cancellation/expiration/refund downgrade policy must be explicit before runtime implementation.
- Manual admin override policy is out of scope unless already documented separately.

See: `docs/D3M_FASTSPRING_ENTITLEMENT_RUNTIME_MAPPING_PLAN.md`

## Cancellation / Expiration / Refund / Chargeback Policy

Recommended policy (pending official FastSpring semantics):

- Refund, chargeback, payment reversal, or provider-confirmed inactive/expired subscription should downgrade to **FREE**.
- Cancellation timing must be confirmed. If FastSpring distinguishes cancellation from expiration/end-of-paid-term, Dreemi should avoid removing access before the paid term ends unless provider semantics require it.
- Do not implement downgrade timing in runtime until official event semantics are verified.

## Failure Handling

- Webhook processing failure must not grant access.
- Database write failure must be logged minimally and retried through provider retry or internal reconciliation plan.
- Partial processing must be idempotent.
- No user-facing payment success should be shown until entitlement state is confirmed.

## Logging And Privacy Policy

- Do not log full webhook payloads in production.
- Do not log payment method details.
- Do not log billing address details.
- Do not log raw buyer personal data unless strictly necessary and legally justified.
- Prefer event category, mapped product path, mapped plan, processing result, and non-sensitive correlation reference if needed.

## Manual Review Cases

Cases requiring manual review before or after implementation:

- Unknown product path in payload
- Conflicting subscription state (active + refund signals)
- Duplicate event with conflicting outcomes
- User account not found for provider-linked identity
- Product change to deferred School SKU
- Test-mode event received in production endpoint (or vice versa)

## Implementation Gates

See also: `docs/D3M_FASTSPRING_RUNTIME_IMPLEMENTATION_GATES.md`

- [ ] FastSpring official approval or clear implementation guidance received.
- [ ] Official FastSpring webhook documentation verified.
- [ ] Business/tax/KYC/User Agreement path clarified.
- [ ] Webhook signature verification design approved.
- [ ] Product mapping locked.
- [ ] Cancellation/expiration/refund policy locked.
- [ ] Idempotency model locked.
- [ ] Runtime checkout remains fail-closed until implementation passes tests.
- [ ] Test-mode webhook validation completed before production.
- [ ] Production DB uptime decision resolved before live billing.

## Testing Strategy

See: `docs/D3M_FASTSPRING_WEBHOOK_TEST_PLAN.md`

- Unit tests for product mapping.
- Unit tests for unknown product rejection.
- Unit tests for event category routing.
- Unit tests for signature verification wrapper behavior, using safe fake inputs.
- Unit tests for idempotency.
- Integration test with mocked FastSpring payloads only after official schema verification.
- No real webhook event tests until FastSpring test-mode webhook setup is approved.
- No live webhook tests until Live approval and production readiness gates pass.

## What This Phase Did Not Do

- No webhook route was implemented.
- No FastSpring webhook was created.
- No FastSpring API call was made.
- No dashboard change was made.
- No provider credentials were added.
- No env/secrets were read or modified.
- No runtime checkout behavior was changed.
- No entitlement runtime behavior was changed.
- No database schema or migration was changed.

## Blocker Register

| Blocker | Area | Severity | Current Status | Required Evidence | Recommended Phase |
| --- | --- | --- | --- | --- | --- |
| FastSpring team review pending | Provider review | High | **PENDING** | Further FastSpring reply | Follow-up sent record / response review |
| FastSpring activation approval pending | Activation | High | **OPEN** | FastSpring approval | Post-review |
| Official webhook docs verification pending | Provider docs | High | **OPEN** | Verified official docs | Webhook official docs verification |
| Webhook signature model not implemented | Security | Critical | **OPEN** | Approved design + tests | Runtime implementation phase |
| Webhook route not implemented | Runtime | Critical | **OPEN** | Route + tests | Runtime implementation phase |
| Product-to-plan runtime mapping not implemented | Runtime | Critical | **OPEN** | Mapping tests | Runtime implementation phase |
| Entitlement runtime update not implemented | Runtime | Critical | **OPEN** | Verified event handling | Runtime implementation phase |
| Cancellation/expiration/refund downgrade policy pending final semantics | Policy | High | **OPEN** | Official provider semantics | Official docs verification |
| Business/tax/KYC/User Agreement not documented complete | Business | High | **OPEN / unverified** | Dashboard + guidance | Manual + response review |
| Live mode not enabled | Activation | High | **OPEN** (expected) | FastSpring approval | Post-approval |
| Payout not activated | Payout | High | **OPEN** (expected) | Post-Live payout | Post-approval |
| Production DB uptime decision pending | Infrastructure | Medium | **OPEN** | Infra decision doc | Infra decision phase |
| Production billing NO-GO | Launch | Critical | **BLOCKED** | All gates resolved | Multi-phase |

## Payment Readiness Impact

This plan advances technical readiness for FastSpring webhooks but does not enable production billing. Production billing remains **NO-GO** until FastSpring approval, official webhook documentation verification, business/tax/KYC readiness, webhook/entitlement implementation, Live mode, payout readiness, and infrastructure blockers are resolved.

## Launch Gate Impact

- Webhook planning gate: **PASS**
- Webhook implementation gate: **BLOCKED**
- Entitlement runtime gate: **BLOCKED**
- FastSpring team review gate: **PENDING**
- FastSpring activation approval gate: **BLOCKED**
- Live billing gate: **BLOCKED**
- Payout gate: **BLOCKED**
- Production billing: **NO-GO**

## Recommended Next Phase

**Primary:** `D3M-Payments-FastSpring-Post-Followup-Response-Record` — record and analyze FastSpring's reply after the follow-up

**Alternative:** `D3M-Payments-FastSpring-Webhook-Official-Docs-Verification` — verify official FastSpring webhook docs before implementation, without runtime changes

## Notes For Next Chat

- Webhook integration is **planned only** — no runtime implementation in this phase
- Follow-up email **SENT 2026-06-30** — see `docs/D3M_FASTSPRING_FOLLOWUP_EMAIL_SENT_RECORD.md`
- Do not create FastSpring webhooks or API keys until approval and gates pass
- Verify official FastSpring event names and signature method before coding
- Production billing remains **NO-GO**
