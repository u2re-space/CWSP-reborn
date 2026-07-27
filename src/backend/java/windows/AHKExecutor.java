/*
 * Filename: AHKExecutor.java
 * FullPath: apps/CWSP-reborn/src/backend/java/windows/AHKExecutor.java
 * Change date and time: 16.17.00_11.07.2026
 * Reason for changes: Thin Java stub for Windows AutoHotkey input/clipboard
 *   execution, providing Neutralino/Windows parity with the Node AHKExecutor.ts.
 */

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.Locale;
import java.util.concurrent.TimeUnit;

/**
 * Thin Windows-only stub that spawns AutoHotkey to perform mouse, keyboard and
 * clipboard actions for the CWSP-reborn Java/Neutralino Windows bridge.
 *
 * COMPAT: generated scripts target AutoHotkey v1 command syntax, which is what
 * the existing CWSP desk scripts (cwsp-host.ahk) use.
 *
 * NOTE: Node (ClipboardHandler.ts / AHKExecutor.ts) remains the canonical text
 * clipboard transport for CWSP v2. The clipboard helpers here are a local
 * fallback for the Java/Neutralino bridge only and intentionally mirror the
 * same stable action names (clipboard:update, mouse:move, ...).
 *
 * WHY temp files: avoids AHK string-escaping pitfalls for arbitrary text
 * (newlines, quotes, commas, backticks) when injecting payload into a script.
 */
public class AHKExecutor {

    /** Default AHK interpreter path; overridable via CWSP_AHK_PATH env. */
    public static final String DEFAULT_AHK_PATH =
            "C:\\Program Files\\AutoHotkey\\AutoHotkey.exe";

    private final String ahkPath;
    private final long timeoutMs;

    public AHKExecutor() {
        this(resolveAhkPath(), 5000L);
    }

    public AHKExecutor(String ahkPath, long timeoutMs) {
        this.ahkPath = ahkPath;
        this.timeoutMs = timeoutMs;
    }

    /** Resolve AHK interpreter path from CWSP_AHK_PATH env or the default. */
    public static String resolveAhkPath() {
        String env = System.getenv("CWSP_AHK_PATH");
        return (env != null && !env.isEmpty()) ? env : DEFAULT_AHK_PATH;
    }

    /**
     * Run an AHK v1 script body and wait for completion.
     * Returns the AHK process exit code.
     */
    public int runScript(String script) throws IOException, InterruptedException {
        Path tmp = Files.createTempFile("cwsp-ahk-", ".ahk");
        try {
            Files.writeString(tmp, script, StandardCharsets.UTF_8);
            ProcessBuilder pb = new ProcessBuilder(ahkPath, tmp.toString());
            // Discard stdout to avoid pipe stalls on noisy scripts; errors merged.
            pb.redirectOutput(ProcessBuilder.Redirect.DISCARD);
            pb.redirectErrorStream(true);
            Process p = pb.start();
            boolean finished = p.waitFor(timeoutMs, TimeUnit.MILLISECONDS);
            if (!finished) {
                p.destroyForcibly();
                throw new InterruptedException("AHK script timed out after " + timeoutMs + "ms");
            }
            return p.exitValue();
        } finally {
            Files.deleteIfExists(tmp);
        }
    }

    // ---- Mouse ----

    /** Relative mouse move by dx/dy pixels (AHK MouseMove with R flag). */
    public int mouseMove(int dx, int dy) throws IOException, InterruptedException {
        return runScript("MouseMove, " + dx + ", " + dy + ", 0, R\n");
    }

    /** Click with button ("left"|"right"|"middle") and optional double flag. */
    public int mouseClick(String button, boolean doubleClick)
            throws IOException, InterruptedException {
        String btn = normalizeButton(button);
        String cmd = "Click, " + btn + (doubleClick ? ", 2" : "") + "\n";
        return runScript(cmd);
    }

    /** Scroll wheel: delta > 0 => WheelUp N, delta < 0 => WheelDown |N|. */
    public int mouseScroll(int delta) throws IOException, InterruptedException {
        int n = Math.abs(delta);
        if (n == 0) n = 1;
        String wheel = delta > 0 ? "WheelUp" : "WheelDown";
        return runScript("Click, " + wheel + ", " + n + "\n");
    }

    // ---- Keyboard ----

    /** Type literal text (raw send via temp file to avoid escaping issues). */
    public int keyboardType(String text) throws IOException, InterruptedException {
        Path data = Files.createTempFile("cwsp-ahk-text-", ".txt");
        try {
            Files.writeString(data, text == null ? "" : text, StandardCharsets.UTF_8);
            // % prefix forces expression mode so commas in v are sent literally.
            String script = "FileRead, v, " + data.toString() + "\n"
                    + "SendInput, % \"{Raw}\" v\n";
            return runScript(script);
        } finally {
            Files.deleteIfExists(data);
        }
    }

    /** Tap a single key with optional modifiers (e.g. key="enter", modifiers=["ctrl"]). */
    public int keyboardTap(String key, List<String> modifiers)
            throws IOException, InterruptedException {
        StringBuilder sb = new StringBuilder();
        if (modifiers != null) {
            for (String m : modifiers) {
                sb.append(ahkModifier(m));
            }
        }
        sb.append("{").append(ahkKeyName(key)).append("}");
        return runScript("SendInput, " + sb.toString() + "\n");
    }

    // ---- Clipboard (local fallback; Node owns canonical CWSP v2 clipboard) ----

    /** Write text to the Windows clipboard via AHK. */
    public int clipboardWrite(String text) throws IOException, InterruptedException {
        Path data = Files.createTempFile("cwsp-ahk-clip-", ".txt");
        try {
            Files.writeString(data, text == null ? "" : text, StandardCharsets.UTF_8);
            String script = "FileRead, v, " + data.toString() + "\n"
                    + "Clipboard := v\n"
                    + "ClipWait, 2\n";
            return runScript(script);
        } finally {
            Files.deleteIfExists(data);
        }
    }

    /** Read text from the Windows clipboard via AHK (writes Clipboard to stdout). */
    public String clipboardRead() throws IOException, InterruptedException {
        // FileAppend with "*" target writes to stdout in AHK v1.
        String script = "FileAppend, % Clipboard, *\n";
        Path tmp = Files.createTempFile("cwsp-ahk-read-", ".ahk");
        try {
            Files.writeString(tmp, script, StandardCharsets.UTF_8);
            ProcessBuilder pb = new ProcessBuilder(ahkPath, tmp.toString());
            pb.redirectErrorStream(false);
            Process p = pb.start();
            // Output is tiny (clipboard text), safe to read before waitFor.
            byte[] out = p.getInputStream().readAllBytes();
            boolean finished = p.waitFor(timeoutMs, TimeUnit.MILLISECONDS);
            if (!finished) {
                p.destroyForcibly();
                throw new InterruptedException("AHK clipboard read timed out");
            }
            return new String(out, StandardCharsets.UTF_8);
        } finally {
            Files.deleteIfExists(tmp);
        }
    }

    // ---- Helpers ----

    private static String normalizeButton(String button) {
        if (button == null) return "L";
        switch (button.toLowerCase(Locale.ROOT)) {
            case "right": case "r": return "R";
            case "middle": case "m": return "M";
            case "left": case "l":
            default: return "L";
        }
    }

    private static String ahkModifier(String m) {
        if (m == null) return "";
        switch (m.toLowerCase(Locale.ROOT)) {
            case "ctrl": case "control": return "^";
            case "alt": return "!";
            case "shift": return "+";
            case "win": case "super": case "meta": return "#";
            default: return "";
        }
    }

    private static String ahkKeyName(String key) {
        if (key == null || key.isEmpty()) return "Enter";
        switch (key.toLowerCase(Locale.ROOT)) {
            case "enter": case "return": return "Enter";
            case "esc": case "escape": return "Esc";
            case "tab": return "Tab";
            case "space": return "Space";
            case "backspace": case "back": return "Backspace";
            case "delete": case "del": return "Delete";
            case "insert": case "ins": return "Insert";
            case "home": return "Home";
            case "end": return "End";
            case "pageup": case "pgup": return "PgUp";
            case "pagedown": case "pgdn": return "PgDn";
            case "up": return "Up";
            case "down": return "Down";
            case "left": return "Left";
            case "right": return "Right";
            default: return key; // single chars (a, b) or named keys (F1) passthrough
        }
    }
}
