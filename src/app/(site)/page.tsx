import { RevealOnScroll } from "@/components/animations/RevealOnScroll";
import { Hairline } from "@/components/Hairline";
import { HeroScrollCue } from "@/components/home/HeroScrollCue";
import { CmsImage } from "@/components/media/CmsImage";
import { ImagePlaceholder } from "@/components/ImagePlaceholder";
import { HOME } from "@/content/homepage";
import { portfolioHref } from "@/content/routes.ts";
import { shortenText } from "@/lib/content/text.ts";
import { loadHomeContent } from "@/lib/directus/load-content.ts";

export default async function HomePage() {
  const content = await loadHomeContent();

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
          <HeroScrollCue />
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

      {content.services.length > 0 ? (
        <RevealOnScroll>
          <section id="diensten" className="mx-auto max-w-6xl px-6 py-20">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex flex-col gap-3">
                <p className="text-sm font-light tracking-[0.18em] text-muted uppercase">
                  {HOME.servicesEyebrow}
                </p>
                <h2 className="font-serif text-3xl">{HOME.servicesTitle}</h2>
              </div>
              <a
                href="/diensten"
                className="w-fit text-sm tracking-[0.16em] text-gold-deep uppercase"
              >
                {HOME.servicesAllCta}
              </a>
            </div>
            <ul className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {content.services.map((service) => (
                <li key={service.slug ?? service.title} className="flex flex-col gap-4">
                  <CmsImage
                    fileId={service.image}
                    alt={service.title}
                    caption={service.title}
                    className="min-h-56 w-full"
                  />
                  <h3 className="font-serif text-2xl">{service.title}</h3>
                  {service.text ? (
                    <p className="font-light leading-relaxed text-ink">
                      {shortenText(service.text, 140)}
                    </p>
                  ) : null}
                  <a
                    href={service.slug ? `/diensten#${service.slug}` : "/diensten"}
                    className="w-fit text-sm tracking-[0.16em] text-gold-deep uppercase"
                  >
                    Verder lezen
                  </a>
                </li>
              ))}
            </ul>
          </section>
        </RevealOnScroll>
      ) : null}

      {content.portfolio.length > 0 ? (
        <RevealOnScroll>
          <section id="portfolio" className="mx-auto max-w-6xl px-6 py-20">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex flex-col gap-3">
                <p className="text-sm font-light tracking-[0.18em] text-muted uppercase">
                  {HOME.portfolioEyebrow}
                </p>
                <h2 className="font-serif text-3xl">{HOME.portfolioTitle}</h2>
              </div>
              <a
                href={portfolioHref()}
                className="w-fit text-sm tracking-[0.16em] text-gold-deep uppercase"
              >
                {HOME.portfolioCta}
              </a>
            </div>
            <ul className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
              {content.portfolio.map((slot, index) => (
                <li key={`${slot.title}-${index}`}>
                  <CmsImage
                    fileId={slot.image}
                    alt={slot.title}
                    caption={slot.title}
                    className="min-h-48 w-full"
                  />
                </li>
              ))}
            </ul>
          </section>
        </RevealOnScroll>
      ) : null}

      {content.team.length > 0 ? (
        <RevealOnScroll>
          <section id="team" className="mx-auto max-w-6xl px-6 py-20">
            <div className="grid gap-10 md:grid-cols-2 md:items-start">
              <div className="flex flex-col gap-5">
                <p className="text-sm font-light tracking-[0.18em] text-muted uppercase">
                  {HOME.teamEyebrow}
                </p>
                <h2 className="font-serif text-3xl">{HOME.teamTitle}</h2>
                <p className="max-w-md font-light leading-relaxed">{HOME.teamBody}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {content.team.map((member) => (
                  <div key={member.name} className="flex flex-col gap-2">
                    <CmsImage
                      fileId={member.photo}
                      alt={member.name}
                      caption={member.name}
                      className="min-h-56 w-full"
                    />
                    <p className="text-sm tracking-wide text-ink">{member.name}</p>
                    {member.title ? (
                      <p className="text-sm tracking-wide text-muted">{member.title}</p>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          </section>
        </RevealOnScroll>
      ) : null}

      <section id="contact" className="mx-auto max-w-6xl px-6 py-20">
        <Hairline />
        <div className="mt-10 flex max-w-xl flex-col gap-6">
          <h2 className="font-serif text-3xl">{HOME.contactTitle}</h2>
          <p className="font-light leading-relaxed">
            {content.phone || content.email
              ? `${content.city}.`
              : HOME.contactBody}
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <a
              href={content.email ? `mailto:${content.email}` : "#contact"}
              className="bg-moss px-5 py-2.5 text-sm font-medium tracking-wide text-paper hover:bg-ink"
            >
              {HOME.contactCta}
            </a>
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
                target="_blank"
                rel="noreferrer"
                className="text-sm tracking-[0.16em] text-gold-deep uppercase"
              >
                Instagram
              </a>
            ) : null}
            {content.facebookUrl ? (
              <a
                href={content.facebookUrl}
                target="_blank"
                rel="noreferrer"
                className="text-sm tracking-[0.16em] text-gold-deep uppercase"
              >
                Facebook
              </a>
            ) : null}
            {content.mapsUrl ? (
              <a
                href={content.mapsUrl}
                target="_blank"
                rel="noreferrer"
                className="text-sm tracking-[0.16em] text-gold-deep uppercase"
              >
                Route
              </a>
            ) : null}
          </div>
        </div>
      </section>
    </main>
  );
}
