import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ButtonLink } from "@/components/ui/Button";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Seite nicht gefunden",
  robots: { index: false, follow: true },
};

export default function NichtGefunden() {
  return (
    <>
      <Navbar />
      <main id="inhalt" className="mx-auto flex min-h-[60vh] max-w-shell flex-col justify-center px-6 py-section">
        <p className="font-mono text-sm font-semibold uppercase tracking-wide text-accent">
          Fehler 404
        </p>
        <h1 className="mt-4 max-w-2xl text-hero font-bold text-text md:text-hero-md">
          Diese Seite gibt es nicht
        </h1>
        <p className="mt-6 max-w-lg text-lg text-text-muted">
          Vermutlich ein alter Link oder ein Tippfehler in der Adresse. Wenn Sie eine Anfrage
          stellen wollten, geht das hier direkt.
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <ButtonLink href="/anfrage">Anfrage stellen</ButtonLink>
          <ButtonLink href="/" variant="secondary">
            Zur Startseite
          </ButtonLink>
        </div>
        <p className="mt-10 text-[0.95rem] text-text-muted">
          Lieber direkt sprechen?{" "}
          <a
            href={`tel:${siteConfig.contact.phoneHref}`}
            className="font-semibold text-accent hover:text-accent-hover"
          >
            {siteConfig.contact.phone}
          </a>
        </p>
      </main>
      <Footer />
    </>
  );
}
