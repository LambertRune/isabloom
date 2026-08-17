"use client";

import { useActionState, useState } from "react";
import { deleteTeamAction, saveTeamAction } from "@/app/beheer/actions/cms.ts";
import { ConfirmDelete, SaveStatus } from "@/components/beheer/FormControls.tsx";
import { ImagePicker } from "@/components/beheer/ImagePicker.tsx";
import type { TeamRecord } from "@/lib/beheer/cms.ts";

export function TeamForm({ item }: { item?: TeamRecord }) {
  const [photo, setPhoto] = useState(item?.photo ?? null);
  const [state, action, pending] = useActionState(saveTeamAction, null);

  return (
    <form action={action} className="beheer-card">
      {item ? <input type="hidden" name="id" value={item.id} /> : null}
      <input type="hidden" name="photo" value={photo ?? ""} />
      <h2>{item ? item.name : "Nieuw teamlid"}</h2>
      <label className="beheer-field">
        Naam
        <input name="name" defaultValue={item?.name ?? ""} required />
      </label>
      <label className="beheer-field">
        Functie
        <input name="title" defaultValue={item?.title ?? ""} />
      </label>
      <label className="beheer-field">
        Volgorde
        <input name="sort" type="number" defaultValue={item?.sort ?? 0} />
      </label>
      <label className="beheer-field" style={{ flexDirection: "row", alignItems: "center" }}>
        <input name="active" type="checkbox" defaultChecked={item?.active ?? true} />
        Zichtbaar op de site
      </label>
      <ImagePicker value={photo} onChange={setPhoto} label="Portret" />
      <SaveStatus pending={pending} state={state} />
      <div className="beheer-actions">
        <button type="submit" className="beheer-btn" disabled={pending}>
          Opslaan
        </button>
        {item ? <ConfirmDelete action={deleteTeamAction.bind(null, item.id)} /> : null}
      </div>
    </form>
  );
}
