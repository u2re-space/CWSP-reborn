/*
 * Filename: capacitor.config.ts
 * FullPath: /home/u2re-dev/U2RE.space/apps/CWSP-reborn/src/frontend/web/capacitor/capacitor.config.ts
 * Change date and time: 16.30.00_10.07.2026
 * Reason for changes: Pass-II fill: bind Capacitor contour to the existing build/capacitor web bundle and the Android projection.
 */

import type { CapacitorConfig } from "@capacitor/cli";

/**
 * NOTE: webDir is resolved relative to this config file's directory.
 * This file lives at `src/frontend/web/capacitor/`, so `../../build/capacitor`
 * points at `apps/CWSP-reborn/build/capacitor` (the Vite `build:capacitor` output).
 *
 * The Android projection symlinks this file at `app/android/capacitor.config.ts`.
 * When invoking the Capacitor CLI from the CWSP-reborn project root, pass
 * `--config src/frontend/web/capacitor/capacitor.config.ts` so the nested
 * config is discovered.
 */
const config: CapacitorConfig = {
    appId: "space.u2re.cwsp",
    appName: "CWSP",
    webDir: "../../build/capacitor",
    android: {
        path: "app/android",
        buildOptions: {
            keystorePath: process.env.CWSP_ANDROID_KEYSTORE || undefined,
            keystoreAlias: process.env.CWSP_ANDROID_KEY_ALIAS || undefined
        }
    },
    server: {
        // COMPAT: allow androidScheme override for local TLS/origin parity tests.
        androidScheme: process.env.CWSP_ANDROID_SCHEME || "https",
        cleartext: process.env.CWSP_ALLOW_CLEARTEXT === "1"
    }
};

export default config;
