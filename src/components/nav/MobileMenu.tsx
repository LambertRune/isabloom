"use client";

import Link from "next/link";
import { useId, useRef, useState } from "react";
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
import { NavTextLink } from "./NavTextLink";

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
  const warpId = `nav-warp-${useId().replace(/:/g, "")}`;

  useGSAP(
    () => {
      if (!panel.current) {
        return;
      }
      const reduced = prefersReducedMotion();
      const rows = list.current?.querySelectorAll("[data-nav-row]");
      if (open) {
        openedOnce.current = true;
        const warp = panel.current.querySelector("[data-warp]");
        const tl = gsap.timeline({
          defaults: { ease: "power2.out", overwrite: true },
        });
        if (warp) {
          gsap.fromTo(
            warp,
            { attr: { scale: reduced ? 0 : 26 } },
            {
              attr: { scale: 0 },
              duration: secondsForMotion(480, reduced),
              ease: "power2.out",
              overwrite: true,
            },
          );
        }
        tl.fromTo(
          panel.current,
          { autoAlpha: 0, y: -14, scaleY: reduced ? 1 : 0.88 },
          {
            autoAlpha: 1,
            y: 0,
            scaleY: 1,
            duration: secondsForMotion(NAV_OPEN_MS, reduced),
          },
        ).fromTo(
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
      className={`absolute inset-x-0 top-full z-30 origin-top pt-3 will-change-transform md:hidden ${
        open ? "" : "pointer-events-none"
      }`}
      inert={!open}
      aria-hidden={!open}
    >
      <svg className="absolute h-0 w-0" aria-hidden="true">
        <filter id={warpId}>
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.03"
            numOctaves="2"
            seed="2"
            result="noise"
          />
          <feDisplacementMap
            data-warp=""
            in="SourceGraphic"
            in2="noise"
            scale="0"
          />
        </filter>
      </svg>
      <div
        className="relative overflow-hidden rounded-[2rem] border border-gold/40 bg-night px-6 pt-5 pb-8 text-paper"
        style={{ filter: `url(#${warpId})` }}
      >
        <VineLeft className="pointer-events-none absolute top-2 left-0 h-20 w-[46%] text-gold opacity-25" />
        <VineRight className="pointer-events-none absolute top-2 right-0 h-20 w-[46%] text-blush opacity-25" />
        <div ref={list} className="relative flex flex-col gap-1">
          {left.map((item) => (
            <div key={item.href} data-nav-row="">
              <NavTextLink
                href={item.href}
                label={item.label}
                className="py-2"
                onClick={onClose}
              />
            </div>
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
                      <span className="font-serif text-base text-paper">{item.title}</span>
                      {item.text ? (
                        <span className="text-xs font-light leading-snug text-paper/70">
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
            <div key={item.href} data-nav-row="">
              <NavTextLink
                href={item.href}
                label={item.label}
                className="py-2"
                onClick={onClose}
              />
            </div>
          ))}
          <Link
            href="/#contact"
            data-nav-row=""
            className={`mt-3 inline-flex w-fit rounded-full bg-gold px-4 py-2 text-sm font-medium tracking-wide text-night hover:bg-paper ${NAV_FOCUS}`}
            onClick={onClose}
          >
            {contactLabel}
          </Link>
        </div>
      </div>
    </div>
  );
}
