# D3M Payment Readiness Gap Implementation Plan

## Status

- Phase: `4-D3M-Triage-B4`.
- Type: documentation-only implementation planning.
- Runtime/code/test/env/provider behavior: unchanged in this phase.
- Current gap remains unresolved at runtime.

## Related Documents

- `docs/D3M_PAYMENT_READINESS_GAP_PROPOSAL.md`
- `docs/D3M_PAYMENT_NO_PURCHASE_SMOKE_RESULTS.md`
- `docs/D3M_PAYMENT_NO_PURCHASE_SMOKE_PLAN.md`
- `docs/D3M_PAYMENT_DISABLED_UX_PROPOSAL.md`
- `docs/D3M_PAYMENT_CONFIG_READINESS_CLARIFICATION.md`
- `docs/D3M_SMOKE_FAILURE_TRIAGE.md`
- `docs/PRODUCTION_READINESS_CHECKLIST.md`
- `docs/PAYMENT_PROVIDER_STRATEGY_AFTER_LEMON_REJECTION.md`

## Problem Summary

Current evidence shows a contract gap between:

1. `/api/payments/status` readiness signal,
2. actual checkout provider config completeness at checkout creation time,
3. checkout error specificity and stability,
4. pricing UI behavior when payments are unavailable.

Observed pattern:

- status can report checkout as startable,
- checkout creation can still fail due to provider config preconditions,
- user-facing behavior can degrade to generic checkout failure messaging.

## Evidence Baseline

Evidence from prior documentation (no new runtime execution in this phase):

- B2-Run status evidence recorded:
  - `success=true`
  - `payments.canStartCheckout=true`
  - `payments.errorCode=null`
  - `payments.activeProvider=LEMONSQUEEZY`
- Prior checkout smoke evidence recorded:
  - `CHECKOUT_CREATE_FAILED`
  - local provider-config precondition missing (`LEMONSQUEEZY_STORE_ID` not set)
- Subscription verification in B2-Run was auth-safe blocked and is not proof of route failure.
- Classification from prior phases remains:
  - not D3K regression,
  - not entitlement runtime failure evidence,
  - readiness contract clarity issue.

## Implementation Principle

Conservative implementation sequence for a future code phase:

1. Backend readiness contract first.
2. Stable checkout error code second.
3. Pricing UI disabled/unavailable behavior third.
4. No-purchase tests before any real provider/payment verification.

Principles:

- fail closed for payment availability,
- stable machine-readable codes,
- no secret leakage in public responses/UI,
- no over-claim of provider production readiness.

## Proposed Target Behavior

Target behavior after a later code phase (not implemented here):

- Status semantics make checkout offerability predictable.
- Checkout precondition failures return stable explicit codes.
- Pricing UI avoids raw checkout technical failures.
- Localized safe unavailable copy is shown in `en/ar/fr`.
- No-purchase smoke can validate readiness semantics without checkout/purchase/webhook/provider API calls.

## Backend Contract Plan

Planned contract decisions for future code phase:

1. Keep `/api/payments/status` as public observability endpoint.
2. Make readiness semantics explicitly tied to checkout offer safety.
3. Ensure checkout endpoint returns stable config-unavailable code for provider-precondition failures.
4. Preserve existing auth and security constraints.

## `/api/payments/status` Readiness Semantics

Future status semantics should distinguish these states explicitly:

- provider selected,
- provider runtime enabled,
- provider config complete enough to create checkout,
- checkout safe to offer in UI.

Primary recommendation:

- `canStartCheckout` should represent UI-offer-safe readiness, not only provider selection.

Compatibility option (if needed):

- preserve current field while adding explicit completeness fields for migration safety.

## Checkout Error Contract Plan

Future checkout behavior should normalize provider-config precondition failures to a stable code path:

- do not expose secret names/values in public error text,
- keep technical detail in server logs only,
- return machine-readable code suitable for safe frontend mapping.

This should reduce reliance on generic `CHECKOUT_CREATE_FAILED` for known precondition classes.

## Proposed Stable Error Codes

Candidate names:

- `PAYMENT_PROVIDER_CONFIG_INCOMPLETE`
- `CHECKOUT_PROVIDER_CONFIG_INCOMPLETE`
- `PAYMENT_CHECKOUT_UNAVAILABLE`

Primary recommendation:

- `CHECKOUT_PROVIDER_CONFIG_INCOMPLETE`

Reason:

- tightly scoped to checkout precondition class,
- explicit enough for UI mapping,
- avoids implying global provider outage,
- reduces ambiguity compared with generic availability-only wording.

## Pricing UI Behavior Plan

Future UI behavior recommendation:

- if status indicates checkout is not safe to offer, disable checkout action and show safe localized copy.

Recommended user-facing copy:

- `Payments are temporarily unavailable. Please try again later.`

Behavior rules:

- do not expose raw backend/internal provider failure text,
- keep pricing visible while checkout action is unavailable,
- avoid implying payment/provider production approval.

## Localization Requirements

Any future UI messaging for payment unavailability must include:

- `en`
- `ar`
- `fr`

Localization acceptance expectation:

- consistent unavailable behavior and locale-correct copy across pricing surfaces.

## No-Purchase Test Plan

Future code phase should be validated with no-purchase tests first:

1. pricing page loads in `en/ar/fr`,
2. status endpoint returns stable readiness semantics and no secrets,
3. checkout unavailable state is reflected safely in pricing UI,
4. checkout endpoint precondition failure returns stable code when applicable,
5. subscription route outcomes are classified correctly (PASS/BLOCKED) without false broken claims when auth-safe constraints block testing.

Explicit exclusions:

- no real checkout,
- no purchase flow,
- no webhook execution,
- no provider API calls,
- no production verification.

## Runtime Files Expected In Later Code Phase

Expected candidates for later code-phase inspection/modification (not edited in this planning phase):

- `services/api/src/routes/payments.ts`
- `services/api/src/config/billing.ts`
- `apps/web/src/app/[locale]/pricing/page.tsx`
- `apps/web/src/lib/api.ts`
- `apps/web/messages/en.json`
- `apps/web/messages/ar.json`
- `apps/web/messages/fr.json`

## Files Explicitly Out Of Scope For This Planning Phase

- `services/`
- `apps/`
- `prisma/`
- `package.json`
- `pnpm-lock.yaml`
- `.env`
- `.env.local`
- `.env.*`
- build artifacts and generated files

## Acceptance Criteria For Later Code Phase

All must hold in later implementation:

1. readiness semantics are explicit and consistent with UI offer behavior,
2. checkout config-precondition failures use stable machine-readable code,
3. pricing UI shows safe localized unavailable behavior,
4. no secret names/values are exposed in responses/UI/docs,
5. no entitlement runtime surface expansion,
6. no schema/migration changes unless separately approved,
7. no provider production-readiness overclaim,
8. validation commands and scans pass with visible exit codes.

## Rollback / Revert Plan

If future B4 code phase regresses behavior:

1. revert only B4 implementation commit(s),
2. preserve D3G/D3K entitlement runtime surfaces,
3. preserve existing payment auth/security constraints,
4. rerun no-purchase validation first,
5. keep production verification blocked until separate approved phase.

## Risk Review

Primary risks if implemented poorly:

- readiness false positives remain,
- UI still leaks raw technical failures,
- unstable error contract increases frontend brittleness,
- auth-blocked verification is misreported as route failure,
- accidental scope creep into provider/env/runtime areas outside approval.

Risk control:

- strict scoped phase,
- stable backend contract first,
- no-purchase smoke gate before any real payment verification.

## Open Decisions

1. Should backward compatibility preserve current status fields while adding explicit completeness fields?
2. Should checkout CTA be disabled immediately on status, or allow click and show blocked state?
3. Final stable code choice if naming convention differs from this plan?
4. Whether to include a dedicated "provider runtime enabled" field in status response?
5. Whether B4 implementation should be one combined phase or two micro-phases (backend first, UI second)?

## Recommended Next Phase

- `4-D3M-Triage-B4-Implement` (explicit approval): narrow code phase for backend readiness semantics + stable checkout precondition code + pricing unavailable UX wiring.
- Execution order in that phase should remain:
  1. backend readiness contract,
  2. stable checkout error code,
  3. pricing UI behavior,
  4. no-purchase tests,
  5. only then consider any broader payment verification planning.
