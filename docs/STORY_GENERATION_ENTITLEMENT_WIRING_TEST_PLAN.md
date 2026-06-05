# Story-Generation Entitlement Wiring Test Plan (Phase 4-D3J)

## 1. Purpose and Boundary

- Phase: `4-D3J` (documentation-only proposal/test-plan).
- Objective: define the future one-surface runtime wiring plan for the story-generation monthly limit path.
- This phase does not implement runtime wiring and does not change behavior.
- No code, schema, migration, provider, checkout, webhook, app, deployment, package, or env changes are allowed.

## 2. Current Story-Generation Limit Behavior (Source of Truth)

### 2.1 Current files and route boundary

- Middleware file: `services/api/src/middleware/plans.middleware.ts`.
- Route file: `services/api/src/routes/stories.ts`.
- Current gated endpoint: `POST /api/stories/generate`.
- Current middleware order:
  - `authenticateToken -> generateRateLimit -> checkStoryLimit -> async handler`

### 2.2 Current policy and counting behavior

- `FREE_MONTHLY_LIMIT = 3`.
- Non-FREE plans bypass monthly cap (`if (user.plan !== "FREE") next()`).
- Story count uses current authenticated `userId`.
- Story count month window is `createdAt >= monthStart`.
- `monthStart` is computed from current year/month start in middleware.

### 2.3 Current stable blocked response contract

- Current blocked status code: `403`.
- Current stable response shape on limit reached:
  - `success: false`
  - `error: <story-limit message>`
  - `code: "STORY_LIMIT_REACHED"`
- This response contract must remain stable in any future wiring phase.

## 3. Future Implementation Scope (For a Later Phase Only)

### 3.1 Scope lock

- Exactly one runtime surface only: story-generation monthly limit path.
- Likely target boundary: `checkStoryLimit` in `services/api/src/middleware/plans.middleware.ts`.
- `services/api/src/routes/stories.ts` middleware order must remain unchanged.

### 3.2 Service contract options to evaluate before editing

- Future implementation must inspect current `EntitlementService` signatures before edits.
- Candidate service calls for the wiring point:
  - `getPlanForAccessCheck(userId, user.plan)`, or
  - `canGenerateStory(userId, user.plan)`.
- Selection must preserve existing behavior and response contract.

### 3.3 Hard safety constraints for future implementation

- Keep `User.plan` as the compatibility projection input.
- Do not read provider IDs or provider runtime state in story access policy files.
- Do not wire payments, checkout, webhook, billing catalog, or provider adapters.
- Do not touch `children.ts` runtime behavior.
- `children.ts` may only be referenced by static guardrails proving it remains unchanged.

## 4. Required Test Plan for Future Implementation

## 4.1 Static guardrails

- Only selected story-limit surface may be wired in implementation phase.
- `children.ts` remains D3G-only entitlement runtime surface.
- `stories.ts` route order remains:
  - `authenticateToken -> generateRateLimit -> checkStoryLimit -> async handler`
- `payments.ts` remains non-wired.
- `billing.ts` remains unchanged.
- Prisma schema remains unchanged.
- Provider-specific IDs are not used in story access policy files.

## 4.2 Behavior parity tests

- FREE user below monthly limit is allowed.
- FREE user exactly at monthly limit is blocked.
- FREE user over monthly limit is blocked.
- INDIVIDUAL bypass remains unchanged.
- FAMILY bypass remains unchanged.
- SCHOOL bypass remains unchanged.
- null/undefined/empty/unknown plan fails closed to FREE-equivalent monthly-limit behavior.
- Stable story-limit status code remains unchanged.
- Stable response shape remains unchanged.

## 4.3 Month-window tests

- Count includes only stories with `createdAt >= monthStart`.
- Stories before `monthStart` do not count.
- Boundary at exactly `monthStart` is handled correctly.
- No cross-user count leakage.

## 4.4 Non-regression tests

- D3G child-limit wiring remains unchanged.
- Children route response contract remains unchanged.
- Payments route and webhook behavior remain unchanged.
- Checkout gate behavior remains unchanged.
- Frontend generate/pricing behavior remains unchanged unless explicitly approved.

## 5. Future Implementation Acceptance Criteria

- One runtime surface only.
- No schema or migration changes.
- No provider adapter changes.
- No checkout or webhook changes.
- No `apps/web` changes unless explicitly approved.
- No env, secrets, package, or deployment config changes.
- Validation commands must pass with explicit exit codes.
- Manual smoke checks are documented and executed.
- Rollback plan is documented before merge.
- No Supabase RLS rollback.

## 6. Rollback Plan (For Future Wiring Phase)

- Revert only the future story-generation wiring commit if issues occur.
- Preserve D3G child-limit wiring unless proven causal.
- Restore direct `User.plan` story-limit logic if future wiring fails.
- No database rollback expected.
- No provider rollback expected.
- No webhook rollback expected.
- No Supabase RLS rollback unless independently proven necessary.

## 7. Manual Smoke Checklist (For Future Wiring Phase)

- [ ] Login works.
- [ ] Generate page loads.
- [ ] FREE user below monthly limit can generate.
- [ ] FREE user at or over monthly limit gets same blocked behavior.
- [ ] Paid-plan user behavior remains unchanged.
- [ ] Existing story detail page loads.
- [ ] Children page still works.
- [ ] Pricing/checkout UI is not affected.
- [ ] Payments status/subscription routes are not affected.

## 8. Recommended Next Phase

- D3J is planning-only and does not authorize runtime implementation by itself.
- `D3K` may be a narrowly scoped implementation phase only if:
  - D3J is accepted, and
  - the user gives explicit approval.
- D3K must not start automatically.
- If risk remains high, run one extra test-only/static-guardrail phase before D3K implementation.

## 8.1 D3K0 preflight status update

- D3K0 is completed as a test-only/static-guardrail preflight phase.
- D3K0 adds no runtime wiring and no production behavior changes.
- D3K0 hardens baseline locks for:
  - route middleware order on `POST /generate`,
  - `FREE_MONTHLY_LIMIT = 3`,
  - non-FREE bypass behavior,
  - authenticated `req.userId` counting,
  - month-window query (`createdAt >= monthStart`),
  - stable blocked response fields (`success`, `error`, `code`) and `STORY_LIMIT_REACHED`,
  - pre-D3K non-wiring scope (`plans.middleware.ts`, `stories.ts`, `payments.ts` remain non-wired).
- Future D3K implementation must update only the specific guardrail that currently forbids plans-middleware wiring.
- D3K must continue forbidding stories.ts direct wiring, payments/checkout/webhook wiring, schema/provider/apps changes, and second-surface runtime wiring unless explicitly approved.

## 9. Current Status

- This document is documentation-only.
- Runtime behavior is unchanged in D3J.
- Story generation, plans middleware, payments, schema, migrations, providers, checkout, webhook, and apps/web are unchanged in D3J.
- D3K0 test-only hardening is complete and keeps runtime behavior unchanged.
- D3K is now implemented as one-surface runtime wiring in `services/api/src/middleware/plans.middleware.ts`.
- D3K wires only the story-limit plan decision through `getPlanForAccessCheck(userId, user.plan)` and keeps monthly count logic in middleware.
- D3K preserves:
  - `FREE_MONTHLY_LIMIT = 3`,
  - month-window counting (`createdAt >= monthStart`),
  - blocked response shape (`success`, `error`, `code` with `STORY_LIMIT_REACHED`),
  - existing route order in `stories.ts`.
- D3K keeps `children.ts` D3G wiring unchanged and keeps `stories.ts`/payments/checkout/webhook non-wired directly.
- D3K rollback direction: revert the D3K commit to restore direct `User.plan` plan decision in `checkStoryLimit`.
- Next recommended phase is D3L runtime verification/rollback-readiness review only.
