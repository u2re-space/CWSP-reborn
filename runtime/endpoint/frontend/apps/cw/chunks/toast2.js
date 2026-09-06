//#region ../../modules/projects/subsystem/src/boot/toast.ts
var DEFAULT_CONFIG = {
	containerId: "rs-toast-layer",
	position: "bottom",
	maxToasts: 5,
	zIndex: 2147483647
};
var DEFAULT_DURATION = 3e3;
var TRANSITION_DURATION = 200;
/** Suppress the same toast repeating within this window (main thread + broadcast). */
var DEDUPE_WINDOW_MS = 400;
var lastToastFingerprint = "";
var lastToastFingerprintAt = 0;
var toastFingerprint = (opts) => `${opts.kind || "info"}\0${opts.position || DEFAULT_CONFIG.position}\0${opts.message}`;
var PCT_OCTET = /%[0-9A-Fa-f]{2}/;
var PCT_RUN = /(?:%[0-9A-Fa-f]{2})+/g;
var decodePctRun = (seq) => {
	try {
		return decodeURIComponent(seq);
	} catch {
		try {
			return decodeURI(seq);
		} catch {
			return seq;
		}
	}
};
/** MAP:modules/projects/lur.e/src/utils/text/decodeToastMessage.ts — keep inlined (zero deps). */
var decodeToastMessage = (raw) => {
	let text = String(raw ?? "");
	if (!text || !PCT_OCTET.test(text)) return text;
	for (let i = 0; i < 3; i++) {
		let next;
		try {
			next = decodeURIComponent(text);
		} catch {
			try {
				next = decodeURI(text);
			} catch {
				next = text.replace(PCT_RUN, decodePctRun);
			}
		}
		if (next === text) break;
		text = next;
		if (!PCT_OCTET.test(text)) break;
	}
	return text;
};
var hasVisibleDuplicate = (layer, message, kind) => {
	for (const el of Array.from(layer?.children ?? [])) if (el instanceof HTMLElement && el.classList.contains("rs-toast") && el.getAttribute("data-kind") === kind && el.textContent === message) return true;
	return false;
};
/**
* Self-contained toast CSS (Shadow DOM).
* INVARIANT: no `light-dark()`, no `@layer`, no host CSS variables for color —
* content scripts must look identical on every page.
*/
var TOAST_STYLES = `
:host {
    all: initial !important;
    position: fixed !important;
    inset: 0 !important;
    display: block !important;
    pointer-events: none !important;
    z-index: var(--shell-toast-z, 2147483647) !important;
    overflow: visible !important;
}

.rs-toast-layer {
    position: fixed;
    z-index: 1;
    pointer-events: none;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 16px 20px;
    gap: 8px;
    max-block-size: 80dvh;
    max-block-size: 80dvb;
    overflow: hidden;
    box-sizing: border-box;
    margin: 0;
    border: none;
    background: transparent;
}

.rs-toast-layer[data-position="bottom"],
.rs-toast-layer:not([data-position]) {
    inset-block-end: 24px;
    inset-block-start: auto;
    inset-inline: 0;
    justify-content: flex-end;
}

.rs-toast-layer[data-position="top"] {
    inset-block-start: 24px;
    inset-block-end: auto;
    inset-inline: 0;
    justify-content: flex-start;
}

.rs-toast-layer[data-position="top-left"] {
    inset-block-start: 24px;
    inset-inline-start: 16px;
    inset-inline-end: auto;
    align-items: flex-start;
}

.rs-toast-layer[data-position="top-right"] {
    inset-block-start: 24px;
    inset-inline-end: 16px;
    inset-inline-start: auto;
    align-items: flex-end;
}

.rs-toast-layer[data-position="bottom-left"] {
    inset-block-end: 24px;
    inset-inline-start: 16px;
    inset-inline-end: auto;
    align-items: flex-start;
}

.rs-toast-layer[data-position="bottom-right"] {
    inset-block-end: 24px;
    inset-inline-end: 16px;
    inset-inline-start: auto;
    align-items: flex-end;
}

.rs-toast {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 10px 14px;
    max-inline-size: min(90vw, 28rem);
    inline-size: fit-content;
    min-block-size: 2.25rem;
    box-sizing: border-box;

    border-radius: 10px;
    border: 1px solid rgba(248, 250, 252, 0.14);
    background-color: #0f172a;
    color: #f8fafc;
    box-shadow: 0 10px 28px rgba(2, 6, 23, 0.45);

    font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    font-size: 13px;
    font-weight: 500;
    letter-spacing: 0.01em;
    line-height: 1.4;
    white-space: pre-wrap;
    overflow-wrap: anywhere;
    word-break: break-word;
    text-align: center;

    pointer-events: auto;
    user-select: none;
    -webkit-user-select: none;
    cursor: default;

    opacity: 0;
    transform: translateY(12px) scale(0.96);
    transition:
        opacity 180ms ease-out,
        transform 180ms cubic-bezier(0.16, 1, 0.3, 1);
}

.rs-toast[data-visible] {
    opacity: 1;
    transform: translateY(0) scale(1);
}

.rs-toast:active {
    transform: scale(0.98);
}

.rs-toast[data-kind="info"] {
    background-color: #0f172a;
    color: #f8fafc;
    border-color: rgba(148, 163, 184, 0.35);
}

.rs-toast[data-kind="success"] {
    background-color: #166534;
    color: #f0fdf4;
    border-color: rgba(187, 247, 208, 0.35);
}

.rs-toast[data-kind="warning"] {
    background-color: #b45309;
    color: #fffbeb;
    border-color: rgba(253, 230, 138, 0.4);
}

.rs-toast[data-kind="error"] {
    background-color: #b91c1c;
    color: #fef2f2;
    border-color: rgba(254, 202, 202, 0.4);
}

@media (prefers-reduced-motion: reduce) {
    .rs-toast,
    .rs-toast[data-visible] {
        transition-duration: 0ms;
        transform: none;
    }
}

@media print {
    :host,
    .rs-toast-layer,
    .rs-toast {
        display: none !important;
    }
}
`;
var toastLayers = /* @__PURE__ */ new Map();
var toastHosts = /* @__PURE__ */ new Map();
/**
* Get or create an isolated toast mount (host + Shadow DOM layer).
*/
var getToastMount = (config, doc = document) => {
	const key = `${config.containerId}-${config.position}`;
	const cachedLayer = toastLayers.get(key);
	const cachedHost = toastHosts.get(key);
	if (cachedLayer?.isConnected && cachedHost?.isConnected) {
		cachedLayer.setAttribute("data-position", config.position);
		cachedHost.style.setProperty("--shell-toast-z", String(config.zIndex));
		return {
			host: cachedHost,
			layer: cachedLayer
		};
	}
	toastLayers.delete(key);
	toastHosts.delete(key);
	let host = doc.getElementById(config.containerId);
	if (!host) {
		host = doc.createElement("div");
		host.id = config.containerId;
		host.setAttribute("data-cwsp-toast-host", "");
		host.style.cssText = [
			"all: initial",
			"position: fixed",
			"inset: 0",
			"display: block",
			"pointer-events: none",
			`z-index: ${config.zIndex}`,
			"overflow: visible",
			"margin: 0",
			"padding: 0",
			"border: none",
			"background: transparent"
		].join(";");
		(doc.body || doc.documentElement).appendChild(host);
	}
	host.style.setProperty("--shell-toast-z", String(config.zIndex));
	let shadow = host.shadowRoot;
	if (!shadow) shadow = host.attachShadow({ mode: "open" });
	let styleEl = shadow.querySelector("style[data-rs-toast]");
	if (!styleEl) {
		styleEl = doc.createElement("style");
		styleEl.setAttribute("data-rs-toast", "");
		styleEl.textContent = TOAST_STYLES;
		shadow.insertBefore(styleEl, shadow.firstChild);
	} else styleEl.textContent = TOAST_STYLES;
	let layer = shadow.querySelector(".rs-toast-layer");
	if (!layer) {
		layer = doc.createElement("div");
		layer.className = "rs-toast-layer";
		layer.setAttribute("aria-live", "polite");
		layer.setAttribute("aria-atomic", "true");
		shadow.appendChild(layer);
	}
	layer.setAttribute("data-position", config.position);
	toastLayers.set(key, layer);
	toastHosts.set(key, host);
	return {
		host,
		layer
	};
};
/**
* Broadcast toast to all clients (for service worker context)
*/
var broadcastToast = (options) => {
	try {
		const channel = new BroadcastChannel("rs-toast");
		channel.postMessage({
			type: "show-toast",
			options
		});
		channel.close();
	} catch (e) {
		console.warn("[Toast] Broadcast failed:", e);
	}
};
/**
* Create and show a toast notification
*
* @param options - Toast options object or message string
* @returns The created toast element, or null if in service worker context
*/
var showToast = (options) => {
	const raw = typeof options === "string" ? { message: options } : options;
	const opts = {
		...raw,
		message: decodeToastMessage(raw.message)
	};
	const { message, kind = "info", duration = DEFAULT_DURATION, persistent = false, position = DEFAULT_CONFIG.position, onClick } = opts;
	if (!message) return null;
	const fp = toastFingerprint(opts);
	const now = Date.now();
	if (fp === lastToastFingerprint && now - lastToastFingerprintAt < DEDUPE_WINDOW_MS) return null;
	if (typeof document === "undefined") {
		lastToastFingerprint = fp;
		lastToastFingerprintAt = now;
		broadcastToast(opts);
		return null;
	}
	const config = {
		...DEFAULT_CONFIG,
		position
	};
	const { layer } = getToastMount(config);
	if (hasVisibleDuplicate(layer, message, kind)) {
		lastToastFingerprint = fp;
		lastToastFingerprintAt = now;
		return null;
	}
	lastToastFingerprint = fp;
	lastToastFingerprintAt = now;
	while (layer.children.length >= config.maxToasts) layer.firstChild?.remove();
	const toast = document.createElement("div");
	toast.className = "rs-toast";
	toast.setAttribute("data-kind", kind);
	toast.setAttribute("role", kind === "error" || kind === "warning" ? "alert" : "status");
	toast.setAttribute("aria-live", kind === "error" ? "assertive" : "polite");
	toast.textContent = message;
	layer.appendChild(toast);
	globalThis?.requestAnimationFrame?.(() => {
		toast.setAttribute("data-visible", "");
	});
	let hideTimer = null;
	const removeToast = () => {
		if (hideTimer !== null) {
			globalThis.clearTimeout(hideTimer);
			hideTimer = null;
		}
		toast.removeAttribute("data-visible");
		globalThis?.setTimeout?.(() => {
			toast.remove();
			if (!layer.childElementCount) {
				const key = `${config.containerId}-${config.position}`;
				toastLayers.delete(key);
			}
		}, TRANSITION_DURATION);
	};
	if (!persistent) hideTimer = globalThis?.setTimeout?.(removeToast, duration);
	toast.addEventListener("click", () => {
		onClick?.();
		removeToast();
	});
	toast.addEventListener("pointerdown", () => {
		if (hideTimer !== null) {
			globalThis.clearTimeout(hideTimer);
			hideTimer = null;
		}
		removeToast();
	}, { once: true });
	return toast;
};
//#endregion
export { showToast };
