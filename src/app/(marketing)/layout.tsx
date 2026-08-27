import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Seitenzaehler } from "@/components/layout/Seitenzaehler";
import { siteConfig } from "@/lib/site-config";
import { oeffnungszeitenSchema } from "@/lib/erreichbarkeit";

/**
 * LocalBusiness-Auszeichnung: Google versteht dadurch Adresse, Telefon und
 * Leistungsspektrum. Für einen lokalen Betrieb der wirksamste SEO-Baustein.
 */
const schema = {
  "@context": "https://schema.org",
  "@type": "GeneralContractor",
  name: siteConfig.legalName,
  description: siteConfig.kurzbeschreibung,
  telephone: siteConfig.contact.phone,
  email: siteConfig.contact.email,
  address: {
    "@type": "PostalAddress",
    streetAddress: siteConfig.contact.street,
    postalCode: siteConfig.contact.zip,
    addressLocality: siteConfig.contact.city,
    addressCountry: "DE",
  },
  url: process.env.NEXT_PUBLIC_SITE_URL ?? undefined,
  areaServed: siteConfig.einzugsgebiet.map((ort) => ({ "@type": "Place", name: ort })),
  // Öffnungszeiten: Google zeigt sie im Eintrag an und rechnet daraus
  // "Jetzt geöffnet" - dasselbe, was die Seite selbst anzeigt.
  openingHoursSpecification: oeffnungszeitenSchema(),
  makesOffer: siteConfig.leistungen.map((l) => ({
    "@type": "Offer",
    itemOffered: { "@type": "Service", name: l.titel },
  })),
};

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      {/* Zählt nur öffentliche Seiten - Konto- und Admin-Bereich bleiben außen vor. */}
      <Seitenzaehler />
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}
