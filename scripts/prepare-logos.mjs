// Convierte los logos de public/logos (fondo opaco) en PNG recortados y con fondo transparente
// en src/assets/logos. Uso: node scripts/prepare-logos.mjs
import sharp from "sharp";

const SRC = "public/logos";
const OUT = "src/assets/logos";
const WIDTH = 900;

/** `onDark`: tinta blanca sobre fondo negro; si no, tinta de color sobre fondo blanco. */
const LOGOS = [
  { file: "mewuff_logo_blanco.png", out: "logo-light.png", onDark: true },
  { file: "mewuff_logo_bicolor.png", out: "logo-bicolor.png", onDark: false },
];

for (const { file, out, onDark } of LOGOS) {
  const { data, info } = await sharp(`${SRC}/${file}`).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const px = Buffer.alloc(data.length);

  for (let i = 0; i < data.length; i += 4) {
    const [r, g, b] = [data[i], data[i + 1], data[i + 2]];
    if (onDark) {
      px.set([255, 255, 255, Math.max(r, g, b)], i);
    } else {
      const alpha = Math.max(255 - r, 255 - g, 255 - b);
      const a = alpha / 255;
      const unmix = (c) => (alpha === 0 ? 0 : Math.round(Math.min(255, Math.max(0, (c - 255 * (1 - a)) / a))));
      px.set([unmix(r), unmix(g), unmix(b), alpha], i);
    }
  }

  await sharp(px, { raw: { width: info.width, height: info.height, channels: 4 } })
    .trim({ background: { r: 0, g: 0, b: 0, alpha: 0 }, threshold: 8 })
    .resize({ width: WIDTH })
    .png({ compressionLevel: 9 })
    .toFile(`${OUT}/${out}`);
  console.log("ok", out);
}
