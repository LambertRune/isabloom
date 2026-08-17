"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { aanbodNavItems } from "@/content/aanbod-nav.ts";
import { BerrySpray } from "@/components/svg/BerrySpray";
import { Bud } from "@/components/svg/Bud";
import { Leaf } from "@/components/svg/Leaf";
import { Tendril } from "@/components/svg/Tendril";
import { VineLeft } from "@/components/svg/VineLeft";
import { VineRight } from "@/components/svg/VineRight";
import type { OfferCategory } from "@/lib/aanbod/categories.ts";
import {
  NAV_CLOSE_MS,
  NAV_OPEN_MS,
  NAV_STAGGER_MS,
  prefersReducedMotion,
  secondsForMotion,
} from "@/lib/nav/motion.ts";
import { gsap, useGSAP } from "@/lib/gsap/register";
import { NAV_FOCUS, NAV_LINK } from "./classes.ts";

const ICONS: Record<OfferCategory, typeof Leaf> = {
  shop: Leaf,
  christmas_rental: BerrySpray,
  flower_rental: Bud,
};

type NavLink = {
  href: string;
  label: string;
};

type MobileMenuProps = {
  open: boolean;
  left: readonly NavLink[];
  right: readonly NavLink[];
  aanbodLabel: string;
  contactLabel: string;
  onClose: () => void;
};

export function MobileMenu({
  open,
  left,
  right,
  aanbodLabel,
  contactLabel,
  onClose,
}: MobileMenuProps) {
  const items = aanbodNavItems();
  const panel = useRef<HTMLDivElement>(null);
  const list = useRef<HTMLDivElement>(null);
  const openedOnce = useRef(false);
  const accordionOpened = useRef(false);
  const [aanbodOpen, setAanbodOpen] = useState(false);

  useGSAP(
    () => {
      if (!panel.current) {
        return;
      }
      const reduced = prefersReducedMotion();
      const rows = list.current?.querySelectorAll("[data-nav-row]");
      if (open) {
        openedOnce.current = true;
        const tl = gsap.timeline({
          defaults: { ease: "power2.out", overwrite: true },
        });
        tl.to(panel.current, {
          autoAlpha: 1,
          y: 0,
          duration: secondsForMotion(NAV_OPEN_MS, reduced),
        }).fromTo(
          rows ?? [],
          { autoAlpha: 0, y: -8 },
          {
            autoAlpha: 1,
            y: 0,
            duration: secondsForMotion(180, reduced),
            stagger: secondsForMotion(NAV_STAGGER_MS, reduced),
            overwrite: true,
          },
          reduced ? 0 : 0.04,
        );
        return () => {
          tl.kill();
        };
      }
      if (!openedOnce.current) {
        gsap.set(panel.current, {
          autoAlpha: 0,
          y: -12,
          transformOrigin: "50% 0%",
        });
        return;
      }
      const tl = gsap.timeline({
        defaults: { ease: "power2.in", overwrite: true },
      });
      tl.to(panel.current, {
        autoAlpha: 0,
        y: -10,
        duration: secondsForMotion(NAV_CLOSE_MS, reduced),
      });
      return () => {
        tl.kill();
      };
    },
    { scope: panel, dependencies: [open] },
  );

  useGSAP(
    () => {
      const tendril = list.current?.querySelector("[data-aanbod-tendril]");
      const extra = list.current?.querySelector<HTMLElement>("[data-aanbod-panel]");
      if (!tendril || !extra) {
        return;
      }
      const reduced = prefersReducedMotion();
      const duration = secondsForMotion(aanbodOpen ? NAV_OPEN_MS : NAV_CLOSE_MS, reduced);
      if (aanbodOpen) {
        accordionOpened.current = true;
        extra.style.display = "flex";
        gsap.to(tendril, {
          rotation: 90,
          transformOrigin: "50% 50%",
          duration,
          ease: "power2.out",
          overwrite: true,
        });
        gsap.fromTo(
          extra,
          { autoAlpha: 0, y: -6 },
          {
            autoAlpha: 1,
            y: 0,
            duration,
            ease: "power2.out",
            overwrite: true,
          },
        );
        return;
      }
      gsap.to(tendril, {
        rotation: 0,
        transformOrigin: "50% 50%",
        duration,
        ease: "power2.out",
        overwrite: true,
      });
      if (!accordionOpened.current) {
        gsap.set(extra, { autoAlpha: 0, y: -6, display: "none" });
        return;
      }
      gsap.to(extra, {
        autoAlpha: 0,
        y: -6,
        duration,
        ease: "power2.out",
        overwrite: true,
        onComplete: () => {
          extra.style.display = "none";
        },
      });
    },
    { scope: list, dependencies: [aanbodOpen] },
  );

  return (
    <div
      ref={panel}
      id="mobile-nav"
      className={`absolute inset-x-0 top-full z-30 origin-top will-change-transform md:hidden ${
        open ? "" : "pointer-events-none"
      }`}
      inert={!open}
      aria-hidden={!open}
    >
      <div className="relative overflow-hidden border-b border-gold/40 bg-paper px-6 pt-4 pb-8">
        <VineLeft className="pointer-events-none absolute top-2 left-0 h-20 w-[46%] text-gold opacity-[0.18]" />
        <VineRight className="pointer-events-none absolute top-2 right-0 h-20 w-[46%] text-gold opacity-[0.18]" />
        <div ref={list} className="relative flex flex-col gap-1">
          {left.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              data-nav-row=""
              className={`py-2 ${NAV_LINK}`}
              onClick={onClose}
            >
              {item.label}
            </Link>
          ))}
          <div data-nav-row="">
            <button
              type="button"
              className={`${NAV_LINK} flex w-full items-center justify-between py-2`}
              aria-expanded={aanbodOpen}
              aria-controls="mobile-aanbod"
              onClick={() => setAanbodOpen((value) => !value)}
            >
              {aanbodLabel}
              <span data-aanbod-tendril="" className="inline-flex">
                <Tendril className="h-5 w-4 text-gold" />
              </span>
            </button>
            <div
              id="mobile-aanbod"
              data-aanbod-panel=""
              className="flex flex-col gap-1 pb-2 pl-1"
              inert={!aanbodOpen}
              aria-hidden={!aanbodOpen}
            >
              {items.map((item) => {
                const Icon = ICONS[item.key];
                return (
                  <Link
                    key={item.key}
                    href={item.href}
                    className={`flex items-start gap-3 py-2 no-underline ${NAV_FOCUS}`}
                    onClick={onClose}
                  >
                    <Icon className="mt-0.5 h-7 w-5 shrink-0 text-gold" />
                    <span className="flex flex-col gap-0.5">
                      <span className="font-serif text-base text-ink">{item.title}</span>
                      {item.text ? (
                        <span className="text-xs font-light leading-snug text-muted">
                          {item.text}
                        </span>
                      ) : null}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
          {right.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              data-nav-row=""
              className={`py-2 ${NAV_LINK}`}
              onClick={onClose}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/#contact"
            data-nav-row=""
            className={`mt-3 inline-flex w-fit bg-moss px-4 py-2 text-sm font-medium tracking-wide text-paper hover:bg-ink ${NAV_FOCUS}`}
            onClick={onClose}
          >
            {contactLabel}
          </Link>
        </div>
      </div>
    </div>
  );
}
