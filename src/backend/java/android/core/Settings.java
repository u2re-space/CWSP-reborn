/*
 * Filename: Settings.java
 * FullPath: /home/u2re-dev/U2RE.space/apps/CWSP-reborn/src/backend/java/android/core/Settings.java
 * Change date and time: 16.42.00_10.07.2026
 * Reason for changes: Pass-II — SharedPreferences-backed settings get/patch with sibling-safe nested merge (parity with Node settings backend).
 *
 * WHY: package `core` matches this file's path relative to the Gradle
 * `src/backend/java/android` source root. Pending Pass-III: convert to a
 * Capacitor @CapacitorPlugin and align namespace to space.u2re.cwsp.*.
 *
 * INVARIANT: patching a nested object never drops sibling keys already persisted;
 * delegation to {@link Merge#mergeSettingsPatch} keeps this aligned with the Node
 * settings backend and `modules/views/settings-view`.
 *
 * SECURITY: never store secrets (tokens / passwords / keys) in SharedPreferences
 * plaintext; route them through Android Keystore or private config. This bridge
 * only mirrors non-secret CWSP settings.
 */

package core;

import android.content.Context;
import android.content.SharedPreferences;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * SharedPreferences-backed settings bridge for the CWSP Android contour.
 *
 * <p>Stores the whole settings blob as a single JSON string under
 * {@link #PREF_KEY_BLOB} so nested-map sibling merge survives the
 * SharedPreferences flat key/value model.</p>
 *
 * <p>Usable without Capacitor plugin annotations: plain Android SDK types only
 * ({@code android.content.Context}, {@code android.content.SharedPreferences}).</p>
 */
public class Settings {

    /** SharedPreferences file name for the CWSP settings blob. */
    public static final String PREFS_NAME = "cwsp_settings";
    /** Single key holding the serialized settings blob (JSON). */
    public static final String PREF_KEY_BLOB = "blob";

    private final SharedPreferences prefs;
    private final String prefsName;

    /**
     * Construct with a Context; uses the default prefs file {@link #PREFS_NAME}.
     * Context is held via {@link Context#getApplicationContext()} to avoid leaking
     * Activity references from long-lived bridges.
     */
    public Settings(Context context) {
        this(context, PREFS_NAME);
    }

    /**
     * Construct with a Context and an explicit prefs file name.
     */
    public Settings(Context context, String prefsName) {
        if (context == null) {
            throw new IllegalArgumentException("Settings: context must not be null");
        }
        this.prefsName = prefsName != null ? prefsName : PREFS_NAME;
        this.prefs = context.getApplicationContext().getSharedPreferences(this.prefsName, Context.MODE_PRIVATE);
    }

    /** Read a single settings value by key, or null if absent. */
    public Object get(String key) {
        Map<String, Object> all = getAll();
        return all.get(key);
    }

    /** Read the entire settings map (snapshot, never null). */
    public Map<String, Object> getAll() {
        String raw = prefs.getString(PREF_KEY_BLOB, null);
        if (raw == null || raw.isEmpty()) {
            return new LinkedHashMap<>();
        }
        try {
            JSONObject obj = new JSONObject(raw);
            return fromJsonObject(obj);
        } catch (JSONException e) {
            // COMPAT: corrupt blob -> treat as empty so the app stays bootable.
            return new LinkedHashMap<>();
        }
    }

    /**
     * Apply a partial settings patch with sibling-safe nested merge.
     *
     * @return the merged snapshot after the patch was persisted
     */
    public Map<String, Object> patch(Map<String, Object> changes) {
        Map<String, Object> base = getAll();
        Map<String, Object> merged = (changes == null) ? base : Merge.mergeSettingsPatch(base, changes);
        try {
            JSONObject obj = toJsonObj(merged);
            prefs.edit().putString(PREF_KEY_BLOB, obj.toString()).apply();
        } catch (JSONException e) {
            // NOTE: serialization failure leaves the persisted blob unchanged; caller sees
            // the in-memory merged snapshot but persistence is skipped. Logcat in Pass-III.
        }
        return merged;
    }

    /** Clear a single key; returns true if something was removed. */
    public boolean clear(String key) {
        Map<String, Object> all = getAll();
        if (!all.containsKey(key)) {
            return false;
        }
        all.remove(key);
        try {
            prefs.edit().putString(PREF_KEY_BLOB, toJsonObj(all).toString()).apply();
            return true;
        } catch (JSONException e) {
            return false;
        }
    }

    /** Wipe the whole settings blob. */
    public void clearAll() {
        prefs.edit().remove(PREF_KEY_BLOB).apply();
    }

    /** Prefs file name in use (diagnostics). */
    public String prefsName() {
        return prefsName;
    }

    // ---- JSON <-> Map helpers (minSdk 23-safe; JSONObject.toMap() needs API 24) ----

    private static Map<String, Object> fromJsonObject(JSONObject obj) throws JSONException {
        Map<String, Object> out = new LinkedHashMap<>();
        for (java.util.Iterator<String> it = obj.keys(); it.hasNext(); ) {
            String k = it.next();
            out.put(k, fromJson(obj.get(k)));
        }
        return out;
    }

    private static List<Object> fromJsonArray(JSONArray arr) throws JSONException {
        List<Object> out = new ArrayList<>(arr.length());
        for (int i = 0; i < arr.length(); i++) {
            out.add(fromJson(arr.get(i)));
        }
        return out;
    }

    private static Object fromJson(Object v) throws JSONException {
        if (v == JSONObject.NULL) {
            return null;
        }
        if (v instanceof JSONObject) {
            return fromJsonObject((JSONObject) v);
        }
        if (v instanceof JSONArray) {
            return fromJsonArray((JSONArray) v);
        }
        return v; // String / Number / Boolean
    }

    private static JSONObject toJsonObj(Map<String, Object> map) throws JSONException {
        JSONObject obj = new JSONObject();
        for (Map.Entry<String, Object> e : map.entrySet()) {
            obj.put(e.getKey(), toJson(e.getValue()));
        }
        return obj;
    }

    @SuppressWarnings("unchecked")
    private static Object toJson(Object v) throws JSONException {
        if (v == null) {
            return JSONObject.NULL;
        }
        if (v instanceof Map) {
            return toJsonObj((Map<String, Object>) v);
        }
        if (v instanceof List) {
            JSONArray arr = new JSONArray();
            for (Object o : (List<Object>) v) {
                arr.put(toJson(o));
            }
            return arr;
        }
        return v; // String / Number / Boolean
    }
}
