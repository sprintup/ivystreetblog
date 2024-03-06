module.exports = {
  purge: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        primary: "#0C192E", // Deep blue from the background
        secondary: "#8FBC8F", // Green from the leaves
        accent: "#FFA500", // Orange from the books
        highlight: "#FFD700", // Yellow from the stars/lights
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
