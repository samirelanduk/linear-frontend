/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontSize: {
        "2xs": [".625rem", {
          lineHeight: "1rem",
        }],
      },
      borderWidth: {
        3: "3px",
      },
      spacing: {
        112: "28rem",
        128: "32rem",
        144: "36rem",
      },
    },
  },
  plugins: [],
}

