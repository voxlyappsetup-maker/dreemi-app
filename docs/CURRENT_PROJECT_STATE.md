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

- Implemented legacy/current payment integration is Lemon Squeezy, but it is not approved for production launch.
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
- Reference dry-run checklist: `docs/PRODUCTION_DEPLOYMENT_DRY_RUN_CHECKLIST.md`
- Reference Lemon manual verification plan: `docs/LEMONSQUEEZY_PRODUCTION_VERIFICATION_PLAN.md`
- Reference deployment provider state: `docs/DEPLOYMENT_PROVIDER_DECISION.md`
- Latest production-readiness commit marker in git history: `14cb1dc` (`fix(api): add production checkout and cors guardrails`)
- Production deploy is **not** verified in this phase.
- P0 production items are documented in checklist form; they are not fixed in this phase.
- Lemon production verification has **not** been completed in this phase.
- No deployment/config/runtime code changes were made in this phase.
- Deployment provider state currently documented:
  - frontend config present: `vercel.json`
  - API config present: `services/api/railway.json`
  - no Render config currently present
  - deployment provider switch not performed in this phase
- Phase 4-C7 guardrail:
  - `apps/web/src/lib/api.ts` now enforces `NEXT_PUBLIC_API_URL` in production (no legacy onrender fallback), while retaining `http://localhost:3001` fallback outside production.
- Phase 4-C8 note:
  - Production deployment dry-run checklist added at `docs/PRODUCTION_DEPLOYMENT_DRY_RUN_CHECKLIST.md`.
  - Production deployment remains unverified and pending explicit approval plus checklist completion.
- Phase 4-D1B note:
  - Lemon Squeezy rejected the store application at this time.
  - Lemon production verification is paused unless approval status changes.
  - Payment provider decision is reopened before paid launch.
  - Reference strategy: `docs/PAYMENT_PROVIDER_STRATEGY_AFTER_LEMON_REJECTION.md`.
- Phase 4-D1B-2 note:
  - Lemon reconsideration was denied after clarification/reconsideration was attempted.
  - Lemon remains paused and should not be treated as the launch provider.
  - Payment provider decision remains reopened.
  - Next recommended phase is Phase 4-D1C - payment provider abstraction audit.
  - No runtime code changed in this documentation phase.
- Phase 4-D1D-A note:
  - Provider-neutral entitlement design lock is documented at `docs/ENTITLEMENT_MODEL_DESIGN_LOCK.md`.
  - Provider-neutral entitlement design is now the next architectural foundation before Apple/Google/web provider implementation.
  - Lemon remains paused, and existing Lemon code remains implementation detail only for now.
  - No runtime, schema, or provider implementation happened in this phase.
- Phase 4-D1D note:
  - Parent-first mobile-first monetization direction is now the official product direction.
  - Mobile monetization and parent-first product lock is documented at `docs/MOBILE_MONETIZATION_PARENT_FIRST_DESIGN_LOCK.md`.
  - Mobile paid launch planning now requires Apple/Google billing readiness and parent-facing paywall constraints.
  - No implementation happened in this phase.
- Phase 4-D1E note:
  - Apple IAP readiness planning is documented at `docs/APPLE_IAP_READINESS_PLAN.md`.
  - Apple IAP readiness is now documented as future iOS paid launch planning.
  - Apple IAP planning must map into provider-neutral entitlement design.
  - No implementation happened in this phase.
- Phase 4-D1F note:
  - Google Play Billing readiness planning is documented at `docs/GOOGLE_PLAY_BILLING_READINESS_PLAN.md`.
  - Google Play Billing readiness is now documented as future Android paid launch planning.
  - Google Play Billing planning must map into provider-neutral entitlement design.
  - No implementation happened in this phase.
- Phase 4-D1G note:
  - AI safety and unsafe story reporting mobile readiness planning is documented at `docs/AI_SAFETY_MOBILE_READINESS_PLAN.md`.
  - Unsafe story reporting and AI safety mobile readiness are now documented as P0 mobile launch requirements.
  - Public/community story features remain out of intended mobile v1 until separately designed.
  - No implementation happened in this phase.
- Phase 4-D1H note:
  - Privacy and data safety inventory is documented at `docs/PRIVACY_DATA_SAFETY_INVENTORY.md`.
  - Privacy and data safety inventory is now documented as a P0 mobile submission requirement.
  - Apple App Privacy and Google Play Data Safety answers are not finalized in this phase.
  - No implementation happened in this phase.
- Phase 4-D1I note:
  - iOS App Store product/subscription mapping design is documented at `docs/IOS_APP_STORE_PRODUCT_MAPPING_DESIGN.md`.
  - iOS App Store product/subscription mapping is now documented as a planning artifact for Apple IAP implementation readiness.
  - Apple product IDs remain placeholders in this phase.
  - No implementation happened in this phase.
- Runtime safety gate note:
  - Lemon Squeezy integration exists but is not approved for production launch.
  - Paid checkout is disabled by default until an approved payment provider is verified.
  - API checkout now fails closed using centralized billing gate checks.

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
