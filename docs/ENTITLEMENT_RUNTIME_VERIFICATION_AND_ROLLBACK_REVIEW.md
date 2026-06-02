# Entitlement Runtime Verification and Rollback Review (Phase 4-D3H)

## 1. Purpose and Boundary

- Phase: `4-D3H` (documentation-only verification and rollback-readiness review).
- Objective: verify post-D3G runtime state before any second EntitlementService wiring surface.
- No runtime behavior, code, schema, provider, deployment, package, or env changes are made in this phase.

## 2. D3G Verification Status

- D3G is committed and pushed at `b46af7a`.
- Only `services/api/src/routes/children.ts` is wired to EntitlementService.
- Child-limit decision now uses `EntitlementService.getChildLimit(userId, user.plan)`.
- `User.plan` remains the compatibility projection input.
- Child-limit block condition remains `currentCount >= limit`.
- `403` response shape remains unchanged with fields:
  - `success`
  - `error`
  - `limit`
  - `current`

## 3. Confirmed Untouched Areas After D3G

- story generation
- plans middleware
- payments
- checkout
- webhook
- billing catalog
- Prisma schema
- migrations
- `apps/web`
- deployment configuration
- package files
- env configuration

## 4. Supabase RLS Remediation Note (Outside Git)

- External remediation applied outside Git: RLS enabled on:
  - `public.users`
  - `public.children`
  - `public.stories`
  - `public.subscriptions`
- No public policies were added.
- Expected access model remains backend API/Prisma only.
- This must be verified manually in runtime smoke checks after deployment/app verification.
- No secrets, connection strings, service role keys, or private URLs are documented here.

## 5. Manual Runtime Smoke Checklist

- [ ] login still works.
- [ ] children list still loads.
- [ ] create child as FREE user up to limit.
- [ ] attempt creating child over FREE limit returns same response shape (`success`, `error`, `limit`, `current`).
- [ ] FAMILY plan child-limit behavior remains `4` when `user.plan` is FAMILY.
- [ ] SCHOOL plan child-limit behavior remains unlimited (`Infinity` behavior).
- [ ] story generation still works and remains on legacy `checkStoryLimit` path.
- [ ] pricing/checkout UI is not affected.
- [ ] payments status/subscription routes are not affected.
- [ ] no frontend Supabase direct table access is required.

## 6. Rollback-Readiness Plan

- If child-limit runtime wiring causes production issues, revert `b46af7a`.
- Expected fallback behavior: child-limit route returns to direct `User.plan` child-limit logic.
- No database schema rollback is required.
- No payment provider rollback is required.
- No webhook rollback is required.
- Supabase RLS remediation should not be reverted unless a separate backend connectivity issue is proven.
- If backend connectivity issues appear after RLS enablement, investigate DB role and connection path before any RLS rollback decision.

## 7. Second-Surface Gating Criteria

Before wiring story generation, plans middleware, or payments to EntitlementService:

- D3H verification is complete.
- child-limit smoke checklist passes.
- rollback path is documented.
- API tests, full tests, lint, and build pass.
- no Supabase Advisor "RLS Disabled in Public" findings remain.
- no direct frontend Supabase table access dependency exists.

## 8. Recommended Next Phase

- Next phase should be `Phase 4-D3I` only after D3H is committed and accepted.
- D3I should be proposal/review only for selecting the next runtime surface.
- No second runtime wiring should occur until D3H verification is accepted.
- The next runtime surface should not be selected automatically without D3I review.
