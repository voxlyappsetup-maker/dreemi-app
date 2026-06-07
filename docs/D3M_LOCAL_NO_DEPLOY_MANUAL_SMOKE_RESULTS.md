# D3M Local No-Deploy Manual Smoke Results

## Status

Local no-deploy manual smoke run executed against `localhost` only.
No deployment was executed.
No production smoke was executed.
No dashboard was accessed.
No env/secrets were read, printed, verified, or modified.
No `.env` or `.env.example` file was read or modified.
No checkout, webhook, provider, Pollinations, image generation, or story generation calls were executed.
Final smoke result: **PARTIAL** (local evidence mostly PASS; PDF and production gates remain blocked).

## Purpose

- Execute the D5 worksheet checks safely on local dev servers.
- Capture no-secret route/API evidence for launch gate alignment.
- Keep production launch **NO-GO** until production-critical evidence exists.

## Current Baseline

- Starting commit: `6ebac4e Add no-deploy manual smoke worksheet`
- Starting state: `## main...origin/main` (clean)
- Full production launch remains **NO-GO**

## Source Availability

- Available: D5 worksheet, D4 smoke pack, launch gate checklist, project handoff, execution packet.
- Missing: none.

## Explicit Non-Goals

- No deploy, preview deploy, dashboard access, env reads, checkout, webhook, provider calls.
- No story/image generation runtime, migrations, runtime code changes, or CI changes.

## Safety Boundaries

- Evidence limited to HTTP status codes, route paths, allowed API JSON fields, and concise observations.
- No request headers, tokens, cookies, env values, or full logs captured.

## Environment

| Item | Value |
| --- | --- |
| Target | Local only |
| Web base URL | `http://localhost:3000` |
| API base URL | `http://localhost:3001` |
| Web start | `pnpm --filter @dreemi/web dev` |
| API start | `pnpm --filter @dreemi/api dev` |

## Commands Run

| Command | Purpose | Exit |
| --- | --- | --- |
| `git status --short --branch` | Clean tree check | 0 |
| `git diff --check` | Pre-smoke diff check | 0 |
| `validate_phase.ps1 -StrictScope` | Pre-smoke validation | 0 |
| `pnpm --filter @dreemi/api dev` | Local API | started |
| `pnpm --filter @dreemi/web dev` | Local web | started |
| HTTP smoke script (local) | Route/API checks | 0 |
| Server stop | Cleanup | 0 |

## Pre-Smoke Validation Results

| Check | Result | Status |
| --- | --- | --- |
| Clean git tree | `## main...origin/main` | PASS |
| `git diff --check` | exit 0 | PASS |
| `validate_phase.ps1 -StrictScope` | final result PASS | PASS |

## Local Runtime Startup Result

| Service | Port | Result | Status |
| --- | --- | --- | --- |
| API (`@dreemi/api dev`) | 3001 | listening; `/health` returned `status: ok` | PASS |
| Web (`@dreemi/web dev`) | 3000 | ready; routes reachable | PASS |

Servers terminated after smoke completion.

## Frontend Public Route Results

All routes checked via HTTP GET to `http://localhost:3000{path}`. Expected: HTTP 2xx, no crash.

| Route | HTTP | Status |
| --- | --- | --- |
| `/en` | 200 | PASS |
| `/ar` | 200 | PASS |
| `/fr` | 200 | PASS |
| `/en/pricing` | 200 | PASS |
| `/ar/pricing` | 200 | PASS |
| `/fr/pricing` | 200 | PASS |
| `/en/generate` | 200 | PASS |
| `/ar/generate` | 200 | PASS |
| `/fr/generate` | 200 | PASS |
| `/en/privacy` | 200 | PASS |
| `/ar/privacy` | 200 | PASS |
| `/fr/privacy` | 200 | PASS |
| `/en/terms` | 200 | PASS |
| `/ar/terms` | 200 | PASS |
| `/fr/terms` | 200 | PASS |
| `/en/login` | 200 | PASS |
| `/ar/login` | 200 | PASS |
| `/fr/login` | 200 | PASS |
| `/en/register` | 200 | PASS |
| `/ar/register` | 200 | PASS |
| `/fr/register` | 200 | PASS |

## Pricing Unavailable Results

| Check | Expected | Observed | Status |
| --- | --- | --- | --- |
| EN card label | `Unavailable` | present | PASS |
| AR card label | `غير متاح` | present | PASS |
| FR card label | `Indisponible` | present | PASS |
| EN top message | temporarily unavailable copy | present | PASS |
| AR top message | localized unavailable copy | present | PASS |
| FR top message | localized unavailable copy | present | PASS |
| Checkout triggered | none | none | SKIPPED_BY_POLICY |
| Provider call | none | none | SKIPPED_BY_POLICY |

## API Status Results

| Endpoint | Allowed fields observed | Status |
| --- | --- | --- |
| `GET /health` | `status: ok`, `service: dreemi-api` | PASS |
| `GET /api/payments/status` | `success: true`; `payments.canStartCheckout: false`; `payments.checkoutOfferable: false`; `payments.errorCode: CHECKOUT_PROVIDER_CONFIG_INCOMPLETE`; `payments.activeProvider: LEMONSQUEEZY` | PASS |

Fail-closed billing gate confirmed locally. No request headers or secrets captured.

## Auth Route Results

| Check | Result | Status |
| --- | --- | --- |
| Login pages load (en/ar/fr) | HTTP 200 | PASS |
| Register pages load (en/ar/fr) | HTTP 200; form fields visible | PASS |
| JWT visible in login HTML | not observed | PASS |
| Real credentials / account creation | not attempted | SKIPPED_BY_POLICY |
| Empty-form submit UX | not exercised in this run | NOT_TESTED |

## Dashboard / Settings Results

| Route | HTTP | Observation | Status |
| --- | --- | --- | --- |
| `/en/dashboard` | 200 | page shell loads; login-related copy present | PARTIAL |
| `/en/settings` | 200 | page shell loads; login-related copy present | PARTIAL |

Client-side auth redirect/guard not fully verified without credentials. No real user data used.

## Children / Entitlement Results

| Route | HTTP | Observation | Status |
| --- | --- | --- | --- |
| `/en/children` | 200 | page shell loads; children/login-related copy present | PARTIAL |

No entitlement mutation or payment runtime dependency exercised.

## Story Generation Page Results

| Check | Result | Status |
| --- | --- | --- |
| Generate pages load (en/ar/fr) | HTTP 200 | PASS |
| Form/UI visible on `/en/generate` | observed | PASS |
| Story generation call | not executed | SKIPPED_BY_POLICY |
| Mistral/provider call | not executed | SKIPPED_BY_POLICY |

## Story Detail Results

| Check | Result | Status |
| --- | --- | --- |
| `/en/story/test-id-placeholder` | HTTP 500 | PARTIAL |
| Safe existing test story | none available locally | BLOCKED_SAFE_DATA_REQUIRED |
| Ownership guard (live) | not tested without credentials | NOT_TESTED |

Invalid placeholder ID produced server error rather than graceful not-found UX locally. Static regression tests remain the primary ownership guard evidence.

## PDF Export Results

| Check | Result | Status |
| --- | --- | --- |
| PDF export from safe story | no safe local test story available | BLOCKED_SAFE_DATA_REQUIRED |
| RTL/EN/FR PDF smoke | not executed | BLOCKED_SAFE_DATA_REQUIRED |

No story was created for PDF testing per phase policy.

## Image Fallback Results

| Check | Result | Status |
| --- | --- | --- |
| Generate page UI loads | HTTP 200 | PASS |
| Runtime missing-image fallback | not triggered | SKIPPED_BY_POLICY |
| Pollinations/provider call | not executed | SKIPPED_BY_POLICY |

Static track remains: C2/C3 PASS (tests/plan); C5 DEFERRED (runtime).

## Localization Results

| Check | Result | Status |
| --- | --- | --- |
| Arabic RTL (`/ar`) | RTL/lang markers observed | PASS |
| French home (`/fr`) | FR locale content observed | PASS |
| Pricing unavailable copy (en/ar/fr) | all present | PASS |
| Mojibake | not re-scanned beyond validation helper | NOT_TESTED |

## Payments / Webhooks Results

| Check | Result | Status |
| --- | --- | --- |
| Live checkout | not executed | SKIPPED_BY_POLICY |
| Live webhook | not executed | SKIPPED_BY_POLICY |
| Provider dashboard | not accessed | SKIPPED_BY_POLICY |
| Local status route fail-closed | confirmed | PASS |

Production billing remains **No-Go**.

## Privacy / Legal Results

| Route | HTTP | Status |
| --- | --- | --- |
| `/en/privacy` | 200 | PASS |
| `/ar/privacy` | 200 | PASS |
| `/fr/privacy` | 200 | PASS |
| `/en/terms` | 200 | PASS |
| `/ar/terms` | 200 | PASS |
| `/fr/terms` | 200 | PASS |

## Monitoring / Logs Results

| Check | Result | Status |
| --- | --- | --- |
| Log policy review | not executed in D6 | NOT_TESTED |
| Secret-free log review | not executed | NOT_TESTED |
| Incident owner assignment | not executed | NOT_TESTED |

## Rollback / Stop Results

| Check | Result | Status |
| --- | --- | --- |
| Deploy rollback rehearsal | not executed | NOT_TESTED |
| Stop conditions | none triggered | PASS |

## Launch Gate Evidence Update

| Gate | D6 Status | Notes |
| --- | --- | --- |
| 1 Repository/validation | LOCAL_PASS | clean tree; validation PASS |
| 2 Validation/tests | LOCAL_PASS | strict helper PASS |
| 3 Env presence | PENDING_PRODUCTION_EVIDENCE | no env verification |
| 4 Deploy smoke | PARTIAL_LOCAL_EVIDENCE | local health only |
| 5 API readiness | LOCAL_PASS | health + payments status |
| 6 Frontend routes | LOCAL_PASS | 21 public routes HTTP 200 |
| 7 Auth | PARTIAL_LOCAL_EVIDENCE | pages load; protected shell PARTIAL |
| 8 Story generation | PARTIAL_LOCAL_EVIDENCE | page load only |
| 9 Payments unavailable UX | LOCAL_PASS | fail-closed UX + API |
| 10 Webhooks | SKIPPED_BY_POLICY | no live webhook |
| 11 Image fallback | PARTIAL_LOCAL_EVIDENCE | page load; no runtime C5 |
| 12 PDF export | BLOCKED | safe test data required |
| 13 Localization | LOCAL_PASS | en/ar/fr pricing + RTL |
| 14 Privacy/legal | LOCAL_PASS | pages load |
| 15 Monitoring | PENDING_PRODUCTION_EVIDENCE | not tested |
| 16 Manual smoke | PARTIAL_LOCAL_EVIDENCE | local D6 only |
| 17 Rollback | PENDING_PRODUCTION_EVIDENCE | not rehearsed |
| 18 Full launch | BLOCKED | production NO-GO |

No production-critical gate marked fully PASS.

## Blockers Found

| Blocker | Severity | Status |
| --- | --- | --- |
| Production env presence not verified | Critical | OPEN |
| Production deploy smoke missing | Critical | OPEN |
| Provider/KYB approval pending | Critical | OPEN |
| PDF smoke needs safe test story | Medium | OPEN |
| Story detail invalid ID returns HTTP 500 locally | Low | OPEN |
| Protected routes return HTTP 200 shell without server redirect | Low | OPEN |
| Image runtime smoke (C5) deferred | Medium | OPEN |

## Stop Conditions Triggered

None.

## Final Smoke Result

**PARTIAL**

- Local public routes, pricing unavailable UX, API fail-closed status, auth page loads, privacy/terms, and localization: **PASS** locally.
- Dashboard/settings/children/story detail/image fallback: **PARTIAL**.
- PDF export: **BLOCKED_SAFE_DATA_REQUIRED**.
- Checkout/webhook/provider/story/image generation: **SKIPPED_BY_POLICY**.
- Production launch: **NO-GO**.

## Recommended Next Phase

- Primary: `D3M-Payments-Provider-Response — KYB/provider approval package`
- Alternative (if fixing story detail 500): `D3M-Triage-D6-Fix — Local smoke findings fix batch`

## Notes For Next Chat

- D6 evidence is local-only; do not treat as production PASS.
- Use `docs/D3M_NO_DEPLOY_MANUAL_SMOKE_EXECUTION_WORKSHEET.md` row IDs when updating worksheet statuses in a follow-up if desired.
- Compact Cursor reports required; no full passing logs in chat.

## D6-Fix Follow-Up (Local No-Deploy Re-Smoke)

**Phase:** D3M-Triage-D6-Fix — Local smoke findings fix batch
**Baseline:** `5a6843a` (pre-fix working tree)
**Fix:** Browser-only guards added in `apps/web/src/lib/storage.ts` via `getLocalStorage()` / `typeof window` checks; static regression guard added in `services/api/src/routes/stories.security-regression.test.ts`.

### D6-Fix Targeted Smoke Results

| Check | D6 Before | D6-Fix After | Status |
| --- | --- | --- | --- |
| `/en/story/test-id-placeholder` | HTTP 500 (`localStorage is not defined`) | HTTP 200 (safe not-found/error UI) | PASS |
| `/en`, `/ar`, `/fr` | HTTP 200 | HTTP 200 | PASS |
| Pricing unavailable (en/ar/fr) | labels/messages present | labels/messages present | PASS |
| `GET /api/payments/status` | fail-closed | `canStartCheckout=false`, `errorCode=CHECKOUT_PROVIDER_CONFIG_INCOMPLETE` | PASS |

### D6-Fix Validation

| Command | Exit |
| --- | --- |
| `git diff --check` | 0 |
| `pnpm --filter @dreemi/api test` | 0 |
| `pnpm test` | 0 |
| `pnpm lint` | 0 |
| `pnpm build` | 0 |

### D6-Fix Unchanged Blockers

- PDF export: **BLOCKED_SAFE_DATA_REQUIRED**
- Checkout/webhook/provider/story/image generation: **SKIPPED_BY_POLICY**
- Production launch: **NO-GO**
- Server cleanup: dev processes force-stopped intentionally (Windows exit `4294967295` expected on force-stop)

### D6-Fix Final Result

**PARTIAL → improved** — story detail SSR crash fixed locally; remaining blockers unchanged. Ready for manual commit with suggested message: `Fix story detail SSR storage crash`.
