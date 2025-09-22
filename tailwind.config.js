/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['var(--font-poppins)', 'Poppins', 'sans-serif'],
        'poppins': ['Poppins', 'sans-serif'],
      },
      colors: {
        'etpc': {
          'blue': '#1e3a8a',
          'blue-light': '#334155',
          'blue-dark': '#0f172a',
          'gold': '#f59e0b',
          'gold-light': '#fbbf24',
          'gold-dark': '#d97706',
        }
      }
    },
  },
  plugins: [],
}
