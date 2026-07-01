# Production Readiness Checklist

Related manual payment verification plan:
- `docs/D3M_PRODUCTION_LAUNCH_GATE_CHECKLIST.md`
- `docs/D3M_DEPLOYMENT_ENV_VERIFICATION_PLAN.md`
- `docs/D3M_DEPLOYMENT_ENV_INVENTORY_CHECKLIST.md`
- `docs/D3M_PRESENCE_ONLY_ENV_AND_DEPLOYMENT_DRY_RUN_PROTOCOL.md`
- `docs/D3M_DEPLOYMENT_READINESS_EXECUTION_PACKET.md`
- `docs/D3M_NO_SECRET_DEPLOYMENT_READINESS_EVIDENCE_PASS.md`
- `docs/D3M_PRODUCTION_SMOKE_AND_LAUNCH_EVIDENCE_PACK.md`
- `docs/D3M_NO_DEPLOY_MANUAL_SMOKE_EXECUTION_WORKSHEET.md`
- `docs/D3M_PAYMENTS_PROVIDER_RESPONSE_PACKAGE.md`
- `docs/D3M_LEMON_SQUEEZY_RESPONSE_DRAFT.md`
- `docs/D3M_LEMON_REJECTION_RECONCILIATION.md`
- `docs/D3M_PAYMENT_PROVIDER_ALTERNATIVES_NEXT_STEP.md`
- `docs/D3M_PAYMENT_PROVIDER_ALTERNATIVE_SELECTION.md`
- `docs/D3M_PAYMENT_PROVIDER_SHORTLIST.md`
- `docs/D3M_LOCAL_NO_DEPLOY_MANUAL_SMOKE_RESULTS.md`
- `docs/D3M_NON_IMAGE_PRODUCTION_READINESS_TRIAGE.md`
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

Launch gate reference:

- Central Go/No-Go reference is `docs/D3M_PRODUCTION_LAUNCH_GATE_CHECKLIST.md`.
- Deployment/env verification plan reference is `docs/D3M_DEPLOYMENT_ENV_VERIFICATION_PLAN.md`.
- Deployment/env inventory checklist reference is `docs/D3M_DEPLOYMENT_ENV_INVENTORY_CHECKLIST.md`.
- Presence-only env + deployment dry-run protocol reference is `docs/D3M_PRESENCE_ONLY_ENV_AND_DEPLOYMENT_DRY_RUN_PROTOCOL.md`.
- Deployment readiness execution packet reference is `docs/D3M_DEPLOYMENT_READINESS_EXECUTION_PACKET.md`.
- No-secret deployment readiness evidence pass reference is `docs/D3M_NO_SECRET_DEPLOYMENT_READINESS_EVIDENCE_PASS.md`.
- Production smoke and launch evidence pack reference is `docs/D3M_PRODUCTION_SMOKE_AND_LAUNCH_EVIDENCE_PACK.md`.
- No-deploy manual smoke execution worksheet reference is `docs/D3M_NO_DEPLOY_MANUAL_SMOKE_EXECUTION_WORKSHEET.md`.
- Local no-deploy manual smoke results (D6) are at `docs/D3M_LOCAL_NO_DEPLOY_MANUAL_SMOKE_RESULTS.md`.
- Payment provider: **Lemon Squeezy REJECTED** — alternate MoR provider required (`docs/D3M_LEMON_REJECTION_RECONCILIATION.md`).
- `docs/D3M_ENTITY_AND_PAYOUT_DECISION.md`
- `docs/D3M_FASTSPRING_APPLICATION_INPUTS_CHECKLIST.md`
- `docs/D3M_PAYMENT_PRICING_AND_REFUND_DECISION.md`
- Alternative provider selection documented (2026-06-07): primary candidate **FastSpring**, backup **Creem** (`docs/D3M_PAYMENT_PROVIDER_ALTERNATIVE_SELECTION.md`).
- FastSpring Individual Monthly test checkout **PASS on retry**. **Activation request SENT 2026-06-13**. **Follow-up email SENT 2026-06-30**. **Company registration response SENT 2026-07-01** to Louis / FastSpring support; awaiting reply after company registration response. **Webhook/entitlement planning COMPLETE (docs-only)**; runtime not implemented. Production billing **NO-GO**.
- Database uptime/free-tier auto-pause risk added as production blocker (`docs/D3M_SUPABASE_INACTIVITY_WARNING.md`). Supabase active at manual check time (2026-06-11); production DB uptime decision remains pending.
- Full production remains No-Go until critical launch gates are PASS with explicit evidence.
- Local manual smoke evidence is PARTIAL/local-only; D6-Fix improves story detail route only.

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
- Alternative payment provider selection documented (2026-06-07):
  - `docs/D3M_PAYMENT_PROVIDER_ALTERNATIVE_SELECTION.md`
  - `docs/D3M_PAYMENT_PROVIDER_SHORTLIST.md`
- Blocker: replacement provider **candidate** selected (FastSpring primary) but **not approved** yet.
- Blocker: entity/payout/pricing **partially filled** (`docs/D3M_ENTITY_AND_PAYOUT_DECISION.md`, `docs/D3M_PAYMENT_PRICING_AND_REFUND_DECISION.md`); provider eligibility **PROVIDER_CONFIRMATION_REQUIRED**.
- Blocker: legal payout path/entity model is not confirmed yet.
- Blocker: payout recipient identity/entity is not selected yet.
- Blocker: provider KYC/KYB feasibility is not verified for the selected legal path.
- Blocker: provider external verification checklist is not completed yet.
- Blocker: no real checkout/purchase/webhook/provider verification has been run for an approved replacement provider.
- Blocker: provider sandbox/controlled checkout verification readiness is not confirmed.
- External provider eligibility and KYC/KYB verification are required before any runtime/provider integration phase.
- External legal/accounting review is required before any paid launch or payment activation claim.
- Provider application package is required before implementation-phase approval.
- Reconciliation note: payment-track implementation/docs checkpoints were reconciled at `docs/D3M_PAYMENT_TRACK_STATE_RECONCILIATION.md`; production readiness still requires separate verification gates.
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
- Image generation reliability/fallback path should be reviewed before production claim:
  - reference triage: `docs/D3M_IMAGE_GENERATION_TRIAGE.md`
  - hardening plan reference: `docs/D3M_IMAGE_FALLBACK_HARDENING_PLAN.md`
  - safe runtime smoke planning reference: `docs/D3M_IMAGE_RUNTIME_SMOKE_PLAN.md` (`D3M-Triage-C4`)
  - no-provider/static regression coverage reference: `services/api/src/routes/stories.security-regression.test.ts` (`D3M-Triage-C2`)
  - generate-page explicit image `onError` fallback is now implemented (`D3M-Triage-C3`)
  - no-provider/static regression and generate-page fallback polish phases (`D3M-Triage-C2`, `D3M-Triage-C3`) should be accepted before any runtime image smoke phase
  - runtime image smoke execution remains pending and requires explicit approved execution phase (`D3M-Triage-C5`)
  - latest C5 attempt record: `docs/D3M_IMAGE_RUNTIME_SMOKE_RESULTS.md` (blocked run; rerun required after local shell reliability is restored)
  - provider behavior must not be treated as verified without a dedicated safe runtime smoke phase.
  - image provider must not be treated as production-ready until controlled smoke execution is completed and documented.
- Non-image launch readiness triage reference:
  - `docs/D3M_NON_IMAGE_PRODUCTION_READINESS_TRIAGE.md`
  - full production launch remains No-Go until blocker categories (payment/provider, deployment/env, security/qa, monitoring, and required smoke evidence) are closed with explicit evidence.

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
- Optional local helper: `.\tooling\validate_phase.ps1` (convenience only; does not replace CI or manual review).
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
