import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{At as t,Ht as n,J as r,S as i,X as a,a as o,b as s,et as c,ft as l,jt as u,kt as d,nt as f,tt as ee,u as te}from"./HistoryManager-D8ebz2Z7.js";import{t as p}from"./src-BQ2lM3dn.js";import{n as ne,t as re}from"./preload-helper-NDuSAHbO.js";import{F as ie,I as m,L as h,M as ae,N as oe,k as se,t as g,z as _}from"./src-DT_77f7t.js";import{t as v}from"./src-DAKabAoG.js";import{n as y}from"./CSSIconRegistry-D88SYH0A.js";import{n as ce,r as b}from"./shell-slots-CDiat5LT.js";function x(e,t,n,r){var i=arguments.length,a=i<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,n):r,o;if(typeof Reflect==`object`&&typeof Reflect.decorate==`function`)a=Reflect.decorate(e,t,n,r);else for(var s=e.length-1;s>=0;s--)(o=e[s])&&(a=(i<3?o(a):i>3?o(t,n,a):o(t,n))||a);return i>3&&a&&Object.defineProperty(t,n,a),a}var S=e((()=>{})),C,w,T=e((()=>{g(),v(),S(),C=class extends m(){theme=`default`;render=function(){return o`<slot></slot>`};constructor(){super()}onRender(){return super.onRender()}connectedCallback(){return super.connectedCallback?.()??this}onInitialize(){let e=super.onInitialize()??this;return e.loadStyleLibrary(y()),e}},x([_({source:`attr`})],C.prototype,`theme`,void 0),C=x([h(`ui-element`)],C),w=C})),E,D,O,le,ue,de,fe,pe,me,he,ge,_e,k,ve,ye,be,xe,Se=e((()=>{E=`2147483600`,D=new Map,O=!1,le=null,ue=()=>{if(typeof document<`u`){if(document.querySelector(`.env-shell-chrome[data-desktop]`))return!0;let e=document.querySelector(`[data-chrome-layout]`);if(e?.dataset.chromeLayout===`desktop`)return!0;if(e?.dataset.chromeLayout===`mobile`)return!1}return typeof matchMedia<`u`&&matchMedia(`(min-width: 641px)`).matches},de=e=>{le=e},fe=e=>{let t=`data-env-shell-overlays`,n=e||le||document.querySelector(`.env-shell-root`)||document.querySelector(`#app`)||document.body,r=n.querySelector(`[${t}]`);if(r)return r.style.zIndex||(r.style.zIndex=E),r;try{let e=globalThis.__ENV_OVERLAY_MOUNT__;if(typeof e==`function`)return e(n)}catch{}let i=document.createElement(`div`);return i.setAttribute(t,``),i.className=`env-shell-overlays`,i.setAttribute(`data-part`,`env-overlays`),i.style.cssText=`position:fixed;inset:0;pointer-events:none;z-index:${E};box-sizing:border-box;`,n.appendChild(i),i},pe=(e,t)=>{let n=ue();if(e.style.position=`fixed`,e.style.zIndex=String(Number(E)+1),e.style.pointerEvents=`auto`,e.style.margin=`0`,n){e.style.top=`auto`,e.style.left=`auto`,e.style.right=`0.75rem`,e.style.bottom=`4.5rem`,e.style.transform=`none`;return}if(t===`calendar`){e.style.top=`50%`,e.style.left=`50%`,e.style.right=`auto`,e.style.bottom=`auto`,e.style.transform=`translate(-50%, -50%)`;return}e.style.top=`calc(env(safe-area-inset-top, 0px) + 0.75rem)`,e.style.left=`50%`,e.style.right=`auto`,e.style.bottom=`auto`,e.style.transform=`translateX(-50%)`},me=e=>{let t=e.target;for(let[e,n]of[...D.entries()])n.contains(t)||t?.closest?.(`[data-chrome-flyout-anchor], .env-shell-taskbar__clock, .env-ui-statusbar__clock, .env-device-tray`)||k(e)},he=e=>{e.key===`Escape`&&ve()},ge=()=>{O||(O=!0,document.addEventListener(`pointerdown`,me,!0),document.addEventListener(`keydown`,he,!0))},_e=()=>{D.size>0||O&&(O=!1,document.removeEventListener(`pointerdown`,me,!0),document.removeEventListener(`keydown`,he,!0))},k=e=>{let t=D.get(e);if(t){D.delete(e);try{let e=t.el;typeof e.close==`function`?e.close():(e.removeAttribute(`open`),e.hidden=!0),e.dispatchEvent(new CustomEvent(`chrome-flyout-close`,{bubbles:!0}))}catch{}_e()}},ve=()=>{for(let e of[...D.keys()])k(e)},ye=e=>{for(let t of[...D.keys()])t!==e.kind&&k(t);D.set(e.kind,{...e,close:()=>k(e.kind)}),e.el.hidden=!1,e.el.removeAttribute(`hidden`),e.el.setAttribute(`open`,``),ge()},be=e=>D.has(e),xe=(e,t)=>{if(be(e)){k(e);return}let n=t();ye(n)}})),Ce,we=e((()=>{Ce=`/*
 * Filename: CalendarFlyout.scss
 * FullPath: modules/projects/fl.ui/src/ui/navigation/calendar/CalendarFlyout.scss
 * Change date and time: 08.30.00_02.08.2026
 * Reason for changes: Win11-like calendar flyout — compact acrylic-ish panel, no backdrop-filter.
 */
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
  --icon-size: 1.05rem;
  inline-size: var(--icon-size);
  block-size: var(--icon-size);
  color: currentColor;
  pointer-events: none;
}
.ui-cal-flyout__nav-btn:hover {
  background: var(--cal-hover);
}
.ui-cal-flyout__nav-btn:active {
  background: color-mix(in oklab, var(--cal-hover) 160%, transparent);
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
}`}));function Te(e){try{let t=new Intl.Locale(e),n=(t.weekInfo??t.getWeekInfo?.())?.firstDay;if(typeof n==`number`&&n>=1&&n<=7)return n%7}catch{}return 0}function Ee(e,t){let n=new Intl.DateTimeFormat(e,{weekday:`short`,timeZone:`UTC`}),r=[];for(let e=0;e<7;e++){let i=(t+e)%7;r.push(n.format(new Date(Ne+i*Pe)))}return r}function De(e,t){return e.getFullYear()===t.getFullYear()&&e.getMonth()===t.getMonth()&&e.getDate()===t.getDate()}function Oe(e,t,n){let r=new Date,i=new Date(e,t,1),a=new Date(e,t+1,0).getDate(),o=(i.getDay()-n+7)%7,s=Math.ceil((o+a)/7)*7,c=[];for(let n=0;n<s;n++){let i=n-o+1,a=new Date(e,t,i);c.push({date:a,day:a.getDate(),otherMonth:a.getMonth()!==t,isToday:De(a,r)})}return c}function ke(){if(Ie?.isConnected)return Ie;let e=fe(),t=e.querySelector(`ui-calendar-flyout`);return t||(t=document.createElement(`ui-calendar-flyout`),t.hidden=!0,e.appendChild(t)),Ie=t,t}function Ae(e){xe(Me,()=>{let e=ke(),t=document.documentElement.getAttribute(`data-theme`);return(t===`light`||t===`dark`)&&(e.dataset.theme=t,e.style.colorScheme=t),pe(e,Me),e.open(),{kind:Me,el:e,close:()=>{e.close(),k(Me)},contains:t=>t instanceof Node&&e.contains(t)}})}var je,Me,Ne,Pe,Fe,Ie,Le=e((()=>{g(),l(),T(),v(),Se(),we(),S(),je=u(Ce),Me=`calendar`,Ne=Date.UTC(2023,0,1),Pe=864e5,Fe=class extends C{#e;#t;#n=null;#r=null;styles=function(){return je};render=function(){return o`<div class="ui-cal-flyout__panel" part="panel">
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
        </div>`};constructor(){super();let e=new Date;this.#e=e.getFullYear(),this.#t=e.getMonth()}onRender(){super.onRender(),this.#i(),this.#c()}disconnectedCallback(){this.#r?.(),this.#r=null,super.disconnectedCallback?.()}#i(){let e=this.shadowRoot;if(!e||this.#r)return;let t=n(e,`click`,e=>{let t=e.target,n=t?.closest?.(`[data-nav]`);if(n){n.dataset.nav===`prev`?this.#a(-1):n.dataset.nav===`next`&&this.#a(1);return}let r=t?.closest?.(`.ui-cal-flyout__day`);r&&this.#s(r)});this.#r=()=>t?.()}#a(e){this.#t+=e,this.#t<0?(this.#t=11,--this.#e):this.#t>11&&(this.#t=0,this.#e+=1),this.#c()}#o(){let e=new Date;this.#e=e.getFullYear(),this.#t=e.getMonth(),this.#c()}#s(e){let t=e.dataset.date;t&&(this.#n=new Date(t),this.shadowRoot?.querySelectorAll(`.ui-cal-flyout__day[data-selected]`)?.forEach(e=>e.removeAttribute(`data-selected`)),e.setAttribute(`data-selected`,``),this.dispatchEvent(new CustomEvent(`calendar-select`,{bubbles:!0,composed:!0,detail:{date:this.#n}})))}#c(){let e=this.shadowRoot;if(!e)return;let t=typeof navigator<`u`?navigator.language:void 0,n=Te(t??`en-US`),r=new Date,i=e.querySelector(`.ui-cal-flyout__today`);i&&(i.textContent=r.toLocaleDateString(t,{weekday:`long`,month:`long`,day:`numeric`,year:`numeric`}));let a=e.querySelector(`.ui-cal-flyout__month-label`);a&&(a.textContent=new Date(this.#e,this.#t,1).toLocaleDateString(t,{month:`long`,year:`numeric`}));let o=e.querySelector(`.ui-cal-flyout__weekdays`);o&&o.replaceChildren(...Ee(t??`en-US`,n).map(e=>{let t=document.createElement(`span`);return t.className=`ui-cal-flyout__weekday`,t.setAttribute(`role`,`columnheader`),t.textContent=e,t}));let s=e.querySelector(`.ui-cal-flyout__grid`);if(s){let e=Oe(this.#e,this.#t,n);s.replaceChildren(...e.map(e=>{let n=document.createElement(`button`);return n.type=`button`,n.className=`ui-cal-flyout__day`,n.textContent=String(e.day),n.dataset.date=e.date.toISOString(),n.setAttribute(`role`,`gridcell`),e.otherMonth&&n.setAttribute(`data-other-month`,``),e.isToday&&n.setAttribute(`data-today`,``),this.#n&&De(e.date,this.#n)&&n.setAttribute(`data-selected`,``),n.setAttribute(`aria-label`,e.date.toLocaleDateString(t,{weekday:`long`,month:`long`,day:`numeric`,year:`numeric`})),n}))}}open(){this.#o(),this.removeAttribute(`hidden`),this.hidden=!1,this.setAttribute(`open`,``)}close(){this.hidden=!0,this.setAttribute(`hidden`,``),this.removeAttribute(`open`)}toggle(e){this.hasAttribute(`open`)?this.close():this.open()}},Fe=x([h(`ui-calendar-flyout`)],Fe),Ie=null})),Re,ze=e((()=>{Re=`/*
 * Filename: QuickSettings.scss
 * FullPath: modules/projects/fl.ui/src/ui/navigation/settings/QuickSettings.scss
 * Change date and time: 08.30.00_02.08.2026
 * Reason for changes: Win11-like Quick Settings panel — tiles grid + sliders, no backdrop-filter.
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
  .qs-tile {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    min-inline-size: 0;
    padding: 0.55rem 0.65rem;
    border: none;
    border-radius: 10px;
    background: color-mix(in oklab, var(--qs-on-surface) 8%, transparent);
    color: inherit;
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
    --icon-color: var(--color-primary, var(--qs-primary));
  }
  .qs-tile-icon {
    --icon-size: 1.35rem;
    --icon-color: currentColor;
    flex: 0 0 auto;
    inline-size: var(--icon-size);
    block-size: var(--icon-size);
    line-height: 0;
  }
  .qs-tile-text {
    display: flex;
    flex-direction: column;
    gap: 0.05rem;
    min-inline-size: 0;
    overflow: hidden;
  }
  .qs-tile-label {
    font-size: 0.78rem;
    font-weight: 600;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .qs-tile-sub {
    font-size: 0.68rem;
    font-weight: 500;
    opacity: 0.7;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .qs-sliders {
    display: grid;
    gap: 0.6rem;
    padding-block-start: 0.7rem;
    border-block-start: 1px solid var(--qs-outline);
  }
  .qs-slider-row {
    display: flex;
    align-items: center;
    gap: 0.65rem;
    cursor: default;
  }
  .qs-slider-icon {
    --icon-size: 1.15rem;
    --icon-color: color-mix(in oklab, var(--qs-on-surface) 78%, transparent);
    flex: 0 0 auto;
    inline-size: var(--icon-size);
    block-size: var(--icon-size);
    line-height: 0;
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
}`}));function Be(){if(pt?.isConnected)return pt;let e=fe(),t=e.querySelector(`ui-quick-settings`);return t||(t=document.createElement(`ui-quick-settings`),t.hidden=!0,e.appendChild(t)),pt=t,t}function Ve(e){xe(A,()=>{let e=Be(),t=document.documentElement.getAttribute(`data-theme`);return(t===`light`||t===`dark`)&&(e.dataset.theme=t,e.style.colorScheme=t),pe(e,A),e.open(),{kind:A,el:e,close:()=>{e.close(),k(A)},contains:t=>t instanceof Node&&e.contains(t)}})}var He,A,Ue,We,Ge,Ke,qe,Je,Ye,Xe,Ze,Qe,$e,et,tt,nt,rt,it,at,ot,st,ct,lt,ut,dt,ft,pt,mt=e((()=>{g(),l(),T(),v(),Se(),ze(),S(),He=u(Re),A=`quick-settings`,Ue=`data-theme`,We=`rs-appearance-theme`,Ge=`appearance.theme`,Ke=[`rs-settings`,`cwsp-settings`,`u2-settings`],qe=()=>{try{return matchMedia?.(`(prefers-color-scheme: dark)`)?.matches??!0}catch{return!0}},Je=e=>{for(let t of Ke)try{let n=localStorage.getItem(t);if(!n)continue;let r=JSON.parse(n);if(!r||typeof r!=`object`)continue;r.appearance={...r.appearance??{},theme:e},localStorage.setItem(t,JSON.stringify(r))}catch{}},Ye=()=>{try{let e=document.documentElement.getAttribute(Ue);if(e===`light`||e===`dark`)return e;let t=localStorage.getItem(We);if(t===`light`||t===`dark`)return t}catch{}return qe()?`dark`:`light`},Xe=e=>{let t=document.documentElement;t.setAttribute(`data-scheme`,e),t.setAttribute(Ue,e),t.style.colorScheme=e;try{document.body&&(document.body.style.colorScheme=e)}catch{}try{document.querySelectorAll(`.env-shell-root, [data-shell], ui-window`).forEach(t=>{let n=t;n.dataset.theme=e,n.style.colorScheme=e;let r=n.shadowRoot?.querySelector?.(`.app-shell`);r&&(r.dataset.theme=e,r.style.colorScheme=e)})}catch{}try{localStorage.setItem(We,e),localStorage.setItem(Ge,e)}catch{}Je(e),t.dispatchEvent(new CustomEvent(`u2-theme-change`,{bubbles:!0,detail:{source:`quick-settings`,theme:e}}))},Ze=`env-night-filter`,Qe=`2147483001`,$e=`rs-night-filter`,et=`rs-brightness-filter`,tt=e=>Math.max(0,Math.min(100,Number.isFinite(e)?e:0)),nt=()=>{let e=document.getElementById(Ze);if(e instanceof HTMLElement)return e;let t=document.createElement(`div`);return t.id=Ze,t.setAttribute(`aria-hidden`,`true`),t.style.cssText=[`position:fixed`,`inset:0`,`pointer-events:none`,`z-index:${Qe}`,`background-color:rgb(255 140 60)`,`mix-blend-mode:multiply`,`opacity:0`,`visibility:hidden`,`transition:opacity 160ms ease`].join(`;`),(document.body??document.documentElement).appendChild(t),t},rt=e=>{let t=tt(e),n=nt(),r=t/100;n.style.opacity=String(r),n.style.visibility=r>0?`visible`:`hidden`;try{localStorage.setItem($e,String(t))}catch{}},it=e=>{let t=tt(e),n=nt(),r=t<=50?.4+t/50*.6:1+(t-50)/50*.2;n.style.filter=`brightness(${r.toFixed(3)})`;try{localStorage.setItem(et,String(t))}catch{}},at=(e,t)=>{try{let n=localStorage.getItem(e);if(n==null)return t;let r=Number(n);return Number.isFinite(r)?tt(r):t}catch{return t}},ot=()=>{let e=at($e,0),t=at(et,50);return rt(e),it(t),{night:e,brightness:t}},typeof document<`u`&&(document.readyState===`loading`?document.addEventListener(`DOMContentLoaded`,()=>ot(),{once:!0}):ot()),st=[`wifi`,`bluetooth`,`focus`,`airplane`],ct={light:`sun`,dark:`moon`},lt={light:`Light`,dark:`Dark`},ut=e=>{let t=e.querySelector(`[data-qs-tile="theme"]`);if(!t)return;let n=Ye();t.querySelector(`ui-icon`)?.setAttribute(`icon`,ct[n]);let r=t.querySelector(`[data-qs-tile-sub]`);r&&(r.textContent=lt[n]),t.setAttribute(`aria-pressed`,n===`dark`?`true`:`false`)},dt=e=>{let t=e.shadowRoot,n=t?.querySelector(`.qs-panel`);if(!t||!n||n.hasAttribute(`data-qs-wired`))return;n.setAttribute(`data-qs-wired`,``),ut(t),t.querySelector(`[data-qs-tile="theme"]`)?.addEventListener(`click`,()=>{let e=Ye()===`dark`?`light`:`dark`;Xe(e),ut(t)});for(let e of st){let n=t.querySelector(`[data-qs-tile="${e}"]`);n&&n.addEventListener(`click`,()=>{let e=n.getAttribute(`aria-pressed`)!==`true`;n.setAttribute(`aria-pressed`,String(e));let t=n.querySelector(`[data-qs-tile-sub]`);t&&(t.textContent=e?`On`:`Off`)})}let{night:r,brightness:i}=ot(),a=t.querySelector(`[data-qs-slider="night"]`),o=t.querySelector(`[data-qs-slider="brightness"]`);a&&(a.value=String(r),a.addEventListener(`input`,()=>rt(a.valueAsNumber))),o&&(o.value=String(i),o.addEventListener(`input`,()=>it(o.valueAsNumber)))},ft=class extends C{constructor(){super()}styles=()=>He;render=()=>o`
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
</div>`;onRender(){return super.onRender(),dt(this),this}open(){ut(this.shadowRoot),this.removeAttribute(`hidden`),this.hidden=!1,this.setAttribute(`open`,``)}close(){this.hidden=!0,this.setAttribute(`hidden`,``),this.removeAttribute(`open`)}toggle(e){this.hasAttribute(`open`)?this.close():this.open()}},ft=x([h(`ui-quick-settings`)],ft),pt=null})),ht,gt=e((()=>{ht=`/*
 * Filename: statusbar.scss
 * FullPath: modules/projects/fl.ui/src/ui/navigation/statusbar/statusbar.scss
 * Change date and time: 14.00.00_31.07.2026
 * Reason for changes: Mobile/fullscreen transparent overlay statusbar + desktop footer.
 */
@function --hsv(--src-color <color>) returns <color> {
  result: hsl(from var(--src-color, black) h calc(calc((calc(l / 100) - calc(calc(l / 100) * (1 - calc(s / 100) / 2))) / clamp(0.0001, min(calc(calc(l / 100) * (1 - calc(s / 100) / 2)), calc(1 - calc(calc(l / 100) * (1 - calc(s / 100) / 2)))), 1)) * 100) calc(calc(calc(l / 100) * (1 - calc(s / 100) / 2)) * 100) / alpha);
}
/*
 * Filename: _tokens.scss
 * FullPath: modules/projects/veela.css/src/scss/core/misc/_tokens.scss
 * Change date and time: 09.10.00_02.08.2026
 * Reason for changes: Concrete light/dark surface mixins under data-theme (fix intermittent Light).
 */
/*
 * Filename: _color-properties.scss
 * FullPath: modules/projects/veela.css/src/scss/core/misc/_color-properties.scss
 * Change date and time: 09.05.00_02.08.2026
 * Reason for changes: Only seed hues as @property — semantic light-dark() must stay unregistered.
 */
/*
 * INVARIANT: Do NOT register \`--color-surface\` / \`--color-on-surface\` / etc. as \`@property <color>\`.
 * WHY: Typed colors compute \`light-dark()\` on the defining element (:root) and inherit a *concrete*
 * color. Children that lock \`color-scheme: light\` then get cream surfaces (local light-dark) but
 * keep light-on-dark text from the inherited computed token — Settings Appearance labels vanish.
 *
 * Seeds only: WallpaperTheme / Quick Settings write these; surfaces derive via unregistered
 * \`light-dark(--u2-color-mod(...))\` in \`_tokens.scss\` and re-evaluate per used color-scheme.
 */
@property --color-primary {
  syntax: "<color>";
  inherits: true;
  initial-value: #5a7fff;
}
@property --base-color {
  syntax: "<color>";
  inherits: true;
  initial-value: #5a7fff;
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
@layer tokens, base, layout, utilities, shells, shell, views, view, viewer, components, ux-layer, markdown, essentials, print, print-breaks, overrides;
@layer tokens {
  :root,
  :host,
  :scope {
    /* Box seed; WallpaperTheme may override --color-primary on :root. */
    --color-primary: #5a7fff;
    color-scheme: light dark;
    /* Default = light concrete; OS-dark media + data-theme pins override below. */
    --base-color: var(--color-primary);
    --base-color-neutralized: color-mix(in oklab, var(--base-color) 60%, gray);
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
    --color-surface-container-lowest: --u2-color-mod(var(--base-color), 50);
    --color-surface-container-low: --u2-color-mod(var(--base-color), 100);
    --color-surface-container: --u2-color-mod(var(--base-color), 160);
    --color-surface-container-high: --u2-color-mod(var(--base-color), 220);
    --color-surface-container-highest: --u2-color-mod(var(--base-color), 300);
    --color-border: color-mix(in oklab, var(--color-outline-variant) 75%, transparent);
    --color-bg: var(--color-background);
    --color-text: var(--color-on-background);
    --color-fg: var(--color-on-surface);
    --on-surface-color: var(--color-on-surface);
    --on-surface-variant: var(--color-on-surface-variant);
    --wf-md-surface: var(--color-surface);
    --wf-md-on-surface: var(--color-on-surface);
    --wf-md-on-surface-variant: var(--color-on-surface-variant);
    --wf-md-surf-container: var(--color-surface-container);
    --wf-md-surf-container-low: var(--color-surface-container-low);
    --wf-md-surf-container-high: var(--color-surface-container-high);
    --wf-md-outline-variant: var(--color-outline-variant);
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
    --radius-none: 0;
    --radius-sm: 0.25rem;
    --radius-default: 0.25rem;
    --radius-md: 0.375rem;
    --radius-lg: 0.5rem;
    --radius-xl: 0.75rem;
    --radius-2xl: 1rem;
    --radius-3xl: 1.5rem;
    --radius-full: 9999px;
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
    --font-family-mono: "Roboto Mono", "SF Mono", Monaco, Inconsolata, "Fira Code", monospace;
    --font-sans: var(--font-family);
    --font-mono: var(--font-family-mono);
    --leading-tight: 1.2;
    --leading-normal: 1.5;
    --leading-relaxed: 1.8;
    --transition-fast: 120ms cubic-bezier(0.2, 0, 0, 1);
    --transition-normal: 160ms cubic-bezier(0.2, 0, 0, 1);
    --transition-slow: 200ms cubic-bezier(0.2, 0, 0, 1);
    --motion-fast: var(--transition-fast);
    --motion-normal: var(--transition-normal);
    --motion-slow: var(--transition-slow);
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
    --view-bg: var(--color-surface);
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
    --btn-height-sm: 2rem;
    --btn-height-md: 2.5rem;
    --btn-height-lg: 3rem;
    --btn-padding-x-sm: var(--space-md);
    --btn-padding-x-md: var(--space-lg);
    --btn-padding-x-lg: 1.5rem;
    --btn-radius: var(--radius-md);
    --btn-font-weight: var(--font-weight-medium);
    --input-height-sm: 2rem;
    --input-height-md: 2.5rem;
    --input-height-lg: 3rem;
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
  }
  /* Auto (no pin): follow OS preference with concrete tokens — not light-dark(). */
  @media (prefers-color-scheme: dark) {
    :root:not([data-theme=light]):not([data-theme=dark]),
    :host:not([data-theme=light]):not([data-theme=dark]) {
      color-scheme: dark;
      --base-color: var(--color-primary);
      --base-color-neutralized: color-mix(in oklab, var(--base-color) 60%, gray);
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
      --color-surface-container-lowest: --u2-color-mod(var(--base-color), 960);
      --color-surface-container-low: --u2-color-mod(var(--base-color), 880);
      --color-surface-container: --u2-color-mod(var(--base-color), 840);
      --color-surface-container-high: --u2-color-mod(var(--base-color), 780);
      --color-surface-container-highest: --u2-color-mod(var(--base-color), 720);
      --color-border: color-mix(in oklab, var(--color-outline-variant) 70%, transparent);
      --color-bg: var(--color-background);
      --color-text: var(--color-on-background);
      --color-fg: var(--color-on-surface);
      --on-surface-color: var(--color-on-surface);
      --on-surface-variant: var(--color-on-surface-variant);
      --wf-md-surface: var(--color-surface);
      --wf-md-on-surface: var(--color-on-surface);
      --wf-md-on-surface-variant: var(--color-on-surface-variant);
      --wf-md-surf-container: var(--color-surface-container);
      --wf-md-surf-container-low: var(--color-surface-container-low);
      --wf-md-surf-container-high: var(--color-surface-container-high);
      --wf-md-outline-variant: var(--color-outline-variant);
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
    --color-surface-container-lowest: --u2-color-mod(var(--base-color), 50);
    --color-surface-container-low: --u2-color-mod(var(--base-color), 100);
    --color-surface-container: --u2-color-mod(var(--base-color), 160);
    --color-surface-container-high: --u2-color-mod(var(--base-color), 220);
    --color-surface-container-highest: --u2-color-mod(var(--base-color), 300);
    --color-border: color-mix(in oklab, var(--color-outline-variant) 75%, transparent);
    --color-bg: var(--color-background);
    --color-text: var(--color-on-background);
    --color-fg: var(--color-on-surface);
    --on-surface-color: var(--color-on-surface);
    --on-surface-variant: var(--color-on-surface-variant);
    --wf-md-surface: var(--color-surface);
    --wf-md-on-surface: var(--color-on-surface);
    --wf-md-on-surface-variant: var(--color-on-surface-variant);
    --wf-md-surf-container: var(--color-surface-container);
    --wf-md-surf-container-low: var(--color-surface-container-low);
    --wf-md-surf-container-high: var(--color-surface-container-high);
    --wf-md-outline-variant: var(--color-outline-variant);
  }
  :root[data-theme=dark],
  :host[data-theme=dark],
  [data-theme=dark] {
    color-scheme: dark only;
    --base-color: var(--color-primary);
    --base-color-neutralized: color-mix(in oklab, var(--base-color) 60%, gray);
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
    --color-surface-container-lowest: --u2-color-mod(var(--base-color), 960);
    --color-surface-container-low: --u2-color-mod(var(--base-color), 880);
    --color-surface-container: --u2-color-mod(var(--base-color), 840);
    --color-surface-container-high: --u2-color-mod(var(--base-color), 780);
    --color-surface-container-highest: --u2-color-mod(var(--base-color), 720);
    --color-border: color-mix(in oklab, var(--color-outline-variant) 70%, transparent);
    --color-bg: var(--color-background);
    --color-text: var(--color-on-background);
    --color-fg: var(--color-on-surface);
    --on-surface-color: var(--color-on-surface);
    --on-surface-variant: var(--color-on-surface-variant);
    --wf-md-surface: var(--color-surface);
    --wf-md-on-surface: var(--color-on-surface);
    --wf-md-on-surface-variant: var(--color-on-surface-variant);
    --wf-md-surf-container: var(--color-surface-container);
    --wf-md-surf-container-low: var(--color-surface-container-low);
    --wf-md-surf-container-high: var(--color-surface-container-high);
    --wf-md-outline-variant: var(--color-outline-variant);
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
    background-color: #5a7fff, #7ca7ff;
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
    border: 1px solid #5a7fff, #7ca7ff;
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
/* Shadow layout for <ui-statusbar> slots. */
:host(ui-statusbar) {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 0.35rem;
  box-sizing: border-box;
  inline-size: 100%;
  color: var(--env-status-fg, CanvasText);
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
    background: color-mix(in oklch, oklch(14% 0.02 280deg) 82%, transparent);
    border-block-start: 1px solid var(--wf-md-outline-variant, color-mix(in oklch, white 12%, transparent));
    backdrop-filter: blur(10px);
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
  }
  .env-status-bar__chip ui-icon {
    font-size: 1.15rem;
    display: block;
    color: var(--env-status-fg, inherit);
    /* WHY: concrete ink — \`currentColor\` raced white before status contrast settled. */
    --icon-color: var(--env-status-fg, #f5f5f7);
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
    color: var(--env-status-fg, #f5f5f7);
    pointer-events: none;
  }
  .env-shell-chrome[data-status-overlay] .env-ui-statusbar__intro,
  .env-shell-chrome[data-status-overlay] .env-status-bar__meta {
    display: none !important;
  }
  .env-shell-chrome[data-status-overlay] .env-ui-statusbar__clock {
    display: block;
    color: var(--env-status-fg, #f5f5f7);
  }
  .env-shell-chrome[data-status-overlay] .env-device-tray--footer,
  .env-shell-chrome[data-status-overlay] .env-status-bar__chip {
    color: var(--env-status-fg, #f5f5f7);
  }
  .env-shell-chrome[data-status-overlay] .env-status-bar__chip ui-icon {
    --icon-color: var(--env-status-fg, #f5f5f7);
    color: var(--env-status-fg, #f5f5f7);
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
}`}));function _t(){if(typeof matchMedia!=`function`)return`unknown`;try{if(matchMedia(`(display-mode: window-controls-overlay)`).matches)return`window-controls-overlay`;if(matchMedia(`(display-mode: fullscreen)`).matches)return`fullscreen`;if(matchMedia(`(display-mode: standalone)`).matches)return`standalone`;if(matchMedia(`(display-mode: minimal-ui)`).matches)return`minimal-ui`;if(matchMedia(`(display-mode: browser)`).matches)return`browser`}catch{}return`unknown`}function vt(){let e=_t();if(e===`standalone`||e===`minimal-ui`)return!0;try{if(navigator.standalone===!0)return!0}catch{}return!1}function yt(e){if(e.standalone??vt())return!1;let t=e.displayMode??_t(),n=typeof document<`u`&&!!(document.fullscreenElement||document.webkitFullscreenElement);return t===`fullscreen`||n?!0:!e.desktop}function bt(e=new Date){try{return new Intl.DateTimeFormat(void 0,{hour:`numeric`,minute:`2-digit`}).format(e)}catch{return`${e.getHours()}:${String(e.getMinutes()).padStart(2,`0`)}`}}function xt(e){let t=!1,n=null,r=(e,t=48)=>{let n=0,r=0;for(let i=0;i<e.length;i+=4*t){let t=e[i]/255,a=e[i+1]/255,o=e[i+2]/255;n+=.2126*t+.7152*a+.0722*o,r++}return r>0?n/r:null},i=t=>{let n=t>.55;e.style.setProperty(`--env-status-fg`,n?`#1c1c1e`:`#f5f5f7`),e.style.setProperty(`--env-status-fg-muted`,n?`rgba(28,28,30,0.72)`:`rgba(245,245,247,0.78)`),e.dataset.statusContrast=n?`dark`:`light`},a=t=>{let n=t>.52;e.style.setProperty(`--env-launcher-fg`,n?`#141416`:`#f7f7f8`),e.style.setProperty(`--env-launcher-fg-shadow`,n?`rgb(255 255 255 / 0.72)`:`rgb(0 0 0 / 0.88)`),e.style.setProperty(`--env-launcher-fg-glow`,n?`rgb(255 255 255 / 0.35)`:`rgb(0 0 0 / 0.45)`),e.dataset.launcherContrast=n?`dark`:`light`},o=()=>{try{for(let t of document.querySelectorAll(`ui-window[managed]`)){if(t.hidden||t.hasAttribute(`hidden`)||t.getAttribute(`aria-hidden`)===`true`)continue;let n=getComputedStyle(t);if(!(n.display===`none`||n.visibility===`hidden`||Number(n.opacity)===0)&&(t.hasAttribute(`data-status-gap`)||t.hasAttribute(`data-status-overlay-gap`)||t.getBoundingClientRect().top<Math.max(8,parseFloat(getComputedStyle(e).getPropertyValue(`--env-status-inset-top`))||32)+8))return!0}}catch{}return!1},s=()=>{if(t)return;let n=(document.documentElement.getAttribute(`data-theme`)||``).toLowerCase(),s=o();if(s&&n===`light`)i(.9);else if(s&&n===`dark`)i(.15);else try{let t=Math.max(8,Math.round(parseFloat(getComputedStyle(e).getPropertyValue(`--env-status-inset-top`))||32)),n=e.querySelector(`.env-shell-wallpaper canvas`)||document.querySelector(`.env-shell-wallpaper canvas`);if(n instanceof HTMLCanvasElement&&n.width>0&&n.height>0){let e=n.getContext(`2d`,{willReadFrequently:!0});if(e){let a=n.width,o=Math.max(1,Math.round(t/Math.max(1,n.clientHeight||t)*n.height)),s=r(e.getImageData(0,0,a,Math.min(o,n.height)).data);if(s!=null)i(s);else{let e=matchMedia?.(`(prefers-color-scheme: dark)`)?.matches??!0;i(e?.2:.85)}}}else{let e=matchMedia?.(`(prefers-color-scheme: dark)`)?.matches??!0;i(e?.2:.85)}}catch{let e=matchMedia?.(`(prefers-color-scheme: dark)`)?.matches??!0;i(e?.2:.85)}try{let t=e.querySelector(`.env-shell-wallpaper canvas`)||document.querySelector(`.env-shell-wallpaper canvas`);if(t instanceof HTMLCanvasElement&&t.width>0&&t.height>0){let e=t.getContext(`2d`,{willReadFrequently:!0});if(e){let n=t.width,i=Math.max(0,Math.round(t.height*.28)),o=Math.max(1,Math.round(t.height*.36)),s=r(e.getImageData(0,i,n,Math.min(o,t.height-i)).data);if(s!=null){a(s);return}}}}catch{}let c=matchMedia?.(`(prefers-color-scheme: dark)`)?.matches??!0;a(c?.2:.85)},c=()=>{n!=null&&clearTimeout(n),n=setTimeout(s,120)};s();let l=typeof MutationObserver==`function`?new MutationObserver(c):null,u=e.querySelector(`.env-shell-wallpaper`)||document.querySelector(`.env-shell-wallpaper`);u&&l&&l.observe(u,{childList:!0,subtree:!0,attributes:!0});let d=typeof MutationObserver==`function`?new MutationObserver(c):null;d?.observe(document.documentElement,{childList:!0,subtree:!0,attributes:!0,attributeFilter:[`hidden`,`data-status-gap`,`data-theme`,`aria-hidden`,`style`,`class`]}),window.addEventListener(`resize`,c),document.addEventListener(`visibilitychange`,c),document.addEventListener(`env-chrome-surface`,c);let f=typeof matchMedia==`function`?matchMedia(`(prefers-color-scheme: dark)`):null;f?.addEventListener?.(`change`,c);let ee=setInterval(s,8e3);return()=>{t=!0,n!=null&&clearTimeout(n),clearInterval(ee),l?.disconnect(),d?.disconnect(),window.removeEventListener(`resize`,c),document.removeEventListener(`visibilitychange`,c),document.removeEventListener(`env-chrome-surface`,c),f?.removeEventListener?.(`change`,c)}}function St(e){return e.connection}function Ct(e){let t=e.toLowerCase();return t===`slow-2g`?`wifi-low`:t===`2g`?`wifi-medium`:`wifi-high`}function wt(){let e=f(`wifi-high`),t=f(``),n=f(`battery-full`),r=f(``),i=f(``),a=()=>{if(!navigator.onLine){e.value=`wifi-slash`,t.value=`Offline`;return}let n=St(navigator);if(!n||typeof n.effectiveType!=`string`){e.value=`globe`,t.value=`Online (connection details unavailable)`;return}let r=String(n.effectiveType||``).toLowerCase(),i=typeof n.downlink==`number`?`${n.downlink} Mb/s`:``,a=n.saveData?` · Data saver`:``;t.value=[r.toUpperCase(),i].filter(Boolean).join(` · `)+a,e.value=Ct(r)},o=null,s=null,c=null,l=(e,t)=>{let a=Math.max(0,Math.min(100,Math.round(e*100)));if(i.value=`${a}%`,t){n.value=`battery-charging-vertical`,r.value=`Charging · ${i.value}`;return}r.value=`Battery · ${i.value}`,e<=.08?n.value=`battery-warning`:e<=.22?n.value=`battery-low`:e<=.5?n.value=`battery-medium`:e<=.8?n.value=`battery-high`:n.value=`battery-full`};a(),window.addEventListener(`online`,a),window.addEventListener(`offline`,a);let u=St(navigator);return u?.addEventListener?.(`change`,a),typeof navigator.getBattery==`function`?navigator.getBattery().then(e=>{c=e,o=()=>l(e.level,e.charging),s=o,e.addEventListener(`levelchange`,o),e.addEventListener(`chargingchange`,s),l(e.level,e.charging)}):(n.value=`question`,r.value=`Battery status not supported in this browser`,i.value=`—`),{networkIcon:e,networkTitle:t,batteryIcon:n,batteryTitle:r,batteryPct:i,dispose:()=>{window.removeEventListener(`online`,a),window.removeEventListener(`offline`,a),u?.removeEventListener?.(`change`,a),c&&o&&s&&(c.removeEventListener(`levelchange`,o),c.removeEventListener(`chargingchange`,s))}}}function Tt(e,t){let n=o`<div class="env-status-bar__tray ${t}">
        <span class="env-status-bar__chip" title=${e.networkTitle} aria-label=${e.networkTitle}>
            <ui-icon icon=${e.networkIcon} aria-hidden="true"></ui-icon>
        </span>
        <span class="env-status-bar__chip" title=${e.batteryTitle} aria-label=${e.batteryTitle}>
            <ui-icon icon=${e.batteryIcon} aria-hidden="true"></ui-icon>
            <span class="env-status-bar__pct"></span>
        </span>
    </div>`,r=n.querySelector(`.env-status-bar__pct`);return r instanceof HTMLElement&&te(r,{properties:{textContent:e.batteryPct}}),n}function Et(e,t,n){let r=document.createElement(`ui-statusbar`);r.className=`env-ui-statusbar wf-chrome-no-select`,r.setAttribute(`part`,`status-bar`);let i=document.createElement(`div`);i.slot=`left`,i.className=`env-ui-statusbar__left`;let o=document.createElement(`time`);o.className=`env-ui-statusbar__clock`,o.dateTime=``,o.textContent=bt(),o.setAttribute(`role`,`button`),o.setAttribute(`tabindex`,`0`),o.setAttribute(`aria-label`,`Calendar`),o.setAttribute(`aria-haspopup`,`dialog`),o.setAttribute(`data-chrome-flyout-anchor`,`calendar`);let s=document.createElement(`div`);s.className=`env-ui-statusbar__intro`,t&&(s.innerHTML=t),i.append(o,s);let c=document.createElement(`div`);c.slot=`center`;let l=document.createElement(`p`);l.className=`env-status-bar__meta`,c.appendChild(l);let u=document.createElement(`div`);u.slot=`right`,u.className=`env-ui-statusbar__right`;let d=Tt(n,`env-device-tray env-device-tray--footer`);d.setAttribute(`role`,`button`),d.setAttribute(`tabindex`,`0`),d.setAttribute(`aria-label`,`Quick settings`),d.setAttribute(`aria-haspopup`,`dialog`),d.setAttribute(`data-chrome-flyout-anchor`,`quick-settings`),u.appendChild(d);let f=e=>{e.preventDefault(),e.stopPropagation(),Ae(o)},ee=e=>{e.preventDefault(),e.stopPropagation(),Ve(d)};o.addEventListener(`click`,f),o.addEventListener(`keydown`,e=>{(e.key===`Enter`||e.key===` `)&&f(e)}),d.addEventListener(`click`,ee),d.addEventListener(`keydown`,e=>{(e.key===`Enter`||e.key===` `)&&ee(e)}),r.append(i,c,u),a(()=>{let t=e.navEcho.value?` │ ${e.navEcho.value}`:``;l.textContent=`doc=${e.selectedPath.value} │ viewer=${e.viewerStatus.value} │ layout=${e.mqLabel.value}${t}`},[e.selectedPath,e.viewerStatus,e.mqLabel,e.navEcho],{triggerImmediately:!0});let te=()=>{let e=new Date;o.textContent=bt(e),o.dateTime=e.toISOString()};te();let p=setInterval(te,15e3);return{element:r,dispose:()=>{clearInterval(p)}}}var Dt,Ot,kt=e((()=>{g(),r(),Le(),mt(),T(),gt(),l(),S(),Dt=u(ht),Ot=class extends w{constructor(){super()}styles=()=>Dt;render=()=>o`
<div style="background-color: transparent;" part="left"   class="left"  ><slot name="left"  ></slot></div>
        <div style="background-color: transparent;" part="center" class="center"><slot name="center"></slot></div>
        <div style="background-color: transparent;" part="right"  class="right" ><slot name="right" ></slot></div>`},Ot=x([h(`ui-statusbar`)],Ot)})),At=e((()=>{r(),p(),g()}));function jt(){let e=document.documentElement,t=String(e.getAttribute(`data-theme`)||``).trim().toLowerCase();if(t===`light`||t===`dark`)return t;let n=String(e.getAttribute(`data-scheme`)||``).trim().toLowerCase();if(n===`light`||n===`dark`)return n;try{let e=String(localStorage.getItem(`rs-appearance-theme`)||``).trim().toLowerCase();if(e===`light`||e===`dark`)return e}catch{}return typeof matchMedia==`function`&&matchMedia(`(prefers-color-scheme: light)`).matches?`light`:`dark`}function Mt(e,t){e.style.setProperty(`position`,`fixed`,z),e.style.setProperty(`box-sizing`,`border-box`,z),e.style.setProperty(`min-width`,t?`188px`:`220px`,z),e.style.setProperty(`max-width`,`min(320px, calc(100vw - 24px))`,z),e.style.setProperty(`padding`,t?`0.3rem`:`0.4rem`,z),e.style.setProperty(`border-radius`,`14px`,z),e.style.setProperty(`pointer-events`,`auto`,z),e.style.setProperty(`-webkit-backdrop-filter`,`none`,z),e.style.setProperty(`backdrop-filter`,`none`,z),e.style.removeProperty(`border`),e.style.removeProperty(`background`),e.style.removeProperty(`color`),e.style.removeProperty(`outline`),e.style.removeProperty(`box-shadow`);let n=jt();e.dataset.theme=n,e.style.setProperty(`color-scheme`,n===`light`?`light only`:`dark only`,z)}function Nt(e){e.style.setProperty(`list-style`,`none`,z),e.style.setProperty(`list-style-type`,`none`,z),e.style.setProperty(`margin`,`0`,z),e.style.setProperty(`padding`,`0`,z),e.style.setProperty(`display`,`flex`,z),e.style.setProperty(`flex-direction`,`column`,z),e.style.setProperty(`align-items`,`stretch`,z),e.style.setProperty(`gap`,`0.2rem`,z),e.style.setProperty(`width`,`100%`,z),e.style.setProperty(`box-sizing`,`border-box`,z),e.style.setProperty(`text-align`,`left`,z)}function Pt(e){e.style.setProperty(`list-style`,`none`,z),e.style.setProperty(`list-style-type`,`none`,z),e.style.setProperty(`margin`,`0`,z),e.style.setProperty(`padding`,`0`,z),e.style.setProperty(`width`,`100%`,z),e.style.setProperty(`display`,`block`,z),e.style.setProperty(`box-sizing`,`border-box`,z)}function Ft(e,t){if(e.style.setProperty(`appearance`,`none`,z),e.style.setProperty(`-webkit-appearance`,`none`,z),e.style.setProperty(`box-sizing`,`border-box`,z),e.style.setProperty(`width`,`100%`,z),e.style.setProperty(`max-width`,`100%`,z),e.style.setProperty(`margin`,`0`,z),e.style.setProperty(`display`,`grid`,z),e.style.setProperty(`grid-template-columns`,`1.375rem minmax(0, 1fr) auto`,z),e.style.setProperty(`align-items`,`center`,z),e.style.setProperty(`justify-items`,`start`,z),e.style.setProperty(`gap`,`0.55rem`,z),e.style.setProperty(`border-style`,`none`,z),e.style.setProperty(`border-width`,`0`,z),e.style.setProperty(`outline`,`none`,z),e.style.setProperty(`border-radius`,`10px`,z),e.style.setProperty(`padding`,`0.5rem 0.6rem`,z),e.style.setProperty(`min-height`,`2.35rem`,z),e.style.setProperty(`font-family`,`inherit`,z),e.style.setProperty(`font-size`,`0.8125rem`,z),e.style.setProperty(`font-weight`,`400`,z),e.style.setProperty(`line-height`,`1.25`,z),e.style.setProperty(`text-align`,`start`,z),e.style.setProperty(`cursor`,`pointer`,z),e.style.removeProperty(`background`),e.style.removeProperty(`background-color`),e.style.removeProperty(`background-image`),e.style.setProperty(`box-shadow`,`none`,z),e.style.setProperty(`transition`,`none`,z),!t)e.style.setProperty(`color`,`inherit`,z);else{let t=jt()===`light`?`#9f1239`:`#fecaca`;e.style.setProperty(`color`,t,z),e.style.setProperty(`--cw-menu-fg`,t,z),e.style.setProperty(`--icon-color`,t,z)}}function It(e){if(typeof customElements<`u`&&typeof customElements.upgrade==`function`)try{customElements.upgrade(e)}catch{}for(let t of e.querySelectorAll(`ui-icon`)){let e=t;e.style.setProperty(`--icon-size`,`1.125rem`,z),e.style.setProperty(`--icon-padding`,`0px`,z),e.style.setProperty(`--icon-color`,`var(--cw-menu-fg)`,z),e.style.setProperty(`color`,`var(--cw-menu-fg)`,z),e.style.setProperty(`width`,`1.125rem`,z),e.style.setProperty(`height`,`1.125rem`,z),e.style.setProperty(`min-width`,`1.125rem`,z),e.style.setProperty(`min-height`,`1.125rem`,z),e.style.setProperty(`display`,`inline-grid`,z),typeof e.updateIcon==`function`&&e.updateIcon.call(t)}}function Lt(e,t){let n=String(t||``).trim();if(!n)return;let r=document.createElement(`ui-icon`);r.setAttribute(`icon`,n),r.setAttribute(`icon-style`,`duotone`),r.setAttribute(`size`,`18`),r.setAttribute(`aria-hidden`,`true`),r.style.setProperty(`--icon-size`,`1.125rem`,z),r.style.setProperty(`--icon-padding`,`0px`,z),r.style.setProperty(`--icon-color`,`var(--cw-menu-fg)`,z),r.style.setProperty(`color`,`var(--cw-menu-fg)`,z),r.style.setProperty(`width`,`1.125rem`,z),r.style.setProperty(`height`,`1.125rem`,z),e.append(r)}var Rt,zt,Bt,j,M,N,P,F,Vt,Ht,Ut,I,Wt,L,R,z,Gt,Kt,qt,Jt,B,Yt,Xt,Zt,V,Qt,$t=e((()=>{l(),v(),g(),At(),ce(),Rt=`2147483640`,zt=320,Bt=220,j=0,M=null,N=null,P=[],F=new Map,Vt=()=>{for(let e of F.values())try{e.destroy()}catch{}F.clear()},Ht=e=>{F.get(e)?.destroy(),F.set(e,se(e))},Ut=e=>{F.get(e)?.destroy(),F.delete(e)},I=new Map,Wt=new Map,L=new Map,R=new Map,typeof CSS<`u`&&(CSS.supports(`position-anchor: --cw-anchor-test`)||CSS.supports(`anchor-name: --cw-anchor-test`)),z=`important`,Gt=()=>{let e=document.getElementById(`cw-unified-context-menu-style`);e||(e=document.createElement(`style`),e.id=`cw-unified-context-menu-style`,document.head.appendChild(e)),e.textContent=`
        .cw-context-menu-layer {
            position: fixed;
            inset: 0;
            z-index: var(--cw-context-menu-layer-z, ${Rt});
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
    `},Kt=()=>{for(let e of P)try{e()}catch{}P=[]},qt=e=>{for(let[t,n]of Array.from(L.entries()))t>=e&&(clearTimeout(n),L.delete(t));for(let[t,n]of Array.from(R.entries()))t>=e&&(clearTimeout(n),R.delete(t))},Jt=(e,t,n)=>{e.style.left=`${t}px`,e.style.top=`${n}px`;let r=e.getBoundingClientRect(),i=Math.max(8,window.innerWidth-r.width-8),a=Math.max(8,window.innerHeight-r.height-8);e.style.left=`${Math.min(Math.max(8,t),i)}px`,e.style.top=`${Math.min(Math.max(8,n),a)}px`},B=e=>{qt(e);for(let[t,n]of Array.from(I.entries()))t>=e&&(Ut(n),n.remove(),I.delete(t),Wt.delete(t))},Yt=(e,t)=>{let n=t.getBoundingClientRect();Jt(e,Math.round(n.right+4),Math.round(n.top))},Xt=e=>{for(let[t,n]of Array.from(R.entries()))t>=e&&(clearTimeout(n),R.delete(t))},Zt=(e,t,n,r)=>{let i=document.createElement(`div`);i.className=`cw-context-menu${t?` cw-context-menu--compact`:``}`,i.setAttribute(`role`,`menu`),i.dataset.menuDepth=String(n),i.style.zIndex=String(n+1);let a=document.createElement(`ul`);a.className=`cw-context-menu__list`,Nt(a),i.appendChild(a);let o=(e,n,i)=>{if(r!==j||!N?.isConnected||!M?.isConnected||(B(i),!e.children?.length))return;let a=Zt(e.children,t,i,r);a.classList.add(`cw-context-menu--submenu`),M.appendChild(a),I.set(i,a),Wt.set(i,n),Yt(a,n),Ht(a)},s=(e,t,n)=>{let r=L.get(n);r&&clearTimeout(r),Xt(n);let i=setTimeout(()=>{L.delete(n),o(e,t,n)},zt);L.set(n,i)},c=e=>{let t=R.get(e);t&&clearTimeout(t);let n=setTimeout(()=>{R.delete(e),B(e)},Bt);R.set(e,n)};for(let t of e){let e=document.createElement(`button`);e.type=`button`,e.className=`cw-context-menu__item${t.danger?` cw-context-menu__item--danger`:``}`,e.setAttribute(`role`,`menuitem`),e.disabled=!!t.disabled;let i=!!t.children?.length,l=document.createElement(`span`);l.className=`cw-context-menu__icon`,t.icon&&Lt(l,t.icon);let u=document.createElement(`span`);u.className=`cw-context-menu__label`,u.textContent=t.label;let d=document.createElement(`span`);if(d.className=`cw-context-menu__chevron`,i&&Lt(d,`caret-right`),e.append(l,u,d),Ft(e,!!t.danger),i){let i=n+1;e.setAttribute(`aria-haspopup`,`menu`),e.addEventListener(`pointerenter`,()=>s(t,e,i)),e.addEventListener(`pointerleave`,()=>c(i)),e.addEventListener(`click`,n=>{if(n.preventDefault(),n.stopPropagation(),r!==j||!N?.isConnected)return;Xt(i);let a=I.get(i),s=Wt.get(i);if(a?.isConnected&&s===e){B(i);return}o(t,e,i)})}else e.addEventListener(`click`,async e=>{e.preventDefault(),e.stopPropagation(),!(r!==j||!N?.isConnected)&&(V(),!t.disabled&&await t.action())});let f=document.createElement(`li`);Pt(f),f.appendChild(e),a.appendChild(f)}return Mt(i,t),i.addEventListener(`pointerenter`,()=>Xt(n)),i.addEventListener(`pointerleave`,()=>{if(n>0){let e=R.get(n);e&&clearTimeout(e);let t=setTimeout(()=>{R.delete(n),B(n)},Bt);R.set(n,t)}}),i},V=()=>{Kt(),qt(0),B(1),I.clear(),Wt.clear(),Vt(),N?.remove(),N=null,M?.remove(),M=null,j+=1},Qt=e=>{let t=(e.items||[]).filter(e=>e&&e.id&&e.label);if(!t.length){V();return}Gt(),V();let n=j,r=e.resolveOverlayMountPoint?.(e.anchor??null)??b(e.anchor??null),i=document.createElement(`div`);i.className=`cw-context-menu-layer`,i.style.setProperty(`position`,`fixed`,z),i.style.setProperty(`inset`,`0`,z),i.style.setProperty(`z-index`,Rt,z),i.style.setProperty(`pointer-events`,`none`,z),i.style.setProperty(`backdrop-filter`,`none`,z),i.style.setProperty(`-webkit-backdrop-filter`,`none`,z),M=i,r.appendChild(i);let a=Zt(t,!!e.compact,0,n);N=a,i.appendChild(a),Jt(a,e.x,e.y),Ht(a);let o=()=>{n!==j||!a.isConnected||It(a)},s=typeof customElements<`u`&&customElements.whenDefined?customElements.whenDefined(`ui-icon`).then(o).catch(()=>{}):Promise.resolve();queueMicrotask(()=>{s.then(o),requestAnimationFrame(()=>{o(),requestAnimationFrame(o)})});let c=e=>{if(!M?.isConnected||!N)return!1;let t=typeof e.composedPath==`function`?e.composedPath():[],n=Array.isArray(t)&&t.length?t:[];for(let e of n)if(e instanceof Element&&(e===M||e===N||M.contains(e)||e.classList?.contains?.(`cw-context-menu`)||e.closest?.(`.cw-context-menu`)))return!0;let r=e.target;return!!(r instanceof Node&&M.contains(r)||r instanceof Element&&r.closest?.(`.cw-context-menu`))},l=e=>{n!==j||!M?.isConnected||c(e)||V()},u=e=>{if(n!==j||!N?.isConnected)return;let t=e.target;if(!t)return;let r=t.closest?.(`.cw-context-menu__item`);if(!r&&typeof e.composedPath==`function`){for(let t of e.composedPath())if(t instanceof Element&&t.classList?.contains?.(`cw-context-menu__item`)){r=t;break}}if(!r){B(1);return}r.getAttribute(`aria-haspopup`)!==`menu`&&B(1)},d=e=>{n===j&&e.key===`Escape`&&V()},f=()=>V();queueMicrotask(()=>{n===j&&(document.addEventListener(`pointerdown`,l,{capture:!0}),document.addEventListener(`contextmenu`,l,{capture:!0}),document.addEventListener(`keydown`,d),a.addEventListener(`click`,u,{capture:!0}),window.addEventListener(`resize`,f,{passive:!0}),window.addEventListener(`blur`,f,{passive:!0}),P.push(()=>document.removeEventListener(`pointerdown`,l,{capture:!0})),P.push(()=>document.removeEventListener(`contextmenu`,l,{capture:!0})),P.push(()=>document.removeEventListener(`keydown`,d)),P.push(()=>a.removeEventListener(`click`,u,{capture:!0})),P.push(()=>window.removeEventListener(`resize`,f)),P.push(()=>window.removeEventListener(`blur`,f)))})}})),en,tn=e((()=>{en=`/*
 * Filename: TaskBar.scss
 * FullPath: modules/projects/fl.ui/src/ui/navigation/taskbar/scss/TaskBar.scss
 * Change date and time: 13.35.00_31.07.2026
 * Reason for changes: Reconnect after chrome.scss split — no cross-package Sass @use (use CSS var).
 */
/* Taskbar / env chrome (document + host). Former environment-shell/scss/chrome.scss. */
@function --hsv(--src-color <color>) returns <color> {
  result: hsl(from var(--src-color, black) h calc(calc((calc(l / 100) - calc(calc(l / 100) * (1 - calc(s / 100) / 2))) / clamp(0.0001, min(calc(calc(l / 100) * (1 - calc(s / 100) / 2)), calc(1 - calc(calc(l / 100) * (1 - calc(s / 100) / 2)))), 1)) * 100) calc(calc(calc(l / 100) * (1 - calc(s / 100) / 2)) * 100) / alpha);
}
/*
 * Filename: _tokens.scss
 * FullPath: modules/projects/veela.css/src/scss/core/misc/_tokens.scss
 * Change date and time: 09.10.00_02.08.2026
 * Reason for changes: Concrete light/dark surface mixins under data-theme (fix intermittent Light).
 */
/*
 * Filename: _color-properties.scss
 * FullPath: modules/projects/veela.css/src/scss/core/misc/_color-properties.scss
 * Change date and time: 09.05.00_02.08.2026
 * Reason for changes: Only seed hues as @property — semantic light-dark() must stay unregistered.
 */
/*
 * INVARIANT: Do NOT register \`--color-surface\` / \`--color-on-surface\` / etc. as \`@property <color>\`.
 * WHY: Typed colors compute \`light-dark()\` on the defining element (:root) and inherit a *concrete*
 * color. Children that lock \`color-scheme: light\` then get cream surfaces (local light-dark) but
 * keep light-on-dark text from the inherited computed token — Settings Appearance labels vanish.
 *
 * Seeds only: WallpaperTheme / Quick Settings write these; surfaces derive via unregistered
 * \`light-dark(--u2-color-mod(...))\` in \`_tokens.scss\` and re-evaluate per used color-scheme.
 */
@property --color-primary {
  syntax: "<color>";
  inherits: true;
  initial-value: #5a7fff;
}
@property --base-color {
  syntax: "<color>";
  inherits: true;
  initial-value: #5a7fff;
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
@layer tokens, base, layout, utilities, shells, shell, views, view, viewer, components, ux-layer, markdown, essentials, print, print-breaks, overrides;
@layer tokens {
  :root,
  :host,
  :scope {
    /* Box seed; WallpaperTheme may override --color-primary on :root. */
    --color-primary: #5a7fff;
    color-scheme: light dark;
    /* Default = light concrete; OS-dark media + data-theme pins override below. */
    --base-color: var(--color-primary);
    --base-color-neutralized: color-mix(in oklab, var(--base-color) 60%, gray);
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
    --color-surface-container-lowest: --u2-color-mod(var(--base-color), 50);
    --color-surface-container-low: --u2-color-mod(var(--base-color), 100);
    --color-surface-container: --u2-color-mod(var(--base-color), 160);
    --color-surface-container-high: --u2-color-mod(var(--base-color), 220);
    --color-surface-container-highest: --u2-color-mod(var(--base-color), 300);
    --color-border: color-mix(in oklab, var(--color-outline-variant) 75%, transparent);
    --color-bg: var(--color-background);
    --color-text: var(--color-on-background);
    --color-fg: var(--color-on-surface);
    --on-surface-color: var(--color-on-surface);
    --on-surface-variant: var(--color-on-surface-variant);
    --wf-md-surface: var(--color-surface);
    --wf-md-on-surface: var(--color-on-surface);
    --wf-md-on-surface-variant: var(--color-on-surface-variant);
    --wf-md-surf-container: var(--color-surface-container);
    --wf-md-surf-container-low: var(--color-surface-container-low);
    --wf-md-surf-container-high: var(--color-surface-container-high);
    --wf-md-outline-variant: var(--color-outline-variant);
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
    --radius-none: 0;
    --radius-sm: 0.25rem;
    --radius-default: 0.25rem;
    --radius-md: 0.375rem;
    --radius-lg: 0.5rem;
    --radius-xl: 0.75rem;
    --radius-2xl: 1rem;
    --radius-3xl: 1.5rem;
    --radius-full: 9999px;
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
    --font-family-mono: "Roboto Mono", "SF Mono", Monaco, Inconsolata, "Fira Code", monospace;
    --font-sans: var(--font-family);
    --font-mono: var(--font-family-mono);
    --leading-tight: 1.2;
    --leading-normal: 1.5;
    --leading-relaxed: 1.8;
    --transition-fast: 120ms cubic-bezier(0.2, 0, 0, 1);
    --transition-normal: 160ms cubic-bezier(0.2, 0, 0, 1);
    --transition-slow: 200ms cubic-bezier(0.2, 0, 0, 1);
    --motion-fast: var(--transition-fast);
    --motion-normal: var(--transition-normal);
    --motion-slow: var(--transition-slow);
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
    --view-bg: var(--color-surface);
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
    --btn-height-sm: 2rem;
    --btn-height-md: 2.5rem;
    --btn-height-lg: 3rem;
    --btn-padding-x-sm: var(--space-md);
    --btn-padding-x-md: var(--space-lg);
    --btn-padding-x-lg: 1.5rem;
    --btn-radius: var(--radius-md);
    --btn-font-weight: var(--font-weight-medium);
    --input-height-sm: 2rem;
    --input-height-md: 2.5rem;
    --input-height-lg: 3rem;
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
  }
  /* Auto (no pin): follow OS preference with concrete tokens — not light-dark(). */
  @media (prefers-color-scheme: dark) {
    :root:not([data-theme=light]):not([data-theme=dark]),
    :host:not([data-theme=light]):not([data-theme=dark]) {
      color-scheme: dark;
      --base-color: var(--color-primary);
      --base-color-neutralized: color-mix(in oklab, var(--base-color) 60%, gray);
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
      --color-surface-container-lowest: --u2-color-mod(var(--base-color), 960);
      --color-surface-container-low: --u2-color-mod(var(--base-color), 880);
      --color-surface-container: --u2-color-mod(var(--base-color), 840);
      --color-surface-container-high: --u2-color-mod(var(--base-color), 780);
      --color-surface-container-highest: --u2-color-mod(var(--base-color), 720);
      --color-border: color-mix(in oklab, var(--color-outline-variant) 70%, transparent);
      --color-bg: var(--color-background);
      --color-text: var(--color-on-background);
      --color-fg: var(--color-on-surface);
      --on-surface-color: var(--color-on-surface);
      --on-surface-variant: var(--color-on-surface-variant);
      --wf-md-surface: var(--color-surface);
      --wf-md-on-surface: var(--color-on-surface);
      --wf-md-on-surface-variant: var(--color-on-surface-variant);
      --wf-md-surf-container: var(--color-surface-container);
      --wf-md-surf-container-low: var(--color-surface-container-low);
      --wf-md-surf-container-high: var(--color-surface-container-high);
      --wf-md-outline-variant: var(--color-outline-variant);
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
    --color-surface-container-lowest: --u2-color-mod(var(--base-color), 50);
    --color-surface-container-low: --u2-color-mod(var(--base-color), 100);
    --color-surface-container: --u2-color-mod(var(--base-color), 160);
    --color-surface-container-high: --u2-color-mod(var(--base-color), 220);
    --color-surface-container-highest: --u2-color-mod(var(--base-color), 300);
    --color-border: color-mix(in oklab, var(--color-outline-variant) 75%, transparent);
    --color-bg: var(--color-background);
    --color-text: var(--color-on-background);
    --color-fg: var(--color-on-surface);
    --on-surface-color: var(--color-on-surface);
    --on-surface-variant: var(--color-on-surface-variant);
    --wf-md-surface: var(--color-surface);
    --wf-md-on-surface: var(--color-on-surface);
    --wf-md-on-surface-variant: var(--color-on-surface-variant);
    --wf-md-surf-container: var(--color-surface-container);
    --wf-md-surf-container-low: var(--color-surface-container-low);
    --wf-md-surf-container-high: var(--color-surface-container-high);
    --wf-md-outline-variant: var(--color-outline-variant);
  }
  :root[data-theme=dark],
  :host[data-theme=dark],
  [data-theme=dark] {
    color-scheme: dark only;
    --base-color: var(--color-primary);
    --base-color-neutralized: color-mix(in oklab, var(--base-color) 60%, gray);
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
    --color-surface-container-lowest: --u2-color-mod(var(--base-color), 960);
    --color-surface-container-low: --u2-color-mod(var(--base-color), 880);
    --color-surface-container: --u2-color-mod(var(--base-color), 840);
    --color-surface-container-high: --u2-color-mod(var(--base-color), 780);
    --color-surface-container-highest: --u2-color-mod(var(--base-color), 720);
    --color-border: color-mix(in oklab, var(--color-outline-variant) 70%, transparent);
    --color-bg: var(--color-background);
    --color-text: var(--color-on-background);
    --color-fg: var(--color-on-surface);
    --on-surface-color: var(--color-on-surface);
    --on-surface-variant: var(--color-on-surface-variant);
    --wf-md-surface: var(--color-surface);
    --wf-md-on-surface: var(--color-on-surface);
    --wf-md-on-surface-variant: var(--color-on-surface-variant);
    --wf-md-surf-container: var(--color-surface-container);
    --wf-md-surf-container-low: var(--color-surface-container-low);
    --wf-md-surf-container-high: var(--color-surface-container-high);
    --wf-md-outline-variant: var(--color-outline-variant);
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
    background-color: #5a7fff, #7ca7ff;
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
    border: 1px solid #5a7fff, #7ca7ff;
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
@layer ui-taskbar {
  /* Fixed chrome: taskbar (desktop + mobile dock) + FL-UI \`ui-statusbar\` (desktop meta). */
  /* WHY: \`--env-z-shell-chrome\` is set in environment-shell \`scss/root.scss\` ($z-shell-chrome). */
  .env-shell-chrome {
    position: fixed;
    inset-inline: 0;
    inset-block-end: 0;
    z-index: var(--env-z-shell-chrome, 2147483000);
    isolation: isolate;
    display: flex;
    flex-direction: column;
    gap: 0;
    font: 12px ui-sans-serif, system-ui, sans-serif;
    color: var(--wf-md-on-surface-variant, oklch(78% 0.03 274deg));
    pointer-events: none;
  }
  .env-shell-chrome > * {
    pointer-events: auto;
  }
  /*
  * Taskbar base (desktop Win10 acrylic + mobile transparent dock share the same host).
  * Soft elevation: \`.env-shell-taskbar-under\` (UnderlyingShadow) — not box-shadow on blur host.
  */
  .env-shell-taskbar {
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
    background: color-mix(in oklab, #1a1a1a 72%, transparent);
    border-block-start: 1px solid color-mix(in oklab, #fff 12%, transparent);
    backdrop-filter: blur(22px) saturate(1.35);
    -webkit-backdrop-filter: blur(22px) saturate(1.35);
    color: #f3f3f3;
    box-shadow: none;
  }
  .env-shell-taskbar-under.underlying-shadow-container,
  .env-shell-taskbar-under {
    pointer-events: none !important;
    overflow: visible !important;
    z-index: -1 !important;
  }
  .env-shell-taskbar-under .underlying-shadow-geometry {
    background: transparent !important;
    box-shadow: 0 -8px 28px rgba(0, 0, 0, 0.4) !important;
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
    gap: 0;
    min-inline-size: 0;
  }
  .env-shell-taskbar__pins {
    flex: 0 0 auto;
  }
  .env-shell-taskbar__pins [data-env-home] {
    backdrop-filter: blur(10px);
    transform: translateY(-0.5rem);
    outline: solid 1px light-dark(rgba(0, 0, 0, 0.1333333333), rgba(255, 255, 255, 0.1333333333));
  }
  .env-shell-taskbar__windows {
    flex: 1 1 auto;
    justify-content: flex-start;
    overflow-x: auto;
    scrollbar-width: thin;
  }
  .env-shell-taskbar ui-task {
    cursor: pointer;
    color: inherit;
    align-self: stretch;
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
    background: color-mix(in oklab, #fff 10%, transparent);
    opacity: 1;
  }
  .env-shell-taskbar ui-task[data-env-active=true],
  .env-shell-taskbar ui-task[data-active],
  .env-shell-taskbar ui-task[data-focus] {
    outline: none;
    opacity: 1;
    background: color-mix(in oklab, #fff 14%, transparent);
    box-shadow: inset 0 -2px 0 #60cdff;
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
    border-inline-start: 1px solid color-mix(in oklab, #fff 12%, transparent);
  }
  .env-shell-taskbar__clock {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: center;
    gap: 0.05rem;
    min-inline-size: 4.5rem;
    padding-inline: 0.35rem 0.15rem;
    line-height: 1.05;
    user-select: none;
    pointer-events: auto;
    cursor: pointer;
    border-radius: 0.35rem;
  }
  .env-shell-taskbar__clock:hover,
  .env-shell-taskbar__clock:focus-visible {
    background: color-mix(in oklab, #fff 10%, transparent);
    outline: none;
  }
  .env-device-tray--taskbar {
    pointer-events: auto;
    cursor: pointer;
    border-radius: 0.35rem;
  }
  .env-device-tray--taskbar:hover,
  .env-device-tray--taskbar:focus-visible {
    background: color-mix(in oklab, #fff 10%, transparent);
    outline: none;
  }
  .env-shell-taskbar__clock-time {
    font-size: 0.78rem;
    font-weight: 600;
    font-variant-numeric: tabular-nums;
    color: #f3f3f3;
  }
  .env-shell-taskbar__clock-date {
    font-size: 0.62rem;
    font-weight: 500;
    color: color-mix(in oklab, #f3f3f3 72%, transparent);
    white-space: nowrap;
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
  .env-shell-chrome[data-desktop] .env-shell-taskbar ui-task::part(letter) {
    font-size: 0.8rem;
  }
  /* Desktop: Home pin is redundant (empty bar / menu → Show desktop). */
  .env-shell-chrome[data-desktop] .env-shell-taskbar ui-task[data-env-home] {
    display: none !important;
  }
  /*
  * Mobile nav bar: fully transparent; centered house icon only.
  * Long-press Home → \`.env-shell-navbar__switcher\` (open processes).
  */
  .env-shell-chrome:not([data-desktop]) .env-shell-taskbar {
    position: relative;
    display: flex;
    flex-direction: row;
    place-content: center;
    place-items: center;
    place-self: center;
    align-items: center;
    justify-content: center;
    gap: 0;
    block-size: 3rem;
    min-block-size: 3rem;
    padding: 0.15rem 0.75rem;
    padding-block-end: calc(0.15rem + env(safe-area-inset-bottom, 0px));
    background: transparent;
    border-block-start: none;
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
    box-shadow: none;
  }
  .env-shell-chrome:not([data-desktop]) .env-shell-taskbar-under {
    display: none !important;
  }
  .env-shell-chrome:not([data-desktop]) .env-shell-taskbar__pins {
    flex: 0 0 auto;
    justify-content: center;
    align-items: center;
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
    min-inline-size: 2.75rem;
    min-block-size: 2.75rem;
    padding: 0;
    border-radius: 999px;
    background: transparent;
    box-shadow: none;
    touch-action: manipulation;
    -webkit-user-select: none;
    user-select: none;
  }
  /* Icon-only Home (hide task title label). */
  .env-shell-chrome:not([data-desktop]) .env-shell-taskbar ui-task[data-env-home]::part(title) {
    display: none !important;
  }
  .env-shell-chrome:not([data-desktop]) .env-shell-taskbar ui-task[data-env-home]::part(icon) {
    inline-size: 1.5rem;
    block-size: 1.5rem;
  }
  /* Prefer Phosphor glyph; letter fallback is last resort (was wrongly showing "U"). */
  .env-shell-chrome:not([data-desktop]) .env-shell-taskbar ui-task[data-env-home]::part(glyph) {
    inline-size: 1.5rem;
    block-size: 1.5rem;
    opacity: 1;
  }
  .env-shell-chrome:not([data-desktop]) .env-shell-taskbar ui-task[data-env-home]::part(letter) {
    opacity: 0;
  }
  .env-shell-chrome:not([data-desktop]) .env-shell-taskbar ui-task[data-env-home]:hover,
  .env-shell-chrome:not([data-desktop]) .env-shell-taskbar ui-task[data-env-home]:active {
    background: color-mix(in oklch, #fff 10%, transparent);
  }
  .env-shell-chrome:not([data-desktop]) .env-shell-taskbar ui-task[data-env-home][data-env-active=true],
  .env-shell-chrome:not([data-desktop]) .env-shell-taskbar ui-task[data-env-home][data-active],
  .env-shell-chrome:not([data-desktop]) .env-shell-taskbar ui-task[data-env-home][data-focus] {
    background: color-mix(in oklch, #fff 8%, transparent);
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
}`}));function nn(e){return`${un}${String(e||``).trim().toLowerCase()}`}function H(){let e=document.querySelector(`.env-shell-chrome`);return e instanceof HTMLElement&&e.hasAttribute(`data-desktop`)?!1:e instanceof HTMLElement&&e.dataset.chromeLayout===`mobile`||typeof matchMedia==`function`&&matchMedia(`(max-width: 640px)`).matches}function rn(e=new Date){return{time:e.toLocaleTimeString(void 0,{hour:`2-digit`,minute:`2-digit`}),date:e.toLocaleDateString(void 0,{weekday:`short`,day:`numeric`,month:`short`})}}function an(e){let t=ee([]);ie(t),ae(cn,t,{title:`Home`,icon:`house-line`},{},function(){for(let e of t)e!==this&&(e.active=!1);this.active=!0,e.focusedTaskId.value=`home`,e.onHome()}),ae(ln,t,{title:`Markdown`,icon:`article`},{},function(){for(let e of t)e!==this&&(e.active=!1);this.active=!0,e.focusedTaskId.value=`viewer`,e.onViewer()});let n=document.createElement(`ui-taskbar`);n.className=`env-shell-taskbar wf-chrome-no-select`,n.setAttribute(`part`,`taskbar`),n.setAttribute(`data-type`,`desktop`);let r=document.createElement(`div`);r.className=`env-shell-taskbar__pins`;let i=document.createElement(`div`);i.className=`env-shell-taskbar__windows`;let o=document.createElement(`ui-task`);o.setAttribute(`title`,`Home`),o.setAttribute(`icon`,`house-line`),o.setAttribute(`data-id`,cn),o.setAttribute(`data-env-home`,``),o.setAttribute(`aria-label`,`Home`),o.setAttribute(`aria-haspopup`,`menu`),o.setAttribute(`aria-keyshortcuts`,`LongPress`);let s=document.createElement(`ui-task`);s.setAttribute(`title`,`Markdown`),s.setAttribute(`icon`,`article`),s.setAttribute(`data-id`,ln),s.setAttribute(`data-env-pin`,`viewer`),s.setAttribute(`aria-label`,`Markdown`),r.append(o,s);let c=document.createElement(`div`);c.className=`env-shell-taskbar__tray-host`;let l=document.createElement(`div`);l.className=`env-shell-taskbar__clock`,l.setAttribute(`role`,`button`),l.setAttribute(`tabindex`,`0`),l.setAttribute(`aria-label`,`Calendar`),l.setAttribute(`aria-haspopup`,`dialog`),l.setAttribute(`data-chrome-flyout-anchor`,`calendar`);let u=document.createElement(`span`);u.className=`env-shell-taskbar__clock-time`;let d=document.createElement(`span`);d.className=`env-shell-taskbar__clock-date`,l.append(u,d);let f=()=>{let{time:e,date:t}=rn();u.textContent=e,d.textContent=t,l.title=`${e} · ${t}`};f();let te=setInterval(f,fn),p=Tt(e.device,`env-device-tray env-device-tray--taskbar`);p.setAttribute(`role`,`button`),p.setAttribute(`tabindex`,`0`),p.setAttribute(`aria-label`,`Quick settings`),p.setAttribute(`aria-haspopup`,`dialog`),p.setAttribute(`data-chrome-flyout-anchor`,`quick-settings`);let ne=e=>{e.preventDefault(),e.stopPropagation(),Ae(l)},re=e=>{e.preventDefault(),e.stopPropagation(),Ve(p)};l.addEventListener(`click`,ne),l.addEventListener(`keydown`,e=>{(e.key===`Enter`||e.key===` `)&&ne(e)}),p.addEventListener(`click`,re),p.addEventListener(`keydown`,e=>{(e.key===`Enter`||e.key===` `)&&re(e)}),c.append(p,l);let m=document.createElement(`div`);m.className=`env-shell-navbar__switcher`,m.setAttribute(`role`,`menu`),m.setAttribute(`aria-label`,`Open apps`),m.hidden=!0;let h=document.createElement(`ul`);h.className=`env-shell-navbar__switcher-list`,m.appendChild(h),n.append(r,i,c,m);let g=new Map,_=[],v=null,y=!1,ce=!1,b=null,x=[];x.push(()=>clearInterval(te));let S=e=>_.find(t=>String(t.id||``).trim().toLowerCase()===e),C=t=>{let n=String(t||``).trim().toLowerCase();if(!n)return;let r=S(n),i=String(e.focusedTaskId.value||``).trim().toLowerCase(),a=!!r?.focused||i===n||i===`markdown`&&n===`viewer`||i===`viewer`&&(n===`viewer`||n===`markdown`);if(r?.minimized){r.minimized=!1,r.focused=!0,g.get(n)?.toggleAttribute(`data-minimized`,!1),e.focusedTaskId.value=n===`markdown`?`viewer`:n,e.onWindowTask?.(n);return}if(a&&r&&r.visible!==!1){r.minimized=!0,r.focused=!1,g.get(n)?.toggleAttribute(`data-minimized`,!0),e.onMinimizeWindow?.(n);return}e.focusedTaskId.value=n===`markdown`?`viewer`:n,e.onWindowTask?.(n)},w=(t,r,i)=>{if(H())return;t.preventDefault(),t.stopPropagation();let a=String(r||``).trim().toLowerCase(),o=!!S(a)?.minimized,s=[{id:o?`restore`:`minimize`,label:o?`Restore`:`Minimize`,icon:o?`arrow-square-out`:`minus`,action:()=>{o?(e.focusedTaskId.value=a,e.onWindowTask?.(a)):e.onMinimizeWindow?.(a)}},{id:`close`,label:`Close`,icon:`x`,danger:!0,action:()=>e.onCloseWindow?.(a)}];Qt({x:t.clientX,y:t.clientY,compact:!0,anchor:t.target instanceof Element?t.target:n,items:s})};n.addEventListener(`contextmenu`,t=>{if(H())return;let r=typeof t.composedPath==`function`?t.composedPath():[];for(let e of r)if(e instanceof Element&&e.closest?.(`ui-task`))return;t.preventDefault(),t.stopPropagation(),Qt({x:t.clientX,y:t.clientY,compact:!0,anchor:n,items:[{id:`show-desktop`,label:`Show desktop`,icon:`desktop`,action:()=>e.onHome()},{id:`home`,label:`Home`,icon:`house-line`,action:()=>e.onHome()}]})});let T=()=>{ce=!1,m.hidden=!0,h.replaceChildren(),n.removeAttribute(`data-switcher-open`)},E=()=>{let r=_.filter(e=>String(e.id||``).trim());if(h.replaceChildren(),r.length)for(let n of r){let r=String(n.id||``).trim().toLowerCase(),i=document.createElement(`li`);i.className=`env-shell-navbar__switcher-row`,i.setAttribute(`role`,`none`);let a=document.createElement(`button`);a.type=`button`,a.className=`env-shell-navbar__switcher-item`,a.setAttribute(`role`,`menuitem`),a.toggleAttribute(`data-active`,!!n.focused&&!n.minimized),a.toggleAttribute(`data-minimized`,!!n.minimized);let o=document.createElement(`ui-icon`);o.setAttribute(`icon`,n.icon||`app-window`),o.setAttribute(`icon-style`,`duotone`),o.setAttribute(`aria-hidden`,`true`);let s=document.createElement(`span`);s.className=`env-shell-navbar__switcher-label`,s.textContent=n.title||r,a.append(o,s),a.addEventListener(`click`,n=>{n.preventDefault(),n.stopPropagation(),T(),e.focusedTaskId.value=r;let i=nn(r),a=oe(t,i);a?a.focus=!0:e.onWindowTask?.(r)});let c=document.createElement(`button`);c.type=`button`,c.className=`env-shell-navbar__switcher-close`,c.setAttribute(`aria-label`,`Close ${n.title||r}`),c.title=`Close`;let l=document.createElement(`ui-icon`);l.setAttribute(`icon`,`x`),l.setAttribute(`icon-style`,`bold`),l.setAttribute(`aria-hidden`,`true`),c.appendChild(l),c.addEventListener(`click`,t=>{t.preventDefault(),t.stopPropagation(),e.onCloseWindow?.(r),_=_.filter(e=>String(e.id||``).trim().toLowerCase()!==r),g.get(r)?.remove(),g.delete(r),_.length?E():T()}),i.append(a,c),h.appendChild(i)}else{let e=document.createElement(`li`);e.className=`env-shell-navbar__switcher-empty`,e.textContent=`No open apps`,h.appendChild(e)}ce=!0,m.hidden=!1,n.setAttribute(`data-switcher-open`,``)},D=()=>{v!=null&&(clearTimeout(v),v=null)},O=()=>{T(),oe(t,cn).focus=!0};o.addEventListener(`click`,e=>{if(y){e.preventDefault(),e.stopPropagation(),y=!1;return}O()}),o.addEventListener(`pointerdown`,e=>{if(H()&&!(e.button!=null&&e.button!==0)){y=!1,D(),v=setTimeout(()=>{v=null,y=!0;try{o.releasePointerCapture?.(e.pointerId)}catch{}E()},dn);try{o.setPointerCapture?.(e.pointerId)}catch{}}},{capture:!0});let le=()=>{D()};o.addEventListener(`pointerup`,le,{capture:!0}),o.addEventListener(`pointercancel`,le,{capture:!0}),o.addEventListener(`contextmenu`,e=>{H()&&(e.preventDefault(),y=!0,D(),E())}),s.addEventListener(`click`,()=>{let e=S(`viewer`)||S(`markdown`);if(e){C(String(e.id||`viewer`).toLowerCase());return}oe(t,ln).focus=!0}),s.addEventListener(`contextmenu`,t=>{let n=S(`viewer`)||S(`markdown`);if(!n){if(H())return;t.preventDefault(),Qt({x:t.clientX,y:t.clientY,compact:!0,anchor:s,items:[{id:`open-markdown`,label:`Open Markdown`,icon:`article`,action:()=>e.onViewer()}]});return}w(t,String(n.id||`viewer`),n.title||`Markdown`)});let ue=e=>{if(!ce)return;let t=typeof e.composedPath==`function`?e.composedPath():[];for(let e of t)if(e===m||e===o||e instanceof Element&&(e===m||m.contains(e)||e===o))return;T()};document.addEventListener(`pointerdown`,ue,{capture:!0}),x.push(()=>document.removeEventListener(`pointerdown`,ue,{capture:!0}));let de=()=>{let t=String(e.focusedTaskId.value||`home`),n=(e,t)=>{e.toggleAttribute(`data-env-active`,t),e.toggleAttribute(`data-active`,t),e.toggleAttribute(`data-focus`,t)};n(o,t===`home`),n(s,t===`viewer`||t===`markdown`);for(let[e,r]of g)n(r,t===e)};a(()=>{de()},[e.focusedTaskId],{triggerImmediately:!0});let fe=e=>{let n=String(e.id||``).trim().toLowerCase();if(!n||n===`home`)return;let r=nn(n),a=e.title||n,o=String(e.icon||``).trim()||`app-window`,s=g.get(n);if(!s){let e=ae(r,null,{title:a,icon:o},{viewId:n},function(){for(let e of t)e!==this&&(e.active=!1);this.active=!0,C(n)});e.list=t,t.push(e),s=document.createElement(`ui-task`),s.setAttribute(`data-id`,r),s.setAttribute(`data-view`,n),s.setAttribute(`title`,a),s.setAttribute(`aria-label`,a),s.setAttribute(`icon`,o),s.addEventListener(`click`,e=>{e.preventDefault(),e.stopPropagation(),C(n)}),s.addEventListener(`contextmenu`,e=>{w(e,n,a)}),g.set(n,s),i.appendChild(s)}s.setAttribute(`title`,a),s.setAttribute(`aria-label`,a),s.setAttribute(`icon`,o),s.toggleAttribute(`data-minimized`,!!e.minimized),s.hidden=e.visible===!1},pe=n=>{_=Array.isArray(n)?n.slice():[];let r=new Set;for(let t of n){let n=String(t.id||``).trim().toLowerCase();!n||n===`home`||(r.add(n),fe(t),t.focused&&(e.focusedTaskId.value=n))}for(let[e,n]of[...g.entries()]){if(r.has(e))continue;let i=nn(e),a=oe(t,i);if(a){let e=t.indexOf(a);e>=0&&t.splice(e,1)}n.remove(),g.delete(e)}de(),ce&&E()},me=n=>{let r=String(n||`home`).toLowerCase(),i=cn;r===`viewer`||r===`markdown`?i=ln:r!==`home`&&(i=nn(r));let a=oe(t,i);if(a){for(let e of t)e!==a&&(e.active=!1);a.active=!0}e.focusedTaskId.value=r===`markdown`?`viewer`:r,de()},he=()=>{H()?b&&=(b.destroy(),null):!b&&n.isConnected&&(b=se(n,{className:`env-shell-taskbar-under`,shadowBlur:28,shadowOffsetY:8,shadowColor:`rgba(0, 0, 0, 0.4)`}))};queueMicrotask(he);let ge=typeof matchMedia==`function`?matchMedia(`(min-width: 641px)`):null,_e=()=>he();return ge?.addEventListener?.(`change`,_e),x.push(()=>ge?.removeEventListener?.(`change`,_e)),{element:n,taskList:t,setFocusedTaskId:me,syncWindowTasks:pe,dispose:()=>{D(),T(),b?.destroy(),b=null;for(let e of x)try{e()}catch{}x.length=0,g.clear(),i.replaceChildren()}}}var on,sn,cn,ln,un,dn,fn,pn=e((()=>{v(),g(),r(),$t(),kt(),Le(),mt(),T(),tn(),l(),S(),on=u(en),sn=class extends w{constructor(){super()}styles=()=>on;render=()=>o`<div part="taskbar" class="taskbar"><slot></slot></div>`},sn=x([h(`ui-taskbar`)],sn),cn=`#env-home`,ln=`#env-viewer`,un=`#env-win-`,dn=420,fn=3e4})),mn,hn=e((()=>{mn=`/**
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
 * Change date and time: 16.25.00_31.07.2026
 * Reason for changes: Fallback --color-* via --u2-color-mod (token names kept).
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
:root {
  --fl-ui-radius: 0.5rem;
  --fl-ui-gap: 0.75rem;
  /* Explorer / shell (used by _explorer.scss, _explorer-content.scss) */
  --color-primary: #2e3a64;
  --base-color: var(--color-primary);
  --color-surface: --u2-color-mod(var(--base-color), 920);
  --color-on-surface: --u2-color-mod(var(--base-color), 100);
  --color-on-surface-variant: --u2-color-mod(var(--base-color), 280);
  --error-color: #f87171;
}

/* ai-refactor: optimized/refactored at 2026-02-13T00:45:15Z */
/* ai-refactor: optimized/refactored at 2026-02-13T00:45:12Z */
@layer tokens, base, layout, utilities, shells, shell, views, view, viewer, components, ux-layer, markdown, essentials, print, print-breaks, overrides;
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
  .ui-ws-item:not([data-layer=labels]) span {
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
    :root, :host, :scope {
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
 * Change date and time: 09.10.00_02.08.2026
 * Reason for changes: Concrete light/dark surface mixins under data-theme (fix intermittent Light).
 */
/*
 * Filename: _color-properties.scss
 * FullPath: modules/projects/veela.css/src/scss/core/misc/_color-properties.scss
 * Change date and time: 09.05.00_02.08.2026
 * Reason for changes: Only seed hues as @property — semantic light-dark() must stay unregistered.
 */
/*
 * INVARIANT: Do NOT register \`--color-surface\` / \`--color-on-surface\` / etc. as \`@property <color>\`.
 * WHY: Typed colors compute \`light-dark()\` on the defining element (:root) and inherit a *concrete*
 * color. Children that lock \`color-scheme: light\` then get cream surfaces (local light-dark) but
 * keep light-on-dark text from the inherited computed token — Settings Appearance labels vanish.
 *
 * Seeds only: WallpaperTheme / Quick Settings write these; surfaces derive via unregistered
 * \`light-dark(--u2-color-mod(...))\` in \`_tokens.scss\` and re-evaluate per used color-scheme.
 */
@property --color-primary {
  syntax: "<color>";
  inherits: true;
  initial-value: #5a7fff;
}
@property --base-color {
  syntax: "<color>";
  inherits: true;
  initial-value: #5a7fff;
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
@layer tokens, base, layout, utilities, shells, shell, views, view, viewer, components, ux-layer, markdown, essentials, print, print-breaks, overrides;
@layer tokens {
  :root,
  :host,
  :scope {
    /* Box seed; WallpaperTheme may override --color-primary on :root. */
    --color-primary: #5a7fff;
    color-scheme: light dark;
    /* Default = light concrete; OS-dark media + data-theme pins override below. */
    --base-color: var(--color-primary);
    --base-color-neutralized: color-mix(in oklab, var(--base-color) 60%, gray);
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
    --color-surface-container-lowest: --u2-color-mod(var(--base-color), 50);
    --color-surface-container-low: --u2-color-mod(var(--base-color), 100);
    --color-surface-container: --u2-color-mod(var(--base-color), 160);
    --color-surface-container-high: --u2-color-mod(var(--base-color), 220);
    --color-surface-container-highest: --u2-color-mod(var(--base-color), 300);
    --color-border: color-mix(in oklab, var(--color-outline-variant) 75%, transparent);
    --color-bg: var(--color-background);
    --color-text: var(--color-on-background);
    --color-fg: var(--color-on-surface);
    --on-surface-color: var(--color-on-surface);
    --on-surface-variant: var(--color-on-surface-variant);
    --wf-md-surface: var(--color-surface);
    --wf-md-on-surface: var(--color-on-surface);
    --wf-md-on-surface-variant: var(--color-on-surface-variant);
    --wf-md-surf-container: var(--color-surface-container);
    --wf-md-surf-container-low: var(--color-surface-container-low);
    --wf-md-surf-container-high: var(--color-surface-container-high);
    --wf-md-outline-variant: var(--color-outline-variant);
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
    --radius-none: 0;
    --radius-sm: 0.25rem;
    --radius-default: 0.25rem;
    --radius-md: 0.375rem;
    --radius-lg: 0.5rem;
    --radius-xl: 0.75rem;
    --radius-2xl: 1rem;
    --radius-3xl: 1.5rem;
    --radius-full: 9999px;
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
    --font-family-mono: "Roboto Mono", "SF Mono", Monaco, Inconsolata, "Fira Code", monospace;
    --font-sans: var(--font-family);
    --font-mono: var(--font-family-mono);
    --leading-tight: 1.2;
    --leading-normal: 1.5;
    --leading-relaxed: 1.8;
    --transition-fast: 120ms cubic-bezier(0.2, 0, 0, 1);
    --transition-normal: 160ms cubic-bezier(0.2, 0, 0, 1);
    --transition-slow: 200ms cubic-bezier(0.2, 0, 0, 1);
    --motion-fast: var(--transition-fast);
    --motion-normal: var(--transition-normal);
    --motion-slow: var(--transition-slow);
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
    --view-bg: var(--color-surface);
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
    --btn-height-sm: 2rem;
    --btn-height-md: 2.5rem;
    --btn-height-lg: 3rem;
    --btn-padding-x-sm: var(--space-md);
    --btn-padding-x-md: var(--space-lg);
    --btn-padding-x-lg: 1.5rem;
    --btn-radius: var(--radius-md);
    --btn-font-weight: var(--font-weight-medium);
    --input-height-sm: 2rem;
    --input-height-md: 2.5rem;
    --input-height-lg: 3rem;
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
  }
  /* Auto (no pin): follow OS preference with concrete tokens — not light-dark(). */
  @media (prefers-color-scheme: dark) {
    :root:not([data-theme=light]):not([data-theme=dark]),
    :host:not([data-theme=light]):not([data-theme=dark]) {
      color-scheme: dark;
      --base-color: var(--color-primary);
      --base-color-neutralized: color-mix(in oklab, var(--base-color) 60%, gray);
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
      --color-surface-container-lowest: --u2-color-mod(var(--base-color), 960);
      --color-surface-container-low: --u2-color-mod(var(--base-color), 880);
      --color-surface-container: --u2-color-mod(var(--base-color), 840);
      --color-surface-container-high: --u2-color-mod(var(--base-color), 780);
      --color-surface-container-highest: --u2-color-mod(var(--base-color), 720);
      --color-border: color-mix(in oklab, var(--color-outline-variant) 70%, transparent);
      --color-bg: var(--color-background);
      --color-text: var(--color-on-background);
      --color-fg: var(--color-on-surface);
      --on-surface-color: var(--color-on-surface);
      --on-surface-variant: var(--color-on-surface-variant);
      --wf-md-surface: var(--color-surface);
      --wf-md-on-surface: var(--color-on-surface);
      --wf-md-on-surface-variant: var(--color-on-surface-variant);
      --wf-md-surf-container: var(--color-surface-container);
      --wf-md-surf-container-low: var(--color-surface-container-low);
      --wf-md-surf-container-high: var(--color-surface-container-high);
      --wf-md-outline-variant: var(--color-outline-variant);
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
    --color-surface-container-lowest: --u2-color-mod(var(--base-color), 50);
    --color-surface-container-low: --u2-color-mod(var(--base-color), 100);
    --color-surface-container: --u2-color-mod(var(--base-color), 160);
    --color-surface-container-high: --u2-color-mod(var(--base-color), 220);
    --color-surface-container-highest: --u2-color-mod(var(--base-color), 300);
    --color-border: color-mix(in oklab, var(--color-outline-variant) 75%, transparent);
    --color-bg: var(--color-background);
    --color-text: var(--color-on-background);
    --color-fg: var(--color-on-surface);
    --on-surface-color: var(--color-on-surface);
    --on-surface-variant: var(--color-on-surface-variant);
    --wf-md-surface: var(--color-surface);
    --wf-md-on-surface: var(--color-on-surface);
    --wf-md-on-surface-variant: var(--color-on-surface-variant);
    --wf-md-surf-container: var(--color-surface-container);
    --wf-md-surf-container-low: var(--color-surface-container-low);
    --wf-md-surf-container-high: var(--color-surface-container-high);
    --wf-md-outline-variant: var(--color-outline-variant);
  }
  :root[data-theme=dark],
  :host[data-theme=dark],
  [data-theme=dark] {
    color-scheme: dark only;
    --base-color: var(--color-primary);
    --base-color-neutralized: color-mix(in oklab, var(--base-color) 60%, gray);
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
    --color-surface-container-lowest: --u2-color-mod(var(--base-color), 960);
    --color-surface-container-low: --u2-color-mod(var(--base-color), 880);
    --color-surface-container: --u2-color-mod(var(--base-color), 840);
    --color-surface-container-high: --u2-color-mod(var(--base-color), 780);
    --color-surface-container-highest: --u2-color-mod(var(--base-color), 720);
    --color-border: color-mix(in oklab, var(--color-outline-variant) 70%, transparent);
    --color-bg: var(--color-background);
    --color-text: var(--color-on-background);
    --color-fg: var(--color-on-surface);
    --on-surface-color: var(--color-on-surface);
    --on-surface-variant: var(--color-on-surface-variant);
    --wf-md-surface: var(--color-surface);
    --wf-md-on-surface: var(--color-on-surface);
    --wf-md-on-surface-variant: var(--color-on-surface-variant);
    --wf-md-surf-container: var(--color-surface-container);
    --wf-md-surf-container-low: var(--color-surface-container-low);
    --wf-md-surf-container-high: var(--color-surface-container-high);
    --wf-md-outline-variant: var(--color-outline-variant);
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
    background-color: #5a7fff, #7ca7ff;
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
    border: 1px solid #5a7fff, #7ca7ff;
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
  clip-path: var(--layer-shape-clip, none);
  mask-image: var(--layer-shape-mask, none);
  -webkit-mask-image: var(--layer-shape-mask, none);
  inline-size: 100%;
  block-size: 100%;
}

.c-overlaying {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: calc(var(--layer-main-z, 0) + 1);
}

.c-overlaying [data-axis] {
  pointer-events: auto;
}`}));function gn(e){if(typeof Uint8Array.fromBase64==`function`)return Uint8Array.fromBase64(e);let t=atob(e),n=new Uint8Array(t.length);for(let e=0;e<t.length;e++)n[e]=t.charCodeAt(e);return n}async function _n(e,t=`gzip`){if(typeof CompressionStream>`u`)throw Error(`Compression Streams API is not supported in this browser`);let n=new DecompressionStream(t),r=n.writable.getWriter(),i=n.readable.getReader();r.write(e),r.close();let a=[],o=!1;for(;!o;){let{value:e,done:t}=await i.read();o=t,e&&a.push(e)}let s=a.reduce((e,t)=>e+t.length,0),c=new Uint8Array(s),l=0;for(let e of a)c.set(e,l),l+=e.length;return c}async function vn(e,t,n=`font/woff2`){if(Cn.has(t))return Cn.get(t);let r=new Blob([e],{type:n}),i=URL.createObjectURL(r);return Cn.set(t,i),i}async function yn(e){let{base64:t,family:n,style:r=`normal`,weight:i=`normal`,compressed:a=!1}=e,o=`${n}-${r}-${i}`;if(wn.has(o))return wn.get(o);let s=gn(t),c=await vn(a?await _n(s):s,o,a?`application/octet-stream`:`font/woff2`),l=new FontFace(n,`url(${c}) format('woff2')`,{style:r,weight:typeof i==`string`?i:`${i}`,display:`swap`});return await l.load(),document.fonts.add(l),wn.set(o,l),l}async function bn(e){let t=e.map(e=>yn(e));return Promise.all(t)}async function xn(){return Tn||(Tn=re(()=>import(`./font-registry-D4KJRdpC.js`),[],import.meta.url)?.catch?.(e=>{console.error(`Failed to load font registry:`,e)}),Tn)}async function Sn(){let e=await xn();return bn(Object.values(e.fontRegistry))}var Cn,wn,Tn,En=e((()=>{ne(),Cn=new Map,wn=new Map,Tn=null})),Dn,On=e((()=>{Dn=`@layer tokens, base, layout, utilities, shells, shell, views, view, viewer, components, ux-layer, markdown, essentials, print, print-breaks, overrides;
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
}`})),kn,An,jn=e((()=>{En(),l(),hn(),On(),En(),kn=`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
`,An=async e=>{await d(kn)?.catch(()=>void 0),await Sn().catch(()=>void 0),await d(mn)?.catch(()=>void 0),e?.includeGlobalNativeControls&&await d(Dn)?.catch(()=>void 0)}})),Mn,Nn=e((()=>{Mn=`@function --hsv(--src-color <color>) returns <color> {
  result: hsl(from var(--src-color, black) h calc(calc((calc(l / 100) - calc(calc(l / 100) * (1 - calc(s / 100) / 2))) / clamp(0.0001, min(calc(calc(l / 100) * (1 - calc(s / 100) / 2)), calc(1 - calc(calc(l / 100) * (1 - calc(s / 100) / 2)))), 1)) * 100) calc(calc(calc(l / 100) * (1 - calc(s / 100) / 2)) * 100) / alpha);
}
/*
 * Filename: _tokens.scss
 * FullPath: modules/projects/veela.css/src/scss/core/misc/_tokens.scss
 * Change date and time: 09.10.00_02.08.2026
 * Reason for changes: Concrete light/dark surface mixins under data-theme (fix intermittent Light).
 */
/*
 * Filename: _color-properties.scss
 * FullPath: modules/projects/veela.css/src/scss/core/misc/_color-properties.scss
 * Change date and time: 09.05.00_02.08.2026
 * Reason for changes: Only seed hues as @property — semantic light-dark() must stay unregistered.
 */
/*
 * INVARIANT: Do NOT register \`--color-surface\` / \`--color-on-surface\` / etc. as \`@property <color>\`.
 * WHY: Typed colors compute \`light-dark()\` on the defining element (:root) and inherit a *concrete*
 * color. Children that lock \`color-scheme: light\` then get cream surfaces (local light-dark) but
 * keep light-on-dark text from the inherited computed token — Settings Appearance labels vanish.
 *
 * Seeds only: WallpaperTheme / Quick Settings write these; surfaces derive via unregistered
 * \`light-dark(--u2-color-mod(...))\` in \`_tokens.scss\` and re-evaluate per used color-scheme.
 */
@property --color-primary {
  syntax: "<color>";
  inherits: true;
  initial-value: #5a7fff;
}
@property --base-color {
  syntax: "<color>";
  inherits: true;
  initial-value: #5a7fff;
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
@layer tokens, base, layout, utilities, shells, shell, views, view, viewer, components, ux-layer, markdown, essentials, print, print-breaks, overrides;
@layer tokens {
  :root,
  :host,
  :scope {
    /* Box seed; WallpaperTheme may override --color-primary on :root. */
    --color-primary: #5a7fff;
    color-scheme: light dark;
    /* Default = light concrete; OS-dark media + data-theme pins override below. */
    --base-color: var(--color-primary);
    --base-color-neutralized: color-mix(in oklab, var(--base-color) 60%, gray);
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
    --color-surface-container-lowest: --u2-color-mod(var(--base-color), 50);
    --color-surface-container-low: --u2-color-mod(var(--base-color), 100);
    --color-surface-container: --u2-color-mod(var(--base-color), 160);
    --color-surface-container-high: --u2-color-mod(var(--base-color), 220);
    --color-surface-container-highest: --u2-color-mod(var(--base-color), 300);
    --color-border: color-mix(in oklab, var(--color-outline-variant) 75%, transparent);
    --color-bg: var(--color-background);
    --color-text: var(--color-on-background);
    --color-fg: var(--color-on-surface);
    --on-surface-color: var(--color-on-surface);
    --on-surface-variant: var(--color-on-surface-variant);
    --wf-md-surface: var(--color-surface);
    --wf-md-on-surface: var(--color-on-surface);
    --wf-md-on-surface-variant: var(--color-on-surface-variant);
    --wf-md-surf-container: var(--color-surface-container);
    --wf-md-surf-container-low: var(--color-surface-container-low);
    --wf-md-surf-container-high: var(--color-surface-container-high);
    --wf-md-outline-variant: var(--color-outline-variant);
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
    --radius-none: 0;
    --radius-sm: 0.25rem;
    --radius-default: 0.25rem;
    --radius-md: 0.375rem;
    --radius-lg: 0.5rem;
    --radius-xl: 0.75rem;
    --radius-2xl: 1rem;
    --radius-3xl: 1.5rem;
    --radius-full: 9999px;
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
    --font-family-mono: "Roboto Mono", "SF Mono", Monaco, Inconsolata, "Fira Code", monospace;
    --font-sans: var(--font-family);
    --font-mono: var(--font-family-mono);
    --leading-tight: 1.2;
    --leading-normal: 1.5;
    --leading-relaxed: 1.8;
    --transition-fast: 120ms cubic-bezier(0.2, 0, 0, 1);
    --transition-normal: 160ms cubic-bezier(0.2, 0, 0, 1);
    --transition-slow: 200ms cubic-bezier(0.2, 0, 0, 1);
    --motion-fast: var(--transition-fast);
    --motion-normal: var(--transition-normal);
    --motion-slow: var(--transition-slow);
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
    --view-bg: var(--color-surface);
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
    --btn-height-sm: 2rem;
    --btn-height-md: 2.5rem;
    --btn-height-lg: 3rem;
    --btn-padding-x-sm: var(--space-md);
    --btn-padding-x-md: var(--space-lg);
    --btn-padding-x-lg: 1.5rem;
    --btn-radius: var(--radius-md);
    --btn-font-weight: var(--font-weight-medium);
    --input-height-sm: 2rem;
    --input-height-md: 2.5rem;
    --input-height-lg: 3rem;
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
  }
  /* Auto (no pin): follow OS preference with concrete tokens — not light-dark(). */
  @media (prefers-color-scheme: dark) {
    :root:not([data-theme=light]):not([data-theme=dark]),
    :host:not([data-theme=light]):not([data-theme=dark]) {
      color-scheme: dark;
      --base-color: var(--color-primary);
      --base-color-neutralized: color-mix(in oklab, var(--base-color) 60%, gray);
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
      --color-surface-container-lowest: --u2-color-mod(var(--base-color), 960);
      --color-surface-container-low: --u2-color-mod(var(--base-color), 880);
      --color-surface-container: --u2-color-mod(var(--base-color), 840);
      --color-surface-container-high: --u2-color-mod(var(--base-color), 780);
      --color-surface-container-highest: --u2-color-mod(var(--base-color), 720);
      --color-border: color-mix(in oklab, var(--color-outline-variant) 70%, transparent);
      --color-bg: var(--color-background);
      --color-text: var(--color-on-background);
      --color-fg: var(--color-on-surface);
      --on-surface-color: var(--color-on-surface);
      --on-surface-variant: var(--color-on-surface-variant);
      --wf-md-surface: var(--color-surface);
      --wf-md-on-surface: var(--color-on-surface);
      --wf-md-on-surface-variant: var(--color-on-surface-variant);
      --wf-md-surf-container: var(--color-surface-container);
      --wf-md-surf-container-low: var(--color-surface-container-low);
      --wf-md-surf-container-high: var(--color-surface-container-high);
      --wf-md-outline-variant: var(--color-outline-variant);
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
    --color-surface-container-lowest: --u2-color-mod(var(--base-color), 50);
    --color-surface-container-low: --u2-color-mod(var(--base-color), 100);
    --color-surface-container: --u2-color-mod(var(--base-color), 160);
    --color-surface-container-high: --u2-color-mod(var(--base-color), 220);
    --color-surface-container-highest: --u2-color-mod(var(--base-color), 300);
    --color-border: color-mix(in oklab, var(--color-outline-variant) 75%, transparent);
    --color-bg: var(--color-background);
    --color-text: var(--color-on-background);
    --color-fg: var(--color-on-surface);
    --on-surface-color: var(--color-on-surface);
    --on-surface-variant: var(--color-on-surface-variant);
    --wf-md-surface: var(--color-surface);
    --wf-md-on-surface: var(--color-on-surface);
    --wf-md-on-surface-variant: var(--color-on-surface-variant);
    --wf-md-surf-container: var(--color-surface-container);
    --wf-md-surf-container-low: var(--color-surface-container-low);
    --wf-md-surf-container-high: var(--color-surface-container-high);
    --wf-md-outline-variant: var(--color-outline-variant);
  }
  :root[data-theme=dark],
  :host[data-theme=dark],
  [data-theme=dark] {
    color-scheme: dark only;
    --base-color: var(--color-primary);
    --base-color-neutralized: color-mix(in oklab, var(--base-color) 60%, gray);
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
    --color-surface-container-lowest: --u2-color-mod(var(--base-color), 960);
    --color-surface-container-low: --u2-color-mod(var(--base-color), 880);
    --color-surface-container: --u2-color-mod(var(--base-color), 840);
    --color-surface-container-high: --u2-color-mod(var(--base-color), 780);
    --color-surface-container-highest: --u2-color-mod(var(--base-color), 720);
    --color-border: color-mix(in oklab, var(--color-outline-variant) 70%, transparent);
    --color-bg: var(--color-background);
    --color-text: var(--color-on-background);
    --color-fg: var(--color-on-surface);
    --on-surface-color: var(--color-on-surface);
    --on-surface-variant: var(--color-on-surface-variant);
    --wf-md-surface: var(--color-surface);
    --wf-md-on-surface: var(--color-on-surface);
    --wf-md-on-surface-variant: var(--color-on-surface-variant);
    --wf-md-surf-container: var(--color-surface-container);
    --wf-md-surf-container-low: var(--color-surface-container-low);
    --wf-md-surf-container-high: var(--color-surface-container-high);
    --wf-md-outline-variant: var(--color-outline-variant);
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
    background-color: #5a7fff, #7ca7ff;
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
    border: 1px solid #5a7fff, #7ca7ff;
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
:host(ui-task), :host(ui-task) * {
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
}

:host(ui-task[data-focus]) {
  border-block-end-color: --c2-on-surface(0, var(--current)) !important;
}

:host(ui-task:not([data-active])) {
  opacity: 0.6;
}`})),Pn,Fn,In,Ln,Rn=e((()=>{T(),l(),g(),Nn(),S(),Pn=u(Mn),Fn=e=>{let t=``;if(typeof e==`string`)t=e;else if(typeof e==`object`&&e&&`value`in e){let n=e.value;t=n==null?``:String(n)}else e!=null&&typeof e!=`object`&&(t=String(e));(!t||t===`undefined`||t===`null`||t===`[object Object]`)&&(t=``);let n=t.trim().charAt(0);return n?n.toUpperCase():`?`},In=(e,t,n)=>{let r=e.getAttribute(t);return r!=null&&String(r).trim()?String(r).trim():n},Ln=class extends w{title;icon;constructor(){super()}styles=()=>Pn;render=function(){let e=In(this,`title`,`Task`),t=In(this,`icon`,`app-window`),n=Fn(e);return o`
            <div part="icon" class="task-icon c2-contrast c2-transparent" data-letter=${n}>
                <span class="task-letter" part="letter" aria-hidden="true">${n}</span>
                <ui-icon class="c2-contrast c2-transparent task-icon-glyph" part="glyph" icon=${t} icon-style="duotone"></ui-icon>
            </div>
            <div part="title" class="task-title c2-contrast c2-transparent">${e}</div>
        `}},x([_({source:`attr`})],Ln.prototype,`title`,void 0),x([_({source:`attr`})],Ln.prototype,`icon`,void 0),Ln=x([h(`ui-task`)],Ln)})),zn,Bn=e((()=>{zn=`ui-taskbar[data-type=desktop] > ui-task[data-focus] {
  background: --c2-surface(0, var(--current));
  color: --c2-on-surface(0, var(--current));
}

:host(ui-taskbar[data-type=desktop]) ::slotted(ui-task[data-focus]) {
  background: --c2-surface(0, var(--current));
  color: --c2-on-surface(0, var(--current));
}`})),Vn=e((()=>{l(),Bn(),u(zn)})),Hn,Un=e((()=>{Hn=`ui-taskbar[data-type=mobile] > ui-task[data-focus] {
  background: --c2-surface(0, var(--current));
  color: --c2-on-surface(0, var(--current));
}

:host(ui-taskbar[data-type=mobile]) ::slotted(ui-task[data-focus]) {
  background: --c2-surface(0, var(--current));
  color: --c2-on-surface(0, var(--current));
}`})),Wn=e((()=>{l(),Un(),u(Hn)}));function Gn(){try{return globalThis.navigator?.windowControlsOverlay??null}catch{return null}}function Kn(){if(typeof globalThis.matchMedia!=`function`)return`unknown`;try{if(globalThis.matchMedia(`(display-mode: window-controls-overlay)`).matches)return`window-controls-overlay`;if(globalThis.matchMedia(`(display-mode: fullscreen)`).matches)return`fullscreen`;if(globalThis.matchMedia(`(display-mode: standalone)`).matches)return`standalone`;if(globalThis.matchMedia(`(display-mode: minimal-ui)`).matches)return`minimal-ui`;if(globalThis.matchMedia(`(display-mode: browser)`).matches)return`browser`}catch{}return`unknown`}function qn(e){if(!e?.visible||typeof e.getTitlebarAreaRect!=`function`)return null;try{let t=e.getTitlebarAreaRect();return t?{x:t.x,y:t.y,width:t.width,height:t.height}:null}catch{return null}}function Jn(e){let t=Gn(),n=!!t?.visible,r=Kn(),i=n||r===`standalone`||r===`fullscreen`||r===`window-controls-overlay`||r===`minimal-ui`,a=`off`;return e&&(a=n?`wco`:i?`standalone`:`fallback`),{requested:e,wcoVisible:n,displayMode:r,titlebarRect:qn(t),isStandaloneLike:i,surface:a}}function Yn(e){let t=()=>{e.onChange(Jn(e.getRequested()))},n=[];if(typeof globalThis.matchMedia==`function`)for(let e of[`(display-mode: window-controls-overlay)`,`(display-mode: standalone)`,`(display-mode: fullscreen)`,`(display-mode: minimal-ui)`,`(display-mode: browser)`])try{n.push(globalThis.matchMedia(e))}catch{}let r=()=>t();for(let e of n)try{e.addEventListener?.(`change`,r)}catch{try{e.addListener?.(r)}catch{}}let i=Gn(),a=()=>t();try{i?.addEventListener?.(`geometrychange`,a)}catch{}return queueMicrotask(t),()=>{for(let e of n)try{e.removeEventListener?.(`change`,r)}catch{try{e.removeListener?.(r)}catch{}}try{i?.removeEventListener?.(`geometrychange`,a)}catch{}}}var Xn=e((()=>{})),U,Zn,Qn,W,$n,er,tr,G,nr,K,rr,ir,q,J,ar,or,Y,sr,cr,lr,X,Z,ur,Q,dr,fr=e((()=>{U=null,Zn=null,Qn=null,W=[],$n=null,er=0,tr=null,G=`#cbb8a4`,nr=`__CWSP_NATIVE_THEME_COLOR_OWNED__`,K=e=>{let t=String(e||``).trim().toLowerCase();if(!t)return!1;if(t===`#007acc`||t===`#007accff`||t===`#36c`||t===`#3366cc`)return!0;let n=t.match(/^rgba?\(\s*([\d.]+)\s*[, ]\s*([\d.]+)\s*[, ]\s*([\d.]+)/i);if(n&&(t?.startsWith?.(`#`)||t?.startsWith?.(`rgb`))){let e=Math.round(Number(n[1])),t=Math.round(Number(n[2])),r=Math.round(Number(n[3]));if(e<=20&&t>=100&&t<=140&&r>=180&&r<=220)return!0}return!1},rr=()=>{try{return!!globalThis?.[nr]}catch{return!1}},ir=e=>{$n=e;try{globalThis[nr]=!!e}catch{}},q=e=>{if(!e||!e.isConnected||e.hasAttribute(`minimized`))return!1;if(e.hasAttribute(`native-mode`))return!0;let t=e.hasAttribute(`maximized`)||e.hasAttribute(`data-desk-max`)||e.hasAttribute(`data-mobile-max`)||e.hasAttribute(`data-native-active`);if(!t)return!1;try{let t=e.getBoundingClientRect(),n=Math.max(1,globalThis.innerWidth||1),r=Math.max(1,globalThis.innerHeight||1);return t.top<=8&&t.left<=8&&t.width>=n*.92&&t.height>=r*.85}catch{return t}},J=()=>{if(typeof document>`u`)return null;if($n?.isConnected&&q($n))return $n;let e=Array.from(document.querySelectorAll(`ui-window[native-mode]:not([minimized])`));if(e.length)return e[e.length-1];let t=Array.from(document.querySelectorAll(`ui-window[data-desk-max]:not([minimized]), ui-window[maximized]:not([minimized]), ui-window[data-mobile-max]:not([minimized])`));for(let e=t.length-1;e>=0;e--){let n=t[e];if(q(n))return n}return null},ar=()=>{Zn||typeof MutationObserver>`u`||typeof document>`u`||(Zn=new MutationObserver(()=>{let e=J();e?.isConnected?Q(e):Z()}),Zn.observe(document.documentElement,{attributes:!0,attributeFilter:[`data-theme`,`class`,`style`,`color-scheme`]}))},or=e=>{Qn||typeof MutationObserver>`u`||(Qn=new MutationObserver(()=>{if(!rr())return;let t=(e.getAttribute(`content`)||``).toLowerCase(),n=(tr||``).toLowerCase();if(n&&t===n&&!K(t))return;let r=J();r?Q(r):K(t)&&X(G,!0)}),Qn.observe(e,{attributes:!0,attributeFilter:[`content`]}))},Y=e=>e,sr=()=>{if(typeof document>`u`)return null;let e=document.querySelector(`meta[data-theme-color]`)||document.querySelector(`meta[name="theme-color"]`);e||(e=document.createElement(`meta`),e.setAttribute(`name`,`theme-color`),e.setAttribute(`data-theme-color`,``),document.head?.appendChild(e));try{let t=Array.from(document.querySelectorAll(`meta[name="theme-color"]`));for(let n of t)n!==e&&n.remove()}catch{}return or(e),e},cr=(e,t)=>{try{let n=document.createElement(`div`);n.setAttribute(`data-theme-color-probe`,`true`),n.style.cssText=`position:fixed;left:-8px;top:-8px;inline-size:4px;block-size:4px;pointer-events:none;opacity:0;background:${t}`,e.appendChild(n);let r=Y(getComputedStyle(n).backgroundColor);return n.remove(),r}catch{return null}},lr=e=>{let t=e.shadowRoot?.querySelector(`.title-handler`);if(t){let e=cr(t,`var(--ui-win-titlebar-bg, var(--color-surface-container, Canvas))`);if(e)return e;let n=Y(getComputedStyle(t).backgroundColor);if(n)return n}let n=getComputedStyle(e);for(let t of[`--ui-win-titlebar-bg`,`--color-surface-container`,`--color-surface`]){let r=cr(e,`var(${t})`);if(r)return r;let i=n.getPropertyValue(t).trim();if(!i)continue;let a=Y(i);if(a)return a}let r=getComputedStyle(document.documentElement);for(let e of[`--color-surface-container`,`--color-surface`,`--color-surface-container-low`]){let t=cr(document.documentElement,`var(${e})`)||Y(r.getPropertyValue(e).trim());if(t)return t}return null},X=(e,t=!1)=>{let n=sr();if(!n||!e)return;let r=e.toLowerCase();K(r)&&(r=G);let i=(n.getAttribute(`content`)||``).toLowerCase();if(!(i===r&&!t&&!K(i))&&(n.setAttribute(`content`,r),n.setAttribute(`data-theme-color`,``),n.removeAttribute(`media`),tr=r,t||i!==r||K(i)))try{let e=n.parentNode||document.head;e?.removeChild(n),e?.appendChild(n)}catch{}},Z=()=>{if(typeof document>`u`||J())return;ir(null),tr=null;let e=sr();if(!e)return;let t=document.documentElement,n=getComputedStyle(t),r=document.body?getComputedStyle(document.body):null,i=Y(n.getPropertyValue(`--color-surface-container`).trim())||Y(n.getPropertyValue(`--color-surface`).trim())||Y(n.getPropertyValue(`--ui-win-titlebar-bg`).trim())||(r?Y(r.backgroundColor):null)||Y(n.backgroundColor);i?X(i):K(String(e.getAttribute(`content`)||``))&&X(G,!0),ar()},ur=e=>e.hasAttribute(`maximized`)||e.hasAttribute(`data-desk-max`)||e.hasAttribute(`data-mobile-max`)||e.hasAttribute(`data-native-active`),Q=e=>{if(!e||typeof document>`u`||e.hasAttribute(`minimized`)||!e.hasAttribute(`native-mode`)&&!ur(e)&&!q(e))return;let t=sr();if(!t)return;if(U==null){let e=t.getAttribute(`content`)||``;U=K(e)?``:e}ir(e),K(String(t.getAttribute(`content`)||``))&&X(G,!0);let n=++er,r=(t=!1)=>{if(n!==er||!e.isConnected||!e.hasAttribute(`native-mode`)&&!ur(e)&&!q(e))return;let r=lr(e)||G;X(r,t)};r(!0),requestAnimationFrame(()=>{r(!1),requestAnimationFrame(()=>r(!0))});for(let e of W)clearTimeout(e);W=[],W.push(setTimeout(()=>r(!0),50),setTimeout(()=>r(!0),160),setTimeout(()=>r(!0),400)),ar()},dr=e=>{if(typeof document>`u`||!document.querySelector(`meta[name="theme-color"]`))return;let t=J();if(t&&t!==e){Q(t);return}let n=Array.from(document.querySelectorAll(`ui-window[native-mode]:not([minimized]), ui-window[data-desk-max]:not([minimized]), ui-window[maximized]:not([minimized]), ui-window[data-mobile-max]:not([minimized])`)).filter(t=>t!==e&&q(t));if(n.length){Q(n[n.length-1]);return}ir(null),tr=null,er+=1;for(let e of W)clearTimeout(e);W=[],U!=null&&U&&!K(U)?(X(U,!0),U=null):(U=null,Z())},typeof document<`u`&&queueMicrotask(()=>{try{Z()}catch{}})})),pr,mr=e((()=>{pr=`/*
 * Filename: Windows2.scss
 * FullPath: modules/projects/fl.ui/src/ui/containers/window/Windows2.scss
 * Change date and time: 16.25.00_31.07.2026
 * Reason for changes: --ui-win-* palette via --u2-color-mod (token names kept).
 */
/* WHY: Inline adopted sheet for <ui-window>; function local so shadow sheet resolves mods. */
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
  --ui-win-radius: 0.75rem;
  --ui-win-titlebar-height: 2.5rem;
  --ui-win-footer-min: 2.25rem;
  --ui-win-control-size: 1.75rem;
  --ui-win-icon-size: 0.95rem;
  --ui-win-gap: 0.5rem;
  --ui-win-pad-inline: 0.75rem;
  --ui-win-pad-block: 0.65rem;
  /*
   * Prefer document \`--color-*\` (concrete under data-theme) so Light/Dark pins win.
   * light-dark() kept only as last-resort when veela tokens are absent.
   */
  --ui-win-seed: var(--base-color, var(--color-primary, #5a7fff));
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
      --u2-color-mod(var(--ui-win-seed), 140),
      --u2-color-mod(var(--ui-win-seed), 860)
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
  --icon-size: var(--ui-win-icon-size);
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
 * Mobile (env shell): full-bleed except bottom dock reserve; no min/max/close —
 * Home on the mobile taskbar replaces Close.
 * Titlebar becomes an empty spacer under the transparent overlay statusband
 * (\`--env-status-inset-top\`) unless standalone (\`data-no-titlebar\`).
 */
:host(ui-window[data-mobile-max]) {
  --ui-win-radius: 0;
  /* Spacer height matches overlay status / notch when status-gap is on. */
  --ui-win-titlebar-height: var(--env-status-inset-top, max(2rem, env(safe-area-inset-top, 0px)));
  /*inset: 0 0 var(--env-mobile-dock-reserve, 0rem) 0 !important;*/
  inset: 0px;
  inline-size: 100% !important;
  block-size: calc(100% - var(--env-mobile-dock-reserve)) !important;
  border-radius: 0;
  transform: none !important;
}
@media screen and (pointer: fine) and ((min-width: 480px) or (hover: hover)) {
  :host(ui-window[data-mobile-max]) {
    inset: 0 0 var(--env-mobile-dock-reserve, 0rem) 0 !important;
  }
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
  /* Empty gap under overlay statusbar — wallpaper / window edge shows through. */
  background: transparent;
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
  background: transparent;
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
  inset: 0px !important;
  inline-size: auto !important;
  block-size: calc(100% - var(--ui-win-titlebar-height)) !important;
  border-radius: 0;
  transform: none !important;
}
@media screen and (pointer: coarse) and (hover: none) {
  :host(ui-window[data-desk-max]) {
    block-size: stretch !important;
  }
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

:host(ui-window[data-native-active]) .footer-handler:empty {
  display: none;
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
  grid-template-rows: auto minmax(0, 1fr) auto;
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
  border-block-end: 1px solid var(--ui-win-border);
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
  outline: 2px solid light-dark(#3794ff, #6ee7b7);
  outline-offset: 2px;
}
.title-handler-buttons button ui-icon,
.title-handler-actions button ui-icon {
  inline-size: var(--ui-win-icon-size);
  block-size: var(--ui-win-icon-size);
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
.footer-handler:empty, .footer-handler:not(:has(*)):not(:has(::slotted(*))) {
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
}`})),hr,gr,_r,vr,yr,br,$,xr=e((()=>{g(),l(),T(),v(),Xn(),fr(),mr(),S(),hr=u(pr),gr=`minus`,_r=`corners-out`,vr=`corners-in`,yr=`x`,br=Object.freeze({w:240,h:160}),$=class extends C{titleHandler;contentHandler;footerHandler;resizer;#e=c(0);#t=c(0);#n=null;#r=null;#i=null;#a=null;#o=null;#s=null;#c=null;#l=!1;#u=0;#d=0;#f=null;styles=function(){return hr};render=function(){return o`<div class="window-container" part="window-container">
            <header class="title-handler" part="title-handler">
                <div class="title-handler-main" part="title">
                    <slot name="title"></slot>
                </div>
                <div class="title-handler-actions" part="actions">
                    <slot name="actions"></slot>
                </div>
                <div class="title-handler-buttons" part="controls" data-no-drag>
                    <button class="title-minimize" type="button" aria-label="Minimize" title="Minimize" data-no-drag data-ui-win-action="minimize">
                        <ui-icon icon=${gr}></ui-icon>
                    </button>
                    <button class="title-maximize" type="button" aria-label="Maximize" title="Maximize" data-no-drag data-ui-win-action="maximize">
                        <ui-icon icon=${_r}></ui-icon>
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
                        <ui-icon icon=${vr}></ui-icon>
                    </button>
                    <button class="title-close" type="button" aria-label="Close" title="Close" data-no-drag data-ui-win-action="close">
                        <ui-icon icon=${yr}></ui-icon>
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
        </div>`};constructor(){super()}get managed(){return this.hasAttribute(`managed`)}get nativeMode(){return this.hasAttribute(`native-mode`)}set nativeMode(e){this.toggleAttribute(`native-mode`,!!e),this.#h()}get nativeSurface(){return this.#f?.surface??(this.nativeMode?`fallback`:`off`)}onInitialize(){super.onInitialize()}onRender(){super.onRender(),this.#p()}connectedCallback(){super.connectedCallback?.(),this.#p(),this.#m()}disconnectedCallback(){this.#s?.(),this.#s=null,this.#c?.disconnect(),this.#c=null,this.#o?.disconnect(),this.#o=null,this.#a?.(),this.#a=null,this.#l=!1,this.#u=0,this.#i?.(),this.#i=null,this.#n?.(),this.#n=null,this.#r?.(),this.#r=null,super.disconnectedCallback?.()}#p(){let e=()=>{this.#E(),this.#b(),this.#D(),this.#O(),this.#h(),this.#u<20&&(this.#u+=1,(!this.#l||this.#u<8)&&requestAnimationFrame(e))};queueMicrotask(e)}#m(){this.#s||(this.#s=Yn({getRequested:()=>this.nativeMode,onChange:e=>this.#g(e)}),typeof MutationObserver<`u`&&!this.#c&&(this.#c=new MutationObserver(e=>{let t=!1,n=!1;for(let r of e)r.attributeName===`native-mode`&&(t=!0),(r.attributeName===`maximized`||r.attributeName===`data-desk-max`||r.attributeName===`data-mobile-max`)&&(n=!0);(t||n)&&this.#h(),n&&this.#v()}),this.#c.observe(this,{attributes:!0,attributeFilter:[`native-mode`,`maximized`,`data-desk-max`,`data-mobile-max`]})))}#h(){this.#g(Jn(this.nativeMode))}#g(e){this.#f=e;let t=this;t.toggleAttribute(`data-native-wco`,e.surface===`wco`),t.toggleAttribute(`data-native-standalone`,e.surface===`standalone`),t.toggleAttribute(`data-native-fallback`,e.surface===`fallback`),t.toggleAttribute(`data-native-active`,e.surface!==`off`),this.#_(e.surface),e.titlebarRect?(t.style.setProperty(`--ui-win-titlebar-area-x`,`${e.titlebarRect.x}px`),t.style.setProperty(`--ui-win-titlebar-area-y`,`${e.titlebarRect.y}px`),t.style.setProperty(`--ui-win-titlebar-area-width`,`${e.titlebarRect.width}px`),t.style.setProperty(`--ui-win-titlebar-area-height`,`${e.titlebarRect.height}px`)):(t.style.removeProperty(`--ui-win-titlebar-area-x`),t.style.removeProperty(`--ui-win-titlebar-area-y`),t.style.removeProperty(`--ui-win-titlebar-area-width`),t.style.removeProperty(`--ui-win-titlebar-area-height`)),this.#n?.(),this.#n=null,this.#r?.(),this.#r=null,this.#D(),this.#O(),this.#v(),this.nativeMode||this.hasAttribute(`data-desk-max`)||this.hasAttribute(`maximized`)||this.hasAttribute(`data-mobile-max`)?Q(this):(dr(this),Z()),this.dispatchEvent(new CustomEvent(`window-native-change`,{bubbles:!0,composed:!0,detail:e}))}#_(e=this.nativeSurface){let t=this.shadowRoot?.querySelector(`.title-exit-native`);t&&(t.hidden=e!==`standalone`)}#v(){let e=this.shadowRoot?.querySelector(`.title-maximize`),t=e?.querySelector(`ui-icon`);if(!e||!t)return;let n=!(this.nativeMode&&this.nativeSurface===`fallback`)&&(this.hasAttribute(`maximized`)||this.hasAttribute(`data-desk-max`)||this.hasAttribute(`data-mobile-max`)),r=n?vr:_r,i=n?`Restore`:`Maximize`;t.getAttribute(`icon`)!==r&&t.setAttribute(`icon`,r),e.setAttribute(`aria-label`,i),e.setAttribute(`title`,i)}applyBounds(e){let t=this;t.style.position=`absolute`,typeof e.x==`number`&&(t.style.left=`${e.x}px`),typeof e.y==`number`&&(t.style.top=`${e.y}px`),typeof e.w==`number`&&(t.style.width=`${e.w}px`,t.style.setProperty(`--ui-win-width`,`${e.w}px`)),typeof e.h==`number`&&(t.style.height=`${e.h}px`,t.style.setProperty(`--ui-win-height`,`${e.h}px`)),typeof e.z==`number`&&(t.style.zIndex=String(e.z)),t.style.right=``,t.style.bottom=``,this.managed&&(this.#e.value=0,this.#t.value=0,t.style.transform=``)}setVisible(e){this.toggleAttribute(`hidden-window`,!e),this.style.visibility=e?``:`hidden`,this.style.pointerEvents=e?``:`none`}get isMaximized(){return this.hasAttribute(`maximized`)||this.hasAttribute(`data-desk-max`)||this.hasAttribute(`data-mobile-max`)}get isMinimized(){return this.hasAttribute(`minimized`)}get usesNativeWindowDrag(){let e=this.nativeSurface;return e===`wco`||e===`standalone`}enterNativeMode(){if(this.managed){this.#y(`window-native`);return}this.nativeMode=!0,this.#y(`window-native`)}exitNativeMode(){if(this.managed){this.#y(`window-exit-native`);return}this.nativeMode=!1,this.#y(`window-exit-native`)}#y(e,t=!1){return this.dispatchEvent(new CustomEvent(e,{bubbles:!0,composed:!0,cancelable:t}))}toggleMaximize(){let e=this.isMaximized;if(this.managed){this.#y(e?`window-restore`:`window-maximize`);return}let t=!e;this.toggleAttribute(`maximized`,t),t&&this.removeAttribute(`minimized`),this.#v(),this.#y(t?`window-maximize`:`window-restore`)}toggleMinimize(){if(this.managed){this.#y(this.isMinimized?`window-restore`:`window-minimize`);return}let e=!this.isMinimized;this.toggleAttribute(`minimized`,e),e&&this.removeAttribute(`maximized`),this.#y(e?`window-minimize`:`window-restore`)}restoreWindow(){if(this.managed){this.#y(`window-restore`);return}let e=this.isMinimized,t=this.isMaximized;this.removeAttribute(`minimized`),this.removeAttribute(`maximized`),(e||t)&&this.#y(`window-restore`)}closeWindow(){this.#y(`window-close`,!0),this.isConnected&&this.remove()}#b(){this.#i||=n(this,`pointerdown`,()=>{this.requestFocus()},{capture:!0,passive:!0})}requestFocus(){this.dispatchEvent(new CustomEvent(`window-focus`,{bubbles:!0,composed:!0}))}bringToFront(e){let t=this;Number.isFinite(e)&&(t.style.zIndex=String(e)),t.toggleAttribute(`data-focused`,!0)}clearFocused(){this.toggleAttribute(`data-focused`,!1)}#x(e){let t=typeof e.composedPath==`function`?e.composedPath():[];for(let e of t){if(!(e instanceof Element))continue;let t=e.getAttribute?.(`data-ui-win-action`);if(t===`close`||t===`exit-native`||t===`maximize`||t===`minimize`)return t;if(e.matches?.(`.title-close`))return`close`;if(e.matches?.(`.title-exit-native`))return`exit-native`;if(e.matches?.(`.title-maximize`))return`maximize`;if(e.matches?.(`.title-minimize`))return`minimize`}let n=e.target;if(n instanceof Element){let e=n.closest?.(`[data-ui-win-action], .title-close, .title-exit-native, .title-maximize, .title-minimize`)??null;if(!e)return null;let t=e.getAttribute(`data-ui-win-action`);if(t===`close`||t===`exit-native`||t===`maximize`||t===`minimize`)return t;if(e.classList.contains(`title-close`))return`close`;if(e.classList.contains(`title-exit-native`))return`exit-native`;if(e.classList.contains(`title-maximize`))return`maximize`;if(e.classList.contains(`title-minimize`))return`minimize`}return null}#S(){let e=typeof performance<`u`?performance.now():Date.now();return e-this.#d<280?!1:(this.#d=e,!0)}#C(e){e===`close`?this.closeWindow():e===`exit-native`?this.exitNativeMode():e===`maximize`?this.nativeMode&&this.nativeSurface===`fallback`?this.exitNativeMode():this.toggleMaximize():this.toggleMinimize()}#w(e){let t=this.#x(e);return t?(e.preventDefault(),e.stopPropagation(),e.stopImmediatePropagation?.(),this.#S()&&this.#C(t),!0):!1}#T(){let e=this.shadowRoot;if(e)for(let[t,n]of[[`minimize`,`.title-minimize`],[`maximize`,`.title-maximize`],[`close`,`.title-close`],[`exit-native`,`.title-exit-native`]]){let r=e.querySelector(n);if(!r)continue;r.setAttribute(`data-ui-win-action`,t);let i=e=>{e.preventDefault(),e.stopPropagation(),e.stopImmediatePropagation?.(),this.#S()&&this.#C(t)};r.onclick=i,r.onpointerup=e=>{e.button===0&&i(e)}}}#E(){let e=this.shadowRoot;if(!e)return;let t=this.titleHandler??e.querySelector(`.title-handler`),r=e.querySelector(`.title-handler-buttons`);if(!t||!r)return;if(this.#T(),this.#l){this.#_(),this.#v();return}let i=e=>{this.#w(e)},a=e=>{this.#x(e)||(typeof e.composedPath==`function`?e.composedPath():[]).some(e=>e instanceof Element&&e.classList?.contains(`title-handler`))&&(e.target?.closest?.(`button, a, input, textarea, select, [data-no-drag]`)||(e.preventDefault(),this.#S()&&this.toggleMaximize()))},o=n(e,`click`,i,{capture:!0}),s=n(e,`pointerup`,i,{capture:!0}),c=n(this,`click`,i,{capture:!0}),l=n(this,`pointerup`,i,{capture:!0}),u=n(this,`dblclick`,a,{capture:!0});typeof MutationObserver<`u`&&!this.#o&&(this.#o=new MutationObserver(()=>{this.#T(),this.#_(),this.#v()}),this.#o.observe(e,{childList:!0,subtree:!0})),this.#a=()=>{o?.(),s?.(),c?.(),l?.(),u?.(),this.#o?.disconnect(),this.#o=null,this.#a=null,this.#l=!1},this.#l=!0,this.#u=0,this.#_(),this.#v()}#D(){let e=this.shadowRoot??this,t=this.titleHandler??e.querySelector?.(`.title-handler`);if(!t||this.#n)return;if(this.usesNativeWindowDrag){this.#n=()=>{this.#n=null};return}this.managed||i(this,s`transform: translate(${this.#e}px, ${this.#t}px)`);let r=new Map,a=n(t,`pointerdown`,e=>{if(e.button!==0||this.#x(e)||e.target?.closest(`button, a, input, textarea, select, [data-no-drag]`)||this.isMaximized||this.isMinimized||this.nativeMode)return;this.requestFocus();let t=this;r.set(e.pointerId,{sx:e.clientX,sy:e.clientY,ox:this.#e.value,oy:this.#t.value,bx:Number.parseFloat(t.style.left||`0`)||0,by:Number.parseFloat(t.style.top||`0`)||0,dragging:!1});let i=n(document.body,`pointermove`,e=>{let t=r.get(e.pointerId);if(!t)return;let n=e.clientX-t.sx,i=e.clientY-t.sy;if(!t.dragging){if(Math.hypot(n,i)<4)return;t.dragging=!0;try{e.preventDefault()}catch{}this.setPointerCapture?.(e.pointerId)}if(this.managed){this.dispatchEvent(new CustomEvent(`window-move`,{bubbles:!0,composed:!0,detail:{x:t.bx+n,y:t.by+i,dx:n,dy:i}}));return}this.#e.value=t.ox+n,this.#t.value=t.oy+i}),a=e=>{if(!r.has(e.pointerId))return;let t=r.get(e.pointerId);if(r.delete(e.pointerId),t?.dragging)try{this.releasePointerCapture?.(e.pointerId)}catch{}i?.(),o?.(),s?.()},o=n(document.body,`pointerup`,a),s=n(document.body,`pointercancel`,a)});this.#n=()=>{a?.()}}#O(){let e=this.shadowRoot??this,t=this.resizer??e.querySelector?.(`.window-resizer`);if(!t||this.#r)return;let r=new Map,i=n(t,`pointerdown`,e=>{if(e.button!==0||this.isMaximized||this.isMinimized||this.nativeMode)return;e.preventDefault(),e.stopPropagation(),this.requestFocus(),this.setPointerCapture?.(e.pointerId);let t=this.getBoundingClientRect();r.set(e.pointerId,{sx:e.clientX,sy:e.clientY,w:t.width,h:t.height});let i=n(document.body,`pointermove`,e=>{let t=r.get(e.pointerId);if(!t)return;let n=Math.max(br.w,t.w+(e.clientX-t.sx)),i=Math.max(br.h,t.h+(e.clientY-t.sy));if(this.managed){this.dispatchEvent(new CustomEvent(`window-resize`,{bubbles:!0,composed:!0,detail:{w:n,h:i}}));return}this.style.width=`${n}px`,this.style.height=`${i}px`,this.style.setProperty(`--ui-win-width`,`${n}px`),this.style.setProperty(`--ui-win-height`,`${i}px`)}),a=e=>{if(r.has(e.pointerId)){r.delete(e.pointerId);try{this.releasePointerCapture?.(e.pointerId)}catch{}i?.(),o?.(),s?.()}},o=n(document.body,`pointerup`,a),s=n(document.body,`pointercancel`,a)});this.#r=()=>{i?.()}}},x([_({source:`query`,name:`.title-handler`})],$.prototype,`titleHandler`,void 0),x([_({source:`query`,name:`.content-handler`})],$.prototype,`contentHandler`,void 0),x([_({source:`query`,name:`.footer-handler`})],$.prototype,`footerHandler`,void 0),x([_({source:`query`,name:`.window-resizer`})],$.prototype,`resizer`,void 0),$=x([h(`ui-window`)],$)})),Sr=e((()=>{g()})),Cr=e((()=>{})),wr=e((()=>{r(),g()})),Tr=e((()=>{T(),kt(),pn(),Rn(),Vn(),Wn(),Se(),Le(),mt(),xr(),Sr(),Cr(),wr()}));function Er(){return{...Dr}}var Dr,Or=e((()=>{l(),hn(),jn(),Tr(),Dr={loadStyles:!0,includeGlobalNativeControlStyles:!1,styleVariant:`veela-basic`},(async()=>{let e=Er();e.loadStyles!==!1&&(await An({includeGlobalNativeControls:e.includeGlobalNativeControlStyles===!0}),await t(mn))})()?.catch?.(()=>void 0)}));export{T as _,xt as a,_t as c,mt as d,ot as f,C as g,de as h,wt as i,Et as l,Se as m,pn as n,kt as o,Le as p,an as r,vt as s,Or as t,yt as u,x as v,S as y};