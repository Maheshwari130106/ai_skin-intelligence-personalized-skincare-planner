/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],

  theme: {
    extend: {
      colors: {
        primary: {
          50: "#F5F0FF",
          100: "#E9DFFF",
          200: "#D6C2FF",
          300: "#B894FF",
          400: "#9B6DFF",
          500: "#7C3AED",
          600: "#6D28D9",
          700: "#5B21B6",
          800: "#4C1D95",
          900: "#3B0764",
        },
      },
    },
  },

  plugins: [],
}