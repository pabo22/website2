import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { istAdminAngemeldet } from "@/lib/admin-auth";
import { istStatus } from "@/lib/anfrage-status";

/** Setzt den Bearbeitungsstand einer Anfrage. Nur für den Admin-Bereich. */
export async function POST(request: Request) {
  if (!(await istAdminAngemeldet())) {
    return NextResponse.json({ error: "Nicht angemeldet." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Ungültige Anfrage." }, { status: 400 });
  }

  const { id, status } = (body as { id?: string; status?: string }) ?? {};

  if (typeof id !== "string" || typeof status !== "string" || !istStatus(status)) {
    return NextResponse.json({ error: "Unbekannter Status." }, { status: 400 });
  }

  try {
    await db.anfrage.update({ where: { id }, data: { status } });
  } catch (error) {
    console.error("Status konnte nicht gesetzt werden:", error);
    return NextResponse.json({ error: "Anfrage nicht gefunden." }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
