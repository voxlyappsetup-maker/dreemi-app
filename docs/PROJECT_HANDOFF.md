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
  - `b004818` `docs(ios): add Apple IAP readiness plan`
  - `d73d730` `docs(mobile): add parent-first monetization design lock`
  - `7d76ee8` `docs(payments): add entitlement model design lock`
  - `7c6f0ea` `docs(payments): document Lemon reconsideration denial`
  - `70f5614` `Add payments runtime safety gate`
  - `30919b4` `docs: add production deployment dry-run checklist`
  - `9fc9e22` `fix(web): guard production API URL configuration`
  - `396367d` `chore(docs): clean mojibake markers`
  - `14cb1dc` `fix(api): add production checkout and cors guardrails`
  - `2821123` `docs(env): add DIRECT_URL production placeholder`
  - `5eb70e5` `docs: add production readiness checklist`
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
- Implemented payment integration: Lemon Squeezy, not approved for production launch.
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
- Dry-run checklist: `docs/PRODUCTION_DEPLOYMENT_DRY_RUN_CHECKLIST.md`
- Lemon verification plan: `docs/LEMONSQUEEZY_PRODUCTION_VERIFICATION_PLAN.md`
- Payment provider strategy: `docs/PAYMENT_PROVIDER_STRATEGY_AFTER_LEMON_REJECTION.md`
- Entitlement model design lock: `docs/ENTITLEMENT_MODEL_DESIGN_LOCK.md`
- Mobile monetization parent-first design lock: `docs/MOBILE_MONETIZATION_PARENT_FIRST_DESIGN_LOCK.md`
- Apple IAP readiness plan: `docs/APPLE_IAP_READINESS_PLAN.md`
- Google Play Billing readiness plan: `docs/GOOGLE_PLAY_BILLING_READINESS_PLAN.md`
- Deployment provider decision: `docs/DEPLOYMENT_PROVIDER_DECISION.md`
- Frontend deployment config path: `vercel.json`
- API deployment config path (current repo naming): `services/api/railway.json`

P0 blockers before real payments:
- Set production API `FRONTEND_URL`.
- Set Vercel `NEXT_PUBLIC_API_URL` (frontend now fails fast in production if missing).
- Configure Lemon Squeezy webhook URL to production API `/api/payments/webhook`.
- Verify final frontend domains are allowed by API CORS.

Phase 4-C7 note:
- `apps/web/src/lib/api.ts` removed the legacy hardcoded production API fallback and now keeps `http://localhost:3001` fallback only outside production.

Pending decision:
- Render vs Railway deployment config naming/ownership is not finalized in repository docs/process.
- Current repo truth remains:
  - frontend config exists for Vercel (`vercel.json`)
  - API config exists as Railway-named (`services/api/railway.json`)
  - Render remains future/unconfigured unless explicitly approved in a later phase
- Production deploy remains pending and must follow `docs/PRODUCTION_DEPLOYMENT_DRY_RUN_CHECKLIST.md` before any real deployment attempt.
- Lemon Squeezy is paused for production launch unless approval status changes.
- Lemon reconsideration was denied after the initial rejection.
- Do not treat Lemon as the launch provider in current planning.
- No paid launch should proceed until payment provider approval and production verification are completed.
- Lemon Squeezy integration exists but is not approved for production launch.
- Do not remove Lemon code until a separate explicit phase is approved.
- Paid checkout is disabled by default until an approved payment provider is verified.
- Mobile-first monetization requires provider-neutral entitlement design before Apple IAP, Google Play Billing, or web provider implementation.
- Mobile paid launch requires Apple/Google monetization planning and parent-facing paywall constraints.
- Apple IAP is the planned future iOS monetization path.
- Google Play Billing is the planned future Android monetization path.
- Lemon remains paused, and Lemon code remains in place for now.
- Phase 4-D1D-A documentation lock reference: `docs/ENTITLEMENT_MODEL_DESIGN_LOCK.md`.
- Phase 4-D1D documentation lock reference: `docs/MOBILE_MONETIZATION_PARENT_FIRST_DESIGN_LOCK.md`.
- Phase 4-D1E planning reference: `docs/APPLE_IAP_READINESS_PLAN.md`.
- Phase 4-D1F planning reference: `docs/GOOGLE_PLAY_BILLING_READINESS_PLAN.md`.
- No Apple IAP, Google Play Billing, Paddle, or PayPal implementation has started.
- No StoreKit/App Store Server API/App Store Server Notifications implementation has started.
- No Play Billing/Google Play Developer API/Real-time Developer Notifications implementation has started.

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
