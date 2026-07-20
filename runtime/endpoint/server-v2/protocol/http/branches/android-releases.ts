/*
 * Filename: android-releases.ts
 * FullPath: runtime/cwsp/endpoint/server-v2/protocol/http/branches/android-releases.ts
 * Change date and time: 14.20.00_20.07.2026
 * Reason for changes: Mount authenticated /releases/android on server-v2 (PM2 launcher path).
 */

import type { ServerV2HttpBranch } from "../types.ts";
import { registerAndroidReleaseRoutes } from "../../../../server/routing/android-releases.ts";

export const androidReleasesHttpBranch: ServerV2HttpBranch = {
    id: "android-releases",
    label: "Android releases",
    notes: "Token-gated Capacitor APK + latest.json under /releases/android.",
    routes: [
        { method: "GET", path: "/releases/android/latest.json" },
        { method: "GET", path: "/releases/android/*" }
    ],
    register: async ({ app }) => {
        try {
            registerAndroidReleaseRoutes(app);
        } catch (err) {
            app.log?.warn?.(
                { err },
                "[android-releases] branch register failed; continuing without APK routes"
            );
        }
    }
};
