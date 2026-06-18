# D3M FastSpring Runtime Implementation Gates

## Status

**PLANNING ONLY** — docs-only gate checklist. No runtime implementation was performed.

Production billing remains **NO-GO**.

## Purpose

Summarize gates that must pass before any FastSpring webhook route, entitlement runtime update, or checkout enablement.

## Provider And Business Gates

- [ ] FastSpring team review completed with clear next step
- [ ] FastSpring activation approval received (or explicit implementation guidance)
- [ ] Business/tax/KYC/User Agreement path clarified
- [ ] Live mode enabled only after approval
- [ ] Payout activated only after post-Live guidance

## Documentation Gates

- [ ] Official FastSpring webhook documentation verified
- [ ] Official event names and semantics verified (no placeholder assumptions)
- [ ] Signature verification method verified
- [ ] Test-mode vs live-mode payload parity confirmed

## Design Gates

- [ ] Product mapping locked (`dreemi-individual-*`, `dreemi-family-*`; School deferred)
- [ ] Grant/downgrade/cancellation policy locked
- [ ] Idempotency model locked
- [ ] Data model questions resolved for MVP (subscription IDs, period end, etc.)
- [ ] Security model approved (`docs/D3M_FASTSPRING_WEBHOOK_SECURITY_MODEL.md`)

## Implementation Gates

- [ ] Webhook route implemented with signature verification
- [ ] Entitlement runtime update implemented server-side only
- [ ] Unit tests pass (`docs/D3M_FASTSPRING_WEBHOOK_TEST_PLAN.md`)
- [ ] Integration tests pass with mocked official-schema payloads
- [ ] Test-mode webhook validation completed
- [ ] Runtime checkout remains fail-closed until all tests and gates pass

## Infrastructure Gates

- [ ] Production DB uptime decision resolved
- [ ] Secrets stored in deployment secret storage only
- [ ] No sensitive payload logging in production

## Launch Gates

- [ ] No production Live webhook tests until Live approval
- [ ] No production entitlement updates until full gate review
- [ ] Production billing remains **NO-GO** until all blockers resolved

## Next

**Primary:** `D3M-Payments-FastSpring-Followup-Email-Sent-Record`

**Alternative:** `D3M-Payments-FastSpring-Webhook-Official-Docs-Verification`
