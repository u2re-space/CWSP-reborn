/*
 * Filename: ClipboardOsHook.java
 * FullPath: apps/CWSP-reborn/src/backend/java/shared/space/u2re/cwsp/backend/clipboard/ClipboardOsHook.java
 * Change date and time: 16.42.00_10.07.2026
 * Reason for changes: Pass-II — OS clipboard hook seam for later AWT/JNI/AHK integration.
 */

package space.u2re.cwsp.backend.clipboard;

/**
 * Optional OS clipboard bridge.
 * WHY: shared Java backend keeps a text shadow first; platform shells can plug
 * AWT Toolkit / AHK / AutoKey later without changing the service API.
 */
public interface ClipboardOsHook {

    /** Write text to the OS clipboard (may be a no-op). */
    void writeText(String text) throws Exception;

    /** Read text from the OS clipboard (may return null). */
    String readText() throws Exception;

    /** No-op hook used by tests and headless dual-stack runs. */
    static ClipboardOsHook noop() {
        return new ClipboardOsHook() {
            @Override
            public void writeText(String text) {
                // intentionally empty — shadow store only
            }

            @Override
            public String readText() {
                return null;
            }
        };
    }
}
