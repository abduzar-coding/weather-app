/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#f2fbff',
          100: '#e6f6ff',
          200: '#c9ecff',
          300: '#9fe0ff',
          400: '#5cc8ff',
          500: '#1fb0ff',   // primary light
          600: '#0a8fe0',
          700: '#0a73b3',
          800: '#0a5a8a',
          900: '#0a496f',
        },
        ink: {
          50:  '#f7f7f8',
          100: '#eeeef0',
          200: '#dcdcde',
          300: '#c0c1c4',
          400: '#8b8d92',
          500: '#5e6167',   // body text light
          600: '#464a51',
          700: '#34383f',
          800: '#25272c',   // surfaces dark
          900: '#17181c',   // page dark
        },
      },
      boxShadow: {
        card: '0 8px 24px rgba(0,0,0,0.15)',
        glow: '0 0 0 1px rgba(255,255,255,0.08), 0 8px 30px rgba(16,24,40,0.25)',
      },
      backdropBlur: { xs: '2px' },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.25rem',
      },
    },
  },
  plugins: [],
}
