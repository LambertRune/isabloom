"use client";

export function ConfirmDelete({
  action,
}: {
  action: () => Promise<void>;
}) {
  return (
    <button
      type="button"
      className="beheer-btn-ghost"
      onClick={() => {
        if (window.confirm("Dit item verwijderen?")) {
          void action();
        }
      }}
    >
      Verwijderen
    </button>
  );
}

export function SaveStatus({
  pending,
  state,
}: {
  pending: boolean;
  state: { error?: string; ok?: boolean } | null;
}) {
  if (pending) {
    return <p className="beheer-muted">Opslaan…</p>;
  }
  if (state?.error) {
    return (
      <p className="beheer-error" role="alert">
        {state.error}
      </p>
    );
  }
  if (state?.ok) {
    return <p className="beheer-muted">Opgeslagen.</p>;
  }
  return null;
}
