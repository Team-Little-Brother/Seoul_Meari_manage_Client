/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'login-background': "url('@/assets/andrei-castanha-G1y3Udzg7P0-unsplash.svg')",
      }
    },
  },
  plugins: [],
}
