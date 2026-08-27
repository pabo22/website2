/**
 * SITE-KONFIGURATION – IS-Bau GmbH
 * --------------------------------
 * Zusammen mit src/styles/design-tokens.css die zentrale Stelle für alle
 * kundenspezifischen Inhalte. Wer die Seite pflegt, muss idealerweise nur
 * diese beiden Dateien anfassen.
 *
 * ACHTUNG: Alle mit "BITTE PRÜFEN" markierten Werte vor dem Go-Live
 * verifizieren – sie stammen nicht aus einer amtlichen Quelle.
 */

export const siteConfig = {
  name: "IS-Bau",
  legalName: "IS-Bau GmbH",
  claim: "Vom Fundament bis zum Dachstuhl.",
  kurzbeschreibung:
    "Rohbau, Zimmerei und schlüsselfertige Sanierung aus einer Hand – geplant, berechnet und gebaut von IS-Bau in Dormagen.",

  contact: {
    // Öffentlich sichtbare Adresse (Kontaktseite, Footer, Impressum).
    // TODO: auf die echte Firmenadresse umstellen – aktuell Testwert.
    email: "paul@bouwer.de",
    phone: "+49 151 51102421",
    /** tel:-Link ohne Leerzeichen, damit Smartphones sauber wählen */
    phoneHref: "+4915151102421",
    street: "Ostpreußenallee 20",
    zip: "41539",
    city: "Dormagen",
    address: "Ostpreußenallee 20, 41539 Dormagen",
  },

  /**
   * Empfänger der Anfrage-Benachrichtigungen (siehe src/lib/mail.ts).
   * Absichtlich getrennt von contact.email: die öffentliche Adresse darf eine
   * andere sein als das Postfach, in dem die Anfragen landen.
   * AKTUELL: Testadresse. Vor der Übergabe auf s.islek@is-bau.com umstellen.
   */
  notificationEmail: "paul@bouwer.de",

  /** Einzugsgebiet – für Texte und das LocalBusiness-Schema */
  einzugsgebiet: ["Dormagen", "Neuss", "Köln", "Düsseldorf", "Rhein-Kreis Neuss"],

  /**
   * WhatsApp-Nummer im internationalen Format ohne Pluszeichen und Leerzeichen.
   * Leer lassen blendet den WhatsApp-Knopf überall aus – kein toter Link,
   * wenn der Betrieb das nicht nutzen möchte.
   * Beispiel für +49 151 51102421: "4915151102421"
   */
  whatsapp: "",

  /**
   * Öffnungszeiten für die Erreichbarkeitsanzeige und das LocalBusiness-Schema.
   * `tag`: 0 = Sonntag … 6 = Samstag. Fehlt ein Tag, gilt er als geschlossen.
   * Zeiten in Ortszeit (Europe/Berlin).
   * BITTE PRÜFEN: mit dem Betrieb abgleichen, das sind angenommene Bürozeiten.
   */
  oeffnungszeiten: [
    { tag: 1, von: "07:00", bis: "17:00" },
    { tag: 2, von: "07:00", bis: "17:00" },
    { tag: 3, von: "07:00", bis: "17:00" },
    { tag: 4, von: "07:00", bis: "17:00" },
    { tag: 5, von: "07:00", bis: "15:00" },
  ],

  /**
   * Häufige Fragen. Werden zusätzlich als FAQPage ausgezeichnet, damit Google
   * die Antworten direkt im Suchergebnis anzeigen kann.
   *
   * WICHTIG: keine Preise und keine Fristen zusagen, die der Betrieb nicht
   * halten kann – die Antworten sind öffentlich und werden zitiert.
   */
  faq: [
    {
      frage: "Was kostet ein Rohbau?",
      antwort:
        "Seriös lässt sich das erst nach einem Blick auf Grundstück und Planung sagen. Die Spanne hängt an Bodenverhältnissen, Kellerausführung, Geschosszahl und Ausstattung. Wir schauen uns das Vorhaben an und legen die Kosten dann nach Positionen offen, statt eine Zahl zu nennen, die später nicht hält.",
    },
    {
      frage: "Wie schnell bekomme ich eine Rückmeldung?",
      antwort:
        "In der Regel innerhalb eines Werktags. Wer eine Telefonnummer hinterlässt, wird angerufen – am Telefon ist vieles in zwei Minuten geklärt.",
    },
    {
      frage: "Übernehmen Sie auch die Bauleitung?",
      antwort:
        "Ja. Auf Wunsch übernehmen wir das gesamte Vorhaben als Generalunternehmer: ein Vertrag, ein Ansprechpartner, ein Terminplan. Wir koordinieren alle Gewerke und haften für das Gesamtergebnis.",
    },
    {
      frage: "Machen Sie auch die Statik?",
      antwort:
        "Statische Berechnungen und Ausführungsplanung entstehen bei uns im Haus. Das ist der Grund, warum Rückfragen von der Baustelle bei uns eine Tür weiter geklärt werden statt eine Woche später.",
    },
    {
      frage: "In welchem Umkreis arbeiten Sie?",
      antwort:
        "Schwerpunkt ist der Rhein-Kreis Neuss mit Dormagen und Neuss, dazu Köln und Düsseldorf. Bei größeren Vorhaben sprechen Sie uns auch außerhalb gerne an.",
    },
    {
      frage: "Brauche ich für einen Umbau eine Baugenehmigung?",
      antwort:
        "Das hängt vom Eingriff ab: Wer tragende Wände verändert, aufstockt oder anbaut, braucht in der Regel eine Genehmigung. Reine Instandsetzung meist nicht. Wir sagen Ihnen beim Ortstermin, was in Ihrem Fall nötig ist.",
    },
  ],

  legal: {
    geschaeftsfuehrer: "Sener Islek",
    registernummer: "HRB 13123",
    /** BITTE PRÜFEN: exakte Gerichtsbezeichnung aus dem Registerauszug */
    registergericht: "Amtsgericht Neuss",
    registerId: "DER1102",
    /** BITTE ERGÄNZEN */
    ustId: "[USt-IdNr. ergänzen]",
  },

  /**
   * Leistungen. `span` steuert die Kachelbreite im Bento-Grid auf großen
   * Viewports (Grundraster: 6 Spalten). Die Summe pro Zeile muss 6 ergeben,
   * damit keine leeren Zellen entstehen.
   * `bild` ist bewusst nur auf einzelnen Kacheln gesetzt, damit das Raster
   * Rhythmus bekommt statt acht identischer Karten.
   */
  leistungen: [
    {
      slug: "rohbau",
      titel: "Rohbau in Massivbauweise",
      beschreibung:
        "Fundament, Keller, tragende Wände, Decken. Wir stellen den Rohbau her, auf dem alles Weitere aufbaut.",
      span: 3,
      bild: {
        src: "https://images.unsplash.com/photo-1508450859948-4e04fabaa4ea?w=1200&q=70&fm=jpg&fit=crop",
        alt: "Rohbau eines Gebäudes aus Beton während der Bauphase",
      },
    },
    {
      slug: "beton",
      titel: "Beton- und Stahlbetonbau",
      beschreibung:
        "Schalung, Bewehrung, Betonage. Bodenplatten, Decken, Stützen und Wände nach Ausführungsplanung.",
      span: 3,
    },
    {
      slug: "zimmerei",
      titel: "Zimmererarbeiten und Dachstuhl",
      beschreibung:
        "Dachstühle, Aufstockungen und Holzkonstruktionen – abgebunden und montiert vom eigenen Gewerk.",
      span: 2,
      bild: {
        src: "https://images.unsplash.com/photo-1676802037786-3697d60497ae?w=1000&q=70&fm=jpg&fit=crop",
        alt: "Holzkonstruktion eines Dachstuhls im Rohbau",
      },
    },
    {
      slug: "sanierung",
      titel: "Umbau und Sanierung als Generalunternehmer",
      beschreibung:
        "Ein Vertrag, ein Ansprechpartner, ein Terminplan. Wir koordinieren alle Gewerke und haften für das Gesamtergebnis.",
      span: 4,
      hervorgehoben: true,
    },
    {
      slug: "verblend",
      titel: "Maurer- und Verblendarbeiten",
      beschreibung:
        "Tragendes Mauerwerk und Sichtmauerwerk. Fugenbild und Verband so, dass die Fassade in dreißig Jahren noch stimmt.",
      span: 3,
      bild: {
        src: "https://images.unsplash.com/photo-1704005445445-2747074be8ac?w=1200&q=70&fm=jpg&fit=crop",
        alt: "Maurer verarbeitet Mörtel an einer Ziegelwand",
      },
    },
    {
      slug: "planung",
      titel: "Bauplanung und Statik",
      beschreibung:
        "Statische Berechnungen und Ausführungsplanung im Haus. Kurze Wege zwischen Büro und Baustelle.",
      span: 3,
    },
    {
      slug: "bauleitung",
      titel: "Bauleitung",
      beschreibung:
        "Termine, Gewerke, Qualität und Abnahme. Sie bekommen einen festen Ansprechpartner statt einer Telefonliste.",
      span: 3,
    },
    {
      slug: "ausbau",
      titel: "Putz- und Trockenbauarbeiten",
      beschreibung:
        "Innen- und Außenputz, Trockenbauwände und Decken – der saubere Übergang vom Rohbau zum fertigen Raum.",
      span: 3,
    },
  ],

  /**
   * Argumente für das dunkle Band unter dem Hero. Bewusst faktisch gehalten
   * (abgeleitet aus dem Gesellschaftszweck), keine Werbefloskeln.
   */
  versprechen: [
    {
      titel: "Planung, Statik und Ausführung im Haus",
      text: "Berechnung und Baustelle sprechen dieselbe Sprache. Das spart Rückfragen und Nachträge.",
    },
    {
      titel: "Generalunternehmer für Umbau und Sanierung",
      text: "Ein Vertragspartner für alle Gewerke. Sie koordinieren nicht, Sie entscheiden.",
    },
    {
      titel: "Rohbau, Zimmerei und Ausbau",
      text: "Vom Fundament bis zum Putz aus einer Hand, ohne Reibungsverluste zwischen Firmen.",
    },
  ],

  ablauf: [
    {
      schritt: "1",
      titel: "Anfrage stellen",
      beschreibung: "Beschreiben Sie Ihr Vorhaben online. Zwei Minuten, unverbindlich, jederzeit.",
    },
    {
      schritt: "2",
      titel: "Ortstermin",
      beschreibung: "Wir sehen uns das Objekt an und klären Umfang, Statik und mögliche Termine.",
    },
    {
      schritt: "3",
      titel: "Schriftliches Angebot",
      beschreibung: "Sie erhalten ein Angebot mit klaren Positionen, Terminen und Zahlungsplan.",
    },
  ],

  bilder: {
    hero: {
      src: "https://images.unsplash.com/photo-1512207736890-6ffed8a84e8d?w=1800&q=72&fm=jpg&fit=crop",
      alt: "Bauarbeiter auf einer Betonbaustelle im Rohbau",
    },
    bauleitung: {
      src: "https://images.unsplash.com/photo-1769284013173-47150b8c7e51?w=1400&q=72&fm=jpg&fit=crop",
      alt: "Rohbau mit Schalung, Bewehrung und Betonkonstruktionen",
    },
  },
} as const;
