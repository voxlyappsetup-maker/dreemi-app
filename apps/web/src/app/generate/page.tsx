"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import type { Language, Story } from "@qisas/types";
import { ApiError, generateStory } from "@/lib/api";
import { isAuthenticated } from "@/lib/storage";
import { LoadingSpinner } from "@/components/LoadingSpinner";

export default function GeneratePage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [childName, setChildName] = useState("");
  const [childAge, setChildAge] = useState(5);
  const [theme, setTheme] = useState("");
  const [moral, setMoral] = useState("");
  const [language, setLanguage] = useState<Language>("ar");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [story, setStory] = useState<Story | null>(null);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace("/login");
      return;
    }
    setReady(true);
  }, [router]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setStory(null);
    setLoading(true);
    try {
      const data = await generateStory({
        childName,
        childAge,
        theme,
        moral: moral.trim() || undefined,
        language,
      });
      setStory(data.story);
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "فشل توليد القصة، حاول مرة أخرى"
      );
    } finally {
      setLoading(false);
    }
  }

  if (!ready) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-muted">جاري التحميل...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-indigo-50 to-[#faf8ff]">
      <header className="border-b border-white/60 bg-white/70 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-5">
          <Link href="/dashboard" className="text-sm text-primary hover:underline">
            ← العودة للوحة التحكم
          </Link>
          <span className="font-bold text-primary">قصة جديدة</span>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-6 py-10">
        <h1 className="text-2xl font-bold text-foreground">توليد قصة نوم</h1>
        <p className="mt-2 text-muted">
          املأ التفاصيل وسنكتب قصة مخصصة لطفلك خلال لحظات.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-5 rounded-3xl bg-card p-6 shadow-card sm:p-8"
        >
          <div>
            <label htmlFor="childName" className="mb-1 block text-sm font-medium">
              اسم الطفل
            </label>
            <input
              id="childName"
              type="text"
              required
              maxLength={50}
              value={childName}
              onChange={(e) => setChildName(e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              placeholder="مثال: سارة"
            />
          </div>

          <div>
            <label htmlFor="childAge" className="mb-1 block text-sm font-medium">
              العمر (٢–١٢)
            </label>
            <input
              id="childAge"
              type="number"
              required
              min={2}
              max={12}
              value={childAge}
              onChange={(e) => setChildAge(Number(e.target.value))}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div>
            <label htmlFor="theme" className="mb-1 block text-sm font-medium">
              موضوع القصة
            </label>
            <input
              id="theme"
              type="text"
              required
              maxLength={100}
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              placeholder="مثال: الصداقة، المغامرة، الحيوانات"
            />
          </div>

          <div>
            <label htmlFor="moral" className="mb-1 block text-sm font-medium">
              القيمة التربوية (اختياري)
            </label>
            <input
              id="moral"
              type="text"
              maxLength={100}
              value={moral}
              onChange={(e) => setMoral(e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              placeholder="مثال: الصدق، التعاون"
            />
          </div>

          <div>
            <label htmlFor="language" className="mb-1 block text-sm font-medium">
              لغة القصة
            </label>
            <select
              id="language"
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            >
              <option value="ar">العربية</option>
              <option value="en">English</option>
              <option value="fr">Français</option>
            </select>
          </div>

          {error && (
            <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-primary py-3 font-semibold text-white transition hover:bg-primary-dark disabled:opacity-60"
          >
            {loading ? "جاري التوليد..." : "توليد القصة"}
          </button>
        </form>

        {loading && (
          <LoadingSpinner label="نكتب قصة سحرية لطفلك، انتظر قليلاً..." />
        )}

        {story && !loading && (
          <article className="mt-10 overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 to-violet-700 p-1 shadow-soft">
            <div className="rounded-[1.35rem] bg-card p-6 sm:p-8">
              <div className="mb-4 flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-primary">قصة لـ {story.childName}</p>
                  <h2 className="mt-1 text-2xl font-bold text-foreground">
                    {story.title}
                  </h2>
                </div>
                <span className="shrink-0 rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800">
                  {story.language === "ar"
                    ? "عربي"
                    : story.language === "en"
                      ? "EN"
                      : "FR"}
                </span>
              </div>

              <div className="prose prose-sm max-w-none whitespace-pre-wrap leading-relaxed text-foreground/90">
                {story.content}
              </div>

              {story.moral && (
                <div className="mt-6 rounded-2xl border border-primary/10 bg-indigo-50 px-4 py-4">
                  <p className="text-sm font-semibold text-primary">القيمة المستفادة</p>
                  <p className="mt-1 text-foreground/80">{story.moral}</p>
                </div>
              )}
            </div>
          </article>
        )}
      </div>
    </main>
  );
}
