/*
 * Filename: start-endpoint-tls.mjs
 * FullPath: apps/CWSP-reborn/scripts/start-endpoint-tls.mjs
 * Change date and time: 20.45.00_19.07.2026
 * Reason for changes: Boot CWSP-reborn runtime/endpoint with HTTPS :8434 (TLS).
 *   Prefers in-app SoT; falls back to workspace compat symlink.
 *
 * Usage:
 *   node scripts/start-endpoint-tls.mjs              # PM2 restart cwsp (TLS)
 *   node scripts/start-endpoint-tls.mjs --foreground  # tsx server-v2 in foreground
 *   node scripts/start-endpoint-tls.mjs --status      # health probe only
 */

import { spawn, spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import https from "node:https";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const APP_ROOT = path.resolve(__dirname, "..");
const ENDPOINT_ROOT = (() => {
    const local = path.resolve(APP_ROOT, "runtime/endpoint");
    if (fs.existsSync(path.join(local, "server-v2"))) return local;
    return path.resolve(APP_ROOT, "../../runtime/cwsp/endpoint");
})();
const PM2_NAME = process.env.CWSP_ENDPOINT_PM2_NAME || "cwsp";

function ensurePortableConfigLink() {
    const link = path.join(ENDPOINT_ROOT, "portable.config.json");
    const target = path.join(ENDPOINT_ROOT, "config/portable.config.json");
    if (!fs.existsSync(target)) {
        throw new Error(`missing ${target}`);
    }
    try {
        if (fs.existsSync(link)) {
            const st = fs.lstatSync(link);
            if (st.isSymbolicLink() || st.isFile()) return;
        }
        fs.symlinkSync("config/portable.config.json", link);
        console.log(`[start-endpoint-tls] linked portable.config.json → config/`);
    } catch (e) {
        if (!fs.existsSync(link)) throw e;
    }
}

function tlsEnv() {
    return {
        ...process.env,
        NODE_ENV: "production",
        CWS_HTTPS_ENABLED: "true",
        CWS_HTTPS_KEY: "./https/local/multi.key",
        CWS_HTTPS_CERT: "./https/local/multi.crt",
        CWS_HTTPS_CA: "./https/local/rootCA.crt",
        CWS_PORTABLE_CONFIG_PATH: "./portable.config.json",
        CWS_PORTABLE_DATA_PATH: "./.data",
        CWS_BRIDGE_REJECT_UNAUTHORIZED: "false",
        CWS_LISTEN_HOST: process.env.CWS_LISTEN_HOST || "0.0.0.0"
    };
}

function probeHealth(baseUrl = "https://127.0.0.1:8434", timeoutMs = 8000) {
    return new Promise((resolve) => {
        const url = new URL("/health", baseUrl);
        const req = https.request(
            {
                hostname: url.hostname,
                port: url.port || 443,
                path: url.pathname,
                method: "GET",
                timeout: timeoutMs,
                rejectUnauthorized: false
            },
            (res) => {
                let body = "";
                res.on("data", (c) => {
                    body += c;
                });
                res.on("end", () => {
                    resolve({
                        ok: res.statusCode >= 200 && res.statusCode < 300,
                        status: res.statusCode,
                        body: body.trim()
                    });
                });
            }
        );
        req.on("error", (err) => resolve({ ok: false, error: err.message }));
        req.on("timeout", () => {
            req.destroy();
            resolve({ ok: false, error: "timeout" });
        });
        req.end();
    });
}

async function waitHealthy(attempts = 20, delayMs = 500) {
    for (let i = 0; i < attempts; i++) {
        const r = await probeHealth();
        if (r.ok) return r;
        await new Promise((r) => setTimeout(r, delayMs));
    }
    return probeHealth();
}

function ensureDeps() {
    const tsxBin = path.join(ENDPOINT_ROOT, "node_modules/.bin/tsx");
    if (fs.existsSync(tsxBin)) return;
    console.log("[start-endpoint-tls] npm install (missing tsx)…");
    const r = spawnSync("npm", ["install"], {
        cwd: ENDPOINT_ROOT,
        stdio: "inherit",
        env: process.env
    });
    if (r.status !== 0) {
        throw new Error("npm install failed in endpoint root");
    }
}

function runPm2() {
    ensurePortableConfigLink();
    ensureDeps();
    const eco = path.join(ENDPOINT_ROOT, "ecosystem.config.cjs");
    // Drop stale zombie first (PM2 may show online with no pid).
    spawnSync("pm2", ["delete", PM2_NAME], { stdio: "inherit", cwd: ENDPOINT_ROOT });
    const env = tlsEnv();
    const start = spawnSync(
        "pm2",
        ["start", eco, "--only", PM2_NAME, "--update-env"],
        { stdio: "inherit", cwd: ENDPOINT_ROOT, env }
    );
    if (start.status !== 0) {
        // Fallback: direct launcher under PM2
        const launch = spawnSync(
            "pm2",
            [
                "start",
                "launcher.mjs",
                "--name",
                PM2_NAME,
                "--cwd",
                ENDPOINT_ROOT,
                "--update-env"
            ],
            { stdio: "inherit", cwd: ENDPOINT_ROOT, env }
        );
        if (launch.status !== 0) process.exit(launch.status ?? 1);
    }
}

function runForeground() {
    ensurePortableConfigLink();
    const env = tlsEnv();
    const child = spawn(
        path.join(ENDPOINT_ROOT, "node_modules/.bin/tsx"),
        ["server-v2/index.ts", "--config", "./portable.config.json", "--data", "./.data"],
        { cwd: ENDPOINT_ROOT, env, stdio: "inherit" }
    );
    child.on("exit", (code) => process.exit(code ?? 1));
}

async function main() {
    const args = process.argv.slice(2);
    if (args.includes("--help") || args.includes("-h")) {
        console.log(`start-endpoint-tls — boot runtime/cwsp/endpoint TLS :8434

  (default)     PM2 start/restart ${PM2_NAME} with HTTPS env
  --foreground  run server-v2 in this terminal
  --status      probe https://127.0.0.1:8434/health only
`);
        process.exit(0);
    }

    if (!fs.existsSync(ENDPOINT_ROOT)) {
        console.error(`[start-endpoint-tls] missing endpoint root: ${ENDPOINT_ROOT}`);
        process.exit(1);
    }

    if (args.includes("--status")) {
        const r = await probeHealth();
        console.log(r.ok ? `OK ${r.status} ${r.body}` : `FAIL ${r.error || r.status}`);
        process.exit(r.ok ? 0 : 1);
    }

    if (args.includes("--foreground")) {
        runForeground();
        return;
    }

    runPm2();
    const r = await waitHealthy();
    if (!r.ok) {
        console.error(`[start-endpoint-tls] TLS health failed: ${r.error || r.status}`);
        console.error("Check: pm2 logs " + PM2_NAME);
        process.exit(1);
    }
    console.log(`[start-endpoint-tls] TLS OK https://127.0.0.1:8434/health → ${r.body}`);
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
