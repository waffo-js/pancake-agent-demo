import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Pancake brand — forest green primary, teal-black dark canvas
        pancake: {
          primary: "#7CCB02",
          "primary-hover": "#8EDC1A",
          "primary-soft": "#adf185",
          bg: "#060F11",
          card: "#0A1A1F",
          "card-hover": "#0F2329",
          border: "#16323B",
          text: "#E8F2E8",
          "text-muted": "#7A8A85",
          "text-dim": "#4A5A55",
          success: "#7CCB02",
          warning: "#F5A623",
          danger: "#E5484D",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "monospace"],
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "fade-in": "fadeIn 0.4s ease-out",
        "slide-up": "slideUp 0.5s ease-out",
      },
      keyframes: {
        fadeIn: { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
