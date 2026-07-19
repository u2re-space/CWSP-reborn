/*
 * Filename: connection-source.ts
 * FullPath: apps/CWSP-reborn/src/frontend/web/cwsp-control/web/connection-source.ts
 * Change date and time: 21.50.00_19.07.2026
 * Reason for changes: Default remote CWSP mode — avoid PNA/loopback spam from public /cwsp.
 */

export const CONNECTION_STORAGE_KEY = "cwsp-control-bridge-v7";
export const OPEN_CONNECTION_EVENT = "cwsp:open-connection-source";

/**
 * bridge = Neutralino Node `/service/config` (shared SoT with desk WebView).
 * remote = browser-only SRC/IDB (no localhost) — opt-out when desk app unavailable.
 */
export type ConnectionMode = "remote" | "bridge";

export type ConnectionSource = {
    mode: ConnectionMode;
    /** Neutralino / Node control RPC (PNA). */
    scheme: "http" | "https";
    host: string;
    port: number;
    apiKey: string;
    /** CWSP endpoint mirrored from/to portable.core via Neutralino. */
    endpointUrl: string;
    userId: string;
    userKey: string;
};

const LOOPBACK = new Set(["127.0.0.1", "localhost", "::1"]);

/** INVARIANT: CWSP hub default is loopback :8434 — not the public Fastify :443 page origin. */
const defaultEndpointUrl = (): string => "https://127.0.0.1:8434/";

const DEFAULTS = (): ConnectionSource => ({
    // WHY: /cwsp and Neutralino WebView share portable settings via localhost Node API.
    mode: "bridge",
    scheme: "http",
    host: "127.0.0.1",
    port: 29110,
    apiKey: "cwsp-neutralino-local",
    endpointUrl: defaultEndpointUrl(),
    userId: "",
    userKey: ""
});

const isLoopbackEndpoint = (endpointUrl: string): boolean =>
    /^(https?:\/\/)?(127\.0\.0\.1|localhost)(:\d+)?\/?$/i.test(String(endpointUrl || "").trim());

const migrateLegacy = (parsed: Record<string, unknown>): Partial<ConnectionSource> => {
    // COMPAT: missing mode → bridge (shared Neutralino SoT). Explicit remote is preserved.
    let mode: ConnectionMode =
        parsed.mode === "remote" ? "remote" : parsed.mode === "bridge" ? "bridge" : "bridge";
    // v5 factory remote + loopback endpoint → promote to bridge for shared settings.
    if (
        mode === "remote" &&
        !String(parsed.userId || "").trim() &&
        !String(parsed.userKey || "").trim() &&
        isLoopbackEndpoint(String(parsed.endpointUrl || ""))
    ) {
        mode = "bridge";
    }
    // INVARIANT: never rewrite a user/Neutralino gateway (e.g. https://45.147.121.152:8434/)
    // back to loopback — that host is a valid Relay / gateway target for the desk backend.
    const endpointUrl = String(parsed.endpointUrl || "").trim();
    return { ...parsed, mode, endpointUrl: endpointUrl || undefined };
};

export const loadConnectionSource = (): ConnectionSource => {
    const base = DEFAULTS();
    try {
        const raw =
            localStorage.getItem(CONNECTION_STORAGE_KEY) ||
            localStorage.getItem("cwsp-control-bridge-v6") ||
            localStorage.getItem("cwsp-control-bridge-v5") ||
            localStorage.getItem("cwsp-control-bridge-v4") ||
            localStorage.getItem("cwsp-control-bridge-v3");
        if (!raw) return base;
        const parsed = migrateLegacy(JSON.parse(raw) as Record<string, unknown>);
        const storedEp = String(parsed.endpointUrl || "").trim();
        return {
            mode: parsed.mode === "remote" ? "remote" : "bridge",
            scheme: parsed.scheme === "https" ? "https" : "http",
            host: String(parsed.host || base.host).trim() || base.host,
            port: Number(parsed.port) || base.port,
            apiKey: String(parsed.apiKey ?? base.apiKey),
            // Keep any stored gateway (WAN or LAN); only fall back to loopback when unset.
            endpointUrl: storedEp || base.endpointUrl,
            userId: String(parsed.userId || ""),
            userKey: String(parsed.userKey || "")
        };
    } catch {
        return base;
    }
};

export const saveConnectionSource = (source: ConnectionSource): void => {
    localStorage.setItem(CONNECTION_STORAGE_KEY, JSON.stringify(source));
};

export const bridgeBaseUrl = (source: ConnectionSource): string => {
    const host = source.host.includes(":") && !source.host.startsWith("[") ? `[${source.host}]` : source.host;
    return `${source.scheme}://${host}:${source.port}`;
};

export const endpointNeedsLogin = (endpointUrl: string): boolean => {
    try {
        const withScheme = /^https?:\/\//i.test(endpointUrl) ? endpointUrl : `https://${endpointUrl}`;
        const host = new URL(withScheme).hostname.toLowerCase();
        return !LOOPBACK.has(host);
    } catch {
        return true;
    }
};

export const clearDesktopBridgeGlobals = (): void => {
    const g = globalThis as unknown as {
        __WEBNATIVE_AUTH__?: { port: number; key: string };
        __NEUTRALINO_AUTH__?: { port: number; key: string };
        __CWS_WEBNATIVE_BOOT__?: boolean;
        __CWS_NEUTRALINO_BOOT__?: boolean;
        __CWS_NODE_CLIPBOARD_HUB__?: boolean;
        __CWSP_CONTROL_MODE__?: ConnectionMode;
        __CWSP_CONTROL_SOURCE__?: ConnectionSource;
        __CWSP_CONTROL_BRIDGE_LIVE__?: boolean;
    };
    delete g.__WEBNATIVE_AUTH__;
    delete g.__NEUTRALINO_AUTH__;
    g.__CWS_WEBNATIVE_BOOT__ = false;
    g.__CWS_NEUTRALINO_BOOT__ = false;
    g.__CWS_NODE_CLIPBOARD_HUB__ = false;
    g.__CWSP_CONTROL_BRIDGE_LIVE__ = false;
};

/** Apply globals for the active mode. Bridge flags only when mode=bridge and live. */
export const applyConnectionGlobals = (
    source: ConnectionSource,
    options?: { bridgeLive?: boolean }
): void => {
    const g = globalThis as unknown as {
        __WEBNATIVE_AUTH__?: { port: number; key: string };
        __NEUTRALINO_AUTH__?: { port: number; key: string };
        __CWS_WEBNATIVE_BOOT__?: boolean;
        __CWS_NEUTRALINO_BOOT__?: boolean;
        __CWS_NODE_CLIPBOARD_HUB__?: boolean;
        __CWSP_CONTROL_MODE__?: ConnectionMode;
        __CWSP_CONTROL_SOURCE__?: ConnectionSource;
        __CWSP_CONTROL_BRIDGE_LIVE__?: boolean;
    };
    g.__CWSP_CONTROL_SOURCE__ = source;
    g.__CWSP_CONTROL_MODE__ = source.mode;

    if (source.mode !== "bridge" || !options?.bridgeLive) {
        clearDesktopBridgeGlobals();
        g.__CWSP_CONTROL_SOURCE__ = source;
        g.__CWSP_CONTROL_MODE__ = source.mode;
        return;
    }

    g.__WEBNATIVE_AUTH__ = { port: source.port, key: source.apiKey };
    g.__NEUTRALINO_AUTH__ = { port: source.port, key: source.apiKey };
    g.__CWS_WEBNATIVE_BOOT__ = true;
    g.__CWS_NEUTRALINO_BOOT__ = true;
    g.__CWS_NODE_CLIPBOARD_HUB__ = true;
    g.__CWSP_CONTROL_BRIDGE_LIVE__ = true;
};

/** @deprecated use applyConnectionGlobals */
export const applyBridgeAuthGlobals = (source: ConnectionSource): void => {
    applyConnectionGlobals(source, { bridgeLive: source.mode === "bridge" });
};

export const bridgeFetch = async (
    source: ConnectionSource,
    path: string,
    init?: RequestInit
): Promise<Response> => {
    const url = new URL(path, `${bridgeBaseUrl(source)}/`).toString();
    const headers = new Headers(init?.headers || {});
    headers.set("Accept", "application/json");
    if (source.apiKey) headers.set("X-API-Key", source.apiKey);
    if (init?.body && !headers.has("Content-Type")) {
        headers.set("Content-Type", "application/json");
    }
    return fetch(url, {
        ...init,
        headers,
        mode: "cors",
        credentials: "omit",
        cache: "no-store"
    });
};

export const probeBridgeLive = async (source: ConnectionSource): Promise<boolean> => {
    if (source.mode !== "bridge") return false;
    try {
        const ctrl =
            typeof AbortSignal !== "undefined" && typeof AbortSignal.timeout === "function"
                ? AbortSignal.timeout(1500)
                : undefined;
        const res = await bridgeFetch(source, "/service/config", { signal: ctrl });
        return res.ok || res.status === 401;
    } catch {
        return false;
    }
};

/** Persist CWSP target credentials into Neutralino portable.core. */
export const patchCwspTargetViaBridge = async (source: ConnectionSource): Promise<void> => {
    const patch = {
        core: {
            endpointUrl: source.endpointUrl,
            userId: source.userId,
            userKey: source.userKey
        }
    };
    const res = await bridgeFetch(source, "/service/config", {
        method: "POST",
        body: JSON.stringify(patch)
    });
    if (!res.ok) {
        throw new Error(`Bridge POST /service/config failed (HTTP ${res.status})`);
    }
};

export const sourceToAppSettingsCore = (source: ConnectionSource): Record<string, unknown> => ({
    endpointUrl: source.endpointUrl,
    userId: source.userId,
    userKey: source.userKey,
    ecosystemToken: source.userKey,
    // WHY: keep true so settings-contributions merges the SRC arm over empty IDB defaults.
    preferBackendSync: true,
    socket: source.userKey ? { accessToken: source.userKey } : {}
});

const DIALOG_STYLE = `
.cwsp-src-backdrop{position:fixed;inset:0;background:rgba(0,0,0,.55);display:grid;place-items:center;z-index:99999;padding:1rem;font-family:system-ui,sans-serif}
.cwsp-src-panel{width:min(28rem,100%);background:#1d212a;color:#eef1f5;border:1px solid #303542;border-radius:1rem;padding:1.25rem;box-sizing:border-box}
.cwsp-src-panel h2{margin:0 0 .35rem;font-size:1.15rem}
.cwsp-src-panel p{margin:0 0 .75rem;color:#aeb6c4;font-size:.88rem;line-height:1.4}
.cwsp-src-panel label{display:grid;gap:.3rem;margin-top:.65rem;font-size:.82rem;font-weight:600;color:#aeb6c4}
.cwsp-src-panel input,.cwsp-src-panel select{width:100%;box-sizing:border-box;border-radius:.5rem;padding:.65rem;border:1px solid #4b5362;background:#12141a;color:inherit;font:inherit}
.cwsp-src-row{display:grid;grid-template-columns:1fr 1fr 5.5rem;gap:.5rem}
.cwsp-src-actions{display:flex;flex-wrap:wrap;gap:.5rem;margin-top:1rem}
.cwsp-src-actions button{border:0;border-radius:999px;padding:.55rem 1rem;font:inherit;font-weight:700;cursor:pointer}
.cwsp-src-actions .primary{background:#3975ca;color:#fff}
.cwsp-src-actions .ghost{background:transparent;color:#eef1f5;border:1px solid #4b5362}
.cwsp-src-msg{min-height:1.2rem;margin:.5rem 0 0;font-size:.85rem;color:#ff9e9e}
.cwsp-src-bridge[hidden],.cwsp-src-auth[hidden]{display:none!important}
@media(max-width:560px){.cwsp-src-row{grid-template-columns:1fr}}
`;

let openDialog: HTMLElement | null = null;

export const openConnectionSourceDialog = (options?: {
    onSaved?: (source: ConnectionSource) => void | Promise<void>;
}): void => {
    if (openDialog) {
        openDialog.remove();
        openDialog = null;
    }

    const current = loadConnectionSource();
    const backdrop = document.createElement("div");
    backdrop.className = "cwsp-src-backdrop";
    backdrop.setAttribute("role", "dialog");
    backdrop.setAttribute("aria-modal", "true");
    backdrop.innerHTML = `
      <style>${DIALOG_STYLE}</style>
      <form class="cwsp-src-panel" id="cwsp-src-form">
        <h2>Connection source</h2>
        <p><b>Bridge</b> (default) — same settings as Neutralino WebView via Node <code>/service/config</code> on localhost (PNA). <b>Remote</b> — browser-only, no desk sync.</p>
        <label>Mode
          <select name="mode">
            <option value="bridge"${current.mode !== "remote" ? " selected" : ""}>Neutralino bridge (shared SoT)</option>
            <option value="remote"${current.mode === "remote" ? " selected" : ""}>Remote only (no localhost)</option>
          </select>
        </label>
        <div class="cwsp-src-bridge" data-bridge ${current.mode === "bridge" ? "" : "hidden"}>
          <div class="cwsp-src-row">
            <label>Scheme
              <select name="scheme">
                <option value="http"${current.scheme === "http" ? " selected" : ""}>http</option>
                <option value="https"${current.scheme === "https" ? " selected" : ""}>https</option>
              </select>
            </label>
            <label>Bridge host
              <input name="host" value="${current.host}" spellcheck="false" autocomplete="off" />
            </label>
            <label>Port
              <input name="port" type="number" min="1" max="65535" value="${current.port}" />
            </label>
          </div>
          <label>API key (X-API-Key)
            <input name="apiKey" type="password" value="${current.apiKey}" autocomplete="off" spellcheck="false" />
          </label>
        </div>
        <label>CWSP endpoint URL
          <input name="endpointUrl" type="url" value="${current.endpointUrl}" spellcheck="false" />
        </label>
        <div class="cwsp-src-auth" data-auth ${endpointNeedsLogin(current.endpointUrl) ? "" : "hidden"}>
          <label>User ID
            <input name="userId" value="${current.userId}" autocomplete="username" spellcheck="false" />
          </label>
          <label>Password / PIN / user key
            <input name="userKey" type="password" value="${current.userKey}" autocomplete="current-password" />
          </label>
        </div>
        <p class="cwsp-src-msg" data-msg role="status"></p>
        <div class="cwsp-src-actions">
          <button type="submit" class="primary">Save &amp; connect</button>
          <button type="button" class="ghost" data-probe>Probe</button>
          <button type="button" class="ghost" data-close>Close</button>
        </div>
      </form>
    `;

    const form = backdrop.querySelector("form") as HTMLFormElement;
    const msg = backdrop.querySelector("[data-msg]") as HTMLElement;
    const authBox = backdrop.querySelector("[data-auth]") as HTMLElement;
    const bridgeBox = backdrop.querySelector("[data-bridge]") as HTMLElement;
    const modeSelect = form.elements.namedItem("mode") as HTMLSelectElement;
    const endpointInput = form.elements.namedItem("endpointUrl") as HTMLInputElement;

    const readForm = (): ConnectionSource => ({
        mode: modeSelect.value === "bridge" ? "bridge" : "remote",
        scheme: (form.elements.namedItem("scheme") as HTMLSelectElement).value === "https" ? "https" : "http",
        host: String((form.elements.namedItem("host") as HTMLInputElement).value || "").trim() || "127.0.0.1",
        port: Number((form.elements.namedItem("port") as HTMLInputElement).value) || 29110,
        apiKey: String((form.elements.namedItem("apiKey") as HTMLInputElement).value || ""),
        endpointUrl:
            String((form.elements.namedItem("endpointUrl") as HTMLInputElement).value || "").trim() ||
            defaultEndpointUrl(),
        userId: String((form.elements.namedItem("userId") as HTMLInputElement).value || "").trim(),
        userKey: String((form.elements.namedItem("userKey") as HTMLInputElement).value || "")
    });

    const syncVisibility = () => {
        bridgeBox.hidden = modeSelect.value !== "bridge";
        authBox.hidden = !endpointNeedsLogin(endpointInput.value);
    };
    modeSelect.addEventListener("change", syncVisibility);
    endpointInput.addEventListener("input", syncVisibility);

    backdrop.querySelector("[data-close]")?.addEventListener("click", () => {
        backdrop.remove();
        openDialog = null;
    });

    backdrop.querySelector("[data-probe]")?.addEventListener("click", async () => {
        const source = readForm();
        msg.textContent = "Probing…";
        try {
            if (source.mode === "bridge") {
                const res = await bridgeFetch(source, "/service/config");
                msg.textContent =
                    res.status === 401
                        ? "Bridge reachable — check API key"
                        : res.ok
                          ? `Bridge OK ${bridgeBaseUrl(source)}`
                          : `Bridge HTTP ${res.status}`;
                msg.style.color = res.ok || res.status === 401 ? "#3ecf8e" : "#ff9e9e";
                return;
            }
            const base = source.endpointUrl.replace(/\/?$/, "/");
            const res = await fetch(new URL("lna-probe", base).toString(), {
                method: "GET",
                cache: "no-store",
                mode: "cors"
            });
            msg.textContent = res.ok ? `Endpoint reachable ${base}` : `Endpoint HTTP ${res.status}`;
            msg.style.color = res.ok ? "#3ecf8e" : "#ff9e9e";
        } catch (error) {
            msg.textContent = error instanceof Error ? error.message : "Probe failed";
            msg.style.color = "#ff9e9e";
        }
    });

    form.addEventListener("submit", async (ev) => {
        ev.preventDefault();
        const source = readForm();
        if (endpointNeedsLogin(source.endpointUrl) && (!source.userId || !source.userKey)) {
            msg.textContent = "Remote CWSP target needs user id and key/PIN.";
            msg.style.color = "#ff9e9e";
            authBox.hidden = false;
            return;
        }
        saveConnectionSource(source);
        msg.textContent = "Saving…";
        try {
            if (source.mode === "bridge") {
                const live = await probeBridgeLive(source);
                if (!live) {
                    throw new Error(
                        "Neutralino bridge unreachable (PNA/loopback). Start the desk app or use Remote mode."
                    );
                }
                applyConnectionGlobals(source, { bridgeLive: true });
                await patchCwspTargetViaBridge(source);
                msg.textContent = "Connected via Neutralino bridge.";
            } else {
                applyConnectionGlobals(source, { bridgeLive: false });
                msg.textContent = "Remote CWSP source saved (browser mode).";
            }
            msg.style.color = "#3ecf8e";
            await options?.onSaved?.(source);
            setTimeout(() => {
                backdrop.remove();
                openDialog = null;
            }, 400);
        } catch (error) {
            applyConnectionGlobals(source, { bridgeLive: false });
            msg.textContent = error instanceof Error ? error.message : "Save failed";
            msg.style.color = "#ff9e9e";
        }
    });

    document.body.appendChild(backdrop);
    openDialog = backdrop;
};

export const bindConnectionSourceOpener = (onSaved?: (source: ConnectionSource) => void | Promise<void>): void => {
    window.addEventListener(OPEN_CONNECTION_EVENT, () => {
        openConnectionSourceDialog({ onSaved });
    });
};
