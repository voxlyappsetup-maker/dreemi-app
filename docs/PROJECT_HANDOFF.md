# Dreemi / Qisas Project Handoff

## Project Summary

- Monorepo managed with `pnpm` + `turbo`.
- Frontend: Next.js 14 + TypeScript (`apps/web`).
- API: Express + TypeScript (`services/api`).
- Data: Prisma + PostgreSQL (Supabase-hosted in practice, per repo docs).
- Shared package(s): `packages/types`, `packages/config`.

## Repository Ground Truth (as of this handoff)

- Branch status should be checked with `git status -sb` before starting work.
- Recent commit trail (newest first) includes:
  - `bfdfdc5` `test(api): guard Arabic auth and plan messages`
  - `e967324` `docs: document billing and plan enforcement state`
  - `57fa102` `fix(plans): align children limits with backend`
  - `06d5883` `test(payments): add static route regression coverage`
  - `00fc179` `docs(payments): align provider references with Lemon Squeezy`
  - `7043b65` `fix(payments): enforce webhook entitlement status`
  - `7f50b4d` `fix(payments): harden checkout variant validation`
  - `bb8e51b` `docs: add project handoff and memory offload files`
  - `3cdd104` `fix(pdf): Phase 3F-A optimize PDF body batching`
  - `639e8f2` `fix(pdf): Phase 3E-F repair Arabic PDF byline and paragraph grouping`
  - `53c0f61` `fix(pdf): Phase 3E-C improve RTL captions and paragraph grouping`
  - `7521589` `fix(pdf): Phase 3E-A polish typography and paragraph cadence`
  - `6409b53` `fix(images): Phase 3D-D ... image URL verify + UI onError fallback`

## Key Areas and Where to Look

- PDF export logic: `apps/web/src/lib/exportStoryPdf.ts`
- Generate page export trigger: `apps/web/src/app/[locale]/generate/page.tsx`
- Story detail export trigger + image fallback: `apps/web/src/app/[locale]/story/[id]/page.tsx`
- Story card image fallback: `apps/web/src/components/StoryCard.tsx`
- Mistral generation + normalization: `services/api/src/services/mistral.service.ts`
- Image generation URL verification: `services/api/src/services/image.service.ts`
- Safety gate rules: `services/api/src/services/safety.service.ts`
- Static security regression tests: `services/api/src/routes/stories.security-regression.test.ts`
- Manual PDF checklist: `docs/PDF_EXPORT_REGRESSION_CHECKLIST.md`

## Billing / Payments / Plan Enforcement

- Runtime/payment routes: `services/api/src/routes/payments.ts`
- Lemon integration service: `services/api/src/services/lemonsqueezy.service.ts`
- Central billing catalog/helpers: `services/api/src/config/billing.ts`
- Billing helper tests: `services/api/src/config/billing.test.ts`
- Static payments route regressions: `services/api/src/routes/payments.security-regression.test.ts`
- Story plan limit enforcement: `services/api/src/middleware/plans.middleware.ts`
- Children plan limit enforcement: `services/api/src/routes/children.ts`
- Frontend children limit surface: `apps/web/src/app/[locale]/children/page.tsx`

Stable facts:
- Billing provider: Lemon Squeezy.
- Checkout rejects unknown variant IDs server-side.
- Webhook entitlement uses mapped subscription status:
  - effective `User.plan` may be FREE for non-entitled statuses.
  - `Subscription.plan` remains the catalog subscription plan.
- FREE story limit: 3 stories/month.
- Child limits: FREE 1, INDIVIDUAL 1, FAMILY 4, SCHOOL Infinity.
- Legacy DB field names (`stripeId`, `stripeSubscriptionId`, `stripePriceId`) remain intentionally unchanged pending migration.

Pending notes:
- No runtime/integration webhook tests yet; current coverage is helper-level + static regression tests.
- No credits ledger exists yet (current model is plan limits).
- Legacy Stripe-named DB fields remain pending future migration/rename if desired.

## Production Readiness

- Checklist path: `docs/PRODUCTION_READINESS_CHECKLIST.md`
- Frontend deployment config path: `vercel.json`
- API deployment config path (current repo naming): `services/api/railway.json`

P0 blockers before real payments:
- Set production API `FRONTEND_URL`.
- Set Vercel `NEXT_PUBLIC_API_URL`.
- Configure Lemon Squeezy webhook URL to production API `/api/payments/webhook`.
- Verify final frontend domains are allowed by API CORS.

Pending decision:
- Render vs Railway deployment config naming/ownership is not finalized in repository docs/process.

## Known Stable Areas (repository evidence only)

- Arabic/English/French story generation path has deterministic normalization and unit coverage in:
  - `services/api/src/services/mistral.service.ts`
  - `services/api/src/services/mistral.service.test.ts`
- Safety/security gates are present and regression-tested:
  - `services/api/src/services/safety.service.ts`
  - `services/api/src/routes/stories.security-regression.test.ts`
- PDF export has iterative fixes for:
  - Arabic shaping and layout
  - byline rendering via Canvas2D
  - paragraph block normalization/chunking
  - image load timeout and fallback behavior
  - performance instrumentation and body batching

## Immediate Start Checklist (for next engineer/chat)

1. Verify repository state:
   - `git status -sb`
   - `git diff --check`
2. Verify health:
   - `pnpm test`
   - `pnpm lint`
   - `pnpm build`
3. Manual smoke only if local app/env is already configured:
   - one story generation
   - one PDF export check

## Guardrails

- Never print/request secret values (env vars, tokens, DB URLs, API keys).
- Do not alter schema/migrations/deployment config without explicit approval.
- Do not change PDF export behavior unless a requested phase requires it.
- Preserve Arabic RTL PDF correctness and current performance improvements.
