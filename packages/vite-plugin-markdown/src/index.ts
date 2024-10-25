import rehypeHighlight from "rehype-highlight";
import rehypeStringify from "rehype-stringify";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
import type { Node } from "unist";
import type { VFile } from "vfile";
import { matter } from "vfile-matter";
import type { Plugin } from "vite";

const processor = unified()
  .use(remarkParse)
  .use(remarkFrontmatter)
  .use(function () {
    return function (tree: Node, file: VFile) {
      matter(file);
    };
  })
  .use(remarkGfm)
  .use(remarkRehype)
  .use(rehypeHighlight)
  .use(rehypeStringify);

export function markdown(): Plugin {
  return {
    name: "vite-plugin-markdown",
    async transform(code, id) {
      if (!id.endsWith(".md")) {
        return null;
      }

      const lines = [];
      const file = await processor.process(code);
      lines.push(`const html = ${JSON.stringify(file.toString())}`);
      lines.push(`const attributes = ${JSON.stringify(file.data.matter)}`);
      lines.push(`export { html, attributes }`);

      return { code: lines.join("\n") };
    },
  };
}
