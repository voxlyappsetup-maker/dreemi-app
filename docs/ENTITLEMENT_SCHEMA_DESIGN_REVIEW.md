# Entitlement Schema Design Review

## 1. Purpose

- Review the future schema direction for provider-neutral entitlements.
- Translate the entitlement implementation plan into a database design review.
- Identify model candidates, relationships, risks, retention concerns, idempotency requirements, and migration constraints.
- Preserve User.plan compatibility during staged migration.
- This document is planning only.
- It does not modify Prisma schema, create migrations, implement code, add providers, change packages, change env files, or deploy.

## 2. Current Database Position

Current read-only observations from `prisma/schema.prisma`:

- User exists and currently includes plan state.
- Current payment/subscription persistence exists and may include legacy Stripe-named fields or provider-specific identifiers.
- Current access enforcement still relies on plan projection.
- Current schema does not yet contain provider-neutral entitlement source/event/evidence models.
- Lemon integration exists but is not production-approved.
- Paid checkout remains disabled by default through runtime safety gate.
- No schema changes are made in this phase.

Careful wording constraints:

- Do not rename or remove existing fields in this phase.
- Do not assume final schema without later review.

## 3. Schema Design Principles

- Provider evidence is not the access model.
- Access should derive from normalized effective entitlement.
- Unknown provider data must fail closed.
- Provider-specific IDs must not be used directly in access checks.
- Schema must support Apple, Google, future web provider, Lemon legacy/web integration, and manual/internal sources.
- Schema must support idempotent event handling.
- Schema must support data export and account deletion review.
- Schema must minimize sensitive provider evidence.
- Schema must preserve auditability without exposing secrets.
- Schema rollout must be staged and reversible.

## 4. Proposed Future Models Overview

Names are conceptual. Final Prisma model names may differ. This phase does not add any model.

| Proposed Model | Purpose | Required in First Schema Phase? | Sensitivity | Notes |
| --- | --- | --- | --- | --- |
| EntitlementSourceRecord | Source-level normalized entitlement state | Yes | Medium | Core account-to-source mapping |
| EntitlementEventRecord | Lifecycle events and processing state | Yes | Medium | Required for idempotency and replay safety |
| ProviderEvidenceRecord | Minimal verifiable provider evidence metadata | Yes | High | Must avoid raw secrets and raw signed payloads |
| EffectiveEntitlementSnapshot | Latest computed effective entitlement projection | Yes | Low | Supports diagnostics and compatibility projection |
| ManualEntitlementOverride | Controlled manual/internal entitlement adjustment | No | High | Defer unless explicitly approved |
| EntitlementAuditLog | Safe audit trail for entitlement transitions | Yes | Medium | Must avoid sensitive payload content |
| EntitlementConflictRecord | Persisted conflict resolution diagnostics | No | Medium | Can be deferred if resolver emits safe logs first |
| EntitlementProjectionRecord | Traceability for User.plan projection lifecycle | No | Low | Optional if snapshot/audit coverage is sufficient |

## 5. EntitlementSourceRecord Design

Purpose:

- Represents one provider-specific entitlement source linked to a parent User.
- Normalizes provider identity, product mapping, plan, status, validity window, and source metadata.

Conceptual fields:

| Field | Notes |
| --- | --- |
| id | Stable primary identifier |
| userId | Parent account owner reference |
| sourceType | lemon_squeezy, apple_app_store, google_play, future_web_provider, manual_internal, migration_legacy_user_plan |
| providerAccountId | Provider-side account reference when available |
| providerSubscriptionId | Provider-side subscription reference when applicable |
| providerPurchaseTokenHash | Hashed token reference when token semantics apply |
| providerProductId | Provider product identifier |
| providerBasePlanId | Provider base plan/period identifier where applicable |
| normalizedPlan | FREE/INDIVIDUAL/FAMILY/SCHOOL |
| normalizedStatus | Normalized entitlement status |
| validFrom | Start of validity window |
| validUntil | End of validity window |
| canceledAt | Cancellation intent timestamp where applicable |
| revokedAt | Revocation/refund timestamp where applicable |
| lastVerifiedAt | Last successful verification timestamp |
| createdAt | Record creation timestamp |
| updatedAt | Last update timestamp |

Field notes:

- providerPurchaseTokenHash should be considered instead of raw purchase token where possible.
- provider-specific IDs should be indexed only where needed for lookup/idempotency.
- raw provider secrets or signed payloads should not be stored here.
- userId must link to parent account.

## 6. EntitlementEventRecord Design

Purpose:

- Stores normalized lifecycle events from providers or internal actions.
- Enables idempotent processing and audit.

Conceptual fields:

| Field | Notes |
| --- | --- |
| id | Stable primary identifier |
| userId | Parent account owner reference |
| sourceRecordId | Link to EntitlementSourceRecord when resolvable |
| sourceType | Source category at event time |
| providerEventId | Provider event identifier when available |
| providerEventType | Provider-native event type |
| normalizedEventType | Normalized event label |
| idempotencyKey | Durable dedupe key |
| occurredAt | Provider event occurrence time |
| receivedAt | Ingestion timestamp |
| processedAt | Processing completion timestamp |
| processingStatus | pending, processed, failed, quarantined, ignored |
| errorCode | Safe non-secret error code |
| createdAt | Record creation timestamp |

Notes:

- idempotencyKey should be unique where provider semantics allow.
- duplicate events must not create duplicate grants.
- unknown events should be recorded safely without granting access.
- error details should be safe and non-secret.

## 7. ProviderEvidenceRecord Design

Purpose:

- Stores minimal provider evidence required for verification, support, and audit.

Conceptual fields:

| Field | Notes |
| --- | --- |
| id | Stable primary identifier |
| userId | Parent account owner reference |
| sourceRecordId | Link to EntitlementSourceRecord |
| sourceType | Source category |
| evidenceType | receipt, token_ref, notification_ref, verification_result_ref |
| evidenceHash | Hash/fingerprint of evidence where possible |
| evidenceSummaryJson | Minimal non-secret structured summary |
| verificationStatus | unverified, verified, invalid, expired |
| verifiedAt | Last verification timestamp |
| expiresAt | Evidence validity boundary if relevant |
| createdAt | Record creation timestamp |

Security notes:

- Do not store API keys, service account credentials, JWTs, shared secrets, provider secrets, raw signed payloads, raw purchase tokens, or private story content.
- Prefer hashes, summaries, or provider IDs where possible.
- Evidence retention must be reviewed for privacy/data export/account deletion.

## 8. EffectiveEntitlementSnapshot Design

Purpose:

- Stores the latest computed effective entitlement for compatibility, diagnostics, or performance.

Conceptual fields:

| Field | Notes |
| --- | --- |
| id | Stable primary identifier |
| userId | Parent account owner reference |
| effectivePlan | Computed normalized plan |
| effectiveStatus | Computed normalized status |
| sourceRecordId | Primary winning source reference when relevant |
| computedAt | Computation timestamp |
| validUntil | Snapshot validity boundary if applicable |
| computationReason | Safe explanation code |
| projectedToUserPlan | Whether projection to User.plan occurred |
| createdAt | Record creation timestamp |
| updatedAt | Last update timestamp |

Notes:

- Snapshot should not become a stale source of truth without recomputation rules.
- User.plan projection may continue during staged migration.
- Access checks may later use an entitlement service instead of direct User.plan.

## 9. ManualEntitlementOverride Design

Purpose:

- Allows future controlled support/admin access adjustments if explicitly approved.

Conceptual fields:

| Field | Notes |
| --- | --- |
| id | Stable primary identifier |
| userId | Parent account owner reference |
| overridePlan | Override target plan |
| overrideStatus | Override target status |
| reasonCode | Safe reason classification |
| adminActorId | Authorized operator reference |
| startsAt | Override start time |
| endsAt | Override planned end time |
| revokedAt | Explicit revocation time |
| createdAt | Record creation timestamp |
| updatedAt | Last update timestamp |

Guardrails:

- Not part of initial implementation unless separately approved.
- Requires strict authorization.
- Requires audit trail.
- Must never expose admin secrets.
- Must not bypass safety or privacy requirements.

## 10. EntitlementAuditLog Design

Purpose:

- Provides safe audit records for entitlement changes.

Conceptual fields:

| Field | Notes |
| --- | --- |
| id | Stable primary identifier |
| userId | Parent account owner reference |
| actorType | system, provider, admin_internal |
| actorId | Safe actor reference where available |
| action | Transition label |
| sourceType | Source category |
| sourceRecordId | Related source record |
| eventRecordId | Related event record |
| previousPlan | Prior normalized plan |
| nextPlan | Next normalized plan |
| previousStatus | Prior normalized status |
| nextStatus | Next normalized status |
| createdAt | Audit event timestamp |

Notes:

- Audit log should avoid sensitive payloads.
- Audit log should support support/debug workflows.
- Audit retention must be reviewed before implementation.

## 11. Current Subscription Model Transition

- Current Subscription model or subscription persistence should not be removed in the first entitlement schema phase.
- Existing Lemon/web-related fields may remain during compatibility period.
- Future migration may map current subscription records into EntitlementSourceRecord.
- Legacy Stripe-named fields should not be renamed casually without a dedicated migration plan.
- Existing checkout/webhook behavior must remain fail-closed while provider is not approved.
- Transition should preserve account deletion and export behavior.

## 12. User.plan Compatibility and Projection

- User.plan remains current effective access projection.
- First entitlement implementation should preserve User.plan.
- Future effective entitlement may project into User.plan for compatibility.
- Direct access checks can migrate later to entitlement service.
- Removal or semantic change to User.plan requires a separate schema/migration phase.
- User.plan must not be treated as provider evidence.

## 13. Relationship Design

Conceptual relationship list:

- User 1-to-many EntitlementSourceRecord
- EntitlementSourceRecord 1-to-many EntitlementEventRecord
- EntitlementSourceRecord 1-to-many ProviderEvidenceRecord
- User 1-to-one or 1-to-many EffectiveEntitlementSnapshot depending final design
- User 1-to-many ManualEntitlementOverride
- User 1-to-many EntitlementAuditLog

Clarifications:

- Relationship cardinality is conceptual.
- Final relation direction and indexes require separate schema review.
- Parent User is the owner of entitlement records.

## 14. Index and Uniqueness Strategy

Candidate indexes:

- EntitlementSourceRecord.userId
- EntitlementSourceRecord.sourceType
- EntitlementSourceRecord.providerSubscriptionId
- EntitlementSourceRecord.providerProductId
- EntitlementSourceRecord.normalizedStatus
- EntitlementSourceRecord.validUntil
- EntitlementEventRecord.idempotencyKey unique where possible
- EntitlementEventRecord.providerEventId
- EntitlementEventRecord.userId
- ProviderEvidenceRecord.sourceRecordId
- EffectiveEntitlementSnapshot.userId

Clarifications:

- Unique constraints must be reviewed against provider semantics.
- Apple, Google, and web providers may have different stable identifiers.
- Avoid indexing raw sensitive tokens.
- Consider hashes for token-based lookup.

## 15. Idempotency Schema Requirements

- Provider event handlers must handle duplicate, delayed, and out-of-order events.
- Schema needs durable idempotency keys.
- Provider-specific event IDs should be stored when safe.
- Purchase tokens or transaction IDs should be hashed or minimized when possible.
- Revocation/refund/expiry must remain processable even if received late.
- Failed processing should be retryable without duplicate grants.

## 16. Deletion and Export Implications

- Account deletion must be reviewed before entitlement models are implemented.
- Data export must be reviewed before entitlement models are implemented.
- Future export may need to include:
  - source type
  - normalized plan/status
  - subscription period metadata
  - high-level event history
  - manual override summary if applicable
- Future deletion may need special handling for:
  - accounting records
  - provider evidence
  - audit logs
  - safety/legal retention exceptions
- Retention exceptions require policy/legal review later.

## 17. Privacy and Security Requirements

- Do not store provider secrets.
- Do not store raw API keys, JWTs, service credentials, purchase tokens, signed payloads, or private story content.
- Minimize provider evidence.
- Avoid logging sensitive payloads.
- Use safe error codes.
- Keep admin surfaces restricted.
- Update privacy/data safety inventory when schema is implemented.
- Review App Privacy and Google Play Data Safety implications before mobile submission.

## 18. Migration Strategy Review

Staged migration:

- Stage A: add provider-neutral tables without changing access checks.
- Stage B: backfill or map current Subscription/User.plan state into entitlement records where safe.
- Stage C: compute EffectiveEntitlementSnapshot and project into User.plan.
- Stage D: update service access checks to use entitlement service.
- Stage E: reduce legacy subscription/User.plan dependency only after validation.
- Stage F: clean legacy provider naming only in a dedicated migration phase.

Clarifications:

- This phase does not start any stage.
- Each stage requires separate implementation phase and tests.

## 19. Rollback Strategy

- Initial schema rollout should not remove existing fields.
- Existing User.plan access behavior should remain available.
- New entitlement records should be additive.
- Runtime should be able to ignore new tables during rollback.
- Migration rollback must avoid deleting provider evidence without review.
- Failed entitlement computation should fall back to FREE or current safe projection according to phase-specific policy.
- Rollback plan must be written before applying migrations.

## 20. Regression Test Requirements

Future test categories:

- schema relation tests if applicable
- migration/backfill tests
- idempotency unique-key tests
- unknown provider source fails closed
- unknown provider product ID fails closed
- unknown provider status fails closed
- revoked/refunded source removes access
- expired source removes access
- multiple active sources conflict resolution
- User.plan projection compatibility
- child limit compatibility
- story limit compatibility
- account export includes appropriate entitlement summary
- account deletion handles entitlement records
- no secrets/static payload tests
- audit log safe-content tests

## 21. Open Questions

- Should EffectiveEntitlementSnapshot be one row per user or historical snapshots?
- How much provider evidence should be stored versus hashed?
- How should Apple transaction identifiers map to source records?
- How should Google purchase tokens be stored or hashed?
- How should current Subscription records be backfilled?
- How long should audit logs be retained?
- Which records should remain after account deletion due to accounting/support obligations?
- Should manual overrides be included in first schema phase or deferred?
- Should SCHOOL be included in first commercial schema rollout or remain deferred?
- How should overlapping platform subscriptions be resolved?

## 22. P0 Blockers Before Schema Implementation

- Final conceptual model accepted.
- User.plan compatibility accepted.
- Current Subscription transition accepted.
- Sensitive evidence storage policy accepted.
- Idempotency key strategy accepted.
- Deletion/export implications reviewed.
- Privacy/data safety inventory updated.
- Rollback plan accepted.
- Migration/backfill plan accepted.
- Regression test plan accepted.
- No provider treated as approved unless documented and verified.

## 23. Implementation Non-Goals

- No Prisma schema changes in this phase.
- No migrations in this phase.
- No runtime code changes in this phase.
- No provider integration changes in this phase.
- No package changes in this phase.
- No env changes in this phase.
- No deployment in this phase.
- No removal or rename of current Subscription fields in this phase.
- No removal or semantic change to User.plan in this phase.

## 24. Current Status

- This review is documentation-only.
- Future schema is not finalized.
- Prisma schema has not changed.
- Migrations have not started.
- Entitlement implementation has not started.
- User.plan remains current compatibility/effective projection.
- Current Subscription model remains untouched.
- Paid access remains fail-closed unless explicitly approved and verified.
