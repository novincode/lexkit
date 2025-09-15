import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm"],
  dts: true,
  clean: true,
  // Keep @lexkit/editor as external - this is a meta package
  external: ["@lexkit/editor"],
  target: "es2020",
});
