# Production Readiness Checklist

Related manual payment verification plan:
- `docs/LEMONSQUEEZY_PRODUCTION_VERIFICATION_PLAN.md`
- `docs/DEPLOYMENT_PROVIDER_DECISION.md`
- `docs/PRODUCTION_DEPLOYMENT_DRY_RUN_CHECKLIST.md`

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

- `FRONTEND_URL` must be set in the production API environment.
  - Reason: checkout redirect currently falls back to `http://localhost:3000`.
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
- Pricing checkout redirects to Lemon Squeezy
- Lemon webhook receives signed event
- Subscription update changes effective `User.plan`
- Cancel/expired subscription returns effective `User.plan` to `FREE`
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
