/*
 * Filename: build-capacitor.mjs
 * FullPath: apps/CWSP-reborn/scripts/build-capacitor.mjs
 * Change date and time: 14.40.00_20.07.2026
 * Reason for changes: Auto-bump VERSION_CODE on every APK build + stage /releases/android.
 *
 * Usage:
 *   node scripts/build-capacitor.mjs              # debug APK (default)
 *   node scripts/build-capacitor.mjs --release
 *   node scripts/build-capacitor.mjs --web-only
 *   node scripts/build-capacitor.mjs --skip-web
 *   node scripts/build-capacitor.mjs --no-bump     # keep current version.properties
 *   node scripts/build-capacitor.mjs --no-publish  # skip staging to .data/releases/android
 *
 * Env:
 *   CWSP_CAPACITOR_NO_BUMP=1
 *   CWSP_CAPACITOR_NO_PUBLISH=1
 */

import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { bumpCapacitorVersion } from "./bump-capacitor-version.mjs";

const APP_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ANDROID_ROOT = path.join(APP_ROOT, "app/android");

function parseArgs(argv) {
    const envNoBump = String(process.env.CWSP_CAPACITOR_NO_BUMP || "").trim() === "1";
    const envNoPublish = String(process.env.CWSP_CAPACITOR_NO_PUBLISH || "").trim() === "1";
    return {
        release: argv.includes("--release"),
        webOnly: argv.includes("--web-only"),
        skipWeb: argv.includes("--skip-web"),
        noBump: argv.includes("--no-bump") || envNoBump,
        noPublish: argv.includes("--no-publish") || envNoPublish
    };
}

function run(cmd, args, opts = {}) {
    console.log(`[build:capacitor] ${cmd} ${args.join(" ")}`);
    const r = spawnSync(cmd, args, {
        cwd: opts.cwd || APP_ROOT,
        stdio: "inherit",
        env: { ...process.env, ...(opts.env || {}) }
    });
    if (r.status !== 0) {
        throw new Error(`${cmd} failed with status ${r.status}`);
    }
}

function resolveJavaHome() {
    if (process.env.JAVA_HOME && fs.existsSync(path.join(process.env.JAVA_HOME, "bin/java"))) {
        // Prefer 17+; Capacitor 8 wants 21 for library compile.
        return process.env.JAVA_HOME;
    }
    const candidates = [
        process.env.JAVA_HOME_21,
        "/usr/lib/jvm/java-21-openjdk-amd64",
        "/usr/lib/jvm/java-17-openjdk-amd64",
        process.env.JAVA_HOME_17
    ].filter(Boolean);
    for (const home of candidates) {
        if (fs.existsSync(path.join(home, "bin/java"))) return home;
    }
    return process.env.JAVA_HOME || "";
}

function main() {
    const args = parseArgs(process.argv.slice(2));

    if (!args.skipWeb) {
        run("npm", ["run", "build:capacitor:web"]);
    }

    if (args.webOnly) {
        console.log("[build:capacitor] web-only — skipping Android APK");
        return;
    }

    // WHY: in-app updater compares versionCode — stale VERSION_CODE=1 made every publish "up to date".
    let bumped = null;
    if (args.noBump) {
        console.log("[build:capacitor] --no-bump — keeping app/android/version.properties");
    } else {
        bumped = bumpCapacitorVersion();
    }

    run(process.execPath, [path.join(APP_ROOT, "scripts/sync-capacitor-android.mjs")]);
    // WHY: FGS notification bar glyph from alpha branding (white silhouette).
    run(process.execPath, [path.join(APP_ROOT, "scripts/sync-capacitor-status-icon.mjs")]);

    if (!fs.existsSync(path.join(ANDROID_ROOT, "gradlew"))) {
        throw new Error(`missing ${ANDROID_ROOT}/gradlew`);
    }

    const javaHome = resolveJavaHome();
    const env = {
        ANDROID_HOME: process.env.ANDROID_HOME || "/home/u2re-dev/Android/Sdk",
        ANDROID_SDK_ROOT: process.env.ANDROID_SDK_ROOT || process.env.ANDROID_HOME || "/home/u2re-dev/Android/Sdk"
    };
    if (javaHome) {
        env.JAVA_HOME = javaHome;
        console.log(`[build:capacitor] JAVA_HOME=${javaHome}`);
    }

    const task = args.release ? "assembleRelease" : "assembleDebug";
    run("./gradlew", ["--no-daemon", task, "copyCwspApks"], { cwd: ANDROID_ROOT, env });

    // Belt-and-suspenders publish if Gradle finalizedBy was skipped.
    const apkOut = path.join(APP_ROOT, "build/capacitor/apk");
    if (!fs.existsSync(path.join(apkOut, "cwsp-debug.apk")) && !fs.existsSync(path.join(apkOut, "cwsp-release.apk"))) {
        run(process.execPath, [path.join(APP_ROOT, "scripts/copy-capacitor-apk.mjs")]);
    }

    // WHY: gateway /releases/android must track the APK just built, not a previous stale artifact.
    if (args.noPublish) {
        console.log("[build:capacitor] --no-publish — skip staging to .data/releases/android");
    } else {
        run(process.execPath, [path.join(APP_ROOT, "scripts/publish-android-apk.mjs")]);
    }

    const verLabel = bumped
        ? `${bumped.versionName} (${bumped.versionCode})`
        : "(unchanged version.properties)";
    console.log(`[build:capacitor] OK — ${verLabel} — APKs under ${apkOut}`);
}

try {
    main();
} catch (err) {
    console.error("[build:capacitor]", err?.message || err);
    process.exit(1);
}
