/*
 * Filename: Configure.java
 * FullPath: /home/u2re-dev/U2RE.space/apps/CWSP-reborn/src/backend/java/android/core/Configure.java
 * Change date and time: 16.30.00_10.07.2026
 * Reason for changes: Pass-II fill: minimal configuration scaffold stub.
 */

package core;

/**
 * Configuration scaffold: will load CWSP endpoint config (origin, clientId,
 * token hints) from env/config assets. Placeholder until Pass-III wiring.
 */
public class Configure {

    private String endpointOrigin = null;
    private String clientId = null;

    public void setEndpoint(String origin) {
        this.endpointOrigin = origin;
    }

    public String getEndpoint() {
        return endpointOrigin;
    }

    public void setClientId(String id) {
        this.clientId = id;
    }

    public String getClientId() {
        return clientId;
    }
}
