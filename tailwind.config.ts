import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.tsx"],
  theme: {
    extend: {
      borderWidth: {
        3: "3px",
      },
      backgroundColor: {
        main: "#f0f0f0",
        link: "#03c",
      },
      borderColor: {
        main: "#aaa",
        content: "#aaa",
      },
      textColor: {
        link: "#03c",
        sub: "#888",
      },
      fontFamily: {
        sans: ["Verdana", "Meiryo", "sans-serif"],
        mono: ["Menlo", "Consolas", "monospace"],
      },
    },
  },
} satisfies Config;
