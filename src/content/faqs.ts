export interface Faq {
  question: string;
  answer: string;
  category: "Proceso" | "Fotografías" | "Tiempos" | "Personalización" | "Materiales" | "Envío" | "Cuidados";
}

export const faqs: Faq[] = [
  {
    category: "Proceso",
    question: "¿Cómo funciona el proceso de encargo?",
    answer:
      "Nos envías fotos de tu mascota mediante el formulario, revisamos los detalles y te contactamos con una propuesta. Una vez aprobada, diseñamos la figura, te mostramos un avance y la creamos a mano en nuestro taller.",
  },
  {
    category: "Proceso",
    question: "¿Enviar el formulario me obliga a comprar?",
    answer:
      "No. Enviar tus fotos es solo el primer paso para evaluar tu figura. Te enviaremos una propuesta y tú decides si quieres continuar.",
  },
  {
    category: "Fotografías",
    question: "¿Qué fotografías necesitan?",
    answer:
      "Idealmente entre 3 y 5 fotos nítidas y con buena luz natural: una de frente, una de perfil y una de cuerpo completo. Si tiene manchas, marcas o un gesto característico, agrega una foto donde se vean bien. Aceptamos JPG, PNG y WebP de hasta 15 MB cada una.",
  },
  {
    category: "Fotografías",
    question: "Mi mascota ya no está conmigo y tengo pocas fotos. ¿Pueden hacerla igual?",
    answer:
      "Sí. Trabajamos con mucho cuidado figuras en memoria de mascotas que ya partieron. Envíanos las fotos que tengas y cuéntanos sobre su personalidad; te diremos con honestidad qué nivel de detalle podemos lograr.",
  },
  {
    category: "Tiempos",
    question: "¿Cuánto tiempo tarda una figura?",
    answer:
      "En general, entre 3 y 5 semanas desde que apruebas la propuesta hasta el despacho. El plazo exacto depende del tamaño, el nivel de detalle y la demanda del taller, y te lo confirmamos antes de comenzar.",
  },
  {
    category: "Personalización",
    question: "¿Puedo pedir una postura, accesorio o detalle especial?",
    answer:
      "Sí. Puedes pedir una postura en particular, su collar, un pañuelo o un juguete favorito. Escríbelo en los comentarios del formulario y lo evaluamos en la propuesta.",
  },
  {
    category: "Personalización",
    question: "¿Pueden hacer más de una mascota en la misma pieza?",
    answer:
      "Sí, podemos crear composiciones con dos o más mascotas. Envía una solicitud indicándolo en los comentarios e incluye fotos de cada una.",
  },
  {
    category: "Materiales",
    question: "¿De qué material están hechas las figuras?",
    answer:
      "Trabajamos principalmente con resina y cerámica en frío de alta resistencia, pintadas a mano con pigmentos acrílicos y selladas con una capa protectora mate o satinada. La base es de madera nativa.",
  },
  {
    category: "Envío",
    question: "¿Hacen envíos a todo el país?",
    answer:
      "Sí, enviamos a todo Chile mediante courier, con embalaje rígido y protección a medida. El valor del envío se incluye en la propuesta. Consúltanos por envíos internacionales.",
  },
  {
    category: "Cuidados",
    question: "¿Cómo debo cuidar mi figura?",
    answer:
      "Mantenla en interior, lejos del sol directo y de fuentes de calor. Límpiala solo con un pincel suave o un paño seco; evita el agua y los productos de limpieza. No es un juguete: no es apta para niños pequeños ni para mascotas.",
  },
];
