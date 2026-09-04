import{n as e}from"./rolldown-runtime-C0FnF6B9.js";import{$ as t,Bt as n,Et as r,F as i,Jt as a,Mt as o,Nt as s,Q as c,Rt as l,St as u,Ut as d,Xt as f,Z as p,_t as m,at as h,ct as g,dt as _,ft as v,gt as y,ht as b,lt as x,mt as S,nt as C,rt as w,t as T,xt as E,yt as D,zt as O}from"./src-DaqdrrCE.js";import{Bt as k,Ct as A,Et as j,Lt as M,Mt as ee,Nt as te,Rt as N,W as ne,wt as re,zt as ie}from"./OPFS-BTZVHSsd.js";import{n as P,t as F}from"./preload-helper-DFTwEg7x.js";import{o as ae,r as I}from"./image-Cvh7hNA7.js";import{o as oe,s as se}from"./icon-DwAFT1ZT.js";import{i as ce,n as L,o as R,r as le,s as ue,t as de,u as fe}from"./storage-bridge-L6ipofDd.js";import{A as pe,C as me,D as he,E as ge,F as _e,I as ve,L as ye,M as be,N as xe,O as Se,P as Ce,S as we,T as Te,_ as Ee,a as De,b as Oe,c as ke,d as Ae,f as je,g as Me,h as Ne,i as Pe,j as Fe,k as Ie,l as Le,m as Re,n as ze,o as Be,r as Ve,s as He,t as Ue,u as We,v as Ge,w as Ke,x as qe,y as Je}from"./launcher-state-DWqtI5Lz.js";import{r as Ye}from"./render-8bB1QlM5.js";function z(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a}function Xe(){return(Xe=e((()=>{})))()}var B,Ze;function V(){return(V=e((()=>{T(),l(),se(),B=class extends g(){theme=`default`;render(e){return v`<slot></slot>`}constructor(){super()}onRender(){return super.onRender()}connectedCallback(){let e=super.connectedCallback?.()??this;return e.loadStyleLibrary(oe()),d(e),e}onInitialize(){let e=super.onInitialize()??this;return e.loadStyleLibrary(oe()),e}},z([_({source:`attr`})],B.prototype,`theme`,void 0),B=z([x(`ui-element`)],B),Ze=B})))()}var Qe,$e,et,tt,nt,rt,it,at,ot,st,H,ct,lt,ut;function dt(){return(dt=e((()=>{T(),Qe=`2147483600`,$e=new Map,et=new Map,tt=null,nt=[`[data-chrome-flyout-anchor]`,`.env-shell-taskbar__clock`,`.env-ui-statusbar__clock`,`.env-device-tray`,`.speed-dial-chrome-rail`,`.speed-dial-core-rail`],rt=e=>e&&(e.dataset.chromeFlyoutSide===`start`||e.closest?.(`.speed-dial-chrome-rail, [data-chrome-flyout-side='start']`))?`start`:`end`,it=()=>{if(typeof document<`u`){if(document.querySelector(`.env-shell-chrome[data-desktop]`))return!0;let e=document.querySelector(`[data-chrome-layout]`);if(e?.dataset.chromeLayout===`desktop`)return!0;if(e?.dataset.chromeLayout===`mobile`)return!1}return typeof matchMedia<`u`&&matchMedia(`(min-width: 641px)`).matches},at=e=>{tt=e},ot=e=>{let t=`data-env-shell-overlays`,n=e||tt||document.querySelector(`.env-shell-root`)||document.querySelector(`#app`)||document.body,r=n.querySelector(`[${t}]`);if(r)return r.style.zIndex||(r.style.zIndex=Qe),r;try{let e=globalThis.__ENV_OVERLAY_MOUNT__;if(typeof e==`function`)return e(n)}catch{}let i=document.createElement(`div`);return i.setAttribute(t,``),i.className=`env-shell-overlays`,i.setAttribute(`data-part`,`env-overlays`),i.style.cssText=`position:fixed;inset:0;pointer-events:none;z-index:${Qe};box-sizing:border-box;`,n.appendChild(i),i},st=(e,t,n)=>{let r=it(),i=n?.align??rt(n?.anchor);if(e.dataset.flyoutAlign=i,e.style.position=`fixed`,e.style.zIndex=String(Number(Qe)+1),e.style.pointerEvents=`auto`,e.style.margin=`0`,r){e.style.top=`auto`,e.style.bottom=`4.5rem`,e.style.transform=`none`,i===`start`?(e.style.left=`0.75rem`,e.style.right=`auto`):(e.style.left=`auto`,e.style.right=`0.75rem`);return}if(t===`calendar`){e.style.top=`50%`,e.style.left=`50%`,e.style.right=`auto`,e.style.bottom=`auto`,e.style.transform=`translate(-50%, -50%)`;return}e.style.top=`calc(env(safe-area-inset-top, 0px) + 0.75rem)`,e.style.left=`50%`,e.style.right=`auto`,e.style.bottom=`auto`,e.style.transform=`translateX(-50%)`},H=e=>{let t=$e.get(e);if(!t)return;$e.delete(e);let n=et.get(e);et.delete(e),n?.disposeDismiss(),n?.unregisterBack();try{let e=t.el;typeof e.close==`function`?e.close():(e.removeAttribute(`open`),e.hidden=!0),e.dispatchEvent(new CustomEvent(`chrome-flyout-close`,{bubbles:!0}))}catch{}},ct=e=>{$e.has(e.kind)&&H(e.kind);for(let t of[...$e.keys()])t!==e.kind&&H(t);$e.set(e.kind,{...e,close:()=>H(e.kind)}),e.el.hidden=!1,e.el.removeAttribute(`hidden`),e.el.setAttribute(`open`,``),et.set(e.kind,{disposeDismiss:t({root:document,inside:e.el,isInside:t=>e.contains(t.target),exceptSelectors:nt,onDismiss:()=>H(e.kind)}),unregisterBack:p({id:`chrome-flyout-${e.kind}`,kind:`overlay`,element:e.el,isActive:()=>$e.get(e.kind)?.el===e.el&&e.el.isConnected&&!e.el.hidden&&e.el.hasAttribute(`open`),close:()=>(H(e.kind),!0)})})},lt=e=>$e.has(e),ut=(e,t)=>{if(lt(e)){H(e);return}let n=t();ct(n)}})))()}var ft;function pt(){return(pt=e((()=>{ft=`/*
 * Filename: CalendarFlyout.scss
 * FullPath: modules/projects/fl.ui/src/ui/navigation/calendar/CalendarFlyout.scss
 * Change date and time: 08.30.00_02.08.2026
 * Reason for changes: Win11-like calendar flyout — compact acrylic-ish panel, no backdrop-filter.
 */
@layer components {
  :host {
    --cal-base-color: var(--color-primary);
    --cal-surface: var(--color-surface);
    --cal-on-surface: var(--color-on-surface);
    --cal-outline: color-mix(in oklab, var(--color-outline-variant) 80%, transparent);
    --cal-hover: color-mix(in oklab, var(--color-on-surface) 8%, transparent);
    display: block;
    box-sizing: border-box;
    color-scheme: inherit;
    pointer-events: auto;
    color: var(--cal-on-surface);
    min-inline-size: 280px;
    max-inline-size: min(360px, 96vw);
  }
  :host([hidden]) {
    display: none !important;
  }
  .ui-cal-flyout__panel {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
    inline-size: 100%;
    padding: 0.9rem 0.9rem 0.75rem;
    border-radius: 14px;
    background: var(--cal-surface);
    color: contrast-color(var(--cal-surface));
    border: 1px solid var(--cal-outline);
    box-shadow: 0 18px 44px -18px color-mix(in oklab, #000 55%, transparent), 0 2px 6px -2px color-mix(in oklab, #000 35%, transparent);
    /* NOTE: no backdrop-filter — breaks phosphor duotone icon rendering elsewhere in chrome. */
  }
  .ui-cal-flyout__header {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    padding-inline: 0.15rem;
  }
  .ui-cal-flyout__today {
    margin: 0;
    font-size: 0.95rem;
    font-weight: 650;
    line-height: 1.25;
    color: var(--cal-on-surface);
  }
  .ui-cal-flyout__nav {
    display: grid;
    grid-template-columns: auto 1fr auto;
    align-items: center;
    gap: 0.35rem;
  }
  .ui-cal-flyout__nav-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    inline-size: 2rem;
    block-size: 2rem;
    padding: 0;
    border: none;
    border-radius: 8px;
    background: transparent;
    color: var(--cal-on-surface);
    cursor: pointer;
    appearance: none;
    -webkit-tap-highlight-color: transparent;
  }
  .ui-cal-flyout__nav-btn ui-icon {
    /* WHY: Phosphor default --icon-padding shrinks nav carets to dots. */
    --icon-size: 1.25rem;
    --icon-padding: 0;
    --icon-color: currentColor;
    inline-size: var(--icon-size);
    block-size: var(--icon-size);
    min-inline-size: var(--icon-size);
    min-block-size: var(--icon-size);
    color: currentColor;
    pointer-events: none;
  }
  .ui-cal-flyout__nav-btn:hover {
    background: var(--cal-hover);
    color: contrast-color(var(--cal-hover));
  }
  .ui-cal-flyout__nav-btn:active {
    background: color-mix(in oklab, var(--cal-hover) 160%, transparent);
    color: contrast-color(color-mix(in oklab, var(--cal-hover) 160%, transparent));
  }
  .ui-cal-flyout__nav-btn:focus-visible {
    outline: 2px solid var(--cal-base-color);
    outline-offset: 1px;
  }
  .ui-cal-flyout__month-label {
    text-align: center;
    font-size: 0.86rem;
    font-weight: 600;
    letter-spacing: 0.01em;
    color: var(--cal-on-surface);
    user-select: none;
  }
  .ui-cal-flyout__weekdays {
    display: grid;
    grid-template-columns: repeat(7, minmax(0, 1fr));
    gap: 2px;
    padding-inline: 0.1rem;
  }
  .ui-cal-flyout__weekday {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.7rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.02em;
    color: color-mix(in oklab, var(--cal-on-surface) 62%, transparent);
    padding-block: 0.2rem;
    user-select: none;
  }
  .ui-cal-flyout__grid {
    display: grid;
    grid-template-columns: repeat(7, minmax(0, 1fr));
    gap: 2px;
    padding-inline: 0.1rem;
  }
  .ui-cal-flyout__day {
    position: relative;
    inline-size: 100%;
    aspect-ratio: 1/1;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: none;
    border-radius: 999px;
    background: transparent;
    color: var(--cal-on-surface);
    font-size: 0.82rem;
    font-variant-numeric: tabular-nums;
    cursor: pointer;
    appearance: none;
    -webkit-tap-highlight-color: transparent;
    transition: background-color 120ms ease, color 120ms ease;
  }
  .ui-cal-flyout__day[data-other-month] {
    color: color-mix(in oklab, var(--cal-on-surface) 42%, transparent);
  }
  .ui-cal-flyout__day:hover {
    background: var(--cal-hover);
    color: contrast-color(var(--cal-hover));
  }
  .ui-cal-flyout__day:focus-visible {
    outline: 2px solid var(--cal-base-color);
    outline-offset: 1px;
  }
  .ui-cal-flyout__day[data-today] {
    background: color-mix(in oklab, var(--cal-base-color) 88%, transparent);
    color: light-dark(#ffffff, #ffffff);
    font-weight: 700;
  }
  .ui-cal-flyout__day[data-selected] {
    box-shadow: 0 0 0 2px var(--cal-base-color) inset;
  }
  .ui-cal-flyout__day[data-today][data-selected] {
    box-shadow: 0 0 0 2px color-mix(in oklab, var(--cal-base-color) 70%, #fff 20%) inset;
  }
}`})))()}function mt(e){try{let t=new Intl.Locale(e),n=(t.weekInfo??t.getWeekInfo?.())?.firstDay;if(typeof n==`number`&&n>=1&&n<=7)return n%7}catch{}return 0}function ht(e,t){let n=new Intl.DateTimeFormat(e,{weekday:`short`,timeZone:`UTC`}),r=[];for(let e=0;e<7;e++){let i=(t+e)%7;r.push(n.format(new Date(St+i*Ct)))}return r}function gt(e,t){return e.getFullYear()===t.getFullYear()&&e.getMonth()===t.getMonth()&&e.getDate()===t.getDate()}function _t(e,t,n){let r=new Date,i=new Date(e,t,1),a=new Date(e,t+1,0).getDate(),o=(i.getDay()-n+7)%7,s=Math.ceil((o+a)/7)*7,c=[];for(let n=0;n<s;n++){let i=n-o+1,a=new Date(e,t,i);c.push({date:a,day:a.getDate(),otherMonth:a.getMonth()!==t,isToday:gt(a,r)})}return c}function vt(){if(Tt?.isConnected)return Tt;let e=ot(),t=e.querySelector(`ui-calendar-flyout`);return t||(t=document.createElement(`ui-calendar-flyout`),t.hidden=!0,e.appendChild(t)),Tt=t,t}function yt(e){ut(xt,()=>{let t=vt(),n=document.documentElement.getAttribute(`data-theme`);return(n===`light`||n===`dark`)&&(t.dataset.theme=n,t.style.colorScheme=n),st(t,xt,{anchor:e}),t.open(),{kind:xt,el:t,close:()=>{t.close(),H(xt)},contains:e=>e instanceof Node&&t.contains(e)}})}var bt,xt,St,Ct,wt,Tt;function Et(){return(Et=e((()=>{T(),r(),l(),V(),se(),dt(),pt(),bt=f(ft),xt=`calendar`,St=Date.UTC(2023,0,1),Ct=864e5,wt=class extends B{#e;#t;#n=null;#r=null;styles=function(){return bt};render=function(){return v`<div class="ui-cal-flyout__panel" part="panel">
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
        </div>`};constructor(){super();let e=new Date;this.#e=e.getFullYear(),this.#t=e.getMonth()}onRender(){super.onRender(),this.#i(),this.#c()}disconnectedCallback(){this.#r?.(),this.#r=null,super.disconnectedCallback?.()}#i(){let e=this.shadowRoot;if(!e||this.#r)return;let t=s(e,`click`,e=>{let t=e.target,n=t?.closest?.(`[data-nav]`);if(n){n.dataset.nav===`prev`?this.#a(-1):n.dataset.nav===`next`&&this.#a(1);return}let r=t?.closest?.(`.ui-cal-flyout__day`);r&&this.#s(r)});this.#r=()=>t?.()}#a(e){this.#t+=e,this.#t<0?(this.#t=11,--this.#e):this.#t>11&&(this.#t=0,this.#e+=1),this.#c()}#o(){let e=new Date;this.#e=e.getFullYear(),this.#t=e.getMonth(),this.#c()}#s(e){let t=e.dataset.date;t&&(this.#n=new Date(t),this.shadowRoot?.querySelectorAll(`.ui-cal-flyout__day[data-selected]`)?.forEach(e=>e.removeAttribute(`data-selected`)),e.setAttribute(`data-selected`,``),this.dispatchEvent(new CustomEvent(`calendar-select`,{bubbles:!0,composed:!0,detail:{date:this.#n}})))}#c(){let e=this.shadowRoot;if(!e)return;let t=typeof navigator<`u`?navigator.language:void 0,n=mt(t??`en-US`),r=new Date,i=e.querySelector(`.ui-cal-flyout__today`);i&&(i.textContent=r.toLocaleDateString(t,{weekday:`long`,month:`long`,day:`numeric`,year:`numeric`}));let a=e.querySelector(`.ui-cal-flyout__month-label`);a&&(a.textContent=new Date(this.#e,this.#t,1).toLocaleDateString(t,{month:`long`,year:`numeric`}));let o=e.querySelector(`.ui-cal-flyout__weekdays`);o&&o.replaceChildren(...ht(t??`en-US`,n).map(e=>{let t=document.createElement(`span`);return t.className=`ui-cal-flyout__weekday`,t.setAttribute(`role`,`columnheader`),t.textContent=e,t}));let s=e.querySelector(`.ui-cal-flyout__grid`);if(s){let e=_t(this.#e,this.#t,n);s.replaceChildren(...e.map(e=>{let n=document.createElement(`button`);return n.type=`button`,n.className=`ui-cal-flyout__day`,n.textContent=String(e.day),n.dataset.date=e.date.toISOString(),n.setAttribute(`role`,`gridcell`),e.otherMonth&&n.setAttribute(`data-other-month`,``),e.isToday&&n.setAttribute(`data-today`,``),this.#n&&gt(e.date,this.#n)&&n.setAttribute(`data-selected`,``),n.setAttribute(`aria-label`,e.date.toLocaleDateString(t,{weekday:`long`,month:`long`,day:`numeric`,year:`numeric`})),n}))}}open(){this.#o(),this.removeAttribute(`hidden`),this.hidden=!1,this.setAttribute(`open`,``)}close(){this.hidden=!0,this.setAttribute(`hidden`,``),this.removeAttribute(`open`)}toggle(e){this.hasAttribute(`open`)?this.close():this.open()}},wt=z([x(`ui-calendar-flyout`)],wt),Tt=null})))()}function Dt(){let e=jt.get();return typeof e==`function`?e:null}var Ot,kt,At,jt;function Mt(){return(Mt=e((()=>{Ot=`__CWSP_SPEED_DIAL_VIEW_OPENER_V1__`,kt=`__CWSP_HOME_OVERLAY_MOUNT_V1__`,At=e=>{let t=globalThis;return{get:()=>e in t?t[e]:null,set:n=>{t[e]=n}}},jt=At(Ot),At(kt)})))()}var Nt;function Pt(){return(Pt=e((()=>{Nt=`/*
 * Filename: QuickSettings.scss
 * FullPath: modules/projects/fl.ui/src/ui/navigation/settings/QuickSettings.scss
 * Change date and time: 20.00.00_03.09.2026
 * Reason for changes: Drop contrast-color()/inherit() — Capacitor WebView drops the rest of the sheet.
 * FIND:chrome-rail
 */
/* Unlayered \`:host\` rules beat \`ux-preload\`'s layered \`:host{display:none}\` default. */
:host {
  display: block;
  box-sizing: border-box;
  contain: layout style;
  pointer-events: auto;
  color-scheme: inherit;
}

:host-context(html[data-theme=light]),
:host([data-theme=light]) {
  color-scheme: light only;
}

:host-context(html[data-theme=dark]),
:host([data-theme=dark]) {
  color-scheme: dark only;
}

:host([open]) {
  animation: qs-pop-in 140ms cubic-bezier(0.22, 0.8, 0.3, 1);
}

:host([hidden]) {
  display: none !important;
}

@keyframes qs-pop-in {
  from {
    opacity: 0;
    transform: translateY(6px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
@layer components {
  .qs-panel {
    /*
     * NOTE: \`--qs-*\` are component-scoped aliases DERIVED from canonical \`--color-*\`
     * (source of truth: veela \`core/misc/_tokens.scss\`). Values already trace to canonical;
     * the local aliases remain as the QuickSettings contract + shadow-DOM self-sufficiency.
     * Use sites chain \`var(--color-*, var(--qs-*))\` so canonical wins when veela is loaded.
     */
    --qs-primary: var(--color-primary);
    --qs-surface: var(--color-surface);
    --qs-on-surface: var(--color-on-surface);
    --qs-outline: color-mix(in oklab, var(--color-outline-variant) 80%, transparent);
    box-sizing: border-box;
    display: grid;
    gap: 0.85rem;
    inline-size: min(360px, 100vw - 1.5rem);
    max-inline-size: 360px;
    min-inline-size: 320px;
    padding: 0.9rem;
    border-radius: 14px;
    border: 1px solid var(--qs-outline);
    background: var(--qs-surface);
    /* WHY: contrast-color()/inherit() need Chrome flags; replaceSync then drops later rules (sliders, footer). */
    color: var(--color-on-surface, var(--qs-on-surface));
    /* INVARIANT: no backdrop-filter — Win11-like solid panel per spec, keeps perf on low-end devices. */
    box-shadow: 0 20px 48px -20px rgba(0, 0, 0, 0.4), 0 2px 8px -2px rgba(0, 0, 0, 0.25);
    font: 500 0.85rem/1.3 ui-sans-serif, system-ui, sans-serif;
    pointer-events: auto;
  }
  .qs-tiles {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 0.5rem;
  }
  .qs-tile-icon {
    /* WHY: Phosphor default --icon-padding: 0.45rem shrinks glyphs to dots in a 1.35rem slot. */
    --icon-size: 1.5rem;
    --icon-padding: 0;
    --icon-color: currentColor;
    flex: 0 0 auto;
    inline-size: var(--icon-size);
    block-size: var(--icon-size);
    min-inline-size: var(--icon-size);
    min-block-size: var(--icon-size);
    line-height: 0;
    color: color-mix(in oklab, var(--color-on-surface, var(--qs-on-surface)) 55%, var(--color-primary, var(--qs-primary)));
  }
  .qs-tile {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    min-inline-size: 0;
    padding: 0.55rem 0.65rem;
    border: none;
    border-radius: 10px;
    color: inherit;
    background: color-mix(in oklab, var(--qs-on-surface) 8%, transparent);
    color: var(--color-on-surface, var(--qs-on-surface));
    text-align: start;
    cursor: pointer;
    transition: background-color 140ms ease, color 140ms ease;
  }
  .qs-tile:hover {
    background: color-mix(in oklab, var(--qs-on-surface) 14%, transparent);
  }
  .qs-tile:active {
    background: color-mix(in oklab, var(--qs-on-surface) 18%, transparent);
  }
  .qs-tile:focus-visible {
    outline: 2px solid var(--color-primary, var(--qs-primary));
    outline-offset: 2px;
  }
  .qs-tile[aria-pressed=true] {
    background: color-mix(in oklab, var(--color-primary, var(--qs-primary)) 26%, transparent);
    color: var(--color-primary, var(--qs-primary));
  }
  .qs-tile[aria-pressed=true] .qs-tile-icon {
    --icon-color: currentColor;
  }
  .qs-tile-text {
    display: flex;
    flex-direction: column;
    gap: 0.05rem;
    min-inline-size: 0;
    overflow: hidden;
    color: var(--color-on-surface, var(--qs-on-surface));
  }
  .qs-tile-label {
    font-size: 0.78rem;
    font-weight: 600;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: inherit;
  }
  .qs-tile-sub {
    font-size: 0.68rem;
    font-weight: 500;
    opacity: 0.7;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: inherit;
  }
  .qs-sliders {
    display: grid;
    gap: 0.6rem;
    padding-block-start: 0.7rem;
    border-block-start: 1px solid var(--qs-outline);
    color: var(--color-on-surface, var(--qs-on-surface));
  }
  .qs-slider-row {
    display: flex;
    align-items: center;
    gap: 0.65rem;
    cursor: default;
  }
  .qs-slider-icon {
    --icon-size: 1.35rem;
    --icon-padding: 0;
    --icon-color: currentColor;
    flex: 0 0 auto;
    inline-size: var(--icon-size);
    block-size: var(--icon-size);
    min-inline-size: var(--icon-size);
    min-block-size: var(--icon-size);
    line-height: 0;
    color: inherit;
  }
  .qs-slider-col {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    flex: 1 1 auto;
    min-inline-size: 0;
  }
  .qs-slider-label {
    font-size: 0.68rem;
    font-weight: 500;
    opacity: 0.75;
  }
  /* Minimal native range styling (Win11-like thin track + round thumb). */
  .qs-slider {
    appearance: none;
    -webkit-appearance: none;
    inline-size: 100%;
    block-size: 1.1rem;
    margin: 0;
    background: transparent;
    color: var(--color-on-surface, var(--qs-on-surface));
    cursor: pointer;
  }
  .qs-slider::-webkit-slider-runnable-track {
    block-size: 4px;
    border-radius: 999px;
    background: color-mix(in oklab, var(--qs-on-surface) 18%, transparent);
  }
  .qs-slider::-moz-range-track {
    block-size: 4px;
    border-radius: 999px;
    background: color-mix(in oklab, var(--qs-on-surface) 18%, transparent);
  }
  .qs-slider::-webkit-slider-thumb {
    appearance: none;
    -webkit-appearance: none;
    inline-size: 1rem;
    block-size: 1rem;
    margin-block-start: -6px;
    border-radius: 50%;
    border: none;
    background: var(--color-primary, var(--qs-primary));
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.35);
  }
  .qs-slider::-moz-range-thumb {
    inline-size: 1rem;
    block-size: 1rem;
    border-radius: 50%;
    border: none;
    background: var(--color-primary, var(--qs-primary));
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.35);
  }
  .qs-slider:focus-visible::-webkit-slider-thumb {
    outline: 2px solid var(--color-primary, var(--qs-primary));
    outline-offset: 2px;
  }
  .qs-footer {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: center;
    justify-content: flex-end;
    gap: 0.4rem;
    padding-block-start: 0.65rem;
    border-block-start: 1px solid var(--qs-outline);
  }
  .qs-footer-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    min-inline-size: 0;
    padding: 0.28rem 0.55rem;
    border: none;
    border-radius: 8px;
    background: color-mix(in oklab, var(--qs-on-surface) 8%, transparent);
    color: var(--color-on-surface, var(--qs-on-surface));
    font: 600 0.72rem/1.2 ui-sans-serif, system-ui, sans-serif;
    cursor: pointer;
    transition: background-color 140ms ease;
  }
  .qs-footer-btn:hover {
    background: color-mix(in oklab, var(--qs-on-surface) 14%, transparent);
  }
  .qs-footer-btn:active {
    background: color-mix(in oklab, var(--qs-on-surface) 18%, transparent);
  }
  .qs-footer-btn:focus-visible {
    outline: 2px solid var(--color-primary, var(--qs-primary));
    outline-offset: 2px;
  }
  .qs-footer-icon {
    --icon-size: 1.15rem;
    --icon-padding: 0;
    --icon-color: currentColor;
    flex: 0 0 auto;
    inline-size: var(--icon-size);
    block-size: var(--icon-size);
    min-inline-size: var(--icon-size);
    min-block-size: var(--icon-size);
    line-height: 0;
  }
}`})))()}function Ft(){if(mn?.isConnected)return mn;let e=ot(),t=e.querySelector(`ui-quick-settings`);return t||(t=document.createElement(`ui-quick-settings`),t.hidden=!0,e.appendChild(t)),mn=t,t}function It(e){ut(zt,()=>{let t=Ft(),n=document.documentElement.getAttribute(`data-theme`);return(n===`light`||n===`dark`)&&(t.dataset.theme=n,t.style.colorScheme=n),st(t,zt,{anchor:e}),t.open(),{kind:zt,el:t,close:()=>{t.close(),H(zt)},contains:e=>e instanceof Node&&t.contains(e)}})}function Lt(){H(zt)}var Rt,zt,Bt,Vt,Ht,Ut,Wt,Gt,Kt,qt,Jt,Yt,Xt,Zt,Qt,$t,en,tn,nn,rn,an,on,sn,cn,ln,un,dn,fn,pn,mn;function hn(){return(hn=e((()=>{T(),r(),l(),V(),se(),Mt(),dt(),Pt(),Rt=f(Nt),zt=`quick-settings`,Bt=`data-theme`,Vt=`rs-appearance-theme`,Ht=`appearance.theme`,Ut=[`rs-settings`,`cwsp-settings`,`u2-settings`],Wt=()=>{try{return matchMedia?.(`(prefers-color-scheme: dark)`)?.matches??!0}catch{return!0}},Gt=e=>{for(let t of Ut)try{let n=localStorage.getItem(t);if(!n)continue;let r=JSON.parse(n);if(!r||typeof r!=`object`)continue;r.appearance={...r.appearance??{},theme:e},localStorage.setItem(t,JSON.stringify(r))}catch{}},Kt=()=>{try{let e=document.documentElement.getAttribute(Bt);if(e===`light`||e===`dark`)return e;let t=localStorage.getItem(Vt);if(t===`light`||t===`dark`)return t}catch{}return Wt()?`dark`:`light`},qt=e=>{let t=document.documentElement,n=e===`auto`?Wt()?`dark`:`light`:e,r=e===`auto`?`auto`:e;t.setAttribute(`data-scheme`,r),t.setAttribute(Bt,n),t.style.colorScheme=n;try{document.body&&(document.body.style.colorScheme=n)}catch{}try{document.querySelectorAll(`.env-shell-root, [data-shell], ui-window`).forEach(e=>{let t=e;t.dataset.theme=n,t.style.colorScheme=n;let r=t.shadowRoot?.querySelector?.(`.app-shell`);r&&(r.dataset.theme=n,r.style.colorScheme=n)})}catch{}try{localStorage.setItem(Vt,e===`auto`?`auto`:e),localStorage.setItem(Ht,e===`auto`?`auto`:e)}catch{}e!==`auto`&&Gt(e),t.dispatchEvent(new CustomEvent(`u2-theme-change`,{bubbles:!0,detail:{source:`quick-settings`,theme:n,preference:e}}))},Jt=()=>{try{let e=String(localStorage.getItem(Vt)||``).trim().toLowerCase();if(e===`light`||e===`dark`||e===`auto`)return e;let t=String(localStorage.getItem(Ht)||``).trim().toLowerCase();if(t===`light`||t===`dark`||t===`auto`)return t}catch{}return`auto`},Yt=()=>{let e=globalThis;if(e.__CWSP_AUTO_THEME_FOLLOW__)return;e.__CWSP_AUTO_THEME_FOLLOW__=!0;let t=typeof matchMedia==`function`?matchMedia(`(prefers-color-scheme: dark)`):null;if(!t)return;let n=()=>{Jt()===`auto`&&qt(`auto`)};try{t.addEventListener(`change`,n)}catch{try{t.addListener(n)}catch{}}try{n()}catch{}},Xt=e=>{document.documentElement.style.setProperty(`--orientation-lock`,e?`unlocked`:`locked`),document.documentElement.style.setProperty(`--orientation-lock-angle`,e?`0deg`:`90deg`),Promise.try(async()=>{try{let t=screen.orientation;if(e){t.unlock?.();return}if(typeof t.lock!=`function`)return;let n=t.lock(t.type||`natural`);n&&typeof n.catch==`function`&&await n.catch(()=>{})}catch(e){console.warn(e)}})?.catch?.(console.warn.bind(console))},Zt=`env-night-filter`,Qt=`2147483001`,$t=`rs-night-filter`,en=`rs-brightness-filter`,tn=e=>Math.max(0,Math.min(100,Number.isFinite(e)?e:0)),nn=()=>{let e=document.getElementById(Zt);if(e instanceof HTMLElement)return e;let t=document.createElement(`div`);return t.id=Zt,t.setAttribute(`aria-hidden`,`true`),t.style.cssText=[`dynamic-range-limit:no-limit`,`color-space:display-p3`,`position:fixed`,`inset:0`,`pointer-events:none`,`z-index:${Qt}`,`background-color:color(display-p3 1 0.55 0.24)`,`mix-blend-mode:multiply`,`opacity:0`,`visibility:hidden`,`transition:opacity 160ms ease`].join(`;`),(document.body??document.documentElement).appendChild(t),t},rn=e=>{let t=tn(e),n=nn(),r=t/100;n.style.opacity=String(r),n.style.visibility=r>=.01?`visible`:`hidden`;try{localStorage.setItem($t,String(t))}catch{}},an=e=>{let t=tn(e);nn(),t<=50?.4+t/50*.6:1+(t-50)/50*.2;try{localStorage.setItem(en,String(t))}catch{}},on=(e,t)=>{try{let n=localStorage.getItem(e);if(n==null)return t;let r=Number(n);return Number.isFinite(r)?tn(r):t}catch{return t}},sn=()=>{let e=on($t,0),t=on(en,50);return rn(e),an(t),{night:e,brightness:t}},typeof document<`u`&&(document.readyState===`loading`?document.addEventListener(`DOMContentLoaded`,()=>sn(),{once:!0}):sn()),cn=[`wifi`,`bluetooth`,`focus`,`airplane`,`orientation`],ln={light:`sun`,dark:`moon`},un={light:`Light`,dark:`Dark`},dn=e=>{let t=e.querySelector(`[data-qs-tile="theme"]`);if(!t)return;let n=Kt();t.querySelector(`ui-icon`)?.setAttribute(`icon`,ln[n]);let r=t.querySelector(`[data-qs-tile-sub]`);r&&(r.textContent=un[n]),t.setAttribute(`aria-pressed`,n===`dark`?`true`:`false`)},fn=e=>{let t=e.shadowRoot,n=t?.querySelector(`.qs-panel`);if(!t||!n||n.hasAttribute(`data-qs-wired`))return;n.setAttribute(`data-qs-wired`,``),dn(t),t.querySelector(`[data-qs-tile="theme"]`)?.addEventListener(`click`,()=>{let e=Kt()===`dark`?`light`:`dark`;qt(e),dn(t)});let r=e=>!!e?.getAttribute?.(`aria-pressed`)&&e?.getAttribute?.(`aria-pressed`)===`true`;t.querySelector?.(`[data-qs-tile="orientation"]`)?.addEventListener?.(`click`,e=>{let t=o((e?.target?.matches?.(`[data-qs-tile="orientation"]`)?e?.target:e?.target?.querySelector?.(`[data-qs-tile="orientation"]`))||e?.target,`[data-qs-tile="orientation"]`),n=r(t);Xt(n);let i=t?.matches?.(`ui-icon`)?t:t?.querySelector?.(`ui-icon`);i&&i.setAttribute?.(`icon`,n?`device-rotate`:`lock`),i&&i.setAttribute?.(`icon-style`,`duotone`)});for(let e of cn){let n=t.querySelector(`[data-qs-tile="${e}"]`);n&&n.addEventListener(`click`,()=>{let e=n.getAttribute(`aria-pressed`)!==`true`;n.setAttribute(`aria-pressed`,String(e));let t=n.querySelector(`[data-qs-tile-sub]`);t&&(t.textContent=e?`On`:`Off`)})}let{night:i,brightness:a}=sn(),s=t.querySelector(`[data-qs-slider="night"]`),c=t.querySelector(`[data-qs-slider="brightness"]`);s&&(s.value=String(i),s.addEventListener(`input`,()=>rn(s.valueAsNumber))),c&&(c.value=String(a),c.addEventListener(`input`,()=>an(c.valueAsNumber)));let l=e=>{Lt();let t=()=>{let t=Dt();if(typeof t==`function`){t(e,{});return}let n=`#${e}`;typeof location<`u`&&location.hash!==n&&E(n)};typeof requestAnimationFrame==`function`?requestAnimationFrame(t):queueMicrotask(t)};t.querySelectorAll(`[data-qs-open]`).forEach(e=>{e.addEventListener(`click`,()=>{let t=String(e.getAttribute(`data-qs-open`)||``).trim();(t===`settings`||t===`explorer`)&&l(t)})})},pn=class extends B{constructor(){super()}styles=()=>Rt;render=()=>v`
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
    <div class="qs-footer" part="footer" role="group" aria-label="Open apps">
        <button type="button" class="qs-footer-btn" part="footer-btn" data-qs-open="explorer" role="menuitem" title="Explorer">
            <ui-icon class="qs-footer-icon" icon="books" icon-style="duotone" aria-hidden="true"></ui-icon>
            <span>Explorer</span>
        </button>
        <button type="button" class="qs-footer-btn" part="footer-btn" data-qs-open="settings" role="menuitem" title="Settings">
            <ui-icon class="qs-footer-icon" icon="gear-six" icon-style="duotone" aria-hidden="true"></ui-icon>
            <span>Settings</span>
        </button>
    </div>
</div>`;onRender(){return super.onRender(),fn(this),this}open(){dn(this.shadowRoot),this.removeAttribute(`hidden`),this.hidden=!1,this.setAttribute(`open`,``)}close(){this.hidden=!0,this.setAttribute(`hidden`,``),this.removeAttribute(`open`)}toggle(e){this.hasAttribute(`open`)?this.close():this.open()}},pn=z([x(`ui-quick-settings`)],pn),mn=null,Promise.try(()=>{typeof requestAnimationFrame==`function`&&requestAnimationFrame(()=>{Promise.try(async()=>{let e=screen?.orientation?.lock;if(typeof e!=`function`)return;let t=e.call(screen.orientation,`natural`);t&&typeof t.catch==`function`&&await t.catch(()=>{})}).catch(()=>{})})}).catch(()=>{});try{Yt()}catch{}})))()}var gn;function _n(){return(_n=e((()=>{gn=`/*
 * Filename: statusbar.scss
 * FullPath: modules/projects/fl.ui/src/ui/navigation/statusbar/statusbar.scss
 * Change date and time: 14.00.00_31.07.2026
 * Reason for changes: Mobile/fullscreen transparent overlay statusbar + desktop footer.
 */
/* Shadow layout for <ui-statusbar> slots. */
:host(ui-statusbar) {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 0.35rem;
  box-sizing: border-box;
  inline-size: 100%;
  color: var(--env-status-fg, var(--wallpaper-contrast-color, CanvasText));
  background: transparent;
}

:host(ui-statusbar) .left,
:host(ui-statusbar) .center,
:host(ui-statusbar) .right {
  display: flex;
  align-items: center;
  min-inline-size: 0;
  background: transparent;
  padding-block-start: 0.5rem;
}

:host(ui-statusbar) .left {
  flex: 0 1 auto;
  justify-content: flex-start;
  padding-inline-start: max(1rem, env(safe-area-inset-left, 0));
}

:host(ui-statusbar) .center {
  flex: 1 1 auto;
  justify-content: center;
}

:host(ui-statusbar) .right {
  flex: 0 1 auto;
  justify-content: flex-end;
  margin-inline-start: auto;
  padding-inline-end: max(1rem, env(safe-area-inset-right, 0));
}

@media screen and (pointer: fine) and ((min-width: 768px) or (hover: hover)) {
  :host(ui-statusbar), ui-statusbar {
    display: none !important;
  }
}
@layer components {
  /* Desktop footer statusbar (inside bottom chrome stack). */
  .env-ui-statusbar {
    order: 1;
    padding: 0.35rem 0.65rem calc(0.35rem + env(safe-area-inset-bottom, 0));
    background: color-mix(in oklab, var(--color-surface-container, --u2-color-mod(var(--base-color, #5a9ec8), 960)) 88%, transparent);
    border-block-start: 1px solid var(--wf-md-outline-variant, var(--color-outline-variant));
    backdrop-filter: blur(10px);
    color: var(--color-on-surface, --u2-color-mod(var(--base-color, #5a9ec8), 100));
  }
  .env-ui-statusbar__intro p {
    margin: 0.1rem 0;
    opacity: 0.92;
  }
  .env-ui-statusbar__right {
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
  .env-ui-statusbar__clock {
    font: 600 0.8125rem/1 ui-sans-serif, system-ui, sans-serif;
    font-variant-numeric: tabular-nums;
    letter-spacing: 0.01em;
    color: inherit;
    user-select: none;
    pointer-events: auto;
    cursor: pointer;
    border-radius: 0.35rem;
    padding: 0.15rem 0.25rem;
  }
  .env-ui-statusbar__clock:hover,
  .env-ui-statusbar__clock:focus-visible {
    background: color-mix(in oklch, currentColor 12%, transparent);
    color: contrast-color(inherit(background-color));
    outline: none;
  }
  .env-device-tray--footer {
    pointer-events: auto;
    cursor: pointer;
    border-radius: 0.35rem;
  }
  .env-device-tray--footer:hover,
  .env-device-tray--footer:focus-visible {
    background: color-mix(in oklch, currentColor 12%, transparent);
    color: contrast-color(inherit(background-color));
    outline: none;
  }
  .env-status-bar__tray {
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    gap: 0.35rem;
  }
  .env-status-bar__chip {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.12rem 0.35rem;
    border-radius: 999px;
    background: color-mix(in oklch, var(--env-status-fg, var(--wf-md-on-surface, white)) 10%, transparent);
    border: 1px solid color-mix(in oklch, var(--env-status-fg, var(--wf-md-on-surface, white)) 18%, transparent);
    line-height: 1;
    color: inherit;
    color: contrast-color(inherit(background-color));
    font-variant-numeric: tabular-nums;
  }
  .env-status-bar__chip span {
    font-variant-numeric: tabular-nums;
  }
  .env-status-bar__chip ui-icon {
    /* WHY: Phosphor default padding shrinks status glyphs; size the slot explicitly. */
    --icon-size: 1.15rem;
    --icon-padding: 0;
    --icon-color: var(--env-status-fg, var(--wallpaper-contrast-color, currentColor));
    display: block;
    inline-size: var(--icon-size);
    block-size: var(--icon-size);
    min-inline-size: var(--icon-size);
    min-block-size: var(--icon-size);
    font-size: var(--icon-size);
    color: var(--icon-color);
  }
  .env-status-bar__pct {
    font-variant-numeric: tabular-nums;
    opacity: 0.95;
  }
  .env-status-bar__meta {
    margin: 0;
    opacity: 0.88;
    font-size: 11px;
  }
  /*
   * Overlay statusbar: fixed top band over wallpaper / window title spacer.
   * Shown when \`.env-shell-chrome[data-status-overlay]\` (mobile browser or fullscreen; not standalone).
   */
  .env-shell-chrome[data-status-overlay] .env-ui-statusbar,
  .env-shell-root[data-status-overlay] > .env-shell-chrome .env-ui-statusbar {
    position: fixed;
    inset-inline: 0;
    inset-block-start: 0;
    inset-block-end: auto;
    z-index: calc(var(--env-z-shell-chrome, 2147483000) + 2);
    order: unset;
    display: flex;
    align-items: center;
    /* INVARIANT: same token as ui-window title spacer (\`--env-status-inset-top\`). */
    block-size: var(--env-status-inset-top, max(2rem, env(safe-area-inset-top, 0px)));
    min-block-size: var(--env-status-inset-top, max(2rem, env(safe-area-inset-top, 0px)));
    padding: 0 0.75rem;
    box-sizing: border-box;
    background: transparent !important;
    border: 0 !important;
    backdrop-filter: none !important;
    -webkit-backdrop-filter: none !important;
    --icon-color: var(--env-status-fg, var(--wallpaper-contrast-color));
    color: var(--env-status-fg, var(--wallpaper-contrast-color));
    pointer-events: none;
  }
  .env-shell-chrome[data-status-overlay] .env-ui-statusbar__intro,
  .env-shell-chrome[data-status-overlay] .env-status-bar__meta {
    display: none !important;
  }
  .env-shell-chrome[data-status-overlay] .env-ui-statusbar__clock {
    display: block;
    font-size: 0.875rem;
    color: var(--env-status-fg, var(--wallpaper-contrast-color));
  }
  .env-shell-chrome[data-status-overlay] .env-device-tray--footer,
  .env-shell-chrome[data-status-overlay] .env-status-bar__chip {
    color: var(--env-status-fg, var(--wallpaper-contrast-color));
  }
  .env-shell-chrome[data-status-overlay] .env-status-bar__chip ui-icon {
    --icon-size: 1.25rem;
    --icon-padding: 0;
    --icon-color: var(--env-status-fg, var(--wallpaper-contrast-color));
    inline-size: var(--icon-size);
    block-size: var(--icon-size);
    min-inline-size: var(--icon-size);
    min-block-size: var(--icon-size);
    font-size: var(--icon-size);
    color: var(--icon-color);
  }
  .env-shell-chrome[data-status-overlay] .env-status-bar__pct {
    font-size: 0.8125rem;
  }
  .env-shell-chrome[data-status-overlay] .env-device-tray--footer {
    display: flex !important;
  }
  .env-shell-chrome[data-status-overlay] .env-status-bar__chip {
    background: transparent;
    border-color: transparent;
    padding-inline: 0.15rem;
  }
  /* Standalone PWA: no shell statusbar (OS / home chrome owns that). */
  .env-shell-chrome[data-standalone] .env-ui-statusbar,
  .env-shell-root[data-standalone] .env-shell-chrome:not([data-desktop]) .env-ui-statusbar {
    display: none !important;
  }
  /* Desktop footer: hide clock (taskbar has its own). */
  .env-shell-chrome[data-desktop]:not([data-status-overlay]) .env-ui-statusbar__clock {
    display: none !important;
  }
  /*
   * WHY: Desktop native-mode (WCO) hides env chrome. On mobile the Home dock must stay —
   * it is the only leave-view control (no title Close). Overlay statusbar also hides with chrome.
   */
  .env-shell-root[data-env-native-task] .env-shell-chrome[data-desktop],
  env-shell-container[data-env-native-task] .env-shell-chrome[data-desktop] {
    opacity: 0;
    visibility: hidden;
    pointer-events: none;
  }
}`})))()}function vn(){if(typeof matchMedia!=`function`)return`unknown`;try{if(matchMedia(`(display-mode: window-controls-overlay)`).matches)return`window-controls-overlay`;if(matchMedia(`(display-mode: fullscreen)`).matches)return`fullscreen`;if(matchMedia(`(display-mode: standalone)`).matches)return`standalone`;if(matchMedia(`(display-mode: minimal-ui)`).matches)return`minimal-ui`;if(matchMedia(`(display-mode: browser)`).matches)return`browser`}catch{}return`unknown`}function yn(){let e=vn();if(e===`standalone`||e===`minimal-ui`)return!0;try{if(navigator.standalone===!0)return!0}catch{}return!1}function bn(){if(typeof document<`u`&&document.documentElement.dataset.cwspNativeShell===`capacitor`)return!0;try{let e=globalThis.Capacitor;return typeof e?.isNativePlatform==`function`&&!!e.isNativePlatform()}catch{return!1}}function xn(e){if(bn()||(e.standalone??yn()))return!1;let t=e.displayMode??vn(),n=typeof document<`u`&&!!(document.fullscreenElement||document.webkitFullscreenElement);return t===`fullscreen`||n?!0:!e.desktop}function Sn(e=new Date){let t=e=>String(e).padStart(2,`0`);return{time:`${t(e.getHours())}:${t(e.getMinutes())}`,date:`${t(e.getDate())}.${t(e.getMonth()+1)}.${e.getFullYear()}`}}function Cn(e=new Date){return Sn(e).time}function wn(e){let t=!1,n=null,r=(e,t=48)=>{let n=0,r=0,i=0;for(let a=0;a<e.length;a+=4*t){if((e[a+3]??255)<16)continue;let t=e[a]/255,o=e[a+1]/255,s=e[a+2]/255;i=Math.max(i,t,o,s),n+=.2126*t+.7152*o+.0722*s,r++}return r<8||i<.02?null:n/r},i=t=>{let n=t>.55;e.style.setProperty(`--env-status-fg`,n?`#1c1c1e`:`#f5f5f7`),e.style.setProperty(`--env-status-fg-muted`,n?`rgba(28,28,30,0.72)`:`rgba(245,245,247,0.78)`),e.dataset.statusContrast=n?`dark`:`light`},a=()=>{e.style.setProperty(`--env-status-fg`,`var(--wallpaper-contrast-color)`),e.style.setProperty(`--env-status-fg-muted`,`color-mix(in oklab, var(--wallpaper-contrast-color) 78%, transparent)`),e.dataset.statusContrast=`wallpaper`},o=t=>{I(t,[e]),e.dataset.launcherContrast=t>.52?`dark`:`light`},s=()=>{try{for(let t of document.querySelectorAll(`ui-window[managed]`)){if(t.hidden||t.hasAttribute(`hidden`)||t.getAttribute(`aria-hidden`)===`true`)continue;let n=getComputedStyle(t);if(n.display!==`none`&&n.visibility!==`hidden`&&Number(n.opacity)!==0&&(t.hasAttribute(`data-status-gap`)||t.hasAttribute(`data-status-overlay-gap`)||t.getBoundingClientRect().top<Math.max(8,parseFloat(getComputedStyle(e).getPropertyValue(`--env-status-inset-top`))||32)+8))return!0}}catch{}return!1},c=()=>{if(t)return;let n=(document.documentElement.getAttribute(`data-theme`)||``).toLowerCase(),c=s();c&&n===`light`?i(.9):c&&n===`dark`?i(.15):a();try{let t=e.querySelector(`.env-shell-wallpaper canvas`)||document.querySelector(`.env-shell-wallpaper canvas`);if(t instanceof HTMLCanvasElement&&t.width>0&&t.height>0){let e=t.getContext(`2d`,{willReadFrequently:!0});if(e){let n=t.width,i=Math.max(0,Math.round(t.height*.28)),s=Math.max(1,Math.round(t.height*.36)),l=r(e.getImageData(0,i,n,Math.min(s,t.height-i)).data);if(l!=null){o(l),c||a();return}}}}catch{}},l=()=>{n!=null&&clearTimeout(n),n=setTimeout(c,120)};c();let u=typeof MutationObserver==`function`?new MutationObserver(l):null,d=e.querySelector(`.env-shell-wallpaper`)||document.querySelector(`.env-shell-wallpaper`);d&&u&&u.observe(d,{childList:!0,subtree:!0,attributes:!0});let f=typeof MutationObserver==`function`?new MutationObserver(l):null;f?.observe(document.documentElement,{childList:!0,subtree:!0,attributes:!0,attributeFilter:[`hidden`,`data-status-gap`,`data-theme`,`aria-hidden`,`style`,`class`]}),window.addEventListener(`resize`,l),document.addEventListener(`visibilitychange`,l),document.addEventListener(`env-chrome-surface`,l),document.addEventListener(`u2-theme-change`,l);let p=typeof matchMedia==`function`?matchMedia(`(prefers-color-scheme: dark)`):null;p?.addEventListener?.(`change`,l);let m=setInterval(c,8e3);return()=>{t=!0,n!=null&&clearTimeout(n),clearInterval(m),u?.disconnect(),f?.disconnect(),window.removeEventListener(`resize`,l),document.removeEventListener(`visibilitychange`,l),document.removeEventListener(`env-chrome-surface`,l),document.removeEventListener(`u2-theme-change`,l),p?.removeEventListener?.(`change`,l)}}function Tn(e){return e.connection}function En(e){let t=e.toLowerCase();return t===`slow-2g`?`wifi-low`:t===`2g`?`wifi-medium`:`wifi-high`}function Dn(){let e=k(`wifi-high`),t=k(``),n=k(`battery-full`),r=k(``),i=k(``),a=()=>{if(!navigator.onLine){e.value=`wifi-slash`,t.value=`Offline`;return}let n=Tn(navigator);if(!n||typeof n.effectiveType!=`string`){e.value=`globe`,t.value=`Online (connection details unavailable)`;return}let r=String(n.effectiveType||``).toLowerCase(),i=typeof n.downlink==`number`?`${n.downlink} Mb/s`:``,a=n.saveData?` · Data saver`:``;t.value=[r.toUpperCase(),i].filter(Boolean).join(` · `)+a,e.value=En(r)},o=null,s=null,c=null,l=(e,t)=>{let a=Math.max(0,Math.min(100,Math.round(e*100)));if(i.value=`${a}%`,t){n.value=`battery-charging-vertical`,r.value=`Charging · ${i.value}`;return}r.value=`Battery · ${i.value}`,e<=.08?n.value=`battery-warning`:e<=.22?n.value=`battery-low`:e<=.5?n.value=`battery-medium`:e<=.8?n.value=`battery-high`:n.value=`battery-full`};a(),window.addEventListener(`online`,a),window.addEventListener(`offline`,a);let u=Tn(navigator);return u?.addEventListener?.(`change`,a),typeof navigator.getBattery==`function`?navigator.getBattery().then(e=>{c=e,o=()=>l(e.level,e.charging),s=o,e.addEventListener(`levelchange`,o),e.addEventListener(`chargingchange`,s),l(e.level,e.charging)}):(n.value=`question`,r.value=`Battery status not supported in this browser`,i.value=`—`),{networkIcon:e,networkTitle:t,batteryIcon:n,batteryTitle:r,batteryPct:i,dispose:()=>{window.removeEventListener(`online`,a),window.removeEventListener(`offline`,a),u?.removeEventListener?.(`change`,a),c&&o&&s&&(c.removeEventListener(`levelchange`,o),c.removeEventListener(`chargingchange`,s))}}}function On(e,t){let n=v`<div class="env-status-bar__tray ${t}">
        <span class="env-status-bar__chip" title=${e.networkTitle} aria-label=${e.networkTitle}>
            <ui-icon icon=${e.networkIcon} aria-hidden="true"></ui-icon>
        </span>
        <span class="env-status-bar__chip" title=${e.batteryTitle} aria-label=${e.batteryTitle}>
            <ui-icon icon=${e.batteryIcon} aria-hidden="true"></ui-icon>
            <span class="env-status-bar__pct"></span>
        </span>
    </div>`,r=n.querySelector(`.env-status-bar__pct`);return r instanceof HTMLElement&&u(r,{properties:{textContent:e.batteryPct}}),n}function kn(e,t,n){let r=document.createElement(`ui-statusbar`);r.className=`env-ui-statusbar wf-chrome-no-select`,r.setAttribute(`part`,`status-bar`);let i=document.createElement(`div`);i.slot=`left`,i.className=`env-ui-statusbar__left`;let a=document.createElement(`time`);a.className=`env-ui-statusbar__clock`,a.dateTime=``,a.textContent=Cn(),a.setAttribute(`role`,`button`),a.setAttribute(`tabindex`,`0`),a.setAttribute(`aria-label`,`Calendar`),a.setAttribute(`aria-haspopup`,`dialog`),a.setAttribute(`data-chrome-flyout-anchor`,`calendar`);let o=document.createElement(`div`);o.className=`env-ui-statusbar__intro`,t&&(o.innerHTML=t),i.append(a,o);let s=document.createElement(`div`);s.slot=`center`;let c=document.createElement(`p`);c.className=`env-status-bar__meta`,s.appendChild(c);let l=document.createElement(`div`);l.slot=`right`,l.className=`env-ui-statusbar__right`;let u=On(n,`env-device-tray env-device-tray--footer`);u.setAttribute(`role`,`button`),u.setAttribute(`tabindex`,`0`),u.setAttribute(`aria-label`,`Quick settings`),u.setAttribute(`aria-haspopup`,`dialog`),u.setAttribute(`data-chrome-flyout-anchor`,`quick-settings`),l.appendChild(u);let d=e=>{e.preventDefault(),e.stopPropagation(),yt(a)},f=e=>{e.preventDefault(),e.stopPropagation(),It(u)};a.addEventListener(`click`,d),a.addEventListener(`keydown`,e=>{(e.key===`Enter`||e.key===` `)&&d(e)}),u.addEventListener(`click`,f),u.addEventListener(`keydown`,e=>{(e.key===`Enter`||e.key===` `)&&f(e)}),r.append(i,s,l),ee(()=>{let t=e.navEcho.value?` │ ${e.navEcho.value}`:``;c.textContent=`doc=${e.selectedPath.value} │ viewer=${e.viewerStatus.value} │ layout=${e.mqLabel.value}${t}`},[e.selectedPath,e.viewerStatus,e.mqLabel,e.navEcho],{triggerImmediately:!0});let p=()=>{let e=new Date;a.textContent=Cn(e),a.dateTime=e.toISOString()};p();let m=setInterval(p,15e3);return{element:r,dispose:()=>{clearInterval(m)}}}var An,jn;function Mn(){return(Mn=e((()=>{T(),te(),M(),ae(),Et(),hn(),V(),_n(),l(),An=f(gn),jn=class extends Ze{constructor(){super()}styles=()=>An;render=()=>v`
<div style="background-color: transparent;" part="left"   class="left"  ><slot name="left"  ></slot></div>
        <div style="background-color: transparent;" part="center" class="center"><slot name="center"></slot></div>
        <div style="background-color: transparent;" part="right"  class="right" ><slot name="right" ></slot></div>`},jn=z([x(`ui-statusbar`)],jn)})))()}function Nn(){return(Nn=e((()=>{T(),Fe(),le()})))()}function U(e){globalThis.dispatchEvent?.(new CustomEvent(`view:toast`,{detail:{type:`success`,message:String(e||``)}}))}function W(e){globalThis.dispatchEvent?.(new CustomEvent(`view:toast`,{detail:{type:`error`,message:String(e||``)}}))}function Pn(){if(G)return G;try{let e=localStorage.getItem(Hn);if(!e)return G={},G;let t=JSON.parse(e);G=t&&typeof t==`object`?t:{}}catch{G={}}return G}function Fn(e){G=e;try{localStorage.setItem(Hn,JSON.stringify(e))}catch{}}function In(e){let t=e&&typeof e==`object`?e:{},n=t.extras&&typeof t.extras==`object`?t.extras:{},r={};for(let[e,t]of Object.entries(n)){let n=String(e||``).trim();n&&(typeof t==`boolean`||typeof t==`number`||typeof t==`string`)&&(r[n]=t)}let i=Array.isArray(t.flags)?t.flags.map(e=>String(e||``).trim().toUpperCase()).filter(Boolean):[],a=Array.isArray(t.categories)?t.categories.map(e=>String(e||``).trim()).filter(Boolean):[];return{action:String(t.action||``).trim(),data:Wn(String(t.data||``)),mimeType:String(t.mimeType||``).trim(),extras:r,flags:i,categories:a,componentName:String(t.componentName||``).trim()}}function Ln(e){return!e||!e.action&&!e.data&&!e.mimeType&&!e.componentName&&(!e.flags||e.flags.length===0)&&(!e.categories||e.categories.length===0)&&(!e.extras||Object.keys(e.extras).length===0)}function Rn(e){let t=Un(e);return!t||t===`app:`?{}:In(Pn()[t])}function zn(e,t){let n=Un(e);if(!n||n===`app:`)return{};let r=In(t),i={...Pn()};return Ln(r)?delete i[n]:i[n]=r,Fn(i),r}function Bn(e){let t=Un(e);if(!t||t===`app:`)return;let n={...Pn()};delete n[t],Fn(n)}function Vn(e){return Rn(e)}var Hn,G,Un,Wn;function Gn(){return(Gn=e((()=>{Hn=`cwsp-app-launch-spec-v1`,G=null,Un=e=>`app:${String(e||``).trim()}`,Wn=e=>{let t=String(e||``).trim();return!t||/^javascript:/i.test(t)?``:t}})))()}function Kn(e,t=64){let n=String(e||``).trim();if(!n||!/^https?:\/\//i.test(n))return``;try{let e=new URL(n).hostname;return e?`https://www.google.com/s2/favicons?domain=${encodeURIComponent(e)}&sz=${t}`:``}catch{return``}}function qn(e){let t=String(e||``).trim().toLowerCase();return t?t.includes(`/_favicon/`)||t.includes(`s2/favicons`)||t.includes(`favicon`)?!0:(t.startsWith(`android-icon:`),!1):!1}function Jn(e){let t=String(e||``).trim();return t?/^[a-z][a-z0-9+.-]*:/i.test(t)?t:`https://${t}`:``}function Yn(e){_r=e}function Xn(e){let t=e||(globalThis.chrome?.bookmarks??null);return!t?.getTree||!t?.getChildren?null:{resolveIconUrl:(e,t=128)=>{let n=String(e||``).trim();if(!/^https?:\/\//i.test(n))return``;let r=Kn(n,t);if(r)return r;try{let e=globalThis.chrome?.runtime;if(typeof e?.getURL==`function`){let r=new URL(e.getURL(`/_favicon/`));return r.searchParams.set(`pageUrl`,n),r.searchParams.set(`size`,String(t)),r.toString()}}catch{}return``},async listChildren(e){if(e)return(await yr(t,`getChildren`,e)||[]).map(br);let n=await yr(t,`getTree`)||[],r=[];for(let e of n)for(let t of e.children||[])r.push(br(t));return r},async search(e){let n=String(e||``).trim();if(!n)return this.listChildren();if(typeof t.search!=`function`){let e=await this.listChildren(),t=n.toLowerCase();return e.filter(e=>e.title.toLowerCase().includes(t)||String(e.url||``).toLowerCase().includes(t))}return(await yr(t,`search`,n)||[]).map(br)},async open(e){if(e.folder)return;let t=String(e.url||``).trim();if(t){try{let e=globalThis.chrome?.tabs;if(typeof e?.create==`function`){await Promise.resolve(e.create({url:t}));return}}catch{}globalThis.open?.(t,`_blank`,`noopener,noreferrer`)}},async remove(e){let n=String(e?.id||``).trim();if(!n)return!1;try{if(e.folder){if(typeof t.removeTree!=`function`)return!1;await yr(t,`removeTree`,n)}else{if(typeof t.remove!=`function`)return!1;await yr(t,`remove`,n)}return!0}catch{return!1}},async update(e,n){let r=String(e||``).trim();if(!r||typeof t.update!=`function`)return null;let i={};if(n.title!=null&&(i.title=String(n.title||``).trim()),n.url!=null){let e=Jn(n.url);e&&(i.url=e)}try{let e=await yr(t,`update`,r,i);return e?br(e):null}catch{return null}},async create(e,n){if(typeof t.create!=`function`)return null;let r=String(n.title||``).trim();if(!r)return null;let i={parentId:String(e||`0`),title:r};if(n.url!=null){let e=Jn(n.url);if(!e)return null;i.url=e}let a=async e=>{let n=await yr(t,`create`,{...i,parentId:e});return n?br(n):null};try{return await a(i.parentId)}catch{if(i.parentId===`0`)try{return await a(`1`)}catch{return null}return null}}}}function Zn(){return _r||Xn()}function Qn(){return!!Zn()}function $n(){try{let e=localStorage.getItem(pr);if(!e)return[];let t=JSON.parse(e);return Array.isArray(t)?t.filter(e=>e&&e.id&&e.title).slice(0,hr):[]}catch{return[]}}function er(e){if(!e?.id||e.folder)return;let t=[e,...$n().filter(t=>t.id!==e.id)].slice(0,hr);try{localStorage.setItem(pr,JSON.stringify(t))}catch{}}function tr(){return xr(mr,gr)}function nr(e){return tr().some(t=>t.id===e)}function rr(e){if(!e?.id||e.folder||!String(e.url||``).trim())return!1;let t=[e,...tr().filter(t=>t.id!==e.id)].slice(0,gr);try{return localStorage.setItem(mr,JSON.stringify(t)),!0}catch{return!1}}function ir(e){let t=String(e||``).trim();if(!t)return!1;let n=tr().filter(e=>e.id!==t);try{return localStorage.setItem(mr,JSON.stringify(n)),!0}catch{return!1}}function ar(e){let t=String(e?.id||``).trim();if(!t)return;let n=n=>n.map(n=>n.id===t?{...n,title:e.title||n.title,url:e.url||n.url}:n);try{Sr(mr,n(tr()),gr),Sr(pr,n($n()),hr)}catch{}}function or(e){let t=String(e||``).trim();if(t){ir(t);try{Sr(pr,$n().filter(e=>e.id!==t),hr)}catch{}}}function sr(e,t=Cr){let n=String(e||``).trim();if(!n)return``;try{let e=new URL(n,globalThis.location?.href);if(e.searchParams.has(`pageUrl`))return e.searchParams.set(`size`,String(t)),e.toString();if(e.hostname.endsWith(`google.com`)&&e.pathname.includes(`favicon`))return e.searchParams.set(`sz`,String(t)),e.toString()}catch{}return n}function cr(e,t){let n=String(e.url||``).trim();return n&&(Kn(n,Cr)||Kn(n,128)||Kn(n,64)||t?.resolveIconUrl?.(n,Cr)||t?.resolveIconUrl?.(n,128))||``}function lr(e,t,n,r=``){return dr(e,t,String(r||``).trim()||sr(cr(e,n),Cr))}function ur(e,t=``){let n=String(e.url||``).trim();return JSON.stringify({state:{icon:e.folder?`folder`:`link`,label:e.title||n||`Bookmark`,action:e.folder?`open-path`:`open-link`},desc:{action:e.folder?`open-path`:`open-link`,href:e.folder?``:n,path:e.folder?`/bookmarks/${e.id}/`:`/bookmarks/${e.id}`,meta:{entityType:`bookmark`,bookmarkId:e.id,...t?{iconUrl:t}:{}}}})}function dr(e,t,n=``){if(e.folder||!String(e.url||``).trim())return null;let r=t??Le(),i=Ne(ur(e,n),r);return i?(Ve(i),i):null}async function fr(e,t,n){if(e.replaceChildren(),t.folder)return wr(e,`folder`),e.toggleAttribute(`data-bookmark-bitmap`,!1),``;let r=String(t.url||``).trim(),i=[],a=Kn(r,Cr);a&&i.push(a);let o=Kn(r,128);o&&!i.includes(o)&&i.push(o);let s=Kn(r,64);s&&!i.includes(s)&&i.push(s);let c=n?.resolveIconUrl?.(r,Cr)||``;c&&!i.includes(c)&&i.push(c);let l=n?.resolveIconUrl?.(r,128)||``;l&&!i.includes(l)&&i.push(l);let u=n?.resolveIconUrl?.(r,64)||``;u&&!i.includes(u)&&i.push(u);try{let e=globalThis.chrome?.runtime;if(typeof e?.getURL==`function`&&r){let t=new URL(e.getURL(`/_favicon/`));t.searchParams.set(`pageUrl`,r),t.searchParams.set(`size`,String(Cr));let n=t.toString();n&&!i.includes(n)&&i.push(n)}}catch{}return wr(e,`link`),e.toggleAttribute(`data-bookmark-bitmap`,!1),i.length?await new Promise(t=>{let n=0,r=()=>{if(n>=i.length){t(``);return}let a=i[n++],o=document.createElement(`img`);o.className=`env-shell-app-menu__tile-favicon`,o.alt=``,o.decoding=`async`,o.loading=`eager`,o.referrerPolicy=`no-referrer`,o.draggable=!1,o.addEventListener(`load`,()=>{e.replaceChildren(o),e.toggleAttribute(`data-bookmark-bitmap`,!0),t(a)},{once:!0}),o.addEventListener(`error`,()=>{r()},{once:!0}),o.src=a};r()}):``}var pr,mr,hr,gr,_r,vr,yr,br,xr,Sr,Cr,wr;function Tr(){return(Tr=e((()=>{Ae(),pr=`rs-app-menu-bookmark-recent`,mr=`rs-app-menu-bookmark-pinned`,hr=12,gr=16,_r=null,vr=()=>{try{let e=globalThis.chrome?.runtime?.lastError;return e?Error(String(e.message||e)):null}catch{return null}},yr=(e,t,...n)=>{let r=e[t];if(typeof r!=`function`)return Promise.reject(Error(`chrome.bookmarks.${String(t)} missing`));try{let t=r.apply(e,n);if(t!=null&&typeof t.then==`function`)return t}catch(e){return Promise.reject(e)}return new Promise((t,i)=>{try{r.apply(e,[...n,e=>{let n=vr();n?i(n):t(e)}])}catch(e){i(e)}})},br=e=>{let t=typeof e.url==`string`&&e.url?e.url:void 0;return{id:String(e.id),title:String(e.title||e.url||e.id||`Bookmark`),url:t,folder:!t,parentId:e.parentId}},xr=(e,t)=>{try{let n=localStorage.getItem(e);if(!n)return[];let r=JSON.parse(n);return Array.isArray(r)?r.filter(e=>e&&e.id&&e.title&&!e.folder).slice(0,t):[]}catch{return[]}},Sr=(e,t,n)=>{localStorage.setItem(e,JSON.stringify(t.slice(0,n)))},Cr=256,wr=(e,t)=>{let n=document.createElement(`ui-icon`);n.setAttribute(`icon`,t),n.setAttribute(`icon-style`,`duotone`),n.setAttribute(`aria-hidden`,`true`),n.style.setProperty(`--icon-size`,`1.75rem`),n.style.setProperty(`--icon-padding`,`0px`),n.style.setProperty(`--icon-color`,`currentColor`),n.style.color=`currentColor`,e.append(n),customElements.whenDefined(`ui-icon`).then(()=>{n.isConnected&&(n.getAttribute(`icon`)||n.setAttribute(`icon`,t),n.style.setProperty(`--icon-size`,`1.75rem`),n.style.setProperty(`--icon-padding`,`0px`))})}})))()}function Er(e){let t=e.info||{},n=String(t.packageName||e.fallback.packageName||``).trim(),r=String(t.label||e.fallback.label||e.title||n).trim(),i=[[`Label`,r],[`Package`,n],[`Activity`,String(t.componentName||e.fallback.componentName||`—`)],[`Version`,`${t.versionName||`—`} (${t.versionCode??`—`})`],[`Installer`,String(t.installer||`—`)],[`Enabled`,t.enabled===!1?`no`:`yes`],[`System`,t.system?t.updatedSystem?`updated system`:`yes`:`no`],[`Installed`,Pr(t.firstInstallTime)],[`Updated`,Pr(t.lastUpdateTime)]],a=Fr(`
        <form class="speed-dial-editor__form" autocomplete="off">
            <header class="modal-header">
                <h2 class="modal-title">App info</h2>
                <p class="modal-description">${K(r)}</p>
            </header>
            <div class="modal-fields">
                ${i.map(([e,t])=>`
                    <div class="modal-field">
                        <label>${K(e)}</label>
                        <input type="text" readonly value="${K(t)}" />
                    </div>`).join(``)}
            </div>
            <div class="modal-actions" role="group">
                ${e.onOpenSystem?`<button type="button" data-action="system" class="btn secondary">System details</button>`:`<span></span>`}
                <button type="button" data-action="close" class="btn save">Close</button>
            </div>
        </form>
    `),o=a.__cwspClose;a.querySelector(`form`)?.addEventListener(`click`,t=>{let n=t.target?.closest?.(`[data-action]`)?.getAttribute(`data-action`);n===`close`&&(t.preventDefault(),o?.()),n===`system`&&(t.preventDefault(),Promise.resolve(e.onOpenSystem?.()).finally(()=>o?.()))})}function Dr(e){let t=Rn(e.packageName),n=new Set((t.flags||[]).map(e=>e.toUpperCase())),r=Fr(`
        <form class="speed-dial-editor__form" autocomplete="off">
            <header class="modal-header">
                <h2 class="modal-title">Edit launch</h2>
                <p class="modal-description">${K(e.title)} — action, data URI, extras, flags</p>
            </header>
            <div class="modal-fields">
                <div class="modal-field">
                    <label for="am-launch-component">Activity</label>
                    <input id="am-launch-component" name="componentName" type="text" value="${K(t.componentName||e.defaultComponent||``)}" placeholder="pkg/.MainActivity" />
                </div>
                <div class="modal-field">
                    <label for="am-launch-action">Intent action</label>
                    <input id="am-launch-action" name="action" type="text" value="${K(t.action||``)}" placeholder="android.intent.action.MAIN" />
                </div>
                <div class="modal-field">
                    <label for="am-launch-data">Data URI</label>
                    <input id="am-launch-data" name="data" type="text" value="${K(t.data||``)}" placeholder="https://…  content://…  app scheme" />
                </div>
                <div class="modal-field">
                    <label for="am-launch-mime">MIME</label>
                    <input id="am-launch-mime" name="mimeType" type="text" value="${K(t.mimeType||``)}" placeholder="text/plain" />
                </div>
                <div class="modal-field">
                    <label for="am-launch-categories">Categories (comma)</label>
                    <input id="am-launch-categories" name="categories" type="text" value="${K((t.categories||[]).join(`, `))}" placeholder="android.intent.category.LAUNCHER" />
                </div>
                <div class="modal-field">
                    <label>Flags</label>
                    <div>
                        ${Nr.map(e=>`
                        <label style="display:flex;gap:0.4rem;align-items:center;margin:0.2rem 0;">
                            <input type="checkbox" name="flag" value="${e}"${n.has(e)?` checked`:``} />
                            <span>${e}</span>
                        </label>`).join(``)}
                    </div>
                </div>
                <div class="modal-field">
                    <label for="am-launch-extras">Extras (JSON or key=value)</label>
                    <textarea id="am-launch-extras" name="extras" rows="5" placeholder='{"debug": true}'>${K(Ir(t.extras))}</textarea>
                </div>
            </div>
            <div class="modal-actions" role="group">
                <button type="button" data-action="reset" class="btn secondary">Reset</button>
                <button type="button" data-action="cancel" class="btn secondary">Cancel</button>
                <button type="submit" class="btn save">Save</button>
            </div>
        </form>
    `),i=r.__cwspClose,a=r.querySelector(`form`),o=()=>{let e=[...r.querySelectorAll(`input[name="flag"]:checked`)].map(e=>e.value),t=String(r.querySelector(`[name="categories"]`)?.value||``).split(`,`).map(e=>e.trim()).filter(Boolean);return In({componentName:r.querySelector(`[name="componentName"]`)?.value,action:r.querySelector(`[name="action"]`)?.value,data:r.querySelector(`[name="data"]`)?.value,mimeType:r.querySelector(`[name="mimeType"]`)?.value,categories:t,flags:e,extras:Lr(r.querySelector(`[name="extras"]`)?.value||``)})};a?.addEventListener(`click`,t=>{let n=t.target?.closest?.(`[data-action]`)?.getAttribute(`data-action`);n===`cancel`&&(t.preventDefault(),i?.()),n===`reset`&&(t.preventDefault(),Bn(e.packageName),e.onSave?.({}),U(`Launch reset to default`),i?.())}),a?.addEventListener(`submit`,t=>{t.preventDefault();let n=o();zn(e.packageName,n),e.onSave?.(n),U(Ln(n)?`Launch reset to default`:`Launch saved`),i?.()})}function Or(e,t=`Uninstall`){return globalThis.confirm?.(`${t} “${e}”?`)===!0}function kr(e){let t=()=>{document.visibilityState===`visible`&&(document.removeEventListener(`visibilitychange`,t),e())};document.addEventListener(`visibilitychange`,t),globalThis.setTimeout?.(e,1600)}function Ar(e){let t=[[`Title`,e.title||`—`],[`URL`,e.url||`—`],[`Id`,e.id],[`Type`,e.folder?`Folder`:`Bookmark`]],n=Fr(`
        <form class="speed-dial-editor__form" autocomplete="off">
            <header class="modal-header">
                <h2 class="modal-title">${e.folder?`Folder info`:`Bookmark info`}</h2>
                <p class="modal-description">${K(e.title)}</p>
            </header>
            <div class="modal-fields">
                ${t.map(([e,t])=>`
                    <div class="modal-field">
                        <label>${K(e)}</label>
                        <input type="text" readonly value="${K(t)}" />
                    </div>`).join(``)}
            </div>
            <div class="modal-actions" role="group">
                <span></span>
                <button type="button" data-action="close" class="btn save">Close</button>
            </div>
        </form>
    `),r=n.__cwspClose;n.querySelector(`form`)?.addEventListener(`click`,e=>{e.target?.closest?.(`[data-action]`)?.getAttribute(`data-action`)===`close`&&(e.preventDefault(),r?.())})}function jr(e){let t=e.showUrl!==!1;return new Promise(n=>{let r=!1,i=Fr(`
        <form class="speed-dial-editor__form" autocomplete="off">
            <header class="modal-header">
                <h2 class="modal-title">${K(e.heading)}</h2>
                ${e.description?`<p class="modal-description">${K(e.description)}</p>`:``}
            </header>
            <div class="modal-fields">
                <div class="modal-field">
                    <label for="am-bm-title">Title</label>
                    <input id="am-bm-title" name="title" type="text" value="${K(e.initialTitle||``)}" />
                </div>
                ${t?`<div class="modal-field">
                    <label for="am-bm-url">URL</label>
                    <input id="am-bm-url" name="url" type="url" value="${K(e.initialUrl||``)}" placeholder="https://" />
                </div>`:``}
            </div>
            <div class="modal-actions" role="group">
                <span></span>
                <button type="button" data-action="cancel" class="btn secondary">Cancel</button>
                <button type="submit" class="btn save">${K(e.submitLabel||`Save`)}</button>
            </div>
        </form>
    `),a=i.__cwspClose,o=e=>{r||(r=!0,a?.(),n(e))},s=i.querySelector(`form`);s?.addEventListener(`click`,e=>{e.target?.closest?.(`[data-action]`)?.getAttribute(`data-action`)===`cancel`&&(e.preventDefault(),o(null))}),i.addEventListener(`cancel`,()=>o(null)),s?.addEventListener(`submit`,e=>{e.preventDefault();let n=String(i.querySelector(`[name="title"]`)?.value||``).trim();if(!n){W(`Title is required`);return}if(!t){o({title:n});return}let r=Jn(i.querySelector(`[name="url"]`)?.value||``);if(!r){W(`URL is required`);return}o({title:n,url:r})})})}function Mr(e){let t=e.entry;(async()=>{let n=await jr({heading:t.folder?`Rename folder`:`Edit bookmark`,description:t.folder?t.title:`${t.title} — Chrome bookmark`,initialTitle:t.title,initialUrl:t.url||``,showUrl:!t.folder,submitLabel:`Save`});if(!n)return;if(!e.api.update){W(`Bookmark edit unavailable`);return}let r=await e.api.update(t.id,t.folder?{title:n.title}:{title:n.title,url:n.url});if(!r){W(t.folder?`Could not rename folder`:`Could not update bookmark`);return}ar(r),U(t.folder?`Folder renamed`:`Bookmark updated`),e.onSaved?.(r)})()}var Nr,K,Pr,Fr,Ir,Lr;function Rr(){return(Rr=e((()=>{Gn(),Tr(),Nr=[`NEW_TASK`,`CLEAR_TOP`,`SINGLE_TOP`,`CLEAR_TASK`,`NO_HISTORY`,`REORDER_TO_FRONT`,`MULTIPLE_TASK`],K=e=>String(e??``).replace(/&/g,`&amp;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`).replace(/"/g,`&quot;`),Pr=e=>{let t=Number(e);if(!Number.isFinite(t)||t<=0)return`—`;try{return new Date(t).toLocaleString()}catch{return String(t)}},Fr=e=>{let t=document.createElement(`dialog`);t.className=`speed-dial-editor env-shell-app-menu__chrome-editor`,t.innerHTML=e;let n=()=>{try{t.open&&t.close()}catch{}t.remove()};t.addEventListener(`cancel`,e=>{e.preventDefault(),n()}),t.__cwspClose=n,document.body.append(t);try{t.showModal()}catch{t.setAttribute(`open`,``)}return t},Ir=e=>{if(!e||!Object.keys(e).length)return``;try{return JSON.stringify(e,null,2)}catch{return``}},Lr=e=>{let t=String(e||``).trim();if(!t)return{};if(t.startsWith(`{`))try{return In({extras:JSON.parse(t)}).extras||{}}catch{}let n={};for(let e of t.split(/\r?\n/)){let t=e.indexOf(`=`);if(t<1)continue;let r=e.slice(0,t).trim(),i=e.slice(t+1).trim();r&&(n[r]=i===`true`||i===`false`?i===`true`:/^-?\d+(\.\d+)?$/.test(i)?Number(i):i)}return n}})))()}function zr(){return(zr=e((()=>{Fe(),Nn(),Rr(),T()})))()}var Br,Vr,Hr,q,J,Ur,Wr,Gr,Kr,qr,Jr,Yr,Xr,Zr,Y,Qr,$r,ei,ti,ni,ri,ii,ai,oi,si,ci,li,ui,di;function fi(){return(fi=e((()=>{r(),T(),zr(),Nn(),Br=320,Vr=220,Hr=`2147483640`,q=`important`,J=0,Ur=null,Wr=null,Gr=null,Kr=null,qr=[],Jr=new Map,Yr=new Map,Xr=new Map,Zr=new Map,Y=new Map,Qr=[`left-start`,`right-end`,`left-end`,`bottom-start`,`top-start`],$r=(e,t)=>{let n=i(e,{...t,strategy:`js`});return typeof requestAnimationFrame==`function`&&requestAnimationFrame(()=>{n.update?.()}),n},ei=()=>{let e=document.documentElement,t=String(e.getAttribute(`data-theme`)||``).trim().toLowerCase();if(t===`light`||t===`dark`)return t;let n=String(e.getAttribute(`data-scheme`)||``).trim().toLowerCase();if(n===`light`||n===`dark`)return n;try{let e=String(localStorage.getItem(`rs-appearance-theme`)||``).trim().toLowerCase();if(e===`light`||e===`dark`)return e}catch{}return typeof matchMedia==`function`&&matchMedia(`(prefers-color-scheme: light)`).matches?`light`:`dark`},ti=(e,t)=>{e.style.setProperty(`position`,`fixed`,q),e.style.setProperty(`box-sizing`,`border-box`,q),e.style.setProperty(`min-width`,t?`188px`:`220px`,q),e.style.setProperty(`max-width`,`min(320px, calc(100vw - 24px))`,q),e.style.setProperty(`padding`,t?`0.3rem`:`0.4rem`,q),e.style.setProperty(`border-radius`,`14px`,q),e.style.setProperty(`pointer-events`,`auto`,q),e.style.setProperty(`backdrop-filter`,`blur(10px)`,q),e.style.setProperty(`-webkit-backdrop-filter`,`blur(10px)`,q),e.style.removeProperty(`border`),e.style.removeProperty(`background`),e.style.removeProperty(`color`),e.style.removeProperty(`box-shadow`);let n=ei();e.dataset.theme=n,e.style.setProperty(`color-scheme`,n===`light`?`light only`:`dark only`,q)},ni=e=>{e.style.setProperty(`list-style`,`none`,q),e.style.setProperty(`list-style-type`,`none`,q),e.style.setProperty(`margin`,`0`,q),e.style.setProperty(`padding`,`0`,q),e.style.setProperty(`display`,`flex`,q),e.style.setProperty(`flex-direction`,`column`,q),e.style.setProperty(`align-items`,`stretch`,q),e.style.setProperty(`gap`,`0.2rem`,q),e.style.setProperty(`width`,`100%`,q),e.style.setProperty(`box-sizing`,`border-box`,q)},ri=(e,t)=>{if(e.style.setProperty(`appearance`,`none`,q),e.style.setProperty(`-webkit-appearance`,`none`,q),e.style.setProperty(`box-sizing`,`border-box`,q),e.style.setProperty(`width`,`100%`,q),e.style.setProperty(`max-width`,`100%`,q),e.style.setProperty(`margin`,`0`,q),e.style.setProperty(`display`,`grid`,q),e.style.setProperty(`grid-template-columns`,`1.375rem minmax(0, 1fr) auto`,q),e.style.setProperty(`align-items`,`center`,q),e.style.setProperty(`justify-items`,`start`,q),e.style.setProperty(`gap`,`0.55rem`,q),e.style.setProperty(`border`,`none`,q),e.style.setProperty(`border-radius`,`10px`,q),e.style.setProperty(`padding`,`0.5rem 0.6rem`,q),e.style.setProperty(`min-height`,`2.35rem`,q),e.style.setProperty(`font`,`inherit`,q),e.style.setProperty(`font-size`,`0.8125rem`,q),e.style.setProperty(`line-height`,`1.25`,q),e.style.setProperty(`text-align`,`start`,q),e.style.setProperty(`cursor`,`pointer`,q),e.style.removeProperty(`background`),e.style.removeProperty(`background-color`),!t)e.style.setProperty(`color`,`inherit`,q);else{let t=ei()===`light`?`#9f1239`:`#fecaca`;e.style.setProperty(`color`,t,q),e.style.setProperty(`--cw-menu-fg`,t,q)}},ii=()=>{let e=document.getElementById(`cw-unified-context-menu-style`);e||(e=document.createElement(`style`),e.id=`cw-unified-context-menu-style`,document.head.appendChild(e)),e.textContent=`
        .cw-context-menu-layer {
            position: fixed;
            inset: 0;
            z-index: var(--cw-context-menu-layer-z, ${Hr});
            pointer-events: none;
        }

        .cw-context-menu {
            /* WHY: Menu often mounts outside .wf-demo-root — use :root wallpaper seeds. */
            --cw-menu-seed: var(--base-color, var(--color-primary, #5a7fff));
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
            /*
             * WHY: !important — unlayered button rules / token-fallback sheets shipped by some hosts
             * override the panel shadow otherwise; mirror the explorer-view unified menu so the
             * speed-dial context menu keeps visible elevation + glass blur.
             */
            box-shadow:
                var(--elev-3, 0 14px 36px rgba(0, 0, 0, 0.45)),
                0 0 0 1px color-mix(in oklab, --u2-color-mod(var(--cw-menu-seed), 100) 8%, transparent) !important;
            backdrop-filter: blur(10px) !important;
            -webkit-backdrop-filter: blur(10px) !important;
            pointer-events: auto;
            user-select: none;
            /* WHY: nested Actions/Open-in menus are taller than the remaining
             * viewport; CSS Anchor flip does not clamp, so the panel must scroll. */
            max-height: min(80dvh, calc(100vh - 16px));
            overflow-x: hidden;
            overflow-y: auto;
            overscroll-behavior: contain;
        }

        html[data-theme="light"] .cw-context-menu,
        .cw-context-menu[data-theme="light"] {
            color-scheme: light only;
            --cw-menu-fg: --u2-color-mod(var(--cw-menu-seed), 900);
            --cw-menu-bg: --u2-color-mod(var(--cw-menu-seed), 160);
            --cw-menu-border: color-mix(in oklab, --u2-color-mod(var(--cw-menu-seed), 900) 14%, transparent);
            border-color: var(--cw-menu-border);
            background: color-mix(in oklab, var(--color-surface-container, var(--cw-menu-bg)) 96%, transparent);
            color: var(--cw-menu-fg);
            box-shadow: var(--elev-2, 0 10px 28px rgba(15, 23, 42, 0.16)) !important;
            backdrop-filter: blur(10px) !important;
            -webkit-backdrop-filter: blur(10px) !important;
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
            box-shadow: var(--elev-3, 0 14px 36px rgba(0, 0, 0, 0.45)) !important;
            backdrop-filter: blur(10px) !important;
            -webkit-backdrop-filter: blur(10px) !important;
        }

        @media (prefers-color-scheme: light) {
            html:not([data-theme="dark"]) .cw-context-menu:not([data-theme="dark"]) {
                color-scheme: light only;
                --cw-menu-fg: --u2-color-mod(var(--cw-menu-seed), 900);
                --cw-menu-bg: --u2-color-mod(var(--cw-menu-seed), 160);
                --cw-menu-border: color-mix(in oklab, --u2-color-mod(var(--cw-menu-seed), 900) 14%, transparent);
                border-color: var(--cw-menu-border);
                background: color-mix(in oklab, var(--color-surface-container, var(--cw-menu-bg)) 96%, transparent);
                color: var(--cw-menu-fg);
                box-shadow: var(--elev-2, 0 10px 28px rgba(15, 23, 42, 0.16)) !important;
                backdrop-filter: blur(10px) !important;
                -webkit-backdrop-filter: blur(10px) !important;
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
            display: block !important;
            width: 100%;
            margin: 0 !important;
            padding: 0 !important;
            box-sizing: border-box;
        }

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
            gap: 0.55rem !important;
            border: none !important;
            border-radius: 10px !important;
            padding: 0.5rem 0.6rem !important;
            min-height: 2.35rem !important;
            font: inherit !important;
            font-size: 0.8125rem !important;
            line-height: 1.25 !important;
            text-align: start !important;
            cursor: pointer !important;
            background: transparent !important;
            color: inherit !important;
            box-shadow: none !important;
        }

        .cw-context-menu__item > * {
            pointer-events: none;
        }

        button.cw-context-menu__item:hover,
        .cw-context-menu button.cw-context-menu__item:hover,
        button.cw-context-menu__item:focus-visible,
        .cw-context-menu button.cw-context-menu__item:focus-visible {
            outline: none !important;
            background: color-mix(in oklab, var(--color-primary, --u2-color-mod(var(--cw-menu-seed), 550)) 16%, transparent) !important;
        }

        .cw-context-menu__item[disabled] {
            opacity: 0.45;
            cursor: default;
        }

        .cw-context-menu__item--danger {
            color: #fecaca !important;
        }

        html[data-theme="light"] .cw-context-menu__item--danger,
        .cw-context-menu[data-theme="light"] .cw-context-menu__item--danger {
            color: #9f1239 !important;
        }

        .cw-context-menu__icon {
            justify-self: center;
            inline-size: 1.375rem;
            block-size: 1.375rem;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            color: var(--cw-menu-fg, inherit);
        }

        .cw-context-menu__icon ui-icon {
            --icon-size: 1.125rem;
            --icon-color: var(--cw-menu-fg, currentColor);
            inline-size: 1.125rem !important;
            block-size: 1.125rem !important;
            min-inline-size: 1.125rem !important;
            min-block-size: 1.125rem !important;
            --icon-padding: 0px !important;
            color: var(--cw-menu-fg, inherit) !important;
            pointer-events: none;
        }

        .cw-context-menu__label {
            justify-self: stretch;
            text-align: start !important;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            min-inline-size: 0;
            color: var(--cw-menu-fg, inherit);
        }

        .cw-context-menu__chevron {
            justify-self: end;
            opacity: 0.72;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            color: var(--cw-menu-fg, inherit);
        }

        .cw-context-menu__chevron ui-icon {
            --icon-size: 0.85rem;
            --icon-color: var(--cw-menu-fg, currentColor);
            pointer-events: none;
        }
    `},ai=()=>{for(let e of qr)try{e()}catch{}qr=[]},oi=e=>{for(let[t,n]of Array.from(Zr.entries()))t>=e&&(clearTimeout(n),Zr.delete(t));for(let[t,n]of Array.from(Y.entries()))t>=e&&(clearTimeout(n),Y.delete(t))},si=e=>{oi(e);for(let[t,n]of Array.from(Jr.entries()))t>=e&&(Xr.get(t)?.dispose(),Xr.delete(t),n.remove(),Jr.delete(t),Yr.delete(t))},ci=e=>{for(let[t,n]of Array.from(Y.entries()))t>=e&&(clearTimeout(n),Y.delete(t))},li=(e,t,n,r,i)=>{let a=document.createElement(`div`);a.className=`cw-context-menu${t?` cw-context-menu--compact`:``}`,a.setAttribute(`role`,`menu`),a.dataset.menuDepth=String(n),a.style.zIndex=String(n+1);let o=document.createElement(`ul`);o.className=`cw-context-menu__list`,ni(o),a.appendChild(o);let s=(e,n,a)=>{if(r!==J||!Wr?.isConnected||!Ur?.isConnected||(si(a),!e.children?.length))return;let o=li(e.children,t,a,r,i);o.classList.add(`cw-context-menu--submenu`),Ur.appendChild(o),Jr.set(a,o),Yr.set(a,n),Xr.set(a,$r(o,{origin:{type:`element`,element:n},placement:`right-start`,fallbacks:Qr,strategy:`js`}))},c=(e,t,n)=>{let r=Zr.get(n);r&&clearTimeout(r),ci(n);let i=setTimeout(()=>{Zr.delete(n),s(e,t,n)},Br);Zr.set(n,i)},l=e=>{let t=Y.get(e);t&&clearTimeout(t);let n=setTimeout(()=>{Y.delete(e),si(e)},Vr);Y.set(e,n)};for(let t of e){let e=document.createElement(`button`);e.type=`button`,e.className=`cw-context-menu__item${t.danger?` cw-context-menu__item--danger`:``}`,e.setAttribute(`role`,`menuitem`),e.disabled=!!t.disabled,ri(e,!!t.danger);let i=!!t.children?.length;if(e.innerHTML=`
            <span class="cw-context-menu__icon">${t.icon?`<ui-icon icon="${t.icon}"></ui-icon>`:``}</span>
            <span class="cw-context-menu__label">${t.label}</span>
            <span class="cw-context-menu__chevron">${i?`<ui-icon icon="caret-right"></ui-icon>`:``}</span>
        `,i){let i=n+1;e.setAttribute(`aria-haspopup`,`menu`),e.addEventListener(`pointerenter`,()=>c(t,e,i)),e.addEventListener(`pointerleave`,()=>l(i)),e.addEventListener(`click`,n=>{if(n.preventDefault(),n.stopPropagation(),r!==J||!Wr?.isConnected)return;ci(i);let a=Jr.get(i),o=Yr.get(i);if(a?.isConnected&&o===e){si(i);return}s(t,e,i)})}else e.addEventListener(`click`,async e=>{e.preventDefault(),e.stopPropagation(),!(r!==J||!Wr?.isConnected)&&(ui(),!t.disabled&&await t.action())});let a=document.createElement(`li`);a.appendChild(e),o.appendChild(a)}return ti(a,t),a.addEventListener(`pointerenter`,()=>ci(n)),a.addEventListener(`pointerleave`,()=>{if(n>0){let e=Y.get(n);e&&clearTimeout(e);let t=setTimeout(()=>{Y.delete(n),si(n)},Vr);Y.set(n,t)}}),a},ui=()=>{ai(),oi(0),Kr?.(),Kr=null,Gr?.dispose(),Gr=null,si(1),Jr.clear(),Yr.clear(),Xr.clear(),Wr?.remove(),Wr=null,Ur?.remove(),Ur=null,J+=1},di=e=>{let t=(e.items||[]).filter(e=>e&&e.id&&e.label);if(!t.length){ui();return}ii(),ui();let n=J,r=c()??document.body,i=document.createElement(`div`);i.className=`cw-context-menu-layer`,Ur=i,r.appendChild(i);let a=e.placementStrategy??`auto`,o=li(t,!!e.compact,0,n,a);Wr=o,i.appendChild(o),Gr=$r(o,{origin:{type:`point`,x:e.x,y:e.y},placement:`bottom-start`,gap:0,strategy:`js`}),Kr=p({id:`context-menu-${n}`,kind:`context-menu`,element:i,isActive:()=>J===n&&Ur===i&&i.isConnected,close:()=>(ui(),!0)});let s=e=>{if(n!==J||!Ur?.isConnected)return;let t=e.target;t&&Ur.contains(t)||ui()},l=e=>{if(n!==J||!Wr?.isConnected)return;let t=e.target;if(!t)return;let r=t.closest?.(`.cw-context-menu__item`);if(!r){si(1);return}r.getAttribute(`aria-haspopup`)!==`menu`&&si(1)},u=e=>{n===J&&e.key===`Escape`&&ui()},d=()=>ui();document.addEventListener(`pointerdown`,s,{capture:!0}),document.addEventListener(`contextmenu`,s,{capture:!0}),document.addEventListener(`keydown`,u),o.addEventListener(`click`,l,{capture:!0}),window.addEventListener(`resize`,d,{passive:!0}),window.addEventListener(`blur`,d,{passive:!0}),qr.push(()=>document.removeEventListener(`pointerdown`,s,{capture:!0})),qr.push(()=>document.removeEventListener(`contextmenu`,s,{capture:!0})),qr.push(()=>document.removeEventListener(`keydown`,u)),qr.push(()=>o.removeEventListener(`click`,l,{capture:!0})),qr.push(()=>window.removeEventListener(`resize`,d)),qr.push(()=>window.removeEventListener(`blur`,d))}})))()}function pi(e){let t=String(e||`default`).trim().toLowerCase();return vi[t]||`default`}function mi(e){return String(e||``).trim().toLowerCase().startsWith(`android-icon:`)}function hi(e,t=`default`,n=``,r=``){let i=String(e||``).trim();if(!i)return``;let a=pi(t),o=String(n||``).trim(),s=String(r||``).trim(),c=new URLSearchParams;a!=="default"&&c.set(`v`,a),o&&c.set(`pack`,o),s&&c.set(`drawable`,s);let l=c.toString();return l?`android-icon:${i}?${l}`:`android-icon:${i}`}function gi(e){let t=String(e||``).trim();if(!mi(t))return null;let n=t.slice(13).replace(/^\/\//,``);if(!n)return null;let r=(e,t)=>{if(!e)return null;let n={packageName:e,variant:pi(t.get(`v`)||`default`)},r=String(t.get(`pack`)||``).trim(),i=String(t.get(`drawable`)||``).trim();return r&&(n.pack=r),i&&(n.drawable=i),n};try{let e=new URL(n.includes(`://`)?n:`android-icon://${n}`);return r(String(e.hostname||e.pathname.replace(/^\//,``)||``).trim(),e.searchParams)}catch{let[e,t=``]=n.split(`?`);return r(String(e||``).trim(),new URLSearchParams(t))}}function _i(e,t=`default`,n=``,r=``,i=0){let a=String(e||``).trim();if(!a)return``;let o=pi(t),s=String(n||``).trim(),c=String(r||``).trim(),l=o==="default"?a:`${a}#${o}`;s&&(l=`${l}#pack:${s}`),c&&(l=`${l}#d:${c}`);let u=Math.round(Number(i)||0);return u>0&&(l=`${l}#s${u}`),l}var vi;function yi(){return(yi=e((()=>{vi={default:`default`,full:`default`,colored:`default`,monochrome:`monochrome`,mono:`monochrome`,material:`monochrome`,"material-you":`monochrome`,themed:`monochrome`,foreground:`foreground`,fg:`foreground`,"adaptive-fg":`foreground`}})))()}async function bi(e){let t=await(await fetch(e)).blob(),n=t.type&&t.type.startsWith(`image/`)?t.type:`image/png`,r=t.type===n?t:new Blob([await t.arrayBuffer()],{type:n});return URL.createObjectURL(r)}function xi(e){let t=String(e||``).trim();if(!t.startsWith(`shortcut:`))return null;let n=t.slice(9),r=n.indexOf(`::`);if(r>0){let e=n.slice(0,r).trim(),t=n.slice(r+2).trim();return e&&t?{packageName:e,shortcutId:t}:null}let i=n.indexOf(`/`);if(i>0){let e=n.slice(0,i).trim(),t=n.slice(i+1).trim();return e&&t?{packageName:e,shortcutId:t}:null}return null}function Si(e,t=96,n=`default`,r=``,i=``){let a=String(e||``).trim();if(!a)return``;let o=xi(a);return o?wi(o.packageName,o.shortcutId,t):Pi.get(_i(a,n,r,i,t))||``}async function Ci(e,t,n=96){let r=String(e||``).trim(),i=String(t||``).trim();if(!r||!i)return``;let a=Math.max(16,Math.min(512,Math.round(Number(n)||96))),o=`shortcut:${r}/${i}@${a}`,s=Ii.get(o);if(s)return s;let c=Li.get(o);return c||(c=(async()=>{let e=await Oi();if(!e?.launcherShortcutIcon)return``;let t=``;try{t=String(await e.launcherShortcutIcon(r,i,a)||``).trim()}catch{return``}if(!t)return``;try{let e=await bi(t);return Ii.set(o,e),e}catch{return t}})().finally(()=>{Li.delete(o)}),Li.set(o,c)),c}function wi(e,t,n=96){let r=String(e||``).trim(),i=String(t||``).trim();if(!r||!i)return``;let a=Math.max(16,Math.min(512,Math.round(Number(n)||96)));return Ii.get(`shortcut:${r}/${i}@${a}`)||``}async function Ti(e,t=96,n=`default`,r=``,i=``){let a=String(e||``).trim();if(!a)return``;let o=xi(a);if(o)return Ci(o.packageName,o.shortcutId,t);let s=pi(n),c=String(r||``).trim(),l=String(i||``).trim(),u=Math.max(16,Math.min(512,Math.round(Number(t)||96))),d=_i(a,s,c,l,u),f=Pi.get(d);if(f)return f;let p=Fi.get(d);p||(p=(async()=>{let e=await Oi();if(!e?.launcherIcon)return``;let t=``;try{t=await e.launcherIcon(a,u,s,c||void 0,l||void 0)}catch{return``}if(!t)return``;try{let e=await bi(t);return Pi.set(d,e),e}catch{return``}})(),Fi.set(d,p));try{return await p}finally{Fi.delete(d)}}async function Ei(e,t=96){let n=String(e||``).trim();if(!n||n.startsWith(`blob:`))return``;let r=gi(n);return r?Ti(r.packageName,t,r.variant,r.pack||``,r.drawable||``):n}function Di(e,t=96){let n=gi(e);return n?Si(n.packageName,t,n.variant,n.pack||``,n.drawable||``):``}async function Oi(){if(Ni)return Ni;try{return await F(()=>import(`./launcher-bridge-Df9GjB_e.js`),[],import.meta.url)}catch{return null}}async function ki(){return Oi()}async function Ai(e){let{androidPackageForSku:t,isCwspSku:n}=await F(async()=>{let{androidPackageForSku:e,isCwspSku:t}=await import(`./ecosystem-skus-Bz92tN57.js`).then(e=>(e.c(),e.a));return{androidPackageForSku:e,isCwspSku:t}},[],import.meta.url);if(!n(e))return!1;let r=t(e);if(!r)return!1;let i=await Oi();return i?.launcherLaunch?i.launcherLaunch(r):!1}async function ji(e){try{let{isCwspNativeHost:t,readCwspSku:n,siblingSkuForView:r}=await F(async()=>{let{isCwspNativeHost:e,readCwspSku:t,siblingSkuForView:n}=await import(`./ecosystem-skus-Bz92tN57.js`).then(e=>(e.c(),e.a));return{isCwspNativeHost:e,readCwspSku:t,siblingSkuForView:n}},[],import.meta.url);if(!t())return!1;let i=n();if(i!==`launcher`&&i!==`explorer`)return!1;let a=r(e);return a?Ai(a):!1}catch{return!1}}function Mi(e,t,n=`colored`){let r=String(t||``).trim();if(!r)return;e.setAttribute(`icon-padding`,`0`),e.style.setProperty(`--icon-padding`,`0px`),e.style.setProperty(`--icon-size`,`100%`),e.toggleAttribute(`data-launcher-icon`,!0);let i=()=>{let t=e;return typeof t.setResourceIcon==`function`&&(t.setResourceIcon(r,n===`auto`?`auto`:n),n!==`auto`&&typeof t.setBitmapPresentationMode==`function`&&t.setBitmapPresentationMode(n,!0),e.removeAttribute(`data-icon-pending`),e.toggleAttribute(`data-launcher-icon-ready`,!0),!0)};i()||customElements.whenDefined(`ui-icon`).then(()=>{e.isConnected&&i()})}var Ni,Pi,Fi,Ii,Li;function Ri(){return(Ri=e((()=>{T(),Ae(),Mt(),yi(),P(),Ni=null,Pi=new Map,Fi=new Map,Ii=new Map,Li=new Map})))()}function zi(e){return e===`light`||e===`dark`?e:String(document.documentElement.getAttribute(`data-theme`)||``).toLowerCase()===`light`?`light`:`dark`}function Bi(e){let t=String(e||``).trim();return/^https?:\/\//i.test(t)?t:``}function Vi(e,t=128){try{let n=new URL(e).hostname;return n?`https://www.google.com/s2/favicons?domain=${encodeURIComponent(n)}&sz=${t}`:``}catch{return``}}function Hi(e,t=128){try{let n=globalThis.chrome?.runtime;if(typeof n?.getURL!=`function`)return``;let r=new URL(n.getURL(`/_favicon/`));return r.searchParams.set(`pageUrl`,e),r.searchParams.set(`size`,String(t)),r.toString()}catch{return``}}function Ui(e,t){let n=Bi(e);if(!n)return[];let r=[],i=new Set,a=(e,t)=>{let n=String(t||``).trim();!n||i.has(n)||(i.add(n),r.push({label:e,url:n}))},o=t?.resolveIconUrl?.(n,128)||t?.resolveIconUrl?.(n,64)||``,s=Vi(n,128);s&&a(`Google S2`,s);let c=Vi(n,64);c&&a(`Google S2 (64)`,c);let l=Hi(n,128);return l&&a(`Chrome favicon`,l),o&&a(`Bookmark favicon`,o),r}function Wi(e){X(e,{display:`grid`,"grid-template-columns":na,gap:`0.5rem 0.4rem`,"align-content":`start`,"justify-content":`stretch`,"min-inline-size":`0`,"min-block-size":`0`,"inline-size":`100%`})}function Gi(e,t,n){X(e,{display:`grid`,"grid-template-columns":`minmax(0, 1fr)`,"grid-template-rows":`auto max-content`,"justify-items":`center`,"align-content":`start`,"align-items":`start`,"flex-direction":`column`,gap:`0.3rem`,margin:`0`,padding:`0.2rem 0.08rem 0.15rem`,"min-inline-size":`0`,"inline-size":`100%`,"max-inline-size":`100%`,"block-size":`auto`,"min-block-size":`0`,background:`transparent`,border:`0`,"border-radius":`0.7rem`,"box-shadow":`none`,appearance:`none`,"-webkit-appearance":`none`,position:`static`,"z-index":`auto`,overflow:`hidden`}),X(t,{display:`block`,"grid-row":`1`,"inline-size":`3rem`,"block-size":`3rem`,"max-inline-size":`3rem`,"max-block-size":`3rem`,"object-fit":`cover`,"border-radius":`50%`,"flex-shrink":`0`}),X(n,{display:`block`,"grid-row":`2`,"inline-size":`100%`,"max-inline-size":`100%`,overflow:`hidden`,"text-overflow":`ellipsis`,"white-space":`nowrap`,"font-size":`0.62rem`,"line-height":`1.2`,"text-align":`center`,opacity:`0.88`})}function Ki(e,t){let n=document.createElement(`button`);n.type=`button`,n.className=`sd-icon-picker__card`,n.title=t||e;let r=document.createElement(`img`);r.alt=``,r.decoding=`async`,r.draggable=!1,r.referrerPolicy=`no-referrer`;let i=document.createElement(`span`);return i.className=`sd-icon-picker__card-label`,i.textContent=e,n.append(r,i),Gi(n,r,i),{btn:n,img:r}}async function qi(e,t,n,r,i){n.replaceChildren();let a=ta.map(e=>({...e,available:!0}));try{let n=await e.launcherIconVariants?.(t);Array.isArray(n)&&n.length&&(a=n.map(e=>({id:pi(e.id),label:String(e.label||e.id),available:e.available!==!1})))}catch{}for(let e of a){if(!e.available&&e.id!=="default")continue;let{btn:a,img:o}=Ki(e.label);n.append(a),Ti(t,96,e.id).then(t=>{if(!t){a.disabled=!0,a.title=`${e.label} (unavailable)`;return}o.src=t}),a.addEventListener(`click`,()=>{r({iconUrl:hi(t,e.id),packageName:t,variant:e.id,label:e.label,source:`android`}),i()})}}async function Ji(e,t,n,r,i){if(n.replaceChildren(),n.classList.remove(`sd-icon-picker__grid--browse`),Wi(n),!e.launcherIconPacks){n.textContent=`Icon packs unavailable.`;return}let a=[];try{a=await e.launcherIconPacks()}catch{n.textContent=`Failed to list icon packs.`;return}if(!a.length){n.textContent=`No icon packs installed.`;return}let o=document.createDocumentFragment();for(let s of a.slice(0,64)){let a=String(s.packageName||``).trim();if(!a)continue;let c=String(s.label||a),l=document.createElement(`div`);l.className=`sd-icon-picker__pack-wrap`,X(l,{position:`relative`,"min-inline-size":`0`,"inline-size":`100%`});let{btn:u,img:d}=Ki(c,`${c} — tap to apply, grid to browse`);Ti(t,96,`default`,a).then(e=>{if(e){d.src=e;return}u.disabled=!0,u.title=`${c} (no cover for this app)`,Ti(a,72,`default`).then(e=>{e&&(d.src=e)})}),u.addEventListener(`click`,()=>{u.disabled||(r({iconUrl:hi(t,`default`,a),packageName:t,variant:`default`,pack:a,label:c,source:`icon-pack`}),i())});let f=document.createElement(`button`);f.type=`button`,f.className=`sd-icon-picker__pack-browse`,X(f,{position:`absolute`,"inset-block-start":`0`,"inset-inline-end":`0`,display:`grid`,"place-items":`center`,margin:`0`,padding:`0`,"inline-size":`1.2rem`,"block-size":`1.2rem`,"min-inline-size":`1.2rem`,"min-block-size":`1.2rem`,border:`0`,"border-radius":`999px`}),f.title=`Browse icons in ${c}`,f.setAttribute(`aria-label`,`Browse icons in ${c}`),f.innerHTML=`<ui-icon icon="squares-four" aria-hidden="true"></ui-icon>`,f.addEventListener(`click`,o=>{o.preventDefault(),o.stopPropagation(),n.dataset.packBrowse=`1`,Yi(e,t,a,c,n,r,i,()=>{delete n.dataset.packBrowse,Ji(e,t,n,r,i)})}),l.append(u,f),o.append(l)}n.append(o)}async function Yi(e,t,n,r,i,a,o,s){i.replaceChildren(),i.classList.add(`sd-icon-picker__grid--browse`),i.style.setProperty(`display`,`grid`,`important`),i.style.setProperty(`grid-template-columns`,`minmax(0, 1fr)`,`important`),i.style.setProperty(`grid-template-rows`,`auto minmax(0, 1fr)`,`important`),i.style.setProperty(`gap`,`0.35rem`,`important`);let c=document.createElement(`div`);c.className=`sd-icon-picker__pack-toolbar`;let l=document.createElement(`button`);l.type=`button`,l.className=`sd-icon-picker__pack-back`,l.textContent=`Packs`,l.addEventListener(`click`,()=>s());let u=document.createElement(`span`);u.className=`sd-icon-picker__pack-title`,u.textContent=r;let d=document.createElement(`input`);d.type=`search`,d.placeholder=`Filter…`,d.autocomplete=`off`,d.className=`sd-icon-picker__search`,c.append(l,u,d);let f=document.createElement(`div`);f.className=`sd-icon-picker__grid`,Wi(f),i.append(c,f);let p=0,m=()=>{(async()=>{if(f.replaceChildren(),!e.launcherIconPackIcons){f.textContent=`Pack browse unavailable.`;return}let i=[];try{i=await e.launcherIconPackIcons(n,String(d.value||``),96)}catch{f.textContent=`Failed to list pack icons.`;return}if(!i.length){f.textContent=`No matching icons.`;return}let s=document.createDocumentFragment(),c=t||n;for(let e of i){let t=String(e.drawable||``).trim();if(!t)continue;let{btn:i,img:l}=Ki(String(e.label||t),`${r}: ${t}`);s.append(i),Ti(c,72,`default`,n,t).then(e=>{e?l.src=e:i.disabled=!0}),i.addEventListener(`click`,()=>{i.disabled||(a({iconUrl:hi(c,`default`,n,t),packageName:c,variant:`default`,pack:n,drawable:t,label:String(e.label||t),source:`icon-pack`}),o())})}f.append(s)})()};d.addEventListener(`input`,()=>{window.clearTimeout(p),p=window.setTimeout(m,160)}),m()}async function Xi(e,t,n,r,i){if(n.replaceChildren(),!e.launcherList){n.textContent=`App list unavailable.`;return}let a=[];try{a=await e.launcherList(t)}catch{n.textContent=`Failed to list apps.`;return}if(!a.length){n.textContent=t.trim()?`No matches.`:`No apps.`;return}let o=document.createDocumentFragment();for(let e of a.slice(0,96)){let t=String(e.packageName||``).trim();if(!t)continue;let{btn:n,img:a}=Ki(String(e.label||t),`${e.label} (${t})`);o.append(n),Ti(String(e.iconCacheKey||t).trim()||t,72,`default`).then(e=>{e&&(a.src=e)}),n.addEventListener(`click`,()=>{r({iconUrl:hi(t,`default`),packageName:t,variant:`default`,label:String(e.label||t),source:`android`}),i()})}n.append(o)}function Zi(e,t,n,r,i){n.replaceChildren();let a=Ui(e,t);if(!a.length){n.textContent=`No favicon sources for this URL.`;return}for(let e of a){let{btn:t,img:a}=Ki(e.label,e.url);a.src=e.url,a.addEventListener(`error`,()=>{t.disabled=!0,t.title=`${e.label} (failed to load)`}),t.addEventListener(`click`,()=>{r({iconUrl:e.url,label:e.label,source:`favicon`}),i()}),n.append(t)}}async function Qi(e,t,n,r,i){n.replaceChildren();let a=[];try{let n=String(t||``).trim();a=n?await e.search(n):await e.listChildren()}catch{n.textContent=`Failed to list bookmarks.`;return}let o=a.filter(e=>!e.folder&&Bi(e.url));if(!o.length){n.textContent=t.trim()?`No matching bookmarks.`:`No bookmarks.`;return}let s=document.createDocumentFragment();for(let t of o.slice(0,80)){let n=Bi(t.url);if(!n)continue;let a=e.resolveIconUrl?.(n,64)||Hi(n,64)||Vi(n,64),{btn:o,img:c}=Ki(String(t.title||n),n);a&&(c.src=a),s.append(o),o.addEventListener(`click`,()=>{let o=e.resolveIconUrl?.(n,128)||Hi(n,128)||Vi(n,128)||a;o&&(r({iconUrl:o,label:String(t.title||n),source:`bookmark`}),i())})}n.append(s)}async function $i(e){let t=await ki(),n=Zn(),r=!!t?.launcherIcon,i=Bi(e.pageUrl)||Bi(e.currentUrl)||``;if(!r&&!(n||i)){console.warn(`[icon-resource-picker] no launcher bridge or bookmarks/favicon source`);return}let a=zi(e.theme),o=String(e.packageName||``).trim(),s=r&&!!o,c=r&&!!o&&!!t?.launcherIconPacks,l=r&&!!t?.launcherList,u=!!i,d=!!n,f=[];s&&f.push({id:`variants`,label:`This app`}),c&&f.push({id:`packs`,label:`Packs`}),u&&f.push({id:`favicon`,label:`Link`}),l&&f.push({id:`browse`,label:`Apps`}),d&&f.push({id:`bookmarks`,label:`Bookmarks`});let p=f[0]?.id||`browse`,m=document.createElement(`dialog`);m.className=`sd-icon-picker`,m.dataset.theme=a,m.dataset.tab=p,m.innerHTML=`
        <form class="sd-icon-picker__form" data-theme="${a}" method="dialog">
            <header class="sd-icon-picker__header">
                <h2 class="sd-icon-picker__title">Icon</h2>
                <nav class="sd-icon-picker__tabs" role="tablist" aria-label="Icon source"></nav>
                <input class="sd-icon-picker__search" data-search type="search" placeholder="Search…" autocomplete="off" hidden />
            </header>
            <div class="sd-icon-picker__body">
                <section class="sd-icon-picker__section" data-section="variants" hidden>
                    <div class="sd-icon-picker__grid" data-variants></div>
                </section>
                <section class="sd-icon-picker__section" data-section="packs" hidden>
                    <div class="sd-icon-picker__grid" data-packs></div>
                </section>
                <section class="sd-icon-picker__section" data-section="favicon" hidden>
                    <div class="sd-icon-picker__grid" data-favicon></div>
                </section>
                <section class="sd-icon-picker__section" data-section="browse" hidden>
                    <div class="sd-icon-picker__grid" data-browse></div>
                </section>
                <section class="sd-icon-picker__section" data-section="bookmarks" hidden>
                    <div class="sd-icon-picker__grid" data-bookmarks></div>
                </section>
            </div>
            <footer class="sd-icon-picker__footer">
                <button type="button" data-action="cancel" class="sd-icon-picker__cancel">Cancel</button>
            </footer>
        </form>
    `,X(m,{position:`fixed`,inset:`0`,top:`0`,right:`0`,bottom:`0`,left:`0`,width:`100%`,height:`100%`,"inline-size":`100%`,"block-size":`100%`,"max-inline-size":`100%`,"max-block-size":`100%`,"max-width":`100%`,"max-height":`100%`,margin:`0`,padding:`1rem`,display:`grid`,"place-items":`center`,"place-content":`center`,background:`transparent`,border:`none`,"border-radius":`0`,"box-shadow":`none`,overflow:`auto`});let h=m.querySelector(`.sd-icon-picker__form`);h&&X(h,{display:`flex`,"flex-direction":`column`,"inline-size":`min(90cqi, 100dvi)`,width:`min(90cqi, 100dvi)`,"max-inline-size":`100%`,"max-block-size":`min(86dvh, 36rem)`,margin:`0`,padding:`0`,"border-radius":`18px`,overflow:`hidden`,"justify-self":`center`,"align-self":`center`,background:`color-mix(in oklab, var(--color-surface-container, Canvas) 92%, transparent)`});let g=m.querySelector(`.sd-icon-picker__tabs`);g&&X(g,{display:`grid`,"grid-auto-flow":`column`,"grid-auto-columns":`1fr`,gap:`0.28rem`,"inline-size":`100%`});let _=m.querySelector(`.sd-icon-picker__body`);_&&X(_,{display:`block`,padding:`0.65rem 0.85rem 0.45rem`,"min-block-size":`0`,"max-block-size":`min(26rem, 52dvh)`,overflow:`auto`,background:`transparent`});let v=m.querySelector(`.sd-icon-picker__footer`);v&&X(v,{display:`flex`,"justify-content":`flex-end`,"align-items":`center`,gap:`0.45rem`,padding:`0.55rem 0.85rem 0.7rem`});let y=m.querySelector(`.sd-icon-picker__cancel`);y&&X(y,{display:`inline-flex`,"align-items":`center`,"justify-content":`center`,flex:`0 0 auto`,margin:`0`,padding:`0.42rem 0.86rem`,"inline-size":`auto`,width:`auto`,"min-inline-size":`0`,"max-inline-size":`none`,"border-radius":`0.65rem`});let b=m.querySelector(`form`),x=m.querySelector(`.sd-icon-picker__tabs`),S=m.querySelector(`[data-search]`),C=m.querySelector(`[data-variants]`),w=m.querySelector(`[data-packs]`),T=m.querySelector(`[data-favicon]`),E=m.querySelector(`[data-browse]`),D=m.querySelector(`[data-bookmarks]`),O=!1,k=()=>{if(!O){O=!0;try{m.open&&m.close()}catch{}m.remove()}},A=t=>{e.onPick(t)};b.addEventListener(`click`,e=>{e.target?.closest?.(`[data-action]`)?.getAttribute(`data-action`)===`cancel`&&(e.preventDefault(),k())}),m.addEventListener(`cancel`,e=>{e.preventDefault(),k()}),m.addEventListener(`click`,e=>{e.target===m&&k()});let j=e=>{m.dataset.tab=e,m.querySelectorAll(`[data-section]`).forEach(t=>{t.hidden=t.dataset.section!==e}),x?.querySelectorAll(`[data-tab]`).forEach(t=>{let n=t.dataset.tab===e;t.toggleAttribute(`data-active`,n),t.setAttribute(`aria-selected`,n?`true`:`false`),t.tabIndex=n?0:-1});let n=e===`browse`||e===`bookmarks`;S&&(S.hidden=!n,S.placeholder=e===`bookmarks`?`Search bookmarks…`:`Search apps…`,n&&(S.value=``)),e===`packs`&&w?.dataset.packBrowse===`1`&&t&&o&&(delete w.dataset.packBrowse,Ji(t,o,w,A,k))};if(x){let e=document.createDocumentFragment();for(let t of f){let n=document.createElement(`button`);n.type=`button`,n.className=`sd-icon-picker__tab`,n.dataset.tab=t.id,n.setAttribute(`role`,`tab`),n.textContent=t.label,X(n,{display:`inline-flex`,flex:`1 1 0`,"align-items":`center`,"justify-content":`center`,margin:`0`,padding:`0.38rem 0.4rem`,border:`0`,"border-radius":`999px`,"inline-size":`100%`,"min-inline-size":`0`,"block-size":`auto`}),n.addEventListener(`click`,e=>{e.preventDefault(),j(t.id)}),e.append(n)}x.append(e),x.hidden=f.length<=1}s&&t&&C&&qi(t,o,C,A,k),c&&t&&w&&o&&Ji(t,o,w,A,k),u&&T&&Zi(i,n,T,A,k);let M=0,ee=()=>{!E||!t||Xi(t,String(S?.value||``),E,A,k)},te=0,N=()=>{!D||!n||Qi(n,String(S?.value||``),D,A,k)};S?.addEventListener(`input`,()=>{let e=m.dataset.tab;if(e===`browse`){window.clearTimeout(M),M=window.setTimeout(ee,180);return}e===`bookmarks`&&(window.clearTimeout(te),te=window.setTimeout(N,180))}),l&&ee(),d&&n&&N(),x?.addEventListener(`click`,e=>{let t=e.target?.closest?.(`[data-tab]`)?.getAttribute(`data-tab`);t===`browse`&&ee(),t===`bookmarks`&&N()}),j(p),document.body.append(m),m.querySelectorAll(`.sd-icon-picker__grid`).forEach(Wi);try{m.showModal()}catch{m.setAttribute(`open`,``)}}function ea(e,t,n){let r=e.querySelector(`.sd-icon-resource-row`);r||(r=document.createElement(`div`),r.className=`sd-icon-resource-row`,t.replaceWith(r),r.append(t)),r.style.setProperty(`display`,`grid`,`important`),r.style.setProperty(`grid-template-columns`,`minmax(0,1fr) 2.5rem 2.5rem`,`important`),r.style.setProperty(`align-items`,`stretch`,`important`),r.style.setProperty(`gap`,`0.45rem`,`important`),r.style.setProperty(`min-inline-size`,`0`,`important`),r.style.setProperty(`inline-size`,`100%`,`important`);let i=r.querySelector(`[data-action='pick-icon']`);i||(i=document.createElement(`button`),i.type=`button`,i.className=`btn secondary sd-icon-resource-pick`,i.setAttribute(`data-action`,`pick-icon`),i.title=`Pick alternative icon`,i.setAttribute(`aria-label`,`Pick alternative icon`),i.innerHTML=`<ui-icon icon="squares-four" icon-style="duotone" aria-hidden="true"></ui-icon>`,r.append(i));let a=r.querySelector(`[data-action='pick-photo']`);a||(a=document.createElement(`button`),a.type=`button`,a.className=`btn secondary sd-icon-resource-pick`,a.setAttribute(`data-action`,`pick-photo`),a.title=`Use photo / avatar`,a.setAttribute(`aria-label`,`Use photo or avatar`),a.innerHTML=`<ui-icon icon="user-circle" icon-style="duotone" aria-hidden="true"></ui-icon>`,r.append(a)),t.parentElement!==r&&r.insertBefore(t,i),i.parentElement===r&&a.parentElement===r&&(r.append(i,a),r.insertBefore(t,i));let o=e=>{e.style.setProperty(`display`,`inline-flex`,`important`),e.style.setProperty(`align-items`,`center`,`important`),e.style.setProperty(`justify-content`,`center`,`important`),e.style.setProperty(`inline-size`,`2.5rem`,`important`),e.style.setProperty(`min-inline-size`,`2.5rem`,`important`),e.style.setProperty(`max-inline-size`,`2.5rem`,`important`),e.style.setProperty(`min-block-size`,`2.5rem`,`important`),e.style.setProperty(`padding`,`0`,`important`),e.style.setProperty(`margin`,`0`,`important`)};return o(i),o(a),i.addEventListener(`click`,e=>{e.preventDefault(),e.stopPropagation(),$i({packageName:typeof n.packageName==`function`?n.packageName():String(n.packageName||``).trim(),pageUrl:typeof n.pageUrl==`function`?n.pageUrl():String(n.pageUrl||``).trim(),currentUrl:t.value,theme:n.theme,onPick:e=>{t.value=e.iconUrl,t.setAttribute(`value`,e.iconUrl),t.dispatchEvent(new Event(`input`,{bubbles:!0})),t.dispatchEvent(new Event(`change`,{bubbles:!0}))}})}),a.addEventListener(`click`,n=>{n.preventDefault(),n.stopPropagation();let r=document.createElement(`input`);r.type=`file`,r.accept=`image/*`,r.style.display=`none`,document.body.append(r),r.addEventListener(`change`,()=>{let n=r.files?.[0];if(r.remove(),!n)return;let i=new FileReader;i.onload=()=>{let n=String(i.result||``).trim();if(!n.startsWith(`data:image/`))return;t.value=n,t.setAttribute(`value`,n),t.dispatchEvent(new Event(`input`,{bubbles:!0})),t.dispatchEvent(new Event(`change`,{bubbles:!0}));let r=e.closest(`form`)?.querySelector(`select[name="iconDisplay"]`);r&&(r.value=`colored`,r.dispatchEvent(new Event(`change`,{bubbles:!0})))},i.readAsDataURL(n)},{once:!0}),r.click()}),i}var ta,na,X;function ra(){return(ra=e((()=>{Ri(),yi(),Tr(),ta=[{id:`default`,label:`Default`},{id:`monochrome`,label:`Material You`},{id:`foreground`,label:`Adaptive FG`}],na=`repeat(auto-fill, minmax(4.75rem, 1fr))`,X=(e,t)=>{for(let[n,r]of Object.entries(t))e.style.setProperty(n,r,`important`)}})))()}function ia(){if(pa)return pa;try{let e=localStorage.getItem(fa);if(!e)return pa={},pa;let t=JSON.parse(e);pa=t&&typeof t==`object`?t:{}}catch{pa={}}return pa}function aa(e){pa=e;try{localStorage.setItem(fa,JSON.stringify(e))}catch{}}function oa(e){return`app:${String(e||``).trim()}`}function sa(e){return`bm:${String(e||``).trim()}`}function ca(e){let t=String(e||``).trim();return t?{...ia()[t]||{}}:{}}function la(e,t){let n=String(e||``).trim();if(!n)return{};let r={...ia()},i={...r[n]||{},...t};return i.shape&&=Se(i.shape,`circle`),i.iconDisplay&&=he(i.iconDisplay)||`colored`,i.iconScale!=null&&(i.iconScale=Re(i.iconScale)),r[n]=i,aa(r),i}function ua(e){let t=String(e||``).trim();if(!t)return;let n={...ia()};delete n[t],aa(n)}function da(e){let t={...e.defaults||{},...e.initial||{},...ca(e.key)},n=String(t.iconUrl||``).trim(),r=n.startsWith(`blob:`)?``:n,i=document.createElement(`dialog`);i.className=`speed-dial-editor env-shell-app-menu__chrome-editor`,i.innerHTML=`
        <form class="speed-dial-editor__form" autocomplete="off">
            <header class="modal-header">
                <h2 class="modal-title">Icon design</h2>
                <p class="modal-description">${String(e.title||``).replace(/[<>&]/g,``)}</p>
            </header>
            <div class="modal-fields">
                <div class="modal-field">
                    <label for="am-chrome-shape">Shape</label>
                    <select id="am-chrome-shape" name="shape">
                        ${we.map(e=>`<option value="${e.value}"${Se(t.shape,`circle`)===e.value?` selected`:``}>${e.label}</option>`).join(``)}
                    </select>
                </div>
                <div class="modal-field">
                    <label for="am-chrome-display">Icon display</label>
                    <select id="am-chrome-display" name="iconDisplay">
                        ${qe.map(e=>`<option value="${e.value}"${(he(t.iconDisplay)||`colored`)===e.value?` selected`:``}>${e.label}</option>`).join(``)}
                    </select>
                </div>
                <div class="modal-field">
                    <label for="am-chrome-icon-scale">Icon scale (inside plate)</label>
                    <select id="am-chrome-icon-scale" name="iconScale">
                        ${Ue.map(e=>`<option value="${e.value}"${Re(t.iconScale)===e.value?` selected`:``}>${e.label}</option>`).join(``)}
                    </select>
                </div>
                <div class="modal-field" data-field="glyph">
                    <label for="am-chrome-icon">Icon (Phosphor)</label>
                    <input id="am-chrome-icon" name="icon" type="text" value="${String(t.icon||``).replace(/"/g,`&quot;`)}" placeholder="device-mobile" />
                </div>
                <div class="modal-field" data-field="url">
                    <label for="am-chrome-url">Icon resource</label>
                    <div class="sd-icon-resource-row">
                        <input id="am-chrome-url" name="iconUrl" type="text" value="${r.replace(/"/g,`&quot;`)}" placeholder="URL / data: / android-icon:…" />
                        <button type="button" class="btn secondary sd-icon-resource-pick" data-action="pick-icon" title="Pick alternative icon" aria-label="Pick alternative icon">
                            <ui-icon icon="squares-four" icon-style="duotone" aria-hidden="true"></ui-icon>
                        </button>
                    </div>
                </div>
            </div>
            <div class="modal-actions" role="group" aria-label="Icon design actions">
                <button type="button" data-action="reset" class="btn secondary">Reset</button>
                <button type="button" data-action="cancel" class="btn secondary">Cancel</button>
                <button type="submit" class="btn save">Save</button>
            </div>
        </form>
    `;let a=i.querySelector(`form`),o=a?.querySelector(`.modal-actions`);o&&(o.style.setProperty(`display`,`grid`,`important`),o.style.setProperty(`grid-template-columns`,`1fr auto auto`,`important`),o.style.setProperty(`align-items`,`center`,`important`),o.style.setProperty(`gap`,`0.45rem`,`important`));let s=i.querySelector(`select[name="shape"]`),c=i.querySelector(`select[name="iconDisplay"]`),l=i.querySelector(`select[name="iconScale"]`),u=i.querySelector(`input[name="icon"]`),d=i.querySelector(`input[name="iconUrl"]`),f=i.querySelector(`[data-field="glyph"]`),p=i.querySelector(`[data-field="url"]`),m=String(e.packageName||``).trim()||(e.key.startsWith(`app:`)?e.key.slice(4):``),h=String(e.pageUrl||``).trim();p&&d&&ea(p,d,{packageName:m,pageUrl:h});let g=()=>{let e=he(c?.value)||`colored`;f&&(e===`glyph`?f.removeAttribute(`hidden`):f.setAttribute(`hidden`,``)),p&&(e===`glyph`?p.setAttribute(`hidden`,``):p.removeAttribute(`hidden`))};c?.addEventListener(`change`,g),g();let _=()=>{try{i.open&&i.close()}catch{}i.remove()};a?.addEventListener(`click`,t=>{let n=t.target?.closest?.(`[data-action]`)?.getAttribute(`data-action`);n===`cancel`&&(t.preventDefault(),_()),n===`reset`&&(t.preventDefault(),ua(e.key),e.onSave({}),_())}),a?.addEventListener(`submit`,t=>{t.preventDefault();let n=String(d?.value||``).trim(),r={shape:Se(s?.value,`circle`),iconDisplay:he(c?.value)||`colored`,iconScale:Re(l?.value),icon:String(u?.value||``).trim(),iconUrl:n.startsWith(`blob:`)?``:n};la(e.key,r),e.onSave(r),_()}),i.addEventListener(`cancel`,e=>{e.preventDefault(),_()}),document.body.append(i);try{i.showModal()}catch{i.setAttribute(`open`,``)}}var fa,pa;function ma(){return(ma=e((()=>{ge(),Ae(),ra(),fa=`cwsp-app-menu-tile-chrome-v1`,pa=null})))()}var ha,ga,_a,va,ya,ba,xa,Sa,Ca,wa,Ta,Ea,Da,Oa,ka,Aa,ja,Ma,Na,Pa,Fa;function Ia(){return(Ia=e((()=>{ma(),ge(),Ri(),ha=`cwsp:app-menu-sort-change`,ga=`cwsp-app-menu-sort`,_a=[[`name`,`Name`],[`installed`,`Date installed`],[`updated`,`Date updated`],[`color`,`Color (including mask)`],[`category`,`Category`],[`package`,`Package`]],va=new Set(_a.map(([e])=>e)),ya=new Map,ba=(e,t=`name`)=>{let n=String(e||``).trim().toLowerCase();return n===`install`||n===`install-date`||n===`date-installed`?`installed`:n===`update`||n===`update-date`||n===`date-updated`||n===`recent`?`updated`:n===`hue`||n===`colour`?`color`:va.has(n)?n:t},xa=(e,t=`asc`)=>{let n=String(e||``).trim().toLowerCase();return n===`desc`||n===`descending`||n===`newest`||n===`z-a`?`desc`:n===`asc`||n===`ascending`||n===`oldest`||n===`a-z`?`asc`:t},Sa=e=>e===`installed`||e===`updated`?`desc`:`asc`,Ca=()=>{try{let e=localStorage.getItem(ga);if(e){let t=JSON.parse(e),n=ba(t.sortBy);return{sortBy:n,sortDir:xa(t.sortDir,Sa(n))}}}catch{}return{sortBy:`name`,sortDir:`asc`}},wa=e=>{let t=Ca(),n=e.sortBy==null?t.sortBy:ba(e.sortBy,t.sortBy),r={sortBy:n,sortDir:e.sortDir==null?t.sortDir:xa(e.sortDir,Sa(n))};try{localStorage.setItem(ga,JSON.stringify(r))}catch{}try{window.dispatchEvent(new CustomEvent(ha,{detail:r}))}catch{}return r},Ta=(e,t)=>e.localeCompare(t,void 0,{numeric:!0,sensitivity:`base`})||e.localeCompare(t),Ea=(e,t)=>e===t?0:e<t?-1:1,Da=e=>String(e.category||``).trim().toLowerCase()||(e.system?`system`:String(e.installer||``).trim().toLowerCase()||`other`),Oa=e=>{let t=ca(oa(String(e.packageName||``)));return Te({iconDisplay:t.iconDisplay,iconUrl:t.iconUrl,isLauncherApp:!0})||`colored`},ka=e=>{let t=String(e||``).trim(),n=/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(t);if(n){let e=n[1],t=e.length===3?e.split(``).map(e=>parseInt(e+e,16)):[parseInt(e.slice(0,2),16),parseInt(e.slice(2,4),16),parseInt(e.slice(4,6),16)];return{r:t[0],g:t[1],b:t[2]}}let r=/rgba?\(\s*([\d.]+)[,\s/]+([\d.]+)[,\s/]+([\d.]+)/i.exec(t);return r?{r:Number(r[1]),g:Number(r[2]),b:Number(r[3])}:null},Aa=(e,t,n)=>{let r=e/255,i=t/255,a=n/255,o=Math.max(r,i,a),s=o-Math.min(r,i,a);if(s<1e-4)return 0;let c=0;return c=o===r?(i-a)/s%6:o===i?(a-r)/s+2:(r-i)/s+4,c*=60,c<0&&(c+=360),c},ja=e=>{try{let t=getComputedStyle(e||document.documentElement),n=t.getPropertyValue(`--env-app-menu-ink`)||t.color,r=ka(n);return r?Aa(r.r,r.g,r.b):210}catch{return 210}},Ma=(e,t,n)=>new Promise(r=>{let i=new Image;i.decoding=`async`,i.onload=()=>{try{let e=document.createElement(`canvas`);e.width=32,e.height=32;let a=e.getContext(`2d`,{willReadFrequently:!0});if(!a){r(n);return}a.drawImage(i,0,0,32,32);let o=a.getImageData(0,0,32,32).data,s=0,c=0,l=0,u=0;for(let e=0;e<o.length;e+=4){let n=o[e+3]/255;if(n<.12)continue;let r=o[e],i=o[e+1],a=o[e+2],d=(.2126*r+.7152*i+.0722*a)/255,f=t===`masked-inverse`?1-d:d,p=t===`colored`?n:n*(.15+.85*f);s+=r*p,c+=i*p,l+=a*p,u+=p}if(u<.001){r(n);return}let d=Aa(s/u,c/u,l/u);(t===`masked`||t===`masked-inverse`)&&(d=(d*.28+n*.72)%360),r(d)}catch{r(n)}},i.onerror=()=>r(n),i.src=e}),Na=async(e,t)=>{let n=ja(t),r=[];for(let t of e){let e=String(t.packageName||t.iconCacheKey||``).trim();if(!e)continue;let i=Oa(t),a=`${e}|${i}`;ya.has(a)||r.push((async()=>{try{let r=await Ti(t.iconCacheKey||e,32),o=r?await Ma(r,i,n):n;ya.set(a,o)}catch{ya.set(a,n)}})())}for(let e=0;e<r.length;e+=12)await Promise.all(r.slice(e,e+12))},Pa=e=>{let t=String(e.packageName||e.iconCacheKey||``).trim(),n=Oa(e);return ya.get(`${t}|${n}`)??0},Fa=(e,t)=>{let n=t.sortDir===`desc`?-1:1;return[...e].sort((e,r)=>{let i=0;return i=t.sortBy===`installed`?Ea(Number(e.firstInstallTime||0),Number(r.firstInstallTime||0)):t.sortBy===`updated`?Ea(Number(e.lastUpdateTime||0),Number(r.lastUpdateTime||0)):t.sortBy===`color`?Ea(Pa(e),Pa(r)):t.sortBy===`category`?Ta(Da(e),Da(r)):t.sortBy===`package`?Ta(String(e.packageName||``),String(r.packageName||``)):Ta(String(e.label||e.packageName||``),String(r.label||r.packageName||``)),i||=Ta(String(e.label||``),String(r.label||``)),i||=Ta(String(e.packageName||``),String(r.packageName||``)),i*n})}})))()}var La;function Ra(){return(Ra=e((()=>{La=`@layer components {
  .env-shell-app-menu[data-page] {
    inset: 0;
    align-items: stretch;
    justify-items: stretch;
    padding: 0;
    z-index: calc(var(--env-z-shell-chrome, 2147483000) + 4);
  }
  .env-shell-app-menu[data-page] .env-shell-app-menu__panel {
    inline-size: 100%;
    block-size: 100%;
    max-inline-size: stretch;
    max-block-size: stretch;
    border-radius: 0;
    /* WHY: 1fr clamps the grid; panel overflow never fires — scroll on the grid. */
    overflow: hidden;
    overflow-y: auto !important;
    overscroll-behavior: contain;
    touch-action: pan-y;
    -webkit-overflow-scrolling: touch;
    pointer-events: auto;
  }
  /* WHY: All Apps is a 1fr grid child — without a scrollport, rows squash to fit the viewport. */
  .env-shell-app-menu__panel > .env-shell-app-menu__grid {
    align-self: stretch;
    block-size: max-content;
    max-block-size: max-content;
    min-block-size: fit-content;
    overflow: visible;
    overscroll-behavior: contain;
    align-content: start;
    justify-content: start;
    grid-auto-rows: max-content;
    touch-action: pan-y;
    -webkit-overflow-scrolling: touch;
  }
  .env-shell-app-menu[data-page] .env-shell-app-menu__grid {
    row-gap: 0.85rem;
    column-gap: 0.45rem;
    padding-block-end: calc(var(--env-shell-chrome-stack-reserve, 3rem) + env(safe-area-inset-bottom, 0px));
  }
  .env-shell-app-menu {
    position: fixed;
    z-index: calc(var(--env-z-shell-chrome, 2147483000) + 2);
    inset-inline: 0;
    inset-block-end: var(--env-shell-chrome-stack-reserve, 3rem);
    display: grid;
    align-items: end;
    justify-items: start;
    padding: 0.5rem;
    padding-inline-start: max(0.5rem, env(safe-area-inset-left, 0px));
    pointer-events: auto;
    box-sizing: border-box;
    /* WHY: match TaskBar — light-dark() follows used color-scheme (QS/Theme pin). */
    color-scheme: inherit;
    /*
     * WHY: hard #f4f4f5/#1c1c1e fixed light/dark contrast but killed Veela tint.
     * Keep light-dark for scheme flip; mix primary so surfaces stay colorized.
     */
    --env-app-menu-accent: var(--wf-md-primary, var(--color-primary, #5a9ec8));
    --env-app-menu-surface: color-mix(
        in oklab,
        var(--color-surface-container, --u2-color-mod(var(--base-color, #5a9ec8), 960)) 88%,
        transparent
    );
    --env-app-menu-surface-raised: var(
        --color-surface-container-high,
        --u2-color-mod(var(--base-color, #5a9ec8), 980)
    );
    /* WHY: fallbacks must flip with color-scheme — index 100/880 is dark-only. */
    --env-app-menu-ink: var(
        --color-on-surface,
        light-dark(
            --u2-color-mod(var(--base-color, #5a9ec8), 900),
            --u2-color-mod(var(--base-color, #5a9ec8), 100)
        )
    );
    --env-app-menu-plate: var(
        --color-primary-container,
        light-dark(
            --u2-color-mod(var(--base-color, #5a9ec8), 160),
            --u2-color-mod(var(--base-color, #5a9ec8), 820)
        )
    );
  }
  .env-shell-app-menu[hidden] {
    display: none !important;
  }
  .env-shell-app-menu__panel {
    pointer-events: auto;
    display: grid;
    gap: 0.75rem;
    inline-size: min(420px, 100vw - 1rem);
    max-block-size: min(520px, 100dvb - var(--env-shell-chrome-stack-reserve, 3rem) - 1rem);
    padding: 0.85rem;
    border-radius: 14px;
    border: 1px solid light-dark(color-mix(in oklab, #000 12%, transparent), color-mix(in oklab, #fff 14%, transparent));
    /* WHY: tinted acrylic — not flat gray; color-scheme still drives light-dark(). */
    background: var(--env-app-menu-surface);
    color: var(--env-app-menu-ink);
    box-shadow: 0 20px 48px -20px light-dark(rgba(0, 0, 0, 0.22), rgba(0, 0, 0, 0.45)), 0 2px 8px -2px light-dark(rgba(0, 0, 0, 0.12), rgba(0, 0, 0, 0.25));
    overflow: hidden;
    overflow-y: auto !important;
    overscroll-behavior: contain;
    touch-action: pan-y;
    -webkit-overflow-scrolling: touch;
    animation: env-app-menu-in 140ms cubic-bezier(0.22, 0.8, 0.3, 1);
    color-scheme: inherit;
    backdrop-filter: blur(22px) saturate(1.35);
    -webkit-backdrop-filter: blur(22px) saturate(1.35);
    grid-template-rows: auto auto minmax(0, 1fr);
    min-block-size: max(60dvb, 60cqb);
    block-size: fit-content;
  }
  /* Win7-style Start: recent | folders/grid */
  .env-shell-app-menu__panel[data-layout=start-split] {
    inline-size: min(560px, 100vw - 1rem);
    max-block-size: min(580px, 100dvb - var(--env-shell-chrome-stack-reserve, 3rem) - 1rem);
    grid-template-rows: auto auto minmax(0, 1fr);
  }
  .env-shell-app-menu__start-body {
    display: grid;
    grid-template-columns: minmax(9.5rem, 0.42fr) minmax(0, 1fr);
    gap: 0.65rem;
    min-block-size: 12rem;
    max-block-size: 100%;
    overflow: hidden;
  }
  .env-shell-app-menu__start-left {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    min-block-size: fit-content;
    min-inline-size: 0;
    overflow: auto;
    padding: 0.45rem;
    border-radius: 12px;
    background: light-dark(color-mix(in oklab, var(--env-app-menu-accent) 8%, transparent), color-mix(in oklab, var(--env-app-menu-accent) 12%, transparent));
    border: 1px solid light-dark(color-mix(in oklab, var(--env-app-menu-accent) 22%, transparent), color-mix(in oklab, #fff 14%, transparent));
  }
  .env-shell-app-menu__start-right {
    display: grid;
    grid-template-rows: auto minmax(0, 1fr);
    gap: 0.4rem;
    min-block-size: fit-content;
    min-inline-size: 0;
    overflow: hidden;
  }
  .env-shell-app-menu__start-heading {
    font: 600 0.72rem/1.2 ui-sans-serif, system-ui, sans-serif;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    opacity: 0.72;
    padding-inline: 0.25rem;
    flex: 0 0 auto;
  }
  .env-shell-app-menu__start-recent {
    display: grid;
    grid-template-columns: 1fr;
    gap: 0.2rem;
    align-content: start;
    flex: 0 0 auto;
  }
  .env-shell-app-menu__start-recent .env-shell-app-menu__tile {
    grid-template-columns: auto minmax(0, 1fr);
    justify-items: start;
    align-items: center;
    gap: 0.45rem;
    padding: 0.35rem 0.4rem;
    text-align: start;
  }
  .env-shell-app-menu__start-recent .env-shell-app-menu__tile-icon {
    inline-size: 2.25rem;
    block-size: 2.25rem;
    min-inline-size: 2.25rem;
    min-block-size: 2.25rem;
  }
  .env-shell-app-menu__start-recent .env-shell-app-menu__tile-icon ui-icon:not([data-launcher-icon]) {
    inline-size: 1.5rem !important;
    block-size: 1.5rem !important;
    --icon-size: 1.5rem;
    --icon-padding: 0px;
  }
  .env-shell-app-menu__start-recent .env-shell-app-menu__tile-label {
    -webkit-line-clamp: 1;
    text-align: start;
    font-size: 0.78rem;
  }
  .env-shell-app-menu__start-right .env-shell-app-menu__grid {
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    gap: 0.2rem;
    overflow: auto;
    min-block-size: fit-content;
    align-content: start;
    grid-template-columns: none;
  }
  .env-shell-app-menu__start-right .env-shell-app-menu__tile {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr);
    justify-items: start;
    align-items: center;
    gap: 0.65rem;
    padding: 0.4rem 0.55rem;
    text-align: start;
    border-radius: 10px;
    inline-size: 100%;
    box-sizing: border-box;
  }
  .env-shell-app-menu__start-right .env-shell-app-menu__tile-icon {
    inline-size: 2.5rem;
    block-size: 2.5rem;
    min-inline-size: 2.5rem;
    min-block-size: 2.5rem;
  }
  .env-shell-app-menu__start-right .env-shell-app-menu__tile-icon ui-icon:not([data-launcher-icon]) {
    inline-size: 1.75rem !important;
    block-size: 1.75rem !important;
    --icon-size: 1.75rem;
    --icon-padding: 0px;
  }
  .env-shell-app-menu__start-right .env-shell-app-menu__tile-label {
    -webkit-line-clamp: 1;
    text-align: start;
    font: 500 0.9rem/1.25 ui-sans-serif, system-ui, sans-serif;
    justify-self: stretch;
  }
  .env-shell-app-menu__crumb {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.35rem 0.55rem;
    min-block-size: 1.4rem;
  }
  .env-shell-app-menu__crumb-nav {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.2rem;
    min-inline-size: 0;
    flex: 1 1 auto;
  }
  .env-shell-app-menu__crumb-actions {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.3rem;
    margin-inline-start: auto;
  }
  .env-shell-app-menu__crumb-actions[hidden] {
    display: none !important;
  }
  .env-shell-app-menu__crumb-action {
    appearance: none;
    border: 1px solid light-dark(color-mix(in oklab, #000 12%, transparent), color-mix(in oklab, #fff 14%, transparent));
    background: var(--env-app-menu-surface-raised);
    color: inherit;
    font: 600 0.72rem/1.2 ui-sans-serif, system-ui, sans-serif;
    padding: 0.28rem 0.5rem;
    border-radius: 8px;
    cursor: pointer;
  }
  .env-shell-app-menu__crumb-action:hover {
    background: light-dark(color-mix(in oklab, #000 8%, transparent), color-mix(in oklab, #fff 10%, transparent));
  }
  .env-shell-app-menu__crumb-item {
    appearance: none;
    border: 0;
    background: transparent;
    color: inherit;
    font: 600 0.78rem/1.2 ui-sans-serif, system-ui, sans-serif;
    padding: 0.15rem 0.35rem;
    border-radius: 6px;
    cursor: pointer;
  }
  .env-shell-app-menu__crumb-item:hover {
    background: light-dark(color-mix(in oklab, #000 8%, transparent), color-mix(in oklab, #fff 10%, transparent));
  }
  .env-shell-app-menu__crumb-sep {
    opacity: 0.45;
    font-size: 0.85rem;
  }
  .env-shell-app-menu__empty--compact {
    margin: 0.35rem 0;
    font-size: 0.75rem;
    text-align: start;
    padding-inline: 0.25rem;
  }
  @media (max-width: 520px) {
    .env-shell-app-menu__tools {
      grid-template-columns: 1fr 1fr;
    }
    .env-shell-app-menu__search {
      grid-column: 1/-1;
    }
    .env-shell-app-menu__sort,
    .env-shell-app-menu__sort-dir {
      max-inline-size: none;
    }
    .env-shell-app-menu__start-body {
      grid-template-columns: 1fr;
      grid-template-rows: minmax(0, 8rem) minmax(0, 1fr);
    }
    .env-shell-app-menu__start-recent {
      display: flex;
      flex-direction: column;
      overflow: auto;
    }
  }
  .env-shell-app-menu__banner {
    display: grid;
    gap: 0.65rem;
    padding: 0.65rem 0.75rem;
    border-radius: 10px;
    background: color-mix(in oklab, var(--env-app-menu-accent, var(--color-primary, #60cdff)) 14%, transparent);
    border: 1px solid color-mix(in oklab, var(--env-app-menu-accent, var(--color-primary, #60cdff)) 35%, transparent);
  }
  .env-shell-app-menu__banner[hidden] {
    display: none !important;
  }
  .env-shell-app-menu__banner-text {
    margin: 0;
    font: 500 0.9rem/1.35 ui-sans-serif, system-ui, sans-serif;
  }
  .env-shell-app-menu__banner-action {
    justify-self: start;
  }
  .env-shell-app-menu__tools {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto auto;
    gap: 0.4rem;
    align-items: stretch;
    position: sticky;
    inset-block-start: 0;
    z-index: 99;
  }
  .env-shell-app-menu__tools[hidden] {
    display: none !important;
  }
  .env-shell-app-menu__search,
  .env-shell-app-menu__sort,
  .env-shell-app-menu__sort-dir {
    padding: 0.55rem 0.65rem;
    border-radius: 10px;
    border: 1px solid light-dark(color-mix(in oklab, #000 12%, transparent), color-mix(in oklab, #fff 14%, transparent));
    background: var(--env-app-menu-surface-raised);
    color: inherit;
    font: 400 0.9rem/1.2 ui-sans-serif, system-ui, sans-serif;
    box-sizing: border-box;
  }
  .env-shell-app-menu__search {
    inline-size: 100%;
    min-inline-size: 0;
  }
  .env-shell-app-menu__sort,
  .env-shell-app-menu__sort-dir {
    max-inline-size: 11rem;
  }
  .env-shell-app-menu__search[hidden] {
    display: none !important;
  }
  .env-shell-app-menu__grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(4.5rem, 1fr));
    gap: 0.5rem;
    min-block-size: fit-content;
    align-content: start;
    grid-auto-rows: max-content;
    block-size: max-content;
    touch-action: pan-y;
    -webkit-overflow-scrolling: touch;
    overflow: visible;
    pointer-events: auto;
  }
  .env-shell-app-menu__grid[hidden] {
    display: none !important;
  }
  .env-shell-app-menu__tile {
    display: grid;
    gap: 0.35rem;
    justify-items: center;
    align-content: start;
    min-block-size: fit-content;
    flex-shrink: 0;
    padding: 0.45rem 0.25rem;
    border: 0;
    border-radius: 12px;
    background: transparent;
    color: inherit;
    cursor: pointer;
    text-align: center;
    /* Let vertical pans scroll the panel; long-press + move still starts pin drag. */
    touch-action: pan-y;
    -webkit-user-select: none;
    user-select: none;
  }
  .env-shell-app-menu__tile:hover,
  .env-shell-app-menu__tile:focus-visible {
    background: color-mix(in oklab, var(--env-app-menu-accent, var(--color-primary, #60cdff)) 12%, transparent);
    outline: none;
  }
  .env-shell-app-menu__tile--dragging {
    opacity: 0.45;
  }
  html[data-app-menu-dragging] .env-shell-app-menu {
    pointer-events: none;
  }
  html[data-app-menu-dragging] .env-shell-app-menu__panel {
    opacity: 0;
    visibility: hidden;
  }
  .env-shell-app-menu__drag-ghost {
    position: fixed;
    z-index: calc(var(--env-z-shell-chrome, 2147483000) + 8);
    inset: 0 auto auto 0;
    display: grid;
    gap: 0.35rem;
    justify-items: center;
    inline-size: 4.5rem;
    pointer-events: none;
    will-change: transform;
  }
  .env-shell-app-menu__drag-ghost-icon {
    position: relative;
    display: grid;
    place-content: center;
    place-items: center;
    inline-size: 3rem;
    block-size: 3rem;
    padding: 0;
    aspect-ratio: 1/1;
    border-radius: 50%;
    border: none;
    background: light-dark(color-mix(in oklab, #e8eaed 72%, var(--wf-md-primary, var(--color-primary, #60cdff)) 28%), color-mix(in oklab, #111827 72%, var(--wf-md-primary, var(--color-primary, #60cdff)) 28%));
    box-shadow: 0 8px 24px -8px rgba(0, 0, 0, 0.55);
    backdrop-filter: blur(16px) saturate(1.35);
    -webkit-backdrop-filter: blur(16px) saturate(1.35);
    box-sizing: border-box;
    overflow: hidden;
    contain: layout style;
  }
  @supports (corner-shape: round) {
    .env-shell-app-menu__drag-ghost-icon {
      corner-shape: round;
    }
  }
  .env-shell-app-menu__drag-ghost-icon img[data-icon-pending],
  .env-shell-app-menu__drag-ghost-icon img[data-launcher-icon]:not([src]),
  .env-shell-app-menu__drag-ghost-icon ui-icon[data-icon-pending] {
    opacity: 0;
    visibility: hidden;
  }
  .env-shell-app-menu__drag-ghost-icon img[data-launcher-icon],
  .env-shell-app-menu__drag-ghost-icon .ui-ws-item-icon-img {
    position: absolute;
    inset: 0;
    inline-size: 100%;
    block-size: 100%;
    object-fit: cover;
    object-position: center;
    pointer-events: none;
    border-radius: 0;
    transform: scale(1.28);
    transform-origin: center;
  }
  .env-shell-app-menu__drag-ghost-icon ui-icon[data-launcher-icon] {
    position: absolute;
    inset: 0;
    inline-size: 100%;
    block-size: 100%;
    min-inline-size: 0;
    min-block-size: 0;
    max-inline-size: none;
    max-block-size: none;
    --icon-size: 100%;
    --icon-padding: 0px;
    pointer-events: none;
    transform: scale(1.28);
    transform-origin: center;
  }
  .env-shell-app-menu__drag-ghost-label {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    font: 600 0.68rem/1.15 ui-sans-serif, system-ui, sans-serif;
    text-align: center;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.35);
  }
  /* Match SpeedDial \`.ui-ws-item-icon\` launcher tiles — shape plate + full-bleed bitmap. */
  .env-shell-app-menu__tile-icon {
    position: relative;
    display: grid;
    place-content: center;
    place-items: center;
    inline-size: 2.5rem !important;
    block-size: 2.5rem !important;
    min-inline-size: 2.5rem !important;
    min-block-size: 2.5rem !important;
    padding: 0 !important;
    aspect-ratio: 1/1 !important;
    border-radius: 50% !important;
    border: none;
    background: var(--env-app-menu-plate);
    box-shadow: 0 6px 24px -8px color-mix(in oklab, #000 38%, transparent);
    backdrop-filter: blur(16px) saturate(1.35);
    -webkit-backdrop-filter: blur(16px) saturate(1.35);
    box-sizing: border-box;
    overflow: hidden;
    color: var(--color-on-primary-container, var(--env-app-menu-ink));
    --icon-color: var(--color-on-primary-container, var(--env-app-menu-ink));
    /* WHY: \`.shaped\` stretch/fit-content + 1.5rem beat 50% — plate was not a disk. */
  }
  .env-shell-app-menu__tile-icon:not([data-shape]), .env-shell-app-menu__tile-icon[data-shape=circle] {
    aspect-ratio: 1/1 !important;
    border-radius: 50% !important;
  }
  @supports (corner-shape: round) {
    .env-shell-app-menu__tile-icon:not([data-shape]), .env-shell-app-menu__tile-icon[data-shape=circle] {
      corner-shape: round;
    }
  }
  .env-shell-app-menu__tile-icon[data-shape=squircle] {
    border-radius: 1.5rem !important;
  }
  @supports (corner-shape: squircle) {
    .env-shell-app-menu__tile-icon[data-shape=squircle] {
      corner-shape: unset;
    }
  }
  @supports (corner-shape: round) {
    .env-shell-app-menu__tile-icon[data-shape=squircle] {
      corner-shape: round;
    }
  }
  .env-shell-app-menu__tile-icon[data-shape=square] {
    border-radius: 12% !important;
  }
  @supports (corner-shape: square) {
    .env-shell-app-menu__tile-icon[data-shape=square] {
      corner-shape: square;
    }
  }
  .env-shell-app-menu__tile-icon[data-shape=shapeless] {
    overflow: visible !important;
    contain: none;
    background: transparent !important;
    box-shadow: none !important;
    backdrop-filter: none !important;
    -webkit-backdrop-filter: none !important;
    border-radius: 0 !important;
  }
  @supports (corner-shape: squircle) {
    .env-shell-app-menu__tile-icon[data-shape=shapeless] {
      corner-shape: unset;
    }
  }
  .env-shell-app-menu__tile-icon[data-shape=shapeless] img[data-launcher-icon],
  .env-shell-app-menu__tile-icon[data-shape=shapeless] .ui-ws-item-icon-img,
  .env-shell-app-menu__tile-icon[data-shape=shapeless] .env-shell-app-menu__tile-favicon,
  .env-shell-app-menu__tile-icon[data-shape=shapeless] ui-icon {
    object-fit: contain;
  }
  .env-shell-app-menu__tile-icon[data-shape=shapeless] img.sd-icon-silhouette,
  .env-shell-app-menu__tile-icon[data-shape=shapeless] ui-icon.sd-icon-silhouette {
    position: absolute;
    inset: 0;
    z-index: 0;
    pointer-events: none;
    object-fit: contain;
    opacity: 0.4;
    filter: brightness(0) blur(6px);
    transform: translateY(10%);
  }
  .env-shell-app-menu__tile-icon[data-shape=shapeless] img[data-launcher-icon]:not(.sd-icon-silhouette),
  .env-shell-app-menu__tile-icon[data-shape=shapeless] .ui-ws-item-icon-img:not(.sd-icon-silhouette) {
    object-fit: contain;
    z-index: 2;
    filter: none;
  }
  .env-shell-app-menu__tile-icon[data-shape=shapeless][data-icon-display=glyph] ui-icon:not(.sd-icon-silhouette) {
    filter: drop-shadow(0 2px 5px rgba(0, 0, 0, 0.4));
  }
  .env-shell-app-menu__tile-icon[data-shape=shapeless][data-icon-display=glyph] .sd-icon-silhouette {
    display: none;
  }
  .env-shell-app-menu__tile-icon img[data-icon-pending],
  .env-shell-app-menu__tile-icon img[data-launcher-icon]:not([src]),
  .env-shell-app-menu__tile-icon ui-icon[data-icon-pending] {
    opacity: 0;
    visibility: hidden;
  }
  .env-shell-app-menu__tile-icon img[data-launcher-icon],
  .env-shell-app-menu__tile-icon .ui-ws-item-icon-img[data-launcher-icon] {
    position: absolute;
    inset: 0;
    z-index: 1;
    display: block;
    inline-size: 100%;
    block-size: 100%;
    max-inline-size: none;
    max-block-size: none;
    object-fit: cover;
    object-position: center;
    pointer-events: none;
    /* Plate clips to circle/squircle — don't square the bitmap itself. */
    border-radius: 0;
    transform: scale(var(--sd-item-icon-scale, var(--sd-launcher-icon-scale, 1.28)));
    transform-origin: center;
  }
  .env-shell-app-menu__tile-icon img[data-launcher-icon][data-icon-pack],
  .env-shell-app-menu__tile-icon .ui-ws-item-icon-img[data-launcher-icon][data-icon-pack] {
    transform: scale(var(--sd-item-icon-scale, var(--sd-launcher-icon-scale, 1.28)));
  }
  .env-shell-app-menu__tile-icon {
    /* Bookmark / non-launcher favicons — inset glyph-sized mark inside the plate. */
  }
  .env-shell-app-menu__tile-icon .ui-ws-item-icon-img:not([data-launcher-icon]),
  .env-shell-app-menu__tile-icon .env-shell-app-menu__tile-favicon:not([data-launcher-icon]) {
    position: relative;
    z-index: 1;
    display: block;
    inline-size: 1.75rem;
    block-size: 1.75rem;
    max-inline-size: 90%;
    max-block-size: 90%;
    object-fit: contain;
    object-position: center;
    pointer-events: none;
    border-radius: 4px;
  }
  .env-shell-app-menu__tile-icon {
    /* Phosphor glyphs — rem box; % --icon-size collapses in this plate. */
  }
  .env-shell-app-menu__tile-icon ui-icon {
    position: relative;
    z-index: 1;
    display: inline-grid !important;
    inline-size: 1.75rem !important;
    block-size: 1.75rem !important;
    min-inline-size: 1.75rem !important;
    min-block-size: 1.75rem !important;
    max-inline-size: 1.75rem !important;
    max-block-size: 1.75rem !important;
    --icon-size: 1.75rem;
    --icon-padding: 0px;
    --icon-color: currentColor;
    color: inherit;
    pointer-events: none;
  }
  .env-shell-app-menu__tile-icon ui-icon[data-launcher-icon] {
    position: absolute;
    inset: 0;
    inline-size: 100% !important;
    block-size: 100% !important;
    min-inline-size: 0 !important;
    min-block-size: 0 !important;
    max-inline-size: none !important;
    max-block-size: none !important;
    --icon-size: 100%;
    --icon-padding: 0px;
    pointer-events: none;
    z-index: 1;
    transform: scale(1.28);
    transform-origin: center;
  }
  .env-shell-app-menu__tile-label {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
    font: 500 0.68rem/1.15 ui-sans-serif, system-ui, sans-serif;
    word-break: break-word;
  }
  .env-shell-app-menu__empty {
    grid-column: 1/-1;
    margin: 0.5rem 0;
    text-align: center;
    opacity: 0.75;
    font: 400 0.85rem/1.3 ui-sans-serif, system-ui, sans-serif;
  }
  @keyframes env-app-menu-in {
    from {
      opacity: 0;
      transform: translateY(8px) scale(0.98);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
  .env-shell-app-menu__pin-menu {
    position: fixed;
    z-index: calc(var(--env-z-shell-chrome, 2147483000) + 4);
    display: grid;
    gap: 0.25rem;
    min-inline-size: 10rem;
    padding: 0.35rem;
    border-radius: 10px;
    border: 1px solid light-dark(color-mix(in oklab, #000 12%, transparent), color-mix(in oklab, #fff 14%, transparent));
    background: var(--env-app-menu-surface);
    color: var(--env-app-menu-ink);
    box-shadow: 0 12px 32px -12px light-dark(rgba(0, 0, 0, 0.22), rgba(0, 0, 0, 0.45)), 0 2px 8px -2px light-dark(rgba(0, 0, 0, 0.12), rgba(0, 0, 0, 0.25));
    color-scheme: inherit;
  }
  .env-shell-app-menu__pin-action {
    justify-content: start;
    inline-size: 100%;
    text-align: start;
  }
}`})))()}function za(){return document.documentElement.dataset.cwspShellRole===`launcher`||globalThis.__RS_SHELL_ROLE__===`launcher`}function Ba(){return za()||Qn()}function Va(){return za()?`launcher`:Qn()?`bookmarks`:null}async function Ha(){if(io)return io;try{return await F(()=>import(`./launcher-bridge-Df9GjB_e.js`),[],import.meta.url)}catch{return null}}function Ua(){if(!to){to=!0;try{document.adoptedStyleSheets=[...document.adoptedStyleSheets,eo]}catch{}}}function Wa(){return document.querySelector(`.env-shell-root`)||document.querySelector(`env-shell-container`)||document.querySelector(`.env-shell-chrome`)?.parentElement||document.body}function Ga(e,t){let n=document.createElement(`div`);n.className=`env-shell-app-menu__drag-ghost`,n.setAttribute(`aria-hidden`,`true`);let r=e.cloneNode(!0);r.className=`env-shell-app-menu__drag-ghost-icon ui-ws-item-icon shaped`,r.setAttribute(`data-shape`,Se(e.getAttribute(`data-shape`),`circle`));let i=document.createElement(`span`);return i.className=`env-shell-app-menu__drag-ghost-label`,i.textContent=t,n.append(r,i),n}function Ka(e,t){let n=Se(t.chrome.shape,ao);e.setAttribute(`data-shape`,n),e.classList.add(`ui-ws-item-icon`,`shaped`);let r=String(t.chrome.iconUrl||``).trim()||String(t.resourceUrl||``).trim(),i=Oe(t.chrome.iconScale),a=mi(r)?Di(r,i):``,o=String(a||(mi(r)?``:r)||``).trim(),s=he(t.chrome.iconDisplay)||Te({iconDisplay:t.chrome.iconDisplay,iconUrl:o||r,isLauncherApp:!!t.launcher,isBookmarkFavicon:!!(o||r)&&!t.launcher});e.setAttribute(`data-icon-display`,s),De(e,Ke(s,t.chrome.iconScale)),e.replaceChildren();let c=()=>{Pe(e),Ie(e)};if(s===`glyph`){let n=String(t.chrome.icon||t.fallbackGlyph||`device-mobile`).trim()||`device-mobile`,r=document.createElement(`ui-icon`);r.setAttribute(`icon`,n),r.setAttribute(`icon-style`,`duotone`),r.setAttribute(`aria-hidden`,`true`),e.append(r),c();return}if(s===`colored`){let n=document.createElement(`img`);n.className=t.launcher?`ui-ws-item-icon-img`:`ui-ws-item-icon-img env-shell-app-menu__tile-favicon`,n.alt=``,n.decoding=`async`,n.draggable=!1,n.referrerPolicy=`no-referrer`,!t.launcher&&(qn(o)||qn(r))?n.toggleAttribute(`data-bookmark-favicon`,!0):t.launcher&&n.toggleAttribute(`data-launcher-icon`,!0),o?n.src=o:n.toggleAttribute(`data-icon-pending`,!0),e.append(n),c(),mi(r)&&Ei(r,i).then(e=>{!e||!n.isConnected||(n.src=e,n.removeAttribute(`data-icon-pending`),c())});return}let l=me({display:s,glyph:String(t.chrome.icon||t.fallbackGlyph||`device-mobile`),resourceUrl:o||void 0,launcher:t.launcher,className:`ui-ws-item-icon-native`});e.append(l),c(),t.launcher&&o&&s!==`glyph`&&(Mi(l,o,s),c()),mi(r)&&Ei(r,i).then(e=>{!e||!l.isConnected||(Mi(l,e,s),c())})}function qa(e,t,n,r){let i=()=>He(t),a=typeof window<`u`&&(window.matchMedia?.(`(pointer: coarse)`)?.matches||`ontouchstart`in window);e.draggable=!a,a||(e.addEventListener(`dragstart`,e=>{let t=i();if(e.dataTransfer?.setData(`text/plain`,t),e.dataTransfer?.setData(`application/json`,t),e.dataTransfer){e.dataTransfer.effectAllowed=`copy`;try{e.dataTransfer.setDragImage(n,24,24)}catch{}}document.documentElement.toggleAttribute(`data-app-menu-dragging`,!0)}),e.addEventListener(`dragend`,()=>{document.documentElement.toggleAttribute(`data-app-menu-dragging`,!1)}));let o,s=null,c=0,l=0,u=!1,d=!1,f=!1,p=null,m=()=>{o&&=(clearTimeout(o),void 0)},h=()=>{if(m(),u=!1,d&&(d=!1,e.classList.remove(`env-shell-app-menu__tile--dragging`),document.documentElement.toggleAttribute(`data-app-menu-dragging`,!1),p?.remove(),p=null,s!=null)){try{e.releasePointerCapture(s)}catch{}s=null}},g=(r,i,a)=>{if(!d){u=!1,d=!0,f=!0,e.classList.add(`env-shell-app-menu__tile--dragging`),document.documentElement.toggleAttribute(`data-app-menu-dragging`,!0),p=Ga(n,t.label),document.body.appendChild(p),p.style.transform=`translate(${r}px, ${i}px) translate(-50%, -50%)`;try{e.setPointerCapture(a)}catch{}}},_=(e,t)=>{p&&(p.style.transform=`translate(${e}px, ${t}px) translate(-50%, -50%)`)},v=(e,n)=>{if(!je(e,n))return;let i=Ge(e,n);Ee(t,i??void 0)&&(U(`Pinned ${t.label} to desktop`),r.onPinned?.())},y=t=>{if(d){if(d=!1,u=!1,e.classList.remove(`env-shell-app-menu__tile--dragging`),document.documentElement.toggleAttribute(`data-app-menu-dragging`,!1),p?.remove(),p=null,s!=null){try{e.releasePointerCapture(s)}catch{}s=null}v(t.clientX,t.clientY)}};e.addEventListener(`pointerdown`,e=>{e.button===0&&(m(),s=e.pointerId,c=e.clientX,l=e.clientY,f=!1,d=!1,u=!1,o=setTimeout(()=>{o=void 0,u=!0,f=!0},no))},{passive:!0}),e.addEventListener(`pointermove`,e=>{if(o&&!d&&!u){let t=e.clientX-c,n=e.clientY-l;Math.hypot(t,n)>ro&&m();return}if(u&&!d){let t=e.clientX-c,n=e.clientY-l;Math.hypot(t,n)>ro&&g(e.clientX,e.clientY,e.pointerId);return}d&&(_(e.clientX,e.clientY),e.preventDefault())},{passive:!1}),e.addEventListener(`pointerup`,e=>{if(m(),u=!1,d){y(e);return}}),e.addEventListener(`pointercancel`,e=>{m(),u=!1,d&&y(e)}),e.addEventListener(`contextmenu`,()=>{h()},!0),e.addEventListener(`click`,e=>{f&&=(e.preventDefault(),e.stopPropagation(),!1)},!0)}async function Ja(e,t){let n=Vn(t.packageName),r=n.componentName||t.componentName;await e.launcherLaunch(t.packageName,r,Ln(n)?void 0:n)||W(`Unable to open “${t.label}”`)}function Ya(e,t,n,r,i){let a=document.createElement(`button`);a.type=`button`,a.className=`env-shell-app-menu__tile`,a.setAttribute(`data-package`,e.packageName),a.title=`${e.label} — right-click: info / uninstall / launch; hold and drag`;let o=oa(e.packageName),s=document.createElement(`span`);s.className=`env-shell-app-menu__tile-icon ui-ws-item-icon shaped`;let c=document.createElement(`span`);c.className=`env-shell-app-menu__tile-label`,c.textContent=e.label,a.append(s,c);let l=e.iconCacheKey||e.packageName,u=(e=``)=>{Ka(s,{chrome:ca(o),fallbackGlyph:`device-mobile`,resourceUrl:e,launcher:!0})},d=Oe(ca(o).iconScale);return u(Si(l,d)),Ti(l,d).then(e=>{n===r()&&e&&u(e)}).catch(()=>{}),qa(a,e,s,i),a.addEventListener(`contextmenu`,n=>{n.preventDefault(),n.stopPropagation(),di({x:n.clientX,y:n.clientY,compact:!0,items:[{id:`place-desktop`,label:`Place on desktop`,icon:`desktop`,action:()=>{Ee(e)&&(U(`Placed “${e.label}” on desktop`),i.onPinned?.())}},{id:`icon-design`,label:`Icon design…`,icon:`palette`,action:()=>{da({title:e.label,key:o,packageName:e.packageName,defaults:{shape:ao,iconDisplay:`colored`},onSave:e=>{let t={...ca(o),...e},n=Oe(t.iconScale),r=(e=``)=>{Ka(s,{chrome:t,fallbackGlyph:`device-mobile`,resourceUrl:e,launcher:!0})};r(Si(l,n)||(mi(String(t.iconUrl||``))?``:String(t.iconUrl||``).trim())),mi(String(t.iconUrl||``))?Ei(t.iconUrl,n).then(e=>{e&&r(e)}):Ti(l,n).then(e=>{e&&r(e)})}})}},{id:`launch`,label:`Open`,icon:`arrow-square-out`,action:async()=>{try{await Ja(t,e)}catch{}}},{id:`app-info`,label:`App info`,icon:`info`,action:async()=>{let n=null;try{n=await t.launcherAppInfo?.(e.packageName)||null}catch{n=null}Er({title:e.label,fallback:{packageName:e.packageName,componentName:e.componentName,label:e.label},info:n,onOpenSystem:t.launcherOpenAppInfo?()=>t.launcherOpenAppInfo(e.packageName):void 0})}},...t.launcherOpenAppInfo?[{id:`android-settings`,label:`Android settings`,icon:`gear`,action:async()=>{try{await t.launcherOpenAppInfo(e.packageName)||W(`Cannot open Android settings for “${e.label}”`)}catch{W(`Cannot open Android settings for “${e.label}”`)}}}]:[],{id:`edit-launch`,label:`Edit launch…`,icon:`sliders`,action:()=>{Dr({title:e.label,packageName:e.packageName,defaultComponent:e.componentName})}},...t.launcherUninstall?[{id:`uninstall`,label:`Uninstall`,icon:`trash`,danger:!0,action:async()=>{if(Or(e.label,`Uninstall`))try{if(!await t.launcherUninstall(e.packageName)){W(`Cannot uninstall “${e.label}”`);return}U(`Uninstall started for “${e.label}”`),kr(()=>i.onAppsChanged?.())}catch{W(`Cannot uninstall “${e.label}”`)}}}]:[]]})}),a.addEventListener(`click`,async n=>{n.preventDefault(),n.stopPropagation();try{await Ja(t,e)}catch{}}),a}function Xa(e,t,n,r,i){if(t.folder||!String(t.url||``).trim())return;let a,o=!1,s=!1,c=0,l=0,u=-1,d=null,f=()=>{a!=null&&(clearTimeout(a),a=void 0)},p=()=>{if(f(),o=!1,s){s=!1,e.classList.remove(`env-shell-app-menu__tile--dragging`),document.documentElement.toggleAttribute(`data-app-menu-dragging`,!1),d?.remove(),d=null;try{e.releasePointerCapture?.(u)}catch{}}},m=(r,i)=>{if(!s){o=!1,s=!0,e.classList.add(`env-shell-app-menu__tile--dragging`),document.documentElement.toggleAttribute(`data-app-menu-dragging`,!0),d=Ga(n,t.title),document.body.appendChild(d),d.style.transform=`translate(${r}px, ${i}px) translate(-50%, -50%)`;try{e.setPointerCapture?.(u)}catch{}}},h=(n,a)=>{if(f(),o=!1,s){s=!1,e.classList.remove(`env-shell-app-menu__tile--dragging`),document.documentElement.toggleAttribute(`data-app-menu-dragging`,!1),d?.remove(),d=null;try{e.releasePointerCapture?.(u)}catch{}if(je(n,a)){let e=Ge(n,a)??void 0,o=String(r.current||``).trim()||cr(t,Zn());lr(t,e,Zn(),o)&&(U(`Placed “${t.title}” on desktop`),i.onPinned?.())}}};e.addEventListener(`pointerdown`,e=>{(e.button==null||e.button===0)&&(c=e.clientX,l=e.clientY,u=e.pointerId,s=!1,o=!1,f(),a=setTimeout(()=>{a=void 0,o=!0},no))}),e.addEventListener(`pointermove`,e=>{if(!s&&!o){if(a==null)return;let t=e.clientX-c,n=e.clientY-l;t*t+n*n>100&&f();return}if(o&&!s){let t=e.clientX-c,n=e.clientY-l;t*t+n*n>100&&m(e.clientX,e.clientY);return}d&&(d.style.transform=`translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`,e.preventDefault())},{passive:!1}),e.addEventListener(`pointerup`,e=>h(e.clientX,e.clientY)),e.addEventListener(`pointercancel`,e=>h(e.clientX,e.clientY)),e.addEventListener(`contextmenu`,()=>p(),!0)}function Za(e,t,n,r,i){e.addEventListener(`contextmenu`,a=>{if(a.preventDefault(),a.stopPropagation(),t.folder){di({x:a.clientX,y:a.clientY,compact:!0,items:[{id:`open-folder`,label:`Open folder`,icon:`folder-open`,action:()=>{e.click()}},{id:`bm-info`,label:`Info`,icon:`info`,action:()=>{Ar(t)}},...n.update?[{id:`bm-edit`,label:`Rename folder…`,icon:`pencil`,action:()=>{Mr({entry:t,api:n,onSaved:()=>i.onAppsChanged?.()})}}]:[],...n.remove?[{id:`bm-delete`,label:`Delete folder`,icon:`trash`,danger:!0,action:async()=>{if(Or(t.title,`Delete`))try{if(!await n.remove(t)){W(`Could not delete “${t.title}”`);return}U(`Deleted “${t.title}”`),or(t.id),i.onAppsChanged?.()}catch{W(`Could not delete “${t.title}”`)}}}]:[]]});return}let o=nr(t.id);di({x:a.clientX,y:a.clientY,compact:!0,items:[{id:`place-desktop`,label:`Place on desktop`,icon:`desktop`,action:()=>{lr(t,void 0,n,String(r.current||``).trim()||cr(t,n))&&(U(`Placed “${t.title}” on desktop`),i.onPinned?.())}},{id:`icon-design`,label:`Icon design…`,icon:`palette`,action:()=>{let i=sa(t.id);da({title:t.title,key:i,pageUrl:String(t.url||``).trim(),defaults:{shape:ao,iconDisplay:`colored`},onSave:a=>{let o=e.querySelector(`.env-shell-app-menu__tile-icon`);if(!o)return;let s={...ca(i),...a},c=String(s.iconUrl||``).trim()||String(r.current||``).trim()||cr(t,n);Ka(o,{chrome:s,fallbackGlyph:t.folder?`folder`:`link`,resourceUrl:c}),c&&(r.current=c)}})}},o?{id:`unpin-start`,label:`Unpin from Start`,icon:`push-pin-slash`,action:()=>{ir(t.id)&&(U(`Unpinned “${t.title}”`),i.onStartPinsChanged?.())}}:{id:`pin-start`,label:`Pin to Start`,icon:`push-pin`,action:()=>{rr(t)&&(U(`Pinned “${t.title}” to Start`),i.onStartPinsChanged?.())}},{id:`open`,label:`Open`,icon:`arrow-square-out`,action:async()=>{er(t);try{await n.open(t)}catch{}}},{id:`bm-info`,label:`Info`,icon:`info`,action:()=>{Ar(t)}},...n.update&&!t.folder?[{id:`bm-edit`,label:`Edit bookmark…`,icon:`pencil`,action:()=>{Mr({entry:t,api:n,onSaved:()=>i.onAppsChanged?.()})}}]:[],...n.remove?[{id:`bm-delete`,label:t.folder?`Delete folder`:`Delete`,icon:`trash`,danger:!0,action:async()=>{if(Or(t.title,`Delete`))try{if(!await n.remove(t)){W(`Could not delete “${t.title}”`);return}U(`Deleted “${t.title}”`),or(t.id),i.onAppsChanged?.()}catch{W(`Could not delete “${t.title}”`)}}}]:[]]})})}function Qa(e,t,n,r){let i=document.createElement(`button`);i.type=`button`,i.className=`env-shell-app-menu__tile`,i.setAttribute(`data-bookmark-id`,e.id),e.folder&&i.setAttribute(`data-folder`,``),i.title=e.folder?`${e.title} — open folder`:`${e.title} — right-click: info / edit / delete; hold to drag`;let a=sa(e.id),o=document.createElement(`span`);o.className=`env-shell-app-menu__tile-icon ui-ws-item-icon shaped`,o.setAttribute(`data-shape`,ao);let s=document.createElement(`span`);s.className=`env-shell-app-menu__tile-label`,s.textContent=e.title,i.append(o,s);let c={current:``},l=t=>{let n=ca(a);if(n.shape||n.iconDisplay||n.icon||n.iconUrl){Ka(o,{chrome:n,fallbackGlyph:e.folder?`folder`:`link`,resourceUrl:String(n.iconUrl||t||``).trim()});return}o.setAttribute(`data-shape`,ao)};return fr(o,e,t).then(e=>{c.current=e,l(e)}),Xa(i,e,o,c,n),Za(i,e,t,c,n),i.addEventListener(`click`,async n=>{if(n.preventDefault(),n.stopPropagation(),!document.documentElement.hasAttribute(`data-app-menu-dragging`)){if(e.folder){r(e.id,e.title);return}er(e);try{await t.open(e)}catch{}}}),i}function $a(){Ua();let e=Va(),t=document.createElement(`div`);t.className=`env-shell-app-menu`,t.hidden=!0,t.setAttribute(`role`,`dialog`),t.setAttribute(`aria-modal`,`false`),t.setAttribute(`aria-label`,e===`bookmarks`?`Bookmarks`:`Apps`),e&&t.setAttribute(`data-menu-mode`,e);let n=()=>{try{let e=document.documentElement,n=(e.getAttribute(`data-theme`)||``).toLowerCase(),r=(e.style.colorScheme||``).trim().toLowerCase(),i=n===`light`||n===`dark`?n:r===`light`||r===`dark`?r:``;if(i===`light`||i===`dark`){t.dataset.theme=i,t.style.colorScheme=i;return}delete t.dataset.theme,t.style.colorScheme=`inherit`}catch{}};n();let r=()=>n();document.addEventListener(`u2-theme-change`,r);let i=new MutationObserver(r);try{i.observe(document.documentElement,{attributes:!0,attributeFilter:[`data-theme`,`data-scheme`,`style`]})}catch{}let a=document.createElement(`div`);a.className=`env-shell-app-menu__panel`,e===`bookmarks`&&a.setAttribute(`data-layout`,`start-split`);let o=document.createElement(`div`);o.className=`env-shell-app-menu__banner`,o.hidden=!0;let s=document.createElement(`p`);s.className=`env-shell-app-menu__banner-text`,s.textContent=`Set CWSP Launcher as Home`;let c=document.createElement(`button`);c.type=`button`,c.className=`env-shell-app-menu__banner-action btn`,c.textContent=`Set as default`,o.append(s,c);let l=document.createElement(`input`);l.type=`search`,l.className=`env-shell-app-menu__search`,l.placeholder=e===`bookmarks`?`Search bookmarks`:`Search apps`,l.autocomplete=`off`,l.setAttribute(`aria-label`,e===`bookmarks`?`Search bookmarks`:`Search apps`);let u=document.createElement(`div`);u.className=`env-shell-app-menu__tools`;let d=document.createElement(`select`);d.className=`env-shell-app-menu__sort`,d.setAttribute(`aria-label`,`Sort apps`);for(let[e,t]of _a){let n=document.createElement(`option`);n.value=e,n.textContent=t,d.appendChild(n)}let f=document.createElement(`select`);f.className=`env-shell-app-menu__sort-dir`,f.setAttribute(`aria-label`,`Sort order`);for(let[e,t]of[[`asc`,`A–Z / oldest`],[`desc`,`Z–A / newest`]]){let n=document.createElement(`option`);n.value=e,n.textContent=t,f.appendChild(n)}let p=()=>{let e=Ca();d.value=e.sortBy,f.value=e.sortDir};p(),u.append(l,d,f);let m=document.createElement(`div`);m.className=`env-shell-app-menu__start-body`,m.hidden=e!==`bookmarks`;let h=document.createElement(`div`);h.className=`env-shell-app-menu__start-left`,h.setAttribute(`aria-label`,`Pinned and recent bookmarks`);let g=document.createElement(`div`);g.className=`env-shell-app-menu__start-heading`,g.textContent=`Pinned`;let _=document.createElement(`div`);_.className=`env-shell-app-menu__start-recent env-shell-app-menu__start-pinned`;let v=document.createElement(`div`);v.className=`env-shell-app-menu__start-heading`,v.textContent=`Recent`;let y=document.createElement(`div`);y.className=`env-shell-app-menu__start-recent`,h.append(g,_,v,y);let b=document.createElement(`div`);b.className=`env-shell-app-menu__start-right`;let x=document.createElement(`div`);x.className=`env-shell-app-menu__crumb`;let S=document.createElement(`div`);S.className=`env-shell-app-menu__crumb-nav`;let C=document.createElement(`div`);C.className=`env-shell-app-menu__crumb-actions`,x.append(S,C);let w=document.createElement(`div`);w.className=`env-shell-app-menu__grid`,w.setAttribute(`data-part`,`grid`),w.setAttribute(`aria-label`,e===`bookmarks`?`Bookmarks`:`Installed apps`),b.append(x,w),m.append(h,b),e===`bookmarks`?a.append(o,u,m):a.append(o,u,w),t.appendChild(a),Wa().appendChild(t);let T=!1,E=0,D=``,O,k=[],A=()=>{if(!Ba()){t.hidden=!0,t.toggleAttribute(`data-open`,!1);return}t.hidden=!T,t.toggleAttribute(`data-open`,T)},j=()=>{T&&(T=!1,t.toggleAttribute(`data-page`,!1),A(),t.dispatchEvent(new CustomEvent(`env-app-menu-close`,{bubbles:!0})))};t.addEventListener(`env-app-menu-request-close`,e=>{e.stopPropagation(),j()});let M=()=>{Ba()&&(n(),T=!0,A(),I(),t.dispatchEvent(new CustomEvent(`env-app-menu-open`,{bubbles:!0})))},ee=()=>{t.toggleAttribute(`data-page`,!0),M()},te=()=>{T?j():M()},N={onPinned:()=>{j()},onStartPinsChanged:()=>{I()},onAppsChanged:()=>{I()}},ne=e=>{let t=Zn();if(!t?.create){W(`Cannot create bookmark here`);return}let n=k.length?k[k.length-1]:null,r=n?.id||`0`,i=n?.title||`Bookmarks`;(async()=>{let n=await jr({heading:e===`folder`?`New folder`:`New bookmark`,description:`Add to “${i}” (Chrome bookmarks)`,showUrl:e===`url`,initialTitle:e===`folder`?`New folder`:``,initialUrl:e===`url`?`https://`:``,submitLabel:`Create`});if(!n)return;let a=await t.create(r,{title:n.title,url:e===`url`?n.url:void 0});if(!a){W(e===`folder`?`Could not create folder`:`Could not create bookmark`);return}U(e===`folder`?`Created folder “${a.title}”`:`Created “${a.title}”`),I()})()},re=(e,t)=>{let n=document.createElement(`button`);return n.type=`button`,n.className=`env-shell-app-menu__crumb-action`,n.textContent=e,n.addEventListener(`click`,e=>{e.preventDefault(),e.stopPropagation(),t()}),n};C.append(re(`New bookmark`,()=>ne(`url`)),re(`New folder`,()=>ne(`folder`))),w.addEventListener(`contextmenu`,e=>{e.target?.closest?.(`[data-bookmark-id]`)||Va()===`bookmarks`&&Zn()?.create&&(e.preventDefault(),e.stopPropagation(),di({x:e.clientX,y:e.clientY,compact:!0,items:[{id:`new-bookmark`,label:`New bookmark…`,icon:`bookmark-simple`,action:()=>ne(`url`)},{id:`new-folder`,label:`New folder…`,icon:`folder-plus`,action:()=>ne(`folder`)}]}))});let ie=()=>{if(S.replaceChildren(),C.hidden=e!==`bookmarks`||!Zn()?.create,e!==`bookmarks`)return;let t=document.createElement(`button`);t.type=`button`,t.className=`env-shell-app-menu__crumb-item`,t.textContent=`Bookmarks`,t.addEventListener(`click`,()=>{k=[],I()}),S.appendChild(t),k.forEach((e,t)=>{let n=document.createElement(`span`);n.className=`env-shell-app-menu__crumb-sep`,n.textContent=`›`;let r=document.createElement(`button`);r.type=`button`,r.className=`env-shell-app-menu__crumb-item`,r.textContent=e.title,r.addEventListener(`click`,()=>{k=k.slice(0,t+1),I()}),S.append(n,r)})},P=async(e,t)=>{let n=[];try{n=await e.launcherList(D||void 0)}catch{n=[]}if(t!==E)return;w.replaceChildren();let r=Ca();if(r.sortBy===`color`&&(await Na(n,w),t!==E))return;if(n=Fa(n,r),n.length===0){let e=document.createElement(`p`);e.className=`env-shell-app-menu__empty`,e.textContent=D?`No matching apps`:`No apps found`,w.appendChild(e);return}let i=document.createDocumentFragment();for(let r of n)i.appendChild(Ya(r,e,t,()=>E,N));w.appendChild(i)},F=(e,t)=>{k.push({id:e,title:t}),D=``,l.value=``,I()},ae=async(e,t)=>{ie();let n=(t,n,r)=>{if(t.replaceChildren(),n.length===0){let e=document.createElement(`p`);e.className=`env-shell-app-menu__empty env-shell-app-menu__empty--compact`,e.textContent=r,t.appendChild(e);return}for(let r of n)t.appendChild(Qa(r,e,N,F))};n(_,tr(),`No pinned bookmarks`),n(y,$n(),`No recent bookmarks`);let r=[];try{if(D)r=await e.search(D);else{let t=k.length?k[k.length-1].id:void 0;r=await e.listChildren(t)}}catch{r=[]}if(t!==E)return;if(w.replaceChildren(),r.length===0){let e=document.createElement(`p`);e.className=`env-shell-app-menu__empty`,e.textContent=D?`No matching bookmarks`:`This folder is empty`,w.appendChild(e);return}let i=document.createDocumentFragment(),a=Ca().sortDir===`desc`?-1:1,o=r.filter(e=>e.folder),s=r.filter(e=>!e.folder),c=(e,t)=>String(e.title||``).localeCompare(String(t.title||``),void 0,{numeric:!0,sensitivity:`base`})*a;for(let t of[...o.sort(c),...s.sort(c)])i.appendChild(Qa(t,e,N,F));w.appendChild(i)},I=async()=>{let e=++E;o.hidden=!0,u.hidden=!1,l.hidden=!1;let n=Va();if(!n){A();return}if(t.setAttribute(`data-menu-mode`,n),n===`bookmarks`){a.setAttribute(`data-layout`,`start-split`),m.hidden=!1,a.contains(m)||(a.append(o,u,m),w.parentElement!==b&&b.append(x,w));let t=Zn();if(!t){o.hidden=!1,s.textContent=`Bookmarks API unavailable in this context`,c.hidden=!0,l.hidden=!0,u.hidden=!0,m.hidden=!0;return}c.hidden=!0,await ae(t,e);return}a.removeAttribute(`data-layout`),m.hidden=!0,w.parentElement!==a&&a.append(w);let r=await Ha();if(e!==E)return;if(!r?.launcherList||!r?.launcherLaunch||!r?.launcherIcon){o.hidden=!1,s.textContent=`Launcher bridge unavailable — rebuild the Capacitor APK`,c.hidden=!0,l.hidden=!0,u.hidden=!0,w.hidden=!0;return}let i=!1;try{i=await r.launcherIsDefault()}catch{i=!1}e===E&&(i?o.hidden=!0:(o.hidden=!1,s.textContent=`Set CWSP Launcher as Home for full launcher integration`,c.hidden=!1),l.hidden=!1,u.hidden=!1,w.hidden=!1,await P(r,e))};d.addEventListener(`change`,()=>{let e=d.value;wa({sortBy:e,sortDir:Sa(e)}),p()}),f.addEventListener(`change`,()=>{wa({sortDir:f.value===`desc`?`desc`:`asc`})});let oe=()=>{p(),T&&I()};window.addEventListener(ha,oe),l.addEventListener(`input`,()=>{D=l.value.trim(),O&&clearTimeout(O),O=setTimeout(()=>{I()},180)}),c.addEventListener(`click`,async e=>{e.preventDefault(),e.stopPropagation();let t=await Ha();if(t){try{await t.launcherRequestDefault()}catch{}I()}});let se=e=>{if(!T||document.documentElement.hasAttribute(`data-app-menu-dragging`))return;let n=typeof e.composedPath==`function`?e.composedPath():[];for(let e of n)if(e===t||e===a||e instanceof Element&&t.contains(e)||e instanceof Element&&e.closest?.(`.cw-context-menu-layer`)||e instanceof Element&&e.closest?.(`.env-shell-app-menu__chrome-editor`)||e instanceof Element&&e.closest?.(`dialog.speed-dial-editor`))return;j()};document.addEventListener(`pointerdown`,se,{capture:!0});let ce=[`.env-shell-app-menu__tile`,`.env-shell-app-menu__search`,`.env-shell-app-menu__sort`,`.env-shell-app-menu__sort-dir`,`.env-shell-app-menu__tools`,`.env-shell-app-menu__banner`,`.env-shell-app-menu__pin-menu`,`.env-shell-app-menu__crumb-item`,`.env-shell-app-menu__start-heading`,`.env-shell-app-menu__chrome-editor`,`.env-shell-app-menu__drag-ghost`,`.cw-context-menu-layer`,`dialog.speed-dial-editor`].join(`, `),L=null,R=e=>e instanceof Element&&!!e.closest(ce),le=e=>{if(T&&(e.button==null||e.button===0)){if(document.documentElement.hasAttribute(`data-app-menu-dragging`)||R(e.target)){L=null;return}L={id:e.pointerId,x:e.clientX,y:e.clientY}}},ue=e=>{if(!L||L.id!==e.pointerId)return;let t=e.clientX-L.x,n=e.clientY-L.y;L=null,T&&(document.documentElement.hasAttribute(`data-app-menu-dragging`)||R(e.target)||Math.hypot(t,n)>14||j())},de=e=>{L?.id===e.pointerId&&(L=null)};return t.addEventListener(`pointerdown`,le),t.addEventListener(`pointerup`,ue),t.addEventListener(`pointercancel`,de),A(),{element:t,toggle:te,open:M,openPage:ee,close:j,isOpen:()=>T,refresh:I,dispose:()=>{O&&clearTimeout(O),document.documentElement.toggleAttribute(`data-app-menu-dragging`,!1),document.removeEventListener(`pointerdown`,se,{capture:!0}),t.removeEventListener(`pointerdown`,le),t.removeEventListener(`pointerup`,ue),t.removeEventListener(`pointercancel`,de),document.removeEventListener(`u2-theme-change`,r),window.removeEventListener(ha,oe);try{i.disconnect()}catch{}t.remove()}}}var eo,to,no,ro,io,ao;function oo(){return(oo=e((()=>{l(),se(),Ae(),Gn(),Rr(),Ri(),fi(),ge(),ma(),Tr(),Ia(),Ra(),P(),eo=f(La),to=!1,no=420,ro=10,io=null,ao=`circle`})))()}var so,co,lo,uo,fo;function po(){return(po=e((()=>{Ae(),so=null,co=e=>{let t=We(e.id);return Math.max(0,Number(t?.androidWidgetId)||0)},lo=(e,t)=>{let n=t.getBoundingClientRect();return{widgetId:e,x:n.left,y:n.top,w:Math.max(8,n.width),h:Math.max(8,n.height),dpr:Number(window.devicePixelRatio)||1}},uo=e=>{if(!so)return;let t=e||document.getElementById(`home`);t&&t.querySelectorAll(`[data-speed-dial-item][data-widget="android"][data-layer="icons"]`).forEach(e=>{let t=(Je||[]).find(t=>t?.id===e.dataset.id);if(!t)return;let n=co(t);if(!n)return;let r=lo(n,e);so.widgetAttach(r)})},fo=()=>{so?.widgetHideAll?.()}})))()}var mo,ho,go,_o,vo,yo,bo,xo,So,Co,wo,To,Eo,Do,Oo,ko,Ao,jo,Mo;function No(){return(No=e((()=>{Fe(),Ae(),po(),mo=`/user/workspaces/`,ho=`cwsp:workspace-page`,go=`cw::workspace::pages`,_o=e=>`${mo}${e}/`,vo=()=>[`side-a`,`side-b`,`side-c`].map(e=>({id:e,label:`Side ${e.slice(-1).toUpperCase()}`,path:_o(e)})),yo=()=>({activeId:`side-a`,pages:vo(),snapshots:{}}),bo=()=>{try{let e=localStorage.getItem(go);if(!e)return yo();let t=JSON.parse(e);return!t||!Array.isArray(t.pages)||!t.pages.length?yo():{activeId:String(t.activeId||t.pages[0].id),pages:t.pages.map(e=>({id:String(e.id||``).trim(),label:String(e.label||e.id),path:String(e.path||_o(e.id))})).filter(e=>e.id),snapshots:t.snapshots&&typeof t.snapshots==`object`?t.snapshots:{}}}catch{return yo()}},xo=e=>({items:(e?.items||[]).map(e=>{let t=String(e.meta?.iconUrl||``);if(!/^(data:|blob:)/i.test(t))return e;let n={...e.meta||{}};return/^data:/i.test(t)&&e.id?n.iconUrl=Me(String(e.id),t):delete n.iconUrl,{...e,meta:n}})}),So=e=>{try{localStorage.setItem(go,JSON.stringify(e))}catch(e){console.warn(`[workspace-pages] catalog persist failed`,e)}},Co=e=>{try{window.dispatchEvent(new CustomEvent(ho,{detail:{id:e,pages:wo()}}))}catch{}},wo=()=>bo().pages,To=()=>bo().activeId||`side-a`,Eo=()=>{let e=bo();e.pages.some(t=>t.id===e.activeId)&&(e.snapshots[e.activeId]=xo(ke()),So(e))};try{let e=globalThis;e.__CWSP_WORKSPACE_SNAPSHOT_SYNC_BOUND__||(e.__CWSP_WORKSPACE_SNAPSHOT_SYNC_BOUND__=!0,window.addEventListener(ze,Eo))}catch{}Do=async e=>{try{let t=be(`/user/`);if(!t?.mkdir||!t.writable)return;if(await t.mkdir(`/user/`,`workspaces`).catch(()=>void 0),await t.mkdir(mo,e.id).catch(()=>void 0),t.writeFile){let n=new File([JSON.stringify({id:e.id,label:e.label,path:e.path},null,2)],`workspace.json`,{type:`application/json`});await t.writeFile(e.path,n).catch(()=>void 0)}}catch(t){console.warn(`[workspace-pages] explorer dir failed`,e.id,t)}},Oo=()=>{try{return matchMedia(`(prefers-reduced-motion: reduce)`).matches}catch{return!1}},ko=()=>{let e=document.querySelector(`.speed-dial-root`)||document.getElementById(`home`);if(!e)return[];let t=[...e.querySelectorAll(`.speed-dial-grid`)];return t.length?t:[e]},Ao=e=>{let t=e||(typeof document<`u`?document:null);t?.querySelectorAll&&(t.querySelectorAll(`.speed-dial-grid--turn-ghost`).forEach(e=>e.remove()),t.querySelectorAll(`[data-ws-turning]`).forEach(e=>{delete e.dataset.wsTurning,e.querySelectorAll(`.speed-dial-grid`).forEach(e=>{e.style.opacity=``})}))},jo=e=>{let t=ko(),n=t[0]?.closest(`.speed-dial-root`)||t[0]||null;if(Ao(n),!t.length||Oo()||typeof t[0].animate!=`function`)return()=>void 0;let r=e<0?-1:1,i=`${-88*r}deg`,a=`${88*r}deg`,o=`${-18*r}%`,s=`${18*r}%`,c=n||t[0];c.dataset.wsTurning=r>0?`next`:`prev`;let l=[];for(let e of t){let t=e.cloneNode(!0);t.classList.add(`speed-dial-grid--turn-ghost`),t.dataset.wsGhost=`1`,t.setAttribute(`aria-hidden`,`true`),e.parentElement?.insertBefore(t,e.nextSibling),e.style.opacity=`0`,l.push(t),t.animate([{transform:`translateX(0) rotateY(0deg)`,opacity:1},{transform:`translateX(${o}) rotateY(${i})`,opacity:0}],{duration:180,easing:`cubic-bezier(.4, 0, .2, 1)`,fill:`forwards`})}let u=()=>{for(let e of t)e.style.opacity=``;for(let e of l)e.remove();delete c.dataset.wsTurning};return()=>{let e=t.map(e=>e.animate([{transform:`translateX(${s}) rotateY(${a})`,opacity:.2},{transform:`translateX(0) rotateY(0deg)`,opacity:1}],{duration:220,easing:`cubic-bezier(.22, 1, .36, 1)`,fill:`none`})),n=Promise.all(e.map(e=>e.finished.catch(()=>void 0))),r=new Promise(e=>{setTimeout(e,500)});Promise.race([n,r]).then(u)}},Mo=e=>{let t=bo(),n=t.pages.find(t=>t.id===e);if(!n)return!1;let r=t.activeId||t.pages[0].id;if(r===n.id)return!0;let i=Math.max(0,t.pages.findIndex(e=>e.id===r)),a=Math.max(0,t.pages.findIndex(e=>e.id===n.id))-i;Math.abs(a)>t.pages.length/2&&(a+=a>0?-t.pages.length:t.pages.length),t.snapshots[r]=xo(ke()),t.activeId=n.id,So(t),fo();let o=jo(a);return Be(t.snapshots[n.id]||{items:[]}),requestAnimationFrame(()=>{o(),requestAnimationFrame(()=>uo())}),Do(n),Co(n.id),!0}})))()}var Po,Fo,Io,Lo,Ro,zo,Bo,Vo,Ho;function Uo(){return(Uo=e((()=>{Po=`cwsp:explorer-sort-change`,Fo=`cwsp-explorer-sort`,Io=[[`name`,`Name`],[`date`,`Date modified`],[`type`,`Type`],[`size`,`Size`],[`kind`,`Kind (file / folder)`]],Lo=new Set(Io.map(([e])=>e)),Ro=(e,t=`name`)=>{let n=String(e||``).trim().toLowerCase();return n===`modified`||n===`mtime`||n===`updated`?`date`:n===`mime`||n===`ext`||n===`extension`?`type`:n===`bytes`||n===`length`?`size`:n===`folder`||n===`folders`?`kind`:Lo.has(n)?n:t},zo=(e,t=`asc`)=>{let n=String(e||``).trim().toLowerCase();return n===`desc`||n===`descending`||n===`newest`||n===`z-a`?`desc`:n===`asc`||n===`ascending`||n===`oldest`||n===`a-z`?`asc`:t},Bo=e=>e===`date`||e===`size`?`desc`:`asc`,Vo=()=>{try{let e=localStorage.getItem(Fo);if(e){let t=JSON.parse(e),n=Ro(t.sortBy);return{sortBy:n,sortDir:zo(t.sortDir,Bo(n)),foldersFirst:t.foldersFirst!==!1}}}catch{}return{sortBy:`name`,sortDir:`asc`,foldersFirst:!0}},Ho=e=>{let t=Vo(),n=e.sortBy==null?t.sortBy:Ro(e.sortBy,t.sortBy),r={sortBy:n,sortDir:e.sortDir==null?t.sortDir:zo(e.sortDir,Bo(n)),foldersFirst:e.foldersFirst==null?t.foldersFirst:!!e.foldersFirst};try{localStorage.setItem(Fo,JSON.stringify(r))}catch{}try{window.dispatchEvent(new CustomEvent(Po,{detail:r}))}catch{}return r}})))()}var Wo;function Go(){return(Go=e((()=>{Wo=`/*
 * Filename: ExplorerSettings.scss
 * FullPath: modules/projects/fl.ui/src/ui/explorer/ExplorerSettings.scss
 * Change date and time: 09.05.00_30.08.2026
 * Reason: Match settings-view / Veela tokens — no hard-coded Material grey cards.
 */
:host {
  display: block;
  grid-row: 2;
  grid-column: 1/-1;
  z-index: 4;
  min-inline-size: 0;
  min-block-size: 0;
  overflow: auto;
  box-sizing: border-box;
  color-scheme: inherit;
  background: var(--color-surface, light-dark(#f4f6f8, #141218));
  color: var(--color-on-surface, light-dark(#1c1b1f, #e6e1e5));
}

:host-context(html[data-theme=light]),
:host([data-theme=light]) {
  color-scheme: light only;
}

:host-context(html[data-theme=dark]),
:host([data-theme=dark]) {
  color-scheme: dark only;
}

:host([hidden]) {
  display: none !important;
}

.explorer-settings {
  --es-bg: var(--color-surface, light-dark(#f4f6f8, #141218));
  --es-fg: var(--color-on-surface, light-dark(#1c1b1f, #e6e1e5));
  --es-muted: var(--color-on-surface-variant, light-dark(#5c6570, #a8b0bc));
  --es-outline: var(--color-outline-variant, light-dark(#c5cdd8, #3d4755));
  --es-surface-1: var(--color-surface-container-low, light-dark(#ffffff, #1c232d));
  --es-surface-2: var(--color-surface-container, light-dark(#f4f6f8, #171c24));
  --es-primary: var(--color-primary, #5a9ec8);
  --es-on-primary: var(--color-on-primary, #fff);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  padding: 0.75rem 0.85rem 1.25rem;
  min-block-size: 100%;
  color: var(--es-fg);
  font: 500 0.875rem/1.35 system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
}

.explorer-settings *,
.explorer-settings *::before,
.explorer-settings *::after {
  box-sizing: border-box;
}

.explorer-settings__head h2 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 700;
  letter-spacing: -0.02em;
}

.explorer-settings__hint,
.explorer-settings__card p {
  margin: 0;
  font-size: 0.8125rem;
  line-height: 1.45;
  color: var(--es-muted);
}

.explorer-settings__card {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1rem;
  border-radius: var(--card-radius, var(--radius-xl, 1rem));
  background: var(--es-surface-2);
}

.explorer-settings__card[hidden] {
  display: none !important;
}

.explorer-settings__title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0;
  font-size: 0.95rem;
  font-weight: 600;
}

.explorer-settings__title ui-icon {
  --ui-icon-size: 1.25rem;
  --ui-icon-padding: 0px;
  color: var(--es-primary);
  flex-shrink: 0;
}

.explorer-settings__field {
  display: grid;
  gap: 0.35rem;
  margin: 0;
}

.explorer-settings__field > span {
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--es-muted);
}

.explorer-settings__field select {
  display: block;
  inline-size: 100%;
  min-block-size: 2.5rem;
  padding: 0.5rem 2rem 0.5rem 0.75rem;
  border: none;
  border-radius: var(--input-radius, var(--radius-md, 0.5rem));
  background-color: var(--es-surface-1);
  color: var(--es-fg);
  font: inherit;
  appearance: none;
  background-image: linear-gradient(45deg, transparent 50%, var(--es-muted) 50%), linear-gradient(135deg, var(--es-muted) 50%, transparent 50%);
  background-position: calc(100% - 1.1rem) 50%, calc(100% - 0.75rem) 50%;
  background-size: 0.35rem 0.35rem, 0.35rem 0.35rem;
  background-repeat: no-repeat;
}

.explorer-settings__field select:focus-visible {
  outline: 2px solid color-mix(in oklab, var(--es-primary) 55%, transparent);
  outline-offset: 1px;
}

.explorer-settings__check {
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: center;
  gap: 0.625rem;
  min-block-size: var(--touch-min, 2.75rem);
  font-size: 0.875rem;
}

.explorer-settings__check input[type=checkbox] {
  inline-size: 1.15rem;
  block-size: 1.15rem;
  accent-color: var(--es-primary);
}

.explorer-settings__status {
  margin: 0;
  padding: 0.65rem 0.75rem;
  border-radius: var(--input-radius, var(--radius-md, 0.5rem));
  background: var(--es-surface-1);
  color: var(--es-muted);
  white-space: pre-wrap;
  font: inherit;
  font-size: 0.8125rem;
  line-height: 1.45;
}

.explorer-settings__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.explorer-settings .btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  padding: 0.5rem 1.125rem;
  min-block-size: var(--touch-min, 2.5rem);
  border: none;
  border-radius: var(--radius-full, 999px);
  background: var(--es-surface-1);
  color: var(--es-fg);
  font: 500 0.8125rem/1.2 inherit;
  cursor: pointer;
}

.explorer-settings .btn:hover:not(:disabled) {
  background: color-mix(in oklab, var(--es-fg) 8%, var(--es-surface-1));
}

.explorer-settings .btn:focus-visible {
  outline: 2px solid color-mix(in oklab, var(--es-primary) 55%, transparent);
  outline-offset: 1px;
}

.explorer-settings .btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.explorer-settings .btn--primary {
  background: var(--es-primary);
  color: var(--es-on-primary);
}

.explorer-settings__mounts {
  display: grid;
  gap: 0.45rem;
}

.explorer-settings__mounts:empty::before,
.explorer-settings__mounts[data-empty="1"] {
  color: var(--es-muted);
  font-size: 0.8125rem;
}

.explorer-settings__mount {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.45rem 0.7rem;
  padding: 0.55rem 0.7rem;
  border-radius: var(--radius-lg, 0.75rem);
  background: var(--es-surface-1);
}

.explorer-settings__mount code {
  opacity: 0.7;
  font-size: 0.78rem;
}`})))()}var Ko,qo,Jo,Yo,Xo;function Zo(){return(Zo=e((()=>{T(),Fe(),r(),l(),V(),_e(),Uo(),le(),Go();try{f(Wo)}catch{}Ko=e=>{let t=e.querySelector(`[data-explorer-mounts]`);if(!t)return;let n=ve();if(t.replaceChildren(),!n.length){t.dataset.empty=`1`,t.textContent=`No mounted folders yet.`;return}t.dataset.empty=`0`;for(let r of n){let n=document.createElement(`div`);n.className=`explorer-settings__mount`,n.innerHTML=`<span>${r.label}</span><code>${r.path}</code>`;let i=document.createElement(`button`);i.className=`btn`,i.type=`button`,i.textContent=`Unmount`,i.addEventListener(`click`,()=>{ye(r.id),Ko(e),window.dispatchEvent(new CustomEvent(`cwsp:explorer-mount-change`))}),n.append(i),t.append(n)}},qo=e=>{let t=Vo(),n=e.querySelector(`[data-explorer-sort-by]`),r=e.querySelector(`[data-explorer-sort-dir]`),i=e.querySelector(`[data-explorer-folders-first]`);n&&(n.value=t.sortBy),r&&(r.value=t.sortDir),i&&(i.checked=t.foldersFirst)},Jo=(e,t,n=``)=>{let r=e.querySelector(`[data-explorer-status]`);r&&(r.textContent=[`All-files (/sdcard/): ${t?.allFilesAccess?`granted`:`not granted`}`,t?.note?t.note:``,n].filter(Boolean).join(`
`))},Yo=class extends B{styles=()=>Wo;onInitialize(){let e=super.onInitialize();return queueMicrotask(()=>{qo(this),Ko(this),ce()?L().then(e=>Jo(this,e)):Jo(this,null,`Browser / PWA: use Mount folder (showDirectoryPicker).`)}),e??this}render=function(){let e=this,t=ce(),n=de();return v`<div class="explorer-settings" part="root">
            <header class="explorer-settings__head">
                <h2>Explorer</h2>
                <p class="explorer-settings__hint">Sort this list and how Android or the browser reach files.</p>
            </header>
            <section class="explorer-settings__card">
                <h3 class="explorer-settings__title">
                    <ui-icon icon="sort-ascending" icon-style="duotone" size="20"></ui-icon>
                    List sort
                </h3>
                <p>Name, date, type, size, or kind. Folders can stay on top.</p>
                <label class="explorer-settings__field">
                    <span>Sort by</span>
                    <select data-explorer-sort-by on:change=${e=>{let t=e.currentTarget.value;Ho({sortBy:t})}}>
                        <option value="name">Name</option>
                        <option value="date">Date modified</option>
                        <option value="type">Type</option>
                        <option value="size">Size</option>
                        <option value="kind">Kind (file / folder)</option>
                    </select>
                </label>
                <label class="explorer-settings__field">
                    <span>Order</span>
                    <select data-explorer-sort-dir on:change=${e=>{Ho({sortDir:e.currentTarget.value===`desc`?`desc`:`asc`})}}>
                        <option value="asc">Ascending</option>
                        <option value="desc">Descending</option>
                    </select>
                </label>
                <label class="explorer-settings__check">
                    <input type="checkbox" data-explorer-folders-first on:change=${e=>{Ho({foldersFirst:e.currentTarget.checked})}} />
                    <span>Folders first</span>
                </label>
            </section>
            <section class="explorer-settings__card" hidden=${!t}>
                <h3 class="explorer-settings__title">
                    <ui-icon icon="hard-drives" icon-style="duotone" size="20"></ui-icon>
                    Android storage
                </h3>
                <p>All-files is <code>/sdcard/</code>. A picked tree is <code>/saf/</code> in this Explorer only.</p>
                <p data-explorer-status class="explorer-settings__status">Checking…</p>
                <div class="explorer-settings__actions">
                    <button class="btn btn--primary" type="button" disabled=${!t} on:click=${()=>{fe().then(()=>L().then(t=>Jo(e,t,`Opened system all-files settings.`)))}}>Allow all files</button>
                    <button class="btn" type="button" disabled=${!t} on:click=${()=>{ue().then(t=>{Jo(e,null,t?`SAF tree: ${t}`:`SAF pick cancelled.`),window.dispatchEvent(new CustomEvent(`cwsp:explorer-mount-change`))})}}>Pick SAF folder</button>
                </div>
            </section>
            <section class="explorer-settings__card">
                <h3 class="explorer-settings__title">
                    <ui-icon icon="hard-drives" icon-style="duotone" size="20"></ui-icon>
                    Origin storage
                </h3>
                <p>OPFS is <code>/user/</code> when available. IndexedDB is <code>/idb/</code> beside it, or <code>/user/</code> if OPFS is off.</p>
                <label class="explorer-settings__check">
                    <input type="checkbox" data-explorer-opfs-enabled checked=${re()} disabled=${!A()} on:change=${e=>{j(e.currentTarget.checked),ne(),xe(`/user/`),xe(`/idb/`),pe(),window.dispatchEvent(new CustomEvent(`cwsp:explorer-mount-change`))}} />
                    <span>Use OPFS for <code>/user/</code></span>
                </label>
            </section>
            <section class="explorer-settings__card" hidden=${t||!n}>
                <h3 class="explorer-settings__title">
                    <ui-icon icon="folder-plus" icon-style="duotone" size="20"></ui-icon>
                    Browser mounts
                </h3>
                <p>Chromium <code>showDirectoryPicker</code>. Handles stay in this session beside <code>/user/</code>.</p>
                <div class="explorer-settings__actions">
                    <button class="btn" type="button" disabled=${!n} on:click=${()=>{R().then(t=>{t&&(Ce(t),Ko(e),window.dispatchEvent(new CustomEvent(`cwsp:explorer-mount-change`)))})}}>Mount folder</button>
                </div>
                <div data-explorer-mounts class="explorer-settings__mounts"></div>
            </section>
        </div>`}},Yo=z([x(`ui-explorer-settings`)],Yo),Xo=()=>{document.querySelectorAll(`ui-file-manager`).forEach(e=>{let t=e.shadowRoot?.querySelector(`.fm-root`);t?.classList.remove(`fm-root--settings`),t?.querySelector(`ui-explorer-settings`)?.remove()}),document.querySelector(`ui-explorer-settings`)?.remove()},s(window,`keydown`,e=>{e.key===`Escape`&&Xo()})})))()}var Qo,$o,es,ts,ns,rs,is;function as(){return(as=e((()=>{T(),fi(),Zo(),Qo=()=>document.querySelector(`ui-file-manager`),$o=()=>Qo()?.shadowRoot?.querySelector(`ui-explorer-settings`)??document.querySelector(`ui-explorer-settings`),es=()=>y()&&b()?!0:document.querySelector(`.cw-context-menu, .cw-context-menu-layer`)?(ui(),!0):$o()?(Xo(),!0):!1,ts=()=>{let e=globalThis;e.__CWSP_NATIVE_BACK__={handleBackPress:es};let t=e.__CWSP_LAUNCHER_HOME__?.handleBackPress;e.__CWSP_LAUNCHER_HOME__={...e.__CWSP_LAUNCHER_HOME__||{},handleBackPress:()=>es()||typeof t==`function`&&t()}},ns=()=>{let e=globalThis;if(e.__CWSP_CAP_BACK_BOUND__)return;let t=e.Capacitor?.Plugins?.App;if(typeof t?.addListener==`function`){e.__CWSP_CAP_BACK_BOUND__=!0;try{t.addListener(`backButton`,()=>{es()})}catch(e){console.warn(`[overlay-back] Capacitor backButton bind failed`,e)}}},rs=()=>{D({id:`app-menu-overlay`,priority:S.SIDEBAR,isActive:()=>!!document.querySelector(`.env-shell-app-menu[data-open]`),close:()=>(document.querySelector(`.env-shell-app-menu`)?.dispatchEvent(new CustomEvent(`env-app-menu-request-close`,{bubbles:!0})),!0)}),D({id:`speed-dial-editor`,priority:S.MODAL,isActive:()=>!!document.querySelector(`dialog.speed-dial-editor[open], dialog.sd-icon-picker[open]`),close:()=>(document.querySelectorAll(`dialog.speed-dial-editor[open], dialog.sd-icon-picker[open]`).forEach(e=>{try{e.close()}catch{e.remove()}}),!0)})},is=()=>{let e=globalThis;if(e.__CWSP_LAUNCHER_BACK_STACK__){ns(),ts();return}e.__CWSP_LAUNCHER_BACK_STACK__=!0;try{m({preventDefaultNavigation:!0,pushInitialState:!1})}catch{}rs(),ns(),ts()}})))()}var os;function ss(){return(ss=e((()=>{os=`/*
 * Filename: TaskBar.scss
 * FullPath: modules/projects/fl.ui/src/ui/navigation/taskbar/scss/TaskBar.scss
 * Change date and time: 23.09.10_23.08.2026
 * Reason for changes: Mobile dock is pointer-transparent except Home FAB (apps go full-bleed).
 * FIND:mobile-dock
 */
/* Taskbar / env chrome (document + host). Former environment-shell/scss/chrome.scss. */
@layer components {
  /* Fixed chrome: taskbar (desktop + mobile dock) + FL-UI \`ui-statusbar\` (desktop meta). */
  /* WHY: \`--env-z-shell-chrome\` is set in environment-shell \`scss/root.scss\` ($z-shell-chrome). */
  ui-taskbar {
    padding: 0px 0px 0px 0px !important;
    gap: 0px 0px !important;
  }
  ui-taskbar::part(taskbar) {
    padding: 0px 0px 0px 0px !important;
    gap: 0px 0px !important;
    display: grid !important;
    grid-template-columns: minmax(0, max-content) minmax(0, 1fr) minmax(0, max-content);
  }
  ui-taskbar ui-task {
    margin: 0px 0px 0px 0px !important;
  }
  .env-shell-chrome {
    position: fixed;
    inset-inline: 0;
    inset-block-end: 0;
    z-index: var(--env-z-shell-chrome, 2147483000);
    isolation: isolate;
    display: flex;
    flex-direction: column;
    gap: 0px !important;
    padding: 0px 0px 0px 0px !important;
    font: 12px ui-sans-serif, system-ui, sans-serif;
    /* WHY: contrast-color(dark variant) painted white glyphs on the light dock. */
    color: var(--color-on-surface, var(--wf-md-on-surface-variant, #1c1c1e));
    pointer-events: none;
  }
  /* WHY: lure \`env-shell-taskbar-under\` was a 40px fixed bbox + inline z-index:0 slab. */
  .env-shell-chrome[data-desktop] {
    box-shadow: 0 -8px 28px rgba(0, 0, 0, 0.28);
  }
  .env-shell-chrome > * {
    pointer-events: auto;
  }
  /*
  * Taskbar base (desktop Win10 acrylic + mobile transparent dock share the same host).
  * Soft elevation lives on \`.env-shell-chrome\` — not on this backdrop-filter host.
  */
  .env-shell-taskbar {
    /* WHY: #f4f4f5/#1c1c1e forked a slate dock from Settings \`--sv-*\` / \`--base-color\`. */
    --env-taskbar-surface: color-mix(
        in oklab,
        var(--color-surface-container-high, --u2-color-mod(var(--base-color, #5a9ec8), 980)) 88%,
        transparent
    );
    --env-taskbar-ink: var(
        --color-on-surface,
        light-dark(
            --u2-color-mod(var(--base-color, #5a9ec8), 900),
            --u2-color-mod(var(--base-color, #5a9ec8), 100)
        )
    );
    --env-taskbar-accent: var(--wf-md-primary, var(--color-primary, #5a9ec8));
    --icon-color: var(--env-taskbar-ink);
    color-scheme: inherit;
    order: 0;
    position: relative;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: stretch;
    gap: 0.15rem;
    block-size: 2.5rem;
    min-block-size: 2.5rem;
    padding: 0 0.25rem;
    padding-block-end: env(safe-area-inset-bottom, 0);
    background: var(--env-taskbar-surface);
    border-block-start: 1px solid light-dark(color-mix(in oklab, #000 10%, transparent), color-mix(in oklab, #fff 14%, transparent));
    backdrop-filter: blur(22px) saturate(1.35);
    -webkit-backdrop-filter: blur(22px) saturate(1.35);
    color: var(--env-taskbar-ink);
    box-shadow: none;
  }
  .env-shell-taskbar ui-icon {
    color: var(--env-taskbar-ink);
    --icon-color: var(--env-taskbar-ink);
  }
  .env-shell-taskbar::part(taskbar) {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: stretch;
    gap: 0.15rem;
    flex: 1;
    min-inline-size: 0;
    inline-size: 100%;
  }
  .env-shell-taskbar__pins,
  .env-shell-taskbar__windows {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: stretch;
    gap: 0px 0px;
    min-inline-size: 0;
    margin: 0px 0px 0px 0px;
  }
  .env-shell-taskbar__workspaces {
    display: none;
    flex-direction: row;
    align-items: center;
    gap: 0.25rem;
    margin-inline-start: 0.35rem;
  }
  .env-shell-taskbar__workspace {
    min-inline-size: 1.35rem;
    min-block-size: 1.35rem;
    padding: 0 0.35rem;
    border: none;
    border-radius: 0.35rem;
    background: color-mix(in oklab, CanvasText 10%, transparent);
    color: inherit;
    font: inherit;
    font-size: 0.7rem;
    cursor: pointer;
  }
  .env-shell-taskbar__workspace[data-active] {
    background: color-mix(in oklab, CanvasText 22%, transparent);
    font-weight: 650;
  }
  .env-shell-chrome[data-desktop] .env-shell-taskbar__workspaces {
    display: flex;
  }
  .env-shell-taskbar__pins {
    flex: 0 0 auto;
    content-visibility: visible;
    inline-size: stretch;
    gap: 0px 0px;
    margin: 0px 0px 0px 0px;
  }
  .env-shell-taskbar__pins [data-env-home] {
    content-visibility: visible;
    color: inherit;
    --icon-color: currentColor;
    background: color-mix(in oklab, var(--env-taskbar-surface) 60%, transparent) !important;
    background-color: color-mix(in oklab, var(--env-taskbar-surface) 60%, transparent) !important;
  }
  .env-shell-taskbar__pins ui-task {
    backdrop-filter: blur(22px) saturate(1.35);
    -webkit-backdrop-filter: blur(22px) saturate(1.35);
    box-shadow: inset 0 -2px 0 var(--env-taskbar-accent);
  }
  .env-shell-taskbar__pins ui-task::part(icon), .env-shell-taskbar__pins ui-task::part(glyph) {
    color: var(--env-taskbar-ink);
    --icon-color: var(--env-taskbar-ink);
  }
  .env-shell-taskbar__windows {
    flex: 1 1 auto;
    justify-content: flex-start;
    overflow-x: auto;
    scrollbar-width: thin;
    inline-size: stretch;
  }
  .env-shell-taskbar ui-task {
    cursor: pointer;
    color: inherit;
    align-self: stretch;
    inline-size: fit-content;
    min-inline-size: 2.75rem;
    min-block-size: 100%;
    padding-inline: 0.55rem;
    border: 0;
    border-radius: 0;
    background: transparent;
    outline: none;
    opacity: 1;
    /* Active underline via inset shadow so we don't fight ui-task border tokens. */
    box-shadow: inset 0 -2px 0 transparent;
  }
  .env-shell-taskbar ui-task:hover {
    background: color-mix(in oklab, var(--env-taskbar-ink) 10%, transparent);
    color: var(--env-taskbar-ink);
    opacity: 1;
  }
  .env-shell-taskbar ui-task[data-env-active=true],
  .env-shell-taskbar ui-task[data-active],
  .env-shell-taskbar ui-task[data-focus] {
    outline: none;
    color: var(--env-taskbar-ink);
    opacity: 1;
    background: color-mix(in oklab, var(--env-taskbar-surface) 12%, transparent);
    box-shadow: inset 0 -2px 0 var(--env-taskbar-accent);
  }
  .env-shell-taskbar ui-task[data-minimized] {
    opacity: 0.65;
  }
  .env-shell-taskbar__tray-host {
    margin-inline-start: auto;
    display: flex;
    align-items: center;
    flex: 0 0 auto;
    gap: 0.35rem;
    padding-inline: 0.35rem;
    border-inline-start: 1px solid light-dark(color-mix(in oklab, #000 10%, transparent), color-mix(in oklab, #fff 12%, transparent));
  }
  .env-shell-taskbar__clock {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: center;
    gap: 0.05rem;
    min-inline-size: 4rem;
    inline-size: fit-content;
    padding-inline: 0.35rem 0.15rem;
    line-height: 1.05;
    user-select: none;
    pointer-events: auto;
    cursor: pointer;
    border-radius: 0.35rem;
    font-variant-numeric: tabular-nums;
  }
  .env-shell-taskbar__clock .env-shell-taskbar__clock-date {
    font-variant-numeric: tabular-nums;
  }
  .env-shell-taskbar__clock .env-shell-taskbar__clock-time {
    font-variant-numeric: tabular-nums;
  }
  .env-shell-taskbar__clock:hover,
  .env-shell-taskbar__clock:focus-visible {
    background: color-mix(in oklab, var(--env-taskbar-ink) 10%, transparent);
    color: var(--env-taskbar-ink);
    outline: none;
  }
  .env-device-tray--taskbar {
    pointer-events: auto;
    cursor: pointer;
    border-radius: 0.35rem;
  }
  .env-device-tray--taskbar:hover,
  .env-device-tray--taskbar:focus-visible {
    background: color-mix(in oklab, var(--env-taskbar-ink) 10%, transparent);
    color: var(--env-taskbar-ink);
    outline: none;
  }
  .env-shell-taskbar__clock-time {
    font-size: 0.78rem;
    font-weight: 600;
    font-variant-numeric: tabular-nums;
    color: inherit;
  }
  .env-shell-taskbar__clock-date {
    font-size: 0.62rem;
    font-weight: 500;
    color: color-mix(in oklab, currentColor 72%, transparent);
    white-space: nowrap;
    font-variant-numeric: tabular-nums;
  }
  /* Desktop: icon-only tasks (tooltip via title / aria-label). */
  .env-shell-chrome[data-desktop] .env-shell-taskbar ui-task::part(title) {
    display: none !important;
  }
  .env-shell-chrome[data-desktop] .env-shell-taskbar ui-task {
    min-inline-size: 2.5rem;
    padding-inline: 0.45rem;
  }
  .env-shell-chrome[data-desktop] .env-shell-taskbar ui-task::part(icon) {
    inline-size: 1.35rem;
    block-size: 1.35rem;
  }
  .env-shell-chrome[data-desktop] .env-shell-taskbar ui-task::part(glyph) {
    inline-size: 1.35rem;
    block-size: 1.35rem;
  }
  .env-shell-chrome[data-desktop] .env-shell-taskbar ui-task[data-env-home]::part(icon) {
    inline-size: 1.75rem;
    block-size: 1.75rem;
    min-inline-size: 1.75rem;
    min-block-size: 1.75rem;
  }
  .env-shell-chrome[data-desktop] .env-shell-taskbar ui-task[data-env-home]::part(glyph) {
    inline-size: 100%;
    block-size: 100%;
    --icon-size: 100%;
    --icon-padding: 0.05rem;
  }
  .env-shell-chrome[data-desktop] .env-shell-taskbar ui-task::part(letter) {
    font-size: 0.8rem;
  }
  .env-shell-chrome[data-desktop] .env-shell-taskbar__pins {
    border: none 0px transparent;
    outline: none 0px transparent;
    padding: 0px 0px 0px 0px;
    margin: 0px 0px 0px 0px;
    background: transparent;
    background-color: transparent;
    box-shadow: none 0px 0px 0px transparent;
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
    min-inline-size: 2.75rem;
    margin-inline-end: 0.2rem;
    border-radius: 0px;
  }
  /* Desktop Start — same action as a mobile Home tap (go home / show desktop). */
  .env-shell-chrome[data-desktop] .env-shell-taskbar ui-task[data-env-home] {
    display: inline-flex !important;
    transform: none;
    outline: none;
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
    min-inline-size: 2.75rem;
    margin-inline-end: 0.2rem;
    border-radius: 0px;
    border: none 0px transparent;
    outline: none 0px transparent;
    box-shadow: none 0px 0px 0px transparent;
    /*
    background: color-mix(in oklab, var(--env-taskbar-accent) 18%, transparent);
    color: var(--env-taskbar-ink);
    --icon-color: currentColor;
    */
  }
  .env-shell-chrome[data-desktop] .env-shell-taskbar ui-task[data-env-home]:hover,
  .env-shell-chrome[data-desktop] .env-shell-taskbar ui-task[data-env-home]:focus-visible {
    background: color-mix(in oklab, var(--env-taskbar-accent) 32%, transparent);
  }
  .env-shell-chrome[data-desktop] .env-shell-taskbar ui-task[data-env-home][data-env-active=true],
  .env-shell-chrome[data-desktop] .env-shell-taskbar ui-task[data-env-home][data-active],
  .env-shell-chrome[data-desktop] .env-shell-taskbar ui-task[data-env-home][data-focus] {
    background: color-mix(in oklab, var(--env-taskbar-accent) 28%, transparent);
  }
  /*
  * Mobile nav bar: fully transparent; house icon at the physical right
  * so workspace pager dots stay visible in the center.
  * WHY: \`ui-taskbar::part(taskbar)\` is a 3-col grid (pins | windows | tray);
  * \`justify-content\` on the host cannot move the slotted Home pin.
  * Long-press Home → \`.env-shell-navbar__switcher\` (open processes).
  */
  .env-shell-chrome:not([data-desktop]) .env-shell-taskbar {
    position: relative;
    display: block;
    place-self: stretch;
    inline-size: 100%;
    gap: 0;
    block-size: 3rem;
    min-block-size: 3rem;
    padding: 0.15rem 0.75rem;
    /* WHY: 3-button nav is already OS-reserved; extra safe-area made a second dock slab. */
    padding-block-end: 0.15rem;
    background: transparent;
    border-block-start: none;
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
    box-shadow: none;
    color: var(--env-status-fg, var(--env-taskbar-ink));
    --icon-color: currentColor;
    /* WHY: chrome z-index sits above apps; a full-width hit slab ate Save / explorer rows. */
    pointer-events: none;
  }
  .env-shell-chrome:not([data-desktop]) .env-shell-taskbar::part(taskbar) {
    display: block !important;
    grid-template-columns: none !important;
    position: relative;
    inline-size: 100%;
    block-size: 100%;
  }
  .env-shell-chrome:not([data-desktop]) .env-shell-taskbar__pins {
    display: contents;
  }
  .env-shell-chrome:not([data-desktop]) .env-shell-taskbar__pins ui-task:not([data-env-home]) {
    display: none !important;
  }
  .env-shell-chrome:not([data-desktop]) .env-shell-taskbar__windows {
    display: none !important;
  }
  .env-shell-chrome:not([data-desktop]) .env-shell-taskbar__tray-host {
    display: none !important;
  }
  .env-shell-chrome:not([data-desktop]) .env-shell-taskbar ui-task[data-env-home] {
    position: absolute;
    top: auto;
    left: auto;
    right: calc(0.7rem + env(safe-area-inset-right, 0px));
    bottom: 0.22rem;
    min-inline-size: 2.5rem;
    min-block-size: 2.5rem;
    padding: 0;
    margin: 0;
    border-radius: 999px;
    z-index: 6;
    pointer-events: auto;
    background: color-mix(in oklab, var(--color-surface-container-high, --u2-color-mod(var(--base-color, #5a9ec8), 980)) 88%, transparent);
    box-shadow: 0 6px 20px -8px color-mix(in oklab, #000 45%, transparent);
    touch-action: manipulation;
    -webkit-user-select: none;
    user-select: none;
  }
  /* Icon-only Home (hide task title label). */
  .env-shell-chrome:not([data-desktop]) .env-shell-taskbar ui-task[data-env-home]::part(title) {
    display: none !important;
  }
  .env-shell-chrome:not([data-desktop]) .env-shell-taskbar ui-task[data-env-home]::part(icon) {
    inline-size: 1.7rem;
    block-size: 1.7rem;
    min-inline-size: 1.7rem;
    min-block-size: 1.7rem;
  }
  /* Prefer Phosphor glyph; letter fallback is last resort (was wrongly showing "U"). */
  .env-shell-chrome:not([data-desktop]) .env-shell-taskbar ui-task[data-env-home]::part(glyph) {
    inline-size: 100%;
    block-size: 100%;
    --icon-padding: 0.1rem;
    --icon-size: 100%;
    opacity: 1;
  }
  .env-shell-chrome:not([data-desktop]) .env-shell-taskbar ui-task[data-env-home]::part(letter) {
    opacity: 0;
  }
  .env-shell-chrome:not([data-desktop]) .env-shell-taskbar ui-task[data-env-home]:hover,
  .env-shell-chrome:not([data-desktop]) .env-shell-taskbar ui-task[data-env-home]:active {
    background: color-mix(in oklch, #fff 10%, transparent);
    color: contrast-color(inherit(background-color));
  }
  .env-shell-chrome:not([data-desktop]) .env-shell-taskbar ui-task[data-env-home][data-env-active=true],
  .env-shell-chrome:not([data-desktop]) .env-shell-taskbar ui-task[data-env-home][data-active],
  .env-shell-chrome:not([data-desktop]) .env-shell-taskbar ui-task[data-env-home][data-focus] {
    background: color-mix(in oklch, #fff 8%, transparent);
    color: contrast-color(inherit(background-color));
    /*box-shadow: inset 0 -2px 0 #60cdff;*/
  }
  /*
   * Mobile footer statusbar is replaced by the fixed overlay band when
   * \`[data-status-overlay]\` is set (see statusbar.scss). Without overlay
   * (standalone), hide the footer copy entirely.
   */
  .env-shell-chrome:not([data-desktop]):not([data-status-overlay]) .env-ui-statusbar {
    display: none !important;
  }
}`})))()}function cs(e){return`${_s}${String(e||``).trim().toLowerCase()}`}function ls(){let e=document.querySelector(`.env-shell-chrome`);return e instanceof HTMLElement&&e.hasAttribute(`data-desktop`)?!1:e instanceof HTMLElement&&e.dataset.chromeLayout===`mobile`||typeof matchMedia==`function`&&matchMedia(`(max-width: 640px)`).matches}function us(e,t){if(e.some(e=>{let t=String(e.id||``).trim().toLowerCase();return!t||t===`home`?!1:e.visible!==!1&&!e.minimized}))return!0;let n=String(t.value||`home`).trim().toLowerCase();if(n&&n!==`home`&&n!==`viewer`)return!0;let r=document.querySelector(`.env-shell-workspace`);if(!r)return!1;for(let e of r.querySelectorAll(`ui-window`)){if(!(e instanceof HTMLElement)||e.hidden||e.hasAttribute(`data-minimized`))continue;let t=getComputedStyle(e);if(t.display!==`none`&&t.visibility!==`hidden`&&!(Number.parseFloat(t.opacity||`1`)<=0))return!0}return!1}function ds(e=new Date){return Sn(e)}function fs(e){let t=ie([]);h(t),C(hs,t,{title:`Home`,icon:`house-line`},{},function(){for(let e of t)e!==this&&(e.active=!1);this.active=!0,e.focusedTaskId.value=`home`,e.onHome()}),C(gs,t,{title:`Markdown`,icon:`article`},{},function(){for(let e of t)e!==this&&(e.active=!1);this.active=!0,e.focusedTaskId.value=`viewer`,e.onViewer()});let n=document.createElement(`ui-taskbar`);n.className=`env-shell-taskbar wf-chrome-no-select`,n.setAttribute(`part`,`taskbar`),n.setAttribute(`data-type`,`desktop`);let r=document.createElement(`div`);r.className=`env-shell-taskbar__pins`;let i=document.createElement(`div`);i.className=`env-shell-taskbar__windows`;let a=document.createElement(`ui-task`);a.setAttribute(`title`,`Home`),a.setAttribute(`icon`,`house-line`),a.setAttribute(`data-id`,hs),a.setAttribute(`data-env-home`,``),a.setAttribute(`aria-label`,`Home`),a.setAttribute(`aria-haspopup`,`menu`),r.append(a);let o=document.createElement(`div`);o.className=`env-shell-taskbar__workspaces`,o.setAttribute(`aria-label`,`Workspaces`);let s=()=>{let e=wo(),t=To();o.replaceChildren();for(let n of e){let e=document.createElement(`button`);e.type=`button`,e.className=`env-shell-taskbar__workspace`,e.title=n.label,e.textContent=n.label.replace(/^Side\s+/i,``)||n.id.slice(-1).toUpperCase(),e.toggleAttribute(`data-active`,n.id===t),e.addEventListener(`click`,e=>{e.preventDefault(),e.stopPropagation(),Mo(n.id)}),o.append(e)}};s(),window.addEventListener(ho,s),r.append(o),is();let c=()=>{let e=ls();a.setAttribute(`title`,e?`Home`:`Start`),a.setAttribute(`aria-label`,e?`Home`:`Start`),a.setAttribute(`icon`,e?`house-line`:`windows-logo`),a.toggleAttribute(`data-env-start`,!e),e?a.setAttribute(`aria-keyshortcuts`,`LongPress`):a.removeAttribute(`aria-keyshortcuts`)};c();let l=document.createElement(`div`);l.className=`env-shell-taskbar__tray-host`;let u=document.createElement(`div`);u.className=`env-shell-taskbar__clock`,u.setAttribute(`role`,`button`),u.setAttribute(`tabindex`,`0`),u.setAttribute(`aria-label`,`Calendar`),u.setAttribute(`aria-haspopup`,`dialog`),u.setAttribute(`data-chrome-flyout-anchor`,`calendar`);let d=document.createElement(`span`);d.className=`env-shell-taskbar__clock-time`;let f=document.createElement(`span`);f.className=`env-shell-taskbar__clock-date`,u.append(d,f);let p=()=>{let{time:e,date:t}=ds();d.textContent=e,f.textContent=t,u.title=`${e} · ${t}`};p();let m=setInterval(p,ys),g=On(e.device,`env-device-tray env-device-tray--taskbar`);g.setAttribute(`role`,`button`),g.setAttribute(`tabindex`,`0`),g.setAttribute(`aria-label`,`Quick settings`),g.setAttribute(`aria-haspopup`,`dialog`),g.setAttribute(`data-chrome-flyout-anchor`,`quick-settings`);let _=e=>{e.preventDefault(),e.stopPropagation(),yt(u)},v=e=>{e.preventDefault(),e.stopPropagation(),It(g)};u.addEventListener(`click`,_),u.addEventListener(`keydown`,e=>{(e.key===`Enter`||e.key===` `)&&_(e)}),g.addEventListener(`click`,v),g.addEventListener(`keydown`,e=>{(e.key===`Enter`||e.key===` `)&&v(e)}),l.append(g,u);let y=document.createElement(`div`);y.className=`env-shell-navbar__switcher`,y.setAttribute(`role`,`menu`),y.setAttribute(`aria-label`,`Open apps`),y.hidden=!0;let b=document.createElement(`ul`);b.className=`env-shell-navbar__switcher-list`,y.appendChild(b),n.append(r,i,l,y);let x=Ba(),S=x?$a():void 0,T=new Map,E=[],D=null,O=!1,k=!1,A=[];A.push(()=>clearInterval(m));let j=e=>E.find(t=>String(t.id||``).trim().toLowerCase()===e),M=t=>{let n=String(t||``).trim().toLowerCase();if(!n)return;let r=j(n),i=String(e.focusedTaskId.value||``).trim().toLowerCase(),a=!!r?.focused||i===n||i===`markdown`&&n===`viewer`||i===`viewer`&&(n===`viewer`||n===`markdown`);if(r?.minimized){r.minimized=!1,r.focused=!0,T.get(n)?.toggleAttribute(`data-minimized`,!1),e.focusedTaskId.value=n===`markdown`?`viewer`:n,e.onWindowTask?.(n);return}if(a&&r&&r.visible!==!1){r.minimized=!0,r.focused=!1,T.get(n)?.toggleAttribute(`data-minimized`,!0),e.onMinimizeWindow?.(n);return}e.focusedTaskId.value=n===`markdown`?`viewer`:n,e.onWindowTask?.(n)},te=(t,r,i)=>{if(ls())return;t.preventDefault(),t.stopPropagation();let a=String(r||``).trim().toLowerCase(),o=!!j(a)?.minimized,s=[{id:o?`restore`:`minimize`,label:o?`Restore`:`Minimize`,icon:o?`arrow-square-out`:`minus`,action:()=>{o?(e.focusedTaskId.value=a,e.onWindowTask?.(a)):e.onMinimizeWindow?.(a)}},{id:`close`,label:`Close`,icon:`x`,danger:!0,action:()=>e.onCloseWindow?.(a)}];di({x:t.clientX,y:t.clientY,compact:!0,anchor:t.target instanceof Element?t.target:n,items:s})};n.addEventListener(`contextmenu`,t=>{if(ls())return;let r=typeof t.composedPath==`function`?t.composedPath():[];for(let e of r)if(e instanceof Element&&e.closest?.(`ui-task`))return;t.preventDefault(),t.stopPropagation(),di({x:t.clientX,y:t.clientY,compact:!0,anchor:n,items:[{id:`show-desktop`,label:`Show desktop`,icon:`desktop`,action:()=>e.onHome()},{id:`home`,label:`Home`,icon:`house-line`,action:()=>e.onHome()}]})});let N=()=>{k=!1,y.hidden=!0,b.replaceChildren(),n.removeAttribute(`data-switcher-open`)},ne=()=>{let r=E.filter(e=>String(e.id||``).trim());if(b.replaceChildren(),r.length)for(let n of r){let r=String(n.id||``).trim().toLowerCase(),i=document.createElement(`li`);i.className=`env-shell-navbar__switcher-row`,i.setAttribute(`role`,`none`);let a=document.createElement(`button`);a.type=`button`,a.className=`env-shell-navbar__switcher-item`,a.setAttribute(`role`,`menuitem`),a.toggleAttribute(`data-active`,!!n.focused&&!n.minimized),a.toggleAttribute(`data-minimized`,!!n.minimized);let o=document.createElement(`ui-icon`);o.setAttribute(`icon`,n.icon||`app-window`),o.setAttribute(`icon-style`,`duotone`),o.setAttribute(`aria-hidden`,`true`);let s=document.createElement(`span`);s.className=`env-shell-navbar__switcher-label`,s.textContent=n.title||r,a.append(o,s),a.addEventListener(`click`,n=>{n.preventDefault(),n.stopPropagation(),N(),e.focusedTaskId.value=r;let i=cs(r),a=w(t,i);a?a.focus=!0:e.onWindowTask?.(r)});let c=document.createElement(`button`);c.type=`button`,c.className=`env-shell-navbar__switcher-close`,c.setAttribute(`aria-label`,`Close ${n.title||r}`),c.title=`Close`;let l=document.createElement(`ui-icon`);l.setAttribute(`icon`,`x`),l.setAttribute(`icon-style`,`bold`),l.setAttribute(`aria-hidden`,`true`),c.appendChild(l),c.addEventListener(`click`,t=>{t.preventDefault(),t.stopPropagation(),e.onCloseWindow?.(r),E=E.filter(e=>String(e.id||``).trim().toLowerCase()!==r),T.get(r)?.remove(),T.delete(r),E.length?ne():N()}),i.append(a,c),b.appendChild(i)}else{let e=document.createElement(`li`);e.className=`env-shell-navbar__switcher-empty`,e.textContent=`No open apps`,b.appendChild(e)}k=!0,y.hidden=!1,n.setAttribute(`data-switcher-open`,``)},re=()=>{D!=null&&(clearTimeout(D),D=null)},P=()=>{n.toggleAttribute(`data-app-menu-open`,!!S?.isOpen())},F=()=>{N(),S?.close(),P(),w(t,hs).focus=!0,e.onHome()},ae=()=>{N(),S?.toggle(),P(),w(t,hs).focus=!0,e.focusedTaskId.value=`home`,R()},I=()=>{!S||S.isOpen()||(N(),S.open(),P(),w(t,hs).focus=!0,e.focusedTaskId.value=`home`,R())},oe=()=>{S&&(N(),S.openPage(),P(),w(t,hs).focus=!0,e.focusedTaskId.value=`home`,R())};try{let e=globalThis;e.__CWSP_LAUNCHER_HOME__={...e.__CWSP_LAUNCHER_HOME__||{},openAppMenu:I,openAppMenuPage:oe}}catch{}let se=()=>{if(us(E,e.focusedTaskId)){F();return}if(S?.isOpen()){S.close(),P();return}ae()};a.addEventListener(`click`,e=>{if(O){e.preventDefault(),e.stopPropagation(),O=!1;return}if(x&&S){e.preventDefault(),e.stopPropagation(),se();return}F()}),a.addEventListener(`pointerdown`,e=>{if(ls()&&(e.button==null||e.button===0)){O=!1,re(),D=setTimeout(()=>{D=null,O=!0;try{a.releasePointerCapture?.(e.pointerId)}catch{}ne()},vs);try{a.setPointerCapture?.(e.pointerId)}catch{}}},{capture:!0});let ce=()=>{re()};a.addEventListener(`pointerup`,ce,{capture:!0}),a.addEventListener(`pointercancel`,ce,{capture:!0}),a.addEventListener(`contextmenu`,e=>{ls()&&(e.preventDefault(),O=!0,re(),ne())});let L=e=>{if(!k)return;let t=typeof e.composedPath==`function`?e.composedPath():[];for(let e of t)if(e===y||e===a||e instanceof Element&&(e===y||y.contains(e)||e===a))return;N()};document.addEventListener(`pointerdown`,L,{capture:!0}),A.push(()=>document.removeEventListener(`pointerdown`,L,{capture:!0}));let R=()=>{let t=String(e.focusedTaskId.value||`home`),n=(e,t)=>{e.toggleAttribute(`data-env-active`,t),e.toggleAttribute(`data-active`,t),e.toggleAttribute(`data-focus`,t)};n(a,t===`home`);for(let[e,r]of T)n(r,t===e)};ee(()=>{R()},[e.focusedTaskId],{triggerImmediately:!0});let le=e=>{let n=String(e.id||``).trim().toLowerCase();if(!n||n===`home`)return;let r=cs(n),a=e.title||n,o=String(e.icon||``).trim()||`app-window`,s=T.get(n);if(!s){let e=C(r,null,{title:a,icon:o},{viewId:n},function(){for(let e of t)e!==this&&(e.active=!1);this.active=!0,M(n)});e.list=t,t.push(e),s=document.createElement(`ui-task`),s.setAttribute(`data-id`,r),s.setAttribute(`data-view`,n),s.setAttribute(`title`,a),s.setAttribute(`aria-label`,a),s.setAttribute(`icon`,o),s.addEventListener(`click`,e=>{e.preventDefault(),e.stopPropagation(),M(n)}),s.addEventListener(`contextmenu`,e=>{te(e,n,a)}),T.set(n,s),i.appendChild(s)}s.setAttribute(`title`,a),s.setAttribute(`aria-label`,a),s.setAttribute(`icon`,o),s.toggleAttribute(`data-minimized`,!!e.minimized),s.hidden=e.visible===!1},ue=n=>{E=Array.isArray(n)?n.slice():[];let r=new Set;for(let t of n){let n=String(t.id||``).trim().toLowerCase();!n||n===`home`||(r.add(n),le(t),t.focused&&(e.focusedTaskId.value=n))}for(let[e,n]of[...T.entries()]){if(r.has(e))continue;let i=cs(e),a=w(t,i);if(a){let e=t.indexOf(a);e>=0&&t.splice(e,1)}n.remove(),T.delete(e)}R(),k&&ne()},de=n=>{let r=String(n||`home`).toLowerCase(),i=hs;r===`viewer`||r===`markdown`?i=gs:r!==`home`&&(i=cs(r));let a=w(t,i);if(a){for(let e of t)e!==a&&(e.active=!1);a.active=!0}e.focusedTaskId.value=r===`markdown`?`viewer`:r,R()};if(queueMicrotask(c),S){let e=()=>P();n.addEventListener(`env-app-menu-open`,e),n.addEventListener(`env-app-menu-close`,e),A.push(()=>{n.removeEventListener(`env-app-menu-open`,e),n.removeEventListener(`env-app-menu-close`,e)})}return{element:n,taskList:t,setFocusedTaskId:de,syncWindowTasks:ue,appMenu:S,openAppMenu:S?I:void 0,openAppMenuPage:S?oe:void 0,isSwitcherOpen:()=>k,closeSwitcher:N,dispose:()=>{re(),N(),S?.dispose();for(let e of A)try{e()}catch{}A.length=0,T.clear(),i.replaceChildren()}}}var ps,ms,hs,gs,_s,vs,ys;function bs(){return(bs=e((()=>{se(),te(),M(),T(),fi(),Mn(),Et(),hn(),oo(),No(),as(),V(),ss(),l(),ps=f(os),ms=class extends Ze{constructor(){super()}styles=()=>ps;render=()=>v`<div part="taskbar" class="taskbar"><slot></slot></div>`},ms=z([x(`ui-taskbar`)],ms),hs=`#env-home`,gs=`#env-viewer`,_s=`#env-win-`,vs=420,ys=3e4})))()}function xs(e){if(typeof Uint8Array.fromBase64==`function`)return Uint8Array.fromBase64(e);let t=atob(e),n=new Uint8Array(t.length);for(let e=0;e<t.length;e++)n[e]=t.charCodeAt(e);return n}async function Ss(e,t=`gzip`){if(typeof CompressionStream>`u`)throw Error(`Compression Streams API is not supported in this browser`);let n=new DecompressionStream(t),r=n.writable.getWriter(),i=n.readable.getReader();r.write(e),r.close();let a=[],o=!1;for(;!o;){let{value:e,done:t}=await i.read();o=t,e&&a.push(e)}let s=a.reduce((e,t)=>e+t.length,0),c=new Uint8Array(s),l=0;for(let e of a)c.set(e,l),l+=e.length;return c}async function Cs(e,t,n=`font/woff2`){if(Os.has(t))return Os.get(t);let r=new Blob([e],{type:n}),i=URL.createObjectURL(r);return Os.set(t,i),i}async function ws(e){let{base64:t,family:n,style:r=`normal`,weight:i=`normal`,compressed:a=!1}=e,o=`${n}-${r}-${i}`;if(ks.has(o))return ks.get(o);let s=xs(t),c=await Cs(a?await Ss(s):s,o,a?`application/octet-stream`:`font/woff2`),l=new FontFace(n,`url(${c}) format('woff2')`,{style:r,weight:typeof i==`string`?i:`${i}`,display:`swap`});return await l.load(),document.fonts.add(l),ks.set(o,l),l}async function Ts(e){let t=e.map(e=>ws(e));return Promise.all(t)}async function Es(){return As||(As=F(()=>import(`./font-registry-BefiOUvg.js`).then(e=>typeof e.loadFontRegistryShards==`function`?e.loadFontRegistryShards().then(e=>({fontRegistry:e})):{fontRegistry:e.fontRegistry}),[],import.meta.url).catch(e=>{console.error(`Failed to load font registry:`,e)}),As)}async function Ds(){let e=await Es();return Ts(Object.values(e.fontRegistry))}var Os,ks,As;function js(){return(js=e((()=>{P(),Os=new Map,ks=new Map,As=null})))()}var Ms;function Ns(){return(Ns=e((()=>{Ms=`/*
 * Filename: index.scss
 * FullPath: modules/projects/veela.css/src/scss/ui/index.scss
 * Reason for changes: Curated public UI entry-point during the Veela merge.
 */
/* ai-refactor: optimized/refactored at 2026-02-13T00:45:15Z */
/* ai-refactor: optimized/refactored at 2026-02-13T00:45:12Z */
.c-underlying {
  position: absolute;
  pointer-events: none;
  overflow: visible;
  inset: 0;
  z-index: calc(var(--layer-main-z, 0) - 1);
}

.c-underlying__shaped {
  border-radius: var(--layer-shape-radius, inherit);
  mask-image: var(--layer-shape-mask, none);
  -webkit-mask-image: var(--layer-shape-mask, none);
  inline-size: 100%;
  block-size: 100%;
}
@supports (border-shape: inset(0)) {
  .c-underlying__shaped {
    border-shape: var(--layer-shape-clip, none);
  }
}
@supports not (border-shape: inset(0)) {
  .c-underlying__shaped {
    clip-path: var(--layer-shape-clip, none);
  }
}

.c-overlaying {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: calc(var(--layer-main-z, 0) + 1);
}

.c-overlaying [data-axis] {
  pointer-events: auto;
}

@layer components {
  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-sm);
    padding-block: 0px;
    padding-inline: 0px;
    font-size: var(--font-size-sm);
    font-weight: 500;
    border-radius: var(--radius-md);
    background: var(--color-bg-alt);
    color: var(--color-fg);
    border: 1px solid var(--color-border);
    cursor: pointer;
    transition: all var(--transition-fast);
  }
  .btn:hover:not(:disabled) {
    background: var(--color-border);
  }
  .btn:focus-visible {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
  }
  .btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  .btn {
    --ui-bg: var(--color-surface-container-high);
    --ui-fg: var(--color-on-surface);
    --ui-bg-hover: var(--color-surface-container-highest);
    --ui-ring: var(--color-primary);
    --ui-radius: var(--radius-lg);
    --ui-pad-y: var(--space-sm);
    --ui-pad-x: var(--space-lg);
    --ui-font-size: var(--text-sm);
    --ui-font-weight: var(--font-weight-semibold);
    --ui-min-h: 40px;
    --ui-opacity: 1;
    appearance: none;
    border: none;
    background: var(--ui-bg);
    color: var(--ui-fg);
    border-radius: var(--ui-radius);
    padding: max(var(--ui-pad-y, 0px), 0px) max(var(--ui-pad-x, 0px), 0px);
    font-size: var(--ui-font-size);
    font-weight: var(--ui-font-weight);
    letter-spacing: 0.01em;
    line-height: 1.2;
    block-size: calc-size(fit-content, max(var(--ui-min-h), size));
    transition: background-color var(--motion-fast), box-shadow var(--motion-fast), transform var(--motion-fast);
    box-shadow: var(--elev-0);
    user-select: none;
    touch-action: manipulation;
    pointer-events: auto;
    gap: var(--space-xs);
    text-transform: none;
    opacity: var(--ui-opacity);
    min-block-size: fit-content;
    min-inline-size: calc-size(fit-content, size + 0.5rem + var(--icon-size, 1rem));
    max-inline-size: none;
    max-block-size: stretch;
    flex-direction: row;
    flex-wrap: nowrap;
    text-wrap: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    text-align: center;
    text-decoration: none;
    text-shadow: none;
    text-rendering: auto;
    contain: none;
    container-type: normal;
    place-items: center;
    place-content: center;
    justify-content: safe center;
    justify-items: safe center;
    align-content: safe center;
    align-items: safe center;
  }
  .btn > ui-icon {
    flex-shrink: 0;
    pointer-events: none;
    color: inherit;
    align-self: center;
    vertical-align: middle;
  }
  @media (max-width: 480px) {
    .btn.btn-icon {
      font-size: 0px !important;
      aspect-ratio: 1/1;
      block-size: fit-content;
      max-block-size: stretch;
      min-inline-size: 0px;
      max-inline-size: fit-content;
      gap: 0px;
    }
    .btn.btn-icon .btn-text,
    .btn.btn-icon span:not(.sr-only) {
      display: none !important;
    }
  }
  .btn:hover {
    background: var(--ui-bg-hover);
    box-shadow: var(--elev-1);
    transform: translateY(-1px);
  }
  .btn:active {
    transform: translateY(0);
    box-shadow: var(--elev-0);
  }
  .btn:focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px color-mix(in oklab, var(--ui-ring) 35%, transparent);
  }
  .btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none !important;
  }
  .btn:disabled:hover {
    background: var(--color-surface-container-high);
    box-shadow: var(--elev-0);
  }
  .btn.primary, .btn.active {
    --ui-bg: var(--color-primary);
    --ui-fg: var(--color-on-primary);
    --ui-ring: var(--color-primary);
  }
  .btn.primary {
    --ui-bg-hover: color-mix(in oklab, var(--color-primary) 90%, black);
  }
  .btn.active {
    box-shadow: var(--elev-1);
  }
  .btn.small {
    --ui-pad-y: var(--space-xs);
    --ui-pad-x: var(--space-md);
    --ui-font-size: var(--text-xs);
    --ui-min-h: 32px;
    --ui-radius: var(--radius-md);
  }
  .btn.icon-btn {
    inline-size: 40px;
    block-size: 40px;
    --ui-pad-y: 0px;
    --ui-pad-x: 0px;
    --ui-radius: 9999px;
    --ui-font-size: var(--text-lg);
  }
  .btn[data-action=open-md], .btn[data-action=export-md], .btn[data-action=export-docx] {
    --ui-font-size: 12px;
    --ui-pad-x: 8px;
    --ui-pad-y: 0px;
    --ui-min-h: 28px;
  }
  .btn:is([data-action=view-markdown-viewer],
  [data-action=view-markdown-editor],
  [data-action=view-rich-editor],
  [data-action=view-settings],
  [data-action=view-history],
  [data-action=view-workcenter]) {
    --ui-font-size: 13px;
    --ui-font-weight: 500;
    --ui-pad-x: 12px;
    --ui-pad-y: 0px;
    --ui-min-h: 32px;
    --ui-radius: 16px;
    text-transform: capitalize;
  }
  .btn:is([data-action=view-markdown-viewer],
  [data-action=view-markdown-editor],
  [data-action=view-rich-editor],
  [data-action=view-settings],
  [data-action=view-history],
  [data-action=view-workcenter][data-current],
  [data-action=view-workcenter].active) {
    --ui-bg: var(--color-surface-container-highest);
    --ui-fg: var(--color-primary);
    --ui-ring: var(--color-primary);
  }
  .btn:is([data-action=toggle-edit],
  [data-action=snip],
  [data-action=solve],
  [data-action=code],
  [data-action=css],
  [data-action=voice],
  [data-action=edit-templates],
  [data-action=recognize],
  [data-action=analyze],
  [data-action=select-files],
  [data-action=clear-prompt],
  [data-action=view-full-history]) {
    --ui-font-size: 12px;
    --ui-pad-x: 8px;
    --ui-pad-y: 0px;
    --ui-min-h: 28px;
    --ui-radius: 14px;
  }
  .btn:has(> ui-icon):not(:has(> *:not(ui-icon))), .btn:has(> span:only-of-type:empty) {
    font-size: 0px !important;
    aspect-ratio: 1/1;
    block-size: fit-content;
    max-block-size: stretch;
    min-inline-size: 0px;
    max-inline-size: fit-content;
    gap: 0px;
    overflow: visible;
  }
  .btn:has(> ui-icon):not(:has(> *:not(ui-icon))) span:not(.sr-only), .btn:has(> span:only-of-type:empty) span:not(.sr-only) {
    display: none !important;
  }
  .btn-primary {
    background: var(--color-primary);
    color: white;
    border-color: var(--color-primary);
  }
  .btn-primary:hover:not(:disabled) {
    background: var(--color-primary-hover);
    border-color: var(--color-primary-hover);
  }
  @media (max-width: 768px) {
    .btn {
      --ui-pad-y: var(--space-xs);
      --ui-pad-x: var(--space-md);
      --ui-font-size: var(--text-xs);
      --ui-min-h: 36px;
    }
  }
  @media (max-width: 480px) {
    .btn {
      --ui-pad-y: var(--space-xs);
      --ui-pad-x: var(--space-xs);
      --ui-font-size: var(--text-xs);
      --ui-min-h: 32px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .btn.btn-icon {
      overflow: visible;
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .btn {
      transition: none;
      transform: none !important;
    }
    .btn:hover, .btn:active {
      transform: none !important;
    }
  }
}
@layer utilities {
  .round-decor {
    --background-tone-shift: 0;
    padding-block: 0.25rem;
    border-radius: 0.25rem;
    overflow: hidden;
  }
  .round-decor:empty {
    padding: 0;
    display: none;
    pointer-events: none;
    visibility: collapse;
  }
  .time-format {
    display: inline-flex;
    flex-direction: row;
    place-content: center;
    place-items: center;
    place-self: center;
    padding: 0.125rem;
    font: 500 0.9em "InterVariable", "Inter", "Fira Mono", "Menlo", "Consolas", monospace;
    font-optical-sizing: auto;
    font-variant-numeric: tabular-nums;
    font-kerning: auto;
    font-stretch: condensed;
    font-width: condensed;
    letter-spacing: -0.05em;
    text-wrap: nowrap;
    text-align: center;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  /*
   * WHY: Launcher caption rows use \`[data-layer="labels"]\`; a global \`span { aspect-ratio: 1/1 }\` makes each pill as tall as its width (“box” tiles).
   * Square helpers apply only outside label captions (icon/grid tiles still use spans elsewhere).
   */
  .ui-ws-item:not([data-layer=labels]) span:not(.ui-ws-item-caption) {
    pointer-events: none;
    aspect-ratio: 1/1;
    inline-size: fit-content;
    block-size: fit-content;
    display: inline;
  }
  .ui-ws-item {
    cursor: pointer;
    user-select: none;
    pointer-events: auto;
  }
  .ui-ws-item:active, .ui-ws-item:has(:active) {
    will-change: inset, translate, transform, opacity, z-index;
    cursor: grabbing;
  }
}
@layer components {
  @media print {
    .ctx-menu, .ux-anchor, .component-loading, .component-error {
      display: none !important;
      visibility: hidden !important;
      opacity: 0 !important;
      pointer-events: none !important;
      position: absolute !important;
      inset: 0 !important;
      z-index: -1 !important;
      inline-size: 0 !important;
      block-size: 0 !important;
      max-inline-size: 0 !important;
      max-block-size: 0 !important;
      min-inline-size: 0 !important;
      min-block-size: 0 !important;
      margin: 0 !important;
      padding: 0 !important;
      border: none !important;
      overflow: hidden !important;
    }
  }
  @media screen {
    ui-window-frame,
    ui-modal,
    .ui-grid-item,
    .ctx-menu {
      --font-family: "InterVariable", "Inter", "Helvetica Neue", "Helvetica", "Calibri", "Roboto", ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif;
    }
    ui-window-frame,
    ui-modal,
    .ui-grid-item {
      --opacity: 1;
      --scale: 1;
      --rotate: 0deg;
      --translate-x: 0%;
      --translate-y: 0%;
      isolation: isolate;
      content-visibility: auto;
      transform-origin: 50% 50%;
      transform-style: flat;
      transform-box: fill-box;
      translate: 0% 0% 0%;
      opacity: var(--opacity, 1);
      rotate: 0deg;
      scale: 1;
    }
    .ctx-menu {
      --font-family: "InterVariable", "Inter", "Helvetica Neue", "Helvetica", "Calibri", "Roboto", ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif;
    }
    .ctx-menu,
    .ctx-menu * {
      visibility: visible;
      content-visibility: visible;
    }
    .ctx-menu {
      position: fixed;
      z-index: 99999;
      inline-size: max-content;
      min-inline-size: 160px;
      max-inline-size: min(240px, 100cqi);
      block-size: fit-content;
      padding: 0.25rem 0;
      border: 1px solid var(--color-outline-variant);
      border-radius: var(--radius-md);
      background-color: var(--color-surface);
      color: var(--color-on-surface);
      font-size: 0.875rem;
      font-weight: 400;
      box-shadow: var(--elev-3);
      opacity: 1;
      visibility: visible;
      pointer-events: auto;
      transform: scale3d(var(--scale, 1), var(--scale, 1), 1) translate3d(var(--translate-x, 0px), var(--translate-y, 0px), 0px);
      transition: opacity 0.15s ease-out, visibility 0.15s ease-out, transform 0.15s ease-out;
      font-family: var(--font-family, 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif') !important;
      text-align: start;
      display: flex;
      flex-direction: column;
      align-items: stretch;
    }
    .ctx-menu[data-hidden] {
      opacity: 0;
      visibility: hidden;
      pointer-events: none;
    }
    .ctx-menu > * {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-start;
      text-align: start;
      inline-size: stretch;
      min-block-size: 2rem;
      gap: 0.5rem;
      padding: 0.375rem 0.75rem;
      border: none;
      border-radius: var(--radius-sm);
      outline: none;
      position: relative;
      background-color: transparent;
      color: var(--color-on-surface);
      cursor: pointer;
      text-wrap: nowrap;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
      pointer-events: auto;
      transition: background-color 0.15s ease, color 0.15s ease;
      font-family: var(--font-family, 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif') !important;
    }
    .ctx-menu > *:hover {
      background-color: var(--color-surface-container-high);
      color: var(--color-on-surface);
    }
    .ctx-menu > *:active {
      background-color: var(--color-surface-container-highest);
      color: var(--color-on-surface);
    }
    .ctx-menu > *:focus-visible {
      outline: var(--focus-ring);
      background-color: var(--color-surface-container-high);
    }
    .ctx-menu > *:not(.ctx-menu-separator) {
      gap: 0.5rem;
    }
    .ctx-menu > * > * {
      pointer-events: none;
    }
    .ctx-menu > * > span {
      flex: 1 1 auto;
      min-inline-size: 0;
      text-align: start !important;
      user-select: none;
      pointer-events: none;
      font-size: 0.875rem;
      font-weight: 400;
      line-height: 1.25;
      color: inherit;
    }
    .ctx-menu > * > ui-icon {
      --icon-size: 1rem;
      flex-shrink: 0;
      inline-size: var(--icon-size);
      block-size: var(--icon-size);
      color: var(--color-on-surface-variant);
      user-select: none;
      pointer-events: none;
    }
    .ctx-menu > .ctx-menu-separator, .ctx-menu.ctx-menu-separator {
      min-block-size: auto;
      block-size: 1px;
      margin: 0.125rem 0.375rem;
      padding: 0;
      background-color: var(--color-outline-variant);
      opacity: 0.3;
      pointer-events: none;
    }
    .ctx-menu {
      /*
       * \`.grid-rows\` applies subgrid + place(center) to children, which centers
       * label text per row. Context menus must stay flex rows with start-aligned labels.
       */
    }
    .ctx-menu.grid-rows {
      display: flex !important;
      flex-direction: column;
      align-items: stretch;
      grid-template-columns: unset !important;
      grid-auto-rows: unset !important;
    }
    .ctx-menu.grid-rows > *:not(.ctx-menu-separator) {
      display: flex !important;
      flex-flow: row nowrap !important;
      align-items: center !important;
      justify-content: flex-start !important;
      grid-column: unset !important;
      grid-row: unset !important;
      grid-template-columns: unset !important;
      grid-template-rows: unset !important;
      place-content: unset !important;
      place-items: unset !important;
    }
    .ux-anchor {
      --shift-x: var(--client-x, 0px);
      --shift-y: var(--client-y, 0px);
      --translate-x: round(nearest, min(0px, calc(100cqi - (100% + var(--shift-x, 0px)))), calc(1px / var(--pixel-ratio, 1))) !important;
      --translate-y: round(nearest, min(0px, calc(100cqb - (100% + var(--shift-y, 0px)))), calc(1px / var(--pixel-ratio, 1))) !important;
      inset-inline-start: max(var(--shift-x), 0px);
      inset-block-start: max(var(--shift-y), var(--status-bar-padding, 0px));
      inset-inline-end: auto;
      inset-block-end: auto;
      direction: ltr;
      writing-mode: horizontal-tb;
      translate: 0% 0% 0%;
      transform: none;
    }
    .component-loading,
    .component-error {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 2rem;
      gap: 1rem;
      color: var(--text-secondary, light-dark(#666, #aaa));
    }
    .component-loading .loading-spinner {
      inline-size: 2rem;
      block-size: 2rem;
      border: 2px solid var(--border, light-dark(#ddd, #444));
      border-block-start: 2px solid var(--primary, light-dark(#007bff, #5fa8ff));
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
    .component-error {
      text-align: center;
    }
    .component-error h3 {
      margin: 0;
      color: var(--error, light-dark(#dc3545, #ff6b6b));
    }
    .component-error p {
      margin: 0;
    }
    ui-icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      inline-size: var(--icon-size, 1.25rem);
      block-size: var(--icon-size, 1.25rem);
      min-inline-size: var(--icon-size, 1.25rem);
      min-block-size: var(--icon-size, 1.25rem);
      color: currentColor;
      fill: currentColor;
      flex-shrink: 0;
      vertical-align: middle;
      opacity: 1;
      visibility: visible;
      /* When a parent uses font-size: 0 for layout, keep raster/mask math stable */
      font-size: 1rem;
    }
    ui-icon svg,
    ui-icon img {
      inline-size: 100%;
      block-size: 100%;
      color: inherit;
      fill: currentColor;
    }
    :is(button, .btn) > ui-icon {
      color: inherit;
    }
    .file-picker {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-block-size: 300px;
      padding: 2rem;
      text-align: center;
    }
    .file-picker .file-picker-header {
      margin-block-end: 2rem;
    }
    .file-picker .file-picker-header h2 {
      margin: 0 0 0.5rem 0;
      color: var(--color-on-surface);
      font-size: 1.5rem;
      font-weight: 600;
    }
    .file-picker .file-picker-header p {
      margin: 0;
      color: var(--color-on-surface-variant);
      font-size: 0.9rem;
    }
    .file-picker .file-picker-actions {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 1rem;
      margin-block-end: 2rem;
    }
    .file-picker .file-picker-actions .btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.5rem;
      border: 1px solid transparent;
      border-radius: var(--radius-md);
      font-weight: 500;
      transition: all 0.2s ease;
    }
    .file-picker .file-picker-actions .btn:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }
    .file-picker .file-picker-actions .btn.btn-primary {
      background: var(--color-primary);
      color: var(--color-on-primary);
      border-color: var(--color-primary);
    }
    .file-picker .file-picker-actions .btn:not(.btn-primary) {
      background: var(--color-surface-container);
      color: var(--color-on-surface);
      border-color: var(--color-outline-variant);
    }
    .file-picker .file-picker-info {
      max-inline-size: 400px;
    }
    .file-picker .file-picker-info p {
      margin: 0.25rem 0;
      font-size: 0.85rem;
      color: var(--color-on-surface-variant);
    }
    .file-picker .file-picker-info p strong {
      color: var(--color-on-surface);
    }
  }
}
/*
 * MAP:modules/projects/veela.css/src/scss/basic/_core-layout.scss
 */
@layer layout {
  @media screen {
    :root, :host, :scope, :where(body) {
      pointer-events: auto;
      transition-behavior: allow-discrete;
      interpolate-size: allow-keywords;
      content-visibility: auto;
      --keyboard-inset-bottom: calc(max(env(keyboard-inset-bottom, 0px), 0px) / max(var(--zoom, 1), 0.125));
      --keyboard-inset-height: calc(max(env(keyboard-inset-height, 0px), 0px) / max(var(--zoom, 1), 0.125));
    }
    :root, :scope, :host {
      --scale: 1;
      --translate-x: 0px;
      --translate-y: 0px;
    }
    :root, :root :where(*), :scope, :scope :where(*), :host, :host :where(*) {
      --scale: 1;
      --translate-x: 0px;
      --translate-y: 0px;
    }
    :root, :where(html) {
      translate: none;
      transform: none;
      margin: 0px;
      padding: 0px;
      border: none 0px transparent;
      outline: none 0px transparent;
      background-color: transparent;
      container-type: size;
      container-name: html root;
      contain: none;
      overflow: visible;
      position: fixed;
      inset: 0px;
      inset-block-end: auto;
      min-inline-size: min(100cqi, 100dvi);
      min-block-size: min(100cqb, var(--lv-height, 100lvb));
      inline-size: stretch;
      block-size: var(--lv-height, 100lvb);
      max-inline-size: min(100%, min(100cqi, 100dvi)) !important;
      max-block-size: min(100%, min(100cqb, var(--lv-height, 100lvb))) !important;
      place-content: start;
      place-items: start;
      place-self: start;
      line-height: normal;
      flex-direction: column;
      display: flex;
    }
    :where(body) {
      translate: none;
      transform: none;
      margin: 0px;
      padding: 0px;
      border: none 0px transparent;
      outline: none 0px transparent;
      font-size: var(--text-base, 0.9rem);
      overflow: visible;
      position: relative;
      pointer-events: auto;
      inset: auto;
      display: inline flex;
      place-content: start;
      place-items: start;
      place-self: start;
      background-color: transparent;
      container-name: body;
      container-type: size;
      contain: strict;
      min-inline-size: 0px;
      min-block-size: 0px;
      inline-size: stretch;
      block-size: stretch;
      max-inline-size: min(100%, min(100cqi, 100dvi));
      max-block-size: min(100%, min(100cqb, var(--lv-height, 100lvb)));
    }
    :where(body) > :where(#app, #container, #root, .root) {
      inline-size: stretch;
      block-size: stretch;
      min-inline-size: 0px;
      min-block-size: 0px;
      max-inline-size: min(100%, min(100cqi, 100dvi));
      max-block-size: min(100%, min(100cqb, var(--lv-height, 100lvb)));
      background-color: transparent;
      border: none 0px transparent;
      outline: none 0px transparent;
    }
    :where(body) > :where(*) {
      max-inline-size: min(100%, min(100cqi, 100dvi));
      max-block-size: min(100%, min(100cqb, var(--lv-height, 100lvb)));
    }
    :root, :host, :scope, :where(body) {
      pointer-events: auto;
      transition-behavior: allow-discrete;
      interpolate-size: allow-keywords;
      content-visibility: auto;
      --keyboard-inset-bottom: calc(max(env(keyboard-inset-bottom, 0px), 0px) / max(var(--zoom, 1), 0.125));
      --keyboard-inset-height: calc(max(env(keyboard-inset-height, 0px), 0px) / max(var(--zoom, 1), 0.125));
    }
    :root, :scope, :host {
      --scale: 1;
      --translate-x: 0px;
      --translate-y: 0px;
    }
    :root, :root :where(*), :scope, :scope :where(*), :host, :host :where(*) {
      --scale: 1;
      --translate-x: 0px;
      --translate-y: 0px;
    }
    :root, :where(html) {
      translate: none;
      transform: none;
      margin: 0px;
      padding: 0px;
      border: none 0px transparent;
      outline: none 0px transparent;
      background-color: transparent;
      container-type: size;
      container-name: html root;
      contain: none;
      overflow: visible;
      position: fixed;
      inset: 0px;
      inset-block-end: auto;
      min-inline-size: min(100cqi, 100dvi);
      min-block-size: min(100cqb, var(--lv-height, 100lvb));
      inline-size: stretch;
      block-size: var(--lv-height, 100lvb);
      max-inline-size: min(100%, min(100cqi, 100dvi)) !important;
      max-block-size: min(100%, min(100cqb, var(--lv-height, 100lvb))) !important;
      place-content: start;
      place-items: start;
      place-self: start;
      line-height: normal;
      flex-direction: column;
      display: flex;
    }
    :where(body) {
      translate: none;
      transform: none;
      margin: 0px;
      padding: 0px;
      border: none 0px transparent;
      outline: none 0px transparent;
      font-size: var(--text-base, 0.9rem);
      overflow: visible;
      position: relative;
      pointer-events: auto;
      inset: auto;
      display: inline flex;
      place-content: start;
      place-items: start;
      place-self: start;
      background-color: transparent;
      container-name: body;
      container-type: size;
      contain: strict;
      min-inline-size: 0px;
      min-block-size: 0px;
      inline-size: stretch;
      block-size: stretch;
      max-inline-size: min(100%, min(100cqi, 100dvi));
      max-block-size: min(100%, min(100cqb, var(--lv-height, 100lvb)));
    }
    :where(body) > :where(#app, #container, #root, .root) {
      inline-size: stretch;
      block-size: stretch;
      min-inline-size: 0px;
      min-block-size: 0px;
      max-inline-size: min(100%, min(100cqi, 100dvi));
      max-block-size: min(100%, min(100cqb, var(--lv-height, 100lvb)));
    }
    :where(body) > :where(*) {
      max-inline-size: min(100%, min(100cqi, 100dvi));
      max-block-size: min(100%, min(100cqb, var(--lv-height, 100lvb)));
    }
  }
}
@function --hsv(--src-color <color>) returns <color> {
  result: hsl(from var(--src-color, black) h calc(calc((calc(l / 100) - calc(calc(l / 100) * (1 - calc(s / 100) / 2))) / clamp(0.0001, min(calc(calc(l / 100) * (1 - calc(s / 100) / 2)), calc(1 - calc(calc(l / 100) * (1 - calc(s / 100) / 2)))), 1)) * 100) calc(calc(calc(l / 100) * (1 - calc(s / 100) / 2)) * 100) / alpha);
}
@function --get-oriented-size-num(--orient <number>: 0, --osx <number>: 0, --osy <number>: 0, --axis-to-return <number>: 0 ) returns <number> {
  --go-orient: round(nearest, var(--orient, 0), 1);
  --go-axis: clamp(0, round(nearest, var(--axis-to-return, 0), 1), 1);
  --go-axis-inline: calc(1 - var(--go-axis, 0));
  --go-axis-block: var(--go-axis, 0);
  --go-swap-raw: mod(var(--go-orient), 2);
  --go-swap: clamp(0, round(nearest, var(--go-swap-raw), 1), 1);
  --go-swap-inline: calc(1 - var(--go-swap, 0));
  --go-primary: var(--osx, 0);
  --go-secondary: var(--osy, 0);
  --go-inline: calc(
      var(--go-primary) * var(--go-swap-inline) +
      var(--go-secondary) * var(--go-swap)
  );
  --go-block: calc(
      var(--go-secondary) * var(--go-swap-inline) +
      var(--go-primary) * var(--go-swap)
  );
  result: calc(var(--go-inline) * var(--go-axis-inline) + var(--go-block) * var(--go-axis-block));
}
@function --get-oriented-size(--orient <number>: 0, --osx <length-percentage>: 0px, --osy <length-percentage>: 0px, --axis-to-return <number>: 0 ) returns <length-percentage> {
  --go-orient: mod(round(nearest, var(--orient, 0), 1), 4);
  --go-axis: clamp(0, round(nearest, var(--axis-to-return, 0), 1), 1);
  --go-axis-inline: calc(1 - var(--go-axis, 0));
  --go-axis-block: var(--go-axis, 0);
  --go-swap-raw: mod(var(--go-orient, 0), 2);
  --go-swap: clamp(0, round(nearest, var(--go-swap-raw, 0), 1), 1);
  --go-swap-inline: calc(1 - var(--go-swap, 0));
  --go-primary: var(--osx, 0px);
  --go-secondary: var(--osy, 0px);
  --go-inline: calc(var(--go-primary) * var(--go-swap-inline) + var(--go-secondary) * var(--go-swap));
  --go-block: calc(var(--go-secondary) * var(--go-swap-inline) + var(--go-primary) * var(--go-swap));
  result: calc(var(--go-inline) * var(--go-axis-inline) + var(--go-block) * var(--go-axis-block));
}
@function --get-oriented-vector(--orient <number>: 0, --ocx <length-percentage>: 0px, --ocy <length-percentage>: 0px, --axis-to-return <number>: 0 ) returns <length-percentage> {
  --go-orient: mod(round(nearest, var(--orient, 0), 1), 4);
  --go-axis: clamp(0, round(nearest, var(--axis-to-return, 0), 1), 1);
  --go-axis-inline: calc(1 - var(--go-axis, 0));
  --go-axis-block: var(--go-axis, 0);
  --go-swap-raw: mod(var(--go-orient, 0), 2);
  --go-swap: clamp(0, round(nearest, var(--go-swap-raw, 0), 1), 1);
  --go-swap-inline: calc(1 - var(--go-swap, 0));
  --go-primary-direct: var(--ocx, 0px);
  --go-secondary-direct: var(--ocy, 0px);
  --go-inline-direct: calc(
      var(--go-primary-direct) * var(--go-swap-inline) +
      var(--go-secondary-direct) * var(--go-swap)
  );
  --go-block-direct: calc(
      var(--go-secondary-direct) * var(--go-swap-inline) +
      var(--go-primary-direct) * var(--go-swap)
  );
  --go-inline-inverted: calc(0px - var(--go-inline-direct));
  --go-block-inverted: calc(0px - var(--go-block-direct));
  --go-rev-inline: clamp(0, calc(var(--go-orient) - 1), 1);
  --go-rev-block: clamp(0, calc((1 - abs(calc(var(--go-orient) - 1.5))) * 2), 1);
  --go-inline: calc(var(--go-inline-direct) * (1 - var(--go-rev-inline)) + var(--go-inline-inverted) * var(--go-rev-inline));
  --go-block: calc(var(--go-block-direct) * (1 - var(--go-rev-block)) + var(--go-block-inverted) * var(--go-rev-block));
  result: calc(var(--go-inline) * var(--go-axis-inline) + var(--go-block) * var(--go-axis-block));
}
@function --get-oriented-coord-num(--orient <number>: 0, --ocx <number>: 0, --ocy <number>: 0, --osx <number>: 0, --osy <number>: 0, --axis-to-return <number>: 0 ) returns <number> {
  --go-orient: mod(round(nearest, var(--orient, 0), 1), 4);
  --go-axis: clamp(0, round(nearest, var(--axis-to-return, 0), 1), 1);
  --go-axis-inline: calc(1 - var(--go-axis, 0));
  --go-axis-block: var(--go-axis, 0);
  --go-swap-raw: mod(var(--go-orient, 0), 2);
  --go-swap: clamp(0, round(nearest, var(--go-swap-raw, 0), 1), 1);
  --go-swap-inline: calc(1 - var(--go-swap, 0));
  --go-primary-direct: var(--ocx, 0);
  --go-secondary-direct: var(--ocy, 0);
  --go-primary-size: var(--osx, 0);
  --go-secondary-size: var(--osy, 0);
  --go-inline-direct: calc(
      var(--go-primary-direct) * var(--go-swap-inline) +
      var(--go-secondary-direct) * var(--go-swap)
  );
  --go-block-direct: calc(
      var(--go-secondary-direct) * var(--go-swap-inline) +
      var(--go-primary-direct) * var(--go-swap)
  );
  --go-inline-size: calc(
      var(--go-primary-size) * var(--go-swap-inline) +
      var(--go-secondary-size) * var(--go-swap)
  );
  --go-block-size: calc(
      var(--go-secondary-size) * var(--go-swap-inline) +
      var(--go-primary-size) * var(--go-swap)
  );
  --go-inline-inverted: calc(
      var(--go-inline-size, calc(var(--go-inline-direct) + var(--go-inline-direct))) -
      var(--go-inline-direct)
  );
  --go-block-inverted: calc(
      var(--go-block-size, calc(var(--go-block-direct) + var(--go-block-direct))) -
      var(--go-block-direct)
  );
  --go-rev-inline: clamp(0, calc(var(--go-orient) - 1), 1);
  --go-rev-block: clamp(
      0,
      calc((1 - abs(calc(var(--go-orient) - 1.5))) * 2),
      1
  );
  --go-inline: calc(
      var(--go-inline-direct) * (1 - var(--go-rev-inline)) +
      var(--go-inline-inverted) * var(--go-rev-inline)
  );
  --go-block: calc(
      var(--go-block-direct) * (1 - var(--go-rev-block)) +
      var(--go-block-inverted) * var(--go-rev-block)
  );
  result: calc(var(--go-inline) * var(--go-axis-inline) + var(--go-block) * var(--go-axis-block));
}
@function --get-oriented-coordinate(--orient <number>: 0, --ocx <length-percentage>: 0px, --ocy <length-percentage>: 0px, --osx <length-percentage>: 0px, --osy <length-percentage>: 0px, --axis-to-return <number>: 0 ) returns <length-percentage> {
  --go-orient: mod(round(nearest, var(--orient, 0), 1), 4);
  --go-axis: clamp(0, round(nearest, var(--axis-to-return, 0), 1), 1);
  --go-axis-inline: calc(1 - var(--go-axis, 0));
  --go-axis-block: var(--go-axis, 0);
  --go-swap-raw: mod(var(--go-orient, 0), 2);
  --go-swap: clamp(0, round(nearest, var(--go-swap-raw, 0), 1), 1);
  --go-swap-inline: calc(1 - var(--go-swap, 0));
  --go-primary-direct: var(--ocx, 0px);
  --go-secondary-direct: var(--ocy, 0px);
  --go-primary-size: var(--osx, 0px);
  --go-secondary-size: var(--osy, 0px);
  --go-inline-direct: calc(
      var(--go-primary-direct) * var(--go-swap-inline) +
      var(--go-secondary-direct) * var(--go-swap)
  );
  --go-block-direct: calc(
      var(--go-secondary-direct) * var(--go-swap-inline) +
      var(--go-primary-direct) * var(--go-swap)
  );
  --go-inline-size: calc(
      var(--go-primary-size) * var(--go-swap-inline) +
      var(--go-secondary-size) * var(--go-swap)
  );
  --go-block-size: calc(
      var(--go-secondary-size) * var(--go-swap-inline) +
      var(--go-primary-size) * var(--go-swap)
  );
  --go-inline-inverted: calc(
      var(--go-inline-size, calc(var(--go-inline-direct) + var(--go-inline-direct))) -
      var(--go-inline-direct)
  );
  --go-block-inverted: calc(
      var(--go-block-size, calc(var(--go-block-direct) + var(--go-block-direct))) -
      var(--go-block-direct)
  );
  --go-rev-inline: clamp(0, calc(var(--go-orient) - 1), 1);
  --go-rev-block: clamp(
      0,
      calc((1 - abs(calc(var(--go-orient) - 1.5))) * 2),
      1
  );
  --go-inline: calc(
      var(--go-inline-direct) * (1 - var(--go-rev-inline)) +
      var(--go-inline-inverted) * var(--go-rev-inline)
  );
  --go-block: calc(
      var(--go-block-direct) * (1 - var(--go-rev-block)) +
      var(--go-block-inverted) * var(--go-rev-block)
  );
  result: calc(var(--go-inline) * var(--go-axis-inline) + var(--go-block) * var(--go-axis-block));
}
/*
 * Filename: _orientbox.scss
 * FullPath: modules/projects/fl.ui/src/styles/ui/_orientbox.scss
 * Reason for changes: Restore Veela viewport import (typo viewrt→interact/viewport) and fix stray brace after merge mess.
 */
@layer layout {
  .ui-orientbox {
    --cs-size-x: 100cqi;
    --cs-size-y: 100cqb;
  }
  .ui-orientbox {
    --in-orient-base: round(nearest, var(--orient, 0), 1);
    --in-rev-cond-x: clamp(0, calc(var(--in-orient-base, 0) - 1), 1);
    --in-rev-cond-y: clamp(0, calc((1 - abs(calc(var(--in-orient-base, 0) - 1.5))) * 2), 1);
    --in-swap-cond: css-rem(var(--orient, 0), 2);
    --in-rev-vx: calc(var(--in-rev-cond-x, 1) * -2 + 1);
    --in-rev-vy: calc(var(--in-rev-cond-y, 1) * -2 + 1);
  }
  .ui-orientbox {
    --os-size-x: --get-oriented-size(mod(4 - var(--orient, 0), 4), var(--cs-size-x, 100cqi), var(--cs-size-y, 100cqb), 0);
    --os-size-y: --get-oriented-size(mod(4 - var(--orient, 0), 4), var(--cs-size-x, 100cqb), var(--cs-size-y, 100cqi), 1);
    --os-self-size-x: --get-oriented-size(mod(4 - var(--orient, 0), 4), var(--cs-self-size-x, 100%), var(--cs-self-size-y, 100%), 0);
    --os-self-size-y: --get-oriented-size(mod(4 - var(--orient, 0), 4), var(--cs-self-size-x, 100%), var(--cs-self-size-y, 100%), 1);
  }
  .ui-orientbox {
    --cs-inset-x: --get-oriented-coordinate(var(--orient, 0), var(--os-inset-x, 0px), var(--os-inset-y, 0px), var(--os-size-x, 100cqi), var(--os-size-y, 100cqb), 0);
    --cs-inset-y: --get-oriented-coordinate(var(--orient, 0), var(--os-inset-x, 0px), var(--os-inset-y, 0px), var(--os-size-x, 100cqi), var(--os-size-y, 100cqb), 1);
    --cs-drag-x: --get-oriented-vector(var(--orient, 0), var(--os-drag-x, 0px), var(--os-drag-y, 0px), 0);
    --cs-drag-y: --get-oriented-vector(var(--orient, 0), var(--os-drag-x, 0px), var(--os-drag-y, 0px), 1);
  }
  .ui-orientbox {
    --cs-size-x: 100cqi;
    --cs-size-y: 100cqb;
    position: relative;
    container-type: size !important;
    contain: strict !important;
    background-color: transparent;
    inset: 0px;
    grid-column: 1/-1;
    grid-row: 1/-1;
    place-self: start;
    min-inline-size: 0px;
    min-block-size: 0px;
    inline-size: stretch;
    block-size: stretch;
    pointer-events: none;
    zoom: max(var(--zoom, 1), 0.125);
    font-size: 16px;
    writing-mode: horizontal-tb !important;
    direction: ltr !important;
    /* WHY: IME must overlay — do not cap to shrinking \`--vv-height\` / \`100dvb\`. */
    max-inline-size: min(100%, min(100cqi, 100lvi), var(--lv-width, 100lvi)) !important;
    max-block-size: min(100%, min(100cqb, 100lvb), var(--lv-height, 100lvb)) !important;
    /*outline-color: oklch(from var(--on-surface-color) l c h / 0.1);
    outline-width: 1px;
    outline-style: solid;
    outline-offset: -1px;*/
    border-radius: var(--radius-lg);
  }
  .ui-orientbox {
    --zoom: max(var(--scaling, 1), 0.125);
    --zpx: calc(1px / max(var(--zoom, 1), 0.125));
    --ppx: calc(1px / max(var(--pixel-ratio, 1), 0.125));
  }
  .ui-orientbox > :where(*), .ui-orientbox :where(ui-frame, .u2-grid-item, ui-modal, [is=ui-orientbox], [is=ui-gridbox], [is=ui-orientbox] > :where(*), [is=ui-gridbox] > :where(*), .ui-gridlayout, .ui-gridlayout > :where(*)) {
    --in-orient-base: round(nearest, var(--orient, 0), 1);
    --in-rev-cond-x: clamp(0, calc(var(--in-orient-base, 0) - 1), 1);
    --in-rev-cond-y: clamp(0, calc((1 - abs(calc(var(--in-orient-base, 0) - 1.5))) * 2), 1);
    --in-swap-cond: css-rem(var(--orient, 0), 2);
    --in-rev-vx: calc(var(--in-rev-cond-x, 1) * -2 + 1);
    --in-rev-vy: calc(var(--in-rev-cond-y, 1) * -2 + 1);
  }
  .ui-orientbox > :where(*), .ui-orientbox :where(ui-frame, .u2-grid-item, ui-modal, [is=ui-orientbox], [is=ui-gridbox], [is=ui-orientbox] > :where(*), [is=ui-gridbox] > :where(*), .ui-gridlayout, .ui-gridlayout > :where(*)) {
    --os-size-x: --get-oriented-size(mod(4 - var(--orient, 0), 4), var(--cs-size-x, 100cqi), var(--cs-size-y, 100cqb), 0);
    --os-size-y: --get-oriented-size(mod(4 - var(--orient, 0), 4), var(--cs-size-x, 100cqb), var(--cs-size-y, 100cqi), 1);
    --os-self-size-x: --get-oriented-size(mod(4 - var(--orient, 0), 4), var(--cs-self-size-x, 100%), var(--cs-self-size-y, 100%), 0);
    --os-self-size-y: --get-oriented-size(mod(4 - var(--orient, 0), 4), var(--cs-self-size-x, 100%), var(--cs-self-size-y, 100%), 1);
  }
  .ui-orientbox > :where(*), .ui-orientbox :where(ui-frame, .u2-grid-item, ui-modal, [is=ui-orientbox], [is=ui-gridbox], [is=ui-orientbox] > :where(*), [is=ui-gridbox] > :where(*), .ui-gridlayout, .ui-gridlayout > :where(*)) {
    --cs-inset-x: --get-oriented-coordinate(var(--orient, 0), var(--os-inset-x, 0px), var(--os-inset-y, 0px), var(--os-size-x, 100cqi), var(--os-size-y, 100cqb), 0);
    --cs-inset-y: --get-oriented-coordinate(var(--orient, 0), var(--os-inset-x, 0px), var(--os-inset-y, 0px), var(--os-size-x, 100cqi), var(--os-size-y, 100cqb), 1);
    --cs-drag-x: --get-oriented-vector(var(--orient, 0), var(--os-drag-x, 0px), var(--os-drag-y, 0px), 0);
    --cs-drag-y: --get-oriented-vector(var(--orient, 0), var(--os-drag-x, 0px), var(--os-drag-y, 0px), 1);
  }
  .ui-orientbox .center-self {
    inset: var(--cs-inset-y, 0px) auto auto var(--cs-inset-x, 0px);
    transform-origin: 0% 0%;
    transform: translate3d(round(nearest, var(--cs-drag-x, 0px), 1px / var(--pixel-ratio, 1)), round(nearest, var(--cs-drag-y, 0px), 1px / var(--pixel-ratio, 1)), 0) scale3d(var(--scale, 1), var(--scale, 1), var(--scale, 1)) translate3d(round(nearest, calc(var(--translate-x, 0px) - 50%), 1px / var(--pixel-ratio, 1)), round(nearest, calc(var(--translate-y, 0px) - 50%), 1px / var(--pixel-ratio, 1)), 0);
    place-self: center;
  }
  .ui-orientbox .fixed {
    inset: var(--cs-inset-y, 0px) auto auto var(--cs-inset-x, 0px);
    position: fixed !important;
  }
  .ui-orientbox .absolute {
    inset: var(--cs-inset-y, 0px) auto auto var(--cs-inset-x, 0px);
    position: absolute !important;
  }
  .native-portrait-optimized {
    --in-swap-cond: 0;
  }
  @media (orientation: portrait) {
    .native-portrait-optimized {
      --in-swap-cond: 0;
    }
  }
  @media (orientation: landscape) {
    .native-portrait-optimized {
      --in-swap-cond: 1;
    }
  }
}
@property --item-size {
  syntax: "<length-percentage>";
  inherits: true;
  initial-value: 100%;
}
@layer layout {
  .ui-gridlayout {
    --os-layout-c: var(--layout-c, 4);
    --os-layout-r: var(--layout-r, 8);
    --cs-layout-c: --get-oriented-size-num(var(--orient, 0), var(--os-layout-c, 4), var(--os-layout-r, 8), 0);
    --cs-layout-r: --get-oriented-size-num(var(--orient, 0), var(--os-layout-c, 4), var(--os-layout-r, 8), 1);
  }
  .ui-gridlayout {
    --c-gap: clamp(min(1rem, 8cqmin), min(calc(8cqmin / min(var(--layout-c, 4), var(--layout-r, 8))), calc(6cqmax / max(var(--layout-c, 4), var(--layout-r, 8)))), min(4rem, 16cqmin));
    --r-gap: clamp(min(1rem, 8cqmin), min(calc(8cqmin / min(var(--layout-c, 4), var(--layout-r, 8))), calc(6cqmax / max(var(--layout-c, 4), var(--layout-r, 8)))), min(4rem, 16cqmin));
    --sd-inherit-layout-c: var(--layout-c, 4);
    --sd-inherit-layout-r: var(--layout-r, 8);
    --sd-inherit-cs-layout-c: var(--cs-layout-c, var(--layout-c, 4));
    --sd-inherit-cs-layout-r: var(--cs-layout-r, var(--layout-r, 8));
  }
  .ui-gridlayout {
    display: block grid !important;
    position: relative !important;
    container-name: u2-grid;
    zoom: 1;
    direction: ltr;
    pointer-events: none !important;
    background-color: transparent;
    inline-size: stretch;
    block-size: stretch;
    container-type: normal !important;
    overflow: visible !important;
    contain: none !important;
    padding: 0px !important;
    gap: 0px !important;
    max-inline-size: min(100%, min(100cqi, 100dvi)) !important;
    max-block-size: min(100%, min(100cqb, 100dvb)) !important;
    box-sizing: border-box !important;
    grid-template-columns: repeat(round(nearest, var(--cs-layout-c, 4), 1), minmax(0px, 1fr)) !important;
    grid-template-rows: repeat(round(nearest, var(--cs-layout-r, 8), 1), minmax(0px, 1fr)) !important;
    /*justify-content: safe start !important;
    align-content: safe start !important;
    justify-items: safe start !important;
    align-items: safe start !important;*/
    place-content: center !important;
    place-items: center !important;
    text-align: center !important;
    grid-row: 1/-1;
    grid-column: 1/-1;
  }
  .ui-gridlayout {
    /* WHY: Exclude launcher label captions (\`[data-layer="labels"]\`) — \`aspect-ratio: 1/1\` on \`span\` mis-sizes ellipsis pills. */
  }
  .ui-gridlayout .ui-ws-item:not([data-layer=labels]) span:not(.ui-ws-item-caption) {
    pointer-events: none;
    aspect-ratio: 1/1;
    inline-size: fit-content;
    block-size: fit-content;
    display: inline;
  }
  .ui-gridlayout .ui-ws-item {
    cursor: pointer;
    user-select: none;
    pointer-events: auto;
  }
  .ui-gridlayout .ui-ws-item:active, .ui-gridlayout .ui-ws-item:has(:active) {
    will-change: inset, translate, transform, opacity, z-index;
    cursor: grabbing;
  }
  .ui-gridlayout > :where(*) {
    /* WHY: \`v2-coord-num\` maps logical \`--cell-x\`/\`--cell-y\` into physical \`cs-grid-*\` using \`--orient\` from the launcher / \`ui-orientbox\` host; without inherit, items see initial \`0\` and placement ignores rotation. */
  }
  .ui-gridlayout > :where(*) {
    --orient: inherit;
  }
  .ui-gridlayout > :where(*) {
    --cs-sw-unit-x: calc(var(--cs-size-x, 100cqi) / var(--cs-layout-c, 1));
    --cs-sw-unit-y: calc(var(--cs-size-y, 100cqb) / var(--cs-layout-r, 1));
  }
  .ui-gridlayout > :where(*) {
    --cs-transition-c: 0px;
    --cs-transition-r: 0px;
  }
  .ui-gridlayout > :where(*)[data-dragging] {
    --cs-transition-c: calc((var(--rv-grid-c, 0) - var(--cs-grid-c, 0)) * var(--cs-sw-unit-x, 1px));
    --cs-transition-r: calc((var(--rv-grid-r, 0) - var(--cs-grid-r, 0)) * var(--cs-sw-unit-y, 1px));
  }
  .ui-gridlayout > :where(*) {
    --p-cell-x: var(--cell-x);
    --p-cell-y: var(--cell-y);
    --f-col: clamp(1, var(--layout-c, 4), 16);
    --f-row: clamp(1, var(--layout-r, 8), 16);
    --grid-c: clamp(0, var(--cell-x), var(--f-col) - 1);
    --grid-r: clamp(0, var(--cell-y), var(--f-row) - 1);
    --p-grid-c: clamp(0, var(--p-cell-x), var(--f-col) - 1);
    --p-grid-r: clamp(0, var(--p-cell-y), var(--f-row) - 1);
    --fc-cell-x: clamp(0, var(--cs-grid-c, 0), var(--f-col) - 1);
    --fc-cell-y: clamp(0, var(--cs-grid-r, 0), var(--f-row) - 1);
    --fp-cell-x: clamp(0, var(--cs-p-grid-c, 0), var(--f-col) - 1);
    --fp-cell-y: clamp(0, var(--cs-p-grid-r, 0), var(--f-row) - 1);
    --dir-x: calc(var(--cs-grid-c, 0) - var(--cs-p-grid-c, 0));
    --dir-y: calc(var(--cs-grid-r, 0) - var(--cs-p-grid-r, 0));
  }
  .ui-gridlayout > :where(*) {
    --rv-grid-c: var(--cs-grid-c, 1);
    --rv-grid-r: var(--cs-grid-r, 1);
  }
  .ui-gridlayout > :where(*)[data-dragging] {
    --rv-grid-c: var(--cs-p-grid-c, 1);
    --rv-grid-r: var(--cs-p-grid-r, 1);
  }
  .ui-gridlayout > :where(*) {
    --os-grid-c: var(--grid-c, 1);
    --os-grid-r: var(--grid-r, 1);
    --cs-grid-c: --get-oriented-coord-num(var(--orient, 0), var(--os-grid-c, 1), var(--os-grid-r, 1), calc(var(--f-col, 1) - 1), calc(var(--f-row, 1) - 1), 0);
    --cs-grid-r: --get-oriented-coord-num(var(--orient, 0), var(--os-grid-c, 1), var(--os-grid-r, 1), calc(var(--f-col, 1) - 1), calc(var(--f-row, 1) - 1), 1);
  }
  .ui-gridlayout > :where(*) {
    --os-p-grid-c: var(--p-cell-x, 0);
    --os-p-grid-r: var(--p-cell-y, 0);
    --cs-p-grid-c: --get-oriented-coord-num(var(--orient, 0), var(--os-p-grid-c, 0), var(--os-p-grid-r, 0), calc(var(--f-col, 1) - 1), calc(var(--f-row, 1) - 1), 0);
    --cs-p-grid-r: --get-oriented-coord-num(var(--orient, 0), var(--os-p-grid-c, 0), var(--os-p-grid-r, 0), calc(var(--f-col, 1) - 1), calc(var(--f-row, 1) - 1), 1);
  }
  .ui-gridlayout > :where(*) {
    --ox-c-unit: calc(var(--os-size-x, 100cqi) / var(--os-layout-c, 1));
    --ox-r-unit: calc(var(--os-size-y, 100cqb) / var(--os-layout-r, 1));
    --os-inset-x: calc((var(--grid-c, 1) + 0.5) * var(--ox-c-unit, 1px));
    --os-inset-y: calc((var(--grid-r, 1) + 0.5) * var(--ox-r-unit, 1px));
  }
  .ui-gridlayout > :where(*) {
    --f-col: clamp(1, var(--sd-inherit-layout-c, var(--layout-c, 4)), 16);
    --f-row: clamp(1, var(--sd-inherit-layout-r, var(--layout-r, 8)), 16);
  }
  .ui-gridlayout > :where(*) {
    --item-size: clamp(4rem, calc(100cqmax / min(var(--sd-inherit-cs-layout-c, var(--cs-layout-c, 4)), var(--sd-inherit-cs-layout-r, var(--cs-layout-r, 8)))), 5rem);
  }
  .ui-gridlayout > :where(*) :where(*) {
    --drag-x: 0;
    --drag-y: 0;
  }
  .ui-gridlayout > :where(*) {
    --drag-x: 0;
    --cs-drag-x: calc(var(--drag-x, 0) * 1px);
    --drag-y: 0;
    --cs-drag-y: calc(var(--drag-y, 0) * 1px);
  }
  .ui-gridlayout > :where(*):active, .ui-gridlayout > :where(*):has(:active), .ui-gridlayout > :where(*) *:active {
    will-change: transform;
  }
  .ui-gridlayout > :where(*) {
    grid-column: clamp(1, 1 + round(nearest, var(--cs-grid-c, 0), 1), var(--sd-inherit-cs-layout-c, var(--cs-layout-c, 4))) !important;
    grid-row: clamp(1, 1 + round(nearest, var(--cs-grid-r, 0), 1), var(--sd-inherit-cs-layout-r, var(--cs-layout-r, 8))) !important;
    cursor: pointer;
    position: relative !important;
    z-index: 1;
    transform-origin: 50% 50% !important;
    transform: translate3d(round(nearest, var(--cs-drag-x, 0px) + var(--cs-transition-c, 0px), 1px / var(--pixel-ratio, 1)), round(nearest, var(--cs-drag-y, 0px) + var(--cs-transition-r, 0px), 1px / var(--pixel-ratio, 1)), 0px) scale3d(var(--scale, 1), var(--scale, 1), var(--scale, 1)) translate3d(round(nearest, var(--translate-x, 0px), 1px / var(--pixel-ratio, 1)), round(nearest, var(--translate-y, 0px), 1px / var(--pixel-ratio, 1)), 0px) !important;
    translate: 0px 0px 0px !important;
    inset: auto !important;
    visibility: visible;
    zoom: 1;
    place-self: center !important;
    min-inline-size: fit-content;
    min-block-size: fit-content;
    inline-size: var(--item-size, stretch);
    block-size: var(--item-size, stretch);
    max-inline-size: var(--item-size, stretch);
    max-block-size: var(--item-size, stretch);
    pointer-events: none;
    touch-action: none;
    user-select: none;
    -webkit-user-drag: none;
    -moz-user-drag: none;
    overflow: visible;
    contain: none;
    isolation: isolate;
    border: none 0px transparent;
    outline: none 0px transparent;
  }
  .ui-gridlayout > :where(*), .ui-gridlayout > :where(*) > *, .ui-gridlayout > :where(*) span {
    --drag-distance: clamp(0, hypot(var(--dir-x, 0), var(--dir-y, 0)), 6);
    --drag-duration: clamp(96ms, calc(var(--drag-distance, 0) * 110ms + 70ms), 360ms);
    transition-behavior: allow-discrete;
    transition-property: opacity, background-color, color;
    transition-duration: var(--drag-duration);
    transition-timing-function: cubic-bezier(0.22, 0.8, 0.3, 1);
    transition-delay: 0ms;
    background-image: none;
    pointer-events: none;
    border: none 0px transparent;
    outline: none 0px transparent;
    box-shadow: none;
    touch-action: none;
    filter: none;
  }
  .ui-gridlayout > :where(*) {
    pointer-events: auto;
  }
  .ui-gridlayout > :where(*) span, .ui-gridlayout > :where(*).span, .ui-gridlayout > :where(*) ui-icon, .ui-gridlayout > :where(*).ui-icon, .ui-gridlayout > :where(*) label, .ui-gridlayout > :where(*).label {
    pointer-events: none;
  }
  .ui-gridlayout > :where(*) ui-icon {
    pointer-events: none;
  }
  @media (prefers-reduced-motion: reduce) {
    .ui-gridlayout > :where(*) {
      transition-duration: 0ms;
      transition-timing-function: linear;
    }
  }
  .ui-gridlayout > :where(*) > :where(*) {
    inline-size: stretch;
    block-size: stretch;
    max-inline-size: stretch;
    max-block-size: stretch;
    min-inline-size: 1px;
    min-block-size: 1px;
    grid-column: 1/-1;
    grid-row: 1/-1;
  }
  .ui-gridlayout.sd-grid--labels, .ui-gridlayout[data-layer=labels] {
    pointer-events: none !important;
    isolation: isolate;
    mix-blend-mode: normal;
  }
  .ui-gridlayout.sd-grid--labels > :where(*), .ui-gridlayout[data-layer=labels] > :where(*) {
    pointer-events: none;
  }
  .ui-gridlayout.sd-grid--labels > :where(.ui-ws-item-label), .ui-gridlayout[data-layer=labels] > :where(.ui-ws-item-label) {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    gap: clamp(0.1rem, 0.35cqmin, 0.35rem);
    inline-size: 100%;
    block-size: stretch;
    padding-block-start: clamp(0.25rem, 0.65cqmin, 0.65rem);
    color: color-mix(in oklch, var(--on-surface-color) 78%, transparent 22%);
    font-size: clamp(0.65rem, 1.35cqmin, 1rem);
    font-weight: 500;
    text-align: center;
    text-wrap: balance;
    letter-spacing: 0.015em;
    text-shadow: 0 1px 2px color-mix(in oklch, var(--surface-color) 35%, transparent), 0 0 0.35rem color-mix(in oklch, var(--surface-color) 15%, transparent);
    translate: 0 calc(clamp(0.25rem, 0.65cqmin, 0.65rem) + var(--cs-sw-unit-y, 0px));
  }
  .ui-gridlayout.sd-grid--labels > :where(.ui-ws-item-label) span, .ui-gridlayout[data-layer=labels] > :where(.ui-ws-item-label) span {
    pointer-events: none;
    user-select: none;
    max-inline-size: min(8ch, 100%);
    opacity: 0.9;
    contain: layout paint;
    content-visibility: auto;
    background-image: none;
  }
  .ui-gridlayout slot {
    isolation: auto !important;
    display: contents !important;
    overflow: visible !important;
    contain: none !important;
  }
  .ui-gridlayout ::slotted(*) {
    direction: inherit;
    writing-mode: inherit;
  }
}
@layer components {
  .ui-launcher-grid, .ui-speed-dial-grid {
    --os-layout-c: var(--layout-c, 4);
    --os-layout-r: var(--layout-r, 8);
    --cs-layout-c: --get-oriented-size-num(var(--orient, 0), var(--os-layout-c, 4), var(--os-layout-r, 8), 0);
    --cs-layout-r: --get-oriented-size-num(var(--orient, 0), var(--os-layout-c, 4), var(--os-layout-r, 8), 1);
  }
  .ui-launcher-grid, .ui-speed-dial-grid {
    display: grid;
    position: relative;
    container-type: size;
    box-sizing: border-box;
    inline-size: stretch;
    block-size: stretch;
    min-inline-size: 0px;
    min-block-size: 0px;
    pointer-events: none;
    gap: 0;
    place-content: center;
    place-items: center;
    --layout-c: 4;
    --layout-r: 8;
    --sd-inherit-layout-c: var(--layout-c, 4);
    --sd-inherit-layout-r: var(--layout-r, 8);
    --sd-inherit-cs-layout-c: var(--cs-layout-c, var(--layout-c, 4));
    --sd-inherit-cs-layout-r: var(--cs-layout-r, var(--layout-r, 8));
    grid-template-columns: repeat(var(--cs-layout-c, 4), minmax(0px, 1fr));
    grid-template-rows: repeat(var(--cs-layout-r, 8), minmax(0px, 1fr));
  }
  .ui-launcher-grid > :where(.ui-ws-item, [data-launcher-item]), .ui-speed-dial-grid > :where(.ui-ws-item, [data-launcher-item]) {
    /* WHY: \`v2-coord-num\` maps logical \`--cell-x\`/\`--cell-y\` into physical \`cs-grid-*\` using \`--orient\` from the launcher / \`ui-orientbox\` host; without inherit, items see initial \`0\` and placement ignores rotation. */
  }
  .ui-launcher-grid > :where(.ui-ws-item, [data-launcher-item]), .ui-speed-dial-grid > :where(.ui-ws-item, [data-launcher-item]) {
    --orient: inherit;
  }
  .ui-launcher-grid > :where(.ui-ws-item, [data-launcher-item]), .ui-speed-dial-grid > :where(.ui-ws-item, [data-launcher-item]) {
    --cs-sw-unit-x: calc(var(--cs-size-x, 100cqi) / var(--cs-layout-c, 1));
    --cs-sw-unit-y: calc(var(--cs-size-y, 100cqb) / var(--cs-layout-r, 1));
  }
  .ui-launcher-grid > :where(.ui-ws-item, [data-launcher-item]), .ui-speed-dial-grid > :where(.ui-ws-item, [data-launcher-item]) {
    --cs-transition-c: 0px;
    --cs-transition-r: 0px;
  }
  .ui-launcher-grid > :where(.ui-ws-item, [data-launcher-item])[data-dragging], .ui-speed-dial-grid > :where(.ui-ws-item, [data-launcher-item])[data-dragging] {
    --cs-transition-c: calc((var(--rv-grid-c, 0) - var(--cs-grid-c, 0)) * var(--cs-sw-unit-x, 1px));
    --cs-transition-r: calc((var(--rv-grid-r, 0) - var(--cs-grid-r, 0)) * var(--cs-sw-unit-y, 1px));
  }
  .ui-launcher-grid > :where(.ui-ws-item, [data-launcher-item]), .ui-speed-dial-grid > :where(.ui-ws-item, [data-launcher-item]) {
    --p-cell-x: var(--cell-x);
    --p-cell-y: var(--cell-y);
    --f-col: clamp(1, var(--layout-c, 4), 16);
    --f-row: clamp(1, var(--layout-r, 8), 16);
    --grid-c: clamp(0, var(--cell-x), var(--f-col) - 1);
    --grid-r: clamp(0, var(--cell-y), var(--f-row) - 1);
    --p-grid-c: clamp(0, var(--p-cell-x), var(--f-col) - 1);
    --p-grid-r: clamp(0, var(--p-cell-y), var(--f-row) - 1);
    --fc-cell-x: clamp(0, var(--cs-grid-c, 0), var(--f-col) - 1);
    --fc-cell-y: clamp(0, var(--cs-grid-r, 0), var(--f-row) - 1);
    --fp-cell-x: clamp(0, var(--cs-p-grid-c, 0), var(--f-col) - 1);
    --fp-cell-y: clamp(0, var(--cs-p-grid-r, 0), var(--f-row) - 1);
    --dir-x: calc(var(--cs-grid-c, 0) - var(--cs-p-grid-c, 0));
    --dir-y: calc(var(--cs-grid-r, 0) - var(--cs-p-grid-r, 0));
  }
  .ui-launcher-grid > :where(.ui-ws-item, [data-launcher-item]), .ui-speed-dial-grid > :where(.ui-ws-item, [data-launcher-item]) {
    --rv-grid-c: var(--cs-grid-c, 1);
    --rv-grid-r: var(--cs-grid-r, 1);
  }
  .ui-launcher-grid > :where(.ui-ws-item, [data-launcher-item])[data-dragging], .ui-speed-dial-grid > :where(.ui-ws-item, [data-launcher-item])[data-dragging] {
    --rv-grid-c: var(--cs-p-grid-c, 1);
    --rv-grid-r: var(--cs-p-grid-r, 1);
  }
  .ui-launcher-grid > :where(.ui-ws-item, [data-launcher-item]), .ui-speed-dial-grid > :where(.ui-ws-item, [data-launcher-item]) {
    --os-grid-c: var(--grid-c, 1);
    --os-grid-r: var(--grid-r, 1);
    --cs-grid-c: --get-oriented-coord-num(var(--orient, 0), var(--os-grid-c, 1), var(--os-grid-r, 1), calc(var(--f-col, 1) - 1), calc(var(--f-row, 1) - 1), 0);
    --cs-grid-r: --get-oriented-coord-num(var(--orient, 0), var(--os-grid-c, 1), var(--os-grid-r, 1), calc(var(--f-col, 1) - 1), calc(var(--f-row, 1) - 1), 1);
  }
  .ui-launcher-grid > :where(.ui-ws-item, [data-launcher-item]), .ui-speed-dial-grid > :where(.ui-ws-item, [data-launcher-item]) {
    --os-p-grid-c: var(--p-cell-x, 0);
    --os-p-grid-r: var(--p-cell-y, 0);
    --cs-p-grid-c: --get-oriented-coord-num(var(--orient, 0), var(--os-p-grid-c, 0), var(--os-p-grid-r, 0), calc(var(--f-col, 1) - 1), calc(var(--f-row, 1) - 1), 0);
    --cs-p-grid-r: --get-oriented-coord-num(var(--orient, 0), var(--os-p-grid-c, 0), var(--os-p-grid-r, 0), calc(var(--f-col, 1) - 1), calc(var(--f-row, 1) - 1), 1);
  }
  .ui-launcher-grid > :where(.ui-ws-item, [data-launcher-item]), .ui-speed-dial-grid > :where(.ui-ws-item, [data-launcher-item]) {
    --ox-c-unit: calc(var(--os-size-x, 100cqi) / var(--os-layout-c, 1));
    --ox-r-unit: calc(var(--os-size-y, 100cqb) / var(--os-layout-r, 1));
    --os-inset-x: calc((var(--grid-c, 1) + 0.5) * var(--ox-c-unit, 1px));
    --os-inset-y: calc((var(--grid-r, 1) + 0.5) * var(--ox-r-unit, 1px));
  }
  .ui-launcher-grid > :where(.ui-ws-item, [data-launcher-item]), .ui-speed-dial-grid > :where(.ui-ws-item, [data-launcher-item]) {
    --f-col: clamp(1, var(--sd-inherit-layout-c, var(--layout-c, 4)), 16);
    --f-row: clamp(1, var(--sd-inherit-layout-r, var(--layout-r, 8)), 16);
    pointer-events: auto;
  }
}
/*
 * MAP:modules/projects/veela.css/src/scss/basic/_shared.scss
 */
/**
 * Veela CSS - Core Shared Utilities
 *
 * Reusable mixins, placeholders, and common patterns for core layout styles.
 * Reduces duplication across normalize, states, layout, and gridbox modules.
 */
/* ========================================================================
   Meta-level: Placeholders for zero-specificity selector groups
   ======================================================================== */
/**
 * Reset border and outline styles (transparent, none, 0px)
 * Use: @extend %reset-borders; or include in selectors
 */
/**
 * Disable user interaction (pointer-events, touch-action, user-select)
 * Use: @extend %disable-interaction;
 */
/**
 * Lock interaction (pointer-events: none + touch + select disabled)
 * Stronger version with explicit !important for state overrides
 */
/**
 * Basic box-model reset: margin, padding, box-sizing
 */
/* ========================================================================
   Mixins: Common property/style groups
   ======================================================================== */
/**
 * Reset box model (margin, padding, sizing)
 * @usage: @include reset-box-model();
 */
/**
 * Reset borders and outlines
 * @usage: @include reset-borders();
 */
/**
 * Disable interaction via pointer-events, touch-action, user-select
 * @param $importance [false] - if true, use !important
 * @usage: @include disable-interaction(); or @include disable-interaction(true);
 */
/**
 * Reset form element appearance (font, line-height, margin, text-transform)
 * @usage: @include reset-form-appearance();
 */
/**
 * Scrollbar styling for webkit browsers
 * @param $size [8px] - scrollbar width/height
 * @param $color [var(--color-scrollbar, currentColor)] - thumb color
 * @param $radius [var(--border-radius, 4px)] - thumb border-radius
 * @usage: @include scrollbar-webkit(8px, var(--color-scrollbar));
 */
/**
 * Scrollbar styling (both webkit and Firefox)
 * @param $color [var(--color-scrollbar, currentColor)] - scrollbar color
 * @usage: @include scrollbar-styling(var(--color-scrollbar));
 */
/**
 * Flex row layout with space-between and wrap
 * Used for nav-like layouts
 * @usage: @include flex-row-wrap();
 */
/**
 * Flex column centered (used for labels, stacked content)
 * @usage: @include flex-column-center();
 */
/**
 * Stretch to viewport size (used for root/body containers)
 * Combines inline-size, block-size with min/max constraints
 * @usage: @include stretch-viewport();
 */
/**
 * Hidden state: display none + pointer/touch disabled
 * @param $opacity [false] - if true, also apply opacity: 0
 * @usage: @include hidden-state(); or @include hidden-state(true);
 */
/**
 * Prevent dragging of element
 * @usage: @include no-drag();
 */
/**
 * Focus ring without outline (M3-style)
 * @param $color [var(--color-primary, #5a7fff)] - focus color
 * @param $radius [var(--radius-sm)] - border radius
 * @usage: @include focus-ring(var(--color-primary));
 */
/**
 * Media element sizing (img, video, canvas, svg)
 * @usage: @include media-sizing();
 */
/**
 * Code element font and sizing
 * @param $font [var(--font-family-mono, 'SF Mono', 'Monaco', 'Roboto Mono', monospace)] - monospace font
 * @usage: @include code-styling();
 */
/*
 * MAP:modules/projects/veela.css/src/scss/basic/_states.scss
 */
@layer base {
  *[data-hidden]:not([data-hidden=false]):not([data-opacity-animation]), *[data-hidden]:not([data-hidden=false]):not([data-opacity-animation]) * {
    display: none !important;
    pointer-events: none !important;
    touch-action: none !important;
    content-visibility: auto !important;
  }
  :host([data-hidden]:not([data-hidden=false]:not([data-opacity-animation]))), :host([data-hidden]:not([data-hidden=false]:not([data-opacity-animation]))) *, :host([data-hidden]:not([data-hidden=false]:not([data-opacity-animation]))) ::slotted(*) {
    display: none !important;
    pointer-events: none !important;
    touch-action: none !important;
    content-visibility: auto !important;
  }
  :host([data-hidden]:not([data-hidden=false])), :host([data-hidden]:not([data-hidden=false])) *, :host([data-hidden]:not([data-hidden=false])) ::slotted(*) {
    pointer-events: none !important;
    touch-action: none !important;
  }
  *[data-hidden]:not([data-hidden=false]), *[data-hidden]:not([data-hidden=false]) * {
    pointer-events: none !important;
    touch-action: none !important;
  }
  *[data-hidden]:not([data-hidden=false]):not([data-opacity-animation]), *[data-hidden]:not([data-hidden=false]):not([data-opacity-animation]) * {
    display: none !important;
    pointer-events: none !important;
    touch-action: none !important;
    opacity: 0;
    visibility: collapse;
  }
  :host([data-hidden]:not([data-hidden=false]:not([data-opacity-animation]))), :host([data-hidden]:not([data-hidden=false]:not([data-opacity-animation]))) *, :host([data-hidden]:not([data-hidden=false]:not([data-opacity-animation]))) ::slotted(*) {
    display: none !important;
    pointer-events: none !important;
    touch-action: none !important;
    opacity: 0;
    visibility: collapse;
  }
  :host([data-hidden]:not([data-hidden=false])), :host([data-hidden]:not([data-hidden=false])) *, :host([data-hidden]:not([data-hidden=false])) ::slotted(*) {
    pointer-events: none !important;
    touch-action: none !important;
    user-select: none !important;
  }
  *[data-hidden]:not([data-hidden=false]), *[data-hidden]:not([data-hidden=false]) * {
    pointer-events: none !important;
    touch-action: none !important;
    user-select: none !important;
  }
  *[data-hidden]:not([data-hidden=false]):not([data-opacity-animation]), *[data-hidden]:not([data-hidden=false]):not([data-opacity-animation]) * {
    display: none !important;
    pointer-events: none !important;
    touch-action: none !important;
    content-visibility: auto !important;
  }
  :host([data-hidden]:not([data-hidden=false]:not([data-opacity-animation]))), :host([data-hidden]:not([data-hidden=false]:not([data-opacity-animation]))) *, :host([data-hidden]:not([data-hidden=false]:not([data-opacity-animation]))) ::slotted(*) {
    display: none !important;
    pointer-events: none !important;
    touch-action: none !important;
    content-visibility: auto !important;
  }
  :host([data-hidden]:not([data-hidden=false])), :host([data-hidden]:not([data-hidden=false])) *, :host([data-hidden]:not([data-hidden=false])) ::slotted(*) {
    pointer-events: none !important;
    touch-action: none !important;
  }
  *[data-hidden]:not([data-hidden=false]), *[data-hidden]:not([data-hidden=false]) * {
    pointer-events: none !important;
    touch-action: none !important;
  }
}
@layer base {
  *[data-hidden]:not([data-hidden=false]):not([data-opacity-animation]), *[data-hidden]:not([data-hidden=false]):not([data-opacity-animation]) * {
    display: none !important;
    pointer-events: none !important;
    touch-action: none !important;
    opacity: 0;
    visibility: collapse;
  }
  :host([data-hidden]:not([data-hidden=false]:not([data-opacity-animation]))), :host([data-hidden]:not([data-hidden=false]:not([data-opacity-animation]))) *, :host([data-hidden]:not([data-hidden=false]:not([data-opacity-animation]))) ::slotted(*) {
    display: none !important;
    pointer-events: none !important;
    touch-action: none !important;
    opacity: 0;
    visibility: collapse;
  }
  :host([data-hidden]:not([data-hidden=false])), :host([data-hidden]:not([data-hidden=false])) *, :host([data-hidden]:not([data-hidden=false])) ::slotted(*) {
    pointer-events: none !important;
    touch-action: none !important;
    user-select: none !important;
  }
  *[data-hidden]:not([data-hidden=false]), *[data-hidden]:not([data-hidden=false]) * {
    pointer-events: none !important;
    touch-action: none !important;
    user-select: none !important;
  }
}
/*
 * MAP:modules/projects/veela.css/src/scss/basic/_normalize.scss
 * WHY: canonical UI source resolves the flattened base entry directly.
 */
/*
 * Filename: _normalize.scss
 * FullPath: modules/projects/veela.css/src/scss/basic/_normalize.scss
 * Change date and time: 16.25.00_31.07.2026
 * Reason for changes: Basic consumes the canonical core token emitter.
 */
/*
 * Filename: _tokens.scss
 * FullPath: modules/projects/veela.css/src/scss/core/_tokens.scss
 * Change date and time: 22.30.00_22.08.2026
 * Reason for changes: Light/dark primary-container so Start plates and chrome ink flip.
 */
/*
 * INVARIANT: This is the canonical color-token registry for the full veela bundle.
 * All color token DEFAULTS live here on \`:root, :host, :scope\`.
 * - The core entry-point owns every default; basic and theme modules consume it.
 * - Component/shell/view styles may only provide scoped semantic aliases.
 * - Component/shell/view files keep only context overrides and shadow-DOM
 *   \`var(--token, light-dark(...))\` fallbacks; they never redefine a canonical default.
 */
/*
 * Filename: _color-properties.scss
 * FullPath: modules/projects/veela.css/src/scss/core/_color-properties.scss
 * Change date and time: 15.50.00_22.08.2026
 * Reason for changes: Seed initial-value is the desktop cyan-blue fallback (#5a9ec8).
 */
/*
 * INVARIANT: Do NOT register \`--color-surface\` / \`--color-on-surface\` / etc. as \`@property <color>\`.
 * WHY: Typed colors compute \`light-dark()\` on the defining element (:root) and inherit a *concrete*
 * color. Children that lock \`color-scheme: light\` then get cream surfaces (local light-dark) but
 * keep light-on-dark text from the inherited computed token — Settings Appearance labels vanish.
 *
 * Seeds only: WallpaperTheme / Quick Settings write these (plus \`--wallpaper-*\` paper/ink);
 * surfaces derive via unregistered \`light-dark(--u2-color-mod(...))\` in \`_tokens.scss\`
 * and re-evaluate per used color-scheme.
 */
@property --color-primary {
  syntax: "<color>";
  inherits: true;
  initial-value: #5a9ec8;
}
@property --base-color {
  syntax: "<color>";
  inherits: true;
  initial-value: #5a9ec8;
}
@property --wallpaper-underlying-color {
  syntax: "<color>";
  inherits: true;
  initial-value: #16161a;
}
@property --wallpaper-contrast-color {
  syntax: "<color>";
  inherits: true;
  initial-value: #f7f7f8;
}
@property --color-secondary {
  syntax: "<color>";
  inherits: true;
  initial-value: #6b8cff;
}
@property --color-tertiary {
  syntax: "<color>";
  inherits: true;
  initial-value: #8aa0ff;
}
@property --color-error {
  syntax: "<color>";
  inherits: true;
  initial-value: #ef4444;
}
@property --color-success {
  syntax: "<color>";
  inherits: true;
  initial-value: #4caf50;
}
@property --color-warning {
  syntax: "<color>";
  inherits: true;
  initial-value: #ff9800;
}
@property --color-info {
  syntax: "<color>";
  inherits: true;
  initial-value: #2196f3;
}
/*
 * Filename: _color-mod.scss
 * FullPath: modules/projects/veela.css/src/scss/core/_color-mod.scss
 * Reason for changes: Single source for the custom color modulation function.
 */
@function --u2-color-mod(--base-color <color>, --index <number> : 550) returns <color> {
  --i: clamp(0, var(--index), 1000);
  --pivot: 550;
  --white-distance: clamp(0, calc((var(--pivot) - var(--i)) / var(--pivot)), 1);
  --black-distance: clamp(0, calc((var(--i) - var(--pivot)) / (1000 - var(--pivot))), 1);
  --to-white: pow(var(--white-distance), 1.15);
  --to-black: pow(var(--black-distance), 1.08);
  --center-left: clamp(0, calc(var(--i) / var(--pivot)), 1);
  --center-right: clamp(0, calc((1000 - var(--i)) / (1000 - var(--pivot))), 1);
  --chroma-shape: sqrt(min(var(--center-left), var(--center-right)));
  --chroma-scale: calc(0.08 + 0.92 * var(--chroma-shape));
  result: oklch(from var(--base-color) calc(l + (0.985 - l) * var(--to-white) + (0.16 - l) * var(--to-black)) calc(c * var(--chroma-scale)) h);
}
/*
 * Filename: _layers.scss
 * FullPath: modules/projects/veela.css/src/scss/_layers.scss
 * FIND:veela-layers
 * TAG:veela,style-lib
 * Reason for changes: One cascade-order registry; include view-transitions before overrides.
 */
/*
 * INVARIANT: this is the compiled-SCSS cascade-order prelude. Component, view,
 * and shell sheets join one of these layers instead of declaring local preludes.
 * JS wrap/unwrap/order lives in \`@fest-lib/style-lib\` \`layers.ts\` (\`VEELA_CASCADE_LAYERS\`).
 */
@layer tokens, base, layout, components, utilities, theme, overrides, print;
/* ==========================================================================
    Meta / Declarations
   ========================================================================== */
/* ==========================================================================
    Tokens / Mixins (global, not layered)
   ========================================================================== */
/*
 * WHY: Pinned themes use *concrete* mod indices — not \`light-dark()\`.
 * \`light-dark()\` + mixed color-scheme (OS vs app, shadow hosts, typed @property) caused
 * Light QS tile with dark surfaces / cream panels with light-on-light labels.
 * Index scale: 0 white ← 550 seed → 1000 black. Seeds stay writable by WallpaperTheme.
 */
/** Light surfaces — always light chrome; hue from --base-color / wallpaper. */
/** Dark surfaces — always dark chrome; hue from --base-color / wallpaper. */
@layer tokens {
  :root,
  :host,
  :scope {
    /* Box seed; WallpaperTheme may override --color-primary on :root. */
    --color-primary: #5a9ec8;
    color-scheme: light dark;
    /* Default = light concrete; OS-dark media + data-theme pins override below. */
    --base-color: var(--color-primary);
    --base-color-neutralized: color-mix(in oklab, var(--base-color) 60%, gray);
    /* WHY: CSS fallback only — WallpaperTheme inline hex wins for photo paper/ink. */
    --wallpaper-underlying-color: --u2-color-mod(var(--base-color-neutralized), 940);
    --wallpaper-contrast-color: --u2-color-mod(var(--base-color-neutralized), 70);
    --wf-md-primary: var(--color-primary);
    --wf-md-seed: var(--base-color);
    --color-on-primary: --u2-color-mod(var(--base-color), 40);
    --color-secondary: --u2-color-mod(var(--base-color), 420);
    --color-on-secondary: --u2-color-mod(var(--base-color), 40);
    --color-tertiary: --u2-color-mod(var(--base-color), 400);
    --color-on-tertiary: --u2-color-mod(var(--base-color), 40);
    --color-error: #ef4444;
    --color-on-error: --u2-color-mod(var(--color-error), 40);
    --color-success: #4caf50;
    --color-warning: #ff9800;
    --color-info: #2196f3;
    --color-background: --u2-color-mod(var(--base-color), 60);
    --color-on-background: --u2-color-mod(var(--base-color), 900);
    --color-surface: --u2-color-mod(var(--base-color), 60);
    --color-on-surface: --u2-color-mod(var(--base-color), 900);
    --color-surface-variant: --u2-color-mod(var(--base-color), 160);
    --color-on-surface-variant: --u2-color-mod(var(--base-color), 700);
    --color-outline: --u2-color-mod(var(--base-color), 300);
    --color-outline-variant: --u2-color-mod(var(--base-color), 400);
    --color-surface-container-lowest: --u2-color-mod(var(--base-color), 40);
    --color-surface-container-low: --u2-color-mod(var(--base-color), 30);
    --color-surface-container: --u2-color-mod(var(--base-color), 20);
    --color-surface-container-high: --u2-color-mod(var(--base-color), 5);
    --color-surface-container-highest: --u2-color-mod(var(--base-color), 2);
    /* WHY: Start/AppMenu plates used a dark 880 fallback when this token was missing. */
    --color-primary-container: --u2-color-mod(var(--base-color), 160);
    --color-on-primary-container: --u2-color-mod(var(--base-color), 900);
    --color-border: color-mix(in oklab, var(--color-outline-variant) 75%, transparent);
    --color-bg: var(--color-background);
    --color-text: var(--color-on-background);
    --color-fg: var(--color-on-surface);
    --on-surface-color: var(--color-on-surface);
    --surface-color: var(--color-surface);
    --fl-surface: var(--color-surface);
    --fl-on-surface: var(--color-on-surface);
    --fl-primary: var(--color-primary);
    --fl-on-primary: var(--color-on-primary);
    --fl-secondary: var(--color-secondary);
    --fl-on-secondary: var(--color-on-secondary);
    --fl-shadow-xl: var(--shadow-xl);
    --on-surface-variant: var(--color-on-surface-variant);
    --wf-md-surface: var(--color-surface);
    --wf-md-on-surface: var(--color-on-surface);
    --wf-md-on-surface-variant: var(--color-on-surface-variant);
    --wf-md-surf-container: var(--color-surface-container);
    --wf-md-surf-container-low: var(--color-surface-container-low);
    --wf-md-surf-container-high: var(--color-surface-container-high);
    --wf-md-outline-variant: var(--color-outline-variant);
    --md3-primary-container: var(--color-primary-container);
    --md-primary-container: var(--color-primary-container);
    --space-2xs: 0.125rem;
    --space-xs: 0.25rem;
    --space-sm: 0.5rem;
    --space-md: 0.75rem;
    --space-lg: 1rem;
    --space-xl: 1.25rem;
    --space-2xl: 1.5rem;
    --padding-xs: var(--space-xs);
    --padding-sm: var(--space-sm);
    --padding-md: var(--space-md);
    --padding-lg: var(--space-lg);
    --padding-xl: var(--space-xl);
    --padding-2xl: var(--space-2xl);
    --padding-3xl: 2rem;
    --padding-4xl: 2.5rem;
    --padding-5xl: 3rem;
    --padding-6xl: 4rem;
    --padding-7xl: 5rem;
    --padding-8xl: 6rem;
    --padding-9xl: 8rem;
    --gap-xs: var(--space-xs);
    --gap-sm: var(--space-sm);
    --gap-md: var(--space-md);
    --gap-lg: var(--space-lg);
    --gap-xl: var(--space-xl);
    --gap-2xl: var(--space-2xl);
    --fl-ui-gap: var(--space-md);
    /*
     * Shape scale — M3 Expressive / Android 16–17 (dp≈rem at 16px).
     * extra-small 4, small 8, medium 12, large 16, extra-large 28, full pill.
     * \`--radius-sm\` stays 4dp so dense chrome does not jump.
     */
    --radius-none: 0;
    --radius-xs: 0.25rem;
    --radius-sm: 0.25rem;
    --radius-default: 0.25rem;
    --radius-md: 0.5rem;
    --radius-lg: 0.75rem;
    --radius-xl: 1rem;
    --radius-2xl: 1.75rem;
    --radius-3xl: 2rem;
    --radius-full: 9999px;
    --fl-ui-radius: var(--radius-md);
    --border-radius: var(--radius-md);
    --shape-extra-small: var(--radius-xs);
    --shape-small: var(--radius-md);
    --shape-medium: var(--radius-lg);
    --shape-large: var(--radius-xl);
    --shape-extra-large: var(--radius-2xl);
    --shape-full: var(--radius-full);
    --elev-0: none;
    --elev-1: 0 1px 1px rgba(0, 0, 0, 0.06), 0 1px 3px rgba(0, 0, 0, 0.1);
    --elev-2: 0 2px 6px rgba(0, 0, 0, 0.12), 0 8px 24px rgba(0, 0, 0, 0.08);
    --elev-3: 0 6px 16px rgba(0, 0, 0, 0.14), 0 18px 48px rgba(0, 0, 0, 0.1);
    --shadow-xs: 0 1px 2px rgba(0, 0, 0, 0.05);
    --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.1);
    --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
    --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
    --shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.1);
    --shadow-2xl: 0 25px 50px rgba(0, 0, 0, 0.1);
    --shadow-inset: inset 0 2px 4px rgba(0, 0, 0, 0.06);
    --shadow-inset-strong: inset 0 4px 8px rgba(0, 0, 0, 0.12);
    --shadow-none: 0 0 #0000;
    --text-xs: 0.8rem;
    --text-sm: 0.9rem;
    --text-base: 1rem;
    --text-lg: 1.1rem;
    --text-xl: 1.25rem;
    --text-2xl: 1.6rem;
    --text-3xl: 2rem;
    /* COMPAT: SCSS $font-* aliases and older sheets resolve these names. */
    --font-xs: var(--text-xs);
    --font-sm: var(--text-sm);
    --font-base: var(--text-base);
    --font-md: var(--text-base);
    --font-lg: var(--text-lg);
    --font-xl: var(--text-xl);
    --font-2xl: var(--text-2xl);
    /*
     * Component foundation tokens. Keep these namespaced at root scope;
     * \`ui-icon\` maps them to its internal \`--icon-*\` variables only on
     * the component host, so a window titlebar cannot resize its content.
     */
    --ui-icon-size: 1.25rem;
    --ui-icon-padding: 0px;
    --ui-icon-tile-padding: 0.45rem;
    --ui-window-icon-size: 0.95rem;
    --ui-explorer-icon-size: 1.5rem;
    --ui-explorer-icon-track: 2rem;
    --ui-explorer-action-icon-size: 1.15rem;
    --ui-explorer-row-height: 3.25rem;
    --icon-size-sm: var(--ui-icon-size);
    --icon-size-md: var(--ui-icon-size);
    --icon-size-lg: var(--ui-explorer-icon-size);
    --font-size-xs: 0.75rem;
    --font-size-sm: 0.875rem;
    --font-size-base: 1rem;
    --font-size-lg: 1.125rem;
    --font-size-xl: 1.25rem;
    --font-weight-normal: 400;
    --font-weight-medium: 500;
    --font-weight-semibold: 600;
    --font-weight-bold: 700;
    --font-family: "Roboto", ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif;
    --font-family-base: var(--font-family);
    --font-family-mono: "Roboto Mono", "SF Mono", Monaco, Inconsolata, "Fira Code", monospace;
    --font-sans: var(--font-family);
    --font-mono: var(--font-family-mono);
    --leading-tight: 1.2;
    --leading-normal: 1.5;
    --leading-relaxed: 1.8;
    --line-height: var(--leading-normal);
    --ease-emphasized: cubic-bezier(0.2, 0, 0, 1);
    --ease-expressive: cubic-bezier(0.34, 1.25, 0.64, 1);
    --duration-fast: 140ms;
    --duration-normal: 220ms;
    --duration-slow: 360ms;
    --transition-fast: var(--duration-fast) var(--ease-emphasized);
    --transition-normal: var(--duration-normal) var(--ease-emphasized);
    --transition-slow: var(--duration-slow) var(--ease-emphasized);
    --motion-fast: var(--transition-fast);
    --motion-normal: var(--transition-normal);
    --motion-slow: var(--transition-slow);
    --ease-out: cubic-bezier(0, 0, 0.2, 1);
    --ease-in: cubic-bezier(0.4, 0, 1, 1);
    --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
    --focus-ring: 0 0 0 3px color-mix(in oklab, var(--color-primary) 35%, transparent);
    --z-base: 0;
    --z-dropdown: 100;
    --z-sticky: 200;
    --z-fixed: 300;
    --z-modal-backdrop: 400;
    --z-modal: 500;
    --z-popover: 600;
    --z-tooltip: 700;
    --z-toast: 800;
    --z-max: 9999;
    --view-bg: var(--color-container);
    --view-fg: var(--color-on-surface);
    --view-border: var(--color-outline-variant);
    --view-input-bg: light-dark(
        --u2-color-mod(var(--base-color, var(--color-primary)), 40),
        var(--color-surface-container-high)
    );
    --view-files-bg: var(--color-surface-container-low);
    --view-file-bg: var(--color-surface-container-lowest, var(--color-surface-container-low));
    --view-results-bg: var(--color-surface-container-low);
    --view-result-bg: var(--color-surface-container-lowest, var(--color-surface-container-low));
    --color-surface-elevated: var(--color-surface-container);
    --color-surface-hover: var(--color-surface-container-low);
    --color-surface-active: var(--color-surface-container-high);
    --color-on-surface-muted: var(--color-on-surface-variant);
    --color-background-alt: var(--color-surface-variant);
    --color-primary-hover: light-dark(
        --u2-color-mod(var(--base-color, var(--color-primary)), 620),
        --u2-color-mod(var(--base-color, var(--color-primary)), 480)
    );
    --color-primary-active: light-dark(
        --u2-color-mod(var(--base-color, var(--color-primary)), 700),
        --u2-color-mod(var(--base-color, var(--color-primary)), 400)
    );
    --color-accent: var(--color-secondary);
    --color-accent-hover: light-dark(
        --u2-color-mod(var(--base-color, var(--color-primary)), 500),
        --u2-color-mod(var(--base-color, var(--color-primary)), 600)
    );
    --color-on-accent: var(--color-on-secondary);
    --color-border-hover: var(--color-outline-variant);
    --color-border-strong: var(--color-outline);
    --color-border-focus: var(--color-primary);
    --color-text: var(--color-on-surface);
    --color-text-secondary: var(--color-on-surface-variant);
    --color-text-muted: color-mix(in oklab, var(--color-on-surface) 50%, var(--color-surface));
    --color-text-disabled: color-mix(in oklab, var(--color-on-surface) 38%, var(--color-surface));
    --color-text-inverse: var(--color-on-primary);
    --color-link: var(--color-primary);
    --color-link-hover: var(--color-primary-hover);
    --color-success-light: --u2-color-mod(var(--color-success), 280);
    --color-success-dark: --u2-color-mod(var(--color-success), 720);
    --color-warning-light: --u2-color-mod(var(--color-warning), 280);
    --color-warning-dark: --u2-color-mod(var(--color-warning), 720);
    --color-error-light: --u2-color-mod(var(--color-error), 280);
    --color-error-dark: --u2-color-mod(var(--color-error), 720);
    --color-info-light: --u2-color-mod(var(--color-info), 280);
    --color-info-dark: --u2-color-mod(var(--color-info), 720);
    --color-bg: var(--color-surface, var(--color-surface));
    --color-bg-alt: var(--color-surface-variant, var(--color-surface-variant));
    --color-fg: var(--color-on-surface, var(--color-on-surface));
    --color-fg-muted: var(--color-on-surface-variant, var(--color-on-surface-variant));
    --touch-min: 3rem;
    --btn-height-sm: 2rem;
    --btn-height-md: var(--touch-min);
    --btn-height-lg: 3.5rem;
    --btn-padding-x-sm: var(--space-md);
    --btn-padding-x-md: var(--space-lg);
    --btn-padding-x-lg: 1.5rem;
    --btn-radius: var(--radius-md);
    --btn-font-weight: var(--font-weight-medium);
    --input-height-sm: 2rem;
    --input-height-md: var(--touch-min);
    --input-height-lg: 3.5rem;
    --state-opacity-hover: 0.08;
    --state-opacity-press: 0.12;
    --state-opacity-focus: 0.12;
    --state-opacity-disabled: 0.38;
    --state-opacity-drag: 0.16;
    --input-padding-x: var(--space-md);
    --input-radius: var(--radius-md);
    --input-border-color: var(--color-border, var(--color-border));
    --input-focus-ring-color: var(--color-primary);
    --input-focus-ring-width: 2px;
    --card-padding: var(--space-lg);
    --card-radius: var(--radius-lg);
    --card-shadow: var(--shadow-sm);
    --card-border-color: var(--color-border, var(--color-border));
    --modal-backdrop-bg: light-dark(rgb(0 0 0 / 0.5), rgb(0 0 0 / 0.7));
    --modal-bg: var(--color-surface, var(--color-surface));
    --modal-radius: var(--radius-xl);
    --modal-shadow: var(--shadow-xl);
    --modal-padding: 1.5rem;
    --toast-font-family: var(--font-family, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif);
    --toast-font-size: var(--font-size-base, 1rem);
    --toast-font-weight: var(--font-weight-medium, 500);
    --toast-letter-spacing: 0.01em;
    --toast-line-height: 1.4;
    --toast-white-space: nowrap;
    --toast-pointer-events: auto;
    --toast-user-select: none;
    --toast-cursor: default;
    --toast-opacity: 0;
    --toast-transform: translateY(100%) scale(0.9);
    --toast-transition: opacity 160ms ease-out, transform 160ms cubic-bezier(0.16, 1, 0.3, 1), background-color 100ms ease;
    --toast-text: var(--color-on-surface, var(--color-on-surface, light-dark(#ffffff, #000000)));
    --toast-bg: color-mix(in oklab, var(--color-surface-elevated, var(--color-surface-container-high, var(--color-surface, light-dark(#fafbfc, #1e293b)))) 90%, var(--color-on-surface, var(--color-on-surface, light-dark(#000000, #ffffff))));
    --toast-radius: var(--radius-lg);
    --toast-shadow: var(--shadow-lg);
    --toast-padding: var(--space-lg);
    --sidebar-width: 280px;
    --sidebar-collapsed-width: 64px;
    --nav-height: 56px;
    --nav-height-compact: 48px;
    --status-height: 24px;
    --status-bg: var(--color-surface-elevated, var(--color-surface-container-high));
    --status-font-size: var(--text-xs);
    /* ── Shell chrome tokens (cross-shell registry) ─────────────────────────
     * WHY: previously scattered across minimal/immersive/faint shells with
     * duplicated \`light-dark(var(--color-*), var(--color-*))\` and offline hex
     * fallbacks. Defined once here in terms of canonical \`--color-*\` so canonical
     * is the single value source. Shells keep only theme/state overrides and
     * documented offline/SSR hex fallbacks for when veela is not loaded.
     */
    --shell-bg: var(--sv-surface-2, var(--color-surface));
    --shell-fg: var(--sv-on-surface, var(--color-on-surface));
    --shell-nav-bg: var(--sv-surface-2, var(--color-surface-container-high));
    --shell-nav-fg: var(--sv-on-surface, var(--color-on-surface));
    --shell-nav-border: var(--sv-outline-variant, var(--color-outline-variant));
    --shell-btn-hover: var(--sv-surface-2, var(--color-surface-container));
    --shell-btn-active-bg: color-mix(in oklab, var(--color-primary) 18%, var(--sv-surface-2, var(--color-surface)));
    --shell-btn-active-fg: var(--sv-on-surface, var(--color-on-surface));
    --shell-status-bg: var(--sv-surface-1, var(--color-surface-container-low));
    --shell-status-fg: var(--sv-on-surface, var(--color-on-surface));
    /* ── Faint shell tokens (subsystem boot shells) ───────────────────────
     * Derived from canonical \`--color-*\`; previously duplicated as
     * \`light-dark(var(--color-*), var(--color-*))\` in \`subsystem/boot/shells.scss\`.
     */
    --faint-nav-bg: var(--color-surface-container-high);
    --faint-nav-border: var(--color-outline-variant);
    --faint-sidebar-bg: var(--color-surface-container-high);
    /* ── Environment-shell tokens (color subset) ──────────────────────────
     * \`--env-status-fg\` follows window chrome. \`--env-launcher-fg*\` aliases
     * \`--wallpaper-contrast-color\` / paper (WallpaperTheme + statusbar luma).
     * Non-color \`--env-*\` (z-index, safe-area, insets) stay in environment-shell.
     */
    --env-status-fg: light-dark(#1c1c1e, #f5f5f7);
    --env-status-fg-muted: color-mix(in oklab, var(--env-status-fg) 78%, transparent);
    --env-launcher-fg: var(--wallpaper-contrast-color);
    --env-launcher-fg-shadow: color-mix(in oklab, var(--wallpaper-underlying-color) 88%, transparent);
    --env-launcher-fg-glow: color-mix(in oklab, var(--wallpaper-underlying-color) 48%, transparent);
    /* ── fl.ui \`--error-color\` alias ────────────────────────────────────
     * Canonical alias so fl.ui/components can consume \`var(--error-color)\`
     * without a standalone fallback definition.
     */
    --error-color: var(--color-error, #f87171);
    /* ── Settings-view semantic tokens (\`--sv-*\`) ──────────────────────
     * View-specific semantic layer DERIVED from canonical \`--color-*\` / \`--base-color\`.
     * Source of truth for the default relationships lives here; settings-view keeps
     * only theme-pinned overrides (\`html[data-theme]\`) and shadow-DOM self-sufficiency
     * fallbacks at use sites (\`var(--sv-*, light-dark(...))\`).
     */
    --sv-bg: var(--sv-surface-2, var(--color-surface-container-low, light-dark(#eef1f6, #0f1318)));
    --sv-fg: var(--sv-on-surface, var(--color-on-surface, light-dark(#12151a, #e8edf2)));
    --sv-muted: var(--sv-on-surface-variant, var(--color-on-surface-variant, light-dark(#5c6570, #a8b0bc)));
    --sv-outline: var(--sv-outline-variant, var(--color-outline-variant, light-dark(#c5cdd8, #3d4755)));
    --sv-surface-1: var(--color-surface-container-low, light-dark(#ffffff, #171c24));
    --sv-surface-2: var(--color-surface-container, light-dark(#f4f6fa, #1c232d));
    --sv-primary: var(--base-color, var(--color-primary, #5a9ec8));
    --sv-danger: var(--color-error, #d32f2f);
    /* ── History-view semantic tokens (\`--vh-*\`) ──────────────────────
     * View-specific semantic layer DERIVED from canonical \`--color-*\`.
     * Source of truth for the default relationships lives here; history-view keeps
     * only the complex derived tokens (\`--vh-item-border/preview-bg/elev\`) and
     * shadow-DOM self-sufficiency fallbacks at use sites.
     */
    --vh-bg: var(--color-surface, light-dark(#eef1f6, #0f1318));
    --vh-fg: var(--color-on-surface, light-dark(#12151a, #e8edf2));
    --vh-muted: var(--color-on-surface-variant, light-dark(#5c6570, #a8b0bc));
    --vh-primary: var(--color-primary, #007acc);
    --vh-danger: var(--color-error, #d32f2f);
    --vh-on-primary: var(--color-on-primary, #ffffff);
    --vh-item-bg: var(--color-surface-container-low, light-dark(#e0e5ee, #0a0d12));
    /* ── Explorer / shared view color tokens (\`--view-*\`) ────────────
     * View-specific semantic layer DERIVED from canonical \`--color-*\`.
     * Source of truth for the default relationships lives here; explorer-view keeps
     * only \`--explorer-*\` non-color (radius/pad/font) and shadow-DOM self-sufficiency
     * fallbacks at use sites. Shared \`--view-*\` namespace also consumed by markdown-view.
     */
    --view-border: color-mix(in oklab, var(--color-outline-variant, #888) 45%, transparent);
    --view-fg-muted: color-mix(in oklab, var(--color-on-surface, #ccc) 72%, transparent);
    --view-hover-bg: color-mix(in oklab, var(--color-primary, #3794ff) 12%, transparent);
    --view-selected-bg: color-mix(in oklab, var(--color-primary, #3794ff) 18%, transparent);
    --view-selected-border: var(--color-primary, #3794ff);
  }
  /* Auto (no pin): follow OS preference with concrete tokens — not light-dark(). */
  @media (prefers-color-scheme: dark) {
    :root:not([data-theme=light]):not([data-theme=dark]),
    :host:not([data-theme=light]):not([data-theme=dark]) {
      color-scheme: dark;
      --base-color: var(--color-primary);
      --base-color-neutralized: color-mix(in oklab, var(--base-color) 60%, gray);
      /* WHY: CSS fallback only — WallpaperTheme inline hex wins for photo paper/ink. */
      --wallpaper-underlying-color: --u2-color-mod(var(--base-color-neutralized), 940);
      --wallpaper-contrast-color: --u2-color-mod(var(--base-color-neutralized), 70);
      --wf-md-primary: var(--color-primary);
      --wf-md-seed: var(--base-color);
      --color-on-primary: --u2-color-mod(var(--base-color), 920);
      --color-secondary: --u2-color-mod(var(--base-color), 680);
      --color-on-secondary: --u2-color-mod(var(--base-color), 920);
      --color-tertiary: --u2-color-mod(var(--base-color), 700);
      --color-on-tertiary: --u2-color-mod(var(--base-color), 920);
      --color-error: #f87171;
      --color-on-error: --u2-color-mod(var(--color-error), 920);
      --color-success: #66bb6a;
      --color-warning: #ffa726;
      --color-info: #42a5f5;
      --color-background: --u2-color-mod(var(--base-color), 940);
      --color-on-background: --u2-color-mod(var(--base-color), 100);
      --color-surface: --u2-color-mod(var(--base-color), 940);
      --color-on-surface: --u2-color-mod(var(--base-color), 100);
      --color-surface-variant: --u2-color-mod(var(--base-color), 840);
      --color-on-surface-variant: --u2-color-mod(var(--base-color), 280);
      --color-outline: --u2-color-mod(var(--base-color), 720);
      --color-outline-variant: --u2-color-mod(var(--base-color), 640);
      --color-surface-container-lowest: --u2-color-mod(var(--base-color), 920);
      --color-surface-container-low: --u2-color-mod(var(--base-color), 940);
      --color-surface-container: --u2-color-mod(var(--base-color), 960);
      --color-surface-container-high: --u2-color-mod(var(--base-color), 980);
      --color-surface-container-highest: --u2-color-mod(var(--base-color), 1000);
      --color-primary-container: --u2-color-mod(var(--base-color), 820);
      --color-on-primary-container: --u2-color-mod(var(--base-color), 100);
      --color-border: color-mix(in oklab, var(--color-outline-variant) 70%, transparent);
      --color-bg: var(--color-background);
      --color-text: var(--color-on-background);
      --color-fg: var(--color-on-surface);
      --on-surface-color: var(--color-on-surface);
      --surface-color: var(--color-surface);
      --fl-surface: var(--color-surface);
      --fl-on-surface: var(--color-on-surface);
      --fl-primary: var(--color-primary);
      --fl-on-primary: var(--color-on-primary);
      --fl-secondary: var(--color-secondary);
      --fl-on-secondary: var(--color-on-secondary);
      --fl-shadow-xl: var(--shadow-xl);
      --on-surface-variant: var(--color-on-surface-variant);
      --wf-md-surface: var(--color-surface);
      --wf-md-on-surface: var(--color-on-surface);
      --wf-md-on-surface-variant: var(--color-on-surface-variant);
      --wf-md-surf-container: var(--color-surface-container);
      --wf-md-surf-container-low: var(--color-surface-container-low);
      --wf-md-surf-container-high: var(--color-surface-container-high);
      --wf-md-outline-variant: var(--color-outline-variant);
      --md3-primary-container: var(--color-primary-container);
      --md-primary-container: var(--color-primary-container);
    }
  }
  /*
   * Pinned app theme — highest authority. Concrete surfaces so shadow/UI never mix
   * OS color-scheme with app light (Settings cream + white labels).
   */
  :root[data-theme=light],
  :host[data-theme=light],
  [data-theme=light] {
    color-scheme: light only;
    --base-color: var(--color-primary);
    --base-color-neutralized: color-mix(in oklab, var(--base-color) 60%, gray);
    /* WHY: CSS fallback only — WallpaperTheme inline hex wins for photo paper/ink. */
    --wallpaper-underlying-color: --u2-color-mod(var(--base-color-neutralized), 940);
    --wallpaper-contrast-color: --u2-color-mod(var(--base-color-neutralized), 70);
    --wf-md-primary: var(--color-primary);
    --wf-md-seed: var(--base-color);
    --color-on-primary: --u2-color-mod(var(--base-color), 40);
    --color-secondary: --u2-color-mod(var(--base-color), 420);
    --color-on-secondary: --u2-color-mod(var(--base-color), 40);
    --color-tertiary: --u2-color-mod(var(--base-color), 400);
    --color-on-tertiary: --u2-color-mod(var(--base-color), 40);
    --color-error: #ef4444;
    --color-on-error: --u2-color-mod(var(--color-error), 40);
    --color-success: #4caf50;
    --color-warning: #ff9800;
    --color-info: #2196f3;
    --color-background: --u2-color-mod(var(--base-color), 60);
    --color-on-background: --u2-color-mod(var(--base-color), 900);
    --color-surface: --u2-color-mod(var(--base-color), 60);
    --color-on-surface: --u2-color-mod(var(--base-color), 900);
    --color-surface-variant: --u2-color-mod(var(--base-color), 160);
    --color-on-surface-variant: --u2-color-mod(var(--base-color), 700);
    --color-outline: --u2-color-mod(var(--base-color), 300);
    --color-outline-variant: --u2-color-mod(var(--base-color), 400);
    --color-surface-container-lowest: --u2-color-mod(var(--base-color), 40);
    --color-surface-container-low: --u2-color-mod(var(--base-color), 30);
    --color-surface-container: --u2-color-mod(var(--base-color), 20);
    --color-surface-container-high: --u2-color-mod(var(--base-color), 5);
    --color-surface-container-highest: --u2-color-mod(var(--base-color), 2);
    /* WHY: Start/AppMenu plates used a dark 880 fallback when this token was missing. */
    --color-primary-container: --u2-color-mod(var(--base-color), 160);
    --color-on-primary-container: --u2-color-mod(var(--base-color), 900);
    --color-border: color-mix(in oklab, var(--color-outline-variant) 75%, transparent);
    --color-bg: var(--color-background);
    --color-text: var(--color-on-background);
    --color-fg: var(--color-on-surface);
    --on-surface-color: var(--color-on-surface);
    --surface-color: var(--color-surface);
    --fl-surface: var(--color-surface);
    --fl-on-surface: var(--color-on-surface);
    --fl-primary: var(--color-primary);
    --fl-on-primary: var(--color-on-primary);
    --fl-secondary: var(--color-secondary);
    --fl-on-secondary: var(--color-on-secondary);
    --fl-shadow-xl: var(--shadow-xl);
    --on-surface-variant: var(--color-on-surface-variant);
    --wf-md-surface: var(--color-surface);
    --wf-md-on-surface: var(--color-on-surface);
    --wf-md-on-surface-variant: var(--color-on-surface-variant);
    --wf-md-surf-container: var(--color-surface-container);
    --wf-md-surf-container-low: var(--color-surface-container-low);
    --wf-md-surf-container-high: var(--color-surface-container-high);
    --wf-md-outline-variant: var(--color-outline-variant);
    --md3-primary-container: var(--color-primary-container);
    --md-primary-container: var(--color-primary-container);
  }
  :root[data-theme=dark],
  :host[data-theme=dark],
  [data-theme=dark] {
    color-scheme: dark only;
    --base-color: var(--color-primary);
    --base-color-neutralized: color-mix(in oklab, var(--base-color) 60%, gray);
    /* WHY: CSS fallback only — WallpaperTheme inline hex wins for photo paper/ink. */
    --wallpaper-underlying-color: --u2-color-mod(var(--base-color-neutralized), 940);
    --wallpaper-contrast-color: --u2-color-mod(var(--base-color-neutralized), 70);
    --wf-md-primary: var(--color-primary);
    --wf-md-seed: var(--base-color);
    --color-on-primary: --u2-color-mod(var(--base-color), 920);
    --color-secondary: --u2-color-mod(var(--base-color), 680);
    --color-on-secondary: --u2-color-mod(var(--base-color), 920);
    --color-tertiary: --u2-color-mod(var(--base-color), 700);
    --color-on-tertiary: --u2-color-mod(var(--base-color), 920);
    --color-error: #f87171;
    --color-on-error: --u2-color-mod(var(--color-error), 920);
    --color-success: #66bb6a;
    --color-warning: #ffa726;
    --color-info: #42a5f5;
    --color-background: --u2-color-mod(var(--base-color), 940);
    --color-on-background: --u2-color-mod(var(--base-color), 100);
    --color-surface: --u2-color-mod(var(--base-color), 940);
    --color-on-surface: --u2-color-mod(var(--base-color), 100);
    --color-surface-variant: --u2-color-mod(var(--base-color), 840);
    --color-on-surface-variant: --u2-color-mod(var(--base-color), 280);
    --color-outline: --u2-color-mod(var(--base-color), 720);
    --color-outline-variant: --u2-color-mod(var(--base-color), 640);
    --color-surface-container-lowest: --u2-color-mod(var(--base-color), 920);
    --color-surface-container-low: --u2-color-mod(var(--base-color), 940);
    --color-surface-container: --u2-color-mod(var(--base-color), 960);
    --color-surface-container-high: --u2-color-mod(var(--base-color), 980);
    --color-surface-container-highest: --u2-color-mod(var(--base-color), 1000);
    --color-primary-container: --u2-color-mod(var(--base-color), 820);
    --color-on-primary-container: --u2-color-mod(var(--base-color), 100);
    --color-border: color-mix(in oklab, var(--color-outline-variant) 70%, transparent);
    --color-bg: var(--color-background);
    --color-text: var(--color-on-background);
    --color-fg: var(--color-on-surface);
    --on-surface-color: var(--color-on-surface);
    --surface-color: var(--color-surface);
    --fl-surface: var(--color-surface);
    --fl-on-surface: var(--color-on-surface);
    --fl-primary: var(--color-primary);
    --fl-on-primary: var(--color-on-primary);
    --fl-secondary: var(--color-secondary);
    --fl-on-secondary: var(--color-on-secondary);
    --fl-shadow-xl: var(--shadow-xl);
    --on-surface-variant: var(--color-on-surface-variant);
    --wf-md-surface: var(--color-surface);
    --wf-md-on-surface: var(--color-on-surface);
    --wf-md-on-surface-variant: var(--color-on-surface-variant);
    --wf-md-surf-container: var(--color-surface-container);
    --wf-md-surf-container-low: var(--color-surface-container-low);
    --wf-md-surf-container-high: var(--color-surface-container-high);
    --wf-md-outline-variant: var(--color-outline-variant);
    --md3-primary-container: var(--color-primary-container);
    --md-primary-container: var(--color-primary-container);
  }
  :root[data-scheme=auto]:not([data-theme=light]):not([data-theme=dark]),
  :root[data-scheme=system]:not([data-theme=light]):not([data-theme=dark]) {
    color-scheme: light dark;
  }
  @media (prefers-reduced-motion: reduce) {
    :root {
      --transition-fast: 0ms;
      --transition-normal: 0ms;
      --transition-slow: 0ms;
      --motion-fast: 0ms;
      --motion-normal: 0ms;
      --motion-slow: 0ms;
      --duration-fast: 0ms;
      --duration-normal: 0ms;
      --duration-slow: 0ms;
    }
  }
  @media (prefers-contrast: high) {
    :root {
      --color-border: var(--color-border, var(--color-outline));
      --color-border-hover: color-mix(in oklab, var(--color-border, var(--color-outline)) 80%, var(--color-on-surface, var(--color-on-surface)));
      --color-text-secondary: var(--color-on-surface, var(--color-on-surface));
      --color-text-muted: var(--color-on-surface-variant, var(--color-on-surface-variant));
    }
  }
  @media print {
    :root {
      --view-padding: 0;
      --view-content-max-width: 100%;
      --view-bg: white;
      --view-fg: black;
      --view-heading-color: black;
      --view-link-color: black;
    }
    :root:has([data-view=viewer]) {
      --view-code-bg: #f5f5f5;
      --view-code-fg: black;
      --view-blockquote-bg: #f5f5f5;
    }
  }
}
@layer base {
  @keyframes bottom-to-top {
    0% {
      opacity: 0;
      transform: translateY(10%);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }
  @media screen {
    *,
    *::before,
    *::after {
      /*margin: 0;
      padding: 0;*/
      box-sizing: border-box;
      box-sizing: border-box;
      dynamic-range-limit: no-limit;
    }
    :where(html) {
      -webkit-text-size-adjust: 100%;
      tab-size: 4;
      font-size-adjust: from-font;
      font-optical-sizing: auto;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      text-rendering: optimizeLegibility;
      font-family: var(--font-sans);
      font-size: 16px;
      line-height: 1.5;
      dynamic-range-limit: no-limit;
      background: none;
      background-color: transparent;
      border: none 0px transparent;
      outline: none 0px transparent;
    }
    :where(body) {
      inset: 0;
      margin: 0;
      padding: 0;
      border: none;
      min-block-size: min(var(--lv-height, 100lvb), 100cqb);
      block-size: fit-content;
      background: var(--color-bg);
      color: var(--color-text);
      line-height: var(--line-height);
      -webkit-font-smoothing: antialiased;
      text-rendering: optimizeLegibility;
      dynamic-range-limit: no-limit;
      background: none;
      background-color: transparent;
      border: none 0px transparent;
      outline: none 0px transparent;
    }
    :where(ul, ol) {
      list-style: none;
      margin: 0;
      padding: 0;
    }
    :where(blockquote, q) {
      quotes: none;
    }
    :where(blockquote, q)::before, :where(blockquote, q)::after {
      content: "";
      content: none;
    }
    :where(article, main, aside, section, header, footer, nav) {
      border: none 0px transparent;
      outline: none 0px transparent;
      box-shadow: none 0px transparent;
    }
    :where(table) {
      border-collapse: collapse;
      border-spacing: 0;
      display: block;
      overflow-x: auto;
      inline-size: max-content;
      max-inline-size: 100%;
      margin-block: 1rem;
      border: 1px solid var(--color-border);
      border-radius: var(--border-radius);
    }
    :where(table) :where(th, td) {
      padding: 0.5rem 1rem;
      border-block-end: 1px solid var(--color-border);
      text-align: start;
    }
    :where(table) :where(th) {
      background-color: var(--color-table);
      color: var(--color-text);
      font-weight: bold;
    }
    :where(table) :where(tr:last-child td) {
      border-block-end: none;
    }
    :where(table) :where(tr:nth-child(even)) {
      background-color: var(--color-bg-secondary);
    }
    :focus-visible {
      outline: none;
      box-shadow: 0 0 0 3px color-mix(in oklab, var(--color-primary, #5a7fff) 35%, transparent);
      border-radius: var(--radius-sm);
    }
    :focus:not(:focus-visible) {
      outline: none;
    }
    :where(button, input, optgroup, select, textarea) {
      font: inherit;
      color: inherit;
      letter-spacing: inherit;
      margin: 0;
      border: none;
      outline: none;
      line-height: 1.15;
      border: none 0px transparent;
      outline: none 0px transparent;
      box-shadow: none 0px transparent;
    }
    :where(button) {
      min-block-size: fit-content;
      min-inline-size: fit-content;
      padding-inline: 1rem;
      padding-block: 0.5rem;
      gap: 0.25rem;
      text-transform: none;
      user-select: none;
      pointer-events: auto;
      cursor: pointer;
      appearance: none;
      border: none;
      background: transparent;
    }
    :where(button):has(> ui-icon:only-child) {
      place-content: center;
      place-items: center;
      aspect-ratio: 1/1;
    }
    :where(button):disabled {
      pointer-events: none;
      cursor: not-allowed;
    }
    :where(select) {
      text-transform: none;
    }
    :where(button, [type=button], [type=reset], [type=submit]) {
      -webkit-appearance: button;
      cursor: pointer;
    }
    :where(button, [type=button], [type=reset], [type=submit])::-moz-focus-inner {
      border-style: none;
      padding: 0;
    }
    :where(fieldset, dialog) {
      border: none;
      padding: 0;
      margin: 0;
    }
    :where(legend) {
      padding: 0;
    }
    :where(progress) {
      vertical-align: baseline;
    }
    :where(textarea) {
      overflow: auto;
      resize: vertical;
    }
    :where([type=search]) {
      -webkit-appearance: textfield;
      outline-offset: -2px;
    }
    :where([type=search])::-webkit-search-decoration {
      -webkit-appearance: none;
    }
    :where([type=range]) {
      -webkit-appearance: none;
    }
    :where(details > summary),
    :where(summary) {
      cursor: pointer;
    }
    :where(mark) {
      background-color: transparent;
      color: inherit;
    }
    :where(sub, sup) {
      font-size: 75%;
      line-height: 0;
      position: relative;
      vertical-align: baseline;
    }
    :where(sup) {
      top: -0.5em;
    }
    :where(sub) {
      bottom: -0.25em;
    }
    :where(a) {
      color: var(--color-link, inherit);
      text-decoration: inherit;
      text-underline-offset: 0.2em;
      pointer-events: auto;
      cursor: pointer;
      transition: color var(--transition-fast);
    }
    :where(a):hover {
      color: var(--color-primary-hover);
    }
    :where(img, canvas, svg, video, iframe, picture) {
      max-inline-size: 100%;
      block-size: auto;
      border: none 0px transparent;
      outline: none 0px transparent;
      box-shadow: none 0px transparent;
      dynamic-range-limit: no-limit;
    }
    :where(img, video, canvas, svg, picture) {
      display: block;
      max-inline-size: 100%;
      block-size: auto;
    }
    :where(img, video) {
      object-fit: contain;
      object-position: center;
    }
    :where(picture) {
      display: contents;
    }
    :where(iframe) {
      max-inline-size: 100%;
      block-size: auto;
    }
    :where(em, i) {
      font-style: normal;
    }
    :where(strong, b) {
      font-weight: normal;
    }
    :where(code, kbd, samp, pre) {
      font-family: var(--font-family-mono, "SF Mono", "Monaco", "Inconsolata", "Roboto Mono", monospace);
      font-size: 1em;
    }
    :where(code, pre) {
      font-family: var(--font-mono);
      font-size: 0.875em;
    }
    :where(code, samp, kbd) {
      font-family: var(--font-family-mono, "SF Mono", "Monaco", "Roboto Mono", monospace);
      background-color: var(--bgColor-muted);
      border-radius: 0.3em;
      padding: 0.2em 0.4em;
      font-size: 85%;
    }
    :where(code) {
      background: var(--color-bg-alt);
      padding: 0.125em 0.25em;
      border-radius: var(--radius-sm);
    }
    :where(pre) {
      background: var(--color-bg-alt);
      padding: var(--space-md);
      border-radius: var(--radius-md);
      overflow-x: auto;
    }
    :where(pre) :where(code) {
      background: transparent;
      padding: 0;
      border-radius: 0;
    }
    :where(input, textarea, select, button, option) {
      border: none 0px transparent;
      outline: none 0px transparent;
      accent-color: var(--color-link, currentColor);
      font-variant-emoji: text;
      border: none 0px transparent;
      outline: none 0px transparent;
      box-shadow: none 0px transparent;
    }
    :where(span) {
      font-variant-emoji: text;
    }
    :where(hr) {
      border: none;
      border-block-start: 1px solid var(--color-border);
      margin-block: var(--space-lg);
    }
    ::-webkit-scrollbar {
      inline-size: 8px;
      block-size: 8px;
    }
    ::-webkit-scrollbar-track {
      background: transparent;
    }
    ::-webkit-scrollbar-thumb {
      background: var(--color-outline-variant, #d1d5db);
      border-radius: 4px;
    }
    ::-webkit-scrollbar-thumb:hover {
      background: var(--color-outline, #9ca3af);
    }
    * {
      scrollbar-width: thin;
      scrollbar-color: var(--color-outline-variant, #d1d5db) transparent;
    }
    :where(input, textarea, select) {
      inline-size: 100%;
      padding: 0.5rem;
      font-size: var(--font-size-base);
      background-color: var(--color-bg-alt);
      color: var(--color-fg);
      border: 0px solid var(--color-border);
      border-radius: var(--border-radius);
    }
    :where(input, textarea, select):focus {
      outline: none;
      border-color: var(--color-primary);
    }
    :where(input, textarea, select)::placeholder {
      color: var(--color-text-secondary);
      opacity: 0.7;
    }
    :where(input, textarea, select):disabled {
      background-color: var(--color-bg-secondary);
      cursor: not-allowed;
      opacity: 0.5;
    }
    :where(input):-webkit-autofill::first-line, :where(input):autofill::first-line {
      font-size: 1em;
      text-size-adjust: 100%;
    }
    :where(input):-internal-autofill-previewed {
      letter-spacing: calc(1em / 10) !important;
    }
    :where(input):is([type=radio], [type=checkbox]) {
      inline-size: 1rem;
      block-size: 1rem;
      accent-color: var(--color-primary);
      aspect-ratio: 1/1;
    }
    :where(label) {
      font-weight: 600;
      user-select: none;
      pointer-events: none;
      margin-block-end: 0.25rem;
    }
    :where(h1, h2, h3, h4, h5, h6) {
      font-weight: 600;
      line-height: 1.2;
      margin-block: 0.5em;
      text-wrap: balance;
    }
    :where(h1) {
      font-size: 2rem;
    }
    :where(h2) {
      font-size: 1.5rem;
    }
    :where(h3) {
      font-size: 1.25rem;
    }
    :where(h4) {
      font-size: 1.125rem;
    }
    :where(h5) {
      font-size: 1rem;
    }
    :where(h6) {
      font-size: 0.875rem;
    }
    :where(p) {
      text-wrap: pretty;
      margin-block: 1em;
    }
    :where(article, .content) ul,
    :where(article, .content) ol {
      margin-block: var(--space-md);
      padding-inline-start: var(--space-lg);
    }
    :where(article, .content) ul {
      list-style: disc;
    }
    :where(article, .content) ol {
      list-style: decimal;
    }
    :where(blockquote) {
      margin-inline: 1rem;
      padding-inline: 1rem;
      border-inline-start: 0.25rem solid var(--color-secondary);
      color: var(--color-text-secondary);
      font-style: italic;
    }
    :where(body, main, aside, pre, code, textarea, [data-scrollable], .scrollable) {
      scrollbar-width: thin;
      scrollbar-color: var(--color-scrollbar, currentColor) transparent;
    }
    :where(body, main, aside, pre, code, textarea, [data-scrollable], .scrollable)::-webkit-scrollbar {
      inline-size: var(--scrollbar-size, 8px);
      block-size: var(--scrollbar-size, 8px);
    }
    :where(body, main, aside, pre, code, textarea, [data-scrollable], .scrollable)::-webkit-scrollbar-track {
      background: transparent;
    }
    :where(body, main, aside, pre, code, textarea, [data-scrollable], .scrollable)::-webkit-scrollbar-thumb {
      background-color: var(--color-scrollbar, currentColor);
      border-radius: var(--border-radius, 4px);
    }
    :where(body, main, aside, pre, code, textarea, [data-scrollable], .scrollable)::-webkit-scrollbar-thumb:hover {
      background: var(--color-outline, #9ca3af);
    }
    :where(link, head, script, style, meta),
    [hidden] {
      display: none !important;
    }
    /*:not(:defined) {
        opacity: 0;
        visibility: collapse;
        pointer-events: none;
    }*/
    :where(link, head, script, style, meta) {
      pointer-events: none !important;
    }
    [aria-hidden=true] {
      visibility: collapse;
      pointer-events: none;
      opacity: 0;
    }
    [data-dragging] {
      will-change: transform;
      cursor: grabbing;
    }
    :where(a, button, [role=button]) {
      -webkit-tap-highlight-color: transparent;
    }
  }
  @media screen and (prefers-reduced-motion: reduce) {
    *,
    *::after,
    *::before {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }
}
@layer layout {
  @media screen {
    :where(footer, header, main) {
      margin-inline: auto;
      padding: 0;
    }
    :where(header) {
      text-align: center;
    }
    :where(nav) {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      margin-block-end: 0;
    }
    :where(nav) ul {
      display: flex;
      list-style: none;
      padding: 0;
      gap: 1rem;
      margin: 0;
    }
    :where(nav) ul li {
      position: relative;
    }
    :where(nav) a {
      font-weight: bold;
      color: var(--color-link);
      text-decoration: none;
    }
    :where(section) {
      display: flex;
      flex-wrap: wrap;
      justify-content: var(--justify-important, center);
      gap: 1rem;
    }
    :where(section) :where(aside) {
      border: 1px solid var(--color-bg-secondary);
      border-radius: var(--border-radius);
      box-shadow: var(--box-shadow);
      padding: 1.25rem;
      inline-size: var(--width-card);
      flex: 1 1 var(--width-card);
    }
  }
}
@layer components {
  @media screen {
    :where(dialog) {
      margin: auto;
      padding: 1rem;
      background: var(--color-bg);
      color: var(--color-text);
      border: 1px solid var(--color-border);
      border-radius: var(--border-radius);
      box-shadow: var(--box-shadow);
      max-inline-size: min(90vw, 600px);
      max-block-size: 85vh;
    }
    :where(dialog)::backdrop {
      background-color: rgba(0, 0, 0, 0.5);
    }
    :where(dialog)[open] {
      animation: bottom-to-top 0.25s ease-out;
    }
    :where(button, input[type=submit], input[type=button]) {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background-color: var(--color-link);
      border: 0px solid transparent;
      border-radius: var(--border-radius);
      padding: 0.5rem 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: filter 0.2s ease, transform 0.1s ease;
    }
    :where(button, input[type=submit], input[type=button]):disabled {
      opacity: 0.6;
      cursor: not-allowed;
      filter: none;
      background-color: var(--color-secondary);
    }
    :where(canvas):is([is=ui-canvas]) {
      position: fixed;
      inset: 0;
      inset-block-end: auto;
      pointer-events: none;
      z-index: 0;
      padding: 0;
      margin: 0;
      max-inline-size: max(100%, min(100cqi, 100lvi)) !important;
      max-block-size: max(100%, min(100cqb, 100lvb)) !important;
      max-inline-size: max(100%, min(100cqi, 100lvi)) !important;
      max-block-size: max(100%, min(100cqb, 100lvb)) !important;
      box-sizing: border-box !important;
      background-color: transparent !important;
      border: none 0px transparent !important;
      outline: none 0px transparent !important;
      min-inline-size: 0;
      min-block-size: 0;
      object-fit: cover;
      object-position: center;
    }
  }
}
@layer overrides {
  @media screen {
    [data-scheme=dark],
    [data-theme=dark] {
      color-scheme: dark only;
    }
    [data-scheme=dark] *,
    [data-theme=dark] * {
      color-scheme: dark;
    }
    [data-scheme=light],
    [data-theme=light] {
      color-scheme: light only;
    }
    [data-scheme=light] *,
    [data-theme=light] * {
      color-scheme: light;
    }
    [data-scheme=system],
    [data-theme=system] {
      color-scheme: light dark;
    }
    /* Scheme Overrides — align with Theme.ts data-scheme / data-theme */
    [data-scheme=dark], [data-theme=dark] {
      color-scheme: dark only;
    }
    [data-scheme=dark] *, [data-theme=dark] * {
      color-scheme: dark;
    }
    [data-scheme=light], [data-theme=light] {
      color-scheme: light only;
    }
    [data-scheme=light] *, [data-theme=light] * {
      color-scheme: light;
    }
    /*
     * WHY: When QS/Theme pins data-theme=light|dark, do NOT let stale data-scheme=auto
     * win (same specificity, later rule used to force \`light dark\` and keep OS dark).
     */
    [data-scheme=auto]:not([data-theme=light]):not([data-theme=dark]),
    [data-theme=auto],
    [data-scheme=system]:not([data-theme=light]):not([data-theme=dark]),
    [data-theme=system] {
      color-scheme: light dark;
    }
  }
}
/*
 * FIND:veela-ui
 * TAG:veela,fl-ui
 * WHY: Chrome mixins used by modal/sidebar/toolbars. SoT is veela, not fl.ui/library.
 */
/**
 * Native-first helper styles. Kept separate from \`modal()\` because legacy
 * \`ui-modal\` rules use containment that is unsafe for focusable dialog content.
 */
@position-try --just-block {
  inset-block-end: 0px;
}
@position-try --just-inline {
  inset-inline-end: 0px;
}
@keyframes percent-coef-x {
  from {
    sass("--percent-x"): 0;
  }
  to {
    sass("--percent-x"): 1;
  }
}
@keyframes percent-coef-y {
  from {
    sass("--percent-y"): 0;
  }
  to {
    sass("--percent-y"): 1;
  }
}
/**
 * Unified CSS Custom Property Registration System
 * 
 * This module consolidates property registration logic used across the library.
 * It provides a single source of truth for @property declarations via the
 * CSS Properties and Values API (CSS Houdini).
 * 
 * Used by:
 * - lib/core/_properties.scss (orientation, transform, layout properties)
 * - lib/basic/_typed-properties.scss (UI component properties)
 * - lib/advanced/design/ (MD3 design properties)
 */
/* stylelint-disable scss/function-no-unknown */
dialog.ui-modal-dialog {
  inline-size: min(100% - 2rem, 36rem);
  max-inline-size: calc(100dvi - 2rem);
  max-block-size: calc(100dvb - 2rem);
  margin: auto;
  padding: 0;
  border: 1px solid color-mix(in oklab, CanvasText 18%, transparent);
  border-radius: var(--radius-lg, 1rem);
  background: var(--modal-bg, Canvas);
  color: var(--modal-fg, CanvasText);
  box-shadow: var(--modal-shadow, 0 20px 60px rgba(0, 0, 0, 0.42));
  overflow: visible;
}
dialog.ui-modal-dialog::backdrop {
  background: var(--modal-backdrop-bg, rgba(0, 0, 0, 0.58));
  backdrop-filter: blur(4px);
}

.ui-modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: var(--ui-modal-fallback-z, 2147483646);
  display: grid;
  place-items: center;
  padding: 1rem;
  background: var(--modal-backdrop-bg, rgba(0, 0, 0, 0.58));
  backdrop-filter: blur(4px);
  pointer-events: auto;
}

.ui-modal-panel {
  inline-size: min(100%, 36rem);
  max-block-size: calc(100dvb - 2rem);
  overflow: auto;
  box-sizing: border-box;
  padding: var(--modal-padding, 1.25rem);
  border-radius: var(--modal-radius, var(--radius-lg, 1rem));
  background: var(--modal-bg, Canvas);
  color: var(--modal-fg, CanvasText);
  box-shadow: var(--modal-shadow, 0 20px 60px rgba(0, 0, 0, 0.42));
  pointer-events: auto;
}`})))()}var Ps;function Fs(){return(Fs=e((()=>{Ps=`/*
 * Filename: native-controls.scss
 * FullPath: modules/projects/veela.css/src/scss/ui/native-controls.scss
 * Reason for changes: Curated opt-in native control chrome entry-point.
 */
/*
 * Filename: _layers.scss
 * FullPath: modules/projects/veela.css/src/scss/_layers.scss
 * FIND:veela-layers
 * TAG:veela,style-lib
 * Reason for changes: One cascade-order registry; include view-transitions before overrides.
 */
/*
 * INVARIANT: this is the compiled-SCSS cascade-order prelude. Component, view,
 * and shell sheets join one of these layers instead of declaring local preludes.
 * JS wrap/unwrap/order lives in \`@fest-lib/style-lib\` \`layers.ts\` (\`VEELA_CASCADE_LAYERS\`).
 */
@layer tokens, base, layout, components, utilities, theme, overrides, print;
@layer components {
  :where(button) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-sm);
    padding-block: 0px;
    padding-inline: 0px;
    font-size: var(--font-size-sm);
    font-weight: 500;
    border-radius: var(--radius-md);
    background: var(--color-bg-alt);
    color: var(--color-fg);
    border: 1px solid var(--color-border);
    cursor: pointer;
    transition: all var(--transition-fast);
  }
  :where(button):hover:not(:disabled) {
    background: var(--color-border);
  }
  :where(button):focus-visible {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
  }
  :where(button):disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}
@layer components {
  input,
  select,
  textarea {
    background-repeat: no-repeat;
    min-block-size: 2.5rem;
    font-size: inherit;
    max-inline-size: stretch;
    max-inline-size: 100cqi;
    text-overflow: ellipsis;
    overflow: auto;
    scrollbar-width: none;
  }
  textarea[data-multiline=true] {
    min-block-size: 5rem;
    resize: vertical;
  }
}`})))()}var Is;function Ls(){return(Ls=e((()=>{js(),l(),Ns(),Fs(),Is=async e=>{await Ds().catch(()=>void 0),await a(Ms)?.catch(()=>void 0),e?.includeGlobalNativeControls&&await a(Ps)?.catch(()=>void 0)}})))()}var Rs;function zs(){return(zs=e((()=>{Rs=`:host(ui-task), :host(ui-task) * {
  box-sizing: border-box;
  user-select: none;
  touch-action: manipulation;
  -webkit-user-drag: none;
  -webkit-tap-highlight-color: transparent;
  gap: 0px;
  margin: 0px;
  padding: 0px;
  border: 0px none transparent;
}
:host(ui-task) {
  /* WHY: Without host display, desktop taskbar buttons collapse to 0×0. */
  display: inline-flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  min-inline-size: 2.25rem;
  min-block-size: 2.25rem;
  padding-inline: 0.45rem;
  padding-block: 0.25rem;
  border-radius: 0.5rem;
  user-select: none;
  pointer-events: auto;
  box-shadow: none;
  filter: none;
  cursor: pointer;
}
:host(ui-task) > * {
  pointer-events: none;
}
:host(ui-task) .task-icon {
  position: relative;
  display: inline-flex;
  place-content: center;
  place-items: center;
  line-height: 0;
  inline-size: 1.25rem;
  block-size: 1.25rem;
  min-inline-size: 1.25rem;
  min-block-size: 1.25rem;
}
:host(ui-task) .task-letter {
  position: absolute;
  inset: 0;
  display: grid;
  place-content: center;
  place-items: center;
  font-size: 0.72rem;
  font-weight: 700;
  line-height: 1;
  letter-spacing: 0;
  color: currentColor;
  opacity: 0.92;
  z-index: 0;
  pointer-events: none;
  user-select: none;
}
:host(ui-task) .task-icon-glyph {
  position: relative;
  z-index: 1;
  inline-size: 100%;
  block-size: 100%;
  min-inline-size: 1rem;
  min-block-size: 1rem;
  /* WHY: blank/missing Phosphor masks leave the letter visible underneath. */
  color: currentColor;
}
:host(ui-task) {
  /* When a real icon name is set, keep the letter under the glyph (not on top). */
}
:host(ui-task) .task-icon:has(ui-icon[icon]:not([icon=""])) .task-letter {
  opacity: 0.35;
}
:host(ui-task) .task-icon:has(ui-icon[icon]:not([icon=""]):not([icon=app-window])) .task-letter {
  opacity: 0;
}
:host(ui-task) .task-title {
  font-size: 0.75rem;
  font-weight: 500;
  line-height: 1.2;
  white-space: nowrap;
  max-inline-size: 8rem;
  overflow: hidden;
  text-overflow: ellipsis;
}

:host(ui-task:hover) {
  --background-tone-shift: 0.1;
  background-color: --c2-surface(var(--background-tone-shift, 0), var(--current));
  color: contrast-color(var(--background-tone-shift, 0), var(--current));
}

:host(ui-task[data-focus]) {
  border-block-end-color: --c2-on-surface(0, var(--current)) !important;
}

:host(ui-task:not([data-active])) {
  opacity: 0.6;
}`})))()}var Bs,Vs,Hs,Us;function Ws(){return(Ws=e((()=>{V(),l(),T(),zs(),Bs=f(Rs),Vs=e=>{let t=``;if(typeof e==`string`)t=e;else if(typeof e==`object`&&e&&`value`in e){let n=e.value;t=n==null?``:String(n)}else e!=null&&typeof e!=`object`&&(t=String(e));(!t||t===`undefined`||t===`null`||t===`[object Object]`)&&(t=``);let n=t.trim().charAt(0);return n?n.toUpperCase():`?`},Hs=(e,t,n)=>{let r=e.getAttribute(t);return r!=null&&String(r).trim()?String(r).trim():n},Us=class extends Ze{title;icon;constructor(){super()}styles=()=>Bs;render=function(){let e=Hs(this,`title`,`Task`),t=Hs(this,`icon`,`app-window`),n=Vs(e);return v`
            <div part="icon" class="task-icon c2-contrast c2-transparent" data-letter=${n}>
                <span class="task-letter" part="letter" aria-hidden="true">${n}</span>
                <ui-icon class="c2-contrast c2-transparent task-icon-glyph" part="glyph" icon=${t} icon-style="duotone"></ui-icon>
            </div>
            <div part="title" class="task-title c2-contrast c2-transparent">${e}</div>
        `}},z([_({source:`attr`})],Us.prototype,`title`,void 0),z([_({source:`attr`})],Us.prototype,`icon`,void 0),Us=z([x(`ui-task`)],Us)})))()}var Gs;function Ks(){return(Ks=e((()=>{Gs=`ui-taskbar[data-type=desktop] > ui-task[data-focus] {
  background: --c2-surface(0, var(--current));
  color: --c2-on-surface(0, var(--current));
  color: contrast-color(var(--c2-surface(0, var(--current))));
}

:host(ui-taskbar[data-type=desktop]) ::slotted(ui-task[data-focus]) {
  background: --c2-surface(0, var(--current));
  color: --c2-on-surface(0, var(--current));
  color: contrast-color(var(--c2-surface(0, var(--current))));
}`})))()}function qs(){return(qs=e((()=>{r(),l(),Ks(),f(Gs)})))()}var Js;function Ys(){return(Ys=e((()=>{Js=`ui-taskbar[data-type=mobile] > ui-task[data-focus] {
  background: --c2-surface(0, var(--current));
  color: --c2-on-surface(0, var(--current));
  color: contrast-color(var(--c2-surface(0, var(--current))));
}

:host(ui-taskbar[data-type=mobile]) ::slotted(ui-task[data-focus]) {
  background: --c2-surface(0, var(--current));
  color: --c2-on-surface(0, var(--current));
  color: contrast-color(var(--c2-surface(0, var(--current))));
}`})))()}function Xs(){return(Xs=e((()=>{r(),l(),Ys(),f(Js)})))()}function Zs(){try{return globalThis.navigator?.windowControlsOverlay??null}catch{return null}}function Qs(){if(Z)return Z;if(typeof globalThis.matchMedia!=`function`)return`unknown`;try{if(globalThis.matchMedia(`(display-mode: window-controls-overlay)`).matches)return Z=`window-controls-overlay`;if(globalThis.matchMedia(`(display-mode: fullscreen)`).matches)return Z=`fullscreen`;if(globalThis.matchMedia(`(display-mode: standalone)`).matches)return Z=`standalone`;if(globalThis.matchMedia(`(display-mode: minimal-ui)`).matches)return Z=`minimal-ui`;if(globalThis.matchMedia(`(display-mode: browser)`).matches)return Z=`browser`}catch{}return Z=`unknown`}function $s(e){if(!e?.visible||typeof e.getTitlebarAreaRect!=`function`)return null;try{let t=e.getTitlebarAreaRect();return t?{x:t.x,y:t.y,width:t.width,height:t.height}:null}catch{return null}}function ec(e){let t=Zs(),n=!!t?.visible,r=Qs(),i=n||r===`standalone`||r===`fullscreen`||r===`window-controls-overlay`||r===`minimal-ui`,a=`off`;return e&&(a=n?`wco`:i?`standalone`:`fallback`),{requested:e,wcoVisible:n,displayMode:r,titlebarRect:$s(t),isStandaloneLike:i,surface:a}}function tc(e){let t=()=>{Z=null,e.onChange(ec(e.getRequested()))},n=[];if(typeof globalThis.matchMedia==`function`)for(let e of[`(display-mode: window-controls-overlay)`,`(display-mode: standalone)`,`(display-mode: fullscreen)`,`(display-mode: minimal-ui)`,`(display-mode: browser)`])try{n.push(globalThis.matchMedia(e))}catch{}let r=()=>t();for(let e of n)try{e.addEventListener?.(`change`,r)}catch{try{e.addListener?.(r)}catch{}}let i=Zs(),a=()=>t();try{i?.addEventListener?.(`geometrychange`,a)}catch{}return queueMicrotask(t),()=>{for(let e of n)try{e.removeEventListener?.(`change`,r)}catch{try{e.removeListener?.(r)}catch{}}try{i?.removeEventListener?.(`geometrychange`,a)}catch{}}}var Z;function nc(){return(nc=e((()=>{Z=null})))()}var rc,ic,ac,oc,sc,cc,lc,uc,dc,fc,pc,Q,mc,hc,gc,_c,vc,yc,$,bc,xc,Sc,Cc,wc,Tc,Ec,Dc,Oc,kc,Ac;function jc(){return(jc=e((()=>{rc=null,ic=null,ac=null,oc=null,sc=null,cc=null,lc=null,uc=0,dc=null,fc=`#cbb8a4`,pc=`__CWSP_NATIVE_THEME_COLOR_OWNED__`,Q=e=>{let t=String(e||``).trim().toLowerCase();if(!t)return!1;if(t===`#007acc`||t===`#007accff`||t===`#36c`||t===`#3366cc`)return!0;let n=t.match(/^rgba?\(\s*([\d.]+)\s*[, ]\s*([\d.]+)\s*[, ]\s*([\d.]+)/i);if(n&&(t?.startsWith?.(`#`)||t?.startsWith?.(`rgb`))){let e=Math.round(Number(n[1])),t=Math.round(Number(n[2])),r=Math.round(Number(n[3]));if(e<=20&&t>=100&&t<=140&&r>=180&&r<=220)return!0}return!1},mc=()=>{try{return!!globalThis?.[pc]}catch{return!1}},hc=e=>{sc=e;try{globalThis[pc]=!!e}catch{}},gc=e=>!e||!e.isConnected||e.hasAttribute(`minimized`)?!1:e.hasAttribute(`native-mode`)?!0:e.hasAttribute(`maximized`)||e.hasAttribute(`data-desk-max`)||e.hasAttribute(`data-mobile-max`)||e.hasAttribute(`data-native-active`),_c=()=>{if(typeof document>`u`)return null;if(sc?.isConnected&&gc(sc))return sc;let e=Array.from(document.querySelectorAll(`ui-window[native-mode]:not([minimized])`));if(e.length)return e[e.length-1];let t=Array.from(document.querySelectorAll(`ui-window[data-desk-max]:not([minimized]), ui-window[maximized]:not([minimized]), ui-window[data-mobile-max]:not([minimized])`));for(let e=t.length-1;e>=0;e--){let n=t[e];if(gc(n))return n}return null},vc=()=>{ic||typeof MutationObserver>`u`||typeof document>`u`||(ic=new MutationObserver(()=>{lc=null;let e=_c();e?.isConnected?kc(e):Tc()}),ic.observe(document.documentElement,{attributes:!0,attributeFilter:[`data-theme`,`class`,`style`,`color-scheme`]}))},yc=e=>{ac||typeof MutationObserver>`u`||(ac=new MutationObserver(()=>{if(!mc())return;let t=(e.getAttribute(`content`)||``).toLowerCase(),n=(cc||``).toLowerCase();if(n&&t===n&&!Q(t))return;let r=_c();r?kc(r):Q(t)&&wc(fc,!0)}),ac.observe(e,{attributes:!0,attributeFilter:[`content`]}))},$=e=>{let t=String(e||``).trim();if(!t||t===`transparent`||t===`rgba(0, 0, 0, 0)`)return null;let n=t.match(/^#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i);if(n){let e=n[1];e.length===3?e=e[0]+e[0]+e[1]+e[1]+e[2]+e[2]:e.length===8&&(e=e.slice(0,6));let t=`#${e.toLowerCase()}`;return Q(t)?null:t}let r=t.match(/^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)(?:\s*,\s*([\d.]+))?\s*\)$/i);if(r){let e=r[4]===void 0?1:Number(r[4]);if(!Number.isFinite(e)||e<.5)return null;let t=`#${[Math.max(0,Math.min(255,Math.round(Number(r[1])))),Math.max(0,Math.min(255,Math.round(Number(r[2])))),Math.max(0,Math.min(255,Math.round(Number(r[3]))))].map(e=>e.toString(16).padStart(2,`0`)).join(``)}`;return Q(t)?null:t}let i=t.match(/^rgba?\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)(?:\s*\/\s*([\d.]+%?))?\s*\)$/i);if(i){let e=1;if(i[4]!==void 0&&(e=String(i[4]).endsWith(`%`)?Number(i[4])/100:Number(i[4])),!Number.isFinite(e)||e<.5)return null;let t=`#${[Math.max(0,Math.min(255,Math.round(Number(i[1])))),Math.max(0,Math.min(255,Math.round(Number(i[2])))),Math.max(0,Math.min(255,Math.round(Number(i[3]))))].map(e=>e.toString(16).padStart(2,`0`)).join(``)}`;return Q(t)?null:t}try{if(typeof document>`u`)return null;oc||(oc=document.createElement(`canvas`),oc.width=1,oc.height=1);let e=oc.getContext(`2d`,{willReadFrequently:!0});if(!e)return null;e.fillStyle=`#000000`,e.fillStyle=t;let n=String(e.fillStyle||``);if(n.startsWith(`#`)&&n.length>=7){let e=n.slice(0,7).toLowerCase();return Q(e)?null:e}return $(n)}catch{return null}},bc=()=>{if(typeof document>`u`)return null;let e=document.querySelector(`meta[data-theme-color]`)||document.querySelector(`meta[name="theme-color"]`);e||(e=document.createElement(`meta`),e.setAttribute(`name`,`theme-color`),e.setAttribute(`data-theme-color`,``),document.head?.appendChild(e));try{let t=Array.from(document.querySelectorAll(`meta[name="theme-color"]`));for(let n of t)n!==e&&n.remove()}catch{}return yc(e),e},xc=(e,t)=>{try{let n=document.createElement(`div`);n.setAttribute(`data-theme-color-probe`,`true`),n.style.cssText=`position:fixed;left:-8px;top:-8px;inline-size:4px;block-size:4px;pointer-events:none;opacity:0;background:${t}`,e.appendChild(n);let r=$(getComputedStyle(n).backgroundColor);return n.remove(),r}catch{return null}},Sc=()=>{if(lc)return lc;try{let e=getComputedStyle(document.documentElement).getPropertyValue(`--color-surface-container`).trim();lc=$(e)||xc(document.documentElement,`var(--color-surface-container, Canvas)`)||fc}catch{lc=fc}return lc},Cc=e=>{let t=e.querySelector(`.env-ui-window__body`),n=t?.querySelector(`.settings-screen__top, .view-settings, .view-explorer, .cw-view-viewer-shell`)||t;if(n){let e=$(getComputedStyle(n).backgroundColor);if(e)return e}return Sc()},wc=(e,t=!1)=>{let n=bc();if(!n||!e)return;let r=e.toLowerCase();Q(r)&&(r=fc);let i=(n.getAttribute(`content`)||``).toLowerCase();if(!(i===r&&!t&&!Q(i))&&(n.setAttribute(`content`,r),n.setAttribute(`data-theme-color`,``),n.removeAttribute(`media`),cc=r,t||i!==r||Q(i)))try{let e=n.parentNode||document.head;e?.removeChild(n),e?.appendChild(n)}catch{}},Tc=()=>{if(typeof document>`u`||_c())return;hc(null),cc=null;let e=bc();if(!e)return;let t=document.documentElement,n=getComputedStyle(t),r=document.body?getComputedStyle(document.body):null,i=$(n.getPropertyValue(`--color-surface-container`).trim())||$(n.getPropertyValue(`--color-surface`).trim())||$(n.getPropertyValue(`--ui-win-titlebar-bg`).trim())||(r?$(r.backgroundColor):null)||$(n.backgroundColor);i?wc(i):Q(String(e.getAttribute(`content`)||``))&&wc(fc,!0),vc()},Ec=e=>e.hasAttribute(`maximized`)||e.hasAttribute(`data-desk-max`)||e.hasAttribute(`data-mobile-max`)||e.hasAttribute(`data-native-active`),Dc=()=>{if(uc){if(typeof cancelIdleCallback==`function`)try{cancelIdleCallback(uc)}catch{clearTimeout(uc)}else clearTimeout(uc);uc=0,dc=null}},Oc=e=>{if(dc=e,uc)return;let t=()=>{uc=0;let e=dc;dc=null,e?.isConnected&&(e.hasAttribute(`minimized`)||!e.hasAttribute(`native-mode`)&&!Ec(e)||(wc(Cc(e)||fc,!1),vc()))};uc=typeof requestIdleCallback==`function`?requestIdleCallback(t,{timeout:120}):setTimeout(t,0)},kc=e=>{if(!e||typeof document>`u`||e.hasAttribute(`minimized`)||!e.hasAttribute(`native-mode`)&&!Ec(e)&&!gc(e))return;let t=bc();if(t){if(rc==null){let e=t.getAttribute(`content`)||``;rc=Q(e)?``:e}if(hc(e),Q(String(t.getAttribute(`content`)||``))&&wc(fc,!1),cc&&!Q(cc)){wc(cc,!1),vc();return}Oc(e)}},Ac=e=>{if(typeof document>`u`||!document.querySelector(`meta[name="theme-color"]`))return;let t=_c();if(t&&t!==e){kc(t);return}let n=Array.from(document.querySelectorAll(`ui-window[native-mode]:not([minimized]), ui-window[data-desk-max]:not([minimized]), ui-window[maximized]:not([minimized]), ui-window[data-mobile-max]:not([minimized])`)).filter(t=>t!==e&&gc(t));if(n.length){kc(n[n.length-1]);return}hc(null),cc=null,Dc(),rc!=null&&rc&&!Q(rc)?(wc(rc,!0),rc=null):(rc=null,Tc())},typeof document<`u`&&queueMicrotask(()=>{try{Tc()}catch{}})})))()}var Mc;function Nc(){return(Nc=e((()=>{Mc=`/*
 * Filename: window.scss
 * FullPath: modules/projects/veela.css/src/scss/ui/components/window.scss
 * Change date and time: 23.09.20_23.08.2026
 * Reason for changes: Empty footer-handler collapsed — slot child broke :empty / :has-slotted.
 * FIND:win-footer
 */
/* Shadow sheets import the canonical color function definition. */
/*
 * Filename: _color-mod.scss
 * FullPath: modules/projects/veela.css/src/scss/core/_color-mod.scss
 * Reason for changes: Single source for the custom color modulation function.
 */
@function --u2-color-mod(--base-color <color>, --index <number> : 550) returns <color> {
  --i: clamp(0, var(--index), 1000);
  --pivot: 550;
  --white-distance: clamp(0, calc((var(--pivot) - var(--i)) / var(--pivot)), 1);
  --black-distance: clamp(0, calc((var(--i) - var(--pivot)) / (1000 - var(--pivot))), 1);
  --to-white: pow(var(--white-distance), 1.15);
  --to-black: pow(var(--black-distance), 1.08);
  --center-left: clamp(0, calc(var(--i) / var(--pivot)), 1);
  --center-right: clamp(0, calc((1000 - var(--i)) / (1000 - var(--pivot))), 1);
  --chroma-shape: sqrt(min(var(--center-left), var(--center-right)));
  --chroma-scale: calc(0.08 + 0.92 * var(--chroma-shape));
  result: oklch(from var(--base-color) calc(l + (0.985 - l) * var(--to-white) + (0.16 - l) * var(--to-black)) calc(c * var(--chroma-scale)) h);
}
@layer components {
  :host(ui-window) {
    /* Tokens — light defaults via light-dark(); dark flips with color-scheme / data-theme */
    --ui-win-radius: var(--radius-lg, 0.75rem);
    --ui-win-titlebar-height: 2.5rem;
    --ui-win-footer-min: 2.25rem;
    --ui-win-control-size: 1.75rem;
    --ui-win-icon-size: var(--ui-window-icon-size, 0.95rem);
    --ui-win-gap: 0.5rem;
    --ui-win-pad-inline: 0.75rem;
    --ui-win-pad-block: 0.65rem;
    /*
     * Prefer document \`--color-*\` (concrete under data-theme) so Light/Dark pins win.
     * light-dark() kept only as last-resort when veela tokens are absent.
     */
    --ui-win-seed: var(--base-color, var(--color-primary, #5a9ec8));
    --ui-win-bg: var(--color-surface, light-dark(
        --u2-color-mod(var(--ui-win-seed), 70),
        --u2-color-mod(var(--ui-win-seed), 930)
    ));
    --ui-win-fg: var(--color-on-surface, light-dark(
        --u2-color-mod(var(--ui-win-seed), 900),
        --u2-color-mod(var(--ui-win-seed), 100)
    ));
    --ui-win-muted: var(--color-on-surface-variant, light-dark(
        --u2-color-mod(var(--ui-win-seed), 700),
        --u2-color-mod(var(--ui-win-seed), 280)
    ));
    --ui-win-border: color-mix(in oklab, var(--ui-win-fg) 12%, transparent);
    --ui-win-titlebar-bg: var(--color-surface-container, light-dark(
        --u2-color-mod(var(--ui-win-seed), 40),
        --u2-color-mod(var(--ui-win-seed), 960)
    ));
    --ui-win-content-bg: var(--color-surface-container-lowest, light-dark(
        --u2-color-mod(var(--ui-win-seed), 40),
        --u2-color-mod(var(--ui-win-seed), 950)
    ));
    --ui-win-footer-bg: var(--color-surface-container-low, light-dark(
        --u2-color-mod(var(--ui-win-seed), 120),
        --u2-color-mod(var(--ui-win-seed), 900)
    ));
    --ui-win-shadow:
        light-dark(
            0 18px 40px -18px rgb(15 23 42 / 0.28),
            0 22px 48px -16px rgb(0 0 0 / 0.55)
        );
    /* WHY: transparent idle so controls share the solid titlebar fill (no “chip strip”). */
    --ui-win-control-bg: transparent;
    --ui-win-control-bg-hover: color-mix(in oklab, var(--ui-win-fg) 14%, transparent);
    --ui-win-control-fg: var(--ui-win-fg);
    --ui-win-close-bg: transparent;
    --ui-win-close-bg-hover: light-dark(
        --u2-color-mod(#ef4444, 550),
        --u2-color-mod(#ef4444, 480)
    );
    --ui-win-close-fg: var(--ui-win-fg);
    --ui-win-close-fg-hover: --u2-color-mod(var(--ui-win-seed), 40);
    --icon-color: var(--ui-win-fg);
    /* WHY: do not set --icon-size on the host — it inherits into Explorer/viewer
     * and shrinks list + toolbar glyphs to titlebar chrome size (0.95rem). */
    /*
     * WHY: \`light dark\` made window chrome follow OS while Settings locked light — cream panel
     * + dark-scheme fg. Inherit document/app scheme; explicit data-theme still wins below.
     */
    color-scheme: inherit;
    box-sizing: border-box;
    /* WHY: Prefer :host display over setting style attr in CE lifecycle (createElement rules). */
    display: block;
    position: relative;
    inline-size: var(--ui-win-width, min(32rem, 92vw));
    block-size: var(--ui-win-height, min(22rem, 70vh));
    min-inline-size: 16rem;
    min-block-size: 10rem;
    color: var(--ui-win-fg);
    font-family: "InterVariable", "Inter", "Segoe UI", ui-sans-serif, system-ui, sans-serif;
    font-size: 0.875rem;
    line-height: 1.35;
    border-radius: var(--ui-win-radius);
    overflow: hidden;
    box-shadow: var(--ui-win-shadow);
    isolation: isolate;
    contain: layout paint style;
    container-type: inline-size;
    container-name: ui-window;
  }
  :host(ui-window),
  :host(ui-window) *,
  :host(ui-window) *::before,
  :host(ui-window) *::after {
    box-sizing: border-box;
  }
  :host(ui-window) {
    /* WHY: footer always contains <slot>, so :empty / :has-slotted never hid the slab. */
  }
  :host(ui-window) .footer-handler[data-empty],
  :host(ui-window) .footer-handler[hidden] {
    display: none !important;
  }
  /* Explicit theme overrides (playground / app shell) */
  :host(ui-window[data-theme=light]),
  :host(ui-window.theme-light) {
    color-scheme: light;
  }
  :host(ui-window[data-theme=dark]),
  :host(ui-window.theme-dark) {
    color-scheme: dark;
  }
  :host(ui-window[managed]) {
    position: absolute;
    /* WHY: environment-shell owns geometry via inline left/top/width/height. */
    transform: none !important;
  }
  /* WHY: Focused window gets a slightly stronger edge so z-order changes are visible. */
  :host(ui-window[managed][data-focused]) {
    box-shadow: var(--ui-win-shadow), 0 0 0 1px color-mix(in oklab, var(--ui-win-fg) 22%, transparent);
  }
  /*
   * WHY: CWSP views own their chrome padding; default ui-window pad crushed toolbars into overlaps.
   * INVARIANT: \`native-mode\` / \`data-native-active\` need the same flex fill as \`managed\`, otherwise
   * slotted Explorer (\`.view-explorer\` → \`ui-file-manager\`) collapses to toolbar-only height.
   */
  :host(ui-window[managed]) .content-handler,
  :host(ui-window[native-mode]) .content-handler,
  :host(ui-window[data-native-active]) .content-handler {
    padding: 0;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }
  :host(ui-window[managed]) .content-handler ::slotted(*),
  :host(ui-window[native-mode]) .content-handler ::slotted(*),
  :host(ui-window[data-native-active]) .content-handler ::slotted(*) {
    flex: 1 1 auto;
    min-block-size: 0;
    min-inline-size: 0;
    max-inline-size: none;
    inline-size: 100%;
    block-size: 100%;
  }
  :host(ui-window[maximized]) {
    --ui-win-radius: 0;
    inset: 0 !important;
    inline-size: 100% !important;
    block-size: 100% !important;
    border-radius: 0;
    transform: none !important;
  }
  /*
   * Mobile (env shell): full-bleed; Home FAB overlays the window (no dock slab).
   * Titlebar becomes an empty spacer under the transparent overlay statusband
   * (\`--env-status-inset-top\`) unless standalone (\`data-no-titlebar\`).
   */
  :host(ui-window[data-mobile-max]) {
    --ui-win-radius: 0;
    /* Spacer height matches overlay status / notch when status-gap is on. */
    --ui-win-titlebar-height: var(--env-status-inset-top, max(2rem, env(safe-area-inset-top, 0px)));
    inset: 0 !important;
    inline-size: 100% !important;
    block-size: 100% !important;
    border-radius: 0;
    transform: none !important;
  }
  @media screen and (pointer: coarse) and (hover: none) {
    :host(ui-window[data-mobile-max]) {
      block-size: stretch !important;
    }
  }
  :host(ui-window[data-mobile-max]) .title-minimize,
  :host(ui-window[data-mobile-max]) .title-maximize,
  :host(ui-window[data-mobile-max]) .title-close,
  :host(ui-window[data-mobile-max]) .title-exit-native {
    display: none !important;
  }
  :host(ui-window[data-mobile-max]) .title-handler {
    cursor: default;
    /* WHY: transparent spacer sampled as black theme-color and broke Settings/Launcher unity. */
    background: var(--ui-win-titlebar-bg, var(--color-surface, --u2-color-mod(var(--ui-win-seed), 940)));
    border-block-end: 0;
    min-block-size: var(--ui-win-titlebar-height);
    padding-block: 0;
    pointer-events: none;
  }
  :host(ui-window[data-mobile-max]) .title-handler-main,
  :host(ui-window[data-mobile-max]) .title-handler-actions,
  :host(ui-window[data-mobile-max]) .title-handler-buttons {
    display: none !important;
  }
  /* Standalone PWA mobile: no titlebar — content is edge-to-edge (safe-area via views if needed). */
  :host(ui-window[data-no-titlebar]) {
    --ui-win-titlebar-height: 0px;
  }
  :host(ui-window[data-no-titlebar]) .title-handler {
    display: none !important;
  }
  /* Desktop/fullscreen with status overlay: maximized windows also reserve the top band. */
  :host(ui-window[data-status-gap]:not([data-no-titlebar])) {
    --ui-win-titlebar-height: var(--env-status-inset-top, max(2rem, env(safe-area-inset-top, 0px)));
  }
  :host(ui-window[data-status-gap]:not([data-no-titlebar])) .title-handler {
    cursor: default;
    background: var(--ui-win-titlebar-bg, var(--color-surface, --u2-color-mod(var(--ui-win-seed), 940)));
    border-block-end: 0;
    min-block-size: var(--ui-win-titlebar-height);
    padding-block: 0;
    pointer-events: none;
  }
  :host(ui-window[data-status-gap]:not([data-no-titlebar])) .title-handler-main,
  :host(ui-window[data-status-gap]:not([data-no-titlebar])) .title-handler-actions,
  :host(ui-window[data-status-gap]:not([data-no-titlebar])) .title-handler-buttons {
    display: none !important;
  }
  :host(ui-window[data-desk-max]) {
    --ui-win-radius: 0;
    /* WHY: titlebar is inside the window — subtracting it left a shadowed slab above the taskbar (PWA). */
    inset: 0 0 var(--env-shell-chrome-stack-reserve, 2.5rem) 0 !important;
    inline-size: auto !important;
    block-size: auto !important;
    border-radius: 0;
    box-shadow: none !important;
    transform: none !important;
  }
  @media screen and (pointer: coarse) and (hover: none) {
    :host(ui-window[data-desk-max]) {
      block-size: stretch !important;
    }
  }
  :host(ui-window[managed][data-focused][data-desk-max]) {
    box-shadow: none !important;
  }
  :host(ui-window[minimized]) {
    block-size: var(--ui-win-titlebar-height) !important;
    min-block-size: var(--ui-win-titlebar-height);
  }
  :host(ui-window[minimized]) .content-handler,
  :host(ui-window[minimized]) .footer-handler,
  :host(ui-window[minimized]) .window-resizer {
    display: none;
  }
  :host(ui-window[hidden-window]) {
    visibility: hidden !important;
    pointer-events: none !important;
  }
  :host(ui-window[maximized]) .window-resizer,
  :host(ui-window[data-mobile-max]) .window-resizer,
  :host(ui-window[data-desk-max]) .window-resizer,
  :host(ui-window[data-native-active]) .window-resizer {
    display: none;
  }
  /* -------------------------------------------------------------------------- */
  /* native-mode: full-bleed + WCO / standalone / in-tab fallback               */
  /* -------------------------------------------------------------------------- */
  :host(ui-window[native-mode]),
  :host(ui-window[data-native-active]) {
    --ui-win-radius: 0;
    position: fixed !important;
    inset: 0 !important;
    inline-size: 100% !important;
    block-size: 100% !important;
    max-inline-size: none;
    max-block-size: none;
    border-radius: 0;
    transform: none !important;
    box-shadow: none;
    /* WHY: above env chrome (~2e9 in env vars can minify oddly); stay under system overlays. */
    z-index: 100000;
  }
  :host(ui-window[data-native-wco]) .title-handler,
  :host(ui-window[data-native-standalone]) .title-handler {
    /* Prefer standardized window-drag; keep Chromium legacy aliases. */
    window-drag: move;
    app-region: drag;
    -webkit-app-region: drag;
    cursor: default;
    /* Titleband: cover WCO / safe-area strip */
    min-block-size: max(var(--ui-win-titlebar-height), env(titlebar-area-height, var(--ui-win-titlebar-area-height, 0px)), env(safe-area-inset-top, 0px) + 1.75rem);
    padding-block-start: max(env(safe-area-inset-top, 0px), env(titlebar-area-y, 0px));
    padding-inline-start: max(env(safe-area-inset-left, 0px), env(titlebar-area-x, var(--ui-win-titlebar-area-x, 0px)), var(--ui-win-pad-inline));
    padding-inline-end: max(env(safe-area-inset-right, 0px), max(0px, 100vi - env(titlebar-area-x, 0px) - env(titlebar-area-width, 100vi)), var(--ui-win-pad-inline));
  }
  :host(ui-window[data-native-wco]) .title-handler-buttons,
  :host(ui-window[data-native-wco]) .title-handler-actions,
  :host(ui-window[data-native-standalone]) .title-handler-buttons,
  :host(ui-window[data-native-standalone]) .title-handler-actions,
  :host(ui-window[data-native-wco]) .title-handler-buttons button,
  :host(ui-window[data-native-standalone]) .title-handler-buttons button {
    window-drag: none;
    app-region: no-drag;
    -webkit-app-region: no-drag;
  }
  /* WCO: OS owns min/max/close — hide custom duplicates. */
  :host(ui-window[data-native-wco]) .title-minimize,
  :host(ui-window[data-native-wco]) .title-maximize,
  :host(ui-window[data-native-wco]) .title-close,
  :host(ui-window[data-native-wco]) .title-exit-native {
    display: none !important;
  }
  /* Mobile / installed standalone: hide resize-like chrome; keep exit-native for env restore. */
  :host(ui-window[data-native-standalone]) .title-minimize,
  :host(ui-window[data-native-standalone]) .title-maximize,
  :host(ui-window[data-native-standalone]) .title-close {
    display: none !important;
  }
  :host(ui-window[data-native-active]) .footer-handler[data-empty],
  :host(ui-window[data-native-active]) .footer-handler[hidden],
  :host(ui-window[data-mobile-max]) .footer-handler {
    display: none !important;
  }
  /*
   * WHY: \`.title-handler-buttons button { display: inline-flex }\` beats bare \`[hidden]\` /
   * \`.title-exit-native { display: none }\` — without !important the 4th control always leaks.
   * INVARIANT: exit-native only for installed standalone; fallback uses maximize as exit.
   */
  .title-exit-native,
  .title-exit-native[hidden] {
    display: none !important;
  }
  :host(ui-window[data-native-standalone]) .title-exit-native:not([hidden]) {
    display: inline-flex !important;
  }
  .window-container {
    display: grid;
    grid-template-rows: minmax(0, max-content) minmax(0, 1fr) minmax(0, max-content);
    grid-template-areas: "title" "content" "footer";
    inline-size: 100%;
    block-size: 100%;
    background: var(--ui-win-bg);
    color: var(--ui-win-fg);
    border: 1px solid var(--ui-win-border);
    border-radius: inherit;
    overflow: hidden;
    /* WHY: isolate title vs content stacking so slotted paint cannot cover chrome. */
    isolation: isolate;
  }
  .title-handler {
    grid-area: title;
    /*
     * WHY: Slotted view roots (e.g. settings) can create stacking contexts that paint over
     * the title grid row and swallow drag + min/max/close. Keep chrome above content.
     * INVARIANT: title z > content z (same pattern as env \`.wf-frame\` titlebar).
     */
    position: relative;
    z-index: 50;
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto auto;
    align-items: center;
    gap: var(--ui-win-gap);
    min-block-size: var(--ui-win-titlebar-height);
    padding-inline: var(--ui-win-pad-inline);
    padding-block: 0.35rem;
    background: var(--ui-win-titlebar-bg);
    /*border-block-end: 1px solid var(--ui-win-border);*/
    border: 0px none transparent;
    border-block-end: 0px none transparent;
    cursor: grab;
    user-select: none;
    touch-action: none;
    pointer-events: auto;
  }
  .title-handler:active {
    cursor: grabbing;
  }
  .title-handler-main {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    min-inline-size: 0;
    overflow: hidden;
    pointer-events: none;
  }
  .title-handler-main ::slotted(*),
  .title-handler-main .title-text {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-weight: 600;
    letter-spacing: -0.01em;
  }
  .title-handler-actions {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    min-inline-size: 0;
  }
  .title-handler-buttons {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    flex-shrink: 0;
    position: relative;
    z-index: 51;
    pointer-events: auto;
    background: transparent;
    /* WHY: parent titlebar uses touch-action:none for drag; controls need click synthesis. */
    touch-action: manipulation;
  }
  .title-handler-buttons button,
  .title-handler-actions button {
    appearance: none;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    inline-size: var(--ui-win-control-size);
    block-size: var(--ui-win-control-size);
    margin: 0;
    padding: 0;
    border: 0;
    border-radius: 999px;
    background: var(--ui-win-control-bg);
    color: var(--ui-win-control-fg);
    --icon-color: currentColor;
    cursor: pointer;
    pointer-events: auto;
    transition: background-color 0.15s ease, color 0.15s ease, transform 0.12s ease;
  }
  .title-handler-buttons button:hover,
  .title-handler-actions button:hover {
    background: var(--ui-win-control-bg-hover);
  }
  .title-handler-buttons button:active,
  .title-handler-actions button:active {
    transform: scale(0.94);
  }
  .title-handler-buttons button:focus-visible,
  .title-handler-actions button:focus-visible {
    outline: 2px solid color-mix(in oklab, var(--color-primary, #5a7fff) 70%, transparent);
    outline-offset: 2px;
  }
  .title-handler-buttons button ui-icon,
  .title-handler-actions button ui-icon {
    inline-size: var(--ui-win-icon-size);
    block-size: var(--ui-win-icon-size);
    min-inline-size: var(--ui-win-icon-size);
    min-block-size: var(--ui-win-icon-size);
    flex-shrink: 0;
    --ui-icon-size: var(--ui-win-icon-size);
    --ui-icon-padding: 0;
    pointer-events: none;
  }
  .title-handler-buttons .title-close {
    background: var(--ui-win-close-bg);
    color: var(--ui-win-close-fg);
    --icon-color: currentColor;
  }
  .title-handler-buttons .title-close:hover {
    background: var(--ui-win-close-bg-hover);
    color: var(--ui-win-close-fg-hover);
  }
  /* Maximize glyph swaps via JS (\`#syncMaximizeIcon\`) — one ui-icon, never dual corners. */
  .content-handler {
    grid-area: content;
    /*
     * WHY (radical): views with \`position: fixed; inset: 0\` (settings/markdown) escape the
     * content grid and swallow titlebar hits. \`transform\` makes this the fixed containing
     * block; \`contain: paint\` keeps compositing under the chrome row.
     */
    position: relative;
    z-index: 0;
    isolation: isolate;
    transform: translateZ(0);
    contain: paint;
    min-block-size: 0;
    min-inline-size: 0;
    overflow: auto;
    padding: 0px; /*var(--ui-win-pad-block) var(--ui-win-pad-inline);*/
    background: var(--ui-win-content-bg);
    color: var(--ui-win-fg);
    /*
     * WHY: \`:host(ui-window[hidden-window])\` sets \`pointer-events: none !important\` on the host;
     * without an explicit \`auto\` here the slotted view inherits \`none\` and the entire body
     * (settings tabs, explorer, etc.) becomes unclickable even while visible.
     */
    pointer-events: auto;
    /*
     * INVARIANT: window content does not inherit the titlebar icon token.
     * Explorer and other views choose their own component token locally.
     */
  }
  .content-handler ::slotted(*) {
    max-inline-size: 100%;
    /* WHY: keep view roots inside the content box; do not cover chrome. */
    max-block-size: 100%;
    min-block-size: 0;
    pointer-events: auto;
  }
  .footer-handler {
    grid-area: footer;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 0.5rem;
    min-block-size: var(--ui-win-footer-min);
    padding: 0.45rem var(--ui-win-pad-inline);
    background: var(--ui-win-footer-bg);
    border-block-start: 1px solid var(--ui-win-border);
    color: var(--ui-win-muted);
  }
  .footer-handler[data-empty], .footer-handler[hidden] {
    display: none;
  }
  /* SE resize affordance (optional slot / child) */
  .window-resizer {
    position: absolute;
    z-index: 4;
    inset-inline-end: 4px;
    inset-block-end: 4px;
    inline-size: 12px;
    block-size: 12px;
    cursor: nwse-resize;
    border-radius: 2px;
    background: linear-gradient(135deg, transparent 48%, color-mix(in oklab, var(--ui-win-muted) 55%, transparent) 50%);
    opacity: 0.55;
    pointer-events: auto;
  }
  .window-resizer:hover {
    opacity: 0.9;
  }
  /*
   * WHY: Inline \`container-type: size\` on \`.content-handler\` + print \`height: auto\` sizes
   * the box as empty (size containment). Chrome then paginates blank pages.
   * INVARIANT: Print kills size/paint containment and lets slotted markdown grow.
   */
  @media print {
    :host(ui-window) {
      display: block !important;
      position: static !important;
      inset: auto !important;
      transform: none !important;
      overflow: visible !important;
      contain: none !important;
      container-type: normal !important;
      isolation: auto !important;
      inline-size: 100% !important;
      max-inline-size: 100% !important;
      block-size: auto !important;
      min-block-size: 0 !important;
      max-block-size: none !important;
      height: auto !important;
      min-height: 0 !important;
      max-height: none !important;
      box-shadow: none !important;
      border: none !important;
      border-radius: 0 !important;
      background: #fff !important;
      color: #000 !important;
    }
    .window-container {
      display: block !important;
      overflow: visible !important;
      contain: none !important;
      isolation: auto !important;
      inline-size: 100% !important;
      block-size: auto !important;
      height: auto !important;
      min-block-size: 0 !important;
      max-block-size: none !important;
      border: none !important;
      box-shadow: none !important;
      background: #fff !important;
      color: #000 !important;
    }
    .title-handler,
    .window-resizer,
    .footer-handler {
      display: none !important;
    }
    .content-handler,
    :host(ui-window[managed]) .content-handler,
    :host(ui-window[native-mode]) .content-handler,
    :host(ui-window[data-native-active]) .content-handler {
      display: block !important;
      position: static !important;
      transform: none !important;
      contain: none !important;
      container-type: normal !important;
      overflow: visible !important;
      isolation: auto !important;
      flex: none !important;
      inline-size: 100% !important;
      block-size: auto !important;
      min-block-size: 0 !important;
      max-block-size: none !important;
      height: auto !important;
      background: #fff !important;
      color: #000 !important;
    }
    .content-handler ::slotted(*),
    :host(ui-window[managed]) .content-handler ::slotted(*),
    :host(ui-window[native-mode]) .content-handler ::slotted(*),
    :host(ui-window[data-native-active]) .content-handler ::slotted(*) {
      display: block !important;
      flex: none !important;
      overflow: visible !important;
      contain: none !important;
      inline-size: 100% !important;
      max-inline-size: 100% !important;
      block-size: auto !important;
      min-block-size: 0 !important;
      max-block-size: none !important;
      height: auto !important;
    }
  }
}`})))()}var Pc,Fc,Ic,Lc,Rc,zc,Bc;function Vc(){return(Vc=e((()=>{T(),r(),l(),V(),se(),nc(),jc(),Nc(),Pc=f(Mc),Fc=`minus`,Ic=`corners-out`,Lc=`corners-in`,Rc=`x`,zc=Object.freeze({w:240,h:160}),Bc=class extends B{titleHandler;contentHandler;footerHandler;resizer;#e=N(0);#t=N(0);#n=null;#r=null;#i=null;#a=null;#o=null;#s=null;#c=null;#l=!1;#u=0;#d=0;#f=null;#p=null;#m=null;styles=function(){return Pc};render=function(){return v`<div class="window-container" part="window-container">
            <header class="title-handler" part="title-handler">
                <div class="title-handler-main" part="title">
                    <slot name="title"></slot>
                </div>
                <div class="title-handler-actions" part="actions">
                    <slot name="actions"></slot>
                </div>
                <div class="title-handler-buttons" part="controls" data-no-drag>
                    <button class="title-minimize" type="button" aria-label="Minimize" title="Minimize" data-no-drag data-ui-win-action="minimize">
                        <ui-icon icon=${Fc}></ui-icon>
                    </button>
                    <button class="title-maximize" type="button" aria-label="Maximize" title="Maximize" data-no-drag data-ui-win-action="maximize">
                        <ui-icon icon=${Ic}></ui-icon>
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
                        <ui-icon icon=${Lc}></ui-icon>
                    </button>
                    <button class="title-close" type="button" aria-label="Close" title="Close" data-no-drag data-ui-win-action="close">
                        <ui-icon icon=${Rc}></ui-icon>
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
        </div>`};constructor(){super()}get managed(){return this.hasAttribute(`managed`)}get nativeMode(){return this.hasAttribute(`native-mode`)}set nativeMode(e){this.toggleAttribute(`native-mode`,!!e),this.#y()}get nativeSurface(){return this.#f?.surface??(this.nativeMode?`fallback`:`off`)}onInitialize(){super.onInitialize()}onRender(){super.onRender(),this.#h()}connectedCallback(){super.connectedCallback?.(),this.#h(),this.#v()}disconnectedCallback(){queueMicrotask(()=>{this.isConnected||(this.#s?.(),this.#s=null,this.#c?.disconnect(),this.#c=null,this.#o?.disconnect(),this.#o=null,this.#a?.(),this.#a=null,this.#l=!1,this.#u=0,this.#i?.(),this.#i=null,this.#n?.(),this.#n=null,this.#r?.(),this.#r=null,this.#p?.(),this.#p=null,this.#m=null,super.disconnectedCallback?.())})}#h(){let e=()=>{this.#A(),this.#w(),this.#n||this.#j(),this.#r||this.#M(),this.#g(),!this.#l&&this.#u++<12&&requestAnimationFrame(e)};queueMicrotask(e)}#g(){if(this.#p){this.#_();return}let e=this.shadowRoot?.querySelector?.(`slot[name="footer"]`);if(!(e instanceof HTMLSlotElement))return;let t=()=>this.#_();e.addEventListener(`slotchange`,t),this.#p=()=>e.removeEventListener(`slotchange`,t),this.#_()}#_(){let e=this.shadowRoot?.querySelector?.(`slot[name="footer"]`),t=this.shadowRoot?.querySelector?.(`.footer-handler`);if(!(e instanceof HTMLSlotElement)||!(t instanceof HTMLElement))return;let n=!e.assignedNodes({flatten:!0}).some(e=>e.nodeType===Node.ELEMENT_NODE||e.nodeType===Node.TEXT_NODE&&!!e.textContent?.trim());t.toggleAttribute(`data-empty`,n),t.hidden=n}#v(){this.#s||(this.#s=tc({getRequested:()=>this.nativeMode,onChange:e=>this.#b(e)}),typeof MutationObserver<`u`&&!this.#c&&(this.#c=new MutationObserver(e=>{let t=!1,n=!1;for(let r of e)r.attributeName===`native-mode`&&(t=!0),(r.attributeName===`maximized`||r.attributeName===`data-desk-max`||r.attributeName===`data-mobile-max`)&&(n=!0);(t||n)&&this.#y(),n&&this.#S()}),this.#c.observe(this,{attributes:!0,attributeFilter:[`native-mode`,`maximized`,`data-desk-max`,`data-mobile-max`]})))}#y(){this.#b(ec(this.nativeMode))}#b(e){let t=this.nativeMode||this.hasAttribute(`data-desk-max`)||this.hasAttribute(`maximized`)||this.hasAttribute(`data-mobile-max`);if(this.#f?.surface===e.surface&&this.#m===t&&this.#n){this.#f=e;return}this.#f=e;let n=this;n.toggleAttribute(`data-native-wco`,e.surface===`wco`),n.toggleAttribute(`data-native-standalone`,e.surface===`standalone`),n.toggleAttribute(`data-native-fallback`,e.surface===`fallback`),n.toggleAttribute(`data-native-active`,e.surface!==`off`),this.#x(e.surface),e.titlebarRect?(n.style.setProperty(`--ui-win-titlebar-area-x`,`${e.titlebarRect.x}px`),n.style.setProperty(`--ui-win-titlebar-area-y`,`${e.titlebarRect.y}px`),n.style.setProperty(`--ui-win-titlebar-area-width`,`${e.titlebarRect.width}px`),n.style.setProperty(`--ui-win-titlebar-area-height`,`${e.titlebarRect.height}px`)):(n.style.removeProperty(`--ui-win-titlebar-area-x`),n.style.removeProperty(`--ui-win-titlebar-area-y`),n.style.removeProperty(`--ui-win-titlebar-area-width`),n.style.removeProperty(`--ui-win-titlebar-area-height`)),this.#n?.(),this.#n=null,this.#r?.(),this.#r=null,this.#j(),this.#M(),this.#S(),t!==this.#m&&(this.#m=t,t?kc(this):(Ac(this),Tc())),this.dispatchEvent(new CustomEvent(`window-native-change`,{bubbles:!0,composed:!0,detail:e}))}#x(e=this.nativeSurface){let t=this.shadowRoot?.querySelector(`.title-exit-native`);t&&(t.hidden=e!==`standalone`)}#S(){let e=this.shadowRoot?.querySelector(`.title-maximize`),t=e?.querySelector(`ui-icon`);if(!e||!t)return;let n=!(this.nativeMode&&this.nativeSurface===`fallback`)&&(this.hasAttribute(`maximized`)||this.hasAttribute(`data-desk-max`)||this.hasAttribute(`data-mobile-max`)),r=n?Lc:Ic,i=n?`Restore`:`Maximize`;t.getAttribute(`icon`)!==r&&t.setAttribute(`icon`,r),e.setAttribute(`aria-label`,i),e.setAttribute(`title`,i)}applyBounds(e){let t=this;t.style.position=`absolute`,typeof e.x==`number`&&(t.style.left=`${e.x}px`),typeof e.y==`number`&&(t.style.top=`${e.y}px`),typeof e.w==`number`&&(t.style.width=`${e.w}px`,t.style.setProperty(`--ui-win-width`,`${e.w}px`)),typeof e.h==`number`&&(t.style.height=`${e.h}px`,t.style.setProperty(`--ui-win-height`,`${e.h}px`)),typeof e.z==`number`&&(t.style.zIndex=String(e.z)),t.style.right=``,t.style.bottom=``,this.managed&&(this.#e.value=0,this.#t.value=0,t.style.transform=``)}setVisible(e){this.toggleAttribute(`hidden-window`,!e),this.style.visibility=e?``:`hidden`,this.style.pointerEvents=e?``:`none`}get isMaximized(){return this.hasAttribute(`maximized`)||this.hasAttribute(`data-desk-max`)||this.hasAttribute(`data-mobile-max`)}get isMinimized(){return this.hasAttribute(`minimized`)}get usesNativeWindowDrag(){let e=this.nativeSurface;return e===`wco`||e===`standalone`}enterNativeMode(){if(this.managed){this.#C(`window-native`);return}this.nativeMode=!0,this.#C(`window-native`)}exitNativeMode(){if(this.managed){this.#C(`window-exit-native`);return}this.nativeMode=!1,this.#C(`window-exit-native`)}#C(e,t=!1){return this.dispatchEvent(new CustomEvent(e,{bubbles:!0,composed:!0,cancelable:t}))}toggleMaximize(){let e=this.isMaximized;if(this.managed){this.#C(e?`window-restore`:`window-maximize`);return}let t=!e;this.toggleAttribute(`maximized`,t),t&&this.removeAttribute(`minimized`),this.#S(),this.#C(t?`window-maximize`:`window-restore`)}toggleMinimize(){if(this.managed){this.#C(this.isMinimized?`window-restore`:`window-minimize`);return}let e=!this.isMinimized;this.toggleAttribute(`minimized`,e),e&&this.removeAttribute(`maximized`),this.#C(e?`window-minimize`:`window-restore`)}restoreWindow(){if(this.managed){this.#C(`window-restore`);return}let e=this.isMinimized,t=this.isMaximized;this.removeAttribute(`minimized`),this.removeAttribute(`maximized`),(e||t)&&this.#C(`window-restore`)}closeWindow(){this.#C(`window-close`,!0),this.isConnected&&this.remove()}#w(){this.#i||=s(this,`pointerdown`,()=>{this.requestFocus()},{capture:!0,passive:!0})}requestFocus(){this.dispatchEvent(new CustomEvent(`window-focus`,{bubbles:!0,composed:!0}))}bringToFront(e){let t=this;Number.isFinite(e)&&(t.style.zIndex=String(e)),t.toggleAttribute(`data-focused`,!0)}clearFocused(){this.toggleAttribute(`data-focused`,!1)}#T(e){let t=typeof e.composedPath==`function`?e.composedPath():[];for(let e of t){if(!(e instanceof Element))continue;let t=e.getAttribute?.(`data-ui-win-action`);if(t===`close`||t===`exit-native`||t===`maximize`||t===`minimize`)return t;if(e.matches?.(`.title-close`))return`close`;if(e.matches?.(`.title-exit-native`))return`exit-native`;if(e.matches?.(`.title-maximize`))return`maximize`;if(e.matches?.(`.title-minimize`))return`minimize`}let n=e.target;if(n instanceof Element){let e=n.closest?.(`[data-ui-win-action], .title-close, .title-exit-native, .title-maximize, .title-minimize`)??null;if(!e)return null;let t=e.getAttribute(`data-ui-win-action`);if(t===`close`||t===`exit-native`||t===`maximize`||t===`minimize`)return t;if(e.classList.contains(`title-close`))return`close`;if(e.classList.contains(`title-exit-native`))return`exit-native`;if(e.classList.contains(`title-maximize`))return`maximize`;if(e.classList.contains(`title-minimize`))return`minimize`}return null}#E(){let e=typeof performance<`u`?performance.now():Date.now();return e-this.#d<280?!1:(this.#d=e,!0)}#D(e){e===`close`?this.closeWindow():e===`exit-native`?this.exitNativeMode():e===`maximize`?this.nativeMode&&this.nativeSurface===`fallback`?this.exitNativeMode():this.toggleMaximize():this.toggleMinimize()}#O(e){let t=this.#T(e);return t?(e.preventDefault(),e.stopPropagation(),e.stopImmediatePropagation?.(),this.#E()&&this.#D(t),!0):!1}#k(){let e=this.shadowRoot;if(e)for(let[t,n]of[[`minimize`,`.title-minimize`],[`maximize`,`.title-maximize`],[`close`,`.title-close`],[`exit-native`,`.title-exit-native`]]){let r=e.querySelector(n);if(!r)continue;r.setAttribute(`data-ui-win-action`,t);let i=e=>{e.preventDefault(),e.stopPropagation(),e.stopImmediatePropagation?.(),this.#E()&&this.#D(t)};r.onclick=i,r.onpointerup=e=>{e.button===0&&i(e)}}}#A(){let e=this.shadowRoot;if(!e)return;let t=this.titleHandler,n=t instanceof HTMLElement?t:e.querySelector(`.title-handler`),r=e.querySelector(`.title-handler-buttons`);if(!n||!r)return;if(this.#k(),this.#l){this.#x(),this.#S();return}let i=e=>{this.#O(e)},a=e=>{this.#T(e)||(typeof e.composedPath==`function`?e.composedPath():[]).some(e=>e instanceof Element&&e.classList?.contains(`title-handler`))&&(e.target?.closest?.(`button, a, input, textarea, select, [data-no-drag]`)||(e.preventDefault(),this.#E()&&this.toggleMaximize()))},o=s(e,`click`,i,{capture:!0}),c=s(e,`pointerup`,i,{capture:!0}),l=s(this,`click`,i,{capture:!0}),u=s(this,`pointerup`,i,{capture:!0}),d=s(this,`dblclick`,a,{capture:!0});typeof MutationObserver<`u`&&!this.#o&&(this.#o=new MutationObserver(()=>{this.#k(),this.#x(),this.#S()}),this.#o.observe(r,{childList:!0,subtree:!0})),this.#a=()=>{o?.(),c?.(),l?.(),u?.(),d?.(),this.#o?.disconnect(),this.#o=null,this.#a=null,this.#l=!1},this.#l=!0,this.#x(),this.#S()}#j(){let e=this.shadowRoot??this,t=this.titleHandler,r=t instanceof HTMLElement?t:e.querySelector?.(`.title-handler`);if(!r||this.#n)return;if(this.usesNativeWindowDrag){this.#n=()=>{this.#n=null};return}this.managed||n(this,O`transform: translate(${this.#e}px, ${this.#t}px)`);let i=new Map,a=s(r,`pointerdown`,e=>{if(e.button!==0||this.#T(e)||e.target?.closest(`button, a, input, textarea, select, [data-no-drag]`)||this.isMaximized||this.isMinimized||this.nativeMode)return;this.requestFocus();let t=this;i.set(e.pointerId,{sx:e.clientX,sy:e.clientY,ox:this.#e.value,oy:this.#t.value,bx:Number.parseFloat(t.style.left||`0`)||0,by:Number.parseFloat(t.style.top||`0`)||0,dragging:!1});let n=s(document.body,`pointermove`,e=>{let t=i.get(e.pointerId);if(!t)return;let n=e.clientX-t.sx,r=e.clientY-t.sy;if(!t.dragging){if(Math.hypot(n,r)<4)return;t.dragging=!0;try{e.preventDefault()}catch{}this.setPointerCapture?.(e.pointerId)}if(this.managed){this.dispatchEvent(new CustomEvent(`window-move`,{bubbles:!0,composed:!0,detail:{x:t.bx+n,y:t.by+r,dx:n,dy:r}}));return}this.#e.value=t.ox+n,this.#t.value=t.oy+r}),r=e=>{if(!i.has(e.pointerId))return;let t=i.get(e.pointerId);if(i.delete(e.pointerId),t?.dragging)try{this.releasePointerCapture?.(e.pointerId)}catch{}n?.(),a?.(),o?.()},a=s(document.body,`pointerup`,r),o=s(document.body,`pointercancel`,r)});this.#n=()=>{a?.()}}#M(){let e=this.shadowRoot??this,t=this.resizer,n=t instanceof HTMLElement?t:e.querySelector?.(`.window-resizer`);if(!n||this.#r)return;let r=new Map,i=s(n,`pointerdown`,e=>{if(e.button!==0||this.isMaximized||this.isMinimized||this.nativeMode)return;e.preventDefault(),e.stopPropagation(),this.requestFocus(),this.setPointerCapture?.(e.pointerId);let t=this.getBoundingClientRect();r.set(e.pointerId,{sx:e.clientX,sy:e.clientY,w:t.width,h:t.height});let n=s(document.body,`pointermove`,e=>{let t=r.get(e.pointerId);if(!t)return;let n=Math.max(zc.w,t.w+(e.clientX-t.sx)),i=Math.max(zc.h,t.h+(e.clientY-t.sy));if(this.managed){this.dispatchEvent(new CustomEvent(`window-resize`,{bubbles:!0,composed:!0,detail:{w:n,h:i}}));return}this.style.width=`${n}px`,this.style.height=`${i}px`,this.style.setProperty(`--ui-win-width`,`${n}px`),this.style.setProperty(`--ui-win-height`,`${i}px`)}),i=e=>{if(r.has(e.pointerId)){r.delete(e.pointerId);try{this.releasePointerCapture?.(e.pointerId)}catch{}n?.(),a?.(),o?.()}},a=s(document.body,`pointerup`,i),o=s(document.body,`pointercancel`,i)});this.#r=()=>{i?.()}}},z([_({source:`query-shadow`,name:`.title-handler`})],Bc.prototype,`titleHandler`,void 0),z([_({source:`query-shadow`,name:`.content-handler`})],Bc.prototype,`contentHandler`,void 0),z([_({source:`query-shadow`,name:`.footer-handler`})],Bc.prototype,`footerHandler`,void 0),z([_({source:`query-shadow`,name:`.window-resizer`})],Bc.prototype,`resizer`,void 0),Bc=z([x(`ui-window`)],Bc)})))()}function Hc(){return(Hc=e((()=>{T()})))()}function Uc(){return(Uc=e((()=>{T(),Hc(),[`button:not([disabled])`,`[href]`,`input:not([disabled])`,`select:not([disabled])`,`textarea:not([disabled])`,`[tabindex]:not([tabindex='-1'])`].join(`,`)})))()}function Wc(){return(Wc=e((()=>{T()})))()}function Gc(){return(Gc=e((()=>{V(),Mn(),bs(),Ws(),qs(),Xs(),dt(),Et(),hn(),oo(),Vc(),Hc(),Uc(),Wc(),Ye()})))()}function Kc(){return{...qc}}var qc;function Jc(){return(Jc=e((()=>{Ls(),Gc(),qc={loadStyles:!0,includeGlobalNativeControlStyles:!1,styleVariant:`veela-basic`},(async()=>{let e=Kc();e.loadStyles!==!1&&await Is({includeGlobalNativeControls:e.includeGlobalNativeControlStyles===!0})})()?.catch?.(()=>void 0)})))()}export{V as C,B as S,Xe as T,hn as _,ji as a,dt as b,Yn as c,Mn as d,bn as f,xn as g,kn as h,Ri as i,Dn as l,vn as m,bs as n,Xn as o,yn as p,fs as r,Tr as s,Jc as t,wn as u,sn as v,z as w,at as x,Et as y};