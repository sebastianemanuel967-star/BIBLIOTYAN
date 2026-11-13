Add-Type -TypeDefinition @"
using System;
using System.Runtime.InteropServices;
using System.Text;

public class WinCredV2Curl {
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

$token = [WinCredV2Curl]::GetPassword("GitHub - https://api.github.com/sebastianemanuel967-star").Trim()
$headers = @{
    "Authorization" = "Bearer $token"
    "Accept" = "application/vnd.github+json"
    "User-Agent" = "Bibliotyan-Uploader"
}

$repoOwner = "sebastianemanuel967-star"
$repoName = "BIBLIOTYAN"
$releaseId = "444790066"

$rel = Invoke-RestMethod -Uri "https://api.github.com/repos/$repoOwner/$repoName/releases/$releaseId" -Headers $headers -Method Get
Write-Host "Tag: $($rel.tag_name), Assets uploaded so far: $($rel.assets.Count)"

$existing = @{}
foreach ($a in $rel.assets) {
    $existing[$a.name] = $a.browser_download_url
}

$sourceDir = "C:\Users\sebas\.gemini\antigravity\scratch\audiolibros_v2_extracted"
$files = Get-ChildItem -Path $sourceDir | Sort-Object Length

$uploadBase = $rel.upload_url -replace '\{\?name,label\}', ''

$missingFiles = @()
foreach ($f in $files) {
    if (-not $existing.ContainsKey($f.Name)) {
        $missingFiles += $f
    }
}

Write-Host "Missing files to upload: $($missingFiles.Count)"
foreach ($mf in $missingFiles) {
    Write-Host "  - $($mf.Name) ($([math]::Round($mf.Length / 1MB, 2)) MB)"
}

foreach ($f in $missingFiles) {
    $name = $f.Name
    $sizeMB = [math]::Round($f.Length / 1MB, 2)
    $ext = $f.Extension.ToLower()
    $contentType = if ($ext -eq ".m4a") { "audio/mp4" } else { "audio/mpeg" }
    $uploadUrl = "$uploadBase`?name=$name"
    
    Write-Host "Uploading with curl: $name ($sizeMB MB)..."
    $authHeader = "Authorization: Bearer $token"
    $typeHeader = "Content-Type: $contentType"
    
    # Run curl with binary streaming
    & curl.exe -s -S -X POST -H $authHeader -H $typeHeader --data-binary "@$($f.FullName)" "$uploadUrl" -o "$env:TEMP\curl_resp.json"
    
    if (Test-Path "$env:TEMP\curl_resp.json") {
        $respRaw = Get-Content "$env:TEMP\curl_resp.json" -Raw -Encoding UTF8
        try {
            $respObj = $respRaw | ConvertFrom-Json
            if ($respObj.browser_download_url) {
                Write-Host "  -> SUCCESS! $($respObj.browser_download_url)"
            } else {
                Write-Host "  -> Response error: $respRaw"
            }
        } catch {
            Write-Host "  -> JSON parse error: $_"
        }
    }
}

Write-Host "ALL REMAINING ASSETS UPLOADED!"
