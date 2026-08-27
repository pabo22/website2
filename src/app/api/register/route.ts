import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { registerSchema } from "@/lib/validations/auth";
import { absenderIp, pruefeLimit, zuVieleAnfragen } from "@/lib/rate-limit";

export async function POST(request: Request) {
  // Fünf Konten pro Stunde und IP. Verhindert, dass jemand die Nutzertabelle
  // mit erfundenen Adressen flutet.
  const limit = pruefeLimit(`register:${absenderIp(request)}`, 5, 60 * 60);
  if (!limit.erlaubt) return zuVieleAnfragen(limit.wartenSekunden);

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Ungültige Anfrage." }, { status: 400 });
  }

  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) {
    const meldung = parsed.error.issues[0]?.message ?? "Eingaben konnten nicht geprüft werden.";
    return NextResponse.json({ error: meldung }, { status: 400 });
  }

  const { name, email, password } = parsed.data;

  try {
    const bestehenderUser = await db.user.findUnique({ where: { email } });
    if (bestehenderUser) {
      return NextResponse.json(
        { error: "Für diese E-Mail-Adresse existiert bereits ein Konto." },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await db.user.create({
      data: { name, email, passwordHash },
      select: { id: true, name: true, email: true },
    });

    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    console.error("Fehler bei der Registrierung:", error);
    return NextResponse.json(
      { error: "Registrierung ist gerade nicht möglich. Bitte später erneut versuchen." },
      { status: 500 }
    );
  }
}
