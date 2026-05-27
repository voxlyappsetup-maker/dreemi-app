"use client";

import { useCallback, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import type { Story } from "@dreemi/types";
import { Link, useRouter } from "../../../../i18n/routing";
import {
  type Child,
  ApiError,
  getChild,
  deleteStory,
  fetchChildStories,
} from "../../../../lib/api";
import { clearAuth, getStoredUser, isAuthenticated } from "../../../../lib/storage";
import { DashboardSidebar } from "../../../../components/DashboardSidebar";
import { StoryCard } from "../../../../components/StoryCard";
import { IconSparkle, IconUsers } from "../../../../components/icons";

const PAGE_BG = "min-h-screen bg-gradient-to-b from-violet-200 via-violet-50 to-white";

const SKIN_COLORS: Record<string, string> = {
  light: "#FDDCB5", medium: "#C68642", dark: "#8D5524",
};
const HAIR_COLORS: Record<string, string> = {
  black: "#1a1a1a", brown: "#6B3A2A", blonde: "#E8D44D", red: "#C0392B",
};
const ANIMAL_EMOJI: Record<string, string> = {
  cat: "🐱", dog: "🐶", rabbit: "🐰", horse: "🐴",
  bird: "🐦", fish: "🐠", turtle: "🐢", dinosaur: "🦕",
};

export default function ChildProfilePage({
  params,
}: {
  params: { id: string; locale: string };
}) {
  const router = useRouter();
  const t = useTranslations("childProfile");
  const tc = useTranslations("common");
  const tch = useTranslations("children");
  const tStory = useTranslations("storyCard");
  const [child, setChild] = useState<Child | null>(null);
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userPlan, setUserPlan] = useState<"FREE" | "INDIVIDUAL" | "FAMILY" | "SCHOOL">("FREE");
  const [favTick, setFavTick] = useState(0);

  const reloadStories = useCallback(async () => {
    const user = getStoredUser();
    if (!user?.id) return;
    try {
      const childStories = await fetchChildStories(user.id, params.id);
      setStories(childStories);
    } catch {
      setStories([]);
    }
  }, [params.id]);

  async function handleDeleteStory(storyId: string) {
    if (!window.confirm(tStory("deleteConfirm"))) return;
    try {
      await deleteStory(storyId);
      await reloadStories();
    } catch {
      window.alert(tStory("deleteError"));
    }
  }

  const load = useCallback(async () => {
    try {
      const user = getStoredUser();
      if (!user?.id) return;

      const [childData, childStories] = await Promise.all([
        getChild(params.id),
        fetchChildStories(user.id, params.id),
      ]);
      setChild(childData);
      setStories(childStories);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        clearAuth();
        router.replace("/login");
        return;
      }
      if (err instanceof ApiError && err.status === 404) {
        setError("not_found");
      } else {
        setError("load_error");
      }
    } finally {
      setLoading(false);
    }
  }, [params.id, router]);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace("/login");
      return;
    }
    const u = getStoredUser();
    if (u?.plan) setUserPlan(u.plan);
    load();
  }, [router, load]);

  if (loading) {
    return (
      <main className={`flex items-center justify-center ${PAGE_BG}`}>
        <p className="text-slate-600">{tc("loading")}</p>
      </main>
    );
  }

  if (error || !child) {
    return (
      <div className={`${PAGE_BG} lg:pe-64`}>
        <DashboardSidebar
          onLogout={() => { clearAuth(); router.replace("/login"); }}
          plan={userPlan}
        />
        <main className="flex flex-col items-center justify-center px-4 py-20">
          <IconUsers className="mb-4 h-16 w-16 text-violet-300" />
          <h1 className="text-2xl font-bold text-slate-900">
            {error === "not_found" ? t("notFound") : t("loadError")}
          </h1>
          <p className="mt-2 text-slate-600">
            {error === "not_found" ? t("notFoundDesc") : ""}
          </p>
          <Link
            href="/children"
            className="mt-6 rounded-2xl bg-violet-600 px-6 py-3 font-semibold text-white shadow-lg transition hover:bg-violet-700"
          >
            {t("back")}
          </Link>
        </main>
      </div>
    );
  }

  void favTick;

  return (
    <div className={`${PAGE_BG} lg:pe-64`}>
      <DashboardSidebar
        onLogout={() => { clearAuth(); router.replace("/login"); }}
        plan={userPlan}
      />

      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-8 lg:py-10">
        {/* Back + Action buttons */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-xl border border-violet-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-violet-50 hover:text-violet-700"
            >
              ←
            </Link>
            <Link
              href="/children"
              className="inline-flex items-center gap-2 rounded-xl border border-violet-200 bg-white px-4 py-2 text-sm font-semibold text-violet-700 transition hover:bg-violet-50"
            >
              {t("back")}
            </Link>
          </div>
          <Link
            href={`/generate?childId=${child.id}`}
            className="inline-flex items-center gap-2 rounded-2xl bg-violet-600 px-5 py-3 font-semibold text-white shadow-lg transition hover:bg-violet-700"
          >
            <IconSparkle className="h-5 w-5" />
            {t("newStoryFor", { name: child.name })}
          </Link>
        </div>

        {/* Child info card */}
        <div className="mb-10 overflow-hidden rounded-2xl border border-violet-100 bg-white shadow-lg">
          <div className="bg-gradient-to-l from-violet-100 via-purple-50 to-violet-50 px-6 py-8 sm:px-8">
            <div className="flex items-center gap-5">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg ring-4 ring-white">
                <span className="text-5xl">{child.gender === "girl" ? "👧" : "👦"}</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">{child.name}</h1>
                <p className="mt-1 text-slate-600">{t("age", { age: child.age })}</p>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 px-6 py-5 sm:px-8">
            {/* Appearance */}
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-violet-50 px-3 py-1.5 text-xs text-slate-600">
              <span className="h-3.5 w-3.5 rounded-full border border-slate-200" style={{ backgroundColor: SKIN_COLORS[child.skinTone] ?? SKIN_COLORS.medium }} />
              {tch(`skin${child.skinTone.charAt(0).toUpperCase() + child.skinTone.slice(1)}` as "skinLight")}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-violet-50 px-3 py-1.5 text-xs text-slate-600">
              <span className="h-3.5 w-3.5 rounded-full border border-slate-200" style={{ backgroundColor: HAIR_COLORS[child.hairColor] ?? HAIR_COLORS.black }} />
              {tch(`hair${child.hairColor.charAt(0).toUpperCase() + child.hairColor.slice(1)}` as "hairBlack")}
            </span>
            <span className="rounded-lg bg-violet-50 px-3 py-1.5 text-xs text-slate-600">
              {child.gender === "girl" ? tch("girl") : tch("boy")}
            </span>
            {child.personality && (
              <span className="rounded-lg bg-purple-50 px-3 py-1.5 text-xs font-medium text-purple-600">
                {tch(`personality${child.personality.charAt(0).toUpperCase() + child.personality.slice(1)}` as `personalityCurious`)}
              </span>
            )}
            {child.favAnimal && (
              <span className="rounded-lg bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-700">
                {ANIMAL_EMOJI[child.favAnimal] ?? ""} {tch(`animal${child.favAnimal.charAt(0).toUpperCase() + child.favAnimal.slice(1)}` as `animalCat`)}
              </span>
            )}
          </div>
          {child.hobbies && (
            <div className="border-t border-violet-50 px-6 py-4 sm:px-8">
              <p className="mb-2 text-xs font-semibold text-slate-500">{t("hobbies")}</p>
              <div className="flex flex-wrap gap-2">
                {child.hobbies.split(",").map((h) => h.trim()).filter(Boolean).map((h) => (
                  <span key={h} className="rounded-xl bg-slate-100 px-3 py-1 text-xs text-slate-600">{h}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Stories section */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">
            {t("storiesTitle", { name: child.name })}
            <span className="ms-2 text-sm font-normal text-slate-500">
              ({t("storiesCount", { count: stories.length })})
            </span>
          </h2>
        </div>

        {stories.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-violet-200 bg-white p-12 text-center shadow-md">
            <p className="text-lg font-medium text-slate-900">
              {t("noStories", { name: child.name })}
            </p>
            <p className="mt-2 text-sm text-slate-600">{t("noStoriesDesc")}</p>
            <Link
              href={`/generate?childId=${child.id}`}
              className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-violet-600 px-6 py-3 font-semibold text-white shadow-lg transition hover:bg-violet-700"
            >
              <IconSparkle className="h-5 w-5" />
              {t("createFirst")}
            </Link>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {stories.map((story) => (
              <Link key={story.id} href={`/story/${story.id}`}>
                <StoryCard
                  story={story}
                  onFavoriteChange={() => setFavTick((v) => v + 1)}
                  onDelete={handleDeleteStory}
                />
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
