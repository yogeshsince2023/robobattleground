/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        forge: '#080808',
        steel: '#111111',
        plate: '#1A1A1A',
        fire: '#FF4500',
        spark: '#FFB800',
        ash: '#9A9A9A',
      },
      fontFamily: {
        display: ['Bebas Neue', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
