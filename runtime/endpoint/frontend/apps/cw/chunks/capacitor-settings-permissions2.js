import { isCapacitorNative } from "./capacitor-permissions3.js";
//#region src/shared/boot/capacitor-settings-permissions.ts
var cap = () => {
	try {
		const c = globalThis?.Capacitor;
		return c && typeof c === "object" ? c : null;
	} catch {
		return null;
	}
};
var plugin = (name) => {
	const p = cap()?.Plugins?.[name];
	return p && typeof p === "object" ? p : null;
};
var callSafe = async (fn, ...args) => {
	try {
		return typeof fn === "function" ? await fn(...args) : void 0;
	} catch (e) {
		console.warn("[capacitor-settings-permissions]", e);
		return;
	}
};
/**
* Cold-start (or keep) the Android foreground bridge on app boot.
* WHY: previously only Settings Save / Share / CONFIGURE started CwspBridgeService.
*/
var ensureCapacitorBridgeDaemonStarted = async (settings) => {
	if (!isCapacitorNative()) return false;
	if (!(((settings?.shell || {}).bridgeDaemonEnabled ?? true) !== false)) return false;
	if (settings?.shell) {
		settings.shell.acceptSmsBridgeData = false;
		settings.shell.enableNativeSms = false;
	}
	const platform = plugin("CwsPlatform");
	if (!platform?.startCwspBridge) return false;
	await callSafe(platform.startCwspBridge);
	return true;
};
//#endregion
export { ensureCapacitorBridgeDaemonStarted };
