Add-Type -AssemblyName System.IO.Compression.FileSystem

$destDir = "C:\Users\sebas\.gemini\antigravity\scratch\audiolibros_v2_extracted"
if (-not (Test-Path $destDir)) {
    New-Item -ItemType Directory -Path $destDir | Out-Null
}

$mapping = @{
    # From AUDIOLIBROS uno.zip
    "Relaz Sleep.mp3" = "relax-sleep-meditacion-profunda.mp3"

    # From AUDIOLIBROS dos.zip
    "La divina comedia Infierno.m4a" = "la-divina-comedia-infierno-dante.m4a"
    "Las intermitencias de la muerte.mp3" = "las-intermitencias-de-la-muerte-saramago.mp3"
    "El escarabajo de Oro.mp3" = "el-escarabajo-de-oro-poe.mp3"
    "20 poemas de amor y una cancion.mp3" = "veinte-poemas-de-amor-neruda.mp3"
    "Napoleon Hill Piense y Hagase rico.mp3" = "piense-y-hagase-rico-napoleon-hill.mp3"
    "Padre Rico padre pobre audiolibro español completo.mp3" = "padre-rico-padre-pobre-completo-kiyosaki.mp3"
    "081 - Haz Que Funcione.mp3" = "haz-que-funcione-david-allen.mp3"
    "070 - Las 100 Leyes Absolutamente Inquebrantables del Éxito en los Negocios (II).mp3" = "100-leyes-inquebrantables-exito-brian-tracy.mp3"
    "METAS _ Zig Ziglar(MP3_128K).mp3" = "metas-zig-ziglar.mp3"
    "Cómo Tener Tu MEJOR AÑO 2019 _ Tony Robbins(MP3_128K).mp3" = "como-tener-tu-mejor-ano-tony-robbins.mp3"
    "No estas deprimido, estas distraido.mp3" = "no-estas-deprimido-estas-distraido-facundo-cabral.mp3"
    "Psicologia del color como actuan los colores sobre los sentimientos y la razon.m4a" = "psicologia-del-color-eva-heller.m4a"
    "Aley de Rey Cambie para siempre.mp3" = "cambie-para-siempre-alex-dey.mp3"
    "Aley del Rey Hoy es el primer dia de su vida.mp3" = "hoy-es-el-primer-dia-de-su-vida-alex-dey.mp3"
    "Disciplina Organizacion Limpieza puntualidad.m4a" = "disciplina-organizacion-limpieza-yokoi-kenji.m4a"
    "Yokoi kenji Mitos y verdades.mp3" = "mitos-y-verdades-yokoi-kenji.mp3"
    "La generacion actual yokoi.mp3" = "la-generacion-actual-yokoi-kenji.mp3"
    "Los temores - Daniel Habif.mp3" = "los-temores-daniel-habif.mp3"
    "Dominio propio Daniel Habif.mp3" = "dominio-propio-daniel-habif.mp3"
    "Daniel Habit Tu promesa No tarda.mp3" = "tu-promesa-no-tarda-daniel-habif.mp3"
    "La tercera civilizacion Jose Bodadilla.m4a" = "la-tercera-civilizacion-jose-bobadilla.m4a"
    "Un negocio de actitud Jose Bordailla.m4a" = "un-negocio-de-actitud-jose-bobadilla.m4a"
    "OMAR VILLALOBOS __ Pequeñas Metas_ Grandes Logros(MP3_128K).mp3" = "pequenas-metas-grandes-logros-omar-villalobos.mp3"
    "OMAR VILLALOBOS -- si vas a soñar sueña en grande.mp3" = "si-vas-a-sonar-suena-en-grande-omar-villalobos.mp3"
    "Brian Tract Sobre el cambio.mp3" = "sobre-el-cambio-brian-tracy.mp3"
    "Aprender a ser Ambicioso Mauricio Benoist.mp3" = "aprender-a-ser-ambicioso-mauricio-benoist.mp3"
    "Como Eliminar el miedo de tu vida Bob Proctor en español.mp3" = "eliminar-el-miedo-de-tu-vida-bob-proctor.mp3"
    "Liberta Miguel Angel Cornejo.mp3" = "libertad-y-liderazgo-miguel-angel-cornejo.mp3"
    "Como vencer tus miedo y tener Confianza en ti mismo.mp3" = "vencer-el-miedo-y-confianza-en-ti-mismo.mp3"
}

$zips = @(
    "C:\Users\sebas\.gemini\antigravity\scratch\tyan-biblioteca\AUDIOLIBROS uno.zip",
    "C:\Users\sebas\.gemini\antigravity\scratch\tyan-biblioteca\AUDIOLIBROS dos.zip"
)

$extractedCount = 0

foreach ($z in $zips) {
    if (Test-Path $z) {
        Write-Host "Opening $(Split-Path $z -Leaf)..."
        $archive = [System.IO.Compression.ZipFile]::OpenRead($z)
        foreach ($entry in $archive.Entries) {
            $name = $entry.Name
            if ($mapping.ContainsKey($name)) {
                $targetFilename = $mapping[$name]
                $targetPath = Join-Path $destDir $targetFilename
                if (-not (Test-Path $targetPath)) {
                    Write-Host "  -> Extracting: $name as $targetFilename ($([math]::Round($entry.Length/1MB, 2)) MB)"
                    [System.IO.Compression.ZipFileExtensions]::ExtractToFile($entry, $targetPath, $true)
                    $extractedCount++
                } else {
                    Write-Host "  -> Already exists: $targetFilename"
                    $extractedCount++
                }
            }
        }
        $archive.Dispose()
    }
}

Write-Host "Total extracted files: $extractedCount"
