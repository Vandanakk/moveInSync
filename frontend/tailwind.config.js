/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#f0f5fc',
          100: '#e1ecf8',
          200: '#c3daf1',
          300: '#94c0e6',
          400: '#5ea0d7',
          500: '#3883c5',
          600: '#2769a7',
          700: '#215487',
          800: '#1e4770',
          900: '#0f263e',
          950: '#0a1a2c',
        }
      }
    },
  },
  plugins: [],
}
