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
        },
      },
      fontFamily: {
        sans: ["Lucida Grande", "Bitstream Vera Sans", "Verdana", "Meiryo"],
      },
    },
  },
} satisfies Config;
