// ═══════════════════════════════════════════════════════════
//  BIBLIOTYAN — Configuración, Datos y Módulo de Inteligencia
//  Catálogo General de Libros en PDF y EPUB
// ═══════════════════════════════════════════════════════════

const CONFIG = {
  libraryName: "BIBLIOTYAN",
  tagline: "Repositorio Editorial & Lectura Libre",
  deliveryHours: 10,
  adminPassword: "tyan2024",
  communityInviteUrl: "https://t.me/+OhqKLNF35gY1Mjkx",

  // ── Redes Sociales Comunitarias ──
  socialMedia: {
    telegram: {
      active: true,
      url: "https://t.me/+OhqKLNF35gY1Mjkx",
      label: "Canal Oficial de Telegram",
      icon: "fa-brands fa-telegram",
      color: "#229ED9"
    },
    instagram: {
      active: true,
      url: "https://www.instagram.com/tyanmena/",
      label: "Instagram @tyanmena",
      icon: "fa-brands fa-instagram",
      color: "#E4405F"
    },
    facebook: {
      active: true,
      url: "https://www.facebook.com/reel/1426164676340634?locale=es_LA",
      label: "Facebook",
      icon: "fa-brands fa-facebook-f",
      color: "#1877F2"
    }
  },

  // ── Categorías y Filtros por Género ──
  categories: [
    "Todos",
    "National Geographic",
    "E-Books (EPUB)",
    "Productividad & Hábitos",
    "Finanzas & Inversión",
    "Liderazgo & Estrategia",
    "Marketing & Ventas",
    "Crecimiento Personal",
    "Neurociencia & Mente",
    "Salud & Longevidad",
    "Psicología & Conducta",
    "Tecnología & Futuro",
    "Autoayuda & Mente",
    "Literatura Clásica",
    "Ficción & Novela",
    "Filosofía & Estrategia"
  ],

  // ── Paleta de Colores por Género ──
  categoryColors: {
    "National Geographic": "#eab308",
    "E-Books (EPUB)": "#10b981",
    "Productividad & Hábitos": "#3b82f6",
    "Finanzas & Inversión": "#059669",
    "Liderazgo & Estrategia": "#f97316",
    "Marketing & Ventas": "#ec4899",
    "Crecimiento Personal": "#8b5cf6",
    "Neurociencia & Mente": "#9333ea",
    "Salud & Longevidad": "#06b6d4",
    "Psicología & Conducta": "#f43f5e",
    "Tecnología & Futuro": "#6366f1",
    "Autoayuda & Mente": "#b469fc",
    "Literatura Clásica": "#e879f9",
    "Ficción & Novela": "#a855f7",
    "Filosofía & Estrategia": "#7e22ce",
    "Otros": "#818cf8"
  }
};

// ── Citas Editoriales sobre Lectura y Sabiduría ──
const QUOTES = [
  { text: "Un lector vive mil vidas antes de morir. El que nunca lee vive solo una.", author: "George R.R. Martin" },
  { text: "Todo hombre puede ser, si se lo propone, escultor de su propio cerebro.", author: "Santiago Ramón y Cajal" },
  { text: "La lectura es para la mente lo que el ejercicio es para el cuerpo.", author: "Joseph Addison" },
  { text: "Somos lo que hacemos día a día de modo que la excelencia no es un acto, sino un hábito.", author: "Aristóteles" },
  { text: "Si no tienes tiempo para leer, no tienes el tiempo (ni las herramientas) para escribir.", author: "Stephen King" },
  { text: "El cerebro no es un vaso por llenar, sino una lámpara por encender.", author: "Plutarco" },
  { text: "La mente que se abre a una nueva idea jamás volverá a su tamaño original.", author: "Albert Einstein" },
  { text: "Los libros son espejos: solo ves en ellos lo que ya tienes dentro.", author: "Carlos Ruiz Zafón" },
  { text: "Siempre imaginé que el paraíso sería algún tipo de biblioteca.", author: "Jorge Luis Borges" }
];

// ═══════════════════════════════════════════════════════════
//  MOTOR CLASIFICADOR TEMÁTICO (IA)
// ═══════════════════════════════════════════════════════════
const AIClassifier = {
  genreRules: [
    {
      genre: "Productividad & Hábitos",
      keywords: ["habito", "productividad", "gtd", "eficacia", "sapo", "focus", "tiempo", "concentracion", "disciplina"],
      vibe: "Estratégico & Práctico",
      target: "Profesionales, estudiantes y personas que desean dominar su tiempo y enfoque"
    },
    {
      genre: "Finanzas & Inversión",
      keywords: ["dinero", "rico", "finanzas", "inversion", "riqueza", "wall street", "babilonia", "bolsa", "ahorro"],
      vibe: "Estratégico & Abundante",
      target: "Inversionistas, emprendedores y personas que buscan libertad financiera"
    },
    {
      genre: "Liderazgo & Estrategia",
      keywords: ["lider", "liderazgo", "estrategia", "jobs", "disney", "principios", "dalio", "oceano azul", "sprint"],
      vibe: "Ejecutivo & Visionario",
      target: "Líderes, directores y estrategas que guían equipos hacia la innovación"
    },
    {
      genre: "Marketing & Ventas",
      keywords: ["ventas", "vender", "marketing", "consumidor", "godin", "tribus", "persuasion", "negociacion"],
      vibe: "Persuasivo & Comercial",
      target: "Emprendedores, comerciales y expertos en creación de audiencias y marcas"
    },
    {
      genre: "Crecimiento Personal",
      keywords: ["vida", "emocional", "crecimiento", "miedo", "autoestima", "felicidad", "superacion", "sabiduria"],
      vibe: "Inspirador & Profundo",
      target: "Lectores en busca de autorrealización y evolución personal"
    },
    {
      genre: "Neurociencia & Mente",
      keywords: ["cerebro", "neuronas", "memoria", "conectoma", "sinapsis", "plasticidad", "mente"],
      vibe: "Científico & Revelador",
      target: "Apasionados de las bases biológicas del pensamiento y la cognición"
    }
  ],

  analyze: function(book) {
    const text = `${book.title || ''} ${book.description || ''} ${book.author || ''}`.toLowerCase();
    let bestGenre = book.category || "Crecimiento Personal";
    let maxMatches = 0;
    let selectedRule = this.genreRules[0];

    for (const rule of this.genreRules) {
      let matches = 0;
      for (const kw of rule.keywords) {
        if (text.includes(kw)) matches++;
      }
      if (matches > maxMatches) {
        maxMatches = matches;
        bestGenre = rule.genre;
        selectedRule = rule;
      }
    }

    const keyConcepts = selectedRule.keywords.filter(k => text.includes(k)).slice(0, 4);
    if (keyConcepts.length === 0) {
      keyConcepts.push("Desarrollo", "Conocimiento", "Lectura", "Evolución");
    }

    return {
      suggestedGenre: bestGenre,
      confidenceScore: Math.min(98, 72 + (maxMatches * 6)),
      vibe: selectedRule.vibe,
      keyConcepts: keyConcepts.map(c => c.charAt(0).toUpperCase() + c.slice(1)),
      targetAudience: selectedRule.target
    };
  }
};

// ═══════════════════════════════════════════════════════════
//  CATÁLOGO DE LIBROS DE BIBLIOTYAN (PDF Y EPUB)
// ═══════════════════════════════════════════════════════════
const BOOKS = [
  // ── LIBRO INSIGNIA ──
  {
    id: 1,
    title: "Reinicia tu mente",
    author: "Begoña del Campo Zafra",
    category: "Autoayuda & Mente",
    collection: "General",
    format: "pdf",
    year: 2025,
    language: "Español",
    pages: 259,
    description: "Un manual transformador hacia la reprogramación del subconsciente y el redescubrimiento de tu esencia. A través de la neurociencia, la coherencia cardíaca y ejercicios de visualización guiada, enseña cómo romper creencias heredadas, activar la neuroplasticidad y liberar tu potencial genuino.",
    cover: "covers/reinicia-tu-mente.jpg",
    pdf: "pdfs/reinicia-tu-mente.pdf",
    downloads: 384,
    featured: true,
    aiAnalysis: {
      genre: "Autoayuda & Neurociencia",
      vibe: "Transformador & Metodológico",
      keyConcepts: ["Reprogramación Subconsciente", "Neuroplasticidad", "Coherencia Cardíaca", "Sanación Interior"],
      targetAudience: "Personas buscando romper patrones limitantes y tomar el control de su vida emocional.",
      aiSummary: "Metodología rigurosa para desaprender bloqueos emocionales y reprogramar la identidad desde el subconsciente."
    }
  },

  // ═══════ PRODUCTIVIDAD & HÁBITOS ═══════
  {
    id: 201,
    title: "Los 7 Hábitos de la Gente Altamente Efectiva",
    author: "Stephen R. Covey",
    category: "Productividad & Hábitos",
    collection: "Bestsellers",
    format: "pdf",
    year: 2015,
    language: "Español",
    pages: 380,
    description: "Considerado uno de los libros de gestión y desarrollo personal más influyentes del siglo. Covey presenta un enfoque holístico e integrado para resolver problemas personales y profesionales basado en principios imperecederos como la proactividad, el beneficio mutuo y la renovación continua.",
    cover: "covers/los-7-habitos.png",
    pdf: "pdfs/productividad-y-habitos/los-7-habitos-stephen-covey.pdf",
    downloads: 512,
    featured: true,
    aiAnalysis: {
      genre: "Desarrollo del Liderazgo & Efectividad",
      vibe: "Clásico & Trascendental",
      keyConcepts: ["Proactividad", "Primero lo Primero", "Ganar-Ganar", "Sinergia"],
      targetAudience: "Profesionales, directivos y personas orientadas a la excelencia ética y productiva.",
      aiSummary: "Marco de trabajo integral para la transformación personal y la efectividad interpersonal sostenible."
    }
  },
  {
    id: 202,
    title: "Tráguese ese Sapo: 21 maneras de dejar de procrastinar",
    author: "Brian Tracy",
    category: "Productividad & Hábitos",
    collection: "Bestsellers",
    format: "pdf",
    year: 2018,
    language: "Español",
    pages: 140,
    description: "Una guía contundente y pragmática para erradicar la postergación. Tracy enseña a identificar las tareas más críticas, aplicar la regla del 80/20 y afrontar la tarea más difícil al comenzar el día para multiplicar los resultados en menor tiempo.",
    cover: "covers/traguese-ese-sapo.png",
    pdf: "pdfs/productividad-y-habitos/traguese-ese-sapo-brian-tracy.pdf",
    downloads: 440,
    featured: true,
    aiAnalysis: {
      genre: "Gestión del Tiempo & Enfoque",
      vibe: "Práctico & Contundente",
      keyConcepts: ["Priorización ABCDE", "Erradicación de Procrastinación", "Regla 80/20", "Foco Unidireccional"],
      targetAudience: "Lectores abrumados por el exceso de trabajo que buscan simplificar y ejecutar con rapidez.",
      aiSummary: "Pautas directas para vencer la pereza mental y ejecutar las tareas de mayor impacto cada día."
    }
  },
  {
    id: 203,
    title: "Focus: Desarrollar la atención para alcanzar la excelencia",
    author: "Daniel Goleman",
    category: "Productividad & Hábitos",
    collection: "Bestsellers",
    format: "dual",
    year: 2014,
    language: "Español",
    pages: 320,
    description: "El psicólogo y autor de Inteligencia Emocional analiza la atención como el activo mental más preciado y escaso del mundo hiperconectado. Explora los tres tipos de foco (interno, hacia los demás y externo) y cómo cultivarlos para la toma de decisiones certeras.",
    cover: "covers/focus-goleman.jpg",
    pdf: "pdfs/productividad-y-habitos/focus-daniel-goleman.pdf",
    epub: "pdfs/epubs/focus-daniel-goleman.epub",
    downloads: 395,
    featured: true,
    aiAnalysis: {
      genre: "Psicología Cognitiva & Atención",
      vibe: "Analítico & Esclarecedor",
      keyConcepts: ["Atención Focalizada", "Foco Interno y Externo", "Sobrecarga de Estímulos", "Autocontrol"],
      targetAudience: "Estudiantes, creadores y líderes que sufren la dispersión de la era de los smartphones.",
      aiSummary: "Investigación sobre por qué la capacidad de atención profunda determina el éxito en la vida moderna."
    }
  },
  {
    id: 204,
    title: "Organízate con Eficacia (GTD)",
    author: "David Allen",
    category: "Productividad & Hábitos",
    collection: "Bestsellers",
    format: "dual",
    year: 2016,
    language: "Español",
    pages: 360,
    description: "El método de productividad personal más aclamado internacionalmente (Getting Things Done). Allen demuestra que la mente debe usarse para tener ideas, no para retenerlas, enseñando a vaciar la mente mediante un sistema fiable de bandejas de entrada, listas de acciones y revisiones periódicas.",
    cover: "covers/organizate-con-eficacia.jpg",
    pdf: "pdfs/productividad-y-habitos/organizate-con-eficacia-david-allen.pdf",
    epub: "pdfs/epubs/organizate-con-eficacia-david-allen.epub",
    downloads: 410,
    featured: false,
    aiAnalysis: {
      genre: "Metodología GTD & Organización",
      vibe: "Estructurado & Eficiente",
      keyConcepts: ["Vaciar la Mente", "Procesamiento de Acciones", "Contextos", "Revisión Semanal"],
      targetAudience: "Profesionales y creativos con múltiples proyectos que necesitan orden mental sin estrés.",
      aiSummary: "Sistema completo para capturar compromisos, estructurar tareas y trabajar con tranquilidad mental."
    }
  },
  {
    id: 205,
    title: "Productividad Personal: Aprende a liberarte del estrés con GTD",
    author: "José Miguel Bolívar",
    category: "Productividad & Hábitos",
    collection: "Productividad",
    format: "dual",
    year: 2017,
    language: "Español",
    pages: 280,
    description: "Una obra de referencia en habla hispana que adapta la metodología de efectividad personal a la realidad del trabajo del conocimiento actual. Desmenuza cada fase del flujo de trabajo productivo sin tecnicismos innecesarios.",
    cover: "covers/productividad-personal.jpg",
    pdf: "pdfs/productividad-y-habitos/productividad-personal-jose-bolivar.pdf",
    epub: "pdfs/epubs/productividad-personal-jose-bolivar.epub",
    downloads: 270,
    featured: false,
    aiAnalysis: {
      genre: "Efectividad Personal",
      vibe: "Claro & Metódico",
      keyConcepts: ["Trabajo del Conocimiento", "Reducción del Estrés", "Hábitos Productivos", "Enfoque"],
      targetAudience: "Trabajadores del conocimiento y emprendedores que buscan un método paso a paso en español.",
      aiSummary: "Guía práctica para tomar el control de tus tareas diarias y eliminar la sensación de desborde."
    }
  },
  {
    id: 206,
    title: "Ultraproductividad: Trabajar menos, producir más, vivir mejor",
    author: "Isra García",
    category: "Productividad & Hábitos",
    collection: "Productividad",
    format: "dual",
    year: 2018,
    language: "Español",
    pages: 240,
    description: "Un compendio de técnicas de alto rendimiento, biohacking, microhábitos y disciplina implacable aplicadas por el consultor e inconformista Isra García para maximizar la energía física y mental en cada jornada.",
    cover: "covers/ultraproductividad.jpg",
    pdf: "pdfs/productividad-y-habitos/ultraproductividad-isra-garcia.pdf",
    epub: "pdfs/epubs/ultraproductividad-isra-garcia.epub",
    downloads: 290,
    featured: false,
    aiAnalysis: {
      genre: "Alto Rendimiento & Hábitos",
      vibe: "Intenso & Disruptivo",
      keyConcepts: ["Microhábitos", "Alto Rendimiento", "Optimización de Energía", "Autodisciplina"],
      targetAudience: "Emprendedores y personas orientadas a la superación extrema de límites cotidianos.",
      aiSummary: "Metodología no convencional para multiplicar el impacto personal mediante la disciplina consciente."
    }
  },
  {
    id: 207,
    title: "Productividad personal en una semana",
    author: "Jerónimo Sánchez",
    category: "Productividad & Hábitos",
    collection: "Productividad",
    format: "dual",
    year: 2019,
    language: "Español",
    pages: 180,
    description: "Un curso acelerado de siete días diseñado para reordenar tu espacio de trabajo físico y digital, definir prioridades y establecer rutinas sostenibles de enfoque continuo.",
    cover: "covers/productividad-personal-semana.jpg",
    pdf: "pdfs/productividad-y-habitos/productividad-personal-en-una-semana.pdf",
    epub: "pdfs/epubs/productividad-personal-en-una-semana.epub",
    downloads: 215,
    featured: false,
    aiAnalysis: {
      genre: "Productividad Express",
      vibe: "Sencillo & Ágil",
      keyConcepts: ["Rutinas de Enfoque", "Organización Digital", "Siete Días", "Prioridades Claras"],
      targetAudience: "Personas que desean un cambio rápido y estructurado en su organización semanal.",
      aiSummary: "Plan intensivo de 7 días para recuperar el tiempo perdido y estructurar tu agenda con orden."
    }
  },

  // ═══════ FINANZAS & INVERSIÓN ═══════
  {
    id: 301,
    title: "El Hombre más Rico de Babilonia",
    author: "George S. Clason",
    category: "Finanzas & Inversión",
    collection: "Bestsellers",
    format: "pdf",
    year: 2012,
    language: "Español",
    pages: 160,
    description: "Un clásico eterno de la educación financiera ambientado en la antigua Babilonia. A través de parábolas amenas, enseña las reglas fundamentales para adquirir riqueza, controlar los gastos, hacer que el oro trabaje para ti y asegurar el porvenir.",
    cover: "covers/hombre-mas-rico-babilonia.png",
    pdf: "pdfs/educacion-financiera/el-hombre-mas-rico-de-babilonia.pdf",
    downloads: 480,
    featured: true,
    aiAnalysis: {
      genre: "Educación Financiera Clásica",
      vibe: "Sabio & Universal",
      keyConcepts: ["Págate a Ti Mismo Primero", "Control del Gasto", "Inversión Prudente", "Multiplicación del Oro"],
      targetAudience: "Cualquier persona que comience su camino hacia la independencia económica.",
      aiSummary: "Los principios atemporales para acumular y preservar patrimonio mediante el ahorro disciplinado."
    }
  },
  {
    id: 302,
    title: "Pequeño Cerdo Inversionista",
    author: "Sofía Macías",
    category: "Finanzas & Inversión",
    collection: "Bestsellers",
    format: "pdf",
    year: 2017,
    language: "Español",
    pages: 260,
    description: "La biblia contemporánea de las finanzas personales en español. Explica con humor y lenguaje aterrizado cómo salir de deudas, crear un fondo de emergencia, entender los intereses y empezar a invertir en fondos, bienes raíces y bolsa.",
    cover: "covers/pequeno-cerdo-inversionista.png",
    pdf: "pdfs/educacion-financiera/pequeno-cerdo-inversionista-sofia-macias.pdf",
    downloads: 365,
    featured: false,
    aiAnalysis: {
      genre: "Finanzas Prácticas",
      vibe: "Cercano & Didáctico",
      keyConcepts: ["Fondo de Emergencia", "Inversión sin Miedo", "Control de Tarjetas", "Retiro Digno"],
      targetAudience: "Jóvenes y adultos que desean dominar su dinero sin enredos técnicos.",
      aiSummary: "Guía completa para poner a trabajar tu dinero y alcanzar tranquilidad financiera a largo plazo."
    }
  },
  {
    id: 303,
    title: "La Ciencia de Hacerse Rico",
    author: "Wallace D. Wattles",
    category: "Finanzas & Inversión",
    collection: "Clásicos del Dinero",
    format: "pdf",
    year: 1910,
    language: "Español",
    pages: 110,
    description: "El texto pionero que inspiró libros como El Secreto. Wattles argumenta que la riqueza no es cuestión de suerte, sino el resultado de actuar y pensar 'de cierta manera', cultivando gratitud, visión mental y acción coordinada.",
    cover: "covers/ciencia-hacerse-rico.png",
    pdf: "pdfs/educacion-financiera/la-ciencia-de-hacerse-rico.pdf",
    downloads: 310,
    featured: false,
    aiAnalysis: {
      genre: "Mentalidad de Prosperidad",
      vibe: "Filosófico & Motivador",
      keyConcepts: ["Mentalidad de Abundancia", "Gratitud Activa", "Creación vs Competencia", "Acción Eficaz"],
      targetAudience: "Emprendedores interesados en alinear su mentalidad y fe con metas económicas ambiciosas.",
      aiSummary: "Fundamentos filosóficos sobre cómo la actitud mental interna precede a la manifestación de riqueza."
    }
  },
  {
    id: 304,
    title: "El Hombre más Rico que Jamás Existió",
    author: "Steven K. Scott",
    category: "Finanzas & Inversión",
    collection: "Bestsellers",
    format: "pdf",
    year: 2011,
    language: "Español",
    pages: 230,
    description: "Las estrategias de éxito y sabiduría del Rey Salomón traducidas a principios aplicables para los negocios y la vida contemporánea. Revela el valor de la diligencia, el consejo sabio y la integridad como cimientos del éxito duradero.",
    cover: "covers/hombre-mas-rico-jamas-existio.png",
    pdf: "pdfs/educacion-financiera/el-hombre-mas-rico-que-jamas-existio.pdf",
    downloads: 285,
    featured: false,
    aiAnalysis: {
      genre: "Sabiduría Financiera",
      vibe: "Espiritual & Estratégico",
      keyConcepts: ["Sabiduría de Salomón", "Diligencia Absoluta", "Resolución de Conflictos", "Alianzas de Valor"],
      targetAudience: "Líderes de negocios y personas que buscan prosperidad basada en valores morales.",
      aiSummary: "Estrategias del sabio bíblico Salomón para alcanzar éxito financiero y respeto comunitario."
    }
  },
  {
    id: 305,
    title: "El Lobo de Wall Street",
    author: "Jordan Belfort",
    category: "Finanzas & Inversión",
    collection: "Biografías & Finanzas",
    format: "pdf",
    year: 2013,
    language: "Español",
    pages: 420,
    description: "La trepidante autobiografía de Jordan Belfort en los vertiginosos años de Stratton Oakmont. Una mirada sin censura a la euforia bursátil, la psicología de las ventas agresivas, el auge financiero y las consecuencias de perder los límites éticos.",
    cover: "covers/lobo-wall-street.png",
    pdf: "pdfs/educacion-financiera/el-lobo-de-wall-street-jordan-belfort.pdf",
    downloads: 350,
    featured: false,
    aiAnalysis: {
      genre: "Finanzas & Memorias Reales",
      vibe: "Electrizante & Crudo",
      keyConcepts: ["Mercado Bursátil", "Persuasión Extrema", "Avaricia y Caída", "Psicología Comercial"],
      targetAudience: "Lectores atraídos por el mundo financiero, el poder de las ventas y las lecciones de cautela económica.",
      aiSummary: "Crónica descarnada sobre el auge y desplome de un imperio bursátil basado en la venta implacable."
    }
  },

  // ═══════ LIDERAZGO & ESTRATEGIA ═══════
  {
    id: 401,
    title: "Principios: Vida y Trabajo",
    author: "Ray Dalio",
    category: "Liderazgo & Estrategia",
    collection: "Bestsellers",
    format: "epub",
    year: 2018,
    language: "Español",
    pages: 590,
    description: "Ray Dalio, fundador de Bridgewater Associates (el fondo de cobertura más exitoso del planeta), comparte los principios fundamentales que creó y refinó a lo largo de 40 años. Su metodología de 'meritocracia de ideas' y transparencia radical ofrece una guía inestimable para tomar decisiones en la vida y los negocios.",
    cover: "covers/principios-ray-dalio.jpeg",
    epub: "pdfs/epubs/principios-ray-dalio.epub",
    downloads: 460,
    featured: true,
    aiAnalysis: {
      genre: "Estrategia de Decisión & Liderazgo",
      vibe: "Sistemático & Trascendental",
      keyConcepts: ["Transparencia Radical", "Meritocracia de Ideas", "Realidad Objetiva", "Sistemas de Decisión"],
      targetAudience: "Inversionistas, líderes de equipos y pensadores estratégicos que buscan sistematizar su éxito.",
      aiSummary: "Un compendio definitivo de principios comprobados para la toma de decisiones certeras sin sesgos."
    }
  },
  {
    id: 402,
    title: "El Arte de la Seducción",
    author: "Robert Greene",
    category: "Liderazgo & Estrategia",
    collection: "Estrategia",
    format: "dual",
    year: 2014,
    language: "Español",
    pages: 510,
    description: "Greene desvela los perfiles psicológicos del seductor y las dinámicas maestras del poder emocional y la influencia interpersonal. A través de figuras históricas como Cleopatra, Casanova o Napoleón, analiza cómo cautivar voluntades y dirigir la fascinación de los demás.",
    cover: "covers/arte-seduccion-robert-greene.jpg",
    pdf: "pdfs/liderazgo-y-estrategia/el-arte-de-la-seduccion-robert-greene.pdf",
    epub: "pdfs/epubs/el-arte-de-la-seduccion-robert-greene.epub",
    downloads: 380,
    featured: true,
    aiAnalysis: {
      genre: "Psicología del Poder & Persuasión",
      vibe: "Provocador & Hipnótico",
      keyConcepts: ["Perfiles Psicológicos", "Magnetismo Social", "Manejo de la Atención", "Estrategia Interpersonal"],
      targetAudience: "Estudiosos de la psicología del poder, la negociación y el arte de la persuasión sutil.",
      aiSummary: "Tratado exhaustivo sobre las claves psicológicas que gobiernan la fascinación y la influencia humana."
    }
  },
  {
    id: 403,
    title: "El Ego es el Enemigo",
    author: "Ryan Holiday",
    category: "Liderazgo & Estrategia",
    collection: "Filosofía Aplicada",
    format: "epub",
    year: 2017,
    language: "Español",
    pages: 250,
    description: "Inspirado en la filosofía estoica de Marco Aurelio y Séneca, Holiday expone cómo el ego es el mayor obstáculo en el camino hacia el éxito, el peor enemigo durante el triunfo y la causa más común del fracaso estrepitoso.",
    cover: "covers/ego-es-el-enemigo.jpg",
    epub: "pdfs/epubs/el-ego-es-el-enemigo-ryan-holiday.epub",
    downloads: 345,
    featured: false,
    aiAnalysis: {
      genre: "Estoicismo & Autocontrol",
      vibe: "Sobrio & Esclarecedor",
      keyConcepts: ["Humildad Táctica", "Aprendizaje Continuo", "Silencio vs Alarde", "Resiliencia"],
      targetAudience: "Líderes, creativos y emprendedores que desean mantenerse firmes y sobrios ante el triunfo.",
      aiSummary: "Lecciones históricas sobre cómo domar el ego para construir una trayectoria sólida y duradera."
    }
  },
  {
    id: 404,
    title: "Steve Jobs: La Biografía",
    author: "Walter Isaacson",
    category: "Liderazgo & Estrategia",
    collection: "Biografías",
    format: "pdf",
    year: 2011,
    language: "Español",
    pages: 650,
    description: "La biografía autorizada del visionario que revolucionó seis industrias: ordenadores, telefonía, animación, música, tabletas y edición digital. Un retrato apasionante sobre su obsesión por el diseño, el campo de distorsión de la realidad y la búsqueda incansable de la perfección.",
    cover: "covers/steve-jobs-biografia.png",
    pdf: "pdfs/liderazgo-y-estrategia/steve-jobs-la-biografia-walter-isaacson.pdf",
    downloads: 420,
    featured: true,
    aiAnalysis: {
      genre: "Innovación & Biografía Histórica",
      vibe: "Épico & Apasionante",
      keyConcepts: ["Campo de Distorsión", "Obsesión por el Diseño", "Intersección Humanidades y Tecnología", "Simplicidad"],
      targetAudience: "Innovadores, fundadores de startups y entusiastas de la tecnología y el diseño vanguardista.",
      aiSummary: "El relato definitivo sobre la vida, luces y sombras del genio más influyente de la era digital."
    }
  },
  {
    id: 405,
    title: "El Líder que no Tenía Cargo",
    author: "Robin Sharma",
    category: "Liderazgo & Estrategia",
    collection: "Liderazgo",
    format: "pdf",
    year: 2013,
    language: "Español",
    pages: 240,
    description: "A través de una fábula inspiradora, Robin Sharma (autor de El Monje que Vendió su Ferrari) enseña que el verdadero liderazgo no depende de títulos nobiliarios ni nombramientos oficiales, sino de la actitud interna de excelencia y servicio en cualquier puesto.",
    cover: "covers/lider-sin-cargo.png",
    pdf: "pdfs/liderazgo-y-estrategia/el-lider-que-no-tenia-cargo-robin-sharma.pdf",
    downloads: 310,
    featured: false,
    aiAnalysis: {
      genre: "Liderazgo de Servicio",
      vibe: "Motivador & Cálido",
      keyConcepts: ["Liderazgo Interior", "Excelencia sin Excusas", "Influencia sin Autoridad", "Maestría Diaria"],
      targetAudience: "Empleados, mandos intermedios y profesionales que desean inspirar a su entorno sin esperar permisos.",
      aiSummary: "Filosofía para liderar desde cualquier posición aportando valor incondicional a la organización."
    }
  },
  {
    id: 406,
    title: "La Estrategia del Océano Azul",
    author: "W. Chan Kim & Renée Mauborgne",
    category: "Liderazgo & Estrategia",
    collection: "Bestsellers",
    format: "pdf",
    year: 2015,
    language: "Español",
    pages: 330,
    description: "El libro que transformó el pensamiento corporativo mundial. Demuestra por qué competir en mercados saturados (océanos rojos) es desgastante y enseña a crear espacios de mercado vírgenes (océanos azules) donde la competencia se vuelve irrelevante mediante la innovación en valor.",
    cover: "covers/estrategia-oceano-azul.png",
    pdf: "pdfs/liderazgo-y-estrategia/la-estrategia-del-oceano-azul.pdf",
    downloads: 375,
    featured: false,
    aiAnalysis: {
      genre: "Estrategia Empresarial",
      vibe: "Revolucionario & Metódico",
      keyConcepts: ["Océano Azul", "Innovación en Valor", "Eliminar-Reducir-Incrementar-Crear", "Diferenciación"],
      targetAudience: "Emprendedores, directores generales y diseñadores de nuevos modelos de negocio.",
      aiSummary: "Metodología probada para inventar mercados desprovistos de competidores y generar crecimiento veloz."
    }
  },
  {
    id: 407,
    title: "Sprint: El método para resolver problemas y testar ideas en 5 días",
    author: "Jake Knapp",
    category: "Liderazgo & Estrategia",
    collection: "Innovación",
    format: "pdf",
    year: 2016,
    language: "Español",
    pages: 290,
    description: "Creado en Google Ventures y probado en más de cien startups (como Uber, Slack y Blue Bottle), el proceso Design Sprint comprime meses de deliberación en una sola semana de prototipado rápido y validación directa con usuarios reales.",
    cover: "covers/sprint-jake-knapp.png",
    pdf: "pdfs/liderazgo-y-estrategia/sprint-resolver-problemas-jake-knapp.pdf",
    downloads: 295,
    featured: false,
    aiAnalysis: {
      genre: "Design Sprint & Metodologías Ágiles",
      vibe: "Ágil & Eficaz",
      keyConcepts: ["Prototipado Rápido", "5 Días de Trabajo", "Testeo con Usuarios", "Decisiones Colectivas"],
      targetAudience: "Equipos de producto, diseñadores UX y fundadores que necesitan validar hipótesis velozmente.",
      aiSummary: "El proceso paso a paso de Google para validar ideas millonarias en apenas cinco jornadas de trabajo."
    }
  },

  // ═══════ MARKETING & VENTAS ═══════
  {
    id: 501,
    title: "Vendedores Perros: Cómo ser una bestia en las ventas",
    author: "Blair Singer",
    category: "Marketing & Ventas",
    collection: "Bestsellers",
    format: "pdf",
    year: 2015,
    language: "Español",
    pages: 250,
    description: "Con prólogo de Robert Kiyosaki, Blair Singer clasifica a los comerciales en cinco razas caninas (Pit Bull, Golden Retriever, Caniche, Chihuahua y Basset Hound) para que descubras tu estilo natural de venta y desarrolles las destrezas de un cerrador legendario.",
    cover: "covers/vendedores-perros.png",
    pdf: "pdfs/marketing-y-ventas/vendedores-perros-blair-singer.pdf",
    downloads: 410,
    featured: true,
    aiAnalysis: {
      genre: "Técnicas de Cierre & Psicología Comercial",
      vibe: "Enérgico & Pragmático",
      keyConcepts: ["Razas de Ventas", "Manejo de Objeciones", "Energía Comercial", "Fidelización"],
      targetAudience: "Vendedores, agentes inmobiliarios y autónomos que buscan maximizar sus conversiones.",
      aiSummary: "Enfoque dinámico para explotar tus fortalezas innatas y convertirte en una fiera del cierre comercial."
    }
  },
  {
    id: 502,
    title: "Rompe la Barrera del No",
    author: "Chris Voss",
    category: "Marketing & Ventas",
    collection: "Negociación",
    format: "epub",
    year: 2016,
    language: "Español",
    pages: 310,
    description: "El principal negociador internacional de rehenes del FBI revela las técnicas de empatía táctica, escucha calibrada y preguntas abiertas que salvan vidas y permiten ganar cualquier negociación comercial o cotidiana sin ceder terreno.",
    cover: "covers/rompe-barrera-del-no.jpg",
    epub: "pdfs/epubs/rompe-la-barrera-del-no-chris-voss.epub",
    downloads: 385,
    featured: true,
    aiAnalysis: {
      genre: "Negociación de Alto Riesgo",
      vibe: "Táctico & Fascinante",
      keyConcepts: ["Empatía Táctica", "Espejo Verbal", "Preguntas Calibradas", "La Voz del Locutor Nocturno"],
      targetAudience: "Negociadores, empresarios y cualquier persona que enfrente conversaciones cruciales.",
      aiSummary: "Tácticas psicológicas del FBI para inclinar la balanza a tu favor en cualquier discusión o trato."
    }
  },
  {
    id: 503,
    title: "Vendes o Vendes: Cómo salirte con la tuya en los negocios y en la vida",
    author: "Grant Cardone",
    category: "Marketing & Ventas",
    collection: "Ventas",
    format: "pdf",
    year: 2014,
    language: "Español",
    pages: 160,
    description: "Grant Cardone defiende que la venta no es solo un empleo, sino un requisito indispensable para la vida. Quien no sabe vender sus ideas, su talento o sus proyectos, termina comprado por las ideas de los demás.",
    cover: "covers/vendes-o-vendes.png",
    pdf: "pdfs/marketing-y-ventas/vendes-o-vendes-grant-cardone.pdf",
    downloads: 330,
    featured: false,
    aiAnalysis: {
      genre: "Mentalidad Comercial 10X",
      vibe: "Agresivo & Motivador",
      keyConcepts: ["Todo es una Venta", "Convicción Absoluta", "Manejo del Rechazo", "Acción Masiva"],
      targetAudience: "Vendedores, agentes y dueños de negocio que necesitan hambre de victoria comercial.",
      aiSummary: "Discurso enérgico para asumir que tu éxito depende de tu capacidad para convencer a otros."
    }
  },
  {
    id: 504,
    title: "Vender es Humano: La sorprendente verdad sobre cómo mover a los demás",
    author: "Daniel H. Pink",
    category: "Marketing & Ventas",
    collection: "Psicología Comercial",
    format: "pdf",
    year: 2015,
    language: "Español",
    pages: 270,
    description: "Basado en estudios científicos y sociológicos, Pink demuestra que hoy en día uno de cada nueve trabajadores está en ventas, pero los otros ocho pasan sus jornadas convenciendo, persuadiendo e influyendo a otros. Presenta las tres nuevas reglas: sintonía, flotabilidad y claridad.",
    cover: "covers/vender-es-humano.png",
    pdf: "pdfs/marketing-y-ventas/vender-es-humano-daniel-pink.pdf",
    downloads: 295,
    featured: false,
    aiAnalysis: {
      genre: "Sociología de la Persuasión",
      vibe: "Inteligente & Elegante",
      keyConcepts: ["Sintonía con el Cliente", "Flotabilidad ante el No", "Claridad de Problema", "Mover a Otros"],
      targetAudience: "Profesionales modernos que desean influir con honestidad y rigor psicológico.",
      aiSummary: "Una reinterpretación ética de la venta como un acto genuino de comprensión humana."
    }
  },
  {
    id: 505,
    title: "¡Hazlo! (Poke the Box)",
    author: "Seth Godin",
    category: "Marketing & Ventas",
    collection: "Iniciativa",
    format: "pdf",
    year: 2012,
    language: "Español",
    pages: 100,
    description: "Un manifiesto electrizante sobre el poder de tomar la iniciativa. Godin nos reta a dejar de esperar órdenes, superar el miedo al qué dirán y lanzarnos al ruedo con curiosidad indomable.",
    cover: "covers/hazlo-seth-godin.png",
    pdf: "pdfs/marketing-y-ventas/hazlo-seth-godin.pdf",
    downloads: 320,
    featured: false,
    aiAnalysis: {
      genre: "Iniciativa & Manifiesto Emprendedor",
      vibe: "Provocador & Conciso",
      keyConcepts: ["Tomar la Iniciativa", "Vencer el Miedo al Fracaso", "Experimentación Continua", "Lanzar"],
      targetAudience: "Personas atrapadas en la parálisis por análisis que necesitan un empujón para actuar.",
      aiSummary: "Llamado a la acción visceral para atreverte a empezar tus proyectos sin pedir permiso a nadie."
    }
  },
  {
    id: 506,
    title: "Tribus: Necesitamos que tú nos lideres",
    author: "Seth Godin",
    category: "Marketing & Ventas",
    collection: "Comunidad & Marketing",
    format: "pdf",
    year: 2013,
    language: "Español",
    pages: 150,
    description: "Internet ha pulverizado las barreras geográficas, permitiendo que florezcan miles de tribus unidas por ideas y pasiones compartidas. Seth Godin demuestra que el marketing moderno no consiste en gritar a la masa, sino en conectar y liderar a tu tribu.",
    cover: "covers/tribus-seth-godin.png",
    pdf: "pdfs/marketing-y-ventas/tribus-seth-godin.pdf",
    downloads: 310,
    featured: false,
    aiAnalysis: {
      genre: "Creación de Comunidades",
      vibe: "Visionario & Inspirador",
      keyConcepts: ["Creación de Tribus", "Liderazgo Comunitario", "Pasión Compartida", "Conexión Auténtica"],
      targetAudience: "Creadores de contenido, activistas y marcas que desean construir una base leal de seguidores.",
      aiSummary: "Las claves para articular movimientos y reunir a personas apasionadas alrededor de un propósito común."
    }
  },

  // ═══════ CRECIMIENTO PERSONAL & SOCIEDAD ═══════
  {
    id: 601,
    title: "Una Vida sin Límites",
    author: "Nick Vujicic",
    category: "Crecimiento Personal",
    collection: "Superación",
    format: "pdf",
    year: 2012,
    language: "Español",
    pages: 280,
    description: "Nacido sin brazos ni piernas debido al síndrome de focomelia, Nick Vujicic comparte su testimonio conmovedor de cómo transformó el desespero en una vida de propósito extraordinario, amor incondicional y fe inquebrantable.",
    cover: "covers/vida-sin-limites.png",
    pdf: "pdfs/desarrollo-personal/una-vida-sin-limites-nick-vujicic.pdf",
    downloads: 360,
    featured: true,
    aiAnalysis: {
      genre: "Superación & Testimonio Real",
      vibe: "Conmovedor & Esperanzador",
      keyConcepts: ["Gratitud Incondicional", "Propósito Mayor", "Resiliencia Extrema", "Fe"],
      targetAudience: "Cualquier persona que enfrente adversidades graves y necesite renovar su amor por la vida.",
      aiSummary: "Lección magistral de coraje y gratitud ante dificultades físicas y emocionales aparentemente insuperables."
    }
  },
  {
    id: 602,
    title: "Usar el Cerebro: Conocer nuestra mente para vivir mejor",
    author: "Facundo Manes",
    category: "Crecimiento Personal",
    collection: "Neurociencia Divulgativa",
    format: "epub",
    year: 2015,
    language: "Español",
    pages: 350,
    description: "El reconocido neurocientífico Facundo Manes desvela los misterios de la toma de decisiones, la inteligencia colectiva, el impacto del optimismo en la longevidad y cómo el conocimiento de la mente nos ayuda a vivir con mayor plenitud.",
    cover: "covers/usar-el-cerebro.jpeg",
    epub: "pdfs/epubs/usar-el-cerebro-facundo-manes.epub",
    downloads: 320,
    featured: false,
    aiAnalysis: {
      genre: "Neurociencia para la Vida Diaria",
      vibe: "Cálido & Didáctico",
      keyConcepts: ["Toma de Decisiones", "Inteligencia Emocional", "Optimismo Biológico", "Salud Cerebral"],
      targetAudience: "Lectores interesados en aplicar los hallazgos de la neurociencia al bienestar cotidiano.",
      aiSummary: "Explicación amena de cómo los descubrimientos cerebrales mejoran nuestra calidad de vida diaria."
    }
  },
  {
    id: 603,
    title: "21 Lecciones para el Siglo XXI",
    author: "Yuval Noah Harari",
    category: "Crecimiento Personal",
    collection: "Pensamiento Global",
    format: "pdf",
    year: 2018,
    language: "Español",
    pages: 400,
    description: "Tras el impacto colosal de Sapiens y Homo Deus, el historiador Harari enfoca su mirada en los desafíos urgentes del presente: la disrupción de la inteligencia artificial, las noticias falsas, la crisis climática, la pérdida de empleo y el sentido de la verdad.",
    cover: "covers/21-lecciones-siglo-xxi.png",
    pdf: "pdfs/desarrollo-personal/21-lecciones-siglo-xxi-yuval-harari.pdf",
    downloads: 390,
    featured: true,
    aiAnalysis: {
      genre: "Filosofía Global & Ensayo",
      vibe: "Lúcido & Urgente",
      keyConcepts: ["Algoritmos e IA", "Posverdad", "Desafío Climático", "Meditación y Claridad"],
      targetAudience: "Ciudadanos conscientes, pensadores y estudiantes de la encrucijada tecnológica y social.",
      aiSummary: "Brillante mapa de orientación para no perderse en el caos informativo y tecnológico de nuestro tiempo."
    }
  },
  {
    id: 604,
    title: "Sálvese Quien Pueda: El futuro del trabajo en la era de la automatización",
    author: "Andrés Oppenheimer",
    category: "Crecimiento Personal",
    collection: "Futuro del Empleo",
    format: "epub",
    year: 2018,
    language: "Español",
    pages: 360,
    description: "Una investigación periodística de alcance mundial en Silicon Valley, Japón y Europa sobre qué profesiones sobrevivirán a la robótica y la inteligencia artificial y cómo reinventarse para no quedar obsoleto.",
    cover: "covers/salvese-quien-pueda.jpg",
    epub: "pdfs/epubs/salvese-quien-pueda-andres-oppenheimer.epub",
    downloads: 305,
    featured: false,
    aiAnalysis: {
      genre: "Prospectiva Laboral & Tecnología",
      vibe: "Alerta & Revelador",
      keyConcepts: ["Automatización Laboral", "Reinvención Profesional", "Habilidades Blandas", "Futuro de los Oficios"],
      targetAudience: "Trabajadores, docentes y jóvenes que necesitan planificar su futuro profesional con visión.",
      aiSummary: "Radiografía de las profesiones amenazadas por la IA y las habilidades humanas que serán insustituibles."
    }
  },
  {
    id: 605,
    title: "¿Qué Harías si no Tuvieras Miedo?",
    author: "Borja Vilaseca",
    category: "Crecimiento Personal",
    collection: "Desarrollo Personal",
    format: "epub",
    year: 2016,
    language: "Español",
    pages: 220,
    description: "Vilaseca cuestiona el viejo paradigma de la educación industrial, el empleo seguro y el miedo al cambio, proponiendo una transición hacia el autoconocimiento, la vocación genuina y la reinvención como profesional libre.",
    cover: "covers/que-harias-sin-miedo.jpeg",
    epub: "pdfs/epubs/que-harias-si-no-tuvieras-miedo-borja-vilaseca.epub",
    downloads: 315,
    featured: false,
    aiAnalysis: {
      genre: "Autoconocimiento & Libertad Financiera",
      vibe: "Desafiante & Liberador",
      keyConcepts: ["Vencer el Miedo", "Vocación Auténtica", "Reinvención Laboral", "Mentalidad Abundante"],
      targetAudience: "Personas inconformes con su empleo tradicional que anhelan alinear su vocación con sus ingresos.",
      aiSummary: "Invitación radical a superar condicionamientos heredados y diseñar una vida alineada con tu verdad."
    }
  },

  // ═══════ COLECCIÓN NATIONAL GEOGRAPHIC: CIENCIA & CEREBRO ═══════
  {
    id: 101,
    title: "El Cerebro: Descifrar y potenciar nuestro órgano más complejo",
    author: "National Geographic",
    category: "Neurociencia & Mente",
    collection: "National Geographic",
    format: "pdf",
    year: 2022,
    language: "Español",
    pages: 144,
    description: "Una expedición científica fascinante al interior del órgano más sofisticado del universo conocido. Analiza cómo 86.000 millones de neuronas orquestan la percepción, el pensamiento y la consciencia humana.",
    cover: "covers/01-el-cerebro.png",
    pdf: "pdfs/national-geographic/01-el-cerebro.pdf",
    downloads: 312,
    featured: true,
    aiAnalysis: {
      genre: "Neuroanatomía & Ciencias Cognitivas",
      vibe: "Científico & Esclarecedor",
      keyConcepts: ["86 Mil Millones de Neuronas", "Corteza Cerebral", "Mapeo Cerebral", "Bioquímica Sináptica"],
      targetAudience: "Estudiantes, divulgadores y lectores que desean comprender la estructura del cerebro.",
      aiSummary: "Exposición integral de la arquitectura cerebral humana y las fronteras de la investigación actual."
    }
  },
  {
    id: 102,
    title: "La Memoria: Las conexiones neuronales que encierran nuestro pasado",
    author: "National Geographic",
    category: "Neurociencia & Mente",
    collection: "National Geographic",
    format: "pdf",
    year: 2022,
    language: "Español",
    pages: 141,
    description: "Cómo codifica, almacena y reconstruye el cerebro nuestros recuerdos. Desde el papel esencial del hipocampo y la corteza hasta la plasticidad sináptica y la función biológica del olvido.",
    cover: "covers/02-la-memoria.png",
    pdf: "pdfs/national-geographic/02-la-memoria.pdf",
    downloads: 275,
    featured: true,
    aiAnalysis: {
      genre: "Neurobiología de la Memoria",
      vibe: "Profundo & Fascinante",
      keyConcepts: ["Hipocampo", "Memoria a Largo Plazo", "Consolidación Sináptica", "Enagramas"],
      targetAudience: "Interesados en optimizar su capacidad de retención y comprender la huella del pasado.",
      aiSummary: "Análisis exhaustivo de cómo el cerebro archiva y recrea las experiencias vitales que definen el yo."
    }
  },
  {
    id: 103,
    title: "La Conciencia: La más enigmática de las funciones cerebrales",
    author: "National Geographic",
    category: "Tecnología & Futuro",
    collection: "National Geographic",
    format: "pdf",
    year: 2022,
    language: "Español",
    pages: 141,
    description: "¿Cómo emergen las experiencias subjetivas, los colores y las emociones a partir de impulsos electroquímicos? Este volumen aborda el 'problema difícil' de la ciencia y los límites de la mente y la IA.",
    cover: "covers/03-la-conciencia.png",
    pdf: "pdfs/national-geographic/03-la-conciencia.pdf",
    downloads: 240,
    featured: true,
    aiAnalysis: {
      genre: "Neurofilosofía & Ciencias de la Mente",
      vibe: "Reflexivo & Trascendental",
      keyConcepts: ["Experiencia Subjetiva", "Qualia", "Libre Albedrío", "Espacio Global"],
      targetAudience: "Mentes curiosas atraídas por el enigma de la existencia consciente y la inteligencia artificial.",
      aiSummary: "Indagación científica y filosófica sobre el origen biológico de la percepción consciente del yo."
    }
  },
  {
    id: 104,
    title: "La Edad del Cerebro: ¿Se puede frenar el envejecimiento del cerebro?",
    author: "National Geographic",
    category: "Salud & Longevidad",
    collection: "National Geographic",
    format: "pdf",
    year: 2022,
    language: "Español",
    pages: 61,
    description: "Una guía respaldada por la ciencia moderna sobre la evolución del cerebro a lo largo de la vida. Explica cómo la reserva cognitiva y el ejercicio mental permiten mitigar el deterioro neurológico.",
    cover: "covers/04-la-edad-del-cerebro.png",
    pdf: "pdfs/national-geographic/04-la-edad-del-cerebro.pdf",
    downloads: 198,
    featured: false,
    aiAnalysis: {
      genre: "Neurogerontología & Longevidad",
      vibe: "Preventivo & Práctico",
      keyConcepts: ["Reserva Cognitiva", "Envejecimiento Saludable", "Neurogénesis Adulta", "Estilo de Vida"],
      targetAudience: "Adultos de cualquier edad que buscan blindar su salud cerebral frente al paso del tiempo.",
      aiSummary: "Pautas basadas en evidencia para estimular la plasticidad y preservar las capacidades en la vejez."
    }
  },
  {
    id: 105,
    title: "Las Emociones: La base neurológica del comportamiento",
    author: "National Geographic",
    category: "Psicología & Conducta",
    collection: "National Geographic",
    format: "pdf",
    year: 2022,
    language: "Español",
    pages: 61,
    description: "Lejos de ser obstáculos a la razón, las emociones son herramientas adaptativas cruciales. Este libro desvela el funcionamiento del sistema límbico, la amígdala y la química del afecto humano.",
    cover: "covers/05-las-emociones.png",
    pdf: "pdfs/national-geographic/05-las-emociones.pdf",
    downloads: 215,
    featured: false,
    aiAnalysis: {
      genre: "Neurobiología Emocional",
      vibe: "Empático & Analítico",
      keyConcepts: ["Sistema Límbico", "Amígdala Cerebral", "Regulación Afectiva", "Marcador Somático"],
      targetAudience: "Lectores interesados en el autoconocimiento emocional y las bases fisiológicas de la conducta.",
      aiSummary: "Demuestra por qué la inteligencia emocional depende de la interacción balanceada entre emoción y razón."
    }
  },
  {
    id: 106,
    title: "La Naturaleza del Sueño: ¿Qué ocurre en el cerebro mientras dormimos?",
    author: "National Geographic",
    category: "Salud & Longevidad",
    collection: "National Geographic",
    format: "pdf",
    year: 2022,
    language: "Español",
    pages: 56,
    description: "El sueño no es un estado inerte, sino una fase de intensa calibración metabólica. National Geographic examina los ritmos circadianos, las fases REM y el sistema glinfático de limpieza de residuos tóxicos.",
    cover: "covers/06-la-naturaleza-del-sueno.png",
    pdf: "pdfs/national-geographic/06-la-naturaleza-del-sueno.pdf",
    downloads: 230,
    featured: false,
    aiAnalysis: {
      genre: "Neurobiología del Descanso",
      vibe: "Regenerador & Revelador",
      keyConcepts: ["Fases REM", "Sistema Glinfático", "Ritmo Circadiano", "Consolidación de Memoria"],
      targetAudience: "Personas buscando optimizar su descanso, rendimiento mental y salud metabólica integral.",
      aiSummary: "Explica cómo dormir adecuadamente desintoxica el cerebro y consolida los aprendizajes del día."
    }
  },
  {
    id: 107,
    title: "La Neurociencia del Aprendizaje: La construcción del cerebro por la experiencia",
    author: "National Geographic",
    category: "Tecnología & Futuro",
    collection: "National Geographic",
    format: "pdf",
    year: 2022,
    language: "Español",
    pages: 51,
    description: "El aprendizaje físico de la red sináptica. Descubre los mecanismos de la potenciación a largo plazo, la atención focalizada y las estrategias más eficaces para adquirir nuevas destrezas.",
    cover: "covers/07-la-neurociencia-del-aprendizaje.png",
    pdf: "pdfs/national-geographic/07-la-neurociencia-del-aprendizaje.pdf",
    downloads: 260,
    featured: false,
    aiAnalysis: {
      genre: "Neuroeducación & Cognición",
      vibe: "Formativo & Aplicado",
      keyConcepts: ["Potenciación a Largo Plazo", "Atención Selectiva", "Adquisición de Destrezas", "Plasticidad"],
      targetAudience: "Educadores, autodidactas y profesionales enfocados en maximizar su aprendizaje.",
      aiSummary: "Claves de la neurociencia para estructurar sesiones de estudio y asimilar conocimientos velozmente."
    }
  },
  {
    id: 108,
    title: "El Futuro del Alzhéimer: Vencer el olvido",
    author: "National Geographic",
    category: "Salud & Longevidad",
    collection: "National Geographic",
    format: "pdf",
    year: 2022,
    language: "Español",
    pages: 56,
    description: "Un análisis riguroso sobre las líneas de investigación más prometedoras contra el alzhéimer: placas de proteína beta-amiloide, ovillos tau, diagnóstico precoz por biomarcadores e inmunoterapia.",
    cover: "covers/08-el-futuro-del-alzheimer.png",
    pdf: "pdfs/national-geographic/08-el-futuro-del-alzheimer.pdf",
    downloads: 185,
    featured: false,
    aiAnalysis: {
      genre: "Medicina Neurológica",
      vibe: "Esperanzador & Científico",
      keyConcepts: ["Beta-Amiloide", "Proteína Tau", "Diagnóstico Precoz", "Inmunoterapia Cerebral"],
      targetAudience: "Familias, profesionales de la salud e investigadores de la prevención del deterioro cognitivo.",
      aiSummary: "Estado del arte de los tratamientos médicos y hábitos de vida que prometen contener el alzhéimer."
    }
  },
  {
    id: 109,
    title: "El Cerebro Social: Por qué estamos diseñados para conectar con los demás",
    author: "National Geographic",
    category: "Psicología & Conducta",
    collection: "National Geographic",
    format: "pdf",
    year: 2022,
    language: "Español",
    pages: 56,
    description: "Nuestra especie logró sobrevivir gracias a la cooperación comunitaria. Analiza la neuroquímica del apego y la oxitocina, el dolor social en el cerebro y cómo leemos intenciones ajenas.",
    cover: "covers/09-el-cerebro-social.png",
    pdf: "pdfs/national-geographic/09-el-cerebro-social.pdf",
    downloads: 205,
    featured: false,
    aiAnalysis: {
      genre: "Neurociencia Social",
      vibe: "Conector & Empático",
      keyConcepts: ["Oxitocina", "Dolor Social", "Cooperación Humana", "Teoría de la Mente"],
      targetAudience: "Líderes, comunicadores y personas que buscan comprender la necesidad de pertenencia.",
      aiSummary: "Evidencias neurológicas de por qué el bienestar psicológico está ligado a nuestras relaciones."
    }
  },
  {
    id: 110,
    title: "El Cerebro Infantil: Los secretos del desarrollo cognitivo",
    author: "National Geographic",
    category: "Psicología & Conducta",
    collection: "National Geographic",
    format: "pdf",
    year: 2022,
    language: "Español",
    pages: 56,
    description: "Durante la infancia se construyen los cimientos del pensamiento. Examina la explosión de sinapsis en los primeros años, los periodos sensibles del lenguaje y el impacto determinante del afecto.",
    cover: "covers/10-el-cerebro-infantil.png",
    pdf: "pdfs/national-geographic/10-el-cerebro-infantil.pdf",
    downloads: 190,
    featured: false,
    aiAnalysis: {
      genre: "Neurodesarrollo & Crianza",
      vibe: "Sensible & Esclarecedor",
      keyConcepts: ["Periodos Críticos", "Sinaptogénesis", "Estimulación Temprana", "Vínculo Seguro"],
      targetAudience: "Padres, pedagogos y psicólogos infantiles comprometidos con el desarrollo en la niñez.",
      aiSummary: "Manual esencial sobre cómo el entorno y la afectividad moldean el cerebro en sus etapas plásticas."
    }
  },
  {
    id: 111,
    title: "El Cerebro Creativo: La capacidad de pensar de una forma diferente a la habitual",
    author: "National Geographic",
    category: "Tecnología & Futuro",
    collection: "National Geographic",
    format: "pdf",
    year: 2022,
    language: "Español",
    pages: 56,
    description: "¿Qué ocurre en la corteza cerebral cuando surge una idea original? National Geographic explora el diálogo entre la red por defecto, el pensamiento divergente y el estado de flujo (flow).",
    cover: "covers/11-el-cerebro-creativo.png",
    pdf: "pdfs/national-geographic/11-el-cerebro-creativo.pdf",
    downloads: 295,
    featured: true,
    aiAnalysis: {
      genre: "Neurociencia de la Creatividad",
      vibe: "Estimulante & Visionario",
      keyConcepts: ["Pensamiento Divergente", "Red por Defecto", "Estado de Flujo", "Momento Insight"],
      targetAudience: "Creadores, emprendedores, artistas y estrategas que desean potenciar su ingenio lateral.",
      aiSummary: "Cómo entrenar el cerebro para conectar conceptos dispares y resolver problemas con genialidad."
    }
  },
  {
    id: 112,
    title: "La Plasticidad Cerebral: ¿Somos arquitectos de nuestro propio cerebro?",
    author: "National Geographic",
    category: "Neurociencia & Mente",
    collection: "National Geographic",
    format: "pdf",
    year: 2022,
    language: "Español",
    pages: 51,
    description: "La demostración de que el cerebro es un órgano maleable. Examina la recuperación motora tras lesiones, adaptación en músicos y la capacidad de remodelar sinapsis mediante el entrenamiento.",
    cover: "covers/12-la-plasticidad-cerebral.png",
    pdf: "pdfs/national-geographic/12-la-plasticidad-cerebral.pdf",
    downloads: 320,
    featured: true,
    aiAnalysis: {
      genre: "Neuroplasticidad Funcional",
      vibe: "Empoderador & Científico",
      keyConcepts: ["Remodelación Sináptica", "Recuperación Neuronal", "Práctica Deliberada", "Cerebro Maleable"],
      targetAudience: "Cualquier persona que desee romper viejos hábitos y reprogramar sus facultades mentales.",
      aiSummary: "La prueba científica definitiva de que nunca es tarde para transformar la configuración de nuestra mente."
    }
  },
  {
    id: 113,
    title: "La Evolución del Cerebro: La fascinante historia de nuestra mente",
    author: "National Geographic",
    category: "Tecnología & Futuro",
    collection: "National Geographic",
    format: "pdf",
    year: 2022,
    language: "Español",
    pages: 51,
    description: "Una crónica evolutiva que explica cómo simples redes nerviosas dieron paso al encéfalo humano. Aborda el coste metabólico de la encefalización, el uso de herramientas y las presiones evolutivas.",
    cover: "covers/13-la-evolucion-del-cerebro.png",
    pdf: "pdfs/national-geographic/13-la-evolucion-del-cerebro.pdf",
    downloads: 175,
    featured: false,
    aiAnalysis: {
      genre: "Antropología & Evolución Biológica",
      vibe: "Histórico & Riguroso",
      keyConcepts: ["Hominización", "Córtex Prefrontal", "Presión Selectiva", "Encefalización"],
      targetAudience: "Amantes de la biología evolutiva, la antropología y los orígenes del pensamiento simbólico.",
      aiSummary: "El viaje evolutivo que convirtió al cerebro del Homo sapiens en la máquina cognitiva dominante del planeta."
    }
  },
  {
    id: 114,
    title: "Las Neuronas Espejo y la Empatía: Las claves neurológicas del comportamiento social",
    author: "National Geographic",
    category: "Neurociencia & Mente",
    collection: "National Geographic",
    format: "pdf",
    year: 2022,
    language: "Español",
    pages: 51,
    description: "Descubiertas en la Universidad de Parma, las neuronas espejo son la base celular del aprendizaje vicario y la resonancia afectiva. Un estudio sobre cómo sintonizamos con los sentimientos ajenos.",
    cover: "covers/15-las-neuronas-espejo.png",
    pdf: "pdfs/national-geographic/15-las-neuronas-espejo.pdf",
    downloads: 245,
    featured: false,
    aiAnalysis: {
      genre: "Neurobiología de la Empatía",
      vibe: "Conmovedor & Preciso",
      keyConcepts: ["Neuronas Espejo", "Resonancia Motora", "Empatía Afectiva", "Imitación Social"],
      targetAudience: "Profesionales de la comunicación, psicólogos e interesados en la inteligencia interpersonal.",
      aiSummary: "Las bases biológicas que nos permiten ponernos en el lugar del otro y sentir compasión genuina."
    }
  },
  {
    id: 115,
    title: "La Lucha contra el Cáncer: En busca de una cura definitiva",
    author: "National Geographic",
    category: "Salud & Longevidad",
    collection: "National Geographic",
    format: "pdf",
    year: 2022,
    language: "Español",
    pages: 143,
    description: "Un balance completo sobre la mayor gesta médica contemporánea. Detalla la investigación en tumores cerebrales, la biología molecular celular, los anticuerpos monoclonales y las terapias celulares CAR-T.",
    cover: "covers/16-la-lucha-contra-el-cancer.png",
    pdf: "pdfs/national-geographic/16-la-lucha-contra-el-cancer.pdf",
    downloads: 210,
    featured: false,
    aiAnalysis: {
      genre: "Oncología & Biología Molecular",
      vibe: "Riguroso & Esperanzador",
      keyConcepts: ["Inmunoterapia CAR-T", "Biopsia Líquida", "Genética Tumoral", "Oncología de Precisión"],
      targetAudience: "Interesados en los avances más recientes de la biomedicina y la lucha contra tumores complejos.",
      aiSummary: "Cómo las terapias biológicas dirigidas están transformando el pronóstico de los tumores más difíciles."
    }
  },
  {
    id: 116,
    title: "El Cerebro y las Hormonas: Los agentes que regulan nuestra conducta",
    author: "National Geographic",
    category: "Psicología & Conducta",
    collection: "National Geographic",
    format: "pdf",
    year: 2022,
    language: "Español",
    pages: 56,
    description: "El diálogo continuo entre el sistema nervioso y el endocrino. Cómo el hipotálamo y la hipófisis dirigen la liberación hormonal y el impacto del cortisol, dopamina y serotonina en el estado de ánimo.",
    cover: "covers/17-el-cerebro-y-las-hormonas.png",
    pdf: "pdfs/national-geographic/17-el-cerebro-y-las-hormonas.pdf",
    downloads: 220,
    featured: false,
    aiAnalysis: {
      genre: "Neuroendocrinología",
      vibe: "Químico & Revelador",
      keyConcepts: ["Eje Hipotálamo-Hipófisis", "Cortisol y Estrés", "Dopamina y Recompensa", "Serotonina"],
      targetAudience: "Lectores que quieren equilibrar su bienestar fisiológico comprendiendo su química interna.",
      aiSummary: "Una mirada profunda a cómo las moléculas químicas condicionan nuestras sensaciones y temperamento."
    }
  },
  {
    id: 117,
    title: "El Conectoma: El mapa de las conexiones neuronales",
    author: "National Geographic",
    category: "Neurociencia & Mente",
    collection: "National Geographic",
    format: "pdf",
    year: 2022,
    language: "Español",
    pages: 67,
    description: "El ambicioso Proyecto Conectoma Humano busca trazar cada 'cable' neuronal del encéfalo. Explica la tractografía por resonancia magnética y la teoría de redes cerebrales.",
    cover: "covers/19-el-conectoma.png",
    pdf: "pdfs/national-geographic/19-el-conectoma.pdf",
    downloads: 255,
    featured: true,
    aiAnalysis: {
      genre: "Conectómica & Redes Complejas",
      vibe: "Futurista & Preciso",
      keyConcepts: ["Tractografía", "Redes de Pequeño Mundo", "Sustancia Blanca", "Cableado Neuronal"],
      targetAudience: "Aficionados a la ciencia de datos, la física de redes y el mapa estructural del pensamiento.",
      aiSummary: "El ambicioso mapa tridimensional que revela cómo dialogan entre sí los distintos centros cerebrales."
    }
  },
  {
    id: 118,
    title: "El Lenguaje: Las bases neuronales de la comunicación",
    author: "National Geographic",
    category: "Neurociencia & Mente",
    collection: "National Geographic",
    format: "pdf",
    year: 2022,
    language: "Español",
    pages: 61,
    description: "¿Cómo traduce el cerebro ondas sonoras en pensamientos complejos? Recorre las áreas de Broca y Wernicke, el bilingüismo en el cerebro infantil y el origen de la palabra articulada.",
    cover: "covers/21-el-lenguaje.png",
    pdf: "pdfs/national-geographic/21-el-lenguaje.pdf",
    downloads: 195,
    featured: false,
    aiAnalysis: {
      genre: "Biolingüística & Neurocognición",
      vibe: "Elocuente & Científico",
      keyConcepts: ["Área de Broca", "Área de Wernicke", "Fascículo Arqueado", "Gramática Universal"],
      targetAudience: "Lingüistas, escritores, comunicadores y apasionados del poder del lenguaje humano.",
      aiSummary: "Desvela la prodigiosa maquinaria neural que nos permite dialogar, formular conceptos y transmitir cultura."
    }
  },
  {
    id: 119,
    title: "La Regeneración Neuronal: El reto de crear nuevas neuronas",
    author: "National Geographic",
    category: "Salud & Longevidad",
    collection: "National Geographic",
    format: "pdf",
    year: 2022,
    language: "Español",
    pages: 51,
    description: "La ruptura del dogma de que las neuronas no se reproducen en la vida adulta. Un informe sobre las células madre neurales del hipocampo y las terapias de reparación nerviosa.",
    cover: "covers/22-la-regeneracion-neuronal.png",
    pdf: "pdfs/national-geographic/22-la-regeneracion-neuronal.pdf",
    downloads: 200,
    featured: false,
    aiAnalysis: {
      genre: "Medicina Regenerativa",
      vibe: "Esperanzador & Vanguardista",
      keyConcepts: ["Neurogénesis Adulta", "Células Madre", "Factor BDNF", "Reparación Medular"],
      targetAudience: "Interesados en la regeneración celular y la capacidad del cuerpo para sanar el tejido nervioso.",
      aiSummary: "Cómo la ciencia moderna está aprendiendo a estimular el nacimiento de nuevas neuronas en cerebros adultos."
    }
  },
  {
    id: 120,
    title: "La Electricidad del Cerebro: Los secretos de la actividad cerebral",
    author: "National Geographic",
    category: "Neurociencia & Mente",
    collection: "National Geographic",
    format: "pdf",
    year: 2022,
    language: "Español",
    pages: 51,
    description: "Cada sensación, pensamiento y sueño se expresa como una onda bioeléctrica. Descubre el papel de los canales iónicos, los ritmos cerebrales (ondas gamma, beta, alfa y delta) y la electroencefalografía.",
    cover: "covers/23-la-electricidad-del-cerebro.png",
    pdf: "pdfs/national-geographic/23-la-electricidad-del-cerebro.pdf",
    downloads: 225,
    featured: false,
    aiAnalysis: {
      genre: "Biofísica & Neurofisiología",
      vibe: "Energético & Preciso",
      keyConcepts: ["Potenciales de Acción", "Ondas Cerebrales", "Canales Iónicos", "Sincronía Neuronal"],
      targetAudience: "Curiosos de la física biológica, la neuroingeniería y los circuitos oscilatorios de la mente.",
      aiSummary: "Explica cómo miles de millones de micro-corrientes eléctricas coordinadas dan origen a la mente humana."
    }
  },
  {
    id: 121,
    title: "Las Interfaces Cerebro-Máquina: Tecnología para ampliar nuestras capacidades",
    author: "National Geographic",
    category: "Tecnología & Futuro",
    collection: "National Geographic",
    format: "pdf",
    year: 2022,
    language: "Español",
    pages: 51,
    description: "La convergencia definitiva entre el tejido cerebral y los microprocesadores. Explora implantes corticales, neuroprótesis biónicas que restauran la movilidad y los horizontes del transhumanismo.",
    cover: "covers/27-las-interfaces-cerebro-maquina.png",
    pdf: "pdfs/national-geographic/27-las-interfaces-cerebro-maquina.pdf",
    downloads: 340,
    featured: true,
    aiAnalysis: {
      genre: "Biotecnología & Neuroingeniería",
      vibe: "Futurista & Disruptivo",
      keyConcepts: ["Brain-Computer Interface", "Neuroprótesis", "Decodificación Neuronal", "Transhumanismo"],
      targetAudience: "Entusiastas de la tecnología puntera, cibernética, IA y el futuro de las capacidades humanas.",
      aiSummary: "Las tecnologías que hoy permiten controlar brazos robóticos y computadoras directamente con el pensamiento."
    }
  },

  // ── OBRAS CLÁSICAS Y DE AUTOR ──
  {
    id: 2,
    title: "El Principito",
    author: "Antoine de Saint-Exupéry",
    category: "Literatura Clásica",
    collection: "General",
    format: "pdf",
    year: 1943,
    language: "Español",
    pages: 96,
    description: "Un piloto averiado en el desierto del Sahara se encuentra con un niño viajero de otro planeta. A través de diálogos poéticos, la obra reflexiona sobre la amistad, el amor y la ceguera del mundo adulto frente a lo invisible.",
    cover: "covers/el-principito.svg",
    pdf: "pdfs/el-principito.pdf",
    downloads: 165,
    featured: false,
    aiAnalysis: {
      genre: "Literatura Clásica & Fábula Filosófica",
      vibe: "Poético & Reflexivo",
      keyConcepts: ["Lo Esencial Invisible", "Amistad Auténtica", "Mirada Pura", "Responsabilidad Afectiva"],
      targetAudience: "Lectores de todas las edades que deseen reencontrarse con la sencillez y el afecto desinteresado.",
      aiSummary: "Una fábula conmovedora que invita a mirar el mundo con los ojos del corazón."
    }
  },
  {
    id: 3,
    title: "Cien Años de Soledad",
    author: "Gabriel García Márquez",
    category: "Ficción & Novela",
    collection: "General",
    format: "pdf",
    year: 1967,
    language: "Español",
    pages: 471,
    description: "La saga legendaria de la familia Buendía en el pueblo de Macondo. Monumento del realismo mágico donde se entrelazan la soledad ancestral, las guerras civiles y la fatalidad cíclica del destino humano.",
    cover: "covers/cien-anios.svg",
    pdf: "pdfs/cien-anios.pdf",
    downloads: 142,
    featured: false,
    aiAnalysis: {
      genre: "Realismo Mágico",
      vibe: "Místico & Desbordante",
      keyConcepts: ["Tiempo Cíclico", "Soledad Hereditaria", "Macondo", "Realismo Mágico"],
      targetAudience: "Amantes de la narrativa épica, la prosa poética y las grandes obras maestras de la literatura universal.",
      aiSummary: "Retrato magistral de una estirpe condenada a cien años de soledad a través de generaciones de pasión y olvido."
    }
  },
  {
    id: 4,
    title: "El Arte de la Guerra",
    author: "Sun Tzu",
    category: "Filosofía & Estrategia",
    collection: "General",
    format: "pdf",
    year: -500,
    language: "Español",
    pages: 120,
    description: "El tratado militar y filosófico más influyente de la historia oriental. Sus principios sobre la anticipación, la adaptabilidad y vencer sin combatir se han convertido en la biblia de la estrategia y el liderazgo.",
    cover: "covers/arte-guerra.svg",
    pdf: "pdfs/arte-guerra.pdf",
    downloads: 180,
    featured: false,
    aiAnalysis: {
      genre: "Filosofía Estratégica",
      vibe: "Estratégico & Pragmático",
      keyConcepts: ["Vencer sin Combatir", "Conocimiento del Rival", "Flexibilidad", "Liderazgo Soberano"],
      targetAudience: "Emprendedores, negociadores, líderes y pensadores tácticos que buscan resolver conflictos con sabiduría.",
      aiSummary: "Tratado milenario sobre cómo dominar la mente del rival y prevalecer mediante la preparación impecable."
    }
  }
];

// ═══════════════════════════════════════════════════════════
//  SOLICITUDES EN TIEMPO REAL (COMPROMISO 10 HORAS)
// ═══════════════════════════════════════════════════════════
const INITIAL_REQUESTS = [
  {
    id: "REQ-7421",
    bookTitle: "Hábitos Atómicos",
    author: "James Clear",
    requester: "@carlos_lectura",
    contact: "@carlos_lectura",
    requestedAt: Date.now() - (3 * 3600 * 1000),
    readyAt: Date.now() - (3 * 3600 * 1000) + (10 * 3600 * 1000),
    status: "processing",
    downloadUrl: null
  },
  {
    id: "REQ-3189",
    bookTitle: "El Hombre en Busca de Sentido",
    author: "Viktor Frankl",
    requester: "@elena_v",
    contact: "@elena_v",
    requestedAt: Date.now() - (11 * 3600 * 1000),
    readyAt: Date.now() - (1 * 3600 * 1000),
    status: "ready",
    downloadUrl: "#"
  }
];
