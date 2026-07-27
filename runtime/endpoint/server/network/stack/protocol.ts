export const NETWORK_TRANSPORTS = ["ws", "socketio", "http", "tunnel"] as const;

export type NetworkTransport = (typeof NETWORK_TRANSPORTS)[number];

export type NetworkMode = "blind" | "secure" | "inspect" | "broadcast" | "relay";

export type NetworkMessageDirection = "server" | "client" | "hub";

export type NetworkFramePayload = unknown;

export interface NetworkFrame {
    type?: string;
    action?: string;
    from?: string;
    to?: string;
    target?: string;
    targetId?: string;
    deviceId?: string;
    namespace?: string;
    ns?: string;
    mode?: NetworkMode | string;
    payload?: NetworkFramePayload;
    data?: NetworkFramePayload;
    body?: NetworkFramePayload;
    message?: NetworkFramePayload;
    broadcast?: boolean;
    nodeId?: string;
    peerId?: string;
    gatewayId?: string;
    via?: string;
    surface?: string;
    ts?: number;
    [key: string]: unknown;
}

export type NormalizedNetworkFrame = Required<Pick<NetworkFrame, "type" | "from" | "to">> &
    Omit<NetworkFrame, "type" | "from" | "to"> & {
        namespace: string;
        target: string;
        payload: NetworkFramePayload;
        mode: string;
        transport?: NetworkTransport;
    };

const DEFAULT_FRAME_TYPE = "dispatch";
const DEFAULT_NAMESPACE = "default";
const BROADCAST_TARGETS = new Set(["broadcast", "all", "*"]);

const pickString = (value: unknown): string | undefined => (typeof value === "string" ? value.trim() : undefined);

export const extractPayload = (frame: NetworkFrame): NetworkFramePayload => {
    if (typeof frame?.payload !== "undefined") return frame.payload;
    if (typeof frame?.data !== "undefined") return frame.data;
    if (typeof frame?.body !== "undefined") return frame.body;
    if (typeof frame?.message !== "undefined") return frame?.message;
    return frame;
};

export const resolveTarget = (frame: NetworkFrame): string => {
    const directTarget = pickString(frame?.to) || pickString(frame?.target) || pickString(frame?.targetId) || pickString(frame?.target_id) || pickString(frame?.deviceId);
    return directTarget && directTarget.length > 0 ? directTarget : "broadcast";
};

export const isBroadcastFrame = (frame: NetworkFrame): boolean => {
    const broadcastFlag = frame?.broadcast === true;
    const target = resolveTarget(frame);
    return broadcastFlag || BROADCAST_TARGETS.has(target.toLowerCase());
};

export const resolveMode = (frame: NetworkFrame): string => {
    const raw = pickString(frame?.mode);
    return raw && raw.length > 0 ? raw : "blind";
};

export const normalizeFrame = (raw: unknown, sourceId: string): NormalizedNetworkFrame => {
    const frame = raw && typeof raw === "object" ? (raw as NetworkFrame) : {};

    // Soft-bind: coordinator / cwsp-shared v2 packets → legacy frame shape.
    // COMPAT: frames with only type/action/to fall through to existing logic unchanged.
    // WHY: inline overlay avoids hard-importing adapters (endpoint boot must stay safe).
    try {
        const r = frame as NetworkFrame & {
            op?: unknown;
            what?: unknown;
            flags?: { canonicalV2?: unknown };
            destinations?: unknown;
            nodes?: unknown;
            sender?: unknown;
            byId?: unknown;
            uuid?: unknown;
            cwsp_route_target?: unknown;
            transport?: unknown;
        };
        const isCoordinator =
            "op" in r ||
            "what" in r ||
            r?.flags?.canonicalV2 === true;
        if (isCoordinator) {
            const destFromArray = (value: unknown): string[] =>
                Array.isArray(value)
                    ? value
                          .filter((v): v is string => typeof v === "string" && v.trim().length > 0)
                          .map((v) => v.trim())
                    : [];
            let destinations = destFromArray(r.destinations);
            if (destinations.length === 0) {
                destinations = destFromArray(r.nodes);
            }
            if (destinations.length === 0) {
                const routeTarget =
                    pickString(r.target) ||
                    pickString(r.targetId) ||
                    pickString(r.cwsp_route_target);
                if (routeTarget) destinations = [routeTarget];
            }
            const target =
                destinations[0] || resolveTarget(r) || "broadcast";
            const type =
                pickString(r.what as string | undefined) ||
                pickString(r.type) ||
                pickString(r.action) ||
                DEFAULT_FRAME_TYPE;
            const from =
                pickString(r.sender) ||
                pickString(r.from) ||
                pickString(r.byId) ||
                sourceId ||
                "unknown";
            const namespace =
                pickString(r.namespace) || pickString(r.ns) || DEFAULT_NAMESPACE;
            return {
                ...r,
                type,
                from,
                to: target,
                target,
                destinations: destinations.length ? destinations : undefined,
                nodes: Array.isArray(r.nodes) ? r.nodes : destinations.length ? destinations : undefined,
                namespace,
                payload: r.payload ?? r.data ?? extractPayload(r),
                mode: resolveMode(r),
                transport: (r.transport as NetworkTransport | undefined) || "ws",
                op: r.op,
                what: r.what,
                uuid: r.uuid,
                flags: r.flags,
            } as NormalizedNetworkFrame;
        }
    } catch {
        /* fall through to legacy normalize */
    }

    const target = resolveTarget(frame);
    const payload = extractPayload(frame);
    const type = pickString(frame?.type) || pickString(frame?.action) || DEFAULT_FRAME_TYPE;
    const from = pickString(frame?.from) || sourceId || "unknown";
    const namespace = pickString(frame?.namespace) || pickString(frame?.ns) || DEFAULT_NAMESPACE;
    const targetNs = pickString(frame?.namespace) || pickString(frame?.ns) || namespace;
    const mode = resolveMode(frame);

    return {
        ...frame,
        type,
        from,
        to: target,
        target,
        namespace: targetNs,
        payload,
        mode
    };
};

export const buildFrameLogKey = (frame: NormalizedNetworkFrame): string => {
    return `${frame.from}=>${frame.to}/${frame.namespace}/${frame.type}/${frame.mode}`;
};
