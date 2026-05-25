"use client";

import { FormEvent, useState } from "react";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import type { Language } from "@dreemi/types";
import { useRouter } from "../../../../i18n/routing";
import { ApiError, register } from "../../../../lib/api";
import { saveAuth } from "../../../../lib/storage";
import { AuthShell } from "../../../../components/AuthShell";
import { FormError } from "../../../../components/FormError";
import { INPUT_CLASS, PasswordInput } from "../../../../components/PasswordInput";

const BTN_PRIMARY =
  "w-full rounded-2xl bg-violet-600 px-6 py-3 font-semibold text-white shadow-lg transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60";

export default function RegisterPage() {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("auth");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [language, setLanguage] = useState<Language>(locale as Language);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const data = await register({ name, email, password, language });
      saveAuth(data.accessToken, data.refreshToken, data.user);
      const pending = localStorage.getItem("pendingPlanPriceId");
      router.push(pending ? "/pricing" : "/dashboard");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t("registerError"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      title={t("registerTitle")}
      subtitle={t("registerSubtitle")}
      footerText={t("haveAccount")}
      footerLink="/login"
      footerLinkLabel={t("loginButton")}
    >
      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <div>
          <label htmlFor="name" className="mb-2 block text-sm font-semibold text-slate-900">
            {t("name")}
          </label>
          <input
            id="name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={INPUT_CLASS}
            placeholder={t("namePlaceholder")}
          />
        </div>

        <div>
          <label htmlFor="email" className="mb-2 block text-sm font-semibold text-slate-900">
            {t("email")}
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
            {t("password")}
          </label>
          <PasswordInput
            id="password"
            value={password}
            onChange={setPassword}
            placeholder={t("passwordMinLength")}
            minLength={8}
          />
        </div>

        <div>
          <label htmlFor="language" className="mb-2 block text-sm font-semibold text-slate-900">
            {t("preferredLanguage")}
          </label>
          <select
            id="language"
            value={language}
            onChange={(e) => setLanguage(e.target.value as Language)}
            className={INPUT_CLASS}
          >
            <option value="ar">{t("arabic")}</option>
            <option value="en">{t("english")}</option>
            <option value="fr">{t("french")}</option>
          </select>
        </div>

        {error && <FormError message={error} />}

        <button type="submit" disabled={loading} className={BTN_PRIMARY}>
          {loading ? t("creating") : t("createAccount")}
        </button>
      </form>
    </AuthShell>
  );
}
