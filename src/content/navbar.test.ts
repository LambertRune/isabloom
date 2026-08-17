import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");

function read(relative: string): string {
  return readFileSync(join(root, relative), "utf8");
}

describe("navbar dropdown contract", () => {
  it("wires Aanbod as an accessible menu trigger, not a select", () => {
    const dropdown = read("src/components/nav/AanbodDropdown.tsx");
    expect(dropdown).toContain('aria-haspopup="true"');
    expect(dropdown).toContain("aria-expanded");
    expect(dropdown).toContain('role="menu"');
    expect(dropdown).toContain('role="menuitem"');
    expect(dropdown).not.toContain("<select");
    expect(dropdown).toContain("aanbodNavItems");
  });

  it("keeps dropdown and mobile panels out of document flow", () => {
    const dropdown = read("src/components/nav/AanbodDropdown.tsx");
    const mobile = read("src/components/nav/MobileMenu.tsx");
    expect(dropdown).toContain("absolute");
    expect(mobile).toContain("absolute");
    expect(dropdown).not.toMatch(/gsap\.(to|from|fromTo)\([^)]*(width|height|top|left)/);
    expect(mobile).not.toMatch(/gsap\.(to|from|fromTo)\([^)]*(width|height|top|left)/);
  });

  it("uses useGSAP with overwrite or kill so rapid open/close cannot queue", () => {
    const dropdown = read("src/components/nav/AanbodDropdown.tsx");
    const mobile = read("src/components/nav/MobileMenu.tsx");
    const bar = read("src/components/nav/NavbarBar.tsx");
    for (const source of [dropdown, mobile, bar]) {
      expect(source).toContain("useGSAP");
      expect(source).toMatch(/overwrite:\s*(true|"auto")|\.kill\(/);
    }
  });

  it("respects reduced motion for dropdown, mobile menu, toggle and scroll wash", () => {
    const dropdown = read("src/components/nav/AanbodDropdown.tsx");
    const mobile = read("src/components/nav/MobileMenu.tsx");
    const toggle = read("src/components/nav/MenuToggle.tsx");
    const bar = read("src/components/nav/NavbarBar.tsx");
    for (const source of [dropdown, mobile, toggle, bar]) {
      expect(source).toMatch(/prefers-reduced-motion|secondsForMotion/);
    }
  });

  it("locks body scroll while the mobile menu is open and closes on Escape", () => {
    const mobile = read("src/components/nav/MobileMenu.tsx");
    const bar = read("src/components/nav/NavbarBar.tsx");
    expect(`${mobile}\n${bar}`).toMatch(/overflow/);
    expect(`${mobile}\n${bar}`).toContain("Escape");
  });

  it("does not hide the navbar on scroll down", () => {
    const bar = read("src/components/nav/NavbarBar.tsx");
    expect(bar).not.toMatch(/hide-on-scroll|translateY\(-100|scrollDirection/);
  });

  it("aligns CMS offer mapping in load-content with the shared slug helper", () => {
    const loader = read("src/lib/directus/load-content.ts");
    expect(loader).toContain("offerCategorySlug");
    expect(loader).not.toContain('item.category === "shop"');
  });

  it("is a black gold pill with an animated bloom field and active route state", () => {
    const bar = read("src/components/nav/NavbarBar.tsx");
    const bloom = read("src/components/nav/NavBloomField.tsx");
    const link = read("src/components/nav/NavTextLink.tsx");
    expect(bar).toContain("rounded-full");
    expect(bar).toContain("bg-night");
    expect(bar).toContain("NavBloomField");
    expect(link).toContain("aria-current");
    expect(bloom).toContain("useGSAP");
    expect(bloom).toContain("FlowerHead");
  });

  it("warps the mobile menu open instead of using a flat overlay", () => {
    const mobile = read("src/components/nav/MobileMenu.tsx");
    const toggle = read("src/components/nav/MenuToggle.tsx");
    expect(mobile).toContain("feDisplacementMap");
    expect(toggle).toContain("elastic");
  });
});
