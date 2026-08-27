"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

/**
 * Meldet einen Seitenaufruf an die eigene Statistik.
 *
 * Übertragen wird ausschließlich der Pfad – keine Kennung, kein Cookie, kein
 * fremder Dienst. Deshalb braucht das weder Einwilligung noch Banner.
 *
 * `sendBeacon` statt `fetch`: der Browser stellt die Meldung auch dann zu,
 * wenn der Besucher im selben Moment weiterklickt. Ein normales fetch würde
 * dabei abgebrochen – und ausgerechnet die kurzen Besuche gingen verloren.
 */
export function Seitenzaehler() {
  const pfad = usePathname();
  const zuletzt = useRef<string | null>(null);

  useEffect(() => {
    if (!pfad || zuletzt.current === pfad) return;
    zuletzt.current = pfad;

    const nutzlast = JSON.stringify({ pfad });

    try {
      if (navigator.sendBeacon) {
        navigator.sendBeacon("/api/statistik", new Blob([nutzlast], { type: "application/json" }));
        return;
      }
      // Ältere Browser: stiller Nachbau, Fehler bewusst verschlucken.
      void fetch("/api/statistik", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: nutzlast,
        keepalive: true,
      }).catch(() => {});
    } catch {
      // Statistik darf die Seite unter keinen Umständen stören.
    }
  }, [pfad]);

  return null;
}
