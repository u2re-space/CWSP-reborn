/*
 * Filename: neutralino-tray-longevity.test.mjs
 * FullPath: apps/CWSP-reborn/test/neutralino-tray-longevity.test.mjs
 * Change date and time: 11.30.00_18.07.2026
 * Reason for changes: Contract guards for Neutralino tray longevity —
 *   backend must not die with extNode alone; disconnect must not kill backend.
 */

import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const root = path.resolve(import.meta.dirname, "..");
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), "utf8");

const extNode = read("app/windows/neutralino/node/main.js");
const windowsBackend = read("src/backend/node/windows/index.ts");
const linuxBackend = read("src/backend/node/linux/index.ts");

test("extNode disconnect keeps backend alive while Neutralino host is up", () => {
    assert.match(extNode, /extNode-disconnect-keep-alive/);
    assert.match(extNode, /scheduleBackendRespawn/);
    assert.match(extNode, /backend\.ensure/);
    // INVARIANT: bare disconnect must not unconditionally stop the backend.
    assert.doesNotMatch(
        extNode,
        /process\.on\("disconnect",\s*\(\)\s*=>\s*\{\s*[\s\S]*?stopPackagedBackend\(\);\s*process\.exit\(0\);\s*\}\)/
    );
    // Must gate teardown on NL host liveness.
    assert.match(
        extNode,
        /process\.on\("disconnect"[\s\S]*?isNeutralinoHostAlive\(\)[\s\S]*?stopPackagedBackend/
    );
});

test("extNode auto-respawns backend after unexpected exit", () => {
    assert.match(extNode, /BACKEND_RESPAWN_MS/);
    assert.match(extNode, /backendStopRequested/);
    assert.match(extNode, /crash-loop/);
    // WHY: watch now adopts/respawns via ensurePackagedBackend (not a fixed reason string).
    assert.match(extNode, /ensurePackagedBackend/);
    assert.match(extNode, /backend-adopted|backend-respawned-by-watch|backend-boot-result/);
    assert.match(extNode, /maybeStopBackendOnExtNodeExit/);
    // Intentional stop must set the suppress flag before kill.
    assert.match(
        extNode,
        /function stopPackagedBackend\(\)\s*\{\s*backendStopRequested\s*=\s*true/
    );
});

test("Windows backend keeps control when NL dies unless EXIT_WITH_NEUTRALINO", () => {
    assert.match(windowsBackend, /extnode-gone-keep-alive/);
    assert.match(windowsBackend, /nl-host-gone-keep-alive/);
    assert.match(windowsBackend, /CWSP_NL_PID/);
    assert.match(windowsBackend, /CWSP_EXIT_WITH_NEUTRALINO/);
    // Opt-in exit path still present for legacy.
    assert.match(
        windowsBackend,
        /exitWithNeutralino[\s\S]*?process\.exit\(0\)/
    );
});

test("Linux backend mirrors tray longevity parent watch", () => {
    assert.match(linuxBackend, /extnode-gone-keep-alive/);
    assert.match(linuxBackend, /CWSP_NL_PID/);
});

test("root extensions/node/main.js stays in sync with app source", () => {
    const packaged = read("extensions/node/main.js");
    assert.match(packaged, /extNode-disconnect-keep-alive/);
    assert.match(packaged, /scheduleBackendRespawn/);
});

test("Neutralino IPC extension reconnects instead of exiting on close", () => {
    const ipc = read("app/windows/neutralino/node/neutralino-extension.js");
    const packaged = read("extensions/node/neutralino-extension.js");
    for (const src of [ipc, packaged]) {
        assert.match(src, /ws-reconnect-scheduled/);
        assert.match(src, /_scheduleIpcReconnect/);
        assert.match(src, /CWSP_NL_TERM_ON_IPC_CLOSE/);
        // Default must NOT exit on every IPC close.
        assert.doesNotMatch(
            src,
            /this\.termOnWindowClose\s*=\s*true\s*;/
        );
    }
});

test("clipboard-hub keeps /ws warm with ping and slows 4001 reconnect", () => {
    const hub = read("src/backend/node/generic/neutralino/clipboard-hub.ts");
    assert.match(hub, /DEFAULT_KEEPALIVE_MS/);
    assert.match(hub, /startKeepalive/);
    assert.match(hub, /WS_CLOSE_INVALID_CREDENTIALS/);
    assert.match(hub, /AUTH_RECONNECT_MS/);
    assert.match(hub, /perMessageDeflate:\s*false/);
});

test("tray SHOW and Network panel request backend.ensure after control loss", () => {
    const html = read("resources/index.html");
    const build = read("scripts/build-neutralino.mjs");
    const panel = read("src/frontend/submodules/views/network/NetworkStatusPanel.ts");
    assert.match(html, /backend\.ensure/);
    assert.match(build, /backend\.ensure/);
    assert.match(panel, /ensureNeutralinoBackend/);
    assert.match(panel, /backend\.ensure/);
});

test("injected chrome longevity reinstalls tray after idle/serverOffline", () => {
    const build = read("scripts/build-neutralino.mjs");
    assert.match(build, /serverOffline/);
    assert.match(build, /clientConnect/);
    assert.match(build, /healWindowChrome/);
    assert.match(build, /installTray\(true\)/);
    assert.match(build, /installChromeLongevity/);
    // WHY: stuck __CWS_TRAY_READY__ previously blocked tray recovery after explorer/sleep.
    assert.match(build, /__CWS_TRAY_READY__\s*=\s*false/);
});

test("boot credential sync does not force hub reload", () => {
    const entry = read("src/frontend/web/neutralino/web/entry.ts");
    const winEntry = read("src/frontend/web/neutralino/windows/web/entry.ts");
    const control = read("src/backend/node/generic/neutralino/control.ts");
    for (const src of [entry, winEntry]) {
        assert.match(src, /reload:\s*false|body\.reload\s*=\s*false/);
    }
    assert.match(control, /reloadSuppressed/);
    assert.match(control, /hasAuthPatch \|\| reloadRequested/);
    // Must not conflate hubUrl into remoteHost anymore.
    assert.doesNotMatch(
        control,
        /body\.hubUrl[\s\S]{0,80}shellPatch\.remoteHost/
    );
});

test("clipboard-hub prefers hubUrl candidates before WAN remoteHost", () => {
    const hub = read("src/backend/node/generic/neutralino/clipboard-hub.ts");
    assert.match(hub, /fromHubPreferred/);
    assert.match(hub, /fromRemoteFallback/);
    assert.match(hub, /userKey:\s*authToken/);
    assert.match(hub, /token:\s*authToken/);
});

test("control RPC default port avoids Cursor-stolen :19875 band", () => {
    const win = read("src/backend/node/windows/index.ts");
    const ext = read("app/windows/neutralino/node/main.js");
    const html = read("resources/index.html");
    const entry = read("src/frontend/web/neutralino/web/entry.ts");
    const control = read("src/backend/node/generic/neutralino/control.ts");
    for (const src of [win, ext, entry]) {
        assert.match(src, /DEFAULT_CONTROL_PORT\s*=\s*29110/);
    }
    assert.match(html, /port:\s*29110/);
    assert.match(control, /29110/);
    assert.doesNotMatch(win, /DEFAULT_CONTROL_PORT\s*=\s*19875/);
});

test("clipboard self-loop guards: ask seed + content echo + Android writeText echo", () => {
    const hub = read("src/backend/node/generic/neutralino/clipboard-hub.ts");
    const android = read("src/backend/java/android/executor/Clipboard.java");
    const policy = read("src/backend/java/android/protocol/network/Policy.java");
    assert.match(hub, /isContentEcho/);
    assert.match(hub, /PROMPT_DEDUPE_MS\s*=\s*15000/);
    assert.match(hub, /markSynced\(text\)/);
    assert.match(hub, /const installed = setPrompt\(hold\)/);
    assert.match(android, /DEFAULT_ECHO_SUPPRESS_MS = 12000L/);
    assert.match(android, /echoSuppressed = true/);
    assert.match(policy, /12_000L,\s*12_000L/);
});

test("dismiss sticky prevents Ctrl+C toast reopen loop", () => {
    const hub = read("src/backend/node/shared/neutralino/clipboard-hub.ts");
    const toast = read("resources/clipboard-prompt/prompt-toast.ps1");
    const host = read("src/backend/node/shared/neutralino/clipboard-prompt-host.ts");
    assert.match(hub, /stickyDismissedOutboundText/);
    assert.match(hub, /stickyDismissedOutboundImageHash/);
    assert.match(hub, /stickyTextLen/);
    // WHY: Share must stick too — otherwise same Ctrl+C reopens after Share.
    assert.match(hub, /prompt-share[\s\S]*stickyDismissedOutboundText/);
    assert.match(toast, /dismissedFingerprint/);
    // WHY: silent Close-Toast after Share UI left hub hold → respawn blink storm.
    assert.match(toast, /only latch after success|actionSent = \$true/);
    assert.match(host, /RAPID_EXIT_BACKOFF_MS/);
    // WHY: 10s timer must close even when GET is empty after hub dismissed.
    assert.match(toast, /Get-ToastRemainingMs|expiresAt/);
    assert.match(toast, /stateWasVisible[\s\S]*deadline[\s\S]*Close-Toast "dismiss"/);
});

test("Windows clipboard lock after idle soft-fails ContainsImage and does not re-arm ask", () => {
    const clip = read("src/backend/node/windows/ClipboardHandler.ts");
    const hub = read("src/backend/node/shared/neutralino/clipboard-hub.ts");
    assert.match(clip, /isClipboardBusyError/);
    assert.match(clip, /Requested Clipboard operation did not succeed/);
    assert.match(clip, /for \(\$i = 0; \$i -lt 5; \$i\+\+\)/);
    assert.match(clip, /return false/);
    assert.match(hub, /isClipboardBusyMessage/);
    assert.match(hub, /CLIPBOARD_BUSY|Clipboard operation did not succeed/);
    // INVARIANT: reconnect seed baselines clipboard — no toast for pre-existing content.
    assert.match(hub, /markSynced\(seed\)/);
});
