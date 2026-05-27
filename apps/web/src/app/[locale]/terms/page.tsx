import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Link } from "../../../i18n/routing";
import { PublicHeader } from "../../../components/PublicHeader";

export default function TermsPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  setRequestLocale(locale);
  const t = useTranslations("terms");
  const tc = useTranslations("common");

  const sections: Array<{
    title: string;
    body: string[];
    bullets?: string[];
  }> = [
    { title: t("sections.acceptance.title"), body: t.raw("sections.acceptance.body") as string[] },
    { title: t("sections.service.title"), body: t.raw("sections.service.body") as string[] },
    { title: t("sections.accounts.title"), body: t.raw("sections.accounts.body") as string[] },
    { title: t("sections.payments.title"), body: t.raw("sections.payments.body") as string[], bullets: t.raw("sections.payments.bullets") as string[] },
    { title: t("sections.ip.title"), body: t.raw("sections.ip.body") as string[], bullets: t.raw("sections.ip.bullets") as string[] },
    { title: t("sections.prohibited.title"), body: t.raw("sections.prohibited.body") as string[], bullets: t.raw("sections.prohibited.bullets") as string[] },
    { title: t("sections.termination.title"), body: t.raw("sections.termination.body") as string[] },
    { title: t("sections.liability.title"), body: t.raw("sections.liability.body") as string[] },
    { title: t("sections.law.title"), body: t.raw("sections.law.body") as string[] },
    { title: t("sections.contact.title"), body: t.raw("sections.contact.body") as string[] },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-100 via-violet-50 to-white">
      <PublicHeader />

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
            <a className="font-semibold text-violet-700 hover:text-violet-800 hover:underline" href="mailto:legal@dreemi.app">
              legal@dreemi.app
            </a>
          </div>
          <p className="mt-3 text-xs text-slate-500">{tc("copyright")}</p>
        </footer>
      </main>
    </div>
  );
}

