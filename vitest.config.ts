import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["directus/**/*.test.ts"],
  },
});
