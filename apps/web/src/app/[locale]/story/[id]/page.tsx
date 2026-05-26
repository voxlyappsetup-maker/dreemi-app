"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useTranslations, useLocale } from "next-intl";
import type { Story } from "@dreemi/types";
import { Link } from "../../../../i18n/routing";
import { getStoryById, ApiError } from "../../../../lib/api";
import { isAuthenticated } from "../../../../lib/storage";
import { StoryContent } from "../../../../components/StoryContent";
import { StoryPlayer } from "../../../../components/StoryPlayer";
import { IconBook } from "../../../../components/icons";
import { DreemiLogo } from "../../../../components/DreemiLogo";

export default function StoryViewPage({
  params,
}: {
  params: { id: string; locale: string };
}) {
  const t = useTranslations("storyView");
  const locale = useLocale();
  const [story, setStory] = useState<Story | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const [exporting, setExporting] = useState(false);
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
    setLoggedIn(isAuthenticated());
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

      const drawWatermark = () => {
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(48);
        pdf.setTextColor(139, 92, 246);
        pdf.saveGraphicsState();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        pdf.setGState(new (pdf as Record<string, any>).GState({ opacity: 0.06 }));
        for (let y = 30; y < H; y += 50) {
          for (let x = -20; x < W + 20; x += 80) {
            const xr = x + ((y / 50) % 2 === 0 ? 0 : 40);
            pdf.text("Dreemi", xr, y, { angle: 45 });
          }
        }
        pdf.restoreGraphicsState();
      }

      const drawGradientBg = () => {
        for (let i = 0; i < H; i++) {
          const ratio = i / H;
          const r = Math.round(237 + (255 - 237) * ratio);
          const g = Math.round(233 + (255 - 233) * ratio);
          const b = Math.round(254 + (255 - 254) * ratio);
          pdf.setFillColor(r, g, b);
          pdf.rect(0, i, W, 1.1, "F");
        }
      }

      const drawFooter = () => {
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(8);
        pdf.setTextColor(139, 92, 246);
        const date = new Date(story!.createdAt).toLocaleDateString(
          locale === "ar" ? "ar-SA" : locale === "fr" ? "fr-FR" : "en-US"
        );
        pdf.text("dreemi.app", W / 2, H - 10, { align: "center" });
        pdf.setTextColor(148, 163, 184);
        pdf.text(date, W / 2, H - 6, { align: "center" });
      }

      const LINE_H = 5.5;
      const BOTTOM_MARGIN = 22;

      const newPage = (withHeader: boolean) => {
        drawFooter();
        pdf.addPage();
        drawGradientBg();
        drawWatermark();
        cursorY = M;
        if (withHeader) {
          pdf.setFont("helvetica", "bold");
          pdf.setFontSize(12);
          pdf.setTextColor(109, 40, 217);
          pdf.text("Dreemi", W / 2, cursorY, { align: "center" });
          cursorY += 4;
          pdf.setDrawColor(196, 181, 253);
          pdf.setLineWidth(0.2);
          pdf.line(M, cursorY, W - M, cursorY);
          cursorY += 6;
        }
      };

      const ensureSpace = (needed: number) => {
        if (cursorY + needed > H - BOTTOM_MARGIN) {
          newPage(true);
        }
      };

      drawGradientBg();
      drawWatermark();

      let cursorY = M;

      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(22);
      pdf.setTextColor(109, 40, 217);
      pdf.text("Dreemi", W / 2, cursorY, { align: "center" });
      cursorY += 4;

      pdf.setDrawColor(196, 181, 253);
      pdf.setLineWidth(0.3);
      pdf.line(M, cursorY, W - M, cursorY);
      cursorY += 8;

      if (story.imageUrl) {
        try {
          const img = new Image();
          img.crossOrigin = "anonymous";
          await new Promise<void>((resolve, reject) => {
            img.onload = () => resolve();
            img.onerror = () => reject();
            img.src = story.imageUrl!;
          });
          const canvas = document.createElement("canvas");
          canvas.width = img.naturalWidth;
          canvas.height = img.naturalHeight;
          const ctx = canvas.getContext("2d")!;
          ctx.drawImage(img, 0, 0);
          const imgData = canvas.toDataURL("image/jpeg", 0.85);

          const maxImgW = 160;
          const maxImgH = 90;
          const aspect = img.naturalWidth / img.naturalHeight;
          let imgW = Math.min(maxImgW, contentW);
          let imgH = imgW / aspect;
          if (imgH > maxImgH) {
            imgH = maxImgH;
            imgW = imgH * aspect;
          }
          const imgX = M + (contentW - imgW) / 2;
          pdf.addImage(imgData, "JPEG", imgX, cursorY, imgW, imgH);
          cursorY += imgH + 6;
        } catch {
          // image failed to load, skip
        }
      }

      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(18);
      pdf.setTextColor(30, 41, 59);
      const titleLines = pdf.splitTextToSize(story.title, contentW);
      for (const line of titleLines) {
        ensureSpace(8);
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(18);
        pdf.setTextColor(30, 41, 59);
        pdf.text(line, isRtl ? W - M : M, cursorY, { align: isRtl ? "right" : "left" });
        cursorY += 8;
      }

      ensureSpace(8);
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(9);
      pdf.setTextColor(139, 92, 246);
      const byLine = t("storyBy", { name: story.childName });
      pdf.text(byLine, isRtl ? W - M : M, cursorY, { align: isRtl ? "right" : "left" });
      cursorY += 8;

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(11);
      pdf.setTextColor(51, 65, 85);

      const printLine = (line: string) => {
        ensureSpace(LINE_H);
        pdf.text(line, isRtl ? W - M : M, cursorY, { align: isRtl ? "right" : "left" });
        cursorY += LINE_H;
      };

      const paragraphs = story.content.split(/\n\n+/);
      for (const para of paragraphs) {
        const cleanPara = para.replace(/\n/g, " ").trim();
        if (!cleanPara) continue;

        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(11);
        pdf.setTextColor(51, 65, 85);

        const lines: string[] = pdf.splitTextToSize(cleanPara, contentW);
        for (const line of lines) {
          printLine(line);
        }
        cursorY += 3;
      }

      if (story.moral) {
        const moralLabel = t("moralLearned");
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(10);
        const moralLines: string[] = pdf.splitTextToSize(story.moral, contentW - 10);
        const moralBlockH = 12 + moralLines.length * LINE_H;

        ensureSpace(moralBlockH + 8);

        pdf.setFillColor(245, 243, 255);
        pdf.setDrawColor(196, 181, 253);
        pdf.roundedRect(M, cursorY - 2, contentW, moralBlockH + 6, 3, 3, "FD");

        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(10);
        pdf.setTextColor(109, 40, 217);
        pdf.text(moralLabel, isRtl ? W - M - 5 : M + 5, cursorY + 6, { align: isRtl ? "right" : "left" });

        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(10);
        pdf.setTextColor(51, 65, 85);
        const moralX = isRtl ? W - M - 5 : M + 5;
        let moralY = cursorY + 13;
        moralLines.forEach((line: string) => {
          pdf.text(line, moralX, moralY, { align: isRtl ? "right" : "left" });
          moralY += LINE_H;
        });
        cursorY += moralBlockH + 8;
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
      <header className="border-b border-violet-100 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <Link href={loggedIn ? "/dashboard" : "/"} className="transition hover:opacity-80">
              <DreemiLogo size="md" />
            </Link>
            {loggedIn && (
              <Link
                href="/dashboard"
                className="rounded-xl border border-violet-200 bg-white px-3 py-1.5 text-xs font-semibold text-violet-700 transition hover:bg-violet-50"
              >
                ← {t("backHome")}
              </Link>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={exportPdf}
              disabled={exporting}
              className="rounded-xl border border-violet-200 bg-white px-3 py-2 text-sm font-semibold text-violet-700 transition hover:bg-violet-50 disabled:opacity-50"
            >
              {exporting ? t("exportingPdf") : t("exportPdf")}
            </button>
            {loggedIn ? (
              <Link
                href="/generate"
                className="rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-violet-700"
              >
                {t("createYourOwn")}
              </Link>
            ) : (
              <Link
                href="/register"
                className="rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-violet-700"
              >
                {t("createYourOwn")}
              </Link>
            )}
          </div>
        </div>
      </header>

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
