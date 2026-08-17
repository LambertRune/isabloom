import type { Metadata } from "next";
import Link from "next/link";
import { RevealOnScroll } from "@/components/animations/RevealOnScroll";
import { Hairline } from "@/components/Hairline";
import { CmsImage } from "@/components/media/CmsImage";
import { loadServices } from "@/lib/directus/load-content.ts";

export const metadata: Metadata = {
  title: "Diensten",
  description:
    "Business styling, home styling en events door Isabloom in Zwevezele.",
};

function ServiceImages({ images, title }: { images: string[]; title: string }) {
  if (images.length === 0) {
    return null;
  }
  if (images.length === 1) {
    return (
      <CmsImage fileId={images[0] ?? null} alt={title} className="min-h-72 w-full" />
    );
  }
  return (
    <div className="grid grid-cols-2 gap-3">
      {images.slice(0, 4).map((fileId, index) => (
        <CmsImage
          key={fileId}
          fileId={fileId}
          alt={`${title} ${index + 1}`}
          className={
            index % 2 === 1
              ? "min-h-52 w-full translate-y-4 md:min-h-56"
              : "min-h-56 w-full md:min-h-64"
          }
        />
      ))}
    </div>
  );
}

export default async function DienstenPage() {
  const services = await loadServices();

  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <header className="max-w-2xl">
        <p className="text-sm font-light tracking-[0.18em] text-berry uppercase">
          Isabloom
        </p>
        <h1 className="mt-4 font-serif text-4xl sm:text-5xl">Diensten</h1>
        <p className="mt-6 max-w-xl text-lg font-light leading-relaxed">
          Duidelijke blokken op maat. Geen webshop. Alles loopt via persoonlijk
          contact.
        </p>
      </header>

      <ul className="mt-16 flex flex-col gap-24">
        {services.map((service, index) => (
          <li key={service.title} id={service.slug ?? undefined}>
            <RevealOnScroll>
              <div
                className={`grid gap-10 md:grid-cols-2 md:items-center ${
                  index % 2 === 1 ? "md:[&>*:first-child]:order-2" : ""
                }`}
              >
                <ServiceImages images={service.images} title={service.title} />
                <div className="flex flex-col gap-5">
                  <h2 className="font-serif text-4xl">{service.title}</h2>
                  <Hairline />
                  <p className="font-light leading-relaxed">{service.text}</p>
                  <Link
                    href="/#contact"
                    className="w-fit rounded-full bg-night px-5 py-2.5 text-sm font-medium tracking-wide text-gold hover:bg-gold hover:text-night"
                  >
                    Contacteer ons
                  </Link>
                </div>
              </div>
            </RevealOnScroll>
          </li>
        ))}
      </ul>
    </main>
  );
}
