/*
 * Filename: phone-ws-e2.mjs
 * FullPath: apps/CWSP-reborn/scripts/phone-ws-e2.mjs
 * Change date and time: 18.55.00_10.07.2026
 * Reason for changes: ADB install APK + configure endpoint/token + watch native /ws open.
 *
 * Usage:
 *   node scripts/phone-ws-e2.mjs
 *   node scripts/phone-ws-e2.mjs --serial 192.168.0.196:5555
 *   node scripts/phone-ws-e2.mjs --endpoint https://192.168.0.200:8434 --client-id L-192.168.0.196
 *
 * Env:
 *   CWSP_ADB_SERIAL, CWSP_WS_TOKEN / CWS_ASSOCIATED_TOKEN / CWS_CLIENT_TOKEN
 *   CWSP_WS_URL / CWS_ENDPOINT_URL
 */

import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const APP_ROOT = path.resolve(__dirname, "..");
const APK = path.join(APP_ROOT, "build/capacitor/apk/cwsp-debug.apk");
const PKG = "space.u2re.cwsp";
const ACTIVITY = "space.u2re.cwsp.MainActivity";

function parseArgs(argv) {
    const out = {
        serial: process.env.CWSP_ADB_SERIAL || "192.168.0.196:5555",
        endpoint:
            process.env.CWSP_WS_URL ||
            process.env.CWS_ENDPOINT_URL ||
            "https://192.168.0.200:8434",
        clientId: process.env.CWSP_WS_CLIENT_ID || "L-192.168.0.196",
        waitMs: 20000,
        skipInstall: false
    };
    for (let i = 0; i < argv.length; i++) {
        const a = argv[i];
        if (a === "--serial") out.serial = argv[++i];
        else if (a === "--endpoint") out.endpoint = argv[++i];
        else if (a === "--client-id") out.clientId = argv[++i];
        else if (a === "--wait") out.waitMs = Number(argv[++i]) || 20000;
        else if (a === "--skip-install") out.skipInstall = true;
        else if (a === "--help" || a === "-h") out.help = true;
    }
    return out;
}

function adb(serial, args, opts = {}) {
    const full = ["-s", serial, ...args];
    const r = spawnSync("adb", full, {
        encoding: "utf8",
        timeout: opts.timeout ?? 60000,
        maxBuffer: 4 * 1024 * 1024
    });
    return {
        status: r.status ?? 1,
        stdout: r.stdout || "",
        stderr: r.stderr || "",
        error: r.error
    };
}

function main() {
    const args = parseArgs(process.argv.slice(2));
    if (args.help) {
        console.log(`phone-ws-e2 — ADB install + CONFIGURE intent + logcat /ws open

  --serial <host:5555>
  --endpoint <https://…:8434>
  --client-id <L-…>
  --wait <ms>
  --skip-install
`);
        process.exit(0);
    }

    const token =
        process.env.CWSP_WS_TOKEN ||
        process.env.CWS_CLIENT_TOKEN ||
        process.env.CWS_ASSOCIATED_TOKEN ||
        "";
    if (!token) {
        console.error("[phone-ws-e2] missing token env");
        process.exit(2);
    }
    if (!args.skipInstall && !fs.existsSync(APK)) {
        console.error(`[phone-ws-e2] missing APK: ${APK} (run npm run build:capacitor)`);
        process.exit(2);
    }

    console.log(`[phone-ws-e2] adb connect ${args.serial}`);
    const host = args.serial.includes(":") ? args.serial : `${args.serial}:5555`;
    spawnSync("adb", ["connect", host], { encoding: "utf8", timeout: 15000 });
    const devices = spawnSync("adb", ["devices", "-l"], { encoding: "utf8" });
    console.log((devices.stdout || "").trim());
    if (!(devices.stdout || "").includes(host.split(":")[0])) {
        console.error("[phone-ws-e2] device not listed — check ADB over TCP");
        process.exit(1);
    }

    if (!args.skipInstall) {
        console.log(`[phone-ws-e2] install ${APK}`);
        const inst = adb(host, ["install", "-r", APK], { timeout: 120000 });
        if (inst.status !== 0) {
            console.error(inst.stdout || inst.stderr);
            process.exit(inst.status);
        }
        console.log("[phone-ws-e2] install ok");
    }

    // Clear prior logcat noise for our tags.
    adb(host, ["logcat", "-c"]);

    console.log(`[phone-ws-e2] configure endpoint=${args.endpoint} clientId=${args.clientId}`);
    const start = adb(host, [
        "shell",
        "am",
        "start",
        "-n",
        `${PKG}/${ACTIVITY}`,
        "-a",
        "space.u2re.cwsp.CONFIGURE",
        "--es",
        "endpoint",
        args.endpoint,
        "--es",
        "clientId",
        args.clientId,
        "--es",
        "token",
        token,
        "--ez",
        "startBridge",
        "true"
    ]);
    if (start.status !== 0) {
        console.error(start.stdout || start.stderr);
        process.exit(start.status);
    }

    console.log(`[phone-ws-e2] watching logcat ≤${args.waitMs}ms for WS open…`);
    const deadline = Date.now() + args.waitMs;
    let dump = "";
    let sawError = false;
    while (Date.now() < deadline) {
        const snap = adb(host, [
            "logcat",
            "-d",
            "-v",
            "brief",
            "-s",
            "CwspWsClient:*",
            "CwspBridgeService:*",
            "CwspMain:*"
        ]);
        dump = snap.stdout || "";
        if (/\[socket:transport-connect\] open/.test(dump)) {
            console.log("[phone-ws-e2] OK — native /ws open seen in logcat");
            const lines = dump
                .split("\n")
                .filter((l) => /CwspWs|CwspBridge|CwspMain|socket:/.test(l))
                .slice(-16);
            console.log(lines.join("\n"));
            process.exit(0);
        }
        if (/4001|Invalid credentials|missing endpoint|initiate-failed/.test(dump)) {
            sawError = true;
        }
        // WHY: OkHttp may emit a transient "Socket closed" during the first
        // reconnect race after CONFIGURE; keep waiting for a later open.
        spawnSync("sleep", ["1"]);
    }

    console.error("[phone-ws-e2] FAIL — timeout waiting for /ws open");
    if (sawError) console.error("[phone-ws-e2] note: auth/config errors were also seen");
    console.error(
        dump
            .split("\n")
            .filter((l) => /CwspWs|CwspBridge|CwspMain|socket:|Cws/.test(l))
            .slice(-40)
            .join("\n") || "(no matching log lines)"
    );
    process.exit(1);
}

main();
