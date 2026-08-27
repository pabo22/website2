import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { absenderIp, pruefeLimit } from "@/lib/rate-limit";

/**
 * ANONYME SEITENZÄHLUNG
 * ---------------------
 * Erhöht einen Tageszähler pro Pfad. Gespeichert wird ausschließlich
 * "Pfad + Tag + Anzahl" - keine IP, kein Cookie, keine Besucherkennung.
 *
 * Die IP wird nur flüchtig für die Missbrauchsbremse verwendet und niemals
 * geschrieben. Dadurch bleibt die Statistik nicht personenbezogen: kein
 * Cookie-Banner, keine Einwilligung, kein Drittanbieter.
 *
 * Was das kann: "Wie viele Aufrufe hatte /leistungen im Oktober?"
 * Was das nicht kann: einzelne Besucher verfolgen. Genau so ist es gewollt.
 */

// Nur echte Seiten zählen, keine erfundenen Pfade aus dem Netz.
const ERLAUBTE_PFADE = new Set([
  "/",
  "/leistungen",
  "/ueber-uns",
  "/kontakt",
  "/faq",
  "/anfrage",
  "/anfrage/gesendet",
  "/impressum",
  "/datenschutz",
]);

export async function POST(request: Request) {
  // Grosszügig, aber endlich: verhindert, dass jemand die Zahlen aufbläst.
  const limit = pruefeLimit(`stat:${absenderIp(request)}`, 60, 60 * 60);
  if (!limit.erlaubt) {
    // Still verwerfen - eine Fehlermeldung hilft hier niemandem.
    return new NextResponse(null, { status: 204 });
  }

  let pfad: unknown;
  try {
    ({ pfad } = (await request.json()) as { pfad?: unknown });
  } catch {
    return new NextResponse(null, { status: 204 });
  }

  if (typeof pfad !== "string" || !ERLAUBTE_PFADE.has(pfad)) {
    return new NextResponse(null, { status: 204 });
  }

  // Auf Tagesbeginn normalisieren, damit pro Pfad und Tag genau ein
  // Datensatz entsteht.
  const tag = new Date();
  tag.setUTCHours(0, 0, 0, 0);

  try {
    await db.seitenaufruf.upsert({
      where: { pfad_tag: { pfad, tag } },
      create: { pfad, tag, anzahl: 1 },
      update: { anzahl: { increment: 1 } },
    });
  } catch (fehler) {
    // Statistik darf niemals die Seite stören.
    console.error("Seitenaufruf konnte nicht gezählt werden:", fehler);
  }

  return new NextResponse(null, { status: 204 });
}
