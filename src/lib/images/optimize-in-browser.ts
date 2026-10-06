import { UPLOAD_LIMITS } from "@/validations/upload";

const QUALITY_STEPS = [0.86, 0.78, 0.7];
const MAX_RESIZE_ATTEMPTS = 3;

/**
 * Optimiza una imagen EN EL NAVEGADOR antes de subirla:
 * - corrige la orientación EXIF y limita el lado mayor a `maxDimension`,
 * - re-codifica a WebP (o JPEG si el navegador no codifica WebP),
 * - descarta metadatos (incluida la ubicación GPS) al redibujar en canvas.
 *
 * Reduce drásticamente el tamaño del envío (más rápido en móviles y compatible con
 * el límite de request de Vercel). El servidor vuelve a validar y re-codificar igual.
 */
export async function optimizeImageInBrowser(file: File, outputBaseName: string): Promise<File> {
  const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });

  try {
    const scale = Math.min(1, UPLOAD_LIMITS.maxDimension / Math.max(bitmap.width, bitmap.height));
    let width = Math.max(1, Math.round(bitmap.width * scale));
    let height = Math.max(1, Math.round(bitmap.height * scale));
    let smallest: Blob | null = null;

    for (let attempt = 0; attempt < MAX_RESIZE_ATTEMPTS; attempt += 1) {
      const canvas = drawToCanvas(bitmap, width, height);
      for (const quality of QUALITY_STEPS) {
        const blob = await encode(canvas, quality);
        if (blob.size <= UPLOAD_LIMITS.targetBytes) return toFile(blob, outputBaseName);
        if (!smallest || blob.size < smallest.size) smallest = blob;
      }
      // Aún pesada (fotos con mucho detalle): reducir dimensiones y reintentar.
      width = Math.round(width * 0.8);
      height = Math.round(height * 0.8);
    }

    if (!smallest || smallest.size > UPLOAD_LIMITS.maxUploadBytes) throw new Error("Imagen demasiado pesada");
    return toFile(smallest, outputBaseName);
  } finally {
    bitmap.close();
  }
}

function drawToCanvas(bitmap: ImageBitmap, width: number, height: number): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Canvas no disponible");
  // Fondo blanco para PNG con transparencia (JPEG no soporta canal alfa).
  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, width, height);
  context.imageSmoothingQuality = "high";
  context.drawImage(bitmap, 0, 0, width, height);
  return canvas;
}

async function encode(canvas: HTMLCanvasElement, quality: number): Promise<Blob> {
  const webp = await toBlob(canvas, "image/webp", quality);
  // Si el navegador no soporta WebP devuelve PNG: en ese caso usamos JPEG.
  if (webp && webp.type === "image/webp") return webp;
  const jpeg = await toBlob(canvas, "image/jpeg", quality);
  if (!jpeg) throw new Error("No se pudo codificar la imagen");
  return jpeg;
}

function toBlob(canvas: HTMLCanvasElement, type: string, quality: number): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob(resolve, type, quality));
}

function toFile(blob: Blob, baseName: string): File {
  const extension = blob.type === "image/webp" ? "webp" : "jpg";
  return new File([blob], `${baseName}.${extension}`, { type: blob.type, lastModified: Date.now() });
}
