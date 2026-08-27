import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default async function KontoLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  // Serverseitige Prüfung statt nur clientseitig: der Bereich bleibt auch
  // geschützt, wenn JavaScript nicht lädt.
  if (!session?.user) {
    redirect("/login?callbackUrl=/konto");
  }

  return (
    <>
      <Navbar />
      <main id="inhalt" className="mx-auto min-h-[60vh] max-w-3xl px-6 py-16">
        {children}
      </main>
      <Footer />
    </>
  );
}
