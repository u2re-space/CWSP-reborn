/*
 * Filename: Transport.java
 * FullPath: apps/CWSP-reborn/src/protocol/java/network/Transport.java
 * Change date and time: 16.42.00_10.07.2026
 * Reason for changes: Transport preference resolver for source/target pairs.
 *                     Java counterpart to the Transport Preference section of
 *                     network.mdc.
 */
package space.u2re.cwsp.protocol.network;

import space.u2re.cwsp.protocol.packet.Formats;

/**
 * Transport preference helper. Resolves the preferred transport per
 * source/target pair from endpoint policy. This is a thin stub; real policy
 * lookup lives in the endpoint runtime.
 */
public final class Transport {

    /** General preference order per network.mdc: ws, http, tcp, socketio. */
    public static final String[] PREFERENCE = Formats.PREFERENCE;

    /** Fallback order when no preferred sender exists: ws, bridge, socketio. */
    public static final String[] FALLBACK = Formats.FALLBACK;

    private Transport() {
    }

    /**
     * Resolve a transport hint. Explicit hint wins when supported; otherwise
     * the first entry of {@link #PREFERENCE} is returned as a default.
     */
    public static String resolve(String explicitHint) {
        if (explicitHint != null && !explicitHint.isEmpty()) {
            return explicitHint;
        }
        return PREFERENCE[0];
    }
}
