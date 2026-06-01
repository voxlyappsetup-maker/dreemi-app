# Production Deployment Dry-Run Checklist

## 1. Purpose

- This checklist defines the dry-run sequence before any real production deploy.
- It does not perform deployment.
- It does not prove production is live.
- It must not contain secret values.

## 2. Current known deployment state

- Frontend:
  - current config file: `vercel.json`
  - implied provider: Vercel
  - build command: `cd apps/web && next build`
  - output directory: `apps/web/.next`
  - install command: `pnpm install --frozen-lockfile`
- API:
  - current config file: `services/api/railway.json`
  - implied provider by config name: Railway
  - builder: `NIXPACKS`
  - start command: `node dist/index.js`
  - healthcheck path: `/health`
- Render:
  - not configured in repository
  - future option only, requiring explicit approval and a separate phase

## 3. Pre-deploy local validation

Checklist:
- `git status --short --branch` shows clean main aligned with origin/main.
- `git diff --check` passes.
- `pnpm test` passes.
- `pnpm lint` passes.
- `pnpm build` passes.
- Confirm no uncommitted files.
- Confirm latest commit SHA is recorded before deploy.
- Confirm no `.env` or secret files are staged.

## 4. Provider decision gate

Before deployment:
- Confirm API hosting provider:
  - Railway current config path, or
  - future Render config if explicitly approved later
- Confirm final API production domain.
- Confirm final frontend production domain.
- Confirm whether preview deployments are allowed.
- Confirm no deployment config changes are being made without approval.
- Confirm payment provider account approval before any paid launch.
- Reference:
  - `docs/DEPLOYMENT_PROVIDER_DECISION.md`
  - `docs/PAYMENT_PROVIDER_STRATEGY_AFTER_LEMON_REJECTION.md`

## 5. Frontend/Vercel dry-run checklist

Names only, no values:
- Confirm Vercel project points to the correct repository and branch.
- Confirm build command matches `vercel.json`.
- Confirm output directory matches `vercel.json`.
- Confirm `NEXT_PUBLIC_API_URL` is configured explicitly.
- Confirm `NEXT_PUBLIC_APP_NAME` is configured if needed.
- Confirm no frontend production build relies on old hardcoded API fallback.
- Confirm final frontend URL is known before API CORS and Lemon webhook setup.

## 6. API hosting dry-run checklist

Names only, no values:
- Confirm API build/start command for selected provider.
- Confirm `/health` endpoint path.
- Confirm production API domain.
- Confirm required environment variable names are configured in provider dashboard:
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
- Confirm `NODE_ENV=production`.
- Confirm `FRONTEND_URL` is the final frontend URL.
- Confirm `ALLOWED_ORIGINS` includes final frontend origin(s).
- Confirm no secret values are pasted into docs or chat.

## 7. Database readiness dry-run checklist

Names only, no values:
- Confirm production Postgres database exists.
- Confirm `DATABASE_URL` is configured for application access.
- Confirm `DIRECT_URL` is configured if Prisma requires it.
- Confirm migrations strategy is approved before any production migration.
- Do not run migrations in this phase.
- Confirm backup/rollback expectation is documented outside chat before production data changes.

## 8. Lemon Squeezy dry-run checklist

Reference:
- `docs/LEMONSQUEEZY_PRODUCTION_VERIFICATION_PLAN.md`
- `docs/PAYMENT_PROVIDER_STRATEGY_AFTER_LEMON_REJECTION.md`

Checklist:
- Lemon webhook/payment smoke steps are blocked unless Lemon approval status changes or a replacement provider is selected in an explicit phase.
- Confirm Lemon production store.
- Confirm product/variant IDs match `services/api/src/config/billing.ts`.
- Confirm production webhook URL will be:
  - `https://<production-api-domain>/api/payments/webhook`
- Confirm webhook secret is configured in API hosting provider.
- Confirm expected signature header is `x-signature`.
- Confirm required events:
  - `subscription_created`
  - `subscription_updated`
  - `subscription_cancelled`
  - `subscription_expired`
  - `subscription_payment_success`
- Confirm payment verification must wait until API domain is final.

## 9. CORS and domain dry-run checklist

- Confirm final frontend production origin.
- Confirm final API production origin.
- Confirm API `ALLOWED_ORIGINS` includes final frontend origin(s).
- Confirm local development origin remains separate from production assumptions.
- Confirm checkout redirect does not point to localhost in production.
- Confirm frontend production does not start without `NEXT_PUBLIC_API_URL`.

## 10. Post-deploy smoke checklist

Only after an actual deploy:
- API `/health` returns success.
- Frontend loads from final domain.
- Login/register flow works.
- Authenticated API call works.
- Children page loads.
- Child limit behavior works:
  - FREE: 1
  - INDIVIDUAL: 1
  - FAMILY: 4
  - SCHOOL: Infinity
- Story generation works for eligible user.
- FREE story limit remains 3/month.
- Pricing page starts checkout.
- Checkout returns to `/dashboard?success=true`.
- Lemon signed webhook is accepted.
- Invalid webhook signature returns 401.
- Subscription create/update changes effective `User.plan`.
- Cancelled/expired subscription returns effective `User.plan` to FREE.
- PDF export smoke passes.

## 11. Rollback and pause criteria

Pause deployment or paid launch if:
- API healthcheck fails.
- Frontend cannot call API.
- CORS blocks final frontend domain.
- `NEXT_PUBLIC_API_URL` is missing.
- `FRONTEND_URL` is missing.
- Lemon webhook cannot reach API.
- webhook signature verification fails unexpectedly.
- subscriptions do not update effective `User.plan`.
- story/child plan enforcement does not match expected limits.
- build/test/lint fails locally.

Safe actions:
- Do not continue paid launch.
- Disable/hide paid checkout if needed.
- Keep users on FREE entitlement if webhook confidence is low.
- Do not manually change DB entitlement without recorded reason.
- Do not combine deployment provider changes, payment changes, and schema changes in one phase.

## 12. Evidence to record after real dry-run

Record names only, no secrets:
- commit SHA
- frontend URL
- API URL
- provider used for frontend
- provider used for API
- local validation results
- `/health` result
- Vercel env names confirmed
- API env names confirmed
- Lemon webhook configured yes/no
- event type tested
- observed plan transition
- blocker list
- date/time of test
- operator initials or internal note

## 13. Current status

- This document is a dry-run checklist only.
- No production deploy was performed in this phase.
- No Lemon production verification was completed in this phase.
- No deployment provider switch was performed in this phase.
