/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#111716",
        panel: "#18211f",
        panelSoft: "#22302d",
        aegean: "#2ea6a0",
        olive: "#9fb27b",
        sand: "#e7c982",
        marble: "#f4efe2",
      },
      boxShadow: {
        warm: "0 24px 80px rgba(0, 0, 0, 0.34)",
      },
    },
  },
  plugins: [],
}
