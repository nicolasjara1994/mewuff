/**
 * Configuración pública de la marca. Nada de este archivo es secreto:
 * se usa tanto en el servidor como en el cliente.
 */
function resolveSiteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL;
  if (fromEnv) return fromEnv.replace(/\/+$/, "");
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  return "http://localhost:3000";
}

export const siteConfig = {
  name: "Huella Atelier",
  shortName: "Huella",
  tagline: "Figuras artesanales de mascotas",
  description:
    "Creamos figuras personalizadas de tu mascota, modeladas y pintadas a mano a partir de tus fotografías. Piezas únicas, hechas con cariño en nuestro taller.",
  url: resolveSiteUrl(),
  locale: "es_CL",
  contact: {
    email: "hola@huella-atelier.example",
    whatsappDisplay: "+56 9 0000 0000",
    whatsappUrl: "https://wa.me/56900000000",
    city: "Santiago, Chile",
    hours: "Lunes a viernes, 10:00 a 18:00",
  },
  social: [
    { label: "Instagram", href: "https://instagram.com/huella.atelier" },
    { label: "TikTok", href: "https://tiktok.com/@huella.atelier" },
    { label: "Pinterest", href: "https://pinterest.com/huellaatelier" },
  ],
} as const;

export const mainNav = [
  { label: "Proceso", href: "/como-funciona" },
  { label: "Galería", href: "/galeria" },
  { label: "Preguntas", href: "/preguntas-frecuentes" },
  { label: "Contacto", href: "/contacto" },
] as const;

/** Versión vigente de la política de privacidad aceptada en cada solicitud. */
export const PRIVACY_POLICY_VERSION = "2026-10-borrador";
