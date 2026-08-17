import Link from "next/link";
import { LoginForm } from "./LoginForm.tsx";

export const metadata = {
  title: "Beheer — inloggen",
};

export default function BeheerLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ returnUrl?: string }>;
}) {
  return (
    <div className="beheer-login">
      <div>
        <p>
          <Link href="/">Terug naar website</Link>
        </p>
        <LoginForm searchParams={searchParams} />
        <p className="beheer-muted" style={{ marginTop: "1rem", textAlign: "center" }}>
          Alleen voor beheerders van Isabloom.
        </p>
      </div>
    </div>
  );
}
