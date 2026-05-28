"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import type { Language, Story } from "@dreemi/types";
import { Link, useRouter } from "../../../i18n/routing";
import { type Child, ApiError, generateStory, fetchChildren } from "../../../lib/api";
import { toggleFavorite, isFavorite } from "../../../lib/favorites";
import { clearAuth, getStoredUser, isAuthenticated } from "../../../lib/storage";
import { DashboardSidebar } from "../../../components/DashboardSidebar";
import { LoadingSpinner } from "../../../components/LoadingSpinner";
import { FormError } from "../../../components/FormError";
import { INPUT_CLASS } from "../../../components/PasswordInput";
import { IconCopy, IconHeart, IconMail, IconPrinter, IconShare, IconSparkle } from "../../../components/icons";
import { StoryContent } from "../../../components/StoryContent";
import { exportStoryPdf } from "../../../lib/exportStoryPdf";

const PAGE_BG = "min-h-screen bg-gradient-to-b from-violet-200 via-violet-50 to-white";

const BTN_PRIMARY =
  "inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-violet-600 px-6 py-3 font-semibold text-white shadow-lg transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60";

const BTN_SECONDARY =
  "inline-flex flex-1 items-center justify-center gap-2 rounded-2xl border border-violet-200 bg-white px-6 py-3 font-semibold text-violet-700 shadow-md transition hover:border-violet-300 hover:bg-violet-50";

export default function GeneratePage() {
  const tc = useTranslations("common");
  return (
    <Suspense
      fallback={
        <main className={`flex items-center justify-center ${PAGE_BG}`}>
          <p className="text-slate-600">{tc("loading")}</p>
        </main>
      }
    >
      <GenerateContent />
    </Suspense>
  );
}

function GenerateContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const locale = useLocale();
  const t = useTranslations("generate");
  const tc = useTranslations("common");
  const ta = useTranslations("auth");
  const [ready, setReady] = useState(false);
  const [step, setStep] = useState(1);
  const [childName, setChildName] = useState("");
  const [childAge, setChildAge] = useState(5);
  const [gender, setGender] = useState("boy");
  const [skinTone, setSkinTone] = useState("medium");
  const [hairColor, setHairColor] = useState("black");
  const [showAppearance, setShowAppearance] = useState(false);
  const [theme, setTheme] = useState("");
  const [moral, setMoral] = useState("");
  const [language, setLanguage] = useState<Language>(locale as Language);
  const [duration, setDuration] = useState(5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [story, setStory] = useState<Story | null>(null);
  const [fav, setFav] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [shareMsg, setShareMsg] = useState<string | null>(null);
  const [userPlan, setUserPlan] = useState<"FREE" | "INDIVIDUAL" | "FAMILY" | "SCHOOL">("FREE");
  const [childrenList, setChildrenList] = useState<Child[]>([]);
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null);

  const STEPS = [t("step1"), t("step2"), t("step3")];

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace("/login");
      return;
    }
    const u = getStoredUser();
    if (u?.plan) setUserPlan(u.plan);
    setReady(true);
    const preselect = searchParams.get("childId");
    fetchChildren().then((list) => {
      setChildrenList(list);
      if (preselect) {
        const match = list.find((c) => c.id === preselect);
        if (match) {
          setSelectedChildId(match.id);
          setChildName(match.name);
          setChildAge(match.age);
          setGender(match.gender === "girl" ? "girl" : "boy");
          setSkinTone(["light", "medium", "dark"].includes(match.skinTone) ? match.skinTone : "medium");
          setHairColor(["black", "brown", "blonde", "red"].includes(match.hairColor) ? match.hairColor : "black");
        }
      }
    }).catch(() => {});
  }, [router, searchParams]);

  function handleSelectChild(id: string | null) {
    setSelectedChildId(id);
    if (id) {
      const child = childrenList.find((c) => c.id === id);
      if (child) {
        setChildName(child.name);
        setChildAge(child.age);
        setGender(child.gender === "girl" ? "girl" : "boy");
        setSkinTone(["light", "medium", "dark"].includes(child.skinTone) ? child.skinTone : "medium");
        setHairColor(["black", "brown", "blonde", "red"].includes(child.hairColor) ? child.hairColor : "black");
        setShowAppearance(false);
      }
    }
  }

  function validateStep1(): boolean {
    if (!selectedChildId && !childName.trim()) { setError(t("errorChildName")); return false; }
    if (!selectedChildId && (childAge < 2 || childAge > 12)) { setError(t("errorAge")); return false; }
    return true;
  }

  function validateStep2(): boolean {
    if (!theme.trim()) { setError(t("errorTheme")); return false; }
    return true;
  }

  async function runGenerate() {
    setError(null);
    setStory(null);
    setStep(3);
    setLoading(true);
    try {
      const payload: Parameters<typeof generateStory>[0] = {
        childName: childName.trim(),
        childAge,
        theme: theme.trim(),
        moral: moral.trim() || undefined,
        language,
        duration,
        gender,
        skinTone,
        hairColor,
      };
      if (selectedChildId) {
        payload.childId = selectedChildId;
      }
      const data = await generateStory(payload);
      setStory(data.story);
      setFav(isFavorite(data.story.id) || data.story.isFavorite);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        clearAuth();
        router.replace("/login");
        return;
      }
      setError(err instanceof ApiError ? err.message : t("errorGenerate"));
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

  function storyUrl() {
    return `https://dreemi.app/${locale}/story/${story?.id ?? ""}`;
  }

  async function handleShare() {
    if (!story) return;
    const preview = story.content.slice(0, 200).trimEnd();
    const text = `${story.title}\n\n${preview}…\n\n${t("readFullStory")}: ${storyUrl()}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: story.title, text, url: storyUrl() });
        return;
      } catch { /* user cancelled or unsupported */ }
    }
    await navigator.clipboard.writeText(text);
    setShareMsg(t("storyCopied"));
    setTimeout(() => setShareMsg(null), 2500);
  }

  function handleEmailShare() {
    if (!story) return;
    const subject = encodeURIComponent(story.title);
    const body = encodeURIComponent(`${story.title}\n\n${story.content}${story.moral ? `\n\n${t("moralLearned")}: ${story.moral}` : ""}`);
    window.open(`mailto:?subject=${subject}&body=${body}`, "_self");
  }

  async function handleCopyFull() {
    if (!story) return;
    const full = `${story.title}\n\n${story.content}${story.moral ? `\n\n${t("moralLearned")}: ${story.moral}` : ""}`;
    await navigator.clipboard.writeText(full);
    setShareMsg(t("storyCopied"));
    setTimeout(() => setShareMsg(null), 2500);
  }

  async function handleExportPdf() {
    if (!story) return;
    setExporting(true);
    try {
      await exportStoryPdf({
        title:     story.title,
        childName: story.childName,
        content:   story.content,
        imageUrl:  story.imageUrl  ?? undefined,
        lesson:    story.moral     ?? undefined,
        locale:    story.language,
      });
    } catch (err) {
      console.error("[Generate] PDF export failed:", err);
    } finally {
      setExporting(false);
    }
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
    setSelectedChildId(null);
  }

  if (!ready) {
    return (
      <main className={`flex items-center justify-center ${PAGE_BG}`}>
        <p className="text-slate-600">{tc("loading")}</p>
      </main>
    );
  }

  const displayStep = loading ? 3 : step;

  return (
    <div className={`${PAGE_BG} lg:pe-64`}>
      <DashboardSidebar
        onLogout={() => { clearAuth(); router.replace("/login"); }}
        plan={userPlan}
      />

      <main className="mx-auto max-w-2xl px-4 py-8 sm:px-8 lg:py-10">
        <Link
          href="/dashboard"
          className="mb-4 inline-flex items-center gap-1 text-sm font-semibold text-violet-700 transition hover:text-violet-900 hover:underline"
        >
          ← {t("backToDashboard")}
        </Link>
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">{t("title")}</h1>
          <p className="mt-1 text-sm text-slate-600">{t("subtitle")}</p>
        </div>

        <div className="mb-10 flex items-center justify-between gap-2">
          {STEPS.map((label, i) => {
            const n = i + 1;
            const active = displayStep === n;
            const done = displayStep > n;
            return (
              <div key={label} className="flex flex-1 flex-col items-center gap-2">
                <div className={`flex h-10 w-10 items-center justify-center rounded-2xl text-sm font-bold transition ${active ? "bg-violet-600 text-white shadow-md" : done ? "bg-violet-100 text-violet-700" : "bg-violet-50 text-slate-500"}`}>
                  {done ? "✓" : n}
                </div>
                <span className={`hidden text-center text-xs sm:block ${active ? "font-semibold text-violet-700" : "text-slate-500"}`}>
                  {label}
                </span>
              </div>
            );
          })}
        </div>

        <div className="rounded-2xl border border-violet-100 bg-white p-6 shadow-md sm:p-8">
          {step === 1 && (
            <div className="space-y-5">
              <h2 className="text-lg font-bold text-slate-900">{t("heroQuestion")}</h2>

              {/* Child selector */}
              {childrenList.length > 0 && (
                <div>
                  <span className="mb-2 block text-sm font-semibold text-slate-900">{t("selectChild")}</span>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => handleSelectChild(null)}
                      className={`rounded-xl border px-4 py-2.5 text-sm font-medium transition ${
                        !selectedChildId
                          ? "border-violet-400 bg-violet-100 text-violet-700"
                          : "border-violet-100 bg-white text-slate-600 hover:bg-violet-50"
                      }`}
                    >
                      {t("noChildSelected")}
                    </button>
                    {childrenList.map((child) => (
                      <button
                        key={child.id}
                        type="button"
                        onClick={() => handleSelectChild(child.id)}
                        className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition ${
                          selectedChildId === child.id
                            ? "border-violet-400 bg-violet-100 text-violet-700 shadow-sm"
                            : "border-violet-100 bg-white text-slate-600 hover:bg-violet-50"
                        }`}
                      >
                        <span>{child.gender === "girl" ? "👧" : "👦"}</span>
                        <span>{child.name}</span>
                        <span className="text-xs text-slate-400">({child.age})</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Manual fields - hidden when child selected */}
              {!selectedChildId && (
                <>
                  {childrenList.length > 0 && (
                    <p className="text-xs font-medium text-slate-500">{t("orEnterManually")}</p>
                  )}
                  <div>
                    <label htmlFor="childName" className="mb-2 block text-sm font-semibold text-slate-900">{t("childName")}</label>
                    <input id="childName" type="text" required maxLength={50} value={childName} onChange={(e) => setChildName(e.target.value)} className={INPUT_CLASS} placeholder={t("childNamePlaceholder")} />
                  </div>
                  <div>
                    <label htmlFor="childAge" className="mb-2 block text-sm font-semibold text-slate-900">{t("childAge")}</label>
                    <input id="childAge" type="number" min={2} max={12} value={childAge} onChange={(e) => setChildAge(Number(e.target.value))} className={INPUT_CLASS} />
                  </div>
                </>
              )}

              {/* Show selected child summary */}
              {selectedChildId && (
                <div className="rounded-2xl border border-violet-200 bg-violet-50/60 px-4 py-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{gender === "girl" ? "👧" : "👦"}</span>
                    <div>
                      <p className="font-semibold text-slate-900">{childName}</p>
                      <p className="text-xs text-slate-500">{childAge} years &middot; {t(`gender${gender === "girl" ? "Girl" : "Boy"}`)}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Collapsible appearance section - hidden when child selected */}
              {!selectedChildId && (
              <div className="rounded-2xl border border-violet-100 bg-violet-50/50">
                <button
                  type="button"
                  onClick={() => setShowAppearance((v) => !v)}
                  className="flex w-full items-center justify-between px-4 py-3 text-sm font-semibold text-slate-700"
                >
                  <span>{t("appearanceTitle")}</span>
                  <span className="text-xs text-slate-500">{showAppearance ? "▲" : "▼"}</span>
                </button>
                {!showAppearance && (
                  <p className="px-4 pb-3 text-xs text-slate-500">{t("appearanceHint")}</p>
                )}
                {showAppearance && (
                  <div className="space-y-4 px-4 pb-4">
                    {/* Gender */}
                    <div>
                      <span className="mb-2 block text-xs font-semibold text-slate-700">{t("genderLabel")}</span>
                      <div className="flex gap-2">
                        {(["boy", "girl"] as const).map((g) => (
                          <button
                            key={g}
                            type="button"
                            onClick={() => setGender(g)}
                            className={`flex-1 rounded-xl border px-3 py-2 text-sm font-medium transition ${
                              gender === g
                                ? "border-violet-400 bg-violet-100 text-violet-700"
                                : "border-violet-100 bg-white text-slate-600 hover:bg-violet-50"
                            }`}
                          >
                            {g === "boy" ? t("genderBoy") : t("genderGirl")}
                          </button>
                        ))}
                      </div>
                    </div>
                    {/* Skin tone */}
                    <div>
                      <span className="mb-2 block text-xs font-semibold text-slate-700">{t("skinToneLabel")}</span>
                      <div className="flex gap-3">
                        {([
                          { value: "light", color: "#FDDCB5", label: t("skinLight") },
                          { value: "medium", color: "#C68642", label: t("skinMedium") },
                          { value: "dark", color: "#8D5524", label: t("skinDark") },
                        ] as const).map((s) => (
                          <button
                            key={s.value}
                            type="button"
                            onClick={() => setSkinTone(s.value)}
                            className={`flex flex-col items-center gap-1 rounded-xl border px-3 py-2 transition ${
                              skinTone === s.value
                                ? "border-violet-400 ring-2 ring-violet-200"
                                : "border-transparent hover:border-violet-200"
                            }`}
                          >
                            <span className="block h-7 w-7 rounded-full border border-slate-200" style={{ backgroundColor: s.color }} />
                            <span className="text-[10px] text-slate-600">{s.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                    {/* Hair color */}
                    <div>
                      <span className="mb-2 block text-xs font-semibold text-slate-700">{t("hairColorLabel")}</span>
                      <div className="flex gap-3">
                        {([
                          { value: "black", color: "#1a1a1a", label: t("hairBlack") },
                          { value: "brown", color: "#6B3A2A", label: t("hairBrown") },
                          { value: "blonde", color: "#E8D44D", label: t("hairBlonde") },
                          { value: "red", color: "#C0392B", label: t("hairRed") },
                        ] as const).map((h) => (
                          <button
                            key={h.value}
                            type="button"
                            onClick={() => setHairColor(h.value)}
                            className={`flex flex-col items-center gap-1 rounded-xl border px-3 py-2 transition ${
                              hairColor === h.value
                                ? "border-violet-400 ring-2 ring-violet-200"
                                : "border-transparent hover:border-violet-200"
                            }`}
                          >
                            <span className="block h-7 w-7 rounded-full border border-slate-200" style={{ backgroundColor: h.color }} />
                            <span className="text-[10px] text-slate-600">{h.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              )}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <h2 className="text-lg font-bold text-slate-900">{t("storyDetails")}</h2>
              <div>
                <label htmlFor="theme" className="mb-2 block text-sm font-semibold text-slate-900">{t("storyTheme")}</label>
                <input id="theme" type="text" required maxLength={100} value={theme} onChange={(e) => setTheme(e.target.value)} className={INPUT_CLASS} placeholder={t("themePlaceholder")} />
              </div>
              <div>
                <label htmlFor="moral" className="mb-2 block text-sm font-semibold text-slate-900">{t("moralLabel")}</label>
                <input id="moral" type="text" maxLength={100} value={moral} onChange={(e) => setMoral(e.target.value)} className={INPUT_CLASS} placeholder={t("moralPlaceholder")} />
              </div>
              <div>
                <label htmlFor="language" className="mb-2 block text-sm font-semibold text-slate-900">{t("storyLanguage")}</label>
                <select id="language" value={language} onChange={(e) => setLanguage(e.target.value as Language)} className={INPUT_CLASS}>
                  <option value="ar">{ta("arabic")}</option>
                  <option value="en">{ta("english")}</option>
                  <option value="fr">{ta("french")}</option>
                </select>
              </div>
              <div>
                <span className="mb-2 block text-sm font-semibold text-slate-900">{t("storyDuration")}</span>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {([3, 5, 10] as const).map((d) => {
                    const labels: Record<number, string> = { 3: t("duration3"), 5: t("duration5"), 10: t("duration10") };
                    const active = duration === d;
                    return (
                      <button
                        key={d}
                        type="button"
                        onClick={() => setDuration(d)}
                        className={`flex flex-col items-center gap-1 rounded-2xl border px-3 py-3 text-center transition ${
                          active
                            ? "border-violet-400 bg-violet-50 shadow-sm ring-2 ring-violet-200"
                            : "border-violet-100 bg-white hover:border-violet-300 hover:bg-violet-50"
                        }`}
                      >
                        <span className={`text-lg font-bold ${active ? "text-violet-700" : "text-slate-700"}`}>
                          {t("durationMin", { min: d })}
                        </span>
                        <span className={`text-xs ${active ? "text-violet-600" : "text-slate-500"}`}>
                          {labels[d]}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              {loading && <LoadingSpinner label={t("generating")} />}
              {story && !loading && (
                <article data-story-print className="overflow-hidden rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50 to-white">
                  {story.imageUrl && (
                    <div className="relative aspect-square w-full overflow-hidden bg-violet-100" data-story-print>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={story.imageUrl}
                        alt={story.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}
                  <div className="border-b border-violet-100 bg-white/80 px-6 py-5">
                    <p className="text-sm font-medium text-violet-700">{t("storyFor", { name: story.childName })}</p>
                    <h2 className="mt-1 text-2xl font-bold text-slate-900">{story.title}</h2>
                  </div>
                  <div className="max-h-[50vh] overflow-y-auto px-6 py-6" data-story-print>
                    <StoryContent text={story.content} />
                    {story.moral && (
                      <div className="mt-6 rounded-2xl bg-violet-50 px-4 py-4" data-story-moral>
                        <p className="text-sm font-semibold text-violet-700">{t("moralLearned")}</p>
                        <p className="mt-1 text-slate-700">{story.moral}</p>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2 border-t border-violet-100 bg-white/90 px-6 py-4 no-print" data-no-print>
                    <button type="button" onClick={handleShare} className={`${BTN_SECONDARY} flex-1 text-sm sm:flex-none`}>
                      <IconShare /> {t("share")}
                    </button>
                    <button type="button" onClick={handleCopyFull} className={`${BTN_SECONDARY} flex-1 text-sm sm:flex-none`}>
                      <IconCopy /> {t("copyStory")}
                    </button>
                    <button type="button" onClick={handleEmailShare} className={`${BTN_SECONDARY} flex-1 text-sm sm:flex-none`}>
                      <IconMail /> {t("shareEmail")}
                    </button>
                    <button type="button" onClick={handleExportPdf} disabled={exporting} className={`${BTN_SECONDARY} flex-1 text-sm sm:flex-none disabled:cursor-not-allowed disabled:opacity-60`}>
                      <IconPrinter /> {t("exportPdf")}
                    </button>
                    <button type="button" onClick={handleFavorite} className={`${BTN_SECONDARY} flex-1 text-sm sm:flex-none ${fav ? "border-red-200 bg-red-50 text-red-600" : ""}`}>
                      <IconHeart filled={fav} /> {fav ? t("inFavorites") : t("addToFavorites")}
                    </button>
                    {shareMsg && <span className="w-full text-center text-sm text-violet-700">{shareMsg}</span>}
                  </div>
                </article>
              )}
            </div>
          )}

          {error && step !== 3 && <div className="mt-4"><FormError message={error} /></div>}
          {error && step === 3 && !loading && <div className="mt-4"><FormError message={error} /></div>}

          {step < 3 && (
            <div className="mt-8 flex gap-3">
              {step > 1 && <button type="button" onClick={handleBack} className={BTN_SECONDARY}>{t("previous")}</button>}
              <button type="button" onClick={handleNext} className={BTN_PRIMARY}>
                {step === 2 ? (<><IconSparkle className="h-5 w-5" />{t("generateStory")}</>) : t("next")}
              </button>
            </div>
          )}

          {step === 3 && story && !loading && (
            <>
              <div className="mt-6 flex flex-wrap gap-3">
                <button type="button" onClick={startOver} className={BTN_SECONDARY}>{t("newStory")}</button>
                <Link href="/dashboard" className="inline-flex items-center justify-center rounded-2xl bg-violet-600 px-6 py-3 font-semibold text-white shadow-lg transition hover:bg-violet-700">
                  {t("backToDashboard")}
                </Link>
              </div>
              {userPlan === "FREE" && (
                <div className="mt-6 flex flex-col items-start gap-3 rounded-2xl border border-violet-200 bg-gradient-to-l from-violet-50 to-white px-5 py-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm font-medium text-slate-700">{t("upgradeBanner")}</p>
                  <Link href="/pricing" className="shrink-0 rounded-2xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-violet-700">
                    {tc("upgradePlan")}
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
