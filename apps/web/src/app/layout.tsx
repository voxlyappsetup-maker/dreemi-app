import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  icons: {
    icon: [{ url: "/dreemi-icon.png", type: "image/png" }],
    shortcut: [{ url: "/dreemi-icon.png", type: "image/png" }],
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
