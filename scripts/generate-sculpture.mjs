/**
 * Genera la imagen de MUESTRA del hero: una escultura de gato sentado, en cerámica color marfil
 * sobre una base de madera, como PNG con fondo transparente (800x1000 a 1.5x).
 *
 * Es una ilustración propia (sin copyright de terceros). Para usar una foto real:
 * reemplaza `src/assets/figures/hero-sculpture.png` por tu PNG (con fondo transparente, proporción 4:5)
 * y ajusta el `alt` en `src/components/sections/Hero.tsx`.
 *
 * Uso: node scripts/generate-sculpture.mjs
 */
import { mkdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const OUT = path.resolve("src/assets/figures/hero-sculpture.png");

// Superficie compartida por todas las partes: un solo degradado en coordenadas de usuario
// para que la luz sea continua entre cabeza, cuerpo y cola.
const CAT_PARTS = `
  <path id="body" d="M232 894C200 800 212 690 274 602C304 558 330 522 334 480L466 480C470 522 496 558 526 602C588 690 600 800 568 894C520 910 280 910 232 894Z"/>
  <path id="head" d="M250 384C250 352 252 338 258 322C246 252 250 182 266 128Q274 110 292 122C336 148 374 190 392 232Q400 226 408 232C426 190 464 148 508 122Q526 110 534 128C550 182 554 252 542 322C548 338 550 352 550 384C550 462 480 508 400 508C320 508 250 462 250 384Z"/>
  <ellipse id="pawL" cx="350" cy="890" rx="42" ry="17"/>
  <ellipse id="pawR" cx="450" cy="890" rx="42" ry="17"/>`;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="1000" viewBox="0 0 800 1000">
  <defs>
    <linearGradient id="ceramic" gradientUnits="userSpaceOnUse" x1="230" y1="140" x2="610" y2="900">
      <stop offset="0" stop-color="#FFF9EE"/>
      <stop offset=".45" stop-color="#F1E2CE"/>
      <stop offset="1" stop-color="#C9AE94"/>
    </linearGradient>
    <radialGradient id="light" gradientUnits="userSpaceOnUse" cx="330" cy="330" r="300">
      <stop offset="0" stop-color="#FFFFFF" stop-opacity=".7"/>
      <stop offset="1" stop-color="#FFFFFF" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="lightBody" gradientUnits="userSpaceOnUse" cx="330" cy="650" r="320">
      <stop offset="0" stop-color="#FFFFFF" stop-opacity=".5"/>
      <stop offset="1" stop-color="#FFFFFF" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="form" gradientUnits="userSpaceOnUse" x1="200" y1="0" x2="620" y2="0">
      <stop offset="0" stop-color="#543024" stop-opacity=".16"/>
      <stop offset=".3" stop-color="#543024" stop-opacity="0"/>
      <stop offset=".72" stop-color="#543024" stop-opacity="0"/>
      <stop offset="1" stop-color="#543024" stop-opacity=".34"/>
    </linearGradient>
    <linearGradient id="grounded" gradientUnits="userSpaceOnUse" x1="0" y1="700" x2="0" y2="910">
      <stop offset="0" stop-color="#543024" stop-opacity="0"/>
      <stop offset="1" stop-color="#543024" stop-opacity=".28"/>
    </linearGradient>
    <linearGradient id="wood" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#3B2217"/>
      <stop offset=".38" stop-color="#7A4C37"/>
      <stop offset="1" stop-color="#2F190C"/>
    </linearGradient>
    <linearGradient id="woodTop" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#9A6F58"/>
      <stop offset="1" stop-color="#543024"/>
    </linearGradient>
    <linearGradient id="collar" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#6B4231"/>
      <stop offset=".5" stop-color="#8A5A44"/>
      <stop offset="1" stop-color="#4A2A1D"/>
    </linearGradient>
    <filter id="soft" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="14"/></filter>
    <filter id="softSm" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="6"/></filter>
    <g id="cat">${CAT_PARTS}</g>
    <clipPath id="catClip">${CAT_PARTS.replace(/ id="[a-zA-Z]+"/g, "")}</clipPath>
  </defs>

  <!-- Sombras de contacto y suelo -->
  <ellipse cx="400" cy="968" rx="330" ry="26" fill="#000" opacity=".38" filter="url(#soft)"/>

  <!-- Base de madera -->
  <path d="M110 906V950A290 40 0 0 0 690 950V906Z" fill="url(#wood)"/>
  <ellipse cx="400" cy="906" rx="290" ry="40" fill="url(#woodTop)"/>
  <ellipse cx="400" cy="906" rx="290" ry="40" fill="none" stroke="#2F190C" stroke-opacity=".35" stroke-width="2"/>
  <ellipse cx="400" cy="900" rx="236" ry="22" fill="#000" opacity=".4" filter="url(#softSm)"/>

  <!-- Cola: trazo grueso que nace bajo el cuerpo (no deja costura) -->
  <path d="M520 868C640 880 708 826 686 748" fill="none" stroke="url(#ceramic)" stroke-width="40" stroke-linecap="round"/>
  <path d="M520 868C640 880 708 826 686 748" fill="none" stroke="#543024" stroke-opacity=".14" stroke-width="40" stroke-linecap="round" stroke-dasharray="1 0"/>

  <!-- Escultura -->
  <use href="#cat" fill="url(#ceramic)"/>
  <g clip-path="url(#catClip)">
    <rect x="0" y="0" width="800" height="1000" fill="url(#form)"/>
    <rect x="0" y="0" width="800" height="1000" fill="url(#grounded)"/>
    <circle cx="330" cy="330" r="300" fill="url(#light)"/>
    <circle cx="330" cy="650" r="320" fill="url(#lightBody)"/>
  </g>

  <!-- Orejas interiores -->
  <path d="M286 292C281 238 285 192 294 156C328 176 354 204 368 238Z" fill="#C9A58E" opacity=".75"/>
  <path d="M514 292C519 238 515 192 506 156C472 176 446 204 432 238Z" fill="#C9A58E" opacity=".75"/>

  <!-- Patas y cola: surcos del modelado -->
  <g fill="none" stroke-linecap="round">
    <path d="M400 650V884" stroke="#543024" stroke-opacity=".22" stroke-width="4"/>
    <path d="M404 650V884" stroke="#FFFFFF" stroke-opacity=".5" stroke-width="2"/>
    <path d="M326 650C322 744 326 836 334 886" stroke="#543024" stroke-opacity=".18" stroke-width="3"/>
    <path d="M474 650C478 744 474 836 466 886" stroke="#543024" stroke-opacity=".2" stroke-width="3"/>
    <path d="M334 872Q350 880 366 872M434 872Q450 880 466 872" stroke="#543024" stroke-opacity=".25" stroke-width="3"/>
  </g>

  <!-- Collar -->
  <path d="M332 512Q400 544 468 512L472 540Q400 574 328 540Z" fill="url(#collar)"/>
  <circle cx="400" cy="574" r="17" fill="#C9A58E"/>
  <circle cx="400" cy="574" r="17" fill="none" stroke="#543024" stroke-opacity=".5" stroke-width="2.5"/>
  <circle cx="394" cy="568" r="5" fill="#FFF9EE" opacity=".7"/>

  <!-- Rostro -->
  <g fill="none" stroke-linecap="round" stroke-linejoin="round">
    <path d="M334 372Q358 394 382 372" stroke="#543024" stroke-width="7.5"/>
    <path d="M418 372Q442 394 466 372" stroke="#543024" stroke-width="7.5"/>
    <path d="M400 420V436M400 436Q384 452 366 444M400 436Q416 452 434 444" stroke="#543024" stroke-width="4.5"/>
    <path d="M342 424Q282 412 224 420M342 436Q286 442 232 460M458 424Q518 412 576 420M458 436Q514 442 568 460" stroke="#543024" stroke-opacity=".38" stroke-width="2.6"/>
  </g>
  <path d="M386 404Q400 396 414 404Q410 420 400 424Q390 420 386 404Z" fill="#8A5A44"/>
  <ellipse cx="318" cy="418" rx="34" ry="20" fill="#C9A58E" opacity=".28"/>
  <ellipse cx="482" cy="418" rx="34" ry="20" fill="#C9A58E" opacity=".28"/>

  <!-- Brillos de la cerámica -->
  <path d="M294 336C300 290 330 258 372 250" fill="none" stroke="#FFFFFF" stroke-opacity=".8" stroke-width="9" stroke-linecap="round" filter="url(#softSm)"/>
  <path d="M258 690C250 740 256 790 270 830" fill="none" stroke="#FFFFFF" stroke-opacity=".6" stroke-width="12" stroke-linecap="round" filter="url(#softSm)"/>
</svg>`;

await mkdir(path.dirname(OUT), { recursive: true });
const info = await sharp(Buffer.from(svg), { density: 108 }).png({ compressionLevel: 9, palette: false }).toFile(OUT);
console.log(
  `✓ ${path.relative(process.cwd(), OUT)}  ${info.width}x${info.height}  ${(info.size / 1024).toFixed(0)} KB  alpha: ${info.channels === 4}`,
);
