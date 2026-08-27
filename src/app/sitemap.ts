import type { MetadataRoute } from "next";

/**
 * Wird von Next.js automatisch als /sitemap.xml ausgeliefert.
 * Ohne NEXT_PUBLIC_SITE_URL entstünden relative Adressen, mit denen Google
 * nichts anfangen kann - deshalb der Fallback auf localhost beim Entwickeln.
 */
const basis = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  const stand = new Date();

  // Nur öffentliche Seiten. Konto- und Admin-Bereich gehören nicht hinein.
  const seiten: Array<{ pfad: string; prioritaet: number; frequenz: "monthly" | "yearly" }> = [
    { pfad: "", prioritaet: 1.0, frequenz: "monthly" },
    { pfad: "/leistungen", prioritaet: 0.9, frequenz: "monthly" },
    { pfad: "/anfrage", prioritaet: 0.9, frequenz: "monthly" },
    { pfad: "/faq", prioritaet: 0.8, frequenz: "monthly" },
    { pfad: "/ueber-uns", prioritaet: 0.7, frequenz: "monthly" },
    { pfad: "/kontakt", prioritaet: 0.7, frequenz: "monthly" },
    { pfad: "/impressum", prioritaet: 0.2, frequenz: "yearly" },
    { pfad: "/datenschutz", prioritaet: 0.2, frequenz: "yearly" },
  ];

  return seiten.map(({ pfad, prioritaet, frequenz }) => ({
    url: `${basis}${pfad}`,
    lastModified: stand,
    changeFrequency: frequenz,
    priority: prioritaet,
  }));
}
