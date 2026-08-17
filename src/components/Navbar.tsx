import Link from "next/link";

const LEFT = [
  { href: "/", label: "Start" },
  { href: "/diensten", label: "Diensten" },
  { href: "/aanbod", label: "Aanbod" },
] as const;

const RIGHT = [{ href: "/#team", label: "Werkwijze" }] as const;

function Wordmark() {
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

export function Navbar() {
  return (
    <header className="sticky top-0 z-20 border-b border-line bg-paper">
      <nav
        className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-4 px-6 py-4 md:grid-cols-3"
        aria-label="Hoofdnavigatie"
      >
        <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm tracking-wide text-ink md:justify-start">
          {LEFT.map((item) => (
            <li key={item.href}>
              <Link href={item.href} className="hover:text-gold-deep">
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="flex justify-center">
          <Wordmark />
        </div>
        <div className="flex flex-wrap items-center justify-center gap-4 md:justify-end">
          {RIGHT.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm tracking-wide text-ink hover:text-gold-deep"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/#contact"
            className="bg-moss px-4 py-2 text-sm font-medium tracking-wide text-paper hover:bg-ink"
          >
            Contact
          </Link>
        </div>
      </nav>
    </header>
  );
}
