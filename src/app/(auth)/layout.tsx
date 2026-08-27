import Link from "next/link";
import { Logo } from "@/components/layout/Logo";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    // min-h-[100dvh] statt min-h-screen: verhindert Springen, wenn auf
    // Mobilgeräten die Adressleiste ein- oder ausfährt.
    <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-background px-6 py-16">
      <Link href="/" aria-label="Zur Startseite" className="mb-10">
        <Logo />
      </Link>
      <div className="w-full max-w-sm">{children}</div>
      <Link
        href="/"
        className="mt-10 text-sm text-text-muted transition-colors duration-200 ease-out hover:text-text"
      >
        Zurück zur Startseite
      </Link>
    </div>
  );
}
