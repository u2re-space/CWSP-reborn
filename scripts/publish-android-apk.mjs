/*
 * Filename: publish-android-apk.mjs
 * FullPath: apps/CWSP-reborn/scripts/publish-android-apk.mjs
 * Change date and time: 14.30.00_20.07.2026
 * Reason for changes: Stage Capacitor APK + latest.json; embed version + signing cert SHA-256.
 *
 * Usage:
 *   node scripts/publish-android-apk.mjs [--apk path] [--dest path] [--remote] [--dry-run]
 *
 * Version SoT: app/android/version.properties (VERSION_CODE / VERSION_NAME).
 * Signature: APK signing cert SHA-256 (apksigner or META-INF) → latest.json.signatureSha256.
 *
 * Default dest (local gateway data dir):
 *   runtime/endpoint/.data/releases/android/
 *
 * --remote rsyncs that staging dir to .200 host (same layout under cwsp deploy dir
 * or CWSP_ANDROID_RELEASES_REMOTE). No tokens embedded.
 */

import { createHash, X509Certificate } from "node:crypto";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { APP_ROOT, DEFAULTS, targetSpec } from "./lib/runtime-env.mjs";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const VERSION_PROPS = path.join(APP_ROOT, "app", "android", "version.properties");

const DEFAULT_APK_CANDIDATES = [
    path.join(APP_ROOT, "build", "capacitor", "apk", "cwsp-debug.apk"),
    path.join(APP_ROOT, "build", "capacitor", "apk", "cwsp.apk"),
    path.join(APP_ROOT, "build", "capacitor", "apk", "app-debug.apk"),
    path.join(APP_ROOT, "dist", "capacitor", "apk", "cwsp-debug.apk")
];

const DEFAULT_LOCAL_DEST = path.join(
    APP_ROOT,
    "runtime",
    "endpoint",
    ".data",
    "releases",
    "android"
);

function printHelp() {
    console.log(`publish-android-apk

Options:
  --apk <path>     APK to publish (default: build/capacitor/apk/cwsp-debug.apk)
  --dest <path>    Local releases dir (default: runtime/endpoint/.data/releases/android)
  --remote         Also rsync dest → gateway .200 releases dir
  --dry-run        Print actions only
  --help

Version SoT: app/android/version.properties (VERSION_CODE / VERSION_NAME)
Manifest also includes signatureSha256 (APK signing cert) for same-signer checks.

Env:
  CWSP_ANDROID_RELEASES_REMOTE  override remote path (user@host:dir)
  CWSP_DEPLOY_200_HOST / USER   used when building remote target
  CWSP_APKSIGNER / ANDROID_HOME  for cert extraction via apksigner
`);
}

function parseArgs(argv) {
    const out = {
        apk: null,
        dest: null,
        remote: false,
        dryRun: false,
        help: false
    };
    for (let i = 0; i < argv.length; i++) {
        const a = argv[i];
        if (a === "--help" || a === "-h") out.help = true;
        else if (a === "--remote") out.remote = true;
        else if (a === "--dry-run") out.dryRun = true;
        else if (a === "--apk") out.apk = argv[++i];
        else if (a === "--dest") out.dest = argv[++i];
        else if (a.startsWith("--apk=")) out.apk = a.slice("--apk=".length);
        else if (a.startsWith("--dest=")) out.dest = a.slice("--dest=".length);
    }
    return out;
}

function readVersionProps(propsPath = VERSION_PROPS) {
    if (!fs.existsSync(propsPath)) {
        throw new Error(`Missing version SoT: ${propsPath}`);
    }
    const text = fs.readFileSync(propsPath, "utf8");
    const map = {};
    for (const line of text.split(/\r?\n/)) {
        const t = line.trim();
        if (!t || t.startsWith("#")) continue;
        const eq = t.indexOf("=");
        if (eq < 0) continue;
        map[t.slice(0, eq).trim()] = t.slice(eq + 1).trim();
    }
    const versionCode = Number(map.VERSION_CODE || 0);
    const versionName = String(map.VERSION_NAME || "0.0.0");
    return { versionCode, versionName };
}

function sha256File(filePath) {
    const hash = createHash("sha256");
    hash.update(fs.readFileSync(filePath));
    return hash.digest("hex");
}

function normalizeCertSha256(raw) {
    return String(raw || "")
        .toLowerCase()
        .replace(/[^0-9a-f]/g, "");
}

/** Prefer apksigner; fallback unzip META-INF + Node X509Certificate. */
function extractApkSigningCertSha256(apkPath) {
    const sdk = process.env.ANDROID_HOME || process.env.ANDROID_SDK_ROOT || "";
    const apksignerCandidates = [
        process.env.CWSP_APKSIGNER,
        sdk && path.join(sdk, "build-tools"),
        "/opt/android-sdk/build-tools",
        path.join(os.homedir(), "Android", "Sdk", "build-tools")
    ].filter(Boolean);

    for (const base of apksignerCandidates) {
        let bin = base;
        if (fs.existsSync(base) && fs.statSync(base).isDirectory() && !base.endsWith("apksigner")) {
            try {
                const vers = fs
                    .readdirSync(base)
                    .filter((n) => /^\d/.test(n))
                    .sort()
                    .reverse();
                if (!vers.length) continue;
                bin = path.join(base, vers[0], process.platform === "win32" ? "apksigner.bat" : "apksigner");
            } catch {
                continue;
            }
        }
        if (!bin || !fs.existsSync(bin)) continue;
        const r = spawnSync(bin, ["verify", "--print-certs", apkPath], {
            encoding: "utf8",
            maxBuffer: 2 * 1024 * 1024
        });
        const out = `${r.stdout || ""}\n${r.stderr || ""}`;
        const m =
            out.match(/Signer\s+#1\s+certificate\s+SHA-256\s+digest:\s*([0-9a-f:]+)/i) ||
            out.match(/SHA-256\s+digest:\s*([0-9a-f:]+)/i);
        if (m?.[1]) {
            const hex = normalizeCertSha256(m[1]);
            if (hex.length === 64) return hex;
        }
    }

    // Fallback: list META-INF cert blobs via unzip -l / unzip -p
    const list = spawnSync("unzip", ["-Z1", apkPath], { encoding: "utf8" });
    if (list.status !== 0) {
        console.warn("[publish-apk] WARN: could not list APK for signing cert (unzip missing?)");
        return "";
    }
    const entries = String(list.stdout || "")
        .split(/\r?\n/)
        .map((s) => s.trim())
        .filter((s) => /^META-INF\/.+\.(RSA|DSA|EC)$/i.test(s));
    for (const entry of entries) {
        const extracted = spawnSync("unzip", ["-p", apkPath, entry], { encoding: "buffer", maxBuffer: 4 * 1024 * 1024 });
        if (extracted.status !== 0 || !extracted.stdout?.length) continue;
        try {
            // PKCS#7 SignedData → first cert via openssl if available
            const tmp = path.join(os.tmpdir(), `cwsp-apk-cert-${Date.now()}.der`);
            fs.writeFileSync(tmp, extracted.stdout);
            const pem = spawnSync(
                "openssl",
                ["pkcs7", "-inform", "DER", "-in", tmp, "-print_certs", "-outform", "PEM"],
                { encoding: "utf8", maxBuffer: 2 * 1024 * 1024 }
            );
            try {
                fs.unlinkSync(tmp);
            } catch {
                /* ignore */
            }
            if (pem.status === 0 && pem.stdout) {
                const blocks = pem.stdout.split(/-----END CERTIFICATE-----/);
                for (const block of blocks) {
                    if (!block.includes("BEGIN CERTIFICATE")) continue;
                    const pemCert = `${block.trim()}\n-----END CERTIFICATE-----\n`;
                    try {
                        const cert = new X509Certificate(pemCert);
                        const fp = normalizeCertSha256(cert.fingerprint256);
                        if (fp.length === 64) return fp;
                    } catch {
                        /* try next */
                    }
                }
            }
        } catch (e) {
            console.warn(`[publish-apk] WARN: cert parse failed for ${entry}: ${e?.message || e}`);
        }
    }
    console.warn("[publish-apk] WARN: signing cert SHA-256 not extracted — clients skip signature match");
    return "";
}

function resolveApk(explicit) {
    if (explicit) {
        const p = path.resolve(explicit);
        if (!fs.existsSync(p)) throw new Error(`APK not found: ${p}`);
        return p;
    }
    for (const c of DEFAULT_APK_CANDIDATES) {
        if (fs.existsSync(c)) return c;
    }
    throw new Error(
        `No APK found. Build first (npm run build:capacitor) or pass --apk. Tried:\n  ${DEFAULT_APK_CANDIDATES.join("\n  ")}`
    );
}

function stageLocal({ apkPath, destDir, versionCode, versionName, signatureSha256, dryRun }) {
    const apkName = "cwsp.apk";
    const destApk = path.join(destDir, apkName);
    const manifestPath = path.join(destDir, "latest.json");
    const size = fs.statSync(apkPath).size;
    const sha256 = sha256File(apkPath);
    const manifest = {
        ok: true,
        packageId: "space.u2re.cwsp",
        versionCode,
        versionName,
        apk: apkName,
        apkUrl: `/releases/android/${apkName}`,
        sha256,
        /** Signing certificate SHA-256 (hex, no colons) — same-signer check on device. */
        signatureSha256: signatureSha256 || "",
        size,
        builtAt: new Date().toISOString()
    };

    console.log(`[publish-apk] apk=${apkPath}`);
    console.log(`[publish-apk] versionCode=${versionCode} versionName=${versionName}`);
    console.log(`[publish-apk] sha256=${sha256}`);
    console.log(
        `[publish-apk] signatureSha256=${signatureSha256 ? `${signatureSha256.slice(0, 16)}…` : "(none)"}`
    );
    console.log(`[publish-apk] dest=${destDir}`);

    if (dryRun) {
        console.log("[publish-apk] dry-run — skip write");
        console.log(JSON.stringify(manifest, null, 2));
        return { destApk, manifestPath, manifest };
    }

    fs.mkdirSync(destDir, { recursive: true });
    fs.copyFileSync(apkPath, destApk);
    fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
    console.log(`[publish-apk] wrote ${destApk}`);
    console.log(`[publish-apk] wrote ${manifestPath}`);
    return { destApk, manifestPath, manifest };
}

function rsyncRemote(destDir, dryRun) {
    // WHY: pm2 on gateway uses CWSP-reborn/runtime/endpoint with --data ./.data
    const override = String(process.env.CWSP_ANDROID_RELEASES_REMOTE || "").trim();
    const t = targetSpec("200", "node");
    const remoteDir =
        process.env.CWSP_ANDROID_RELEASES_DIR_REMOTE ||
        "/home/u2re-dev/U2RE.space/apps/CWSP-reborn/runtime/endpoint/.data/releases/android";
    const remoteSpec = override || `${t.user}@${DEFAULTS.host200}:${remoteDir}`;

    const src = destDir.endsWith(path.sep) ? destDir : `${destDir}${path.sep}`;
    const args = ["-avz", "--delete", src, remoteSpec];
    console.log(`[publish-apk] $ rsync ${args.join(" ")}`);
    if (dryRun) {
        console.log("[publish-apk] dry-run — skip rsync");
        return;
    }
    const r = spawnSync("rsync", args, { stdio: "inherit" });
    if (r.status !== 0) {
        throw new Error(`rsync failed (status ${r.status})`);
    }
}

function main() {
    const args = parseArgs(process.argv.slice(2));
    if (args.help) {
        printHelp();
        process.exit(0);
    }

    const { versionCode, versionName } = readVersionProps();
    if (!versionCode) {
        console.warn(
            "[publish-apk] WARNING: VERSION_CODE missing — bump app/android/version.properties before publishing newer builds"
        );
    }

    const apkPath = resolveApk(args.apk);
    const signatureSha256 = extractApkSigningCertSha256(apkPath);
    const destDir = path.resolve(args.dest || DEFAULT_LOCAL_DEST);
    stageLocal({
        apkPath,
        destDir,
        versionCode,
        versionName,
        signatureSha256,
        dryRun: args.dryRun
    });

    if (args.remote) {
        rsyncRemote(destDir, args.dryRun);
    }

    console.log("[publish-apk] done");
    console.log(
        "[publish-apk] NOTE: bump VERSION_CODE in app/android/version.properties before each newer publish, or clients report up-to-date."
    );
}

try {
    main();
} catch (err) {
    console.error(`[publish-apk] ${err?.message || err}`);
    process.exit(1);
}
