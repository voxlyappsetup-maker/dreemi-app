import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "var(--primary)",
          dark: "var(--primary-dark)",
        },
        accent: "var(--accent)",
        card: "var(--card)",
        muted: "var(--muted)",
      },
      fontFamily: {
        arabic: ["var(--font-noto-arabic)", "Tahoma", "sans-serif"],
      },
      boxShadow: {
        soft: "0 8px 30px rgba(107, 78, 255, 0.12)",
        card: "0 4px 24px rgba(30, 27, 46, 0.08)",
      },
    },
  },
  plugins: [],
};
export default config;
