# IS-Bau GmbH – Website

Vollständige Website für die IS-Bau GmbH, Dormagen: öffentliche Seiten,
Kundenkonto, Anfrageformular mit optionalem Foto-Upload, E-Mail-Benachrichtigung
und ein interner Bereich zur Verwaltung der Anfragen.

---

## Tech-Stack

| Bereich       | Technologie                                  | Warum                                                         |
| ------------- | -------------------------------------------- | ------------------------------------------------------------- |
| Framework     | Next.js 15 (App Router) + React 19            | Läuft auf Vercel, Netlify, Render und jedem VPS                |
| Sprache       | TypeScript                                    | Fehler fallen beim Build auf, nicht beim Kunden                |
| Styling       | Tailwind CSS 3 + CSS-Variablen                | Farbwelt an einer Stelle austauschbar                          |
| Datenbank     | PostgreSQL + Prisma                           | Überall verfügbar, kostenlose Tarife bei Neon/Supabase         |
| Anmeldung     | NextAuth (Auth.js v4), E-Mail + Passwort      | Keine Fremdanbieter, keine laufenden Kosten                    |
| E-Mail        | Nodemailer 9 über SMTP                        | Jedes beliebige Postfach nutzbar, kein Vendor-Lock-in          |
| Foto-Upload   | Vercel Blob (optional)                        | Umgeht das 4,5-MB-Limit von Serverless-Funktionen              |

Keine exotischen Abhängigkeiten, keine Webfonts von Fremdservern, kein Tracking.

---

## Projektstruktur

```
prisma/
  schema.prisma            Datenmodell (User, Anfrage)
public/
  marke/                   Logo hell + dunkel
src/
  app/
    (marketing)/           Öffentliche Seiten: Start, Leistungen, Über uns,
                           Kontakt, Anfrage, Impressum, Datenschutz
    icon.png               Favicon und App-Icon (aus dem Logo erzeugt)
    opengraph-image.png    Vorschaubild beim Teilen (WhatsApp, LinkedIn ...)
    sitemap.ts robots.ts   Werden als /sitemap.xml und /robots.txt ausgeliefert
    not-found.tsx          Gestaltete 404-Seite
    (auth)/                Anmelden, Registrieren
    (kunde)/konto/         Geschützter Kundenbereich
    admin/                 Interner Bereich (Passwort aus der Umgebung)
    api/                   Serverendpunkte (Anfragen, Registrierung, Admin)
  components/
    layout/                Navigation, Footer, Logo, Abschnitte, Animation
    ui/                    Button, Input, Textarea
    forms/                 Anfrage-, Login-, Registrierungsformular, Foto-Upload
  lib/
    site-config.ts         >> ALLE INHALTE UND FIRMENDATEN <<
    auth.ts, db.ts, mail.ts, admin-auth.ts, anfrage-status.ts
    validations/           Zod-Schemas (Client und Server teilen sich die Regeln)
  styles/
    design-tokens.css      >> ALLE FARBEN <<
```

**Merksatz für spätere Anpassungen:** Inhalte stehen in
`src/lib/site-config.ts`, Farben in `src/styles/design-tokens.css`. Für die
meisten Änderungen reichen diese zwei Dateien.

---

## Lokal starten

Voraussetzung: Node.js 20.9 oder neuer (`node -v` prüfen).

```bash
# 1. Abhängigkeiten installieren
npm install

# 2. Einrichtung. Legt die .env an, erzeugt NEXTAUTH_SECRET, prüft die
#    Datenbankadresse, erzeugt den Prisma Client und legt die Tabellen an.
npm run setup

# 3. Falls setup nach der DATABASE_URL fragt: eintragen und setup erneut
npm run setup

# 4. Entwicklungsserver starten
npm run dev
```

`npm run setup` ist absichtlich mehrfach ausführbar. Es überschreibt nichts,
was schon gesetzt ist, und bricht mit einer Klartext-Meldung ab, statt einen
Prisma-Fehlercode auszugeben. Nach einer Änderung am Datenmodell (`schema.prisma`)
genügt derselbe Befehl, um die Datenbank nachzuziehen.

Die Seite läuft danach unter <http://localhost:3000>.

Zwei nützliche Zusatzbefehle:

```bash
npm run typecheck   # findet Tippfehler im Code, ohne zu bauen
npm run build       # prüft, ob ein Produktions-Build durchläuft
```

### Warum hier nirgends `npx prisma` steht

`npx prisma …` lädt die **neueste** Prisma-Version aus dem Netz, sobald sie
lokal nicht gefunden wird. Aktuell steht dort ein Release Candidate von
Prisma 8, in dem der Befehl `migrate` in `migration` umbenannt wurde – die
Folge ist die Fehlermeldung *„No command registered for `migrate`"*.

Die `npm run …`-Skripte benutzen immer die im Projekt festgelegte Version aus
`node_modules`. Deshalb stehen in dieser Anleitung ausschließlich sie.

### Kostenlose Datenbank in zwei Minuten

1. Konto bei [neon.tech](https://neon.tech) oder [supabase.com](https://supabase.com) anlegen
2. Neues Projekt erstellen, Region Frankfurt wählen
3. Den angezeigten Connection String kopieren und als `DATABASE_URL` in die `.env` eintragen

> **Prisma nicht aktualisieren.** Beim Ausführen zeigt Prisma einen Kasten
> „Update available 6.19.3 → 8.0.0-rc.11" mit einem Upgrade-Befehl. Diesen
> Befehl **nicht** ausführen: Bei `8.0.0-rc.11` handelt es sich um einen
> Release Candidate mit umbenannten Befehlen. Der Hinweis ist reine Werbung
> und kann ignoriert werden.

---

## Umgebungsvariablen

| Variable                       | Pflicht | Bedeutung                                                          |
| ------------------------------ | ------- | ------------------------------------------------------------------ |
| `DATABASE_URL`                 | ja      | PostgreSQL-Verbindung                                              |
| `NEXTAUTH_SECRET`              | ja      | Signiert die Sessions. Erzeugen: `openssl rand -base64 32`         |
| `NEXTAUTH_URL`                 | ja      | Lokal `http://localhost:3000`, live die echte Domain mit `https://` |
| `ADMIN_PASSWORD`               | ja      | Zugang zu `/admin`                                                 |
| `SMTP_HOST` `SMTP_PORT` `SMTP_USER` `SMTP_PASSWORD` | ja | E-Mail-Versand                             |
| `NEXT_PUBLIC_SITE_URL`         | nein    | Für korrekte Vorschaubilder beim Teilen                            |
| `BLOB_READ_WRITE_TOKEN`        | nein    | Foto-Upload (Vercel Blob)                                          |
| `NEXT_PUBLIC_FOTO_UPLOAD_AKTIV`| nein    | `"true"` blendet den Upload-Bereich ein                            |

Ohne die beiden Blob-Variablen funktioniert alles außer dem Foto-Upload –
der Bereich wird dann einfach nicht angezeigt.

---

## Wo der Betrieb die Anfragen sieht

Drei Wege, alle unabhängig voneinander:

1. **E-Mail** – bei jeder neuen Anfrage geht automatisch eine Nachricht an die
   in `site-config.ts` hinterlegte `notificationEmail`. Antworten landen direkt
   beim Kunden, weil `Reply-To` gesetzt ist.
2. **Interner Bereich** unter `/admin` – Anmeldung mit `ADMIN_PASSWORD`.
   Zeigt alle Anfragen, Fotos und Kontaktdaten und erlaubt es, den
   Bearbeitungsstand zu setzen (Neu → In Bearbeitung → Angebot versendet → Erledigt).
3. **Prisma Studio** – `npm run prisma:studio` öffnet eine Weboberfläche direkt
   auf der Datenbank. Nur für den Notfall bzw. Datenexport gedacht.

### Anfragen ohne Kundenkonto

Das Anfrageformular liegt öffentlich unter `/anfrage`. Wer nur wissen will, was
etwas kostet, muss sich **nicht** registrieren – ein Registrierungszwang vor dem
ersten Kontakt kostet erfahrungsgemäß den Großteil der Interessenten.

- Gäste geben Name und E-Mail direkt im Formular an
- Angemeldete Kunden sehen diese beiden Felder nicht; die Daten kommen aus dem
  Konto und lassen sich über das Formular auch nicht überschreiben
- Die Kontaktdaten stehen immer am Anfragedatensatz, nicht nur über die
  Relation. Löscht ein Kunde sein Konto, bleibt die Anfrage vollständig
  (`onDelete: SetNull`)
- Das Kundenkonto bleibt bestehen, ist aber freiwillig: es dient dazu, eigene
  Anfragen und deren Bearbeitungsstand unter `/konto` einzusehen

### Statistik ohne Cookies

Unter `/admin/statistik` sieht der Betrieb Anfragen je Monat, Seitenaufrufe und
die meistbesuchten Seiten.

Gespeichert wird ausschließlich **Pfad, Tag und Anzahl** – keine IP, kein Cookie,
keine Besucherkennung, kein Fremdanbieter. Damit ist die Auswertung nicht
personenbezogen: kein Einwilligungsbanner nötig. Die IP wird nur flüchtig für die
Missbrauchsbremse ausgewertet und nie geschrieben.

Was das kann: „Wie viele Aufrufe hatte /leistungen im Oktober?"
Was das nicht kann: einzelne Besucher verfolgen. Genau so ist es gewollt.

### Monatsbericht

Jeden 1. um 06:00 UTC geht eine kurze Auswertung des Vormonats an
`notificationEmail`: Anfragen, Vergleich zum Vormonat, Seitenaufrufe, offene
Vorgänge, meistbesuchte Seiten.

Dafür muss `CRON_SECRET` gesetzt sein – ohne diesen Wert antwortet die Route mit
501 und lässt sich von außen nicht auslösen. Der Zeitplan steht in `vercel.json`.
Bei anderen Hostern übernimmt ein beliebiger Cron-Dienst den Aufruf:

```
curl -H "Authorization: Bearer $CRON_SECRET" https://ihre-domain.de/api/berichte/monat
```

Warum das drin ist: Hosting ohne sichtbares Ergebnis fühlt sich für den Kunden
wie eine Rechnung ohne Gegenleistung an. Einmal im Monat schwarz auf weiß, was
die Seite gebracht hat, beantwortet die Frage, bevor sie gestellt wird.

### Erreichbarkeit, WhatsApp und FAQ

- **Öffnungszeiten** stehen in `site-config.ts` und speisen zwei Dinge: die
  Anzeige „Bis 17:00 erreichbar" und das `openingHoursSpecification` im
  LocalBusiness-Schema, aus dem Google sein „Jetzt geöffnet" bildet. Gerechnet
  wird immer in Europe/Berlin, nicht in der Zeitzone des Besuchers.
- **WhatsApp**: Nummer in `site-config.ts` eintragen (international, ohne Plus
  und Leerzeichen). Bleibt das Feld leer, verschwindet der Knopf überall –
  lieber kein Knopf als einer, der ins Leere führt.
- **FAQ** unter `/faq`, zusätzlich als `FAQPage` ausgezeichnet. Google kann die
  Antworten damit direkt im Suchergebnis anzeigen. Beim Ergänzen gilt: keine
  Preise und keine Fristen zusagen, die der Betrieb nicht halten kann – die
  Antworten sind öffentlich und werden zitiert.

### Spam-Schutz

Zwei Maßnahmen, bewusst ohne Google reCAPTCHA (das wäre ein zusätzliches
Datenschutzthema und ein weiterer Drittanbieter):

1. **Honigtopf** – ein für Menschen unsichtbares Feld im Formular. Füllt es
   jemand aus, war es ein Bot. Die Antwort lautet dann trotzdem „gespeichert",
   damit der Bot die Falle nicht bemerkt, gespeichert wird aber nichts.
2. **Zugriffsbremse pro IP** (`src/lib/rate-limit.ts`) – 5 Anfragen/Stunde,
   5 Registrierungen/Stunde, 10 Admin-Loginversuche/15 Minuten.

Die Bremse zählt im Arbeitsspeicher. Auf Vercel laufen mehrere Instanzen
nebeneinander, jede zählt für sich – gegen Alltags-Spam reicht das, gegen einen
entschlossenen Angreifer nicht. Für echten Schutz gehört eine Firewall-Regel
des Hosters davor (Vercel: Settings → Security).

### Rückrufwunsch

Im Anfrageformular kann der Kunde optional eine Telefonnummer hinterlassen.
Ist sie gesetzt, wertet die Anwendung das als ausdrücklichen Rückrufwunsch:

- die Benachrichtigungs-E-Mail trägt „Rückruf erbeten" **im Betreff**, damit
  der Betrieb es am Handy sieht, ohne die Mail zu öffnen
- im Admin-Bereich erscheint die Nummer als antippbare Anruf-Schaltfläche
- die Eingangsbestätigung an den Kunden kündigt entsprechend einen Anruf
  statt einer schriftlichen Antwort an

Ein zusätzliches Ankreuzfeld „Bitte anrufen" gibt es bewusst nicht: die
Nummer selbst ist bereits die Entscheidung.

Der Kunde selbst sieht seine eigenen Anfragen unter `/konto`.

---

## Foto-Upload einrichten (optional)

1. Auf [vercel.com](https://vercel.com) im Projekt auf **Storage → Create → Blob**
2. Den erzeugten `BLOB_READ_WRITE_TOKEN` in die Umgebungsvariablen eintragen
3. Zusätzlich `NEXT_PUBLIC_FOTO_UPLOAD_AKTIV="true"` setzen
4. Neu deployen

Grenzen sind in `src/lib/validations/anfrage.ts` konfiguriert: maximal 5 Fotos,
je 8 MB, JPEG/PNG/WebP/HEIC.

---

## Deployment

### Variante A: Vercel (empfohlen, schnellster Weg)

1. Projekt zu GitHub pushen
2. Auf vercel.com **Add New → Project** und das Repository auswählen
3. Unter **Environment Variables** alle Pflicht-Variablen eintragen
   (`NEXTAUTH_URL` = die spätere echte Domain)
4. **Deploy**

Die Datei `vercel.json` ist bereits enthalten. Der Build-Befehl führt
`prisma migrate deploy` aus, die Tabellen entstehen also automatisch.

### Variante B: Eigener Server / VPS (Docker)

```bash
docker build -t is-bau-website .
docker run -p 3000:3000 --env-file .env is-bau-website
```

Das `Dockerfile` nutzt den `standalone`-Build von Next.js, das Image bleibt
dadurch klein. Davor gehört ein Reverse-Proxy (nginx oder Caddy), der TLS
terminiert. Migrationen einmalig mit `npm run prisma:deploy` einspielen.

---

## Domain, HTTPS und Umgebungsvariablen

**1. Domain per DNS verbinden**

Bei Vercel im Projekt unter **Settings → Domains** die Domain eintragen.
Vercel zeigt dann die nötigen Einträge an. Beim Domain-Anbieter (IONOS,
Strato, Namecheap …) im DNS-Bereich anlegen:

| Typ     | Name  | Wert                    |
| ------- | ----- | ----------------------- |
| `A`     | `@`   | `76.76.21.21`           |
| `CNAME` | `www` | `cname.vercel-dns.com`  |

Die exakten Werte immer aus der Vercel-Oberfläche übernehmen, nicht aus dieser
Tabelle abschreiben – sie können sich ändern. Bis die Änderung überall greift,
vergehen meist Minuten, in Einzelfällen bis zu 48 Stunden.

Bei eigenem Server zeigt der `A`-Record stattdessen auf die IP des Servers.

**2. HTTPS aktivieren**

Auf Vercel, Netlify und Render passiert das automatisch, sobald die Domain
verbunden ist (Let's Encrypt). Nichts zu tun.

Auf einem eigenen Server mit Caddy genügt eine Zeile in der `Caddyfile`:

```
www.ihre-domain.de {
    reverse_proxy localhost:3000
}
```

Caddy holt und erneuert das Zertifikat selbstständig. Mit nginx übernimmt das
`certbot --nginx` dieselbe Aufgabe.

**3. Umgebungsvariablen beim Hoster hinterlegen**

Niemals die `.env` ins Repository committen. Stattdessen:

- **Vercel:** Settings → Environment Variables → für Production, Preview und Development eintragen
- **Netlify:** Site configuration → Environment variables
- **Render:** Environment → Add Environment Variable
- **Eigener Server:** `.env` neben die Anwendung legen und `--env-file .env` beim Docker-Start verwenden

Nach dem Ändern einer Variable ist ein neues Deployment nötig, damit sie greift.
`NEXTAUTH_URL` muss live exakt der aufgerufenen Domain entsprechen, sonst
scheitert die Anmeldung.

---

## Admin-Bereich absichern

`ADMIN_PASSWORD` ist der einzige Schutz für `/admin`. Deshalb:

- ein langes, zufälliges Passwort verwenden (kein Firmenname, kein Jahr)
- nach der Übergabe an den Betrieb ändern (Wert beim Hoster anpassen, kein
  Code-Deployment nötig)
- bei Vercel zusätzlich unter **Settings → Security** eine Rate-Limit-Regel
  für `/api/admin/login` anlegen. Die Anwendung selbst bremst falsche
  Versuche nur um 600 ms, das ersetzt kein echtes Rate Limiting.

---

## Bilder ersetzen

Die aktuell eingebundenen Fotos sind lizenzfreie Platzhalter von Unsplash
(kommerzielle Nutzung erlaubt, keine Namensnennung nötig). Für eine Firmenseite
sind eigene Baustellenfotos deutlich stärker – nichts überzeugt einen Bauherrn
so wie ein Rohbau, den die Firma selbst gestellt hat.

So werden sie getauscht:

1. Fotos nach `public/bilder/` legen (JPEG, mindestens 1600 px breit)
2. In `src/lib/site-config.ts` die `src`-Werte auf `/bilder/dateiname.jpg` ändern
3. Den Eintrag `images.unsplash.com` in `next.config.mjs` entfernen

---

## Pflege und Sicherheit

Der Abhängigkeitsbaum wurde geprüft: `npm audit` meldet **0 Schwachstellen**
(Stand August 2026). Damit das so bleibt, sind ein paar Entscheidungen
bewusst getroffen worden:

- **Next.js 15.5.x** ist die Maintenance-LTS-Linie und erhält Sicherheitspatches.
- Der Block `overrides` in der `package.json` erzwingt gepatchte Versionen von
  `postcss`, `sharp`, `deepmerge-ts` und `nodemailer`, die sonst über
  Unter-Abhängigkeiten in veralteten Versionen hereinkämen. **Diesen Block
  nicht löschen**, sonst kommen die Schwachstellen zurück.
- `@auth/prisma-adapter` wurde entfernt: das Paket wurde nirgends benutzt und
  zog eine als kritisch eingestufte `@auth/core`-Version mit sich.

Ein- bis zweimal im Quartal:

```bash
npm outdated
npm audit
npm install next@latest eslint-config-next@latest
```

Aktuelle Hinweise: <https://nextjs.org/blog>

---

## Rechtliches vor dem Go-Live

Zwei Dinge sind noch offen und stehen als Platzhalter in `src/lib/site-config.ts`:

- **Umsatzsteuer-Identifikationsnummer** (`legal.ustId`) – fehlt noch
- **Registergericht** (`legal.registergericht`) – aktuell „Amtsgericht Neuss“,
  bitte gegen den Handelsregisterauszug prüfen

Impressum und Datenschutzerklärung sind sorgfältig auf das aufgesetzt, was die
Anwendung technisch tatsächlich tut. Sie ersetzen keine Rechtsberatung. Wer
später Google Analytics, Google Maps oder Webfonts von Fremdservern einbindet,
braucht zwingend eine überarbeitete Datenschutzerklärung und einen
Cookie-Banner. Aktuell wird nichts von Dritten nachgeladen.
