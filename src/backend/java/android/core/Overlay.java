/*
 * Filename: Overlay.java
 * FullPath: /home/u2re-dev/U2RE.space/apps/CWSP-reborn/src/backend/java/android/core/Overlay.java
 * Change date and time: 16.30.00_10.07.2026
 * Reason for changes: Pass-II fill: minimal overlay scaffold stub (AirPad floating control surface).
 */

package core;

/**
 * Overlay scaffold: will manage the AirPad floating overlay window. Pending
 * Pass-III: android.permission.SYSTEM_ALERT_WINDOW + WindowManager wiring.
 */
public class Overlay {

    private boolean visible = false;

    public void show() {
        visible = true;
    }

    public void hide() {
        visible = false;
    }

    public boolean isVisible() {
        return visible;
    }
}
