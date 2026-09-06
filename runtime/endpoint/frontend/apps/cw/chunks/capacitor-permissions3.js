//#region src/shared/boot/capacitor-permissions.ts
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
//#endregion
export { isCapacitorNative };
