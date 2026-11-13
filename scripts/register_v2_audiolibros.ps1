$booksJsonPath = "C:\Users\sebas\OneDrive\Documentos\GitHub\BIBLIOTYAN\data\books.json"
$dataJsPath = "C:\Users\sebas\OneDrive\Documentos\GitHub\BIBLIOTYAN\js\data.js"

$books = Get-Content $booksJsonPath -Raw -Encoding UTF8 | ConvertFrom-Json

$baseAudioUrl = "https://github.com/sebastianemanuel967-star/BIBLIOTYAN/releases/download/audiolibros-v2/"

$newBooks = @(
    [PSCustomObject]@{
        id = 2664
        title = "La Divina Comedia: El Infierno (Narración Completa)"
        author = "Dante Alighieri"
        category = "Filosofía & Sabiduría"
        collection = "Colección Audiolibros"
        subtopic = "Clásicos Universales, Moral y Alegoría Espiritual"
        format = "audio"
        audioUrl = $baseAudioUrl + "la-divina-comedia-infierno-dante.m4a"
        tracks = @(
            [PSCustomObject]@{
                title = "La Divina Comedia: Los Círculos del Infierno (Narración Completa)"
                url = $baseAudioUrl + "la-divina-comedia-infierno-dante.m4a"
            }
        )
        pages = 220
        year = 1320
        language = "Español"
        description = "La obra cumbre de la literatura universal que narra la travesía de Dante a través de los nueve círculos del infierno guiado por Virgilio. Esta versión en audio de alta calidad traslada al oyente al viaje espiritual de justicia, castigo y redención moral más influyente de la civilización occidental."
        cover = "covers/c-audio-la-divina-comedia-dante.svg"
        downloads = 2150
        featured = $true
        aiAnalysis = [PSCustomObject]@{
            genre = "Clásicos Universales, Poesía Épica & Filosofía Moral"
            vibe = "Épico, Profundo, Dramático & Transformador"
            keyConcepts = @(
                "Alegoría del Alma Humana y las Consecuencias de las Acciones",
                "Estructura Simbólica de los Círculos y la Justicia Retributiva",
                "El Rol de la Razón Guiadora (Virgilio) hacia la Luz",
                "Trascendencia Moral y Superación de las Sombras Interiores"
            )
            targetAudience = "Amantes de la literatura inmortal, estudiantes de humanidades y mentes reflexivas interesadas en los pilares culturales del pensamiento occidental."
            aiSummary = "Producción integral de audio que revive los cantos del Infierno dantesco con entonación magistral. Ideal para experimentar una de las mayores joyas literarias de la humanidad mientras viajas o estudias."
        }
    },
    [PSCustomObject]@{
        id = 2665
        title = "Las Intermitencias de la Muerte (Audiolibro Íntegro)"
        author = "José Saramago"
        category = "Filosofía & Sabiduría"
        collection = "Colección Audiolibros"
        subtopic = "Premio Nobel de Literatura, Ironía y Existencialismo"
        format = "audio"
        audioUrl = $baseAudioUrl + "las-intermitencias-de-la-muerte-saramago.mp3"
        tracks = @(
            [PSCustomObject]@{
                title = "Las Intermitencias de la Muerte: Obra Completa"
                url = $baseAudioUrl + "las-intermitencias-de-la-muerte-saramago.mp3"
            }
        )
        pages = 240
        year = 2005
        language = "Español"
        description = "¿Qué pasaría si de pronto nadie volviera a morir en un país entero? El Premio Nobel José Saramago desata una sátira filosófica brillante y conmovedora sobre la inmortalidad, las crisis sociales y el poder del amor humano frente a la inevitabilidad de la muerte."
        cover = "covers/c-audio-las-intermitencias-de-la-muerte-saramago.svg"
        downloads = 1980
        featured = $true
        aiAnalysis = [PSCustomObject]@{
            genre = "Narrativa Filosófica, Ficción Existencial & Sátira Social"
            vibe = "Ingenioso, Satírico, Profundo & Revelador"
            keyConcepts = @(
                "La Muerte como Condición Necesaria del Sentido de la Vida",
                "Colapso de las Estructuras Religiosas, Estatales y Funerarias",
                "La Humanización de la Muerte a través de la Música y el Afecto",
                "La Paradoja de la Inmortalidad y el Envejecimiento Infinito"
            )
            targetAudience = "Lectores que valoran la prosa de premios Nobel, dilemas existenciales y relatos con ironía inteligente y belleza lírica."
            aiSummary = "Audiolibro completo de la aclamada novela de Saramago. Una experiencia auditiva hipnótica que desafía nuestra comprensión del tiempo, la despedida y el amor."
        }
    },
    [PSCustomObject]@{
        id = 2666
        title = "El Escarabajo de Oro (Audiolibro Dramatizado)"
        author = "Edgar Allan Poe"
        category = "Filosofía & Sabiduría"
        collection = "Colección Audiolibros"
        subtopic = "Literatura Clásica, Misterio y Criptografía"
        format = "audio"
        audioUrl = $baseAudioUrl + "el-escarabajo-de-oro-poe.mp3"
        tracks = @(
            [PSCustomObject]@{
                title = "El Escarabajo de Oro: Narración y Criptograma Completo"
                url = $baseAudioUrl + "el-escarabajo-de-oro-poe.mp3"
            }
        )
        pages = 95
        year = 1843
        language = "Español"
        description = "La obra maestra del misterio y la deducción lógica de Edgar Allan Poe. Sigue a William Legrand y su insólito descubrimiento en una isla desolada: un escarabajo de brillo dorado y un criptograma cifrado que esconde el legendario tesoro del Capitán Kidd."
        cover = "covers/c-audio-el-escarabajo-de-oro-poe.svg"
        downloads = 1750
        featured = $false
        aiAnalysis = [PSCustomObject]@{
            genre = "Misterio, Aventura Clásica & Criptografía"
            vibe = "Intrigante, Analítico, Clásico & Cautivador"
            keyConcepts = @(
                "El Poder del Pensamiento Criptográfico y la Deducción Racional",
                "La Búsqueda Obsesiva del Tesoro Oculto",
                "La Relación entre la Obsesión Intelectual y la Realidad",
                "Pionero del Cuento Policial y de Enigmas Modernos"
            )
            targetAudience = "Amantes de los relatos de detectives, enigmas y los clásicos maestros del suspense decimonónico."
            aiSummary = "Dramatización en audio que sumerge al oyente en la atmósfera gótica y aventurera de Poe, desglosando el desciframiento del código paso a paso."
        }
    },
    [PSCustomObject]@{
        id = 2667
        title = "Veinte Poemas de Amor y una Canción Desesperada"
        author = "Pablo Neruda"
        category = "Filosofía & Sabiduría"
        collection = "Colección Audiolibros"
        subtopic = "Poesía Inmortal, Sentimiento y Belleza Lírica"
        format = "audio"
        audioUrl = $baseAudioUrl + "veinte-poemas-de-amor-neruda.mp3"
        tracks = @(
            [PSCustomObject]@{
                title = "Veinte Poemas de Amor y una Canción Desesperada: Recitado Íntegro"
                url = $baseAudioUrl + "veinte-poemas-de-amor-neruda.mp3"
            }
        )
        pages = 80
        year = 1924
        language = "Español"
        description = "El poemario en lengua española más leído y declamado de todos los tiempos. La voz y la poesía de Neruda exploran la pasión, el deslumbramiento amoroso, la melancolía del recuerdo y el desgarro del adiós con una musicalidad inconfundible."
        cover = "covers/c-audio-veinte-poemas-de-amor-neruda.svg"
        downloads = 2340
        featured = $true
        aiAnalysis = [PSCustomObject]@{
            genre = "Poesía Lírica, Vanguardia Hispanoamericana & Romance"
            vibe = "Íntimo, Melancólico, Sublime & Apasionado"
            keyConcepts = @(
                "La Fusión entre la Naturaleza y el Cuerpo Amado",
                "El Dolor de la Ausencia y la Nostalgia como Arte",
                "La Pureza de la Palabra Poética Joven",
                "Memoria Sensorial y Resonancia Emocional Eterna"
            )
            targetAudience = "Espíritus sensibles, creadores y amantes de la poesía con el máximo calibre lírico del idioma castellano."
            aiSummary = "Versión en audio recitada con cadencia y sensibilidad artística de los 20 poemas más la canción desesperada. Un deleite auditivo para soñar y reflexionar."
        }
    },
    [PSCustomObject]@{
        id = 2668
        title = "Psicología del Color: Cómo Actúan los Colores sobre los Sentimientos"
        author = "Eva Heller"
        category = "Psicología & Comportamiento"
        collection = "Colección Audiolibros"
        subtopic = "Percepción, Emoción, Simbolismo y Creatividad"
        format = "audio"
        audioUrl = $baseAudioUrl + "psicologia-del-color-eva-heller.m4a"
        tracks = @(
            [PSCustomObject]@{
                title = "Psicología del Color: Impacto en Emociones y Comportamiento"
                url = $baseAudioUrl + "psicologia-del-color-eva-heller.m4a"
            }
        )
        pages = 280
        year = 2004
        language = "Español"
        description = "El texto fundamental de referencia sobre la relación intrínseca entre los colores y nuestros sentimientos, recuerdos y decisiones. Eva Heller desvela cómo reacciona el cerebro ante cada tonalidad y cómo el diseño y el marketing aprovechan estos estímulos."
        cover = "covers/c-audio-psicologia-del-color-eva-heller.svg"
        downloads = 1890
        featured = $true
        aiAnalysis = [PSCustomObject]@{
            genre = "Psicología Cognitiva, Diseño, Simbolismo & Marketing"
            vibe = "Fascinante, Didáctico, Revelador & Práctico"
            keyConcepts = @(
                "Asociaciones Subconscientes y Arquetípicas de Cada Color",
                "El Efecto Psicoemocional del Azul, Rojo, Violeta y Verde",
                "Uso Estratégico en Marcas, Entornos de Trabajo y Vida Diaria",
                "Diferencia entre Simbolismo Cultural e Impacto Biológico"
            )
            targetAudience = "Diseñadores, especialistas en marketing, psicólogos y cualquier creador interesado en comunicar con máximo impacto visual y emocional."
            aiSummary = "Audiolibro especializado que detalla la ciencia detrás del color y su efecto directo en las decisiones y el estado anímico de las personas."
        }
    },
    [PSCustomObject]@{
        id = 2669
        title = "Haz Que Funcione: El Camino hacia la Productividad sin Estrés"
        author = "David Allen"
        category = "Productividad & Hábitos"
        collection = "Colección Audiolibros"
        subtopic = "Metodología GTD (Getting Things Done) y Claridad Mental"
        format = "audio"
        audioUrl = $baseAudioUrl + "haz-que-funcione-david-allen.mp3"
        tracks = @(
            [PSCustomObject]@{
                title = "Haz Que Funcione: Sistema GTD de Control y Perspectiva"
                url = $baseAudioUrl + "haz-que-funcione-david-allen.mp3"
            }
        )
        pages = 320
        year = 2008
        language = "Español"
        description = "La continuación y profundización de 'Organízate con Eficacia' (Getting Things Done). David Allen te enseña a implementar un sistema integral de control mental, perspectiva a largo plazo y ejecución táctica para eliminar la saturación y trabajar con serenidad absoluta."
        cover = "covers/c-audio-haz-que-funcione-david-allen.svg"
        downloads = 2120
        featured = $true
        aiAnalysis = [PSCustomObject]@{
            genre = "Productividad Personal, Metodología GTD & Gestión del Tiempo"
            vibe = "Estructurado, Transformador, Práctico & Liberador"
            keyConcepts = @(
                "Mente Vacía como el Agua (Mind Like Water): Cero Bucles Abiertos",
                "Los 6 Horizontes de Enfoque: Desde las Tareas hasta el Propósito de Vida",
                "Procesamiento Inmediato y Bandejas de Entrada Confiables",
                "Revisión Semanal como Pilar de la Paz Mental Ejecutiva"
            )
            targetAudience = "Profesionales sobrecargados, directivos, freelancers y emprendedores que buscan ordenar su flujo de trabajo y recobrar el control de su vida."
            aiSummary = "Entrenamiento en audio del método GTD para alcanzar maestría personal y ejecutar proyectos complejos sin un ápice de estrés."
        }
    },
    [PSCustomObject]@{
        id = 2670
        title = "Las 100 Leyes Absolutas del Éxito Empresarial"
        author = "Brian Tracy"
        category = "Liderazgo & Desarrollo"
        collection = "Colección Audiolibros"
        subtopic = "Éxito, Negocios y Leyes Universales del Logro"
        format = "audio"
        audioUrl = $baseAudioUrl + "100-leyes-inquebrantables-exito-brian-tracy.mp3"
        tracks = @(
            [PSCustomObject]@{
                title = "Las 100 Leyes del Éxito en los Negocios: Principios Clave"
                url = $baseAudioUrl + "100-leyes-inquebrantables-exito-brian-tracy.mp3"
            }
        )
        pages = 250
        year = 2000
        language = "Español"
        description = "Brian Tracy condensa las leyes naturales inmutables que gobiernan los negocios, las ventas, el liderazgo y la acumulación de riqueza. Leyes como Causa y Efecto, la Atracción, la Correspondencia y la Compensación explicadas con rigor práctico."
        cover = "covers/c-audio-100-leyes-exito-brian-tracy.svg"
        downloads = 2410
        featured = $true
        aiAnalysis = [PSCustomObject]@{
            genre = "Estrategia Empresarial, Éxito en Ventas & Mentalidad Ejecutiva"
            vibe = "Directo, Autorizado, Didáctico & Práctico"
            keyConcepts = @(
                "Ley de Causa y Efecto: El Éxito No es Casualidad sino Causalidad",
                "Ley de la Compensación: Recibes en Proporción al Valor que Aportas",
                "Ley del Enfoque Absoluto y Especialización en Nichos Rentables",
                "Integridad Impecable como el Mayor Activo de un Líder de Negocios"
            )
            targetAudience = "Dueños de negocio, consultores, ejecutivos de ventas y líderes corporativos enfocados en la aceleración de resultados."
            aiSummary = "Seminario magistral en audio de Brian Tracy que desgrana las reglas del juego financiero y empresarial para construir un patrimonio duradero."
        }
    },
    [PSCustomObject]@{
        id = 2671
        title = "Dominando el Cambio Inevitable"
        author = "Brian Tracy"
        category = "Liderazgo & Desarrollo"
        collection = "Colección Audiolibros"
        subtopic = "Adaptabilidad, Resiliencia y Nuevas Oportunidades"
        format = "audio"
        audioUrl = $baseAudioUrl + "sobre-el-cambio-brian-tracy.mp3"
        tracks = @(
            [PSCustomObject]@{
                title = "Dominando el Cambio: Cómo Prosperar en Tiempos de Incertidumbre"
                url = $baseAudioUrl + "sobre-el-cambio-brian-tracy.mp3"
            }
        )
        pages = 140
        year = 2003
        language = "Español"
        description = "En un mundo en transformación acelerada, la habilidad más crítica es aprender a abrazar y dirigir el cambio a tu favor. Brian Tracy comparte herramientas psicológicas para vencer la resistencia interna y convertir las crisis en plataformas de victoria."
        cover = "covers/c-audio-sobre-el-cambio-brian-tracy.svg"
        downloads = 1680
        featured = $false
        aiAnalysis = [PSCustomObject]@{
            genre = "Gestión del Cambio, Inteligencia Emocional & Resiliencia"
            vibe = "Alentador, Pragmático, Seguro & Estratégico"
            keyConcepts = @(
                "Aceptación Radical del Cambio como la Única Constante",
                "Superación de la Inercia y la Zona de Confort Paralizante",
                "Desarrollo de Flexibilidad Mental y Aprendizaje Continuo",
                "Toma de Decisiones Proactiva ante Escenarios Disruptivos"
            )
            targetAudience = "Líderes de equipo, profesionales en transición y personas que enfrentan reestructuraciones laborales o cambios de rumbo de vida."
            aiSummary = "Conferencia enfocada de Brian Tracy que provee las pautas mentales indispensables para reinventarse con éxito ante cualquier incertidumbre."
        }
    },
    [PSCustomObject]@{
        id = 2672
        title = "METAS: El Sistema Científico para Lograr lo que Deseas"
        author = "Zig Ziglar"
        category = "Productividad & Hábitos"
        collection = "Colección Audiolibros"
        subtopic = "Planificación de Metas y Actitud Ganadora"
        format = "audio"
        audioUrl = $baseAudioUrl + "metas-zig-ziglar.mp3"
        tracks = @(
            [PSCustomObject]@{
                title = "METAS: Cómo Formular, Perseguir y Conquistar Tus Objetivos"
                url = $baseAudioUrl + "metas-zig-ziglar.mp3"
            }
        )
        pages = 180
        year = 1998
        language = "Español"
        description = "El legendario orador Zig Ziglar presenta su fórmula probada para transformar deseos vagos en metas cristalinas y alcanzables. Aprende a alinear tus valores, vencer los obstáculos intermedios y mantener una motivación inquebrantable."
        cover = "covers/c-audio-metas-zig-ziglar.svg"
        downloads = 2190
        featured = $true
        aiAnalysis = [PSCustomObject]@{
            genre = "Fijación de Metas, Motivación Clásica & Rendimiento Personal"
            vibe = "Enérgico, Inspirador, Estructurado & Humano"
            keyConcepts = @(
                "Diferencia entre Deseo Casual y Meta con Fecha Límite Innegociable",
                "La Regla de Oro: Puedes Lograr Todo si Ayudas a Otros a Lograr lo Suyo",
                "Estrategias Diarias de Auto-sugestión y Compromiso Inflexible",
                "Mapeo de Obstáculos Previos y Selección de Aliados Estratégicos"
            )
            targetAudience = "Personas que desean superar la procrastinación, definir un plan de vida de 1 a 5 años y consolidar logros tangibles."
            aiSummary = "Uno de los audiolibros formativos más icónicos del desarrollo personal. Zig Ziglar te guía paso a paso hacia la conquista de tus objetivos."
        }
    },
    [PSCustomObject]@{
        id = 2673
        title = "Cómo Tener Tu Mejor Año: Estrategias de Enfoque y Maestría"
        author = "Tony Robbins"
        category = "Autoayuda & Mente"
        collection = "Colección Audiolibros"
        subtopic = "Metas de Alto Rendimiento y Psicología del Éxito"
        format = "audio"
        audioUrl = $baseAudioUrl + "como-tener-tu-mejor-ano-tony-robbins.mp3"
        tracks = @(
            [PSCustomObject]@{
                title = "Cómo Tener Tu Mejor Año: Despertar de la Energía y la Fisiología de Poder"
                url = $baseAudioUrl + "como-tener-tu-mejor-ano-tony-robbins.mp3"
            }
        )
        pages = 160
        year = 2019
        language = "Español"
        description = "Tony Robbins despliega su intensidad única para guiarte en una inmersión psicológica que reinicia tus estándares personales. No se trata de metas mediocres: se trata de elevar tus expectativas, cambiar tu fisiología y tomar acción masiva."
        cover = "covers/c-audio-como-tener-tu-mejor-ano-tony-robbins.svg"
        downloads = 2780
        featured = $true
        aiAnalysis = [PSCustomObject]@{
            genre = "Poder Personal, PNL (Programación Neurolingüística) & Alto Rendimiento"
            vibe = "Poderoso, Electrizante, Desafiante & Transformador"
            keyConcepts = @(
                "La Tríada de la Experiencia: Fisiología, Foco y Lenguaje",
                "Elevar los Estándares: De 'Debería' a 'Tengo Que'",
                "Acción Masiva Imparable como Antídoto Inmediato contra el Miedo",
                "Planificación Rápida de Resultados (RPM: Rapid Planning Method)"
            )
            targetAudience = "Emprendedores, atletas y líderes con hambre de superación que exigen un salto cuántico en su calidad de vida y resultados anuales."
            aiSummary = "Sesión magistral en audio con la voz y fuerza de Tony Robbins para reprogramar el estado interno y dominar el año con enfoque láser."
        }
    },
    [PSCustomObject]@{
        id = 2674
        title = "Aprender a Ser Ambicioso: Conferencia Magistral"
        author = "Mauricio Benoist"
        category = "Finanzas & Inversión"
        collection = "Colección Audiolibros"
        subtopic = "Mentalidad Emprendedora y Crecimiento Exponencial"
        format = "audio"
        audioUrl = $baseAudioUrl + "aprender-a-ser-ambicioso-mauricio-benoist.mp3"
        tracks = @(
            [PSCustomObject]@{
                title = "Aprender a Ser Ambicioso: Rompiendo el Techo Financiero"
                url = $baseAudioUrl + "aprender-a-ser-ambicioso-mauricio-benoist.mp3"
            }
        )
        pages = 110
        year = 2021
        language = "Español"
        description = "Mauricio Benoist desafía los paradigmas de falsa modestia y escasez que limitan el potencial económico de las personas. Aprende a resignificar la ambición como un deber de servicio, liderazgo e impacto social positivo."
        cover = "covers/c-audio-aprender-a-ser-ambicioso-mauricio-benoist.svg"
        downloads = 1530
        featured = $false
        aiAnalysis = [PSCustomObject]@{
            genre = "Mentalidad Financiera, Ventas Estratégicas & Emprendimiento"
            vibe = "Directo, Sin Filtros, Disruptivo & Motivador"
            keyConcepts = @(
                "La Ambición Sana como Motor del Progreso Comunitario",
                "Destrucción del Complejo de Culpabilidad ante el Dinero",
                "Escalabilidad de Negocios y Construcción de Equipos de Alto Nivel",
                "Vender con Convicción y Enfoque en la Resolución de Problemas"
            )
            targetAudience = "Emprendedores noveles y consolidados que quieren romper techos mentales de ingresos y acelerar el crecimiento de sus empresas."
            aiSummary = "Conferencia de alto impacto de Mauricio Benoist que despierta la urgencia por crecer, arriesgar con inteligencia y perseguir metas grandiosas."
        }
    },
    [PSCustomObject]@{
        id = 2675
        title = "Disciplina, Organización y Limpieza: La Sabiduría Japonesa"
        author = "Yokoi Kenji Díaz"
        category = "Espiritualidad & Sabiduría"
        collection = "Colección Audiolibros"
        subtopic = "Cultura, Hábitos de Disciplina e Integridad"
        format = "audio"
        audioUrl = $baseAudioUrl + "disciplina-organizacion-limpieza-yokoi-kenji.m4a"
        tracks = @(
            [PSCustomObject]@{
                title = "Disciplina, Organización y Limpieza: Los 3 Pilares del Éxito Oriental"
                url = $baseAudioUrl + "disciplina-organizacion-limpieza-yokoi-kenji.m4a"
            }
        )
        pages = 130
        year = 2018
        language = "Español"
        description = "La famosa conferencia donde Yokoi Kenji acuñó la célebre frase: 'La disciplina tarde o temprano vencerá a la inteligencia'. Un análisis profundo de los valores orientales de puntualidad, orden y limpieza aplicados a la realidad cotidiana de América Latina."
        cover = "covers/c-audio-disciplina-organizacion-yokoi-kenji.svg"
        downloads = 3120
        featured = $true
        aiAnalysis = [PSCustomObject]@{
            genre = "Valores de Vida, Sabiduría Intercultural & Hábitos de Éxito"
            vibe = "Emotivo, Profundo, Humorístico & Inspirador"
            keyConcepts = @(
                "La Disciplina como la Habilidad Definitiva frente al Mero Talento",
                "Organización del Espacio y su Reflejo en la Claridad Mental",
                "La Limpieza y el Desapego de lo Inútil para Abrir Espacio a lo Nuevo",
                "Integración de la Calidez Latina con el Rigor Japonés"
            )
            targetAudience = "Jóvenes, padres, educadores y profesionales que desean forjar un carácter íntegro y hábitos sólidos y perdurables."
            aiSummary = "La conferencia más aclamada de Yokoi Kenji Díaz. Una lección de vida inolvidable que rescata la dignidad del trabajo, el orden y la constancia."
        }
    },
    [PSCustomObject]@{
        id = 2676
        title = "Mitos y Verdades: La Realidad de la Cultura Latinoamericana y Japonesa"
        author = "Yokoi Kenji Díaz"
        category = "Espiritualidad & Sabiduría"
        collection = "Colección Audiolibros"
        subtopic = "Choque Cultural, Identidad y Realismo Social"
        format = "audio"
        audioUrl = $baseAudioUrl + "mitos-y-verdades-yokoi-kenji.mp3"
        tracks = @(
            [PSCustomObject]@{
                title = "Mitos y Verdades: Desmontando Creencias Limitantes Culturales"
                url = $baseAudioUrl + "mitos-y-verdades-yokoi-kenji.mp3"
            }
        )
        pages = 120
        year = 2017
        language = "Español"
        description = "¿Es Japón realmente superior en inteligencia? ¿Es América Latina pobre por destino o por mentalidad? Yokoi Kenji desmonta con vivencias en primera persona los estereotipos culturales, resaltando las verdaderas virtudes y áreas de mejora de ambos mundos."
        cover = "covers/c-audio-mitos-y-verdades-yokoi-kenji.svg"
        downloads = 2240
        featured = $false
        aiAnalysis = [PSCustomObject]@{
            genre = "Sociología Práctica, Desarrollo Humano & Liderazgo Cultural"
            vibe = "Reflexivo, Revelador, Cercano & Transformador"
            keyConcepts = @(
                "Desmitificación de la Superioridad Genética o Intelectual",
                "El Rol de los Procesos Sostenibles sobre la Emoción Efímera",
                "Autoestima Colectiva y Amor Propio por las Raíces",
                "Creación de Riqueza a través de la Confianza Mutua"
            )
            targetAudience = "Estudiantes, líderes comunitarios y todo aquel que busca comprender cómo la cultura moldea la prosperidad de las naciones."
            aiSummary = "Un diálogo fascinante que te hará valorar tus fortalezas culturales mientras incorporas el sentido de responsabilidad oriental."
        }
    },
    [PSCustomObject]@{
        id = 2677
        title = "La Generación Actual: Jóvenes, Propósito y Trascendencia"
        author = "Yokoi Kenji Díaz"
        category = "Espiritualidad & Sabiduría"
        collection = "Colección Audiolibros"
        subtopic = "Juventud, Principios y Esperanza Social"
        format = "audio"
        audioUrl = $baseAudioUrl + "la-generacion-actual-yokoi-kenji.mp3"
        tracks = @(
            [PSCustomObject]@{
                title = "La Generación Actual: Retos, Redes Sociales y Propósito Real"
                url = $baseAudioUrl + "la-generacion-actual-yokoi-kenji.mp3"
            }
        )
        pages = 115
        year = 2019
        language = "Español"
        description = "Un llamado apasionado a la juventud y a quienes los acompañan. Yokoi aborda los desafíos del vacío existencial, la presión digital y la soledad contemporánea, brindando claves para encontrar una causa noble por la cual vivir y luchar."
        cover = "covers/c-audio-la-generacion-actual-yokoi-kenji.svg"
        downloads = 1810
        featured = $false
        aiAnalysis = [PSCustomObject]@{
            genre = "Liderazgo Juvenil, Salud Emocional & Filosofía de Vida"
            vibe = "Esperanzador, Íntimo, Vibrante & Conmovedor"
            keyConcepts = @(
                "La Búsqueda de un Sentido Profundo en la Era de la Inmediatez",
                "Vencer la Comparación Destructiva en Redes Sociales",
                "El Valor de la Paciencia y la Maduración Interior",
                "Construir Lazos Afectivos Reales y Solidarios"
            )
            targetAudience = "Jóvenes universitarios, padres de familia, mentores y docentes interesados en la formación de nuevas generaciones conscientes."
            aiSummary = "Conferencia emotiva y lúcida sobre la juventud moderna, su dolor invisible y su inmenso poder para transformar positivamente el entorno."
        }
    },
    [PSCustomObject]@{
        id = 2678
        title = "Venciendo los Temores y la Duda Interior"
        author = "Daniel Habif"
        category = "Autoayuda & Mente"
        collection = "Colección Audiolibros"
        subtopic = "Coraje, Valentía y Conquista de Límites"
        format = "audio"
        audioUrl = $baseAudioUrl + "los-temores-daniel-habif.mp3"
        tracks = @(
            [PSCustomObject]@{
                title = "Los Temores: Cómo Enfrentar lo Desconocido y Avanzar"
                url = $baseAudioUrl + "los-temores-daniel-habif.mp3"
            }
        )
        pages = 100
        year = 2020
        language = "Español"
        description = "Con su estilo apasionado y poético, Daniel Habif disecciona el miedo como un impostor que magnifica los riesgos y minimiza nuestra capacidad. Una inyección de adrenalina espiritual para desarmar la parálisis y saltar hacia tus convicciones."
        cover = "covers/c-audio-los-temores-daniel-habif.svg"
        downloads = 2490
        featured = $true
        aiAnalysis = [PSCustomObject]@{
            genre = "Oratoria Motivacional, Resiliencia Emocional & Crecimiento Espiritual"
            vibe = "Intenso, Poético, Ferviente & Enardecedor"
            keyConcepts = @(
                "El Miedo como Brújula: Donde Está el Terror Está la Conquista",
                "Silenciar las Voces del Juicio Ajeno y la Inseguridad",
                "La Fe como Fuerza de Tracción Superior a la Lógica Humana",
                "Compromiso Innegociable con el Propósito Asignado"
            )
            targetAudience = "Personas que sienten que el miedo las tiene frenadas para iniciar su proyecto, cambiar de rumbo o alzar su propia voz."
            aiSummary = "Un audio encendido y emotivo de Daniel Habif diseñado para reencender la llama interior y desterrar de una vez por todas los temores."
        }
    },
    [PSCustomObject]@{
        id = 2679
        title = "Dominio Propio: Cómo Gobernar tus Emociones"
        author = "Daniel Habif"
        category = "Autoayuda & Mente"
        collection = "Colección Audiolibros"
        subtopic = "Inteligencia Emocional y Fuerza Interior"
        format = "audio"
        audioUrl = $baseAudioUrl + "dominio-propio-daniel-habif.mp3"
        tracks = @(
            [PSCustomObject]@{
                title = "Dominio Propio: La Mayor Victoria es Conquistarse a Uno Mismo"
                url = $baseAudioUrl + "dominio-propio-daniel-habif.mp3"
            }
        )
        pages = 95
        year = 2021
        language = "Español"
        description = "El verdadero liderazgo comienza gobernando la propia mente, los impulsos y las reacciones. Habif expone cómo el dominio propio es la armadura fundamental para no dejarse arrastrar por la ira, el rencor o la desesperación."
        cover = "covers/c-audio-dominio-propio-daniel-habif.svg"
        downloads = 2170
        featured = $false
        aiAnalysis = [PSCustomObject]@{
            genre = "Autocontrol, Inteligencia Emocional & Madurez Espiritual"
            vibe = "Firme, Directo, Elevado & Sanador"
            keyConcepts = @(
                "La Autodisciplina como la Máxima Expresión del Amor Propio",
                "Diferencia entre Reaccionar Ciegamente y Responder con Sabiduría",
                "El Vencimiento de las Adicciones y los Hábitos Tóxicos",
                "La Calma en Medio de la Tempestad como Poder Definitivo"
            )
            targetAudience = "Luchadores cotidianos que buscan serenidad mental, control de impulsos y una vida cimentada en la templanza."
            aiSummary = "Reflexión poderosa sobre el arte supremo de la templanza y el gobierno de la mente sobre los estados emocionales transitorios."
        }
    },
    [PSCustomObject]@{
        id = 2680
        title = "Tu Promesa No Tarda: Mensaje de Fé y Paciencia Activa"
        author = "Daniel Habif"
        category = "Espiritualidad & Sabiduría"
        collection = "Colección Audiolibros"
        subtopic = "Esperanza, Perseverancia y Fuerza Espiritual"
        format = "audio"
        audioUrl = $baseAudioUrl + "tu-promesa-no-tarda-daniel-habif.mp3"
        tracks = @(
            [PSCustomObject]@{
                title = "Tu Promesa No Tarda: Mantener la Fe en Tiempos de Silencio"
                url = $baseAudioUrl + "tu-promesa-no-tarda-daniel-habif.mp3"
            }
        )
        pages = 90
        year = 2021
        language = "Español"
        description = "Para quienes sienten que sus esfuerzos no rinden frutos o que la recompensa se demora demasiado. Un recordatorio inspirador de que los procesos más grandes requieren tiempos de gestación invisible y perseverancia sin desmayo."
        cover = "covers/c-audio-tu-promesa-no-tarda-daniel-habif.svg"
        downloads = 1940
        featured = $false
        aiAnalysis = [PSCustomObject]@{
            genre = "Espiritualidad, Consuelo & Esperanza Viva"
            vibe = "Reconfortante, Sublime, Profundo & Restaurador"
            keyConcepts = @(
                "La Paciencia Activa: Seguir Trabajando mientras se Espera",
                "El Crecimiento Oculto en las Raíces antes de la Floración",
                "La Certeza de que Ningún Esfuerzo Honesto se Pierde en el Vacío",
                "Renovación del Vigor ante la Fatiga Psicológica"
            )
            targetAudience = "Cualquier persona atravesando un desierto vocacional, profesional o personal que necesita renovar sus fuerzas."
            aiSummary = "Bálsamo auditivo de motivación espiritual que renueva la convicción en el destino prometido y la perseverancia diaria."
        }
    },
    [PSCustomObject]@{
        id = 2681
        title = "La Tercera Civilización: Conferencia Magistral"
        author = "José Bobadilla"
        category = "Liderazgo & Desarrollo"
        collection = "Colección Audiolibros"
        subtopic = "Nuevas Economías, Liderazgo Colectivo y Visión Global"
        format = "audio"
        audioUrl = $baseAudioUrl + "la-tercera-civilizacion-jose-bobadilla.m4a"
        tracks = @(
            [PSCustomObject]@{
                title = "La Tercera Civilización: El Salto hacia la Era de la Conectividad"
                url = $baseAudioUrl + "la-tercera-civilizacion-jose-bobadilla.m4a"
            }
        )
        pages = 120
        year = 2016
        language = "Español"
        description = "El reconocido educador y líder José Bobadilla analiza la evolución histórica de las civilizaciones desde la era agrícola e industrial hasta la economía interconectada moderna, desafiando a los profesionales a no quedarse atrapados en modelos educativos obsoletos."
        cover = "covers/c-audio-la-tercera-civilizacion-jose-bobadilla.svg"
        downloads = 2050
        featured = $true
        aiAnalysis = [PSCustomObject]@{
            genre = "Economía de Redes, Historia de la Riqueza & Liderazgo de Alto Nivel"
            vibe = "Académico, Sagaz, Revelador & Revolucionario"
            keyConcepts = @(
                "La Obsolescencia del Modelo de la Era Industrial",
                "La Economía de la Información y la Creación de Comunidades",
                "El Rol de la Lectura Crítica en la Formación del Líder Libre",
                "Desmercantilización del Talento Humano y Emprendimiento Asociativo"
            )
            targetAudience = "Emprendedores, académicos, desarrolladores de redes y profesionales cansados del esquema tradicional corporativo."
            aiSummary = "Una de las piezas de oratoria pedagógica más impactantes sobre la nueva era del conocimiento y la libertad financiera de Bobadilla."
        }
    },
    [PSCustomObject]@{
        id = 2682
        title = "Un Negocio de Actitud y Convicción"
        author = "José Bobadilla"
        category = "Liderazgo & Desarrollo"
        collection = "Colección Audiolibros"
        subtopic = "Constancia, Carácter y Éxito en Redes"
        format = "audio"
        audioUrl = $baseAudioUrl + "un-negocio-de-actitud-jose-bobadilla.m4a"
        tracks = @(
            [PSCustomObject]@{
                title = "Un Negocio de Actitud: La Postura Mental del Triunfador"
                url = $baseAudioUrl + "un-negocio-de-actitud-jose-bobadilla.m4a"
            }
        )
        pages = 110
        year = 2018
        language = "Español"
        description = "Bobadilla explica con elocuencia y anécdotas conmovedoras por qué el 90% del éxito en cualquier iniciativa empresarial depende de la actitud con la que se enfrentan los rechazos y los contratiempos iniciales."
        cover = "covers/c-audio-un-negocio-de-actitud-jose-bobadilla.svg"
        downloads = 1760
        featured = $false
        aiAnalysis = [PSCustomObject]@{
            genre = "Psicología Empresarial, Liderazgo de Equipos & Actitud Mental"
            vibe = "Pragmático, Gracioso, Agudo & Estimulante"
            keyConcepts = @(
                "La Actitud como Imán de Oportunidades y Aliados Clave",
                "Superación del Rechazo en la Venta y la Negociación",
                "La Diferencia entre Informarse y Educarse para Ganar",
                "Blindaje Mental contra el Desánimo Social y Familiar"
            )
            targetAudience = "Vendedores, networkers y todo emprendedor que lidera proyectos y equipos comerciales de alto crecimiento."
            aiSummary = "Entrenamiento en audio que fortalece la postura mental de cualquier persona que construye proyectos comerciales independientes."
        }
    },
    [PSCustomObject]@{
        id = 2683
        title = "Pequeñas Metas, Grandes Logros"
        author = "Omar Villalobos"
        category = "Productividad & Hábitos"
        collection = "Colección Audiolibros"
        subtopic = "Microhábitos y Enfoque Progresivo"
        format = "audio"
        audioUrl = $baseAudioUrl + "pequenas-metas-grandes-logros-omar-villalobos.mp3"
        tracks = @(
            [PSCustomObject]@{
                title = "Pequeñas Metas, Grandes Logros: El Poder del Paso a Paso"
                url = $baseAudioUrl + "pequenas-metas-grandes-logros-omar-villalobos.mp3"
            }
        )
        pages = 115
        year = 2017
        language = "Español"
        description = "Omar Villalobos desmonta el mito de las transformaciones mágicas de la noche a la mañana. Muestra cómo dividir los sueños titánicos en victorias cotidianas manejables para anular la frustración y acumular resultados masivos a lo largo del tiempo."
        cover = "covers/c-audio-pequenas-metas-omar-villalobos.svg"
        downloads = 1620
        featured = $false
        aiAnalysis = [PSCustomObject]@{
            genre = "Microhábitos, Productividad Conductual & Gestión del Logro"
            vibe = "Dinámico, Jovial, Práctico & Directo"
            keyConcepts = @(
                "El Efecto Compuesto de Pequeñas Acciones Diarias",
                "Desactivación del Bloqueo por Perfeccionismo Excesivo",
                "Celebración de Microvictorias para Mantener la Dopamina Saludable",
                "Constancia Sistemática como la Clave del Triunfo Silencioso"
            )
            targetAudience = "Estudiantes, profesionales y soñadores que suelen sentirse abrumados por metas gigantescas y quieren método real."
            aiSummary = "Un taller de audio ágil y altamente aplicable para dominar la constancia y conquistar objetivos ambiciosos paso a paso."
        }
    },
    [PSCustomObject]@{
        id = 2684
        title = "Si Vas a Soñar, Sueña en Grande"
        author = "Omar Villalobos"
        category = "Autoayuda & Mente"
        collection = "Colección Audiolibros"
        subtopic = "Visión Audaz y Mentalidad de Grandeza"
        format = "audio"
        audioUrl = $baseAudioUrl + "si-vas-a-sonar-suena-en-grande-omar-villalobos.mp3"
        tracks = @(
            [PSCustomObject]@{
                title = "Si Vas a Soñar, Sueña en Grande: Rompiendo la Mediocridad"
                url = $baseAudioUrl + "si-vas-a-sonar-suena-en-grande-omar-villalobos.mp3"
            }
        )
        pages = 125
        year = 2018
        language = "Español"
        description = "Una sacudida mental a las excusas y a la mezquindad con la que muchas veces planificamos nuestra vida. Villalobos te reta a diseñar un proyecto de existencia que te entusiasme de verdad y te obligue a desplegar tu máximo potencial."
        cover = "covers/c-audio-suena-en-grande-omar-villalobos.svg"
        downloads = 1710
        featured = $false
        aiAnalysis = [PSCustomObject]@{
            genre = "Motivación Estratégica, Visión de Vida & Autoestima"
            vibe = "Electrizante, Divertido, Desafiante & Positivo"
            keyConcepts = @(
                "La Miseria Mental de Aspirar a lo Mínimo para No Fracasar",
                "Diseño de Metas Tan Grandes que Obliguen a Crecer",
                "El Entorno como Determinante de la Altura de los Sueños",
                "La Pasión como Combustible Inagotable del Emprendedor"
            )
            targetAudience = "Jóvenes y adultos con anhelos de grandeza que necesitan vencer el escepticismo de su círculo y atreverse a volar alto."
            aiSummary = "Conferencia vibrante cargada de entusiasmo y sabiduría práctica para elevar la cota de nuestras aspiraciones vitales."
        }
    },
    [PSCustomObject]@{
        id = 2685
        title = "Cómo Eliminar el Miedo de tu Vida"
        author = "Bob Proctor"
        category = "Autoayuda & Mente"
        collection = "Colección Audiolibros"
        subtopic = "Leyes del Paradigma Mental y Ley de Atracción"
        format = "audio"
        audioUrl = $baseAudioUrl + "eliminar-el-miedo-de-tu-vida-bob-proctor.mp3"
        tracks = @(
            [PSCustomObject]@{
                title = "Cómo Eliminar el Miedo: Comprensión y Reprogramación del Subconsciente"
                url = $baseAudioUrl + "eliminar-el-miedo-de-tu-vida-bob-proctor.mp3"
            }
        )
        pages = 135
        year = 2012
        language = "Español"
        description = "El gran maestro de los paradigmas Bob Proctor explica con precisión quirúrgica de dónde nace el miedo: de la ignorancia y la duda alojadas en el subconsciente. Aprende a reemplazar el miedo por conocimiento y comprensión profunda."
        cover = "covers/c-audio-eliminar-el-miedo-bob-proctor.svg"
        downloads = 2580
        featured = $true
        aiAnalysis = [PSCustomObject]@{
            genre = "Reprogramación Subconsciente, Ley de Atracción & Libertad Mental"
            vibe = "Sereno, Sabio, Revelador & Magistral"
            keyConcepts = @(
                "La Cadena del Miedo: Duda -> Preocupación -> Ansiedad -> Parálisis",
                "La Cadena de la Fe: Estudio -> Comprensión -> Fe -> Bienestar Total",
                "Los Paradigmas Mentales como Controladores Automáticos de la Acción",
                "Visualización Cuántica de Resultados Deseados"
            )
            targetAudience = "Estudiantes del desarrollo de la mente, el subconsciente y quienes desean vivir sin ansiedad ni bloqueos crónicos."
            aiSummary = "Una clase maestra invaluable de Bob Proctor que erradica el miedo de raíz sustituyéndolo por lucidez, fe y comprensión mental."
        }
    },
    [PSCustomObject]@{
        id = 2686
        title = "Libertad y Liderazgo de Excelencia"
        author = "Miguel Ángel Cornejo"
        category = "Liderazgo & Desarrollo"
        collection = "Colección Audiolibros"
        subtopic = "Cultura de Excelencia y Liderazgo Proactivo"
        format = "audio"
        audioUrl = $baseAudioUrl + "libertad-y-liderazgo-miguel-angel-cornejo.mp3"
        tracks = @(
            [PSCustomObject]@{
                title = "Libertad y Liderazgo: La Cultura de los Seres Extraordinarios"
                url = $baseAudioUrl + "libertad-y-liderazgo-miguel-angel-cornejo.mp3"
            }
        )
        pages = 145
        year = 2008
        language = "Español"
        description = "El gran conferencista iberoamericano Miguel Ángel Cornejo expone los principios del 'Ser de Excelencia': la libertad auténtica como fruto de la responsabilidad personal y el compromiso con los valores éticos más elevados."
        cover = "covers/c-audio-libertad-y-liderazgo-miguel-angel-cornejo.svg"
        downloads = 2140
        featured = $false
        aiAnalysis = [PSCustomObject]@{
            genre = "Filosofía del Liderazgo, Excelencia Humana & Ética"
            vibe = "Magno, Apasionado, Solemne & Enaltecedor"
            keyConcepts = @(
                "La Definición de Excelencia: Dar Más de lo que se Pide sin Esperar Premio",
                "La Libertad no es Licencia sino Máxima Responsabilidad de Elección",
                "Liderazgo por el Ejemplo y Huella Moral en la Sociedad",
                "El Triunfo sobre la Mediocridad a través de la Pasión en el Trabajo"
            )
            targetAudience = "Líderes institucionales, educadores y profesionales que aspiran a un liderazgo de principios y servicio noble."
            aiSummary = "Cátedra inolvidable de Miguel Ángel Cornejo que convoca a vivir con dignidad, entrega total y excelencia en todo lo que hagamos."
        }
    },
    [PSCustomObject]@{
        id = 2687
        title = "Vencer el Miedo y Desarrollar Confianza Inquebrantable en Ti Mismo"
        author = "Academia de Crecimiento Interior"
        category = "Autoayuda & Mente"
        collection = "Colección Audiolibros"
        subtopic = "Autoconfianza, Seguridad Personal y Superación de Fobias"
        format = "audio"
        audioUrl = $baseAudioUrl + "vencer-el-miedo-y-confianza-en-ti-mismo.mp3"
        tracks = @(
            [PSCustomObject]@{
                title = "Vencer el Miedo y Confianza en Ti Mismo: Sesión Completa"
                url = $baseAudioUrl + "vencer-el-miedo-y-confianza-en-ti-mismo.mp3"
            }
        )
        pages = 160
        year = 2022
        language = "Español"
        description = "Guía integral en audio diseñada para desarmar la inseguridad y construir una autoestima sólida y perdurable. Ejercicios guiados de respiración, reestructuración cognitiva y anclaje de seguridad personal ante retos sociales y profesionales."
        cover = "covers/c-audio-vencer-el-miedo-confianza.svg"
        downloads = 2380
        featured = $true
        aiAnalysis = [PSCustomObject]@{
            genre = "Autoestima, Psicología Aplicada & Superación Personal"
            vibe = "Cálido, Fortalecedor, Práctico & Tranquilizador"
            keyConcepts = @(
                "Desactivación del Síndrome del Impostor y la Autocrítica Destructiva",
                "Anclajes Mentales de Seguridad y Lenguaje Corporal Asertivo",
                "Afrontamiento Gradual de Situaciones Temidas",
                "Construcción del Pilar de Merecimiento y Respeto Propio"
            )
            targetAudience = "Cualquier persona que luche con timidez, fobia social o inseguridad al hablar en público o defender sus ideas."
            aiSummary = "Programa en audio enfocado en transformar la duda paralizante en autoconfianza real, serena y duradera."
        }
    },
    [PSCustomObject]@{
        id = 2688
        title = "Relax & Sleep: Sesión Guiada de Meditación y Sueño Profundo"
        author = "Mindfulness & Sleep Lab"
        category = "Autoayuda & Mente"
        collection = "Colección Audiolibros"
        subtopic = "Ondas Delta, Descanso Reparador y Reducción del Estrés"
        format = "audio"
        audioUrl = $baseAudioUrl + "relax-sleep-meditacion-profunda.mp3"
        tracks = @(
            [PSCustomObject]@{
                title = "Relax & Sleep: Meditación Inmersiva y Sueño Delta Reparador (4 Horas)"
                url = $baseAudioUrl + "relax-sleep-meditacion-profunda.mp3"
            }
        )
        pages = 200
        year = 2023
        language = "Español"
        description = "Una experiencia de relajación total de 4 horas continuas de narración guiada, paisajes sonoros binaurales y frecuencias de relajación profunda. Diseñada científicamente para calmar el sistema nervioso, frenar el flujo excesivo de pensamientos y facilitar un sueño reparador inmediato."
        cover = "covers/c-audio-relax-sleep-meditacion-profunda.svg"
        downloads = 3450
        featured = $true
        aiAnalysis = [PSCustomObject]@{
            genre = "Meditación Guiada, Salud Mental, Mindfulness & Sueño Delta"
            vibe = "Tranquilizador, Profundo, Hipnótico & Sanador"
            keyConcepts = @(
                "Relajación Muscular Progresiva y Respiración Diafragmática",
                "Frecuencias Binaurales Theta y Delta para Ralentizar Ondas Cerebrales",
                "Liberación del Cortisol y Disminución de la Ansiedad Nocturna",
                "Desconexión Consciente del Ruido Mental del Día"
            )
            targetAudience = "Personas que padecen de insomnio, estrés crónico, sobrecarga laboral o que desean un ritual nocturno de paz mental absoluta."
            aiSummary = "La sesión maestra de relajación en audio de BIBLIOTYAN. 4 horas de audio impecable para conciliar el sueño más profundo y revitalizante."
        }
    },
    [PSCustomObject]@{
        id = 2689
        title = "Cambie Para Siempre: Seminario de Reprogramación y Superación"
        author = "Alex Dey"
        category = "Autoayuda & Mente"
        collection = "Colección Audiolibros"
        subtopic = "Reprogramación Subconsciente y Superación Personal"
        format = "audio"
        audioUrl = $baseAudioUrl + "cambie-para-siempre-alex-dey.mp3"
        tracks = @(
            [PSCustomObject]@{
                title = "Cambie Para Siempre: Seminario Completo de Alex Dey"
                url = $baseAudioUrl + "cambie-para-siempre-alex-dey.mp3"
            }
        )
        pages = 175
        year = 2001
        language = "Español"
        description = "Uno de los seminarios de motivación y reprogramación mental más reproducidos de la historia en habla hispana. El Dr. Alex Dey enseña con dinamismo y ejemplos reales cómo erradicar hábitos autodestructivos y activar el poder ilimitado del entusiasmo."
        cover = "covers/c-audio-cambie-para-siempre-alex-dey.svg"
        downloads = 2890
        featured = $true
        aiAnalysis = [PSCustomObject]@{
            genre = "Superación Personal, Reprogramación Mental & Éxito"
            vibe = "Vibrante, Contagioso, Práctico & Estimulante"
            keyConcepts = @(
                "La Fuerza del Entusiasmo como Energía Creadora de Oportunidades",
                "Corte con el Pasado y Eliminación de Resentimientos Paralizantes",
                "Técnicas de Autosugestión Positiva Diaria",
                "Desarrollo de una Personalidad Magnética y Segura"
            )
            targetAudience = "Cualquier persona que necesite un renacer anímico, vendedores, emprendedores y soñadores dispuestos a dar un giro radical a su destino."
            aiSummary = "Seminario clásico completo de Alex Dey que ha inspirado a millones a romper cadenas mentales y conquistar una vida plena."
        }
    },
    [PSCustomObject]@{
        id = 2690
        title = "Hoy es el Primer Día de su Nueva Vida (Seminario Completo)"
        author = "Alex Dey"
        category = "Autoayuda & Mente"
        collection = "Colección Audiolibros"
        subtopic = "Motivación, Ventas y Transformación Integral"
        format = "audio"
        audioUrl = $baseAudioUrl + "hoy-es-el-primer-dia-de-su-vida-alex-dey.mp3"
        tracks = @(
            [PSCustomObject]@{
                title = "Hoy es el Primer Día de su Nueva Vida: Audio Inmersivo Completo"
                url = $baseAudioUrl + "hoy-es-el-primer-dia-de-su-vida-alex-dey.mp3"
            }
        )
        pages = 220
        year = 2004
        language = "Español"
        description = "La producción magna de Alex Dey en su versión íntegra extendida. Un recorrido exhaustivo por los pilares del éxito: salud física, paz mental, relaciones armónicas, solvencia financiera y metas trascendentes para comenzar de cero hoy mismo."
        cover = "covers/c-audio-hoy-es-el-primer-dia-alex-dey.svg"
        downloads = 3200
        featured = $true
        aiAnalysis = [PSCustomObject]@{
            genre = "Transformación Personal, Liderazgo Integral & Psicología del Éxito"
            vibe = "Motivador, Comprometido, Profundo & Dinámico"
            keyConcepts = @(
                "El Poder del Presente: El Pasado Ya Murió y el Futuro Depende de Hoy",
                "Reconciliación y Perdón como Requisitos Indispensables de la Abundancia",
                "Educación Continua y Rechazo tajante a la Mediocridad",
                "Compromiso de Servicio y Generosidad en la Cima del Éxito"
            )
            targetAudience = "Luchadores decididos a reinventarse desde sus cimientos y construir una vida próspera, equilibrada y llena de dicha."
            aiSummary = "La joya definitiva de la oratoria motivacional de Alex Dey. Una experiencia auditiva transformadora disponible en calidad máster."
        }
    },
    [PSCustomObject]@{
        id = 2691
        title = "Piense y Hágase Rico (Versión Narrada Esencial)"
        author = "Napoleon Hill"
        category = "Finanzas & Inversión"
        collection = "Colección Audiolibros"
        subtopic = "La Filosofía del Logro Definitivo"
        format = "audio"
        audioUrl = $baseAudioUrl + "piense-y-hagase-rico-napoleon-hill.mp3"
        tracks = @(
            [PSCustomObject]@{
                title = "Piense y Hágase Rico: Los 13 Pasos hacia las Riquezas"
                url = $baseAudioUrl + "piense-y-hagase-rico-napoleon-hill.mp3"
            }
        )
        pages = 260
        year = 1937
        language = "Español"
        description = "La destilación en audio del clásico de la prosperidad más famoso del siglo XX. Napoleon Hill detalla los 13 pasos que permitieron a los hombres más acaudalados de la era moderna transformar una simple idea en imperios financieros colosales."
        cover = "covers/c-audio-piense-y-hagase-rico-napoleon-hill.svg"
        downloads = 3150
        featured = $true
        aiAnalysis = [PSCustomObject]@{
            genre = "Filosofía del Éxito, Riqueza Mental & Leyes del Logro"
            vibe = "Atemporal, Filosófico, Práctico & Magistral"
            keyConcepts = @(
                "Deseo Ardiente y Definición Obsesiva del Objetivo",
                "La Fe Aplicada y la Autosugestión Consciente",
                "El Poder del Cerebro Colectivo (Master Mind)",
                "Transmutación de la Energía y Transmutación del Miedo"
            )
            targetAudience = "Toda persona interesada en comprender los principios inmutables que separan la riqueza de la pobreza mental."
            aiSummary = "Narración clara y potente de la obra fundacional de la literatura del éxito moderno de Napoleon Hill."
        }
    },
    [PSCustomObject]@{
        id = 2692
        title = "Padre Rico, Padre Pobre (Audiolibro Esencial Narrado)"
        author = "Robert T. Kiyosaki"
        category = "Finanzas & Inversión"
        collection = "Colección Audiolibros"
        subtopic = "Principios Clave del Dinero y la Libertad Financiera"
        format = "audio"
        audioUrl = $baseAudioUrl + "padre-rico-padre-pobre-completo-kiyosaki.mp3"
        tracks = @(
            [PSCustomObject]@{
                title = "Padre Rico, Padre Pobre: Principios Esenciales de Finanzas"
                url = $baseAudioUrl + "padre-rico-padre-pobre-completo-kiyosaki.mp3"
            }
        )
        pages = 210
        year = 2017
        language = "Español"
        description = "La versión concentrada y dinámica de la obra más influyente de educación financiera. Escucha las lecciones del padre rico sobre por qué los ricos no trabajan por dinero sino que ponen al dinero a trabajar para ellos."
        cover = "covers/c-audio-padre-rico-padre-pobre-esencial.svg"
        downloads = 3390
        featured = $true
        aiAnalysis = [PSCustomObject]@{
            genre = "Educación Financiera, Inversiones & Libertad Económica"
            vibe = "Práctico, Revolucionario, Claro & Esencial"
            keyConcepts = @(
                "Los Ricos Adquieren Activos, la Clase Media Adquiere Pasivos Creyendo que son Activos",
                "La Trampa del Empleo Convencional y la Carrera de la Rata",
                "Inteligencia Financiera: Contabilidad, Inversión y Leyes",
                "Superar los 5 Obstáculos: Miedo, Cinismo, Pereza, Malos Hábitos y Arrogancia"
            )
            targetAudience = "Quienes buscan una sesión compacta e impactante de los postulados fundamentales de Kiyosaki."
            aiSummary = "Versión en audio de una sola pista fluida de Padre Rico Padre Pobre para escuchar de principio a fin en cualquier momento."
        }
    },
    [PSCustomObject]@{
        id = 2693
        title = "No Estás Deprimido, Estás Distraído (Obra Maestra Íntegra)"
        author = "Facundo Cabral"
        category = "Espiritualidad & Sabiduría"
        collection = "Colección Audiolibros"
        subtopic = "Filosofía de Vida, Poesía y Sanación Interior"
        format = "audio"
        audioUrl = $baseAudioUrl + "no-estas-deprimido-estas-distraido-facundo-cabral.mp3"
        tracks = @(
            [PSCustomObject]@{
                title = "No Estás Deprimido, Estás Distraído: Grabación Original Íntegra"
                url = $baseAudioUrl + "no-estas-deprimido-estas-distraido-facundo-cabral.mp3"
            }
        )
        pages = 110
        year = 2008
        language = "Español"
        description = "Una de las piezas de oratoria poética más bellas y conmovedoras del siglo. Facundo Cabral te invita con su voz profunda y guitarra sutil a despertar a las maravillas de la vida: 'No estás deprimido, estás distraído de la vida que te puebla'."
        cover = "covers/c-audio-no-estas-deprimido-facundo-cabral.svg"
        downloads = 3680
        featured = $true
        aiAnalysis = [PSCustomObject]@{
            genre = "Filosofía Mística, Poesía Oral & Sanación del Alma"
            vibe = "Sublime, Íntimo, Poético, Sanador & Eterno"
            keyConcepts = @(
                "La Vida como un Regalo Inagotable que Ignoramos por Fijarnos en lo Pequeño",
                "El Desapego de las Cosas Materiales para Conquistar la Verdadera Libertad",
                "La Gratitud Diaria por los Sentidos, el Sol y el Camino",
                "La Muerte no es Pérdida sino una Mudanza Misteriosa"
            )
            targetAudience = "Cualquier ser humano que necesite consuelo, belleza, poesía y una reconexión honda con el milagro de existir."
            aiSummary = "La obra maestra de Facundo Cabral en audio con su voz inconfundible. Una medicina para el espíritu y una joya imprescindible de BIBLIOTYAN."
        }
    }
)

Write-Host "Checking for existing records..."
$existingIds = @{}
foreach ($b in $books) {
    $existingIds[$b.id] = $true
}

$added = 0
foreach ($nb in $newBooks) {
    if (-not $existingIds.ContainsKey($nb.id)) {
        $books += $nb
        $existingIds[$nb.id] = $true
        $added++
    }
}

Write-Host "Writing updated books.json with $added new audiobooks (Total: $($books.Count))..."
$updatedJson = $books | ConvertTo-Json -Depth 6
Set-Content -LiteralPath $booksJsonPath -Value $updatedJson -Encoding UTF8

# Also sync js/data.js
Write-Host "Updating js/data.js..."
$dataJsHeader = "// Catálogo Digital BIBLIOTYAN`nconst BOOKS = "
$dataJsFooter = ";`nif (typeof window !== 'undefined') { window.BOOKS = BOOKS; }`n"
Set-Content -LiteralPath $dataJsPath -Value ($dataJsHeader + $updatedJson + $dataJsFooter) -Encoding UTF8

Write-Host "SUCCESS! Added $added audiobooks. Catalog now has $($books.Count) total titles!"
