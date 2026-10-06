/**
 * Genera imágenes de MUESTRA (placeholders) para desarrollo.
 *
 * Son ilustraciones estilo "product shot" creadas desde SVG: no tienen
 * copyright de terceros y están marcadas como "Imagen de muestra".
 * Reemplázalas por fotografías reales de figuras terminadas antes de producción.
 *
 * Uso: node scripts/generate-placeholders.mjs
 */
import { mkdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const OUT_DIR = path.resolve("src/assets/placeholders");
const PUBLIC_DIR = path.resolve("public");

const MATERIALS = {
  terracota: ["#DDA284", "#B8714F", "#7E4530"],
  porcelana: ["#FFFDF8", "#E9E1D4", "#B5A994"],
  grafito: ["#8F8A84", "#5A5550", "#2C2926"],
  miel: ["#F4CF8E", "#D69A4A", "#94601F"],
  salvia: ["#D0D6BD", "#9CA486", "#5F664D"],
  arena: ["#F1E5D0", "#D6C3A3", "#A08866"],
};

const BACKDROPS = {
  crema: ["#F3ECE1", "#DCCDB8"],
  lino: ["#EEE7DD", "#D3C6B4"],
  piedra: ["#E8E4DE", "#C9C1B5"],
  durazno: ["#F4E6DA", "#DEC5B0"],
};

// Siluetas en un espacio local de 400x520 (la base apoya en y=500).
const SPECIES = {
  gato: {
    shapes: `
      <path d="M118 500 C 96 430 104 342 160 296 C 180 282 220 282 240 296 C 296 342 304 430 282 500 Z"/>
      <path d="M270 495 C 330 495 352 440 322 395 C 316 386 304 390 308 400 C 330 440 312 478 268 478 Z"/>
      <ellipse cx="172" cy="496" rx="26" ry="10"/>
      <ellipse cx="228" cy="496" rx="26" ry="10"/>
      <ellipse cx="200" cy="236" rx="64" ry="56"/>
      <path d="M146 214 C 142 182 146 156 152 136 C 168 150 182 168 194 188 Z"/>
      <path d="M254 214 C 258 182 254 156 248 136 C 232 150 218 168 206 188 Z"/>`,
    details: (ink) => `
      <path d="M170 236 q 11 8 22 0 M208 236 q 11 8 22 0" stroke="${ink}" stroke-width="3.5" fill="none" stroke-linecap="round"/>
      <path d="M194 252 h12 l-6 7 z" fill="${ink}"/>
      <path d="M200 259 v6 M200 265 q -7 5 -12 1 M200 265 q 7 5 12 1" stroke="${ink}" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      <path d="M200 420 v76" stroke="${ink}" stroke-opacity=".18" stroke-width="3" stroke-linecap="round"/>`,
    spots: `<ellipse cx="236" cy="214" rx="34" ry="30"/><ellipse cx="252" cy="420" rx="34" ry="48"/>`,
  },
  perro: {
    shapes: `
      <path d="M122 500 C 112 424 128 350 172 306 L 232 306 C 276 350 292 424 282 500 Z"/>
      <path d="M280 486 C 318 486 336 470 340 446 C 342 438 332 436 330 444 C 324 462 306 470 278 470 Z"/>
      <ellipse cx="174" cy="497" rx="24" ry="9"/>
      <ellipse cx="230" cy="497" rx="24" ry="9"/>
      <ellipse cx="202" cy="236" rx="60" ry="54"/>
      <ellipse cx="202" cy="276" rx="37" ry="27"/>
      <ellipse cx="146" cy="248" rx="20" ry="46" transform="rotate(18 146 248)"/>
      <ellipse cx="258" cy="248" rx="20" ry="46" transform="rotate(-18 258 248)"/>`,
    details: (ink) => `
      <ellipse cx="202" cy="262" rx="12" ry="8" fill="${ink}"/>
      <circle cx="180" cy="228" r="5.5" fill="${ink}"/>
      <circle cx="224" cy="228" r="5.5" fill="${ink}"/>
      <path d="M202 270 v12 M188 286 q 14 9 28 0" stroke="${ink}" stroke-width="3" fill="none" stroke-linecap="round"/>
      <path d="M202 410 v86" stroke="${ink}" stroke-opacity=".18" stroke-width="3" stroke-linecap="round"/>`,
    spots: `<ellipse cx="226" cy="222" rx="30" ry="28"/><ellipse cx="258" cy="248" rx="20" ry="46" transform="rotate(-18 258 248)"/><ellipse cx="160" cy="404" rx="30" ry="40"/>`,
  },
  conejo: {
    shapes: `
      <ellipse cx="196" cy="432" rx="100" ry="70"/>
      <ellipse cx="150" cy="440" rx="62" ry="58"/>
      <ellipse cx="248" cy="352" rx="50" ry="44"/>
      <ellipse cx="236" cy="262" rx="15" ry="62" transform="rotate(-12 236 262)"/>
      <ellipse cx="268" cy="266" rx="15" ry="60" transform="rotate(10 268 266)"/>
      <circle cx="98" cy="430" r="18"/>
      <ellipse cx="262" cy="494" rx="24" ry="9"/>
      <ellipse cx="150" cy="495" rx="46" ry="10"/>`,
    details: (ink) => `
      <circle cx="264" cy="344" r="5.5" fill="${ink}"/>
      <path d="M290 362 l8 0 l-4 5 z" fill="${ink}"/>
      <path d="M236 262 m 0 -40 v 70" stroke="${ink}" stroke-opacity=".15" stroke-width="7" stroke-linecap="round" transform="rotate(-12 236 262)"/>`,
    spots: `<ellipse cx="236" cy="236" rx="20" ry="70" transform="rotate(-12 236 262)"/>`,
  },
};

function figureScene({ width, height, species, material, backdrop, spots = false, label = true, offsetX = 0.5 }) {
  const [light, mid, dark] = MATERIALS[material];
  const [bgTop, bgBottom] = BACKDROPS[backdrop];
  const spec = SPECIES[species];

  const s = (height * 0.5) / 370;
  const cx = width * offsetX;
  const plinthTop = height * 0.72;
  const tx = cx - 200 * s;
  const ty = plinthTop - 500 * s;
  const prx = 190 * s;
  const pry = 22 * s;
  const ph = 90 * s;
  const ink = MATERIALS[material] === MATERIALS.grafito ? "#1B1917" : dark;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${bgTop}"/>
      <stop offset="1" stop-color="${bgBottom}"/>
    </linearGradient>
    <radialGradient id="glow" cx="${offsetX * 0.9}" cy="0.32" r="0.6">
      <stop offset="0" stop-color="#FFFFFF" stop-opacity=".55"/>
      <stop offset="1" stop-color="#FFFFFF" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="mat" gradientUnits="userSpaceOnUse" x1="110" y1="140" x2="330" y2="500">
      <stop offset="0" stop-color="${light}"/>
      <stop offset=".55" stop-color="${mid}"/>
      <stop offset="1" stop-color="${dark}"/>
    </linearGradient>
    <radialGradient id="gloss" gradientUnits="userSpaceOnUse" cx="160" cy="250" r="240">
      <stop offset="0" stop-color="#FFFFFF" stop-opacity=".5"/>
      <stop offset=".6" stop-color="#FFFFFF" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="shade" gradientUnits="userSpaceOnUse" x1="0" y1="300" x2="0" y2="500">
      <stop offset="0" stop-color="#000000" stop-opacity="0"/>
      <stop offset="1" stop-color="#000000" stop-opacity=".22"/>
    </linearGradient>
    <linearGradient id="wood" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#5A3824"/>
      <stop offset=".35" stop-color="#8C5D3E"/>
      <stop offset="1" stop-color="#4A2D1C"/>
    </linearGradient>
    <linearGradient id="woodTop" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#A97753"/>
      <stop offset="1" stop-color="#7A4E33"/>
    </linearGradient>
    <filter id="blur" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="${12 * s}"/>
    </filter>
    <filter id="blurSm" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="${5 * s}"/>
    </filter>
    <g id="fig">${spec.shapes}</g>
    <clipPath id="figClip">${spec.shapes}</clipPath>
  </defs>

  <rect width="100%" height="100%" fill="url(#bg)"/>
  <rect width="100%" height="100%" fill="url(#glow)"/>

  <ellipse cx="${cx}" cy="${plinthTop + ph + 6 * s}" rx="${prx * 1.25}" ry="${pry * 1.3}" fill="#000" opacity=".22" filter="url(#blur)"/>

  <path d="M${cx - prx} ${plinthTop} L${cx - prx} ${plinthTop + ph} A ${prx} ${pry} 0 0 0 ${cx + prx} ${plinthTop + ph} L${cx + prx} ${plinthTop} Z" fill="url(#wood)"/>
  <ellipse cx="${cx}" cy="${plinthTop}" rx="${prx}" ry="${pry}" fill="url(#woodTop)"/>

  <g transform="translate(${tx} ${ty}) scale(${s})">
    <ellipse cx="200" cy="500" rx="150" ry="14" fill="#000" opacity=".35" filter="url(#blurSm)"/>
    <use href="#fig" fill="url(#mat)"/>
    ${spots ? `<g clip-path="url(#figClip)" fill="${dark}" opacity=".55">${spec.spots}</g>` : ""}
    <rect x="0" y="0" width="400" height="520" fill="url(#gloss)" clip-path="url(#figClip)"/>
    <rect x="0" y="0" width="400" height="520" fill="url(#shade)" clip-path="url(#figClip)"/>
    ${spec.details(ink)}
  </g>

  ${
    label
      ? `<text x="${width * 0.04}" y="${height - width * 0.04}" font-family="Arial, Helvetica, sans-serif" font-size="${Math.round(width * 0.018)}" letter-spacing="2" fill="#2B2622" fill-opacity=".45">IMAGEN DE MUESTRA · PLACEHOLDER</text>`
      : ""
  }
</svg>`;
}

const IMAGES = [
  {
    file: "hero.webp",
    width: 1600,
    height: 2000,
    species: "perro",
    material: "porcelana",
    backdrop: "durazno",
    spots: true,
  },
  { file: "gallery-simon.webp", width: 1200, height: 1500, species: "gato", material: "porcelana", backdrop: "lino" },
  { file: "gallery-luna.webp", width: 1200, height: 1500, species: "perro", material: "terracota", backdrop: "crema" },
  { file: "gallery-copito.webp", width: 1200, height: 1500, species: "conejo", material: "arena", backdrop: "piedra" },
  {
    file: "gallery-tango.webp",
    width: 1200,
    height: 1500,
    species: "perro",
    material: "grafito",
    backdrop: "lino",
    spots: false,
  },
  {
    file: "gallery-mora.webp",
    width: 1200,
    height: 1500,
    species: "gato",
    material: "miel",
    backdrop: "durazno",
    spots: true,
  },
  { file: "gallery-pancho.webp", width: 1200, height: 1500, species: "perro", material: "salvia", backdrop: "piedra" },
  {
    file: "atelier.webp",
    width: 1600,
    height: 1200,
    species: "gato",
    material: "terracota",
    backdrop: "crema",
    spots: true,
  },
];

await mkdir(OUT_DIR, { recursive: true });

for (const img of IMAGES) {
  const svg = figureScene(img);
  await sharp(Buffer.from(svg)).webp({ quality: 88 }).toFile(path.join(OUT_DIR, img.file));
  console.log("✓", img.file);
}

// Imagen Open Graph (1200x630, JPEG para máxima compatibilidad con redes sociales).
const ogFigure = figureScene({
  width: 1200,
  height: 630,
  species: "perro",
  material: "porcelana",
  backdrop: "durazno",
  spots: true,
  label: false,
  offsetX: 0.3,
});
const ogSvg = ogFigure.replace(
  "</svg>",
  `<text x="620" y="280" font-family="Georgia, 'Times New Roman', serif" font-size="58" fill="#2B2622">Tu mascota,</text>
   <text x="620" y="350" font-family="Georgia, 'Times New Roman', serif" font-size="58" fill="#2B2622">una pieza única.</text>
   <text x="622" y="410" font-family="Arial, Helvetica, sans-serif" font-size="22" letter-spacing="4" fill="#8E4F36">HUELLA ATELIER</text>
</svg>`,
);
await sharp(Buffer.from(ogSvg)).jpeg({ quality: 86, mozjpeg: true }).toFile(path.join(PUBLIC_DIR, "og-image.jpg"));
console.log("✓ public/og-image.jpg");
