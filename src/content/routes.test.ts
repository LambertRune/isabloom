import { describe, expect, it } from "vitest";
import { portfolioHref, PORTFOLIO_HAS_OWN_PAGE } from "./routes.ts";

describe("portfolio route switch", () => {
  it("sends the homepage portfolio CTA to Aanbod until a dedicated portfolio page exists", () => {
    expect(PORTFOLIO_HAS_OWN_PAGE).toBe(false);
    expect(portfolioHref()).toBe("/aanbod");
  });
});
