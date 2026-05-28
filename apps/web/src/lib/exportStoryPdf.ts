import jsPDF from "jspdf";

async function loadArabicFont(pdf: jsPDF): Promise<string> {
  try {
    const response = await fetch("/cairo-regular.ttf");
    if (!response.ok) throw new Error("Font not found");
    const buffer = await response.arrayBuffer();
    const uint8 = new Uint8Array(buffer);
    let binary = "";
    for (let i = 0; i < uint8.length; i++) binary += String.fromCharCode(uint8[i]);
    const base64 = btoa(binary);
    pdf.addFileToVFS("Cairo-Regular.ttf", base64);
    pdf.addFont("Cairo-Regular.ttf", "Cairo", "normal");
    pdf.addFileToVFS("Cairo-Bold.ttf", base64);
    pdf.addFont("Cairo-Bold.ttf", "Cairo", "bold");
    return "Cairo";
  } catch (e) {
    console.warn("[PDF] Arabic font failed, using fallback:", e);
    return "helvetica";
  }
}

export interface StoryPdfData {
  title: string;
  childName: string;
  content: string;
  imageUrl?: string;
  lesson?: string;
  locale?: string;
}

export async function exportStoryPdf(data: StoryPdfData): Promise<void> {
  const { title, childName, content, imageUrl, lesson, locale = "ar" } = data;
  const isRtl = locale === "ar";
  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const bodyFont = isRtl ? await loadArabicFont(pdf) : "helvetica";
  const W = 210, H = 297, M = 20;
  const contentW = W - M * 2;
  const LINE_H = 6, FOOTER_ZONE = 20, HEADER_TOP = 5;
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
    const brandW = 55;
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

  const setBodyFont = () => {
    pdf.setFont(bodyFont, "normal");
    pdf.setFontSize(13);
    pdf.setTextColor(51, 65, 85);
  };

  // Page 1
  drawGradientBg(); drawWatermark(); drawHeader();

  // Image
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

  // Title
  const titleLines: string[] = pdf.splitTextToSize(title, contentW);
  for (const line of titleLines) {
    ensureSpace(8);
    pdf.setFont(bodyFont, "bold"); pdf.setFontSize(18); pdf.setTextColor(30, 41, 59);
    pdf.text(line, isRtl ? W - M : M, cursorY, { align: isRtl ? "right" : "left" });
    cursorY += 8;
  }

  // By line
  ensureSpace(7);
  pdf.setFont(bodyFont, "normal"); pdf.setFontSize(10); pdf.setTextColor(139, 92, 246);
  const byLine = isRtl ? `قصة لـ ${childName}` : `A story for ${childName}`;
  pdf.text(byLine, isRtl ? W - M : M, cursorY, { align: isRtl ? "right" : "left" });
  cursorY += 7;

  // Content
  for (const para of content.split(/\n\n+/)) {
    const cleanPara = para.replace(/\n/g, " ").trim();
    if (!cleanPara) continue;
    const lines: string[] = pdf.splitTextToSize(cleanPara, contentW);
    for (const line of lines) {
      ensureSpace(LINE_H); setBodyFont();
      pdf.text(line, isRtl ? W - M : M, cursorY, { align: isRtl ? "right" : "left" });
      cursorY += LINE_H;
    }
    cursorY += 3;
  }

  // Moral box
  if (lesson?.trim()) {
    const moralLabel = isRtl ? "القيمة المستفادة" : "Moral of the Story";
    const moralLines: string[] = pdf.splitTextToSize(lesson, contentW - 12);
    const moralBoxH = 14 + moralLines.length * LINE_H;
    if (cursorY + moralBoxH + 4 > H - FOOTER_ZONE || H - FOOTER_ZONE - cursorY < 40) addNewPage();
    pdf.setFillColor(245, 243, 255); pdf.setDrawColor(196, 181, 253);
    pdf.roundedRect(M, cursorY, contentW, moralBoxH, 3, 3, "FD");
    pdf.setFont(bodyFont, "bold"); pdf.setFontSize(12); pdf.setTextColor(109, 40, 217);
    pdf.text(moralLabel, isRtl ? W - M - 6 : M + 6, cursorY + 8, { align: isRtl ? "right" : "left" });
    pdf.setFont(bodyFont, "normal"); pdf.setFontSize(12); pdf.setTextColor(51, 65, 85);
    let my = cursorY + 15;
    for (const line of moralLines) {
      pdf.text(line, isRtl ? W - M - 6 : M + 6, my, { align: isRtl ? "right" : "left" });
      my += LINE_H;
    }
    cursorY += moralBoxH + 6;
  }

  drawFooter();
  pdf.save(`Dreemi - ${title.replace(/[^a-zA-Z0-9\u0600-\u06FF ]/g, "").slice(0, 40)}.pdf`);
}