"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { isActiveNav } from "@/lib/nav/active.ts";
import { NAV_LINK, NAV_LINK_ACTIVE } from "./classes.ts";

type NavTextLinkProps = {
  href: string;
  label: string;
  onClick?: () => void;
  className?: string;
};

export function NavTextLink({ href, label, onClick, className = "" }: NavTextLinkProps) {
  const pathname = usePathname() ?? "/";
  const active = isActiveNav(href, pathname);
  return (
    <Link
      href={href}
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={`${active ? NAV_LINK_ACTIVE : NAV_LINK} ${className}`.trim()}
    >
      {label}
    </Link>
  );
}
