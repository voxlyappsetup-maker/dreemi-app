# Entitlement Runtime Implementation Readiness Checklist

## 1. Purpose

- Define the readiness gate before any entitlement runtime implementation starts.
- Prevent unreviewed access-check, provider, schema, or payment changes.
- Preserve User.plan compatibility.
- Keep paid access fail-closed.
- Define allowed scope for the first future runtime phase.
- This document is planning only.
- It does not implement runtime code, schema, migrations, provider integrations, package changes, env changes, mobile project changes, or deployment.

## 2. Current Stable Position

- User.plan remains the current effective access projection.
- Current story and child limits are plan-based.
- EntitlementService is documented but not implemented.
- Future entitlement schema is documented but not implemented.
- User.plan projection compatibility is documented but not implemented.
- Lemon remains implemented but not production-approved.
- Paid checkout remains disabled by default through runtime safety gate.
- Apple and Google billing are documented but not implemented.
- No runtime entitlement implementation has started.

## 3. Readiness Principle

No entitlement runtime implementation should begin until scope, fallback behavior, tests, and rollback are explicit.

- First implementation must be additive.
- No provider-specific ID can become access-check logic.
- Unknown entitlement must behave as FREE.
- Service failures must not grant paid access.
- User.plan must remain compatible.
- Current limits must remain unchanged unless explicitly approved.
- No paid launch can happen from implementation alone.

## 4. First Implementation Direction Decision

| Track | Description | Benefits | Risks | Recommendation |
| --- | --- | --- | --- | --- |
| Code skeleton first | Add service/types/tests boundary with no behavior changes | Lowest rollout risk, clear contracts, test-first workflow | May feel slower before schema/provider work | Recommended first |
| Schema first | Add new models/migrations before runtime boundary | Earlier database shape visibility | Higher rollback risk, migration overhead before service contract stability | Not first |
| Provider adapter first | Implement provider-normalization code early | Early provider integration learning | High coupling risk, unsafe if service/schema guardrails are not locked | Not first |
| Access-check migration first | Move routes/middleware to entitlement path immediately | Direct path to end-state access logic | Highest regression risk to story/child/payments behavior | Not first |

Recommended direction:

- Code skeleton first is the safest next implementation track.
- It should create types/service boundary/tests without changing access behavior.
- Schema should wait until service skeleton and tests are accepted.
- Provider adapters should wait until schema/service readiness is accepted.
- Access-check migration should be later, after projection compatibility tests.

## 5. Allowed First Runtime Phase Scope

Allowed future file scope for first code skeleton phase only, conceptually:

- `services/api/src/services/entitlement.service.ts`
- `services/api/src/services/entitlement.service.test.ts` or equivalent
- `services/api/src/types/entitlement.ts` or equivalent
- `services/api/src/config/entitlement.ts` if needed
- static regression tests only if needed

Clarifications:

- This is future allowed scope, not a change in this phase.
- Final file names require approval in the future implementation prompt.
- First runtime phase must not call providers.
- First runtime phase must not change access checks.
- First runtime phase must not alter Prisma schema.

## 6. Blocked First Runtime Phase Scope

Blocked areas for the first implementation unless separately approved:

- `prisma/schema.prisma`
- migrations
- `services/api/src/routes/payments.ts`
- `services/api/src/routes/children.ts`
- `services/api/src/routes/stories.ts`
- `services/api/src/middleware/plans.middleware.ts`
- apps/web pricing/paywall files
- Apple/Google native billing files
- deployment config
- package files
- env files
- PDF/export code
- AI generation code

## 7. Required Pre-Implementation Checks

- git status clean
- latest docs reviewed
- no uncommitted work
- no provider approval assumed
- runtime safety gate remains active
- User.plan compatibility documented
- schema design reviewed
- service interface design reviewed
- projection compatibility reviewed
- privacy/data-safety implications reviewed
- rollback plan written in prompt
- tests planned before edits

## 8. Fail-Closed Runtime Requirements

- unknown provider source returns FREE/no paid access
- unknown product ID returns FREE/no paid access
- unknown status returns FREE/no paid access
- malformed event returns no paid access
- disabled provider returns no paid access
- unapproved provider returns no paid access
- expired entitlement returns FREE/no paid access
- canceled entitlement returns FREE/no paid access
- revoked/refunded entitlement returns FREE/no paid access
- service load failure returns safe fallback
- user not found returns safe failure
- missing parent account linkage returns safe failure

Clarifications:

- Fail-closed must not delete records.
- Fail-closed must not expose secrets.
- Fail-closed must be tested.

## 9. User.plan Compatibility Gate

- User.plan must remain in schema.
- Existing access checks must keep working.
- First implementation should not change User.plan semantics.
- Projection writes should not be introduced before explicit phase approval.
- Direct access-check migration should not happen in first skeleton phase.
- Current story and child limit behavior must remain unchanged.

## 10. Story And Child Limit Safety Gate

- FREE monthly story limit remains 3.
- Current child limits remain:
  - FREE: 1
  - INDIVIDUAL: 1
  - FAMILY: 4
  - SCHOOL: Infinity or policy-defined unlimited
- First runtime phase must not change these limits.
- Future tests must prove limits remain unchanged.
- Children are never buyers or account owners.

## 11. Provider Adapter Safety Gate

- No Apple adapter in first runtime phase.
- No Google adapter in first runtime phase.
- No web provider replacement in first runtime phase.
- No Lemon production enablement in first runtime phase.
- No manual/internal override implementation in first runtime phase.
- Provider adapters must normalize into EffectiveEntitlement later.
- Provider evidence must not be access logic.

## 12. Payments Runtime Safety Gate

- Current payments runtime safety gate must remain.
- Paid checkout must remain disabled by default.
- Env var presence must not equal provider approval.
- Lemon rejection/reconsideration denial remains documented.
- Provider approval and verification must be separate gates.
- First entitlement runtime work must not enable checkout.

## 13. Privacy And Secrets Gate

Prohibited runtime/log storage:

- API keys
- JWTs
- provider secrets
- service account credentials
- raw purchase tokens
- raw signed payloads
- raw payment payloads
- private story content
- child private data beyond required safe references

Requirements:

- Use safe error codes.
- Minimize evidence.
- Update privacy/data safety inventory before schema/provider implementation.
- Export/deletion review is required before entitlement records are added.

## 14. Testing Gate For First Runtime Phase

Required future tests before first code skeleton commit:

- service default FREE result test
- EffectiveEntitlement shape test
- unknown source fails closed
- unknown plan/status fails closed
- provider disabled fails closed
- no provider-specific access-check tests
- no route/middleware behavior change tests
- story limit unchanged static/regression test
- child limit unchanged static/regression test
- no secrets/static source test
- User.plan unchanged compatibility test
- payments safety gate unchanged static/regression test
- build/lint/test all pass

## 15. Static Regression Gate

Required static checks for future implementation:

- no provider product IDs in access-check files
- no purchase token logging
- no raw signed payload logging
- no User.plan removal
- no Subscription field rename/removal
- no checkout enablement by default
- no schema/migration changes unless explicit schema phase
- no env file modifications
- no package changes unless explicitly approved

## 16. Runtime Integration Sequence

Recommended future sequence:

- Phase 4-D3A: Entitlement types and service skeleton with tests, no behavior change.
- Phase 4-D3B: EffectiveEntitlement read model from current User.plan only, no provider calls.
- Phase 4-D3C: projection compatibility tests and optional internal projection helper, no access-check migration.
- Phase 4-D3D: access-check adapter planning and static regression coverage.
- Phase 4-D3E: schema implementation readiness revisit.
- Phase 4-D4: provider adapter planning/implementation only after approval.

Clarifications:

- Names are provisional.
- Each phase requires separate explicit approval.

## 17. Rollback Gate

- First runtime phase must be removable without data loss.
- It must not require DB migration rollback.
- It must not alter access checks.
- It must not alter payments checkout behavior.
- It must not alter User.plan.
- It must not alter Subscription persistence.
- Rollback should be git revert only for first skeleton phase.
- Later schema phases require separate rollback plan.

## 18. Review And Commit Gate

- Cursor must not commit without instruction.
- Validate expected file scope.
- Run git diff --check.
- Run mojibake scan including untracked files.
- Run pnpm test/lint/build with exit codes.
- Confirm no sensitive files changed.
- Commit only after explicit user approval.
- Push only after post-commit review.

## 19. P0 Blockers Before First Runtime Implementation

- clean working tree
- readiness checklist accepted
- first implementation scope accepted
- tests accepted
- rollback gate accepted
- User.plan compatibility accepted
- fail-closed behavior accepted
- payments safety gate preservation accepted
- no provider treated as approved
- no schema/migration required for skeleton
- no package/env changes required for skeleton

## 20. Implementation Non-Goals

- No runtime implementation in this phase.
- No EntitlementService code in this phase.
- No schema changes in this phase.
- No migrations in this phase.
- No provider adapter implementation in this phase.
- No Apple implementation in this phase.
- No Google implementation in this phase.
- No web provider replacement in this phase.
- No access-check changes in this phase.
- No User.plan semantic change in this phase.
- No package changes in this phase.
- No env changes in this phase.
- No deployment in this phase.

## 21. Current Status

- This readiness checklist is documentation-only.
- Entitlement runtime implementation has not started.
- Entitlement schema implementation has not started.
- Provider adapters have not started.
- User.plan remains current compatibility projection.
- Current access checks remain unchanged.
- Paid access remains fail-closed unless explicitly approved and verified.
