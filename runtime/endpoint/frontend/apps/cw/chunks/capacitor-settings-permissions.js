import { n as isCapacitorNative } from "./capacitor-permissions.js";
//#region src/frontend/boot/capacitor-settings-permissions.ts
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
* After Settings save on native Android, request permissions / open system UI
* implied by the saved shell toggles.
*/
var requestCapacitorSettingsPermissionsAfterSave = async (settings) => {
	const lines = [];
	const results = [];
	let prompted = false;
	if (!isCapacitorNative()) return {
		lines,
		results,
		prompted
	};
	if (settings.shell) {
		settings.shell.acceptSmsBridgeData = false;
		settings.shell.enableNativeSms = false;
	}
	const shell = settings.shell || {};
	const wantsContacts = shell.acceptContactsBridgeData === true;
	const wantsDaemon = (shell.bridgeDaemonEnabled ?? true) !== false;
	const wantsClipboardBridge = (shell.enableRemoteClipboardBridge ?? true) !== false;
	const wantsNotifications = wantsDaemon || wantsClipboardBridge;
	const platform = plugin("CwsPlatform");
	if (wantsContacts || wantsNotifications) if (platform?.requestSettingsPermissions) {
		const raw = await callSafe(platform.requestSettingsPermissions, {
			contacts: wantsContacts,
			sms: false,
			notifications: wantsNotifications,
			overlay: false
		});
		let permPrompted = false;
		if (raw && typeof raw === "object") {
			permPrompted = raw.prompted === true;
			prompted = permPrompted;
			const arr = raw.results;
			if (Array.isArray(arr)) {
				for (const row of arr) if (row && typeof row === "object") {
					const permission = String(row.permission ?? "");
					if (permission === "SYSTEM_ALERT_WINDOW") continue;
					if (permission === "READ_SMS" || permission === "RECEIVE_SMS" || permission === "SEND_SMS") continue;
					results.push({
						permission,
						granted: Boolean(row.granted)
					});
				}
			}
		}
		const denied = results.filter((r) => r.granted === false);
		if (denied.length) lines.push(`Permission denied: ${denied.map((r) => r.permission).filter(Boolean).join(", ")}`);
		else if (permPrompted) lines.push("Runtime permissions requested");
	} else {
		const legacy = plugin("DevicePermissions") || plugin("Permissions");
		const perms = [];
		if (wantsContacts) perms.push("READ_CONTACTS");
		if (wantsNotifications) perms.push("POST_NOTIFICATIONS");
		if (legacy?.requestPermissions && perms.length) {
			await callSafe(legacy.requestPermissions, { permissions: perms });
			lines.push("Runtime permissions requested (legacy plugin)");
		}
	}
	if (wantsDaemon && platform?.startCwspBridge) {
		await callSafe(platform.startCwspBridge);
		lines.push("CWSP foreground service started");
	} else if (!wantsDaemon && platform?.stopCwspBridge) {
		await callSafe(platform.stopCwspBridge);
		lines.push("CWSP foreground service stopped");
	}
	return {
		lines,
		results,
		prompted
	};
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
export { requestCapacitorSettingsPermissionsAfterSave as n, ensureCapacitorBridgeDaemonStarted as t };
