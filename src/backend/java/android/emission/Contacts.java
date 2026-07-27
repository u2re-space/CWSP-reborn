/*
 * Filename: Contacts.java
 * FullPath: /home/u2re-dev/U2RE.space/apps/CWSP-reborn/src/backend/java/android/emission/Contacts.java
 * Change date and time: 16.30.00_10.07.2026
 * Reason for changes: Pass-II fill: contacts emission scaffold stub (sms/contact contract).
 */

package emission;

/**
 * Contacts scaffold: emits contact payloads for the CWSP sms:send / contact
 * contract. Pending Pass-III: android.provider.ContactsContract wiring.
 */
public class Contacts {

    private String id;
    private String displayName;

    public void set(String id, String displayName) {
        this.id = id;
        this.displayName = displayName;
    }

    public String getId() { return id; }
    public String getDisplayName() { return displayName; }
}
