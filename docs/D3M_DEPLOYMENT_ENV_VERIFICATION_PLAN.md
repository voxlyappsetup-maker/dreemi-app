# D3M Deployment / Environment Verification Plan

## Status

This is a docs-only verification plan.
No deploy was executed.
No runtime/provider/payment/image/story calls were executed.
No env/secrets were read, printed, or modified.
No production dashboard was accessed in this phase.

## Purpose

- Define how future phases should verify deployment readiness and production environment presence safely.
- Separate planning from execution: this document does not deploy, does not access dashboards, and does not read secrets.
- Provide a conservative protocol for presence-only verification, evidence capture, stop conditions, and rollback requirements.
- Support launch-gate closure for deployment/env-related gates without over-claiming production readiness.

## Current Baseline

- Latest stable commit: `beb0caf Add production launch gate checklist`
- Expected baseline state at plan start: `## main...origin/main` (clean/aligned).
- Full production launch remains **NO-GO**.
- Central launch gate reference: `docs/D3M_PRODUCTION_LAUNCH_GATE_CHECKLIST.md`.

## Source Availability

Required sources requested for this phase:

- Available:
  - `docs/PROJECT_HANDOFF.md`
  - `docs/CURRENT_PROJECT_STATE.md`
  - `docs/NEXT_CHAT_PROMPT.md`
  - `docs/PRODUCTION_READINESS_CHECKLIST.md`
  - `docs/D3M_NON_IMAGE_PRODUCTION_READINESS_TRIAGE.md`
  - `docs/D3M_PRODUCTION_LAUNCH_GATE_CHECKLIST.md`
  - `docs/D3M_IMAGE_RUNTIME_SMOKE_PLAN.md`
  - `docs/D3M_PAYMENT_PROVIDER_EXTERNAL_VERIFICATION_CHECKLIST.md`
  - `docs/D3M_PAYMENT_TRACK_STATE_RECONCILIATION.md`
  - `docs/D3M_PAYMENT_READINESS_UNAVAILABLE_RUNTIME_SMOKE_RESULTS.md`
- Missing:
  - None.

## Explicit Non-Goals

- No deployment.
- No preview deploy.
- No production dashboard action.
- No env editing.
- No secret printing.
- No checkout/payment/webhook call.
- No provider call.
- No image/story generation call.
- No database migration.
- No schema change.
- No CI/GitHub Actions change.

## Deployment Readiness Position

- Deployment/env verification planning: **GO**.
- Presence-only verification phase later: **GO** with strict no-secret rules.
- Actual production deployment: **NO-GO** until launch gates pass.
- Payment/image/provider production claims: **NO-GO** until evidence exists.

## Verification Principles

- Verify presence, not values.
- Use variable names and categories only.
- Never paste secrets into chat, docs, logs, screenshots, or commits.
- Each environment must be identified by name before any verification step.
- Every verification step needs evidence (PASS/BLOCKED/PENDING with redacted notes).
- Any accidental secret exposure is an immediate stop condition.
- Production deploy requires explicit approval and launch-gate review.
- Docs-only phases must not trigger runtime/provider/deploy actions.

## Environment Separation Model

Expected separation:

```text
local
preview/staging if used
production
```

Each environment must have separate configuration for:

- frontend URL
- API URL
- database target
- allowed origins
- provider credentials (AI/story, image, payment)
- payment credentials and webhook secrets
- logging/monitoring configuration

Rules:

- Do not reuse production credentials in local or staging unless explicitly approved and documented.
- Do not point local frontend at production API or database without explicit approval.
- Do not assume staging exists; if unused, mark staging checks as NOT APPLICABLE with evidence.
- Do not invent actual URLs, domains, or credential values in this plan.

## Environment Variable Categories

These categories must be confirmed from existing docs/runtime config in a later no-secret verification phase. Names only; no values.

### Frontend (public / client-safe)

- `NEXT_PUBLIC_API_URL` — frontend API base URL (must not be localhost in production public config unless intentionally blocked)
- `NEXT_PUBLIC_APP_NAME` — app display name if used

### Backend core

- `NODE_ENV` — runtime mode
- `PORT` or `API_PORT` — API listen port
- `FRONTEND_URL` — checkout redirect and frontend reference URL
- `ALLOWED_ORIGINS` — CORS allowed origin list

### Database / Prisma

- `DATABASE_URL` — primary database connection
- `DIRECT_URL` — direct connection for migrations if required by Prisma setup

### Auth / JWT

- `JWT_SECRET` — access token signing secret
- `JWT_REFRESH_SECRET` — refresh token signing secret

### AI / story generation

- `MISTRAL_API_KEY` — primary story generation provider key if enabled in target environment
- `ANTHROPIC_API_KEY` — fallback provider key if configured (may be unused; confirm by presence only)

### Payment / billing (currently blocked for production activation)

- `LEMONSQUEEZY_API_KEY` — legacy/current integration key name in repo
- `LEMONSQUEEZY_STORE_ID` — store identifier
- `LEMONSQUEEZY_WEBHOOK_SECRET` — webhook signature secret
- Future approved-provider variables must be added in a separate approved phase; do not assume names until documented

### Image generation

- Image provider configuration (if any env-gated settings exist in target environment) must be confirmed by category in a later phase; current repo path uses external provider boundary without requiring secret paste in docs

### Optional / legacy / not confirmed for production

- `REDIS_URL` — may be local/legacy; confirm applicability before treating as production-required

### Monitoring / notifications (future)

- Error tracking DSN or monitoring keys — **pending / not confirmed** unless later documented
- Email/notification provider keys — **pending / not confirmed** unless later documented

## What Must Never Be Exposed

- `.env`
- `.env.local`
- production env dashboard values
- database URLs
- JWT secrets
- API keys
- payment keys
- webhook secrets
- user tokens
- provider raw URLs if sensitive
- screenshots showing secrets
- logs with request headers/tokens
- real child data

## Required Deployment Targets To Confirm

Future verification must identify and record (names/targets only, no secrets):

| Target | Current repo documentation | Verification status |
| --- | --- | --- |
| Frontend hosting | Vercel config present (`vercel.json`) | PENDING confirmation in target environment |
| API hosting | Railway-named config present (`services/api/railway.json`) | PENDING confirmation; Render not configured |
| Database target | PostgreSQL / Supabase per project docs | PENDING environment-specific confirmation |
| Domain | Final production domain(s) | PENDING |
| SSL/TLS | HTTPS required for production | PENDING |
| CORS origin list | `ALLOWED_ORIGINS` + documented defaults | PENDING final-domain confirmation |
| Rollback method | Not yet evidenced for launch cut | PENDING |
| Deployment owner/operator | Not yet assigned in docs | PENDING |

Notes:

- Deployment provider finalization (Railway vs Render vs other) remains **pending** unless a later approved document states otherwise.
- Do not choose a new provider in this plan unless already documented and approved.

## Frontend Deployment Verification

Required future evidence (production or approved staging target):

- production build command succeeds (`cd apps/web && next build` per `vercel.json`)
- frontend can reach intended API URL via `NEXT_PUBLIC_API_URL`
- localized routes load (`en`, `ar`, `fr`)
- pricing unavailable/safe state behaves correctly when payment is disabled or provider config incomplete
- generate and story detail pages load without crash
- no local-only API URL (`http://localhost:3001`) in production public config
- no secret-like value exposed in client bundle, browser console, or page source
- install/build commands match deployment config (`pnpm install --frozen-lockfile`)

Status: **PENDING** — no production frontend deploy verification executed in this phase.

## API Deployment Verification

Required future evidence:

- API starts cleanly with production start command (`node dist/index.js` per `services/api/railway.json`)
- health endpoint reachable: `/health`
- auth-protected routes remain protected
- safe error responses (no secret leakage, no stack trace overexposure to clients)
- CORS correct for final frontend domain(s)
- no secret values in startup or request logs
- no crash on startup
- payment status/readiness endpoints remain fail-closed when provider config is incomplete

Status: **PENDING** — no production API deploy verification executed in this phase.

## Database / Prisma Verification

Required future evidence:

- intended database target confirmed by environment name only (local/staging/production)
- migration status understood before any deploy
- Prisma generate/build succeeds in CI/local validation for release candidate
- no destructive migration without explicit approval
- backup/rollback path documented before production schema changes
- `DATABASE_URL` and `DIRECT_URL` presence confirmed without value exposure

Status: **PENDING** — no production database verification executed in this phase.

## CORS / Domain / URL Verification

Requirements for future verification:

- frontend domain must match API `ALLOWED_ORIGINS` configuration
- API URL must match frontend `NEXT_PUBLIC_API_URL`
- `FRONTEND_URL` must match final frontend domain used for checkout redirects when payments are enabled
- no localhost in production public config unless intentionally documented as blocked/fail-fast
- no wildcard origin unless explicitly approved
- HTTPS required for production domains
- documented default origins in repo (for example `https://dreemi.app`, Vercel preview domains) must be reconciled with final production domain list

Status: **PENDING**.

## Auth / JWT / Session Verification

Requirements for future verification:

- JWT/auth secret presence verified without value exposure
- login/register smoke in target environment (later phase)
- protected route smoke in target environment (later phase)
- ownership checks smoke in target environment (later phase)
- no tokens in logs, screenshots, or chat evidence
- session/refresh behavior verified without printing token values

Status: **PENDING**.

## Payments / Billing Environment Verification

Status: **BLOCKED / PENDING**.

Requirements:

- payment provider external approval remains unresolved unless later evidence closes this gate
- checkout must remain unavailable/safe until provider config is complete and an approved provider path exists
- webhook secret presence must be verified by presence only, never by value
- real checkout/webhook/purchase requires explicit later approval
- current unavailable-state behavior (`CHECKOUT_PROVIDER_CONFIG_INCOMPLETE`) is safe but not production billing readiness
- Lemon Squeezy is rejected/unavailable as a production path per current documentation; do not treat Lemon env vars as launch-ready

Forbidden in docs-only phases:

- checkout calls
- webhook replay/live tests
- provider API calls
- printing payment keys or webhook secrets

## Image Provider Environment Verification

Status: **PENDING / DEFERRED**.

Requirements:

- image runtime smoke (`D3M-Triage-C5`) remains deferred
- image provider production readiness is not proven
- image failure must remain non-blocking for story usability
- any provider call requires explicit later approval under `docs/D3M_IMAGE_RUNTIME_SMOKE_PLAN.md`
- do not claim image provider reliability from env presence alone

## Email / Notification Environment Verification

Status: **PENDING / NOT CONFIRMED**.

- No production email/notification system is confirmed in current documentation.
- Do not invent service names or env var names until documented in an approved phase.
- If added later, verify presence only with the same no-secret protocol.

## Logging / Monitoring Environment Verification

Status: **PENDING / BLOCKED for launch**.

Requirements for future verification:

- production logs policy defined (retention, redaction, access control)
- error tracking/monitoring decision documented if adopted
- no sensitive data in logs (tokens, secrets, full prompts with PII, payment payloads)
- payment webhook failure monitoring plan
- image/provider failure visibility plan
- incident owner and escalation path documented

Current baseline: launch-level monitoring evidence is incomplete per `docs/D3M_NON_IMAGE_PRODUCTION_READINESS_TRIAGE.md`.

## Build / Start Command Verification

Future verification must confirm (from repo config, then in target host):

| Component | Documented command / path | Future evidence needed |
| --- | --- | --- |
| Frontend install | `pnpm install --frozen-lockfile` | Host/build log PASS |
| Frontend build | `cd apps/web && next build` | Build PASS in target pipeline |
| Frontend output | `apps/web/.next` | Deploy artifact/path confirmation |
| API start | `node dist/index.js` | Process starts without crash |
| API healthcheck | `/health` | HTTP 200 or documented healthy response |
| API port | `PORT` or host-assigned port | Reachable on intended domain |

Rules:

- no accidental dev-only command in production start path
- no `next dev` or nodemon in production unless explicitly approved and documented
- this phase does not run or modify build/start commands beyond local validation helper scope

## Safe Presence-Only Verification Protocol

Use this protocol in a future approved phase (for example `D3M-Triage-D2-B` presence-only execution after `D3M-Triage-D2-A` inventory). Do not run value-printing commands.

1. Confirm clean working tree (`git status --short --branch`).
2. Confirm target environment name (`local`, `staging`, or `production`).
3. Confirm verification operator and scope in phase notes.
4. Use provider dashboard UI or host CLI **only** to confirm variable **names exist** (checkmark / configured / set — not value).
5. Record PASS/FAIL by variable category, not values.
6. Record deployment target names (host, service, domain) without secrets.
7. Capture redacted evidence: category checklist, route availability without tokens, sanitized screenshots.
8. Do not paste values into docs, chat, commits, or issue comments.
9. Stop immediately if any value is exposed accidentally.
10. End with clean git status and validation helper result.

### Allowed evidence formats

- "Variable category X: present in production dashboard — PASS" (no value)
- "Health endpoint returned success — PASS" (no auth headers logged)
- "CORS preflight from frontend domain — PASS" (no secret headers)

### Forbidden commands / actions

- `cat .env`, `type .env`, `Get-Content .env*`
- printing env vars in terminal (`echo $DATABASE_URL`, `$env:JWT_SECRET`, etc.)
- copying dashboard secret panels into chat
- committing `.env` files or screenshots with visible secrets

## Manual Evidence Requirements

Future verification phases must capture:

- command exit codes (when shell reliability allows)
- route status without tokens
- screenshots without secrets or real user data
- redacted dashboard confirmation notes
- clean git status before/after
- validation helper PASS (`.\tooling\validate_phase.ps1` or `-StrictScope` for docs-only follow-ups)
- manual smoke notes with PASS/BLOCKED/PENDING per check
- launch-gate evidence register entries in `docs/D3M_PRODUCTION_LAUNCH_GATE_CHECKLIST.md`

## Stop Conditions

Stop immediately and mark phase BLOCKED if any of the following occur:

- any secret exposure (terminal, screenshot, log, chat, doc)
- wrong environment target identified (for example production DB from local test)
- production deploy accidentally triggered
- preview deploy triggered without explicit approval
- unexpected repo file changes
- migration prompt or destructive migration attempted
- payment/provider call triggered unintentionally
- logs showing token/secret values
- shell instability preventing reliable exit codes or evidence capture
- accidental `.env` read/copy into evidence

## Rollback Requirements

Before any approved production deploy, document and rehearse:

- deployment rollback path (redeploy previous artifact / revert host release)
- env rollback path (restore previous env var set without printing values in evidence)
- payment disable/kill switch (checkout unavailable / provider config incomplete fail-closed)
- provider disable/fallback path (story/image/payment provider degradation behavior)
- incident owner and escalation contact
- restore previous stable commit if deploy regression occurs
- database rollback constraints (no destructive migration without backup and explicit approval)

Reference: `docs/PRODUCTION_DEPLOYMENT_DRY_RUN_CHECKLIST.md` for dry-run rollback steps when executing a later approved deploy phase.

## Risk Register

| Risk | Area | Severity | Current Status | Mitigation | Evidence Needed |
| --- | --- | --- | --- | --- | --- |
| Wrong env target (local DB/API in prod smoke) | Env separation | Critical | Open | Identify environment name first; block cross-env URLs | Environment target confirmation checklist |
| Leaked secret in chat/logs/screenshot | Secrets | Critical | Open | Presence-only protocol; immediate stop on exposure | Redacted verification audit with zero values |
| Localhost API URL in production frontend | Frontend config | High | Open | Verify `NEXT_PUBLIC_API_URL` in target host; fail-fast guard in `apps/web/src/lib/api.ts` | Production config presence + route smoke |
| CORS misconfiguration | API/Frontend | High | Open | Confirm `ALLOWED_ORIGINS` matches final domain | CORS smoke from frontend domain |
| Payment provider incomplete | Payments | Critical | BLOCKED | Keep checkout fail-closed; no paid launch until approved provider | Provider external verification + controlled smoke |
| Webhook secret missing/wrong | Payments | Critical | BLOCKED | Presence-only verification; no live webhook in docs phases | Webhook secret presence PASS (no value) |
| Database target mismatch | Database | Critical | Open | Confirm env name + host target before migrate/deploy | DB target confirmation (name only) |
| Missing rollback path | Deployment | High | Open | Dry-run rollback rehearsal before prod | Rollback rehearsal evidence |
| No monitoring/incident response | Ops | High | Open | Define minimal monitoring + runbook before launch | Monitoring readiness checklist |
| Image provider instability | Image | Medium | Deferred | Non-blocking fallbacks; optional C5 smoke | C5 smoke results if launch-critical |
| Deployment provider unresolved (Railway vs Render) | Hosting | Medium | Pending | Finalize provider decision in approved phase | Documented hosting target confirmation |

## Recommended Verification Sequence

1. **D2-A** — names-only deployment/env inventory checklist. (complete)
2. **D2-BC** — presence-only env protocol + deployment dry-run checklist. (complete; see `docs/D3M_PRESENCE_ONLY_ENV_AND_DEPLOYMENT_DRY_RUN_PROTOCOL.md`)
3. **D2-D** — deployment readiness execution packet. (complete; see `docs/D3M_DEPLOYMENT_READINESS_EXECUTION_PACKET.md`)
4. **D3** — no-secret deployment readiness evidence pass.
3. **D2-C** — deployment dry-run checklist (`docs/PRODUCTION_DEPLOYMENT_DRY_RUN_CHECKLIST.md`).
4. **D2-D** — local/staging smoke pack (controlled, no secrets).
5. Payment provider external approval/response package (`D3M-Payments-External-Verification`).
6. Final launch gate review (`docs/D3M_PRODUCTION_LAUNCH_GATE_CHECKLIST.md` Gate 18).

Actual production deploy remains separate, blocked, and requires explicit approval plus critical gate PASS evidence.

## Recommended Next Phase

- Primary: `D3M-Triage-D3 — No-secret deployment readiness evidence pass`
- Alternative: `D3M-Payments-Provider-Response — KYB/provider approval package`

Execution packet (complete): `docs/D3M_DEPLOYMENT_READINESS_EXECUTION_PACKET.md`
Protocol/checklist bridge (complete): `docs/D3M_PRESENCE_ONLY_ENV_AND_DEPLOYMENT_DRY_RUN_PROTOCOL.md`
Inventory artifact (complete): `docs/D3M_DEPLOYMENT_ENV_INVENTORY_CHECKLIST.md`

## Notes For Next Chat

- This plan is documentation-only; do not treat it as evidence that production env or deploy readiness is PASS.
- Use variable categories and presence-only checks in D3; never paste secret values.
- Execution packet: `docs/D3M_DEPLOYMENT_READINESS_EXECUTION_PACKET.md`.
- Protocol/checklist: `docs/D3M_PRESENCE_ONLY_ENV_AND_DEPLOYMENT_DRY_RUN_PROTOCOL.md`.
- Inventory checklist: `docs/D3M_DEPLOYMENT_ENV_INVENTORY_CHECKLIST.md`.
- Update launch gate statuses only when explicit redacted evidence exists.
- Full production launch remains **NO-GO** until Gates 3, 4, 9, 10, 15, 16, and 18 (and other critical gates) are closed with evidence.
