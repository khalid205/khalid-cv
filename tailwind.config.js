/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // تعيين Cairo كخط أساسي للمشروع
        sans: ['Cairo', 'sans-serif'],
      },
    },
  },
  plugins: [],
}