/*
 * Filename: clipboard-prompt-bridge.ts
 * FullPath: apps/CWSP-reborn/src/frontend/web/neutralino/web/clipboard-prompt-bridge.ts
 * Change date and time: 18.55.00_14.07.2026
 * Reason for changes: DEPRECATED — Neutralino.window.create re-spawns extensions and fails.
 *   Clipboard prompts are shown by an independent process (clipboard-prompt-host.ts) spawned
 *   from the Node hub. Keep this file as a no-op stub so old imports do not crash.
 */

/** @deprecated Hub-owned independent Neutralino process replaces WebView window.create. */
export function startClipboardPromptBridge(): void {
    console.info(
        "[CWSP clipboard-prompt-bridge] disabled — use Node clipboard-prompt-host (independent process)"
    );
}
