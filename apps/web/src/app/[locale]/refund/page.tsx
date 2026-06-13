import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Link } from "../../../i18n/routing";
import { PublicHeader } from "../../../components/PublicHeader";

export default function RefundPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  setRequestLocale(locale);
  const t = useTranslations("refund");
  const tc = useTranslations("common");

  const sections: Array<{
    title: string;
    body: string[];
  }> = [
    { title: t("sections.eligibility.title"), body: t.raw("sections.eligibility.body") as string[] },
    { title: t("sections.request.title"), body: t.raw("sections.request.body") as string[] },
    { title: t("sections.review.title"), body: t.raw("sections.review.body") as string[] },
    { title: t("sections.cancellation.title"), body: t.raw("sections.cancellation.body") as string[] },
    { title: t("sections.provider.title"), body: t.raw("sections.provider.body") as string[] },
    { title: t("sections.updates.title"), body: t.raw("sections.updates.body") as string[] },
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
            <Link href="/refund" className="font-semibold text-violet-700 hover:text-violet-800 hover:underline">
              {tc("refund")}
            </Link>
            <span className="text-violet-200" aria-hidden>|</span>
            <a className="font-semibold text-violet-700 hover:text-violet-800 hover:underline" href="mailto:contact@dreemi.app">
              contact@dreemi.app
            </a>
          </div>
          <p className="mt-3 text-xs text-slate-500">{tc("copyright")}</p>
        </footer>
      </main>
    </div>
  );
}
