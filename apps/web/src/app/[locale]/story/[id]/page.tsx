"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useTranslations, useLocale } from "next-intl";
import type { Story } from "@dreemi/types";
import { deleteStory, getStoryById, ApiError } from "../../../../lib/api";
import { exportStoryPdf } from "../../../../lib/exportStoryPdf";
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
  const [imgError, setImgError] = useState(false);
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

  // Reset image error state whenever the story image URL changes.
  useEffect(() => {
    setImgError(false);
  }, [story?.imageUrl]);

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
      await exportStoryPdf({
        title: story.title,
        childName: story.childName,
        content: story.content,
        imageUrl: story.imageUrl ?? undefined,
        lesson: story.moral ?? undefined,
        locale: story.language,
      });
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
          {story.imageUrl && !imgError ? (
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-violet-100" data-story-print>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={story.imageUrl}
                alt={story.title}
                className="h-full w-full object-cover"
                draggable={false}
                referrerPolicy="no-referrer"
                onError={() => setImgError(true)}
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
