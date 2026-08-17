import { RevealOnScroll } from "@/components/animations/RevealOnScroll";
import { Hairline } from "@/components/Hairline";
import { CmsImage } from "@/components/media/CmsImage";
import { ImagePlaceholder } from "@/components/ImagePlaceholder";
import { HOME } from "@/content/homepage";
import { loadHomeContent } from "@/lib/directus/load-content.ts";

const PORTFOLIO_SLOTS = [
  "Opdracht 1",
  "Opdracht 2",
  "Atelier",
  "Seizoen",
  "Detail",
] as const;

export default async function HomePage() {
  const content = await loadHomeContent();
  const portfolio =
    content.portfolio.length > 0
      ? content.portfolio
      : PORTFOLIO_SLOTS.map((title) => ({ title, image: null }));
  const team =
    content.team.length > 0
      ? content.team
      : [
          { name: "Portret volgt", title: "", photo: null },
          { name: "Portret volgt", title: "", photo: null },
        ];

  return (
    <main>
      <section id="hero" className="mx-auto max-w-6xl px-6 pt-8 pb-16">
        <ImagePlaceholder label="Hero-beeld volgt" className="min-h-[28rem] w-full" />
        <div className="mt-8 flex max-w-3xl flex-col gap-5">
          <p className="text-sm font-light tracking-[0.18em] text-muted uppercase">
            {HOME.heroEyebrow}
          </p>
          <h1 className="font-serif text-4xl leading-tight text-ink sm:text-6xl">
            {content.heroTitle}
          </h1>
          <Hairline />
          <p className="max-w-xl text-lg font-light leading-relaxed">{content.heroLead}</p>
          <a
            href="#merkbelofte"
            className="w-fit text-sm tracking-[0.16em] text-gold-deep uppercase"
          >
            {HOME.scrollLabel}
          </a>
        </div>
      </section>

      <RevealOnScroll>
        <section
          id="merkbelofte"
          className="mx-auto grid max-w-6xl gap-10 px-6 py-20 md:grid-cols-2 md:items-center"
        >
          <div className="flex flex-col gap-5">
            <h2 className="font-serif text-3xl">{HOME.promiseTitle}</h2>
            <p className="max-w-md text-lg font-light leading-relaxed">
              {HOME.promiseBody}
            </p>
          </div>
          <ImagePlaceholder label={HOME.shopCaption} className="min-h-80 w-full" />
        </section>
      </RevealOnScroll>

      <RevealOnScroll>
        <section id="diensten" className="mx-auto max-w-6xl px-6 py-20">
          <h2 className="font-serif text-3xl">{HOME.servicesTitle}</h2>
          <ul className="mt-12 flex flex-col gap-16">
            {content.services.map((service, index) => (
              <li
                key={service.title}
                className={`grid gap-8 md:grid-cols-2 md:items-center ${
                  index % 2 === 1 ? "md:[&>*:first-child]:order-2" : ""
                }`}
              >
                <CmsImage
                  fileId={service.image}
                  alt={service.title}
                  className="min-h-64 w-full"
                />
                <div className="flex flex-col gap-4">
                  <h3 className="font-serif text-2xl">{service.title}</h3>
                  <p className="font-light leading-relaxed text-ink">{service.text}</p>
                  <a
                    href="/diensten"
                    className="w-fit text-sm tracking-wide text-gold-deep"
                  >
                    Meer over {service.title}
                  </a>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </RevealOnScroll>

      <RevealOnScroll>
        <section id="portfolio" className="mx-auto max-w-6xl px-6 py-20">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <h2 className="font-serif text-3xl">{HOME.portfolioTitle}</h2>
            <a href="#portfolio" className="text-sm tracking-wide text-gold-deep">
              {HOME.portfolioCta}
            </a>
          </div>
          <ul className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-3">
            {portfolio.map((slot, index) => (
              <li
                key={`${slot.title}-${index}`}
                className={index === 0 ? "col-span-2 min-h-72 md:row-span-2" : ""}
              >
                <CmsImage
                  fileId={slot.image}
                  alt={slot.title}
                  className={index === 0 ? "h-full min-h-72 w-full" : "min-h-40 w-full"}
                />
              </li>
            ))}
          </ul>
        </section>
      </RevealOnScroll>

      <RevealOnScroll>
        <section id="team" className="mx-auto max-w-6xl px-6 py-20">
          <div className="grid gap-10 md:grid-cols-2 md:items-start">
            <div className="flex flex-col gap-5">
              <h2 className="font-serif text-3xl">{HOME.teamTitle}</h2>
              <p className="max-w-md font-light leading-relaxed">{HOME.teamBody}</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {team.map((member, index) => (
                <div key={`${member.name}-${index}`} className="flex flex-col gap-2">
                  <CmsImage
                    fileId={member.photo}
                    alt={member.name}
                    className="min-h-56 w-full"
                  />
                  {member.title ? (
                    <p className="text-sm tracking-wide text-muted">
                      {member.name}
                      {member.title ? ` · ${member.title}` : ""}
                    </p>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </section>
      </RevealOnScroll>

      <section id="contact" className="mx-auto max-w-6xl px-6 py-20">
        <Hairline />
        <div className="mt-10 flex max-w-xl flex-col gap-6">
          <h2 className="font-serif text-3xl">{HOME.contactTitle}</h2>
          <p className="font-light leading-relaxed">
            {content.phone || content.email
              ? `${content.city}.`
              : HOME.contactBody}
          </p>
          <div className="flex flex-wrap gap-3">
            {content.phone ? (
              <a
                href={`tel:${content.phone}`}
                className="border border-gold px-5 py-2.5 text-sm tracking-wide text-gold-deep"
              >
                {content.phone}
              </a>
            ) : null}
            {content.email ? (
              <a
                href={`mailto:${content.email}`}
                className="border border-gold px-5 py-2.5 text-sm tracking-wide text-gold-deep"
              >
                {content.email}
              </a>
            ) : null}
            {content.instagramUrl ? (
              <a
                href={content.instagramUrl}
                className="border border-gold px-5 py-2.5 text-sm tracking-wide text-gold-deep"
              >
                Instagram
              </a>
            ) : null}
            {content.mapsUrl ? (
              <a
                href={content.mapsUrl}
                className="border border-gold px-5 py-2.5 text-sm tracking-wide text-gold-deep"
              >
                Route
              </a>
            ) : null}
            <a
              href={content.email ? `mailto:${content.email}` : "#contact"}
              className="bg-moss px-5 py-2.5 text-sm font-medium tracking-wide text-paper hover:bg-ink"
            >
              {HOME.contactCta}
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
