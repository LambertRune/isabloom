"use client";

import Image from "next/image";
import Link from "next/link";
import { NavbarBar } from "@/components/nav/NavbarBar";
import { cmsLogoLoader } from "@/lib/media/cms-image-loader.ts";

const LEFT = [
  { href: "/", label: "Start" },
  { href: "/diensten", label: "Diensten" },
] as const;

const RIGHT = [{ href: "/#team", label: "Werkwijze" }] as const;

export function Wordmark({ logoFileId }: { logoFileId: string | null }) {
  if (logoFileId) {
    return (
      <Link href="/" className="flex justify-center">
        <Image
          src={`/media/${logoFileId}`}
          alt="Isabloom"
          width={180}
          height={48}
          priority
          loader={cmsLogoLoader}
          className="h-12 w-auto"
          style={{ width: "auto", height: "3rem" }}
        />
      </Link>
    );
  }

  return (
    <Link
      href="/"
      className="flex flex-col items-center gap-2 text-inherit no-underline"
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
