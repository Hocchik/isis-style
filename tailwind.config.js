/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'isis-green': '#00FF00', // El verde de tu logo
      },
    },
  },
  plugins: [],
}