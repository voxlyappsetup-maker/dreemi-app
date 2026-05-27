import type { Story } from "@dreemi/types";

export interface StoryPdfLabels {
  storyBy: string;
  moralLearned: string;
}

const PAGE_WIDTH = 794;
const PAGE_HEIGHT = 1123;
const PAD_X = 56;
const PAD_Y = 48;

const WATERMARK_SVG = encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160">
    <text x="50%" y="50%" fill="#8B5CF6" font-size="22" font-weight="700" font-family="Arial,sans-serif"
      transform="rotate(-45 80 80)" text-anchor="middle" dominant-baseline="middle">Dreemi</text>
  </svg>`,
);

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function createParagraphHtml(text: string): string {
  const lines = text.trim().split(/\n/).map(escapeHtml).join("<br/>");
  return `<p style="margin:0 0 16px;font-size:14px;line-height:1.8;color:#334155;">${lines}</p>`;
}

function createMoralHtml(labels: StoryPdfLabels, moral: string): string {
  return `<div data-pdf-moral="true" style="margin-top:8px;padding:18px 22px;border-radius:12px;background:#F5F3FF;border:1px solid #DDD6FE;">
    <p style="margin:0 0 8px;font-size:13px;font-weight:700;color:#7C3AED;">${escapeHtml(labels.moralLearned)}</p>
    <p style="margin:0;font-size:14px;line-height:1.8;color:#334155;">${escapeHtml(moral)}</p>
  </div>`;
}

function createHeaderHtml(): string {
  return `<div data-pdf-header="true" style="text-align:center;margin-bottom:22px;">
    <img src="/dreemi-brand.png" alt="Dreemi" crossorigin="anonymous"
      style="display:inline-block;height:64px;width:auto;" />
    <div style="margin-top:14px;height:1px;background:#C4B5FD;width:100%;"></div>
  </div>`;
}

function createImageHtml(imageUrl: string): string {
  return `<div data-pdf-image="true" style="width:70%;margin:0 auto 22px;border-radius:12px;border:2px solid #DDD6FE;overflow:hidden;box-sizing:border-box;">
    <img src="${escapeHtml(imageUrl)}" alt="" crossorigin="anonymous"
      style="display:block;width:100%;max-height:300px;object-fit:cover;" />
  </div>`;
}

function createTitleBlockHtml(title: string, storyBy: string): string {
  return `<div data-pdf-title="true" style="margin-bottom:20px;">
    <p style="margin:0 0 8px;font-size:13px;font-weight:600;color:#7C3AED;">${escapeHtml(storyBy)}</p>
    <h1 style="margin:0;font-size:26px;font-weight:800;line-height:1.35;color:#0F172A;">${escapeHtml(title)}</h1>
  </div>`;
}

function createFooterHtml(): string {
  return `<div data-pdf-footer="true" style="margin-top:auto;padding-top:20px;text-align:center;font-size:11px;font-weight:500;color:#A78BFA;letter-spacing:0.02em;">dreemi.app</div>`;
}

function createPageShell(isRtl: boolean, fontFamily: string): {
  page: HTMLDivElement;
  body: HTMLDivElement;
} {
  const page = document.createElement("div");
  page.className = "pdf-export-page";
  page.style.cssText = [
    `width:${PAGE_WIDTH}px`,
    `height:${PAGE_HEIGHT}px`,
    "position:relative",
    "overflow:hidden",
    "box-sizing:border-box",
    "background:linear-gradient(180deg,#EDE9FE 0%,#FFFFFF 38%)",
    `font-family:${fontFamily}`,
    `direction:${isRtl ? "rtl" : "ltr"}`,
  ].join(";");

  const watermark = document.createElement("div");
  watermark.setAttribute("aria-hidden", "true");
  watermark.style.cssText = [
    "position:absolute",
    "inset:0",
    "pointer-events:none",
    "opacity:0.06",
    `background-image:url("data:image/svg+xml,${WATERMARK_SVG}")`,
    "background-repeat:repeat",
    "background-size:160px 160px",
  ].join(";");

  const inner = document.createElement("div");
  inner.style.cssText = [
    "position:relative",
    "z-index:1",
    "display:flex",
    "flex-direction:column",
    `min-height:${PAGE_HEIGHT}px`,
    `padding:${PAD_Y}px ${PAD_X}px`,
    "box-sizing:border-box",
  ].join(";");

  const body = document.createElement("div");
  body.className = "pdf-export-body";
  body.style.cssText = "flex:1 1 auto;min-height:0;";

  const footerWrap = document.createElement("div");
  footerWrap.innerHTML = createFooterHtml();

  inner.appendChild(body);
  inner.appendChild(footerWrap.firstElementChild as HTMLElement);

  page.appendChild(watermark);
  page.appendChild(inner);
  return { page, body };
}

function pageOverflows(page: HTMLDivElement): boolean {
  return page.scrollHeight > PAGE_HEIGHT + 2;
}

function appendHtml(body: HTMLDivElement, html: string): void {
  const wrap = document.createElement("div");
  wrap.innerHTML = html;
  while (wrap.firstChild) {
    body.appendChild(wrap.firstChild);
  }
}

function buildPages(story: Story, labels: StoryPdfLabels): HTMLDivElement[] {
  const isRtl = story.language === "ar";
  const fontFamily = isRtl
    ? '"Segoe UI", Tahoma, "Noto Naskh Arabic", Arial, sans-serif'
    : 'Georgia, "Times New Roman", serif';

  const pages: HTMLDivElement[] = [];
  let { page, body } = createPageShell(isRtl, fontFamily);

  appendHtml(body, createHeaderHtml());
  if (story.imageUrl) {
    appendHtml(body, createImageHtml(story.imageUrl));
  }
  appendHtml(body, createTitleBlockHtml(story.title, labels.storyBy));

  const paragraphs = story.content.split(/\n\n+/).map((p) => p.trim()).filter(Boolean);

  for (const para of paragraphs) {
    const el = document.createElement("div");
    el.innerHTML = createParagraphHtml(para);
    const node = el.firstElementChild as HTMLElement;
    body.appendChild(node);

    if (pageOverflows(page)) {
      body.removeChild(node);
      pages.push(page);

      ({ page, body } = createPageShell(isRtl, fontFamily));
      body.appendChild(node);

      if (pageOverflows(page)) {
        pages.push(page);
        ({ page, body } = createPageShell(isRtl, fontFamily));
      }
    }
  }

  if (story.moral) {
    const moralWrap = document.createElement("div");
    moralWrap.innerHTML = createMoralHtml(labels, story.moral);
    const moralNode = moralWrap.firstElementChild as HTMLElement;
    body.appendChild(moralNode);

    if (pageOverflows(page)) {
      body.removeChild(moralNode);
      pages.push(page);
      ({ page, body } = createPageShell(isRtl, fontFamily));
      body.appendChild(moralNode);
    }
  }

  pages.push(page);
  return pages;
}

async function waitForImages(container: HTMLElement): Promise<void> {
  const images = Array.from(container.querySelectorAll("img"));
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
  const host = document.createElement("div");
  host.setAttribute("data-pdf-export-host", "true");
  host.style.cssText = "position:fixed;left:-12000px;top:0;z-index:-1;";

  const pages = buildPages(story, labels);
  for (const page of pages) {
    host.appendChild(page);
  }
  document.body.appendChild(host);

  try {
    await waitForImages(host);

    const html2canvas = (await import("html2canvas")).default;
    const { default: jsPDF } = await import("jspdf");

    const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

    for (let i = 0; i < pages.length; i++) {
      const canvas = await html2canvas(pages[i], {
        scale: 2,
        useCORS: true,
        backgroundColor: "#EDE9FE",
        logging: false,
        width: PAGE_WIDTH,
        height: PAGE_HEIGHT,
        windowWidth: PAGE_WIDTH,
        windowHeight: PAGE_HEIGHT,
      });

      const imgData = canvas.toDataURL("image/png");
      if (i > 0) pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, 0, 210, 297);
    }

    const safeTitle = story.title.replace(/[^a-zA-Z0-9\u0600-\u06FF ]/g, "").slice(0, 40);
    pdf.save(`Dreemi - ${safeTitle}.pdf`);
  } finally {
    host.remove();
  }
}
