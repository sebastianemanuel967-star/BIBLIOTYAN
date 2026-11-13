$dataPath = "C:\Users\sebas\OneDrive\Documentos\GitHub\BIBLIOTYAN\js\data.js"
$content = Get-Content $dataPath -Raw -Encoding UTF8

$startMarker = "const BOOKS = ["
$endMarker = "const INITIAL_REQUESTS = ["

$startIndex = $content.IndexOf($startMarker)
$endIndex = $content.IndexOf($endMarker, $startIndex)

$rawArray = $content.Substring($startIndex + 14, $endIndex - ($startIndex + 14)).Trim()
if ($rawArray.EndsWith(";")) {
    $rawArray = $rawArray.Substring(0, $rawArray.Length - 1).Trim()
}

# 1. Strip all JS single-line comments: // ...
$clean = [regex]::Replace($rawArray, '(?m)^\s*//.*$', '')

# 2. Quote unquoted keys (matches at line starts, after {, or after ,)
# We run it twice to catch multiple keys on one line like { title: "...", url: "..." }
$clean = [regex]::Replace($clean, '([{,]\s*)([a-zA-Z0-9_]+)\s*:', '$1"$2":')
$clean = [regex]::Replace($clean, '([{,]\s*)([a-zA-Z0-9_]+)\s*:', '$1"$2":')
$clean = [regex]::Replace($clean, '(?m)^\s*([a-zA-Z0-9_]+)\s*:', '  "$1":')

# 3. Remove trailing commas before } or ]
$clean = [regex]::Replace($clean, ',\s*([\}\]])', '$1')

# Test parsing the entire array
Add-Type -AssemblyName System.Web.Extensions
$serializer = New-Object System.Web.Script.Serialization.JavaScriptSerializer
$serializer.MaxJsonLength = [int]::MaxValue

try {
    $parsed = $serializer.DeserializeObject($clean)
    Write-Host "GREAT SUCCESS! Total books parsed: " $parsed.Count
    if ($parsed.Count -eq 1368) {
        $outDir = "C:\Users\sebas\OneDrive\Documentos\GitHub\BIBLIOTYAN\data"
        if (-not (Test-Path $outDir)) { New-Item -ItemType Directory -Path $outDir | Out-Null }
        $outPath = Join-Path $outDir "books.json"
        [System.IO.File]::WriteAllText($outPath, $clean, [System.Text.Encoding]::UTF8)
        Write-Host "Successfully saved to $outPath (" ([math]::Round((Get-Item $outPath).Length / 1MB, 2)) "MB)"
    }
} catch {
    Write-Host "Error parsing: " $_.Exception.Message
}
