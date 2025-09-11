/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Diz ao Tailwind para analisar os seus ficheiros React
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}