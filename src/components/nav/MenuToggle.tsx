"use client";

import { useRef } from "react";
import {
  NAV_CLOSE_MS,
  NAV_OPEN_MS,
  prefersReducedMotion,
  secondsForMotion,
} from "@/lib/nav/motion.ts";
import { gsap, useGSAP } from "@/lib/gsap/register";
import { NAV_FOCUS } from "./classes.ts";

type MenuToggleProps = {
  open: boolean;
  onClick: () => void;
};

export function MenuToggle({ open, onClick }: MenuToggleProps) {
  const root = useRef<HTMLButtonElement>(null);

  useGSAP(
    () => {
      const node = root.current;
      if (!node) {
        return;
      }
      const top = node.querySelector('[data-line="top"]');
      const mid = node.querySelector('[data-line="mid"]');
      const bot = node.querySelector('[data-line="bot"]');
      if (!top || !mid || !bot) {
        return;
      }
      const reduced = prefersReducedMotion();
      const duration = secondsForMotion(open ? NAV_OPEN_MS : NAV_CLOSE_MS, reduced);
      gsap.to(top, {
        y: open ? 6 : 0,
        rotation: open ? 45 : 0,
        transformOrigin: "50% 50%",
        duration,
        ease: "power2.out",
        overwrite: true,
      });
      gsap.to(mid, {
        autoAlpha: open ? 0 : 1,
        duration,
        ease: "power2.out",
        overwrite: true,
      });
      gsap.to(bot, {
        y: open ? -6 : 0,
        rotation: open ? -45 : 0,
        transformOrigin: "50% 50%",
        duration,
        ease: "power2.out",
        overwrite: true,
      });
    },
    { scope: root, dependencies: [open] },
  );

  return (
    <button
      ref={root}
      type="button"
      className={`flex size-11 items-center justify-center text-gold ${NAV_FOCUS}`}
      aria-expanded={open}
      aria-controls="mobile-nav"
      aria-label={open ? "Menu sluiten" : "Menu openen"}
      onClick={onClick}
    >
      <svg viewBox="0 0 24 24" fill="none" className="size-7" aria-hidden="true">
        <g data-line="top">
          <path
            d="M4 7.5 C 8 6, 16 6, 20 7.5"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
          />
        </g>
        <g data-line="mid">
          <path
            d="M5 12 C 9 11.2, 15 12.8, 19 12"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
          />
        </g>
        <g data-line="bot">
          <path
            d="M4 16.5 C 8 18, 16 18, 20 16.5"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
          />
        </g>
      </svg>
    </button>
  );
}
