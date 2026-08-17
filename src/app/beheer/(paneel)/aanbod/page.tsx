import { OfferForm } from "@/components/beheer/OfferForm.tsx";
import { loadOffersAdmin } from "@/lib/beheer/cms.ts";

export default async function AanbodBeheerPage() {
  const items = await loadOffersAdmin();
  return (
    <div>
      <h1>Aanbod</h1>
      <p className="beheer-muted">Winkel, verhuur kerst en verhuur bloemen.</p>
      <div className="beheer-list">
        {items.map((item) => (
          <OfferForm key={item.id} item={item} />
        ))}
        <OfferForm />
      </div>
    </div>
  );
}
