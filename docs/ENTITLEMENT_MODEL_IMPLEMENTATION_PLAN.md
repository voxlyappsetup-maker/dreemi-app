# Entitlement Model Implementation Plan

## 1. Purpose

- Define the future implementation strategy for provider-neutral entitlements.
- Convert the entitlement design lock and platform mapping docs into an engineering plan.
- Keep Apple, Google, web provider, and manual/internal sources normalized.
- Preserve safe behavior while User.plan still exists.
- This document is planning only.
- It does not implement code, schema, migrations, provider integrations, package changes, env changes, or deployment.

## 2. Current Project Position

- Current production-safe state uses User.plan as the effective access projection.
- Current Lemon integration exists but is not approved for production launch.
- Current paid checkout is disabled by default through the runtime safety gate.
- Current child limits and story limits are enforced through backend logic using plan state.
- Existing Lemon-specific runtime code should not be removed in this phase.
- Apple and Google billing are documented but not implemented.
- Provider-neutral entitlement implementation has not started.

## 3. Canonical Entitlement Principle

Provider-specific billing events must be normalized into a single effective entitlement state before any access check.

- Access checks must not depend directly on Lemon variant IDs, Apple product IDs, Google product IDs, purchase tokens, or provider event names.
- Backend access checks should consume an effective entitlement result.
- Provider-specific records are evidence, not the canonical access model.
- Unknown, unverified, expired, revoked, or malformed provider states must fail closed.

## 4. Current Access Surfaces To Preserve

The following current surfaces must keep working during migration:

- story generation limit enforcement
- child profile limit enforcement
- subscription status/account display
- pricing/paywall availability behavior
- checkout disabled behavior while payments are not approved
- account deletion/export behavior
- existing static regression tests for payments and plans

Likely files by path, for preservation context only:

- `services/api/src/middleware/plans.middleware.ts`
- `services/api/src/routes/children.ts`
- `services/api/src/routes/payments.ts`
- `services/api/src/config/billing.ts`
- `apps/web/src/app/[locale]/pricing/page.tsx`
- `apps/web/src/components/LandingPricing.tsx`

## 5. Proposed Future Domain Concepts

These are planning concepts only. Names may change during implementation review. No schema or enum changes happen in this phase.

| Concept | Purpose | Provider-Specific? | Notes |
| --- | --- | --- | --- |
| EntitlementSource | Identifies source family for entitlement evidence | No | Normalized source identity used for routing and policy |
| EntitlementPlan | Internal paid/free access tier | No | FREE, INDIVIDUAL, FAMILY, SCHOOL internal tiers |
| EntitlementStatus | Normalized current lifecycle state | No | Unified status semantics across sources |
| EntitlementGrant | Time-scoped plan grant from one source | No | Contains validity window and derived status |
| EntitlementEvent | Immutable lifecycle event record | No | Input to idempotent state transitions |
| EffectiveEntitlement | Final computed account access result | No | Output consumed by access checks |
| ProviderEvidence | Minimal provider proof needed for verification | Yes | Includes source-specific receipt/token metadata |
| BillingPeriod | Normalized period metadata | No | Monthly/yearly metadata, not access logic by itself |
| EntitlementConflict | Structured overlap/conflict between valid grants | No | Used by conflict resolver and auditing |
| ManualOverride | Controlled internal grant/revoke override | No | Requires strict authorization and audit |

## 6. EntitlementSource Mapping

| Source | Description | Current Status | Notes |
| --- | --- | --- | --- |
| lemon_squeezy | existing web provider integration | implemented but not approved for production | kept fail-closed |
| apple_app_store | future iOS IAP source | not implemented | StoreKit and server verification needed |
| google_play | future Android billing source | not implemented | Play Billing, token verification, RTDN needed |
| manual_internal | future admin/manual source | not implemented | requires strict controls and audit trail |
| migration_legacy_user_plan | compatibility projection from current User.plan | planning only | useful during transition |
| future_web_provider | future replacement for Lemon | unresolved | must fit same model |

## 7. EntitlementPlan Mapping

Normalized plan tiers:

- FREE
- INDIVIDUAL
- FAMILY
- SCHOOL

| EntitlementPlan | Current Meaning | Access Projection | Mobile V1 Position | Notes |
| --- | --- | --- | --- | --- |
| FREE | Default non-paid state | Limited plan behavior | required | FREE is default and not purchased |
| INDIVIDUAL | Parent paid single-child-oriented tier | Paid access | initial commercial candidate | Internal access tier, not provider product ID |
| FAMILY | Parent paid family tier | Paid access | initial commercial candidate | Internal access tier, not provider product ID |
| SCHOOL | Institutional-oriented tier | Paid access | deferred | Deferred until school positioning, compliance, support, and platform suitability are approved |

## 8. EntitlementStatus Mapping

Normalized statuses:

- none
- active
- trialing
- grace_period
- past_due
- billing_issue
- active_until_expiry
- paused
- expired
- canceled
- revoked
- unknown

| EntitlementStatus | Grants Paid Access? | Default Behavior | Notes |
| --- | --- | --- | --- |
| none | No | fail closed to FREE | No active grant evidence |
| active | Yes | allow paid access | Verified paid entitlement |
| trialing | Yes | allow paid access while valid | Only if trialing semantics are supported |
| grace_period | Policy pending | conservative handling pending review | Final policy required before implementation |
| past_due | Policy pending | conservative handling pending review | Final policy required before implementation |
| billing_issue | No | fail closed to FREE by default | May be revised only by explicit policy decision |
| active_until_expiry | Yes | allow until verified expiry | Time-bounded paid access |
| paused | No | fail closed to FREE by default | Requires explicit later policy to grant |
| expired | No | fail closed to FREE | Grant ended |
| canceled | No | fail closed to FREE by default | If immediate effect, no paid grant |
| revoked | No | fail closed to FREE | Revoked/refunded source should not grant |
| unknown | No | fail closed to FREE | Unknown must fail closed |

## 9. Effective Entitlement Calculation

Future algorithm in planning form:

1. Load all active and recently relevant entitlement sources for the parent account.
2. Verify provider evidence where required.
3. Normalize each source into EntitlementPlan, EntitlementStatus, valid_from, valid_until, and provider metadata.
4. Drop or quarantine unknown/unverified sources.
5. Apply revocation/expiry rules.
6. Resolve conflicts between multiple valid sources.
7. Produce EffectiveEntitlement.
8. Project to User.plan only if compatibility projection is still required.
9. Use EffectiveEntitlement for access checks.

Fail-closed rule:

- If effective entitlement cannot be computed safely, treat as FREE and log safely.

## 10. User.plan Compatibility Strategy

- User.plan currently acts as the effective access projection.
- User.plan should not be removed in the first implementation phase.
- Future entitlement logic may compute effective entitlement and then project the result into User.plan for backward compatibility.
- Existing child/story limits can continue using User.plan during a staged migration.
- Later phases may replace direct User.plan access checks with an entitlement service.
- Any removal or semantic change to User.plan requires separate schema and migration phase.

## 11. Proposed Future Prisma Model Direction

Conceptual table only, not code. This is not a final schema. No Prisma schema change is made in this phase. Final schema must be designed in a separate migration planning phase.

| Future Model | Purpose | Key Fields Conceptually | Migration Risk | Notes |
| --- | --- | --- | --- | --- |
| EntitlementSourceRecord | Stores normalized source-level state per account and source identity | account_id, source, provider_account_ref, normalized_status, valid_from, valid_until | Medium | Source uniqueness and backfill strategy required |
| EntitlementEventRecord | Stores immutable normalized lifecycle events | source_record_id, event_type, event_time, dedupe_key, raw_event_ref | Medium | Event ordering and replay behavior must be defined |
| ProviderEvidenceRecord | Stores minimized verification evidence metadata | source_record_id, evidence_type, token_hash/ref, verification_state, verified_at | High | Sensitive evidence minimization and protection required |
| EffectiveEntitlementSnapshot | Stores computed result for fast access and diagnostics | account_id, effective_plan, effective_status, computed_at, source_summary | Medium | Must avoid stale or conflicting cache semantics |
| ManualEntitlementOverride | Stores approved manual grant/revoke controls | account_id, override_type, target_plan, reason_code, expires_at, approved_by | High | Strict authorization and audit requirements |
| EntitlementAuditLog | Stores auditable changes and decisions | actor, action, target_ref, before_state, after_state, reason, timestamp | Medium | Required for support and incident traceability |

Sensitive provider evidence must be minimized and protected.

## 12. Provider Adapter Responsibilities

Adapters in scope for future implementation:

- Lemon/Web adapter
- Apple adapter
- Google adapter
- Manual/internal adapter

Each adapter should:

- validate provider evidence
- map provider product IDs to EntitlementPlan
- map provider lifecycle states to EntitlementStatus
- emit normalized EntitlementEvent
- support idempotency
- avoid unsafe logging
- never directly grant access without normalization

## 13. Idempotency Strategy

- Provider events can be retried, duplicated, delayed, or out of order.
- Future implementation must use provider event IDs, transaction IDs, purchase tokens, notification IDs, or equivalent dedupe keys where available.
- Duplicate events must not create duplicate grants.
- Revocation/refund/expiry events must be safely processed even if received late.
- Webhook and server-notification handlers must be idempotent.
- Idempotency behavior needs static and runtime tests.

## 14. Fail-Closed Rules

Required fail-closed cases:

- unknown provider product ID
- unknown provider status
- missing verification evidence
- invalid signature
- invalid purchase token
- failed Apple/Google server verification
- provider disabled
- provider not approved for production
- expired entitlement
- revoked/refunded entitlement
- entitlement conflict that cannot be resolved safely
- malformed event payload
- missing parent account linkage

Rules:

- Fail-closed should not delete data.
- Fail-closed should avoid granting paid access.
- User-facing messaging should be calm and recoverable.

## 15. Conflict Resolution Strategy

Future conflict categories:

- Apple active + Google active
- web active + Apple active
- manual override + provider active
- higher-tier active + lower-tier active
- revoked provider source + another active provider source
- expired source + active source

Initial planning rule:

- Compute access from the highest valid active entitlement, unless manual/internal policy overrides are explicitly designed.
- Revoked or invalid sources must not cancel other independent valid sources automatically.
- Final conflict resolution must be implemented in a dedicated phase.

## 16. Security and Privacy Guardrails

- Do not log API keys, JWTs, provider secrets, signed payloads, purchase tokens, raw payment payloads, or private story content.
- Store only provider evidence needed for verification, audit, support, and compliance.
- Keep reporting/privacy inventory updated when entitlement records are implemented.
- Account deletion/data export implications must be reviewed before schema implementation.
- Manual overrides require audit trail and strict authorization.
- Admin tooling must not expose secrets.

## 17. Access Enforcement Migration Strategy

Staged path:

- Stage 1: keep User.plan projection and add entitlement service behind it.
- Stage 2: calculate effective entitlement from provider sources and project into User.plan.
- Stage 3: update backend access checks to call entitlement service directly.
- Stage 4: reduce User.plan to cache/projection or legacy field if appropriate.
- Stage 5: only after proven safe, consider semantic cleanup or schema migration.

Clarifications:

- This document does not start any stage.
- Each stage needs separate phase, tests, and review.

## 18. Regression Test Strategy

Future tests:

- billing catalog mapping tests
- unknown provider product ID fails closed
- unknown status fails closed
- provider disabled blocks checkout/grants
- Apple product mapping tests
- Google product/base plan mapping tests
- idempotent webhook/server-notification processing
- duplicate event handling
- refund/revocation removes provider access
- expired entitlement removes provider access
- active_until_expiry grants until expiry
- conflict resolution tests
- User.plan projection tests
- child/story limit compatibility tests
- data export/deletion implications tests
- no secrets in logs/static source tests

## 19. Implementation Phase Breakdown

Proposed future phases:

- Phase 4-D2A - entitlement schema design review
- Phase 4-D2B - entitlement service interface design
- Phase 4-D2C - User.plan projection compatibility implementation
- Phase 4-D2D - Lemon/web adapter normalization behind safety gate
- Phase 4-D2E - static and unit regression coverage
- Phase 4-D2F - data export/account deletion impact review
- Phase 4-D2-IOS - Apple adapter implementation plan
- Phase 4-D2-ANDROID - Google adapter implementation plan
- Phase 4-D3-IOS - StoreKit implementation phase
- Phase 4-D3-ANDROID - Google Play Billing implementation phase

## 20. P0 Blockers Before Entitlement Implementation

- Final target domain concepts accepted.
- User.plan compatibility strategy accepted.
- Schema design reviewed but not applied until approved.
- Provider adapter boundaries accepted.
- Fail-closed behavior accepted.
- Idempotency strategy accepted.
- Conflict resolution initial rule accepted.
- Data export/deletion implications reviewed.
- Privacy/data safety inventory updated as needed.
- Regression test plan accepted.
- No provider-specific IDs used directly in access checks.
- No payment provider treated as approved unless documented and verified.

## 21. Implementation Non-Goals

- No code changes in this phase.
- No Prisma schema changes in this phase.
- No migrations in this phase.
- No provider integration changes in this phase.
- No Apple implementation in this phase.
- No Google implementation in this phase.
- No web provider replacement in this phase.
- No package changes in this phase.
- No env changes in this phase.
- No deployment in this phase.
- No removal of User.plan in this phase.

## 22. Current Status

- This plan is documentation-only.
- Entitlement implementation has not started.
- Schema design has not been finalized.
- Migrations have not started.
- Apple and Google adapters have not started.
- Web provider replacement remains unresolved.
- User.plan remains the current effective access projection.
- Paid access remains fail-closed unless explicitly approved and verified.
