# Current Project State

## Stack Snapshot

- Package manager/workspace: `pnpm` + `pnpm-workspace.yaml`
- Task runner: `turbo` (`turbo.json`)
- Frontend: Next.js 14, TypeScript (`apps/web`)
- Backend: Express + TypeScript (`services/api`)
- ORM/database: Prisma + PostgreSQL
- Shared types/config: `packages/types`, `packages/config`

## Current Focus Areas in Code

- PDF export implementation: `apps/web/src/lib/exportStoryPdf.ts`
  - Canvas2D title + byline rendering
  - Arabic PDF block normalization/regrouping path
  - html2canvas body rendering with batching/perf instrumentation
- Story generation reliability + normalization:
  - `services/api/src/services/mistral.service.ts`
  - `services/api/src/services/mistral.service.test.ts`
- Story image resilience:
  - backend URL verification: `services/api/src/services/image.service.ts`
  - frontend fallback rendering:
    - `apps/web/src/components/StoryCard.tsx`
    - `apps/web/src/app/[locale]/story/[id]/page.tsx`
- Safety and API security checks:
  - `services/api/src/services/safety.service.ts`
  - `services/api/src/routes/stories.security-regression.test.ts`

## Latest Confirmed PDF Export State (from git history)

Recent PDF commits indicate:

- `53c0f61` â€” Phase 3E-C: RTL caption/paragraph grouping improvements
- `639e8f2` â€” Phase 3E-F: Arabic byline + paragraph grouping repair
- `3cdd104` â€” Phase 3F-A: PDF body batching optimization

Manual regression process and acceptance criteria are documented in:
- `docs/PDF_EXPORT_REGRESSION_CHECKLIST.md`

## Operational Next Action

1. Verify git state and working tree:
   - `git status -sb`
   - `git diff --check`
2. Verify repo health:
   - `pnpm test`
   - `pnpm lint`
   - `pnpm build`
3. If local app + env is already configured, do one manual smoke:
   - generate one story
   - export one PDF and confirm basic integrity

## Constraints to Keep

- Never print/request secrets (keys, URLs, tokens, credentials).
- No schema/migration/deployment changes unless explicitly approved.
- Preserve Arabic RTL PDF correctness.
- Preserve current PDF export performance improvements unless explicitly re-scoped.
