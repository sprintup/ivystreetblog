// tailwind.config.js
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        primary: "#0C192E", // Deep blue from the background
        secondary: "#024358", // Mid blue
        tertiary: "#D16014", // Bronze
        accent: "#D4D2D5", // light gray
        // primary: "#0C192E", // Deep blue from the background
        // secondary: "#024358", // Mid blue
        // tertiary: "#D16014", // Bronze
        // accent: "#D4D2D5", // light gray
        orange: "#FFA500", // Orange from the books
        highlight: "#A288A6", // More of a purple color
        yellow: "#FFD700", // Yellow from the stars/lights
      },
      fontFamily: {
        sans: ["Nunito", "sans-serif"], // Set as default sans-serif font
        heading: ["Fredoka One", "cursive"], // Optional: custom class for headings
        accent: ["Amatic SC", "cursive"], // Optional: custom class for accent text
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
