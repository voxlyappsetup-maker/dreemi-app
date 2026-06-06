# Production Readiness Checklist

Related manual payment verification plan:
- `docs/LEMONSQUEEZY_PRODUCTION_VERIFICATION_PLAN.md`
- `docs/DEPLOYMENT_PROVIDER_DECISION.md`
- `docs/PRODUCTION_DEPLOYMENT_DRY_RUN_CHECKLIST.md`
- `docs/PAYMENT_PROVIDER_STRATEGY_AFTER_LEMON_REJECTION.md`
- `docs/ENTITLEMENT_MODEL_DESIGN_LOCK.md`
- `docs/ENTITLEMENT_MODEL_IMPLEMENTATION_PLAN.md`
- `docs/ENTITLEMENT_SCHEMA_DESIGN_REVIEW.md`
- `docs/ENTITLEMENT_SERVICE_INTERFACE_DESIGN.md`
- `docs/USER_PLAN_PROJECTION_COMPATIBILITY_PLAN.md`
- `docs/ENTITLEMENT_RUNTIME_IMPLEMENTATION_READINESS_CHECKLIST.md`
- `docs/MOBILE_MONETIZATION_PARENT_FIRST_DESIGN_LOCK.md`
- `docs/APPLE_IAP_READINESS_PLAN.md`
- `docs/GOOGLE_PLAY_BILLING_READINESS_PLAN.md`
- `docs/AI_SAFETY_MOBILE_READINESS_PLAN.md`
- `docs/PRIVACY_DATA_SAFETY_INVENTORY.md`
- `docs/IOS_APP_STORE_PRODUCT_MAPPING_DESIGN.md`
- `docs/ANDROID_PLAY_CONSOLE_PRODUCT_MAPPING_DESIGN.md`

## 1) Current Deployment Files

- Frontend deployment config:
  - `vercel.json`
  - Build command: `cd apps/web && next build`
  - Output directory: `apps/web/.next`
  - Install command: `pnpm install --frozen-lockfile`
- API deployment config:
  - `services/api/railway.json`
  - Start command: `node dist/index.js`
  - Healthcheck path: `/health`

Notes:
- Current repository truth: frontend deployment is configured via `vercel.json`, and API deployment is configured via `services/api/railway.json`.
- Render is not currently configured in the repository.
- API hosting target must be finalized before payment production verification.
- Do not change deployment config without explicit approval.

## 2) Required Production Environment Variable Names

Names only (no values).

API/server:
- `DATABASE_URL`
- `DIRECT_URL`
- `JWT_SECRET`
- `JWT_REFRESH_SECRET`
- `MISTRAL_API_KEY`
- `LEMONSQUEEZY_API_KEY`
- `LEMONSQUEEZY_STORE_ID`
- `LEMONSQUEEZY_WEBHOOK_SECRET`
- `FRONTEND_URL`
- `ALLOWED_ORIGINS`
- `NODE_ENV`
- `PORT` or `API_PORT`

Frontend/Vercel:
- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_APP_NAME`

Potentially local/legacy or currently not used by runtime scan:
- `REDIS_URL`
- `ANTHROPIC_API_KEY`

Important notes:
- `DATABASE_URL` and `DIRECT_URL` are required production database connection variable names.
- Configure production values in the hosting provider environment settings, not in docs or chat.
- `.env.example` currently shows local-development values.
- `.env.example` is placeholder-only and local-development oriented.
- Do not paste secret values into docs.
- Do not ask users to provide secret values in chat.
- `DIRECT_URL` appears in `prisma/schema.prisma`; ensure production environment has it if Prisma requires it.

## 3) P0 Blockers Before Real Payments

- Payment provider approval is a P0 blocker before any paid launch.
- Lemon Squeezy is not approved and reconsideration was denied.
- Lemon is rejected/unavailable for this app as a production payment path and should be treated as blocked unless future explicit acceptance occurs.
- Lemon Squeezy production verification is paused unless Lemon approval status changes.
- Production payment verification must move to a replacement provider strategy before paid launch.
- Alternative provider/legal payout recovery planning must be completed before any provider activation path:
  - `docs/D3M_PAYMENT_PROVIDER_REJECTION_RECOVERY_PLAN.md`
- Alternative payment provider selection matrix must be completed and accepted before integration planning:
  - `docs/D3M_ALTERNATIVE_PAYMENT_PROVIDER_SELECTION_MATRIX.md`
- Blocker: replacement provider is not selected yet.
- Blocker: legal payout path/entity model is not confirmed yet.
- Blocker: payout recipient identity/entity is not selected yet.
- Blocker: provider KYC/KYB feasibility is not verified for the selected legal path.
- Blocker: provider external verification checklist is not completed yet.
- Blocker: no real checkout/purchase/webhook/provider verification has been run for an approved replacement provider.
- Blocker: provider sandbox/controlled checkout verification readiness is not confirmed.
- External provider eligibility and KYC/KYB verification are required before any runtime/provider integration phase.
- External legal/accounting review is required before any paid launch or payment activation claim.
- Provider application package is required before implementation-phase approval.
- Payment readiness contract/UX alignment should follow `docs/D3M_PAYMENT_READINESS_GAP_IMPLEMENTATION_PLAN.md` before any checkout-readiness runtime changes.
- After readiness/UX contract implementation, run no-purchase verification first; do not treat this as real checkout/provider production verification.
- Provider-neutral entitlement design lock is a blocker before mobile paid launch:
  - `docs/ENTITLEMENT_MODEL_DESIGN_LOCK.md`
- Provider-neutral entitlement implementation plan is a blocker before mobile paid launch:
  - `docs/ENTITLEMENT_MODEL_IMPLEMENTATION_PLAN.md`
- Entitlement schema design review is a blocker before entitlement implementation and mobile paid launch:
  - `docs/ENTITLEMENT_SCHEMA_DESIGN_REVIEW.md`
- Entitlement service interface design is a blocker before entitlement service implementation and mobile paid launch:
  - `docs/ENTITLEMENT_SERVICE_INTERFACE_DESIGN.md`
- User.plan projection compatibility plan is a blocker before entitlement runtime implementation and mobile paid launch:
  - `docs/USER_PLAN_PROJECTION_COMPATIBILITY_PLAN.md`
- Entitlement runtime implementation readiness checklist is a blocker before entitlement runtime implementation and mobile paid launch:
  - `docs/ENTITLEMENT_RUNTIME_IMPLEMENTATION_READINESS_CHECKLIST.md`
- Parent-first mobile monetization design lock is a blocker before mobile paid launch:
  - `docs/MOBILE_MONETIZATION_PARENT_FIRST_DESIGN_LOCK.md`
- Apple IAP readiness plan is a blocker before iOS paid launch:
  - `docs/APPLE_IAP_READINESS_PLAN.md`
- iOS App Store product and subscription mapping design is a blocker before iOS paid launch:
  - `docs/IOS_APP_STORE_PRODUCT_MAPPING_DESIGN.md`
- Google Play Billing readiness plan is a blocker before Android paid launch:
  - `docs/GOOGLE_PLAY_BILLING_READINESS_PLAN.md`
- Android Play Console product and subscription mapping design is a blocker before Android paid launch:
  - `docs/ANDROID_PLAY_CONSOLE_PRODUCT_MAPPING_DESIGN.md`
- AI safety and unsafe story reporting readiness is a blocker before mobile release:
  - `docs/AI_SAFETY_MOBILE_READINESS_PLAN.md`
- Privacy and data safety inventory is a blocker before mobile submission:
  - `docs/PRIVACY_DATA_SAFETY_INVENTORY.md`
- Web production deploy and mobile paid launch are separate tracks:
  - web deploy readiness alone is not sufficient for native mobile monetization readiness.
- Web payments readiness is separate from native mobile billing readiness.
- Web production deploy, web payments, and iOS paid launch are separate tracks.
- Web production deploy, web payments, iOS paid launch, and Android paid launch are separate tracks.
- Web production deploy, web payments, iOS paid launch, Android paid launch, and mobile safety readiness are separate tracks.
- Web production deploy, web payments, iOS paid launch, Android paid launch, mobile safety readiness, and mobile privacy readiness are separate tracks.
- Mobile paid launch requires Apple IAP and Google Play Billing readiness, not only web provider readiness.
- Mobile paid launch requires entitlement implementation planning, platform product mapping, safety readiness, privacy readiness, and provider/platform verification.
- Mobile paid launch requires schema review, service interface design, projection compatibility, runtime readiness, platform product mapping, safety readiness, privacy readiness, and platform/provider verification.
- Entitlement skeleton code alone does not enable paid launch or provider approval.
- Paid launch still requires schema, projection, adapters, platform/provider verification, safety/privacy readiness, and deployment verification.
- Entitlement schema implementation requires a separate approved schema phase with migration, backfill, and rollback approval before execution.
- Mobile paid launch also requires parent-facing paywall design and child-surface checkout boundaries.
- iOS paid launch requires StoreKit/App Store planning and parent-facing paywall design.
- iOS paid launch also requires product mapping, entitlement mapping, safety readiness, and privacy readiness.
- Android paid launch requires Play Billing/Play Console planning and parent-facing paywall design.
- Android paid launch also requires product mapping, entitlement mapping, safety readiness, privacy readiness, and Play Console readiness.
- Mobile submission should not proceed until unsafe story reporting and safety review design are accepted.
- Mobile submission should not proceed until privacy/data safety inventory is accepted.
- Lemon Squeezy integration exists but is not approved for production launch.
- Paid checkout is disabled by default until an approved payment provider is verified.
- Do not treat any provider as production-approved until explicit provider approval and production verification are completed.
- `FRONTEND_URL` must be set in the production API environment.
  - Reason: production checkout now fails closed when `FRONTEND_URL` is missing.
- `NEXT_PUBLIC_API_URL` must be set explicitly in Vercel.
  - Reason: frontend API client now fails fast in production when `NEXT_PUBLIC_API_URL` is missing; local `http://localhost:3001` fallback is non-production only.
- Lemon Squeezy webhook URL must point to production API:
  - `https://<production-api-domain>/api/payments/webhook`
- Lemon Squeezy webhook secret must match production provider settings.
- Verify production CORS allows the final frontend domain.

## 4) P1 Production-Readiness Items

- CORS in `services/api/src/index.ts` now supports `ALLOWED_ORIGINS` (comma-separated) with fallback defaults:
  - `http://localhost:3000`
  - `https://dreemi.app`
  - `https://www.dreemi.app`
  - `https://dreemi-app-web.vercel.app`
- Production should set `ALLOWED_ORIGINS` explicitly to final frontend domain(s).
- Clarify API hosting target:
  - Repo currently has `services/api/railway.json` for API deploy settings
  - Render remains unconfigured until an explicit future phase
- Confirm Vercel production domain and preview deployment policy.
- Confirm `/health` is reachable on the production API domain.
- Confirm API `NODE_ENV=production`.
- Confirm frontend and backend domains match CORS and checkout redirect settings.

## 5) P2/P3 Cleanup Items

- `create-test-user.mjs` and `test-mistral.mjs` read `.env` from an old hardcoded path:
  - `C:/Projects/dreemi-app/.env`
  - Treat as local-only/legacy helper scripts until cleaned.
- Historical mojibake markers in docs/comments should be kept out of source; broad grep audits should still exclude `pnpm-lock.yaml`.
- `pnpm-lock.yaml` appears in broad text searches and should usually be excluded from future grep audits.

## 6) Validation Before Production Deploy

Required local checks:
- `git status -sb`
- `git diff --check`
- `pnpm test`
- `pnpm lint`
- `pnpm build`
- Complete `docs/PRODUCTION_DEPLOYMENT_DRY_RUN_CHECKLIST.md` before any real production deploy.

Production smoke checks after deploy:
- API `/health`
- Web loads from final domain
- Register/login flow
- Generate story flow
- Children create limit behavior
- Pricing page payment behavior follows current approved-provider state.
- Lemon checkout/webhook smoke steps are blocked unless Lemon approval status changes.
- If a replacement provider is selected and implemented in an explicit later phase, run that provider's checkout/webhook smoke flow instead.
- Subscription update changes effective `User.plan` (for approved provider path only).
- Cancel/expired subscription returns effective `User.plan` to `FREE` (for approved provider path only).
- PDF export smoke
- Lemon Squeezy checkout/webhook verification should follow:
  - `docs/LEMONSQUEEZY_PRODUCTION_VERIFICATION_PLAN.md`

## 7) Forbidden in Chat/Docs

- No secret values.
- No tokens.
- No DB URLs.
- No API keys.
- No Render/Vercel/Lemon/Supabase secret values.
- No `.env` / `.env.local` contents.
