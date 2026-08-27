import type { Metadata } from "next";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { AnfrageForm } from "@/components/forms/AnfrageForm";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Anfrage stellen",
  description:
    "Beschreiben Sie Ihr Bauvorhaben. Unverbindlich, kostenlos und ohne Kundenkonto. Rückmeldung in der Regel innerhalb eines Werktags.",
};

export default async function AnfragePage() {
  // Angemeldete Kunden müssen Name und E-Mail nicht erneut eintippen.
  const session = await getServerSession(authOptions);
  const konto = session?.user
    ? { name: session.user.name ?? "", email: session.user.email ?? "" }
    : null;

  return (
    <div id="inhalt" className="mx-auto max-w-shell px-6 py-16 lg:py-24">
      <div className="grid gap-14 lg:grid-cols-12 lg:gap-20">
        <div className="lg:col-span-7">
          <h1 className="text-hero font-bold text-text md:text-hero-md">Ihr Vorhaben, kurz beschrieben</h1>
          <p className="mt-6 max-w-xl text-lg text-text-muted">
            Zwei Minuten, unverbindlich und ohne Konto. Wir melden uns in der Regel innerhalb eines
            Werktags mit einer ersten Einschätzung.
          </p>

          <div className="mt-12">
            <AnfrageForm konto={konto} />
          </div>
        </div>

        {/* Seitenspalte: nimmt die typischen Zweifel vorweg, bevor sie zum Abbruch führen. */}
        <aside className="lg:col-span-5">
          <div className="rounded-card border border-border bg-surface p-8 shadow-subtle lg:sticky lg:top-28">
            <h2 className="text-xl font-semibold text-text">Was danach passiert</h2>
            <ol className="mt-6 flex flex-col gap-5">
              {siteConfig.ablauf.map((schritt) => (
                <li key={schritt.schritt} className="flex gap-4">
                  <span className="tabular mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent-soft text-sm font-bold text-accent">
                    {schritt.schritt}
                  </span>
                  <span>
                    <span className="block font-semibold text-text">{schritt.titel}</span>
                    <span className="mt-1 block text-[0.95rem] text-text-muted">
                      {schritt.beschreibung}
                    </span>
                  </span>
                </li>
              ))}
            </ol>

            <div className="mt-8 border-t border-border pt-6">
              <p className="text-[0.95rem] text-text-muted">Lieber direkt sprechen?</p>
              <a
                href={`tel:${siteConfig.contact.phoneHref}`}
                className="mt-1 block text-xl font-semibold text-accent underline-offset-4 hover:text-accent-hover hover:underline"
              >
                {siteConfig.contact.phone}
              </a>
            </div>

            {!konto && (
              <p className="mt-6 text-[0.95rem] text-text-muted">
                Sie haben schon ein Konto?{" "}
                <Link
                  href="/login?callbackUrl=/anfrage"
                  className="font-semibold text-accent hover:text-accent-hover"
                >
                  Anmelden
                </Link>{" "}
                – dann sind Ihre Daten schon eingetragen.
              </p>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
