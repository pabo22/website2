import { PrismaClient } from "@prisma/client";

/**
 * Next.js lädt Module im Dev-Modus bei jedem Hot-Reload neu. Ohne diesen
 * globalThis-Trick entstünde jedes Mal ein neuer PrismaClient (= neue
 * Datenbankverbindung), bis die Datenbank keine Verbindungen mehr annimmt.
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function erzeugeClient() {
  try {
    return new PrismaClient({
      log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    });
  } catch (fehler) {
    // Der Standardfehler von Prisma ("did not initialize yet") sagt nicht,
    // was konkret zu tun ist. Diese Meldung schon.
    throw new Error(
      [
        "Der Datenbank-Client wurde noch nicht erzeugt.",
        "",
        "Im Projektordner ausführen:",
        "  npm install",
        "  npm run setup",
        "",
        "Wichtig: kein 'npx prisma ...' verwenden - npx lädt die neueste",
        "Prisma-Version aus dem Netz, die andere Befehlsnamen hat.",
        "",
        `Ursprüngliche Meldung: ${fehler instanceof Error ? fehler.message : String(fehler)}`,
      ].join("\n")
    );
  }
}

export const db = globalForPrisma.prisma ?? erzeugeClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}
