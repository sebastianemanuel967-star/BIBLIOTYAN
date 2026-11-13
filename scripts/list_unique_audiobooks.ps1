Add-Type -AssemblyName System.IO.Compression.FileSystem

$zips = @(
    "C:\Users\sebas\.gemini\antigravity\scratch\tyan-biblioteca\+85 AUDIOLIBROS DE FINANZAS.zip",
    "C:\Users\sebas\.gemini\antigravity\scratch\tyan-biblioteca\+85 AUDIOLIBROS DE FINANZAS Y MÁS uno.zip",
    "C:\Users\sebas\.gemini\antigravity\scratch\tyan-biblioteca\+85 AUDIOLIBROS DE FINANZAS Y MÁS dos.zip"
)

$allTitles = [System.Collections.Generic.HashSet[string]]::new()

foreach ($z in $zips) {
    if (Test-Path $z) {
        $archive = [System.IO.Compression.ZipFile]::OpenRead($z)
        foreach ($entry in $archive.Entries) {
            $parts = $entry.FullName.Split('/')
            if ($parts.Length -gt 1) {
                # Could be "+85 AUDIOLIBROS DE FINANZAS Y MÁS/<Title>/..." or "+85 AUDIOLIBROS.../<File.mp3>"
                if ($parts.Length -ge 3) {
                    $allTitles.Add($parts[1]) | Out-Null
                } else {
                    $allTitles.Add($parts[1]) | Out-Null
                }
            }
        }
        $archive.Dispose()
    }
}

Write-Host "Total distinct items/folders found:" $allTitles.Count
$allTitles | Sort-Object | ForEach-Object { Write-Host " - " $_ }
