//#region ../../modules/projects/core.ts/src/utils/PromiseUtils.ts
/**
* Create a timeout promise that rejects after specified time
*/
function withTimeout(promise, timeoutMs, timeoutMessage = "Operation timed out") {
	const timeoutPromise = new Promise((_, reject) => {
		setTimeout(() => reject(new Error(timeoutMessage)), timeoutMs);
	});
	return Promise.race([promise, timeoutPromise]);
}
//#endregion
//#region ../../modules/projects/core.ts/src/utils/WRef.ts
var existsMap = /* @__PURE__ */ new WeakMap();
var WeakRefProxyHandler = class {
	_deref(target) {
		return target instanceof WeakRef || typeof target?.deref == "function" ? target?.deref?.() : target;
	}
	get(tg, prop, _receiver) {
		const obj = this._deref(tg), value = obj?.[prop];
		if ((prop == "element" || prop == "value") && obj && (value == null || !(prop in obj))) return obj;
		if (prop == "deref") return () => this._deref(tg);
		if (typeof value == "function") return (...args) => {
			return this._deref(tg)?.[prop]?.(...args);
		};
		return value;
	}
	set(tg, prop, value, _receiver) {
		const obj = this._deref(tg);
		if (obj) return Reflect.set(obj, prop, value);
		return true;
	}
	has(tg, prop) {
		const obj = this._deref(tg);
		if (!obj) return false;
		return prop in obj;
	}
	ownKeys(tg) {
		const obj = this._deref(tg);
		if (!obj) return [];
		return Reflect.ownKeys(obj);
	}
	getOwnPropertyDescriptor(tg, prop) {
		const obj = this._deref(tg);
		if (!obj) return void 0;
		return Object.getOwnPropertyDescriptor(obj, prop);
	}
	deleteProperty(tg, prop) {
		const obj = this._deref(tg);
		if (!obj) return true;
		return Reflect.deleteProperty(obj, prop);
	}
	defineProperty(tg, prop, descriptor) {
		const obj = this._deref(tg);
		if (!obj) return true;
		return Reflect.defineProperty(obj, prop, descriptor);
	}
	getPrototypeOf(tg) {
		const obj = this._deref(tg);
		if (!obj) return null;
		return Object.getPrototypeOf(obj);
	}
	setPrototypeOf(tg, proto) {
		const obj = this._deref(tg);
		if (!obj) return true;
		return Reflect.setPrototypeOf(obj, proto);
	}
	isExtensible(tg) {
		const obj = this._deref(tg);
		if (!obj) return false;
		return Reflect.isExtensible(obj);
	}
	preventExtensions(tg) {
		const obj = this._deref(tg);
		if (!obj) return true;
		return Reflect.preventExtensions(obj);
	}
};
/**
* Create a WeakRef wrapper proxy that allows safe access to weakly referenced objects.
* The proxy automatically dereferences WeakRefs when accessing properties and handles
* function calls on weakly referenced objects.
* @template T - The type of the target object (must be object or Function)
* @param target - The target object or WeakRef to wrap
* @returns A proxy that safely accesses the weakly referenced object
*/
function WRef(target) {
	if (!(typeof target == "object" || typeof target == "function") || typeof target == "symbol") return target;
	const isWeakRef = target instanceof WeakRef || typeof target?.deref == "function";
	target = isWeakRef ? target?.deref?.() : target;
	if (target != null && existsMap.has(target)) return existsMap.get(target);
	const handler = new WeakRefProxyHandler();
	const pm = new Proxy(isWeakRef ? target : new WeakRef(target), handler);
	existsMap.set(target, pm);
	return pm;
}
//#endregion
//#region ../../modules/projects/core.ts/src/utils/Convert.ts
/**
* Orientation-space transforms for grids and drag vectors.
* Used by `GridItemUtils` / `resolveLocalPointToGridCell` and `fest/dom` launcher hit-testing.
*
* Convert position from client space to orientation space.
* @param pos_in_cs - Position in client space [x, y]
* @param size_in_cs - Size in client space [width, height]
* @param or_i - Orientation index (0=normal, 1=90° swapped, 2=180°, 3=270° swapped)
* @returns Position in orientation space [x, y]
*/
var cvt_cs_to_os = (pos_in_cs, size_in_cs, or_i = 0) => {
	const size_in_os = [...size_in_cs];
	const pos_in_swap = [...pos_in_cs];
	if (or_i % 2) {
		pos_in_swap.reverse();
		size_in_os.reverse();
	}
	return [(or_i == 0 || or_i == 3 ? pos_in_swap[0] : size_in_os[0] - pos_in_swap[0]) || 0, (or_i == 0 || or_i == 1 ? pos_in_swap[1] : size_in_os[1] - pos_in_swap[1]) || 0];
};
//#endregion
//#region ../../modules/projects/core.ts/src/utils/UserPath.ts
var normalizeSlashes = (input) => {
	const value = String(input ?? "").trim();
	if (!value) return "/";
	return (value.startsWith("/") ? value : `/${value}`).replace(/\/+/g, "/");
};
var isUserScopePath = (input) => {
	const normalized = normalizeSlashes(input);
	return normalized === "/user" || normalized.startsWith("/user/");
};
var stripUserScopePrefix = (input) => {
	const normalized = normalizeSlashes(input);
	if (normalized === "/user") return "/";
	if (normalized.startsWith("/user/")) return normalized.slice(5) || "/";
	return normalized;
};
var userPathCandidates = (input) => {
	const normalized = normalizeSlashes(input);
	const stripped = stripUserScopePrefix(normalized);
	if (isUserScopePath(normalized)) return Array.from(/* @__PURE__ */ new Set([stripped, normalized]));
	return [stripped];
};
//#endregion
export { WRef as a, cvt_cs_to_os as i, stripUserScopePrefix as n, withTimeout as o, userPathCandidates as r, isUserScopePath as t };
