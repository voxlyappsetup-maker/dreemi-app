"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "../i18n/routing";
import { createCheckout, ApiError, getPaymentsStatus } from "../lib/api";
import { isAuthenticated } from "../lib/storage";

const PENDING_PLAN_KEY = "pendingPlanVariantId";

type BillingCycle = "monthly" | "yearly";

interface Plan {
  key: string;
  nameKey: string;
  featuresKey: string;
  monthlyPrice: string;
  yearlyPrice: string;
  highlighted: boolean;
  isFree: boolean;
  variantMonthly?: number;
  variantYearly?: number;
}

const PLAN_DEFS: Plan[] = [
  { key: "FREE", nameKey: "planFree", featuresKey: "planFreeFeatures", monthlyPrice: "$0", yearlyPrice: "$0", highlighted: false, isFree: true },
  { key: "INDIVIDUAL", nameKey: "planIndividual", featuresKey: "planIndFeatures", monthlyPrice: "$4.99", yearlyPrice: "$47.90", highlighted: true, isFree: false, variantMonthly: 1712541, variantYearly: 1712569 },
  { key: "FAMILY", nameKey: "planFamily", featuresKey: "planFamilyFeatures", monthlyPrice: "$9.99", yearlyPrice: "$95.90", highlighted: false, isFree: false, variantMonthly: 1712590, variantYearly: 1712596 },
  { key: "SCHOOL", nameKey: "planSchool", featuresKey: "planSchoolFeatures", monthlyPrice: "$29.99", yearlyPrice: "$287.90", highlighted: false, isFree: false, variantMonthly: 1712619, variantYearly: 1712634 },
];

export function LandingPricing() {
  const t = useTranslations("landing");
  const tp = useTranslations("pricing");
  const router = useRouter();
  const [cycle, setCycle] = useState<BillingCycle>("monthly");
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [paymentsAvailable, setPaymentsAvailable] = useState(false);

  useEffect(() => {
    const auth = isAuthenticated();
    setLoggedIn(auth);
    if (auth && typeof window !== "undefined") {
      const pending = localStorage.getItem(PENDING_PLAN_KEY);
      if (pending) {
        localStorage.removeItem(PENDING_PLAN_KEY);
        void startCheckout(Number(pending));
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

  async function startCheckout(variantId: number) {
    setError(null);
    setLoadingPlan("PENDING");
    try {
      const url = await createCheckout(variantId);
      if (url) window.open(url, "_blank", "noopener,noreferrer");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : tp("checkoutError"));
    } finally {
      setLoadingPlan(null);
    }
  }

  async function handlePlanClick(plan: Plan) {
    if (plan.isFree) {
      router.push("/register");
      return;
    }
    const variantId = cycle === "yearly" ? plan.variantYearly : plan.variantMonthly;
    if (!variantId) {
      setError(tp("priceNotConfigured"));
      return;
    }
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
      setError(err instanceof ApiError ? err.message : tp("checkoutError"));
    } finally {
      setLoadingPlan(null);
    }
  }

  function buttonLabel(plan: Plan): string {
    if (!plan.isFree && !paymentsAvailable) return tp("paymentsTemporarilyUnavailable");
    if (loadingPlan === plan.key || loadingPlan === "PENDING") return tp("redirecting");
    if (plan.isFree) return t("ctaFree");
    return t("ctaSignUp");
  }

  return (
    <section className="relative z-20 w-full bg-violet-50 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-slate-900">{t("pricingTitle")}</h2>
          <p className="mt-3 text-slate-600">{t("pricingDesc")}</p>

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
              <span className="ms-1.5 rounded-lg bg-green-100 px-2 py-0.5 text-[11px] font-bold text-green-700">
                {t("save20")}
              </span>
            </button>
          </div>
        </div>

        {error && (
          <div className="mx-auto mt-6 max-w-lg rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-center text-sm text-red-700">
            {error}
          </div>
        )}
        {!paymentsAvailable && (
          <div className="mx-auto mt-6 max-w-lg rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-center text-sm text-amber-700">
            {tp("paymentsTemporarilyUnavailable")}
          </div>
        )}

        <div className="mt-12 grid gap-6 lg:grid-cols-4">
          {PLAN_DEFS.map((plan) => {
            const name = t(plan.nameKey as Parameters<typeof t>[0]);
            const features = t.raw(plan.featuresKey as string) as string[];
            const price = cycle === "yearly" ? plan.yearlyPrice : plan.monthlyPrice;
            const sub = plan.isFree ? "" : cycle === "yearly" ? t("perYear") : t("perMonth");
            const isLoading = loadingPlan === plan.key || loadingPlan === "PENDING";
            const paymentsBlocked = !plan.isFree && !paymentsAvailable;

            return (
              <div
                key={plan.key}
                className={`relative flex flex-col rounded-2xl p-7 shadow-md transition ${
                  plan.highlighted
                    ? "scale-[1.03] border-2 border-violet-500 bg-violet-600 text-white shadow-xl lg:scale-105"
                    : "border border-violet-100 bg-white text-slate-900"
                }`}
              >
                {plan.highlighted && (
                  <span className="absolute -top-3.5 start-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-amber-400 to-orange-400 px-4 py-1 text-xs font-bold text-white shadow-md">
                    {t("mostPopular")}
                  </span>
                )}

                <h3 className={`text-lg font-bold ${plan.highlighted ? "text-white" : "text-slate-900"}`}>
                  {name}
                </h3>

                <p className="mt-4 flex items-baseline gap-1">
                  <span className={`text-4xl font-extrabold tracking-tight ${plan.highlighted ? "text-white" : "text-violet-600"}`}>
                    {price}
                  </span>
                  {sub && (
                    <span className={`text-sm ${plan.highlighted ? "text-violet-200" : "text-slate-500"}`}>
                      {sub}
                    </span>
                  )}
                </p>

                {cycle === "yearly" && !plan.isFree && (
                  <p className={`mt-1 text-xs ${plan.highlighted ? "text-violet-200" : "text-slate-400"}`}>
                    ${(parseFloat(price.replace("$", "")) / 12).toFixed(2)}{t("perMonth")}
                  </p>
                )}

                <ul className={`mt-6 flex-1 space-y-3 text-sm ${plan.highlighted ? "text-violet-50" : "text-slate-600"}`}>
                  {features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <span className={`mt-0.5 text-xs ${plan.highlighted ? "text-green-300" : "text-green-500"}`}>✓</span>
                      {f}
                    </li>
                  ))}
                </ul>

                {plan.isFree ? (
                  <Link
                    href="/register"
                    className={`mt-8 block w-full rounded-2xl py-3 text-center text-sm font-bold transition ${
                      plan.highlighted
                        ? "bg-white text-violet-700 shadow-md hover:bg-violet-50"
                        : "border border-violet-200 bg-white text-violet-700 hover:bg-violet-50"
                    }`}
                  >
                    {buttonLabel(plan)}
                  </Link>
                ) : (
                  <button
                    type="button"
                    disabled={isLoading || paymentsBlocked}
                    onClick={() => handlePlanClick(plan)}
                    className={`mt-8 w-full rounded-2xl py-3 text-center text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-60 ${
                      plan.highlighted
                        ? "bg-white text-violet-700 shadow-md hover:bg-violet-50"
                        : "border border-violet-200 bg-white text-violet-700 hover:bg-violet-50"
                    }`}
                  >
                    {buttonLabel(plan)}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
