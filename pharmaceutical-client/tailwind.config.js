/** @type {import('tailwindcss').Config} */
import typography from "@tailwindcss/typography";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      animation: {
        colorShift: "colorShift 1.618s ease-in-out infinite alternate",
        "spin-slow": "spin 3s linear infinite",
      },
      keyframes: {
        colorShift: {
          "0%": { filter: "hue-rotate(0deg)" },
          "50%": { filter: "hue-rotate(90deg)" },
          "100%": { filter: "hue-rotate(180deg)" },
        },
      },
    },
  },
  plugins: [typography],
};
