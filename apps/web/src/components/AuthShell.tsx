"use client";

import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { Link } from "../i18n/routing";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { StarsBackground } from "./StarsBackground";
import { DreemiLogo } from "./DreemiLogo";

interface AuthShellProps {
  children: ReactNode;
  title: string;
  subtitle: string;
  footerText: string;
  footerLink: string;
  footerLinkLabel: string;
}

export function AuthShell({
  children,
  title,
  subtitle,
  footerText,
  footerLink,
  footerLinkLabel,
}: AuthShellProps) {
  const t = useTranslations("auth");
  const tc = useTranslations("common");

  return (
    <main className="relative min-h-screen bg-gradient-to-b from-violet-200 via-violet-50 to-white">
      <StarsBackground />
      <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col lg:flex-row">
        <div className="flex flex-1 items-center justify-center px-6 py-12 lg:px-12">
          <div className="w-full max-w-md">
            <div className="mb-8 flex items-center justify-between">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-sm font-medium text-violet-700 transition hover:text-violet-800"
              >
                {tc("backToHome")}
              </Link>
              <LanguageSwitcher />
            </div>
            <div className="rounded-2xl border border-violet-100 bg-white p-8 shadow-lg">
              <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
              <p className="mt-2 text-sm text-slate-600">{subtitle}</p>
              {children}
            </div>
            <p className="mt-6 text-center text-sm text-slate-600">
              {footerText}{" "}
              <Link
                href={footerLink as "/login" | "/register"}
                className="font-semibold text-violet-700 hover:text-violet-800 hover:underline"
              >
                {footerLinkLabel}
              </Link>
            </p>
          </div>
        </div>

        <div className="hidden flex-1 flex-col items-center justify-center bg-gradient-to-bl from-violet-100/80 via-violet-50/50 to-transparent px-12 lg:flex">
          <div className="max-w-md text-center">
            <div className="mx-auto mb-8 flex h-32 w-32 items-center justify-center rounded-3xl bg-violet-600 shadow-lg">
              <span className="text-6xl" aria-hidden>📖</span>
            </div>
            <DreemiLogo size="lg" />
            <p className="mt-4 text-lg leading-relaxed text-slate-600">
              {t("shellDescription")}
            </p>
            <ul className="mt-8 space-y-3 text-sm text-slate-600">
              <li className="flex items-center justify-center gap-2">
                <span className="text-violet-600">✓</span>
                <span>{t("shellFeature1")}</span>
              </li>
              <li className="flex items-center justify-center gap-2">
                <span className="text-violet-600">✓</span>
                <span>{t("shellFeature2")}</span>
              </li>
              <li className="flex items-center justify-center gap-2">
                <span className="text-violet-600">✓</span>
                <span>{t("shellFeature3")}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
