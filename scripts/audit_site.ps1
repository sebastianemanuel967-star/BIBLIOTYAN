# ========================================================
#  BIBLIOTYAN — Suite de Auditoría Automatizada & Salud del Sitio
# ========================================================

$repoDir = Split-Path -Parent $PSScriptRoot
$htmlPath = Join-Path $repoDir "index.html"
$appPath = Join-Path $repoDir "js\app.js"
$dataPath = Join-Path $repoDir "js\data.js"
$stylesPath = Join-Path $repoDir "css\styles.css"

Write-Host "================== AUDITORÍA DE SALUD BIBLIOTYAN ==================" -ForegroundColor Cyan

$allPass = $true

# 1. Balance de etiquetas HTML
$html = Get-Content $htmlPath -Raw -Encoding UTF8
$openDivs = ([regex]::Matches($html, '<div[\s>]')).Count
$closeDivs = ([regex]::Matches($html, '</div>')).Count
if ($openDivs -eq $closeDivs) {
    Write-Host "[OK] Balance HTML: $openDivs divs abiertos y cerrados correctamente." -ForegroundColor Green
} else {
    Write-Host "[FALLO] Desbalance en divs: Abiertos=$openDivs, Cerrados=$closeDivs" -ForegroundColor Red
    $allPass = $false
}

# 2. Enlaces internos ancla (#target)
$anchors = [regex]::Matches($html, 'href="#([a-zA-Z0-9_\-]+)"')
$missingTargets = @()
foreach ($m in $anchors) {
    $target = $m.Groups[1].Value
    if ($target -ne "" -and ($html -notmatch "id=`"$target`"" -and $html -notmatch "id='$target'")) {
        $missingTargets += $target
    }
}
if ($missingTargets.Count -eq 0) {
    Write-Host "[OK] Enlaces internos (#): Todos los destinos de ancla existen en el DOM." -ForegroundColor Green
} else {
    Write-Host "[FALLO] Anclas rotas sin ID de destino: $($missingTargets -join ', ')" -ForegroundColor Red
    $allPass = $false
}

# 3. Redes Sociales Actualizadas
$data = Get-Content $dataPath -Raw -Encoding UTF8
$tgExpected = "https://t.me/bibliotyan"
$igExpected = "https://www.instagram.com/tyanmena/"
$fbExpected = "https://www.facebook.com/reel/1426164676340634?locale=es_LA"

$tgOk = $data.Contains("`"$tgExpected`"") -and $html.Contains($tgExpected)
$igOk = $data.Contains("`"$igExpected`"") -and $html.Contains($igExpected)
$fbOk = $data.Contains("`"$fbExpected`"") -and $html.Contains($fbExpected)

if ($tgOk -and $igOk -and $fbOk) {
    Write-Host "[OK] Redes Sociales sincronizadas al 100%:" -ForegroundColor Green
    Write-Host "     • Telegram:  $tgExpected" -ForegroundColor Gray
    Write-Host "     • Instagram: $igExpected" -ForegroundColor Gray
    Write-Host "     • Facebook:  $fbExpected" -ForegroundColor Gray
} else {
    Write-Host "[FALLO] Inconsistencia en redes sociales: TG=$tgOk, IG=$igOk, FB=$fbOk" -ForegroundColor Red
    $allPass = $false
}

# 4. Elementos Requeridos de Colecciones y Catalogo
$requiredIds = @(
    'cardColDummies', 'cardColHistoria', 'cardColHarvard', 'cardColEmprendedores', 'cardColTeologia', 'cardColAdmin',
    'colCountDummies', 'colCountHistoria', 'colCountHarvard', 'colCountEmprendedores', 'colCountTeologia', 'colCountAdmin',
    'knowledgeGrid', 'booksGrid', 'catalogPagination', 'editorialShelf', 'mostReadShelf', 'filterBar', 'specialCollectionsGrid', 'requestSheetModal'
)
$missingIds = @()
foreach ($id in $requiredIds) {
    if ($html -notmatch "id=`"$id`"" -and $html -notmatch "id='$id'") {
        $missingIds += $id
    }
}
if ($missingIds.Count -eq 0) {
    Write-Host "[OK] Contenedores de UI: Los $($requiredIds.Count) IDs críticos existen en index.html." -ForegroundColor Green
} else {
    Write-Host "[FALLO] Faltan IDs en UI: $($missingIds -join ', ')" -ForegroundColor Red
    $allPass = $false
}

# 5. Integridad de Base de Datos de Libros
$idMatches = [regex]::Matches($data, 'id:\s*(\d+)')
$seenIds = @{}
$dupCount = 0
foreach ($m in $idMatches) {
    $bid = [int]$m.Groups[1].Value
    if ($seenIds.ContainsKey($bid)) { $dupCount++ } else { $seenIds[$bid] = 1 }
}

$totalBooks = $idMatches.Count
$customIgMatches = [regex]::Matches($data, 'customInstagram:\s*"([^"]+)"')
$customFbMatches = [regex]::Matches($data, 'customFacebook:\s*"([^"]+)"')
$customIgOnlyPromo = ($customIgMatches.Count -eq 1 -and $customIgMatches[0].Groups[1].Value -eq "https://www.instagram.com/brauliohipnocoach/")
$customFbOnlyPromo = ($customFbMatches.Count -eq 1 -and $customFbMatches[0].Groups[1].Value -eq "https://www.facebook.com/reel/3331699850354721")
if ($totalBooks -eq 1322 -and $dupCount -eq 0 -and $customIgOnlyPromo -and $customFbOnlyPromo) {
    Write-Host "[OK] Base de datos de libros: 1.322 libros registrados con 0 IDs duplicados y promo IG/FB exclusivo (1 libro)." -ForegroundColor Green
} else {
    Write-Host "[FALLO] Base de datos: Total=$totalBooks (Esperado: 1322), Duplicados=$dupCount, CustomIG=$($customIgMatches.Count), CustomFB=$($customFbMatches.Count)" -ForegroundColor Red
    $allPass = $false
}

Write-Host "====================================================================" -ForegroundColor Cyan
if ($allPass) {
    Write-Host ">>> TODOS LOS TESTS PASARON: SITIO ESTABLE Y SALUDABLE (0 FALLAS) <<<" -ForegroundColor Green
} else {
    Write-Host ">>> SE ENCONTRARON FALLAS QUE DEBEN CORREGIRSE <<<" -ForegroundColor Red
}
