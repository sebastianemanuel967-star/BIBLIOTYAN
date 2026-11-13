$coversDir = "C:\Users\sebas\OneDrive\Documentos\GitHub\BIBLIOTYAN\covers"

$titles = @(
    @{
        filename = "c-audio-las-intermitencias-de-la-muerte-saramago.svg"
        title1 = "LAS INTERMITENCIAS"
        title2 = "DE LA MUERTE"
        author = "JOSÉ SARAMAGO"
        tag = "PREMIO NOBEL DE LITERATURA"
        badge = "AUDIOLIBRO ÍNTEGRO"
        theme = "mystic"
    },
    @{
        filename = "c-audio-el-escarabajo-de-oro-poe.svg"
        title1 = "EL ESCARABAJO"
        title2 = "DE ORO"
        author = "EDGAR ALLAN POE"
        tag = "MISTERIO & CRIPTOGRAFÍA"
        badge = "DRAMATIZACIÓN COMPLETA"
        theme = "gold"
    },
    @{
        filename = "c-audio-veinte-poemas-de-amor-neruda.svg"
        title1 = "VEINTE POEMAS DE AMOR"
        title2 = "Y UNA CANCIÓN DESESPERADA"
        author = "PABLO NERUDA"
        tag = "POESÍA UNIVERSAL & AMOR"
        badge = "OBRA COMPLETA NARRADA"
        theme = "rose"
    },
    @{
        filename = "c-audio-psicologia-del-color-eva-heller.svg"
        title1 = "PSICOLOGÍA"
        title2 = "DEL COLOR"
        author = "EVA HELLER"
        tag = "PERCEPCIÓN, SIMBOLISMO & ARTE"
        badge = "EDICIÓN MAESTRA EN AUDIO"
        theme = "spectrum"
    },
    @{
        filename = "c-audio-haz-que-funcione-david-allen.svg"
        title1 = "HAZ QUE"
        title2 = "FUNCIONE (GTD)"
        author = "DAVID ALLEN"
        tag = "PRODUCTIVIDAD SIN ESTRÉS"
        badge = "SISTEMA COMPLETO DE CONTROL"
        theme = "focus"
    },
    @{
        filename = "c-audio-100-leyes-exito-brian-tracy.svg"
        title1 = "LAS 100 LEYES"
        title2 = "DEL ÉXITO EN NEGOCIOS"
        author = "BRIAN TRACY"
        tag = "LEYES INMUTABLES DEL LOGRO"
        badge = "SEMINARIO MAGISTRAL"
        theme = "gold"
    },
    @{
        filename = "c-audio-sobre-el-cambio-brian-tracy.svg"
        title1 = "DOMINANDO"
        title2 = "EL CAMBIO"
        author = "BRIAN TRACY"
        tag = "ADAPTABILIDAD & RESILIENCIA"
        badge = "CLASE MAGISTRAL DE AUDIO"
        theme = "focus"
    },
    @{
        filename = "c-audio-metas-zig-ziglar.svg"
        title1 = "METAS: CÓMO"
        title2 = "LOGRAR LO QUE DESEAS"
        author = "ZIG ZIGLAR"
        tag = "SISTEMA CIENTÍFICO DE METAS"
        badge = "ENTRENAMIENTO ÍNTEGRO"
        theme = "gold"
    },
    @{
        filename = "c-audio-como-tener-tu-mejor-ano-tony-robbins.svg"
        title1 = "CÓMO TENER TU"
        title2 = "MEJOR AÑO"
        author = "TONY ROBBINS"
        tag = "PSICOLOGÍA DEL RENDIMIENTO MÁXIMO"
        badge = "SESIÓN DE ALTO IMPACTO"
        theme = "fire"
    },
    @{
        filename = "c-audio-aprender-a-ser-ambicioso-mauricio-benoist.svg"
        title1 = "APRENDER A SER"
        title2 = "AMBICIOSO"
        author = "MAURICIO BENOIST"
        tag = "MENTALIDAD DE CRECIMIENTO EXPONENCIAL"
        badge = "CONFERENCIA EN VIVO"
        theme = "gold"
    },
    @{
        filename = "c-audio-disciplina-organizacion-yokoi-kenji.svg"
        title1 = "DISCIPLINA,"
        title2 = "ORGANIZACIÓN Y LIMPIEZA"
        author = "YOKOI KENJI DÍAZ"
        tag = "SABIDURÍA JAPONESA APLICADA"
        badge = "CONFERENCIA MAESTRA"
        theme = "zen"
    },
    @{
        filename = "c-audio-mitos-y-verdades-yokoi-kenji.svg"
        title1 = "MITOS Y VERDADES"
        title2 = "DE LATINOAMÉRICA Y JAPÓN"
        author = "YOKOI KENJI DÍAZ"
        tag = "IDENTIDAD, CARÁCTER & CULTURA"
        badge = "CONFERENCIA MAESTRA"
        theme = "zen"
    },
    @{
        filename = "c-audio-la-generacion-actual-yokoi-kenji.svg"
        title1 = "LA GENERACIÓN"
        title2 = "ACTUAL"
        author = "YOKOI KENJI DÍAZ"
        tag = "PROPÓSITO, VALORES & FUTURO"
        badge = "MENSAJE INSPIRACIONAL"
        theme = "zen"
    },
    @{
        filename = "c-audio-los-temores-daniel-habif.svg"
        title1 = "VENCER"
        title2 = "LOS TEMORES"
        author = "DANIEL HABIF"
        tag = "DESPERTAR EL CORAJE INTERIOR"
        badge = "DISCURSO DE IMPACTO"
        theme = "fire"
    },
    @{
        filename = "c-audio-dominio-propio-daniel-habif.svg"
        title1 = "DOMINIO PROPIO"
        title2 = "EL PODER DEL ENFOQUE"
        author = "DANIEL HABIF"
        tag = "AUTODISCIPLINA & GOBIERNO EMOCIONAL"
        badge = "AUDIO TRANSFORMADOR"
        theme = "fire"
    },
    @{
        filename = "c-audio-tu-promesa-no-tarda-daniel-habif.svg"
        title1 = "TU PROMESA"
        title2 = "NO TARDA"
        author = "DANIEL HABIF"
        tag = "FE, PERSEVERANCIA & DESTINO"
        badge = "MENSAJE DE ESPERANZA"
        theme = "mystic"
    },
    @{
        filename = "c-audio-la-tercera-civilizacion-jose-bobadilla.svg"
        title1 = "LA TERCERA"
        title2 = "CIVILIZACIÓN"
        author = "JOSÉ BOBADILLA"
        tag = "VISIÓN, LIDERAZGO & NUEVA ERA"
        badge = "CONFERENCIA MAGISTRAL"
        theme = "gold"
    },
    @{
        filename = "c-audio-un-negocio-de-actitud-jose-bobadilla.svg"
        title1 = "UN NEGOCIO"
        title2 = "DE ACTITUD"
        author = "JOSÉ BOBADILLA"
        tag = "POSTURA, CARÁCTER & PERSISTENCIA"
        badge = "ENTRENAMIENTO EXCLUSIVO"
        theme = "gold"
    },
    @{
        filename = "c-audio-pequenas-metas-omar-villalobos.svg"
        title1 = "PEQUEÑAS METAS,"
        title2 = "GRANDES LOGROS"
        author = "OMAR VILLALOBOS"
        tag = "PASO A PASO HACIA EL ÉXITO"
        badge = "AUDIO TALLER"
        theme = "focus"
    },
    @{
        filename = "c-audio-suena-en-grande-omar-villalobos.svg"
        title1 = "SI VAS A SOÑAR,"
        title2 = "SUEÑA EN GRANDE"
        author = "OMAR VILLALOBOS"
        tag = "EXPANSIÓN MENTAL & VALENTÍA"
        badge = "CONFERENCIA MOTIVACIONAL"
        theme = "fire"
    },
    @{
        filename = "c-audio-eliminar-el-miedo-bob-proctor.svg"
        title1 = "CÓMO ELIMINAR"
        title2 = "EL MIEDO DE TU VIDA"
        author = "BOB PROCTOR"
        tag = "REPROGRAMACIÓN DE PARADIGMAS"
        badge = "CLASE MAESTRA PROCTOR"
        theme = "mystic"
    },
    @{
        filename = "c-audio-libertad-y-liderazgo-miguel-angel-cornejo.svg"
        title1 = "LIBERTAD Y"
        title2 = "LIDERAZGO"
        author = "MIGUEL ÁNGEL CORNEJO"
        tag = "CULTURA DE EXCELENCIA"
        badge = "ORATORIA MAESTRA"
        theme = "gold"
    },
    @{
        filename = "c-audio-vencer-el-miedo-confianza.svg"
        title1 = "VENCER EL MIEDO Y"
        title2 = "CONFIANZA TOTAL"
        author = "INSTITUTO DE DESARROLLO"
        tag = "SEGURIDAD PERSONAL INQUEBRANTABLE"
        badge = "CURSO EN AUDIO PRÁCTICO"
        theme = "focus"
    },
    @{
        filename = "c-audio-relax-sleep-meditacion-profunda.svg"
        title1 = "RELAX & SLEEP"
        title2 = "MEDITACIÓN Y SUEÑO PROFUNDO"
        author = "MINDFULNESS & SLEEP LAB"
        tag = "ONDAS DELTA & CALMA TOTAL"
        badge = "SESIÓN DE 4 HORAS HD"
        theme = "zen"
    },
    @{
        filename = "c-audio-cambie-para-siempre-alex-dey.svg"
        title1 = "CAMBIE"
        title2 = "PARA SIEMPRE"
        author = "ALEX DEY"
        tag = "SUPERACIÓN & DESPERTAR DE POTENCIAL"
        badge = "SEMINARIO ÍNTEGRO"
        theme = "fire"
    },
    @{
        filename = "c-audio-hoy-es-el-primer-dia-alex-dey.svg"
        title1 = "HOY ES EL PRIMER DÍA"
        title2 = "DE SU NUEVA VIDA"
        author = "ALEX DEY"
        tag = "PROGRAMA COMPLETO DE TRANSFORMACIÓN"
        badge = "EDICIÓN ESPECIAL RESTAURADA"
        theme = "gold"
    },
    @{
        filename = "c-audio-piense-y-hagase-rico-napoleon-hill.svg"
        title1 = "PIENSE Y"
        title2 = "HÁGASE RICO"
        author = "NAPOLEON HILL"
        tag = "LOS 13 PASOS HACIA LA RIQUEZA"
        badge = "VERSIÓN CONDENSADA DE PODER"
        theme = "gold"
    },
    @{
        filename = "c-audio-padre-rico-padre-pobre-esencial.svg"
        title1 = "PADRE RICO"
        title2 = "PADRE POBRE"
        author = "ROBERT T. KIYOSAKI"
        tag = "EDUCACIÓN FINANCIERA FUNDAMENTAL"
        badge = "EDICIÓN MAESTRA RESUMIDA"
        theme = "gold"
    },
    @{
        filename = "c-audio-no-estas-deprimido-facundo-cabral.svg"
        title1 = "NO ESTÁS DEPRIMIDO,"
        title2 = "ESTÁS DISTRAÍDO"
        author = "FACUNDO CABRAL"
        tag = "POESÍA, FILOSOFÍA & VIDA"
        badge = "OBRA ÍNTEGRA ORIGINAL"
        theme = "mystic"
    }
)

foreach ($t in $titles) {
    $theme = $t.theme
    $acc1 = "#e0b0ff"
    $acc2 = "#9d4edd"
    $tagCol = "#e0b0ff"

    if ($theme -eq "gold") {
        $acc1 = "#FFD700"
        $acc2 = "#FFA500"
        $tagCol = "#FFDF00"
    } elseif ($theme -eq "mystic") {
        $acc1 = "#b388ff"
        $acc2 = "#7c4dff"
        $tagCol = "#e0b0ff"
    } elseif ($theme -eq "rose") {
        $acc1 = "#ff80ab"
        $acc2 = "#f50057"
        $tagCol = "#ffb2dd"
    } elseif ($theme -eq "fire") {
        $acc1 = "#ff9e80"
        $acc2 = "#ff6e40"
        $tagCol = "#ffd180"
    } elseif ($theme -eq "focus") {
        $acc1 = "#80d8ff"
        $acc2 = "#00b0ff"
        $tagCol = "#b3e5fc"
    } elseif ($theme -eq "zen") {
        $acc1 = "#a7ffeb"
        $acc2 = "#1de9b6"
        $tagCol = "#b2dfdb"
    } elseif ($theme -eq "spectrum") {
        $acc1 = "#ea80fc"
        $acc2 = "#d500f9"
        $tagCol = "#f8bbd0"
    }

    $svg = @"
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 600" width="400" height="600">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#180C28"/>
      <stop offset="50%" stop-color="#10071A"/>
      <stop offset="100%" stop-color="#08030E"/>
    </linearGradient>
    <linearGradient id="accGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="$acc1"/>
      <stop offset="100%" stop-color="$acc2"/>
    </linearGradient>
    <linearGradient id="brandViolet" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#7b2cbf"/>
      <stop offset="100%" stop-color="#c77dff"/>
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="28%" r="65%">
      <stop offset="0%" stop-color="#6a1b9a" stop-opacity="0.32"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <rect width="400" height="600" fill="url(#bgGrad)"/>
  <rect width="400" height="600" fill="url(#glow)"/>

  <rect x="15" y="15" width="370" height="570" fill="none" stroke="url(#brandViolet)" stroke-width="1.5" stroke-opacity="0.45" rx="8"/>
  <rect x="22" y="22" width="356" height="556" fill="none" stroke="url(#accGrad)" stroke-width="0.8" stroke-opacity="0.3" rx="6"/>

  <text x="200" y="55" text-anchor="middle" fill="#c77dff" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="10.5" font-weight="700" letter-spacing="3">AUDIOTYAN &bull; COLECCIÓN MAESTRA</text>

  <circle cx="200" cy="175" r="50" fill="#1b0e30" stroke="url(#brandViolet)" stroke-width="2"/>
  <circle cx="200" cy="175" r="42" fill="none" stroke="url(#accGrad)" stroke-width="0.8" stroke-opacity="0.6"/>
  <path d="M178 175 A22 22 0 0 1 222 175 V188 A6 6 0 0 1 216 194 H212 V175 H218 A16 16 0 0 0 182 175 H188 V194 H184 A6 6 0 0 1 178 188 Z" fill="$acc1"/>
  <circle cx="200" cy="175" r="6" fill="#c77dff"/>

  <text x="200" y="278" text-anchor="middle" fill="#FFFFFF" font-family="'Cinzel', 'Playfair Display', Georgia, serif" font-size="20" font-weight="700" letter-spacing="1">$($t.title1)</text>
  <text x="200" y="312" text-anchor="middle" fill="url(#accGrad)" font-family="'Cinzel', 'Playfair Display', Georgia, serif" font-size="16" font-weight="600" letter-spacing="1.5">$($t.title2)</text>

  <line x1="110" y1="342" x2="290" y2="342" stroke="url(#brandViolet)" stroke-width="1.5" stroke-opacity="0.6"/>

  <text x="200" y="378" text-anchor="middle" fill="$tagCol" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="13.5" font-weight="700" letter-spacing="2">$($t.author)</text>
  <text x="200" y="405" text-anchor="middle" fill="#9A87B3" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="10.5" letter-spacing="1">$($t.tag)</text>

  <g transform="translate(115, 508)">
    <rect width="170" height="34" rx="17" fill="#180C28" stroke="url(#accGrad)" stroke-width="1.2"/>
    <text x="85" y="21" text-anchor="middle" fill="$acc1" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="9.5" font-weight="700" letter-spacing="1.5">$($t.badge)</text>
  </g>
</svg>
"@
    $targetPath = Join-Path $coversDir $t.filename
    Set-Content -LiteralPath $targetPath -Value $svg -Encoding UTF8
}

Write-Host "Generated $($titles.Count) covers successfully in $coversDir"
