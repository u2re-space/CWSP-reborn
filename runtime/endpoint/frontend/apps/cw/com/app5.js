import { d as makeObjectAssignable, p as safe, s as observe, u as stringRef } from "../fest/object.js";
import { D as decodeDesktopState, E as JSOX, G as hasActiveCloseable, K as initBackNavigation, O as loadDesktopRaw, T as saveUIState, U as ClosePriority, W as closeHighestPriority, q as registerCloseable, w as makeUIState } from "./app2.js";
import { h as resolveEntryIcon, n as resolveFsBackend, r as subscribeFsBackendRegister } from "./app7.js";
import { t as closeUnifiedContextMenu } from "./app8.js";
//#region ../../modules/projects/fl.ui/src/ui/speed-dial/view-opener.ts
var VIEW_OPENER_BOOT = "__CWSP_SPEED_DIAL_VIEW_OPENER_V1__";
var bootSlot = (key) => {
	const g = globalThis;
	return {
		get: () => key in g ? g[key] : null,
		set: (v) => {
			g[key] = v;
		}
	};
};
var openerSlot = bootSlot(VIEW_OPENER_BOOT);
function getSpeedDialViewOpener() {
	const fn = openerSlot.get();
	return typeof fn === "function" ? fn : null;
}
//#endregion
//#region ../../modules/projects/fl.ui/src/ui/navigation/flyout/ChromeFlyout.ts
var openControllers = /* @__PURE__ */ new Map();
var dismissBound = false;
var onDocPointerDown = (ev) => {
	const t = ev.target;
	for (const [kind, ctrl] of [...openControllers.entries()]) {
		if (ctrl.contains(t)) continue;
		if (t?.closest?.("[data-chrome-flyout-anchor], .env-shell-taskbar__clock, .env-ui-statusbar__clock, .env-device-tray")) continue;
		closeChromeFlyout(kind);
	}
};
var onDocKeyDown = (ev) => {
	if (ev.key !== "Escape") return;
	closeAllChromeFlyouts();
};
var releaseDismissListenersIfIdle = () => {
	if (openControllers.size > 0) return;
	if (!dismissBound) return;
	dismissBound = false;
	document.removeEventListener("pointerdown", onDocPointerDown, true);
	document.removeEventListener("keydown", onDocKeyDown, true);
};
var closeChromeFlyout = (kind) => {
	const ctrl = openControllers.get(kind);
	if (!ctrl) return;
	openControllers.delete(kind);
	try {
		const el = ctrl.el;
		if (typeof el.close === "function") el.close();
		else {
			el.removeAttribute("open");
			el.hidden = true;
		}
		el.dispatchEvent(new CustomEvent("chrome-flyout-close", { bubbles: true }));
	} catch {}
	releaseDismissListenersIfIdle();
};
var closeAllChromeFlyouts = () => {
	for (const kind of [...openControllers.keys()]) closeChromeFlyout(kind);
};
var isChromeFlyoutOpen = (kind) => openControllers.has(kind);
//#endregion
//#region ../../modules/projects/fl.ui/src/ui/speed-dial/layout.ts
var DEFAULT_LAYOUT = [4, 8];
var clamp = (value, min, max) => {
	return Math.max(min, Math.min(max, value));
};
var positiveInteger = (value, fallback) => {
	const number = Number(value);
	return Number.isFinite(number) && number > 0 ? Math.max(1, Math.floor(number)) : fallback;
};
var normalizeLayout = (layout) => {
	return [positiveInteger(layout?.[0], DEFAULT_LAYOUT[0]), positiveInteger(layout?.[1], DEFAULT_LAYOUT[1])];
};
/**
* Normalize numeric orientation values without allowing invalid strings to
* silently select a different layout.
*/
var normalizeOrient = (value) => {
	if (typeof value === "string" && !/^-?\d+(?:\.\d+)?$/.test(value.trim())) return 0;
	const number = Number(value);
	if (!Number.isFinite(number)) return 0;
	return (Math.trunc(number) % 4 + 4) % 4;
};
/** Return the visible `[columns, rows]` for a logical grid and orientation. */
var visualLayout = (layout, orient) => {
	const [columns, rows] = normalizeLayout(layout);
	return normalizeOrient(orient) % 2 ? [rows, columns] : [columns, rows];
};
var clampVisualCell = (cell, layout, orient) => {
	const [columns, rows] = visualLayout(layout, orient);
	return [clamp(Math.floor(Number(cell?.[0]) || 0), 0, columns - 1), clamp(Math.floor(Number(cell?.[1]) || 0), 0, rows - 1)];
};
/** Convert visible CSS-grid coordinates back to persisted logical coordinates. */
var visualToLogicalCell = (cell, layout, orient) => {
	const [columns, rows] = normalizeLayout(layout);
	const normalizedOrient = normalizeOrient(orient);
	const [x, y] = clampVisualCell(cell, [columns, rows], normalizedOrient);
	switch (normalizedOrient) {
		case 1: return [columns - 1 - y, x];
		case 2: return [columns - 1 - x, rows - 1 - y];
		case 3: return [y, rows - 1 - x];
		default: return [x, y];
	}
};
/**
* Resolve a local point in the visible grid content box to a logical cell.
* The caller is responsible for subtracting CSS padding from the point and
* passing the content-box size.
*/
var pointToLogicalCell = (point, size, layout, orient, mode = "floor") => {
	const visible = visualLayout(layout, orient);
	const width = Math.max(1, Number(size?.[0]) || 1);
	const height = Math.max(1, Number(size?.[1]) || 1);
	const xRatio = clamp((Number(point?.[0]) || 0) / width, 0, 1);
	const yRatio = clamp((Number(point?.[1]) || 0) / height, 0, 1);
	const project = (ratio, count) => {
		const value = ratio * count;
		return mode === "round" ? Math.round(value - .5) : Math.floor(value);
	};
	return visualToLogicalCell([clamp(project(xRatio, visible[0]), 0, visible[0] - 1), clamp(project(yRatio, visible[1]), 0, visible[1] - 1)], layout, orient);
};
var cellKey = (cell) => `${cell[0]}:${cell[1]}`;
/** Clamp a logical cell to the supplied grid. */
var clampLogicalCell = (cell, layout) => {
	const [columns, rows] = normalizeLayout(layout);
	return [clamp(Math.floor(Number(cell?.[0]) || 0), 0, columns - 1), clamp(Math.floor(Number(cell?.[1]) || 0), 0, rows - 1)];
};
/**
* Choose the closest deterministic free cell without mutating the occupied
* set. The dragged item is excluded by the caller before invoking this helper.
*/
var findNearestFreeCell = (preferred, occupied, layout) => {
	const normalizedLayout = normalizeLayout(layout);
	const start = clampLogicalCell(preferred, normalizedLayout);
	if (!occupied.has(cellKey(start))) return start;
	const [columns, rows] = normalizedLayout;
	const maxRadius = Math.max(columns, rows);
	for (let radius = 1; radius <= maxRadius; radius += 1) for (let y = Math.max(0, start[1] - radius); y <= Math.min(rows - 1, start[1] + radius); y += 1) for (let x = Math.max(0, start[0] - radius); x <= Math.min(columns - 1, start[0] + radius); x += 1) {
		if (Math.abs(x - start[0]) !== radius && Math.abs(y - start[1]) !== radius) continue;
		const candidate = [x, y];
		if (!occupied.has(cellKey(candidate))) return candidate;
	}
	return start;
};
var readCell = (item) => [Math.floor(Number(item?.cell?.[0]) || 0), Math.floor(Number(item?.cell?.[1]) || 0)];
var writeCell = (item, cell) => {
	const prev = readCell(item);
	if (prev[0] === cell[0] && prev[1] === cell[1]) return false;
	if (!item.cell) return false;
	item.cell[0] = cell[0];
	item.cell[1] = cell[1];
	return true;
};
/**
* Keep tiles inside a new `[columns, rows]` without stacking everyone on the
* last track. In-bounds items keep their cells (collisions resolved); overflow
* items take the nearest free cell.
*/
var relocateItemsToLayout = (items, layout) => {
	const normalized = normalizeLayout(layout);
	const [columns, rows] = normalized;
	const inBounds = [];
	const overflow = [];
	for (const item of items) {
		if (!item?.cell) continue;
		const [x, y] = readCell(item);
		if (x >= 0 && x < columns && y >= 0 && y < rows) inBounds.push(item);
		else overflow.push(item);
	}
	const occupied = /* @__PURE__ */ new Set();
	let changed = false;
	const place = (item, preferred) => {
		const cell = findNearestFreeCell(preferred, occupied, normalized);
		occupied.add(cellKey(cell));
		if (writeCell(item, cell)) changed = true;
	};
	for (const item of inBounds) place(item, readCell(item));
	for (const item of overflow) place(item, clampLogicalCell(readCell(item), normalized));
	return changed;
};
//#endregion
//#region ../../modules/projects/fl.ui/src/ui/speed-dial/link-store.ts
/**
* Virtual directory holding curated speed-dial files. Matches the PathRouter
* `/user/` OpfsBackend root so Explorer can browse the same tree.
*/
var LINKS_DIR = "/user/links/";
/** Legacy aggregate file — still read on boot, then split into per-item JSON. */
var LINKS_JSON = "/user/links/links.json";
var META_JSON = "/user/links/meta.json";
var RESERVED_LINK_FILES = /* @__PURE__ */ new Set(["links.json", "meta.json"]);
/**
* Safe leaf name for a curated item. Ids are UUID / `shortcut-*` / `sd-*`;
* strip path separators so Explorer + OPFS can treat each tile as one file.
*/
function itemFileName(id) {
	return `${String(id || "").trim().replace(/[\\/:*?"<>|\s]+/g, "_").replace(/^\.+/, "_") || "item"}.json`;
}
function itemJsonPath(id) {
	return `${LINKS_DIR}${itemFileName(id)}`;
}
var isItemJsonPath = (path) => {
	const name = String(path || "").split("/").filter(Boolean).pop() || "";
	if (!name.endsWith(".json")) return false;
	return !RESERVED_LINK_FILES.has(name);
};
/**
* localStorage keys mirror `launcher-state.ts` so a one-time migration can copy
* the existing grid into OPFS without a schema change.
*/
var LS_ITEMS_KEY = "cw::workspace::speed-dial";
var LS_META_KEY = "cw::workspace::speed-dial::meta";
/**
* Marker written to LS after a successful migration so we never re-import and
* overwrite user edits. Kept in LS (not OPFS) so it survives OPFS wipe.
*/
var LS_MIGRATED_KEY = "cw::workspace::speed-dial::migrated-opfs-v1";
/**
* Accept JSOX (unquoted keys, what `launcher-state.ts` writes today) or JSON on read.
* WHY: `makeUIState` packs via `JSOX.stringify`; existing LS payloads are JSOX. OPFS
* files we write are JSON, so this stays forward-compatible too.
*/
var parseLoose = (raw) => {
	if (raw == null || !String(raw).trim()) return null;
	try {
		return JSON.parse(raw);
	} catch {
		try {
			return JSOX.parse(raw);
		} catch {
			return null;
		}
	}
};
/** Unwrap observe/stringRef proxies into plain values for OPFS serialization. */
var unwrapRef$1 = (value, fallback) => {
	if (value && typeof value === "object" && "value" in value) return String(value.value ?? fallback ?? "");
	return String(value ?? fallback ?? "");
};
/**
* Pack existing `SpeedDialPersistedItem`-shaped items (cell may be `[x,y]` or an
* observe proxy; meta may live on the item or in a side registry) into plain
* `LinkStoreItem` POJOs for OPFS.
*
* WHY: keeps the OPFS file free of reactive proxies (which break roundtrips and
* hand-editing) while preserving `href`/`path`/`iconAsset` for open-link/path tiles.
*/
function packLinksFromSpeedDial(items) {
	if (!Array.isArray(items)) return [];
	return items.map((entry) => {
		const cell = entry?.cell;
		const meta = entry?.meta && typeof entry.meta === "object" ? entry.meta : null;
		const item = {
			id: String(entry?.id || ""),
			label: unwrapRef$1(entry?.label, "Shortcut"),
			action: String(entry?.action || "open-view"),
			icon: unwrapRef$1(entry?.icon, "sparkle")
		};
		if (cell != null) item.cell = [Number(Array.isArray(cell) ? cell[0] : cell?.[0]) || 0, Number(Array.isArray(cell) ? cell[1] : cell?.[1]) || 0];
		const href = unwrapRef$1(meta?.href ?? entry?.href, "") || (meta?.href ?? entry?.href);
		if (href) item.href = String(href);
		const path = unwrapRef$1(meta?.path ?? entry?.path, "") || (meta?.path ?? entry?.path);
		if (path) item.path = String(path);
		const iconAsset = meta?.iconAsset ?? entry?.iconAsset;
		if (iconAsset) item.iconAsset = String(iconAsset);
		return item;
	});
}
var emptyMeta = () => ({
	version: 1,
	mirrorPath: null,
	items: {}
});
/**
* One-time migration of legacy localStorage speed-dial into OPFS.
*
* Returns:
* - `"migrated"` — LS had data and OPFS was empty; we copied it.
* - `"skipped"`  — OPFS already had curated item JSON (or legacy `links.json`);
*   we just ensure the LS marker so we never re-import even if LS still holds
*   the old payload.
* - `"already"`  — LS marker already set; nothing to do.
*
* WHY: idempotent — running twice never overwrites OPFS edits. We never delete LS
* (one-release backup window); we only set `LS_MIGRATED_KEY = "1"`.
*/
async function migrateLocalStorageToOpfsIfNeeded(io, ls) {
	const lsReader = toLsReader(ls);
	if (lsReader.getItem("cw::workspace::speed-dial::migrated-opfs-v1")) return "already";
	if (await hasCuratedOpfsData(io)) {
		safeSet(ls, LS_MIGRATED_KEY, "1");
		return "skipped";
	}
	const rawItems = lsReader.getItem(LS_ITEMS_KEY);
	const rawMeta = lsReader.getItem(LS_META_KEY);
	if (!rawItems && !rawMeta) {
		safeSet(ls, LS_MIGRATED_KEY, "1");
		return "skipped";
	}
	const items = normalizeLegacyItems(parseLoose(rawItems));
	await writeLinkStore(io, items, normalizeLegacyMeta(parseLoose(rawMeta), items));
	safeSet(ls, LS_MIGRATED_KEY, "1");
	return "migrated";
}
var toLsReader = (ls) => {
	if (ls instanceof Map) return {
		getItem(key) {
			return ls.has(key) ? ls.get(key) : null;
		},
		setItem(key, value) {
			ls.set(key, value);
		}
	};
	return ls;
};
var safeSet = (ls, key, value) => {
	try {
		if (ls instanceof Map) ls.set(key, value);
		else ls.setItem(key, value);
	} catch {}
};
var normalizeLegacyItems = (raw) => {
	if (!Array.isArray(raw)) return [];
	return raw.map((entry) => {
		const item = {
			id: String(entry?.id || ""),
			label: unwrapRef$1(entry?.label, "Shortcut"),
			action: String(entry?.action || "open-view"),
			icon: unwrapRef$1(entry?.icon, "sparkle")
		};
		if (entry?.href) item.href = String(entry.href);
		if (entry?.path) item.path = String(entry.path);
		if (entry?.iconAsset) item.iconAsset = String(entry.iconAsset);
		if (Array.isArray(entry?.cell)) item.cell = [Number(entry.cell[0]) || 0, Number(entry.cell[1]) || 0];
		return item;
	}).filter((item) => item.id);
};
var normalizeLegacyMeta = (raw, items) => {
	const meta = emptyMeta();
	const knownTopKeys = /* @__PURE__ */ new Set([
		"version",
		"mirrorPath",
		"grid",
		"items"
	]);
	if (raw && typeof raw === "object") {
		if (raw.mirrorPath != null) meta.mirrorPath = String(raw.mirrorPath);
		if (raw.grid != null) meta.grid = raw.grid;
		const itemsMap = raw.items;
		let entries;
		if (itemsMap instanceof Map) entries = Array.from(itemsMap.entries());
		else if (Array.isArray(itemsMap)) entries = itemsMap.map((e) => e && typeof e === "object" && "id" in e ? [e.id, e.meta || e] : null).filter((e) => e !== null);
		else if (itemsMap && typeof itemsMap === "object") entries = Object.entries(itemsMap);
		else entries = Object.entries(raw).filter(([k]) => !knownTopKeys.has(k));
		for (const [id, m] of entries) {
			if (!id || !m || typeof m !== "object") continue;
			const entry = { ...m };
			if (Array.isArray(m.cell)) entry.cell = [Number(m.cell[0]) || 0, Number(m.cell[1]) || 0];
			meta.items[String(id)] = entry;
		}
	}
	for (const item of items) {
		const slot = meta.items[item.id] || {};
		if (item.cell && !Array.isArray(slot.cell)) slot.cell = item.cell;
		meta.items[item.id] = slot;
	}
	return meta;
};
var listItemJsonPaths = async (io) => {
	if (typeof io.list !== "function") return [];
	try {
		return (await io.list("/user/links/") || []).filter(isItemJsonPath);
	} catch {
		return [];
	}
};
var hasCuratedOpfsData = async (io) => {
	if (await io.exists("/user/links/links.json")) return true;
	return (await listItemJsonPaths(io)).length > 0;
};
var parseItemFile = (raw, fallbackId) => {
	const parsed = parseLoose(raw);
	if (!parsed || Array.isArray(parsed) || typeof parsed !== "object") return null;
	const id = String(parsed.id || fallbackId || "").trim();
	if (!id) return null;
	const [item] = normalizeLegacyItems([{
		...parsed,
		id
	}]);
	return item || null;
};
/**
* Read curated items + meta from OPFS. Prefers per-item `/user/links/<id>.json`.
* Falls back to legacy `links.json` (array) when no item files exist.
* Returns `null` when neither is present (caller should fall back to defaults / LS).
* `meta.json` missing is non-fatal — we return an empty meta shell so callers can
* overlay cells later.
*/
async function readLinkStore(io) {
	const itemPaths = await listItemJsonPaths(io);
	let items = [];
	if (itemPaths.length) {
		const loaded = [];
		for (const path of itemPaths) {
			const item = parseItemFile(await io.readText(path), (path.split("/").filter(Boolean).pop() || "").replace(/\.json$/i, ""));
			if (item) loaded.push(item);
		}
		items = loaded;
	}
	if (!items.length) {
		const itemsRaw = await io.readText(LINKS_JSON);
		if (itemsRaw != null && String(itemsRaw).trim()) {
			const parsed = parseLoose(itemsRaw);
			if (Array.isArray(parsed)) items = normalizeLegacyItems(parsed);
		}
	}
	const metaParsed = parseLoose(await io.readText(META_JSON));
	if (!items.length) {
		const recovered = itemsFromMetaSlots(metaParsed);
		if (!recovered.length) return null;
		return {
			items: recovered,
			meta: normalizeLegacyMeta(metaParsed, recovered)
		};
	}
	const meta = normalizeLegacyMeta(metaParsed, items);
	return {
		items,
		meta
	};
}
var itemsFromMetaSlots = (raw) => {
	if (!raw || typeof raw !== "object") return [];
	const map = raw.items && typeof raw.items === "object" && !Array.isArray(raw.items) ? raw.items : raw;
	const knownTop = /* @__PURE__ */ new Set([
		"version",
		"mirrorPath",
		"grid",
		"items"
	]);
	const out = [];
	for (const [id, slot] of Object.entries(map || {})) {
		if (!id || knownTop.has(id) || id.startsWith("mirror:")) continue;
		if (!slot || typeof slot !== "object") continue;
		const rec = slot;
		const href = rec.href != null ? String(rec.href) : "";
		const view = rec.view != null ? String(rec.view) : "";
		const path = rec.path != null ? String(rec.path) : "";
		const action = String(rec.action || (href ? "open-link" : view || path ? "open-view" : "") || "");
		if (!action && !href && !view && !path) continue;
		const item = {
			id,
			label: String(rec.label || id),
			action: action || "open-view",
			icon: String(rec.icon || (href ? "link" : "sparkle"))
		};
		if (href) item.href = href;
		if (path) item.path = path;
		if (Array.isArray(rec.cell)) item.cell = [Number(rec.cell[0]) || 0, Number(rec.cell[1]) || 0];
		out.push(item);
	}
	return out;
};
/**
* Default column count for auto-placing mirror tiles below the curated grid.
* WHY: matches `gridLayoutState.columns` default (4). Auto-placement only kicks
* in when meta has no per-id `cell` override; an explicit override always wins.
*/
var MIRROR_AUTO_PLACE_COLUMNS = 4;
/**
* Build speed-dial display items from a PathRouter directory listing merged
* with per-id meta overrides (`cell`, `hidden`, `shape`, …).
*
* WHY: in mirror mode the speed-dial grid is driven by a virtual directory
* (OPFS folder or CRX `/bookmarks/…`) instead of curated `links.json`. The
* meta registry still holds per-id overrides so users can pin a mirror tile to
* a specific cell or hide it without mutating the source tree.
*
* INVARIANT: ids are `mirror:${path}` so they never collide with curated ids.
* Directories and `.md`/`.markdown`/`.txt`/image files map to `open-path`
* (Explorer / viewer). Entries carrying an `href` (e.g. Chrome bookmark URLs)
* map to `open-link`. Anything else falls back to `open-path` so the Explorer
* can decide how to render it.
*
* Task 3 fix — auto-placement: when meta has no `cell` override for a mirror
* item, the item is auto-placed on the next free cell below the curated grid's
* max Y (so mirror tiles never overlap curated tiles at `[0,0]` anymore).
* Meta `cell` overrides are always honored. `curatedItems` is optional; when
* omitted, `maxY` is treated as -1 so the first auto-placed tile lands at
* `[0,0]` (preserves the old default for callers that don't pass curated state).
*
* COMPAT: `meta.items[id].hidden === true` drops the entry.
*/
function buildMirrorSpeedDialItems(listing, meta, _mirrorPath, curatedItems) {
	if (!Array.isArray(listing)) return [];
	const metaItems = meta?.items || {};
	let maxCuratedY = -1;
	if (Array.isArray(curatedItems)) for (const entry of curatedItems) {
		const cell = entry?.cell;
		if (!Array.isArray(cell) || cell.length < 2) continue;
		const y = Number(cell[1]) || 0;
		if (y > maxCuratedY) maxCuratedY = y;
	}
	const startY = maxCuratedY + 1;
	const occupied = /* @__PURE__ */ new Set();
	if (Array.isArray(curatedItems)) for (const entry of curatedItems) {
		const cell = entry?.cell;
		if (!Array.isArray(cell) || cell.length < 2) continue;
		occupied.add(`${Number(cell[0]) || 0}:${Number(cell[1]) || 0}`);
	}
	const pending = [];
	for (const entry of listing) {
		if (!entry || !entry.name) continue;
		const path = String(entry.path || "");
		const id = `mirror:${path}`;
		const perId = metaItems[id] || {};
		if (perId.hidden === true) continue;
		const isDirectory = entry.kind === "directory" || path.endsWith("/");
		const href = entry.href ? String(entry.href) : "";
		const mimeType = String(entry.type || "").toLowerCase();
		const isMarkdown = /\.(md|markdown|txt)$/i.test(path) || mimeType.startsWith("text/");
		const isImage = /\.(png|jpe?g|gif|webp|svg|avif|bmp)$/i.test(path) || mimeType.startsWith("image/");
		let action;
		let icon;
		if (href) {
			action = "open-link";
			icon = "link";
		} else if (isDirectory) {
			action = "open-path";
			icon = "folder";
		} else if (isMarkdown) {
			action = "open-path";
			icon = "article";
		} else if (isImage) {
			action = "open-path";
			icon = "image";
		} else {
			action = "open-path";
			icon = "file-text";
		}
		const item = {
			id,
			label: String(entry.name),
			action,
			icon,
			cell: [0, 0]
		};
		if (path) item.path = path;
		if (href) {
			item.href = href;
			const fav = resolveEntryIcon(entry);
			if (fav) item.iconUrl = fav;
		}
		const hasOverride = Array.isArray(perId.cell);
		if (hasOverride) {
			const overrideCell = perId.cell;
			const x = Number(overrideCell[0]) || 0;
			const y = Number(overrideCell[1]) || 0;
			item.cell = [x, y];
			occupied.add(`${x}:${y}`);
		}
		pending.push({
			item,
			hasOverride
		});
	}
	let cursorX = 0;
	let cursorY = startY;
	const nextFreeCell = () => {
		for (;;) {
			const key = `${cursorX}:${cursorY}`;
			if (!occupied.has(key)) {
				occupied.add(key);
				return [cursorX, cursorY];
			}
			cursorX += 1;
			if (cursorX >= MIRROR_AUTO_PLACE_COLUMNS) {
				cursorX = 0;
				cursorY += 1;
			}
		}
	};
	const items = [];
	for (const { item, hasOverride } of pending) {
		if (!hasOverride) item.cell = nextFreeCell();
		items.push(item);
	}
	return items;
}
/**
* Write curated items + meta to OPFS as JSON. Each item is `/user/links/<id>.json`;
* `meta.json` holds grid overlays. Stale item files and legacy `links.json` are
* removed after a successful write so Explorer shows one file per tile.
*/
async function writeLinkStore(io, items, meta) {
	const list = Array.isArray(items) ? items.filter((item) => item?.id) : [];
	if (!list.length) {
		if (await hasCuratedOpfsData(io)) {
			console.warn("[link-store] skip empty write; keeping existing curated OPFS files");
			return;
		}
	}
	const keep = /* @__PURE__ */ new Set();
	for (const item of list) {
		const path = itemJsonPath(item.id);
		keep.add(path);
		await io.writeText(path, JSON.stringify(item, null, 2));
	}
	const metaFile = {
		version: 1,
		mirrorPath: meta?.mirrorPath ?? null,
		items: meta?.items ?? {},
		grid: meta?.grid
	};
	await io.writeText(META_JSON, JSON.stringify(metaFile, null, 2));
	const existing = await listItemJsonPaths(io);
	if (typeof io.remove === "function") {
		for (const path of existing) if (!keep.has(path)) try {
			await io.remove(path);
		} catch {}
		if (await io.exists("/user/links/links.json")) try {
			await io.remove(LINKS_JSON);
		} catch {}
	}
}
/**
* Browser-only OPFS IO helper. Walks/creates `/user/links/` via
* `navigator.storage.getDirectory()` and reads/writes leaf files.
*
* WHY: throws on failure — `launcher-state.ts` catches and falls back to LS with
* `console.warn("[link-store] OPFS unavailable; using localStorage")`.
*
* NOTE: virtual paths (`/user/links/<id>.json`) are mapped to OPFS by stripping
* the `/user/` prefix — the PathRouter `/user/` OpfsBackend uses the same root.
*/
async function createOpfsLinkStoreIo() {
	if (typeof navigator === "undefined" || !navigator.storage?.getDirectory) throw new Error("[link-store] OPFS not available");
	const root = await navigator.storage.getDirectory();
	const segmentsFor = (path) => {
		const vpath = String(path || "").replace(/^\/+/, "");
		if (vpath.startsWith("user/")) return vpath.slice(5).split("/").filter(Boolean);
		return vpath.split("/").filter(Boolean);
	};
	const resolveDir = async (dirPath, create) => {
		const segments = segmentsFor(dirPath);
		let dir = root;
		for (const seg of segments) dir = await dir.getDirectoryHandle(seg, { create });
		return dir;
	};
	const resolveHandle = async (path, create) => {
		const segments = segmentsFor(path);
		if (!segments.length) throw new Error(`[link-store] invalid path: ${path}`);
		let dir = root;
		for (let i = 0; i < segments.length - 1; i += 1) dir = await dir.getDirectoryHandle(segments[i], { create });
		return dir.getFileHandle(segments[segments.length - 1], { create });
	};
	const toVirtualPath = (dirPath, name) => {
		return `${String(dirPath || "/").replace(/\/+$/, "") || ""}/${name}`;
	};
	return {
		async readText(path) {
			try {
				return (await (await resolveHandle(path, false)).getFile()).text();
			} catch (e) {
				if (e?.name === "NotFoundError" || e?.name === "TypeMismatchError") return null;
				throw e;
			}
		},
		async writeText(path, text) {
			const writable = await (await resolveHandle(path, true)).createWritable();
			await writable.write(text);
			await writable.close();
		},
		async exists(path) {
			try {
				await resolveHandle(path, false);
				return true;
			} catch {
				return false;
			}
		},
		async list(dirPath) {
			try {
				const dir = await resolveDir(dirPath, false);
				const out = [];
				for await (const [name, handle] of dir.entries()) {
					if (handle?.kind === "directory") continue;
					out.push(toVirtualPath(dirPath, name));
				}
				return out;
			} catch (e) {
				if (e?.name === "NotFoundError") return [];
				throw e;
			}
		},
		async remove(path) {
			const segments = segmentsFor(path);
			if (segments.length < 1) return;
			let dir = root;
			for (let i = 0; i < segments.length - 1; i += 1) dir = await dir.getDirectoryHandle(segments[i], { create: false });
			await dir.removeEntry(segments[segments.length - 1]);
		}
	};
}
//#endregion
//#region ../../modules/projects/fl.ui/src/ui/speed-dial/launcher-state.ts
var viewEnabledCheck = null;
var isEnabledView = (view) => viewEnabledCheck ? viewEnabledCheck(String(view || "").trim()) : true;
var OPEN_LINK_TARGET_KEY = "rs-open-link-target";
var normalizeOpenLinkTarget = (raw) => {
	const v = String(raw || "").trim().toLowerCase();
	if (!v) return "inline";
	if (v === "inline" || v === "in-shell" || v === "env" || v === "shell") return "inline";
	if (v === "new-tab" || v === "newtab" || v === "tab" || v === "browser" || v === "browser-tab" || v === "external-tab") return "new-tab";
	if (v === "external-app" || v === "app" || v === "chooser" || v === "open-with" || v === "open-in-app" || v === "intent") return "external-app";
	if (v === "native-window" || v === "native" || v === "window" || v === "app-window") return "native-window";
	return "inline";
};
/** Global default (Settings / localStorage); per-tile meta.openLinkTarget wins. */
var getDefaultOpenLinkTarget = () => {
	try {
		const stored = localStorage.getItem(OPEN_LINK_TARGET_KEY);
		if (stored == null || !String(stored).trim()) return prefersExternalAppOpenLink() ? "external-app" : "inline";
		return normalizeOpenLinkTarget(stored);
	} catch {
		return prefersExternalAppOpenLink() ? "external-app" : "inline";
	}
};
/** Capacitor / coarse launcher — Open in app (chooser) beats inline iframe. */
var prefersExternalAppOpenLink = () => {
	try {
		const c = globalThis.Capacitor;
		if (typeof c?.isNativePlatform === "function" && c.isNativePlatform()) return true;
	} catch {}
	try {
		if (!(document.documentElement.dataset.cwspShellRole === "launcher" || globalThis.__RS_SHELL_ROLE__ === "launcher")) return false;
		return typeof matchMedia === "function" && matchMedia("(pointer: coarse)").matches;
	} catch {
		return false;
	}
};
var setDefaultOpenLinkTarget = (target) => {
	try {
		localStorage.setItem(OPEN_LINK_TARGET_KEY, normalizeOpenLinkTarget(target));
	} catch {}
};
[
	{
		view: "home",
		label: "Home",
		icon: "house-line"
	},
	{
		view: "network",
		label: "Network",
		icon: "wifi-high"
	},
	{
		view: "viewer",
		label: "Markdown",
		icon: "article"
	},
	{
		view: "explorer",
		label: "Explorer",
		icon: "books"
	},
	{
		view: "workcenter",
		label: "Work Center",
		icon: "briefcase"
	},
	{
		view: "history",
		label: "History",
		icon: "clock-counter-clockwise"
	},
	{
		view: "settings",
		label: "Settings",
		icon: "gear-six"
	},
	{
		view: "apps",
		label: "Apps",
		icon: "squares-four"
	}
].filter((shortcut) => isEnabledView(shortcut.view));
var STORAGE_KEY = "cw::workspace::speed-dial";
var META_STORAGE_KEY = `${STORAGE_KEY}::meta`;
var fallbackClone = (value) => {
	if (typeof structuredClone === "function") try {
		return structuredClone(safe(value));
	} catch {}
	try {
		return JSON.parse(JSON.stringify(safe(value)));
	} catch {
		return value;
	}
};
var generateItemId = () => {
	if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") return crypto.randomUUID();
	return `sd-${Date.now().toString(36)}-${Math.floor(Math.random() * 1e3)}`;
};
var EXTERNAL_SHORTCUTS = [];
var DEFAULT_SPEED_DIAL_DATA_ALL = [...EXTERNAL_SHORTCUTS];
/** Drop view shortcuts that this host build disabled (e.g. Network on CWSP-document). */
var isSpeedDialViewAllowed = (meta, id) => {
	if (id === "shortcut-network" && !isEnabledView("network")) return false;
	const view = String(meta?.view || "").trim();
	if (!view) return true;
	return isEnabledView(view);
};
var DEFAULT_SPEED_DIAL_DATA = DEFAULT_SPEED_DIAL_DATA_ALL.filter((entry) => isSpeedDialViewAllowed(entry.meta, entry.id));
var splitDefaultEntries = (entries) => {
	const records = [];
	const metaEntries = [];
	entries.forEach((entry) => {
		const { meta, ...record } = entry;
		records.push(record);
		const normalizedMeta = {
			action: entry.action,
			...meta || {}
		};
		metaEntries.push([entry.id, normalizedMeta]);
	});
	return {
		records,
		metaEntries
	};
};
var { records: DEFAULT_SPEED_DIAL_RECORDS, metaEntries: DEFAULT_META_ENTRIES } = splitDefaultEntries(DEFAULT_SPEED_DIAL_DATA);
var legacyMetaBuffer = [];
/** Ids historically injected onto the Speed Dial grid (now Core Rail only). */
var CORE_RAIL_GRID_IDS = /* @__PURE__ */ new Set([
	"shortcut-explorer",
	"shortcut-settings",
	"shortcut-viewer",
	"shortcut-markdown",
	"shortcut-apps",
	"apps",
	"explorer",
	"settings",
	"viewer",
	"markdown"
]);
var CORE_RAIL_GRID_VIEWS = /* @__PURE__ */ new Set([
	"apps",
	"explorer",
	"settings",
	"viewer",
	"markdown",
	"reader"
]);
var CORE_RAIL_GRID_LABELS = /* @__PURE__ */ new Set([
	"apps",
	"explorer",
	"settings",
	"markdown",
	"viewer"
]);
var unwrapPersistedLabel = (label) => {
	if (label && typeof label === "object" && "value" in label) return String(label.value || "").trim().toLowerCase();
	return String(label || "").trim().toLowerCase();
};
/**
* True when a curated / persisted tile belongs on the Core Rail only
* (Explorer / Settings / Markdown) — never on the freeform Speed Dial grid.
*/
var isCoreRailGridTile = (item, meta) => {
	if (!item?.id) return false;
	const id = String(item.id || "").trim().toLowerCase();
	if (CORE_RAIL_GRID_IDS.has(id)) return true;
	const action = String(meta?.action || item.action || "open-view").trim().toLowerCase();
	if (action && action !== "open-view") return false;
	const view = String(meta?.view || "").trim().toLowerCase();
	if (view && CORE_RAIL_GRID_VIEWS.has(view)) return true;
	const label = unwrapPersistedLabel(item.label);
	return Boolean(label) && CORE_RAIL_GRID_LABELS.has(label);
};
var isCoreRailPersistedEntry = (entry) => isCoreRailGridTile({
	id: entry.id,
	action: entry.action,
	label: entry.label
}, {
	action: entry.action,
	...entry.meta || {}
});
var ensureCell = (cell) => {
	if (cell && Array.isArray(cell) && cell.length >= 2) return observe([Number(cell[0]) || 0, Number(cell[1]) || 0]);
	return observe([0, 0]);
};
var createMetaState = (meta = {}) => {
	return makeObjectAssignable(observe({
		action: meta.action || "open-view",
		view: meta.view || "",
		href: meta.href || "",
		description: meta.description || "",
		entityType: meta.entityType || "",
		tags: Array.isArray(meta.tags) ? [...meta.tags] : [],
		...meta
	}));
};
var registryFromEntries = (entries) => {
	const registry = /* @__PURE__ */ new Map();
	for (const [id, meta] of entries) registry.set(id, createMetaState(meta));
	return registry;
};
var normalizeMetaEntries = (raw) => {
	if (!raw) return [];
	if (raw instanceof Map) return Array.from(raw.entries());
	if (Array.isArray(raw)) return raw.map((entry) => {
		if (entry && typeof entry === "object" && "id" in entry) return [entry.id, entry.meta || entry];
		return null;
	}).filter(Boolean);
	if (typeof raw === "object") return Object.entries(raw);
	return [];
};
var packMetaRegistry = (registry) => {
	const payload = {};
	registry?.forEach((meta, id) => {
		payload[id] = fallbackClone(meta ?? {});
	});
	return payload;
};
var createInitialMetaRegistry = () => registryFromEntries(DEFAULT_META_ENTRIES);
var unpackMetaRegistry = (raw) => {
	const entries = normalizeMetaEntries(raw);
	return registryFromEntries(entries.length ? entries : DEFAULT_META_ENTRIES);
};
var unwrapRef = (value, fallback) => {
	if (value && typeof value === "object" && "value" in value) return value.value ?? fallback;
	return value ?? fallback;
};
var serializeItemState = (item) => {
	return {
		id: item.id,
		cell: [Number(item.cell?.[0]) || 0, Number(item.cell?.[1]) || 0],
		icon: unwrapRef(item.icon, "sparkle"),
		label: unwrapRef(item.label, "Shortcut"),
		action: item.action
	};
};
var createStatefulItem = (config) => {
	return observe({
		id: config.id || generateItemId(),
		cell: observe(ensureCell(config.cell)),
		icon: stringRef(config.icon || "sparkle"),
		label: stringRef(config.label || "Shortcut"),
		action: config.action || "open-view"
	});
};
var createInitialState = () => observe(DEFAULT_SPEED_DIAL_RECORDS.map(createStatefulItem));
var unpackState = (raw) => {
	const records = (Array.isArray(raw) && raw.length ? raw : DEFAULT_SPEED_DIAL_DATA).filter((entry) => isSpeedDialViewAllowed(entry.meta, entry.id) && !isCoreRailPersistedEntry(entry)).map((entry) => {
		const { meta, ...record } = entry;
		if (meta) legacyMetaBuffer.push([entry.id, {
			action: entry.action,
			...meta
		}]);
		else legacyMetaBuffer.push([entry.id, { action: entry.action }]);
		return record;
	});
	return observe(records.map(createStatefulItem));
};
var packState = (collection) => collection.filter((item) => {
	try {
		return !isCoreRailGridTile(item, speedDialMeta?.get?.(item.id) ?? null);
	} catch {
		return !isCoreRailGridTile(item, null);
	}
}).map(serializeItemState);
/**
* WHY: Vite `preserveSymlinks` can load this file via fl.ui and home-view paths as
* two module graphs. Without a process singleton, idle-save from the stale copy
* overwrites user shortcuts with defaults after refresh.
*/
var SPEED_DIAL_ITEMS_BOOT = "__CWSP_SPEED_DIAL_ITEMS_V1__";
var SPEED_DIAL_META_BOOT = "__CWSP_SPEED_DIAL_META_V1__";
var bootSpeedDialMeta = () => {
	const g = globalThis;
	if (g[SPEED_DIAL_META_BOOT]) return g[SPEED_DIAL_META_BOOT];
	const state = makeUIState(META_STORAGE_KEY, createInitialMetaRegistry, unpackMetaRegistry, packMetaRegistry);
	g[SPEED_DIAL_META_BOOT] = state;
	return state;
};
var bootSpeedDialItems = () => {
	const g = globalThis;
	if (g[SPEED_DIAL_ITEMS_BOOT]) return g[SPEED_DIAL_ITEMS_BOOT];
	const state = makeUIState(STORAGE_KEY, createInitialState, unpackState, packState);
	g[SPEED_DIAL_ITEMS_BOOT] = state;
	return state;
};
var speedDialMeta = bootSpeedDialMeta();
var speedDialItems = bootSpeedDialItems();
var LINK_STORE_BOOT = "__CWSP_LINK_STORE_BOOT_V1__";
var linkStoreBoot = () => {
	const g = globalThis;
	if (!g[LINK_STORE_BOOT]) g[LINK_STORE_BOOT] = {
		opfsIo: null,
		opfsReady: null,
		opfsFlushTimer: null,
		opfsHydrated: false,
		userEditedBeforeHydrate: false,
		editGen: 0
	};
	return g[LINK_STORE_BOOT];
};
var MIRROR_PATH_LS_KEY = "cw::workspace::speed-dial::mirror-path";
var mirrorPathState = stringRef("");
var mirrorSpeedDialItems = observe([]);
function getSpeedDialMirrorPath() {
	const v = String(mirrorPathState.value || "").trim();
	return v ? v : null;
}
/**
* Rebuild `mirrorSpeedDialItems` from the current `mirrorPath` via PathRouter.
*
* WHY: SpeedDial calls this on mount and whenever the mirror path changes. If
* no backend is registered for the path (e.g. tests without OPFS/Chrome), we
* surface a soft warning and keep an empty listing so the grid stays usable.
*
* Task 3 fix: pass curated `speedDialItems` cells to `buildMirrorSpeedDialItems`
* so mirror tiles auto-place below the curated grid's max Y instead of
* stacking at `[0,0]`. Meta per-id `cell` overrides still win.
*/
async function refreshSpeedDialMirror() {
	const path = getSpeedDialMirrorPath();
	if (!path) {
		mirrorSpeedDialItems.splice(0, mirrorSpeedDialItems.length);
		return;
	}
	try {
		const backend = resolveFsBackend(path);
		if (!backend) {
			console.warn(`[link-store] no fs backend for mirror path: ${path}`);
			mirrorSpeedDialItems.splice(0, mirrorSpeedDialItems.length);
			return;
		}
		const items = buildMirrorSpeedDialItems(await backend.list(path), packMetaFileFromState(), path, (speedDialItems || []).map((item) => ({ cell: Array.isArray(item?.cell) ? item.cell : void 0 })));
		mirrorSpeedDialItems.splice(0, mirrorSpeedDialItems.length);
		for (const item of items) mirrorSpeedDialItems.push(item);
	} catch (e) {
		console.warn(`[link-store] mirror list failed for ${path}`, e);
		mirrorSpeedDialItems.splice(0, mirrorSpeedDialItems.length);
	}
}
if (typeof globalThis !== "undefined") subscribeFsBackendRegister((root) => {
	const path = getSpeedDialMirrorPath();
	if (!path) return;
	if (path === root || path.startsWith(root === "/" ? "/" : root)) refreshSpeedDialMirror();
});
/**
* WHY: always stamp dirty — even after hydrate flipped true mid-hydrate.
* Pin/Share can land between the dirty re-check and the `splice`. Dirty is on
* globalThis so dual Vite module graphs share the same signal.
*/
var markUserEditedBeforeHydrate = () => {
	const boot = linkStoreBoot();
	boot.userEditedBeforeHydrate = true;
	boot.editGen = (boot.editGen || 0) + 1;
};
var getLsLike = () => {
	try {
		if (typeof localStorage === "undefined") return null;
		return localStorage;
	} catch {
		return null;
	}
};
/**
* Pack the current in-memory state into a `LinkStoreMetaFile` for OPFS.
* WHY: cells live in `speedDialItems` (state) while href/view/shape live in
* `speedDialMeta` (registry); OPFS `meta.json` merges both per id.
*/
var packMetaFileFromState = () => {
	const perId = {};
	speedDialMeta?.forEach((meta, id) => {
		perId[id] = fallbackClone(meta ?? {});
	});
	(speedDialItems || []).forEach((item) => {
		const id = String(item?.id || "");
		if (!id) return;
		const cell = item?.cell;
		const x = Number(Array.isArray(cell) ? cell[0] : cell?.[0]) || 0;
		const y = Number(Array.isArray(cell) ? cell[1] : cell?.[1]) || 0;
		perId[id] = {
			...perId[id] || {},
			cell: [x, y]
		};
	});
	return {
		version: 1,
		mirrorPath: getSpeedDialMirrorPath(),
		items: perId
	};
};
var flushLinkStoreToOpfs = async () => {
	const boot = linkStoreBoot();
	if (!boot.opfsIo) return;
	try {
		await boot.opfsReady;
	} catch {
		return;
	}
	if (!boot.opfsIo) return;
	try {
		const items = packLinksFromSpeedDial(speedDialItems);
		for (const item of items) {
			const meta = speedDialMeta?.get?.(item.id);
			if (!meta) continue;
			if (!item.href && meta.href) item.href = String(meta.href);
			if (!item.path && meta.path) item.path = String(meta.path);
			if (!item.action && meta.action) item.action = String(meta.action);
		}
		const meta = packMetaFileFromState();
		await writeLinkStore(boot.opfsIo, items, meta);
	} catch (e) {
		console.warn("[link-store] OPFS write failed; localStorage remains primary", e);
	}
};
var scheduleOpfsFlush = () => {
	const boot = linkStoreBoot();
	if (boot.opfsFlushTimer) clearTimeout(boot.opfsFlushTimer);
	boot.opfsFlushTimer = setTimeout(() => {
		boot.opfsFlushTimer = null;
		flushLinkStoreToOpfs();
	}, 150);
};
/**
* Hydrate the in-memory state from OPFS after migration. Only runs when no
* user edit has fired yet (module-load race window) and OPFS has data.
*
* WHY: if `persistSpeedDialItems` / `persistSpeedDialMeta` already ran before
* hydrate completed, the in-memory state is newer than the just-migrated OPFS
* snapshot. Splicing OPFS back in would clobber the edit, so we mark hydrated
* and bail — the pending OPFS flush (awaiting `opfsReady`) will persist the
* newer state instead.
*/
var hydrateFromOpfs = async (io) => {
	const boot = linkStoreBoot();
	if (boot.opfsHydrated) return;
	if (boot.userEditedBeforeHydrate) {
		boot.opfsHydrated = true;
		return;
	}
	const editGenAtStart = boot.editGen || 0;
	try {
		const got = await readLinkStore(io);
		if (!got || !got.items.length) {
			boot.opfsHydrated = true;
			return;
		}
		if (boot.userEditedBeforeHydrate || boot.editGen !== editGenAtStart) {
			boot.opfsHydrated = true;
			return;
		}
		const nextItems = [];
		const nextMeta = /* @__PURE__ */ new Map();
		for (const raw of got.items) {
			const metaEntry = got.meta.items[raw.id] || {};
			const cell = Array.isArray(metaEntry.cell) ? [metaEntry.cell[0], metaEntry.cell[1]] : Array.isArray(raw.cell) ? [raw.cell[0], raw.cell[1]] : [0, 0];
			const item = createStatefulItem({
				id: raw.id,
				cell: observe([Number(cell[0]) || 0, Number(cell[1]) || 0]),
				icon: raw.icon || "sparkle",
				label: raw.label || "Shortcut",
				action: raw.action || "open-view"
			});
			const meta = {
				action: raw.action || "open-view",
				...metaEntry,
				...raw.href ? { href: raw.href } : {},
				...raw.path ? { path: raw.path } : {}
			};
			if (isCoreRailGridTile(item, meta)) continue;
			nextItems.push(observe(item));
			nextMeta.set(item.id, meta);
		}
		if (!nextItems.length) {
			boot.opfsHydrated = true;
			stripCoreRailTilesFromGrid({ markDirty: true });
			return;
		}
		if (boot.userEditedBeforeHydrate || boot.editGen !== editGenAtStart) {
			boot.opfsHydrated = true;
			return;
		}
		boot.opfsHydrated = true;
		speedDialItems.splice(0, speedDialItems.length, ...nextItems);
		speedDialMeta.clear();
		if (got.meta.mirrorPath != null) mirrorPathState.value = String(got.meta.mirrorPath || "");
		for (const [id, meta] of nextMeta) ensureSpeedDialMeta(id, meta);
		stripCoreRailTilesFromGrid({ markDirty: true });
	} catch (e) {
		console.warn("[link-store] OPFS hydration failed; using localStorage boot state", e);
		linkStoreBoot().opfsHydrated = true;
		stripCoreRailTilesFromGrid({ markDirty: true });
	}
};
var initLinkStore = () => {
	const boot = linkStoreBoot();
	if (boot.opfsReady) return boot.opfsReady;
	boot.opfsReady = (async () => {
		const ls = getLsLike();
		try {
			boot.opfsIo = await createOpfsLinkStoreIo();
		} catch (e) {
			console.warn("[link-store] OPFS unavailable; using localStorage", e);
			boot.opfsIo = null;
			boot.opfsHydrated = true;
			return;
		}
		if (!boot.opfsIo) return;
		try {
			if (ls) await migrateLocalStorageToOpfsIfNeeded(boot.opfsIo, ls);
			await hydrateFromOpfs(boot.opfsIo);
			stripCoreRailTilesFromGrid({ markDirty: true });
			if (boot.userEditedBeforeHydrate) await flushLinkStoreToOpfs();
		} catch (e) {
			console.warn("[link-store] OPFS init failed; using localStorage boot state", e);
			boot.opfsHydrated = true;
		}
	})();
	return boot.opfsReady;
};
if (typeof globalThis !== "undefined") {
	try {
		if (typeof localStorage !== "undefined") {
			const lsMirror = localStorage.getItem(MIRROR_PATH_LS_KEY);
			if (lsMirror && !mirrorPathState.value) mirrorPathState.value = lsMirror;
		}
	} catch {}
	initLinkStore().then(() => {
		refreshSpeedDialMirror();
	});
}
var persistSpeedDialItems = () => {
	scheduleOpfsFlush();
	try {
		saveUIState(STORAGE_KEY);
		return;
	} catch {}
	try {
		if (typeof localStorage === "undefined") return;
		localStorage.setItem(STORAGE_KEY, JSOX.stringify(packState(speedDialItems)));
	} catch {}
};
var persistSpeedDialMeta = () => {
	scheduleOpfsFlush();
	try {
		saveUIState(META_STORAGE_KEY);
		return;
	} catch {}
	try {
		if (typeof localStorage === "undefined") return;
		localStorage.setItem(META_STORAGE_KEY, JSOX.stringify(packMetaRegistry(speedDialMeta)));
	} catch {}
};
var captureSpeedDialSnapshot = () => {
	return { items: (speedDialItems || []).map((item) => {
		const packed = serializeItemState(item);
		const meta = getSpeedDialMeta(item.id);
		return {
			...packed,
			...meta ? { meta: fallbackClone(meta) } : {}
		};
	}) };
};
var applySpeedDialSnapshot = (snapshot) => {
	markUserEditedBeforeHydrate();
	const rows = Array.isArray(snapshot?.items) ? snapshot.items : [];
	const nextItems = [];
	const keepIds = /* @__PURE__ */ new Set();
	for (const raw of rows) {
		if (!raw?.id) continue;
		keepIds.add(String(raw.id));
		const item = createStatefulItem({
			id: raw.id,
			cell: observe([Number(raw.cell?.[0]) || 0, Number(raw.cell?.[1]) || 0]),
			icon: raw.icon || "sparkle",
			label: raw.label || "Shortcut",
			action: raw.action || "open-link"
		});
		nextItems.push(observe(item));
	}
	speedDialItems.splice(0, speedDialItems.length, ...nextItems);
	const stale = [...speedDialMeta?.keys?.() || []].filter((id) => !keepIds.has(String(id)));
	for (const id of stale) removeSpeedDialMeta(id);
	for (const raw of rows) {
		if (!raw?.id) continue;
		ensureSpeedDialMeta(raw.id, {
			action: raw.action,
			...raw.meta || {}
		});
	}
	persistSpeedDialItems();
	persistSpeedDialMeta();
};
var getSpeedDialMeta = (id) => {
	if (!id) return null;
	return speedDialMeta?.get?.(id) ?? null;
};
var ensureSpeedDialMeta = (id, defaults = {}) => {
	let meta = speedDialMeta?.get?.(id);
	if (!meta) {
		meta = createMetaState(defaults);
		speedDialMeta?.set?.(id, meta);
		persistSpeedDialMeta();
		return meta;
	}
	let changed = false;
	for (const [key, value] of Object.entries(defaults)) {
		if (value == null || value === "") continue;
		if (meta[key] !== value) {
			meta[key] = value;
			changed = true;
		}
	}
	if (changed) persistSpeedDialMeta();
	return meta;
};
var removeSpeedDialMeta = (id) => {
	const removed = speedDialMeta?.delete?.(id);
	if (removed) persistSpeedDialMeta();
	return removed;
};
var syncMetaActionFromItem = (item) => {
	if (!item) return false;
	const desiredAction = item.action || "open-view";
	const meta = ensureSpeedDialMeta(item.id, { action: desiredAction });
	if (meta.action !== desiredAction) {
		meta.action = desiredAction;
		return true;
	}
	return false;
};
var syncMetaActionsForAllItems = () => {
	let changed = false;
	speedDialItems?.forEach?.((item) => {
		if (syncMetaActionFromItem(item)) changed = true;
	});
	if (changed) persistSpeedDialMeta();
};
var flushLegacyMetaBuffer = () => {
	if (!legacyMetaBuffer.length) return;
	legacyMetaBuffer.forEach(([id, meta]) => {
		const target = ensureSpeedDialMeta(id, meta);
		Object.assign(target, meta);
	});
	legacyMetaBuffer.length = 0;
	persistSpeedDialMeta();
};
flushLegacyMetaBuffer();
syncMetaActionsForAllItems();
var ensureExternalShortcuts = () => {
	let changed = false;
	EXTERNAL_SHORTCUTS.forEach((shortcut) => {
		if (!speedDialItems?.find?.((item) => item?.id === shortcut.id)) {
			const item = createStatefulItem(shortcut);
			if (shortcut.label && item.label && typeof item.label === "object" && "value" in item.label) item.label.value = shortcut.label;
			if (shortcut.icon && item.icon && typeof item.icon === "object" && "value" in item.icon) item.icon.value = shortcut.icon;
			speedDialItems.push(observe(item));
			ensureSpeedDialMeta(item.id, shortcut.meta);
			changed = true;
		} else {
			const currentMeta = getSpeedDialMeta(shortcut.id);
			if (shortcut.meta && currentMeta) {
				const nextHref = String(shortcut.meta.href ?? "");
				if (nextHref !== String(currentMeta.href ?? "")) {
					currentMeta.href = nextHref;
					changed = true;
				}
				const nextDesc = String(shortcut.meta.description ?? "");
				if (nextDesc !== String(currentMeta.description ?? "")) {
					currentMeta.description = nextDesc;
					changed = true;
				}
			} else if (shortcut.meta && !currentMeta) {
				ensureSpeedDialMeta(shortcut.id, shortcut.meta);
				changed = true;
			}
		}
	});
	if (changed) {
		persistSpeedDialItems();
		persistSpeedDialMeta();
	}
};
ensureExternalShortcuts();
/**
* WHY: Explorer / Settings / Markdown live on the Core Rail only.
* Strip them from the curated grid and persist — including after OPFS hydrate,
* which otherwise re-injects the legacy OPFS snapshot.
*/
var stripCoreRailTilesFromGrid = (opts) => {
	try {
		let changed = false;
		const matches = (speedDialItems || []).filter((item) => isCoreRailGridTile(item, getSpeedDialMeta(item?.id)));
		for (const item of matches) {
			const idx = speedDialItems.findIndex((it) => it?.id === item.id);
			if (idx >= 0) {
				speedDialItems.splice(idx, 1);
				removeSpeedDialMeta(item.id);
				changed = true;
			}
		}
		if (changed) {
			if (opts?.markDirty !== false) markUserEditedBeforeHydrate();
			persistSpeedDialItems();
			persistSpeedDialMeta();
		}
		return changed;
	} catch (e) {
		console.warn("[speed-dial] core rail strip failed", e);
		return false;
	}
};
/** Boot: remove legacy Core Rail tiles from LS-backed grid before/around hydrate. */
var ensureCoreViewShortcuts = () => {
	stripCoreRailTilesFromGrid({ markDirty: true });
};
ensureCoreViewShortcuts();
try {
	if (typeof chrome !== "undefined" && !!chrome?.storage?.local) {
		const rewrite = () => {
			stripCoreRailTilesFromGrid({ markDirty: true });
			persistSpeedDialItems();
			persistSpeedDialMeta();
		};
		queueMicrotask(rewrite);
		setTimeout(rewrite, 0);
		setTimeout(rewrite, 300);
		setTimeout(rewrite, 1200);
	}
} catch {}
/**
* WHY: Past merges left both legacy `settings` and `shortcut-settings` (same view) on disk.
* Keep the preferred default id when present; otherwise keep the first match.
*/
var dedupeCoreOpenViewTiles = () => {
	let changed = false;
	const core = DEFAULT_SPEED_DIAL_DATA_ALL.filter((entry) => entry.action === "open-view" && isSpeedDialViewAllowed(entry.meta, entry.id));
	const getItemLabel = (item) => {
		const raw = item?.label;
		if (raw && typeof raw === "object" && "value" in raw) return String(raw.value || "").trim().toLowerCase();
		return String(raw || "").trim().toLowerCase();
	};
	for (const shortcut of core) {
		const view = String(shortcut.meta?.view || "").trim().toLowerCase();
		const label = String(shortcut.label || "").trim().toLowerCase();
		if (!view && !label) continue;
		const matches = (speedDialItems || []).filter((item) => {
			const metaView = String(getSpeedDialMeta(item.id)?.view || "").trim().toLowerCase();
			if (String(getSpeedDialMeta(item.id)?.action || item?.action || "open-view").toLowerCase() !== "open-view") return false;
			if (view && metaView === view) return true;
			return Boolean(label) && getItemLabel(item) === label;
		});
		if (matches.length <= 1) continue;
		const keep = matches.find((item) => item.id === shortcut.id) || matches[0];
		for (const item of matches) {
			if (item === keep) continue;
			const idx = speedDialItems.findIndex((row) => row?.id === item.id);
			if (idx >= 0) {
				speedDialItems.splice(idx, 1);
				changed = true;
			}
		}
	}
	if (changed) {
		persistSpeedDialItems();
		persistSpeedDialMeta();
	}
};
dedupeCoreOpenViewTiles();
var addSpeedDialItem = (item) => {
	markUserEditedBeforeHydrate();
	speedDialItems?.push?.(observe(item));
	syncMetaActionFromItem(item);
	persistSpeedDialItems();
	persistSpeedDialMeta();
	return item;
};
/** JSON drag envelope for AppMenu → SpeedDial (launcher design spec). */
function buildLauncherAppDragEnvelope(app) {
	return JSON.stringify({
		state: {
			icon: "device-mobile",
			label: app.label
		},
		desc: {
			action: "launch-app",
			meta: {
				packageName: app.packageName,
				componentName: app.componentName,
				entityType: "android-app",
				iconCacheKey: app.iconCacheKey || app.packageName
			}
		}
	});
}
/** First unoccupied logical cell on the current grid. */
function findNextFreeSpeedDialCell() {
	const columns = Math.max(1, Math.min(16, Number(gridLayoutState?.columns) || 4));
	const rows = Math.max(1, Math.min(16, Number(gridLayoutState?.rows) || 8));
	const occupied = new Set((speedDialItems || []).map((item) => `${Number(item?.cell?.[0]) || 0}:${Number(item?.cell?.[1]) || 0}`));
	for (let y = 0; y < rows; y += 1) for (let x = 0; x < columns; x += 1) {
		const key = `${x}:${y}`;
		if (!occupied.has(key)) return [x, y];
	}
	return [0, 0];
}
var querySpeedDialGridElement = () => document.querySelector("#home .speed-dial-grid[data-grid-layer=\"icons\"]") || document.querySelector("#home .speed-dial-grid:last-of-type") || document.querySelector("#home .speed-dial-grid");
var readSpeedDialGridLayout = () => [Math.max(1, Math.min(16, Number(gridLayoutState?.columns) || 4)), Math.max(1, Math.min(16, Number(gridLayoutState?.rows) || 8))];
/** Map viewport coordinates to a logical SpeedDial cell (null when grid is absent). */
function resolveSpeedDialCellFromClientPoint(clientX, clientY) {
	const grid = querySpeedDialGridElement();
	if (!grid) return null;
	const rect = grid.getBoundingClientRect();
	const styles = getComputedStyle(grid);
	const paddingLeft = Number.parseFloat(styles.paddingLeft) || 0;
	const paddingRight = Number.parseFloat(styles.paddingRight) || 0;
	const paddingTop = Number.parseFloat(styles.paddingTop) || 0;
	const paddingBottom = Number.parseFloat(styles.paddingBottom) || 0;
	const size = [Math.max(1, rect.width - paddingLeft - paddingRight), Math.max(1, rect.height - paddingTop - paddingBottom)];
	const point = [clientX - rect.left - paddingLeft, clientY - rect.top - paddingTop];
	const root = grid.closest(".speed-dial-root") || document.getElementById("home");
	const orientRaw = root?.getAttribute?.("data-orient") ?? root?.dataset?.orient ?? "0";
	return pointToLogicalCell(point, size, readSpeedDialGridLayout(), normalizeOrient(orientRaw));
}
function isClientPointOverSpeedDial(clientX, clientY) {
	return !!document.elementFromPoint(clientX, clientY)?.closest?.("#home, .speed-dial-root");
}
/** Create a persisted `launch-app` tile from an AppMenu entry. */
function pinLauncherAppEntry(app, cell) {
	const targetCell = cell ?? findNextFreeSpeedDialCell();
	const item = parseSpeedDialItemFromJSON(buildLauncherAppDragEnvelope(app), targetCell);
	if (!item) return null;
	addSpeedDialItem(item);
	return item;
}
makeUIState("cw::workspace::wallpaper", () => observe({
	src: "/assets/wallpaper.jpg",
	opacity: 1,
	blur: 0
}), (raw) => observe(raw || {
	src: "/assets/wallpaper.jpg",
	opacity: 1,
	blur: 0
}), (state) => ({ ...state }));
var ICON_SCALE_VALUES = {
	compact: "0.78",
	fit: "1",
	fill: "1.28",
	zoom: "1.5",
	max: "1.75"
};
var ICON_BITMAP_SCALE_OPTIONS = [
	{
		value: "auto",
		label: "Auto (workspace default)"
	},
	{
		value: "compact",
		label: "Compact (0.78)"
	},
	{
		value: "fit",
		label: "Fit (1.0 — no zoom)"
	},
	{
		value: "fill",
		label: "Fill (1.28 — adaptive)"
	},
	{
		value: "zoom",
		label: "Zoom (1.5)"
	},
	{
		value: "max",
		label: "Max (1.75)"
	}
];
function normalizeIconBitmapScale(raw, fallback = "fill") {
	const v = String(raw || "").trim().toLowerCase();
	if (v === "compact" || v === "small" || v === "0.78") return "compact";
	if (v === "fit" || v === "1" || v === "contain") return "fit";
	if (v === "fill" || v === "adaptive" || v === "1.28") return "fill";
	if (v === "zoom" || v === "1.5") return "zoom";
	if (v === "max" || v === "large" || v === "1.75") return "max";
	return fallback;
}
/** Empty / auto → inherit workspace; otherwise a concrete scale. */
function normalizeItemIconBitmapScale(raw) {
	const v = String(raw || "").trim().toLowerCase();
	if (!v || v === "auto" || v === "default" || v === "inherit") return "auto";
	return normalizeIconBitmapScale(v, "fill");
}
function iconBitmapScaleCss(raw) {
	return ICON_SCALE_VALUES[normalizeIconBitmapScale(raw)];
}
/** Resolve item (`auto`) → concrete workspace/id scale factor string. */
function resolveIconScaleFactor(rawItemScale) {
	const item = normalizeItemIconBitmapScale(rawItemScale);
	return ICON_SCALE_VALUES[item === "auto" ? normalizeIconBitmapScale(gridLayoutState?.iconScale, "fill") : item];
}
/**
* Set scale CSS vars on the plate AND inline `transform` on painted icon nodes.
* WHY: Cap WebView often ignores `transform: scale(var(--x))` — inline scale is reliable.
*/
function applyItemIconScaleToElement(el, raw) {
	if (!el) return;
	const item = normalizeItemIconBitmapScale(raw);
	const factor = resolveIconScaleFactor(raw);
	el.dataset.iconScale = item === "auto" ? "auto" : item;
	el.style.setProperty("--sd-item-icon-scale", factor);
	el.style.setProperty("--sd-item-pack-icon-scale", factor);
}
/** Inline transform on current icon children (call again after replacing img/ui-icon). */
function applyIconScaleToPaintedNodes(el, factor) {
	if (!el) return;
	const t = `scale(${String(factor || el.style.getPropertyValue("--sd-item-icon-scale") || "").trim() || "1.28"})`;
	el.querySelectorAll("img.ui-ws-item-icon-img, img[data-launcher-icon], img[data-bookmark-favicon], ui-icon, .ui-ws-item-icon-mask").forEach((node) => {
		node.style.setProperty("transform", t, "important");
		node.style.setProperty("transform-origin", "center center", "important");
	});
}
/**
* Native decode size so CSS zoom (scale × DPR) does not upscale a tiny bitmap.
* WHY: tiles used to always fetch 96px then scale(1.5–1.75) → pixelation on retina.
*/
function tileIconFetchSize(rawItemScale, layoutCssPx = 96) {
	const factor = Number(resolveIconScaleFactor(rawItemScale)) || 1.28;
	let dpr = 1;
	try {
		dpr = Math.min(3, Math.max(1, Number(globalThis.devicePixelRatio) || 1));
	} catch {
		dpr = 1;
	}
	const base = Math.max(64, Math.round(Number(layoutCssPx) || 96));
	return Math.max(128, Math.min(512, Math.round(base * factor * dpr)));
}
var GRID_LAYOUT_KEY = "cw::workspace::grid-layout";
var WORKSPACE_GRID_EVENT = "cwsp:workspace-grid";
var TILE_SHAPES = /* @__PURE__ */ new Set([
	"square",
	"squircle",
	"circle",
	"rounded",
	"hexagon",
	"diamond",
	"wavy"
]);
var normalizeTileShape = (raw, fallback = "squircle") => {
	const v = String(raw || "").trim().toLowerCase();
	return TILE_SHAPES.has(v) ? v : fallback;
};
var gridLayoutState = makeUIState(GRID_LAYOUT_KEY, () => observe({
	columns: 4,
	rows: 8,
	shape: "squircle",
	defaultAction: "open-link",
	iconScale: "fill"
}), (raw) => observe(raw || {
	columns: 4,
	rows: 8,
	shape: "squircle",
	defaultAction: "open-link",
	iconScale: "fill"
}), (state) => ({ ...state }));
var persistGridLayout = () => gridLayoutState?.$save?.();
function normalizeDefaultAction(raw, fallback = "open-link") {
	const v = String(raw || "").trim().toLowerCase();
	if (v === "open-view" || v === "view") return "open-view";
	if (v === "open-link" || v === "link") return "open-link";
	return fallback;
}
/** Default action id for newly created shortcuts (Settings → Workspace). */
function getDefaultSpeedDialAction() {
	return normalizeDefaultAction(gridLayoutState?.defaultAction, "open-link");
}
function getIconBitmapScale() {
	return normalizeIconBitmapScale(gridLayoutState?.iconScale, "fill");
}
function applyIconBitmapScaleCss(scale) {
	if (typeof document === "undefined") return;
	const id = normalizeIconBitmapScale(scale ?? gridLayoutState?.iconScale, "fill");
	const factor = iconBitmapScaleCss(id);
	document.documentElement.dataset.iconScale = id;
	document.documentElement.style.setProperty("--sd-launcher-icon-scale", factor);
	document.documentElement.style.setProperty("--sd-pack-icon-scale", factor);
}
var hasStoredValue = (key) => {
	try {
		return typeof localStorage !== "undefined" && localStorage.getItem(key) !== null;
	} catch {
		return false;
	}
};
var storedSpeedDialStateIsCustom = () => {
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (!raw) return false;
		const parsed = JSOX.parse(raw);
		if (!Array.isArray(parsed)) return false;
		const signature = (entry) => JSOX.stringify([
			String(entry?.id || ""),
			Number(entry?.cell?.[0]) || 0,
			Number(entry?.cell?.[1]) || 0,
			String(unwrapRef(entry?.icon, "") || ""),
			String(unwrapRef(entry?.label, "") || ""),
			String(entry?.action || "")
		]);
		const defaults = DEFAULT_SPEED_DIAL_DATA.map(signature).sort();
		const current = parsed.map(signature).sort();
		return defaults.length !== current.length || defaults.some((value, index) => value !== current[index]);
	} catch {
		return true;
	}
};
/**
* Import the former orient-layer storage once. The renderer now has one state
* model, but old users must not lose shortcuts when the new entrypoint mounts.
*/
var migrateLegacyDesktopState = () => {
	const legacy = loadDesktopRaw();
	const decoded = legacy ? decodeDesktopState(legacy) : null;
	if (!decoded?.items?.length) return;
	if (hasStoredValue(STORAGE_KEY) && storedSpeedDialStateIsCustom()) return;
	const columns = Math.max(1, Math.min(32, Number(decoded.columns) || 4));
	const rows = Math.max(1, Math.min(32, Number(decoded.rows) || 8));
	const nextItems = [];
	speedDialItems.splice(0, speedDialItems.length);
	speedDialMeta.clear();
	for (const raw of decoded.items) {
		const action = raw?.action === "open-link" ? "open-link" : "open-view";
		const item = createStatefulItem({
			id: String(raw?.id || generateItemId()),
			cell: observe([Number(raw?.cell?.[0]) || 0, Number(raw?.cell?.[1]) || 0]),
			icon: String(raw?.icon || (action === "open-link" ? "link" : "sparkle")),
			label: String(raw?.label || "Shortcut"),
			action
		});
		const meta = {
			action,
			view: action === "open-view" ? String(raw?.viewId || "") : "",
			href: action === "open-link" ? String(raw?.href || "") : "",
			description: String(raw?.description || ""),
			shape: String(raw?.shape || "squircle"),
			iconSrc: String(raw?.iconSrc || "")
		};
		speedDialItems.push(item);
		ensureSpeedDialMeta(item.id, meta);
		nextItems.push(item);
	}
	if (!nextItems.length) return;
	gridLayoutState.columns = columns;
	gridLayoutState.rows = rows;
	gridLayoutState.shape = "square";
	persistSpeedDialItems();
	persistSpeedDialMeta();
	persistGridLayout();
};
migrateLegacyDesktopState();
var applyGridSettings = (settings) => {
	const gridConfig = settings?.grid || gridLayoutState;
	const columns = Math.max(1, Math.min(16, Number(gridConfig?.columns) || gridLayoutState.columns || 4));
	const rows = Math.max(1, Math.min(16, Number(gridConfig?.rows) || gridLayoutState.rows || 8));
	const shape = normalizeTileShape(gridConfig?.shape ?? gridLayoutState.shape, "squircle");
	const defaultAction = normalizeDefaultAction(gridConfig?.defaultAction ?? gridLayoutState.defaultAction, "open-link");
	const iconScale = normalizeIconBitmapScale(gridConfig?.iconScale ?? gridLayoutState.iconScale, "fill");
	if (relocateItemsToLayout(speedDialItems, [columns, rows])) persistSpeedDialItems();
	if (gridLayoutState) {
		gridLayoutState.columns = columns;
		gridLayoutState.rows = rows;
		gridLayoutState.shape = shape;
		gridLayoutState.defaultAction = defaultAction;
		gridLayoutState.iconScale = iconScale;
		persistGridLayout();
	}
	const openTarget = gridConfig?.defaultOpenLinkTarget;
	if (openTarget != null && String(openTarget).trim()) setDefaultOpenLinkTarget(normalizeOpenLinkTarget(openTarget));
	if (typeof document === "undefined") return;
	document.documentElement.dataset.gridColumns = String(columns);
	document.documentElement.dataset.gridRows = String(rows);
	document.documentElement.dataset.gridShape = shape;
	applyIconBitmapScaleCss(iconScale);
	try {
		document.querySelectorAll(".speed-dial-grid [data-speed-dial-item][data-layer='icons']").forEach((tile) => {
			const id = tile.getAttribute("data-id") || "";
			applyItemIconScaleToElement(tile, (id ? getSpeedDialMeta(id) : null)?.iconScale);
			applyIconScaleToPaintedNodes(tile);
			tile.dispatchEvent(new CustomEvent("cwsp:icon-bitmap-refresh"));
		});
	} catch {}
};
if (typeof window !== "undefined") window.addEventListener(WORKSPACE_GRID_EVENT, (ev) => {
	const detail = ev.detail;
	if (!detail) return;
	if (detail.query && typeof detail.receive === "function") {
		detail.receive({
			columns: gridLayoutState.columns,
			rows: gridLayoutState.rows,
			shape: gridLayoutState.shape,
			defaultAction: getDefaultSpeedDialAction(),
			iconScale: getIconBitmapScale(),
			defaultOpenLinkTarget: getDefaultOpenLinkTarget()
		});
		return;
	}
	applyGridSettings({ grid: detail });
	detail.ack?.();
});
if (typeof globalThis !== "undefined" && typeof document !== "undefined") {
	const run = () => applyGridSettings();
	if (typeof requestAnimationFrame === "function") requestAnimationFrame(run);
	else queueMicrotask(run);
}
var looksLikeJsonObject = (raw) => {
	const t = String(raw || "").trim();
	return t.startsWith("{") && t.endsWith("}") || t.startsWith("[") && t.endsWith("]");
};
/**
* Explorer virtual paths (`/bookmarks/…`, `/user/…`, `/assets/…`).
* WHY: drag from Explorer used to put these in `text/plain`; they are not JSON.
*/
var isSpeedDialVirtualPath = (raw) => {
	const p = String(raw || "").trim();
	if (!p.startsWith("/") || p.includes("://") || /\s/.test(p)) return false;
	return p === "/" || p === "/bookmarks" || p.startsWith("/bookmarks/") || p === "/user" || p.startsWith("/user/") || p === "/assets" || p.startsWith("/assets/");
};
var parseSpeedDialItemFromVirtualPath = (pathText, suggestedCell, extras) => {
	const path = String(pathText || "").trim();
	if (!isSpeedDialVirtualPath(path)) return null;
	const href = String(extras?.href || "").trim();
	const isUrl = /^https?:\/\//i.test(href);
	const isDir = path.endsWith("/") || extras?.kind === "directory";
	const labelFromPath = path.split("/").filter(Boolean).pop() || path;
	const item = createStatefulItem({
		id: generateItemId(),
		cell: suggestedCell || [0, 0],
		icon: isUrl ? "link" : isDir ? "folder" : "file",
		label: String(extras?.label || "").trim() || labelFromPath,
		action: isUrl ? "open-link" : "open-path"
	});
	const meta = {
		action: isUrl ? "open-link" : "open-path",
		path,
		...isUrl ? { href } : {},
		kind: extras?.kind || (isDir ? "directory" : "file")
	};
	ensureSpeedDialMeta(item.id, meta);
	return item;
};
var parseSpeedDialItemFromJSON = (jsonText, suggestedCell) => {
	const raw = String(jsonText || "").trim();
	if (!raw) return null;
	if (isSpeedDialVirtualPath(raw)) return parseSpeedDialItemFromVirtualPath(raw, suggestedCell);
	if (!looksLikeJsonObject(raw)) return null;
	try {
		const parsed = JSON.parse(raw);
		if (!parsed || typeof parsed !== "object") return null;
		const state = parsed.state || parsed;
		const desc = parsed.desc || parsed.meta || {};
		if (!state || typeof state !== "object") return null;
		const cellValue = state.cell && Array.isArray(state.cell) && state.cell.length >= 2 ? [Number(state.cell[0]) || 0, Number(state.cell[1]) || 0] : suggestedCell || [0, 0];
		const href = String(desc.href || desc.meta?.href || state.href || "").trim();
		const path = String(desc.path || desc.meta?.path || state.path || "").trim();
		const action = desc.action || state.action || (href ? "open-link" : path ? "open-path" : "open-view");
		const item = createStatefulItem({
			id: state.id || generateItemId(),
			cell: cellValue,
			icon: state.icon || desc.icon || (action === "launch-app" ? "device-mobile" : href ? "link" : path ? "folder" : "sparkle"),
			label: state.label || desc.label || "Shortcut",
			action
		});
		const meta = {
			action,
			...desc.meta || desc || {},
			...state.meta || {},
			...href ? { href } : {},
			...path ? { path } : {}
		};
		meta.action = action;
		ensureSpeedDialMeta(item.id, meta);
		return item;
	} catch (e) {
		console.warn("Failed to parse JSON for speed dial item:", e);
		return null;
	}
};
//#endregion
//#region ../../modules/projects/fl.ui/src/ui/speed-dial/android-icon-ref.ts
var VARIANT_ALIASES = {
	default: "default",
	full: "default",
	colored: "default",
	monochrome: "monochrome",
	mono: "monochrome",
	material: "monochrome",
	"material-you": "monochrome",
	themed: "monochrome",
	foreground: "foreground",
	fg: "foreground",
	"adaptive-fg": "foreground"
};
function normalizeAndroidIconVariant(raw) {
	return VARIANT_ALIASES[String(raw || "default").trim().toLowerCase()] || "default";
}
/** Durable resource: `android-icon:com.pkg`, `?v=`, `?pack=`, `?drawable=`. */
function isAndroidIconRef(raw) {
	return String(raw || "").trim().toLowerCase().startsWith("android-icon:");
}
function formatAndroidIconRef(packageName, variant = "default", pack = "", drawable = "") {
	const pkg = String(packageName || "").trim();
	if (!pkg) return "";
	const v = normalizeAndroidIconVariant(variant);
	const packPkg = String(pack || "").trim();
	const draw = String(drawable || "").trim();
	const params = new URLSearchParams();
	if (v !== "default") params.set("v", v);
	if (packPkg) params.set("pack", packPkg);
	if (draw) params.set("drawable", draw);
	const q = params.toString();
	return q ? `android-icon:${pkg}?${q}` : `android-icon:${pkg}`;
}
function parseAndroidIconRef(raw) {
	const input = String(raw || "").trim();
	if (!isAndroidIconRef(input)) return null;
	const body = input.slice(13).replace(/^\/\//, "");
	if (!body) return null;
	const finish = (pkg, params) => {
		if (!pkg) return null;
		const parsed = {
			packageName: pkg,
			variant: normalizeAndroidIconVariant(params.get("v") || "default")
		};
		const pack = String(params.get("pack") || "").trim();
		const drawable = String(params.get("drawable") || "").trim();
		if (pack) parsed.pack = pack;
		if (drawable) parsed.drawable = drawable;
		return parsed;
	};
	try {
		const url = new URL(body.includes("://") ? body : `android-icon://${body}`);
		return finish(String(url.hostname || url.pathname.replace(/^\//, "") || "").trim(), url.searchParams);
	} catch {
		const [pkgPart, query = ""] = body.split("?");
		return finish(String(pkgPart || "").trim(), new URLSearchParams(query));
	}
}
/** Cache key so default / mono / fg / pack / drawable / pixel size don't collide. */
function androidIconCacheKey(packageName, variant = "default", pack = "", drawable = "", sizePx = 0) {
	const pkg = String(packageName || "").trim();
	if (!pkg) return "";
	const v = normalizeAndroidIconVariant(variant);
	const packPkg = String(pack || "").trim();
	const draw = String(drawable || "").trim();
	let key = v === "default" ? pkg : `${pkg}#${v}`;
	if (packPkg) key = `${key}#pack:${packPkg}`;
	if (draw) key = `${key}#d:${draw}`;
	const sz = Math.round(Number(sizePx) || 0);
	if (sz > 0) key = `${key}#s${sz}`;
	return key;
}
//#endregion
//#region ../../modules/projects/fl.ui/src/ui/speed-dial/action-registry.ts
var registeredLauncherBridge = null;
/** In-memory cache: Android package → blob: object URL (web-native image). */
var launcherIconObjectUrlCache = /* @__PURE__ */ new Map();
var launcherIconInflight = /* @__PURE__ */ new Map();
async function dataUrlToObjectUrl(dataUrl) {
	const blob = await (await fetch(dataUrl)).blob();
	const type = blob.type && blob.type.startsWith("image/") ? blob.type : "image/png";
	const normalized = blob.type === type ? blob : new Blob([await blob.arrayBuffer()], { type });
	return URL.createObjectURL(normalized);
}
/** Cached blob URL for an Android launcher icon, if already fetched this session. */
function getCachedLauncherIconObjectUrl(cacheKey, size = 96, variant = "default", pack = "", drawable = "") {
	const pkg = String(cacheKey || "").trim();
	if (!pkg) return "";
	if (pkg.startsWith("shortcut:")) {
		const rest = pkg.slice(9);
		const slash = rest.indexOf("/");
		if (slash > 0) return getCachedShortcutIconObjectUrl(rest.slice(0, slash), rest.slice(slash + 1), size);
		return "";
	}
	return launcherIconObjectUrlCache.get(androidIconCacheKey(pkg, variant, pack, drawable, size)) || "";
}
var shortcutIconObjectUrlCache = /* @__PURE__ */ new Map();
var shortcutIconInflight = /* @__PURE__ */ new Map();
/** Fetch pinned-shortcut icon (document thumbnail / type icon), not the app icon. */
async function ensureShortcutIconObjectUrl(pkg, shortcutId, size = 96) {
	const packageName = String(pkg || "").trim();
	const id = String(shortcutId || "").trim();
	if (!packageName || !id) return "";
	const sz = Math.max(16, Math.min(512, Math.round(Number(size) || 96)));
	const key = `shortcut:${packageName}/${id}@${sz}`;
	const cached = shortcutIconObjectUrlCache.get(key);
	if (cached) return cached;
	let inflight = shortcutIconInflight.get(key);
	if (!inflight) {
		inflight = (async () => {
			const bridge = await resolveLauncherBridgeForSpeedDial();
			if (!bridge?.launcherShortcutIcon) return "";
			let dataUrl = "";
			try {
				dataUrl = String(await bridge.launcherShortcutIcon(packageName, id, sz) || "").trim();
			} catch {
				return "";
			}
			if (!dataUrl) return "";
			try {
				const objectUrl = await dataUrlToObjectUrl(dataUrl);
				shortcutIconObjectUrlCache.set(key, objectUrl);
				return objectUrl;
			} catch {
				return dataUrl;
			}
		})().finally(() => {
			shortcutIconInflight.delete(key);
		});
		shortcutIconInflight.set(key, inflight);
	}
	return inflight;
}
function getCachedShortcutIconObjectUrl(pkg, shortcutId, size = 96) {
	const packageName = String(pkg || "").trim();
	const id = String(shortcutId || "").trim();
	if (!packageName || !id) return "";
	const sz = Math.max(16, Math.min(512, Math.round(Number(size) || 96)));
	return shortcutIconObjectUrlCache.get(`shortcut:${packageName}/${id}@${sz}`) || "";
}
/** Fetch native icon once, convert data: URL → blob: object URL for WebView. */
async function ensureLauncherIconObjectUrl(cacheKey, size = 96, variant = "default", pack = "", drawable = "") {
	const pkg = String(cacheKey || "").trim();
	if (!pkg) return "";
	if (pkg.startsWith("shortcut:")) {
		const rest = pkg.slice(9);
		const slash = rest.indexOf("/");
		if (slash > 0) return ensureShortcutIconObjectUrl(rest.slice(0, slash), rest.slice(slash + 1), size);
		return "";
	}
	const v = normalizeAndroidIconVariant(variant);
	const packPkg = String(pack || "").trim();
	const draw = String(drawable || "").trim();
	const sz = Math.max(16, Math.min(512, Math.round(Number(size) || 96)));
	const key = androidIconCacheKey(pkg, v, packPkg, draw, sz);
	const cached = launcherIconObjectUrlCache.get(key);
	if (cached) return cached;
	let inflight = launcherIconInflight.get(key);
	if (!inflight) {
		inflight = (async () => {
			const bridge = await resolveLauncherBridgeForSpeedDial();
			if (!bridge?.launcherIcon) return "";
			let dataUrl = "";
			try {
				dataUrl = await bridge.launcherIcon(pkg, sz, v, packPkg || void 0, draw || void 0);
			} catch {
				return "";
			}
			if (!dataUrl) return "";
			try {
				const objectUrl = await dataUrlToObjectUrl(dataUrl);
				launcherIconObjectUrlCache.set(key, objectUrl);
				return objectUrl;
			} catch {
				return "";
			}
		})();
		launcherIconInflight.set(key, inflight);
	}
	try {
		return await inflight;
	} finally {
		launcherIconInflight.delete(key);
	}
}
/** Resolve durable `android-icon:` ref (or return plain URL as-is). */
async function resolveIconResourceUrl(raw, size = 96) {
	const u = String(raw || "").trim();
	if (!u || u.startsWith("blob:")) return "";
	const parsed = parseAndroidIconRef(u);
	if (parsed) return ensureLauncherIconObjectUrl(parsed.packageName, size, parsed.variant, parsed.pack || "", parsed.drawable || "");
	return u;
}
function getCachedIconResourceObjectUrl(raw, size = 96) {
	const parsed = parseAndroidIconRef(raw);
	if (!parsed) return "";
	return getCachedLauncherIconObjectUrl(parsed.packageName, size, parsed.variant, parsed.pack || "", parsed.drawable || "");
}
async function resolveLauncherBridgeForSpeedDial() {
	if (registeredLauncherBridge) return registeredLauncherBridge;
	try {
		return await import("../chunks/launcher-bridge.js");
	} catch {
		return null;
	}
}
async function getLauncherBridgeForSpeedDial() {
	return resolveLauncherBridgeForSpeedDial();
}
/** Apply fetched Android icon to a launcher `ui-icon` via resource + presentation mode. */
function applyLauncherIconToUiIcon(host, objectUrl, mode = "colored") {
	const url = String(objectUrl || "").trim();
	if (!url) return;
	host.setAttribute("icon-padding", "0");
	host.style.setProperty("--icon-padding", "0px");
	host.style.setProperty("--icon-size", "100%");
	host.toggleAttribute("data-launcher-icon", true);
	const apply = () => {
		const icon = host;
		if (typeof icon.setResourceIcon !== "function") return false;
		icon.setResourceIcon(url, mode === "auto" ? "auto" : mode);
		if (mode !== "auto" && typeof icon.setBitmapPresentationMode === "function") icon.setBitmapPresentationMode(mode, true);
		host.toggleAttribute("data-launcher-icon-ready", true);
		return true;
	};
	if (apply()) return;
	customElements.whenDefined("ui-icon").then(() => {
		if (!host.isConnected) return;
		apply();
	});
}
//#endregion
//#region ../../modules/projects/fl.ui/src/ui/navigation/app-menu/bookmarks-menu.ts
/** Local copy — avoid relative `../../explorer/fs-backend` (breaks when this file is hardlinked under home-view). */
function faviconForHref(href, size = 64) {
	const raw = String(href || "").trim();
	if (!raw || !/^https?:\/\//i.test(raw)) return "";
	try {
		const host = new URL(raw).hostname;
		if (!host) return "";
		return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(host)}&sz=${size}`;
	} catch {
		return "";
	}
}
var registeredBookmarksApi = null;
var chromeErr = () => {
	try {
		const err = globalThis.chrome?.runtime?.lastError;
		return err ? new Error(String(err.message || err)) : null;
	} catch {
		return null;
	}
};
var callChrome = (api, method, ...args) => {
	const fn = api[method];
	if (typeof fn !== "function") return Promise.reject(/* @__PURE__ */ new Error(`chrome.bookmarks.${String(method)} missing`));
	try {
		const result = fn.apply(api, args);
		if (result != null && typeof result.then === "function") return result;
	} catch (e) {
		return Promise.reject(e);
	}
	return new Promise((resolve, reject) => {
		try {
			fn.apply(api, [...args, (res) => {
				const err = chromeErr();
				if (err) reject(err);
				else resolve(res);
			}]);
		} catch (e) {
			reject(e);
		}
	});
};
var nodeToEntry = (node) => {
	const url = typeof node.url === "string" && node.url ? node.url : void 0;
	return {
		id: String(node.id),
		title: String(node.title || node.url || node.id || "Bookmark"),
		url,
		folder: !url,
		parentId: node.parentId
	};
};
/** Build BookmarksMenuApi from `chrome.bookmarks` (CRX extension pages). */
function createChromeBookmarksMenuApi(raw) {
	const api = raw || (globalThis.chrome?.bookmarks ?? null);
	if (!api?.getTree || !api?.getChildren) return null;
	const resolveIconUrl = (href, size = 128) => {
		const page = String(href || "").trim();
		if (!/^https?:\/\//i.test(page)) return "";
		const s2 = faviconForHref(page, size);
		if (s2) return s2;
		try {
			const chromeRt = globalThis.chrome?.runtime;
			if (typeof chromeRt?.getURL === "function") {
				const u = new URL(chromeRt.getURL("/_favicon/"));
				u.searchParams.set("pageUrl", page);
				u.searchParams.set("size", String(size));
				return u.toString();
			}
		} catch {}
		return "";
	};
	return {
		resolveIconUrl,
		async listChildren(folderId) {
			if (folderId) return (await callChrome(api, "getChildren", folderId) || []).map(nodeToEntry);
			const roots = await callChrome(api, "getTree") || [];
			const out = [];
			for (const root of roots) for (const child of root.children || []) out.push(nodeToEntry(child));
			return out;
		},
		async search(query) {
			const q = String(query || "").trim();
			if (!q) return this.listChildren();
			if (typeof api.search !== "function") {
				const all = await this.listChildren();
				const lower = q.toLowerCase();
				return all.filter((e) => e.title.toLowerCase().includes(lower) || String(e.url || "").toLowerCase().includes(lower));
			}
			return (await callChrome(api, "search", q) || []).map(nodeToEntry);
		},
		async open(entry) {
			if (entry.folder) return;
			const href = String(entry.url || "").trim();
			if (!href) return;
			try {
				const tabs = globalThis.chrome?.tabs;
				if (typeof tabs?.create === "function") {
					await Promise.resolve(tabs.create({ url: href }));
					return;
				}
			} catch {}
			globalThis.open?.(href, "_blank", "noopener,noreferrer");
		}
	};
}
function resolveBookmarksMenuApi() {
	if (registeredBookmarksApi) return registeredBookmarksApi;
	return createChromeBookmarksMenuApi();
}
//#endregion
//#region ../../modules/projects/fl.ui/src/ui/speed-dial/icon-resource-picker.ts
var VARIANT_FALLBACK = [
	{
		id: "default",
		label: "Default"
	},
	{
		id: "monochrome",
		label: "Material You"
	},
	{
		id: "foreground",
		label: "Adaptive FG"
	}
];
function resolveTheme(theme) {
	if (theme === "light" || theme === "dark") return theme;
	return String(document.documentElement.getAttribute("data-theme") || "").toLowerCase() === "light" ? "light" : "dark";
}
function httpPageUrl(raw) {
	const u = String(raw || "").trim();
	return /^https?:\/\//i.test(u) ? u : "";
}
function googleS2Favicon(pageUrl, size = 128) {
	try {
		const host = new URL(pageUrl).hostname;
		if (!host) return "";
		return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(host)}&sz=${size}`;
	} catch {
		return "";
	}
}
function chromeExtensionFavicon(pageUrl, size = 128) {
	try {
		const chromeRt = globalThis.chrome?.runtime;
		if (typeof chromeRt?.getURL !== "function") return "";
		const u = new URL(chromeRt.getURL("/_favicon/"));
		u.searchParams.set("pageUrl", pageUrl);
		u.searchParams.set("size", String(size));
		return u.toString();
	} catch {
		return "";
	}
}
function resolveFaviconCandidates(pageUrl, api) {
	const page = httpPageUrl(pageUrl);
	if (!page) return [];
	const out = [];
	const seen = /* @__PURE__ */ new Set();
	const push = (label, url) => {
		const u = String(url || "").trim();
		if (!u || seen.has(u)) return;
		seen.add(u);
		out.push({
			label,
			url: u
		});
	};
	const fromApi = api?.resolveIconUrl?.(page, 128) || api?.resolveIconUrl?.(page, 64) || "";
	const s2 = googleS2Favicon(page, 128);
	if (s2) push("Google S2", s2);
	const s2sm = googleS2Favicon(page, 64);
	if (s2sm) push("Google S2 (64)", s2sm);
	const chromeFav = chromeExtensionFavicon(page, 128);
	if (chromeFav) push("Chrome favicon", chromeFav);
	if (fromApi) push("Bookmark favicon", fromApi);
	return out;
}
function makeCard(label, title) {
	const btn = document.createElement("button");
	btn.type = "button";
	btn.className = "sd-icon-picker__card";
	btn.title = title || label;
	btn.style.setProperty("display", "flex", "important");
	btn.style.setProperty("flex-direction", "column", "important");
	btn.style.setProperty("flex-wrap", "nowrap", "important");
	btn.style.setProperty("align-items", "center", "important");
	btn.style.setProperty("justify-content", "center", "important");
	btn.style.setProperty("gap", "0.28rem", "important");
	btn.style.setProperty("min-inline-size", "0", "important");
	btn.style.setProperty("overflow", "hidden", "important");
	btn.style.setProperty("inline-size", "auto", "important");
	btn.style.setProperty("text-align", "center", "important");
	const img = document.createElement("img");
	img.alt = "";
	img.decoding = "async";
	img.draggable = false;
	img.referrerPolicy = "no-referrer";
	img.style.setProperty("display", "block", "important");
	img.style.setProperty("order", "0", "important");
	const caption = document.createElement("span");
	caption.className = "sd-icon-picker__card-label";
	caption.textContent = label;
	caption.style.setProperty("display", "block", "important");
	caption.style.setProperty("order", "1", "important");
	caption.style.setProperty("inline-size", "100%", "important");
	caption.style.setProperty("text-align", "center", "important");
	caption.style.setProperty("overflow", "hidden", "important");
	caption.style.setProperty("text-overflow", "ellipsis", "important");
	caption.style.setProperty("white-space", "nowrap", "important");
	btn.append(img, caption);
	return {
		btn,
		img
	};
}
async function loadVariantCards(bridge, pkg, host, onPick, close) {
	host.replaceChildren();
	let variants = VARIANT_FALLBACK.map((v) => ({
		...v,
		available: true
	}));
	try {
		const listed = await bridge.launcherIconVariants?.(pkg);
		if (Array.isArray(listed) && listed.length) variants = listed.map((v) => ({
			id: normalizeAndroidIconVariant(v.id),
			label: String(v.label || v.id),
			available: v.available !== false
		}));
	} catch {}
	for (const v of variants) {
		if (!v.available && v.id !== "default") continue;
		const { btn, img } = makeCard(v.label);
		host.append(btn);
		ensureLauncherIconObjectUrl(pkg, 96, v.id).then((url) => {
			if (!url) {
				btn.disabled = true;
				btn.title = `${v.label} (unavailable)`;
				return;
			}
			img.src = url;
		});
		btn.addEventListener("click", () => {
			onPick({
				iconUrl: formatAndroidIconRef(pkg, v.id),
				packageName: pkg,
				variant: v.id,
				label: v.label,
				source: "android"
			});
			close();
		});
	}
}
async function loadIconPackCards(bridge, targetPkg, host, onPick, close) {
	host.replaceChildren();
	if (!bridge.launcherIconPacks) {
		host.textContent = "Icon packs unavailable.";
		return;
	}
	let packs = [];
	try {
		packs = await bridge.launcherIconPacks();
	} catch {
		host.textContent = "Failed to list icon packs.";
		return;
	}
	if (!packs.length) {
		host.textContent = "No icon packs installed.";
		return;
	}
	const frag = document.createDocumentFragment();
	for (const pack of packs.slice(0, 64)) {
		const packPkg = String(pack.packageName || "").trim();
		if (!packPkg) continue;
		const label = String(pack.label || packPkg);
		const wrap = document.createElement("div");
		wrap.className = "sd-icon-picker__pack-wrap";
		wrap.style.setProperty("display", "flex", "important");
		wrap.style.setProperty("flex-direction", "column", "important");
		wrap.style.setProperty("gap", "0.2rem", "important");
		wrap.style.setProperty("min-inline-size", "0", "important");
		const { btn, img } = makeCard(label, `${label} — themed for this app`);
		ensureLauncherIconObjectUrl(targetPkg, 96, "default", packPkg).then((url) => {
			if (url) {
				img.src = url;
				return;
			}
			btn.disabled = true;
			btn.title = `${label} (no cover for this app)`;
			ensureLauncherIconObjectUrl(packPkg, 72, "default").then((packIcon) => {
				if (packIcon) img.src = packIcon;
			});
		});
		btn.addEventListener("click", () => {
			if (btn.disabled) return;
			onPick({
				iconUrl: formatAndroidIconRef(targetPkg, "default", packPkg),
				packageName: targetPkg,
				variant: "default",
				pack: packPkg,
				label,
				source: "icon-pack"
			});
			close();
		});
		const browse = document.createElement("button");
		browse.type = "button";
		browse.className = "sd-icon-picker__pack-browse";
		browse.textContent = "Browse…";
		browse.title = `Browse icons in ${label}`;
		browse.style.cssText = "font:inherit;font-size:0.68rem;padding:0.15rem 0.35rem;border-radius:6px;border:1px solid color-mix(in oklab,currentColor 22%,transparent);background:transparent;color:inherit;cursor:pointer;";
		browse.addEventListener("click", (ev) => {
			ev.preventDefault();
			ev.stopPropagation();
			loadPackDrawableBrowse(bridge, targetPkg, packPkg, label, host, onPick, close, () => {
				loadIconPackCards(bridge, targetPkg, host, onPick, close);
			});
		});
		wrap.append(btn, browse);
		frag.append(wrap);
	}
	host.append(frag);
}
async function loadPackDrawableBrowse(bridge, targetPkg, packPkg, packLabel, host, onPick, close, onBack) {
	host.replaceChildren();
	const toolbar = document.createElement("div");
	toolbar.style.cssText = "display:flex;flex-wrap:wrap;gap:0.35rem;align-items:center;margin-block-end:0.35rem;grid-column:1/-1;";
	const back = document.createElement("button");
	back.type = "button";
	back.textContent = "← Packs";
	back.style.cssText = "font:inherit;font-size:0.75rem;padding:0.2rem 0.45rem;border-radius:6px;border:1px solid color-mix(in oklab,currentColor 22%,transparent);background:transparent;color:inherit;cursor:pointer;";
	back.addEventListener("click", () => onBack());
	const title = document.createElement("span");
	title.textContent = packLabel;
	title.style.cssText = "font-size:0.78rem;opacity:0.85;flex:1;min-inline-size:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;";
	const search = document.createElement("input");
	search.type = "search";
	search.placeholder = "Filter drawables…";
	search.autocomplete = "off";
	search.className = "sd-icon-picker__search";
	search.style.setProperty("flex", "1 1 8rem", "important");
	toolbar.append(back, title, search);
	const grid = document.createElement("div");
	grid.className = "sd-icon-picker__grid";
	grid.style.setProperty("display", "grid", "important");
	grid.style.setProperty("grid-template-columns", "repeat(3, minmax(0, 1fr))", "important");
	grid.style.setProperty("gap", "0.4rem", "important");
	grid.style.setProperty("grid-column", "1 / -1", "important");
	host.style.setProperty("display", "flex", "important");
	host.style.setProperty("flex-direction", "column", "important");
	host.append(toolbar, grid);
	let timer = 0;
	const refresh = () => {
		(async () => {
			grid.replaceChildren();
			if (!bridge.launcherIconPackIcons) {
				grid.textContent = "Pack browse unavailable.";
				return;
			}
			let icons = [];
			try {
				icons = await bridge.launcherIconPackIcons(packPkg, String(search.value || ""), 96);
			} catch {
				grid.textContent = "Failed to list pack icons.";
				return;
			}
			if (!icons.length) {
				grid.textContent = "No matching icons.";
				return;
			}
			const frag = document.createDocumentFragment();
			const resolvePkg = targetPkg || packPkg;
			for (const icon of icons) {
				const drawable = String(icon.drawable || "").trim();
				if (!drawable) continue;
				const { btn, img } = makeCard(String(icon.label || drawable), `${packLabel}: ${drawable}`);
				frag.append(btn);
				ensureLauncherIconObjectUrl(resolvePkg, 72, "default", packPkg, drawable).then((url) => {
					if (url) img.src = url;
					else btn.disabled = true;
				});
				btn.addEventListener("click", () => {
					if (btn.disabled) return;
					onPick({
						iconUrl: formatAndroidIconRef(resolvePkg, "default", packPkg, drawable),
						packageName: resolvePkg,
						variant: "default",
						pack: packPkg,
						drawable,
						label: String(icon.label || drawable),
						source: "icon-pack"
					});
					close();
				});
			}
			grid.append(frag);
		})();
	};
	search.addEventListener("input", () => {
		window.clearTimeout(timer);
		timer = window.setTimeout(refresh, 160);
	});
	refresh();
}
async function loadAppBrowse(bridge, query, host, onPick, close) {
	host.replaceChildren();
	if (!bridge.launcherList) {
		host.textContent = "App list unavailable.";
		return;
	}
	let apps = [];
	try {
		apps = await bridge.launcherList(query);
	} catch {
		host.textContent = "Failed to list apps.";
		return;
	}
	if (!apps.length) {
		host.textContent = query.trim() ? "No matches." : "No apps.";
		return;
	}
	const frag = document.createDocumentFragment();
	for (const app of apps.slice(0, 48)) {
		const pkg = String(app.packageName || "").trim();
		if (!pkg) continue;
		const { btn, img } = makeCard(String(app.label || pkg), `${app.label} (${pkg})`);
		frag.append(btn);
		ensureLauncherIconObjectUrl(String(app.iconCacheKey || pkg).trim() || pkg, 72, "default").then((url) => {
			if (url) img.src = url;
		});
		btn.addEventListener("click", () => {
			onPick({
				iconUrl: formatAndroidIconRef(pkg, "default"),
				packageName: pkg,
				variant: "default",
				label: String(app.label || pkg),
				source: "android"
			});
			close();
		});
	}
	host.append(frag);
}
function loadFaviconVariantCards(pageUrl, api, host, onPick, close) {
	host.replaceChildren();
	const candidates = resolveFaviconCandidates(pageUrl, api);
	if (!candidates.length) {
		host.textContent = "No favicon sources for this URL.";
		return;
	}
	for (const c of candidates) {
		const { btn, img } = makeCard(c.label, c.url);
		img.src = c.url;
		img.addEventListener("error", () => {
			btn.disabled = true;
			btn.title = `${c.label} (failed to load)`;
		});
		btn.addEventListener("click", () => {
			onPick({
				iconUrl: c.url,
				label: c.label,
				source: "favicon"
			});
			close();
		});
		host.append(btn);
	}
}
async function loadBookmarkBrowse(api, query, host, onPick, close) {
	host.replaceChildren();
	let entries = [];
	try {
		const q = String(query || "").trim();
		entries = q ? await api.search(q) : await api.listChildren();
	} catch {
		host.textContent = "Failed to list bookmarks.";
		return;
	}
	const links = entries.filter((e) => !e.folder && httpPageUrl(e.url));
	if (!links.length) {
		host.textContent = query.trim() ? "No matching bookmarks." : "No bookmarks.";
		return;
	}
	const frag = document.createDocumentFragment();
	for (const entry of links.slice(0, 48)) {
		const page = httpPageUrl(entry.url);
		if (!page) continue;
		const icon = api.resolveIconUrl?.(page, 64) || chromeExtensionFavicon(page, 64) || googleS2Favicon(page, 64);
		const { btn, img } = makeCard(String(entry.title || page), page);
		if (icon) img.src = icon;
		frag.append(btn);
		btn.addEventListener("click", () => {
			const preferred = api.resolveIconUrl?.(page, 128) || chromeExtensionFavicon(page, 128) || googleS2Favicon(page, 128) || icon;
			if (!preferred) return;
			onPick({
				iconUrl: preferred,
				label: String(entry.title || page),
				source: "bookmark"
			});
			close();
		});
	}
	host.append(frag);
}
/**
* Modal picker:
* - Capacitor: Material You / adaptive + icon packs + installed apps (`android-icon:`)
* - CRX: favicon variants for a page URL + browse Chrome bookmarks
*/
async function openIconResourcePicker(opts) {
	const bridge = await getLauncherBridgeForSpeedDial();
	const bookmarksApi = resolveBookmarksMenuApi();
	const hasAndroid = Boolean(bridge?.launcherIcon);
	const pageSeed = httpPageUrl(opts.pageUrl) || httpPageUrl(opts.currentUrl) || "";
	if (!hasAndroid && !(Boolean(bookmarksApi) || Boolean(pageSeed))) {
		console.warn("[icon-resource-picker] no launcher bridge or bookmarks/favicon source");
		return;
	}
	const theme = resolveTheme(opts.theme);
	const pkgSeed = String(opts.packageName || "").trim();
	const showAndroidVariants = hasAndroid && Boolean(pkgSeed);
	const showIconPacks = hasAndroid && Boolean(pkgSeed) && Boolean(bridge?.launcherIconPacks);
	const showAndroidBrowse = hasAndroid && Boolean(bridge?.launcherList);
	const showFaviconVariants = Boolean(pageSeed);
	const showBookmarkBrowse = Boolean(bookmarksApi);
	const dialog = document.createElement("dialog");
	dialog.className = "speed-dial-editor sd-icon-picker";
	dialog.dataset.theme = theme;
	dialog.innerHTML = `
        <form class="speed-dial-editor__form sd-icon-picker__form" data-theme="${theme}" method="dialog">
            <header class="modal-header">
                <h2 class="modal-title">Pick icon</h2>
                <p class="modal-description">${hasAndroid ? "Material You / adaptive, icon packs, installed apps, or a favicon." : "Favicon for this link, or pick from Chrome bookmarks."}</p>
            </header>
            <div class="modal-fields sd-icon-picker__body">
                <section class="sd-icon-picker__section" data-section="variants" ${showAndroidVariants ? "" : "hidden"}>
                    <div class="sd-icon-picker__section-title">For this package</div>
                    <div class="sd-icon-picker__grid" data-variants></div>
                </section>
                <section class="sd-icon-picker__section" data-section="packs" ${showIconPacks ? "" : "hidden"}>
                    <div class="sd-icon-picker__section-title">Icon packs</div>
                    <div class="sd-icon-picker__grid" data-packs></div>
                </section>
                <section class="sd-icon-picker__section" data-section="favicon" ${showFaviconVariants ? "" : "hidden"}>
                    <div class="sd-icon-picker__section-title">For this link</div>
                    <div class="sd-icon-picker__grid" data-favicon></div>
                </section>
                <section class="sd-icon-picker__section" data-section="browse" ${showAndroidBrowse ? "" : "hidden"}>
                    <div class="sd-icon-picker__section-title">Installed apps</div>
                    <input class="sd-icon-picker__search" data-search="apps" type="search" placeholder="Search apps…" autocomplete="off" />
                    <div class="sd-icon-picker__grid" data-browse></div>
                </section>
                <section class="sd-icon-picker__section" data-section="bookmarks" ${showBookmarkBrowse ? "" : "hidden"}>
                    <div class="sd-icon-picker__section-title">Bookmarks</div>
                    <input class="sd-icon-picker__search" data-search="bookmarks" type="search" placeholder="Search bookmarks…" autocomplete="off" />
                    <div class="sd-icon-picker__grid" data-bookmarks></div>
                </section>
            </div>
            <div class="modal-actions" role="group">
                <span class="modal-actions-spacer" aria-hidden="true"></span>
                <button type="button" data-action="cancel" class="btn secondary">Cancel</button>
            </div>
        </form>
    `;
	const form = dialog.querySelector("form");
	const variantsHost = dialog.querySelector("[data-variants]");
	const packsHost = dialog.querySelector("[data-packs]");
	const faviconHost = dialog.querySelector("[data-favicon]");
	const browseHost = dialog.querySelector("[data-browse]");
	const bookmarksHost = dialog.querySelector("[data-bookmarks]");
	const appSearch = dialog.querySelector("[data-search=\"apps\"]");
	const bmSearch = dialog.querySelector("[data-search=\"bookmarks\"]");
	let closed = false;
	const close = () => {
		if (closed) return;
		closed = true;
		try {
			if (dialog.open) dialog.close();
		} catch {}
		dialog.remove();
	};
	const onPick = (pick) => {
		opts.onPick(pick);
	};
	form.addEventListener("click", (ev) => {
		if (ev.target?.closest?.("[data-action]")?.getAttribute("data-action") === "cancel") {
			ev.preventDefault();
			close();
		}
	});
	dialog.addEventListener("cancel", (ev) => {
		ev.preventDefault();
		close();
	});
	dialog.addEventListener("click", (ev) => {
		if (ev.target === dialog) close();
	});
	if (showAndroidVariants && bridge && variantsHost) loadVariantCards(bridge, pkgSeed, variantsHost, onPick, close);
	if (showIconPacks && bridge && packsHost && pkgSeed) loadIconPackCards(bridge, pkgSeed, packsHost, onPick, close);
	if (showFaviconVariants && faviconHost) loadFaviconVariantCards(pageSeed, bookmarksApi, faviconHost, onPick, close);
	let appTimer = 0;
	const refreshApps = () => {
		if (!browseHost || !bridge) return;
		loadAppBrowse(bridge, String(appSearch?.value || ""), browseHost, onPick, close);
	};
	if (showAndroidBrowse) {
		appSearch?.addEventListener("input", () => {
			window.clearTimeout(appTimer);
			appTimer = window.setTimeout(refreshApps, 180);
		});
		refreshApps();
	}
	let bmTimer = 0;
	const refreshBookmarks = () => {
		if (!bookmarksHost || !bookmarksApi) return;
		loadBookmarkBrowse(bookmarksApi, String(bmSearch?.value || ""), bookmarksHost, onPick, close);
	};
	if (showBookmarkBrowse && bookmarksApi) {
		bmSearch?.addEventListener("input", () => {
			window.clearTimeout(bmTimer);
			bmTimer = window.setTimeout(refreshBookmarks, 180);
		});
		refreshBookmarks();
	}
	document.body.append(dialog);
	dialog.querySelectorAll(".sd-icon-picker__grid").forEach((grid) => {
		grid.style.setProperty("display", "grid", "important");
		grid.style.setProperty("grid-template-columns", "repeat(3, minmax(0, 1fr))", "important");
		grid.style.setProperty("gap", "0.4rem", "important");
		grid.style.setProperty("align-content", "start", "important");
		grid.style.setProperty("min-inline-size", "0", "important");
	});
	try {
		dialog.showModal();
	} catch {
		dialog.setAttribute("open", "");
	}
}
/** Icon-only button that opens {@link openIconResourcePicker} and fills an input. */
function attachIconResourcePickButton(field, input, opts) {
	let row = field.querySelector(".sd-icon-resource-row");
	if (!row) {
		row = document.createElement("div");
		row.className = "sd-icon-resource-row";
		input.replaceWith(row);
		row.append(input);
	}
	row.style.setProperty("display", "grid", "important");
	row.style.setProperty("grid-template-columns", "minmax(0,1fr) 2.5rem 2.5rem", "important");
	row.style.setProperty("align-items", "stretch", "important");
	row.style.setProperty("gap", "0.45rem", "important");
	row.style.setProperty("min-inline-size", "0", "important");
	row.style.setProperty("inline-size", "100%", "important");
	let btn = row.querySelector("[data-action='pick-icon']");
	if (!btn) {
		btn = document.createElement("button");
		btn.type = "button";
		btn.className = "btn secondary sd-icon-resource-pick";
		btn.setAttribute("data-action", "pick-icon");
		btn.title = "Pick alternative icon";
		btn.setAttribute("aria-label", "Pick alternative icon");
		btn.innerHTML = "<ui-icon icon=\"squares-four\" icon-style=\"duotone\" aria-hidden=\"true\"></ui-icon>";
		row.append(btn);
	}
	let photoBtn = row.querySelector("[data-action='pick-photo']");
	if (!photoBtn) {
		photoBtn = document.createElement("button");
		photoBtn.type = "button";
		photoBtn.className = "btn secondary sd-icon-resource-pick";
		photoBtn.setAttribute("data-action", "pick-photo");
		photoBtn.title = "Use photo / avatar";
		photoBtn.setAttribute("aria-label", "Use photo or avatar");
		photoBtn.innerHTML = "<ui-icon icon=\"user-circle\" icon-style=\"duotone\" aria-hidden=\"true\"></ui-icon>";
		row.append(photoBtn);
	}
	if (input.parentElement !== row) row.insertBefore(input, btn);
	if (btn.parentElement === row && photoBtn.parentElement === row) {
		row.append(btn, photoBtn);
		row.insertBefore(input, btn);
	}
	const stylePickBtn = (el) => {
		el.style.setProperty("display", "inline-flex", "important");
		el.style.setProperty("align-items", "center", "important");
		el.style.setProperty("justify-content", "center", "important");
		el.style.setProperty("inline-size", "2.5rem", "important");
		el.style.setProperty("min-inline-size", "2.5rem", "important");
		el.style.setProperty("max-inline-size", "2.5rem", "important");
		el.style.setProperty("min-block-size", "2.5rem", "important");
		el.style.setProperty("padding", "0", "important");
		el.style.setProperty("margin", "0", "important");
	};
	stylePickBtn(btn);
	stylePickBtn(photoBtn);
	btn.addEventListener("click", (ev) => {
		ev.preventDefault();
		ev.stopPropagation();
		openIconResourcePicker({
			packageName: typeof opts.packageName === "function" ? opts.packageName() : String(opts.packageName || "").trim(),
			pageUrl: typeof opts.pageUrl === "function" ? opts.pageUrl() : String(opts.pageUrl || "").trim(),
			currentUrl: input.value,
			theme: opts.theme,
			onPick: (pick) => {
				input.value = pick.iconUrl;
				input.setAttribute("value", pick.iconUrl);
				input.dispatchEvent(new Event("input", { bubbles: true }));
				input.dispatchEvent(new Event("change", { bubbles: true }));
			}
		});
	});
	photoBtn.addEventListener("click", (ev) => {
		ev.preventDefault();
		ev.stopPropagation();
		const fileInput = document.createElement("input");
		fileInput.type = "file";
		fileInput.accept = "image/*";
		fileInput.style.display = "none";
		document.body.append(fileInput);
		fileInput.addEventListener("change", () => {
			const file = fileInput.files?.[0];
			fileInput.remove();
			if (!file) return;
			const reader = new FileReader();
			reader.onload = () => {
				const dataUrl = String(reader.result || "").trim();
				if (!dataUrl.startsWith("data:image/")) return;
				input.value = dataUrl;
				input.setAttribute("value", dataUrl);
				input.dispatchEvent(new Event("input", { bubbles: true }));
				input.dispatchEvent(new Event("change", { bubbles: true }));
				const display = field.closest("form")?.querySelector("select[name=\"iconDisplay\"]");
				if (display) {
					display.value = "colored";
					display.dispatchEvent(new Event("change", { bubbles: true }));
				}
			};
			reader.readAsDataURL(file);
		}, { once: true });
		fileInput.click();
	});
	return btn;
}
//#endregion
//#region ../../modules/projects/fl.ui/src/ui/navigation/overlay-back.ts
var installCapacitorBackButton = () => {
	const g = globalThis;
	if (g.__CWSP_CAP_BACK_BOUND__) return;
	const App = g.Capacitor?.Plugins?.App;
	if (typeof App?.addListener !== "function") return;
	g.__CWSP_CAP_BACK_BOUND__ = true;
	try {
		App.addListener("backButton", ({ canGoBack }) => {
			if (hasActiveCloseable() && closeHighestPriority()) return;
			if (document.querySelector(".cw-context-menu-layer")) {
				closeUnifiedContextMenu();
				return;
			}
			if (document.querySelector(".env-shell-app-menu[data-open]")) {
				document.querySelector(".env-shell-app-menu")?.dispatchEvent(new CustomEvent("env-app-menu-request-close", { bubbles: true }));
				return;
			}
			if (isChromeFlyoutOpen("quick-settings")) {
				closeChromeFlyout("quick-settings");
				return;
			}
			if (isChromeFlyoutOpen("calendar")) {
				closeChromeFlyout("calendar");
				return;
			}
			const dialog = document.querySelector("dialog[open], .speed-dial-editor");
			if (dialog) {
				dialog.close?.();
				dialog.remove?.();
				return;
			}
			if (canGoBack) {
				history.back();
				return;
			}
		});
	} catch (e) {
		console.warn("[overlay-back] Capacitor backButton bind failed", e);
	}
};
var registerShellOverlays = () => {
	registerCloseable({
		id: "ctx-menu-layer",
		priority: ClosePriority.CONTEXT_MENU,
		isActive: () => Boolean(document.querySelector(".cw-context-menu-layer")),
		close: () => {
			closeUnifiedContextMenu();
			return true;
		}
	});
	registerCloseable({
		id: "app-menu-overlay",
		priority: ClosePriority.SIDEBAR,
		isActive: () => Boolean(document.querySelector(".env-shell-app-menu[data-open]")),
		close: () => {
			document.querySelector(".env-shell-app-menu")?.dispatchEvent(new CustomEvent("env-app-menu-request-close", { bubbles: true }));
			return true;
		}
	});
	registerCloseable({
		id: "chrome-flyouts",
		priority: ClosePriority.OVERLAY,
		isActive: () => isChromeFlyoutOpen("quick-settings") || isChromeFlyoutOpen("calendar"),
		close: () => {
			closeChromeFlyout("quick-settings");
			closeChromeFlyout("calendar");
			return true;
		}
	});
	registerCloseable({
		id: "speed-dial-editor",
		priority: ClosePriority.MODAL,
		isActive: () => Boolean(document.querySelector("dialog.speed-dial-editor[open], dialog.sd-icon-picker[open]")),
		close: () => {
			document.querySelectorAll("dialog.speed-dial-editor[open], dialog.sd-icon-picker[open]").forEach((d) => {
				try {
					d.close();
				} catch {
					d.remove();
				}
			});
			return true;
		}
	});
};
/** Idempotent — Speed Dial / TaskBar / App Menu can all call this. */
var installLauncherBackStack = () => {
	const g = globalThis;
	if (g.__CWSP_LAUNCHER_BACK_STACK__) {
		installCapacitorBackButton();
		return;
	}
	g.__CWSP_LAUNCHER_BACK_STACK__ = true;
	try {
		initBackNavigation({
			preventDefaultNavigation: true,
			pushInitialState: true
		});
	} catch {}
	registerShellOverlays();
	installCapacitorBackButton();
};
//#endregion
export { closeChromeFlyout as C, tileIconFetchSize as S, isClientPointOverSpeedDial as _, getCachedIconResourceObjectUrl as a, pinLauncherAppEntry as b, isAndroidIconRef as c, applyIconScaleToPaintedNodes as d, applyItemIconScaleToElement as f, findNextFreeSpeedDialCell as g, captureSpeedDialSnapshot as h, ensureLauncherIconObjectUrl as i, ICON_BITMAP_SCALE_OPTIONS as l, buildLauncherAppDragEnvelope as m, attachIconResourcePickButton as n, getCachedLauncherIconObjectUrl as o, applySpeedDialSnapshot as p, applyLauncherIconToUiIcon as r, resolveIconResourceUrl as s, installLauncherBackStack as t, addSpeedDialItem as u, normalizeItemIconBitmapScale as v, getSpeedDialViewOpener as w, resolveSpeedDialCellFromClientPoint as x, parseSpeedDialItemFromJSON as y };
