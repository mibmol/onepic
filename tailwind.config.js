const defaultTheme = require('tailwindcss/defaultTheme')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{jsx,tsx}",
  ],
  theme: {
    fontFamily: {
      sans: ["Inter", ...defaultTheme.fontFamily.sans],
      serif: [...defaultTheme.fontFamily.serif],
      mono: [...defaultTheme.fontFamily.mono]
    },
    extend: {
      spacing: {
        "128": "32rem",
        "152": "36rem",
        "168": "40rem",
        "184": "44rem"
      },
      boxShadow: {
        "lg": "0 5px 15px 0px rgb(0 0 0 / 0.1)",
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
