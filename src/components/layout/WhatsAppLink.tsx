import { siteConfig } from "@/lib/site-config";

/**
 * WhatsApp-Kontakt. Handwerkskunden schreiben häufiger WhatsApp als E-Mail –
 * ein Foto vom Riss ist dort in zehn Sekunden verschickt.
 *
 * Rendert nichts, wenn in site-config keine Nummer hinterlegt ist. Lieber
 * kein Knopf als ein Knopf, der ins Leere führt.
 */
export function WhatsAppLink({
  className = "",
  text = "Per WhatsApp schreiben",
}: {
  className?: string;
  text?: string;
}) {
  const nummer = siteConfig.whatsapp;
  if (!nummer) return null;

  const nachricht = encodeURIComponent(
    `Hallo ${siteConfig.name}, ich habe eine Frage zu einem Bauvorhaben:`
  );

  return (
    <a
      href={`https://wa.me/${nummer}?text=${nachricht}`}
      target="_blank"
      rel="noreferrer"
      className={`press inline-flex min-h-11 items-center justify-center gap-2 rounded-control border border-border bg-surface px-6 text-base font-semibold text-text hover:border-accent hover:text-accent ${className}`}
    >
      {/* Kein fremdes Logo einbinden - Markenrechte. Ein neutrales
          Sprechblasen-Zeichen sagt dasselbe. */}
      <span aria-hidden="true">💬</span>
      {text}
    </a>
  );
}
