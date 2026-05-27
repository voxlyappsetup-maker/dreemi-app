"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useTranslations, useLocale } from "next-intl";
import type { Story } from "@dreemi/types";
import { deleteStory, getStoryById, ApiError } from "../../../../lib/api";
import { Link, useRouter } from "../../../../i18n/routing";
import { getStoredUser, isAuthenticated } from "../../../../lib/storage";
import { StoryContent } from "../../../../components/StoryContent";
import { StoryPlayer } from "../../../../components/StoryPlayer";
import { IconBook } from "../../../../components/icons";
import { PublicHeader } from "../../../../components/PublicHeader";

export default function StoryViewPage({
  params,
}: {
  params: { id: string; locale: string };
}) {
  const t = useTranslations("storyView");
  const locale = useLocale();
  const router = useRouter();
  const [story, setStory] = useState<Story | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loggedIn] = useState(() => isAuthenticated());
  const [exporting, setExporting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const ownerId = getStoredUser()?.id ?? null;
  const storyRef = useRef<HTMLElement>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const data = await getStoryById(params.id);
        if (!cancelled) setStory(data);
      } catch (err) {
        if (!cancelled) {
          if (err instanceof ApiError && err.status === 404) {
            setError("not_found");
          } else {
            setError("load_error");
          }
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [params.id]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && (e.key === "c" || e.key === "a" || e.key === "C" || e.key === "A")) {
      e.preventDefault();
    }
  }, []);

  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
  }, []);

  const isOwner = loggedIn && story !== null && ownerId === story.userId;

  async function handleDeleteStory() {
    if (!story || deleting) return;
    if (!window.confirm(t("deleteConfirm"))) return;
    setDeleting(true);
    try {
      await deleteStory(story.id);
      router.push("/dashboard");
    } catch {
      window.alert(t("deleteError"));
      setDeleting(false);
    }
  }

  async function exportPdf() {
    if (!story || exporting) return;
    setExporting(true);
    try {
      const { default: jsPDF } = await import("jspdf");

      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const W = 210;
      const H = 297;
      const M = 20;
      const contentW = W - M * 2;
      const isRtl = story.language === "ar";
      const LINE_H = 6;
      const FOOTER_ZONE = 20;
      const HEADER_TOP = 5;
      let cursorY = HEADER_TOP;
      let pageNum = 1;
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
          return {
            dataUrl: canvas.toDataURL("image/png"),
            aspect: img.naturalHeight / img.naturalWidth,
          };
        } catch {
          return null;
        }
      };

      const brandAsset = await loadAsset("/dreemi-brand.png");

      const drawWatermark = () => {
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(48);
        pdf.setTextColor(139, 92, 246);
        pdf.saveGraphicsState();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        pdf.setGState(new (pdf as Record<string, any>).GState({ opacity: 0.06 }));
        for (let wy = 30; wy < H; wy += 50) {
          for (let wx = -20; wx < W + 20; wx += 80) {
            const xr = wx + ((wy / 50) % 2 === 0 ? 0 : 40);
            pdf.text("Dreemi", xr, wy, { angle: 45 });
          }
        }
        pdf.restoreGraphicsState();
      };

      const drawGradientBg = () => {
        for (let i = 0; i < H; i++) {
          const ratio = i / H;
          const r = Math.round(237 + (255 - 237) * ratio);
          const g = Math.round(233 + (255 - 233) * ratio);
          const b = Math.round(254 + (255 - 254) * ratio);
          pdf.setFillColor(r, g, b);
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
        drawFooter();
        pdf.addPage();
        pageNum++;
        drawGradientBg();
        drawWatermark();
        cursorY = HEADER_TOP;
        drawHeader();
        cursorY += 6;
      };

      const ensureSpace = (needed: number) => {
        if (cursorY + needed > H - FOOTER_ZONE) {
          addNewPage();
        }
      };

      const setBodyFont = () => {
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(13);
        pdf.setTextColor(51, 65, 85);
      };

      // --- Page 1 ---
      drawGradientBg();
      drawWatermark();
      drawHeader();

      // --- Image (102mm wide, aspect-ratio preserved, child-friendly frame) ---
      if (story.imageUrl) {
        try {
          const img = new Image();
          img.crossOrigin = "anonymous";
          await new Promise<void>((resolve, reject) => {
            img.onload = () => resolve();
            img.onerror = () => reject();
            img.src = story.imageUrl!;
          });
          const imgWidth = 90;
          const aspect = img.naturalHeight / img.naturalWidth;
          const imgH = imgWidth * aspect;
          const RADIUS = 5;
          const imgX = M + (contentW - imgWidth) / 2;

          const pxPerMm = 6;
          const cW = Math.max(1, Math.round(imgWidth * pxPerMm));
          const cH = Math.max(1, Math.round(imgH * pxPerMm));
          const rr = Math.max(0, Math.round(RADIUS * pxPerMm));
          const canvas = document.createElement("canvas");
          canvas.width = cW;
          canvas.height = cH;
          const ctx = canvas.getContext("2d")!;

          // Transparent background to avoid black corners
          ctx.clearRect(0, 0, cW, cH);

          const r = Math.min(rr, cW / 2, cH / 2);
          ctx.save();
          ctx.beginPath();
          ctx.moveTo(r, 0);
          ctx.lineTo(cW - r, 0);
          ctx.quadraticCurveTo(cW, 0, cW, r);
          ctx.lineTo(cW, cH - r);
          ctx.quadraticCurveTo(cW, cH, cW - r, cH);
          ctx.lineTo(r, cH);
          ctx.quadraticCurveTo(0, cH, 0, cH - r);
          ctx.lineTo(0, r);
          ctx.quadraticCurveTo(0, 0, r, 0);
          ctx.closePath();
          ctx.clip();
          ctx.drawImage(img, 0, 0, cW, cH);
          ctx.restore();

          const imgData = canvas.toDataURL("image/png");

          cursorY += 8;
          ensureSpace(imgH + 20);
          pdf.addImage(imgData, "PNG", imgX, cursorY, imgWidth, imgH);
          // Rounded frame (no size changes)
          pdf.setDrawColor(221, 214, 254);
          pdf.setLineWidth(1.5);
          pdf.roundedRect(imgX, cursorY, imgWidth, imgH, 5, 5, "S");
          cursorY += imgH + 8;
        } catch {
          // skip if image fails
        }
      } else {
        cursorY += 8;
      }

      // --- Title ---
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(18);
      pdf.setTextColor(30, 41, 59);
      const titleLines: string[] = pdf.splitTextToSize(story.title, contentW);
      for (const line of titleLines) {
        ensureSpace(8);
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(18);
        pdf.setTextColor(30, 41, 59);
        pdf.text(line, isRtl ? W - M : M, cursorY, { align: isRtl ? "right" : "left" });
        cursorY += 8;
      }

      // --- By line ---
      ensureSpace(7);
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(10);
      pdf.setTextColor(139, 92, 246);
      const byLine = t("storyBy", { name: story.childName });
      pdf.text(byLine, isRtl ? W - M : M, cursorY, { align: isRtl ? "right" : "left" });
      cursorY += 7;

      // --- Story content (line-by-line with page breaks) ---
      const paragraphs = story.content.split(/\n\n+/);
      for (const para of paragraphs) {
        const cleanPara = para.replace(/\n/g, " ").trim();
        if (!cleanPara) continue;

        setBodyFont();
        const lines: string[] = pdf.splitTextToSize(cleanPara, contentW);
        for (const line of lines) {
          ensureSpace(LINE_H);
          setBodyFont();
          pdf.text(line, isRtl ? W - M : M, cursorY, { align: isRtl ? "right" : "left" });
          cursorY += LINE_H;
        }
        cursorY += 3;
      }

      // --- Moral box (never split) ---
      if (story.moral) {
        const moralLabel = t("moralLearned");
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(12);
        const moralLines: string[] = pdf.splitTextToSize(story.moral, contentW - 12);
        const moralBoxH = 14 + moralLines.length * LINE_H;

        if (cursorY + moralBoxH + 4 > H - FOOTER_ZONE || H - FOOTER_ZONE - cursorY < 40) {
          addNewPage();
        }

        pdf.setFillColor(245, 243, 255);
        pdf.setDrawColor(196, 181, 253);
        pdf.roundedRect(M, cursorY, contentW, moralBoxH, 3, 3, "FD");

        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(12);
        pdf.setTextColor(109, 40, 217);
        pdf.text(moralLabel, isRtl ? W - M - 6 : M + 6, cursorY + 8, { align: isRtl ? "right" : "left" });

        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(12);
        pdf.setTextColor(51, 65, 85);
        const mx = isRtl ? W - M - 6 : M + 6;
        let my = cursorY + 15;
        for (const line of moralLines) {
          pdf.text(line, mx, my, { align: isRtl ? "right" : "left" });
          my += LINE_H;
        }
        cursorY += moralBoxH + 6;
      }

      drawFooter();

      const safeTitle = story.title.replace(/[^a-zA-Z0-9\u0600-\u06FF ]/g, "").slice(0, 40);
      pdf.save(`Dreemi - ${safeTitle}.pdf`);
    } catch (err) {
      console.error("[PDF export]", err);
    } finally {
      setExporting(false);
    }
  }

  const dir = locale === "ar" ? "rtl" : "ltr";

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-violet-100 to-white">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-violet-200 border-t-violet-600" />
        </div>
      </div>
    );
  }

  if (error || !story) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-violet-100 to-white px-4">
        <div className="text-center">
          <IconBook className="mx-auto mb-4 h-16 w-16 text-violet-300" />
          <h1 className="text-2xl font-bold text-slate-900">{t("notFound")}</h1>
          <p className="mt-2 text-slate-600">{t("notFoundDesc")}</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/"
              className="rounded-2xl bg-violet-600 px-6 py-3 font-semibold text-white shadow-lg transition hover:bg-violet-700"
            >
              {t("backHome")}
            </Link>
            <Link
              href="/register"
              className="rounded-2xl border border-violet-200 bg-white px-6 py-3 font-semibold text-violet-700 shadow-md transition hover:border-violet-300 hover:bg-violet-50"
            >
              {t("createYourOwn")}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-100 via-violet-50 to-white" dir={dir}>
      {loggedIn ? (
        <header className="border-b border-violet-100 bg-white/80 backdrop-blur">
          <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4">
            <div className="flex items-center gap-3">
              <Link href="/dashboard" className="transition hover:opacity-80">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/dreemi-brand.png"
                  alt="Dreemi"
                  className="h-28 w-auto"
                  draggable={false}
                />
              </Link>
              <Link
                href="/dashboard"
                className="rounded-xl border border-violet-200 bg-white px-3 py-1.5 text-xs font-semibold text-violet-700 transition hover:bg-violet-50"
              >
                ← {t("backHome")}
              </Link>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={exportPdf}
                disabled={exporting || deleting}
                className="rounded-xl border border-violet-200 bg-white px-3 py-2 text-sm font-semibold text-violet-700 transition hover:bg-violet-50 disabled:opacity-50"
              >
                {exporting ? t("exportingPdf") : t("exportPdf")}
              </button>
              {isOwner && (
                <button
                  type="button"
                  onClick={handleDeleteStory}
                  disabled={deleting || exporting}
                  className="rounded-xl border border-red-200 bg-white px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                >
                  {deleting ? t("deletingStory") : `🗑️ ${t("deleteStory")}`}
                </button>
              )}
              <Link
                href="/generate"
                className="rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-violet-700"
              >
                {t("createYourOwn")}
              </Link>
            </div>
          </div>
        </header>
      ) : (
        <PublicHeader />
      )}

      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-8 sm:py-12">
        <article
          ref={storyRef}
          data-story-print
          className="story-protected overflow-hidden rounded-2xl border border-violet-100 bg-white shadow-lg"
          onContextMenu={handleContextMenu}
          onKeyDown={handleKeyDown}
          tabIndex={0}
        >
          {story.imageUrl ? (
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-violet-100" data-story-print>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={story.imageUrl}
                alt={story.title}
                className="h-full w-full object-cover"
                draggable={false}
              />
            </div>
          ) : (
            <div className="flex aspect-[16/7] w-full items-center justify-center bg-gradient-to-br from-violet-100 via-purple-50 to-violet-100" data-story-print>
              <IconBook className="h-16 w-16 text-violet-200" />
            </div>
          )}
          <div className="border-b border-violet-100 bg-gradient-to-r from-violet-50 to-white px-6 py-6 sm:px-8">
            <p className="text-sm font-medium text-violet-600">
              {t("storyBy", { name: story.childName })}
            </p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900">
              {story.title}
            </h1>
          </div>

          <div className="px-6 py-8 sm:px-8" data-story-print>
            <div className="mb-6 print:hidden">
              <StoryPlayer text={story.content} language={story.language} />
            </div>
            <StoryContent text={story.content} />

            {story.moral && (
              <div
                className="mt-8 rounded-2xl bg-violet-50 px-5 py-5"
                data-story-moral
              >
                <p className="text-sm font-semibold text-violet-700">
                  {t("moralLearned")}
                </p>
                <p className="mt-1 text-slate-700">{story.moral}</p>
              </div>
            )}
          </div>
        </article>

        <div className="mt-8 text-center">
          <p className="text-sm text-slate-500">{t("poweredBy")}</p>
          <Link
            href="/"
            className="mt-2 inline-block text-sm font-semibold text-violet-600 transition hover:text-violet-700"
          >
            dreemi.app
          </Link>
        </div>
      </main>

      <style jsx global>{`
        .story-protected {
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
          -webkit-touch-callout: none;
        }
        .story-protected img {
          pointer-events: none;
          -webkit-user-drag: none;
        }
      `}</style>
    </div>
  );
}
