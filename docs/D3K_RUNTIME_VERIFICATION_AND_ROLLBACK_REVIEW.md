# D3K Runtime Verification and Rollback Review

## 1. Purpose and Boundary

- Phase: `4-D3L` (documentation-only verification and rollback-readiness review).
- Objective: verify the completed D3K runtime wiring scope and document rollback readiness before any additional runtime surface work.
- This phase adds no runtime, test, schema, provider, app, deployment, package, or env changes.

## 2. Verified Runtime Surfaces

### Surface 1 (D3G): child-limit decision

- File: `services/api/src/routes/children.ts`
- Runtime wiring: `entitlementService.getChildLimit(userId, user.plan)`
- Scope remains child-limit decision only.

### Surface 2 (D3K): story-generation monthly-limit plan decision

- File: `services/api/src/middleware/plans.middleware.ts`
- Runtime wiring: `entitlementService.getPlanForAccessCheck(userId, user.plan)`
- Scope remains plan decision projection only; story counting stays in middleware.

## 3. Non-Wired and Out-of-Scope Surfaces

- `services/api/src/routes/stories.ts` remains non-wired directly to EntitlementService.
- `services/api/src/routes/payments.ts` remains non-wired to EntitlementService.
- Checkout remains non-wired.
- Webhook remains non-wired.
- Billing catalog/provider logic remains non-wired to runtime access checks.
- `apps/web` remains unchanged.

## 4. D3K Behavior Preservation Notes

- `POST /generate` route order remains:
  - `authenticateToken -> generateRateLimit -> checkStoryLimit -> async handler`
- `FREE_MONTHLY_LIMIT` remains `3`.
- Authenticated identity source remains `req.userId`.
- Monthly count logic remains in `plans.middleware.ts`.
- Story count remains bounded by `createdAt >= monthStart`.
- Blocked response remains:
  - HTTP `403`
  - `success: false`
  - `error`
  - `code: "STORY_LIMIT_REACHED"`
- Non-FREE bypass remains behavior-compatible through projected `accessPlan`.

## 5. D3K Validation Evidence (Recorded Summary)

The D3K implementation was manually validated before commit with the following known summary:

- `git diff --check` -> `0`
- untracked scan -> `0`
- forbidden runtime/config scan -> `0`
- mojibake scan -> `0`
- secret scan -> `0`
- runtime scan -> `0`
- provider/schema/frontend no-touch scan -> `0`
- `pnpm.cmd --filter @dreemi/api test` -> `0`
- `pnpm.cmd test` -> `0`
- `pnpm.cmd lint` -> `0`
- `pnpm.cmd build` -> `0`
- API tests: `211` pass, `0` fail

## 6. Rollback Plan

- Preferred rollback action: revert D3K commit `543b4ad` (`Wire story generation limit to entitlement service`).
- Expected rollback effect: restore direct `User.plan` decision logic in `checkStoryLimit`.
- Rollback should not touch D3G `children.ts` wiring unless D3G is proven causal.
- Rollback should not touch schema or migrations.
- Rollback should not touch Supabase RLS state.
- Rollback should not touch checkout/webhook/provider configuration.
- Post-rollback should run the same validation suite used for D3K acceptance.

## 7. Operational Smoke Checklist (Post-D3K)

- [ ] Login works.
- [ ] Generate page loads.
- [ ] FREE user below monthly limit can generate.
- [ ] FREE user at or above monthly limit receives the same limit error behavior.
- [ ] Paid-plan user behavior remains unchanged.
- [ ] Existing story detail page loads.
- [ ] Children page still works.
- [ ] Child-limit behavior still works.
- [ ] Pricing/checkout UI is not affected.
- [ ] Payments status/subscription routes are not affected.

## 8. Next-Phase Gate

- Next recommended phase is `D3M` only after D3L is committed and accepted.
- D3M must not be another runtime wiring surface by default.
- Recommended D3M options:
  - manual smoke verification documentation, or
  - payment-provider production readiness review, or
  - entitlement schema proposal review.
- No third runtime wiring surface is allowed until D3K verification is accepted and a separate proposal/test-plan is completed.
