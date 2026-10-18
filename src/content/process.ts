import type { StaticImageData } from "next/image";

import heroSculpture from "@/assets/figures/hero-sculpture.png";
import leia from "@/assets/pets/leia.webp";
import luke from "@/assets/pets/luke.webp";

export interface ProcessStep {
  image: StaticImageData;
  imageAlt: string;
  title: string;
  summary: string;
  detail: string;
  duration: string;
}

export const processSteps: ProcessStep[] = [
  {
    image: leia,
    imageAlt: "Fotografía de muestra de Leia, la mascota que se envía como referencia.",
    title: "NOS ENVÍAS TUS FOTOS",
    summary: "Completa el formulario con algunas fotografías y cuéntanos qué hace especial a tu mascota.",
    detail:
      "Con 3 a 5 fotos desde distintos ángulos (frente, perfil y cuerpo completo) tenemos lo necesario. Las fotos con luz natural son las que mejor muestran el color real del pelaje.",
    duration: "5 minutos",
  },
  {
    image: luke,
    imageAlt: "Fotografía de muestra de Luke, un gato gris de ojos ámbar, siendo revisada en detalle.",
    title: "REVISAMOS CADA DETALLE",
    summary: "Estudiamos proporciones, colores, manchas y gestos para capturar su personalidad.",
    detail:
      "Revisamos tus fotos y te escribimos para confirmar detalles, resolver dudas y enviarte una propuesta con tamaño, terminación y valor.",
    duration: "1 a 2 días hábiles",
  },
  {
    image: heroSculpture,
    imageAlt: "Figura de mascota en proceso de diseño.",
    title: "DISEÑAMOS LA FIGURA",
    summary: "Modelamos la pieza y te mostramos un avance antes de pasar al taller.",
    detail:
      "Trabajamos la forma y la postura hasta que la figura se sienta como tu mascota. Puedes pedir ajustes antes de que la pieza pase a producción.",
    duration: "5 a 7 días hábiles",
  },
  {
    image: heroSculpture,
    imageAlt: "Figura de mascota esculpida y pintada a mano en el taller.",
    title: "LA CREAMOS A MANO",
    summary: "Esculpimos, lijamos y pintamos a mano cada pieza, capa por capa.",
    detail:
      "Cada figura se termina a mano con pigmentos de alta duración y un sellado protector. No hay dos piezas iguales.",
    duration: "2 a 3 semanas",
  },
  {
    image: luke,
    imageAlt: "Figura terminada lista para ser entregada.",
    title: "RECIBES TU FIGURA EN CASA",
    summary: "Embalamos tu figura con protección a medida y te la enviamos a domicilio.",
    detail: "Viaja protegida en una caja rígida, con un certificado de pieza única y recomendaciones de cuidado.",
    duration: "2 a 5 días hábiles",
  },
];
