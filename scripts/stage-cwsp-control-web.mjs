#!/usr/bin/env node
/*
 * Filename: stage-cwsp-control-web.mjs
 * FullPath: apps/CWSP-reborn/scripts/stage-cwsp-control-web.mjs
 * Change date and time: 21.45.00_19.07.2026
 * Reason for changes: Stage public /cwsp Neutralino-parity SPA into runtime/fastify/apps/cwsp-control.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const repoRoot = path.dirname(path.dirname(root));
const src = path.join(root, "build/cwsp-control/web");
const dest = path.join(repoRoot, "runtime/fastify/apps/cwsp-control");

if (!fs.existsSync(path.join(src, "index.html"))) {
    console.error(`[stage-cwsp-control-web] missing ${src}/index.html — run build:cwsp-control:web first`);
    process.exit(1);
}

fs.mkdirSync(path.dirname(dest), { recursive: true });

// Preserve README; replace static assets with Vite build (keep dest as real dir for Fastify).
const keep = new Set(["README.md"]);
if (fs.existsSync(dest)) {
    for (const name of fs.readdirSync(dest)) {
        if (keep.has(name)) continue;
        fs.rmSync(path.join(dest, name), { recursive: true, force: true });
    }
} else {
    fs.mkdirSync(dest, { recursive: true });
}

for (const name of fs.readdirSync(src)) {
    const from = path.join(src, name);
    const to = path.join(dest, name);
    fs.cpSync(from, to, { recursive: true });
}

// WHY: `/assets/wallpaper.jpg` is the default shell wallpaper; Vite host SPA omits app assets/.
const assetsDest = path.join(dest, "assets");
fs.mkdirSync(assetsDest, { recursive: true });
for (const name of ["wallpaper.jpg", "stock.jpg"]) {
    const from = path.join(root, "assets", name);
    if (fs.existsSync(from)) fs.cpSync(from, path.join(assetsDest, name));
}

console.log(`[stage-cwsp-control-web] ${src} → ${dest}`);
