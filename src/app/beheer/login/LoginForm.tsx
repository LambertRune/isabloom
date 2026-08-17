"use client";

import { use, useActionState, useEffect } from "react";
import { loginAction } from "@/app/beheer/actions/auth.ts";

export function LoginForm({
  searchParams,
}: {
  searchParams: Promise<{ returnUrl?: string }>;
}) {
  const { returnUrl } = use(searchParams);
  const [state, formAction, pending] = useActionState(loginAction, null);

  useEffect(() => {
    if (state && "ok" in state && state.ok) {
      window.location.replace(state.returnUrl);
    }
  }, [state]);

  return (
    <div className="beheer-login-card">
      <h1>Isabloom beheer</h1>
      <p className="beheer-muted">
        Log in met je beheerdersaccount. Inhoud vul je hier aan, niet in Directus.
      </p>
      <form action={formAction}>
        <input type="hidden" name="returnUrl" value={returnUrl || "/beheer"} />
        <label className="beheer-field">
          E-mail
          <input id="email" name="email" type="email" autoComplete="email" required />
        </label>
        <label className="beheer-field">
          Wachtwoord
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
          />
        </label>
        {state && "error" in state && state.error ? (
          <p className="beheer-error" role="alert">
            {state.error}
          </p>
        ) : null}
        <button type="submit" className="beheer-btn" disabled={pending} style={{ width: "100%" }}>
          {pending ? "Inloggen…" : "Inloggen"}
        </button>
      </form>
    </div>
  );
}
