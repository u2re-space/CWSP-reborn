import { n as __exportAll } from "./rolldown-runtime.js";
import { f as isEnabledView } from "./views.js";
import { n as affected } from "../fest/object.js";
import { i as H } from "../com/app.js";
import "../com/app2.js";
import "../fest/icon.js";
import { t as ShellBase } from "./shells.js";
import { t as SHELL_SLOT } from "../shells/slots.js";
//#region ../../modules/shells/minimal-shell/src/minimal.scss?inline
var minimal_default = "@layer shell.tokens, shell.base, shell.components, shell.utilities, shell.markdown-host-theme, shell.overrides;@layer shell.tokens{:where(:root,.app-shell,.app-shell[data-style=minimal]):has(.app-shell,.app-shell[data-style=minimal]){color-scheme:light dark;--shell-bg:var(--color-surface);--shell-fg:var(--color-on-surface);--shell-nav-bg:var(--color-surface-container-high);--shell-nav-fg:var(--color-on-surface);--shell-nav-border:var(--color-outline-variant);--shell-btn-hover:var(--color-surface-container);--shell-btn-active-bg:color-mix(in oklab,var(--color-primary) 18%,var(--color-surface));--shell-btn-active-fg:var(--color-on-surface);--shell-status-bg:var(--color-surface-container-low);--shell-status-fg:var(--color-on-surface);--shell-nav-height:var(--shell-nav-height-base,48px);--shell-sidebar-width:0;--shell-status-height:24px;--shell-padding:0}html[data-theme=light] .app-shell[data-shell=minimal],html[data-theme=light]:has([data-shell=minimal]){color-scheme:light;--shell-bg:#fafbfc;--shell-fg:#1e293b;--shell-nav-bg:#e8ecf4;--shell-nav-fg:#1e293b;--shell-nav-border:#94a3b8;--shell-btn-hover:#eef1f8;--shell-btn-active-bg:color-mix(in oklab,#5a7fff 18%,#fafbfc);--shell-btn-active-fg:#1e293b;--shell-status-bg:#f4f6fa;--shell-status-fg:#1e293b}html[data-theme=dark] .app-shell[data-shell=minimal],html[data-theme=dark]:has([data-shell=minimal]){color-scheme:dark;--shell-bg:#0f172a;--shell-fg:#f1f5f9;--shell-nav-bg:#1e293b;--shell-nav-fg:#f1f5f9;--shell-nav-border:#475569;--shell-btn-hover:#1e293b;--shell-btn-active-bg:color-mix(in oklab,#7ca7ff 22%,#0f172a);--shell-btn-active-fg:#f1f5f9;--shell-status-bg:#0f172a;--shell-status-fg:#f1f5f9}:host{--shell-nav-bg:var(--color-surface-container-high)}:host([data-theme=light]),:host-context(html[data-theme=light]){color-scheme:light;--shell-bg:#fafbfc;--shell-fg:#1e293b;--shell-nav-bg:#e8ecf4;--shell-nav-fg:#1e293b;--shell-btn-hover:#eef1f8;--shell-btn-active-bg:color-mix(in oklab,#5a7fff 18%,#fafbfc);--shell-btn-active-fg:#1e293b;--shell-status-fg:#1e293b}:host([data-theme=dark]),:host-context(html[data-theme=dark]){color-scheme:dark;--shell-bg:#0f172a;--shell-fg:#f1f5f9;--shell-nav-bg:#1e293b;--shell-nav-fg:#f1f5f9;--shell-btn-hover:#1e293b;--shell-btn-active-bg:color-mix(in oklab,#7ca7ff 22%,#0f172a);--shell-btn-active-fg:#f1f5f9;--shell-status-fg:#f1f5f9}}@layer shell.base{:host{background-color:var(--shell-nav-bg)}:where(.app-shell,.app-shell[data-style=minimal]){align-items:stretch;background:var(--color-background);background-color:var(--shell-bg);block-size:stretch;color:var(--shell-fg);color-scheme:light dark;contain:strict;display:grid;font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Helvetica Neue,Arial,BlinkMacSystemFont,sans-serif;gap:0;grid-template-columns:minmax(0,1fr);grid-template-rows:[viewport-row] minmax(0,1fr);inline-size:stretch;inset:0;justify-content:start;justify-items:stretch;margin:0;max-block-size:stretch;max-inline-size:stretch;min-block-size:0;min-inline-size:0;overflow:hidden;padding:0;position:absolute;-webkit-tap-highlight-color:transparent;border-radius:0;transition:background-color .2s ease,color .2s ease}:where(.app-shell,.app-shell[data-style=minimal])[data-theme=light]{color-scheme:light;--shell-bg:#fafbfc;--shell-fg:#1e293b;--shell-nav-bg:#e8ecf4;--shell-nav-fg:#1e293b;--shell-btn-hover:#eef1f8;--shell-btn-active-bg:color-mix(in oklab,#5a7fff 18%,#fafbfc);--shell-btn-active-fg:#1e293b;--shell-status-fg:#1e293b}:where(.app-shell,.app-shell[data-style=minimal])[data-theme=dark]{color-scheme:dark;--shell-bg:#0f172a;--shell-fg:#f1f5f9;--shell-nav-bg:#1e293b;--shell-nav-fg:#f1f5f9;--shell-btn-hover:#1e293b;--shell-btn-active-bg:color-mix(in oklab,#7ca7ff 22%,#0f172a);--shell-btn-active-fg:#f1f5f9;--shell-status-fg:#f1f5f9}@media print{:where(.app-shell,.app-shell[data-style=minimal]){display:contents!important}}}@layer shell.components{:where(.app-shell,.app-shell[data-style=minimal]){border-radius:0}:where(.app-shell,.app-shell[data-style=minimal]) .loading-spinner{animation:b .8s linear infinite;block-size:32px;border:3px solid rgba(128,128,128,.2);border-block-start-color:var(--shell-btn-active-fg);border-radius:50%;inline-size:32px}:where(.app-shell,.app-shell[data-style=minimal]) slot{display:contents!important}.app-shell__nav{align-items:center;background:var(--shell-nav-bg);background-color:var(--shell-nav-bg);block-size:auto;border-block-end:1px solid var(--shell-nav-border);border-radius:0;box-sizing:border-box;display:flex;flex-shrink:0;gap:var(--gap-sm,.5rem);grid-column:1;grid-row:shell-nav-row;justify-content:space-between;margin:0;min-block-size:max(var(--shell-nav-height) + max(env(safe-area-inset-top,0px),env(titlebar-area-y,0px)),env(titlebar-area-y,0px) + env(titlebar-area-height,0px));padding-block-end:0;padding-block-start:max(env(safe-area-inset-top,0px),env(titlebar-area-y,0px));padding-inline-end:max(env(safe-area-inset-right,0px),max(0px,100vi - env(titlebar-area-x,0px) - env(titlebar-area-width,100vi)),var(--space-md,.75rem));padding-inline-start:max(env(safe-area-inset-left,0px),env(titlebar-area-x,0px),var(--space-md,.75rem));position:relative;transition:background-color var(--motion-normal,.2s ease),border-color var(--motion-normal,.2s ease);z-index:1}.app-shell__nav select{block-size:fit-content!important;box-sizing:border-box!important;max-block-size:min(2rem,100%)!important;min-block-size:0!important;padding-block:.125rem!important}.app-shell__nav-left,.app-shell__nav-right{align-items:center;display:flex}:is(.app-shell__nav-left,.app-shell__nav-right) select{block-size:fit-content!important;box-sizing:border-box!important;max-block-size:min(2rem,100%)!important;min-block-size:0!important;padding-block:.125rem!important}.app-shell__nav-left{gap:var(--gap-xs,.25rem)}.app-shell__nav-right{gap:var(--gap-sm,.5rem)}.app-shell__nav-right>*{align-items:center;display:flex;gap:var(--gap-xs,.25rem)}.app-shell__connection-source{background:color-mix(in srgb,var(--color-primary,#3975ca) 18%,var(--shell-nav-bg));border:1px solid color-mix(in srgb,var(--color-primary,#3975ca) 45%,var(--shell-nav-border));border-radius:var(--radius-sm,6px);color:color-mix(in srgb,var(--color-primary,#1565c0) 70%,var(--shell-nav-fg));cursor:pointer;flex-shrink:0;font-size:.7rem;font-weight:700;letter-spacing:.04em;padding:.3rem .5rem;-webkit-tap-highlight-color:transparent;transition:background-color .15s ease,border-color .15s ease}.app-shell__connection-source:hover{background:color-mix(in srgb,var(--color-primary,#3975ca) 28%,var(--shell-nav-bg))}.app-shell__connection-source:active{background:color-mix(in srgb,var(--color-primary,#3975ca) 34%,var(--shell-nav-bg))}.app-shell__connection-source[data-bridge-live=\"1\"]{background:color-mix(in srgb,var(--color-success,#2e7d32) 22%,var(--shell-nav-bg));border-color:color-mix(in srgb,var(--color-success,#2e7d32) 50%,var(--shell-nav-border));color:color-mix(in srgb,var(--color-success,#1b5e20) 75%,var(--shell-nav-fg))}.app-shell__admin-door{background:color-mix(in srgb,var(--color-error,#c62828) 16%,var(--shell-nav-bg));border:1px solid color-mix(in srgb,var(--color-error,#c62828) 40%,var(--shell-nav-border));border-radius:var(--radius-sm,6px);color:color-mix(in srgb,var(--color-error,#b71c1c) 70%,var(--shell-nav-fg));cursor:pointer;flex-shrink:0;font-size:.7rem;font-weight:700;letter-spacing:.04em;padding:.3rem .5rem;-webkit-tap-highlight-color:transparent;transition:background-color .15s ease,border-color .15s ease}.app-shell__admin-door:hover{background:color-mix(in srgb,var(--color-error,#c62828) 24%,var(--shell-nav-bg))}.app-shell__admin-door:active{background:color-mix(in srgb,var(--color-error,#c62828) 30%,var(--shell-nav-bg))}@media (display-mode:window-controls-overlay){:where(.app-shell,.app-shell[data-style=minimal]) .app-shell__nav{window-drag:move;-webkit-app-region:drag;app-region:drag}:where(.app-shell,.app-shell[data-style=minimal]) :is(.app-shell__nav-left,.app-shell__nav-right){window-drag:none;-webkit-app-region:no-drag;app-region:no-drag}}.shell-theme-cycle-btn{justify-content:center;min-inline-size:2.5rem;padding-inline:var(--space-sm,.5rem)}.shell-theme-cycle-btn ui-icon{margin:0}.app-shell__nav-btn{align-items:center;background:transparent;block-size:max-content;border:none;border-radius:var(--radius-lg,8px);color:var(--shell-fg);cursor:pointer;display:flex;flex-shrink:0;font-size:var(--text-sm,.875rem);font-weight:var(--font-weight-medium,500);gap:var(--gap-sm,.5rem);line-height:normal;min-block-size:2.5rem;padding:var(--space-xs,.5rem) var(--space-md,.75rem);transition:background-color var(--motion-fast,.15s ease),color var(--motion-fast,.15s ease);user-select:none;white-space:nowrap}.app-shell__nav-btn ui-icon{--icon-size:clamp(1.25rem,5.5dvmin,1.75rem);--icon-color:currentColor;flex-shrink:0;font-size:var(--icon-size);min-block-size:1.25rem;min-inline-size:1.25rem;opacity:.8}.app-shell__nav-btn:hover{background-color:var(--shell-btn-hover)}.app-shell__nav-btn:active{background-color:var(--shell-btn-active-bg);color:var(--shell-btn-active-fg)}.app-shell__nav-btn:focus-visible{box-shadow:var(--focus-ring,none);outline:2px solid var(--shell-btn-active-fg);outline-offset:2px}.app-shell__nav-btn.active{background-color:var(--shell-btn-active-bg,color-mix(in oklab,#2e3a64 18%,#fafbfc));color:var(--shell-btn-active-fg,#1e293b)}.app-shell__nav-btn.active,.app-shell__nav-btn.active ui-icon{--icon-color:var(--shell-btn-active-fg,var(--color-on-surface,#1e293b))}.app-shell__nav-btn.active ui-icon{color:var(--icon-color);opacity:1}.app-shell__nav-btn.active .app-shell__nav-label{color:var(--shell-btn-active-fg,#1e293b)}.app-shell[data-theme=light] .app-shell__nav-btn.active,:host([data-theme=light]) .app-shell__nav-btn.active,:host-context(html[data-theme=light]) .app-shell__nav-btn.active{color:#1e293b}.app-shell[data-theme=light] .app-shell__nav-btn.active .app-shell__nav-label,:host([data-theme=light]) .app-shell__nav-btn.active .app-shell__nav-label,:host-context(html[data-theme=light]) .app-shell__nav-btn.active .app-shell__nav-label{color:#1e293b}.app-shell[data-theme=dark] .app-shell__nav-btn.active,:host([data-theme=dark]) .app-shell__nav-btn.active,:host-context(html[data-theme=dark]) .app-shell__nav-btn.active{color:#f1f5f9}.app-shell[data-theme=dark] .app-shell__nav-btn.active .app-shell__nav-label,:host([data-theme=dark]) .app-shell__nav-btn.active .app-shell__nav-label,:host-context(html[data-theme=dark]) .app-shell__nav-btn.active .app-shell__nav-label{color:#f1f5f9}.app-shell__viewport{align-self:stretch;display:grid;grid-row:viewport-row;grid-template-columns:minmax(0,1fr);grid-template-rows:[shell-nav-row] auto [shell-main-row] minmax(0,1fr);isolation:isolate;position:relative}.app-shell__underlying,.app-shell__viewport{min-block-size:0;min-inline-size:0;overflow:hidden}.app-shell__underlying{inset:0;pointer-events:none;position:absolute;z-index:0}.app-shell__underlying>slot::slotted(*){pointer-events:auto}.app-shell__overlays{inset:0;overflow:visible;pointer-events:none;position:absolute;z-index:4}.app-shell__overlays>slot{pointer-events:none}.app-shell__overlays>slot::slotted(*){pointer-events:auto}.app-shell__overlays>:not(slot){pointer-events:auto}.app-shell__content{background:var(--shell-bg);background-color:var(--shell-bg);block-size:stretch;border:0 transparent;border-radius:0;box-sizing:border-box;contain:layout style;container-type:size;display:grid;grid-column:1;grid-row:shell-main-row;grid-template-columns:minmax(0,1fr);grid-template-rows:auto minmax(0,1fr);inline-size:stretch;margin:0;max-block-size:stretch;max-inline-size:stretch;min-block-size:0;min-inline-size:0;overflow:auto;padding:0;position:relative;scrollbar-color:var(--shell-scrollbar,rgba(128,128,128,.3)) transparent;scrollbar-width:thin;z-index:1}.app-shell__content slot:not([name])::slotted([data-view=explorer]){block-size:100%!important;display:flex!important;flex-direction:column!important;max-block-size:100%!important;min-block-size:0!important;overflow:hidden!important}.app-shell__content slot:not([name])::slotted([data-view]){block-size:stretch;grid-row:2;inline-size:stretch;inset:0;min-block-size:fit-content;min-inline-size:0;overflow:auto;position:absolute;scrollbar-width:thin}.app-shell__content slot:not([name])::slotted(.cw-network-view-host),.app-shell__content slot:not([name])::slotted(.view-settings),.app-shell__content slot:not([name])::slotted([data-view=network]),.app-shell__content slot:not([name])::slotted([data-view=settings]){block-size:100%;display:flex;flex-direction:column;max-block-size:100%;min-block-size:0;overflow:hidden}.app-shell__content slot:not([name])::slotted([data-view][hidden]),.app-shell__content slot:not([name])::slotted([hidden]),.app-shell__content>[data-view][hidden]{display:none!important;pointer-events:none!important;visibility:hidden!important}.app-shell__content slot:not([name])::slotted(*){grid-row:2;min-block-size:0;min-inline-size:0;overflow:auto}.app-shell__content::-webkit-scrollbar{inline-size:8px}.app-shell__content::-webkit-scrollbar-track{background:transparent}.app-shell__content::-webkit-scrollbar-thumb{background-color:rgba(128,128,128,.4);border-radius:4px}.app-shell__status{animation:d .2s ease-out;background-color:var(--shell-status-bg);border-radius:var(--radius-lg,8px);box-shadow:var(--elev-3,0 4px 12px rgba(0,0,0,.15));color:var(--shell-status-fg);font-size:var(--text-sm,.875rem);font-weight:var(--font-weight-medium,500);inset-block-end:var(--space-2xl,1.5rem);inset-inline-start:50%;padding:var(--space-md,.75rem) var(--space-xl,1.5rem);position:fixed;transform:translateX(-50%);z-index:3}.app-shell__status:empty,.app-shell__status[hidden]{display:none}.app-shell__loading{align-items:center;block-size:stretch;display:none;flex-direction:column;gap:var(--space-lg,1rem);inline-size:stretch;inset:0;justify-content:center;max-block-size:stretch;max-inline-size:stretch;min-block-size:0;min-inline-size:0;padding:var(--space-2xl,2rem);position:absolute;z-index:2}.app-shell__loading .loading-spinner{animation:b .8s linear infinite;block-size:32px;border:3px solid var(--color-outline-variant);border-radius:50%;border-top-color:var(--color-primary);inline-size:32px}}@layer shell.utilities{@keyframes b{to{transform:rotate(1turn)}}@keyframes d{0%{opacity:0;transform:translate(-50%,.5rem)}to{opacity:1;transform:translate(-50%)}}}@layer shell.markdown-host-theme{@scope (\n        markdown-view,\n        md-view,\n        .markdown-view,\n        cw-view-viewer,\n        .cw-view-viewer-shell,\n        :host(markdown-view),\n        :host(md-view),\n        :host(.markdown-view),\n        :host(cw-view-viewer)\n    ){:host([data-theme=light]) ::slotted([data-view=viewer]){color-scheme:light;--base-color:var(--color-primary,#5a7fff);--base-color-neutralized:color-mix(in oklab,var(--base-color) 60%,gray);--view-bg:var(--color-surface,--u2-color-mod(var(--base-color-neutralized),70));--view-fg:var(--color-on-surface,--u2-color-mod(var(--base-color-neutralized),900));--view-toolbar-bg:color-mix(in oklab,--u2-color-mod(var(--base-color-neutralized),900) 6%,transparent);--view-btn-hover-bg:color-mix(in oklab,--u2-color-mod(var(--base-color-neutralized),900) 7%,transparent);--view-code-bg:--u2-color-mod(var(--base-color-neutralized),120);--view-blockquote-bg:color-mix(in oklab,--u2-color-mod(var(--base-color-neutralized),900) 3%,transparent);--color-on-surface:--u2-color-mod(var(--base-color-neutralized),980);--viewer-toolbar-row-fill:--u2-color-mod(var(--base-color),160);--view-picon-fill:--u2-color-mod(var(--base-color-neutralized),780);--view-picon-fill-hover:var(--color-primary,--u2-color-mod(var(--base-color-neutralized),550));--color-surface-container-high:color-mix(in oklab,--u2-color-mod(var(--base-color-neutralized),900) 10%,transparent)}:host([data-theme=dark]) ::slotted([data-view=viewer]){color-scheme:dark;--base-color:var(--color-primary,#5a7fff);--base-color-neutralized:color-mix(in oklab,var(--base-color) 60%,gray);--view-bg:var(--color-surface,--u2-color-mod(var(--base-color-neutralized),960));--view-fg:var(--color-on-surface,--u2-color-mod(var(--base-color-neutralized),100));--view-toolbar-bg:color-mix(in oklab,--u2-color-mod(var(--base-color-neutralized),100) 6%,transparent);--view-btn-hover-bg:color-mix(in oklab,--u2-color-mod(var(--base-color-neutralized),100) 8%,transparent);--view-code-bg:--u2-color-mod(var(--base-color-neutralized),900);--view-blockquote-bg:color-mix(in oklab,--u2-color-mod(var(--base-color-neutralized),100) 4%,transparent);--color-on-surface:--u2-color-mod(var(--base-color-neutralized),10);--viewer-toolbar-row-fill:--u2-color-mod(var(--base-color-neutralized),880);--view-picon-fill:--u2-color-mod(var(--base-color-neutralized),280);--view-picon-fill-hover:--u2-color-mod(var(--base-color-neutralized),420);--color-surface-container-high:color-mix(in oklab,--u2-color-mod(var(--base-color-neutralized),100) 14%,transparent)}:host([data-theme=light]) ::slotted([data-view=viewer]) :where(.markdown-body,[data-render-target].markdown-body){--base-color-neutralized:color-mix(in oklab,var(--base-color) 60%,gray);--color-surface:--u2-color-mod(var(--base-color-neutralized,var(--color-primary)),10);--color-on-surface:--u2-color-mod(var(--base-color-neutralized,var(--color-primary)),980);color-scheme:light}:host([data-theme=dark]) ::slotted([data-view=viewer]) :where(.markdown-body,[data-render-target].markdown-body){--base-color-neutralized:color-mix(in oklab,var(--base-color) 60%,gray);--color-surface:--u2-color-mod(var(--base-color-neutralized,var(--color-primary)),980);--color-on-surface:--u2-color-mod(var(--base-color-neutralized,var(--color-primary)),10);color-scheme:dark}}}@layer shell.overrides{@media (max-width:640px){.app-shell__nav-label{display:none}}@media (max-width:768px){:where(.app-shell,.app-shell[data-style=minimal]){--shell-nav-height:52px}.app-shell__nav{gap:var(--gap-xs,.35rem)}.app-shell__nav-btn{min-block-size:2.75rem;padding:var(--space-sm,.5rem) var(--space-sm,.65rem)}.app-shell__nav-btn ui-icon{--icon-size:clamp(1.35rem,6dvmin,1.85rem);font-size:var(--icon-size);min-block-size:1.35rem;min-inline-size:1.35rem}}@media print{.app-shell__viewport{display:contents!important}.app-shell__overlays,.app-shell__underlying{display:none!important}.app-shell__content{contain:none;display:contents!important;overflow:visible}.app-shell__content::-webkit-scrollbar{display:none}.app-shell__content slot:not([name])::slotted([data-view]),.app-shell__content>[data-view]{block-size:auto!important;inline-size:auto!important;inset:auto!important;max-block-size:none!important;min-block-size:0!important;overflow:visible!important;position:static!important}.cw-view-viewer-shell,.cw-view-viewer__prose,.markdown-body,.markdown-viewer-content,.result-content,[data-cw-view-host=true],[data-cw-view-host=true]>.cw-view-element__mount,[data-cw-viewer-prose],markdown-viewer,md-view{block-size:auto!important;contain:none!important;container-type:normal!important;max-block-size:none!important;overflow:visible!important}.app-shell__nav,.app-shell__status{display:none!important}}}";
//#endregion
//#region ../../modules/shells/minimal-shell/src/index.ts
/**
* Minimal Shell
*
* Simple toolbar-based single-view shell.
* Features:
* - Top navigation toolbar with view buttons
* - Status bar for messages
* - Single content area for one active view
* - NO split view, NO sidebar, NO tabs
*/
var MAIN_NAV_ITEMS = [
	{
		id: "viewer",
		name: "Markdown",
		icon: "eye"
	},
	{
		id: "explorer",
		name: "Explorer",
		icon: "folder"
	},
	{
		id: "workcenter",
		name: "Work Center",
		icon: "lightning"
	},
	{
		id: "network",
		name: "Network",
		icon: "wifi-high"
	},
	{
		id: "settings",
		name: "Settings",
		icon: "gear"
	},
	{
		id: "history",
		name: "History",
		icon: "clock-counter-clockwise"
	}
].filter((item) => isEnabledView(item.id));
/** Set of valid nav view IDs for fast lookup */
var VALID_NAV_VIEW_IDS = new Set(MAIN_NAV_ITEMS.map((item) => item.id));
/** Type guard for valid navigation view IDs */
function isValidNavViewId(id) {
	return VALID_NAV_VIEW_IDS.has(id);
}
var MinimalShell = class extends ShellBase {
	id = "minimal";
	name = "Minimal";
	layout = {
		hasSidebar: false,
		hasToolbar: true,
		hasTabs: false,
		supportsMultiView: false,
		supportsWindowing: false
	};
	createLayout() {
		const root = H`
            <div class="app-shell" data-shell="minimal">
                <div class="app-shell__viewport">
                    <div class="app-shell__underlying">
                        <slot name="${SHELL_SLOT.underlying}"></slot>
                    </div>
                    <nav class="app-shell__nav" role="navigation" aria-label="Main navigation">
                        <div class="app-shell__nav-left" data-nav-left>
                            ${this.renderNavButtons()}
                        </div>
                        <div class="app-shell__nav-right" data-shell-toolbar>
                            <!-- View-specific toolbar actions go here -->
                        </div>
                    </nav>
                    <main class="app-shell__content" data-shell-content role="main">
                        <div class="app-shell__loading">
                            <div class="loading-spinner"></div>
                            <span>Loading...</span>
                        </div>
                        <slot></slot>
                    </main>
                    <div class="app-shell__overlays" data-shell-overlays>
                        <slot name="${SHELL_SLOT.overlay}"></slot>
                    </div>
                </div>
                <div class="app-shell__status" data-shell-status hidden aria-live="polite"></div>
            </div>
        `;
		this.setupNavClickHandlers(root);
		this.setupConnectionSourceButton(root);
		this.setupAdminDoorButton(root);
		return root;
	}
	/**
	* Public hub (cwsp.u2re.space / /cwsp): open connection-source dialog.
	* WHY: only on `data-cwsp-surface=cwsp-control` so Neutralino/gateway shells stay unchanged.
	*/
	setupConnectionSourceButton(root) {
		try {
			if (document.documentElement.dataset.cwspSurface !== "cwsp-control") return;
		} catch {
			return;
		}
		const navRight = root.querySelector("[data-shell-toolbar]");
		if (!navRight || navRight.querySelector("[data-connection-source]")) return;
		const btn = H`
            <button
                type="button"
                class="app-shell__connection-source"
                data-connection-source
                aria-label="Connect to another source"
                title="Connection source — Neutralino bridge + CWSP endpoint (login/PIN when needed)"
            >SRC</button>
        `;
		navRight.appendChild(btn);
		btn.addEventListener("click", () => {
			try {
				window.dispatchEvent(new CustomEvent("cwsp:open-connection-source"));
			} catch (e) {
				console.warn("[MinimalShell] connection source:", e);
			}
		});
	}
	setupAdminDoorButton(root) {
		const navRight = root.querySelector("[data-shell-toolbar]");
		if (!navRight || navRight.querySelector("[data-admin-door]")) return;
		const btn = H`
            <button
                type="button"
                class="app-shell__admin-door"
                data-admin-door
                aria-label="Open server admin (HTTPS)"
                title="Server admin (HTTPS :8434). Configure origins in Settings → Server."
            >ADM</button>
        `;
		navRight.appendChild(btn);
		btn.addEventListener("click", () => {
			import("./Settings.js").then((n) => n.t).then(({ loadSettings }) => loadSettings()).then((s) => import("./admin-doors.js").then((n) => n.t).then(({ openAdminDoorFromCore }) => {
				openAdminDoorFromCore(s.core, "https");
			})).catch((e) => console.warn("[MinimalShell] admin door:", e));
		});
	}
	renderNavButtons() {
		const fragment = document.createDocumentFragment();
		for (const item of MAIN_NAV_ITEMS) {
			const button = H`
                <button
                    class="app-shell__nav-btn"
                    data-view="${item.id}"
                    type="button"
                    title="${item.name}"
                >
                    <ui-icon icon="${item.icon}" icon-style="duotone"></ui-icon>
                    <span class="app-shell__nav-label">${item.name}</span>
                </button>
            `;
			fragment.appendChild(button);
		}
		return fragment;
	}
	setupNavClickHandlers(root) {
		const navLeft = root.querySelector("[data-nav-left]");
		if (!navLeft) return;
		navLeft.addEventListener("click", (e) => {
			const button = e.target.closest("[data-view]");
			if (!button) return;
			const viewId = button.dataset.view;
			if (viewId && isValidNavViewId(viewId)) this.navigate(viewId);
		});
		affected(this.currentView, (viewId) => {
			this.updateActiveNavButton(navLeft, viewId);
		});
	}
	updateActiveNavButton(navContainer, activeViewId) {
		navContainer.querySelectorAll("[data-view]").forEach((btn) => {
			const isActive = btn.dataset.view === activeViewId;
			btn.classList.toggle("active", isActive);
			btn.setAttribute("aria-current", isActive ? "page" : "false");
		});
	}
	getStylesheet() {
		return minimal_default;
	}
	/**
	* Routed views: default (unnamed) slot in `<main>`; nodes stay in the shell host light DOM for shadow projection.
	*/
	renderView(element) {
		if (!this.contentContainer || !this.rootElement) {
			console.warn(`[${this.id}] No content container available`);
			return;
		}
		this.contentContainer.setAttribute("data-current-view", this.currentView.value);
		const previousId = this.navigationState.previousView;
		if (previousId && previousId !== this.currentView.value && this.loadedViews.has(previousId)) {
			const prev = this.loadedViews.get(previousId);
			prev.element.removeAttribute("data-view");
			prev.element.hidden = true;
			if (this.rootElement.contains(prev.element)) prev.element.remove();
			if (previousId === "history" && this.currentView.value !== "history") try {
				if (globalThis.__CWSP_TRANSFER_HISTORY_UI_ACTIVE__) import("./transfer-history-runtime.js").then((m) => m.setTransferHistoryUiActive(false)).catch(() => void 0);
			} catch {}
		}
		element.setAttribute("data-view", this.currentView.value);
		element.hidden = false;
		element.removeAttribute("slot");
		if (!this.rootElement.contains(element)) this.rootElement.appendChild(element);
		const loading = this.contentContainer.querySelector(".app-shell__loading");
		if (loading) loading.hidden = true;
		this.currentViewElement = element;
	}
	applyTheme(theme) {
		const inner = this.rootElement?.shadowRoot?.querySelector(".app-shell");
		if (inner) inner.dataset.theme = this.resolveShellColorScheme(theme);
		super.applyTheme(theme);
	}
	async mount(container) {
		await super.mount(container);
		this.setupPopstateNavigation();
		import("./capacitor-permissions.js").then((n) => n.t).then((m) => m.ensureCapacitorPermissions()).catch(() => {});
		import("./capacitor-share-intent.js").then((m) => m.installCapacitorShareIntentBridge()).catch(() => {});
		import("./capacitor-clipboard-asset.js").then((m) => m.installCapacitorClipboardAssetBridge()).catch(() => {});
	}
};
/**
* Factory function for creating MinimalShell instances.
* 
* Note: The container parameter is required by ShellRegistration interface
* but not used here - the shell is mounted later via shell.mount(container).
*/
function createShell(_container) {
	return new MinimalShell();
}
//#endregion
//#region ../../modules/shells/minimal-shell/src/preview.ts
var preview_exports = /* @__PURE__ */ __exportAll({
	MinimalShell: () => MinimalShell,
	createShell: () => createShell,
	default: () => createShell
});
//#endregion
export { MinimalShell as n, preview_exports as t };
