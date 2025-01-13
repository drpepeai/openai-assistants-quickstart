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
    extend: {},
  },
  plugins: [],
}

