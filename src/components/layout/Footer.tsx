import Link from "next/link";
import { Logo } from "@/components/layout/Logo";
import { siteConfig } from "@/lib/site-config";

const spalten = [
  {
    titel: "Leistungen",
    links: [
      { href: "/leistungen#rohbau", label: "Rohbau und Beton" },
      { href: "/leistungen#zimmerei", label: "Zimmerei" },
      { href: "/leistungen#sanierung", label: "Umbau und Sanierung" },
      { href: "/leistungen#planung", label: "Planung und Statik" },
    ],
  },
  {
    titel: "Unternehmen",
    links: [
      { href: "/ueber-uns", label: "Über uns" },
      { href: "/faq", label: "Häufige Fragen" },
      { href: "/kontakt", label: "Kontakt" },
      { href: "/impressum", label: "Impressum" },
      { href: "/datenschutz", label: "Datenschutz" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface-sunken">
      <div className="mx-auto grid max-w-shell gap-12 px-6 py-16 md:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <Logo />
          <p className="mt-4 max-w-xs text-[0.95rem] text-text-muted">{siteConfig.claim}</p>
          <address className="mt-6 not-italic text-[0.95rem] text-text-muted">
            {siteConfig.contact.street}
            <br />
            {siteConfig.contact.zip} {siteConfig.contact.city}
          </address>
        </div>

        {spalten.map((spalte) => (
          <div key={spalte.titel} className="flex flex-col gap-3">
            <p className="text-sm font-semibold text-text">{spalte.titel}</p>
            {spalte.links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[0.95rem] text-text-muted transition-colors duration-200 ease-out hover:text-accent"
              >
                {link.label}
              </Link>
            ))}
          </div>
        ))}
      </div>

      <div className="border-t border-border">
        <div className="mx-auto flex max-w-shell flex-col gap-3 px-6 py-6 text-sm text-text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {siteConfig.legalName}
          </p>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <a
              href={`tel:${siteConfig.contact.phoneHref}`}
              className="transition-colors duration-200 ease-out hover:text-accent"
            >
              {siteConfig.contact.phone}
            </a>
            <a
              href={`mailto:${siteConfig.contact.email}`}
              className="transition-colors duration-200 ease-out hover:text-accent"
            >
              {siteConfig.contact.email}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
