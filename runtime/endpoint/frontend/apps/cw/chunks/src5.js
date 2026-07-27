import { g as removeAdopted, p as loadAsAdopted } from "../fest/dom.js";
import { I as H } from "../com/app.js";
import { n as HistoryChannelAction } from "./channel-actions.js";
/**
* Recent-history window for collapsing identical clipboard bodies that lack a
* stable contentKey (or had mismatched keys across Cap/Neu emits).
* WHY: two Accept toasts for the same paste must show as one History row.
*/
var TRANSFER_HISTORY_CLIP_RECENT_COLLAPSE_MS = 12e4;
function cloneEntry(e) {
	return {
		...e,
		fileNames: e.fileNames ? [...e.fileNames] : void 0
	};
}
/**
* Actions available for a row.
* WHY (clipboard inbound): payload already landed on-device — Keep Accept / Open /
* Download available after toast TTL (do not treat clipboard as expired/muted).
* Files offers still expire / decline with no operational actions.
* INVARIANT: every row gets `remove` (including done / expired / declined).
*/
/**
* True when a files row is a singleton (one landed/offered file).
* WHY: History Open makes sense for one file; multi-file keeps Reveal/folder.
*/
function isSingleFileTransfer(entry) {
	if (!entry || entry.kind !== "files") return false;
	const names = entry.fileNames;
	if (Array.isArray(names)) {
		if (names.length === 1) return true;
		if (names.length > 1) return false;
	}
	const m = String(entry.subtitle || "").trim().match(/^(\d+)\s+file/i);
	if (m) return Number(m[1]) === 1;
	if (String(entry.localFilePath || "").trim()) return true;
	return false;
}
function actionsForEntry(entry) {
	const { kind, direction, status } = entry;
	const isClipboard = kind === "clipboard-text" || kind === "clipboard-image";
	const acts = [];
	const clipBody = entry.retainedText || entry.textPreview || entry.subtitle || "";
	if (isClipboard && direction === "in") {
		if (status !== "declined" && status !== "error") {
			acts.push("accept");
			if (status === "actionable" || status === "pending") acts.push("dismiss");
			if (kind === "clipboard-image") {
				acts.push("open", "download");
				if (entry.localFilePath) acts.push("reveal");
			} else if (looksLikeHttpUrl(clipBody)) acts.push("open");
			if (canShareAgain(entry)) acts.push("share");
		}
		acts.push("remove");
		return acts;
	}
	if (isClipboard && direction === "out") {
		if (status !== "declined" && status !== "error") {
			if (canShareAgain(entry)) acts.push("share");
			if (kind === "clipboard-image") {
				if (Boolean(entry.localFilePath) || isHistoryImageDataUrl(entry.thumbDataUrl)) {
					acts.push("open", "download");
					if (entry.localFilePath) acts.push("reveal");
				}
			} else if (looksLikeHttpUrl(clipBody)) acts.push("open");
		}
		acts.push("remove");
		return acts;
	}
	if (status === "expired" || status === "declined" || status === "error") {
		acts.push("remove");
		return acts;
	}
	if (status === "done") {
		if (kind === "files" && direction === "in") {
			if (isSingleFileTransfer(entry)) acts.push("open");
			acts.push("reveal");
		}
		acts.push("remove");
		return acts;
	}
	if (kind === "files") {
		if (direction === "in") {
			if (status === "actionable" || status === "pending") acts.push("accept", "decline");
			else if (status === "progress") acts.push("cancel");
		} else if (status === "progress" || status === "actionable" || status === "pending") acts.push("cancel");
		acts.push("remove");
		return acts;
	}
	acts.push("remove");
	return acts;
}
/** True when History still holds a payload that can be re-fanned to peers. */
function canShareAgain(entry) {
	if (!entry) return false;
	if (entry.kind === "clipboard-image") return Boolean(entry.localFilePath) || isHistoryImageDataUrl(entry.thumbDataUrl);
	if (entry.kind === "clipboard-text") return String(entry.retainedText || entry.textPreview || "").trim().length > 0;
	return false;
}
function looksLikeHttpUrl(s) {
	const t = (s || "").trim();
	if (!t) return false;
	if (/https?:\/\//i.test(t) || /^www\./i.test(t)) return true;
	return false;
}
/** Human byte size for History image/file subtitles (e.g. `1.2 MB`). */
function formatTransferBytes(bytes) {
	if (bytes == null || !Number.isFinite(bytes) || bytes < 0) return "";
	if (bytes < 1024) return `${Math.round(bytes)} B`;
	if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
	if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
	return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}
/** True when a History thumb looks like an inline image data URL. */
function isHistoryImageDataUrl(value) {
	if (value == null) return false;
	const s = String(value).trim();
	return /^data:image\/[a-z0-9.+-]+;base64,/i.test(s);
}
/** Human speed for History / toast (e.g. `12.4 MB/s`). */
function formatTransferSpeed(speedBps) {
	if (speedBps == null || !Number.isFinite(speedBps) || speedBps <= 0) return "—";
	const units = [
		"B/s",
		"KB/s",
		"MB/s",
		"GB/s"
	];
	let v = speedBps;
	let i = 0;
	while (v >= 1024 && i < units.length - 1) {
		v /= 1024;
		i++;
	}
	const digits = v >= 100 || i === 0 ? 0 : v >= 10 ? 1 : 2;
	return `${v.toFixed(digits)} ${units[i]}`;
}
/** Progress fraction 0..1 for UI bars. */
function transferProgressRatio(entry) {
	const total = entry.totalBytes ?? 0;
	const done = entry.bytesDone ?? 0;
	if (total <= 0) return 0;
	return Math.max(0, Math.min(1, done / total));
}
function isMutedHistoryStatus(status, kind) {
	if (kind === "clipboard-text" || kind === "clipboard-image") return status === "declined" || status === "error";
	return status === "expired" || status === "declined" || status === "error";
}
function entryRecency(e) {
	return Math.max(e.lastActionAt ?? 0, e.ts ?? 0);
}
function gcNewest(entries, max) {
	if (entries.length <= max) return entries;
	return [...entries].sort((a, b) => entryRecency(b) - entryRecency(a)).slice(0, max);
}
/**
* Merge patch into an existing row. Keeps stable id + first-seen `ts`.
* Sets `lastActionAt` when reaching done or when the patch carries it.
*/
/**
* Stable fingerprint for clipboard History merge (same paste → one row).
* Prefer explicit contentKey, then retained body, preview, or image size tag.
*/
function clipboardContentKey(entry) {
	const explicit = String(entry.contentKey || "").trim();
	if (explicit && explicit !== "0" && !explicit.startsWith("img-clip-in-")) return explicit;
	const body = String(entry.retainedText || entry.textPreview || "").trim();
	if (body) return body.length > 240 ? body.slice(0, 240) : body;
	if (entry.kind === "clipboard-image") {
		const bytes = entry.totalBytes;
		if (typeof bytes === "number" && bytes > 0) return `img-bytes-${bytes}`;
	}
	return explicit;
}
function clipboardBodyFingerprint(entry) {
	return String(entry.retainedText || entry.textPreview || entry.contentKey || "").trim().slice(0, 240);
}
function mergeTransferHistoryEntry(prev, next) {
	const now = Number.isFinite(next.ts) ? next.ts : Date.now();
	const becameDone = next.status === "done" && prev.status !== "done";
	const patchActionAt = typeof next.lastActionAt === "number" && Number.isFinite(next.lastActionAt) ? next.lastActionAt : void 0;
	let lastActionAt = prev.lastActionAt;
	if (patchActionAt != null) lastActionAt = Math.max(prev.lastActionAt ?? 0, patchActionAt);
	else if (becameDone || next.status === "done") lastActionAt = Math.max(prev.lastActionAt ?? 0, now);
	else if (next.status === "actionable" || next.status === "pending") lastActionAt = Math.max(prev.lastActionAt ?? 0, now);
	const pickStr = (a, b) => {
		const x = a != null && String(a).length ? a : void 0;
		const y = b != null && String(b).length ? b : void 0;
		return x ?? y;
	};
	let status = next.status ?? prev.status;
	if ((next.kind === "clipboard-text" || next.kind === "clipboard-image") && (next.status === "actionable" || next.status === "pending") && (prev.status === "done" || prev.status === "expired" || prev.status === "actionable")) status = next.status;
	const contentKey = clipboardContentKey({
		...prev,
		...next
	}) || pickStr(next.contentKey, prev.contentKey);
	return {
		...prev,
		...next,
		id: prev.id,
		ts: prev.ts,
		status,
		lastActionAt,
		retainedText: pickStr(next.retainedText, prev.retainedText),
		textPreview: pickStr(next.textPreview, prev.textPreview),
		contentKey,
		transferId: pickStr(next.transferId, prev.transferId),
		thumbDataUrl: pickStr(next.thumbDataUrl, prev.thumbDataUrl),
		localFilePath: pickStr(next.localFilePath, prev.localFilePath),
		subtitle: pickStr(next.subtitle, prev.subtitle),
		peerId: pickStr(next.peerId, prev.peerId),
		title: pickStr(next.title, prev.title) || prev.title,
		bytesDone: next.bytesDone ?? prev.bytesDone,
		totalBytes: next.totalBytes ?? prev.totalBytes,
		speedBps: next.status === "done" ? void 0 : next.speedBps ?? prev.speedBps,
		etaMs: next.status === "done" ? null : next.etaMs !== void 0 ? next.etaMs : prev.etaMs,
		fileNames: next.fileNames?.length ? next.fileNames : prev.fileNames,
		error: next.status === "error" ? next.error ?? prev.error : next.error
	};
}
/**
* Create an in-memory transfer history ring store.
* INVARIANT: list length never exceeds `max` after any mutating call.
*/
function createTransferHistoryStore(options = {}) {
	const max = options.max ?? 100;
	const clipDedupeMs = options.clipDedupeMs ?? 5e3;
	let entries = gcNewest((options.initial || []).map(cloneEntry), max);
	const listeners = /* @__PURE__ */ new Set();
	function notify() {
		const snap = entries.map(cloneEntry);
		for (const l of listeners) try {
			l(snap);
		} catch {}
	}
	function findIndex(idOrTransferId) {
		const key = String(idOrTransferId || "");
		if (!key) return -1;
		return entries.findIndex((e) => e.id === key || e.transferId != null && e.transferId === key);
	}
	function applyGc() {
		entries = gcNewest(entries, max);
	}
	return {
		push(entry) {
			const next = cloneEntry(entry);
			if (!next.id) next.id = next.transferId || `th-${next.ts || Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
			if (!Number.isFinite(next.ts)) next.ts = Date.now();
			if (next.kind === "clipboard-text" || next.kind === "clipboard-image") {
				const key = clipboardContentKey(next);
				if (key) next.contentKey = key;
			}
			let idx = findIndex(next.id);
			if (idx < 0 && next.transferId) idx = entries.findIndex((e) => e.transferId === next.transferId);
			if (idx < 0 && next.contentKey && (next.kind === "clipboard-text" || next.kind === "clipboard-image")) {
				const nextKey = clipboardContentKey(next);
				idx = entries.findIndex((e) => (e.kind === "clipboard-text" || e.kind === "clipboard-image") && e.direction === next.direction && e.kind === next.kind && clipboardContentKey(e) === nextKey);
				if (idx < 0) {
					const body = clipboardBodyFingerprint(next);
					const windowMs = Math.max(clipDedupeMs, TRANSFER_HISTORY_CLIP_RECENT_COLLAPSE_MS);
					if (body) idx = entries.findIndex((e) => (e.kind === "clipboard-text" || e.kind === "clipboard-image") && e.direction === next.direction && e.kind === next.kind && clipboardBodyFingerprint(e) === body && Math.abs(entryRecency(e) - next.ts) <= windowMs);
				}
			}
			if (idx < 0 && next.kind === "clipboard-image" && (next.status === "done" || next.status === "declined") && !isHistoryImageDataUrl(next.thumbDataUrl) && !String(next.localFilePath || "").trim()) {
				const windowMs = Math.max(clipDedupeMs, TRANSFER_HISTORY_CLIP_RECENT_COLLAPSE_MS);
				idx = entries.findIndex((e) => e.kind === "clipboard-image" && e.direction === next.direction && (isHistoryImageDataUrl(e.thumbDataUrl) || Boolean(e.localFilePath)) && Math.abs(entryRecency(e) - next.ts) <= windowMs);
			}
			if (idx >= 0) {
				entries[idx] = mergeTransferHistoryEntry(entries[idx], next);
				const merged = entries[idx];
				entries = [merged, ...entries.filter((_, i) => i !== idx)];
				applyGc();
				notify();
				return cloneEntry(merged);
			}
			if (next.kind === "clipboard-image" && (next.status === "done" || next.status === "declined") && !isHistoryImageDataUrl(next.thumbDataUrl) && !String(next.localFilePath || "").trim()) return next;
			entries = [next, ...entries];
			applyGc();
			notify();
			return cloneEntry(next);
		},
		upsert(entry) {
			return this.push(entry);
		},
		updateProgress(input) {
			const tid = String(input.transferId || "");
			if (!tid) return void 0;
			let idx = findIndex(tid);
			const now = input.ts ?? Date.now();
			if (idx < 0) {
				const stub = {
					id: tid,
					ts: now,
					kind: "files",
					direction: "in",
					status: "progress",
					title: "File transfer",
					transferId: tid,
					bytesDone: input.bytesDone,
					totalBytes: input.totalBytes,
					speedBps: input.speedBps,
					etaMs: input.etaMs ?? null
				};
				entries = [stub, ...entries];
				applyGc();
				notify();
				return cloneEntry(stub);
			}
			const prev = entries[idx];
			const complete = input.totalBytes > 0 && input.bytesDone >= input.totalBytes;
			const status = prev.status === "expired" || prev.status === "declined" ? prev.status : complete ? "done" : prev.status === "done" ? "done" : "progress";
			entries[idx] = mergeTransferHistoryEntry(prev, {
				...prev,
				status,
				bytesDone: input.bytesDone,
				totalBytes: input.totalBytes,
				speedBps: input.speedBps ?? prev.speedBps,
				etaMs: complete ? null : input.etaMs !== void 0 ? input.etaMs : prev.etaMs,
				ts: now,
				lastActionAt: complete ? now : prev.lastActionAt
			});
			const merged = entries[idx];
			entries = [merged, ...entries.filter((_, i) => i !== idx)];
			applyGc();
			notify();
			return cloneEntry(merged);
		},
		mark(idOrTransferId, status, patch) {
			const idx = findIndex(idOrTransferId);
			if (idx < 0) return void 0;
			const prev = entries[idx];
			const now = patch?.ts ?? Date.now();
			entries[idx] = mergeTransferHistoryEntry(prev, {
				...prev,
				...patch || {},
				status,
				ts: now,
				lastActionAt: status === "done" ? patch?.lastActionAt ?? now : patch?.lastActionAt ?? prev.lastActionAt
			});
			const merged = entries[idx];
			entries = [merged, ...entries.filter((_, i) => i !== idx)];
			applyGc();
			notify();
			return cloneEntry(merged);
		},
		list() {
			return entries.map(cloneEntry);
		},
		get(id) {
			const idx = findIndex(id);
			return idx >= 0 ? cloneEntry(entries[idx]) : void 0;
		},
		remove(idOrTransferId) {
			const idx = findIndex(idOrTransferId);
			if (idx < 0) return false;
			entries = entries.filter((_, i) => i !== idx);
			notify();
			return true;
		},
		clear() {
			entries = [];
			notify();
		},
		subscribe(listener) {
			listeners.add(listener);
			return () => {
				listeners.delete(listener);
			};
		}
	};
}
/** Serialize for localStorage / control JSON (stable key order not required). */
function serializeTransferHistory(entries) {
	return JSON.stringify({
		v: 1,
		entries: entries.map(cloneEntry)
	});
}
function parseTransferHistory(raw) {
	if (!raw || typeof raw !== "string") return [];
	try {
		const parsed = JSON.parse(raw);
		if (!parsed || !Array.isArray(parsed.entries)) return [];
		const out = [];
		for (const item of parsed.entries) {
			if (!item || typeof item !== "object") continue;
			const e = item;
			if (typeof e.id !== "string" || typeof e.ts !== "number") continue;
			if (typeof e.kind !== "string" || typeof e.direction !== "string") continue;
			if (typeof e.status !== "string" || typeof e.title !== "string") continue;
			out.push(cloneEntry(e));
		}
		return gcNewest(out, 100);
	} catch {
		return [];
	}
}
//#endregion
//#region ../../modules/views/history-view/src/transfer-history-runtime.ts
var STORAGE_KEY = "cwsp-transfer-history-v1";
var NEU_POLL_MS = 1500;
var DEFAULT_CONTROL_PORT = 29110;
var DEFAULT_CONTROL_KEY = "cwsp-neutralino-local";
var store = null;
var startedCap = false;
var startedNeu = false;
/** Last control port that answered GET /service/transfer-history. */
var neuWorkingPort = null;
function controlPortCandidates() {
	const g = globalThis;
	const key = String(g.__NEUTRALINO_AUTH__?.key || g.__WEBNATIVE_AUTH__?.key || DEFAULT_CONTROL_KEY);
	const nlRaw = g.NL_PORT;
	const nlPort = typeof nlRaw === "number" ? nlRaw : nlRaw ? Number(nlRaw) : NaN;
	const seen = /* @__PURE__ */ new Set();
	const out = [];
	const push = (port) => {
		if (typeof port !== "number" || !Number.isFinite(port) || port < 1024) return;
		if (port === 8434) return;
		if (Number.isFinite(nlPort) && port === nlPort) return;
		if (seen.has(port)) return;
		seen.add(port);
		out.push({
			port,
			key
		});
	};
	push(neuWorkingPort);
	push(g.__NEUTRALINO_AUTH__?.port);
	push(g.__WEBNATIVE_AUTH__?.port);
	push(DEFAULT_CONTROL_PORT);
	if (!out.length) out.push({
		port: DEFAULT_CONTROL_PORT,
		key
	});
	return out;
}
/** Best-effort control auth for History POST (prefer last working poll port). */
function readAuth() {
	return controlPortCandidates()[0] || null;
}
/**
* Neu History image src: inline data URL, else control preview of durable PNG.
* WHY: toast PNGs are copied to `.data/transfer-history-assets`; large thumbs
* are omitted from GET JSON and loaded via `?id=&key=`.
*/
function historyImageSrc(entry) {
	const inline = String(entry.thumbDataUrl || "").trim();
	if (inline.startsWith("data:image/")) return inline;
	if (!entry.localFilePath) return "";
	const auth = readAuth();
	if (!auth) return "";
	const id = encodeURIComponent(entry.id || entry.transferId || entry.contentKey || "");
	if (!id) return "";
	return `http://127.0.0.1:${auth.port}/service/transfer-history/preview?id=${id}&key=${encodeURIComponent(auth.key)}`;
}
function persist(s) {
	try {
		localStorage.setItem(STORAGE_KEY, serializeTransferHistory(s.list()));
	} catch {}
}
/** Singleton Transfer History store (local to this WebView). */
function getTransferHistoryStore() {
	if (store) return store;
	let initial = [];
	try {
		initial = parseTransferHistory(localStorage.getItem(STORAGE_KEY));
	} catch {
		initial = [];
	}
	store = createTransferHistoryStore({ initial });
	store.subscribe(() => {
		if (store) persist(store);
	});
	return store;
}
function upsertFromUnknown(raw) {
	if (!raw || typeof raw !== "object") return;
	const e = raw;
	if (typeof e.id !== "string" && typeof e.transferId !== "string") return;
	if (typeof e.kind !== "string" || typeof e.direction !== "string") return;
	if (typeof e.status !== "string" || typeof e.title !== "string") return;
	getTransferHistoryStore().upsert({
		id: String(e.id || e.transferId),
		ts: typeof e.ts === "number" ? e.ts : Date.now(),
		kind: e.kind,
		direction: e.direction,
		status: e.status,
		title: e.title,
		subtitle: e.subtitle,
		textPreview: e.textPreview,
		retainedText: e.retainedText,
		thumbDataUrl: e.thumbDataUrl,
		localFilePath: e.localFilePath,
		fileNames: e.fileNames,
		transferId: e.transferId,
		bytesDone: e.bytesDone,
		totalBytes: e.totalBytes,
		speedBps: e.speedBps,
		etaMs: e.etaMs,
		expiresAt: e.expiresAt,
		peerId: e.peerId,
		error: e.error,
		contentKey: e.contentKey,
		lastActionAt: typeof e.lastActionAt === "number" ? e.lastActionAt : void 0
	});
}
function onCapWindowEvent(ev) {
	try {
		const detail = ev.detail;
		let parsed = detail;
		if (typeof detail === "string") parsed = JSON.parse(detail);
		if (parsed && typeof parsed === "object" && "entries" in parsed) {
			const entries = parsed.entries;
			if (Array.isArray(entries)) {
				for (const e of entries) upsertFromUnknown(e);
				return;
			}
		}
		upsertFromUnknown(parsed);
	} catch {}
}
/** Cap: listen for native → WebView history events. */
function startCapacitorTransferHistory() {
	if (startedCap) return;
	startedCap = true;
	getTransferHistoryStore();
	window.addEventListener("cws:transferHistory", onCapWindowEvent);
	document.addEventListener("cws:transferHistory", onCapWindowEvent);
	import("../vendor/@capacitor_core.js").then((n) => n.n).then(async ({ CwsBridge }) => {
		try {
			await CwsBridge.addListener("nativeMessage", (event) => {
				const payload = event?.payload;
				if (!payload || typeof payload !== "object") return;
				const p = payload;
				if (p.type !== "transfer-history") return;
				let entry = p.entry;
				if (typeof entry === "string") try {
					entry = JSON.parse(entry);
				} catch {
					return;
				}
				upsertFromUnknown(entry);
			});
		} catch {}
	}).catch(() => void 0);
}
async function pollNeuHistory() {
	const candidates = controlPortCandidates();
	for (const auth of candidates) try {
		const res = await fetch(`http://127.0.0.1:${auth.port}/service/transfer-history`, {
			headers: { "x-api-key": auth.key },
			signal: typeof AbortSignal !== "undefined" && typeof AbortSignal.timeout === "function" ? AbortSignal.timeout(2e3) : void 0
		});
		if (!res.ok) continue;
		const data = await res.json();
		if (!Array.isArray(data.entries)) continue;
		neuWorkingPort = auth.port;
		try {
			const g = globalThis;
			g.__NEUTRALINO_AUTH__ = {
				port: auth.port,
				key: auth.key
			};
			g.__WEBNATIVE_AUTH__ = {
				port: auth.port,
				key: auth.key
			};
		} catch {}
		const s = getTransferHistoryStore();
		if (data.replace) {
			const ids = /* @__PURE__ */ new Set();
			const contentKeys = /* @__PURE__ */ new Set();
			for (const raw of data.entries) {
				if (raw && typeof raw === "object") {
					const e = raw;
					const id = String(e.id || e.transferId || "");
					if (id) ids.add(id);
					const ck = String(e.contentKey || "").trim();
					if (ck) contentKeys.add(ck);
				}
				upsertFromUnknown(raw);
			}
			for (const local of s.list()) {
				const keepId = ids.has(local.id) || local.transferId != null && ids.has(local.transferId);
				const keepKey = local.contentKey != null && contentKeys.has(String(local.contentKey));
				if (!keepId && !keepKey) s.remove(local.id);
			}
		} else for (const e of data.entries) upsertFromUnknown(e);
		return;
	} catch {}
}
/** Neu: poll control transfer-history (native toast stays independent). */
function startNeutralinoTransferHistory() {
	if (startedNeu) return;
	startedNeu = true;
	getTransferHistoryStore();
	pollNeuHistory();
	setInterval(() => {
		pollNeuHistory();
	}, NEU_POLL_MS);
}
async function dispatchHistoryAction(entry, action) {
	if (action === "remove") {
		if (entry.kind === "files" && (entry.status === "progress" || entry.status === "actionable" || entry.status === "pending")) {
			const abortAction = entry.status === "progress" ? "cancel" : entry.direction === "in" ? "decline" : "cancel";
			try {
				await dispatchHistoryAction(entry, abortAction);
			} catch {}
		}
		const key = entry.transferId || entry.id;
		getTransferHistoryStore().remove(key);
		const auth = readAuth();
		if (auth && globalThis.__CWS_NEUTRALINO_BOOT__) try {
			await fetch(`http://127.0.0.1:${auth.port}/service/transfer-history`, {
				method: "POST",
				headers: {
					"content-type": "application/json",
					"x-api-key": auth.key
				},
				body: JSON.stringify({
					action: "remove",
					id: entry.id,
					transferId: entry.transferId,
					kind: entry.kind,
					direction: entry.direction
				}),
				signal: typeof AbortSignal !== "undefined" && typeof AbortSignal.timeout === "function" ? AbortSignal.timeout(5e3) : void 0
			});
			pollNeuHistory();
		} catch {}
		return true;
	}
	const auth = readAuth();
	if (auth && globalThis.__CWS_NEUTRALINO_BOOT__) try {
		const res = await fetch(`http://127.0.0.1:${auth.port}/service/transfer-history`, {
			method: "POST",
			headers: {
				"content-type": "application/json",
				"x-api-key": auth.key
			},
			body: JSON.stringify({
				action,
				id: entry.id,
				transferId: entry.transferId,
				kind: entry.kind,
				direction: entry.direction
			}),
			signal: typeof AbortSignal !== "undefined" && typeof AbortSignal.timeout === "function" ? AbortSignal.timeout(5e3) : void 0
		});
		if (res.ok) {
			const data = await res.json();
			pollNeuHistory();
			return Boolean(data.applied ?? true);
		}
	} catch {}
	try {
		const payload = {
			id: entry.id,
			transferId: entry.transferId,
			kind: entry.kind,
			direction: entry.direction,
			retainedText: entry.retainedText || entry.textPreview || "",
			textPreview: entry.textPreview || "",
			thumbDataUrl: entry.thumbDataUrl || "",
			localFilePath: entry.localFilePath || ""
		};
		const { invokeCwsNative } = await import("../vendor/@capacitor_core.js").then((n) => n.n);
		if ((await invokeCwsNative({
			channel: `history:${action}`,
			payload
		}))?.ok !== false) {
			getTransferHistoryStore().mark(entry.transferId || entry.id, action === "decline" || action === "dismiss" ? "declined" : action === "accept" ? "done" : entry.status);
			return true;
		}
	} catch {}
	try {
		const bridge = globalThis.Capacitor?.Plugins?.CwsBridge;
		if (bridge) {
			const method = {
				accept: "historyAccept",
				dismiss: "historyDismiss",
				decline: "historyDecline",
				open: "historyOpen",
				download: "historyDownload",
				cancel: "historyCancel",
				reveal: "historyReveal",
				share: "historyShare"
			}[action];
			if (method && typeof bridge[method] === "function") {
				await bridge[method]({
					id: entry.id,
					transferId: entry.transferId,
					kind: entry.kind,
					direction: entry.direction,
					retainedText: entry.retainedText || entry.textPreview || "",
					textPreview: entry.textPreview || "",
					thumbDataUrl: entry.thumbDataUrl || "",
					localFilePath: entry.localFilePath || ""
				});
				getTransferHistoryStore().mark(entry.transferId || entry.id, action === "decline" || action === "dismiss" ? "declined" : action === "accept" ? "done" : entry.status);
				return true;
			}
		}
	} catch {}
	if (action === "dismiss" || action === "decline") {
		getTransferHistoryStore().mark(entry.transferId || entry.id, "declined");
		return true;
	}
	return false;
}
//#endregion
//#region ../../modules/views/history-view/src/scss/history.scss?inline
var history_default = "@layer view.history{:is(html,body):has([data-view=history]){--view-layout:\"flex\";--view-content-max-width:1000px}:is(html[data-theme=light] .view-history,:host-context(html[data-theme=light]) .view-history){color-scheme:light}:is(html[data-theme=dark] .view-history,:host-context(html[data-theme=dark]) .view-history){color-scheme:dark}.view-history{color-scheme:inherit;--vh-bg:var(--color-surface,light-dark(#eef1f6,#0f1318));--vh-fg:var(--color-on-surface,light-dark(#12151a,#e8edf2));--vh-muted:var(--color-on-surface-variant,light-dark(#5c6570,#a8b0bc));--vh-primary:var(--color-primary,#007acc);--vh-danger:var(--color-error,#d32f2f);--vh-on-primary:var(--color-on-primary,#ffffff);--vh-item-bg:var(\n        --color-surface-container-low,light-dark(#e0e5ee,#0a0d12)\n    );--vh-item-border:color-mix(in oklab,var(--vh-fg) 10%,transparent);--vh-item-preview-bg:color-mix(in oklab,var(--vh-fg) 6%,var(--vh-item-bg));--vh-elev:0 1px 0 color-mix(in oklab,var(--vh-fg) 4%,transparent);background-color:var(--vh-bg);block-size:100%;color:var(--vh-fg);display:flex;flex-direction:column;padding:1.5rem}.view-history__header{align-items:center;display:flex;justify-content:space-between;margin-block-end:1.5rem}.view-history__header h1{color:var(--vh-fg);font-size:1.5rem;font-weight:700;margin:0}.view-history__clear-btn{align-items:center;background-color:color-mix(in oklab,var(--vh-danger) 12%,var(--vh-bg));border:1px solid color-mix(in oklab,var(--vh-danger) 45%,transparent);border-radius:6px;color:light-dark(#b71c1c,#ff8a80);cursor:pointer;display:flex;font-size:.8125rem;font-weight:600;gap:.5rem;padding:.5rem .85rem}.view-history__clear-btn:hover{background-color:color-mix(in oklab,var(--vh-danger) 22%,var(--vh-bg));border-color:var(--vh-danger)}.view-history__list{flex:1;overflow-y:auto}.view-history__empty{align-items:center;block-size:100%;color:var(--vh-muted);display:flex;flex-direction:column;gap:1rem;justify-content:center}.view-history__empty p{font-size:1rem;margin:0}.view-history__hint{color:var(--vh-muted);font-size:.8125rem;margin:0 0 1rem}.view-history__item{background-color:var(--vh-item-bg);border:1px solid var(--vh-item-border);border-inline-start:3px solid var(--vh-primary);border-radius:10px;box-shadow:var(--vh-elev);color:var(--vh-fg);margin-block-end:.75rem;padding:1rem;transition:opacity .2s ease,border-color .15s ease}.view-history__item.error,.view-history__item[data-status=error]{border-inline-start-color:var(--vh-danger)}.view-history__item.is-muted,.view-history__item[data-status=declined],.view-history__item[data-status=expired]{border-inline-start-color:color-mix(in oklab,var(--vh-muted) 70%,transparent);opacity:.55}.view-history__item-sub{color:var(--vh-muted);font-size:.75rem;margin:.25rem 0 0}.view-history__kind-chip{align-items:center;background:color-mix(in oklab,var(--vh-primary) 16%,var(--vh-item-bg));border:1px solid color-mix(in oklab,var(--vh-primary) 28%,transparent);border-radius:999px;color:light-dark(#0b5f8a,#9fd3f5);display:inline-flex;font-size:.7rem;font-weight:700;letter-spacing:.02em;padding:.12rem .45rem;text-transform:uppercase}.view-history__kind-chip[data-kind=clipboard-image]{background:color-mix(in oklab,#7b1fa2 14%,var(--vh-item-bg));border-color:color-mix(in oklab,#7b1fa2 35%,transparent);color:light-dark(#6a1b9a,#e1bee7)}.view-history__kind-chip[data-kind=files]{background:color-mix(in oklab,#2e7d32 14%,var(--vh-item-bg));border-color:color-mix(in oklab,#2e7d32 35%,transparent);color:light-dark(#1b5e20,#a5d6a7)}.view-history__item.is-image{border-inline-start-color:#9c27b0}.view-history__media{align-items:center;display:grid;gap:.85rem;grid-template-columns:5.5rem minmax(0,1fr);margin-block-start:.15rem}.view-history__thumb{background:color-mix(in oklab,var(--vh-fg) 6%,var(--vh-item-bg));block-size:5.5rem;border:1px solid color-mix(in oklab,var(--vh-fg) 12%,transparent);border-radius:10px;box-shadow:inset 0 0 0 1px color-mix(in oklab,#fff 6%,transparent);display:block;inline-size:5.5rem;object-fit:cover}.view-history__thumb--placeholder{background:linear-gradient(135deg,color-mix(in oklab,var(--vh-fg) 5%,var(--vh-item-bg)),color-mix(in oklab,var(--vh-fg) 10%,var(--vh-item-bg)));color:var(--vh-muted);display:grid;place-items:center}.view-history__media-meta{min-inline-size:0}.view-history__media-meta .view-history__item-desc{margin:0}@media (max-width:420px){.view-history__media{gap:.65rem;grid-template-columns:4.5rem minmax(0,1fr)}.view-history__thumb{block-size:4.5rem;inline-size:4.5rem}}.view-history__item-preview{background:var(--vh-item-preview-bg);border:1px solid color-mix(in oklab,var(--vh-fg) 8%,transparent);border-radius:6px;color:var(--vh-fg);font:.75rem/1.35 ui-monospace,monospace;margin:.5rem 0 0;max-block-size:6rem;overflow:auto;padding:.5rem;white-space:pre-wrap}.view-history__progress{display:flex;flex-direction:column;gap:.25rem;margin-block-start:.65rem}.view-history__progress progress{block-size:.45rem;inline-size:100%}.view-history__progress-meta{color:var(--vh-muted);font-size:.7rem}.view-history__item-header{align-items:center;display:flex;justify-content:space-between;margin-block-end:.5rem}.view-history__item-action{color:var(--vh-fg);font-size:.875rem;font-weight:600}.view-history__item-time{color:var(--vh-muted);font-size:.75rem}.view-history__item-desc{color:var(--vh-fg);font-size:.875rem;margin:0;opacity:.92}.view-history__item-error{color:light-dark(#b71c1c,#ff8a80);font-size:.8125rem;margin:.5rem 0 0}.view-history__item-actions{display:flex;flex-wrap:wrap;gap:.5rem;margin-block-start:.75rem}.view-history__action-btn{align-items:center;background-color:color-mix(in oklab,var(--vh-primary) 14%,var(--vh-item-bg));border:1px solid color-mix(in oklab,var(--vh-primary) 40%,transparent);border-radius:6px;box-shadow:0 1px 0 color-mix(in oklab,var(--vh-fg) 4%,transparent);color:light-dark(#0b5f8a,#7ec8f0);cursor:pointer;display:inline-flex;font-size:.8125rem;font-weight:600;gap:.375rem;justify-content:center;letter-spacing:.01em;min-block-size:2rem;padding:.4rem .85rem}.view-history__action-btn:hover{background-color:color-mix(in oklab,var(--vh-primary) 24%,var(--vh-item-bg));border-color:color-mix(in oklab,var(--vh-primary) 60%,transparent)}.view-history__action-btn:active{transform:translateY(1px)}.view-history__action-btn:disabled{cursor:default;opacity:.55;transform:none}.view-history__action-btn[data-action=accept],.view-history__action-btn[data-action=download],.view-history__action-btn[data-action=open],.view-history__action-btn[data-action=reveal]{background-color:var(--vh-primary);border-color:var(--vh-primary);color:var(--vh-on-primary)}.view-history__action-btn[data-action=accept]:hover,.view-history__action-btn[data-action=download]:hover,.view-history__action-btn[data-action=open]:hover,.view-history__action-btn[data-action=reveal]:hover{background-color:var(--vh-primary);filter:brightness(1.08)}.view-history__action-btn[data-action=cancel],.view-history__action-btn[data-action=decline],.view-history__action-btn[data-action=remove]{background-color:color-mix(in oklab,var(--vh-danger) 14%,var(--vh-item-bg));border-color:color-mix(in oklab,var(--vh-danger) 45%,transparent);color:light-dark(#b71c1c,#ff8a80)}.view-history__action-btn[data-action=cancel]:hover,.view-history__action-btn[data-action=decline]:hover,.view-history__action-btn[data-action=remove]:hover{background-color:color-mix(in oklab,var(--vh-danger) 24%,var(--vh-item-bg));border-color:var(--vh-danger)}.view-history__action-btn[data-action=dismiss]{background-color:color-mix(in oklab,var(--vh-fg) 8%,var(--vh-item-bg));border-color:color-mix(in oklab,var(--vh-fg) 18%,transparent);color:var(--vh-fg)}.view-history__action-btn[data-action=dismiss]:hover{background-color:color-mix(in oklab,var(--vh-fg) 14%,var(--vh-item-bg))}:is(.view-history__item.is-muted,.view-history__item[data-status=declined],.view-history__item[data-status=expired]) .view-history__action-btn{opacity:1}}";
//#endregion
//#region ../../modules/views/history-view/src/index.ts
var HistoryView = class {
	id = "history";
	name = "History";
	icon = "clock-counter-clockwise";
	options;
	shellContext;
	element = null;
	entries = [];
	unsub = null;
	_sheet = null;
	lifecycle = {
		onUnmount: () => {
			this.teardown();
		},
		onShow: () => {
			this._sheet ??= loadAsAdopted(history_default);
			this.ensureRuntime();
			this.bindStore();
			this.refreshFromStore();
		},
		onHide: () => {
			this.teardownSheet();
		}
	};
	constructor(options = {}) {
		this.options = options;
		this.shellContext = options.shellContext;
	}
	render(options) {
		if (options) {
			this.options = {
				...this.options,
				...options
			};
			this.shellContext = options.shellContext || this.shellContext;
		}
		this.ensureRuntime();
		this.bindStore();
		this.refreshFromStore();
		this.element = H`
            <div class="view-history" data-view="history">
                <div class="view-history__header">
                    <h1>History</h1>
                    <button class="view-history__clear-btn" data-action="clear" type="button">
                        <ui-icon icon="trash" icon-style="duotone"></ui-icon>
                        <span>Clear</span>
                    </button>
                </div>
                <p class="view-history__hint">
                    Clipboard &amp; file transfers — active, done, and expired (max 100).
                </p>
                <div class="view-history__list" data-history-list></div>
            </div>
        `;
		this.setupEventHandlers();
		this.updateList();
		return this.element;
	}
	getToolbar() {
		return null;
	}
	ensureRuntime() {
		const g = globalThis;
		if (g.__CWS_NEUTRALINO_BOOT__) startNeutralinoTransferHistory();
		if (g.Capacitor) startCapacitorTransferHistory();
		getTransferHistoryStore();
	}
	bindStore() {
		if (this.unsub) return;
		this.unsub = getTransferHistoryStore().subscribe((list) => {
			this.entries = list;
			this.updateList();
		});
	}
	refreshFromStore() {
		this.entries = getTransferHistoryStore().list();
	}
	teardown() {
		try {
			this.unsub?.();
		} catch {}
		this.unsub = null;
		this.teardownSheet();
		this.element = null;
	}
	teardownSheet() {
		try {
			if (this._sheet) removeAdopted(this._sheet);
		} catch {}
		this._sheet = null;
	}
	renderEntries() {
		const fragment = document.createDocumentFragment();
		if (this.entries.length === 0) {
			fragment.appendChild(H`
                <div class="view-history__empty">
                    <ui-icon icon="clock-counter-clockwise" icon-style="duotone" size="48"></ui-icon>
                    <p>No transfers yet</p>
                </div>
            `);
			return fragment;
		}
		for (const entry of this.entries) {
			const muted = isMutedHistoryStatus(entry.status, entry.kind) ? " is-muted" : "";
			const acts = actionsForEntry(entry);
			const showProgress = entry.kind === "files" && (entry.status === "progress" || typeof entry.bytesDone === "number" && typeof entry.totalBytes === "number" && (entry.totalBytes || 0) > 0 && entry.status !== "expired");
			const ratio = transferProgressRatio(entry);
			const pct = Math.round(ratio * 100);
			const speed = formatTransferSpeed(entry.speedBps);
			const kindLabel = entry.kind === "files" ? "Files" : entry.kind === "clipboard-image" ? "Image" : "Clipboard";
			const isImage = entry.kind === "clipboard-image";
			const thumbSrc = isImage ? historyImageSrc(entry) : "";
			const hasThumb = Boolean(thumbSrc);
			const sizeLabel = formatTransferBytes(entry.totalBytes);
			let actionsEl = "";
			if (acts.length > 0) {
				const wrap = document.createElement("div");
				wrap.className = "view-history__item-actions";
				for (const a of acts) {
					const btn = H`<button class="view-history__action-btn" type="button"
                        data-action="${a}" data-id="${entry.id}">
                        ${labelForAction(a, entry)}
                    </button>`;
					if (btn) wrap.appendChild(btn);
				}
				actionsEl = wrap;
			}
			const progressEl = showProgress ? H`
                <div class="view-history__progress">
                    <progress max="100" value="${pct}"></progress>
                    <span class="view-history__progress-meta">${pct}% · ${speed}${entry.etaMs != null && entry.etaMs > 0 ? ` · ~${Math.ceil(entry.etaMs / 1e3)}s` : ""}</span>
                </div>
            ` : "";
			const mediaEl = isImage ? H`
                <div class="view-history__media">
                    ${hasThumb ? H`<img class="view-history__thumb" src="${thumbSrc}" alt="" loading="lazy" decoding="async" />` : H`
                        <div class="view-history__thumb view-history__thumb--placeholder" aria-hidden="true">
                            <ui-icon icon="image" icon-style="duotone" size="28"></ui-icon>
                        </div>
                    `}
                    <div class="view-history__media-meta">
                        <p class="view-history__item-desc">${entry.title}</p>
                        ${entry.subtitle ? H`<p class="view-history__item-sub">${entry.subtitle}</p>` : sizeLabel ? H`<p class="view-history__item-sub">${sizeLabel}</p>` : ""}
                        ${!hasThumb ? H`<p class="view-history__item-sub">Preview unavailable — Accept uses retained file when present</p>` : ""}
                    </div>
                </div>
            ` : H`
                <p class="view-history__item-desc">${entry.title}</p>
                ${entry.subtitle ? H`<p class="view-history__item-sub">${entry.subtitle}</p>` : ""}
                ${entry.textPreview ? H`<pre class="view-history__item-preview">${entry.textPreview}</pre>` : ""}
            `;
			const item = H`
                <div class="view-history__item${muted}${isImage ? " is-image" : ""}" data-entry="${entry.id}" data-status="${entry.status}" data-kind="${entry.kind}">
                    <div class="view-history__item-header">
                        <span class="view-history__item-action">
                            <span class="view-history__kind-chip" data-kind="${entry.kind}">${kindLabel}</span>
                            · ${entry.direction} · ${entry.status}
                        </span>
                        <span class="view-history__item-time">${this.formatTime(entry.lastActionAt || entry.ts)}${entry.lastActionAt && entry.lastActionAt !== entry.ts ? ` · arrived ${this.formatTime(entry.ts)}` : ""}</span>
                    </div>
                    ${mediaEl}
                    ${progressEl}
                    ${entry.error ? H`<p class="view-history__item-error">${entry.error}</p>` : ""}
                    ${actionsEl}
                </div>
            `;
			fragment.appendChild(item);
		}
		return fragment;
	}
	setupEventHandlers() {
		if (!this.element) return;
		this.element.addEventListener("click", (e) => {
			this.onClick(e);
		});
	}
	async onClick(e) {
		const button = e.target.closest("[data-action]");
		if (!button) return;
		const action = button.dataset.action;
		const entryId = button.dataset.id;
		if (action === "clear") {
			getTransferHistoryStore().clear();
			this.shellContext?.showMessage?.("History cleared");
			return;
		}
		if (!action || !entryId) return;
		const entry = this.entries.find((x) => x.id === entryId);
		if (!entry) return;
		button.disabled = true;
		try {
			const ok = await dispatchHistoryAction(entry, action);
			this.shellContext?.showMessage?.(ok ? `${labelForAction(action)} OK` : "Action failed");
		} finally {
			button.disabled = false;
		}
	}
	updateList() {
		const list = this.element?.querySelector("[data-history-list]");
		if (!list) return;
		list.replaceChildren();
		list.appendChild(this.renderEntries());
	}
	formatTime(timestamp) {
		const date = new Date(timestamp);
		const now = /* @__PURE__ */ new Date();
		if (date.toDateString() === now.toDateString()) return date.toLocaleTimeString([], {
			hour: "2-digit",
			minute: "2-digit",
			second: "2-digit"
		});
		return date.toLocaleDateString([], {
			month: "short",
			day: "numeric"
		}) + " " + date.toLocaleTimeString([], {
			hour: "2-digit",
			minute: "2-digit"
		});
	}
	reloadHistory() {
		this.refreshFromStore();
		this.updateList();
	}
	invokeChannelApi(action, _payload) {
		if (action === HistoryChannelAction.Reload || action === HistoryChannelAction.Refresh) {
			this.reloadHistory();
			return true;
		}
	}
	canHandleMessage() {
		return false;
	}
	async handleMessage() {}
};
function labelForAction(a, entry) {
	const isImage = entry?.kind === "clipboard-image";
	switch (a) {
		case "accept": return "Accept";
		case "dismiss": return "Dismiss";
		case "decline": return "Decline";
		case "open": return "Open";
		case "download": return isImage ? "Save" : "Download";
		case "cancel": return "Cancel";
		case "reveal": return isImage ? "Show in folder" : "Open folder";
		case "share": return "Share again";
		case "remove": return "Remove";
		default: return String(a);
	}
}
function createView(options) {
	return new HistoryView(options);
}
var createHistoryView = createView;
//#endregion
export { HistoryView, createHistoryView, createView, createView as default };
