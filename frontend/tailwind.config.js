/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [require("@tailwindcss/forms")],
  safelist: [
    // For Alert.jsx
    {
      pattern: /bg-(green|blue|yellow|red)-50/,
    },
    {
      pattern: /bg-(green|red|gray|indigo)-\d{3}/,
      variants: ["hover"],
    },
    {
      pattern: /bg-(green|red)-600/,
      variants: ["hover"],
    },
    {
      pattern: /text-(green|blue|yellow|red)-800/,
    },
    {
      pattern: /text-(green|blue|yellow|red)-700/,
    },
    {
      pattern: /bg-(green|blue|yellow|red)-100/,
      variants: ["hover"],
    },
    {
      pattern: /ring-(green|blue|yellow|red)-600/,
      variants: ["focus"],
    },

    {
      pattern: /ring-offset-(green|blue|yellow|red)-50/,
      variants: ["focus"],
    },
  ],
};
