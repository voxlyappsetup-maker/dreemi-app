import { useTranslations } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Link } from "../../i18n/routing";
import { LanguageSwitcher } from "../../components/LanguageSwitcher";
import { LandingPricing } from "../../components/LandingPricing";
import { DreemiLogo } from "../../components/DreemiLogo";

const HERO_IMG = "/dreemi-hero.png";

export default function HomePage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  setRequestLocale(locale);
  const t = useTranslations("landing");
  const tc = useTranslations("common");

  const STEPS = [
    { emoji: "👶", title: t("step1Title"), desc: t("step1Desc") },
    { emoji: "✨", title: t("step2Title"), desc: t("step2Desc") },
    { emoji: "📖", title: t("step3Title"), desc: t("step3Desc") },
  ];

  const FEATURES = [
    { emoji: "🌍", title: t("feat1Title"), desc: t("feat1Desc") },
    { emoji: "🎨", title: t("feat2Title"), desc: t("feat2Desc") },
    { emoji: "🔊", title: t("feat3Title"), desc: t("feat3Desc") },
    { emoji: "📄", title: t("feat4Title"), desc: t("feat4Desc") },
    { emoji: "👨‍👩‍👧", title: t("feat5Title"), desc: t("feat5Desc") },
    { emoji: "🛡️", title: t("feat6Title"), desc: t("feat6Desc") },
  ];

  const AVATAR_COLORS = ["bg-violet-500", "bg-purple-500", "bg-fuchsia-500"];
  const TESTIMONIALS = [
    { name: t("test1Name"), text: t("test1Text"), initial: t("test1Initial"), stars: 5 },
    { name: t("test2Name"), text: t("test2Text"), initial: t("test2Initial"), stars: 5 },
    { name: t("test3Name"), text: t("test3Text"), initial: t("test3Initial"), stars: 5 },
  ];

  return (
    <div className="bg-white">
      {/* ── Nav ── */}
      <header className="sticky top-0 z-50 border-b border-violet-100 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="transition hover:opacity-80">
            <span className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/dreemi-hero.png"
                alt="Dreemi"
                className="h-12 w-auto"
                draggable={false}
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/dreemi-logo.png"
                alt="Dreemi"
                className="h-10 w-auto origin-left scale-150"
                draggable={false}
              />
            </span>
          </Link>
          <nav className="flex items-center gap-2 sm:gap-4">
            <LanguageSwitcher />
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
          </nav>
        </div>
      </header>

      {/* ── 1. Hero ── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-violet-100 via-violet-50 to-white pb-20 pt-16 sm:pt-24">
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <div className="absolute -top-24 right-1/3 h-72 w-72 rounded-full bg-violet-400/20 blur-3xl" />
          <div className="absolute bottom-0 left-1/4 h-56 w-56 rounded-full bg-purple-400/15 blur-3xl" />
        </div>

        <div className="relative z-10 mx-auto grid max-w-6xl items-center gap-12 px-6 lg:grid-cols-2">
          <div className="text-center lg:text-start">
            <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-200 bg-white/80 px-4 py-2 text-sm font-medium text-violet-700 shadow-sm backdrop-blur">
              <span className="h-2 w-2 animate-pulse rounded-full bg-violet-600" />
              {t("joinFamilies")}
            </span>

            <h1 className="mt-4 bg-gradient-to-r from-violet-600 via-purple-600 to-violet-700 bg-clip-text text-4xl font-extrabold leading-tight tracking-tight text-transparent sm:text-5xl md:text-6xl">
              {t("heroTitle")}
              <br />
              {t("heroHighlight")}
            </h1>

            <p className="mt-6 max-w-lg text-lg leading-relaxed text-slate-600 sm:text-xl lg:max-w-none">
              {t("heroDescription")}
            </p>

            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row lg:justify-start">
              <Link
                href="/register"
                className="w-full rounded-2xl bg-violet-600 px-10 py-4 text-center text-lg font-semibold text-white shadow-lg transition hover:bg-violet-700 hover:shadow-xl sm:w-auto"
              >
                {t("startFree")}
              </Link>
              <a
                href="#how-it-works"
                className="w-full rounded-2xl border border-violet-200 bg-white px-10 py-4 text-center text-lg font-semibold text-violet-700 shadow-md transition hover:border-violet-300 hover:bg-violet-50 sm:w-auto"
              >
                {t("seeHow")}
              </a>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-xl lg:max-w-none">
            <div className="overflow-hidden rounded-[2rem] border-4 border-white shadow-2xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={HERO_IMG}
                alt="Child reading a magical bedtime story"
                className="aspect-[16/11] w-full object-cover"
                loading="eager"
              />
            </div>
            <div className="absolute -bottom-4 -start-4 rounded-2xl border border-violet-200 bg-white px-4 py-3 shadow-lg">
              <p className="text-sm font-bold text-violet-700">+1,000</p>
              <p className="text-xs text-slate-500">{t("happyFamilies")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. How It Works ── */}
      <section id="how-it-works" className="bg-white py-20 sm:py-28">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">
            {t("howTitle")}
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-slate-600">
            {t("howDesc")}
          </p>

          <div className="mt-16 grid gap-8 sm:grid-cols-3">
            {STEPS.map((s, i) => (
              <div key={i} className="relative flex flex-col items-center">
                {i < STEPS.length - 1 && (
                  <div className="pointer-events-none absolute start-[calc(50%+48px)] top-10 hidden h-0.5 w-[calc(100%-96px)] bg-gradient-to-r from-violet-300 to-violet-100 sm:block" />
                )}
                <span className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-violet-100 to-purple-100 text-4xl shadow-md">
                  {s.emoji}
                </span>
                <span className="mt-2 flex h-7 w-7 items-center justify-center rounded-full bg-violet-600 text-xs font-bold text-white">
                  {i + 1}
                </span>
                <h3 className="mt-4 text-xl font-bold text-slate-900">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. Features Grid ── */}
      <section className="bg-violet-50/60 py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">
              {t("featuresTitle")}
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-slate-600">
              {t("featuresDesc")}
            </p>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="rounded-2xl border border-violet-100 bg-violet-50 p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-4xl shadow-sm">
                  {f.emoji}
                </span>
                <h3 className="mt-5 text-lg font-bold text-slate-900">
                  {f.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. Testimonials ── */}
      <section className="bg-white py-20 sm:py-28">
        <div className="mx-auto max-w-5xl px-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">
              {t("testimonialsTitle")}
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-slate-600">
              {t("testimonialsDesc")}
            </p>
          </div>

          <div className="mt-14 grid gap-8 sm:grid-cols-3">
            {TESTIMONIALS.map((review, i) => (
              <div
                key={i}
                className="rounded-2xl border border-violet-100 bg-gradient-to-br from-white to-violet-50/50 p-7 shadow-sm"
              >
                <div className="flex gap-0.5 text-amber-400">
                  {Array.from({ length: review.stars }).map((_, s) => (
                    <span key={s}>★</span>
                  ))}
                </div>
                <p className="mt-4 text-sm leading-relaxed text-slate-700">
                  &ldquo;{review.text}&rdquo;
                </p>
                <div className="mt-5 flex items-center gap-3">
                  <span className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white ${AVATAR_COLORS[i % AVATAR_COLORS.length]}`}>
                    {review.initial}
                  </span>
                  <p className="text-sm font-bold text-violet-700">
                    {review.name}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. Pricing ── */}
      <LandingPricing />

      {/* ── 6. Final CTA ── */}
      <section className="bg-gradient-to-b from-violet-600 to-purple-700 py-20 sm:py-28">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            {t("ctaTitle")}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-violet-200">
            {t("ctaDesc")}
          </p>
          <Link
            href="/register"
            className="mt-10 inline-block rounded-2xl bg-white px-12 py-4 text-lg font-bold text-violet-700 shadow-xl transition hover:bg-violet-50 hover:shadow-2xl"
          >
            {t("ctaButton")}
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-violet-100 bg-white py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-6 text-center sm:flex-row sm:justify-between">
          <div className="flex items-center gap-3">
            <DreemiLogo size="sm" />
            <span className="text-sm text-slate-500">{tc("copyright")}</span>
          </div>
          <div className="flex items-center gap-4 text-sm text-slate-600">
            <Link href="#" className="transition hover:text-violet-600">
              {tc("privacy")}
            </Link>
            <span className="text-violet-200" aria-hidden>
              |
            </span>
            <Link href="#" className="transition hover:text-violet-600">
              {tc("terms")}
            </Link>
            <span className="text-violet-200" aria-hidden>
              |
            </span>
            <Link href="#" className="transition hover:text-violet-600">
              {tc("contact")}
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
