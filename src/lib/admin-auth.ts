import { cookies } from "next/headers";
import crypto from "crypto";

/**
 * ADMIN-ZUGANG
 * ------------
 * Bewusst simpel: EIN gemeinsames Passwort aus der Umgebung, kein eigenes
 * User-Modell. Für den Betrieb ist genau eine Zugangsstelle nötig; mehrere
 * Admin-Konten mit Rollen wären hier Overengineering.
 *
 * Hinweis für den Betrieb: das Passwort lässt sich beim Hoster jederzeit
 * ändern, ohne dass Code neu deployed werden muss.
 */

const COOKIE_NAME = "admin_session";

function erwarteterToken() {
  const passwort = process.env.ADMIN_PASSWORD;
  if (!passwort) {
    throw new Error("ADMIN_PASSWORD ist nicht gesetzt. Bitte in .env eintragen.");
  }
  // Kein Klartext-Passwort im Cookie, sondern ein daraus abgeleiteter Hash.
  return crypto.createHash("sha256").update(passwort).digest("hex");
}

export function pruefeAdminPasswort(eingabe: string): boolean {
  const passwort = process.env.ADMIN_PASSWORD;
  if (!passwort) return false;

  // Beide Seiten erst hashen: timingSafeEqual verlangt gleich lange Buffer,
  // und über die Hash-Länge verrät sich die Passwortlänge nicht.
  const a = crypto.createHash("sha256").update(eingabe).digest();
  const b = crypto.createHash("sha256").update(passwort).digest();

  return crypto.timingSafeEqual(a, b);
}

export async function setzeAdminSession() {
  // Ab Next.js 15 ist cookies() asynchron.
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, erwarteterToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8, // 8 Stunden
  });
}

export async function istAdminAngemeldet(): Promise<boolean> {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(COOKIE_NAME);
  if (!cookie) return false;
  try {
    const a = Buffer.from(cookie.value);
    const b = Buffer.from(erwarteterToken());
    return a.length === b.length && crypto.timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export async function loescheAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}
