import type { Metadata } from "next";
import Link from "next/link";
import { ladeAuswertung } from "@/lib/auswertung";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Statistik",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

const zahl = new Intl.NumberFormat("de-DE");

/** Kennzahl als eigenständige Größe - hier ist eine Zahl aussagekräftiger
 *  als jedes Diagramm, deshalb bewusst kein Miniaturchart daneben. */
function Kennzahl({
  titel,
  wert,
  zusatz,
}: {
  titel: string;
  wert: string;
  zusatz?: string;
}) {
  return (
    <div className="rounded-card border border-border bg-surface p-6 shadow-subtle">
      <p className="text-sm font-medium text-text-muted">{titel}</p>
      <p className="tabular mt-2 text-4xl font-bold leading-none text-text">{wert}</p>
      {zusatz && <p className="mt-2 text-[0.9rem] text-text-muted">{zusatz}</p>}
    </div>
  );
}

export default async function StatistikPage() {
  const a = await ladeAuswertung(12);

  // Eine gemeinsame Obergrenze für alle Balken - sonst wäre jede Säule
  // relativ zu sich selbst skaliert und der Vergleich wertlos.
  const maxAnfragen = Math.max(1, ...a.monate.map((m) => m.anfragen));
  const maxSeite = Math.max(1, ...a.topSeiten.map((s) => s.aufrufe));
  const hatAufrufe = a.monate.some((m) => m.aufrufe > 0);

  return (
    <div className="mx-auto max-w-5xl px-6 py-12 lg:py-16">
      <header className="flex flex-wrap items-start justify-between gap-4 border-b border-border pb-8">
        <div>
          <h1 className="text-3xl font-bold text-text">Statistik</h1>
          <p className="mt-2 text-text-muted">
            Anonym erhoben: nur Pfad und Tag, keine Cookies, kein Fremdanbieter.
          </p>
        </div>
        <Link
          href="/admin"
          className="press inline-flex min-h-11 items-center rounded-control border border-border px-5 text-sm font-medium text-text-muted hover:text-text"
        >
          Zu den Anfragen
        </Link>
      </header>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Kennzahl
          titel="Anfragen gesamt"
          wert={zahl.format(a.anfragenGesamt)}
          zusatz={`${zahl.format(a.anfragenOffen)} noch offen`}
        />
        <Kennzahl
          titel="Anfragen (30 Tage)"
          wert={zahl.format(a.anfragen30Tage)}
          zusatz={`${zahl.format(a.anfragenMitRueckruf)} mit Rückrufwunsch insgesamt`}
        />
        <Kennzahl
          titel="Seitenaufrufe (30 Tage)"
          wert={zahl.format(a.aufrufe30Tage)}
        />
        <Kennzahl
          titel="Anfragen je 100 Aufrufe"
          wert={a.quote30Tage === null ? "–" : a.quote30Tage.toString().replace(".", ",")}
          zusatz={a.quote30Tage === null ? "Noch keine Aufrufe erfasst" : "Letzte 30 Tage"}
        />
      </div>

      {/* ---------------------------------------------------------------
          Anfragen je Monat. Eine Reihe, eine Farbe - eine Legende wäre
          hier reine Dekoration, die Überschrift benennt die Größe.
          --------------------------------------------------------------- */}
      <section className="mt-14">
        <h2 className="text-xl font-semibold text-text">Anfragen je Monat</h2>
        <p className="mt-1 text-[0.95rem] text-text-muted">Die letzten zwölf Monate</p>

        <div className="mt-8 rounded-card border border-border bg-surface p-6 shadow-subtle">
          <div className="flex h-56 items-end gap-2" role="img" aria-label="Balkendiagramm: Anfragen je Monat">
            {a.monate.map((m) => {
              const hoehe = (m.anfragen / maxAnfragen) * 100;
              return (
                <div key={m.schluessel} className="group relative flex flex-1 flex-col items-center gap-2">
                  {/* Wert nur dort, wo etwas steht - keine Null über jedem leeren Monat */}
                  {m.anfragen > 0 && (
                    <span className="tabular text-xs font-semibold text-text-muted">
                      {m.anfragen}
                    </span>
                  )}
                  <div className="flex w-full flex-1 items-end">
                    <div
                      // Abgerundetes Balkenende, am Nullpunkt verankert.
                      className="w-full rounded-t-[4px] bg-accent transition-[height] duration-300 ease-out"
                      style={{ height: `${Math.max(m.anfragen > 0 ? 4 : 0, hoehe)}%` }}
                    />
                  </div>
                  <span className="text-xs text-text-muted">{m.kurz}</span>

                  {/* Kein JavaScript nötig: reine CSS-Einblendung beim Überfahren */}
                  <span className="pointer-events-none absolute -top-2 left-1/2 z-10 -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-control border border-border bg-surface px-3 py-1.5 text-xs text-text opacity-0 shadow-raised transition-opacity duration-150 ease-out group-hover:opacity-100">
                    {m.lang}: {m.anfragen} Anfrage{m.anfragen === 1 ? "" : "n"}
                    {hatAufrufe && ` · ${zahl.format(m.aufrufe)} Aufrufe`}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Top-Seiten: waagerechte Balken, weil die Beschriftungen Text sind
          und senkrecht gedreht werden müssten. */}
      <section className="mt-14">
        <h2 className="text-xl font-semibold text-text">Meistbesuchte Seiten</h2>
        <p className="mt-1 text-[0.95rem] text-text-muted">Letzte 30 Tage</p>

        {a.topSeiten.length === 0 ? (
          <div className="mt-8 rounded-card border border-dashed border-border p-10 text-center">
            <p className="font-medium text-text">Noch keine Aufrufe erfasst</p>
            <p className="mt-2 text-text-muted">
              Die Zählung beginnt, sobald die Seite öffentlich erreichbar ist.
            </p>
          </div>
        ) : (
          <ul className="mt-8 flex flex-col gap-4">
            {a.topSeiten.map((s) => (
              <li key={s.pfad} className="flex items-center gap-4">
                <span className="w-40 shrink-0 truncate font-mono text-sm text-text">
                  {s.pfad}
                </span>
                <span className="h-3 flex-1 overflow-hidden rounded-full bg-surface-sunken">
                  <span
                    className="block h-full rounded-full bg-accent"
                    style={{ width: `${(s.aufrufe / maxSeite) * 100}%` }}
                  />
                </span>
                <span className="tabular w-16 shrink-0 text-right text-sm font-semibold text-text">
                  {zahl.format(s.aufrufe)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Zahlen zusätzlich als Tabelle - für Screenreader und zum Abtippen. */}
      <section className="mt-14">
        <details className="group">
          <summary className="flex min-h-11 cursor-pointer list-none items-center gap-2 text-sm font-semibold text-accent marker:content-none">
            Zahlen als Tabelle anzeigen
            <span aria-hidden="true" className="transition-transform duration-200 ease-out group-open:rotate-45">
              +
            </span>
          </summary>
          <div className="mt-4 overflow-x-auto rounded-card border border-border">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border bg-surface-sunken">
                  <th className="px-4 py-3 text-left font-semibold text-text-muted">Monat</th>
                  <th className="px-4 py-3 text-right font-semibold text-text-muted">Anfragen</th>
                  <th className="px-4 py-3 text-right font-semibold text-text-muted">Aufrufe</th>
                </tr>
              </thead>
              <tbody>
                {a.monate.map((m) => (
                  <tr key={m.schluessel} className="border-b border-border last:border-0">
                    <td className="px-4 py-2.5 text-text">{m.lang}</td>
                    <td className="tabular px-4 py-2.5 text-right text-text">{m.anfragen}</td>
                    <td className="tabular px-4 py-2.5 text-right text-text-muted">
                      {zahl.format(m.aufrufe)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>
      </section>

      <p className="mt-12 border-t border-border pt-6 text-sm text-text-muted">
        Der Monatsbericht geht automatisch an {siteConfig.notificationEmail}.
      </p>
    </div>
  );
}
