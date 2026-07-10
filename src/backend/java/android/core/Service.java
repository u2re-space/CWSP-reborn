/*
 * Filename: Service.java
 * FullPath: /home/u2re-dev/U2RE.space/apps/CWSP-reborn/src/backend/java/android/core/Service.java
 * Change date and time: 16.30.00_10.07.2026
 * Reason for changes: Pass-II fill: minimal foreground-service scaffold stub for the CWSP bridge.
 */

package core;

/**
 * Service scaffold: will host the CWSP foreground service (websocket keepalive,
 * clipboard watch). Placeholder until Pass-III wires android.app.Service.
 */
public class Service {

    private boolean running = false;

    public synchronized void start() {
        running = true;
    }

    public synchronized void stop() {
        running = false;
    }

    public synchronized boolean isRunning() {
        return running;
    }
}
