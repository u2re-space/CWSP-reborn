/*
 * Filename: capacitor.config.ts
 * FullPath: /home/u2re-dev/U2RE.space/apps/CWSP-reborn/src/frontend/web/capacitor/capacitor.config.ts
 * Change date and time: 18.10.00_10.07.2026
 * Reason for changes: Point webDir at build/capacitor/web; APKs publish to build/capacitor/apk.
 */

import type { CapacitorConfig } from "@capacitor/cli";

/**
 * NOTE: webDir is resolved relative to this config file's directory.
 * This file lives at `src/frontend/web/capacitor/`, so `../../build/capacitor/web`
 * points at `apps/CWSP-reborn/build/capacitor/web` (Vite `build:capacitor` output).
 *
 * Layout (also visible via `dist` → `build`):
 *   build/capacitor/web/   — Vite web bundle (Capacitor sync source)
 *   build/capacitor/apk/   — convenient APK copies (debug/release + flat names)
 *
 * The Android projection symlinks this file at `app/android/capacitor.config.ts`.
 * When invoking the Capacitor CLI from the CWSP-reborn project root, pass
 * `--config src/frontend/web/capacitor/capacitor.config.ts` so the nested
 * config is discovered.
 */
const config: CapacitorConfig = {
    appId: "space.u2re.cwsp",
    appName: "CWSP",
    webDir: "../../build/capacitor/web",
    android: {
        path: "app/android",
        buildOptions: {
            keystorePath: process.env.CWSP_ANDROID_KEYSTORE || undefined,
            keystoreAlias: process.env.CWSP_ANDROID_KEY_ALIAS || undefined
        }
    },
    server: {
        // COMPAT: allow androidScheme override for local TLS/origin parity tests.
        // INVARIANT: must resolve to literal "http" | "https" before packaging —
        // never ship `${ENV:…}` placeholders (CapConfig treats them as the scheme → black WebView).
        androidScheme: process.env.CWSP_ANDROID_SCHEME || "https",
        cleartext: process.env.CWSP_ALLOW_CLEARTEXT === "1"
    }
};

export default config;
