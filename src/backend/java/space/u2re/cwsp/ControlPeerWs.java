/*
 * Filename: ControlPeerWs.java
 * FullPath: apps/CWSP-reborn/src/backend/java/space/u2re/cwsp/ControlPeerWs.java
 * Change date and time: 16.55.00_23.07.2026
 * Reason for changes: Minimal RFC6455 text-frame peer `/ws` on Cap Control
 *   for LAN autonomy when gateway hub is down (hub-primary / peer-fallback).
 */

package space.u2re.cwsp;

import android.util.Log;

import java.io.InputStream;
import java.io.OutputStream;
import java.net.Socket;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.Base64;
import java.util.Locale;
import java.util.Map;
import java.util.concurrent.atomic.AtomicReference;
import java.util.function.BiConsumer;

/**
 * Accepts a single peer Control WebSocket (text JSON frames only).
 */
public final class ControlPeerWs {
    private static final String TAG = "ControlPeerWs";
    private static final String WS_MAGIC = "258EAFA5-E914-47DA-95CA-C5AB0DC85B11";

    private static final AtomicReference<BiConsumer<String, String>> MESSAGE_HANDLER =
            new AtomicReference<>(null);

    private ControlPeerWs() {
    }

    /** Register inbound text handler (payload, peerId). */
    public static void setMessageHandler(BiConsumer<String, String> handler) {
        MESSAGE_HANDLER.set(handler);
    }

    public static boolean looksLikeUpgrade(String path, Map<String, String> headers) {
        if (path == null || !"/ws".equals(path)) return false;
        if (headers == null) return false;
        String up = headers.get("upgrade");
        String conn = headers.get("connection");
        if (up == null || conn == null) return false;
        return up.toLowerCase(Locale.ROOT).contains("websocket")
                && conn.toLowerCase(Locale.ROOT).contains("upgrade");
    }

    /**
     * Complete handshake and read text frames until close.
     * @return true when upgrade was handled
     */
    public static boolean accept(
            Socket socket,
            InputStream in,
            OutputStream out,
            String rawQuery,
            Map<String, String> headers,
            String expectedToken
    ) {
        try {
            String peerId = firstQuery(rawQuery, "clientId", "userId", "peerId");
            String presented = firstQuery(rawQuery, "token", "userKey", "accessToken", "clientToken");
            if (expectedToken == null || expectedToken.isEmpty()
                    || presented == null || presented.isEmpty()
                    || !expectedToken.equals(presented)) {
                out.write("HTTP/1.1 401 Unauthorized\r\nConnection: close\r\n\r\n"
                        .getBytes(StandardCharsets.US_ASCII));
                out.flush();
                return true;
            }
            String key = header(headers, "sec-websocket-key");
            if (key == null || key.isEmpty()) {
                out.write("HTTP/1.1 400 Bad Request\r\nConnection: close\r\n\r\n"
                        .getBytes(StandardCharsets.US_ASCII));
                out.flush();
                return true;
            }
            String acceptKey = sha1Base64(key + WS_MAGIC);
            String resp = "HTTP/1.1 101 Switching Protocols\r\n"
                    + "Upgrade: websocket\r\n"
                    + "Connection: Upgrade\r\n"
                    + "Sec-WebSocket-Accept: " + acceptKey + "\r\n"
                    + "\r\n";
            out.write(resp.getBytes(StandardCharsets.US_ASCII));
            out.flush();
            Log.i(TAG, "peer-ws-open peerId=" + peerId
                    + " remote=" + (socket.getInetAddress() != null
                    ? socket.getInetAddress().getHostAddress() : "?"));

            socket.setSoTimeout(0);
            while (!socket.isClosed()) {
                Frame f = readFrame(in);
                if (f == null) break;
                if (f.opcode == 0x8) break;
                if (f.opcode == 0x9) {
                    writePongFrame(out, f.payload);
                    continue;
                }
                if (f.opcode == 0xA) continue;
                if (f.opcode != 0x1) continue;
                String text = new String(f.payload, StandardCharsets.UTF_8);
                BiConsumer<String, String> h = MESSAGE_HANDLER.get();
                if (h != null && !text.isEmpty()) {
                    try {
                        h.accept(text, peerId != null ? peerId : "");
                    } catch (Exception e) {
                        Log.w(TAG, "peer-ws handler failed", e);
                    }
                }
            }
            Log.i(TAG, "peer-ws-close peerId=" + peerId);
            return true;
        } catch (Exception e) {
            Log.w(TAG, "peer-ws session ended: " + e.getMessage());
            return true;
        }
    }

    private static final class Frame {
        final int opcode;
        final byte[] payload;

        Frame(int opcode, byte[] payload) {
            this.opcode = opcode;
            this.payload = payload != null ? payload : new byte[0];
        }
    }

    private static Frame readFrame(InputStream in) throws Exception {
        int b0 = in.read();
        if (b0 < 0) return null;
        int b1 = in.read();
        if (b1 < 0) return null;
        int opcode = b0 & 0x0F;
        boolean masked = (b1 & 0x80) != 0;
        long len = b1 & 0x7F;
        if (len == 126) {
            int hi = in.read();
            int lo = in.read();
            if (hi < 0 || lo < 0) return null;
            len = ((hi & 0xFF) << 8) | (lo & 0xFF);
        } else if (len == 127) {
            for (int i = 0; i < 8; i++) {
                if (in.read() < 0) return null;
            }
            return null;
        }
        byte[] mask = new byte[4];
        if (masked) {
            if (readFully(in, mask) < 0) return null;
        }
        if (len > 4L * 1024L * 1024L) return null;
        byte[] payload = new byte[(int) len];
        if (len > 0 && readFully(in, payload) < 0) return null;
        if (masked) {
            for (int i = 0; i < payload.length; i++) {
                payload[i] = (byte) (payload[i] ^ mask[i % 4]);
            }
        }
        return new Frame(opcode, payload);
    }

    private static void writePongFrame(OutputStream out, byte[] payload) throws Exception {
        int n = payload != null ? Math.min(payload.length, 125) : 0;
        out.write(0x8A);
        out.write(n);
        if (n > 0) out.write(payload, 0, n);
        out.flush();
    }

    private static int readFully(InputStream in, byte[] buf) throws Exception {
        int off = 0;
        while (off < buf.length) {
            int n = in.read(buf, off, buf.length - off);
            if (n < 0) return -1;
            off += n;
        }
        return off;
    }

    private static String sha1Base64(String s) throws Exception {
        MessageDigest md = MessageDigest.getInstance("SHA-1");
        byte[] dig = md.digest(s.getBytes(StandardCharsets.US_ASCII));
        return Base64.getEncoder().encodeToString(dig);
    }

    private static String header(Map<String, String> headers, String name) {
        if (headers == null || name == null) return "";
        String v = headers.get(name.toLowerCase(Locale.ROOT));
        return v != null ? v.trim() : "";
    }

    private static String firstQuery(String query, String... keys) {
        if (query == null || query.isEmpty()) return "";
        for (String key : keys) {
            for (String part : query.split("&")) {
                int eq = part.indexOf('=');
                if (eq <= 0) continue;
                String k = urlDecode(part.substring(0, eq));
                if (key.equals(k)) return urlDecode(part.substring(eq + 1));
            }
        }
        return "";
    }

    private static String urlDecode(String s) {
        try {
            return java.net.URLDecoder.decode(s, StandardCharsets.UTF_8.name());
        } catch (Exception e) {
            return s != null ? s : "";
        }
    }
}
