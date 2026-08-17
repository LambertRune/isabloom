import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { loadHomeContent } from "@/lib/directus/load-content.ts";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const content = await loadHomeContent();
  return (
    <>
      <Navbar logoFileId={content.logo} />
      {children}
      <Footer city={content.city} />
    </>
  );
}
