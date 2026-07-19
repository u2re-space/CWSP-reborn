import { n as __exportAll } from "./rolldown-runtime.js";
//#region src/frontend/boot/capacitor-permissions.ts
var capacitor_permissions_exports = /* @__PURE__ */ __exportAll({
	ensureCapacitorPermissions: () => ensureCapacitorPermissions,
	isCapacitorNative: () => isCapacitorNative
});
var cap = () => {
	try {
		const c = globalThis?.Capacitor;
		return c && typeof c === "object" ? c : null;
	} catch {
		return null;
	}
};
var isCapacitorNative = () => {
	const c = cap();
	try {
		return Boolean(c?.isNativePlatform?.() ?? (c?.platform && c.platform !== "web"));
	} catch {
		return false;
	}
};
var plugin = (name) => {
	const p = cap()?.Plugins?.[name];
	return p && typeof p === "object" ? p : null;
};
var callSafe = async (fn, ...args) => {
	try {
		return typeof fn === "function" ? await fn(...args) : void 0;
	} catch {
		return;
	}
};
var requested = false;
/**
* Request Android runtime permissions the CWSP shell relies on. Idempotent;
* safe to call from shell mount.
*/
var ensureCapacitorPermissions = async () => {
	if (!isCapacitorNative()) return {
		native: false,
		requested: []
	};
	if (requested) return {
		native: true,
		requested: []
	};
	requested = true;
	const done = [];
	const clip = plugin("Clipboard");
	if (clip) {
		await callSafe(clip.read);
		done.push("clipboard");
	}
	const platform = plugin("CwsPlatform");
	if (platform) {
		await callSafe(platform.requestRuntimePermissions);
		done.push("CwsPlatform.requestRuntimePermissions");
	} else {
		const legacy = plugin("DevicePermissions") || plugin("Permissions");
		if (legacy && typeof legacy.requestPermissions === "function") {
			await callSafe(legacy.requestPermissions, { permissions: ["POST_NOTIFICATIONS"] });
			done.push("legacy-permissions");
		}
	}
	const notif = plugin("LocalNotifications");
	if (notif && typeof notif.requestPermissions === "function") {
		await callSafe(notif.requestPermissions);
		done.push("notifications");
	}
	return {
		native: true,
		requested: done
	};
};
//#endregion
export { isCapacitorNative as n, capacitor_permissions_exports as t };
