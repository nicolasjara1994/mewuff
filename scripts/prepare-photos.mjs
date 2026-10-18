/**
 * Prepara las fotos de ejemplo del sitio (Leia y Luke).
 *
 * Lee los originales desde `public/` y genera:
 *   - src/assets/pets/leia.webp y luke.webp  (optimizadas; se importan estáticamente,
 *     así next/image conoce sus dimensiones y genera el desenfoque de carga)
 *   - public/og-image.jpg                    (imagen para compartir en redes, 1200x630)
 *
 * Para cambiar las fotos: reemplaza los archivos de origen y ejecuta
 *   npm run prepare:photos
 *
 * Los originales de `public/` NO se deben borrar: `SectionBackdrop` los usa como fotos de fondo.
 */
import { mkdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const SOURCES = {
  leia: "public/leiaimage.jpeg",
  luke: "public/lukeimage.jpeg",
};
const OUT_DIR = path.resolve("src/assets/pets");

await mkdir(OUT_DIR, { recursive: true });

for (const [name, source] of Object.entries(SOURCES)) {
  const { width, height, size } = await sharp(source)
    .rotate() // respeta la orientación y descarta metadatos (EXIF/GPS)
    .resize({ width: 1600, height: 2133, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 82, effort: 5 })
    .toFile(path.join(OUT_DIR, `${name}.webp`));
  console.log(`✓ ${name}.webp  ${width}x${height}  ${(size / 1024).toFixed(0)} KB`);
}

// Imagen Open Graph: foto de Luke a la izquierda y el mensaje de marca a la derecha.
const PHOTO_WIDTH = 480;
const photo = await sharp(SOURCES.luke)
  .rotate()
  .resize(PHOTO_WIDTH, 630, { fit: "cover", position: sharp.strategy.attention })
  .toBuffer();

const background = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#F1E2CE"/>
      <stop offset="1" stop-color="#DCC4A9"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <text x="560" y="270" font-family="Georgia, 'Times New Roman', serif" font-size="58" fill="#2F190C">Tu mascota,</text>
  <text x="560" y="340" font-family="Georgia, 'Times New Roman', serif" font-size="58" fill="#2F190C">una pieza única.</text>
  <text x="562" y="400" font-family="Arial, Helvetica, sans-serif" font-size="22" letter-spacing="4" fill="#543024">MEWUFF STUDIO</text>
</svg>`;

await sharp(Buffer.from(background))
  .composite([{ input: photo, left: 0, top: 0 }])
  .jpeg({ quality: 86, mozjpeg: true })
  .toFile("public/og-image.jpg");
console.log("✓ public/og-image.jpg");
