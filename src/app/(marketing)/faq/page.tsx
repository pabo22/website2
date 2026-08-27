import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/Button";
import { WhatsAppLink } from "@/components/layout/WhatsAppLink";
import { Erreichbarkeit } from "@/components/layout/Erreichbarkeit";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Häufige Fragen",
  description:
    "Antworten zu Kosten, Ablauf, Bauleitung, Statik und Genehmigungen beim Bauen mit IS-Bau in Dormagen.",
};

/**
 * FAQPage-Auszeichnung. Google kann die Antworten damit direkt im
 * Suchergebnis anzeigen - für einen lokalen Betrieb einer der wenigen
 * SEO-Hebel, die nur Text kosten.
 */
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: siteConfig.faq.map((eintrag) => ({
    "@type": "Question",
    name: eintrag.frage,
    acceptedAnswer: { "@type": "Answer", text: eintrag.antwort },
  })),
};

export default function FaqPage() {
  return (
    <div id="inhalt">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <section className="border-b border-border bg-background">
        <div className="mx-auto max-w-shell px-6 pb-16 pt-16 lg:pb-20 lg:pt-24">
          <h1 className="max-w-3xl text-hero font-bold text-text md:text-hero-md">
            Fragen, die uns oft gestellt werden
          </h1>
          <p className="mt-6 max-w-xl text-lg text-text-muted">
            Wenn Ihre Frage nicht dabei ist: anrufen oder kurz schreiben. Wir antworten auch,
            wenn daraus kein Auftrag wird.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-6 py-section lg:py-section-lg">
        {/*
          <details> statt eigener Aufklapp-Logik: funktioniert ohne JavaScript,
          ist von Haus aus tastaturbedienbar und wird von Screenreadern korrekt
          angesagt. Selbstgebaute Akkordeons sind an genau diesen drei Punkten
          meistens schlechter.
        */}
        <div className="divide-y divide-border border-y border-border">
          {siteConfig.faq.map((eintrag) => (
            <details key={eintrag.frage} className="group py-2">
              <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 py-4 text-lg font-semibold text-text transition-colors duration-200 ease-out marker:content-none hover:text-accent">
                {eintrag.frage}
                <span
                  aria-hidden="true"
                  className="shrink-0 text-2xl font-normal leading-none text-accent transition-transform duration-200 ease-out group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="pb-5 pr-10 text-[1.05rem] leading-relaxed text-text-muted">
                {eintrag.antwort}
              </p>
            </details>
          ))}
        </div>

        <div className="mt-14 rounded-card border border-border bg-surface p-8 shadow-subtle">
          <h2 className="text-xl font-semibold text-text">Ihre Frage war nicht dabei?</h2>
          <Erreichbarkeit className="mt-3" />
          <div className="mt-6 flex flex-wrap gap-4">
            <ButtonLink href={`tel:${siteConfig.contact.phoneHref}`}>
              {siteConfig.contact.phone}
            </ButtonLink>
            <WhatsAppLink />
            <ButtonLink href="/anfrage" variant="secondary">
              Anfrage stellen
            </ButtonLink>
          </div>
        </div>
      </div>
    </div>
  );
}
