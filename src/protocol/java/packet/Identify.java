/*
 * Filename: Identify.java
 * FullPath: apps/CWSP-reborn/src/protocol/java/packet/Identify.java
 * Change date and time: 16.42.00_10.07.2026
 * Reason for changes: Canonical peer-id helpers (L- prefix convention).
 *
 * WHY: The CWSP network routes by normalized node ids such as L-192.168.0.110.
 *      Keeping the prefix/format logic in one place avoids brittle ad-hoc
 *      string handling in routing code.
 */
package space.u2re.cwsp.protocol.packet;

import java.util.Arrays;
import java.util.Collections;
import java.util.LinkedHashSet;
import java.util.Set;

/** Canonical peer-id helpers. */
public final class Identify {

    public static final String NODE_PREFIX = "L-";
    public static final String WILDCARD = "*";

    // Known node identities from the network topology (debugging.mdc).
    public static final String NODE_110 = "L-192.168.0.110";
    public static final String NODE_200 = "L-192.168.0.200";
    public static final String NODE_196 = "L-192.168.0.196";
    public static final String NODE_208 = "L-192.168.0.208";
    public static final String NODE_210 = "L-192.168.0.210";
    public static final String NODE_WAN_CLIENT = "L-wan-client";

    public static final Set<String> KNOWN_NODES = Collections.unmodifiableSet(
            new LinkedHashSet<>(Arrays.asList(
                    NODE_110, NODE_200, NODE_196, NODE_208, NODE_210, NODE_WAN_CLIENT)));

    private Identify() {
    }

    /** True for canonical L- prefixed ids. */
    public static boolean isCanonical(String id) {
        return id != null && id.startsWith(NODE_PREFIX) && id.length() > NODE_PREFIX.length();
    }

    /** True if the id is the wildcard fan-out marker. */
    public static boolean isWildcard(String id) {
        return WILDCARD.equals(id);
    }
}
