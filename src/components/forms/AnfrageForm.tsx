"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { anfrageSchema, type AnfrageInput } from "@/lib/validations/anfrage";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { FotoUpload } from "@/components/forms/FotoUpload";

/** Vom Server gesetzt: ohne Blob-Token bleibt der Upload-Bereich aus, statt
 *  einen Knopf anzubieten, der zwangsläufig scheitert. */
const fotoUploadAktiv = process.env.NEXT_PUBLIC_FOTO_UPLOAD_AKTIV === "true";

interface AnfrageFormProps {
  /**
   * Kontodaten des angemeldeten Kunden. Sind sie gesetzt, entfallen Name und
   * E-Mail im Formular - danach fragt man niemanden, der gerade angemeldet ist.
   */
  konto?: { name: string; email: string } | null;
}

export function AnfrageForm({ konto = null }: AnfrageFormProps) {
  const router = useRouter();
  const [serverFehler, setServerFehler] = useState<string | null>(null);
  const [sendet, setSendet] = useState(false);
  const [fotos, setFotos] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AnfrageInput>({
    resolver: zodResolver(anfrageSchema),
    // Bei angemeldeten Kunden vorbelegen; der Server nimmt ohnehin die
    // Kontodaten, das hier ist nur für die clientseitige Prüfung.
    defaultValues: { name: konto?.name ?? "", email: konto?.email ?? "" },
  });

  async function onSubmit(daten: AnfrageInput) {
    setServerFehler(null);
    setSendet(true);

    try {
      const antwort = await fetch("/api/anfragen", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...daten, fotos }),
      });

      const ergebnis = await antwort.json().catch(() => ({}));

      if (!antwort.ok) {
        setServerFehler(ergebnis.error ?? "Die Anfrage konnte nicht gesendet werden.");
        setSendet(false);
        return;
      }

      router.push(konto ? "/konto?erfolg=1" : "/anfrage/gesendet");
      router.refresh();
    } catch (fehler) {
      console.error("Fehler beim Senden der Anfrage:", fehler);
      setServerFehler("Etwas ist schiefgelaufen. Bitte später erneut versuchen.");
      setSendet(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6" noValidate>
      {/*
        Honigtopf: für Menschen unsichtbar, für Formular-Bots verlockend.
        Kein display:none - manche Bots ignorieren ausgeblendete Felder
        gezielt. Stattdessen aus dem Sichtfeld geschoben und von
        Screenreadern sowie der Tabulatortaste ausgenommen.
      */}
      <div className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
        <label htmlFor="webseite">Webseite (bitte frei lassen)</label>
        <input id="webseite" type="text" tabIndex={-1} autoComplete="off" {...register("webseite")} />
      </div>

      {!konto && (
        <div className="grid gap-6 sm:grid-cols-2">
          <Input
            label="Ihr Name"
            autoComplete="name"
            placeholder="Vor- und Nachname"
            error={errors.name?.message}
            {...register("name")}
          />
          <Input
            label="E-Mail"
            type="email"
            autoComplete="email"
            placeholder="name@beispiel.de"
            error={errors.email?.message}
            {...register("email")}
          />
        </div>
      )}
      {konto && (
        <>
          <input type="hidden" {...register("name")} />
          <input type="hidden" {...register("email")} />
        </>
      )}

      <Textarea
        label="Worum geht es?"
        hinweis="Art des Vorhabens, ungefährer Umfang, Zeitrahmen. Je konkreter, desto genauer das Angebot."
        placeholder="z. B. Aufstockung eines Einfamilienhauses, Dachstuhl neu, ca. 90 m² …"
        error={errors.beschreibung?.message}
        {...register("beschreibung")}
      />
      <Input
        label="Adresse des Objekts"
        placeholder="Straße, Hausnummer, PLZ, Ort"
        autoComplete="street-address"
        error={errors.adresse?.message}
        {...register("adresse")}
      />

      {/*
        Ein Feld statt Feld plus Ankreuzkästchen: die Nummer selbst ist schon
        die Entscheidung. Ein zusätzliches "Bitte anrufen" wäre ein zweites
        Bedienelement für dieselbe Aussage.
      */}
      <Input
        label="Telefon für einen Rückruf (optional)"
        hinweis="Wenn Sie lieber angerufen als angeschrieben werden möchten. Am Telefon ist vieles in zwei Minuten geklärt."
        type="tel"
        inputMode="tel"
        autoComplete="tel"
        placeholder="z. B. 0177 1234567"
        error={errors.telefon?.message}
        {...register("telefon")}
      />
      <Input
        label="Wunschtermin für den Ortstermin (optional)"
        type="datetime-local"
        error={errors.wunschtermin?.message}
        {...register("wunschtermin")}
      />

      {fotoUploadAktiv && <FotoUpload werte={fotos} onChange={setFotos} disabled={sendet} />}

      {serverFehler && (
        <p
          role="alert"
          className="einblenden rounded-control border border-red-600/30 bg-red-600/[0.07] px-4 py-3 text-sm font-medium text-red-700 dark:text-red-400"
        >
          {serverFehler}
        </p>
      )}

      <Button type="submit" pending={sendet} pendingLabel="Wird gesendet …">
        Anfrage senden
      </Button>

      <p className="text-sm text-text-muted">
        Unverbindlich und kostenlos, kein Konto nötig. Wir melden uns in der Regel innerhalb eines
        Werktags. Ihre Angaben verwenden wir ausschließlich zur Bearbeitung dieser Anfrage.
      </p>
    </form>
  );
}
