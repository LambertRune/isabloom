import { PortfolioForm } from "@/components/beheer/PortfolioForm.tsx";
import { loadPortfolioAdmin } from "@/lib/beheer/cms.ts";

export default async function PortfolioBeheerPage() {
  const items = await loadPortfolioAdmin();
  return (
    <div>
      <h1>Portfolio</h1>
      <p className="beheer-muted">Beelden van opdrachten. Elk item heeft een foto nodig.</p>
      <div className="beheer-list">
        {items.map((item) => (
          <PortfolioForm key={item.id} item={item} />
        ))}
        <PortfolioForm />
      </div>
    </div>
  );
}
