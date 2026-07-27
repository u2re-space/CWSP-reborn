/*
 * Filename: transport-credential-bridge.ts
 * FullPath: apps/CWSP-reborn/src/shared/src/transport-credential-bridge.ts
 * Change date and time: 15.20.00_24.07.2026
 * Reason for changes: Relocated from views/airpad/credential-cache-bridge —
 *   AirPad UI retired; websocket still registers transport-secret invalidation.
 */

/**
 * Breaks the static import cycle between remote-connection-runtime and websocket:
 * runtime calls invalidate; websocket registers the implementation once loaded.
 */

type InvalidateFn = () => void;

let impl: InvalidateFn | null = null;

/** Called from websocket.ts at module load. */
export function setAirpadCredentialInvalidator(fn: InvalidateFn): void {
    impl = fn;
}

/** Clear AES/HMAC key caches when transport secrets or mode change. */
export function invalidateAirpadTransportCredentials(): void {
    try {
        impl?.();
    } catch {
        // ignore
    }
}
