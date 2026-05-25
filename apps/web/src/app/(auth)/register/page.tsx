"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import type { Language } from "@qisas/types";
import { ApiError, register } from "@/lib/api";
import { saveAuth } from "@/lib/storage";
import { AuthShell } from "@/components/AuthShell";
import { FormError } from "@/components/FormError";
import { INPUT_CLASS, PasswordInput } from "@/components/PasswordInput";

const BTN_PRIMARY =
  "w-full rounded-2xl bg-violet-600 px-6 py-3 font-semibold text-white shadow-lg transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [language, setLanguage] = useState<Language>("ar");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const data = await register({ name, email, password, language });
      saveAuth(data.accessToken, data.refreshToken, data.user);
      router.push("/dashboard");
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "فشل إنشاء الحساب، حاول مرة أخرى"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      title="إنشاء حساب جديد"
      subtitle="انضم إلى آلاف العائلات التي تثق بنا لقصص ما قبل النوم"
      footerText="لديك حساب؟"
      footerLink="/login"
      footerLinkLabel="تسجيل الدخول"
    >
      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <div>
          <label htmlFor="name" className="mb-2 block text-sm font-semibold text-slate-900">
            الاسم
          </label>
          <input
            id="name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={INPUT_CLASS}
            placeholder="مثال: هادن"
          />
        </div>

        <div>
          <label htmlFor="email" className="mb-2 block text-sm font-semibold text-slate-900">
            البريد الإلكتروني
          </label>
          <input
            id="email"
            type="email"
            required
            dir="ltr"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`${INPUT_CLASS} text-left`}
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label htmlFor="password" className="mb-2 block text-sm font-semibold text-slate-900">
            كلمة المرور
          </label>
          <PasswordInput
            id="password"
            value={password}
            onChange={setPassword}
            placeholder="8 أحرف على الأقل"
            minLength={8}
          />
        </div>

        <div>
          <label htmlFor="language" className="mb-2 block text-sm font-semibold text-slate-900">
            اللغة المفضلة
          </label>
          <select
            id="language"
            value={language}
            onChange={(e) => setLanguage(e.target.value as Language)}
            className={INPUT_CLASS}
          >
            <option value="ar">العربية</option>
            <option value="en">English</option>
            <option value="fr">Français</option>
          </select>
        </div>

        {error && <FormError message={error} />}

        <button type="submit" disabled={loading} className={BTN_PRIMARY}>
          {loading ? "جاري الإنشاء..." : "إنشاء الحساب"}
        </button>
      </form>
    </AuthShell>
  );
}
