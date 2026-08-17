"use client";

import { useRef } from "react";
import { FlowerHead } from "@/components/svg/FlowerHead";
import { VineLeft } from "@/components/svg/VineLeft";
import { VineRight } from "@/components/svg/VineRight";
import { shouldPlayNavIntro } from "@/lib/animations/nav-intro";
import { gsap, useGSAP } from "@/lib/gsap/register";

export function NavbarFlowerIntro() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const node = root.current;
      if (!node) {
        return;
      }
      const paths = node.querySelectorAll("path, circle");
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const play = shouldPlayNavIntro(window.sessionStorage, reduced);

      paths.forEach((path) => {
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

      const tl = gsap.timeline({ defaults: { ease: "power2.out" } });
      paths.forEach((path, index) => {
        tl.to(path, { strokeDashoffset: 0, duration: 1.6 }, index * 0.22);
      });
    },
    { scope: root },
  );

  return (
    <div
      ref={root}
      className="pointer-events-none absolute inset-x-0 -top-3 z-10 h-24 text-gold md:-top-4 md:h-28"
      aria-hidden="true"
    >
      <VineLeft className="absolute top-0 left-0 h-full w-[42%]" />
      <FlowerHead className="absolute top-1 left-1/2 h-10 w-10 -translate-x-1/2 md:h-12 md:w-12" />
      <VineRight className="absolute top-0 right-0 h-full w-[42%]" />
    </div>
  );
}
