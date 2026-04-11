import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  resolve: {
    alias: {
      "@places": path.resolve(__dirname, "./includes/blocks/map/assets"),
    },
  },
});
