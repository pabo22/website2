import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/Button";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Anfrage gesendet",
  robots: { index: false, follow: true },
};

export default function GesendetPage() {
  return (
    <div id="inhalt" className="mx-auto flex min-h-[60vh] max-w-shell flex-col justify-center px-6 py-section">
      <div className="max-w-2xl">
        <p className="font-mono text-sm font-semibold uppercase tracking-wide text-accent">
          Eingegangen
        </p>
        <h1 className="mt-4 text-hero font-bold text-text md:text-hero-md">
          Ihre Anfrage ist bei uns
        </h1>
        <div className="mt-6 space-y-4 text-lg text-text-muted">
          <p>
            Sie bekommen gleich eine Bestätigung per E-Mail. Falls sie nicht ankommt, schauen Sie
            bitte kurz in den Spam-Ordner.
          </p>
          <p>
            Wir melden uns in der Regel innerhalb eines Werktags. Haben Sie eine Telefonnummer
            hinterlassen, rufen wir an.
          </p>
        </div>

        <div className="mt-10 flex flex-wrap gap-4">
          <ButtonLink href="/">Zur Startseite</ButtonLink>
          <ButtonLink href={`tel:${siteConfig.contact.phoneHref}`} variant="secondary">
            {siteConfig.contact.phone}
          </ButtonLink>
        </div>

        <p className="mt-12 border-t border-border pt-6 text-[0.95rem] text-text-muted">
          Dringend? Rufen Sie einfach an. Bei laufenden Baustellen ist das oft der schnellste Weg.
        </p>
      </div>
    </div>
  );
}
