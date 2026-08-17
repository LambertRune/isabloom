import type { Metadata } from "next";
import Link from "next/link";
import { Hairline } from "@/components/Hairline";
import { ImagePlaceholder } from "@/components/ImagePlaceholder";
import { HOME } from "@/content/homepage";

export const metadata: Metadata = {
  title: "Diensten",
  description:
    "Business styling, home styling en events door Isabloom in Zwevezele.",
};

export default function DienstenPage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <header className="max-w-2xl">
        <p className="text-sm font-light tracking-[0.18em] text-muted uppercase">
          Isabloom
        </p>
        <h1 className="mt-4 font-serif text-4xl sm:text-5xl">Diensten</h1>
        <p className="mt-6 max-w-xl text-lg font-light leading-relaxed">
          Duidelijke blokken op maat. Geen webshop. Alles loopt via persoonlijk
          contact.
        </p>
      </header>

      <ul className="mt-16 flex flex-col gap-24">
        {HOME.services.map((service, index) => (
          <li key={service.title} id={service.title.toLowerCase().replace(" ", "-")}>
            <div
              className={`grid gap-10 md:grid-cols-2 md:items-center ${
                index % 2 === 1 ? "md:[&>*:first-child]:order-2" : ""
              }`}
            >
              <div className="grid grid-cols-2 gap-3">
                <ImagePlaceholder
                  label={`${service.title} 1`}
                  className="min-h-56 w-full"
                />
                <ImagePlaceholder
                  label={`${service.title} 2`}
                  className="min-h-56 w-full"
                />
              </div>
              <div className="flex flex-col gap-5">
                <h2 className="font-serif text-3xl">{service.title}</h2>
                <Hairline />
                <p className="font-light leading-relaxed">{service.text}</p>
                <Link
                  href="/#contact"
                  className="w-fit bg-moss px-5 py-2.5 text-sm font-medium tracking-wide text-paper hover:bg-ink"
                >
                  Contacteer ons
                </Link>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
