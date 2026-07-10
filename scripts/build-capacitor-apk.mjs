/*
 * Filename: build-capacitor-apk.mjs
 * FullPath: apps/CWSP-reborn/scripts/build-capacitor-apk.mjs
 * Change date and time: 18.10.00_10.07.2026
 * Reason for changes: Assemble Capacitor Android APK and publish under build/capacitor/apk.
 *
 * Usage:
 *   node scripts/build-capacitor-apk.mjs           # assembleDebug
 *   node scripts/build-capacitor-apk.mjs --release
 *   node scripts/build-capacitor-apk.mjs --skip-web
 */

import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const APP_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ANDROID_ROOT = path.join(APP_ROOT, "app/android");

function parseArgs(argv) {
    return {
        release: argv.includes("--release"),
        skipWeb: argv.includes("--skip-web")
    };
}

function run(cmd, args, opts = {}) {
    console.log(`[build:capacitor:apk] ${cmd} ${args.join(" ")}`);
    const r = spawnSync(cmd, args, {
        cwd: opts.cwd || APP_ROOT,
        stdio: "inherit",
        env: { ...process.env, ...(opts.env || {}) }
    });
    if (r.status !== 0) {
        throw new Error(`${cmd} failed with status ${r.status}`);
    }
}

function main() {
    const args = parseArgs(process.argv.slice(2));
    if (!args.skipWeb) {
        run("npm", ["run", "build:capacitor"]);
    }

    if (!fs.existsSync(path.join(ANDROID_ROOT, "gradlew"))) {
        throw new Error(`missing ${ANDROID_ROOT}/gradlew`);
    }

    const task = args.release ? "assembleRelease" : "assembleDebug";
    // WHY: AGP 8.x needs JDK 17; host may default to a newer JDK.
    const env = {};
    if (process.env.JAVA_HOME_17) env.JAVA_HOME = process.env.JAVA_HOME_17;
    run("./gradlew", [task, "copyCwspApks"], { cwd: ANDROID_ROOT, env });

    // Belt-and-suspenders if Gradle finalizedBy was skipped.
    run(process.execPath, [path.join(APP_ROOT, "scripts/copy-capacitor-apk.mjs")]);
}

try {
    main();
} catch (err) {
    console.error("[build:capacitor:apk]", err?.message || err);
    process.exit(1);
}
