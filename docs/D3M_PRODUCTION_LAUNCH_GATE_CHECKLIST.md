# D3M Production Launch Gate Checklist

## Status

This is a docs-only launch gate checklist.
No production deploy was executed.
No runtime/provider/payment/image/story calls were executed.
No env/secrets were read or modified.

## Purpose

- Consolidate production launch requirements into one gate checklist that is practical, conservative, and evidence-driven.
- Define explicit Go/No-Go conditions before any production launch claim.
- Keep readiness and verification work separated from runtime/provider/deploy execution.

## Current Baseline

- Latest stable commit: `ee49763 Add non-image production readiness triage`
- Last approved baseline expectation before this phase: `## main...origin/main` (clean/aligned state).
- This phase is documentation-only and does not claim runtime readiness.

## Source Availability

Required sources requested for this phase:

- Available:
  - `docs/PROJECT_HANDOFF.md`
  - `docs/CURRENT_PROJECT_STATE.md`
  - `docs/NEXT_CHAT_PROMPT.md`
  - `docs/PRODUCTION_READINESS_CHECKLIST.md`
  - `docs/D3M_NON_IMAGE_PRODUCTION_READINESS_TRIAGE.md`
  - `docs/D3M_IMAGE_RUNTIME_SMOKE_PLAN.md`
  - `docs/D3M_PAYMENT_READINESS_GAP_PROPOSAL.md`
  - `docs/D3M_PAYMENT_READINESS_GAP_IMPLEMENTATION_PLAN.md`
  - `docs/D3M_PAYMENT_PROVIDER_EXTERNAL_VERIFICATION_CHECKLIST.md`
  - `docs/D3M_PAYMENT_TRACK_STATE_RECONCILIATION.md`
  - `docs/D3M_PAYMENT_READINESS_UNAVAILABLE_RUNTIME_SMOKE_RESULTS.md`
- Missing:
  - None.

## Launch Gate Position

- Full production launch: NO-GO.
- Controlled documentation/readiness work: GO.
- Narrow no-secret verification phases: GO.
- Real payment/provider/image/deploy claims: NO-GO until evidence exists.

## How To Use This Checklist

Each gate below must be filled and reviewed using this structure:

- Status: PASS / BLOCKED / PENDING / NOT APPLICABLE
- Evidence:
- Owner/phase:
- Notes:

Rules for usage:

- Do not mark any gate as PASS without clear evidence.
- Evidence must reference command output, document output, or approved verification artifacts.
- If evidence is blocked, status must remain BLOCKED or PENDING.
- Keep runtime/provider/deploy claims out of docs-only phases.

## Global Non-Negotiable Rules

- No secrets in Git.
- No `.env` in screenshots or logs.
- No production deploy without explicit approval.
- No checkout/payment/webhook real calls without explicit approval.
- No provider calls without explicit approval.
- No real child data in tests/smokes.
- No screenshots containing real data.
- No schema/env/package/runtime changes in docs-only phases.
- Every phase starts from a clean working tree.
- Every phase ends with clear `git status` and `git log` output.

## Gate 1 — Repository Hygiene

### Required Evidence

- `git status --short --branch`
- `git log --oneline -8`
- no untracked generated/runtime files
- expected files only for the active phase

### Current Status

- PENDING

### Blockers

- Missing current gate-evidence snapshots for the future launch cut.

### Allowed Next Actions

- Capture fresh git status/log evidence at the start and end of each readiness phase.

### Forbidden Actions

- Ignoring untracked generated artifacts or committing them by accident.

## Gate 2 — Validation / Build / Test Evidence

### Required Evidence

- `.\tooling\validate_phase.ps1`
- `-StrictScope` for docs-only phases
- diff check
- API tests
- full test
- lint
- build
- mojibake scan
- secret scan

### Current Status

- PENDING

### Blockers

- End-to-end launch-cut validation bundle is not yet captured in one final evidence pack.

### Allowed Next Actions

- Run strict docs-only validation for docs phases.
- Run full validation bundle for runtime phases before any launch decision.

### Forbidden Actions

- Marking validation PASS based on assumptions or stale outputs.

## Gate 3 — Environment And Secrets

### Required Evidence

- Presence-only verification (no values) for:
  - API URL
  - frontend URL
  - allowed origins
  - database URLs
  - JWT/auth secrets
  - provider keys
  - payment webhook secrets

### Current Status

- BLOCKED

### Blockers

- Production env presence is not yet verified with no-secret evidence protocol.

### Allowed Next Actions

- Execute a names-only, presence-only verification checklist in a dedicated phase.
- Follow `docs/D3M_DEPLOYMENT_ENV_VERIFICATION_PLAN.md` for safe presence-only protocol and environment separation rules.
- Use `docs/D3M_DEPLOYMENT_ENV_INVENTORY_CHECKLIST.md` as the inventory artifact.
- Use `docs/D3M_PRESENCE_ONLY_ENV_AND_DEPLOYMENT_DRY_RUN_PROTOCOL.md` as the presence-only + dry-run protocol.
- Use `docs/D3M_DEPLOYMENT_READINESS_EXECUTION_PACKET.md` as the execution packet linked to relevant gates.
- Use `docs/D3M_NO_SECRET_DEPLOYMENT_READINESS_EVIDENCE_PASS.md` as D3 no-secret evidence pass; next step is D4 smoke/launch evidence pack.
- Do not mark critical gates PASS without complete evidence; D3 left gates EVIDENCE_PARTIAL/PENDING/BLOCKED only.

### Forbidden Actions

- Requesting, printing, or storing real secret values in chat/docs/logs.

## Gate 4 — Deployment / Hosting

### Required Evidence

- chosen production hosting path
- build command confirmation
- rollback path
- domain/CORS confirmation
- deployment smoke
- no accidental local env leakage

### Current Status

- BLOCKED

### Blockers

- Production deployment verification evidence is not yet collected.

### Allowed Next Actions

- Prepare deployment/env verification plan and dry-run evidence checklist.
- Use `docs/D3M_DEPLOYMENT_ENV_VERIFICATION_PLAN.md` as the deployment/env verification reference.
- Use `docs/D3M_DEPLOYMENT_READINESS_EXECUTION_PACKET.md` for dry-run + execution prep; next step is D3 evidence pass.
- Compact evidence reporting required for future phases (no full passing logs to ChatGPT).

### Forbidden Actions

- Running production deploy or claiming deployment readiness without approved evidence.

## Gate 5 — API / Backend Runtime

### Required Evidence

- health/API availability evidence
- auth-protected route smoke
- no server crash evidence
- safe error responses
- logs review without secrets

### Current Status

- PENDING

### Blockers

- Launch-target API smoke evidence bundle is incomplete.

### Allowed Next Actions

- Execute controlled backend smoke in approved phase with redacted logs.

### Forbidden Actions

- Treating static checks alone as production runtime proof.

## Gate 6 — Frontend Runtime

### Required Evidence

- localized page load smoke
- pricing unavailable behavior
- generate flow smoke
- story detail smoke
- responsive sanity
- no broken image fallback for known surfaces

### Current Status

- PENDING

### Blockers

- Final combined launch smoke coverage is not yet documented as complete.

### Allowed Next Actions

- Run controlled EN/AR/FR frontend smoke pack in dedicated verification phase.

### Forbidden Actions

- Claiming production web readiness from partial or stale smoke evidence.

## Gate 7 — Auth / Authorization / Ownership

### Required Evidence

- protected story routes
- ownership checks
- no query `userId` trust
- child ownership checks
- public sharing intentionally disabled unless share-token design exists

### Current Status

- PENDING

### Blockers

- Production-target manual auth/ownership smoke remains pending.

### Allowed Next Actions

- Run auth/ownership manual smoke with test accounts only.

### Forbidden Actions

- Enabling public sharing behavior without approved design and verification.

## Gate 8 — Child Safety / Content Safety

### Required Evidence

- input safety gate
- output safety gate
- prompt injection tests
- unsafe content categories checks
- no real child data in tests
- manual child-safety smoke pending closure

### Current Status

- PENDING

### Blockers

- Final manual child-safety smoke evidence is still pending for launch gate closure.

### Allowed Next Actions

- Run controlled safety smoke with synthetic non-sensitive content.

### Forbidden Actions

- Using real child data or relaxing safety boundaries for convenience.

## Gate 9 — Payments / Billing / Provider

### Required Evidence

- Lemon/provider external verification pending or blocked state closure
- real checkout verified for approved provider path
- purchase flow verified for approved provider path
- provider approval/KYB/KYC closed
- billing/legal payout path confirmed

### Current Status

- BLOCKED

### Blockers

- Provider external approval and readiness remain unresolved.
- Real checkout/purchase verification for an approved provider does not exist.
- Current unavailable UX is safe but not production billing readiness.

### Allowed Next Actions

- Continue provider/KYB/legal verification and response-package preparation.

### Forbidden Actions

- Treating unavailable-state PASS as payment production readiness.

## Gate 10 — Webhooks / Subscriptions

### Required Evidence

- webhook signature verification exists in tests
- real provider webhook verified
- subscription lifecycle production-proven
- no live webhook calls in docs phases

### Current Status

- BLOCKED

### Blockers

- Real provider webhook and subscription lifecycle evidence is not available.

### Allowed Next Actions

- Keep webhook checks in static/test scope until approved controlled runtime verification.

### Forbidden Actions

- Running live webhook tests in docs-only phases.

## Gate 11 — Image Generation Track

### Required Evidence

- `C2 PASS — no-provider/static regression tests`
- `C3 PASS — generate page fallback`
- `C4 PASS — safe runtime smoke plan`
- `C5 DEFERRED — safe local runtime smoke not executed`
- controlled runtime smoke evidence if image path is launch-critical

### Current Status

- PENDING

### Blockers

- C5 runtime smoke remains deferred; provider-runtime readiness is not proven.

### Allowed Next Actions

- Keep image track conservative; run C5 only after explicit approval and stable environment.

### Forbidden Actions

- Claiming image provider production readiness without runtime evidence.

## Gate 12 — PDF Export

### Required Evidence

- final manual PDF smoke across `en/ar/fr`
- fallback behavior verified
- no layout-breaking regressions in target environment

### Current Status

- PENDING

### Blockers

- Final launch-target manual PDF smoke evidence is not yet complete.

### Allowed Next Actions

- Run focused manual PDF verification using existing regression checklist.

### Forbidden Actions

- Declaring PDF production-ready without final locale smoke evidence.

## Gate 13 — Localization

### Required Evidence

- `en/ar/fr` smoke on:
  - pricing
  - generate
  - story detail
  - auth/errors
  - PDF
  - fallback messages
- mojibake check (must be blocker if present)

### Current Status

- PENDING

### Blockers

- Final integrated localization smoke for launch candidate is pending.

### Allowed Next Actions

- Execute locale smoke pack and encoding sanity checks before launch review.

### Forbidden Actions

- Accepting mojibake/encoding regressions at launch gate.

## Gate 14 — Privacy / Legal / User Data

### Required Evidence

- privacy/terms pages check
- child data minimization review
- delete/export expectations review (if applicable)
- no real data in screenshots/logs
- payment legal/payout path dependency closure

### Current Status

- BLOCKED

### Blockers

- Final legal/payout/privacy closure for production monetization is incomplete.

### Allowed Next Actions

- Perform final privacy/legal review with conservative data-handling evidence.

### Forbidden Actions

- Using real personal/child data in launch evidence artifacts.

## Gate 15 — Monitoring / Logging / Incident Response

### Required Evidence

- production log policy
- error monitoring
- payment webhook monitoring
- provider failure monitoring
- incident rollback process
- no sensitive data logs

### Current Status

- BLOCKED

### Blockers

- Launch-level monitoring and incident-response evidence is not yet documented as complete.

### Allowed Next Actions

- Define minimal monitoring/alerting and incident runbook evidence pack.

### Forbidden Actions

- Launching without clear ownership for incidents and rollback.

## Gate 16 — Manual Smoke Coverage

### Required Evidence

- auth
- generate story
- story detail
- children limits
- pricing unavailable
- PDF export
- localization
- image fallback or image runtime if approved
- deployment smoke

### Current Status

- PENDING

### Blockers

- One final consolidated manual smoke evidence set is not yet present.

### Allowed Next Actions

- Prepare and execute controlled manual smoke pack with redacted evidence.

### Forbidden Actions

- Mixing unapproved runtime/provider calls into docs-only smoke phases.

## Gate 17 — Rollback / Kill Switches

### Required Evidence

- payment disable/availability controls
- provider fallback behavior
- deploy rollback path
- incident owner
- env rollback plan

### Current Status

- PENDING

### Blockers

- Full rollback/kill-switch rehearsal evidence for launch target is pending.

### Allowed Next Actions

- Define and validate rollback/disable procedures in a dedicated readiness phase.

### Forbidden Actions

- Proceeding to launch without rollback ownership and tested paths.

## Gate 18 — Final Go / No-Go Review

### Required Evidence

- All critical gates PASS with explicit evidence references
- Final consolidated risk acceptance decision
- Launch owner sign-off

### Current Status

- BLOCKED

Current: NO-GO

### Blockers

- Multiple critical gates remain BLOCKED/PENDING.

### Allowed Next Actions

- Close critical blockers in order, then re-run final gate review.

### Forbidden Actions

- Declaring GO before critical gates are evidenced and signed off.

## Blocker Register

| Blocker | Gate | Severity | Current Status | Required Evidence | Recommended Phase |
| --- | --- | --- | --- | --- | --- |
| Payment provider external approval/readiness unresolved | Gate 9 | Critical | BLOCKED | Provider eligibility/KYB/KYC and legal payout closure evidence | `D3M-Payments-External-Verification` |
| Real checkout/payment/webhook verification missing | Gate 9, Gate 10 | Critical | BLOCKED | Approved-provider checkout/purchase/webhook controlled smoke evidence | `D3M-Payments-External-Verification` |
| Production env presence not verified safely | Gate 3 | Critical | BLOCKED | Presence-only env verification report (no values) | `D3M-Triage-D4` / approved env phase |
| Production deployment smoke missing | Gate 4, Gate 16 | Critical | BLOCKED | Deployment dry-run + post-deploy smoke bundle | `D3M-Triage-D4` |
| Monitoring/incident response readiness incomplete | Gate 15 | High | BLOCKED | Monitoring policy, alerts, runbook, incident owner evidence | `D3M-Triage-D2` or dedicated ops-readiness phase |
| Image runtime smoke not executed (if image is launch-critical) | Gate 11 | High | PENDING | Approved C5 runtime smoke evidence | `D3M-Triage-C5` (optional/deferred unless required) |
| Final localization/PDF smoke set incomplete | Gate 12, Gate 13, Gate 16 | High | PENDING | Final EN/AR/FR smoke evidence for PDF and fallback paths | Manual smoke pack phase |
| Privacy/legal final review not closed | Gate 14 | High | BLOCKED | Privacy/legal/payout final review artifacts | Payment/legal verification path |

## Evidence Register Template

| Gate | Evidence Item | Command / Source | Result | Date | Notes |
| --- | --- | --- | --- | --- | --- |
| `<Gate #>` | `<What was verified>` | `<Command or doc path>` | `<PASS/BLOCKED/PENDING>` | `<YYYY-MM-DD>` | `<Redacted notes only>` |

## Recommended Closure Order

1. `D2 — Deployment/env verification plan.` (complete)
2. `D2-A — Deployment/env inventory checklist.` (complete)
3. `D2-BC — Presence-only env protocol + deployment dry-run checklist.` (complete)
4. `D2-D — Deployment readiness execution packet.` (complete; see `docs/D3M_DEPLOYMENT_READINESS_EXECUTION_PACKET.md`)
5. `D3 — No-secret deployment readiness evidence pass.` (complete; see `docs/D3M_NO_SECRET_DEPLOYMENT_READINESS_EVIDENCE_PASS.md`)
6. `D4 — Production smoke and launch evidence pack.`
7. Payment provider external approval / response package.
8. Final launch gate review.

Image `C5` runtime smoke remains optional/deferred unless image runtime proof is required for launch decision.

## Recommended Next Phase

- Primary: `D3M-Triage-D4 — Production smoke and launch evidence pack`
- Alternative: `D3M-Payments-Provider-Response — KYB/provider approval package`

## Notes For Next Chat

- Use this checklist as the central Go/No-Go reference and update gate statuses only with explicit evidence.
- Keep docs-only safety boundaries unless a phase explicitly approves runtime/provider/deploy execution.
- Do not convert any critical gate to PASS from assumptions or historical memory without fresh evidence linkage.
