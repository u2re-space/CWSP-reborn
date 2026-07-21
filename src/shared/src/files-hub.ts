/*
 * Filename: files-hub.ts
 * FullPath: apps/CWSP-reborn/src/frontend/web/capacitor/android/web/logic/files-hub.ts
 * Change date and time: 16.20.00_21.07.2026
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
 *   Task 6 fix: a failed `files:read-batch` (`!ok`, missing `hash`, or empty
 *   `data` when `size>0`) is now treated as `firstError` — `files:error` is
 *   emitted and no broken `files:offer` reaches the wire. Ingress handler
 *   rejections are surfaced as `files:error` instead of being swallowed by an
 *   empty `.catch(() => {})`. The picker is optionally seeded from
 *   `env.defaultDestinations` when the bridge provides it.
 *
 *   Task 6 re-fix: success is read from the top-level `result.ok` (set by the
 *   Java `baseResult(...)`), not `echo.ok` — the prior `echo.ok === true`
 *   check regressed the happy path because `filesReadBatch` did not mirror `ok`
 *   onto `echo`. Java now also puts `ok` on `echo` for every return path so
 *   both fields stay aligned.
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
    decideOfferAfterStage,
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

function readAllowShareToAll(settings: Record<string, unknown>): boolean {
    const cwsp = (settings.cwsp && typeof settings.cwsp === "object")
        ? (settings.cwsp as Record<string, unknown>)
        : {};
    return cwsp.allowShareToAll === true;
}

function readDefaultDestinations(settings: Record<string, unknown>): string[] {
    const cwsp = (settings.cwsp && typeof settings.cwsp === "object")
        ? (settings.cwsp as Record<string, unknown>)
        : {};
    const raw = String(
        cwsp.shareIntentDestinationIds || cwsp.destinationNodeIds || "",
    ).trim();
    if (!raw) return [];
    if (raw === "*" || raw.toLowerCase() === "any") return ["*"];
    return splitMultiValueList(raw);
}

function readSenderId(settings: Record<string, unknown>): string {
    const cwsp = (settings.cwsp && typeof settings.cwsp === "object")
        ? (settings.cwsp as Record<string, unknown>)
        : {};
    return String(cwsp.clientId || cwsp.deviceId || "L-196");
}

let started = false;
const sessions = new Map<string, CapFilesHubSession>();

/**
 * Subscribe to bridge ingress and wire the hybrid offer flow. Idempotent.
 * Called once from the Capacitor Android boot (minimal shell mount).
 */
export function startFilesHub(): void {
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
        return;
    }

    const [{ loadSettings }] = await Promise.all([
        import("com/config/Settings"),
    ]);
    const settings = loadSettings() as Record<string, unknown>;
    const senderId = readSenderId(settings);
    const allowShareToAll = readAllowShareToAll(settings);
    const defaultDestinations = readDefaultDestinations(settings);

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
    // WHY: seed picker from ingress defaultDestinations when the bridge already
    // knows the target peer(s); empty/absent leaves the picker unseeded. Assigned
    // conditionally to respect exactOptionalPropertyTypes on `destinations?`.
    if (env.defaultDestinations && env.defaultDestinations.length > 0) {
        session.destinations = env.defaultDestinations.slice();
    }
    sessions.set(session.transferId, session);

    const phase = decideOfferAfterStage({
        source: env.source as any,
        defaultDestinations,
        openForShare: "auto",
    });

    if (phase.phase === "readyToOffer") {
        const dest = resolveDestinations(phase.destinations, allowShareToAll);
        if (dest.length === 0) {
            showDestinationPicker(session, senderId, allowShareToAll);
            return;
        }
        await offer(session, dest, senderId, allowShareToAll);
        return;
    }

    // needDestinations — surface the picker.
    showDestinationPicker(session, senderId, allowShareToAll);
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

            // WHY: large batches need putBlob (HTTP PUT); the W3 stub is unavailable,
            // so ask it to branch honestly, then embed only small batches.
            if (size > SMALL_FILE_MAX) {
                const put = await invokeCwsNative("files:put-blob", {
                    transferId: session.transferId,
                    batchId,
                });
                const putEcho = (put?.echo || {}) as Record<string, unknown>;
                if (putEcho.ok && putEcho.url) {
                    batches.push({
                        batchId, index: i, count, kind,
                        asset: { hash, name, mimeType, size, source: "url", url: String(putEcho.url) },
                        files: toLogicalFiles(plan),
                    });
                    continue;
                }
                if (!firstError) firstError = String(putEcho.error || "CWSP_FILES_PUT_BLOB_UNAVAILABLE");
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
        emitFilesError(session.transferId, session.source, firstError, destinations);
        sessions.delete(session.transferId);
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
        byteTransportHint: "auto",
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
        const packet: CwspPacket = createCwspPacket({
            op: "act",
            what: FILES_WHAT_ERROR,
            purpose: FILES_PURPOSE,
            sender: "L-196",
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

/**
 * Minimal destination picker: a small overlay with a text field seeded by
 * `defaultDestinations` and a Confirm button. WHY: the policy yields
 * `needDestinations` for clipboard/picker sources and for wildcard-only
 * defaults without `allowShareToAll`; the user must name a real peer.
 */
function showDestinationPicker(
    session: CapFilesHubSession,
    senderId: string,
    allowShareToAll: boolean,
): void {
    const existing = document.querySelector("[data-cwsp-files-picker]");
    if (existing) existing.remove();

    const overlay = document.createElement("div");
    overlay.setAttribute("data-cwsp-files-picker", session.transferId);
    overlay.style.cssText =
        "position:fixed;inset:0;z-index:99999;display:flex;align-items:center;" +
        "justify-content:center;background:rgba(0,0,0,0.45);font:14px system-ui;";
    const card = document.createElement("div");
    card.style.cssText =
        "background:#fff;color:#111;border-radius:10px;padding:16px;min-width:280px;" +
        "max-width:90vw;box-shadow:0 8px 32px rgba(0,0,0,0.3);";
    const title = document.createElement("div");
    title.textContent = "Send files to peer";
    title.style.cssText = "font-weight:600;margin-bottom:8px;";
    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "peer id (e.g. L-192.168.0.110)";
    input.value = (session.destinations || []).join(", ");
    input.style.cssText = "width:100%;box-sizing:border-box;padding:8px;border:1px solid #ccc;border-radius:6px;margin-bottom:10px;";
    const hint = document.createElement("div");
    hint.textContent = allowShareToAll
        ? "Comma-separated; * fans out to all peers."
        : "Comma-separated peer ids; * is rejected (enable allowShareToAll to broadcast).";
    hint.style.cssText = "font-size:12px;color:#666;margin-bottom:10px;";
    const btnRow = document.createElement("div");
    btnRow.style.cssText = "display:flex;gap:8px;justify-content:flex-end;";
    const cancel = document.createElement("button");
    cancel.textContent = "Cancel";
    const confirm = document.createElement("button");
    confirm.textContent = "Send";
    confirm.style.cssText = "background:#2563eb;color:#fff;border:0;padding:8px 14px;border-radius:6px;cursor:pointer;";
    cancel.style.cssText = "background:#eee;border:0;padding:8px 14px;border-radius:6px;cursor:pointer;";
    btnRow.append(cancel, confirm);
    card.append(title, input, hint, btnRow);
    overlay.append(card);
    document.body.append(overlay);

    const close = (): void => overlay.remove();
    cancel.addEventListener("click", () => {
        sessions.delete(session.transferId);
        close();
    });
    confirm.addEventListener("click", () => {
        const raw = input.value.trim();
        if (!raw) return;
        const dest = splitMultiValueList(raw);
        const resolved = resolveDestinations(dest, allowShareToAll);
        if (resolved.length === 0) {
            hint.textContent = "No valid destinations (wildcards rejected).";
            return;
        }
        close();
        void offer(session, resolved, senderId, allowShareToAll);
    });
}
