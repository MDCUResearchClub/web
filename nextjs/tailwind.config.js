const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  purge: ["./components/**/*.{js,ts,jsx,tsx}", "./pages/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'Cabin',
          ...defaultTheme.fontFamily.sans,
        ],
        serif: [
          'Arvo',
          ...defaultTheme.fontFamily.serif,
        ]
      }
    },
  },
  variants: {},
  plugins: [],
};
