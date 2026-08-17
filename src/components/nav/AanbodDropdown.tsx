"use client";

import Link from "next/link";
import {
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { aanbodNavItems } from "@/content/aanbod-nav.ts";
import { BerrySpray } from "@/components/svg/BerrySpray";
import { Bud } from "@/components/svg/Bud";
import { Leaf } from "@/components/svg/Leaf";
import { Tendril } from "@/components/svg/Tendril";
import {
  NAV_CLOSE_MS,
  NAV_HOVER_CLOSE_MS,
  NAV_HOVER_OPEN_MS,
  NAV_OPEN_MS,
  NAV_STAGGER_MS,
  prefersReducedMotion,
  secondsForMotion,
} from "@/lib/nav/motion.ts";
import { gsap, useGSAP } from "@/lib/gsap/register";
import type { OfferCategory } from "@/lib/aanbod/categories.ts";
import { NAV_FOCUS, NAV_LINK } from "./classes.ts";

const ICONS: Record<OfferCategory, typeof Leaf> = {
  shop: Leaf,
  christmas_rental: BerrySpray,
  flower_rental: Bud,
};

type AanbodDropdownProps = {
  label: string;
};

export function AanbodDropdown({ label }: AanbodDropdownProps) {
  const items = aanbodNavItems();
  const root = useRef<HTMLLIElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const itemNodes = useRef<Array<HTMLAnchorElement | null>>([]);
  const openTimer = useRef(0);
  const closeTimer = useRef(0);
  const openedOnce = useRef(false);
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const triggerId = useId();

  useGSAP(
    () => {
      if (!panel.current) {
        return;
      }
      const reduced = prefersReducedMotion();
      if (open) {
        openedOnce.current = true;
        const tl = gsap.timeline({
          defaults: { ease: "power2.out", overwrite: true },
        });
        tl.to(panel.current, {
          autoAlpha: 1,
          y: 0,
          scaleY: 1,
          transformOrigin: "50% 0%",
          duration: secondsForMotion(NAV_OPEN_MS, reduced),
        }).to(
          itemNodes.current,
          {
            autoAlpha: 1,
            y: 0,
            duration: secondsForMotion(180, reduced),
            stagger: secondsForMotion(NAV_STAGGER_MS, reduced),
          },
          reduced ? 0 : 0.05,
        );
        return () => {
          tl.kill();
        };
      }
      if (!openedOnce.current) {
        gsap.set(panel.current, {
          autoAlpha: 0,
          y: -8,
          scaleY: 0.94,
          transformOrigin: "50% 0%",
        });
        gsap.set(itemNodes.current, { autoAlpha: 0, y: -6 });
        return;
      }
      const tl = gsap.timeline({
        defaults: { ease: "power2.in", overwrite: true },
      });
      tl.to(itemNodes.current, {
        autoAlpha: 0,
        y: -4,
        duration: secondsForMotion(90, reduced),
        stagger: reduced ? 0 : 0.02,
      }).to(
        panel.current,
        {
          autoAlpha: 0,
          y: -6,
          scaleY: 0.96,
          duration: secondsForMotion(NAV_CLOSE_MS, reduced),
        },
        0,
      );
      return () => {
        tl.kill();
      };
    },
    { scope: root, dependencies: [open] },
  );

  const clearTimers = () => {
    window.clearTimeout(openTimer.current);
    window.clearTimeout(closeTimer.current);
  };

  const close = () => {
    clearTimers();
    setOpen(false);
  };

  const openMenu = () => {
    clearTimers();
    setOpen(true);
  };

  const focusItem = (index: number) => {
    const nodes = itemNodes.current.filter(Boolean) as HTMLAnchorElement[];
    nodes[index]?.focus();
  };

  useEffect(() => {
    return () => clearTimers();
  }, []);

  useEffect(() => {
    if (!open) {
      return;
    }
    const onPointer = (event: PointerEvent) => {
      if (root.current && !root.current.contains(event.target as Node)) {
        window.clearTimeout(openTimer.current);
        window.clearTimeout(closeTimer.current);
        setOpen(false);
      }
    };
    const onKey = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        window.clearTimeout(openTimer.current);
        window.clearTimeout(closeTimer.current);
        setOpen(false);
        trigger.current?.focus();
      }
    };
    document.addEventListener("pointerdown", onPointer);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const onTriggerKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openMenu();
      window.requestAnimationFrame(() => focusItem(0));
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      openMenu();
      window.requestAnimationFrame(() => focusItem(items.length - 1));
    }
  };

  const onMenuKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const nodes = itemNodes.current.filter(Boolean) as HTMLAnchorElement[];
    const index = nodes.findIndex((node) => node === document.activeElement);
    if (event.key === "ArrowDown") {
      event.preventDefault();
      focusItem((index + 1) % nodes.length);
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      focusItem((index - 1 + nodes.length) % nodes.length);
    }
    if (event.key === "Home") {
      event.preventDefault();
      focusItem(0);
    }
    if (event.key === "End") {
      event.preventDefault();
      focusItem(nodes.length - 1);
    }
    if (event.key === "Tab") {
      close();
    }
  };

  return (
    <li
      ref={root}
      className="relative"
      onPointerEnter={(event) => {
        if (event.pointerType === "mouse") {
          clearTimers();
          openTimer.current = window.setTimeout(openMenu, NAV_HOVER_OPEN_MS);
        }
      }}
      onPointerLeave={(event) => {
        if (event.pointerType === "mouse") {
          clearTimers();
          closeTimer.current = window.setTimeout(close, NAV_HOVER_CLOSE_MS);
        }
      }}
    >
      <button
        ref={trigger}
        type="button"
        id={triggerId}
        className={`${NAV_LINK} inline-flex items-center gap-1`}
        aria-haspopup="true"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => {
          if (open) {
            close();
          } else {
            openMenu();
          }
        }}
        onKeyDown={onTriggerKeyDown}
      >
        {label}
        <Tendril className="h-4 w-3 text-gold" />
      </button>
      <div
        ref={panel}
        id={menuId}
        role="menu"
        aria-labelledby={triggerId}
        aria-hidden={!open}
        onKeyDown={onMenuKeyDown}
        className="absolute top-full left-0 z-30 mt-3 min-w-[18.5rem] origin-top will-change-transform"
      >
        <div className="border border-gold/55 bg-paper px-3 py-3">
          <ul className="flex flex-col gap-1">
            {items.map((item, index) => {
              const Icon = ICONS[item.key];
              return (
                <li key={item.key}>
                  <Link
                    href={item.href}
                    role="menuitem"
                    tabIndex={open ? 0 : -1}
                    ref={(node) => {
                      itemNodes.current[index] = node;
                    }}
                    onClick={close}
                    className={`flex items-start gap-3 px-2 py-2 no-underline ${NAV_FOCUS}`}
                  >
                    <Icon className="mt-0.5 h-8 w-6 shrink-0 text-gold" />
                    <span className="flex flex-col gap-1">
                      <span className="font-serif text-base tracking-normal text-ink">
                        {item.title}
                      </span>
                      {item.text ? (
                        <span className="text-xs font-light leading-snug tracking-normal text-muted">
                          {item.text}
                        </span>
                      ) : null}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </li>
  );
}
