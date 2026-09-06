import { r as __exportAll } from "./rolldown-runtime.js";
import { _ as saveUIState, g as makeUIState, v as decodeDesktopState, y as loadDesktopRaw } from "../vendor/culori.js";
import { t as JSOX } from "../vendor/jsox.js";
import { w as resolveEntryIcon } from "../com/app3.js";
import { A as resolveFsBackend, j as subscribeFsBackendRegister } from "../com/app4.js";
import { makeObjectAssignable, observe, safe, stringRef } from "/fest/object.js";
//#region ../../modules/views/home-view/src/ts/layout.ts
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
/**
* Convert persisted logical coordinates to visible CSS-grid coordinates.
*
* Persisted cells always use the unrotated grid. Only this projection changes
* when `orient` changes, so rotating the root never rewrites user state.
*/
var logicalToVisualCell = (cell, layout, orient) => {
	const [columns, rows] = normalizeLayout(layout);
	const normalizedOrient = normalizeOrient(orient);
	const x = clamp(Math.floor(Number(cell?.[0]) || 0), 0, columns - 1);
	const y = clamp(Math.floor(Number(cell?.[1]) || 0), 0, rows - 1);
	switch (normalizedOrient) {
		case 1: return [y, columns - 1 - x];
		case 2: return [columns - 1 - x, rows - 1 - y];
		case 3: return [rows - 1 - y, x];
		default: return [x, y];
	}
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
var normalizeSpan = (span) => [Math.max(1, Math.min(8, Math.floor(Number(span?.[0]) || 1))), Math.max(1, Math.min(8, Math.floor(Number(span?.[1]) || 1)))];
/** Visual span tracks swap with columns/rows on odd orientations. */
var logicalToVisualSpan = (span, orient) => {
	const [cols, rows] = normalizeSpan(span);
	return normalizeOrient(orient) % 2 ? [rows, cols] : [cols, rows];
};
var cellsForSpan = (origin, span) => {
	const [sx, sy] = normalizeSpan(span);
	const x0 = Math.floor(Number(origin?.[0]) || 0);
	const y0 = Math.floor(Number(origin?.[1]) || 0);
	const cells = [];
	for (let y = 0; y < sy; y += 1) for (let x = 0; x < sx; x += 1) cells.push([x0 + x, y0 + y]);
	return cells;
};
var markOccupiedSpan = (occupied, origin, span) => {
	for (const cell of cellsForSpan(origin, span)) occupied.add(cellKey(cell));
};
var spanFits = (origin, span, layout) => {
	const [columns, rows] = normalizeLayout(layout);
	const [sx, sy] = normalizeSpan(span);
	const x = Math.floor(Number(origin?.[0]) || 0);
	const y = Math.floor(Number(origin?.[1]) || 0);
	return x >= 0 && y >= 0 && x + sx <= columns && y + sy <= rows;
};
var rectConflicts = (origin, span, occupied) => cellsForSpan(origin, span).some((cell) => occupied.has(cellKey(cell)));
/**
* Nearest logical origin where `span` fits and none of its cells are occupied.
* INVARIANT: origin is the top-left of the rectangle in logical space.
*/
var findNearestFreeRect = (preferred, span, occupied, layout, maxSearchRadius) => {
	const normalizedLayout = normalizeLayout(layout);
	const [sx, sy] = normalizeSpan(span);
	const [columns, rows] = normalizedLayout;
	const maxX = Math.max(0, columns - sx);
	const maxY = Math.max(0, rows - sy);
	const start = [clamp(Math.floor(Number(preferred?.[0]) || 0), 0, maxX), clamp(Math.floor(Number(preferred?.[1]) || 0), 0, maxY)];
	if (spanFits(start, [sx, sy], normalizedLayout) && !rectConflicts(start, [sx, sy], occupied)) return start;
	const maxRadius = Math.min(Math.max(columns, rows), Number.isFinite(Number(maxSearchRadius)) ? Math.max(0, Math.floor(Number(maxSearchRadius))) : Math.max(columns, rows));
	for (let radius = 1; radius <= maxRadius; radius += 1) for (let y = Math.max(0, start[1] - radius); y <= Math.min(maxY, start[1] + radius); y += 1) for (let x = Math.max(0, start[0] - radius); x <= Math.min(maxX, start[0] + radius); x += 1) {
		if (Math.abs(x - start[0]) !== radius && Math.abs(y - start[1]) !== radius) continue;
		const candidate = [x, y];
		if (spanFits(candidate, [sx, sy], normalizedLayout) && !rectConflicts(candidate, [sx, sy], occupied)) return candidate;
	}
	return start;
};
/** Clamp a logical cell to the supplied grid. */
var clampLogicalCell = (cell, layout) => {
	const [columns, rows] = normalizeLayout(layout);
	return [clamp(Math.floor(Number(cell?.[0]) || 0), 0, columns - 1), clamp(Math.floor(Number(cell?.[1]) || 0), 0, rows - 1)];
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
var relocateItemsToLayout = (items, layout, getSpan) => {
	const normalized = normalizeLayout(layout);
	const [columns, rows] = normalized;
	const inBounds = [];
	const overflow = [];
	for (const item of items) {
		if (!item?.cell) continue;
		const [x, y] = readCell(item);
		const span = normalizeSpan(getSpan?.(item));
		if (x >= 0 && y >= 0 && x + span[0] <= columns && y + span[1] <= rows) inBounds.push(item);
		else overflow.push(item);
	}
	const occupied = /* @__PURE__ */ new Set();
	let changed = false;
	const place = (item, preferred) => {
		const span = normalizeSpan(getSpan?.(item));
		const cell = findNearestFreeRect(preferred, span, occupied, normalized);
		markOccupiedSpan(occupied, cell, span);
		if (writeCell(item, cell)) changed = true;
	};
	for (const item of inBounds) place(item, readCell(item));
	for (const item of overflow) place(item, clampLogicalCell(readCell(item), normalized));
	return changed;
};
//#endregion
//#region ../../modules/views/home-view/src/ts/link-store.ts
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
		"items",
		"curatedEmpty"
	]);
	if (raw && typeof raw === "object") {
		if (raw.mirrorPath != null) meta.mirrorPath = String(raw.mirrorPath);
		if (raw.grid != null) meta.grid = raw.grid;
		if (raw.curatedEmpty === true) meta.curatedEmpty = true;
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
	if (metaParsed && typeof metaParsed === "object" && metaParsed.curatedEmpty === true) {
		const meta = normalizeLegacyMeta({
			...metaParsed,
			items: {}
		}, []);
		meta.curatedEmpty = true;
		return {
			items: [],
			meta
		};
	}
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
		"items",
		"curatedEmpty"
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
async function writeLinkStore(io, items, meta, options) {
	const list = Array.isArray(items) ? items.filter((item) => item?.id) : [];
	if (!list.length && !options?.allowEmpty) {
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
		items: list.length ? meta?.items ?? {} : {},
		grid: meta?.grid,
		...list.length ? {} : { curatedEmpty: true }
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
//#region ../../modules/views/home-view/src/ts/tile-icon.ts
var ICON_DISPLAY_OPTIONS = [
	{
		value: "glyph",
		label: "Glyph (Phosphor)"
	},
	{
		value: "masked",
		label: "Masked"
	},
	{
		value: "masked-inverse",
		label: "Masked inverse"
	},
	{
		value: "colored",
		label: "Colored"
	}
];
var TILE_SHAPE_OPTIONS = [
	{
		value: "circle",
		label: "Circle"
	},
	{
		value: "squircle",
		label: "Squircle"
	},
	{
		value: "square",
		label: "Rounded square"
	},
	{
		value: "wavy",
		label: "Wavy"
	},
	{
		value: "shapeless",
		label: "Shapeless"
	}
];
var isTileShapeValue = (raw) => {
	const v = String(raw || "").trim().toLowerCase();
	return v === "circle" || v === "squircle" || v === "square" || v === "wavy" || v === "shapeless";
};
function isShapelessTileShape(raw) {
	return String(raw || "").trim().toLowerCase() === "shapeless";
}
/**
* WHY: glyphs sit on the figure, not the photo. Wallpaper contrast is white on dark
* wood — invisible on a light-gray plate. `contrast-color()` dies on Capacitor WebView.
*/
function syncPlateGlyphInk(host) {
	if (!host || host.classList.contains("sd-widget-host") || host.dataset.widget) return;
	const shape = String(host.getAttribute("data-shape") || "");
	if (shape === "shapeless" || shape === "none") {
		host.style.removeProperty("--sd-figure-ink");
		return;
	}
	const m = (getComputedStyle(host).backgroundColor || "").match(/rgba?\(\s*([\d.]+)[,\s/]+([\d.]+)[,\s/]+([\d.]+)/i);
	if (!m) return;
	const r = Number(m[1]);
	const g = Number(m[2]);
	const b = Number(m[3]);
	if (![
		r,
		g,
		b
	].every((n) => Number.isFinite(n))) return;
	const rn = r > 1 ? r / 255 : r;
	const gn = g > 1 ? g / 255 : g;
	const bn = b > 1 ? b / 255 : b;
	const luma = .2126 * rn + .7152 * gn + .0722 * bn;
	host.style.setProperty("--sd-figure-ink", luma > .52 ? "#141416" : "#f7f7f8");
}
/**
* WHY: shapeless has no plate — a black blurred clone of the bitmap/glyph
* sits under the real icon so the shadow follows the icon silhouette.
*/
function syncShapelessIconShadow(host) {
	if (!host) return;
	host.querySelectorAll(".sd-icon-silhouette").forEach((node) => node.remove());
	if (!isShapelessTileShape(host.getAttribute("data-shape"))) return;
	const img = host.querySelector("img:not(.sd-icon-silhouette)");
	if (img) {
		if (img.src) {
			const clone = img.cloneNode(true);
			clone.className = "sd-icon-silhouette";
			clone.removeAttribute("data-launcher-icon");
			clone.removeAttribute("data-bookmark-favicon");
			clone.removeAttribute("data-icon-pending");
			clone.removeAttribute("data-icon-pack");
			clone.alt = "";
			clone.setAttribute("aria-hidden", "true");
			img.before(clone);
		}
		if (!img.complete) img.addEventListener("load", () => syncShapelessIconShadow(host), { once: true });
		return;
	}
	const icon = host.querySelector("ui-icon:not(.sd-icon-silhouette)");
	if (!icon) return;
	const clone = icon.cloneNode(true);
	clone.classList.add("sd-icon-silhouette");
	clone.setAttribute("aria-hidden", "true");
	icon.before(clone);
}
function normalizeIconDisplay(raw) {
	const v = String(raw || "").trim().toLowerCase();
	if (v === "glyph" || v === "phosphor" || v === "name") return "glyph";
	if (v === "masked" || v === "mask") return "masked";
	if (v === "masked-inverse" || v === "mask-invert" || v === "invert") return "masked-inverse";
	if (v === "colored" || v === "color" || v === "bitmap" || v === "resource") return "colored";
	return "";
}
function normalizeTileShape$1(raw, fallback = "squircle") {
	const v = String(raw || "").trim().toLowerCase();
	if (isTileShapeValue(v)) return v;
	return fallback;
}
/** Bitmap CSS mode for `ui-icon` (glyph has no bitmap mode). */
function iconDisplayToBitmapMode(display) {
	if (display === "glyph") return null;
	return display;
}
/** Build a `ui-icon` host for a tile; applies resource + locked bitmap mode when needed. */
function createTileUiIconElement(opts) {
	const host = document.createElement("ui-icon");
	const glyph = String(opts.glyph || "sparkle").trim() || "sparkle";
	const resource = String(opts.resourceUrl || "").trim();
	const display = normalizeIconDisplay(opts.display) || (resource ? "colored" : "glyph");
	const className = String(opts.className || "ui-ws-item-icon-native").trim();
	if (className) host.className = className;
	host.setAttribute("aria-hidden", "true");
	host.setAttribute("icon-style", "duotone");
	if (opts.launcher || display !== "glyph") {
		host.toggleAttribute("data-launcher-icon", true);
		host.setAttribute("icon-padding", "0");
		host.style.setProperty("--icon-padding", "0px");
		host.style.setProperty("--icon-size", "100%");
	}
	if (display === "glyph") {
		host.setAttribute("icon", glyph);
		host.setAttribute("icon-source", "phosphor");
		host.removeAttribute("resource");
		host.removeAttribute("data-icon-bitmap");
		host.removeAttribute("data-icon-bitmap-mode");
		host.removeAttribute("data-icon-bitmap-locked");
		host.removeAttribute("data-icon-pending");
		return host;
	}
	if (!resource) {
		host.removeAttribute("icon");
		host.setAttribute("icon-source", "resource");
		host.removeAttribute("resource");
		host.toggleAttribute("data-icon-pending", true);
		host.removeAttribute("data-icon-bitmap");
		host.removeAttribute("data-icon-bitmap-mode");
		host.removeAttribute("data-icon-bitmap-locked");
		return host;
	}
	host.removeAttribute("icon");
	host.setAttribute("icon-source", "resource");
	const bitmapMode = iconDisplayToBitmapMode(display) || "colored";
	host.setAttribute("data-icon-bitmap-mode", bitmapMode);
	host.toggleAttribute("data-icon-bitmap-locked", true);
	host.setAttribute("resource", resource);
	const apply = () => {
		const icon = host;
		if (typeof icon.setResourceIcon === "function") {
			icon.setResourceIcon(resource, bitmapMode);
			icon.setBitmapPresentationMode?.(bitmapMode, true);
		}
	};
	apply();
	customElements.whenDefined("ui-icon").then(() => {
		if (!host.isConnected) {
			queueMicrotask(() => {
				if (host.isConnected) apply();
			});
			return;
		}
		apply();
	});
	return host;
}
/** Auto-attached on URL paste — not a user-chosen bitmap. */
function isAutoLinkFaviconUrl(raw) {
	return String(raw || "").trim().toLowerCase().includes("google.com/s2/favicons");
}
/**
* Glyph tiles appear at compact (0.78). Explicit per-tile scale always wins;
* bitmaps keep `auto` → workspace fill.
*/
function defaultIconScaleForDisplay(display, rawItemScale) {
	const raw = String(rawItemScale || "").trim().toLowerCase();
	if (raw && raw !== "auto" && raw !== "default" && raw !== "inherit") return String(rawItemScale || raw).trim();
	return normalizeIconDisplay(display) === "glyph" ? "compact" : raw || "auto";
}
/** Infer default display when meta.iconDisplay is unset. */
function inferIconDisplay(input) {
	const explicit = normalizeIconDisplay(input.iconDisplay);
	if (explicit) return explicit;
	if (input.isLauncherApp) return "colored";
	if (input.isBookmarkFavicon) return "colored";
	const url = String(input.iconUrl || "").trim();
	if (url && !isAutoLinkFaviconUrl(url)) return "colored";
	return "glyph";
}
//#endregion
//#region ../../modules/views/home-view/src/ts/launcher-state.ts
var launcher_state_exports = /* @__PURE__ */ __exportAll({
	ICON_BITMAP_SCALE_OPTIONS: () => ICON_BITMAP_SCALE_OPTIONS,
	NAVIGATION_SHORTCUTS: () => NAVIGATION_SHORTCUTS,
	SPEED_DIAL_CLIP_KIND: () => SPEED_DIAL_CLIP_KIND,
	SPEED_DIAL_MUTATION_EVENT: () => SPEED_DIAL_MUTATION_EVENT,
	addClonedSpeedDialItem: () => addClonedSpeedDialItem,
	addSpeedDialItem: () => addSpeedDialItem,
	applyGridSettings: () => applyGridSettings,
	applyIconBitmapScaleCss: () => applyIconBitmapScaleCss,
	applyIconScaleToPaintedNodes: () => applyIconScaleToPaintedNodes,
	applyItemIconScaleToElement: () => applyItemIconScaleToElement,
	applySpeedDialSnapshot: () => applySpeedDialSnapshot,
	buildSpeedDialViewPathHref: () => buildSpeedDialViewPathHref,
	canUseNativeOpenUri: () => canUseNativeOpenUri,
	captureSpeedDialSnapshot: () => captureSpeedDialSnapshot,
	cloneSpeedDialItemPacked: () => cloneSpeedDialItemPacked,
	copySpeedDialItemToClipboard: () => copySpeedDialItemToClipboard,
	createEmptySpeedDialItem: () => createEmptySpeedDialItem,
	createSpeedDialItemFromClipboard: () => createSpeedDialItemFromClipboard,
	createWidgetSpeedDialItem: () => createWidgetSpeedDialItem,
	defaultOpenLinkTargetForHref: () => defaultOpenLinkTargetForHref,
	defaultWidgetSpan: () => defaultWidgetSpan,
	emitSpeedDialMutation: () => emitSpeedDialMutation,
	ensureSpeedDialMeta: () => ensureSpeedDialMeta,
	findNextFreeCellInSnapshot: () => findNextFreeCellInSnapshot,
	findNextFreeSpeedDialCell: () => findNextFreeSpeedDialCell,
	findSpeedDialItem: () => findSpeedDialItem,
	forgetSpeedDialIconBlob: () => forgetSpeedDialIconBlob,
	getDefaultOpenLinkTarget: () => getDefaultOpenLinkTarget,
	getDefaultSpeedDialAction: () => getDefaultSpeedDialAction,
	getDefaultTileShape: () => getDefaultTileShape,
	getIconBitmapScale: () => getIconBitmapScale,
	getItemSpan: () => getItemSpan,
	getSpeedDialMeta: () => getSpeedDialMeta,
	getSpeedDialMirrorPath: () => getSpeedDialMirrorPath,
	gridLayoutState: () => gridLayoutState,
	iconBitmapScaleCss: () => iconBitmapScaleCss,
	isCoreRailGridTile: () => isCoreRailGridTile,
	isExternalWebHref: () => isExternalWebHref,
	isMirrorMode: () => isMirrorMode,
	isSpeedDialVirtualPath: () => isSpeedDialVirtualPath,
	looksLikeSpeedDialShortcutJson: () => looksLikeSpeedDialShortcutJson,
	markSpeedDialUserEditBeforeHydrate: () => markSpeedDialUserEditBeforeHydrate,
	mirrorPathState: () => mirrorPathState,
	mirrorSpeedDialItems: () => mirrorSpeedDialItems,
	normalizeExternalWebHref: () => normalizeExternalWebHref,
	normalizeIconBitmapScale: () => normalizeIconBitmapScale,
	normalizeItemIconBitmapScale: () => normalizeItemIconBitmapScale,
	normalizeOpenLinkTarget: () => normalizeOpenLinkTarget,
	normalizeTileShape: () => normalizeTileShape,
	openInDetachedBrowserWindow: () => openInDetachedBrowserWindow,
	openInNewBrowserTab: () => openInNewBrowserTab,
	packSpeedDialItem: () => packSpeedDialItem,
	packSpeedDialMetaPlain: () => packSpeedDialMetaPlain,
	parseSpeedDialItemFromJSON: () => parseSpeedDialItemFromJSON,
	parseSpeedDialItemFromSmartText: () => parseSpeedDialItemFromSmartText,
	parseSpeedDialItemFromURL: () => parseSpeedDialItemFromURL,
	parseSpeedDialItemFromVirtualPath: () => parseSpeedDialItemFromVirtualPath,
	parseSpeedDialViewFromHref: () => parseSpeedDialViewFromHref,
	persistGridLayout: () => persistGridLayout,
	persistSpeedDialIconBlob: () => persistSpeedDialIconBlob,
	persistSpeedDialItems: () => persistSpeedDialItems,
	persistSpeedDialMeta: () => persistSpeedDialMeta,
	persistWallpaper: () => persistWallpaper,
	refreshSpeedDialMirror: () => refreshSpeedDialMirror,
	rememberDismissedAndroidShortcut: () => rememberDismissedAndroidShortcut,
	removeSpeedDialItem: () => removeSpeedDialItem,
	removeSpeedDialMeta: () => removeSpeedDialMeta,
	resolveIconScaleFactor: () => resolveIconScaleFactor,
	resolveItemOpenLinkTarget: () => resolveItemOpenLinkTarget,
	resolveSpeedDialIconUrl: () => resolveSpeedDialIconUrl,
	resolveSpeedDialItemHref: () => resolveSpeedDialItemHref,
	setDefaultOpenLinkTarget: () => setDefaultOpenLinkTarget,
	setItemSpan: () => setItemSpan,
	setSpeedDialMirrorPath: () => setSpeedDialMirrorPath,
	snapshotSpeedDialItem: () => snapshotSpeedDialItem,
	speedDialItems: () => speedDialItems,
	speedDialMeta: () => speedDialMeta,
	stripCoreRailTilesFromGrid: () => stripCoreRailTilesFromGrid,
	tileIconFetchSize: () => tileIconFetchSize,
	upsertSpeedDialItem: () => upsertSpeedDialItem,
	wallpaperState: () => wallpaperState,
	wasSpeedDialUserEdited: () => wasSpeedDialUserEdited
});
var viewEnabledCheck = null;
var isEnabledView = (view) => viewEnabledCheck ? viewEnabledCheck(String(view || "").trim()) : true;
var OPEN_LINK_TARGET_KEY = "rs-open-link-target";
var normalizeOpenLinkTarget = (raw) => {
	const v = String(raw || "").trim().toLowerCase();
	if (!v) return "inline";
	if (v === "inline" || v === "in-shell" || v === "env" || v === "shell") return "inline";
	if (v === "new-tab" || v === "newtab" || v === "tab" || v === "browser" || v === "browser-tab" || v === "external-tab") return "new-tab";
	if (v === "external-app" || v === "app" || v === "chooser" || v === "open-with" || v === "open-in-app" || v === "intent") return "external-app";
	if (v === "viewer" || v === "markdown") return "viewer";
	if (v === "document" || v === "cwsp-document") return "document";
	if (v === "explorer" || v === "files") return "explorer";
	if (v === "workcenter" || v === "process" || v === "cwsp-process") return "workcenter";
	if (v === "transfer" || v === "cwsp" || v === "cwsp-transfer" || v === "network") return "transfer";
	if (v === "native-window" || v === "native" || v === "window" || v === "app-window") return "native-window";
	return "inline";
};
/** True for http(s), protocol-relative, or bare `www.` hosts (not app view paths). */
var isExternalWebHref = (raw) => {
	const s = String(raw || "").trim();
	if (!s || /^(mailto:|blob:|data:|javascript:)/i.test(s)) return false;
	if (/^https?:\/\//i.test(s) || /^\/\//.test(s)) return true;
	if (/^www\./i.test(s)) return true;
	if (/^[a-z0-9][a-z0-9.-]*\.[a-z]{2,}([/:?#]|$)/i.test(s) && !s.startsWith("/") && !s.startsWith("#")) return true;
	return false;
};
/** Normalize `www…` / `//…` / bare host into an absolute http(s) URL. */
var normalizeExternalWebHref = (raw) => {
	const s = String(raw || "").trim();
	if (!s) return "";
	try {
		if (/^https?:\/\//i.test(s)) return new URL(s).href;
		if (/^\/\//.test(s)) return new URL(`https:${s}`).href;
		if (/^www\./i.test(s) || /^[a-z0-9][a-z0-9.-]*\.[a-z]{2,}([/:?#]|$)/i.test(s)) return new URL(`https://${s.replace(/^\/+/, "")}`).href;
	} catch {
		return "";
	}
	return "";
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
/** http(s) tiles open in a new tab (or Cap chooser). App views stay inline unless set. */
var defaultOpenLinkTargetForHref = (href) => {
	if (prefersExternalAppOpenLink()) return "external-app";
	if (isExternalWebHref(href)) return "new-tab";
	return getDefaultOpenLinkTarget();
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
var resolveItemOpenLinkTarget = (meta) => {
	const raw = meta?.openLinkTarget != null ? String(meta.openLinkTarget).trim() : "";
	if (raw) return normalizeOpenLinkTarget(raw);
	return defaultOpenLinkTargetForHref(meta?.href);
};
/** True only on Capacitor native — web must not await the bridge before window.open. */
var canUseNativeOpenUri = () => {
	try {
		const c = globalThis.Capacitor;
		return typeof c?.isNativePlatform === "function" && !!c.isNativePlatform();
	} catch {
		return false;
	}
};
/** WHY: document PWA disables Network at build time — hide it from add-shortcut menus too. */
var NAVIGATION_SHORTCUTS = [
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
		icon: "books"
	},
	{
		view: "explorer",
		label: "Explorer",
		icon: "folder"
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
/** User mutations use this to keep the active workspace snapshot authoritative. */
var SPEED_DIAL_MUTATION_EVENT = "cwsp:speed-dial-mutation";
var emitSpeedDialMutation = (kind, id) => {
	try {
		window.dispatchEvent(new CustomEvent(SPEED_DIAL_MUTATION_EVENT, { detail: {
			kind,
			id
		} }));
	} catch {}
};
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
var ICON_BLOB_LS = "cw::speed-dial::icon-blob::";
var ICON_PTR = "sd-icon:";
var APPEARANCE_META_KEYS = [
	"shape",
	"iconDisplay",
	"iconUrl",
	"iconScale",
	"iconCacheKey"
];
var isInlineIconUrl = (url) => /^data:/i.test(url);
var isEphemeralIconUrl = (url) => /^blob:/i.test(url);
/** Plain meta for persist/snapshots — observe proxies must not leak into LS/catalog. */
var packSpeedDialMetaPlain = (meta) => {
	const src = (meta ? safe(meta) : {}) || {};
	const out = {};
	for (const [key, raw] of Object.entries(src)) {
		if (raw == null || raw === "") continue;
		let value = raw;
		if (typeof raw === "object" && raw && "value" in raw) {
			value = raw.value;
			if (value == null || value === "") continue;
		}
		out[key] = value;
	}
	if (isEphemeralIconUrl(String(out.iconUrl || ""))) delete out.iconUrl;
	return out;
};
var persistSpeedDialIconBlob = (id, iconUrl) => {
	const itemId = String(id || "").trim();
	const url = String(iconUrl || "").trim();
	if (!itemId || !isInlineIconUrl(url)) return url;
	try {
		localStorage.setItem(ICON_BLOB_LS + itemId, url);
		return ICON_PTR + itemId;
	} catch {
		return ICON_PTR + itemId;
	}
};
var resolveSpeedDialIconUrl = (id, iconUrl) => {
	const url = String(iconUrl || "").trim();
	const itemId = (url.startsWith(ICON_PTR) ? url.slice(8) : String(id || "")).trim();
	if (url.startsWith(ICON_PTR) || !url && itemId) try {
		const stored = localStorage.getItem(ICON_BLOB_LS + itemId);
		if (stored) return stored;
	} catch {}
	return url;
};
var forgetSpeedDialIconBlob = (id) => {
	const itemId = String(id || "").trim();
	if (!itemId) return;
	try {
		localStorage.removeItem(ICON_BLOB_LS + itemId);
	} catch {}
};
var mergeMetaKeepingAppearance = (existing, incoming) => {
	const prev = packSpeedDialMetaPlain(existing);
	const next = packSpeedDialMetaPlain(incoming);
	const out = {
		...prev,
		...next
	};
	for (const key of APPEARANCE_META_KEYS) {
		const keep = String(prev[key] || "").trim();
		if (!String(next[key] || "").trim() && keep) out[key] = keep;
	}
	const prevUrl = String(prev.iconUrl || "");
	const nextUrl = String(next.iconUrl || "");
	if (prevUrl && (!nextUrl || nextUrl.startsWith(ICON_PTR)) && !nextUrl.startsWith("android-icon:")) {
		if (isInlineIconUrl(prevUrl) || prevUrl.startsWith(ICON_PTR)) out.iconUrl = prevUrl;
	}
	return out;
};
var durableMetaForPersist = (id, meta) => {
	const packed = packSpeedDialMetaPlain(meta);
	const url = String(packed.iconUrl || "");
	if (isInlineIconUrl(url)) packed.iconUrl = persistSpeedDialIconBlob(id, url);
	return packed;
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
	const kind = String(meta.widgetKind || "").toLowerCase();
	const inferredAction = String(meta.action || "").trim() || (kind === "search" || kind === "android" ? "widget" : "open-view");
	return makeObjectAssignable(observe({
		view: meta.view || "",
		href: meta.href || "",
		description: meta.description || "",
		entityType: meta.entityType || "",
		tags: Array.isArray(meta.tags) ? [...meta.tags] : [],
		...meta,
		action: inferredAction
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
		payload[id] = durableMetaForPersist(id, meta);
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
		editGen: 0,
		allowEmptyOpfsWrite: false
	};
	return g[LINK_STORE_BOOT];
};
var markIntentionalEmptyGrid = () => {
	const boot = linkStoreBoot();
	boot.allowEmptyOpfsWrite = true;
};
var MIRROR_PATH_LS_KEY = "cw::workspace::speed-dial::mirror-path";
var mirrorPathState = stringRef("");
var mirrorSpeedDialItems = observe([]);
var isMirrorMode = () => Boolean(String(mirrorPathState.value || "").trim());
function getSpeedDialMirrorPath() {
	const v = String(mirrorPathState.value || "").trim();
	return v ? v : null;
}
/**
* Persist `mirrorPath` into OPFS `meta.json` (canonical) and an LS backup key.
* WHY: OPFS is async + durable; LS keeps the value when OPFS is unavailable
* (private mode / quota) so the mode survives reloads on hosts without OPFS.
*/
function setSpeedDialMirrorPath(path) {
	const normalized = path ? String(path).trim() : "";
	if (normalized === String(mirrorPathState.value || "").trim()) return;
	markUserEditedBeforeHydrate();
	mirrorPathState.value = normalized;
	try {
		if (typeof localStorage !== "undefined") {
			if (normalized) localStorage.setItem(MIRROR_PATH_LS_KEY, normalized);
			else localStorage.removeItem(MIRROR_PATH_LS_KEY);
		}
	} catch {}
	persistSpeedDialMeta();
	refreshSpeedDialMirror();
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
/** True when pin/share/edit landed this session — Side snapshots must not splice over it. */
var wasSpeedDialUserEdited = () => {
	const boot = linkStoreBoot();
	return boot.userEditedBeforeHydrate === true || (boot.editGen || 0) > 0;
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
		perId[id] = durableMetaForPersist(id, meta);
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
		const allowEmpty = boot.allowEmptyOpfsWrite === true && !speedDialItems?.length;
		await writeLinkStore(boot.opfsIo, items, meta, { allowEmpty });
		if (allowEmpty) boot.allowEmptyOpfsWrite = false;
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
		if (got.meta.mirrorPath != null) mirrorPathState.value = String(got.meta.mirrorPath || "");
		if (speedDialItems?.length) {
			for (const [id, meta] of nextMeta) if (!getSpeedDialMeta(id)) ensureSpeedDialMeta(id, packSpeedDialMetaPlain(meta));
			stripCoreRailTilesFromGrid({ markDirty: true });
			return;
		}
		speedDialItems.splice(0, speedDialItems.length, ...nextItems);
		for (const [id, meta] of nextMeta) ensureSpeedDialMeta(id, mergeMetaKeepingAppearance(getSpeedDialMeta(id), meta));
		stripCoreRailTilesFromGrid({ markDirty: true });
	} catch (e) {
		console.warn("[link-store] OPFS hydration failed; using localStorage boot state", e);
		linkStoreBoot().opfsHydrated = true;
		stripCoreRailTilesFromGrid({ markDirty: true });
	}
};
var skipLinkStoreOpfs = () => {
	try {
		if (String(document.documentElement?.dataset?.cwspSku || "").toLowerCase() === "document") return true;
		const host = String(location.hostname || "").toLowerCase();
		if (/(^|\.)md\.u2re\.space$/.test(host)) return true;
	} catch {}
	return false;
};
var initLinkStore = () => {
	const boot = linkStoreBoot();
	if (boot.opfsReady) return boot.opfsReady;
	boot.opfsReady = (async () => {
		const ls = getLsLike();
		if (skipLinkStoreOpfs()) {
			boot.opfsIo = null;
			boot.opfsHydrated = true;
			return;
		}
		try {
			boot.opfsIo = await Promise.race([createOpfsLinkStoreIo(), new Promise((_, reject) => {
				setTimeout(() => reject(/* @__PURE__ */ new Error("[link-store] OPFS getDirectory timeout")), 800);
			})]);
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
var DISMISSED_PINS_KEY = "cw::launcher::dismissed-pins";
var DISMISSED_PINS_BOOT = "__CWSP_DISMISSED_PINS_V1__";
var dismissedPinKey = (pkg, sid) => `${String(pkg || "").trim()}::${String(sid || "").trim()}`;
var dismissedPinsSlot = () => {
	const g = globalThis;
	if (g[DISMISSED_PINS_BOOT]) return g[DISMISSED_PINS_BOOT];
	const at = /* @__PURE__ */ new Map();
	try {
		const raw = localStorage.getItem(DISMISSED_PINS_KEY);
		const parsed = raw ? JSON.parse(raw) : [];
		if (Array.isArray(parsed)) for (const row of parsed) {
			if (typeof row === "string") {
				const k = row.trim();
				if (k && k !== "::") at.set(k, 1);
				continue;
			}
			const k = String(row?.k || "").trim();
			const t = Number(row?.t || 0);
			if (k && k !== "::") at.set(k, t || 1);
		}
	} catch {}
	g[DISMISSED_PINS_BOOT] = { at };
	return g[DISMISSED_PINS_BOOT];
};
var persistDismissedPins = () => {
	try {
		const rows = [...dismissedPinsSlot().at.entries()].map(([k, t]) => ({
			k,
			t
		}));
		localStorage.setItem(DISMISSED_PINS_KEY, JSON.stringify(rows));
	} catch {}
};
var rememberDismissedAndroidShortcut = (pkg, sid) => {
	const key = dismissedPinKey(pkg, sid);
	if (key === "::") return;
	dismissedPinsSlot().at.set(key, Date.now());
	persistDismissedPins();
	globalThis.__CWSP_ACK_PIN_AFTER_REMOVE__ = true;
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
var packSpeedDialItem = (item) => {
	const packed = serializeItemState(item);
	const meta = getSpeedDialMeta(item.id);
	return {
		...packed,
		...meta ? { meta: durableMetaForPersist(item.id, meta) } : {}
	};
};
var captureSpeedDialSnapshot = () => ({ items: (speedDialItems || []).map((item) => packSpeedDialItem(item)) });
var applySpeedDialSnapshot = (snapshot) => {
	markUserEditedBeforeHydrate();
	const rows = Array.isArray(snapshot?.items) ? snapshot.items : [];
	const nextItems = [];
	for (const raw of rows) {
		if (!raw?.id) continue;
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
	if (!nextItems.length) markIntentionalEmptyGrid();
	for (const raw of rows) {
		if (!raw?.id) continue;
		const incoming = {
			action: raw.action,
			...packSpeedDialMetaPlain(raw.meta)
		};
		incoming.iconUrl = persistSpeedDialIconBlob(raw.id, String(incoming.iconUrl || ""));
		const merged = mergeMetaKeepingAppearance(getSpeedDialMeta(raw.id), incoming);
		ensureSpeedDialMeta(raw.id, merged);
	}
	persistSpeedDialItems();
	persistSpeedDialMeta();
};
var metaNumber = (value, fallback) => {
	let cur = value;
	if (cur && typeof cur === "object" && "value" in cur) cur = cur.value;
	const n = Number(cur);
	return Number.isFinite(n) && n >= 1 ? n : fallback;
};
var defaultWidgetSpan = (kind) => {
	const id = String(kind || "").toLowerCase();
	if (id === "search") return [2, 1];
	if (id === "clock") return [2, 1];
	if (id === "android") return [2, 2];
	return [1, 1];
};
var getItemSpan = (id) => {
	const meta = id ? getSpeedDialMeta(id) : null;
	const item = id ? (speedDialItems || []).find((it) => it?.id === id) : null;
	const isWidget = String(item?.action || "").toLowerCase() === "widget" || String(meta?.action || "").toLowerCase() === "widget";
	const kind = isWidget ? String(meta?.widgetKind || "").toLowerCase() : "";
	const fallback = kind ? defaultWidgetSpan(kind) : isWidget ? defaultWidgetSpan("clock") : [1, 1];
	return normalizeSpan([metaNumber(meta?.spanCols, fallback[0]), metaNumber(meta?.spanRows, fallback[1])]);
};
var setItemSpan = (id, span) => {
	const next = normalizeSpan(span);
	const meta = ensureSpeedDialMeta(id);
	meta.spanCols = next[0];
	meta.spanRows = next[1];
	persistSpeedDialMeta();
	emitSpeedDialMutation("update", id);
	return next;
};
var createWidgetSpeedDialItem = (kind, cell, extra) => {
	const span = normalizeSpan([extra?.spanCols ?? defaultWidgetSpan(kind)[0], extra?.spanRows ?? defaultWidgetSpan(kind)[1]]);
	const item = createStatefulItem({
		id: generateItemId(),
		cell: cell || findNextFreeSpeedDialCell(span),
		icon: kind === "clock" ? "clock" : kind === "search" ? "magnifying-glass" : "squares-four",
		label: String(extra?.description || "").trim() || (kind === "clock" ? "Clock" : kind === "search" ? "Search" : "Widget"),
		action: "widget"
	});
	ensureSpeedDialMeta(item.id, {
		action: "widget",
		widgetKind: kind,
		shape: getDefaultTileShape(),
		spanCols: span[0],
		spanRows: span[1],
		...extra || {}
	});
	return item;
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
		if (key === "action" && String(meta.action || "").toLowerCase() === "widget" && String(value || "").toLowerCase() !== "widget") continue;
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
	if (removed) {
		forgetSpeedDialIconBlob(id);
		persistSpeedDialMeta();
	}
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
/** Router mount prefix (`/cwsp`, `/markdown`, …) when present on `<html>`. */
var getSpeedDialRouterBase = () => {
	try {
		return String(document.documentElement?.dataset?.cwspRouterBase || "").trim().replace(/\/+$/, "");
	} catch {
		return "";
	}
};
/**
* Entry URL for a view deep link: `/settings?shell=environment[&native=1]&view=settings`
* WHY: address-bar readable path; environment keeps `/${view}` (not root `/?view=`).
* INVARIANT: open with this path; `preserveNativeDeepLink` must not strip it to `/`.
*/
var buildSpeedDialViewPathHref = (viewId, absolute = false, opts) => {
	const id = String(viewId || "").trim().replace(/^#/, "").replace(/^\/+/, "").split(/[/?#]/)[0].toLowerCase();
	if (!id) return "";
	const useNative = opts?.native === true;
	const path = `${getSpeedDialRouterBase().replace(/\/+$/, "") || ""}/${id}`.replace(/\/{2,}/g, "/") || `/${id}`;
	const normalized = path.startsWith("/") ? path : `/${path}`;
	const withQuery = useNative ? `${normalized}?shell=environment&native=1&view=${encodeURIComponent(id)}` : `${normalized}?shell=environment&view=${encodeURIComponent(id)}`;
	if (!absolute || typeof location === "undefined") return withQuery;
	try {
		const url = new URL(location.href);
		url.pathname = normalized;
		url.hash = "";
		url.search = "";
		url.searchParams.set("shell", "environment");
		url.searchParams.set("view", id);
		if (useNative) url.searchParams.set("native", "1");
		else url.searchParams.delete("native");
		return url.href;
	} catch {
		return withQuery;
	}
};
/**
* Open `href` in a **new browser tab** without navigating the current tab.
* WHY: `window.open(url, "_blank", "noopener")` returns `null` by spec even when the
* window opened — our old `if (!opened) location.assign(href)` hijacked the desktop.
* INVARIANT: never `location.assign` / `location.href =` from native/open-link paths.
*/
var openInNewBrowserTab = (href) => {
	const url = String(href || "").trim();
	if (!url || typeof window === "undefined") return false;
	try {
		let target = "_blank";
		try {
			if (typeof window.fence === "object") target = "_unfencedTop";
		} catch {
			target = "_blank";
		}
		window.open(url, target, "noreferrer,noopener");
		return true;
	} catch (e) {
		console.warn("[home-view] openInNewBrowserTab failed", e);
		return false;
	}
};
/**
* Open a **detached window** for native-window mode (never a browser tab).
*
* INVARIANT:
* - Do **not** use bare `window.open(url, "_blank")` — Chromium/Edge treat that as a **tab**.
* - Do **not** fall back to {@link openInNewBrowserTab} (that is the `new-tab` mode).
* - Do **not** request `menubar`/`toolbar`/`location` — those force full browser chrome
*   and break PWA/WCO when the window is captured as an app window.
* - Use a unique window name + `popup=yes,width,height` so each Native open is a
*   separate window. From an installed PWA, size features still open another app window.
*
* Never hijack the opener via `location.assign`.
*/
var windowOpenThrottled = Date.now();
var openInDetachedBrowserWindow = (href) => {
	const url = String(href || "").trim();
	if (!url || typeof window === "undefined") return false;
	try {
		const name = `cwsp-native-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
		const opened = Date.now() - windowOpenThrottled > 200 ? window.open(url, name, "popup,menubar=false,toolbar=false,location=false,width=1280,height=800") : null;
		windowOpenThrottled = Date.now();
		if (opened) {
			try {
				opened.opener = null;
			} catch {}
			return true;
		}
	} catch (e) {
		console.warn("[home-view] openInDetachedBrowserWindow failed", e);
	}
	return false;
};
/** True when href is (or resolves to) a same-origin app view path / bare view token. */
var parseSpeedDialViewFromHref = (raw) => {
	const input = String(raw || "").trim();
	if (!input || /^(mailto:|blob:|data:)/i.test(input)) return "";
	try {
		if (/^https?:\/\//i.test(input)) {
			const u = new URL(input);
			if (typeof location !== "undefined" && u.origin !== location.origin) return "";
			const id = (u.pathname.replace(/\/+$/, "").split("/").filter(Boolean).pop() || "").toLowerCase();
			if (!id || id === "home") return "";
			return id === "markdown" ? "viewer" : id;
		}
	} catch {
		return "";
	}
	if (input.startsWith("/")) {
		const seg = input.replace(/^\//, "").split(/[/?#]/)[0].toLowerCase();
		if (!seg || seg === "home") return "";
		return seg === "markdown" ? "viewer" : seg;
	}
	const token = input.replace(/^#/, "").split(/[/?#]/)[0].trim().toLowerCase();
	if (!token || token === "home" || /[.:]/.test(token)) return "";
	return token === "markdown" ? "viewer" : token;
};
/**
* Prefer explicit `meta.href`; for view tiles synthesize path deep links
* (`/settings`, `/workcenter`, …) for Open link → new tab / native window.
*/
var resolveSpeedDialItemHref = (item) => {
	if (!item?.id) return "";
	const meta = getSpeedDialMeta(item.id);
	const explicit = String(meta?.href || item?.href || "").trim();
	if (explicit) return explicit;
	const view = String(meta?.view || "").trim().replace(/^#/, "");
	if (!view) return "";
	return buildSpeedDialViewPathHref(view, true);
};
var findSpeedDialItem = (id) => {
	if (!id) return null;
	return speedDialItems?.find?.((item) => item?.id === id) || null;
};
var createEmptySpeedDialItem = (cell = observe([0, 0])) => {
	const action = getDefaultSpeedDialAction();
	const item = createStatefulItem({
		id: generateItemId(),
		cell,
		icon: "sparkle",
		label: "New shortcut",
		action
	});
	ensureSpeedDialMeta(item.id, {
		action,
		href: "",
		description: "",
		shape: getDefaultTileShape(),
		iconDisplay: "glyph",
		iconScale: "compact",
		openLinkTarget: getDefaultOpenLinkTarget()
	});
	return item;
};
var addSpeedDialItem = (item) => {
	markUserEditedBeforeHydrate();
	speedDialItems?.push?.(observe(item));
	syncMetaActionFromItem(item);
	persistSpeedDialItems();
	persistSpeedDialMeta();
	emitSpeedDialMutation("add", item.id);
	return item;
};
/** First unoccupied logical origin that fits `span`. */
function findNextFreeSpeedDialCell(span = [1, 1]) {
	const columns = Math.max(1, Math.min(16, Number(gridLayoutState?.columns) || 4));
	const rows = Math.max(1, Math.min(16, Number(gridLayoutState?.rows) || 8));
	const occupied = /* @__PURE__ */ new Set();
	for (const item of speedDialItems || []) {
		if (!item?.id) continue;
		markOccupiedSpan(occupied, [Number(item?.cell?.[0]) || 0, Number(item?.cell?.[1]) || 0], getItemSpan(item.id));
	}
	return findNearestFreeRect([0, 0], span, occupied, [columns, rows]);
}
/** First free cell inside a packed workspace snapshot (Side B/C while A is live). */
function findNextFreeCellInSnapshot(snapshot, prefer, span = [1, 1]) {
	const columns = Math.max(1, Math.min(16, Number(gridLayoutState?.columns) || 4));
	const rows = Math.max(1, Math.min(16, Number(gridLayoutState?.rows) || 8));
	const occupied = /* @__PURE__ */ new Set();
	for (const raw of snapshot?.items || []) {
		if (!raw) continue;
		markOccupiedSpan(occupied, [Number(raw.cell?.[0]) || 0, Number(raw.cell?.[1]) || 0], normalizeSpan([Number(raw.meta?.spanCols) || 1, Number(raw.meta?.spanRows) || 1]));
	}
	return findNearestFreeRect(prefer || [0, 0], span, occupied, [columns, rows]);
}
var upsertSpeedDialItem = (item) => {
	markUserEditedBeforeHydrate();
	const existingIndex = speedDialItems?.findIndex?.((entry) => entry?.id === item?.id) ?? -1;
	if (existingIndex === -1) speedDialItems?.push?.(observe(item));
	else if (speedDialItems[existingIndex] !== item) speedDialItems.splice(existingIndex, 1, observe(item));
	syncMetaActionFromItem(item);
	persistSpeedDialItems();
	persistSpeedDialMeta();
	emitSpeedDialMutation("update", item.id);
	return item;
};
var removeSpeedDialItem = (id) => {
	markUserEditedBeforeHydrate();
	const index = speedDialItems?.findIndex?.((entry) => entry?.id === id) ?? -1;
	if (index === -1) return false;
	const meta = getSpeedDialMeta(id);
	const dismissPkg = String(meta?.packageName || "").trim();
	const dismissSid = String(meta?.shortcutId || "").trim();
	const dismissAction = String(meta?.action || speedDialItems[index]?.action || "").trim();
	speedDialItems.splice(index, 1);
	if (!speedDialItems.length) markIntentionalEmptyGrid();
	if ((dismissAction === "launch-shortcut" || Boolean(dismissSid)) && dismissPkg && dismissSid) rememberDismissedAndroidShortcut(dismissPkg, dismissSid);
	removeSpeedDialMeta(id);
	persistSpeedDialItems();
	emitSpeedDialMutation("remove", id);
	return true;
};
/** WHY: cell drag in SpeedDial calls `persistSpeedDialItems` directly — mark the hydrate race. */
var markSpeedDialUserEditBeforeHydrate = markUserEditedBeforeHydrate;
var snapshotSpeedDialItem = (item) => {
	const meta = getSpeedDialMeta(item.id);
	const resolvedAction = meta?.action || item.action;
	const metaSnapshot = packSpeedDialMetaPlain(meta ?? {});
	if (!metaSnapshot.action) metaSnapshot.action = resolvedAction;
	return {
		state: {
			id: item.id,
			cell: [Number(item.cell?.[0]) || 0, Number(item.cell?.[1]) || 0],
			icon: unwrapRef(item.icon, ""),
			label: unwrapRef(item.label, "")
		},
		desc: {
			action: resolvedAction,
			meta: metaSnapshot
		}
	};
};
/** Clone a tile without keeping the source id (paste / Side B/C must not collide). */
var cloneSpeedDialItemPacked = (item, cell) => {
	const snap = snapshotSpeedDialItem(item);
	const meta = packSpeedDialMetaPlain(snap.desc?.meta || {});
	const action = String(snap.desc?.action || item.action || "open-view");
	meta.action = action;
	const nextId = generateItemId();
	const resolved = resolveSpeedDialIconUrl(item.id, String(meta.iconUrl || ""));
	if (isInlineIconUrl(resolved)) meta.iconUrl = persistSpeedDialIconBlob(nextId, resolved);
	return {
		id: nextId,
		cell: cell ? [Number(cell[0]) || 0, Number(cell[1]) || 0] : [Number(item.cell?.[0]) || 0, Number(item.cell?.[1]) || 0],
		icon: String(snap.state?.icon || unwrapRef(item.icon, "sparkle") || "sparkle"),
		label: String(snap.state?.label || unwrapRef(item.label, "Shortcut") || "Shortcut"),
		action,
		meta
	};
};
var addClonedSpeedDialItem = (source, cell) => {
	const packed = cloneSpeedDialItemPacked(source, cell);
	const item = createStatefulItem(packed);
	ensureSpeedDialMeta(item.id, {
		action: packed.action,
		...packed.meta || {}
	});
	if (!cell) {
		const free = findNextFreeSpeedDialCell(getItemSpan(item.id));
		item.cell[0] = free[0];
		item.cell[1] = free[1];
	}
	addSpeedDialItem(item);
	return item;
};
var wallpaperState = makeUIState("cw::workspace::wallpaper", () => observe({
	src: "/assets/wallpaper.jpg",
	opacity: 1,
	blur: 0
}), (raw) => observe(raw || {
	src: "/assets/wallpaper.jpg",
	opacity: 1,
	blur: 0
}), (state) => ({ ...state }));
var persistWallpaper = () => wallpaperState?.$save?.();
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
	"wavy",
	"shapeless"
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
function getDefaultTileShape() {
	return normalizeTileShape(gridLayoutState?.shape, "squircle");
}
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
/**
* Import the former orient-layer storage once. The renderer now has one state
* model, but old users must not lose shortcuts when the new entrypoint mounts.
*/
var migrateLegacyDesktopState = () => {
	const legacy = loadDesktopRaw();
	const decoded = legacy ? decodeDesktopState(legacy) : null;
	if (!decoded?.items?.length) return;
	if (hasStoredValue(STORAGE_KEY)) return;
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
var applyGridSettings = (settings, opts) => {
	const gridConfig = settings?.grid || gridLayoutState;
	const columns = Math.max(1, Math.min(16, Number(gridConfig?.columns) || gridLayoutState.columns || 4));
	const rows = Math.max(1, Math.min(16, Number(gridConfig?.rows) || gridLayoutState.rows || 8));
	const shape = normalizeTileShape(gridConfig?.shape ?? gridLayoutState.shape, "squircle");
	const defaultAction = normalizeDefaultAction(gridConfig?.defaultAction ?? gridLayoutState.defaultAction, "open-link");
	const iconScale = normalizeIconBitmapScale(gridConfig?.iconScale ?? gridLayoutState.iconScale, "fill");
	if ((opts?.relocate === true || opts?.relocate !== false && Boolean(settings?.grid)) && relocateItemsToLayout(speedDialItems, [columns, rows], (item) => getItemSpan(item.id))) persistSpeedDialItems();
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
			const meta = id ? getSpeedDialMeta(id) : null;
			applyItemIconScaleToElement(tile, defaultIconScaleForDisplay(tile.getAttribute("data-icon-display"), meta?.iconScale));
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
	applyGridSettings({ grid: detail }, { relocate: true });
	detail.ack?.();
});
if (typeof globalThis !== "undefined" && typeof document !== "undefined") {
	const run = () => applyGridSettings(void 0, { relocate: false });
	if (typeof requestAnimationFrame === "function") requestAnimationFrame(run);
	else queueMicrotask(run);
}
var looksLikeJsonObject = (raw) => {
	const t = String(raw || "").trim();
	return t.startsWith("{") && t.endsWith("}") || t.startsWith("[") && t.endsWith("]");
};
var SPEED_DIAL_CLIP_KIND = "cwsp.speed-dial.shortcut";
/** Pretty or compact shortcut JSON — not a single `{` line from stringify(..., 2). */
var looksLikeSpeedDialShortcutJson = (raw) => {
	const t = String(raw || "").trim();
	if (!t.startsWith("{") || !t.endsWith("}")) return false;
	return /"kind"\s*:\s*"cwsp\.speed-dial\.shortcut"/.test(t) || /"state"\s*:/.test(t) || /"desc"\s*:/.test(t);
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
		kind: extras?.kind || (isDir ? "directory" : "file"),
		iconDisplay: "glyph",
		iconScale: "compact"
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
		const parsedRaw = JSON.parse(raw);
		if (!parsedRaw || typeof parsedRaw !== "object") return null;
		const parsed = parsedRaw.kind === "cwsp.speed-dial.shortcut" && parsedRaw.snapshot ? parsedRaw.snapshot : parsedRaw;
		const state = parsed.state || parsed;
		const desc = parsed.desc || parsed.meta || {};
		if (!state || typeof state !== "object") return null;
		const cellValue = suggestedCell ? [Number(suggestedCell[0]) || 0, Number(suggestedCell[1]) || 0] : state.cell && Array.isArray(state.cell) && state.cell.length >= 2 ? [Number(state.cell[0]) || 0, Number(state.cell[1]) || 0] : [0, 0];
		const href = String(desc.href || desc.meta?.href || state.href || "").trim();
		const path = String(desc.path || desc.meta?.path || state.path || "").trim();
		const action = desc.action || state.action || (href ? "open-link" : path ? "open-path" : "open-view");
		const item = createStatefulItem({
			id: generateItemId(),
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
/** Digits-only length for phone heuristics (E.164-ish). */
var PHONE_DIGIT_MIN = 7;
var PHONE_DIGIT_MAX = 15;
var digitsOnly = (s) => String(s || "").replace(/\D+/g, "");
var looksLikePhoneNumber = (raw) => {
	const t = String(raw || "").trim();
	if (!t || /\s{3,}/.test(t)) return false;
	if (/^tel:/i.test(t)) return true;
	if (/[@/]|https?:/i.test(t) && !/^tel:/i.test(t)) return false;
	const digits = digitsOnly(t);
	if (digits.length < PHONE_DIGIT_MIN || digits.length > PHONE_DIGIT_MAX) return false;
	return /^[+]?[\d\s().-]{7,24}$/.test(t);
};
var looksLikeEmail = (raw) => {
	const t = String(raw || "").trim();
	if (!t) return false;
	if (/^mailto:/i.test(t)) return true;
	if (/\s/.test(t)) return false;
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/i.test(t);
};
var looksLikeTelegramHandle = (raw) => {
	const t = String(raw || "").trim();
	if (!t) return false;
	if (/^(tg:|telegram:)/i.test(t)) return true;
	if (/^(https?:\/\/)?(t\.me|telegram\.me)\//i.test(t)) return true;
	return /^@[a-zA-Z][a-zA-Z0-9_]{3,31}$/.test(t);
};
/**
* Parse common calendar-ish fragments → Android calendar time URI when possible.
* WHY: Cap openUri(ACTION_VIEW) on content://com.android.calendar/time/<ms> opens the day.
*/
var parseCalendarHref = (raw) => {
	const t = String(raw || "").trim();
	if (!t) return null;
	if (/^content:\/\/com\.android\.calendar\//i.test(t)) return {
		href: t,
		label: "Calendar"
	};
	const iso = t.match(/^(\d{4}-\d{2}-\d{2})(?:[T\s](\d{1,2}:\d{2}(?::\d{2})?))?(?:Z|[+-]\d{2}:?\d{2})?$/);
	if (iso) {
		const d = /* @__PURE__ */ new Date(iso[2] ? `${iso[1]}T${iso[2]}` : `${iso[1]}T12:00:00`);
		if (!Number.isNaN(d.getTime())) return {
			href: `content://com.android.calendar/time/${d.getTime()}`,
			label: iso[1]
		};
	}
	const dmy = t.match(/^(\d{1,2})[./](\d{1,2})[./](\d{4})(?:\s+(\d{1,2}):(\d{2}))?$/);
	if (dmy) {
		const day = Number(dmy[1]);
		const month = Number(dmy[2]) - 1;
		const year = Number(dmy[3]);
		const hh = dmy[4] != null ? Number(dmy[4]) : 12;
		const mm = dmy[5] != null ? Number(dmy[5]) : 0;
		const d = new Date(year, month, day, hh, mm, 0, 0);
		if (!Number.isNaN(d.getTime()) && d.getFullYear() === year && d.getMonth() === month) return {
			href: `content://com.android.calendar/time/${d.getTime()}`,
			label: `${String(day).padStart(2, "0")}.${String(month + 1).padStart(2, "0")}.${year}`
		};
	}
	return null;
};
var normalizeTelegramHref = (raw) => {
	const t = String(raw || "").trim();
	if (!t) return null;
	if (/^tg:/i.test(t) || /^telegram:/i.test(t)) return {
		href: t,
		label: "Telegram"
	};
	const at = t.match(/^@([a-zA-Z][a-zA-Z0-9_]{3,31})$/);
	if (at) return {
		href: `https://t.me/${at[1]}`,
		label: `@${at[1]}`
	};
	try {
		const u = new URL(t.startsWith("http") ? t : `https://${t.replace(/^\/+/, "")}`);
		if (/^(t\.me|telegram\.me)$/i.test(u.hostname.replace(/^www\./, ""))) {
			const user = u.pathname.replace(/^\/+/, "").split("/")[0] || "Telegram";
			return {
				href: u.href,
				label: user.startsWith("+") ? user : `@${user}`
			};
		}
	} catch {}
	return null;
};
/**
* Build a Speed Dial open-link tile for tel / mailto / telegram / calendar / smart text.
* Prefer this before plain http(s) parsing when the clipboard is not a web URL.
*/
var parseSpeedDialItemFromSmartText = (rawText, suggestedCell) => {
	const text = String(rawText || "").trim();
	if (!text) return null;
	let candidate = text.split(/\r?\n/).map((l) => l.trim()).find((l) => l && !l.startsWith("#")) || text;
	if (candidate.startsWith("<") && candidate.endsWith(">")) candidate = candidate.slice(1, -1).trim();
	const makeLinkItem = (opts) => {
		const item = createStatefulItem({
			id: generateItemId(),
			cell: suggestedCell || [0, 0],
			icon: opts.icon,
			label: opts.label,
			action: "open-link"
		});
		ensureSpeedDialMeta(item.id, {
			action: "open-link",
			href: opts.href,
			description: opts.description || opts.label,
			iconDisplay: "glyph",
			iconScale: "compact",
			openLinkTarget: defaultOpenLinkTargetForHref(opts.href)
		});
		return item;
	};
	try {
		const u = new URL(candidate);
		const proto = (u.protocol || "").toLowerCase();
		if (proto === "tel:") {
			const num = decodeURIComponent(u.pathname || u.href.replace(/^tel:/i, "")).trim() || candidate;
			return makeLinkItem({
				href: `tel:${digitsOnly(num) ? num.startsWith("+") ? `+${digitsOnly(num)}` : digitsOnly(num) : num}`,
				label: num,
				icon: "phone",
				description: `Call ${num}`
			});
		}
		if (proto === "mailto:") {
			const addr = decodeURIComponent(u.pathname || u.username || "").trim() || candidate.replace(/^mailto:/i, "");
			return makeLinkItem({
				href: `mailto:${addr}`,
				label: addr,
				icon: "at",
				description: `Email ${addr}`
			});
		}
		if (proto === "tg:" || proto === "telegram:") return makeLinkItem({
			href: u.href,
			label: "Telegram",
			icon: "telegram-logo",
			description: u.href
		});
		if (proto === "content:" && /calendar/i.test(u.href)) return makeLinkItem({
			href: u.href,
			label: "Calendar",
			icon: "calendar",
			description: u.href
		});
	} catch {}
	if (looksLikePhoneNumber(candidate)) {
		const digits = digitsOnly(candidate);
		return makeLinkItem({
			href: `tel:${candidate.trim().startsWith("+") ? `+${digits}` : digits}`,
			label: candidate.trim(),
			icon: "phone",
			description: `Call ${candidate.trim()}`
		});
	}
	if (looksLikeEmail(candidate)) {
		const addr = candidate.replace(/^mailto:/i, "").trim();
		return makeLinkItem({
			href: `mailto:${addr}`,
			label: addr,
			icon: "at",
			description: `Email ${addr}`
		});
	}
	if (looksLikeTelegramHandle(candidate)) {
		const tg = normalizeTelegramHref(candidate);
		if (tg) return makeLinkItem({
			href: tg.href,
			label: tg.label,
			icon: "telegram-logo",
			description: `Telegram ${tg.label}`
		});
	}
	const cal = parseCalendarHref(candidate);
	if (cal) return makeLinkItem({
		href: cal.href,
		label: cal.label,
		icon: "calendar",
		description: `Calendar ${cal.label}`
	});
	return null;
};
var parseSpeedDialItemFromURL = (urlText, suggestedCell) => {
	try {
		const trimmed = urlText.trim();
		if (!trimmed) return null;
		const smart = parseSpeedDialItemFromSmartText(trimmed, suggestedCell);
		if (smart) {
			try {
				const u = new URL(trimmed);
				if (/^https?:$/i.test(u.protocol) && !looksLikeTelegramHandle(trimmed)) {} else return smart;
			} catch {
				return smart;
			}
			if (looksLikeTelegramHandle(trimmed)) return smart;
		}
		let url;
		try {
			url = new URL(trimmed);
		} catch {
			try {
				url = new URL(trimmed, globalThis?.location?.href);
			} catch {
				return parseSpeedDialItemFromSmartText(trimmed, suggestedCell);
			}
		}
		if (!/^https?:$/i.test(url.protocol)) return parseSpeedDialItemFromSmartText(trimmed, suggestedCell);
		if (/^(t\.me|telegram\.me)$/i.test(url.hostname.replace(/^www\./, ""))) return parseSpeedDialItemFromSmartText(trimmed, suggestedCell);
		const hostname = url.hostname || "";
		const domain = hostname.replace(/^www\./, "");
		const pathname = url.pathname || "";
		const label = domain || url.host || "Link";
		let favicon = "";
		try {
			if (hostname) favicon = `https://www.google.com/s2/favicons?domain=${encodeURIComponent(hostname)}&sz=256`;
		} catch {
			favicon = "";
		}
		const item = createStatefulItem({
			id: generateItemId(),
			cell: suggestedCell || [0, 0],
			icon: "link",
			label,
			action: "open-link"
		});
		const meta = {
			action: "open-link",
			href: url.href,
			description: `${label}${pathname ? ` - ${pathname}` : ""}`,
			iconDisplay: "glyph",
			iconScale: "compact",
			openLinkTarget: defaultOpenLinkTargetForHref(url.href),
			...favicon ? { iconUrl: favicon } : {}
		};
		ensureSpeedDialMeta(item.id, meta);
		return item;
	} catch (e) {
		console.warn("Failed to parse URL for speed dial item:", e);
		return null;
	}
};
var CLIPBOARD_READ_HOOK = "__CWSP_READ_CLIPBOARD_TEXT__";
var CLIPBOARD_WRITE_HOOK = "__CWSP_WRITE_CLIPBOARD_TEXT__";
var CAP_CLIPBOARD_PKGS = ["@capacitor/clipboard", "@supernotes/capacitor-clipboard"];
var CLIP_TEXT_MAX = 8e4;
var lastCopiedSpeedDial = null;
var isCapacitorNativeHost = () => {
	try {
		const c = globalThis.Capacitor;
		return typeof c?.isNativePlatform === "function" && Boolean(c.isNativePlatform());
	} catch {
		return false;
	}
};
/** Cap WebView: navigator.clipboard is unreliable; prefer host hook / @capacitor/clipboard. */
var readClipboardTextNative = async () => {
	const hook = globalThis[CLIPBOARD_READ_HOOK];
	if (typeof hook === "function") try {
		const value = await hook();
		if (typeof value === "string" && value.trim()) return value;
	} catch {}
	if (!isCapacitorNativeHost()) return "";
	for (const pkg of CAP_CLIPBOARD_PKGS) try {
		const mod = await import(
			/* @vite-ignore */
			pkg
);
		if (!mod?.Clipboard?.read) continue;
		const value = (await mod.Clipboard.read())?.value;
		if (typeof value === "string" && value.trim()) return value;
	} catch {}
	return "";
};
var writeClipboardTextNative = async (text) => {
	const hook = globalThis[CLIPBOARD_WRITE_HOOK];
	if (typeof hook === "function") try {
		await hook(text);
		return true;
	} catch {}
	if (!isCapacitorNativeHost()) return false;
	for (const pkg of CAP_CLIPBOARD_PKGS) try {
		const mod = await import(
			/* @vite-ignore */
			pkg
);
		if (!mod?.Clipboard?.write) continue;
		await mod.Clipboard.write({ string: text });
		return true;
	} catch {}
	return false;
};
var writeClipboardTextBrowser = async (text) => {
	if (await writeClipboardTextNative(text)) return;
	if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
		await navigator.clipboard.writeText(text);
		return;
	}
	if (typeof document === "undefined") throw new Error("clipboard write unavailable");
	const ta = document.createElement("textarea");
	ta.value = text;
	ta.style.position = "fixed";
	ta.style.left = "-9999px";
	document.body.appendChild(ta);
	ta.select();
	document.execCommand("copy");
	ta.remove();
};
var copySpeedDialItemToClipboard = async (item) => {
	const snapshot = snapshotSpeedDialItem(item);
	if (!snapshot) throw new Error("empty");
	const envelope = {
		kind: SPEED_DIAL_CLIP_KIND,
		v: 1,
		snapshot
	};
	lastCopiedSpeedDial = envelope;
	let text = JSON.stringify(envelope);
	if (text.length > CLIP_TEXT_MAX) {
		const slim = fallbackClone(envelope);
		const meta = slim.snapshot?.desc?.meta;
		if (meta && typeof meta.iconUrl === "string" && /^(data:|blob:)/i.test(meta.iconUrl)) delete meta.iconUrl;
		text = JSON.stringify(slim);
	}
	try {
		await writeClipboardTextBrowser(text);
	} catch (e) {
		console.warn("OS clipboard write failed; in-session paste still works", e);
	}
};
var materializeCopiedSpeedDial = (suggestedCell) => {
	if (!lastCopiedSpeedDial) return null;
	return parseSpeedDialItemFromJSON(JSON.stringify(lastCopiedSpeedDial), suggestedCell);
};
var readClipboardTextBrowser = async () => {
	try {
		const native = await readClipboardTextNative();
		if (native.trim()) return {
			ok: true,
			data: native
		};
		if (!navigator.clipboard?.readText) return {
			ok: false,
			error: "clipboard.readText unavailable"
		};
		const data = await navigator.clipboard.readText();
		return {
			ok: true,
			data: String(data ?? "")
		};
	} catch (e) {
		return {
			ok: false,
			error: String(e?.message || e)
		};
	}
};
var createSpeedDialItemFromClipboard = async (suggestedCell) => {
	const clipboardResult = await readClipboardTextBrowser();
	const clipboardText = clipboardResult.ok ? String(clipboardResult.data ?? "") : "";
	try {
		if (looksLikeSpeedDialShortcutJson(clipboardText)) {
			const parsed = parseSpeedDialItemFromJSON(clipboardText, suggestedCell);
			if (parsed) return parsed;
		}
		if (!clipboardResult.ok) {
			const fromMemory = materializeCopiedSpeedDial(suggestedCell);
			if (fromMemory) return fromMemory;
			console.warn("Failed to read clipboard text:", clipboardResult.error);
			throw new Error(clipboardResult.error || "clipboard read failed");
		}
		if (!clipboardText.trim()) {
			const fromMemory = materializeCopiedSpeedDial(suggestedCell);
			if (fromMemory) return fromMemory;
			throw new Error("clipboard empty");
		}
		let trimmed = clipboardText.split(/\r?\n/).map((l) => l.trim()).find((l) => l && !l.startsWith("#")) || clipboardText.trim();
		if (trimmed.startsWith("<") && trimmed.endsWith(">")) trimmed = trimmed.slice(1, -1).trim();
		const smart = parseSpeedDialItemFromSmartText(clipboardText, suggestedCell);
		if (smart) return smart;
		const absolute = extractHttpUrlFromClipboardText(clipboardText);
		if (absolute) return parseSpeedDialItemFromURL(absolute, suggestedCell);
		if (isSpeedDialVirtualPath(trimmed)) return parseSpeedDialItemFromVirtualPath(trimmed, suggestedCell);
		if (looksLikeJsonObject(clipboardText.trim()) || looksLikeJsonObject(trimmed)) {
			const parsed = parseSpeedDialItemFromJSON(looksLikeJsonObject(clipboardText.trim()) ? clipboardText : trimmed, suggestedCell);
			if (parsed) return parsed;
		}
		return materializeCopiedSpeedDial(suggestedCell);
	} catch (e) {
		console.warn("Failed to create speed dial item from clipboard:", e);
		if (/empty|failed|unavailable|denied|permission/i.test(String(e?.message || e || ""))) throw e;
		return materializeCopiedSpeedDial(suggestedCell);
	}
};
/** Mobile Chrome/Samsung often paste title+URL, HTML, or URI-list — find first usable http(s). */
var extractHttpUrlFromClipboardText = (raw) => {
	const text = String(raw || "");
	if (!text.trim()) return null;
	const hrefMatch = text.match(/href\s*=\s*["'](https?:\/\/[^"']+)["']/i);
	if (hrefMatch?.[1]) {
		const n = normalizeExternalWebHref(hrefMatch[1]);
		if (n) return n;
	}
	for (const line of text.split(/\r?\n/)) {
		let trimmed = line.trim();
		if (!trimmed || trimmed.startsWith("#")) continue;
		if (trimmed.startsWith("<") && trimmed.endsWith(">")) trimmed = trimmed.slice(1, -1).trim();
		const asUrl = normalizeExternalWebHref(trimmed);
		if (asUrl) return asUrl;
		try {
			const parsed = new URL(trimmed);
			if (/^https?:$/i.test(parsed.protocol)) return parsed.href;
		} catch {}
	}
	const embedded = text.match(/https?:\/\/[^\s<>"')\]]+/i);
	if (embedded?.[0]) {
		const n = normalizeExternalWebHref(embedded[0].replace(/[.,;:]+$/u, ""));
		if (n) return n;
	}
	return null;
};
//#endregion
export { resolveSpeedDialItemHref as $, isSpeedDialVirtualPath as A, parseSpeedDialItemFromJSON as B, getDefaultTileShape as C, normalizeOrient as Ct, gridLayoutState as D, getSpeedDialMirrorPath as E, visualLayout as Et, normalizeExternalWebHref as F, persistSpeedDialIconBlob as G, parseSpeedDialItemFromURL as H, normalizeItemIconBitmapScale as I, persistWallpaper as J, persistSpeedDialItems as K, normalizeOpenLinkTarget as L, looksLikeSpeedDialShortcutJson as M, markSpeedDialUserEditBeforeHydrate as N, isExternalWebHref as O, mirrorSpeedDialItems as P, resolveSpeedDialIconUrl as Q, openInDetachedBrowserWindow as R, findSpeedDialItem as S, markOccupiedSpan as St, getSpeedDialMeta as T, pointToLogicalCell as Tt, parseSpeedDialItemFromVirtualPath as U, parseSpeedDialItemFromSmartText as V, parseSpeedDialViewFromHref as W, removeSpeedDialItem as X, refreshSpeedDialMirror as Y, resolveItemOpenLinkTarget as Z, defaultOpenLinkTargetForHref as _, syncPlateGlyphInk as _t, addSpeedDialItem as a, tileIconFetchSize as at, ensureSpeedDialMeta as b, logicalToVisualCell as bt, applySpeedDialSnapshot as c, wasSpeedDialUserEdited as ct, captureSpeedDialSnapshot as d, createTileUiIconElement as dt, setItemSpan as et, cloneSpeedDialItemPacked as f, defaultIconScaleForDisplay as ft, createWidgetSpeedDialItem as g, normalizeTileShape$1 as gt, createSpeedDialItemFromClipboard as h, normalizeIconDisplay as ht, addClonedSpeedDialItem as i, stripCoreRailTilesFromGrid as it, launcher_state_exports as j, isMirrorMode as k, buildSpeedDialViewPathHref as l, ICON_DISPLAY_OPTIONS as lt, createEmptySpeedDialItem as m, isTileShapeValue as mt, NAVIGATION_SHORTCUTS as n, speedDialItems as nt, applyIconScaleToPaintedNodes as o, upsertSpeedDialItem as ot, copySpeedDialItemToClipboard as p, inferIconDisplay as pt, persistSpeedDialMeta as q, SPEED_DIAL_MUTATION_EVENT as r, speedDialMeta as rt, applyItemIconScaleToElement as s, wallpaperState as st, ICON_BITMAP_SCALE_OPTIONS as t, setSpeedDialMirrorPath as tt, canUseNativeOpenUri as u, TILE_SHAPE_OPTIONS as ut, defaultWidgetSpan as v, syncShapelessIconShadow as vt, getItemSpan as w, normalizeSpan as wt, findNextFreeCellInSnapshot as x, logicalToVisualSpan as xt, emitSpeedDialMutation as y, findNearestFreeRect as yt, openInNewBrowserTab as z };
