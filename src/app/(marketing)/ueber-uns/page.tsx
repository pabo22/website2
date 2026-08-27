import type { Metadata } from "next";
import Image from "next/image";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/layout/Reveal";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Über uns",
  description: `${siteConfig.legalName} aus ${siteConfig.contact.city}: Rohbau, Zimmerei, Planung und Statik unter einem Dach.`,
};

/* HINWEIS FÜR DIE ÜBERGABE
   Die Texte unten sind aus dem eingetragenen Unternehmensgegenstand
   abgeleitet und enthalten bewusst KEINE erfundenen Zahlen (Gründungsjahr,
   Mitarbeiterzahl, Referenzobjekte). Sobald der Betrieb diese Angaben
   liefert, hier ergänzen – erfundene Zahlen sind ein Haftungsrisiko. */

export default function UeberUnsPage() {
  return (
    <div id="inhalt">
      <section className="bg-background">
        <div className="mx-auto grid max-w-shell items-center gap-12 px-6 pb-16 pt-16 lg:grid-cols-12 lg:gap-16 lg:pb-20 lg:pt-24">
          <div className="lg:col-span-7">
            <h1 className="text-hero font-bold text-text md:text-hero-md">
              Bauen ist Handwerk, nicht Verwaltung
            </h1>
            <p className="mt-6 max-w-xl text-lg text-text-muted">
              {siteConfig.legalName} ist ein Bauunternehmen aus {siteConfig.contact.city}. Wir
              mauern, betonieren und zimmern selbst und übernehmen auf Wunsch das ganze Vorhaben.
            </p>
          </div>
          <div className="lg:col-span-5">
            <div className="relative aspect-square overflow-hidden rounded-card bg-surface-sunken">
              <Image
                src={siteConfig.bilder.bauleitung.src}
                alt={siteConfig.bilder.bauleitung.alt}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-surface">
        <div className="mx-auto max-w-shell px-6 py-section lg:py-section-lg">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-7">
              <div className="max-w-2xl space-y-6 text-lg leading-relaxed text-text-muted">
                <p>
                  Die meisten Probleme am Bau entstehen an den Schnittstellen: zwischen Planung
                  und Ausführung, zwischen Statiker und Polier, zwischen einem Gewerk und dem
                  nächsten. Genau dort setzen wir an.
                </p>
                <p>
                  Statische Berechnungen und Ausführungsplanung entstehen bei uns im Haus. Der
                  Rohbau, die Zimmererarbeiten und der Innenausbau werden von uns ausgeführt oder
                  von uns koordiniert. Sie haben einen Ansprechpartner, der für das Ergebnis
                  geradesteht.
                </p>
                <p>
                  Wir sagen früh, was geht und was nicht. Ein ehrliches Nein ist günstiger als ein
                  Nachtrag im dritten Bauabschnitt.
                </p>
              </div>
            </div>

            <div className="lg:col-span-5">
              <dl className="space-y-8">
                <Reveal>
                  <div className="border-t border-border pt-5">
                    <dt className="text-sm font-semibold uppercase tracking-wide text-accent">
                      Sitz
                    </dt>
                    <dd className="mt-2 text-lg text-text">
                      {siteConfig.contact.street}
                      <br />
                      {siteConfig.contact.zip} {siteConfig.contact.city}
                    </dd>
                  </div>
                </Reveal>
                <Reveal delayMs={60}>
                  <div className="border-t border-border pt-5">
                    <dt className="text-sm font-semibold uppercase tracking-wide text-accent">
                      Einsatzgebiet
                    </dt>
                    <dd className="mt-2 text-lg text-text">
                      {siteConfig.einzugsgebiet.join(" · ")}
                    </dd>
                  </div>
                </Reveal>
                <Reveal delayMs={120}>
                  <div className="border-t border-border pt-5">
                    <dt className="text-sm font-semibold uppercase tracking-wide text-accent">
                      Geschäftsführung
                    </dt>
                    <dd className="mt-2 text-lg text-text">
                      {siteConfig.legal.geschaeftsfuehrer}
                    </dd>
                  </div>
                </Reveal>
              </dl>
            </div>
          </div>

          <div className="mt-14 flex flex-wrap gap-4">
            <ButtonLink href="/anfrage">Anfrage stellen</ButtonLink>
            <ButtonLink href="/kontakt" variant="secondary">
              Kontakt
            </ButtonLink>
          </div>
        </div>
      </section>
    </div>
  );
}
