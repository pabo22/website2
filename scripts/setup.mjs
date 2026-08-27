/**
 * EINRICHTUNG IN EINEM BEFEHL
 * ---------------------------
 * Aufruf:  npm run setup
 *
 * Erledigt der Reihe nach:
 *   1. .env aus .env.example anlegen, falls sie fehlt
 *   2. NEXTAUTH_SECRET erzeugen, falls noch der Platzhalter drinsteht
 *   3. pruefen, ob eine echte DATABASE_URL eingetragen ist
 *   4. Prisma Client erzeugen
 *   5. Datenbanktabellen anlegen
 *
 * Bewusst reines Node ohne Zusatzpakete und ohne Farbcodes: laeuft damit auf
 * Windows, macOS und Linux identisch, ohne dass jemand cp/copy oder openssl
 * kennen muss.
 */

import { existsSync, copyFileSync, readFileSync, writeFileSync, readdirSync } from "node:fs";
import { randomBytes } from "node:crypto";
import { spawnSync } from "node:child_process";

const ENV = ".env";
const VORLAGE = ".env.example";

function schritt(text) {
  console.log("\n> " + text);
}

function abbruch(titel, zeilen) {
  console.error("\nFEHLER: " + titel + "\n");
  for (const zeile of zeilen) console.error("  " + zeile);
  console.error("");
  process.exit(1);
}

// --- 1. .env anlegen -------------------------------------------------------
schritt("Umgebungsdatei pruefen");

if (!existsSync(ENV)) {
  if (!existsSync(VORLAGE)) {
    abbruch("Weder .env noch .env.example gefunden.", [
      "Bist du im richtigen Ordner? Erwartet wird der Projektordner,",
      "in dem auch die package.json liegt.",
    ]);
  }
  copyFileSync(VORLAGE, ENV);
  console.log("  [neu] .env aus .env.example erstellt");
} else {
  console.log("  [ok]  .env ist vorhanden");
}

let env = readFileSync(ENV, "utf8");

// --- 2. NEXTAUTH_SECRET setzen --------------------------------------------
// Reine Boilerplate - dafuer soll niemand einen Befehl nachschlagen muessen.
if (/NEXTAUTH_SECRET\s*=\s*"?(hier-einen[^"\r\n]*)?"?\s*$/m.test(env)) {
  const geheim = randomBytes(32).toString("base64");
  env = env.replace(/^NEXTAUTH_SECRET\s*=.*$/m, 'NEXTAUTH_SECRET="' + geheim + '"');
  writeFileSync(ENV, env, "utf8");
  console.log("  [neu] NEXTAUTH_SECRET automatisch erzeugt");
}

// --- 3. Datenbankadresse pruefen ------------------------------------------
schritt("Datenbankadresse pruefen");

const treffer = env.match(/^DATABASE_URL\s*=\s*"?([^"\r\n]*)"?/m);
const url = (treffer && treffer[1] ? treffer[1] : "").trim();

// Alle Platzhalter erkennen, die je in einer .env.example standen.
const istPlatzhalter =
  !url ||
  /(^|@)HOST[:/]/i.test(url) ||
  /\/DATENBANK(\?|$)/i.test(url) ||
  /BENUTZER:PASSWORT/i.test(url) ||
  /@host:5432/i.test(url) ||
  /datenbankname/i.test(url);

if (istPlatzhalter) {
  abbruch("In der .env steht noch keine echte Datenbank.", [
    "Aktueller Wert: " + (url || "(leer)"),
    "",
    "So bekommst du in fuenf Minuten eine kostenlose:",
    "  1. Auf https://neon.tech ein Konto anlegen (kostenlos, ohne Kreditkarte)",
    "  2. Create Project, als Region Frankfurt waehlen",
    "  3. Den angezeigten Connection String kopieren",
    "  4. In der Datei .env die Zeile DATABASE_URL= komplett damit ersetzen",
    "     (alles in EINER Zeile, in Anfuehrungszeichen)",
    "  5. Danach erneut:  npm run setup",
    "",
    "Ohne diesen Schritt bricht Prisma mit P1001 ab.",
  ]);
}
console.log("  [ok]  DATABASE_URL ist gesetzt");

// --- 4./5. Prisma ----------------------------------------------------------
function prisma(argumente, beschreibung) {
  schritt(beschreibung);
  // Kein npx: das wuerde bei fehlender lokaler Installation die neueste
  // Prisma-Version aus dem Netz laden (aktuell ein Release Candidate mit
  // umbenannten Befehlen). npm-Skripte nutzen node_modules/.bin.
  const ergebnis = spawnSync("prisma", argumente, {
    stdio: "inherit",
    shell: process.platform === "win32",
  });

  if (ergebnis.error || ergebnis.status !== 0) {
    abbruch("Schritt fehlgeschlagen: prisma " + argumente.join(" "), [
      "Lief 'npm install' vorher vollstaendig durch?",
      "Zum Pruefen:  npm ls prisma      (erwartet wird prisma@6.x)",
      "",
      "Zeigt Prisma einen Kasten 'Update available ... 8.0.0-rc',",
      "ist das nur ein Hinweis. Dieses Update NICHT ausfuehren.",
    ]);
  }
}

prisma(["generate"], "Datenbank-Client erzeugen");

// Erster Lauf legt "init" an, spätere Läufe übernehmen nur Änderungen am
// Datenmodell. Ohne diese Unterscheidung hieße jede Migration "init".
const migrationsOrdner = "prisma/migrations";
const schonMigriert =
  existsSync(migrationsOrdner) &&
  readdirSync(migrationsOrdner).some((eintrag) => /^\d/.test(eintrag));

prisma(
  ["migrate", "dev", "--name", schonMigriert ? "update" : "init"],
  schonMigriert ? "Änderungen am Datenmodell übernehmen" : "Datenbanktabellen anlegen"
);

// --- Fertig ----------------------------------------------------------------
console.log([
  "",
  "============================================",
  " Einrichtung abgeschlossen.",
  "============================================",
  "",
  "  Website starten:   npm run dev",
  "  Danach oeffnen:    http://localhost:3000",
  "  Interner Bereich:  http://localhost:3000/admin",
  "",
  "  Noch offen: in der .env ein eigenes ADMIN_PASSWORD setzen,",
  "  sonst kommst du nicht in den internen Bereich.",
  "",
].join("\n"));
