import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { db } from "@/lib/db";
import { siteConfig } from "@/lib/site-config";
import { STATUS, STATUS_SCHLUESSEL, statusKlasse, statusLabel } from "@/lib/anfrage-status";
import { telHref } from "@/lib/telefon";
import { AdminLogoutButton } from "./AdminLogoutButton";
import { StatusWaehler } from "./StatusWaehler";

export const metadata: Metadata = {
  title: "Anfragen verwalten",
  robots: { index: false, follow: false },
};

// Immer frische Daten: eine zwischengespeicherte Anfrageliste wäre hier
// schlimmer als eine Sekunde Wartezeit.
export const dynamic = "force-dynamic";

function formatDatum(datum: Date) {
  return new Intl.DateTimeFormat("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(datum);
}

export default async function AdminDashboardPage() {
  const anfragen = await db.anfrage.findMany({
    orderBy: { createdAt: "desc" },
  });

  const offen = anfragen.filter((a) => a.status !== "erledigt").length;

  return (
    <div className="mx-auto max-w-5xl px-6 py-12 lg:py-16">
      <header className="flex flex-wrap items-start justify-between gap-4 border-b border-border pb-8">
        <div>
          <h1 className="text-3xl font-bold text-text">Anfragen · {siteConfig.name}</h1>
          <p className="mt-2 text-text-muted">
            <span className="tabular">{anfragen.length}</span> insgesamt,{" "}
            <span className="tabular">{offen}</span> offen
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/statistik"
            className="press inline-flex min-h-11 items-center rounded-control border border-border px-5 text-sm font-medium text-text-muted hover:text-text"
          >
            Statistik
          </Link>
          <AdminLogoutButton />
        </div>
      </header>

      {anfragen.length === 0 ? (
        <div className="mt-16 rounded-card border border-dashed border-border p-12 text-center">
          <p className="text-lg font-medium text-text">Noch keine Anfragen</p>
          <p className="mt-2 text-text-muted">
            Sobald jemand das Formular auf der Website ausfüllt, erscheint die Anfrage hier – und
            parallel als E-Mail an {siteConfig.notificationEmail}.
          </p>
        </div>
      ) : (
        <div className="mt-10 flex flex-col gap-5">
          {anfragen.map((anfrage) => (
            <article
              key={anfrage.id}
              className="rounded-card border border-border bg-surface p-7 shadow-subtle"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-xl font-semibold text-text">{anfrage.name}</h2>
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${statusKlasse(
                        anfrage.status
                      )}`}
                    >
                      {statusLabel(anfrage.status)}
                    </span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm">
                    <a
                      href={`mailto:${anfrage.email}`}
                      className="font-medium text-accent hover:text-accent-hover"
                    >
                      {anfrage.email}
                    </a>
                    <time className="text-text-muted">{formatDatum(anfrage.createdAt)}</time>
                    {/* Ohne Konto angefragt - für den Betrieb kein Nachteil,
                        aber gut zu wissen, dass es keine Vorgeschichte gibt. */}
                    {!anfrage.userId && (
                      <span className="text-text-muted">ohne Kundenkonto</span>
                    )}
                  </div>

                  {/*
                    Der Rückrufwunsch ist die wichtigste Handlungsaufforderung
                    der ganzen Karte - deshalb als antippbare Schaltfläche und
                    nicht als weitere Zeile in der Datenliste unten.
                  */}
                  {anfrage.telefon && (
                    <a
                      href={`tel:${telHref(anfrage.telefon)}`}
                      className="press mt-3 inline-flex min-h-11 items-center gap-2 rounded-control bg-accent px-5 text-base font-semibold text-accent-contrast hover:bg-accent-hover"
                    >
                      <span aria-hidden="true">☎</span>
                      {anfrage.telefon}
                      <span className="text-sm font-medium opacity-80">Rückruf erbeten</span>
                    </a>
                  )}
                </div>
                <StatusWaehler id={anfrage.id} status={anfrage.status} />
              </div>

              <p className="mt-5 whitespace-pre-line text-text">{anfrage.beschreibung}</p>

              <dl className="mt-5 grid gap-x-8 gap-y-2 text-sm sm:grid-cols-2">
                <div>
                  <dt className="font-semibold text-text-muted">Objekt</dt>
                  <dd className="text-text">{anfrage.adresse}</dd>
                </div>
                {anfrage.wunschtermin && (
                  <div>
                    <dt className="font-semibold text-text-muted">Wunschtermin</dt>
                    <dd className="text-text">{formatDatum(anfrage.wunschtermin)}</dd>
                  </div>
                )}
              </dl>

              {anfrage.fotos.length > 0 && (
                <ul className="mt-5 flex flex-wrap gap-3">
                  {anfrage.fotos.map((url) => (
                    <li key={url}>
                      <a
                        href={url}
                        target="_blank"
                        rel="noreferrer"
                        className="relative block h-24 w-24 overflow-hidden rounded-control border border-border bg-surface-sunken"
                      >
                        <Image src={url} alt="Foto zur Anfrage" fill sizes="96px" className="object-cover" />
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </article>
          ))}
        </div>
      )}

      <p className="mt-12 text-sm text-text-muted">
        Bearbeitungsstände: {STATUS_SCHLUESSEL.map((s) => STATUS[s]).join(" · ")}
      </p>
    </div>
  );
}
