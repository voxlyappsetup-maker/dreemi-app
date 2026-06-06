# D3M Image Generation Triage

## Status

- Phase: `D3M-Triage-C — Image generation triage`
- Type: docs-only triage
- Runtime/provider/API calls executed in this phase: `NO`

## Why This Triage Exists

- Prior manual smoke evidence recorded image-generation failure as a separate non-D3K blocker.
- The current phase documents real code-path behavior and risks before any fix phase.
- This triage is read-only for runtime code and provider behavior.

## Current Git Baseline

- Baseline status at start: `## main...origin/main`
- Baseline head commit: `68cf6d9 Document D3M payment readiness unavailable smoke results`

## Scope

- Map current image-generation flow end-to-end.
- Identify Pollinations/provider boundary and runtime ownership.
- Identify fallback, timeout, verification, and error-handling behavior.
- Identify safety/privacy concerns for child-linked image prompts.
- Identify test coverage gaps.
- Propose next docs-first/implementation phases only.

## Read-Only Files Reviewed

- `services/api/src/services/image.service.ts`
- `services/api/src/routes/stories.ts`
- `services/api/src/routes/stories.security-regression.test.ts`
- `apps/web/src/lib/api.ts`
- `apps/web/src/app/[locale]/generate/page.tsx`
- `apps/web/src/app/[locale]/story/[id]/page.tsx`
- `apps/web/src/components/StoryCard.tsx`
- `apps/web/src/lib/exportStoryPdf.ts`
- `apps/web/messages/en.json`
- `apps/web/messages/ar.json`
- `apps/web/messages/fr.json`
- `prisma/schema.prisma`
- `packages/types/src/index.ts`
- `docs/D3M_SMOKE_FAILURE_TRIAGE.md`
- `docs/D3M_MANUAL_SMOKE_RUN_RESULTS.md`
- `docs/PDF_EXPORT_REGRESSION_CHECKLIST.md`
- plus baseline docs listed in phase prompt.

## Current Image Generation Flow

1. Story generation endpoint (`POST /api/stories/generate`) validates input and applies input safety checks.
2. Backend calls text generation (`generateStoryWithMistral`) and applies output safety checks.
3. Story is persisted immediately with `imageUrl: null`.
4. API returns `201` with story payload before image generation completes.
5. Backend asynchronously calls `generateStoryImage(...)`.
6. If image URL is returned, backend updates the same story row with `imageUrl`.
7. Frontend surfaces (`generate`, `story detail`, `StoryCard`) display image when `imageUrl` exists; otherwise they show visual fallback UI.

## Pollinations / Provider Boundary

- Provider call construction is in backend only:
  - `services/api/src/services/image.service.ts`
  - URL pattern uses `https://image.pollinations.ai/prompt/...`
- Provider is not called directly from frontend for generation.
- Frontend consumes `story.imageUrl` returned from backend/database.
- PDF export path (`apps/web/src/lib/exportStoryPdf.ts`) does client-side image loading for rendering when `imageUrl` exists.

## Backend Findings

- Image prompt is generated in backend (`buildImagePrompt`) with:
  - story scene text (`storyContent` excerpt up to 300 chars),
  - style by age,
  - explicit "No text, no child portrait" / "Do NOT show a child's face or portrait" guidance.
- URL verification exists (`verifyImageUrl`):
  - finite timeout (`15_000ms`),
  - checks HTTP success and `content-type` starts with `image/`.
- Verification fetch body is canceled immediately after header check.
- If verification fails, function returns `null` without throwing.
- Story flow is non-blocking for image generation:
  - image failure does not roll back story creation.
- Logging behavior:
  - generic success/failure logs exist.
  - prompt text is not logged directly in `image.service.ts`.
  - route-level image failure logs include error message text; possible provider-derived error detail in message is not fully ruled out in this triage.

## Frontend Findings

- Frontend generation uses backend endpoint only (`generateStory` via `api.ts`).
- `generate` page displays image only if `story.imageUrl` exists; no explicit onError fallback there.
- Story detail page has image render fallback:
  - local `imgError` state + `onError` handler.
  - falls back to local placeholder UI when image load fails.
- Story card has similar fallback:
  - `imgError` + `onError`, then icon placeholder.
- PDF export has robust fallback behavior:
  - image load timeout (`10_000ms`),
  - fallback box rendering if URL missing/broken/CORS/timeout/canvas draw failure.

## Database / Persistence Findings

- Persistence model stores URL only:
  - `Story.imageUrl String?` in `prisma/schema.prisma`.
- No binary image blob storage in DB found in this triage.
- Story is created first with `imageUrl: null`, then optionally updated asynchronously.

## Fallback And Error Handling Findings

- Backend generation fallback:
  - returns `null` on image-generation/verification failure.
- Story creation fallback:
  - story still succeeds and is returned even if image generation fails.
- Frontend UI fallback:
  - strong fallback in story detail and story card.
  - generate page does not include explicit `onError` for image element.
- PDF fallback:
  - explicit placeholder box and no technical leakage by design.

## Timeout / Verification Findings

- Backend provider verification timeout: `15s`.
- Backend verification checks content-type prefix `image/`.
- Frontend PDF image load timeout: `10s`.
- Runtime behavior of external provider under slow/error conditions is not confirmed in this triage.

## Safety Findings

- Story route applies text safety gates pre- and post-generation (`checkSafety`).
- Static tests confirm these text safety gate orderings.
- Image-specific moderation gate beyond prompt wording constraints is not confirmed in this triage.
- Image prompt includes child-linked context and scene content; child-safety risk remains relevant for external image outputs.
- Whether provider consistently honors "no child face/portrait" constraints is not confirmed in this triage.

## Privacy / Data Handling Findings

- Image provider request includes derived story context and may include child-linked details via scene text.
- Backend does not store image binary; it stores `imageUrl`.
- Direct secret usage in image generation path is not confirmed in this triage.
- Prompt redaction policy for image-provider telemetry/logging at provider side is not confirmed in this triage.
- No runtime provider call was executed here, so real outbound payload observation is not confirmed in this triage.

## Test Coverage Findings

- No dedicated unit/integration tests found for:
  - `services/api/src/services/image.service.ts`,
  - async image-update branch in `stories.ts`.
- Existing static regression test (`stories.security-regression.test.ts`) focuses on auth/rate-limit/safety and does not assert image-path behavior.
- PDF checklist includes manual cases for image/fallback behavior, but this is manual process documentation rather than automated test coverage.

## Known Gaps

- End-to-end image generation success/failure runtime behavior with provider is not confirmed in this triage.
- Generate-page image element fallback on load error is not confirmed to be explicit.
- Image-specific safety moderation beyond prompt constraints is not confirmed in this triage.
- Potential leakage scope of provider error messages in logs is not fully confirmed in this triage.
- Automated regression tests for backend image path are not confirmed in this triage.

## Risk Review

- **Reliability risk:** image provider unavailability can produce stories without images.
- **UX consistency risk:** fallback behavior differs across surfaces (generate vs detail/card/PDF).
- **Safety risk:** child-linked prompt context sent to external provider without image-specific moderation layer confirmed.
- **Privacy risk:** external provider receives derived story context; retention/processing guarantees are not confirmed here.
- **Verification risk:** current confidence depends on static inspection and prior manual notes, not controlled runtime smoke in this phase.

## Non-Goals

- No runtime code fixes.
- No provider/API/image generation calls.
- No story-generation runtime execution.
- No schema/env/deployment changes.
- No production-readiness claim for image generation.

## Recommended Next Phases

1. `D3M-Triage-C1 — Image generation fallback hardening plan`
2. `D3M-Triage-C2 — No-provider/static image generation regression tests`
3. `D3M-Triage-C3 — Safe image runtime smoke plan`
4. `D3M-Triage-C4 — Image UX fallback/localization polish`

Guardrails for all next phases:

- No secret printing or env leakage.
- No provider behavior claims without explicit controlled smoke evidence.
- Child-safety and prompt-minimization requirements must be explicit in acceptance criteria.
