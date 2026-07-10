/*
 * Filename: ecosystem.config.cjs
 * FullPath: apps/CWSP-reborn/ecosystem.config.cjs
 * Change date and time: 18.00.00_10.07.2026
 * Reason for changes: PM2 apps for CWSP-reborn Node + Java dual-stack backends.
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
                CWSP_PLATFORM: isWin ? "windows" : "linux"
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
