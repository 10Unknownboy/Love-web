import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#FDE8EB",
        crimson: {
          DEFAULT: "#6B1A3A",
          light: "#8B264E",
          subtle: "#9E3D60",
          dark: "#52142D",
        },
        pastel: {
          pink: "#FDE8EB",
          rose: "#FBCFE8",
          blush: "#FCE7F3",
        },
        sky: {
          DEFAULT: "#BFDBFE",
          accent: "#BFDBFE",
          light: "#E0F2FE",
          border: "#93C5FD",
        },
        ribbon: {
          pink: "#F472B6",
          dark: "#EC4899",
        },
      },
      fontFamily: {
        heading: ["var(--font-fredoka)", "sans-serif"],
        cursive: ["var(--font-dancing-script)", "cursive"],
        script: ["var(--font-dancing-script)", "cursive"],
        sans: ["var(--font-fredoka)", "sans-serif"],
      },
      boxShadow: {
        polaroid: "0 10px 25px -5px rgba(107, 26, 58, 0.15), 0 8px 10px -6px rgba(107, 26, 58, 0.1)",
        cute: "0 4px 14px 0 rgba(107, 26, 58, 0.15)",
        "cute-lg": "0 10px 25px -3px rgba(107, 26, 58, 0.2)",
        "gift-hover": "0 14px 28px rgba(107, 26, 58, 0.2), 0 10px 10px rgba(107, 26, 58, 0.12)",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" },
        },
        pulseHeart: {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.08)" },
        },
        wiggle: {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" },
        },
        cuteBounce: {
          "0%, 100%": { transform: "translateY(0)" },
          "35%": { transform: "translateY(-10px) scale(1.03)" },
          "50%": { transform: "translateY(0)" },
          "65%": { transform: "translateY(-4px) scale(1.01)" },
        },
        unlockReveal: {
          "0%": { opacity: "0", transform: "scale(0.85) translateY(12px)" },
          "100%": { opacity: "1", transform: "scale(1) translateY(0)" },
        },
      },
      animation: {
        float: "float 3s ease-in-out infinite",
        "pulse-heart": "pulseHeart 1.5s ease-in-out infinite",
        wiggle: "wiggle 0.8s ease-in-out infinite",
        "cute-bounce": "cuteBounce 2s ease-in-out infinite",
        "unlock-reveal": "unlockReveal 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
      },
    },
  },
  plugins: [],
};

export default config;
