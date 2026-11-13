Add-Type -AssemblyName System.IO.Compression.FileSystem

$zips = @(
    "C:\Users\sebas\.gemini\antigravity\scratch\tyan-biblioteca\+85 AUDIOLIBROS DE FINANZAS.zip",
    "C:\Users\sebas\.gemini\antigravity\scratch\tyan-biblioteca\+85 AUDIOLIBROS DE FINANZAS Y MÁS uno.zip",
    "C:\Users\sebas\.gemini\antigravity\scratch\tyan-biblioteca\+85 AUDIOLIBROS DE FINANZAS Y MÁS dos.zip"
)

foreach ($z in $zips) {
    if (Test-Path $z) {
        $archive = [System.IO.Compression.ZipFile]::OpenRead($z)
        $files = $archive.Entries | Where-Object { -not $_.FullName.EndsWith("/") -and -not $_.FullName.EndsWith("\") }
        Write-Host "=========================================="
        Write-Host ("FILE: " + (Split-Path $z -Leaf) + " (" + $files.Count + " entries)")
        Write-Host "=========================================="
        $files | Select-Object -First 30 | ForEach-Object {
            $mb = [math]::Round($_.Length / 1MB, 2)
            Write-Host ("  [" + $mb + " MB] " + $_.FullName)
        }
        if ($files.Count -gt 30) {
            Write-Host ("  ... y " + ($files.Count - 30) + " archivos mas.")
        }
        $archive.Dispose()
    } else {
        Write-Host "No encontrado: $z"
    }
}
