import type { MetadataRoute } from "next";

const basis = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

/**
 * Wird von Next.js automatisch als /robots.txt ausgeliefert.
 * Wichtig: der interne Bereich und die Kundenkonten dürfen nicht in den
 * Suchindex. Das ersetzt keinen Zugriffsschutz - den übernimmt die Anmeldung -,
 * verhindert aber, dass Adressen überhaupt öffentlich auftauchen.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/konto", "/api", "/login", "/registrieren"],
    },
    sitemap: `${basis}/sitemap.xml`,
  };
}
