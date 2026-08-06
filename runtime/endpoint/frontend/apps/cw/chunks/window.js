import { n as createEnvironmentShell, t as EnvironmentShell } from "../shells/environment-components-flyout-ChromeFlyout.js";
import { n as MinimalShell } from "./preview.js";
//#region src/frontend/ai-slop/window/index.ts
/**
* `shells/window` path target: window / tabbed hosts (extends {@link MinimalShell}).
* Environment is {@link ./environment-shell.ts} via `shells/window/environment`.
*/
var windowLikeLayout = {
	hasSidebar: false,
	hasToolbar: true,
	hasTabs: false,
	supportsMultiView: true,
	supportsWindowing: true
};
var WindowShell = class extends MinimalShell {
	id = "window";
	name = "Window";
	layout = windowLikeLayout;
};
var TabbedShell = class extends WindowShell {
	id = "tabbed";
	name = "Tabbed";
	layout = {
		...windowLikeLayout,
		hasTabs: true
	};
};
function createWindowShell(_container) {
	return new WindowShell();
}
function createTabbedShell(_container) {
	return new TabbedShell();
}
//#endregion
export { EnvironmentShell, TabbedShell, WindowShell, createEnvironmentShell, createTabbedShell, createWindowShell, createWindowShell as default };
