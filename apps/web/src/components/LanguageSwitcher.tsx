"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "../i18n/routing";
import { routing, type Locale } from "../i18n/routing";
import { useTransition } from "react";

const LOCALE_FLAGS: Record<Locale, string> = {
  ar: "https://flagcdn.com/w40/sa.png",
  en: "https://flagcdn.com/w40/gb.png",
  fr: "https://flagcdn.com/w40/fr.png",
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
    <div className="flex items-center gap-1.5">
      {routing.locales.map((loc) => (
        <button
          key={loc}
          type="button"
          onClick={() => switchLocale(loc)}
          disabled={isPending}
          className={`rounded-xl p-2 transition ${
            currentLocale === loc
              ? "bg-violet-600 shadow-sm ring-2 ring-violet-300"
              : "hover:bg-violet-50"
          }`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={LOCALE_FLAGS[loc]}
            alt={loc}
            className="h-5 w-7 rounded-sm object-cover"
          />
        </button>
      ))}
    </div>
  );
}
