const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: [
    "./components/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Cabin", ...defaultTheme.fontFamily.sans],
        serif: ["Arvo", ...defaultTheme.fontFamily.serif],
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
