"use client";

import { useActionState, useState } from "react";
import {
  deletePortfolioAction,
  savePortfolioAction,
} from "@/app/beheer/actions/cms.ts";
import { ConfirmDelete, SaveStatus } from "@/components/beheer/FormControls.tsx";
import { ImagePicker } from "@/components/beheer/ImagePicker.tsx";
import type { PortfolioRecord } from "@/lib/beheer/cms.ts";

export function PortfolioForm({ item }: { item?: PortfolioRecord }) {
  const [image, setImage] = useState(item?.image ?? null);
  const [state, action, pending] = useActionState(savePortfolioAction, null);

  return (
    <form action={action} className="beheer-card">
      {item ? <input type="hidden" name="id" value={item.id} /> : null}
      <input type="hidden" name="image" value={image ?? ""} />
      <h2>{item?.title || (item ? "Portfolio-item" : "Nieuw portfolio-item")}</h2>
      <label className="beheer-field">
        Titel
        <input name="title" defaultValue={item?.title ?? ""} />
      </label>
      <label className="beheer-field">
        Alt-tekst
        <input name="alt" defaultValue={item?.alt ?? ""} />
      </label>
      <label className="beheer-field">
        Categorie
        <input name="category" defaultValue={item?.category ?? ""} />
      </label>
      <label className="beheer-field">
        Volgorde
        <input name="sort" type="number" defaultValue={item?.sort ?? 0} />
      </label>
      <ImagePicker value={image} onChange={setImage} label="Beeld" />
      <SaveStatus pending={pending} state={state} />
      <div className="beheer-actions">
        <button type="submit" className="beheer-btn" disabled={pending}>
          Opslaan
        </button>
        {item ? <ConfirmDelete action={deletePortfolioAction.bind(null, item.id)} /> : null}
      </div>
    </form>
  );
}
