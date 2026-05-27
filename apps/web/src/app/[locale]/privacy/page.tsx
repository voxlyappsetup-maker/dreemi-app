import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Link } from "../../../i18n/routing";
import { LanguageSwitcher } from "../../../components/LanguageSwitcher";

export default function PrivacyPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  setRequestLocale(locale);
  const t = useTranslations("privacy");
  const tc = useTranslations("common");

  const sections: Array<{
    title: string;
    body: string[];
    bullets?: string[];
  }> = [
    {
      title: t("sections.dataWeCollect.title"),
      body: t.raw("sections.dataWeCollect.body") as string[],
      bullets: t.raw("sections.dataWeCollect.bullets") as string[],
    },
    {
      title: t("sections.howWeUse.title"),
      body: t.raw("sections.howWeUse.body") as string[],
      bullets: t.raw("sections.howWeUse.bullets") as string[],
    },
    {
      title: t("sections.thirdParties.title"),
      body: t.raw("sections.thirdParties.body") as string[],
      bullets: t.raw("sections.thirdParties.bullets") as string[],
    },
    {
      title: t("sections.yourRights.title"),
      body: t.raw("sections.yourRights.body") as string[],
      bullets: t.raw("sections.yourRights.bullets") as string[],
    },
    {
      title: t("sections.children.title"),
      body: t.raw("sections.children.body") as string[],
      bullets: t.raw("sections.children.bullets") as string[],
    },
    {
      title: t("sections.cookies.title"),
      body: t.raw("sections.cookies.body") as string[],
      bullets: t.raw("sections.cookies.bullets") as string[],
    },
    {
      title: t("sections.contact.title"),
      body: t.raw("sections.contact.body") as string[],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-100 via-violet-50 to-white">
      <header className="border-b border-violet-100 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4 sm:px-6">
          <Link href="/" className="flex items-center gap-3 transition hover:opacity-80">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/dreemi-brand.png" alt="Dreemi" className="h-12 w-auto" draggable={false} />
          </Link>
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <Link
              href="/"
              className="rounded-xl border border-violet-200 bg-white px-3 py-2 text-sm font-semibold text-violet-700 transition hover:bg-violet-50"
            >
              {tc("backToHome")}
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
        <div className="rounded-2xl border border-violet-100 bg-white p-6 shadow-md sm:p-10">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            {t("title")}
          </h1>
          <p className="mt-3 text-sm font-medium text-violet-700">
            {t("lastUpdatedLabel")} {t("lastUpdatedDate")}
          </p>
          <p className="mt-6 text-base leading-relaxed text-slate-700">{t("intro")}</p>

          <div className="mt-10 space-y-10">
            {sections.map((s) => (
              <section key={s.title}>
                <h2 className="text-xl font-bold text-slate-900">{s.title}</h2>
                <div className="mt-3 space-y-3 text-sm leading-relaxed text-slate-700">
                  {s.body.map((p) => (
                    <p key={p}>{p}</p>
                  ))}
                </div>
                {s.bullets && s.bullets.length > 0 && (
                  <ul className="mt-4 list-inside list-disc space-y-2 text-sm text-slate-700">
                    {s.bullets.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </div>
        </div>

        <footer className="mt-10 border-t border-violet-100 bg-white/70 px-6 py-6 text-center text-sm text-slate-600 backdrop-blur sm:rounded-2xl">
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/privacy" className="font-semibold text-violet-700 hover:text-violet-800 hover:underline">
              {tc("privacy")}
            </Link>
            <span className="text-violet-200" aria-hidden>|</span>
            <Link href="/terms" className="font-semibold text-violet-700 hover:text-violet-800 hover:underline">
              {tc("terms")}
            </Link>
            <span className="text-violet-200" aria-hidden>|</span>
            <a className="font-semibold text-violet-700 hover:text-violet-800 hover:underline" href="mailto:privacy@dreemi.app">
              privacy@dreemi.app
            </a>
          </div>
          <p className="mt-3 text-xs text-slate-500">{tc("copyright")}</p>
        </footer>
      </main>
    </div>
  );
}

