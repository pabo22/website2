import { NextResponse } from "next/server";
import { loescheAdminSession } from "@/lib/admin-auth";

export async function POST() {
  await loescheAdminSession();
  return NextResponse.json({ ok: true });
}
