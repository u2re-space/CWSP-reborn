# Filename: desk-110-headless-start.ps1
# FullPath: apps/CWSP-reborn/scripts/desk-110-headless-start.ps1
# Change date and time: 22.00.00_11.07.2026
# Reason for changes: Decision A headless hub via cmd start /B (survives SSH).
$ErrorActionPreference = 'Continue'
$root = 'C:\U2RE\cwsp-neutralino'
$backend = Join-Path $root 'backend\node'
$entry = Join-Path $backend 'windows\index.ts'
$loader = Join-Path $backend 'resolve-aliases.mjs'
if (-not (Test-Path $entry)) { throw "missing $entry - run deploy:110:neutralino backend first" }

Get-CimInstance Win32_Process | Where-Object {
    $_.Name -eq 'node.exe' -and $_.CommandLine -and ($_.CommandLine -match 'cwsp-neutralino') -and (
        $_.CommandLine -match 'run-backend\.mjs' -or
        $_.CommandLine -match 'windows\\index\.ts' -or
        $_.CommandLine -match 'windows/index\.ts' -or
        $_.CommandLine -match 'extensions\\node\\main'
    )
} | ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }
Start-Sleep -Milliseconds 500

$tmp = Join-Path $root '.tmp'
New-Item -ItemType Directory -Force -Path $tmp | Out-Null
$logOut = Join-Path $tmp 'headless-backend.out.log'
$logErr = Join-Path $tmp 'headless-backend.err.log'
$wrapper = Join-Path $tmp 'start-headless-hub.cmd'
$loaderUri = ([Uri]$loader).AbsoluteUri

$cmdLines = @(
    '@echo off',
    'set CWSP_CLIPBOARD_HUB=1',
    'set CWSP_CLIENT_ID=L-110',
    'set CWSP_PLATFORM=windows',
    "set CWSP_NL_PACKAGE_ROOT=$root",
    "set CWSP_ROOT=$root",
    'set CWSP_CONTROL_PORT=18765',
    'set CWSP_CONTROL_KEY=cwsp-neutralino-local',
    'set CWSP_ALLOW_INSECURE_TLS=1',
    "cd /d `"$backend`"",
    "node --import `"$loaderUri`" --experimental-strip-types `"$entry`" >> `"$logOut`" 2>> `"$logErr`""
)
$cmdLines | Set-Content -Encoding ASCII -Path $wrapper

# WHY: cmd start /B keeps hub alive after SSH PowerShell exits.
cmd.exe /c "start `"CWSP-Headless-Hub`" /MIN `"$wrapper`""
Write-Output "started-headless-cmd wrapper=$wrapper"
Start-Sleep -Seconds 4

try {
    $hdr = @{ 'X-API-Key' = 'cwsp-neutralino-local' }
    $hub = (Invoke-WebRequest -UseBasicParsing http://127.0.0.1:18765/service/clipboard-hub -Headers $hdr -TimeoutSec 4).Content
    Write-Output "hub=$hub"
} catch {
    Write-Output "hub-probe: $($_.Exception.Message)"
}

try {
    $req = [System.Net.HttpWebRequest]::Create('http://127.0.0.1:18764/')
    $req.Timeout = 1500
    $req.ReadWriteTimeout = 1500
    $null = $req.GetResponse()
    Write-Output 'WARN ui-18764-still-listening (Neutralino UI not fully frozen)'
} catch {
    Write-Output 'ok ui-18764-down (expected for Decision A)'
}
