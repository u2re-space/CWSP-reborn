/*
 * Filename: ClipboardService.java
 * FullPath: apps/CWSP-reborn/src/backend/java/shared/space/u2re/cwsp/backend/clipboard/ClipboardService.java
 * Change date and time: 16.42.00_10.07.2026
 * Reason for changes: Pass-II — text shadow clipboard service with OS + packet adapter hooks.
 */

package space.u2re.cwsp.backend.clipboard;

import java.util.Objects;

/**
 * Process-local clipboard text shadow with optional OS write-through.
 * Accepts CWSP clipboard packet payloads via {@link ClipboardPacketAdapter}.
 */
public final class ClipboardService {

    private final ClipboardOsHook osHook;
    private final ClipboardPacketAdapter packetAdapter;
    private String shadowText = "";

    public ClipboardService() {
        this(ClipboardOsHook.noop(), ClipboardPacketAdapter.mapBased());
    }

    public ClipboardService(ClipboardOsHook osHook, ClipboardPacketAdapter packetAdapter) {
        this.osHook = Objects.requireNonNullElseGet(osHook, ClipboardOsHook::noop);
        this.packetAdapter = Objects.requireNonNullElseGet(packetAdapter, ClipboardPacketAdapter::mapBased);
    }

    public synchronized String read() {
        try {
            String os = osHook.readText();
            if (os != null) {
                shadowText = os;
            }
        } catch (Exception ignored) {
            // Keep shadow when OS clipboard is unavailable.
        }
        return shadowText;
    }

    public synchronized void write(String text) {
        shadowText = text == null ? "" : text;
        try {
            osHook.writeText(shadowText);
        } catch (Exception ignored) {
            // Shadow remains authoritative for dual-stack tests / headless hosts.
        }
    }

    public synchronized void clear() {
        write("");
    }

    /**
     * Apply a CWSP clipboard packet / payload map into the shadow (and OS hook).
     * @return extracted text, or null when no textual body was present
     */
    public synchronized String applyPacket(Object packetOrPayload) {
        String text = packetAdapter.extractText(packetOrPayload);
        if (text != null) {
            write(text);
        }
        return text;
    }

    public synchronized boolean isReady() {
        return true;
    }
}
