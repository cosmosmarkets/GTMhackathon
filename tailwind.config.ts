import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // ── Voiceprint Specimen — a Lightfern reading room ──────────────
        // Surfaces: a clean light cream ground (no aged paper), raised insets.
        paper: {
          DEFAULT: "#F5EFE1", // page canvas — clean light cream
          subtle: "#EFE7D3", // recessed bands
          deep: "#E7DCC4", // strongest cream fill
        },
        surface: {
          DEFAULT: "#FCF7EC", // card / specimen inset
          muted: "#F8F2E4", // quiet fills
          dark: "#14160E", // the dark "bloom" reveal
          panel: "#1B1E13", // raised panel on the dark reveal
        },
        // Content: warm sepia-ink scale.
        ink: {
          DEFAULT: "#2A2016", // primary text
          muted: "#4A3F2E", // secondary text
          soft: "#6B5D44", // tertiary / labels
          faint: "#8A7A5A", // captions
        },
        // Hairline borders (warm sepia, used at low alpha inline too).
        line: {
          DEFAULT: "rgba(42,32,22,0.45)",
          soft: "rgba(42,32,22,0.30)",
          strong: "rgba(42,32,22,0.60)",
        },
        // Primary brand accent — deep forest green.
        accent: {
          DEFAULT: "#39492C",
          deep: "#39492C",
          soft: "#E9E6D2", // tint background
          dim: "#7D9359", // muted sage (on dark)
        },
        // Secondary accents.
        rust: "#6E3B2E", // sienna — links, plate numerals
        clay: "#A7795C", // terracotta — captions / "No. 001"
        gold: {
          DEFAULT: "#C79A3E",
          light: "#D8B566", // on dark
          pale: "#DDC789", // archetype italics on dark
        },
        cream: {
          DEFAULT: "#ECE3CF", // text on the dark reveal
          soft: "#B6A983", // muted text on dark
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "Cormorant Garamond", "Georgia", "serif"],
        body: ["var(--font-body)", "EB Garamond", "Georgia", "serif"],
        label: ["var(--font-label)", "Marcellus SC", "Georgia", "serif"],
        // back-compat aliases used by older markup
        serif: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-body)", "Georgia", "serif"],
        mono: ["var(--font-label)", "Georgia", "serif"],
      },
      letterSpacing: {
        label: "0.26em",
        wide: "0.2em",
      },
      boxShadow: {
        // Hard offset "letterpress" shadow for the dark engraved buttons.
        press: "inset 0 0 0 1px rgba(239,227,204,.22), 4px 4px 0 0 rgba(42,32,22,.32)",
        "press-hover": "inset 0 0 0 1px rgba(239,227,204,.30), 6px 6px 0 0 rgba(42,32,22,.36)",
        plate: "2px 3px 0 0 rgba(42,32,22,.16)",
        soft: "0 1px 2px rgba(42,32,22,0.05), 0 10px 28px -16px rgba(42,32,22,0.18)",
        lift: "0 2px 4px rgba(42,32,22,0.06), 0 40px 80px -40px rgba(0,0,0,0.8)",
      },
      keyframes: {
        "vp-rise": {
          "0%": { opacity: "0", transform: "translateY(18px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "vp-fade": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "vp-pulse": {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "0.85" },
        },
        "vp-sway": {
          "0%, 100%": { transform: "rotate(-2.2deg)" },
          "50%": { transform: "rotate(2.2deg)" },
        },
        "vp-glow": {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "0.72" },
        },
        "vp-bloom": {
          "0%": { opacity: "0", transform: "translateY(26px) scale(0.985)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        "vp-frond": {
          "0%, 100%": { transform: "rotate(-1.1deg) translateY(0)" },
          "50%": { transform: "rotate(1.1deg) translateY(-6px)" },
        },
      },
      animation: {
        // primary entrances
        "vp-rise": "vp-rise 0.8s cubic-bezier(0.22,1,0.36,1) both",
        "vp-fade": "vp-fade 0.6s ease both",
        "vp-bloom": "vp-bloom 0.9s cubic-bezier(0.22,1,0.36,1) both",
        // ambient loops
        "vp-sway": "vp-sway 4.5s ease-in-out infinite",
        "vp-glow": "vp-glow 6s ease-in-out infinite",
        "vp-pulse": "vp-pulse 3s ease-in-out infinite",
        "vp-frond": "vp-frond 7s ease-in-out infinite",
        // back-compat alias (old markup referenced `fade-up`)
        "fade-up": "vp-rise 0.7s cubic-bezier(0.22,1,0.36,1) both",
      },
    },
  },
  plugins: [],
};

export default config;
