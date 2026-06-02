# User.plan Projection Compatibility Plan

## 1. Purpose

- Define how User.plan remains a safe compatibility projection during future entitlement migration.
- Preserve current access enforcement behavior while EntitlementService and provider-neutral records are introduced later.
- Prevent provider-specific IDs from entering access checks.
- Keep paid access fail-closed unless explicitly approved and verified.
- This document is planning only.
- It does not implement runtime code, Prisma schema, migrations, provider integrations, package changes, env changes, mobile project changes, or deployment.

## 2. Current Project Position

- User.plan currently represents the effective access tier used by backend enforcement.
- Current story generation limits and child profile limits depend on plan state.
- Current paid checkout is disabled by default through the runtime safety gate.
- Lemon integration exists but is not production-approved.
- Apple and Google billing are documented but not implemented.
- EntitlementService is documented but not implemented.
- Future entitlement schema is documented but not implemented.
- This phase does not change any current behavior.

## 3. Compatibility Principle

User.plan remains the compatibility projection until all access checks safely consume EffectiveEntitlement.

- User.plan is not provider evidence.
- User.plan should not store provider-specific IDs.
- User.plan should not be removed in the first entitlement implementation phase.
- EntitlementService may later compute EffectiveEntitlement and project the resulting plan into User.plan.
- Access checks can migrate from User.plan to EntitlementService only after tests prove compatibility.
- Unknown entitlement must behave as FREE.

## 4. Current User.plan Meanings

| User.plan | Current Access Meaning | Current Source | Compatibility Position | Notes |
| --- | --- | --- | --- | --- |
| FREE | default limited access | direct User.plan usage | unchanged compatibility baseline | FREE is safe default |
| INDIVIDUAL | paid access tier | direct User.plan usage | preserved during migration | primary commercial tier |
| FAMILY | paid access tier | direct User.plan usage | preserved during migration | primary commercial tier |
| SCHOOL | paid access tier | direct User.plan usage | preserved with explicit policy decisions | deferred for broader support/compliance/platform review |

Clarifications:

- FREE is the safe default.
- INDIVIDUAL and FAMILY are primary commercial tiers.
- SCHOOL remains deferred for broader support/compliance/platform review.
- Plan names are internal access tiers, not payment-provider product IDs.

## 5. Current Access Surfaces Depending on Plan

| Surface | Current Dependency | Future Migration Direction | Risk If Broken | Files To Review Later |
| --- | --- | --- | --- | --- |
| story generation monthly limit | middleware reads User.plan | route through EntitlementService compatibility read | paid/free limits may regress | `services/api/src/middleware/plans.middleware.ts`, `services/api/src/routes/stories.ts` |
| child profile limit | route reads User.plan | route through EntitlementService compatibility read | child creation limits may regress | `services/api/src/routes/children.ts` |
| subscription/account display | user/subscription plan display | combine User.plan with service display model | confusing parent account status | `services/api/src/routes/payments.ts`, `services/api/src/routes/auth.ts` |
| checkout/paywall availability | runtime safety gate plus payment status | retain gate, add service-aware display state later | paid checkout may open unsafely | `services/api/src/config/billing.ts`, `services/api/src/routes/payments.ts`, `apps/web/src/app/[locale]/pricing/page.tsx`, `apps/web/src/components/LandingPricing.tsx` |
| account export | export includes plan/subscription context | include safe projection summary later | inaccurate export projection history | `services/api/src/routes/auth.ts` |
| account deletion | deletion interacts with user/subscription persistence | preserve behavior while records evolve | unexpected retention/deletion issues | `services/api/src/routes/auth.ts` |
| payments webhook entitlement updates | webhook updates User.plan and subscription | normalize through service projection workflow later | incorrect paid/free transitions | `services/api/src/routes/payments.ts`, `services/api/src/config/billing.ts` |
| static regression tests | tests assert gate/plan behavior | extend with projection compatibility tests | silent behavior drift | `services/api/src/routes/payments.security-regression.test.ts`, `services/api/src/config/billing.test.ts` |

## 6. Projection Source of Truth Strategy

- Future provider-specific records are evidence.
- Future EffectiveEntitlement is the normalized access result.
- User.plan is the compatibility projection.
- Access checks may initially continue using User.plan.
- Projection must be deterministic and idempotent.
- Projection must never grant paid access from unknown or unverified provider state.
- Projection must fail closed to FREE when computation is unsafe.

## 7. EffectiveEntitlement To User.plan Mapping

| EffectiveEntitlement.plan | EffectiveEntitlement.status | grantsPaidAccess | Projected User.plan | Notes |
| --- | --- | --- | --- | --- |
| FREE | any | false | FREE | safe default |
| INDIVIDUAL | active | true | INDIVIDUAL | paid active mapping |
| FAMILY | active | true | FAMILY | paid active mapping |
| SCHOOL | active | true | SCHOOL only when explicitly enabled | requires explicit commercial/platform readiness |
| INDIVIDUAL | trialing | true if valid | INDIVIDUAL | valid trialing mapping |
| FAMILY | trialing | true if valid | FAMILY | valid trialing mapping |
| any paid plan | unknown | false | FREE | unknown status fail-closed |
| any paid plan | expired | false | FREE | expired fail-closed |
| any paid plan | canceled | false | FREE | canceled fail-closed |
| any paid plan | revoked | false | FREE | revoked fail-closed |
| any paid plan | verification_failed | false | FREE | verification fail-closed |

Clarifications:

- Final status names may be normalized differently during implementation.
- Unknown status must fail closed.
- SCHOOL projection requires explicit commercial/platform readiness decision.

## 8. Projection Timing Strategy

Future options:

- on provider event ingestion
- on restore/recover purchase
- on account/subscription page load
- on access check when cache is stale
- scheduled reconciliation job
- manual support/admin reconciliation

Recommended direction:

- First implementation should use explicit recompute points and safe projection.
- Avoid expensive provider verification inside every access check.
- Use safe cached projection only with clear recompute rules.
- If recompute fails, do not grant new paid access.

## 9. Story Generation Compatibility

- FREE monthly story limit remains 3.
- Paid plans currently have unlimited generation by policy.
- During migration, story generation can continue reading User.plan.
- Later, story generation can call EntitlementService.
- Unknown entitlement or service failure should behave as FREE.
- Story generation must never depend on provider-specific product IDs.

## 10. Child Limit Compatibility

- Current child limits remain:
  - FREE: 1
  - INDIVIDUAL: 1
  - FAMILY: 4
  - SCHOOL: Infinity or policy-defined unlimited
- During migration, child creation can continue reading User.plan.
- Later, child routes can call EntitlementService.
- Unknown entitlement or service failure should behave as FREE.
- Children are never buyers or account owners.

## 11. Payments Runtime Safety Gate Compatibility

- Current paid checkout remains disabled by default unless payments are explicitly enabled and provider is explicitly approved.
- Lemon remains implemented but not production-approved.
- Projection logic must not treat Lemon env presence as approval.
- Provider approval and verification must be separate from provider code existence.
- Web provider replacement must not bypass projection rules.
- Runtime safety gate must remain until replacement provider/platform implementation is approved and verified.

## 12. Subscription Display Compatibility

- Account/subscription display may need both current User.plan and future EffectiveEntitlement display state.
- Display state should be parent-facing.
- Display state must not expose raw provider evidence.
- Checkout disabled state should remain clear when provider is not approved.
- Restore/recover purchase status should be parent-facing in future mobile flows.
- User-facing copy should be recoverable and not overclaim legal/compliance status.

## 13. Projection Write Safety Rules

- Do not write paid User.plan from unknown product ID.
- Do not write paid User.plan from unknown provider status.
- Do not write paid User.plan from unverified evidence.
- Do not write paid User.plan when provider is disabled.
- Do not write paid User.plan when provider is not approved.
- Do not write paid User.plan on malformed event.
- Do not write paid User.plan when parent user linkage is missing.
- Do not write paid User.plan when entitlement is expired, canceled, revoked, or refunded.
- Do not delete provider records as part of projection failure.
- Use safe logs and safe error codes.

## 14. User.plan Downgrade Strategy

- Expired, canceled, revoked, refunded, or failed verification should project to FREE unless another independent valid entitlement exists.
- Downgrade should be idempotent.
- Downgrade should avoid deleting stories, children, exports, or account data.
- Downgrade should restrict future paid actions according to plan.
- Existing generated content should remain accessible unless a separate product policy changes.
- User-facing messaging should be calm and recoverable.

## 15. Conflict Compatibility Strategy

Possible conflicts:

- Apple active and Google active.
- Web active and Apple active.
- Manual override and provider active.
- Higher-tier active and lower-tier active.
- Revoked source and independent active source.
- Expired source and independent active source.

Initial compatibility rule:

- Project the highest valid active entitlement.
- Invalid or revoked source should not cancel another independent valid active source.
- Manual override requires explicit policy and audit.
- Unresolvable conflict should fail closed or preserve current safe projection according to implementation phase policy.

## 16. User.plan Projection Audit Requirements

- Future projection writes should have audit records.
- Audit should capture previous plan, next plan, reason, source type, and safe event reference.
- Audit must not include secrets, raw signed payloads, raw purchase tokens, JWTs, API keys, or private story content.
- Manual/internal projection must include actor and reason.
- Audit retention requires later privacy/export/deletion review.

## 17. Data Export And Account Deletion Implications

- User.plan projection changes may become part of account history.
- Future export may include current projected plan and high-level entitlement summary.
- Future deletion must review entitlement source/evidence/audit records.
- Accounting/support retention exceptions require later policy/legal review.
- This phase does not change export or deletion behavior.

## 18. Testing Requirements Before Runtime Changes

Future tests:

- User.plan projection from active EffectiveEntitlement
- FREE fallback from unknown entitlement
- unknown product ID does not project paid plan
- unknown status does not project paid plan
- provider disabled does not project paid plan
- provider not approved does not project paid plan
- expired entitlement projects FREE
- canceled entitlement projects FREE
- revoked/refunded entitlement projects FREE
- active independent source survives another revoked source
- duplicate projection is idempotent
- child limit compatibility remains unchanged
- story limit compatibility remains unchanged
- checkout disabled state remains unchanged
- no provider-specific IDs in access-check tests
- no secrets in logs/static source tests
- export/deletion impact tests when schema exists

## 19. Staged Implementation Path

- Stage 0: documentation and design only.
- Stage 1: add EntitlementService read/projection skeleton behind tests.
- Stage 2: compute EffectiveEntitlement from current safe sources without changing access checks.
- Stage 3: project EffectiveEntitlement into User.plan for compatibility.
- Stage 4: keep story/child checks on User.plan while validating projection.
- Stage 5: migrate access checks to EntitlementService.
- Stage 6: reduce direct User.plan dependency only after proven safe.
- Stage 7: consider semantic cleanup in a separate schema/runtime phase.

Clarifications:

- This phase only documents the path.
- Each future stage requires explicit approval.

## 20. Rollback Strategy

- Initial implementation must not remove User.plan.
- Initial implementation must not remove current Subscription persistence.
- Runtime should be able to ignore future entitlement records if rollback is needed.
- Projection can fall back to current User.plan behavior during early stages.
- Failed projection should not delete account data.
- Rollback must preserve fail-closed paid access behavior.
- Rollback plan must be written before migrations or runtime access-check changes.

## 21. P0 Blockers Before Projection Implementation

- Entitlement schema design accepted.
- Entitlement service interface accepted.
- Projection mapping accepted.
- Fail-closed rules accepted.
- Downgrade behavior accepted.
- Conflict behavior accepted.
- Audit requirements accepted.
- Privacy/export/deletion implications reviewed.
- Regression test plan accepted.
- Provider approval model accepted.
- No provider-specific IDs used directly in access checks.

## 22. Implementation Non-Goals

- No runtime code changes in this phase.
- No EntitlementService implementation in this phase.
- No Prisma schema changes in this phase.
- No migrations in this phase.
- No payment provider implementation in this phase.
- No Apple implementation in this phase.
- No Google implementation in this phase.
- No web provider replacement in this phase.
- No access-check changes in this phase.
- No User.plan semantic change in this phase.
- No package changes in this phase.
- No env changes in this phase.
- No deployment in this phase.

## 23. Current Status

- This compatibility plan is documentation-only.
- User.plan remains the current effective access projection.
- EntitlementService is not implemented.
- Future entitlement schema is not implemented.
- Current access checks remain unchanged.
- Paid access remains fail-closed unless explicitly approved and verified.
