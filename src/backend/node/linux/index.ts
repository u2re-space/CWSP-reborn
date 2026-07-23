/*
 * Filename: index.ts
 * FullPath: apps/CWSP-reborn/src/backend/node/linux/index.ts
 * Change date and time: 17.43.00_23.07.2026
 * Reason for changes: Wire clipboard prompt hooks through startNeutralinoBackend so
 *   /service/clipboard-prompt routes the popup UI to the live hub instance on linux.
 *   2026-07-18: tray longevity — exit only when Neutralino host (CWSP_NL_PID)
 *   is gone; keep control/hub alive if only extNode IPC dies.
 *   2026-07-21: wire files-hub with stub sendPacket/putBlob adapters (parity
 *   with windows boot) so the real offer path runs on boot; W4 swaps real senders.
 *   2026-07-21c: replace stub sendPacket with real protocol.ingest (parity with
 *   windows). Linux clipboardy has no CF_HDROP file-drop probe, so the
 *   clipboard→files-hub diversion is Windows-only for now; Linux files-hub
 *   still serves outbound offers staged by other ingress paths.
 *   2026-07-23: expose localId to Control pair/hello and persist mesh peer maps.
 */

import fs from "node:fs";
import path from "node:path";

import { ProtocolServer } from "protocol/node/index.ts";
import {
    startNeutralinoBackend,
    createClipboardHub,
    createClipboardPromptHost,
    createFilesHub,
    type FilesPromptState
} from "../shared/neutralino/index.ts";
import { startWebnativeBackend } from "../shared/webnative/index.ts";
import { createClipboardExecutor } from "../shared/executor/Clipboardy.ts";
import {
    detectLanIpv4,
    resolveGatewayHttpBase
} from "../shared/neutralino/files-blob-store.ts";
import {
    startPathCapabilityMesh,
    type PathCapabilityMeshRuntime
} from "../shared/neutralino/path-capability-mesh.ts";
import { splitMultiValueList } from "@fest-lib/cwsp-shared/v2/index.ts";

export * from "./settings.ts";
export { startNeutralinoBackend, startWebnativeBackend, createClipboardHub, createFilesHub };

// WHY: Cursor.exe on desk often steals :19875/:19876 (ERR_EMPTY_RESPONSE).
const DEFAULT_CONTROL_PORT = 29110;
const DEFAULT_CONTROL_KEY = "cwsp-neutralino-local";

function resolvePackageRoot(): string {
    const candidates = [
        process.env.CWSP_NL_HOST_ROOT,
        process.env.CWSP_NL_PACKAGE_ROOT,
        process.env.CWSP_ROOT,
        process.env.NL_PATH,
        process.cwd()
    ];
    for (const c of candidates) {
        if (c && fs.existsSync(c)) return path.resolve(c);
    }
    return path.resolve(process.cwd());
}

function resolveConfigPath(hostRoot: string): string {
    const fromEnv =
        String(process.env.CWSP_PORTABLE_CONFIG || "").trim() ||
        String(process.env.CWS_PORTABLE_CONFIG_PATH || "").trim();
    if (fromEnv) return path.resolve(fromEnv);
    const preferred = path.join(hostRoot, ".config", "portable.config.json");
    try {
        fs.mkdirSync(path.dirname(preferred), { recursive: true });
    } catch {
        /* ignore */
    }
    return preferred;
}

/**
 * Clipboard-hub is for Neutralino/WebNative *desktop* shells only.
 * WHY: `deploy:200:node` / PM2 `cwsp-reborn-node` on the gateway used to start
 * hub as default `L-110` without a token → 4001 reconnect storm → Capacitor/fleet die.
 * INVARIANT: on server hosts require explicit `CWSP_CLIPBOARD_HUB=1`.
 */
function shouldStartClipboardHub(packageRoot: string): boolean {
    const flag = String(process.env.CWSP_CLIPBOARD_HUB || "").trim();
    if (flag === "0" || flag.toLowerCase() === "false") return false;
    if (flag === "1" || flag.toLowerCase() === "true") return true;
    // WHY: desktop shells always need hub; gateway PM2 must set CWSP_CLIPBOARD_HUB=0.
    const shell = String(process.env.CWSP_DESKTOP_SHELL || "").trim().toLowerCase();
    if (shell === "neutralino" || shell === "webnative") return true;
    // Auto-enable only inside a Neutralino desktop package tree.
    const markers = [
        path.join(packageRoot, "resources.neu"),
        path.join(packageRoot, "neutralino.config.json"),
        path.join(packageRoot, "cwsp-neutralino-linux_x64"),
        path.join(packageRoot, "cwsp-neutralino-win_x64.exe")
    ];
    if (markers.some((p) => fs.existsSync(p))) return true;
    if (/cwsp-neutralino/i.test(packageRoot)) return true;
    if (process.env.CWSP_NL_PACKAGE_ROOT) return true;
    return false;
}

function publishControlAuth(auth: { port: number; key: string }, packageRoot: string): string {
    const tmpDir = path.join(packageRoot, ".tmp");
    fs.mkdirSync(tmpDir, { recursive: true });
    const authPath = path.join(tmpDir, "cwsp-control-auth.json");
    fs.writeFileSync(
        authPath,
        JSON.stringify(
            {
                port: auth.port,
                key: auth.key,
                host: "127.0.0.1",
                serviceConfig: "/service/config",
                serviceClipboard: "/service/clipboard",
                serviceClipboardHub: "/service/clipboard-hub",
                serviceDispatch: "/service/dispatch",
                neutralinoConfig: "/neutralino/config",
                writtenAt: new Date().toISOString()
            },
            null,
            2
        ) + "\n",
        "utf8"
    );
    fs.writeFileSync(
        path.join(tmpDir, "__webnative_auth__.js"),
        `globalThis.__WEBNATIVE_AUTH__ = ${JSON.stringify({ port: auth.port, key: auth.key })};\n` +
            `globalThis.__NEUTRALINO_AUTH__ = ${JSON.stringify({ port: auth.port, key: auth.key })};\n` +
            `globalThis.__CWS_WEBNATIVE_BOOT__ = true;\n` +
            `globalThis.__CWS_NEUTRALINO_BOOT__ = true;\n` +
            `globalThis.__CWS_NODE_CLIPBOARD_HUB__ = true;\n`,
        "utf8"
    );
    return authPath;
}

function asRecord(value: unknown): Record<string, unknown> {
    return value && typeof value === "object" && !Array.isArray(value)
        ? (value as Record<string, unknown>)
        : {};
}

/**
 * Resolve files-hub default destinations from shell.files* settings, falling
 * back to clipboard broadcast targets / routeTarget. WHY: parity with the
 * clipboard hub target resolution — multi-value fields are split into tokens.
 */
function resolveFilesDestinations(settings: Record<string, unknown>, localId: string): string[] {
    const shell = settings.shell && typeof settings.shell === "object"
        ? (settings.shell as Record<string, unknown>)
        : {};
    const core = settings.core && typeof settings.core === "object"
        ? (settings.core as Record<string, unknown>)
        : {};
    const socket = core.socket && typeof core.socket === "object"
        ? (core.socket as Record<string, unknown>)
        : {};
    const raw = String(
        shell.filesShareDestinationIds ||
            shell.clipboardShareDestinationIds ||
            socket.routeTarget ||
            "",
    ).trim();
    const local = String(localId || "").trim().toLowerCase();
    return splitMultiValueList(raw).filter((n) => {
        const key = n.trim().toLowerCase();
        if (!key || key === "self") return false;
        if (local && (key === local || key === `l-${local.replace(/^l-/, "")}`)) return false;
        return true;
    });
}

/**
 * Linux Neutralino/WebNative backend: settings + control + clipboard-hub.
 * WHY: clipboard LAN sync must run in Node (clipboardy), not in the WebView.
 */
export async function main(): Promise<void> {
    const shell = String(process.env.CWSP_DESKTOP_SHELL ?? "neutralino").toLowerCase();
    const useWebnative = shell === "webnative";
    const packageRoot = resolvePackageRoot();
    const configPath = resolveConfigPath(packageRoot);
    const controlPort = Number(process.env.CWSP_CONTROL_PORT || DEFAULT_CONTROL_PORT) || DEFAULT_CONTROL_PORT;
    const apiKey = String(process.env.CWSP_CONTROL_KEY || DEFAULT_CONTROL_KEY);
    const localId = process.env.CWSP_CLIENT_ID ?? "L-110";

    const clipboard = createClipboardExecutor();

    const clipboardWrite = async ({
        packet,
        reply
    }: {
        packet: { what?: string; payload?: unknown; data?: unknown };
        reply: (op: "result" | "error", payload?: Record<string, unknown>) => unknown;
    }) => {
        const applied = await clipboard.applyPacket(packet);
        return reply("result", { ok: true, what: packet.what, ...applied });
    };

    const protocol = new ProtocolServer({
        localId,
        handlers: {
            "clipboard:update": clipboardWrite,
            "clipboard:write": clipboardWrite,
            "clipboard:read": async ({ reply }) => {
                const text = await clipboard.readText();
                return reply("result", { ok: true, kind: "text", text, content: text, data: text });
            },
            "clipboard:get": async ({ reply }) => {
                const text = await clipboard.readText();
                return reply("result", { ok: true, kind: "text", text, content: text, data: text });
            },
            "clipboard:isReady": async ({ reply }) =>
                reply("result", { ok: true, ready: await clipboard.isReady() })
        },
        aliases: {
            clipboard: "clipboard:update",
            "airpad:clipboard:write": "clipboard:write",
            "airpad:clipboard:delivery": "clipboard:update",
            "airpad:clipboard:read": "clipboard:read"
        }
    });

    const onDispatch = async (packet: unknown) => protocol.ingest(packet);
    const onClipboard = {
        async read(opts?: { kind?: string }) {
            const kind = String(opts?.kind || "text").toLowerCase();
            if (kind === "image") {
                return { ok: false, kind: "image", error: { code: "CLIPBOARD_IMAGE_UNSUPPORTED" } };
            }
            const text = await clipboard.readText();
            return { ok: true, kind: "text", text, content: text, body: text, data: text };
        },
        async write(payload: Record<string, unknown>) {
            const body = asRecord(payload);
            const text =
                (typeof body.text === "string" && body.text) ||
                (typeof body.content === "string" && body.content) ||
                (typeof body.body === "string" && body.body) ||
                (typeof body.data === "string" && body.data) ||
                "";
            await clipboard.writeText(text);
            return { ok: true, kind: "text", textLength: text.length };
        }
    };

    let hubStatus = (): Record<string, unknown> => ({ running: false, connected: false });
    let hubReload = (): void => undefined;
    let peerWireIngest = (_raw: unknown): void => undefined;
    // WHY: prompt hooks read live hub state; safe to return null before hub is wired.
    let hubPromptGet = (): Record<string, unknown> | null => null;
    let hubPromptAction = async (
        _action: "share" | "dismiss" | "erase" | "accept" | "undo" | "take"
    ): Promise<boolean | { applied: boolean; text?: string; hasImage?: boolean }> => false;

    const runtime = useWebnative
        ? await startWebnativeBackend({
              platform: "linux",
              enableClipboard: true,
              controlPort,
              apiKey
          })
        : await startNeutralinoBackend({
              platform: "linux",
              configPath,
              controlPort,
              apiKey,
              publicDir: path.join(packageRoot, "build", "neutralino"),
              onDispatch,
              onClipboard,
              onClipboardHubStatus: async () => hubStatus(),
              onClipboardHubReload: async () => {
                  hubReload();
              },
              onPeerWsMessage: (raw) => {
                  peerWireIngest(raw);
              },
              resolvePeerWsToken: async () => {
                  try {
                      const snap = (await runtime.settings.get()) as Record<string, unknown>;
                      const shell =
                          snap.shell && typeof snap.shell === "object"
                              ? (snap.shell as Record<string, unknown>)
                              : {};
                      const core =
                          snap.core && typeof snap.core === "object"
                              ? (snap.core as Record<string, unknown>)
                              : {};
                      return String(
                          process.env.CWSP_CLIENT_TOKEN
                              || process.env.CWS_CLIENT_TOKEN
                              || shell.clientToken
                              || shell.accessToken
                              || core.ecosystemToken
                              || core.userKey
                              || ""
                      ).trim();
                  } catch {
                      return String(
                          process.env.CWSP_CLIENT_TOKEN || process.env.CWS_CLIENT_TOKEN || ""
                      ).trim();
                  }
              },
              resolveLocalClientId: () => localId,
              // WHY: popup bridge polls /service/clipboard-prompt — plumb to hub state.
              onClipboardPromptGet: async () => hubPromptGet(),
              onClipboardPromptAction: async (action) => hubPromptAction(action)
          });

    // Native toast host (NOT a second Neutralino). Spawned when a prompt is active.
    const promptHost = createClipboardPromptHost({
        packageRoot,
        getAuth: () => ({ port: runtime.auth.port, key: runtime.auth.key })
    });

    // WHY: exit when Neutralino host dies. If only extNode dies, keep serving
    // loopback control so a tray WebView can still reach settings/clipboard.
    const parentPid = Number(process.env.CWSP_PARENT_PID || 0);
    const nlPid = Number(process.env.CWSP_NL_PID || 0);
    let parentWatch: ReturnType<typeof setInterval> | null = null;
    let loggedExtNodeGone = false;
    if (nlPid > 0 || parentPid > 0) {
        parentWatch = setInterval(() => {
            const probe = (pid: number): boolean => {
                try {
                    process.kill(pid, 0);
                    return true;
                } catch {
                    return false;
                }
            };
            if (nlPid > 0) {
                if (!probe(nlPid)) {
                    try {
                        promptHost.dispose();
                    } catch {
                        /* ignore */
                    }
                    if (parentWatch) clearInterval(parentWatch);
                    process.exit(0);
                }
                if (parentPid > 0 && !probe(parentPid) && !loggedExtNodeGone) {
                    loggedExtNodeGone = true;
                    console.warn(
                        JSON.stringify({
                            channel: "cwsp-backend",
                            event: "extnode-gone-keep-alive",
                            parentPid,
                            nlPid
                        })
                    );
                }
                return;
            }
            if (parentPid > 0 && !probe(parentPid)) {
                try {
                    promptHost.dispose();
                } catch {
                    /* ignore */
                }
                if (parentWatch) clearInterval(parentWatch);
                process.exit(0);
            }
        }, 2000);
    }
    const shutdown = () => {
        try {
            promptHost.dispose();
        } catch {
            /* ignore */
        }
        if (parentWatch) clearInterval(parentWatch);
    };
    process.once("SIGINT", () => {
        shutdown();
        process.exit(0);
    });
    process.once("SIGTERM", () => {
        shutdown();
        process.exit(0);
    });
    process.once("exit", () => {
        shutdown();
    });

    // INVARIANT: hub exists for Neutralino + WebNative; start remains desk-gated.
    // WHY: filesHub is created AFTER clipboardHub — forward ref for inbound files:offer.
    let filesHubRef: ReturnType<typeof createFilesHub> | undefined;
    let pathMeshRef: PathCapabilityMeshRuntime | undefined;
    const clipboardHub = createClipboardHub({
              localId,
              packageRoot,
              getSettings: () => runtime.settings.get(),
              adapters: {
                  readText: () => clipboard.readText(),
                  writeText: (text) => clipboard.writeText(text).then(() => undefined),
                  ingest: (packet) => protocol.ingest(packet)
              },
              onPromptUpdate: (state) => {
                // WHY: soft release on null — hard stop blocked the next spawn (Windows host).
                if (state) promptHost.ensureRunning();
                else promptHost.release();
              },
              onInboundFilesPacket: (packet) => {
                  if (!filesHubRef) return;
                  const what = String(packet.what || "");
                  if (what === "files:accept" || what === "files:decline") {
                      console.log(JSON.stringify({
                          channel: "cwsp-files-hub",
                          event: what === "files:accept" ? "accept-received" : "decline-received",
                          localId,
                          transferId: (packet.payload as { transferId?: string } | undefined)?.transferId ?? null,
                          sender: packet.sender ?? packet.byId ?? packet.from ?? null
                      }));
                      return;
                  }
                  if (what === "files:error") {
                      console.warn(JSON.stringify({
                          channel: "cwsp-files-hub",
                          event: "inbound-files-error",
                          localId,
                          transferId: (packet.payload as { transferId?: string } | undefined)?.transferId ?? null
                      }));
                      return;
                  }
                  if (what !== "files:offer") return;
                  void filesHubRef.handleIncomingOffer(packet as Parameters<
                      NonNullable<typeof filesHubRef>["handleIncomingOffer"]
                  >[0]).catch((error) => {
                      console.error(JSON.stringify({
                          channel: "cwsp-files-hub",
                          event: "inbound-offer-failed",
                          localId,
                          error: error instanceof Error ? error.message : String(error)
                      }));
                  });
              },
              onInboundPathCapability: (packet) => {
                  pathMeshRef?.handleInbound(packet);
              },
              onHubConnected: (reason) => {
                  void pathMeshRef?.refresh(reason || "connected");
              }
          });

    pathMeshRef = startPathCapabilityMesh({
        localId,
        packageRoot,
        controlPort: 8434,
        lanHost: () => detectLanIpv4(),
        getPeerIds: async () => {
            const settingsSnap = (await runtime.settings.get()) as Record<string, unknown>;
            return resolveFilesDestinations(settingsSnap, localId);
        },
        getGatewayOrigins: async () => {
            const settingsSnap = (await runtime.settings.get()) as Record<string, unknown>;
            const shell =
                settingsSnap.shell && typeof settingsSnap.shell === "object"
                    ? (settingsSnap.shell as Record<string, unknown>)
                    : {};
            const wanBase =
                resolveGatewayHttpBase([
                    shell.relayUrl,
                    shell.endpointUrl,
                    shell.hubUrl,
                    process.env.CWSP_RELAY_URL,
                    process.env.CWSP_HUB_URL,
                ]) || "https://45.147.121.152:8434";
            return { lan: "https://192.168.0.200:8434", wan: wanBase };
        },
        sendPacket: (packet) => clipboardHub.sendWirePacket(packet),
    });

    if (clipboardHub) {
        hubStatus = () => clipboardHub.status() as unknown as Record<string, unknown>;
        hubReload = () => clipboardHub.reload();
        peerWireIngest = (raw) => clipboardHub.ingestPeerWire(raw);
        // WHY: control RPC delegates /service/clipboard-prompt to the live hub instance.
        hubPromptGet = () =>
            clipboardHub.getPromptState() as unknown as Record<string, unknown> | null;
        // WHY: `take` Accepts inbound ask and returns full text for CRX Paste bypass.
        hubPromptAction = (action) =>
            action === "take"
                ? clipboardHub.takeInboundAskForPaste()
                : clipboardHub.resolvePrompt(action);
        if (shouldStartClipboardHub(packageRoot)) {
            clipboardHub.start();
        } else {
            console.log(
                JSON.stringify({
                    channel: "cwsp-clipboard-hub",
                    event: "skipped",
                    reason: "not-desktop-package; set CWSP_CLIPBOARD_HUB=1 to force",
                    localId,
                    packageRoot
                })
            );
        }
    }

    // WHY: files-hub is constructed with stub `sendPacket` / `putBlob` adapters
    // (parity with windows boot) so the hub exercises the real offer path on
    // boot. Stubs no-op + log; W4 swaps the real WS sender and HTTP PUT to
    // /files/blob/:t/:b. INVARIANT: separate FilesPromptState — never overload
    // the clipboard prompt state machine.
    // 2026-07-21: wrap createFilesHub in try/catch (parity with windows boot) so
    // a hub construction failure is logged but NEVER kills control + clipboard
    // boot. filesHub stays undefined and the global assignment is skipped.
    let filesHub: ReturnType<typeof createFilesHub> | undefined;
    try {
        // WHY: CWSP tab shell.files* → portable.config; apply at hub construct.
        const settingsSnap = (await runtime.settings.get()) as Record<string, unknown>;
        const shell =
            settingsSnap.shell && typeof settingsSnap.shell === "object"
                ? (settingsSnap.shell as Record<string, unknown>)
                : {};
        const byteHintRaw = String(shell.filesByteTransport || "auto").trim().toLowerCase();
        const byteTransportHint =
            byteHintRaw === "http" || byteHintRaw === "ws" ? byteHintRaw : "auto";
        const acceptInbound = shell.acceptInboundFilesData !== false;
        filesHub = createFilesHub({
            senderId: localId,
            allowShareToAll: shell.filesAllowShareToAll === true,
            byteTransportHint,
            acceptMode:
                acceptInbound && String(shell.filesInboundMode || "ask").toLowerCase() === "auto"
                    ? "auto"
                    : "manual",
            sendPacket: (packet) => {
                // WHY: real wire-send via the same ProtocolServer.ingest adapter
                // the clipboard hub uses — preserves nodes/destinations on the
                // packet and routes through /ws to the gateway / peers.
                try {
                    const ingested = protocol.ingest(packet);
                    if (ingested && typeof (ingested as Promise<unknown>).then === "function") {
                        void (ingested as Promise<unknown>).catch((error: unknown) => {
                            console.error(JSON.stringify({
                                channel: "cwsp-files-hub",
                                event: "send-packet-ingest-error",
                                localId,
                                what: packet.what,
                                error: error instanceof Error ? error.message : String(error)
                            }));
                        });
                    }
                    console.log(JSON.stringify({
                        channel: "cwsp-files-hub",
                        event: "offer-sent",
                        localId,
                        what: packet.what,
                        transferId: (packet.payload as { transferId?: string } | undefined)?.transferId ?? null
                    }));
                } catch (error) {
                    console.error(JSON.stringify({
                        channel: "cwsp-files-hub",
                        event: "send-packet-error",
                        localId,
                        what: packet.what,
                        error: error instanceof Error ? error.message : String(error)
                    }));
                }
            },
            putBlob: async (input) => {
                console.log(JSON.stringify({
                    channel: "cwsp-files-hub",
                    event: "put-blob-stub",
                    localId,
                    transferId: input.transferId,
                    batchId: input.batchId,
                    size: input.bytes.length
                }));
                // WHY: no W2 blob endpoint wired yet — empty url so small batches
                // embed and large batches surface files:error (W3 contract).
                return { url: "" };
            },
            onFilesPromptUpdate: (state: FilesPromptState | null) => {
                console.log(JSON.stringify({
                    channel: "cwsp-files-hub",
                    event: "files-prompt-update",
                    localId,
                    kind: state?.kind ?? null,
                    transferId: state?.transferId ?? null,
                    fileCount: state?.fileCount ?? 0
                }));
            }
        });
    } catch (error) {
        console.error(JSON.stringify({
            channel: "cwsp-files-hub",
            event: "create-files-hub-failed",
            localId,
            error: error instanceof Error ? error.message : String(error)
        }));
    }
    filesHubRef = filesHub;

    const g = globalThis as unknown as {
        __CWSP_FILES_HUB__?: typeof filesHub;
    };
    if (filesHub) g.__CWSP_FILES_HUB__ = filesHub;

    // WHY: WebNative UI needs the same auth file as Neutralino to sync hub tokens on boot.
    publishControlAuth(runtime.auth, packageRoot);

    console.log(
        JSON.stringify({
            shell: useWebnative ? "webnative" : "neutralino",
            platform: runtime.platform,
            publicDir: runtime.publicDir,
            controlPort: runtime.auth.port,
            configPath: runtime.settings.filePath,
            clipboard: "ready",
            clipboardHub:
                clipboardHub && shouldStartClipboardHub(packageRoot) ? "starting" : "skipped",
            // WHY: createFilesHub is best-effort — missing fflate must not block ready banner.
            filesHub: filesHub ? "real-send" : "skipped"
        })
    );
}

const isDirectRun =
    typeof process.argv[1] === "string" &&
    (process.argv[1].endsWith("/linux/index.ts") ||
        process.argv[1].endsWith("/linux/index.js"));

if (isDirectRun) {
    void main().catch((error: unknown) => {
        console.error("[CWSP Neutralino/linux] backend failed", error);
        process.exitCode = 1;
    });
}
