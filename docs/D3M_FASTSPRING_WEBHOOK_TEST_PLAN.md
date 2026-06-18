# D3M FastSpring Webhook Test Plan

## Status

**PLANNING ONLY** — docs-only test plan. No webhook tests were executed in this phase.

No webhook route was implemented.

No FastSpring webhook was created.

Production billing remains **NO-GO**.

## Purpose

Define safe testing levels, unit/integration/provider test-mode plans, negative cases, regression requirements, forbidden actions, and exit criteria for future FastSpring webhook and entitlement runtime implementation.

Parent plan: `docs/D3M_FASTSPRING_WEBHOOK_INTEGRATION_PLAN.md`

## Test Levels

| Level | Scope | When allowed |
| --- | --- | --- |
| Unit | Mapping, signature wrapper, idempotency, routing | After implementation design approved |
| Integration (mocked) | End-to-end handler with fake payloads | After official schema verification |
| Provider test-mode | Real FastSpring test-mode webhook deliveries | After test-mode webhook setup approved |
| Live/production | Real Live webhook events | After Live approval + all production gates |

## Unit Test Plan

- Product path → Dreemi plan mapping (all four launch SKUs)
- Unknown product path rejection (no entitlement change)
- Unknown event category routing (no entitlement change)
- Signature verification wrapper: valid fake signature path (using test fixtures only)
- Signature verification wrapper: missing signature → reject
- Signature verification wrapper: invalid signature → reject
- Malformed payload → reject
- Duplicate event → no duplicate entitlement update
- Downgrade policy handlers once official semantics are locked

## Integration Test Plan

- Mocked FastSpring payload through future webhook handler → expected `User.plan` outcome
- Idempotent retry simulation (same event twice)
- DB failure simulation → no spurious grant; reconciliation hook planned
- Unknown product in otherwise valid payload → no entitlement change

Use mocked payloads only. Do not commit raw provider payloads with sensitive data.

## Provider Test-Mode Plan

Prerequisites:

- FastSpring test-mode webhook endpoint configured (manual, approved phase)
- Official event shapes verified
- Runtime handler implemented and unit-tested

Steps (future, gated):

1. Configure test-mode webhook URL pointing to non-production environment.
2. Trigger known test-mode subscription lifecycle events per FastSpring guidance.
3. Verify entitlement updates match product mapping plan.
4. Verify unknown/invalid cases remain fail-closed.
5. Record non-sensitive test outcomes in docs-only phase.

No real customer payment required for webhook handler unit/integration tests with mocks.

## Negative Test Cases

| Case | Expected result |
| --- | --- |
| Missing signature | Reject; no entitlement change |
| Invalid signature | Reject; no entitlement change |
| Malformed payload | Reject; no entitlement change |
| Unknown event | No entitlement change |
| Unknown product path | No entitlement change |
| Duplicate event | No duplicate update |
| Refund/chargeback/inactive event | Downgrade policy tested after official semantics confirmed |

## Regression Requirements

- Fail-closed checkout remains default until explicit production gate approval
- FREE fallback preserved for unknown states
- No logging of full payloads or payment instrument data
- Existing non-FastSpring entitlement read paths must not regress
- Child limit and story limit behavior must match mapped plan after grant/downgrade

## Forbidden Test Actions Until Approved

- No live webhook tests.
- No real customer payment.
- No production checkout.
- No production entitlement update.
- No logging raw sensitive payloads.
- No FastSpring dashboard webhook creation in this planning phase.
- No env/secrets changes.

## Exit Criteria

Future implementation may proceed to provider test-mode only when:

- [ ] Unit tests pass for mapping, signature wrapper, idempotency, and negative cases
- [ ] Integration tests pass with mocked official-schema payloads
- [ ] Grant/downgrade policy locked against verified official semantics
- [ ] Test-mode webhook validation completed successfully
- [ ] No sensitive data logged in test environments
- [ ] Production billing gates still evaluated separately (planning/tests alone do not enable Live billing)

## Next

**Primary:** `D3M-Payments-FastSpring-Followup-Email-Sent-Record`

**Alternative:** `D3M-Payments-FastSpring-Webhook-Official-Docs-Verification`
