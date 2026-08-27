import { z } from "zod";

export const anfrageSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Bitte Ihren Namen angeben.")
    .max(120, "Der Name ist zu lang."),
  email: z
    .string()
    .trim()
    .email("Bitte eine gültige E-Mail-Adresse angeben.")
    .max(200),
  beschreibung: z
    .string()
    .trim()
    .min(20, "Bitte beschreiben Sie das Vorhaben etwas ausführlicher (mind. 20 Zeichen).")
    .max(5000, "Bitte fassen Sie sich etwas kürzer (max. 5000 Zeichen)."),
  adresse: z
    .string()
    .trim()
    .min(5, "Bitte die vollständige Adresse des Objekts angeben.")
    .max(200),
  wunschtermin: z.string().trim().optional().or(z.literal("")),
  /**
   * Optionale Rückrufnummer. Bewusst großzügig geprüft: Menschen schreiben
   * Nummern als "0177 1234567", "+49 (0)2133 12345" oder "02133/12345".
   * Eine strenge Regel wirft hier nur echte Anfragen weg. Geprüft wird
   * deshalb nur: mindestens 7 Ziffern, keine unerwarteten Zeichen.
   * Lieber eine krumme Nummer annehmen als eine echte Anfrage abweisen.
   */
  telefon: z
    .string()
    .trim()
    .max(40, "Die Telefonnummer ist zu lang.")
    .refine(
      (wert) => wert === "" || /^[+()/\-.\s\d]*$/.test(wert),
      "Bitte nur Ziffern, Leerzeichen und + ( ) / - verwenden."
    )
    .refine(
      (wert) => wert === "" || (wert.match(/\d/g) ?? []).length >= 7,
      "Die Telefonnummer sieht unvollständig aus."
    )
    .optional()
    .or(z.literal("")),
  /**
   * URLs der bereits hochgeladenen Fotos. Der Upload läuft direkt vom Browser
   * zum Blob-Speicher; hier kommen nur noch die fertigen URLs an. Die
   * Host-Prüfung passiert serverseitig in der API-Route.
   */
  fotos: z.array(z.string().url()).max(5, "Maximal 5 Fotos pro Anfrage.").optional(),

  /**
   * Honigtopf. Das Feld ist für Menschen unsichtbar; Formular-Bots füllen
   * blind alles aus, was im HTML steht. Kommt hier etwas an, ist es kein
   * Mensch. Der Name klingt bewusst plausibel - "honeypot" würde erkannt.
   */
  webseite: z.string().max(200).optional(),
});

export type AnfrageInput = z.infer<typeof anfrageSchema>;

/** Grenzwerte, damit Formular und API dieselben Regeln verwenden. */
export const FOTO_LIMITS = {
  maxAnzahl: 5,
  maxBytes: 8 * 1024 * 1024, // 8 MB pro Foto
  erlaubteTypen: ["image/jpeg", "image/png", "image/webp", "image/heic"],
} as const;
