/**
 * Wandelt eine frei eingegebene Telefonnummer in ein tel:-Ziel um.
 * Ein Anruf-Link scheitert an Leerzeichen, Klammern und Schrägstrichen, die
 * Menschen aber ganz selbstverständlich mitschreiben.
 *
 *   "+49 (0)2133 12 34 56"  ->  "+4902133123456"
 *   "02133/12345"           ->  "0213312345"
 */
export function telHref(nummer: string) {
  return nummer.replace(/[^\d+]/g, "");
}
