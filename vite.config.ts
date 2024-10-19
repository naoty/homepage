import { reactRouter } from "@react-router/dev/vite";
import { glob } from "glob";
import hljs from "highlight.js";
import { dirname } from "path";
import { defineConfig } from "vite";
import { Mode, plugin as mdPlugin } from "vite-plugin-markdown";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    reactRouter({
      async prerender() {
        const postFilePaths = await glob("./contents/posts/**/post.md");
        const postPaths = postFilePaths
          .map((path) => dirname(path).split("/").pop())
          .map((id) => `/posts/${id}`);
        return ["/", "/posts", ...postPaths];
      },
    }),
    tsconfigPaths(),
    mdPlugin({
      mode: [Mode.HTML],
      markdownIt: {
        highlight(str: string, lang: string): string {
          if (lang.length === 0) {
            return "";
          }

          // `lang:filename`となっている場合があるので`filename`を無視する
          lang = lang.split(":")[0];

          try {
            return hljs.highlight(str, { language: lang }).value;
          } catch {
            return "";
          }
        },
      },
    }),
  ],
});
