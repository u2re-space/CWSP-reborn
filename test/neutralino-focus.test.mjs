import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const root = path.resolve(import.meta.dirname, "..");
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), "utf8");

const ps1 = read("resources/clipboard-prompt/prompt-toast.ps1");
const popup = read("resources/clipboard-prompt/popup.js");
const build = read("scripts/build-neutralino.mjs");

test("passive PowerShell toast raises without Activate and keeps a normal Form", () => {
    // WHY: Form CreateParams WS_EX_NOACTIVATE + ShowDialog broke toast visibility.
    assert.match(ps1, /SWP_NOACTIVATE/);
    assert.match(ps1, /ShowWithoutActivation/);
    assert.match(ps1, /\$form = New-Object System\.Windows\.Forms\.Form/);
    assert.doesNotMatch(ps1, /CwspNonActivatingForm/);
    assert.doesNotMatch(ps1, /CreateParams|ExStyle\s*\|=/);
    assert.doesNotMatch(ps1, /\$form\.Activate\(\)/);
    assert.doesNotMatch(ps1, /\$form\.BringToFront\(\)/);
});

test("passive browser popup never requests focus and can re-show after a failed show", () => {
    assert.doesNotMatch(popup, /Neutralino\.window\.focus\s*\(/);
    assert.match(popup, /popupVisible/);
    // INVARIANT: must not early-return before show() when popupVisible is already true.
    assert.doesNotMatch(popup, /if\s*\(\s*popupVisible\s*\)\s*return/);
});

test("tray SHOW remains the only generated explicit main-window focus", () => {
    assert.match(build, /trayMenuItemClicked/);
    assert.match(build, /id === ['"]SHOW['"]/);
    assert.match(build, /Neutralino\.window\.focus\(\)/);
});

