"use client";

import type { Story } from "@dreemi/types";
import { useLocale, useTranslations } from "next-intl";
import { IconBook, IconHeart, IconTrash } from "./icons";
import { isFavorite, toggleFavorite } from "../lib/favorites";
import { useState, type MouseEvent } from "react";

function excerpt(content: string, max = 100): string {
  const trimmed = content.replace(/\s+/g, " ").trim();
  if (trimmed.length <= max) return trimmed;
  return `${trimmed.slice(0, max)}…`;
}

interface StoryCardProps {
  story: Story;
  onFavoriteChange?: () => void;
  onDelete?: (storyId: string) => void;
}

export function StoryCard({ story, onFavoriteChange, onDelete }: StoryCardProps) {
  const locale = useLocale();
  const t = useTranslations("storyCard");
  const [fav, setFav] = useState(() => isFavorite(story.id) || story.isFavorite);

  const LANGUAGE_LABELS: Record<string, string> = {
    ar: t("langAr"),
    en: t("langEn"),
    fr: t("langFr"),
  };

  function formatDate(dateStr: string): string {
    return new Intl.DateTimeFormat(locale, {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date(dateStr));
  }

  function handleFavorite(e: MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    const next = toggleFavorite(story.id);
    setFav(next);
    onFavoriteChange?.();
  }

  function handleDelete(e: MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    onDelete?.(story.id);
  }

  return (
    <article className="group relative flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50 via-white to-white p-[1px] shadow-md transition hover:-translate-y-0.5 hover:shadow-lg">
      {/* Thumbnail */}
      {story.imageUrl ? (
        <div className="aspect-[16/9] w-full overflow-hidden bg-violet-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={story.imageUrl} alt="" className="h-full w-full object-cover transition group-hover:scale-105" />
        </div>
      ) : (
        <div className="flex aspect-[16/9] w-full items-center justify-center bg-gradient-to-br from-violet-100 to-purple-50">
          <IconBook className="h-10 w-10 text-violet-300" />
        </div>
      )}
      <div className="flex h-full flex-col rounded-b-2xl bg-white p-5">
        <div className="mb-3 flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="rounded-xl bg-violet-100 px-2.5 py-1 text-xs font-medium text-violet-700">
              {LANGUAGE_LABELS[story.language] ?? story.language}
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleFavorite}
                aria-label={fav ? t("removeFavorite") : t("addFavorite")}
                className={`rounded-xl p-2 transition ${
                  fav
                    ? "bg-red-50 text-red-500"
                    : "bg-violet-50 text-slate-500 hover:text-violet-700"
                }`}
              >
                <IconHeart filled={fav} />
              </button>
              {onDelete && (
                <button
                  type="button"
                  onClick={handleDelete}
                  aria-label={t("deleteStory")}
                  title={t("deleteStory")}
                  className="rounded-xl bg-red-50 p-2 text-red-500 transition hover:bg-red-100"
                >
                  <IconTrash className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        <h3 className="line-clamp-2 text-lg font-bold leading-snug text-slate-900">
          {story.title}
        </h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
          {excerpt(story.content)}
        </p>
        <p className="mt-4 text-xs text-slate-500">{formatDate(story.createdAt)}</p>
      </div>
    </article>
  );
}
