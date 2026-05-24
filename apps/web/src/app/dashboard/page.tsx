"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { User } from "@qisas/types";
import { clearAuth, getStoredUser, isAuthenticated } from "@/lib/storage";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace("/login");
      return;
    }
    setUser(getStoredUser());
    setReady(true);
  }, [router]);

  if (!ready) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-muted">جاري التحميل...</p>
      </main>
    );
  }

  const displayName = user?.name ?? user?.email ?? "صديقنا";

  return (
    <main className="min-h-screen bg-gradient-to-b from-indigo-50 to-[#faf8ff]">
      <header className="border-b border-white/60 bg-white/70 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-5">
          <span className="font-bold text-primary">قصص بلا نهاية</span>
          <button
            type="button"
            className="text-sm text-muted transition hover:text-foreground"
            onClick={() => {
              clearAuth();
              router.replace("/login");
            }}
          >
            خروج
          </button>
        </div>
      </header>

      <section className="mx-auto max-w-4xl px-6 py-16">
        <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
          مرحباً {displayName}
        </h1>
        <p className="mt-3 max-w-xl text-muted">
          جاهز لقصة جديدة الليلة؟ أنشئ قصة نوم مخصصة لطفلك في دقائق.
        </p>

        <div className="mt-10">
          <Link
            href="/generate"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-4 text-lg font-semibold text-white shadow-soft transition hover:bg-primary-dark"
          >
            <span aria-hidden>✨</span>
            قصة جديدة
          </Link>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl bg-card p-6 shadow-card">
            <h2 className="font-semibold text-foreground">نصيحة لليلة</h2>
            <p className="mt-2 text-sm text-muted">
              اختر موضوعاً هادئاً مثل الصداقة أو الشجاعة لمساعدة طفلك على
              الاسترخاء قبل النوم.
            </p>
          </div>
          <div className="rounded-2xl bg-card p-6 shadow-card">
            <h2 className="font-semibold text-foreground">لغتك</h2>
            <p className="mt-2 text-sm text-muted">
              اللغة الحالية:{" "}
              <span className="font-medium text-primary">
                {user?.language === "ar"
                  ? "العربية"
                  : user?.language === "en"
                    ? "English"
                    : user?.language === "fr"
                      ? "Français"
                      : "—"}
              </span>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
