/*
 * Filename: copy-capacitor-apk.mjs
 * FullPath: apps/CWSP-reborn/scripts/copy-capacitor-apk.mjs
 * Change date and time: 18.10.00_10.07.2026
 * Reason for changes: Publish Gradle APKs into build/capacitor/apk (dist→build).
 *
 * Usage:
 *   node scripts/copy-capacitor-apk.mjs
 *   node scripts/copy-capacitor-apk.mjs --from app/android/build/outputs/apk
 *
 * Layout written:
 *   build/capacitor/apk/debug/cwsp-debug.apk
 *   build/capacitor/apk/release/cwsp-release.apk
 *   build/capacitor/apk/cwsp-debug.apk
 *   build/capacitor/apk/cwsp-release.apk
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const APP_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DEFAULT_FROM = path.join(APP_ROOT, "app/android/build/outputs/apk");
const PUBLISH_ROOT = path.join(APP_ROOT, "build/capacitor/apk");

function parseArgs(argv) {
    let from = DEFAULT_FROM;
    for (let i = 0; i < argv.length; i++) {
        if (argv[i] === "--from") from = path.resolve(argv[++i] || from);
        else if (argv[i].startsWith("--from=")) from = path.resolve(argv[i].slice("--from=".length));
    }
    return { from };
}

function copyFile(src, dest) {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(src, dest);
}

function main() {
    const { from } = parseArgs(process.argv.slice(2));
    if (!fs.existsSync(from)) {
        console.error(`[copy-capacitor-apk] missing source dir: ${from}`);
        process.exit(1);
    }

    let copied = 0;
    for (const type of fs.readdirSync(from, { withFileTypes: true })) {
        if (!type.isDirectory()) continue;
        const typeDir = path.join(from, type.name);
        for (const name of fs.readdirSync(typeDir)) {
            if (!name.endsWith(".apk")) continue;
            const src = path.join(typeDir, name);
            const typedName = `cwsp-${type.name}.apk`;
            const typedDest = path.join(PUBLISH_ROOT, type.name, typedName);
            const flatDest = path.join(PUBLISH_ROOT, typedName);
            copyFile(src, typedDest);
            copyFile(src, flatDest);
            console.log(`[copy-capacitor-apk] ${src} → ${typedDest}`);
            console.log(`[copy-capacitor-apk] ${src} → ${flatDest}`);
            copied += 1;
        }
    }

    if (copied === 0) {
        console.error(`[copy-capacitor-apk] no .apk files under ${from}`);
        process.exit(1);
    }
    console.log(`[copy-capacitor-apk] OK (${copied}) → ${PUBLISH_ROOT}`);
}

main();
