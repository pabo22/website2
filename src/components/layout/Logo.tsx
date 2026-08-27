import Image from "next/image";
import { siteConfig } from "@/lib/site-config";

/**
 * Wortmarke. Zwei Dateien statt CSS-Filter, damit die Marke in beiden
 * Modi exakt die vorgesehenen Farben behält.
 */
export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center ${className}`}>
      <Image
        src="/marke/is-bau-logo.png"
        alt={`${siteConfig.legalName} Logo`}
        width={741}
        height={160}
        priority
        className="h-7 w-auto dark:hidden sm:h-8"
      />
      <Image
        src="/marke/is-bau-logo-dark.png"
        alt=""
        aria-hidden="true"
        width={741}
        height={160}
        priority
        className="hidden h-7 w-auto dark:block sm:h-8"
      />
    </span>
  );
}
