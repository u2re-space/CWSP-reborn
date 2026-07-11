/*
 * Filename: ecosystem.config.cjs
 * FullPath: apps/CWSP-reborn/ecosystem.config.cjs
 * Change date and time: 21.55.00_11.07.2026
 * Reason for changes: Decision A — Win clipboard SoT is headless Node hub on .110;
 *   Neutralino WebView UI frozen (do not enable hub as fake L-110 on gateway).
 */

const path = require("node:path");

const root = __dirname;
const nodeLoader = path.join(root, "scripts", "resolve-aliases.mjs");
const startRuntime = path.join(root, "scripts", "start-runtime.mjs");
const isWin = process.platform === "win32";
const nodeEntry = isWin
    ? path.join(root, "src", "backend", "node", "windows", "index.ts")
    : path.join(root, "src", "backend", "node", "linux", "index.ts");

module.exports = {
    apps: [
        {
            name: process.env.CWSP_PM2_NODE_NAME || "cwsp-reborn-node",
            cwd: root,
            script: process.execPath,
            args: ["--import", nodeLoader, "--experimental-strip-types", nodeEntry],
            interpreter: "none",
            autorestart: true,
            max_restarts: 20,
            env: {
                CWSP_PLATFORM: isWin ? "windows" : "linux",
                // WHY: linux/gateway must never run desk clipboard-hub as L-110 (4001 DoS).
                // INVARIANT (Decision A): clipboard SoT for Win is headless Node on .110
                // (`npm run desk:110:headless`) — Neutralino WebView UI is frozen.
                CWSP_CLIPBOARD_HUB: isWin
                    ? process.env.CWSP_CLIPBOARD_HUB || "1"
                    : "0",
                CWSP_CLIENT_ID: process.env.CWSP_CLIENT_ID || (isWin ? "L-110" : "L-200")
            }
        },
        {
            name: process.env.CWSP_PM2_JAVA_NAME || "cwsp-reborn-java",
            cwd: root,
            script: process.execPath,
            args: [startRuntime, "--runtime", "java"],
            interpreter: "none",
            autorestart: true,
            max_restarts: 20
        }
    ]
};
