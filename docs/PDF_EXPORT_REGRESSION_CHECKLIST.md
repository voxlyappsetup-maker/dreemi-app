# PDF Export Regression Checklist

## Purpose

This document defines the manual regression checklist for the Dreemi PDF export feature.
PDF visual quality cannot be verified by TypeScript compilation, linting, or unit tests alone.
This checklist must be run by a human tester before any release that touches:

- `apps/web/src/lib/exportStoryPdf.ts`
- `apps/web/src/app/[locale]/generate/page.tsx`
- `apps/web/src/app/[locale]/story/[id]/page.tsx`
- Any component imported by the above files
- Any dependency version bump for `jspdf` or `html2canvas`

---

## Scope

| In scope | Out of scope |
|---|---|
| PDF file is generated and saved without errors | Server-side rendering of stories |
| Arabic, English, and French text renders correctly | Story generation (Mistral API) |
| Page breaks do not clip text | Payment and subscription flows |
| Story image renders or shows a fallback | Mobile browser compatibility (secondary) |
| Fallback box appears for broken/missing images | Screen reader accessibility of the PDF |
| No empty pages are created | PDF/A compliance |
| Title is fully visible and not clipped | |
| Moral box renders at end of story | |

---

## Preconditions

Before running any test case:

1. The local development server must be running:
   ```
   pnpm dev
   ```
2. You must be logged in to the app with a test account that has at least one saved story.
3. The automated checks must all pass first. Run these in order from the repo root:
   ```
   pnpm --filter @dreemi/api test
   pnpm lint
   pnpm build
   ```
4. If any automated check fails, stop and fix it before manual testing.
5. Use a real browser (Chrome or Edge recommended - Firefox has minor Canvas2D font differences).
6. Have a PDF viewer ready (browser built-in or a standalone viewer).
7. Prepare at least one story in Arabic, one in English, and one in French.
8. Prepare one story with a valid image URL and one story that can be tested with a broken image URL (see TC-09 and TC-10 below).

---

## Required Commands

Run all of the following from the repo root before manual testing:

```bash
# API unit tests (74 tests: 46 safety + 28 security regression)
pnpm --filter @dreemi/api test

# Root-level test alias (same as above via turbo)
pnpm test

# Linting
pnpm lint

# Production build
pnpm build
```

All four commands must exit with code 0 before you proceed.

---

## Manual Test Matrix

For each test case, mark the result as **PASS**, **FAIL**, or **SKIP** (with reason).

---

### TC-01 - Arabic PDF from Generate page

**Steps:**
1. Go to `/ar/generate`.
2. Fill in child details in Arabic (name, age).
3. Generate a story with an Arabic theme (e.g. "الغابة السحرية").
4. Click "تصدير PDF" once the story appears.
5. Open the downloaded PDF.

**Pass criteria:**
- PDF downloads without an error toast or JS console error.
- Arabic text is fully shaped (letters connect correctly, no isolated characters).
- Text direction is right-to-left.
- Title appears at the top, fully visible, not clipped.
- By-line ("قصة لـ [name]") appears below the title.
- Paragraphs have correct RTL alignment.
- Moral box (if present) appears at the end.
- Footer shows `dreemi.app | 1`.

---

### TC-02 - Arabic PDF from Story detail page

**Steps:**
1. Go to `/ar/dashboard`, click on a saved Arabic story.
2. Click "تصدير PDF" on the story detail page.
3. Open the downloaded PDF.

**Pass criteria:** Same as TC-01.
Additionally: the PDF content matches the story text shown on screen.

---

### TC-03 - English PDF from Generate page

**Steps:**
1. Go to `/en/generate`.
2. Generate a story in English (e.g. theme "a brave little fox").
3. Click "Export PDF".
4. Open the downloaded PDF.

**Pass criteria:**
- PDF downloads without error.
- Latin text is readable, left-to-right.
- Title is fully visible, not clipped.
- By-line ("A story for [name]") appears.
- Paragraphs are properly left-aligned.
- No Arabic character artifacts appear in the Latin story.
- Moral box (if present) appears at the end.

---

### TC-04 - French PDF from Generate page

**Steps:**
1. Go to `/fr/generate`.
2. Generate a story in French (e.g. theme "une foret magique").
3. Click "Exporter PDF".
4. Open the downloaded PDF.

**Pass criteria:** Same as TC-03. Verify accented characters (e, e, u, a) render correctly.

---

### TC-05 - Long story with multiple pages

**Steps:**
1. Generate or open a story that is long enough to span at least two PDF pages (use the 10-minute duration option if available).
2. Export as PDF.
3. Check every page break.

**Pass criteria:**
- No paragraph is cut horizontally at a page boundary (text never splits mid-line).
- Each page has a header (Dreemi logo) and a footer (URL + page number).
- No page is completely blank.
- Content order matches the original story text exactly.

---

### TC-06 - Single newline preserved as line break

**Steps:**
1. Find or manually create a story whose content contains a single newline between two sentences within the same paragraph (e.g. "Sentence one.\nSentence two.").
2. Export as PDF and open.

**Pass criteria:**
- Both sentences appear on separate lines within the same visual paragraph block.
- There is no extra vertical gap between them (no paragraph-level spacing).
- They are not rendered as two completely separate paragraphs.

---

### TC-07 - Double newline treated as paragraph break

**Steps:**
1. Find or create a story with a double newline between two paragraphs (e.g. "Paragraph one.\n\nParagraph two.").
2. Export as PDF and open.

**Pass criteria:**
- The two paragraphs are visually separated by a clear gap.
- They are rendered as two distinct blocks, not a single continuous block.

---

### TC-08 - Valid image renders correctly

**Steps:**
1. Generate a story that includes a Pollinations.ai story image (most generated stories have one).
2. Export as PDF.

**Pass criteria:**
- Image appears near the top of the first page, centred.
- Image has rounded corners.
- A thin violet border is visible around the image.
- Image aspect ratio is not distorted.
- No "Story illustration unavailable" box appears.

---

### TC-09 - Missing image URL shows no fallback box

**Steps:**
1. Export a PDF for a story that has no image (e.g. a story saved before image generation was available, or one where image generation failed).

**Pass criteria:**
- PDF generates successfully.
- No "Story illustration unavailable" box appears.
- The title and content follow immediately after the header with normal spacing.
- No JavaScript error is thrown.

---

### TC-10 - Broken image URL shows fallback box

**Steps:**
1. Temporarily create a test story or modify the export call (in a throwaway test build only, do not commit) to pass a deliberately broken image URL such as `https://example.invalid/test.png`.
2. Export as PDF and open.

**Pass criteria:**
- PDF downloads successfully (no hard crash, no infinite hang).
- The export completes within approximately 15 seconds maximum (image load timeout is 10 s plus rendering overhead).
- A soft violet rounded box appears in place of the image.
- The box contains the text "Story illustration unavailable".
- No URL or technical error detail is visible anywhere in the PDF.
- Title, by-line, paragraphs, and moral box all appear correctly below the fallback box.

---

### TC-11 - PDF file opens and is readable

**Steps:**
1. Export any PDF.
2. Open it in at least two viewers: the browser's built-in PDF viewer and one standalone viewer (Adobe Acrobat Reader, or Preview on macOS, or Okular on Linux).

**Pass criteria:**
- File opens without a corruption error.
- All pages are visible.
- Text is selectable (it will appear as image-text because html2canvas renders to PNG, but the file itself must not be corrupt).
- File size is reasonable (typically under 5 MB for a standard story with one image).

---

### TC-12 - No clipped title

**Steps:**
1. Test with a story whose title is long (15 or more Arabic or French words).
2. Export as PDF.

**Pass criteria:**
- The full title is visible on the first page.
- No characters are cut off at the right or left edge.
- If the title is very long and wraps to a second line, both lines are fully visible.

---

### TC-13 - No clipped paragraphs

**Steps:**
1. Export the long story from TC-05.
2. Inspect every paragraph that spans near a page boundary.

**Pass criteria:**
- No paragraph image is clipped at the bottom of any page.
- Every paragraph is placed entirely on one page.
- If a paragraph is too wide for its block, text wraps correctly (word-break behavior).

---

### TC-14 - No empty pages

**Steps:**
1. Export the long story from TC-05.
2. Count the pages in the exported PDF.

**Pass criteria:**
- No page is completely blank.
- Every page has at least one content element (header counts, but the page must not be empty body content surrounded by header and footer only unless it is the last page with just a footer).

---

### TC-15 - No visible technical error details

**Steps:**
1. Test TC-10 (broken image URL) again.
2. Inspect the entire PDF for any of the following strings:

   - "Error"
   - "Exception"
   - "undefined"
   - "null"
   - "https://"
   - "fetch"
   - Any stack trace fragment

**Pass criteria:**
- None of the above strings appear anywhere in the exported PDF.
- The fallback box shows only "Story illustration unavailable" with no additional detail.

---

### TC-16 - Fallback box text and styling

**Steps:**
1. Trigger the fallback via TC-10.
2. Inspect the fallback box visually.

**Pass criteria:**
- Box background is a light violet/purple (roughly violet-50).
- Box border is a lighter violet (roughly violet-300).
- Text color is violet/purple, not red or black.
- Text is "Story illustration unavailable" exactly (check spelling).
- Box dimensions look proportional (approximately 90 mm wide, 50 mm tall).
- Box is horizontally centred on the page.

---

## Pass / Fail Criteria Summary

| Result | Meaning |
|---|---|
| PASS | All listed pass criteria are met exactly. |
| FAIL | One or more criteria are not met. Document the exact failure and create a bug issue. |
| SKIP | Test case cannot be run (e.g. no long story available). Document the skip reason. |

A release is blocked if any of the following test cases FAIL:

- TC-01, TC-02, TC-03, TC-04 (language correctness)
- TC-05 (page breaks)
- TC-08 (valid image)
- TC-10 (broken image fallback - PDF must not hang or crash)
- TC-11 (file opens without corruption)
- TC-12, TC-13 (no clipping)
- TC-15 (no technical detail leakage)

TC-06, TC-07, TC-09, TC-14, TC-16 are high-priority but may be deferred one release if a documented workaround exists.

---

## Known Limitations

1. **Text is rendered as images.** Because html2canvas converts HTML to PNG, the PDF text is not natively selectable or searchable in most viewers. This is an accepted trade-off for correct Arabic shaping. A future phase may explore native jsPDF text rendering for Latin-only stories.

2. **html2canvas font rendering depends on the browser.** Cairo font must be loaded in the browser before export starts. On slow connections the font may not load in time, causing a fallback to the system Arabic font. The result is still readable but may differ from the intended design.

3. **Cross-origin images require CORS headers.** Pollinations.ai images currently work with `crossOrigin = "anonymous"`. If the image CDN changes its CORS policy, images will fall back to the fallback box even though the URL is valid.

4. **Timeout is fixed at 10 seconds.** On very slow mobile connections a valid image may time out and be replaced by the fallback box. The timeout value is in `exportStoryPdf.ts` as `IMG_LOAD_TIMEOUT_MS`.

5. **Fallback text is English only.** "Story illustration unavailable" is the same string in all locales. A future phase should add this string to the i18n files.

6. **Very long single paragraphs (over 1000 characters with no sentence boundary).** `splitLongTextBlock` will fall back to whitespace splitting and in the worst case a hard cut. The result is readable but the split point may not be at a natural sentence boundary.

---

## Future Automation Candidates

The following test cases are the strongest candidates for future automated regression:

| TC | Automation approach |
|---|---|
| TC-10 | Playwright: mock the image URL to a local server that delays or 404s; assert PDF download occurs within a timeout |
| TC-05 | Playwright + pdf-parse: parse the exported PDF byte stream; assert page count > 1 |
| TC-11 | Playwright: download the PDF; assert file exists and size > 0 |
| TC-06, TC-07 | Unit test `normalizeStoryBlocks` and `splitLongTextBlock` with fixture strings |
| TC-16 | Snapshot test of the jsPDF drawing calls via a mock jsPDF instance |

Unit tests for `normalizeStoryBlocks` and `splitLongTextBlock` are the highest-priority candidates because they are pure functions with no browser dependency and could be added to the existing Node test runner immediately.

---

*Last updated: Phase 3C-C. Repeat this checklist before every release that touches the PDF export path.*
