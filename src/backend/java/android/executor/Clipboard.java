/*
 * Filename: Clipboard.java
 * FullPath: /home/u2re-dev/U2RE.space/apps/CWSP-reborn/src/backend/java/android/executor/Clipboard.java
 * Change date and time: 16.30.00_10.07.2026
 * Reason for changes: Pass-II fill: clipboard executor (apply remote -> OS) hook stub.
 *
 * WHY: package `executor` matches path relative to the
 * `src/backend/java/android` source root. The executor applies clipboard
 * payloads received from the CWSP endpoint onto the Android ClipboardManager,
 * while `emission.Clipboard` produces local->remote payloads.
 */

package executor;

/**
 * Clipboard executor skeleton: applies a remote clipboard text onto the OS.
 * Pending Pass-III: wire to android.content.ClipboardManager + suppress local
 * watch-loop echo after applying remote text (per CWSP clipboard contract).
 */
public class Clipboard {

    private boolean echoSuppressed = false;

    /** Hook: apply a remote clipboard text payload. Returns true if accepted. */
    public boolean applyRemote(String text) {
        if (text == null || text.isEmpty()) {
            return false;
        }
        // FIXME(Pass-III): ClipboardManager.setPrimaryClip(text) here.
        echoSuppressed = true;
        return true;
    }

    /** Whether the local watch loop should suppress the next echo after a remote apply. */
    public boolean isEchoSuppressed() {
        return echoSuppressed;
    }

    /** Called by the watch loop once it has observed (and skipped) the echo. */
    public void clearEchoSuppression() {
        echoSuppressed = false;
    }
}
