/* =====================================================
   >>> EDITA SOLO ESTE ARCHIVO <<<
   Todo lo que ve el invitado sale de aquí.
   Guarda, sube a GitHub y listo.
   ===================================================== */

const DATOS = {

  /* ---------- LOS NOVIOS ----------
     nombre1 va arriba, nombre2 abajo. Si los quieres al revés,
     nada más intercambia los dos textos.                        */
  nombre1: "Giovanni",
  nombre2: "María",
  frase: "Te elijo hoy y por el resto de mi vida",

  /* ---------- FECHA DE LA BODA ----------
     Formato: "AÑO-MES-DÍAThora:minuto:00-06:00"
     El -06:00 es la zona horaria del centro de México.     */
  fechaISO: "2026-12-19T18:00:00-06:00",

  /* Cómo se escribe la fecha en los círculos que se raspan */
  fechaTexto: {
    dia:  "19",
    mes:  "Diciembre",
    anio: "2026",
    diaSemana: "Sábado"
  },

  /* ---------- MISA / CEREMONIA ---------- */
  ceremonia: {
    hora:      "6:00 PM",
    lugar:     "Parroquia de Nuestra Señora de Guadalupe (Maravillas)",
    direccion: "Av. Guadalupe (3er anillo de circunvalación) 229, Jesús María, Ags., 20900",
    // Enlace de Google Maps del lugar
    mapa:      "https://www.google.com/maps/search/?api=1&query=" +
               encodeURIComponent("Parroquia de Nuestra Señora de Guadalupe Maravillas, Av. Guadalupe 229, Jesús María, Aguascalientes, 20900")
  },

  /* ---------- RECEPCIÓN ---------- */
  recepcion: {
    hora:      "Después de la misa",
    lugar:     "Salón La Huerta",
    direccion: "Jesús María, Ags., C.P. 20927",
    mapa:      "https://maps.app.goo.gl/FNwjdk3vqJsbuKyw7?g_st=aw"
  },

  /* ---------- PADRINOS Y PADRES ---------- */
  familia: {
    padresNovia: [
      "Yolanda López Vega",
      "Miguel Ángel Beltrán Ramírez"
    ],
    padresNovio: [
      "Laura Imelda Leos Carreón",
      "Rigoberto Delgadillo Ramírez"
    ],
    padrinos: [
      "Rubén de Luna Delgado",
      "Martha Elvia Delgadillo Ramírez"
    ]
  },

  /* ---------- CONFIRMACIÓN (RSVP) ----------
     Fecha límite sugerida para confirmar. */
  fechaLimiteRSVP: "30 de noviembre",

  /* ---------- SUGERENCIAS ---------- */
  sugerencias: [
    "<strong>Niños:</strong> ¡son bienvenidos! Habrá niños en la celebración.",
    "<strong>Puntualidad:</strong> te esperamos unos minutos antes de la misa.",
    "<strong>Estacionamiento:</strong> disponible en el lugar."
  ],

  /* ---------- GALERÍA DE FOTOS ----------
     Pon tus fotos en assets/img/ con estos nombres
     (o cambia los nombres aquí).                        */
  galeria: [
    { src: "assets/img/1.jpg",  texto: "" },
    { src: "assets/img/2.jpg",  texto: "" },
    { src: "assets/img/8.jpg",  texto: "" },
    { src: "assets/img/5.jpg",  texto: "" },
    { src: "assets/img/6.jpg",  texto: "" },
    { src: "assets/img/7.jpg",  texto: "" }
  ]
};
