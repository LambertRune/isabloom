export const PORTFOLIO_HAS_OWN_PAGE = false;

export function portfolioHref(): string {
  return PORTFOLIO_HAS_OWN_PAGE ? "/portfolio" : "/aanbod";
}
