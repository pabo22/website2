import { redirect } from "next/navigation";

/**
 * Früher lag das Anfrageformular hier - hinter der Anmeldung. Das kostete
 * Interessenten, die nur einen Preis wissen wollten. Das Formular liegt jetzt
 * öffentlich unter /anfrage und füllt Name und E-Mail bei Angemeldeten selbst
 * aus. Diese Weiterleitung fängt alte Links und Lesezeichen ab.
 */
export default function AlteNeueAnfrage() {
  redirect("/anfrage");
}
