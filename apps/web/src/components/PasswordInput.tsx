"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { IconEye, IconEyeOff } from "./icons";

const INPUT_CLASS =
  "w-full rounded-2xl border border-violet-200 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-violet-400 focus:ring-2 focus:ring-violet-200";

interface PasswordInputProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minLength?: number;
  required?: boolean;
}

export function PasswordInput({
  id,
  value,
  onChange,
  placeholder,
  minLength,
  required = true,
}: PasswordInputProps) {
  const [visible, setVisible] = useState(false);
  const t = useTranslations("auth");

  return (
    <div className="relative">
      <input
        id={id}
        type={visible ? "text" : "password"}
        required={required}
        minLength={minLength}
        dir="ltr"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`${INPUT_CLASS} pe-12 text-left`}
        placeholder={placeholder}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        className="absolute end-3 top-1/2 -translate-y-1/2 rounded-xl p-2 text-slate-500 transition hover:bg-violet-50 hover:text-violet-700"
        aria-label={visible ? t("hidePassword") : t("showPassword")}
      >
        {visible ? <IconEyeOff /> : <IconEye />}
      </button>
    </div>
  );
}

export { INPUT_CLASS };
