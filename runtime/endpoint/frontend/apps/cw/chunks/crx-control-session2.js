//#region ../../modules/projects/subsystem/src/other/config/settings/crx-control-session.ts
/** chrome.storage.local key — never sessionStorage (must survive browser restart). */
var CRX_CONTROL_SESSION_KEY = "cwsp-control-session-v1";
var chromeApi = () => {
	try {
		return typeof chrome !== "undefined" && chrome?.storage?.local ? chrome : null;
	} catch {
		return null;
	}
};
var readCrxControlSession = async () => {
	const c = chromeApi();
	if (!c) return null;
	try {
		const raw = (await c.storage.local.get(CRX_CONTROL_SESSION_KEY))?.[CRX_CONTROL_SESSION_KEY];
		if (!raw || typeof raw !== "object") return null;
		const token = String(raw.token || "").trim();
		const origin = String(raw.origin || "").trim();
		const controlHost = String(raw.controlHost || "").trim();
		const expiresAt = Number(raw.expiresAt) || 0;
		if (!token || !origin || expiresAt <= Date.now()) return null;
		return {
			token,
			origin,
			controlHost,
			expiresAt,
			persistent: true,
			pairedAt: Number(raw.pairedAt) || 0
		};
	} catch {
		return null;
	}
};
var clearCrxControlSession = async () => {
	const c = chromeApi();
	if (!c) return;
	try {
		await c.storage.local.remove(CRX_CONTROL_SESSION_KEY);
	} catch {}
};
/** Session token for Control HTTP when Origin is chrome-extension://. */
var getCrxControlSessionToken = async () => {
	return (await readCrxControlSession())?.token || "";
};
//#endregion
export { clearCrxControlSession, getCrxControlSessionToken };
