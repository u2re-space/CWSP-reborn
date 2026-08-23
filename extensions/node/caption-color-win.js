/*
 * Filename: caption-color-win.js
 * FullPath: apps/CWSP-transfer/extensions/node/caption-color-win.js
 * Change date and time: 23.10.20_23.08.2026
 * Reason for changes: Paint Neutralino Win11 caption to match minimal-shell nav.
 * FIND:neutralino-titlebar
 */

/**
 * WHY: Neutralino 6 keeps a real Win32 titlebar (not WCO). `meta theme-color`
 * does not tint it — DWMWA_CAPTION_COLOR does.
 *
 * INVARIANT: HWND is the visible ownerless top-level of the Neutralino host PID
 * (ppid is cmd.exe on Windows — caller must pass resolveNeutralinoHostPid).
 */
"use strict";

const { spawnSync } = require("node:child_process");

const hexToColorRef = (hex) => {
    const m = /^#?([0-9a-f]{6})$/i.exec(String(hex || "").trim());
    if (!m) return null;
    const n = parseInt(m[1], 16);
    const r = (n >> 16) & 255;
    const g = (n >> 8) & 255;
    const b = n & 255;
    return (b << 16) | (g << 8) | r;
};

const hexLuma = (hex) => {
    const m = /^#?([0-9a-f]{6})$/i.exec(String(hex || "").trim());
    if (!m) return 0;
    const n = parseInt(m[1], 16);
    const r = (n >> 16) & 255;
    const g = (n >> 8) & 255;
    const b = n & 255;
    return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
};

const buildApplyScript = (pid, caption, text, dark) =>
    [
        "Add-Type -TypeDefinition @'",
        "using System;",
        "using System.Runtime.InteropServices;",
        "public static class CwsCaption {",
        "  public delegate bool EnumProc(IntPtr hWnd, IntPtr lParam);",
        "  [DllImport(\"user32.dll\")] public static extern bool EnumWindows(EnumProc cb, IntPtr l);",
        "  [DllImport(\"user32.dll\")] public static extern uint GetWindowThreadProcessId(IntPtr h, out uint pid);",
        "  [DllImport(\"user32.dll\")] public static extern bool IsWindowVisible(IntPtr h);",
        "  [DllImport(\"user32.dll\")] public static extern bool IsIconic(IntPtr h);",
        "  [DllImport(\"user32.dll\")] public static extern IntPtr GetWindow(IntPtr h, uint cmd);",
        "  [DllImport(\"dwmapi.dll\")] public static extern int DwmSetWindowAttribute(IntPtr h, int a, ref uint v, int cb);",
        "  public static IntPtr FindPid(uint pid) {",
        "    IntPtr found = IntPtr.Zero;",
        "    EnumWindows((h, l) => {",
        "      uint p; GetWindowThreadProcessId(h, out p);",
        "      if (p == pid && IsWindowVisible(h) && !IsIconic(h) && GetWindow(h, 4) == IntPtr.Zero) {",
        "        found = h; return false;",
        "      }",
        "      return true;",
        "    }, IntPtr.Zero);",
        "    return found;",
        "  }",
        "  public static int Apply(uint pid, uint caption, uint text, uint dark) {",
        "    IntPtr h = FindPid(pid);",
        "    if (h == IntPtr.Zero) return 2;",
        "    uint none = 1;",
        "    DwmSetWindowAttribute(h, 38, ref none, 4);",
        "    DwmSetWindowAttribute(h, 20, ref dark, 4);",
        "    DwmSetWindowAttribute(h, 35, ref caption, 4);",
        "    DwmSetWindowAttribute(h, 36, ref text, 4);",
        "    DwmSetWindowAttribute(h, 34, ref caption, 4);",
        "    return 0;",
        "  }",
        "}",
        "'@",
        `[CwsCaption]::Apply(${pid}, ${caption}, ${text}, ${dark})`
    ].join("\n");

/**
 * @param {{ hex?: string, textHex?: string, pid?: number }} parameter
 * @param {() => number} resolvePid
 */
function applyCaptionColor(parameter, resolvePid) {
    if (process.platform !== "win32") {
        return { ok: true, skipped: "not-win32" };
    }
    const hex = String(parameter?.hex || "").trim();
    const caption = hexToColorRef(hex);
    if (caption == null) {
        return { ok: false, error: "bad-hex" };
    }
    const pid = Number(parameter?.pid || 0) || Number(resolvePid?.() || 0);
    if (!(pid > 0)) {
        return { ok: false, error: "no-pid" };
    }
    const dark = hexLuma(hex) < 0.55 ? 1 : 0;
    const textHex =
        String(parameter?.textHex || "").trim() || (dark ? "#f2f2f2" : "#1a1a1a");
    const text = hexToColorRef(textHex);
    if (text == null) {
        return { ok: false, error: "bad-text-hex" };
    }
    const out = spawnSync(
        "powershell.exe",
        [
            "-NoProfile",
            "-STA",
            "-ExecutionPolicy",
            "Bypass",
            "-Command",
            buildApplyScript(pid, caption, text, dark)
        ],
        { encoding: "utf8", windowsHide: true, timeout: 8000 }
    );
    const status = Number(out.status);
    return {
        ok: status === 0,
        status,
        skipped: status === 2 ? "no-hwnd" : undefined,
        stderr: String(out.stderr || "").slice(0, 240)
    };
}

module.exports = { applyCaptionColor, hexToColorRef };
