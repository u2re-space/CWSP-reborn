/*
 * Filename: index.ts
 * FullPath: apps/CWSP-reborn/src/backend/web/index.ts
 * Change date and time: 17.06.00_10.07.2026
 * Reason for changes: Stream C — real barrel for the Web/PWA backend. The
 * previous entry was a symlink to an empty node/pwa barrel; this exports the
 * implemented pwa + airpad clipboard APIs so importers reach real code.
 *
 * NOTE: Only clipboard + PWA primitives are exported today. Keyboard/Pointer/
 * Sensor airpad emissions are deferred stubs and intentionally not re-exported
 * until they ship real builders, to avoid advertising an unstable surface.
 */

// PWA primitives
export {
    createMemoryKvStore,
    createIdbKvStore,
    type KvStore,
} from "./pwa/IDB.ts";

export {
    hasLaunchQueue,
    consumeLaunchFiles,
    type LaunchFile,
} from "./pwa/LaunchQueue.ts";

export {
    parseShareTargetSearch,
    normalizeShareTarget,
    type ShareTargetPayload,
    type NormalizedShareTarget,
} from "./pwa/ShareTarget.ts";

export {
    buildPwaClipboardPacket,
    extractClipboardText,
    type PWAIdentity,
    type PWAClipboardEmissionInput,
} from "./pwa/PWAEmission.ts";

export {
    applyClipboardPacket,
    restoreDeferredClipboard,
    CLIPBOARD_LAST_KEY,
    type ClipboardWriter,
    type PWAExecutorOptions,
    type PWAExecutorResult,
} from "./pwa/PWAExecutor.ts";

// AirPad clipboard (emission + executor)
export {
    buildAirPadClipboardPacket,
    buildAirPadClipboardWriteWrapper,
    extractClipboardContent,
    type AirPadClipboardIdentity,
    type AirPadClipboardEmissionInput,
} from "./airpad/emission/Clipboard.ts";

export {
    applyAirPadClipboardPacket,
    restoreDeferredAirPadClipboard,
    AIRPAD_CLIPBOARD_LAST_KEY,
    type AirPadClipboardWriter,
    type AirPadClipboardExecutorOptions,
    type AirPadClipboardExecutorResult,
} from "./airpad/executor/Clipboard.ts";
