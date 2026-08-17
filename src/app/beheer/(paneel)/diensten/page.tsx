import { ServiceForm } from "@/components/beheer/ServiceForm.tsx";
import { loadServicesAdmin } from "@/lib/beheer/cms.ts";

export default async function DienstenBeheerPage() {
  const items = await loadServicesAdmin();
  return (
    <div>
      <h1>Diensten</h1>
      <p className="beheer-muted">Voeg diensten toe of pas bestaande items aan.</p>
      <div className="beheer-list">
        {items.map((item) => (
          <ServiceForm key={item.id} item={item} />
        ))}
        <ServiceForm />
      </div>
    </div>
  );
}
