"use client";

import { useRouter } from "next/navigation";

export function AdminLogoutButton() {
  const router = useRouter();

  async function abmelden() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={abmelden}
      className="press inline-flex min-h-11 items-center rounded-control border border-border px-5 text-sm font-medium text-text-muted hover:text-text"
    >
      Abmelden
    </button>
  );
}
