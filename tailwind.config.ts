import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Lightfern — botanical-tech, deep canopy dark + fern accent
        ink: {
          DEFAULT: "#07100C", // near-black canopy green
          800: "#0C1A14",
          700: "#11231B",
          600: "#1A3026",
        },
        fern: {
          DEFAULT: "#34D399", // primary accent (emerald/fern)
          bright: "#5EEAD4",
          deep: "#0F766E",
        },
        bone: {
          DEFAULT: "#F4F2EC", // warm off-white text
          muted: "#A7B0A9",
          faint: "#6B756E",
        },
      },
      fontFamily: {
        serif: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "glow-pulse": {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(52,211,153,0.0)" },
          "50%": { boxShadow: "0 0 32px 2px rgba(52,211,153,0.18)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.7s cubic-bezier(0.22,1,0.36,1) both",
        "glow-pulse": "glow-pulse 3.5s ease-in-out infinite",
        shimmer: "shimmer 2.2s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
