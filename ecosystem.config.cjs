/*
 * Filename: ecosystem.config.cjs
 * FullPath: apps/CWSP-reborn/ecosystem.config.cjs
 * Change date and time: 19.45.00_11.07.2026
 * Reason for changes: Disable clipboard-hub on server PM2 (gateway must stay L-200, not fake L-110).
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
                // WHY: linux entry defaults to Neutralino desk hub; on .200 that DoS'd /ws as L-110.
                CWSP_CLIPBOARD_HUB: process.env.CWSP_CLIPBOARD_HUB || (isWin ? "1" : "0"),
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
