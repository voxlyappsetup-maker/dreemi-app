"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import type { Story, User } from "@dreemi/types";
import { Link, useRouter } from "../../../i18n/routing";
import { fetchStories, getMe } from "../../../lib/api";
import { getFavoriteIds } from "../../../lib/favorites";
import { clearAuth, getStoredUser, isAuthenticated, saveUser } from "../../../lib/storage";
import { DashboardSidebar } from "../../../components/DashboardSidebar";
import { StoryCard } from "../../../components/StoryCard";
import { IconSparkle } from "../../../components/icons";

const BTN_PRIMARY =
  "inline-flex items-center justify-center gap-2 rounded-2xl bg-violet-600 px-6 py-3 font-semibold text-white shadow-lg transition hover:bg-violet-700";

const PAGE_BG = "min-h-screen bg-gradient-to-b from-violet-200 via-violet-50 to-white";

export default function DashboardPage() {
  const tc = useTranslations("common");
  return (
    <Suspense
      fallback={
        <main className={`flex items-center justify-center ${PAGE_BG}`}>
          <p className="text-slate-600">{tc("loading")}</p>
        </main>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations("dashboard");
  const tc = useTranslations("common");
  const [user, setUser] = useState<User | null>(null);
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [favTick, setFavTick] = useState(0);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const loadStories = useCallback(async (userId: string) => {
    try {
      const list = await fetchStories(userId);
      setStories(list);
    } catch {
      setStories([]);
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace("/login");
      return;
    }

    const u = getStoredUser();
    setUser(u);

    const isPaymentSuccess = searchParams.get("success") === "true";

    if (isPaymentSuccess) {
      getMe()
        .then((freshUser) => {
          saveUser(freshUser);
          setUser(freshUser);
          setSuccessMsg(t("subscriptionSuccess"));
          router.replace("/dashboard", { scroll: false });
          setTimeout(() => setSuccessMsg(null), 6000);
        })
        .catch(() => {});
    }

    if (u?.id) {
      loadStories(u.id).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stats = useMemo(() => {
    void favTick;
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const favIds = getFavoriteIds();
    const thisMonth = stories.filter(
      (s) => new Date(s.createdAt) >= monthStart
    ).length;
    const favorites = stories.filter(
      (s) => s.isFavorite || favIds.includes(s.id)
    ).length;
    return { total: stories.length, thisMonth, favorites };
  }, [stories, favTick]);

  if (!user && loading) {
    return (
      <main className={`flex items-center justify-center ${PAGE_BG}`}>
        <p className="text-slate-600">{tc("loading")}</p>
      </main>
    );
  }

  const displayName = user?.name ?? user?.email ?? "";
  const plan = user?.plan ?? "FREE";
  const isFree = plan === "FREE";

  return (
    <div className={`${PAGE_BG} lg:pe-64`}>
      <DashboardSidebar
        onLogout={() => {
          clearAuth();
          router.replace("/login");
        }}
        plan={plan}
      />

      <main className="px-4 py-8 sm:px-8 lg:py-10">
        {successMsg && (
          <div className="mb-6 rounded-2xl border border-green-200 bg-green-50 px-5 py-4 text-center text-sm font-medium text-green-800 shadow-sm">
            {successMsg}
          </div>
        )}

        {isFree && (
          <div className="mb-6 flex flex-col items-start gap-3 rounded-2xl border border-violet-200 bg-gradient-to-l from-violet-50 to-white px-5 py-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-medium text-slate-700">{t("freeBanner")}</p>
            <Link href="/pricing" className="shrink-0 rounded-2xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-violet-700">
              {tc("upgradePlan")}
            </Link>
          </div>
        )}

        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              {t("welcome", { name: displayName })}
            </h1>
            <p className="mt-2 text-slate-600">{t("subtitle")}</p>
          </div>
          <Link href="/generate" className={`${BTN_PRIMARY} shrink-0 self-start sm:self-center`}>
            <IconSparkle className="h-5 w-5" />
            {t("newStory")}
          </Link>
        </div>

        <div className="mb-10 grid gap-4 sm:grid-cols-3">
          {[
            { label: t("totalStories"), value: stats.total, accent: "bg-violet-600" },
            { label: t("thisMonth"), value: stats.thisMonth, accent: "bg-violet-400" },
            { label: t("favorites"), value: stats.favorites, accent: "bg-purple-500" },
          ].map((stat) => (
            <div key={stat.label} className="flex items-center gap-4 rounded-2xl border border-violet-100 bg-white p-6 shadow-md">
              <span className={`flex h-12 w-12 items-center justify-center rounded-2xl text-xl font-bold text-white shadow-md ${stat.accent}`}>
                {stat.value}
              </span>
              <div>
                <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                <p className="text-sm text-slate-600">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        <section>
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">{t("recentStories")}</h2>
            <Link href="/generate" className="text-sm font-medium text-violet-700 hover:text-violet-800 hover:underline">
              {t("addNewStory")}
            </Link>
          </div>

          {loading ? (
            <p className="text-slate-600">{t("loadingStories")}</p>
          ) : stories.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-violet-200 bg-white p-12 text-center shadow-md">
              <p className="text-lg font-medium text-slate-900">{t("noStoriesYet")}</p>
              <p className="mt-2 text-sm text-slate-600">{t("noStoriesDesc")}</p>
              <Link href="/generate" className={`${BTN_PRIMARY} mt-6`}>
                {t("startNow")}
              </Link>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {stories.map((story) => (
                <Link key={story.id} href={`/story/${story.id}`}>
                  <StoryCard story={story} onFavoriteChange={() => setFavTick((t) => t + 1)} />
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

