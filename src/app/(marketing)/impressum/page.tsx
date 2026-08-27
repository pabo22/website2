import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Impressum",
  robots: { index: false, follow: true },
};

/* WICHTIG VOR DEM GO-LIVE
   Dieses Impressum deckt die Pflichtangaben nach § 5 DDG (früher § 5 TMG)
   ab, ist aber KEINE Rechtsberatung. Zwei Werte müssen noch geprüft bzw.
   ergänzt werden:
     - exakte Bezeichnung des Registergerichts (Registerauszug)
     - Umsatzsteuer-Identifikationsnummer
   Beide stehen als Platzhalter in src/lib/site-config.ts. */

export default function ImpressumPage() {
  return (
    <div id="inhalt" className="mx-auto max-w-3xl px-6 py-section lg:py-section-lg">
      <h1 className="text-hero font-bold text-text">Impressum</h1>

      <div className="mt-12 space-y-10 text-lg leading-relaxed text-text-muted">
        <section>
          <h2 className="text-xl font-semibold text-text">Angaben gemäß § 5 DDG</h2>
          <address className="mt-3 not-italic">
            {siteConfig.legalName}
            <br />
            {siteConfig.contact.street}
            <br />
            {siteConfig.contact.zip} {siteConfig.contact.city}
          </address>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-text">Vertreten durch</h2>
          <p className="mt-3">Geschäftsführer: {siteConfig.legal.geschaeftsfuehrer}</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-text">Kontakt</h2>
          <p className="mt-3">
            Telefon:{" "}
            <a
              href={`tel:${siteConfig.contact.phoneHref}`}
              className="text-accent hover:text-accent-hover"
            >
              {siteConfig.contact.phone}
            </a>
            <br />
            E-Mail:{" "}
            <a
              href={`mailto:${siteConfig.contact.email}`}
              className="text-accent hover:text-accent-hover"
            >
              {siteConfig.contact.email}
            </a>
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-text">Registereintrag</h2>
          <p className="mt-3">
            Eintragung im Handelsregister
            <br />
            Registergericht: {siteConfig.legal.registergericht}
            <br />
            Registernummer: {siteConfig.legal.registernummer}
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-text">Umsatzsteuer-ID</h2>
          <p className="mt-3">
            Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz:
            <br />
            {siteConfig.legal.ustId}
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-text">
            Verbraucherstreitbeilegung
          </h2>
          <p className="mt-3">
            Wir sind nicht bereit und nicht verpflichtet, an Streitbeilegungsverfahren vor einer
            Verbraucherschlichtungsstelle teilzunehmen.
          </p>
        </section>
      </div>
    </div>
  );
}
