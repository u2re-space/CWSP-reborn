/*
 * Filename: desk-110-headless.mjs
 * FullPath: apps/CWSP-reborn/scripts/desk-110-headless.mjs
 * Change date and time: 21.58.00_11.07.2026
 * Reason for changes: Decision A — freeze Neutralino WebView UI; run Node clipboard-hub
 *   headless on .110 (control :18765 only). No resources.neu / no cwsp-neutralino.exe.
 *
 * Usage:
 *   node scripts/desk-110-headless.mjs              # stop UI + start headless hub
 *   node scripts/desk-110-headless.mjs --stop        # stop UI + hub
 *   node scripts/desk-110-headless.mjs --status      # probe :18764 / :18765
 */

import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { DEFAULTS } from "./lib/runtime-env.mjs";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const APP_ROOT = path.resolve(HERE, "..");
const START_PS1 = path.join(HERE, "desk-110-headless-start.ps1");

const host = DEFAULTS.host110;
const user = DEFAULTS.user110;
const sshTarget = `${user}@${host}`;
const remotePs1 = "C:/U2RE/desk-110-headless-start.ps1";

function encodePs(script) {
    return Buffer.from(script, "utf16le").toString("base64");
}

function sshEncoded(script) {
    const r = spawnSync(
        "ssh",
        [
            "-o",
            "ConnectTimeout=12",
            sshTarget,
            `powershell -NoProfile -ExecutionPolicy Bypass -EncodedCommand ${encodePs(script)}`
        ],
        { cwd: APP_ROOT, encoding: "utf8", maxBuffer: 4 * 1024 * 1024 }
    );
    if (r.stdout) process.stdout.write(r.stdout);
    if (r.stderr) process.stderr.write(r.stderr);
    return r.status ?? 1;
}

function scpStartScript() {
    if (!fs.existsSync(START_PS1)) {
        console.error("[desk-110-headless] missing", START_PS1);
        return 1;
    }
    const r = spawnSync("scp", ["-o", "ConnectTimeout=12", START_PS1, `${sshTarget}:${remotePs1}`], {
        cwd: APP_ROOT,
        encoding: "utf8"
    });
    if (r.status !== 0) {
        if (r.stderr) process.stderr.write(r.stderr);
        return r.status ?? 1;
    }
    return 0;
}

const STOP_UI_AND_ORPHANS = [
    "$ErrorActionPreference='SilentlyContinue'",
    "taskkill /F /IM cwsp-neutralino-win_x64.exe /T 2>$null | Out-Null",
    "Get-CimInstance Win32_Process | Where-Object {",
    "  $_.Name -in @('node.exe','cmd.exe') -and $_.CommandLine -and ($_.CommandLine -match 'cwsp-neutralino')",
    "} | ForEach-Object { Stop-Process -Id $_.ProcessId -Force }",
    "foreach ($tn in @('CWSP-Neu-IT','CWSP-Neu-Smoke','CWSP-Neu-Smoke2','CWSP-Neu-Smoke3','CWSP-Neutralino-Once')) {",
    "  schtasks /Change /TN $tn /DISABLE 2>$null | Out-Null",
    "}",
    "Start-Sleep -Milliseconds 600",
    "Write-Output 'stopped-ui-orphans'"
].join("; ");

const STATUS = [
    "$ErrorActionPreference='SilentlyContinue'",
    "$hdr=@{ 'X-API-Key'='cwsp-neutralino-local' }",
    "Write-Output '=== processes ==='",
    "Get-CimInstance Win32_Process | Where-Object {",
    "  $_.Name -match 'cwsp-neutralino' -or ($_.CommandLine -and $_.CommandLine -match 'cwsp-neutralino')",
    "} | Select-Object ProcessId,Name | Format-Table -AutoSize | Out-String",
    "try { Write-Output ('hub=' + (Invoke-WebRequest -UseBasicParsing http://127.0.0.1:18765/service/clipboard-hub -Headers $hdr -TimeoutSec 3).Content) }",
    "catch { Write-Output ('hub: ' + $_.Exception.Message) }",
    "try {",
    "  $req=[System.Net.HttpWebRequest]::Create('http://127.0.0.1:18764/')",
    "  $req.Timeout=1500; $req.ReadWriteTimeout=1500",
    "  $resp=$req.GetResponse(); $resp.Close()",
    "  Write-Output 'ui-18764=UP'",
    "} catch { Write-Output 'ui-18764=DOWN' }"
].join("; ");

const mode = process.argv.includes("--stop")
    ? "stop"
    : process.argv.includes("--status")
      ? "status"
      : "start";

console.log(`[desk-110-headless] ${mode} → ${sshTarget}`);

if (mode === "status") {
    process.exit(sshEncoded(STATUS));
}

const stopCode = sshEncoded(STOP_UI_AND_ORPHANS);
if (mode === "stop") process.exit(stopCode);

if (scpStartScript() !== 0) process.exit(1);
const startRemote = `powershell -NoProfile -ExecutionPolicy Bypass -File ${remotePs1}`;
const r = spawnSync("ssh", ["-o", "ConnectTimeout=20", sshTarget, startRemote], {
    cwd: APP_ROOT,
    encoding: "utf8",
    maxBuffer: 4 * 1024 * 1024
});
if (r.stdout) process.stdout.write(r.stdout);
if (r.stderr) process.stderr.write(r.stderr);
process.exit(r.status ?? 1);
