/*
 * Filename: JsonMaps.java
 * FullPath: apps/CWSP-reborn/src/backend/java/space/u2re/cwsp/JsonMaps.java
 * Change date and time: 18.35.00_10.07.2026
 * Reason for changes: Map ↔ JSObject helpers for Capacitor plugin IPC.
 */

package space.u2re.cwsp;

import com.getcapacitor.JSArray;
import com.getcapacitor.JSObject;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/** Convert between Java maps and Capacitor {@link JSObject} trees. */
public final class JsonMaps {
    private JsonMaps() {}

    public static JSObject toJSObject(Map<String, Object> map) {
        JSObject out = new JSObject();
        if (map == null) return out;
        for (Map.Entry<String, Object> e : map.entrySet()) {
            out.put(e.getKey(), toJsonValue(e.getValue()));
        }
        return out;
    }

    public static Map<String, Object> fromJSObject(JSObject obj) {
        Map<String, Object> out = new LinkedHashMap<>();
        if (obj == null) return out;
        Iterator<String> keys = obj.keys();
        while (keys.hasNext()) {
            String k = keys.next();
            out.put(k, fromJsonValue(obj.opt(k)));
        }
        return out;
    }

    public static Map<String, Object> fromJSONObject(JSONObject obj) throws JSONException {
        Map<String, Object> out = new LinkedHashMap<>();
        if (obj == null) return out;
        Iterator<String> keys = obj.keys();
        while (keys.hasNext()) {
            String k = keys.next();
            out.put(k, fromJsonValue(obj.get(k)));
        }
        return out;
    }

    @SuppressWarnings("unchecked")
    private static Object toJsonValue(Object v) {
        if (v == null) return JSONObject.NULL;
        if (v instanceof Map) return toJSObject((Map<String, Object>) v);
        if (v instanceof List) {
            JSArray arr = new JSArray();
            for (Object o : (List<?>) v) {
                arr.put(toJsonValue(o));
            }
            return arr;
        }
        return v;
    }

    private static Object fromJsonValue(Object v) {
        if (v == null || v == JSONObject.NULL) return null;
        if (v instanceof JSObject) return fromJSObject((JSObject) v);
        if (v instanceof JSONObject) {
            try {
                return fromJSONObject((JSONObject) v);
            } catch (JSONException e) {
                return null;
            }
        }
        if (v instanceof JSONArray) {
            JSONArray arr = (JSONArray) v;
            List<Object> list = new ArrayList<>(arr.length());
            for (int i = 0; i < arr.length(); i++) {
                list.add(fromJsonValue(arr.opt(i)));
            }
            return list;
        }
        return v;
    }
}
