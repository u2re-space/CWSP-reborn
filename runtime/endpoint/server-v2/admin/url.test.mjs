/*
 * Filename: url.test.mjs
 * FullPath: runtime/cwsp/endpoint/server-v2/admin/url.test.mjs
 * Change date and time: 14.02.00_17.07.2026
 * Reason for changes: Lock bare-host Endpoint URL normalization for admin Register/Rotate.
 */

import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

import { normalizeEndpointUrl } from "./url.mjs";

const ADMIN_DIR = path.dirname(fileURLToPath(import.meta.url));

test("normalizeEndpointUrl accepts absolute URLs and upgrades bare hosts", () => {
    assert.equal(
        normalizeEndpointUrl("https://192.168.0.200:8434", "https://example.test"),
        "https://192.168.0.200:8434"
    );
    assert.equal(
        normalizeEndpointUrl("http://localhost:6065", "https://example.test"),
        "http://localhost:6065"
    );
    // Bare host (no port) must inherit the admin page port — CWSP listens on :8434, not :443.
    assert.equal(
        normalizeEndpointUrl("45.147.121.152", "https://192.168.0.200:8434/"),
        "https://45.147.121.152:8434"
    );
    assert.equal(
        normalizeEndpointUrl("45.147.121.152:8434", "https://192.168.0.200:8434/"),
        "https://45.147.121.152:8434"
    );
    assert.equal(
        normalizeEndpointUrl("192.168.0.200:8434", "http://localhost:6065/"),
        "http://192.168.0.200:8434"
    );
    assert.equal(
        normalizeEndpointUrl("hostname.local", "https://gateway.example/"),
        "https://hostname.local"
    );
    assert.equal(
        normalizeEndpointUrl("", "https://192.168.0.200:8434"),
        "https://192.168.0.200:8434"
    );
});

test("normalizeEndpointUrl produces a valid URL base for register paths", () => {
    const base = normalizeEndpointUrl("45.147.121.152", "https://192.168.0.200:8434/");
    assert.equal(
        new URL("/core/auth/register", base).toString(),
        "https://45.147.121.152:8434/core/auth/register"
    );
});

test("admin password fields live in single-action forms", async () => {
    const markup = await readFile(path.join(ADMIN_DIR, "index.html"), "utf8");
    assert.match(markup, /id="admin-access-form"/);
    assert.match(markup, /id="admin-ai-form"/);
    assert.match(markup, /id="admin-upstream-form"/);
    assert.match(markup, /id="admin-storage-form"/);
    assert.doesNotMatch(markup, /id="admin-form"/);

    const passwordCount = (markup.match(/type="password"/g) || []).length;
    assert.equal(passwordCount, 6);

    for (const formId of ["admin-access-form", "admin-ai-form", "admin-upstream-form", "admin-storage-form"]) {
        const formMatch = markup.match(new RegExp(`<form\\b[^>]*id="${formId}"[\\s\\S]*?<\\/form>`));
        assert.ok(formMatch, `missing form ${formId}`);
        assert.match(formMatch[0], /type="password"/);
    }
});
