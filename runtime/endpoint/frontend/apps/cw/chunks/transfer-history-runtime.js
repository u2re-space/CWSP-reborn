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
	if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
	if (bytes < 1073741824) return `${(bytes / 1048576).toFixed(1)} MB`;
	return `${(bytes / 1073741824).toFixed(2)} GB`;
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
	/** Nested batch depth; notify only when depth returns to 0. */
	let suppressNotify = 0;
	let notifyPending = false;
	function notify() {
		if (suppressNotify > 0) {
			notifyPending = true;
			return;
		}
		notifyPending = false;
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
		batch(fn) {
			suppressNotify += 1;
			try {
				fn();
			} finally {
				suppressNotify -= 1;
				if (suppressNotify <= 0) {
					suppressNotify = 0;
					if (notifyPending) notify();
				}
			}
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
var NEU_POLL_MS = 2500;
/** Neu: tiny thumbs only — large data-URLs freeze Neutralino when stringified / painted. */
var THUMB_KEEP_MAX_NEU = 2048;
/** Cap: compact JPEG previews are OK in-memory / localStorage. */
var THUMB_KEEP_MAX_CAP = 65536;
var RETAINED_TEXT_KEEP_MAX = 8192;
var DEFAULT_CONTROL_PORT = 29110;
var DEFAULT_CONTROL_KEY = "cwsp-neutralino-local";
function isNeuRuntime() {
	const g = globalThis;
	return Boolean(g.__CWS_NEUTRALINO_BOOT__ || g.__CWS_WEBNATIVE_BOOT__);
}
function thumbKeepMax() {
	return isNeuRuntime() ? THUMB_KEEP_MAX_NEU : THUMB_KEEP_MAX_CAP;
}
var store = null;
var startedCap = false;
var startedNeu = false;
var neuPollTimer = null;
/** Last control port that answered GET /service/transfer-history. */
var neuWorkingPort = null;
/** WHY: boot starts Neu poll — keep it idle until History view is on screen. */
var historyUiActive = false;
var lastNeuWireSig = "";
var neuPollInFlight = false;
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
	if (inline.startsWith("data:image/")) {
		if (!isNeuRuntime() || inline.length <= THUMB_KEEP_MAX_NEU) return inline;
	}
	if (!isNeuRuntime()) return "";
	const auth = readAuth();
	if (!auth) return "";
	const id = encodeURIComponent(entry.id || entry.transferId || entry.contentKey || "");
	if (!id) return "";
	return `http://127.0.0.1:${auth.port}/service/transfer-history/preview?id=${id}&key=${encodeURIComponent(auth.key)}`;
}
var persistTimer = null;
function stripHeavyFields(entry) {
	const next = { ...entry };
	if (next.thumbDataUrl && next.thumbDataUrl.length > thumbKeepMax()) delete next.thumbDataUrl;
	if (next.retainedText && next.retainedText.length > RETAINED_TEXT_KEEP_MAX) next.retainedText = next.retainedText.slice(0, RETAINED_TEXT_KEEP_MAX);
	if (next.textPreview && next.textPreview.length > 2e3) next.textPreview = next.textPreview.slice(0, 2e3);
	return next;
}
function entriesForPersist(entries) {
	return entries.map((e) => stripHeavyFields(e));
}
function persist(s) {
	try {
		localStorage.setItem(STORAGE_KEY, serializeTransferHistory(entriesForPersist(s.list())));
	} catch {}
}
/** WHY: sync persist on every upsert froze the main thread when thumbs are large. */
function schedulePersist(s) {
	if (persistTimer != null) clearTimeout(persistTimer);
	persistTimer = setTimeout(() => {
		persistTimer = null;
		persist(s);
	}, 400);
}
function stopNeuPollTimer() {
	if (neuPollTimer != null) {
		clearInterval(neuPollTimer);
		neuPollTimer = null;
	}
}
function ensureNeuPollTimer() {
	if (neuPollTimer != null || !historyUiActive) return;
	neuPollTimer = setInterval(() => {
		pollNeuHistory();
	}, NEU_POLL_MS);
}
/**
* History view visibility — Neu poll is expensive (JSON + store + DOM).
* Call from HistoryView onShow / onHide.
* INVARIANT: when inactive, the interval is cleared (not merely skipped).
*/
function setTransferHistoryUiActive(active) {
	historyUiActive = Boolean(active);
	try {
		const g = globalThis;
		g.__CWSP_TRANSFER_HISTORY_UI_ACTIVE__ = historyUiActive;
	} catch {}
	if (!historyUiActive) {
		stopNeuPollTimer();
		return;
	}
	if (startedNeu) {
		ensureNeuPollTimer();
		pollNeuHistory();
	}
}
/** Cheap wire fingerprint so identical Neu snapshots skip store/DOM work. */
function neuWireSignature(entries) {
	let sig = String(entries.length);
	for (const raw of entries) {
		if (!raw || typeof raw !== "object") {
			sig += "|?";
			continue;
		}
		const e = raw;
		const thumbLen = typeof e.thumbDataUrl === "string" ? e.thumbDataUrl.length : 0;
		sig += `|${e.id || e.transferId}:${e.status}:${e.bytesDone ?? ""}:${e.speedBps ?? ""}:${e.lastActionAt ?? e.ts ?? ""}:${thumbLen}`;
	}
	return sig;
}
/** Singleton Transfer History store (local to this WebView). */
function getTransferHistoryStore() {
	if (store) return store;
	let initial = [];
	try {
		initial = parseTransferHistory(localStorage.getItem(STORAGE_KEY)).map(stripHeavyFields);
	} catch {
		initial = [];
	}
	store = createTransferHistoryStore({ initial });
	store.subscribe(() => {
		if (store) schedulePersist(store);
	});
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (raw && raw.length > 64e3) schedulePersist(store);
	} catch {}
	return store;
}
function upsertFromUnknown(raw) {
	if (!raw || typeof raw !== "object") return;
	const e = raw;
	if (typeof e.id !== "string" && typeof e.transferId !== "string") return;
	if (typeof e.kind !== "string" || typeof e.direction !== "string") return;
	if (typeof e.status !== "string" || typeof e.title !== "string") return;
	getTransferHistoryStore().upsert(stripHeavyFields({
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
	}));
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
	import("./cws-bridge.js").then((n) => n.n).then(async ({ CwsBridge }) => {
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
	if (!historyUiActive) return;
	if (neuPollInFlight) return;
	neuPollInFlight = true;
	try {
		await pollNeuHistoryInner();
	} finally {
		neuPollInFlight = false;
	}
}
async function pollNeuHistoryInner() {
	const candidates = controlPortCandidates();
	for (const auth of candidates) try {
		const res = await fetch(`http://127.0.0.1:${auth.port}/service/transfer-history`, {
			headers: { "x-api-key": auth.key },
			signal: typeof AbortSignal !== "undefined" && typeof AbortSignal.timeout === "function" ? AbortSignal.timeout(2e3) : void 0
		});
		if (!res.ok) continue;
		const data = await res.json();
		if (!Array.isArray(data.entries)) continue;
		const wireSig = neuWireSignature(data.entries);
		if (wireSig === lastNeuWireSig) return;
		lastNeuWireSig = wireSig;
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
		s.batch(() => {
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
		});
		return;
	} catch {}
}
/**
* Neu: arm Transfer History store. Polling starts only while History UI is active.
* WHY: boot-time setInterval + large JSON hard-froze Neutralino WebView.
*/
function startNeutralinoTransferHistory() {
	if (startedNeu) return;
	startedNeu = true;
	getTransferHistoryStore();
	if (historyUiActive) {
		ensureNeuPollTimer();
		pollNeuHistory();
	}
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
		const { invokeCwsNative } = await import("./cws-bridge.js").then((n) => n.n);
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
export { transferProgressRatio as a, dispatchHistoryAction, getTransferHistoryStore, historyImageSrc, isMutedHistoryStatus as i, formatTransferBytes as n, formatTransferSpeed as r, setTransferHistoryUiActive, startCapacitorTransferHistory, startNeutralinoTransferHistory, actionsForEntry as t };
