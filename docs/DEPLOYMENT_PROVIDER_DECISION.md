# Deployment Provider Decision

## 1. Purpose

- Document current deployment provider state for Dreemi/Qisas.
- Prevent accidental deployment config changes.
- Clarify what is active in the repository versus what remains a future option.
- This document does not prove production deploy has happened.

## 2. Current Repository Deployment State

- Frontend:
  - current config file: `vercel.json`
  - provider implied by config: Vercel
  - build command: `cd apps/web && next build`
  - output directory: `apps/web/.next`
  - install command: `pnpm install --frozen-lockfile`
- API:
  - current config file: `services/api/railway.json`
  - provider implied by config name: Railway
  - builder: `NIXPACKS`
  - build command: `pnpm install && pnpm run build`
  - start command: `node dist/index.js`
  - healthcheck path: `/health`

## 3. Decision State

- Current repository truth: Vercel is the configured frontend deployment path, and Railway-named config is the configured API deployment path.
- Render is not currently configured in the repository.
- Render remains a possible future API hosting target, but adopting Render requires an explicit future phase.
- Do not add or modify deployment provider config without explicit approval.

## 4. Why No Config Change In This Phase

- This phase is documentation-only.
- Adding Render config without a provider decision could create ambiguity.
- Renaming/removing Railway config could break existing assumptions.
- Production env values must be configured outside chat and must not be committed.

## 5. Future Render Adoption Criteria

Before adding Render config, require:
- confirmed API production domain
- confirmed build command
- confirmed start command
- confirmed healthcheck path
- confirmed environment variable names, no values
- confirmed database connection setup
- confirmed `FRONTEND_URL`
- confirmed `ALLOWED_ORIGINS`
- confirmed Lemon webhook URL
- local validation:
  - `pnpm test`
  - `pnpm lint`
  - `pnpm build`
- explicit approval to add or modify deployment config

## 6. Future Railway Adoption Criteria

Before treating Railway as production source of truth, require:
- confirmed Railway project/service ownership
- confirmed production domain
- confirmed environment variable names, no values
- confirmed `/health` works
- confirmed Vercel frontend points to Railway API URL
- confirmed Lemon webhook points to Railway API URL
- explicit production smoke evidence

## 7. Production Readiness Linkage

References:
- `docs/PRODUCTION_READINESS_CHECKLIST.md`
- `docs/LEMONSQUEEZY_PRODUCTION_VERIFICATION_PLAN.md`

State:
- Payment production verification must wait until API hosting target and API domain are confirmed.
- Lemon webhook URL depends on the final API production domain.

## 8. Current Status

- No production deployment provider switch was performed.
- No deployment config was changed.
- Render vs Railway remains an explicit future operational decision unless the user approves one provider in a later phase.
