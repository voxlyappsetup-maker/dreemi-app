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
 * Renders an HTML string into a canvas using the browser's own text engine.
 * This produces correct Arabic shaping, bidi, and ligatures at full quality.
 */
async function renderContentAsImage(
  htmlContent: string,
  isRtl: boolean,
  widthPx = 560
): Promise<HTMLCanvasElement> {
  // Ensure Cairo font is fully loaded before painting
  try {
    await document.fonts.load("700 15px Cairo");
    await document.fonts.load("400 15px Cairo");
  } catch { /* best effort */ }

  const wrapper = document.createElement("div");
  wrapper.style.cssText = `
    position: fixed;
    left: -9999px;
    top: 0;
    width: ${widthPx}px;
    padding: 0 20px;
    direction: ${isRtl ? "rtl" : "ltr"};
    text-align: ${isRtl ? "right" : "left"};
    font-family: 'Cairo', 'Noto Sans Arabic', Arial, sans-serif;
    font-size: 15px;
    line-height: 1.9;
    color: #2d2d2d;
    background: transparent;
    word-break: break-word;
    overflow-wrap: break-word;
  `;
  wrapper.innerHTML = htmlContent;
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

export async function exportStoryPdf(data: StoryPdfData): Promise<void> {
  const { title, childName, content, imageUrl, lesson, locale = "ar" } = data;
  const isRtl = locale === "ar";
  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const W = 210, H = 297, M = 20;
  const contentW = W - M * 2;
  const FOOTER_ZONE = 20, HEADER_TOP = 5;
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

  const brandAsset = await loadAsset("/dreemi-brand.png");

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
    const brandW = 55 * 0.85; // reduced 15% → 46.75mm; x = (W-brandW)/2 auto-recenters
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

  // ── Page 1 ────────────────────────────────────────────────────────────────
  drawGradientBg(); drawWatermark(); drawHeader();

  // Story illustration
  if (imageUrl) {
    try {
      const img = new Image();
      img.crossOrigin = "anonymous";
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve(); img.onerror = () => reject(); img.src = imageUrl;
      });
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
    } catch { cursorY += 8; }
  } else { cursorY += 8; }

  // ── Build HTML for all story text (title + byLine + paragraphs + moral) ───
  // Using html2canvas so the browser's text engine handles Arabic shaping,
  // bidi reordering, and ligatures correctly — jsPDF cannot do this.

  const byLineText = isRtl
    ? `قصة لـ ${escHtml(childName)}`
    : `A story for ${escHtml(childName)}`;

  const paragraphsHtml = content
    .split(/\n\n+/)
    .map(p => p.replace(/\n/g, " ").trim())
    .filter(p => p)
    .map(p => `<p style="margin:0 0 14px 0;font-size:15px;line-height:1.9;color:#334155;">${escHtml(p)}</p>`)
    .join("");

  let moralHtml = "";
  if (lesson?.trim()) {
    const moralLabel = isRtl ? "القيمة المستفادة" : "Moral of the Story";
    moralHtml = `
      <div style="background:#f5f3ff;border:1.5px solid #c4b5fd;border-radius:6px;padding:12px 16px;margin-top:16px;">
        <div style="font-weight:700;font-size:13px;color:#6d28d9;margin-bottom:8px;">${moralLabel}</div>
        <div style="font-size:13px;line-height:1.8;color:#334155;">${escHtml(lesson.trim())}</div>
      </div>
    `;
  }

  const storyHtml = `
    <div style="font-size:22px;font-weight:700;color:#1e293b;margin-bottom:6px;line-height:1.4;">${escHtml(title)}</div>
    <div style="font-size:12px;color:#8b5cf6;margin-bottom:18px;">${byLineText}</div>
    ${paragraphsHtml}
    ${moralHtml}
  `;

  const contentCanvas = await renderContentAsImage(storyHtml, isRtl);

  // mm per canvas-pixel (canvas is @2x so width = 560*2 = 1120px)
  const mmPerPx = contentW / contentCanvas.width;

  // ── Slice contentCanvas across PDF pages ──────────────────────────────────
  // font-size:15px × line-height:1.9 × scale:2 = 57px per text line in canvas pixels.
  // We round every slice boundary DOWN to a multiple of this so no line is ever
  // cut horizontally between two PDF pages.
  // font-size 15px × line-height 1.9 × scale 2 = 57px per line
  // +14px paragraph margin × scale 2 = 28px extra per paragraph
  // Use 3 lines as safety buffer to never clip mid-line
  const LINE_HEIGHT_PX = Math.round(15 * 1.9 * 2); // 57px
  const SAFETY_BUFFER_PX = LINE_HEIGHT_PX * 3;     // 171px safety
  let srcYPx = 0;
  let firstSlice = true;

  while (srcYPx < contentCanvas.height) {
    if (!firstSlice) {
      addNewPage();
    }
    firstSlice = false;

    const availableHeightMm = H - cursorY - FOOTER_ZONE;
    const rawMaxPx = Math.floor(availableHeightMm / mmPerPx);
    // Subtract 3-line safety buffer then round to a line boundary — zero clipping risk
    const maxSliceHeightPx = Math.floor(
      (rawMaxPx - SAFETY_BUFFER_PX) / LINE_HEIGHT_PX
    ) * LINE_HEIGHT_PX;

    // Safety: if no space available (shouldn't happen after addNewPage), break
    if (maxSliceHeightPx <= 0) break;

    const remaining = contentCanvas.height - srcYPx;
    const thisSlicePx = Math.min(maxSliceHeightPx, remaining);
    const thisSliceMm = thisSlicePx * mmPerPx;

    const sliceCanvas = document.createElement("canvas");
    sliceCanvas.width = contentCanvas.width;
    sliceCanvas.height = Math.ceil(thisSlicePx);
    const sliceCtx = sliceCanvas.getContext("2d")!;
    sliceCtx.drawImage(contentCanvas, 0, -srcYPx);

    pdf.addImage(sliceCanvas.toDataURL("image/png"), "PNG", M, cursorY, contentW, thisSliceMm);

    srcYPx += thisSlicePx;
    cursorY += thisSliceMm;
  }

  drawFooter();
  pdf.save(`Dreemi - ${title.replace(/[^a-zA-Z0-9\u0600-\u06FF ]/g, "").slice(0, 40)}.pdf`);
}
