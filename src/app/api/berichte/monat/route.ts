import { NextResponse } from "next/server";
import crypto from "crypto";
import { ladeAuswertung } from "@/lib/auswertung";
import { sendeMonatsbericht } from "@/lib/mail";

/**
 * MONATSBERICHT
 * -------------
 * Wird von einem Zeitplan aufgerufen (vercel.json: jeden 1. um 07:00) und
 * schickt dem Betrieb eine kurze Zusammenfassung des Vormonats.
 *
 * Warum das drin ist: Hosting ohne sichtbares Ergebnis fühlt sich für den
 * Kunden wie eine Rechnung ohne Gegenleistung an. Einmal im Monat schwarz auf
 * weiß "so viele Anfragen kamen über die Website" beantwortet die Frage,
 * bevor sie gestellt wird.
 *
 * Absicherung über CRON_SECRET: ohne gesetztes Geheimnis läuft die Route
 * nicht, damit sie niemand von außen auslösen kann.
 */
export async function GET(request: Request) {
  const geheimnis = process.env.CRON_SECRET;

  if (!geheimnis) {
    return NextResponse.json(
      { error: "CRON_SECRET ist nicht gesetzt. Bericht deaktiviert." },
      { status: 501 }
    );
  }

  const mitgeschickt = request.headers.get("authorization") ?? "";
  const erwartet = `Bearer ${geheimnis}`;

  // Zeitgleicher Vergleich: verhindert, dass sich das Geheimnis über
  // Antwortzeiten Zeichen für Zeichen erraten lässt.
  const a = crypto.createHash("sha256").update(mitgeschickt).digest();
  const b = crypto.createHash("sha256").update(erwartet).digest();
  if (!crypto.timingSafeEqual(a, b)) {
    return NextResponse.json({ error: "Nicht berechtigt." }, { status: 401 });
  }

  try {
    const auswertung = await ladeAuswertung(12);

    // Der Bericht erscheint am Monatsanfang und blickt zurück - deshalb der
    // vorletzte Eintrag der Reihe, nicht der laufende Monat.
    const vormonat = auswertung.monate[auswertung.monate.length - 2];
    if (!vormonat) {
      return NextResponse.json({ ok: true, hinweis: "Noch keine Daten." });
    }

    const davor = auswertung.monate[auswertung.monate.length - 3] ?? null;

    await sendeMonatsbericht({
      monat: vormonat.lang,
      anfragen: vormonat.anfragen,
      aufrufe: vormonat.aufrufe,
      anfragenVormonat: davor?.anfragen ?? null,
      offen: auswertung.anfragenOffen,
      topSeiten: auswertung.topSeiten,
    });

    return NextResponse.json({ ok: true, monat: vormonat.lang });
  } catch (fehler) {
    console.error("Monatsbericht fehlgeschlagen:", fehler);
    return NextResponse.json({ error: "Bericht konnte nicht erstellt werden." }, { status: 500 });
  }
}
