# D3M Presence-Only Environment And Deployment Dry-Run Protocol

## Status

This is a docs-only protocol/checklist phase.
No deployment was executed.
No real environment verification was executed.
No production dashboard was accessed.
No runtime/provider/payment/image/story calls were executed.
No env/secrets were read, printed, or modified.
No `.env` or `.env.example` file was read or modified.

## Purpose

- Combine presence-only environment verification protocol (D2-B) and deployment dry-run checklist (D2-C) into one artifact.
- Define safe evidence rules, stop conditions, rollback gates, and compact Cursor reporting for future execution phases.
- Bridge inventory (`docs/D3M_DEPLOYMENT_ENV_INVENTORY_CHECKLIST.md`) to future execution without verifying real environment values in this phase.

## Current Baseline

- Latest stable commit: `3ab2a9f Add deployment environment inventory checklist`
- Expected baseline: `## main...origin/main` (clean/aligned).
- Full production launch remains **NO-GO**.

## Source Availability

- Available: all requested docs including inventory, verification plan, launch gate checklist, payment/image triage docs.
- Missing: none.

Planning inputs (not evidence of configuration):

- `docs/D3M_DEPLOYMENT_ENV_INVENTORY_CHECKLIST.md`
- `docs/D3M_DEPLOYMENT_ENV_VERIFICATION_PLAN.md`
- `docs/D3M_PRODUCTION_LAUNCH_GATE_CHECKLIST.md`
- `docs/PRODUCTION_DEPLOYMENT_DRY_RUN_CHECKLIST.md` (existing dry-run reference)

Safe read-only config references: `vercel.json`, `services/api/railway.json`.

## Explicit Non-Goals

- No production deploy.
- No preview deploy.
- No dashboard access.
- No real env verification.
- No env file reading.
- No env editing.
- No secret printing.
- No payment checkout.
- No webhook live test.
- No provider call.
- No image/story generation call.
- No database migration.
- No schema change.
- No CI/GitHub Actions change.

## Protocol Principles

- Verify names/categories before values.
- Presence-only means PASS/FAIL for whether a variable **exists**, not what its value is.
- Never paste values into docs/chat/logs/screenshots.
- Every future evidence item must be redacted by design.
- No gate becomes PASS without evidence.
- Any secret exposure immediately stops the phase.
- Production deploy requires explicit user approval in a later phase.

## Compact Handoff Policy

Cursor final reports must be concise.

- Do not paste full test logs unless there is a failure requiring diagnosis.
- Do not paste long repeated validation output.
- Only report exit codes, changed files, commit hash, push status, blockers, and next phase.
- Use a compact summary table or short bullet list.
- If logs are needed, include only the failing command and the minimal relevant excerpt.
- Never paste secrets, env values, dashboard screenshots, tokens, or raw provider payloads.

Preferred final report length: under 80 lines.
Maximum normal report length: under 120 lines.

- If validation passes, summarize only exit codes and final result.
- If validation fails, paste only the failing section.

## Phase Report Size Limits

Reusable compact format for all future Cursor phase reports:

```text
Phase:
Result:
Files changed:
Validation:
- diff:
- strict/full validation:
Commit:
Push:
Final status:
Next:
```

Future Cursor reports should **not** include full successful `pnpm test`, `pnpm build`, or `validate_phase.ps1` logs.

Extended format when commit/push occurs:

```text
Phase:
Result:
Commit hash:
Push status:
Files changed:
Summary:
Validation:
- diff check exit code:
- strict validation helper exit code:
Commit exit code:
Push exit code:
Final git status:
Final git log -8:
Next:
```

## Presence-Only Verification Scope

Conservative scope from inventory (all **PENDING** — not verified in this phase):

| Scope area | Categories covered |
| --- | --- |
| Deployment targets | Frontend host, API host, DB target, domain, rollback owner |
| Frontend public config | `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_APP_NAME`, locale routes |
| API config | `PORT`, `API_PORT`, `NODE_ENV`, `ALLOWED_ORIGINS`, `FRONTEND_URL` |
| Database | `DATABASE_URL`, `DIRECT_URL`, migration status category |
| Auth/JWT | `JWT_SECRET`, `JWT_REFRESH_SECRET` |
| CORS/domain | Allowed origins, frontend/API domain categories, HTTPS |
| Payment | `PAYMENT_ACTIVE_PROVIDER`, `LEMONSQUEEZY_*`, checkout completeness |
| Webhook | `LEMONSQUEEZY_WEBHOOK_SECRET`, endpoint path category |
| Story/AI | `MISTRAL_API_KEY`, optional `ANTHROPIC_API_KEY` |
| Image | External provider boundary; env category if any |
| Monitoring/logging | Error monitoring, log policy, incident owner (pending/unknown) |

## Presence-Only Verification Rules

Future execution procedure (not run in D2-BC):

1. Confirm clean repo (`git status --short --branch`).
2. Confirm target environment name (`local` / `staging` / `production`).
3. Confirm operator approval and no-secret procedure acceptance.
4. Open host/provider dashboard only in the later execution phase.
5. Confirm variable presence by name/category only (configured/set — not value).
6. Record PASS/FAIL/UNKNOWN without values in evidence register.
7. Never screenshot values; redact dashboards before capture if needed.
8. Stop immediately if any value is exposed.
9. Do not trigger deploy, preview deploy, or provider/payment/image/story calls.
10. End with clean git status and compact phase report.

## Forbidden Evidence

- env values
- partial secret values
- screenshots showing values
- database URLs
- JWTs
- API keys
- webhook secrets
- provider tokens
- request headers
- cookies
- bearer tokens
- user session data
- real child data
- production logs with sensitive data

## Allowed Evidence

- command exit code
- names-only checklist status
- dashboard variable name present/absent without value
- route/status without tokens
- redacted screenshot where values are not visible
- commit/log/status
- validation helper PASS (exit code only when passing)
- concise manual notes

## Environment Inventory Inputs

These documents supply **names/categories only**. They do not prove env is configured:

- `docs/D3M_DEPLOYMENT_ENV_INVENTORY_CHECKLIST.md` — master inventory table
- `docs/D3M_DEPLOYMENT_ENV_VERIFICATION_PLAN.md` — separation model and stop/rollback rules
- `docs/D3M_PRODUCTION_LAUNCH_GATE_CHECKLIST.md` — Gates 3, 4, 16, 18 closure criteria

## Presence-Only Verification Checklist

| Category | Inventory Item | Future Presence Check Method | Allowed Evidence | Status | Notes |
| --- | --- | --- | --- | --- | --- |
| Deployment | Frontend hosting (Vercel) | Dashboard: service/project exists | Name-only note | PENDING | No deploy in protocol phase |
| Deployment | API hosting (Railway-named config) | Dashboard: service exists | Name-only note | PENDING | Provider finalization pending |
| Deployment | Database target | Dashboard: DB instance name only | Environment label | PENDING | No connection strings |
| Frontend | `NEXT_PUBLIC_API_URL` | Host env list: name present | PASS/FAIL by name | PENDING | Not localhost in prod |
| Frontend | `NEXT_PUBLIC_APP_NAME` | Host env list: name present | PASS/FAIL by name | PENDING | Optional if used |
| API | `ALLOWED_ORIGINS` | Host env list: name present | PASS/FAIL by name | PENDING | Match final domain later |
| API | `FRONTEND_URL` | Host env list: name present | PASS/FAIL by name | PENDING | Checkout redirect dependency |
| API | `JWT_SECRET` / `JWT_REFRESH_SECRET` | Host env list: names present | PASS/FAIL by name | PENDING | Never view value |
| Database | `DATABASE_URL` / `DIRECT_URL` | Host env list: names present | PASS/FAIL by name | PENDING | Never view value |
| Story | `MISTRAL_API_KEY` | Host env list: name present | PASS/FAIL by name | PENDING | Required if generation enabled |
| Payment | `PAYMENT_ACTIVE_PROVIDER` | Host env list: name present | PASS/FAIL by name | PENDING | Billing blocked for launch |
| Payment | `LEMONSQUEEZY_API_KEY` | Host env list: name present | PASS/FAIL by name | PENDING | Legacy; not launch-ready |
| Payment | `LEMONSQUEEZY_STORE_ID` | Host env list: name present | PASS/FAIL by name | PENDING | Checkout completeness gate |
| Webhook | `LEMONSQUEEZY_WEBHOOK_SECRET` | Host env list: name present | PASS/FAIL by name | PENDING | No live webhook test |
| Monitoring | Error monitoring DSN/category | Host env or ops doc | Category status | PENDING | Unknown until documented |

## Deployment Dry-Run Scope

Dry-run in this protocol means **planning/checklist only**:

- identify deploy target
- confirm build/start commands from docs/config
- confirm rollback path is documented
- confirm env presence protocol is complete before execution
- confirm smoke plan exists
- confirm no production deploy is triggered

## Deployment Dry-Run Checklist

| Area | Dry-Run Check | Required Evidence | Status | Blocker If Missing? | Notes |
| --- | --- | --- | --- | --- | --- |
| Frontend build | `cd apps/web && next build` known | Build log PASS in target pipeline | PENDING | Yes | From `vercel.json` |
| API build/start | `node dist/index.js` known | Start + `/health` smoke | PENDING | Yes | From `railway.json` |
| Deploy provider | Frontend Vercel + API Railway-named | Target confirmation doc | PENDING | Yes | Render unresolved |
| Production domain | Final public domain(s) | Domain list (no secrets) | PENDING | Yes | CORS/checkout dependency |
| API URL | Public API base URL category | Frontend `NEXT_PUBLIC_API_URL` presence | PENDING | Yes | Fail-fast in production |
| CORS origins | `ALLOWED_ORIGINS` matches domain | CORS smoke from frontend | PENDING | Yes | No wildcard unless approved |
| Database target | Production DB identity by name | Env label confirmation | PENDING | Yes | No URL values |
| Rollback | Redeploy previous artifact / revert | Rollback rehearsal note | PENDING | Yes | Before prod deploy |
| Monitoring | Log policy + alerts | Ops readiness checklist | PENDING | Yes | Gate 15 |
| Post-deploy smoke | Manual smoke pack defined | Smoke evidence register | PENDING | Yes | Gate 16 |

## Frontend Dry-Run Checklist

| Check | Status | Future Evidence |
| --- | --- | --- |
| Next build succeeds in target pipeline | PENDING | Build exit code only |
| Localized routes `/en`, `/ar`, `/fr` load | PENDING | Route smoke |
| Public API URL configured for target environment | PENDING | Presence + non-localhost check |
| No localhost public API URL in production | PENDING | Config review + smoke |
| Pricing unavailable state safe if payments disabled | PENDING | EN/AR/FR pricing smoke |
| Generate/story/PDF fallback paths available | PENDING | UI/PDF smoke |

## API Dry-Run Checklist

| Check | Status | Future Evidence |
| --- | --- | --- |
| API build succeeds | PENDING | Build exit code |
| API start command known (`node dist/index.js`) | PENDING | Process start log (no secrets) |
| Port config known (`PORT` / `API_PORT`) | PENDING | Reachability smoke |
| `/health` availability target known | PENDING | HTTP status |
| Auth route protection remains tested | PENDING | Protected route smoke |
| Logs policy defined (no secrets) | PENDING | Log review checklist |
| No secret output in startup/request logs | PENDING | Redacted log sample |

## Database / Prisma Dry-Run Checklist

| Check | Status | Future Evidence |
| --- | --- | --- |
| Target DB environment identified by name only | PENDING | Environment label |
| Prisma generate/build passes | PENDING | CI/local build PASS |
| Migration status understood | PENDING | Migration status note |
| No destructive migration without approval | PENDING | Explicit approval gate |
| Backup/rollback path known | PENDING | Ops doc reference |

## CORS / Domain / URL Dry-Run Checklist

| Check | Status | Future Evidence |
| --- | --- | --- |
| Frontend domain confirmed | PENDING | Domain list |
| API domain confirmed | PENDING | Public URL smoke |
| Allowed origins match frontend | PENDING | CORS preflight smoke |
| HTTPS required | PENDING | TLS check |
| No wildcard origin unless approved | PENDING | Config review |
| No localhost in production public config | PENDING | Guard + smoke |

## Auth / Security Dry-Run Checklist

| Check | Status | Future Evidence |
| --- | --- | --- |
| JWT secret presence-only check | PENDING | Name present PASS/FAIL |
| Login/register smoke | PENDING | Test account smoke |
| Protected route smoke | PENDING | 401/403 behavior |
| Ownership smoke | PENDING | Cross-user denial |
| No token logs | PENDING | Log review |

## Payments / Webhook Dry-Run Checklist

| Check | Status | Future Evidence |
| --- | --- | --- |
| Provider external approval | BLOCKED | KYB/legal package |
| Checkout unavailable/safe until approved | PENDING | Status + pricing smoke |
| Webhook secret presence-only | PENDING | Name present PASS/FAIL |
| No real checkout/webhook in protocol phase | N/A | Forbidden |
| Production billing readiness | BLOCKED | Approved provider evidence |

## Image Track Dry-Run Checklist

| Track | Status | Notes |
| --- | --- | --- |
| C2 — no-provider/static tests | PASS | Static regression only |
| C3 — generate page fallback | PASS | UI fallback implemented |
| C4 — runtime smoke plan | PASS | Plan documented |
| C5 — runtime smoke | DEFERRED | Not executed |
| Production image readiness | PENDING | Provider not proven |

## PDF / Localization Dry-Run Checklist

| Check | Status | Future Evidence |
| --- | --- | --- |
| EN/AR/FR route checks | PENDING | Locale smoke |
| PDF manual smoke | PENDING | PDF regression checklist |
| Mojibake scan | PENDING | Validation helper / scan PASS |
| Fallback text checks | PENDING | Generate/story/PDF smoke |

## Monitoring / Logs / Incident Dry-Run Checklist

| Check | Status | Future Evidence |
| --- | --- | --- |
| Production log policy | PENDING | Policy doc |
| Error monitoring decision | PENDING | Provider selection |
| Payment/image/provider failure monitoring | PENDING | Alert runbook |
| Incident owner | PENDING | Named owner |
| No sensitive logs | PENDING | Redacted log review |

## Rollback / Stop / Kill-Switch Checklist

| Item | Status | Notes |
| --- | --- | --- |
| Deploy rollback path | PENDING | Redeploy previous release |
| Env rollback path | PENDING | Restore prior env set (no values in evidence) |
| Payment disable / fail-closed | KNOWN | `CHECKOUT_PROVIDER_CONFIG_INCOMPLETE` path |
| Provider disable / fallback | PENDING | Story/image degrade safely |
| Incident owner | PENDING | Assign before deploy |
| Stop conditions documented | KNOWN | See Stop Conditions section |

## Evidence Register Template

| Phase | Check | Environment | Evidence Type | Result | Date | Owner | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `<phase>` | `<check name>` | `<local/staging/production>` | `<redacted note / exit code>` | `<PASS/FAIL/PENDING>` | `<YYYY-MM-DD>` | `<owner>` | `<no values>` |

Do not fill with invented results in D2-BC.

## Blocker Register

| Blocker | Area | Severity | Current Status | Required Evidence | Recommended Phase |
| --- | --- | --- | --- | --- | --- |
| Production env presence not verified | Env | Critical | BLOCKED | Presence-only register (no values) | D2-D |
| Provider choice/readiness pending | Deployment | High | PENDING | Hosting target confirmation | D2-D |
| Payment provider approval pending | Payments | Critical | BLOCKED | KYB/legal package | Payments-Provider-Response |
| Checkout/webhook not verified | Payments | Critical | BLOCKED | Controlled smoke with approval | Post-approval phase |
| Deploy dry-run not executed | Deployment | High | PENDING | Dry-run evidence pack | D2-D |
| Monitoring not ready | Ops | High | BLOCKED | Monitoring checklist | D2-D / ops phase |
| Production rollback not proven | Deployment | High | PENDING | Rollback rehearsal | D2-D |
| Image runtime smoke deferred | Image | Medium | PENDING | C5 smoke if required | C5 (optional) |
| Final localization/PDF smoke pending | QA | High | PENDING | Manual smoke pack | Production-Smoke-Pack |

## Stop Conditions

Stop immediately if:

- secret displayed
- env value copied
- dashboard screenshot exposes value
- CLI would print values
- wrong environment selected
- deploy triggered
- provider/payment/image/story call triggered
- DB migration prompt appears
- repo changes unexpectedly
- shell instability prevents evidence
- logs contain tokens/child data

## What Must Not Be Pasted Back To ChatGPT

- full successful validation logs
- env values
- dashboard secret screenshots
- full `pnpm test` logs when passing
- full `pnpm build` logs when passing
- provider payloads
- request headers/tokens
- raw logs containing user/child data

## What Cursor Should Report Back

Required compact format:

```text
Phase:
Result:
Commit hash:
Push status:
Files changed:
Summary:
Validation:
- diff check exit code:
- strict validation helper exit code:
Commit exit code:
Push exit code:
Final git status:
Final git log -8:
Next:
```

If validation succeeds, do not paste full logs.

## Recommended Execution Sequence

1. **D2-D — Deployment readiness execution packet** — presence-only checklist execution prep + dry-run evidence template completion (still no secrets).
2. **Payments-Provider-Response — KYB/provider approval package** if payment is the priority.
3. **Production-Smoke-Pack — manual smoke plan consolidation**.
4. **C5 — safe local image runtime smoke** only if shell/runtime stability is acceptable.
5. **Final Launch Gate Review**.

## Recommended Next Phase

- Primary: `D3M-Triage-D2-D — Deployment readiness execution packet`
- Alternative: `D3M-Payments-Provider-Response — KYB/provider approval package`

## Notes For Next Chat

- D2-BC is protocol/checklist only; no presence verification was executed.
- Use compact Cursor reports per this document; avoid pasting full passing logs to ChatGPT.
- Full production launch remains **NO-GO** until gates pass with explicit redacted evidence.
