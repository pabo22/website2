import { NextResponse } from "next/server";
import { pruefeAdminPasswort, setzeAdminSession } from "@/lib/admin-auth";
import { absenderIp, pruefeLimit, zuVieleAnfragen } from "@/lib/rate-limit";

export async function POST(request: Request) {
  // Zehn Fehlversuche pro Viertelstunde. Das Adminpasswort ist der einzige
  // Schutz des internen Bereichs - hier ist Durchprobieren die reale Gefahr.
  const limit = pruefeLimit(`adminlogin:${absenderIp(request)}`, 10, 15 * 60);
  if (!limit.erlaubt) return zuVieleAnfragen(limit.wartenSekunden);

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Ungültige Anfrage." }, { status: 400 });
  }

  const { password } = (body as { password?: string }) ?? {};

  if (typeof password !== "string" || !pruefeAdminPasswort(password)) {
    // Kleine Verzögerung bremst automatisiertes Durchprobieren spürbar aus,
    // ohne dass ein zusätzlicher Dienst nötig wird. Für echten Brute-Force-
    // Schutz gehört zusätzlich eine Rate-Limit-Regel vor die Anwendung
    // (siehe README, Abschnitt "Admin-Bereich absichern").
    await new Promise((fertig) => setTimeout(fertig, 600));
    return NextResponse.json({ error: "Passwort ist falsch." }, { status: 401 });
  }

  await setzeAdminSession();
  return NextResponse.json({ ok: true });
}
