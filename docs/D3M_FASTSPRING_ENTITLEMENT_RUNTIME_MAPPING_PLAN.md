# D3M FastSpring Entitlement Runtime Mapping Plan

## Status

This is docs-only.

No entitlement runtime code was implemented.

No database schema or migration was changed.

No runtime checkout behavior was changed.

Production billing remains **NO-GO**.

## Purpose

Define how verified FastSpring subscription lifecycle events should map to Dreemi entitlement state in a future runtime implementation, using the current compatibility model based on `User.plan`.

Parent plans:

- `docs/D3M_FASTSPRING_WEBHOOK_INTEGRATION_PLAN.md`
- `docs/D3M_FASTSPRING_SAAS_FULFILLMENT_DECISION.md`
- `docs/D3M_FASTSPRING_FULFILLMENT_TO_ENTITLEMENT_MAPPING.md`

## Current Entitlement Model

- Current entitlement compatibility read model is based on `User.plan`.
- Runtime payment-driven entitlement updates are **not implemented** yet.
- FREE is the safe fallback for unknown or inactive states.
- Fulfillment is **account access** (SaaS entitlement), not file or license delivery.

## Product To Plan Mapping

| FastSpring Product Path | Dreemi Plan | Billing Interval | Status |
| --- | --- | --- | --- |
| `dreemi-individual-monthly` | INDIVIDUAL | Monthly | planned |
| `dreemi-individual-yearly` | INDIVIDUAL | Yearly | planned |
| `dreemi-family-monthly` | FAMILY | Monthly | planned |
| `dreemi-family-yearly` | FAMILY | Yearly | planned |
| `dreemi-school` | SCHOOL | deferred/contact-only | deferred/not configured |
| unknown | none (fail closed) | unknown | reject |

Free plan: internal only; no FastSpring product.

School plan: deferred / contact-only; no FastSpring product yet.

## Plan Limits

| Plan | Monthly story limit | Child limit |
| --- | --- | --- |
| FREE | 3 | 1 |
| INDIVIDUAL | (paid tier rules apply) | 1 |
| FAMILY | (paid tier rules apply) | 4 |
| SCHOOL | deferred | Infinity only when explicitly enabled later |

Only known FastSpring product paths may map to paid plans.

Unknown product paths must not grant access.

## Runtime Grant Rules

- Grant or maintain paid plan only after verified server-side FastSpring lifecycle event.
- Map product path to plan using the table above.
- Never grant paid access from client-side checkout callbacks alone.
- Test-mode provider events must not grant production entitlement until explicitly approved in a future gated phase.
- Duplicate verified grant events must be idempotent (no duplicate side effects).

## Runtime Downgrade Rules

Recommended (pending official FastSpring semantics):

- Provider-confirmed inactive/expired subscription → **FREE**
- Refund / chargeback / payment reversal → **FREE** after verified event
- Cancellation before period end → maintain paid plan until official semantics confirm end-of-term behavior
- Unknown product path → no change (fail closed)
- Unsupported plan value → **FREE**

## Unknown Product Policy

- Unknown product path: no `User.plan` update; log minimal diagnostic only.
- Deferred School SKU: no runtime action until explicitly configured.
- Ambiguous payload: fail closed; no paid grant.

## Idempotency Requirements

- Process each provider event at most once for entitlement effect.
- Retries and duplicate deliveries must not double-grant or double-downgrade.
- Stable provider event identifier field(s) must be confirmed from official docs before implementation.
- Reconciliation path required if DB write fails after successful verification.

## Data Model Questions

Do not implement schema changes in this planning phase. Open questions for future design:

- Should Dreemi store FastSpring subscription identifiers?
- Should Dreemi store `current_period_end`?
- Should entitlement state be separate from `User.plan`?
- How will manual corrections be handled?
- What is the reconciliation strategy if webhook processing fails?

## Testing Requirements

See: `docs/D3M_FASTSPRING_WEBHOOK_TEST_PLAN.md`

- Unit tests for product path → plan mapping
- Unit tests for unknown product rejection
- Unit tests for downgrade policy once official semantics are locked
- Integration tests with mocked payloads only after official schema verification
- No production entitlement updates during planning or unapproved test phases

## Open Decisions

- Exact FastSpring event that triggers initial grant (pending official docs)
- Exact FastSpring event that triggers downgrade to FREE (pending official docs)
- Cancellation vs expiration/end-of-paid-term behavior (pending official docs)
- Whether to persist subscription identifiers and period end in Dreemi DB
- Whether to evolve beyond `User.plan` as sole compatibility projection
- Manual admin override and support correction workflow (out of scope unless documented separately)

## Implementation Gates

- [ ] Official FastSpring webhook documentation verified
- [ ] Product mapping locked
- [ ] Grant/downgrade policy locked against official semantics
- [ ] Idempotency model approved
- [ ] Data model questions resolved for MVP
- [ ] Test plan exit criteria defined
- [ ] FastSpring approval or clear implementation guidance received
- [ ] Runtime checkout remains fail-closed until tests pass

See also: `docs/D3M_FASTSPRING_RUNTIME_IMPLEMENTATION_GATES.md`

## Next

**Primary:** `D3M-Payments-FastSpring-Followup-Email-Sent-Record` — if user sends follow-up after waiting window

**Alternative:** `D3M-Payments-FastSpring-Webhook-Official-Docs-Verification` — verify official FastSpring webhook docs before implementation
