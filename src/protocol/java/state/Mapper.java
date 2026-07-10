/*
 * Filename: Mapper.java
 * FullPath: apps/CWSP-reborn/src/protocol/java/state/Mapper.java
 * Change date and time: 16.42.00_10.07.2026
 * Reason for changes: Thin alias->canonical-id mapper stub (coordinator alias
 *                     resolution described in network.mdc).
 */
package space.u2re.cwsp.protocol.state;

import java.util.HashMap;
import java.util.Map;

/**
 * Alias -> canonical id mapper. Stub; real coordinator alias collapse is owned
 * by the endpoint runtime. Provided so callers can register/resolve aliases
 * against a known canonical id.
 */
public final class Mapper {

    private final Map<String, String> aliases = new HashMap<>();

    public void register(String alias, String canonicalId) {
        if (alias != null && canonicalId != null) {
            aliases.put(alias, canonicalId);
        }
    }

    public String resolve(String alias) {
        if (alias == null) {
            return null;
        }
        return aliases.getOrDefault(alias, alias);
    }
}
