import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-indigo-50 via-[#faf8ff] to-amber-50" />
      <div className="absolute left-10 top-20 -z-10 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute bottom-20 right-10 -z-10 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />

      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <span className="text-xl font-bold text-primary">قصص بلا نهاية</span>
        <nav className="flex gap-3">
          <Link
            href="/login"
            className="rounded-full px-5 py-2 text-sm font-medium text-foreground transition hover:bg-white/60"
          >
            تسجيل الدخول
          </Link>
          <Link
            href="/register"
            className="rounded-full bg-primary px-5 py-2 text-sm font-medium text-white shadow-soft transition hover:bg-primary-dark"
          >
            إنشاء حساب
          </Link>
        </nav>
      </header>

      <section className="mx-auto max-w-4xl px-6 pb-24 pt-16 text-center">
        <p className="mb-4 inline-block rounded-full bg-white/80 px-4 py-1 text-sm text-primary shadow-sm">
          قصص نوم مخصصة لأطفالك
        </p>
        <h1 className="text-balance text-4xl font-bold leading-tight text-foreground sm:text-5xl md:text-6xl">
          قصص بلا نهاية
        </h1>
        <p className="text-balance mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted sm:text-xl">
          أنشئ قصصاً سحرية قبل النوم باسم طفلك، بلغته المفضلة، وقيم تربوية
          تلهم الخيال وتبعث على الهدوء.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/register"
            className="w-full rounded-full bg-primary px-8 py-4 text-lg font-semibold text-white shadow-soft transition hover:bg-primary-dark sm:w-auto"
          >
            ابدأ مجاناً
          </Link>
          <Link
            href="/login"
            className="w-full rounded-full border border-primary/20 bg-white px-8 py-4 text-lg font-medium text-primary transition hover:bg-indigo-50 sm:w-auto"
          >
            لدي حساب بالفعل
          </Link>
        </div>

        <div className="mt-16 grid gap-4 text-right sm:grid-cols-3">
          {[
            {
              title: "مخصصة لطفلك",
              desc: "اسم الطفل وعمره وموضوع القصة في كل مرة.",
            },
            {
              title: "ثلاث لغات",
              desc: "عربية، إنجليزية، أو فرنسية حسب اختيارك.",
            },
            {
              title: "قيم تربوية",
              desc: "أضف درساً أخلاقياً يناسب عمر طفلك.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-2xl bg-card p-6 text-right shadow-card"
            >
              <h3 className="font-semibold text-foreground">{item.title}</h3>
              <p className="mt-2 text-sm text-muted">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
