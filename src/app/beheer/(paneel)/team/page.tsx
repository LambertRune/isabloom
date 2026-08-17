import { TeamForm } from "@/components/beheer/TeamForm.tsx";
import { loadTeamAdmin } from "@/lib/beheer/cms.ts";

export default async function TeamBeheerPage() {
  const items = await loadTeamAdmin();
  return (
    <div>
      <h1>Team</h1>
      <p className="beheer-muted">Namen, functies en portretten.</p>
      <div className="beheer-list">
        {items.map((item) => (
          <TeamForm key={item.id} item={item} />
        ))}
        <TeamForm />
      </div>
    </div>
  );
}
