"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap/register";

export function RevealOnScroll({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const node = root.current;
      if (!node) {
        return;
      }
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return;
      }
      gsap.from(node, {
        autoAlpha: 0,
        y: 18,
        duration: 0.9,
        ease: "power2.out",
        scrollTrigger: {
          trigger: node,
          start: "top 86%",
          toggleActions: "play none none reverse",
        },
      });
    },
    { scope: root },
  );

  return (
    <div ref={root} className={className}>
      {children}
    </div>
  );
}
