/*
 * Filename: bump-capacitor-version.mjs
 * FullPath: apps/CWSP-reborn/scripts/bump-capacitor-version.mjs
 * Change date and time: 14.35.00_20.07.2026
 * Reason for changes: Every Capacitor APK build must get a new VERSION_CODE for in-app updates.
 *
 * Usage:
 *   node scripts/bump-capacitor-version.mjs           # +1 VERSION_CODE, sync VERSION_NAME / package.json
 *   node scripts/bump-capacitor-version.mjs --dry-run
 *
 * SoT: app/android/version.properties
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const APP_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const VERSION_PROPS = path.join(APP_ROOT, "app", "android", "version.properties");
const PACKAGE_JSON = path.join(APP_ROOT, "package.json");

function readProps(filePath) {
    const map = {};
    if (!fs.existsSync(filePath)) return map;
    for (const line of fs.readFileSync(filePath, "utf8").split(/\r?\n/)) {
        const t = line.trim();
        if (!t || t.startsWith("#")) continue;
        const eq = t.indexOf("=");
        if (eq < 0) continue;
        map[t.slice(0, eq).trim()] = t.slice(eq + 1).trim();
    }
    return map;
}

/**
 * Bump VERSION_NAME:
 * - Prefer semver major.minor.patch → increment patch
 * - Else fall back to 0.0.<VERSION_CODE>
 */
function nextVersionName(currentName, versionCode) {
    const m = String(currentName || "").trim().match(/^(\d+)\.(\d+)\.(\d+)(?:[-+].*)?$/);
    if (m) {
        const major = Number(m[1]);
        const minor = Number(m[2]);
        const patch = Number(m[3]) + 1;
        return `${major}.${minor}.${patch}`;
    }
    return `0.0.${versionCode}`;
}

function writeProps(filePath, versionCode, versionName) {
    const body = `# Filename: version.properties
# FullPath: apps/CWSP-reborn/app/android/version.properties
# Auto-bumped by scripts/bump-capacitor-version.mjs (build:capacitor).
#
# INVARIANT: VERSION_CODE must increase for every APK that should offer an in-app update.

VERSION_CODE=${versionCode}
VERSION_NAME=${versionName}
`;
    fs.writeFileSync(filePath, body, "utf8");
}

export function bumpCapacitorVersion({ dryRun = false } = {}) {
    const props = readProps(VERSION_PROPS);
    const prevCode = Number(props.VERSION_CODE || 0);
    const prevName = String(props.VERSION_NAME || "0.0.0");
    const versionCode = (Number.isFinite(prevCode) ? prevCode : 0) + 1;
    const versionName = nextVersionName(prevName, versionCode);

    console.log(
        `[bump:capacitor] ${prevName} (${prevCode}) → ${versionName} (${versionCode})`
    );

    if (dryRun) {
        console.log("[bump:capacitor] dry-run — skip write");
        return { versionCode, versionName, prevCode, prevName };
    }

    writeProps(VERSION_PROPS, versionCode, versionName);

    // Keep npm package version aligned for operators / tooling.
    try {
        if (fs.existsSync(PACKAGE_JSON)) {
            const pkg = JSON.parse(fs.readFileSync(PACKAGE_JSON, "utf8"));
            if (pkg.version !== versionName) {
                pkg.version = versionName;
                fs.writeFileSync(PACKAGE_JSON, `${JSON.stringify(pkg, null, 4)}\n`, "utf8");
                console.log(`[bump:capacitor] package.json version → ${versionName}`);
            }
        }
    } catch (e) {
        console.warn(`[bump:capacitor] WARN: could not sync package.json: ${e?.message || e}`);
    }

    return { versionCode, versionName, prevCode, prevName };
}

const isMain =
    process.argv[1] &&
    import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href;

if (isMain) {
    try {
        bumpCapacitorVersion({ dryRun: process.argv.includes("--dry-run") });
    } catch (err) {
        console.error(`[bump:capacitor] ${err?.message || err}`);
        process.exit(1);
    }
}
