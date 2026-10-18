import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

/**
 * Build para GitHub Pages (export estático, sin servidor).
 * El workflow define GITHUB_PAGES=true y NEXT_PUBLIC_BASE_PATH=/<repo>.
 */
const isGithubPages = process.env.GITHUB_PAGES === "true";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || undefined;

/**
 * Content Security Policy sin nonces.
 * Se elige la variante estática para mantener las páginas pre-renderizadas
 * (los nonces obligan a renderizar cada request de forma dinámica).
 * 'unsafe-inline' en scripts es necesario para la hidratación de Next sin nonces;
 * el resto de directivas son estrictas: sin orígenes externos, sin frames, sin plugins.
 */
const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' blob: data:",
  "font-src 'self'",
  "connect-src 'self'",
  "media-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "worker-src 'self' blob:",
  ...(isDev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  ...(isDev ? [] : [{ key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" }]),
];

const nextConfig: NextConfig = {
  ...(isGithubPages ? { output: "export" as const, trailingSlash: true, basePath, assetPrefix: basePath } : {}),
  poweredByHeader: false,
  reactStrictMode: true,
  images: {
    unoptimized: isGithubPages,
    formats: ["image/avif", "image/webp"],
    qualities: [75],
    minimumCacheTTL: 60 * 60 * 24 * 30,
    // Al servir fotos públicas desde Supabase (p. ej. la galería), agregar aquí su dominio:
    // remotePatterns: [{ protocol: "https", hostname: "<project-ref>.supabase.co", pathname: "/storage/v1/object/public/**" }],
  },
  // Pages no admite cabeceras personalizadas; con export estático se omiten.
  ...(isGithubPages
    ? {}
    : {
        async headers() {
          return [
            { source: "/:path*", headers: securityHeaders },
            // Las respuestas de la API nunca deben ser indexadas.
            { source: "/api/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex" }] },
          ];
        },
      }),
};

export default nextConfig;
