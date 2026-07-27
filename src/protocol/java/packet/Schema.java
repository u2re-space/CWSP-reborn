/*
 * Filename: Schema.java
 * FullPath: apps/CWSP-reborn/src/protocol/java/packet/Schema.java
 * Change date and time: 16.42.00_10.07.2026
 * Reason for changes: Canonical packet field name constants (mirrors the v2
 *                     envelope keys documented in .cursor/rules/network.mdc).
 */
package space.u2re.cwsp.protocol.packet;

/** Canonical CWSP v2 packet field names. */
public final class Schema {

    public static final String OP = "op";
    public static final String WHAT = "what";
    public static final String TYPE = "type";
    public static final String ACTION = "action";
    public static final String PURPOSE = "purpose";
    public static final String PROTOCOL = "protocol";
    public static final String TRANSPORT = "transport";
    public static final String UUID = "uuid";
    public static final String TIMESTAMP = "timestamp";
    public static final String PAYLOAD = "payload";
    public static final String DATA = "data";
    public static final String RESULT = "result";
    public static final String RESULTS = "results";
    public static final String ERROR = "error";
    public static final String STATUS = "status";
    public static final String SENDER = "sender";
    public static final String BY_ID = "byId";
    public static final String FROM = "from";
    public static final String NODES = "nodes";
    public static final String DESTINATIONS = "destinations";
    public static final String IDS = "ids";
    public static final String TARGET = "target";
    public static final String TARGET_ID = "targetId";
    public static final String DEVICE_ID = "deviceId";
    public static final String URLS = "urls";
    public static final String TOKENS = "tokens";
    public static final String FLAGS = "flags";
    public static final String EXTENSIONS = "extensions";
    public static final String DEFER = "defer";

    // CWSP route query markers (transport diagnostics only, not payload).
    public static final String CWSP_VIA = "cwsp_via";
    public static final String CWSP_LOCAL_ENDPOINT = "cwsp_local_endpoint";
    public static final String CWSP_ROUTE = "cwsp_route";
    public static final String CWSP_ROUTE_TARGET = "cwsp_route_target";
    public static final String CWSP_HOP = "cwsp_hop";
    public static final String CWSP_HOST = "cwsp_host";
    public static final String CWSP_TARGET = "cwsp_target";
    public static final String CWSP_TARGET_PORT = "cwsp_target_port";
    public static final String CWSP_VIA_PORT = "cwsp_via_port";
    public static final String CWSP_PROTOCOL = "cwsp_protocol";

    private Schema() {
    }
}
