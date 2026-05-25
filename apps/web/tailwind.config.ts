import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-noto-arabic)", "Tahoma", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
