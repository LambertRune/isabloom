"use client";

import { useActionState, useState } from "react";
import {
  deleteServiceAction,
  saveServiceAction,
} from "@/app/beheer/actions/cms.ts";
import { ConfirmDelete, SaveStatus } from "@/components/beheer/FormControls.tsx";
import { ImagePicker } from "@/components/beheer/ImagePicker.tsx";
import type { ServiceRecord } from "@/lib/beheer/cms.ts";

export function ServiceForm({ item }: { item?: ServiceRecord }) {
  const [image, setImage] = useState(item?.image ?? null);
  const [state, action, pending] = useActionState(saveServiceAction, null);

  return (
    <form action={action} className="beheer-card">
      {item ? <input type="hidden" name="id" value={item.id} /> : null}
      <input type="hidden" name="image" value={image ?? ""} />
      <h2>{item ? item.title : "Nieuwe dienst"}</h2>
      <label className="beheer-field">
        Titel
        <input name="title" defaultValue={item?.title ?? ""} required />
      </label>
      <label className="beheer-field">
        Slug
        <input name="slug" defaultValue={item?.slug ?? ""} placeholder="wordt uit de titel gemaakt" />
      </label>
      <label className="beheer-field">
        Korte tekst
        <textarea name="short_text" rows={3} defaultValue={item?.short_text ?? ""} required />
      </label>
      <label className="beheer-field">
        Lange tekst
        <textarea name="long_text" rows={5} defaultValue={item?.long_text ?? ""} />
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
        {item ? <ConfirmDelete action={deleteServiceAction.bind(null, item.id)} /> : null}
      </div>
    </form>
  );
}
