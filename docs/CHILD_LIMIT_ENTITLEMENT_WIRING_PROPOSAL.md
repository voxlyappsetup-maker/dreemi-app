# Child-Limit Entitlement Wiring Proposal (Phase 4-D3F)

## 1. Purpose and Phase Boundary

- Phase: `4-D3F` (documentation-only proposal/review).
- Objective: define the exact future single-surface wiring plan for child-limit enforcement using `EntitlementService`.
- This phase does not implement runtime wiring and does not change behavior.
- No route, middleware, service, schema, migration, provider, checkout, webhook, app, or deployment changes are allowed in this phase.

## 2. Current Child-Limit Behavior (Source of Truth)

### 2.1 File and route surface

- Target runtime surface for future wiring: `services/api/src/routes/children.ts`.
- Current enforced endpoint: `POST /api/children`.

### 2.2 Current `User.plan` read location

- Current logic loads plan with:
  - `prisma.user.findUnique({ where: { id: userId }, select: { plan: true } })`

### 2.3 Current child-count check

- Current logic counts existing children with:
  - `prisma.child.count({ where: { userId } })`
- Current block condition:
  - `if (currentCount >= limit)`, return `403` with:
    - `success: false`
    - `error: "Child limit reached for your plan"`
    - `limit`
    - `current`

### 2.4 Current child limits

- `FREE: 1`
- `INDIVIDUAL: 1`
- `FAMILY: 4`
- `SCHOOL: Infinity`

### 2.5 Unknown or missing fallback behavior (current route logic)

- Current route fallback is:
  - `const limit = CHILD_LIMITS[user.plan] ?? 1`
- This means unknown or unsupported `user.plan` values fail closed to limit `1` (FREE-equivalent minimum).

## 3. Why Child-Limit Is the First Wiring Surface

- Smaller blast radius than story generation because only one route write-path is touched.
- Deterministic plan-to-limit mapping (`1/1/4/Infinity`) is simpler than monthly counting logic.
- No monthly counter query or date-window logic is involved.
- Rollback is easier because the change is isolated to one route path.
- Parity testing is easier because expected outputs are plan-map deterministic.

## 4. Future Runtime Wiring Proposal (Not Implemented Here)

## 4.1 Exact target file for future implementation

- `services/api/src/routes/children.ts` only.

## 4.2 Exact service method expected

- Use `createEntitlementService()` from `services/api/src/services/entitlement.service.ts`.
- Use `entitlementService.getChildLimit(userId, user.plan)` for the limit decision.

## 4.3 Compatibility projection rule

- `User.plan` remains the compatibility projection input in this first wiring step.
- Future child-limit decision consumes service output derived from passed `User.plan`.
- No provider-specific IDs are introduced into child-limit access logic.

## 4.4 Fail-closed rule for unknown/unsupported state

- Unknown or unsupported plan/entitlement must fail closed to FREE-equivalent lowest limit (`1`).
- Invalid user state must remain fail-closed and never grant higher limits.

## 4.5 Public API response shape rule

- Keep current response shapes unchanged for:
  - success (`201` + `{ success: true, child }`)
  - limit reached (`403` + `{ success: false, error, limit, current }`)
  - existing auth/not-found/validation/error responses

## 5. Future Test Plan Required Before and During Wiring

## 5.1 Static guardrails required before code change

- Keep static tests proving no runtime wiring in:
  - `services/api/src/middleware/plans.middleware.ts`
  - `services/api/src/routes/stories.ts`
  - `services/api/src/routes/payments.ts`
- Keep static tests proving current limit constants and maps remain unchanged outside approved target.

## 5.2 Child-limit parity tests across all plans

- Add parity tests for `FREE`, `INDIVIDUAL`, `FAMILY`, `SCHOOL` ensuring route behavior matches current baseline.
- Validate both allow and block paths based on child counts.

## 5.3 Unknown/missing plan fallback tests

- Add tests for unknown, empty, and missing plan values proving fail-closed limit `1`.

## 5.4 Provider-ID policy regression tests

- Keep tests proving no provider-specific IDs appear in child access-check policy logic.

## 5.5 No-touch story path tests

- Keep tests proving story-generation path remains unchanged:
  - `checkStoryLimit`
  - FREE monthly limit (`3`)
  - route middleware order in `POST /api/stories/generate`

## 5.6 No-touch checkout/webhook tests

- Keep tests proving checkout/webhook behavior remains unchanged:
  - checkout gate behavior
  - `resolvePlanFromLemonVariantId`
  - `resolveEffectiveUserPlanForSubscription`
  - cancellation/expiry projection to `User.plan = FREE`

## 6. Future Implementation Acceptance Criteria (D3G Gate)

- Only `services/api/src/routes/children.ts` may be touched for runtime wiring.
- `EntitlementService` usage is limited to plan/child-limit decision only.
- No schema, migration, provider, checkout, webhook, app/web, deployment, env, or package changes.
- No story-generation path changes.
- Required validation before commit:
  - `git diff --check`
  - scoped file checks
  - guardrail scans
  - `pnpm.cmd --filter @dreemi/api test`
  - `pnpm.cmd test`
  - `pnpm.cmd lint`
  - `pnpm.cmd build`

## 7. Rollback Plan for Future Wiring Phase

- Revert child-limit route to direct `User.plan` read and local `CHILD_LIMITS` map usage.
- Preserve current child limits (`1/1/4/Infinity`).
- Preserve story path behavior (`FREE=3/month` and existing middleware flow).
- Preserve payments checkout/webhook projection behavior.
- No schema rollback required because no schema change is allowed in this wiring phase.

## 8. Blocked Items (Remain Blocked in D3F)

- No normalized entitlement schema implementation yet.
- No provider adapter implementation.
- No production checkout approval.
- No Apple IAP implementation.
- No Google Play Billing implementation.
- No runtime wiring in this D3F phase.

## 9. Recommended Next Phase

- `Phase 4-D3G` should be a narrowly scoped child-limit runtime wiring phase only if explicitly approved.
- D3G should follow this proposal as the exact implementation and review gate.
- D3F remains documentation-only.

