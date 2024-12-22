import { reactRouter } from "@react-router/dev/vite";

import { defineConfig } from "vite";
import { markdown } from "vite-plugin-markdown";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [reactRouter(), tsconfigPaths(), markdown()],
});
