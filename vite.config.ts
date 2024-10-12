import { reactRouter } from "@react-router/dev/vite";
import { globSync } from "fs";
import { dirname } from "path";
import { defineConfig } from "vite";
import { Mode, plugin as mdPlugin } from "vite-plugin-markdown";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    reactRouter({
      async prerender() {
        const postPaths = globSync("./contents/posts/**/post.md")
          .map((path) => dirname(path).split("/").pop())
          .map((id) => `/posts/${id}`);
        return ["/", "/posts", ...postPaths];
      },
    }),
    tsconfigPaths(),
    mdPlugin({ mode: [Mode.HTML] }),
  ],
});
