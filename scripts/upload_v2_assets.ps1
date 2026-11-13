Add-Type -TypeDefinition @"
using System;
using System.Runtime.InteropServices;
using System.Text;

public class WinCredV2 {
    [DllImport("Advapi32.dll", SetLastError = true, EntryPoint = "CredReadW", CharSet = CharSet.Unicode)]
    public static extern bool CredRead(string target, int type, int reservedFlag, out IntPtr credentialPtr);
    [DllImport("Advapi32.dll", SetLastError = true, EntryPoint = "CredFree")]
    public static extern void CredFree(IntPtr credentialPtr);

    [StructLayout(LayoutKind.Sequential, CharSet = CharSet.Unicode)]
    public struct CREDENTIAL {
        public int Flags; public int Type; public string TargetName; public string Comment;
        public System.Runtime.InteropServices.ComTypes.FILETIME LastWritten;
        public int CredentialBlobSize; public IntPtr CredentialBlob;
        public int Persist; public int AttributeCount; public IntPtr Attributes;
        public string TargetAlias; public string UserName;
    }

    public static string GetPassword(string target) {
        IntPtr credPtr;
        if (CredRead(target, 1, 0, out credPtr)) {
            CREDENTIAL cred = (CREDENTIAL)Marshal.PtrToStructure(credPtr, typeof(CREDENTIAL));
            byte[] bytes = new byte[cred.CredentialBlobSize];
            Marshal.Copy(cred.CredentialBlob, bytes, 0, cred.CredentialBlobSize);
            CredFree(credPtr);
            return Encoding.UTF8.GetString(bytes);
        }
        return null;
    }
}
"@

$token = [WinCredV2]::GetPassword("GitHub - https://api.github.com/sebastianemanuel967-star").Trim()
$headers = @{
    "Authorization" = "Bearer $token"
    "Accept" = "application/vnd.github+json"
    "User-Agent" = "Bibliotyan-Uploader"
}

$repoOwner = "sebastianemanuel967-star"
$repoName = "BIBLIOTYAN"
$releaseId = "444790066"

Write-Host "Fetching release $releaseId..."
$rel = Invoke-RestMethod -Uri "https://api.github.com/repos/$repoOwner/$repoName/releases/$releaseId" -Headers $headers -Method Get
Write-Host "Tag: $($rel.tag_name), Existing assets: $($rel.assets.Count)"

$existingAssets = @{}
foreach ($a in $rel.assets) {
    $existingAssets[$a.name] = $a.browser_download_url
}

$sourceDir = "C:\Users\sebas\.gemini\antigravity\scratch\audiolibros_v2_extracted"
$files = Get-ChildItem -Path $sourceDir | Sort-Object Length

$uploadBase = $rel.upload_url -replace '\{\?name,label\}', ''

$manifest = @()
$uploadedCount = 0
$skippedCount = 0

foreach ($f in $files) {
    $name = $f.Name
    $sizeMB = [math]::Round($f.Length / 1MB, 2)
    $ext = $f.Extension.ToLower()
    $contentType = if ($ext -eq ".m4a") { "audio/mp4" } else { "audio/mpeg" }
    
    if ($existingAssets.ContainsKey($name)) {
        Write-Host "[SKIP] $name already exists: $($existingAssets[$name])"
        $downloadUrl = $existingAssets[$name]
        $skippedCount++
    } else {
        Write-Host "[$($uploadedCount + $skippedCount + 1)/$($files.Count)] Uploading $name ($sizeMB MB)..."
        $uploadUrl = "$uploadBase`?name=$name"
        $uploadHeaders = @{
            "Authorization" = "Bearer $token"
            "Content-Type" = $contentType
            "User-Agent" = "Bibliotyan-Uploader"
        }
        
        $success = $false
        for ($retry = 1; $retry -le 3; $retry++) {
            try {
                $resp = Invoke-RestMethod -Uri $uploadUrl -Headers $uploadHeaders -Method Post -InFile $f.FullName -TimeoutSec 600
                $downloadUrl = $resp.browser_download_url
                $existingAssets[$name] = $downloadUrl
                $uploadedCount++
                Write-Host "  -> OK! $downloadUrl"
                $success = $true
                break
            } catch {
                Write-Host "  -> Error on attempt $retry`: $_"
                Start-Sleep -Seconds 3
            }
        }
        if (-not $success) {
            Write-Host "  -> FAILED to upload $name after 3 attempts!"
            continue
        }
    }
    
    $manifest += [PSCustomObject]@{
        FileName = $name
        SizeMB = $sizeMB
        DownloadUrl = $downloadUrl
    }
}

$manifestJsonPath = "C:\Users\sebas\OneDrive\Documentos\GitHub\BIBLIOTYAN\data\audiolibros_v2_assets.json"
$manifest | ConvertTo-Json -Depth 4 | Set-Content -Path $manifestJsonPath -Encoding UTF8
Write-Host "Finished! Uploaded: $uploadedCount, Skipped: $skippedCount. Manifest saved to $manifestJsonPath."
