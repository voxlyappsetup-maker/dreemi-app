# D3M Deployment / Environment Inventory Checklist

## Status

This is a docs-only inventory checklist.
No deployment was executed.
No production dashboard was accessed.
No runtime/provider/payment/image/story calls were executed.
No env/secrets were read, printed, or modified.
No `.env` or `.env.example` file was read or modified.

## Purpose

- Inventory deployment targets and environment variable **names/categories** that require future presence-only verification.
- Separate inventory from verification: this document does not confirm that any target or variable is configured in any environment.
- Provide source references, unknowns, and evidence templates for `D3M-Triage-D2-B` and later phases.
- Support launch-gate closure for Gates 3 and 4 without exposing secrets or claiming production readiness.

## Current Baseline

- Latest stable commit: `5c0d30d Add deployment environment verification plan`
- Expected baseline state at inventory start: `## main...origin/main` (clean/aligned).
- Full production launch remains **NO-GO**.
- Verification plan reference: `docs/D3M_DEPLOYMENT_ENV_VERIFICATION_PLAN.md`.
- Launch gate reference: `docs/D3M_PRODUCTION_LAUNCH_GATE_CHECKLIST.md`.

## Source Availability

Required sources requested for this phase:

- Available:
  - `docs/PROJECT_HANDOFF.md`
  - `docs/CURRENT_PROJECT_STATE.md`
  - `docs/NEXT_CHAT_PROMPT.md`
  - `docs/PRODUCTION_READINESS_CHECKLIST.md`
  - `docs/D3M_PRODUCTION_LAUNCH_GATE_CHECKLIST.md`
  - `docs/D3M_DEPLOYMENT_ENV_VERIFICATION_PLAN.md`
  - `docs/D3M_NON_IMAGE_PRODUCTION_READINESS_TRIAGE.md`
  - `docs/D3M_PAYMENT_PROVIDER_EXTERNAL_VERIFICATION_CHECKLIST.md`
  - `docs/D3M_PAYMENT_TRACK_STATE_RECONCILIATION.md`
  - `docs/D3M_PAYMENT_READINESS_UNAVAILABLE_RUNTIME_SMOKE_RESULTS.md`
  - `docs/D3M_IMAGE_RUNTIME_SMOKE_PLAN.md`
- Missing:
  - None.

Safe read-only source references used for variable **names** only (no values):

- `apps/web/src/lib/api.ts`
- `apps/web/src/app/[locale]/pricing/page.tsx`
- `services/api/src/index.ts`
- `services/api/src/routes/payments.ts`
- `services/api/src/config/billing.ts`
- `services/api/src/services/mistral.service.ts`
- `services/api/src/services/lemonsqueezy.service.ts`
- `services/api/src/services/jwt.service.ts`
- `services/api/src/middleware/auth.middleware.ts`
- `vercel.json`
- `services/api/railway.json`

## Explicit Non-Goals

- No production deploy.
- No preview deploy.
- No production dashboard action.
- No env file reading.
- No env editing.
- No secret printing.
- No checkout/payment/webhook call.
- No provider call.
- No image/story generation call.
- No database migration.
- No schema change.
- No CI/GitHub Actions change.
- No claim that any environment variable is actually configured in any environment.

## Inventory Principles

- Inventory names/categories only.
- Do not verify presence in this phase.
- Do not include values.
- Do not infer values.
- Source each item from docs or safe source references where possible.
- Mark unknowns explicitly.
- Future verification must be presence-only and no-secret per `docs/D3M_DEPLOYMENT_ENV_VERIFICATION_PLAN.md`.
- Any accidental value exposure in a future phase is an immediate stop condition.
- Status in this document reflects **inventory completeness**, not environment readiness.

## What Must Never Be Inventoried By Value

- database URLs
- direct database URLs
- JWT/auth secrets
- API keys
- payment provider keys
- webhook signing secrets
- provider tokens
- user tokens
- private frontend/backend config values
- screenshots of secret dashboards
- real child data
- raw logs with headers/tokens

## Inventory Status Legend

| Status | Meaning |
| --- | --- |
| `KNOWN_NAME` | Variable/target name is known from docs or source. |
| `CATEGORY_ONLY` | Category is known; exact variable name must be confirmed later. |
| `UNKNOWN` | Item is not identified yet. |
| `PENDING_PRESENCE_CHECK` | Name/category known; real environment presence not yet verified. |
| `BLOCKED` | Cannot proceed without external decision/evidence. |
| `NOT_APPLICABLE_FOR_NOW` | Not used in current documented scope. |

## Deployment Target Inventory

| Item | Current Known Name / Category | Status | Source | Future Presence Evidence Needed | Notes |
| --- | --- | --- | --- | --- | --- |
| Frontend hosting target | Vercel (config: `vercel.json`) | `PENDING_PRESENCE_CHECK` | `vercel.json`, `docs/PRODUCTION_READINESS_CHECKLIST.md` | Confirm production frontend service/project exists in target environment | Final production project name not confirmed in this inventory |
| API hosting target | Railway-named config (`services/api/railway.json`) | `PENDING_PRESENCE_CHECK` | `services/api/railway.json`, `docs/DEPLOYMENT_PROVIDER_DECISION.md` | Confirm API service exists on intended host | Railway vs Render final decision remains pending |
| Database target | PostgreSQL (Supabase per project docs) | `CATEGORY_ONLY` | `docs/PROJECT_HANDOFF.md`, `docs/PRODUCTION_READINESS_CHECKLIST.md` | Confirm production DB instance identity by environment name only | No connection in this phase |
| Production domain | Final public domain(s) | `UNKNOWN` | `docs/D3M_DEPLOYMENT_ENV_VERIFICATION_PLAN.md` | Confirm final domain list without secret values | Documented defaults include `dreemi.app` in CORS code; final cut not confirmed |
| Frontend URL | Public web app URL category | `PENDING_PRESENCE_CHECK` | `FRONTEND_URL` usage in `services/api/src/routes/payments.ts` | Confirm production frontend URL matches checkout/CORS expectations | Required for checkout redirect when payments enabled |
| API URL | Public API base URL category | `PENDING_PRESENCE_CHECK` | `NEXT_PUBLIC_API_URL` in `apps/web/src/lib/api.ts` | Confirm frontend points to production API URL | Production fail-fast if missing |
| HTTPS/TLS | TLS required for production | `CATEGORY_ONLY` | `docs/D3M_DEPLOYMENT_ENV_VERIFICATION_PLAN.md` | Confirm HTTPS on frontend and API domains | No cert values |
| Rollback method | Deployment rollback path | `UNKNOWN` | `docs/PRODUCTION_DEPLOYMENT_DRY_RUN_CHECKLIST.md` | Document and rehearse rollback without secrets | Not evidenced for launch cut |
| Deployment owner/operator | Human owner for deploy/incident | `UNKNOWN` | `docs/D3M_NON_IMAGE_PRODUCTION_READINESS_TRIAGE.md` | Assign owner before deploy phase | Not assigned in docs |
| Staging/preview environment | Optional preview/staging target | `NOT_APPLICABLE_FOR_NOW` | `docs/D3M_DEPLOYMENT_ENV_VERIFICATION_PLAN.md` | Confirm whether staging exists; if not, mark N/A with evidence | Vercel preview policy not finalized in inventory |

## Frontend Environment Inventory

| Item | Expected Name / Category | Status | Source | Future Presence Evidence | Notes |
| --- | --- | --- | --- | --- | --- |
| Public API URL | `NEXT_PUBLIC_API_URL` | `KNOWN_NAME` | `apps/web/src/lib/api.ts` | Dashboard presence check only | Must not be localhost in production |
| App display name | `NEXT_PUBLIC_APP_NAME` | `KNOWN_NAME` | `docs/PRODUCTION_READINESS_CHECKLIST.md` | Dashboard presence check only | Optional branding; confirm if used |
| Runtime mode | `NODE_ENV` (build/runtime context) | `KNOWN_NAME` | `apps/web/src/lib/api.ts` | Confirm production build context | Used for production guard behavior |
| Locale routing | `/en`, `/ar`, `/fr` route prefixes | `KNOWN_NAME` | App Router structure, smoke docs | Route load smoke later | No execution in this phase |
| Payment availability display | Depends on `/api/payments/status` response | `PENDING_PRESENCE_CHECK` | `apps/web/src/app/[locale]/pricing/page.tsx` | Pricing unavailable UX smoke later | Safe unavailable state documented |
| Client secret exposure check | No secrets in client bundle | `CATEGORY_ONLY` | `docs/D3M_DEPLOYMENT_ENV_VERIFICATION_PLAN.md` | Bundle/page-source review in target env | No client payment keys expected |

## API Environment Inventory

| Item | Expected Name / Category | Status | Source | Future Presence Evidence | Notes |
| --- | --- | --- | --- | --- | --- |
| Listen port | `PORT` or `API_PORT` | `KNOWN_NAME` | `services/api/src/index.ts` | Host port mapping confirmation | Default fallback `3001` in code |
| Runtime mode | `NODE_ENV` | `KNOWN_NAME` | Multiple API files | Production value presence check | Affects guards and logging |
| Allowed origins | `ALLOWED_ORIGINS` | `KNOWN_NAME` | `services/api/src/index.ts` | Presence + CORS smoke from frontend domain | Code defaults exist if unset |
| Frontend URL | `FRONTEND_URL` | `KNOWN_NAME` | `services/api/src/routes/payments.ts` | Presence check; checkout redirect smoke later | Fail-closed in production if missing |
| JWT access secret | `JWT_SECRET` | `KNOWN_NAME` | `services/api/src/services/jwt.service.ts`, `auth.middleware.ts` | Presence only | Never print value |
| JWT refresh secret | `JWT_REFRESH_SECRET` | `KNOWN_NAME` | `services/api/src/services/jwt.service.ts` | Presence only | Never print value |
| Database connection | `DATABASE_URL` | `KNOWN_NAME` | `docs/PRODUCTION_READINESS_CHECKLIST.md` | Presence only | Prisma runtime dependency |
| Direct DB connection | `DIRECT_URL` | `KNOWN_NAME` | `docs/PRODUCTION_READINESS_CHECKLIST.md` | Presence only | Migration/direct connection category |
| Story provider key | `MISTRAL_API_KEY` | `KNOWN_NAME` | `services/api/src/services/mistral.service.ts` | Presence only | Required if story generation enabled |
| Fallback story provider key | `ANTHROPIC_API_KEY` | `KNOWN_NAME` | `docs/PRODUCTION_READINESS_CHECKLIST.md` | Confirm applicability/presence | May be unused; not confirmed active |
| Payment active provider | `PAYMENT_ACTIVE_PROVIDER` | `KNOWN_NAME` | `services/api/src/config/billing.ts` | Presence only | Defaults to `LEMONSQUEEZY` in code if unset |
| Payment API key | `LEMONSQUEEZY_API_KEY` | `KNOWN_NAME` | `services/api/src/config/billing.ts`, `lemonsqueezy.service.ts` | Presence only | Legacy/current integration; production blocked |
| Payment store ID | `LEMONSQUEEZY_STORE_ID` | `KNOWN_NAME` | `services/api/src/config/billing.ts`, `lemonsqueezy.service.ts` | Presence only | Checkout completeness gate |
| Webhook secret | `LEMONSQUEEZY_WEBHOOK_SECRET` | `KNOWN_NAME` | `services/api/src/services/lemonsqueezy.service.ts` | Presence only | No live webhook test in inventory phase |
| Cache/queue (optional) | `REDIS_URL` | `KNOWN_NAME` | `docs/PRODUCTION_READINESS_CHECKLIST.md` | Confirm if used in target env | Marked potentially legacy/unused |
| Health endpoint | `/health` | `KNOWN_NAME` | `services/api/railway.json` | HTTP availability smoke later | Deploy healthcheck path |

## Database / Prisma Environment Inventory

| Item | Expected Name / Category | Status | Source | Future Presence Evidence | Notes |
| --- | --- | --- | --- | --- | --- |
| Primary connection | `DATABASE_URL` | `KNOWN_NAME` | Docs + Prisma usage | Presence only | No connection test in this phase |
| Direct connection | `DIRECT_URL` | `KNOWN_NAME` | Docs | Presence only | Confirm required for migrations in target host |
| Migration status | Prisma migration state category | `CATEGORY_ONLY` | `docs/D3M_DEPLOYMENT_ENV_VERIFICATION_PLAN.md` | Migration status review before deploy | No migration execution here |
| Production DB target identity | Environment name + host target category | `UNKNOWN` | Deployment docs | Confirm by environment label only | No DB URL values |
| Backup/rollback | Database backup category | `UNKNOWN` | `docs/D3M_DEPLOYMENT_ENV_VERIFICATION_PLAN.md` | Backup path documented before prod schema changes | Required before destructive migration |

## Auth / JWT Environment Inventory

| Item | Expected Name / Category | Status | Source | Future Presence Evidence | Notes |
| --- | --- | --- | --- | --- | --- |
| Access token secret | `JWT_SECRET` | `KNOWN_NAME` | JWT service + auth middleware | Presence only | Startup/auth dependency |
| Refresh token secret | `JWT_REFRESH_SECRET` | `KNOWN_NAME` | JWT service | Presence only | Session refresh dependency |
| Login/register smoke | Auth flow smoke category | `PENDING_PRESENCE_CHECK` | Launch gate / smoke docs | Manual auth smoke in target env | No token values in evidence |
| Protected route smoke | Story/children/payment protected routes | `PENDING_PRESENCE_CHECK` | Route guard docs/tests | Manual smoke with test account | Ownership checks pending |
| Token logging prohibition | No tokens in logs/screenshots | `CATEGORY_ONLY` | Global rules | Log review during smoke | Stop if violated |

## CORS / Domain / URL Inventory

| Item | Expected Name / Category | Status | Source | Future Presence Evidence | Notes |
| --- | --- | --- | --- | --- | --- |
| Allowed origins list | `ALLOWED_ORIGINS` | `KNOWN_NAME` | `services/api/src/index.ts` | Presence + CORS preflight smoke | Code defaults include documented domains |
| Default origin candidates | `localhost:3000`, `dreemi.app`, `www.dreemi.app`, Vercel preview domain | `KNOWN_NAME` | `services/api/src/index.ts` | Reconcile with final production domain list | Defaults are not proof of production config |
| Frontend domain category | Public web domain | `UNKNOWN` | Deployment docs | Confirm final domain without values | Must match CORS and `FRONTEND_URL` |
| API domain category | Public API domain | `UNKNOWN` | Deployment docs | Confirm API URL reachable over HTTPS | Must match `NEXT_PUBLIC_API_URL` |
| HTTPS requirement | TLS on public endpoints | `CATEGORY_ONLY` | Verification plan | Certificate/host HTTPS check | No cert values |
| No localhost in production public config | Production guard category | `KNOWN_NAME` | `apps/web/src/lib/api.ts`, `payments.ts` | Config + smoke review | Intentional fail-fast/block behavior |
| Wildcard origin policy | No wildcard unless approved | `CATEGORY_ONLY` | Verification plan | CORS config review | Not approved in current inventory |

## Payments / Billing Environment Inventory

| Item | Expected Name / Category | Status | Source | Future Presence Evidence | Notes |
| --- | --- | --- | --- | --- | --- |
| Active provider selection | `PAYMENT_ACTIVE_PROVIDER` | `KNOWN_NAME` | `services/api/src/config/billing.ts` | Presence only | Code default `LEMONSQUEEZY` if unset |
| Provider runtime enablement | Billing runtime state category | `PENDING_PRESENCE_CHECK` | `billing.ts`, reconciliation docs | Status endpoint semantics smoke | Not production-approved |
| Provider API key | `LEMONSQUEEZY_API_KEY` | `KNOWN_NAME` | `billing.ts`, `lemonsqueezy.service.ts` | Presence only | Lemon rejected for production launch |
| Store ID | `LEMONSQUEEZY_STORE_ID` | `KNOWN_NAME` | `billing.ts`, `lemonsqueezy.service.ts` | Presence only | Missing store ID blocks checkout completeness |
| Variant/product IDs | Lemon variant catalog IDs (code constants) | `KNOWN_NAME` | `services/api/src/config/billing.ts` | Confirm catalog alignment later | IDs in code, not env; provider approval still blocked |
| Checkout config completeness | `checkoutProviderConfigComplete` semantics | `PENDING_PRESENCE_CHECK` | Payment smoke results docs | No-purchase status smoke | Safe unavailable state verified locally only |
| Provider external approval | Approved payment provider path | `BLOCKED` | External verification checklist | Provider/KYB/legal evidence | No real checkout until approved |
| Real checkout verification | Checkout purchase path | `BLOCKED` | Launch gates | Controlled checkout smoke with approval | Explicit later phase only |
| Frontend pricing unavailable dependency | Pricing page status mapping | `PENDING_PRESENCE_CHECK` | `pricing/page.tsx`, smoke results | EN/AR/FR unavailable UX smoke | Does not prove billing readiness |

## Webhook Environment Inventory

| Item | Expected Name / Category | Status | Source | Future Presence Evidence | Notes |
| --- | --- | --- | --- | --- | --- |
| Webhook signing secret | `LEMONSQUEEZY_WEBHOOK_SECRET` | `KNOWN_NAME` | `lemonsqueezy.service.ts` | Presence only | Never print value |
| Webhook endpoint path | `POST /api/payments/webhook` | `KNOWN_NAME` | `services/api/src/routes/payments.ts` | Provider dashboard endpoint config later | No live webhook test here |
| Raw body / signature verification | Webhook parser + verify guard category | `KNOWN_NAME` | Payments route + security regression tests | Static/test evidence exists; runtime webhook pending | Signature verify required before handling |
| Provider dashboard endpoint URL | Production webhook URL category | `UNKNOWN` | `docs/PRODUCTION_READINESS_CHECKLIST.md` | Confirm endpoint registered without secret paste | Format: `https://<production-api-domain>/api/payments/webhook` |
| Live webhook verification | End-to-end webhook lifecycle | `BLOCKED` | Launch gates | Approved provider controlled test later | Blocked until provider approval |

## Story / AI Provider Environment Inventory

| Item | Expected Name / Category | Status | Source | Future Presence Evidence | Notes |
| --- | --- | --- | --- | --- | --- |
| Primary story provider key | `MISTRAL_API_KEY` | `KNOWN_NAME` | `services/api/src/services/mistral.service.ts` | Presence only | Required for story generation path |
| Fallback provider key | `ANTHROPIC_API_KEY` | `KNOWN_NAME` | Docs | Confirm if configured/used | Optional/legacy per docs |
| Model/provider config | Provider model selection category | `CATEGORY_ONLY` | Mistral service code | Confirm config category in target env | No runtime story call here |
| Safety gates | Input/output safety enforcement | `KNOWN_NAME` | `safety.service.ts`, regression tests | Runtime safety smoke later | Code/test guarded; runtime readiness pending |
| Story generation runtime smoke | Generate flow verification | `PENDING_PRESENCE_CHECK` | Manual smoke docs | Controlled generate smoke with test account | No real child data |

## Image Provider Environment Inventory

| Item | Expected Name / Category | Status | Source | Future Presence Evidence | Notes |
| --- | --- | --- | --- | --- | --- |
| Image provider boundary | External provider via image service (Pollinations boundary) | `KNOWN_NAME` | Image triage/smoke plan docs | C5 runtime smoke if launch-critical | No env var name confirmed in image service scan |
| Image provider env config | Image provider configuration category | `CATEGORY_ONLY` | Image service architecture | Confirm if any env-gated settings exist | No Pollinations calls in this phase |
| Image runtime smoke | Controlled image path verification | `PENDING_PRESENCE_CHECK` | `docs/D3M_IMAGE_RUNTIME_SMOKE_PLAN.md` | C5 execution when approved | Currently deferred |
| Non-blocking failure behavior | Story usable without image | `KNOWN_NAME` | Stories route + fallback docs/tests | Fallback smoke on generate/story/card/PDF | Production provider readiness not proven |

## Email / Notification Environment Inventory

| Item | Expected Name / Category | Status | Source | Future Presence Evidence | Notes |
| --- | --- | --- | --- | --- | --- |
| Email provider | Email/notification provider category | `UNKNOWN` | Project docs scan | Confirm if any provider adopted later | No email system documented as production-ready |
| Notification API keys | Notification secret category | `NOT_APPLICABLE_FOR_NOW` | N/A | Add when documented in approved phase | Do not invent service names |

## Logging / Monitoring Environment Inventory

| Item | Expected Name / Category | Status | Source | Future Presence Evidence | Notes |
| --- | --- | --- | --- | --- | --- |
| Error monitoring | Error tracking DSN/service category | `UNKNOWN` | Non-image triage docs | Select and document provider later | No monitoring stack confirmed |
| Log retention/redaction policy | Production logs policy category | `UNKNOWN` | Verification plan | Document policy before launch | No sensitive data in logs |
| Provider failure monitoring | AI/image/payment provider failure visibility | `PENDING_PRESENCE_CHECK` | Ops readiness docs | Define alerts/runbook | Not evidenced |
| Payment webhook monitoring | Webhook failure alert category | `BLOCKED` | Payment verification docs | Define after provider approval | Depends on approved provider path |
| Incident alerting | On-call/escalation category | `UNKNOWN` | Launch gate Gate 15 | Assign incident owner + alert path | Required before launch |

## Build / Start Command Inventory

| Item | Expected Name / Category | Status | Source | Future Presence Evidence | Notes |
| --- | --- | --- | --- | --- | --- |
| Frontend install command | `pnpm install --frozen-lockfile` | `KNOWN_NAME` | `vercel.json` | Host build log PASS | Do not change in this phase |
| Frontend build command | `cd apps/web && next build` | `KNOWN_NAME` | `vercel.json` | Build PASS in target pipeline | |
| Frontend output directory | `apps/web/.next` | `KNOWN_NAME` | `vercel.json` | Deploy artifact path confirmation | |
| API build command | `pnpm install && pnpm run build` (host config) | `KNOWN_NAME` | `services/api/railway.json` | Build PASS on API host | Exact monorepo build may need host confirmation |
| API start command | `node dist/index.js` | `KNOWN_NAME` | `services/api/railway.json` | Process starts without crash | Production start path |
| Healthcheck path | `/health` | `KNOWN_NAME` | `services/api/railway.json` | Health endpoint smoke | |
| Port handling | `PORT` / host-assigned port | `KNOWN_NAME` | `services/api/src/index.ts` | Reachability on intended domain | |
| Dev vs prod command separation | No dev server in production | `CATEGORY_ONLY` | Verification plan | Host start command review | Block `next dev`/nodemon in prod |

## Route / Smoke Target Inventory

Future smoke targets (categories only — no execution in this phase):

| Surface | Route / Target | Status | Future Evidence Type | Notes |
| --- | --- | --- | --- | --- |
| Frontend locale home | `/en`, `/ar`, `/fr` | `PENDING_PRESENCE_CHECK` | Route load smoke | Localization sanity |
| Pricing page | `/{locale}/pricing` | `PENDING_PRESENCE_CHECK` | UI smoke + unavailable state | Payment blocked path must stay safe |
| Generate page | `/{locale}/generate` | `PENDING_PRESENCE_CHECK` | Flow smoke with test account | No real child data |
| Story detail | `/{locale}/story/[id]` | `PENDING_PRESENCE_CHECK` | Protected route smoke | Ownership required |
| Auth login | `/{locale}/login` | `PENDING_PRESENCE_CHECK` | Auth smoke | No token capture in evidence |
| Auth register | `/{locale}/register` | `PENDING_PRESENCE_CHECK` | Auth smoke | Test account only |
| Children limits | `/{locale}/children` | `PENDING_PRESENCE_CHECK` | Limit behavior smoke | Plan enforcement surface |
| API health | `GET /health` | `PENDING_PRESENCE_CHECK` | HTTP status smoke | Deploy health gate |
| API payment status | `GET /api/payments/status` | `PENDING_PRESENCE_CHECK` | No-purchase status smoke | Fail-closed semantics |
| API checkout | `POST /api/payments/checkout` | `BLOCKED` | Controlled checkout smoke later | Requires explicit approval |
| API webhook | `POST /api/payments/webhook` | `BLOCKED` | Controlled webhook smoke later | Requires explicit approval |
| Protected story API | Story routes under auth | `PENDING_PRESENCE_CHECK` | Auth + ownership smoke | Static regressions exist |
| PDF export | Generate/story detail export path | `PENDING_PRESENCE_CHECK` | Manual PDF smoke EN/AR/FR | See PDF regression checklist |
| Image fallback surfaces | Generate, story detail, StoryCard, PDF | `PENDING_PRESENCE_CHECK` | Fallback UI/PDF smoke | C2/C3 static coverage exists |

## Known Unknowns

- Final production frontend host/project identity.
- Final production API host/service identity (Railway vs Render vs other).
- Final production public domain(s) and DNS/TLS ownership.
- Production environment variable **presence** for all inventoried names (none verified in this phase).
- Payment provider external approval and legal payout path closure.
- Real checkout/webhook verification path for an approved provider.
- Production monitoring/alerting stack and incident owner.
- Deployment rollback owner/process evidence.
- Image runtime provider behavior under production conditions (C5 deferred).
- Email/notification provider (if any) — not documented as ready.
- Staging/preview environment policy and whether it will be used for verification.
- Whether `ANTHROPIC_API_KEY` and `REDIS_URL` are required in production target.

## Blockers Before Presence Verification

- Target environment must be clearly named (`local`, `staging`, or `production`).
- Operator must agree to no-secret procedure from `docs/D3M_DEPLOYMENT_ENV_VERIFICATION_PLAN.md`.
- No screenshots with secret values.
- No env values pasted into chat/docs.
- Working tree must be clean at phase start/end.
- Validation helper must PASS when shell reliability allows.
- This inventory document must be reviewed and accepted before D2-B execution.
- Payment provider approval remains blocked for production billing claims.
- API hosting target finalization remains pending if Railway vs Render is unresolved.

## Evidence Template For Future Presence-Only Verification

| Inventory Item | Expected Name / Category | Environment | Presence Status | Evidence Type | Verifier | Date | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `<item>` | `<name/category>` | `<local/staging/production>` | `<PASS/FAIL/PENDING>` | `<redacted dashboard note / route smoke / checklist>` | `<owner>` | `<YYYY-MM-DD>` | `<no values>` |

Do not fill with invented results in this inventory phase.

## Stop Conditions For Future Verification

- Any secret value becomes visible (terminal, screenshot, log, chat, doc).
- Wrong environment selected (for example production DB from local test).
- Dashboard screenshot exposes secret values.
- CLI command would print env values.
- Shell instability prevents reliable exit codes or evidence capture.
- Repository changes unexpectedly during verification.
- Deployment, provider, or payment call is triggered unintentionally.
- Migration prompt or destructive migration appears.
- Logs expose tokens, webhook secrets, or child data.

## Recommended Next Phase

- Primary: `D3M-Triage-D4 — Production smoke and launch evidence pack`
- Alternative: `D3M-Payments-Provider-Response — KYB/provider approval package`

Evidence pass (complete): `docs/D3M_NO_SECRET_DEPLOYMENT_READINESS_EVIDENCE_PASS.md`
Execution packet: `docs/D3M_DEPLOYMENT_READINESS_EXECUTION_PACKET.md`
Follow-up protocol/checklist: `docs/D3M_PRESENCE_ONLY_ENV_AND_DEPLOYMENT_DRY_RUN_PROTOCOL.md`

## Notes For Next Chat

- D3 evidence pass recorded at `docs/D3M_NO_SECRET_DEPLOYMENT_READINESS_EVIDENCE_PASS.md`; use inventory for D4 execution prep.
- Never paste secret values; record PASS/FAIL by category/name only.
- Full production launch remains **NO-GO** until launch gates pass with explicit evidence.
- Do not mark Gates 3 or 4 PASS from inventory completeness alone.
