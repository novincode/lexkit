import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  dts: true,
  clean: true,
  minify: true,
  sourcemap: false, // Disable source maps for production bundle
  external: ["react", "react-dom"],
  splitting: false,
  treeshake: true,
  target: "es2020",
});
