/*
 * Filename: index.ts
 * FullPath: apps/CWSP-reborn/src/backend/node/windows/index.ts
 * Change date and time: 17.30.00_21.07.2026
 * Reason for changes: Node backend keeps control+hub+toast alive when Neutralino
 *   UI exits (popups are Node-owned). Opt-in CWSP_EXIT_WITH_NEUTRALINO=1 for legacy.
 *   2026-07-17b: onPromptUpdate(null) → promptHost.release() (not stop).
 *   2026-07-18: keep control/hub alive if only extNode IPC dies.
 *   2026-07-20: portable .config beside exe; backend may run from TEMP tar.gz unpack.
 *   2026-07-21: wall-clock gap after sleep/resume → clipboardHub.reload().
 *   2026-07-21b: files-hub wired with stub sendPacket/putBlob adapters
 *   (no-op + log) so the real offer path runs on boot; W4 swaps real senders.
 *   2026-07-21c: wire real sendPacket via protocol.ingest (was stub) and divert
 *   clipboard CF_HDROP file-drops to filesHub.ingressLocalPaths (Explorer "Copy"
 *   on files → files:offer). putBlob stays stub (small batches embed; large →
 *   files:error until a blob server lands).
 *   2026-07-21d: Network POST /service/files-ingress — drop + paste (fromClipboard
 *   re-reads CF_HDROP when WebView File.path is empty).
 *   2026-07-21e: files-hub sendPacket → clipboardHub.sendWirePacket (/ws), NOT
 *   protocol.ingest (ingest never left the desk — Cap saw no files:offer).
 *   2026-07-21 (Bug A/B): onFilesPromptUpdate now emits a clearer structured
 *   log line for open-for-share / accept kinds so the operator can see the
 *   prompt transition. We do NOT invent a second toast stack — the clipboard
 *   prompt host has no generic notify/show API, and no BurntToast usage exists
 *   in the repo. The WebView UI remains the visible prompt surface.
 */

import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

import {
    startNeutralinoBackend,
    createClipboardHub,
    createClipboardPromptHost,
    createFilesHub,
    type FilesPromptState
} from "../shared/neutralino/index.ts";
import {
    putFilesBlob,
    buildFilesBlobUrl,
    getFilesBlobBytes
} from "../shared/neutralino/files-blob-store.ts";
import { startWebnativeBackend } from "../shared/webnative/index.ts";
import { createWindowsProtocolServer } from "./windowsHandlers.ts";
import { splitMultiValueList } from "@fest-lib/cwsp-shared/v2/index.ts";

export * from "./settings.ts";
export { startNeutralinoBackend, startWebnativeBackend, createClipboardHub, createFilesHub };
export { createWindowsProtocolServer };

/** Default loopback control port (WebView + extNode share this).
 * WHY: 18765 is often taken by Cursor.exe utility on developer desks → ERR_EMPTY_RESPONSE. */
// WHY: Cursor.exe on desk often steals :19875/:19876 (ERR_EMPTY_RESPONSE).
// Prefer a CWSP-owned loopback band away from IDE port proxies.
const DEFAULT_CONTROL_PORT = 29110;
/** INVARIANT: loopback-only desktop default; override with CWSP_CONTROL_KEY. */
const DEFAULT_CONTROL_KEY = "cwsp-neutralino-local";

/**
 * Host root = directory of the Neutralino .exe (resources, .config, auth .tmp).
 * WHY: when backend code is unpacked under %TEMP%, cwd is TEMP — must not store
 * durable settings/auth there.
 */
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

/** Durable settings file: <exeDir>/.config/portable.config.json (or env override). */
function resolveConfigPath(hostRoot: string): string {
    const fromEnv =
        String(process.env.CWSP_PORTABLE_CONFIG || "").trim() ||
        String(process.env.CWS_PORTABLE_CONFIG_PATH || "").trim();
    if (fromEnv) return path.resolve(fromEnv);

    const configDir = path.join(hostRoot, ".config");
    const preferred = path.join(configDir, "portable.config.json");
    try {
        fs.mkdirSync(configDir, { recursive: true });
    } catch {
        /* ignore */
    }
    if (!fs.existsSync(preferred)) {
        const legacy = [
            path.join(hostRoot, "portable.config.json"),
            path.join(hostRoot, "backend", "node", "portable.config.json")
        ];
        for (const src of legacy) {
            if (!fs.existsSync(src)) continue;
            try {
                fs.copyFileSync(src, preferred);
                break;
            } catch {
                /* ignore */
            }
        }
    }
    return preferred;
}

/**
 * Persist control auth next to the Neutralino package so the WebView inject/entry
 * can set `__WEBNATIVE_AUTH__` / `__NEUTRALINO_AUTH__` without guessing.
 */
function publishControlAuth(auth: { port: number; key: string }, packageRoot: string): string {
    const tmpDir = path.join(packageRoot, ".tmp");
    fs.mkdirSync(tmpDir, { recursive: true });
    const authPath = path.join(tmpDir, "cwsp-control-auth.json");
    const payload = {
        port: auth.port,
        key: auth.key,
        host: "127.0.0.1",
        serviceConfig: "/service/config",
        serviceClipboard: "/service/clipboard",
        serviceClipboardHub: "/service/clipboard-hub",
        serviceClipboardPrompt: "/service/clipboard-prompt",
        serviceDispatch: "/service/dispatch",
        neutralinoConfig: "/neutralino/config",
        writtenAt: new Date().toISOString()
    };
    fs.writeFileSync(authPath, JSON.stringify(payload, null, 2) + "\n", "utf8");
    const jsPath = path.join(tmpDir, "__webnative_auth__.js");
    fs.writeFileSync(
        jsPath,
        `/* auto-generated by CWSP Neutralino backend */\n` +
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
 * clipboard hub target resolution — multi-value fields (comma/semicolon/
 * whitespace) are split into trimmed non-empty tokens.
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
 * Windows desktop backend entry for Neutralino (preferred) and WebNative (compat).
 *
 * WHY: ProtocolServer + ClipboardService + clipboard-hub must live in Node.
 * WebView may call /service/clipboard for local preview, but LAN sync is Node-owned.
 */
export async function main(): Promise<void> {
    const shell = String(process.env.CWSP_DESKTOP_SHELL ?? "neutralino").toLowerCase();
    const useWebnative = shell === "webnative";
    const packageRoot = resolvePackageRoot();
    const configPath = resolveConfigPath(packageRoot);
    const controlPort = Number(process.env.CWSP_CONTROL_PORT || DEFAULT_CONTROL_PORT) || DEFAULT_CONTROL_PORT;
    const apiKey = String(process.env.CWSP_CONTROL_KEY || DEFAULT_CONTROL_KEY);
    // Prefer short fleet id (L-110) so gateway routing matches Android / Settings peers.
    const localId = process.env.CWSP_CLIENT_ID ?? "L-110";

    const { server: protocol, clipboard } = createWindowsProtocolServer({
        localId,
        onEmit: async (packet) => {
            if (process.env.CWSP_PROTOCOL_TRACE === "1") {
                console.log("[cwsp:protocol:emit]", JSON.stringify(packet));
            }
        }
    });

    const onDispatch = async (packet: unknown) => protocol.ingest(packet);
    const onClipboard = {
        async read(opts?: { kind?: string }) {
            const kind = String(opts?.kind || "text").toLowerCase();
            if (kind === "image") {
                try {
                    const data = await clipboard.readImageBase64();
                    return {
                        ok: true,
                        kind: "image",
                        mimeType: "image/png",
                        data,
                        imageBase64: data
                    };
                } catch (error) {
                    return {
                        ok: false,
                        kind: "image",
                        error: {
                            code: "CLIPBOARD_IMAGE_EMPTY",
                            message: error instanceof Error ? error.message : String(error)
                        }
                    };
                }
            }
            const text = await clipboard.readText();
            return { ok: true, kind: "text", text, content: text, body: text, data: text };
        },
        async write(payload: Record<string, unknown>) {
            const body = asRecord(payload);
            const kind = String(body.kind || (body.asset || body.imageBase64 ? "image" : "text")).toLowerCase();
            try {
                if (kind === "image" || body.asset || body.imageBase64) {
                    // WHY: call PS1 SetImage directly — ProtocolServer normalize can drop
                    // non-DataAsset carriers; clipboardy cannot apply images.
                    const assetData =
                        body.asset && typeof body.asset === "object"
                            ? String((body.asset as { data?: unknown }).data || "")
                            : "";
                    const imageData =
                        (typeof body.imageBase64 === "string" && body.imageBase64) ||
                        assetData ||
                        "";
                    if (!imageData) {
                        return {
                            ok: false,
                            kind: "image",
                            error: {
                                code: "CLIPBOARD_IMAGE_EMPTY",
                                message: "No imageBase64/asset.data in write payload"
                            }
                        };
                    }
                    await clipboard.writeImageBase64(imageData);
                    return { ok: true, kind: "image", bytesHint: imageData.length };
                }
                const text =
                    (typeof body.text === "string" && body.text) ||
                    (typeof body.content === "string" && body.content) ||
                    (typeof body.body === "string" && body.body) ||
                    (typeof body.data === "string" && body.data) ||
                    "";
                await clipboard.writeText(text);
                return { ok: true, kind: "text", textLength: text.length };
            } catch (error) {
                return {
                    ok: false,
                    error: {
                        code: "CLIPBOARD_WRITE_FAILED",
                        message: error instanceof Error ? error.message : String(error)
                    }
                };
            }
        }
    };

    // Placeholder filled after hub create (control needs callbacks at listen).
    let hubStatus = (): Record<string, unknown> => ({ running: false, connected: false });
    let hubReload = (): void => undefined;
    // WHY: prompt hooks read live hub state; safe to return null before hub is wired.
    let hubPromptGet = (): Record<string, unknown> | null => null;
    let hubPromptAction = async (
        _action: "share" | "dismiss" | "erase" | "accept" | "undo" | "take"
    ): Promise<boolean | { applied: boolean; text?: string; hasImage?: boolean }> => false;
    // WHY: Network drop/paste POSTs absolute paths (or fromClipboard) here; filled after filesHub create.
    let hubFilesIngress = async (_input: {
        paths?: string[];
        fromClipboard?: boolean;
    }): Promise<Record<string, unknown>> => ({
        ok: false,
        error: "files-hub-not-ready"
    });

    const runtime = useWebnative
        ? await startWebnativeBackend({
              platform: "windows",
              enableClipboard: true,
              controlPort,
              apiKey
          })
        : await startNeutralinoBackend({
              platform: "windows",
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
              // WHY: popup bridge polls /service/clipboard-prompt — plumb to hub state.
              onClipboardPromptGet: async () => hubPromptGet(),
              onClipboardPromptAction: async (action) => hubPromptAction(action),
              onFilesIngress: async (input) => hubFilesIngress(input),
              onFilesBlobGet: async (transferId, batchId, token) => {
                  const { getFilesBlobBytes } = await import("../shared/neutralino/files-blob-store.ts");
                  const hit = await getFilesBlobBytes(transferId, batchId, token);
                  if (!hit) return null;
                  return {
                      bytes: hit.bytes,
                      mimeType: hit.meta.mimeType,
                      name: hit.meta.name
                  };
              }
          });

    // Independent native toast (WinForms PS1 on Windows — NOT a second Neutralino).
    const promptHost = createClipboardPromptHost({
        packageRoot,
        // WHY: control may fall back (Cursor on 18765) — always use the bound port.
        getAuth: () => ({ port: runtime.auth.port, key: runtime.auth.key }),
        // WHY: after standby, Waiting toast can exit before paint; host crash-loop
        // give-up must clear hub hold or ensureRunning never stops wanting a toast.
        onGiveUp: () => {
            void hubPromptAction("dismiss").catch(() => undefined);
        }
    });

    // WHY: clipboard toast + /service/config are Node-owned. Neutralino WebView is
    // optional UI — when NL dies, keep control/hub/promptHost alive so popups still work.
    // Opt-in legacy: CWSP_EXIT_WITH_NEUTRALINO=1 restores old exit-on-NL-gone behavior.
    // INVARIANT (Windows): do NOT use process.kill(pid, 0) — it throws EPERM/ESRCH
    // spuriously and would exit a healthy control host.
    const parentPid = Number(process.env.CWSP_PARENT_PID || 0);
    const nlPid = Number(process.env.CWSP_NL_PID || 0);
    const exitWithNeutralino =
        String(process.env.CWSP_EXIT_WITH_NEUTRALINO || "").trim() === "1";
    let parentWatch: ReturnType<typeof setInterval> | null = null;
    let loggedExtNodeGone = false;
    let loggedNlGoneKeepAlive = false;

    const isPidAlive = (pid: number): boolean | null => {
        if (pid <= 0) return null;
        if (process.platform === "win32") {
            try {
                const out = execFileSync(
                    "tasklist",
                    ["/FI", `PID eq ${pid}`, "/NH"],
                    { encoding: "utf8", windowsHide: true }
                );
                return String(out).includes(String(pid));
            } catch {
                return null; // transient — treat as unknown, do not exit
            }
        }
        try {
            process.kill(pid, 0);
            return true;
        } catch {
            return false;
        }
    };

    if (nlPid > 0 || parentPid > 0) {
        parentWatch = setInterval(() => {
            if (nlPid > 0) {
                const nlAlive = isPidAlive(nlPid);
                if (nlAlive === false) {
                    if (exitWithNeutralino) {
                        try {
                            promptHost.dispose();
                        } catch {
                            /* ignore */
                        }
                        if (parentWatch) clearInterval(parentWatch);
                        console.warn(
                            JSON.stringify({
                                channel: "cwsp-backend",
                                event: "nl-host-gone",
                                parentPid,
                                nlPid,
                                via: process.platform === "win32" ? "tasklist" : "kill0"
                            })
                        );
                        process.exit(0);
                    }
                    if (!loggedNlGoneKeepAlive) {
                        loggedNlGoneKeepAlive = true;
                        console.warn(
                            JSON.stringify({
                                channel: "cwsp-backend",
                                event: "nl-host-gone-keep-alive",
                                parentPid,
                                nlPid,
                                note: "Node control+hub+toast stay up without Neutralino UI"
                            })
                        );
                    }
                }
                // WHY: extNode can IPC-detach while Neutralino.exe + tray stay up.
                if (parentPid > 0 && isPidAlive(parentPid) === false && !loggedExtNodeGone) {
                    loggedExtNodeGone = true;
                    console.warn(
                        JSON.stringify({
                            channel: "cwsp-backend",
                            event: "extnode-gone-keep-alive",
                            parentPid,
                            nlPid,
                            note: "control host stays up for toast + tray WebView"
                        })
                    );
                }
                return;
            }
            // COMPAT: older extNode that did not pass CWSP_NL_PID.
            if (parentPid > 0 && isPidAlive(parentPid) === false) {
                try {
                    promptHost.dispose();
                } catch {
                    /* ignore */
                }
                if (parentWatch) clearInterval(parentWatch);
                console.warn(
                    JSON.stringify({
                        channel: "cwsp-backend",
                        event: "parent-gone",
                        parentPid,
                        nlPid,
                        via: process.platform === "win32" ? "tasklist" : "kill0"
                    })
                );
                process.exit(0);
            }
        }, 2000);
    }

    const shutdown = (reason: string) => {
        try {
            promptHost.dispose();
        } catch {
            /* ignore */
        }
        if (parentWatch) {
            clearInterval(parentWatch);
            parentWatch = null;
        }
        console.log(
            JSON.stringify({ channel: "cwsp-backend", event: "shutdown", reason })
        );
    };
    process.once("SIGINT", () => {
        shutdown("SIGINT");
        process.exit(0);
    });
    process.once("SIGTERM", () => {
        shutdown("SIGTERM");
        process.exit(0);
    });
    process.once("exit", () => {
        shutdown("exit");
    });

    // INVARIANT: hub runs for both Neutralino and WebNative — WebView must not own LAN clipboard.
    // WHY: filesHub is created AFTER clipboardHub (below). Use a forward ref so the
    // clipboard file-drop callback can ingress into files-hub once it exists.
    let filesHubRef: ReturnType<typeof createFilesHub> | undefined;
    const clipboardHub = createClipboardHub({
              localId,
              packageRoot,
              getSettings: () => runtime.settings.get(),
              adapters: {
                  // WHY: Windows often keeps CF_DIB/PNG *alongside* a new text copy.
                  // Returning "" whenever containsImage() was true sacrificed all text sync
                  // after any image had been on the clipboard. Only suppress URI/label ghosts.
                  readText: async () => {
                      const text = String((await clipboard.readText()) ?? "").trim();
                      if (!text) return "";
                      try {
                          if (
                              /^(content|file|https?):\/\//i.test(text) &&
                              (await clipboard.containsImage())
                          ) {
                              return "";
                          }
                      } catch {
                          /* keep text */
                      }
                      return text;
                  },
                  writeText: (text) => clipboard.writeText(text),
                  containsImage: () => clipboard.containsImage(),
                  readImageBase64: async () => {
                      try {
                          return await clipboard.readImageBase64();
                      } catch {
                          return null;
                      }
                  },
                  writeImageBase64: (data) => clipboard.writeImageBase64(data),
                  // WHY: CF_HDROP (Explorer "Copy" on files) — divert to files-hub.
                  containsFileDropList: () => clipboard.containsFileDropList(),
                  readFileDropList: () => clipboard.readFileDropList(),
                  ingest: (packet) => protocol.ingest(packet)
              },
              // WHY: Neutralino second-process toast abandoned — WinForms PS1 polls control HTTP.
              // INVARIANT: on null use release() not stop() — hard-kill + spawn cooldown
              // previously blocked the next toast for text and images.
              onPromptUpdate: (state) => {
                  if (state) {
                      promptHost.ensureRunning();
                      console.log(JSON.stringify({
                          channel: "cwsp-clipboard-hub",
                          event: "prompt-update",
                          localId,
                          kind: state.kind,
                          mode: state.mode,
                          len: state.textLength,
                          hasImage: state.hasImage
                      }));
                  } else {
                      promptHost.release();
                  }
              },
              // WHY: divert local clipboard file-drops to files-hub (Explorer "Copy").
              // INVARIANT: files must never go through clipboard:update.
              onLocalFileDrop: (paths) => {
                  if (!filesHubRef) {
                      console.log(JSON.stringify({
                          channel: "cwsp-files-hub",
                          event: "clipboard-files-detected",
                          localId,
                          count: paths.length,
                          outcome: "no-files-hub"
                      }));
                      return;
                  }
                  void (async () => {
                      try {
                          const settingsSnap = (await runtime.settings.get()) as Record<string, unknown>;
                          const shell =
                              settingsSnap.shell && typeof settingsSnap.shell === "object"
                                  ? (settingsSnap.shell as Record<string, unknown>)
                                  : {};
                          const destinations = resolveFilesDestinations(settingsSnap, localId);
                          const openForShare =
                              String(shell.filesOpenForShareMode || "auto").trim().toLowerCase() === "manual"
                                  ? "manual"
                                  : "auto";
                          console.log(JSON.stringify({
                              channel: "cwsp-files-hub",
                              event: "clipboard-files-detected",
                              localId,
                              count: paths.length,
                              destinations,
                              openForShare
                          }));
                          console.log(JSON.stringify({
                              channel: "cwsp-files-hub",
                              event: "ingress-start",
                              localId,
                              source: "clipboard",
                              count: paths.length
                          }));
                          const session = await filesHubRef!.ingressLocalPaths({
                              source: "clipboard",
                              paths,
                              defaultDestinations: destinations,
                              openForShare
                          });
                          console.log(JSON.stringify({
                              channel: "cwsp-files-hub",
                              event: "ingress-staged",
                              localId,
                              transferId: session.transferId,
                              phase: session.phase,
                              fileCount: session.files.length
                          }));
                      } catch (error) {
                          console.error(JSON.stringify({
                              channel: "cwsp-files-hub",
                              event: "ingress-failed",
                              localId,
                              error: error instanceof Error ? error.message : String(error)
                          }));
                      }
                  })();
              },
              // WHY: Cap/peer files:offer arrives on the shared clipboard /ws.
              // Divert to filesHub Accept/Decline — never OS clipboard.
              onInboundFilesPacket: (packet) => {
                  if (!filesHubRef) {
                      console.log(JSON.stringify({
                          channel: "cwsp-files-hub",
                          event: "inbound-files-dropped",
                          localId,
                          what: packet.what,
                          reason: "no-files-hub"
                      }));
                      return;
                  }
                  const what = String(packet.what || "");
                  if (what === "files:error") {
                      console.warn(JSON.stringify({
                          channel: "cwsp-files-hub",
                          event: "inbound-files-error",
                          localId,
                          transferId: (packet.payload as { transferId?: string } | undefined)?.transferId ?? null,
                          reason: (packet.payload as { reason?: string } | undefined)?.reason ?? null
                      }));
                      return;
                  }
                  // WHY: Cap Accept emits files:accept — desk must log it. Without
                  // this branch the divert was silent and putBlob/WS push never
                  // started (user: "Node never gets signal to begin transfer").
                  if (what === "files:accept" || what === "files:decline") {
                      console.log(JSON.stringify({
                          channel: "cwsp-files-hub",
                          event: what === "files:accept" ? "accept-received" : "decline-received",
                          localId,
                          transferId: (packet.payload as { transferId?: string } | undefined)?.transferId ?? null,
                          sender: packet.sender ?? packet.byId ?? packet.from ?? null,
                          destinations: packet.destinations ?? packet.nodes ?? []
                      }));
                      return;
                  }
                  if (what !== "files:offer") {
                      console.log(JSON.stringify({
                          channel: "cwsp-files-hub",
                          event: "inbound-files-other",
                          localId,
                          what
                      }));
                      return;
                  }
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
              }
          });

    if (clipboardHub) {
        hubStatus = () => clipboardHub.status() as unknown as Record<string, unknown>;
        hubReload = () => clipboardHub.reload();
        // WHY: control RPC delegates /service/clipboard-prompt to the live hub instance.
        hubPromptGet = () =>
            clipboardHub.getPromptState() as unknown as Record<string, unknown> | null;
        // WHY: `take` Accepts inbound ask and returns full text for CRX Paste bypass.
        hubPromptAction = (action) =>
            action === "take"
                ? clipboardHub.takeInboundAskForPaste()
                : clipboardHub.resolvePrompt(action);
        if (process.env.CWSP_CLIPBOARD_HUB !== "0") {
            clipboardHub.start();
        }
        // WHY: Windows sleep freezes Node timers; on wake Date.now() jumps.
        // Force hub reconnect so half-open /ws to gateway does not linger.
        let lastWakeSample = Date.now();
        const wakeWatch = setInterval(() => {
            const now = Date.now();
            const gap = now - lastWakeSample;
            lastWakeSample = now;
            if (gap < 25_000) return;
            console.warn(
                JSON.stringify({
                    channel: "cwsp-backend",
                    event: "resume-reload-hub",
                    gapMs: gap
                })
            );
            try {
                clipboardHub.reload();
            } catch {
                /* ignore */
            }
        }, 5_000);
        try {
            (wakeWatch as { unref?: () => void }).unref?.();
        } catch {
            /* ignore */
        }
    }

    // WHY: files-hub is constructed with stub `sendPacket` / `putBlob` adapters
    // so the hub exercises the real offer path (materialize → publish → emit)
    // on boot instead of staying staged-only. The stubs no-op + log; W4 swaps
    // them for the real WS sender and HTTP PUT to /files/blob/:t/:b. INVARIANT:
    // separate FilesPromptState — never overload the clipboard prompt state machine.
    // 2026-07-21: wrap createFilesHub in try/catch so a hub construction failure
    // (e.g. fflate missing before the lazy-import fix, or a bad adapter) is logged
    // but NEVER kills control + clipboard boot. filesHub stays undefined and the
    // global assignment is skipped; the rest of the backend keeps running.
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
            // WHY: acceptInboundFilesData=false → stay on manual prompt and never auto-land.
            acceptMode:
                acceptInbound && String(shell.filesInboundMode || "ask").toLowerCase() === "auto"
                    ? "auto"
                    : "manual",
            sendPacket: (packet) => {
                // WHY: protocol.ingest only runs local handlers (clipboard/AHK) —
                // it NEVER puts bytes on /ws. Cap peers only see frames that
                // ride the clipboard-hub socket (same path as clipboard:update).
                const ok = clipboardHub.sendWirePacket(packet);
                console.log(JSON.stringify({
                    channel: "cwsp-files-hub",
                    event: ok ? "offer-sent" : "offer-send-failed",
                    localId,
                    what: packet.what,
                    transferId: (packet.payload as { transferId?: string } | undefined)?.transferId ?? null,
                    destinations: packet.destinations ?? packet.nodes ?? [],
                    hubConnected: clipboardHub.status().connected
                }));
                if (!ok) {
                    throw new Error("CWSP_FILES_WS_NOT_CONNECTED");
                }
            },
            putBlob: async (input) => {
                const stageRoot = path.join(packageRoot, ".data", "files-hub");
                const meta = await putFilesBlob({
                    rootDir: stageRoot,
                    transferId: input.transferId,
                    batchId: input.batchId,
                    bytes: input.bytes,
                    hash: input.hash,
                    name: input.name,
                    mimeType: input.mimeType
                });
                const settingsSnap = (await runtime.settings.get()) as Record<string, unknown>;
                const shell =
                    settingsSnap.shell && typeof settingsSnap.shell === "object"
                        ? (settingsSnap.shell as Record<string, unknown>)
                        : {};
                // WHY: Cap HTTP-pulls this URL. Prefer explicit base; else LAN desk IP
                // + bound control port (cleartext allowed for 192.168.0.110 in Cap NSC).
                const explicit = String(
                    shell.filesBlobBaseUrl || shell.controlPublicUrl || ""
                ).trim();
                const host = String(
                    shell.lanHost || shell.localLanHost || "192.168.0.110"
                ).trim() || "192.168.0.110";
                const port = runtime.auth.port || controlPort;
                const baseUrl = explicit || `http://${host}:${port}`;
                const url = buildFilesBlobUrl({
                    baseUrl,
                    transferId: meta.transferId,
                    batchId: meta.batchId,
                    token: meta.token
                });
                console.log(JSON.stringify({
                    channel: "cwsp-files-hub",
                    event: "put-blob-ok",
                    localId,
                    transferId: input.transferId,
                    batchId: input.batchId,
                    size: input.bytes.length,
                    url
                }));
                return { url };
            },
            getBlob: async (url) => {
                // WHY: support both remote HTTP and local blob URLs (loopback/LAN).
                try {
                    const u = new URL(url);
                    const m = u.pathname.match(/\/service\/files-blob\/([^/]+)\/([^/]+)/);
                    if (m) {
                        const transferId = decodeURIComponent(m[1] || "");
                        const batchId = decodeURIComponent(m[2] || "");
                        const token = u.searchParams.get("token") || "";
                        const hit = await getFilesBlobBytes(transferId, batchId, token);
                        if (hit) return new Uint8Array(hit.bytes);
                    }
                } catch {
                    /* fall through to fetch */
                }
                const res = await fetch(url);
                if (!res.ok) throw new Error(`CWSP_FILES_HTTP_${res.status}`);
                return new Uint8Array(await res.arrayBuffer());
            },
            onFilesPromptUpdate: (state: FilesPromptState | null) => {
                // WHY: clipboard prompt host has no generic notify API. For files
                // Accept / Open-for-Share we (1) log structured events and (2) fire a
                // short Windows balloon via NotifyIcon so the desk user sees an ask
                // without inventing a second toast stack / BurntToast dependency.
                const kind = state?.kind ?? null;
                if (kind === "open-for-share" || kind === "accept") {
                    console.log(JSON.stringify({
                        channel: "cwsp-files-hub",
                        event: "files-prompt-update",
                        kind,
                        localId,
                        transferId: state?.transferId ?? null,
                        sender: state?.sender ?? null,
                        fileCount: state?.fileCount ?? 0,
                        totalBytes: state?.totalBytes ?? 0,
                        note: kind === "accept"
                            ? "Inbound files:offer awaiting Accept"
                            : "Open-for-Share staged — confirm destinations if needed"
                    }));
                    try {
                        const title = kind === "accept"
                            ? "CWSP Files — Accept?"
                            : "CWSP Files — Open for Share";
                        const body = kind === "accept"
                            ? `${state?.fileCount ?? 0} file(s) from ${state?.sender || "peer"} — check CWSP Network / logs to Accept`
                            : `${state?.fileCount ?? 0} file(s) staged — offering to peers`;
                        // WHY: System.Windows.Forms.NotifyIcon is built-in on Windows
                        // desktops (no BurntToast). Balloon Tip auto-dismisses.
                        const ps = [
                            "Add-Type -AssemblyName System.Windows.Forms;",
                            "$n = New-Object System.Windows.Forms.NotifyIcon;",
                            "$n.Icon = [System.Drawing.SystemIcons]::Information;",
                            "$n.Visible = $true;",
                            `$n.BalloonTipTitle = '${title.replace(/'/g, "''")}';`,
                            `$n.BalloonTipText = '${body.replace(/'/g, "''")}';`,
                            "$n.ShowBalloonTip(6000);",
                            "Start-Sleep -Milliseconds 6500;",
                            "$n.Dispose();"
                        ].join(" ");
                        void import("node:child_process").then(({ execFile }) => {
                            execFile(
                                "powershell.exe",
                                ["-NoProfile", "-NonInteractive", "-Command", ps],
                                { windowsHide: true },
                                () => { /* best-effort balloon */ }
                            );
                        });
                    } catch {
                        /* best-effort desk balloon */
                    }
                } else {
                    console.log(JSON.stringify({
                        channel: "cwsp-files-hub",
                        event: "files-prompt-update",
                        localId,
                        kind,
                        transferId: state?.transferId ?? null,
                        fileCount: state?.fileCount ?? 0
                    }));
                }
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
    // WHY: bind the forward ref so the clipboard file-drop callback can ingress.
    filesHubRef = filesHub;
    // WHY: Network drop/paste → POST /service/files-ingress → same ingress path
    // as Explorer CF_HDROP (openForShare auto + configured destinations).
    // Paste may send paths from WebView File.path, or fromClipboard to re-read CF_HDROP.
    hubFilesIngress = async (input) => {
        if (!filesHubRef) {
            return { ok: false, error: "files-hub-unavailable" };
        }
        let paths = Array.isArray(input.paths)
            ? input.paths.map((p) => String(p || "").trim()).filter(Boolean)
            : [];
        if (input.fromClipboard || paths.length === 0) {
            // WHY: WebView paste often lacks File.path; OS CF_HDROP is authoritative.
            try {
                if (await clipboard.containsFileDropList()) {
                    const dropped = await clipboard.readFileDropList();
                    if (dropped.length) paths = dropped;
                }
            } catch (error) {
                console.log(JSON.stringify({
                    channel: "cwsp-files-hub",
                    event: "files-ingress-clipboard-read-failed",
                    localId,
                    error: error instanceof Error ? error.message : String(error)
                }));
            }
        }
        if (paths.length === 0) {
            return { ok: false, error: "no-file-paths" };
        }
        const settingsSnap = (await runtime.settings.get()) as Record<string, unknown>;
        const destinations = resolveFilesDestinations(settingsSnap, localId);
        const session = await filesHubRef.ingressLocalPaths({
            source: "picker",
            paths,
            defaultDestinations: destinations.length ? destinations : ["L-196", "L-210"],
            openForShare: "auto"
        });
        console.log(JSON.stringify({
            channel: "cwsp-files-hub",
            event: "network-files-ingress",
            localId,
            count: paths.length,
            fromClipboard: Boolean(input.fromClipboard),
            transferId: session.transferId,
            phase: session.phase,
            destinations
        }));
        return {
            ok: true,
            transferId: session.transferId,
            phase: session.phase,
            fileCount: session.files.length,
            destinations
        };
    };

    const g = globalThis as unknown as {
        __CWSP_PROTOCOL__?: typeof protocol;
        __CWSP_CONTROL_AUTH__?: { port: number; key: string };
        __CWSP_CLIPBOARD__?: typeof clipboard;
        __CWSP_CLIPBOARD_HUB__?: typeof clipboardHub;
        __CWSP_FILES_HUB__?: typeof filesHub;
    };
    g.__CWSP_PROTOCOL__ = protocol;
    g.__CWSP_CLIPBOARD__ = clipboard;
    g.__CWSP_CLIPBOARD_HUB__ = clipboardHub;
    if (filesHub) g.__CWSP_FILES_HUB__ = filesHub;
    g.__CWSP_CONTROL_AUTH__ = runtime.auth;

    const authPath = publishControlAuth(runtime.auth, packageRoot);

    console.log(
        JSON.stringify({
            shell: useWebnative ? "webnative" : "neutralino",
            platform: runtime.platform,
            publicDir: runtime.publicDir,
            controlPort: runtime.auth.port,
            configPath: runtime.settings.filePath,
            authPath,
            clipboard: "ready",
            protocol: "ready",
            clipboardHub: clipboardHub ? "starting" : "skipped",
            // WHY: createFilesHub is best-effort — missing fflate must not block ready banner.
            filesHub: filesHub ? "real-send" : "skipped"
        })
    );
}

const isDirectRun =
    typeof process.argv[1] === "string" &&
    (process.argv[1].endsWith("/windows/index.ts") ||
        process.argv[1].endsWith("\\windows\\index.ts") ||
        process.argv[1].endsWith("/windows/index.js") ||
        process.argv[1].endsWith("\\windows\\index.js"));

if (isDirectRun) {
    void main().catch((error: unknown) => {
        console.error("[CWSP Neutralino/windows] backend failed", error);
        process.exitCode = 1;
    });
}
