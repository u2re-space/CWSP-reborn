/*
 * Filename: files-hub.ts
 * FullPath: apps/CWSP-reborn/src/frontend/web/capacitor/android/web/logic/files-hub.ts
 * Change date and time: 18.30.00_21.07.2026
 * Reason for changes: Task 6 — Capacitor (Android) files-hub. Subscribes to the
 *   `cwspFilesIngress` / `cws:filesIngress` bridge event from CwsBridgePlugin
 *   (Task 5 staged Open-with / share-target streams into app-private Temp),
 *   runs the shared hybrid policy `decideOfferAfterStage`, packs each batch via
 *   the Java bridge (`files:read-batch` → base64; `files:put-blob` stub for
 *   large batches), builds the canonical `files:offer` packet via the W1
 *   `buildFilesOfferPacket`, and sends it over the existing Capacitor WS path
 *   (`sendCoordinator`). When the policy yields `needDestinations`, surfaces a
 *   minimal destination picker UI. Bare wildcard destinations (`*`/`all`/
 *   `broadcast`) are rejected unless `allowShareToAll` is opted in, mirroring
 *   the Neutralino hub.
 *
 *   2026-07-21 (W5 settings): read shell.files* from AppSettings (CWSP tab)
 *   with COMPAT fallback to legacy cwsp.* blob keys.
 *   2026-07-21b (W4 minimal): add inbound `files:offer` / `files:error` listener
 *   (cws:filesIncomingOffer from the shared websocket handler) that forwards
 *   the offer to the Java notification bridge (`files:incoming-offer` channel)
 *   and shows an in-WebView heads-up toast. Full SAF export / Accept-Decline
 *   UX remains W4-later; this is the heads-up surface only.
 *   2026-07-21 (Bug A fix): after registering listeners, call
 *   `files:drain-pending-ingress` and run handleIngress on each returned
 *   envelope. ShareActivity has no WebView, so the live emit no-ops; the
 *   persisted envelope is the durable handoff. startFilesHub is now async
 *   so the drain can complete before any later ingress event races it.
 *   2026-07-21c (Cap UX): never show an in-app peer destination popup —
 *   Capacitor always auto-resolves destinations (settings / ingress /
 *   L-110 fallback) and offers immediately.
 *   2026-07-21g (Cap↔Cap): wildcard/empty prefs no longer collapse to desk-only;
 *   expand to fleet peers (L-110/196/208/210) excluding self. Mid-size batches
 *   (≤4MiB) embed over WS when putBlob stub is unavailable.
 *
 * INVARIANT: never touches clipboard-hub. Staging is owned by Java
 * (FilesIngress); this hub only reads staged bytes via the bridge and emits
 * files:* packets. A broken offer (large batch with no PUT, or read-batch
 * failure) never reaches the wire — `files:error` is emitted and the session
 * is dropped.
 */
import { isCapacitorNative } from "boot/capacitor-permissions";
import { invokeCwsNative } from "com/routing/native/cws-bridge";
import { splitMultiValueList } from "cwsp-shared/multi-value-list";
import { connectWS, sendCoordinatorAct } from "shared/transport/websocket";
import {
    buildFilesOfferPacket,
    planFilesBatches,
    FILES_PURPOSE,
    FILES_WHAT_ERROR,
    OFFER_TTL_MS_DEFAULT,
    SMALL_FILE_MAX,
    createCwspPacket,
    type CwspPacket,
    type FilesBatchDescriptor,
    type FilesBatchKind,
    type FilesLogicalFile,
    type FilesOfferPayload,
    type FilesPackerBatchPlan,
} from "@fest-lib/cwsp-shared/v2/index.ts";

/** Bridge ingress envelope from CwsBridgePlugin.emitFilesIngress. */
interface FilesIngressEnvelope {
    transferId: string | null;
    source: string | null;
    stageDir: string | null;
    ok: boolean;
    reason?: string;
    files: Array<{ name: string; size: number; path: string }>;
    /**
     * Optional default destinations the bridge wants the hub to seed the
     * picker with (e.g. resolved from share-intent extras). WHY: lets the
     * Java side skip the picker when it already knows the target peer.
     */
    defaultDestinations?: string[];
}

interface CapFilesHubSession {
    transferId: string;
    source: string;
    stageDir: string;
    files: Array<{ name: string; size: number; path: string }>;
    batchPlan: FilesPackerBatchPlan[];
    createdAt: number;
    destinations?: string[];
}

const WILDCARD_DESTINATIONS = new Set(["*", "all", "broadcast"]);

function filterWildcards(dest: string[]): string[] {
    return dest.map(String).filter((d) => d && !WILDCARD_DESTINATIONS.has(d.toLowerCase()));
}

/**
 * Allowlist for a safe transferId segment (UUID + a few harmless extras).
 * WHY: the `files:gc-stage` bridge channel deletes `files/outgoing/<transferId>`;
 * we validate client-side so a malicious / empty id cannot trick Java into
 * deleting an arbitrary path. Java re-validates and contains the canonical
 * path under the stage root before deleting.
 */
const SAFE_TRANSFER_ID_RE = /^[A-Za-z0-9._-]+$/;

function isSafeTransferId(id: string): boolean {
    return typeof id === "string" && id.length > 0 && id !== "." && id !== ".."
        && !id.includes("..") && SAFE_TRANSFER_ID_RE.test(id);
}

/**
 * Best-effort GC of the per-transfer stage dir on the Java side. WHY: cancel /
 * picker-dismiss / files:error paths must not leak staged Temp. The bridge
 * channel validates transferId and contains the canonical path under the
 * stage root before deleting, so this is safe to call on any path.
 */
function gcStage(transferId: string): void {
    if (!isSafeTransferId(transferId)) return;
    try {
        void invokeCwsNative("files:gc-stage", { transferId }).catch(() => {
            /* best-effort GC; ignore bridge errors */
        });
    } catch {
        /* best-effort GC; ignore bridge errors */
    }
}

function readAllowShareToAll(settings: Record<string, unknown>): boolean {
    const shell = (settings.shell && typeof settings.shell === "object")
        ? (settings.shell as Record<string, unknown>)
        : {};
    const cwsp = (settings.cwsp && typeof settings.cwsp === "object")
        ? (settings.cwsp as Record<string, unknown>)
        : {};
    // WHY: CWSP tab writes shell.filesAllowShareToAll; COMPAT: older cwsp.* blob.
    return shell.filesAllowShareToAll === true || cwsp.allowShareToAll === true;
}

function readDefaultDestinations(settings: Record<string, unknown>): string[] {
    const shell = (settings.shell && typeof settings.shell === "object")
        ? (settings.shell as Record<string, unknown>)
        : {};
    const cwsp = (settings.cwsp && typeof settings.cwsp === "object")
        ? (settings.cwsp as Record<string, unknown>)
        : {};
    const core = (settings.core && typeof settings.core === "object")
        ? (settings.core as Record<string, unknown>)
        : {};
    const socket = (core.socket && typeof core.socket === "object")
        ? (core.socket as Record<string, unknown>)
        : {};
    const raw = String(
        shell.filesShareDestinationIds ||
            cwsp.shareIntentDestinationIds ||
            cwsp.destinationNodeIds ||
            shell.clipboardShareDestinationIds ||
            socket.routeTarget ||
            "",
    ).trim();
    if (!raw) return [];
    if (raw === "*" || raw.toLowerCase() === "any") return ["*"];
    return splitMultiValueList(raw);
}

function readSenderId(settings: Record<string, unknown>): string {
    const shell = (settings.shell && typeof settings.shell === "object")
        ? (settings.shell as Record<string, unknown>)
        : {};
    const cwsp = (settings.cwsp && typeof settings.cwsp === "object")
        ? (settings.cwsp as Record<string, unknown>)
        : {};
    const core = (settings.core && typeof settings.core === "object")
        ? (settings.core as Record<string, unknown>)
        : {};
    return String(
        shell.clientId || cwsp.clientId || cwsp.deviceId || core.userId || "L-196",
    );
}

function readByteTransportHint(settings: Record<string, unknown>): "auto" | "http" | "ws" {
    const shell = (settings.shell && typeof settings.shell === "object")
        ? (settings.shell as Record<string, unknown>)
        : {};
    const v = String(shell.filesByteTransport || "auto").trim().toLowerCase();
    return v === "http" || v === "ws" ? v : "auto";
}

let started = false;
const sessions = new Map<string, CapFilesHubSession>();

/**
 * Subscribe to bridge ingress and wire the hybrid offer flow. Idempotent.
 * Called once from the Capacitor Android boot (minimal shell mount).
 */
export async function startFilesHub(): Promise<void> {
    if (!isCapacitorNative() || started) return;
    started = true;

    window.addEventListener("cws:filesIngress", ((ev: Event) => {
        const detail = (ev as CustomEvent<FilesIngressEnvelope | string>).detail;
        const envelope = parseIngressDetail(detail);
        if (envelope) {
            // WHY: never swallow ingress errors silently — surface them as
            // files:error so the receiver can tear down the transfer session.
            void handleIngress(envelope).catch((e) => {
                const reason = String((e as Error)?.message || e || "CWSP_FILES_INGRESS_HANDLER_FAILED");
                emitFilesError(envelope.transferId || "", envelope.source || "", reason, []);
            });
        }
    }) as EventListener);

    // Also accept the Capacitor plugin listener path (notifyListeners("cwspFilesIngress")).
    try {
        const cap = (globalThis as { Capacitor?: { Plugins?: Record<string, any> } }).Capacitor;
        const bridge = cap?.Plugins?.CwsBridge;
        if (bridge?.addListener) {
            void bridge.addListener("cwspFilesIngress", (event: { ingress?: FilesIngressEnvelope }) => {
                const envelope = event?.ingress;
                if (envelope) {
                    void handleIngress(envelope).catch((e) => {
                        const reason = String((e as Error)?.message || e || "CWSP_FILES_INGRESS_HANDLER_FAILED");
                        emitFilesError(envelope.transferId || "", envelope.source || "", reason, []);
                    });
                }
            });
        }
    } catch {
        /* optional — bridge plugin not present */
    }

    // WHY: inbound files:offer (desk → phone). Sources:
    //   1) shared websocket.ts CustomEvent (WebView owns /ws)
    //   2) CwsBridgePlugin.emitFilesIncomingOffer → triggerWindowJSEvent
    //      (Java owns /ws; detail may be a JSON string)
    // Forward to the Java notification bridge (`files:incoming-offer`) so
    // CwsBridgePlugin can post a "Files ready to download" notification, and
    // show an in-WebView heads-up toast as a fallback. Full Accept/Decline +
    // SAF export is W4-later; this is the minimal heads-up surface.
    window.addEventListener("cws:filesIncomingOffer", ((ev: Event) => {
        const raw = (ev as CustomEvent<unknown>).detail;
        let detail: {
            what: string;
            payload?: unknown;
            sender?: string;
            uuid?: string;
            from?: string;
        } | null = null;
        if (typeof raw === "string") {
            try {
                detail = JSON.parse(raw);
            } catch {
                detail = null;
            }
        } else if (raw && typeof raw === "object") {
            detail = raw as {
                what: string;
                payload?: unknown;
                sender?: string;
                uuid?: string;
                from?: string;
            };
        }
        if (!detail || !detail.what) return;
        handleIncomingOffer(detail.what, detail.payload, detail.sender, detail.uuid).catch((e) => {
            console.warn("[files-hub] inbound offer handler failed", e);
        });
    }) as EventListener);

    // WHY (Bug A): ShareActivity has no WebView, so the live cwspFilesIngress
    // emit no-ops; ShareTarget persists the envelope to
    // files/pending-ingress/<transferId>.json and posts an "Open for Share"
    // heads-up notification. CwsBridgePlugin.load() also drains on plugin
    // load, but an already-running app does not re-load when brought to the
    // foreground. Ask Java to drain any persisted envelopes now (after our
    // listeners are registered) and run handleIngress on each returned
    // envelope. Best-effort — bridge errors just mean there is nothing to drain.
    try {
        const result = await invokeCwsNative("files:drain-pending-ingress", {});
        // WHY: Java returns envelopes both top-level and on echo.envelopes; the
        // typed CwsBridgeInvokeResult only declares echo, so cast to read the
        // top-level field without weakening the canonical interface.
        const top = (result as Record<string, unknown>).envelopes;
        const echoEnvelopes = result?.echo?.envelopes;
        const envelopes = (Array.isArray(top) ? top
            : Array.isArray(echoEnvelopes) ? echoEnvelopes
            : []) as unknown[];
        for (const env of envelopes) {
            const envelope = parseIngressDetail(env as FilesIngressEnvelope | string);
            if (envelope) {
                void handleIngress(envelope).catch((e) => {
                    const reason = String((e as Error)?.message || e || "CWSP_FILES_INGRESS_HANDLER_FAILED");
                    emitFilesError(envelope.transferId || "", envelope.source || "", reason, []);
                });
            }
        }
    } catch (e) {
        // WHY: drain is best-effort; the live cwspFilesIngress listener above
        // covers the in-WebView case. Only log — never break startFilesHub.
        console.warn("[files-hub] files:drain-pending-ingress failed", e);
    }
}

/**
 * Minimal W4 inbound handler: forward the offer to Java (which posts a system
 * notification) and show a web heads-up toast. WHY: the Capacitor files-hub
 * was outbound-only; inbound offers need at least a visible signal so the user
 * knows files are waiting. Byte transfer / SAF export remain W4-later.
 */
async function handleIncomingOffer(
    what: string,
    payload: unknown,
    sender: string | undefined,
    uuid: string | undefined,
): Promise<void> {
    const offer = (payload && typeof payload === "object") ? payload as Record<string, unknown> : {};
    const transferId = String(offer.transferId || "");
    const fileCount = Number(
        (offer.summary && (offer.summary as Record<string, unknown>).fileCount) || 0
    );
    const totalBytes = Number(
        (offer.summary && (offer.summary as Record<string, unknown>).totalBytes) || 0
    );

    // WHY: forward to Java so CwsBridgePlugin can post a system notification.
    // The bridge channel is `files:incoming-offer`; the Java side owns the
    // NotificationManager / channel wiring (see FilesIncomingNotifier.java).
    try {
        await invokeCwsNative("files:incoming-offer", {
            what,
            transferId,
            sender: sender || "",
            uuid: uuid || "",
            fileCount,
            totalBytes,
            payload: offer,
        });
    } catch (e) {
        console.warn("[files-hub] files:incoming-offer bridge call failed", e);
    }

    // WHY: in-WebView heads-up toast as a fallback / diagnostic surface.
    showIncomingOfferToast(what, transferId, fileCount, totalBytes, sender);
}

function showIncomingOfferToast(
    what: string,
    transferId: string,
    fileCount: number,
    totalBytes: number,
    sender: string | undefined,
): void {
    try {
        const existing = document.querySelector("[data-cwsp-files-incoming]");
        if (existing) existing.remove();
        const toast = document.createElement("div");
        toast.setAttribute("data-cwsp-files-incoming", transferId || "unknown");
        toast.style.cssText =
            "position:fixed;left:50%;bottom:24px;transform:translateX(-50%);" +
            "z-index:99999;background:#111;color:#fff;padding:10px 14px;border-radius:8px;" +
            "font:13px system-ui;box-shadow:0 6px 24px rgba(0,0,0,0.4);max-width:90vw;";
        const label = what === "files:error"
            ? `Files transfer ${transferId || ""} failed`
            : `Files ready to download (${fileCount} file${fileCount === 1 ? "" : "s"}, ${formatBytes(totalBytes)})` +
                (sender ? ` from ${sender}` : "");
        toast.textContent = label;
        document.body.append(toast);
        setTimeout(() => {
            try { toast.remove(); } catch { /* ignore */ }
        }, 6000);
    } catch {
        /* best-effort UI */
    }
}

function formatBytes(n: number): string {
    if (!n || n <= 0) return "0 B";
    const units = ["B", "KB", "MB", "GB"];
    let v = n;
    let i = 0;
    while (v >= 1024 && i < units.length - 1) { v /= 1024; i++; }
    return `${v.toFixed(v < 10 && i > 0 ? 1 : 0)} ${units[i]}`;
}

function parseIngressDetail(
    detail: FilesIngressEnvelope | string | null | undefined,
): FilesIngressEnvelope | null {
    if (detail == null) return null;
    if (typeof detail === "string") {
        try {
            return JSON.parse(detail) as FilesIngressEnvelope;
        } catch {
            return null;
        }
    }
    return detail;
}

async function handleIngress(env: FilesIngressEnvelope): Promise<void> {
    // WHY: the bridge payload must carry source + transferId for the hub to act.
    if (!env || !env.transferId || !env.source || !Array.isArray(env.files) || env.files.length === 0) {
        console.warn("[files-hub] ingress missing source/transferId/files — dropping");
        return;
    }
    if (!env.ok) {
        emitFilesError(env.transferId, env.source, `CWSP_FILES_STAGE_FAILED:${env.reason || "unknown"}`, []);
        // WHY: Java already best-effort GC'd the partial stage dir on failure,
        // but call gc-stage again so a Java-side GC miss does not leak Temp.
        gcStage(env.transferId || "");
        return;
    }

    const [{ loadSettings }] = await Promise.all([
        import("com/config/Settings"),
    ]);
    const settings = loadSettings() as Record<string, unknown>;
    const senderId = readSenderId(settings);
    const allowShareToAll = readAllowShareToAll(settings);
    // WHY (Cap UX): merge Java-seeded destinations with AppSettings — never
    // rely on settings alone (ShareActivity may seed L-110 / fleet peers).
    const defaultDestinations = mergeDestinationLists(
        env.defaultDestinations,
        readDefaultDestinations(settings),
    );
    const byteTransportHint = readByteTransportHint(settings);

    const batchPlan = planFilesBatches(
        env.files.map((f) => ({ name: f.name, size: Number(f.size) || 0 })),
    );

    const session: CapFilesHubSession = {
        transferId: env.transferId,
        source: env.source,
        stageDir: env.stageDir || "",
        files: env.files,
        batchPlan,
        createdAt: Date.now(),
    };
    if (defaultDestinations.length > 0) {
        session.destinations = defaultDestinations.slice();
    }
    sessions.set(session.transferId, session);

    // WHY (Cap UX): user prefers automatic Open-for-Share — no in-app peer
    // picker popup. Always auto-resolve and offer (fleet peers, not desk-only).
    const dest = resolveCapAutoDestinations(defaultDestinations, allowShareToAll, senderId);
    if (dest.length === 0) {
        console.warn("[files-hub] no auto destinations — dropping offer", env.transferId);
        showIncomingOfferToast(
            "files:error",
            env.transferId,
            env.files.length,
            0,
            "no-destinations",
        );
        gcStage(env.transferId);
        sessions.delete(env.transferId);
        return;
    }
    await offer(session, dest, senderId, allowShareToAll, byteTransportHint);
}

/** Dedupe destination ids (case-insensitive) preserving first-seen order. */
function mergeDestinationLists(...lists: Array<string[] | undefined>): string[] {
    const out: string[] = [];
    const seen = new Set<string>();
    for (const list of lists) {
        if (!list) continue;
        for (const raw of list) {
            const t = String(raw || "").trim();
            if (!t) continue;
            const key = t.toLowerCase();
            if (seen.has(key)) continue;
            seen.add(key);
            out.push(t);
        }
    }
    return out;
}

/**
 * Capacitor auto destinations: settings/ingress list → filter wildcards unless
 * allowShareToAll → fall back to desk peer L-110 so Open-with always has a sink.
 * INVARIANT: never returns empty when L-110 is a valid peer id.
 */
/** Fleet peers for Cap↔Cap when prefs are empty / wildcard-only / desk-only. */
const CAP_FLEET_PEERS = ["L-110", "L-196", "L-208", "L-210"] as const;

/**
 * WHY: OkHttp WS send rejects >16MiB frames. Base64 ≈ 4/3 size + JSON envelope.
 * Cap putBlob is still a stub — embed up to this raw-byte cap so Cap↔Cap
 * mid-size shares still leave the phone (SMALL_FILE_MAX alone was too tight).
 */
const CAP_WS_EMBED_MAX = 4 * 1024 * 1024;

function resolveCapAutoDestinations(
    destinations: string[],
    allowShareToAll: boolean,
    senderId?: string,
): string[] {
    const resolved = resolveDestinations(destinations, allowShareToAll);
    // WHY (Cap↔Cap): always union fleet peers so a prefs list that only names
    // desk (or one phone) still reaches the other Cap devices on the LAN/WAN hub.
    const concrete = mergeDestinationLists(
        resolved.length > 0 ? resolved : undefined,
        CAP_FLEET_PEERS.map(String),
    );
    const self = String(senderId || "").trim().toLowerCase();
    const out = concrete.filter((id) => {
        const t = String(id || "").trim();
        if (!t) return false;
        if (self && t.toLowerCase() === self) return false;
        return true;
    });
    if (out.length > 0) return out;
    return self === "l-110" ? [] : ["L-110"];
}

function resolveDestinations(dest: string[], allowShareToAll: boolean): string[] {
    return (allowShareToAll ? dest.map(String).filter(Boolean) : filterWildcards(dest))
        .filter(Boolean);
}

/**
 * Pack each batch via the Java bridge (`files:read-batch` → base64; `files:put-blob`
 * stub for large), build the canonical `files:offer`, and send over the Capacitor
 * WS path. A broken offer (large batch with no PUT) emits `files:error` instead.
 */
async function offer(
    session: CapFilesHubSession,
    destinations: string[],
    senderId: string,
    _allowShareToAll: boolean,
    byteTransportHint: "auto" | "http" | "ws" = "auto",
): Promise<void> {
    if (destinations.length === 0) {
        console.warn("[files-hub] offer with no destinations — dropping");
        return;
    }
    session.destinations = destinations;
    connectWS();

    const count = session.batchPlan.length;
    const batches: FilesBatchDescriptor[] = [];
    let firstError: string | undefined;

    for (let i = 0; i < count; i++) {
        const plan = session.batchPlan[i];
        const batchId = `${session.transferId}-${i}`;
        const names = plan.files.map((f) => f.name);
        try {
            const result = await invokeCwsNative("files:read-batch", {
                transferId: session.transferId,
                batchId,
                kind: plan.kind,
                names,
            });
            // WHY: success is the top-level `result.ok` set by baseResult(...).
            // The Java bridge also mirrors `ok` onto `echo` for parity with
            // files:put-blob, but the canonical signal is the top-level field.
            const ok = result?.ok === true;
            const echo = (result?.echo || {}) as Record<string, unknown>;
            const data = String(echo.data || "");
            const hash = String(echo.hash || "");
            const size = Number(echo.size) || 0;
            const mimeType = String(echo.mimeType || "application/octet-stream");
            const kind = String(echo.kind || plan.kind) as FilesBatchKind;
            const ext = String(echo.ext || "bin");
            const name = `${batchId}.${ext}`;

            // WHY: a failed read-batch must never become a files:offer asset.
            // `!ok`, a missing `hash`, or empty `data` for a non-empty `size`
            // all indicate the bridge could not produce usable bytes — record
            // it as firstError and skip this batch; the offer is aborted below.
            if (!ok) {
                if (!firstError) firstError = String(echo.error || "CWSP_FILES_READ_BATCH_FAILED");
                continue;
            }
            if (!hash) {
                if (!firstError) firstError = "CWSP_FILES_READ_BATCH_MISSING_HASH";
                continue;
            }

            // WHY: large batches prefer putBlob (HTTP PUT). Cap stub is still
            // unavailable — fall back to WS embed up to CAP_WS_EMBED_MAX so
            // Cap↔Cap mid-size shares still deliver (not only ≤500KiB).
            if (size > SMALL_FILE_MAX) {
                const put = await invokeCwsNative("files:put-blob", {
                    transferId: session.transferId,
                    batchId,
                    // WHY: Java FilesBlobStore needs the bytes — Cap hub already
                    // has them from read-batch; without `data` putBlob failed
                    // and large Cap→Cap shares died instantly.
                    data,
                    hash,
                    name,
                    mimeType,
                    size,
                });
                const putEcho = (put?.echo || {}) as Record<string, unknown>;
                if ((put?.ok === true || putEcho.ok) && putEcho.url) {
                    batches.push({
                        batchId, index: i, count, kind,
                        asset: { hash, name, mimeType, size, source: "url", url: String(putEcho.url) },
                        files: toLogicalFiles(plan),
                    });
                    continue;
                }
                if (size <= CAP_WS_EMBED_MAX && data) {
                    batches.push({
                        batchId, index: i, count, kind,
                        asset: { hash, name, mimeType, size, source: "base64", data },
                        files: toLogicalFiles(plan),
                    });
                    continue;
                }
                if (!firstError) {
                    firstError = String(
                        putEcho.error
                            || (size > CAP_WS_EMBED_MAX
                                ? "CWSP_FILES_TOO_LARGE_FOR_WS_EMBED"
                                : "CWSP_FILES_PUT_BLOB_UNAVAILABLE"),
                    );
                }
                continue;
            }

            // WHY: small batch must carry real bytes — empty data with size>0
            // means the read-batch lied about producing content; reject it.
            if (size > 0 && !data) {
                if (!firstError) firstError = "CWSP_FILES_READ_BATCH_EMPTY_DATA";
                continue;
            }

            batches.push({
                batchId, index: i, count, kind,
                asset: { hash, name, mimeType, size, source: "base64", data },
                files: toLogicalFiles(plan),
            });
        } catch (e) {
            if (!firstError) firstError = String((e as Error)?.message || e);
        }
    }

    if (firstError) {
        // WHY: local pack failure — do not spam peer phones with files:error.
        emitFilesError(session.transferId, session.source, firstError, []);
        sessions.delete(session.transferId);
        // WHY: a broken offer must not leave staged Temp behind; best-effort GC.
        gcStage(session.transferId);
        return;
    }

    const totalBytes = session.files.reduce((a, f) => a + (Number(f.size) || 0), 0);
    const payload: FilesOfferPayload = {
        transferId: session.transferId,
        sender: senderId,
        destinations,
        createdAt: session.createdAt,
        expiresAt: session.createdAt + OFFER_TTL_MS_DEFAULT,
        summary: { fileCount: session.files.length, totalBytes },
        batches,
        flags: { openForShare: true },
        byteTransportHint,
    };

    // WHY: buildFilesOfferPacket validates + canonicalizes the payload; we then
    // send its payload through the existing Capacitor WS act path so clientId /
    // tokens / route metadata are attached by the shared transport.
    const packet = buildFilesOfferPacket(payload);
    sendCoordinatorAct("files:offer", packet.payload, destinations);
    sessions.delete(session.transferId);
}

function toLogicalFiles(plan: FilesPackerBatchPlan): FilesLogicalFile[] {
    return plan.files.map((f) => ({ name: f.name, size: f.size }));
}

function emitFilesError(
    transferId: string,
    _source: string,
    reason: string,
    destinations: string[],
): void {
    try {
        // WHY: pack/stage failures must NOT fan-out files:error to peer phones
        // that never received an offer — that looked like "second device failed"
        // while the first Accept still worked. Keep the error local (toast) unless
        // destinations is explicitly non-empty AND we already offered.
        console.warn("[files-hub] files:error", { transferId, reason, destinations });
        showIncomingOfferToast("files:error", transferId, 0, 0, reason);
        // Only wire-notify when destinations is a single targeted peer reply path
        // (empty = local-only).
        if (!Array.isArray(destinations) || destinations.length === 0) return;
        const packet: CwspPacket = createCwspPacket({
            op: "act",
            what: FILES_WHAT_ERROR,
            purpose: FILES_PURPOSE,
            sender: readSenderIdSafe(),
            uuid: crypto.randomUUID(),
            timestamp: Date.now(),
            destinations,
            payload: { transferId, reason },
        });
        sendCoordinatorAct("files:error", packet.payload, destinations);
    } catch {
        /* best-effort */
    }
}

function readSenderIdSafe(): string {
    try {
        // Sync best-effort — settings may not be loaded; avoid hardcoded L-196.
        const w = globalThis as { __CWSP_CLIENT_ID__?: string };
        if (w.__CWSP_CLIENT_ID__) return String(w.__CWSP_CLIENT_ID__);
    } catch {
        /* ignore */
    }
    return "L-unknown";
}

/**
 * Capacitor: peer destination popup removed (2026-07-21c). Cap always
 * auto-offers via resolveCapAutoDestinations — no in-app peer modal.
 */
