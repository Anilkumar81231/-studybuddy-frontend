/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          500: '#7c5cff',
          600: '#6b46ff',
          700: '#5a3aff'
        }
      }
    }
  },
  plugins: []
}
