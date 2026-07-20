#!/usr/bin/env node
/*
 * Filename: validate-control-pairing.mjs
 * FullPath: apps/CWSP-reborn/scripts/validate-control-pairing.mjs
 * Change date and time: 20.00.00_20.07.2026
 * Reason for changes: Static checks for Control pairing attestation contracts.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const must = (cond, msg) => {
    if (!cond) {
        console.error("FAIL:", msg);
        process.exit(1);
    }
};

const read = (rel) => fs.readFileSync(path.join(root, rel), "utf8");

const api = read("src/backend/java/space/u2re/cwsp/ControlApiServer.java");
must(api.includes("/service/pair/begin"), "pair/begin route");
must(api.includes("/service/pair/hello"), "pair/hello route");
must(api.includes("/service/pair/status"), "pair/status route");
must(api.includes("X-Control-Session") || api.includes("x-control-session"), "session header auth");
must(api.includes("ControlSecrets.redactSecrets"), "GET redact");
must(api.includes("ControlSecrets.extractAndStoreToken"), "POST strip secrets");
must(api.includes("DEFAULT_ALLOWED_ORIGINS"), "origin allowlist");
must(api.includes("ControlRotatingCode.verify"), "pair/begin verifies rotating deviceCode");
must(api.includes("ControlPublicToken.matches"), "pair/begin verifies publicToken");
must(api.includes("deviceCodePeriodMs"), "hello advertises period");
must(!/return constantTimeEquals\(expected, incoming\);\s*\n\s*\}/.test(api) || api.includes("isLoopbackOrCapacitorOrigin"),
    "bearer limited to loopback");

const rot = read("src/backend/java/space/u2re/cwsp/ControlRotatingCode.java");
must(rot.includes("PERIOD_MS = 20_000"), "20s period");
must(rot.includes("PREVIOUS_GRACE_MS = 10_000"), "Java previous-code grace ~10s");
must(rot.includes("cwsp-ctrl-v1|"), "HMAC domain string");
must(rot.includes("HmacSHA256"), "HMAC-SHA256");

const store = read("src/backend/java/space/u2re/cwsp/ControlPairStore.java");
must(store.includes("SESSION_TTL_MS = 60 * 60_000"), "session TTL ≤ 1h");
must(store.includes("SESSION_TTL_PERSISTENT_MS"), "CRX persistent session TTL");
must(store.includes("isChromeExtensionOrigin"), "Java chrome-extension origin helper");
must(store.includes("allowBegin"), "rate limit");

must(api.includes("isChromeExtensionOrigin"), "Java CORS allows chrome-extension");

const pub = read("src/backend/java/space/u2re/cwsp/ControlPublicToken.java");
must(pub.includes("cwsp-pub-"), "public token prefix");
must(pub.includes("regenerate"), "public token regenerate");

const ui = read("src/backend/java/space/u2re/cwsp/ControlPairUi.java");
must(ui.includes("Accept"), "Accept action");
must(ui.includes("Deny"), "Deny action");

const nodeCtrl = read("src/backend/node/shared/neutralino/control.ts");
must(nodeCtrl.includes("/service/pair/begin"), "Neutralino pair/begin");
must(nodeCtrl.includes("verifyDeviceCode"), "Neutralino verifies deviceCode");
must(nodeCtrl.includes("X-Control-Session") || nodeCtrl.includes("x-control-session"), "Neutralino session auth");

const nodeAtt = read("src/backend/node/shared/neutralino/control-attestation.ts");
must(nodeAtt.includes("CONTROL_CODE_PERIOD_MS = 20_000"), "Node 20s period");
must(nodeAtt.includes("CONTROL_CODE_PREVIOUS_GRACE_MS = 10_000"), "Node previous-code grace ~10s");
must(nodeAtt.includes("cwsp-ctrl-v1|"), "Node HMAC domain");

const pairTs = read("src/frontend/web/cwsp-control/web/control-pairing.ts");
must(pairTs.includes("ensureControlSession"), "SPA ensure session");
must(pairTs.includes("verifyControlSessionAuthorized"), "SPA verifies /service/config before live");
must(pairTs.includes("deviceCode"), "SPA sends deviceCode");
must(pairTs.includes("publicToken"), "SPA sends publicToken");
must(pairTs.includes("showControlPairModal") || read("src/frontend/web/cwsp-control/web/control-pair-modal.ts").includes("showControlPairModal"), "SPA pairing modal");
must(pairTs.includes("sessionStorage"), "session in sessionStorage not localStorage token");

const entryTs = read("src/frontend/web/cwsp-control/web/entry.ts");
must(entryTs.includes("hydrate unauthorized") || entryTs.includes("hydrated.ok"), "boot gates on hydrate ok");
must(entryTs.includes('return "web"') || entryTs.includes("publicHttps"), "public SPA surface stays web");

const nodeAtt2 = read("src/backend/node/shared/neutralino/control-attestation.ts");
must(nodeAtt2.includes("CONTROL_SESSION_TTL_MS = 60 * 60_000"), "Node session ≤ 1h");
must(nodeAtt2.includes("CONTROL_SESSION_TTL_PERSISTENT_MS"), "Node CRX persistent TTL");
must(nodeAtt2.includes("isChromeExtensionOrigin"), "Node chrome-extension origin helper");
must(nodeAtt2.includes("defaultSessionsPath"), "Node sessions file path");
must(nodeAtt2.includes("peekControlSession"), "Node Origin-less session peek");
must(nodeAtt2.includes("matchesControlPublicToken"), "Node public token verify");

const nodeCtrl2 = read("src/backend/node/shared/neutralino/control.ts");
must(nodeCtrl2.includes("sessionsFile") || nodeCtrl2.includes("defaultSessionsPath"), "Neutralino loads session file");
must(
    nodeCtrl2.includes("authOrigin") && nodeCtrl2.includes("x-control-origin"),
    "Neutralino authOrigin / X-Control-Origin"
);

const conn = read("src/frontend/web/cwsp-control/web/connection-source.ts");
must(conn.includes("X-Control-Session"), "bridgeFetch session header");
must(conn.includes("/service/pair/hello"), "probe hello");
must(conn.includes("never send ecosystem") || conn.includes("never sends ecosystem"), "no token comment/path");

const disc = read("src/frontend/web/cwsp-control/web/control-discovery.ts");
must(!disc.includes("controlKey") || disc.includes("ignore controlKey"), "no query secret inject");
must(disc.includes("androidReachable"), "androidReachable flag");
must(disc.includes("neutralinoReachable"), "neutralinoReachable flag");

const entry = read("src/frontend/web/cwsp-control/web/entry.ts");
must(entry.includes("ensureControlSession"), "boot pairs Control");

const fgs = read("src/backend/java/space/u2re/cwsp/CwspBridgeService.java");
must(fgs.includes("ControlRotatingCode.currentCode"), "FGS shows rotating code");

const manifest = read("app/android/AndroidManifest.xml");
must(manifest.includes("ControlPairActivity"), "manifest activity");
must(manifest.includes("CONTROL_PAIR_ACCEPT"), "manifest actions");

console.log("OK: Control pairing + rotating deviceCode contracts validated");
