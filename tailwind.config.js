/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        blueAccent: {
          DEFAULT: "#293EFF",
        },
        purpleAccent: {
          DEFAULT: "#9FA9FF",
        },
        gBlack: {
          600: "#6F6C72",
          800: "#1E1F20",
          900: "#000000",
        },
        gWhite: {
          100: "#ffffff",
          200: "#E4E3E3",
          400: "#A7A7A7",
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
