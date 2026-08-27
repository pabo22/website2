import Image from "next/image";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/layout/Reveal";
import { Section, SectionHeading } from "@/components/layout/Section";
import { siteConfig } from "@/lib/site-config";

export default function HomePage() {
  return (
    <div id="inhalt">
      {/* ---------------------------------------------------------------
          HERO – asymmetrischer Split. Kein zentrierter Text über einem
          Farbverlauf: der Rohbau selbst ist das stärkste Argument.
          --------------------------------------------------------------- */}
      <section className="bg-background">
        <div className="mx-auto grid max-w-shell items-center gap-12 px-6 pb-20 pt-16 lg:grid-cols-12 lg:gap-16 lg:pb-24 lg:pt-24">
          <div className="lg:col-span-6">
            <h1 className="text-hero font-bold text-text md:text-hero-md lg:text-hero-lg">
              {siteConfig.claim}
            </h1>
            <p className="mt-6 max-w-lg text-lg text-text-muted">
              IS-Bau plant, berechnet und baut im Rhein-Kreis Neuss. Rohbau, Zimmerei und
              Generalunternehmung aus einer Hand.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <ButtonLink href="/anfrage">Anfrage stellen</ButtonLink>
              <ButtonLink href="/leistungen" variant="secondary">
                Leistungen ansehen
              </ButtonLink>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative aspect-[4/3] overflow-hidden rounded-card bg-surface-sunken shadow-raised">
              <Image
                src={siteConfig.bilder.hero.src}
                alt={siteConfig.bilder.hero.alt}
                fill
                // priority + sizes: das Hero-Bild ist das LCP-Element
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------
          FARBBLOCK in Logo-Navy. Gliedert die Seite und trägt die drei
          Argumente, die IS-Bau von einer reinen Rohbaufirma unterscheiden.
          --------------------------------------------------------------- */}
      <Section grund="ink">
        <div className="grid gap-10 md:grid-cols-3 md:gap-12">
          {siteConfig.versprechen.map((punkt, i) => (
            <Reveal key={punkt.titel} delayMs={i * 60}>
              <div className="border-t border-ink-border pt-6">
                <h2 className="text-xl font-semibold text-ink-text">{punkt.titel}</h2>
                <p className="mt-3 text-[1.05rem] leading-relaxed text-ink-muted">{punkt.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ---------------------------------------------------------------
          LEISTUNGEN als Bento-Raster. Die Spaltenbreite kommt aus
          site-config (`span`), die Summe je Zeile ergibt 6 – so entstehen
          keine leeren Zellen.
          --------------------------------------------------------------- */}
      <Section grund="background" id="leistungen">
        <div className="max-w-2xl">
          <SectionHeading>Was wir bauen</SectionHeading>
          <p className="mt-5 text-lg text-text-muted">
            Acht Gewerke, ein Ansprechpartner. Sie beauftragen einmal statt achtmal.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-6">
          {siteConfig.leistungen.map((leistung, i) => (
            <Reveal
              key={leistung.slug}
              delayMs={(i % 2) * 60}
              className={spanKlasse(leistung.span)}
            >
              <LeistungsKachel leistung={leistung} />
            </Reveal>
          ))}
        </div>

        <div className="mt-12">
          <Link
            href="/leistungen"
            className="text-base font-semibold text-accent underline-offset-4 transition-colors duration-200 ease-out hover:text-accent-hover hover:underline"
          >
            Alle Leistungen im Detail
          </Link>
        </div>
      </Section>

      {/* ---------------------------------------------------------------
          BAULEITUNG – Bild/Text-Split. Andere Layoutfamilie als der Hero
          (Bild links, Text rechts, anderer Rhythmus).
          --------------------------------------------------------------- */}
      <Section grund="surface">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-6">
            <div className="relative aspect-[3/2] overflow-hidden rounded-card bg-surface-sunken">
              <Image
                src={siteConfig.bilder.bauleitung.src}
                alt={siteConfig.bilder.bauleitung.alt}
                fill
                loading="lazy"
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>
          <div className="lg:col-span-6">
            <SectionHeading>Einer, der den Bau führt</SectionHeading>
            <div className="mt-6 space-y-5 text-lg text-text-muted">
              <p>
                Auf einer Baustelle geht selten die Technik schief, sondern die Abstimmung.
                Deshalb bekommen Sie bei uns einen Bauleiter, der Termine, Gewerke und Abnahmen
                verantwortet.
              </p>
              <p>
                Weil Statik und Ausführungsplanung im eigenen Haus entstehen, sind Rückfragen
                eine Tür weiter geklärt statt eine Woche später.
              </p>
            </div>
            <div className="mt-10">
              <ButtonLink href="/ueber-uns" variant="secondary">
                Über IS-Bau
              </ButtonLink>
            </div>
          </div>
        </div>
      </Section>

      {/* ---------------------------------------------------------------
          ABLAUF – echte Reihenfolge, daher sind Nummern hier berechtigt.
          --------------------------------------------------------------- */}
      <Section grund="background">
        <SectionHeading>So kommen Sie zum Angebot</SectionHeading>
        <ol className="mt-14 grid gap-10 md:grid-cols-3 md:gap-8">
          {siteConfig.ablauf.map((schritt, i) => (
            <Reveal key={schritt.schritt} delayMs={i * 70}>
              <li className="border-t-2 border-accent pt-6">
                <span className="tabular text-sm font-bold text-accent">{schritt.schritt}</span>
                <h3 className="mt-3 text-xl font-semibold text-text">{schritt.titel}</h3>
                <p className="mt-2 text-text-muted">{schritt.beschreibung}</p>
              </li>
            </Reveal>
          ))}
        </ol>
      </Section>

      {/* ---------------------------------------------------------------
          ABSCHLUSS-CTA – eigene Layoutfamilie: Text links, Aktionen rechts
          unten ausgerichtet, nicht mittig gestapelt.
          --------------------------------------------------------------- */}
      <section className="border-t border-border bg-surface-sunken">
        <div className="mx-auto max-w-shell px-6 py-section lg:py-section-lg">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <SectionHeading>Bereit für den nächsten Schritt?</SectionHeading>
              <p className="mt-5 max-w-xl text-lg text-text-muted">
                Beschreiben Sie Ihr Vorhaben online. Wir melden uns in der Regel innerhalb eines
                Werktags.
              </p>
            </div>
            <div className="flex flex-wrap gap-4 lg:col-span-5 lg:justify-end">
              <ButtonLink href="/anfrage">Anfrage stellen</ButtonLink>
              <ButtonLink href={`tel:${siteConfig.contact.phoneHref}`} variant="secondary">
                {siteConfig.contact.phone}
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

/** Mappt die Spaltenbreite aus der Konfiguration auf feste Tailwind-Klassen.
 *  Wichtig: keine dynamischen Klassennamen wie `lg:col-span-${n}` – die
 *  würde Tailwind beim Build nicht finden und rauswerfen. */
function spanKlasse(span: number) {
  switch (span) {
    case 2:
      return "lg:col-span-2";
    case 4:
      return "lg:col-span-4";
    case 6:
      return "lg:col-span-6";
    default:
      return "lg:col-span-3";
  }
}

type Leistung = (typeof siteConfig.leistungen)[number];

function LeistungsKachel({ leistung }: { leistung: Leistung }) {
  const bild = "bild" in leistung ? leistung.bild : undefined;
  const hervorgehoben = "hervorgehoben" in leistung && leistung.hervorgehoben;

  return (
    <article
      id={leistung.slug}
      className={`flex h-full flex-col overflow-hidden rounded-card border transition-[border-color,transform] duration-200 ease-out hover:-translate-y-[2px] ${
        hervorgehoben
          ? "border-accent/30 bg-accent-soft"
          : "border-border bg-surface shadow-subtle hover:border-accent/40"
      }`}
    >
      {bild && (
        <div className="relative aspect-[16/10] w-full bg-surface-sunken">
          <Image
            src={bild.src}
            alt={bild.alt}
            fill
            loading="lazy"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover"
          />
        </div>
      )}
      <div className="flex flex-1 flex-col p-7">
        <h3 className="text-xl font-semibold text-text">{leistung.titel}</h3>
        <p className="mt-3 text-[1.05rem] leading-relaxed text-text-muted">
          {leistung.beschreibung}
        </p>
      </div>
    </article>
  );
}
