"use client";

import type { Story } from "@dreemi/types";
import { IconHeart } from "./icons";
import { isFavorite, toggleFavorite } from "@/lib/favorites";
import { useState, type MouseEvent } from "react";

const LANGUAGE_LABELS: Record<string, string> = {
  ar: "عربي",
  en: "EN",
  fr: "FR",
};

function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat("ar", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(dateStr));
}

function excerpt(content: string, max = 100): string {
  const trimmed = content.replace(/\s+/g, " ").trim();
  if (trimmed.length <= max) return trimmed;
  return `${trimmed.slice(0, max)}…`;
}

interface StoryCardProps {
  story: Story;
  onFavoriteChange?: () => void;
}

export function StoryCard({ story, onFavoriteChange }: StoryCardProps) {
  const [fav, setFav] = useState(() => isFavorite(story.id) || story.isFavorite);

  function handleFavorite(e: MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    const next = toggleFavorite(story.id);
    setFav(next);
    onFavoriteChange?.();
  }

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50 via-white to-white p-[1px] shadow-md transition hover:-translate-y-0.5 hover:shadow-lg">
      <div className="flex h-full flex-col rounded-2xl bg-white p-5">
        <div className="mb-3 flex items-start justify-between gap-2">
          <div className="flex h-10 w-8 shrink-0 items-end justify-center rounded-lg bg-gradient-to-b from-violet-600 to-violet-800 shadow-md">
            <div className="mb-1 h-1 w-5 rounded-sm bg-white/40" />
          </div>
          <div className="flex items-center gap-2">
            <span className="rounded-xl bg-violet-100 px-2.5 py-1 text-xs font-medium text-violet-700">
              {LANGUAGE_LABELS[story.language] ?? story.language}
            </span>
            <button
              type="button"
              onClick={handleFavorite}
              aria-label={fav ? "إزالة من المفضلة" : "إضافة للمفضلة"}
              className={`rounded-xl p-2 transition ${
                fav
                  ? "bg-red-50 text-red-500"
                  : "bg-violet-50 text-slate-500 hover:text-violet-700"
              }`}
            >
              <IconHeart filled={fav} />
            </button>
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
