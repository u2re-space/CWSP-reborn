/*
 * Filename: ControlServerTest.java
 * FullPath: apps/CWSP-reborn/test/java/backend/space/u2re/cwsp/backend/test/ControlServerTest.java
 * Change date and time: 16.42.00_10.07.2026
 * Reason for changes: Pass-II — prove Java control RPC round-trip and 401 without key.
 */

package space.u2re.cwsp.backend.test;

import space.u2re.cwsp.backend.control.ControlServer;
import space.u2re.cwsp.backend.json.Json;
import space.u2re.cwsp.backend.settings.SettingsStore;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.Duration;
import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Behavioral parity with Node WebNative control RPC tests.
 * SECURITY: when a control key is configured, missing X-API-Key must yield 401.
 */
public final class ControlServerTest {

    private ControlServerTest() {}

    public static void main(String[] args) throws Exception {
        Path dir = Files.createTempDirectory("cwsp-java-control-");
        Path filePath = dir.resolve("portable.config.json");
        SettingsStore backend = new SettingsStore(filePath);

        ControlServer.Options options = new ControlServer.Options();
        options.store = backend;
        options.port = 0;
        options.controlKey = "test-key-not-a-secret";
        options.useEnvKey = false;

        try (ControlServer control = new ControlServer(options)) {
            HttpClient client = HttpClient.newBuilder().connectTimeout(Duration.ofSeconds(5)).build();
            String base = "http://127.0.0.1:" + control.getPort() + "/service/config";

            HttpRequest get = HttpRequest.newBuilder(URI.create(base))
                    .timeout(Duration.ofSeconds(5))
                    .header(ControlServer.HEADER_API_KEY, control.auth().key())
                    .GET()
                    .build();
            HttpResponse<String> getRes = client.send(get, HttpResponse.BodyHandlers.ofString());
            SettingsStoreTest.assertEq(200, getRes.statusCode());
            Map<String, Object> got = Json.parseObject(getRes.body());
            SettingsStoreTest.assertEq("endpoint", SettingsStoreTest.dig(asMap(got.get("settings")), "core", "mode"));

            Map<String, Object> postBody = new LinkedHashMap<>();
            Map<String, Object> core = new LinkedHashMap<>();
            Map<String, Object> ops = new LinkedHashMap<>();
            ops.put("logLevel", "debug");
            core.put("ops", ops);
            postBody.put("core", core);

            HttpRequest post = HttpRequest.newBuilder(URI.create(base))
                    .timeout(Duration.ofSeconds(5))
                    .header(ControlServer.HEADER_API_KEY, control.auth().key())
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(Json.stringifyCompact(postBody)))
                    .build();
            HttpResponse<String> postRes = client.send(post, HttpResponse.BodyHandlers.ofString());
            SettingsStoreTest.assertEq(200, postRes.statusCode());
            Map<String, Object> posted = Json.parseObject(postRes.body());
            SettingsStoreTest.assertEq(true, posted.get("ok"));
            SettingsStoreTest.assertEq(
                    "debug",
                    SettingsStoreTest.dig(asMap(posted.get("settings")), "core", "ops", "logLevel")
            );
            SettingsStoreTest.assertEq(
                    "endpoint",
                    SettingsStoreTest.dig(asMap(posted.get("settings")), "core", "mode")
            );

            HttpRequest unauthorized = HttpRequest.newBuilder(URI.create(base))
                    .timeout(Duration.ofSeconds(5))
                    .GET()
                    .build();
            HttpResponse<String> unauthRes = client.send(unauthorized, HttpResponse.BodyHandlers.ofString());
            SettingsStoreTest.assertEq(401, unauthRes.statusCode(), "401 without key when key configured");

            System.out.println("OK ControlServerTest");
        } finally {
            SettingsStoreTest.deleteRecursive(dir);
        }
    }

    @SuppressWarnings("unchecked")
    private static Map<String, Object> asMap(Object value) {
        if (value instanceof Map<?, ?> map) {
            return (Map<String, Object>) map;
        }
        throw new AssertionError("expected map, got " + value);
    }
}
