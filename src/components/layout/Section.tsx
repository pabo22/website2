import { ReactNode } from "react";

type Grund = "background" | "surface" | "sunken" | "ink";

const gruende: Record<Grund, string> = {
  background: "bg-background text-text",
  surface: "bg-surface text-text",
  sunken: "bg-surface-sunken text-text",
  // Farbblock in Logo-Navy: gliedert die lange Startseite optisch
  ink: "bg-ink text-ink-text",
};

/**
 * Einheitlicher Abschnitts-Rahmen: gleicher Innenabstand, gleiche Breite,
 * abwechselnde Hintergründe. Verhindert, dass jede Seite ihre eigenen
 * Abstände erfindet.
 */
export function Section({
  children,
  grund = "background",
  className = "",
  id,
}: {
  children: ReactNode;
  grund?: Grund;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={`${gruende[grund]} ${className}`}>
      <div className="mx-auto max-w-shell px-6 py-section lg:py-section-lg">{children}</div>
    </section>
  );
}

/** Überschrift eines Abschnitts. Bewusst ohne Kleinkapitälchen-Label darüber. */
export function SectionHeading({
  children,
  hell = false,
}: {
  children: ReactNode;
  hell?: boolean;
}) {
  return (
    <h2
      className={`text-section font-bold lg:text-section-lg ${hell ? "text-ink-text" : "text-text"}`}
    >
      {children}
    </h2>
  );
}
