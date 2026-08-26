import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{A as t,G as n,O as r,W as i,k as a,t as o}from"./src-C7QuTtnr.js";import{n as s,t as c}from"./preload-helper-DcjHEl26.js";import{$ as l,B as u,E as d,G as f,H as p,J as m,K as h,Q as g,V as _,X as v,Y as y,et as b,it as x,nt as S,ot as C,t as w,tt as T}from"./src-DpSa8Erd.js";import{a as E,j as D,k as O,st as k,u as A}from"./HistoryManager-B52KbQG4.js";import{a as ee,r as te}from"./image-DPhA3Yo2.js";import{i as ne,s as j}from"./icon-BI41b7Mj.js";import{A as M,C as re,D as N,E as ie,F as ae,I as oe,L as se,M as ce,O as le,S as ue,T as de,_ as fe,a as pe,b as me,c as he,d as ge,f as _e,g as ve,h as ye,i as be,j as xe,k as Se,l as Ce,m as we,n as Te,o as Ee,r as De,s as Oe,t as ke,u as Ae,v as je,w as Me,x as Ne,y as Pe}from"./launcher-state-CTBiV1a1.js";function P(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a}function Fe(){return(Fe=e((()=>{})))()}var F,Ie;function I(){return(I=e((()=>{w(),j(),F=class extends y(){theme=`default`;render=function(){return E`<slot></slot>`};constructor(){super()}onRender(){return super.onRender()}connectedCallback(){return super.connectedCallback?.()??this}onInitialize(){let e=super.onInitialize()??this;return e.loadStyleLibrary(ne()),e}},P([g({source:`attr`})],F.prototype,`theme`,void 0),F=P([v(`ui-element`)],F),Ie=F})))()}var Le,L,Re,ze,Be,Ve,He,Ue,We,R,Ge,Ke,qe;function Je(){return(Je=e((()=>{w(),Le=`2147483600`,L=new Map,Re=new Map,ze=null,Be=[`[data-chrome-flyout-anchor]`,`.env-shell-taskbar__clock`,`.env-ui-statusbar__clock`,`.env-device-tray`],Ve=()=>{if(typeof document<`u`){if(document.querySelector(`.env-shell-chrome[data-desktop]`))return!0;let e=document.querySelector(`[data-chrome-layout]`);if(e?.dataset.chromeLayout===`desktop`)return!0;if(e?.dataset.chromeLayout===`mobile`)return!1}return typeof matchMedia<`u`&&matchMedia(`(min-width: 641px)`).matches},He=e=>{ze=e},Ue=e=>{let t=`data-env-shell-overlays`,n=e||ze||document.querySelector(`.env-shell-root`)||document.querySelector(`#app`)||document.body,r=n.querySelector(`[${t}]`);if(r)return r.style.zIndex||(r.style.zIndex=Le),r;try{let e=globalThis.__ENV_OVERLAY_MOUNT__;if(typeof e==`function`)return e(n)}catch{}let i=document.createElement(`div`);return i.setAttribute(t,``),i.className=`env-shell-overlays`,i.setAttribute(`data-part`,`env-overlays`),i.style.cssText=`position:fixed;inset:0;pointer-events:none;z-index:${Le};box-sizing:border-box;`,n.appendChild(i),i},We=(e,t)=>{let n=Ve();if(e.style.position=`fixed`,e.style.zIndex=String(Number(Le)+1),e.style.pointerEvents=`auto`,e.style.margin=`0`,n){e.style.top=`auto`,e.style.left=`auto`,e.style.right=`0.75rem`,e.style.bottom=`4.5rem`,e.style.transform=`none`;return}if(t===`calendar`){e.style.top=`50%`,e.style.left=`50%`,e.style.right=`auto`,e.style.bottom=`auto`,e.style.transform=`translate(-50%, -50%)`;return}e.style.top=`calc(env(safe-area-inset-top, 0px) + 0.75rem)`,e.style.left=`50%`,e.style.right=`auto`,e.style.bottom=`auto`,e.style.transform=`translateX(-50%)`},R=e=>{let t=L.get(e);if(!t)return;L.delete(e);let n=Re.get(e);Re.delete(e),n?.disposeDismiss(),n?.unregisterBack();try{let e=t.el;typeof e.close==`function`?e.close():(e.removeAttribute(`open`),e.hidden=!0),e.dispatchEvent(new CustomEvent(`chrome-flyout-close`,{bubbles:!0}))}catch{}},Ge=e=>{L.has(e.kind)&&R(e.kind);for(let t of[...L.keys()])t!==e.kind&&R(t);L.set(e.kind,{...e,close:()=>R(e.kind)}),e.el.hidden=!1,e.el.removeAttribute(`hidden`),e.el.setAttribute(`open`,``),Re.set(e.kind,{disposeDismiss:p({root:document,inside:e.el,isInside:t=>e.contains(t.target),exceptSelectors:Be,onDismiss:()=>R(e.kind)}),unregisterBack:u({id:`chrome-flyout-${e.kind}`,kind:`overlay`,element:e.el,isActive:()=>L.get(e.kind)?.el===e.el&&e.el.isConnected&&!e.el.hidden&&e.el.hasAttribute(`open`),close:()=>(R(e.kind),!0)})})},Ke=e=>L.has(e),qe=(e,t)=>{if(Ke(e)){R(e);return}let n=t();Ge(n)}})))()}var Ye;function Xe(){return(Xe=e((()=>{Ye=`/*
 * Filename: CalendarFlyout.scss
 * FullPath: modules/projects/fl.ui/src/ui/navigation/calendar/CalendarFlyout.scss
 * Change date and time: 08.30.00_02.08.2026
 * Reason for changes: Win11-like calendar flyout — compact acrylic-ish panel, no backdrop-filter.
 */
@layer calendar {
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
}`})))()}function Ze(e){try{let t=new Intl.Locale(e),n=(t.weekInfo??t.getWeekInfo?.())?.firstDay;if(typeof n==`number`&&n>=1&&n<=7)return n%7}catch{}return 0}function Qe(e,t){let n=new Intl.DateTimeFormat(e,{weekday:`short`,timeZone:`UTC`}),r=[];for(let e=0;e<7;e++){let i=(t+e)%7;r.push(n.format(new Date(at+i*ot)))}return r}function $e(e,t){return e.getFullYear()===t.getFullYear()&&e.getMonth()===t.getMonth()&&e.getDate()===t.getDate()}function et(e,t,n){let r=new Date,i=new Date(e,t,1),a=new Date(e,t+1,0).getDate(),o=(i.getDay()-n+7)%7,s=Math.ceil((o+a)/7)*7,c=[];for(let n=0;n<s;n++){let i=n-o+1,a=new Date(e,t,i);c.push({date:a,day:a.getDate(),otherMonth:a.getMonth()!==t,isToday:$e(a,r)})}return c}function tt(){if(ct?.isConnected)return ct;let e=Ue(),t=e.querySelector(`ui-calendar-flyout`);return t||(t=document.createElement(`ui-calendar-flyout`),t.hidden=!0,e.appendChild(t)),ct=t,t}function nt(e){qe(it,()=>{let e=tt(),t=document.documentElement.getAttribute(`data-theme`);return(t===`light`||t===`dark`)&&(e.dataset.theme=t,e.style.colorScheme=t),We(e,it),e.open(),{kind:it,el:e,close:()=>{e.close(),R(it)},contains:t=>t instanceof Node&&e.contains(t)}})}var rt,it,at,ot,st,ct;function lt(){return(lt=e((()=>{w(),o(),I(),j(),Je(),Xe(),rt=t(Ye),it=`calendar`,at=Date.UTC(2023,0,1),ot=864e5,st=class extends F{#e;#t;#n=null;#r=null;styles=function(){return rt};render=function(){return E`<div class="ui-cal-flyout__panel" part="panel">
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
        </div>`};constructor(){super();let e=new Date;this.#e=e.getFullYear(),this.#t=e.getMonth()}onRender(){super.onRender(),this.#i(),this.#c()}disconnectedCallback(){this.#r?.(),this.#r=null,super.disconnectedCallback?.()}#i(){let e=this.shadowRoot;if(!e||this.#r)return;let t=n(e,`click`,e=>{let t=e.target,n=t?.closest?.(`[data-nav]`);if(n){n.dataset.nav===`prev`?this.#a(-1):n.dataset.nav===`next`&&this.#a(1);return}let r=t?.closest?.(`.ui-cal-flyout__day`);r&&this.#s(r)});this.#r=()=>t?.()}#a(e){this.#t+=e,this.#t<0?(this.#t=11,--this.#e):this.#t>11&&(this.#t=0,this.#e+=1),this.#c()}#o(){let e=new Date;this.#e=e.getFullYear(),this.#t=e.getMonth(),this.#c()}#s(e){let t=e.dataset.date;t&&(this.#n=new Date(t),this.shadowRoot?.querySelectorAll(`.ui-cal-flyout__day[data-selected]`)?.forEach(e=>e.removeAttribute(`data-selected`)),e.setAttribute(`data-selected`,``),this.dispatchEvent(new CustomEvent(`calendar-select`,{bubbles:!0,composed:!0,detail:{date:this.#n}})))}#c(){let e=this.shadowRoot;if(!e)return;let t=typeof navigator<`u`?navigator.language:void 0,n=Ze(t??`en-US`),r=new Date,i=e.querySelector(`.ui-cal-flyout__today`);i&&(i.textContent=r.toLocaleDateString(t,{weekday:`long`,month:`long`,day:`numeric`,year:`numeric`}));let a=e.querySelector(`.ui-cal-flyout__month-label`);a&&(a.textContent=new Date(this.#e,this.#t,1).toLocaleDateString(t,{month:`long`,year:`numeric`}));let o=e.querySelector(`.ui-cal-flyout__weekdays`);o&&o.replaceChildren(...Qe(t??`en-US`,n).map(e=>{let t=document.createElement(`span`);return t.className=`ui-cal-flyout__weekday`,t.setAttribute(`role`,`columnheader`),t.textContent=e,t}));let s=e.querySelector(`.ui-cal-flyout__grid`);if(s){let e=et(this.#e,this.#t,n);s.replaceChildren(...e.map(e=>{let n=document.createElement(`button`);return n.type=`button`,n.className=`ui-cal-flyout__day`,n.textContent=String(e.day),n.dataset.date=e.date.toISOString(),n.setAttribute(`role`,`gridcell`),e.otherMonth&&n.setAttribute(`data-other-month`,``),e.isToday&&n.setAttribute(`data-today`,``),this.#n&&$e(e.date,this.#n)&&n.setAttribute(`data-selected`,``),n.setAttribute(`aria-label`,e.date.toLocaleDateString(t,{weekday:`long`,month:`long`,day:`numeric`,year:`numeric`})),n}))}}open(){this.#o(),this.removeAttribute(`hidden`),this.hidden=!1,this.setAttribute(`open`,``)}close(){this.hidden=!0,this.setAttribute(`hidden`,``),this.removeAttribute(`open`)}toggle(e){this.hasAttribute(`open`)?this.close():this.open()}},st=P([v(`ui-calendar-flyout`)],st),ct=null})))()}function ut(){let e=mt.get();return typeof e==`function`?e:null}var dt,ft,pt,mt;function ht(){return(ht=e((()=>{dt=`__CWSP_SPEED_DIAL_VIEW_OPENER_V1__`,ft=`__CWSP_HOME_OVERLAY_MOUNT_V1__`,pt=e=>{let t=globalThis;return{get:()=>e in t?t[e]:null,set:n=>{t[e]=n}}},mt=pt(dt),pt(ft)})))()}var gt;function _t(){return(_t=e((()=>{gt=`/*
 * Filename: QuickSettings.scss
 * FullPath: modules/projects/fl.ui/src/ui/navigation/settings/QuickSettings.scss
 * Change date and time: 09.40.00_19.08.2026
 * Reason for changes: Footer row for Settings / Explorer shortcut buttons.
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
@layer ui-quick-settings {
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
    color: var(--qs-on-surface);
    color: contrast-color(var(--qs-surface));
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
    color: contrast-color(var(--qs-surface));
    color: color-mix(in oklch, contrast-color(var(--qs-surface)) 40%, var(--color-primary, var(--qs-primary)));
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
    color: contrast-color(inherit(background-color));
    text-align: start;
    cursor: pointer;
    transition: background-color 140ms ease, color 140ms ease;
  }
  .qs-tile:hover {
    background: color-mix(in oklab, var(--qs-on-surface) 14%, transparent);
    color: contrast-color(inherit(background-color));
  }
  .qs-tile:active {
    background: color-mix(in oklab, var(--qs-on-surface) 18%, transparent);
    color: contrast-color(inherit(background-color));
  }
  .qs-tile:focus-visible {
    outline: 2px solid var(--color-primary, var(--qs-primary));
    outline-offset: 2px;
  }
  .qs-tile[aria-pressed=true] {
    background: color-mix(in oklab, var(--color-primary, var(--qs-primary)) 26%, transparent);
    color: var(--color-primary, var(--qs-primary));
    color: color-mix(in oklch, contrast-color(var(--qs-surface, var(--color-surface))) 60%, var(--color-primary, var(--qs-primary)));
  }
  .qs-tile[aria-pressed=true] .qs-tile-icon {
    --icon-color: var(--color-primary, var(--qs-primary));
    --icon-color: color-mix(in oklch, contrast-color(var(--qs-surface, var(--color-surface))) 60%, var(--color-primary, var(--qs-primary)));
    --icon-color: currentColor;
  }
  .qs-tile-text {
    display: flex;
    flex-direction: column;
    gap: 0.05rem;
    min-inline-size: 0;
    overflow: hidden;
    color: color-mix(in oklch, contrast-color(var(--qs-surface)) 40%, var(--color-primary, var(--qs-primary)));
  }
  .qs-tile-label {
    font-size: 0.78rem;
    font-weight: 600;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: contrast-color(var(--qs-surface));
  }
  .qs-tile-sub {
    font-size: 0.68rem;
    font-weight: 500;
    opacity: 0.7;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: contrast-color(var(--qs-surface));
  }
  .qs-sliders {
    display: grid;
    gap: 0.6rem;
    padding-block-start: 0.7rem;
    border-block-start: 1px solid var(--qs-outline);
    color: contrast-color(var(--qs-surface));
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
    color: contrast-color(var(--qs-surface));
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
    color: contrast-color(inherit(background-color));
    cursor: pointer;
  }
  .qs-slider::-webkit-slider-runnable-track {
    block-size: 4px;
    border-radius: 999px;
    background: color-mix(in oklab, var(--qs-on-surface) 18%, transparent);
    color: contrast-color(inherit(background-color));
  }
  .qs-slider::-moz-range-track {
    block-size: 4px;
    border-radius: 999px;
    background: color-mix(in oklab, var(--qs-on-surface) 18%, transparent);
    color: contrast-color(inherit(background-color));
  }
  .qs-slider::-webkit-slider-thumb {
    appearance: none;
    -webkit-appearance: none;
    inline-size: 1rem;
    block-size: 1rem;
    margin-block-start: -6px;
    border-radius: 50%;
    border: none;
    background: color-mix(in oklch, contrast-color(var(--qs-surface, var(--color-surface))) 40%, var(--color-primary, var(--qs-primary)));
    color: color-mix(in oklch, contrast-color(var(--qs-surface, var(--color-surface))) 40%, var(--color-primary, var(--qs-primary)));
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.35);
  }
  .qs-slider::-moz-range-thumb {
    inline-size: 1rem;
    block-size: 1rem;
    border-radius: 50%;
    border: none;
    background: color-mix(in oklch, contrast-color(var(--qs-surface, var(--color-surface))) 40%, var(--color-primary, var(--qs-primary)));
    color: color-mix(in oklch, contrast-color(var(--qs-surface, var(--color-surface))) 40%, var(--color-primary, var(--qs-primary)));
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.35);
  }
  .qs-slider:focus-visible::-webkit-slider-thumb {
    outline: 2px solid var(--color-primary, var(--qs-primary));
    outline-offset: 2px;
    color: color-mix(in oklch, contrast-color(var(--qs-surface, var(--color-surface))) 40%, var(--color-primary, var(--qs-primary)));
    background: color-mix(in oklch, contrast-color(var(--qs-surface, var(--color-surface))) 40%, var(--color-primary, var(--qs-primary)));
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
    color: contrast-color(var(--qs-surface));
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
}`})))()}function vt(){if(Xt?.isConnected)return Xt;let e=Ue(),t=e.querySelector(`ui-quick-settings`);return t||(t=document.createElement(`ui-quick-settings`),t.hidden=!0,e.appendChild(t)),Xt=t,t}function yt(e){qe(St,()=>{let e=vt(),t=document.documentElement.getAttribute(`data-theme`);return(t===`light`||t===`dark`)&&(e.dataset.theme=t,e.style.colorScheme=t),We(e,St),e.open(),{kind:St,el:e,close:()=>{e.close(),R(St)},contains:t=>t instanceof Node&&e.contains(t)}})}function bt(){R(St)}var xt,St,Ct,wt,Tt,Et,Dt,Ot,kt,At,jt,Mt,Nt,Pt,Ft,It,Lt,Rt,zt,Bt,Vt,Ht,Ut,Wt,Gt,Kt,qt,Jt,Yt,Xt;function Zt(){return(Zt=e((()=>{w(),o(),I(),j(),ht(),Je(),_t(),xt=t(gt),St=`quick-settings`,Ct=`data-theme`,wt=`rs-appearance-theme`,Tt=`appearance.theme`,Et=[`rs-settings`,`cwsp-settings`,`u2-settings`],Dt=()=>{try{return matchMedia?.(`(prefers-color-scheme: dark)`)?.matches??!0}catch{return!0}},Ot=e=>{for(let t of Et)try{let n=localStorage.getItem(t);if(!n)continue;let r=JSON.parse(n);if(!r||typeof r!=`object`)continue;r.appearance={...r.appearance??{},theme:e},localStorage.setItem(t,JSON.stringify(r))}catch{}},kt=()=>{try{let e=document.documentElement.getAttribute(Ct);if(e===`light`||e===`dark`)return e;let t=localStorage.getItem(wt);if(t===`light`||t===`dark`)return t}catch{}return Dt()?`dark`:`light`},At=e=>{let t=document.documentElement,n=e===`auto`?Dt()?`dark`:`light`:e,r=e===`auto`?`auto`:e;t.setAttribute(`data-scheme`,r),t.setAttribute(Ct,n),t.style.colorScheme=n;try{document.body&&(document.body.style.colorScheme=n)}catch{}try{document.querySelectorAll(`.env-shell-root, [data-shell], ui-window`).forEach(e=>{let t=e;t.dataset.theme=n,t.style.colorScheme=n;let r=t.shadowRoot?.querySelector?.(`.app-shell`);r&&(r.dataset.theme=n,r.style.colorScheme=n)})}catch{}try{localStorage.setItem(wt,e===`auto`?`auto`:e),localStorage.setItem(Tt,e===`auto`?`auto`:e)}catch{}e!==`auto`&&Ot(e),t.dispatchEvent(new CustomEvent(`u2-theme-change`,{bubbles:!0,detail:{source:`quick-settings`,theme:n,preference:e}}))},jt=()=>{try{let e=String(localStorage.getItem(wt)||``).trim().toLowerCase();if(e===`light`||e===`dark`||e===`auto`)return e;let t=String(localStorage.getItem(Tt)||``).trim().toLowerCase();if(t===`light`||t===`dark`||t===`auto`)return t}catch{}return`auto`},Mt=()=>{let e=globalThis;if(e.__CWSP_AUTO_THEME_FOLLOW__)return;e.__CWSP_AUTO_THEME_FOLLOW__=!0;let t=typeof matchMedia==`function`?matchMedia(`(prefers-color-scheme: dark)`):null;if(!t)return;let n=()=>{jt()===`auto`&&At(`auto`)};try{t.addEventListener(`change`,n)}catch{try{t.addListener(n)}catch{}}try{n()}catch{}},Nt=e=>{document.documentElement.style.setProperty(`--orientation-lock`,e?`unlocked`:`locked`),document.documentElement.style.setProperty(`--orientation-lock-angle`,e?`0deg`:`90deg`),Promise.try(async()=>{try{let t=screen.orientation;if(e){t.unlock?.();return}if(typeof t.lock!=`function`)return;let n=t.lock(t.type||`natural`);n&&typeof n.catch==`function`&&await n.catch(()=>{})}catch(e){console.warn(e)}})?.catch?.(console.warn.bind(console))},Pt=`env-night-filter`,Ft=`2147483001`,It=`rs-night-filter`,Lt=`rs-brightness-filter`,Rt=e=>Math.max(0,Math.min(100,Number.isFinite(e)?e:0)),zt=()=>{let e=document.getElementById(Pt);if(e instanceof HTMLElement)return e;let t=document.createElement(`div`);return t.id=Pt,t.setAttribute(`aria-hidden`,`true`),t.style.cssText=[`dynamic-range-limit:no-limit`,`color-space:display-p3`,`position:fixed`,`inset:0`,`pointer-events:none`,`z-index:${Ft}`,`background-color:color(display-p3 1 0.55 0.24)`,`mix-blend-mode:multiply`,`opacity:0`,`visibility:hidden`,`transition:opacity 160ms ease`].join(`;`),(document.body??document.documentElement).appendChild(t),t},Bt=e=>{let t=Rt(e),n=zt(),r=t/100;n.style.opacity=String(r),n.style.visibility=r>=.01?`visible`:`hidden`;try{localStorage.setItem(It,String(t))}catch{}},Vt=e=>{let t=Rt(e);zt(),t<=50?.4+t/50*.6:1+(t-50)/50*.2;try{localStorage.setItem(Lt,String(t))}catch{}},Ht=(e,t)=>{try{let n=localStorage.getItem(e);if(n==null)return t;let r=Number(n);return Number.isFinite(r)?Rt(r):t}catch{return t}},Ut=()=>{let e=Ht(It,0),t=Ht(Lt,50);return Bt(e),Vt(t),{night:e,brightness:t}},typeof document<`u`&&(document.readyState===`loading`?document.addEventListener(`DOMContentLoaded`,()=>Ut(),{once:!0}):Ut()),Wt=[`wifi`,`bluetooth`,`focus`,`airplane`,`orientation`],Gt={light:`sun`,dark:`moon`},Kt={light:`Light`,dark:`Dark`},qt=e=>{let t=e.querySelector(`[data-qs-tile="theme"]`);if(!t)return;let n=kt();t.querySelector(`ui-icon`)?.setAttribute(`icon`,Gt[n]);let r=t.querySelector(`[data-qs-tile-sub]`);r&&(r.textContent=Kt[n]),t.setAttribute(`aria-pressed`,n===`dark`?`true`:`false`)},Jt=e=>{let t=e.shadowRoot,n=t?.querySelector(`.qs-panel`);if(!t||!n||n.hasAttribute(`data-qs-wired`))return;n.setAttribute(`data-qs-wired`,``),qt(t),t.querySelector(`[data-qs-tile="theme"]`)?.addEventListener(`click`,()=>{let e=kt()===`dark`?`light`:`dark`;At(e),qt(t)});let r=e=>!!e?.getAttribute?.(`aria-pressed`)&&e?.getAttribute?.(`aria-pressed`)===`true`;t.querySelector?.(`[data-qs-tile="orientation"]`)?.addEventListener?.(`click`,e=>{let t=i((e?.target?.matches?.(`[data-qs-tile="orientation"]`)?e?.target:e?.target?.querySelector?.(`[data-qs-tile="orientation"]`))||e?.target,`[data-qs-tile="orientation"]`),n=r(t);Nt(n);let a=t?.matches?.(`ui-icon`)?t:t?.querySelector?.(`ui-icon`);a&&a.setAttribute?.(`icon`,n?`device-rotate`:`lock`),a&&a.setAttribute?.(`icon-style`,`duotone`)});for(let e of Wt){let n=t.querySelector(`[data-qs-tile="${e}"]`);n&&n.addEventListener(`click`,()=>{let e=n.getAttribute(`aria-pressed`)!==`true`;n.setAttribute(`aria-pressed`,String(e));let t=n.querySelector(`[data-qs-tile-sub]`);t&&(t.textContent=e?`On`:`Off`)})}let{night:a,brightness:o}=Ut(),s=t.querySelector(`[data-qs-slider="night"]`),c=t.querySelector(`[data-qs-slider="brightness"]`);s&&(s.value=String(a),s.addEventListener(`input`,()=>Bt(s.valueAsNumber))),c&&(c.value=String(o),c.addEventListener(`input`,()=>Vt(c.valueAsNumber)));let l=e=>{bt();let t=()=>{let t=ut();if(typeof t==`function`){t(e,{});return}let n=`#${e}`;typeof location<`u`&&location.hash!==n&&C(n)};typeof requestAnimationFrame==`function`?requestAnimationFrame(t):queueMicrotask(t)};t.querySelectorAll(`[data-qs-open]`).forEach(e=>{e.addEventListener(`click`,()=>{let t=String(e.getAttribute(`data-qs-open`)||``).trim();(t===`settings`||t===`explorer`)&&l(t)})})},Yt=class extends F{constructor(){super()}styles=()=>xt;render=()=>E`
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
</div>`;onRender(){return super.onRender(),Jt(this),this}open(){qt(this.shadowRoot),this.removeAttribute(`hidden`),this.hidden=!1,this.setAttribute(`open`,``)}close(){this.hidden=!0,this.setAttribute(`hidden`,``),this.removeAttribute(`open`)}toggle(e){this.hasAttribute(`open`)?this.close():this.open()}},Yt=P([v(`ui-quick-settings`)],Yt),Xt=null,Promise.try(()=>{typeof requestAnimationFrame==`function`&&requestAnimationFrame(()=>{Promise.try(()=>{screen?.orientation?.lock?.(`natural`)}).catch(console.warn.bind(console))})}).catch(console.warn.bind(console));try{Mt()}catch{}})))()}var Qt;function $t(){return($t=e((()=>{Qt=`/*
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
@layer ui-statusbar {
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
}`})))()}function en(){if(typeof matchMedia!=`function`)return`unknown`;try{if(matchMedia(`(display-mode: window-controls-overlay)`).matches)return`window-controls-overlay`;if(matchMedia(`(display-mode: fullscreen)`).matches)return`fullscreen`;if(matchMedia(`(display-mode: standalone)`).matches)return`standalone`;if(matchMedia(`(display-mode: minimal-ui)`).matches)return`minimal-ui`;if(matchMedia(`(display-mode: browser)`).matches)return`browser`}catch{}return`unknown`}function tn(){let e=en();if(e===`standalone`||e===`minimal-ui`)return!0;try{if(navigator.standalone===!0)return!0}catch{}return!1}function nn(){if(typeof document<`u`&&document.documentElement.dataset.cwspNativeShell===`capacitor`)return!0;try{let e=globalThis.Capacitor;return typeof e?.isNativePlatform==`function`&&!!e.isNativePlatform()}catch{return!1}}function rn(e){if(nn()||(e.standalone??tn()))return!1;let t=e.displayMode??en(),n=typeof document<`u`&&!!(document.fullscreenElement||document.webkitFullscreenElement);return t===`fullscreen`||n?!0:!e.desktop}function an(e=new Date){let t=e=>String(e).padStart(2,`0`);return{time:`${t(e.getHours())}:${t(e.getMinutes())}`,date:`${t(e.getDate())}.${t(e.getMonth()+1)}.${e.getFullYear()}`}}function on(e=new Date){return an(e).time}function sn(e){let t=!1,n=null,r=(e,t=48)=>{let n=0,r=0,i=0;for(let a=0;a<e.length;a+=4*t){if((e[a+3]??255)<16)continue;let t=e[a]/255,o=e[a+1]/255,s=e[a+2]/255;i=Math.max(i,t,o,s),n+=.2126*t+.7152*o+.0722*s,r++}return r<8||i<.02?null:n/r},i=t=>{let n=t>.55;e.style.setProperty(`--env-status-fg`,n?`#1c1c1e`:`#f5f5f7`),e.style.setProperty(`--env-status-fg-muted`,n?`rgba(28,28,30,0.72)`:`rgba(245,245,247,0.78)`),e.dataset.statusContrast=n?`dark`:`light`},a=()=>{e.style.setProperty(`--env-status-fg`,`var(--wallpaper-contrast-color)`),e.style.setProperty(`--env-status-fg-muted`,`color-mix(in oklab, var(--wallpaper-contrast-color) 78%, transparent)`),e.dataset.statusContrast=`wallpaper`},o=t=>{te(t,[e]),e.dataset.launcherContrast=t>.52?`dark`:`light`},s=()=>{try{for(let t of document.querySelectorAll(`ui-window[managed]`)){if(t.hidden||t.hasAttribute(`hidden`)||t.getAttribute(`aria-hidden`)===`true`)continue;let n=getComputedStyle(t);if(n.display!==`none`&&n.visibility!==`hidden`&&Number(n.opacity)!==0&&(t.hasAttribute(`data-status-gap`)||t.hasAttribute(`data-status-overlay-gap`)||t.getBoundingClientRect().top<Math.max(8,parseFloat(getComputedStyle(e).getPropertyValue(`--env-status-inset-top`))||32)+8))return!0}}catch{}return!1},c=()=>{if(t)return;let n=(document.documentElement.getAttribute(`data-theme`)||``).toLowerCase(),c=s();c&&n===`light`?i(.9):c&&n===`dark`?i(.15):a();try{let t=e.querySelector(`.env-shell-wallpaper canvas`)||document.querySelector(`.env-shell-wallpaper canvas`);if(t instanceof HTMLCanvasElement&&t.width>0&&t.height>0){let e=t.getContext(`2d`,{willReadFrequently:!0});if(e){let n=t.width,i=Math.max(0,Math.round(t.height*.28)),s=Math.max(1,Math.round(t.height*.36)),l=r(e.getImageData(0,i,n,Math.min(s,t.height-i)).data);if(l!=null){o(l),c||a();return}}}}catch{}},l=()=>{n!=null&&clearTimeout(n),n=setTimeout(c,120)};c();let u=typeof MutationObserver==`function`?new MutationObserver(l):null,d=e.querySelector(`.env-shell-wallpaper`)||document.querySelector(`.env-shell-wallpaper`);d&&u&&u.observe(d,{childList:!0,subtree:!0,attributes:!0});let f=typeof MutationObserver==`function`?new MutationObserver(l):null;f?.observe(document.documentElement,{childList:!0,subtree:!0,attributes:!0,attributeFilter:[`hidden`,`data-status-gap`,`data-theme`,`aria-hidden`,`style`,`class`]}),window.addEventListener(`resize`,l),document.addEventListener(`visibilitychange`,l),document.addEventListener(`env-chrome-surface`,l),document.addEventListener(`u2-theme-change`,l);let p=typeof matchMedia==`function`?matchMedia(`(prefers-color-scheme: dark)`):null;p?.addEventListener?.(`change`,l);let m=setInterval(c,8e3);return()=>{t=!0,n!=null&&clearTimeout(n),clearInterval(m),u?.disconnect(),f?.disconnect(),window.removeEventListener(`resize`,l),document.removeEventListener(`visibilitychange`,l),document.removeEventListener(`env-chrome-surface`,l),document.removeEventListener(`u2-theme-change`,l),p?.removeEventListener?.(`change`,l)}}function cn(e){return e.connection}function ln(e){let t=e.toLowerCase();return t===`slow-2g`?`wifi-low`:t===`2g`?`wifi-medium`:`wifi-high`}function un(){let e=ce(`wifi-high`),t=ce(``),n=ce(`battery-full`),r=ce(``),i=ce(``),a=()=>{if(!navigator.onLine){e.value=`wifi-slash`,t.value=`Offline`;return}let n=cn(navigator);if(!n||typeof n.effectiveType!=`string`){e.value=`globe`,t.value=`Online (connection details unavailable)`;return}let r=String(n.effectiveType||``).toLowerCase(),i=typeof n.downlink==`number`?`${n.downlink} Mb/s`:``,a=n.saveData?` · Data saver`:``;t.value=[r.toUpperCase(),i].filter(Boolean).join(` · `)+a,e.value=ln(r)},o=null,s=null,c=null,l=(e,t)=>{let a=Math.max(0,Math.min(100,Math.round(e*100)));if(i.value=`${a}%`,t){n.value=`battery-charging-vertical`,r.value=`Charging · ${i.value}`;return}r.value=`Battery · ${i.value}`,e<=.08?n.value=`battery-warning`:e<=.22?n.value=`battery-low`:e<=.5?n.value=`battery-medium`:e<=.8?n.value=`battery-high`:n.value=`battery-full`};a(),window.addEventListener(`online`,a),window.addEventListener(`offline`,a);let u=cn(navigator);return u?.addEventListener?.(`change`,a),typeof navigator.getBattery==`function`?navigator.getBattery().then(e=>{c=e,o=()=>l(e.level,e.charging),s=o,e.addEventListener(`levelchange`,o),e.addEventListener(`chargingchange`,s),l(e.level,e.charging)}):(n.value=`question`,r.value=`Battery status not supported in this browser`,i.value=`—`),{networkIcon:e,networkTitle:t,batteryIcon:n,batteryTitle:r,batteryPct:i,dispose:()=>{window.removeEventListener(`online`,a),window.removeEventListener(`offline`,a),u?.removeEventListener?.(`change`,a),c&&o&&s&&(c.removeEventListener(`levelchange`,o),c.removeEventListener(`chargingchange`,s))}}}function dn(e,t){let n=E`<div class="env-status-bar__tray ${t}">
        <span class="env-status-bar__chip" title=${e.networkTitle} aria-label=${e.networkTitle}>
            <ui-icon icon=${e.networkIcon} aria-hidden="true"></ui-icon>
        </span>
        <span class="env-status-bar__chip" title=${e.batteryTitle} aria-label=${e.batteryTitle}>
            <ui-icon icon=${e.batteryIcon} aria-hidden="true"></ui-icon>
            <span class="env-status-bar__pct"></span>
        </span>
    </div>`,r=n.querySelector(`.env-status-bar__pct`);return r instanceof HTMLElement&&A(r,{properties:{textContent:e.batteryPct}}),n}function fn(e,t,n){let r=document.createElement(`ui-statusbar`);r.className=`env-ui-statusbar wf-chrome-no-select`,r.setAttribute(`part`,`status-bar`);let i=document.createElement(`div`);i.slot=`left`,i.className=`env-ui-statusbar__left`;let a=document.createElement(`time`);a.className=`env-ui-statusbar__clock`,a.dateTime=``,a.textContent=on(),a.setAttribute(`role`,`button`),a.setAttribute(`tabindex`,`0`),a.setAttribute(`aria-label`,`Calendar`),a.setAttribute(`aria-haspopup`,`dialog`),a.setAttribute(`data-chrome-flyout-anchor`,`calendar`);let o=document.createElement(`div`);o.className=`env-ui-statusbar__intro`,t&&(o.innerHTML=t),i.append(a,o);let s=document.createElement(`div`);s.slot=`center`;let c=document.createElement(`p`);c.className=`env-status-bar__meta`,s.appendChild(c);let l=document.createElement(`div`);l.slot=`right`,l.className=`env-ui-statusbar__right`;let u=dn(n,`env-device-tray env-device-tray--footer`);u.setAttribute(`role`,`button`),u.setAttribute(`tabindex`,`0`),u.setAttribute(`aria-label`,`Quick settings`),u.setAttribute(`aria-haspopup`,`dialog`),u.setAttribute(`data-chrome-flyout-anchor`,`quick-settings`),l.appendChild(u);let d=e=>{e.preventDefault(),e.stopPropagation(),nt(a)},f=e=>{e.preventDefault(),e.stopPropagation(),yt(u)};a.addEventListener(`click`,d),a.addEventListener(`keydown`,e=>{(e.key===`Enter`||e.key===` `)&&d(e)}),u.addEventListener(`click`,f),u.addEventListener(`keydown`,e=>{(e.key===`Enter`||e.key===` `)&&f(e)}),r.append(i,s,l),ae(()=>{let t=e.navEcho.value?` │ ${e.navEcho.value}`:``;c.textContent=`doc=${e.selectedPath.value} │ viewer=${e.viewerStatus.value} │ layout=${e.mqLabel.value}${t}`},[e.selectedPath,e.viewerStatus,e.mqLabel,e.navEcho],{triggerImmediately:!0});let p=()=>{let e=new Date;a.textContent=on(e),a.dateTime=e.toISOString()};p();let m=setInterval(p,15e3);return{element:r,dispose:()=>{clearInterval(m)}}}var pn,mn;function hn(){return(hn=e((()=>{w(),oe(),ee(),lt(),Zt(),I(),$t(),o(),pn=t(Qt),mn=class extends Ie{constructor(){super()}styles=()=>pn;render=()=>E`
<div style="background-color: transparent;" part="left"   class="left"  ><slot name="left"  ></slot></div>
        <div style="background-color: transparent;" part="center" class="center"><slot name="center"></slot></div>
        <div style="background-color: transparent;" part="right"  class="right" ><slot name="right" ></slot></div>`},mn=P([v(`ui-statusbar`)],mn)})))()}function gn(){return(gn=e((()=>{M(),w()})))()}var _n,vn,yn,z,B,V,H,bn,xn,U,Sn,Cn,wn,Tn,W,En,Dn,On,kn,An,jn,Mn,Nn,Pn,Fn,In,Ln,G,Rn;function zn(){return(zn=e((()=>{o(),w(),gn(),_n=320,vn=220,yn=`2147483640`,z=`important`,B=0,V=null,H=null,bn=null,xn=null,U=[],Sn=new Map,Cn=new Map,wn=new Map,Tn=new Map,W=new Map,En=[`left-start`,`right-end`,`left-end`,`bottom-start`,`top-start`],Dn=(e,t)=>{let n=d(e,{...t,strategy:`js`});return typeof requestAnimationFrame==`function`&&requestAnimationFrame(()=>{n.update?.()}),n},On=()=>{let e=document.documentElement,t=String(e.getAttribute(`data-theme`)||``).trim().toLowerCase();if(t===`light`||t===`dark`)return t;let n=String(e.getAttribute(`data-scheme`)||``).trim().toLowerCase();if(n===`light`||n===`dark`)return n;try{let e=String(localStorage.getItem(`rs-appearance-theme`)||``).trim().toLowerCase();if(e===`light`||e===`dark`)return e}catch{}return typeof matchMedia==`function`&&matchMedia(`(prefers-color-scheme: light)`).matches?`light`:`dark`},kn=(e,t)=>{e.style.setProperty(`position`,`fixed`,z),e.style.setProperty(`box-sizing`,`border-box`,z),e.style.setProperty(`min-width`,t?`188px`:`220px`,z),e.style.setProperty(`max-width`,`min(320px, calc(100vw - 24px))`,z),e.style.setProperty(`padding`,t?`0.3rem`:`0.4rem`,z),e.style.setProperty(`border-radius`,`14px`,z),e.style.setProperty(`pointer-events`,`auto`,z),e.style.setProperty(`backdrop-filter`,`blur(10px)`,z),e.style.setProperty(`-webkit-backdrop-filter`,`blur(10px)`,z),e.style.removeProperty(`border`),e.style.removeProperty(`background`),e.style.removeProperty(`color`),e.style.removeProperty(`box-shadow`);let n=On();e.dataset.theme=n,e.style.setProperty(`color-scheme`,n===`light`?`light only`:`dark only`,z)},An=e=>{e.style.setProperty(`list-style`,`none`,z),e.style.setProperty(`list-style-type`,`none`,z),e.style.setProperty(`margin`,`0`,z),e.style.setProperty(`padding`,`0`,z),e.style.setProperty(`display`,`flex`,z),e.style.setProperty(`flex-direction`,`column`,z),e.style.setProperty(`align-items`,`stretch`,z),e.style.setProperty(`gap`,`0.2rem`,z),e.style.setProperty(`width`,`100%`,z),e.style.setProperty(`box-sizing`,`border-box`,z)},jn=(e,t)=>{if(e.style.setProperty(`appearance`,`none`,z),e.style.setProperty(`-webkit-appearance`,`none`,z),e.style.setProperty(`box-sizing`,`border-box`,z),e.style.setProperty(`width`,`100%`,z),e.style.setProperty(`max-width`,`100%`,z),e.style.setProperty(`margin`,`0`,z),e.style.setProperty(`display`,`grid`,z),e.style.setProperty(`grid-template-columns`,`1.375rem minmax(0, 1fr) auto`,z),e.style.setProperty(`align-items`,`center`,z),e.style.setProperty(`justify-items`,`start`,z),e.style.setProperty(`gap`,`0.55rem`,z),e.style.setProperty(`border`,`none`,z),e.style.setProperty(`border-radius`,`10px`,z),e.style.setProperty(`padding`,`0.5rem 0.6rem`,z),e.style.setProperty(`min-height`,`2.35rem`,z),e.style.setProperty(`font`,`inherit`,z),e.style.setProperty(`font-size`,`0.8125rem`,z),e.style.setProperty(`line-height`,`1.25`,z),e.style.setProperty(`text-align`,`start`,z),e.style.setProperty(`cursor`,`pointer`,z),e.style.removeProperty(`background`),e.style.removeProperty(`background-color`),!t)e.style.setProperty(`color`,`inherit`,z);else{let t=On()===`light`?`#9f1239`:`#fecaca`;e.style.setProperty(`color`,t,z),e.style.setProperty(`--cw-menu-fg`,t,z)}},Mn=()=>{let e=document.getElementById(`cw-unified-context-menu-style`);e||(e=document.createElement(`style`),e.id=`cw-unified-context-menu-style`,document.head.appendChild(e)),e.textContent=`
        .cw-context-menu-layer {
            position: fixed;
            inset: 0;
            z-index: var(--cw-context-menu-layer-z, ${yn});
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
    `},Nn=()=>{for(let e of U)try{e()}catch{}U=[]},Pn=e=>{for(let[t,n]of Array.from(Tn.entries()))t>=e&&(clearTimeout(n),Tn.delete(t));for(let[t,n]of Array.from(W.entries()))t>=e&&(clearTimeout(n),W.delete(t))},Fn=e=>{Pn(e);for(let[t,n]of Array.from(Sn.entries()))t>=e&&(wn.get(t)?.dispose(),wn.delete(t),n.remove(),Sn.delete(t),Cn.delete(t))},In=e=>{for(let[t,n]of Array.from(W.entries()))t>=e&&(clearTimeout(n),W.delete(t))},Ln=(e,t,n,r,i)=>{let a=document.createElement(`div`);a.className=`cw-context-menu${t?` cw-context-menu--compact`:``}`,a.setAttribute(`role`,`menu`),a.dataset.menuDepth=String(n),a.style.zIndex=String(n+1);let o=document.createElement(`ul`);o.className=`cw-context-menu__list`,An(o),a.appendChild(o);let s=(e,n,a)=>{if(r!==B||!H?.isConnected||!V?.isConnected||(Fn(a),!e.children?.length))return;let o=Ln(e.children,t,a,r,i);o.classList.add(`cw-context-menu--submenu`),V.appendChild(o),Sn.set(a,o),Cn.set(a,n),wn.set(a,Dn(o,{origin:{type:`element`,element:n},placement:`right-start`,fallbacks:En,strategy:`js`}))},c=(e,t,n)=>{let r=Tn.get(n);r&&clearTimeout(r),In(n);let i=setTimeout(()=>{Tn.delete(n),s(e,t,n)},_n);Tn.set(n,i)},l=e=>{let t=W.get(e);t&&clearTimeout(t);let n=setTimeout(()=>{W.delete(e),Fn(e)},vn);W.set(e,n)};for(let t of e){let e=document.createElement(`button`);e.type=`button`,e.className=`cw-context-menu__item${t.danger?` cw-context-menu__item--danger`:``}`,e.setAttribute(`role`,`menuitem`),e.disabled=!!t.disabled,jn(e,!!t.danger);let i=!!t.children?.length;if(e.innerHTML=`
            <span class="cw-context-menu__icon">${t.icon?`<ui-icon icon="${t.icon}"></ui-icon>`:``}</span>
            <span class="cw-context-menu__label">${t.label}</span>
            <span class="cw-context-menu__chevron">${i?`<ui-icon icon="caret-right"></ui-icon>`:``}</span>
        `,i){let i=n+1;e.setAttribute(`aria-haspopup`,`menu`),e.addEventListener(`pointerenter`,()=>c(t,e,i)),e.addEventListener(`pointerleave`,()=>l(i)),e.addEventListener(`click`,n=>{if(n.preventDefault(),n.stopPropagation(),r!==B||!H?.isConnected)return;In(i);let a=Sn.get(i),o=Cn.get(i);if(a?.isConnected&&o===e){Fn(i);return}s(t,e,i)})}else e.addEventListener(`click`,async e=>{e.preventDefault(),e.stopPropagation(),!(r!==B||!H?.isConnected)&&(G(),!t.disabled&&await t.action())});let a=document.createElement(`li`);a.appendChild(e),o.appendChild(a)}return kn(a,t),a.addEventListener(`pointerenter`,()=>In(n)),a.addEventListener(`pointerleave`,()=>{if(n>0){let e=W.get(n);e&&clearTimeout(e);let t=setTimeout(()=>{W.delete(n),Fn(n)},vn);W.set(n,t)}}),a},G=()=>{Nn(),Pn(0),xn?.(),xn=null,bn?.dispose(),bn=null,Fn(1),Sn.clear(),Cn.clear(),wn.clear(),H?.remove(),H=null,V?.remove(),V=null,B+=1},Rn=e=>{let t=(e.items||[]).filter(e=>e&&e.id&&e.label);if(!t.length){G();return}Mn(),G();let n=B,r=_()??document.body,i=document.createElement(`div`);i.className=`cw-context-menu-layer`,V=i,r.appendChild(i);let a=e.placementStrategy??`auto`,o=Ln(t,!!e.compact,0,n,a);H=o,i.appendChild(o),bn=Dn(o,{origin:{type:`point`,x:e.x,y:e.y},placement:`bottom-start`,gap:0,strategy:`js`}),xn=u({id:`context-menu-${n}`,kind:`context-menu`,element:i,isActive:()=>B===n&&V===i&&i.isConnected,close:()=>(G(),!0)});let s=e=>{if(n!==B||!V?.isConnected)return;let t=e.target;t&&V.contains(t)||G()},c=e=>{if(n!==B||!H?.isConnected)return;let t=e.target;if(!t)return;let r=t.closest?.(`.cw-context-menu__item`);if(!r){Fn(1);return}r.getAttribute(`aria-haspopup`)!==`menu`&&Fn(1)},l=e=>{n===B&&e.key===`Escape`&&G()},d=()=>G();document.addEventListener(`pointerdown`,s,{capture:!0}),document.addEventListener(`contextmenu`,s,{capture:!0}),document.addEventListener(`keydown`,l),o.addEventListener(`click`,c,{capture:!0}),window.addEventListener(`resize`,d,{passive:!0}),window.addEventListener(`blur`,d,{passive:!0}),U.push(()=>document.removeEventListener(`pointerdown`,s,{capture:!0})),U.push(()=>document.removeEventListener(`contextmenu`,s,{capture:!0})),U.push(()=>document.removeEventListener(`keydown`,l)),U.push(()=>o.removeEventListener(`click`,c,{capture:!0})),U.push(()=>window.removeEventListener(`resize`,d)),U.push(()=>window.removeEventListener(`blur`,d))}})))()}function Bn(e){globalThis.dispatchEvent?.(new CustomEvent(`view:toast`,{detail:{type:`success`,message:String(e||``)}}))}function Vn(e){let t=String(e||`default`).trim().toLowerCase();return Kn[t]||`default`}function Hn(e){return String(e||``).trim().toLowerCase().startsWith(`android-icon:`)}function Un(e,t=`default`,n=``,r=``){let i=String(e||``).trim();if(!i)return``;let a=Vn(t),o=String(n||``).trim(),s=String(r||``).trim(),c=new URLSearchParams;a!=="default"&&c.set(`v`,a),o&&c.set(`pack`,o),s&&c.set(`drawable`,s);let l=c.toString();return l?`android-icon:${i}?${l}`:`android-icon:${i}`}function Wn(e){let t=String(e||``).trim();if(!Hn(t))return null;let n=t.slice(13).replace(/^\/\//,``);if(!n)return null;let r=(e,t)=>{if(!e)return null;let n={packageName:e,variant:Vn(t.get(`v`)||`default`)},r=String(t.get(`pack`)||``).trim(),i=String(t.get(`drawable`)||``).trim();return r&&(n.pack=r),i&&(n.drawable=i),n};try{let e=new URL(n.includes(`://`)?n:`android-icon://${n}`);return r(String(e.hostname||e.pathname.replace(/^\//,``)||``).trim(),e.searchParams)}catch{let[e,t=``]=n.split(`?`);return r(String(e||``).trim(),new URLSearchParams(t))}}function Gn(e,t=`default`,n=``,r=``,i=0){let a=String(e||``).trim();if(!a)return``;let o=Vn(t),s=String(n||``).trim(),c=String(r||``).trim(),l=o==="default"?a:`${a}#${o}`;s&&(l=`${l}#pack:${s}`),c&&(l=`${l}#d:${c}`);let u=Math.round(Number(i)||0);return u>0&&(l=`${l}#s${u}`),l}var Kn;function qn(){return(qn=e((()=>{Kn={default:`default`,full:`default`,colored:`default`,monochrome:`monochrome`,mono:`monochrome`,material:`monochrome`,"material-you":`monochrome`,themed:`monochrome`,foreground:`foreground`,fg:`foreground`,"adaptive-fg":`foreground`}})))()}async function Jn(e){let t=await(await fetch(e)).blob(),n=t.type&&t.type.startsWith(`image/`)?t.type:`image/png`,r=t.type===n?t:new Blob([await t.arrayBuffer()],{type:n});return URL.createObjectURL(r)}function Yn(e){let t=String(e||``).trim();if(!t.startsWith(`shortcut:`))return null;let n=t.slice(9),r=n.indexOf(`::`);if(r>0){let e=n.slice(0,r).trim(),t=n.slice(r+2).trim();return e&&t?{packageName:e,shortcutId:t}:null}let i=n.indexOf(`/`);if(i>0){let e=n.slice(0,i).trim(),t=n.slice(i+1).trim();return e&&t?{packageName:e,shortcutId:t}:null}return null}function Xn(e,t=96,n=`default`,r=``,i=``){let a=String(e||``).trim();if(!a)return``;let o=Yn(a);return o?Qn(o.packageName,o.shortcutId,t):cr.get(Gn(a,n,r,i,t))||``}async function Zn(e,t,n=96){let r=String(e||``).trim(),i=String(t||``).trim();if(!r||!i)return``;let a=Math.max(16,Math.min(512,Math.round(Number(n)||96))),o=`shortcut:${r}/${i}@${a}`,s=ur.get(o);if(s)return s;let c=dr.get(o);return c||(c=(async()=>{let e=await nr();if(!e?.launcherShortcutIcon)return``;let t=``;try{t=String(await e.launcherShortcutIcon(r,i,a)||``).trim()}catch{return``}if(!t)return``;try{let e=await Jn(t);return ur.set(o,e),e}catch{return t}})().finally(()=>{dr.delete(o)}),dr.set(o,c)),c}function Qn(e,t,n=96){let r=String(e||``).trim(),i=String(t||``).trim();if(!r||!i)return``;let a=Math.max(16,Math.min(512,Math.round(Number(n)||96)));return ur.get(`shortcut:${r}/${i}@${a}`)||``}async function $n(e,t=96,n=`default`,r=``,i=``){let a=String(e||``).trim();if(!a)return``;let o=Yn(a);if(o)return Zn(o.packageName,o.shortcutId,t);let s=Vn(n),c=String(r||``).trim(),l=String(i||``).trim(),u=Math.max(16,Math.min(512,Math.round(Number(t)||96))),d=Gn(a,s,c,l,u),f=cr.get(d);if(f)return f;let p=lr.get(d);p||(p=(async()=>{let e=await nr();if(!e?.launcherIcon)return``;let t=``;try{t=await e.launcherIcon(a,u,s,c||void 0,l||void 0)}catch{return``}if(!t)return``;try{let e=await Jn(t);return cr.set(d,e),e}catch{return``}})(),lr.set(d,p));try{return await p}finally{lr.delete(d)}}async function er(e,t=96){let n=String(e||``).trim();if(!n||n.startsWith(`blob:`))return``;let r=Wn(n);return r?$n(r.packageName,t,r.variant,r.pack||``,r.drawable||``):n}function tr(e,t=96){let n=Wn(e);return n?Xn(n.packageName,t,n.variant,n.pack||``,n.drawable||``):``}async function nr(){if(sr)return sr;try{return await c(()=>import(`./launcher-bridge-Crivecrz.js`),[],import.meta.url)}catch{return null}}async function rr(){return nr()}async function ir(e){let{androidPackageForSku:t,isCwspSku:n}=await c(async()=>{let{androidPackageForSku:e,isCwspSku:t}=await import(`./ecosystem-skus-7pqekvU4.js`).then(e=>(e.c(),e.a));return{androidPackageForSku:e,isCwspSku:t}},[],import.meta.url);if(!n(e))return!1;let r=t(e);if(!r)return!1;let i=await nr();return i?.launcherLaunch?i.launcherLaunch(r):!1}async function ar(e){try{let{isCwspNativeHost:t,readCwspSku:n,siblingSkuForView:r}=await c(async()=>{let{isCwspNativeHost:e,readCwspSku:t,siblingSkuForView:n}=await import(`./ecosystem-skus-7pqekvU4.js`).then(e=>(e.c(),e.a));return{isCwspNativeHost:e,readCwspSku:t,siblingSkuForView:n}},[],import.meta.url);if(!t()||n()!==`launcher`)return!1;let i=r(e);return i?ir(i):!1}catch{return!1}}function or(e,t,n=`colored`){let r=String(t||``).trim();if(!r)return;e.setAttribute(`icon-padding`,`0`),e.style.setProperty(`--icon-padding`,`0px`),e.style.setProperty(`--icon-size`,`100%`),e.toggleAttribute(`data-launcher-icon`,!0);let i=()=>{let t=e;return typeof t.setResourceIcon==`function`&&(t.setResourceIcon(r,n===`auto`?`auto`:n),n!==`auto`&&typeof t.setBitmapPresentationMode==`function`&&t.setBitmapPresentationMode(n,!0),e.removeAttribute(`data-icon-pending`),e.toggleAttribute(`data-launcher-icon-ready`,!0),!0)};i()||customElements.whenDefined(`ui-icon`).then(()=>{e.isConnected&&i()})}var sr,cr,lr,ur,dr;function fr(){return(fr=e((()=>{w(),ge(),ht(),qn(),s(),sr=null,cr=new Map,lr=new Map,ur=new Map,dr=new Map})))()}function pr(e,t=64){let n=String(e||``).trim();if(!n||!/^https?:\/\//i.test(n))return``;try{let e=new URL(n).hostname;return e?`https://www.google.com/s2/favicons?domain=${encodeURIComponent(e)}&sz=${t}`:``}catch{return``}}function mr(e){let t=String(e||``).trim().toLowerCase();return t?t.includes(`/_favicon/`)||t.includes(`s2/favicons`)||t.includes(`favicon`)?!0:(t.startsWith(`android-icon:`),!1):!1}function hr(e){Fr=e}function gr(e){let t=e||(globalThis.chrome?.bookmarks??null);return!t?.getTree||!t?.getChildren?null:{resolveIconUrl:(e,t=128)=>{let n=String(e||``).trim();if(!/^https?:\/\//i.test(n))return``;let r=pr(n,t);if(r)return r;try{let e=globalThis.chrome?.runtime;if(typeof e?.getURL==`function`){let r=new URL(e.getURL(`/_favicon/`));return r.searchParams.set(`pageUrl`,n),r.searchParams.set(`size`,String(t)),r.toString()}}catch{}return``},async listChildren(e){if(e)return(await Lr(t,`getChildren`,e)||[]).map(Rr);let n=await Lr(t,`getTree`)||[],r=[];for(let e of n)for(let t of e.children||[])r.push(Rr(t));return r},async search(e){let n=String(e||``).trim();if(!n)return this.listChildren();if(typeof t.search!=`function`){let e=await this.listChildren(),t=n.toLowerCase();return e.filter(e=>e.title.toLowerCase().includes(t)||String(e.url||``).toLowerCase().includes(t))}return(await Lr(t,`search`,n)||[]).map(Rr)},async open(e){if(e.folder)return;let t=String(e.url||``).trim();if(t){try{let e=globalThis.chrome?.tabs;if(typeof e?.create==`function`){await Promise.resolve(e.create({url:t}));return}}catch{}globalThis.open?.(t,`_blank`,`noopener,noreferrer`)}}}}function _r(){return Fr||gr()}function vr(){return!!_r()}function yr(){try{let e=localStorage.getItem(jr);if(!e)return[];let t=JSON.parse(e);return Array.isArray(t)?t.filter(e=>e&&e.id&&e.title).slice(0,Nr):[]}catch{return[]}}function br(e){if(!e?.id||e.folder)return;let t=[e,...yr().filter(t=>t.id!==e.id)].slice(0,Nr);try{localStorage.setItem(jr,JSON.stringify(t))}catch{}}function xr(){return zr(Mr,Pr)}function Sr(e){return xr().some(t=>t.id===e)}function Cr(e){if(!e?.id||e.folder||!String(e.url||``).trim())return!1;let t=[e,...xr().filter(t=>t.id!==e.id)].slice(0,Pr);try{return localStorage.setItem(Mr,JSON.stringify(t)),!0}catch{return!1}}function wr(e){let t=String(e||``).trim();if(!t)return!1;let n=xr().filter(e=>e.id!==t);try{return localStorage.setItem(Mr,JSON.stringify(n)),!0}catch{return!1}}function Tr(e,t=Br){let n=String(e||``).trim();if(!n)return``;try{let e=new URL(n,globalThis.location?.href);if(e.searchParams.has(`pageUrl`))return e.searchParams.set(`size`,String(t)),e.toString();if(e.hostname.endsWith(`google.com`)&&e.pathname.includes(`favicon`))return e.searchParams.set(`sz`,String(t)),e.toString()}catch{}return n}function Er(e,t){let n=String(e.url||``).trim();return n&&(pr(n,Br)||pr(n,128)||pr(n,64)||t?.resolveIconUrl?.(n,Br)||t?.resolveIconUrl?.(n,128))||``}function Dr(e,t,n,r=``){return kr(e,t,String(r||``).trim()||Tr(Er(e,n),Br))}function Or(e,t=``){let n=String(e.url||``).trim();return JSON.stringify({state:{icon:e.folder?`folder`:`link`,label:e.title||n||`Bookmark`,action:e.folder?`open-path`:`open-link`},desc:{action:e.folder?`open-path`:`open-link`,href:e.folder?``:n,path:e.folder?`/bookmarks/${e.id}/`:`/bookmarks/${e.id}`,meta:{entityType:`bookmark`,bookmarkId:e.id,...t?{iconUrl:t}:{}}}})}function kr(e,t,n=``){if(e.folder||!String(e.url||``).trim())return null;let r=t??Ce(),i=ye(Or(e,n),r);return i?(De(i),i):null}async function Ar(e,t,n){if(e.replaceChildren(),t.folder)return Vr(e,`folder`),e.toggleAttribute(`data-bookmark-bitmap`,!1),``;let r=String(t.url||``).trim(),i=[],a=pr(r,Br);a&&i.push(a);let o=pr(r,128);o&&!i.includes(o)&&i.push(o);let s=pr(r,64);s&&!i.includes(s)&&i.push(s);let c=n?.resolveIconUrl?.(r,Br)||``;c&&!i.includes(c)&&i.push(c);let l=n?.resolveIconUrl?.(r,128)||``;l&&!i.includes(l)&&i.push(l);let u=n?.resolveIconUrl?.(r,64)||``;u&&!i.includes(u)&&i.push(u);try{let e=globalThis.chrome?.runtime;if(typeof e?.getURL==`function`&&r){let t=new URL(e.getURL(`/_favicon/`));t.searchParams.set(`pageUrl`,r),t.searchParams.set(`size`,String(Br));let n=t.toString();n&&!i.includes(n)&&i.push(n)}}catch{}return Vr(e,`link`),e.toggleAttribute(`data-bookmark-bitmap`,!1),i.length?await new Promise(t=>{let n=0,r=()=>{if(n>=i.length){t(``);return}let a=i[n++],o=document.createElement(`img`);o.className=`env-shell-app-menu__tile-favicon`,o.alt=``,o.decoding=`async`,o.loading=`eager`,o.referrerPolicy=`no-referrer`,o.draggable=!1,o.addEventListener(`load`,()=>{e.replaceChildren(o),e.toggleAttribute(`data-bookmark-bitmap`,!0),t(a)},{once:!0}),o.addEventListener(`error`,()=>{r()},{once:!0}),o.src=a};r()}):``}var jr,Mr,Nr,Pr,Fr,Ir,Lr,Rr,zr,Br,Vr;function Hr(){return(Hr=e((()=>{ge(),jr=`rs-app-menu-bookmark-recent`,Mr=`rs-app-menu-bookmark-pinned`,Nr=12,Pr=16,Fr=null,Ir=()=>{try{let e=globalThis.chrome?.runtime?.lastError;return e?Error(String(e.message||e)):null}catch{return null}},Lr=(e,t,...n)=>{let r=e[t];if(typeof r!=`function`)return Promise.reject(Error(`chrome.bookmarks.${String(t)} missing`));try{let t=r.apply(e,n);if(t!=null&&typeof t.then==`function`)return t}catch(e){return Promise.reject(e)}return new Promise((t,i)=>{try{r.apply(e,[...n,e=>{let n=Ir();n?i(n):t(e)}])}catch(e){i(e)}})},Rr=e=>{let t=typeof e.url==`string`&&e.url?e.url:void 0;return{id:String(e.id),title:String(e.title||e.url||e.id||`Bookmark`),url:t,folder:!t,parentId:e.parentId}},zr=(e,t)=>{try{let n=localStorage.getItem(e);if(!n)return[];let r=JSON.parse(n);return Array.isArray(r)?r.filter(e=>e&&e.id&&e.title&&!e.folder).slice(0,t):[]}catch{return[]}},Br=256,Vr=(e,t)=>{let n=document.createElement(`ui-icon`);n.setAttribute(`icon`,t),n.setAttribute(`icon-style`,`duotone`),n.setAttribute(`aria-hidden`,`true`),n.style.setProperty(`--icon-size`,`1.75rem`),n.style.setProperty(`--icon-padding`,`0px`),n.style.setProperty(`--icon-color`,`currentColor`),n.style.color=`currentColor`,e.append(n),customElements.whenDefined(`ui-icon`).then(()=>{n.isConnected&&(n.getAttribute(`icon`)||n.setAttribute(`icon`,t),n.style.setProperty(`--icon-size`,`1.75rem`),n.style.setProperty(`--icon-padding`,`0px`))})}})))()}function Ur(e){return e===`light`||e===`dark`?e:String(document.documentElement.getAttribute(`data-theme`)||``).toLowerCase()===`light`?`light`:`dark`}function Wr(e){let t=String(e||``).trim();return/^https?:\/\//i.test(t)?t:``}function Gr(e,t=128){try{let n=new URL(e).hostname;return n?`https://www.google.com/s2/favicons?domain=${encodeURIComponent(n)}&sz=${t}`:``}catch{return``}}function Kr(e,t=128){try{let n=globalThis.chrome?.runtime;if(typeof n?.getURL!=`function`)return``;let r=new URL(n.getURL(`/_favicon/`));return r.searchParams.set(`pageUrl`,e),r.searchParams.set(`size`,String(t)),r.toString()}catch{return``}}function qr(e,t){let n=Wr(e);if(!n)return[];let r=[],i=new Set,a=(e,t)=>{let n=String(t||``).trim();!n||i.has(n)||(i.add(n),r.push({label:e,url:n}))},o=t?.resolveIconUrl?.(n,128)||t?.resolveIconUrl?.(n,64)||``,s=Gr(n,128);s&&a(`Google S2`,s);let c=Gr(n,64);c&&a(`Google S2 (64)`,c);let l=Kr(n,128);return l&&a(`Chrome favicon`,l),o&&a(`Bookmark favicon`,o),r}function Jr(e){K(e,{display:`grid`,"grid-template-columns":oi,gap:`0.5rem 0.4rem`,"align-content":`start`,"justify-content":`stretch`,"min-inline-size":`0`,"min-block-size":`0`,"inline-size":`100%`})}function Yr(e,t,n){K(e,{display:`grid`,"grid-template-columns":`minmax(0, 1fr)`,"grid-template-rows":`auto max-content`,"justify-items":`center`,"align-content":`start`,"align-items":`start`,"flex-direction":`column`,gap:`0.3rem`,margin:`0`,padding:`0.2rem 0.08rem 0.15rem`,"min-inline-size":`0`,"inline-size":`100%`,"max-inline-size":`100%`,"block-size":`auto`,"min-block-size":`0`,background:`transparent`,border:`0`,"border-radius":`0.7rem`,"box-shadow":`none`,appearance:`none`,"-webkit-appearance":`none`,position:`static`,"z-index":`auto`,overflow:`hidden`}),K(t,{display:`block`,"grid-row":`1`,"inline-size":`3rem`,"block-size":`3rem`,"max-inline-size":`3rem`,"max-block-size":`3rem`,"object-fit":`cover`,"border-radius":`50%`,"flex-shrink":`0`}),K(n,{display:`block`,"grid-row":`2`,"inline-size":`100%`,"max-inline-size":`100%`,overflow:`hidden`,"text-overflow":`ellipsis`,"white-space":`nowrap`,"font-size":`0.62rem`,"line-height":`1.2`,"text-align":`center`,opacity:`0.88`})}function Xr(e,t){let n=document.createElement(`button`);n.type=`button`,n.className=`sd-icon-picker__card`,n.title=t||e;let r=document.createElement(`img`);r.alt=``,r.decoding=`async`,r.draggable=!1,r.referrerPolicy=`no-referrer`;let i=document.createElement(`span`);return i.className=`sd-icon-picker__card-label`,i.textContent=e,n.append(r,i),Yr(n,r,i),{btn:n,img:r}}async function Zr(e,t,n,r,i){n.replaceChildren();let a=ai.map(e=>({...e,available:!0}));try{let n=await e.launcherIconVariants?.(t);Array.isArray(n)&&n.length&&(a=n.map(e=>({id:Vn(e.id),label:String(e.label||e.id),available:e.available!==!1})))}catch{}for(let e of a){if(!e.available&&e.id!=="default")continue;let{btn:a,img:o}=Xr(e.label);n.append(a),$n(t,96,e.id).then(t=>{if(!t){a.disabled=!0,a.title=`${e.label} (unavailable)`;return}o.src=t}),a.addEventListener(`click`,()=>{r({iconUrl:Un(t,e.id),packageName:t,variant:e.id,label:e.label,source:`android`}),i()})}}async function Qr(e,t,n,r,i){if(n.replaceChildren(),n.classList.remove(`sd-icon-picker__grid--browse`),Jr(n),!e.launcherIconPacks){n.textContent=`Icon packs unavailable.`;return}let a=[];try{a=await e.launcherIconPacks()}catch{n.textContent=`Failed to list icon packs.`;return}if(!a.length){n.textContent=`No icon packs installed.`;return}let o=document.createDocumentFragment();for(let s of a.slice(0,64)){let a=String(s.packageName||``).trim();if(!a)continue;let c=String(s.label||a),l=document.createElement(`div`);l.className=`sd-icon-picker__pack-wrap`,K(l,{position:`relative`,"min-inline-size":`0`,"inline-size":`100%`});let{btn:u,img:d}=Xr(c,`${c} — tap to apply, grid to browse`);$n(t,96,`default`,a).then(e=>{if(e){d.src=e;return}u.disabled=!0,u.title=`${c} (no cover for this app)`,$n(a,72,`default`).then(e=>{e&&(d.src=e)})}),u.addEventListener(`click`,()=>{u.disabled||(r({iconUrl:Un(t,`default`,a),packageName:t,variant:`default`,pack:a,label:c,source:`icon-pack`}),i())});let f=document.createElement(`button`);f.type=`button`,f.className=`sd-icon-picker__pack-browse`,K(f,{position:`absolute`,"inset-block-start":`0`,"inset-inline-end":`0`,display:`grid`,"place-items":`center`,margin:`0`,padding:`0`,"inline-size":`1.2rem`,"block-size":`1.2rem`,"min-inline-size":`1.2rem`,"min-block-size":`1.2rem`,border:`0`,"border-radius":`999px`}),f.title=`Browse icons in ${c}`,f.setAttribute(`aria-label`,`Browse icons in ${c}`),f.innerHTML=`<ui-icon icon="squares-four" aria-hidden="true"></ui-icon>`,f.addEventListener(`click`,o=>{o.preventDefault(),o.stopPropagation(),n.dataset.packBrowse=`1`,$r(e,t,a,c,n,r,i,()=>{delete n.dataset.packBrowse,Qr(e,t,n,r,i)})}),l.append(u,f),o.append(l)}n.append(o)}async function $r(e,t,n,r,i,a,o,s){i.replaceChildren(),i.classList.add(`sd-icon-picker__grid--browse`),i.style.setProperty(`display`,`grid`,`important`),i.style.setProperty(`grid-template-columns`,`minmax(0, 1fr)`,`important`),i.style.setProperty(`grid-template-rows`,`auto minmax(0, 1fr)`,`important`),i.style.setProperty(`gap`,`0.35rem`,`important`);let c=document.createElement(`div`);c.className=`sd-icon-picker__pack-toolbar`;let l=document.createElement(`button`);l.type=`button`,l.className=`sd-icon-picker__pack-back`,l.textContent=`Packs`,l.addEventListener(`click`,()=>s());let u=document.createElement(`span`);u.className=`sd-icon-picker__pack-title`,u.textContent=r;let d=document.createElement(`input`);d.type=`search`,d.placeholder=`Filter…`,d.autocomplete=`off`,d.className=`sd-icon-picker__search`,c.append(l,u,d);let f=document.createElement(`div`);f.className=`sd-icon-picker__grid`,Jr(f),i.append(c,f);let p=0,m=()=>{(async()=>{if(f.replaceChildren(),!e.launcherIconPackIcons){f.textContent=`Pack browse unavailable.`;return}let i=[];try{i=await e.launcherIconPackIcons(n,String(d.value||``),96)}catch{f.textContent=`Failed to list pack icons.`;return}if(!i.length){f.textContent=`No matching icons.`;return}let s=document.createDocumentFragment(),c=t||n;for(let e of i){let t=String(e.drawable||``).trim();if(!t)continue;let{btn:i,img:l}=Xr(String(e.label||t),`${r}: ${t}`);s.append(i),$n(c,72,`default`,n,t).then(e=>{e?l.src=e:i.disabled=!0}),i.addEventListener(`click`,()=>{i.disabled||(a({iconUrl:Un(c,`default`,n,t),packageName:c,variant:`default`,pack:n,drawable:t,label:String(e.label||t),source:`icon-pack`}),o())})}f.append(s)})()};d.addEventListener(`input`,()=>{window.clearTimeout(p),p=window.setTimeout(m,160)}),m()}async function ei(e,t,n,r,i){if(n.replaceChildren(),!e.launcherList){n.textContent=`App list unavailable.`;return}let a=[];try{a=await e.launcherList(t)}catch{n.textContent=`Failed to list apps.`;return}if(!a.length){n.textContent=t.trim()?`No matches.`:`No apps.`;return}let o=document.createDocumentFragment();for(let e of a.slice(0,96)){let t=String(e.packageName||``).trim();if(!t)continue;let{btn:n,img:a}=Xr(String(e.label||t),`${e.label} (${t})`);o.append(n),$n(String(e.iconCacheKey||t).trim()||t,72,`default`).then(e=>{e&&(a.src=e)}),n.addEventListener(`click`,()=>{r({iconUrl:Un(t,`default`),packageName:t,variant:`default`,label:String(e.label||t),source:`android`}),i()})}n.append(o)}function ti(e,t,n,r,i){n.replaceChildren();let a=qr(e,t);if(!a.length){n.textContent=`No favicon sources for this URL.`;return}for(let e of a){let{btn:t,img:a}=Xr(e.label,e.url);a.src=e.url,a.addEventListener(`error`,()=>{t.disabled=!0,t.title=`${e.label} (failed to load)`}),t.addEventListener(`click`,()=>{r({iconUrl:e.url,label:e.label,source:`favicon`}),i()}),n.append(t)}}async function ni(e,t,n,r,i){n.replaceChildren();let a=[];try{let n=String(t||``).trim();a=n?await e.search(n):await e.listChildren()}catch{n.textContent=`Failed to list bookmarks.`;return}let o=a.filter(e=>!e.folder&&Wr(e.url));if(!o.length){n.textContent=t.trim()?`No matching bookmarks.`:`No bookmarks.`;return}let s=document.createDocumentFragment();for(let t of o.slice(0,80)){let n=Wr(t.url);if(!n)continue;let a=e.resolveIconUrl?.(n,64)||Kr(n,64)||Gr(n,64),{btn:o,img:c}=Xr(String(t.title||n),n);a&&(c.src=a),s.append(o),o.addEventListener(`click`,()=>{let o=e.resolveIconUrl?.(n,128)||Kr(n,128)||Gr(n,128)||a;o&&(r({iconUrl:o,label:String(t.title||n),source:`bookmark`}),i())})}n.append(s)}async function ri(e){let t=await rr(),n=_r(),r=!!t?.launcherIcon,i=Wr(e.pageUrl)||Wr(e.currentUrl)||``;if(!r&&!(n||i)){console.warn(`[icon-resource-picker] no launcher bridge or bookmarks/favicon source`);return}let a=Ur(e.theme),o=String(e.packageName||``).trim(),s=r&&!!o,c=r&&!!o&&!!t?.launcherIconPacks,l=r&&!!t?.launcherList,u=!!i,d=!!n,f=[];s&&f.push({id:`variants`,label:`This app`}),c&&f.push({id:`packs`,label:`Packs`}),u&&f.push({id:`favicon`,label:`Link`}),l&&f.push({id:`browse`,label:`Apps`}),d&&f.push({id:`bookmarks`,label:`Bookmarks`});let p=f[0]?.id||`browse`,m=document.createElement(`dialog`);m.className=`sd-icon-picker`,m.dataset.theme=a,m.dataset.tab=p,m.innerHTML=`
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
    `,K(m,{position:`fixed`,inset:`0`,top:`0`,right:`0`,bottom:`0`,left:`0`,width:`100%`,height:`100%`,"inline-size":`100%`,"block-size":`100%`,"max-inline-size":`100%`,"max-block-size":`100%`,"max-width":`100%`,"max-height":`100%`,margin:`0`,padding:`1rem`,display:`grid`,"place-items":`center`,"place-content":`center`,background:`transparent`,border:`none`,"border-radius":`0`,"box-shadow":`none`,overflow:`auto`});let h=m.querySelector(`.sd-icon-picker__form`);h&&K(h,{display:`flex`,"flex-direction":`column`,"inline-size":`min(90cqi, 100dvi)`,width:`min(90cqi, 100dvi)`,"max-inline-size":`100%`,"max-block-size":`min(86dvh, 36rem)`,margin:`0`,padding:`0`,"border-radius":`18px`,overflow:`hidden`,"justify-self":`center`,"align-self":`center`,background:`color-mix(in oklab, var(--color-surface-container, Canvas) 92%, transparent)`});let g=m.querySelector(`.sd-icon-picker__tabs`);g&&K(g,{display:`grid`,"grid-auto-flow":`column`,"grid-auto-columns":`1fr`,gap:`0.28rem`,"inline-size":`100%`});let _=m.querySelector(`.sd-icon-picker__body`);_&&K(_,{display:`block`,padding:`0.65rem 0.85rem 0.45rem`,"min-block-size":`0`,"max-block-size":`min(26rem, 52dvh)`,overflow:`auto`,background:`transparent`});let v=m.querySelector(`.sd-icon-picker__footer`);v&&K(v,{display:`flex`,"justify-content":`flex-end`,"align-items":`center`,gap:`0.45rem`,padding:`0.55rem 0.85rem 0.7rem`});let y=m.querySelector(`.sd-icon-picker__cancel`);y&&K(y,{display:`inline-flex`,"align-items":`center`,"justify-content":`center`,flex:`0 0 auto`,margin:`0`,padding:`0.42rem 0.86rem`,"inline-size":`auto`,width:`auto`,"min-inline-size":`0`,"max-inline-size":`none`,"border-radius":`0.65rem`});let b=m.querySelector(`form`),x=m.querySelector(`.sd-icon-picker__tabs`),S=m.querySelector(`[data-search]`),C=m.querySelector(`[data-variants]`),w=m.querySelector(`[data-packs]`),T=m.querySelector(`[data-favicon]`),E=m.querySelector(`[data-browse]`),D=m.querySelector(`[data-bookmarks]`),O=!1,k=()=>{if(!O){O=!0;try{m.open&&m.close()}catch{}m.remove()}},A=t=>{e.onPick(t)};b.addEventListener(`click`,e=>{e.target?.closest?.(`[data-action]`)?.getAttribute(`data-action`)===`cancel`&&(e.preventDefault(),k())}),m.addEventListener(`cancel`,e=>{e.preventDefault(),k()}),m.addEventListener(`click`,e=>{e.target===m&&k()});let ee=e=>{m.dataset.tab=e,m.querySelectorAll(`[data-section]`).forEach(t=>{t.hidden=t.dataset.section!==e}),x?.querySelectorAll(`[data-tab]`).forEach(t=>{let n=t.dataset.tab===e;t.toggleAttribute(`data-active`,n),t.setAttribute(`aria-selected`,n?`true`:`false`),t.tabIndex=n?0:-1});let n=e===`browse`||e===`bookmarks`;S&&(S.hidden=!n,S.placeholder=e===`bookmarks`?`Search bookmarks…`:`Search apps…`,n&&(S.value=``)),e===`packs`&&w?.dataset.packBrowse===`1`&&t&&o&&(delete w.dataset.packBrowse,Qr(t,o,w,A,k))};if(x){let e=document.createDocumentFragment();for(let t of f){let n=document.createElement(`button`);n.type=`button`,n.className=`sd-icon-picker__tab`,n.dataset.tab=t.id,n.setAttribute(`role`,`tab`),n.textContent=t.label,K(n,{display:`inline-flex`,flex:`1 1 0`,"align-items":`center`,"justify-content":`center`,margin:`0`,padding:`0.38rem 0.4rem`,border:`0`,"border-radius":`999px`,"inline-size":`100%`,"min-inline-size":`0`,"block-size":`auto`}),n.addEventListener(`click`,e=>{e.preventDefault(),ee(t.id)}),e.append(n)}x.append(e),x.hidden=f.length<=1}s&&t&&C&&Zr(t,o,C,A,k),c&&t&&w&&o&&Qr(t,o,w,A,k),u&&T&&ti(i,n,T,A,k);let te=0,ne=()=>{!E||!t||ei(t,String(S?.value||``),E,A,k)},j=0,M=()=>{!D||!n||ni(n,String(S?.value||``),D,A,k)};S?.addEventListener(`input`,()=>{let e=m.dataset.tab;if(e===`browse`){window.clearTimeout(te),te=window.setTimeout(ne,180);return}e===`bookmarks`&&(window.clearTimeout(j),j=window.setTimeout(M,180))}),l&&ne(),d&&n&&M(),x?.addEventListener(`click`,e=>{let t=e.target?.closest?.(`[data-tab]`)?.getAttribute(`data-tab`);t===`browse`&&ne(),t===`bookmarks`&&M()}),ee(p),document.body.append(m),m.querySelectorAll(`.sd-icon-picker__grid`).forEach(Jr);try{m.showModal()}catch{m.setAttribute(`open`,``)}}function ii(e,t,n){let r=e.querySelector(`.sd-icon-resource-row`);r||(r=document.createElement(`div`),r.className=`sd-icon-resource-row`,t.replaceWith(r),r.append(t)),r.style.setProperty(`display`,`grid`,`important`),r.style.setProperty(`grid-template-columns`,`minmax(0,1fr) 2.5rem 2.5rem`,`important`),r.style.setProperty(`align-items`,`stretch`,`important`),r.style.setProperty(`gap`,`0.45rem`,`important`),r.style.setProperty(`min-inline-size`,`0`,`important`),r.style.setProperty(`inline-size`,`100%`,`important`);let i=r.querySelector(`[data-action='pick-icon']`);i||(i=document.createElement(`button`),i.type=`button`,i.className=`btn secondary sd-icon-resource-pick`,i.setAttribute(`data-action`,`pick-icon`),i.title=`Pick alternative icon`,i.setAttribute(`aria-label`,`Pick alternative icon`),i.innerHTML=`<ui-icon icon="squares-four" icon-style="duotone" aria-hidden="true"></ui-icon>`,r.append(i));let a=r.querySelector(`[data-action='pick-photo']`);a||(a=document.createElement(`button`),a.type=`button`,a.className=`btn secondary sd-icon-resource-pick`,a.setAttribute(`data-action`,`pick-photo`),a.title=`Use photo / avatar`,a.setAttribute(`aria-label`,`Use photo or avatar`),a.innerHTML=`<ui-icon icon="user-circle" icon-style="duotone" aria-hidden="true"></ui-icon>`,r.append(a)),t.parentElement!==r&&r.insertBefore(t,i),i.parentElement===r&&a.parentElement===r&&(r.append(i,a),r.insertBefore(t,i));let o=e=>{e.style.setProperty(`display`,`inline-flex`,`important`),e.style.setProperty(`align-items`,`center`,`important`),e.style.setProperty(`justify-content`,`center`,`important`),e.style.setProperty(`inline-size`,`2.5rem`,`important`),e.style.setProperty(`min-inline-size`,`2.5rem`,`important`),e.style.setProperty(`max-inline-size`,`2.5rem`,`important`),e.style.setProperty(`min-block-size`,`2.5rem`,`important`),e.style.setProperty(`padding`,`0`,`important`),e.style.setProperty(`margin`,`0`,`important`)};return o(i),o(a),i.addEventListener(`click`,e=>{e.preventDefault(),e.stopPropagation(),ri({packageName:typeof n.packageName==`function`?n.packageName():String(n.packageName||``).trim(),pageUrl:typeof n.pageUrl==`function`?n.pageUrl():String(n.pageUrl||``).trim(),currentUrl:t.value,theme:n.theme,onPick:e=>{t.value=e.iconUrl,t.setAttribute(`value`,e.iconUrl),t.dispatchEvent(new Event(`input`,{bubbles:!0})),t.dispatchEvent(new Event(`change`,{bubbles:!0}))}})}),a.addEventListener(`click`,n=>{n.preventDefault(),n.stopPropagation();let r=document.createElement(`input`);r.type=`file`,r.accept=`image/*`,r.style.display=`none`,document.body.append(r),r.addEventListener(`change`,()=>{let n=r.files?.[0];if(r.remove(),!n)return;let i=new FileReader;i.onload=()=>{let n=String(i.result||``).trim();if(!n.startsWith(`data:image/`))return;t.value=n,t.setAttribute(`value`,n),t.dispatchEvent(new Event(`input`,{bubbles:!0})),t.dispatchEvent(new Event(`change`,{bubbles:!0}));let r=e.closest(`form`)?.querySelector(`select[name="iconDisplay"]`);r&&(r.value=`colored`,r.dispatchEvent(new Event(`change`,{bubbles:!0})))},i.readAsDataURL(n)},{once:!0}),r.click()}),i}var ai,oi,K;function si(){return(si=e((()=>{fr(),qn(),Hr(),ai=[{id:`default`,label:`Default`},{id:`monochrome`,label:`Material You`},{id:`foreground`,label:`Adaptive FG`}],oi=`repeat(auto-fill, minmax(4.75rem, 1fr))`,K=(e,t)=>{for(let[n,r]of Object.entries(t))e.style.setProperty(n,r,`important`)}})))()}function ci(){if(q)return q;try{let e=localStorage.getItem(gi);if(!e)return q={},q;let t=JSON.parse(e);q=t&&typeof t==`object`?t:{}}catch{q={}}return q}function li(e){q=e;try{localStorage.setItem(gi,JSON.stringify(e))}catch{}}function ui(e){return`app:${String(e||``).trim()}`}function di(e){return`bm:${String(e||``).trim()}`}function fi(e){let t=String(e||``).trim();return t?{...ci()[t]||{}}:{}}function pi(e,t){let n=String(e||``).trim();if(!n)return{};let r={...ci()},i={...r[n]||{},...t};return i.shape&&=le(i.shape,`circle`),i.iconDisplay&&=N(i.iconDisplay)||`colored`,i.iconScale!=null&&(i.iconScale=we(i.iconScale)),r[n]=i,li(r),i}function mi(e){let t=String(e||``).trim();if(!t)return;let n={...ci()};delete n[t],li(n)}function hi(e){let t={...e.defaults||{},...e.initial||{},...fi(e.key)},n=String(t.iconUrl||``).trim(),r=n.startsWith(`blob:`)?``:n,i=document.createElement(`dialog`);i.className=`speed-dial-editor env-shell-app-menu__chrome-editor`,i.innerHTML=`
        <form class="speed-dial-editor__form" autocomplete="off">
            <header class="modal-header">
                <h2 class="modal-title">Icon design</h2>
                <p class="modal-description">${String(e.title||``).replace(/[<>&]/g,``)}</p>
            </header>
            <div class="modal-fields">
                <div class="modal-field">
                    <label for="am-chrome-shape">Shape</label>
                    <select id="am-chrome-shape" name="shape">
                        ${ue.map(e=>`<option value="${e.value}"${le(t.shape,`circle`)===e.value?` selected`:``}>${e.label}</option>`).join(``)}
                    </select>
                </div>
                <div class="modal-field">
                    <label for="am-chrome-display">Icon display</label>
                    <select id="am-chrome-display" name="iconDisplay">
                        ${Ne.map(e=>`<option value="${e.value}"${(N(t.iconDisplay)||`colored`)===e.value?` selected`:``}>${e.label}</option>`).join(``)}
                    </select>
                </div>
                <div class="modal-field">
                    <label for="am-chrome-icon-scale">Icon scale (inside plate)</label>
                    <select id="am-chrome-icon-scale" name="iconScale">
                        ${ke.map(e=>`<option value="${e.value}"${we(t.iconScale)===e.value?` selected`:``}>${e.label}</option>`).join(``)}
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
    `;let a=i.querySelector(`form`),o=a?.querySelector(`.modal-actions`);o&&(o.style.setProperty(`display`,`grid`,`important`),o.style.setProperty(`grid-template-columns`,`1fr auto auto`,`important`),o.style.setProperty(`align-items`,`center`,`important`),o.style.setProperty(`gap`,`0.45rem`,`important`));let s=i.querySelector(`select[name="shape"]`),c=i.querySelector(`select[name="iconDisplay"]`),l=i.querySelector(`select[name="iconScale"]`),u=i.querySelector(`input[name="icon"]`),d=i.querySelector(`input[name="iconUrl"]`),f=i.querySelector(`[data-field="glyph"]`),p=i.querySelector(`[data-field="url"]`),m=String(e.packageName||``).trim()||(e.key.startsWith(`app:`)?e.key.slice(4):``),h=String(e.pageUrl||``).trim();p&&d&&ii(p,d,{packageName:m,pageUrl:h});let g=()=>{let e=N(c?.value)||`colored`;f&&(e===`glyph`?f.removeAttribute(`hidden`):f.setAttribute(`hidden`,``)),p&&(e===`glyph`?p.setAttribute(`hidden`,``):p.removeAttribute(`hidden`))};c?.addEventListener(`change`,g),g();let _=()=>{try{i.open&&i.close()}catch{}i.remove()};a?.addEventListener(`click`,t=>{let n=t.target?.closest?.(`[data-action]`)?.getAttribute(`data-action`);n===`cancel`&&(t.preventDefault(),_()),n===`reset`&&(t.preventDefault(),mi(e.key),e.onSave({}),_())}),a?.addEventListener(`submit`,t=>{t.preventDefault();let n=String(d?.value||``).trim(),r={shape:le(s?.value,`circle`),iconDisplay:N(c?.value)||`colored`,iconScale:we(l?.value),icon:String(u?.value||``).trim(),iconUrl:n.startsWith(`blob:`)?``:n};pi(e.key,r),e.onSave(r),_()}),i.addEventListener(`cancel`,e=>{e.preventDefault(),_()}),document.body.append(i);try{i.showModal()}catch{i.setAttribute(`open`,``)}}var gi,q;function _i(){return(_i=e((()=>{ie(),ge(),si(),gi=`cwsp-app-menu-tile-chrome-v1`,q=null})))()}var vi;function yi(){return(yi=e((()=>{vi=`@layer ui-app-menu {
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
    pointer-events: none;
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
    gap: 0.2rem;
    min-block-size: 1.4rem;
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
  .env-shell-app-menu__search {
    inline-size: 100%;
    padding: 0.55rem 0.65rem;
    border-radius: 10px;
    border: 1px solid light-dark(color-mix(in oklab, #000 12%, transparent), color-mix(in oklab, #fff 14%, transparent));
    background: var(--env-app-menu-surface-raised);
    color: inherit;
    font: 400 0.9rem/1.2 ui-sans-serif, system-ui, sans-serif;
    box-sizing: border-box;
    position: sticky;
    inset-block-start: 0;
    z-index: 99;
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
}`})))()}function bi(){return document.documentElement.dataset.cwspShellRole===`launcher`||globalThis.__RS_SHELL_ROLE__===`launcher`}function xi(){return bi()||vr()}function Si(){return bi()?`launcher`:vr()?`bookmarks`:null}async function Ci(){if(Ri)return Ri;try{return await c(()=>import(`./launcher-bridge-Crivecrz.js`),[],import.meta.url)}catch{return null}}function wi(){if(!Fi){Fi=!0;try{document.adoptedStyleSheets=[...document.adoptedStyleSheets,Pi]}catch{}}}function Ti(){return document.querySelector(`.env-shell-root`)||document.querySelector(`env-shell-container`)||document.querySelector(`.env-shell-chrome`)?.parentElement||document.body}function Ei(e,t){let n=document.createElement(`div`);n.className=`env-shell-app-menu__drag-ghost`,n.setAttribute(`aria-hidden`,`true`);let r=e.cloneNode(!0);r.className=`env-shell-app-menu__drag-ghost-icon ui-ws-item-icon shaped`,r.setAttribute(`data-shape`,le(e.getAttribute(`data-shape`),`circle`));let i=document.createElement(`span`);return i.className=`env-shell-app-menu__drag-ghost-label`,i.textContent=t,n.append(r,i),n}function Di(e,t){let n=le(t.chrome.shape,zi);e.setAttribute(`data-shape`,n),e.classList.add(`ui-ws-item-icon`,`shaped`);let r=String(t.chrome.iconUrl||``).trim()||String(t.resourceUrl||``).trim(),i=me(t.chrome.iconScale),a=Hn(r)?tr(r,i):``,o=String(a||(Hn(r)?``:r)||``).trim(),s=N(t.chrome.iconDisplay)||de({iconDisplay:t.chrome.iconDisplay,iconUrl:o||r,isLauncherApp:!!t.launcher,isBookmarkFavicon:!!(o||r)&&!t.launcher});e.setAttribute(`data-icon-display`,s),pe(e,Me(s,t.chrome.iconScale)),e.replaceChildren();let c=()=>{be(e),Se(e)};if(s===`glyph`){let n=String(t.chrome.icon||t.fallbackGlyph||`device-mobile`).trim()||`device-mobile`,r=document.createElement(`ui-icon`);r.setAttribute(`icon`,n),r.setAttribute(`icon-style`,`duotone`),r.setAttribute(`aria-hidden`,`true`),e.append(r),c();return}if(s===`colored`){let n=document.createElement(`img`);n.className=t.launcher?`ui-ws-item-icon-img`:`ui-ws-item-icon-img env-shell-app-menu__tile-favicon`,n.alt=``,n.decoding=`async`,n.draggable=!1,n.referrerPolicy=`no-referrer`,!t.launcher&&(mr(o)||mr(r))?n.toggleAttribute(`data-bookmark-favicon`,!0):t.launcher&&n.toggleAttribute(`data-launcher-icon`,!0),o?n.src=o:n.toggleAttribute(`data-icon-pending`,!0),e.append(n),c(),Hn(r)&&er(r,i).then(e=>{!e||!n.isConnected||(n.src=e,n.removeAttribute(`data-icon-pending`),c())});return}let l=re({display:s,glyph:String(t.chrome.icon||t.fallbackGlyph||`device-mobile`),resourceUrl:o||void 0,launcher:t.launcher,className:`ui-ws-item-icon-native`});e.append(l),c(),t.launcher&&o&&s!==`glyph`&&(or(l,o,s),c()),Hn(r)&&er(r,i).then(e=>{!e||!l.isConnected||(or(l,e,s),c())})}function Oi(e,t,n,r){let i=()=>Oe(t),a=typeof window<`u`&&(window.matchMedia?.(`(pointer: coarse)`)?.matches||`ontouchstart`in window);e.draggable=!a,a||(e.addEventListener(`dragstart`,e=>{let t=i();if(e.dataTransfer?.setData(`text/plain`,t),e.dataTransfer?.setData(`application/json`,t),e.dataTransfer){e.dataTransfer.effectAllowed=`copy`;try{e.dataTransfer.setDragImage(n,24,24)}catch{}}document.documentElement.toggleAttribute(`data-app-menu-dragging`,!0)}),e.addEventListener(`dragend`,()=>{document.documentElement.toggleAttribute(`data-app-menu-dragging`,!1)}));let o,s=null,c=0,l=0,u=!1,d=!1,f=!1,p=null,m=()=>{o&&=(clearTimeout(o),void 0)},h=()=>{if(m(),u=!1,d&&(d=!1,e.classList.remove(`env-shell-app-menu__tile--dragging`),document.documentElement.toggleAttribute(`data-app-menu-dragging`,!1),p?.remove(),p=null,s!=null)){try{e.releasePointerCapture(s)}catch{}s=null}},g=(r,i,a)=>{if(!d){u=!1,d=!0,f=!0,e.classList.add(`env-shell-app-menu__tile--dragging`),document.documentElement.toggleAttribute(`data-app-menu-dragging`,!0),p=Ei(n,t.label),document.body.appendChild(p),p.style.transform=`translate(${r}px, ${i}px) translate(-50%, -50%)`;try{e.setPointerCapture(a)}catch{}}},_=(e,t)=>{p&&(p.style.transform=`translate(${e}px, ${t}px) translate(-50%, -50%)`)},v=(e,n)=>{if(!_e(e,n))return;let i=je(e,n);fe(t,i??void 0)&&(Bn(`Pinned ${t.label} to desktop`),r.onPinned?.())},y=t=>{if(d){if(d=!1,u=!1,e.classList.remove(`env-shell-app-menu__tile--dragging`),document.documentElement.toggleAttribute(`data-app-menu-dragging`,!1),p?.remove(),p=null,s!=null){try{e.releasePointerCapture(s)}catch{}s=null}v(t.clientX,t.clientY)}};e.addEventListener(`pointerdown`,e=>{e.button===0&&(m(),s=e.pointerId,c=e.clientX,l=e.clientY,f=!1,d=!1,u=!1,o=setTimeout(()=>{o=void 0,u=!0,f=!0},Ii))},{passive:!0}),e.addEventListener(`pointermove`,e=>{if(o&&!d&&!u){let t=e.clientX-c,n=e.clientY-l;Math.hypot(t,n)>Li&&m();return}if(u&&!d){let t=e.clientX-c,n=e.clientY-l;Math.hypot(t,n)>Li&&g(e.clientX,e.clientY,e.pointerId);return}d&&(_(e.clientX,e.clientY),e.preventDefault())},{passive:!1}),e.addEventListener(`pointerup`,e=>{if(m(),u=!1,d){y(e);return}}),e.addEventListener(`pointercancel`,e=>{m(),u=!1,d&&y(e)}),e.addEventListener(`contextmenu`,()=>{h()},!0),e.addEventListener(`click`,e=>{f&&=(e.preventDefault(),e.stopPropagation(),!1)},!0)}function ki(e,t,n,r,i){let a=document.createElement(`button`);a.type=`button`,a.className=`env-shell-app-menu__tile`,a.setAttribute(`data-package`,e.packageName),a.title=`${e.label} — right-click: desktop; hold and drag`;let o=ui(e.packageName),s=document.createElement(`span`);s.className=`env-shell-app-menu__tile-icon ui-ws-item-icon shaped`;let c=document.createElement(`span`);c.className=`env-shell-app-menu__tile-label`,c.textContent=e.label,a.append(s,c);let l=e.iconCacheKey||e.packageName,u=(e=``)=>{Di(s,{chrome:fi(o),fallbackGlyph:`device-mobile`,resourceUrl:e,launcher:!0})},d=me(fi(o).iconScale);return u(Xn(l,d)),$n(l,d).then(e=>{n===r()&&e&&u(e)}).catch(()=>{}),Oi(a,e,s,i),a.addEventListener(`contextmenu`,n=>{n.preventDefault(),n.stopPropagation(),Rn({x:n.clientX,y:n.clientY,compact:!0,items:[{id:`place-desktop`,label:`Place on desktop`,icon:`desktop`,action:()=>{fe(e)&&(Bn(`Placed “${e.label}” on desktop`),i.onPinned?.())}},{id:`icon-design`,label:`Icon design…`,icon:`palette`,action:()=>{hi({title:e.label,key:o,packageName:e.packageName,defaults:{shape:zi,iconDisplay:`colored`},onSave:e=>{let t={...fi(o),...e},n=me(t.iconScale),r=(e=``)=>{Di(s,{chrome:t,fallbackGlyph:`device-mobile`,resourceUrl:e,launcher:!0})};r(Xn(l,n)||(Hn(String(t.iconUrl||``))?``:String(t.iconUrl||``).trim())),Hn(String(t.iconUrl||``))?er(t.iconUrl,n).then(e=>{e&&r(e)}):$n(l,n).then(e=>{e&&r(e)})}})}},{id:`launch`,label:`Open`,icon:`arrow-square-out`,action:async()=>{try{await t.launcherLaunch(e.packageName,e.componentName)}catch{}}}]})}),a.addEventListener(`click`,async n=>{n.preventDefault(),n.stopPropagation();try{await t.launcherLaunch(e.packageName,e.componentName)}catch{}}),a}function Ai(e,t,n,r,i){if(t.folder||!String(t.url||``).trim())return;let a,o=!1,s=!1,c=0,l=0,u=-1,d=null,f=()=>{a!=null&&(clearTimeout(a),a=void 0)},p=()=>{if(f(),o=!1,s){s=!1,e.classList.remove(`env-shell-app-menu__tile--dragging`),document.documentElement.toggleAttribute(`data-app-menu-dragging`,!1),d?.remove(),d=null;try{e.releasePointerCapture?.(u)}catch{}}},m=(r,i)=>{if(!s){o=!1,s=!0,e.classList.add(`env-shell-app-menu__tile--dragging`),document.documentElement.toggleAttribute(`data-app-menu-dragging`,!0),d=Ei(n,t.title),document.body.appendChild(d),d.style.transform=`translate(${r}px, ${i}px) translate(-50%, -50%)`;try{e.setPointerCapture?.(u)}catch{}}},h=(n,a)=>{if(f(),o=!1,s){s=!1,e.classList.remove(`env-shell-app-menu__tile--dragging`),document.documentElement.toggleAttribute(`data-app-menu-dragging`,!1),d?.remove(),d=null;try{e.releasePointerCapture?.(u)}catch{}if(_e(n,a)){let e=je(n,a)??void 0,o=String(r.current||``).trim()||Er(t,_r());Dr(t,e,_r(),o)&&(Bn(`Placed “${t.title}” on desktop`),i.onPinned?.())}}};e.addEventListener(`pointerdown`,e=>{(e.button==null||e.button===0)&&(c=e.clientX,l=e.clientY,u=e.pointerId,s=!1,o=!1,f(),a=setTimeout(()=>{a=void 0,o=!0},Ii))}),e.addEventListener(`pointermove`,e=>{if(!s&&!o){if(a==null)return;let t=e.clientX-c,n=e.clientY-l;t*t+n*n>100&&f();return}if(o&&!s){let t=e.clientX-c,n=e.clientY-l;t*t+n*n>100&&m(e.clientX,e.clientY);return}d&&(d.style.transform=`translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`,e.preventDefault())},{passive:!1}),e.addEventListener(`pointerup`,e=>h(e.clientX,e.clientY)),e.addEventListener(`pointercancel`,e=>h(e.clientX,e.clientY)),e.addEventListener(`contextmenu`,()=>p(),!0)}function ji(e,t,n,r,i){e.addEventListener(`contextmenu`,a=>{if(a.preventDefault(),a.stopPropagation(),t.folder){Rn({x:a.clientX,y:a.clientY,compact:!0,items:[{id:`open-folder`,label:`Open folder`,icon:`folder-open`,action:()=>{e.click()}}]});return}let o=Sr(t.id);Rn({x:a.clientX,y:a.clientY,compact:!0,items:[{id:`place-desktop`,label:`Place on desktop`,icon:`desktop`,action:()=>{Dr(t,void 0,n,String(r.current||``).trim()||Er(t,n))&&(Bn(`Placed “${t.title}” on desktop`),i.onPinned?.())}},{id:`icon-design`,label:`Icon design…`,icon:`palette`,action:()=>{let i=di(t.id);hi({title:t.title,key:i,pageUrl:String(t.url||``).trim(),defaults:{shape:zi,iconDisplay:`colored`},onSave:a=>{let o=e.querySelector(`.env-shell-app-menu__tile-icon`);if(!o)return;let s={...fi(i),...a},c=String(s.iconUrl||``).trim()||String(r.current||``).trim()||Er(t,n);Di(o,{chrome:s,fallbackGlyph:t.folder?`folder`:`link`,resourceUrl:c}),c&&(r.current=c)}})}},o?{id:`unpin-start`,label:`Unpin from Start`,icon:`push-pin-slash`,action:()=>{wr(t.id)&&(Bn(`Unpinned “${t.title}”`),i.onStartPinsChanged?.())}}:{id:`pin-start`,label:`Pin to Start`,icon:`push-pin`,action:()=>{Cr(t)&&(Bn(`Pinned “${t.title}” to Start`),i.onStartPinsChanged?.())}},{id:`open`,label:`Open`,icon:`arrow-square-out`,action:async()=>{br(t);try{await n.open(t)}catch{}}}]})})}function Mi(e,t,n,r){let i=document.createElement(`button`);i.type=`button`,i.className=`env-shell-app-menu__tile`,i.setAttribute(`data-bookmark-id`,e.id),e.folder&&i.setAttribute(`data-folder`,``),i.title=e.folder?`${e.title} — open folder`:`${e.title} — right-click: desktop / pin; hold to drag`;let a=di(e.id),o=document.createElement(`span`);o.className=`env-shell-app-menu__tile-icon ui-ws-item-icon shaped`,o.setAttribute(`data-shape`,zi);let s=document.createElement(`span`);s.className=`env-shell-app-menu__tile-label`,s.textContent=e.title,i.append(o,s);let c={current:``},l=t=>{let n=fi(a);if(n.shape||n.iconDisplay||n.icon||n.iconUrl){Di(o,{chrome:n,fallbackGlyph:e.folder?`folder`:`link`,resourceUrl:String(n.iconUrl||t||``).trim()});return}o.setAttribute(`data-shape`,zi)};return Ar(o,e,t).then(e=>{c.current=e,l(e)}),Ai(i,e,o,c,n),ji(i,e,t,c,n),i.addEventListener(`click`,async n=>{if(n.preventDefault(),n.stopPropagation(),!document.documentElement.hasAttribute(`data-app-menu-dragging`)){if(e.folder){r(e.id,e.title);return}br(e);try{await t.open(e)}catch{}}}),i}function Ni(){wi();let e=Si(),t=document.createElement(`div`);t.className=`env-shell-app-menu`,t.hidden=!0,t.setAttribute(`role`,`dialog`),t.setAttribute(`aria-modal`,`false`),t.setAttribute(`aria-label`,e===`bookmarks`?`Bookmarks`:`Apps`),e&&t.setAttribute(`data-menu-mode`,e);let n=()=>{try{let e=document.documentElement,n=(e.getAttribute(`data-theme`)||``).toLowerCase(),r=(e.style.colorScheme||``).trim().toLowerCase(),i=n===`light`||n===`dark`?n:r===`light`||r===`dark`?r:``;if(i===`light`||i===`dark`){t.dataset.theme=i,t.style.colorScheme=i;return}delete t.dataset.theme,t.style.colorScheme=`inherit`}catch{}};n();let r=()=>n();document.addEventListener(`u2-theme-change`,r);let i=new MutationObserver(r);try{i.observe(document.documentElement,{attributes:!0,attributeFilter:[`data-theme`,`data-scheme`,`style`]})}catch{}let a=document.createElement(`div`);a.className=`env-shell-app-menu__panel`,e===`bookmarks`&&a.setAttribute(`data-layout`,`start-split`);let o=document.createElement(`div`);o.className=`env-shell-app-menu__banner`,o.hidden=!0;let s=document.createElement(`p`);s.className=`env-shell-app-menu__banner-text`,s.textContent=`Set CWSP Launcher as Home`;let c=document.createElement(`button`);c.type=`button`,c.className=`env-shell-app-menu__banner-action btn`,c.textContent=`Set as default`,o.append(s,c);let l=document.createElement(`input`);l.type=`search`,l.className=`env-shell-app-menu__search`,l.placeholder=e===`bookmarks`?`Search bookmarks`:`Search apps`,l.autocomplete=`off`,l.setAttribute(`aria-label`,e===`bookmarks`?`Search bookmarks`:`Search apps`);let u=document.createElement(`div`);u.className=`env-shell-app-menu__start-body`,u.hidden=e!==`bookmarks`;let d=document.createElement(`div`);d.className=`env-shell-app-menu__start-left`,d.setAttribute(`aria-label`,`Pinned and recent bookmarks`);let f=document.createElement(`div`);f.className=`env-shell-app-menu__start-heading`,f.textContent=`Pinned`;let p=document.createElement(`div`);p.className=`env-shell-app-menu__start-recent env-shell-app-menu__start-pinned`;let m=document.createElement(`div`);m.className=`env-shell-app-menu__start-heading`,m.textContent=`Recent`;let h=document.createElement(`div`);h.className=`env-shell-app-menu__start-recent`,d.append(f,p,m,h);let g=document.createElement(`div`);g.className=`env-shell-app-menu__start-right`;let _=document.createElement(`div`);_.className=`env-shell-app-menu__crumb`;let v=document.createElement(`div`);v.className=`env-shell-app-menu__grid`,v.setAttribute(`data-part`,`grid`),v.setAttribute(`aria-label`,e===`bookmarks`?`Bookmarks`:`Installed apps`),g.append(_,v),u.append(d,g),e===`bookmarks`?a.append(o,l,u):a.append(o,l,v),t.appendChild(a),Ti().appendChild(t);let y=!1,b=0,x=``,S,C=[],w=()=>{if(!xi()){t.hidden=!0,t.toggleAttribute(`data-open`,!1);return}t.hidden=!y,t.toggleAttribute(`data-open`,y)},T=()=>{y&&(y=!1,t.toggleAttribute(`data-page`,!1),w(),t.dispatchEvent(new CustomEvent(`env-app-menu-close`,{bubbles:!0})))};t.addEventListener(`env-app-menu-request-close`,e=>{e.stopPropagation(),T()});let E=()=>{xi()&&(n(),y=!0,w(),j(),t.dispatchEvent(new CustomEvent(`env-app-menu-open`,{bubbles:!0})))},D=()=>{t.toggleAttribute(`data-page`,!0),E()},O=()=>{y?T():E()},k={onPinned:()=>{T()},onStartPinsChanged:()=>{j()}},A=()=>{if(_.replaceChildren(),e!==`bookmarks`)return;let t=document.createElement(`button`);t.type=`button`,t.className=`env-shell-app-menu__crumb-item`,t.textContent=`Bookmarks`,t.addEventListener(`click`,()=>{C=[],j()}),_.appendChild(t),C.forEach((e,t)=>{let n=document.createElement(`span`);n.className=`env-shell-app-menu__crumb-sep`,n.textContent=`›`;let r=document.createElement(`button`);r.type=`button`,r.className=`env-shell-app-menu__crumb-item`,r.textContent=e.title,r.addEventListener(`click`,()=>{C=C.slice(0,t+1),j()}),_.append(n,r)})},ee=async(e,t)=>{let n=[];try{n=await e.launcherList(x||void 0)}catch{n=[]}if(t!==b)return;if(v.replaceChildren(),n.length===0){let e=document.createElement(`p`);e.className=`env-shell-app-menu__empty`,e.textContent=x?`No matching apps`:`No apps found`,v.appendChild(e);return}let r=document.createDocumentFragment();for(let i of n)r.appendChild(ki(i,e,t,()=>b,k));v.appendChild(r)},te=(e,t)=>{C.push({id:e,title:t}),x=``,l.value=``,j()},ne=async(e,t)=>{A();let n=(t,n,r)=>{if(t.replaceChildren(),n.length===0){let e=document.createElement(`p`);e.className=`env-shell-app-menu__empty env-shell-app-menu__empty--compact`,e.textContent=r,t.appendChild(e);return}for(let r of n)t.appendChild(Mi(r,e,k,te))};n(p,xr(),`No pinned bookmarks`),n(h,yr(),`No recent bookmarks`);let r=[];try{if(x)r=await e.search(x);else{let t=C.length?C[C.length-1].id:void 0;r=await e.listChildren(t)}}catch{r=[]}if(t!==b)return;if(v.replaceChildren(),r.length===0){let e=document.createElement(`p`);e.className=`env-shell-app-menu__empty`,e.textContent=x?`No matching bookmarks`:`This folder is empty`,v.appendChild(e);return}let i=document.createDocumentFragment(),a=r.filter(e=>e.folder),o=r.filter(e=>!e.folder);for(let t of[...a,...o])i.appendChild(Mi(t,e,k,te));v.appendChild(i)},j=async()=>{let e=++b;o.hidden=!0,l.hidden=!1;let n=Si();if(!n){w();return}if(t.setAttribute(`data-menu-mode`,n),n===`bookmarks`){a.setAttribute(`data-layout`,`start-split`),u.hidden=!1,a.contains(u)||(a.append(o,l,u),v.parentElement!==g&&g.append(_,v));let t=_r();if(!t){o.hidden=!1,s.textContent=`Bookmarks API unavailable in this context`,c.hidden=!0,l.hidden=!0,u.hidden=!0;return}c.hidden=!0,await ne(t,e);return}a.removeAttribute(`data-layout`),u.hidden=!0,v.parentElement!==a&&a.append(v);let r=await Ci();if(e!==b)return;if(!r?.launcherList||!r?.launcherLaunch||!r?.launcherIcon){o.hidden=!1,s.textContent=`Launcher bridge unavailable — rebuild the Capacitor APK`,c.hidden=!0,l.hidden=!0,v.hidden=!0;return}let i=!1;try{i=await r.launcherIsDefault()}catch{i=!1}e===b&&(i?o.hidden=!0:(o.hidden=!1,s.textContent=`Set CWSP Launcher as Home for full launcher integration`,c.hidden=!1),l.hidden=!1,v.hidden=!1,await ee(r,e))};l.addEventListener(`input`,()=>{x=l.value.trim(),S&&clearTimeout(S),S=setTimeout(()=>{j()},180)}),c.addEventListener(`click`,async e=>{e.preventDefault(),e.stopPropagation();let t=await Ci();if(t){try{await t.launcherRequestDefault()}catch{}j()}});let M=e=>{if(!y||document.documentElement.hasAttribute(`data-app-menu-dragging`))return;let n=typeof e.composedPath==`function`?e.composedPath():[];for(let e of n)if(e===t||e===a||e instanceof Element&&t.contains(e)||e instanceof Element&&e.closest?.(`.cw-context-menu-layer`)||e instanceof Element&&e.closest?.(`.env-shell-app-menu__chrome-editor`)||e instanceof Element&&e.closest?.(`dialog.speed-dial-editor`))return;T()};document.addEventListener(`pointerdown`,M,{capture:!0});let re=[`.env-shell-app-menu__tile`,`.env-shell-app-menu__search`,`.env-shell-app-menu__banner`,`.env-shell-app-menu__pin-menu`,`.env-shell-app-menu__crumb-item`,`.env-shell-app-menu__start-heading`,`.env-shell-app-menu__chrome-editor`,`.env-shell-app-menu__drag-ghost`,`.cw-context-menu-layer`,`dialog.speed-dial-editor`].join(`, `),N=null,ie=e=>e instanceof Element&&!!e.closest(re),ae=e=>{if(y&&(e.button==null||e.button===0)){if(document.documentElement.hasAttribute(`data-app-menu-dragging`)||ie(e.target)){N=null;return}N={id:e.pointerId,x:e.clientX,y:e.clientY}}},oe=e=>{if(!N||N.id!==e.pointerId)return;let t=e.clientX-N.x,n=e.clientY-N.y;N=null,y&&(document.documentElement.hasAttribute(`data-app-menu-dragging`)||ie(e.target)||Math.hypot(t,n)>14||T())},se=e=>{N?.id===e.pointerId&&(N=null)};return t.addEventListener(`pointerdown`,ae),t.addEventListener(`pointerup`,oe),t.addEventListener(`pointercancel`,se),w(),{element:t,toggle:O,open:E,openPage:D,close:T,isOpen:()=>y,refresh:j,dispose:()=>{S&&clearTimeout(S),document.documentElement.toggleAttribute(`data-app-menu-dragging`,!1),document.removeEventListener(`pointerdown`,M,{capture:!0}),t.removeEventListener(`pointerdown`,ae),t.removeEventListener(`pointerup`,oe),t.removeEventListener(`pointercancel`,se),document.removeEventListener(`u2-theme-change`,r);try{i.disconnect()}catch{}t.remove()}}}var Pi,Fi,Ii,Li,Ri,zi;function Bi(){return(Bi=e((()=>{o(),j(),ge(),fr(),zn(),ie(),_i(),Hr(),yi(),s(),Pi=t(vi),Fi=!1,Ii=420,Li=10,Ri=null,zi=`circle`})))()}var Vi,Hi,Ui,Wi,Gi;function Ki(){return(Ki=e((()=>{ge(),Vi=null,Hi=e=>{let t=Ae(e.id);return Math.max(0,Number(t?.androidWidgetId)||0)},Ui=(e,t)=>{let n=t.getBoundingClientRect();return{widgetId:e,x:n.left,y:n.top,w:Math.max(8,n.width),h:Math.max(8,n.height),dpr:Number(window.devicePixelRatio)||1}},Wi=e=>{if(!Vi)return;let t=e||document.getElementById(`home`);t&&t.querySelectorAll(`[data-speed-dial-item][data-widget="android"][data-layer="icons"]`).forEach(e=>{let t=(Pe||[]).find(t=>t?.id===e.dataset.id);if(!t)return;let n=Hi(t);if(!n)return;let r=Ui(n,e);Vi.widgetAttach(r)})},Gi=()=>{Vi?.widgetHideAll?.()}})))()}var qi,Ji,Yi,Xi,Zi,Qi,$i,ea,ta,na,ra,ia,aa,oa,sa,ca,la,ua,da;function fa(){return(fa=e((()=>{M(),ge(),Ki(),qi=`/user/workspaces/`,Ji=`cwsp:workspace-page`,Yi=`cw::workspace::pages`,Xi=e=>`${qi}${e}/`,Zi=()=>[`side-a`,`side-b`,`side-c`].map(e=>({id:e,label:`Side ${e.slice(-1).toUpperCase()}`,path:Xi(e)})),Qi=()=>({activeId:`side-a`,pages:Zi(),snapshots:{}}),$i=()=>{try{let e=localStorage.getItem(Yi);if(!e)return Qi();let t=JSON.parse(e);return!t||!Array.isArray(t.pages)||!t.pages.length?Qi():{activeId:String(t.activeId||t.pages[0].id),pages:t.pages.map(e=>({id:String(e.id||``).trim(),label:String(e.label||e.id),path:String(e.path||Xi(e.id))})).filter(e=>e.id),snapshots:t.snapshots&&typeof t.snapshots==`object`?t.snapshots:{}}}catch{return Qi()}},ea=e=>({items:(e?.items||[]).map(e=>{let t=String(e.meta?.iconUrl||``);if(!/^(data:|blob:)/i.test(t))return e;let n={...e.meta||{}};return/^data:/i.test(t)&&e.id?n.iconUrl=ve(String(e.id),t):delete n.iconUrl,{...e,meta:n}})}),ta=e=>{try{localStorage.setItem(Yi,JSON.stringify(e))}catch(e){console.warn(`[workspace-pages] catalog persist failed`,e)}},na=e=>{try{window.dispatchEvent(new CustomEvent(Ji,{detail:{id:e,pages:ra()}}))}catch{}},ra=()=>$i().pages,ia=()=>$i().activeId||`side-a`,aa=()=>{let e=$i();e.pages.some(t=>t.id===e.activeId)&&(e.snapshots[e.activeId]=ea(he()),ta(e))};try{let e=globalThis;e.__CWSP_WORKSPACE_SNAPSHOT_SYNC_BOUND__||(e.__CWSP_WORKSPACE_SNAPSHOT_SYNC_BOUND__=!0,window.addEventListener(Te,aa))}catch{}oa=async e=>{try{let t=xe(`/user/`);if(!t?.mkdir||!t.writable)return;if(await t.mkdir(`/user/`,`workspaces`).catch(()=>void 0),await t.mkdir(qi,e.id).catch(()=>void 0),t.writeFile){let n=new File([JSON.stringify({id:e.id,label:e.label,path:e.path},null,2)],`workspace.json`,{type:`application/json`});await t.writeFile(e.path,n).catch(()=>void 0)}}catch(t){console.warn(`[workspace-pages] explorer dir failed`,e.id,t)}},sa=()=>{try{return matchMedia(`(prefers-reduced-motion: reduce)`).matches}catch{return!1}},ca=()=>{let e=document.querySelector(`.speed-dial-root`)||document.getElementById(`home`);if(!e)return[];let t=[...e.querySelectorAll(`.speed-dial-grid`)];return t.length?t:[e]},la=e=>{let t=e||(typeof document<`u`?document:null);t?.querySelectorAll&&(t.querySelectorAll(`.speed-dial-grid--turn-ghost`).forEach(e=>e.remove()),t.querySelectorAll(`[data-ws-turning]`).forEach(e=>{delete e.dataset.wsTurning,e.querySelectorAll(`.speed-dial-grid`).forEach(e=>{e.style.opacity=``})}))},ua=e=>{let t=ca(),n=t[0]?.closest(`.speed-dial-root`)||t[0]||null;if(la(n),!t.length||sa()||typeof t[0].animate!=`function`)return()=>void 0;let r=e<0?-1:1,i=`${-88*r}deg`,a=`${88*r}deg`,o=`${-18*r}%`,s=`${18*r}%`,c=n||t[0];c.dataset.wsTurning=r>0?`next`:`prev`;let l=[];for(let e of t){let t=e.cloneNode(!0);t.classList.add(`speed-dial-grid--turn-ghost`),t.dataset.wsGhost=`1`,t.setAttribute(`aria-hidden`,`true`),e.parentElement?.insertBefore(t,e.nextSibling),e.style.opacity=`0`,l.push(t),t.animate([{transform:`translateX(0) rotateY(0deg)`,opacity:1},{transform:`translateX(${o}) rotateY(${i})`,opacity:0}],{duration:180,easing:`cubic-bezier(.4, 0, .2, 1)`,fill:`forwards`})}let u=()=>{for(let e of t)e.style.opacity=``;for(let e of l)e.remove();delete c.dataset.wsTurning};return()=>{let e=t.map(e=>e.animate([{transform:`translateX(${s}) rotateY(${a})`,opacity:.2},{transform:`translateX(0) rotateY(0deg)`,opacity:1}],{duration:220,easing:`cubic-bezier(.22, 1, .36, 1)`,fill:`none`})),n=Promise.all(e.map(e=>e.finished.catch(()=>void 0))),r=new Promise(e=>{setTimeout(e,500)});Promise.race([n,r]).then(u)}},da=e=>{let t=$i(),n=t.pages.find(t=>t.id===e);if(!n)return!1;let r=t.activeId||t.pages[0].id;if(r===n.id)return!0;let i=Math.max(0,t.pages.findIndex(e=>e.id===r)),a=Math.max(0,t.pages.findIndex(e=>e.id===n.id))-i;Math.abs(a)>t.pages.length/2&&(a+=a>0?-t.pages.length:t.pages.length),t.snapshots[r]=ea(he()),t.activeId=n.id,ta(t),Gi();let o=ua(a);return Ee(t.snapshots[n.id]||{items:[]}),requestAnimationFrame(()=>{o(),requestAnimationFrame(()=>Wi())}),oa(n),na(n.id),!0}})))()}var pa,ma,ha;function ga(){return(ga=e((()=>{w(),zn(),pa=()=>{let e=globalThis;if(e.__CWSP_CAP_BACK_BOUND__)return;let t=e.Capacitor?.Plugins?.App;if(typeof t?.addListener==`function`){e.__CWSP_CAP_BACK_BOUND__=!0;try{t.addListener(`backButton`,({canGoBack:e})=>{if(T()&&b())return;if(document.querySelector(`.cw-context-menu-layer`)){G();return}if(document.querySelector(`.env-shell-app-menu[data-open]`)){document.querySelector(`.env-shell-app-menu`)?.dispatchEvent(new CustomEvent(`env-app-menu-request-close`,{bubbles:!0}));return}let t=document.querySelector(`dialog[open], .speed-dial-editor`);if(t){t.close?.(),t.remove?.();return}if(e){history.back();return}})}catch(e){console.warn(`[overlay-back] Capacitor backButton bind failed`,e)}}},ma=()=>{x({id:`app-menu-overlay`,priority:l.SIDEBAR,isActive:()=>!!document.querySelector(`.env-shell-app-menu[data-open]`),close:()=>(document.querySelector(`.env-shell-app-menu`)?.dispatchEvent(new CustomEvent(`env-app-menu-request-close`,{bubbles:!0})),!0)}),x({id:`speed-dial-editor`,priority:l.MODAL,isActive:()=>!!document.querySelector(`dialog.speed-dial-editor[open], dialog.sd-icon-picker[open]`),close:()=>(document.querySelectorAll(`dialog.speed-dial-editor[open], dialog.sd-icon-picker[open]`).forEach(e=>{try{e.close()}catch{e.remove()}}),!0)})},ha=()=>{let e=globalThis;if(e.__CWSP_LAUNCHER_BACK_STACK__){pa();return}e.__CWSP_LAUNCHER_BACK_STACK__=!0;try{S({preventDefaultNavigation:!0,pushInitialState:!0})}catch{}ma(),pa()}})))()}var _a;function va(){return(va=e((()=>{_a=`/*
 * Filename: TaskBar.scss
 * FullPath: modules/projects/fl.ui/src/ui/navigation/taskbar/scss/TaskBar.scss
 * Change date and time: 23.09.10_23.08.2026
 * Reason for changes: Mobile dock is pointer-transparent except Home FAB (apps go full-bleed).
 * FIND:mobile-dock
 */
/* Taskbar / env chrome (document + host). Former environment-shell/scss/chrome.scss. */
@layer ui-taskbar {
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
}`})))()}function ya(e){return`${Oa}${String(e||``).trim().toLowerCase()}`}function ba(){let e=document.querySelector(`.env-shell-chrome`);return e instanceof HTMLElement&&e.hasAttribute(`data-desktop`)?!1:e instanceof HTMLElement&&e.dataset.chromeLayout===`mobile`||typeof matchMedia==`function`&&matchMedia(`(max-width: 640px)`).matches}function xa(e,t){if(e.some(e=>{let t=String(e.id||``).trim().toLowerCase();return!t||t===`home`?!1:e.visible!==!1&&!e.minimized}))return!0;let n=String(t.value||`home`).trim().toLowerCase();if(n&&n!==`home`&&n!==`viewer`)return!0;let r=document.querySelector(`.env-shell-workspace`);if(!r)return!1;for(let e of r.querySelectorAll(`ui-window`)){if(!(e instanceof HTMLElement)||e.hidden||e.hasAttribute(`data-minimized`))continue;let t=getComputedStyle(e);if(t.display!==`none`&&t.visibility!==`hidden`&&!(Number.parseFloat(t.opacity||`1`)<=0))return!0}return!1}function Sa(e=new Date){return an(e)}function Ca(e){let t=se([]);m(t),f(Ea,t,{title:`Home`,icon:`house-line`},{},function(){for(let e of t)e!==this&&(e.active=!1);this.active=!0,e.focusedTaskId.value=`home`,e.onHome()}),f(Da,t,{title:`Markdown`,icon:`article`},{},function(){for(let e of t)e!==this&&(e.active=!1);this.active=!0,e.focusedTaskId.value=`viewer`,e.onViewer()});let n=document.createElement(`ui-taskbar`);n.className=`env-shell-taskbar wf-chrome-no-select`,n.setAttribute(`part`,`taskbar`),n.setAttribute(`data-type`,`desktop`);let r=document.createElement(`div`);r.className=`env-shell-taskbar__pins`;let i=document.createElement(`div`);i.className=`env-shell-taskbar__windows`;let a=document.createElement(`ui-task`);a.setAttribute(`title`,`Home`),a.setAttribute(`icon`,`house-line`),a.setAttribute(`data-id`,Ea),a.setAttribute(`data-env-home`,``),a.setAttribute(`aria-label`,`Home`),a.setAttribute(`aria-haspopup`,`menu`),r.append(a);let o=document.createElement(`div`);o.className=`env-shell-taskbar__workspaces`,o.setAttribute(`aria-label`,`Workspaces`);let s=()=>{let e=ra(),t=ia();o.replaceChildren();for(let n of e){let e=document.createElement(`button`);e.type=`button`,e.className=`env-shell-taskbar__workspace`,e.title=n.label,e.textContent=n.label.replace(/^Side\s+/i,``)||n.id.slice(-1).toUpperCase(),e.toggleAttribute(`data-active`,n.id===t),e.addEventListener(`click`,e=>{e.preventDefault(),e.stopPropagation(),da(n.id)}),o.append(e)}};s(),window.addEventListener(Ji,s),r.append(o),ha();let c=()=>{let e=ba();a.setAttribute(`title`,e?`Home`:`Start`),a.setAttribute(`aria-label`,e?`Home`:`Start`),a.setAttribute(`icon`,e?`house-line`:`windows-logo`),a.toggleAttribute(`data-env-start`,!e),e?a.setAttribute(`aria-keyshortcuts`,`LongPress`):a.removeAttribute(`aria-keyshortcuts`)};c();let l=document.createElement(`div`);l.className=`env-shell-taskbar__tray-host`;let u=document.createElement(`div`);u.className=`env-shell-taskbar__clock`,u.setAttribute(`role`,`button`),u.setAttribute(`tabindex`,`0`),u.setAttribute(`aria-label`,`Calendar`),u.setAttribute(`aria-haspopup`,`dialog`),u.setAttribute(`data-chrome-flyout-anchor`,`calendar`);let d=document.createElement(`span`);d.className=`env-shell-taskbar__clock-time`;let p=document.createElement(`span`);p.className=`env-shell-taskbar__clock-date`,u.append(d,p);let g=()=>{let{time:e,date:t}=Sa();d.textContent=e,p.textContent=t,u.title=`${e} · ${t}`};g();let _=setInterval(g,Aa),v=dn(e.device,`env-device-tray env-device-tray--taskbar`);v.setAttribute(`role`,`button`),v.setAttribute(`tabindex`,`0`),v.setAttribute(`aria-label`,`Quick settings`),v.setAttribute(`aria-haspopup`,`dialog`),v.setAttribute(`data-chrome-flyout-anchor`,`quick-settings`);let y=e=>{e.preventDefault(),e.stopPropagation(),nt(u)},b=e=>{e.preventDefault(),e.stopPropagation(),yt(v)};u.addEventListener(`click`,y),u.addEventListener(`keydown`,e=>{(e.key===`Enter`||e.key===` `)&&y(e)}),v.addEventListener(`click`,b),v.addEventListener(`keydown`,e=>{(e.key===`Enter`||e.key===` `)&&b(e)}),l.append(v,u);let x=document.createElement(`div`);x.className=`env-shell-navbar__switcher`,x.setAttribute(`role`,`menu`),x.setAttribute(`aria-label`,`Open apps`),x.hidden=!0;let S=document.createElement(`ul`);S.className=`env-shell-navbar__switcher-list`,x.appendChild(S),n.append(r,i,l,x);let C=xi(),w=C?Ni():void 0,T=new Map,E=[],D=null,O=!1,k=!1,A=[];A.push(()=>clearInterval(_));let ee=e=>E.find(t=>String(t.id||``).trim().toLowerCase()===e),te=t=>{let n=String(t||``).trim().toLowerCase();if(!n)return;let r=ee(n),i=String(e.focusedTaskId.value||``).trim().toLowerCase(),a=!!r?.focused||i===n||i===`markdown`&&n===`viewer`||i===`viewer`&&(n===`viewer`||n===`markdown`);if(r?.minimized){r.minimized=!1,r.focused=!0,T.get(n)?.toggleAttribute(`data-minimized`,!1),e.focusedTaskId.value=n===`markdown`?`viewer`:n,e.onWindowTask?.(n);return}if(a&&r&&r.visible!==!1){r.minimized=!0,r.focused=!1,T.get(n)?.toggleAttribute(`data-minimized`,!0),e.onMinimizeWindow?.(n);return}e.focusedTaskId.value=n===`markdown`?`viewer`:n,e.onWindowTask?.(n)},ne=(t,r,i)=>{if(ba())return;t.preventDefault(),t.stopPropagation();let a=String(r||``).trim().toLowerCase(),o=!!ee(a)?.minimized,s=[{id:o?`restore`:`minimize`,label:o?`Restore`:`Minimize`,icon:o?`arrow-square-out`:`minus`,action:()=>{o?(e.focusedTaskId.value=a,e.onWindowTask?.(a)):e.onMinimizeWindow?.(a)}},{id:`close`,label:`Close`,icon:`x`,danger:!0,action:()=>e.onCloseWindow?.(a)}];Rn({x:t.clientX,y:t.clientY,compact:!0,anchor:t.target instanceof Element?t.target:n,items:s})};n.addEventListener(`contextmenu`,t=>{if(ba())return;let r=typeof t.composedPath==`function`?t.composedPath():[];for(let e of r)if(e instanceof Element&&e.closest?.(`ui-task`))return;t.preventDefault(),t.stopPropagation(),Rn({x:t.clientX,y:t.clientY,compact:!0,anchor:n,items:[{id:`show-desktop`,label:`Show desktop`,icon:`desktop`,action:()=>e.onHome()},{id:`home`,label:`Home`,icon:`house-line`,action:()=>e.onHome()}]})});let j=()=>{k=!1,x.hidden=!0,S.replaceChildren(),n.removeAttribute(`data-switcher-open`)},M=()=>{let r=E.filter(e=>String(e.id||``).trim());if(S.replaceChildren(),r.length)for(let n of r){let r=String(n.id||``).trim().toLowerCase(),i=document.createElement(`li`);i.className=`env-shell-navbar__switcher-row`,i.setAttribute(`role`,`none`);let a=document.createElement(`button`);a.type=`button`,a.className=`env-shell-navbar__switcher-item`,a.setAttribute(`role`,`menuitem`),a.toggleAttribute(`data-active`,!!n.focused&&!n.minimized),a.toggleAttribute(`data-minimized`,!!n.minimized);let o=document.createElement(`ui-icon`);o.setAttribute(`icon`,n.icon||`app-window`),o.setAttribute(`icon-style`,`duotone`),o.setAttribute(`aria-hidden`,`true`);let s=document.createElement(`span`);s.className=`env-shell-navbar__switcher-label`,s.textContent=n.title||r,a.append(o,s),a.addEventListener(`click`,n=>{n.preventDefault(),n.stopPropagation(),j(),e.focusedTaskId.value=r;let i=ya(r),a=h(t,i);a?a.focus=!0:e.onWindowTask?.(r)});let c=document.createElement(`button`);c.type=`button`,c.className=`env-shell-navbar__switcher-close`,c.setAttribute(`aria-label`,`Close ${n.title||r}`),c.title=`Close`;let l=document.createElement(`ui-icon`);l.setAttribute(`icon`,`x`),l.setAttribute(`icon-style`,`bold`),l.setAttribute(`aria-hidden`,`true`),c.appendChild(l),c.addEventListener(`click`,t=>{t.preventDefault(),t.stopPropagation(),e.onCloseWindow?.(r),E=E.filter(e=>String(e.id||``).trim().toLowerCase()!==r),T.get(r)?.remove(),T.delete(r),E.length?M():j()}),i.append(a,c),S.appendChild(i)}else{let e=document.createElement(`li`);e.className=`env-shell-navbar__switcher-empty`,e.textContent=`No open apps`,S.appendChild(e)}k=!0,x.hidden=!1,n.setAttribute(`data-switcher-open`,``)},re=()=>{D!=null&&(clearTimeout(D),D=null)},N=()=>{n.toggleAttribute(`data-app-menu-open`,!!w?.isOpen())},ie=()=>{j(),w?.close(),N(),h(t,Ea).focus=!0,e.onHome()},oe=()=>{j(),w?.toggle(),N(),h(t,Ea).focus=!0,e.focusedTaskId.value=`home`,pe()},ce=()=>{!w||w.isOpen()||(j(),w.open(),N(),h(t,Ea).focus=!0,e.focusedTaskId.value=`home`,pe())},le=()=>{w&&(j(),w.openPage(),N(),h(t,Ea).focus=!0,e.focusedTaskId.value=`home`,pe())};try{let e=globalThis;e.__CWSP_LAUNCHER_HOME__={...e.__CWSP_LAUNCHER_HOME__||{},openAppMenu:ce,openAppMenuPage:le}}catch{}let ue=()=>{if(xa(E,e.focusedTaskId)){ie();return}if(w?.isOpen()){w.close(),N();return}oe()};a.addEventListener(`click`,e=>{if(O){e.preventDefault(),e.stopPropagation(),O=!1;return}if(C&&w){e.preventDefault(),e.stopPropagation(),ue();return}ie()}),a.addEventListener(`pointerdown`,e=>{if(ba()&&(e.button==null||e.button===0)){O=!1,re(),D=setTimeout(()=>{D=null,O=!0;try{a.releasePointerCapture?.(e.pointerId)}catch{}M()},ka);try{a.setPointerCapture?.(e.pointerId)}catch{}}},{capture:!0});let de=()=>{re()};a.addEventListener(`pointerup`,de,{capture:!0}),a.addEventListener(`pointercancel`,de,{capture:!0}),a.addEventListener(`contextmenu`,e=>{ba()&&(e.preventDefault(),O=!0,re(),M())});let fe=e=>{if(!k)return;let t=typeof e.composedPath==`function`?e.composedPath():[];for(let e of t)if(e===x||e===a||e instanceof Element&&(e===x||x.contains(e)||e===a))return;j()};document.addEventListener(`pointerdown`,fe,{capture:!0}),A.push(()=>document.removeEventListener(`pointerdown`,fe,{capture:!0}));let pe=()=>{let t=String(e.focusedTaskId.value||`home`),n=(e,t)=>{e.toggleAttribute(`data-env-active`,t),e.toggleAttribute(`data-active`,t),e.toggleAttribute(`data-focus`,t)};n(a,t===`home`);for(let[e,r]of T)n(r,t===e)};ae(()=>{pe()},[e.focusedTaskId],{triggerImmediately:!0});let me=e=>{let n=String(e.id||``).trim().toLowerCase();if(!n||n===`home`)return;let r=ya(n),a=e.title||n,o=String(e.icon||``).trim()||`app-window`,s=T.get(n);if(!s){let e=f(r,null,{title:a,icon:o},{viewId:n},function(){for(let e of t)e!==this&&(e.active=!1);this.active=!0,te(n)});e.list=t,t.push(e),s=document.createElement(`ui-task`),s.setAttribute(`data-id`,r),s.setAttribute(`data-view`,n),s.setAttribute(`title`,a),s.setAttribute(`aria-label`,a),s.setAttribute(`icon`,o),s.addEventListener(`click`,e=>{e.preventDefault(),e.stopPropagation(),te(n)}),s.addEventListener(`contextmenu`,e=>{ne(e,n,a)}),T.set(n,s),i.appendChild(s)}s.setAttribute(`title`,a),s.setAttribute(`aria-label`,a),s.setAttribute(`icon`,o),s.toggleAttribute(`data-minimized`,!!e.minimized),s.hidden=e.visible===!1},he=n=>{E=Array.isArray(n)?n.slice():[];let r=new Set;for(let t of n){let n=String(t.id||``).trim().toLowerCase();!n||n===`home`||(r.add(n),me(t),t.focused&&(e.focusedTaskId.value=n))}for(let[e,n]of[...T.entries()]){if(r.has(e))continue;let i=ya(e),a=h(t,i);if(a){let e=t.indexOf(a);e>=0&&t.splice(e,1)}n.remove(),T.delete(e)}pe(),k&&M()},ge=n=>{let r=String(n||`home`).toLowerCase(),i=Ea;r===`viewer`||r===`markdown`?i=Da:r!==`home`&&(i=ya(r));let a=h(t,i);if(a){for(let e of t)e!==a&&(e.active=!1);a.active=!0}e.focusedTaskId.value=r===`markdown`?`viewer`:r,pe()};if(queueMicrotask(c),w){let e=()=>N();n.addEventListener(`env-app-menu-open`,e),n.addEventListener(`env-app-menu-close`,e),A.push(()=>{n.removeEventListener(`env-app-menu-open`,e),n.removeEventListener(`env-app-menu-close`,e)})}return{element:n,taskList:t,setFocusedTaskId:ge,syncWindowTasks:he,appMenu:w,openAppMenu:w?ce:void 0,openAppMenuPage:w?le:void 0,isSwitcherOpen:()=>k,closeSwitcher:j,dispose:()=>{re(),j(),w?.dispose();for(let e of A)try{e()}catch{}A.length=0,T.clear(),i.replaceChildren()}}}var wa,Ta,Ea,Da,Oa,ka,Aa;function ja(){return(ja=e((()=>{j(),oe(),w(),zn(),hn(),lt(),Zt(),Bi(),fa(),ga(),I(),va(),o(),wa=t(_a),Ta=class extends Ie{constructor(){super()}styles=()=>wa;render=()=>E`<div part="taskbar" class="taskbar"><slot></slot></div>`},Ta=P([v(`ui-taskbar`)],Ta),Ea=`#env-home`,Da=`#env-viewer`,Oa=`#env-win-`,ka=420,Aa=3e4})))()}var Ma;function Na(){return(Na=e((()=>{Ma=`/**
 * Font Styles Index
 *
 * Font style declarations (not loading fonts directly)
 * Fonts are loaded via JavaScript font-loader module
 */
/**
 * Inter Font Family Styles
 *
 * Style declarations for Inter font family (not loading directly)
 * Fonts are loaded via JavaScript font-loader module
 */
/* Fallback fonts: */
:root, :host, :scope {
  font-family: Inter, sans-serif;
  font-optical-sizing: auto;
  font-variation-settings: "opsz" 16;
}

/* Variable fonts usage: */
@supports (font-variation-settings: normal) {
  :root, :host, :scope {
    font-family: InterVariable, sans-serif;
    font-optical-sizing: auto;
    font-variation-settings: "opsz" 16;
  }
}
/* Font feature values: */
@font-feature-values InterVariable {
  @character-variant {
    cv01: 1;
    cv02: 2;
    cv03: 3;
    cv04: 4;
    cv05: 5;
    cv06: 6;
    cv07: 7;
    cv08: 8;
    cv09: 9;
    cv10: 10;
    cv11: 11;
    cv12: 12;
    cv13: 13;
    alt-1: 1; /* Alternate one */
    alt-3: 9; /* Flat-top three */
    open-4: 2; /* Open four */
    open-6: 3; /* Open six */
    open-9: 4; /* Open nine */
    lc-l-with-tail: 5; /* Lower-case L with tail */
    simplified-u: 6; /* Simplified u */
    alt-double-s: 7; /* Alternate German double s */
    uc-i-with-serif: 8; /* Upper-case i with serif */
    uc-g-with-spur: 10; /* Capital G with spur */
    single-story-a: 11; /* Single-story a */
    compact-lc-f: 12; /* Compact f */
    compact-lc-t: 13; /* Compact t */
  }
  @styleset {
    ss01: 1;
    ss02: 2;
    ss03: 3;
    ss04: 4;
    ss05: 5;
    ss06: 6;
    ss07: 7;
    ss08: 8;
    open-digits: 1; /* Open digits */
    disambiguation: 2; /* Disambiguation (with zero) */
    disambiguation-except-zero: 4; /* Disambiguation (no zero) */
    round-quotes-and-commas: 3; /* Round quotes & commas */
    square-punctuation: 7; /* Square punctuation */
    square-quotes: 8; /* Square quotes */
    circled-characters: 5; /* Circled characters */
    squared-characters: 6; /* Squared characters */
  }
}
@font-feature-values Inter {
  @character-variant {
    cv01: 1;
    cv02: 2;
    cv03: 3;
    cv04: 4;
    cv05: 5;
    cv06: 6;
    cv07: 7;
    cv08: 8;
    cv09: 9;
    cv10: 10;
    cv11: 11;
    cv12: 12;
    cv13: 13;
    alt-1: 1; /* Alternate one */
    alt-3: 9; /* Flat-top three */
    open-4: 2; /* Open four */
    open-6: 3; /* Open six */
    open-9: 4; /* Open nine */
    lc-l-with-tail: 5; /* Lower-case L with tail */
    simplified-u: 6; /* Simplified u */
    alt-double-s: 7; /* Alternate German double s */
    uc-i-with-serif: 8; /* Upper-case i with serif */
    uc-g-with-spur: 10; /* Capital G with spur */
    single-story-a: 11; /* Single-story a */
    compact-lc-f: 12; /* Compact f */
    compact-lc-t: 13; /* Compact t */
  }
  @styleset {
    ss01: 1;
    ss02: 2;
    ss03: 3;
    ss04: 4;
    ss05: 5;
    ss06: 6;
    ss07: 7;
    ss08: 8;
    open-digits: 1; /* Open digits */
    disambiguation: 2; /* Disambiguation (with zero) */
    disambiguation-except-zero: 4; /* Disambiguation (no zero) */
    round-quotes-and-commas: 3; /* Round quotes & commas */
    square-punctuation: 7; /* Square punctuation */
    square-quotes: 8; /* Square quotes */
    circled-characters: 5; /* Circled characters */
    squared-characters: 6; /* Squared characters */
  }
}
@font-feature-values InterDisplay {
  @character-variant {
    cv01: 1;
    cv02: 2;
    cv03: 3;
    cv04: 4;
    cv05: 5;
    cv06: 6;
    cv07: 7;
    cv08: 8;
    cv09: 9;
    cv10: 10;
    cv11: 11;
    cv12: 12;
    cv13: 13;
    alt-1: 1; /* Alternate one */
    alt-3: 9; /* Flat-top three */
    open-4: 2; /* Open four */
    open-6: 3; /* Open six */
    open-9: 4; /* Open nine */
    lc-l-with-tail: 5; /* Lower-case L with tail */
    simplified-u: 6; /* Simplified u */
    alt-double-s: 7; /* Alternate German double s */
    uc-i-with-serif: 8; /* Upper-case i with serif */
    uc-g-with-spur: 10; /* Capital G with spur */
    single-story-a: 11; /* Single-story a */
    compact-lc-f: 12; /* Compact f */
    compact-lc-t: 13; /* Compact t */
  }
  @styleset {
    ss01: 1;
    ss02: 2;
    ss03: 3;
    ss04: 4;
    ss05: 5;
    ss06: 6;
    ss07: 7;
    ss08: 8;
    open-digits: 1; /* Open digits */
    disambiguation: 2; /* Disambiguation (with zero) */
    disambiguation-except-zero: 4; /* Disambiguation (no zero) */
    round-quotes-and-commas: 3; /* Round quotes & commas */
    square-punctuation: 7; /* Square punctuation */
    square-quotes: 8; /* Square quotes */
    circled-characters: 5; /* Circled characters */
    squared-characters: 6; /* Squared characters */
  }
}
/*
 * Filename: _variables.scss
 * FullPath: modules/projects/fl.ui/src/styles/ui/_variables.scss
 * Change date and time: 15.16.00_22.08.2026
 * Reason for changes: Fallback seed matches veela; emit inside @layer tokens so unlayered :root cannot beat SoT.
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
@layer tokens {
  :root {
    --fl-ui-radius: var(--radius-md, 0.5rem);
    --fl-ui-gap: var(--space-md, 0.75rem);
    /*
     * NOTE: Standalone fallback only. Same seed as veela SoT (\`#5a9ec8\`).
     * INVARIANT: stay inside \`@layer tokens\` — unlayered :root would beat veela.
     */
    --color-primary: #5a9ec8;
    --base-color: var(--color-primary);
    --color-surface: --u2-color-mod(var(--base-color), 920);
    --color-on-surface: --u2-color-mod(var(--base-color), 100);
    --color-on-surface-variant: --u2-color-mod(var(--base-color), 280);
    --error-color: var(--color-error, #f87171);
    --surface-color: var(--color-surface);
    --on-surface-color: var(--color-on-surface);
    --fl-surface: var(--color-surface);
    --fl-on-surface: var(--color-on-surface);
    /*
     * COMPAT: same names as veela \`@layer tokens\`. Component styles consume
     * these namespaced values; generic \`--icon-*\` variables stay local to
     * the ui-icon shadow contract.
     */
    --ui-icon-size: 1.25rem;
    --ui-icon-padding: 0px;
    --ui-icon-tile-padding: 0.45rem;
    --ui-window-icon-size: 0.95rem;
    --ui-explorer-icon-size: 1.5rem;
    --ui-explorer-icon-track: 2rem;
    --ui-explorer-action-icon-size: 1.15rem;
    --ui-explorer-row-height: 2.875rem;
  }
}
/* ai-refactor: optimized/refactored at 2026-02-13T00:45:15Z */
/* ai-refactor: optimized/refactored at 2026-02-13T00:45:12Z */
/*
 * Filename: layers.scss
 * FullPath: modules/projects/fl.ui/src/styles/layers.scss
 * Change date and time: 15.10.00_22.08.2026
 * Reason for changes: Match veela \`_layers.scss\` so fl.ui never establishes a shorter competing prelude.
 */
/*
 * INVARIANT: Copy of \`modules/projects/veela.css/src/scss/_layers.scss\`.
 * Change the veela file first, then keep this list identical.
 * Hosts \`@use\` this file; they must not declare a second \`@layer a, b, …\` prelude.
 */
@layer ux-normalize,
    tokens,
    ux-tokens,
    base,
    ux-base,
    layout,
    ux-layout,
    shells,
    shell,
    views,
    view,
    viewer,
    components,
    ux-components,
    ux-layer,
    ui-icon,
    ui-icon-reset,
    ux-file-manager,
    ux-file-manager-content,
    utilities,
    ux-utilities,
    theme,
    ux-theme,
    markdown,
    essentials,
    print,
    print-breaks,
    view-transitions,
    overrides,
    ux-overrides;
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
  @media (max-inline-size: 768px) {
    .btn {
      --ui-pad-y: var(--space-xs);
      --ui-pad-x: var(--space-md);
      --ui-font-size: var(--text-xs);
      --ui-min-h: 36px;
    }
  }
  @media (max-inline-size: 480px) {
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
@layer essentials {
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
@function --hsv(--src-color <color>) returns <color> {
  result: hsl(from var(--src-color, black) h calc(calc((calc(l / 100) - calc(calc(l / 100) * (1 - calc(s / 100) / 2))) / clamp(0.0001, min(calc(calc(l / 100) * (1 - calc(s / 100) / 2)), calc(1 - calc(calc(l / 100) * (1 - calc(s / 100) / 2)))), 1)) * 100) calc(calc(calc(l / 100) * (1 - calc(s / 100) / 2)) * 100) / alpha);
}
/*
 * Filename: _tokens.scss
 * FullPath: modules/projects/veela.css/src/scss/core/misc/_tokens.scss
 * Change date and time: 22.30.00_22.08.2026
 * Reason for changes: Light/dark primary-container so Start plates and chrome ink flip.
 */
/*
 * INVARIANT: This is the canonical color-token registry for the full veela bundle.
 * All color token DEFAULTS live here on \`:root, :host, :scope\`.
 * - \`misc/_tokens.scss\` is a symlink of this file.
 * - \`basic/misc/_tokens.scss\` and \`advanced/misc/_tokens.scss\` are intentional
 *   per-bundle SCSS alias shims (no CSS output) for the lightweight vl-basic / advanced
 *   bundles; they MUST NOT \`@forward\` this file (would pull the full \`@layer tokens\`
 *   CSS into those bundles and break their size semantics).
 * - \`basic/misc/_normalize.scss\` carries a documented vl-basic fallback palette for
 *   standalone vl-basic loading (no advanced MD3 tokens bundled).
 * - The advanced MD3/C2 system (\`advanced/tokens/_variables.scss\`, \`_color.scss\`,
 *   \`_shadow.scss\`) keeps its mixin/function definitions in place (depends on
 *   \`veela-lib\`); color-token EMISSION for that system is invoked from here where
 *   safe, otherwise remains in its layer with a pointer comment.
 * - Component/shell/view files keep only context overrides and shadow-DOM
 *   \`var(--token, light-dark(...))\` fallbacks; they never redefine a canonical default.
 */
/*
 * Filename: _color-properties.scss
 * FullPath: modules/projects/veela.css/src/scss/core/misc/_color-properties.scss
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
 * Filename: _layers.scss
 * FullPath: modules/projects/veela.css/src/scss/_layers.scss
 * Reason for changes: One cascade-order registry; include view-transitions before overrides.
 */
/*
 * INVARIANT: legacy layer names remain in the registry while their consumers
 * migrate. New component rules use the \`ux-*\` names; no host may establish a
 * competing layer order by importing a second prelude.
 */
@layer ux-normalize,
    tokens,
    ux-tokens,
    base,
    ux-base,
    layout,
    ux-layout,
    shells,
    shell,
    views,
    view,
    viewer,
    components,
    ux-components,
    ux-layer,
    ui-icon,
    ui-icon-reset,
    ux-file-manager,
    ux-file-manager-content,
    utilities,
    ux-utilities,
    theme,
    ux-theme,
    markdown,
    essentials,
    print,
    print-breaks,
    view-transitions,
    overrides,
    ux-overrides;
@function --u2-color-mod(--base-color <color>, --index <number> : 550) returns <color> {
  /* Ограничиваем индекс */
  --i: clamp(0, var(--index), 1000);
  /* Переданный цвет считается оттенком 550 */
  --pivot: 550;
  /* Расстояние от базового цвета к белой и чёрной границам */
  --white-distance:
    clamp(
      0,
      calc((var(--pivot) - var(--i)) / var(--pivot)),
      1
    );
  --black-distance:
    clamp(
      0,
      calc(
        (var(--i) - var(--pivot)) /
        (1000 - var(--pivot))
      ),
      1
    );
  /*
   * Нелинейное изменение светлоты:
   * близкие к 550 оттенки меньше отличаются от базового.
   */
  --to-white: pow(var(--white-distance), 1.15);
  --to-black: pow(var(--black-distance), 1.08);
  /*
   * Цветность максимальна около 550
   * и плавно снижается к обоим краям.
   */
  --center-left:
    clamp(0, calc(var(--i) / var(--pivot)), 1);
  --center-right:
    clamp(
      0,
      calc(
        (1000 - var(--i)) /
        (1000 - var(--pivot))
      ),
      1
    );
  --chroma-shape:
    sqrt(min(var(--center-left), var(--center-right)));
  /*
   * На краях остаётся 8% исходной цветности:
   * получается почти белый/чёрный, но с оттенком base-color.
   */
  --chroma-scale:
    calc(0.08 + 0.92 * var(--chroma-shape));
  result: oklch(from var(--base-color) calc(l + (0.985 - l) * var(--to-white) + (0.16 - l) * var(--to-black)) calc(c * var(--chroma-scale)) h);
}
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
    --ui-explorer-row-height: 2.875rem;
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
@layer utilities {
  .m-0 {
    margin: 0;
  }
  .mb-0 {
    margin-block: 0;
  }
  .mi-0 {
    margin-inline: 0;
  }
  .p-0 {
    padding: 0;
  }
  .pb-0 {
    padding-block: 0;
  }
  .pi-0 {
    padding-inline: 0;
  }
  .gap-0 {
    gap: 0;
  }
  .inset-0 {
    inset: 0;
  }
  .m-xs {
    margin: 0.25rem;
  }
  .mb-xs {
    margin-block: 0.25rem;
  }
  .mi-xs {
    margin-inline: 0.25rem;
  }
  .p-xs {
    padding: 0.25rem;
  }
  .pb-xs {
    padding-block: 0.25rem;
  }
  .pi-xs {
    padding-inline: 0.25rem;
  }
  .gap-xs {
    gap: 0.25rem;
  }
  .inset-xs {
    inset: 0.25rem;
  }
  .m-sm {
    margin: 0.5rem;
  }
  .mb-sm {
    margin-block: 0.5rem;
  }
  .mi-sm {
    margin-inline: 0.5rem;
  }
  .p-sm {
    padding: 0.5rem;
  }
  .pb-sm {
    padding-block: 0.5rem;
  }
  .pi-sm {
    padding-inline: 0.5rem;
  }
  .gap-sm {
    gap: 0.5rem;
  }
  .inset-sm {
    inset: 0.5rem;
  }
  .m-md {
    margin: 0.75rem;
  }
  .mb-md {
    margin-block: 0.75rem;
  }
  .mi-md {
    margin-inline: 0.75rem;
  }
  .p-md {
    padding: 0.75rem;
  }
  .pb-md {
    padding-block: 0.75rem;
  }
  .pi-md {
    padding-inline: 0.75rem;
  }
  .gap-md {
    gap: 0.75rem;
  }
  .inset-md {
    inset: 0.75rem;
  }
  .m-lg {
    margin: 1rem;
  }
  .mb-lg {
    margin-block: 1rem;
  }
  .mi-lg {
    margin-inline: 1rem;
  }
  .p-lg {
    padding: 1rem;
  }
  .pb-lg {
    padding-block: 1rem;
  }
  .pi-lg {
    padding-inline: 1rem;
  }
  .gap-lg {
    gap: 1rem;
  }
  .inset-lg {
    inset: 1rem;
  }
  .m-xl {
    margin: 1.25rem;
  }
  .mb-xl {
    margin-block: 1.25rem;
  }
  .mi-xl {
    margin-inline: 1.25rem;
  }
  .p-xl {
    padding: 1.25rem;
  }
  .pb-xl {
    padding-block: 1.25rem;
  }
  .pi-xl {
    padding-inline: 1.25rem;
  }
  .gap-xl {
    gap: 1.25rem;
  }
  .inset-xl {
    inset: 1.25rem;
  }
  .m-2xl {
    margin: 1.5rem;
  }
  .mb-2xl {
    margin-block: 1.5rem;
  }
  .mi-2xl {
    margin-inline: 1.5rem;
  }
  .p-2xl {
    padding: 1.5rem;
  }
  .pb-2xl {
    padding-block: 1.5rem;
  }
  .pi-2xl {
    padding-inline: 1.5rem;
  }
  .gap-2xl {
    gap: 1.5rem;
  }
  .inset-2xl {
    inset: 1.5rem;
  }
  .m-3xl {
    margin: 2rem;
  }
  .mb-3xl {
    margin-block: 2rem;
  }
  .mi-3xl {
    margin-inline: 2rem;
  }
  .p-3xl {
    padding: 2rem;
  }
  .pb-3xl {
    padding-block: 2rem;
  }
  .pi-3xl {
    padding-inline: 2rem;
  }
  .gap-3xl {
    gap: 2rem;
  }
  .inset-3xl {
    inset: 2rem;
  }
  .text-xs {
    font-size: 0.75rem;
    font-weight: 400;
    line-height: 1.5;
    letter-spacing: 0;
  }
  .text-sm {
    font-size: 0.875rem;
    font-weight: 400;
    line-height: 1.5;
    letter-spacing: 0;
  }
  .text-base {
    font-size: 1rem;
    font-weight: 400;
    line-height: 1.5;
    letter-spacing: 0;
  }
  .text-lg {
    font-size: 1.125rem;
    font-weight: 400;
    line-height: 1.5;
    letter-spacing: 0;
  }
  .text-xl {
    font-size: 1.25rem;
    font-weight: 400;
    line-height: 1.5;
    letter-spacing: 0;
  }
  .text-2xl {
    font-size: 1.5rem;
    font-weight: 400;
    line-height: 1.5;
    letter-spacing: 0;
  }
  .font-thin {
    font-weight: 100;
  }
  .font-light {
    font-weight: 300;
  }
  .font-normal {
    font-weight: 400;
  }
  .font-medium {
    font-weight: 500;
  }
  .font-semibold {
    font-weight: 600;
  }
  .font-bold {
    font-weight: 700;
  }
  .text-start {
    text-align: start;
  }
  .text-center {
    text-align: center;
  }
  .text-end {
    text-align: end;
  }
  .text-primary {
    color: #1e293b, #f1f5f9;
  }
  .text-secondary {
    color: #64748b, #94a3b8;
  }
  .text-muted {
    color: #94a3b8, #64748b;
  }
  .text-disabled {
    color: #cbd5e1, #475569;
  }
  .block,
  .vu-block {
    display: block;
  }
  .inline,
  .vu-inline {
    display: inline;
  }
  .inline-block {
    display: inline-block;
  }
  .flex,
  .vu-flex {
    display: flex;
  }
  .inline-flex {
    display: inline-flex;
  }
  .grid,
  .vu-grid {
    display: grid;
  }
  .hidden,
  .vu-hidden {
    display: none;
  }
  .flex-row {
    flex-direction: row;
  }
  .flex-col {
    flex-direction: column;
  }
  .flex-wrap {
    flex-wrap: wrap;
  }
  .flex-nowrap {
    flex-wrap: nowrap;
  }
  .items-start {
    align-items: flex-start;
  }
  .items-center {
    align-items: center;
  }
  .items-end {
    align-items: flex-end;
  }
  .items-stretch {
    align-items: stretch;
  }
  .justify-start {
    justify-content: flex-start;
  }
  .justify-center {
    justify-content: center;
  }
  .justify-end {
    justify-content: flex-end;
  }
  .justify-between {
    justify-content: space-between;
  }
  .justify-around {
    justify-content: space-around;
  }
  .grid-cols-1 {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }
  .grid-cols-2 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .grid-cols-3 {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
  .grid-cols-4 {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
  .h-auto,
  .block-size-auto {
    block-size: auto;
  }
  .h-full,
  .block-size-full {
    block-size: 100%;
  }
  .h-screen {
    block-size: 100vh;
  }
  .w-auto,
  .inline-size-auto {
    inline-size: auto;
  }
  .w-full,
  .inline-size-full {
    inline-size: 100%;
  }
  .w-screen {
    inline-size: 100vw;
  }
  .min-h-0,
  .min-block-size-0 {
    min-block-size: 0;
  }
  .min-w-0,
  .min-inline-size-0 {
    min-inline-size: 0;
  }
  .max-h-full,
  .max-block-size-full {
    max-block-size: 100%;
  }
  .max-w-full,
  .max-inline-size-full {
    max-inline-size: 100%;
  }
  .static {
    position: static;
  }
  .relative {
    position: relative;
  }
  .absolute {
    position: absolute;
  }
  .fixed {
    position: fixed;
  }
  .sticky {
    position: sticky;
  }
  .bg-surface {
    background-color: #fafbfc, #0f1419;
  }
  .bg-surface-container {
    background-color: #f1f5f9, #1e293b;
  }
  .bg-surface-container-high {
    background-color: #e2e8f0, #334155;
  }
  .bg-primary {
    background-color: #4e8fad, #8ec4d4;
  }
  .bg-secondary {
    background-color: #6b7280, #94a3b8;
  }
  .border {
    border: 1px solid #cbd5e1, #475569;
  }
  .border-2 {
    border: 2px solid #cbd5e1, #475569;
  }
  .border-primary {
    border: 1px solid #4e8fad, #8ec4d4;
  }
  .border-secondary {
    border: 1px solid #6b7280, #94a3b8;
  }
  .rounded-none {
    border-radius: 0;
  }
  .rounded-sm {
    border-radius: 0.25rem;
  }
  .rounded-md {
    border-radius: 0.375rem;
  }
  .rounded-lg {
    border-radius: 0.5rem;
  }
  .rounded-full {
    border-radius: 9999px;
  }
  .shadow-xs {
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  }
  .shadow-sm {
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  }
  .shadow-md {
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  }
  .shadow-lg {
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  }
  .shadow-xl {
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  }
  .cursor-pointer {
    cursor: pointer;
  }
  .cursor-default {
    cursor: default;
  }
  .cursor-not-allowed {
    cursor: not-allowed;
  }
  .select-none {
    user-select: none;
  }
  .select-text {
    user-select: text;
  }
  .select-all {
    user-select: all;
  }
  .visible {
    visibility: visible;
  }
  .invisible {
    visibility: hidden;
  }
  .collapse,
  .vs-collapsed {
    visibility: collapse;
  }
  .opacity-0 {
    opacity: 0;
  }
  .opacity-25 {
    opacity: 0.25;
  }
  .opacity-50 {
    opacity: 0.5;
  }
  .opacity-75 {
    opacity: 0.75;
  }
  .opacity-100 {
    opacity: 1;
  }
  @container (max-width: 320px) {
    .hidden\\@xs {
      display: none;
    }
  }
  @container (max-width: 640px) {
    .hidden\\@sm {
      display: none;
    }
  }
  @container (max-width: 768px) {
    .hidden\\@md {
      display: none;
    }
  }
  @container (max-width: 1024px) {
    .hidden\\@lg {
      display: none;
    }
  }
  @container (min-width: 320px) {
    .block\\@xs {
      display: block;
    }
  }
  @container (min-width: 640px) {
    .block\\@sm {
      display: block;
    }
  }
  @container (min-width: 768px) {
    .block\\@md {
      display: block;
    }
  }
  @container (min-width: 1024px) {
    .block\\@lg {
      display: block;
    }
  }
  @container (max-width: 320px) {
    .text-sm\\@xs {
      font-size: 0.875rem;
      font-weight: 400;
      line-height: 1.5;
      letter-spacing: 0;
    }
  }
  @container (min-width: 640px) {
    .text-base\\@sm {
      font-size: 1rem;
      font-weight: 400;
      line-height: 1.5;
      letter-spacing: 0;
    }
  }
  .icon-xs {
    --icon-size: 0.75rem;
  }
  .icon-sm {
    --icon-size: 0.875rem;
  }
  .icon-md {
    --icon-size: 1rem;
  }
  .icon-lg {
    --icon-size: 1.25rem;
  }
  .icon-xl {
    --icon-size: 1.5rem;
  }
  .center-absolute {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  .center-flex {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    flex-wrap: nowrap;
  }
  .interactive {
    cursor: pointer;
    touch-action: manipulation;
    user-select: none;
    -webkit-tap-highlight-color: transparent;
  }
  .interactive:focus-visible {
    outline: 2px solid #dbeafe, #1e40af;
    outline-offset: 2px;
  }
  .interactive:disabled, .interactive[aria-disabled=true] {
    cursor: not-allowed;
    opacity: 0.6;
    pointer-events: none;
  }
  .focus-ring:focus-visible {
    outline: 2px solid #dbeafe, #1e40af;
    outline-offset: 2px;
  }
  .truncate {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .truncate-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .truncate-3 {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .aspect-square {
    aspect-ratio: 1;
  }
  .aspect-video {
    aspect-ratio: 16 / 9;
  }
  .margin-block-0 {
    margin-block: 0;
  }
  .margin-block-sm {
    margin-block: var(--space-sm);
  }
  .margin-block-md {
    margin-block: var(--space-md);
  }
  .margin-block-lg {
    margin-block: var(--space-lg);
  }
  .margin-inline-0 {
    margin-inline: 0;
  }
  .margin-inline-sm {
    margin-inline: var(--space-sm);
  }
  .margin-inline-md {
    margin-inline: var(--space-md);
  }
  .margin-inline-lg {
    margin-inline: var(--space-lg);
  }
  .margin-inline-auto {
    margin-inline: auto;
  }
  .padding-block-0 {
    padding-block: 0;
  }
  .padding-block-sm {
    padding-block: var(--space-sm);
  }
  .padding-block-md {
    padding-block: var(--space-md);
  }
  .padding-block-lg {
    padding-block: var(--space-lg);
  }
  .padding-inline-0 {
    padding-inline: 0;
  }
  .padding-inline-sm {
    padding-inline: var(--space-sm);
  }
  .padding-inline-md {
    padding-inline: var(--space-md);
  }
  .padding-inline-lg {
    padding-inline: var(--space-lg);
  }
  .pointer-events-none {
    pointer-events: none;
  }
  .pointer-events-auto {
    pointer-events: auto;
  }
  .line-clamp-1 {
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .line-clamp-3 {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .vs-active {
    --state-active: 1;
  }
  .vs-disabled {
    pointer-events: none;
    opacity: 0.5;
  }
  .vs-loading {
    cursor: wait;
  }
  .vs-error {
    color: var(--color-error, #dc3545);
  }
  .vs-success {
    color: var(--color-success, #28a745);
  }
  .vs-hidden {
    display: none !important;
  }
  .vl-container,
  .container {
    inline-size: 100%;
    max-inline-size: var(--container-max, 1200px);
    margin-inline: auto;
  }
  .vl-container {
    padding-inline: var(--space-md);
  }
  .container {
    padding-inline: var(--space-lg);
  }
  .vl-grid {
    display: grid;
    gap: var(--gap-md);
  }
  .vl-stack {
    display: flex;
    flex-direction: column;
    gap: var(--gap-md);
  }
  .vl-cluster {
    display: flex;
    flex-wrap: wrap;
    gap: var(--gap-sm);
    align-items: center;
  }
  .vl-center {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .vu-sr-only {
    position: absolute;
    inline-size: 1px;
    block-size: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }
  .vc-surface {
    background-color: var(--color-surface);
    color: var(--color-on-surface);
  }
  .vc-surface-variant {
    background-color: var(--color-surface-variant);
    color: var(--color-on-surface-variant);
  }
  .vc-primary {
    background-color: var(--color-primary);
    color: var(--color-on-primary);
  }
  .vc-secondary {
    background-color: var(--color-secondary);
    color: var(--color-on-secondary);
  }
  .vc-elevated {
    box-shadow: var(--elev-1);
  }
  .vc-elevated-2 {
    box-shadow: var(--elev-2);
  }
  .vc-elevated-3 {
    box-shadow: var(--elev-3);
  }
  .vc-rounded {
    border-radius: var(--radius-md);
  }
  .vc-rounded-sm {
    border-radius: var(--radius-sm);
  }
  .vc-rounded-lg {
    border-radius: var(--radius-lg);
  }
  .vc-rounded-full {
    border-radius: var(--radius-full, 9999px);
  }
  .card {
    background: var(--color-bg);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    padding: var(--space-lg);
    box-shadow: var(--shadow-sm);
  }
  .stack > * + * {
    margin-block-start: var(--space-md);
  }
  .stack-sm > * + * {
    margin-block-start: var(--space-sm);
  }
  .stack-lg > * + * {
    margin-block-start: var(--space-lg);
  }
  @media print {
    .print-hidden {
      display: none !important;
    }
    .print-visible {
      display: block !important;
    }
    .print-break-before {
      page-break-before: always;
    }
    .print-break-after {
      page-break-after: always;
    }
    .print-break-inside-avoid {
      page-break-inside: avoid;
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .transition-fast,
    .transition-normal,
    .transition-slow {
      transition: none;
    }
    * {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }
  @media (prefers-contrast: high) {
    .text-primary {
      color: var(--color-on-surface);
    }
    .text-secondary,
    .text-muted,
    .text-disabled {
      color: var(--color-on-surface-variant);
    }
    .border {
      border-width: 2px;
    }
    .border-top {
      border-top-width: 2px;
    }
    .border-bottom {
      border-bottom-width: 2px;
    }
    .border-left {
      border-left-width: 2px;
    }
    .border-right {
      border-right-width: 2px;
    }
  }
}
@property --value {
  syntax: "<number>";
  initial-value: 0;
  inherits: true;
}
@property --relate {
  syntax: "<number>";
  initial-value: 0;
  inherits: true;
}
@property --drag-x {
  syntax: "<number>";
  initial-value: 0;
  inherits: false;
}
@property --drag-y {
  syntax: "<number>";
  initial-value: 0;
  inherits: false;
}
@property --order {
  syntax: "<integer>";
  initial-value: 1;
  inherits: true;
}
@property --content-inline-size {
  syntax: "<length-percentage>";
  initial-value: 100%;
  inherits: true;
}
@property --content-block-size {
  syntax: "<length-percentage>";
  initial-value: 100%;
  inherits: true;
}
@property --icon-size {
  syntax: "<length-percentage>";
  initial-value: 16px;
  inherits: true;
}
@property --icon-color {
  syntax: "<color>";
  initial-value: rgba(0, 0, 0, 0);
  inherits: true;
}
@property --icon-padding {
  syntax: "<length-percentage>";
  initial-value: 0px;
  inherits: true;
}
@property --icon-image {
  syntax: "<image>";
  initial-value: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0));
  inherits: true;
}
@layer ux-classes {
  .grid-rows > ::slotted(*) {
    display: grid;
    grid-auto-flow: column;
  }
  .grid-rows > ::slotted(*) {
    place-content: center;
    place-items: center;
  }
  .grid-rows > ::slotted(*) {
    --order: sibling-index();
    grid-column: 1/-1;
    grid-row: var(--order, 1)/calc(var(--order, 1) + 1);
    grid-template-columns: subgrid;
    grid-template-rows: minmax(0px, max-content);
  }
  :host(.grid-rows) ::slotted(::slotted(*)) {
    display: grid;
    grid-auto-flow: column;
  }
  :host(.grid-rows) ::slotted(::slotted(*)) {
    place-content: center;
    place-items: center;
  }
  :host(.grid-rows) ::slotted(::slotted(*)) {
    --order: sibling-index();
    grid-column: 1/-1;
    grid-row: var(--order, 1)/calc(var(--order, 1) + 1);
    grid-template-columns: subgrid;
    grid-template-rows: minmax(0px, max-content);
  }
  .grid-rows > * {
    display: grid;
    grid-auto-flow: column;
  }
  .grid-rows > * {
    place-content: center;
    place-items: center;
  }
  .grid-rows > * {
    --order: sibling-index();
    grid-column: 1/-1;
    grid-row: var(--order, 1)/calc(var(--order, 1) + 1);
    grid-template-columns: subgrid;
    grid-template-rows: minmax(0px, max-content);
  }
  :host(.grid-rows) ::slotted(*) {
    display: grid;
    grid-auto-flow: column;
  }
  :host(.grid-rows) ::slotted(*) {
    place-content: center;
    place-items: center;
  }
  :host(.grid-rows) ::slotted(*) {
    --order: sibling-index();
    grid-column: 1/-1;
    grid-row: var(--order, 1)/calc(var(--order, 1) + 1);
    grid-template-columns: subgrid;
    grid-template-rows: minmax(0px, max-content);
  }
  .grid-rows {
    --display: inline-grid;
    --flow: column;
    --items: center;
    --content: center;
    display: var(--display, inline-block);
    flex-direction: var(--flow, row);
    place-items: var(--items, center);
    place-content: var(--content, center);
    box-sizing: border-box;
  }
  .grid-rows {
    inline-size: auto;
    block-size: auto;
    --i-size: auto;
    --b-size: auto;
    inline-size: var(--i-size, 100%);
    block-size: var(--b-size, 100%);
    aspect-ratio: var(--ar, auto);
  }
  .grid-rows {
    grid-auto-rows: minmax(0px, max-content);
    grid-template-columns: minmax(0px, max-content) minmax(0px, 1fr) minmax(0px, max-content);
    margin: 0px;
    padding: 0px;
    list-style-type: none;
    list-style-position: inside;
  }
  :host(.grid-rows) {
    --display: inline-grid;
    --flow: column;
    --items: center;
    --content: center;
    display: var(--display, inline-block);
    flex-direction: var(--flow, row);
    place-items: var(--items, center);
    place-content: var(--content, center);
    box-sizing: border-box;
  }
  :host(.grid-rows) {
    inline-size: auto;
    block-size: auto;
    --i-size: auto;
    --b-size: auto;
    inline-size: var(--i-size, 100%);
    block-size: var(--b-size, 100%);
    aspect-ratio: var(--ar, auto);
  }
  :host(.grid-rows) {
    grid-auto-rows: minmax(0px, max-content);
    grid-template-columns: minmax(0px, max-content) minmax(0px, 1fr) minmax(0px, max-content);
    margin: 0px;
    padding: 0px;
    list-style-type: none;
    list-style-position: inside;
  }
  .grid-columns > ::slotted(*) {
    display: grid;
    grid-auto-flow: row;
  }
  .grid-columns > ::slotted(*) {
    place-content: center;
    place-items: center;
  }
  .grid-columns > ::slotted(*) {
    --order: sibling-index();
    grid-column: var(--order, 1)/calc(var(--order, 1) + 1);
    grid-row: 1/-1;
    grid-template-columns: minmax(0px, 1fr);
    grid-template-rows: subgrid;
  }
  :host(.grid-columns) ::slotted(::slotted(*)) {
    display: grid;
    grid-auto-flow: row;
  }
  :host(.grid-columns) ::slotted(::slotted(*)) {
    place-content: center;
    place-items: center;
  }
  :host(.grid-columns) ::slotted(::slotted(*)) {
    --order: sibling-index();
    grid-column: var(--order, 1)/calc(var(--order, 1) + 1);
    grid-row: 1/-1;
    grid-template-columns: minmax(0px, 1fr);
    grid-template-rows: subgrid;
  }
  .grid-columns > * {
    display: grid;
    grid-auto-flow: row;
  }
  .grid-columns > * {
    place-content: center;
    place-items: center;
  }
  .grid-columns > * {
    --order: sibling-index();
    grid-column: var(--order, 1)/calc(var(--order, 1) + 1);
    grid-row: 1/-1;
    grid-template-columns: minmax(0px, 1fr);
    grid-template-rows: subgrid;
  }
  :host(.grid-columns) ::slotted(*) {
    display: grid;
    grid-auto-flow: row;
  }
  :host(.grid-columns) ::slotted(*) {
    place-content: center;
    place-items: center;
  }
  :host(.grid-columns) ::slotted(*) {
    --order: sibling-index();
    grid-column: var(--order, 1)/calc(var(--order, 1) + 1);
    grid-row: 1/-1;
    grid-template-columns: minmax(0px, 1fr);
    grid-template-rows: subgrid;
  }
  .grid-columns {
    --display: inline-grid;
    --flow: row;
    --items: center;
    --content: center;
    display: var(--display, inline-block);
    flex-direction: var(--flow, row);
    place-items: var(--items, center);
    place-content: var(--content, center);
    box-sizing: border-box;
  }
  .grid-columns {
    inline-size: auto;
    block-size: auto;
    --i-size: auto;
    --b-size: auto;
    inline-size: var(--i-size, 100%);
    block-size: var(--b-size, 100%);
    aspect-ratio: var(--ar, auto);
  }
  .grid-columns {
    grid-auto-columns: minmax(0px, 1fr);
    grid-template-rows: minmax(0px, 1fr);
    margin: 0px;
    padding: 0px;
    list-style-type: none;
    list-style-position: inside;
  }
  :host(.grid-columns) {
    --display: inline-grid;
    --flow: row;
    --items: center;
    --content: center;
    display: var(--display, inline-block);
    flex-direction: var(--flow, row);
    place-items: var(--items, center);
    place-content: var(--content, center);
    box-sizing: border-box;
  }
  :host(.grid-columns) {
    inline-size: auto;
    block-size: auto;
    --i-size: auto;
    --b-size: auto;
    inline-size: var(--i-size, 100%);
    block-size: var(--b-size, 100%);
    aspect-ratio: var(--ar, auto);
  }
  :host(.grid-columns) {
    grid-auto-columns: minmax(0px, 1fr);
    grid-template-rows: minmax(0px, 1fr);
    margin: 0px;
    padding: 0px;
    list-style-type: none;
    list-style-position: inside;
  }
  .flex-columns > ::slotted(*) {
    --order: sibling-index();
    order: var(--order, auto);
    flex: 1 1 max-content;
  }
  .flex-columns > ::slotted(*) {
    place-content: center;
    place-items: center;
  }
  :host(.flex-columns) ::slotted(::slotted(*)) {
    --order: sibling-index();
    order: var(--order, auto);
    flex: 1 1 max-content;
  }
  :host(.flex-columns) ::slotted(::slotted(*)) {
    place-content: center;
    place-items: center;
  }
  .flex-columns > * {
    --order: sibling-index();
    order: var(--order, auto);
    flex: 1 1 max-content;
  }
  .flex-columns > * {
    place-content: center;
    place-items: center;
  }
  :host(.flex-columns) ::slotted(*) {
    --order: sibling-index();
    order: var(--order, auto);
    flex: 1 1 max-content;
  }
  :host(.flex-columns) ::slotted(*) {
    place-content: center;
    place-items: center;
  }
  .flex-columns {
    --display: inline-flex;
    --flow: column;
    --items: center;
    --content: center;
    display: var(--display, inline-block);
    flex-direction: var(--flow, row);
    place-items: var(--items, center);
    place-content: var(--content, center);
    box-sizing: border-box;
  }
  .flex-columns {
    inline-size: max-content;
    block-size: max-content;
    --i-size: max-content;
    --b-size: max-content;
    inline-size: var(--i-size, 100%);
    block-size: var(--b-size, 100%);
    aspect-ratio: var(--ar, auto);
  }
  :host(.flex-columns) {
    --display: inline-flex;
    --flow: column;
    --items: center;
    --content: center;
    display: var(--display, inline-block);
    flex-direction: var(--flow, row);
    place-items: var(--items, center);
    place-content: var(--content, center);
    box-sizing: border-box;
  }
  :host(.flex-columns) {
    inline-size: max-content;
    block-size: max-content;
    --i-size: max-content;
    --b-size: max-content;
    inline-size: var(--i-size, 100%);
    block-size: var(--b-size, 100%);
    aspect-ratio: var(--ar, auto);
  }
  .grid-layered > ::slotted(*) {
    grid-template-columns: minmax(0px, 1fr);
    grid-template-rows: minmax(0px, 1fr);
  }
  .grid-layered > ::slotted(*) > * {
    grid-column: 1/-1;
    grid-row: 1/-1;
  }
  :host(.grid-layered) ::slotted(::slotted(*)) {
    grid-template-columns: minmax(0px, 1fr);
    grid-template-rows: minmax(0px, 1fr);
  }
  :host(.grid-layered) ::slotted(::slotted(*)) > * {
    grid-column: 1/-1;
    grid-row: 1/-1;
  }
  .grid-layered > * {
    grid-template-columns: minmax(0px, 1fr);
    grid-template-rows: minmax(0px, 1fr);
  }
  .grid-layered > * > * {
    grid-column: 1/-1;
    grid-row: 1/-1;
  }
  :host(.grid-layered) ::slotted(*) {
    grid-template-columns: minmax(0px, 1fr);
    grid-template-rows: minmax(0px, 1fr);
  }
  :host(.grid-layered) ::slotted(*) > * {
    grid-column: 1/-1;
    grid-row: 1/-1;
  }
  .grid-layered {
    grid-template-columns: minmax(0px, 1fr);
    grid-template-rows: minmax(0px, 1fr);
  }
  .grid-layered > * {
    grid-column: 1/-1;
    grid-row: 1/-1;
  }
  .grid-layered {
    --display: inline-grid;
    --flow: column;
    --items: center;
    --content: center;
    display: var(--display, inline-block);
    flex-direction: var(--flow, row);
    place-items: var(--items, center);
    place-content: var(--content, center);
    box-sizing: border-box;
  }
  .grid-layered {
    inline-size: max-content;
    block-size: max-content;
    --i-size: max-content;
    --b-size: max-content;
    inline-size: var(--i-size, 100%);
    block-size: var(--b-size, 100%);
    aspect-ratio: var(--ar, auto);
  }
  :host(.grid-layered) {
    grid-template-columns: minmax(0px, 1fr);
    grid-template-rows: minmax(0px, 1fr);
  }
  :host(.grid-layered) > * {
    grid-column: 1/-1;
    grid-row: 1/-1;
  }
  :host(.grid-layered) {
    --display: inline-grid;
    --flow: column;
    --items: center;
    --content: center;
    display: var(--display, inline-block);
    flex-direction: var(--flow, row);
    place-items: var(--items, center);
    place-content: var(--content, center);
    box-sizing: border-box;
  }
  :host(.grid-layered) {
    inline-size: max-content;
    block-size: max-content;
    --i-size: max-content;
    --b-size: max-content;
    inline-size: var(--i-size, 100%);
    block-size: var(--b-size, 100%);
    aspect-ratio: var(--ar, auto);
  }
  .grid-rows-3c > ::slotted(*) {
    grid-template-columns: minmax(0px, max-content) minmax(0px, 1fr) minmax(0px, max-content);
  }
  :host(.grid-rows-3c) ::slotted(::slotted(*)) {
    grid-template-columns: minmax(0px, max-content) minmax(0px, 1fr) minmax(0px, max-content);
  }
  .grid-rows-3c > * {
    grid-template-columns: minmax(0px, max-content) minmax(0px, 1fr) minmax(0px, max-content);
  }
  :host(.grid-rows-3c) ::slotted(*) {
    grid-template-columns: minmax(0px, max-content) minmax(0px, 1fr) minmax(0px, max-content);
  }
  .grid-rows-3c {
    grid-template-columns: minmax(0px, max-content) minmax(0px, 1fr) minmax(0px, max-content);
  }
  .grid-rows-3c {
    inline-size: auto;
    block-size: auto;
    --i-size: auto;
    --b-size: auto;
    inline-size: var(--i-size, 100%);
    block-size: var(--b-size, 100%);
    aspect-ratio: var(--ar, auto);
  }
  :host(.grid-rows-3c) {
    grid-template-columns: minmax(0px, max-content) minmax(0px, 1fr) minmax(0px, max-content);
  }
  :host(.grid-rows-3c) {
    inline-size: auto;
    block-size: auto;
    --i-size: auto;
    --b-size: auto;
    inline-size: var(--i-size, 100%);
    block-size: var(--b-size, 100%);
    aspect-ratio: var(--ar, auto);
  }
  .grid-rows-3c > ::slotted(*:last-child) {
    grid-column: var(--order, 1)/3 span;
  }
  :host(.grid-rows-3c) ::slotted(::slotted(*:last-child)) {
    grid-column: var(--order, 1)/3 span;
  }
  .grid-rows-3c > *:last-child {
    grid-column: var(--order, 1)/3 span;
  }
  :host(.grid-rows-3c) ::slotted(*:last-child) {
    grid-column: var(--order, 1)/3 span;
  }
  .grid-rows-3c {
    --order: sibling-index();
  }
  .grid-rows-3c {
    grid-column: var(--order, 1)/var(--order, 1) span;
  }
  .grid-rows-3c {
    inline-size: auto;
    block-size: auto;
    --i-size: auto;
    --b-size: auto;
    inline-size: var(--i-size, 100%);
    block-size: var(--b-size, 100%);
    aspect-ratio: var(--ar, auto);
  }
  :host(.grid-rows-3c) {
    --order: sibling-index();
  }
  :host(.grid-rows-3c) {
    grid-column: var(--order, 1)/var(--order, 1) span;
  }
  :host(.grid-rows-3c) {
    inline-size: auto;
    block-size: auto;
    --i-size: auto;
    --b-size: auto;
    inline-size: var(--i-size, 100%);
    block-size: var(--b-size, 100%);
    aspect-ratio: var(--ar, auto);
  }
  .stretch-inline {
    inline-size: 100%;
    inline-size: -webkit-fill-available;
    inline-size: stretch;
  }
  :host(.stretch-inline) {
    inline-size: 100%;
    inline-size: -webkit-fill-available;
    inline-size: stretch;
  }
  .stretch-block {
    block-size: 100%;
    block-size: -webkit-fill-available;
    block-size: stretch;
  }
  :host(.stretch-block) {
    block-size: 100%;
    block-size: -webkit-fill-available;
    block-size: stretch;
  }
  .content-inline-size {
    padding-inline: max(100% - (100% - var(--content-inline-size, 100%) * 0.5), 0px);
  }
  :host(.content-inline-size) {
    padding-inline: max(100% - (100% - var(--content-inline-size, 100%) * 0.5), 0px);
  }
  .content-block-size {
    padding-block: max(100% - (100% - var(--content-block-size, 100%) * 0.5), 0px);
  }
  :host(.content-block-size) {
    padding-block: max(100% - (100% - var(--content-block-size, 100%) * 0.5), 0px);
  }
  .ux-anchor {
    inset-inline-start: max(var(--client-x, 0px), 0px);
    inset-block-start: max(var(--client-y, 0px), 0px);
    inset-inline-end: auto;
    inset-block-end: auto;
    direction: ltr;
    writing-mode: horizontal-tb;
    translate: 0% 0% 0%;
    transform: none;
  }
  .ux-anchor {
    --translate-x: round(nearest, min(0px, calc(100cqi - (100% + var(--client-x, 0px)))), calc(1px / var(--pixel-ratio, 1))) !important;
    --translate-y: round(nearest, min(0px, calc(100cqb - (100% + var(--client-y, 0px)))), calc(1px / var(--pixel-ratio, 1))) !important;
  }
  @supports (position-anchor: --example) {
    .ux-anchor {
      position-anchor: var(--anchor-group);
      inset-inline-start: anchor(var(--anchor-group) start);
      inset-block-start: anchor(var(--anchor-group) end);
      inline-size: anchor-size(var(--anchor-group) self-inline);
    }
  }
  :host(.ux-anchor) {
    inset-inline-start: max(var(--client-x, 0px), 0px);
    inset-block-start: max(var(--client-y, 0px), 0px);
    inset-inline-end: auto;
    inset-block-end: auto;
    direction: ltr;
    writing-mode: horizontal-tb;
    translate: 0% 0% 0%;
    transform: none;
  }
  :host(.ux-anchor) {
    --translate-x: round(nearest, min(0px, calc(100cqi - (100% + var(--client-x, 0px)))), calc(1px / var(--pixel-ratio, 1))) !important;
    --translate-y: round(nearest, min(0px, calc(100cqb - (100% + var(--client-y, 0px)))), calc(1px / var(--pixel-ratio, 1))) !important;
  }
  @supports (position-anchor: --example) {
    :host(.ux-anchor) {
      position-anchor: var(--anchor-group);
      inset-inline-start: anchor(var(--anchor-group) start);
      inset-block-start: anchor(var(--anchor-group) end);
      inline-size: anchor-size(var(--anchor-group) self-inline);
    }
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
    translate: 0% 0% 0%;
    writing-mode: horizontal-tb;
    transform: none;
  }
  :host(.ux-anchor) {
    --shift-x: var(--client-x, 0px);
    --shift-y: var(--client-y, 0px);
    --translate-x: round(nearest, min(0px, calc(100cqi - (100% + var(--shift-x, 0px)))), calc(1px / var(--pixel-ratio, 1))) !important;
    --translate-y: round(nearest, min(0px, calc(100cqb - (100% + var(--shift-y, 0px)))), calc(1px / var(--pixel-ratio, 1))) !important;
    inset-inline-start: max(var(--shift-x), 0px);
    inset-block-start: max(var(--shift-y), var(--status-bar-padding, 0px));
    inset-inline-end: auto;
    inset-block-end: auto;
    direction: ltr;
    translate: 0% 0% 0%;
    writing-mode: horizontal-tb;
    transform: none;
  }
  .layered-wrap {
    background-color: transparent;
    display: inline grid;
    inline-size: max-content;
    block-size: max-content;
    grid-template-columns: minmax(0px, 1fr);
    grid-template-rows: minmax(0px, 1fr);
    z-index: calc(var(--z-index, 0) + 1);
    overflow: visible;
  }
  .layered-wrap > * {
    grid-column: 1/-1;
    grid-row: 1/-1;
  }
  :host(.layered-wrap) {
    background-color: transparent;
    display: inline grid;
    inline-size: max-content;
    block-size: max-content;
    grid-template-columns: minmax(0px, 1fr);
    grid-template-rows: minmax(0px, 1fr);
    z-index: calc(var(--z-index, 0) + 1);
    overflow: visible;
  }
  :host(.layered-wrap) > * {
    grid-column: 1/-1;
    grid-row: 1/-1;
  }
}
@layer components {
  ui-icon {
    --icon-color: currentColor;
    --icon-size: 1rem;
    --icon-padding: 0.125rem;
    display: inline-grid;
    place-content: center;
    place-items: center;
    color: var(--icon-color);
    aspect-ratio: 1;
  }
  ui-icon {
    vertical-align: middle;
    margin-inline-end: 0.125rem;
  }
  ui-icon:last-child {
    margin-inline-end: 0;
  }
}
/*
 * Filename: _tokens.scss
 * FullPath: modules/projects/veela.css/src/scss/basic/misc/_tokens.scss
 * Change date and time: 12.30.00_06.08.2026
 * Reason for changes: Document canonical SoT for color tokens.
 */
/*
 * INVARIANT: Intentional per-bundle SCSS alias shim for the vl-basic bundle.
 * Produces NO CSS output — only \`$color-*\` / \`$space-*\` / \`$radius-*\` / \`$font-*\` SCSS aliases.
 * Canonical color-token source of truth: \`core/misc/_tokens.scss\` (full bundle).
 * Do NOT \`@forward\` canonical here — would emit the full \`@layer tokens\` CSS into the
 * lightweight vl-basic bundle and break its size semantics.
 */
/**
 * Veela CSS - Core Runtime
 *
 * Shared foundation styles for all veela variants.
 * This module provides:
 * - CSS layer definitions
 * - Normalize/reset styles
 * - Core layout utilities
 * - Base tokens and properties
 * - Essential state management
 *
 * Inherited by: basic, advanced, beercss
 */
@layer animations {
  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
  @keyframes app-shell-spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
  @keyframes viewer-spinner {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
  @keyframes explorer-spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
  @keyframes rs-spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
  @keyframes airpad-spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
  @keyframes view-spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  @keyframes viewer-fade-in {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  @keyframes viewer-slide-in {
    from {
      opacity: 0;
      transform: translateY(8px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  @keyframes slideInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  @keyframes scaleIn {
    from {
      opacity: 0;
      transform: scale(0.9);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
  @keyframes viewer-pulse {
    0%, 100% {
      opacity: 0.4;
    }
    50% {
      opacity: 0.8;
    }
  }
  @keyframes skeleton-pulse {
    0%, 100% {
      opacity: 0.4;
    }
    50% {
      opacity: 0.8;
    }
  }
  @keyframes pulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.8;
    }
  }
  @keyframes slide-in-top {
    from {
      opacity: 0;
      transform: translate(0, calc(-1 * var(--slide-distance, 1rem)));
    }
    to {
      opacity: 1;
      transform: translate(0, 0);
    }
  }
  @keyframes slide-in-right {
    from {
      opacity: 0;
      transform: translate(var(--slide-distance, 1rem), 0);
    }
    to {
      opacity: 1;
      transform: translate(0, 0);
    }
  }
  @keyframes slide-in-bottom {
    from {
      opacity: 0;
      transform: translate(0, var(--slide-distance, 1rem));
    }
    to {
      opacity: 1;
      transform: translate(0, 0);
    }
  }
  @keyframes slide-in-left {
    from {
      opacity: 0;
      transform: translate(calc(-1 * var(--slide-distance, 1rem)), 0);
    }
    to {
      opacity: 1;
      transform: translate(0, 0);
    }
  }
  @keyframes app-shell-status-enter {
    from {
      opacity: 0;
      transform: translateX(-50%) translateY(0.5rem);
    }
    to {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }
  }
  @keyframes shell-status-fade-in {
    from {
      opacity: 0;
      transform: translateX(-50%) translateY(1rem);
    }
    to {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }
  }
  @keyframes viewer-skeleton-shimmer {
    0% {
      background-position: -200% 0;
    }
    100% {
      background-position: 200% 0;
    }
  }
  @keyframes blink {
    0%, 50% {
      opacity: 1;
    }
    51%, 100% {
      opacity: 0;
    }
  }
  @keyframes card-pulse {
    0%, 100% {
      box-shadow: 0 0 0 3px color-mix(in oklch, var(--color-blue) 50%, transparent), var(--card-shadow-base);
    }
    50% {
      box-shadow: 0 0 0 6px color-mix(in oklch, var(--color-blue) 20%, transparent), var(--card-shadow-base);
    }
  }
  @keyframes card-hydrate-in {
    from {
      opacity: 0;
      transform: translateY(8px) scale(0.98);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
}
@function --wavy-step(--step <number>) {
  --angle: calc((var(--step, 0) * 2) * 1rad * pi);
  --variant: calc(cos(var(--clip-freq, 8) * var(--angle, 0deg)) * 0.5 + 0.5);
  --adjust: calc(var(--variant, 0) * var(--clip-amplitude, 0));
  --x: calc(50% + (cos(var(--angle, 0deg)) * (0.5 - var(--adjust, 0))) * var(--icon-size, 100%));
  --y: calc(50% + (sin(var(--angle, 0deg)) * (0.5 - var(--adjust, 0))) * var(--icon-size, 100%));
  result: var(--x) var(--y);
}
@layer ux-shapes {
  .shaped {
    display: flex;
    place-content: center;
    place-items: center;
    aspect-ratio: 1/1 !important;
    inline-size: stretch;
    block-size: fit-content;
    padding: 1.25rem;
    contain: strict;
    overflow: hidden;
    border-radius: var(--border-radius, 1.5rem);
    z-index: 1;
    pointer-events: auto;
    user-select: none;
    transition-behavior: allow-discrete;
    transition: --background-tone-shift 0.2s ease-in-out, --icon-color 0.2s ease-in-out;
  }
  .shaped span, .shaped ui-icon {
    inline-size: stretch;
    block-size: fit-content;
  }
  .shaped ui-icon {
    aspect-ratio: 1/1 !important;
  }
  *[data-dragging] {
    z-index: calc(100 + var(--z-index, 0)) !important;
  }
  *:not(:has(.shaped))[data-shape],
  *:not(.shaped) > *[data-shape],
  *:not(.shaped) .shaped[data-shape] {
    contain: strict;
    overflow: hidden;
    aspect-ratio: 1/1 !important;
    pointer-events: auto;
    touch-action: none;
  }
  *:not(:has(.shaped))[data-shape=square],
  *:not(.shaped) > *[data-shape=square],
  *:not(.shaped) .shaped[data-shape=square] {
    --border-radius: var(--radius-md);
    --clip-path: none;
  }
  *:not(:has(.shaped))[data-shape=squircle],
  *:not(.shaped) > *[data-shape=squircle],
  *:not(.shaped) .shaped[data-shape=squircle] {
    --border-radius: 28%;
    --clip-path: none;
  }
  *:not(:has(.shaped))[data-shape=circle],
  *:not(.shaped) > *[data-shape=circle],
  *:not(.shaped) .shaped[data-shape=circle] {
    --border-radius: 50%;
    --clip-path: none;
  }
  *:not(:has(.shaped))[data-shape=rounded],
  *:not(.shaped) > *[data-shape=rounded],
  *:not(.shaped) .shaped[data-shape=rounded] {
    --border-radius: var(--radius-xl);
    --clip-path: none;
  }
  *:not(:has(.shaped))[data-shape=blob],
  *:not(.shaped) > *[data-shape=blob],
  *:not(.shaped) .shaped[data-shape=blob] {
    --border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
    --clip-path: none;
  }
  *:not(:has(.shaped))[data-shape=hexagon],
  *:not(.shaped) > *[data-shape=hexagon],
  *:not(.shaped) .shaped[data-shape=hexagon] {
    --border-radius: 0;
    --clip-path: polygon(
        round 0.375rem,
        50% 0%, 93.3% 25%, 93.3% 75%, 50% 100%, 6.7% 75%, 6.7% 25%
    );
  }
  *:not(:has(.shaped))[data-shape=diamond],
  *:not(.shaped) > *[data-shape=diamond],
  *:not(.shaped) .shaped[data-shape=diamond] {
    --border-radius: 0;
    --clip-path: polygon(
        round 0.5rem,
        50% 0%, 100% 50%, 50% 100%, 0% 50%
    );
  }
  *:not(:has(.shaped))[data-shape=star],
  *:not(.shaped) > *[data-shape=star],
  *:not(.shaped) .shaped[data-shape=star] {
    --border-radius: 0;
    --clip-path: polygon(
        round 0.25rem,
        50% 0%,
        61% 35%, 98% 38%,
        68% 59%, 79% 95%,
        50% 75%,
        21% 95%, 32% 59%,
        2% 38%, 39% 35%
    );
  }
  *:not(:has(.shaped))[data-shape=badge],
  *:not(.shaped) > *[data-shape=badge],
  *:not(.shaped) .shaped[data-shape=badge] {
    --border-radius: 0;
    --clip-path: polygon(
        round 0.375rem,
        0% 0%, 100% 0%, 100% 70%, 50% 100%, 0% 70%
    );
  }
  *:not(:has(.shaped))[data-shape=heart],
  *:not(.shaped) > *[data-shape=heart],
  *:not(.shaped) .shaped[data-shape=heart] {
    --border-radius: 0;
    --clip-path: polygon(
        round 0.25rem,
        50% 100%,
        10% 65%, 0% 45%, 0% 30%,
        5% 15%, 18% 3%, 35% 0%, 50% 12%,
        65% 0%, 82% 3%, 95% 15%,
        100% 30%, 100% 45%, 90% 65%
    );
  }
  *:not(:has(.shaped))[data-shape=clover],
  *:not(.shaped) > *[data-shape=clover],
  *:not(.shaped) .shaped[data-shape=clover] {
    --border-radius: 0;
    --clip-path: polygon(
        round 0.375rem,
        50% 0%, 60% 30%, 70% 30%, 100% 50%,
        70% 70%, 60% 70%, 50% 100%,
        40% 70%, 30% 70%, 0% 50%,
        30% 30%, 40% 30%
    );
  }
  *:not(:has(.shaped))[data-shape=flower],
  *:not(.shaped) > *[data-shape=flower],
  *:not(.shaped) .shaped[data-shape=flower] {
    --border-radius: 0;
    --clip-path: polygon(
        round 0.25rem,
        50% 0%, 58% 25%, 85% 15%, 68% 40%,
        100% 50%, 68% 60%, 85% 85%, 58% 75%,
        50% 100%, 42% 75%, 15% 85%, 32% 60%,
        0% 50%, 32% 40%, 15% 15%, 42% 25%
    );
  }
  *:not(:has(.shaped))[data-shape=triangle],
  *:not(.shaped) > *[data-shape=triangle],
  *:not(.shaped) .shaped[data-shape=triangle] {
    --border-radius: 0;
    --clip-path: polygon(
        round 0.5rem,
        50% 0%, 100% 87%, 0% 87%
    );
  }
  *:not(:has(.shaped))[data-shape=pentagon],
  *:not(.shaped) > *[data-shape=pentagon],
  *:not(.shaped) .shaped[data-shape=pentagon] {
    --border-radius: 0;
    --clip-path: polygon(
        round 0.375rem,
        50% 0%, 97.5% 35%, 79.5% 95%, 20.5% 95%, 2.5% 35%
    );
  }
  *:not(:has(.shaped))[data-shape=octagon],
  *:not(.shaped) > *[data-shape=octagon],
  *:not(.shaped) .shaped[data-shape=octagon] {
    --border-radius: 0;
    --clip-path: polygon(
        round 0.25rem,
        30% 0%, 70% 0%, 100% 30%, 100% 70%,
        70% 100%, 30% 100%, 0% 70%, 0% 30%
    );
  }
  *:not(:has(.shaped))[data-shape=cross],
  *:not(.shaped) > *[data-shape=cross],
  *:not(.shaped) .shaped[data-shape=cross] {
    --border-radius: 0;
    --clip-path: polygon(
        round 0.375rem,
        35% 0%, 65% 0%, 65% 35%, 100% 35%,
        100% 65%, 65% 65%, 65% 100%, 35% 100%,
        35% 65%, 0% 65%, 0% 35%, 35% 35%
    );
  }
  *:not(:has(.shaped))[data-shape=arrow],
  *:not(.shaped) > *[data-shape=arrow],
  *:not(.shaped) .shaped[data-shape=arrow] {
    --border-radius: 0;
    --clip-path: polygon(
        round 0.375rem,
        0% 20%, 60% 20%, 60% 0%, 100% 50%,
        60% 100%, 60% 80%, 0% 80%
    );
  }
  *:not(:has(.shaped))[data-shape=egg],
  *:not(.shaped) > *[data-shape=egg],
  *:not(.shaped) .shaped[data-shape=egg] {
    --border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
    --clip-path: none;
  }
  *:not(:has(.shaped))[data-shape=tear],
  *:not(.shaped) > *[data-shape=tear],
  *:not(.shaped) .shaped[data-shape=tear] {
    --border-radius: 50cqmin 50cqmin 5rem 50cqmin;
    --clip-path: none;
    border-start-start-radius: 50cqmin;
    border-start-end-radius: 50cqmin;
    border-end-start-radius: 50cqmin;
    border-end-end-radius: 5rem;
  }
  *:not(:has(.shaped))[data-shape=wavy],
  *:not(.shaped) > *[data-shape=wavy],
  *:not(.shaped) .shaped[data-shape=wavy] {
    --border-radius: calc(var(--icon-size, 100%) * 0.5);
  }
}
@layer ux-agate {
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
/* NOTE: \`make-func\` lives in Veela (not \`src/lib\`); the old path was invalid. */
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
@layer ux-orientbox {
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
@layer ux-gridbox {
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
@layer ux-launcher-grid {
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
@layer ux-existence {
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
@layer ux-existence {
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
 * Filename: _normalize.scss
 * FullPath: modules/projects/fl.ui/src/styles/runtime/basic/misc/_normalize.scss
 * Change date and time: 16.25.00_31.07.2026
 * Reason for changes: vl-basic palette via --u2-color-mod (token names kept).
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
@layer tokens {
  :where(:root, html) {
    color-scheme: light dark;
    dynamic-range-limit: no-limit;
    /*
     * WHY: vl-basic loads only this runtime sheet; advanced MD3 tokens are not bundled.
     * Body/normalize use var(--color-bg) etc. — without defaults, backgrounds stay transparent
     * and light-dark() in views never resolves meaningfully.
     * Native CSS light-dark() follows the used color-scheme (Theme.ts sets html.style.colorScheme).
     */
    --color-primary: light-dark(#91b6e3, #2e3a64);
    --base-color: var(--color-primary);
    --color-bg: light-dark(
        --u2-color-mod(var(--base-color), 20),
        --u2-color-mod(var(--base-color), 980)
    );
    --color-text: light-dark(
        --u2-color-mod(var(--base-color), 900),
        --u2-color-mod(var(--base-color), 100)
    );
    --color-fg: var(--color-text);
    --color-bg-secondary: light-dark(
        --u2-color-mod(var(--base-color), 160),
        --u2-color-mod(var(--base-color), 840)
    );
    --color-bg-alt: light-dark(
        --u2-color-mod(var(--base-color), 200),
        --u2-color-mod(var(--base-color), 880)
    );
    --color-text-secondary: light-dark(
        --u2-color-mod(var(--base-color), 700),
        --u2-color-mod(var(--base-color), 280)
    );
    --color-border: light-dark(
        --u2-color-mod(var(--base-color), 300),
        --u2-color-mod(var(--base-color), 640)
    );
    --color-table: light-dark(
        --u2-color-mod(var(--base-color), 120),
        --u2-color-mod(var(--base-color), 860)
    );
    --color-link: var(--color-primary);
    --color-primary-hover: light-dark(
        --u2-color-mod(var(--base-color), 620),
        --u2-color-mod(var(--base-color), 480)
    );
    --color-secondary: light-dark(
        --u2-color-mod(var(--base-color), 420),
        --u2-color-mod(var(--base-color), 680)
    );
    --color-outline: light-dark(
        --u2-color-mod(var(--base-color), 100),
        --u2-color-mod(var(--base-color), 900)
    );
    --color-outline-variant: light-dark(
        --u2-color-mod(var(--base-color), 100),
        --u2-color-mod(var(--base-color), 900)
    );
    --font-sans: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    --line-height: 1.5;
    --border-radius: 0.5rem;
    tab-size: 4;
    text-size-adjust: 100%;
    interpolate-size: allow-keywords;
    font-size-adjust: from-font;
    font-optical-sizing: auto;
    font-size: 16px;
    line-height: 1.5;
    min-block-size: 0;
    min-inline-size: 0;
    padding: 0;
    margin: 0;
    border: none;
    contain: strict;
    overflow: hidden;
    font-family: var(--font-family, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif);
    inline-size: stretch;
    block-size: stretch;
    min-inline-size: 0px;
    min-block-size: 0px;
    max-inline-size: min(100%, min(100cqi, 100dvi));
    max-block-size: min(100%, min(100cqb, 100dvb));
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
}`})))()}function Pa(e){if(typeof Uint8Array.fromBase64==`function`)return Uint8Array.fromBase64(e);let t=atob(e),n=new Uint8Array(t.length);for(let e=0;e<t.length;e++)n[e]=t.charCodeAt(e);return n}async function Fa(e,t=`gzip`){if(typeof CompressionStream>`u`)throw Error(`Compression Streams API is not supported in this browser`);let n=new DecompressionStream(t),r=n.writable.getWriter(),i=n.readable.getReader();r.write(e),r.close();let a=[],o=!1;for(;!o;){let{value:e,done:t}=await i.read();o=t,e&&a.push(e)}let s=a.reduce((e,t)=>e+t.length,0),c=new Uint8Array(s),l=0;for(let e of a)c.set(e,l),l+=e.length;return c}async function Ia(e,t,n=`font/woff2`){if(Va.has(t))return Va.get(t);let r=new Blob([e],{type:n}),i=URL.createObjectURL(r);return Va.set(t,i),i}async function La(e){let{base64:t,family:n,style:r=`normal`,weight:i=`normal`,compressed:a=!1}=e,o=`${n}-${r}-${i}`;if(Ha.has(o))return Ha.get(o);let s=Pa(t),c=await Ia(a?await Fa(s):s,o,a?`application/octet-stream`:`font/woff2`),l=new FontFace(n,`url(${c}) format('woff2')`,{style:r,weight:typeof i==`string`?i:`${i}`,display:`swap`});return await l.load(),document.fonts.add(l),Ha.set(o,l),l}async function Ra(e){let t=e.map(e=>La(e));return Promise.all(t)}async function za(){return Ua||(Ua=c(()=>import(`./font-registry-DGJ_haGr.js`),[],import.meta.url)?.catch?.(e=>{console.error(`Failed to load font registry:`,e)}),Ua)}async function Ba(){let e=await za();return Ra(Object.values(e.fontRegistry))}var Va,Ha,Ua;function Wa(){return(Wa=e((()=>{s(),Va=new Map,Ha=new Map,Ua=null})))()}var Ga;function Ka(){return(Ka=e((()=>{Ga=`/*
 * Filename: layers.scss
 * FullPath: modules/projects/fl.ui/src/styles/layers.scss
 * Change date and time: 15.10.00_22.08.2026
 * Reason for changes: Match veela \`_layers.scss\` so fl.ui never establishes a shorter competing prelude.
 */
/*
 * INVARIANT: Copy of \`modules/projects/veela.css/src/scss/_layers.scss\`.
 * Change the veela file first, then keep this list identical.
 * Hosts \`@use\` this file; they must not declare a second \`@layer a, b, …\` prelude.
 */
@layer ux-normalize,
    tokens,
    ux-tokens,
    base,
    ux-base,
    layout,
    ux-layout,
    shells,
    shell,
    views,
    view,
    viewer,
    components,
    ux-components,
    ux-layer,
    ui-icon,
    ui-icon-reset,
    ux-file-manager,
    ux-file-manager-content,
    utilities,
    ux-utilities,
    theme,
    ux-theme,
    markdown,
    essentials,
    print,
    print-breaks,
    view-transitions,
    overrides,
    ux-overrides;
@layer components {
  button {
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
  button:hover:not(:disabled) {
    background: var(--color-border);
  }
  button:focus-visible {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
  }
  button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}
@layer layer.shell.faint.forms {
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
}`})))()}var qa,Ja;function Ya(){return(Ya=e((()=>{Wa(),o(),Na(),Ka(),qa=`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
`,Ja=async e=>{await r(qa)?.catch(()=>void 0),await Ba().catch(()=>void 0),await r(Ma)?.catch(()=>void 0),e?.includeGlobalNativeControls&&await r(Ga)?.catch(()=>void 0)}})))()}var Xa;function Za(){return(Za=e((()=>{Xa=`:host(ui-task), :host(ui-task) * {
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
}`})))()}var Qa,$a,eo,to;function no(){return(no=e((()=>{I(),o(),w(),Za(),Qa=t(Xa),$a=e=>{let t=``;if(typeof e==`string`)t=e;else if(typeof e==`object`&&e&&`value`in e){let n=e.value;t=n==null?``:String(n)}else e!=null&&typeof e!=`object`&&(t=String(e));(!t||t===`undefined`||t===`null`||t===`[object Object]`)&&(t=``);let n=t.trim().charAt(0);return n?n.toUpperCase():`?`},eo=(e,t,n)=>{let r=e.getAttribute(t);return r!=null&&String(r).trim()?String(r).trim():n},to=class extends Ie{title;icon;constructor(){super()}styles=()=>Qa;render=function(){let e=eo(this,`title`,`Task`),t=eo(this,`icon`,`app-window`),n=$a(e);return E`
            <div part="icon" class="task-icon c2-contrast c2-transparent" data-letter=${n}>
                <span class="task-letter" part="letter" aria-hidden="true">${n}</span>
                <ui-icon class="c2-contrast c2-transparent task-icon-glyph" part="glyph" icon=${t} icon-style="duotone"></ui-icon>
            </div>
            <div part="title" class="task-title c2-contrast c2-transparent">${e}</div>
        `}},P([g({source:`attr`})],to.prototype,`title`,void 0),P([g({source:`attr`})],to.prototype,`icon`,void 0),to=P([v(`ui-task`)],to)})))()}var ro;function io(){return(io=e((()=>{ro=`ui-taskbar[data-type=desktop] > ui-task[data-focus] {
  background: --c2-surface(0, var(--current));
  color: --c2-on-surface(0, var(--current));
  color: contrast-color(var(--c2-surface(0, var(--current))));
}

:host(ui-taskbar[data-type=desktop]) ::slotted(ui-task[data-focus]) {
  background: --c2-surface(0, var(--current));
  color: --c2-on-surface(0, var(--current));
  color: contrast-color(var(--c2-surface(0, var(--current))));
}`})))()}function ao(){return(ao=e((()=>{o(),io(),t(ro)})))()}var oo;function so(){return(so=e((()=>{oo=`ui-taskbar[data-type=mobile] > ui-task[data-focus] {
  background: --c2-surface(0, var(--current));
  color: --c2-on-surface(0, var(--current));
  color: contrast-color(var(--c2-surface(0, var(--current))));
}

:host(ui-taskbar[data-type=mobile]) ::slotted(ui-task[data-focus]) {
  background: --c2-surface(0, var(--current));
  color: --c2-on-surface(0, var(--current));
  color: contrast-color(var(--c2-surface(0, var(--current))));
}`})))()}function co(){return(co=e((()=>{o(),so(),t(oo)})))()}function lo(){try{return globalThis.navigator?.windowControlsOverlay??null}catch{return null}}function uo(){if(J)return J;if(typeof globalThis.matchMedia!=`function`)return`unknown`;try{if(globalThis.matchMedia(`(display-mode: window-controls-overlay)`).matches)return J=`window-controls-overlay`;if(globalThis.matchMedia(`(display-mode: fullscreen)`).matches)return J=`fullscreen`;if(globalThis.matchMedia(`(display-mode: standalone)`).matches)return J=`standalone`;if(globalThis.matchMedia(`(display-mode: minimal-ui)`).matches)return J=`minimal-ui`;if(globalThis.matchMedia(`(display-mode: browser)`).matches)return J=`browser`}catch{}return J=`unknown`}function fo(e){if(!e?.visible||typeof e.getTitlebarAreaRect!=`function`)return null;try{let t=e.getTitlebarAreaRect();return t?{x:t.x,y:t.y,width:t.width,height:t.height}:null}catch{return null}}function po(e){let t=lo(),n=!!t?.visible,r=uo(),i=n||r===`standalone`||r===`fullscreen`||r===`window-controls-overlay`||r===`minimal-ui`,a=`off`;return e&&(a=n?`wco`:i?`standalone`:`fallback`),{requested:e,wcoVisible:n,displayMode:r,titlebarRect:fo(t),isStandaloneLike:i,surface:a}}function mo(e){let t=()=>{J=null,e.onChange(po(e.getRequested()))},n=[];if(typeof globalThis.matchMedia==`function`)for(let e of[`(display-mode: window-controls-overlay)`,`(display-mode: standalone)`,`(display-mode: fullscreen)`,`(display-mode: minimal-ui)`,`(display-mode: browser)`])try{n.push(globalThis.matchMedia(e))}catch{}let r=()=>t();for(let e of n)try{e.addEventListener?.(`change`,r)}catch{try{e.addListener?.(r)}catch{}}let i=lo(),a=()=>t();try{i?.addEventListener?.(`geometrychange`,a)}catch{}return queueMicrotask(t),()=>{for(let e of n)try{e.removeEventListener?.(`change`,r)}catch{try{e.removeListener?.(r)}catch{}}try{i?.removeEventListener?.(`geometrychange`,a)}catch{}}}var J;function ho(){return(ho=e((()=>{J=null})))()}var Y,go,_o,vo,yo,bo,xo,X,So,Co,wo,Z,To,Eo,Do,Oo,ko,Ao,Q,jo,Mo,No,Po,$,Fo,Io,Lo,Ro,zo,Bo;function Vo(){return(Vo=e((()=>{Y=null,go=null,_o=null,vo=null,yo=null,bo=null,xo=null,X=0,So=null,Co=`#cbb8a4`,wo=`__CWSP_NATIVE_THEME_COLOR_OWNED__`,Z=e=>{let t=String(e||``).trim().toLowerCase();if(!t)return!1;if(t===`#007acc`||t===`#007accff`||t===`#36c`||t===`#3366cc`)return!0;let n=t.match(/^rgba?\(\s*([\d.]+)\s*[, ]\s*([\d.]+)\s*[, ]\s*([\d.]+)/i);if(n&&(t?.startsWith?.(`#`)||t?.startsWith?.(`rgb`))){let e=Math.round(Number(n[1])),t=Math.round(Number(n[2])),r=Math.round(Number(n[3]));if(e<=20&&t>=100&&t<=140&&r>=180&&r<=220)return!0}return!1},To=()=>{try{return!!globalThis?.[wo]}catch{return!1}},Eo=e=>{yo=e;try{globalThis[wo]=!!e}catch{}},Do=e=>!e||!e.isConnected||e.hasAttribute(`minimized`)?!1:e.hasAttribute(`native-mode`)?!0:e.hasAttribute(`maximized`)||e.hasAttribute(`data-desk-max`)||e.hasAttribute(`data-mobile-max`)||e.hasAttribute(`data-native-active`),Oo=()=>{if(typeof document>`u`)return null;if(yo?.isConnected&&Do(yo))return yo;let e=Array.from(document.querySelectorAll(`ui-window[native-mode]:not([minimized])`));if(e.length)return e[e.length-1];let t=Array.from(document.querySelectorAll(`ui-window[data-desk-max]:not([minimized]), ui-window[maximized]:not([minimized]), ui-window[data-mobile-max]:not([minimized])`));for(let e=t.length-1;e>=0;e--){let n=t[e];if(Do(n))return n}return null},ko=()=>{go||typeof MutationObserver>`u`||typeof document>`u`||(go=new MutationObserver(()=>{xo=null;let e=Oo();e?.isConnected?zo(e):Fo()}),go.observe(document.documentElement,{attributes:!0,attributeFilter:[`data-theme`,`class`,`style`,`color-scheme`]}))},Ao=e=>{_o||typeof MutationObserver>`u`||(_o=new MutationObserver(()=>{if(!To())return;let t=(e.getAttribute(`content`)||``).toLowerCase(),n=(bo||``).toLowerCase();if(n&&t===n&&!Z(t))return;let r=Oo();r?zo(r):Z(t)&&$(Co,!0)}),_o.observe(e,{attributes:!0,attributeFilter:[`content`]}))},Q=e=>{let t=String(e||``).trim();if(!t||t===`transparent`||t===`rgba(0, 0, 0, 0)`)return null;let n=t.match(/^#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i);if(n){let e=n[1];e.length===3?e=e[0]+e[0]+e[1]+e[1]+e[2]+e[2]:e.length===8&&(e=e.slice(0,6));let t=`#${e.toLowerCase()}`;return Z(t)?null:t}let r=t.match(/^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)(?:\s*,\s*([\d.]+))?\s*\)$/i);if(r){let e=r[4]===void 0?1:Number(r[4]);if(!Number.isFinite(e)||e<.5)return null;let t=`#${[Math.max(0,Math.min(255,Math.round(Number(r[1])))),Math.max(0,Math.min(255,Math.round(Number(r[2])))),Math.max(0,Math.min(255,Math.round(Number(r[3]))))].map(e=>e.toString(16).padStart(2,`0`)).join(``)}`;return Z(t)?null:t}let i=t.match(/^rgba?\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)(?:\s*\/\s*([\d.]+%?))?\s*\)$/i);if(i){let e=1;if(i[4]!==void 0&&(e=String(i[4]).endsWith(`%`)?Number(i[4])/100:Number(i[4])),!Number.isFinite(e)||e<.5)return null;let t=`#${[Math.max(0,Math.min(255,Math.round(Number(i[1])))),Math.max(0,Math.min(255,Math.round(Number(i[2])))),Math.max(0,Math.min(255,Math.round(Number(i[3]))))].map(e=>e.toString(16).padStart(2,`0`)).join(``)}`;return Z(t)?null:t}try{if(typeof document>`u`)return null;vo||(vo=document.createElement(`canvas`),vo.width=1,vo.height=1);let e=vo.getContext(`2d`,{willReadFrequently:!0});if(!e)return null;e.fillStyle=`#000000`,e.fillStyle=t;let n=String(e.fillStyle||``);if(n.startsWith(`#`)&&n.length>=7){let e=n.slice(0,7).toLowerCase();return Z(e)?null:e}return Q(n)}catch{return null}},jo=()=>{if(typeof document>`u`)return null;let e=document.querySelector(`meta[data-theme-color]`)||document.querySelector(`meta[name="theme-color"]`);e||(e=document.createElement(`meta`),e.setAttribute(`name`,`theme-color`),e.setAttribute(`data-theme-color`,``),document.head?.appendChild(e));try{let t=Array.from(document.querySelectorAll(`meta[name="theme-color"]`));for(let n of t)n!==e&&n.remove()}catch{}return Ao(e),e},Mo=(e,t)=>{try{let n=document.createElement(`div`);n.setAttribute(`data-theme-color-probe`,`true`),n.style.cssText=`position:fixed;left:-8px;top:-8px;inline-size:4px;block-size:4px;pointer-events:none;opacity:0;background:${t}`,e.appendChild(n);let r=Q(getComputedStyle(n).backgroundColor);return n.remove(),r}catch{return null}},No=()=>{if(xo)return xo;try{let e=getComputedStyle(document.documentElement).getPropertyValue(`--color-surface-container`).trim();xo=Q(e)||Mo(document.documentElement,`var(--color-surface-container, Canvas)`)||Co}catch{xo=Co}return xo},Po=e=>{let t=e.querySelector(`.env-ui-window__body`),n=t?.querySelector(`.settings-screen__top, .view-settings, .view-explorer, .cw-view-viewer-shell`)||t;if(n){let e=Q(getComputedStyle(n).backgroundColor);if(e)return e}return No()},$=(e,t=!1)=>{let n=jo();if(!n||!e)return;let r=e.toLowerCase();Z(r)&&(r=Co);let i=(n.getAttribute(`content`)||``).toLowerCase();if(!(i===r&&!t&&!Z(i))&&(n.setAttribute(`content`,r),n.setAttribute(`data-theme-color`,``),n.removeAttribute(`media`),bo=r,t||i!==r||Z(i)))try{let e=n.parentNode||document.head;e?.removeChild(n),e?.appendChild(n)}catch{}},Fo=()=>{if(typeof document>`u`||Oo())return;Eo(null),bo=null;let e=jo();if(!e)return;let t=document.documentElement,n=getComputedStyle(t),r=document.body?getComputedStyle(document.body):null,i=Q(n.getPropertyValue(`--color-surface-container`).trim())||Q(n.getPropertyValue(`--color-surface`).trim())||Q(n.getPropertyValue(`--ui-win-titlebar-bg`).trim())||(r?Q(r.backgroundColor):null)||Q(n.backgroundColor);i?$(i):Z(String(e.getAttribute(`content`)||``))&&$(Co,!0),ko()},Io=e=>e.hasAttribute(`maximized`)||e.hasAttribute(`data-desk-max`)||e.hasAttribute(`data-mobile-max`)||e.hasAttribute(`data-native-active`),Lo=()=>{if(X){if(typeof cancelIdleCallback==`function`)try{cancelIdleCallback(X)}catch{clearTimeout(X)}else clearTimeout(X);X=0,So=null}},Ro=e=>{if(So=e,X)return;let t=()=>{X=0;let e=So;So=null,e?.isConnected&&(e.hasAttribute(`minimized`)||!e.hasAttribute(`native-mode`)&&!Io(e)||($(Po(e)||Co,!1),ko()))};X=typeof requestIdleCallback==`function`?requestIdleCallback(t,{timeout:120}):setTimeout(t,0)},zo=e=>{if(!e||typeof document>`u`||e.hasAttribute(`minimized`)||!e.hasAttribute(`native-mode`)&&!Io(e)&&!Do(e))return;let t=jo();if(t){if(Y==null){let e=t.getAttribute(`content`)||``;Y=Z(e)?``:e}if(Eo(e),Z(String(t.getAttribute(`content`)||``))&&$(Co,!1),bo&&!Z(bo)){$(bo,!1),ko();return}Ro(e)}},Bo=e=>{if(typeof document>`u`||!document.querySelector(`meta[name="theme-color"]`))return;let t=Oo();if(t&&t!==e){zo(t);return}let n=Array.from(document.querySelectorAll(`ui-window[native-mode]:not([minimized]), ui-window[data-desk-max]:not([minimized]), ui-window[maximized]:not([minimized]), ui-window[data-mobile-max]:not([minimized])`)).filter(t=>t!==e&&Do(t));if(n.length){zo(n[n.length-1]);return}Eo(null),bo=null,Lo(),Y!=null&&Y&&!Z(Y)?($(Y,!0),Y=null):(Y=null,Fo())},typeof document<`u`&&queueMicrotask(()=>{try{Fo()}catch{}})})))()}var Ho;function Uo(){return(Uo=e((()=>{Ho=`/*
 * Filename: Windows2.scss
 * FullPath: modules/projects/fl.ui/src/ui/containers/window/Windows2.scss
 * Change date and time: 23.09.20_23.08.2026
 * Reason for changes: Empty footer-handler collapsed — slot child broke :empty / :has-slotted.
 * FIND:win-footer
 */
/* COMPAT: Adopted shadow sheet cannot see document --u2-color-mod; body matches veela SoT. */
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
}`})))()}var Wo,Go,Ko,qo,Jo,Yo,Xo;function Zo(){return(Zo=e((()=>{w(),o(),I(),j(),ho(),Vo(),Uo(),Wo=t(Ho),Go=`minus`,Ko=`corners-out`,qo=`corners-in`,Jo=`x`,Yo=Object.freeze({w:240,h:160}),Xo=class extends F{titleHandler;contentHandler;footerHandler;resizer;#e=k(0);#t=k(0);#n=null;#r=null;#i=null;#a=null;#o=null;#s=null;#c=null;#l=!1;#u=0;#d=0;#f=null;#p=null;#m=null;styles=function(){return Wo};render=function(){return E`<div class="window-container" part="window-container">
            <header class="title-handler" part="title-handler">
                <div class="title-handler-main" part="title">
                    <slot name="title"></slot>
                </div>
                <div class="title-handler-actions" part="actions">
                    <slot name="actions"></slot>
                </div>
                <div class="title-handler-buttons" part="controls" data-no-drag>
                    <button class="title-minimize" type="button" aria-label="Minimize" title="Minimize" data-no-drag data-ui-win-action="minimize">
                        <ui-icon icon=${Go}></ui-icon>
                    </button>
                    <button class="title-maximize" type="button" aria-label="Maximize" title="Maximize" data-no-drag data-ui-win-action="maximize">
                        <ui-icon icon=${Ko}></ui-icon>
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
                        <ui-icon icon=${qo}></ui-icon>
                    </button>
                    <button class="title-close" type="button" aria-label="Close" title="Close" data-no-drag data-ui-win-action="close">
                        <ui-icon icon=${Jo}></ui-icon>
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
        </div>`};constructor(){super()}get managed(){return this.hasAttribute(`managed`)}get nativeMode(){return this.hasAttribute(`native-mode`)}set nativeMode(e){this.toggleAttribute(`native-mode`,!!e),this.#y()}get nativeSurface(){return this.#f?.surface??(this.nativeMode?`fallback`:`off`)}onInitialize(){super.onInitialize()}onRender(){super.onRender(),this.#h()}connectedCallback(){super.connectedCallback?.(),this.#h(),this.#v()}disconnectedCallback(){queueMicrotask(()=>{this.isConnected||(this.#s?.(),this.#s=null,this.#c?.disconnect(),this.#c=null,this.#o?.disconnect(),this.#o=null,this.#a?.(),this.#a=null,this.#l=!1,this.#u=0,this.#i?.(),this.#i=null,this.#n?.(),this.#n=null,this.#r?.(),this.#r=null,this.#p?.(),this.#p=null,this.#m=null,super.disconnectedCallback?.())})}#h(){let e=()=>{this.#A(),this.#w(),this.#n||this.#j(),this.#r||this.#M(),this.#g(),!this.#l&&this.#u++<12&&requestAnimationFrame(e)};queueMicrotask(e)}#g(){if(this.#p){this.#_();return}let e=this.shadowRoot?.querySelector?.(`slot[name="footer"]`);if(!(e instanceof HTMLSlotElement))return;let t=()=>this.#_();e.addEventListener(`slotchange`,t),this.#p=()=>e.removeEventListener(`slotchange`,t),this.#_()}#_(){let e=this.shadowRoot?.querySelector?.(`slot[name="footer"]`),t=this.shadowRoot?.querySelector?.(`.footer-handler`);if(!(e instanceof HTMLSlotElement)||!(t instanceof HTMLElement))return;let n=!e.assignedNodes({flatten:!0}).some(e=>e.nodeType===Node.ELEMENT_NODE||e.nodeType===Node.TEXT_NODE&&!!e.textContent?.trim());t.toggleAttribute(`data-empty`,n),t.hidden=n}#v(){this.#s||(this.#s=mo({getRequested:()=>this.nativeMode,onChange:e=>this.#b(e)}),typeof MutationObserver<`u`&&!this.#c&&(this.#c=new MutationObserver(e=>{let t=!1,n=!1;for(let r of e)r.attributeName===`native-mode`&&(t=!0),(r.attributeName===`maximized`||r.attributeName===`data-desk-max`||r.attributeName===`data-mobile-max`)&&(n=!0);(t||n)&&this.#y(),n&&this.#S()}),this.#c.observe(this,{attributes:!0,attributeFilter:[`native-mode`,`maximized`,`data-desk-max`,`data-mobile-max`]})))}#y(){this.#b(po(this.nativeMode))}#b(e){let t=this.nativeMode||this.hasAttribute(`data-desk-max`)||this.hasAttribute(`maximized`)||this.hasAttribute(`data-mobile-max`);if(this.#f?.surface===e.surface&&this.#m===t&&this.#n){this.#f=e;return}this.#f=e;let n=this;n.toggleAttribute(`data-native-wco`,e.surface===`wco`),n.toggleAttribute(`data-native-standalone`,e.surface===`standalone`),n.toggleAttribute(`data-native-fallback`,e.surface===`fallback`),n.toggleAttribute(`data-native-active`,e.surface!==`off`),this.#x(e.surface),e.titlebarRect?(n.style.setProperty(`--ui-win-titlebar-area-x`,`${e.titlebarRect.x}px`),n.style.setProperty(`--ui-win-titlebar-area-y`,`${e.titlebarRect.y}px`),n.style.setProperty(`--ui-win-titlebar-area-width`,`${e.titlebarRect.width}px`),n.style.setProperty(`--ui-win-titlebar-area-height`,`${e.titlebarRect.height}px`)):(n.style.removeProperty(`--ui-win-titlebar-area-x`),n.style.removeProperty(`--ui-win-titlebar-area-y`),n.style.removeProperty(`--ui-win-titlebar-area-width`),n.style.removeProperty(`--ui-win-titlebar-area-height`)),this.#n?.(),this.#n=null,this.#r?.(),this.#r=null,this.#j(),this.#M(),this.#S(),t!==this.#m&&(this.#m=t,t?zo(this):(Bo(this),Fo())),this.dispatchEvent(new CustomEvent(`window-native-change`,{bubbles:!0,composed:!0,detail:e}))}#x(e=this.nativeSurface){let t=this.shadowRoot?.querySelector(`.title-exit-native`);t&&(t.hidden=e!==`standalone`)}#S(){let e=this.shadowRoot?.querySelector(`.title-maximize`),t=e?.querySelector(`ui-icon`);if(!e||!t)return;let n=!(this.nativeMode&&this.nativeSurface===`fallback`)&&(this.hasAttribute(`maximized`)||this.hasAttribute(`data-desk-max`)||this.hasAttribute(`data-mobile-max`)),r=n?qo:Ko,i=n?`Restore`:`Maximize`;t.getAttribute(`icon`)!==r&&t.setAttribute(`icon`,r),e.setAttribute(`aria-label`,i),e.setAttribute(`title`,i)}applyBounds(e){let t=this;t.style.position=`absolute`,typeof e.x==`number`&&(t.style.left=`${e.x}px`),typeof e.y==`number`&&(t.style.top=`${e.y}px`),typeof e.w==`number`&&(t.style.width=`${e.w}px`,t.style.setProperty(`--ui-win-width`,`${e.w}px`)),typeof e.h==`number`&&(t.style.height=`${e.h}px`,t.style.setProperty(`--ui-win-height`,`${e.h}px`)),typeof e.z==`number`&&(t.style.zIndex=String(e.z)),t.style.right=``,t.style.bottom=``,this.managed&&(this.#e.value=0,this.#t.value=0,t.style.transform=``)}setVisible(e){this.toggleAttribute(`hidden-window`,!e),this.style.visibility=e?``:`hidden`,this.style.pointerEvents=e?``:`none`}get isMaximized(){return this.hasAttribute(`maximized`)||this.hasAttribute(`data-desk-max`)||this.hasAttribute(`data-mobile-max`)}get isMinimized(){return this.hasAttribute(`minimized`)}get usesNativeWindowDrag(){let e=this.nativeSurface;return e===`wco`||e===`standalone`}enterNativeMode(){if(this.managed){this.#C(`window-native`);return}this.nativeMode=!0,this.#C(`window-native`)}exitNativeMode(){if(this.managed){this.#C(`window-exit-native`);return}this.nativeMode=!1,this.#C(`window-exit-native`)}#C(e,t=!1){return this.dispatchEvent(new CustomEvent(e,{bubbles:!0,composed:!0,cancelable:t}))}toggleMaximize(){let e=this.isMaximized;if(this.managed){this.#C(e?`window-restore`:`window-maximize`);return}let t=!e;this.toggleAttribute(`maximized`,t),t&&this.removeAttribute(`minimized`),this.#S(),this.#C(t?`window-maximize`:`window-restore`)}toggleMinimize(){if(this.managed){this.#C(this.isMinimized?`window-restore`:`window-minimize`);return}let e=!this.isMinimized;this.toggleAttribute(`minimized`,e),e&&this.removeAttribute(`maximized`),this.#C(e?`window-minimize`:`window-restore`)}restoreWindow(){if(this.managed){this.#C(`window-restore`);return}let e=this.isMinimized,t=this.isMaximized;this.removeAttribute(`minimized`),this.removeAttribute(`maximized`),(e||t)&&this.#C(`window-restore`)}closeWindow(){this.#C(`window-close`,!0),this.isConnected&&this.remove()}#w(){this.#i||=n(this,`pointerdown`,()=>{this.requestFocus()},{capture:!0,passive:!0})}requestFocus(){this.dispatchEvent(new CustomEvent(`window-focus`,{bubbles:!0,composed:!0}))}bringToFront(e){let t=this;Number.isFinite(e)&&(t.style.zIndex=String(e)),t.toggleAttribute(`data-focused`,!0)}clearFocused(){this.toggleAttribute(`data-focused`,!1)}#T(e){let t=typeof e.composedPath==`function`?e.composedPath():[];for(let e of t){if(!(e instanceof Element))continue;let t=e.getAttribute?.(`data-ui-win-action`);if(t===`close`||t===`exit-native`||t===`maximize`||t===`minimize`)return t;if(e.matches?.(`.title-close`))return`close`;if(e.matches?.(`.title-exit-native`))return`exit-native`;if(e.matches?.(`.title-maximize`))return`maximize`;if(e.matches?.(`.title-minimize`))return`minimize`}let n=e.target;if(n instanceof Element){let e=n.closest?.(`[data-ui-win-action], .title-close, .title-exit-native, .title-maximize, .title-minimize`)??null;if(!e)return null;let t=e.getAttribute(`data-ui-win-action`);if(t===`close`||t===`exit-native`||t===`maximize`||t===`minimize`)return t;if(e.classList.contains(`title-close`))return`close`;if(e.classList.contains(`title-exit-native`))return`exit-native`;if(e.classList.contains(`title-maximize`))return`maximize`;if(e.classList.contains(`title-minimize`))return`minimize`}return null}#E(){let e=typeof performance<`u`?performance.now():Date.now();return e-this.#d<280?!1:(this.#d=e,!0)}#D(e){e===`close`?this.closeWindow():e===`exit-native`?this.exitNativeMode():e===`maximize`?this.nativeMode&&this.nativeSurface===`fallback`?this.exitNativeMode():this.toggleMaximize():this.toggleMinimize()}#O(e){let t=this.#T(e);return t?(e.preventDefault(),e.stopPropagation(),e.stopImmediatePropagation?.(),this.#E()&&this.#D(t),!0):!1}#k(){let e=this.shadowRoot;if(e)for(let[t,n]of[[`minimize`,`.title-minimize`],[`maximize`,`.title-maximize`],[`close`,`.title-close`],[`exit-native`,`.title-exit-native`]]){let r=e.querySelector(n);if(!r)continue;r.setAttribute(`data-ui-win-action`,t);let i=e=>{e.preventDefault(),e.stopPropagation(),e.stopImmediatePropagation?.(),this.#E()&&this.#D(t)};r.onclick=i,r.onpointerup=e=>{e.button===0&&i(e)}}}#A(){let e=this.shadowRoot;if(!e)return;let t=this.titleHandler,r=t instanceof HTMLElement?t:e.querySelector(`.title-handler`),i=e.querySelector(`.title-handler-buttons`);if(!r||!i)return;if(this.#k(),this.#l){this.#x(),this.#S();return}let a=e=>{this.#O(e)},o=e=>{this.#T(e)||(typeof e.composedPath==`function`?e.composedPath():[]).some(e=>e instanceof Element&&e.classList?.contains(`title-handler`))&&(e.target?.closest?.(`button, a, input, textarea, select, [data-no-drag]`)||(e.preventDefault(),this.#E()&&this.toggleMaximize()))},s=n(e,`click`,a,{capture:!0}),c=n(e,`pointerup`,a,{capture:!0}),l=n(this,`click`,a,{capture:!0}),u=n(this,`pointerup`,a,{capture:!0}),d=n(this,`dblclick`,o,{capture:!0});typeof MutationObserver<`u`&&!this.#o&&(this.#o=new MutationObserver(()=>{this.#k(),this.#x(),this.#S()}),this.#o.observe(i,{childList:!0,subtree:!0})),this.#a=()=>{s?.(),c?.(),l?.(),u?.(),d?.(),this.#o?.disconnect(),this.#o=null,this.#a=null,this.#l=!1},this.#l=!0,this.#x(),this.#S()}#j(){let e=this.shadowRoot??this,t=this.titleHandler,r=t instanceof HTMLElement?t:e.querySelector?.(`.title-handler`);if(!r||this.#n)return;if(this.usesNativeWindowDrag){this.#n=()=>{this.#n=null};return}this.managed||D(this,O`transform: translate(${this.#e}px, ${this.#t}px)`);let i=new Map,a=n(r,`pointerdown`,e=>{if(e.button!==0||this.#T(e)||e.target?.closest(`button, a, input, textarea, select, [data-no-drag]`)||this.isMaximized||this.isMinimized||this.nativeMode)return;this.requestFocus();let t=this;i.set(e.pointerId,{sx:e.clientX,sy:e.clientY,ox:this.#e.value,oy:this.#t.value,bx:Number.parseFloat(t.style.left||`0`)||0,by:Number.parseFloat(t.style.top||`0`)||0,dragging:!1});let r=n(document.body,`pointermove`,e=>{let t=i.get(e.pointerId);if(!t)return;let n=e.clientX-t.sx,r=e.clientY-t.sy;if(!t.dragging){if(Math.hypot(n,r)<4)return;t.dragging=!0;try{e.preventDefault()}catch{}this.setPointerCapture?.(e.pointerId)}if(this.managed){this.dispatchEvent(new CustomEvent(`window-move`,{bubbles:!0,composed:!0,detail:{x:t.bx+n,y:t.by+r,dx:n,dy:r}}));return}this.#e.value=t.ox+n,this.#t.value=t.oy+r}),a=e=>{if(!i.has(e.pointerId))return;let t=i.get(e.pointerId);if(i.delete(e.pointerId),t?.dragging)try{this.releasePointerCapture?.(e.pointerId)}catch{}r?.(),o?.(),s?.()},o=n(document.body,`pointerup`,a),s=n(document.body,`pointercancel`,a)});this.#n=()=>{a?.()}}#M(){let e=this.shadowRoot??this,t=this.resizer,r=t instanceof HTMLElement?t:e.querySelector?.(`.window-resizer`);if(!r||this.#r)return;let i=new Map,a=n(r,`pointerdown`,e=>{if(e.button!==0||this.isMaximized||this.isMinimized||this.nativeMode)return;e.preventDefault(),e.stopPropagation(),this.requestFocus(),this.setPointerCapture?.(e.pointerId);let t=this.getBoundingClientRect();i.set(e.pointerId,{sx:e.clientX,sy:e.clientY,w:t.width,h:t.height});let r=n(document.body,`pointermove`,e=>{let t=i.get(e.pointerId);if(!t)return;let n=Math.max(Yo.w,t.w+(e.clientX-t.sx)),r=Math.max(Yo.h,t.h+(e.clientY-t.sy));if(this.managed){this.dispatchEvent(new CustomEvent(`window-resize`,{bubbles:!0,composed:!0,detail:{w:n,h:r}}));return}this.style.width=`${n}px`,this.style.height=`${r}px`,this.style.setProperty(`--ui-win-width`,`${n}px`),this.style.setProperty(`--ui-win-height`,`${r}px`)}),a=e=>{if(i.has(e.pointerId)){i.delete(e.pointerId);try{this.releasePointerCapture?.(e.pointerId)}catch{}r?.(),o?.(),s?.()}},o=n(document.body,`pointerup`,a),s=n(document.body,`pointercancel`,a)});this.#r=()=>{a?.()}}},P([g({source:`query-shadow`,name:`.title-handler`})],Xo.prototype,`titleHandler`,void 0),P([g({source:`query-shadow`,name:`.content-handler`})],Xo.prototype,`contentHandler`,void 0),P([g({source:`query-shadow`,name:`.footer-handler`})],Xo.prototype,`footerHandler`,void 0),P([g({source:`query-shadow`,name:`.window-resizer`})],Xo.prototype,`resizer`,void 0),Xo=P([v(`ui-window`)],Xo)})))()}function Qo(){return(Qo=e((()=>{w()})))()}function $o(){return($o=e((()=>{w(),Qo(),[`button:not([disabled])`,`[href]`,`input:not([disabled])`,`select:not([disabled])`,`textarea:not([disabled])`,`[tabindex]:not([tabindex='-1'])`].join(`,`)})))()}function es(){return(es=e((()=>{w()})))()}function ts(){return(ts=e((()=>{I(),hn(),ja(),no(),ao(),co(),Je(),lt(),Zt(),Bi(),Zo(),Qo(),$o(),es()})))()}function ns(){return{...rs}}var rs;function is(){return(is=e((()=>{o(),Na(),Ya(),ts(),rs={loadStyles:!0,includeGlobalNativeControlStyles:!1,styleVariant:`veela-basic`},(async()=>{let e=ns();e.loadStyles!==!1&&(await Ja({includeGlobalNativeControls:e.includeGlobalNativeControlStyles===!0}),await a(Ma))})()?.catch?.(()=>void 0)})))()}export{I as C,F as S,Fe as T,Zt as _,Hr as a,Je as b,ar as c,hn as d,nn as f,rn as g,fn as h,gr as i,un as l,en as m,ja as n,hr as o,tn as p,Ca as r,fr as s,is as t,sn as u,Ut as v,P as w,He as x,lt as y};