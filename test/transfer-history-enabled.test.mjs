/*
 * Filename: transfer-history-enabled.test.mjs
 * FullPath: apps/CWSP-reborn/test/transfer-history-enabled.test.mjs
 * Change date and time: 22.20.00_25.07.2026
 * Reason for changes: Contract — Cap+Neu enable History view + transfer-history runtime.
 */

import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const root = path.resolve(import.meta.dirname, "..");
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), "utf8");

test("vite Cap+Neu enable History view define and ENABLED_VIEWS", () => {
    const vite = read("vite.config.ts");
    assert.match(vite, /VITE_ENABLED_VIEWS:\s*"minimal,network,settings,history"/);
    assert.match(vite, /__RS_VIEW_HISTORY__:\s*"true"/);
    // Capacitor + Neutralino targets both list history.
    const capBlock = vite.slice(vite.indexOf("capacitor:"), vite.indexOf("webnative:"));
    const neuBlock = vite.slice(vite.indexOf("neutralino:"), vite.indexOf("gateway:"));
    assert.match(capBlock, /history/);
    assert.match(neuBlock, /history/);
    assert.match(capBlock, /__RS_VIEW_HISTORY__:\s*"true"/);
    assert.match(neuBlock, /__RS_VIEW_HISTORY__:\s*"true"/);
});

test("Capacitor entry enables history and starts Cap transfer-history runtime", () => {
    const entry = read("src/frontend/web/capacitor/shared/entry.ts");
    assert.match(entry, /enabledViews\s*=\s*\[[^\]]*["']history["']/);
    assert.match(entry, /startCapacitorTransferHistory/);
});

test("Neutralino web entry enables history and starts Neu transfer-history runtime", () => {
    const entry = read("src/frontend/web/neutralino/web/entry.ts");
    assert.match(entry, /enabledViews\s*=\s*\[[^\]]*["']history["']/);
    assert.match(entry, /startNeutralinoTransferHistory/);
});

test("cwsp-shared exposes transfer-history module", () => {
    const pkg = JSON.parse(
        fs.readFileSync(
            path.resolve(root, "../../modules/projects/cwsp-shared/package.json"),
            "utf8"
        )
    );
    assert.ok(pkg.exports?.["./transfer-history"]);
    assert.ok(
        fs.existsSync(
            path.resolve(root, "../../modules/projects/cwsp-shared/src/v2/transfer-history.ts")
        )
    );
});

test("Neu control exposes /service/transfer-history", () => {
    const control = read("src/backend/node/shared/neutralino/control.ts");
    assert.match(control, /\/service\/transfer-history/);
    assert.match(control, /onTransferHistoryGet/);
    assert.match(control, /onTransferHistoryAction/);
    assert.match(control, /\/service\/transfer-history\/preview/);
    assert.match(control, /onTransferHistoryPreview/);
});

test("startNeutralinoBackend forwards Transfer History hooks into controlShared", () => {
    // WHY: windows/linux pass onTransferHistoryGet — if index.ts drops them,
    // GET always returns empty replace:true and History UI stays blank.
    const idx = read("src/backend/node/shared/neutralino/index.ts");
    assert.match(idx, /onTransferHistoryGet\?:/);
    assert.match(idx, /onTransferHistoryAction\?:/);
    assert.match(idx, /onTransferHistoryPreview\?:/);
    assert.match(idx, /onTransferHistoryGet:\s*options\.onTransferHistoryGet/);
    assert.match(idx, /onTransferHistoryAction:\s*options\.onTransferHistoryAction/);
    assert.match(idx, /onTransferHistoryPreview:\s*options\.onTransferHistoryPreview/);
    const win = read("src/backend/node/windows/index.ts");
    assert.match(win, /onTransferHistoryGet:/);
    assert.match(win, /onTransferHistoryPreview:/);
    assert.match(win, /resolveTransferHistoryMedia/);
    assert.match(win, /upsertClipboardPromptHistory/);
    const bridge = read("src/backend/node/shared/neutralino/transfer-history-bridge.ts");
    assert.match(bridge, /transfer-history-assets/);
    assert.match(bridge, /localFilePath/);
    assert.match(bridge, /retainDurableImage|copyFileSync/);
});

test("History UI uses preview URL helper for file-backed images", () => {
    const runtime = read("src/frontend/submodules/views/history/transfer-history-runtime.ts");
    assert.match(runtime, /export function historyImageSrc/);
    assert.match(runtime, /localFilePath/);
    assert.match(runtime, /transfer-history\/preview/);
    const ui = read("src/frontend/submodules/views/history/index.ts");
    assert.match(ui, /historyImageSrc/);
    assert.match(ui, /Open File/);
});
