import { describe, expect, it } from "vitest";
import { portfolioHref, PORTFOLIO_HAS_OWN_PAGE } from "./routes.ts";

describe("portfolio route switch", () => {
  it("keeps the preview CTA on the homepage until a dedicated page exists", () => {
    expect(PORTFOLIO_HAS_OWN_PAGE).toBe(false);
    expect(portfolioHref()).toBe("/#portfolio");
  });
});
