/*
 * Filename: Linked.java
 * FullPath: apps/CWSP-reborn/src/protocol/java/state/Linked.java
 * Change date and time: 16.42.00_10.07.2026
 * Reason for changes: Thin linked-peer descriptor stub (endpoint registry entry).
 */
package space.u2re.cwsp.protocol.state;

import java.util.Collections;
import java.util.List;

/**
 * Linked peer descriptor. Mirrors a {@code core.endpointIDs[id]} entry: origins,
 * roles, flags (e.g. gateway), and allowed forwards.
 */
public final class Linked {

    private String id;
    private List<String> origins = Collections.emptyList();
    private List<String> roles = Collections.emptyList();
    private boolean gateway;
    private List<String> allowedForwards = Collections.emptyList();

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public List<String> getOrigins() {
        return origins;
    }

    public void setOrigins(List<String> origins) {
        this.origins = origins == null ? Collections.emptyList() : origins;
    }

    public List<String> getRoles() {
        return roles;
    }

    public void setRoles(List<String> roles) {
        this.roles = roles == null ? Collections.emptyList() : roles;
    }

    public boolean isGateway() {
        return gateway;
    }

    public void setGateway(boolean gateway) {
        this.gateway = gateway;
    }

    public List<String> getAllowedForwards() {
        return allowedForwards;
    }

    public void setAllowedForwards(List<String> allowedForwards) {
        this.allowedForwards = allowedForwards == null ? Collections.emptyList() : allowedForwards;
    }
}
