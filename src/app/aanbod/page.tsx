import type { Metadata } from "next";
import Link from "next/link";
import { Hairline } from "@/components/Hairline";
import { ImagePlaceholder } from "@/components/ImagePlaceholder";
import { AANBOD } from "@/content/aanbod";

export const metadata: Metadata = {
  title: "Aanbod",
  description:
    "Winkel, verhuur kerst en verhuur bloemen bij Isabloom in Zwevezele.",
};

export default function AanbodPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <header className="max-w-2xl">
        <p className="text-sm font-light tracking-[0.18em] text-muted uppercase">
          Isabloom
        </p>
        <h1 className="mt-4 font-serif text-4xl sm:text-5xl">{AANBOD.title}</h1>
        <p className="mt-6 max-w-xl text-lg font-light leading-relaxed">
          {AANBOD.intro}
        </p>
        <nav
          className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm tracking-wide"
          aria-label="Aanbod onderdelen"
        >
          {AANBOD.sections.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              className="text-gold-deep hover:text-ink"
            >
              {section.title}
            </a>
          ))}
        </nav>
      </header>

      <div className="mt-20 flex flex-col gap-24">
        {AANBOD.sections.map((section) => (
          <section key={section.id} id={section.id}>
            <h2 className="font-serif text-3xl">{section.title}</h2>
            <div className="mt-4 max-w-xl">
              <Hairline />
            </div>
            <p className="mt-6 max-w-xl font-light leading-relaxed">{section.text}</p>
            <ul className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-3">
              {["A", "B", "C"].map((slot) => (
                <li key={slot}>
                  <ImagePlaceholder
                    label={`${section.title} ${slot}`}
                    className="min-h-44 w-full"
                  />
                </li>
              ))}
            </ul>
            <Link
              href="/#contact"
              className="mt-8 inline-block text-sm tracking-wide text-gold-deep"
            >
              {AANBOD.cta}
            </Link>
          </section>
        ))}
      </div>
    </main>
  );
}
