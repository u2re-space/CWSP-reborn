/*
 * Filename: sync-capacitor-status-icon.mjs
 * FullPath: apps/CWSP-reborn/scripts/sync-capacitor-status-icon.mjs
 * Change date and time: 13.35.00_21.07.2026
 * Reason for changes: Build white-alpha ic_stat_cwsp from launcher monochrome
 *   so FGS / notification bar shows the CWSP glyph (not a system bluetooth icon).
 *   2026-07-21: trim adaptive-icon padding and fill ~92% of the status canvas
 *   so the glyph reads larger in the notification bar.
 *
 * Usage: node scripts/sync-capacitor-status-icon.mjs
 */

import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const APP_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const RES = path.join(APP_ROOT, "app/android/res");

/** Density → status-bar px (Android notification small-icon guidelines). */
const DENSITIES = [
    ["mdpi", 24],
    ["hdpi", 36],
    ["xhdpi", 48],
    ["xxhdpi", 72],
    ["xxxhdpi", 96]
];

/** Fraction of the 24dp canvas the glyph should fill after trim (rest = margin). */
const GLYPH_FILL = 0.92;

function pickSource() {
    const candidates = [
        path.join(RES, "mipmap-xxxhdpi/ic_launcher_monochrome.png"),
        path.join(RES, "mipmap-xxxhdpi/ic_launcher_foreground.png"),
        path.join(APP_ROOT, "assets/icon.png"),
        path.join(APP_ROOT, "resources/icons/trayIcon.png")
    ];
    for (const p of candidates) {
        if (fs.existsSync(p)) return p;
    }
    return null;
}

function main() {
    const src = pickSource();
    if (!src) {
        console.warn("[sync:status-icon] no alpha icon source — skip");
        return;
    }
    const convert = spawnSync("convert", ["-version"], { encoding: "utf8" });
    if (convert.status !== 0) {
        console.warn("[sync:status-icon] ImageMagick convert missing — keep existing ic_stat_cwsp");
        return;
    }

    for (const [dens, px] of DENSITIES) {
        const dir = path.join(RES, `drawable-${dens}`);
        fs.mkdirSync(dir, { recursive: true });
        const dest = path.join(dir, "ic_stat_cwsp.png");
        const glyphPx = Math.max(1, Math.round(px * GLYPH_FILL));
        // WHY: launcher monochrome keeps adaptive-icon safe-zone padding (~50% fill).
        // Trim + upscale so the status-bar glyph reads larger without exceeding 24dp.
        // Status-bar small icons are white silhouettes + alpha; color is ignored.
        const r = spawnSync(
            "convert",
            [
                src,
                "-alpha",
                "extract",
                "-trim",
                "+repage",
                "-resize",
                `${glyphPx}x${glyphPx}`,
                "-background",
                "white",
                "-alpha",
                "shape",
                "-gravity",
                "center",
                "-background",
                "none",
                "-extent",
                `${px}x${px}`,
                `PNG32:${dest}`
            ],
            { encoding: "utf8" }
        );
        if (r.status !== 0) {
            throw new Error(`convert failed for ${dens}: ${r.stderr || r.stdout || r.status}`);
        }
    }
    // Fallback unqualified drawable (some tools resolve without density).
    const fallbackDir = path.join(RES, "drawable");
    fs.mkdirSync(fallbackDir, { recursive: true });
    fs.copyFileSync(
        path.join(RES, "drawable-xxhdpi/ic_stat_cwsp.png"),
        path.join(fallbackDir, "ic_stat_cwsp.png")
    );
    console.log(`[sync:status-icon] ic_stat_cwsp ← ${path.relative(APP_ROOT, src)}`);
}

try {
    main();
} catch (err) {
    console.error("[sync:status-icon]", err?.message || err);
    process.exit(1);
}
