/*
 * Filename: runtime-env.mjs
 * FullPath: apps/CWSP-reborn/scripts/lib/runtime-env.mjs
 * Change date and time: 17.25.00_11.07.2026
 * Reason for changes: Fix Windows MSYS2 rsync paths (C:/ → /c/) so deploy:110
 *   does not land under /c/Users/U2RE/C:/U2RE/...
 *
 * NOTE: Host/user defaults are LAN logical targets only — override via env.
 * Never embed tokens/passwords here.
 */

import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
/** apps/CWSP-reborn */
export const APP_ROOT = path.resolve(HERE, "../..");

export const DEFAULTS = Object.freeze({
    host110: process.env.CWSP_DEPLOY_110_HOST || "192.168.0.110",
    user110: process.env.CWSP_DEPLOY_110_USER || "U2RE",
    /** Windows OpenSSH path form preferred for scp/rsync. */
    dir110Node: process.env.CWSP_DEPLOY_110_DIR_NODE || "C:/U2RE/cwsp-node",
    dir110Java: process.env.CWSP_DEPLOY_110_DIR_JAVA || "C:/U2RE/cwsp-java",
    dir110Neutralino:
        process.env.CWSP_DEPLOY_110_DIR_NEUTRALINO || "C:/U2RE/cwsp-neutralino",
    host200: process.env.CWSP_DEPLOY_200_HOST || "192.168.0.200",
    user200: process.env.CWSP_DEPLOY_200_USER || os.userInfo().username || "u2re-dev",
    dir200Node: process.env.CWSP_DEPLOY_200_DIR_NODE || "/home/u2re-dev/cwsp-node",
    dir200Java: process.env.CWSP_DEPLOY_200_DIR_JAVA || "/home/u2re-dev/cwsp-java",
    dir200Neutralino:
        process.env.CWSP_DEPLOY_200_DIR_NEUTRALINO ||
        "/home/u2re-dev/cwsp-neutralino",
    pm2NodeName: process.env.CWSP_PM2_NODE_NAME || "cwsp-reborn-node",
    pm2JavaName: process.env.CWSP_PM2_JAVA_NAME || "cwsp-reborn-java",
    javaOut: process.env.CWSP_JAVA_OUT || path.join(APP_ROOT, "build", "java-backend"),
    nodeEntryLinux: "src/backend/node/linux/index.ts",
    nodeEntryWindows: "src/backend/node/windows/index.ts"
});

export function detectPlatform() {
    const forced = String(process.env.CWSP_PLATFORM || "").trim().toLowerCase();
    if (forced === "windows" || forced === "linux") {
        return forced;
    }
    return process.platform === "win32" ? "windows" : "linux";
}

export function nodeEntryForPlatform(platform = detectPlatform()) {
    return platform === "windows" ? DEFAULTS.nodeEntryWindows : DEFAULTS.nodeEntryLinux;
}

export function javaMainForPlatform(platform = detectPlatform()) {
    return platform === "windows"
        ? "space.u2re.cwsp.backend.windows.Main"
        : "space.u2re.cwsp.backend.linux.Main";
}

/**
 * Resolve remote deploy directory for a runtime.
 * @param {"110"|"200"} kind
 * @param {"node"|"java"|"neutralino"|"windows"} runtime
 */
export function dirForRuntime(kind, runtime) {
    const rt = runtime === "windows" ? "neutralino" : runtime;
    if (kind === "110") {
        if (rt === "java") return DEFAULTS.dir110Java;
        if (rt === "neutralino") return DEFAULTS.dir110Neutralino;
        return DEFAULTS.dir110Node;
    }
    if (rt === "java") return DEFAULTS.dir200Java;
    if (rt === "neutralino") return DEFAULTS.dir200Neutralino;
    return DEFAULTS.dir200Node;
}

/**
 * @param {"110"|"200"} kind
 * @param {"node"|"java"|"neutralino"|"windows"} runtime
 */
export function targetSpec(kind, runtime) {
    const rt = runtime === "windows" ? "neutralino" : runtime;
    if (kind === "110") {
        return {
            host: DEFAULTS.host110,
            user: DEFAULTS.user110,
            dir: dirForRuntime("110", rt),
            label: `L-192.168.0.110/${rt}`,
            /** Desk is Windows — rsync must use MSYS paths (/c/...), not C:/... */
            windowsRemote: true
        };
    }
    return {
        host: DEFAULTS.host200,
        user: DEFAULTS.user200,
        dir: dirForRuntime("200", rt),
        label: `L-192.168.0.200/${rt}`,
        windowsRemote: false
    };
}

/** Forward slashes only. */
export function normalizeSlashPath(dir) {
    return String(dir).replace(/\\/g, "/");
}

/**
 * Detect Windows absolute path forms: `C:/...`, `C:\...`, or already-MSYS `/c/...`.
 */
export function isWindowsStylePath(dir) {
    const n = normalizeSlashPath(dir);
    return /^[A-Za-z]:\//.test(n) || /^\/[A-Za-z]\//.test(n);
}

/**
 * Convert `C:/U2RE/foo` → `/c/U2RE/foo` for MSYS2/Cygwin rsync on Windows.
 *
 * WHY: MSYS rsync treats `C:/...` as a *relative* path (`$HOME/C:/...`), which
 * produces errors like: change_dir "/c/Users/U2RE/C:/U2RE/...".
 */
export function toMsysRsyncPath(dir) {
    const n = normalizeSlashPath(dir).replace(/\/+$/, "") || "/";
    const msys = n.match(/^\/([A-Za-z])\/(.*)$/);
    if (msys) {
        return `/${msys[1].toLowerCase()}/${msys[2]}`.replace(/\/+$/, "") ||
            `/${msys[1].toLowerCase()}`;
    }
    const win = n.match(/^([A-Za-z]):\/(.*)$/);
    if (win) {
        const rest = win[2].replace(/^\/+|\/+$/g, "");
        return rest
            ? `/${win[1].toLowerCase()}/${rest}`
            : `/${win[1].toLowerCase()}`;
    }
    return n;
}

/**
 * Windows path form for OpenSSH/PowerShell mkdir & scp: `C:/U2RE/foo`.
 */
export function toWindowsSlashPath(dir) {
    const n = normalizeSlashPath(dir).replace(/\/+$/, "");
    const msys = n.match(/^\/([A-Za-z])\/(.*)$/);
    if (msys) {
        const rest = msys[2].replace(/^\/+|\/+$/g, "");
        return rest
            ? `${msys[1].toUpperCase()}:/${rest}`
            : `${msys[1].toUpperCase()}:/`;
    }
    const win = n.match(/^([A-Za-z]):\/(.*)$/);
    if (win) {
        const rest = win[2].replace(/^\/+|\/+$/g, "");
        return rest
            ? `${win[1].toUpperCase()}:/${rest}`
            : `${win[1].toUpperCase()}:/`;
    }
    return n;
}
