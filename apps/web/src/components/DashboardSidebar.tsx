"use client";

import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import type { Plan } from "@dreemi/types";
import { Link } from "../i18n/routing";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { IconSettings, IconSparkle, IconUsers } from "./icons";

interface DashboardSidebarProps {
  onLogout: () => void;
  plan?: Plan;
}

export function DashboardSidebar({ onLogout, plan = "FREE" }: DashboardSidebarProps) {
  const pathname = usePathname();
  const t = useTranslations("sidebar");
  const tc = useTranslations("common");
  const isFree = plan === "FREE";

  const PLAN_LABELS: Record<Plan, string> = {
    FREE: t("planFree"),
    INDIVIDUAL: t("planIndividual"),
    FAMILY: t("planFamily"),
    SCHOOL: t("planSchool"),
  };

  const NAV = [
    { href: "/dashboard" as const, label: t("dashboard"), icon: "home" },
    { href: "/children" as const, label: t("children"), icon: "children" },
    { href: "/generate" as const, label: t("newStory"), icon: "sparkle" },
    { href: "/settings" as const, label: t("settings"), icon: "settings" },
  ];

  return (
    <aside className="flex w-full flex-col border-b border-violet-200 bg-white/90 px-4 py-5 backdrop-blur lg:fixed lg:inset-y-0 lg:end-0 lg:z-40 lg:w-64 lg:border-b-0 lg:border-s lg:px-5 lg:py-8">
      <Link href="/dashboard" className="mb-10 flex flex-col items-center gap-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/dreemi-hero.png"
          alt="Dreemi"
          className="h-16 w-auto"
          draggable={false}
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/dreemi-logo.png"
          alt="Dreemi"
          className="h-10 w-auto"
          draggable={false}
        />
        <span
          className={`rounded-xl px-2 py-0.5 text-[11px] font-bold ${
            isFree ? "bg-slate-100 text-slate-600" : "bg-violet-100 text-violet-700"
          }`}
        >
          {PLAN_LABELS[plan]}
        </span>
      </Link>

      <nav className="flex flex-1 flex-col gap-1">
        {NAV.map((item) => {
          const active = pathname.endsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                active
                  ? "bg-violet-600 text-white shadow-md"
                  : "text-slate-600 hover:bg-violet-50 hover:text-slate-900"
              }`}
            >
              {item.icon === "sparkle" ? (
                <IconSparkle className="h-5 w-5" />
              ) : item.icon === "children" ? (
                <IconUsers className="h-5 w-5" />
              ) : item.icon === "settings" ? (
                <IconSettings className="h-5 w-5" />
              ) : (
                <span className="text-lg" aria-hidden>🏠</span>
              )}
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mb-3 flex justify-center">
        <LanguageSwitcher />
      </div>

      {isFree && (
        <Link
          href="/pricing"
          className="mt-1 flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-l from-violet-600 to-purple-600 px-4 py-3 text-sm font-semibold text-white shadow-md transition hover:from-violet-700 hover:to-purple-700"
        >
          <span aria-hidden>✦</span>
          {tc("upgradePlan")}
        </Link>
      )}

      <button
        type="button"
        onClick={onLogout}
        className="mt-3 rounded-2xl px-4 py-3 text-sm text-slate-600 transition hover:bg-violet-50 hover:text-slate-900"
      >
        {tc("logout")}
      </button>
    </aside>
  );
}
