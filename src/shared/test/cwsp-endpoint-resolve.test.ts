/*
 * Filename: cwsp-endpoint-resolve.test.ts
 * FullPath: modules/projects/cwsp-shared/test/cwsp-endpoint-resolve.test.ts
 * Change date and time: 23.05.00_23.07.2026
 * Reason for changes: Multi-hub relay lists (`;` / `,`) must not corrupt into
 *   `https://…;https::8434` via stripProtocol split("/").
 */

import assert from "node:assert/strict";
import test from "node:test";

import {
    migrateLegacyCwspPublicPort,
    normalizeProbeHttpsOrigin,
    parseConnectHostInput,
    resolveConnectHostToOrigin,
    splitConnectHostList,
} from "../src/cwsp-endpoint-resolve.ts";

test("splitConnectHostList accepts comma and semicolon", () => {
    assert.deepEqual(
        splitConnectHostList("https://192.168.0.200:8434;https://45.147.121.152:8434"),
        ["https://192.168.0.200:8434", "https://45.147.121.152:8434"],
    );
    assert.deepEqual(
        splitConnectHostList("https://192.168.0.200:8434, https://45.147.121.152:8434"),
        ["https://192.168.0.200:8434", "https://45.147.121.152:8434"],
    );
});

test("normalizeProbeHttpsOrigin keeps multi-hub list intact", () => {
    const multi = "https://192.168.0.200:8434;https://45.147.121.152:8434";
    assert.equal(normalizeProbeHttpsOrigin(multi), multi);
    assert.equal(
        normalizeProbeHttpsOrigin("https://192.168.0.200:8434,https://45.147.121.152:8434"),
        multi,
    );
});

test("migrateLegacyCwspPublicPort repairs corrupted https::8434 segment", () => {
    assert.equal(
        migrateLegacyCwspPublicPort("https://192.168.0.200:8434;https://https::8434"),
        "https://192.168.0.200:8434",
    );
    assert.equal(
        migrateLegacyCwspPublicPort("https://192.168.0.200:8434;https"),
        "https://192.168.0.200:8434",
    );
    assert.equal(migrateLegacyCwspPublicPort("https:"), "");
});

test("parseConnectHostInput does not eat second URL via slash split", () => {
    const parsed = parseConnectHostInput(
        "https://192.168.0.200:8434;https://45.147.121.152:8434",
    );
    assert.ok(parsed);
    assert.equal(parsed!.host, "192.168.0.200");
    assert.equal(parsed!.port, "8434");
});

test("resolveConnectHostToOrigin keeps multi-hub fallbacks on save", async () => {
    const multi = "https://192.168.0.200:8434;https://45.147.121.152:8434";
    assert.equal(
        await resolveConnectHostToOrigin(multi, { discover: false }),
        multi,
    );
    assert.equal(
        await resolveConnectHostToOrigin(
            "https://192.168.0.200:8434, https://45.147.121.152:8434",
            { discover: false },
        ),
        multi,
    );
});
