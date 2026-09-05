/*
 * Filename: BluetoothTransfer.java
 * FullPath: apps/CWSP-transfer/src/backend/java/android/emission/BluetoothTransfer.java
 * Reason for changes: RFCOMM path for clipboard/images/files ≤2MiB without gateway.
 *
 * FIND:bluetooth
 * WHY: LTE / no-hub phones still need a direct hop. Classic RFCOMM (not BLE)
 * carries a CWSB length-prefixed frame matching cwsp-shared bluetooth-transport.
 *
 * INVARIANT: never block the main thread on connect/write.
 * SECURITY: hello.auth must match the local fleet token when one is stored;
 * otherwise only already-bonded peers are accepted.
 */

package emission;

import android.Manifest;
import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothDevice;
import android.bluetooth.BluetoothServerSocket;
import android.bluetooth.BluetoothSocket;
import android.content.Context;
import android.content.pm.PackageManager;
import android.os.Build;
import android.os.Looper;
import android.util.Log;

import androidx.core.content.ContextCompat;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.nio.ByteBuffer;
import java.nio.ByteOrder;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import core.Configure;
import core.DeviceAliases;
import space.u2re.cwsp.CwspBridgeService;
import space.u2re.cwsp.SecureTokenStore;

public final class BluetoothTransfer {
    private static final String TAG = "emission.Bluetooth";
    public static final String SERVICE_UUID = "6e757265-4357-5350-4254-000000000001";
    public static final String SERVICE_NAME = "CWSP";
    public static final int MAX_BYTES = 2 * 1024 * 1024;
    private static final byte[] MAGIC = { 'C', 'W', 'S', 'B' };
    private static final int VERSION = 1;
    private static final UUID RFCOMM_UUID = UUID.fromString(SERVICE_UUID);
    private static final String LEARNED_PREFS = "cwsp_bt_learned";

    private static final ExecutorService EXEC = Executors.newCachedThreadPool(r -> {
        Thread t = new Thread(r, "cwsp-bt");
        t.setDaemon(true);
        return t;
    });

    private static volatile Context appContext;
    private static volatile boolean wantListen;
    private static volatile BluetoothServerSocket server;

    private BluetoothTransfer() {}

    public static void start(Context context) {
        if (context == null) return;
        appContext = context.getApplicationContext();
        if (!Configure.readBluetoothEnabled(appContext)) {
            stop();
            return;
        }
        wantListen = true;
        EXEC.execute(BluetoothTransfer::listenLoop);
    }

    public static void stop() {
        wantListen = false;
        BluetoothServerSocket sock = server;
        server = null;
        if (sock != null) {
            try {
                sock.close();
            } catch (Exception ignored) {
                /* */
            }
        }
    }

    public static boolean isListening() {
        return wantListen && server != null;
    }

    /**
     * Send a CWSP packet over RFCOMM to {@code destinations}/{@code nodes}.
     * @return true when at least one peer accepted a frame
     */
    public static boolean sendPacket(Context context, Map<String, Object> packet) {
        if (context == null || packet == null) return false;
        Context app = context.getApplicationContext();
        if (!Configure.readBluetoothEnabled(app)) return false;
        if (Looper.myLooper() == Looper.getMainLooper()) {
            final Map<String, Object> copy = new LinkedHashMap<>(packet);
            EXEC.execute(() -> sendPacket(app, copy));
            return false;
        }
        List<DeviceAliases.Record> map = Configure.readDeviceAliasMap(app);
        List<String> dests = DeviceAliases.resolveAll(extractDestinations(packet), map);
        String fromId = Configure.readClientId(app);
        if (fromId == null || fromId.isEmpty()) fromId = "L-unknown";
        FrameParts parts = frameFromPacket(packet, fromId);
        if (parts == null) return false;
        boolean any = false;
        for (String dest : dests) {
            if (dest == null || dest.isEmpty() || dest.equals("*")) continue;
            if (fromId.equalsIgnoreCase(dest)) continue;
            if (sendFrameTo(app, dest, parts.headerJson, parts.payload, map)) any = true;
        }
        return any;
    }

    public static boolean sendBytes(
            Context context,
            List<String> destinations,
            String kind,
            String name,
            String mimeType,
            byte[] bytes,
            String fromId
    ) {
        if (context == null || bytes == null) return false;
        if (bytes.length > MAX_BYTES) {
            Log.w(TAG, "sendBytes refused size=" + bytes.length);
            return false;
        }
        Context app = context.getApplicationContext();
        if (!Configure.readBluetoothEnabled(app)) return false;
        if (Looper.myLooper() == Looper.getMainLooper()) {
            final byte[] copy = bytes;
            final List<String> destCopy = destinations;
            EXEC.execute(() -> sendBytes(app, destCopy, kind, name, mimeType, copy, fromId));
            return false;
        }
        List<DeviceAliases.Record> map = Configure.readDeviceAliasMap(app);
        List<String> dests = DeviceAliases.resolveAll(
                destinations != null ? destinations : new ArrayList<String>(), map);
        String sender = fromId != null && !fromId.isEmpty() ? fromId : Configure.readClientId(app);
        if (sender == null) sender = "L-unknown";
        String header = headerJson(kind, sender, null, name, mimeType, bytes.length, null, whatForKind(kind), authToken(app));
        boolean any = false;
        for (String dest : dests) {
            if (dest == null || dest.isEmpty() || dest.equals("*")) continue;
            if (sendFrameTo(app, dest, header, bytes, map)) any = true;
        }
        return any;
    }

    public static boolean sendStagedFiles(
            Context context,
            List<String> destinations,
            List<FilesIngress.StagedFile> files,
            String fromId
    ) {
        if (files == null || files.isEmpty()) return false;
        long total = 0;
        for (FilesIngress.StagedFile f : files) {
            if (f != null) total += Math.max(0L, f.size);
        }
        if (total <= 0 || total > MAX_BYTES) return false;
        boolean any = false;
        for (FilesIngress.StagedFile f : files) {
            if (f == null || f.path == null) continue;
            byte[] bytes = readFileCapped(new File(f.path), MAX_BYTES);
            if (bytes == null) continue;
            if (sendBytes(context, destinations, "file", f.name, null, bytes, fromId)) any = true;
        }
        return any;
    }

    public static Map<String, Object> status(Context context) {
        Map<String, Object> out = new LinkedHashMap<>();
        Context app = context != null ? context.getApplicationContext() : appContext;
        BluetoothAdapter adapter = BluetoothAdapter.getDefaultAdapter();
        out.put("enabled", app != null && Configure.readBluetoothEnabled(app));
        out.put("prefer", app != null && Configure.readPreferBluetooth(app));
        out.put("listening", isListening());
        out.put("adapter", adapter != null);
        out.put("adapterOn", adapter != null && adapter.isEnabled());
        out.put("hasPermission", app != null && hasConnectPermission(app));
        out.put("maxBytes", MAX_BYTES);
        List<Map<String, Object>> peers = new ArrayList<>();
        if (app != null) {
            for (DeviceAliases.Record rec : Configure.readDeviceAliasMap(app)) {
                Map<String, Object> row = new LinkedHashMap<>();
                row.put("id", rec.id);
                row.put("label", DeviceAliases.displayLabel(rec.id, Configure.readDeviceAliasMap(app)));
                row.put("bluetooth", rec.bluetooth);
                peers.add(row);
            }
        }
        out.put("peers", peers);
        return out;
    }

    private static void listenLoop() {
        Context app = appContext;
        if (app == null || !wantListen) return;
        if (!hasConnectPermission(app)) {
            Log.w(TAG, "listen skipped — BLUETOOTH_CONNECT missing");
            return;
        }
        BluetoothAdapter adapter = BluetoothAdapter.getDefaultAdapter();
        if (adapter == null || !adapter.isEnabled()) {
            Log.w(TAG, "listen skipped — adapter off");
            return;
        }
        try {
            BluetoothServerSocket next = adapter.listenUsingInsecureRfcommWithServiceRecord(
                    SERVICE_NAME, RFCOMM_UUID);
            server = next;
            Log.i(TAG, "RFCOMM listening uuid=" + SERVICE_UUID);
            while (wantListen && server == next) {
                BluetoothSocket client = next.accept();
                if (client == null) continue;
                EXEC.execute(() -> handleClient(app, client));
            }
        } catch (Exception e) {
            if (wantListen) Log.w(TAG, "listen ended", e);
        } finally {
            stop();
            if (wantListen) {
                try {
                    Thread.sleep(1500);
                } catch (InterruptedException ie) {
                    Thread.currentThread().interrupt();
                    return;
                }
                EXEC.execute(BluetoothTransfer::listenLoop);
            }
        }
    }

    private static void handleClient(Context app, BluetoothSocket socket) {
        try {
            Frame decoded = readFrame(socket.getInputStream());
            if (decoded == null) return;
            BluetoothDevice remote = socket.getRemoteDevice();
            String mac = remote != null ? DeviceAliases.normalizeMac(remote.getAddress()) : null;
            if (!authorize(app, decoded.header, remote)) {
                Log.w(TAG, "BT inbound rejected (auth/bond)");
                return;
            }
            String fromId = str(decoded.header.get("fromId"));
            if (mac != null && fromId != null && !fromId.isEmpty()) {
                learnMac(app, fromId, mac);
            }
            applyInbound(app, decoded);
        } catch (Exception e) {
            Log.w(TAG, "handleClient failed", e);
        } finally {
            try {
                socket.close();
            } catch (Exception ignored) {
                /* */
            }
        }
    }

    private static boolean sendFrameTo(
            Context app,
            String destId,
            String headerJson,
            byte[] payload,
            List<DeviceAliases.Record> map
    ) {
        if (!hasConnectPermission(app)) {
            Log.w(TAG, "send skipped — no BLUETOOTH_CONNECT dest=" + destId);
            return false;
        }
        BluetoothAdapter adapter = BluetoothAdapter.getDefaultAdapter();
        if (adapter == null || !adapter.isEnabled()) return false;
        BluetoothDevice device = resolveDevice(adapter, destId, map, app);
        if (device == null) {
            Log.w(TAG, "no bluetooth target for " + destId);
            return false;
        }
        BluetoothSocket socket = null;
        try {
            socket = device.createInsecureRfcommSocketToServiceRecord(RFCOMM_UUID);
            adapter.cancelDiscovery();
            socket.connect();
            writeFrame(socket.getOutputStream(), headerJson, payload);
            Log.i(TAG, "BT sent dest=" + destId + " bytes=" + (payload != null ? payload.length : 0));
            String mac = DeviceAliases.normalizeMac(device.getAddress());
            if (mac != null) learnMac(app, destId, mac);
            return true;
        } catch (Exception e) {
            Log.w(TAG, "BT send failed dest=" + destId + " err=" + e.getMessage());
            return false;
        } finally {
            if (socket != null) {
                try {
                    socket.close();
                } catch (Exception ignored) {
                    /* */
                }
            }
        }
    }

    private static BluetoothDevice resolveDevice(
            BluetoothAdapter adapter,
            String destId,
            List<DeviceAliases.Record> map,
            Context app
    ) {
        String mac = DeviceAliases.bluetoothMac(destId, map);
        if (mac == null) mac = learnedMac(app, destId);
        if (mac != null) {
            try {
                return adapter.getRemoteDevice(mac);
            } catch (Exception ignored) {
                /* */
            }
        }
        Set<BluetoothDevice> bonded;
        try {
            bonded = adapter.getBondedDevices();
        } catch (SecurityException e) {
            return null;
        }
        if (bonded == null) return null;
        String want = destId.toLowerCase(Locale.US);
        for (BluetoothDevice d : bonded) {
            String name = null;
            try {
                name = d.getName();
            } catch (SecurityException ignored) {
                /* */
            }
            String mapped = DeviceAliases.idForBluetoothName(name, map);
            if (mapped != null && mapped.equalsIgnoreCase(destId)) return d;
            if (name != null && name.toLowerCase(Locale.US).contains(want)) return d;
        }
        return null;
    }

    @SuppressWarnings("unchecked")
    private static void applyInbound(Context app, Frame frame) {
        String kind = str(frame.header.get("kind"));
        String fromId = str(frame.header.get("fromId"));
        String name = str(frame.header.get("name"));
        String mime = str(frame.header.get("mimeType"));
        if ("hello".equals(kind)) return;
        if ("clipboard-text".equals(kind)) {
            String text = new String(frame.payload, StandardCharsets.UTF_8);
            Map<String, Object> packet = clipboardPacket(fromId, text, null);
            CwspBridgeService.routeInbound(app, packet, null);
            return;
        }
        if ("clipboard-image".equals(kind) || "file".equals(kind)) {
            if ("file".equals(kind)) {
                FilesStorage.saveBytesToLanding(app, frame.payload, name, mime);
                return;
            }
            Map<String, Object> asset = new LinkedHashMap<>();
            asset.put("name", name != null ? name : "clipboard.bin");
            asset.put("mimeType", mime != null ? mime : "image/png");
            asset.put("size", frame.payload.length);
            asset.put("source", "base64");
            asset.put("data", android.util.Base64.encodeToString(frame.payload, android.util.Base64.NO_WRAP));
            CwspBridgeService.routeInbound(app, clipboardPacket(fromId, null, asset), null);
            return;
        }
        if ("packet".equals(kind)) {
            try {
                String json = new String(frame.payload, StandardCharsets.UTF_8);
                Map<String, Object> packet = space.u2re.cwsp.JsonMaps.fromJSONObject(
                        new org.json.JSONObject(json));
                String what = packet.get("what") != null ? String.valueOf(packet.get("what")) : "";
                if (what.startsWith("clipboard")) {
                    CwspBridgeService.routeInbound(app, packet, null);
                } else if (what.startsWith("files:")) {
                    // Re-enter the native /ws inbound router via a tiny synthetic client path.
                    CwspBridgeService.routeInbound(app, packet, null);
                }
            } catch (Exception e) {
                Log.w(TAG, "inbound packet apply failed", e);
            }
        }
    }

    private static Map<String, Object> clipboardPacket(String fromId, String text, Map<String, Object> asset) {
        Map<String, Object> payload = new LinkedHashMap<>();
        if (text != null) payload.put("text", text);
        if (asset != null) payload.put("asset", asset);
        Map<String, Object> packet = new LinkedHashMap<>();
        packet.put("op", "act");
        packet.put("what", "clipboard:update");
        packet.put("purpose", "clipboard");
        packet.put("protocol", "bluetooth");
        packet.put("transport", "bluetooth");
        packet.put("sender", fromId != null ? fromId : "");
        packet.put("byId", fromId != null ? fromId : "");
        packet.put("payload", payload);
        return packet;
    }

    private static boolean authorize(Context app, Map<String, Object> header, BluetoothDevice remote) {
        String expected = authToken(app);
        String got = str(header.get("auth"));
        if (expected != null && !expected.isEmpty()) {
            return expected.equals(got);
        }
        try {
            return remote != null && remote.getBondState() == BluetoothDevice.BOND_BONDED;
        } catch (SecurityException e) {
            return false;
        }
    }

    private static String authToken(Context app) {
        try {
            String t = new SecureTokenStore(app).getToken();
            return t != null && !t.isEmpty() ? t : null;
        } catch (Exception e) {
            return null;
        }
    }

    private static FrameParts frameFromPacket(Map<String, Object> packet, String fromId) {
        String kind = kindForPacket(packet);
        Map<String, Object> payload = asMap(packet.get("payload"));
        if (payload == null) payload = asMap(packet.get("data"));
        if ("clipboard-text".equals(kind)) {
            String text = firstText(payload);
            if (text == null) text = "";
            byte[] bytes = text.getBytes(StandardCharsets.UTF_8);
            if (bytes.length > MAX_BYTES) return null;
            return new FrameParts(
                    headerJson(kind, fromId, firstDest(packet), null, "text/plain", bytes.length,
                            str(packet.get("uuid")), "clipboard:update", authToken(appContext)),
                    bytes);
        }
        if ("clipboard-image".equals(kind) || "file".equals(kind)) {
            Map<String, Object> asset = asMap(payload != null ? payload.get("asset") : null);
            if (asset == null && payload != null) asset = asMap(payload.get("image"));
            byte[] bytes = decodeAssetBytes(asset);
            if (bytes == null || bytes.length > MAX_BYTES) return null;
            String name = asset != null ? str(asset.get("name")) : null;
            String mime = asset != null ? firstString(asset, "mimeType", "type") : null;
            return new FrameParts(
                    headerJson(kind, fromId, firstDest(packet), name, mime, bytes.length,
                            str(packet.get("uuid")), str(packet.get("what")), authToken(appContext)),
                    bytes);
        }
        try {
            byte[] json = space.u2re.cwsp.JsonMaps.toJSObject(packet).toString()
                    .getBytes(StandardCharsets.UTF_8);
            if (json.length > MAX_BYTES) return null;
            return new FrameParts(
                    headerJson("packet", fromId, firstDest(packet), null, "application/json", json.length,
                            str(packet.get("uuid")), str(packet.get("what")), authToken(appContext)),
                    json);
        } catch (Exception e) {
            return null;
        }
    }

    private static String kindForPacket(Map<String, Object> packet) {
        String what = str(packet.get("what"));
        if (what == null) what = str(packet.get("type"));
        Map<String, Object> payload = asMap(packet.get("payload"));
        if (payload == null) payload = asMap(packet.get("data"));
        Map<String, Object> asset = payload != null ? asMap(payload.get("asset")) : null;
        if (asset != null) {
            String mime = firstString(asset, "mimeType", "type");
            if (mime != null && mime.toLowerCase(Locale.US).startsWith("image/")) return "clipboard-image";
            return "file";
        }
        if (what != null && what.startsWith("clipboard")) return "clipboard-text";
        return "packet";
    }

    private static String whatForKind(String kind) {
        if ("clipboard-text".equals(kind) || "clipboard-image".equals(kind)) return "clipboard:update";
        if ("file".equals(kind)) return "files:offer";
        return "bluetooth:transfer";
    }

    private static String headerJson(
            String kind,
            String fromId,
            String toId,
            String name,
            String mime,
            int size,
            String uuid,
            String what,
            String auth
    ) {
        try {
            org.json.JSONObject o = new org.json.JSONObject();
            o.put("kind", kind);
            o.put("fromId", fromId != null ? fromId : "");
            if (toId != null && !toId.isEmpty()) o.put("toId", toId);
            if (name != null && !name.isEmpty()) o.put("name", name);
            if (mime != null && !mime.isEmpty()) o.put("mimeType", mime);
            o.put("size", size);
            if (uuid != null && !uuid.isEmpty()) o.put("uuid", uuid);
            if (what != null && !what.isEmpty()) o.put("what", what);
            if (auth != null && !auth.isEmpty()) o.put("auth", auth);
            return o.toString();
        } catch (Exception e) {
            return "{\"kind\":\"" + kind + "\",\"fromId\":\"" + fromId + "\",\"size\":" + size + "}";
        }
    }

    private static void writeFrame(OutputStream out, String headerJson, byte[] payload) throws IOException {
        byte[] head = headerJson.getBytes(StandardCharsets.UTF_8);
        byte[] body = payload != null ? payload : new byte[0];
        ByteBuffer buf = ByteBuffer.allocate(4 + 1 + 4 + head.length + 4 + body.length);
        buf.order(ByteOrder.BIG_ENDIAN);
        buf.put(MAGIC);
        buf.put((byte) VERSION);
        buf.putInt(head.length);
        buf.put(head);
        buf.putInt(body.length);
        buf.put(body);
        out.write(buf.array());
        out.flush();
    }

    private static Frame readFrame(InputStream in) throws IOException {
        byte[] prefix = readFully(in, 9);
        if (prefix[0] != MAGIC[0] || prefix[1] != MAGIC[1] || prefix[2] != MAGIC[2] || prefix[3] != MAGIC[3]) {
            throw new IOException("bad bluetooth magic");
        }
        if ((prefix[4] & 0xff) != VERSION) throw new IOException("bad bluetooth version");
        int headerLen = ByteBuffer.wrap(prefix, 5, 4).order(ByteOrder.BIG_ENDIAN).getInt();
        if (headerLen <= 0 || headerLen > 64 * 1024) throw new IOException("bad header len");
        byte[] head = readFully(in, headerLen);
        byte[] lenBuf = readFully(in, 4);
        int payloadLen = ByteBuffer.wrap(lenBuf).order(ByteOrder.BIG_ENDIAN).getInt();
        if (payloadLen < 0 || payloadLen > MAX_BYTES) throw new IOException("payload too large");
        byte[] payload = payloadLen == 0 ? new byte[0] : readFully(in, payloadLen);
        try {
            org.json.JSONObject obj = new org.json.JSONObject(new String(head, StandardCharsets.UTF_8));
            Map<String, Object> header = new LinkedHashMap<>();
            org.json.JSONArray names = obj.names();
            if (names != null) {
                for (int i = 0; i < names.length(); i++) {
                    String k = names.optString(i);
                    header.put(k, obj.opt(k));
                }
            }
            Frame f = new Frame();
            f.header = header;
            f.payload = payload;
            return f;
        } catch (Exception e) {
            throw new IOException("bad header json", e);
        }
    }

    private static byte[] readFully(InputStream in, int n) throws IOException {
        byte[] out = new byte[n];
        int off = 0;
        while (off < n) {
            int r = in.read(out, off, n - off);
            if (r < 0) throw new IOException("unexpected eof");
            off += r;
        }
        return out;
    }

    private static List<String> extractDestinations(Map<String, Object> packet) {
        List<String> out = new ArrayList<>();
        Object raw = packet.get("destinations");
        if (!(raw instanceof List)) raw = packet.get("nodes");
        if (raw instanceof List) {
            for (Object o : (List<?>) raw) {
                if (o != null) out.add(String.valueOf(o));
            }
        }
        return out;
    }

    private static String firstDest(Map<String, Object> packet) {
        List<String> d = extractDestinations(packet);
        return d.isEmpty() ? null : d.get(0);
    }

    private static String firstText(Map<String, Object> payload) {
        if (payload == null) return null;
        for (String k : new String[] { "text", "content", "body" }) {
            Object v = payload.get(k);
            if (v instanceof String && !((String) v).isEmpty()) return (String) v;
        }
        return null;
    }

    private static byte[] decodeAssetBytes(Map<String, Object> asset) {
        if (asset == null) return null;
        Object data = asset.get("data");
        if (!(data instanceof String)) return null;
        String s = ((String) data).trim();
        if (s.isEmpty()) return null;
        int comma = s.indexOf(',');
        if (s.startsWith("data:") && comma > 0) s = s.substring(comma + 1);
        try {
            return android.util.Base64.decode(s, android.util.Base64.DEFAULT);
        } catch (Exception e) {
            return null;
        }
    }

    private static byte[] readFileCapped(File file, int max) {
        if (file == null || !file.isFile() || file.length() <= 0 || file.length() > max) return null;
        try (FileInputStream in = new FileInputStream(file);
             ByteArrayOutputStream out = new ByteArrayOutputStream((int) file.length())) {
            byte[] buf = new byte[8192];
            int n;
            while ((n = in.read(buf)) > 0) out.write(buf, 0, n);
            return out.toByteArray();
        } catch (Exception e) {
            return null;
        }
    }

    private static void learnMac(Context app, String peerId, String mac) {
        String id = DeviceAliases.resolve(peerId, Configure.readDeviceAliasMap(app));
        String norm = DeviceAliases.normalizeMac(mac);
        if (id == null || norm == null) return;
        app.getSharedPreferences(LEARNED_PREFS, Context.MODE_PRIVATE)
                .edit()
                .putString(id.toLowerCase(Locale.US), norm)
                .apply();
    }

    private static String learnedMac(Context app, String peerId) {
        String id = DeviceAliases.resolve(peerId, Configure.readDeviceAliasMap(app));
        if (id == null) return null;
        return app.getSharedPreferences(LEARNED_PREFS, Context.MODE_PRIVATE)
                .getString(id.toLowerCase(Locale.US), null);
    }

    public static boolean hasConnectPermission(Context context) {
        if (context == null) return false;
        if (Build.VERSION.SDK_INT >= 31) {
            return ContextCompat.checkSelfPermission(context, Manifest.permission.BLUETOOTH_CONNECT)
                    == PackageManager.PERMISSION_GRANTED;
        }
        return ContextCompat.checkSelfPermission(context, Manifest.permission.BLUETOOTH)
                == PackageManager.PERMISSION_GRANTED
                || Build.VERSION.SDK_INT < Build.VERSION_CODES.M;
    }

    public static String[] runtimePermissionsNeeded() {
        if (Build.VERSION.SDK_INT >= 31) {
            return new String[] {
                    Manifest.permission.BLUETOOTH_CONNECT,
                    Manifest.permission.BLUETOOTH_SCAN
            };
        }
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            return new String[] {
                    Manifest.permission.BLUETOOTH,
                    Manifest.permission.BLUETOOTH_ADMIN
            };
        }
        return new String[0];
    }

    @SuppressWarnings("unchecked")
    private static Map<String, Object> asMap(Object value) {
        return value instanceof Map ? (Map<String, Object>) value : null;
    }

    private static String str(Object value) {
        if (value == null) return null;
        String s = String.valueOf(value).trim();
        return s.isEmpty() ? null : s;
    }

    private static String firstString(Map<String, Object> map, String... keys) {
        if (map == null) return null;
        for (String k : keys) {
            String s = str(map.get(k));
            if (s != null) return s;
        }
        return null;
    }

    private static final class Frame {
        Map<String, Object> header;
        byte[] payload;
    }

    private static final class FrameParts {
        final String headerJson;
        final byte[] payload;
        FrameParts(String headerJson, byte[] payload) {
            this.headerJson = headerJson;
            this.payload = payload;
        }
    }
}
