/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      animation: {
        progress: "progress 1s ease-in-out forwards",
      },
      keyframes: {
        progress: {
          "0%": { width: "0%" },
          "100%": { width: "var(--progress-value, 100%)" },
        },
      },
    },
  },
  plugins: [],
};
