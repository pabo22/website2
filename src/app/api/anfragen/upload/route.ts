import { NextResponse } from "next/server";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { FOTO_LIMITS } from "@/lib/validations/anfrage";
import { absenderIp, pruefeLimit, zuVieleAnfragen } from "@/lib/rate-limit";

/**
 * FOTO-UPLOAD (Vercel Blob, Client-Upload)
 * ----------------------------------------
 * Die Datei geht direkt vom Browser zum Blob-Speicher, nicht durch diese
 * Route. Grund: Serverless-Funktionen haben ein Body-Limit von ca. 4,5 MB -
 * ein Handyfoto sprengt das regelmäßig.
 *
 * Diese Route stellt nur ein kurzlebiges Upload-Token aus.
 *
 * Uploads sind auch ohne Anmeldung möglich, weil ein Foto vom Schaden oft
 * mehr sagt als drei Absätze Text. Damit der Blob-Speicher niemandem auf die
 * Rechnung geht, greift dafür eine Zugriffsbremse pro IP zusätzlich zu den
 * ohnehin geltenden Größen- und Typgrenzen.
 *
 * Ohne BLOB_READ_WRITE_TOKEN antwortet sie mit 501 - die Website bleibt
 * dann voll funktionsfähig, nur ohne Foto-Upload.
 */
export async function POST(request: Request) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      { error: "Foto-Upload ist auf diesem Server nicht eingerichtet." },
      { status: 501 }
    );
  }

  // 12 Uploads pro Stunde und IP: deckt fünf Fotos plus Korrekturen ab.
  const limit = pruefeLimit(`upload:${absenderIp(request)}`, 12, 60 * 60);
  if (!limit.erlaubt) return zuVieleAnfragen(limit.wartenSekunden);

  const session = await getServerSession(authOptions);
  const body = (await request.json()) as HandleUploadBody;

  try {
    const antwort = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => ({
        allowedContentTypes: [...FOTO_LIMITS.erlaubteTypen],
        maximumSizeInBytes: FOTO_LIMITS.maxBytes,
        addRandomSuffix: true,
        // Zuordnung, damit sich später nachvollziehen lässt, wer welche Datei
        // hochgeladen hat. Bei Gästen bleibt nur die IP.
        tokenPayload: JSON.stringify({
          userId: session?.user?.id ?? null,
          ip: absenderIp(request),
        }),
      }),
      onUploadCompleted: async () => {
        // Bewusst leer: die endgültige Zuordnung passiert beim Absenden der
        // Anfrage. Dieser Callback erreicht lokal ohnehin keinen Server.
      },
    });

    return NextResponse.json(antwort);
  } catch (error) {
    console.error("Foto-Upload fehlgeschlagen:", error);
    return NextResponse.json(
      { error: "Das Foto konnte nicht hochgeladen werden." },
      { status: 400 }
    );
  }
}
