"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { STATUS, STATUS_SCHLUESSEL } from "@/lib/anfrage-status";

/**
 * Status einer Anfrage ändern. Optimistisches Update: die Auswahl steht
 * sofort, der Server zieht nach. Ein Select, das erst nach dem Roundtrip
 * umspringt, fühlt sich kaputt an.
 */
export function StatusWaehler({ id, status }: { id: string; status: string }) {
  const router = useRouter();
  const [wert, setWert] = useState(status);
  const [fehler, setFehler] = useState(false);
  const [laeuft, startTransition] = useTransition();

  async function aendern(neu: string) {
    const vorher = wert;
    setWert(neu);
    setFehler(false);

    const antwort = await fetch("/api/admin/status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status: neu }),
    }).catch(() => null);

    if (!antwort?.ok) {
      setWert(vorher);
      setFehler(true);
      return;
    }

    startTransition(() => router.refresh());
  }

  return (
    <div className="flex items-center gap-2">
      <label className="sr-only" htmlFor={`status-${id}`}>
        Bearbeitungsstand
      </label>
      <select
        id={`status-${id}`}
        value={wert}
        disabled={laeuft}
        onChange={(event) => aendern(event.target.value)}
        className="min-h-11 rounded-control border border-border bg-surface px-3 text-sm font-medium text-text"
      >
        {STATUS_SCHLUESSEL.map((schluessel) => (
          <option key={schluessel} value={schluessel}>
            {STATUS[schluessel]}
          </option>
        ))}
      </select>
      {fehler && (
        <span role="alert" className="text-sm text-red-700 dark:text-red-400">
          Nicht gespeichert
        </span>
      )}
    </div>
  );
}
