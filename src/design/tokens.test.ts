import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { FONTS, FORBIDDEN_SURFACE, TOKENS } from "./tokens.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");

function read(relative: string): string {
  return readFileSync(join(root, relative), "utf8");
}

describe("design tokens", () => {
  it("keeps cream paper off pure white", () => {
    expect(TOKENS.paper.toUpperCase()).not.toBe(FORBIDDEN_SURFACE);
    expect(TOKENS.chalk.toUpperCase()).not.toBe(FORBIDDEN_SURFACE);
  });

  it("uses the brief gold range until the logo can be sampled", () => {
    expect(TOKENS.gold).toBe("#A67C3D");
    expect(TOKENS.goldDeep).toBe("#8C6D3F");
  });

  it("uses moss as the CTA accent, not a generic SaaS purple", () => {
    expect(TOKENS.moss).toBe("#1F3D2B");
  });

  it("pairs Fraunces with Source Sans 3", () => {
    expect(FONTS.serif).toBe("Fraunces");
    expect(FONTS.sans).toBe("Source Sans 3");
  });
});

describe("token CSS contract", () => {
  it("publishes every token as a CSS custom property", () => {
    const css = read("src/app/globals.css");
    expect(css).toContain(`--color-paper: ${TOKENS.paper}`);
    expect(css).toContain(`--color-chalk: ${TOKENS.chalk}`);
    expect(css).toContain(`--color-ink: ${TOKENS.ink}`);
    expect(css).toContain(`--color-muted: ${TOKENS.muted}`);
    expect(css).toContain(`--color-gold: ${TOKENS.gold}`);
    expect(css).toContain(`--color-gold-deep: ${TOKENS.goldDeep}`);
    expect(css).toContain(`--color-moss: ${TOKENS.moss}`);
    expect(css).toContain(`--color-line: ${TOKENS.line}`);
  });

  it("does not use pure white as a surface", () => {
    const css = read("src/app/globals.css");
    expect(css.toUpperCase()).not.toContain(FORBIDDEN_SURFACE);
  });

  it("does not default body type to Inter", () => {
    const css = read("src/app/globals.css");
    expect(css).not.toMatch(/--font-sans:\s*["']?Inter/);
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
