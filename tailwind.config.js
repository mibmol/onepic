const defaultTheme = require('tailwindcss/defaultTheme')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{jsx,tsx}",
  ],
  darkMode: "class",
  safelist: [{ pattern: /text-(xm|sm|base|lg|xl|2xl|4xl|6xl|7xl)/ }],
  theme: {
    fontFamily: {
      sans: ["Inter", ...defaultTheme.fontFamily.sans],
      serif: [...defaultTheme.fontFamily.serif],
      mono: [...defaultTheme.fontFamily.mono]
    },
    extend: {
      spacing: {
        "112": "28rem",
        "128": "32rem",
        "152": "36rem",
        "168": "40rem",
        "184": "44rem"
      },
      boxShadow: {
        "lg": "0 5px 15px 0px rgb(0 0 0 / 0.1)",
      },
      strokeWidth: {
        '3': '3',
      },
      zIndex: {
        '100': '100',
        '150': '150',
        '200': '200',
        'max': '9999',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
