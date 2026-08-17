"use client";

import Link from "next/link";
import { NavbarBar } from "@/components/nav/NavbarBar";

const LEFT = [
  { href: "/", label: "Start" },
  { href: "/diensten", label: "Diensten" },
] as const;

const RIGHT = [{ href: "/#team", label: "Werkwijze" }] as const;

export function Wordmark({ logoFileId }: { logoFileId: string | null }) {
  if (logoFileId) {
    return (
      <Link href="/" className="flex justify-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`/media/${logoFileId}`} alt="Isabloom" className="h-12 w-auto" />
      </Link>
    );
  }

  return (
    <Link
      href="/"
      className="flex flex-col items-center gap-2 text-ink no-underline"
    >
      <span className="flex gap-1.5" aria-hidden="true">
        <i className="block size-1 rounded-full bg-gold" />
        <i className="block size-1 rounded-full bg-gold" />
        <i className="block size-1 rounded-full bg-gold" />
        <i className="block size-1 rounded-full bg-gold" />
      </span>
      <span className="font-serif text-xl tracking-[0.18em]">Isabloom</span>
    </Link>
  );
}

export function Navbar({ logoFileId = null }: { logoFileId?: string | null }) {
  return (
    <NavbarBar
      wordmark={<Wordmark logoFileId={logoFileId} />}
      left={LEFT}
      right={RIGHT}
      aanbodLabel="Aanbod"
      contactLabel="Contact"
    />
  );
}
