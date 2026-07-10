/*
 * Filename: ShareTarget.java
 * FullPath: /home/u2re-dev/U2RE.space/apps/CWSP-reborn/src/backend/java/android/emission/ShareTarget.java
 * Change date and time: 16.30.00_10.07.2026
 * Reason for changes: Pass-II fill: Android share-target emission scaffold stub.
 */

package emission;

/**
 * ShareTarget scaffold: receives android.intent.action.SEND payloads and
 * forwards them into the CWSP dispatch/clipboard contract. Placeholder.
 */
public class ShareTarget {

    private String lastSharedText = null;

    public void onShare(String text) {
        this.lastSharedText = text;
    }

    public String lastShared() {
        return lastSharedText;
    }
}
