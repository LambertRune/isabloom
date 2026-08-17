import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { Fraunces, Source_Sans_3 } from "next/font/google";
import { tokenCssProperties } from "@/design/tokens.ts";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-fraunces",
  axes: ["SOFT", "WONK", "opsz"],
});

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-source-sans",
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Isabloom",
  description: "Bloemstyling voor bedrijven, thuis en events in Zwevezele.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="nl"
      className={`${fraunces.variable} ${sourceSans.variable}`}
      style={tokenCssProperties() as CSSProperties}
    >
      <body className="min-h-dvh bg-paper text-ink antialiased">{children}</body>
    </html>
  );
}
