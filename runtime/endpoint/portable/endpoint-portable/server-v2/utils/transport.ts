import type { FastifyInstance, FastifyRequest } from "fastify";
import { readFileSync } from "node:fs";
import path from "node:path";

import { verifyUser } from "@protocol/http/routers/auth/users.ts";
import type { ClipboardAccess } from "@inputs/access/clipboard.ts";
import type { ServerV2SocketRuntime } from "@protocol/socket/runtime.ts";
import {
    buildClipboardBroadcastPayload,
    normalizeClipboardText
} from "../../../../server/routing/routes.ts";
import {
    setBroadcasting as setLegacyClipboardBroadcasting,
    writeClipboard as writeLegacyClipboard
} from "../../../../server/io/clipboard.ts";
import { normalizeEndpointPolicies, resolveEndpointIdPolicyStrict } from "../../../utils/endpoint-policy.ts";

const TRANSPORT_HANDLERS_KEY = Symbol.for("cws.serverV2.transportHandlers");
const RAW_CLIENTS_CONFIG_PATH = path.resolve(process.cwd(), "config/clients.json");

const normalizeString = (value: unknown): string => String(value || "").trim();
const normalizeToken = (value: unknown): string => String(value || "").trim().toLowerCase();

const loadEndpointPolicies = () => {
    try {
        const raw = JSON.parse(readFileSync(RAW_CLIENTS_CONFIG_PATH, "utf8")) as Record<string, unknown>;
        return normalizeEndpointPolicies(raw);
    } catch {
        return normalizeEndpointPolicies({});
    }
};

const resolvePolicyTokens = (tokens: unknown[]): string[] => {
    const out = new Set<string>();
    for (const entry of tokens) {
        const raw = String(entry || "").trim();
        if (!raw) continue;
        if (raw === "*") {
            out.add("*");
            continue;
        }
        if (raw.startsWith("inline:")) {
            out.add(normalizeToken(raw.slice("inline:".length)));
            continue;
        }
        if (raw.startsWith("token:")) {
            out.add(normalizeToken(raw.slice("token:".length)));
            continue;
        }
        if (raw.startsWith("env:")) {
            const envValue = normalizeToken(process.env[raw.slice("env:".length).trim()]);
            if (envValue) out.add(envValue);
            continue;
        }
        out.add(normalizeToken(raw));
    }
    return Array.from(out).filter(Boolean);
};

const verifyEndpointPolicyUser = (policies: ReturnType<typeof normalizeEndpointPolicies>, userId: string, userKey: string) => {
    const normalizedUserId = normalizeString(userId);
    const normalizedUserKey = normalizeToken(userKey);
    if (!normalizedUserId || !normalizedUserKey) return null;

    const policy = resolveEndpointIdPolicyStrict(policies, normalizedUserId);
    const policyTokens = resolvePolicyTokens(Array.isArray(policy?.tokens) ? policy.tokens : []);
    const runtimeTokens = [
        process.env.CWS_ASSOCIATED_TOKEN,
        process.env.CWS_BRIDGE_USER_KEY,
        process.env.CWS_UPSTREAM_USER_KEY
    ]
        .map((value) => normalizeToken(value))
        .filter(Boolean);
    const acceptedTokens = new Set([...policyTokens, ...runtimeTokens]);
    if (!acceptedTokens.size) return null;
    if (!acceptedTokens.has("*") && !acceptedTokens.has(normalizedUserKey)) return null;

    return {
        userId: normalizedUserId,
        userKeyHash: "endpoint-policy",
        encrypt: false,
        createdAt: 0
    };
};

const normalizeTargets = (body: Record<string, unknown>): string[] => {
    const targets = new Set<string>();
    const append = (value: unknown) => {
        const normalized = normalizeString(value);
        if (normalized) targets.add(normalized);
    };
    append(body.target);
    append(body.targetId);
    append(body.targetDeviceId);
    append(body.deviceId);
    append(body.peerId);
    append(body.destinationId);
    append(body.routeTarget);
    if (Array.isArray(body.targets)) {
        for (const entry of body.targets) append(entry);
    }
    // COMPAT: canonical CWSP v2 envelope uses nodes/destinations.
    if (Array.isArray(body.nodes)) {
        for (const entry of body.nodes) append(entry);
    }
    if (Array.isArray(body.destinations)) {
        for (const entry of body.destinations) append(entry);
    }
    if (typeof body.nodes === "string") append(body.nodes);
    if (typeof body.destinations === "string") {
        for (const part of String(body.destinations).split(/[,;\s]+/)) append(part);
    }
    return Array.from(targets).filter((id) => id !== "*");
};


const asRecord = (value: unknown): Record<string, unknown> => {
    return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : {};
};

const resolveDispatchType = (body: Record<string, unknown>, fallback = "dispatch"): string => {
    return normalizeString(body.type || body.action || fallback) || fallback;
};

const resolveClipboardPayload = (value: unknown): Record<string, unknown> => {
    if (value && typeof value === "object" && !Array.isArray(value)) {
        const record = asRecord(value);
        const text = normalizeClipboardText(record);
        if (text) {
            return {
                ...record,
                text
            };
        }
        return record;
    }
    const text = normalizeClipboardText(value);
    return text ? { text } : {};
};

const resolveDispatchPayload = (body: Record<string, unknown>, type: string): unknown => {
    const directPayload = body.payload ?? body.data;
    if (directPayload != null) {
        return type.startsWith("clipboard:") ? resolveClipboardPayload(directPayload) : directPayload;
    }
    if (type.startsWith("clipboard:")) {
        const clipboardPayload = resolveClipboardPayload(body.body ?? body);
        if (Object.keys(clipboardPayload).length > 0) return clipboardPayload;
    }
    return body.body ?? body;
};

/**
 * COMPAT: clients may send ecosystem token as `token` / `accessToken` / headers,
 * and identity as `clientId` / `byId` / `from` — not only classic `userId`+`userKey`.
 */
const resolveAuthHeaders = (headers: unknown): Record<string, string> => {
    const src = asRecord(headers);
    const out: Record<string, string> = {};
    for (const [key, value] of Object.entries(src)) {
        if (typeof value === "string" && value.trim()) out[key.toLowerCase()] = value.trim();
    }
    return out;
};

const verifyRequestUser = async (
    policies: ReturnType<typeof normalizeEndpointPolicies>,
    body: Record<string, unknown>,
    headers?: unknown
) => {
    const hdr = resolveAuthHeaders(headers);
    const bearer = hdr.authorization?.replace(/^bearer\s+/i, "").trim() || "";
    const userId = normalizeString(body.userId || body.clientId || body.byId || body.from);
    const userKey = normalizeString(
        body.userKey ||
            body.token ||
            body.accessToken ||
            body.ecosystemToken ||
            hdr["x-cws-token"] ||
            hdr["x-auth-token"] ||
            bearer
    );
    if (!userId || !userKey) return { ok: false as const, error: "Missing credentials" };
    const record = await verifyUser(userId, userKey);
    if (!record) {
        const endpointRecord = verifyEndpointPolicyUser(policies, userId, userKey);
        if (!endpointRecord) return { ok: false as const, error: "Invalid credentials" };
        return { ok: true as const, userId, userKey, record: endpointRecord };
    }
    return { ok: true as const, userId, userKey, record };
};

const forwardHttpRequest = async (entry: Record<string, unknown>) => {
    const url = normalizeString(entry.url);
    if (!url) return { ok: false, error: "No URL" };
    try {
        const response = await fetch(url, {
            method: normalizeString(entry.method || "POST") || "POST",
            headers: asRecord(entry.headers) as HeadersInit,
            body: typeof entry.body === "string" ? entry.body : entry.body == null ? null : JSON.stringify(entry.body)
        });
        return {
            ok: response.ok,
            status: response.status,
            target: url,
            data: await response.text()
        };
    } catch (error) {
        return {
            ok: false,
            target: url,
            error: String(error)
        };
    }
};

export const registerTransportHttpHandlers = async (
    app: FastifyInstance,
    second?:
        | {
              clipboard?: ClipboardAccess;
              sockets?: ServerV2SocketRuntime | Record<string, unknown>;
              selfId?: string;
              endpointPolicies?: Record<string, unknown>;
          }
        | Record<string, unknown>
        | null
): Promise<void> => {
    if ((app as any)[TRANSPORT_HANDLERS_KEY]) return;
    (app as any)[TRANSPORT_HANDLERS_KEY] = true;

    // WHY: HTTP branches historically call `registerTransportHttpHandlers(app, wsHub)`,
    // while some routers pass `{ clipboard, sockets, selfId }`. Accept both.
    const runtime = ((app as any).serverV2RuntimeContext || {}) as {
        clipboard?: ClipboardAccess;
        sockets?: ServerV2SocketRuntime;
        selfId?: string;
        endpointPolicies?: Record<string, unknown>;
    };
    const bag =
        second && typeof second === "object" && ("sockets" in second || "clipboard" in second || "selfId" in second)
            ? (second as {
                  clipboard?: ClipboardAccess;
                  sockets?: ServerV2SocketRuntime | Record<string, unknown>;
                  selfId?: string;
                  endpointPolicies?: Record<string, unknown>;
              })
            : null;
    const nativeHub = (!bag ? second : null) || (app as any).wsHub || null;

    const clipboard = (bag?.clipboard || runtime.clipboard) as ClipboardAccess;
    const runtimeSockets = (bag?.sockets || runtime.sockets) as ServerV2SocketRuntime | undefined;
    const selfId =
        normalizeString(bag?.selfId || runtime.selfId || process.env.CWS_ASSOCIATED_ID || process.env.CWS_BRIDGE_USER_ID) ||
        "server-v2";

    const sockets = {
        getConnectedDevices: (ownerId?: string): string[] => {
            const fromRuntime = runtimeSockets?.getConnectedDevices?.(ownerId) || [];
            const fromHub =
                typeof (nativeHub as any)?.getConnectedDevices === "function"
                    ? ((nativeHub as any).getConnectedDevices(ownerId) as string[])
                    : [];
            return Array.from(new Set([...fromRuntime, ...fromHub].map((id) => normalizeString(id)).filter(Boolean)));
        },
        getConnectedPeerProfiles: (ownerId?: string) => {
            const runtimeProfiles = runtimeSockets?.getConnectedPeerProfiles?.(ownerId) || [];
            const hubProfiles =
                typeof (nativeHub as any)?.getConnectedPeerProfiles === "function"
                    ? (((nativeHub as any).getConnectedPeerProfiles(ownerId) || []) as Array<{
                          id: string;
                          label?: string;
                          transport?: string;
                      }>)
                    : [];
            const byId = new Map<string, { id: string; label: string; transport?: string }>();
            for (const entry of [...runtimeProfiles, ...hubProfiles]) {
                const id = normalizeString(entry?.id);
                if (!id) continue;
                byId.set(id, {
                    id,
                    label: normalizeString(entry?.label) || id,
                    transport: normalizeString((entry as any)?.transport) || "ws"
                });
            }
            return Array.from(byId.values());
        },
        getStatus: () => {
            if (typeof runtimeSockets?.getStatus === "function") return runtimeSockets.getStatus();
            const ids = sockets.getConnectedDevices();
            return { ws: { connected: ids.length, ids }, socketio: { connected: 0, ids: [] } };
        },
        sendLegacyMessage: (targets: string[], type: string, data: unknown, from?: string): boolean => {
            const payload = {
                op: "act",
                what: type,
                type,
                data,
                payload: data,
                nodes: targets,
                byId: from || selfId,
                from: from || selfId,
                timestamp: Date.now()
            };
            // WHY: phones are native /ws forward peers; Socket.IO runtimeSockets alone never sees them.
            // Fan out to both registries — OR semantics (either transport counts as delivered).
            let delivered = false;
            if (typeof runtimeSockets?.sendLegacyMessage === "function") {
                delivered = Boolean(runtimeSockets.sendLegacyMessage(targets, type, data, from)) || delivered;
            }
            if (!targets.length) {
                if (typeof (nativeHub as any)?.multicast === "function") {
                    delivered = Boolean((nativeHub as any).multicast(from || selfId, payload)) || delivered;
                }
                return delivered;
            }
            for (const target of targets) {
                if (typeof (nativeHub as any)?.sendToDevice === "function") {
                    delivered =
                        Boolean((nativeHub as any).sendToDevice(from || selfId, target, payload)) || delivered;
                } else if (typeof (nativeHub as any)?.sendTo === "function") {
                    (nativeHub as any).sendTo(target, payload);
                    delivered = true;
                }
            }
            return delivered;
        },
        multicast: (ownerId: string, payload: Record<string, unknown>) => {
            let delivered = false;
            if (typeof runtimeSockets?.multicast === "function") {
                delivered = Boolean(runtimeSockets.multicast(ownerId, payload)) || delivered;
            }
            if (typeof (nativeHub as any)?.multicast === "function") {
                delivered = Boolean((nativeHub as any).multicast(ownerId, payload)) || delivered;
            }
            // Cross-user phone fan-out: also try sendToDevice for each live /ws peer.
            if (typeof (nativeHub as any)?.getConnectedDevices === "function" &&
                typeof (nativeHub as any)?.sendToDevice === "function") {
                const peers = ((nativeHub as any).getConnectedDevices(ownerId) || []) as string[];
                for (const peer of peers) {
                    if (!peer || peer === ownerId) continue;
                    delivered = Boolean((nativeHub as any).sendToDevice(ownerId, peer, payload)) || delivered;
                }
            }
            return delivered;
        },
        notify: (ownerId: string, type: string, data: unknown) => {
            let delivered = false;
            if (typeof runtimeSockets?.notify === "function") {
                delivered = Boolean(runtimeSockets.notify(ownerId, type, data)) || delivered;
            }
            delivered =
                Boolean(
                    sockets.multicast(ownerId, {
                        type,
                        data,
                        from: selfId,
                        byId: selfId,
                        timestamp: Date.now()
                    })
                ) || delivered;
            return delivered;
        }
    };

    const endpointPolicies = normalizeEndpointPolicies(
        (bag?.endpointPolicies && Object.keys(bag.endpointPolicies).length > 0
            ? bag.endpointPolicies
            : runtime.endpointPolicies && Object.keys(runtime.endpointPolicies).length > 0
              ? runtime.endpointPolicies
              : loadEndpointPolicies()) as Record<string, unknown>
    );

    if (!clipboard || typeof (clipboard as any).read !== "function") {
        console.warn("[server-v2/http] transport handlers mounted without clipboard access");
    }

    app.get("/clipboard", async (_request, reply) => {
        try {
            const text = normalizeString(await clipboard.read());
            return reply.send({
                ok: Boolean(text),
                ready: true,
                clipboard: text ? { text } : {}
            });
        } catch (error) {
            return reply.code(500).send({ ok: false, error: String(error) });
        }
    });

    app.post("/clipboard", async (request: FastifyRequest<{ Body: Record<string, unknown> }>, reply) => {
        const body = asRecord(request.body);
        const text = normalizeClipboardText(body);
        if (!text) {
            return reply.code(400).send({ ok: false, error: "No text provided" });
        }

        const relayPayload = buildClipboardBroadcastPayload(app, body, text, request);
        if (relayPayload) {
            const relayResponse = await app.inject({
                method: "POST",
                url: "/core/ops/http/dispatch",
                headers: {
                    "content-type": "application/json"
                },
                payload: JSON.stringify(relayPayload)
            });
            const relayBody = String((relayResponse as any)?.body || "").trim();
            try {
                return reply.code(relayResponse.statusCode || 200).send(relayBody ? JSON.parse(relayBody) : {});
            } catch {
                return reply.code(relayResponse.statusCode || 200).send(relayBody || "");
            }
        }

        const targets = normalizeTargets(body);
        if (targets.length) {
            const delivered = sockets.sendLegacyMessage(targets, "clipboard:update", { text }, selfId);
            return { ok: delivered, delivered: delivered ? "socketio" : "none", targets };
        }

        try {
            setLegacyClipboardBroadcasting(true);
            const written = await writeLegacyClipboard(text);
            if (!written) {
                return reply.code(204).send({ ok: false, error: "Clipboard unavailable" });
            }
            return { ok: true, mode: "local-write" };
        } catch (error) {
            return reply.code(500).send({ ok: false, error: String(error) });
        } finally {
            setLegacyClipboardBroadcasting(false);
        }
    });

    const requestHandler = async (request: FastifyRequest<{ Body: Record<string, unknown> }>) => {
        const body = asRecord(request.body);
        const auth = await verifyRequestUser(endpointPolicies, body, request.headers);
        if (!auth.ok) return auth;
        const results = Array.isArray(body.requests)
            ? await Promise.all(body.requests.map((entry) => forwardHttpRequest(asRecord(entry))))
            : [await forwardHttpRequest(body)];
        return {
            ok: results.every((entry) => entry.ok),
            results
        };
    };

    app.post("/core/ops/http", requestHandler);
    app.post("/core/ops/https", requestHandler);
    app.post("/api/request", requestHandler);
    app.post("/core/request/fetch", requestHandler);
    app.post("/api/request/fetch", requestHandler);
    app.post("/", async (request: FastifyRequest<{ Body: Record<string, unknown> }>) => {
        const body = asRecord(request.body);
        if (Array.isArray(body.requests) || body.targetDeviceId || body.targets) {
            return app.inject({
                method: "POST",
                url: "/api/broadcast",
                payload: body
            }).then((result) => JSON.parse(result.body || "{}"));
        }
        return requestHandler(request);
    });

    const dispatchHandler = async (request: FastifyRequest<{ Body: Record<string, unknown> }>) => {
        const body = asRecord(request.body);
        const auth = await verifyRequestUser(endpointPolicies, body, request.headers);
        if (!auth.ok) return auth;
        const type = resolveDispatchType(body);
        const targets = normalizeTargets(body);
        const payload = resolveDispatchPayload(body, type);
        const requestEntries = Array.isArray(body.requests) ? body.requests.map((entry) => asRecord(entry)) : [];
        const externalRequests = requestEntries.filter((entry) => normalizeString(entry.url));
        const socketRequests = requestEntries
            .filter((entry) => !normalizeString(entry.url))
            .map((entry) => {
                const target = normalizeString(entry.deviceId || entry.targetId || entry.target);
                const entryType = resolveDispatchType(entry, type);
                const entryPayload = resolveDispatchPayload(entry, entryType);
                return {
                    target,
                    type: entryType,
                    payload: entryPayload
                };
            })
            .filter((entry) => entry.target);

        const deliveryResults = socketRequests.length > 0
            ? socketRequests.map((entry) => ({
                  target: entry.target,
                  ok: sockets.sendLegacyMessage([entry.target], entry.type, entry.payload, auth.userId),
                  delivered: "socketio"
              }))
            : targets.map((target) => ({
                  target,
                  ok: sockets.sendLegacyMessage([target], type, payload, auth.userId),
                  delivered: "socketio"
              }));
        const httpResults = await Promise.all(externalRequests.map((entry) => forwardHttpRequest(entry)));

        return {
            ok: [...deliveryResults, ...httpResults].every((entry) => entry.ok),
            results: [...deliveryResults, ...httpResults]
        };
    };

    app.post("/core/ops/http/dispatch", dispatchHandler);
    app.post("/core/ops/http/disp", dispatchHandler);
    app.post("/api/broadcast", dispatchHandler);

    const wsSendHandler = async (request: FastifyRequest<{ Body: Record<string, unknown> }>) => {
        const body = asRecord(request.body);
        const auth = await verifyRequestUser(endpointPolicies, body, request.headers);
        if (!auth.ok) return auth;
        const type = normalizeString(body.type || "dispatch") || "dispatch";
        const data = body.data ?? body.payload ?? body;
        const delivered = sockets.multicast(auth.userId, {
            type,
            data,
            from: auth.userId,
            byId: auth.userId,
            timestamp: Date.now()
        });
        return { ok: delivered, delivered: delivered ? "socketio" : "none" };
    };

    app.post("/core/ops/ws/send", wsSendHandler);
    app.post("/api/ws", wsSendHandler);

    const reverseSendHandler = async (request: FastifyRequest<{ Body: Record<string, unknown> }>) => {
        const body = asRecord(request.body);
        const auth = await verifyRequestUser(endpointPolicies, body, request.headers);
        if (!auth.ok) return auth;
        const targets = normalizeTargets(body);
        if (!targets.length) return { ok: false, error: "Missing deviceId" };
        const delivered = sockets.sendLegacyMessage(
            targets,
            normalizeString(body.type || body.action || "dispatch") || "dispatch",
            body.data ?? body.payload ?? body,
            auth.userId
        );
        return { ok: delivered, delivered: delivered ? "socketio" : "none", targets };
    };

    app.post("/core/reverse/send", reverseSendHandler);
    app.post("/api/reverse/send", reverseSendHandler);

    const reverseDevicesHandler = async (request: FastifyRequest<{ Body: Record<string, unknown> }>) => {
        const auth = await verifyRequestUser(endpointPolicies, asRecord(request.body), request.headers);
        if (!auth.ok) return auth;
        const profiles = sockets.getConnectedPeerProfiles(auth.userId);
        return {
            ok: true,
            devices: profiles.map((entry) => entry.id),
            deviceProfiles: profiles.map((entry) => ({ id: entry.id, label: entry.label }))
        };
    };

    app.post("/core/reverse/devices", reverseDevicesHandler);
    app.post("/api/reverse/devices", reverseDevicesHandler);

    const topologyHandler = async (_request: FastifyRequest<{ Body: Record<string, unknown> }>) => {
        return {
            ok: true,
            topology: {
                nodes: sockets.getConnectedPeerProfiles().map((entry) => ({
                    id: entry.id,
                    label: entry.label,
                    transport: entry.transport
                })),
                links: []
            }
        };
    };

    const connectionsHandler = async (_request: FastifyRequest<{ Body: Record<string, unknown> }>) => {
        return {
            ok: true,
            connections: sockets.getConnectedPeerProfiles()
        };
    };

    const statusHandler = async (_request: FastifyRequest<{ Body: Record<string, unknown> }>) => {
        return {
            ok: true,
            status: sockets.getStatus()
        };
    };

    const networkDispatchHandler = async (request: FastifyRequest<{ Body: Record<string, unknown> }>) => {
        const body = asRecord(request.body);
        const auth = await verifyRequestUser(endpointPolicies, body, request.headers);
        if (!auth.ok) return auth;

        const what =
            normalizeString(body.what || body.type || body.action) ||
            "network:dispatch";
        const targets = normalizeTargets(body);
        const broadcast = Boolean(body.broadcast) || targets.includes("*");
        const livePeers = sockets.getConnectedDevices(auth.userId);
        const requestedTargets = targets.length
            ? targets.filter((id) => id !== "*")
            : broadcast
              ? livePeers
              : [];

        // Local readiness / debug asks: answer on the gateway without requiring a live peer.
        const isLocalAsk =
            body.op === "ask" &&
            (what === "debug:isReady" ||
                what === "clipboard:isReady" ||
                what === "mouse:isReady" ||
                what === "keyboard:isReady");
        if (isLocalAsk && requestedTargets.length === 0) {
            return {
                ok: true,
                route: "local",
                what,
                result: { ready: true, peer: selfId },
                delivered: {
                    local: true,
                    bridge: false,
                    target: selfId,
                    targets: [selfId],
                    livePeers
                }
            };
        }

        if (isLocalAsk && requestedTargets.length > 0) {
            const online = requestedTargets.filter((id) => {
                const needle = String(id || "").trim().toLowerCase();
                return livePeers.some((peer) => {
                    const p = String(peer || "").trim().toLowerCase();
                    return p === needle || p.endsWith(needle) || needle.endsWith(p);
                });
            });
            const offline = requestedTargets.filter((id) => !online.includes(id));
            // Probe connectivity: report live/offline without forcing desk preconnect.
            return {
                ok: online.length > 0 || offline.length === 0,
                route: online.length ? (online.length > 1 ? "both" : "local") : "none",
                what,
                result: {
                    ready: online.length > 0,
                    online,
                    offline,
                    livePeers
                },
                delivered: {
                    local: online.length > 0,
                    bridge: false,
                    target: online[0] || null,
                    targets: online,
                    offline
                }
            };
        }

        if (!requestedTargets.length && !broadcast) {
            return {
                ok: false,
                route: "none",
                what,
                error: "No destination targets (nodes/destinations/target). Live peers listed in delivered.livePeers.",
                delivered: {
                    local: false,
                    bridge: false,
                    target: null,
                    targets: [],
                    livePeers
                }
            };
        }

        const delivered = requestedTargets.length
            ? sockets.sendLegacyMessage(
                  requestedTargets,
                  what,
                  body.payload ?? body.data ?? {},
                  auth.userId
              )
            : broadcast
              ? sockets.multicast(auth.userId, {
                    op: "act",
                    what,
                    type: what,
                    payload: body.payload ?? body.data ?? {},
                    data: body.payload ?? body.data ?? {},
                    byId: auth.userId,
                    from: auth.userId,
                    timestamp: Date.now()
                })
              : false;

        return {
            ok: Boolean(delivered) || broadcast,
            route: requestedTargets.length > 1 ? "both" : requestedTargets.length === 1 ? "local" : broadcast ? "broadcast" : "none",
            what,
            delivered: {
                local: Boolean(delivered),
                bridge: false,
                target: requestedTargets[0] || null,
                targets: requestedTargets,
                livePeers
            }
        };
    };

    app.post("/core/network/topology", topologyHandler);
    app.post("/api/network/topology", topologyHandler);
    app.post("/core/network/connections", connectionsHandler);
    app.post("/api/network/connections", connectionsHandler);
    app.post("/core/network/status", statusHandler);
    app.post("/api/network/status", statusHandler);
    app.post("/core/network/dispatch", networkDispatchHandler);
    app.post("/api/network/dispatch", networkDispatchHandler);
    app.post("/core/network/fetch", requestHandler);
    app.post("/api/network/fetch", requestHandler);

    const devicesHandler = async (request: FastifyRequest<{ Body: Record<string, unknown> }>) => {
        const auth = await verifyRequestUser(endpointPolicies, asRecord(request.body), request.headers);
        if (!auth.ok) return auth;
        return {
            ok: true,
            reverseDevices: sockets.getConnectedDevices(auth.userId),
            reverseDeviceProfiles: sockets.getConnectedPeerProfiles(auth.userId).map((entry) => ({ id: entry.id, label: entry.label })),
            configuredTargets: []
        };
    };

    app.post("/core/ops/devices", devicesHandler);
    app.post("/api/devices", devicesHandler);

    const featureDispatchHandler = (featureType: string) => async (request: FastifyRequest<{ Body: Record<string, unknown> }>) => {
        const auth = await verifyRequestUser(endpointPolicies, asRecord(request.body), request.headers);
        if (!auth.ok) return auth;
        const body = asRecord(request.body);
        const targets = normalizeTargets(body);
        const payload = body.data ?? body.payload ?? body;
        const delivered = targets.length
            ? sockets.sendLegacyMessage(targets, featureType, payload, auth.userId)
            : sockets.notify(auth.userId, featureType, payload);
        return {
            ok: delivered,
            delivered: delivered ? "socketio" : "none",
            targets
        };
    };

    app.post("/core/ops/sms", featureDispatchHandler("sms:send"));
    app.post("/api/sms", featureDispatchHandler("sms:send"));
    app.post("/core/ops/contacts", featureDispatchHandler("contacts:list"));
    app.post("/api/contacts", featureDispatchHandler("contacts:list"));
    app.post("/core/ops/notifications", featureDispatchHandler("notifications"));
    app.post("/api/notifications", featureDispatchHandler("notifications"));

    const notificationsSpeakHandler = async (request: FastifyRequest<{ Body: Record<string, unknown> }>) => {
        const auth = await verifyRequestUser(endpointPolicies, asRecord(request.body), request.headers);
        if (!auth.ok) return auth;
        const targets = normalizeTargets(asRecord(request.body));
        const payload = asRecord(request.body).payload ?? asRecord(request.body).data ?? asRecord(request.body);
        const delivered = targets.length
            ? sockets.sendLegacyMessage(targets, "notification:speak", payload, auth.userId)
            : sockets.notify(auth.userId, "notification:speak", payload);
        return { ok: delivered, delivered: delivered ? "socketio" : "none" };
    };

    app.post("/core/ops/notifications/speak", notificationsSpeakHandler);
    app.post("/api/notifications/speak", notificationsSpeakHandler);

    const notifyHandler = async (request: FastifyRequest<{ Body: Record<string, unknown> }>) => {
        const auth = await verifyRequestUser(endpointPolicies, asRecord(request.body), request.headers);
        if (!auth.ok) return auth;
        const body = asRecord(request.body);
        const delivered = sockets.notify(auth.userId, normalizeString(body.type || body.action || "action") || "action", body.data ?? body.payload ?? body);
        return { ok: delivered, delivered: delivered ? "socketio" : "none" };
    };

    app.post("/core/ops/notify", notifyHandler);
    app.post("/api/action", notifyHandler);
};
