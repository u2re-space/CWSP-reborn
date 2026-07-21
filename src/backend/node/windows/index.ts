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
 *   2026-07-21f: Cap→desk Ask Accept uses clipboard-prompt popup (Accept/
 *   Decline); after Accept, optional CF_HDROP copy (filesCopyOnReceive default on).
 *   2026-07-21g: files toast title "Incoming files"; stable expiresAt; toast
 *   crash-loop must not auto-decline pending files Accept; re-ensure toast.
 *   2026-07-21h: Cap→desk offer used type without what — resolve what||type so
 *   Accept toast actually appears.
 *   2026-07-21i: post-Accept "Files ready" toast (notify / Copy); Cap asset.name
 *   uses Share display name (not batchId).
 *   2026-07-21j: files-ready toast Open File / Open in Folder (Explorer).
 */

import fs from "node:fs";
import path from "node:path";
import { execFile, execFileSync } from "node:child_process";

import {
    startNeutralinoBackend,
    createClipboardHub,
    createClipboardPromptHost,
    createFilesHub,
    type FilesPromptState
} from "../shared/neutralino/index.ts";
import {
    putFilesBlob,
    putFilesBlobFromFile,
    buildFilesBlobUrl,
    getFilesBlobOpen,
    detectLanIpv4
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
 * Open a landed file (or reveal it in Explorer / file manager).
 * WHY: files-ready toast parity with Cap "Open File" / "Open in Folder".
 * Windows: `cmd start` for open; `explorer /select,` for reveal.
 */
function openLandedPath(targetPath: string, reveal: boolean): void {
    const abs = path.resolve(String(targetPath || "").trim());
    if (!abs || !fs.existsSync(abs)) {
        throw new Error(`CWSP_FILES_OPEN_MISSING:${abs || "?"}`);
    }
    const st = fs.statSync(abs);
    if (process.platform === "win32") {
        if (reveal && st.isFile()) {
            // WHY: /select opens the parent folder with the file highlighted.
            // explorer.exe often exits non-zero even on success — ignore status.
            execFile("explorer.exe", [`/select,${abs}`], () => undefined);
            return;
        }
        if (st.isDirectory()) {
            execFile("explorer.exe", [abs], () => undefined);
            return;
        }
        execFile("cmd.exe", ["/c", "start", "", abs], { windowsHide: true }, () => undefined);
        return;
    }
    // Linux Neutralino parity (best-effort).
    const openTarget = reveal && st.isFile() ? path.dirname(abs) : abs;
    execFile("xdg-open", [openTarget], () => undefined);
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
                    await clipboard.writeImageBase64(imageData, {
                        fileName:
                            body.asset && typeof body.asset === "object"
                                ? String((body.asset as { name?: unknown }).name || "").trim() ||
                                  undefined
                                : undefined
                    });
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
        _action:
            | "share"
            | "dismiss"
            | "erase"
            | "accept"
            | "undo"
            | "take"
            | "open-file"
            | "open-folder"
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
                  const { getFilesBlobOpen } = await import("../shared/neutralino/files-blob-store.ts");
                  const meta = getFilesBlobOpen(transferId, batchId, token);
                  if (!meta) return null;
                  // WHY: return filePath so control.ts can stream GB blobs.
                  return {
                      filePath: meta.filePath,
                      size: meta.size,
                      mimeType: meta.mimeType,
                      name: meta.name,
                  };
              }
          });

    // Independent native toast (WinForms PS1 on Windows — NOT a second Neutralino).
    // WHY: crash-loop give-up must clear clipboard holds, but must NOT decline a
    // pending files Accept (toast auth/port flaps would silently drop Cap→desk).
    let filesPromptExpiresAt = 0;
    const promptHost = createClipboardPromptHost({
        packageRoot,
        // WHY: control may fall back (Cursor on 18765) — always use the bound port.
        getAuth: () => ({ port: runtime.auth.port, key: runtime.auth.key }),
        // WHY: after standby, Waiting toast can exit before paint; host crash-loop
        // give-up must clear hub hold or ensureRunning never stops wanting a toast.
        onGiveUp: () => {
            try {
                const fp = filesHubRef?.getFilesPromptState?.() ?? null;
                if (fp && fp.kind === "accept") {
                    console.warn(JSON.stringify({
                        channel: "cwsp-files-hub",
                        event: "files-prompt-toast-gave-up",
                        localId,
                        transferId: fp.transferId,
                        note: "Keep files offer; toast crash-loop must not auto-decline"
                    }));
                    return;
                }
            } catch {
                /* */
            }
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
                  writeImageBase64: (data, opts) => clipboard.writeImageBase64(data, opts),
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
                  // WHY: clipboard-hub diverts on `what || type`, but Cap/gateway
                  // often leaves `what` empty and only sets `type: "files:offer"`.
                  // Reading only `packet.what` dropped every Cap→desk offer
                  // (inbound-files-other what:"") — Accept toast never appeared.
                  const payloadRec =
                      packet.payload && typeof packet.payload === "object"
                          ? (packet.payload as Record<string, unknown>)
                          : null;
                  let what = String(
                      packet.what || packet.type || packet.action || ""
                  ).trim();
                  if (!what.startsWith("files:") && payloadRec) {
                      const nested = String(
                          payloadRec.what || payloadRec.op || payloadRec.action || ""
                      ).trim();
                      if (nested.startsWith("files:")) what = nested;
                      else if (
                          payloadRec.transferId &&
                          Array.isArray(payloadRec.batches)
                      ) {
                          what = "files:offer";
                      }
                  }
                  if (what === "files:error") {
                      console.warn(JSON.stringify({
                          channel: "cwsp-files-hub",
                          event: "inbound-files-error",
                          localId,
                          transferId: (payloadRec?.transferId as string | undefined) ?? null,
                          reason: (payloadRec?.reason as string | undefined) ?? null
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
                          transferId: (payloadRec?.transferId as string | undefined) ?? null,
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
                          what,
                          type: packet.type ?? null,
                          keys: Object.keys(packet).slice(0, 16),
                          hasBatches: Array.isArray(payloadRec?.batches),
                          transferId: payloadRec?.transferId ?? null
                      }));
                      return;
                  }
                  // COMPAT: ensure handleIncomingOffer sees canonical `what`.
                  const offerPacket = {
                      ...packet,
                      what: "files:offer"
                  };
                  void filesHubRef.handleIncomingOffer(offerPacket as Parameters<
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
        // WHY: control RPC delegates /service/clipboard-prompt to the live hub.
        // Cap→desk files Ask Accept is merged here so the same WinForms/Neutralino
        // toast Accept/Decline buttons drive filesHub.acceptIncomingOffer.
        const formatFilesBytes = (n: number): string => {
            if (!Number.isFinite(n) || n <= 0) return "0 B";
            const units = ["B", "KB", "MB", "GB"];
            let v = n;
            let i = 0;
            while (v >= 1024 && i < units.length - 1) {
                v /= 1024;
                i++;
            }
            return `${v < 10 && i > 0 ? v.toFixed(1) : Math.round(v)} ${units[i]}`;
        };
        hubPromptGet = () => {
            const fp = filesHubRef?.getFilesPromptState?.() ?? null;
            if (fp && fp.kind === "accept") {
                const preview =
                    `${fp.fileCount} file(s) from ${fp.sender || "peer"}` +
                    ` (${formatFilesBytes(fp.totalBytes)}) — Accept to download`;
                // WHY: stable expiresAt across polls — toast Get-ToastRemainingMs
                // prefers state.expiresAt; refreshing now+60s every GET froze the
                // countdown and confused fingerprint/deadline alignment.
                if (!filesPromptExpiresAt || filesPromptExpiresAt < Date.now()) {
                    filesPromptExpiresAt = Date.now() + 120_000;
                }
                return {
                    id: fp.transferId,
                    kind: "inbound",
                    mode: "ask",
                    textPreview: preview,
                    text: preview,
                    textLength: preview.length,
                    hasImage: false,
                    assetHash: "",
                    assetMimeType: "",
                    assetSize: 0,
                    showErase: false,
                    showUndo: false,
                    expiresAt: filesPromptExpiresAt,
                    dismissMs: 120_000,
                    imageThumbDataUrl: "",
                    imageThumbPath: "",
                    sender: String(fp.sender || ""),
                    targets: [],
                    domain: "files",
                    transferId: fp.transferId
                };
            }
            if (fp && fp.kind === "ready") {
                const names = (fp.paths || [])
                    .map((p) => {
                        try {
                            return path.basename(p);
                        } catch {
                            return "";
                        }
                    })
                    .filter(Boolean)
                    .slice(0, 3);
                const nameHint = names.length
                    ? names.join(", ") + (fp.fileCount > names.length ? "…" : "")
                    : `${fp.fileCount} file(s)`;
                const preview = fp.copied
                    ? `Ready: ${nameHint} — Open File / Open in Folder`
                    : `Ready: ${nameHint} — Open / Copy / Folder`;
                if (!filesPromptExpiresAt || filesPromptExpiresAt < Date.now()) {
                    filesPromptExpiresAt = Date.now() + 90_000;
                }
                return {
                    id: `ready:${fp.transferId}`,
                    kind: "inbound",
                    // WHY: mode=ask + domain=files-ready → toast shows Copy;
                    // mode=notify → already auto-copied (Copy hidden).
                    mode: fp.copied ? "notify" : "ask",
                    textPreview: preview,
                    text: preview,
                    textLength: preview.length,
                    hasImage: false,
                    assetHash: "",
                    assetMimeType: "",
                    assetSize: 0,
                    showErase: false,
                    showUndo: false,
                    expiresAt: filesPromptExpiresAt,
                    dismissMs: 90_000,
                    imageThumbDataUrl: "",
                    imageThumbPath: "",
                    sender: String(fp.sender || ""),
                    targets: [],
                    domain: "files-ready",
                    transferId: fp.transferId,
                    copied: Boolean(fp.copied),
                    landingDir: String(fp.landingDir || ""),
                    paths: Array.isArray(fp.paths) ? fp.paths.slice(0, 16) : []
                };
            }
            filesPromptExpiresAt = 0;
            return clipboardHub.getPromptState() as unknown as Record<string, unknown> | null;
        };
        hubPromptAction = async (action) => {
            const fp = filesHubRef?.getFilesPromptState?.() ?? null;
            if (fp && fp.kind === "ready") {
                if (action === "open-file" || action === "open-folder") {
                    try {
                        const paths = Array.isArray(fp.paths) ? fp.paths.filter(Boolean) : [];
                        const primary = paths[0] || "";
                        const landing = String(fp.landingDir || "").trim();
                        const target =
                            action === "open-folder"
                                ? primary || landing
                                : primary || landing;
                        if (!target) {
                            throw new Error("CWSP_FILES_OPEN_NO_PATH");
                        }
                        // WHY: reveal selects the file when we have one; else open dir.
                        const reveal =
                            action === "open-folder" &&
                            Boolean(primary && fs.existsSync(primary));
                        openLandedPath(
                            action === "open-folder" && !primary && landing
                                ? landing
                                : target,
                            reveal
                        );
                        console.log(JSON.stringify({
                            channel: "cwsp-files-hub",
                            event: action === "open-file" ? "ready-open-file" : "ready-open-folder",
                            localId,
                            transferId: fp.transferId,
                            target,
                            reveal
                        }));
                        // Keep toast open — user may still Copy / Dismiss.
                        return { applied: true, text: "", hasImage: false };
                    } catch (error) {
                        console.warn(JSON.stringify({
                            channel: "cwsp-files-hub",
                            event: "ready-open-failed",
                            localId,
                            transferId: fp.transferId,
                            action,
                            error: error instanceof Error ? error.message : String(error)
                        }));
                        return { applied: false, text: "", hasImage: false };
                    }
                }
                if (action === "accept" || action === "take") {
                    try {
                        const paths = Array.isArray(fp.paths) ? fp.paths.filter(Boolean) : [];
                        if (paths.length) {
                            await clipboard.writeFileDropList(paths);
                            try {
                                clipboardHub.noteLocalFileDropSeen(paths);
                            } catch {
                                /* */
                            }
                        }
                        filesHubRef?.markReadyCopied?.(fp.transferId);
                        console.log(JSON.stringify({
                            channel: "cwsp-files-hub",
                            event: "ready-copy",
                            localId,
                            transferId: fp.transferId,
                            count: paths.length
                        }));
                    } catch (error) {
                        console.warn(JSON.stringify({
                            channel: "cwsp-files-hub",
                            event: "ready-copy-failed",
                            localId,
                            transferId: fp.transferId,
                            error: error instanceof Error ? error.message : String(error)
                        }));
                    }
                    return { applied: true, text: "", hasImage: false };
                }
                if (action === "dismiss") {
                    try {
                        filesHubRef?.clearFilesPrompt?.();
                    } catch {
                        /* */
                    }
                    try {
                        promptHost.release();
                    } catch {
                        /* */
                    }
                    return true;
                }
                return false;
            }
            if (fp && fp.kind === "accept" && filesHubRef) {
                if (action === "accept" || action === "take") {
                    try {
                        await filesHubRef.acceptIncomingOffer(fp.transferId);
                        // WHY: keep toast alive — ready prompt replaces Accept.
                        return { applied: true, text: "", hasImage: false };
                    } catch (error) {
                        console.error(JSON.stringify({
                            channel: "cwsp-files-hub",
                            event: "prompt-accept-failed",
                            localId,
                            transferId: fp.transferId,
                            error: error instanceof Error ? error.message : String(error)
                        }));
                        return { applied: false, text: "", hasImage: false };
                    }
                }
                if (action === "dismiss") {
                    try {
                        await filesHubRef.declineIncomingOffer(fp.transferId);
                    } catch {
                        /* */
                    }
                    try {
                        promptHost.release();
                    } catch {
                        /* */
                    }
                    return true;
                }
                return false;
            }
            return action === "take"
                ? clipboardHub.takeInboundAskForPaste()
                : clipboardHub.resolvePrompt(action);
        };
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
                const { putFilesBlob, putFilesBlobFromFile } = await import(
                    "../shared/neutralino/files-blob-store.ts"
                );
                const meta = input.filePath
                    ? await putFilesBlobFromFile({
                        rootDir: stageRoot,
                        transferId: input.transferId,
                        batchId: input.batchId,
                        sourcePath: input.filePath,
                        hash: input.hash,
                        name: input.name,
                        mimeType: input.mimeType,
                        size: input.size,
                    })
                    : await putFilesBlob({
                        rootDir: stageRoot,
                        transferId: input.transferId,
                        batchId: input.batchId,
                        bytes: input.bytes ?? new Uint8Array(0),
                        hash: input.hash,
                        name: input.name,
                        mimeType: input.mimeType,
                    });
                const settingsSnap = (await runtime.settings.get()) as Record<string, unknown>;
                const shell =
                    settingsSnap.shell && typeof settingsSnap.shell === "object"
                        ? (settingsSnap.shell as Record<string, unknown>)
                        : {};
                // WHY: Cap HTTP-pulls this URL. Prefer explicit base; else map
                // localId L-110 → 192.168.0.110 (NSC cleartext allowlist), then
                // detect LAN IPv4 + bound control port.
                const explicit = String(
                    shell.filesBlobBaseUrl || shell.controlPublicUrl || ""
                ).trim();
                const fromPeer = lanHostFromPeerId(localId);
                const lan = fromPeer
                    || detectLanIpv4("192.168.0.")
                    || String(shell.lanHost || shell.localLanHost || "").trim()
                    || "192.168.0.110";
                const port = runtime.auth.port || controlPort;
                const baseUrl = explicit || `http://${lan}:${port}`;
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
                    size: meta.size,
                    streamed: Boolean(input.filePath),
                    url,
                    listenHint: "0.0.0.0 (Cap must reach this LAN URL)"
                }));
                return { url };
            },
            getBlob: async (url) => {
                // WHY: support both remote HTTP and local blob URLs (loopback/LAN).
                // INVARIANT: never readFile multi-GB into RAM — accept path uses
                // streamBlobUrlToFile; this adapter is for mid-size only.
                try {
                    const u = new URL(url);
                    const m = u.pathname.match(/\/service\/files-blob\/([^/]+)\/([^/]+)/);
                    if (m) {
                        const transferId = decodeURIComponent(m[1] || "");
                        const batchId = decodeURIComponent(m[2] || "");
                        const token = u.searchParams.get("token") || "";
                        const { getFilesBlobBytes } = await import(
                            "../shared/neutralino/files-blob-store.ts"
                        );
                        const hit = await getFilesBlobBytes(transferId, batchId, token);
                        if (hit) return new Uint8Array(hit.bytes);
                        // Large local blob: force streamBlobUrlToFile / HTTP stream.
                        throw new Error("CWSP_FILES_BLOB_TOO_LARGE_FOR_HEAP");
                    }
                } catch (err) {
                    if (
                        err instanceof Error &&
                        err.message === "CWSP_FILES_BLOB_TOO_LARGE_FOR_HEAP"
                    ) {
                        throw err;
                    }
                    /* fall through to fetch */
                }
                const res = await fetch(url);
                if (!res.ok) throw new Error(`CWSP_FILES_HTTP_${res.status}`);
                const len = Number(res.headers.get("content-length") || 0);
                if (len > 64 * 1024 * 1024) {
                    throw new Error("CWSP_FILES_BLOB_TOO_LARGE_FOR_HEAP");
                }
                return new Uint8Array(await res.arrayBuffer());
            },
            onAcceptedLanding: async (info) => {
                // WHY: after Cap→desk Accept, optionally CF_HDROP-copy for Paste.
                // Default ON (filesCopyOnReceive !== false). Return { copied }
                // so the hub can publish a ready toast (notify vs Copy button).
                try {
                    const snap = (await runtime.settings.get()) as Record<string, unknown>;
                    const sh =
                        snap.shell && typeof snap.shell === "object"
                            ? (snap.shell as Record<string, unknown>)
                            : {};
                    if (sh.filesCopyOnReceive === false) {
                        console.log(JSON.stringify({
                            channel: "cwsp-files-hub",
                            event: "copy-on-receive-skipped",
                            localId,
                            transferId: info.transferId,
                            reason: "filesCopyOnReceive=false"
                        }));
                        return { copied: false };
                    }
                    if (!info.paths.length) return { copied: false };
                    const n = await clipboard.writeFileDropList(info.paths);
                    try {
                        clipboardHub.noteLocalFileDropSeen(info.paths);
                    } catch {
                        /* */
                    }
                    console.log(JSON.stringify({
                        channel: "cwsp-files-hub",
                        event: "copy-on-receive",
                        localId,
                        transferId: info.transferId,
                        count: n,
                        landingDir: info.landingDir
                    }));
                    return { copied: true };
                } catch (error) {
                    console.warn(JSON.stringify({
                        channel: "cwsp-files-hub",
                        event: "copy-on-receive-failed",
                        localId,
                        transferId: info.transferId,
                        error: error instanceof Error ? error.message : String(error)
                    }));
                    return { copied: false };
                }
            },
            onFilesPromptUpdate: (state: FilesPromptState | null) => {
                // WHY: Cap→desk Ask Accept must surface the same clipboard-prompt
                // toast (Accept/Decline). Balloon alone had no Accept action.
                const kind = state?.kind ?? null;
                if (kind === "accept" || kind === "ready") {
                    filesPromptExpiresAt = Date.now() + (kind === "ready" ? 90_000 : 120_000);
                    const bumpToast = () => {
                        try {
                            promptHost.ensureRunning();
                        } catch {
                            /* */
                        }
                    };
                    bumpToast();
                    if (kind === "accept") {
                        setTimeout(bumpToast, 1_500);
                        setTimeout(bumpToast, 4_000);
                    }
                    console.log(JSON.stringify({
                        channel: "cwsp-files-hub",
                        event: "files-prompt-update",
                        kind,
                        localId,
                        transferId: state?.transferId ?? null,
                        sender: state?.sender ?? null,
                        fileCount: state?.fileCount ?? 0,
                        totalBytes: state?.totalBytes ?? 0,
                        copied: state?.copied ?? null,
                        controlPort: runtime.auth.port,
                        note:
                            kind === "ready"
                                ? state?.copied
                                    ? "Files ready — notify (already copied)"
                                    : "Files ready — Copy via toast"
                                : "Inbound files:offer — Accept via clipboard-prompt toast (Incoming files)"
                    }));
                    return;
                }
                if (kind === "open-for-share") {
                    console.log(JSON.stringify({
                        channel: "cwsp-files-hub",
                        event: "files-prompt-update",
                        kind,
                        localId,
                        transferId: state?.transferId ?? null,
                        fileCount: state?.fileCount ?? 0,
                        totalBytes: state?.totalBytes ?? 0,
                        note: "Open-for-Share staged — offering to peers"
                    }));
                    return;
                }
                if (kind == null) {
                    filesPromptExpiresAt = 0;
                    try {
                        // WHY: only release when no clipboard hold is active.
                        if (!clipboardHub.getPromptState()) promptHost.release();
                    } catch {
                        /* */
                    }
                }
                console.log(JSON.stringify({
                    channel: "cwsp-files-hub",
                    event: "files-prompt-update",
                    localId,
                    kind,
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

/** Map peer id to LAN IPv4 for Cap cleartext blob URLs (NSC allowlist). */
function lanHostFromPeerId(peerId: string | undefined): string | null {
    const id = String(peerId || "").trim();
    if (!id) return null;
    const full = /^L-(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})$/i.exec(id);
    if (full) return full[1];
    // Fleet short form: L-110 → 192.168.0.110 (home LAN convention).
    const short = /^L-(\d{1,3})$/i.exec(id);
    if (short) return `192.168.0.${short[1]}`;
    return null;
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
