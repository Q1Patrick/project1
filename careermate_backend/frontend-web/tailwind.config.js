/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'mys-navy': '#3D4A7E',
        'mys-red': '#C04B59',
      }
    },
  },
  plugins: [],
}