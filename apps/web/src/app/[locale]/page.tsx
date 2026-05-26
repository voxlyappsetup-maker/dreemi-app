import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Link } from "../../i18n/routing";
import { LanguageSwitcher } from "../../components/LanguageSwitcher";
import { IconBook, IconGlobe, IconSparkle } from "../../components/icons";
import { LandingPricing } from "../../components/LandingPricing";

const STAR_POSITIONS = [
  "top-[12%] right-[18%]",
  "top-[22%] right-[42%]",
  "top-[8%] right-[65%]",
  "top-[35%] right-[8%]",
  "top-[45%] right-[78%]",
  "top-[55%] right-[28%]",
  "top-[18%] right-[88%]",
  "top-[62%] right-[52%]",
  "top-[72%] right-[15%]",
  "top-[28%] right-[55%]",
  "top-[48%] right-[92%]",
  "top-[78%] right-[68%]",
] as const;

export default function HomePage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  setRequestLocale(locale);
  const t = useTranslations("landing");
  const tc = useTranslations("common");

  const FEATURES = [
    { Icon: IconBook, title: t("featureCustomTitle"), desc: t("featureCustomDesc") },
    { Icon: IconGlobe, title: t("featureLanguagesTitle"), desc: t("featureLanguagesDesc") },
    { Icon: IconSparkle, title: t("featureValuesTitle"), desc: t("featureValuesDesc") },
  ];

  return (
    <div className="bg-violet-50">
      <section className="relative isolate bg-gradient-to-b from-violet-200 via-violet-50 to-white pb-16">
        <div className="pointer-events-none absolute inset-0 z-0" aria-hidden>
          <div className="absolute right-1/4 top-[15%] h-28 w-28 rounded-full bg-violet-400/20 blur-2xl" />
          <div className="absolute right-[70%] top-1/2 h-40 w-40 rounded-full bg-purple-400/15 blur-3xl" />
          {STAR_POSITIONS.map((pos, i) => (
            <span
              key={pos}
              className={`absolute ${pos} h-1.5 w-1.5 animate-pulse rounded-full bg-violet-500`}
              style={{ animationDelay: `${i * 0.3}s` }}
            />
          ))}
        </div>

        <div className="relative z-10 mx-auto w-full max-w-6xl px-6">
          <header className="flex flex-row items-center justify-between gap-4 py-6">
            <Link href="/" className="text-xl font-bold text-violet-700 transition hover:text-violet-800">
              Dreemi
            </Link>
            <nav className="flex flex-row flex-nowrap items-center gap-2 sm:gap-3">
              <LanguageSwitcher />
              <Link href="/login" className="whitespace-nowrap rounded-2xl px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-white/80">
                {tc("login")}
              </Link>
              <Link href="/register" className="whitespace-nowrap rounded-2xl bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:bg-violet-700">
                {tc("register")}
              </Link>
            </nav>
          </header>

          <div className="mx-auto max-w-4xl pt-12 text-center sm:pt-16">
            <p className="mb-6 inline-flex flex-row items-center gap-2 rounded-2xl border border-violet-200 bg-white/90 px-4 py-2 text-sm font-medium text-violet-700 shadow-md backdrop-blur">
              <span className="h-2 w-2 shrink-0 animate-pulse rounded-full bg-violet-600" />
              {t("joinFamilies")}
            </p>
            <h1 className="text-4xl font-bold leading-tight tracking-tight text-slate-900 sm:text-5xl md:text-6xl">
              {t("heroTitle")}
              <br />
              <span className="text-violet-600">{t("heroHighlight")}</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-600 sm:text-xl">
              {t("heroDescription")}
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/register" className="w-full rounded-2xl bg-violet-600 px-10 py-4 text-lg font-semibold text-white shadow-lg transition hover:bg-violet-700 sm:w-auto">
                {t("startFree")}
              </Link>
              <Link href="/login" className="w-full rounded-2xl border border-violet-200 bg-white px-10 py-4 text-lg font-semibold text-violet-700 shadow-md transition hover:border-violet-300 hover:bg-violet-50 sm:w-auto">
                {t("haveAccount")}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-20 w-full bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-slate-900">{t("whyTrust")}</h2>
            <p className="mx-auto mt-3 max-w-xl text-slate-600">{t("whyTrustDesc")}</p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map(({ Icon, title, desc }) => (
              <div key={title} className="rounded-2xl border border-violet-100 bg-white p-8 shadow-md transition hover:-translate-y-1 hover:shadow-lg">
                <span className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-violet-100 text-violet-600">
                  <Icon className="h-7 w-7" />
                </span>
                <h3 className="mt-5 text-xl font-bold text-slate-900">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <LandingPricing />

      <footer className="relative z-20 w-full border-t border-violet-200 bg-white py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-6 text-center sm:flex-row sm:justify-between">
          <p className="text-sm text-slate-500">{tc("copyright")}</p>
          <div className="flex flex-row flex-wrap items-center justify-center gap-4 text-sm text-slate-600">
            <Link href="#" className="hover:text-violet-600">{tc("privacy")}</Link>
            <span className="text-violet-200" aria-hidden>|</span>
            <Link href="#" className="hover:text-violet-600">{tc("terms")}</Link>
            <span className="text-violet-200" aria-hidden>|</span>
            <Link href="#" className="hover:text-violet-600">{tc("contact")}</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
