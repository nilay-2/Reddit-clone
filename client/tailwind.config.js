/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      backgroundColor: {
        reddit: "#28282B",
        redditPost: "#1A1A1B",
      },
    },
  },
  plugins: [],
};
