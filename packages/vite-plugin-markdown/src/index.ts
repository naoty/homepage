import type { Plugin } from "vite";

export function markdown(): Plugin {
  return {
    name: "vite-plugin-markdown",
    transform(code, id) {
      if (id.endsWith(".md")) {
        const transformed = `
          const attributes = {
            title: "",
            time: "",
            tags: [],
          };
          const html = "";
          export { attributes, html };
        `;
        return { code: transformed };
      }
      return { code, map: null };
    },
  };
}
