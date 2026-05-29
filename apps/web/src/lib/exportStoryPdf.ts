import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export interface StoryPdfData {
  title: string;
  childName: string;
  content: string;
  imageUrl?: string;
  lesson?: string;
  locale?: string;
}

/** Escape HTML special characters to prevent rendering issues in the canvas div. */
function escHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Default maximum characters per rendering block (used as the splitLongTextBlock default).
 * The PDF rendering loop overrides this with language-specific values below.
 */
const MAX_BLOCK_CHARS = 1000;

/**
 * Language-aware per-block character limits for PDF rendering.
 * Arabic glyphs are visually wider and more dense, so shorter chunks keep
 * each canvas render well within a single PDF page height.
 */
const MAX_BLOCK_CHARS_AR  = 500;
const MAX_BLOCK_CHARS_LTR = 700;

/**
 * Splits raw story content into rendering blocks that match the same visual
 * semantics as StoryContent in the web UI:
 *   - Two or more consecutive newlines  → paragraph boundary (new block).
 *   - A single newline inside a block   → preserved as-is (rendered as <br/>).
 *   - Purely whitespace blocks          → discarded.
 */
function normalizeStoryBlocks(content: string): string[] {
  return content
    .split(/\n{2,}/)
    .map(b => b.trim())
    .filter(b => b.length > 0);
}

/** Counts sentence endings using both Arabic and Latin punctuation. */
function countSentences(text: string): number {
  const matches = text.match(/[.!?؟۔]+/g);
  return matches ? matches.length : 0;
}

/** True when a block looks like a short one-sentence paragraph. */
function isShortSingleSentenceBlock(block: string): boolean {
  const compact = block.replace(/\s+/g, " ").trim();
  if (!compact) return false;
  if (compact.length > 220) return false;
  const sentenceCount = countSentences(compact);
  return sentenceCount === 1;
}

/**
 * Groups consecutive short one-sentence Arabic blocks into natural paragraphs
 * of roughly 2–3 sentences while preserving text order.
 */
function regroupArabicShortBlocks(run: string[]): string[] {
  const grouped: string[] = [];
  let current = "";
  let currentSentences = 0;
  let currentLength = 0;
  const minSentences = 2;
  const maxSentences = 3;
  const maxChars = 550;

  const pushCurrent = () => {
    const value = current.trim();
    if (value) grouped.push(value);
    current = "";
    currentSentences = 0;
    currentLength = 0;
  };

  for (const block of run) {
    const compact = block.replace(/\s+/g, " ").trim();
    if (!compact) continue;
    const sentences = 1; // `run` contains only verified one-sentence short blocks.
    const nextLength = currentLength > 0 ? currentLength + 1 + compact.length : compact.length;
    const tooManySentences = currentSentences + sentences > maxSentences;
    const tooLong = currentLength > 0 && nextLength > maxChars && currentSentences >= minSentences;

    if (tooManySentences || tooLong) {
      pushCurrent();
    }

    current = current ? `${current} ${compact}` : compact;
    currentSentences += sentences;
    currentLength = current.length;
  }

  pushCurrent();

  // Avoid trailing 1-sentence orphan when possible by merging into previous group,
  // as long as we stay under the same character safety cap.
  if (grouped.length >= 2 && countSentences(grouped[grouped.length - 1]) <= 1) {
    const last = grouped.pop()!;
    const merged = `${grouped[grouped.length - 1]} ${last}`.trim();
    if (merged.length <= maxChars) {
      grouped[grouped.length - 1] = merged;
    } else {
      grouped.push(last);
    }
  }

  return grouped;
}

/**
 * PDF-side repair for legacy Arabic stories where each sentence was saved as a
 * standalone paragraph. Activates only when most blocks look like short
 * single-sentence paragraphs.
 */
function normalizeArabicPdfBlocksForExport(content: string): string[] {
  const rawBlocks = normalizeStoryBlocks(content);
  if (rawBlocks.length < 4) return rawBlocks;

  const shortSingles = rawBlocks.filter(isShortSingleSentenceBlock).length;
  const shouldRegroup = shortSingles / rawBlocks.length >= 0.5;
  if (!shouldRegroup) return rawBlocks;

  const result: string[] = [];
  let run: string[] = [];

  const flushRun = () => {
    if (run.length === 0) return;
    result.push(...regroupArabicShortBlocks(run));
    run = [];
  };

  for (const block of rawBlocks) {
    if (isShortSingleSentenceBlock(block)) {
      run.push(block);
    } else {
      flushRun();
      result.push(block);
    }
  }
  flushRun();

  return result.filter(b => b.trim().length > 0);
}

/**
 * Splits a single text block that is too long for one canvas render into
 * smaller chunks, each no longer than `maxChars` characters.
 *
 * Split preference order:
 *   1. Last sentence-ending punctuation (.  !  ?  ؟  ،  ۔) followed by
 *      optional closing punctuation and whitespace — but only when the
 *      resulting cut lands past 40 % of the slice (avoids very short chunks).
 *   2. Last whitespace character (space or newline) in the slice.
 *   3. Hard cut at `maxChars` (fallback; word may be split — very rare).
 *
 * Text order is preserved exactly; no characters are added or removed.
 */
function splitLongTextBlock(block: string, maxChars: number = MAX_BLOCK_CHARS): string[] {
  if (block.length <= maxChars) return [block];

  const chunks: string[] = [];
  let remaining = block;

  while (remaining.length > maxChars) {
    const slice = remaining.slice(0, maxChars);

    // Find the last sentence boundary in the slice.
    let cutAt = -1;
    const sentenceRe = /[.!?؟،۔][)\]'"»]*[\s\n]+/g;
    let m: RegExpExecArray | null;
    while ((m = sentenceRe.exec(slice)) !== null) {
      cutAt = m.index + m[0].length;
    }

    if (cutAt > maxChars * 0.4) {
      chunks.push(remaining.slice(0, cutAt).trimEnd());
      remaining = remaining.slice(cutAt).trimStart();
    } else {
      // Fall back: last whitespace (space or newline) near the end of the slice.
      const lastNewline = slice.lastIndexOf("\n");
      const lastSpace   = slice.lastIndexOf(" ");
      const breakAt     = Math.max(lastNewline, lastSpace);
      if (breakAt > 0) {
        chunks.push(remaining.slice(0, breakAt).trimEnd());
        remaining = remaining.slice(breakAt).trimStart();
      } else {
        // Hard cut — no whitespace found (e.g. long URL or unspaced text).
        chunks.push(remaining.slice(0, maxChars));
        remaining = remaining.slice(maxChars);
      }
    }
  }

  if (remaining.trim().length > 0) {
    chunks.push(remaining.trim());
  }

  return chunks;
}

/**
 * Loads an external image with a hard timeout.
 * Always resolves — returns the loaded HTMLImageElement on success, or null
 * on network error, CORS failure, broken URL, or timeout.
 * Clears the timeout and nullifies the handlers on every code path to avoid
 * memory leaks or zombie callbacks.
 */
function loadStoryImage(src: string, timeoutMs: number): Promise<HTMLImageElement | null> {
  return new Promise<HTMLImageElement | null>((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";

    let settled = false;
    const settle = (result: HTMLImageElement | null) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      img.onload  = null;
      img.onerror = null;
      resolve(result);
    };

    const timer = setTimeout(() => settle(null), timeoutMs);
    img.onload  = () => settle(img);
    img.onerror = () => settle(null);

    try {
      img.src = src;
    } catch {
      settle(null);
    }
  });
}

/**
 * Renders a single HTML fragment (one paragraph / title / box) into a canvas
 * using the browser's own text engine — produces correct Arabic shaping, bidi,
 * and ligatures. Each call is independent so there is no cross-page slicing.
 */
async function renderParagraphAsImage(
  paragraphHtml: string,
  isRtl: boolean,
  widthPx = 560
): Promise<HTMLCanvasElement> {
  try {
    await document.fonts.load("700 15px Cairo");
    await document.fonts.load("400 15px Cairo");
  } catch { /* best effort */ }

  const wrapper = document.createElement("div");
  wrapper.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    transform: translateX(-9999px);
    pointer-events: none;
    width: ${widthPx}px;
    padding: 0 24px 0 24px;
    overflow: visible;
    direction: ${isRtl ? "rtl" : "ltr"};
    text-align: ${isRtl ? "right" : "left"};
    font-family: 'Cairo', 'Noto Sans Arabic', Arial, sans-serif;
    font-size: 15px;
    line-height: 1.9;
    color: #2d2d2d;
    background: transparent;
    word-break: break-word;
    overflow-wrap: break-word;
    box-sizing: border-box;
  `;
  wrapper.innerHTML = paragraphHtml;
  document.body.appendChild(wrapper);

  const canvas = await html2canvas(wrapper, {
    scale: 2,
    useCORS: true,
    backgroundColor: null,
    logging: false,
  });

  document.body.removeChild(wrapper);
  return canvas;
}

/**
 * Renders a title using Canvas 2D — no html2canvas, no stretching.
 *
 * Key design decisions:
 *  - Fixed CSS canvas width (560 px) matches the paragraph wrapper width so
 *    pdf.addImage() places the image at contentW without horizontal stretching.
 *  - Long titles are word-wrapped onto multiple lines; each line is centred.
 *  - Canvas 2D direction + textAlign handle Arabic RTL and Latin LTR natively.
 *  - Font is 20 px (slightly smaller than the previous 22 px) to reduce the
 *    visual weight of short one-word titles.
 */
async function renderTitleWithCanvas2D(
  titleText: string,
  isRtl: boolean
): Promise<HTMLCanvasElement> {
  const scale      = 2;
  const fontSize   = 20;
  const lineHeight = Math.ceil(fontSize * 1.55); // comfortable leading
  const padX       = 28;                         // horizontal padding inside canvas
  const padY       = 6;                          // top/bottom padding
  const CSS_W      = 560;                        // must match paragraph widthPx

  // Measure canvas — used only for text width queries (never drawn).
  const measure = document.createElement("canvas");
  const mCtx    = measure.getContext("2d")!;
  mCtx.font     = `700 ${fontSize}px Cairo, Arial, sans-serif`;
  const maxTextW = CSS_W - padX * 2;

  // Word-wrap: split on spaces; each word that causes overflow starts a new line.
  const words: string[] = titleText.split(" ");
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (mCtx.measureText(candidate).width <= maxTextW) {
      current = candidate;
    } else {
      if (current) lines.push(current);
      current = word; // single word may still exceed maxTextW — kept as-is
    }
  }
  if (current) lines.push(current);

  const cssH = padY + lines.length * lineHeight + padY;

  const canvas = document.createElement("canvas");
  canvas.width  = CSS_W * scale;
  canvas.height = Math.ceil(cssH) * scale;

  const ctx = canvas.getContext("2d")!;
  ctx.scale(scale, scale);
  ctx.font          = `700 ${fontSize}px Cairo, Arial, sans-serif`;
  ctx.fillStyle     = "#1e293b";
  ctx.direction     = isRtl ? "rtl" : "ltr";
  ctx.textAlign     = "center";
  ctx.textBaseline  = "top";

  lines.forEach((line, i) => {
    ctx.fillText(line, CSS_W / 2, padY + i * lineHeight);
  });

  return canvas;
}

/**
 * Renders the small byline/subtitle using Canvas 2D to avoid html2canvas
 * bottom clipping on Arabic descenders.
 */
async function renderBylineWithCanvas2D(
  bylineText: string,
  isRtl: boolean
): Promise<HTMLCanvasElement> {
  const scale = 2;
  const fontSize = 12.8;
  const cssW = 560;
  const cssH = 44; // compact aspect ratio (~13 mm in PDF at contentW)

  const canvas = document.createElement("canvas");
  canvas.width = cssW * scale;
  canvas.height = cssH * scale;

  const ctx = canvas.getContext("2d")!;
  ctx.scale(scale, scale);
  ctx.font = `600 ${fontSize}px Cairo, Arial, sans-serif`;
  ctx.fillStyle = "#8b5cf6";
  ctx.direction = isRtl ? "rtl" : "ltr";
  ctx.textAlign = "center";
  // Middle baseline + centred y keeps glyph tails away from canvas edges.
  ctx.textBaseline = "middle";
  ctx.fillText(bylineText, cssW / 2, cssH / 2);

  return canvas;
}

export async function exportStoryPdf(data: StoryPdfData): Promise<void> {
  const perfNow = (): number =>
    (typeof performance !== "undefined" && typeof performance.now === "function")
      ? performance.now()
      : Date.now();
  const perfEnabled = process.env.NODE_ENV === "development";
  const perfStart = perfNow();

  let perfLogoMs = 0;
  let perfImageMs = 0;
  let perfTitleMs = 0;
  let perfBylineMs = 0;
  let perfParagraphTotalMs = 0;
  let perfParagraphMaxMs = 0;
  let perfParagraphRenderCallCount = 0;
  let perfParagraphBatchCount = 0;
  let perfBodyBatchRenderTotalMs = 0;
  let perfSaveMs = 0;

  const { title, childName, content, imageUrl, lesson, locale = "ar" } = data;
  const isRtl = locale === "ar";
  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const W = 210, H = 297, M = 20;
  const contentW = W - M * 2;
  const FOOTER_ZONE = 20, HEADER_TOP = 5;
  const PARA_GAP = 3; // mm gap between paragraph images
  let cursorY = HEADER_TOP, pageNum = 1;

  const loadAsset = async (src: string) => {
    try {
      const img = new Image();
      img.crossOrigin = "anonymous";
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject();
        img.src = src;
      });
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0);
      return { dataUrl: canvas.toDataURL("image/png"), aspect: img.naturalHeight / img.naturalWidth };
    } catch { return null; }
  };

  const logoStart = perfNow();
  const brandAsset = await loadAsset("/dreemi-brand.png");
  perfLogoMs = perfNow() - logoStart;

  const drawWatermark = () => {
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(48);
    pdf.setTextColor(139, 92, 246);
    pdf.saveGraphicsState();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    pdf.setGState(new (pdf as Record<string, any>).GState({ opacity: 0.06 }));
    for (let wy = 30; wy < H; wy += 50)
      for (let wx = -20; wx < W + 20; wx += 80)
        pdf.text("Dreemi", wx + ((wy / 50) % 2 === 0 ? 0 : 40), wy, { angle: 45 });
    pdf.restoreGraphicsState();
  };

  const drawGradientBg = () => {
    for (let i = 0; i < H; i++) {
      const ratio = i / H;
      pdf.setFillColor(
        Math.round(237 + (255 - 237) * ratio),
        Math.round(233 + (255 - 233) * ratio),
        Math.round(254 + (255 - 254) * ratio)
      );
      pdf.rect(0, i, W, 1.1, "F");
    }
  };

  const drawFooter = () => {
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(9);
    pdf.setTextColor(139, 92, 246);
    pdf.text(`dreemi.app  |  ${pageNum}`, W / 2, H - 8, { align: "center" });
  };

  const drawHeader = () => {
    const brandW = 55 * 0.765; // reduced 15% then another 10% → ~42mm; centred automatically
    if (brandAsset) {
      const brandH = brandW * brandAsset.aspect;
      pdf.addImage(brandAsset.dataUrl, "PNG", (W - brandW) / 2, cursorY, brandW, brandH);
      cursorY += brandH + 5;
    } else {
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(13);
      pdf.setTextColor(109, 40, 217);
      pdf.text("Dreemi", W / 2, cursorY + 4, { align: "center" });
      cursorY += 12;
    }
    pdf.setDrawColor(196, 181, 253);
    pdf.setLineWidth(0.3);
    pdf.line(M, cursorY, W - M, cursorY);
  };

  const addNewPage = () => {
    drawFooter(); pdf.addPage(); pageNum++;
    drawGradientBg(); drawWatermark();
    cursorY = HEADER_TOP; drawHeader(); cursorY += 6;
  };

  const ensureSpace = (needed: number) => {
    if (cursorY + needed > H - FOOTER_ZONE) addNewPage();
  };

  /**
   * Draws a simple placeholder box when the story illustration could not be
   * loaded (broken URL, CORS block, timeout, or canvas draw error).
   * Uses only jsPDF primitives — no network, no html2canvas.
   */
  const drawImageFallback = () => {
    const boxW = 90, boxH = 50;
    const boxX = M + (contentW - boxW) / 2;
    cursorY += 8;
    ensureSpace(boxH + 12);
    pdf.setFillColor(245, 243, 255);    // violet-50
    pdf.setDrawColor(196, 181, 253);    // violet-300
    pdf.setLineWidth(0.5);
    pdf.roundedRect(boxX, cursorY, boxW, boxH, 5, 5, "FD");
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(8.5);
    pdf.setTextColor(139, 92, 246);     // violet-500
    pdf.text("Story illustration unavailable", boxX + boxW / 2, cursorY + boxH / 2, { align: "center" });
    cursorY += boxH + 8;
  };

  // ── Page 1 ────────────────────────────────────────────────────────────────
  drawGradientBg(); drawWatermark(); drawHeader();

  // Story illustration — resilient: timeout + fallback on any failure
  const IMG_LOAD_TIMEOUT_MS = 10_000;
  const hasImageUrl = typeof imageUrl === "string" && imageUrl.trim().length > 0;

  const imageStart = perfNow();
  if (hasImageUrl) {
    const img = await loadStoryImage(imageUrl!, IMG_LOAD_TIMEOUT_MS);

    if (img && img.naturalWidth > 0 && img.naturalHeight > 0) {
      // Image loaded successfully — draw with rounded corners (same as before).
      try {
        const imgWidth = 90, aspect = img.naturalHeight / img.naturalWidth;
        const imgH = imgWidth * aspect, RADIUS = 5;
        const imgX = M + (contentW - imgWidth) / 2;
        const pxPerMm = 6;
        const cW = Math.max(1, Math.round(imgWidth * pxPerMm));
        const cH = Math.max(1, Math.round(imgH * pxPerMm));
        const rr = Math.max(0, Math.round(RADIUS * pxPerMm));
        const canvas = document.createElement("canvas");
        canvas.width = cW; canvas.height = cH;
        const ctx = canvas.getContext("2d")!;
        ctx.clearRect(0, 0, cW, cH);
        const r = Math.min(rr, cW / 2, cH / 2);
        ctx.save(); ctx.beginPath();
        ctx.moveTo(r, 0); ctx.lineTo(cW - r, 0);
        ctx.quadraticCurveTo(cW, 0, cW, r); ctx.lineTo(cW, cH - r);
        ctx.quadraticCurveTo(cW, cH, cW - r, cH); ctx.lineTo(r, cH);
        ctx.quadraticCurveTo(0, cH, 0, cH - r); ctx.lineTo(0, r);
        ctx.quadraticCurveTo(0, 0, r, 0); ctx.closePath(); ctx.clip();
        ctx.drawImage(img, 0, 0, cW, cH); ctx.restore();
        cursorY += 8; ensureSpace(imgH + 20);
        pdf.addImage(canvas.toDataURL("image/png"), "PNG", imgX, cursorY, imgWidth, imgH);
        pdf.setDrawColor(221, 214, 254); pdf.setLineWidth(1.5);
        pdf.roundedRect(imgX, cursorY, imgWidth, imgH, 5, 5, "S");
        cursorY += imgH + 8;
      } catch {
        // Canvas draw error (e.g. tainted canvas after CORS mis-match) — show fallback.
        drawImageFallback();
      }
    } else {
      // URL was provided but image failed to load (timeout, CORS, 404, etc.).
      drawImageFallback();
    }
  } else {
    // No image URL — just add spacing before the title.
    cursorY += 8;
  }
  perfImageMs = perfNow() - imageStart;

  // ── Paragraph-by-paragraph rendering ─────────────────────────────────────
  // Each text element is its own canvas render → no cross-page slicing →
  // zero risk of a line being split between two PDF pages.
  // The browser's text engine handles Arabic shaping, bidi, and ligatures.

  /**
   * Renders html into a canvas, converts its height to mm, starts a new page
   * if the element doesn't fit, then places it at the current cursor position.
   */
  const placeParagraph = async (html: string, widthPx = 560): Promise<void> => {
    const canvas = await renderParagraphAsImage(html, isRtl, widthPx);
    // canvas is @2x scale: CSS width = canvas.width / 2
    const cssWidthPx = canvas.width / 2;
    if (cssWidthPx <= 0 || contentW <= 0) return; // nothing to draw
    const pxPerMm = cssWidthPx / contentW;
    const heightMm = (canvas.height / 2) / pxPerMm;
    if (heightMm <= 0) return; // nothing to draw

    if (cursorY + heightMm > H - FOOTER_ZONE) {
      addNewPage();
    }

    pdf.addImage(canvas.toDataURL("image/png"), "PNG", M, cursorY, contentW, heightMm);
    cursorY += heightMm + PARA_GAP;
  };

  /**
   * Measures paragraph HTML height in CSS pixels using the same typography and
   * width as renderParagraphAsImage, without running html2canvas.
   */
  const estimateParagraphHeightPx = (html: string, widthPx = 560): number => {
    const probe = document.createElement("div");
    probe.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      transform: translateX(-9999px);
      pointer-events: none;
      width: ${widthPx}px;
      padding: 0 24px 0 24px;
      overflow: visible;
      direction: ${isRtl ? "rtl" : "ltr"};
      text-align: ${isRtl ? "right" : "left"};
      font-family: 'Cairo', 'Noto Sans Arabic', Arial, sans-serif;
      font-size: 15px;
      line-height: 1.9;
      color: #2d2d2d;
      background: transparent;
      word-break: break-word;
      overflow-wrap: break-word;
      box-sizing: border-box;
    `;
    probe.innerHTML = html;
    document.body.appendChild(probe);
    const height = Math.ceil(probe.scrollHeight);
    document.body.removeChild(probe);
    return Math.max(1, height);
  };

  const placeBodyBatch = async (paragraphInnerHtmlItems: string[], widthPx = 560): Promise<void> => {
    if (paragraphInnerHtmlItems.length === 0) return;

    const paragraphsHtml = paragraphInnerHtmlItems
      .map((innerHtml, i) => {
        const isLast = i === paragraphInnerHtmlItems.length - 1;
        return `<p style="margin:0 0 ${isLast ? 0 : 10}px 0;font-size:15px;line-height:1.9;color:#334155;">${innerHtml}</p>`;
      })
      .join("");

    const batchStart = perfNow();
    try {
      const canvas = await renderParagraphAsImage(paragraphsHtml, isRtl, widthPx);
      const cssWidthPx = canvas.width / 2;
      if (cssWidthPx <= 0 || contentW <= 0) return;
      const pxPerMm = cssWidthPx / contentW;
      const heightMm = (canvas.height / 2) / pxPerMm;
      if (heightMm <= 0) return;

      if (cursorY + heightMm > H - FOOTER_ZONE) {
        addNewPage();
      }

      pdf.addImage(canvas.toDataURL("image/png"), "PNG", M, cursorY, contentW, heightMm);
      cursorY += heightMm + PARA_GAP;

      const batchMs = perfNow() - batchStart;
      perfParagraphTotalMs += batchMs;
      perfBodyBatchRenderTotalMs += batchMs;
      perfParagraphMaxMs = Math.max(perfParagraphMaxMs, batchMs);
      perfParagraphRenderCallCount += 1;
      perfParagraphBatchCount += 1;
    } catch {
      // Safe fallback: preserve visual correctness by rendering each paragraph separately.
      for (const innerHtml of paragraphInnerHtmlItems) {
        const paraStart = perfNow();
        await placeParagraph(
          `<p style="margin:0;font-size:15px;line-height:1.9;color:#334155;">${innerHtml}</p>`,
          widthPx
        );
        const paraMs = perfNow() - paraStart;
        perfParagraphTotalMs += paraMs;
        perfParagraphMaxMs = Math.max(perfParagraphMaxMs, paraMs);
        perfParagraphRenderCallCount += 1;
      }
    }
  };

  const byLineText = locale === "ar"
    ? `قصة لـ ${childName}`
    : locale === "fr"
      ? `Une histoire pour ${childName}`
      : `A story for ${childName}`;

  // Title — rendered via Canvas 2D API: no html2canvas, correct Arabic + English
  {
    const titleStart = perfNow();
    const titleCanvas = await renderTitleWithCanvas2D(title, isRtl);
    const titleH = (titleCanvas.height / titleCanvas.width) * contentW;
    ensureSpace(titleH + 4);
    pdf.addImage(titleCanvas.toDataURL("image/png"), "PNG", M, cursorY, contentW, titleH);
    cursorY += titleH + 4;
    perfTitleMs = perfNow() - titleStart;
  }

  // By-line — rendered via dedicated Canvas 2D path to prevent descender clipping.
  {
    const bylineStart = perfNow();
    const bylineCanvas = await renderBylineWithCanvas2D(byLineText, isRtl);
    // Keep natural aspect ratio to avoid vertical squash/stretch.
    const bylineH = (bylineCanvas.height / bylineCanvas.width) * contentW;
    ensureSpace(bylineH + 2);
    pdf.addImage(bylineCanvas.toDataURL("image/png"), "PNG", M, cursorY, contentW, bylineH);
    cursorY += bylineH + PARA_GAP;
    perfBylineMs = perfNow() - bylineStart;
  }

  // Content paragraphs
  // normalizeStoryBlocks: double+ newlines → block boundary; single newlines kept.
  // splitLongTextBlock:   blocks > language-specific limit split at sentence/word
  //                       boundaries so no single canvas render spans a full page.
  const pdfMaxChars = isRtl ? MAX_BLOCK_CHARS_AR : MAX_BLOCK_CHARS_LTR;
  const blocks = isRtl
    ? normalizeArabicPdfBlocksForExport(content)
    : normalizeStoryBlocks(content);
  const BODY_GAP_PX = 10;
  const BODY_BATCH_SAFETY_PX = 8;
  const BODY_WIDTH_PX = 560;
  let bodyBatch: string[] = [];
  let bodyBatchEstimatedHeightPx = 0;

  const flushBodyBatch = async () => {
    if (bodyBatch.length === 0) return;
    await placeBodyBatch(bodyBatch, BODY_WIDTH_PX);
    bodyBatch = [];
    bodyBatchEstimatedHeightPx = 0;
  };

  const getRemainingBodyHeightPx = (): number => {
    const remainingMm = Math.max(0, H - FOOTER_ZONE - cursorY);
    const pxPerMm = BODY_WIDTH_PX / contentW;
    return Math.max(0, remainingMm * pxPerMm - BODY_BATCH_SAFETY_PX);
  };

  for (const block of blocks) {
    const chunks = splitLongTextBlock(block, pdfMaxChars);
    for (const chunk of chunks) {
      const innerHtml = escHtml(chunk).replace(/\n/g, "<br/>");
      const paragraphHtml = `<p style="margin:0;font-size:15px;line-height:1.9;color:#334155;">${innerHtml}</p>`;
      const estimatedHeightPx = estimateParagraphHeightPx(paragraphHtml, BODY_WIDTH_PX);
      const nextEstimated = bodyBatchEstimatedHeightPx + estimatedHeightPx + BODY_GAP_PX;
      let availableHeightPx = getRemainingBodyHeightPx();

      // Greedy page-aware batching: render current batch before overflow.
      if (bodyBatch.length > 0 && nextEstimated > availableHeightPx) {
        await flushBodyBatch();
        availableHeightPx = getRemainingBodyHeightPx();
      }

      // If a single paragraph itself is taller than remaining space, render it alone.
      // This may legitimately move only this paragraph to the next page.
      if (bodyBatch.length === 0 && (estimatedHeightPx + BODY_GAP_PX) > availableHeightPx) {
        const paraStart = perfNow();
        await placeParagraph(paragraphHtml, BODY_WIDTH_PX);
        const paraMs = perfNow() - paraStart;
        perfParagraphTotalMs += paraMs;
        perfParagraphMaxMs = Math.max(perfParagraphMaxMs, paraMs);
        perfParagraphRenderCallCount += 1;
        continue;
      }

      bodyBatch.push(innerHtml);
      bodyBatchEstimatedHeightPx += estimatedHeightPx + BODY_GAP_PX;
    }
  }

  await flushBodyBatch();

  // Moral box
  if (lesson?.trim()) {
    const moralLabel = isRtl ? "القيمة المستفادة" : "Moral of the Story";
    await placeParagraph(`
      <div style="background:#f5f3ff;border:1.5px solid #c4b5fd;border-radius:6px;padding:12px 16px;">
        <div style="font-weight:700;font-size:13px;color:#6d28d9;margin-bottom:8px;">${moralLabel}</div>
        <div style="font-size:13px;line-height:1.8;color:#334155;">${escHtml(lesson.trim())}</div>
      </div>
    `);
  }

  drawFooter();
  const saveStart = perfNow();
  pdf.save(`Dreemi - ${title.replace(/[^a-zA-Z0-9\u0600-\u06FF ]/g, "").slice(0, 40)}.pdf`);
  perfSaveMs = perfNow() - saveStart;

  if (perfEnabled) {
    const toMs = (n: number) => Number(n.toFixed(1));
    const perfTotalMs = perfNow() - perfStart;
    console.info("[PDF_PERF]", {
      totalExportMs: toMs(perfTotalMs),
      language: locale,
      isRtl,
      hasImageUrl,
      storyBlockCount: blocks.length,
      pageCount: pageNum,
      logoRenderMs: toMs(perfLogoMs),
      imageLoadRenderMs: toMs(perfImageMs),
      titleRenderMs: toMs(perfTitleMs),
      bylineRenderMs: toMs(perfBylineMs),
      paragraphRenderTotalMs: toMs(perfParagraphTotalMs),
      maxSingleParagraphRenderMs: toMs(perfParagraphMaxMs),
      paragraphRenderCallCount: perfParagraphRenderCallCount,
      paragraphBatchCount: perfParagraphBatchCount,
      bodyBatchRenderTotalMs: toMs(perfBodyBatchRenderTotalMs),
      averageParagraphBatchMs: perfParagraphBatchCount > 0
        ? toMs(perfBodyBatchRenderTotalMs / perfParagraphBatchCount)
        : 0,
      pdfSaveMs: toMs(perfSaveMs),
    });
  }
}
