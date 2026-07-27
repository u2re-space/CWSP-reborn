#!/usr/bin/env node
/*
 * Filename: with-aliases.mjs
 * FullPath: apps/CWSP-reborn/scripts/with-aliases.mjs
 * Change date and time: 17.20.00_10.07.2026
 * Reason for changes: Thin wrapper that prepends --import resolve-aliases.mjs.
 *
 * Usage:
 *   node ./scripts/with-aliases.mjs --experimental-strip-types --test test/foo.test.ts
 * Equivalent to:
 *   node --import ./scripts/resolve-aliases.mjs --experimental-strip-types --test ...
 */

import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const loader = path.join(here, "resolve-aliases.mjs");
const args = ["--import", loader, ...process.argv.slice(2)];

const child = spawn(process.execPath, args, {
    stdio: "inherit",
    env: process.env
});

child.on("exit", (code, signal) => {
    if (signal) {
        process.kill(process.pid, signal);
        return;
    }
    process.exit(code ?? 1);
});
