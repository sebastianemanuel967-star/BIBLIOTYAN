Add-Type -AssemblyName System.IO.Compression.FileSystem

$z = "C:\Users\sebas\.gemini\antigravity\scratch\tyan-biblioteca\AUDIOLIBROS dos.zip"
$archive = [System.IO.Compression.ZipFile]::OpenRead($z)
$files = $archive.Entries | Where-Object { -not $_.FullName.EndsWith("/") -and -not $_.FullName.EndsWith("\") }

Write-Host "Total entries in AUDIOLIBROS dos.zip:" $files.Count
$files | ForEach-Object {
    $mb = [math]::Round($_.Length / 1MB, 2)
    Write-Host ("  [" + $mb + " MB] " + $_.Name)
}
$archive.Dispose()
