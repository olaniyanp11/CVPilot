import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-syne)", "sans-serif"],
        body: ["var(--font-dm-sans)", "sans-serif"],
      },
      colors: {
        cream: {
          50: "#fdfcf8",
          100: "#f8f6f0",
          200: "#f0ede4",
          300: "#e5e0d4",
        },
        ink: {
          DEFAULT: "#0c0c0c",
          soft: "#2a2a2a",
          muted: "#6b6b6b",
          faint: "#9a9a9a",
        },
        pilot: {
          blue: "#1a4fff",
          "blue-dark": "#0032cc",
          "blue-light": "#e8eeff",
          "blue-mid": "#3d6bff",
        },
        success: "#00c47a",
        warn: "#f59e0b",
      },
      animation: {
        ticker: "ticker 30s linear infinite",
        "fade-up": "fadeUp 0.6s ease forwards",
        "scale-in": "scaleIn 0.4s ease forwards",
        pulse: "pulse 2s ease-in-out infinite",
      },
      keyframes: {
        ticker: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
      backgroundImage: {
        "hero-glow":
          "radial-gradient(ellipse 70% 55% at 50% 25%, rgba(26,79,255,0.08) 0%, transparent 70%)",
        "blue-glow":
          "radial-gradient(ellipse 60% 40% at 60% 40%, rgba(255,255,255,0.1) 0%, transparent 60%)",
      },
    },
  },
  plugins: [],
};
export default config;
