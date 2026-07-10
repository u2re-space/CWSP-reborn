/*
 * Filename: runtime-env.mjs
 * FullPath: apps/CWSP-reborn/scripts/lib/runtime-env.mjs
 * Change date and time: 18.00.00_10.07.2026
 * Reason for changes: Shared env/path defaults for start + deploy scripts
 *   (.110 desk / .200 gateway; node vs java portable dirs).
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
    dir110Node: process.env.CWSP_DEPLOY_110_DIR_NODE || "C:/Users/U2RE/cwsp-node",
    dir110Java: process.env.CWSP_DEPLOY_110_DIR_JAVA || "C:/Users/U2RE/cwsp-java",
    host200: process.env.CWSP_DEPLOY_200_HOST || "192.168.0.200",
    user200: process.env.CWSP_DEPLOY_200_USER || os.userInfo().username || "u2re-dev",
    dir200Node: process.env.CWSP_DEPLOY_200_DIR_NODE || "/home/u2re-dev/cwsp-node",
    dir200Java: process.env.CWSP_DEPLOY_200_DIR_JAVA || "/home/u2re-dev/cwsp-java",
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

export function targetSpec(kind /* "110" | "200" */, runtime /* "node" | "java" */) {
    if (kind === "110") {
        return {
            host: DEFAULTS.host110,
            user: DEFAULTS.user110,
            dir: runtime === "java" ? DEFAULTS.dir110Java : DEFAULTS.dir110Node,
            label: `L-192.168.0.110/${runtime}`
        };
    }
    return {
        host: DEFAULTS.host200,
        user: DEFAULTS.user200,
        dir: runtime === "java" ? DEFAULTS.dir200Java : DEFAULTS.dir200Node,
        label: `L-192.168.0.200/${runtime}`
    };
}
