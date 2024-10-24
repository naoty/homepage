import rehypeStringify from "rehype-stringify";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
import type { Plugin } from "vite";

const processor = unified()
  .use(remarkParse)
  .use(remarkRehype)
  .use(rehypeStringify);

export function markdown(): Plugin {
  return {
    name: "vite-plugin-markdown",
    async transform(code, id) {
      if (id.endsWith(".md")) {
        const lines = [];
        const processed = await processor.process(code);
        lines.push(`const html = ${JSON.stringify(processed.toString())}`);

        const attributes = {
          title: "",
          time: "",
          tags: [],
        };
        lines.push(`const attributes = ${JSON.stringify(attributes)}`);
        lines.push(`export { html, attributes }`);

        return { code: lines.join("\n") };
      }
      return { code, map: null };
    },
  };
}
