import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { anfrageSchema } from "@/lib/validations/anfrage";
import { sendeAnfrageBenachrichtigung, sendeAnfrageBestaetigung } from "@/lib/mail";
import { absenderIp, pruefeLimit, zuVieleAnfragen } from "@/lib/rate-limit";

/** Nur Blob-URLs akzeptieren - sonst ließen sich beliebige fremde URLs in die
 *  Datenbank und damit in die Benachrichtigungs-Mail schreiben. */
function istErlaubteFotoUrl(url: string) {
  try {
    const { hostname, protocol } = new URL(url);
    return protocol === "https:" && hostname.endsWith(".public.blob.vercel-storage.com");
  } catch {
    return false;
  }
}

/** Eigene Anfragen des angemeldeten Kunden. */
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Nicht angemeldet." }, { status: 401 });
  }

  const anfragen = await db.anfrage.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ anfragen });
}

/**
 * Nimmt eine Anfrage entgegen - AUSDRÜCKLICH AUCH OHNE ANMELDUNG.
 * Ist jemand angemeldet, wird die Anfrage seinem Konto zugeordnet, damit er
 * sie unter /konto wiederfindet.
 */
export async function POST(request: Request) {
  // Bremse gegen Formular-Bots: fünf Anfragen pro Stunde und IP reichen für
  // jeden echten Interessenten weit aus.
  const limit = pruefeLimit(`anfrage:${absenderIp(request)}`, 5, 60 * 60);
  if (!limit.erlaubt) return zuVieleAnfragen(limit.wartenSekunden);

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Ungültige Anfrage." }, { status: 400 });
  }

  const parsed = anfrageSchema.safeParse(body);
  if (!parsed.success) {
    const meldung = parsed.error.issues[0]?.message ?? "Eingaben konnten nicht geprüft werden.";
    return NextResponse.json({ error: meldung }, { status: 400 });
  }

  // Honigtopf gefüllt: Bot. Bewusst mit Erfolg antworten und nichts speichern -
  // eine Fehlermeldung würde dem Bot verraten, dass die Falle existiert.
  if (parsed.data.webseite && parsed.data.webseite.trim() !== "") {
    return NextResponse.json({ ok: true }, { status: 201 });
  }

  const session = await getServerSession(authOptions);
  const { beschreibung, adresse, wunschtermin } = parsed.data;
  const telefon = parsed.data.telefon?.trim() || null;
  const fotos = (parsed.data.fotos ?? []).filter(istErlaubteFotoUrl);

  // Bei angemeldeten Kunden gewinnen die Kontodaten: sie sind bestätigt und
  // verhindern, dass jemand unter fremdem Namen über sein Konto anfragt.
  const name = session?.user?.name ?? parsed.data.name;
  const email = session?.user?.email ?? parsed.data.email;

  let anfrage;
  try {
    anfrage = await db.anfrage.create({
      data: {
        userId: session?.user?.id ?? null,
        name,
        email,
        telefon,
        beschreibung,
        adresse,
        wunschtermin: wunschtermin ? new Date(wunschtermin) : null,
        fotos,
      },
    });
  } catch (fehler) {
    console.error("Anfrage konnte nicht gespeichert werden:", fehler);
    return NextResponse.json(
      { error: "Die Anfrage konnte nicht gespeichert werden. Bitte später erneut versuchen." },
      { status: 500 }
    );
  }

  // Der E-Mail-Versand darf die Anfrage nicht scheitern lassen: sie liegt zu
  // diesem Zeitpunkt bereits sicher in der Datenbank und ist im Admin-Bereich
  // sichtbar, auch wenn der SMTP-Server gerade nicht erreichbar ist.
  try {
    const daten = {
      kundeName: name,
      kundeEmail: email,
      beschreibung,
      adresse,
      wunschtermin: wunschtermin || null,
      telefon,
      fotos,
    };
    await Promise.all([sendeAnfrageBenachrichtigung(daten), sendeAnfrageBestaetigung(daten)]);
  } catch (fehler) {
    console.error("Anfrage gespeichert, aber E-Mail-Versand fehlgeschlagen:", fehler);
  }

  return NextResponse.json({ anfrage: { id: anfrage.id } }, { status: 201 });
}
