"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "../../../i18n/routing";
import { createCheckout, ApiError, getPaymentsStatus } from "../../../lib/api";
import { getStoredUser, isAuthenticated } from "../../../lib/storage";
import { PublicHeader } from "../../../components/PublicHeader";

const PENDING_PLAN_KEY = "pendingPlanVariantId";

type BillingCycle = "monthly" | "yearly";

interface PlanCard {
  key: string;
  nameLocalized: string;
  monthlyPrice: string;
  yearlyPrice: string;
  sub: string;
  features: string[];
  highlighted: boolean;
  variantMonthly?: number;
  variantYearly?: number;
  isFree: boolean;
  isContact: boolean;
}

export default function PricingPage() {
  const router = useRouter();
  const t = useTranslations("pricing");
  const tc = useTranslations("common");
  const [cycle, setCycle] = useState<BillingCycle>("monthly");
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [userPlan, setUserPlan] = useState<string | null>(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [paymentsAvailable, setPaymentsAvailable] = useState(false);

  useEffect(() => {
    const auth = isAuthenticated();
    setLoggedIn(auth);
    if (auth) {
      const u = getStoredUser();
      if (u?.plan) setUserPlan(u.plan);
    }
    if (typeof window !== "undefined") {
      const pending = localStorage.getItem(PENDING_PLAN_KEY);
      if (pending && auth) {
        localStorage.removeItem(PENDING_PLAN_KEY);
        startCheckout(Number(pending));
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let cancelled = false;
    void getPaymentsStatus()
      .then((payments) => {
        if (!cancelled) setPaymentsAvailable(Boolean(payments.canStartCheckout));
      })
      .catch(() => {
        if (!cancelled) setPaymentsAvailable(false);
      });
    return () => { cancelled = true; };
  }, []);

  const PLANS: PlanCard[] = [
    {
      key: "FREE",
      nameLocalized: t("planFree"),
      monthlyPrice: "$0",
      yearlyPrice: "$0",
      sub: "",
      features: t.raw("planFreeFeatures") as string[],
      highlighted: false,
      isFree: true,
      isContact: false,
    },
    {
      key: "INDIVIDUAL",
      nameLocalized: t("planIndividual"),
      monthlyPrice: "$4.99",
      yearlyPrice: "$47.90",
      sub: cycle === "yearly" ? t("perYear") : t("perMonth"),
      features: t.raw("planIndFeatures") as string[],
      highlighted: true,
      variantMonthly: 1712541,
      variantYearly: 1712569,
      isFree: false,
      isContact: false,
    },
    {
      key: "FAMILY",
      nameLocalized: t("planFamily"),
      monthlyPrice: "$9.99",
      yearlyPrice: "$95.90",
      sub: cycle === "yearly" ? t("perYear") : t("perMonth"),
      features: t.raw("planFamilyFeatures") as string[],
      highlighted: false,
      variantMonthly: 1712590,
      variantYearly: 1712596,
      isFree: false,
      isContact: false,
    },
    {
      key: "SCHOOL",
      nameLocalized: t("planSchool"),
      monthlyPrice: "$29.99",
      yearlyPrice: "$287.90",
      sub: cycle === "yearly" ? t("perYear") : t("perMonth"),
      features: t.raw("planSchoolFeatures") as string[],
      highlighted: false,
      variantMonthly: 1712619,
      variantYearly: 1712634,
      isFree: false,
      isContact: false,
    },
  ];

  async function startCheckout(variantId: number) {
    setError(null);
    setLoadingPlan("PENDING");
    try {
      const url = await createCheckout(variantId);
      if (url) window.open(url, "_blank", "noopener,noreferrer");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t("checkoutError"));
    } finally {
      setLoadingPlan(null);
    }
  }

  async function handleSubscribe(plan: PlanCard) {
    if (plan.isFree) { router.push(loggedIn ? "/dashboard" : "/register"); return; }
    if (plan.isContact) { window.location.href = "mailto:contact@dreemi.app?subject=School Plan"; return; }
    const variantId = cycle === "yearly" ? plan.variantYearly : plan.variantMonthly;
    if (!variantId) { setError(t("priceNotConfigured")); return; }
    if (!loggedIn) {
      localStorage.setItem(PENDING_PLAN_KEY, String(variantId));
      router.push("/login");
      return;
    }
    setError(null);
    setLoadingPlan(plan.key);
    try {
      const url = await createCheckout(variantId);
      if (url) window.open(url, "_blank", "noopener,noreferrer");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t("checkoutError"));
    } finally {
      setLoadingPlan(null);
    }
  }

  function buttonLabel(plan: PlanCard): string {
    if (!plan.isFree && !paymentsAvailable) return t("paymentsTemporarilyUnavailable");
    if (userPlan === plan.key) return t("currentPlan");
    if (loadingPlan === plan.key || loadingPlan === "PENDING") return t("redirecting");
    if (plan.isFree) return t("startFree");
    if (plan.isContact) return t("contactUs");
    if (loggedIn) return t("upgrade");
    return t("startNow");
  }

  const isCurrent = (plan: PlanCard) => userPlan === plan.key;

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-200 via-violet-50 to-white">
      <PublicHeader variant={loggedIn ? "authed" : "guest"} />

      <section className="mx-auto max-w-7xl px-6 pt-12 text-center sm:pt-16">
        <h1 className="text-4xl font-bold text-slate-900 sm:text-5xl">{t("title")}</h1>
        <p className="mx-auto mt-4 max-w-xl text-lg text-slate-600">{t("description")}</p>

        <div className="mt-8 inline-flex items-center gap-1 rounded-2xl border border-violet-200 bg-white p-1 shadow-sm">
          <button
            type="button"
            onClick={() => setCycle("monthly")}
            className={`rounded-xl px-5 py-2.5 text-sm font-medium transition ${cycle === "monthly" ? "bg-violet-600 text-white shadow-md" : "text-slate-600 hover:text-violet-700"}`}
          >
            {t("monthly")}
          </button>
          <button
            type="button"
            onClick={() => setCycle("yearly")}
            className={`rounded-xl px-5 py-2.5 text-sm font-medium transition ${cycle === "yearly" ? "bg-violet-600 text-white shadow-md" : "text-slate-600 hover:text-violet-700"}`}
          >
            {t("yearly")}
            <span className="ms-1.5 rounded-lg bg-green-100 px-2 py-0.5 text-[11px] font-bold text-green-700">{t("save20")}</span>
          </button>
        </div>
      </section>

      {error && (
        <div className="mx-auto mt-6 max-w-lg rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-center text-sm text-red-700">{error}</div>
      )}
      {!paymentsAvailable && (
        <div className="mx-auto mt-6 max-w-lg rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-center text-sm text-amber-700">
          {t("paymentsTemporarilyUnavailable")}
        </div>
      )}

      <section className="mx-auto max-w-7xl px-6 pb-24 pt-12">
        <div className="grid gap-6 lg:grid-cols-4">
          {PLANS.map((plan) => {
            const price = cycle === "yearly" ? plan.yearlyPrice : plan.monthlyPrice;
            const isLoading = loadingPlan === plan.key || loadingPlan === "PENDING";
            const current = isCurrent(plan);
            const disableFreeDowngrade = loggedIn && plan.isFree && userPlan !== "FREE";
            const paymentsBlocked = !plan.isFree && !paymentsAvailable;
            return (
              <div
                key={plan.key}
                className={`relative flex flex-col rounded-2xl p-7 shadow-md transition ${
                  plan.highlighted
                    ? "scale-[1.03] border-2 border-violet-500 bg-violet-600 text-white shadow-xl lg:scale-105"
                    : current
                      ? "border-2 border-violet-300 bg-white text-slate-900"
                      : "border border-violet-100 bg-white text-slate-900"
                }`}
              >
                {plan.highlighted && (
                  <span className="absolute -top-3.5 start-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-amber-400 to-orange-400 px-4 py-1 text-xs font-bold text-white shadow-md">
                    {t("mostPopular")}
                  </span>
                )}

                <h3 className={`text-lg font-bold ${plan.highlighted ? "text-white" : "text-slate-900"}`}>
                  {plan.nameLocalized}
                </h3>

                <p className="mt-4 flex items-baseline gap-1">
                  <span className={`text-4xl font-extrabold tracking-tight ${plan.highlighted ? "text-white" : "text-violet-600"}`}>
                    {price}
                  </span>
                  {plan.sub && (
                    <span className={`text-sm ${plan.highlighted ? "text-violet-200" : "text-slate-500"}`}>
                      {plan.sub}
                    </span>
                  )}
                </p>

                {cycle === "yearly" && !plan.isFree && !plan.isContact && (
                  <p className={`mt-1 text-xs ${plan.highlighted ? "text-violet-200" : "text-slate-400"}`}>
                    ${(parseFloat(price.replace("$", "")) / 12).toFixed(2)}{t("perMonth")}
                  </p>
                )}

                <ul className={`mt-6 flex-1 space-y-3 text-sm ${plan.highlighted ? "text-violet-50" : "text-slate-600"}`}>
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <span className={`mt-0.5 text-xs ${plan.highlighted ? "text-green-300" : "text-green-500"}`}>✓</span>
                      {f}
                    </li>
                  ))}
                </ul>

                <button
                  type="button"
                    disabled={isLoading || current || disableFreeDowngrade || paymentsBlocked}
                  onClick={() => handleSubscribe(plan)}
                  className={`mt-8 w-full rounded-2xl py-3 text-center text-sm font-bold transition disabled:cursor-not-allowed ${
                    current
                      ? "border-2 border-violet-300 bg-violet-50 text-violet-600"
                      : plan.highlighted
                        ? "bg-white text-violet-700 shadow-md hover:bg-violet-50 disabled:opacity-60"
                        : "border border-violet-200 bg-white text-violet-700 hover:bg-violet-50 disabled:opacity-60"
                  }`}
                >
                  {buttonLabel(plan)}
                </button>
              </div>
            );
          })}
        </div>
      </section>

      <footer className="border-t border-violet-200 bg-white py-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-6 text-center sm:flex-row sm:justify-between">
          <p className="text-sm text-slate-500">{tc("copyright")}</p>
          <div className="flex items-center gap-4 text-sm text-slate-600">
            <Link href="/privacy" className="hover:text-violet-600">{tc("privacy")}</Link>
            <span className="text-violet-200" aria-hidden>|</span>
            <Link href="/terms" className="hover:text-violet-600">{tc("terms")}</Link>
            <span className="text-violet-200" aria-hidden>|</span>
            <a href="mailto:contact@dreemi.app" className="hover:text-violet-600">{tc("contact")}</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
