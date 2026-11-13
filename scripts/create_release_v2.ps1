Add-Type -TypeDefinition @"
using System;
using System.Runtime.InteropServices;
using System.Text;

public class WinCredRel2 {
    [DllImport("Advapi32.dll", SetLastError = true, EntryPoint = "CredReadW", CharSet = CharSet.Unicode)]
    public static extern bool CredRead(string target, int type, int reservedFlag, out IntPtr credentialPtr);

    [DllImport("Advapi32.dll", SetLastError = true, EntryPoint = "CredFree")]
    public static extern void CredFree(IntPtr credentialPtr);

    [StructLayout(LayoutKind.Sequential, CharSet = CharSet.Unicode)]
    public struct CREDENTIAL {
        public int Flags;
        public int Type;
        public string TargetName;
        public string Comment;
        public System.Runtime.InteropServices.ComTypes.FILETIME LastWritten;
        public int CredentialBlobSize;
        public IntPtr CredentialBlob;
        public int Persist;
        public int AttributeCount;
        public IntPtr Attributes;
        public string TargetAlias;
        public string UserName;
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

$token = [WinCredRel2]::GetPassword("GitHub - https://api.github.com/sebastianemanuel967-star").Trim()

$headers = @{
    "Authorization" = "Bearer $token"
    "Accept" = "application/vnd.github+json"
    "User-Agent" = "Bibliotyan-Uploader"
}

$repo = "sebastianemanuel967-star/BIBLIOTYAN"
$tag = "audiolibros-v2"

# Check if release exists
$releaseUrl = "https://api.github.com/repos/$repo/releases/tags/$tag"
$release = $null

try {
    $release = Invoke-RestMethod -Uri $releaseUrl -Headers $headers -Method Get
    Write-Host "Release already exists: $($release.name) (ID: $($release.id))"
} catch {
    Write-Host "Creating release $tag..."
    $createUrl = "https://api.github.com/repos/$repo/releases"
    $body = @{
        tag_name = $tag
        name = "Coleccion Audiolibros v2 - BIBLIOTYAN"
        body = "Segunda entrega de la colección oficial de audiolibros y conferencias de BIBLIOTYAN."
        draft = $false
        prerelease = $false
    } | ConvertTo-Json
    $release = Invoke-RestMethod -Uri $createUrl -Headers $headers -Method Post -Body $body -ContentType "application/json; charset=utf-8"
    Write-Host "Created release successfully (ID: $($release.id))"
}
