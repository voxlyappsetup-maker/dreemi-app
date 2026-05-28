import type { Story } from "@dreemi/types";

export interface StoryPdfLabels {
  storyBy: string;
  moralLearned: string;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function renderParagraphs(content: string): string {
  return content
    .split(/\n\n+/)
    .map((para) => para.trim())
    .filter(Boolean)
    .map((para) => {
      const lines = para.split(/\n/).map(escapeHtml).join("<br/>");
      return `<p style="margin:0 0 1.25rem;font-size:17px;line-height:1.85;color:#334155;">${lines}</p>`;
    })
    .join("");
}

function buildExportElement(story: Story, labels: StoryPdfLabels): HTMLDivElement {
  const isRtl = story.language === "ar";
  const dir = isRtl ? "rtl" : "ltr";
  const fontFamily = isRtl
    ? '"Segoe UI", Tahoma, "Noto Naskh Arabic", Arial, sans-serif'
    : 'Georgia, "Times New Roman", serif';

  const root = document.createElement("div");
  root.setAttribute("data-pdf-export", "true");
  root.style.cssText = [
    "position:fixed",
    "left:-10000px",
    "top:0",
    "width:794px",
    "padding:48px 56px",
    "box-sizing:border-box",
    "background:linear-gradient(180deg,#ede9fe 0%,#ffffff 35%)",
    `font-family:${fontFamily}`,
    `direction:${dir}`,
  ].join(";");

  const imageBlock = story.imageUrl
    ? `<div style="margin-bottom:28px;border-radius:16px;overflow:hidden;border:2px solid #ddd6fe;">
        <img src="${escapeHtml(story.imageUrl)}" alt="" crossorigin="anonymous"
          style="display:block;width:100%;max-height:360px;object-fit:cover;" />
       </div>`
    : "";

  const moralBlock = story.moral
    ? `<div style="margin-top:28px;padding:20px 24px;border-radius:16px;background:#f5f3ff;border:1px solid #c4b5fd;">
        <p style="margin:0 0 8px;font-size:14px;font-weight:700;color:#6d28d9;">${escapeHtml(labels.moralLearned)}</p>
        <p style="margin:0;font-size:16px;line-height:1.75;color:#334155;">${escapeHtml(story.moral)}</p>
       </div>`
    : "";

  root.innerHTML = `
    <div style="text-align:center;margin-bottom:24px;">
      <img src="/dreemi-brand.png" alt="Dreemi" style="height:72px;width:auto;" crossorigin="anonymous" />
    </div>
    ${imageBlock}
    <p style="margin:0 0 8px;font-size:14px;font-weight:600;color:#7c3aed;">${escapeHtml(labels.storyBy)}</p>
    <h1 style="margin:0 0 28px;font-size:28px;font-weight:800;line-height:1.35;color:#0f172a;">${escapeHtml(story.title)}</h1>
    <div>${renderParagraphs(story.content)}</div>
    ${moralBlock}
    <p style="margin-top:36px;text-align:center;font-size:12px;color:#8b5cf6;">dreemi.app</p>
  `;

  document.body.appendChild(root);
  return root;
}

async function waitForImages(el: HTMLElement): Promise<void> {
  const images = Array.from(el.querySelectorAll("img"));
  await Promise.all(
    images.map(
      (img) =>
        new Promise<void>((resolve) => {
          if (img.complete) {
            resolve();
            return;
          }
          img.onload = () => resolve();
          img.onerror = () => resolve();
        }),
    ),
  );
}

export async function exportStoryToPdf(
  story: Story,
  labels: StoryPdfLabels,
): Promise<void> {
  const el = buildExportElement(story, labels);
  try {
    await waitForImages(el);

    const html2canvas = (await import("html2canvas")).default;
    const { default: jsPDF } = await import("jspdf");

    const canvas = await html2canvas(el, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
      logging: false,
    });

    const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    const pdfWidth = 210;
    const pdfHeight = 297;
    const imgWidth = pdfWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pdfHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;
    }

    const safeTitle = story.title.replace(/[^a-zA-Z0-9\u0600-\u06FF ]/g, "").slice(0, 40);
    pdf.save(`Dreemi - ${safeTitle}.pdf`);
  } finally {
    el.remove();
  }
}

// Compatibility wrapper for page.tsx
export async function exportStoryPdf(data: {
  title: string;
  childName: string;
  content: string;
  imageUrl?: string;
  lesson?: string;
  locale?: string;
}): Promise<void> {
  const story = {
    title: data.title,
    content: data.content,
    imageUrl: data.imageUrl,
    moral: data.lesson,
    language: data.locale ?? "ar",
  } as import("@dreemi/types").Story;
  const labels = {
    storyBy: data.locale === "ar" ? `قصة لـ ${data.childName}` : `${data.childName}'s Story`,
    moralLearned: data.locale === "ar" ? "القيمة المستفادة" : "Lesson Learned",
  };
  return exportStoryToPdf(story, labels);
}

