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
- Phase 4-D1J note:
  - Android Play Console product/subscription mapping design is documented at `docs/ANDROID_PLAY_CONSOLE_PRODUCT_MAPPING_DESIGN.md`.
  - Android Play Console product/subscription mapping is now documented as a planning artifact for Google Play Billing implementation readiness.
  - Google product IDs and base plans remain placeholders in this phase.
  - No implementation happened in this phase.
- Phase 4-D2 note:
  - Entitlement model implementation planning is documented at `docs/ENTITLEMENT_MODEL_IMPLEMENTATION_PLAN.md`.
  - Provider-neutral entitlement implementation strategy is now documented, including User.plan compatibility, fail-closed rules, idempotency, and staged migration order.
  - No schema changes, migrations, runtime code changes, provider integration changes, or deployment happened in this phase.
- Phase 4-D2A note:
  - Entitlement schema design review is documented at `docs/ENTITLEMENT_SCHEMA_DESIGN_REVIEW.md`.
  - Provider-neutral entitlement schema direction is now documented, including model candidates, relationships, idempotency keys, migration risk, and rollback constraints.
  - No Prisma schema changes, migrations, runtime code changes, provider code changes, package changes, env changes, deployment, or mobile project changes happened in this phase.
- Phase 4-D2B note:
  - Entitlement service interface design is documented at `docs/ENTITLEMENT_SERVICE_INTERFACE_DESIGN.md`.
  - Provider-neutral service boundary direction is now documented, including EffectiveEntitlement lookup, User.plan projection compatibility, adapter boundaries, and fail-closed behavior for access checks.
  - No service implementation, runtime code changes, Prisma schema changes, migrations, provider code changes, package changes, env changes, deployment, or mobile project changes happened in this phase.
- Phase 4-D2C note:
  - User.plan projection compatibility planning is documented at `docs/USER_PLAN_PROJECTION_COMPATIBILITY_PLAN.md`.
  - Compatibility projection strategy is now documented, including safe EffectiveEntitlement to User.plan projection behavior, staged access-check migration, and fail-closed fallback rules.
  - No runtime/service/schema/migration/provider/package/env/deployment/mobile project changes happened in this phase.
- Phase 4-D2D note:
  - Entitlement runtime implementation readiness is documented at `docs/ENTITLEMENT_RUNTIME_IMPLEMENTATION_READINESS_CHECKLIST.md`.
  - Runtime implementation readiness gate is now documented, including first-phase code-skeleton scope, blocked scope, fail-closed requirements, test gate, and rollback gate.
  - No runtime/service/schema/migration/provider/package/env/deployment/mobile project changes happened in this phase.
- Phase 4-D3A note:
  - Entitlement runtime skeleton files are added at `services/api/src/types/entitlement.ts`, `services/api/src/services/entitlement.service.ts`, and `services/api/src/services/entitlement.service.test.ts`.
  - EntitlementService skeleton now exists but is not wired into routes, middleware, payments, Prisma, or access checks.
  - No behavior change was introduced in this phase.
  - No schema/migration/provider/env/deployment/mobile project changes happened in this phase. `services/api/package.json` test file list was updated only to include the new entitlement service test.
- Phase 4-D3D note:
  - Entitlement runtime integration readiness review is documented at `docs/ENTITLEMENT_RUNTIME_INTEGRATION_READINESS_REVIEW.md`.
  - Current legacy access-check map is now documented for story generation, child limits, and webhook User.plan projection points.
  - Future EntitlementService integration candidates, invariant safety constraints, rollback direction, and risk controls are documented with no runtime wiring.
  - No runtime/service/schema/migration/provider/package/env/deployment/mobile project changes happened in this phase.
- Phase 4-D3E note:
  - Entitlement runtime wiring preflight tests and static guardrails are strengthened in `services/api/src/services/entitlement.service.test.ts`.
  - Preflight guardrails now explicitly verify legacy User.plan access paths, limit invariants, no route/middleware wiring, and no provider-ID policy leakage in access-check files.
  - Recommended first future wiring surface is child-limit path first (`services/api/src/routes/children.ts`) with rollback-to-legacy direction before touching story-generation path.
  - No runtime/service/schema/migration/provider/package/env/deployment/mobile project changes happened in this phase.
- Phase 4-D3F note:
  - Child-limit single-surface runtime wiring proposal/review is documented at `docs/CHILD_LIMIT_ENTITLEMENT_WIRING_PROPOSAL.md`.
  - Proposal documents current child-limit behavior, future wiring scope, parity tests, acceptance criteria, rollback plan, and blocked items.
  - D3F remains documentation-only; no runtime wiring was implemented.
  - Next recommended phase is Phase 4-D3G child-limit runtime wiring only if explicitly approved.
- Phase 4-D3G note:
  - Child-limit runtime wiring is implemented in `services/api/src/routes/children.ts` only.
  - Child-limit decision now uses EntitlementService compatibility call path with `User.plan` as input.
  - Existing child-count query, block condition, and API response shape remain unchanged.
  - Stories path, plans middleware, payments path, schema, migrations, providers, frontend, deployment, package, and env configuration remain unchanged.
  - Next recommended phase is Phase 4-D3H runtime verification/rollback-readiness review before any second runtime surface wiring.
- Phase 4-D3H note:
  - Runtime verification and rollback-readiness review is documented at `docs/ENTITLEMENT_RUNTIME_VERIFICATION_AND_ROLLBACK_REVIEW.md`.
  - D3G verification confirms `b46af7a` scope remains child-limit wiring only in `services/api/src/routes/children.ts`.
  - Child-limit decision call, block condition (`currentCount >= limit`), and `403` response shape (`success`, `error`, `limit`, `current`) are documented as preserved.
  - External Supabase RLS remediation is documented (RLS enabled on `public.users`, `public.children`, `public.stories`, `public.subscriptions`; no public policies added), with runtime manual verification required.
  - No second runtime wiring is allowed until D3H verification is accepted; next recommended phase is D3I proposal/review only.
- Phase 4-D3I note:
  - Next runtime surface proposal/review is documented at `docs/NEXT_ENTITLEMENT_RUNTIME_SURFACE_PROPOSAL.md`.
  - D3I compares story generation, plans middleware, and payments/checkout/webhook as candidate second wiring surfaces.
  - D3I keeps runtime unchanged and selects recommendation direction only.
  - D3I recommends D3J as proposal/test-plan first (no automatic second runtime wiring).
- Phase 4-D3J note:
  - Story-generation entitlement wiring proposal/test-plan is documented at `docs/STORY_GENERATION_ENTITLEMENT_WIRING_TEST_PLAN.md`.
  - D3J defines future one-surface implementation scope, parity requirements, tests, rollback plan, and acceptance criteria for the story-generation monthly limit path.
  - D3J is documentation-only; no story-generation runtime wiring is implemented.
  - D3K may be a future narrow implementation phase only after D3J acceptance and explicit approval.
- Phase 4-D3K0 note:
  - Story-generation entitlement static guardrail preflight is implemented as test-only hardening.
  - D3K0 strengthens static baseline coverage for story-limit middleware order, FREE limit invariants, month-window counting, response contract, and pre-D3K non-wiring scope.
  - D3K0 adds no runtime wiring and no production code behavior changes.
  - D3K implementation must not start automatically and still requires explicit approval.
- Phase 4-D3K note:
  - Story-generation monthly-limit decision in `services/api/src/middleware/plans.middleware.ts` is now wired through EntitlementService compatibility projection.
  - D3K uses `getPlanForAccessCheck(userId, user.plan)` while preserving `User.plan` read, `FREE_MONTHLY_LIMIT = 3`, month-window counting, and blocked response shape.
  - D3K runtime surface scope is limited to `plans.middleware.ts`; `children.ts` remains D3G wiring surface and is unchanged.
  - `stories.ts` remains non-wired directly, and payments/checkout/webhook remain non-wired to EntitlementService.
  - No schema, migrations, provider logic, apps/web, deployment config, package, or env changes were introduced in D3K.
  - Next recommended phase is D3L runtime verification and rollback-readiness review only.
- Phase 4-D3L note:
  - Runtime verification and rollback-readiness review for D3K is documented at `docs/D3K_RUNTIME_VERIFICATION_AND_ROLLBACK_REVIEW.md`.
  - Stable baseline for this review is `543b4ad` (`Wire story generation limit to entitlement service`).
  - Confirmed runtime EntitlementService surfaces remain exactly two:
    - D3G: `services/api/src/routes/children.ts` child-limit decision path.
    - D3K: `services/api/src/middleware/plans.middleware.ts` story-limit plan decision path.
  - D3L is documentation-only and introduces no runtime/code changes.
  - No third runtime wiring surface is allowed until D3L is accepted and a separate proposal/test-plan is completed.
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
