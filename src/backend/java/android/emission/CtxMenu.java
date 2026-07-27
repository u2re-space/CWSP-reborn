/*
 * Filename: CtxMenu.java
 * FullPath: /home/u2re-dev/U2RE.space/apps/CWSP-reborn/src/backend/java/android/emission/CtxMenu.java
 * Change date and time: 16.30.00_10.07.2026
 * Reason for changes: Pass-II fill: context-menu emission scaffold stub.
 */

package emission;

import java.util.ArrayList;
import java.util.List;

/**
 * CtxMenu scaffold: emits a context-menu item list for the AirPad surface.
 * Placeholder until Pass-III wires the shared view contract.
 */
public class CtxMenu {

    private final List<String> items = new ArrayList<>();

    public void addItem(String label) {
        items.add(label);
    }

    public List<String> items() {
        return new ArrayList<>(items);
    }
}
