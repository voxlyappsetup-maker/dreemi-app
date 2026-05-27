"use client";

import { useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import type { Plan } from "@dreemi/types";
import { Link, useRouter } from "../../../i18n/routing";
import {
  ApiError,
  cancelSubscription,
  changePassword,
  deleteAccount,
  exportUserData,
  getSubscription,
  getMe,
  updateProfile,
} from "../../../lib/api";
import { clearAuth, getStoredUser, isAuthenticated, saveUser } from "../../../lib/storage";
import { DashboardSidebar } from "../../../components/DashboardSidebar";
import { INPUT_CLASS } from "../../../components/PasswordInput";

const PAGE_BG = "min-h-screen bg-gradient-to-b from-violet-200 via-violet-50 to-white";
const CARD = "rounded-2xl border border-violet-100 bg-white p-6 shadow-md sm:p-8";
const BTN = "inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-2.5 text-sm font-semibold transition disabled:opacity-60 disabled:cursor-not-allowed";
const BTN_PRIMARY = `${BTN} bg-violet-600 text-white shadow-lg hover:bg-violet-700`;
const BTN_OUTLINE = `${BTN} border border-violet-200 bg-white text-violet-700 hover:bg-violet-50`;

const LANG_OPTIONS = [
  { code: "ar", flag: "https://flagcdn.com/w40/sa.png", name: "العربية" },
  { code: "en", flag: "https://flagcdn.com/w40/gb.png", name: "English" },
  { code: "fr", flag: "https://flagcdn.com/w40/fr.png", name: "Français" },
];

export default function SettingsPage() {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("settings");
  const tc = useTranslations("common");

  const [ready, setReady] = useState(false);
  const [plan, setPlan] = useState<Plan>("FREE");

  // Profile
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileMsg, setProfileMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  // Password
  const [curPwd, setCurPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [pwdLoading, setPwdLoading] = useState(false);
  const [pwdMsg, setPwdMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  // Preferences
  const [storyLang, setStoryLang] = useState(locale);
  const [prefMsg, setPrefMsg] = useState<string | null>(null);

  // Subscription
  const [cancelledUntil, setCancelledUntil] = useState<string | null>(null);
  const [isCancelled, setIsCancelled] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [cancelError, setCancelError] = useState<string | null>(null);
  const [portalLoading, setPortalLoading] = useState(false);

  // Data export
  const [exportLoading, setExportLoading] = useState(false);

  // Delete
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated()) { router.replace("/login"); return; }
    async function load() {
      try {
        const user = await getMe();
        saveUser(user);
        setPlan(user.plan);
        setName(user.name ?? "");
        setEmail(user.email);
      } catch {
        const u = getStoredUser();
        if (u) { setPlan(u.plan); setName(u.name ?? ""); setEmail(u.email); }
      }
      const saved = localStorage.getItem("dreemi_story_lang");
      if (saved) setStoryLang(saved);
      setReady(true);
    }
    load();
  }, [router]);

  const PLAN_LABELS: Record<Plan, string> = {
    FREE: t("planFree"), INDIVIDUAL: t("planIndividual"),
    FAMILY: t("planFamily"), SCHOOL: t("planSchool"),
  };
  const isFree = plan === "FREE";

  function formatDate(iso: string) {
    return new Intl.DateTimeFormat(locale, { year: "numeric", month: "long", day: "numeric" }).format(new Date(iso));
  }

  async function handleSaveProfile() {
    setProfileLoading(true); setProfileMsg(null);
    try {
      const user = await updateProfile({ name: name.trim() || undefined });
      saveUser(user); setName(user.name ?? "");
      setProfileMsg({ type: "ok", text: t("profileSaved") });
    } catch (err) {
      setProfileMsg({ type: "err", text: err instanceof ApiError ? err.message : t("profileError") });
    } finally { setProfileLoading(false); }
  }

  async function handleChangePassword() {
    setPwdMsg(null);
    if (newPwd.length < 8) { setPwdMsg({ type: "err", text: t("passwordTooShort") }); return; }
    if (newPwd !== confirmPwd) { setPwdMsg({ type: "err", text: t("passwordMismatch") }); return; }
    setPwdLoading(true);
    try {
      await changePassword(curPwd, newPwd);
      setCurPwd(""); setNewPwd(""); setConfirmPwd("");
      setPwdMsg({ type: "ok", text: t("passwordChanged") });
    } catch (err) {
      const msg = err instanceof ApiError && err.status === 401 ? t("passwordWrong") : t("passwordError");
      setPwdMsg({ type: "err", text: msg });
    } finally { setPwdLoading(false); }
  }

  function handleStoryLang(code: string) {
    setStoryLang(code);
    try { localStorage.setItem("dreemi_story_lang", code); } catch {}
    setPrefMsg(t("prefSaved"));
    setTimeout(() => setPrefMsg(null), 3000);
  }

  async function handleCancel() {
    setCancelLoading(true); setCancelError(null);
    try {
      await cancelSubscription();
      setCancelledUntil(null);
      setIsCancelled(true);
    } catch (err) {
      setCancelError(err instanceof ApiError ? err.message : t("cancelError"));
    } finally { setCancelLoading(false); }
  }

  async function handlePortal() {
    setPortalLoading(true);
    try {
      const data = await getSubscription();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const remote = (data as any)?.remote;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const portalUrl = remote?.data?.attributes?.urls?.customer_portal as string | undefined;
      if (portalUrl) window.location.href = portalUrl;
      else throw new ApiError(400, "No portal URL");
    } catch {
      setPortalLoading(false);
    }
  }

  async function handleExport() {
    setExportLoading(true);
    try { await exportUserData(); } catch {} finally { setExportLoading(false); }
  }

  async function handleDelete() {
    if (deleteConfirm !== "DELETE") return;
    setDeleteLoading(true); setDeleteError(null);
    try { await deleteAccount(); clearAuth(); router.replace("/"); }
    catch (err) { setDeleteError(err instanceof ApiError ? err.message : t("deleteError")); setDeleteLoading(false); }
  }

  function doLogout() { clearAuth(); router.replace("/login"); }

  if (!ready) {
    return <main className={`flex items-center justify-center ${PAGE_BG}`}><p className="text-slate-600">{tc("loading")}</p></main>;
  }

  const langBtnBase = "flex flex-col items-center gap-1.5 rounded-xl px-4 py-3 text-sm font-semibold transition";
  const langActive = "bg-violet-600 text-white shadow-md";
  const langInactive = "border border-violet-200 bg-white text-slate-600 hover:bg-violet-50";

  return (
    <div className={`${PAGE_BG} lg:pe-64`}>
      <DashboardSidebar onLogout={doLogout} plan={plan} />

      <main className="mx-auto max-w-2xl space-y-8 px-4 py-8 sm:px-8 lg:py-10">
        <h1 className="text-2xl font-bold text-slate-900">{t("title")}</h1>

        {/* Section 1: Account */}
        <section className={CARD}>
          <h2 className="mb-5 text-lg font-bold text-slate-900">{t("accountTitle")}</h2>

          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">{t("nameLabel")}</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t("namePlaceholder")}
                className={INPUT_CLASS}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">{t("emailLabel")}</label>
              <input type="email" value={email} readOnly className={`${INPUT_CLASS} cursor-not-allowed bg-slate-50 text-slate-500`} />
            </div>
            <div className="flex items-center gap-3">
              <button type="button" onClick={handleSaveProfile} disabled={profileLoading || !name.trim()} className={BTN_PRIMARY}>
                {profileLoading ? t("savingProfile") : t("saveProfile")}
              </button>
              {profileMsg && (
                <p className={`text-sm font-medium ${profileMsg.type === "ok" ? "text-green-600" : "text-red-600"}`}>{profileMsg.text}</p>
              )}
            </div>
          </div>

          <hr className="my-6 border-violet-100" />

          <h3 className="mb-4 text-base font-bold text-slate-900">{t("passwordTitle")}</h3>
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">{t("currentPassword")}</label>
              <input type="password" value={curPwd} onChange={(e) => setCurPwd(e.target.value)} className={INPUT_CLASS} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">{t("newPassword")}</label>
                <input type="password" value={newPwd} onChange={(e) => setNewPwd(e.target.value)} className={INPUT_CLASS} />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">{t("confirmPassword")}</label>
                <input type="password" value={confirmPwd} onChange={(e) => setConfirmPwd(e.target.value)} className={INPUT_CLASS} />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleChangePassword}
                disabled={pwdLoading || !curPwd || !newPwd || !confirmPwd}
                className={BTN_OUTLINE}
              >
                {pwdLoading ? t("changingPassword") : t("changePassword")}
              </button>
              {pwdMsg && (
                <p className={`text-sm font-medium ${pwdMsg.type === "ok" ? "text-green-600" : "text-red-600"}`}>{pwdMsg.text}</p>
              )}
            </div>
          </div>
        </section>

        {/* Section 2: Preferences */}
        <section className={CARD}>
          <h2 className="mb-5 text-lg font-bold text-slate-900">{t("preferencesTitle")}</h2>

          <div className="mb-5">
            <label className="mb-2 block text-sm font-semibold text-slate-700">{t("uiLanguage")}</label>
            <div className="flex gap-3">
              {LANG_OPTIONS.map((l) => (
                <Link
                  key={l.code}
                  href="/settings"
                  locale={l.code as "ar" | "en" | "fr"}
                  className={`${langBtnBase} ${locale === l.code ? langActive : langInactive}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={l.flag} alt={l.name} className="h-5 w-7 rounded-sm object-cover" />
                  {l.name}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">{t("storyLanguage")}</label>
            <div className="flex gap-3">
              {LANG_OPTIONS.map((l) => (
                <button
                  key={l.code}
                  type="button"
                  onClick={() => handleStoryLang(l.code)}
                  className={`${langBtnBase} ${storyLang === l.code ? langActive : langInactive}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={l.flag} alt={l.name} className="h-5 w-7 rounded-sm object-cover" />
                  {l.name}
                </button>
              ))}
            </div>
            {prefMsg && <p className="mt-2 text-sm font-medium text-green-600">{prefMsg}</p>}
          </div>
        </section>

        {/* Section 3: Subscription */}
        <section className={CARD}>
          <h2 className="mb-4 text-lg font-bold text-slate-900">{t("subscriptionTitle")}</h2>

          <div className="mb-4 flex items-center gap-3">
            <span className="text-sm font-medium text-slate-600">{t("currentPlan")}:</span>
            <span className={`rounded-xl px-3 py-1 text-sm font-bold ${isFree ? "bg-slate-100 text-slate-700" : "bg-violet-100 text-violet-700"}`}>
              {PLAN_LABELS[plan]}
            </span>
          </div>

          {isFree ? (
            <div className="rounded-xl bg-violet-50 px-4 py-3">
              <p className="text-sm text-slate-700">{t("noSubscription")}</p>
              <Link href="/pricing" className={`${BTN_PRIMARY} mt-3`}>{t("upgradeCta")}</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {cancelledUntil && (
                <div className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">{t("cancelledUntil", { date: formatDate(cancelledUntil) })}</div>
              )}
              {isCancelled && !cancelledUntil && (
                <div className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">{t("alreadyCancelled")}</div>
              )}
              <div className="flex flex-wrap gap-3">
                {!isCancelled && (
                  <button type="button" onClick={handleCancel} disabled={cancelLoading} className={`${BTN} border border-red-200 bg-white text-red-600 hover:bg-red-50`}>
                    {cancelLoading ? t("cancelling") : t("cancelSubscription")}
                  </button>
                )}
                <button type="button" onClick={handlePortal} disabled={portalLoading} className={BTN_OUTLINE}>{t("manageBilling")}</button>
              </div>
              {cancelError && <p className="text-sm text-red-600">{cancelError}</p>}
            </div>
          )}

          <hr className="my-6 border-violet-100" />

          <h3 className="mb-2 text-base font-bold text-slate-900">{t("dataExportTitle")}</h3>
          <p className="mb-3 text-sm text-slate-600">{t("dataExportDesc")}</p>
          <button type="button" onClick={handleExport} disabled={exportLoading} className={BTN_OUTLINE}>
            {exportLoading ? t("exporting") : t("exportButton")}
          </button>
        </section>

        {/* Section 4: Danger Zone */}
        <section className="rounded-2xl border border-red-200 bg-white p-6 shadow-md sm:p-8">
          <h2 className="mb-2 text-lg font-bold text-red-700">{t("dangerZone")}</h2>
          <p className="mb-1 text-sm font-semibold text-red-600">{t("deleteWarning")}</p>
          <p className="mb-3 text-sm text-slate-600">{t("deleteDesc")}</p>
          <ul className="mb-5 list-inside list-disc space-y-1 text-sm text-slate-700">
            <li>{t("deleteItem1")}</li>
            <li>{t("deleteItem2")}</li>
            <li>{t("deleteItem3")}</li>
          </ul>
          <label className="mb-2 block text-sm font-semibold text-slate-900">{t("deleteConfirmLabel")}</label>
          <input
            type="text"
            value={deleteConfirm}
            onChange={(e) => setDeleteConfirm(e.target.value)}
            placeholder="DELETE"
            className="mb-4 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-red-400 focus:outline-none focus:ring-2 focus:ring-red-100"
            dir="ltr"
          />
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleteConfirm !== "DELETE" || deleteLoading}
            className={`${BTN} bg-red-600 text-white shadow-lg hover:bg-red-700`}
          >
            {deleteLoading ? t("deleting") : t("deleteButton")}
          </button>
          {deleteError && <p className="mt-3 text-sm text-red-600">{deleteError}</p>}
        </section>
        <footer className="mt-10 border-t border-violet-100 py-8 text-center text-sm text-slate-600">
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/privacy" className="font-semibold text-violet-700 hover:text-violet-800 hover:underline">
              {tc("privacy")}
            </Link>
            <span className="text-violet-200" aria-hidden>|</span>
            <Link href="/terms" className="font-semibold text-violet-700 hover:text-violet-800 hover:underline">
              {tc("terms")}
            </Link>
            <span className="text-violet-200" aria-hidden>|</span>
            <a href="mailto:contact@dreemi.app" className="font-semibold text-violet-700 hover:text-violet-800 hover:underline">
              {tc("contact")}
            </a>
          </div>
          <p className="mt-3 text-xs text-slate-500">{tc("copyright")}</p>
        </footer>
      </main>
    </div>
  );
}
