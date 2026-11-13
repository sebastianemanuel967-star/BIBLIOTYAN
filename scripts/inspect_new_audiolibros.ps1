Add-Type -AssemblyName System.IO.Compression.FileSystem

$zips = @(
    "C:\Users\sebas\.gemini\antigravity\scratch\tyan-biblioteca\AUDIOLIBROS uno.zip",
    "C:\Users\sebas\.gemini\antigravity\scratch\tyan-biblioteca\AUDIOLIBROS dos.zip"
)

foreach ($z in $zips) {
    if (Test-Path $z) {
        $archive = [System.IO.Compression.ZipFile]::OpenRead($z)
        $files = $archive.Entries | Where-Object { -not $_.FullName.EndsWith("/") -and -not $_.FullName.EndsWith("\") }
        Write-Host "=========================================================="
        Write-Host ("ARCHIVO: " + (Split-Path $z -Leaf) + " (" + $files.Count + " elementos, " + [math]::Round((Get-Item $z).Length / 1MB, 2) + " MB)")
        Write-Host "=========================================================="
        
        $rootFolders = [System.Collections.Generic.HashSet[string]]::new()
        foreach ($e in $files) {
            $parts = $e.FullName.Split('/')
            if ($parts.Length -gt 1) {
                $rootFolders.Add($parts[0] + "/" + $parts[1]) | Out-Null
            } else {
                $rootFolders.Add($parts[0]) | Out-Null
            }
        }
        
        Write-Host "Carpetas / Títulos principales:"
        $rootFolders | Sort-Object | Select-Object -First 25 | ForEach-Object { Write-Host ("  📁 " + $_) }
        if ($rootFolders.Count -gt 25) {
            Write-Host ("  ... y " + ($rootFolders.Count - 25) + " carpetas más.")
        }
        
        Write-Host "`nMuestra de archivos de audio:"
        $files | Select-Object -First 10 | ForEach-Object {
            Write-Host ("  🎵 [" + [math]::Round($_.Length / 1MB, 2) + " MB] " + $_.FullName)
        }
        
        $archive.Dispose()
    } else {
        Write-Host "No encontrado: $z"
    }
}
