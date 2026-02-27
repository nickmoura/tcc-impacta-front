/** @type {import('tailwindcss').Config} */
export default {
  content: [
  "./index.html",
  "./src/**/*.{js,ts,jsx,tsx}",
],
  theme: {
    extend: {
       colors: {
        primary: "#1D4ED8",
        "primary-dark": "#1E3A8A",
        "primary-light": "#3872be",

        background: "#F7F9FC",
        surface: "#FFFFFF",
        "surface-soft": "#F1F5F9",
        border: "#E2E8F0",

        secondary: "#0EA5E9",
        accent: "#cddfff",
        muted: "#475569",
      },
    },
  },
  plugins: [],
} 

