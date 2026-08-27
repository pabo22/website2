/** Bearbeitungsstände einer Anfrage. Eine Quelle für UI, API und Datenbank. */
export const STATUS = {
  neu: "Neu eingegangen",
  in_bearbeitung: "In Bearbeitung",
  angebot_raus: "Angebot versendet",
  erledigt: "Erledigt",
} as const;

export type StatusSchluessel = keyof typeof STATUS;

export const STATUS_SCHLUESSEL = Object.keys(STATUS) as StatusSchluessel[];

export function istStatus(wert: string): wert is StatusSchluessel {
  return wert in STATUS;
}

export function statusLabel(wert: string) {
  return istStatus(wert) ? STATUS[wert] : wert;
}

/** Farbgebung der Status-Marke. Bleibt innerhalb der Akzentfarbe bzw. neutral,
 *  damit die Seite nicht in fünf konkurrierende Farben zerfällt. */
export function statusKlasse(wert: string) {
  switch (wert) {
    case "erledigt":
      return "bg-surface-sunken text-text-muted";
    case "angebot_raus":
      return "bg-accent text-accent-contrast";
    case "in_bearbeitung":
      return "bg-accent-soft text-accent";
    default:
      return "border border-accent text-accent";
  }
}
