import type { Config } from "@react-router/dev/config";
import { glob } from "glob";
import { dirname } from "path";

export default {
  async prerender() {
    const postFilePaths = await glob("./contents/posts/**/post.md");
    const postPaths = postFilePaths
      .map((path) => dirname(path).split("/").pop())
      .map((id) => `/posts/${id}`);
    return ["/", "/posts", ...postPaths];
  },
} satisfies Config;
