"use client";

import { useRef } from "react";
import { FlowerHead } from "@/components/svg/FlowerHead";
import { VineLeft } from "@/components/svg/VineLeft";
import { VineRight } from "@/components/svg/VineRight";
import { shouldPlayNavIntro } from "@/lib/animations/nav-intro";
import { gsap, useGSAP } from "@/lib/gsap/register";

const RANKS = ["left", "flower", "right"] as const;

export function NavbarFlowerIntro() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const node = root.current;
      if (!node) {
        return;
      }
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const play = shouldPlayNavIntro(window.sessionStorage, reduced);
      const allMarks = node.querySelectorAll("path, circle");

      allMarks.forEach((path) => {
        if (!(path instanceof SVGGeometryElement)) {
          return;
        }
        const length = path.getTotalLength();
        path.style.strokeDasharray = `${length}`;
        path.style.strokeDashoffset = play ? `${length}` : "0";
      });

      if (!play) {
        return;
      }

      const tl = gsap.timeline({ defaults: { ease: "power2.out", duration: 1.8 } });
      RANKS.forEach((rank) => {
        const marks = node.querySelectorAll(
          `[data-rank="${rank}"] path, [data-rank="${rank}"] circle`,
        );
        tl.to(marks, { strokeDashoffset: 0, stagger: 0.18 });
      });
    },
    { scope: root },
  );

  return (
    <div
      ref={root}
      className="pointer-events-none absolute inset-0 z-10 text-gold opacity-80"
      aria-hidden="true"
    >
      <div data-rank="left" className="absolute top-0 left-0 h-full w-[42%]">
        <VineLeft className="h-full w-full" />
      </div>
      <div
        data-rank="flower"
        className="absolute top-1 left-1/2 h-10 w-10 -translate-x-1/2 md:h-12 md:w-12"
      >
        <FlowerHead className="h-full w-full" />
      </div>
      <div data-rank="right" className="absolute top-0 right-0 h-full w-[42%]">
        <VineRight className="h-full w-full" />
      </div>
    </div>
  );
}
