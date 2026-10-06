/**
 * Contrato para el futuro análisis de fotos con un modelo de visión.
 * El flujo principal NO depende de la IA: si no hay proveedor configurado,
 * simplemente no se ejecuta.
 */
export interface PetPhotoAnalysis {
  species: string | null;
  approximateBreed: string | null;
  coatColors: string[];
  distinctiveFeatures: string[];
  markings: string[];
  accessories: string[];
  /** Observaciones útiles para el taller (postura, proporciones, expresión…). */
  fabricationNotes: string[];
  /** 0–1. Confianza global declarada por el modelo. */
  confidence: number | null;
  model: string;
  analyzedAt: string;
}

export interface PhotoForAnalysis {
  data: Buffer;
  mimeType: "image/webp";
}

export interface AnalysisContext {
  petType: string;
  petName: string;
  customerComments: string | null;
}

export interface PetPhotoAnalyzer {
  readonly name: string;
  analyze(photos: PhotoForAnalysis[], context: AnalysisContext): Promise<PetPhotoAnalysis>;
}
