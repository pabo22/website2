import { siteConfig } from "./site-config";

/**
 * ERREICHBARKEIT
 * --------------
 * Rechnet aus den Öffnungszeiten, ob der Betrieb gerade ans Telefon geht.
 *
 * Wichtig: gerechnet wird immer in Europe/Berlin, nicht in der Zeitzone des
 * Besuchers. Sonst zeigt die Seite jemandem in Wien "geschlossen", obwohl in
 * Dormagen noch gearbeitet wird.
 */

const ZEITZONE = "Europe/Berlin";

const WOCHENTAGE = [
  "Sonntag",
  "Montag",
  "Dienstag",
  "Mittwoch",
  "Donnerstag",
  "Freitag",
  "Samstag",
] as const;

/** Ortszeit als { tag, minuten } – unabhängig von der Zeitzone des Browsers. */
function ortszeit(jetzt: Date) {
  const teile = new Intl.DateTimeFormat("de-DE", {
    timeZone: ZEITZONE,
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(jetzt);

  const finde = (typ: string) => teile.find((t) => t.type === typ)?.value ?? "";

  const kuerzel = finde("weekday").slice(0, 2).toLowerCase();
  const reihenfolge = ["so", "mo", "di", "mi", "do", "fr", "sa"];
  const tag = Math.max(0, reihenfolge.indexOf(kuerzel));

  const stunde = Number(finde("hour"));
  const minute = Number(finde("minute"));

  return { tag, minuten: stunde * 60 + minute };
}

function alsMinuten(hhmm: string) {
  const [h, m] = hhmm.split(":").map(Number);
  return (h ?? 0) * 60 + (m ?? 0);
}

function alsUhrzeit(minuten: number) {
  const h = Math.floor(minuten / 60);
  const m = minuten % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export interface Erreichbarkeit {
  offen: boolean;
  /** Kurzer Satz für die Anzeige, z. B. "Bis 17:00 erreichbar". */
  text: string;
}

/** Öffnungszeit ohne die feste Länge aus `as const` – sonst hält TypeScript
 *  jede Prüfung auf "Liste leer" für überflüssig und bricht den Build ab. */
type Zeitfenster = { readonly tag: number; readonly von: string; readonly bis: string };

export function pruefeErreichbarkeit(jetzt: Date = new Date()): Erreichbarkeit {
  const zeiten: ReadonlyArray<Zeitfenster> = siteConfig.oeffnungszeiten;
  if (zeiten.length === 0) return { offen: false, text: "" };

  const { tag, minuten } = ortszeit(jetzt);
  const heute = zeiten.find((z) => z.tag === tag);

  if (heute) {
    const von = alsMinuten(heute.von);
    const bis = alsMinuten(heute.bis);

    if (minuten >= von && minuten < bis) {
      return { offen: true, text: `Bis ${alsUhrzeit(bis)} erreichbar` };
    }
    if (minuten < von) {
      return { offen: false, text: `Ab ${alsUhrzeit(von)} wieder erreichbar` };
    }
  }

  // Nächsten geöffneten Tag suchen (maximal eine Woche im Voraus).
  for (let versatz = 1; versatz <= 7; versatz++) {
    const naechsterTag = (tag + versatz) % 7;
    const eintrag = zeiten.find((z) => z.tag === naechsterTag);
    if (!eintrag) continue;

    // Ohne "Ab" davor - sonst entsteht "Ab Montag ab 07:00".
    const wann = versatz === 1 ? "Morgen" : WOCHENTAGE[naechsterTag];
    return {
      offen: false,
      text: `${wann} ab ${alsUhrzeit(alsMinuten(eintrag.von))} erreichbar`,
    };
  }

  return { offen: false, text: "" };
}

/**
 * Öffnungszeiten im Format, das schema.org erwartet
 * (z. B. "Mo-Do 07:00-17:00" wird zu einzelnen Einträgen).
 */
export function oeffnungszeitenSchema() {
  const zeiten: ReadonlyArray<Zeitfenster> = siteConfig.oeffnungszeiten;
  const kuerzel = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
  return zeiten.map((z) => ({
    "@type": "OpeningHoursSpecification",
    dayOfWeek: `https://schema.org/${
      ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][z.tag]
    }`,
    opens: z.von,
    closes: z.bis,
    // Kürzel nur zur besseren Lesbarkeit im Quelltext
    name: kuerzel[z.tag],
  }));
}

/** Öffnungszeiten für die Anzeige zusammenfassen: gleiche Zeiten werden gebündelt. */
export function oeffnungszeitenText() {
  const kurz = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"];
  const zeiten: ReadonlyArray<Zeitfenster> = siteConfig.oeffnungszeiten;
  const sortiert = [...zeiten].sort((a, b) => a.tag - b.tag);

  const gruppen: Array<{ von: string; bis: string; tage: number[] }> = [];
  for (const eintrag of sortiert) {
    const letzte = gruppen[gruppen.length - 1];
    const anschluss = letzte && letzte.tage[letzte.tage.length - 1] === eintrag.tag - 1;

    if (letzte && letzte.von === eintrag.von && letzte.bis === eintrag.bis && anschluss) {
      letzte.tage.push(eintrag.tag);
    } else {
      gruppen.push({ von: eintrag.von, bis: eintrag.bis, tage: [eintrag.tag] });
    }
  }

  return gruppen.map((g) => ({
    tage:
      g.tage.length === 1
        ? kurz[g.tage[0]!]
        : `${kurz[g.tage[0]!]}–${kurz[g.tage[g.tage.length - 1]!]}`,
    zeit: `${g.von}–${g.bis}`,
  }));
}
