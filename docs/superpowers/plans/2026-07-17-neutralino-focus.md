# Neutralino Passive Popup Focus Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ensure passive Neutralino clipboard/status popups never steal focus from the active application or a text input while retaining explicit user-driven popup interaction.

**Architecture:** Keep the independent clipboard-prompt process. Make the Windows WinForms toast a non-activating form and replace repeated `show` calls with a visible-state transition. Preserve main-window tray focus only for an explicit `SHOW` action.

**Tech Stack:** NeutralinoJS 6, vanilla browser JavaScript, PowerShell WinForms, Win32 `WS_EX_NOACTIVATE`/`SetWindowPos`, Node `node:test`.

## Global Constraints

- Passive popup polling and rendering must never call `Activate()`, `Focus()`, `SetForegroundWindow()`, or `Neutralino.window.focus()`.
- A user click on an interactive popup may focus that popup.
- Main-window tray `SHOW` remains an explicit user action and may focus the main window.
- Preserve clipboard prompt fingerprint deduplication, countdown, actions, and independent process lifecycle.
- Do not revive `Neutralino.window.create` for clipboard prompts.
- Do not commit changes unless the user explicitly requests a commit.

---

## File Map

**Create:**

- `apps/CWSP-reborn/test/neutralino-focus.test.mjs` — static regression tests
  for the passive prompt and generated tray behavior.

**Modify:**

- `apps/CWSP-reborn/resources/clipboard-prompt/prompt-toast.ps1` — make the
  WinForms toast non-activating and replace activation on fingerprint changes.
- `apps/CWSP-reborn/resources/clipboard-prompt/popup.js` — show only on hidden
  to visible transitions and never request focus.
- `apps/CWSP-reborn/package.json` — add `check:neutralino-focus`.

## Interfaces

The popup JavaScript keeps these local lifecycle functions:

```js
function showWindow();
function hideWindow();
function renderState(state);
function renderEmpty();
```

The PowerShell toast adds:

```powershell
class CwspNonActivatingForm : System.Windows.Forms.Form
function Show-ToastWithoutActivation
```

`showWindow()` is idempotent while the popup is visible. `hideWindow()` resets
the visibility state before or while hiding the native window.

### Task 1: Add failing focus regression tests

**Files:**

- Create: `apps/CWSP-reborn/test/neutralino-focus.test.mjs`
- Modify: `apps/CWSP-reborn/package.json`

- [ ] **Step 1: Write static tests for the current focus hazards**

Create tests with exact source paths:

```js
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const root = path.resolve(import.meta.dirname, "..");
const ps1 = fs.readFileSync(
    path.join(root, "resources/clipboard-prompt/prompt-toast.ps1"),
    "utf8"
);
const popup = fs.readFileSync(
    path.join(root, "resources/clipboard-prompt/popup.js"),
    "utf8"
);
const build = fs.readFileSync(path.join(root, "scripts/build-neutralino.mjs"), "utf8");

test("passive PowerShell toast has a non-activating form path", () => {
    assert.match(ps1, /WS_EX_NOACTIVATE|ShowWithoutActivation|CwspNonActivatingForm/);
    assert.doesNotMatch(ps1, /\$form\.Activate\(\)/);
});

test("passive browser popup never requests focus", () => {
    assert.doesNotMatch(popup, /Neutralino\.window\.focus\s*\(/);
    assert.match(popup, /visible|shown|isVisible/);
});

test("tray SHOW remains the only generated explicit main-window focus", () => {
    assert.match(build, /trayMenuItemClicked/);
    assert.match(build, /id === ['"]SHOW['"]/);
    assert.match(build, /Neutralino\.window\.focus\(\)/);
});
```

- [ ] **Step 2: Add the package command**

Add:

```json
"check:neutralino-focus": "node --test test/neutralino-focus.test.mjs"
```

- [ ] **Step 3: Run the test and verify it fails**

Run from `apps/CWSP-reborn`:

```bash
npm run check:neutralino-focus
```

Expected: FAIL because the PowerShell source still contains
`$form.Activate()` and the popup has no explicit visible-state guard.

### Task 2: Make the PowerShell toast non-activating

**Files:**

- Modify: `apps/CWSP-reborn/resources/clipboard-prompt/prompt-toast.ps1`
- Test: `apps/CWSP-reborn/test/neutralino-focus.test.mjs`

- [ ] **Step 1: Add a non-activating WinForms form type**

After loading `System.Windows.Forms` and before creating `$form`, add a small
PowerShell `Add-Type` definition equivalent to:

```csharp
using System.Windows.Forms;

public sealed class CwspNonActivatingForm : Form
{
    protected override bool ShowWithoutActivation { get { return true; } }

    protected override CreateParams CreateParams
    {
        get
        {
            var parameters = base.CreateParams;
            parameters.ExStyle |= 0x08000000; // WS_EX_NOACTIVATE
            return parameters;
        }
    }
}
```

Use `New-Object CwspNonActivatingForm` instead of
`New-Object System.Windows.Forms.Form`.

- [ ] **Step 2: Add no-activate z-order helpers**

Add a small `Add-Type` Win32 helper with `SetWindowPos` and these flags:

```text
HWND_TOPMOST   = -1
SWP_NOSIZE     = 0x0001
SWP_NOMOVE     = 0x0002
SWP_NOACTIVATE = 0x0010
SWP_SHOWWINDOW = 0x0040
```

Implement `Show-ToastWithoutActivation` so it calls `SetWindowPos` with
`SWP_NOACTIVATE`, preserves the existing topmost/z-order behavior, and never
calls `SetForegroundWindow`.

- [ ] **Step 3: Replace fingerprint activation**

Change the fingerprint transition from:

```powershell
$form.Activate()
$form.BringToFront()
```

to:

```powershell
Show-ToastWithoutActivation
```

Keep the existing fingerprint, deadline, render, button, and close behavior.
Do not remove `TopMost` solely to solve focus theft; visibility and activation
are separate concerns.

- [ ] **Step 4: Run the static test**

Run:

```bash
npm run check:neutralino-focus
```

Expected: the PowerShell non-activation assertions pass. A Windows host is
still required for runtime focus verification.

### Task 3: Make the Neutralino browser popup transition-driven

**Files:**

- Modify: `apps/CWSP-reborn/resources/clipboard-prompt/popup.js`
- Test: `apps/CWSP-reborn/test/neutralino-focus.test.mjs`

- [ ] **Step 1: Add an idempotent visibility state**

Keep a boolean such as `popupVisible = false`. Implement:

```js
function showWindow() {
  if (popupVisible) return;
  popupVisible = true;
  try {
    if (globalThis.Neutralino?.window?.show) {
      Neutralino.window.show().catch(function (error) {
        popupVisible = false;
        logErr("window.show", error);
      });
    }
  } catch (error) {
    popupVisible = false;
    logErr("showWindow", error);
  }
}

function hideWindow() {
  popupVisible = false;
  try {
    if (globalThis.Neutralino?.window?.hide) {
      Neutralino.window.hide().catch(function () {});
    }
  } catch (_) {}
}
```

Do not add a focus call. `renderState` may update an already visible popup
without invoking `showWindow` again.

- [ ] **Step 2: Reset visibility on empty state**

Ensure the existing no-prompt branch calls `hideWindow()`, which resets
`popupVisible` before the next prompt. Preserve the existing fingerprint reset
and countdown cleanup.

- [ ] **Step 3: Keep explicit interactions intact**

Do not change button click handlers, spoiler interaction, pointer countdown
pause/resume, or the generated tray `SHOW` handler in
`scripts/build-neutralino.mjs`. The tray handler is a separate explicit user
action and remains the only main-window focus path.

- [ ] **Step 4: Run the static and web build checks**

Run:

```bash
npm run check:neutralino-focus
npm run build:neutralino:web
```

Expected: the regression test passes and the Neutralino web bundle builds.

### Task 4: Validate packaged Neutralino behavior

**Files:**

- Test: `apps/CWSP-reborn/test/neutralino-focus.test.mjs`
- Inspect: `apps/CWSP-reborn/scripts/build-neutralino.mjs`
- Inspect: `apps/CWSP-reborn/resources/clipboard-prompt/neutralino.config.json`

- [ ] **Step 1: Verify popup resources are packaged**

Run:

```bash
npm run build:neutralino:web-only
```

Expected: the generated package still includes
`resources/clipboard-prompt/popup.js`,
`resources/clipboard-prompt/prompt-toast.ps1`, and the independent prompt
configuration. No main-shell `window.create` path is introduced.

- [ ] **Step 2: Run the short cross-target checks**

Run:

```bash
npm run check:types
npm run check:neutralino-focus
npm run build:webnative:web
```

Expected: the focus change does not break TypeScript checks or the WebNative
build that shares the desktop view graph.

- [ ] **Step 3: Perform the Windows manual smoke test**

On the Windows desk package:

1. Focus a text editor input and hold/type text.
2. Trigger a passive clipboard prompt from the hub.
3. Confirm the editor remains the foreground window and the caret continues
   receiving keystrokes.
4. Move the pointer over the popup and click an action.
5. Confirm the popup may then receive focus and action handling still works.
6. Use tray `SHOW` and confirm the main Neutralino window still becomes
   focused.

Record only pass/fail and safe diagnostics; do not capture clipboard contents
or private credentials.

## Plan Self-Review

- **Spec coverage:** Task 1 covers regression guards; Task 2 covers the
  Windows activation root cause; Task 3 covers repeated Neutralino `show`
  calls; Task 4 covers packaging, shared builds, and real focus behavior.
- **Placeholder scan:** No task requires an unspecified API or a new runtime
  dependency. The Windows smoke test is explicitly marked as host-dependent.
- **Type/behavior consistency:** `popupVisible` is set by `showWindow`,
  cleared by `hideWindow`, and never used to suppress user button handlers.
