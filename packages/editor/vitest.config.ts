import { defineConfig } from "vitest/config";
import { resolve } from "node:path";

export default defineConfig({
  resolve: {
    alias: {
      // Mirror the tsconfig path "@lexkit/editor/*" -> "./src/*" so tests can
      // import the source the same way the source imports itself.
      "@lexkit/editor": resolve(__dirname, "src"),
    },
  },
  test: {
    // jsdom gives us document/DOMParser for the HTML import/export round-trips.
    environment: "jsdom",
    include: ["src/**/*.{test,spec}.{ts,tsx}"],
  },
});
