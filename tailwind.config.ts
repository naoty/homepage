import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.tsx"],
  theme: {
    extend: {
      borderWidth: {
        3: "3px",
      },
      colors: {
        rails: {
          background: "#f0f0f0",
          border: {
            main: "#aaa",
            content: "#aaa",
          },
          link: "#03c",
          text: {
            sub: "#888",
          },
        },
      },
      fontFamily: {
        sans: ["Verdana", "Meiryo", "sans-serif"],
        mono: ["Menlo", "Consolas", "monospace"],
      },
    },
  },
} satisfies Config;
