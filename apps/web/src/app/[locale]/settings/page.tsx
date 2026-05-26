"use client";

import { useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import type { Plan } from "@dreemi/types";
import { Link, useRouter } from "../../../i18n/routing";
import {
  ApiError,
  cancelSubscription,
  createPortal,
  deleteAccount,
  exportUserData,
  getMe,
} from "../../../lib/api";
import { clearAuth, getStoredUser, isAuthenticated } from "../../../lib/storage";
import { DashboardSidebar } from "../../../components/DashboardSidebar";

const PAGE_BG =
  "min-h-screen bg-gradient-to-b from-violet-200 via-violet-50 to-white";

const CARD =
  "rounded-2xl border border-violet-100 bg-white p-6 shadow-md sm:p-8";

const BTN =
  "inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-2.5 text-sm font-semibold transition";

export default function SettingsPage() {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("settings");
  const tc = useTranslations("common");

  const [ready, setReady] = useState(false);
  const [plan, setPlan] = useState<Plan>("FREE");
  const [cancelledUntil, setCancelledUntil] = useState<string | null>(null);
  const [isCancelled, setIsCancelled] = useState(false);

  const [cancelLoading, setCancelLoading] = useState(false);
  const [cancelError, setCancelError] = useState<string | null>(null);
  const [exportLoading, setExportLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [portalLoading, setPortalLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace("/login");
      return;
    }

    async function load() {
      try {
        const user = await getMe();
        setPlan(user.plan);
      } catch {
        const u = getStoredUser();
        if (u?.plan) setPlan(u.plan);
      }
      setReady(true);
    }

    load();
  }, [router]);

  const PLAN_LABELS: Record<Plan, string> = {
    FREE: t("planFree"),
    INDIVIDUAL: t("planIndividual"),
    FAMILY: t("planFamily"),
    SCHOOL: t("planSchool"),
  };

  const isFree = plan === "FREE";

  function formatDate(iso: string) {
    return new Intl.DateTimeFormat(locale, {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(iso));
  }

  async function handleCancel() {
    setCancelLoading(true);
    setCancelError(null);
    try {
      const end = await cancelSubscription();
      setCancelledUntil(end);
      setIsCancelled(true);
    } catch (err) {
      setCancelError(
        err instanceof ApiError ? err.message : t("cancelError"),
      );
    } finally {
      setCancelLoading(false);
    }
  }

  async function handlePortal() {
    setPortalLoading(true);
    try {
      const url = await createPortal();
      window.location.href = url;
    } catch {
      setPortalLoading(false);
    }
  }

  async function handleExport() {
    setExportLoading(true);
    try {
      await exportUserData();
    } catch {
      // download failed silently
    } finally {
      setExportLoading(false);
    }
  }

  async function handleDelete() {
    if (deleteConfirm !== "DELETE") return;
    setDeleteLoading(true);
    setDeleteError(null);
    try {
      await deleteAccount();
      clearAuth();
      router.replace("/");
    } catch (err) {
      setDeleteError(
        err instanceof ApiError ? err.message : t("deleteError"),
      );
      setDeleteLoading(false);
    }
  }

  if (!ready) {
    return (
      <main className={`flex items-center justify-center ${PAGE_BG}`}>
        <p className="text-slate-600">{tc("loading")}</p>
      </main>
    );
  }

  return (
    <div className={`${PAGE_BG} lg:pe-64`}>
      <DashboardSidebar
        onLogout={() => {
          clearAuth();
          router.replace("/login");
        }}
        plan={plan}
      />

      <main className="mx-auto max-w-2xl space-y-8 px-4 py-8 sm:px-8 lg:py-10">
        <h1 className="text-2xl font-bold text-slate-900">{t("title")}</h1>

        {/* ── Section 1: Subscription ── */}
        <section className={CARD}>
          <h2 className="mb-4 text-lg font-bold text-slate-900">
            {t("subscriptionTitle")}
          </h2>

          <div className="mb-4 flex items-center gap-3">
            <span className="text-sm font-medium text-slate-600">
              {t("currentPlan")}:
            </span>
            <span
              className={`rounded-xl px-3 py-1 text-sm font-bold ${
                isFree
                  ? "bg-slate-100 text-slate-700"
                  : "bg-violet-100 text-violet-700"
              }`}
            >
              {PLAN_LABELS[plan]}
            </span>
          </div>

          {isFree ? (
            <div className="rounded-xl bg-violet-50 px-4 py-3">
              <p className="text-sm text-slate-700">{t("noSubscription")}</p>
              <Link
                href="/pricing"
                className={`${BTN} mt-3 bg-violet-600 text-white shadow-lg hover:bg-violet-700`}
              >
                {t("upgradeCta")}
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {cancelledUntil && (
                <div className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">
                  {t("cancelledUntil", { date: formatDate(cancelledUntil) })}
                </div>
              )}
              {isCancelled && !cancelledUntil && (
                <div className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">
                  {t("alreadyCancelled")}
                </div>
              )}

              <div className="flex flex-wrap gap-3">
                {!isCancelled && (
                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={cancelLoading}
                    className={`${BTN} border border-red-200 bg-white text-red-600 hover:bg-red-50 disabled:opacity-60`}
                  >
                    {cancelLoading
                      ? t("cancelling")
                      : t("cancelSubscription")}
                  </button>
                )}
                <button
                  type="button"
                  onClick={handlePortal}
                  disabled={portalLoading}
                  className={`${BTN} border border-violet-200 bg-white text-violet-700 hover:bg-violet-50 disabled:opacity-60`}
                >
                  {t("manageBilling")}
                </button>
              </div>

              {cancelError && (
                <p className="text-sm text-red-600">{cancelError}</p>
              )}
            </div>
          )}
        </section>

        {/* ── Section 2: Data Export (GDPR Art. 20) ── */}
        <section className={CARD}>
          <h2 className="mb-2 text-lg font-bold text-slate-900">
            {t("dataExportTitle")}
          </h2>
          <p className="mb-4 text-sm leading-relaxed text-slate-600">
            {t("dataExportDesc")}
          </p>
          <button
            type="button"
            onClick={handleExport}
            disabled={exportLoading}
            className={`${BTN} border border-violet-200 bg-white text-violet-700 hover:bg-violet-50 disabled:opacity-60`}
          >
            {exportLoading ? t("exporting") : t("exportButton")}
          </button>
        </section>

        {/* ── Section 3: Delete Account (GDPR Art. 17) ── */}
        <section className="rounded-2xl border border-red-200 bg-white p-6 shadow-md sm:p-8">
          <h2 className="mb-2 text-lg font-bold text-red-700">
            {t("deleteTitle")}
          </h2>
          <p className="mb-1 text-sm font-semibold text-red-600">
            {t("deleteWarning")}
          </p>
          <p className="mb-3 text-sm text-slate-600">{t("deleteDesc")}</p>
          <ul className="mb-5 list-inside list-disc space-y-1 text-sm text-slate-700">
            <li>{t("deleteItem1")}</li>
            <li>{t("deleteItem2")}</li>
            <li>{t("deleteItem3")}</li>
          </ul>

          <label className="mb-2 block text-sm font-semibold text-slate-900">
            {t("deleteConfirmLabel")}
          </label>
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
            className={`${BTN} bg-red-600 text-white shadow-lg hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50`}
          >
            {deleteLoading ? t("deleting") : t("deleteButton")}
          </button>

          {deleteError && (
            <p className="mt-3 text-sm text-red-600">{deleteError}</p>
          )}
        </section>
      </main>
    </div>
  );
}
