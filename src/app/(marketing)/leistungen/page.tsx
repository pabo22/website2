import type { Metadata } from "next";
import Image from "next/image";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/layout/Reveal";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Leistungen",
  description:
    "Rohbau, Beton- und Stahlbetonbau, Zimmerei, Sanierung als Generalunternehmer, Bauplanung, Statik, Putz und Trockenbau.",
};

export default function LeistungenPage() {
  return (
    <div id="inhalt">
      <section className="border-b border-border bg-background">
        <div className="mx-auto max-w-shell px-6 pb-16 pt-16 lg:pb-20 lg:pt-24">
          <h1 className="max-w-3xl text-hero font-bold text-text md:text-hero-md">
            Acht Gewerke, ein Vertrag
          </h1>
          <p className="mt-6 max-w-xl text-lg text-text-muted">
            Wir führen den Rohbau selbst aus und übernehmen auf Wunsch das gesamte Vorhaben als
            Generalunternehmer.
          </p>
        </div>
      </section>

      {/* Abwechselnde Seiten statt starrem Karten-Raster: jede Leistung
          bekommt Platz, das Auge behält trotzdem einen Rhythmus. */}
      <div className="mx-auto max-w-shell px-6 py-section lg:py-section-lg">
        <div className="flex flex-col gap-16 lg:gap-24">
          {siteConfig.leistungen.map((leistung, i) => {
            const bild = "bild" in leistung ? leistung.bild : undefined;
            const gedreht = i % 2 === 1;

            return (
              <Reveal key={leistung.slug}>
                <article
                  id={leistung.slug}
                  className="grid items-start gap-8 border-t border-border pt-10 lg:grid-cols-12 lg:gap-12"
                >
                  <div className={`lg:col-span-5 ${gedreht ? "lg:order-2" : ""}`}>
                    <h2 className="text-2xl font-semibold text-text lg:text-3xl">
                      {leistung.titel}
                    </h2>
                  </div>
                  <div className={`lg:col-span-7 ${gedreht ? "lg:order-1" : ""}`}>
                    <p className="max-w-2xl text-lg leading-relaxed text-text-muted">
                      {leistung.beschreibung}
                    </p>
                    {bild && (
                      <div className="relative mt-8 aspect-[21/9] overflow-hidden rounded-card bg-surface-sunken">
                        <Image
                          src={bild.src}
                          alt={bild.alt}
                          fill
                          loading="lazy"
                          sizes="(max-width: 1024px) 100vw, 60vw"
                          className="object-cover"
                        />
                      </div>
                    )}
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>

      <section className="border-t border-border bg-ink">
        <div className="mx-auto flex max-w-shell flex-col gap-8 px-6 py-section lg:flex-row lg:items-center lg:justify-between lg:py-section-lg">
          <div>
            <h2 className="text-section font-bold text-ink-text">
              Ihr Vorhaben steht noch nicht in der Liste?
            </h2>
            <p className="mt-4 max-w-xl text-lg text-ink-muted">
              Rufen Sie an oder schreiben Sie kurz, worum es geht. Wir sagen ehrlich, ob wir das
              Richtige für Sie sind.
            </p>
          </div>
          <div className="shrink-0">
            <ButtonLink href="/anfrage" variant="onInk">
              Anfrage stellen
            </ButtonLink>
          </div>
        </div>
      </section>
    </div>
  );
}
