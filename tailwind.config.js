/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/admin/*.{js,ts,jsx,tsx,mdx}",
    "./app/examples/*.{js,ts,jsx,tsx,mdx}",
    "./app/login/*.{js,ts,jsx,tsx,mdx}",
    "./app/page.tsx",
    "./app/layout.tsx",
    "./app/globals.css",
    "./app/components/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      animation: {
        'pulse-text': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      fontFamily: {
        roboto: ['var(--font-roboto)'],
        courierPrime: ['var(--font-courier-prime)'],
        primary: [
          'ui-sans-serif',
          '-apple-system',
          'system-ui',
          'Segoe UI',
          'Helvetica',
          'Apple Color Emoji',
          'Arial',
          'sans-serif',
          'Segoe UI Emoji',
          'Segoe UI Symbol',
        ],
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}

