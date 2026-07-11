/*
 * Filename: Access.java
 * FullPath: apps/CWSP-reborn/src/protocol/java/state/Access.java
 * Change date and time: 16.42.00_10.07.2026
 * Reason for changes: Thin access/forward-permission stub.
 *
 * SECURITY: Real token/permission validation is owned by the backend. This stub
 *           only documents the allowedForwards check from network.mdc.
 */
package space.u2re.cwsp.protocol.state;

import java.util.List;

/**
 * Access/forward-permission helper stub.
 */
public final class Access {

    private Access() {
    }

    /** True if {@code forward} is an allowed forward target for {@code gatewayId}. */
    public static boolean canForward(List<String> allowedForwards, String forward) {
        if (allowedForwards == null || forward == null) {
            return false;
        }
        return allowedForwards.contains(forward) || allowedForwards.contains("self");
    }
}
