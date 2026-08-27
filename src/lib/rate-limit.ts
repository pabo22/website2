/**
 * EINFACHE ZUGRIFFSBREMSE
 * -----------------------
 * Zählt Zugriffe pro Absender in einem gleitenden Zeitfenster.
 *
 * EHRLICHE EINORDNUNG: Der Zähler liegt im Arbeitsspeicher des Servers.
 * Auf Vercel laufen mehrere Instanzen nebeneinander, jede zählt für sich -
 * ein entschlossener Angreifer kommt also durch. Gegen die tatsächliche
 * Alltagslast (Formular-Bots, versehentliche Doppelklicks, ein genervter
 * Mitbewerber) reicht es aber, und es kostet weder Geld noch einen weiteren
 * Dienstleister. Wer echten Schutz braucht, legt eine Rate-Limit-Regel des
 * Hosters davor (bei Vercel: Settings -> Security -> Firewall).
 */

type Eintrag = { zaehler: number; zuruecksetzenUm: number };

const speicher = new Map<string, Eintrag>();

// Ohne Aufräumen würde die Map bei vielen verschiedenen IPs endlos wachsen.
function aufraeumen(jetzt: number) {
  if (speicher.size < 5000) return;
  for (const [schluessel, eintrag] of speicher) {
    if (eintrag.zuruecksetzenUm <= jetzt) speicher.delete(schluessel);
  }
}

export interface LimitErgebnis {
  erlaubt: boolean;
  /** Sekunden bis zum nächsten erlaubten Versuch. */
  wartenSekunden: number;
}

export function pruefeLimit(
  schluessel: string,
  maxVersuche: number,
  fensterSekunden: number
): LimitErgebnis {
  const jetzt = Date.now();
  aufraeumen(jetzt);

  const vorhanden = speicher.get(schluessel);

  if (!vorhanden || vorhanden.zuruecksetzenUm <= jetzt) {
    speicher.set(schluessel, { zaehler: 1, zuruecksetzenUm: jetzt + fensterSekunden * 1000 });
    return { erlaubt: true, wartenSekunden: 0 };
  }

  if (vorhanden.zaehler >= maxVersuche) {
    return {
      erlaubt: false,
      wartenSekunden: Math.max(1, Math.ceil((vorhanden.zuruecksetzenUm - jetzt) / 1000)),
    };
  }

  vorhanden.zaehler += 1;
  return { erlaubt: true, wartenSekunden: 0 };
}

/**
 * Ermittelt die Absender-IP. Hinter einem Proxy (Vercel, nginx) steht die
 * echte Adresse im X-Forwarded-For-Header, der erste Eintrag ist der Client.
 */
export function absenderIp(request: Request): string {
  const weitergeleitet = request.headers.get("x-forwarded-for");
  if (weitergeleitet) return weitergeleitet.split(",")[0]!.trim();
  return request.headers.get("x-real-ip") ?? "unbekannt";
}

/** Fertige Antwort für den Fall, dass zu oft zugegriffen wurde. */
export function zuVieleAnfragen(wartenSekunden: number) {
  const minuten = Math.ceil(wartenSekunden / 60);
  return Response.json(
    {
      error:
        minuten <= 1
          ? "Zu viele Versuche. Bitte in einer Minute noch einmal probieren."
          : `Zu viele Versuche. Bitte in etwa ${minuten} Minuten noch einmal probieren.`,
    },
    { status: 429, headers: { "Retry-After": String(wartenSekunden) } }
  );
}
