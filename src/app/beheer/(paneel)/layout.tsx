import { redirect } from "next/navigation";
import { BeheerShell } from "@/components/beheer/BeheerShell.tsx";
import { getBeheerUser } from "@/lib/auth/session.ts";

export default async function BeheerPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getBeheerUser();
  if (!user) {
    redirect("/beheer/login");
  }

  return <BeheerShell email={user.email}>{children}</BeheerShell>;
}
