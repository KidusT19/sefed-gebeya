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
        // Warm Ethiopian earth/coffee brown palette
        sebez: {
          50: "#faf6f0",
          100: "#f3ebdE",
          200: "#e6d7bc",
          300: "#d2ba92",
          400: "#ba9663",
          500: "#9e7740",
          600: "#845e32",
          700: "#6a4727",
          800: "#52361f",
          900: "#3d2717",
          950: "#24160c",
        },
        // Deep trusted commerce blue (CBE / Telebirr feel)
        tradeblue: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a8a",
          950: "#111e48",
        },
        // Warm canvas & card backgrounds (No stark white!)
        canvas: {
          base: "#f3ece2",    // Warm earthy sand background
          card: "#faf5ed",    // Soft parchment card surface
          cardAlt: "#eee4d5", // Slightly deeper sand accent
          border: "#dfd2be",  // Warm muted outline
        },
      },
    },
  },
  plugins: [],
};

export default config;
