import { describe, expect, it } from "vitest";
import { contrastRatio } from "./contrast.ts";
import { FONTS, FORBIDDEN_SURFACE, TOKENS, tokenCssProperties } from "./tokens.ts";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");

function read(relative: string): string {
  return readFileSync(join(root, relative), "utf8");
}

describe("design tokens", () => {
  it("keeps cream paper off pure white", () => {
    expect(TOKENS.paper.toUpperCase()).not.toBe(FORBIDDEN_SURFACE);
    expect(TOKENS.chalk.toUpperCase()).not.toBe(FORBIDDEN_SURFACE);
  });

  it("uses a darker goldDeep so 14px links pass WCAG AA on paper", () => {
    expect(TOKENS.gold).toBe("#A67C3D");
    expect(TOKENS.goldDeep).toBe("#7C6136");
    expect(contrastRatio(TOKENS.ink, TOKENS.paper)).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(TOKENS.moss, TOKENS.paper)).toBeGreaterThanOrEqual(4.5);
    expect(contrastRatio(TOKENS.goldDeep, TOKENS.paper)).toBeGreaterThanOrEqual(4.5);
  });

  it("uses moss as the CTA accent, not a generic SaaS purple", () => {
    expect(TOKENS.moss).toBe("#1F3D2B");
  });

  it("adds a warm night surface and floral accents", () => {
    expect(TOKENS.night).toBe("#141210");
    expect(TOKENS.blush).toMatch(/^#[0-9A-F]{6}$/i);
    expect(TOKENS.berry).toMatch(/^#[0-9A-F]{6}$/i);
    expect(TOKENS.leaf).toMatch(/^#[0-9A-F]{6}$/i);
    expect(contrastRatio(TOKENS.paper, TOKENS.night)).toBeGreaterThanOrEqual(10);
  });

  it("pairs Fraunces with Source Sans 3", () => {
    expect(FONTS.serif).toBe("Fraunces");
    expect(FONTS.sans).toBe("Source Sans 3");
  });
});

describe("token CSS contract", () => {
  it("publishes tokens from TypeScript onto CSS variables, not a second hex palette", () => {
    const css = read("src/app/globals.css");
    const layout = read("src/app/layout.tsx");
    const properties = tokenCssProperties();

    expect(layout).toContain("tokenCssProperties");
    expect(properties["--token-paper"]).toBe(TOKENS.paper);
    expect(properties["--token-gold-deep"]).toBe(TOKENS.goldDeep);
    expect(properties["--token-night"]).toBe(TOKENS.night);
    expect(css).toContain("--color-paper: var(--token-paper)");
    expect(css).toContain("--color-gold-deep: var(--token-gold-deep)");
    expect(css).toContain("--color-night: var(--token-night)");
    expect(css).not.toContain(`--color-paper: ${TOKENS.paper}`);
  });

  it("does not use pure white as a surface", () => {
    const css = read("src/app/globals.css");
    expect(css.toUpperCase()).not.toContain(FORBIDDEN_SURFACE);
  });

  it("does not default body type to Inter", () => {
    const css = read("src/app/globals.css");
    expect(css).not.toMatch(/--font-sans:\s*["']?Inter/);
  });

  it("gives keyboard focus and color transitions to interactive elements", () => {
    const css = read("src/app/globals.css");
    expect(css).toContain(":focus-visible");
    expect(css).toContain("transition");
    expect(css).toContain("prefers-reduced-motion");
  });
});

describe("root layout contract", () => {
  it("sets Dutch as the document language", () => {
    const layout = read("src/app/layout.tsx");
    expect(layout).toContain('lang="nl"');
  });

  it("loads Fraunces and Source Sans 3 via next/font", () => {
    const layout = read("src/app/layout.tsx");
    expect(layout).toContain("Fraunces");
    expect(layout).toContain("Source_Sans_3");
  });
});
