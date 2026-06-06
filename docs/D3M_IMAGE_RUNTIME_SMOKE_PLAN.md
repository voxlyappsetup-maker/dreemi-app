# D3M Image Runtime Smoke Plan

## Status

- Phase: `D3M-Triage-C4 — Safe image runtime smoke plan`
- Type: planning-only (docs-only)
- No runtime smoke was executed in this phase.
- No Pollinations call was made.
- No image generation call was made.
- No story generation call was made.
- No provider call was made.

## Purpose

- Define a conservative, privacy-safe, and user-approved runtime smoke plan for the image path.
- Validate that image failures stay non-blocking for story usability.
- Validate fallback behavior consistency across UI surfaces.
- Define evidence and stop criteria before any runtime execution phase.

## Current Baseline

- `D3M-Triage-C2` added no-provider/static image regression tests in `services/api/src/routes/stories.security-regression.test.ts`.
- `D3M-Triage-C3` added explicit generate-page image `onError` fallback and localized fallback copy.
- Backend creates story first with `imageUrl: null` (`services/api/src/routes/stories.ts`), then runs async image generation.
- Async image generation is handled via `generateStoryImage(...)` and update path is non-blocking.
- Image failure must remain non-blocking for reading/exporting the story.
- Frontend/PDF fallback coverage now exists in:
  - generate page (`apps/web/src/app/[locale]/generate/page.tsx`)
  - story detail (`apps/web/src/app/[locale]/story/[id]/page.tsx`)
  - story card (`apps/web/src/components/StoryCard.tsx`)
  - PDF export fallback path (`apps/web/src/lib/exportStoryPdf.ts`)
- This baseline does **not** claim provider runtime reliability or production-ready image provider behavior.

## Explicit Non-Goals

- No payment or purchase testing.
- No webhook testing.
- No production deploy.
- No provider approval workflow.
- No guarantee of Pollinations quality/reliability.
- No load/stress testing.
- No tests with real children or real personal data.
- No claims of provider moderation guarantees beyond current app-level controls.

## Safety Boundaries

- Use only safe, generic, non-sensitive prompts.
- Do not use real child names.
- Do not use real child photos/faces.
- Do not enter personal identifiers.
- Do not enter sensitive content.
- Avoid repetitive calls that may look like provider abuse.
- Stop immediately on unexpected behavior.

## Privacy Boundaries

- No secrets in logs.
- No `.env` values in screenshots/reports/commits.
- No API keys or tokens in evidence.
- No public sharing of child identifiers.
- Do not include full prompt text in reports if it contains sensitive details.
- Do not upload screenshots with real account/private data.

## Provider Boundaries

- Pollinations is the current external provider boundary for image generation.
- Any future smoke must be limited, intentional, and explicitly approved.
- This project does not provide provider reliability guarantees.
- Provider failure must not block story creation or reading.
- Automated tests remain no-provider/static by design.

## Preconditions Before Any Runtime Smoke

- Working tree is clean.
- Local branch is aligned with `origin/main`.
- Validation helper is PASS.
- Local dev environment is known and stable.
- No unrelated payment/provider/env/schema changes are present.
- No secrets are printed in terminal/logs.
- Test account only.
- Safe non-sensitive prompt prepared.
- Stop conditions defined before run.
- Explicit user approval is granted for runtime smoke execution.

## Required Environment Assumptions

- API runtime target is known (local vs hosted) before execution.
- Web app runtime target is known (local vs hosted) before execution.
- It is known whether image provider env/config is required in that environment.
- DB target is known (local vs non-local) and approved for smoke use.
- Smoke scope is explicitly local-only unless user approves otherwise.
- A test account is available and used exclusively.

## Smoke Scope

1. Image unavailable/failure path.
2. Image success path only if explicitly allowed and safe.
3. Generate page fallback validation.
4. Story detail fallback/success validation.
5. StoryCard fallback/success validation.
6. PDF export fallback validation.
7. Logs review for sensitive-data leakage prevention.

## Smoke Matrix

| Case | Setup | Action | Expected Result | Evidence | Allowed? |
| --- | --- | --- | --- | --- | --- |
| Image failure non-blocking | Test account + safe prompt | Run one controlled generate flow in approved env | Story is created/readable even if image fails | API/UI observation + filtered log snippet | Yes (future C5 only) |
| Image success (optional) | Test account + safe prompt + explicit approval | Run one controlled generate flow | Story remains readable and image appears when provider succeeds | UI observation + filtered log snippet | Conditional |
| Generate page fallback | Simulated/observed failed image load state | Open generate result view | No broken image; fallback placeholder appears | Screenshot (sanitized) | Yes (future C5 only) |
| Story detail fallback | Story with missing/broken image URL | Open story detail page | Fallback branch shown, no crash | Screenshot (sanitized) | Yes (future C5 only) |
| StoryCard fallback | Story list includes missing/broken image URL | Open dashboard/card list | Fallback icon card shown | Screenshot (sanitized) | Yes (future C5 only) |
| PDF fallback | Story with missing/broken image URL | Export PDF once | PDF export succeeds with illustration fallback block | PDF output check + log summary | Yes (future C5 only) |
| Sensitive log leakage check | Same run context | Review filtered logs after smoke | No secrets, no private identifiers, no full sensitive prompt dump | Redacted evidence note | Yes (future C5 only) |

## Manual Smoke Steps

1. Confirm clean git status.
2. Run validation helper and confirm PASS.
3. Start local API/web using existing project commands already approved in project workflow.
4. Use a test account only.
5. Use one safe non-sensitive prompt.
6. Observe whether story creation/display remains available even if image is delayed/unavailable.
7. Verify fallback behavior in generate/story/card/pdf surfaces.
8. Stop local processes.
9. Capture minimal sanitized evidence with no secrets/private data.

## Expected Evidence

- API response observation without secrets.
- UI behavior observation notes.
- Sanitized screenshots only when needed.
- Filtered log snippets (no sensitive payloads).
- `git status` clean after smoke.
- No unexpected file changes.

## Pass Criteria

- Story text is generated or displayed as expected.
- Image failure does not block story usability.
- Fallback appears when image fails.
- Image appears only when provider succeeds.
- No secrets are printed.
- No unexpected files are changed.
- No payment/provider-unrelated route behavior is touched.
- Validation stays PASS after any allowed docs updates.

## Fail Criteria

- Image failure blocks story experience.
- UI shows broken image state without fallback.
- Prompt/private child data appears in logs.
- Any secret appears in logs/output.
- Unexpected files are changed.
- App crash or unrecoverable UI break.
- Provider technical error details leak directly to end user.

## Stop / Rollback Conditions

- Unexpected provider behavior.
- Repeated unstable failures.
- Any privacy concern during run.
- Sensitive data appears in logs.
- Unexpected repository/file changes.
- Dev server instability that invalidates evidence.
- Any accidental payment/env/schema touch.

## What Must Not Be Logged

- API keys.
- Database URLs.
- JWTs.
- User tokens.
- Real child names/IDs.
- Full prompts containing sensitive context.
- Provider raw URLs if they contain sensitive query data.
- `.env` contents.

## What Must Not Be Committed

- Screenshots with private data.
- Logs containing secrets.
- Generated runtime outputs not intended for source control.
- `.env` files.
- Build artifacts.
- Temporary debug files.
- Local runtime config snapshots.

## Follow-Up Decisions

- Runtime smoke execution requires an explicit next phase and explicit user approval:
  - `D3M-Triage-C5 — Execute safe local image runtime smoke`
- If provider runtime smoke is deferred, continue non-image readiness track:
  - `D3M-Triage-D — continue non-image production readiness track`

## Recommended Next Phase

- `D3M-Triage-C5 — Execute safe local image runtime smoke` (only with explicit approval)
- Alternative: `D3M-Triage-D — Continue non-image production readiness track`
