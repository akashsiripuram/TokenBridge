/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./**/*.{js,ts,jsx,tsx}", // ← this catches everything recursively
  ],
  theme: {
    extend: {
      colors: {
        gray: {
          50: "rgba(255, 255, 255, 0.5)",
          100: "#eeeeef",
          200: "#e6e9ed",
          600: "#95989c",
        },
        blue: {
          500: "#ff0000", // red
          600: "#00ff00", // green
        },
      },
    },
  },
  plugins: [],
};
