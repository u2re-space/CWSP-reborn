import { r as __exportAll } from "../chunks/rolldown-runtime.js";
import { B as hasActiveCloseable, H as registerCloseable, R as ClosePriority, V as initBackNavigation, z as closeHighestPriority } from "../vendor/culori.js";
import { l as closeUnifiedContextMenu, t as closeExplorerSettings } from "./app5.js";
//#region ../../modules/projects/fl.ui/src/ui/navigation/overlay-back.ts
var overlay_back_exports = /* @__PURE__ */ __exportAll({
	handleNativeBackPress: () => handleNativeBackPress,
	installExplorerBackStack: () => installExplorerBackStack,
	installLauncherBackStack: () => installLauncherBackStack
});
var explorerFileManager = () => document.querySelector("ui-file-manager");
var explorerSettingsEl = () => explorerFileManager()?.shadowRoot?.querySelector("ui-explorer-settings") ?? document.querySelector("ui-explorer-settings");
var explorerFolderNorm = () => {
	return (String(explorerFileManager()?.path || "/").trim() || "/").replace(/\/+$/, "") || "/";
};
var explorerCanGoUp = () => explorerFolderNorm() !== "/";
var registerExplorerFolderCloseable = () => {
	const g = globalThis;
	if (g.__CWSP_EXPLORER_FOLDER_BACK__) return;
	g.__CWSP_EXPLORER_FOLDER_BACK__ = true;
	registerCloseable({
		id: "explorer-folder",
		priority: ClosePriority.VIEW,
		isActive: explorerCanGoUp,
		close: () => {
			const fm = explorerFileManager();
			if (!fm?.goUp || !explorerCanGoUp()) return false;
			fm.goUp();
			return true;
		}
	});
	registerCloseable({
		id: "explorer-ctx-menu",
		priority: ClosePriority.CONTEXT_MENU,
		isActive: () => Boolean(document.querySelector(".cw-context-menu, .cw-context-menu-layer")),
		close: () => {
			closeUnifiedContextMenu();
			return true;
		}
	});
	registerCloseable({
		id: "explorer-settings",
		priority: ClosePriority.PANEL,
		isActive: () => Boolean(explorerSettingsEl()),
		close: () => {
			closeExplorerSettings();
			return true;
		}
	});
};
/** Close menu / settings / folder. `true` = consumed (do not leave the Activity). */
var handleNativeBackPress = () => {
	if (hasActiveCloseable() && closeHighestPriority()) return true;
	if (document.querySelector(".cw-context-menu, .cw-context-menu-layer")) {
		closeUnifiedContextMenu();
		return true;
	}
	if (explorerSettingsEl()) {
		closeExplorerSettings();
		return true;
	}
	return false;
};
var bindNativeBackHook = () => {
	const g = globalThis;
	g.__CWSP_NATIVE_BACK__ = { handleBackPress: handleNativeBackPress };
	const prev = g.__CWSP_LAUNCHER_HOME__?.handleBackPress;
	g.__CWSP_LAUNCHER_HOME__ = {
		...g.__CWSP_LAUNCHER_HOME__ || {},
		handleBackPress: () => handleNativeBackPress() || (typeof prev === "function" ? prev() : false)
	};
};
var installCapacitorBackButton = () => {
	const g = globalThis;
	if (g.__CWSP_CAP_BACK_BOUND__) return;
	const App = g.Capacitor?.Plugins?.App;
	if (typeof App?.addListener !== "function") return;
	g.__CWSP_CAP_BACK_BOUND__ = true;
	try {
		App.addListener("backButton", () => {
			if (handleNativeBackPress()) return;
		});
	} catch (e) {
		console.warn("[overlay-back] Capacitor backButton bind failed", e);
	}
};
var registerShellOverlays = () => {
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
		bindNativeBackHook();
		return;
	}
	g.__CWSP_LAUNCHER_BACK_STACK__ = true;
	try {
		initBackNavigation({
			preventDefaultNavigation: true,
			pushInitialState: false
		});
	} catch {}
	registerShellOverlays();
	installCapacitorBackButton();
	bindNativeBackHook();
};
/** Explorer SKU: overlays first, then parent folder, then Activity may background. */
var installExplorerBackStack = () => {
	installLauncherBackStack();
	registerExplorerFolderCloseable();
	bindNativeBackHook();
};
//#endregion
export { overlay_back_exports as n, installLauncherBackStack as t };
