import Image from "next/image";
import Link from "next/link";

import logoBicolor from "@/assets/logos/logo-bicolor.png";
import logoLight from "@/assets/logos/logo-light.png";
import { siteConfig } from "@/lib/site";

/**
 * Logo de marca. El blanco va sobre fondos oscuros; con `adaptive` (header) cambia al bicolor
 * cuando el header pasa a ser translúcido claro al hacer scroll (ver globals.css).
 */
export function Logo({ adaptive = false }: { adaptive?: boolean }) {
  const size = "h-7 w-auto sm:h-8";

  return (
    <Link
      href="/"
      className="group inline-flex items-center rounded-md"
      aria-label={`${siteConfig.name}, ir al inicio`}
    >
      <Image src={logoLight} alt="" data-logo-light preload={adaptive} className={`${size} block`} sizes="160px" />
      {adaptive && <Image src={logoBicolor} alt="" data-logo-dark className={`${size} hidden`} sizes="160px" />}
    </Link>
  );
}
