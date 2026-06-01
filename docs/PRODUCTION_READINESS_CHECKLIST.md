# Production Readiness Checklist

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
- Project planning may reference Render, but the repository currently contains Railway-named API config (`services/api/railway.json`).
- Before production deploy, decide whether Railway config remains active or whether Render documentation/config is needed.
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
  - Reason: frontend API client has a fallback to `https://dreemi-app.onrender.com`, but production should not rely on fallback.
- Lemon Squeezy webhook URL must point to production API:
  - `https://<production-api-domain>/api/payments/webhook`
- Lemon Squeezy webhook secret must match production provider settings.
- Verify production CORS allows the final frontend domain.

## 4) P1 Production-Readiness Items

- CORS is currently hardcoded in `services/api/src/index.ts`:
  - `http://localhost:3000`
  - `https://dreemi.app`
  - `https://www.dreemi.app`
  - `https://dreemi-app-web.vercel.app`
- Decide whether to keep hardcoded origins for V1 or introduce an explicit `ALLOWED_ORIGINS` environment variable in a later code phase.
- Clarify API hosting target:
  - Repo has `services/api/railway.json`
  - Project planning mentions Render
- Confirm Vercel production domain and preview deployment policy.
- Confirm `/health` is reachable on the production API domain.
- Confirm API `NODE_ENV=production`.
- Confirm frontend and backend domains match CORS and checkout redirect settings.

## 5) P2/P3 Cleanup Items

- `create-test-user.mjs` and `test-mistral.mjs` read `.env` from an old hardcoded path:
  - `C:/Projects/dreemi-app/.env`
  - Treat as local-only/legacy helper scripts until cleaned.
- Some comments/docs still contain mojibake markers like `â€”` or `â”€`; not runtime critical, can be cleaned later.
- `pnpm-lock.yaml` appears in broad text searches and should usually be excluded from future grep audits.

## 6) Validation Before Production Deploy

Required local checks:
- `git status -sb`
- `git diff --check`
- `pnpm test`
- `pnpm lint`
- `pnpm build`

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

## 7) Forbidden in Chat/Docs

- No secret values.
- No tokens.
- No DB URLs.
- No API keys.
- No Render/Vercel/Lemon/Supabase secret values.
- No `.env` / `.env.local` contents.
