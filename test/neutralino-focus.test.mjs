import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const root = path.resolve(import.meta.dirname, "..");
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), "utf8");

const ps1 = read("resources/clipboard-prompt/prompt-toast.ps1");
const popup = read("resources/clipboard-prompt/popup.js");
const build = read("scripts/build-neutralino.mjs");
const host = read("src/backend/node/shared/neutralino/clipboard-prompt-host.ts");

test("toast stays visible Form+ShowDialog; focus is yielded, not NOACTIVATE-styled", () => {
    // HARD RULE: WS_EX_NOACTIVATE / Form.ShowWithoutActivation make the toast vanish on desk.
    assert.match(ps1, /\$form = New-Object System\.Windows\.Forms\.Form/);
    assert.match(ps1, /\$form\.ShowDialog\(\)/);
    assert.match(ps1, /RaiseTopMostNoActivate/);
    assert.match(ps1, /SWP_NOACTIVATE/);
    assert.match(ps1, /CaptureForeground/);
    assert.match(ps1, /YieldKeyboardFocus/);
    assert.match(ps1, /Yield-ToastKeyboardFocus/);
    assert.match(ps1, /TabStop\s*=\s*\$false/);
    // WHY: Yield during ShowDialog collapsed toast → Share respawn storm.
    const activatedBlock = (ps1.match(/\$form\.Add_Activated\(\{[\s\S]*?\}\)/) || [])[0] || "";
    assert.doesNotMatch(activatedBlock, /Yield-ToastKeyboardFocus/);
    const shownBlock = (ps1.match(/\$form\.Add_Shown\(\{[\s\S]*?\}\)/) || [])[0] || "";
    assert.doesNotMatch(shownBlock, /Yield-ToastKeyboardFocus/);
    // COMPAT: PS 5.1 CodeDom is C#5 — discard outs in calls break toast spawn.
    assert.match(ps1, /out ignoredPid/);
    assert.doesNotMatch(ps1, /GetWindowThreadProcessId\([^)]*out\s+_/);
    // Comments may name the forbidden patterns; code must not implement them.
    assert.doesNotMatch(ps1, /New-Object\s+CwspNonActivatingForm/);
    assert.doesNotMatch(ps1, /class\s+CwspNonActivatingForm/);
    assert.doesNotMatch(ps1, /private const int WS_EX_NOACTIVATE/);
    assert.doesNotMatch(ps1, /cp\.ExStyle\s*\|=/);
    assert.doesNotMatch(ps1, /protected override bool ShowWithoutActivation/);
    assert.doesNotMatch(ps1, /\$form\.Show\(\)/);
    assert.doesNotMatch(ps1, /Application\]::Run\(\)/);
    assert.doesNotMatch(ps1, /\$form\.Activate\(\)/);
    assert.doesNotMatch(ps1, /\$form\.BringToFront\(\)/);
});

test("passive browser popup never requests focus and can re-show after a failed show", () => {
    assert.doesNotMatch(popup, /Neutralino\.window\.focus\s*\(/);
    assert.match(popup, /popupVisible/);
    // INVARIANT: must not early-return before show() when popupVisible is already true.
    assert.doesNotMatch(popup, /if\s*\(\s*popupVisible\s*\)\s*return/);
});

test("toast host keeps interactive desktop (no windowsHide CREATE_NO_WINDOW)", () => {
    assert.match(host, /"-WindowStyle"[\s\S]*?"Hidden"/);
    assert.match(host, /windowsHide:\s*false/);
    // INVARIANT: powershell toast spawn must not use CREATE_NO_WINDOW.
    const spawnBlock = host.slice(host.indexOf("const spawnToast"), host.indexOf("const ensureRunning"));
    assert.match(spawnBlock, /windowsHide:\s*false/);
    assert.doesNotMatch(spawnBlock, /windowsHide:\s*true/);
});

test("tray SHOW remains the only generated explicit main-window focus", () => {
    assert.match(build, /trayMenuItemClicked/);
    assert.match(build, /id === ['"]SHOW['"]/);
    assert.match(build, /ensureMainWindowVisible\(\{\s*focus:\s*true\s*\}\)/);
    assert.match(build, /Neutralino\.window\.unminimize/);
    assert.match(build, /Neutralino\.window\.focus\(\)/);
});

test("main Neutralino config disables useSavedState (avoid iconic off-screen)", () => {
    // INVARIANT: build materializes root config FROM app/windows (canonical).
    const cfg = JSON.parse(read("app/windows/neutralino.config.json"));
    assert.equal(cfg.modes.window.useSavedState, false);
    assert.equal(cfg.modes.chrome.useSavedState, false);
});
