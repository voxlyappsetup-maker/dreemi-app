"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { ApiError, login } from "@/lib/api";
import { saveAuth } from "@/lib/storage";
import { AuthShell } from "@/components/AuthShell";
import { FormError } from "@/components/FormError";
import { INPUT_CLASS, PasswordInput } from "@/components/PasswordInput";

const BTN_PRIMARY =
  "w-full rounded-2xl bg-violet-600 px-6 py-3 font-semibold text-white shadow-lg transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const data = await login({ email, password });
      saveAuth(data.accessToken, data.refreshToken, data.user);
      router.push("/dashboard");
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "فشل تسجيل الدخول، حاول مرة أخرى"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      title="تسجيل الدخول"
      subtitle="مرحباً بعودتك — قصة الليلة بانتظاركم"
      footerText="ليس لديك حساب؟"
      footerLink="/register"
      footerLinkLabel="إنشاء حساب"
    >
      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
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
          <PasswordInput id="password" value={password} onChange={setPassword} />
        </div>

        {error && <FormError message={error} />}

        <button type="submit" disabled={loading} className={BTN_PRIMARY}>
          {loading ? "جاري الدخول..." : "دخول"}
        </button>
      </form>
    </AuthShell>
  );
}
