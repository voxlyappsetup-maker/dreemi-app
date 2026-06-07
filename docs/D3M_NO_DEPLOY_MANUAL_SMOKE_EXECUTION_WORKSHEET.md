# D3M No-Deploy Manual Smoke Execution Worksheet

## Status

D5 worksheet prepared future manual smoke; **D6 local execution completed** — see `docs/D3M_LOCAL_NO_DEPLOY_MANUAL_SMOKE_RESULTS.md`.
No production smoke was executed in D5.
D6 local smoke: PARTIAL; no production smoke.
No deployment was executed.
No dashboard was accessed.
No real environment verification was executed.
No runtime/provider/payment/image/story generation calls were executed in D5.
D6 skipped checkout/webhook/provider/story/image generation by policy.
No env/secrets were read, printed, verified, or modified.
No `.env` or `.env.example` file was read or modified.

## Purpose

- Prepare a structured no-deploy manual smoke execution worksheet for later safe execution.
- Derive step-by-step checks, pass/fail rules, evidence capture format, and gate mapping from `docs/D3M_PRODUCTION_SMOKE_AND_LAUNCH_EVIDENCE_PACK.md`.
- Keep production launch **NO-GO** until manual smoke evidence is captured in a later approved phase (D6 executed locally; see results doc).

## Current Baseline

- Latest stable commit: `9a24071 Add production smoke and launch evidence pack`
- Starting state: `## main...origin/main` (clean)
- Full production launch remains **NO-GO**

## Source Availability

- Available: handoff, launch gate checklist, D4 smoke pack, D3 evidence pass, execution packet, protocol, image smoke plan, payment external verification checklist.
- Missing: none.

Upstream artifacts:

- `docs/D3M_PRODUCTION_SMOKE_AND_LAUNCH_EVIDENCE_PACK.md`
- `docs/D3M_NO_SECRET_DEPLOYMENT_READINESS_EVIDENCE_PASS.md`
- `docs/D3M_PRODUCTION_LAUNCH_GATE_CHECKLIST.md`

## Explicit Non-Goals

- No production launch, deploy, preview deploy, dashboard access, manual smoke execution in this phase.
- No environment value verification, env file reading, payment checkout, live webhook, provider call.
- No image/story generation runtime call, database migration, runtime code change, CI change.

## Worksheet Principles

- The worksheet prepares future manual smoke; it does not execute smoke now.
- Manual smoke must be no-secret by default.
- Every future smoke result must map to a launch gate.
- Use safe/generic test data only; do not use real child data.
- Do not paste full logs; do not screenshot tokens, headers, dashboards, or secret-bearing pages.
- No gate becomes PASS from worksheet existence alone.
- Production launch remains blocked until evidence exists.

## Compact Cursor Report Rule

Cursor reports must stay compact.

- Do not paste full successful validation/test/build logs.
- Report only exit codes, files changed, commit hash, push status, blockers, final git status, final git log, and next phase.
- If a command fails, paste only the minimal failing excerpt.
- Preferred report length: under 80 lines.

## Manual Smoke Scope

Later-execution scope only:

- public localized frontend pages
- auth routes (load/validation UX only; no real credentials in evidence)
- authenticated shell routes if safe test account exists later
- children/entitlement UI
- pricing unavailable state
- generate page load only unless story generation call explicitly approved later
- story detail page with safe existing test story only if available
- PDF export manual path
- image fallback UI
- API `GET /api/payments/status` only if safe local/no-secret route approved later
- privacy/terms pages
- **no checkout**
- **no webhook**
- **no provider calls** unless explicitly approved in a later phase

## Manual Smoke Status Legend

| Status | Meaning |
| --- | --- |
| PLANNED | Check defined in worksheet |
| PENDING_EXECUTION | Default for new rows; not yet run |
| PASS | Executed later with safe evidence |
| FAIL | Executed later; expected behavior broken |
| BLOCKED | Prerequisites missing |
| SKIPPED_BY_POLICY | Would require forbidden/unsafe action |
| NOT_APPLICABLE_FOR_NOW | Out of current scope |

New worksheet rows default to **PENDING_EXECUTION**.

## Global Preconditions

Future manual smoke execution requires:

- explicit user approval
- clean Git state
- target environment named (`local` / `staging` / `production`)
- no-secret rules accepted
- no real child data
- no payment/provider/image/story calls unless explicitly approved
- validation helper PASS before execution
- stop conditions accepted
- compact reporting rule accepted

## Global No-Secret Evidence Rules

**Allowed:** short route/page status, command exit code, concise manual note, redacted screenshot (no secrets/tokens/user data), clean git status, commit hash, blocker label.

**Forbidden:** env values, JWTs, cookies, request headers, dashboard secret screenshots, database URLs, API keys, webhook secrets, provider payloads, real child/user data, full successful logs.

## Repository / Validation Worksheet

| Smoke ID | Check | Steps Summary | Allowed Evidence | Mapped Gate | Expected Result | Status | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| SMK-001 | Clean git status | `git status --short --branch` | exit code, status text | 1 | clean/aligned | PENDING_EXECUTION | Before/after smoke |
| SMK-002 | Recent commits | `git log --oneline -8` | log excerpt (no secrets) | 1 | expected HEAD | PENDING_EXECUTION | |
| SMK-003 | Diff check | `git diff --check` | exit code 0 | 1, 2 | no whitespace errors | PENDING_EXECUTION | |
| SMK-004 | Validation helper | `validate_phase.ps1 -StrictScope` or full | exit code only | 2 | PASS | PENDING_EXECUTION | No full logs in docs |
| SMK-005 | Scope review | confirm docs-only or approved scope | file list | 1 | no sensitive paths | PENDING_EXECUTION | |
| SMK-006 | Mojibake scan | via validation helper | exit code | 2, 13 | no mojibake hits | PENDING_EXECUTION | |
| SMK-007 | Secret scan | via validation helper / changed files | exit code | 2, 3 | no secret patterns | PENDING_EXECUTION | |

## Frontend Public Route Worksheet

| Smoke ID | Route | Steps Summary | Mapped Gate | Expected Result | Status |
| --- | --- | --- | --- | --- | --- |
| SMK-010 | `/en` | Load home; check no crash | 6, 13 | page renders | PENDING_EXECUTION |
| SMK-011 | `/ar` | Load home; RTL sanity | 6, 13 | page renders RTL | PENDING_EXECUTION |
| SMK-012 | `/fr` | Load home | 6, 13 | page renders | PENDING_EXECUTION |
| SMK-013 | `/en/pricing` | Load pricing; unavailable safe state | 6, 9, 13 | unavailable UX visible | PENDING_EXECUTION |
| SMK-014 | `/ar/pricing` | Load pricing; AR message | 6, 9, 13 | localized unavailable | PENDING_EXECUTION |
| SMK-015 | `/fr/pricing` | Load pricing; FR message | 6, 9, 13 | localized unavailable | PENDING_EXECUTION |
| SMK-016 | `/en/generate` | Load generate page | 6, 8 | form renders | PENDING_EXECUTION |
| SMK-017 | `/ar/generate` | Load generate page | 6, 8, 13 | form renders | PENDING_EXECUTION |
| SMK-018 | `/fr/generate` | Load generate page | 6, 8, 13 | form renders | PENDING_EXECUTION |
| SMK-019 | `/en/privacy` | Load privacy page | 14 | page renders | PENDING_EXECUTION |
| SMK-020 | `/ar/privacy` | Load privacy page | 14, 13 | page renders | PENDING_EXECUTION |
| SMK-021 | `/fr/privacy` | Load privacy page | 14, 13 | page renders | PENDING_EXECUTION |
| SMK-022 | `/en/terms` | Load terms page | 14 | page renders | PENDING_EXECUTION |
| SMK-023 | `/ar/terms` | Load terms page | 14, 13 | page renders | PENDING_EXECUTION |
| SMK-024 | `/fr/terms` | Load terms page | 14, 13 | page renders | PENDING_EXECUTION |

## Auth Route Worksheet

| Smoke ID | Check | Steps Summary | Mapped Gate | Expected Result | Status |
| --- | --- | --- | --- | --- | --- |
| SMK-030 | Login page load | `/en/login` (+ ar/fr optional) | 6, 7 | form renders | PENDING_EXECUTION |
| SMK-031 | Register page load | `/en/register` | 6, 7 | form renders | PENDING_EXECUTION |
| SMK-032 | Empty/invalid submit | submit without required fields | 7 | safe validation message | PENDING_EXECUTION |
| SMK-033 | No token in UI | inspect visible UI only | 3, 7 | no token displayed | PENDING_EXECUTION |

Do not include real credentials in evidence. Login execution deferred to D6 with test account only if approved.

## Dashboard / Settings Worksheet

| Smoke ID | Check | Steps Summary | Mapped Gate | Expected Result | Status |
| --- | --- | --- | --- | --- | --- |
| SMK-040 | Dashboard load | authenticated test account only | 6 | page renders | PENDING_EXECUTION |
| SMK-041 | Settings load | `/en/settings` if available | 6 | page renders | PENDING_EXECUTION |
| SMK-042 | Navigation sanity | core nav links work | 6 | no crash | PENDING_EXECUTION |
| SMK-043 | Logout | if available | 7 | session cleared safely | PENDING_EXECUTION |

Requires safe test account in D6; skip with SKIPPED_BY_POLICY if no account approved.

## Children / Entitlement Worksheet

| Smoke ID | Check | Steps Summary | Mapped Gate | Expected Result | Status |
| --- | --- | --- | --- | --- | --- |
| SMK-050 | Children page load | `/en/children` | 6, 7 | page renders | PENDING_EXECUTION |
| SMK-051 | Child limit messaging | observe limit UI if visible | 6, 7 | safe message | PENDING_EXECUTION |
| SMK-052 | Story limit message | generate flow limit copy if triggered safely | 6, 7, 13 | locale-correct message | PENDING_EXECUTION |

No data mutation unless explicitly approved in D6.

## Story Generation Worksheet

| Smoke ID | Check | Steps Summary | Mapped Gate | Expected Result | Status |
| --- | --- | --- | --- | --- | --- |
| SMK-060 | Generate form render | fields visible | 6, 8 | form OK | PENDING_EXECUTION |
| SMK-061 | Locale behavior | labels/copy match locale | 13 | correct language | PENDING_EXECUTION |
| SMK-062 | Safety/error copy | invalid input safe message | 8 | safe UX | PENDING_EXECUTION |
| SMK-063 | Story generation call | safe generic prompt only | 5, 8 | story created | BLOCKED |

SMK-063 blocked until explicit approval in D6. No real child data.

## Story Detail Worksheet

| Smoke ID | Check | Steps Summary | Mapped Gate | Expected Result | Status |
| --- | --- | --- | --- | --- | --- |
| SMK-070 | Unauthenticated access | open detail without login | 7 | redirect/deny safe | PENDING_EXECUTION |
| SMK-071 | Authenticated detail | safe existing test story only | 6, 7 | story renders | PENDING_EXECUTION |
| SMK-072 | Ownership guard | cross-user access denied | 7 | 403/deny | PENDING_EXECUTION |

## PDF Export Worksheet

| Smoke ID | Check | Steps Summary | Mapped Gate | Expected Result | Status |
| --- | --- | --- | --- | --- | --- |
| SMK-080 | Export button visible | story detail/generate | 12 | button present | PENDING_EXECUTION |
| SMK-081 | PDF export EN | safe test story | 12, 13 | PDF opens/valid | PENDING_EXECUTION |
| SMK-082 | PDF export AR | RTL layout | 12, 13 | RTL OK | PENDING_EXECUTION |
| SMK-083 | PDF export FR | layout | 12, 13 | layout OK | PENDING_EXECUTION |
| SMK-084 | Image fallback in PDF | missing image story | 11, 12 | fallback block | PENDING_EXECUTION |

Reference: `docs/PDF_EXPORT_REGRESSION_CHECKLIST.md`. No execution in D5.

## Image Fallback Worksheet

| Track | Status |
| --- | --- |
| C2 — no-provider/static tests | PASS (static, not manual smoke) |
| C3 — generate fallback | PASS (static/UI, not manual smoke) |
| C4 — runtime smoke plan | PASS (plan only) |
| C5 — runtime smoke | DEFERRED |

| Smoke ID | Check | Steps Summary | Mapped Gate | Expected Result | Status |
| --- | --- | --- | --- | --- | --- |
| SMK-090 | Generate fallback UI | broken/missing image state | 11, 6 | fallback visible | PENDING_EXECUTION |
| SMK-091 | Story detail fallback | broken/missing image | 11, 6 | fallback visible | PENDING_EXECUTION |
| SMK-092 | StoryCard fallback | list view | 11, 6 | fallback visible | PENDING_EXECUTION |
| SMK-093 | Provider image call | Pollinations/runtime | 11 | image optional | BLOCKED |

SMK-093 blocked unless explicit approval (C5 path).

## Localization Worksheet

| Smoke ID | Check | Steps Summary | Mapped Gate | Expected Result | Status |
| --- | --- | --- | --- | --- | --- |
| SMK-100 | Arabic RTL readability | key pages ar | 13 | readable RTL | PENDING_EXECUTION |
| SMK-101 | English labels | key pages en | 13 | correct EN | PENDING_EXECUTION |
| SMK-102 | French labels | key pages fr | 13 | correct FR | PENDING_EXECUTION |
| SMK-103 | Pricing unavailable copy | en/ar/fr | 9, 13 | localized | PENDING_EXECUTION |
| SMK-104 | Image fallback copy | generate/story | 11, 13 | localized | PENDING_EXECUTION |
| SMK-105 | Mojibake check | validation scan | 2, 13 | no mojibake | PENDING_EXECUTION |

## Pricing / Payment Unavailable Worksheet

| Smoke ID | Check | Steps Summary | Mapped Gate | Expected Result | Status |
| --- | --- | --- | --- | --- | --- |
| SMK-110 | Pricing cards load | en/ar/fr | 6, 9 | cards visible | PENDING_EXECUTION |
| SMK-111 | Unavailable card labels | en/ar/fr | 9, 13 | localized labels | PENDING_EXECUTION |
| SMK-112 | Top unavailable message | en/ar/fr | 9, 13 | localized banner | PENDING_EXECUTION |
| SMK-113 | Payments status API | GET `/api/payments/status` no-secret | 5, 9 | fail-closed shape | PENDING_EXECUTION |
| SMK-114 | Checkout attempt | POST checkout | 9, 10 | forbidden | SKIPPED_BY_POLICY |

Payment production remains **No-Go**. No checkout/purchase/provider API call.

## API Status Worksheet

| Smoke ID | Check | Steps Summary | Mapped Gate | Expected Result | Status |
| --- | --- | --- | --- | --- | --- |
| SMK-120 | Health | GET `/health` if API running | 4, 5 | 200 + ok shape | PENDING_EXECUTION |
| SMK-121 | Payments status | GET `/api/payments/status` | 5, 9 | JSON shape only | PENDING_EXECUTION |
| SMK-122 | Protected stories | GET `/api/stories` no token | 5, 7 | 401/403 | PENDING_EXECUTION |
| SMK-123 | No secret logs | review filtered logs | 3, 15 | no secrets | PENDING_EXECUTION |

Do not paste auth tokens or request headers.

## Payments / Webhooks Worksheet

| Smoke ID | Check | Steps Summary | Mapped Gate | Expected Result | Status |
| --- | --- | --- | --- | --- | --- |
| SMK-130 | Live checkout | POST checkout | 9 | forbidden | SKIPPED_BY_POLICY |
| SMK-131 | Live webhook | POST webhook | 10 | forbidden | SKIPPED_BY_POLICY |
| SMK-132 | Provider dashboard | external dashboard | 9 | forbidden | SKIPPED_BY_POLICY |
| SMK-133 | Signature verify (static) | regression tests reference | 10 | test-backed only | PLANNED |

Provider/KYB approval pending. Production billing **No-Go**.

## Privacy / Legal Worksheet

| Smoke ID | Check | Steps Summary | Mapped Gate | Expected Result | Status |
| --- | --- | --- | --- | --- | --- |
| SMK-140 | Privacy load | en/ar/fr | 14 | pages render | PENDING_EXECUTION |
| SMK-141 | Terms load | en/ar/fr | 14 | pages render | PENDING_EXECUTION |
| SMK-142 | No real child data | evidence review | 14 | no PII in evidence | PENDING_EXECUTION |
| SMK-143 | Legal/payout review | external dependency | 14, 9 | documented blocker | BLOCKED |

## Monitoring / Logs Worksheet

| Smoke ID | Check | Steps Summary | Mapped Gate | Expected Result | Status |
| --- | --- | --- | --- | --- | --- |
| SMK-150 | Log policy | review ops doc | 15 | policy exists | PENDING_EXECUTION |
| SMK-151 | No secret logs | filtered log review | 15, 3 | no secrets | PENDING_EXECUTION |
| SMK-152 | Error monitoring | decision recorded | 15 | owner/tool named | PENDING_EXECUTION |
| SMK-153 | Incident owner | assign owner | 15, 17 | named owner | PENDING_EXECUTION |

## Rollback / Stop Worksheet

| Smoke ID | Check | Steps Summary | Mapped Gate | Expected Result | Status |
| --- | --- | --- | --- | --- | --- |
| SMK-160 | Deploy rollback path | document rehearse | 17 | path documented | PENDING_EXECUTION |
| SMK-161 | Env rollback path | no values in evidence | 17 | path documented | PENDING_EXECUTION |
| SMK-162 | Payment fail-closed | unavailable status UX | 9, 17 | checkout blocked | PENDING_EXECUTION |
| SMK-163 | Image non-blocking | story usable without image | 11, 17 | fallback OK | PENDING_EXECUTION |
| SMK-164 | Stop conditions | team briefed | all | accepted | PENDING_EXECUTION |

## Launch Gate Mapping

| Gate | Worksheet Areas | Current Status | Reason | Next Evidence Needed |
| --- | --- | --- | --- | --- |
| 1 | SMK-001–005 | PENDING_EXECUTION | Worksheet only | D6 execution |
| 2 | SMK-003–007 | PENDING_EXECUTION | Worksheet only | D6 validation run |
| 3 | SMK-123, env rows | BLOCKED | No env presence verified | Approved env phase |
| 4 | SMK-120 | PENDING_EXECUTION | No deploy smoke | Target env health |
| 5 | SMK-120–122 | PENDING_EXECUTION | No API smoke run | D6 API checks |
| 6 | SMK-010–024, 040–042 | PENDING_EXECUTION | No frontend smoke | D6 route smoke |
| 7 | SMK-030–033, 070–072 | PENDING_EXECUTION | No auth smoke | D6 auth smoke |
| 8 | SMK-061–063 | PENDING_EXECUTION / BLOCKED | Generation blocked by default | Approved generation smoke |
| 9 | SMK-110–114 | PENDING_EXECUTION / BLOCKED | Billing No-Go | Provider approval |
| 10 | SMK-130–133 | BLOCKED | No live webhook | Post-approval |
| 11 | SMK-090–093 | PARTIAL_EVIDENCE | C2/C3 static only | D6 fallback + optional C5 |
| 12 | SMK-080–084 | PENDING_EXECUTION | No PDF smoke | D6 PDF smoke |
| 13 | SMK-100–105 | PENDING_EXECUTION | No locale smoke | D6 locale smoke |
| 14 | SMK-140–143 | PENDING_EXECUTION / BLOCKED | Legal review pending | Legal gate |
| 15 | SMK-150–153 | BLOCKED | Ops not proven | Ops checklist |
| 16 | All worksheets | PENDING_EXECUTION | Manual smoke not run | D6 execution |
| 17 | SMK-160–164 | PENDING_EXECUTION | Rollback not rehearsed | D6 + deploy phase |
| 18 | All gates | BLOCKED | Critical gaps remain | Final launch review |

No launch-critical gate marked PASS from worksheet creation.

## Manual Smoke Evidence Register

| Smoke ID | Area | Environment | Result | Evidence Type | Owner | Date | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `<SMK-###>` | `<area>` | `<local/staging/production>` | `<PENDING/PASS/FAIL>` | `<exit code / note>` | `<owner>` | `<YYYY-MM-DD>` | `<no secrets>` |

Do not fill with invented execution results in D5.

## Blocker Register

| Blocker | Area | Severity | Current Evidence State | Required Evidence | Recommended Phase |
| --- | --- | --- | --- | --- | --- |
| Manual smoke not executed | QA | Critical | PLANNED | D6 worksheet execution | D6 |
| Production env presence not verified | Env | Critical | BLOCKED | Names-only presence | Env phase |
| Production deploy not executed | Deployment | Critical | BLOCKED | Post-deploy smoke | Post-gate deploy |
| Provider approval pending | Payments | Critical | BLOCKED | KYB package | Payments-Provider-Response |
| Real checkout/webhook not verified | Payments | Critical | BLOCKED | Controlled live smoke | Post-approval |
| Image runtime smoke deferred | Image | Medium | PARTIAL_EVIDENCE | C5 if required | C5 optional |
| Monitoring/incident pending | Ops | High | BLOCKED | Ops checklist | D6 / ops |
| Rollback not proven | Deployment | High | PENDING | Rehearsal | D6 + deploy |
| Privacy/legal final review pending | Legal | High | BLOCKED | Legal artifacts | Legal track |

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
- shell instability
- logs contain tokens/child data

## Pass / Fail Rules

- **PASS** — planned check actually executed later with safe evidence.
- **FAIL** — expected behavior broken or unsafe.
- **BLOCKED** — prerequisites missing.
- **SKIPPED_BY_POLICY** — check requires forbidden/unsafe action (checkout, webhook, provider call, etc.).
- Planning-only entries remain **PENDING_EXECUTION**.

## What Must Not Be Reported Back

- full successful validation logs
- full test/build logs
- env values
- secret screenshots
- request headers
- tokens
- provider payloads
- raw user/child data
- raw production logs

## Recommended Execution Order

1. **D3M-Triage-D6 — Local no-deploy manual smoke run**
2. **D3M-Payments-Provider-Response — KYB/provider approval package**
3. **D3M-Triage-C5 — safe local image runtime smoke** only if image readiness required and explicit approval given
4. **D3M-Final-Launch-Gate-Review**
5. Actual deploy only after explicit approval and launch gates ready

## Recommended Next Phase

- Primary: `D3M-Triage-D6 — Local no-deploy manual smoke run`
- Alternative: `D3M-Payments-Provider-Response — KYB/provider approval package`

## Notes For Next Chat

- D5 is worksheet-only; execute checks in D6 with this document as the runbook.
- Fill Manual Smoke Evidence Register during D6; do not mark gates PASS from planning.
- Full production launch remains **NO-GO**.
