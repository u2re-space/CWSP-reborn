import { n as ENABLED_VIEW_IDS } from "../chunks/views.js";
import { n as ViewRegistry } from "../chunks/registry.js";
//#region src/shared/routing/core/view-prefetch.ts
/**
* Low-priority prefetch of view chunks after the focused view is interactive.
*/
function scheduleIdle(fn, timeoutMs) {
	if (typeof globalThis.requestIdleCallback === "function") globalThis.requestIdleCallback(fn, { timeout: timeoutMs });
	else globalThis.setTimeout?.(fn, 32);
}
/**
* Stagger dynamic imports for non-current views so the next navigation is faster
* without competing with the active view's work.
*/
function scheduleViewModulePrefetch(currentViewId) {
	const others = ENABLED_VIEW_IDS.filter((id) => id !== currentViewId);
	if (others.length === 0) return;
	let index = 0;
	const step = () => {
		const id = others[index++];
		if (!id) return;
		ViewRegistry.prefetchModule(id);
		scheduleIdle(step, 6e3);
	};
	scheduleIdle(step, 2500);
}
//#endregion
export { scheduleViewModulePrefetch as t };
