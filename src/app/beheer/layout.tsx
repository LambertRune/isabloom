import type { Metadata } from "next";
import "./beheer.css";

export const metadata: Metadata = {
  title: "Beheer — Isabloom",
  robots: { index: false, follow: false },
};

export default function BeheerRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="beheer">{children}</div>;
}
