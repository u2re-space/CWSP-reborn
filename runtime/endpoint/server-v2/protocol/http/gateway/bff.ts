/*
 * Filename: bff.ts
 * FullPath: runtime/cwsp/endpoint/server-v2/protocol/http/gateway/bff.ts
 * Change date and time: 14.45.00_17.07.2026
 * Reason for changes: Session settings GET/PATCH return UI-projectable values
 *   (including secrets) so gateway web Settings fields prefill from backend.
 */

import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

import type { GatewayRuntimeContext } from "./index.ts";

type GatewayAuthSurface = {
    requireSession: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
    requireOrigin: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
};

type GatewayBffOptions = {
    runtimeContext: GatewayRuntimeContext;
    auth: GatewayAuthSurface;
};

const SECRET_KEY_PATTERN =
    /(token|userkey|access[_-]?token|password|secret|api[_-]?key|bearer|authorization)/i;
const ROUTE_KEY_PATTERN = /^(url|uri|endpointurl|targeturl|proxyurl)$/i;

const ALLOWED_ACTIONS = new Set([
    "clipboard:update",
    "clipboard:write",
    "clipboard:clear",
    "mouse:move",
    "mouse:click",
    "mouse:scroll",
    "mouse:down",
    "mouse:up",
    "keyboard:type",
    "keyboard:tap",
    "keyboard:toggle"
]);

const ALLOWED_PURPOSES = new Set(["clipboard", "input", "mouse"]);
const MAX_BFF_BODY_BYTES = 64 * 1024;
const MAX_BFF_DEPTH = 8;

const isRecord = (value: unknown): value is Record<string, unknown> => {
    return Boolean(value) && typeof value === "object" && !Array.isArray(value);
};

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

const mergeRecords = (
    base: Record<string, unknown>,
    patch: Record<string, unknown>,
    depth = 0
): Record<string, unknown> => {
    if (depth > MAX_BFF_DEPTH) throw new Error("Settings patch is too deep");
    const output: Record<string, unknown> = { ...base };
    for (const [key, value] of Object.entries(patch)) {
        if (isRecord(value) && isRecord(output[key])) {
            output[key] = mergeRecords(output[key] as Record<string, unknown>, value, depth + 1);
        } else {
            output[key] = clone(value);
        }
    }
    return output;
};

const redact = (value: unknown, depth = 0): unknown => {
    if (depth > MAX_BFF_DEPTH) return "[redacted]";
    if (Array.isArray(value)) return value.map((entry) => redact(entry, depth + 1));
    if (!isRecord(value)) return value;
    const output: Record<string, unknown> = {};
    for (const [key, entry] of Object.entries(value)) {
        output[key] = SECRET_KEY_PATTERN.test(key) ? "[redacted]" : redact(entry, depth + 1);
    }
    return output;
};

const findSecretKey = (value: unknown, depth = 0): string | null => {
    if (depth > MAX_BFF_DEPTH) return "depth";
    if (Array.isArray(value)) {
        for (const entry of value) {
            const found = findSecretKey(entry, depth + 1);
            if (found) return found;
        }
        return null;
    }
    if (!isRecord(value)) return null;
    for (const [key, entry] of Object.entries(value)) {
        if (SECRET_KEY_PATTERN.test(key)) return key;
        const found = findSecretKey(entry, depth + 1);
        if (found) return found;
    }
    return null;
};

const findRouteKey = (value: unknown, depth = 0): string | null => {
    if (depth > MAX_BFF_DEPTH) return "depth";
    if (Array.isArray(value)) {
        for (const entry of value) {
            const found = findRouteKey(entry, depth + 1);
            if (found) return found;
        }
        return null;
    }
    if (!isRecord(value)) return null;
    for (const [key, entry] of Object.entries(value)) {
        if (ROUTE_KEY_PATTERN.test(key)) return key;
        const found = findRouteKey(entry, depth + 1);
        if (found) return found;
    }
    return null;
};

const validatePayload = (payload: unknown): payload is Record<string, unknown> => {
    if (!isRecord(payload)) return false;
    try {
        return (
            JSON.stringify(payload).length <= MAX_BFF_BODY_BYTES &&
            findSecretKey(payload) === null &&
            findRouteKey(payload) === null
        );
    } catch {
        return false;
    }
};

const normalizeDestinations = (value: unknown): string[] | null => {
    if (!Array.isArray(value) || value.length === 0 || value.length > 32) return null;
    const destinations = Array.from(
        new Set(
            value
                .map((entry) => String(entry || "").trim())
                .filter((entry) => entry && entry !== "*")
        )
    );
    return destinations.length === value.length ? destinations : null;
};

/**
 * Project persisted core-settings + live engine config into the AppSettings-shaped
 * fields the CWSP Settings UI binds (endpointUrl, userId, tokens, TLS, …).
 *
 * WHY: `core-settings.json` may be empty or server-shaped (`core.bridge` / `core.ops`),
 * while the web form expects Cap/WebNative-style `core.endpointUrl` keys.
 * SECURITY: returned only to cookie-authenticated gateway sessions (not redacted) so
 * previously saved values can prefill inputs; topology/status stay redacted.
 */
export const projectGatewaySettingsForUi = (
    settings: Record<string, unknown>,
    runtime: GatewayRuntimeContext
): Record<string, unknown> => {
    const config = isRecord(runtime.engine.config) ? runtime.engine.config : {};
    const bridge = isRecord(config.bridge) ? config.bridge : {};
    const coreIn = isRecord(settings.core) ? { ...settings.core } : {};
    const opsIn = isRecord(coreIn.ops) ? { ...coreIn.ops } : {};
    const bridgePersisted = isRecord(coreIn.bridge) ? coreIn.bridge : {};

    const endpoints = Array.isArray(bridge.endpoints)
        ? bridge.endpoints.map((entry) => String(entry || "").trim()).filter(Boolean)
        : Array.isArray(bridgePersisted.endpoints)
          ? bridgePersisted.endpoints.map((entry) => String(entry || "").trim()).filter(Boolean)
          : [];
    const endpointUrl =
        String(coreIn.endpointUrl || "").trim() ||
        String(bridge.endpointUrl || bridgePersisted.endpointUrl || "").trim() ||
        endpoints[0] ||
        "";
    const userId =
        String(coreIn.userId || "").trim() ||
        String(bridge.userId || bridgePersisted.userId || "").trim() ||
        String(runtime.selfId || "").trim();
    const userKey =
        String(coreIn.userKey || "").trim() ||
        String(coreIn.ecosystemToken || "").trim() ||
        String(bridge.userKey || bridgePersisted.userKey || "").trim();
    const allowInsecureTls =
        coreIn.allowInsecureTls !== undefined
            ? Boolean(coreIn.allowInsecureTls)
            : Boolean(opsIn.allowInsecureTls ?? bridge.allowInsecureTls ?? bridgePersisted.allowInsecureTls);
    const httpsPort =
        Number((runtime.engine.profile as { httpsPort?: number } | undefined)?.httpsPort) ||
        Number(config.listenPort) ||
        8434;

    return {
        ...settings,
        core: {
            ...coreIn,
            mode: coreIn.mode || "endpoint",
            endpointUrl: endpointUrl || `https://127.0.0.1:${httpsPort}`,
            ...(userId ? { userId } : {}),
            ...(userKey
                ? {
                      userKey,
                      ecosystemToken: userKey,
                      socket: {
                          ...(isRecord(coreIn.socket) ? coreIn.socket : {}),
                          accessToken: userKey
                      }
                  }
                : {}),
            allowInsecureTls,
            preferBackendSync: coreIn.preferBackendSync !== undefined ? coreIn.preferBackendSync : true,
            ops: {
                ...opsIn,
                allowInsecureTls: opsIn.allowInsecureTls ?? allowInsecureTls
            }
        }
    };
};

const protectedOptions = (auth: GatewayAuthSurface, mutation = false) => ({
    preHandler: mutation ? [auth.requireSession, auth.requireOrigin] : auth.requireSession
});

export const registerGatewayBff = async (
    app: FastifyInstance,
    options: GatewayBffOptions
): Promise<void> => {
    const { runtimeContext: runtime, auth } = options;

    app.get("/gateway/api/settings", protectedOptions(auth), async (_request, reply) => {
        const settings = await runtime.engine.storage.readCoreSettings();
        // WHY: authenticated Settings UI must prefill saved values (incl. tokens/keys).
        return reply.send({
            ok: true,
            settings: projectGatewaySettingsForUi(settings as Record<string, unknown>, runtime)
        });
    });

    app.patch(
        "/gateway/api/settings",
        protectedOptions(auth, true),
        async (
            request: FastifyRequest<{ Body: Record<string, unknown> }>,
            reply
        ) => {
            const patch = request.body;
            if (!isRecord(patch) || JSON.stringify(patch).length > MAX_BFF_BODY_BYTES) {
                return reply.code(400).send({ ok: false, error: "Invalid settings patch" });
            }
            // WHY: session + Origin already gate writes; secrets must persist so reload prefills.
            try {
                const current = await runtime.engine.storage.readCoreSettings();
                const merged = mergeRecords(current, patch);
                const settings = await runtime.engine.storage.writeCoreSettings(merged);
                return reply.send({
                    ok: true,
                    settings: projectGatewaySettingsForUi(settings as Record<string, unknown>, runtime)
                });
            } catch {
                return reply.code(400).send({ ok: false, error: "Invalid settings patch" });
            }
        }
    );

    app.get("/gateway/api/network/status", protectedOptions(auth), async (_request, reply) => {
        return reply.send({
            ok: true,
            profile: redact(runtime.engine.profile),
            socket: redact(runtime.sockets.getStatus()),
            peers: redact(runtime.sockets.getConnectedPeerProfiles())
        });
    });

    app.get("/gateway/api/topology", protectedOptions(auth), async (_request, reply) => {
        const config = runtime.engine.config || {};
        return reply.send({
            ok: true,
            topology: redact(config.topology || {}),
            endpointIDs: redact(config.endpointIDs || {})
        });
    });

    app.post(
        "/gateway/api/action",
        protectedOptions(auth, true),
        async (
            request: FastifyRequest<{
                Body: {
                    what?: string;
                    purpose?: string;
                    destinations?: unknown;
                    payload?: unknown;
                };
            }>,
            reply
        ) => {
            const body = request.body || {};
            const what = String(body.what || "").trim();
            const purpose = String(body.purpose || "").trim();
            const destinations = normalizeDestinations(body.destinations);
            if (!ALLOWED_ACTIONS.has(what) || !ALLOWED_PURPOSES.has(purpose) || !destinations) {
                return reply.code(400).send({ ok: false, error: "Action or destination rejected" });
            }
            if (
                (purpose === "clipboard" && !what.startsWith("clipboard:")) ||
                (purpose === "mouse" && !what.startsWith("mouse:")) ||
                (purpose === "input" && !what.startsWith("keyboard:"))
            ) {
                return reply.code(400).send({ ok: false, error: "Action purpose mismatch" });
            }
            if (!validatePayload(body.payload)) {
                return reply.code(400).send({ ok: false, error: "Action payload rejected" });
            }

            const payload = clone(body.payload);
            const packet = {
                op: "act",
                what,
                purpose,
                protocol: "local",
                transport: "http",
                payload,
                data: payload,
                from: runtime.selfId,
                byId: runtime.selfId,
                nodes: destinations,
                destinations,
                timestamp: Date.now()
            };
            const delivered = runtime.sockets.dispatchPacket(packet);
            if (!delivered) {
                return reply.code(502).send({ ok: false, error: "Destination unavailable" });
            }
            return reply.code(202).send({ ok: true, delivered: true });
        }
    );
};

