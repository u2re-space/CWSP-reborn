import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { mkdir, mkdtemp, readFile, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import fastify from "fastify";

import { createScryptHash, verifyScryptHash } from "./gateway/crypto.ts";
import {
    classifyGatewayRequestSource,
    classifyGatewaySource,
    isGatewayAuthRequired,
    resolveGatewayConfig
} from "./gateway/config.ts";
import { registerGatewayHttp } from "./gateway/index.ts";
import { createGatewaySessionStore } from "./gateway/session.ts";
import { registerAssetsHttpHandlers } from "./handlers/assets.ts";
import { registerSettingsHttpHandlers } from "./handlers/settings.ts";

test("verifies an encoded scrypt hash without accepting a wrong PIN", async () => {
    const encoded = await createScryptHash("correct-pin");

    assert.equal(await verifyScryptHash("correct-pin", encoded), true);
    assert.equal(await verifyScryptHash("wrong-pin", encoded), false);
});

test("classifies private and public source addresses safely", () => {
    const config = resolveGatewayConfig({}, {
        CWS_GATEWAY_PIN_HASH: "configured-hash"
    });

    assert.equal(classifyGatewaySource("192.168.1.8", config), "lan");
    assert.equal(classifyGatewaySource("127.0.0.1", config), "lan");
    assert.equal(classifyGatewaySource("45.147.121.152", config), "wan");
    assert.equal(classifyGatewaySource("not-an-ip", config), "wan");
    // Hairpin NAT: private TCP peer + public Host must stay WAN-protected.
    assert.equal(
        classifyGatewayRequestSource("192.168.0.1", "45.147.121.152:8434", config),
        "wan"
    );
    assert.equal(
        classifyGatewayRequestSource("192.168.0.1", "192.168.0.200:8434", config),
        "lan"
    );
});

test("WAN remains protected while LAN follows the configured policy", () => {
    assert.equal(isGatewayAuthRequired("wan", "off"), true);
    assert.equal(isGatewayAuthRequired("lan", "off"), false);
    assert.equal(isGatewayAuthRequired("lan", "optional"), false);
    assert.equal(isGatewayAuthRequired("lan", "required"), true);
});

test("environment policy overrides portable gateway policy", () => {
    const config = resolveGatewayConfig(
        {
            gateway: {
                auth: {
                    lanPolicy: "required",
                    trustedCidrs: ["10.0.0.0/8"]
                }
            }
        },
        {
            CWS_GATEWAY_PIN_HASH: "configured-hash",
            CWS_GATEWAY_LAN_POLICY: "off"
        }
    );

    assert.equal(config.pinHash, "configured-hash");
    assert.equal(config.lanPolicy, "off");
    assert.deepEqual(config.trustedCidrs, ["10.0.0.0/8"]);
});

test("session rotation invalidates the old token and expiry invalidates the new token", () => {
    let now = 1_000;
    const sessions = createGatewaySessionStore(
        {
            idleMs: 30 * 60 * 1000,
            absoluteMs: 24 * 60 * 60 * 1000,
            rememberMs: 7 * 24 * 60 * 60 * 1000
        },
        () => now
    );

    const first = sessions.issue("wan", false);
    const second = sessions.rotate(first.token, "wan", false);

    assert.ok(second);
    assert.equal(sessions.get(first.token), null);
    assert.equal(sessions.get(second!.token)?.sourceClass, "wan");

    now += 31 * 60 * 1000;
    assert.equal(sessions.get(second!.token), null);
});

test("gateway auth is scoped and does not turn a UI cookie into transport auth", async () => {
    const webRoot = await mkdtemp(path.join(os.tmpdir(), "cwsp-gateway-"));
    await writeFile(path.join(webRoot, "index.html"), "<!doctype html><title>Gateway</title>");
    const pinHash = await createScryptHash("correct-pin");
    const app = fastify();

    await registerGatewayHttp(app, {
        runtimeContext: {
            engine: {
                config: {},
                profile: {},
                storage: {
                    async readCoreSettings() {
                        return {};
                    },
                    async writeCoreSettings(next: Record<string, unknown>) {
                        return next;
                    }
                }
            },
            selfId: "L-192.168.0.200",
            sockets: {
                getStatus: () => ({}),
                getConnectedPeerProfiles: () => [],
                dispatchPacket: () => true
            }
        },
        config: resolveGatewayConfig({
            gateway: {
                auth: {
                    pinHash,
                    lanPolicy: "required"
                }
            }
        }),
        webRoot
    });
    await registerAssetsHttpHandlers(app);
    await registerSettingsHttpHandlers(app);

    const loginAtRoot = await app.inject({
        method: "GET",
        url: "/"
    });
    assert.equal(loginAtRoot.statusCode, 200);
    assert.match(String(loginAtRoot.body), /gateway-login/);

    const legacyLoginAlias = await app.inject({
        method: "GET",
        url: "/gateway/login"
    });
    assert.equal(legacyLoginAlias.statusCode, 302);
    assert.equal(legacyLoginAlias.headers.location, "/");

    const protectedNetwork = await app.inject({
        method: "GET",
        url: "/network"
    });
    assert.equal(protectedNetwork.statusCode, 401);

    const session = await app.inject({
        method: "GET",
        url: "/gateway/auth/session"
    });
    assert.deepEqual(session.json().session, { authenticated: false });

    const login = await app.inject({
        method: "POST",
        url: "/gateway/auth/login",
        headers: {
            "content-type": "application/json",
            origin: "http://localhost"
        },
        payload: {
            pin: "correct-pin",
            remember: true
        }
    });
    assert.equal(login.statusCode, 200);
    const setCookie = String(login.headers["set-cookie"] || "");
    assert.match(setCookie, /HttpOnly/i);
    assert.match(setCookie, /Secure/i);
    assert.match(setCookie, /SameSite=Lax/i);
    assert.match(setCookie, /Path=\//i);

    const authenticatedPage = await app.inject({
        method: "GET",
        url: "/",
        headers: {
            cookie: setCookie.split(";")[0]
        }
    });
    assert.equal(authenticatedPage.statusCode, 200);

    const legacyCss = await app.inject({
        method: "GET",
        url: "/admin/index.css",
        headers: {
            cookie: setCookie.split(";")[0]
        }
    });
    assert.equal(legacyCss.statusCode, 200);
    assert.match(String(legacyCss.headers["content-type"]), /text\/css/);

    const legacyScript = await app.inject({
        method: "GET",
        url: "/admin/index.mjs",
        headers: {
            cookie: setCookie.split(";")[0]
        }
    });
    assert.equal(legacyScript.statusCode, 200);
    assert.match(String(legacyScript.headers["content-type"]), /javascript/);

    const legacyUrlHelper = await app.inject({
        method: "GET",
        url: "/admin/url.mjs",
        headers: {
            cookie: setCookie.split(";")[0]
        }
    });
    assert.equal(legacyUrlHelper.statusCode, 200);
    assert.match(String(legacyUrlHelper.headers["content-type"]), /javascript/);
    assert.match(String(legacyUrlHelper.body), /normalizeEndpointUrl/);

    const legacyMarkup = await readFile(path.resolve("server-v2/admin/index.html"), "utf8");
    assert.match(legacyMarkup, /<form\b[^>]*id="admin-access-form"/);
    assert.match(legacyMarkup, /<form\b[^>]*id="admin-access-form"[\s\S]*type="password"[\s\S]*<\/form>/);
    assert.doesNotMatch(legacyMarkup, /id="admin-form"/);

    const logoutWithoutOrigin = await app.inject({
        method: "POST",
        url: "/gateway/auth/logout",
        headers: {
            cookie: setCookie.split(";")[0]
        }
    });
    assert.equal(logoutWithoutOrigin.statusCode, 403);

    const logout = await app.inject({
        method: "POST",
        url: "/gateway/auth/logout",
        headers: {
            cookie: setCookie.split(";")[0],
            origin: "http://localhost"
        }
    });
    assert.equal(logout.statusCode, 200);

    const wsLike = await app.inject({
        method: "GET",
        url: "/ws",
        headers: {
            cookie: setCookie.split(";")[0]
        }
    });
    assert.notEqual(wsLike.statusCode, 401);

    for (let attempt = 0; attempt < 5; attempt += 1) {
        const invalid = await app.inject({
            method: "POST",
            url: "/gateway/auth/login",
            headers: {
                "content-type": "application/json"
            },
            payload: {
                pin: "wrong-pin"
            }
        });
        assert.equal(invalid.statusCode, 401);
    }
    const rateLimited = await app.inject({
        method: "POST",
        url: "/gateway/auth/login",
        headers: {
            "content-type": "application/json"
        },
        payload: {
            pin: "wrong-pin"
        }
    });
    assert.equal(rateLimited.statusCode, 429);

    const legacyAdmin = await app.inject({
        method: "GET",
        url: "/admin"
    });
    assert.equal(legacyAdmin.statusCode, 401);

    const legacyPrefs = await app.inject({
        method: "GET",
        url: "/core/admin/prefs"
    });
    assert.equal(legacyPrefs.statusCode, 401);

    const machineSettings = await app.inject({
        method: "GET",
        url: "/core/user/settings?userId=unknown&userKey=unknown"
    });
    assert.notEqual(machineSettings.statusCode, 401);
});

test("gateway BFF prefills session settings and still redacts topology secrets", async () => {
    const webRoot = await mkdtemp(path.join(os.tmpdir(), "cwsp-gateway-bff-"));
    await writeFile(path.join(webRoot, "index.html"), "<!doctype html><title>Gateway</title>");
    const pinHash = await createScryptHash("correct-pin");
    let persistedSettings: Record<string, unknown> = {
        core: {
            mode: "endpoint",
            bridge: {
                userKey: "private-token"
            }
        },
        ai: {
            baseUrl: "https://api.openai.com/v1",
            model: "gpt-5.4",
            apiKey: "sk-test-saved"
        }
    };
    let dispatchedPacket: Record<string, unknown> | null = null;
    const app = fastify();

    await registerGatewayHttp(app, {
        runtimeContext: {
            engine: {
                config: {
                    bridge: {
                        endpoints: ["https://45.147.121.152:8434/"],
                        allowInsecureTls: true
                    },
                    topology: {
                        enabled: true,
                        nodes: [{ id: "L-192.168.0.110" }],
                        links: []
                    },
                    endpointIDs: {
                        "L-192.168.0.110": {
                            origins: ["192.168.0.110"],
                            userKey: "private-token"
                        }
                    }
                },
                profile: {
                    httpsPort: 8434
                },
                storage: {
                    async readCoreSettings() {
                        return structuredClone(persistedSettings);
                    },
                    async writeCoreSettings(next: Record<string, unknown>) {
                        persistedSettings = structuredClone(next);
                        return structuredClone(persistedSettings);
                    }
                }
            },
            selfId: "L-192.168.0.200",
            sockets: {
                getStatus: () => ({ socketio: { connected: 1 } }),
                getConnectedPeerProfiles: () => [{ id: "L-192.168.0.110" }],
                dispatchPacket: (packet) => {
                    dispatchedPacket = packet;
                    return true;
                }
            }
        },
        config: resolveGatewayConfig({
            gateway: {
                auth: {
                    pinHash,
                    lanPolicy: "required"
                }
            }
        }),
        webRoot
    });

    const login = await app.inject({
        method: "POST",
        url: "/gateway/auth/login",
        headers: {
            "content-type": "application/json",
            origin: "http://localhost"
        },
        payload: {
            pin: "correct-pin"
        }
    });
    const cookieHeader = String(login.headers["set-cookie"] || "");
    const cookie = cookieHeader.split(";")[0];
    const headers = {
        cookie,
        origin: "http://localhost"
    };

    const settings = await app.inject({
        method: "GET",
        url: "/gateway/api/settings"
    });
    assert.equal(settings.statusCode, 401);

    const authenticatedSettings = await app.inject({
        method: "GET",
        url: "/gateway/api/settings",
        headers
    });
    assert.equal(authenticatedSettings.statusCode, 200);
    const settingsBody = authenticatedSettings.json().settings;
    assert.equal(settingsBody.core.mode, "endpoint");
    // WHY: authenticated Settings UI must see saved secrets to prefill fields.
    assert.equal(settingsBody.core.bridge.userKey, "private-token");
    assert.equal(settingsBody.ai.apiKey, "sk-test-saved");
    assert.equal(settingsBody.core.endpointUrl, "https://45.147.121.152:8434/");
    assert.equal(settingsBody.core.userId, "L-192.168.0.200");
    assert.equal(settingsBody.core.allowInsecureTls, true);

    const patch = await app.inject({
        method: "PATCH",
        url: "/gateway/api/settings",
        headers: {
            ...headers,
            "content-type": "application/json"
        },
        payload: {
            core: {
                mode: "server",
                endpointUrl: "https://192.168.0.200:8434/"
            },
            ai: {
                apiKey: "sk-updated"
            }
        }
    });
    assert.equal(patch.statusCode, 200);
    assert.equal((persistedSettings.core as Record<string, unknown>).mode, "server");
    assert.equal((persistedSettings.ai as Record<string, unknown>).apiKey, "sk-updated");
    assert.equal(patch.json().settings.ai.apiKey, "sk-updated");
    assert.equal(patch.json().settings.core.endpointUrl, "https://192.168.0.200:8434/");

    const status = await app.inject({
        method: "GET",
        url: "/gateway/api/network/status",
        headers
    });
    assert.equal(status.statusCode, 200);
    assert.equal(status.json().profile.httpsPort, 8434);
    assert.equal(status.json().peers[0].id, "L-192.168.0.110");

    const topology = await app.inject({
        method: "GET",
        url: "/gateway/api/topology",
        headers
    });
    assert.equal(topology.statusCode, 200);
    assert.equal(topology.json().endpointIDs["L-192.168.0.110"].userKey, "[redacted]");

    const action = await app.inject({
        method: "POST",
        url: "/gateway/api/action",
        headers: {
            ...headers,
            "content-type": "application/json"
        },
        payload: {
            what: "mouse:move",
            purpose: "mouse",
            destinations: ["L-192.168.0.110"],
            payload: {
                x: 1,
                y: -2
            }
        }
    });
    assert.equal(action.statusCode, 202);
    assert.equal(dispatchedPacket?.op, "act");
    assert.deepEqual(dispatchedPacket?.nodes, ["L-192.168.0.110"]);
    assert.equal(dispatchedPacket?.byId, "L-192.168.0.200");

    const wildcard = await app.inject({
        method: "POST",
        url: "/gateway/api/action",
        headers: {
            ...headers,
            "content-type": "application/json"
        },
        payload: {
            what: "clipboard:update",
            purpose: "clipboard",
            destinations: ["*"],
            payload: {
                text: "not allowed"
            }
        }
    });
    assert.equal(wildcard.statusCode, 400);

    const arbitraryUrl = await app.inject({
        method: "POST",
        url: "/gateway/api/action",
        headers: {
            ...headers,
            "content-type": "application/json"
        },
        payload: {
            what: "clipboard:update",
            purpose: "clipboard",
            destinations: ["L-192.168.0.110"],
            payload: {
                url: "https://example.invalid/forward"
            }
        }
    });
    assert.equal(arbitraryUrl.statusCode, 400);

    const missingOrigin = await app.inject({
        method: "PATCH",
        url: "/gateway/api/settings",
        headers: {
            cookie,
            "content-type": "application/json"
        },
        payload: {
            core: {
                mode: "endpoint"
            }
        }
    });
    assert.equal(missingOrigin.statusCode, 403);
});

test("gateway login accepts registered admin users as well as the shared PIN", async () => {
    const { registerUser } = await import("../../auth/users.ts");
    const registered = await registerUser("gw-user-login", false, "gw-user-secret");
    const pinHash = await createScryptHash("shared-operator-pin");
    const webRoot = await mkdtemp(path.join(os.tmpdir(), "cwsp-gateway-users-"));
    await writeFile(path.join(webRoot, "index.html"), "<!doctype html><title>Gateway</title>");

    const app = fastify();
    await registerGatewayHttp(app, {
        runtimeContext: {
            engine: {
                config: {},
                profile: {},
                storage: {
                    async readCoreSettings() {
                        return {};
                    },
                    async writeCoreSettings(next: Record<string, unknown>) {
                        return next;
                    }
                }
            },
            selfId: "L-192.168.0.200",
            sockets: {
                getStatus: () => ({}),
                getConnectedPeerProfiles: () => [],
                dispatchPacket: () => true
            }
        },
        config: resolveGatewayConfig({
            gateway: {
                auth: {
                    pinHash,
                    lanPolicy: "required"
                }
            }
        }),
        webRoot
    });

    const userLogin = await app.inject({
        method: "POST",
        url: "/gateway/auth/login",
        headers: {
            "content-type": "application/json",
            origin: "http://localhost"
        },
        payload: {
            userId: registered.userId,
            pin: registered.userKey,
            remember: true
        }
    });
    assert.equal(userLogin.statusCode, 200);
    assert.equal(userLogin.json().ok, true);
    assert.match(String(userLogin.headers["set-cookie"] || ""), /cwsp_gateway_session=/i);

    const pinLogin = await app.inject({
        method: "POST",
        url: "/gateway/auth/login",
        headers: {
            "content-type": "application/json",
            origin: "http://localhost"
        },
        payload: {
            pin: "shared-operator-pin"
        }
    });
    assert.equal(pinLogin.statusCode, 200);

    const wrongUser = await app.inject({
        method: "POST",
        url: "/gateway/auth/login",
        headers: {
            "content-type": "application/json",
            origin: "http://localhost"
        },
        payload: {
            userId: registered.userId,
            pin: "wrong-password"
        }
    });
    assert.equal(wrongUser.statusCode, 401);

    const loginMarkup = await app.inject({ method: "GET", url: "/" });
    assert.match(String(loginMarkup.body), /<select name="userId"/);
    assert.match(String(loginMarkup.body), new RegExp(`option value="${registered.userId}"`));
    assert.match(String(loginMarkup.body), /name="pin"/);
    assert.match(String(loginMarkup.body), /FUTURE: free-text User ID/);
});

test("root SPA serves the shell without /gateway in the browser path", async () => {
    const pinHash = await createScryptHash("correct-pin");
    const webRoot = await mkdtemp(path.join(os.tmpdir(), "cwsp-gateway-root-"));
    await writeFile(path.join(webRoot, "index.html"), "<!doctype html><title>Gateway</title>");
    await mkdir(path.join(webRoot, "assets"), { recursive: true });
    await writeFile(path.join(webRoot, "assets", "app.js"), "export default 1;");

    const app = fastify();
    await registerGatewayHttp(app, {
        runtimeContext: {
            engine: {
                config: {},
                profile: {},
                storage: {
                    async readCoreSettings() {
                        return {};
                    },
                    async writeCoreSettings(next: Record<string, unknown>) {
                        return next;
                    }
                }
            },
            selfId: "L-192.168.0.200",
            sockets: {
                getStatus: () => ({}),
                getConnectedPeerProfiles: () => [],
                dispatchPacket: () => true
            }
        },
        config: resolveGatewayConfig({
            gateway: {
                auth: {
                    pinHash,
                    lanPolicy: "required"
                }
            }
        }),
        webRoot
    });

    const anonymousRoot = await app.inject({
        method: "GET",
        url: "/",
        headers: { accept: "text/html" }
    });
    assert.equal(anonymousRoot.statusCode, 200);
    assert.match(String(anonymousRoot.body), /gateway-login/);

    const anonymousNetwork = await app.inject({
        method: "GET",
        url: "/network?shell=minimal",
        headers: { accept: "text/html" }
    });
    assert.equal(anonymousNetwork.statusCode, 302);
    assert.match(String(anonymousNetwork.headers.location), /^\/\?next=/);

    const legacyLoginPath = await app.inject({
        method: "GET",
        url: "/login",
        headers: { accept: "text/html" }
    });
    assert.equal(legacyLoginPath.statusCode, 302);
    assert.equal(legacyLoginPath.headers.location, "/");

    const login = await app.inject({
        method: "POST",
        url: "/gateway/auth/login",
        headers: {
            "content-type": "application/json",
            origin: "http://localhost"
        },
        payload: { pin: "correct-pin" }
    });
    const cookie = String(login.headers["set-cookie"] || "").split(";")[0];
    assert.match(String(login.headers["set-cookie"] || ""), /Path=\//i);

    const authedRoot = await app.inject({
        method: "GET",
        url: "/",
        headers: {
            accept: "text/html",
            cookie
        }
    });
    assert.equal(authedRoot.statusCode, 200);
    assert.match(String(authedRoot.body), /<title>Gateway<\/title>/);

    const authedNetwork = await app.inject({
        method: "GET",
        url: "/network?shell=minimal",
        headers: {
            accept: "text/html",
            cookie
        }
    });
    assert.equal(authedNetwork.statusCode, 200);
    assert.match(String(authedNetwork.body), /<title>Gateway<\/title>/);

    const legacyGatewayPrefix = await app.inject({
        method: "GET",
        url: "/gateway/",
        headers: {
            accept: "text/html",
            cookie
        }
    });
    assert.equal(legacyGatewayPrefix.statusCode, 302);
    assert.equal(legacyGatewayPrefix.headers.location, "/");

    const asset = await app.inject({
        method: "GET",
        url: "/assets/app.js",
        headers: { cookie }
    });
    assert.equal(asset.statusCode, 200);
    assert.match(String(asset.body), /export default 1/);
});

test("resolveGatewayWebRoot prefers env and discovers the CWSP-reborn build", async () => {
    const { resolveGatewayWebRoot } = await import("./gateway/web-root.ts");
    const envRoot = await mkdtemp(path.join(os.tmpdir(), "cwsp-gateway-env-"));
    await writeFile(path.join(envRoot, "index.html"), "<!doctype html><title>Env</title>");

    assert.equal(
        resolveGatewayWebRoot({
            env: { CWS_GATEWAY_WEB_ROOT: envRoot },
            cwd: os.tmpdir()
        }),
        path.resolve(envRoot)
    );

    const discovered = resolveGatewayWebRoot({
        env: {},
        cwd: path.resolve("."),
        fromFileUrl: import.meta.url
    });
    assert.equal(existsSync(path.join(discovered, "index.html")), true);
});

test("gateway reports a clear frontend-unavailable response for a missing static root", async () => {
    const pinHash = await createScryptHash("correct-pin");
    const app = fastify();
    await registerGatewayHttp(app, {
        runtimeContext: {
            engine: {
                config: {},
                profile: {},
                storage: {
                    async readCoreSettings() {
                        return {};
                    },
                    async writeCoreSettings(next: Record<string, unknown>) {
                        return next;
                    }
                }
            },
            selfId: "L-192.168.0.200",
            sockets: {
                getStatus: () => ({}),
                getConnectedPeerProfiles: () => [],
                dispatchPacket: () => true
            }
        },
        config: resolveGatewayConfig({
            gateway: {
                auth: {
                    pinHash,
                    lanPolicy: "required"
                }
            }
        }),
        webRoot: path.join(os.tmpdir(), "cwsp-gateway-root-does-not-exist")
    });

    const login = await app.inject({
        method: "POST",
        url: "/gateway/auth/login",
        headers: {
            "content-type": "application/json",
            origin: "http://localhost"
        },
        payload: {
            pin: "correct-pin"
        }
    });
    const cookie = String(login.headers["set-cookie"] || "").split(";")[0];
    const response = await app.inject({
        method: "GET",
        url: "/",
        headers: {
            cookie
        }
    });
    assert.equal(response.statusCode, 503);
    assert.equal(response.json().error, "Gateway frontend unavailable");
});

