"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconBook, IconSparkle } from "./icons";

interface DashboardSidebarProps {
  onLogout: () => void;
}

const NAV = [
  { href: "/dashboard", label: "لوحة التحكم", icon: "home" },
  { href: "/generate", label: "قصة جديدة", icon: "sparkle" },
] as const;

export function DashboardSidebar({ onLogout }: DashboardSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="flex w-full flex-col border-b border-violet-200 bg-white/90 px-4 py-5 backdrop-blur lg:fixed lg:inset-y-0 lg:right-0 lg:z-40 lg:w-64 lg:border-b-0 lg:border-l lg:px-5 lg:py-8">
      <Link href="/dashboard" className="mb-10 flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-violet-600 text-white shadow-md">
          <IconBook className="h-5 w-5" />
        </span>
        <span className="text-lg font-bold text-slate-900">قصص بلا نهاية</span>
      </Link>

      <nav className="flex flex-1 flex-col gap-1">
        {NAV.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                active
                  ? "bg-violet-600 text-white shadow-md"
                  : "text-slate-600 hover:bg-violet-50 hover:text-slate-900"
              }`}
            >
              {item.icon === "sparkle" ? (
                <IconSparkle className="h-5 w-5" />
              ) : (
                <span className="text-lg" aria-hidden>
                  🏠
                </span>
              )}
              {item.label}
            </Link>
          );
        })}
      </nav>

      <button
        type="button"
        onClick={onLogout}
        className="mt-6 rounded-2xl px-4 py-3 text-right text-sm text-slate-600 transition hover:bg-violet-50 hover:text-slate-900"
      >
        تسجيل الخروج
      </button>
    </aside>
  );
}
