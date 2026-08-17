import { FONTS, TOKENS } from "@/design/tokens";

const SWATCHES: Array<{ name: string; value: string; role: string }> = [
  { name: "paper", value: TOKENS.paper, role: "Achtergrond" },
  { name: "chalk", value: TOKENS.chalk, role: "Secundair vlak" },
  { name: "ink", value: TOKENS.ink, role: "Tekst" },
  { name: "gold", value: TOKENS.gold, role: "Lijnkunst" },
  { name: "gold-deep", value: TOKENS.goldDeep, role: "Lijnkunst diep" },
  { name: "moss", value: TOKENS.moss, role: "CTA" },
];

function Hairline() {
  return (
    <div className="flex items-center gap-3" aria-hidden="true">
      <span className="h-px flex-1 bg-gold" />
      <span className="flex gap-1.5">
        <i className="block size-1 rounded-full bg-gold" />
        <i className="block size-1 rounded-full bg-gold" />
        <i className="block size-1 rounded-full bg-gold" />
        <i className="block size-1 rounded-full bg-gold" />
      </span>
      <span className="h-px flex-1 bg-gold" />
    </div>
  );
}

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-3xl flex-col justify-center gap-12 px-6 py-16">
      <header className="flex flex-col gap-6">
        <p className="text-sm font-light tracking-[0.18em] text-muted uppercase">
          Isabloom · Zwevezele
        </p>
        <h1 className="font-serif text-5xl leading-tight text-ink sm:text-6xl">
          Bloemstyling met een rustige, ambachtelijke lijn.
        </h1>
        <Hairline />
        <p className="max-w-xl text-lg font-light leading-relaxed text-ink">
          Dit is de kleur- en typografieproef. Nog geen site-inhoud. Titels in{" "}
          {FONTS.serif}, lopende tekst in {FONTS.sans} (300 tot 600), goud uit
          het merkteken tot het logo exact gesampled kan worden.
        </p>
      </header>

      <div className="flex flex-wrap gap-3">
        <a
          href="#palet"
          className="bg-moss px-5 py-2.5 text-sm font-medium tracking-wide text-paper transition-colors hover:bg-ink"
        >
          Bekijk het palet
        </a>
        <span className="border border-gold px-5 py-2.5 text-sm font-medium tracking-wide text-gold-deep">
          Contact volgt
        </span>
      </div>

      <section id="palet" className="flex flex-col gap-5">
        <h2 className="font-serif text-2xl">Basispalet</h2>
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {SWATCHES.map((swatch) => (
            <li key={swatch.name} className="flex flex-col gap-2">
              <div
                className="h-20 border border-line"
                style={{ backgroundColor: swatch.value }}
              />
              <p className="text-sm font-medium">{swatch.role}</p>
              <p className="font-sans text-xs tracking-wide text-muted">
                {swatch.value}
              </p>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
