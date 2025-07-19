/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        github: {
          dark: "#0d1117",
          darker: "#010409",
          border: "#30363d",
          text: "#c9d1d9",
          secondary: "#8b949e",
          accent: "#58a6ff",
          success: "#2ea043",
          warning: "#f85149",
          bg: {
            secondary: "#161b22",
            tertiary: "#21262d",
          },
        },
      },
    },
  },
  plugins: [],
};
