import type { Metadata } from "next";
import { Providers } from "@/components/Providers";
import { siteConfig } from "@/lib/site-config";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: `${siteConfig.name} – Rohbau, Zimmerei und Sanierung in ${siteConfig.contact.city}`,
    template: `%s · ${siteConfig.name}`,
  },
  description: siteConfig.kurzbeschreibung,
  openGraph: {
    type: "website",
    locale: "de_DE",
    siteName: siteConfig.legalName,
    title: `${siteConfig.name} – ${siteConfig.claim}`,
    description: siteConfig.kurzbeschreibung,
  },
  robots: { index: true, follow: true },
};

/**
 * Setzt die Theme-Klasse VOR dem ersten Paint. Ohne dieses Inline-Skript
 * blitzt beim Laden kurz das helle Layout auf, bevor React den Dark Mode
 * anwendet ("Flash of wrong theme").
 */
const themeScript = `
(function () {
  try {
    var gespeichert = localStorage.getItem("is-bau-theme");
    var dunkel = gespeichert
      ? gespeichert === "dark"
      : window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (dunkel) document.documentElement.classList.add("dark");
  } catch (e) {
    /* localStorage kann blockiert sein - dann bleibt es beim hellen Standard */
  }
})();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <a
          href="#inhalt"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-control focus:bg-accent focus:px-4 focus:py-3 focus:text-accent-contrast"
        >
          Zum Inhalt springen
        </a>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
