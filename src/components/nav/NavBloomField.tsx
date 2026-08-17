"use client";

import { useRef } from "react";
import { BerrySpray } from "@/components/svg/BerrySpray";
import { Bud } from "@/components/svg/Bud";
import { FlowerHead } from "@/components/svg/FlowerHead";
import { Leaf } from "@/components/svg/Leaf";
import { PairLeaves } from "@/components/svg/PairLeaves";
import { Tendril } from "@/components/svg/Tendril";
import { gsap, useGSAP } from "@/lib/gsap/register";
import { prefersReducedMotion, secondsForMotion } from "@/lib/nav/motion.ts";

const MARKS = [
  { Comp: FlowerHead, className: "left-[4%] top-1 h-9 w-9 text-gold", y: 5, rotation: 8 },
  { Comp: Leaf, className: "left-[14%] top-3 h-8 w-5 text-leaf", y: -6, rotation: -10 },
  { Comp: Bud, className: "left-[24%] -top-1 h-8 w-5 text-blush", y: 7, rotation: 12 },
  { Comp: BerrySpray, className: "left-[36%] top-2 h-7 w-9 text-gold", y: -5, rotation: -6 },
  { Comp: Tendril, className: "left-[48%] top-0 h-10 w-6 text-berry", y: 6, rotation: 14 },
  { Comp: PairLeaves, className: "left-[58%] top-2 h-8 w-10 text-leaf", y: -4, rotation: -8 },
  { Comp: FlowerHead, className: "left-[70%] top-1 h-8 w-8 text-blush", y: 5, rotation: 9 },
  { Comp: Leaf, className: "left-[80%] top-3 h-7 w-5 text-gold", y: -7, rotation: -12 },
  { Comp: Bud, className: "left-[90%] top-0 h-8 w-5 text-berry", y: 6, rotation: 10 },
] as const;

export function NavBloomField() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const marks = root.current?.querySelectorAll("[data-bloom]");
      if (!marks?.length) {
        return;
      }
      const reduced = prefersReducedMotion();
      if (reduced) {
        gsap.set(marks, { autoAlpha: 0.28 });
        return;
      }
      marks.forEach((mark, index) => {
        const spec = MARKS[index];
        gsap.to(mark, {
          y: spec?.y ?? 4,
          rotation: spec?.rotation ?? 8,
          duration: secondsForMotion(4200 + index * 180, false),
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
          overwrite: true,
        });
      });
    },
    { scope: root },
  );

  return (
    <div ref={root} className="absolute inset-0 opacity-40" aria-hidden="true">
      {MARKS.map((mark, index) => {
        const Icon = mark.Comp;
        return (
          <span
            key={`${mark.className}-${index}`}
            data-bloom=""
            className={`absolute will-change-transform ${mark.className}`}
          >
            <Icon className="h-full w-full" />
          </span>
        );
      })}
    </div>
  );
}
