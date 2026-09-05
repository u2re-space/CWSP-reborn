import{n as e}from"./rolldown-runtime-C0FnF6B9.js";import{Ht as t,Ut as n,dt as r,t as i,ut as a,xt as o}from"./src-OjdqEwqq.js";import{a as s,t as c}from"./cws-bridge-DOZq0ZYZ.js";import{Bt as l,It as u,Lt as d,Mt as f,Nt as p,Rt as m}from"./OPFS-Cs7Zbr2t.js";import{n as h,r as g}from"./shell-preference-DNduHyVr.js";import{n as _,t as v}from"./preload-helper-DFTwEg7x.js";import{d as y,u as b}from"./registry-sf6h2dtK.js";import{i as x,n as S,o as C,t as w}from"./image-CQYO6jsf.js";import{o as T,s as E}from"./icon-s-qdKq1E.js";import{_ as D,g as O,n as ee,t as te,v as k,y as A}from"./shells-Dkr0bxh2.js";import{_ as ne,a as j,b as M,c as N,d as P,f as F,g as re,h as ie,i as ae,l as oe,m as I,n as L,o as R,p as se,r as ce,s as le,t as ue,u as de,v as fe,x as pe,y as me}from"./src-BuRLkocw.js";function he(){if(typeof document>`u`||!document.body)return{top:0,bottom:0};let e=document.createElement(`div`);e.style.cssText=`position:fixed;top:0;left:0;padding-top:env(safe-area-inset-top);padding-bottom:env(safe-area-inset-bottom);visibility:hidden;pointer-events:none;`,document.body.appendChild(e);let t=getComputedStyle(e),n=Number.parseFloat(t.paddingTop)||0,r=Number.parseFloat(t.paddingBottom)||0;return e.remove(),{top:n,bottom:r}}function ge(){try{if(!/android/i.test(navigator.userAgent))return 0}catch{return 0}return 28}function _e(e,t){V=Math.max(0,Math.round(e)),H=Math.max(0,Math.round(t));let n=`${V}px`,r=`${H}px`;document.documentElement.style.setProperty(z,n),document.documentElement.style.setProperty(B,r),document.documentElement.toggleAttribute(`data-capacitor-native`,!0);for(let e of document.querySelectorAll(`.env-shell-root, env-shell-container`))e instanceof HTMLElement&&(e.style.setProperty(z,n),e.style.setProperty(B,r),e.toggleAttribute(`data-capacitor-native`,!0))}function ve(){if(V<=0&&H<=0)return;let e=`${V}px`,t=`${H}px`;for(let n of document.querySelectorAll(`.env-shell-root, env-shell-container`))n instanceof HTMLElement&&n.style.getPropertyValue(z)!==e&&(n.style.setProperty(z,e),n.style.setProperty(B,t),n.toggleAttribute(`data-capacitor-native`,!0))}async function ye(){let e=0;try{let t=await c.getShellInfo();e=Number(t.statusBarHeightCss)||0}catch{}let t=he();return e=Math.max(e,t.top),e<=0&&(e=ge()),{top:e,bottom:0}}async function be(){if(!F())return;if(xe){ve();return}xe=!0;let e=async()=>{let{top:e,bottom:t}=await ye();_e(e,t)};await e(),window.addEventListener(`resize`,()=>void e()),window.visualViewport?.addEventListener(`resize`,()=>void e()),document.addEventListener(`orientationchange`,()=>void e()),ve(),globalThis.setTimeout?.(ve,400)}var z,B,V,H,xe;function Se(){return(Se=e((()=>{s(),P(),z=`--env-native-safe-top`,B=`--env-native-safe-bottom`,V=0,H=0,xe=!1})))()}var Ce;function we(){return(we=e((()=>{Ce=`/**
 * Shadow-only layout for \`<env-shell-container>\`: underlying / main / overlays stack.
 * Document-level tokens (e.g. \`.env-shell-root\`) stay in \`root.scss\`.
 */
:host {
  display: block;
  position: relative;
  box-sizing: border-box;
  isolation: isolate;
  /* WHY: \`overflow: clip\` breaks \`position: fixed\` overlays (context menus in overlay slot clip to wrong box). */
  overflow: visible;
  min-block-size: var(--lv-height, 100lvb);
  block-size: var(--lv-height, 100lvb);
  color-scheme: light dark;
}

.esc-stack {
  display: grid;
  grid-template: 1fr/1fr;
  min-block-size: inherit;
  box-sizing: border-box;
}

.esc-layer {
  grid-area: 1/1;
  min-block-size: inherit;
  box-sizing: border-box;
}

/* WHY: Wallpaper uses \`position: fixed\` — \`overflow: clip\` here would hide it after layout changes. */
.esc-underlying {
  z-index: 0;
  pointer-events: none;
  overflow: visible;
}

/* Main workspace: home, frames host, routed content. */
.esc-main {
  z-index: 1;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  min-block-size: inherit;
  pointer-events: auto;
  /* Allow \`.wf-frame\` / portaled overlays to escape this layer; clipping host would hide floating windows. */
  overflow: visible;
}

/* Menus / modals / env chrome — children opt into pointer-events. */
.esc-overlays {
  z-index: 2;
  pointer-events: none;
  position: relative;
  overflow: visible;
}

/* WHY: Shadow clip + 100lvb :host prints page 1 only; document print.scss cannot restyle :host. */
@media print {
  :host {
    display: block !important;
    position: static !important;
    overflow: visible !important;
    contain: none !important;
    container-type: normal !important;
    isolation: auto !important;
    block-size: auto !important;
    min-block-size: 0 !important;
    max-block-size: none !important;
    height: auto !important;
  }
  .esc-stack,
  .esc-main,
  .esc-layer {
    display: block !important;
    position: static !important;
    overflow: visible !important;
    contain: none !important;
    block-size: auto !important;
    min-block-size: 0 !important;
    max-block-size: none !important;
    height: auto !important;
  }
  .esc-underlying,
  .esc-overlays {
    display: none !important;
  }
}`})))()}function Te(){return!Ae&&!customElements.get(`env-shell-container`)&&(customElements.define(U,ke),Ae=!0),ke}function Ee(){Te();let e=customElements.get(U);if(e)try{return new e}catch(e){console.warn("[env-shell-container] `new` failed, falling back to createElement",e)}return document.createElement(U)}function De(e){return e instanceof HTMLElement&&e.localName===`env-shell-container`}var U,Oe,ke,Ae;function je(){return(je=e((()=>{we(),D(),U=`env-shell-container`,Oe=document.createElement(`template`),Oe.innerHTML=`
<div class="esc-stack" part="stack">
  <div class="esc-layer esc-underlying" part="underlying">
    <slot name="${O.underlying}"></slot>
  </div>
  <div class="esc-layer esc-main" part="main" data-shell-content role="main">
    <slot></slot>
  </div>
  <div
    class="esc-layer esc-overlays"
    part="overlays"
    data-shell-overlays
    data-env-shell-overlays
  >
    <slot name="${O.overlay}"></slot>
  </div>
</div>`,ke=class extends HTMLElement{#e=!1;get overlayMount(){return this.#t(),this.shadowRoot?.querySelector(`[data-shell-overlays]`)??null}constructor(){super(),this.#t()}connectedCallback(){this.#t()}#t(){if(this.#e&&this.shadowRoot)return;let e=this.shadowRoot??this.attachShadow({mode:`open`});if(e.querySelector(`.esc-stack`)||e.appendChild(Oe.content.cloneNode(!0)),e.adoptedStyleSheets.length===0){let t=new CSSStyleSheet;t.replaceSync(Ce),e.adoptedStyleSheets=[t]}this.#e=!0}},Ae=!1})))()}function Me(e){let t=`[${Ne}]`,n=e.querySelector(t);if(n)return n.style.zIndex||(n.style.zIndex=Pe),n.style.position||(n.style.position=De(e)?`absolute`:`fixed`),n;let r=document.createElement(`div`);return r.setAttribute(Ne,``),r.className=`env-shell-overlays`,r.setAttribute(`data-part`,`env-overlays`),De(e)?(r.slot=O.overlay,r.style.cssText=`position:absolute;inset:0;pointer-events:none;z-index:${Pe};box-sizing:border-box;`,e.appendChild(r),r):(r.style.cssText=`position:fixed;inset:0;pointer-events:none;z-index:${Pe};box-sizing:border-box;`,e.appendChild(r),r)}var Ne,Pe;function Fe(){return(Fe=e((()=>{je(),D(),Ne=`data-env-shell-overlays`,Pe=`2147483600`})))()}function Ie(){return(Ie=e((()=>{C()})))()}function Le(e,t={}){let{x:n=48,y:r=48,w:i=640,h:a=480,z:o=10,demoRole:s}=t,c=matchMedia(`(max-width: 640px)`);return{demoRole:s,title:e,bounds:{x:m(n),y:m(r),w:m(i),h:m(a)},z:m(o),maximizedMobile:u(c.matches),minimized:u(!1),desktopMaximized:u(!1),nativeMode:u(!1),visible:u(!0),isMobileMq:c}}function Re(){return(Re=e((()=>{d(),Object.freeze({w:360,h:240})})))()}function W(e){let t=String(e??``).trim().toLowerCase();t=t.replace(/^#/,``);let n=/^todo:\s*(.*)$/i.exec(t);return n&&(t=String(n[1]??``).trim().toLowerCase()),t=t.replace(/\s+/g,``),t?t===`viewer`||Be.has(t)?G:t:``}function ze(e){return String(e||``).trim().toLowerCase()===G}var G,Be;function Ve(){return(Ve=e((()=>{G=`viewer`,Be=new Set([`markdown`,`markdown-view`,`markdown-viewer`,`reader`,`env-viewer`])})))()}function He(e){return!!(e&&typeof e==`object`&&typeof e.render==`function`)}function K(e,t){let n=e?.lifecycle?.[t];typeof n==`function`&&Promise.resolve(n())}function Ue(e){if(typeof e!=`function`)return!1;try{let t=e.prototype;return!!(t!=null&&typeof HTMLElement<`u`&&HTMLElement.prototype.isPrototypeOf(t))}catch{return!1}}function We(e,t){let n=e.default??e.createView??e.createHomeView;if(!n||typeof n!=`function`)throw Error(`window-frame view-mount: module has no default/createView factory`);let r=Ue(n)?new n(t):n(t);if(He(r)){let e=r,n=e.render(t);if(!(n instanceof HTMLElement))throw Error(`window-frame view-mount: view.render() must return HTMLElement`);return{root:n,view:e}}if(r instanceof HTMLElement)return{root:r};throw Error(`window-frame view-mount: factory did not return View or HTMLElement`)}function Ge(e,t){return e.replaceChildren(t),()=>{t.remove(),e.replaceChildren()}}async function Ke(e,t,n){let r=await e();typeof requestAnimationFrame==`function`&&await new Promise(e=>requestAnimationFrame(()=>e()));let{root:i,view:a}=We(r,n);i.classList.add(`wf-mounted-view`);let o=Ge(t,i);return K(a,`onMount`),K(a,`onShow`),()=>{K(a,`onHide`),K(a,`onUnmount`),o()}}function qe(){try{if(document.documentElement.dataset.cwspNativeShell===`capacitor`)return!0;let e=globalThis.Capacitor;return typeof e?.isNativePlatform==`function`&&!!e.isNativePlatform()}catch{return!1}}function q(e){let t=e?.closest?.(`.env-shell-root`)??e?.closest?.(`env-shell-container`);if(!(t instanceof HTMLElement))return 0;if(Y?.shell===t)return Y.n;let n=t.style.getPropertyValue(`--env-window-z-boost`).trim()||getComputedStyle(t).getPropertyValue(`--env-window-z-boost`).trim(),r=Number.parseInt(n,10),i=Number.isFinite(r)?r:0;return Y={shell:t,n:i},i}function Je(e){let t=e.closest?.(`.env-shell-root`)??e.closest?.(`env-shell-container`)??document.querySelector?.(`.env-shell-root, env-shell-container`);return t instanceof HTMLElement?t:null}function J(e){let t=Je(e);if(!t)return;let n=!!t.querySelector?.(`ui-window[native-mode], ui-window[data-native-active]`);t.toggleAttribute(`data-env-native-task`,n)}function Ye(e,t,n,r,i={}){let{bounds:a,z:o,maximizedMobile:s,minimized:c,desktopMaximized:l,visible:d,isMobileMq:p}=t;t.nativeMode||=u(!!i.startNative);let m=t.nativeMode;i.startNative&&(m.value=!0);let h=document.createElement(`ui-window`);h.setAttribute(`managed`,``),h.className=`env-ui-window`,h.setAttribute(`part`,`window`);{let e=document.documentElement.getAttribute(`data-theme`)||document.documentElement.style.colorScheme||``;(e===`light`||e===`dark`)&&(h.dataset.theme=e,h.style.colorScheme=e)}let g=document.createElement(`span`);g.slot=`title`,g.className=`env-ui-window__title`,g.textContent=t.title,n.slot=`content`,n.classList.add(`env-ui-window__body`),h.append(g,n),e.appendChild(h);let _=String(i?.managedViewKey??``).trim();_&&(h.setAttribute(`data-ui-window-view`,_),h.setAttribute(`data-wf-managed-view`,_));let v=null,y=()=>{i.onChromeChange?.(),J(e)},b=()=>{h.style.right=``,h.style.bottom=``},x=()=>{h.style.left=`0`,h.style.top=`0`,h.style.right=`0`,h.style.bottom=`var(--env-shell-chrome-stack-reserve, 2.5rem)`,h.style.width=`auto`,h.style.height=`auto`,h.style.removeProperty(`--ui-win-width`),h.style.removeProperty(`--ui-win-height`)},S=()=>{h.style.left=`0`,h.style.top=`0`,h.style.right=`0`,h.style.bottom=`0`,h.style.width=`100%`,h.style.height=`100%`,h.style.removeProperty(`--ui-win-width`),h.style.removeProperty(`--ui-win-height`)},C=()=>{let t=!!p.matches,n=q(e),r=(o.value??10)+n;h.style.zIndex=String(r),t&&(l.value&&=!1,!c.value&&!m.value&&!s.value&&(s.value=!0));let i=!!m.value,u=!!c.value,f=!t&&!!l.value&&!i&&!u,g=t&&!i&&!u,_=e.closest?.(`.env-shell-root`)??e.closest?.(`env-shell-container`)??document.querySelector?.(`.env-shell-root, env-shell-container`),v=_ instanceof HTMLElement&&_.hasAttribute(`data-status-overlay`)||document.documentElement.hasAttribute(`data-env-status-overlay`),y=_ instanceof HTMLElement&&_.hasAttribute(`data-standalone`)||document.documentElement.hasAttribute(`data-env-standalone`),C=v&&!i&&!u&&(g||f),w=qe(),T=y&&t&&!i&&!u||w&&t&&!i&&!u;if(h.toggleAttribute(`native-mode`,i&&!u),h.toggleAttribute(`minimized`,u),h.toggleAttribute(`data-mobile-max`,g),h.toggleAttribute(`data-desk-max`,f),h.toggleAttribute(`data-status-gap`,C),h.toggleAttribute(`data-no-titlebar`,T),h.toggleAttribute(`maximized`,!u&&(f||g||i)),u){h.setVisible(!1),J(e);return}if(h.setVisible(!!d.value),!d.value){J(e);return}if(i){S(),J(e);return}if(g){h.style.left=`0`,h.style.top=`0`,h.style.right=`0`,h.style.bottom=`0`,h.style.width=`100%`,h.style.height=`auto`,J(e);return}if(f){x(),J(e);return}b(),h.applyBounds({x:a.x.value,y:a.y.value,w:a.w.value,h:a.h.value,z:r}),J(e)},w=()=>{p.matches&&(m.value||(s.value=!0),l.value&&(l.value=!1,v&&=(a.x.value=v.x,a.y.value=v.y,a.w.value=v.w,a.h.value=v.h,null))),C(),y()};p.matches&&!m.value&&!c.value&&(s.value=!0);let T=f(()=>{C()},[a.x,a.y,a.w,a.h,o,s,c,l,m,d],{triggerImmediately:!0});p.addEventListener(`change`,w);let E=()=>{C(),y()},D=e.closest?.(`.env-shell-root`)??e.closest?.(`env-shell-container`)??document.documentElement;D?.addEventListener?.(`env-chrome-surface`,E);let O=()=>{c.value&&(c.value=!1,d.value=!0),r();let t=q(e),n=(o.value??10)+t;typeof h.bringToFront==`function`?h.bringToFront(n):(h.style.zIndex=String(n),h.toggleAttribute(`data-focused`,!0)),y()},ee=e=>{let t=e.detail;m.value||l.value||s.value||c.value||(typeof t?.x==`number`&&(a.x.value=t.x),typeof t?.y==`number`&&(a.y.value=t.y))},te=e=>{let t=e.detail;m.value||l.value||s.value||c.value||(typeof t?.w==`number`&&(a.w.value=t.w),typeof t?.h==`number`&&(a.h.value=t.h))},k=()=>{m.value&&=!1,l.value&&(l.value=!1,v&&=(a.x.value=v.x,a.y.value=v.y,a.w.value=v.w,a.h.value=v.h,null)),c.value=!0,C(),y()},A=()=>{if(m.value){j();return}if(p.matches){c.value=!1,s.value=!0,C(),y();return}if(c.value&&=!1,l.value){M();return}v={x:a.x.value,y:a.y.value,w:a.w.value,h:a.h.value},l.value=!0,C(),y()},ne=()=>{c.value&&(c.value=!1,d.value=!0),!m.value&&!l.value&&!s.value&&(v={x:a.x.value,y:a.y.value,w:a.w.value,h:a.h.value}),l.value=!1,s.value=!1,m.value=!0,C(),y()},j=()=>{m.value&&(m.value=!1,v&&=(a.x.value=v.x,a.y.value=v.y,a.w.value=v.w,a.h.value=v.h,null),p.matches&&(s.value=!0),C(),y())},M=()=>{if(m.value){j();return}c.value&&(c.value=!1,d.value=!0),p.matches?s.value&&=!1:l.value&&(l.value=!1,v&&=(a.x.value=v.x,a.y.value=v.y,a.w.value=v.w,a.h.value=v.h,null)),C(),y()},N=!1,P=!1,F=t=>{if(t.preventDefault(),!(N||P)){N=!0;try{m.value&&=!1,d.value=!1,i.onClose?.()}catch(e){console.error(`[mount-ui-window] onClose failed`,e)}finally{if(!P){P=!0,T?.(),p.removeEventListener(`change`,w),D?.removeEventListener?.(`env-chrome-surface`,E);try{h.isConnected&&h.remove()}catch{}}J(e)}}},re=0,ie=()=>{let e=typeof performance<`u`?performance.now():Date.now();return e-re<280?!1:(re=e,!0)},ae=e=>{if(!(N||P)&&ie()){if(e===`close`){F(new Event(`window-close`,{cancelable:!0}));return}if(e===`exit-native`){j();return}if(e===`maximize`){m.value||l.value||s.value?M():A();return}c.value?M():k()}},oe=e=>{let t=typeof e.composedPath==`function`?e.composedPath():[];for(let e of t){if(!(e instanceof Element))continue;let t=e.getAttribute?.(`data-ui-win-action`);if(t===`close`||t===`exit-native`||t===`maximize`||t===`minimize`)return t;if(e.matches?.(`.title-close`))return`close`;if(e.matches?.(`.title-exit-native`))return`exit-native`;if(e.matches?.(`.title-maximize`))return`maximize`;if(e.matches?.(`.title-minimize`))return`minimize`}return null},I=e=>{if(N||P||e.defaultPrevented)return;let t=oe(e);t&&(e.preventDefault(),e.stopPropagation(),ae(t))},L=null,R=()=>{let e=h.shadowRoot;if(!e||N||P)return;let t=e.querySelectorAll(`[data-ui-win-action], .title-minimize, .title-maximize, .title-close, .title-exit-native`);for(let e of t){let t=e.getAttribute(`data-ui-win-action`);if(t||(e.classList.contains(`title-close`)?t=`close`:e.classList.contains(`title-exit-native`)?t=`exit-native`:e.classList.contains(`title-maximize`)?t=`maximize`:e.classList.contains(`title-minimize`)&&(t=`minimize`)),!t)continue;e.setAttribute(`data-ui-win-action`,t);let n=t,r=e=>{e.defaultPrevented||(e.preventDefault(),e.stopPropagation(),ae(n))};e.onclick=r,e.onpointerup=e=>{e.button===0&&r(e)}}};if(R(),queueMicrotask(R),requestAnimationFrame(R),typeof MutationObserver<`u`){L=new MutationObserver(()=>R());let e=()=>{h.shadowRoot?L?.observe(h.shadowRoot,{childList:!0,subtree:!0}):requestAnimationFrame(e)};e()}return h.addEventListener(`window-focus`,O),h.addEventListener(`window-move`,ee),h.addEventListener(`window-resize`,te),h.addEventListener(`window-minimize`,k),h.addEventListener(`window-maximize`,A),h.addEventListener(`window-restore`,M),h.addEventListener(`window-native`,ne),h.addEventListener(`window-exit-native`,j),h.addEventListener(`window-close`,F),h.addEventListener(`click`,I),h.addEventListener(`pointerup`,I),()=>{if(!P){P=!0,N=!0,T?.(),L?.disconnect(),L=null,p.removeEventListener(`change`,w),D?.removeEventListener?.(`env-chrome-surface`,E),h.removeEventListener(`window-focus`,O),h.removeEventListener(`window-move`,ee),h.removeEventListener(`window-resize`,te),h.removeEventListener(`window-minimize`,k),h.removeEventListener(`window-maximize`,A),h.removeEventListener(`window-restore`,M),h.removeEventListener(`window-native`,ne),h.removeEventListener(`window-exit-native`,j),h.removeEventListener(`window-close`,F),h.removeEventListener(`click`,I),h.removeEventListener(`pointerup`,I);try{m.value&&=!1,h.isConnected&&h.remove()}catch{}J(e)}}}var Y;function Xe(){return(Xe=e((()=>{d(),p(),ue(),Y=null})))()}function X(e,t){let n=typeof CSS<`u`&&typeof CSS.escape==`function`?CSS.escape(t):t.replace(/\\/g,`\\\\`).replace(/"/g,`\\"`),r=e.querySelector(`:scope > ui-window[data-ui-window-view="${n}"]`)||e.querySelector(`:scope > ui-window[data-wf-managed-view="${n}"]`)||e.querySelector(`:scope > section.wf-frame[data-wf-managed-view="${n}"]`);return r instanceof HTMLElement?r:null}function Ze(e){let t=String(e||``).trim();if(!t)return`browser`;let n=2166136261;for(let e=0;e<t.length;e++)n^=t.charCodeAt(e),n=Math.imul(n,16777619);return`browser:${(n>>>0).toString(36)}`}function Qe(e){try{return new URL(e).hostname.replace(/^www\./i,``)||`Browser`}catch{return`Browser`}}function $e(e){let t=String(e||``).trim().toLowerCase();return t===`browser`||t===`web`||t===`iframe`||t===`web-view`||t===`webview`?`browser`:t}function et(e){let t=String(e||``).trim().toLowerCase();return at[t]?at[t]:t.startsWith(`browser:`)?at.browser:`app-window`}function tt(e){return $e(e)===`browser`?()=>v(()=>import(`./browser-view-BS6Mffes.js`),[],import.meta.url):null}function nt(e){if(!e||typeof e!=`object`)return``;let t=e,n=t.params&&typeof t.params==`object`&&!Array.isArray(t.params)?t.params:{};return String(n.url||n.href||n.src||t.url||t.href||t.src||``).trim()}function Z(e,t){let n=W(e)||String(e||``).trim().toLowerCase(),r=n.startsWith(`browser:`)?`browser`:n;if(t?.[n])return t[n];if(t?.[r])return t[r];if(ot[r])return ot[r];let i=String(e||``).trim();return i?i.charAt(0).toUpperCase()+i.slice(1):`View`}function rt(e,t){let n=document.createElement(`div`);return n.className=`wf-view-placeholder`,n.setAttribute(`part`,`placeholder`),n.innerHTML=`<p class="wf-view-placeholder__title">${Z(e,t)}</p>
<p class="wf-view-placeholder__hint">No window module is registered for this shortcut in environment-shell yet.</p>`,n}function it(e,t={}){let n=m(120),r=new Map,i=!1,a=null;q(e);let o=0,s=()=>{i||(o||=requestAnimationFrame(()=>{o=0,i||t.onTaskingChange?.(c())}))},c=()=>{let n=[];for(let i of r.values())X(e,i.key)&&n.push({id:i.key,title:i.model.title||Z(i.key,t.viewTitles),icon:et(i.key),focused:a===i.key,minimized:!!i.model.minimized.value,visible:!!i.model.visible.value});return n},l=()=>{for(let t of r.values()){let n=X(e,t.key);if(!n)continue;n.toggleAttribute(`data-focused`,!1);let r=n.clearFocused;typeof r==`function`&&r.call(n)}},u=e=>{for(let[t,n]of r)e&&t===e||n.model.nativeMode?.value&&(n.model.nativeMode.value=!1)},d=(t,r)=>{if(a===r&&!t.minimized.value){let t=X(e,r);if(t&&t===e.lastElementChild)return}n.value+=1,t.z.value=n.value,t.minimized.value=!1,t.visible.value=!0,a=r,t.nativeMode?.value&&u(r);let i=X(e,r);if(i){let n=q(e),r=(t.z.value??10)+n;l(),i.style.zIndex=String(r),i.toggleAttribute(`data-focused`,!0);let a=i.bringToFront;typeof a==`function`&&a.call(i,r),i.parentElement===e&&i!==e.lastElementChild&&e.appendChild(i)}s()},f={showMessage:e=>{console.log(`[environment] ${typeof e==`string`?e:String(e??``)}`)}},p=t.overlayMountHost?Me(t.overlayMountHost):null;f.resolveOverlayMountPoint=e=>{if(p)return p;if(t.environmentShellHost){let e=A(t.environmentShellHost);if(e)return e}return k(e??null)};let h=e=>{let n=$e(W(e)||String(e||``).trim().toLowerCase());return t.viewLoaders?.[n]||tt(n)},g=()=>{let i=t.readerWindow;if(!i?.content)return;let o=G,c=r.get(o);if(c&&X(e,o)){d(c.model,o);return}if(c&&!X(e,o)){r.delete(o);try{c.disposeFrame()}catch{}}let l=i.seed||{},u=Le(i.title||Z(o,t.viewTitles),{x:l.x??96,y:l.y??96,w:l.w??420,h:l.h??340,z:l.z??n.value+1});n.value=u.z.value;let f=()=>{};f=Ye(e,u,i.content,()=>d(u,o),{managedViewKey:o,onChromeChange:s,onClose:()=>{let e=r.get(o);if(e){r.delete(o),a===o&&(a=null);try{e.disposeFrame()}catch{}s()}}}),r.set(o,{key:o,model:u,disposeFrame:f}),d(u,o)},_=(e,t)=>{if(i)return;let n=W(String(e||``).trim());if(n=$e(n),!(!n||n===`home`)&&n!==`airpad`){try{let e=document.documentElement.dataset.cwspNativeShell===`capacitor`||!!globalThis.Capacitor?.isNativePlatform?.();if(document.documentElement.dataset.cwspSku===`launcher`&&e){j(n).then(e=>{e||v(n,t)});return}}catch{}v(n,t)}},v=(o,c)=>{if(i)return;let l={...c?.params||{}},p=nt(c);p&&(l.url=p,l.href=p);let m=o===`browser`?String(l.windowKey||``).trim()||Ze(p):o;if(ze(o)&&t.readerWindow?.content){g();return}let _=new Set((t.startNativeViewIds||[]).map(e=>W(String(e||``)))).has(o)||String(c?.native||``)===`1`||String(l.native||``)===`1`,v=r.get(m);if(v&&X(e,m)){if(d(v.model,m),_&&v.model.nativeMode&&(v.model.nativeMode.value=!0,v.model.minimized.value=!1,v.model.visible.value=!0,u(m)),ze(o)){let e=String(l.src||l.source||l.path||``).trim(),t=String(l.filename||l.name||``).trim(),n=String(l.content||``);if(e||n.trim())try{globalThis.dispatchEvent(new CustomEvent(`cwsp:document-open`,{detail:{src:e,filename:t,content:n}}))}catch{}}if(o===`browser`&&p)try{let t=X(e,m),n=t?.querySelector?.(`iframe.wf-browser__frame`),r=t?.querySelector?.(`input.wf-browser__url`);if(n&&n.src!==p&&(n.src=p),r&&(r.value=p),p)try{v.model.title=Qe(p)}catch{}}catch{}return}if(v&&!X(e,m)){v.disposeView?.(),r.delete(m);try{v.disposeFrame()}catch{}}let y=h(o),b=document.createElement(`div`);b.className=`wf-view-host env-ui-window__view-host`,b.setAttribute(`part`,`view-host`);{let e=document.createElement(`p`);e.className=`wf-view-placeholder__hint`,e.style.cssText=`margin:1rem;font:400 .9rem/1.4 system-ui,sans-serif;opacity:.8`,e.textContent=`Loading ${Z(o,t.viewTitles)}…`,b.append(e)}let x=r.size*24,S=Le(o===`browser`&&p?Qe(p):Z(o,t.viewTitles),{x:72+x,y:72+x,w:o===`browser`?720:640,h:o===`browser`?520:480,z:n.value+1});n.value=S.z.value;let C=()=>{};C=Ye(e,S,b,()=>d(S,m),{managedViewKey:m,startNative:_,onChromeChange:s,onClose:()=>{let e=r.get(m);if(e){r.delete(m),a===m&&(a=null);try{e.disposeView?.()}catch{}try{e.disposeFrame()}catch{}s()}}}),_&&(S.nativeMode.value=!0,u(m));let w={key:m,model:S,disposeFrame:C,disposeView:void 0};r.set(m,w),d(S,m);let T={...c||{},shellContext:f};if((o===`browser`&&p||p&&!(T.params&&(T.params.url||T.params.href)))&&(T.params={...T.params||{},url:p,href:p}),!y){b.replaceChildren(rt(o,t.viewTitles));return}Ke(y,b,T).then(e=>{if(i){e();return}let t=r.get(m);t&&(t.disposeView=e),(_||S.nativeMode?.value)&&(S.nativeMode.value=!0,S.minimized.value=!1,S.visible.value=!0,u(m),d(S,m))},e=>{console.error(`[workspace-window-layer] mountViewModule failed for view "${o}"`,e),b.replaceChildren(rt(o,t.viewTitles))})};return f.navigate=(e,t)=>{_(String(e),t)},f.openView=(e,t)=>{_(String(e),t)},{shellContext:f,dispose:()=>{if(!i){i=!0,o&&=(cancelAnimationFrame(o),0);for(let e of r.values())e.disposeView?.(),e.disposeFrame();r.clear(),a=null,s()}},focusWindow:t=>{let n=W(String(t||``)),i=r.get(n);return!i||!X(e,n)?!1:(d(i.model,n),!0)},minimizeWindow:t=>{let n=W(String(t||``)),i=r.get(n);return!i||!X(e,n)?!1:(i.model.nativeMode?.value&&(i.model.nativeMode.value=!1),i.model.desktopMaximized?.value&&(i.model.desktopMaximized.value=!1),i.model.visible.value=!0,i.model.minimized.value=!0,a===n&&(a=null,l()),s(),!0)},minimizeAllWindows:()=>{if(!i){u(null),a=null,l();for(let t of r.values())X(e,t.key)&&(t.model.desktopMaximized?.value&&(t.model.desktopMaximized.value=!1),t.model.visible.value=!0,t.model.minimized.value=!0);s()}},closeWindow:e=>{let t=W(String(e||``)),n=r.get(t);if(!n)return!1;r.delete(t),a===t&&(a=null);try{n.disposeView?.()}catch{}try{n.disposeFrame()}catch{}return s(),!0},blurWindows:()=>{u(null),a=null,l(),s()},closeAllWindows:()=>{if(!i){u(null);for(let e of[...r.values()]){try{e.disposeView?.()}catch{}try{e.disposeFrame()}catch{}}r.clear(),a=null,s()}},enterNative:t=>{let n=W(String(t||``)),i=r.get(n);return!i||!X(e,n)?!1:(u(n),i.model.nativeMode.value=!0,i.model.minimized.value=!1,i.model.visible.value=!0,d(i.model,n),!0)},exitNative:e=>{if(e){let t=W(String(e||``)),n=r.get(t);n?.model.nativeMode&&(n.model.nativeMode.value=!1),s();return}u(null),s()},listWindowTasks:c,getFocusedKey:()=>a}}var at,ot;function st(){return(st=e((()=>{d(),D(),Re(),Ve(),Fe(),Xe(),ae(),_(),at={home:`house`,viewer:`article`,markdown:`article`,browser:`globe`,web:`globe`,explorer:`books`,settings:`gear-six`,apps:`squares-four`,workcenter:`briefcase`,history:`clock-counter-clockwise`,editor:`pencil-simple-line`,network:`wifi-high`,task:`list-checks`,event:`calendar`,bonus:`gift`,person:`address-book`},ot={home:`Home`,viewer:`Markdown`,browser:`Browser`,web:`Browser`,explorer:`Explorer`,settings:`Settings`,apps:`Apps`,workcenter:`Work Center`,history:`History`,editor:`Editor`,network:`Network`,task:`Plan`,event:`Events`,bonus:`Bonuses`,person:`Contacts`}})))()}function ct(e,t=ut){try{localStorage.getItem(t)||localStorage.setItem(t,e)}catch{}}function lt(e,t){let n=oe(),r=F();r&&be();let i,a;if(r)i=document.createElement(`ui-statusbar`),i.className=`env-ui-statusbar`,i.hidden=!0,a=()=>{i.remove()};else{let e=ie(t.shell,t.introHtml,n);i=e.element,a=e.dispose}let o=document.createElement(`div`);o.className=`env-shell-chrome wf-chrome-no-select`;let s;if(t.taskbar){try{let e=R();e&&N(e)}catch{}s=ce({...t.taskbar,device:n}),o.append(s.element,i)}else o.append(i);let c=(e.classList?.contains(`env-shell-root`)?e:null)||e.closest?.(`.env-shell-root`)||e.closest?.(`env-shell-container`)||e;pe(c),globalThis.__ENV_OVERLAY_MOUNT__=Me,Me(c),fe();let l=typeof matchMedia==`function`?matchMedia(`(min-width: 641px) and (not ((pointer: coarse) or (hover: none)))`):null,u=typeof matchMedia==`function`?[`(display-mode: standalone)`,`(display-mode: fullscreen)`,`(display-mode: minimal-ui)`,`(display-mode: browser)`,`(display-mode: window-controls-overlay)`].map(e=>matchMedia(e)):[],d=()=>{let e=!l||l.matches,t=I(),n=se(),r=re({desktop:e,standalone:n,displayMode:t});o.toggleAttribute(`data-desktop`,e),o.toggleAttribute(`data-standalone`,n),o.toggleAttribute(`data-status-overlay`,r),o.dataset.chromeLayout=e?`desktop`:`mobile`,o.dataset.displayMode=t,c.toggleAttribute(`data-standalone`,n),c.toggleAttribute(`data-status-overlay`,r),c.dataset.displayMode=t,c.style.setProperty(`--env-status-inset-top`,r?`max(2rem, env(safe-area-inset-top, 0px))`:`0px`),document.documentElement.toggleAttribute(`data-env-status-overlay`,r),document.documentElement.toggleAttribute(`data-env-standalone`,n);try{c.dispatchEvent(new CustomEvent(`env-chrome-surface`,{bubbles:!0,detail:{statusOverlay:r,standalone:n,displayMode:t,desktop:e}}))}catch{}};d(),l?.addEventListener?.(`change`,d);for(let e of u)e.addEventListener?.(`change`,d);document.addEventListener(`fullscreenchange`,d),document.addEventListener(`webkitfullscreenchange`,d);let f=r?()=>{}:de(c);return De(e)&&(o.slot=O.overlay),e.appendChild(o),{root:o,device:n,statusBar:i,taskbar:s,disposeDevice:()=>{l?.removeEventListener?.(`change`,d);for(let e of u)e.removeEventListener?.(`change`,d);document.removeEventListener(`fullscreenchange`,d),document.removeEventListener(`webkitfullscreenchange`,d),f(),a(),n.dispose(),pe(null)}}}var ut;function dt(){return(dt=e((()=>{P(),Se(),L(),le(),je(),Fe(),D(),M(),me(),ne(),Ie(),st(),Xe(),ut=`rs-wallpaper-image`})))()}function ft(e){pt().set(e)}var Q,pt;function mt(){return(mt=e((()=>{Q=`__CWSP_LAUNCHER_HOME_HOOKS_V1__`,pt=()=>{let e=globalThis;return{get:()=>Q in e?e[Q]:null,set:t=>{e[Q]=t}}}})))()}var ht;function gt(){return(gt=e((()=>{ht=`*,
*::before,
*::after {
    box-sizing: border-box;
}

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
    result: oklch(
        from var(--base-color)
        calc(l + (0.985 - l) * var(--to-white) + (0.16 - l) * var(--to-black))
        calc(c * var(--chroma-scale))
        h
    );
}

/* --- Material-inspired tokens via --u2-color-mod (names kept; dark baseline) --- */
.wf-demo-root {
    isolation: isolate;
    min-block-size: 100dvb;
    /* WHY: Prefer wallpaper/JS --color-primary; purple only as cold-start fallback. */
    --wf-md-primary: var(--color-primary, #5a7fff);
    --base-color: var(--color-primary, var(--wf-md-primary));
    --wf-md-on-primary: --u2-color-mod(var(--wf-md-primary), 920);
    --wf-md-surface: --u2-color-mod(var(--wf-md-primary), 940);
    --wf-md-surf-container-low: --u2-color-mod(var(--wf-md-primary), 900);
    --wf-md-surf-container: --u2-color-mod(var(--wf-md-primary), 860);
    --wf-md-surf-container-high: --u2-color-mod(var(--wf-md-primary), 820);
    --wf-md-outline-variant: color-mix(in oklab, --u2-color-mod(var(--wf-md-primary), 100) 12%, transparent);
    --wf-md-on-surface: --u2-color-mod(var(--wf-md-primary), 100);
    --wf-md-on-surface-variant: --u2-color-mod(var(--wf-md-primary), 280);
    --wf-md-error: #ef4444;
}

/*
 * WHY: CRX / env-shell host also has \`.wf-demo-root\` for tokens.
 * The demo desk scrim is unlayered and would paint over \`ui-canvas\` wallpaper
 * (root.scss kill lives in \`@layer layout\` and loses). Keep fill on bare demo only.
 */
.wf-demo-root:not(.env-shell-root) {
    background: radial-gradient(
        1200px 700px at 12% -8%,
        color-mix(in oklch, var(--wf-md-primary) 18%, --u2-color-mod(var(--wf-md-primary), 940)),
        --u2-color-mod(var(--wf-md-primary), 960)
    );
    overflow: clip;
}

.env-shell-root.wf-demo-root {
    background: transparent;
    overflow: visible;
}

/* Chrome: no accidental text selection during drag — content opt-in selectable */
.wf-chrome-no-select {
    user-select: none;
    -webkit-user-select: none;
}

.wf-content-select {
    user-select: text;
    -webkit-user-select: text;
}

.wf-frame {
    /* Subtle outer radius — was 1.75rem (~28px). */
    --wf-shape-xl: 0.375rem;

    position: fixed;
    display: flex;
    flex-direction: column;
    border-radius: var(--wf-shape-xl);
    border: 1px solid var(--wf-md-outline-variant);
    overflow: clip;
    color: var(--wf-md-on-surface);
    background: var(--wf-md-surf-container-low);
    /* Elevation 3 */
    box-shadow:
        0 2px 1px rgb(0 0 0 / 22%),
        0 4px 3px rgb(0 0 0 / 16%),
        0 8px 10px rgb(0 0 0 / 12%),
        0 24px 32px rgb(0 0 0 / 32%);
}

.wf-frame.wf-hidden {
    display: none !important;
}

.wf-frame.wf-minimized .wf-frame-body {
    display: none !important;
}

.wf-frame.wf-minimized {
    block-size: auto !important;
    box-shadow:
        0 1px 2px rgb(0 0 0 / 22%),
        0 2px 4px rgb(0 0 0 / 14%);
}

.wf-titlebar {
    flex: none;
    display: flex;
    flex-direction: row;
    align-items: stretch;
    gap: 0.25rem;
    padding-inline: 0.5rem 0.25rem;
    padding-block: 0.125rem;
    /* WHY: Body uses \`transform: translateZ(0)\` + scrollers; without z-index, painted body can sit above chrome and swallow hits. */
    position: relative;
    z-index: 3;
    pointer-events: auto;
    background: linear-gradient(
        165deg,
        color-mix(in oklch, var(--wf-md-surf-container-high) 88%, transparent),
        var(--wf-md-surf-container)
    );
    border-block-end: 1px solid var(--wf-md-outline-variant);
}

.wf-titlebar-drag {
    flex: 1;
    min-inline-size: 0;
    min-block-size: 2.5rem;
    display: flex;
    align-items: center;
    padding-inline-start: 0.35rem;
    cursor: grab;
    touch-action: none;
}

.wf-titlebar-drag:active {
    cursor: grabbing;
}

.wf-titlebar-actions {
    flex: none;
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 0.125rem;
}

.wf-title {
    font: 550 0.875rem / 1.2 "Google Sans Flex", ui-sans-serif, system-ui, sans-serif;
    letter-spacing: 0.015em;
    color: var(--wf-md-on-surface);
    opacity: 0.96;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.wf-chrome-btn {
    inline-size: 2.25rem;
    block-size: 2.25rem;
    flex: none;
    display: grid;
    place-items: center;
    padding: 0;
    margin: 0;
    border: none;
    border-radius: 0.5rem;
    background: transparent;
    color: var(--wf-md-on-surface-variant);
    cursor: pointer;
    outline: none;
    transition:
        background 0.14s ease,
        color 0.14s ease;
}

.wf-chrome-btn:hover {
    background: color-mix(in oklch, var(--wf-md-on-surface) 10%, transparent);
    color: var(--wf-md-on-surface);
}

.wf-chrome-btn:focus-visible {
    box-shadow: 0 0 0 2px color-mix(in oklch, var(--wf-md-primary) 56%, transparent);
}

.wf-chrome-btn_close:hover {
    background: color-mix(in oklch, var(--wf-md-error) 22%, transparent);
    color: var(--wf-md-on-surface);
}

.wf-frame-body {
    flex: 1;
    min-block-size: 0;
    min-inline-size: 0;
    overflow: hidden;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    position: relative;
    z-index: 0;
    /* WHY: Establishes a containing block so AirPad \`position: fixed\` toolbars clip to this frame, not the browser viewport. */
    transform: translateZ(0);
    background: var(--wf-md-surface);
    border-end-start-radius: max(0px, calc(var(--wf-shape-xl) - 1px));
    border-end-end-radius: max(0px, calc(var(--wf-shape-xl) - 1px));
}

/* Slot for routed \`modules/views/*\` roots */
.wf-frame-slot.wf-mounted-view,
.wf-frame-slot > .wf-mounted-view {
    flex: 1;
    min-block-size: 0;
    overflow: auto;
}

.wf-mobile-max.wf-mobile {
    border-radius: 0;
}

.wf-mobile-max.wf-mobile .wf-frame-body {
    border-radius: 0;
}

.wf-resize {
    position: absolute;
    inset-inline-end: 4px;
    inset-block-end: 4px;
    /* WHY: Larger hit target than the visible glyph — small grips feel “broken” on HiDPI / trackpads. */
    inline-size: 22px;
    block-size: 22px;
    cursor: se-resize;
    /* WHY: \`.wf-frame-body\` uses \`transform\` + fills the flex column; without z-index the body layer often wins hit-testing in the corner. */
    z-index: 4;
    pointer-events: auto;
    background:
        linear-gradient(135deg, transparent 53%, color-mix(in oklch, var(--wf-md-on-surface) 52%, transparent) 53%) 100% 100% /
        11px 11px no-repeat;
    touch-action: none;
}

.wf-explorer {
    flex: 1;
    overflow: auto;
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding-inline: 2px;
}

.wf-exp-row {
    appearance: none;
    border-radius: 0.75rem;
    border: 1px solid transparent;
    background: color-mix(in oklch, var(--wf-md-on-surface) 8%, transparent);
    color: inherit;
    font: inherit;
    padding: 8px;
    cursor: pointer;
    text-align: start;
}

.wf-exp-row:hover {
    border-color: var(--wf-md-outline-variant);
}

.wf-exp-row_sel {
    outline: 1px solid color-mix(in oklch, var(--wf-md-primary) 55%, transparent);
}

.wf-viewer {
    flex: 1;
    min-block-size: 0;
}

.wf-md-body {
    block-size: 100%;
    overflow: auto;
    padding: 12px;
    margin: 0;
    font-family:
        "Google Sans Flex",
        ui-sans-serif,
        system-ui,
        sans-serif;
    font-size: 13px;
    line-height: 1.52;
}

.wf-md h1,
.wf-md h2,
.wf-md h3 {
    margin: 0 0 0.5rem;
}

.wf-md h1 {
    font-size: 1.25rem;
}

.wf-md p {
    margin: 0.35rem 0;
}

.wf-md pre {
    background: color-mix(in oklch, var(--wf-md-on-surface) 8%, transparent);
    border-radius: 0.75rem;
    padding: 0.75rem;
    overflow: auto;
}

.wf-md code {
    font-family:
        ui-monospace,
        "Google Sans Mono",
        monospace;
}

.wf-md ul {
    margin: 0.25rem;
    padding-inline-start: 1.35rem;
}

.wf-md-err {
    color: color-mix(in oklch, var(--wf-md-error) 85%, transparent);
}

.wf-hud {
    position: fixed;
    inset-block-end: 4px;
    inset-inline-start: 4px;
    max-inline-size: min(920px, 96vw);
    margin: 0;
    padding: 6px 10px;
    font: 12px ui-sans-serif, system-ui, sans-serif;
    color: var(--wf-md-on-surface-variant);
    opacity: 0.88;
}

.wf-hud p {
    margin: 0.15rem;
}

/*
 * WHY: On screen \`.wf-frame\` is \`position: fixed\` with pixel bounds; markdown/viewer print CSS uses
 * \`position: static\` + \`overflow: visible\` on inner hosts so document flow escapes the fixed box
 * and can paint over hidden shell/workspace layers. For print, reset the frame to normal flow so
 * content stays one continuous page stack inside the sheet margins.
 */
@media print {
    .wf-demo-root {
        overflow: visible !important;
        min-block-size: 0 !important;
        background: #fff !important;
    }

    .wf-frame {
        position: static !important;
        inset: auto !important;
        left: auto !important;
        top: auto !important;
        right: auto !important;
        bottom: auto !important;
        inline-size: 100% !important;
        max-inline-size: 100% !important;
        block-size: auto !important;
        min-block-size: 0 !important;
        max-block-size: none !important;
        border: none !important;
        box-shadow: none !important;
        border-radius: 0 !important;
        overflow: visible !important;
        break-inside: avoid;
        z-index: auto !important;
        color: #000 !important;
        background: transparent !important;
    }

    .wf-titlebar,
    .wf-resize {
        display: none !important;
    }

    .wf-frame-body {
        transform: none !important;
        overflow: visible !important;
        flex: none !important;
        flex-basis: auto !important;
        min-block-size: 0 !important;
        block-size: auto !important;
        max-block-size: none !important;
        background: transparent !important;
        border-radius: 0 !important;
    }

    .wf-hud {
        display: none !important;
    }
}
`})))()}var _t;function vt(){return(vt=e((()=>{_t=`/* environment-shell — default layout + chrome for wallpaper / home / window-frame hosts.
   Import in app entry: \`import "environment-shell/scss/main.scss"\` (or relative path). */
/*
 * Filename: root.scss
 * FullPath: modules/shells/environment-shell/src/scss/root.scss
 * Change date and time: 09.00.00_02.08.2026
 * Reason for changes: Follow html color-scheme / --color-* SoT; drop prefers-color-scheme palette fork.
 */
/* WHY: Layer wallpaper under workspace; wf-demo scrim must not paint over canvas. */
/*
 * WHY: Unlayered — \`.wf-demo-root\` scrim in wf-demo.css is unlayered.
 * A layered kill here used to lose, so the Material radial fill covered wallpaper.
 */
.env-shell-root.wf-demo-root {
  background: transparent;
  overflow: visible;
}

/* WHY: marketing \`.view-home\` fill is in \`@layer components\`; unlayered here keeps wallpaper visible. */
.view-home.env-home-workspace,
.view-home.view-home--grid {
  background: transparent !important;
}

@layer layout {
  .env-shell-root {
    /*
     * INVARIANT: Inherit used color-scheme from Theme.ts / Quick Settings on <html>
     * so light-dark() tokens (veela) and surfaces flip with data-theme — not OS media alone.
     */
    color-scheme: inherit;
    /* WHY: TaskBar.scss (fl.ui) cannot @use env-shell Sass vars across package realpath. */
    --env-z-shell-chrome: 2147483000;
    --env-z-shell-overlays: 2147483600;
    /*
     * Top status overlay / window title spacer (mobile browser + fullscreen; 0 in standalone).
     * JS (\`mountEnvironmentChrome\`) may override when overlay is off.
     */
    --env-status-inset-top: 0px;
    /*
     * NOTE: \`--env-status-fg\` / \`--env-launcher-fg*\` color defaults are owned by veela
     * \`core/_tokens.scss\`. \`--env-launcher-fg*\` aliases \`--wallpaper-contrast-color\`
     * (WallpaperTheme + statusbar luma). Do not fork hex here.
     */
    /*
     * Bridge only — values come from veela \`_tokens.scss\` (-theme-unified).
     * No hex / mod fallbacks: @property + tokens load before shell chrome.
     */
    --base-color-neutralized: color-mix(in oklab, var(--base-color) 60%, gray);
    --wf-md-seed: var(--base-color);
    --wf-md-primary: var(--color-primary);
    --wf-md-surface: var(--color-surface);
    --wf-md-surf-container-low: var(--color-surface-container-low);
    --wf-md-surf-container: var(--color-surface-container);
    --wf-md-surf-container-high: var(--color-surface-container-high);
    --wf-md-outline-variant: var(--color-outline-variant);
    --wf-md-on-surface: var(--color-on-surface);
    --wf-md-on-surface-variant: var(--color-on-surface-variant);
    --on-surface-color: var(--color-on-surface);
    --on-surface-variant: var(--color-on-surface-variant);
    position: relative;
    isolation: isolate;
    min-block-size: var(--lv-height, 100lvb);
    block-size: var(--lv-height, 100lvb);
    /* Sync with shadow \`:host\`: do not clip \`position:fixed\` descendants (overlay slot context menus). */
    overflow: visible;
    /* Added to \`mountWindowFrame\` z-index so \`.wf-frame\` stacks above the home layer. */
    --env-window-z-boost: 400;
    /*
     * WHY: Home / App Menu still clear the floating Home FAB with this reserve.
     * Open mobile windows do not — they go full-bleed and the FAB overlays.
     */
    --env-mobile-dock-reserve: 3rem;
    --env-shell-chrome-stack-reserve: var(--env-mobile-dock-reserve);
  }
  @media (min-width: 641px) {
    .env-shell-root {
      --env-shell-chrome-stack-reserve: 2.5rem;
      --env-mobile-dock-reserve: 0px;
    }
  }
  .env-shell-root {
    /* Overlay mode: top inset for home launcher under transparent statusband. */
  }
  .env-shell-root[data-status-overlay] {
    --env-status-inset-top: max(2rem, env(safe-area-inset-top, 0px));
    /* Overlay status sits on the photo — wallpaper ink, not app theme / OS scheme. */
    --env-status-fg: var(--wallpaper-contrast-color);
    --env-status-fg-muted: color-mix(in oklab, var(--wallpaper-contrast-color) 78%, transparent);
  }
  .env-shell-root[data-standalone] {
    --env-status-inset-top: 0px;
  }
  @media screen and (pointer: fine) and ((min-width: 768px) or (hover: hover)) {
    .env-shell-root {
      --env-status-inset-top: max(3rem, env(safe-area-inset-top, 0px));
    }
  }
  .env-shell-wallpaper {
    position: fixed;
    inset: 0;
    z-index: 0;
    pointer-events: none;
  }
  /* Fullscreen / overlay: wallpaper stays edge-to-edge under chrome + windows. */
  .env-shell-root[data-status-overlay] .env-shell-wallpaper,
  .env-shell-root:fullscreen .env-shell-wallpaper,
  .env-shell-root:-webkit-full-screen .env-shell-wallpaper {
    inset: 0;
  }
  /*
   * WHY: Speed-dial / explorer context menus mount here; must beat \`.env-shell-chrome\`
   * (taskbar + mobile Home nav) which uses \`$z-shell-chrome\`.
   */
  .env-shell-overlays,
  [data-env-shell-overlays] {
    position: absolute;
    inset: 0;
    z-index: 2147483600;
    pointer-events: none;
    box-sizing: border-box;
    background-color: transparent !important;
  }
  .env-shell-workspace {
    position: relative;
    z-index: 1;
    min-block-size: var(--lv-height, 100lvb);
    block-size: var(--lv-height, 100lvb);
    inline-size: 100%;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    background-color: transparent !important;
  }
}
/*
 * WHY: Env views live in light DOM under ui-window — force view tokens from concrete
 * html[data-theme] surfaces so Markdown/Settings never keep OS-dark light-dark() sides.
 */
@layer overrides {
  html[data-theme=light] .env-shell-root,
  html[data-theme=light] .env-shell-root ui-window,
  html[data-theme=light] .env-shell-root .view-viewer,
  html[data-theme=light] .env-shell-root .view-settings {
    color-scheme: light only;
  }
  html[data-theme=light] .env-shell-root .view-viewer {
    --view-bg: var(--color-container-high);
    --view-fg: var(--color-on-surface);
    --view-code-bg: var(--color-surface-container-low);
    background-color: var(--view-bg);
    color: var(--view-fg);
    color: contrast-color(var(--view-bg));
  }
  html[data-theme=light] {
    /* App Menu tiles sit on chrome — keep theme ink. Speed-dial glyphs use wallpaper contrast below. */
  }
  html[data-theme=light] .env-shell-root .env-shell-app-menu__tile-icon .ui-ws-item-icon-mask,
  html[data-theme=light] .env-shell-root .env-shell-app-menu__drag-ghost-icon .ui-ws-item-icon-mask {
    color-scheme: light only;
    --icon-color: --u2-color-mod(var(--base-color, var(--color-primary, #5a9ec8)), 900);
    color: var(--icon-color);
  }
  html[data-theme=dark] .env-shell-root,
  html[data-theme=dark] .env-shell-root ui-window,
  html[data-theme=dark] .env-shell-root .view-viewer,
  html[data-theme=dark] .env-shell-root .view-settings {
    color-scheme: dark only;
  }
  html[data-theme=dark] .env-shell-root .view-viewer {
    --view-bg: var(--color-surface);
    --view-fg: var(--color-on-surface);
    --view-code-bg: var(--color-surface-container);
    background-color: var(--view-bg);
    color: var(--view-fg);
    color: contrast-color(var(--view-bg));
  }
  html[data-theme=dark] .env-shell-root .env-shell-app-menu__tile-icon .ui-ws-item-icon-mask,
  html[data-theme=dark] .env-shell-root .env-shell-app-menu__drag-ghost-icon .ui-ws-item-icon-mask {
    color-scheme: dark only;
    --icon-color: --u2-color-mod(var(--base-color, var(--color-primary, #5a9ec8)), 100);
    color: var(--icon-color);
  }
}
/* WHY: View roots fill the frame body edge-to-edge; inner spacing lives in each view (e.g. settings). */
.wf-view-host,
.wf-view-placeholder {
  box-sizing: border-box;
  min-block-size: 0;
  min-inline-size: 0;
  flex: 1 1 0%;
  margin: 0;
  padding: 0;
  /* WHY: Outer clip; inner views (AirPad, explorer) own scroll regions — avoids nested “whole window” scroll. */
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-self: stretch;
}

.wf-view-host > .wf-mounted-view {
  flex: 1 1 0%;
  min-block-size: 0;
  min-inline-size: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  align-self: stretch;
}

.wf-view-placeholder__title {
  font: 600 1rem/1.3 system-ui, sans-serif;
  margin: 0 0 0.5rem;
}

.wf-view-placeholder__hint {
  margin: 0;
  opacity: 0.75;
  font: 400 0.875rem/1.4 system-ui, sans-serif;
}

/* WHY: Window frames participate in the same workspace stack as home; border tweak only (z comes from model + \`--env-window-z-boost\`). */
.env-shell-workspace .wf-frame,
.env-shell-workspace ui-window.env-ui-window {
  border-color: color-mix(in oklch, var(--wf-md-outline-variant, oklch(100% 0.02 280deg / 0.12)) 130%, transparent);
}

/* WHY: ui-window content slot must fill chrome body for mounted CWSP views. */
.env-shell-workspace ui-window.env-ui-window {
  --env-window-z-boost: var(--env-window-z-boost, 0);
  /* WHY: stay above home launcher hit-testing; chrome/title drag needs auto. */
  pointer-events: auto;
}

/* DWM maximize: fill workspace with inset (inline geometry also set in mount-ui-window). */
.env-shell-workspace ui-window.env-ui-window[data-desk-max],
.env-shell-workspace ui-window.env-ui-window[maximized]:not([data-mobile-max]) {
  box-sizing: border-box;
}

.env-shell-workspace .env-ui-window__body,
.env-shell-workspace .env-ui-window__view-host,
.env-shell-workspace .wf-mounted-view {
  box-sizing: border-box;
  inline-size: 100%;
  block-size: 100%;
  min-block-size: 0;
  min-inline-size: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  margin: 0;
  padding: 0;
  /*
   * WHY: ui-window host can carry inline \`pointer-events: none\` (setVisible) or inherit it
   * from a constructed sheet; the view-host chain must stay hit-targetable so settings tabs,
   * explorer rows, etc. remain clickable when embedded.
   */
  pointer-events: auto;
}

/* Home launcher fills workspace under floating windows. */
.env-shell-home-mount,
.env-shell-workspace .view-home,
.env-shell-workspace .env-home-workspace,
.env-shell-workspace .speed-dial-root {
  flex: 1 1 auto;
  min-block-size: 0;
  min-inline-size: 0;
  inline-size: 100%;
  block-size: 100%;
}

/*
 * WHY: \`.wf-frame-body\` / ui-window content may composite above the title row and swallow
 * pointer events (settings drag + chrome clicks). Keep chrome above the body.
 */
.env-shell-workspace .wf-frame .wf-titlebar,
.env-shell-workspace ui-window.env-ui-window::part(title-handler) {
  position: relative;
  z-index: 50;
  pointer-events: auto;
}

.env-shell-workspace .wf-frame .wf-frame-body,
.env-shell-workspace ui-window.env-ui-window::part(content-handler) {
  position: relative;
  z-index: 0;
  /* Mirror Windows2: trap fixed/absolute slotted paint inside the body. */
  transform: translateZ(0);
  contain: paint;
}

.env-shell-workspace .wf-frame .wf-resize,
.env-shell-workspace ui-window.env-ui-window::part(resizer) {
  z-index: 4;
  pointer-events: auto;
}

/* Print unwrap for DWM + focused markdown lives in \`print.scss\`. */
/*
 * FIND:print
 * WHY: Environment DWM clips markdown; Chrome print + \`display: contents\` on
 * custom hosts (env-shell-container / ui-window) yields blank pages.
 * INVARIANT: Keep real boxes; print the viewer window only (stamp / focus / max).
 */
@media print {
  :is(html, body):has(.env-shell-root),
  :is(html, body):has(env-shell-container),
  :is(html, body):has([data-shell=environment]),
  :is(html, body):has(cw-shell-environment) {
    position: static !important;
    inset: auto !important;
    overflow: visible !important;
    contain: none !important;
    container-type: normal !important;
    content-visibility: visible !important;
    display: block !important;
    inline-size: 100% !important;
    block-size: auto !important;
    min-block-size: 0 !important;
    max-block-size: none !important;
    height: auto !important;
    min-height: 0 !important;
    max-height: none !important;
    background: #fff !important;
    color: #000 !important;
  }
  /*
   * WHY: CRX/u2re.space \`index.html\` sets \`#app { display: contents }\` for minimal-shell.
   * That flatten + slotted CEs prints empty in Chromium. Environment keeps a box.
   */
  :is(html, body):has(.env-shell-root) #app,
  :is(html, body):has(env-shell-container) #app,
  :is(html, body):has([data-shell=environment]) #app,
  :is(html, body):has(cw-shell-environment) #app,
  #app:has(.env-shell-root),
  #app:has(env-shell-container),
  #app:has(ui-window.env-ui-window),
  html[data-print-markdown] #app,
  :is(html, body):has(.env-shell-root) [data-app-layer-root],
  :is(html, body):has(env-shell-container) [data-app-layer-root],
  :is(html, body):has([data-shell=environment]) [data-app-layer-root],
  :is(html, body):has(cw-shell-environment) [data-app-layer-root],
  :is(html, body):has(.env-shell-root) [data-app-layer=shell],
  :is(html, body):has(env-shell-container) [data-app-layer=shell],
  cw-shell-environment,
  env-shell-container,
  .env-shell-root {
    display: block !important;
    position: static !important;
    inset: auto !important;
    overflow: visible !important;
    contain: none !important;
    container-type: normal !important;
    content-visibility: visible !important;
    inline-size: 100% !important;
    block-size: auto !important;
    min-block-size: 0 !important;
    max-block-size: none !important;
    height: auto !important;
    max-height: none !important;
    isolation: auto !important;
  }
  .env-shell-chrome,
  .env-shell-wallpaper,
  .env-shell-overlays,
  [data-env-shell-overlays],
  .env-shell-app-menu,
  cw-app-dock,
  cw-status-bar,
  [data-window-dock],
  [data-window-status],
  [data-app-layer=canvas],
  [data-app-layer=orient],
  [data-app-layer=overlay]:not(:has(ui-window.env-ui-window, .wf-frame)) {
    display: none !important;
  }
  .env-shell-home-mount,
  .env-shell-workspace .view-home,
  .env-shell-workspace .env-home-workspace,
  .env-shell-workspace .speed-dial-root {
    display: none !important;
  }
  /* Hide other apps; never drop the markdown frame (stamp may miss across shadows). */
  .env-shell-workspace ui-window.env-ui-window:not([data-print-window]):not([data-ui-window-view=viewer]):not([data-ui-window-view=markdown]),
  .env-shell-workspace .wf-frame:not([data-print-window]):not([data-ui-window-view=viewer]):not([data-wf-managed-view=viewer]) {
    display: none !important;
  }
  .env-shell-workspace ui-window.env-ui-window[minimized],
  .env-shell-workspace .wf-frame[minimized] {
    display: none !important;
  }
  .env-shell-workspace {
    display: block !important;
    position: static !important;
    overflow: visible !important;
    contain: none !important;
    container-type: normal !important;
    block-size: auto !important;
    min-block-size: 0 !important;
    max-block-size: none !important;
    height: auto !important;
    inline-size: 100% !important;
  }
  .env-shell-workspace ui-window.env-ui-window[data-print-window],
  .env-shell-workspace ui-window.env-ui-window[data-ui-window-view=viewer],
  .env-shell-workspace ui-window.env-ui-window[data-ui-window-view=markdown],
  .env-shell-workspace ui-window.env-ui-window[data-focused]:has(cw-view-viewer, [data-view-id=viewer], .view-viewer),
  .env-shell-workspace ui-window.env-ui-window[maximized]:has(cw-view-viewer, [data-view-id=viewer], .view-viewer),
  .env-shell-workspace ui-window.env-ui-window[data-desk-max]:has(cw-view-viewer, [data-view-id=viewer], .view-viewer),
  .env-shell-workspace .wf-frame[data-print-window],
  .env-shell-workspace .wf-frame[data-ui-window-view=viewer],
  .env-shell-workspace .wf-frame[data-focused]:has(cw-view-viewer, [data-view-id=viewer], .view-viewer) {
    position: static !important;
    inset: auto !important;
    left: auto !important;
    top: auto !important;
    right: auto !important;
    bottom: auto !important;
    display: block !important;
    inline-size: 100% !important;
    max-inline-size: 100% !important;
    block-size: auto !important;
    min-block-size: 0 !important;
    max-block-size: none !important;
    height: auto !important;
    overflow: visible !important;
    contain: none !important;
    container-type: normal !important;
    box-shadow: none !important;
    border: none !important;
    border-radius: 0 !important;
    background: #fff !important;
    color: #000 !important;
    z-index: auto !important;
    transform: none !important;
  }
  .env-shell-workspace ui-window.env-ui-window::part(title-handler),
  .env-shell-workspace ui-window.env-ui-window::part(resizer),
  .env-shell-workspace ui-window.env-ui-window::part(footer-handler),
  .env-shell-workspace .wf-frame .wf-titlebar,
  .env-shell-workspace .wf-frame .wf-resize {
    display: none !important;
  }
  .env-shell-workspace ui-window.env-ui-window::part(window-container),
  .env-shell-workspace ui-window.env-ui-window::part(content-handler),
  .env-shell-workspace .wf-frame .wf-frame-body,
  .env-shell-workspace .env-ui-window__body,
  .env-shell-workspace .env-ui-window__view-host,
  .env-shell-workspace .wf-view-host,
  .env-shell-workspace .wf-view-host > .wf-mounted-view,
  .env-shell-workspace .wf-mounted-view {
    display: block !important;
    position: static !important;
    transform: none !important;
    contain: none !important;
    container-type: normal !important;
    overflow: visible !important;
    flex: none !important;
    align-self: stretch !important;
    inline-size: 100% !important;
    block-size: auto !important;
    min-block-size: 0 !important;
    max-block-size: none !important;
    height: auto !important;
    background: #fff !important;
    color: #000 !important;
  }
  .env-shell-workspace .view-viewer,
  .env-shell-workspace .cw-view-viewer-shell,
  .env-shell-workspace cw-view-viewer,
  .env-shell-workspace [data-cw-view-host=true][data-view-id=viewer],
  .env-shell-workspace [data-render-target],
  .env-shell-workspace .markdown-body,
  .env-shell-workspace .result-content {
    display: block !important;
    visibility: visible !important;
    opacity: 1 !important;
    overflow: visible !important;
    contain: none !important;
    container-type: normal !important;
    content-visibility: visible !important;
    position: static !important;
    inset: auto !important;
    block-size: auto !important;
    max-block-size: none !important;
    min-block-size: 0 !important;
    height: auto !important;
  }
}
/* Workspace is the flex stack for home + floating \`.wf-frame\`; padding/safe-area live in \`home-view\` SCSS. */
.env-shell-workspace {
  padding: 0;
  background-color: transparent !important;
}

/* Canonical document status chrome lives in Veela. */
/*
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
}
/* Canonical taskbar host styles live in Veela. */
/*
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
}
/* Canonical mobile process-switcher styles live in Veela. */
@layer components {
  /* Long-press process switcher sheet above the nav bar. */
  .env-shell-navbar__switcher {
    --navbar-switcher-background: light-dark(color-mix(in oklch, #f2f2f7 96%, transparent), color-mix(in oklch, #1c1c1e 96%, transparent));
    position: fixed;
    inset-inline: 0.75rem;
    /*inset-block-end: calc(100% + 0.4rem);*/
    inset-block-end: 4rem;
    z-index: 5;
    max-block-size: min(50dvb, 20rem);
    overflow: auto;
    padding: 0.35rem;
    border-radius: 0.85rem;
    background: var(--navbar-switcher-background);
    color: contrast-color(var(--navbar-switcher-background));
    --icon-color: contrast-color(var(--navbar-switcher-background));
    border: 1px solid light-dark(color-mix(in oklch, #fff 12%, transparent), color-mix(in oklch, #1c1c1e 12%, transparent));
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.45);
    backdrop-filter: blur(18px);
    -webkit-backdrop-filter: blur(18px);
    inline-size: calc(100cqi - 1rem);
    place-self: center;
  }
  .env-shell-navbar__switcher[hidden] {
    display: none !important;
  }
  .env-shell-navbar__switcher-list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
  }
  .env-shell-navbar__switcher-empty {
    padding: 0.75rem 0.85rem;
    font: 400 0.8125rem/1.3 system-ui, sans-serif;
    opacity: 0.72;
    text-align: center;
  }
  .env-shell-navbar__switcher-row {
    display: flex;
    flex-direction: row;
    align-items: stretch;
    gap: 0.2rem;
  }
  .env-shell-navbar__switcher-item {
    appearance: none;
    display: flex;
    flex: 1 1 auto;
    flex-direction: row;
    align-items: center;
    gap: 0.65rem;
    min-inline-size: 0;
    margin: 0;
    padding: 0.65rem 0.75rem;
    border: 0;
    border-radius: 0.65rem;
    background: transparent;
    color: inherit;
    font: 500 0.875rem/1.25 system-ui, sans-serif;
    text-align: start;
    cursor: pointer;
  }
  .env-shell-navbar__switcher-label {
    flex: 1 1 auto;
    min-inline-size: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .env-shell-navbar__switcher-item:hover,
  .env-shell-navbar__switcher-item:focus-visible {
    outline: none;
    background: light-dark(color-mix(in oklch, #fff 10%, transparent), color-mix(in oklch, #1c1c1e 10%, transparent));
  }
  .env-shell-navbar__switcher-item[data-active] {
    background: light-dark(color-mix(in oklch, #60cdff 18%, transparent), color-mix(in oklch, #60cdff 18%, transparent));
  }
  .env-shell-navbar__switcher-item[data-minimized] {
    opacity: 0.78;
  }
  .env-shell-navbar__switcher-item ui-icon {
    flex: 0 0 auto;
    --icon-size: 1.25rem;
    inline-size: 1.25rem;
    block-size: 1.25rem;
  }
  .env-shell-navbar__switcher-close {
    appearance: none;
    flex: 0 0 auto;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    margin: 0;
    padding: 0;
    inline-size: 2.5rem;
    min-inline-size: 2.5rem;
    border: 0;
    border-radius: 0.65rem;
    background: transparent;
    color: inherit;
    cursor: pointer;
  }
  .env-shell-navbar__switcher-close:hover,
  .env-shell-navbar__switcher-close:focus-visible {
    outline: none;
    background: light-dark(color-mix(in oklch, #ff6b6b 22%, transparent), color-mix(in oklch, #ff6b6b 22%, transparent));
    color: #ffb4b4;
  }
  .env-shell-navbar__switcher-close ui-icon {
    --icon-size: 1.1rem;
    inline-size: 1.1rem;
    block-size: 1.1rem;
  }
}
/*
 * Device tray placement:
 * - Desktop footer: tray lives in the Win10 taskbar; hide the statusbar footer copy.
 * - Mobile overlay statusbar: show footer tray (time L / icons R).
 * - Mobile Home dock: no Wi‑Fi/battery (overlay status owns that when visible).
 */
@media (min-width: 641px) {
  .env-shell-chrome[data-desktop]:not([data-status-overlay]) .env-device-tray--footer {
    display: none !important;
  }
}
.env-shell-chrome[data-desktop]:not([data-status-overlay]) .env-device-tray--footer {
  display: none !important;
}

.env-shell-chrome:not([data-desktop]) .env-shell-taskbar__tray-host,
.env-shell-chrome:not([data-desktop]) .env-device-tray--taskbar {
  display: none !important;
}

/* Without overlay (standalone), hide footer tray too. */
.env-shell-chrome:not([data-desktop]):not([data-status-overlay]) .env-device-tray--footer {
  display: none !important;
}

/* Canonical reusable chrome comes from Veela; this shell keeps only composition order. */
/*
 * Filename: _launcher-icon-mask.scss
 * FullPath: modules/projects/fl.ui/src/ui/speed-dial/_launcher-icon-mask.scss
 * Change date and time: 19.25.00_19.08.2026
 * Reason for changes: Shared Android icon mask — optical fill + wallpaper ink tokens.
 */
@layer components {
  /*
   * Native app glyph as a tinted silhouette (same ink as SpeedDial \`ui-icon\`).
   * Host sets \`--launcher-app-icon-url\`; theme sets \`--icon-color\` on env-shell-root.
   */
  .ui-ws-item-icon-mask[data-launcher-icon] {
    display: block;
    box-sizing: border-box;
    inline-size: var(--launcher-icon-size, var(--icon-size, 2.2rem));
    block-size: var(--launcher-icon-size, var(--icon-size, 2.2rem));
    flex-shrink: 0;
    background-color: var(--icon-color, var(--sd-figure-ink, currentColor));
    color: var(--icon-color, var(--sd-figure-ink, currentColor));
    -webkit-mask-image: var(--launcher-app-icon-url);
    mask-image: var(--launcher-app-icon-url);
    /* WHY: adaptive icons ship with outer safe-zone padding — scale up for ui-icon visual weight. */
    -webkit-mask-size: calc(100% * var(--launcher-icon-mask-scale, 1.1));
    mask-size: calc(100% * var(--launcher-icon-mask-scale, 1.1));
    -webkit-mask-repeat: no-repeat;
    mask-repeat: no-repeat;
    -webkit-mask-position: center;
    mask-position: center;
    -webkit-mask-origin: center;
    mask-origin: center;
    filter: drop-shadow(0 1px 2px color-mix(in oklab, #000 14%, transparent));
  }
}
@layer components {
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
}
/* COMPAT: Extension / embed hosts may set \`data-env-crx="1"\` and extend in their bundle. */
.env-shell-root[data-env-crx="1"] {
  isolation: isolate;
}

/*
 * Filename: capacitor-native.scss
 * FullPath: modules/projects/subsystem/shells/environment/scss/capacitor-native.scss
 * Change date and time: 23.09.35_23.08.2026
 * Reason for changes: Status inset fill matches tabs / explorer chrome (\`--color-surface-container\`).
 * FIND:theme-color
 */
html[data-cwsp-native-shell=capacitor],
html[data-cwsp-native-shell=capacitor] body {
  background: transparent;
  --cwsp-native-safe-top: var(--env-native-safe-top, env(safe-area-inset-top, 0px));
  --cwsp-native-safe-bottom: var(--env-native-safe-bottom, env(safe-area-inset-bottom, 0px));
}

.env-shell-root[data-capacitor-native],
html[data-cwsp-native-shell=capacitor] .env-shell-root {
  /* System status bar is OS-owned — hide FL-UI footer/overlay status band. */
}
.env-shell-root[data-capacitor-native] .env-ui-statusbar,
.env-shell-root[data-capacitor-native] ui-statusbar.env-ui-statusbar,
html[data-cwsp-native-shell=capacitor] .env-shell-root .env-ui-statusbar,
html[data-cwsp-native-shell=capacitor] .env-shell-root ui-statusbar.env-ui-statusbar {
  display: none !important;
}
.env-shell-root[data-capacitor-native] .env-shell-chrome[data-status-overlay],
html[data-cwsp-native-shell=capacitor] .env-shell-root .env-shell-chrome[data-status-overlay] {
  --env-status-inset-top: 0px;
}
.env-shell-root[data-capacitor-native],
html[data-cwsp-native-shell=capacitor] .env-shell-root {
  --env-status-inset-top: 0px;
  /*
   * Mobile managed windows: flat full-bleed panel above Home dock (no DWM chrome gap).
   * Title spacer is suppressed via mount-ui-window \`data-no-titlebar\` on Capacitor mobile.
   */
}
.env-shell-root[data-capacitor-native] .env-shell-workspace > ui-window.env-ui-window[managed][data-mobile-max]:not([minimized]),
html[data-cwsp-native-shell=capacitor] .env-shell-root .env-shell-workspace > ui-window.env-ui-window[managed][data-mobile-max]:not([minimized]) {
  --ui-win-radius: 0;
  box-shadow: none;
  border-radius: 0;
  /* WHY: status inset sits on this fill — must match tabs / explorer chrome, not wallpaper. */
  background: var(--color-surface-container, var(--ui-win-titlebar-bg, Canvas));
}
.env-shell-root[data-capacitor-native],
html[data-cwsp-native-shell=capacitor] .env-shell-root {
  /*
   * Flat mobile windows (\`data-no-titlebar\`): one inset on the slotted body — covers settings tabs,
   * markdown toolbar, explorer toolbar without per-view duplication.
   */
}
.env-shell-root[data-capacitor-native] .env-shell-workspace ui-window.env-ui-window[managed][data-no-titlebar]:not([minimized]) > .env-ui-window__body,
html[data-cwsp-native-shell=capacitor] .env-shell-root .env-shell-workspace ui-window.env-ui-window[managed][data-no-titlebar]:not([minimized]) > .env-ui-window__body {
  padding-block-start: var(--cwsp-native-safe-top);
  /* WHY: bottom inset is the OS 3-button / gesture pad — do not reserve it again. */
  padding-block-end: 0;
  box-sizing: border-box;
  background: var(--color-surface-container, var(--sv-surface-2, var(--ui-win-titlebar-bg, Canvas)));
}
.env-shell-root[data-capacitor-native],
html[data-cwsp-native-shell=capacitor] .env-shell-root {
  /*
   * Explorer view chain lives in ui-window light DOM (slotted \`.env-ui-window__body\`).
   * Shadow \`.content-handler\` rules cannot be targeted from here — stretch slotted body + descendants.
   */
}
.env-shell-root[data-capacitor-native] .env-shell-workspace ui-window.env-ui-window[managed]:not([minimized]) > .env-ui-window__body,
.env-shell-root[data-capacitor-native] .env-shell-workspace ui-window.env-ui-window[managed]:not([minimized]) .env-ui-window__view-host,
.env-shell-root[data-capacitor-native] .env-shell-workspace ui-window.env-ui-window[managed]:not([minimized]) .wf-mounted-view.view-explorer,
.env-shell-root[data-capacitor-native] .env-shell-workspace ui-window.env-ui-window[managed]:not([minimized]) .view-explorer,
.env-shell-root[data-capacitor-native] .env-shell-workspace ui-window.env-ui-window[managed]:not([minimized]) .view-explorer__content,
html[data-cwsp-native-shell=capacitor] .env-shell-root .env-shell-workspace ui-window.env-ui-window[managed]:not([minimized]) > .env-ui-window__body,
html[data-cwsp-native-shell=capacitor] .env-shell-root .env-shell-workspace ui-window.env-ui-window[managed]:not([minimized]) .env-ui-window__view-host,
html[data-cwsp-native-shell=capacitor] .env-shell-root .env-shell-workspace ui-window.env-ui-window[managed]:not([minimized]) .wf-mounted-view.view-explorer,
html[data-cwsp-native-shell=capacitor] .env-shell-root .env-shell-workspace ui-window.env-ui-window[managed]:not([minimized]) .view-explorer,
html[data-cwsp-native-shell=capacitor] .env-shell-root .env-shell-workspace ui-window.env-ui-window[managed]:not([minimized]) .view-explorer__content {
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  align-self: stretch;
  min-block-size: 0;
  min-inline-size: 0;
  block-size: 100%;
  inline-size: 100%;
  overflow: hidden;
  box-sizing: border-box;
}
.env-shell-root[data-capacitor-native] .env-shell-workspace ui-window.env-ui-window[managed]:not([minimized]) .view-explorer,
html[data-cwsp-native-shell=capacitor] .env-shell-root .env-shell-workspace ui-window.env-ui-window[managed]:not([minimized]) .view-explorer {
  font-family: var(--font-family, var(--explorer-font-sans, system-ui, sans-serif));
  font-size: 0.875rem;
  line-height: 1.5;
  background: var(--color-surface-container, var(--color-surface, var(--view-bg, light-dark(#f7f8fc, #1a1d24))));
  color: var(--color-on-surface, var(--view-fg, light-dark(#1a1c1f, #e8eaed)));
  border: none;
  border-radius: 0;
}
.env-shell-root[data-capacitor-native] .env-shell-workspace ui-window.env-ui-window[managed]:not([minimized]) .view-explorer ui-file-manager,
html[data-cwsp-native-shell=capacitor] .env-shell-root .env-shell-workspace ui-window.env-ui-window[managed]:not([minimized]) .view-explorer ui-file-manager {
  flex: 1 1 auto;
  min-block-size: 0;
  min-inline-size: 0;
  block-size: 100%;
  inline-size: 100%;
  padding-block-end: 0;
  box-sizing: border-box;
}
.env-shell-root[data-capacitor-native],
html[data-cwsp-native-shell=capacitor] .env-shell-root {
  /*
   * Markdown viewer (\`cw-view-viewer\`): flex-fill only — top/bottom inset comes from \`.env-ui-window__body\`.
   */
}
.env-shell-root[data-capacitor-native] .env-shell-workspace ui-window.env-ui-window[managed]:not([minimized]) cw-view-viewer[data-cw-view-host],
.env-shell-root[data-capacitor-native] .env-shell-workspace ui-window.env-ui-window[managed]:not([minimized]) cw-view-viewer[data-cw-view-host] .cw-view-viewer-shell,
html[data-cwsp-native-shell=capacitor] .env-shell-root .env-shell-workspace ui-window.env-ui-window[managed]:not([minimized]) cw-view-viewer[data-cw-view-host],
html[data-cwsp-native-shell=capacitor] .env-shell-root .env-shell-workspace ui-window.env-ui-window[managed]:not([minimized]) cw-view-viewer[data-cw-view-host] .cw-view-viewer-shell {
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  align-self: stretch;
  min-block-size: 0;
  min-inline-size: 0;
  block-size: 100%;
  inline-size: 100%;
  overflow: hidden;
  box-sizing: border-box;
}
.env-shell-root[data-capacitor-native] .env-shell-workspace ui-window.env-ui-window[managed]:not([minimized]) cw-view-viewer[data-cw-view-host] .view-viewer,
html[data-cwsp-native-shell=capacitor] .env-shell-root .env-shell-workspace ui-window.env-ui-window[managed]:not([minimized]) cw-view-viewer[data-cw-view-host] .view-viewer {
  flex: 1 1 auto;
  min-block-size: 0;
  min-inline-size: 0;
  block-size: 100%;
  inline-size: 100%;
  overflow: hidden;
  box-sizing: border-box;
}
.env-shell-root[data-capacitor-native],
html[data-cwsp-native-shell=capacitor] .env-shell-root {
  /* Coarse pointer: slightly taller list affordance (tokens pierce ui-file-manager shadow). */
}
@media screen and (pointer: coarse) and (hover: none) {
  .env-shell-root[data-capacitor-native] .env-shell-workspace ui-window.env-ui-window[managed] .view-explorer,
  html[data-cwsp-native-shell=capacitor] .env-shell-root .env-shell-workspace ui-window.env-ui-window[managed] .view-explorer {
    --explorer-row-height: 3rem;
  }
}`})))()}function yt(){try{if(document.documentElement.dataset.cwspNativeShell===`capacitor`)return!0;let e=globalThis.Capacitor;return typeof e?.isNativePlatform==`function`&&!!e.isNativePlatform()}catch{return!1}}function $(){try{let e=new URLSearchParams(globalThis.location?.search||``);if(e.get(`native`)!==`1`&&e.get(`native`)!==`true`)return[];let t=(e.get(`view`)||``).trim().toLowerCase(),n=String(globalThis.location?.pathname||``).replace(/^\/+|\/+$/g,``).toLowerCase(),r=n.match(/^(cwsp|markdown|kvm)\/(.+)$/);r?.[2]&&(n=r[2]);let i=n.split(`/`)[0]||``,a=((i&&i!==`home`?i:t)||`explorer`).split(`/`)[0]||`explorer`;return!a||a===`home`?[`explorer`]:[a===`markdown`?`viewer`:a]}catch{return[]}}function bt(e){let t=e||{};return t.native===1||t.native===`1`||t.native===!0||t.params?.native===`1`||t.params?.native===`true`}function xt(e,t){if(!$().includes(e)&&!bt(t))return t||{};let n={...t||{}};return n.native=`1`,n.params={...n.params||{},native:`1`},n}async function St(){try{let e=await v(()=>import(`./launcher-state-Hmo44Wup.js`).then(e=>(e.d(),e.p)),[],import.meta.url),t=e.speedDialItems;if(!t||typeof t.findIndex!=`function`)return;let n=!1;for(let e=t.length-1;e>=0;e--){let r=t[e],i=String(r?.meta?.view||``).toLowerCase(),a=String(r?.id||``).toLowerCase();(i===`airpad`||a.includes(`airpad`))&&(t.splice(e,1),n=!0)}n&&e.persistSpeedDialItems?.()}catch(e){console.warn(`[EnvironmentShell] speed-dial seed skipped`,e)}}function Ct(e){return new Et}var wt,Tt,Et;function Dt(){return(Dt=e((()=>{d(),o(),E(),C(),i(),ee(),D(),g(),b(),dt(),mt(),gt(),vt(),_(),Te(),wt={network:()=>v(()=>import(`./src-BtpQJ0Mc.js`),[],import.meta.url),settings:()=>v(()=>import(`./src-D9Ti3osG.js`),[],import.meta.url),explorer:()=>v(()=>import(`./_cwsp-disabled-entry_view-explorer-CUvWHUlh.js`),[],import.meta.url),viewer:()=>v(()=>import(`./_cwsp-disabled-entry_view-viewer-eo9jCha0.js`),[],import.meta.url),markdown:()=>v(()=>import(`./_cwsp-disabled-entry_view-viewer-eo9jCha0.js`),[],import.meta.url),history:()=>v(()=>import(`./src-UwdncBKI.js`),[],import.meta.url),workcenter:()=>v(()=>import(`./_cwsp-disabled-entry_view-workcenter-Dzgnpgn9.js`),[],import.meta.url),editor:()=>v(()=>import(`./_cwsp-disabled-entry_view-editor-fs8j1brL.js`),[],import.meta.url),home:()=>v(()=>import(`./_cwsp-disabled-entry_view-home-DPCToH21.js`),[],import.meta.url)},Tt=[`home`,`network`,`settings`,`explorer`,`viewer`,`history`,`workcenter`,`editor`],Et=class extends te{id=`environment`;name=`Environment`;layout={hasSidebar:!1,hasToolbar:!1,hasTabs:!1,supportsMultiView:!0,supportsWindowing:!0};workspaceEl=null;homeMountEl=null;windowLayer=null;chromeDispose=null;wallpaperLifecycleDispose=null;homeUnmount=null;shellActivityDispose=null;focusedTaskId=l(`home`);setFocusedTaskId=null;syncWindowTasks=null;navEcho=l(``);mqLabel=l(`desktop`);_monoNativeBoot=!1;_pendingHomeMount=null;createLayout(){return document.createElement(`div`)}getStylesheet(){return _t}async mount(e){if(this.mounted){console.warn(`[${this.id}] Shell already mounted`);return}this.container=e,ct(`/assets/wallpaper.jpg`),Te();try{await n(ht),t(ht)}catch(e){console.warn(`[EnvironmentShell] wf-demo tokens failed`,e)}let i=this.getStylesheet();if(i)try{await n(i),t(i)}catch(e){console.warn(`[EnvironmentShell] env shell styles failed`,e)}try{T()}catch{}try{document.documentElement.dataset.cwspSurface=`environment`}catch{}let o=Ee();o.className=`env-shell-root wf-demo-root`,o.setAttribute(`data-shell`,`environment`),o.setAttribute(`data-shell-system`,`task-tab`),o.style.gridColumn=`content-column`,o.style.gridRow=`content-row`,o.style.alignSelf=`stretch`,o.style.justifySelf=`stretch`,o.style.minInlineSize=`0`,o.style.minBlockSize=`0`,o.style.inlineSize=`100%`,o.style.blockSize=`100%`,o.style.pointerEvents=`auto`;let s=document.createElement(`div`);s.slot=O.underlying,s.className=`env-shell-wallpaper`,s.setAttribute(`data-env-wallpaper`,``);let c=document.createElement(`div`);c.className=`env-shell-workspace`,c.setAttribute(`data-shell-content`,``);let u=document.createElement(`div`);u.className=`env-shell-home-mount`,u.style.display=`flex`,u.style.flex=`1 1 auto`,u.style.flexDirection=`column`,u.style.alignSelf=`stretch`,u.style.minHeight=`0`,u.style.minWidth=`0`,c.appendChild(u),o.append(s,c),e.replaceChildren(o),this.rootElement=o,this.workspaceEl=c,this.homeMountEl=u,this.contentContainer=c,this.overlayContainer=o.overlayMount??o.shadowRoot?.querySelector?.(`[data-shell-overlays]`)??null,this.mounted=!0,this.shellActivityDispose=h(this.id);let d=yt();d&&(o.dataset.capacitorNative=``,document.documentElement.dataset.cwspNativeShell=document.documentElement.dataset.cwspNativeShell||`capacitor`);try{S(),d&&ct(`/assets/wallpaper.jpg`),x(s);let e=()=>{if(document.visibilityState===`visible`)try{w()}catch{}};window.addEventListener(`pageshow`,e),document.addEventListener(`visibilitychange`,e),this.wallpaperLifecycleDispose=()=>{window.removeEventListener(`pageshow`,e),document.removeEventListener(`visibilitychange`,e)}}catch(e){console.warn(`[EnvironmentShell] wallpaper init failed`,e)}let f={};for(let e of Tt){if(e===`home`||!y(e)&&e!==`viewer`)continue;let t=wt[e];t&&(f[e]=t)}f.viewer&&(f.markdown=f.viewer);let p=matchMedia(`(max-width: 640px)`);this.mqLabel.value=p.matches?`mobile`:`desktop`,p.addEventListener(`change`,()=>{this.mqLabel.value=p.matches?`mobile`:`desktop`});let m=lt(o,{shell:{selectedPath:l(``),viewerStatus:l(``),navEcho:this.navEcho,mqLabel:this.mqLabel},introHtml:`<p><strong>CWSP environment</strong> — Speed Dial / desktop launcher. Views open in <code>ui-window</code>.</p>`,taskbar:{focusedTaskId:this.focusedTaskId,onHome:()=>this.focusHome(),onViewer:()=>{this.openInWindow(`viewer`)},onWindowTask:e=>{this.openInWindow(e)},onMinimizeWindow:e=>{let t=String(e||``).trim().toLowerCase();t&&this.windowLayer?.minimizeWindow?.(t)&&(this.setFocusedTaskId?.(`home`),this.focusedTaskId.value=`home`)},onCloseWindow:e=>{let t=String(e||``).trim().toLowerCase();t&&(this.windowLayer?.closeWindow?.(t),String(this.focusedTaskId.value||``)===t&&(this.setFocusedTaskId?.(`home`),this.focusedTaskId.value=`home`))}}});this.setFocusedTaskId=m.taskbar?.setFocusedTaskId??null,this.syncWindowTasks=m.taskbar?.syncWindowTasks??null,(document.documentElement.dataset.cwspShellRole===`launcher`||globalThis.__RS_SHELL_ROLE__===`launcher`)&&ft({navigateHome:()=>this.focusHome(),openAppMenu:()=>m.taskbar?.openAppMenu?.(),openAppMenuPage:()=>m.taskbar?.openAppMenuPage?.()??m.taskbar?.appMenu?.openPage?.(),closeAppMenu:()=>m.taskbar?.appMenu?.close(),isAppMenuOpen:()=>!!m.taskbar?.appMenu?.isOpen(),tryConsumeBack:()=>r()?a()!=null:m.taskbar?.isSwitcherOpen?.()?(m.taskbar.closeSwitcher?.(),!0):!1}),this.chromeDispose=()=>{m.disposeDevice(),m.taskbar?.dispose?.(),m.root.remove()};let g=$();this.windowLayer=it(c,{overlayMountHost:o,environmentShellHost:o,viewLoaders:f,startNativeViewIds:g,viewTitles:{network:`Network`,settings:`Settings`,explorer:`Explorer`,viewer:`Markdown`,browser:`Browser`,history:`History`,workcenter:`Work Center`,editor:`Editor`},onTaskingChange:e=>{this.syncWindowTasks?.(e);let t=e.find(e=>e.focused);t&&this.setFocusedTaskId?.(t.id)}});let _={...this.windowLayer.shellContext,navigate:(e,t)=>{this.navEcho.value=`shell.navigate("${e}")`,this.routeView(String(e),t)},openView:(e,t)=>{this.navEcho.value=`shell.openView("${e}")`,this.routeView(String(e),t)},showMessage:e=>{this.showMessage(typeof e==`string`?e:String(e??``))}};if(St(),g.length>0){for(let e of g)this.openInWindow(e,{native:`1`,params:{native:`1`}});this._monoNativeBoot=!0,this._pendingHomeMount={homeMount:u,shellContext:{shellContext:_}}}else this.mountHomeDesktop(u,_)}mountHomeDesktop(e,t){Ke(()=>v(()=>import(`./_cwsp-disabled-entry_view-home-DPCToH21.js`),[],import.meta.url),e,{shellContext:t}).then(e=>{this.homeUnmount=e}).catch(t=>{console.warn(`[EnvironmentShell] home-view failed`,t),e.innerHTML=`<p style="color:#eee;padding:1rem;font-family:system-ui">Home view failed to load.</p>`})}ensureHomeMounted(){let e=this._pendingHomeMount;!e||this.homeUnmount||(this._pendingHomeMount=null,this._monoNativeBoot=!1,this.mountHomeDesktop(e.homeMount,e.shellContext.shellContext))}syncLauncherHomeAddressBar(){if(!(typeof location>`u`||typeof history>`u`))try{let e=new URLSearchParams(location.search||``);e.set(`shell`,this.id),e.delete(`native`),e.delete(`view`);let t=e.toString()?`?${e.toString()}`:``,n=location.pathname||`/`,r=n.replace(/^\/+|\/+$/g,``).split(`/`)[0]?.toLowerCase()||``;new Set([`settings`,`explorer`,`viewer`,`markdown`,`network`,`history`,`workcenter`,`editor`]).has(r)&&(n=`/`);let i=`${n}${t}`;`${location.pathname}${location.search}`!==i&&history.replaceState({viewId:`home`,params:Object.fromEntries(e)},``,i)}catch{}}focusHome(){if(this.ensureHomeMounted(),typeof this.windowLayer?.minimizeAllWindows==`function`)this.windowLayer.minimizeAllWindows();else{for(let e of this.windowLayer?.listWindowTasks?.()??[])this.windowLayer?.minimizeWindow?.(e.id);this.windowLayer?.blurWindows?.()}this.setFocusedTaskId?.(`home`),this.focusedTaskId.value=`home`,this.currentView.value=`home`,this.syncLauncherHomeAddressBar();try{w()}catch{}}openInWindow(e,t){let n=String(e||``).trim().toLowerCase();if(!n||n===`airpad`)return;let r=xt(n,t);if(this.windowLayer?.shellContext.openView?.(n,r),bt(r)){let e=()=>{this.windowLayer?.enterNative?.(n),this.preserveNativeDeepLink(n)};e(),requestAnimationFrame(e),setTimeout(e,0)}this.setFocusedTaskId?.(n===`markdown`?`viewer`:n),this.currentView.value=n}preserveNativeDeepLink(e){if(!(typeof location>`u`||typeof history>`u`))try{let t=String(e||``).trim().toLowerCase();if(!t||t===`home`)return;let n=new URLSearchParams(location.search||``);n.set(`shell`,this.id),n.set(`native`,`1`),n.set(`view`,t);let r=`${`/${t}`}?${n.toString()}`;`${location.pathname}${location.search}${location.hash||``}`!==r&&history.replaceState({viewId:t,params:Object.fromEntries(n)},``,r)}catch{}}async routeView(e,t){let n=String(e||``).trim().toLowerCase();if(!(!n||n===`airpad`)){if(n===`home`){this.focusHome();return}this.openInWindow(n,t)}}async navigate(e,t,n){let r=String(e||`home`).toLowerCase();if(r===`airpad`){this.showMessage(`AirPad view is disabled in environment shell`);return}if(r===`home`){let e=$();if(e.length){for(let n of e)this.openInWindow(n,{native:`1`,params:{native:`1`,...t||{}}});return}this.focusHome();return}let i={};try{i=Object.fromEntries(new URLSearchParams(location.search||``))}catch{i={}}let a={...i,...t||{}},o={params:a};(a.native===`1`||a.native===`true`||$().includes(r))&&(o.native=`1`,o.params={...a,native:`1`}),this.openInWindow(r,o)}unmount(){try{this.homeUnmount?.()}catch{}this.homeUnmount=null;try{this.windowLayer?.dispose()}catch{}this.windowLayer=null;try{this.chromeDispose?.()}catch{}this.chromeDispose=null;try{this.shellActivityDispose?.()}catch{}this.shellActivityDispose=null;try{this.wallpaperLifecycleDispose?.()}catch{}if(this.wallpaperLifecycleDispose=null,(document.documentElement.dataset.cwspShellRole===`launcher`||globalThis.__RS_SHELL_ROLE__===`launcher`)&&ft(null),this.mounted&&this.container&&this.rootElement)try{this.container.contains(this.rootElement)&&this.rootElement.remove()}catch{}this.rootElement=null,this.contentContainer=null,this.overlayContainer=null,this.workspaceEl=null,this.homeMountEl=null,this.container=null,this.mounted=!1}}})))()}export{Ct as n,Dt as r,Et as t};