"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { Logo } from "@/components/layout/Logo";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { Button, ButtonLink } from "@/components/ui/Button";

const links = [
  { href: "/leistungen", label: "Leistungen" },
  { href: "/ueber-uns", label: "Über uns" },
  { href: "/faq", label: "Fragen" },
  { href: "/kontakt", label: "Kontakt" },
];

export function Navbar() {
  const { data: session, status } = useSession();
  const [versteckt, setVersteckt] = useState(false);
  const [menuOffen, setMenuOffen] = useState(false);
  const letzteY = useRef(0);

  // Nav blendet beim Abwärtsscrollen aus, beim Aufwärtsscrollen wieder ein.
  // Ganz oben immer sichtbar. Bei offenem Mobilmenü bleibt sie stehen, sonst
  // würde das Menü unter dem Finger wegrutschen.
  //
  // Die Auswertung läuft in requestAnimationFrame: der Scroll-Handler feuert
  // sonst mehrfach pro Frame und würde React bei jedem Ereignis anstoßen.
  useEffect(() => {
    let angefordert = false;

    function auswerten() {
      angefordert = false;
      const y = window.scrollY;
      const sollVerstecken = !menuOffen && y > letzteY.current && y > 120;
      letzteY.current = y;
      // Nur bei echter Änderung setzen - spart Renderdurchläufe beim Scrollen.
      setVersteckt((vorher) => (vorher === sollVerstecken ? vorher : sollVerstecken));
    }

    function onScroll() {
      if (angefordert) return;
      angefordert = true;
      requestAnimationFrame(auswerten);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [menuOffen]);

  const angemeldet = status === "authenticated" && Boolean(session?.user);

  return (
    <header
      className={`sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur-md transition-transform duration-300 ease-out ${
        versteckt ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      <nav className="mx-auto flex h-[4.5rem] max-w-shell items-center justify-between gap-6 px-6">
        <Link href="/" aria-label="Zur Startseite" className="shrink-0">
          <Logo />
        </Link>

        <div className="hidden items-center gap-8 lg:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[0.95rem] font-medium text-text-muted transition-colors duration-200 ease-out hover:text-text"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />

          {angemeldet ? (
            <>
              <Link
                href="/konto"
                className="hidden text-[0.95rem] font-medium text-text-muted transition-colors duration-200 ease-out hover:text-text sm:inline"
              >
                Mein Konto
              </Link>
              <Button variant="secondary" onClick={() => signOut({ callbackUrl: "/" })}>
                Abmelden
              </Button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden text-[0.95rem] font-medium text-text-muted transition-colors duration-200 ease-out hover:text-text sm:inline"
              >
                Anmelden
              </Link>
              <ButtonLink href="/anfrage" className="hidden sm:inline-flex">
                Anfrage stellen
              </ButtonLink>
            </>
          )}

          <button
            type="button"
            onClick={() => setMenuOffen((o) => !o)}
            aria-expanded={menuOffen}
            aria-controls="mobilmenue"
            className="press inline-flex h-11 w-11 items-center justify-center rounded-control border border-border text-text lg:hidden"
          >
            <span className="sr-only">Menü {menuOffen ? "schließen" : "öffnen"}</span>
            <span
              aria-hidden="true"
              className="text-lg leading-none transition-transform duration-200 ease-out"
              style={{ transform: menuOffen ? "rotate(90deg)" : "none" }}
            >
              {menuOffen ? "✕" : "☰"}
            </span>
          </button>
        </div>
      </nav>

      {/*
        Grid-Trick statt max-height: 0fr -> 1fr animiert auf die tatsächliche
        Inhaltshöhe, ohne dass man sie vorher kennen muss. Als CSS-Transition
        (nicht Keyframes) bleibt sie unterbrechbar - schnelles Auf und Zu
        springt dadurch nicht.
      */}
      <div
        id="mobilmenue"
        data-offen={menuOffen}
        inert={!menuOffen}
        className="grid grid-rows-[0fr] overflow-hidden bg-background transition-[grid-template-rows] duration-200 ease-out data-[offen=true]:grid-rows-[1fr] data-[offen=true]:border-t data-[offen=true]:border-border lg:hidden"
      >
        <div className="min-h-0 overflow-hidden">
          <div className="mx-auto flex max-w-shell flex-col gap-1 px-6 py-4">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOffen(false)}
                className="flex min-h-11 items-center text-base font-medium text-text"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href={angemeldet ? "/konto" : "/login"}
              onClick={() => setMenuOffen(false)}
              className="flex min-h-11 items-center text-base font-medium text-text"
            >
              {angemeldet ? "Mein Konto" : "Anmelden"}
            </Link>
            <ButtonLink href="/anfrage" className="mt-3 w-full">
              Anfrage stellen
            </ButtonLink>
          </div>
        </div>
      </div>
    </header>
  );
}
