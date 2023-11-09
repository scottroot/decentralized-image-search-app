/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      boxShadow: {
        highlight: 'inset 0 0 0 1px rgba(255, 255, 255, 0.1)',
      },
      opacity: {
        '7': '0.07',
        '8': '0.08',
        '9': '0.09',
        '11': '0.11',
        '12': '0.12',
        '14': '0.14',
        '15': '0.15',
        '16': '0.16',
      }
    },
  },
  plugins: [],
}
