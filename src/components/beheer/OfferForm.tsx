"use client";

import { useActionState, useState } from "react";
import { deleteOfferAction, saveOfferAction } from "@/app/beheer/actions/cms.ts";
import { ConfirmDelete, SaveStatus } from "@/components/beheer/FormControls.tsx";
import { ImagePicker } from "@/components/beheer/ImagePicker.tsx";
import type { OfferRecord } from "@/lib/beheer/cms.ts";

export function OfferForm({ item }: { item?: OfferRecord }) {
  const [image, setImage] = useState(item?.image ?? null);
  const [state, action, pending] = useActionState(saveOfferAction, null);

  return (
    <form action={action} className="beheer-card">
      {item ? <input type="hidden" name="id" value={item.id} /> : null}
      <input type="hidden" name="image" value={image ?? ""} />
      <h2>{item ? item.title : "Nieuw aanboditem"}</h2>
      <label className="beheer-field">
        Titel
        <input name="title" defaultValue={item?.title ?? ""} required />
      </label>
      <label className="beheer-field">
        Categorie
        <select name="category" defaultValue={item?.category ?? "shop"}>
          <option value="shop">Winkel</option>
          <option value="christmas_rental">Verhuur Kerst</option>
          <option value="flower_rental">Verhuur Bloemen</option>
        </select>
      </label>
      <label className="beheer-field">
        Tekst
        <textarea name="text" rows={4} defaultValue={item?.text ?? ""} />
      </label>
      <label className="beheer-field">
        Volgorde
        <input name="sort" type="number" defaultValue={item?.sort ?? 0} />
      </label>
      <label className="beheer-field" style={{ flexDirection: "row", alignItems: "center" }}>
        <input name="active" type="checkbox" defaultChecked={item?.active ?? true} />
        Zichtbaar op de site
      </label>
      <ImagePicker value={image} onChange={setImage} label="Beeld" />
      <SaveStatus pending={pending} state={state} />
      <div className="beheer-actions">
        <button type="submit" className="beheer-btn" disabled={pending}>
          Opslaan
        </button>
        {item ? <ConfirmDelete action={deleteOfferAction.bind(null, item.id)} /> : null}
      </div>
    </form>
  );
}
