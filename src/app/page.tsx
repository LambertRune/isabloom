import { Hairline } from "@/components/Hairline";
import { ImagePlaceholder } from "@/components/ImagePlaceholder";
import { HOME } from "@/content/homepage";

const PORTFOLIO_SLOTS = [
  "Opdracht 1",
  "Opdracht 2",
  "Atelier",
  "Seizoen",
  "Detail",
] as const;

export default function HomePage() {
  return (
    <main>
      <section id="hero" className="mx-auto max-w-6xl px-6 pt-8 pb-16">
        <ImagePlaceholder label="Hero-beeld volgt" className="min-h-[28rem] w-full" />
        <div className="mt-8 flex max-w-3xl flex-col gap-5">
          <p className="text-sm font-light tracking-[0.18em] text-muted uppercase">
            {HOME.heroEyebrow}
          </p>
          <h1 className="font-serif text-4xl leading-tight text-ink sm:text-6xl">
            {HOME.heroTitle}
          </h1>
          <Hairline />
          <p className="max-w-xl text-lg font-light leading-relaxed">{HOME.heroLead}</p>
          <a
            href="#merkbelofte"
            className="w-fit text-sm tracking-[0.16em] text-gold-deep uppercase"
          >
            {HOME.scrollLabel}
          </a>
        </div>
      </section>

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

      <section id="diensten" className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="font-serif text-3xl">{HOME.servicesTitle}</h2>
        <ul className="mt-12 flex flex-col gap-16">
          {HOME.services.map((service, index) => (
            <li
              key={service.title}
              className={`grid gap-8 md:grid-cols-2 md:items-center ${
                index % 2 === 1 ? "md:[&>*:first-child]:order-2" : ""
              }`}
            >
              <ImagePlaceholder
                label={service.title}
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

      <section id="portfolio" className="mx-auto max-w-6xl px-6 py-20">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="font-serif text-3xl">{HOME.portfolioTitle}</h2>
          <a href="#portfolio" className="text-sm tracking-wide text-gold-deep">
            {HOME.portfolioCta}
          </a>
        </div>
        <ul className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-3">
          {PORTFOLIO_SLOTS.map((slot, index) => (
            <li
              key={slot}
              className={index === 0 ? "col-span-2 min-h-72 md:row-span-2" : ""}
            >
              <ImagePlaceholder
                label={slot}
                className={index === 0 ? "h-full min-h-72 w-full" : "min-h-40 w-full"}
              />
            </li>
          ))}
        </ul>
      </section>

      <section id="team" className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid gap-10 md:grid-cols-2 md:items-start">
          <div className="flex flex-col gap-5">
            <h2 className="font-serif text-3xl">{HOME.teamTitle}</h2>
            <p className="max-w-md font-light leading-relaxed">{HOME.teamBody}</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <ImagePlaceholder label="Portret volgt" className="min-h-56 w-full" />
            <ImagePlaceholder label="Portret volgt" className="min-h-56 w-full" />
          </div>
        </div>
      </section>

      <section id="contact" className="mx-auto max-w-6xl px-6 py-20">
        <Hairline />
        <div className="mt-10 flex max-w-xl flex-col gap-6">
          <h2 className="font-serif text-3xl">{HOME.contactTitle}</h2>
          <p className="font-light leading-relaxed">{HOME.contactBody}</p>
          <a
            href="#contact"
            className="w-fit bg-moss px-5 py-2.5 text-sm font-medium tracking-wide text-paper hover:bg-ink"
          >
            {HOME.contactCta}
          </a>
        </div>
      </section>
    </main>
  );
}
