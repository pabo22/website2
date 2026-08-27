"use client";

import { useEffect, useState } from "react";
import { pruefeErreichbarkeit } from "@/lib/erreichbarkeit";

/**
 * Zeigt an, ob der Betrieb gerade ans Telefon geht.
 *
 * Bewusst erst nach der Hydration: Server und Browser können in
 * unterschiedlichen Sekunden rechnen, und ein vorgerenderter Status wäre auf
 * einer statisch ausgelieferten Seite ohnehin eingefroren. Bis dahin bleibt
 * die Stelle leer statt falsch.
 *
 * Der farbige Punkt ist hier ausnahmsweise berechtigt: er zeigt einen echten,
 * wechselnden Zustand an - nicht Dekoration.
 */
export function Erreichbarkeit({ className = "" }: { className?: string }) {
  const [status, setStatus] = useState<{ offen: boolean; text: string } | null>(null);

  useEffect(() => {
    const aktualisieren = () => setStatus(pruefeErreichbarkeit());
    aktualisieren();

    // Einmal pro Minute nachrechnen, damit der Status nicht stehen bleibt,
    // wenn jemand die Seite lange offen hat.
    const uhr = setInterval(aktualisieren, 60_000);
    return () => clearInterval(uhr);
  }, []);

  if (!status || !status.text) return null;

  return (
    <span className={`inline-flex items-center gap-2 text-[0.95rem] ${className}`}>
      <span
        aria-hidden="true"
        className={`h-2 w-2 shrink-0 rounded-full ${
          status.offen ? "bg-emerald-600 dark:bg-emerald-400" : "bg-text-muted"
        }`}
      />
      <span className={status.offen ? "font-medium text-text" : "text-text-muted"}>
        {status.text}
      </span>
    </span>
  );
}
