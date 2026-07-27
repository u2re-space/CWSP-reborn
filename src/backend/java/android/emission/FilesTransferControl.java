/*
 * Filename: FilesTransferControl.java
 * FullPath: apps/CWSP-reborn/src/backend/java/android/emission/FilesTransferControl.java
 * Change date and time: 05.15.00_22.07.2026
 * Reason for changes: Capacitor files Abort — cancel in-flight HTTP GET/PUT
 *   (AbortSignal-like) without closing the CWSP WebSocket; shared abort flag
 *   for Accept download and Outbound upload/mirror.
 *
 * INVARIANT: abort never calls CwspWsClient.close(); only disconnects the
 *   transfer's HttpURLConnection and flips the per-transferId flag.
 */
package emission;

import android.util.Log;

import java.net.HttpURLConnection;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicBoolean;

/**
 * Per-transfer abort registry for Cap files upload/download.
 */
public final class FilesTransferControl {
    private static final String TAG = "emission.FilesTransferControl";

    private static final ConcurrentHashMap<String, AtomicBoolean> FLAGS =
            new ConcurrentHashMap<>();
    private static final ConcurrentHashMap<String, HttpURLConnection> CONNS =
            new ConcurrentHashMap<>();

    private FilesTransferControl() { /* no instances */ }

    private static String key(String transferId) {
        return transferId != null ? transferId.trim() : "";
    }

    /** Mark transfer aborted and disconnect any bound HTTP connection. */
    public static void requestAbort(String transferId) {
        String tid = key(transferId);
        if (tid.isEmpty()) return;
        AtomicBoolean flag = FLAGS.computeIfAbsent(tid, k -> new AtomicBoolean(false));
        flag.set(true);
        HttpURLConnection conn = CONNS.remove(tid);
        if (conn != null) {
            try {
                conn.disconnect();
            } catch (Exception e) {
                Log.w(TAG, "disconnect on abort failed tid=" + tid, e);
            }
        }
        Log.i(TAG, "abort requested transferId=" + tid);
    }

    public static boolean isAborted(String transferId) {
        String tid = key(transferId);
        if (tid.isEmpty()) return false;
        AtomicBoolean flag = FLAGS.get(tid);
        return flag != null && flag.get();
    }

    /** Clear abort state after a transfer finishes (success / fail / abort). */
    public static void clear(String transferId) {
        String tid = key(transferId);
        if (tid.isEmpty()) return;
        FLAGS.remove(tid);
        CONNS.remove(tid);
    }

    /** Bind the active HTTP connection so {@link #requestAbort} can disconnect it. */
    public static void bindConnection(String transferId, HttpURLConnection conn) {
        String tid = key(transferId);
        if (tid.isEmpty() || conn == null) return;
        CONNS.put(tid, conn);
        if (isAborted(tid)) {
            try { conn.disconnect(); } catch (Exception ignored) { /* */ }
        }
    }

    public static void unbindConnection(String transferId, HttpURLConnection conn) {
        String tid = key(transferId);
        if (tid.isEmpty() || conn == null) return;
        CONNS.remove(tid, conn);
    }

    /** Throw if aborted — used inside read/write loops. */
    public static void throwIfAborted(String transferId) throws Exception {
        if (isAborted(transferId)) {
            throw new Exception("CWSP_FILES_ABORTED");
        }
    }
}
