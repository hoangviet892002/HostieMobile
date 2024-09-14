/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./screens/**/*.{js,jsx,ts,tsx}", // Include all JS, JSX, TS, and TSX files in the screens folder
    "./app/**/*.{js,jsx,ts,tsx}", // Include all JS, JSX, TS, and TSX files in the app folder
    "./components/**/*.{js,jsx,ts,tsx}", // Include all JS, JSX, TS, and TSX files in the components folder]
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
