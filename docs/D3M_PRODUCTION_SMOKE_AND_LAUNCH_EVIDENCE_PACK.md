# D3M Production Smoke And Launch Evidence Pack

## Status

This is a docs-only production smoke and launch evidence pack.
No production smoke was executed.
No deployment was executed.
No dashboard was accessed.
No real environment verification was executed.
No runtime/provider/payment/image/story calls were executed.
No env/secrets were read, printed, verified, or modified.
No `.env` or `.env.example` file was read or modified.

## Purpose

- Consolidate future production smoke coverage, launch evidence requirements, Go/No-Go gate mapping, manual smoke templates, safe evidence rules, and blockers into one pack.
- Bridge D3 no-secret evidence to future manual smoke execution (D5 worksheet, D6 run) and final launch gate review.
- Keep production launch **NO-GO** until critical gates have direct execution evidence.

## Current Baseline

- Latest stable commit: `3a6a53c Add no-secret deployment readiness evidence pass`
- Starting state: `## main...origin/main` (clean)
- Full production launch remains **NO-GO**

## Source Availability

- Available: handoff, launch gate checklist, D3 evidence pass, execution packet, protocol, inventory, verification plan, image smoke plan, payment external verification checklist.
- Missing: none.

Upstream artifacts (planning/evidence inputs, not smoke execution):

- `docs/D3M_NO_SECRET_DEPLOYMENT_READINESS_EVIDENCE_PASS.md`
- `docs/D3M_DEPLOYMENT_READINESS_EXECUTION_PACKET.md`
- `docs/D3M_PRODUCTION_LAUNCH_GATE_CHECKLIST.md`

## Explicit Non-Goals

- No production launch, deploy, preview deploy, dashboard access, environment value verification, env file reading.
- No payment checkout, live webhook, provider call, image/story generation runtime call.
- No database migration, runtime code change, CI/GitHub Actions change.

## Smoke Pack Principles

- This pack defines what to execute later; it does not execute smoke now.
- Every smoke result must map to a launch gate.
- Evidence must be no-secret.
- No screenshots with secrets or real child data.
- No gate becomes PASS from planning alone.
- Failed smoke must capture only minimal relevant failure excerpts.
- Successful validation logs must not be pasted in full.
- Production launch remains blocked until critical evidence exists.

## Compact Cursor Report Rule

Cursor reports must stay compact.

- Do not paste full successful validation/test/build logs.
- Report only exit codes, files changed, commit hash, push status, blockers, final git status, final git log, and next phase.
- If a command fails, paste only the minimal failing excerpt.
- Preferred report length: under 80 lines.

## Launch Gate Alignment

| Gate | D4 pack section | Planning status |
| --- | --- | --- |
| 1 Repository hygiene | Repository / Validation Smoke | PLANNED |
| 2 Validation/build/test | Repository / Validation Smoke | PLANNED |
| 3 Environment/secrets | Global pre-smoke; names-only later | BLOCKED |
| 4 Deployment/hosting | Rollback; deploy smoke deferred | BLOCKED |
| 5 API/backend runtime | API Smoke Pack | PLANNED |
| 6 Frontend runtime | Frontend Smoke Pack | PLANNED |
| 7 Auth/ownership | Auth Smoke Pack | PLANNED |
| 8 Child safety | Story Generation Smoke Pack | PLANNED |
| 9 Payments/billing | Payments/Pricing Smoke Pack | BLOCKED |
| 10 Webhooks | Webhook/Subscription Smoke Pack | BLOCKED |
| 11 Image generation | Image Track Smoke Pack | PARTIAL_EVIDENCE |
| 12 PDF export | PDF Export Smoke Pack | PLANNED |
| 13 Localization | Localization Smoke Pack | PLANNED |
| 14 Privacy/legal | Privacy/Legal Smoke Pack | PLANNED |
| 15 Monitoring/incident | Monitoring Smoke Pack | BLOCKED |
| 16 Manual smoke (Gate 16) | Smoke Coverage Matrix | PLANNED |
| 17 Rollback/kill switches | Rollback Smoke Pack | PLANNED |
| 18 Final Go/No-Go | Go/No-Go Review Template | BLOCKED |

No critical gate marked PASS from this pack alone.

## Smoke Coverage Matrix

| Area | Smoke Type | Environment | Allowed Evidence | Mapped Gate | Current Status | Blocker If Missing? | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Repository | git status/log/diff | local | exit codes, clean status | 1 | PLANNED | Yes | Before/after each phase |
| Validation | validate_phase / test / lint / build | local | exit codes only when passing | 2 | PLANNED | Yes | No full logs in docs |
| Env presence | names-only checklist | staging/prod | PASS/FAIL by category | 3 | BLOCKED | Yes | No values |
| Deploy target | host/domain confirmation | staging/prod | name-only note | 4 | BLOCKED | Yes | No deploy in D5 default |
| Frontend routes | localized page load | local/staging/prod | route notes, redacted screenshots | 6, 13 | PLANNED | Yes | EN/AR/FR |
| API health/status | GET `/health`, `/api/payments/status` | local/staging/prod | HTTP status, redacted JSON shape | 5, 9 | PLANNED | Yes | No tokens in evidence |
| Auth | login/register/protected routes | local/staging/prod | pass/fail notes | 7 | PLANNED | Yes | Test account only |
| Children/entitlement | limits smoke | local/staging/prod | limit behavior notes | 6, 7 | PLANNED | Yes | No payment dependency |
| Story generation | safe generic prompt | local/staging | creation notes | 5, 8 | BLOCKED | Yes | Explicit approval required |
| Image runtime | C5 optional path | local | fallback/UI notes | 11 | BLOCKED | Optional | C2/C3 static PASS only |
| PDF export | manual export EN/AR/FR | local/staging | PDF check notes | 12 | PLANNED | Yes | No real child data |
| Pricing unavailable | pricing pages | local/staging/prod | localized message notes | 6, 9 | PARTIAL_EVIDENCE | Yes | Prior no-purchase docs |
| Checkout/webhook | live payment path | prod | controlled smoke | 9, 10 | BLOCKED | Yes | Provider approval required |
| Monitoring | log/error review | prod | policy checklist | 15 | BLOCKED | Yes | No secret logs |
| Rollback | rehearsal | staging/prod | rollback note | 17 | PLANNED | Yes | Before deploy |
| Privacy/legal | page load review | prod | page availability notes | 14 | PLANNED | Yes | Legal review separate |

## Evidence Categories

**Allowed:**

- tracked config evidence (file names, command names from repo)
- validation command evidence (exit codes)
- no-secret manual route evidence (pass/fail, HTTP status without tokens)
- redacted screenshot evidence (no values, no PII)
- names-only environment presence evidence
- launch gate decision evidence (gate ID, result, date, owner)

**Forbidden:**

- env values, tokens, cookies, request headers
- database URLs, API keys, webhook secrets
- raw provider payloads
- real child/user data
- full successful logs

## Global Pre-Smoke Preconditions

Future smoke execution requires:

- explicit user approval
- clean git state (`git status --short --branch`)
- target environment named (`local` / `staging` / `production`)
- no-secret rules accepted
- validation helper PASS with reliable exit code
- no active unreviewed changes outside approved scope
- stop conditions understood
- payment/provider/image/story calls explicitly approved if included in smoke scope

## Repository / Validation Smoke Evidence

Future evidence (not executed in D4):

| Check | Command / source | Mapped Gate |
| --- | --- | --- |
| Branch alignment | `git status --short --branch` | 1 |
| Recent commits | `git log --oneline -8` | 1 |
| Whitespace/conflict | `git diff --check` | 1, 2 |
| Docs-only validation | `.\tooling\validate_phase.ps1 -StrictScope` | 2 |
| Full validation before runtime phase | `.\tooling\validate_phase.ps1` | 2 |

## Frontend Smoke Pack

Future checks (no execution in D4):

| Check | Route / target | Mapped Gate |
| --- | --- | --- |
| Locale home load | `/en`, `/ar`, `/fr` | 6, 13 |
| Pricing unavailable safe state | `/en/pricing`, `/ar/pricing`, `/fr/pricing` | 6, 9, 13 |
| Generate page load | `/en/generate`, `/ar/generate`, `/fr/generate` | 6, 8 |
| Story detail load | `/en/story/[id]` (test story) | 6, 7 |
| Auth pages | `/en/login`, `/en/register` (+ ar/fr) | 6, 7 |
| Children page | `/en/children` | 6, 7 |
| Settings | `/en/settings` if auth smoke approved | 6 |
| Production API URL guard | no localhost in prod public config | 3, 6 |
| No client secret exposure | page source/console review | 3 |
| Responsive sanity | basic layout check | 6 |

## API Smoke Pack

Future checks:

| Check | Target | Mapped Gate |
| --- | --- | --- |
| Health | `GET /health` | 5, 4 |
| Payment status (no-purchase) | `GET /api/payments/status` | 5, 9 |
| Protected stories reject unauthenticated | `/api/stories` without token | 5, 7 |
| CORS from frontend origin | preflight/actual request | 4, 5 |
| Safe error responses | no stack/secrets to client | 5 |
| No secret logs | redacted log review | 3, 15 |

## Auth / Authorization Smoke Pack

Future checks:

- login/register with test account only
- authenticated route access succeeds
- unauthenticated access rejected (401/403)
- story ownership: user A cannot access user B story
- child ownership enforced
- no query/body `userId` trust (behavioral observation)
- no token screenshots or token values in logs

Mapped gates: 7, 5.

## Children / Entitlement Smoke Pack

Future checks:

- child limits by plan (FREE: 1, FAMILY: 4, etc. per docs)
- FREE story monthly limit (3/month)
- SCHOOL Infinity behavior if applicable
- entitlement compatibility via `User.plan` read model
- story limit checks independent of payment runtime in smoke scope

Mapped gates: 6, 7, 9 (no payment runtime dependency for limit checks).

## Story Generation Smoke Pack

Conservative future execution only with:

- safe generic prompt (no real child names/data)
- input/output safety behavior observed
- non-sensitive logs only
- story creation path verified
- no provider payload exposure in evidence

Provider/Mistral call requires explicit approval. Mapped gates: 5, 8.

## Image Track Smoke Pack

| Track | Status | Evidence type |
| --- | --- | --- |
| C2 — no-provider/static tests | PASS (static, not production smoke) | Prior regression tests |
| C3 — generate fallback | PASS (static/UI, not production smoke) | Prior implementation + static tests |
| C4 — runtime smoke plan | PASS (plan only) | `docs/D3M_IMAGE_RUNTIME_SMOKE_PLAN.md` |
| C5 — runtime smoke | DEFERRED | Requires explicit approval |

Future smoke: safe generic prompt, no real child data, no provider payload logs, verify non-blocking fallback on generate/story/card/PDF.

Production image readiness: **PENDING**. Mapped gate: 11.

## PDF Export Smoke Pack

Future checks:

- export from story detail
- export from generate result if supported
- Arabic RTL layout integrity
- English/French layout integrity
- image fallback block in PDF when image missing
- no broken/missing body content
- synthetic test story only (no real child data)

Mapped gate: 12. Reference: `docs/PDF_EXPORT_REGRESSION_CHECKLIST.md`.

## Localization Smoke Pack

Future checks:

- EN/AR/FR navigation and route labels
- pricing unavailable message localized
- generate image fallback message localized
- auth/error messages where visible
- PDF labels and bylines
- mojibake scan mandatory before launch cut

Mapped gates: 13, 2.

## Payments / Pricing Smoke Pack

Conservative future checks:

- pricing unavailable state safe in EN/AR/FR (prior docs show local PASS; production re-verify later)
- `GET /api/payments/status` no-secret smoke (shape only, no values)
- **no checkout**
- **no purchase**
- **no live webhook**
- provider approval/KYB remains blocker
- production billing remains **No-Go**

Mapped gates: 9, 10, 6.

## Webhook / Subscription Smoke Pack

| Item | Status | Notes |
| --- | --- | --- |
| Signature verification in code/tests | PARTIAL_EVIDENCE | Static tests only |
| Live provider webhook | BLOCKED | Explicit approval + approved provider |
| Subscription lifecycle production-proven | BLOCKED | Post-approval phase |
| Webhook execution in D5 default scope | NOT_APPLICABLE_FOR_NOW | Forbidden unless approved |

Mapped gate: 10.

## Privacy / Legal Smoke Pack

Future checks:

- privacy page loads (`/{locale}/privacy`)
- terms page loads (`/{locale}/terms`)
- no real child data in tests/screenshots
- delete/export expectations reviewed if applicable
- payment legal/payout path remains external dependency

Mapped gate: 14.

## Monitoring / Logging / Incident Smoke Pack

Future checks:

- production log policy documented
- no secret values in logs during smoke
- error monitoring tool/decision recorded
- payment failure monitoring plan
- image/provider failure monitoring plan
- incident owner named
- escalation/rollback note linked

Mapped gate: 15, 17.

## Rollback / Kill Switch Smoke Pack

Future checks:

- deploy rollback path rehearsed (document only until approved deploy)
- env rollback path (no values in evidence)
- payment disable/fail-closed (`CHECKOUT_PROVIDER_CONFIG_INCOMPLETE` behavior)
- provider/story/image degrade safely (fallback paths)
- image non-blocking fallback verified
- incident owner assigned
- stop conditions rehearsed

Mapped gates: 17, 9, 11.

## Manual Smoke Evidence Template

| Smoke ID | Area | Environment | Steps Summary | Allowed Evidence | Result | Blocker | Owner | Date | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `<SMK-###>` | `<area>` | `<local/staging/production>` | `<brief steps>` | `<exit code / pass-fail note>` | `<PASS/FAIL/PENDING>` | `<Y/N>` | `<owner>` | `<YYYY-MM-DD>` | `<no secrets>` |

Do not fill with invented results in D4.

## Launch Evidence Register Template

| Gate | Evidence Item | Source / Command / Manual Check | Result | Date | Owner | Decision Impact | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `<#>` | `<item>` | `<source>` | `<PASS/FAIL/PENDING>` | `<YYYY-MM-DD>` | `<owner>` | `<gate status change?>` | `<redacted>` |

Do not fill with invented results in D4.

## Blocker Register

| Blocker | Area | Severity | Current Evidence State | Required Evidence | Recommended Phase |
| --- | --- | --- | --- | --- | --- |
| Production env presence not verified | Env | Critical | BLOCKED | Names-only presence register | D5 / approved env phase |
| Deploy target not smoke-verified | Deployment | Critical | PENDING | Target + route smoke in target env | D5 |
| Production deploy not executed | Deployment | Critical | BLOCKED | Approved deploy + post-deploy smoke | Post-gate deploy phase |
| Payment provider approval pending | Payments | Critical | BLOCKED | KYB/legal package | Payments-Provider-Response |
| Real checkout/webhook not verified | Payments | Critical | BLOCKED | Controlled live smoke | Post-approval |
| Monitoring/incident readiness pending | Ops | High | BLOCKED | Ops checklist + owner | D5 / ops phase |
| Rollback not proven | Deployment | High | PENDING | Rehearsal evidence | D5 |
| Image runtime smoke deferred | Image | Medium | PARTIAL_EVIDENCE | C5 if launch-critical | C5 optional |
| Final localization/PDF smoke pending | QA | High | PLANNED | Manual smoke execution | D5 |
| Privacy/legal final review pending | Legal | High | BLOCKED | Legal review artifacts | Payment/legal track |

## Stop Conditions

Stop immediately if:

- secret displayed
- env value copied
- dashboard screenshot exposes values
- CLI would print values
- wrong environment selected
- deployment triggered accidentally
- payment/provider/image/story call triggered without approval
- DB migration prompt appears
- repo changes unexpectedly
- shell instability prevents reliable evidence
- logs contain tokens/child data

## Go / No-Go Review Template

```text
Launch Decision:
Required Critical Gates:
Passed Gates:
Blocked Gates:
Deferred Gates:
Risk Acceptance:
Approver:
Date:
Decision:
```

Current decision: **NO-GO**

Required critical gates before GO (minimum): 1, 2, 3, 4, 5, 6, 7, 9, 10, 15, 16, 17, 18 (plus 12/13/14 as product requires).

## What Must Not Be Reported Back

- full successful validation logs
- full test/build logs
- env values
- secret screenshots
- request headers
- tokens
- provider payloads
- real user/child data
- raw production logs

## Recommended Execution Order

1. **D3M-Payments-Provider-Response — KYB/provider approval package** if payment is priority.
2. **D3M-Triage-D6-Fix — Local smoke findings fix batch** if addressing D6 PARTIAL items (story detail 500, auth shell).
3. **D3M-Triage-C5 — safe local image runtime smoke** only if image readiness required and shell/runtime stable.
4. **D3M-Final-Launch-Gate-Review**
5. Actual deploy only after explicit approval and launch gates ready.

## Recommended Next Phase

- Primary: `D3M-Payments-Provider-Response — KYB/provider approval package`
- Alternative: `D3M-Triage-D6-Fix — Local smoke findings fix batch`

Execution worksheet (complete): `docs/D3M_NO_DEPLOY_MANUAL_SMOKE_EXECUTION_WORKSHEET.md`
Local execution results (D6 PARTIAL): `docs/D3M_LOCAL_NO_DEPLOY_MANUAL_SMOKE_RESULTS.md`

## Notes For Next Chat

- D4 is planning/templates only; no production smoke executed.
- D5 worksheet derived from this pack; D6 local execution results at `docs/D3M_LOCAL_NO_DEPLOY_MANUAL_SMOKE_RESULTS.md`.
- Full production launch remains **NO-GO** until gates close with direct evidence.
- Keep Cursor reports compact per this pack.
