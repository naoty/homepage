import eslint from "@eslint/js";
import prettier from "eslint-config-prettier";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: [".react-router", "**/build", "**/dist"],
  },
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    extends: [eslint.configs.recommended],
  },
  {
    files: ["**/*.{ts,tsx}"],
    extends: [tseslint.configs.recommended],
  },
  prettier,
);
