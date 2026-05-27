"use client";

import { useTranslations } from "next-intl";
import { Link } from "../i18n/routing";
import { LanguageSwitcher } from "./LanguageSwitcher";

export function PublicHeader({ variant = "guest" }: { variant?: "guest" | "authed" }) {
  const tc = useTranslations("common");
  const ts = useTranslations("sidebar");

  return (
    <header className="sticky top-0 z-50 border-b border-violet-100 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="transition hover:opacity-80">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/dreemi-brand.png"
            alt="Dreemi"
            className="h-28 w-auto"
            draggable={false}
          />
        </Link>

        <nav className="flex items-center gap-2 sm:gap-4">
          <LanguageSwitcher />
          {variant === "authed" ? (
            <Link
              href="/dashboard"
              className="whitespace-nowrap rounded-2xl bg-violet-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg transition hover:bg-violet-700 sm:px-6 sm:text-base"
            >
              {ts("dashboard")}
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="whitespace-nowrap rounded-2xl border border-violet-200 bg-white px-5 py-2.5 text-sm font-semibold text-violet-700 transition hover:bg-violet-50 sm:px-6 sm:text-base"
              >
                {tc("login")}
              </Link>
              <Link
                href="/register"
                className="whitespace-nowrap rounded-2xl bg-violet-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg transition hover:bg-violet-700 sm:px-6 sm:text-base"
              >
                {tc("register")}
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

