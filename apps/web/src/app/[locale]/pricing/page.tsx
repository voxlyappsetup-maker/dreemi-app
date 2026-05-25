"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "../../../i18n/routing";
import { createCheckout, ApiError } from "../../../lib/api";
import { isAuthenticated } from "../../../lib/storage";
import { LanguageSwitcher } from "../../../components/LanguageSwitcher";

const PENDING_PLAN_KEY = "pendingPlanPriceId";

type BillingCycle = "monthly" | "yearly";

interface PlanCard {
  name: string;
  nameLocalized: string;
  monthly: string;
  yearly: string;
  monthlySub: string;
  yearlySub: string;
  features: string[];
  highlighted: boolean;
  priceEnvMonthly: string | undefined;
  priceEnvYearly: string | undefined;
  isFree: boolean;
}

export default function PricingPage() {
  const router = useRouter();
  const t = useTranslations("pricing");
  const tc = useTranslations("common");
  const [cycle, setCycle] = useState<BillingCycle>("monthly");
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const PLANS: PlanCard[] = [
    {
      name: "FREE",
      nameLocalized: t("planFree"),
      monthly: "€0",
      yearly: "€0",
      monthlySub: "",
      yearlySub: "",
      features: t.raw("planFreeFeatures") as string[],
      highlighted: false,
      priceEnvMonthly: undefined,
      priceEnvYearly: undefined,
      isFree: true,
    },
    {
      name: "INDIVIDUAL",
      nameLocalized: t("planIndividual"),
      monthly: "€4.99",
      yearly: "€39.99",
      monthlySub: t("perMonth"),
      yearlySub: t("perYear"),
      features: t.raw("planIndFeatures") as string[],
      highlighted: true,
      priceEnvMonthly: process.env.NEXT_PUBLIC_STRIPE_PRICE_INDIVIDUAL_MONTHLY,
      priceEnvYearly: process.env.NEXT_PUBLIC_STRIPE_PRICE_INDIVIDUAL_YEARLY,
      isFree: false,
    },
    {
      name: "FAMILY",
      nameLocalized: t("planFamily"),
      monthly: "€7.99",
      yearly: "€7.99",
      monthlySub: t("perMonth"),
      yearlySub: t("perMonth"),
      features: t.raw("planFamilyFeatures") as string[],
      highlighted: false,
      priceEnvMonthly: process.env.NEXT_PUBLIC_STRIPE_PRICE_FAMILY_MONTHLY,
      priceEnvYearly: process.env.NEXT_PUBLIC_STRIPE_PRICE_FAMILY_MONTHLY,
      isFree: false,
    },
  ];

  useEffect(() => {
    const pending = localStorage.getItem(PENDING_PLAN_KEY);
    if (pending && isAuthenticated()) {
      localStorage.removeItem(PENDING_PLAN_KEY);
      startCheckout(pending);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function startCheckout(priceId: string) {
    setError(null);
    setLoadingPlan("PENDING");
    try {
      const url = await createCheckout(priceId);
      if (url) window.location.href = url;
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t("checkoutError"));
    } finally {
      setLoadingPlan(null);
    }
  }

  async function handleSubscribe(plan: PlanCard) {
    if (plan.isFree) { router.push("/register"); return; }
    const priceId = cycle === "yearly" ? plan.priceEnvYearly : plan.priceEnvMonthly;
    if (!priceId) { setError(t("priceNotConfigured")); return; }
    if (!isAuthenticated()) {
      localStorage.setItem(PENDING_PLAN_KEY, priceId);
      router.push("/login");
      return;
    }
    setError(null);
    setLoadingPlan(plan.name);
    try {
      const url = await createCheckout(priceId);
      if (url) window.location.href = url;
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t("checkoutError"));
    } finally {
      setLoadingPlan(null);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-200 via-violet-50 to-white">
      <div className="mx-auto max-w-6xl px-6">
        <header className="flex items-center justify-between py-6">
          <Link href="/" className="text-xl font-bold text-violet-700 transition hover:text-violet-800">Dreemi</Link>
          <nav className="flex items-center gap-2 sm:gap-3">
            <LanguageSwitcher />
            <Link href="/login" className="rounded-2xl px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-white/80">{tc("login")}</Link>
            <Link href="/register" className="rounded-2xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:bg-violet-700">{tc("register")}</Link>
          </nav>
        </header>
      </div>

      <section className="mx-auto max-w-6xl px-6 pt-12 text-center sm:pt-16">
        <h1 className="text-4xl font-bold text-slate-900 sm:text-5xl">{t("title")}</h1>
        <p className="mx-auto mt-4 max-w-xl text-lg text-slate-600">{t("description")}</p>
        <div className="mt-8 inline-flex items-center gap-1 rounded-2xl border border-violet-200 bg-white p-1 shadow-sm">
          <button type="button" onClick={() => setCycle("monthly")} className={`rounded-xl px-5 py-2 text-sm font-medium transition ${cycle === "monthly" ? "bg-violet-600 text-white shadow-md" : "text-slate-600 hover:text-violet-700"}`}>
            {t("monthly")}
          </button>
          <button type="button" onClick={() => setCycle("yearly")} className={`rounded-xl px-5 py-2 text-sm font-medium transition ${cycle === "yearly" ? "bg-violet-600 text-white shadow-md" : "text-slate-600 hover:text-violet-700"}`}>
            {t("yearly")}
            <span className="ms-1 rounded-lg bg-green-100 px-1.5 py-0.5 text-[11px] font-bold text-green-700">{t("save33")}</span>
          </button>
        </div>
      </section>

      {error && (
        <div className="mx-auto mt-6 max-w-lg rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-center text-sm text-red-700">{error}</div>
      )}

      <section className="mx-auto max-w-6xl px-6 pb-24 pt-12">
        <div className="grid gap-6 lg:grid-cols-3">
          {PLANS.map((plan) => {
            const price = cycle === "yearly" ? plan.yearly : plan.monthly;
            const sub = cycle === "yearly" ? plan.yearlySub : plan.monthlySub;
            const isLoading = loadingPlan === plan.name || loadingPlan === "PENDING";
            return (
              <div key={plan.name} className={`relative flex flex-col rounded-2xl p-8 shadow-md transition ${plan.highlighted ? "bg-violet-600 text-white shadow-xl ring-2 ring-violet-400" : "border border-violet-100 bg-white text-slate-900"}`}>
                {plan.highlighted && (
                  <span className="absolute -top-3 right-6 rounded-2xl bg-white px-3 py-1 text-xs font-semibold text-violet-700">{t("mostPopular")}</span>
                )}
                <h3 className={`text-xl font-bold ${plan.highlighted ? "text-white" : "text-slate-900"}`}>{plan.nameLocalized}</h3>
                <p className="mt-4 flex items-baseline gap-1">
                  <span className={`text-4xl font-bold ${plan.highlighted ? "text-white" : "text-violet-600"}`}>{price}</span>
                  {sub && <span className={plan.highlighted ? "text-violet-100" : "text-slate-500"}>{sub}</span>}
                </p>
                <ul className={`mt-6 flex-1 space-y-3 text-sm ${plan.highlighted ? "text-violet-50" : "text-slate-600"}`}>
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2">
                      <span className={plan.highlighted ? "text-white" : "text-violet-600"}>✓</span>{f}
                    </li>
                  ))}
                </ul>
                <button type="button" disabled={isLoading} onClick={() => handleSubscribe(plan)} className={`mt-8 block w-full rounded-2xl py-3 text-center font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${plan.highlighted ? "bg-white text-violet-700 shadow-md hover:bg-violet-50" : "border border-violet-200 bg-white text-violet-700 hover:bg-violet-50"}`}>
                  {isLoading ? t("redirecting") : plan.isFree ? t("startFree") : t("subscribeNow")}
                </button>
              </div>
            );
          })}
        </div>
      </section>

      <footer className="border-t border-violet-200 bg-white py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-6 text-center sm:flex-row sm:justify-between">
          <p className="text-sm text-slate-500">{tc("copyright")}</p>
          <div className="flex items-center gap-4 text-sm text-slate-600">
            <Link href="#" className="hover:text-violet-600">{tc("privacy")}</Link>
            <span className="text-violet-200" aria-hidden>|</span>
            <Link href="#" className="hover:text-violet-600">{tc("terms")}</Link>
            <span className="text-violet-200" aria-hidden>|</span>
            <Link href="#" className="hover:text-violet-600">{tc("contact")}</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
