import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const root = join(dirname(fileURLToPath(import.meta.url)), "../../..");
const svgDir = join(root, "src/components/svg");

describe("botanical SVG library", () => {
  it("has at least eight stroke-only marks in the logo line family", () => {
    const files = readdirSync(svgDir).filter(
      (name) => name.endsWith(".tsx") && !name.endsWith(".test.ts"),
    );
    expect(files.length).toBeGreaterThanOrEqual(8);
    for (const file of files) {
      const source = readFileSync(join(svgDir, file), "utf8");
      expect(source).toContain('fill="none"');
      expect(source).toContain("currentColor");
      expect(source).not.toMatch(/fill="#/);
      expect(source).not.toMatch(/\bInter\b/);
    }
  });
});
