import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Lightfern brand system — warm, painterly, premium.
        // Surfaces: warm cream paper, raised white cards.
        paper: {
          DEFAULT: "#F7F4ED", // page canvas — warm cream
          subtle: "#EFEBE0", // recessed bands
        },
        surface: {
          DEFAULT: "#FFFFFF", // cards
          muted: "#FBF9F3", // quiet fills / insets
          dark: "#1C1A16", // inverted footer / dark sections
        },
        // Content: warm obsidian scale.
        ink: {
          DEFAULT: "#1C1A16", // primary text / obsidian
          muted: "#6A655B", // secondary text
          faint: "#9A9488", // tertiary / captions
        },
        // Hairline borders (warm).
        line: {
          DEFAULT: "#E6E1D5",
          strong: "#D6D0C1",
        },
        // Primary brand accent — soft sage green.
        accent: {
          DEFAULT: "#6E7F5B",
          deep: "#4F5E3E", // text on light / hover
          soft: "#EBF0E2", // tint background
        },
        // Secondary accents from the brand palette.
        gold: {
          DEFAULT: "#C79A3E",
          vivid: "#D7A62B",
        },
        clay: "#B5594A", // warm red accent
      },
      fontFamily: {
        serif: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      boxShadow: {
        soft: "0 1px 2px rgba(28,26,22,0.04), 0 8px 24px -14px rgba(28,26,22,0.12)",
        lift: "0 2px 4px rgba(28,26,22,0.05), 0 28px 56px -24px rgba(28,26,22,0.20)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "glow-pulse": {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(110,127,91,0.0)" },
          "50%": { boxShadow: "0 0 0 4px rgba(110,127,91,0.10)" },
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
