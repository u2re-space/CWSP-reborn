/*
 * Filename: sync-capacitor-android.mjs
 * FullPath: apps/CWSP-reborn/scripts/sync-capacitor-android.mjs
 * Change date and time: 18.25.00_10.07.2026
 * Reason for changes: Sanitize capacitor.config for APK — expand ${ENV:default},
 *   force http(s) androidScheme (literal placeholders caused black WebView).
 *
 * Layout:
 *   build/capacitor/web/**  →  app/android/src/main/assets/public/**
 *   capacitor.config.json   →  app/android/src/main/assets/capacitor.config.json
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const APP_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const WEB_DIR = path.join(APP_ROOT, "build/capacitor/web");
const ASSETS = path.join(APP_ROOT, "app/android/src/main/assets");
const PUBLIC = path.join(ASSETS, "public");
const CONFIG_CANDIDATES = [
    path.join(APP_ROOT, "src/frontend/web/capacitor/capacitor.config.json"),
    path.join(APP_ROOT, "app/android/capacitor.config.json")
];

function rimraf(dir) {
    fs.rmSync(dir, { recursive: true, force: true });
}

function copyTree(src, dest) {
    const st = fs.statSync(src);
    if (st.isFile()) {
        fs.mkdirSync(path.dirname(dest), { recursive: true });
        fs.copyFileSync(src, dest);
        return;
    }
    fs.mkdirSync(dest, { recursive: true });
    for (const name of fs.readdirSync(src)) {
        if (name === ".git" || name === "node_modules") continue;
        copyTree(path.join(src, name), path.join(dest, name));
    }
}

function resolveConfig() {
    for (const p of CONFIG_CANDIDATES) {
        if (fs.existsSync(p)) return p;
    }
    return null;
}

/**
 * Expand `${VAR}` / `${VAR:default}` using process.env.
 * WHY: Capacitor CapConfig does not expand shell-style placeholders; a literal
 * `${CWSP_ANDROID_SCHEME:https}` becomes the WebView scheme → black screen.
 */
function expandEnvPlaceholders(value) {
    if (typeof value === "string") {
        return value.replace(/\$\{([A-Za-z_][A-Za-z0-9_]*)(?::([^}]*))?\}/g, (_m, name, fallback) => {
            const env = process.env[name];
            if (env != null && String(env).length > 0) return String(env);
            return fallback != null ? String(fallback) : "";
        });
    }
    if (Array.isArray(value)) return value.map(expandEnvPlaceholders);
    if (value && typeof value === "object") {
        const out = {};
        for (const [k, v] of Object.entries(value)) out[k] = expandEnvPlaceholders(v);
        return out;
    }
    return value;
}

function sanitizeRuntimeConfig(raw) {
    const cfg = expandEnvPlaceholders(raw);
    delete cfg._comment;

    // INVARIANT: packaged assets live under assets/public.
    cfg.webDir = "public";

    cfg.server = cfg.server && typeof cfg.server === "object" ? { ...cfg.server } : {};
    let scheme = String(cfg.server.androidScheme || process.env.CWSP_ANDROID_SCHEME || "https")
        .trim()
        .toLowerCase();
    // SECURITY/COMPAT: CapConfig only safely hosts http(s)://localhost.
    if (scheme !== "http" && scheme !== "https") {
        console.warn(`[sync-capacitor-android] invalid androidScheme=${JSON.stringify(scheme)} → https`);
        scheme = "https";
    }
    cfg.server.androidScheme = scheme;
    cfg.server.cleartext =
        cfg.server.cleartext === true || process.env.CWSP_ALLOW_CLEARTEXT === "1";

    // Drop build-only keystore placeholders from the runtime asset (not used by Bridge).
    if (cfg.android && typeof cfg.android === "object") {
        const android = { ...cfg.android };
        if (android.buildOptions && typeof android.buildOptions === "object") {
            const bo = { ...android.buildOptions };
            for (const key of ["keystorePath", "keystoreAlias", "keystorePassword", "keyPassword"]) {
                if (typeof bo[key] === "string" && (bo[key].includes("${") || !bo[key])) {
                    delete bo[key];
                }
            }
            if (Object.keys(bo).length === 0) delete android.buildOptions;
            else android.buildOptions = bo;
        }
        cfg.android = android;
    }

    // Debug WebView console on non-release local builds.
    if (process.env.CWSP_ANDROID_WEB_DEBUG !== "0") {
        cfg.android = cfg.android && typeof cfg.android === "object" ? { ...cfg.android } : {};
        cfg.android.webContentsDebuggingEnabled = true;
    }

    return cfg;
}

function main() {
    if (!fs.existsSync(path.join(WEB_DIR, "index.html"))) {
        throw new Error(`missing ${WEB_DIR}/index.html — run vite build --mode capacitor first`);
    }
    rimraf(PUBLIC);
    fs.mkdirSync(PUBLIC, { recursive: true });
    copyTree(WEB_DIR, PUBLIC);

    const cfgPath = resolveConfig();
    if (!cfgPath) throw new Error("missing capacitor.config.json");
    const raw = JSON.parse(fs.readFileSync(cfgPath, "utf8"));
    const runtime = sanitizeRuntimeConfig(raw);

    fs.mkdirSync(ASSETS, { recursive: true });
    const outCfg = path.join(ASSETS, "capacitor.config.json");
    fs.writeFileSync(outCfg, JSON.stringify(runtime, null, 2) + "\n");

    console.log(`[sync-capacitor-android] ${WEB_DIR} → ${PUBLIC}`);
    console.log(
        `[sync-capacitor-android] config → ${outCfg} (androidScheme=${runtime.server.androidScheme})`
    );
}

try {
    main();
} catch (err) {
    console.error("[sync-capacitor-android]", err?.message || err);
    process.exit(1);
}
