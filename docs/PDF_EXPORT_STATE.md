# PDF Export State

## Source of Truth

- Core file: `apps/web/src/lib/exportStoryPdf.ts`
- Trigger points:
  - `apps/web/src/app/[locale]/generate/page.tsx`
  - `apps/web/src/app/[locale]/story/[id]/page.tsx`
- Manual validation checklist:
  - `docs/PDF_EXPORT_REGRESSION_CHECKLIST.md`

## Current Behavior (code-level)

- Uses `jsPDF` for document composition.
- Uses `html2canvas` for story body and moral-box styled blocks.
- Uses Canvas2D for:
  - title rendering
  - byline rendering (RTL-safe centered caption)
- Arabic-specific PDF normalization path exists before body rendering:
  - short one-sentence block detection/regrouping into more natural paragraphs.
- Long text split safety exists to reduce clipping risk:
  - language-aware chunk sizes (`MAX_BLOCK_CHARS_AR`, `MAX_BLOCK_CHARS_LTR`).
- Image path:
  - timeout-based loading
  - rounded render on success
  - fallback box on failure.

## Performance Instrumentation

`exportStoryPdf.ts` includes dev-only `[PDF_PERF]` metrics (no story content logging), including:

- `totalExportMs`
- `language`
- `isRtl`
- `hasImageUrl` (boolean only)
- `storyBlockCount`
- `pageCount`
- `logoRenderMs`
- `imageLoadRenderMs`
- `titleRenderMs`
- `bylineRenderMs`
- `paragraphRenderTotalMs`
- `maxSingleParagraphRenderMs`
- `paragraphRenderCallCount`
- `paragraphBatchCount`
- `bodyBatchRenderTotalMs`
- `averageParagraphBatchMs`
- `pdfSaveMs`

## Recent History Markers (PDF path)

- `7cd392c` â€” switched generate-page export to `exportStoryPdf`
- `ff60abd` â€” text block normalization + clipping protection
- `81aaa47` â€” resilient image loading/fallback
- `33472e1` â€” manual PDF regression checklist added
- `7521589` / `53c0f61` / `639e8f2` â€” typography + RTL/byline/paragraph cadence fixes
- `3cdd104` â€” body batching optimization

## Safe Change Rules for Future Work

- Do not regress Arabic RTL shaping/correctness.
- Do not remove byline/title Canvas2D paths without explicit replacement proof.
- Do not bypass image timeout/fallback safety.
- Do not log story content/child names/URLs/secrets in perf logs.
- Keep manual checklist aligned with actual behavior when changing PDF logic.
