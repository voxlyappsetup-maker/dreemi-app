import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Noto_Sans_Arabic, Inter, Nunito } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "../../i18n/routing";
import { KeepAlive } from "../../components/KeepAlive";
import "../globals.css";

const notoArabic = Noto_Sans_Arabic({
  subsets: ["arabic"],
  variable: "--font-noto-arabic",
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600", "700"],
});

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
  weight: ["700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Dreemi — Magical Bedtime Stories",
  description: "Magical bedtime stories for your child — personalized, AI-powered, in Arabic, English & French.",
  icons: {
    icon: [{ url: "/dreemi-icon.png" }],
  },
  manifest: "/site.webmanifest",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { locale: string };
}) {
  const { locale } = params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();
  const isRTL = locale === "ar";

  return (
    <html lang={locale} dir={isRTL ? "rtl" : "ltr"}>
      <body
        className={`${notoArabic.variable} ${inter.variable} ${nunito.variable} font-sans antialiased`}
      >
        <NextIntlClientProvider messages={messages}>
          <KeepAlive />
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
