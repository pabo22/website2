import nodemailer from "nodemailer";
import { siteConfig } from "./site-config";

/**
 * SMTP statt eines einzelnen Anbieters (Resend, Postmark ...), damit der
 * Betrieb sein eigenes Postfach eintragen kann - kein zusätzlicher Account,
 * kein Vendor-Lock-in. Zugangsdaten kommen ausschließlich aus der Umgebung.
 */
function getTransporter() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD } = process.env;

  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASSWORD) {
    throw new Error(
      "SMTP-Umgebungsvariablen fehlen. Bitte SMTP_HOST, SMTP_PORT, SMTP_USER und SMTP_PASSWORD in .env setzen."
    );
  }

  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    // Port 465 spricht direkt TLS, 587 startet mit STARTTLS
    secure: Number(SMTP_PORT) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASSWORD },
  });
}

interface AnfrageMail {
  kundeName: string;
  kundeEmail: string;
  beschreibung: string;
  adresse: string;
  wunschtermin?: string | null;
  telefon?: string | null;
  fotos?: readonly string[];
}

function fotoZeilen(fotos?: readonly string[]) {
  if (!fotos || fotos.length === 0) return [];
  return ["", `Fotos (${fotos.length}):`, ...fotos.map((url) => `  ${url}`)];
}

/** Benachrichtigt den Betrieb über eine neue Anfrage. */
export async function sendeAnfrageBenachrichtigung(input: AnfrageMail) {
  const transporter = getTransporter();

  await transporter.sendMail({
    from: `"${siteConfig.legalName}" <${process.env.SMTP_USER}>`,
    to: siteConfig.notificationEmail,
    // Antwort geht direkt an den Kunden statt an das eigene Postfach
    replyTo: input.kundeEmail,
    // Rückrufwunsch gehört in die Betreffzeile: der Betrieb sieht am Handy
    // sofort, ob die Anfrage einen Anruf braucht, ohne die Mail zu öffnen.
    subject: input.telefon
      ? `Neue Bauanfrage von ${input.kundeName} - Rückruf erbeten`
      : `Neue Bauanfrage von ${input.kundeName}`,
    text: [
      "Über die Website ist eine neue Anfrage eingegangen.",
      "",
      input.telefon ? `>> RÜCKRUF ERBETEN: ${input.telefon}` : null,
      input.telefon ? "" : null,
      `Name:    ${input.kundeName}`,
      `E-Mail:  ${input.kundeEmail}`,
      input.telefon ? `Telefon: ${input.telefon}` : null,
      `Objekt:  ${input.adresse}`,
      input.wunschtermin ? `Termin:  ${input.wunschtermin}` : null,
      "",
      "Beschreibung:",
      input.beschreibung,
      ...fotoZeilen(input.fotos),
    ]
      .filter((zeile) => zeile !== null)
      .join("\n"),
  });
}

/** Bestätigt dem Kunden den Eingang seiner Anfrage. */
export async function sendeAnfrageBestaetigung(input: AnfrageMail) {
  const transporter = getTransporter();

  await transporter.sendMail({
    from: `"${siteConfig.legalName}" <${process.env.SMTP_USER}>`,
    to: input.kundeEmail,
    subject: `Ihre Anfrage bei ${siteConfig.name} ist eingegangen`,
    text: [
      `Hallo ${input.kundeName},`,
      "",
      "vielen Dank für Ihre Anfrage. Wir melden uns in der Regel innerhalb",
      input.telefon
        ? "eines Werktags telefonisch bei Ihnen."
        : "eines Werktags persönlich bei Ihnen.",
      "",
      "Ihre Angaben:",
      `Objekt: ${input.adresse}`,
      input.telefon ? `Rückruf an: ${input.telefon}` : null,
      input.wunschtermin ? `Wunschtermin: ${input.wunschtermin}` : null,
      "",
      input.beschreibung,
      ...fotoZeilen(input.fotos),
      "",
      "Mit freundlichen Grüßen",
      siteConfig.legalName,
      siteConfig.contact.address,
      siteConfig.contact.phone,
    ]
      .filter((zeile) => zeile !== null)
      .join("\n"),
  });
}

interface Monatsbericht {
  monat: string;
  anfragen: number;
  aufrufe: number;
  /** Vormonat zum Vergleich, oder null wenn es noch keinen gibt. */
  anfragenVormonat: number | null;
  offen: number;
  topSeiten: ReadonlyArray<{ pfad: string; aufrufe: number }>;
}

/**
 * Kurzer Monatsbericht an den Betrieb.
 *
 * Bewusst nüchtern und ohne Diagramme: Das wird auf dem Handy gelesen,
 * oft auf der Baustelle. Vier Zeilen, die man im Gehen erfasst, sind mehr
 * wert als eine gestaltete Auswertung, die niemand öffnet.
 */
export async function sendeMonatsbericht(bericht: Monatsbericht) {
  const transporter = getTransporter();
  const zahl = new Intl.NumberFormat("de-DE");

  let vergleich: string | null = null;
  if (bericht.anfragenVormonat !== null) {
    const differenz = bericht.anfragen - bericht.anfragenVormonat;
    if (differenz > 0) vergleich = `${differenz} mehr als im Vormonat`;
    else if (differenz < 0) vergleich = `${Math.abs(differenz)} weniger als im Vormonat`;
    else vergleich = "genauso viele wie im Vormonat";
  }

  await transporter.sendMail({
    from: `"${siteConfig.legalName}" <${process.env.SMTP_USER}>`,
    to: siteConfig.notificationEmail,
    subject: `Website ${bericht.monat}: ${bericht.anfragen} Anfrage${
      bericht.anfragen === 1 ? "" : "n"
    }`,
    text: [
      `Auswertung für ${bericht.monat}`,
      "",
      `Anfragen:       ${zahl.format(bericht.anfragen)}${vergleich ? ` (${vergleich})` : ""}`,
      `Seitenaufrufe:  ${zahl.format(bericht.aufrufe)}`,
      `Noch offen:     ${zahl.format(bericht.offen)}`,
      "",
      bericht.topSeiten.length > 0 ? "Meistbesuchte Seiten (30 Tage):" : null,
      ...bericht.topSeiten.map(
        (s) => `  ${s.pfad.padEnd(20)} ${zahl.format(s.aufrufe)}`
      ),
      "",
      "Alle Anfragen und die vollständige Auswertung:",
      `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/admin`,
      "",
      "Diese Auswertung entsteht ohne Cookies und ohne Fremdanbieter.",
    ]
      .filter((zeile) => zeile !== null)
      .join("\n"),
  });
}
