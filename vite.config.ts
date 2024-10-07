import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vite";
import { Mode, plugin as mdPlugin } from "vite-plugin-markdown";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [reactRouter(), tsconfigPaths(), mdPlugin({ mode: [Mode.HTML] })],
});
