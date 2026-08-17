"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { NavbarFlowerIntro } from "@/components/animations/NavbarFlowerIntro";
import { isActiveNav } from "@/lib/nav/active.ts";
import {
  NAV_DESKTOP_MQ,
  NAV_SCROLL_PX,
  prefersReducedMotion,
  secondsForMotion,
} from "@/lib/nav/motion.ts";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap/register";
import { AanbodDropdown } from "./AanbodDropdown";
import { NAV_FOCUS } from "./classes";
import { MenuToggle } from "./MenuToggle";
import { MobileMenu } from "./MobileMenu";
import { NavBloomField } from "./NavBloomField";
import { NavTextLink } from "./NavTextLink";

type NavLink = {
  href: string;
  label: string;
};

type NavbarBarProps = {
  wordmark: ReactNode;
  left: readonly NavLink[];
  right: readonly NavLink[];
  aanbodLabel: string;
  contactLabel: string;
};

function ContactLink({
  label,
  onClick,
}: {
  label: string;
  onClick?: () => void;
}) {
  return (
    <Link
      href="/#contact"
      onClick={onClick}
      className={`rounded-full bg-gold px-4 py-2 text-sm font-medium tracking-wide text-night hover:bg-paper ${NAV_FOCUS}`}
    >
      {label}
    </Link>
  );
}

export function NavbarBar({
  wordmark,
  left,
  right,
  aanbodLabel,
  contactLabel,
}: NavbarBarProps) {
  const header = useRef<HTMLElement>(null);
  const pill = useRef<HTMLDivElement>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname() ?? "/";
  const aanbodActive = isActiveNav("/aanbod", pathname);

  useGSAP(
    () => {
      if (!pill.current) {
        return;
      }
      gsap.set(pill.current, { boxShadow: "0 8px 28px rgba(20, 18, 16, 0.18)" });
      ScrollTrigger.create({
        start: NAV_SCROLL_PX,
        onToggle: (self) => {
          const reduced = prefersReducedMotion();
          gsap.to(pill.current, {
            boxShadow: self.isActive
              ? "0 12px 32px rgba(20, 18, 16, 0.35)"
              : "0 8px 28px rgba(20, 18, 16, 0.18)",
            duration: secondsForMotion(280, reduced),
            ease: "power2.out",
            overwrite: true,
          });
        },
      });
    },
    { scope: header },
  );

  useEffect(() => {
    if (!mobileOpen) {
      return;
    }
    const previousHtml = document.documentElement.style.overflow;
    const previousBody = document.body.style.overflow;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = previousHtml;
      document.body.style.overflow = previousBody;
    };
  }, [mobileOpen]);

  useEffect(() => {
    const media = window.matchMedia(NAV_DESKTOP_MQ);
    const onChange = () => {
      if (media.matches) {
        setMobileOpen(false);
      }
    };
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (!mobileOpen) {
      return;
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setMobileOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileOpen]);

  return (
    <header ref={header} className="sticky top-0 z-30 px-3 pt-3 md:px-4 md:pt-4">
      <div className="relative mx-auto max-w-6xl">
        <div
          ref={pill}
          className="relative rounded-full border border-gold/35 bg-night text-paper"
        >
          <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-full">
            <NavBloomField />
            <NavbarFlowerIntro />
          </div>
          <nav className="relative z-20 px-3 py-2 md:px-5 md:py-2.5" aria-label="Hoofdnavigatie">
            <div className="grid grid-cols-3 items-center md:hidden">
              <div className="justify-self-start">
                <MenuToggle
                  open={mobileOpen}
                  onClick={() => setMobileOpen((value) => !value)}
                />
              </div>
              <div
                className="justify-self-center text-paper"
                onClick={() => setMobileOpen(false)}
              >
                {wordmark}
              </div>
              <div className="justify-self-end">
                <ContactLink
                  label={contactLabel}
                  onClick={() => setMobileOpen(false)}
                />
              </div>
            </div>
            <div className="hidden grid-cols-3 items-center md:grid">
              <ul className="flex flex-wrap items-center justify-start gap-x-5 gap-y-2">
                {left.map((item) => (
                  <li key={item.href}>
                    <NavTextLink href={item.href} label={item.label} />
                  </li>
                ))}
                <AanbodDropdown label={aanbodLabel} active={aanbodActive} />
              </ul>
              <div className="flex justify-center text-paper">{wordmark}</div>
              <div className="flex flex-wrap items-center justify-end gap-4">
                {right.map((item) => (
                  <NavTextLink key={item.href} href={item.href} label={item.label} />
                ))}
                <ContactLink label={contactLabel} />
              </div>
            </div>
          </nav>
        </div>
        <MobileMenu
          open={mobileOpen}
          left={left}
          right={right}
          aanbodLabel={aanbodLabel}
          contactLabel={contactLabel}
          onClose={() => setMobileOpen(false)}
        />
      </div>
    </header>
  );
}
