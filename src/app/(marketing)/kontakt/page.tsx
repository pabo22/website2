import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/Button";
import { Erreichbarkeit } from "@/components/layout/Erreichbarkeit";
import { WhatsAppLink } from "@/components/layout/WhatsAppLink";
import { oeffnungszeitenText } from "@/lib/erreichbarkeit";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Kontakt",
  description: `${siteConfig.legalName}, ${siteConfig.contact.address}. Telefon ${siteConfig.contact.phone}.`,
};

const wege = [
  {
    titel: "Telefon",
    wert: siteConfig.contact.phone,
    href: `tel:${siteConfig.contact.phoneHref}`,
    zusatz: "Montag bis Freitag, Bürozeiten",
  },
  {
    titel: "E-Mail",
    wert: siteConfig.contact.email,
    href: `mailto:${siteConfig.contact.email}`,
    zusatz: "Antwort in der Regel innerhalb eines Werktags",
  },
];

export default function KontaktPage() {
  return (
    <div id="inhalt">
      <section className="bg-background">
        <div className="mx-auto grid max-w-shell gap-12 px-6 pb-section pt-16 lg:grid-cols-12 lg:gap-16 lg:pb-section-lg lg:pt-24">
          <div className="lg:col-span-6">
            <h1 className="text-hero font-bold text-text md:text-hero-md">Sprechen wir darüber</h1>
            <p className="mt-6 max-w-lg text-lg text-text-muted">
              Für ein konkretes Angebot nutzen Sie am besten das Anfrageformular. Sie bekommen die
              Rückmeldung dann schriftlich und können alles nachlesen.
            </p>
            <Erreichbarkeit className="mt-8" />
            <div className="mt-6 flex flex-wrap gap-4">
              <ButtonLink href="/anfrage">Anfrage stellen</ButtonLink>
              <WhatsAppLink />
            </div>

            {/* Öffnungszeiten in gebündelter Form, z. B. "Mo–Do 07:00–17:00" */}
            <dl className="mt-12 max-w-xs">
              <dt className="text-sm font-semibold uppercase tracking-wide text-text-muted">
                Bürozeiten
              </dt>
              <dd className="mt-3 flex flex-col gap-1">
                {oeffnungszeitenText().map((zeile) => (
                  <span key={zeile.tage} className="tabular flex justify-between text-text">
                    <span className="text-text-muted">{zeile.tage}</span>
                    <span>{zeile.zeit}</span>
                  </span>
                ))}
              </dd>
            </dl>
          </div>

          <div className="lg:col-span-6">
            <dl className="divide-y divide-border border-y border-border">
              {wege.map((weg) => (
                <div key={weg.titel} className="py-6">
                  <dt className="text-sm font-semibold uppercase tracking-wide text-text-muted">
                    {weg.titel}
                  </dt>
                  <dd className="mt-2">
                    <a
                      href={weg.href}
                      className="text-xl font-semibold text-accent underline-offset-4 transition-colors duration-200 ease-out hover:text-accent-hover hover:underline"
                    >
                      {weg.wert}
                    </a>
                    <p className="mt-1 text-[0.95rem] text-text-muted">{weg.zusatz}</p>
                  </dd>
                </div>
              ))}
              <div className="py-6">
                <dt className="text-sm font-semibold uppercase tracking-wide text-text-muted">
                  Anschrift
                </dt>
                <dd className="mt-2">
                  <address className="text-xl font-semibold not-italic text-text">
                    {siteConfig.legalName}
                    <br />
                    {siteConfig.contact.street}
                    <br />
                    {siteConfig.contact.zip} {siteConfig.contact.city}
                  </address>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>
    </div>
  );
}
