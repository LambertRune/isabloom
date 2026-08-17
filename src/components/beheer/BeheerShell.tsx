import Link from "next/link";
import { logoutAction } from "@/app/beheer/actions/auth.ts";
import { BEHEER_SECTIONS } from "@/lib/beheer/sections.ts";

export function BeheerShell({
  email,
  children,
}: {
  email: string;
  children: React.ReactNode;
}) {
  return (
    <div className="beheer-shell">
      <aside className="beheer-sidebar">
        <p className="beheer-brand">Isabloom</p>
        <p className="beheer-muted">Beheer</p>
        <nav className="beheer-nav" aria-label="Beheer">
          <Link href="/beheer">Dashboard</Link>
          {BEHEER_SECTIONS.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.title}
            </Link>
          ))}
        </nav>
        <p className="beheer-muted" style={{ marginTop: "1.5rem" }}>
          {email}
        </p>
        <form action={logoutAction}>
          <button type="submit" className="beheer-btn-ghost">
            Uitloggen
          </button>
        </form>
        <p style={{ marginTop: "1rem" }}>
          <Link href="/">Terug naar website</Link>
        </p>
      </aside>
      <div className="beheer-main">{children}</div>
    </div>
  );
}
