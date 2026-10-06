/** Imagen compatible con `next/image` (un import estático cumple esta forma). */
export interface ImageAsset {
  src: string;
  width: number;
  height: number;
  blurDataURL?: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  petName: string;
  species: string;
  finish: string;
  alt: string;
  image: ImageAsset;
  /** true mientras la imagen sea de muestra y no una fotografía real de una figura. */
  isPlaceholder: boolean;
}
