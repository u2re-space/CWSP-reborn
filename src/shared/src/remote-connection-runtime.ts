/*
 * Filename: remote-connection-runtime.ts
 * FullPath: apps/CWSP-reborn/src/shared/src/remote-connection-runtime.ts
 * Change date and time: 15.15.00_24.07.2026
 * Reason for changes: Relocated from views/airpad/config/config — AirPad UI retired;
 *   shared clipboard/network connect hydrate must not live under airpad-view.
 *   2026-07-19: No dynamic import() on module-load path (illegal in MV3 ServiceWorker).
 */
// =========================
// Remote connection / clipboard-shell runtime config
// =========================
//
// @see cwsp-shared/airpad-cwsp-client-parity — fleet localStorage vs CWSAndroid ApplicationSettings (`cwsp.*`).
// @see runtime/cwsp/endpoint/SPECIFICATION-v2.md — coordinator wire (docs only; not a code dependency).


import type { AppSettings } from "com/config/SettingsTypes";
import {
    parseWireTargetList,
    wireTargetNodeIds,
    type WireTargetEntry
} from "cwsp-shared/wire-target-id";
import {
    mergeDeviceAliasMap,
    resolveDestinationEntries,
} from "cwsp-shared/v2/device-aliases";
import {
    resolveWireArchetype,
    resolveWireConnectionType,
} from "cwsp-shared/cws-client-wire-defaults";
import {
    hasExplicitConnectOrigin,
    looksLikeConnectHost,
    migrateLegacyCwspPublicPort,
    normalizeConnectHostInput,
    resolveConnectHostToOrigin,
    splitConnectHostList
} from "cwsp-shared/cwsp-endpoint-resolve";
import { withTimeout } from "@fest-lib/core";
import {
    isCapacitorCwsNativeShell,
    patchNativeUnifiedSettingsDetailed
} from "com/routing/native/cws-bridge";
import {
    AIRPAD_REMOTE_CONFIG_STORAGE_KEY,
    CWSP_REMOTE_CONNECTION_JSON_VERSION,
    DEFAULT_DESK_WIRE_NODE_ID,
    FLEET_GATEWAY_WIRE_NODE_ID,
    appSettingsToRemoteConnectionV1,
    appSettingsShellToNativeExtras,
    inferDirectHttpsOriginFromConnectInput,
    isAssociableFleetWireNodeId,
    isFleetDeskWireNodeId,
    isExplicitFleetGatewayTarget,
    isFleetGatewayWireNodeId,
    isGatewayHttpsOrigin,
    normalizeWireNodeIdForWire,
    isGuestPrivateLanIpv4,
    isOffHomeFleetNetwork,
    resolveDeskDirectOriginFromWireNodeId,
    resolveFleetGatewayConnectOrigins,
    resolveWanGatewayConnectOrigin,
    sanitizeFleetRouteTarget,
    sanitizeFleetSelfWireNodeId,
    shouldConnectViaFleetGateway,
    shouldFleetDeskGatewayProbeFallbacks,
    resolveFleetDeskProbeWireNodeId,
    shouldPreferWanGatewayForAirpad,
    stringifyCwspRemoteConnectionV1,
    toShortFleetWireNodeId,
    fleetWireNodeIdsEquivalent,
    wireNodeIdToBareConnectHost,
    wireNodeIdToLanHost,
    type CwspRemoteConnectionV1
} from "cwsp-shared/airpad-cwsp-client-parity";
import {
    getAirpadMotionRateController,
    inferAirpadMotionPathClass,
    motionIntervalMsForHz,
    type AirpadMotionPathClass
} from "cwsp-shared/airpad-motion-adaptive";
import { invalidateAirpadTransportCredentials } from "cwsp-shared/transport-credential-bridge";

export type { WireTargetEntry };

type RemoteProtocol = 'auto' | 'http' | 'https';
export type AirpadTransportMode = "plaintext" | "secure";

/** Persisted `localStorage` row — {@link CwspRemoteConnectionV1} (subsystem runtime parity module). */
interface StoredRemoteConfig extends CwspRemoteConnectionV1 {
}
interface MigratedRemoteConfig extends StoredRemoteConfig {
    _legacyMigrated?: boolean;
}

const toTrimmedString = (value: unknown): string => {
    if (typeof value === "number") return Number.isFinite(value) ? String(value) : "";
    return typeof value === "string" ? value.trim() : "";
};
const hasExplicitPort = (value: string): boolean => {
    const valueTrimmed = value.trim();
    if (!valueTrimmed) return false;
    const hostSpec = valueTrimmed.replace(/^[a-z][a-z0-9+.-]*:\/\//i, "").split("/")[0];
    const at = hostSpec.lastIndexOf(":");
    if (at <= 0) return false;
    const port = hostSpec.slice(at + 1);
    return /^\d{1,5}$/.test(port);
};
const appendPort = (value: string, port: string): string => {
    const valueTrimmed = value.trim();
    if (!valueTrimmed) return "";
    const portTrimmed = port.trim();
    if (!portTrimmed) return valueTrimmed;
    if (hasExplicitPort(valueTrimmed)) return valueTrimmed;
    return `${valueTrimmed}:${portTrimmed}`;
};

const normalizeOriginUrl = (value: unknown): string => normalizeConnectHostInput(toTrimmedString(value));

const normalizeWireTransport = (value: unknown): "ws" | undefined => {
    const raw = toTrimmedString(value).toLowerCase();
    if (!raw) return undefined;
    // COMPAT: old AirPad/CWSAndroid settings stored Socket.IO as a peer option.
    // Native `/ws` is now the only active web/Capacitor realtime rail.
    if (raw === "ws" || raw === "wss" || raw === "socket" || raw === "socket.io" || raw === "socketio") return "ws";
    return undefined;
};

const looksLikeConnectUrl = looksLikeConnectHost;

const normalizeWireNodeId = normalizeWireNodeIdForWire;

const joinUniqueUrls = (...values: Array<string | undefined>): string => {
    return Array.from(
        new Set(
            values
                .map((entry) => normalizeOriginUrl(entry))
                .filter(Boolean)
        )
    ).join(", ");
};

/** If AirPad storage says `https://<this-host>:8434` but the app tab is `https://<this-host>/` (443), use tab origin. */

/** Control SPA / markdown hosts — never a CWSP hub `/ws` target. */
const CONTROL_SPA_PAGE_HOSTS = new Set([
    "cwsp.u2re.space",
    "www.cwsp.u2re.space",
    "md.u2re.space",
    "www.md.u2re.space"
]);

const isControlSpaHostName = (host: string): boolean =>
    CONTROL_SPA_PAGE_HOSTS.has(String(host || "").trim().toLowerCase());

const isControlSpaPage = (): boolean => {
    try {
        if (
            String(document.documentElement?.dataset?.cwspSurface || "")
                .toLowerCase()
                .trim() === "cwsp-control"
        ) {
            return true;
        }
    } catch {
        /* ignore */
    }
    try {
        return isControlSpaHostName(String(globalThis.location?.hostname || ""));
    } catch {
        return false;
    }
};

const urlIsControlSpaOrigin = (urlStr: string): boolean => {
    const trimmed = toTrimmedString(urlStr);
    if (!trimmed) return false;
    try {
        const raw = /^[a-z][a-z0-9+.-]*:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
        return isControlSpaHostName(new URL(raw).hostname);
    } catch {
        return /cwsp\.u2re\.space|md\.u2re\.space/i.test(trimmed);
    }
};

/**
 * Detect public (non-loopback) tab origins so we can ignore dev-only loopback remote URLs in stored settings.
 */
const isBrowserPublicOrigin = (): boolean => {
    if (typeof globalThis.location === "undefined") return false;
    const proto = String(globalThis.location.protocol || "").toLowerCase();
    // WHY: MV3 SW/options use chrome-extension://<id>/ — hostname is the extension id, not a
    // network host. Treating it as "public" rewrote https://127.0.0.1:8434 → wss://<ext-id>:8445
    // (ERR_NAME_NOT_RESOLVED). Same for Firefox/Safari extension schemes.
    if (
        proto === "chrome-extension:" ||
        proto === "moz-extension:" ||
        proto === "safari-web-extension:"
    ) {
        return false;
    }
    const h = String(globalThis.location.hostname || "").toLowerCase();
    if (!h || h === "localhost" || h === "127.0.0.1" || h === "[::1]") return false;
    // Chrome extension ids are 32 chars in a-p; never dialable DNS/IP.
    if (/^[a-p]{32}$/.test(h)) return false;
    return true;
};

const urlHostIsLoopback = (urlStr: string): boolean => {
    const trimmed = toTrimmedString(urlStr);
    if (!trimmed) return false;
    try {
        const raw = /^[a-z][a-z0-9+.-]*:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
        const u = new URL(raw.endsWith("/") ? raw : `${raw.replace(/\/+$/, "")}/`);
        const h = u.hostname.toLowerCase();
        return h === "localhost" || h === "127.0.0.1" || h === "[::1]";
    } catch {
        return false;
    }
};

/**
 * When the tab is on a real deployed host but every configured remote URL is loopback-only,
 * use {@link globalThis.location.origin} at read-time instead so websocket probes reach this deployment.
 * Does not rewrite IndexedDB / AirPad localStorage.
 *
 * INVARIANT: Control SPA (`cwsp.u2re.space`) is not a hub — never rewrite to page origin
 * (that produced `wss://cwsp.u2re.space/ws`). Prefer real URLs or WAN gateway fallback.
 */
const sanitizeLoopbackRemoteOnPublicOrigin = (value: string): string => {
    const trimmed = value.trim();
    if (!trimmed || !isBrowserPublicOrigin()) return trimmed;
    const parts = splitConnectHostList(trimmed);
    if (!parts.length) return trimmed;

    // Strip Control-SPA poisons; keep real relay / desk / gateway URLs.
    const usable = parts.filter((p) => !urlIsControlSpaOrigin(p) && !urlHostIsLoopback(p));
    if (usable.length) return usable.join(", ");

    const onlyLoopbackOrSpa = parts.every((p) => urlHostIsLoopback(p) || urlIsControlSpaOrigin(p));
    if (!onlyLoopbackOrSpa) return trimmed;

    // WHY: public Control SPA + loopback Relay → fleet WAN gateway, not the SPA host.
    if (isControlSpaPage()) {
        return resolveWanGatewayConnectOrigin("");
    }
    try {
        const origin = normalizeOriginUrl(globalThis.location.origin);
        if (urlIsControlSpaOrigin(origin)) return resolveWanGatewayConnectOrigin("");
        return origin;
    } catch {
        return trimmed;
    }
};

const rewriteEndpointToMatchHttpsTab = (originLike: string): string => {
    const trimmed = toTrimmedString(originLike);
    if (!trimmed || typeof globalThis.location === "undefined" || !globalThis.location.hostname) return trimmed;
    // WHY: never collapse https://cwsp.u2re.space:8434 → https://cwsp.u2re.space (not a hub).
    if (urlIsControlSpaOrigin(trimmed) || isControlSpaPage()) return trimmed;
    try {
        const raw = /^[a-z][a-z0-9+.-]*:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
        const u = new URL(raw.endsWith("/") ? raw : `${raw.replace(/\/+$/, "")}/`);
        const tab = globalThis.location;
        if (isControlSpaHostName(u.hostname) || isControlSpaHostName(tab.hostname)) return trimmed;
        if (
            u.hostname === tab.hostname &&
            u.protocol === "https:" &&
            u.port === "8434" &&
            tab.protocol === "https:" &&
            (tab.port === "" || tab.port === "443")
        ) {
            return normalizeOriginUrl(tab.origin);
        }
    } catch {
        /* keep trimmed */
    }
    return trimmed;
};

function loadStoredRemoteConfig(): MigratedRemoteConfig {
    try {
        const raw = globalThis?.localStorage?.getItem?.(AIRPAD_REMOTE_CONFIG_STORAGE_KEY);
        if (!raw) return {};
        const parsed = JSON.parse(raw) as StoredRemoteConfig;
        if (!parsed || typeof parsed !== "object") return {};

        const source = parsed as Record<string, unknown>;
        const sourceHost = migrateLegacyCwspPublicPort(toTrimmedString(source.host));
        const sourceTunnelHost = migrateLegacyCwspPublicPort(toTrimmedString((source as { tunnelHost?: unknown }).tunnelHost));
        const sourcePort = toTrimmedString((source as { port?: unknown }).port);
        if (sourcePort === "8443" || sourcePort === "8343") {
            (source as { port?: string }).port = "8434";
        }
        parsed.host = sourceHost;
        if ((parsed as { tunnelHost?: string }).tunnelHost) {
            (parsed as { tunnelHost?: string }).tunnelHost = sourceTunnelHost;
        }
        parsed.endpointUrl = migrateLegacyCwspPublicPort(toTrimmedString(parsed.endpointUrl));
        parsed.directUrl = migrateLegacyCwspPublicPort(toTrimmedString(parsed.directUrl));
        parsed.quickConnectValue = migrateLegacyCwspPublicPort(toTrimmedString(parsed.quickConnectValue));

        const hasLegacyConfig = sourcePort !== "" || sourceTunnelHost !== "";
        if (!hasLegacyConfig) {
            return parsed;
        }

        const hostParts: string[] = [];
        const seen = new Set<string>();
        const addHostPart = (hostValue: string): void => {
            const merged = sourcePort ? appendPort(hostValue, sourcePort) : hostValue;
            const normalized = merged.trim();
            if (!normalized || seen.has(normalized)) return;
            seen.add(normalized);
            hostParts.push(normalized);
        };

        if (sourceHost) addHostPart(sourceHost);
        if (sourceTunnelHost) addHostPart(sourceTunnelHost);
        if (!sourceHost && !sourceTunnelHost && sourcePort && location?.hostname) {
            addHostPart(`${location.hostname}:${sourcePort}`);
        }

        return {
            ...parsed,
            host: hostParts.join(", "),
            _legacyMigrated: true,
        };
    } catch {
        return {};
    }
}

const readGlobalAirpadValue = (keys: string[]): string => {
    const globalValue = (globalThis as any).AIRPAD_CONFIG;
    for (const key of keys) {
        const direct = (globalThis as any)[key];
        if (typeof direct === "string" && direct.trim()) {
            return direct.trim();
        }
        const fromConfig = globalValue && typeof globalValue === "object" && typeof globalValue[key] === "string" ? globalValue[key] : "";
        if (fromConfig.trim()) {
            return String(fromConfig).trim();
        }
    }
    return "";
};

const scrubStaleGuestAirpadIdentity = (): void => {
    remoteConfig.clientId = sanitizeFleetSelfWireNodeId(remoteConfig.clientId);
    const sanitizedDest = sanitizeFleetRouteTarget(
        remoteConfig.destinationId,
        remoteConfig.endpointUrl
    );
    if (sanitizedDest) {
        remoteConfig.destinationId = sanitizedDest;
    } else if (
        remoteConfig.destinationId &&
        !isAssociableFleetWireNodeId(remoteConfig.destinationId)
    ) {
        remoteConfig.destinationId = "";
    }
};

function persistRemoteConfig(): void {
    scrubStaleGuestAirpadIdentity();
    try {
        const payload: CwspRemoteConnectionV1 = {
            v: CWSP_REMOTE_CONNECTION_JSON_VERSION,
            quickConnectValue: remoteConfig.quickConnectValue,
            endpointUrl: remoteConfig.endpointUrl,
            directUrl: remoteConfig.directUrl,
            destinationId: remoteConfig.destinationId,
            accessToken: remoteConfig.accessToken,
            clientId: remoteConfig.clientId,
            peerInstanceId: remoteConfig.peerInstanceId,
            identificationToken: remoteConfig.identificationToken.trim() || undefined,
            clientAccessToken: remoteConfig.clientAccessToken.trim() || undefined
        };
        const wireTransport = normalizeWireTransport(remoteConfig.wireTransport);
        if (wireTransport) {
            payload.wireTransport = wireTransport;
        }
        globalThis?.localStorage?.setItem?.(AIRPAD_REMOTE_CONFIG_STORAGE_KEY, JSON.stringify(payload));
    } catch {
        // localStorage unavailable (private mode, SSR, etc.)
    }
}

const createPeerInstanceId = (): string => {
    if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
    return `ap-${Date.now().toString(16)}-${Math.random().toString(16).slice(2)}`;
};

// Remote connection settings.
// endpointUrl describes the routed relay / endpoint origin used for proxied sessions.
// directUrl describes the direct AirPad target origin used when bypassing the relay.
// destinationId is optional and describes which peer/device to route to by default.

const remoteConfig: {
    quickConnectValue: string;
    endpointUrl: string;
    directUrl: string;
    accessToken: string;
    destinationId: string;
    clientId: string;
    peerInstanceId: string;
    identificationToken: string;
    clientAccessToken: string;
    wireTransport?: CwspRemoteConnectionV1["wireTransport"];
} = {
    quickConnectValue: "",
    endpointUrl: "",
    directUrl: "",
    accessToken: "",
    destinationId: "",
    clientId: "",
    peerInstanceId: "",
    identificationToken: "",
    clientAccessToken: ""
};

/** IndexedDB “Server” tab: userId fallback for AirPad client identity (CWS_ASSOCIATED_*). */
let coreIdentityBridgeUserId = "";
let coreIdentityBridgeUserKey = "";
let coreIdentityUseForAirpad = true;

/** Shell / Capacitor toggles (coordinator + future native bridges). */
let shellRemoteClipboardEnabled = true;
let shellApplyRemoteToDevice = true;
let shellPushLocalClipboard = false;
let shellClipboardPushIntervalMs = 2000;
let shellClipboardBroadcastTargets = "";
let shellDeviceAliasMap = mergeDeviceAliasMap("", "");
let shellMaintainHubSocket = false;
let shellPreferNativeWebsocket = true;
let shellNativeSmsEnabled = false;
let shellNativeContactsEnabled = true;
let shellAcceptInboundClipboardData = true;
let shellClipboardInboundAllowIds = "";
let shellClipboardShareDestinationIds = "";
let shellAccessTokenBypassesClipboardAllowlist = false;
let shellAcceptContactsBridgeData = false;
let shellAcceptSmsBridgeData = false;
let coreSocketProtocol: RemoteProtocol = "auto";
let coreSocketRouteTarget = "";
let coreSocketSelfId = "";
let coreSocketAccessToken = "";
let coreSocketClientAccessToken = "";
let coreSocketTransportMode: AirpadTransportMode = "plaintext";
let coreSocketTransportSecret = "";
let coreSocketSigningSecret = "";
let coreSocketConnectionType = "";
let coreSocketArchetype = "";
let coreSocketProtocolLanesJson = "";

export let remoteHost = "";

const refreshRemoteHost = (): void => {
    const endpoint = remoteConfig.endpointUrl.trim();
    const direct = remoteConfig.directUrl.trim();
    const rawDest = remoteConfig.destinationId.trim();
    const routeTarget =
        sanitizeFleetRouteTarget(rawDest, endpoint) ||
        (isAssociableFleetWireNodeId(rawDest) ? normalizeWireNodeId(rawDest) : "");
    const routeTargetIsGateway = isFleetGatewayWireNodeId(routeTarget);
    const routeTargetHost = wireNodeIdToLanHost(routeTarget);
    const directMatchesGatewayTarget =
        routeTargetIsGateway &&
        (isGatewayHttpsOrigin(direct) || Boolean(routeTargetHost && direct.includes(routeTargetHost)));

    const parts: string[] = [];
    if (direct && (!routeTargetIsGateway || directMatchesGatewayTarget)) parts.push(direct);

    const fleetDeskProbe =
        !routeTargetIsGateway &&
        (shouldFleetDeskGatewayProbeFallbacks(routeTarget, endpoint, direct) ||
            shouldConnectViaFleetGateway(endpoint, routeTarget));
    if (routeTargetIsGateway) {
        for (const gw of resolveFleetGatewayConnectOrigins(globalThis.location?.hostname)) {
            if (!parts.some((entry) => entry.includes(new URL(gw).hostname))) {
                parts.push(gw);
            }
        }
        if (endpoint && !parts.includes(endpoint)) parts.push(endpoint);
    } else if (fleetDeskProbe) {
        const deskWireId = resolveFleetDeskProbeWireNodeId(routeTarget, endpoint, direct);
        const deskOrigin = resolveDeskDirectOriginFromWireNodeId(deskWireId);
        if (deskOrigin && !parts.some((entry) => entry.includes(wireNodeIdToLanHost(deskWireId)))) {
            parts.push(deskOrigin);
        }
        for (const gw of resolveFleetGatewayConnectOrigins(globalThis.location?.hostname)) {
            if (!parts.some((entry) => entry.includes(new URL(gw).hostname))) {
                parts.push(gw);
            }
        }
        if (endpoint && !parts.includes(endpoint)) parts.push(endpoint);
    } else if (endpoint) {
        parts.push(endpoint);
    }

    remoteHost = joinUniqueUrls(...parts);
};

/**
 * Apply settings from a stored blob (localStorage shape). Safe to call on tab focus / storage events.
 */
function hydrateFromStored(stored: MigratedRemoteConfig): void {
    const legacyHost = toTrimmedString((stored as StoredRemoteConfig).host);
    const legacyRouteTarget = toTrimmedString((stored as StoredRemoteConfig).routeTarget);
    const endpointUrl =
        normalizeOriginUrl((stored as StoredRemoteConfig).endpointUrl) ||
        (legacyRouteTarget ? normalizeOriginUrl(legacyHost) : "");
    const directUrl =
        normalizeOriginUrl((stored as StoredRemoteConfig).directUrl) ||
        (!legacyRouteTarget ? normalizeOriginUrl(legacyHost) : "");
    const quickConnectValue = toTrimmedString((stored as StoredRemoteConfig).quickConnectValue);
    remoteConfig.endpointUrl = rewriteEndpointToMatchHttpsTab(endpointUrl);
    remoteConfig.directUrl = rewriteEndpointToMatchHttpsTab(directUrl);
    remoteConfig.accessToken =
        toTrimmedString((stored as StoredRemoteConfig).accessToken) ||
        toTrimmedString((stored as StoredRemoteConfig).authToken) ||
        "";
    remoteConfig.quickConnectValue =
        quickConnectValue ||
        toTrimmedString((stored as StoredRemoteConfig).destinationId) ||
        legacyRouteTarget ||
        remoteConfig.directUrl;
    remoteConfig.clientId = sanitizeFleetSelfWireNodeId((stored as StoredRemoteConfig).clientId);
    const rawDestination =
        toTrimmedString((stored as StoredRemoteConfig).destinationId) ||
        legacyRouteTarget;
    remoteConfig.destinationId =
        sanitizeFleetRouteTarget(rawDestination, remoteConfig.endpointUrl) ||
        (isAssociableFleetWireNodeId(rawDestination) ? normalizeWireNodeId(rawDestination) : "");
    const storedPeer = toTrimmedString((stored as StoredRemoteConfig).peerInstanceId);
    if (storedPeer) {
        remoteConfig.peerInstanceId = storedPeer;
    } else if (!remoteConfig.peerInstanceId) {
        remoteConfig.peerInstanceId = createPeerInstanceId();
    }
    remoteConfig.identificationToken = toTrimmedString((stored as StoredRemoteConfig).identificationToken);
    remoteConfig.clientAccessToken = toTrimmedString((stored as StoredRemoteConfig).clientAccessToken);
    remoteConfig.wireTransport = normalizeWireTransport((stored as StoredRemoteConfig).wireTransport);
    refreshRemoteHost();
}

const stored = loadStoredRemoteConfig();
hydrateFromStored(stored);
scrubStaleGuestAirpadIdentity();
if (remoteConfig.clientId || remoteConfig.destinationId) {
    persistRemoteConfig();
}

/** Re-probe stored origins with explicit ports only (boot must not block on a full port sweep). */
const rediscoverStoredRemoteUrls = async (): Promise<void> => {
    if (shouldPreferWanGatewayForAirpad(remoteConfig.endpointUrl)) return;
    // WHY: static `hasExplicitConnectOrigin` only — module-load path must not call `import()` (illegal in MV3 SW).
    const input: AirpadRemoteConfigInput = {};
    const probeOpts = { timeoutMs: 1500, maxProbeCandidates: 2 };
    if (remoteConfig.directUrl.trim() && hasExplicitConnectOrigin(remoteConfig.directUrl.trim())) {
        const next = await resolveConnectHostToOrigin(remoteConfig.directUrl.trim(), probeOpts);
        if (next && next !== remoteConfig.directUrl.trim()) input.directUrl = next;
    }
    if (remoteConfig.endpointUrl.trim() && hasExplicitConnectOrigin(remoteConfig.endpointUrl.trim())) {
        const next = await resolveConnectHostToOrigin(remoteConfig.endpointUrl.trim(), probeOpts);
        if (next && next !== remoteConfig.endpointUrl.trim()) input.endpointUrl = next;
    }
    if (Object.keys(input).length) applyAirpadRemoteConfig(input, { persist: true });
};
void rediscoverStoredRemoteUrls();

/** WHY: legacy quick-connect stored `L-192.168.0.110` as destination only — WS had no probe host. */
const repairWireDestinationDirectUrl = async (): Promise<void> => {
    if (remoteConfig.directUrl.trim()) return;
    if (shouldPreferWanGatewayForAirpad(remoteConfig.endpointUrl)) return;
    const fromDest = wireNodeIdToBareConnectHost(remoteConfig.destinationId);
    const fromQuick = wireNodeIdToBareConnectHost(remoteConfig.quickConnectValue);
    const bare = fromDest || fromQuick;
    if (!bare) return;
    const origin =
        inferDirectHttpsOriginFromConnectInput(bare) ||
        (await resolveConnectHostToOrigin(bare, { timeoutMs: 1500, maxProbeCandidates: 2 }));
    if (!origin || origin === remoteConfig.directUrl) return;
    remoteConfig.directUrl = origin;
    if (fromDest) {
        remoteConfig.destinationId = normalizeWireNodeId(remoteConfig.destinationId);
    } else if (fromQuick) {
        remoteConfig.destinationId = normalizeWireNodeId(remoteConfig.quickConnectValue);
    }
    refreshRemoteHost();
    persistRemoteConfig();
};
void repairWireDestinationDirectUrl();

if (!toTrimmedString((stored as StoredRemoteConfig).peerInstanceId)) {
    remoteConfig.peerInstanceId = remoteConfig.peerInstanceId || createPeerInstanceId();
}
const storedAccessToken = toTrimmedString((stored as StoredRemoteConfig).accessToken);
const storedLegacyAuthToken = toTrimmedString((stored as StoredRemoteConfig).authToken);
const storedRaw = globalThis?.localStorage?.getItem?.(AIRPAD_REMOTE_CONFIG_STORAGE_KEY) ?? "";
const hadLegacyPort8443 = /(?<![0-9]):8443(?![0-9])|:8343(?![0-9])/.test(storedRaw);
if (
    hadLegacyPort8443 ||
    (stored as MigratedRemoteConfig)._legacyMigrated === true ||
    !(stored as StoredRemoteConfig).peerInstanceId ||
    (storedLegacyAuthToken && !storedAccessToken) ||
    (stored as CwspRemoteConnectionV1).v !== CWSP_REMOTE_CONNECTION_JSON_VERSION
) {
    persistRemoteConfig();
}

/** Re-read localStorage (e.g. after another tab saved, or before mounting AirPad). */
export function reloadAirpadRemoteConfigFromStorage(): void {
    hydrateFromStored(loadStoredRemoteConfig());
}

/** When another tab updates AirPad settings, refresh in-memory state and crypto caches. */
export function attachAirpadCrossTabConfigSync(): () => void {
    const onStorage = (e: StorageEvent): void => {
        if (e.key !== AIRPAD_REMOTE_CONFIG_STORAGE_KEY || e.newValue == null) return;
        reloadAirpadRemoteConfigFromStorage();
        invalidateAirpadTransportCredentials();
    };
    globalThis.addEventListener?.("storage", onStorage);
    return () => globalThis.removeEventListener?.("storage", onStorage);
}

/** Batch apply from the configuration UI (single persist + optional credential invalidation). */
export type AirpadRemoteConfigInput = {
    endpointUrl?: string;
    directUrl?: string;
    destinationId?: string;
    /** Legacy combined connect host field; maps to endpointUrl for compatibility. */
    host?: string;
    accessToken?: string;
    /** @deprecated Use accessToken */
    authToken?: string;
    /** Legacy routed destination field; maps to destinationId for compatibility. */
    routeTarget?: string;
    clientId?: string;
    /** Native-style wire identification (`cwsp.token`). */
    identificationToken?: string;
    /** Inbound / reverse ACL token (native `clientAccessToken`). */
    clientAccessToken?: string;
    /** Native transport selector when shell does not override. Legacy `socket.io` inputs migrate to `ws`. */
    wireTransport?: CwspRemoteConnectionV1["wireTransport"];
};

export function applyAirpadRemoteConfig(input: AirpadRemoteConfigInput, options?: { persist?: boolean }): void {
    if (input.endpointUrl !== undefined) {
        const next = normalizeOriginUrl(input.endpointUrl);
        // WHY: never persist Control SPA page-host as AirPad Relay /ws target.
        remoteConfig.endpointUrl = urlIsControlSpaOrigin(next) ? "" : next;
    } else if (input.host !== undefined) {
        const next = normalizeOriginUrl(input.host);
        remoteConfig.endpointUrl = urlIsControlSpaOrigin(next) ? "" : next;
    }
    if (input.directUrl !== undefined) {
        remoteConfig.directUrl = normalizeOriginUrl(input.directUrl);
    }
    if (input.accessToken !== undefined) {
        remoteConfig.accessToken = input.accessToken || "";
    } else if (input.authToken !== undefined) {
        remoteConfig.accessToken = input.authToken || "";
    }
    if (input.destinationId !== undefined) {
        remoteConfig.destinationId =
            sanitizeFleetRouteTarget(input.destinationId, remoteConfig.endpointUrl) ||
            (isAssociableFleetWireNodeId(input.destinationId)
                ? normalizeWireNodeId(input.destinationId)
                : "");
    } else if (input.routeTarget !== undefined) {
        remoteConfig.destinationId =
            sanitizeFleetRouteTarget(input.routeTarget, remoteConfig.endpointUrl) ||
            (isAssociableFleetWireNodeId(input.routeTarget)
                ? normalizeWireNodeId(input.routeTarget)
                : "");
    }
    if (input.clientId !== undefined) {
        remoteConfig.clientId = sanitizeFleetSelfWireNodeId(input.clientId);
    }
    if (input.identificationToken !== undefined) {
        remoteConfig.identificationToken = (input.identificationToken || "").trim();
    }
    if (input.clientAccessToken !== undefined) {
        remoteConfig.clientAccessToken = (input.clientAccessToken || "").trim();
    }
    const wireTransport = normalizeWireTransport(input.wireTransport);
    if (wireTransport) {
        remoteConfig.wireTransport = wireTransport;
    }
    refreshRemoteHost();
    if (options?.persist !== false) {
        persistRemoteConfig();
    }
}

/**
 * Project Settings → AirPad `localStorage` ({@link AIRPAD_REMOTE_CONFIG_STORAGE_KEY}) + in-memory remoteConfig.
 * Call after Save on Capacitor/native so NS `/ws` can read the same blob.
 */
export function syncAirpadRemoteConfigFromAppSettings(
    settings: AppSettings,
    options?: { persist?: boolean }
): void {
    const blob = appSettingsToRemoteConnectionV1(settings as unknown as Record<string, unknown>);
    const input: AirpadRemoteConfigInput = {};
    const isCrxRuntime = (() => {
        try {
            const id = (globalThis as { chrome?: { runtime?: { id?: string } } }).chrome?.runtime
                ?.id;
            return typeof id === "string" && id.length > 0;
        } catch {
            return false;
        }
    })();
    // INVARIANT: CRX wire host = shell.localHubUrl; never project CWSP Relay into AirPad connect.
    if (isCrxRuntime) {
        const local =
            String(settings.shell?.localHubUrl || "").trim() || "https://127.0.0.1:8434/";
        input.endpointUrl = local;
    } else if (blob.endpointUrl && !urlIsControlSpaOrigin(blob.endpointUrl)) {
        input.endpointUrl = blob.endpointUrl;
    }
    if (blob.directUrl) input.directUrl = blob.directUrl;
    if (blob.quickConnectValue) input.quickConnectValue = blob.quickConnectValue;
    if (blob.destinationId || blob.routeTarget) {
        const dest = blob.destinationId || blob.routeTarget;
        const sanitized = sanitizeFleetRouteTarget(dest, blob.endpointUrl);
        if (sanitized) input.destinationId = sanitized;
        else if (isAssociableFleetWireNodeId(dest)) input.destinationId = normalizeWireNodeId(dest);
    }
    if (blob.accessToken || blob.authToken) input.accessToken = blob.accessToken || blob.authToken;
    if (blob.clientId) input.clientId = sanitizeFleetSelfWireNodeId(blob.clientId) || undefined;
    if (blob.peerInstanceId) input.peerInstanceId = blob.peerInstanceId;
    if (blob.identificationToken) input.identificationToken = blob.identificationToken;
    if (blob.clientAccessToken) input.clientAccessToken = blob.clientAccessToken;
    if (blob.wireTransport) input.wireTransport = blob.wireTransport;

    const hasData = Boolean(
        input.endpointUrl ||
        input.directUrl ||
        input.quickConnectValue ||
        input.destinationId ||
        input.accessToken ||
        input.clientId ||
        input.peerInstanceId ||
        input.identificationToken ||
        input.clientAccessToken
    );
    if (hasData) {
        applyAirpadRemoteConfig(input, { persist: options?.persist ?? true });
    }
}

const endpointUrlToAirpadConnectHost = (endpointUrl: string): string => {
    try {
        const u = new URL(endpointUrl);
        return `${u.protocol}//${u.host}`;
    } catch {
        return "";
    }
};

/**
 * Apply CrossWord AppSettings shell + identity overlay (call after load/save settings and on boot).
 * Does not clear AirPad localStorage fields; only updates in-memory host/route when shell requests it.
 */
export function applyAirpadRuntimeFromAppSettings(settings: AppSettings): void {
    const core = settings.core;
    const shell = settings.shell;
    const socket = core?.socket;
    const interop = core?.interop;
    coreIdentityBridgeUserId = sanitizeFleetSelfWireNodeId(core?.userId) || "";
    // WHY: ecosystem token replaced separate userKey/accessToken fields; AirPad WS auth must follow.
    coreIdentityBridgeUserKey = String(
        (core as any)?.ecosystemToken || core?.userKey || core?.socket?.accessToken || ""
    ).trim();
    coreIdentityUseForAirpad = (core?.useCoreIdentityForAirPad ?? true) !== false;
    shellRemoteClipboardEnabled = (shell?.enableRemoteClipboardBridge ?? true) !== false;
    shellApplyRemoteToDevice = (shell?.applyRemoteClipboardToDevice ?? true) !== false;
    shellPushLocalClipboard = Boolean(shell?.pushLocalClipboardToLan);
    const intervalRaw = Number(shell?.clipboardPushIntervalMs);
    shellClipboardPushIntervalMs =
        Number.isFinite(intervalRaw) && intervalRaw >= 800 ? Math.min(Math.round(intervalRaw), 60000) : 2000;
    shellClipboardBroadcastTargets = (shell?.clipboardBroadcastTargets || "").trim();
    /** Default off; enable in Settings when background clipboard/hub sync is needed. */
    shellMaintainHubSocket = shell?.maintainHubSocketConnection === true;
    shellPreferNativeWebsocket = (shell?.preferNativeWebsocket ?? interop?.preferNativeWebsocket ?? true) !== false;
    shellNativeSmsEnabled = (shell?.enableNativeSms ?? false) === true;
    shellNativeContactsEnabled = (shell?.enableNativeContacts ?? true) !== false;
    shellAcceptInboundClipboardData = (shell?.acceptInboundClipboardData ?? true) !== false;
    shellClipboardInboundAllowIds = (shell?.clipboardInboundAllowIds || "").trim();
    shellClipboardShareDestinationIds = (shell?.clipboardShareDestinationIds || "").trim();
    shellDeviceAliasMap = mergeDeviceAliasMap(shell?.deviceAliases, shell?.deviceBluetooth);
    shellAccessTokenBypassesClipboardAllowlist = (shell?.accessTokenBypassesClipboardAllowlist ?? false) === true;
    shellAcceptContactsBridgeData = (shell?.acceptContactsBridgeData ?? false) === true;
    shellAcceptSmsBridgeData = (shell?.acceptSmsBridgeData ?? false) === true;
    coreSocketProtocol = socket?.protocol === "http" || socket?.protocol === "https" ? socket.protocol : "auto";
    const routeRaw = (socket?.routeTarget || "").trim();
    coreSocketRouteTarget =
        sanitizeFleetRouteTarget(routeRaw, core?.endpointUrl) ||
        (isAssociableFleetWireNodeId(routeRaw) ? normalizeWireNodeId(routeRaw) : "");
    coreSocketSelfId = sanitizeFleetSelfWireNodeId(socket?.selfId) || "";
    // Prefer Settings Client id over a stale socket.selfId that would otherwise win handshake.
    if (coreIdentityBridgeUserId && coreSocketSelfId && coreSocketSelfId !== coreIdentityBridgeUserId) {
        coreSocketSelfId = "";
    }
    coreSocketAccessToken = (socket?.accessToken || socket?.airpadAuthToken || "").trim();
    coreSocketClientAccessToken = (socket?.clientAccessToken || "").trim();
    coreSocketTransportMode = socket?.transportMode === "secure" ? "secure" : "plaintext";
    coreSocketTransportSecret = (socket?.transportSecret || "").trim();
    coreSocketSigningSecret = (socket?.signingSecret || "").trim();
    coreSocketConnectionType = (socket?.connectionType || "").trim();
    coreSocketArchetype = (socket?.archetype || "").trim();
    coreSocketProtocolLanesJson = (socket?.protocolLanesJson || "").trim();

    const input: AirpadRemoteConfigInput = {};
    // WHY: CRX Extension Local hub (shell.localHubUrl) drives the Chrome wire socket.
    // CWSP Relay (core.endpointUrl) is Neutralino/gateway SoT and must not overwrite it.
    const isCrxRuntime = (() => {
        try {
            const id = (globalThis as { chrome?: { runtime?: { id?: string } } }).chrome?.runtime
                ?.id;
            return typeof id === "string" && id.length > 0;
        } catch {
            return false;
        }
    })();
    const wireUrl = isCrxRuntime
        ? String(shell?.localHubUrl || "").trim() || "https://127.0.0.1:8434/"
        : String(core?.endpointUrl || "").trim();
    if (wireUrl) {
        const origin = endpointUrlToAirpadConnectHost(rewriteEndpointToMatchHttpsTab(wireUrl));
        if (origin) input.endpointUrl = origin;
    }
    if (Object.keys(input).length) {
        applyAirpadRemoteConfig(input, { persist: false });
    }
    syncAirpadRemoteConfigFromAppSettings(settings, { persist: false });
    try {
        (globalThis as unknown as { __CWS_SHELL_FEATURES__?: Record<string, boolean> }).__CWS_SHELL_FEATURES__ = {
            clipboardBridge: shellRemoteClipboardEnabled,
            applyRemoteClipboard: shellApplyRemoteToDevice,
            pushLocalClipboard: shellPushLocalClipboard,
            maintainHubSocket: shellMaintainHubSocket,
            preferNativeWebsocket: shellPreferNativeWebsocket,
            sms: shellNativeSmsEnabled,
            contacts: shellNativeContactsEnabled
        };
    } catch {
        // ignore
    }
}

function getClipboardBroadcastTargetEntries(): WireTargetEntry[] {
    const fromExplicit = resolveDestinationEntries(shellClipboardBroadcastTargets, shellDeviceAliasMap);
    if (fromExplicit.length) return fromExplicit;
    const route = getRemoteRouteTarget().trim();
    if (route) return resolveDestinationEntries(route, shellDeviceAliasMap);
    // WHY: desktop Neutralino/WebNative must fan-out clipboard even when the Network
    // view has no explicit route target yet (empty destinations = coordinator broadcast).
    if (isDesktopCwspShell()) return parseWireTargetList("*");
    return [];
}

/** True for Neutralino / WebNative desktop shells (not Capacitor/PWA-only). */
export function isDesktopCwspShell(): boolean {
    try {
        const g = globalThis as unknown as {
            __CWS_NEUTRALINO_BOOT__?: boolean;
            __CWS_WEBNATIVE_BOOT__?: boolean;
            __NEUTRALINO_AUTH__?: unknown;
            NL_OS?: string;
            Neutralino?: unknown;
        };
        if (g.__CWS_NEUTRALINO_BOOT__ || g.__CWS_WEBNATIVE_BOOT__) return true;
        if (g.__NEUTRALINO_AUTH__ || g.Neutralino || typeof g.NL_OS === "string") return true;
    } catch {
        /* ignore */
    }
    return false;
}

/**
 * Neutralino / WebNative Win/Linux: Node clipboard-hub owns LAN sync.
 * INVARIANT: WebView must not push/apply remote clipboard when this is true.
 */
export function isNeutralinoNodeClipboardHubOwned(): boolean {
    try {
        const g = globalThis as unknown as {
            __CWS_NODE_CLIPBOARD_HUB__?: boolean;
            __CWS_NEUTRALINO_BOOT__?: boolean;
            __CWS_WEBNATIVE_BOOT__?: boolean;
            NL_OS?: string;
            Neutralino?: unknown;
        };
        // WHY: public https Control SPA must never poll desk Node clipboard-hub (401 flood).
        // Real Neutralino WebView has NL_OS / Neutralino globals.
        try {
            const host = String(location.hostname || "");
            const publicHttps =
                location.protocol === "https:" &&
                host !== "localhost" &&
                host !== "127.0.0.1";
            if (publicHttps && !g.Neutralino && typeof g.NL_OS !== "string") {
                return false;
            }
        } catch {
            /* ignore */
        }
        // WHY: /cwsp → Capacitor Control API sets BOOT flags but explicitly disables Node hub.
        if (g.__CWS_NODE_CLIPBOARD_HUB__ === false) return false;
        if (g.__CWS_NODE_CLIPBOARD_HUB__ === true) return true;
        // Neutralino/WebNative shell defaults to Node-owned clipboard even before auth inject.
        if (
            g.__CWS_NEUTRALINO_BOOT__ ||
            g.__CWS_WEBNATIVE_BOOT__ ||
            g.Neutralino ||
            typeof g.NL_OS === "string"
        ) {
            return true;
        }
    } catch {
        /* ignore */
    }
    return false;
}

export function isShellRemoteClipboardBridgeEnabled(): boolean {
    return shellRemoteClipboardEnabled !== false;
}

export function isApplyRemoteClipboardToDeviceEnabled(): boolean {
    // WHY: Neutralino applies OS clipboard in Node clipboard-hub / ProtocolServer.
    if (isNeutralinoNodeClipboardHubOwned()) return false;
    return shellApplyRemoteToDevice !== false;
}

export function isPushLocalClipboardToLanEnabled(): boolean {
    // WHY: Neutralino/WebNative polls + pushes from Node hub, not from WebView websocket.ts.
    if (isNeutralinoNodeClipboardHubOwned()) return false;
    if (shellPushLocalClipboard === true) return true;
    return false;
}

export function getClipboardPushIntervalMs(): number {
    return shellClipboardPushIntervalMs;
}

/** Device ids for outbound clipboard acts (`ID` or `ID::token`, comma/semicolon). */
export function getClipboardBroadcastTargetNodes(): string[] {
    return wireTargetNodeIds(getClipboardBroadcastTargetEntries());
}

/** Parsed outbound clipboard entries including optional per-id access tokens. */
export function getClipboardBroadcastWireTargets(): WireTargetEntry[] {
    return getClipboardBroadcastTargetEntries();
}

/** When false, ignore inbound clipboard payloads (coordinator still may run for other ops). */
export function isShellClipboardInboundEnabled(): boolean {
    return shellAcceptInboundClipboardData !== false;
}

/** Parsed allow list for inbound clipboard senders; empty means any sender (unless bypass rules apply). */
export function getClipboardInboundAllowIds(): string[] {
    return wireTargetNodeIds(resolveDestinationEntries(shellClipboardInboundAllowIds, shellDeviceAliasMap));
}

/** True when access token bypass of inbound allow list is enabled and a token is configured. */
export function shouldBypassClipboardInboundAllowlistWithAccessToken(): boolean {
    return shellAccessTokenBypassesClipboardAllowlist && Boolean(getAccessToken().trim());
}

/** COMPAT: `L-110` ≡ `L-192.168.0.110` (prefer short fleet form for allowlist compare). */
export function normalizeClipboardPeerId(value: string): string {
    const raw = value.trim();
    if (!raw) return "";
    const short = toShortFleetWireNodeId(raw);
    if (short) return short.toLowerCase();
    const normalized = normalizeWireNodeIdForWire(raw);
    if (normalized) return normalized.toLowerCase();
    if (/^\d{1,3}(?:\.\d{1,3}){3}(?::\d+)?$/.test(raw)) return `l-${raw}`.toLowerCase();
    return raw.toLowerCase();
}

/**
 * Keep `/ws` up for inbound/outbound clipboard outside the AirPad/Network view.
 * Capacitor Android only — Neutralino clipboard hub lives in Node.
 */
export function isClipboardHubBootstrapEnabled(): boolean {
    if (isNeutralinoNodeClipboardHubOwned()) return false;
    try {
        if (isDesktopCwspShell()) {
            // Non-Neutralino desktop (e.g. plain WebNative) may still bootstrap.
            return isShellRemoteClipboardBridgeEnabled() && isApplyRemoteClipboardToDeviceEnabled();
        }
        const c = (globalThis as { Capacitor?: { isNativePlatform?: () => boolean } }).Capacitor;
        const native = typeof c?.isNativePlatform === "function" && Boolean(c.isNativePlatform());
        if (!native) return false;
    } catch {
        return false;
    }
    return isShellRemoteClipboardBridgeEnabled() && isApplyRemoteClipboardToDeviceEnabled();
}

/**
 * Inbound clipboard from `senderId` (peer / device id on the wire). Respects allow list unless bypassed by access token.
 */
export function isClipboardSenderAllowedForInbound(senderId: string): boolean {
    if (!isShellClipboardInboundEnabled()) return false;
    if (!isShellRemoteClipboardBridgeEnabled()) return false;
    if (shouldBypassClipboardInboundAllowlistWithAccessToken()) return true;
    const allow = parseWireTargetList(shellClipboardInboundAllowIds);
    if (!allow.length) return true;
    const s = String(senderId || "").trim();
    if (!s) return false;
    return allow.some((e) => fleetWireNodeIdsEquivalent(e.nodeId, s) || normalizeClipboardPeerId(e.nodeId) === normalizeClipboardPeerId(s));
}

/**
 * Destinations for share-target / quick-send clipboard; when unset, uses {@link getClipboardBroadcastTargetNodes}.
 */
export function getClipboardShareDestinationNodes(): string[] {
    const share = resolveDestinationEntries(shellClipboardShareDestinationIds, shellDeviceAliasMap);
    if (share.length) return wireTargetNodeIds(share);
    return getClipboardBroadcastTargetNodes();
}

/** Share / quick-send entries with optional `ID::token` (see {@link getClipboardShareDestinationNodes}). */
export function getClipboardShareDestinationWireTargets(): WireTargetEntry[] {
    const share = resolveDestinationEntries(shellClipboardShareDestinationIds, shellDeviceAliasMap);
    if (share.length) return share;
    return getClipboardBroadcastTargetEntries();
}

/** Future: contacts payloads from native bridge. */
export function isShellContactsBridgeDataAccepted(): boolean {
    return shellAcceptContactsBridgeData === true;
}

/** Future: SMS payloads from native bridge. */
export function isShellSmsBridgeDataAccepted(): boolean {
    return shellAcceptSmsBridgeData === true;
}

/** Background WebSocket to cwsp / endpoint hub (any shell, not only AirPad view). */
export function isMaintainHubSocketConnectionEnabled(): boolean {
    return shellMaintainHubSocket === true;
}

export function isPreferNativeWebsocketEnabled(): boolean {
    return shellPreferNativeWebsocket !== false;
}

/** Reserved for native integration (CWSAndroid-style). */
export function isShellNativeSmsEnabled(): boolean {
    return shellNativeSmsEnabled !== false;
}

/** Reserved for native integration (CWSAndroid-style). */
export function isShellNativeContactsEnabled(): boolean {
    return shellNativeContactsEnabled !== false;
}

// Configuration getters and setters
export function getRemoteHost(): string {
    const sanitized = sanitizeLoopbackRemoteOnPublicOrigin(remoteHost);
    const endpoint =
        remoteConfig.endpointUrl.trim() ||
        normalizeOriginUrl(readGlobalAirpadValue(["AIRPAD_ENDPOINT_URL"]));
    const routeTarget = getRemoteRouteTarget().trim();
    if (shouldPreferWanGatewayForAirpad(endpoint)) {
        return resolveWanGatewayConnectOrigin(endpoint);
    }
    // INVARIANT: never dial Control SPA page as /ws host.
    if (!sanitized || urlIsControlSpaOrigin(sanitized)) {
        if (endpoint && !urlIsControlSpaOrigin(endpoint) && !urlHostIsLoopback(endpoint)) {
            return endpoint;
        }
        if (isControlSpaPage() || isBrowserPublicOrigin()) {
            return resolveWanGatewayConnectOrigin(endpoint);
        }
        return "";
    }
    return sanitized;
}

export function getAirPadEndpointUrl(): string {
    if (remoteConfig.endpointUrl.trim()) return remoteConfig.endpointUrl.trim();
    const fromGlobal = normalizeOriginUrl(readGlobalAirpadValue(["AIRPAD_ENDPOINT_URL"]));
    if (fromGlobal) return fromGlobal;
    if (isOffHomeFleetNetwork()) {
        return resolveWanGatewayConnectOrigin("");
    }
    return "";
}

export function getAirPadDirectTargetUrl(): string {
    return remoteConfig.directUrl.trim();
}

/**
 * Quick-connect value shown in the AirPad popup (plus optional auth pass field).
 * Prefer an explicit target device id first, otherwise show the current direct/url target.
 */
export function getAirPadQuickConnectTarget(): string {
    if (remoteConfig.quickConnectValue.trim()) return remoteConfig.quickConnectValue.trim();
    if (remoteConfig.destinationId.trim()) return remoteConfig.destinationId.trim();
    if (remoteConfig.directUrl.trim()) return remoteConfig.directUrl.trim();
    if (coreSocketRouteTarget.trim()) return coreSocketRouteTarget.trim();
    return getAirPadEndpointUrl();
}

/**
 * Quick-connect accepts either a target device id (routed through the Server-tab
 * endpoint URL) or a direct host/IP/domain (port auto-discovered when omitted).
 */
export async function setAirPadQuickConnectTarget(
    value: string,
    opts: {
        /** When false, skip `/lna-probe` port sweep — use inferred `https://host:8434/` instead. */
        discover?: boolean;
        probeTimeoutMs?: number;
        maxProbeCandidates?: number;
    } = {}
): Promise<void> {
    const trimmed = toTrimmedString(value);
    remoteConfig.quickConnectValue = trimmed;
    if (!trimmed) {
        remoteConfig.directUrl = "";
        remoteConfig.destinationId = "";
        refreshRemoteHost();
        persistRemoteConfig();
        return;
    }
    const probeOpts = {
        timeoutMs: opts.probeTimeoutMs ?? 1200,
        maxProbeCandidates: opts.maxProbeCandidates
    };
    const wireBare = wireNodeIdToBareConnectHost(trimmed);
    if (looksLikeConnectUrl(trimmed)) {
        const inferred = inferDirectHttpsOriginFromConnectInput(trimmed);
        if (opts.discover === false) {
            remoteConfig.directUrl = inferred || normalizeConnectHostInput(trimmed);
        } else {
            remoteConfig.directUrl =
                (await resolveConnectHostToOrigin(trimmed, { discover: true, ...probeOpts })) ||
                inferred ||
                normalizeConnectHostInput(trimmed);
        }
        remoteConfig.destinationId =
            inferControlNodeIdFromUrl(remoteConfig.directUrl) ||
            (isGatewayHttpsOrigin(trimmed) ? FLEET_GATEWAY_WIRE_NODE_ID : "");
    } else if (wireBare) {
        const inferred = inferDirectHttpsOriginFromConnectInput(wireBare);
        if (opts.discover === false) {
            remoteConfig.directUrl = inferred || normalizeConnectHostInput(wireBare);
        } else {
            remoteConfig.directUrl =
                inferred ||
                (await resolveConnectHostToOrigin(wireBare, { discover: true, ...probeOpts })) ||
                normalizeConnectHostInput(wireBare);
        }
        remoteConfig.destinationId =
            sanitizeFleetRouteTarget(trimmed, remoteConfig.endpointUrl) ||
            (isExplicitFleetGatewayTarget(trimmed) ? FLEET_GATEWAY_WIRE_NODE_ID : "") ||
            (isAssociableFleetWireNodeId(trimmed) ? normalizeWireNodeId(trimmed) : DEFAULT_DESK_WIRE_NODE_ID);
    } else {
        remoteConfig.destinationId =
            sanitizeFleetRouteTarget(trimmed, remoteConfig.endpointUrl) ||
            (isAssociableFleetWireNodeId(trimmed) ? normalizeWireNodeId(trimmed) : "");
        remoteConfig.directUrl = "";
    }
    refreshRemoteHost();
    persistRemoteConfig();
}

/** Push AirPad popup settings into CWSAndroid prefs + trigger native {@code CwspRuntime.reloadSettings}. */
export async function syncAirpadRemoteConfigToNativeShell(): Promise<{ ok: boolean; error?: string }> {
    const NATIVE_SYNC_TIMEOUT_MS = 6000;
    try {
        // WHY: static imports — CRX SW / shared Settings save must not call `import()`.
        if (!isCapacitorCwsNativeShell()) return { ok: true };
        const nativeExtras = appSettingsShellToNativeExtras({
            endpointUrl: remoteConfig.endpointUrl,
            directUrl: remoteConfig.directUrl,
            quickConnectValue: remoteConfig.quickConnectValue,
            destinationId: remoteConfig.destinationId,
            accessToken: remoteConfig.accessToken,
            identificationToken: remoteConfig.identificationToken,
            clientAccessToken: remoteConfig.clientAccessToken,
            clientId: remoteConfig.clientId,
            peerInstanceId: remoteConfig.peerInstanceId,
            wireTransport: "ws"
        });
        const patch: Record<string, unknown> = {
            core: {
                endpointUrl: remoteConfig.endpointUrl || undefined,
                ops: { directUrl: remoteConfig.directUrl || undefined },
                network: { quickConnect: remoteConfig.quickConnectValue || undefined },
                socket: {
                    routeTarget: remoteConfig.destinationId || undefined,
                    accessToken: remoteConfig.accessToken || undefined,
                    selfId: remoteConfig.clientId || undefined,
                    clientAccessToken: remoteConfig.clientAccessToken || undefined
                },
                userKey: remoteConfig.identificationToken || undefined,
                appClientId: remoteConfig.peerInstanceId || undefined,
                ...nativeExtras
            }
        };
        return await withTimeout(
            patchNativeUnifiedSettingsDetailed(patch),
            NATIVE_SYNC_TIMEOUT_MS,
            "native settings sync timed out"
        ).catch((error: unknown) => ({
            ok: false,
            error: String(error instanceof Error ? error.message : error)
        }));
    } catch (error) {
        return { ok: false, error: String(error instanceof Error ? error.message : error) };
    }
}

export async function setRemoteHost(host: string): Promise<void> {
    remoteConfig.endpointUrl = await resolveConnectHostToOrigin(host);
    refreshRemoteHost();
    persistRemoteConfig();
}

export function getRemoteProtocol(): RemoteProtocol {
    return coreSocketProtocol;
}

/** Infer canonical peer id (e.g. `L-192.168.0.110`) from a direct connect URL/host. */
const inferControlNodeIdFromUrl = (value: string): string => {
    const normalized = normalizeOriginUrl(value);
    if (!normalized) return "";
    let nodeId = "";
    try {
        const withScheme = /^[a-z][a-z0-9+.-]*:\/\//i.test(normalized)
            ? normalized
            : `https://${normalized}`;
        const host = new URL(withScheme).hostname.trim();
        if (host) {
            nodeId = /^L-/i.test(host) ? host : `L-${host}`;
        }
    } catch {
        const bare = normalized.replace(/^[a-z][a-z0-9+.-]*:\/\//i, "").split("/")[0]?.split(":")[0]?.trim() || "";
        if (bare) {
            nodeId = /^L-/i.test(bare) ? bare : `L-${bare}`;
        }
    }
    if (isFleetGatewayWireNodeId(nodeId)) return FLEET_GATEWAY_WIRE_NODE_ID;
    if (isAssociableFleetWireNodeId(nodeId)) return normalizeWireNodeId(nodeId);
    if (isGatewayHttpsOrigin(value)) return FLEET_GATEWAY_WIRE_NODE_ID;
    return "";
};

const isGatewayWireNode = (value: string): boolean => {
    const normalized = normalizeWireNodeId(value).toLowerCase();
    return (
        normalized === "l-192.168.0.200" ||
        normalized === "l-45.147.121.152" ||
        normalized.includes("gateway")
    );
};

/**
 * Coordinator routing target for mouse/keyboard/clipboard acts and handshake hints.
 * Empty string means "execute on the peer we are socket-connected to" (direct mode).
 */
export function getRemoteRouteTarget(): string {
    if (remoteConfig.destinationId.trim()) {
        const sanitized = sanitizeFleetRouteTarget(
            remoteConfig.destinationId,
            remoteConfig.endpointUrl
        );
        if (sanitized) return sanitized;
        if (isAssociableFleetWireNodeId(remoteConfig.destinationId)) {
            return remoteConfig.destinationId.trim();
        }
    }

    const endpoint = remoteConfig.endpointUrl.trim();
    const quick = remoteConfig.quickConnectValue.trim();
    if (quick) {
        const sanitized = sanitizeFleetRouteTarget(quick, endpoint);
        if (sanitized) return sanitized;
        if (isGatewayHttpsOrigin(quick)) return FLEET_GATEWAY_WIRE_NODE_ID;
        if (isAssociableFleetWireNodeId(quick)) return normalizeWireNodeId(quick);
    }

    const direct = remoteConfig.directUrl.trim();
    if (direct) {
        if (isGatewayHttpsOrigin(direct)) return FLEET_GATEWAY_WIRE_NODE_ID;
        const inferred = inferControlNodeIdFromUrl(direct);
        if (inferred) return inferred;
        if (endpoint && isGatewayHttpsOrigin(endpoint)) return DEFAULT_DESK_WIRE_NODE_ID;
        return "";
    }

    const fromCore = coreSocketRouteTarget.trim();
    if (fromCore) {
        if (isFleetGatewayWireNodeId(fromCore)) return normalizeWireNodeId(fromCore);
        if (!isGatewayWireNode(fromCore)) return fromCore;
    }
    if (endpoint && isGatewayHttpsOrigin(endpoint)) {
        if (isFleetDeskWireNodeId(fromCore)) return normalizeWireNodeId(fromCore);
        if (isFleetGatewayWireNodeId(fromCore)) return FLEET_GATEWAY_WIRE_NODE_ID;
        return DEFAULT_DESK_WIRE_NODE_ID;
    }
    return fromCore || "";
}

export function getAirPadDestinationId(): string {
    return getRemoteRouteTarget();
}

export function getAirPadTransportMode(): AirpadTransportMode {
    return coreSocketTransportMode;
}

/** Resolved access / control token (local overlay, settings, then env globals). */
export function getAccessToken(): string {
    const local = (remoteConfig.accessToken || "").trim();
    if (local) return local;
    if (coreSocketAccessToken.trim()) return coreSocketAccessToken.trim();
    // WHY: ecosystem token is mirrored into coreIdentityBridgeUserKey by applyAirpadRuntime.
    if (coreIdentityBridgeUserKey.trim()) return coreIdentityBridgeUserKey.trim();
    return readGlobalAirpadValue([
        "CWS_ACCESS_TOKEN",
        "CWS_ASSOCIATED_TOKEN",
        "ACCESS_TOKEN",
        "AIRPAD_AUTH_TOKEN",
        "AIRPAD_TOKEN",
        "CWS_AUTH_TOKEN",
        "HUB_AUTH_TOKEN",
        "MASTER_AUTH_TOKEN",
        "CONTROL_TOKEN",
        "ADMIN_TOKEN"
    ]);
}

/** @deprecated Use {@link getAccessToken} */
export function getAirPadAuthToken(): string {
    return getAccessToken();
}

export function setAccessToken(token: string): void {
    remoteConfig.accessToken = token || "";
    persistRemoteConfig();
}

/** @deprecated Use {@link setAccessToken} */
export function setAirPadAuthToken(token: string): void {
    setAccessToken(token);
}

export function getAirPadClientId(): string {
    // WHY: Settings "Client id" (core.userId → coreIdentityBridgeUserId) is the user-facing source.
    // socket.selfId / AirPad popup clientId must not preempt it when core.userId is set.
    const candidates = [
        coreIdentityUseForAirpad ? coreIdentityBridgeUserId.trim() : "",
        coreSocketSelfId.trim(),
        remoteConfig.clientId.trim(),
        readGlobalAirpadValue(["AIRPAD_CLIENT_ID", "AIRPAD_CLIENT"])
    ];
    for (const entry of candidates) {
        const sanitized = sanitizeFleetSelfWireNodeId(entry);
        if (sanitized) return sanitized;
    }
    return "";
}

export function getAssociatedClientToken(): string {
    return coreIdentityBridgeUserKey.trim();
}

/** Optional future-facing access token when this client acts as an inbound WS / reverse-server peer. */
export function getClientAccessToken(): string {
    const local = coreSocketClientAccessToken.trim();
    if (local) return local;
    const fromRemote = remoteConfig.clientAccessToken.trim();
    if (fromRemote) return fromRemote;
    return readGlobalAirpadValue(["CWS_CLIENT_ACCESS_TOKEN", "CLIENT_ACCESS_TOKEN"]);
}

export function setAirPadClientId(clientId: string): void {
    remoteConfig.clientId = sanitizeFleetSelfWireNodeId(clientId);
    persistRemoteConfig();
}

export function setRemoteRouteTarget(routeTarget: string): void {
    remoteConfig.destinationId =
        sanitizeFleetRouteTarget(routeTarget, remoteConfig.endpointUrl) ||
        (isAssociableFleetWireNodeId(routeTarget) ? normalizeWireNodeId(routeTarget) : "");
    persistRemoteConfig();
}

export function getAirPadPeerInstanceId(): string {
    const env = readGlobalAirpadValue(["AIRPAD_PEER_INSTANCE_ID", "AIRPAD_DEVICE_ID"]);
    if (env.trim()) return env.trim();
    return remoteConfig.peerInstanceId || "";
}

export function setAirPadPeerInstanceId(id: string): void {
    remoteConfig.peerInstanceId = toTrimmedString(id) || createPeerInstanceId();
    persistRemoteConfig();
}

export function getAirPadTransportSecret(): string {
    return coreSocketTransportSecret;
}

export function getAirPadSigningSecret(): string {
    return coreSocketSigningSecret;
}

/** Handshake `connectionType` before gateway `first-order` normalization (Settings → env → default). */
export function getAirPadHandshakeConnectionType(): string {
    const fromSettings = coreSocketConnectionType.trim();
    if (fromSettings) return resolveWireConnectionType(fromSettings);
    return resolveWireConnectionType(
        readGlobalAirpadValue(["CWS_CONNECTION_TYPE", "AIRPAD_CONNECTION_TYPE"])
    );
}

/** Handshake `archetype` (Settings → env → default). */
export function getAirPadHandshakeArchetype(): string {
    const fromSettings = coreSocketArchetype.trim();
    if (fromSettings) return resolveWireArchetype(fromSettings);
    return resolveWireArchetype(readGlobalAirpadValue(["CWS_ARCHETYPE", "AIRPAD_ARCHETYPE"]));
}

/**
 * Optional JSON mirroring config-v2 `Protocols`; reserved for tooling / future wire hints.
 */
export function getAirPadProtocolLanesJson(): string {
    const fromSettings = coreSocketProtocolLanesJson.trim();
    if (fromSettings) return fromSettings;
    return readGlobalAirpadValue(["CWS_PROTOCOL_LANES_JSON"]).trim();
}

// Направление и выбор осей (подбирается под телефон)
export let gyroDirX = -1;
export let gyroDirY = -1;
export let gyroDirZ = -1;

//
export let gyroSrcForMouseX = 'az';
export let gyroSrcForMouseY = 'ax';
export let gyroSrcForMouseZ = 'ay';

//
export let accelDirX = -1;
export let accelDirY = -1;
export let accelDirZ = 1;

//
export let accelSrcForMouseX = 'ay';
export let accelSrcForMouseY = 'ax';
export let accelSrcForMouseZ = 'az';


// Направление и выбор осей для мыши
//let dirX = +1;  // или -1
//let dirY = -1;  // или +1
//let srcForMouseX = 'ax'; // будем использовать 'ax' как "угол вокруг X"
//let srcForMouseY = 'ay'; // и 'ay' как "угол вокруг Y"

// Параметры жестов
export const HOLD_DELAY = 100;
export const TAP_THRESHOLD = 200;
export const MOVE_TAP_THRESHOLD = 6;
export const SWIPE_THRESHOLD = 40;

// Параметры движения (через Gyroscope)
export const GYRO_DEADZONE = 0.001;     // отсекаем мелкую дрожь (рад/с)
export const GYRO_GAIN = 600.0;        // чувствительность (можно подстраивать)
export const GYRO_SMOOTH = 0.3;       // сглаживание [0..1]
export const GYRO_MAX_STEP = 25;       // максимум пикселей за тик
export const GYRO_MAX_SAMPLE_COUNT = 1000; // размер окна для Monte Carlo калибровки
export const GYRO_ROTATION_GAIN = 0.9; // коэффициент коррекции вращения (Z axis)
export const MOTION_SEND_INTERVAL = motionIntervalMsForHz(30); // compatibility default; adaptive send tiers are 60/30 Hz
export const MOTION_JITTER_EPS = 0.001; // минимальный порог (пикселей), чтобы гасить дрожание при отправке

const airpadMotionPathHint = (): {
    endpointUrl?: string;
    directUrl?: string;
    pageHost?: string;
    routedDesk?: boolean;
} => ({
    endpointUrl: remoteConfig.endpointUrl,
    directUrl: remoteConfig.directUrl,
    pageHost:
        typeof globalThis !== "undefined" && globalThis.location
            ? globalThis.location.hostname
            : "",
    routedDesk: Boolean(getRemoteRouteTarget().trim())
});

const motionRateController = getAirpadMotionRateController(airpadMotionPathHint);

/** Adaptive motion flush interval (60 → 30 Hz on WAN/gateway lag). */
export const getMotionSendIntervalMs = (): number => motionRateController.getIntervalMs();

export const getMotionSendHz = (): number => motionRateController.getHz();

export const getMotionPathClass = (): AirpadMotionPathClass =>
    inferAirpadMotionPathClass(airpadMotionPathHint());

export const isWanMotionPath = (): boolean => getMotionPathClass() !== "lan";

export const recordMotionSendSample = (): void => motionRateController.onMotionSent();

/** Recompute tier after endpoint / route changes (before reconnect). */
export const refreshMotionSendRateFromConfig = (): void => {
    motionRateController.resetTier();
};

// Параметры движения (через интегрированные углы)
export const ANGLE_DEADZONE = 0.001;      // минимальный порог по углу (рад)
export const ANGLE_GAIN = 600.0;         // чувствительность в пикселях на радиан
export const ANGLE_SMOOTH = 0.3;        // сглаживание [0..1]
export const ANGLE_MAX_STEP = 30;        // максимум пикселей за тик

//
export const ACCELEROMETER_DEADZONE = 0.1; // отсекаем мелкую дрожь (м/с^2)
export const ACCELEROMETER_GAIN = 40.0;    // чувствительность в пикселях на м/с^2
export const ACCELEROMETER_SMOOTH = 0.2;    // сглаживание [0..1]
export const ACCELEROMETER_MAX_STEP = 30;    // максимум пикселей за тик
export const ACCELEROMETER_MAX_SAMPLE_COUNT = 1000; // размер окна для Monte Carlo калибровки

// Параметры Gravity Sensor
export const GRAVITY_SMOOTH = 0.1;           // сглаживание вектора гравитации [0..1]
export const GRAVITY_CORRECTION_STRENGTH = 0.1; // сила коррекции по гравитации [0..1]

// Параметры RelativeOrientationSensor
export const REL_ORIENT_DEADZONE = 0.001;   // отсечка дрожи по углам (рад)
export const REL_ORIENT_GAIN = 600.0;       // чувствительность (пикс/рад) — чуть ниже для портретного
export const REL_ORIENT_SMOOTH = 0.55;
export const REL_ORIENT_MAX_STEP = 60;      // максимум пикселей за тик
export const REL_ORIENT_MAX_STEP_MAX = 800; // адаптивный максимум пикселей за тик
export const REL_ORIENT_MAX_STEP_UP_RATE = 6;    // 1/s, скорость роста лимита
export const REL_ORIENT_MAX_STEP_DOWN_RATE = 14; // 1/s, скорость уменьшения лимита
export const REL_ORIENT_SMOOTH_RATE_LOW = 6;   // 1/s, скорость сглаживания при малых движениях
export const REL_ORIENT_SMOOTH_RATE_HIGH = 24; // 1/s, скорость сглаживания при больших движениях

//
export let relDirX = -1;
export let relDirY = -1;
export let relDirZ = -1;
export let relSrcForMouseX = 'az';
export let relSrcForMouseY = 'ay';
export let relSrcForMouseZ = 'ax';
