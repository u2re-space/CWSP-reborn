import "./Names.js";
//#region src/shared/routing/pwa/sw-cache.ts
var originHint = () => {
	try {
		const origin = globalThis.location?.origin;
		if (origin) return origin;
	} catch {}
	return "https://localhost";
};
var toCacheRequestInfo = (requestLike) => {
	if (!requestLike) return void 0;
	return requestLike instanceof URL ? requestLike.toString() : requestLike;
};
var cacheKeyString = (request) => {
	if (typeof request === "string") return request;
	if (request instanceof Request) return request.url;
	return "";
};
/**
* Cache#match rejects blob:/data:/non-GET. chrome-extension: is valid in MV3.
* Relative paths (`/share-target-data`) resolve against the worker origin.
*/
var isCacheApiKey = (request) => {
	if (request instanceof Request && String(request.method || "GET").toUpperCase() !== "GET") return false;
	const raw = cacheKeyString(request);
	if (!raw) return false;
	try {
		const protocol = new URL(raw, originHint()).protocol;
		return protocol === "http:" || protocol === "https:" || protocol === "chrome-extension:" || protocol === "moz-extension:";
	} catch {
		return raw.startsWith("/");
	}
};
var asMatchKey = (request) => {
	if (typeof request === "string") return request;
	if (typeof Request !== "undefined" && request instanceof Request) return request;
};
var cachesApi = () => {
	try {
		return globalThis.caches || null;
	} catch {
		return null;
	}
};
var safeCacheOpen = async (name) => {
	const store = cachesApi();
	if (!store || typeof store.open !== "function") return null;
	try {
		return await store.open(name);
	} catch {
		return null;
	}
};
var safeCacheMatch = async (cache, requestLike) => {
	const request = toCacheRequestInfo(requestLike);
	if (!cache || !request) return void 0;
	const key = asMatchKey(request);
	if (!key || !isCacheApiKey(key)) return void 0;
	const match = cache.match;
	if (typeof match !== "function") return void 0;
	try {
		return await match.call(cache, key) ?? void 0;
	} catch (error) {
		console.warn("[SW] Cache.match failed:", request, error);
		return;
	}
};
var safeCachePut = async (cache, requestLike, response) => {
	const request = toCacheRequestInfo(requestLike);
	if (!cache || !request || typeof cache.put !== "function") return false;
	const key = asMatchKey(request);
	if (!key || !isCacheApiKey(key)) return false;
	try {
		await cache.put(key, response);
		return true;
	} catch (error) {
		console.warn("[SW] Cache.put failed:", request, error);
		return false;
	}
};
var safeCacheDelete = async (cache, requestLike) => {
	const request = toCacheRequestInfo(requestLike);
	if (!cache || !request || typeof cache.delete !== "function") return false;
	try {
		return await cache.delete(request);
	} catch {
		return false;
	}
};
var safeCachesKeys = async () => {
	const store = cachesApi();
	if (!store || typeof store.keys !== "function") return [];
	try {
		return await store.keys();
	} catch {
		return [];
	}
};
var safeCachesDelete = async (name) => {
	const store = cachesApi();
	if (!store || typeof store.delete !== "function") return false;
	try {
		return await store.delete(name);
	} catch {
		return false;
	}
};
//#endregion
//#region src/shared/routing/channel/ShareTargetGateway.ts
var SHARE_CACHE_NAME = "share-target-data";
var SHARE_CACHE_KEY = "/share-target-data";
var SHARE_FILES_MANIFEST_KEY = "/share-target-files";
var SHARE_FILE_PREFIX = "/share-target-file/";
/** Persist the last share-target payload so the app can recover it after navigation or cold start. */
var storeShareTargetPayloadToCache = async (payload) => {
	const files = Array.isArray(payload.files) ? payload.files : [];
	const meta = payload.meta ?? {};
	try {
		const cache = await safeCacheOpen(SHARE_CACHE_NAME);
		if (!cache) return false;
		const timestamp = Number(meta?.timestamp) || Date.now();
		await safeCachePut(cache, SHARE_CACHE_KEY, new Response(JSON.stringify({
			...meta,
			title: meta?.title,
			text: meta?.text,
			url: meta?.url,
			sharedUrl: meta?.sharedUrl,
			source: meta?.source || "share-target",
			route: meta?.route || meta?.source || "share-target",
			timestamp,
			fileCount: files.length,
			imageCount: files.filter((f) => (f?.type || "").toLowerCase().startsWith("image/")).length
		}), { headers: { "Content-Type": "application/json" } }));
		const fileManifest = [];
		for (let i = 0; i < files.length; i++) {
			const file = files[i];
			const key = `${SHARE_FILE_PREFIX}${timestamp}-${i}`;
			const headers = new Headers();
			headers.set("Content-Type", file.type || "application/octet-stream");
			headers.set("X-File-Name", encodeURIComponent(file.name || `file-${i}`));
			headers.set("X-File-Size", String(file.size || 0));
			headers.set("X-File-LastModified", String(file.lastModified ?? 0));
			await safeCachePut(cache, key, new Response(file, { headers }));
			fileManifest.push({
				key,
				name: file.name || `file-${i}`,
				type: file.type || "application/octet-stream",
				size: file.size || 0,
				lastModified: file.lastModified ?? void 0
			});
		}
		await safeCachePut(cache, SHARE_FILES_MANIFEST_KEY, new Response(JSON.stringify({
			files: fileManifest,
			timestamp
		}), { headers: { "Content-Type": "application/json" } }));
		return true;
	} catch (error) {
		console.warn("[ShareTargetGateway] Failed to store payload to cache:", error);
		return false;
	}
};
/**
* Rehydrate the cached share-target payload and optionally clear the consumed
* cache entries so they are not replayed on the next app load.
*/
var consumeCachedShareTargetPayload = async (opts = {}) => {
	const clear = opts.clear !== false;
	try {
		const cache = await safeCacheOpen(SHARE_CACHE_NAME);
		if (!cache) return null;
		const metaResp = await safeCacheMatch(cache, SHARE_CACHE_KEY);
		const manifestResp = await safeCacheMatch(cache, SHARE_FILES_MANIFEST_KEY);
		if (!metaResp && !manifestResp) return null;
		const meta = metaResp ? await metaResp.json().catch(() => null) : null;
		const manifest = manifestResp ? await manifestResp.json().catch(() => null) : null;
		const fileMeta = Array.isArray(manifest?.files) ? manifest.files : [];
		const files = [];
		for (const fm of fileMeta) {
			const fileKey = typeof fm?.key === "string" ? fm.key.trim() : String(fm?.key ?? "").trim();
			if (!fileKey) continue;
			const response = await safeCacheMatch(cache, fileKey);
			if (!response) continue;
			const blob = await response.blob();
			files.push(new File([blob], fm.name || "shared-file", {
				type: fm.type || blob.type || "application/octet-stream",
				lastModified: Number(fm.lastModified) || Date.now()
			}));
		}
		if (clear) {
			await safeCacheDelete(cache, SHARE_CACHE_KEY);
			await safeCacheDelete(cache, SHARE_FILES_MANIFEST_KEY);
			for (const fm of fileMeta) if (fm?.key) await safeCacheDelete(cache, fm.key);
		}
		return {
			meta: meta || {},
			files,
			fileMeta
		};
	} catch (error) {
		console.warn("[ShareTargetGateway] Failed to consume cached payload:", error);
		return null;
	}
};
/**
* Convert the staged cache payload back into a share/launch transfer object that
* the foreground pipeline can route without caring whether the ingress was
* share-target, launch-queue, or another staged producer.
*/
var buildShareDataFromCachedPayload = (payload) => {
	const meta = payload?.meta || {};
	const files = Array.isArray(payload?.files) ? payload.files : [];
	const fileMeta = Array.isArray(payload?.fileMeta) ? payload.fileMeta : [];
	const manifestName = typeof fileMeta[0]?.name === "string" && fileMeta[0].name.trim().length > 0 ? fileMeta[0].name.trim() : void 0;
	const rawHint = meta.hint;
	const baseHint = rawHint && typeof rawHint === "object" && !Array.isArray(rawHint) ? { ...rawHint } : {};
	let hintOut = Object.keys(baseHint).length > 0 ? { ...baseHint } : void 0;
	if (manifestName && !files.length) {
		if (!(typeof baseHint.filename === "string" ? String(baseHint.filename).trim() : "")) hintOut = {
			...hintOut || baseHint,
			filename: manifestName
		};
	}
	const out = {
		...meta,
		title: typeof meta.title === "string" ? meta.title : void 0,
		text: typeof meta.text === "string" ? meta.text : void 0,
		url: typeof meta.url === "string" ? meta.url : void 0,
		sharedUrl: typeof meta.sharedUrl === "string" ? meta.sharedUrl : void 0,
		source: typeof meta.source === "string" ? meta.source : "share-target",
		route: typeof meta.route === "string" ? meta.route : typeof meta.source === "string" ? meta.source : "share-target",
		timestamp: Number(meta.timestamp || Date.now()),
		files,
		fileCount: files.length || Number(meta.fileCount || 0),
		imageCount: Number(meta.imageCount || files.filter((file) => (file?.type || "").toLowerCase().startsWith("image/")).length)
	};
	if (hintOut !== void 0) out.hint = hintOut;
	return out;
};
//#endregion
export { safeCacheOpen as a, safeCachesKeys as c, safeCacheMatch as i, consumeCachedShareTargetPayload as n, safeCachePut as o, storeShareTargetPayloadToCache as r, safeCachesDelete as s, buildShareDataFromCachedPayload as t };
