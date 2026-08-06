import { O as MOCElement, h as preloadStyle, k as addEvent, m as loadInlineStyle, p as loadAsAdopted } from "../fest/dom.js";
import { o as numberRef } from "../fest/object.js";
import { h as bindStyle, i as H, p as S } from "./app.js";
import { F as property, N as GLitElement, O as createPanelUnderShadow, P as defineElement } from "./app2.js";
import { i as ensureStyleSheet } from "../fest/icon.js";
import { n as resolveOverlayMountPoint } from "../shells/slots.js";
import { t as __decorate } from "../chunks/decorate.js";
//#region ../../modules/projects/fl.ui/src/ui/base/UIElement.ts
var UIElement = class UIElement extends GLitElement() {
	theme = "default";
	render = function() {
		return H`<slot></slot>`;
	};
	constructor() {
		super();
	}
	onRender() {
		return super.onRender();
	}
	connectedCallback() {
		return super.connectedCallback?.() ?? this;
	}
	onInitialize() {
		const self = super.onInitialize() ?? this;
		self.loadStyleLibrary(ensureStyleSheet());
		return self;
	}
};
__decorate([property({ source: "attr" })], UIElement.prototype, "theme", void 0);
UIElement = __decorate([defineElement("ui-element")], UIElement);
var UIElement_default = UIElement;
//#endregion
//#region ../../modules/projects/fl.ui/src/styles/index.scss?inline
var styles_default = ":host,:root,:scope{font-family:Inter,sans-serif;font-optical-sizing:auto;font-variation-settings:\"opsz\" 16}@supports (font-variation-settings:normal){:host,:root,:scope{font-family:InterVariable,sans-serif;font-optical-sizing:auto;font-variation-settings:\"opsz\" 16}}@font-feature-values InterVariable{@character-variant{cv01:1;cv02:2;cv03:3;cv04:4;cv05:5;cv06:6;cv07:7;cv08:8;cv09:9;cv10:10;cv11:11;cv12:12;cv13:13;alt-1:1;alt-3:9;open-4:2;open-6:3;open-9:4;lc-l-with-tail:5;simplified-u:6;alt-double-s:7;uc-i-with-serif:8;uc-g-with-spur:10;single-story-a:11;compact-lc-f:12;compact-lc-t:13}@styleset{ss01:1;ss02:2;ss03:3;ss04:4;ss05:5;ss06:6;ss07:7;ss08:8;open-digits:1;disambiguation:2;disambiguation-except-zero:4;round-quotes-and-commas:3;square-punctuation:7;square-quotes:8;circled-characters:5;squared-characters:6}}@font-feature-values Inter{@character-variant{cv01:1;cv02:2;cv03:3;cv04:4;cv05:5;cv06:6;cv07:7;cv08:8;cv09:9;cv10:10;cv11:11;cv12:12;cv13:13;alt-1:1;alt-3:9;open-4:2;open-6:3;open-9:4;lc-l-with-tail:5;simplified-u:6;alt-double-s:7;uc-i-with-serif:8;uc-g-with-spur:10;single-story-a:11;compact-lc-f:12;compact-lc-t:13}@styleset{ss01:1;ss02:2;ss03:3;ss04:4;ss05:5;ss06:6;ss07:7;ss08:8;open-digits:1;disambiguation:2;disambiguation-except-zero:4;round-quotes-and-commas:3;square-punctuation:7;square-quotes:8;circled-characters:5;squared-characters:6}}@font-feature-values InterDisplay{@character-variant{cv01:1;cv02:2;cv03:3;cv04:4;cv05:5;cv06:6;cv07:7;cv08:8;cv09:9;cv10:10;cv11:11;cv12:12;cv13:13;alt-1:1;alt-3:9;open-4:2;open-6:3;open-9:4;lc-l-with-tail:5;simplified-u:6;alt-double-s:7;uc-i-with-serif:8;uc-g-with-spur:10;single-story-a:11;compact-lc-f:12;compact-lc-t:13}@styleset{ss01:1;ss02:2;ss03:3;ss04:4;ss05:5;ss06:6;ss07:7;ss08:8;open-digits:1;disambiguation:2;disambiguation-except-zero:4;round-quotes-and-commas:3;square-punctuation:7;square-quotes:8;circled-characters:5;squared-characters:6}}:root{--fl-ui-radius:0.5rem;--fl-ui-gap:0.75rem;--color-primary:#2e3a64;--base-color:var(--color-primary);--color-surface:--u2-color-mod(var(--base-color),920);--color-on-surface:--u2-color-mod(var(--base-color),100);--color-on-surface-variant:--u2-color-mod(var(--base-color),280);--error-color:#f87171}@layer tokens, base, layout, utilities, shells, shell, views, view, viewer, components, ux-layer, markdown, essentials, print, print-breaks, overrides;@layer components{.btn{align-items:center;background:var(--color-bg-alt);border:1px solid var(--color-border);border-radius:var(--radius-md);color:var(--color-fg);cursor:pointer;display:inline-flex;font-size:var(--font-size-sm);font-weight:500;gap:var(--space-sm);justify-content:center;padding-block:0;padding-inline:0;transition:all var(--transition-fast)}.btn:hover:not(:disabled){background:var(--color-border)}.btn:focus-visible{outline:2px solid var(--color-primary);outline-offset:2px}.btn{--ui-bg:var(--color-surface-container-high);--ui-fg:var(--color-on-surface);--ui-bg-hover:var(--color-surface-container-highest);--ui-ring:var(--color-primary);--ui-radius:var(--radius-lg);--ui-pad-y:var(--space-sm);--ui-pad-x:var(--space-lg);--ui-font-size:var(--text-sm);--ui-font-weight:var(--font-weight-semibold);--ui-min-h:40px;--ui-opacity:1;appearance:none;background:var(--ui-bg);block-size:calc-size(fit-content,max(var(--ui-min-h),size));border:none;border-radius:var(--ui-radius);box-shadow:var(--elev-0);color:var(--ui-fg);contain:none;container-type:normal;flex-direction:row;flex-wrap:nowrap;font-size:var(--ui-font-size);font-weight:var(--ui-font-weight);gap:var(--space-xs);letter-spacing:.01em;line-height:1.2;max-block-size:stretch;max-inline-size:none;min-block-size:fit-content;min-inline-size:calc-size(fit-content,size + .5rem + var(--icon-size,1rem));opacity:var(--ui-opacity);overflow:hidden;padding:max(var(--ui-pad-y,0px),0px) max(var(--ui-pad-x,0px),0px);place-content:center;align-content:safe center;justify-content:safe center;place-items:center;align-items:safe center;justify-items:safe center;pointer-events:auto;text-align:center;text-decoration:none;text-overflow:ellipsis;text-rendering:auto;text-shadow:none;text-transform:none;text-wrap:nowrap;touch-action:manipulation;transition:background-color var(--motion-fast),box-shadow var(--motion-fast),transform var(--motion-fast);user-select:none;white-space:nowrap}.btn>ui-icon{align-self:center;color:inherit;flex-shrink:0;pointer-events:none;vertical-align:middle}@media (max-width:480px){.btn.btn-icon{aspect-ratio:1/1;block-size:fit-content;font-size:0!important;gap:0;max-block-size:stretch;max-inline-size:fit-content;min-inline-size:0}.btn.btn-icon .btn-text,.btn.btn-icon span:not(.sr-only){display:none!important}}.btn:hover{background:var(--ui-bg-hover);box-shadow:var(--elev-1);transform:translateY(-1px)}.btn:active{box-shadow:var(--elev-0);transform:translateY(0)}.btn:focus-visible{box-shadow:0 0 0 3px color-mix(in oklab,var(--ui-ring) 35%,transparent);outline:none}.btn:disabled{cursor:not-allowed;opacity:.5;transform:none!important}.btn:disabled:hover{background:var(--color-surface-container-high);box-shadow:var(--elev-0)}.btn.active,.btn.primary{--ui-bg:var(--color-primary);--ui-fg:var(--color-on-primary);--ui-ring:var(--color-primary)}.btn.primary{--ui-bg-hover:color-mix(in oklab,var(--color-primary) 90%,black)}.btn.active{box-shadow:var(--elev-1)}.btn.small{--ui-pad-y:var(--space-xs);--ui-pad-x:var(--space-md);--ui-font-size:var(--text-xs);--ui-min-h:32px;--ui-radius:var(--radius-md)}.btn.icon-btn{block-size:40px;inline-size:40px;--ui-pad-y:0px;--ui-pad-x:0px;--ui-radius:9999px;--ui-font-size:var(--text-lg)}.btn[data-action=export-docx],.btn[data-action=export-md],.btn[data-action=open-md]{--ui-font-size:12px;--ui-pad-x:8px;--ui-pad-y:0px;--ui-min-h:28px}.btn:is([data-action=view-markdown-viewer],[data-action=view-markdown-editor],[data-action=view-rich-editor],[data-action=view-settings],[data-action=view-history],[data-action=view-workcenter]){--ui-font-size:13px;--ui-font-weight:500;--ui-pad-x:12px;--ui-pad-y:0px;--ui-min-h:32px;--ui-radius:16px;text-transform:capitalize}.btn:is([data-action=view-markdown-viewer],[data-action=view-markdown-editor],[data-action=view-rich-editor],[data-action=view-settings],[data-action=view-history],[data-action=view-workcenter][data-current],[data-action=view-workcenter].active){--ui-bg:var(--color-surface-container-highest);--ui-fg:var(--color-primary);--ui-ring:var(--color-primary)}.btn:is([data-action=toggle-edit],[data-action=snip],[data-action=solve],[data-action=code],[data-action=css],[data-action=voice],[data-action=edit-templates],[data-action=recognize],[data-action=analyze],[data-action=select-files],[data-action=clear-prompt],[data-action=view-full-history]){--ui-font-size:12px;--ui-pad-x:8px;--ui-pad-y:0px;--ui-min-h:28px;--ui-radius:14px}.btn:has(>span:only-of-type:empty),.btn:has(>ui-icon):not(:has(>:not(ui-icon))){aspect-ratio:1/1;block-size:fit-content;font-size:0!important;gap:0;max-block-size:stretch;max-inline-size:fit-content;min-inline-size:0;overflow:visible}.btn:has(>span:only-of-type:empty) span:not(.sr-only),.btn:has(>ui-icon):not(:has(>:not(ui-icon))) span:not(.sr-only){display:none!important}.btn-primary{background:var(--color-primary);border-color:var(--color-primary);color:white}.btn-primary:hover:not(:disabled){background:var(--color-primary-hover);border-color:var(--color-primary-hover)}@media (max-inline-size:768px){.btn{--ui-pad-y:var(--space-xs);--ui-pad-x:var(--space-md);--ui-font-size:var(--text-xs);--ui-min-h:36px}}@media (max-inline-size:480px){.btn{--ui-pad-y:var(--space-xs);--ui-pad-x:var(--space-xs);--ui-font-size:var(--text-xs);--ui-min-h:32px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.btn.btn-icon{overflow:visible}}@media (prefers-reduced-motion:reduce){.btn{transition:none}.btn,.btn:active,.btn:hover{transform:none!important}}}@layer utilities{.round-decor{--background-tone-shift:0;border-radius:.25rem;overflow:hidden;padding-block:.25rem}.round-decor:empty{display:none;padding:0;pointer-events:none;visibility:collapse}.time-format{display:inline-flex;flex-direction:row;font:500 .9em InterVariable,Inter,Fira Mono,Menlo,Consolas,monospace;font-kerning:auto;font-optical-sizing:auto;font-stretch:condensed;font-variant-numeric:tabular-nums;padding:.125rem;place-content:center;place-items:center;place-self:center;font-width:condensed;letter-spacing:-.05em;text-align:center;text-overflow:ellipsis;text-wrap:nowrap;white-space:nowrap}.ui-ws-item:not([data-layer=labels]) span{aspect-ratio:1/1;block-size:fit-content;display:inline;inline-size:fit-content;pointer-events:none}.ui-ws-item{cursor:pointer;pointer-events:auto;user-select:none}.ui-ws-item:active,.ui-ws-item:has(:active){cursor:grabbing;will-change:inset,translate,transform,opacity,z-index}}@layer essentials{@media print{.component-error,.component-loading,.ctx-menu,.ux-anchor{block-size:0!important;border:none!important;display:none!important;inline-size:0!important;inset:0!important;margin:0!important;max-block-size:0!important;max-inline-size:0!important;min-block-size:0!important;min-inline-size:0!important;opacity:0!important;overflow:hidden!important;padding:0!important;pointer-events:none!important;position:absolute!important;visibility:hidden!important;z-index:-1!important}}@media screen{:host,:root,:scope{--font-family:\"InterVariable\",\"Inter\",\"Helvetica Neue\",\"Helvetica\",\"Calibri\",\"Roboto\",ui-sans-serif,system-ui,-apple-system,Segoe UI,sans-serif}.ui-grid-item,ui-modal,ui-window-frame{--opacity:1;--scale:1;--rotate:0deg;--translate-x:0%;--translate-y:0%;content-visibility:auto;isolation:isolate;opacity:var(--opacity,1);rotate:0deg;scale:1;transform-box:fill-box;transform-origin:50% 50%;transform-style:flat;translate:0 0 0}.ctx-menu{--font-family:\"InterVariable\",\"Inter\",\"Helvetica Neue\",\"Helvetica\",\"Calibri\",\"Roboto\",ui-sans-serif,system-ui,-apple-system,Segoe UI,sans-serif}.ctx-menu,.ctx-menu *{content-visibility:visible;visibility:visible}.ctx-menu{align-items:stretch;background-color:var(--color-surface);block-size:fit-content;border:1px solid var(--color-outline-variant);border-radius:var(--radius-md);box-shadow:var(--elev-3);color:var(--color-on-surface);display:flex;flex-direction:column;font-family:var(--font-family,'system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, sans-serif')!important;font-size:.875rem;font-weight:400;inline-size:max-content;max-inline-size:min(240px,100cqi);min-inline-size:160px;opacity:1;padding:.25rem 0;pointer-events:auto;position:fixed;text-align:start;transform:scale3d(var(--scale,1),var(--scale,1),1) translate3d(var(--translate-x,0),var(--translate-y,0),0);transition:opacity .15s ease-out,visibility .15s ease-out,transform .15s ease-out;visibility:visible;z-index:99999}.ctx-menu[data-hidden]{opacity:0;pointer-events:none;visibility:hidden}.ctx-menu>*{align-items:center;background-color:initial;border:none;border-radius:var(--radius-sm);cursor:pointer;display:flex;flex-direction:row;font-family:var(--font-family,'system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, sans-serif')!important;gap:.5rem;inline-size:stretch;justify-content:flex-start;min-block-size:2rem;outline:none;overflow:hidden;padding:.375rem .75rem;pointer-events:auto;position:relative;text-align:start;text-overflow:ellipsis;text-wrap:nowrap;transition:background-color .15s ease,color .15s ease;white-space:nowrap}.ctx-menu>*,.ctx-menu>:hover{color:var(--color-on-surface)}.ctx-menu>:hover{background-color:var(--color-surface-container-high)}.ctx-menu>:active{background-color:var(--color-surface-container-highest);color:var(--color-on-surface)}.ctx-menu>:focus-visible{background-color:var(--color-surface-container-high);outline:var(--focus-ring)}.ctx-menu>:not(.ctx-menu-separator){gap:.5rem}.ctx-menu>*>*{pointer-events:none}.ctx-menu>*>span{color:inherit;flex:1 1 auto;font-size:.875rem;font-weight:400;line-height:1.25;min-inline-size:0;pointer-events:none;text-align:start!important;user-select:none}.ctx-menu>*>ui-icon{--icon-size:1rem;block-size:var(--icon-size);color:var(--color-on-surface-variant);flex-shrink:0;inline-size:var(--icon-size);pointer-events:none;user-select:none}.ctx-menu.ctx-menu-separator,.ctx-menu>.ctx-menu-separator{background-color:var(--color-outline-variant);block-size:1px;margin:.125rem .375rem;min-block-size:auto;opacity:.3;padding:0;pointer-events:none}.ctx-menu.grid-rows{align-items:stretch;display:flex!important;flex-direction:column;grid-auto-rows:unset!important;grid-template-columns:unset!important}.ctx-menu.grid-rows>:not(.ctx-menu-separator){align-items:center!important;display:flex!important;flex-flow:row nowrap!important;grid-column:unset!important;grid-row:unset!important;grid-template-columns:unset!important;grid-template-rows:unset!important;justify-content:flex-start!important;place-content:unset!important;place-items:unset!important}.ux-anchor{--shift-x:var(--client-x,0px);--shift-y:var(--client-y,0px);--translate-x:round(nearest,min(0px,calc(100cqi - (100% + var(--shift-x, 0px)))),calc(1px / var(--pixel-ratio, 1)))!important;--translate-y:round(nearest,min(0px,calc(100cqb - (100% + var(--shift-y, 0px)))),calc(1px / var(--pixel-ratio, 1)))!important;direction:ltr;inset-block-end:auto;inset-block-start:max(var(--shift-y),var(--status-bar-padding,0px));inset-inline-end:auto;inset-inline-start:max(var(--shift-x),0px);transform:none;translate:0 0 0;writing-mode:horizontal-tb}.component-error,.component-loading{align-items:center;color:var(--text-secondary,light-dark(#666,#aaa));display:flex;flex-direction:column;gap:1rem;justify-content:center;padding:2rem}.component-loading .loading-spinner{animation:p 1s linear infinite;block-size:2rem;border:2px solid var(--border,light-dark(#ddd,#444));border-block-start:2px solid var(--primary,light-dark(#007bff,#5fa8ff));border-radius:50%;inline-size:2rem}.component-error{text-align:center}.component-error h3{color:var(--error,light-dark(#dc3545,#ff6b6b));margin:0}.component-error p{margin:0}ui-icon{align-items:center;block-size:var(--icon-size,1.25rem);color:currentColor;display:inline-flex;fill:currentColor;flex-shrink:0;font-size:1rem;inline-size:var(--icon-size,1.25rem);justify-content:center;min-block-size:var(--icon-size,1.25rem);min-inline-size:var(--icon-size,1.25rem);opacity:1;vertical-align:middle;visibility:visible}ui-icon :is(img,svg){block-size:100%;color:inherit;fill:currentColor;inline-size:100%}:is(button,.btn)>ui-icon{color:inherit}.file-picker{align-items:center;display:flex;flex-direction:column;justify-content:center;min-block-size:300px;padding:2rem;text-align:center}.file-picker .file-picker-header{margin-block-end:2rem}.file-picker .file-picker-header h2{color:var(--color-on-surface);font-size:1.5rem;font-weight:600;margin:0 0 .5rem}.file-picker .file-picker-header p{color:var(--color-on-surface-variant);font-size:.9rem;margin:0}.file-picker .file-picker-actions{display:flex;flex-wrap:wrap;gap:1rem;justify-content:center;margin-block-end:2rem}.file-picker .file-picker-actions .btn{align-items:center;border:1px solid transparent;border-radius:var(--radius-md);display:flex;font-weight:500;gap:.5rem;padding:.75rem 1.5rem;transition:all .2s ease}.file-picker .file-picker-actions .btn:hover{box-shadow:0 4px 8px rgba(0,0,0,.1);transform:translateY(-1px)}.file-picker .file-picker-actions .btn.btn-primary{background:var(--color-primary);border-color:var(--color-primary);color:var(--color-on-primary)}.file-picker .file-picker-actions .btn:not(.btn-primary){background:var(--color-surface-container);border-color:var(--color-outline-variant);color:var(--color-on-surface)}.file-picker .file-picker-info{max-inline-size:400px}.file-picker .file-picker-info p{color:var(--color-on-surface-variant);font-size:.85rem;margin:.25rem 0}.file-picker .file-picker-info p strong{color:var(--color-on-surface)}}}@property --color-primary{syntax:\"<color>\";inherits:true;initial-value:#5a7fff}@property --base-color{syntax:\"<color>\";inherits:true;initial-value:#5a7fff}@property --color-secondary{syntax:\"<color>\";inherits:true;initial-value:#6b8cff}@property --color-tertiary{syntax:\"<color>\";inherits:true;initial-value:#8aa0ff}@property --color-error{syntax:\"<color>\";inherits:true;initial-value:#ef4444}@property --color-success{syntax:\"<color>\";inherits:true;initial-value:#4caf50}@property --color-warning{syntax:\"<color>\";inherits:true;initial-value:#ff9800}@property --color-info{syntax:\"<color>\";inherits:true;initial-value:#2196f3}@layer tokens, base, layout, utilities, shells, shell, views, view, viewer, components, ux-layer, markdown, essentials, print, print-breaks, overrides;@layer tokens{:host,:root,:scope{--color-primary:#5a7fff;color-scheme:light dark;--base-color:var(--color-primary);--base-color-neutralized:color-mix(in oklab,var(--base-color) 60%,gray);--wf-md-primary:var(--color-primary);--wf-md-seed:var(--base-color);--color-on-primary:--u2-color-mod(var(--base-color),40);--color-secondary:--u2-color-mod(var(--base-color),420);--color-on-secondary:--u2-color-mod(var(--base-color),40);--color-tertiary:--u2-color-mod(var(--base-color),400);--color-on-tertiary:--u2-color-mod(var(--base-color),40);--color-error:#ef4444;--color-on-error:--u2-color-mod(var(--color-error),40);--color-success:#4caf50;--color-warning:#ff9800;--color-info:#2196f3;--color-background:--u2-color-mod(var(--base-color),60);--color-on-background:--u2-color-mod(var(--base-color),900);--color-surface:--u2-color-mod(var(--base-color),60);--color-on-surface:--u2-color-mod(var(--base-color),900);--color-surface-variant:--u2-color-mod(var(--base-color),160);--color-on-surface-variant:--u2-color-mod(var(--base-color),700);--color-outline:--u2-color-mod(var(--base-color),300);--color-outline-variant:--u2-color-mod(var(--base-color),400);--color-surface-container-lowest:--u2-color-mod(var(--base-color),2);--color-surface-container-low:--u2-color-mod(var(--base-color),10);--color-surface-container:--u2-color-mod(var(--base-color),20);--color-surface-container-high:--u2-color-mod(var(--base-color),30);--color-surface-container-highest:--u2-color-mod(var(--base-color),40);--color-border:color-mix(in oklab,var(--color-outline-variant) 75%,transparent);--color-bg:var(--color-background);--color-text:var(--color-on-background);--color-fg:var(--color-on-surface);--on-surface-color:var(--color-on-surface);--on-surface-variant:var(--color-on-surface-variant);--wf-md-surface:var(--color-surface);--wf-md-on-surface:var(--color-on-surface);--wf-md-on-surface-variant:var(--color-on-surface-variant);--wf-md-surf-container:var(--color-surface-container);--wf-md-surf-container-low:var(--color-surface-container-low);--wf-md-surf-container-high:var(--color-surface-container-high);--wf-md-outline-variant:var(--color-outline-variant);--space-xs:0.25rem;--space-sm:0.5rem;--space-md:0.75rem;--space-lg:1rem;--space-xl:1.25rem;--space-2xl:1.5rem;--padding-xs:var(--space-xs);--padding-sm:var(--space-sm);--padding-md:var(--space-md);--padding-lg:var(--space-lg);--padding-xl:var(--space-xl);--padding-2xl:var(--space-2xl);--padding-3xl:2rem;--padding-4xl:2.5rem;--padding-5xl:3rem;--padding-6xl:4rem;--padding-7xl:5rem;--padding-8xl:6rem;--padding-9xl:8rem;--gap-xs:var(--space-xs);--gap-sm:var(--space-sm);--gap-md:var(--space-md);--gap-lg:var(--space-lg);--gap-xl:var(--space-xl);--gap-2xl:var(--space-2xl);--radius-none:0;--radius-sm:0.25rem;--radius-default:0.25rem;--radius-md:0.375rem;--radius-lg:0.5rem;--radius-xl:0.75rem;--radius-2xl:1rem;--radius-3xl:1.5rem;--radius-full:9999px;--elev-0:none;--elev-1:0 1px 1px rgba(0,0,0,0.06),0 1px 3px rgba(0,0,0,0.1);--elev-2:0 2px 6px rgba(0,0,0,0.12),0 8px 24px rgba(0,0,0,0.08);--elev-3:0 6px 16px rgba(0,0,0,0.14),0 18px 48px rgba(0,0,0,0.1);--shadow-xs:0 1px 2px rgba(0,0,0,0.05);--shadow-sm:0 1px 3px rgba(0,0,0,0.1);--shadow-md:0 4px 6px rgba(0,0,0,0.1);--shadow-lg:0 10px 15px rgba(0,0,0,0.1);--shadow-xl:0 20px 25px rgba(0,0,0,0.1);--shadow-2xl:0 25px 50px rgba(0,0,0,0.1);--shadow-inset:inset 0 2px 4px rgba(0,0,0,0.06);--shadow-inset-strong:inset 0 4px 8px rgba(0,0,0,0.12);--shadow-none:0 0 #0000;--text-xs:0.8rem;--text-sm:0.9rem;--text-base:1rem;--text-lg:1.1rem;--text-xl:1.25rem;--text-2xl:1.6rem;--text-3xl:2rem;--font-size-xs:0.75rem;--font-size-sm:0.875rem;--font-size-base:1rem;--font-size-lg:1.125rem;--font-size-xl:1.25rem;--font-weight-normal:400;--font-weight-medium:500;--font-weight-semibold:600;--font-weight-bold:700;--font-family:\"Roboto\",ui-sans-serif,system-ui,-apple-system,Segoe UI,sans-serif;--font-family-mono:\"Roboto Mono\",\"SF Mono\",Monaco,Inconsolata,\"Fira Code\",monospace;--font-sans:var(--font-family);--font-mono:var(--font-family-mono);--leading-tight:1.2;--leading-normal:1.5;--leading-relaxed:1.8;--transition-fast:120ms cubic-bezier(0.2,0,0,1);--transition-normal:160ms cubic-bezier(0.2,0,0,1);--transition-slow:200ms cubic-bezier(0.2,0,0,1);--motion-fast:var(--transition-fast);--motion-normal:var(--transition-normal);--motion-slow:var(--transition-slow);--focus-ring:0 0 0 3px color-mix(in oklab,var(--color-primary) 35%,transparent);--z-base:0;--z-dropdown:100;--z-sticky:200;--z-fixed:300;--z-modal-backdrop:400;--z-modal:500;--z-popover:600;--z-tooltip:700;--z-toast:800;--z-max:9999;--view-bg:var(--color-surface);--view-fg:var(--color-on-surface);--view-border:var(--color-outline-variant);--view-input-bg:light-dark(--u2-color-mod(var(--base-color,var(--color-primary)),40),var(--color-surface-container-high));--view-files-bg:var(--color-surface-container-low);--view-file-bg:var(--color-surface-container-lowest,var(--color-surface-container-low));--view-results-bg:var(--color-surface-container-low);--view-result-bg:var(--color-surface-container-lowest,var(--color-surface-container-low));--color-surface-elevated:var(--color-surface-container);--color-surface-hover:var(--color-surface-container-low);--color-surface-active:var(--color-surface-container-high);--color-on-surface-muted:var(--color-on-surface-variant);--color-background-alt:var(--color-surface-variant);--color-primary-hover:light-dark(--u2-color-mod(var(--base-color,var(--color-primary)),620),--u2-color-mod(var(--base-color,var(--color-primary)),480));--color-primary-active:light-dark(--u2-color-mod(var(--base-color,var(--color-primary)),700),--u2-color-mod(var(--base-color,var(--color-primary)),400));--color-accent:var(--color-secondary);--color-accent-hover:light-dark(--u2-color-mod(var(--base-color,var(--color-primary)),500),--u2-color-mod(var(--base-color,var(--color-primary)),600));--color-on-accent:var(--color-on-secondary);--color-border-hover:var(--color-outline-variant);--color-border-strong:var(--color-outline);--color-border-focus:var(--color-primary);--color-text:var(--color-on-surface);--color-text-secondary:var(--color-on-surface-variant);--color-text-muted:color-mix(in oklab,var(--color-on-surface) 50%,var(--color-surface));--color-text-disabled:color-mix(in oklab,var(--color-on-surface) 38%,var(--color-surface));--color-text-inverse:var(--color-on-primary);--color-link:var(--color-primary);--color-link-hover:var(--color-primary-hover);--color-success-light:--u2-color-mod(var(--color-success),280);--color-success-dark:--u2-color-mod(var(--color-success),720);--color-warning-light:--u2-color-mod(var(--color-warning),280);--color-warning-dark:--u2-color-mod(var(--color-warning),720);--color-error-light:--u2-color-mod(var(--color-error),280);--color-error-dark:--u2-color-mod(var(--color-error),720);--color-info-light:--u2-color-mod(var(--color-info),280);--color-info-dark:--u2-color-mod(var(--color-info),720);--color-bg:var(--color-surface,var(--color-surface));--color-bg-alt:var(--color-surface-variant,var(--color-surface-variant));--color-fg:var(--color-on-surface,var(--color-on-surface));--color-fg-muted:var(--color-on-surface-variant,var(--color-on-surface-variant));--btn-height-sm:2rem;--btn-height-md:2.5rem;--btn-height-lg:3rem;--btn-padding-x-sm:var(--space-md);--btn-padding-x-md:var(--space-lg);--btn-padding-x-lg:1.5rem;--btn-radius:var(--radius-md);--btn-font-weight:var(--font-weight-medium);--input-height-sm:2rem;--input-height-md:2.5rem;--input-height-lg:3rem;--input-padding-x:var(--space-md);--input-radius:var(--radius-md);--input-border-color:var(--color-border,var(--color-border));--input-focus-ring-color:var(--color-primary);--input-focus-ring-width:2px;--card-padding:var(--space-lg);--card-radius:var(--radius-lg);--card-shadow:var(--shadow-sm);--card-border-color:var(--color-border,var(--color-border));--modal-backdrop-bg:light-dark(rgb(0 0 0/0.5),rgb(0 0 0/0.7));--modal-bg:var(--color-surface,var(--color-surface));--modal-radius:var(--radius-xl);--modal-shadow:var(--shadow-xl);--modal-padding:1.5rem;--toast-font-family:var(--font-family,system-ui,-apple-system,BlinkMacSystemFont,\"Segoe UI\",Roboto,sans-serif);--toast-font-size:var(--font-size-base,1rem);--toast-font-weight:var(--font-weight-medium,500);--toast-letter-spacing:0.01em;--toast-line-height:1.4;--toast-white-space:nowrap;--toast-pointer-events:auto;--toast-user-select:none;--toast-cursor:default;--toast-opacity:0;--toast-transform:translateY(100%) scale(0.9);--toast-transition:opacity 160ms ease-out,transform 160ms cubic-bezier(0.16,1,0.3,1),background-color 100ms ease;--toast-text:var(--color-on-surface,var(--color-on-surface,light-dark(#ffffff,#000000)));--toast-bg:color-mix(in oklab,var(--color-surface-elevated,var(--color-surface-container-high,var(--color-surface,light-dark(#fafbfc,#1e293b)))) 90%,var(--color-on-surface,var(--color-on-surface,light-dark(#000000,#ffffff))));--toast-radius:var(--radius-lg);--toast-shadow:var(--shadow-lg);--toast-padding:var(--space-lg);--sidebar-width:280px;--sidebar-collapsed-width:64px;--nav-height:56px;--nav-height-compact:48px;--status-height:24px;--status-bg:var(--color-surface-elevated,var(--color-surface-container-high));--status-font-size:var(--text-xs);--shell-bg:var(--color-surface);--shell-fg:var(--color-on-surface);--shell-nav-bg:var(--color-surface-container-high);--shell-nav-fg:var(--color-on-surface);--shell-nav-border:var(--color-outline-variant);--shell-btn-hover:var(--color-surface-container);--shell-btn-active-bg:color-mix(in oklab,var(--color-primary) 18%,var(--color-surface));--shell-btn-active-fg:var(--color-on-surface);--shell-status-bg:var(--color-surface-container-low);--shell-status-fg:var(--color-on-surface);--faint-nav-bg:var(--color-surface-container-high);--faint-nav-border:var(--color-outline-variant);--faint-sidebar-bg:var(--color-surface-container-high);--env-status-fg:light-dark(#1c1c1e,#f5f5f7);--env-status-fg-muted:color-mix(in oklab,var(--env-status-fg) 78%,transparent);--env-launcher-fg:#f7f7f8;--env-launcher-fg-shadow:rgb(0 0 0/0.88);--env-launcher-fg-glow:rgb(0 0 0/0.45);--error-color:var(--color-error,#f87171);--sv-bg:var(--color-surface-container-low,light-dark(#eef1f6,#0f1318));--sv-fg:var(--color-on-surface,light-dark(#12151a,#e8edf2));--sv-muted:var(--color-on-surface-variant,light-dark(#5c6570,#a8b0bc));--sv-outline:var(--color-outline-variant,light-dark(#c5cdd8,#3d4755));--sv-surface-1:var(--color-surface-container-low,light-dark(#ffffff,#171c24));--sv-surface-2:var(--color-surface-container,light-dark(#f4f6fa,#1c232d));--sv-primary:var(--base-color,var(--color-primary,#5a7fff));--sv-danger:var(--color-error,#d32f2f);--vh-bg:var(--color-surface,light-dark(#eef1f6,#0f1318));--vh-fg:var(--color-on-surface,light-dark(#12151a,#e8edf2));--vh-muted:var(--color-on-surface-variant,light-dark(#5c6570,#a8b0bc));--vh-primary:var(--color-primary,#007acc);--vh-danger:var(--color-error,#d32f2f);--vh-on-primary:var(--color-on-primary,#ffffff);--vh-item-bg:var(--color-surface-container-low,light-dark(#e0e5ee,#0a0d12));--view-fg-muted:color-mix(in oklab,var(--color-on-surface,#ccc) 72%,transparent);--view-hover-bg:color-mix(in oklab,var(--color-primary,#3794ff) 12%,transparent);--view-selected-bg:color-mix(in oklab,var(--color-primary,#3794ff) 18%,transparent);--view-selected-border:var(--color-primary,#3794ff)}@supports (color:color-mix(in lch,red,blue)){:host,:root,:scope{--view-border:color-mix(in oklab,var(--color-outline-variant,#888) 45%,transparent)}}@media (prefers-color-scheme:dark){:host:not([data-theme=light]):not([data-theme=dark]),:root:not([data-theme=light]):not([data-theme=dark]){color-scheme:dark;--base-color:var(--color-primary);--base-color-neutralized:color-mix(in oklab,var(--base-color) 60%,gray);--wf-md-primary:var(--color-primary);--wf-md-seed:var(--base-color);--color-on-primary:--u2-color-mod(var(--base-color),920);--color-secondary:--u2-color-mod(var(--base-color),680);--color-on-secondary:--u2-color-mod(var(--base-color),920);--color-tertiary:--u2-color-mod(var(--base-color),700);--color-on-tertiary:--u2-color-mod(var(--base-color),920);--color-error:#f87171;--color-on-error:--u2-color-mod(var(--color-error),920);--color-success:#66bb6a;--color-warning:#ffa726;--color-info:#42a5f5;--color-background:--u2-color-mod(var(--base-color),940);--color-on-background:--u2-color-mod(var(--base-color),100);--color-surface:--u2-color-mod(var(--base-color),940);--color-on-surface:--u2-color-mod(var(--base-color),100);--color-surface-variant:--u2-color-mod(var(--base-color),840);--color-on-surface-variant:--u2-color-mod(var(--base-color),280);--color-outline:--u2-color-mod(var(--base-color),720);--color-outline-variant:--u2-color-mod(var(--base-color),640);--color-surface-container-lowest:--u2-color-mod(var(--base-color),920);--color-surface-container-low:--u2-color-mod(var(--base-color),940);--color-surface-container:--u2-color-mod(var(--base-color),960);--color-surface-container-high:--u2-color-mod(var(--base-color),980);--color-surface-container-highest:--u2-color-mod(var(--base-color),1000);--color-border:color-mix(in oklab,var(--color-outline-variant) 70%,transparent);--color-bg:var(--color-background);--color-text:var(--color-on-background);--color-fg:var(--color-on-surface);--on-surface-color:var(--color-on-surface);--on-surface-variant:var(--color-on-surface-variant);--wf-md-surface:var(--color-surface);--wf-md-on-surface:var(--color-on-surface);--wf-md-on-surface-variant:var(--color-on-surface-variant);--wf-md-surf-container:var(--color-surface-container);--wf-md-surf-container-low:var(--color-surface-container-low);--wf-md-surf-container-high:var(--color-surface-container-high);--wf-md-outline-variant:var(--color-outline-variant)}}:host[data-theme=light],:root[data-theme=light],[data-theme=light]{color-scheme:light only;--base-color:var(--color-primary);--base-color-neutralized:color-mix(in oklab,var(--base-color) 60%,gray);--wf-md-primary:var(--color-primary);--wf-md-seed:var(--base-color);--color-on-primary:--u2-color-mod(var(--base-color),40);--color-secondary:--u2-color-mod(var(--base-color),420);--color-on-secondary:--u2-color-mod(var(--base-color),40);--color-tertiary:--u2-color-mod(var(--base-color),400);--color-on-tertiary:--u2-color-mod(var(--base-color),40);--color-error:#ef4444;--color-on-error:--u2-color-mod(var(--color-error),40);--color-success:#4caf50;--color-warning:#ff9800;--color-info:#2196f3;--color-background:--u2-color-mod(var(--base-color),60);--color-on-background:--u2-color-mod(var(--base-color),900);--color-surface:--u2-color-mod(var(--base-color),60);--color-on-surface:--u2-color-mod(var(--base-color),900);--color-surface-variant:--u2-color-mod(var(--base-color),160);--color-on-surface-variant:--u2-color-mod(var(--base-color),700);--color-outline:--u2-color-mod(var(--base-color),300);--color-outline-variant:--u2-color-mod(var(--base-color),400);--color-surface-container-lowest:--u2-color-mod(var(--base-color),2);--color-surface-container-low:--u2-color-mod(var(--base-color),10);--color-surface-container:--u2-color-mod(var(--base-color),20);--color-surface-container-high:--u2-color-mod(var(--base-color),30);--color-surface-container-highest:--u2-color-mod(var(--base-color),40);--color-border:color-mix(in oklab,var(--color-outline-variant) 75%,transparent);--color-bg:var(--color-background);--color-text:var(--color-on-background);--color-fg:var(--color-on-surface);--on-surface-color:var(--color-on-surface);--on-surface-variant:var(--color-on-surface-variant);--wf-md-surface:var(--color-surface);--wf-md-on-surface:var(--color-on-surface);--wf-md-on-surface-variant:var(--color-on-surface-variant);--wf-md-surf-container:var(--color-surface-container);--wf-md-surf-container-low:var(--color-surface-container-low);--wf-md-surf-container-high:var(--color-surface-container-high);--wf-md-outline-variant:var(--color-outline-variant)}:host[data-theme=dark],:root[data-theme=dark],[data-theme=dark]{color-scheme:dark only;--base-color:var(--color-primary);--base-color-neutralized:color-mix(in oklab,var(--base-color) 60%,gray);--wf-md-primary:var(--color-primary);--wf-md-seed:var(--base-color);--color-on-primary:--u2-color-mod(var(--base-color),920);--color-secondary:--u2-color-mod(var(--base-color),680);--color-on-secondary:--u2-color-mod(var(--base-color),920);--color-tertiary:--u2-color-mod(var(--base-color),700);--color-on-tertiary:--u2-color-mod(var(--base-color),920);--color-error:#f87171;--color-on-error:--u2-color-mod(var(--color-error),920);--color-success:#66bb6a;--color-warning:#ffa726;--color-info:#42a5f5;--color-background:--u2-color-mod(var(--base-color),940);--color-on-background:--u2-color-mod(var(--base-color),100);--color-surface:--u2-color-mod(var(--base-color),940);--color-on-surface:--u2-color-mod(var(--base-color),100);--color-surface-variant:--u2-color-mod(var(--base-color),840);--color-on-surface-variant:--u2-color-mod(var(--base-color),280);--color-outline:--u2-color-mod(var(--base-color),720);--color-outline-variant:--u2-color-mod(var(--base-color),640);--color-surface-container-lowest:--u2-color-mod(var(--base-color),920);--color-surface-container-low:--u2-color-mod(var(--base-color),940);--color-surface-container:--u2-color-mod(var(--base-color),960);--color-surface-container-high:--u2-color-mod(var(--base-color),980);--color-surface-container-highest:--u2-color-mod(var(--base-color),1000);--color-border:color-mix(in oklab,var(--color-outline-variant) 70%,transparent);--color-bg:var(--color-background);--color-text:var(--color-on-background);--color-fg:var(--color-on-surface);--on-surface-color:var(--color-on-surface);--on-surface-variant:var(--color-on-surface-variant);--wf-md-surface:var(--color-surface);--wf-md-on-surface:var(--color-on-surface);--wf-md-on-surface-variant:var(--color-on-surface-variant);--wf-md-surf-container:var(--color-surface-container);--wf-md-surf-container-low:var(--color-surface-container-low);--wf-md-surf-container-high:var(--color-surface-container-high);--wf-md-outline-variant:var(--color-outline-variant)}:root[data-scheme=auto]:not([data-theme=light]):not([data-theme=dark]),:root[data-scheme=system]:not([data-theme=light]):not([data-theme=dark]){color-scheme:light dark}@media (prefers-reduced-motion:reduce){:root{--transition-fast:0ms;--transition-normal:0ms;--transition-slow:0ms;--motion-fast:0ms;--motion-normal:0ms;--motion-slow:0ms}}@media (prefers-contrast:high){:root{--color-border:var(--color-border,var(--color-outline));--color-border-hover:color-mix(in oklab,var(--color-border,var(--color-outline)) 80%,var(--color-on-surface,var(--color-on-surface)));--color-text-secondary:var(--color-on-surface,var(--color-on-surface));--color-text-muted:var(--color-on-surface-variant,var(--color-on-surface-variant))}}@media print{:root{--view-padding:0;--view-content-max-width:100%;--view-bg:white;--view-fg:black;--view-heading-color:black;--view-link-color:black}:root:has([data-view=viewer]){--view-code-bg:#f5f5f5;--view-code-fg:black;--view-blockquote-bg:#f5f5f5}}}@layer utilities{.m-0{margin:0}.mb-0{margin-block:0}.mi-0{margin-inline:0}.p-0{padding:0}.pb-0{padding-block:0}.pi-0{padding-inline:0}.gap-0{gap:0}.inset-0{inset:0}.m-xs{margin:.25rem}.mb-xs{margin-block:.25rem}.mi-xs{margin-inline:.25rem}.p-xs{padding:.25rem}.pb-xs{padding-block:.25rem}.pi-xs{padding-inline:.25rem}.gap-xs{gap:.25rem}.inset-xs{inset:.25rem}.m-sm{margin:.5rem}.mb-sm{margin-block:.5rem}.mi-sm{margin-inline:.5rem}.p-sm{padding:.5rem}.pb-sm{padding-block:.5rem}.pi-sm{padding-inline:.5rem}.gap-sm{gap:.5rem}.inset-sm{inset:.5rem}.m-md{margin:.75rem}.mb-md{margin-block:.75rem}.mi-md{margin-inline:.75rem}.p-md{padding:.75rem}.pb-md{padding-block:.75rem}.pi-md{padding-inline:.75rem}.gap-md{gap:.75rem}.inset-md{inset:.75rem}.m-lg{margin:1rem}.mb-lg{margin-block:1rem}.mi-lg{margin-inline:1rem}.p-lg{padding:1rem}.pb-lg{padding-block:1rem}.pi-lg{padding-inline:1rem}.gap-lg{gap:1rem}.inset-lg{inset:1rem}.m-xl{margin:1.25rem}.mb-xl{margin-block:1.25rem}.mi-xl{margin-inline:1.25rem}.p-xl{padding:1.25rem}.pb-xl{padding-block:1.25rem}.pi-xl{padding-inline:1.25rem}.gap-xl{gap:1.25rem}.inset-xl{inset:1.25rem}.m-2xl{margin:1.5rem}.mb-2xl{margin-block:1.5rem}.mi-2xl{margin-inline:1.5rem}.p-2xl{padding:1.5rem}.pb-2xl{padding-block:1.5rem}.pi-2xl{padding-inline:1.5rem}.gap-2xl{gap:1.5rem}.inset-2xl{inset:1.5rem}.m-3xl{margin:2rem}.mb-3xl{margin-block:2rem}.mi-3xl{margin-inline:2rem}.p-3xl{padding:2rem}.pb-3xl{padding-block:2rem}.pi-3xl{padding-inline:2rem}.gap-3xl{gap:2rem}.inset-3xl{inset:2rem}.text-xs{font-size:.75rem}.text-sm,.text-xs{font-weight:400;letter-spacing:0;line-height:1.5}.text-sm{font-size:.875rem}.text-base{font-size:1rem}.text-base,.text-lg{font-weight:400;letter-spacing:0;line-height:1.5}.text-lg{font-size:1.125rem}.text-xl{font-size:1.25rem}.text-2xl,.text-xl{font-weight:400;letter-spacing:0;line-height:1.5}.text-2xl{font-size:1.5rem}.font-thin{font-weight:100}.font-light{font-weight:300}.font-normal{font-weight:400}.font-medium{font-weight:500}.font-semibold{font-weight:600}.font-bold{font-weight:700}.text-start{text-align:start}.text-center{text-align:center}.text-end{text-align:end}.text-primary{color:#1e293b,#f1f5f9}.text-secondary{color:#64748b,#94a3b8}.text-muted{color:#94a3b8,#64748b}.text-disabled{color:#cbd5e1,#475569}.block,.vu-block{display:block}.inline,.vu-inline{display:inline}.inline-block{display:inline-block}.flex,.vu-flex{display:flex}.inline-flex{display:inline-flex}.grid,.vu-grid{display:grid}.hidden,.vu-hidden{display:none}.flex-row{flex-direction:row}.flex-col{flex-direction:column}.flex-wrap{flex-wrap:wrap}.flex-nowrap{flex-wrap:nowrap}.items-start{align-items:flex-start}.items-center{align-items:center}.items-end{align-items:flex-end}.items-stretch{align-items:stretch}.justify-start{justify-content:flex-start}.justify-center{justify-content:center}.justify-end{justify-content:flex-end}.justify-between{justify-content:space-between}.justify-around{justify-content:space-around}.grid-cols-1{grid-template-columns:repeat(1,minmax(0,1fr))}.grid-cols-2{grid-template-columns:repeat(2,minmax(0,1fr))}.grid-cols-3{grid-template-columns:repeat(3,minmax(0,1fr))}.grid-cols-4{grid-template-columns:repeat(4,minmax(0,1fr))}.block-size-auto,.h-auto{block-size:auto}.block-size-full,.h-full{block-size:100%}.h-screen{block-size:100vh}.inline-size-auto,.w-auto{inline-size:auto}.inline-size-full,.w-full{inline-size:100%}.w-screen{inline-size:100vw}.min-block-size-0,.min-h-0{min-block-size:0}.min-inline-size-0,.min-w-0{min-inline-size:0}.max-block-size-full,.max-h-full{max-block-size:100%}.max-inline-size-full,.max-w-full{max-inline-size:100%}.static{position:static}.relative{position:relative}.absolute{position:absolute}.fixed{position:fixed}.sticky{position:sticky}.bg-surface{background-color:#fafbfc,#0f1419}.bg-surface-container{background-color:#f1f5f9,#1e293b}.bg-surface-container-high{background-color:#e2e8f0,#334155}.bg-primary{background-color:#5a7fff,#7ca7ff}.bg-secondary{background-color:#6b7280,#94a3b8}.border{border:1px solid #475569}.border-2{border:2px solid #475569}.border-primary{border:1px solid #7ca7ff}.border-secondary{border:1px solid #94a3b8}.rounded-none{border-radius:0}.rounded-sm{border-radius:.25rem}.rounded-md{border-radius:.375rem}.rounded-lg{border-radius:.5rem}.rounded-full{border-radius:9999px}.shadow-xs{box-shadow:0 1px 2px 0 rgba(0,0,0,.05)}.shadow-sm{box-shadow:0 1px 3px 0 rgba(0,0,0,.1)}.shadow-md{box-shadow:0 4px 6px -1px rgba(0,0,0,.1)}.shadow-lg{box-shadow:0 10px 15px -3px rgba(0,0,0,.1)}.shadow-xl{box-shadow:0 20px 25px -5px rgba(0,0,0,.1)}.cursor-pointer{cursor:pointer}.cursor-default{cursor:default}.cursor-not-allowed{cursor:not-allowed}.select-none{user-select:none}.select-text{user-select:text}.select-all{user-select:all}.visible{visibility:visible}.invisible{visibility:hidden}.collapse,.vs-collapsed{visibility:collapse}.opacity-0{opacity:0}.opacity-25{opacity:.25}.opacity-50{opacity:.5}.opacity-75{opacity:.75}.opacity-100{opacity:1}@container (max-width: 320px){.hidden\\@xs{display:none}}@container (max-width: 640px){.hidden\\@sm{display:none}}@container (max-width: 768px){.hidden\\@md{display:none}}@container (max-width: 1024px){.hidden\\@lg{display:none}}@container (min-width: 320px){.block\\@xs{display:block}}@container (min-width: 640px){.block\\@sm{display:block}}@container (min-width: 768px){.block\\@md{display:block}}@container (min-width: 1024px){.block\\@lg{display:block}}@container (max-width: 320px){.text-sm\\@xs{font-size:.875rem;font-weight:400;letter-spacing:0;line-height:1.5}}@container (min-width: 640px){.text-base\\@sm{font-size:1rem;font-weight:400;letter-spacing:0;line-height:1.5}}.icon-xs{--icon-size:0.75rem}.icon-sm{--icon-size:0.875rem}.icon-md{--icon-size:1rem}.icon-lg{--icon-size:1.25rem}.icon-xl{--icon-size:1.5rem}.center-absolute{left:50%;position:absolute;top:50%;transform:translate(-50%,-50%)}.center-flex{align-items:center;display:flex;flex-direction:row;flex-wrap:nowrap;justify-content:center}.interactive{cursor:pointer;touch-action:manipulation;user-select:none;-webkit-tap-highlight-color:transparent}.interactive:focus-visible{outline:2px solid #1e40af;outline-offset:2px}.interactive:disabled,.interactive[aria-disabled=true]{cursor:not-allowed;opacity:.6;pointer-events:none}.focus-ring:focus-visible{outline:2px solid #1e40af;outline-offset:2px}.truncate{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.truncate-2{-webkit-line-clamp:2}.truncate-2,.truncate-3{display:-webkit-box;-webkit-box-orient:vertical;overflow:hidden}.truncate-3{-webkit-line-clamp:3}.aspect-square{aspect-ratio:1}.aspect-video{aspect-ratio:16/9}.margin-block-0{margin-block:0}.margin-block-sm{margin-block:var(--space-sm)}.margin-block-md{margin-block:var(--space-md)}.margin-block-lg{margin-block:var(--space-lg)}.margin-inline-0{margin-inline:0}.margin-inline-sm{margin-inline:var(--space-sm)}.margin-inline-md{margin-inline:var(--space-md)}.margin-inline-lg{margin-inline:var(--space-lg)}.margin-inline-auto{margin-inline:auto}.padding-block-0{padding-block:0}.padding-block-sm{padding-block:var(--space-sm)}.padding-block-md{padding-block:var(--space-md)}.padding-block-lg{padding-block:var(--space-lg)}.padding-inline-0{padding-inline:0}.padding-inline-sm{padding-inline:var(--space-sm)}.padding-inline-md{padding-inline:var(--space-md)}.padding-inline-lg{padding-inline:var(--space-lg)}.pointer-events-none{pointer-events:none}.pointer-events-auto{pointer-events:auto}.line-clamp-1{-webkit-line-clamp:1}.line-clamp-1,.line-clamp-2{display:-webkit-box;-webkit-box-orient:vertical;overflow:hidden}.line-clamp-2{-webkit-line-clamp:2}.line-clamp-3{display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}.vs-active{--state-active:1}.vs-disabled{opacity:.5;pointer-events:none}.vs-loading{cursor:wait}.vs-error{color:var(--color-error,#dc3545)}.vs-success{color:var(--color-success,#28a745)}.vs-hidden{display:none!important}.container,.vl-container{inline-size:100%;margin-inline:auto;max-inline-size:var(--container-max,1200px)}.vl-container{padding-inline:var(--space-md)}.container{padding-inline:var(--space-lg)}.vl-grid{display:grid;gap:var(--gap-md)}.vl-stack{display:flex;flex-direction:column;gap:var(--gap-md)}.vl-cluster{flex-wrap:wrap;gap:var(--gap-sm)}.vl-center,.vl-cluster{align-items:center;display:flex}.vl-center{justify-content:center}.vu-sr-only{block-size:1px;inline-size:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;clip:rect(0,0,0,0);border:0;white-space:nowrap}.vc-surface{background-color:var(--color-surface);color:var(--color-on-surface)}.vc-surface-variant{background-color:var(--color-surface-variant);color:var(--color-on-surface-variant)}.vc-primary{background-color:var(--color-primary);color:var(--color-on-primary)}.vc-secondary{background-color:var(--color-secondary);color:var(--color-on-secondary)}.vc-elevated{box-shadow:var(--elev-1)}.vc-elevated-2{box-shadow:var(--elev-2)}.vc-elevated-3{box-shadow:var(--elev-3)}.vc-rounded{border-radius:var(--radius-md)}.vc-rounded-sm{border-radius:var(--radius-sm)}.vc-rounded-lg{border-radius:var(--radius-lg)}.vc-rounded-full{border-radius:var(--radius-full,9999px)}.card{background:var(--color-bg);border:1px solid var(--color-border);border-radius:var(--radius-lg);box-shadow:var(--shadow-sm);padding:var(--space-lg)}.stack>*+*{margin-block-start:var(--space-md)}.stack-sm>*+*{margin-block-start:var(--space-sm)}.stack-lg>*+*{margin-block-start:var(--space-lg)}@media print{.print-hidden{display:none!important}.print-visible{display:block!important}.print-break-before{page-break-before:always}.print-break-after{page-break-after:always}.print-break-inside-avoid{page-break-inside:avoid}}@media (prefers-reduced-motion:reduce){.transition-fast,.transition-normal,.transition-slow{transition:none}*{animation-duration:.01ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important}}@media (prefers-contrast:high){.text-primary{color:var(--color-on-surface)}.text-disabled,.text-muted,.text-secondary{color:var(--color-on-surface-variant)}.border{border-width:2px}.border-top{border-top-width:2px}.border-bottom{border-bottom-width:2px}.border-left{border-left-width:2px}.border-right{border-right-width:2px}}}@property --value{syntax:\"<number>\";initial-value:0;inherits:true}@property --relate{syntax:\"<number>\";initial-value:0;inherits:true}@property --drag-x{syntax:\"<number>\";initial-value:0;inherits:false}@property --drag-y{syntax:\"<number>\";initial-value:0;inherits:false}@property --order{syntax:\"<integer>\";initial-value:1;inherits:true}@property --content-inline-size{syntax:\"<length-percentage>\";initial-value:100%;inherits:true}@property --content-block-size{syntax:\"<length-percentage>\";initial-value:100%;inherits:true}@property --icon-size{syntax:\"<length-percentage>\";initial-value:16px;inherits:true}@property --icon-color{syntax:\"<color>\";initial-value:rgba(0,0,0,0);inherits:true}@property --icon-padding{syntax:\"<length-percentage>\";initial-value:0px;inherits:true}@property --icon-image{syntax:\"<image>\";initial-value:linear-gradient(rgba(0,0,0,0),rgba(0,0,0,0));inherits:true}@layer ux-classes{.grid-rows>::slotted(*){display:grid;grid-auto-flow:column}.grid-rows>::slotted(*){place-content:center;place-items:center}.grid-rows>::slotted(*){--order:sibling-index();grid-column:1/-1;grid-row:var(--order,1)/calc(var(--order, 1) + 1);grid-template-columns:subgrid;grid-template-rows:minmax(0,max-content)}:host(.grid-rows) ::slotted(::slotted(*)){display:grid;grid-auto-flow:column}:host(.grid-rows) ::slotted(::slotted(*)){place-content:center;place-items:center}:host(.grid-rows) ::slotted(::slotted(*)){--order:sibling-index();grid-column:1/-1;grid-row:var(--order,1)/calc(var(--order, 1) + 1);grid-template-columns:subgrid;grid-template-rows:minmax(0,max-content)}.grid-rows>*{display:grid;grid-auto-flow:column;place-content:center;place-items:center;--order:sibling-index();grid-column:1/-1;grid-row:var(--order,1)/calc(var(--order, 1) + 1);grid-template-columns:subgrid;grid-template-rows:minmax(0,max-content)}:host(.grid-rows) ::slotted(*){display:grid;grid-auto-flow:column}:host(.grid-rows) ::slotted(*){place-content:center;place-items:center}:host(.grid-rows) ::slotted(*){--order:sibling-index();grid-column:1/-1;grid-row:var(--order,1)/calc(var(--order, 1) + 1);grid-template-columns:subgrid;grid-template-rows:minmax(0,max-content)}.grid-rows{--display:inline-grid;--flow:column;--items:center;--content:center;block-size:auto;box-sizing:border-box;display:var(--display,inline-block);flex-direction:var(--flow,row);inline-size:auto;place-content:var(--content,center);place-items:var(--items,center);--i-size:auto;--b-size:auto;aspect-ratio:var(--ar,auto);block-size:var(--b-size,100%);grid-auto-rows:minmax(0,max-content);grid-template-columns:minmax(0,max-content) minmax(0,1fr) minmax(0,max-content);inline-size:var(--i-size,100%);list-style-position:inside;list-style-type:none;margin:0;padding:0}:host(.grid-rows){--display:inline-grid;--flow:column;--items:center;--content:center;box-sizing:border-box;display:var(--display,inline-block);flex-direction:var(--flow,row);place-content:var(--content,center);place-items:var(--items,center)}:host(.grid-rows){block-size:auto;inline-size:auto;--i-size:auto;--b-size:auto;aspect-ratio:var(--ar,auto);block-size:var(--b-size,100%);inline-size:var(--i-size,100%)}:host(.grid-rows){grid-auto-rows:minmax(0,max-content);grid-template-columns:minmax(0,max-content) minmax(0,1fr) minmax(0,max-content);list-style-position:inside;list-style-type:none;margin:0;padding:0}.grid-columns>::slotted(*){display:grid;grid-auto-flow:row}.grid-columns>::slotted(*){place-content:center;place-items:center}.grid-columns>::slotted(*){--order:sibling-index();grid-column:var(--order,1)/calc(var(--order, 1) + 1);grid-row:1/-1;grid-template-columns:minmax(0,1fr);grid-template-rows:subgrid}:host(.grid-columns) ::slotted(::slotted(*)){display:grid;grid-auto-flow:row}:host(.grid-columns) ::slotted(::slotted(*)){place-content:center;place-items:center}:host(.grid-columns) ::slotted(::slotted(*)){--order:sibling-index();grid-column:var(--order,1)/calc(var(--order, 1) + 1);grid-row:1/-1;grid-template-columns:minmax(0,1fr);grid-template-rows:subgrid}.grid-columns>*{display:grid;grid-auto-flow:row;place-content:center;place-items:center;--order:sibling-index();grid-column:var(--order,1)/calc(var(--order, 1) + 1);grid-row:1/-1;grid-template-columns:minmax(0,1fr);grid-template-rows:subgrid}:host(.grid-columns) ::slotted(*){display:grid;grid-auto-flow:row}:host(.grid-columns) ::slotted(*){place-content:center;place-items:center}:host(.grid-columns) ::slotted(*){--order:sibling-index();grid-column:var(--order,1)/calc(var(--order, 1) + 1);grid-row:1/-1;grid-template-columns:minmax(0,1fr);grid-template-rows:subgrid}.grid-columns{--display:inline-grid;--flow:row;--items:center;--content:center;block-size:auto;box-sizing:border-box;display:var(--display,inline-block);flex-direction:var(--flow,row);inline-size:auto;place-content:var(--content,center);place-items:var(--items,center);--i-size:auto;--b-size:auto;aspect-ratio:var(--ar,auto);block-size:var(--b-size,100%);grid-auto-columns:minmax(0,1fr);grid-template-rows:minmax(0,1fr);inline-size:var(--i-size,100%);list-style-position:inside;list-style-type:none;margin:0;padding:0}:host(.grid-columns){--display:inline-grid;--flow:row;--items:center;--content:center;box-sizing:border-box;display:var(--display,inline-block);flex-direction:var(--flow,row);place-content:var(--content,center);place-items:var(--items,center)}:host(.grid-columns){block-size:auto;inline-size:auto;--i-size:auto;--b-size:auto;aspect-ratio:var(--ar,auto);block-size:var(--b-size,100%);inline-size:var(--i-size,100%)}:host(.grid-columns){grid-auto-columns:minmax(0,1fr);grid-template-rows:minmax(0,1fr);list-style-position:inside;list-style-type:none;margin:0;padding:0}.flex-columns>::slotted(*){--order:sibling-index();flex:1 1 max-content;order:var(--order,auto)}.flex-columns>::slotted(*){place-content:center;place-items:center}:host(.flex-columns) ::slotted(::slotted(*)){--order:sibling-index();flex:1 1 max-content;order:var(--order,auto)}:host(.flex-columns) ::slotted(::slotted(*)){place-content:center;place-items:center}.flex-columns>*{--order:sibling-index();flex:1 1 max-content;order:var(--order,auto);place-content:center;place-items:center}:host(.flex-columns) ::slotted(*){--order:sibling-index();flex:1 1 max-content;order:var(--order,auto)}:host(.flex-columns) ::slotted(*){place-content:center;place-items:center}.flex-columns{--display:inline-flex;--flow:column;--items:center;--content:center;block-size:max-content;box-sizing:border-box;display:var(--display,inline-block);flex-direction:var(--flow,row);inline-size:max-content;place-content:var(--content,center);place-items:var(--items,center);--i-size:max-content;--b-size:max-content;aspect-ratio:var(--ar,auto);block-size:var(--b-size,100%);inline-size:var(--i-size,100%)}:host(.flex-columns){--display:inline-flex;--flow:column;--items:center;--content:center;box-sizing:border-box;display:var(--display,inline-block);flex-direction:var(--flow,row);place-content:var(--content,center);place-items:var(--items,center)}:host(.flex-columns){block-size:max-content;inline-size:max-content;--i-size:max-content;--b-size:max-content;aspect-ratio:var(--ar,auto);block-size:var(--b-size,100%);inline-size:var(--i-size,100%)}.grid-layered>::slotted(*){grid-template-columns:minmax(0,1fr);grid-template-rows:minmax(0,1fr)}.grid-layered>::slotted(*)>*{grid-column:1/-1;grid-row:1/-1}:host(.grid-layered) ::slotted(::slotted(*)){grid-template-columns:minmax(0,1fr);grid-template-rows:minmax(0,1fr)}:host(.grid-layered) ::slotted(::slotted(*))>*{grid-column:1/-1;grid-row:1/-1}.grid-layered>*{grid-template-columns:minmax(0,1fr);grid-template-rows:minmax(0,1fr)}.grid-layered>*>*{grid-column:1/-1;grid-row:1/-1}:host(.grid-layered) ::slotted(*){grid-template-columns:minmax(0,1fr);grid-template-rows:minmax(0,1fr)}:host(.grid-layered) ::slotted(*)>*{grid-column:1/-1;grid-row:1/-1}.grid-layered{grid-template-columns:minmax(0,1fr);grid-template-rows:minmax(0,1fr)}.grid-layered>*{grid-column:1/-1;grid-row:1/-1}.grid-layered{--display:inline-grid;--flow:column;--items:center;--content:center;block-size:max-content;box-sizing:border-box;display:var(--display,inline-block);flex-direction:var(--flow,row);inline-size:max-content;place-content:var(--content,center);place-items:var(--items,center);--i-size:max-content;--b-size:max-content;aspect-ratio:var(--ar,auto);block-size:var(--b-size,100%);inline-size:var(--i-size,100%)}:host(.grid-layered){grid-template-columns:minmax(0,1fr);grid-template-rows:minmax(0,1fr)}:host(.grid-layered)>*{grid-column:1/-1;grid-row:1/-1}:host(.grid-layered){--display:inline-grid;--flow:column;--items:center;--content:center;box-sizing:border-box;display:var(--display,inline-block);flex-direction:var(--flow,row);place-content:var(--content,center);place-items:var(--items,center)}:host(.grid-layered){block-size:max-content;inline-size:max-content;--i-size:max-content;--b-size:max-content;aspect-ratio:var(--ar,auto);block-size:var(--b-size,100%);inline-size:var(--i-size,100%)}.grid-rows-3c>::slotted(*){grid-template-columns:minmax(0,max-content) minmax(0,1fr) minmax(0,max-content)}:host(.grid-rows-3c) ::slotted(::slotted(*)){grid-template-columns:minmax(0,max-content) minmax(0,1fr) minmax(0,max-content)}.grid-rows-3c>*{grid-template-columns:minmax(0,max-content) minmax(0,1fr) minmax(0,max-content)}:host(.grid-rows-3c) ::slotted(*){grid-template-columns:minmax(0,max-content) minmax(0,1fr) minmax(0,max-content)}.grid-rows-3c{grid-template-columns:minmax(0,max-content) minmax(0,1fr) minmax(0,max-content)}:host(.grid-rows-3c){grid-template-columns:minmax(0,max-content) minmax(0,1fr) minmax(0,max-content)}.grid-rows-3c>::slotted(:last-child){grid-column:var(--order,1)/3 span}:host(.grid-rows-3c) ::slotted(::slotted(:last-child)){grid-column:var(--order,1)/3 span}.grid-rows-3c>:last-child{grid-column:var(--order,1)/3 span}:host(.grid-rows-3c) ::slotted(:last-child){grid-column:var(--order,1)/3 span}.grid-rows-3c{--order:sibling-index();block-size:auto;grid-column:var(--order,1)/var(--order,1) span;inline-size:auto;--i-size:auto;--b-size:auto;aspect-ratio:var(--ar,auto);block-size:var(--b-size,100%);inline-size:var(--i-size,100%)}:host(.grid-rows-3c){--order:sibling-index()}:host(.grid-rows-3c){grid-column:var(--order,1)/var(--order,1) span}:host(.grid-rows-3c){block-size:auto;inline-size:auto;--i-size:auto;--b-size:auto;aspect-ratio:var(--ar,auto);block-size:var(--b-size,100%);inline-size:var(--i-size,100%)}.stretch-inline{inline-size:100%;inline-size:stretch}:host(.stretch-inline){inline-size:100%;inline-size:stretch}.stretch-block{block-size:100%;block-size:stretch}:host(.stretch-block){block-size:100%;block-size:stretch}.content-inline-size{padding-inline:max(100% - (100% - var(--content-inline-size,100%) * .5),0px)}:host(.content-inline-size){padding-inline:max(100% - (100% - var(--content-inline-size,100%) * .5),0px)}.content-block-size{padding-block:max(100% - (100% - var(--content-block-size,100%) * .5),0px)}:host(.content-block-size){padding-block:max(100% - (100% - var(--content-block-size,100%) * .5),0px)}.ux-anchor{inset-block-start:max(var(--client-y,0px),0px);inset-inline-start:max(var(--client-x,0px),0px);--translate-x:round(nearest,min(0px,calc(100cqi - (100% + var(--client-x, 0px)))),calc(1px / var(--pixel-ratio, 1)))!important;--translate-y:round(nearest,min(0px,calc(100cqb - (100% + var(--client-y, 0px)))),calc(1px / var(--pixel-ratio, 1)))!important}@supports (position-anchor:--example){.ux-anchor{inline-size:anchor-size(var(--anchor-group) self-inline);inset-block-start:anchor(var(--anchor-group) end);inset-inline-start:anchor(var(--anchor-group) start);position-anchor:var(--anchor-group)}}:host(.ux-anchor){inset-block-start:max(var(--client-y,0px),0px);inset-inline-start:max(var(--client-x,0px),0px)}:host(.ux-anchor){--translate-x:round(nearest,min(0px,calc(100cqi - (100% + var(--client-x, 0px)))),calc(1px / var(--pixel-ratio, 1)))!important;--translate-y:round(nearest,min(0px,calc(100cqb - (100% + var(--client-y, 0px)))),calc(1px / var(--pixel-ratio, 1)))!important}@supports (position-anchor:--example){:host(.ux-anchor){inline-size:anchor-size(var(--anchor-group) self-inline);inset-block-start:anchor(var(--anchor-group) end);inset-inline-start:anchor(var(--anchor-group) start);position-anchor:var(--anchor-group)}}.ux-anchor{--shift-x:var(--client-x,0px);--shift-y:var(--client-y,0px);--translate-x:round(nearest,min(0px,calc(100cqi - (100% + var(--shift-x, 0px)))),calc(1px / var(--pixel-ratio, 1)))!important;--translate-y:round(nearest,min(0px,calc(100cqb - (100% + var(--shift-y, 0px)))),calc(1px / var(--pixel-ratio, 1)))!important;direction:ltr;inset-block-end:auto;inset-block-start:max(var(--shift-y),var(--status-bar-padding,0px));inset-inline-end:auto;inset-inline-start:max(var(--shift-x),0px);transform:none;translate:0 0 0;writing-mode:horizontal-tb}:host(.ux-anchor){--shift-x:var(--client-x,0px);--shift-y:var(--client-y,0px);--translate-x:round(nearest,min(0px,calc(100cqi - (100% + var(--shift-x, 0px)))),calc(1px / var(--pixel-ratio, 1)))!important;--translate-y:round(nearest,min(0px,calc(100cqb - (100% + var(--shift-y, 0px)))),calc(1px / var(--pixel-ratio, 1)))!important;direction:ltr;inset-block-end:auto;inset-block-start:max(var(--shift-y),var(--status-bar-padding,0px));inset-inline-end:auto;inset-inline-start:max(var(--shift-x),0px);transform:none;translate:0 0 0;writing-mode:horizontal-tb}.layered-wrap{background-color:initial;block-size:max-content;display:inline-grid;grid-template-columns:minmax(0,1fr);grid-template-rows:minmax(0,1fr);inline-size:max-content;overflow:visible;z-index:calc(var(--z-index, 0) + 1)}.layered-wrap>*{grid-column:1/-1;grid-row:1/-1}:host(.layered-wrap){background-color:initial;block-size:max-content;display:inline-grid;grid-template-columns:minmax(0,1fr);grid-template-rows:minmax(0,1fr);inline-size:max-content;overflow:visible;z-index:calc(var(--z-index, 0) + 1)}:host(.layered-wrap)>*{grid-column:1/-1;grid-row:1/-1}}@layer components{ui-icon{--icon-color:currentColor;--icon-size:1rem;--icon-padding:0.125rem;aspect-ratio:1;color:var(--icon-color);display:inline-grid;margin-inline-end:.125rem;place-content:center;place-items:center;vertical-align:middle}ui-icon:last-child{margin-inline-end:0}}@layer animations{@keyframes p{0%{transform:rotate(0deg)}to{transform:rotate(1turn)}}}@function --wavy-step(--step <number>){--angle:calc((var(--step, 0) * 2) * 1rad * pi);--variant:calc(cos(var(--clip-freq, 8) * var(--angle, 0deg)) * 0.5 + 0.5);--adjust:calc(var(--variant, 0) * var(--clip-amplitude, 0));--x:calc(50% + (cos(var(--angle, 0deg)) * (0.5 - var(--adjust, 0))) * var(--icon-size, 100%));--y:calc(50% + (sin(var(--angle, 0deg)) * (0.5 - var(--adjust, 0))) * var(--icon-size, 100%));result:var(--x) var(--y)}@layer ux-shapes{.shaped{aspect-ratio:1/1;border-radius:1.5rem;clip-path:var(--clip-path,none);contain:strict;display:flex;overflow:hidden;padding:1.25rem;place-content:center;place-items:center;pointer-events:auto;transition:--background-tone-shift .2s ease-in-out,--icon-color .2s ease-in-out;transition-behavior:allow-discrete;user-select:none;z-index:1}.shaped,.shaped :is(span,ui-icon){block-size:stretch;inline-size:stretch}[data-dragging]{z-index:calc(100 + var(--z-index, 0))!important}:not(.shaped) .shaped,:not(.shaped)>*,:not(:has(.shaped)){--border-radius:var(--radius-md);--clip-path:none}:not(.shaped) .shaped[data-shape],:not(.shaped)>[data-shape],:not(:has(.shaped))[data-shape]{aspect-ratio:1/1;border-radius:var(--border-radius,var(--radius-md));clip-path:var(--clip-path,none);contain:strict;overflow:hidden;pointer-events:auto;touch-action:none}:not(.shaped) .shaped[data-shape=square],:not(.shaped)>[data-shape=square],:not(:has(.shaped))[data-shape=square]{--border-radius:var(--radius-md);--clip-path:none}:not(.shaped) .shaped[data-shape=squircle],:not(.shaped)>[data-shape=squircle],:not(:has(.shaped))[data-shape=squircle]{--border-radius:28%;--clip-path:none}:not(.shaped) .shaped[data-shape=circle],:not(.shaped)>[data-shape=circle],:not(:has(.shaped))[data-shape=circle]{--border-radius:50%;--clip-path:none}:not(.shaped) .shaped[data-shape=rounded],:not(.shaped)>[data-shape=rounded],:not(:has(.shaped))[data-shape=rounded]{--border-radius:var(--radius-xl);--clip-path:none}:not(.shaped) .shaped[data-shape=blob],:not(.shaped)>[data-shape=blob],:not(:has(.shaped))[data-shape=blob]{--border-radius:60% 40% 30% 70%/60% 30% 70% 40%;--clip-path:none}:not(.shaped) .shaped[data-shape=hexagon],:not(.shaped)>[data-shape=hexagon],:not(:has(.shaped))[data-shape=hexagon]{--border-radius:0;--clip-path:polygon(round 0.375rem,50% 0%,93.3% 25%,93.3% 75%,50% 100%,6.7% 75%,6.7% 25%)}:not(.shaped) .shaped[data-shape=diamond],:not(.shaped)>[data-shape=diamond],:not(:has(.shaped))[data-shape=diamond]{--border-radius:0;--clip-path:polygon(round 0.5rem,50% 0%,100% 50%,50% 100%,0% 50%)}:not(.shaped) .shaped[data-shape=star],:not(.shaped)>[data-shape=star],:not(:has(.shaped))[data-shape=star]{--border-radius:0;--clip-path:polygon(round 0.25rem,50% 0%,61% 35%,98% 38%,68% 59%,79% 95%,50% 75%,21% 95%,32% 59%,2% 38%,39% 35%)}:not(.shaped) .shaped[data-shape=badge],:not(.shaped)>[data-shape=badge],:not(:has(.shaped))[data-shape=badge]{--border-radius:0;--clip-path:polygon(round 0.375rem,0% 0%,100% 0%,100% 70%,50% 100%,0% 70%)}:not(.shaped) .shaped[data-shape=heart],:not(.shaped)>[data-shape=heart],:not(:has(.shaped))[data-shape=heart]{--border-radius:0;--clip-path:polygon(round 0.25rem,50% 100%,10% 65%,0% 45%,0% 30%,5% 15%,18% 3%,35% 0%,50% 12%,65% 0%,82% 3%,95% 15%,100% 30%,100% 45%,90% 65%)}:not(.shaped) .shaped[data-shape=clover],:not(.shaped)>[data-shape=clover],:not(:has(.shaped))[data-shape=clover]{--border-radius:0;--clip-path:polygon(round 0.375rem,50% 0%,60% 30%,70% 30%,100% 50%,70% 70%,60% 70%,50% 100%,40% 70%,30% 70%,0% 50%,30% 30%,40% 30%)}:not(.shaped) .shaped[data-shape=flower],:not(.shaped)>[data-shape=flower],:not(:has(.shaped))[data-shape=flower]{--border-radius:0;--clip-path:polygon(round 0.25rem,50% 0%,58% 25%,85% 15%,68% 40%,100% 50%,68% 60%,85% 85%,58% 75%,50% 100%,42% 75%,15% 85%,32% 60%,0% 50%,32% 40%,15% 15%,42% 25%)}:not(.shaped) .shaped[data-shape=triangle],:not(.shaped)>[data-shape=triangle],:not(:has(.shaped))[data-shape=triangle]{--border-radius:0;--clip-path:polygon(round 0.5rem,50% 0%,100% 87%,0% 87%)}:not(.shaped) .shaped[data-shape=pentagon],:not(.shaped)>[data-shape=pentagon],:not(:has(.shaped))[data-shape=pentagon]{--border-radius:0;--clip-path:polygon(round 0.375rem,50% 0%,97.5% 35%,79.5% 95%,20.5% 95%,2.5% 35%)}:not(.shaped) .shaped[data-shape=octagon],:not(.shaped)>[data-shape=octagon],:not(:has(.shaped))[data-shape=octagon]{--border-radius:0;--clip-path:polygon(round 0.25rem,30% 0%,70% 0%,100% 30%,100% 70%,70% 100%,30% 100%,0% 70%,0% 30%)}:not(.shaped) .shaped[data-shape=cross],:not(.shaped)>[data-shape=cross],:not(:has(.shaped))[data-shape=cross]{--border-radius:0;--clip-path:polygon(round 0.375rem,35% 0%,65% 0%,65% 35%,100% 35%,100% 65%,65% 65%,65% 100%,35% 100%,35% 65%,0% 65%,0% 35%,35% 35%)}:not(.shaped) .shaped[data-shape=arrow],:not(.shaped)>[data-shape=arrow],:not(:has(.shaped))[data-shape=arrow]{--border-radius:0;--clip-path:polygon(round 0.375rem,0% 20%,60% 20%,60% 0%,100% 50%,60% 100%,60% 80%,0% 80%)}:not(.shaped) .shaped[data-shape=egg],:not(.shaped)>[data-shape=egg],:not(:has(.shaped))[data-shape=egg]{--border-radius:50% 50% 50% 50%/60% 60% 40% 40%;--clip-path:none}:not(.shaped) .shaped[data-shape=tear],:not(.shaped)>[data-shape=tear],:not(:has(.shaped))[data-shape=tear]{--border-radius:50cqmin 50cqmin 5rem 50cqmin;--clip-path:none;border-end-end-radius:5rem;border-end-start-radius:50cqmin;border-start-end-radius:50cqmin;border-start-start-radius:50cqmin}:not(.shaped) .shaped[data-shape=wavy],:not(.shaped)>[data-shape=wavy],:not(:has(.shaped))[data-shape=wavy]{--border-radius:calc(var(--icon-size, 100%) * 0.5)}}@layer ux-agate{@media screen{:host,:root,:scope,:where(body){pointer-events:auto;transition-behavior:allow-discrete;interpolate-size:allow-keywords;content-visibility:auto;--keyboard-inset-bottom:calc(max(env(keyboard-inset-bottom, 0px), 0px) / max(var(--zoom, 1), 0.125));--keyboard-inset-height:calc(max(env(keyboard-inset-height, 0px), 0px) / max(var(--zoom, 1), 0.125))}:host,:root,:scope{--scale:1;--translate-x:0px;--translate-y:0px}:host,:host :where(*),:root,:root :where(*),:scope,:scope :where(*){--scale:1;--translate-x:0px;--translate-y:0px}:root,:where(html){background-color:initial;block-size:stretch;border:0 transparent;contain:none;container-name:html root;container-type:size;display:flex;flex-direction:column;inline-size:stretch;inset:0;inset-block-end:auto;line-height:normal;margin:0;max-block-size:min(100%,min(100cqb,100dvb))!important;max-inline-size:min(100%,min(100cqi,100dvi))!important;min-block-size:min(100cqb,100dvb);min-inline-size:min(100cqi,100dvi);outline:0 none transparent;overflow:visible;padding:0;place-content:start;place-items:start;place-self:start;position:fixed;transform:none;translate:none}:where(body){background-color:initial;block-size:stretch;border:0 transparent;contain:strict;container-name:body;container-type:size;display:inline-flex;font-size:var(--text-base,.9rem);inline-size:stretch;inset:auto;margin:0;max-block-size:min(100%,min(100cqb,100dvb));max-inline-size:min(100%,min(100cqi,100dvi));min-block-size:0;min-inline-size:0;outline:0 none transparent;overflow:visible;padding:0;place-content:start;place-items:start;place-self:start;pointer-events:auto;position:relative;transform:none;translate:none}:where(body)>:where(#app,#container,#root,.root){block-size:stretch;inline-size:stretch;max-block-size:min(100%,min(100cqb,100dvb));max-inline-size:min(100%,min(100cqi,100dvi));min-block-size:0;min-inline-size:0}:where(body)>:where(*){max-block-size:min(100%,min(100cqb,100dvb));max-inline-size:min(100%,min(100cqi,100dvi))}}}@function --get-oriented-size-num(--orient <number>: 0, --osx <number>: 0, --osy <number>: 0, --axis-to-return <number>: 0 ) returns <number>{--go-orient:round(nearest,var(--orient,0),1);--go-axis:clamp(0,round(nearest,var(--axis-to-return,0),1),1);--go-axis-inline:calc(1 - var(--go-axis, 0));--go-axis-block:var(--go-axis,0);--go-swap-raw:mod(var(--go-orient),2);--go-swap:clamp(0,round(nearest,var(--go-swap-raw),1),1);--go-swap-inline:calc(1 - var(--go-swap, 0));--go-primary:var(--osx,0);--go-secondary:var(--osy,0);--go-inline:calc(var(--go-primary) * var(--go-swap-inline) + var(--go-secondary) * var(--go-swap));--go-block:calc(var(--go-secondary) * var(--go-swap-inline) + var(--go-primary) * var(--go-swap));result:calc(var(--go-inline) * var(--go-axis-inline) + var(--go-block) * var(--go-axis-block))}@function --get-oriented-size(--orient <number>: 0, --osx <length-percentage>: 0px, --osy <length-percentage>: 0px, --axis-to-return <number>: 0 ) returns <length-percentage>{--go-orient:mod(round(nearest,var(--orient,0),1),4);--go-axis:clamp(0,round(nearest,var(--axis-to-return,0),1),1);--go-axis-inline:calc(1 - var(--go-axis, 0));--go-axis-block:var(--go-axis,0);--go-swap-raw:mod(var(--go-orient,0),2);--go-swap:clamp(0,round(nearest,var(--go-swap-raw,0),1),1);--go-swap-inline:calc(1 - var(--go-swap, 0));--go-primary:var(--osx,0px);--go-secondary:var(--osy,0px);--go-inline:calc(var(--go-primary) * var(--go-swap-inline) + var(--go-secondary) * var(--go-swap));--go-block:calc(var(--go-secondary) * var(--go-swap-inline) + var(--go-primary) * var(--go-swap));result:calc(var(--go-inline) * var(--go-axis-inline) + var(--go-block) * var(--go-axis-block))}@function --get-oriented-vector(--orient <number>: 0, --ocx <length-percentage>: 0px, --ocy <length-percentage>: 0px, --axis-to-return <number>: 0 ) returns <length-percentage>{--go-orient:mod(round(nearest,var(--orient,0),1),4);--go-axis:clamp(0,round(nearest,var(--axis-to-return,0),1),1);--go-axis-inline:calc(1 - var(--go-axis, 0));--go-axis-block:var(--go-axis,0);--go-swap-raw:mod(var(--go-orient,0),2);--go-swap:clamp(0,round(nearest,var(--go-swap-raw,0),1),1);--go-swap-inline:calc(1 - var(--go-swap, 0));--go-primary-direct:var(--ocx,0px);--go-secondary-direct:var(--ocy,0px);--go-inline-direct:calc(var(--go-primary-direct) * var(--go-swap-inline) + var(--go-secondary-direct) * var(--go-swap));--go-block-direct:calc(var(--go-secondary-direct) * var(--go-swap-inline) + var(--go-primary-direct) * var(--go-swap));--go-inline-inverted:calc(0px - var(--go-inline-direct));--go-block-inverted:calc(0px - var(--go-block-direct));--go-rev-inline:clamp(0,calc(var(--go-orient) - 1),1);--go-rev-block:clamp(0,calc((1 - abs(calc(var(--go-orient) - 1.5))) * 2),1);--go-inline:calc(var(--go-inline-direct) * (1 - var(--go-rev-inline)) + var(--go-inline-inverted) * var(--go-rev-inline));--go-block:calc(var(--go-block-direct) * (1 - var(--go-rev-block)) + var(--go-block-inverted) * var(--go-rev-block));result:calc(var(--go-inline) * var(--go-axis-inline) + var(--go-block) * var(--go-axis-block))}@function --get-oriented-coord-num(--orient <number>: 0, --ocx <number>: 0, --ocy <number>: 0, --osx <number>: 0, --osy <number>: 0, --axis-to-return <number>: 0 ) returns <number>{--go-orient:mod(round(nearest,var(--orient,0),1),4);--go-axis:clamp(0,round(nearest,var(--axis-to-return,0),1),1);--go-axis-inline:calc(1 - var(--go-axis, 0));--go-axis-block:var(--go-axis,0);--go-swap-raw:mod(var(--go-orient,0),2);--go-swap:clamp(0,round(nearest,var(--go-swap-raw,0),1),1);--go-swap-inline:calc(1 - var(--go-swap, 0));--go-primary-direct:var(--ocx,0);--go-secondary-direct:var(--ocy,0);--go-primary-size:var(--osx,0);--go-secondary-size:var(--osy,0);--go-inline-direct:calc(var(--go-primary-direct) * var(--go-swap-inline) + var(--go-secondary-direct) * var(--go-swap));--go-block-direct:calc(var(--go-secondary-direct) * var(--go-swap-inline) + var(--go-primary-direct) * var(--go-swap));--go-inline-size:calc(var(--go-primary-size) * var(--go-swap-inline) + var(--go-secondary-size) * var(--go-swap));--go-block-size:calc(var(--go-secondary-size) * var(--go-swap-inline) + var(--go-primary-size) * var(--go-swap));--go-inline-inverted:calc(var(--go-inline-size, calc(var(--go-inline-direct) + var(--go-inline-direct))) - var(--go-inline-direct));--go-block-inverted:calc(var(--go-block-size, calc(var(--go-block-direct) + var(--go-block-direct))) - var(--go-block-direct));--go-rev-inline:clamp(0,calc(var(--go-orient) - 1),1);--go-rev-block:clamp(0,calc((1 - abs(calc(var(--go-orient) - 1.5))) * 2),1);--go-inline:calc(var(--go-inline-direct) * (1 - var(--go-rev-inline)) + var(--go-inline-inverted) * var(--go-rev-inline));--go-block:calc(var(--go-block-direct) * (1 - var(--go-rev-block)) + var(--go-block-inverted) * var(--go-rev-block));result:calc(var(--go-inline) * var(--go-axis-inline) + var(--go-block) * var(--go-axis-block))}@function --get-oriented-coordinate(--orient <number>: 0, --ocx <length-percentage>: 0px, --ocy <length-percentage>: 0px, --osx <length-percentage>: 0px, --osy <length-percentage>: 0px, --axis-to-return <number>: 0 ) returns <length-percentage>{--go-orient:mod(round(nearest,var(--orient,0),1),4);--go-axis:clamp(0,round(nearest,var(--axis-to-return,0),1),1);--go-axis-inline:calc(1 - var(--go-axis, 0));--go-axis-block:var(--go-axis,0);--go-swap-raw:mod(var(--go-orient,0),2);--go-swap:clamp(0,round(nearest,var(--go-swap-raw,0),1),1);--go-swap-inline:calc(1 - var(--go-swap, 0));--go-primary-direct:var(--ocx,0px);--go-secondary-direct:var(--ocy,0px);--go-primary-size:var(--osx,0px);--go-secondary-size:var(--osy,0px);--go-inline-direct:calc(var(--go-primary-direct) * var(--go-swap-inline) + var(--go-secondary-direct) * var(--go-swap));--go-block-direct:calc(var(--go-secondary-direct) * var(--go-swap-inline) + var(--go-primary-direct) * var(--go-swap));--go-inline-size:calc(var(--go-primary-size) * var(--go-swap-inline) + var(--go-secondary-size) * var(--go-swap));--go-block-size:calc(var(--go-secondary-size) * var(--go-swap-inline) + var(--go-primary-size) * var(--go-swap));--go-inline-inverted:calc(var(--go-inline-size, calc(var(--go-inline-direct) + var(--go-inline-direct))) - var(--go-inline-direct));--go-block-inverted:calc(var(--go-block-size, calc(var(--go-block-direct) + var(--go-block-direct))) - var(--go-block-direct));--go-rev-inline:clamp(0,calc(var(--go-orient) - 1),1);--go-rev-block:clamp(0,calc((1 - abs(calc(var(--go-orient) - 1.5))) * 2),1);--go-inline:calc(var(--go-inline-direct) * (1 - var(--go-rev-inline)) + var(--go-inline-inverted) * var(--go-rev-inline));--go-block:calc(var(--go-block-direct) * (1 - var(--go-rev-block)) + var(--go-block-inverted) * var(--go-rev-block));result:calc(var(--go-inline) * var(--go-axis-inline) + var(--go-block) * var(--go-axis-block))}@function --hsv(--src-color <color>) returns <color>{result:hsl(from var(--src-color,black) h calc(calc((calc(l / 100) - calc(calc(l / 100) * (1 - calc(s / 100) / 2))) / clamp(.0001, min(calc(calc(l / 100) * (1 - calc(s / 100) / 2)), calc(1 - calc(calc(l / 100) * (1 - calc(s / 100) / 2)))), 1)) * 100) calc(calc(calc(l / 100) * (1 - calc(s / 100) / 2)) * 100)/alpha)}@layer ux-orientbox{.ui-orientbox{--in-orient-base:round(nearest,var(--orient,0),1);--in-rev-cond-x:clamp(0,calc(var(--in-orient-base, 0) - 1),1);--in-rev-cond-y:clamp(0,calc((1 - abs(calc(var(--in-orient-base, 0) - 1.5))) * 2),1);--in-swap-cond:css-rem(var(--orient,0),2);--in-rev-vx:calc(var(--in-rev-cond-x, 1) * -2 + 1);--in-rev-vy:calc(var(--in-rev-cond-y, 1) * -2 + 1);--os-size-x:--get-oriented-size(mod(4 - var(--orient,0),4),var(--cs-size-x,100cqi),var(--cs-size-y,100cqb),0);--os-size-y:--get-oriented-size(mod(4 - var(--orient,0),4),var(--cs-size-x,100cqb),var(--cs-size-y,100cqi),1);--os-self-size-x:--get-oriented-size(mod(4 - var(--orient,0),4),var(--cs-self-size-x,100%),var(--cs-self-size-y,100%),0);--os-self-size-y:--get-oriented-size(mod(4 - var(--orient,0),4),var(--cs-self-size-x,100%),var(--cs-self-size-y,100%),1);--cs-inset-x:--get-oriented-coordinate(var(--orient,0),var(--os-inset-x,0px),var(--os-inset-y,0px),var(--os-size-x,100cqi),var(--os-size-y,100cqb),0);--cs-inset-y:--get-oriented-coordinate(var(--orient,0),var(--os-inset-x,0px),var(--os-inset-y,0px),var(--os-size-x,100cqi),var(--os-size-y,100cqb),1);--cs-drag-x:--get-oriented-vector(var(--orient,0),var(--os-drag-x,0px),var(--os-drag-y,0px),0);--cs-drag-y:--get-oriented-vector(var(--orient,0),var(--os-drag-x,0px),var(--os-drag-y,0px),1);--cs-size-x:100cqi;--cs-size-y:100cqb;background-color:initial;block-size:stretch;border-radius:var(--radius-lg);contain:strict!important;container-type:size!important;direction:ltr!important;font-size:16px;grid-column:1/-1;grid-row:1/-1;inline-size:stretch;inset:0;max-block-size:min(100%,min(100cqb,100dvb),var(--vv-height,100dvb))!important;max-inline-size:min(100%,min(100cqi,100dvi),var(--vv-width,100dvi))!important;min-block-size:0;min-inline-size:0;place-self:start;pointer-events:none;position:relative;writing-mode:horizontal-tb!important;zoom:max(var(--zoom,1),.125);--zoom:max(var(--scaling,1),0.125);--zpx:calc(1px / max(var(--zoom, 1), 0.125));--ppx:calc(1px / max(var(--pixel-ratio, 1), 0.125))}.ui-orientbox :where(ui-frame,.u2-grid-item,ui-modal,[is=ui-orientbox],[is=ui-gridbox],[is=ui-orientbox]>:where(*),[is=ui-gridbox]>:where(*),.ui-gridlayout,.ui-gridlayout>:where(*)),.ui-orientbox>:where(*){--in-orient-base:round(nearest,var(--orient,0),1);--in-rev-cond-x:clamp(0,calc(var(--in-orient-base, 0) - 1),1);--in-rev-cond-y:clamp(0,calc((1 - abs(calc(var(--in-orient-base, 0) - 1.5))) * 2),1);--in-swap-cond:css-rem(var(--orient,0),2);--in-rev-vx:calc(var(--in-rev-cond-x, 1) * -2 + 1);--in-rev-vy:calc(var(--in-rev-cond-y, 1) * -2 + 1)}.ui-orientbox :where(ui-frame,.u2-grid-item,ui-modal,[is=ui-orientbox],[is=ui-gridbox],[is=ui-orientbox]>:where(*),[is=ui-gridbox]>:where(*),.ui-gridlayout,.ui-gridlayout>:where(*)),.ui-orientbox>:where(*){--os-size-x:--get-oriented-size(mod(4 - var(--orient,0),4),var(--cs-size-x,100cqi),var(--cs-size-y,100cqb),0);--os-size-y:--get-oriented-size(mod(4 - var(--orient,0),4),var(--cs-size-x,100cqb),var(--cs-size-y,100cqi),1);--os-self-size-x:--get-oriented-size(mod(4 - var(--orient,0),4),var(--cs-self-size-x,100%),var(--cs-self-size-y,100%),0);--os-self-size-y:--get-oriented-size(mod(4 - var(--orient,0),4),var(--cs-self-size-x,100%),var(--cs-self-size-y,100%),1)}.ui-orientbox :where(ui-frame,.u2-grid-item,ui-modal,[is=ui-orientbox],[is=ui-gridbox],[is=ui-orientbox]>:where(*),[is=ui-gridbox]>:where(*),.ui-gridlayout,.ui-gridlayout>:where(*)),.ui-orientbox>:where(*){--cs-inset-x:--get-oriented-coordinate(var(--orient,0),var(--os-inset-x,0px),var(--os-inset-y,0px),var(--os-size-x,100cqi),var(--os-size-y,100cqb),0);--cs-inset-y:--get-oriented-coordinate(var(--orient,0),var(--os-inset-x,0px),var(--os-inset-y,0px),var(--os-size-x,100cqi),var(--os-size-y,100cqb),1);--cs-drag-x:--get-oriented-vector(var(--orient,0),var(--os-drag-x,0px),var(--os-drag-y,0px),0);--cs-drag-y:--get-oriented-vector(var(--orient,0),var(--os-drag-x,0px),var(--os-drag-y,0px),1)}.ui-orientbox .center-self{inset:var(--cs-inset-y,0) auto auto var(--cs-inset-x,0);place-self:center;transform:translate3d(round(nearest,var(--cs-drag-x,0),1px/var(--pixel-ratio,1)),round(nearest,var(--cs-drag-y,0),1px/var(--pixel-ratio,1)),0) scale3d(var(--scale,1),var(--scale,1),var(--scale,1)) translate3d(round(nearest,calc(var(--translate-x, 0px) - 50%),1px/var(--pixel-ratio,1)),round(nearest,calc(var(--translate-y, 0px) - 50%),1px/var(--pixel-ratio,1)),0);transform-origin:0 0}.ui-orientbox .fixed{position:fixed!important}.ui-orientbox .absolute,.ui-orientbox .fixed{inset:var(--cs-inset-y,0) auto auto var(--cs-inset-x,0)}.ui-orientbox .absolute{position:absolute!important}.native-portrait-optimized{--in-swap-cond:0}@media (orientation:portrait){.native-portrait-optimized{--in-swap-cond:0}}@media (orientation:landscape){.native-portrait-optimized{--in-swap-cond:1}}}@property --item-size{syntax:\"<length-percentage>\";inherits:true;initial-value:100%}@layer ux-gridbox{.ui-gridlayout{--os-layout-c:var(--layout-c,4);--os-layout-r:var(--layout-r,8);--cs-layout-c:--get-oriented-size-num(var(--orient,0),var(--os-layout-c,4),var(--os-layout-r,8),0);--cs-layout-r:--get-oriented-size-num(var(--orient,0),var(--os-layout-c,4),var(--os-layout-r,8),1);--c-gap:clamp(min(1rem,8cqmin),min(calc(8cqmin / min(var(--layout-c, 4), var(--layout-r, 8))),calc(6cqmax / max(var(--layout-c, 4), var(--layout-r, 8)))),min(4rem,16cqmin));--r-gap:clamp(min(1rem,8cqmin),min(calc(8cqmin / min(var(--layout-c, 4), var(--layout-r, 8))),calc(6cqmax / max(var(--layout-c, 4), var(--layout-r, 8)))),min(4rem,16cqmin));--sd-inherit-layout-c:var(--layout-c,4);--sd-inherit-layout-r:var(--layout-r,8);--sd-inherit-cs-layout-c:var(--cs-layout-c,var(--layout-c,4));--sd-inherit-cs-layout-r:var(--cs-layout-r,var(--layout-r,8));background-color:initial;block-size:stretch;box-sizing:border-box!important;contain:none!important;container-name:u2-grid;container-type:normal!important;direction:ltr;display:grid!important;gap:0!important;grid-column:1/-1;grid-row:1/-1;grid-template-columns:repeat(round(nearest,var(--cs-layout-c,4),1),minmax(0,1fr))!important;grid-template-rows:repeat(round(nearest,var(--cs-layout-r,8),1),minmax(0,1fr))!important;inline-size:stretch;max-block-size:min(100%,min(100cqb,100dvb))!important;max-inline-size:min(100%,min(100cqi,100dvi))!important;overflow:visible!important;padding:0!important;place-content:center!important;place-items:center!important;pointer-events:none!important;position:relative!important;text-align:center!important;zoom:1}.ui-gridlayout .ui-ws-item:not([data-layer=labels]) span{aspect-ratio:1/1;block-size:fit-content;display:inline;inline-size:fit-content;pointer-events:none}.ui-gridlayout .ui-ws-item{cursor:pointer;pointer-events:auto;user-select:none}.ui-gridlayout :is(.ui-ws-item:active,.ui-ws-item:has(:active)){cursor:grabbing;will-change:inset,translate,transform,opacity,z-index}.ui-gridlayout>:where(*){--orient:inherit}.ui-gridlayout>:where(*){--cs-sw-unit-x:calc(var(--cs-size-x, 100cqi) / var(--cs-layout-c, 1));--cs-sw-unit-y:calc(var(--cs-size-y, 100cqb) / var(--cs-layout-r, 1))}.ui-gridlayout>:where(*){--cs-transition-c:0px;--cs-transition-r:0px}.ui-gridlayout>:where(*)[data-dragging]{--cs-transition-c:calc((var(--rv-grid-c, 0) - var(--cs-grid-c, 0)) * var(--cs-sw-unit-x, 1px));--cs-transition-r:calc((var(--rv-grid-r, 0) - var(--cs-grid-r, 0)) * var(--cs-sw-unit-y, 1px))}.ui-gridlayout>:where(*){--p-cell-x:var(--cell-x);--p-cell-y:var(--cell-y);--f-col:clamp(1,var(--layout-c,4),16);--f-row:clamp(1,var(--layout-r,8),16);--grid-c:clamp(0,var(--cell-x),var(--f-col) - 1);--grid-r:clamp(0,var(--cell-y),var(--f-row) - 1);--p-grid-c:clamp(0,var(--p-cell-x),var(--f-col) - 1);--p-grid-r:clamp(0,var(--p-cell-y),var(--f-row) - 1);--fc-cell-x:clamp(0,var(--cs-grid-c,0),var(--f-col) - 1);--fc-cell-y:clamp(0,var(--cs-grid-r,0),var(--f-row) - 1);--fp-cell-x:clamp(0,var(--cs-p-grid-c,0),var(--f-col) - 1);--fp-cell-y:clamp(0,var(--cs-p-grid-r,0),var(--f-row) - 1);--dir-x:calc(var(--cs-grid-c, 0) - var(--cs-p-grid-c, 0));--dir-y:calc(var(--cs-grid-r, 0) - var(--cs-p-grid-r, 0))}.ui-gridlayout>:where(*){--rv-grid-c:var(--cs-grid-c,1);--rv-grid-r:var(--cs-grid-r,1)}.ui-gridlayout>:where(*)[data-dragging]{--rv-grid-c:var(--cs-p-grid-c,1);--rv-grid-r:var(--cs-p-grid-r,1)}.ui-gridlayout>:where(*){--os-grid-c:var(--grid-c,1);--os-grid-r:var(--grid-r,1);--cs-grid-c:--get-oriented-coord-num(var(--orient,0),var(--os-grid-c,1),var(--os-grid-r,1),calc(var(--f-col, 1) - 1),calc(var(--f-row, 1) - 1),0);--cs-grid-r:--get-oriented-coord-num(var(--orient,0),var(--os-grid-c,1),var(--os-grid-r,1),calc(var(--f-col, 1) - 1),calc(var(--f-row, 1) - 1),1)}.ui-gridlayout>:where(*){--os-p-grid-c:var(--p-cell-x,0);--os-p-grid-r:var(--p-cell-y,0);--cs-p-grid-c:--get-oriented-coord-num(var(--orient,0),var(--os-p-grid-c,0),var(--os-p-grid-r,0),calc(var(--f-col, 1) - 1),calc(var(--f-row, 1) - 1),0);--cs-p-grid-r:--get-oriented-coord-num(var(--orient,0),var(--os-p-grid-c,0),var(--os-p-grid-r,0),calc(var(--f-col, 1) - 1),calc(var(--f-row, 1) - 1),1)}.ui-gridlayout>:where(*){--ox-c-unit:calc(var(--os-size-x, 100cqi) / var(--os-layout-c, 1));--ox-r-unit:calc(var(--os-size-y, 100cqb) / var(--os-layout-r, 1));--os-inset-x:calc((var(--grid-c, 1) + 0.5) * var(--ox-c-unit, 1px));--os-inset-y:calc((var(--grid-r, 1) + 0.5) * var(--ox-r-unit, 1px))}.ui-gridlayout>:where(*){--f-col:clamp(1,var(--sd-inherit-layout-c,var(--layout-c,4)),16);--f-row:clamp(1,var(--sd-inherit-layout-r,var(--layout-r,8)),16)}.ui-gridlayout>:where(*){--item-size:clamp(4rem,calc(100cqmax / min(var(--sd-inherit-cs-layout-c, var(--cs-layout-c, 4)), var(--sd-inherit-cs-layout-r, var(--cs-layout-r, 8)))),5rem)}.ui-gridlayout>:where(*) :where(*){--drag-x:0;--drag-y:0}.ui-gridlayout>:where(*){--drag-x:0;--cs-drag-x:calc(var(--drag-x, 0) * 1px);--drag-y:0;--cs-drag-y:calc(var(--drag-y, 0) * 1px)}.ui-gridlayout>:is(:where(*) :active,:where(*):active,:where(*):has(:active)){will-change:transform}.ui-gridlayout>:where(*){block-size:var(--item-size,stretch);cursor:pointer;grid-column:clamp(1,1 + round(nearest,var(--cs-grid-c,0),1),var(--sd-inherit-cs-layout-c,var(--cs-layout-c,4)))!important;grid-row:clamp(1,1 + round(nearest,var(--cs-grid-r,0),1),var(--sd-inherit-cs-layout-r,var(--cs-layout-r,8)))!important;inline-size:var(--item-size,stretch);inset:auto!important;max-block-size:var(--item-size,stretch);max-inline-size:var(--item-size,stretch);min-block-size:fit-content;min-inline-size:fit-content;place-self:center!important;pointer-events:none;position:relative!important;touch-action:none;transform:translate3d(round(nearest,var(--cs-drag-x,0) + var(--cs-transition-c,0),1px/var(--pixel-ratio,1)),round(nearest,var(--cs-drag-y,0) + var(--cs-transition-r,0),1px/var(--pixel-ratio,1)),0) scale3d(var(--scale,1),var(--scale,1),var(--scale,1)) translate3d(round(nearest,var(--translate-x,0),1px/var(--pixel-ratio,1)),round(nearest,var(--translate-y,0),1px/var(--pixel-ratio,1)),0)!important;transform-origin:50% 50%!important;translate:0 0 0!important;user-select:none;visibility:visible;z-index:1;zoom:1;-webkit-user-drag:none;-moz-user-drag:none;border:0 transparent;contain:none;isolation:isolate;outline:0 none transparent;overflow:visible}.ui-gridlayout>:where(*),.ui-gridlayout>:where(*) span,.ui-gridlayout>:where(*)>*{--drag-distance:clamp(0,hypot(var(--dir-x,0),var(--dir-y,0)),6);--drag-duration:clamp(96ms,calc(var(--drag-distance, 0) * 110ms + 70ms),360ms);background-image:none;border:0 transparent;box-shadow:none;filter:none;outline:0 none transparent;pointer-events:none;touch-action:none;transition-behavior:allow-discrete;transition-delay:0s;transition-duration:var(--drag-duration);transition-property:opacity,background-color,color;transition-timing-function:cubic-bezier(.22,.8,.3,1)}.ui-gridlayout>:where(*){pointer-events:auto}.ui-gridlayout>:where(*) label,.ui-gridlayout>:where(*) span,.ui-gridlayout>:where(*) ui-icon,.ui-gridlayout>:where(*).label,.ui-gridlayout>:where(*).span,.ui-gridlayout>:where(*).ui-icon{pointer-events:none}.ui-gridlayout>:where(*) ui-icon{pointer-events:none}@media (prefers-reduced-motion:reduce){.ui-gridlayout>:where(*){transition-duration:0s;transition-timing-function:linear}}.ui-gridlayout>:where(*)>:where(*){block-size:stretch;grid-column:1/-1;grid-row:1/-1;inline-size:stretch;max-block-size:stretch;max-inline-size:stretch;min-block-size:1px;min-inline-size:1px}.ui-gridlayout.sd-grid--labels,.ui-gridlayout[data-layer=labels]{isolation:isolate;mix-blend-mode:normal;pointer-events:none!important}:is(.ui-gridlayout.sd-grid--labels,.ui-gridlayout[data-layer=labels])>:where(*){pointer-events:none}:is(.ui-gridlayout.sd-grid--labels,.ui-gridlayout[data-layer=labels])>:where(.ui-ws-item-label){align-items:center;block-size:stretch;color:color-mix(in oklch,var(--on-surface-color) 78%,transparent 22%);display:flex;flex-direction:column;font-size:clamp(.65rem,1.35cqmin,1rem);font-weight:500;gap:clamp(.1rem,.35cqmin,.35rem);inline-size:100%;justify-content:flex-start;letter-spacing:.015em;padding-block-start:clamp(.25rem,.65cqmin,.65rem);text-align:center;text-shadow:0 1px 2px color-mix(in oklch,var(--surface-color) 35%,transparent),0 0 .35rem color-mix(in oklch,var(--surface-color) 15%,transparent);text-wrap:balance;translate:0 calc(clamp(.25rem, .65cqmin, .65rem) + var(--cs-sw-unit-y, 0px))}:is(.ui-gridlayout.sd-grid--labels,.ui-gridlayout[data-layer=labels])>:where(.ui-ws-item-label) span{background-image:none;contain:layout paint;content-visibility:auto;max-inline-size:min(8ch,100%);opacity:.9;pointer-events:none;user-select:none}.ui-gridlayout slot{contain:none!important;display:contents!important;isolation:auto!important;overflow:visible!important}.ui-gridlayout ::slotted(*){direction:inherit;writing-mode:inherit}}@layer ux-launcher-grid{.ui-launcher-grid,.ui-speed-dial-grid{--os-layout-c:var(--layout-c,4);--os-layout-r:var(--layout-r,8);--cs-layout-c:--get-oriented-size-num(var(--orient,0),var(--os-layout-c,4),var(--os-layout-r,8),0);--cs-layout-r:--get-oriented-size-num(var(--orient,0),var(--os-layout-c,4),var(--os-layout-r,8),1);block-size:stretch;box-sizing:border-box;container-type:size;display:grid;gap:0;inline-size:stretch;min-block-size:0;min-inline-size:0;place-content:center;place-items:center;pointer-events:none;position:relative;--layout-c:4;--layout-r:8;--sd-inherit-layout-c:var(--layout-c,4);--sd-inherit-layout-r:var(--layout-r,8);--sd-inherit-cs-layout-c:var(--cs-layout-c,var(--layout-c,4));--sd-inherit-cs-layout-r:var(--cs-layout-r,var(--layout-r,8));grid-template-columns:repeat(var(--cs-layout-c,4),minmax(0,1fr));grid-template-rows:repeat(var(--cs-layout-r,8),minmax(0,1fr))}:is(.ui-launcher-grid,.ui-speed-dial-grid)>:where(.ui-ws-item,[data-launcher-item]){--orient:inherit}:is(.ui-launcher-grid,.ui-speed-dial-grid)>:where(.ui-ws-item,[data-launcher-item]){--cs-sw-unit-x:calc(var(--cs-size-x, 100cqi) / var(--cs-layout-c, 1));--cs-sw-unit-y:calc(var(--cs-size-y, 100cqb) / var(--cs-layout-r, 1))}:is(.ui-launcher-grid,.ui-speed-dial-grid)>:where(.ui-ws-item,[data-launcher-item]){--cs-transition-c:0px;--cs-transition-r:0px}:is(.ui-launcher-grid,.ui-speed-dial-grid)>:where(.ui-ws-item,[data-launcher-item])[data-dragging]{--cs-transition-c:calc((var(--rv-grid-c, 0) - var(--cs-grid-c, 0)) * var(--cs-sw-unit-x, 1px));--cs-transition-r:calc((var(--rv-grid-r, 0) - var(--cs-grid-r, 0)) * var(--cs-sw-unit-y, 1px))}:is(.ui-launcher-grid,.ui-speed-dial-grid)>:where(.ui-ws-item,[data-launcher-item]){--p-cell-x:var(--cell-x);--p-cell-y:var(--cell-y);--f-col:clamp(1,var(--layout-c,4),16);--f-row:clamp(1,var(--layout-r,8),16);--grid-c:clamp(0,var(--cell-x),var(--f-col) - 1);--grid-r:clamp(0,var(--cell-y),var(--f-row) - 1);--p-grid-c:clamp(0,var(--p-cell-x),var(--f-col) - 1);--p-grid-r:clamp(0,var(--p-cell-y),var(--f-row) - 1);--fc-cell-x:clamp(0,var(--cs-grid-c,0),var(--f-col) - 1);--fc-cell-y:clamp(0,var(--cs-grid-r,0),var(--f-row) - 1);--fp-cell-x:clamp(0,var(--cs-p-grid-c,0),var(--f-col) - 1);--fp-cell-y:clamp(0,var(--cs-p-grid-r,0),var(--f-row) - 1);--dir-x:calc(var(--cs-grid-c, 0) - var(--cs-p-grid-c, 0));--dir-y:calc(var(--cs-grid-r, 0) - var(--cs-p-grid-r, 0))}:is(.ui-launcher-grid,.ui-speed-dial-grid)>:where(.ui-ws-item,[data-launcher-item]){--rv-grid-c:var(--cs-grid-c,1);--rv-grid-r:var(--cs-grid-r,1)}:is(.ui-launcher-grid,.ui-speed-dial-grid)>:where(.ui-ws-item,[data-launcher-item])[data-dragging]{--rv-grid-c:var(--cs-p-grid-c,1);--rv-grid-r:var(--cs-p-grid-r,1)}:is(.ui-launcher-grid,.ui-speed-dial-grid)>:where(.ui-ws-item,[data-launcher-item]){--os-grid-c:var(--grid-c,1);--os-grid-r:var(--grid-r,1);--cs-grid-c:--get-oriented-coord-num(var(--orient,0),var(--os-grid-c,1),var(--os-grid-r,1),calc(var(--f-col, 1) - 1),calc(var(--f-row, 1) - 1),0);--cs-grid-r:--get-oriented-coord-num(var(--orient,0),var(--os-grid-c,1),var(--os-grid-r,1),calc(var(--f-col, 1) - 1),calc(var(--f-row, 1) - 1),1)}:is(.ui-launcher-grid,.ui-speed-dial-grid)>:where(.ui-ws-item,[data-launcher-item]){--os-p-grid-c:var(--p-cell-x,0);--os-p-grid-r:var(--p-cell-y,0);--cs-p-grid-c:--get-oriented-coord-num(var(--orient,0),var(--os-p-grid-c,0),var(--os-p-grid-r,0),calc(var(--f-col, 1) - 1),calc(var(--f-row, 1) - 1),0);--cs-p-grid-r:--get-oriented-coord-num(var(--orient,0),var(--os-p-grid-c,0),var(--os-p-grid-r,0),calc(var(--f-col, 1) - 1),calc(var(--f-row, 1) - 1),1)}:is(.ui-launcher-grid,.ui-speed-dial-grid)>:where(.ui-ws-item,[data-launcher-item]){--ox-c-unit:calc(var(--os-size-x, 100cqi) / var(--os-layout-c, 1));--ox-r-unit:calc(var(--os-size-y, 100cqb) / var(--os-layout-r, 1));--os-inset-x:calc((var(--grid-c, 1) + 0.5) * var(--ox-c-unit, 1px));--os-inset-y:calc((var(--grid-r, 1) + 0.5) * var(--ox-r-unit, 1px))}:is(.ui-launcher-grid,.ui-speed-dial-grid)>:where(.ui-ws-item,[data-launcher-item]){--f-col:clamp(1,var(--sd-inherit-layout-c,var(--layout-c,4)),16);--f-row:clamp(1,var(--sd-inherit-layout-r,var(--layout-r,8)),16);pointer-events:auto}}@layer ux-existence{[data-hidden]:not([data-hidden=false]):not([data-opacity-animation]),[data-hidden]:not([data-hidden=false]):not([data-opacity-animation]) *{opacity:0;visibility:collapse}:host([data-hidden]:not([data-hidden=false]:not([data-opacity-animation]))),:host([data-hidden]:not([data-hidden=false]:not([data-opacity-animation]))) *,:host([data-hidden]:not([data-hidden=false]:not([data-opacity-animation]))) ::slotted(*){opacity:0;visibility:collapse}:host([data-hidden]:not([data-hidden=false])),:host([data-hidden]:not([data-hidden=false])) *,:host([data-hidden]:not([data-hidden=false])) ::slotted(*){user-select:none!important}[data-hidden]:not([data-hidden=false]),[data-hidden]:not([data-hidden=false]) *{user-select:none!important}[data-hidden]:not([data-hidden=false]):not([data-opacity-animation]),[data-hidden]:not([data-hidden=false]):not([data-opacity-animation]) *{content-visibility:auto!important;display:none!important;pointer-events:none!important;touch-action:none!important}:host([data-hidden]:not([data-hidden=false]:not([data-opacity-animation]))),:host([data-hidden]:not([data-hidden=false]:not([data-opacity-animation]))) *,:host([data-hidden]:not([data-hidden=false]:not([data-opacity-animation]))) ::slotted(*){content-visibility:auto!important;display:none!important;pointer-events:none!important;touch-action:none!important}:host([data-hidden]:not([data-hidden=false])),:host([data-hidden]:not([data-hidden=false])) *,:host([data-hidden]:not([data-hidden=false])) ::slotted(*){pointer-events:none!important;touch-action:none!important}[data-hidden]:not([data-hidden=false]),[data-hidden]:not([data-hidden=false]) *{pointer-events:none!important;touch-action:none!important}[data-hidden]:not([data-hidden=false]):not([data-opacity-animation]),[data-hidden]:not([data-hidden=false]):not([data-opacity-animation]) *{display:none!important;opacity:0;pointer-events:none!important;touch-action:none!important;visibility:collapse}}@layer ux-existence{:host([data-hidden]:not([data-hidden=false]:not([data-opacity-animation]))),:host([data-hidden]:not([data-hidden=false]:not([data-opacity-animation]))) *,:host([data-hidden]:not([data-hidden=false]:not([data-opacity-animation]))) ::slotted(*){display:none!important;opacity:0;pointer-events:none!important;touch-action:none!important;visibility:collapse}:host([data-hidden]:not([data-hidden=false])),:host([data-hidden]:not([data-hidden=false])) *,:host([data-hidden]:not([data-hidden=false])) ::slotted(*){pointer-events:none!important;touch-action:none!important;user-select:none!important}[data-hidden]:not([data-hidden=false]),[data-hidden]:not([data-hidden=false]) *{pointer-events:none!important;touch-action:none!important;user-select:none!important}}@function --u2-color-mod(--base-color <color>, --index <number> : 550) returns <color>{--i:clamp(0,var(--index),1000);--pivot:550;--white-distance:clamp(0,calc((var(--pivot) - var(--i)) / var(--pivot)),1);--black-distance:clamp(0,calc((var(--i) - var(--pivot)) / (1000 - var(--pivot))),1);--to-white:pow(var(--white-distance),1.15);--to-black:pow(var(--black-distance),1.08);--center-left:clamp(0,calc(var(--i) / var(--pivot)),1);--center-right:clamp(0,calc((1000 - var(--i)) / (1000 - var(--pivot))),1);--chroma-shape:sqrt(min(var(--center-left),var(--center-right)));--chroma-scale:calc(0.08 + 0.92 * var(--chroma-shape));result:oklch(from var(--base-color) calc(l + (.985 - l) * var(--to-white) + (.16 - l) * var(--to-black)) calc(c * var(--chroma-scale)) h)}@layer tokens, base, layout, utilities, shells, shell, views, view, viewer, components, ux-layer, markdown, essentials, print, print-breaks, overrides;@layer tokens{:where(:root,html){color-scheme:light dark;dynamic-range-limit:no-limit;--color-primary:light-dark(#91b6e3,#2e3a64);--base-color:var(--color-primary);--color-bg:light-dark(--u2-color-mod(var(--base-color),70),--u2-color-mod(var(--base-color),940));--color-text:light-dark(--u2-color-mod(var(--base-color),900),--u2-color-mod(var(--base-color),100));--color-fg:var(--color-text);--color-bg-secondary:light-dark(--u2-color-mod(var(--base-color),160),--u2-color-mod(var(--base-color),840));--color-bg-alt:light-dark(--u2-color-mod(var(--base-color),200),--u2-color-mod(var(--base-color),880));--color-text-secondary:light-dark(--u2-color-mod(var(--base-color),700),--u2-color-mod(var(--base-color),280));--color-border:light-dark(--u2-color-mod(var(--base-color),300),--u2-color-mod(var(--base-color),640));--color-table:light-dark(--u2-color-mod(var(--base-color),120),--u2-color-mod(var(--base-color),860));--color-link:var(--color-primary);--color-primary-hover:light-dark(--u2-color-mod(var(--base-color),620),--u2-color-mod(var(--base-color),480));--color-secondary:light-dark(--u2-color-mod(var(--base-color),420),--u2-color-mod(var(--base-color),680));--color-outline:light-dark(--u2-color-mod(var(--base-color),100),--u2-color-mod(var(--base-color),900));--color-outline-variant:light-dark(--u2-color-mod(var(--base-color),100),--u2-color-mod(var(--base-color),900));--font-sans:system-ui,-apple-system,BlinkMacSystemFont,\"Segoe UI\",Roboto,sans-serif;--line-height:1.5;--border-radius:0.5rem;tab-size:4;text-size-adjust:100%;interpolate-size:allow-keywords;block-size:stretch;border:none;contain:strict;font-family:var(--font-family,system-ui,-apple-system,BlinkMacSystemFont,\"Segoe UI\",Roboto,sans-serif);font-optical-sizing:auto;font-size:16px;font-size-adjust:from-font;inline-size:stretch;line-height:1.5;margin:0;max-block-size:min(100%,min(100cqb,100dvb));max-inline-size:min(100%,min(100cqi,100dvi));min-block-size:0;min-inline-size:0;overflow:hidden;padding:0}}@layer base{@keyframes q{0%{opacity:0;transform:translateY(10%)}to{opacity:1;transform:translateY(0)}}@media screen{*,:after,:before{box-sizing:border-box;dynamic-range-limit:no-limit}:where(html){-webkit-text-size-adjust:100%;font-optical-sizing:auto;font-size-adjust:from-font;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;dynamic-range-limit:no-limit;font-family:var(--font-sans);font-size:16px;line-height:1.5;text-rendering:optimizeLegibility}:where(body){background:var(--color-bg);block-size:fit-content;border:none;color:var(--color-text);inset:0;line-height:var(--line-height);margin:0;min-block-size:min(100dvb,100cqb);padding:0;-webkit-font-smoothing:antialiased;dynamic-range-limit:no-limit;text-rendering:optimizeLegibility}:where(ul,ol){list-style:none;margin:0;padding:0}:where(blockquote,q){quotes:none}:where(blockquote,q):after,:where(blockquote,q):before{content:\"\";content:none}:where(article,main,aside,section,header,footer,nav){border:0 transparent;box-shadow:0 none transparent;outline:0 none transparent}:where(table){border:1px solid var(--color-border);border-collapse:collapse;border-radius:var(--border-radius);border-spacing:0;display:block;inline-size:max-content;margin-block:1rem;max-inline-size:100%;overflow-x:auto}:where(table) :where(th,td){border-block-end:1px solid var(--color-border);padding:.5rem 1rem;text-align:start}:where(table) :where(th){background-color:var(--color-table);color:var(--color-text);font-weight:700}:where(table) :where(tr:last-child td){border-block-end:none}:where(table) :where(tr:nth-child(2n)){background-color:var(--color-bg-secondary)}:focus-visible{border-radius:var(--radius-sm,8px);box-shadow:0 0 0 3px color-mix(in oklab,var(--color-primary,#0066cc) 35%,transparent);outline:none}:focus:not(:focus-visible){outline:none}:where(button,input,optgroup,select,textarea){border:0 transparent;box-shadow:0 none transparent;color:inherit;font:inherit;letter-spacing:inherit;line-height:1.15;margin:0;outline:none;outline:0 none transparent}:where(button){appearance:none;background:transparent;border:none;cursor:pointer;gap:.25rem;min-block-size:fit-content;min-inline-size:fit-content;padding-block:.5rem;padding-inline:1rem;pointer-events:auto;text-transform:none;user-select:none}:where(button):has(>ui-icon:only-child){aspect-ratio:1/1;place-content:center;place-items:center}:where(button):disabled{cursor:not-allowed;pointer-events:none}:where(select){text-transform:none}:where(button,[type=button],[type=reset],[type=submit]){-webkit-appearance:button;cursor:pointer}:where(button,[type=button],[type=reset],[type=submit])::-moz-focus-inner{border-style:none;padding:0}:where(fieldset,dialog){border:none;margin:0;padding:0}:where(legend){padding:0}:where(progress){vertical-align:initial}:where(textarea){overflow:auto;resize:vertical}:where([type=search]){-webkit-appearance:textfield;outline-offset:-2px}:where([type=search])::-webkit-search-decoration{-webkit-appearance:none}:where([type=range]){-webkit-appearance:none}:where(details>summary),:where(summary){cursor:pointer}:where(mark){background-color:initial;color:inherit}:where(sub,sup){font-size:75%;line-height:0;position:relative;vertical-align:initial}:where(sup){top:-.5em}:where(sub){bottom:-.25em}:where(a){color:var(--color-link,inherit);cursor:pointer;pointer-events:auto;text-decoration:inherit;text-underline-offset:.2em;transition:color var(--transition-fast)}:where(a):hover{color:var(--color-primary-hover)}:where(img,canvas,svg,video,iframe,picture){block-size:auto;border:0 transparent;box-shadow:0 none transparent;dynamic-range-limit:no-limit;max-inline-size:100%;outline:0 none transparent}:where(img,video,canvas,svg,picture){block-size:auto;display:block;max-inline-size:100%}:where(img,video){object-fit:contain;object-position:center}:where(picture){display:contents}:where(iframe){block-size:auto;max-inline-size:100%}:where(em,i){font-style:normal}:where(strong,b){font-weight:400}:where(code,kbd,samp,pre){font-family:var(--font-family-mono,\"SF Mono\",\"Monaco\",\"Inconsolata\",\"Roboto Mono\",monospace);font-size:1em}:where(code,pre){font-family:var(--font-mono);font-size:.875em}:where(code,samp,kbd){background-color:var(--bgColor-muted);border-radius:.3em;font-family:var(--font-family-mono,\"SF Mono\",\"Monaco\",\"Roboto Mono\",monospace);font-size:85%;padding:.2em .4em}:where(code){background:var(--color-bg-alt);border-radius:var(--radius-sm);padding:.125em .25em}:where(pre){background:var(--color-bg-alt);border-radius:var(--radius-md);overflow-x:auto;padding:var(--space-md)}:where(pre) :where(code){background:transparent;border-radius:0;padding:0}:where(input,textarea,select,button,option){accent-color:var(--color-link,currentColor);border:0 transparent;box-shadow:0 none transparent;font-variant-emoji:text;outline:0 none transparent}:where(span){font-variant-emoji:text}:where(hr){border:none;border-block-start:1px solid var(--color-border);margin-block:var(--space-lg)}::-webkit-scrollbar{block-size:8px;inline-size:8px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:var(--color-outline-variant,#d1d5db);border-radius:4px}::-webkit-scrollbar-thumb:hover{background:var(--color-outline,#9ca3af)}*{scrollbar-color:var(--color-outline-variant,#d1d5db) transparent;scrollbar-width:thin}:where(input,textarea,select){background-color:var(--color-bg-alt);border:0 solid var(--color-border);border-radius:var(--border-radius);color:var(--color-fg);font-size:var(--font-size-base);inline-size:100%;padding:.5rem}:where(input,textarea,select):focus{border-color:var(--color-primary);outline:none}:where(input,textarea,select)::placeholder{color:var(--color-text-secondary);opacity:.7}:where(input,textarea,select):disabled{background-color:var(--color-bg-secondary);cursor:not-allowed;opacity:.5}:where(input):-webkit-autofill:first-line,:where(input):autofill:first-line{font-size:1em;text-size-adjust:100%}:where(input):-internal-autofill-previewed{letter-spacing:calc(1em / 10)!important}:where(input):is([type=radio],[type=checkbox]){accent-color:var(--color-primary);aspect-ratio:1/1;block-size:1rem;inline-size:1rem}:where(label){font-weight:600;margin-block-end:.25rem;pointer-events:none;user-select:none}:where(h1,h2,h3,h4,h5,h6){font-weight:600;line-height:1.2;margin-block:.5em;text-wrap:balance}:where(h1){font-size:2rem}:where(h2){font-size:1.5rem}:where(h3){font-size:1.25rem}:where(h4){font-size:1.125rem}:where(h5){font-size:1rem}:where(h6){font-size:.875rem}:where(p){margin-block:1em;text-wrap:pretty}:where(article,.content) :is(ol,ul){margin-block:var(--space-md);padding-inline-start:var(--space-lg)}:where(article,.content) ul{list-style:disc}:where(article,.content) ol{list-style:decimal}:where(blockquote){border-inline-start:.25rem solid var(--color-secondary);color:var(--color-text-secondary);font-style:italic;margin-inline:1rem;padding-inline:1rem}:where(body,main,aside,pre,code,textarea,[data-scrollable],.scrollable){scrollbar-color:var(--color-scrollbar,currentColor) transparent;scrollbar-width:thin}:where(body,main,aside,pre,code,textarea,[data-scrollable],.scrollable)::-webkit-scrollbar{block-size:var(--scrollbar-size,8px);inline-size:var(--scrollbar-size,8px)}:where(body,main,aside,pre,code,textarea,[data-scrollable],.scrollable)::-webkit-scrollbar-track{background:transparent}:where(body,main,aside,pre,code,textarea,[data-scrollable],.scrollable)::-webkit-scrollbar-thumb{background-color:var(--color-scrollbar,currentColor);border-radius:var(--border-radius,4px)}:where(body,main,aside,pre,code,textarea,[data-scrollable],.scrollable)::-webkit-scrollbar-thumb:hover{background:var(--color-outline,#9ca3af)}:where(link,head,script,style,meta),[hidden]{display:none!important}:where(link,head,script,style,meta){pointer-events:none!important}[aria-hidden=true]{opacity:0;pointer-events:none;visibility:collapse}[data-dragging]{cursor:grabbing;will-change:transform}:where(a,button,[role=button]){-webkit-tap-highlight-color:transparent}}@media screen and (prefers-reduced-motion:reduce){*,:after,:before{animation-duration:.01ms!important;animation-iteration-count:1!important;scroll-behavior:auto!important;transition-duration:.01ms!important}}}@layer layout{@media screen{:where(footer,header,main){margin-inline:auto;padding:0}:where(header){text-align:center}:where(nav){align-items:center;display:flex;flex-wrap:wrap;justify-content:space-between;margin-block-end:0}:where(nav) ul{display:flex;gap:1rem;list-style:none;margin:0;padding:0}:where(nav) ul li{position:relative}:where(nav) a{color:var(--color-link);font-weight:700;text-decoration:none}:where(section){display:flex;flex-wrap:wrap;gap:1rem;justify-content:var(--justify-important,center)}:where(section) :where(aside){border:1px solid var(--color-bg-secondary);border-radius:var(--border-radius);box-shadow:var(--box-shadow);flex:1 1 var(--width-card);inline-size:var(--width-card);padding:1.25rem}}}@layer components{@media screen{:where(dialog){background:var(--color-bg);border:1px solid var(--color-border);border-radius:var(--border-radius);box-shadow:var(--box-shadow);color:var(--color-text);margin:auto;max-block-size:85vh;max-inline-size:min(90vw,600px);padding:1rem}:where(dialog)::backdrop{background-color:rgba(0,0,0,.5)}:where(dialog)[open]{animation:q .25s ease-out}:where(button,input[type=submit],input[type=button]){align-items:center;background-color:var(--color-link);border:0 solid transparent;border-radius:var(--border-radius);cursor:pointer;display:inline-flex;font-weight:600;justify-content:center;padding:.5rem 1rem;transition:filter .2s ease,transform .1s ease}:where(button,input[type=submit],input[type=button]):disabled{background-color:var(--color-secondary);cursor:not-allowed;filter:none;opacity:.6}:where(canvas):is([is=ui-canvas]){block-size:stretch;border:none;box-sizing:border-box!important;inline-size:stretch;inset:0;margin:0;max-block-size:min(100%,min(100cqb,100dvb))!important;max-inline-size:min(100%,min(100cqi,100dvi))!important;min-block-size:0;min-inline-size:0;object-fit:cover;object-position:center;padding:0;pointer-events:none;position:absolute;z-index:0}}}@layer overrides{@media screen{[data-scheme=system],[data-theme=system]{color-scheme:light dark}[data-scheme=dark],[data-theme=dark]{color-scheme:dark only}[data-scheme=dark] *,[data-theme=dark] *{color-scheme:dark}[data-scheme=light],[data-theme=light]{color-scheme:light only}[data-scheme=light] *,[data-theme=light] *{color-scheme:light}[data-scheme=auto]:not([data-theme=light]):not([data-theme=dark]),[data-scheme=system]:not([data-theme=light]):not([data-theme=dark]),[data-theme=auto],[data-theme=system]{color-scheme:light dark}}}@position-try --just-block{inset-block-end:0}@position-try --just-inline{inset-inline-end:0}.c-underlying{inset:0;overflow:visible;pointer-events:none;position:absolute;z-index:calc(var(--layer-main-z, 0) - 1)}.c-underlying__shaped{block-size:100%;border-radius:var(--layer-shape-radius,inherit);clip-path:var(--layer-shape-clip,none);inline-size:100%;mask-image:var(--layer-shape-mask,none);-webkit-mask-image:var(--layer-shape-mask,none)}.c-overlaying{inset:0;pointer-events:none;position:absolute;z-index:calc(var(--layer-main-z, 0) + 1)}.c-overlaying [data-axis]{pointer-events:auto}";
//#endregion
//#region ../../modules/projects/fl.ui/src/styles/font-loader.ts
/**
* Cache for Blob URLs to avoid re-creating them
*/
var blobUrlCache = /* @__PURE__ */ new Map();
/**
* Cache for FontFace instances
*/
var fontFaceCache = /* @__PURE__ */ new Map();
/**
* Decode base64 string to Uint8Array
* Uses Uint8Array.fromBase64 if available, otherwise falls back to atob
*/
function decodeBase64(base64) {
	if (typeof Uint8Array.fromBase64 === "function") return Uint8Array.fromBase64(base64);
	const binaryString = atob(base64);
	const bytes = new Uint8Array(binaryString.length);
	for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);
	return bytes;
}
/**
* Decompress data using Compression Streams API
* Only used for fonts that were compressed (e.g., gzip)
* woff2 files are already compressed and don't need decompression
*/
async function decompress(data, algorithm = "gzip") {
	if (typeof CompressionStream === "undefined") throw new Error("Compression Streams API is not supported in this browser");
	const stream = new DecompressionStream(algorithm);
	const writer = stream.writable.getWriter();
	const reader = stream.readable.getReader();
	writer.write(data);
	writer.close();
	const chunks = [];
	let done = false;
	while (!done) {
		const { value, done: readerDone } = await reader.read();
		done = readerDone;
		if (value) chunks.push(value);
	}
	const totalLength = chunks.reduce((sum, chunk) => sum + chunk.length, 0);
	const result = new Uint8Array(totalLength);
	let offset = 0;
	for (const chunk of chunks) {
		result.set(chunk, offset);
		offset += chunk.length;
	}
	return result;
}
/**
* Get or create a Blob URL from font data
* Caches the URL to avoid re-creating Blobs
*/
async function getBlobUrl(fontData, cacheKey, mimeType = "font/woff2") {
	if (blobUrlCache.has(cacheKey)) return blobUrlCache.get(cacheKey);
	const blob = new Blob([fontData], { type: mimeType });
	const url = URL.createObjectURL(blob);
	blobUrlCache.set(cacheKey, url);
	return url;
}
/**
* Load a font from base64-encoded, compressed data
*/
async function loadFont(metadata) {
	const { base64, family, style = "normal", weight = "normal", compressed = false } = metadata;
	const cacheKey = `${family}-${style}-${weight}`;
	if (fontFaceCache.has(cacheKey)) return fontFaceCache.get(cacheKey);
	const encodedData = decodeBase64(base64);
	const blobUrl = await getBlobUrl(compressed ? await decompress(encodedData) : encodedData, cacheKey, compressed ? "application/octet-stream" : "font/woff2");
	const fontFace = new FontFace(family, `url(${blobUrl}) format('woff2')`, {
		style,
		weight: typeof weight === "string" ? weight : `${weight}`,
		display: "swap"
	});
	await fontFace.load();
	document.fonts.add(fontFace);
	fontFaceCache.set(cacheKey, fontFace);
	return fontFace;
}
/**
* Load multiple fonts
*/
async function loadFonts(metadataArray) {
	const promises = metadataArray.map((metadata) => loadFont(metadata));
	return Promise.all(promises);
}
var loadingFontRegistry = null;
async function loadFontRegistry() {
	if (loadingFontRegistry) return loadingFontRegistry;
	loadingFontRegistry = import("./app6.js")?.catch?.((error) => {
		console.error("Failed to load font registry:", error);
	});
	return loadingFontRegistry;
}
/**
* Load all fonts from the registry
*/
async function loadAllFonts() {
	const fontRegistry = await loadFontRegistry();
	return loadFonts(Object.values(fontRegistry.fontRegistry));
}
/**
* Font data registry (populated by Vite plugin)
* Import from generated font-registry module
*/
//#endregion
//#region ../../modules/projects/fl.ui/src/styles/patch-global-native-controls.scss?inline
var patch_global_native_controls_default = "@layer tokens, base, layout, utilities, shells, shell, views, view, viewer, components, ux-layer, markdown, essentials, print, print-breaks, overrides;@layer components{button{align-items:center;background:var(--color-bg-alt);border:1px solid var(--color-border);border-radius:var(--radius-md);color:var(--color-fg);cursor:pointer;display:inline-flex;font-size:var(--font-size-sm);font-weight:500;gap:var(--space-sm);justify-content:center;padding-block:0;padding-inline:0;transition:all var(--transition-fast)}button:hover:not(:disabled){background:var(--color-border)}button:focus-visible{outline:2px solid var(--color-primary);outline-offset:2px}button:disabled{cursor:not-allowed;opacity:.5}}@layer layer.shell.faint.forms{input,select,textarea{background-repeat:no-repeat;font-size:inherit;max-inline-size:stretch;max-inline-size:100cqi;min-block-size:2.5rem;overflow:auto;scrollbar-width:none;text-overflow:ellipsis}textarea[data-multiline=true]{min-block-size:5rem;resize:vertical}}";
//#endregion
//#region ../../modules/projects/fl.ui/src/styles/index.ts
/**
* Veela.CSS TypeScript Module
*
* Exports font loading utilities and type definitions.
* Runtime styles and initialization are in ../scss/runtime/index.ts
*/
var fontStyles = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
`;
var loader = async (options) => {
	await loadAsAdopted(fontStyles)?.catch(() => void 0);
	await loadAllFonts().catch(() => void 0);
	await loadAsAdopted(styles_default)?.catch(() => void 0);
	if (options?.includeGlobalNativeControls) await loadAsAdopted(patch_global_native_controls_default)?.catch(() => void 0);
};
//#endregion
//#region ../../modules/projects/fl.ui/src/ui/navigation/calendar/CalendarFlyout.ts
var styled$5 = preloadStyle(":host{--cal-base-color:var(--color-primary);--cal-surface:var(--color-surface);--cal-on-surface:var(--color-on-surface);--cal-outline:color-mix(in oklab,var(--color-outline-variant) 80%,transparent);--cal-hover:color-mix(in oklab,var(--color-on-surface) 8%,transparent);box-sizing:border-box;color:var(--cal-on-surface);color-scheme:inherit;display:block;max-inline-size:min(360px,96vw);min-inline-size:280px;pointer-events:auto}:host([hidden]){display:none!important}.ui-cal-flyout__panel{background:var(--cal-surface);border:1px solid var(--cal-outline);border-radius:14px;box-shadow:0 18px 44px -18px color-mix(in oklab,#000 55%,transparent),0 2px 6px -2px color-mix(in oklab,#000 35%,transparent);box-sizing:border-box;color:contrast-color(var(--cal-surface));display:flex;flex-direction:column;gap:.6rem;inline-size:100%;padding:.9rem .9rem .75rem}.ui-cal-flyout__header{align-items:baseline;display:flex;justify-content:space-between;padding-inline:.15rem}.ui-cal-flyout__today{color:var(--cal-on-surface);font-size:.95rem;font-weight:650;line-height:1.25;margin:0}.ui-cal-flyout__nav{align-items:center;display:grid;gap:.35rem;grid-template-columns:auto 1fr auto}.ui-cal-flyout__nav-btn{align-items:center;appearance:none;background:transparent;block-size:2rem;border:none;border-radius:8px;color:var(--cal-on-surface);cursor:pointer;display:inline-flex;inline-size:2rem;justify-content:center;padding:0;-webkit-tap-highlight-color:transparent}.ui-cal-flyout__nav-btn ui-icon{--icon-size:1.05rem;--icon-color:currentColor;block-size:var(--icon-size);color:currentColor;inline-size:var(--icon-size);pointer-events:none}.ui-cal-flyout__nav-btn:hover{background:var(--cal-hover);color:contrast-color(var(--cal-hover))}.ui-cal-flyout__nav-btn:active{background:color-mix(in oklab,var(--cal-hover) 160%,transparent);color:contrast-color(color-mix(in oklab,var(--cal-hover) 160%,transparent))}.ui-cal-flyout__nav-btn:focus-visible{outline:2px solid var(--cal-base-color);outline-offset:1px}.ui-cal-flyout__month-label{color:var(--cal-on-surface);font-size:.86rem;font-weight:600;letter-spacing:.01em;text-align:center;user-select:none}.ui-cal-flyout__weekdays{display:grid;gap:2px;grid-template-columns:repeat(7,minmax(0,1fr));padding-inline:.1rem}.ui-cal-flyout__weekday{align-items:center;color:color-mix(in oklab,var(--cal-on-surface) 62%,transparent);display:flex;font-size:.7rem;font-weight:600;justify-content:center;letter-spacing:.02em;padding-block:.2rem;text-transform:uppercase;user-select:none}.ui-cal-flyout__grid{display:grid;gap:2px;grid-template-columns:repeat(7,minmax(0,1fr));padding-inline:.1rem}.ui-cal-flyout__day{align-items:center;appearance:none;aspect-ratio:1/1;background:transparent;border:none;border-radius:999px;color:var(--cal-on-surface);cursor:pointer;display:inline-flex;font-size:.82rem;font-variant-numeric:tabular-nums;inline-size:100%;justify-content:center;position:relative;-webkit-tap-highlight-color:transparent;transition:background-color .12s ease,color .12s ease}.ui-cal-flyout__day[data-other-month]{color:color-mix(in oklab,var(--cal-on-surface) 42%,transparent)}.ui-cal-flyout__day:hover{background:var(--cal-hover);color:contrast-color(var(--cal-hover))}.ui-cal-flyout__day:focus-visible{outline:2px solid var(--cal-base-color);outline-offset:1px}.ui-cal-flyout__day[data-today]{background:color-mix(in oklab,var(--cal-base-color) 88%,transparent);color:light-dark(#ffffff,#ffffff);font-weight:700}.ui-cal-flyout__day[data-selected]{box-shadow:0 0 0 2px var(--cal-base-color) inset}.ui-cal-flyout__day[data-today][data-selected]{box-shadow:0 0 0 2px color-mix(in oklab,var(--cal-base-color) 70%,#fff 20%) inset}");
/** 1 Jan 2023 (UTC) is a Sunday — stable anchor for deriving weekday short-labels per locale. */
var REFERENCE_SUNDAY_UTC = Date.UTC(2023, 0, 1);
var DAY_MS = 864e5;
/**
* Locale week start, 0 (Sunday) .. 6 (Saturday) — matches `Date#getDay()`.
* `Intl.Locale` week info is still a staged API; both accessor shapes are probed,
* with a Sunday-start fallback when unsupported.
*/
function resolveFirstDayOfWeek(locale) {
	try {
		const loc = new Intl.Locale(locale);
		const first = (loc.weekInfo ?? loc.getWeekInfo?.())?.firstDay;
		if (typeof first === "number" && first >= 1 && first <= 7) return first % 7;
	} catch {}
	return 0;
}
function weekdayShortLabels(locale, startDay) {
	const fmt = new Intl.DateTimeFormat(locale, {
		weekday: "short",
		timeZone: "UTC"
	});
	const labels = [];
	for (let i = 0; i < 7; i++) {
		const dow = (startDay + i) % 7;
		labels.push(fmt.format(new Date(REFERENCE_SUNDAY_UTC + dow * DAY_MS)));
	}
	return labels;
}
function isSameDate(a, b) {
	return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}
/** Full 6×7 (or shorter, week-complete) grid for `year`/`month`, leading/trailing days included. */
function buildMonthCells(year, month, startDay) {
	const today = /* @__PURE__ */ new Date();
	const firstOfMonth = new Date(year, month, 1);
	const daysInMonth = new Date(year, month + 1, 0).getDate();
	const leading = (firstOfMonth.getDay() - startDay + 7) % 7;
	const totalCells = Math.ceil((leading + daysInMonth) / 7) * 7;
	const cells = [];
	for (let i = 0; i < totalCells; i++) {
		const dayNum = i - leading + 1;
		const date = new Date(year, month, dayNum);
		cells.push({
			date,
			day: date.getDate(),
			otherMonth: date.getMonth() !== month,
			isToday: isSameDate(date, today)
		});
	}
	return cells;
}
var CalendarFlyout = class CalendarFlyout extends UIElement {
	#year;
	#month;
	#selected = null;
	#unbind = null;
	styles = function() {
		return styled$5;
	};
	render = function() {
		return H`<div class="ui-cal-flyout__panel" part="panel">
            <header class="ui-cal-flyout__header" part="header">
                <p class="ui-cal-flyout__today" part="today"></p>
            </header>
            <div class="ui-cal-flyout__nav" part="nav">
                <button type="button" class="ui-cal-flyout__nav-btn" data-nav="prev" aria-label="Previous month" title="Previous month">
                    <ui-icon icon="caret-left"></ui-icon>
                </button>
                <div class="ui-cal-flyout__month-label" part="month-label" aria-live="polite"></div>
                <button type="button" class="ui-cal-flyout__nav-btn" data-nav="next" aria-label="Next month" title="Next month">
                    <ui-icon icon="caret-right"></ui-icon>
                </button>
            </div>
            <div class="ui-cal-flyout__weekdays" part="weekdays" role="row"></div>
            <div class="ui-cal-flyout__grid" part="grid" role="grid"></div>
        </div>`;
	};
	constructor() {
		super();
		const now = /* @__PURE__ */ new Date();
		this.#year = now.getFullYear();
		this.#month = now.getMonth();
	}
	onRender() {
		super.onRender();
		this.#wire();
		this.#renderFrame();
	}
	disconnectedCallback() {
		this.#unbind?.();
		this.#unbind = null;
		super.disconnectedCallback?.();
	}
	/** Bind nav / day-cell clicks once (element persists as a hidden singleton — see module helpers below). */
	#wire() {
		const root = this.shadowRoot;
		if (!root || this.#unbind) return;
		const onClick = (ev) => {
			const t = ev.target;
			const nav = t?.closest?.("[data-nav]");
			if (nav) {
				if (nav.dataset.nav === "prev") this.#shiftMonth(-1);
				else if (nav.dataset.nav === "next") this.#shiftMonth(1);
				return;
			}
			const day = t?.closest?.(".ui-cal-flyout__day");
			if (day) this.#selectDay(day);
		};
		const off = addEvent(root, "click", onClick);
		this.#unbind = () => off?.();
	}
	#shiftMonth(delta) {
		this.#month += delta;
		if (this.#month < 0) {
			this.#month = 11;
			this.#year -= 1;
		} else if (this.#month > 11) {
			this.#month = 0;
			this.#year += 1;
		}
		this.#renderFrame();
	}
	/** Jump the visible grid back to the month containing today (does not touch selection). */
	#goToday() {
		const now = /* @__PURE__ */ new Date();
		this.#year = now.getFullYear();
		this.#month = now.getMonth();
		this.#renderFrame();
	}
	#selectDay(el) {
		const iso = el.dataset.date;
		if (!iso) return;
		this.#selected = new Date(iso);
		this.shadowRoot?.querySelectorAll(".ui-cal-flyout__day[data-selected]")?.forEach((n) => n.removeAttribute("data-selected"));
		el.setAttribute("data-selected", "");
		this.dispatchEvent(new CustomEvent("calendar-select", {
			bubbles: true,
			composed: true,
			detail: { date: this.#selected }
		}));
	}
	/** Re-paint today-header / month-label / weekday-row / day-grid from `#year`/`#month`/`#selected`. */
	#renderFrame() {
		const root = this.shadowRoot;
		if (!root) return;
		const locale = typeof navigator !== "undefined" ? navigator.language : void 0;
		const startDay = resolveFirstDayOfWeek(locale ?? "en-US");
		const today = /* @__PURE__ */ new Date();
		const todayEl = root.querySelector(".ui-cal-flyout__today");
		if (todayEl) todayEl.textContent = today.toLocaleDateString(locale, {
			weekday: "long",
			month: "long",
			day: "numeric",
			year: "numeric"
		});
		const monthLabelEl = root.querySelector(".ui-cal-flyout__month-label");
		if (monthLabelEl) monthLabelEl.textContent = new Date(this.#year, this.#month, 1).toLocaleDateString(locale, {
			month: "long",
			year: "numeric"
		});
		const weekdaysEl = root.querySelector(".ui-cal-flyout__weekdays");
		if (weekdaysEl) weekdaysEl.replaceChildren(...weekdayShortLabels(locale ?? "en-US", startDay).map((label) => {
			const span = document.createElement("span");
			span.className = "ui-cal-flyout__weekday";
			span.setAttribute("role", "columnheader");
			span.textContent = label;
			return span;
		}));
		const gridEl = root.querySelector(".ui-cal-flyout__grid");
		if (gridEl) {
			const cells = buildMonthCells(this.#year, this.#month, startDay);
			gridEl.replaceChildren(...cells.map((cell) => {
				const btn = document.createElement("button");
				btn.type = "button";
				btn.className = "ui-cal-flyout__day";
				btn.textContent = String(cell.day);
				btn.dataset.date = cell.date.toISOString();
				btn.setAttribute("role", "gridcell");
				if (cell.otherMonth) btn.setAttribute("data-other-month", "");
				if (cell.isToday) btn.setAttribute("data-today", "");
				if (this.#selected && isSameDate(cell.date, this.#selected)) btn.setAttribute("data-selected", "");
				btn.setAttribute("aria-label", cell.date.toLocaleDateString(locale, {
					weekday: "long",
					month: "long",
					day: "numeric",
					year: "numeric"
				}));
				return btn;
			}));
		}
	}
	open() {
		this.#goToday();
		this.removeAttribute("hidden");
		this.hidden = false;
		this.setAttribute("open", "");
	}
	close() {
		this.hidden = true;
		this.setAttribute("hidden", "");
		this.removeAttribute("open");
	}
	toggle(anchor) {
		if (this.hasAttribute("open")) this.close();
		else this.open();
	}
};
CalendarFlyout = __decorate([defineElement("ui-calendar-flyout")], CalendarFlyout);
//#endregion
//#region ../../modules/projects/fl.ui/src/ui/navigation/settings/QuickSettings.ts
/**
* WHY: Singleton `ui-quick-settings` custom element mounted into the shared ChromeFlyout
* overlay root (see `../flyout/ChromeFlyout`), exclusive with the calendar flyout via the
* shared registry. Theme toggling and the night-light/brightness overlay filters are local,
* dependency-free helpers — no hard import of the app-level Theme/Settings subsystem — so
* this component stays usable standalone inside `fl.ui`. Apps that ship a real Theme
* subsystem can still react via the `u2-theme-change` event this module dispatches.
*/
var styled$4 = preloadStyle(":host{box-sizing:border-box;color-scheme:inherit;contain:layout style;display:block;pointer-events:auto}:host([data-theme=light]),:host-context(html[data-theme=light]){color-scheme:light only}:host([data-theme=dark]),:host-context(html[data-theme=dark]){color-scheme:dark only}:host([open]){animation:a .14s cubic-bezier(.22,.8,.3,1)}:host([hidden]){display:none!important}@keyframes a{0%{opacity:0;transform:translateY(6px) scale(.98)}to{opacity:1;transform:translateY(0) scale(1)}}@layer ui-quick-settings{.qs-panel{--qs-primary:var(--color-primary);--qs-surface:var(--color-surface);--qs-on-surface:var(--color-on-surface);--qs-outline:color-mix(in oklab,var(--color-outline-variant) 80%,transparent);background:var(--qs-surface);border:1px solid var(--qs-outline);border-radius:14px;box-shadow:0 20px 48px -20px rgba(0,0,0,.4),0 2px 8px -2px rgba(0,0,0,.25);box-sizing:border-box;color:var(--qs-on-surface);display:grid;font:500 .85rem/1.3 ui-sans-serif,system-ui,sans-serif;gap:.85rem;inline-size:min(360px,100vw - 1.5rem);max-inline-size:360px;min-inline-size:320px;padding:.9rem;pointer-events:auto}@supports (color:contrast-color(red)){.qs-panel{color:contrast-color(var(--qs-surface))}}.qs-tiles{display:grid;gap:.5rem;grid-template-columns:repeat(2,minmax(0,1fr))}.qs-tile-icon{--icon-size:1.35rem;--icon-color:currentColor;block-size:var(--icon-size);color:contrast-color(var(--qs-surface));flex:0 0 auto;inline-size:var(--icon-size);line-height:0}@supports (color:color-mix(in lch,red,blue)) and (color:contrast-color(red)){.qs-tile-icon{color:color-mix(in oklch,contrast-color(var(--qs-surface)) 40%,var(--color-primary,var(--qs-primary)))}}.qs-tile{align-items:center;background:color-mix(in oklab,var(--qs-on-surface) 8%,transparent);border:none;border-radius:10px;color:inherit;cursor:pointer;display:flex;gap:.6rem;min-inline-size:0;padding:.55rem .65rem;text-align:start;transition:background-color .14s ease,color .14s ease}.qs-tile,.qs-tile:hover{color:contrast-color(inherit(background-color))}.qs-tile:hover{background:color-mix(in oklab,var(--qs-on-surface) 14%,transparent)}.qs-tile:active{background:color-mix(in oklab,var(--qs-on-surface) 18%,transparent);color:contrast-color(inherit(background-color))}.qs-tile:focus-visible{outline:2px solid var(--color-primary,var(--qs-primary));outline-offset:2px}.qs-tile[aria-pressed=true]{background:color-mix(in oklab,var(--color-primary,var(--qs-primary)) 26%,transparent);color:var(--color-primary,var(--qs-primary))}@supports (color:color-mix(in lch,red,blue)) and (color:contrast-color(red)){.qs-tile[aria-pressed=true]{color:color-mix(in oklch,contrast-color(var(--qs-surface,var(--color-surface))) 60%,var(--color-primary,var(--qs-primary)))}}.qs-tile[aria-pressed=true] .qs-tile-icon{--icon-color:var(--color-primary,var(--qs-primary));--icon-color:currentColor}@supports (color:color-mix(in lch,red,blue)) and (color:contrast-color(red)){.qs-tile[aria-pressed=true] .qs-tile-icon{--icon-color:color-mix(in oklch,contrast-color(var(--qs-surface,var(--color-surface))) 60%,var(--color-primary,var(--qs-primary)))}}.qs-tile-text{color:color-mix(in oklch,contrast-color(var(--qs-surface)) 40%,var(--color-primary,var(--qs-primary)));display:flex;flex-direction:column;gap:.05rem;min-inline-size:0;overflow:hidden}.qs-tile-label{font-size:.78rem;font-weight:600}.qs-tile-label,.qs-tile-sub{color:contrast-color(var(--qs-surface));overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.qs-tile-sub{font-size:.68rem;font-weight:500;opacity:.7}.qs-sliders{border-block-start:1px solid var(--qs-outline);color:contrast-color(var(--qs-surface));display:grid;gap:.6rem;padding-block-start:.7rem}.qs-slider-row{align-items:center;cursor:default;display:flex;gap:.65rem}.qs-slider-icon{--icon-size:1.15rem;--icon-color:currentColor flex:0 0 auto;block-size:var(--icon-size);color:contrast-color(var(--qs-surface));inline-size:var(--icon-size);line-height:0}.qs-slider-col{display:flex;flex:1 1 auto;flex-direction:column;gap:.25rem;min-inline-size:0}.qs-slider-label{font-size:.68rem;font-weight:500;opacity:.75}.qs-slider{appearance:none;-webkit-appearance:none;background:transparent;block-size:1.1rem;color:contrast-color(inherit(background-color));cursor:pointer;inline-size:100%;margin:0}.qs-slider::-webkit-slider-runnable-track{background:color-mix(in oklab,var(--qs-on-surface) 18%,transparent);block-size:4px;border-radius:999px;color:contrast-color(inherit(background-color))}.qs-slider::-moz-range-track{background:color-mix(in oklab,var(--qs-on-surface) 18%,transparent);block-size:4px;border-radius:999px;color:contrast-color(inherit(background-color))}.qs-slider::-webkit-slider-thumb{appearance:none;-webkit-appearance:none;background:color-mix(in oklch,contrast-color(var(--qs-surface,var(--color-surface))) 40%,var(--color-primary,var(--qs-primary)));block-size:1rem;border:none;border-radius:50%;box-shadow:0 1px 4px rgba(0,0,0,.35);color:color-mix(in oklch,contrast-color(var(--qs-surface,var(--color-surface))) 40%,var(--color-primary,var(--qs-primary)));inline-size:1rem;margin-block-start:-6px}.qs-slider::-moz-range-thumb{background:color-mix(in oklch,contrast-color(var(--qs-surface,var(--color-surface))) 40%,var(--color-primary,var(--qs-primary)));block-size:1rem;border:none;border-radius:50%;box-shadow:0 1px 4px rgba(0,0,0,.35);color:color-mix(in oklch,contrast-color(var(--qs-surface,var(--color-surface))) 40%,var(--color-primary,var(--qs-primary)));inline-size:1rem}.qs-slider:focus-visible::-webkit-slider-thumb{background:color-mix(in oklch,contrast-color(var(--qs-surface,var(--color-surface))) 40%,var(--color-primary,var(--qs-primary)));color:color-mix(in oklch,contrast-color(var(--qs-surface,var(--color-surface))) 40%,var(--color-primary,var(--qs-primary)));outline:2px solid var(--color-primary,var(--qs-primary));outline-offset:2px}}");
var THEME_ATTR = "data-theme";
/** Minimum required key per spec; `THEME_STORAGE_KEY_DOTTED` mirrors readers that expect a dotted name. */
var THEME_STORAGE_KEY = "rs-appearance-theme";
var THEME_STORAGE_KEY_DOTTED = "appearance.theme";
/** Best-effort merge targets: patch `appearance.theme` inside any settings blob found under these keys. */
var SETTINGS_BLOB_KEYS = [
	"rs-settings",
	"cwsp-settings",
	"u2-settings"
];
var prefersDarkScheme = () => {
	try {
		return matchMedia?.("(prefers-color-scheme: dark)")?.matches ?? true;
	} catch {
		return true;
	}
};
/** Patch `.appearance.theme` into any parseable JSON settings blob under known keys (best-effort). */
var mergeThemeIntoSettingsBlobs = (mode) => {
	for (const key of SETTINGS_BLOB_KEYS) try {
		const raw = localStorage.getItem(key);
		if (!raw) continue;
		const blob = JSON.parse(raw);
		if (!blob || typeof blob !== "object") continue;
		blob.appearance = {
			...blob.appearance ?? {},
			theme: mode
		};
		localStorage.setItem(key, JSON.stringify(blob));
	} catch {}
};
/** Current theme: `data-theme` attr > stored pref > OS `prefers-color-scheme`. */
var getCurrentQuickTheme = () => {
	try {
		const attr = document.documentElement.getAttribute(THEME_ATTR);
		if (attr === "light" || attr === "dark") return attr;
		const stored = localStorage.getItem(THEME_STORAGE_KEY);
		if (stored === "light" || stored === "dark") return stored;
	} catch {}
	return prefersDarkScheme() ? "dark" : "light";
};
/**
* Apply light/dark from Quick Settings without importing app Theme.ts (fl.ui ↔ subsystem cycle).
* WHY: Must mirror `syncBrowserChromeTheme` — `data-scheme` + hosts + body — or env-shell /
* veela keep OS `prefers-color-scheme` / stale `data-scheme="auto"` and light never sticks.
*/
var applyQuickTheme = (mode) => {
	const root = document.documentElement;
	root.setAttribute("data-scheme", mode);
	root.setAttribute(THEME_ATTR, mode);
	root.style.colorScheme = mode;
	try {
		if (document.body) document.body.style.colorScheme = mode;
	} catch {}
	try {
		document.querySelectorAll(".env-shell-root, [data-shell], ui-window").forEach((node) => {
			const el = node;
			el.dataset.theme = mode;
			el.style.colorScheme = mode;
			const inner = el.shadowRoot?.querySelector?.(".app-shell");
			if (inner) {
				inner.dataset.theme = mode;
				inner.style.colorScheme = mode;
			}
		});
	} catch {}
	try {
		localStorage.setItem(THEME_STORAGE_KEY, mode);
		localStorage.setItem(THEME_STORAGE_KEY_DOTTED, mode);
	} catch {}
	mergeThemeIntoSettingsBlobs(mode);
	root.dispatchEvent(new CustomEvent("u2-theme-change", {
		bubbles: true,
		detail: {
			source: "quick-settings",
			theme: mode
		}
	}));
};
var unlockOrientationLock = (unlocked) => {
	document.documentElement.style.setProperty("--orientation-lock", unlocked ? "unlocked" : "locked");
	document.documentElement.style.setProperty("--orientation-lock-angle", unlocked ? "0deg" : "90deg");
	Promise.try(() => {
		try {
			if (unlocked) screen.orientation.unlock();
			else screen.orientation.lock(screen.orientation.type || "natural");
		} catch (error) {
			console.warn(error);
		}
	})?.catch?.(console.warn.bind(console));
};
var NIGHT_FILTER_ID = "env-night-filter";
/** Below `CHROME_FLYOUT_Z` (2147483600, ChromeFlyout.ts); above env-shell wallpaper/chrome. */
var NIGHT_FILTER_Z = "2147483001";
var NIGHT_STORAGE_KEY = "rs-night-filter";
var BRIGHTNESS_STORAGE_KEY = "rs-brightness-filter";
var clampPct = (n) => Math.max(0, Math.min(100, Number.isFinite(n) ? n : 0));
/** Ensure the single fixed overlay div used for both the night-light tint and the brightness stub filter. */
var ensureNightFilterEl = () => {
	const existing = document.getElementById(NIGHT_FILTER_ID);
	if (existing instanceof HTMLElement) return existing;
	const el = document.createElement("div");
	el.id = NIGHT_FILTER_ID;
	el.setAttribute("aria-hidden", "true");
	el.style.cssText = [
		"dynamic-range-limit:no-limit",
		"color-space:display-p3",
		"position:fixed",
		"inset:0",
		"pointer-events:none",
		`z-index:${NIGHT_FILTER_Z}`,
		"background-color:color(display-p3 1 0.55 0.24)",
		"mix-blend-mode:multiply",
		"opacity:0",
		"visibility:hidden",
		"transition:opacity 160ms ease"
	].join(";");
	(document.body ?? document.documentElement).appendChild(el);
	return el;
};
/** value: 0-100 night-light intensity mapped to overlay opacity 0-1. */
var applyNightFilter = (value) => {
	const v = clampPct(value);
	const el = ensureNightFilterEl();
	const opacity = v / 100;
	el.style.opacity = String(opacity);
	el.style.visibility = opacity >= .01 ? "visible" : "hidden";
	try {
		localStorage.setItem(NIGHT_STORAGE_KEY, String(v));
	} catch {}
};
/** value: 0-100 brightness stub; 50 == neutral (`brightness(1)`), mapped to ~0.4-1.2. */
var applyBrightnessFilter = (value) => {
	const v = clampPct(value);
	ensureNightFilterEl();
	v <= 50 ? .4 + v / 50 * .6 : 1 + (v - 50) / 50 * .2;
	try {
		localStorage.setItem(BRIGHTNESS_STORAGE_KEY, String(v));
	} catch {}
};
var readStoredFilterValue = (key, fallback) => {
	try {
		const raw = localStorage.getItem(key);
		if (raw == null) return fallback;
		const n = Number(raw);
		return Number.isFinite(n) ? clampPct(n) : fallback;
	} catch {
		return fallback;
	}
};
/** Restore persisted night/brightness filters; idempotent — safe to call on every panel open. */
var restoreQuickFilters = () => {
	const night = readStoredFilterValue(NIGHT_STORAGE_KEY, 0);
	const brightness = readStoredFilterValue(BRIGHTNESS_STORAGE_KEY, 50);
	applyNightFilter(night);
	applyBrightnessFilter(brightness);
	return {
		night,
		brightness
	};
};
if (typeof document !== "undefined") if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", () => restoreQuickFilters(), { once: true });
else restoreQuickFilters();
var PLACEHOLDER_TILE_IDS = [
	"wifi",
	"bluetooth",
	"focus",
	"airplane",
	"orientation"
];
var THEME_TILE_ICON = {
	light: "sun",
	dark: "moon"
};
var THEME_TILE_SUB = {
	light: "Light",
	dark: "Dark"
};
var syncThemeTile = (root) => {
	const tile = root.querySelector("[data-qs-tile=\"theme\"]");
	if (!tile) return;
	const mode = getCurrentQuickTheme();
	tile.querySelector("ui-icon")?.setAttribute("icon", THEME_TILE_ICON[mode]);
	const sub = tile.querySelector("[data-qs-tile-sub]");
	if (sub) sub.textContent = THEME_TILE_SUB[mode];
	tile.setAttribute("aria-pressed", mode === "dark" ? "true" : "false");
};
/** One-time wiring for a freshly-rendered panel shadow root (guarded by `data-qs-wired`). */
var wireQuickSettingsPanel = (host) => {
	const root = host.shadowRoot;
	const panel = root?.querySelector(".qs-panel");
	if (!root || !panel || panel.hasAttribute("data-qs-wired")) return;
	panel.setAttribute("data-qs-wired", "");
	syncThemeTile(root);
	root.querySelector("[data-qs-tile=\"theme\"]")?.addEventListener("click", () => {
		applyQuickTheme(getCurrentQuickTheme() === "dark" ? "light" : "dark");
		syncThemeTile(root);
	});
	const isPressed = (target) => Boolean(target?.getAttribute?.("aria-pressed")) && target?.getAttribute?.("aria-pressed") === "true";
	root.querySelector?.("[data-qs-tile=\"orientation\"]")?.addEventListener?.("click", (ev) => {
		const realTarget = MOCElement((ev?.target?.matches?.("[data-qs-tile=\"orientation\"]") ? ev?.target : ev?.target?.querySelector?.("[data-qs-tile=\"orientation\"]")) || ev?.target, "[data-qs-tile=\"orientation\"]");
		const isUnlocking = isPressed(realTarget);
		unlockOrientationLock(isUnlocking);
		const icon = realTarget?.matches?.("ui-icon") ? realTarget : realTarget?.querySelector?.("ui-icon");
		if (icon) icon.setAttribute?.("icon", !isUnlocking ? "lock" : "device-rotate");
		if (icon) icon.setAttribute?.("icon-style", "duotone");
	});
	for (const id of PLACEHOLDER_TILE_IDS) {
		const tile = root.querySelector(`[data-qs-tile="${id}"]`);
		if (!tile) continue;
		tile.addEventListener("click", () => {
			const next = tile.getAttribute("aria-pressed") !== "true";
			tile.setAttribute("aria-pressed", String(next));
			const sub = tile.querySelector("[data-qs-tile-sub]");
			if (sub) sub.textContent = next ? "On" : "Off";
		});
	}
	const { night, brightness } = restoreQuickFilters();
	const nightSlider = root.querySelector("[data-qs-slider=\"night\"]");
	const brightnessSlider = root.querySelector("[data-qs-slider=\"brightness\"]");
	if (nightSlider) {
		nightSlider.value = String(night);
		nightSlider.addEventListener("input", () => applyNightFilter(nightSlider.valueAsNumber));
	}
	if (brightnessSlider) {
		brightnessSlider.value = String(brightness);
		brightnessSlider.addEventListener("input", () => applyBrightnessFilter(brightnessSlider.valueAsNumber));
	}
};
var QuickSettings = class QuickSettings extends UIElement {
	constructor() {
		super();
	}
	styles = () => styled$4;
	render = () => H`
<div class="qs-panel" part="panel" role="menu" aria-label="Quick settings">
    <div class="qs-tiles" part="tiles" role="group" aria-label="Quick toggles">
        <button type="button" class="qs-tile qs-tile--theme" part="tile" data-qs-tile="theme" role="menuitemcheckbox" aria-pressed="false" title="Theme">
            <ui-icon class="qs-tile-icon" part="tile-icon" icon="moon" icon-style="duotone" aria-hidden="true"></ui-icon>
            <span class="qs-tile-text">
                <span class="qs-tile-label">Theme</span>
                <span class="qs-tile-sub" data-qs-tile-sub>Dark</span>
            </span>
        </button>
        <button type="button" class="qs-tile" part="tile" data-qs-tile="wifi" role="menuitemcheckbox" aria-pressed="true" title="Wi-Fi">
            <ui-icon class="qs-tile-icon" part="tile-icon" icon="wifi-high" icon-style="duotone" aria-hidden="true"></ui-icon>
            <span class="qs-tile-text">
                <span class="qs-tile-label">Wi-Fi</span>
                <span class="qs-tile-sub" data-qs-tile-sub>On</span>
            </span>
        </button>
        <button type="button" class="qs-tile" part="tile" data-qs-tile="bluetooth" role="menuitemcheckbox" aria-pressed="true" title="Bluetooth">
            <ui-icon class="qs-tile-icon" part="tile-icon" icon="bluetooth" icon-style="duotone" aria-hidden="true"></ui-icon>
            <span class="qs-tile-text">
                <span class="qs-tile-label">Bluetooth</span>
                <span class="qs-tile-sub" data-qs-tile-sub>On</span>
            </span>
        </button>
        <button type="button" class="qs-tile" part="tile" data-qs-tile="focus" role="menuitemcheckbox" aria-pressed="false" title="Focus assist">
            <ui-icon class="qs-tile-icon" part="tile-icon" icon="bell-slash" icon-style="duotone" aria-hidden="true"></ui-icon>
            <span class="qs-tile-text">
                <span class="qs-tile-label">Focus assist</span>
                <span class="qs-tile-sub" data-qs-tile-sub>Off</span>
            </span>
        </button>
        <button type="button" class="qs-tile" part="tile" data-qs-tile="airplane" role="menuitemcheckbox" aria-pressed="false" title="Airplane mode">
            <ui-icon class="qs-tile-icon" part="tile-icon" icon="airplane" icon-style="duotone" aria-hidden="true"></ui-icon>
            <span class="qs-tile-text">
                <span class="qs-tile-label">Airplane mode</span>
                <span class="qs-tile-sub" data-qs-tile-sub>Off</span>
            </span>
        </button>
        <button type="button" class="qs-tile qs-tile--orientation" part="tile" data-qs-tile="orientation" role="menuitemcheckbox" aria-pressed="true" title="Orientation lock">
            <ui-icon class="qs-tile-icon" part="tile-icon" icon="lock" icon-style="duotone" aria-hidden="true"></ui-icon>
            <span class="qs-tile-text">
                <span class="qs-tile-label">Orientation lock</span>
                <span class="qs-tile-sub" data-qs-tile-sub>On</span>
            </span>
        </button>
    </div>
    <div class="qs-sliders" part="sliders">
        <label class="qs-slider-row" part="slider-row">
            <ui-icon class="qs-slider-icon" part="slider-icon" icon="moon-stars" icon-style="duotone" aria-hidden="true"></ui-icon>
            <span class="qs-slider-col">
                <span class="qs-slider-label">Night light</span>
                <input class="qs-slider" part="slider" type="range" min="0" max="100" step="1" value="0" data-qs-slider="night" aria-label="Night light" />
            </span>
        </label>
        <label class="qs-slider-row" part="slider-row">
            <ui-icon class="qs-slider-icon" part="slider-icon" icon="sun-dim" icon-style="duotone" aria-hidden="true"></ui-icon>
            <span class="qs-slider-col">
                <span class="qs-slider-label">Brightness</span>
                <input class="qs-slider" part="slider" type="range" min="0" max="100" step="1" value="50" data-qs-slider="brightness" aria-label="Brightness" />
            </span>
        </label>
    </div>
</div>`;
	onRender() {
		super.onRender();
		wireQuickSettingsPanel(this);
		return this;
	}
	open() {
		syncThemeTile(this.shadowRoot);
		this.removeAttribute("hidden");
		this.hidden = false;
		this.setAttribute("open", "");
	}
	close() {
		this.hidden = true;
		this.setAttribute("hidden", "");
		this.removeAttribute("open");
	}
	toggle(anchor) {
		if (this.hasAttribute("open")) this.close();
		else this.open();
	}
};
QuickSettings = __decorate([defineElement("ui-quick-settings")], QuickSettings);
Promise.try(() => {
	if (typeof requestAnimationFrame === "function") requestAnimationFrame(() => {
		Promise.try(() => {
			screen?.orientation?.lock?.("natural");
		}).catch(console.warn.bind(console));
	});
}).catch(console.warn.bind(console));
//#endregion
//#region ../../modules/projects/fl.ui/src/ui/navigation/statusbar/statusbar.ts
/**
* WHY: Uses FL-UI `ui-statusbar` (left/center/right slots) — not a parallel component.
* Reactive network/battery chips are shared via {@link attachShellDeviceStatus} for the desktop taskbar.
* Overlay mode (mobile browser / fullscreen, not standalone): transparent top band, time L / icons R.
*/
var styled$3 = preloadStyle(":host(ui-statusbar){align-items:center;background:transparent;box-sizing:border-box;color:var(--env-status-fg,CanvasText);display:flex;flex-direction:row;gap:.35rem;inline-size:100%;justify-content:space-between}:host(ui-statusbar) :is(.center,.left,.right){align-items:center;background:transparent;display:flex;min-inline-size:0;padding-block-start:.5rem}:host(ui-statusbar) .left{flex:0 1 auto;justify-content:flex-start;padding-inline-start:max(1rem,env(safe-area-inset-left,0))}:host(ui-statusbar) .center{flex:1 1 auto;justify-content:center}:host(ui-statusbar) .right{flex:0 1 auto;justify-content:flex-end;margin-inline-start:auto;padding-inline-end:max(1rem,env(safe-area-inset-right,0))}@media screen and (pointer:fine) and ((min-width:768px) or (hover:hover)){:host(ui-statusbar),ui-statusbar{display:none!important}}@layer ui-statusbar{.env-ui-statusbar{backdrop-filter:blur(10px);background:color-mix(in oklch,oklch(14% .02 280deg) 82%,transparent);border-block-start:1px solid var(--wf-md-outline-variant,color-mix(in oklch,white 12%,transparent));color:contrast-color(color-mix(in oklch,oklch(14% .02 280deg) 82%,transparent));order:1;padding:.35rem .65rem calc(.35rem + env(safe-area-inset-bottom, 0))}.env-ui-statusbar__intro p{margin:.1rem 0;opacity:.92}.env-ui-statusbar__right{align-items:center;display:flex;justify-content:flex-end}.env-ui-statusbar__clock{border-radius:.35rem;color:inherit;cursor:pointer;font:600 .8125rem/1 ui-sans-serif,system-ui,sans-serif;font-variant-numeric:tabular-nums;letter-spacing:.01em;padding:.15rem .25rem;pointer-events:auto;user-select:none}.env-ui-statusbar__clock:focus-visible,.env-ui-statusbar__clock:hover{background:color-mix(in oklch,currentColor 12%,transparent);color:contrast-color(inherit(background-color));outline:none}.env-device-tray--footer{border-radius:.35rem;cursor:pointer;pointer-events:auto}.env-device-tray--footer:focus-visible,.env-device-tray--footer:hover{background:color-mix(in oklch,currentColor 12%,transparent);color:contrast-color(inherit(background-color));outline:none}.env-status-bar__tray{align-items:center;display:flex;flex-wrap:nowrap;gap:.35rem}.env-status-bar__chip{align-items:center;background:color-mix(in oklch,var(--env-status-fg,var(--wf-md-on-surface,white)) 10%,transparent);border:1px solid color-mix(in oklch,var(--env-status-fg,var(--wf-md-on-surface,white)) 18%,transparent);border-radius:999px;color:inherit;color:contrast-color(inherit(background-color));display:inline-flex;gap:.25rem;line-height:1;padding:.12rem .35rem}.env-status-bar__chip ui-icon{color:var(--env-status-fg,inherit);display:block;font-size:1.15rem;--icon-color:var(--env-status-fg,#f5f5f7)}.env-status-bar__pct{font-variant-numeric:tabular-nums;opacity:.95}.env-status-bar__meta{font-size:11px;margin:0;opacity:.88}.env-shell-chrome[data-status-overlay] .env-ui-statusbar,.env-shell-root[data-status-overlay]>.env-shell-chrome .env-ui-statusbar{align-items:center;backdrop-filter:none!important;-webkit-backdrop-filter:none!important;background:transparent!important;block-size:var(--env-status-inset-top,max(2rem,env(safe-area-inset-top,0px)));border:0!important;box-sizing:border-box;color:var(--env-status-fg,#f5f5f7);display:flex;inset-block-end:auto;inset-block-start:0;inset-inline:0;min-block-size:var(--env-status-inset-top,max(2rem,env(safe-area-inset-top,0px)));order:unset;padding:0 .75rem;pointer-events:none;position:fixed;z-index:calc(var(--env-z-shell-chrome, 2147483000) + 2)}.env-shell-chrome[data-status-overlay] :is(.env-status-bar__meta,.env-ui-statusbar__intro){display:none!important}.env-shell-chrome[data-status-overlay] .env-ui-statusbar__clock{color:var(--env-status-fg,#f5f5f7);display:block}.env-shell-chrome[data-status-overlay] :is(.env-device-tray--footer,.env-status-bar__chip){color:var(--env-status-fg,#f5f5f7)}.env-shell-chrome[data-status-overlay] .env-status-bar__chip ui-icon{--icon-color:var(--env-status-fg,#f5f5f7);color:var(--env-status-fg,#f5f5f7)}.env-shell-chrome[data-status-overlay] .env-device-tray--footer{display:flex!important}.env-shell-chrome[data-status-overlay] .env-status-bar__chip{background:transparent;border-color:transparent;padding-inline:.15rem}.env-shell-chrome[data-desktop]:not([data-status-overlay]) .env-ui-statusbar__clock,.env-shell-chrome[data-standalone] .env-ui-statusbar,.env-shell-root[data-standalone] .env-shell-chrome:not([data-desktop]) .env-ui-statusbar{display:none!important}.env-shell-root[data-env-native-task] .env-shell-chrome[data-desktop],env-shell-container[data-env-native-task] .env-shell-chrome[data-desktop]{opacity:0;pointer-events:none;visibility:hidden}}");
var StatusBar = class StatusBar extends UIElement_default {
	constructor() {
		super();
	}
	styles = () => styled$3;
	render = () => {
		return H`
<div style="background-color: transparent;" part="left"   class="left"  ><slot name="left"  ></slot></div>
        <div style="background-color: transparent;" part="center" class="center"><slot name="center"></slot></div>
        <div style="background-color: transparent;" part="right"  class="right" ><slot name="right" ></slot></div>`;
	};
};
StatusBar = __decorate([defineElement("ui-statusbar")], StatusBar);
//#endregion
//#region ../../modules/views/explorer-view/src/ts/ContextMenu.ts
/** WHY: Must sit above `.env-shell-chrome` (see environment-shell `_variables.scss` $z-shell-chrome ~2.1e9) and near `[data-env-shell-overlays]` pass-through layer. */
var CONTEXT_MENU_LAYER_Z_FALLBACK = "2147483640";
var SUBMENU_HOVER_OPEN_MS = 320;
var SUBMENU_HOVER_CLOSE_MS = 220;
var menuSession = 0;
var menuLayer = null;
var rootMenu = null;
var cleanupFns = [];
/** WHY: soft elevation must sit under the glass panel (not on the backdrop-filter host). */
var menuUnderByEl = /* @__PURE__ */ new Map();
var destroyMenuUnderShadows = () => {
	for (const shadow of menuUnderByEl.values()) try {
		shadow.destroy();
	} catch {}
	menuUnderByEl.clear();
};
var attachMenuUnderShadow = (menu) => {
	menuUnderByEl.get(menu)?.destroy();
	menuUnderByEl.set(menu, createPanelUnderShadow(menu));
};
var detachMenuUnderShadow = (menu) => {
	menuUnderByEl.get(menu)?.destroy();
	menuUnderByEl.delete(menu);
};
var submenuByDepth = /* @__PURE__ */ new Map();
var submenuAnchorByDepth = /* @__PURE__ */ new Map();
var submenuOpenTimers = /* @__PURE__ */ new Map();
var submenuCloseTimers = /* @__PURE__ */ new Map();
typeof CSS !== "undefined" && (CSS.supports("position-anchor: --cw-anchor-test") || CSS.supports("anchor-name: --cw-anchor-test"));
var IMP_CSS = "important";
/**
* WHY: Host apps load FL-UI native `button { … !important … }`; CSS files alone lose to style-attribute precedence.
* Stamping palette + transparent rows avoids “gray slab per row”.
*/
/**
* WHY: Before Settings opens, `html[data-theme]` may lag OS `prefers-color-scheme`.
* Stamp the same pin QS/Theme uses so light panels never keep dark-default white ink.
*/
function resolveContextMenuTheme() {
	const root = document.documentElement;
	const pinned = String(root.getAttribute("data-theme") || "").trim().toLowerCase();
	if (pinned === "light" || pinned === "dark") return pinned;
	const scheme = String(root.getAttribute("data-scheme") || "").trim().toLowerCase();
	if (scheme === "light" || scheme === "dark") return scheme;
	try {
		const stored = String(localStorage.getItem("rs-appearance-theme") || "").trim().toLowerCase();
		if (stored === "light" || stored === "dark") return stored;
	} catch {}
	return typeof matchMedia === "function" && matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}
function stampUnifiedContextMenuPanelChrome(menu, compact) {
	menu.style.setProperty("position", "fixed", IMP_CSS);
	menu.style.setProperty("box-sizing", "border-box", IMP_CSS);
	menu.style.setProperty("min-width", compact ? "188px" : "220px", IMP_CSS);
	menu.style.setProperty("max-width", "min(320px, calc(100vw - 24px))", IMP_CSS);
	menu.style.setProperty("padding", compact ? "0.3rem" : "0.4rem", IMP_CSS);
	menu.style.setProperty("border-radius", "14px", IMP_CSS);
	menu.style.setProperty("pointer-events", "auto", IMP_CSS);
	menu.style.setProperty("-webkit-backdrop-filter", "none", IMP_CSS);
	menu.style.setProperty("backdrop-filter", "none", IMP_CSS);
	menu.style.removeProperty("border");
	menu.style.removeProperty("background");
	menu.style.removeProperty("color");
	menu.style.removeProperty("outline");
	menu.style.removeProperty("box-shadow");
	const theme = resolveContextMenuTheme();
	menu.dataset.theme = theme;
	menu.style.setProperty("color-scheme", theme === "light" ? "light only" : "dark only", IMP_CSS);
}
function stampUnifiedContextMenuListChrome(list) {
	list.style.setProperty("list-style", "none", IMP_CSS);
	list.style.setProperty("list-style-type", "none", IMP_CSS);
	list.style.setProperty("margin", "0", IMP_CSS);
	list.style.setProperty("padding", "0", IMP_CSS);
	list.style.setProperty("display", "flex", IMP_CSS);
	list.style.setProperty("flex-direction", "column", IMP_CSS);
	list.style.setProperty("align-items", "stretch", IMP_CSS);
	list.style.setProperty("gap", "0.2rem", IMP_CSS);
	list.style.setProperty("width", "100%", IMP_CSS);
	list.style.setProperty("box-sizing", "border-box", IMP_CSS);
	list.style.setProperty("text-align", "left", IMP_CSS);
}
function stampUnifiedContextMenuLiChrome(li) {
	li.style.setProperty("list-style", "none", IMP_CSS);
	li.style.setProperty("list-style-type", "none", IMP_CSS);
	li.style.setProperty("margin", "0", IMP_CSS);
	li.style.setProperty("padding", "0", IMP_CSS);
	li.style.setProperty("width", "100%", IMP_CSS);
	li.style.setProperty("display", "block", IMP_CSS);
	li.style.setProperty("box-sizing", "border-box", IMP_CSS);
}
function stampUnifiedContextMenuRowChrome(button, danger) {
	button.style.setProperty("appearance", "none", IMP_CSS);
	button.style.setProperty("-webkit-appearance", "none", IMP_CSS);
	button.style.setProperty("box-sizing", "border-box", IMP_CSS);
	button.style.setProperty("width", "100%", IMP_CSS);
	button.style.setProperty("max-width", "100%", IMP_CSS);
	button.style.setProperty("margin", "0", IMP_CSS);
	button.style.setProperty("display", "grid", IMP_CSS);
	button.style.setProperty("grid-template-columns", "1.375rem minmax(0, 1fr) auto", IMP_CSS);
	button.style.setProperty("align-items", "center", IMP_CSS);
	button.style.setProperty("justify-items", "start", IMP_CSS);
	button.style.setProperty("gap", "0.55rem", IMP_CSS);
	button.style.setProperty("border-style", "none", IMP_CSS);
	button.style.setProperty("border-width", "0", IMP_CSS);
	button.style.setProperty("outline", "none", IMP_CSS);
	button.style.setProperty("border-radius", "10px", IMP_CSS);
	button.style.setProperty("padding", "0.5rem 0.6rem", IMP_CSS);
	button.style.setProperty("min-height", "2.35rem", IMP_CSS);
	button.style.setProperty("font-family", "inherit", IMP_CSS);
	button.style.setProperty("font-size", "0.8125rem", IMP_CSS);
	button.style.setProperty("font-weight", "400", IMP_CSS);
	button.style.setProperty("line-height", "1.25", IMP_CSS);
	button.style.setProperty("text-align", "start", IMP_CSS);
	button.style.setProperty("cursor", "pointer", IMP_CSS);
	button.style.removeProperty("background");
	button.style.removeProperty("background-color");
	button.style.removeProperty("background-image");
	button.style.setProperty("box-shadow", "none", IMP_CSS);
	button.style.setProperty("transition", "none", IMP_CSS);
	if (!danger) button.style.setProperty("color", "inherit", IMP_CSS);
	else {
		const dangerInk = resolveContextMenuTheme() === "light" ? "#9f1239" : "#fecaca";
		button.style.setProperty("color", dangerInk, IMP_CSS);
		button.style.setProperty("--cw-menu-fg", dangerInk, IMP_CSS);
		button.style.setProperty("--icon-color", dangerInk, IMP_CSS);
	}
}
var ensureStyle = () => {
	let style = document.getElementById("cw-unified-context-menu-style");
	if (!style) {
		style = document.createElement("style");
		style.id = "cw-unified-context-menu-style";
		document.head.appendChild(style);
	}
	style.textContent = `
        .cw-context-menu-layer {
            position: fixed;
            inset: 0;
            z-index: var(--cw-context-menu-layer-z, ${CONTEXT_MENU_LAYER_Z_FALLBACK});
            pointer-events: none;
        }

        .cw-context-menu {
            /* WHY: Menu mounts on body (outside .wf-demo-root) — use :root wallpaper seeds. */
            --cw-menu-seed: var(--base-color, var(--color-primary, #5a7fff));
            /*
             * Concrete ink tokens — do not rely on late --color-on-surface (white-on-cream
             * before Settings) or OS prefers-color-scheme alone (app light + OS dark).
             */
            --cw-menu-fg: --u2-color-mod(var(--cw-menu-seed), 100);
            --cw-menu-bg: --u2-color-mod(var(--cw-menu-seed), 880);
            --cw-menu-border: color-mix(in oklab, --u2-color-mod(var(--cw-menu-seed), 100) 14%, transparent);
            position: fixed;
            box-sizing: border-box;
            min-width: 220px;
            max-width: min(320px, calc(100vw - 24px));
            padding: 0.4rem;
            border-radius: 14px;
            color-scheme: dark;
            font-family: var(--cw-context-menu-font, ui-sans-serif, system-ui, sans-serif);
            border: 1px solid var(--cw-menu-border);
            background: color-mix(in oklab, var(--color-surface-container, var(--cw-menu-bg)) 94%, transparent);
            color: var(--cw-menu-fg);
            box-shadow:
                var(--elev-3, 0 14px 36px rgba(0, 0, 0, 0.45)),
                0 0 0 1px color-mix(in oklab, --u2-color-mod(var(--cw-menu-seed), 100) 8%, transparent);
            backdrop-filter: none;
            -webkit-backdrop-filter: none;
            pointer-events: auto;
            user-select: none;
        }

        .cw-context-menu-under.underlying-shadow-container,
        .cw-context-menu-under {
            pointer-events: none !important;
            overflow: visible !important;
            z-index: -1 !important;
            filter: blur(12px) saturate(1.2) !important;
        }

        .cw-context-menu-under .underlying-shadow-geometry {
            background: #000000af !important;
            border-radius: 14px;
            overflow: hidden !important;
        }

        /* App theme pin (authoritative) — before Settings sheet / OS media. */
        html[data-theme="light"] .cw-context-menu,
        .cw-context-menu[data-theme="light"] {
            color-scheme: light only;
            --cw-menu-fg: --u2-color-mod(var(--cw-menu-seed), 900);
            --cw-menu-bg: --u2-color-mod(var(--cw-menu-seed), 160);
            --cw-menu-border: color-mix(in oklab, --u2-color-mod(var(--cw-menu-seed), 900) 14%, transparent);
            border-color: var(--cw-menu-border);
            background: color-mix(in oklab, var(--color-surface-container, var(--cw-menu-bg)) 96%, transparent);
            color: var(--cw-menu-fg);
            box-shadow: var(--elev-2, 0 10px 28px rgba(15, 23, 42, 0.16));
        }

        html[data-theme="light"] .cw-context-menu-under .underlying-shadow-geometry,
        .cw-context-menu[data-theme="light"] ~ .cw-context-menu-under .underlying-shadow-geometry,
        .cw-context-menu-under:has(+ .cw-context-menu[data-theme="light"]) .underlying-shadow-geometry {
            background: #0000001f !important;
        }

        html[data-theme="dark"] .cw-context-menu,
        .cw-context-menu[data-theme="dark"] {
            color-scheme: dark only;
            --cw-menu-fg: --u2-color-mod(var(--cw-menu-seed), 100);
            --cw-menu-bg: --u2-color-mod(var(--cw-menu-seed), 880);
            --cw-menu-border: color-mix(in oklab, --u2-color-mod(var(--cw-menu-seed), 100) 14%, transparent);
            border-color: var(--cw-menu-border);
            background: color-mix(in oklab, var(--color-surface-container, var(--cw-menu-bg)) 94%, transparent);
            color: var(--cw-menu-fg);
        }

        /* Auto / no pin: follow OS. */
        @media (prefers-color-scheme: light) {
            html:not([data-theme="dark"]) .cw-context-menu:not([data-theme="dark"]) {
                color-scheme: light only;
                --cw-menu-fg: --u2-color-mod(var(--cw-menu-seed), 900);
                --cw-menu-bg: --u2-color-mod(var(--cw-menu-seed), 160);
                --cw-menu-border: color-mix(in oklab, --u2-color-mod(var(--cw-menu-seed), 900) 14%, transparent);
                border-color: var(--cw-menu-border);
                background: color-mix(in oklab, var(--color-surface-container, var(--cw-menu-bg)) 96%, transparent);
                color: var(--cw-menu-fg);
                box-shadow: var(--elev-2, 0 10px 28px rgba(15, 23, 42, 0.16));
            }

            html:not([data-theme="dark"]) .cw-context-menu-under .underlying-shadow-geometry {
                background: #0000001f !important;
            }
        }

        .cw-context-menu.cw-context-menu--compact {
            min-width: 188px;
            padding: 0.3rem;
        }

        .cw-context-menu__list {
            list-style: none !important;
            list-style-type: none !important;
            margin: 0 !important;
            padding: 0 !important;
            display: flex !important;
            flex-direction: column !important;
            align-items: stretch !important;
            gap: 0.2rem;
            width: 100%;
            box-sizing: border-box;
            text-align: left;
        }

        .cw-context-menu__list > li {
            list-style: none !important;
            list-style-type: none !important;
            margin: 0 !important;
            padding: 0 !important;
            width: 100%;
            box-sizing: border-box;
            display: block !important;
        }

        /*
         * INVARIANT: one horizontal row per item (icon | label | chevron).
         * Rows stay transparent inside the slab; FL-UI host button styling must not turn each row into its own gray chip.
         */
        button.cw-context-menu__item,
        .cw-context-menu button.cw-context-menu__item {
            appearance: none !important;
            -webkit-appearance: none !important;
            box-sizing: border-box !important;
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
            display: grid !important;
            grid-template-columns: 1.375rem minmax(0, 1fr) auto !important;
            align-items: center !important;
            justify-items: start !important;
            justify-content: start !important;
            flex-direction: row !important;
            gap: 0.55rem !important;
            border: none !important;
            border-radius: 10px !important;
            padding: 0.5rem 0.6rem !important;
            min-height: 2.35rem !important;
            font: inherit !important;
            font-size: 0.8125rem !important;
            font-weight: 400 !important;
            line-height: 1.25 !important;
            text-align: start !important;
            cursor: pointer !important;
            background: transparent !important;
            color: inherit !important;
            box-shadow: none !important;
            transition: none !important;
        }

        button.cw-context-menu__item:hover,
        .cw-context-menu button.cw-context-menu__item:hover,
        button.cw-context-menu__item:focus-visible,
        .cw-context-menu button.cw-context-menu__item:focus-visible {
            outline: none !important;
            background: color-mix(in oklab, var(--color-primary, --u2-color-mod(var(--cw-menu-seed), 550)) 16%, transparent) !important;
        }

        html[data-theme="light"] button.cw-context-menu__item:hover,
        html[data-theme="light"] .cw-context-menu button.cw-context-menu__item:hover,
        .cw-context-menu[data-theme="light"] button.cw-context-menu__item:hover,
        html[data-theme="light"] button.cw-context-menu__item:focus-visible,
        html[data-theme="light"] .cw-context-menu button.cw-context-menu__item:focus-visible,
        .cw-context-menu[data-theme="light"] button.cw-context-menu__item:focus-visible {
            background: color-mix(in oklab, var(--color-primary, --u2-color-mod(var(--cw-menu-seed), 550)) 12%, transparent) !important;
        }

        @media (prefers-color-scheme: light) {
            html:not([data-theme="dark"]) button.cw-context-menu__item:hover,
            html:not([data-theme="dark"]) .cw-context-menu button.cw-context-menu__item:hover,
            html:not([data-theme="dark"]) button.cw-context-menu__item:focus-visible,
            html:not([data-theme="dark"]) .cw-context-menu button.cw-context-menu__item:focus-visible {
                background: color-mix(in oklab, var(--color-primary, --u2-color-mod(var(--cw-menu-seed), 550)) 12%, transparent) !important;
            }
        }

        button.cw-context-menu__item[disabled],
        .cw-context-menu button.cw-context-menu__item[disabled] {
            opacity: 0.45 !important;
            cursor: default !important;
        }

        .cw-context-menu__item--danger {
            color: #fecaca !important;
            --cw-menu-fg: #fecaca !important;
            --icon-color: #fecaca !important;
        }

        html[data-theme="light"] .cw-context-menu__item--danger,
        .cw-context-menu[data-theme="light"] .cw-context-menu__item--danger {
            /* Deep rose — readable on cream/beige menu slabs. */
            color: #9f1239 !important;
            --cw-menu-fg: #9f1239 !important;
            --icon-color: #9f1239 !important;
        }

        @media (prefers-color-scheme: light) {
            html:not([data-theme="dark"]) .cw-context-menu:not([data-theme="dark"]) .cw-context-menu__item--danger {
                color: #9f1239 !important;
                --cw-menu-fg: #9f1239 !important;
                --icon-color: #9f1239 !important;
            }
        }

        .cw-context-menu__icon {
            justify-self: center !important;
            width: 1.375rem !important;
            height: 1.375rem !important;
            display: inline-flex !important;
            align-items: center !important;
            justify-content: center !important;
        }

        /*
         * WHY:
         * 1) Inherited registered icon-color can be transparent — pin --cw-menu-fg (not currentColor).
         * 2) Phosphor min-size uses min(var(--icon-size), 100%); when percentage base is cyclic/0,
         *    mask ::before collapses — lock an explicit px box matching --icon-size.
         */
        .cw-context-menu__icon ui-icon,
        .cw-context-menu__chevron ui-icon {
            flex: 0 0 auto !important;
            flex-shrink: 0 !important;
            box-sizing: border-box !important;
            width: var(--icon-size, 1.125rem) !important;
            height: var(--icon-size, 1.125rem) !important;
            min-width: var(--icon-size, 1.125rem) !important;
            min-height: var(--icon-size, 1.125rem) !important;
            min-inline-size: var(--icon-size, 1.125rem) !important;
            min-block-size: var(--icon-size, 1.125rem) !important;
            inline-size: var(--icon-size, 1.125rem) !important;
            block-size: var(--icon-size, 1.125rem) !important;
            max-inline-size: var(--icon-size, 1.125rem) !important;
            max-block-size: var(--icon-size, 1.125rem) !important;
            --icon-padding: 0px !important;
            color: var(--cw-menu-fg, inherit) !important;
            /* WHY: concrete menu fg — currentColor raced white on light panels before Settings. */
            --icon-color: var(--cw-menu-fg, --u2-color-mod(var(--cw-menu-seed), 900)) !important;
            overflow: visible !important;
            pointer-events: none !important;
        }

        .cw-context-menu__icon ui-icon {
            --icon-size: 1.125rem !important;
        }

        .cw-context-menu__label {
            justify-self: stretch !important;
            text-align: start !important;
            white-space: nowrap !important;
            overflow: hidden !important;
            text-overflow: ellipsis !important;
            min-width: 0 !important;
        }

        .cw-context-menu__chevron {
            justify-self: end !important;
            opacity: 0.72 !important;
            display: inline-flex !important;
            align-items: center !important;
            justify-content: center !important;
        }

        .cw-context-menu__chevron ui-icon {
            --icon-size: 0.85rem !important;
        }

        /* Surfaces already tokenized above from wallpaper --base-color / --color-*. */
    `;
};
/** Re-run phosphor hydration after DOM connect (helps IO-deferred raster icons). */
function refreshContextMenuUiIcons(root) {
	if (typeof customElements !== "undefined" && typeof customElements.upgrade === "function") try {
		customElements.upgrade(root);
	} catch {}
	for (const node of root.querySelectorAll("ui-icon")) {
		const el = node;
		el.style.setProperty("--icon-size", "1.125rem", IMP_CSS);
		el.style.setProperty("--icon-padding", "0px", IMP_CSS);
		el.style.setProperty("--icon-color", "var(--cw-menu-fg)", IMP_CSS);
		el.style.setProperty("color", "var(--cw-menu-fg)", IMP_CSS);
		el.style.setProperty("width", "1.125rem", IMP_CSS);
		el.style.setProperty("height", "1.125rem", IMP_CSS);
		el.style.setProperty("min-width", "1.125rem", IMP_CSS);
		el.style.setProperty("min-height", "1.125rem", IMP_CSS);
		el.style.setProperty("display", "inline-grid", IMP_CSS);
		if (typeof el.updateIcon === "function") el.updateIcon.call(node);
	}
}
function appendUiIcon(target, iconName) {
	const name = String(iconName || "").trim();
	if (!name) return;
	const el = document.createElement("ui-icon");
	el.setAttribute("icon", name);
	el.setAttribute("icon-style", "duotone");
	el.setAttribute("size", "18");
	el.setAttribute("aria-hidden", "true");
	el.style.setProperty("--icon-size", "1.125rem", IMP_CSS);
	el.style.setProperty("--icon-padding", "0px", IMP_CSS);
	el.style.setProperty("--icon-color", "var(--cw-menu-fg)", IMP_CSS);
	el.style.setProperty("color", "var(--cw-menu-fg)", IMP_CSS);
	el.style.setProperty("width", "1.125rem", IMP_CSS);
	el.style.setProperty("height", "1.125rem", IMP_CSS);
	target.append(el);
}
var clearCleanup = () => {
	for (const fn of cleanupFns) try {
		fn();
	} catch {}
	cleanupFns = [];
};
var clearTimersFromDepth = (depth) => {
	for (const [key, timer] of Array.from(submenuOpenTimers.entries())) if (key >= depth) {
		clearTimeout(timer);
		submenuOpenTimers.delete(key);
	}
	for (const [key, timer] of Array.from(submenuCloseTimers.entries())) if (key >= depth) {
		clearTimeout(timer);
		submenuCloseTimers.delete(key);
	}
};
var placeMenu = (menu, x, y) => {
	menu.style.left = `${x}px`;
	menu.style.top = `${y}px`;
	const rect = menu.getBoundingClientRect();
	const maxX = Math.max(8, window.innerWidth - rect.width - 8);
	const maxY = Math.max(8, window.innerHeight - rect.height - 8);
	menu.style.left = `${Math.min(Math.max(8, x), maxX)}px`;
	menu.style.top = `${Math.min(Math.max(8, y), maxY)}px`;
};
var closeSubmenusFromDepth = (depth) => {
	clearTimersFromDepth(depth);
	for (const [key, submenu] of Array.from(submenuByDepth.entries())) if (key >= depth) {
		detachMenuUnderShadow(submenu);
		submenu.remove();
		submenuByDepth.delete(key);
		submenuAnchorByDepth.delete(key);
	}
};
var placeSubmenuWithFallback = (submenu, anchor) => {
	const rect = anchor.getBoundingClientRect();
	placeMenu(submenu, Math.round(rect.right + 4), Math.round(rect.top));
};
var cancelScheduledCloseFromDepth = (depth) => {
	for (const [key, timer] of Array.from(submenuCloseTimers.entries())) if (key >= depth) {
		clearTimeout(timer);
		submenuCloseTimers.delete(key);
	}
};
var buildMenuElement = (entries, compact, depth, session) => {
	const menu = document.createElement("div");
	menu.className = `cw-context-menu${compact ? " cw-context-menu--compact" : ""}`;
	menu.setAttribute("role", "menu");
	menu.dataset.menuDepth = String(depth);
	menu.style.zIndex = String(depth + 1);
	const list = document.createElement("ul");
	list.className = "cw-context-menu__list";
	stampUnifiedContextMenuListChrome(list);
	menu.appendChild(list);
	const openSubmenu = (item, anchorButton, nextDepth) => {
		if (session !== menuSession || !rootMenu?.isConnected || !menuLayer?.isConnected) return;
		closeSubmenusFromDepth(nextDepth);
		if (!item.children?.length) return;
		const submenu = buildMenuElement(item.children, compact, nextDepth, session);
		submenu.classList.add("cw-context-menu--submenu");
		menuLayer.appendChild(submenu);
		submenuByDepth.set(nextDepth, submenu);
		submenuAnchorByDepth.set(nextDepth, anchorButton);
		placeSubmenuWithFallback(submenu, anchorButton);
		attachMenuUnderShadow(submenu);
	};
	const scheduleOpenSubmenu = (item, anchorButton, nextDepth) => {
		const existingOpen = submenuOpenTimers.get(nextDepth);
		if (existingOpen) clearTimeout(existingOpen);
		cancelScheduledCloseFromDepth(nextDepth);
		const timer = setTimeout(() => {
			submenuOpenTimers.delete(nextDepth);
			openSubmenu(item, anchorButton, nextDepth);
		}, SUBMENU_HOVER_OPEN_MS);
		submenuOpenTimers.set(nextDepth, timer);
	};
	const scheduleCloseSubmenuFromDepth = (nextDepth) => {
		const existingClose = submenuCloseTimers.get(nextDepth);
		if (existingClose) clearTimeout(existingClose);
		const timer = setTimeout(() => {
			submenuCloseTimers.delete(nextDepth);
			closeSubmenusFromDepth(nextDepth);
		}, SUBMENU_HOVER_CLOSE_MS);
		submenuCloseTimers.set(nextDepth, timer);
	};
	for (const item of entries) {
		const button = document.createElement("button");
		button.type = "button";
		button.className = `cw-context-menu__item${item.danger ? " cw-context-menu__item--danger" : ""}`;
		button.setAttribute("role", "menuitem");
		button.disabled = Boolean(item.disabled);
		const hasChildren = Boolean(item.children?.length);
		const iconWrap = document.createElement("span");
		iconWrap.className = "cw-context-menu__icon";
		if (item.icon) appendUiIcon(iconWrap, item.icon);
		const labelSpan = document.createElement("span");
		labelSpan.className = "cw-context-menu__label";
		labelSpan.textContent = item.label;
		const chevronWrap = document.createElement("span");
		chevronWrap.className = "cw-context-menu__chevron";
		if (hasChildren) appendUiIcon(chevronWrap, "caret-right");
		button.append(iconWrap, labelSpan, chevronWrap);
		stampUnifiedContextMenuRowChrome(button, Boolean(item.danger));
		if (hasChildren) {
			const nextDepth = depth + 1;
			button.setAttribute("aria-haspopup", "menu");
			button.addEventListener("pointerenter", () => scheduleOpenSubmenu(item, button, nextDepth));
			button.addEventListener("pointerleave", () => scheduleCloseSubmenuFromDepth(nextDepth));
			button.addEventListener("click", (event) => {
				event.preventDefault();
				event.stopPropagation();
				if (session !== menuSession || !rootMenu?.isConnected) return;
				cancelScheduledCloseFromDepth(nextDepth);
				const existing = submenuByDepth.get(nextDepth);
				const activeAnchor = submenuAnchorByDepth.get(nextDepth);
				if (existing?.isConnected && activeAnchor === button) {
					closeSubmenusFromDepth(nextDepth);
					return;
				}
				openSubmenu(item, button, nextDepth);
			});
		} else button.addEventListener("click", async (event) => {
			event.preventDefault();
			event.stopPropagation();
			if (session !== menuSession || !rootMenu?.isConnected) return;
			closeUnifiedContextMenu();
			if (item.disabled) return;
			await item.action();
		});
		const li = document.createElement("li");
		stampUnifiedContextMenuLiChrome(li);
		li.appendChild(button);
		list.appendChild(li);
	}
	stampUnifiedContextMenuPanelChrome(menu, compact);
	menu.addEventListener("pointerenter", () => cancelScheduledCloseFromDepth(depth));
	menu.addEventListener("pointerleave", () => {
		if (depth > 0) {
			const existingClose = submenuCloseTimers.get(depth);
			if (existingClose) clearTimeout(existingClose);
			const timer = setTimeout(() => {
				submenuCloseTimers.delete(depth);
				closeSubmenusFromDepth(depth);
			}, SUBMENU_HOVER_CLOSE_MS);
			submenuCloseTimers.set(depth, timer);
		}
	});
	return menu;
};
var closeUnifiedContextMenu = () => {
	clearCleanup();
	clearTimersFromDepth(0);
	closeSubmenusFromDepth(1);
	submenuByDepth.clear();
	submenuAnchorByDepth.clear();
	destroyMenuUnderShadows();
	rootMenu?.remove();
	rootMenu = null;
	menuLayer?.remove();
	menuLayer = null;
	menuSession += 1;
};
var openUnifiedContextMenu = (request) => {
	const entries = (request.items || []).filter((item) => item && item.id && item.label);
	if (!entries.length) {
		closeUnifiedContextMenu();
		return;
	}
	ensureStyle();
	closeUnifiedContextMenu();
	const session = menuSession;
	const mount = request.resolveOverlayMountPoint?.(request.anchor ?? null) ?? resolveOverlayMountPoint(request.anchor ?? null);
	const layer = document.createElement("div");
	layer.className = "cw-context-menu-layer";
	layer.style.setProperty("position", "fixed", IMP_CSS);
	layer.style.setProperty("inset", "0", IMP_CSS);
	layer.style.setProperty("z-index", CONTEXT_MENU_LAYER_Z_FALLBACK, IMP_CSS);
	layer.style.setProperty("pointer-events", "none", IMP_CSS);
	layer.style.setProperty("backdrop-filter", "none", IMP_CSS);
	layer.style.setProperty("-webkit-backdrop-filter", "none", IMP_CSS);
	menuLayer = layer;
	mount.appendChild(layer);
	const menu = buildMenuElement(entries, Boolean(request.compact), 0, session);
	rootMenu = menu;
	layer.appendChild(menu);
	placeMenu(menu, request.x, request.y);
	attachMenuUnderShadow(menu);
	const hydrateIcons = () => {
		if (session !== menuSession || !menu.isConnected) return;
		refreshContextMenuUiIcons(menu);
	};
	const whenIcon = typeof customElements !== "undefined" && customElements.whenDefined ? customElements.whenDefined("ui-icon").then(hydrateIcons).catch(() => {}) : Promise.resolve();
	queueMicrotask(() => {
		whenIcon.then(hydrateIcons);
		requestAnimationFrame(() => {
			hydrateIcons();
			requestAnimationFrame(hydrateIcons);
		});
	});
	/**
	* WHY: `menuLayer.contains(event.target)` is false for nodes inside open shadow trees (e.g. ui-icon internals).
	* That made document-capture pointerdown treat in-menu presses as "outside" → menu removed before click fires.
	*/
	const eventPathTouchesOpenMenu = (event) => {
		if (!menuLayer?.isConnected || !rootMenu) return false;
		const rawPath = typeof event.composedPath === "function" ? event.composedPath() : [];
		const path = Array.isArray(rawPath) && rawPath.length ? rawPath : [];
		for (const node of path) {
			if (!(node instanceof Element)) continue;
			if (node === menuLayer || node === rootMenu) return true;
			if (menuLayer.contains(node)) return true;
			if (node.classList?.contains?.("cw-context-menu") || node.closest?.(".cw-context-menu")) return true;
		}
		const t = event.target;
		if (t instanceof Node && menuLayer.contains(t)) return true;
		if (t instanceof Element && t.closest?.(".cw-context-menu")) return true;
		return false;
	};
	const onPointerDown = (event) => {
		if (session !== menuSession || !menuLayer?.isConnected) return;
		if (eventPathTouchesOpenMenu(event)) return;
		closeUnifiedContextMenu();
	};
	const onMenuInternalClick = (event) => {
		if (session !== menuSession || !rootMenu?.isConnected) return;
		const target = event.target;
		if (!target) return;
		let parentItem = target.closest?.(".cw-context-menu__item");
		if (!parentItem && typeof event.composedPath === "function") {
			for (const node of event.composedPath()) if (node instanceof Element && node.classList?.contains?.("cw-context-menu__item")) {
				parentItem = node;
				break;
			}
		}
		if (!parentItem) {
			closeSubmenusFromDepth(1);
			return;
		}
		if (!(parentItem.getAttribute("aria-haspopup") === "menu")) closeSubmenusFromDepth(1);
	};
	const onEscape = (event) => {
		if (session !== menuSession) return;
		if (event.key === "Escape") closeUnifiedContextMenu();
	};
	const close = () => closeUnifiedContextMenu();
	queueMicrotask(() => {
		if (session !== menuSession) return;
		document.addEventListener("pointerdown", onPointerDown, { capture: true });
		document.addEventListener("contextmenu", onPointerDown, { capture: true });
		document.addEventListener("keydown", onEscape);
		menu.addEventListener("click", onMenuInternalClick, { capture: true });
		window.addEventListener("resize", close, { passive: true });
		window.addEventListener("blur", close, { passive: true });
		cleanupFns.push(() => document.removeEventListener("pointerdown", onPointerDown, { capture: true }));
		cleanupFns.push(() => document.removeEventListener("contextmenu", onPointerDown, { capture: true }));
		cleanupFns.push(() => document.removeEventListener("keydown", onEscape));
		cleanupFns.push(() => menu.removeEventListener("click", onMenuInternalClick, { capture: true }));
		cleanupFns.push(() => window.removeEventListener("resize", close));
		cleanupFns.push(() => window.removeEventListener("blur", close));
	});
};
//#endregion
//#region ../../modules/projects/fl.ui/src/ui/navigation/taskbar/element/TaskBar.ts
var styled$2 = preloadStyle("@layer ui-taskbar{.env-shell-chrome{color:var(--wf-md-on-surface-variant,oklch(78% .03 274deg));display:flex;flex-direction:column;font:12px ui-sans-serif,system-ui,sans-serif;gap:0;inset-block-end:0;inset-inline:0;isolation:isolate;pointer-events:none;position:fixed;z-index:var(--env-z-shell-chrome,2147483000)}@supports (color:contrast-color(red)) and (color:oklab(0% 0 0%)){.env-shell-chrome{color:contrast-color(var(--wf-md-on-surface-variant,oklch(78% .03 274deg)))}}.env-shell-chrome>*{pointer-events:auto}.env-shell-taskbar{align-items:stretch;backdrop-filter:blur(22px) saturate(1.35);-webkit-backdrop-filter:blur(22px) saturate(1.35);background:color-mix(in oklab,#1a1a1a 72%,transparent);block-size:2.5rem;border-block-start:1px solid color-mix(in oklab,#fff 12%,transparent);box-shadow:none;color:#f3f3f3;color:contrast-color(color-mix(in oklab,#1a1a1a 72%,transparent));display:flex;flex-direction:row;flex-wrap:nowrap;gap:.15rem;min-block-size:2.5rem;order:0;padding:0 .25rem;padding-block-end:env(safe-area-inset-bottom,0);position:relative}.env-shell-taskbar-under,.env-shell-taskbar-under.underlying-shadow-container{overflow:visible!important;pointer-events:none!important;z-index:-1!important}.env-shell-taskbar-under .underlying-shadow-geometry{background:transparent!important;box-shadow:0 -8px 28px rgba(0,0,0,.4)!important}.env-shell-taskbar::part(taskbar){align-items:stretch;display:flex;flex:1;flex-direction:row;flex-wrap:nowrap;gap:.15rem;inline-size:100%;min-inline-size:0}.env-shell-taskbar__pins,.env-shell-taskbar__windows{align-items:stretch;display:flex;flex-direction:row;flex-wrap:nowrap;gap:0;min-inline-size:0}.env-shell-taskbar__pins{flex:0 0 auto}.env-shell-taskbar__pins [data-env-home]{backdrop-filter:blur(10px);background-color:color-mix(in oklab,var(--base-color,#1c1c1e) 10%,transparent);outline:1px solid light-dark(rgba(0,0,0,.1333333333),rgba(255,255,255,.1333333333));transform:translateY(-.5rem)}:has(ui-window:not([minimized])) .env-shell-taskbar__pins [data-env-home]{--color-surface:light-dark(--u2-color-mod(var(--base-color-neutralized),10),--u2-color-mod(var(--base-color-neutralized),980));background-color:color-mix(in oklab,var(--color-surface,#1c1c1e) 10%,transparent);color:contrast-color(var(--color-surface,#1c1c1e));--icon-color:contrast-color(var(--color-surface,#1c1c1e))}.env-shell-taskbar__windows{flex:1 1 auto;justify-content:flex-start;overflow-x:auto;scrollbar-width:thin}.env-shell-taskbar ui-task{align-self:stretch;background:transparent;border:0;border-radius:0;box-shadow:inset 0 -2px 0 transparent;color:inherit;cursor:pointer;min-block-size:100%;min-inline-size:2.75rem;opacity:1;outline:none;padding-inline:.55rem}.env-shell-taskbar ui-task:hover{background:color-mix(in oklab,#fff 10%,transparent);color:contrast-color(inherit(background-color));opacity:1}.env-shell-taskbar :is(ui-task[data-active],ui-task[data-env-active=true],ui-task[data-focus]){background:color-mix(in oklab,#fff 14%,transparent);box-shadow:inset 0 -2px 0 #60cdff;color:contrast-color(inherit(background-color));opacity:1;outline:none}.env-shell-taskbar ui-task[data-minimized]{opacity:.65}.env-shell-taskbar__tray-host{align-items:center;border-inline-start:1px solid color-mix(in oklab,#fff 12%,transparent);display:flex;flex:0 0 auto;gap:.35rem;margin-inline-start:auto;padding-inline:.35rem}.env-shell-taskbar__clock{align-items:flex-end;border-radius:.35rem;cursor:pointer;display:flex;flex-direction:column;gap:.05rem;justify-content:center;line-height:1.05;min-inline-size:4.5rem;padding-inline:.35rem .15rem;pointer-events:auto;user-select:none}.env-shell-taskbar__clock:focus-visible,.env-shell-taskbar__clock:hover{background:color-mix(in oklab,#fff 10%,transparent);color:contrast-color(inherit(background-color));outline:none}.env-device-tray--taskbar{border-radius:.35rem;cursor:pointer;pointer-events:auto}.env-device-tray--taskbar:focus-visible,.env-device-tray--taskbar:hover{background:color-mix(in oklab,#fff 10%,transparent);color:contrast-color(inherit(background-color));outline:none}.env-shell-taskbar__clock-time{color:#f3f3f3;font-size:.78rem;font-variant-numeric:tabular-nums;font-weight:600}.env-shell-taskbar__clock-date{color:color-mix(in oklab,#f3f3f3 72%,transparent);font-size:.62rem;font-weight:500;white-space:nowrap}.env-shell-chrome[data-desktop] .env-shell-taskbar ui-task::part(title){display:none!important}.env-shell-chrome[data-desktop] .env-shell-taskbar ui-task{min-inline-size:2.5rem;padding-inline:.45rem}.env-shell-chrome[data-desktop] .env-shell-taskbar ui-task::part(icon){block-size:1.35rem;inline-size:1.35rem}.env-shell-chrome[data-desktop] .env-shell-taskbar ui-task::part(glyph){block-size:1.35rem;inline-size:1.35rem}.env-shell-chrome[data-desktop] .env-shell-taskbar ui-task::part(letter){font-size:.8rem}.env-shell-chrome[data-desktop] .env-shell-taskbar ui-task[data-env-home]{display:none!important}.env-shell-chrome:not([data-desktop]) .env-shell-taskbar{display:flex;flex-direction:row;place-content:center;place-items:center;align-items:center;backdrop-filter:none;-webkit-backdrop-filter:none;background:transparent;block-size:3rem;border-block-start:none;box-shadow:none;gap:0;justify-content:center;min-block-size:3rem;padding:.15rem .75rem;padding-block-end:calc(.15rem + env(safe-area-inset-bottom, 0px));place-self:center;position:relative}.env-shell-chrome:not([data-desktop]) .env-shell-taskbar-under{display:none!important}.env-shell-chrome:not([data-desktop]) .env-shell-taskbar__pins{align-items:center;flex:0 0 auto;justify-content:center}.env-shell-chrome:not([data-desktop]) .env-shell-taskbar__pins ui-task:not([data-env-home]),.env-shell-chrome:not([data-desktop]) .env-shell-taskbar__tray-host,.env-shell-chrome:not([data-desktop]) .env-shell-taskbar__windows{display:none!important}.env-shell-chrome:not([data-desktop]) .env-shell-taskbar ui-task[data-env-home]{background:transparent;border-radius:999px;box-shadow:none;min-block-size:2.75rem;min-inline-size:2.75rem;padding:0;touch-action:manipulation;user-select:none}.env-shell-chrome:not([data-desktop]) .env-shell-taskbar ui-task[data-env-home]::part(title){display:none!important}.env-shell-chrome:not([data-desktop]) .env-shell-taskbar ui-task[data-env-home]::part(icon){block-size:1.5rem;inline-size:1.5rem}.env-shell-chrome:not([data-desktop]) .env-shell-taskbar ui-task[data-env-home]::part(glyph){block-size:1.5rem;inline-size:1.5rem;opacity:1}.env-shell-chrome:not([data-desktop]) .env-shell-taskbar ui-task[data-env-home]::part(letter){opacity:0}.env-shell-chrome:not([data-desktop]) .env-shell-taskbar :is(ui-task[data-env-home]:active,ui-task[data-env-home]:hover){background:color-mix(in oklch,#fff 10%,transparent);color:contrast-color(inherit(background-color))}.env-shell-chrome:not([data-desktop]) .env-shell-taskbar :is(ui-task[data-env-home][data-active],ui-task[data-env-home][data-env-active=true],ui-task[data-env-home][data-focus]){background:color-mix(in oklch,#fff 8%,transparent);color:contrast-color(inherit(background-color))}.env-shell-chrome:not([data-desktop]):not([data-status-overlay]) .env-ui-statusbar{display:none!important}}");
var UITaskBar = class UITaskBar extends UIElement_default {
	constructor() {
		super();
	}
	styles = () => styled$2;
	render = () => H`<div part="taskbar" class="taskbar"><slot></slot></div>`;
};
UITaskBar = __decorate([defineElement("ui-taskbar")], UITaskBar);
//#endregion
//#region ../../modules/projects/fl.ui/src/ui/navigation/taskbar/element/Task.ts
var styled$1 = preloadStyle(":host(ui-task),:host(ui-task) *{box-sizing:border-box;touch-action:manipulation;user-select:none;-webkit-user-drag:none;-webkit-tap-highlight-color:transparent;border:0 transparent;gap:0;margin:0;padding:0}:host(ui-task){align-items:center;border-radius:.5rem;box-shadow:none;cursor:pointer;display:inline-flex;filter:none;flex-direction:row;gap:.35rem;justify-content:center;min-block-size:2.25rem;min-inline-size:2.25rem;padding-block:.25rem;padding-inline:.45rem;pointer-events:auto;user-select:none}:host(ui-task)>*{pointer-events:none}:host(ui-task) .task-icon{block-size:1.25rem;display:inline-flex;inline-size:1.25rem;line-height:0;min-block-size:1.25rem;min-inline-size:1.25rem;place-content:center;place-items:center;position:relative}:host(ui-task) .task-letter{color:currentColor;display:grid;font-size:.72rem;font-weight:700;inset:0;letter-spacing:0;line-height:1;opacity:.92;place-content:center;place-items:center;pointer-events:none;position:absolute;user-select:none;z-index:0}:host(ui-task) .task-icon-glyph{block-size:100%;color:currentColor;inline-size:100%;min-block-size:1rem;min-inline-size:1rem;position:relative;z-index:1}:host(ui-task) .task-icon:has(ui-icon[icon]:not([icon=\"\"])) .task-letter{opacity:.35}:host(ui-task) .task-icon:has(ui-icon[icon]:not([icon=\"\"]):not([icon=app-window])) .task-letter{opacity:0}:host(ui-task) .task-title{font-size:.75rem;font-weight:500;line-height:1.2;max-inline-size:8rem;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}:host(ui-task:hover){--background-tone-shift:0.1;background-color:--c2-surface(var(--background-tone-shift,0),var(--current));color:contrast-color(var(--background-tone-shift,0),var(--current))}:host(ui-task[data-focus]){border-block-end-color:--c2-on-surface(0,var(--current))!important}:host(ui-task:not([data-active])){opacity:.6}");
/** First letter for blank-glyph fallback — never String(undefined)→"U". */
var titleLetter = (title) => {
	let s = "";
	if (typeof title === "string") s = title;
	else if (title != null && typeof title === "object" && "value" in title) {
		const v = title.value;
		s = v == null ? "" : String(v);
	} else if (title != null && typeof title !== "object") s = String(title);
	if (!s || s === "undefined" || s === "null" || s === "[object Object]") s = "";
	const ch = s.trim().charAt(0);
	return ch ? ch.toUpperCase() : "?";
};
var attrString = (el, name, fallback) => {
	const raw = el.getAttribute(name);
	if (raw != null && String(raw).trim()) return String(raw).trim();
	return fallback;
};
var UITask = class UITask extends UIElement_default {
	title;
	icon;
	constructor() {
		super();
	}
	styles = () => styled$1;
	render = function() {
		const titleText = attrString(this, "title", "Task");
		const iconName = attrString(this, "icon", "app-window");
		const letter = titleLetter(titleText);
		return H`
            <div part="icon" class="task-icon c2-contrast c2-transparent" data-letter=${letter}>
                <span class="task-letter" part="letter" aria-hidden="true">${letter}</span>
                <ui-icon class="c2-contrast c2-transparent task-icon-glyph" part="glyph" icon=${iconName} icon-style="duotone"></ui-icon>
            </div>
            <div part="title" class="task-title c2-contrast c2-transparent">${titleText}</div>
        `;
	};
};
__decorate([property({ source: "attr" })], UITask.prototype, "title", void 0);
__decorate([property({ source: "attr" })], UITask.prototype, "icon", void 0);
UITask = __decorate([defineElement("ui-task")], UITask);
//#endregion
//#region ../../modules/projects/fl.ui/src/ui/navigation/appearance/Desktop.ts
preloadStyle("ui-taskbar[data-type=desktop]>ui-task[data-focus]{background:--c2-surface(0,var(--current));color:--c2-on-surface(0,var(--current))}@supports (color:contrast-color(red)){ui-taskbar[data-type=desktop]>ui-task[data-focus]{color:contrast-color(var(--c2-surface(0,var(--current))))}}:host(ui-taskbar[data-type=desktop]) ::slotted(ui-task[data-focus]){background:--c2-surface(0,var(--current));color:--c2-on-surface(0,var(--current))}@supports (color:contrast-color(red)){:host(ui-taskbar[data-type=desktop]) ::slotted(ui-task[data-focus]){color:contrast-color(var(--c2-surface(0,var(--current))))}}");
//#endregion
//#region ../../modules/projects/fl.ui/src/ui/navigation/appearance/Mobile.ts
preloadStyle("ui-taskbar[data-type=mobile]>ui-task[data-focus]{background:--c2-surface(0,var(--current));color:--c2-on-surface(0,var(--current))}@supports (color:contrast-color(red)){ui-taskbar[data-type=mobile]>ui-task[data-focus]{color:contrast-color(var(--c2-surface(0,var(--current))))}}:host(ui-taskbar[data-type=mobile]) ::slotted(ui-task[data-focus]){background:--c2-surface(0,var(--current));color:--c2-on-surface(0,var(--current))}@supports (color:contrast-color(red)){:host(ui-taskbar[data-type=mobile]) ::slotted(ui-task[data-focus]){color:contrast-color(var(--c2-surface(0,var(--current))))}}");
//#endregion
//#region ../../modules/projects/fl.ui/src/ui/containers/window/native-window-chrome.ts
function readWco() {
	try {
		return globalThis.navigator?.windowControlsOverlay ?? null;
	} catch {
		return null;
	}
}
function matchDisplayMode() {
	if (typeof globalThis.matchMedia !== "function") return "unknown";
	try {
		if (globalThis.matchMedia("(display-mode: window-controls-overlay)").matches) return "window-controls-overlay";
		if (globalThis.matchMedia("(display-mode: fullscreen)").matches) return "fullscreen";
		if (globalThis.matchMedia("(display-mode: standalone)").matches) return "standalone";
		if (globalThis.matchMedia("(display-mode: minimal-ui)").matches) return "minimal-ui";
		if (globalThis.matchMedia("(display-mode: browser)").matches) return "browser";
	} catch {}
	return "unknown";
}
function readTitlebarRect(wco) {
	if (!wco?.visible || typeof wco.getTitlebarAreaRect !== "function") return null;
	try {
		const r = wco.getTitlebarAreaRect();
		if (!r) return null;
		return {
			x: r.x,
			y: r.y,
			width: r.width,
			height: r.height
		};
	} catch {
		return null;
	}
}
/**
* Snapshot of native chrome capability for a host that requested `native-mode`.
*/
function probeNativeWindowChrome(requested) {
	const wco = readWco();
	const wcoVisible = Boolean(wco?.visible);
	const displayMode = matchDisplayMode();
	const isStandaloneLike = wcoVisible || displayMode === "standalone" || displayMode === "fullscreen" || displayMode === "window-controls-overlay" || displayMode === "minimal-ui";
	let surface = "off";
	if (requested) if (wcoVisible) surface = "wco";
	else if (isStandaloneLike) surface = "standalone";
	else surface = "fallback";
	return {
		requested,
		wcoVisible,
		displayMode,
		titlebarRect: readTitlebarRect(wco),
		isStandaloneLike,
		surface
	};
}
/**
* Subscribe to WCO + display-mode changes. Returns dispose.
*/
function subscribeNativeWindowChrome(options) {
	const emit = () => {
		options.onChange(probeNativeWindowChrome(options.getRequested()));
	};
	const mqs = [];
	if (typeof globalThis.matchMedia === "function") for (const q of [
		"(display-mode: window-controls-overlay)",
		"(display-mode: standalone)",
		"(display-mode: fullscreen)",
		"(display-mode: minimal-ui)",
		"(display-mode: browser)"
	]) try {
		mqs.push(globalThis.matchMedia(q));
	} catch {}
	const onMq = () => emit();
	for (const mq of mqs) try {
		mq.addEventListener?.("change", onMq);
	} catch {
		try {
			mq.addListener?.(onMq);
		} catch {}
	}
	const wco = readWco();
	const onGeo = () => emit();
	try {
		wco?.addEventListener?.("geometrychange", onGeo);
	} catch {}
	queueMicrotask(emit);
	return () => {
		for (const mq of mqs) try {
			mq.removeEventListener?.("change", onMq);
		} catch {
			try {
				mq.removeListener?.(onMq);
			} catch {}
		}
		try {
			wco?.removeEventListener?.("geometrychange", onGeo);
		} catch {}
	};
}
//#endregion
//#region ../../modules/projects/fl.ui/src/ui/containers/window/native-theme-color.ts
/**
* WHY: Installed PWA / Window Controls Overlay paints the OS title strip from
* `<meta name="theme-color">`. While a managed `ui-window` is in native-mode
* (or fills the viewport), that meta must match **this window's** `.title-handler`.
*
* INVARIANT: while owned, this module owns `meta[name=theme-color]`
* (see `isNativeThemeColorOwned`). DynamicEngine must not overwrite with
* wallpaper / ambient `elementsFromPoint` samples.
*
* AI-READ: Never sample via `elementsFromPoint` — when the titlebar is thin or
* WCO-padded, hits fall through to the env wallpaper canvas.
*/
var themeColorBeforeNative = null;
var themeAttrWatch = null;
var metaContentWatch = null;
var resyncTimers = [];
var ownedNativeHost = null;
var applyGeneration = 0;
/** Last hex we intentionally wrote — used to fight ambient overwrites. */
var lastAppliedHex = null;
/** Warm light surface — matches `index.html` default (not VS Code blue). */
var FALLBACK_WARM = "#cbb8a4";
var OWNER_KEY = "__CWSP_NATIVE_THEME_COLOR_OWNED__";
/** VS Code / Chromium-default blues that must never stick under WCO. */
var isForbiddenThemeColor = (raw) => {
	const t = String(raw || "").trim().toLowerCase();
	if (!t) return false;
	if (t === "#007acc" || t === "#007accff") return true;
	if (t === "#36c" || t === "#3366cc") return true;
	const m = t.match(/^rgba?\(\s*([\d.]+)\s*[, ]\s*([\d.]+)\s*[, ]\s*([\d.]+)/i);
	if (m && (t?.startsWith?.("#") || t?.startsWith?.("rgb"))) {
		const r = Math.round(Number(m[1]));
		const g = Math.round(Number(m[2]));
		const b = Math.round(Number(m[3]));
		if (r <= 20 && g >= 100 && g <= 140 && b >= 180 && b <= 220) return true;
	}
	return false;
};
/** True while a native immersive window drives theme-color. */
var isNativeThemeColorOwned = () => {
	try {
		return Boolean(globalThis?.[OWNER_KEY]);
	} catch {
		return false;
	}
};
var setOwned = (host) => {
	ownedNativeHost = host;
	try {
		globalThis[OWNER_KEY] = Boolean(host);
	} catch {}
};
/** True when a window chrome fills the viewport top (native or maximized). */
var isViewportCoveringWindow = (host) => {
	if (!host || !host.isConnected || host.hasAttribute("minimized")) return false;
	if (host.hasAttribute("native-mode")) return true;
	const maxed = host.hasAttribute("maximized") || host.hasAttribute("data-desk-max") || host.hasAttribute("data-mobile-max") || host.hasAttribute("data-native-active");
	if (!maxed) return false;
	try {
		const r = host.getBoundingClientRect();
		const vw = Math.max(1, globalThis.innerWidth || 1);
		const vh = Math.max(1, globalThis.innerHeight || 1);
		return r.top <= 8 && r.left <= 8 && r.width >= vw * .92 && r.height >= vh * .85;
	} catch {
		return maxed;
	}
};
/** Prefer focused/native covering window for theme-color ownership. */
var findThemeColorOwnerWindow = () => {
	if (typeof document === "undefined") return null;
	if (ownedNativeHost?.isConnected && isViewportCoveringWindow(ownedNativeHost)) return ownedNativeHost;
	const natives = Array.from(document.querySelectorAll("ui-window[native-mode]:not([minimized])"));
	if (natives.length) return natives[natives.length - 1];
	const candidates = Array.from(document.querySelectorAll("ui-window[data-desk-max]:not([minimized]), ui-window[maximized]:not([minimized]), ui-window[data-mobile-max]:not([minimized])"));
	for (let i = candidates.length - 1; i >= 0; i--) {
		const el = candidates[i];
		if (isViewportCoveringWindow(el)) return el;
	}
	return null;
};
var ensureThemeAttrWatch = () => {
	if (themeAttrWatch || typeof MutationObserver === "undefined" || typeof document === "undefined") return;
	themeAttrWatch = new MutationObserver(() => {
		const host = findThemeColorOwnerWindow();
		if (host?.isConnected) syncThemeColorFromNativeWindow(host);
		else syncAmbientThemeColor();
	});
	themeAttrWatch.observe(document.documentElement, {
		attributes: true,
		attributeFilter: [
			"data-theme",
			"class",
			"style",
			"color-scheme"
		]
	});
};
/** Fight DynamicEngine / wallpaper ambient writers while we own the meta. */
var ensureMetaContentWatch = (meta) => {
	if (metaContentWatch || typeof MutationObserver === "undefined") return;
	metaContentWatch = new MutationObserver(() => {
		if (!isNativeThemeColorOwned()) return;
		const cur = (meta.getAttribute("content") || "").toLowerCase();
		const expected = (lastAppliedHex || "").toLowerCase();
		if (expected && cur === expected && !isForbiddenThemeColor(cur)) return;
		const host = findThemeColorOwnerWindow();
		if (host) syncThemeColorFromNativeWindow(host);
		else if (isForbiddenThemeColor(cur)) applyMetaHex(FALLBACK_WARM, true);
	});
	metaContentWatch.observe(meta, {
		attributes: true,
		attributeFilter: ["content"]
	});
};
/** Resolve any CSS color (oklch / color-mix / var-resolved) to opaque #rrggbb via canvas. */
var resolveCssColorToHex = (css) => {
	return css;
};
var ensureThemeColorMeta = () => {
	if (typeof document === "undefined") return null;
	let meta = document.querySelector("meta[data-theme-color]") || document.querySelector("meta[name=\"theme-color\"]");
	if (!meta) {
		meta = document.createElement("meta");
		meta.setAttribute("name", "theme-color");
		meta.setAttribute("data-theme-color", "");
		document.head?.appendChild(meta);
	}
	try {
		const all = Array.from(document.querySelectorAll("meta[name=\"theme-color\"]"));
		for (const extra of all) {
			if (extra === meta) continue;
			extra.remove();
		}
	} catch {}
	ensureMetaContentWatch(meta);
	return meta;
};
var paintVarOnHost = (host, cssBackground) => {
	try {
		const probe = document.createElement("div");
		probe.setAttribute("data-theme-color-probe", "true");
		probe.style.cssText = `position:fixed;left:-8px;top:-8px;inline-size:4px;block-size:4px;pointer-events:none;opacity:0;background:${cssBackground}`;
		host.appendChild(probe);
		const hex = resolveCssColorToHex(getComputedStyle(probe).backgroundColor);
		probe.remove();
		return hex;
	} catch {
		return null;
	}
};
/**
* Sample the window titlebar — CSS only.
* WHY: never `elementsFromPoint` — hits fall through to wallpaper under WCO / thin bars.
*/
var sampleTitlebarHex = (host) => {
	const title = host.shadowRoot?.querySelector(".title-handler");
	if (title) {
		const fromProbe = paintVarOnHost(title, "var(--ui-win-titlebar-bg, var(--color-surface-container, Canvas))");
		if (fromProbe) return fromProbe;
		const fromTitle = resolveCssColorToHex(getComputedStyle(title).backgroundColor);
		if (fromTitle) return fromTitle;
	}
	const cs = getComputedStyle(host);
	for (const prop of [
		"--ui-win-titlebar-bg",
		"--color-surface-container",
		"--color-surface"
	]) {
		const painted = paintVarOnHost(host, `var(${prop})`);
		if (painted) return painted;
		const raw = cs.getPropertyValue(prop).trim();
		if (!raw) continue;
		const viaCanvas = resolveCssColorToHex(raw);
		if (viaCanvas) return viaCanvas;
	}
	const rootCs = getComputedStyle(document.documentElement);
	for (const prop of [
		"--color-surface-container",
		"--color-surface",
		"--color-surface-container-low"
	]) {
		const hex = paintVarOnHost(document.documentElement, `var(${prop})`) || resolveCssColorToHex(rootCs.getPropertyValue(prop).trim());
		if (hex) return hex;
	}
	return null;
};
var applyMetaHex = (hex, forceReinsert = false) => {
	const meta = ensureThemeColorMeta();
	if (!meta || !hex) return;
	let next = hex.toLowerCase();
	if (isForbiddenThemeColor(next)) next = FALLBACK_WARM;
	const prev = (meta.getAttribute("content") || "").toLowerCase();
	if (prev === next && !forceReinsert && !isForbiddenThemeColor(prev)) return;
	meta.setAttribute("content", next);
	meta.setAttribute("data-theme-color", "");
	meta.removeAttribute("media");
	lastAppliedHex = next;
	if (forceReinsert || prev !== next || isForbiddenThemeColor(prev)) try {
		const parent = meta.parentNode || document.head;
		parent?.removeChild(meta);
		parent?.appendChild(meta);
	} catch {}
};
/** Sample page surface for ambient WCO (desktop with no covering window). */
var syncAmbientThemeColor = () => {
	if (typeof document === "undefined") return;
	if (findThemeColorOwnerWindow()) return;
	setOwned(null);
	lastAppliedHex = null;
	const meta = ensureThemeColorMeta();
	if (!meta) return;
	const root = document.documentElement;
	const cs = getComputedStyle(root);
	const bodyCs = document.body ? getComputedStyle(document.body) : null;
	const hex = resolveCssColorToHex(cs.getPropertyValue("--color-surface-container").trim()) || resolveCssColorToHex(cs.getPropertyValue("--color-surface").trim()) || resolveCssColorToHex(cs.getPropertyValue("--ui-win-titlebar-bg").trim()) || (bodyCs ? resolveCssColorToHex(bodyCs.backgroundColor) : null) || resolveCssColorToHex(cs.backgroundColor);
	if (hex) applyMetaHex(hex);
	else if (isForbiddenThemeColor(String(meta.getAttribute("content") || ""))) applyMetaHex(FALLBACK_WARM, true);
	ensureThemeAttrWatch();
};
var isMaxChrome = (host) => host.hasAttribute("maximized") || host.hasAttribute("data-desk-max") || host.hasAttribute("data-mobile-max") || host.hasAttribute("data-native-active");
/** Push **this** window's titlebar fill into meta theme-color (native or viewport-covering). */
var syncThemeColorFromNativeWindow = (host) => {
	if (!host || typeof document === "undefined") return;
	if (host.hasAttribute("minimized")) return;
	if (!host.hasAttribute("native-mode") && !isMaxChrome(host) && !isViewportCoveringWindow(host)) return;
	const meta = ensureThemeColorMeta();
	if (!meta) return;
	if (themeColorBeforeNative == null) {
		const prev = meta.getAttribute("content") || "";
		themeColorBeforeNative = isForbiddenThemeColor(prev) ? "" : prev;
	}
	setOwned(host);
	if (isForbiddenThemeColor(String(meta.getAttribute("content") || ""))) applyMetaHex(FALLBACK_WARM, true);
	const gen = ++applyGeneration;
	const apply = (force = false) => {
		if (gen !== applyGeneration) return;
		if (!host.isConnected) return;
		if (!host.hasAttribute("native-mode") && !isMaxChrome(host) && !isViewportCoveringWindow(host)) return;
		applyMetaHex(sampleTitlebarHex(host) || FALLBACK_WARM, force);
	};
	apply(true);
	requestAnimationFrame(() => {
		apply(false);
		requestAnimationFrame(() => apply(true));
	});
	for (const t of resyncTimers) clearTimeout(t);
	resyncTimers = [];
	resyncTimers.push(setTimeout(() => apply(true), 50), setTimeout(() => apply(true), 160), setTimeout(() => apply(true), 400));
	ensureThemeAttrWatch();
};
/**
* Restore ambient theme-color when no covering/native windows remain.
* If another owner window is still up, re-sample from that host.
*/
var restoreThemeColorAfterNativeWindow = (exitingHost) => {
	if (typeof document === "undefined") return;
	if (!document.querySelector("meta[name=\"theme-color\"]")) return;
	const other = findThemeColorOwnerWindow();
	if (other && other !== exitingHost) {
		syncThemeColorFromNativeWindow(other);
		return;
	}
	const peers = Array.from(document.querySelectorAll("ui-window[native-mode]:not([minimized]), ui-window[data-desk-max]:not([minimized]), ui-window[maximized]:not([minimized]), ui-window[data-mobile-max]:not([minimized])")).filter((el) => el !== exitingHost && isViewportCoveringWindow(el));
	if (peers.length) {
		syncThemeColorFromNativeWindow(peers[peers.length - 1]);
		return;
	}
	setOwned(null);
	lastAppliedHex = null;
	applyGeneration += 1;
	for (const t of resyncTimers) clearTimeout(t);
	resyncTimers = [];
	if (themeColorBeforeNative != null && themeColorBeforeNative && !isForbiddenThemeColor(themeColorBeforeNative)) {
		applyMetaHex(themeColorBeforeNative, true);
		themeColorBeforeNative = null;
	} else {
		themeColorBeforeNative = null;
		syncAmbientThemeColor();
	}
};
if (typeof document !== "undefined") queueMicrotask(() => {
	try {
		syncAmbientThemeColor();
	} catch {}
});
//#endregion
//#region ../../modules/projects/fl.ui/src/ui/containers/window/Windows2.ts
var styled = preloadStyle("@function --u2-color-mod(--base-color <color>, --index <number> : 550) returns <color>{--i:clamp(0,var(--index),1000);--pivot:550;--white-distance:clamp(0,calc((var(--pivot) - var(--i)) / var(--pivot)),1);--black-distance:clamp(0,calc((var(--i) - var(--pivot)) / (1000 - var(--pivot))),1);--to-white:pow(var(--white-distance),1.15);--to-black:pow(var(--black-distance),1.08);--center-left:clamp(0,calc(var(--i) / var(--pivot)),1);--center-right:clamp(0,calc((1000 - var(--i)) / (1000 - var(--pivot))),1);--chroma-shape:sqrt(min(var(--center-left),var(--center-right)));--chroma-scale:calc(0.08 + 0.92 * var(--chroma-shape));result:oklch(from var(--base-color) calc(l + (.985 - l) * var(--to-white) + (.16 - l) * var(--to-black)) calc(c * var(--chroma-scale)) h)}:host(ui-window){--ui-win-radius:0.75rem;--ui-win-titlebar-height:2.5rem;--ui-win-footer-min:2.25rem;--ui-win-control-size:1.75rem;--ui-win-icon-size:0.95rem;--ui-win-gap:0.5rem;--ui-win-pad-inline:0.75rem;--ui-win-pad-block:0.65rem;--ui-win-seed:var(--base-color,var(--color-primary,#5a7fff));--ui-win-bg:var(--color-surface,light-dark(--u2-color-mod(var(--ui-win-seed),70),--u2-color-mod(var(--ui-win-seed),930)));--ui-win-fg:var(--color-on-surface,light-dark(--u2-color-mod(var(--ui-win-seed),900),--u2-color-mod(var(--ui-win-seed),100)));--ui-win-muted:var(--color-on-surface-variant,light-dark(--u2-color-mod(var(--ui-win-seed),700),--u2-color-mod(var(--ui-win-seed),280)));--ui-win-border:color-mix(in oklab,var(--ui-win-fg) 12%,transparent);--ui-win-titlebar-bg:var(--color-surface-container,light-dark(--u2-color-mod(var(--ui-win-seed),20),--u2-color-mod(var(--ui-win-seed),980)));--ui-win-content-bg:var(--color-surface-container-lowest,light-dark(--u2-color-mod(var(--ui-win-seed),40),--u2-color-mod(var(--ui-win-seed),950)));--ui-win-footer-bg:var(--color-surface-container-low,light-dark(--u2-color-mod(var(--ui-win-seed),120),--u2-color-mod(var(--ui-win-seed),900)));--ui-win-shadow:light-dark(0 18px 40px -18px rgb(15 23 42/0.28),0 22px 48px -16px rgb(0 0 0/0.55));--ui-win-control-bg:transparent;--ui-win-control-bg-hover:color-mix(in oklab,var(--ui-win-fg) 14%,transparent);--ui-win-control-fg:var(--ui-win-fg);--ui-win-close-bg:transparent;--ui-win-close-bg-hover:light-dark(--u2-color-mod(#ef4444,550),--u2-color-mod(#ef4444,480));--ui-win-close-fg:var(--ui-win-fg);--ui-win-close-fg-hover:--u2-color-mod(var(--ui-win-seed),40);--icon-color:var(--ui-win-fg);--icon-size:var(--ui-win-icon-size);block-size:var(--ui-win-height,min(22rem,70vh));border-radius:var(--ui-win-radius);box-shadow:var(--ui-win-shadow);box-sizing:border-box;color:var(--ui-win-fg);color-scheme:inherit;contain:layout paint style;display:block;font-family:InterVariable,Inter,Segoe UI,ui-sans-serif,system-ui,sans-serif;font-size:.875rem;inline-size:var(--ui-win-width,min(32rem,92vw));isolation:isolate;line-height:1.35;min-block-size:10rem;min-inline-size:16rem;overflow:hidden;position:relative}:host(ui-window),:host(ui-window) *,:host(ui-window) :after,:host(ui-window) :before{box-sizing:border-box}:host(ui-window) :where(.footer-handler:empty,.footer-handler:not(:has-slotted)){display:none!important}:host(ui-window.theme-light),:host(ui-window[data-theme=light]){color-scheme:light}:host(ui-window.theme-dark),:host(ui-window[data-theme=dark]){color-scheme:dark}:host(ui-window[managed]){position:absolute;transform:none!important}:host(ui-window[managed][data-focused]){box-shadow:var(--ui-win-shadow),0 0 0 1px color-mix(in oklab,var(--ui-win-fg) 22%,transparent)}:host(ui-window[data-native-active]) .content-handler,:host(ui-window[managed]) .content-handler,:host(ui-window[native-mode]) .content-handler{display:flex;flex-direction:column;overflow:hidden;padding:0}:host(ui-window[data-native-active]) .content-handler ::slotted(*),:host(ui-window[managed]) .content-handler ::slotted(*),:host(ui-window[native-mode]) .content-handler ::slotted(*){block-size:100%;flex:1 1 auto;inline-size:100%;max-inline-size:none;min-block-size:0;min-inline-size:0}:host(ui-window[maximized]){--ui-win-radius:0;block-size:100%!important;border-radius:0;inline-size:100%!important;inset:0!important;transform:none!important}:host(ui-window[data-mobile-max]){--ui-win-radius:0;--ui-win-titlebar-height:var(--env-status-inset-top,max(2rem,env(safe-area-inset-top,0px)));block-size:calc(100% - var(--env-mobile-dock-reserve))!important;border-radius:0;inline-size:100%!important;inset:0;transform:none!important}@media screen and (pointer:fine) and ((min-width:480px) or (hover:hover)){:host(ui-window[data-mobile-max]){inset:0 0 var(--env-mobile-dock-reserve,0) 0!important}}@media screen and (pointer:coarse) and (hover:none){:host(ui-window[data-mobile-max]){block-size:stretch!important}}:host(ui-window[data-mobile-max]) :is(.title-close,.title-exit-native,.title-maximize,.title-minimize){display:none!important}:host(ui-window[data-mobile-max]) .title-handler{background:transparent;border-block-end:0;cursor:default;min-block-size:var(--ui-win-titlebar-height);padding-block:0;pointer-events:none}:host(ui-window[data-mobile-max]) :is(.title-handler-actions,.title-handler-buttons,.title-handler-main){display:none!important}:host(ui-window[data-no-titlebar]){--ui-win-titlebar-height:0px}:host(ui-window[data-no-titlebar]) .title-handler{display:none!important}:host(ui-window[data-status-gap]:not([data-no-titlebar])){--ui-win-titlebar-height:var(--env-status-inset-top,max(2rem,env(safe-area-inset-top,0px)))}:host(ui-window[data-status-gap]:not([data-no-titlebar])) .title-handler{background:transparent;border-block-end:0;cursor:default;min-block-size:var(--ui-win-titlebar-height);padding-block:0;pointer-events:none}:host(ui-window[data-status-gap]:not([data-no-titlebar])) :is(.title-handler-actions,.title-handler-buttons,.title-handler-main){display:none!important}:host(ui-window[data-desk-max]){--ui-win-radius:0;block-size:calc(100% - var(--ui-win-titlebar-height))!important;border-radius:0;inline-size:auto!important;inset:0!important;transform:none!important}@media screen and (pointer:coarse) and (hover:none){:host(ui-window[data-desk-max]){block-size:stretch!important}}:host(ui-window[minimized]){block-size:var(--ui-win-titlebar-height)!important;min-block-size:var(--ui-win-titlebar-height)}:host(ui-window[minimized]) :is(.content-handler,.footer-handler,.window-resizer){display:none}:host(ui-window[hidden-window]){pointer-events:none!important;visibility:hidden!important}:host(ui-window[data-desk-max]) .window-resizer,:host(ui-window[data-mobile-max]) .window-resizer,:host(ui-window[data-native-active]) .window-resizer,:host(ui-window[maximized]) .window-resizer{display:none}:host(ui-window[data-native-active]),:host(ui-window[native-mode]){--ui-win-radius:0;block-size:100%!important;border-radius:0;box-shadow:none;inline-size:100%!important;inset:0!important;max-block-size:none;max-inline-size:none;position:fixed!important;transform:none!important;z-index:4}:host(ui-window[data-native-standalone]) .title-handler,:host(ui-window[data-native-wco]) .title-handler{window-drag:move;app-region:drag;-webkit-app-region:drag;cursor:default;min-block-size:max(var(--ui-win-titlebar-height),env(titlebar-area-height,var(--ui-win-titlebar-area-height,0px)),env(safe-area-inset-top,0px) + 1.75rem);padding-block-start:max(env(safe-area-inset-top,0px),env(titlebar-area-y,0px));padding-inline-end:max(env(safe-area-inset-right,0px),max(0px,100vi - env(titlebar-area-x,0px) - env(titlebar-area-width,100vi)),var(--ui-win-pad-inline));padding-inline-start:max(env(safe-area-inset-left,0px),env(titlebar-area-x,var(--ui-win-titlebar-area-x,0px)),var(--ui-win-pad-inline))}:host(ui-window[data-native-standalone]) .title-handler-actions,:host(ui-window[data-native-standalone]) .title-handler-buttons,:host(ui-window[data-native-standalone]) .title-handler-buttons button,:host(ui-window[data-native-wco]) .title-handler-actions,:host(ui-window[data-native-wco]) .title-handler-buttons,:host(ui-window[data-native-wco]) .title-handler-buttons button{window-drag:none;app-region:no-drag;-webkit-app-region:no-drag}:host(ui-window[data-native-wco]) :is(.title-close,.title-exit-native,.title-maximize,.title-minimize){display:none!important}:host(ui-window[data-native-standalone]) :is(.title-close,.title-maximize,.title-minimize){display:none!important}:host(ui-window[data-native-active]) :where(.footer-handler:empty,.footer-handler:not(:has-slotted)){display:none!important}.title-exit-native,.title-exit-native[hidden]{display:none!important}:host(ui-window[data-native-standalone]) .title-exit-native:not([hidden]){display:inline-flex!important}.window-container{background:var(--ui-win-bg);block-size:100%;border:1px solid var(--ui-win-border);border-radius:inherit;color:var(--ui-win-fg);display:grid;grid-template-areas:\"title\" \"content\" \"footer\";grid-template-rows:minmax(0,max-content) minmax(0,1fr) minmax(0,max-content);inline-size:100%;isolation:isolate;overflow:hidden}.title-handler{align-items:center;background:var(--ui-win-titlebar-bg);border-block-end:1px solid var(--ui-win-border);cursor:grab;display:grid;gap:var(--ui-win-gap);grid-area:title;grid-template-columns:minmax(0,1fr) auto auto;min-block-size:var(--ui-win-titlebar-height);padding-block:.35rem;padding-inline:var(--ui-win-pad-inline);pointer-events:auto;position:relative;touch-action:none;user-select:none;z-index:2}.title-handler:active{cursor:grabbing}.title-handler-main{align-items:center;display:flex;gap:.5rem;min-inline-size:0;overflow:hidden;pointer-events:none}.title-handler-main .title-text,.title-handler-main ::slotted(*){font-weight:600;letter-spacing:-.01em;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.title-handler-actions{align-items:center;display:flex;gap:.25rem;min-inline-size:0}.title-handler-buttons{align-items:center;background:transparent;display:flex;flex-shrink:0;gap:.25rem;pointer-events:auto;position:relative;touch-action:manipulation;z-index:3}:is(.title-handler-actions,.title-handler-buttons) button{align-items:center;appearance:none;background:var(--ui-win-control-bg);block-size:var(--ui-win-control-size);border:0;border-radius:999px;color:var(--ui-win-control-fg);display:inline-flex;inline-size:var(--ui-win-control-size);justify-content:center;margin:0;padding:0;--icon-color:currentColor;cursor:pointer;pointer-events:auto;transition:background-color .15s ease,color .15s ease,transform .12s ease}:is(.title-handler-actions,.title-handler-buttons) button:hover{background:var(--ui-win-control-bg-hover)}:is(.title-handler-actions,.title-handler-buttons) button:active{transform:scale(.94)}:is(.title-handler-actions,.title-handler-buttons) button:focus-visible{outline:2px solid light-dark(#3794ff,#6ee7b7);outline-offset:2px}:is(.title-handler-actions,.title-handler-buttons) button ui-icon{block-size:var(--ui-win-icon-size);inline-size:var(--ui-win-icon-size);pointer-events:none}.title-handler-buttons .title-close{background:var(--ui-win-close-bg);color:var(--ui-win-close-fg);--icon-color:currentColor}.title-handler-buttons .title-close:hover{background:var(--ui-win-close-bg-hover);color:var(--ui-win-close-fg-hover)}.content-handler{background:var(--ui-win-content-bg);color:var(--ui-win-fg);contain:paint;grid-area:content;isolation:isolate;min-block-size:0;min-inline-size:0;overflow:auto;padding:0;pointer-events:auto;position:relative;transform:translateZ(0);z-index:0}.content-handler ::slotted(*){max-block-size:100%;max-inline-size:100%;min-block-size:0;pointer-events:auto}.footer-handler{align-items:center;background:var(--ui-win-footer-bg);border-block-start:1px solid var(--ui-win-border);color:var(--ui-win-muted);display:flex;gap:.5rem;grid-area:footer;justify-content:flex-end;min-block-size:var(--ui-win-footer-min);padding:.45rem var(--ui-win-pad-inline)}.footer-handler:empty,.footer-handler:not(:has(*)):not(:has(::slotted(*))){display:none}.window-resizer{background:linear-gradient(135deg,transparent 48%,color-mix(in oklab,var(--ui-win-muted) 55%,transparent) 50%);block-size:12px;border-radius:2px;cursor:nwse-resize;inline-size:12px;inset-block-end:4px;inset-inline-end:4px;opacity:.55;pointer-events:auto;position:absolute;z-index:1}.window-resizer:hover{opacity:.9}");
/** Phosphor names (duotone registry): minimize / maximize / restore / close. */
var ICON_MINIMIZE = "minus";
var ICON_MAXIMIZE = "corners-out";
var ICON_RESTORE = "corners-in";
var ICON_CLOSE = "x";
var DRAG_MIN = Object.freeze({
	w: 240,
	h: 160
});
var Windows2 = class Windows2 extends UIElement {
	titleHandler;
	contentHandler;
	footerHandler;
	resizer;
	/** Cumulative drag offset in CSS pixels (unmanaged / standalone mode). */
	#ox = numberRef(0);
	#oy = numberRef(0);
	#dragUnbind = null;
	#resizeUnbind = null;
	#focusUnbind = null;
	#controlsUnbind = null;
	#controlsMo = null;
	#nativeUnbind = null;
	#attrObserver = null;
	#controlsReady = false;
	#wireAttempts = 0;
	#lastChromeActionAt = 0;
	#lastNativeProbe = null;
	styles = function() {
		return styled;
	};
	render = function() {
		return H`<div class="window-container" part="window-container">
            <header class="title-handler" part="title-handler">
                <div class="title-handler-main" part="title">
                    <slot name="title"></slot>
                </div>
                <div class="title-handler-actions" part="actions">
                    <slot name="actions"></slot>
                </div>
                <div class="title-handler-buttons" part="controls" data-no-drag>
                    <button class="title-minimize" type="button" aria-label="Minimize" title="Minimize" data-no-drag data-ui-win-action="minimize">
                        <ui-icon icon=${ICON_MINIMIZE}></ui-icon>
                    </button>
                    <button class="title-maximize" type="button" aria-label="Maximize" title="Maximize" data-no-drag data-ui-win-action="maximize">
                        <ui-icon icon=${ICON_MAXIMIZE}></ui-icon>
                    </button>
                    <button
                        class="title-exit-native"
                        type="button"
                        aria-label="Exit native"
                        title="Exit native"
                        data-no-drag
                        data-ui-win-action="exit-native"
                        hidden
                    >
                        <ui-icon icon=${ICON_RESTORE}></ui-icon>
                    </button>
                    <button class="title-close" type="button" aria-label="Close" title="Close" data-no-drag data-ui-win-action="close">
                        <ui-icon icon=${ICON_CLOSE}></ui-icon>
                    </button>
                </div>
            </header>
            <div class="content-handler" part="content-handler" style="container-type: size;">
                <slot name="content"></slot>
                <slot></slot>
            </div>
            <footer class="footer-handler" part="footer-handler">
                <slot name="footer"></slot>
            </footer>
            <div class="window-resizer" part="resizer" aria-hidden="true" data-no-drag></div>
        </div>`;
	};
	constructor() {
		super();
	}
	/** Shell-driven chrome: position/size come from host CSS, not transform. */
	get managed() {
		return this.hasAttribute("managed");
	}
	/** Host requested mono/task native chrome (WCO / standalone / fallback full-bleed). */
	get nativeMode() {
		return this.hasAttribute("native-mode");
	}
	set nativeMode(value) {
		this.toggleAttribute("native-mode", Boolean(value));
		this.#syncNativeChrome();
	}
	get nativeSurface() {
		return this.#lastNativeProbe?.surface ?? (this.nativeMode ? "fallback" : "off");
	}
	onInitialize() {
		super.onInitialize();
	}
	onRender() {
		super.onRender();
		this.#scheduleChromeWire();
	}
	connectedCallback() {
		super.connectedCallback?.();
		this.#scheduleChromeWire();
		this.#bindNativeChrome();
	}
	disconnectedCallback() {
		this.#nativeUnbind?.();
		this.#nativeUnbind = null;
		this.#attrObserver?.disconnect();
		this.#attrObserver = null;
		this.#controlsMo?.disconnect();
		this.#controlsMo = null;
		this.#controlsUnbind?.();
		this.#controlsUnbind = null;
		this.#controlsReady = false;
		this.#wireAttempts = 0;
		this.#focusUnbind?.();
		this.#focusUnbind = null;
		this.#dragUnbind?.();
		this.#dragUnbind = null;
		this.#resizeUnbind?.();
		this.#resizeUnbind = null;
		super.disconnectedCallback?.();
	}
	#scheduleChromeWire() {
		const run = () => {
			this.#wireControls();
			this.#wireFocus();
			this.#wireDrag();
			this.#wireResize();
			this.#syncNativeChrome();
			if (this.#wireAttempts < 20) {
				this.#wireAttempts += 1;
				if (!this.#controlsReady || this.#wireAttempts < 8) requestAnimationFrame(run);
			}
		};
		queueMicrotask(run);
	}
	#bindNativeChrome() {
		if (this.#nativeUnbind) return;
		this.#nativeUnbind = subscribeNativeWindowChrome({
			getRequested: () => this.nativeMode,
			onChange: (probe) => this.#applyNativeProbe(probe)
		});
		if (typeof MutationObserver !== "undefined" && !this.#attrObserver) {
			this.#attrObserver = new MutationObserver((records) => {
				let native = false;
				let maxIcon = false;
				for (const r of records) {
					if (r.attributeName === "native-mode") native = true;
					if (r.attributeName === "maximized" || r.attributeName === "data-desk-max" || r.attributeName === "data-mobile-max") maxIcon = true;
				}
				if (native || maxIcon) this.#syncNativeChrome();
				if (maxIcon) this.#syncMaximizeIcon();
			});
			this.#attrObserver.observe(this, {
				attributes: true,
				attributeFilter: [
					"native-mode",
					"maximized",
					"data-desk-max",
					"data-mobile-max"
				]
			});
		}
	}
	#syncNativeChrome() {
		this.#applyNativeProbe(probeNativeWindowChrome(this.nativeMode));
	}
	#applyNativeProbe(probe) {
		this.#lastNativeProbe = probe;
		const host = this;
		host.toggleAttribute("data-native-wco", probe.surface === "wco");
		host.toggleAttribute("data-native-standalone", probe.surface === "standalone");
		host.toggleAttribute("data-native-fallback", probe.surface === "fallback");
		host.toggleAttribute("data-native-active", probe.surface !== "off");
		this.#syncExitNativeButton(probe.surface);
		if (probe.titlebarRect) {
			host.style.setProperty("--ui-win-titlebar-area-x", `${probe.titlebarRect.x}px`);
			host.style.setProperty("--ui-win-titlebar-area-y", `${probe.titlebarRect.y}px`);
			host.style.setProperty("--ui-win-titlebar-area-width", `${probe.titlebarRect.width}px`);
			host.style.setProperty("--ui-win-titlebar-area-height", `${probe.titlebarRect.height}px`);
		} else {
			host.style.removeProperty("--ui-win-titlebar-area-x");
			host.style.removeProperty("--ui-win-titlebar-area-y");
			host.style.removeProperty("--ui-win-titlebar-area-width");
			host.style.removeProperty("--ui-win-titlebar-area-height");
		}
		this.#dragUnbind?.();
		this.#dragUnbind = null;
		this.#resizeUnbind?.();
		this.#resizeUnbind = null;
		this.#wireDrag();
		this.#wireResize();
		this.#syncMaximizeIcon();
		if (this.nativeMode || this.hasAttribute("data-desk-max") || this.hasAttribute("maximized") || this.hasAttribute("data-mobile-max")) syncThemeColorFromNativeWindow(this);
		else {
			restoreThemeColorAfterNativeWindow(this);
			syncAmbientThemeColor();
		}
		this.dispatchEvent(new CustomEvent("window-native-change", {
			bubbles: true,
			composed: true,
			detail: probe
		}));
	}
	/** Standalone-only control; `hidden` must win over button `display: inline-flex`. */
	#syncExitNativeButton(surface = this.nativeSurface) {
		const exitBtn = this.shadowRoot?.querySelector(".title-exit-native");
		if (exitBtn) exitBtn.hidden = surface !== "standalone";
	}
	/**
	* INVARIANT: one glyph on maximize — corners-out (max) or corners-in (restore).
	* NOTE: native fallback stays corners-out (maximize = exit native, not restore-down).
	*/
	#syncMaximizeIcon() {
		const btn = this.shadowRoot?.querySelector(".title-maximize");
		const icon = btn?.querySelector("ui-icon");
		if (!btn || !icon) return;
		const restoredLook = !(this.nativeMode && this.nativeSurface === "fallback") && (this.hasAttribute("maximized") || this.hasAttribute("data-desk-max") || this.hasAttribute("data-mobile-max"));
		const name = restoredLook ? ICON_RESTORE : ICON_MAXIMIZE;
		const label = restoredLook ? "Restore" : "Maximize";
		if (icon.getAttribute("icon") !== name) icon.setAttribute("icon", name);
		btn.setAttribute("aria-label", label);
		btn.setAttribute("title", label);
	}
	/** Apply absolute bounds (managed shells / workspace layer). */
	applyBounds(bounds) {
		const el = this;
		el.style.position = "absolute";
		if (typeof bounds.x === "number") el.style.left = `${bounds.x}px`;
		if (typeof bounds.y === "number") el.style.top = `${bounds.y}px`;
		if (typeof bounds.w === "number") {
			el.style.width = `${bounds.w}px`;
			el.style.setProperty("--ui-win-width", `${bounds.w}px`);
		}
		if (typeof bounds.h === "number") {
			el.style.height = `${bounds.h}px`;
			el.style.setProperty("--ui-win-height", `${bounds.h}px`);
		}
		if (typeof bounds.z === "number") el.style.zIndex = String(bounds.z);
		el.style.right = "";
		el.style.bottom = "";
		if (this.managed) {
			this.#ox.value = 0;
			this.#oy.value = 0;
			el.style.transform = "";
		}
	}
	setVisible(visible) {
		this.toggleAttribute("hidden-window", !visible);
		this.style.visibility = visible ? "" : "hidden";
		this.style.pointerEvents = visible ? "" : "none";
	}
	get isMaximized() {
		return this.hasAttribute("maximized") || this.hasAttribute("data-desk-max") || this.hasAttribute("data-mobile-max");
	}
	get isMinimized() {
		return this.hasAttribute("minimized");
	}
	/** True when CSS window-drag owns titlebar (WCO / installed standalone). */
	get usesNativeWindowDrag() {
		const s = this.nativeSurface;
		return s === "wco" || s === "standalone";
	}
	/**
	* Enter/exit native-mode. Managed hosts should listen for `window-native` /
	* `window-exit-native` instead of mutating attrs directly when preferred.
	*/
	enterNativeMode() {
		if (this.managed) {
			this.#emitChrome("window-native");
			return;
		}
		this.nativeMode = true;
		this.#emitChrome("window-native");
	}
	exitNativeMode() {
		if (this.managed) {
			this.#emitChrome("window-exit-native");
			return;
		}
		this.nativeMode = false;
		this.#emitChrome("window-exit-native");
	}
	#emitChrome(name, cancelable = false) {
		return this.dispatchEvent(new CustomEvent(name, {
			bubbles: true,
			composed: true,
			cancelable
		}));
	}
	/**
	* WHY (managed): only emit intent — environment-shell owns attrs via applyChrome.
	*/
	toggleMaximize() {
		const restoring = this.isMaximized;
		if (this.managed) {
			this.#emitChrome(restoring ? "window-restore" : "window-maximize");
			return;
		}
		const next = !restoring;
		this.toggleAttribute("maximized", next);
		if (next) this.removeAttribute("minimized");
		this.#syncMaximizeIcon();
		this.#emitChrome(next ? "window-maximize" : "window-restore");
	}
	toggleMinimize() {
		if (this.managed) {
			this.#emitChrome(this.isMinimized ? "window-restore" : "window-minimize");
			return;
		}
		const next = !this.isMinimized;
		this.toggleAttribute("minimized", next);
		if (next) this.removeAttribute("maximized");
		this.#emitChrome(next ? "window-minimize" : "window-restore");
	}
	restoreWindow() {
		if (this.managed) {
			this.#emitChrome("window-restore");
			return;
		}
		const wasMin = this.isMinimized;
		const wasMax = this.isMaximized;
		this.removeAttribute("minimized");
		this.removeAttribute("maximized");
		if (wasMin || wasMax) this.#emitChrome("window-restore");
	}
	closeWindow() {
		this.#emitChrome("window-close", true);
		if (this.isConnected) this.remove();
	}
	#wireFocus() {
		if (this.#focusUnbind) return;
		this.#focusUnbind = addEvent(this, "pointerdown", () => {
			this.requestFocus();
		}, {
			capture: true,
			passive: true
		});
	}
	requestFocus() {
		this.dispatchEvent(new CustomEvent("window-focus", {
			bubbles: true,
			composed: true
		}));
	}
	bringToFront(z) {
		const el = this;
		if (Number.isFinite(z)) el.style.zIndex = String(z);
		el.toggleAttribute("data-focused", true);
	}
	clearFocused() {
		this.toggleAttribute("data-focused", false);
	}
	/** Resolve control hit from composedPath / data-ui-win-action (ui-icon retargeting). */
	#hitControl(ev) {
		const path = typeof ev.composedPath === "function" ? ev.composedPath() : [];
		for (const n of path) {
			if (!(n instanceof Element)) continue;
			const action = n.getAttribute?.("data-ui-win-action");
			if (action === "close" || action === "exit-native" || action === "maximize" || action === "minimize") return action;
			if (n.matches?.(".title-close")) return "close";
			if (n.matches?.(".title-exit-native")) return "exit-native";
			if (n.matches?.(".title-maximize")) return "maximize";
			if (n.matches?.(".title-minimize")) return "minimize";
		}
		const t = ev.target;
		if (t instanceof Element) {
			const el = t.closest?.("[data-ui-win-action], .title-close, .title-exit-native, .title-maximize, .title-minimize") ?? null;
			if (!el) return null;
			const action = el.getAttribute("data-ui-win-action");
			if (action === "close" || action === "exit-native" || action === "maximize" || action === "minimize") return action;
			if (el.classList.contains("title-close")) return "close";
			if (el.classList.contains("title-exit-native")) return "exit-native";
			if (el.classList.contains("title-maximize")) return "maximize";
			if (el.classList.contains("title-minimize")) return "minimize";
		}
		return null;
	}
	/** Debounce pointerup+click (and dual host/button listeners) within one gesture. */
	#consumeChromeAction() {
		const now = typeof performance !== "undefined" ? performance.now() : Date.now();
		if (now - this.#lastChromeActionAt < 280) return false;
		this.#lastChromeActionAt = now;
		return true;
	}
	#runChromeAction(which) {
		if (which === "close") this.closeWindow();
		else if (which === "exit-native") this.exitNativeMode();
		else if (which === "maximize") if (this.nativeMode && this.nativeSurface === "fallback") this.exitNativeMode();
		else this.toggleMaximize();
		else this.toggleMinimize();
	}
	#handleControlEvent(ev) {
		const which = this.#hitControl(ev);
		if (!which) return false;
		ev.preventDefault();
		ev.stopPropagation();
		ev.stopImmediatePropagation?.();
		if (!this.#consumeChromeAction()) return true;
		this.#runChromeAction(which);
		return true;
	}
	/**
	* WHY (radical): H/lure can replace shadow buttons and kill addEventListener bindings.
	* Assign `onclick` / `onpointerup` properties on the live nodes and re-stamp after every
	* shadow mutation. Delegation on shadowRoot + host remains as a safety net.
	*/
	#bindControlButtonProps() {
		const root = this.shadowRoot;
		if (!root) return;
		for (const [which, sel] of [
			["minimize", ".title-minimize"],
			["maximize", ".title-maximize"],
			["close", ".title-close"],
			["exit-native", ".title-exit-native"]
		]) {
			const btn = root.querySelector(sel);
			if (!btn) continue;
			btn.setAttribute("data-ui-win-action", which);
			const run = (ev) => {
				ev.preventDefault();
				ev.stopPropagation();
				ev.stopImmediatePropagation?.();
				if (!this.#consumeChromeAction()) return;
				this.#runChromeAction(which);
			};
			btn.onclick = run;
			btn.onpointerup = (ev) => {
				if (ev.button !== 0) return;
				run(ev);
			};
		}
	}
	#wireControls() {
		const root = this.shadowRoot;
		if (!root) return;
		const titleBar = this.titleHandler ?? root.querySelector(".title-handler");
		const buttons = root.querySelector(".title-handler-buttons");
		if (!titleBar || !buttons) return;
		this.#bindControlButtonProps();
		if (this.#controlsReady) {
			this.#syncExitNativeButton();
			this.#syncMaximizeIcon();
			return;
		}
		const onDelegated = (ev) => {
			this.#handleControlEvent(ev);
		};
		const onDbl = (ev) => {
			if (this.#hitControl(ev)) return;
			if (!(typeof ev.composedPath === "function" ? ev.composedPath() : []).some((n) => n instanceof Element && n.classList?.contains("title-handler"))) return;
			if (ev.target?.closest?.("button, a, input, textarea, select, [data-no-drag]")) return;
			ev.preventDefault();
			if (!this.#consumeChromeAction()) return;
			this.toggleMaximize();
		};
		const offShadowClick = addEvent(root, "click", onDelegated, { capture: true });
		const offShadowPtr = addEvent(root, "pointerup", onDelegated, { capture: true });
		const offHostClick = addEvent(this, "click", onDelegated, { capture: true });
		const offHostPtr = addEvent(this, "pointerup", onDelegated, { capture: true });
		const offHostDbl = addEvent(this, "dblclick", onDbl, { capture: true });
		if (typeof MutationObserver !== "undefined" && !this.#controlsMo) {
			this.#controlsMo = new MutationObserver(() => {
				this.#bindControlButtonProps();
				this.#syncExitNativeButton();
				this.#syncMaximizeIcon();
			});
			this.#controlsMo.observe(root, {
				childList: true,
				subtree: true
			});
		}
		this.#controlsUnbind = () => {
			offShadowClick?.();
			offShadowPtr?.();
			offHostClick?.();
			offHostPtr?.();
			offHostDbl?.();
			this.#controlsMo?.disconnect();
			this.#controlsMo = null;
			this.#controlsUnbind = null;
			this.#controlsReady = false;
		};
		this.#controlsReady = true;
		this.#wireAttempts = 0;
		this.#syncExitNativeButton();
		this.#syncMaximizeIcon();
	}
	#wireDrag() {
		const root = this.shadowRoot ?? this;
		const bar = this.titleHandler ?? root.querySelector?.(".title-handler");
		if (!bar || this.#dragUnbind) return;
		if (this.usesNativeWindowDrag) {
			this.#dragUnbind = () => {
				this.#dragUnbind = null;
			};
			return;
		}
		if (!this.managed) bindStyle(this, S`transform: translate(${this.#ox}px, ${this.#oy}px)`);
		const DRAG_THRESHOLD_PX = 4;
		const pointerMap = /* @__PURE__ */ new Map();
		const offDown = addEvent(bar, "pointerdown", (ev) => {
			if (ev.button !== 0) return;
			if (this.#hitControl(ev)) return;
			if (ev.target?.closest("button, a, input, textarea, select, [data-no-drag]")) return;
			if (this.isMaximized || this.isMinimized || this.nativeMode) return;
			this.requestFocus();
			const host = this;
			pointerMap.set(ev.pointerId, {
				sx: ev.clientX,
				sy: ev.clientY,
				ox: this.#ox.value,
				oy: this.#oy.value,
				bx: Number.parseFloat(host.style.left || "0") || 0,
				by: Number.parseFloat(host.style.top || "0") || 0,
				dragging: false
			});
			const offMove = addEvent(document.body, "pointermove", (ev) => {
				const p = pointerMap.get(ev.pointerId);
				if (!p) return;
				const dx = ev.clientX - p.sx;
				const dy = ev.clientY - p.sy;
				if (!p.dragging) {
					if (Math.hypot(dx, dy) < DRAG_THRESHOLD_PX) return;
					p.dragging = true;
					try {
						ev.preventDefault();
					} catch {}
					this.setPointerCapture?.(ev.pointerId);
				}
				if (this.managed) {
					this.dispatchEvent(new CustomEvent("window-move", {
						bubbles: true,
						composed: true,
						detail: {
							x: p.bx + dx,
							y: p.by + dy,
							dx,
							dy
						}
					}));
					return;
				}
				this.#ox.value = p.ox + dx;
				this.#oy.value = p.oy + dy;
			});
			const end = (ev) => {
				if (!pointerMap.has(ev.pointerId)) return;
				const p = pointerMap.get(ev.pointerId);
				pointerMap.delete(ev.pointerId);
				if (p?.dragging) try {
					this.releasePointerCapture?.(ev.pointerId);
				} catch {}
				offMove?.();
				offUp?.();
				offCancel?.();
			};
			const offUp = addEvent(document.body, "pointerup", end);
			const offCancel = addEvent(document.body, "pointercancel", end);
		});
		this.#dragUnbind = () => {
			offDown?.();
		};
	}
	#wireResize() {
		const root = this.shadowRoot ?? this;
		const grip = this.resizer ?? root.querySelector?.(".window-resizer");
		if (!grip || this.#resizeUnbind) return;
		const pointerMap = /* @__PURE__ */ new Map();
		const offDown = addEvent(grip, "pointerdown", (ev) => {
			if (ev.button !== 0) return;
			if (this.isMaximized || this.isMinimized || this.nativeMode) return;
			ev.preventDefault();
			ev.stopPropagation();
			this.requestFocus();
			this.setPointerCapture?.(ev.pointerId);
			const rect = this.getBoundingClientRect();
			pointerMap.set(ev.pointerId, {
				sx: ev.clientX,
				sy: ev.clientY,
				w: rect.width,
				h: rect.height
			});
			const offMove = addEvent(document.body, "pointermove", (ev) => {
				const p = pointerMap.get(ev.pointerId);
				if (!p) return;
				const w = Math.max(DRAG_MIN.w, p.w + (ev.clientX - p.sx));
				const h = Math.max(DRAG_MIN.h, p.h + (ev.clientY - p.sy));
				if (this.managed) {
					this.dispatchEvent(new CustomEvent("window-resize", {
						bubbles: true,
						composed: true,
						detail: {
							w,
							h
						}
					}));
					return;
				}
				this.style.width = `${w}px`;
				this.style.height = `${h}px`;
				this.style.setProperty("--ui-win-width", `${w}px`);
				this.style.setProperty("--ui-win-height", `${h}px`);
			});
			const end = (ev) => {
				if (!pointerMap.has(ev.pointerId)) return;
				pointerMap.delete(ev.pointerId);
				try {
					this.releasePointerCapture?.(ev.pointerId);
				} catch {}
				offMove?.();
				offUp?.();
				offCancel?.();
			};
			const offUp = addEvent(document.body, "pointerup", end);
			const offCancel = addEvent(document.body, "pointercancel", end);
		});
		this.#resizeUnbind = () => {
			offDown?.();
		};
	}
};
__decorate([property({
	source: "query",
	name: ".title-handler"
})], Windows2.prototype, "titleHandler", void 0);
__decorate([property({
	source: "query",
	name: ".content-handler"
})], Windows2.prototype, "contentHandler", void 0);
__decorate([property({
	source: "query",
	name: ".footer-handler"
})], Windows2.prototype, "footerHandler", void 0);
__decorate([property({
	source: "query",
	name: ".window-resizer"
})], Windows2.prototype, "resizer", void 0);
Windows2 = __decorate([defineElement("ui-window")], Windows2);
//#endregion
//#region ../../modules/projects/fl.ui/src/index.ts
/**
* FL.UI - UI Components Library
*
* Default stylesheet scopes native control chrome to `.btn` and omits host-wide
* `input` / `select` / `textarea` overrides. For legacy document-wide styling, set
* `configureFlUI({ includeGlobalNativeControlStyles: true })` before importing components,
* or call `loadFlUIGlobalNativeControlStyles()` after bootstrap.
*
* Entry points by style variant:
* - `fest/fl-ui` - Default (veela-advanced)
* - `fest/fl-ui/core` - Basic styles only (no veela)
* - `fest/fl-ui/veela` - Alias for veela-advanced
* - `fest/fl-ui/veela-basic` - Veela basic styles
* - `fest/fl-ui/veela-advanced` - Veela advanced styles
* - `fest/fl-ui/veela-beercss` - Beer CSS compatible styles
*
* @example
* ```ts
* // Default (veela-advanced)
* import { Button, Card } from "fest/fl-ui";
*
* // With specific variant
* import { Button } from "fest/fl-ui/veela-basic";
* ```
*/
var _config = {
	loadStyles: true,
	includeGlobalNativeControlStyles: false,
	styleVariant: "veela-basic"
};
/**
* Get current fl.ui configuration
*/
function getFlUIConfig() {
	return { ..._config };
}
(async () => {
	const cfg = getFlUIConfig();
	if (cfg.loadStyles === false) return;
	await loader({ includeGlobalNativeControls: cfg.includeGlobalNativeControlStyles === true });
	await loadInlineStyle(styles_default);
})()?.catch?.(() => void 0);
//#endregion
export { UIElement as n, UIElement_default as r, openUnifiedContextMenu as t };
