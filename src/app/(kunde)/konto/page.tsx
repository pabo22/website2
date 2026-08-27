import type { Metadata } from "next";
import Image from "next/image";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { ButtonLink } from "@/components/ui/Button";
import { statusKlasse, statusLabel } from "@/lib/anfrage-status";

export const metadata: Metadata = {
  title: "Mein Konto",
  robots: { index: false, follow: false },
};

function formatDatum(datum: Date) {
  return new Intl.DateTimeFormat("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(datum);
}

export default async function KontoPage({
  searchParams,
}: {
  // Ab Next.js 15 ist searchParams ein Promise und muss awaited werden.
  searchParams: Promise<{ erfolg?: string }>;
}) {
  const { erfolg } = await searchParams;

  // session.user.id ist durch (kunde)/konto/layout.tsx garantiert vorhanden,
  // dort wird bei fehlender Anmeldung umgeleitet.
  const session = await getServerSession(authOptions);
  const anfragen = await db.anfrage.findMany({
    where: { userId: session!.user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-text">Meine Anfragen</h1>
        <ButtonLink href="/anfrage">Neue Anfrage</ButtonLink>
      </div>

      {erfolg && (
        <p
          role="status"
          className="einblenden mt-8 rounded-control border border-accent/30 bg-accent-soft px-5 py-4 text-[0.95rem] font-medium text-accent"
        >
          Ihre Anfrage ist eingegangen. Sie erhalten gleich eine Bestätigung per E-Mail.
        </p>
      )}

      <div className="mt-10 flex flex-col gap-5">
        {anfragen.length === 0 ? (
          <div className="rounded-card border border-dashed border-border p-12 text-center">
            <p className="text-lg font-medium text-text">Noch keine Anfrage gestellt</p>
            <p className="mt-2 text-text-muted">
              Beschreiben Sie kurz Ihr Vorhaben, wir melden uns innerhalb eines Werktags.
            </p>
            <div className="mt-8">
              <ButtonLink href="/anfrage">Erste Anfrage stellen</ButtonLink>
            </div>
          </div>
        ) : (
          anfragen.map((anfrage) => (
            <article
              key={anfrage.id}
              className="rounded-card border border-border bg-surface p-7 shadow-subtle"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span
                  className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${statusKlasse(
                    anfrage.status
                  )}`}
                >
                  {statusLabel(anfrage.status)}
                </span>
                <time className="text-sm text-text-muted">{formatDatum(anfrage.createdAt)}</time>
              </div>

              <p className="mt-4 whitespace-pre-line text-text">{anfrage.beschreibung}</p>
              <p className="mt-3 text-[0.95rem] text-text-muted">{anfrage.adresse}</p>
              {anfrage.wunschtermin && (
                <p className="mt-1 text-[0.95rem] text-text-muted">
                  Wunschtermin: {formatDatum(anfrage.wunschtermin)}
                </p>
              )}
              {anfrage.telefon && (
                <p className="mt-1 text-[0.95rem] text-text-muted">
                  Rückruf an: {anfrage.telefon}
                </p>
              )}

              {anfrage.fotos.length > 0 && (
                <ul className="mt-5 flex flex-wrap gap-3">
                  {anfrage.fotos.map((url) => (
                    <li
                      key={url}
                      className="relative h-20 w-20 overflow-hidden rounded-control border border-border bg-surface-sunken"
                    >
                      <Image src={url} alt="" fill sizes="80px" className="object-cover" />
                    </li>
                  ))}
                </ul>
              )}
            </article>
          ))
        )}
      </div>
    </div>
  );
}
