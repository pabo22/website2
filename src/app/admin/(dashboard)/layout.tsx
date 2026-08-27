import { redirect } from "next/navigation";
import { istAdminAngemeldet } from "@/lib/admin-auth";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Serverseitige Prüfung: der Bereich ist auch dann geschützt, wenn im
  // Browser kein JavaScript läuft.
  if (!(await istAdminAngemeldet())) {
    redirect("/admin/login");
  }

  return <div className="min-h-[100dvh] bg-background">{children}</div>;
}
