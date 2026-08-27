import type { Metadata } from "next";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Datenschutz",
  robots: { index: false, follow: true },
};

/* WICHTIG VOR DEM GO-LIVE
   Das ist eine ehrliche Beschreibung dessen, was diese Anwendung technisch
   tatsächlich tut – und ausdrücklich KEINE Rechtsberatung. Vor dem Livegang
   von einem Datenschutzbeauftragten oder Anwalt prüfen lassen, insbesondere
   wenn später Analytics, Karten oder Schriftarten von Fremdservern
   eingebunden werden. Aktuell werden KEINE externen Tracker geladen. */

export default function DatenschutzPage() {
  return (
    <div id="inhalt" className="mx-auto max-w-3xl px-6 py-section lg:py-section-lg">
      <h1 className="text-hero font-bold text-text">Datenschutzerklärung</h1>

      <div className="mt-12 space-y-10 text-lg leading-relaxed text-text-muted">
        <section>
          <h2 className="text-xl font-semibold text-text">Verantwortliche Stelle</h2>
          <address className="mt-3 not-italic">
            {siteConfig.legalName}
            <br />
            {siteConfig.contact.street}
            <br />
            {siteConfig.contact.zip} {siteConfig.contact.city}
            <br />
            {siteConfig.contact.email}
          </address>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-text">Kundenkonto</h2>
          <p className="mt-3">
            Für eine Anfrage legen Sie ein Konto an. Gespeichert werden Name, E-Mail-Adresse und
            ein verschlüsselter Passwort-Hash. Das Passwort selbst wird nicht gespeichert und ist
            für uns nicht lesbar. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO (Vertrag bzw.
            vorvertragliche Maßnahmen).
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-text">Anfragen</h2>
          <p className="mt-3">
            Bei einer Anfrage speichern wir Ihre Beschreibung des Vorhabens, die Objektadresse,
            einen möglichen Wunschtermin sowie optional hochgeladene Fotos. Diese Daten
            verarbeiten wir zur Bearbeitung Ihrer Anfrage und bewahren sie im Rahmen der
            gesetzlichen Aufbewahrungsfristen auf.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-text">E-Mail-Versand</h2>
          <p className="mt-3">
            Bei einer neuen Anfrage versenden wir eine Benachrichtigung an unser Postfach und eine
            Eingangsbestätigung an Sie. Der Versand läuft über den in der Serverkonfiguration
            hinterlegten SMTP-Anbieter.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-text">Cookies</h2>
          <p className="mt-3">
            Wir setzen ausschließlich technisch notwendige Cookies für die Anmeldung ein. Es
            findet kein Tracking und keine Analyse Ihres Verhaltens statt, es sind keine
            Werbenetzwerke eingebunden. Ihre gewählte Ansicht (hell oder dunkel) wird lokal in
            Ihrem Browser gespeichert und nicht an uns übertragen.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-text">Ihre Rechte</h2>
          <p className="mt-3">
            Sie haben das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der
            Verarbeitung, Datenübertragbarkeit und Widerspruch. Eine formlose Nachricht an{" "}
            <a
              href={`mailto:${siteConfig.contact.email}`}
              className="text-accent hover:text-accent-hover"
            >
              {siteConfig.contact.email}
            </a>{" "}
            genügt. Außerdem steht Ihnen ein Beschwerderecht bei einer Aufsichtsbehörde zu.
          </p>
        </section>
      </div>
    </div>
  );
}
