import type { Metadata } from "next";
import Link from "next/link";
import { RevealOnScroll } from "@/components/animations/RevealOnScroll";
import { Hairline } from "@/components/Hairline";
import { CmsImage } from "@/components/media/CmsImage";
import { AANBOD } from "@/content/aanbod";
import { loadOfferGroups } from "@/lib/directus/load-content.ts";

export const metadata: Metadata = {
  title: "Aanbod",
  description:
    "Winkel, verhuur kerst en verhuur bloemen bij Isabloom in Zwevezele.",
};

export default async function AanbodPage() {
  const groups = await loadOfferGroups();

  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <header className="max-w-2xl">
        <p className="text-sm font-light tracking-[0.18em] text-berry uppercase">
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
              className="font-semibold text-gold-deep hover:text-ink"
            >
              {section.title}
            </a>
          ))}
        </nav>
      </header>

      <div className="mt-20 flex flex-col gap-24">
        {AANBOD.sections.map((section) => {
          const items = groups[section.id] ?? [];
          const tiles =
            items.length > 0
              ? items
              : [
                  { title: `${section.title} A`, text: "", image: null },
                  { title: `${section.title} B`, text: "", image: null },
                  { title: `${section.title} C`, text: "", image: null },
                ];
          return (
            <RevealOnScroll key={section.id}>
              <section id={section.id}>
                <h2 className="font-serif text-4xl">{section.title}</h2>
                <div className="mt-4 max-w-xl">
                  <Hairline />
                </div>
                <p className="mt-6 max-w-xl font-light leading-relaxed">{section.text}</p>
                <ul className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-3">
                  {tiles.map((item) => (
                    <li key={item.title} className="flex flex-col gap-2">
                      <CmsImage
                        fileId={item.image}
                        alt={item.title}
                        className="min-h-44 w-full"
                      />
                      {item.text ? (
                        <p className="text-sm font-light">{item.title}</p>
                      ) : null}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/#contact"
                  className="mt-8 inline-block text-sm font-semibold tracking-wide text-gold-deep"
                >
                  {AANBOD.cta}
                </Link>
              </section>
            </RevealOnScroll>
          );
        })}
      </div>
    </main>
  );
}
