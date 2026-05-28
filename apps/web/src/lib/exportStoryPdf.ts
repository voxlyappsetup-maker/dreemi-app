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

export async function exportStoryPdf(data: StoryPdfData): Promise<void> {
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

  // Story illustration (unchanged)
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
    const pxPerMm = cssWidthPx / contentW;
    const heightMm = (canvas.height / 2) / pxPerMm;

    if (heightMm > H - cursorY - FOOTER_ZONE) {
      addNewPage();
    }

    pdf.addImage(canvas.toDataURL("image/png"), "PNG", M, cursorY, contentW, heightMm);
    cursorY += heightMm + PARA_GAP;
  };

  const byLineText = isRtl
    ? `قصة لـ ${escHtml(childName)}`
    : `A story for ${escHtml(childName)}`;

  // Title — centered, 22px bold; padding-right:60px absorbs RTL right-edge overflow
  await placeParagraph(
    `<div style="font-size:22px;font-weight:700;color:#1e293b;line-height:1.4;text-align:center;padding-right:60px;overflow:visible;">${escHtml(title)}</div>`,
    560
  );

  // By-line — same wider canvas to avoid edge clipping
  await placeParagraph(
    `<div style="font-size:12px;color:#8b5cf6;">${byLineText}</div>`,
    600
  );

  // Content paragraphs — split on any run of newlines for finest granularity
  const paragraphs = content
    .split(/\n+/)
    .map(p => p.trim())
    .filter(p => p.length > 0);

  for (const para of paragraphs) {
    await placeParagraph(
      `<p style="margin:0;font-size:15px;line-height:1.9;color:#334155;">${escHtml(para)}</p>`
    );
  }

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
  pdf.save(`Dreemi - ${title.replace(/[^a-zA-Z0-9\u0600-\u06FF ]/g, "").slice(0, 40)}.pdf`);
}
