# Entitlement Service Interface Design

## 1. Purpose

- Define the future EntitlementService interface before implementation.
- Convert entitlement model, schema, and platform mapping plans into a service boundary.
- Preserve User.plan compatibility during staged migration.
- Define fail-closed behavior for access checks.
- Define adapter boundaries for Apple, Google, web provider, Lemon legacy/web integration, and manual/internal sources.
- This document is planning only.
- It does not implement runtime code, schema, migrations, package changes, env changes, provider integrations, or deployment.
- Cross-reference User.plan projection compatibility plan:
  - `docs/USER_PLAN_PROJECTION_COMPATIBILITY_PLAN.md`
- Cross-reference entitlement runtime implementation readiness checklist:
  - `docs/ENTITLEMENT_RUNTIME_IMPLEMENTATION_READINESS_CHECKLIST.md`

## 2. Current Project Position

- User.plan is the current effective access projection.
- Story generation and child limits currently depend on plan-based backend enforcement.
- Lemon integration exists but is not production-approved.
- Paid checkout remains disabled by default through runtime safety gate.
- Apple and Google billing are documented but not implemented.
- Provider-neutral entitlement service has not started.
- Current Subscription persistence remains untouched.

## 3. Service Boundary Principle

EntitlementService should be the only backend boundary that converts provider-specific billing state into effective application access.

- Routes and middleware should not interpret provider product IDs directly.
- Apple product IDs, Google product IDs/base plans, Lemon variant IDs, provider statuses, purchase tokens, and webhook event names are adapter inputs only.
- Access checks should consume EffectiveEntitlement.
- Unknown or unsafe provider state must fail closed.
- User.plan may remain a compatibility projection until replaced.

## 4. Proposed Conceptual Interfaces

Names are conceptual. No TypeScript interface is created in this phase. Final naming can change during implementation review.

| Interface | Purpose | Runtime Phase | Notes |
| --- | --- | --- | --- |
| EntitlementService | Main access/entitlement orchestration boundary | D2B+ | Single backend entry point for effective entitlement |
| EntitlementAdapter | Normalizes provider-specific inputs | D2B+ | Apple/Google/Web/Manual adapter contract |
| EntitlementProjector | Projects effective entitlement to compatibility surfaces | D2B+ | Includes User.plan projection behavior |
| EntitlementReconciler | Recomputes and reconciles state across sources | D2B+ | Supports deterministic recompute workflows |
| EntitlementAuditWriter | Emits safe entitlement audit records | D2B+ | Must never write secrets |
| EntitlementEvidenceVerifier | Verifies provider evidence and proof state | D2B+ | Produces safe verification outcomes |
| EntitlementConflictResolver | Resolves multi-source entitlement conflicts | D2B+ | Applies conservative conflict policy |
| EntitlementReadModel | Read-optimized entitlement view | D2B+ | Supports access checks and display state |

## 5. EffectiveEntitlement Return Shape

Conceptual return shape should include:

- userId
- plan
- status
- sourceType
- sourceRecordId
- validFrom
- validUntil
- computedAt
- grantsPaidAccess
- reason
- safeErrorCode
- projectedUserPlan

Pseudo-TypeScript only:

```ts
// Pseudo-TypeScript shape only - not implementation
type EffectiveEntitlement = {
  userId: string;
  plan: "FREE" | "INDIVIDUAL" | "FAMILY" | "SCHOOL";
  status: string; // normalized status
  sourceType: string | null;
  sourceRecordId: string | null;
  validFrom: string | null;
  validUntil: string | null;
  computedAt: string;
  grantsPaidAccess: boolean;
  reason: string;
  safeErrorCode: string | null;
  projectedUserPlan: "FREE" | "INDIVIDUAL" | "FAMILY" | "SCHOOL";
};
```

Rules:

- plan should be one of FREE, INDIVIDUAL, FAMILY, SCHOOL.
- status should be normalized.
- grantsPaidAccess is derived, not provider-supplied.
- safeErrorCode must not contain secrets.
- provider raw evidence must not be returned.

## 6. EntitlementService Methods

These are future conceptual methods only. No method is implemented now. Access checks should start with compatibility methods before direct replacement.

| Method | Input | Output | Fail-Closed Behavior | Notes |
| --- | --- | --- | --- | --- |
| getEffectiveEntitlement(userId) | userId | EffectiveEntitlement | Return FREE-like safe projection on unsafe state | Primary read method for access decisions |
| recomputeEffectiveEntitlement(userId, reason) | userId, reason | EffectiveEntitlement | On failure, return safe FREE projection and safe error code | Deterministic recompute entry point |
| projectEffectivePlanToUser(userId, effectiveEntitlement) | userId, effectiveEntitlement | projection result | No paid grant on projection failure | Compatibility projection into User.plan |
| getPlanForAccessCheck(userId) | userId | normalized plan/access shape | FREE fallback when unresolved | Transition helper for existing checks |
| canGenerateStory(userId) | userId | allow/deny + reason | Deny as FREE when unresolved | Story limit compatibility boundary |
| getChildLimit(userId) | userId | numeric limit + reason | FREE limit on unresolved state | Child limit compatibility boundary |
| getSubscriptionDisplayState(userId) | userId | display-safe subscription state | Safe fallback state without paid grant | Parent-facing account display path |
| ingestNormalizedEntitlementEvent(event) | normalized event | processing result | Ignore/record safely without granting paid access | Idempotent event ingestion |
| reconcileProviderSource(sourceType, providerReference) | sourceType, providerReference | reconciliation result | No paid grant on verification or reconcile failure | Source reconcile boundary |
| restorePurchases(userId, sourceType) | userId, sourceType | restore result | No paid access without verification | Parent-facing restore operation |
| revokeProviderSource(sourceType, providerReference, reason) | sourceType, providerReference, reason | revocation result | Conservative revoke handling with audit | Should not impact unrelated valid sources |

## 7. Access Check Integration Design

Future integration targets:

- `services/api/src/middleware/plans.middleware.ts`
- `services/api/src/routes/children.ts`
- `services/api/src/routes/stories.ts`
- `services/api/src/routes/payments.ts`

Staged migration:

- Stage 1: keep current plan enforcement and add service behind User.plan projection.
- Stage 2: use EntitlementService to compute projection into User.plan.
- Stage 3: update access checks to call EntitlementService directly.
- Stage 4: reduce direct User.plan dependency after validation.

## 8. Story Generation Limit Integration

- Current FREE monthly limit remains 3 stories/month.
- Paid plans currently have unlimited story generation by plan policy.
- EntitlementService should eventually expose a plan/access result consumed by story generation enforcement.
- Unknown entitlement should behave as FREE.
- Service failure should not grant paid access.
- Story generation should not depend on provider-specific product IDs.

## 9. Child Limit Integration

- Current child limits remain:
  - FREE: 1
  - INDIVIDUAL: 1
  - FAMILY: 4
  - SCHOOL: unlimited or policy-defined Infinity
- EntitlementService should eventually provide plan state used by child limit enforcement.
- Unknown entitlement should behave as FREE.
- Child limits should remain parent-account based.
- Children are not buyers or account owners.

## 10. Subscription Display Integration

- Account/subscription screens need display state.
- Display state can include provider source, plan, status, renewal/expiry period, disabled checkout state, and support-safe messages.
- Display state must not expose raw provider evidence.
- Lemon should remain marked as implemented but not production-approved unless approval changes.
- Restore/recover purchase state must be parent-facing in future mobile flows.

## 11. Provider Adapter Boundary

Adapters normalize provider-specific state. Adapters do not directly grant access. Adapters emit normalized entitlement events or source updates. Verification failures produce no paid access.

| Adapter | Input Examples | Output | Verification Responsibility | Notes |
| --- | --- | --- | --- | --- |
| Lemon/Web adapter | Lemon webhook events, variant IDs, statuses | normalized events/source updates | Verify signature and event integrity | Legacy web integration, still fail-closed |
| Apple App Store adapter | StoreKit evidence, App Store server notifications | normalized events/source updates | Verify Apple evidence/state before grant | No direct route-level grant |
| Google Play adapter | Purchase token evidence, RTDN/server verification state | normalized events/source updates | Verify token/state before grant | No direct route-level grant |
| Manual/Internal adapter | approved internal action request | normalized events/source updates | Verify actor authorization and policy | Future-only controlled path |
| Future web provider adapter | provider webhook/evidence payload | normalized events/source updates | Provider-specific verification boundary | Must fit same service contract |

## 12. Apple Adapter Service Boundary

- Future Apple adapter accepts StoreKit/App Store evidence or server notification evidence.
- Apple product IDs map to EntitlementPlan through platform mapping docs.
- Apple transaction status maps to EntitlementStatus.
- Restore purchases must verify before granting access.
- App Store secrets, signed payloads, JWTs, and private story content must not be logged.
- No Apple code is implemented in this phase.

## 13. Google Adapter Service Boundary

- Future Google adapter accepts Play Billing purchase token evidence and RTDN/server verification evidence.
- Google product IDs/base plans map to EntitlementPlan through Android mapping docs.
- Google lifecycle state maps to EntitlementStatus.
- Restore/recover purchases must verify before granting access.
- Purchase tokens, service account credentials, signed payloads, and private story content must not be logged.
- No Google code is implemented in this phase.

## 14. Web Provider Adapter Boundary

- Lemon remains paused/not approved for production launch.
- Future web provider replacement must fit the same adapter interface.
- Web checkout provider must not become canonical entitlement model.
- Provider approval and verification are required before paid launch.
- Current runtime safety gate must remain in place until a provider is approved and verified.
- No provider replacement is implemented in this phase.

## 15. Manual/Internal Source Boundary

- Manual/internal entitlement source is future-only.
- It must require strict authorization.
- It must have audit logging.
- It must not bypass safety, privacy, or account ownership rules.
- It should be disabled unless explicitly implemented and approved.
- It must not expose secrets or private story content.

## 16. User.plan Projection Design

- User.plan remains the current compatibility projection.
- EntitlementService can compute EffectiveEntitlement and project plan into User.plan during staged migration.
- EntitlementService migration should preserve User.plan projection compatibility until access checks are safely moved.
- User.plan projection must be deterministic.
- Projection updates should be idempotent.
- Direct semantics of User.plan must not be changed without a separate schema/runtime phase.
- User.plan is not provider evidence.

## 17. Fail-Closed Service Behavior

Fail-closed cases:

- service cannot load entitlement records
- provider verification fails
- provider product ID unknown
- provider status unknown
- event payload malformed
- source disabled
- provider not approved
- entitlement expired
- entitlement revoked/refunded
- conflict cannot be resolved
- user not found
- parent account linkage missing

Rules:

- Fail-closed means no paid access grant.
- Fail-closed should not delete records.
- User-facing messaging should be recoverable.
- Logs must be safe and non-secret.

## 18. Idempotency and Reconciliation Design

- EntitlementService should support idempotent event processing.
- Duplicate provider events should not duplicate grants.
- Late revocations/refunds must be processable.
- Reconciliation jobs may be needed later.
- Recompute operations should be deterministic.
- Idempotency keys belong in future schema design, not runtime code in this phase.

## 19. Conflict Resolution Service Design

- Multiple active sources can exist.
- Initial rule should prefer highest valid active entitlement.
- Revoked or invalid source should not cancel independent valid sources automatically.
- Manual overrides require special policy and audit.
- Conflict resolution must be tested separately.
- Unresolvable conflicts fail closed or fall back to safe FREE/projection according to final policy.

## 20. Security and Privacy Requirements

- Do not log API keys, JWTs, provider secrets, signed payloads, raw purchase tokens, private story content, or raw payment payloads.
- Service outputs should use safe error codes.
- Provider evidence should be minimized.
- Admin/support views must not expose secrets.
- Privacy/data export/account deletion review must include entitlement records once implemented.
- Manual overrides require audit trail.

## 21. Testing Strategy

Future test categories:

- EffectiveEntitlement shape tests
- User.plan projection tests
- FREE fallback tests
- story generation compatibility tests
- child limit compatibility tests
- Apple product mapping tests
- Google product/base plan mapping tests
- unknown product ID fails closed
- unknown status fails closed
- provider disabled fails closed
- duplicate event idempotency tests
- revocation/refund tests
- expired entitlement tests
- conflict resolution tests
- no secrets in logs/source tests
- subscription display state tests
- restore/recover purchase tests

## 22. Implementation Phase Breakdown

Proposed phases:

- Phase 4-D2B-A - service interface code skeleton plan
- Phase 4-D2B-B - entitlement read model and User.plan projection implementation
- Phase 4-D2B-C - access-check compatibility adapter
- Phase 4-D2B-D - unit/static regression coverage
- Phase 4-D2B-E - Lemon/web adapter normalization behind safety gate
- Phase 4-D2B-IOS - Apple adapter service implementation plan
- Phase 4-D2B-ANDROID - Google adapter service implementation plan

Clarifications:

- This document starts none of these phases.
- Service interface implementation must not start before runtime readiness gate acceptance.
- Each future phase requires explicit approval.

## 23. P0 Blockers Before Service Implementation

- Schema design accepted.
- Interface design accepted.
- User.plan projection behavior accepted.
- Fail-closed rules accepted.
- Adapter boundaries accepted.
- Idempotency strategy accepted.
- Conflict resolution initial rule accepted.
- Privacy/export/deletion implications reviewed.
- Regression test plan accepted.
- No provider treated as approved unless documented and verified.

## 24. Implementation Non-Goals

- No TypeScript service implementation in this phase.
- No Prisma schema changes in this phase.
- No migrations in this phase.
- No provider adapter implementation in this phase.
- No Apple implementation in this phase.
- No Google implementation in this phase.
- No web provider replacement in this phase.
- No access-check runtime changes in this phase.
- No package changes in this phase.
- No env changes in this phase.
- No deployment in this phase.

## 25. Current Status

- This service interface design is documentation-only.
- EntitlementService implementation has not started.
- Schema implementation has not started.
- Provider adapters have not started.
- User.plan remains current compatibility/effective projection.
- Current access checks remain unchanged.
- Paid access remains fail-closed unless explicitly approved and verified.
