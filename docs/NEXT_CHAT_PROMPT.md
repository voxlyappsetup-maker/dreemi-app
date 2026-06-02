# Next Chat Prompt (Copy-Ready)

Use this prompt for the next ChatGPT/Cursor session:

---

You are working in `C:\Projects\qisas-app` (Dreemi / Qisas monorepo).

Before proposing or editing anything, **read repository files first** and ground your response in current code/docs/git state.

Read these first:
- `README.md`
- `apps/web/README.md`
- `package.json`
- `pnpm-workspace.yaml`
- `turbo.json`
- `docs/PROJECT_HANDOFF.md`
- `docs/CURRENT_PROJECT_STATE.md`
- `docs/PRODUCTION_READINESS_CHECKLIST.md`
- `docs/PRODUCTION_DEPLOYMENT_DRY_RUN_CHECKLIST.md`
- `docs/LEMONSQUEEZY_PRODUCTION_VERIFICATION_PLAN.md`
- `docs/PAYMENT_PROVIDER_STRATEGY_AFTER_LEMON_REJECTION.md`
- `docs/ENTITLEMENT_MODEL_DESIGN_LOCK.md`
- `docs/ENTITLEMENT_MODEL_IMPLEMENTATION_PLAN.md`
- `docs/ENTITLEMENT_SCHEMA_DESIGN_REVIEW.md`
- `docs/ENTITLEMENT_SERVICE_INTERFACE_DESIGN.md`
- `docs/USER_PLAN_PROJECTION_COMPATIBILITY_PLAN.md`
- `docs/MOBILE_MONETIZATION_PARENT_FIRST_DESIGN_LOCK.md`
- `docs/APPLE_IAP_READINESS_PLAN.md`
- `docs/GOOGLE_PLAY_BILLING_READINESS_PLAN.md`
- `docs/AI_SAFETY_MOBILE_READINESS_PLAN.md`
- `docs/PRIVACY_DATA_SAFETY_INVENTORY.md`
- `docs/IOS_APP_STORE_PRODUCT_MAPPING_DESIGN.md`
- `docs/ANDROID_PLAY_CONSOLE_PRODUCT_MAPPING_DESIGN.md`
- `docs/DEPLOYMENT_PROVIDER_DECISION.md`
- `docs/PDF_EXPORT_STATE.md`
- `docs/PDF_EXPORT_REGRESSION_CHECKLIST.md`
- `vercel.json`
- `services/api/railway.json`
- `services/api/src/index.ts`
- `apps/web/src/lib/api.ts`
- `.env.example`
- `apps/web/src/lib/exportStoryPdf.ts`
- `services/api/src/services/mistral.service.ts`
- `services/api/src/services/mistral.service.test.ts`
- `services/api/src/services/image.service.ts`
- `services/api/src/services/safety.service.ts`
- `services/api/src/routes/stories.security-regression.test.ts`
- `services/api/src/routes/payments.ts`
- `services/api/src/services/lemonsqueezy.service.ts`
- `services/api/src/config/billing.ts`
- `services/api/src/config/billing.test.ts`
- `services/api/src/routes/payments.security-regression.test.ts`
- `services/api/src/middleware/plans.middleware.ts`
- `services/api/src/routes/children.ts`
- `apps/web/src/app/[locale]/pricing/page.tsx`
- `apps/web/src/components/LandingPricing.tsx`
- `apps/web/src/app/[locale]/children/page.tsx`

Then run and report:
- `git status -sb`
- `git diff --check`
- `pnpm test`
- `pnpm lint`
- `pnpm build`

If local env/app is already configured, perform one manual smoke:
- generate one story
- export one PDF

Constraints:
- Current implemented payment integration is Lemon Squeezy, but it is paused and not approved for production launch.
- Never print/request secrets, keys, tokens, DB URLs, or credentials.
- Do not ask for or print Lemon/Supabase/Render/Vercel/API secret values.
- Treat `.env.example` as safe to read, but never replace placeholders with real values.
- Do not modify `.env` / `.env.local`.
- Treat `.env` files as off-limits.
- Do not change schema/migrations/deployment unless explicitly approved.
- No migrations/deployment changes without explicit approval.
- Do not deploy or alter deployment config without explicit approval.
- Do not deploy without explicit approval.
- Do not add, remove, rename, or modify deployment provider config without explicit approval.
- Treat Render vs Railway as unresolved unless a later commit/document states otherwise.
- Production env values must be handled outside chat.
- Production deployment must follow `docs/PRODUCTION_DEPLOYMENT_DRY_RUN_CHECKLIST.md`.
- Do not request or print secrets.
- Frontend API URL guard is expected: `apps/web/src/lib/api.ts` must not use a production fallback URL and should require `NEXT_PUBLIC_API_URL` in production.
- Lemon is paused unless approval status changes.
- Lemon rejection and reconsideration denial are documented.
- Do not proceed with Lemon production verification unless approval changes.
- Lemon Squeezy integration exists but is not approved for production launch.
- Paid checkout is disabled by default until an approved payment provider is verified.
- Do not build new payment provider integration without an explicit approved phase.
- Do not remove Lemon code unless explicitly approved.
- Next recommended step is a read-only payment provider abstraction audit.
- Lemon production verification must not include secret values in chat/docs.
- Do not claim Lemon production verification passed unless manual evidence has been provided.
- Entitlement model design lock must guide future payment work.
- Entitlement model implementation plan must guide future staged execution and compatibility decisions.
- Entitlement schema design review must guide future Prisma model planning before any schema/migration phase.
- Entitlement service interface design must guide runtime boundary planning before any service implementation.
- User.plan projection compatibility plan must guide staged migration before access-check runtime changes.
- Parent-first mobile monetization design must guide future payment and packaging work.
- Web provider must not control the mobile entitlement model.
- User.plan remains the current compatibility projection until an explicit implementation phase updates that behavior.
- Provider-specific IDs must not become direct access-check logic.
- Do not implement entitlement schema, migrations, entitlement service, Apple adapter, Google adapter, provider replacement, package changes, or runtime access-check changes without an explicit approved phase.
- Do not implement EntitlementService, provider adapters, access-check runtime changes, schema, migrations, package changes, or env changes without an explicit approved phase.
- Do not implement User.plan projection, EntitlementService, access-check changes, schema, migrations, provider adapters, package changes, or env changes without explicit phase.
- Do not modify `prisma/schema.prisma` or migrations without explicit schema phase approval.
- Do not rename/remove current Subscription fields without explicit schema phase approval.
- Do not remove or change User.plan semantics without explicit schema/migration approval.
- Do not store raw provider secrets, purchase tokens, signed payloads, JWTs, or private story content in entitlement records or logs.
- User.plan remains current compatibility projection.
- Unknown entitlement must behave as FREE.
- Access checks must not use provider-specific IDs directly.
- Do not implement Apple IAP, Google Play Billing, Paddle, PayPal, schema changes, migrations, or provider code without an explicit approved phase.
- Do not implement StoreKit, App Store Server API, App Store Server Notifications, Apple product IDs, schema changes, migrations, or package changes without an explicit approved phase.
- Apple IAP planning must map into the provider-neutral entitlement model.
- iOS paywall must remain parent-facing and avoid child-facing checkout.
- Do not implement App Store Connect setup, schema changes, migrations, package changes, or runtime code changes without an explicit approved phase.
- Apple product IDs in docs are placeholders unless later finalized in an approved phase.
- iOS paid launch requires entitlement readiness, safety readiness, privacy readiness, and App Store readiness.
- Do not implement Play Billing Library, Google Play Developer API, RTDN, Google product IDs, schema changes, migrations, or package changes without an explicit approved phase.
- Google Play Billing planning must map into the provider-neutral entitlement model.
- Android paywall must remain parent-facing and avoid child-facing checkout.
- Do not implement Google Play Billing Library, Google Play Developer API, RTDN, Play Console setup, Android application ID changes, schema changes, migrations, package changes, or runtime code without an explicit approved phase.
- Google product IDs/base plans in docs are placeholders unless later finalized in an approved phase.
- Android paid launch requires entitlement readiness, safety readiness, privacy readiness, and Play Console readiness.
- Do not implement reporting UI, backend report routes, schema changes, migrations, AI provider changes, admin tooling, or PDF/export safety gating without an explicit approved phase.
- Mobile release requires unsafe story reporting and AI safety readiness.
- Public/community story features remain out of mobile v1 unless separately designed.
- Do not finalize App Privacy or Google Play Data Safety answers without reviewing actual implemented data flows.
- Do not add analytics/crash/payment/AI SDKs without an explicit approved phase.
- Do not modify privacy policy, schema, providers, SDKs, or logging behavior without an explicit approved phase.
- Child-facing checkout is not allowed in the intended product direction.
- Do not change PDF export behavior unless the requested task requires it.
- Preserve Arabic RTL PDF correctness and existing performance improvements.
- Do not commit/push unless explicitly asked.

In your response, include:
1. files reviewed
2. current repo status
3. findings grounded in code
4. exact next recommended action

---
