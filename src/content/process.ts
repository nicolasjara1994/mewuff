export interface ProcessStep {
  title: string;
  summary: string;
  detail: string;
  duration: string;
}

export const processSteps: ProcessStep[] = [
  {
    title: "Nos envías tus fotos",
    summary: "Completa el formulario con algunas fotografías y cuéntanos qué hace especial a tu mascota.",
    detail:
      "Con 3 a 5 fotos desde distintos ángulos (frente, perfil y cuerpo completo) tenemos lo necesario. Las fotos con luz natural son las que mejor muestran el color real del pelaje.",
    duration: "5 minutos",
  },
  {
    title: "Revisamos cada detalle",
    summary: "Estudiamos proporciones, colores, manchas y gestos para capturar su personalidad.",
    detail:
      "Revisamos tus fotos y te escribimos para confirmar detalles, resolver dudas y enviarte una propuesta con tamaño, terminación y valor.",
    duration: "1 a 2 días hábiles",
  },
  {
    title: "Diseñamos la figura",
    summary: "Modelamos la pieza y te mostramos un avance antes de pasar al taller.",
    detail:
      "Trabajamos la forma y la postura hasta que la figura se sienta como tu mascota. Puedes pedir ajustes antes de que la pieza pase a producción.",
    duration: "5 a 7 días hábiles",
  },
  {
    title: "La creamos a mano",
    summary: "Esculpimos, lijamos y pintamos a mano cada pieza, capa por capa.",
    detail:
      "Cada figura se termina a mano con pigmentos de alta duración y un sellado protector. No hay dos piezas iguales.",
    duration: "2 a 3 semanas",
  },
  {
    title: "Recibes tu figura",
    summary: "Embalamos tu figura con protección a medida y te la enviamos a domicilio.",
    detail: "Viaja protegida en una caja rígida, con un certificado de pieza única y recomendaciones de cuidado.",
    duration: "2 a 5 días hábiles",
  },
];
