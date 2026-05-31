# Current Project State

## Stack Snapshot

- Package manager/workspace: `pnpm` + `pnpm-workspace.yaml`
- Task runner: `turbo` (`turbo.json`)
- Frontend: Next.js 14, TypeScript (`apps/web`)
- Backend: Express + TypeScript (`services/api`)
- ORM/database: Prisma + PostgreSQL
- Shared types/config: `packages/types`, `packages/config`

## Current Focus Areas in Code

- PDF export implementation: `apps/web/src/lib/exportStoryPdf.ts`
  - Canvas2D title + byline rendering
  - Arabic PDF block normalization/regrouping path
  - html2canvas body rendering with batching/perf instrumentation
- Story generation reliability + normalization:
  - `services/api/src/services/mistral.service.ts`
  - `services/api/src/services/mistral.service.test.ts`
- Story image resilience:
  - backend URL verification: `services/api/src/services/image.service.ts`
  - frontend fallback rendering:
    - `apps/web/src/components/StoryCard.tsx`
    - `apps/web/src/app/[locale]/story/[id]/page.tsx`
- Safety and API security checks:
  - `services/api/src/services/safety.service.ts`
  - `services/api/src/routes/stories.security-regression.test.ts`
- Billing and plan enforcement:
  - payment route: `services/api/src/routes/payments.ts`
  - Lemon service integration: `services/api/src/services/lemonsqueezy.service.ts`
  - billing catalog: `services/api/src/config/billing.ts`
  - billing helper tests: `services/api/src/config/billing.test.ts`
  - static payments regressions: `services/api/src/routes/payments.security-regression.test.ts`
  - story limit middleware: `services/api/src/middleware/plans.middleware.ts`
  - children limits route: `services/api/src/routes/children.ts`
  - frontend children limits surface: `apps/web/src/app/[locale]/children/page.tsx`
  - plan/checkout frontend surfaces:
    - `apps/web/src/app/[locale]/pricing/page.tsx`
    - `apps/web/src/components/LandingPricing.tsx`
    - `apps/web/src/app/[locale]/(auth)/login/page.tsx`
    - `apps/web/src/app/[locale]/(auth)/register/page.tsx`

## Stable Phase 4-B Billing State

- Payment provider is Lemon Squeezy.
- Checkout rejects unknown `variantId` server-side with stable error `UNKNOWN_CHECKOUT_VARIANT`.
- Lemon variant IDs are centralized in `services/api/src/config/billing.ts`.
- Webhook effective entitlement is status-based:
  - `active`, `trialing`, `on_trial`, `past_due` => paid access (V1).
  - `unpaid`, `canceled`, `cancelled`, `expired`, and unknown statuses => effective `User.plan = FREE`.
- `subscription_payment_success` is notification-only and returns without plan updates.
- `subscription_cancelled` and `subscription_expired` set `User.plan` to `FREE`.
- `User.plan` stores effective entitlement.
- `Subscription.plan` stores the catalog subscription plan.
- No credits ledger exists; enforcement model is plan limits, not credit accounting.
- FREE story limit is `3` stories/month (`services/api/src/middleware/plans.middleware.ts`).
- Child limits are `FREE: 1`, `INDIVIDUAL: 1`, `FAMILY: 4`, `SCHOOL: Infinity`.
- Provider-facing docs/text are aligned to Lemon Squeezy.
- Legacy field names (`stripeId`, `stripeSubscriptionId`, `stripePriceId`) are intentionally retained pending a future migration.

## Production Readiness State

- Reference checklist: `docs/PRODUCTION_READINESS_CHECKLIST.md`
- Latest production-readiness commit marker in git history: `bfdfdc5` (`test(api): guard Arabic auth and plan messages`)
- Production deploy is **not** verified in this phase.
- P0 production items are documented in checklist form; they are not fixed in this phase.
- No deployment/config/runtime code changes were made in this phase.

## Latest Confirmed PDF Export State (from git history)

Recent PDF commits indicate:

- `53c0f61` — Phase 3E-C: RTL caption/paragraph grouping improvements
- `639e8f2` — Phase 3E-F: Arabic byline + paragraph grouping repair
- `3cdd104` — Phase 3F-A: PDF body batching optimization

Manual regression process and acceptance criteria are documented in:
- `docs/PDF_EXPORT_REGRESSION_CHECKLIST.md`

## Operational Next Action

1. Verify git state and working tree:
   - `git status -sb`
   - `git diff --check`
2. Verify repo health:
   - `pnpm test`
   - `pnpm lint`
   - `pnpm build`
3. If local app + env is already configured, do one manual smoke:
   - generate one story
   - export one PDF and confirm basic integrity

## Constraints to Keep

- Never print/request secrets (keys, URLs, tokens, credentials).
- No schema/migration/deployment changes unless explicitly approved.
- Preserve Arabic RTL PDF correctness.
- Preserve current PDF export performance improvements unless explicitly re-scoped.
