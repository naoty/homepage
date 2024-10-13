import { reactRouter } from "@react-router/dev/vite";
import { glob } from "glob";
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
    mdPlugin({ mode: [Mode.HTML] }),
  ],
});
