import { r as __exportAll } from "./rolldown-runtime.js";
import { _ as stashSkuHandoff, c as isCwspNativeHost, f as publicHrefForSku, g as siblingSkuForView, h as shouldHandoffViewToSibling, m as readCwspSku, o as ensureCwspSkuFromLocation, r as androidPackageForSku, s as inferCwspSkuFromLocation, t as ECOSYSTEM_SKUS } from "./ecosystem-skus.js";
import { f as viewBroadcastChannelName, u as normalizeDestination } from "./Names.js";
import { d as sendProtocolMessage, i as enqueuePendingMessage } from "./UnifiedMessaging.js";
import { t as summarizeForLog } from "../vendor/@fest-lib_lure.js";
import { C as surfaceForSku, _ as resolveOpenPolicy, a as classifyOpenKindFromPayload, f as peekOpenPolicy, o as inferIngressChannels, u as normalizeOpenSink, x as skuForOpenSink, y as sinkToDestination } from "./open-policy.js";
import { c as peekProcessIngressSettings } from "./process-ingress.js";
import { a as holdIngressFiles, p as skuIngressHint } from "./sku-ingress.js";
//#region src/shared/routing/channel/ViewTransferRouting.ts
var ViewTransferRouting_exports = /* @__PURE__ */ __exportAll({
	classifyIngressFile: () => classifyIngressFile,
	classifyIngressFromBasename: () => classifyIngressFromBasename,
	dispatchViewTransfer: () => dispatchViewTransfer,
	resolveViewTransfer: () => resolveViewTransfer
});
/**
* Canonical classification for share-target / launch-queue files (extension often beats flaky MIME).
* Viewer-first routing treats `markdown` + `text`; other kinds stay on Work Center or sibling sinks.
*/
var classifyIngressFile = (file) => {
	const name = String(file?.name || "").toLowerCase();
	const mime = String(file?.type || "").toLowerCase();
	if (mime.startsWith("image/")) return "image";
	const mdTail = /\.(?:md|markdown|mdown|mkd|mkdn|mdtxt|mdtext)(?:$|[?#])/i;
	if (mime === "text/markdown" || mdTail.test(name)) return "markdown";
	if (mime.startsWith("text/")) return "text";
	if (mime === "application/json" || mime === "application/xml" || mime === "application/xhtml+xml" || mime === "application/javascript" || mime === "application/typescript" || mime === "application/x-typescript") return "text";
	if (/\.(?:txt|text|html|htm|css|scss|sass|less|json|csv|xml|yaml|yml|log|ini|env|toml|graphql|svg|tsx?|jsx?|mts|cts|cjs|mjs|vue|svelte|rst)(?:$|[?#])/i.test(name)) return mdTail.test(name) ? "markdown" : "text";
	if (!mime || mime === "application/octet-stream") {
		if (mdTail.test(name)) return "markdown";
	}
	if (/\.(?:png|jpe?g|gif|webp|bmp)(?:$|[?#])/i.test(name)) return "image";
	return "file";
};
/** Filename-only classification when blobs are still in Cache Storage (`fileCount` but `files=[]`). */
var classifyIngressFromBasename = (raw) => {
	const t = raw.trim().replace(/\\/g, "/");
	const cut = Math.max(t.lastIndexOf("/"), t.lastIndexOf("\\"));
	const nameOnly = ((cut >= 0 ? t.slice(cut + 1) : t) || "").trim();
	if (!nameOnly) return "file";
	try {
		return classifyIngressFile(new File([], nameOnly, { type: "application/octet-stream" }));
	} catch {
		return "file";
	}
};
var getContentType = (payload) => {
	const files = Array.isArray(payload.files) ? payload.files : [];
	const text = String(payload.text || "").trim();
	const url = String(payload.url || "").trim();
	const meta = payload.metadata && typeof payload.metadata === "object" && !Array.isArray(payload.metadata) ? payload.metadata : {};
	const expectedFileCount = Math.max(Number(meta.fileCount) || 0, Number(payload.fileCount) || 0);
	/** Android share-target often ships a `content:`/`https:` URL together with attachments; blobs may hydrate later. */
	const filesStillPending = files.length === 0 && expectedFileCount > 0;
	if (payload.hint?.contentType && !filesStillPending) return String(payload.hint.contentType);
	if (files.length > 0) {
		const kind = classifyIngressFile(files[0]);
		if (kind === "image") return "image";
		if (kind === "markdown") return "markdown";
		if (kind === "text") return "text";
		return "file";
	}
	/** SW metadata row often beats File[] hydration (`fileCount` only) — classify from title/filename hint. */
	const nameProbe = typeof payload.hint?.filename === "string" && payload.hint.filename.trim() || typeof payload.title === "string" && payload.title.trim() || "";
	if (!text && nameProbe && (!url || filesStillPending)) {
		const nk = classifyIngressFromBasename(nameProbe);
		if (nk === "markdown") return "markdown";
		if (nk === "text") return "text";
		if (nk === "image") return "image";
		if (filesStillPending && nk === "file") return "file";
	}
	if (url) {
		const normalized = url.split("#")[0].split("?")[0].toLowerCase();
		if (/\.(md|markdown|mdown|mkd|mkdn|mdtxt|mdtext)$/.test(normalized)) return "markdown";
		return "url";
	}
	if (text) return "text";
	return "other";
};
var isNativeCapacitor = () => {
	try {
		return Boolean(globalThis.Capacitor?.isNativePlatform?.());
	} catch {
		return false;
	}
};
var pickDestination = (payload, contentType) => {
	ensureCwspSkuFromLocation();
	const sku = inferCwspSkuFromLocation();
	if (sku === "process") return "workcenter";
	const skuHint = skuIngressHint(payload, { settings: peekProcessIngressSettings() });
	if (skuHint?.destination) return skuHint.destination;
	const surface = surfaceForSku(sku) || "shell";
	const kind = classifyOpenKindFromPayload(payload);
	const channels = inferIngressChannels(payload.source || payload.route, isNativeCapacitor());
	const sink = resolveOpenPolicy(peekOpenPolicy(), surface, kind, channels);
	if (sink !== "ask") return sinkToDestination(sink, contentType === "markdown" || contentType === "text" ? "viewer" : "workcenter");
	if (payload.hint?.action === "save") return "explorer";
	/** Readable docs should win over stale `hint.destination` from cached/share envelopes. */
	if (contentType === "markdown" || contentType === "text") return "viewer";
	if (payload.hint?.destination) return payload.hint.destination;
	if (payload.hint?.action === "process" || payload.hint?.action === "attach") return "workcenter";
	if (payload.hint?.action === "open") return "viewer";
	if (contentType === "url") return "workcenter";
	if (contentType === "image" || contentType === "file") return "workcenter";
	return "workcenter";
};
var toMessageType = (destination, hint) => {
	if (destination === "viewer") return hint?.action === "open" ? "content-load" : "content-view";
	if (destination === "explorer") {
		if (hint?.action === "ask") return "file-ask";
		if (hint?.action === "open") return "navigate-path";
		return "file-save";
	}
	if (destination === "workcenter") return hint?.action === "process" ? "content-process" : "content-attach";
	if (destination === "editor") return "content-load";
	if (destination === "home") return hint?.action === "wallpaper" ? "content-share" : "content-share";
	return "content-share";
};
var resolveViewTransfer = (payload) => {
	const contentType = getContentType(payload);
	const skuHint = skuIngressHint(payload, { settings: peekProcessIngressSettings() });
	const destination = pickDestination(payload, contentType);
	const hint = skuHint ? {
		...payload.hint,
		...skuHint
	} : payload.hint;
	const messageType = toMessageType(destination, hint);
	const files = Array.isArray(payload.files) ? payload.files : [];
	const data = {
		title: payload.title,
		text: payload.text,
		content: payload.text,
		url: payload.url,
		files,
		fileCount: files.length || Number(payload.fileCount || 0),
		filename: hint?.filename || files[0]?.name,
		source: payload.source,
		route: payload.route,
		hint
	};
	/** INVARIANT: do not overwrite `data.source` (transfer enum). Path goes on src/path/virtualPath. */
	const virtualSource = String(hint?.source || payload.url || "").trim();
	if (virtualSource && virtualSource !== "share-target" && virtualSource !== "launch-queue" && virtualSource !== "clipboard" && virtualSource !== "pending") {
		data.path = virtualSource;
		data.src = virtualSource;
		data.virtualPath = virtualSource;
	}
	const resolved = {
		destination: normalizeDestination(destination),
		routePath: `/${destination}`,
		messageType,
		contentType,
		data,
		metadata: {
			source: payload.source,
			route: payload.route,
			pending: Boolean(payload.pending),
			hint,
			...payload.metadata || {}
		}
	};
	console.log("[ViewTransfer] Resolved transfer:", summarizeForLog({
		source: payload.source,
		route: payload.route,
		pending: payload.pending,
		hint,
		contentType,
		destination,
		messageType,
		fileCount: files.length
	}));
	return resolved;
};
var mirrorTransferToViewChannel = (resolved, message) => {
	if (typeof BroadcastChannel === "undefined") return;
	try {
		const ch = new BroadcastChannel(viewBroadcastChannelName(resolved.destination));
		ch.postMessage({
			type: "view-transfer",
			message
		});
		ch.close();
	} catch (e) {
		console.warn("[ViewTransfer] View-channel mirror failed:", e);
	}
};
var payloadSink = (payload, resolved) => {
	const hinted = payload.hint?.sink ?? (resolved.metadata?.hint)?.sink;
	return normalizeOpenSink(hinted, "ask");
};
var openResolvedWithSystem = async (payload, chooser) => {
	const file = Array.isArray(payload.files) ? payload.files[0] : void 0;
	const uri = String(payload.url || payload.hint?.source || "").trim();
	try {
		const { launcherOpenUri } = await import("./launcher-bridge.js").then((n) => n.t);
		if (typeof launcherOpenUri === "function") {
			const openable = /^(file|content|https?):/i.test(uri) ? uri : uri.startsWith("/") ? uri : "";
			if (openable && await launcherOpenUri(openable, {
				chooser,
				mimeType: file?.type,
				title: "Open with"
			})) return true;
		}
	} catch {}
	if (!file) return false;
	try {
		const url = URL.createObjectURL(file);
		globalThis.open?.(url, "_blank", "noopener,noreferrer");
		return true;
	} catch {
		return false;
	}
};
var launchSinkSku = async (sink, payload, resolved) => {
	const sku = skuForOpenSink(sink);
	if (!sku) return false;
	const file = Array.isArray(payload.files) ? payload.files[0] : void 0;
	try {
		stashSkuHandoff({
			dest: resolved.destination,
			filename: String(payload.hint?.filename || file?.name || ""),
			src: String(payload.url || payload.hint?.source || ""),
			content: String(payload.text || "")
		});
	} catch {}
	const pkg = androidPackageForSku(sku);
	const src = String(payload.url || payload.hint?.source || "");
	if (pkg && /^(content|file|https?):/i.test(src)) try {
		const { launcherOpenUri } = await import("./launcher-bridge.js").then((n) => n.t);
		if (await launcherOpenUri(src, {
			packageName: pkg,
			chooser: false,
			mimeType: file?.type || void 0
		})) return true;
	} catch {}
	if (pkg) try {
		if (await (await import("./launcher-bridge.js").then((n) => n.t)).launcherLaunch?.(pkg)) return true;
	} catch {}
	try {
		if (isCwspNativeHost()) return false;
		location.assign(publicHrefForSku(sku));
		return true;
	} catch {
		return false;
	}
};
var dispatchViewTransfer = async (payload) => {
	const resolved = resolveViewTransfer(payload);
	ensureCwspSkuFromLocation();
	const sink = payloadSink(payload, resolved);
	if (sink === "system" || sink === "external") {
		if (await openResolvedWithSystem(payload, sink === "system")) return {
			delivered: true,
			resolved
		};
	}
	if (sink === "document") {
		if ((inferCwspSkuFromLocation() || readCwspSku()) !== "document") {
			if (await launchSinkSku(sink, payload, resolved)) return {
				delivered: true,
				resolved
			};
		}
	}
	const stayInApp = sink === "viewer" || sink === "display";
	const sibling = siblingSkuForView(resolved.destination);
	if (!stayInApp && shouldHandoffViewToSibling(resolved.destination) && sibling) {
		const pkg = androidPackageForSku(sibling);
		let handedOff = false;
		if (pkg) try {
			const bridge = await import("./launcher-bridge.js").then((n) => n.t);
			handedOff = Boolean(await bridge.launcherLaunch?.(pkg));
		} catch {}
		if (!handedOff && typeof location !== "undefined") try {
			location.assign(publicHrefForSku(sibling));
			handedOff = true;
		} catch {
			const scheme = ECOSYSTEM_SKUS[sibling]?.scheme;
			if (scheme) try {
				location.assign(`${scheme}://`);
				handedOff = true;
			} catch {}
		}
		if (handedOff) return {
			delivered: true,
			resolved
		};
	}
	const files = Array.isArray(payload.files) ? payload.files : [];
	if (payload.hint?.action !== "process") holdIngressFiles(files);
	const heldForWorkCenter = normalizeDestination(resolved.destination) === "workcenter" && files.some((file) => file instanceof File);
	const hasBinaryPayload = resolved.contentType === "image" || resolved.contentType === "file";
	const message = {
		id: crypto.randomUUID(),
		type: resolved.messageType,
		destination: normalizeDestination(resolved.destination),
		contentType: resolved.contentType,
		data: resolved.data,
		metadata: resolved.metadata,
		source: `view-transfer:${payload.source}`
	};
	console.log("[ViewTransfer] Dispatching message:", summarizeForLog({
		destination: message.destination,
		type: message.type,
		contentType: message.contentType,
		metadata: message.metadata
	}));
	mirrorTransferToViewChannel(resolved, message);
	const deliveredNow = await sendProtocolMessage({
		...message,
		purpose: ["deliver", "mail"],
		protocol: "window",
		op: payload.hint?.action === "open" ? "invoke" : "deliver",
		srcChannel: message.source,
		dstChannel: normalizeDestination(resolved.destination)
	});
	let queuedAsPending = false;
	/**
	* WHY: File blobs cannot go through IDB pending. Hold them in memory and still
	* enqueue a files-stripped `content-attach` so Work Center `onShow` / replay
	* calls `takeHeldIngressFiles`. Skipping the queue for images left share/launch
	* as a no-op when the view was not mounted yet (settings, cold boot).
	*/
	if (!deliveredNow && (!hasBinaryPayload || heldForWorkCenter)) try {
		const pendingMessage = {
			...message,
			data: {
				...message.data || {},
				files: [],
				fileCount: Number(message.data?.fileCount || files.length || 0)
			}
		};
		enqueuePendingMessage(resolved.destination, pendingMessage);
		queuedAsPending = true;
	} catch (error) {
		console.warn("[ViewTransfer] Failed to enqueue pending message:", error);
	}
	const delivered = deliveredNow || queuedAsPending || heldForWorkCenter;
	console.log("[ViewTransfer] Message delivery status:", {
		deliveredNow,
		queuedAsPending,
		hasBinaryPayload,
		heldForWorkCenter,
		delivered,
		destination: resolved.destination,
		routePath: resolved.routePath
	});
	return {
		delivered,
		resolved
	};
};
//#endregion
export { dispatchViewTransfer as i, classifyIngressFile as n, classifyIngressFromBasename as r, ViewTransferRouting_exports as t };
