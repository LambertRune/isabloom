import Link from "next/link";
import { BEHEER_SECTIONS } from "@/lib/beheer/sections.ts";

export default function BeheerDashboardPage() {
  return (
    <div>
      <h1>Dashboard</h1>
      <p className="beheer-muted">
        Beheer de inhoud van de website. Logo, foto&apos;s en teksten vul je hier aan.
      </p>
      <div className="beheer-grid">
        {BEHEER_SECTIONS.map((item) => (
          <Link key={item.href} href={item.href} className="beheer-card">
            <h2>{item.title}</h2>
            <p className="beheer-muted">{item.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
