export function isActiveNav(href: string, pathname: string): boolean {
  if (href.includes("#")) {
    return false;
  }
  if (href === "/") {
    return pathname === "/";
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}
