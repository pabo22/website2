"use client";

import { ReactNode, useEffect, useRef, useState } from "react";

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Versatz in ms für gestaffeltes Einblenden mehrerer Elemente (30–80ms). */
  delayMs?: number;
}

/**
 * Blendet Inhalte ein, sobald sie in den Viewport scrollen.
 * IntersectionObserver statt scroll-Listener: der Browser rechnet das
 * ausserhalb des Main-Threads, ein scroll-Handler würde bei jedem Frame feuern.
 * Reduzierte Bewegung wird über die .reveal-Regel in globals.css respektiert.
 */
export function Reveal({ children, className = "", delayMs = 0 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [sichtbar, setSichtbar] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    let timer: ReturnType<typeof setTimeout>;
    const observer = new IntersectionObserver(
      ([eintrag]) => {
        if (eintrag.isIntersecting) {
          timer = setTimeout(() => setSichtbar(true), delayMs);
          observer.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    observer.observe(node);
    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [delayMs]);

  return (
    <div ref={ref} data-visible={sichtbar} className={`reveal ${className}`}>
      {children}
    </div>
  );
}
