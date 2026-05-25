"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { Language, Story } from "@dreemi/types";
import { ApiError, generateStory } from "../../lib/api";
import { toggleFavorite, isFavorite } from "../../lib/favorites";
import { clearAuth, getStoredUser, isAuthenticated } from "../../lib/storage";
import { DashboardSidebar } from "../../components/DashboardSidebar";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import { FormError } from "../../components/FormError";
import { INPUT_CLASS } from "../../components/PasswordInput";
import { IconHeart, IconShare, IconSparkle } from "../../components/icons";

const STEPS = ["معلومات الطفل", "إعدادات القصة", "القصة جاهزة"] as const;

const PAGE_BG = "min-h-screen bg-gradient-to-b from-violet-200 via-violet-50 to-white";

const BTN_PRIMARY =
  "inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-violet-600 px-6 py-3 font-semibold text-white shadow-lg transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60";

const BTN_SECONDARY =
  "inline-flex flex-1 items-center justify-center gap-2 rounded-2xl border border-violet-200 bg-white px-6 py-3 font-semibold text-violet-700 shadow-md transition hover:border-violet-300 hover:bg-violet-50";

export default function GeneratePage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [step, setStep] = useState(1);
  const [childName, setChildName] = useState("");
  const [childAge, setChildAge] = useState(5);
  const [theme, setTheme] = useState("");
  const [moral, setMoral] = useState("");
  const [language, setLanguage] = useState<Language>("ar");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [story, setStory] = useState<Story | null>(null);
  const [fav, setFav] = useState(false);
  const [shareMsg, setShareMsg] = useState<string | null>(null);
  const [userPlan, setUserPlan] = useState<"FREE" | "INDIVIDUAL" | "FAMILY" | "SCHOOL">("FREE");

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace("/login");
      return;
    }
    const u = getStoredUser();
    if (u?.plan) setUserPlan(u.plan);
    setReady(true);
  }, [router]);

  function validateStep1(): boolean {
    if (!childName.trim()) {
      setError("يرجى إدخال اسم الطفل");
      return false;
    }
    if (childAge < 2 || childAge > 12) {
      setError("العمر يجب أن يكون بين ٢ و ١٢");
      return false;
    }
    return true;
  }

  function validateStep2(): boolean {
    if (!theme.trim()) {
      setError("يرجى إدخال موضوع القصة");
      return false;
    }
    return true;
  }

  async function runGenerate() {
    setError(null);
    setStory(null);
    setStep(3);
    setLoading(true);
    try {
      const data = await generateStory({
        childName: childName.trim(),
        childAge,
        theme: theme.trim(),
        moral: moral.trim() || undefined,
        language,
      });
      setStory(data.story);
      setFav(isFavorite(data.story.id) || data.story.isFavorite);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        clearAuth();
        router.replace("/login");
        return;
      }
      setError(
        err instanceof ApiError ? err.message : "فشل توليد القصة، حاول مرة أخرى"
      );
      setStep(2);
    } finally {
      setLoading(false);
    }
  }

  function handleNext() {
    setError(null);
    if (step === 1 && validateStep1()) setStep(2);
    else if (step === 2 && validateStep2()) runGenerate();
  }

  function handleBack() {
    setError(null);
    if (step === 2) setStep(1);
    else if (step === 3 && !loading) setStep(2);
  }

  async function handleShare() {
    if (!story) return;
    const text = `${story.title}\n\n${story.content.slice(0, 500)}…`;
    if (navigator.share) {
      try {
        await navigator.share({ title: story.title, text });
        return;
      } catch {
        /* fall through to copy */
      }
    }
    await navigator.clipboard.writeText(text);
    setShareMsg("تم نسخ القصة");
    setTimeout(() => setShareMsg(null), 2500);
  }

  function handleFavorite() {
    if (!story) return;
    setFav(toggleFavorite(story.id));
  }

  function startOver() {
    setStep(1);
    setStory(null);
    setError(null);
    setShareMsg(null);
  }

  if (!ready) {
    return (
      <main className={`flex items-center justify-center ${PAGE_BG}`}>
        <p className="text-slate-600">جاري التحميل...</p>
      </main>
    );
  }

  const displayStep = loading ? 3 : step;

  return (
    <div className={`${PAGE_BG} lg:pr-64`}>
      <DashboardSidebar
        onLogout={() => {
          clearAuth();
          router.replace("/login");
        }}
        plan={userPlan}
      />

      <main className="mx-auto max-w-2xl px-4 py-8 sm:px-8 lg:py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">توليد قصة نوم</h1>
          <p className="mt-1 text-sm text-slate-600">٣ خطوات بسيطة — قصة مخصصة لطفلك.</p>
        </div>

        <div className="mb-10 flex items-center justify-between gap-2">
          {STEPS.map((label, i) => {
            const n = i + 1;
            const active = displayStep === n;
            const done = displayStep > n;
            return (
              <div key={label} className="flex flex-1 flex-col items-center gap-2">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-2xl text-sm font-bold transition ${
                    active
                      ? "bg-violet-600 text-white shadow-md"
                      : done
                        ? "bg-violet-100 text-violet-700"
                        : "bg-violet-50 text-slate-500"
                  }`}
                >
                  {done ? "✓" : n}
                </div>
                <span
                  className={`hidden text-center text-xs sm:block ${
                    active ? "font-semibold text-violet-700" : "text-slate-500"
                  }`}
                >
                  {label}
                </span>
              </div>
            );
          })}
        </div>

        <div className="rounded-2xl border border-violet-100 bg-white p-6 shadow-md sm:p-8">
          {step === 1 && (
            <div className="space-y-5">
              <h2 className="text-lg font-bold text-slate-900">من بطل القصة؟</h2>
              <div>
                <label htmlFor="childName" className="mb-2 block text-sm font-semibold text-slate-900">
                  اسم الطفل
                </label>
                <input
                  id="childName"
                  type="text"
                  required
                  maxLength={50}
                  value={childName}
                  onChange={(e) => setChildName(e.target.value)}
                  className={INPUT_CLASS}
                  placeholder="مثال: يوسف"
                />
              </div>
              <div>
                <label htmlFor="childAge" className="mb-2 block text-sm font-semibold text-slate-900">
                  العمر (٢–١٢)
                </label>
                <input
                  id="childAge"
                  type="number"
                  min={2}
                  max={12}
                  value={childAge}
                  onChange={(e) => setChildAge(Number(e.target.value))}
                  className={INPUT_CLASS}
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <h2 className="text-lg font-bold text-slate-900">تفاصيل القصة</h2>
              <div>
                <label htmlFor="theme" className="mb-2 block text-sm font-semibold text-slate-900">
                  موضوع القصة
                </label>
                <input
                  id="theme"
                  type="text"
                  required
                  maxLength={100}
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  className={INPUT_CLASS}
                  placeholder="مثال: الفضاء والنجوم"
                />
              </div>
              <div>
                <label htmlFor="moral" className="mb-2 block text-sm font-semibold text-slate-900">
                  القيمة التربوية (اختياري)
                </label>
                <input
                  id="moral"
                  type="text"
                  maxLength={100}
                  value={moral}
                  onChange={(e) => setMoral(e.target.value)}
                  className={INPUT_CLASS}
                  placeholder="مثال: الشجاعة"
                />
              </div>
              <div>
                <label htmlFor="language" className="mb-2 block text-sm font-semibold text-slate-900">
                  لغة القصة
                </label>
                <select
                  id="language"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as Language)}
                  className={INPUT_CLASS}
                >
                  <option value="ar">العربية</option>
                  <option value="en">English</option>
                  <option value="fr">Français</option>
                </select>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              {loading && (
                <LoadingSpinner label="نكتب قصة سحرية لطفلك، انتظر قليلاً..." />
              )}
              {story && !loading && (
                <article className="overflow-hidden rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50 to-white">
                  <div className="border-b border-violet-100 bg-white/80 px-6 py-5">
                    <p className="text-sm font-medium text-violet-700">
                      قصة لـ {story.childName}
                    </p>
                    <h2 className="mt-1 text-2xl font-bold text-slate-900">
                      {story.title}
                    </h2>
                  </div>
                  <div className="max-h-[50vh] overflow-y-auto px-6 py-6">
                    <p className="whitespace-pre-wrap leading-loose text-slate-800">
                      {story.content}
                    </p>
                    {story.moral && (
                      <div className="mt-6 rounded-2xl bg-violet-50 px-4 py-4">
                        <p className="text-sm font-semibold text-violet-700">
                          القيمة المستفادة
                        </p>
                        <p className="mt-1 text-slate-700">{story.moral}</p>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-3 border-t border-violet-100 bg-white/90 px-6 py-4">
                    <button
                      type="button"
                      onClick={handleShare}
                      className={`${BTN_SECONDARY} flex-1 text-sm sm:flex-none`}
                    >
                      <IconShare />
                      مشاركة
                    </button>
                    <button
                      type="button"
                      onClick={handleFavorite}
                      className={`${BTN_SECONDARY} flex-1 text-sm sm:flex-none ${
                        fav ? "border-red-200 bg-red-50 text-red-600" : ""
                      }`}
                    >
                      <IconHeart filled={fav} />
                      {fav ? "في المفضلة" : "حفظ في المفضلة"}
                    </button>
                    {shareMsg && (
                      <span className="w-full text-center text-sm text-violet-700">
                        {shareMsg}
                      </span>
                    )}
                  </div>
                </article>
              )}
            </div>
          )}

          {error && step !== 3 && (
            <div className="mt-4">
              <FormError message={error} />
            </div>
          )}
          {error && step === 3 && !loading && (
            <div className="mt-4">
              <FormError message={error} />
            </div>
          )}

          {step < 3 && (
            <div className="mt-8 flex gap-3">
              {step > 1 && (
                <button type="button" onClick={handleBack} className={BTN_SECONDARY}>
                  السابق
                </button>
              )}
              <button type="button" onClick={handleNext} className={BTN_PRIMARY}>
                {step === 2 ? (
                  <>
                    <IconSparkle className="h-5 w-5" />
                    توليد القصة
                  </>
                ) : (
                  "التالي"
                )}
              </button>
            </div>
          )}

          {step === 3 && story && !loading && (
            <>
              <div className="mt-6 flex flex-wrap gap-3">
                <button type="button" onClick={startOver} className={BTN_SECONDARY}>
                  قصة جديدة
                </button>
                <Link
                  href="/dashboard"
                  className="inline-flex items-center justify-center rounded-2xl bg-violet-600 px-6 py-3 font-semibold text-white shadow-lg transition hover:bg-violet-700"
                >
                  العودة للوحة التحكم
                </Link>
              </div>

              {userPlan === "FREE" && (
                <div className="mt-6 flex flex-col items-start gap-3 rounded-2xl border border-violet-200 bg-gradient-to-l from-violet-50 to-white px-5 py-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm font-medium text-slate-700">
                    هل أعجبتك القصة؟ اشترك للحصول على قصص غير محدودة
                  </p>
                  <Link
                    href="/pricing"
                    className="shrink-0 rounded-2xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-violet-700"
                  >
                    ترقية الخطة
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
