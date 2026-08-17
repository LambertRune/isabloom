"use client";

import { useActionState, useState } from "react";
import { saveSiteSettingsAction } from "@/app/beheer/actions/cms.ts";
import { ImagePicker } from "@/components/beheer/ImagePicker.tsx";
import { SaveStatus } from "@/components/beheer/FormControls.tsx";
import type { SiteSettingsRecord } from "@/lib/beheer/cms.ts";

export function ZaakgegevensForm({ settings }: { settings: SiteSettingsRecord }) {
  const [logo, setLogo] = useState(settings.logo);
  const [favicon, setFavicon] = useState(settings.favicon);
  const [state, action, pending] = useActionState(saveSiteSettingsAction, null);

  return (
    <form action={action}>
      <input type="hidden" name="logo" value={logo ?? ""} />
      <input type="hidden" name="favicon" value={favicon ?? ""} />
      <label className="beheer-field">
        Bedrijfsnaam
        <input name="company_name" defaultValue={settings.company_name ?? ""} required />
      </label>
      <label className="beheer-field">
        Straat en nummer
        <input name="street" defaultValue={settings.street ?? ""} />
      </label>
      <label className="beheer-field">
        Postcode
        <input name="postal_code" defaultValue={settings.postal_code ?? ""} />
      </label>
      <label className="beheer-field">
        Gemeente
        <input name="city" defaultValue={settings.city ?? ""} />
      </label>
      <label className="beheer-field">
        Land
        <input name="country" defaultValue={settings.country ?? "BE"} />
      </label>
      <label className="beheer-field">
        Telefoon
        <input name="phone" defaultValue={settings.phone ?? ""} />
      </label>
      <label className="beheer-field">
        E-mail
        <input name="email" type="email" defaultValue={settings.email ?? ""} />
      </label>
      <label className="beheer-field">
        Instagram
        <input name="instagram_url" defaultValue={settings.instagram_url ?? ""} />
      </label>
      <label className="beheer-field">
        Facebook
        <input name="facebook_url" defaultValue={settings.facebook_url ?? ""} />
      </label>
      <label className="beheer-field">
        Google Maps
        <input name="maps_url" defaultValue={settings.maps_url ?? ""} />
      </label>
      <ImagePicker value={logo} onChange={setLogo} label="Logo" />
      <ImagePicker value={favicon} onChange={setFavicon} label="Favicon" />
      <SaveStatus pending={pending} state={state} />
      <div className="beheer-actions">
        <button type="submit" className="beheer-btn" disabled={pending}>
          Opslaan
        </button>
      </div>
    </form>
  );
}
