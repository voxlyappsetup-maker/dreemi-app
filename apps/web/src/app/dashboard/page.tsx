"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { Story, User } from "@dreemi/types";
import { fetchStories } from "../../lib/api";
import { getFavoriteIds } from "../../lib/favorites";
import { clearAuth, getStoredUser, isAuthenticated } from "../../lib/storage";
import { DashboardSidebar } from "../../components/DashboardSidebar";
import { StoryCard } from "../../components/StoryCard";
import { IconSparkle } from "../../components/icons";

const BTN_PRIMARY =
  "inline-flex items-center justify-center gap-2 rounded-2xl bg-violet-600 px-6 py-3 font-semibold text-white shadow-lg transition hover:bg-violet-700";

const PAGE_BG = "min-h-screen bg-gradient-to-b from-violet-200 via-violet-50 to-white";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [favTick, setFavTick] = useState(0);

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
    if (u?.id) {
      loadStories(u.id).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [router, loadStories]);

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
    return {
      total: stories.length,
      thisMonth,
      favorites,
    };
  }, [stories, favTick]);

  if (!user && loading) {
    return (
      <main className={`flex items-center justify-center ${PAGE_BG}`}>
        <p className="text-slate-600">جاري التحميل...</p>
      </main>
    );
  }

  const displayName = user?.name ?? user?.email ?? "صديقنا";
  const plan = user?.plan ?? "FREE";
  const isFree = plan === "FREE";

  return (
    <div className={`${PAGE_BG} lg:pr-64`}>
      <DashboardSidebar
        onLogout={() => {
          clearAuth();
          router.replace("/login");
        }}
        plan={plan}
      />

      <main className="px-4 py-8 sm:px-8 lg:py-10">
        {isFree && (
          <div className="mb-6 flex flex-col items-start gap-3 rounded-2xl border border-violet-200 bg-gradient-to-l from-violet-50 to-white px-5 py-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-medium text-slate-700">
              لديك ٣ قصص مجانية هذا الشهر — قم بالترقية للحصول على قصص غير محدودة
            </p>
            <Link
              href="/pricing"
              className="shrink-0 rounded-2xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-violet-700"
            >
              ترقية الخطة
            </Link>
          </div>
        )}

        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              مرحباً {displayName}
            </h1>
            <p className="mt-2 text-slate-600">لوحة تحكم عائلتك — قصص الليلة في مكان واحد.</p>
          </div>
          <Link href="/generate" className={`${BTN_PRIMARY} shrink-0 self-start sm:self-center`}>
            <IconSparkle className="h-5 w-5" />
            قصة جديدة
          </Link>
        </div>

        <div className="mb-10 grid gap-4 sm:grid-cols-3">
          {[
            { label: "إجمالي القصص", value: stats.total, accent: "bg-violet-600" },
            { label: "هذا الشهر", value: stats.thisMonth, accent: "bg-violet-400" },
            { label: "المفضلة", value: stats.favorites, accent: "bg-purple-500" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="flex items-center gap-4 rounded-2xl border border-violet-100 bg-white p-6 shadow-md"
            >
              <span
                className={`flex h-12 w-12 items-center justify-center rounded-2xl text-xl font-bold text-white shadow-md ${stat.accent}`}
              >
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
            <h2 className="text-xl font-bold text-slate-900">قصصك الأخيرة</h2>
            <Link
              href="/generate"
              className="text-sm font-medium text-violet-700 hover:text-violet-800 hover:underline"
            >
              + قصة جديدة
            </Link>
          </div>

          {loading ? (
            <p className="text-slate-600">جاري تحميل القصص...</p>
          ) : stories.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-violet-200 bg-white p-12 text-center shadow-md">
              <p className="text-lg font-medium text-slate-900">لا توجد قصص بعد</p>
              <p className="mt-2 text-sm text-slate-600">
                أنشئ أول قصة نوم مخصصة لطفلك الليلة.
              </p>
              <Link href="/generate" className={`${BTN_PRIMARY} mt-6`}>
                ابدأ الآن
              </Link>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {stories.map((story) => (
                <StoryCard
                  key={story.id}
                  story={story}
                  onFavoriteChange={() => setFavTick((t) => t + 1)}
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
