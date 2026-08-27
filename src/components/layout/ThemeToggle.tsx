"use client";

import { useEffect, useState } from "react";

const KEY = "is-bau-theme";

/**
 * Umschalter für hell/dunkel. Der Ausgangszustand kommt aus dem Inline-Skript
 * in layout.tsx; hier wird nur noch gelesen, was dort bereits gesetzt wurde.
 * Kein Icon-Wechsel per Animation: der Button wird selten benutzt, eine
 * Animation würde hier nur Zeit kosten.
 */
export function ThemeToggle() {
  const [dunkel, setDunkel] = useState(false);
  const [bereit, setBereit] = useState(false);

  useEffect(() => {
    setDunkel(document.documentElement.classList.contains("dark"));
    setBereit(true);
  }, []);

  function umschalten() {
    const neu = !dunkel;
    setDunkel(neu);
    document.documentElement.classList.toggle("dark", neu);
    try {
      localStorage.setItem(KEY, neu ? "dark" : "light");
    } catch {
      /* Speichern kann blockiert sein - die Umschaltung wirkt trotzdem */
    }
  }

  return (
    <button
      type="button"
      onClick={umschalten}
      aria-label={dunkel ? "Zur hellen Ansicht wechseln" : "Zur dunklen Ansicht wechseln"}
      className="press inline-flex h-11 w-11 items-center justify-center rounded-control border border-border text-text-muted hover:text-text"
    >
      {/* Vor der Hydration bewusst leer, damit Server- und Client-Markup übereinstimmen */}
      <span aria-hidden="true" className="text-[1.05rem] leading-none">
        {bereit ? (dunkel ? "☀" : "☾") : ""}
      </span>
    </button>
  );
}
