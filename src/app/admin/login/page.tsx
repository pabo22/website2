"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/layout/Logo";

export default function AdminLoginPage() {
  const router = useRouter();
  const [passwort, setPasswort] = useState("");
  const [fehler, setFehler] = useState<string | null>(null);
  const [prueft, setPrueft] = useState(false);

  async function absenden(event: React.FormEvent) {
    event.preventDefault();
    setFehler(null);
    setPrueft(true);

    const antwort = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: passwort }),
    }).catch(() => null);

    setPrueft(false);

    if (!antwort?.ok) {
      setFehler("Passwort ist falsch.");
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-background px-6">
      <Logo className="mb-10" />
      <form onSubmit={absenden} className="flex w-full max-w-sm flex-col gap-5">
        <div>
          <h1 className="text-2xl font-bold text-text">Interner Bereich</h1>
          <p className="mt-2 text-text-muted">Übersicht aller eingegangenen Anfragen.</p>
        </div>
        <Input
          label="Passwort"
          type="password"
          autoComplete="current-password"
          value={passwort}
          onChange={(event) => setPasswort(event.target.value)}
          error={fehler ?? undefined}
          autoFocus
        />
        <Button type="submit" pending={prueft} pendingLabel="Wird geprüft …">
          Anmelden
        </Button>
      </form>
    </div>
  );
}
