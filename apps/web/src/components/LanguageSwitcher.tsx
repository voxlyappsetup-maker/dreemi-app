"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "../i18n/routing";
import { routing, type Locale } from "../i18n/routing";
import { useTransition } from "react";

const LOCALE_LABELS: Record<Locale, string> = {
  ar: "AR",
  en: "EN",
  fr: "FR",
};

export function LanguageSwitcher() {
  const currentLocale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  function switchLocale(nextLocale: string) {
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale as Locale });
    });
  }

  return (
    <div className="flex items-center gap-1">
      {routing.locales.map((loc) => (
        <button
          key={loc}
          type="button"
          onClick={() => switchLocale(loc)}
          disabled={isPending}
          className={`rounded-lg px-2.5 py-1.5 text-xs font-semibold transition ${
            currentLocale === loc
              ? "bg-violet-600 text-white shadow-sm"
              : "text-slate-500 hover:bg-violet-50 hover:text-violet-700"
          }`}
        >
          {LOCALE_LABELS[loc]}
        </button>
      ))}
    </div>
  );
}
