import { ZaakgegevensForm } from "@/components/beheer/ZaakgegevensForm.tsx";
import { loadSiteSettings } from "@/lib/beheer/cms.ts";

export default async function ZaakgegevensPage() {
  const settings = await loadSiteSettings();
  return (
    <div>
      <h1>Zaakgegevens</h1>
      <p className="beheer-muted">
        Adres, contact en het logo. Upload het logo hier. Er wordt geen logo in de code gezet.
      </p>
      <ZaakgegevensForm settings={settings} />
    </div>
  );
}
