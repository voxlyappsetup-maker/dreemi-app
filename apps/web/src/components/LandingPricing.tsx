"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "../i18n/routing";

type BillingCycle = "monthly" | "yearly";

interface Plan {
  nameKey: string;
  featuresKey: string;
  monthlyPrice: string;
  yearlyPrice: string;
  highlighted: boolean;
  isFree: boolean;
  isContact: boolean;
}

const PLAN_DEFS: Plan[] = [
  { nameKey: "planFree", featuresKey: "planFreeFeatures", monthlyPrice: "$0", yearlyPrice: "$0", highlighted: false, isFree: true, isContact: false },
  { nameKey: "planIndividual", featuresKey: "planIndFeatures", monthlyPrice: "$4.99", yearlyPrice: "$47.90", highlighted: true, isFree: false, isContact: false },
  { nameKey: "planFamily", featuresKey: "planFamilyFeatures", monthlyPrice: "$9.99", yearlyPrice: "$95.90", highlighted: false, isFree: false, isContact: false },
  { nameKey: "planSchool", featuresKey: "planSchoolFeatures", monthlyPrice: "$29.99", yearlyPrice: "$287.90", highlighted: false, isFree: false, isContact: true },
];

export function LandingPricing() {
  const t = useTranslations("landing");
  const [cycle, setCycle] = useState<BillingCycle>("monthly");

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

        <div className="mt-12 grid gap-6 lg:grid-cols-4">
          {PLAN_DEFS.map((plan) => {
            const name = t(plan.nameKey as Parameters<typeof t>[0]);
            const features = t.raw(plan.featuresKey as string) as string[];
            const price = cycle === "yearly" ? plan.yearlyPrice : plan.monthlyPrice;
            const sub = plan.isFree ? "" : cycle === "yearly" ? t("perYear") : t("perMonth");

            let cta: string;
            let href: string;
            if (plan.isFree) {
              cta = t("ctaFree");
              href = "/register";
            } else if (plan.isContact) {
              cta = t("ctaContact");
              href = "mailto:contact@dreemi.app?subject=School Plan";
            } else {
              cta = t("ctaSignUp");
              href = "/register";
            }

            return (
              <div
                key={plan.nameKey}
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

                {cycle === "yearly" && !plan.isFree && !plan.isContact && (
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

                {plan.isContact ? (
                  <a
                    href={href}
                    className="mt-8 block w-full rounded-2xl border border-violet-200 bg-white py-3 text-center text-sm font-bold text-violet-700 transition hover:bg-violet-50"
                  >
                    {cta}
                  </a>
                ) : (
                  <Link
                    href={href as "/register"}
                    className={`mt-8 block w-full rounded-2xl py-3 text-center text-sm font-bold transition ${
                      plan.highlighted
                        ? "bg-white text-violet-700 shadow-md hover:bg-violet-50"
                        : "border border-violet-200 bg-white text-violet-700 hover:bg-violet-50"
                    }`}
                  >
                    {cta}
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
