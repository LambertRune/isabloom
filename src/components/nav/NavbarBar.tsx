"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { NavbarFlowerIntro } from "@/components/animations/NavbarFlowerIntro";
import {
  NAV_DESKTOP_MQ,
  NAV_SCROLL_PX,
  prefersReducedMotion,
  secondsForMotion,
} from "@/lib/nav/motion.ts";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap/register";
import { AanbodDropdown } from "./AanbodDropdown";
import { NAV_FOCUS, NAV_LINK } from "./classes";
import { MenuToggle } from "./MenuToggle";
import { MobileMenu } from "./MobileMenu";

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
      className={`bg-moss px-4 py-2 text-sm font-medium tracking-wide text-paper hover:bg-ink ${NAV_FOCUS}`}
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
  const wash = useRef<HTMLDivElement>(null);
  const edge = useRef<HTMLDivElement>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useGSAP(
    () => {
      if (!wash.current || !edge.current) {
        return;
      }
      gsap.set(wash.current, { autoAlpha: 0.72 });
      gsap.set(edge.current, { autoAlpha: 0.3 });
      ScrollTrigger.create({
        start: NAV_SCROLL_PX,
        onToggle: (self) => {
          const reduced = prefersReducedMotion();
          const duration = secondsForMotion(280, reduced);
          gsap.to(wash.current, {
            autoAlpha: self.isActive ? 1 : 0.72,
            duration,
            ease: "power2.out",
            overwrite: true,
          });
          gsap.to(edge.current, {
            autoAlpha: self.isActive ? 0.95 : 0.3,
            duration,
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
    <header ref={header} className="sticky top-0 z-20">
      <div ref={wash} className="pointer-events-none absolute inset-0 bg-paper" />
      <div
        ref={edge}
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gold/55"
      />
      <div className="relative mx-auto max-w-6xl px-6 pt-6 pb-4 md:pt-8">
        <NavbarFlowerIntro />
        <nav className="relative z-20" aria-label="Hoofdnavigatie">
          <div className="grid grid-cols-3 items-center md:hidden">
            <div className="justify-self-start">
              <MenuToggle
                open={mobileOpen}
                onClick={() => setMobileOpen((value) => !value)}
              />
            </div>
            <div className="justify-self-center" onClick={() => setMobileOpen(false)}>
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
            <ul className="flex flex-wrap items-center justify-start gap-x-6 gap-y-2">
              {left.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={NAV_LINK}>
                    {item.label}
                  </Link>
                </li>
              ))}
              <AanbodDropdown label={aanbodLabel} />
            </ul>
            <div className="flex justify-center">
              {wordmark}
            </div>
            <div className="flex flex-wrap items-center justify-end gap-4">
              {right.map((item) => (
                <Link key={item.href} href={item.href} className={NAV_LINK}>
                  {item.label}
                </Link>
              ))}
              <ContactLink label={contactLabel} />
            </div>
          </div>
        </nav>
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
