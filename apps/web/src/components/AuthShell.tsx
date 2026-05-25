import type { ReactNode } from "react";
import Link from "next/link";
import { StarsBackground } from "./StarsBackground";

interface AuthShellProps {
  children: ReactNode;
  title: string;
  subtitle: string;
  footerText: string;
  footerLink: string;
  footerLinkLabel: string;
}

export function AuthShell({
  children,
  title,
  subtitle,
  footerText,
  footerLink,
  footerLinkLabel,
}: AuthShellProps) {
  return (
    <main className="relative min-h-screen bg-gradient-to-b from-violet-200 via-violet-50 to-white">
      <StarsBackground />
      <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col lg:flex-row">
        <div className="flex flex-1 items-center justify-center px-6 py-12 lg:px-12">
          <div className="w-full max-w-md">
            <Link
              href="/"
              className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-violet-700 transition hover:text-violet-800"
            >
              ← العودة للرئيسية
            </Link>
            <div className="rounded-2xl border border-violet-100 bg-white p-8 shadow-lg">
              <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
              <p className="mt-2 text-sm text-slate-600">{subtitle}</p>
              {children}
            </div>
            <p className="mt-6 text-center text-sm text-slate-600">
              {footerText}{" "}
              <Link
                href={footerLink}
                className="font-semibold text-violet-700 hover:text-violet-800 hover:underline"
              >
                {footerLinkLabel}
              </Link>
            </p>
          </div>
        </div>

        <div className="hidden flex-1 flex-col items-center justify-center bg-gradient-to-bl from-violet-100/80 via-violet-50/50 to-transparent px-12 lg:flex">
          <div className="max-w-md text-center">
            <div className="mx-auto mb-8 flex h-32 w-32 items-center justify-center rounded-3xl bg-violet-600 shadow-lg">
              <span className="text-6xl" aria-hidden>
                📖
              </span>
            </div>
            <h2 className="text-3xl font-bold text-slate-900">قصص بلا نهاية</h2>
            <p className="mt-4 text-lg leading-relaxed text-slate-600">
              قصص نوم مخصصة تبعث على الطمأنينة — مصممة للآباء الذين يهتمون
              بخيال أطفالهم.
            </p>
            <ul className="mt-8 space-y-3 text-right text-sm text-slate-600">
              <li className="flex items-center justify-end gap-2">
                <span>قصص باسم طفلك الحقيقي</span>
                <span className="text-violet-600">✓</span>
              </li>
              <li className="flex items-center justify-end gap-2">
                <span>آمنة ومناسبة للعمر</span>
                <span className="text-violet-600">✓</span>
              </li>
              <li className="flex items-center justify-end gap-2">
                <span>جاهزة خلال دقائق</span>
                <span className="text-violet-600">✓</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
