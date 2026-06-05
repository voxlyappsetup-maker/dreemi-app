# Entitlement Runtime Integration Readiness Review

## 1. Purpose and Phase Boundary

- Phase: `4-D3D` (documentation-only readiness review).
- Objective: identify current legacy access-control behavior, future EntitlementService integration candidates, and risks before any runtime wiring.
- This document does not change runtime behavior, schema, migrations, providers, checkout, webhook logic, routes, middleware, or apps/web code.

## 2. Exact Files Reviewed

### Source-of-truth docs reviewed

- `docs/PROJECT_HANDOFF.md`
- `docs/CURRENT_PROJECT_STATE.md`
- `docs/NEXT_CHAT_PROMPT.md`
- `docs/PRODUCTION_READINESS_CHECKLIST.md`
- `docs/PAYMENT_PROVIDER_STRATEGY_AFTER_LEMON_REJECTION.md`
- `docs/ENTITLEMENT_MODEL_DESIGN_LOCK.md`
- `docs/ENTITLEMENT_MODEL_IMPLEMENTATION_PLAN.md`
- `docs/ENTITLEMENT_SCHEMA_DESIGN_REVIEW.md`
- `docs/ENTITLEMENT_SERVICE_INTERFACE_DESIGN.md`
- `docs/USER_PLAN_PROJECTION_COMPATIBILITY_PLAN.md`
- `docs/ENTITLEMENT_RUNTIME_IMPLEMENTATION_READINESS_CHECKLIST.md`
- `docs/PRIVACY_DATA_SAFETY_INVENTORY.md`
- `docs/MOBILE_MONETIZATION_PARENT_FIRST_DESIGN_LOCK.md`
- `docs/APPLE_IAP_READINESS_PLAN.md`
- `docs/GOOGLE_PLAY_BILLING_READINESS_PLAN.md`
- `docs/IOS_APP_STORE_PRODUCT_MAPPING_DESIGN.md`
- `docs/ANDROID_PLAY_CONSOLE_PRODUCT_MAPPING_DESIGN.md`
- `docs/AI_SAFETY_MOBILE_READINESS_PLAN.md`

### Source files reviewed (read-only)

- `services/api/src/services/entitlement.service.ts`
- `services/api/src/services/entitlement.service.test.ts`
- `services/api/src/middleware/plans.middleware.ts`
- `services/api/src/routes/stories.ts`
- `services/api/src/routes/children.ts`
- `services/api/src/routes/payments.ts`
- `services/api/src/config/billing.ts`
- `prisma/schema.prisma`
- `apps/web/src/app/[locale]/children/page.tsx`
- `apps/web/src/components/LandingPricing.tsx`
- `apps/web/src/app/[locale]/pricing/page.tsx`

## 3. Current Behavior: Legacy Access-Control Map

### 3.1 Story generation access checks (current behavior)

- Gating location: `services/api/src/routes/stories.ts` on `POST /api/stories/generate`.
- Middleware chain: `authenticateToken` -> rate limiter -> `checkStoryLimit`.
- Limit enforcement implementation: `services/api/src/middleware/plans.middleware.ts`.
- Current limit rule:
  - `FREE`: max `3` stories/month (`FREE_MONTHLY_LIMIT = 3`).
  - Non-FREE plans (`INDIVIDUAL`, `FAMILY`, `SCHOOL`): no monthly cap in current middleware.
- How `User.plan` is currently read:
  - Middleware queries `prisma.user.findUnique({ select: { plan: true } })` per authenticated request.
  - If `plan !== "FREE"`, middleware passes immediately.
  - If `plan === "FREE"`, middleware counts stories created since current month start and blocks at limit.
- EntitlementService status here:
  - Not wired into `stories` route or plan middleware.
  - Verified by static guardrails in `services/api/src/services/entitlement.service.test.ts`.

### 3.2 Child-limit checks (current behavior)

- Gating location: `services/api/src/routes/children.ts` on `POST /api/children`.
- Enforcement logic in route-local map:
  - `FREE: 1`
  - `INDIVIDUAL: 1`
  - `FAMILY: 4`
  - `SCHOOL: Infinity`
- How `User.plan` is currently read:
  - Route queries `prisma.user.findUnique({ select: { plan: true } })`.
  - Route counts existing children and blocks creation when `currentCount >= limit`.
- Listing behavior:
  - `GET /api/children` returns current children list; no additional plan gate for listing.
- UI display parity (read-only confirmation):
  - `apps/web/src/app/[locale]/children/page.tsx` uses the same map for parent-facing limit messaging (`1/1/4/Infinity`).

### 3.3 Payment/webhook projection points (current behavior)

- Primary file: `services/api/src/routes/payments.ts`.
- Checkout gate behavior:
  - Route uses `resolvePaymentsGateDecision()` from `services/api/src/config/billing.ts`.
  - Paid checkout remains fail-closed unless runtime gate allows checkout.
- `User.plan` write points in webhook handling:
  - `subscription_cancelled` / `subscription_expired`: writes `User.plan = "FREE"`.
  - Other handled subscription events:
    - `variant_id` -> `resolvePlanFromLemonVariantId`.
    - provider status -> `mapLemonSubscriptionStatus`.
    - effective plan -> `resolveEffectiveUserPlanForSubscription`.
    - writes `User.plan` with effective plan (or FREE if non-entitled status).
- Lemon compatibility code still present:
  - `services/api/src/routes/payments.ts`
  - `services/api/src/config/billing.ts`
  - `services/api/src/services/lemonsqueezy.service.ts` (referenced by route)
- Why provider-specific IDs must not become access-check logic:
  - `billing.ts` treats variant IDs as catalog mapping input, not route-level access policy.
  - Access policy must stay based on normalized plan/effective entitlement.
  - Hard-coding provider product IDs into story/child access checks would couple policy to one provider and break provider-neutral migration.

## 4. Current Behavior: Data Model Baseline

- `prisma/schema.prisma` currently keeps:
  - `User.plan` (`FREE | INDIVIDUAL | FAMILY | SCHOOL`) as effective access projection.
  - `Subscription.plan` as catalog subscription plan.
  - Legacy field names (`stripeId`, `stripeSubscriptionId`, `stripePriceId`) intentionally retained.
- No entitlement models are present in schema yet.
- No migration is active in this phase.

## 5. Future Integration Candidates (Not Implemented Here)

## 5.1 Likely touchpoints

- Story-generation path:
  - `services/api/src/middleware/plans.middleware.ts`
  - `services/api/src/routes/stories.ts`
- Child-limit path:
  - `services/api/src/routes/children.ts`
- Payment/webhook normalization and projection path:
  - `services/api/src/routes/payments.ts`
  - `services/api/src/config/billing.ts`

## 5.2 Minimal integration sequence (recommended)

1. Keep runtime unwired and expand tests/guardrails first (no behavior change).
2. Add explicit integration contract tests for reading `User.plan` via EntitlementService-compatible boundaries (still no route wiring).
3. Wire one backend surface at a time behind a rollback-friendly flag or patch boundary:
   - child-limit read path first or story-limit read path first (not both together).
4. Keep webhook `User.plan` projection behavior stable while validating parity.
5. Only after parity evidence, consider broader route/middleware adoption.

## 5.2.1 Recommended first wiring surface (for future phase)

- First candidate: child-limit path in `services/api/src/routes/children.ts`.
- Why child-limit first:
  - single route surface with deterministic plan-to-limit mapping (`1/1/4/Infinity`),
  - lower coupling than story-generation flow, which includes additional middleware and monthly counting logic,
  - faster parity verification before touching the more complex story path.
- Why only one surface first:
  - reduces blast radius and makes regressions attributable to one change set,
  - keeps rollback simple and fast if parity drift appears.
- Rollback direction for first wiring attempt:
  - revert child-limit path to direct legacy `User.plan` read,
  - keep story path and payments/webhook path unchanged,
  - preserve all current limits and fail-closed checkout behavior.

## 5.3 Rollback plan (for future wiring phase)

- Rollback target: immediate return to direct `User.plan` reads in routes/middleware.
- Rollback mechanism: revert-only change set, no schema rollback dependency.
- Hard rollback invariants:
  - story limit remains `FREE=3/month`.
  - child limits remain `1/1/4/Infinity`.
  - paid checkout remains disabled by default unless approved.
  - unknown entitlement states do not grant paid access.

## 5.4 Test coverage required before runtime wiring

- Parity tests proving route-level equivalence for:
  - story limit behavior across all plans.
  - child limit behavior across all plans.
- Regression tests proving no provider ID usage in access-check logic files.
- Regression tests proving no checkout gate weakening.
- Webhook projection tests proving:
  - cancellation/expiry -> `User.plan = FREE`.
  - unknown/malformed variant/status cannot grant paid access.
- Static tests proving no EntitlementService wiring outside approved target files.

## 6. Must-Remain-Unchanged Invariants During Future Integration

- `User.plan` stays the compatibility projection during staged migration.
- Unknown or unsupported entitlement state fails closed to `FREE`.
- Paid checkout remains disabled by default unless explicit provider approval gates pass.
- Lemon Squeezy remains not approved for production launch.
- Access checks remain provider-neutral and must not read provider-specific IDs directly.

## 7. Risk Register

- Accidental paid access escalation:
  - risk: unknown status/product maps to paid.
  - control: fail-closed mapping + regression tests.
- Mismatched child/story limits:
  - risk: service and route logic diverge.
  - control: parity tests for `FREE/INDIVIDUAL/FAMILY/SCHOOL`.
- Provider-specific coupling:
  - risk: variant/product IDs leak into access checks.
  - control: static scans and review gate on access-check files.
- Webhook to `User.plan` drift:
  - risk: webhook writes disagree with access check interpretation.
  - control: projection parity tests and controlled sequence rollout.
- Production checkout accidentally enabled:
  - risk: gate logic weakened during entitlement work.
  - control: preserve `resolvePaymentsGateDecision` behavior and tests.
- Public/mobile subscription mismatch:
  - risk: web pricing copy and backend policy diverge from mobile-first entitlement model.
  - control: maintain normalized plan abstraction and provider-neutral mapping docs.

## 8. Blocked / Not Allowed in This Phase

- No runtime wiring of EntitlementService into routes or middleware.
- No edits to:
  - `services/api/src/services/entitlement.service.ts`
  - `services/api/src/services/entitlement.service.test.ts`
  - routes/middleware/runtime files.
- No schema changes, no migrations, no provider implementation, no checkout/webhook behavior changes.
- No apps/web edits.

## 9. Recommended Next Phase

- Phase `4-D3E` is complete (preflight tests and guardrails).
- Phase `4-D3F` is complete as documentation-only proposal:
  - `docs/CHILD_LIMIT_ENTITLEMENT_WIRING_PROPOSAL.md`
- Phase `4-D3G` is implemented as the first single-surface runtime wiring:
  - `services/api/src/routes/children.ts` child-limit decision path only.
- Phase `4-D3H` is documented at:
  - `docs/ENTITLEMENT_RUNTIME_VERIFICATION_AND_ROLLBACK_REVIEW.md`
- D3H documents:
  - D3G verification scope and preserved child-limit behavior,
  - untouched runtime surfaces,
  - external Supabase RLS remediation note and manual verification requirement,
  - rollback-readiness plan and second-surface gating criteria.
- D3I proposal/review is now documented at:
  - `docs/NEXT_ENTITLEMENT_RUNTIME_SURFACE_PROPOSAL.md`
- D3J proposal/test-plan is now documented at:
  - `docs/STORY_GENERATION_ENTITLEMENT_WIRING_TEST_PLAN.md`
- D3K0 static-guardrail preflight is complete as test-only hardening:
  - no runtime wiring changes were introduced,
  - story-generation legacy baseline is now more tightly locked by static tests before any D3K runtime phase.
- D3K runtime implementation is now complete with one additional surface:
  - `services/api/src/middleware/plans.middleware.ts` story-limit plan decision only.
- D3K preserves route order, User.plan read, FREE monthly limit, month-window count logic, and blocked response shape.
- D3K keeps stories.ts non-wired directly and keeps payments/checkout/webhook non-wired.
- Recommended next phase: `Phase 4-D3L` runtime verification and rollback-readiness review only.
- No third runtime wiring surface should occur until D3K verification is accepted.
- D3L runtime verification/rollback-readiness review is now documented at:
  - `docs/D3K_RUNTIME_VERIFICATION_AND_ROLLBACK_REVIEW.md`
- D3L confirms exactly two runtime entitlement surfaces (D3G `children.ts`, D3K `plans.middleware.ts`) and no additional runtime wiring.
- D3M manual smoke verification documentation is now available at `docs/D3M_MANUAL_SMOKE_VERIFICATION.md`.
- D3M adds a practical checklist and evidence template only; no runtime/code/test changes.
- Recommended next phase after D3M: `Phase 4-D3M-Run` (user-executed smoke run and evidence capture), or payment-provider readiness review, or entitlement schema proposal review.
- No third runtime wiring surface should occur until D3L is accepted and a separate proposal/test-plan is completed.

## 10. Current Status

- This review is documentation-only.
- Runtime behavior in this D3D review remains unchanged.
- Historical D3D baseline statement ("EntitlementService remains non-wired") is superseded by D3G child-limit-only wiring.
- Current post-D3H status is tracked in `docs/ENTITLEMENT_RUNTIME_VERIFICATION_AND_ROLLBACK_REVIEW.md`.
