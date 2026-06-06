# D3M Image Fallback Hardening Plan

## Status

- Phase: `D3M-Triage-C1 — Image generation fallback hardening plan`
- Type: docs-only planning
- Runtime/provider/API calls executed in this phase: `NO`
- Runtime code changed in this phase: `NO`

## Related Documents

- `docs/D3M_IMAGE_GENERATION_TRIAGE.md`
- `docs/CURRENT_PROJECT_STATE.md`
- `docs/PRODUCTION_READINESS_CHECKLIST.md`
- `docs/PRIVACY_DATA_SAFETY_INVENTORY.md`
- `docs/PDF_EXPORT_REGRESSION_CHECKLIST.md`
- `docs/D3M_SMOKE_FAILURE_TRIAGE.md`
- `docs/D3M_MANUAL_SMOKE_RUN_RESULTS.md`

## Problem Summary

- Image generation currently depends on external provider availability and verification success.
- Story creation must stay successful even when image generation fails.
- Fallback behavior is not fully uniform across backend/frontend/PDF surfaces.
- Automated no-provider/static regression coverage for image flow is currently limited.
- Production image readiness cannot be claimed from current evidence.

## Current Confirmed Image Flow

1. `POST /api/stories/generate` creates the story first with `imageUrl: null`.
2. Story response is returned immediately after `prisma.story.create`.
3. Image generation is executed asynchronously later via `generateStoryImage(...)`.
4. If image generation returns a URL, story row is updated with `imageUrl`.
5. If image generation fails or verification fails, story remains created and usable without image.

## Hardening Principles

- Preserve non-blocking story creation behavior.
- Fail closed for image generation: safe fallback instead of route failure.
- Keep provider calls out of tests by default.
- Prefer deterministic static/no-provider tests before runtime smoke.
- Keep user-facing copy safe and non-technical.
- Minimize child-linked prompt content and log exposure.
- Do not claim provider moderation guarantees without explicit evidence.

## Backend Hardening Plan

- Keep current contract unchanged:
  - story creation succeeds with `imageUrl: null`,
  - async image generation may update later,
  - image failure never blocks story creation.
- Add unit-level coverage for `generateStoryImage()` with no external provider calls:
  - mock/fake `fetch` responses for success, timeout/abort, non-2xx, and non-image `content-type`,
  - assert verification behavior (`IMAGE_VERIFY_TIMEOUT_MS`, `image/` content-type gate),
  - assert failures return `null` safely.
- Add static/logging guardrails:
  - ensure no full image prompt logging,
  - ensure no child-sensitive raw prompt leakage in normal logs,
  - keep error messages safe and bounded.

## Async Image Update Plan

- Add regression guard(s) to lock async order and isolation:
  - `prisma.story.create` occurs before async image branch,
  - route returns success response without waiting on provider result,
  - image update failure does not alter original response,
  - image update failure does not delete/rollback story,
  - image update failure does not convert generate route into failure.
- Add static safety assertions for log hygiene:
  - no secrets in logs,
  - no full prompt/body dumps in async failure paths.

## Frontend Fallback Plan

- Keep and verify existing fallback behavior where already present.
- Align fallback UX language and visuals across story surfaces as much as practical.
- Keep fallback messaging localizable and safe (no technical provider details).

## Generate Page Fallback Plan

- Current state from triage:
  - image displays when `story.imageUrl` exists,
  - explicit `onError` fallback behavior is not currently confirmed on generate page.
- Later safe code phase goal:
  - add explicit image load-error fallback on `generate/page`,
  - avoid broken image visual state,
  - keep behavior consistent with story detail/card fallback style.

## Story Detail And Card Fallback Plan

- Current state from triage:
  - `story/[id]/page.tsx` uses `imgError` + `onError` fallback,
  - `StoryCard.tsx` uses `imgError` + `onError` fallback.
- Later hardening goal:
  - keep these fallbacks stable and covered by static/regression checks,
  - unify fallback copy and visual behavior where feasible.

## PDF Export Fallback Plan

- Current state from triage:
  - `exportStoryPdf.ts` includes resilient image load timeout path and fallback box behavior,
  - handles missing/broken/CORS/timeouts without crashing export.
- Later hardening goal:
  - keep current fallback behavior intact,
  - add focused static/regression checks where practical (no provider image dependency),
  - avoid any provider runtime call in this test phase.

## Safety And Privacy Guardrails

- Minimize child-linked details sent to external image provider prompts.
- Keep "no child face/portrait" constraint in prompt policy.
- Keep image prompts children-story-safe.
- Do not log full prompts or child-sensitive prompt payloads.
- Do not run provider calls in automated tests.
- Do not claim provider moderation guarantees without direct evidence.
- Any later runtime smoke must be controlled, minimal, and avoid secret exposure in logs/output.

## No-Provider Test Plan

- Add backend unit tests for image service using mocked/fake `fetch`.
- Validate these cases without external network:
  - verified image response (`2xx` + `content-type: image/*`) returns URL,
  - non-image content-type returns `null`,
  - non-2xx response returns `null`,
  - timeout/abort returns `null`,
  - thrown error returns `null`.
- Add route-level tests (or static assertions) that image failure does not fail story generation path contract.

## Static Regression Test Plan

- Expand static regression coverage around `stories.ts` and related image path decisions:
  - create-first-then-async pattern remains intact,
  - async failure branch remains non-blocking,
  - no accidental sync wait on image provider before response.
- Add static checks for generate-page fallback presence once implemented in later phase.
- Add static checks to preserve story-detail/card fallback behavior.
- Add focused PDF fallback regression checks where feasible without external image calls.

## Future Safe Runtime Smoke Plan

- Runtime smoke must be planned as a separate controlled phase after static/no-provider tests.
- Runtime smoke must be minimal and explicitly constrained:
  - no secret printing,
  - no uncontrolled provider stress calls,
  - no production readiness claim from a single run.
- Runtime smoke should validate only agreed acceptance criteria for fallback behavior.

## Files Expected In Later Code Phase

- `services/api/src/services/image.service.ts`
- `services/api/src/routes/stories.ts`
- `services/api/src/routes/stories.security-regression.test.ts`
- `apps/web/src/app/[locale]/generate/page.tsx`
- `apps/web/src/app/[locale]/story/[id]/page.tsx`
- `apps/web/src/components/StoryCard.tsx`
- `apps/web/src/lib/exportStoryPdf.ts`
- `apps/web/messages/en.json`
- `apps/web/messages/ar.json`
- `apps/web/messages/fr.json`

## Files Explicitly Out Of Scope Now

- All runtime code and test changes in this phase.
- Provider/API runtime execution.
- Story/image generation runtime execution.
- Schema/migration/env/deployment changes.

## Acceptance Criteria For Later Code Phase

- Story creation succeeds when image generation fails.
- Async image failure does not alter initial success response.
- `generate/page` has explicit image-load fallback behavior.
- Story detail/card fallback remains stable.
- PDF export fallback remains stable for missing/broken image cases.
- No-provider/static image tests exist and pass.
- No tests require Pollinations/provider calls.
- Logging and prompts satisfy safety/privacy guardrails.

## Rollback / Revert Plan

- Keep future image hardening changes isolated and incremental.
- If fallback hardening causes regressions:
  - revert only the latest image-hardening patch set,
  - preserve baseline non-blocking story creation behavior,
  - keep previous stable fallback paths active.
- Do not rollback unrelated payment/entitlement phases due to image-only regressions.

## Risks

- External provider reliability remains variable.
- UX inconsistency risk persists until generate-page fallback is explicitly hardened.
- Safety/privacy risk persists until prompt minimization and log guardrails are regression-tested.
- Runtime smoke can create false confidence if not tightly scoped.

## Open Decisions

- Exact fallback copy harmonization strategy across generate/detail/card/PDF.
- Preferred balance between unit tests and static regression tests for async branch guarantees.
- Whether additional prompt-minimization rules should be enforced in code or policy docs first.

## Recommended Next Phase

1. `D3M-Triage-C2 — Add no-provider/static image regression tests`
2. `D3M-Triage-C3 — Implement generate-page image fallback polish`
3. `D3M-Triage-C4 — Safe image runtime smoke plan`
4. `D3M-Triage-C5 — Controlled image runtime smoke`
