import { db } from "./db";

/**
 * AUSWERTUNG
 * ----------
 * Eine Quelle für beide Verbraucher: die Statistikseite im Admin-Bereich und
 * den Monatsbericht per E-Mail. Sonst driften die Zahlen auseinander und der
 * Betrieb sieht im Bericht etwas anderes als auf der Seite.
 *
 * Die Datenmengen sind hier klein (ein Handwerksbetrieb, keine Plattform),
 * deshalb wird bewusst in JavaScript zusammengefasst statt mit SQL-Akrobatik.
 * Das bleibt lesbar und für jemanden, der das später pflegt, nachvollziehbar.
 */

export interface MonatsWert {
  /** Sortierschlüssel im Format JJJJ-MM */
  schluessel: string;
  /** Beschriftung für die Anzeige, z. B. "Okt" */
  kurz: string;
  /** Vollständige Beschriftung, z. B. "Oktober 2026" */
  lang: string;
  anfragen: number;
  aufrufe: number;
}

export interface Auswertung {
  anfragenGesamt: number;
  anfragenOffen: number;
  anfragenMitRueckruf: number;
  aufrufe30Tage: number;
  anfragen30Tage: number;
  /** Anfragen je 100 Seitenaufrufe, auf eine Nachkommastelle. */
  quote30Tage: number | null;
  monate: MonatsWert[];
  topSeiten: Array<{ pfad: string; aufrufe: number }>;
}

function monatsSchluessel(datum: Date) {
  return `${datum.getFullYear()}-${String(datum.getMonth() + 1).padStart(2, "0")}`;
}

/** Die letzten `anzahl` Monate, ältester zuerst. */
function letzteMonate(anzahl: number, bis = new Date()) {
  const liste: Array<{ schluessel: string; kurz: string; lang: string }> = [];

  for (let i = anzahl - 1; i >= 0; i--) {
    const d = new Date(bis.getFullYear(), bis.getMonth() - i, 1);
    liste.push({
      schluessel: monatsSchluessel(d),
      kurz: new Intl.DateTimeFormat("de-DE", { month: "short" }).format(d),
      lang: new Intl.DateTimeFormat("de-DE", { month: "long", year: "numeric" }).format(d),
    });
  }

  return liste;
}

export async function ladeAuswertung(monateZurueck = 12): Promise<Auswertung> {
  const jetzt = new Date();
  const ab = new Date(jetzt.getFullYear(), jetzt.getMonth() - (monateZurueck - 1), 1);

  const vor30Tagen = new Date(jetzt);
  vor30Tagen.setDate(vor30Tagen.getDate() - 30);

  const [anfragen, aufrufe, anfragenGesamt, anfragenOffen, anfragenMitRueckruf] =
    await Promise.all([
      db.anfrage.findMany({
        where: { createdAt: { gte: ab } },
        select: { createdAt: true },
      }),
      db.seitenaufruf.findMany({
        where: { tag: { gte: ab } },
        select: { tag: true, pfad: true, anzahl: true },
      }),
      db.anfrage.count(),
      db.anfrage.count({ where: { status: { not: "erledigt" } } }),
      db.anfrage.count({ where: { NOT: { telefon: null } } }),
    ]);

  const geruest = letzteMonate(monateZurueck, jetzt);
  const nachMonat = new Map<string, MonatsWert>(
    geruest.map((m) => [m.schluessel, { ...m, anfragen: 0, aufrufe: 0 }])
  );

  for (const a of anfragen) {
    const eintrag = nachMonat.get(monatsSchluessel(a.createdAt));
    if (eintrag) eintrag.anfragen += 1;
  }
  for (const s of aufrufe) {
    const eintrag = nachMonat.get(monatsSchluessel(s.tag));
    if (eintrag) eintrag.aufrufe += s.anzahl;
  }

  // Letzte 30 Tage
  const aufrufe30Tage = aufrufe
    .filter((s) => s.tag >= vor30Tagen)
    .reduce((summe, s) => summe + s.anzahl, 0);
  const anfragen30Tage = anfragen.filter((a) => a.createdAt >= vor30Tagen).length;

  // Top-Seiten der letzten 30 Tage
  const proPfad = new Map<string, number>();
  for (const s of aufrufe.filter((x) => x.tag >= vor30Tagen)) {
    proPfad.set(s.pfad, (proPfad.get(s.pfad) ?? 0) + s.anzahl);
  }
  const topSeiten = [...proPfad.entries()]
    .map(([pfad, aufrufe]) => ({ pfad, aufrufe }))
    .sort((a, b) => b.aufrufe - a.aufrufe)
    .slice(0, 6);

  return {
    anfragenGesamt,
    anfragenOffen,
    anfragenMitRueckruf,
    aufrufe30Tage,
    anfragen30Tage,
    // Ohne Aufrufe ist die Quote keine 0, sondern schlicht unbekannt.
    quote30Tage:
      aufrufe30Tage > 0 ? Math.round((anfragen30Tage / aufrufe30Tage) * 1000) / 10 : null,
    monate: geruest.map((m) => nachMonat.get(m.schluessel)!),
    topSeiten,
  };
}
