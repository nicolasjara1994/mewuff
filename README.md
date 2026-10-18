# MeWuff Studio

Sitio web para una marca (simulada) de **figuras artesanales y personalizadas de mascotas**. Los clientes conocen el
producto y envían fotografías de su mascota para que el taller evalúe y fabrique una figura única.

**Stack:** Next.js 16 (App Router) · React 19 · TypeScript estricto · Tailwind CSS 4 · Framer Motion · Supabase
(Postgres + Storage) · Vercel.

---

## Inicio rápido

Requisitos: **Node.js 20.9+** y npm.

```bash
npm install
cp .env.example .env.local   # en Windows: copy .env.example .env.local
npm run dev                  # http://localhost:3000
```

Puedes probar el flujo completo **sin configurar Supabase**: en desarrollo, si faltan las variables de Supabase, las
solicitudes y fotos se guardan en `./.local-data/` (ignorado por git). En producción este modo no existe: sin Supabase
la API responde `503` de forma segura.

### Scripts

| Script                        | Descripción                                                 |
| ----------------------------- | ----------------------------------------------------------- |
| `npm run dev`                 | Servidor de desarrollo                                      |
| `npm run build` / `npm start` | Build y servidor de producción                              |
| `npm run lint`                | ESLint (reglas de Next, Core Web Vitals, accesibilidad)     |
| `npm run typecheck`           | Verificación de tipos con TypeScript                        |
| `npm run format`              | Formatea con Prettier (+ orden de clases de Tailwind)       |
| `npm run check`               | typecheck + lint + formato (ideal para CI)                  |
| `npm run prepare:photos`      | Optimiza las fotos de ejemplo y genera la imagen para redes |

---

## Variables de entorno

Ver [`.env.example`](.env.example).

| Variable                    | Ámbito       | Obligatoria       | Descripción                                                                  |
| --------------------------- | ------------ | ----------------- | ---------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`      | Público      | Recomendada       | URL canónica (SEO, sitemap, validación de origen). En Vercel tiene fallback. |
| `SUPABASE_URL`              | **Servidor** | Sí, en producción | URL del proyecto Supabase.                                                   |
| `SUPABASE_SERVICE_ROLE_KEY` | **Servidor** | Sí, en producción | Clave `service_role` o _secret key_. **Nunca** con prefijo `NEXT_PUBLIC_`.   |
| `SUPABASE_STORAGE_BUCKET`   | Servidor     | No (`pet-photos`) | Bucket privado para las fotos.                                               |
| `RATE_LIMIT_SALT`           | Servidor     | Sí, en producción | Salt aleatorio para anonimizar IPs en el rate limiting.                      |
| `AI_PROVIDER`               | Servidor     | No (`none`)       | Reservado para la futura integración de IA.                                  |

> El navegador **nunca** habla directamente con Supabase. Toda la persistencia pasa por el Route Handler del servidor,
> por lo que no se necesita (ni se usa) la clave anon/publishable.

---

## Configurar Supabase

1. Crea un proyecto en [supabase.com](https://supabase.com).
2. Abre **SQL Editor** y ejecuta el contenido de
   [`supabase/migrations/20261006000000_initial_schema.sql`](supabase/migrations/20261006000000_initial_schema.sql).
   Con la CLI: `npx supabase link --project-ref <ref>` y luego `npx supabase db push`.
3. La migración crea:
   - `custom_requests`: solicitudes (datos del cliente, mascota, estado, consentimiento, análisis IA opcional).
   - `request_photos`: metadatos de cada foto (los binarios viven en Storage).
   - `rate_limits` + función `consume_rate_limit`: rate limiting atómico compartido entre instancias.
   - Bucket **privado** `pet-photos` (máx. 10 MB, solo WebP/JPEG/PNG).
   - **RLS activado** en todas las tablas sin políticas para `anon`/`authenticated`, más `revoke` explícito.
4. En **Project Settings → API** copia la URL y la clave `service_role` (o la _secret key_) a `.env.local`.
5. Reinicia `npm run dev` y envía una solicitud de prueba: verás la fila en `custom_requests` y las fotos en
   `pet-photos/<id-solicitud>/`.

---

## Desplegar en Vercel

1. Sube el repositorio a GitHub/GitLab e impórtalo en [vercel.com/new](https://vercel.com/new) (detecta Next.js
   automáticamente).
2. En **Settings → Environment Variables** define `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `RATE_LIMIT_SALT` y
   `NEXT_PUBLIC_SITE_URL` (tu dominio final, p. ej. `https://mewuff-studio.cl`).
3. Despliega. Las previews de Vercel quedan con `robots.txt` en `Disallow: /` para no ser indexadas.

Para generar un salt: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`.

---

## Arquitectura

```
src/
├── app/                      Rutas (App Router). Server Components por defecto.
│   ├── api/requests/route.ts POST de solicitudes (multipart) — único endpoint
│   ├── personaliza/          Formulario de solicitud
│   ├── como-funciona/ galeria/ preguntas-frecuentes/ contacto/ privacidad/
│   ├── sitemap.ts robots.ts icon.svg not-found.tsx error.tsx
├── components/
│   ├── layout/               Header, menú móvil (client), footer
│   ├── sections/             Secciones de página (Hero, Proceso, Galería, FAQ…)
│   ├── request-form/         Formulario, subida de fotos, confirmación (client)
│   ├── ui/                   Primitivas: botones, Reveal y Parallax (client), etc.
│   ├── providers/            MotionProvider (LazyMotion + reduced motion)
│   └── seo/                  JSON-LD
├── content/                  Textos estructurados (FAQ, pasos del proceso)
├── hooks/                    usePhotoSelection (validación + optimización + previews)
├── lib/                      env, supabase, seguridad, imágenes, helpers
├── services/
│   ├── requests/             Caso de uso + RequestStore (Supabase | local dev)
│   ├── gallery/              Fuente de datos de la galería
│   └── ai/                   Contrato para análisis de fotos con IA (desactivado)
├── types/                    Tipos de dominio, API y base de datos
└── validations/              Esquemas Zod (cliente + servidor) y límites de subida
```

### Flujo de una solicitud

1. **Navegador**: valida campos (Zod), verifica formato y firma binaria de cada foto, la **optimiza** en canvas
   (máx. 2048 px, WebP/JPEG, sin EXIF/GPS) y envía un único `multipart/form-data`.
2. **Route Handler** (`/api/requests`), del control más barato al más caro:
   origen (CSRF) → tipo y tamaño del body → rate limit por IP hasheada → honeypot + tiempo mínimo → validación Zod →
   validación de archivos (cantidad, tamaño, extensión, MIME, _magic bytes_) → **re-codificación con sharp**
   (elimina metadatos y cualquier contenido embebido, limita resolución y píxeles) → persistencia con rollback.
3. **Respuesta**: código de referencia legible (`MW-XXXXXX`), sin exponer el UUID interno.

### Decisiones técnicas

- **Un Route Handler en lugar de Server Actions**: permite controlar cabeceras (`Origin`, `Content-Length`),
  códigos HTTP y rate limiting de forma explícita.
- **Optimización en el cliente + subida a través del servidor** (no _signed upload URLs_): el servidor puede validar y
  re-codificar cada imagen antes de guardarla, y el envío cabe en el límite de 4,5 MB por request de Vercel. Si en el
  futuro se necesitan originales en resolución completa, conviene migrar a _signed upload URLs_ + validación posterior.
- **CSP estática sin nonces**: mantiene todas las páginas pre-renderizadas (más rápidas). Requiere
  `'unsafe-inline'` en `script-src`; el resto de directivas son estrictas (sin orígenes externos ni frames).
- **`zod/mini`** en lugar de `zod`: la misma validación en cliente y servidor con mucho menos JavaScript.
- **Framer Motion con `LazyMotion` + `m`**: bundle de animación mínimo. El hero usa animación CSS para no retrasar el
  LCP. Solo se anima `opacity`/`transform`, nunca se intercepta el scroll nativo y se respeta `prefers-reduced-motion`.

### Límites del MVP

| Límite                        | Valor                 |
| ----------------------------- | --------------------- |
| Fotos por solicitud           | 1 a 5                 |
| Tamaño del original (cliente) | 15 MB                 |
| Tamaño por foto recibida      | 4 MB (tras optimizar) |
| Tamaño total del request      | 4,4 MB                |
| Resolución almacenada         | máx. 2400 px, WebP    |
| Envíos por IP                 | 6 cada 15 minutos     |

---

## Reemplazar las imágenes de muestra

La sección "Nuestro oficio", la galería y la imagen para redes usan fotos de EJEMPLO de dos gatos (Leia y
Luke), optimizadas en `src/assets/pets/` y mostradas con la etiqueta **"Imagen de muestra"**.

- **Cambiar las fotos de ejemplo**: reemplaza `public/leiaimage.jpeg` y `public/lukeimage.jpeg` y ejecuta
  `npm run prepare:photos`. El script genera las versiones WebP optimizadas (sin metadatos EXIF/GPS) y la imagen
  Open Graph. Los originales de `public/` se siguen usando como fotos de fondo de sección (`SectionBackdrop`) y se sirven públicamente a través del optimizador de imágenes de Next.
- **Hero (escultura)**: es un PNG con fondo transparente, `src/assets/figures/hero-sculpture.png`, generado por
  `node scripts/generate-sculpture.mjs` (ilustración propia, sin copyright). Para usar una foto real, reemplaza ese
  archivo por tu PNG con fondo transparente en proporción 4:5 y ajusta el `alt` en `Hero.tsx`.
- **Sección "Nuestro oficio"**: importa `luke.webp`; ajusta el `alt` en `Craft.tsx` al usar fotos propias.
- **Galería**: edita [`src/services/gallery/gallery.ts`](src/services/gallery/gallery.ts). Para fotos reales de
  figuras terminadas, usa `isPlaceholder: false` y desaparece la etiqueta. Para una galería administrable, crea una
  tabla `gallery_items` y un bucket **público** separado en Supabase, léelos en `getGalleryItems()` y agrega el
  dominio en `images.remotePatterns` de `next.config.ts`.

---

## Privacidad y próximos pasos

Preparado en esta versión:

- Consentimiento explícito obligatorio, guardado con fecha y versión de la política (`privacy_consent_at`,
  `privacy_policy_version`).
- Política de privacidad en **borrador** (`/privacidad`): debe revisarla asesoría legal (Ley 19.628 y Ley 21.719).
- `RequestStore.deleteRequest()` elimina la solicitud **y sus fotos** (derecho de eliminación).
- `createSignedPhotoUrl()` genera URLs temporales para ver fotos privadas desde un futuro panel.
- Solo se guarda lo necesario: las IPs no se almacenan en claro (solo un hash para el rate limiting).

Pendiente para siguientes iteraciones:

1. **Panel de administración** con Supabase Auth + tabla `admins` + políticas RLS (hay un ejemplo comentado en la
   migración).
2. **Notificaciones por email** (al cliente y al taller) usando `after()` en el Route Handler.
3. **Retención automática**: un job (Supabase cron) que elimine solicitudes inactivas y sus fotos.
4. **IA de visión**: implementar `PetPhotoAnalyzer` en `src/services/ai/providers/` y registrarlo en
   `src/services/ai/analyzer.ts`. Se ejecuta con `after()`, después de responder al cliente, y guarda el resultado en
   `custom_requests.ai_analysis`. El flujo principal no depende de ella.
5. CAPTCHA invisible (p. ej. Turnstile) si aparece spam que supere el honeypot y el rate limiting.
