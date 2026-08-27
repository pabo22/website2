"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { upload } from "@vercel/blob/client";
import { FOTO_LIMITS } from "@/lib/validations/anfrage";

interface FotoUploadProps {
  /** Bereits hochgeladene Foto-URLs */
  werte: string[];
  onChange: (urls: string[]) => void;
  disabled?: boolean;
}

/**
 * Optionaler Foto-Upload. Die Datei geht direkt vom Browser zum Blob-Speicher
 * (siehe /api/anfragen/upload), das Formular hält am Ende nur noch die URLs.
 *
 * Der Zustand ist bewusst dreiteilig: leer, lädt, Fehler. Ein Upload ohne
 * sichtbaren Ladezustand fühlt sich auf Mobilfunk kaputt an.
 */
export function FotoUpload({ werte, onChange, disabled = false }: FotoUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [laedt, setLaedt] = useState(false);
  const [fehler, setFehler] = useState<string | null>(null);

  const platzFrei = FOTO_LIMITS.maxAnzahl - werte.length;

  async function dateienWaehlen(event: React.ChangeEvent<HTMLInputElement>) {
    const dateien = Array.from(event.target.files ?? []);
    // Input sofort zurücksetzen, damit dieselbe Datei erneut wählbar bleibt
    event.target.value = "";
    if (dateien.length === 0) return;

    setFehler(null);

    if (dateien.length > platzFrei) {
      setFehler(`Es sind noch ${platzFrei} Foto(s) möglich.`);
      return;
    }

    const zuGross = dateien.find((datei) => datei.size > FOTO_LIMITS.maxBytes);
    if (zuGross) {
      setFehler(`"${zuGross.name}" ist größer als 8 MB.`);
      return;
    }

    setLaedt(true);
    try {
      const neue = await Promise.all(
        dateien.map(async (datei) => {
          const ergebnis = await upload(datei.name, datei, {
            access: "public",
            handleUploadUrl: "/api/anfragen/upload",
          });
          return ergebnis.url;
        })
      );
      onChange([...werte, ...neue]);
    } catch (error) {
      console.error("Foto-Upload fehlgeschlagen:", error);
      setFehler(
        "Der Upload hat nicht geklappt. Sie können die Anfrage trotzdem ohne Fotos senden."
      );
    } finally {
      setLaedt(false);
    }
  }

  function entfernen(url: string) {
    onChange(werte.filter((vorhanden) => vorhanden !== url));
  }

  return (
    <div className="flex flex-col gap-3">
      <span className="text-sm font-semibold text-text">Fotos (optional)</span>
      <p className="text-sm text-text-muted">
        Bis zu {FOTO_LIMITS.maxAnzahl} Bilder vom Objekt, je max. 8 MB. Ein Foto spart oft einen
        halben Ortstermin.
      </p>

      {werte.length > 0 && (
        <ul className="grid grid-cols-3 gap-3 sm:grid-cols-4">
          {werte.map((url) => (
            <li key={url} className="group relative aspect-square overflow-hidden rounded-control border border-border bg-surface-sunken">
              <Image src={url} alt="" fill sizes="120px" className="object-cover" />
              <button
                type="button"
                onClick={() => entfernen(url)}
                className="absolute right-1 top-1 inline-flex h-8 w-8 items-center justify-center rounded-full bg-text/80 text-sm text-background transition-transform duration-150 ease-out active:scale-[0.9]"
              >
                <span className="sr-only">Foto entfernen</span>
                <span aria-hidden="true">✕</span>
              </button>
            </li>
          ))}
        </ul>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={FOTO_LIMITS.erlaubteTypen.join(",")}
        multiple
        onChange={dateienWaehlen}
        className="sr-only"
        id="foto-upload"
      />

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={disabled || laedt || platzFrei <= 0}
        className="press inline-flex min-h-11 w-full items-center justify-center rounded-control border border-dashed border-border px-6 text-base font-medium text-text-muted hover:border-accent hover:text-accent disabled:pointer-events-none disabled:opacity-50"
      >
        {laedt
          ? "Wird hochgeladen …"
          : platzFrei <= 0
            ? "Maximale Anzahl erreicht"
            : "Fotos auswählen"}
      </button>

      {fehler && (
        <p role="alert" className="text-sm font-medium text-red-700 dark:text-red-400">
          {fehler}
        </p>
      )}
    </div>
  );
}
