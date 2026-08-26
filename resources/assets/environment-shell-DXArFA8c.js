import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{A as t,k as n,t as r}from"./src-C7QuTtnr.js";import{_ as i,d as a,g as o,u as s}from"./registry-Q3cayRgr.js";import{n as c,t as l}from"./preload-helper-DcjHEl26.js";import{a as u,t as d}from"./cws-bridge-CJBOA0Wb.js";import{et as f,t as p,tt as m}from"./src-DpSa8Erd.js";import{i as h,n as g,t as _}from"./object-DpwBpfvO.js";import{a as v,n as y,o as b,t as x}from"./image-DPhA3Yo2.js";import{i as S,s as C}from"./icon-BI41b7Mj.js";import{_ as w,g as T,n as ee,t as te,v as ne,y as E}from"./shells-BDG-l7Rw.js";import{F as re,I as D,N as O,P as k}from"./launcher-state-CTBiV1a1.js";import{_ as A,a as j,b as M,c as N,d as P,f as F,g as ie,h as ae,i as oe,l as I,m as L,n as R,o as se,p as ce,r as le,s as ue,t as de,u as fe,v as pe,x as me,y as he}from"./src-B76F_VGC2.js";function ge(){if(typeof document>`u`||!document.body)return{top:0,bottom:0};let e=document.createElement(`div`);e.style.cssText=`position:fixed;top:0;left:0;padding-top:env(safe-area-inset-top);padding-bottom:env(safe-area-inset-bottom);visibility:hidden;pointer-events:none;`,document.body.appendChild(e);let t=getComputedStyle(e),n=Number.parseFloat(t.paddingTop)||0,r=Number.parseFloat(t.paddingBottom)||0;return e.remove(),{top:n,bottom:r}}function _e(){try{if(!/android/i.test(navigator.userAgent))return 0}catch{return 0}return 28}function ve(e,t){V=Math.max(0,Math.round(e)),H=Math.max(0,Math.round(t));let n=`${V}px`,r=`${H}px`;document.documentElement.style.setProperty(z,n),document.documentElement.style.setProperty(B,r),document.documentElement.toggleAttribute(`data-capacitor-native`,!0);for(let e of document.querySelectorAll(`.env-shell-root, env-shell-container`))e instanceof HTMLElement&&(e.style.setProperty(z,n),e.style.setProperty(B,r),e.toggleAttribute(`data-capacitor-native`,!0))}function ye(){if(V<=0&&H<=0)return;let e=`${V}px`,t=`${H}px`;for(let n of document.querySelectorAll(`.env-shell-root, env-shell-container`))n instanceof HTMLElement&&n.style.getPropertyValue(z)!==e&&(n.style.setProperty(z,e),n.style.setProperty(B,t),n.toggleAttribute(`data-capacitor-native`,!0))}async function be(){let e=0;try{let t=await d.getShellInfo();e=Number(t.statusBarHeightCss)||0}catch{}let t=ge();return e=Math.max(e,t.top),e<=0&&(e=_e()),{top:e,bottom:0}}async function xe(){if(!F())return;if(Se){ye();return}Se=!0;let e=async()=>{let{top:e,bottom:t}=await be();ve(e,t)};await e(),window.addEventListener(`resize`,()=>void e()),window.visualViewport?.addEventListener(`resize`,()=>void e()),document.addEventListener(`orientationchange`,()=>void e()),ye(),globalThis.setTimeout?.(ye,400)}var z,B,V,H,Se;function Ce(){return(Ce=e((()=>{u(),P(),z=`--env-native-safe-top`,B=`--env-native-safe-bottom`,V=0,H=0,Se=!1})))()}var we;function Te(){return(Te=e((()=>{we=`/**
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
}`})))()}function Ee(){return!je&&!customElements.get(`env-shell-container`)&&(customElements.define(U,Ae),je=!0),Ae}function De(){Ee();let e=customElements.get(U);if(e)try{return new e}catch(e){console.warn("[env-shell-container] `new` failed, falling back to createElement",e)}return document.createElement(U)}function Oe(e){return e instanceof HTMLElement&&e.localName===`env-shell-container`}var U,ke,Ae,je;function Me(){return(Me=e((()=>{Te(),w(),U=`env-shell-container`,ke=document.createElement(`template`),ke.innerHTML=`
<div class="esc-stack" part="stack">
  <div class="esc-layer esc-underlying" part="underlying">
    <slot name="${T.underlying}"></slot>
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
    <slot name="${T.overlay}"></slot>
  </div>
</div>`,Ae=class extends HTMLElement{#e=!1;get overlayMount(){return this.#t(),this.shadowRoot?.querySelector(`[data-shell-overlays]`)??null}constructor(){super(),this.#t()}connectedCallback(){this.#t()}#t(){if(this.#e&&this.shadowRoot)return;let e=this.shadowRoot??this.attachShadow({mode:`open`});if(e.querySelector(`.esc-stack`)||e.appendChild(ke.content.cloneNode(!0)),e.adoptedStyleSheets.length===0){let t=new CSSStyleSheet;t.replaceSync(we),e.adoptedStyleSheets=[t]}this.#e=!0}},je=!1})))()}function Ne(e){let t=`[${Pe}]`,n=e.querySelector(t);if(n)return n.style.zIndex||(n.style.zIndex=W),n.style.position||(n.style.position=Oe(e)?`absolute`:`fixed`),n;let r=document.createElement(`div`);return r.setAttribute(Pe,``),r.className=`env-shell-overlays`,r.setAttribute(`data-part`,`env-overlays`),Oe(e)?(r.slot=T.overlay,r.style.cssText=`position:absolute;inset:0;pointer-events:none;z-index:${W};box-sizing:border-box;`,e.appendChild(r),r):(r.style.cssText=`position:fixed;inset:0;pointer-events:none;z-index:${W};box-sizing:border-box;`,e.appendChild(r),r)}var Pe,W;function Fe(){return(Fe=e((()=>{Me(),w(),Pe=`data-env-shell-overlays`,W=`2147483600`})))()}function Ie(){return(Ie=e((()=>{v()})))()}function Le(e,t={}){let{x:n=48,y:r=48,w:i=640,h:a=480,z:o=10,demoRole:s}=t,c=matchMedia(`(max-width: 640px)`);return{demoRole:s,title:e,bounds:{x:k(n),y:k(r),w:k(i),h:k(a)},z:k(o),maximizedMobile:O(c.matches),minimized:O(!1),desktopMaximized:O(!1),nativeMode:O(!1),visible:O(!0),isMobileMq:c}}function Re(){return(Re=e((()=>{D(),Object.freeze({w:360,h:240})})))()}function G(e){let t=String(e??``).trim().toLowerCase();t=t.replace(/^#/,``);let n=/^todo:\s*(.*)$/i.exec(t);return n&&(t=String(n[1]??``).trim().toLowerCase()),t=t.replace(/\s+/g,``),t?t===`viewer`||Be.has(t)?K:t:``}function ze(e){return String(e||``).trim().toLowerCase()===K}var K,Be;function Ve(){return(Ve=e((()=>{K=`viewer`,Be=new Set([`markdown`,`markdown-view`,`markdown-viewer`,`reader`,`env-viewer`])})))()}function He(e){return!!(e&&typeof e==`object`&&typeof e.render==`function`)}function q(e,t){let n=e?.lifecycle?.[t];typeof n==`function`&&Promise.resolve(n())}function Ue(e){if(typeof e!=`function`)return!1;try{let t=e.prototype;return!!(t!=null&&typeof HTMLElement<`u`&&HTMLElement.prototype.isPrototypeOf(t))}catch{return!1}}function We(e,t){let n=e.default??e.createView??e.createHomeView;if(!n||typeof n!=`function`)throw Error(`window-frame view-mount: module has no default/createView factory`);let r=Ue(n)?new n(t):n(t);if(He(r)){let e=r,n=e.render(t);if(!(n instanceof HTMLElement))throw Error(`window-frame view-mount: view.render() must return HTMLElement`);return{root:n,view:e}}if(r instanceof HTMLElement)return{root:r};throw Error(`window-frame view-mount: factory did not return View or HTMLElement`)}function Ge(e,t){return e.replaceChildren(t),()=>{t.remove(),e.replaceChildren()}}async function Ke(e,t,n){let r=await e();typeof requestAnimationFrame==`function`&&await new Promise(e=>requestAnimationFrame(()=>e()));let{root:i,view:a}=We(r,n);i.classList.add(`wf-mounted-view`);let o=Ge(t,i);return q(a,`onMount`),q(a,`onShow`),()=>{q(a,`onHide`),q(a,`onUnmount`),o()}}function qe(){try{if(document.documentElement.dataset.cwspNativeShell===`capacitor`)return!0;let e=globalThis.Capacitor;return typeof e?.isNativePlatform==`function`&&!!e.isNativePlatform()}catch{return!1}}function J(e){let t=e?.closest?.(`.env-shell-root`)??e?.closest?.(`env-shell-container`);if(!(t instanceof HTMLElement))return 0;if(X?.shell===t)return X.n;let n=t.style.getPropertyValue(`--env-window-z-boost`).trim()||getComputedStyle(t).getPropertyValue(`--env-window-z-boost`).trim(),r=Number.parseInt(n,10),i=Number.isFinite(r)?r:0;return X={shell:t,n:i},i}function Je(e){let t=e.closest?.(`.env-shell-root`)??e.closest?.(`env-shell-container`)??document.querySelector?.(`.env-shell-root, env-shell-container`);return t instanceof HTMLElement?t:null}function Y(e){let t=Je(e);if(!t)return;let n=!!t.querySelector?.(`ui-window[native-mode], ui-window[data-native-active]`);t.toggleAttribute(`data-env-native-task`,n)}function Ye(e,t,n,r,i={}){let{bounds:a,z:o,maximizedMobile:s,minimized:c,desktopMaximized:l,visible:u,isMobileMq:d}=t;t.nativeMode||=O(!!i.startNative);let f=t.nativeMode;i.startNative&&(f.value=!0);let p=document.createElement(`ui-window`);p.setAttribute(`managed`,``),p.className=`env-ui-window`,p.setAttribute(`part`,`window`);{let e=document.documentElement.getAttribute(`data-theme`)||document.documentElement.style.colorScheme||``;(e===`light`||e===`dark`)&&(p.dataset.theme=e,p.style.colorScheme=e)}let m=document.createElement(`span`);m.slot=`title`,m.className=`env-ui-window__title`,m.textContent=t.title,n.slot=`content`,n.classList.add(`env-ui-window__body`),p.append(m,n),e.appendChild(p);let h=String(i?.managedViewKey??``).trim();h&&(p.setAttribute(`data-ui-window-view`,h),p.setAttribute(`data-wf-managed-view`,h));let g=null,_=()=>{i.onChromeChange?.(),Y(e)},v=()=>{p.style.right=``,p.style.bottom=``},y=()=>{p.style.left=`0`,p.style.top=`0`,p.style.right=`0`,p.style.bottom=`var(--env-shell-chrome-stack-reserve, 2.5rem)`,p.style.width=`auto`,p.style.height=`auto`,p.style.removeProperty(`--ui-win-width`),p.style.removeProperty(`--ui-win-height`)},b=()=>{p.style.left=`0`,p.style.top=`0`,p.style.right=`0`,p.style.bottom=`0`,p.style.width=`100%`,p.style.height=`100%`,p.style.removeProperty(`--ui-win-width`),p.style.removeProperty(`--ui-win-height`)},x=()=>{let t=!!d.matches,n=J(e),r=(o.value??10)+n;p.style.zIndex=String(r),t&&(l.value&&=!1,!c.value&&!f.value&&!s.value&&(s.value=!0));let i=!!f.value,m=!!c.value,h=!t&&!!l.value&&!i&&!m,g=t&&!i&&!m,_=e.closest?.(`.env-shell-root`)??e.closest?.(`env-shell-container`)??document.querySelector?.(`.env-shell-root, env-shell-container`),x=_ instanceof HTMLElement&&_.hasAttribute(`data-status-overlay`)||document.documentElement.hasAttribute(`data-env-status-overlay`),S=_ instanceof HTMLElement&&_.hasAttribute(`data-standalone`)||document.documentElement.hasAttribute(`data-env-standalone`),C=x&&!i&&!m&&(g||h),w=qe(),T=S&&t&&!i&&!m||w&&t&&!i&&!m;if(p.toggleAttribute(`native-mode`,i&&!m),p.toggleAttribute(`minimized`,m),p.toggleAttribute(`data-mobile-max`,g),p.toggleAttribute(`data-desk-max`,h),p.toggleAttribute(`data-status-gap`,C),p.toggleAttribute(`data-no-titlebar`,T),p.toggleAttribute(`maximized`,!m&&(h||g||i)),m){p.setVisible(!1),Y(e);return}if(p.setVisible(!!u.value),!u.value){Y(e);return}if(i){b(),Y(e);return}if(g){p.style.left=`0`,p.style.top=`0`,p.style.right=`0`,p.style.bottom=`0`,p.style.width=`100%`,p.style.height=`auto`,Y(e);return}if(h){y(),Y(e);return}v(),p.applyBounds({x:a.x.value,y:a.y.value,w:a.w.value,h:a.h.value,z:r}),Y(e)},S=()=>{d.matches&&(f.value||(s.value=!0),l.value&&(l.value=!1,g&&=(a.x.value=g.x,a.y.value=g.y,a.w.value=g.w,a.h.value=g.h,null))),x(),_()};d.matches&&!f.value&&!c.value&&(s.value=!0);let C=re(()=>{x()},[a.x,a.y,a.w,a.h,o,s,c,l,f,u],{triggerImmediately:!0});d.addEventListener(`change`,S);let w=()=>{x(),_()},T=e.closest?.(`.env-shell-root`)??e.closest?.(`env-shell-container`)??document.documentElement;T?.addEventListener?.(`env-chrome-surface`,w);let ee=()=>{c.value&&(c.value=!1,u.value=!0),r();let t=J(e),n=(o.value??10)+t;typeof p.bringToFront==`function`?p.bringToFront(n):(p.style.zIndex=String(n),p.toggleAttribute(`data-focused`,!0)),_()},te=e=>{let t=e.detail;f.value||l.value||s.value||c.value||(typeof t?.x==`number`&&(a.x.value=t.x),typeof t?.y==`number`&&(a.y.value=t.y))},ne=e=>{let t=e.detail;f.value||l.value||s.value||c.value||(typeof t?.w==`number`&&(a.w.value=t.w),typeof t?.h==`number`&&(a.h.value=t.h))},E=()=>{f.value&&=!1,l.value&&(l.value=!1,g&&=(a.x.value=g.x,a.y.value=g.y,a.w.value=g.w,a.h.value=g.h,null)),c.value=!0,x(),_()},D=()=>{if(f.value){A();return}if(d.matches){c.value=!1,s.value=!0,x(),_();return}if(c.value&&=!1,l.value){j();return}g={x:a.x.value,y:a.y.value,w:a.w.value,h:a.h.value},l.value=!0,x(),_()},k=()=>{c.value&&(c.value=!1,u.value=!0),!f.value&&!l.value&&!s.value&&(g={x:a.x.value,y:a.y.value,w:a.w.value,h:a.h.value}),l.value=!1,s.value=!1,f.value=!0,x(),_()},A=()=>{f.value&&(f.value=!1,g&&=(a.x.value=g.x,a.y.value=g.y,a.w.value=g.w,a.h.value=g.h,null),d.matches&&(s.value=!0),x(),_())},j=()=>{if(f.value){A();return}c.value&&(c.value=!1,u.value=!0),d.matches?s.value&&=!1:l.value&&(l.value=!1,g&&=(a.x.value=g.x,a.y.value=g.y,a.w.value=g.w,a.h.value=g.h,null)),x(),_()},M=!1,N=!1,P=t=>{if(t.preventDefault(),!(M||N)){M=!0;try{f.value&&=!1,u.value=!1,i.onClose?.()}catch(e){console.error(`[mount-ui-window] onClose failed`,e)}finally{if(!N){N=!0,C?.(),d.removeEventListener(`change`,S),T?.removeEventListener?.(`env-chrome-surface`,w);try{p.isConnected&&p.remove()}catch{}}Y(e)}}},F=0,ie=()=>{let e=typeof performance<`u`?performance.now():Date.now();return e-F<280?!1:(F=e,!0)},ae=e=>{if(!(M||N)&&ie()){if(e===`close`){P(new Event(`window-close`,{cancelable:!0}));return}if(e===`exit-native`){A();return}if(e===`maximize`){f.value||l.value||s.value?j():D();return}c.value?j():E()}},oe=e=>{let t=typeof e.composedPath==`function`?e.composedPath():[];for(let e of t){if(!(e instanceof Element))continue;let t=e.getAttribute?.(`data-ui-win-action`);if(t===`close`||t===`exit-native`||t===`maximize`||t===`minimize`)return t;if(e.matches?.(`.title-close`))return`close`;if(e.matches?.(`.title-exit-native`))return`exit-native`;if(e.matches?.(`.title-maximize`))return`maximize`;if(e.matches?.(`.title-minimize`))return`minimize`}return null},I=e=>{if(M||N||e.defaultPrevented)return;let t=oe(e);t&&(e.preventDefault(),e.stopPropagation(),ae(t))},L=null,R=()=>{let e=p.shadowRoot;if(!e||M||N)return;let t=e.querySelectorAll(`[data-ui-win-action], .title-minimize, .title-maximize, .title-close, .title-exit-native`);for(let e of t){let t=e.getAttribute(`data-ui-win-action`);if(t||(e.classList.contains(`title-close`)?t=`close`:e.classList.contains(`title-exit-native`)?t=`exit-native`:e.classList.contains(`title-maximize`)?t=`maximize`:e.classList.contains(`title-minimize`)&&(t=`minimize`)),!t)continue;e.setAttribute(`data-ui-win-action`,t);let n=t,r=e=>{e.defaultPrevented||(e.preventDefault(),e.stopPropagation(),ae(n))};e.onclick=r,e.onpointerup=e=>{e.button===0&&r(e)}}};if(R(),queueMicrotask(R),requestAnimationFrame(R),typeof MutationObserver<`u`){L=new MutationObserver(()=>R());let e=()=>{p.shadowRoot?L?.observe(p.shadowRoot,{childList:!0,subtree:!0}):requestAnimationFrame(e)};e()}return p.addEventListener(`window-focus`,ee),p.addEventListener(`window-move`,te),p.addEventListener(`window-resize`,ne),p.addEventListener(`window-minimize`,E),p.addEventListener(`window-maximize`,D),p.addEventListener(`window-restore`,j),p.addEventListener(`window-native`,k),p.addEventListener(`window-exit-native`,A),p.addEventListener(`window-close`,P),p.addEventListener(`click`,I),p.addEventListener(`pointerup`,I),()=>{if(!N){N=!0,M=!0,C?.(),L?.disconnect(),L=null,d.removeEventListener(`change`,S),T?.removeEventListener?.(`env-chrome-surface`,w),p.removeEventListener(`window-focus`,ee),p.removeEventListener(`window-move`,te),p.removeEventListener(`window-resize`,ne),p.removeEventListener(`window-minimize`,E),p.removeEventListener(`window-maximize`,D),p.removeEventListener(`window-restore`,j),p.removeEventListener(`window-native`,k),p.removeEventListener(`window-exit-native`,A),p.removeEventListener(`window-close`,P),p.removeEventListener(`click`,I),p.removeEventListener(`pointerup`,I);try{f.value&&=!1,p.isConnected&&p.remove()}catch{}Y(e)}}}var X;function Xe(){return(Xe=e((()=>{D(),de(),X=null})))()}function Z(e,t){let n=typeof CSS<`u`&&typeof CSS.escape==`function`?CSS.escape(t):t.replace(/\\/g,`\\\\`).replace(/"/g,`\\"`),r=e.querySelector(`:scope > ui-window[data-ui-window-view="${n}"]`)||e.querySelector(`:scope > ui-window[data-wf-managed-view="${n}"]`)||e.querySelector(`:scope > section.wf-frame[data-wf-managed-view="${n}"]`);return r instanceof HTMLElement?r:null}function Ze(e){let t=String(e||``).trim();if(!t)return`browser`;let n=2166136261;for(let e=0;e<t.length;e++)n^=t.charCodeAt(e),n=Math.imul(n,16777619);return`browser:${(n>>>0).toString(36)}`}function Qe(e){try{return new URL(e).hostname.replace(/^www\./i,``)||`Browser`}catch{return`Browser`}}function $e(e){let t=String(e||``).trim().toLowerCase();return t===`browser`||t===`web`||t===`iframe`||t===`web-view`||t===`webview`?`browser`:t}function et(e){let t=String(e||``).trim().toLowerCase();return $[t]?$[t]:t.startsWith(`browser:`)?$.browser:`app-window`}function tt(e){return $e(e)===`browser`?()=>l(()=>import(`./browser-view-DhO2i9yb.js`),[],import.meta.url):null}function nt(e){if(!e||typeof e!=`object`)return``;let t=e,n=t.params&&typeof t.params==`object`&&!Array.isArray(t.params)?t.params:{};return String(n.url||n.href||n.src||t.url||t.href||t.src||``).trim()}function Q(e,t){let n=G(e)||String(e||``).trim().toLowerCase(),r=n.startsWith(`browser:`)?`browser`:n;if(t?.[n])return t[n];if(t?.[r])return t[r];if(at[r])return at[r];let i=String(e||``).trim();return i?i.charAt(0).toUpperCase()+i.slice(1):`View`}function rt(e,t){let n=document.createElement(`div`);return n.className=`wf-view-placeholder`,n.setAttribute(`part`,`placeholder`),n.innerHTML=`<p class="wf-view-placeholder__title">${Q(e,t)}</p>
<p class="wf-view-placeholder__hint">No window module is registered for this shortcut in environment-shell yet.</p>`,n}function it(e,t={}){let n=g(120),r=new Map,i=!1,a=null;J(e);let o=0,s=()=>{i||(o||=requestAnimationFrame(()=>{o=0,i||t.onTaskingChange?.(c())}))},c=()=>{let n=[];for(let i of r.values())Z(e,i.key)&&n.push({id:i.key,title:i.model.title||Q(i.key,t.viewTitles),icon:et(i.key),focused:a===i.key,minimized:!!i.model.minimized.value,visible:!!i.model.visible.value});return n},l=()=>{for(let t of r.values()){let n=Z(e,t.key);if(!n)continue;n.toggleAttribute(`data-focused`,!1);let r=n.clearFocused;typeof r==`function`&&r.call(n)}},u=e=>{for(let[t,n]of r)e&&t===e||n.model.nativeMode?.value&&(n.model.nativeMode.value=!1)},d=(t,r)=>{if(a===r&&!t.minimized.value){let t=Z(e,r);if(t&&t===e.lastElementChild)return}n.value+=1,t.z.value=n.value,t.minimized.value=!1,t.visible.value=!0,a=r,t.nativeMode?.value&&u(r);let i=Z(e,r);if(i){let n=J(e),r=(t.z.value??10)+n;l(),i.style.zIndex=String(r),i.toggleAttribute(`data-focused`,!0);let a=i.bringToFront;typeof a==`function`&&a.call(i,r),i.parentElement===e&&i!==e.lastElementChild&&e.appendChild(i)}s()},f={},p=t.overlayMountHost?Ne(t.overlayMountHost):null;f.resolveOverlayMountPoint=e=>{if(p)return p;if(t.environmentShellHost){let e=E(t.environmentShellHost);if(e)return e}return ne(e??null)};let m=e=>{let n=$e(G(e)||String(e||``).trim().toLowerCase());return t.viewLoaders?.[n]||tt(n)},h=()=>{let i=t.readerWindow;if(!i?.content)return;let o=K,c=r.get(o);if(c&&Z(e,o)){d(c.model,o);return}if(c&&!Z(e,o)){r.delete(o);try{c.disposeFrame()}catch{}}let l=i.seed||{},u=Le(i.title||Q(o,t.viewTitles),{x:l.x??96,y:l.y??96,w:l.w??420,h:l.h??340,z:l.z??n.value+1});n.value=u.z.value;let f=()=>{};f=Ye(e,u,i.content,()=>d(u,o),{managedViewKey:o,onChromeChange:s,onClose:()=>{let e=r.get(o);if(e){r.delete(o),a===o&&(a=null);try{e.disposeFrame()}catch{}s()}}}),r.set(o,{key:o,model:u,disposeFrame:f}),d(u,o)},_=(e,t)=>{if(i)return;let n=G(String(e||``).trim());if(n=$e(n),!(!n||n===`home`)&&n!==`airpad`){try{let e=document.documentElement.dataset.cwspNativeShell===`capacitor`||!!globalThis.Capacitor?.isNativePlatform?.();if(document.documentElement.dataset.cwspSku===`launcher`&&e){N(n).then(e=>{e||v(n,t)});return}}catch{}v(n,t)}},v=(o,c)=>{if(i)return;let l={...c?.params||{}},p=nt(c);p&&(l.url=p,l.href=p);let g=o===`browser`?String(l.windowKey||``).trim()||Ze(p):o;if(ze(o)&&t.readerWindow?.content){h();return}let _=new Set((t.startNativeViewIds||[]).map(e=>G(String(e||``)))).has(o)||String(c?.native||``)===`1`||String(l.native||``)===`1`,v=r.get(g);if(v&&Z(e,g)){if(d(v.model,g),_&&v.model.nativeMode&&(v.model.nativeMode.value=!0,v.model.minimized.value=!1,v.model.visible.value=!0,u(g)),o===`browser`&&p)try{let t=Z(e,g),n=t?.querySelector?.(`iframe.wf-browser__frame`),r=t?.querySelector?.(`input.wf-browser__url`);if(n&&n.src!==p&&(n.src=p),r&&(r.value=p),p)try{v.model.title=Qe(p)}catch{}}catch{}return}if(v&&!Z(e,g)){v.disposeView?.(),r.delete(g);try{v.disposeFrame()}catch{}}let y=m(o),b=document.createElement(`div`);b.className=`wf-view-host env-ui-window__view-host`,b.setAttribute(`part`,`view-host`);{let e=document.createElement(`p`);e.className=`wf-view-placeholder__hint`,e.style.cssText=`margin:1rem;font:400 .9rem/1.4 system-ui,sans-serif;opacity:.8`,e.textContent=`Loading ${Q(o,t.viewTitles)}…`,b.append(e)}let x=r.size*24,S=Le(o===`browser`&&p?Qe(p):Q(o,t.viewTitles),{x:72+x,y:72+x,w:o===`browser`?720:640,h:o===`browser`?520:480,z:n.value+1});n.value=S.z.value;let C=()=>{};C=Ye(e,S,b,()=>d(S,g),{managedViewKey:g,startNative:_,onChromeChange:s,onClose:()=>{let e=r.get(g);if(e){r.delete(g),a===g&&(a=null);try{e.disposeView?.()}catch{}try{e.disposeFrame()}catch{}s()}}}),_&&(S.nativeMode.value=!0,u(g));let w={key:g,model:S,disposeFrame:C,disposeView:void 0};r.set(g,w),d(S,g);let T={...c||{},shellContext:f};if((o===`browser`&&p||p&&!(T.params&&(T.params.url||T.params.href)))&&(T.params={...T.params||{},url:p,href:p}),!y){b.replaceChildren(rt(o,t.viewTitles));return}Ke(y,b,T).then(e=>{if(i){e();return}let t=r.get(g);t&&(t.disposeView=e),(_||S.nativeMode?.value)&&(S.nativeMode.value=!0,S.minimized.value=!1,S.visible.value=!0,u(g),d(S,g))},e=>{console.error(`[workspace-window-layer] mountViewModule failed for view "${o}"`,e),b.replaceChildren(rt(o,t.viewTitles))})};return f.navigate=(e,t)=>{_(String(e),t)},f.openView=(e,t)=>{_(String(e),t)},{shellContext:f,dispose:()=>{if(!i){i=!0,o&&=(cancelAnimationFrame(o),0);for(let e of r.values())e.disposeView?.(),e.disposeFrame();r.clear(),a=null,s()}},focusWindow:t=>{let n=G(String(t||``)),i=r.get(n);return!i||!Z(e,n)?!1:(d(i.model,n),!0)},minimizeWindow:t=>{let n=G(String(t||``)),i=r.get(n);return!i||!Z(e,n)?!1:(i.model.nativeMode?.value&&(i.model.nativeMode.value=!1),i.model.desktopMaximized?.value&&(i.model.desktopMaximized.value=!1),i.model.visible.value=!0,i.model.minimized.value=!0,a===n&&(a=null,l()),s(),!0)},minimizeAllWindows:()=>{if(!i){u(null),a=null,l();for(let t of r.values())Z(e,t.key)&&(t.model.desktopMaximized?.value&&(t.model.desktopMaximized.value=!1),t.model.visible.value=!0,t.model.minimized.value=!0);s()}},closeWindow:e=>{let t=G(String(e||``)),n=r.get(t);if(!n)return!1;r.delete(t),a===t&&(a=null);try{n.disposeView?.()}catch{}try{n.disposeFrame()}catch{}return s(),!0},blurWindows:()=>{u(null),a=null,l(),s()},closeAllWindows:()=>{if(!i){u(null);for(let e of[...r.values()]){try{e.disposeView?.()}catch{}try{e.disposeFrame()}catch{}}r.clear(),a=null,s()}},enterNative:t=>{let n=G(String(t||``)),i=r.get(n);return!i||!Z(e,n)?!1:(u(n),i.model.nativeMode.value=!0,i.model.minimized.value=!1,i.model.visible.value=!0,d(i.model,n),!0)},exitNative:e=>{if(e){let t=G(String(e||``)),n=r.get(t);n?.model.nativeMode&&(n.model.nativeMode.value=!1),s();return}u(null),s()},listWindowTasks:c,getFocusedKey:()=>a}}var $,at;function ot(){return(ot=e((()=>{h(),w(),Re(),Ve(),Fe(),Xe(),ue(),c(),$={home:`house`,viewer:`article`,markdown:`article`,browser:`globe`,web:`globe`,explorer:`books`,settings:`gear-six`,apps:`squares-four`,workcenter:`briefcase`,history:`clock-counter-clockwise`,editor:`pencil-simple-line`,network:`wifi-high`,task:`list-checks`,event:`calendar`,bonus:`gift`,person:`address-book`},at={home:`Home`,viewer:`Markdown`,browser:`Browser`,web:`Browser`,explorer:`Explorer`,settings:`Settings`,apps:`Apps`,workcenter:`Work Center`,history:`History`,editor:`Editor`,network:`Network`,task:`Plan`,event:`Events`,bonus:`Bonuses`,person:`Contacts`}})))()}function st(e,t=lt){try{localStorage.getItem(t)||localStorage.setItem(t,e)}catch{}}function ct(e,t){let n=I(),r=F();r&&xe();let i,a;if(r)i=document.createElement(`ui-statusbar`),i.className=`env-ui-statusbar`,i.hidden=!0,a=()=>{i.remove()};else{let e=ae(t.shell,t.introHtml,n);i=e.element,a=e.dispose}let o=document.createElement(`div`);o.className=`env-shell-chrome wf-chrome-no-select`;let s;if(t.taskbar){try{let e=oe();e&&se(e)}catch{}s=le({...t.taskbar,device:n}),o.append(s.element,i)}else o.append(i);let c=(e.classList?.contains(`env-shell-root`)?e:null)||e.closest?.(`.env-shell-root`)||e.closest?.(`env-shell-container`)||e;me(c),globalThis.__ENV_OVERLAY_MOUNT__=Ne,Ne(c),pe();let l=typeof matchMedia==`function`?matchMedia(`(min-width: 641px) and (not ((pointer: coarse) or (hover: none)))`):null,u=typeof matchMedia==`function`?[`(display-mode: standalone)`,`(display-mode: fullscreen)`,`(display-mode: minimal-ui)`,`(display-mode: browser)`,`(display-mode: window-controls-overlay)`].map(e=>matchMedia(e)):[],d=()=>{let e=!l||l.matches,t=L(),n=ce(),r=ie({desktop:e,standalone:n,displayMode:t});o.toggleAttribute(`data-desktop`,e),o.toggleAttribute(`data-standalone`,n),o.toggleAttribute(`data-status-overlay`,r),o.dataset.chromeLayout=e?`desktop`:`mobile`,o.dataset.displayMode=t,c.toggleAttribute(`data-standalone`,n),c.toggleAttribute(`data-status-overlay`,r),c.dataset.displayMode=t,c.style.setProperty(`--env-status-inset-top`,r?`max(2rem, env(safe-area-inset-top, 0px))`:`0px`),document.documentElement.toggleAttribute(`data-env-status-overlay`,r),document.documentElement.toggleAttribute(`data-env-standalone`,n);try{c.dispatchEvent(new CustomEvent(`env-chrome-surface`,{bubbles:!0,detail:{statusOverlay:r,standalone:n,displayMode:t,desktop:e}}))}catch{}};d(),l?.addEventListener?.(`change`,d);for(let e of u)e.addEventListener?.(`change`,d);document.addEventListener(`fullscreenchange`,d),document.addEventListener(`webkitfullscreenchange`,d);let f=r?()=>{}:fe(c);return Oe(e)&&(o.slot=T.overlay),e.appendChild(o),{root:o,device:n,statusBar:i,taskbar:s,disposeDevice:()=>{l?.removeEventListener?.(`change`,d);for(let e of u)e.removeEventListener?.(`change`,d);document.removeEventListener(`fullscreenchange`,d),document.removeEventListener(`webkitfullscreenchange`,d),f(),a(),n.dispose(),me(null)}}}var lt;function ut(){return(ut=e((()=>{P(),Ce(),R(),j(),Me(),Fe(),w(),M(),he(),A(),Ie(),ot(),Xe(),lt=`rs-wallpaper-image`})))()}function dt(e){pt().set(e)}var ft,pt;function mt(){return(mt=e((()=>{ft=`__CWSP_LAUNCHER_HOME_HOOKS_V1__`,pt=()=>{let e=globalThis;return{get:()=>ft in e?e[ft]:null,set:t=>{e[ft]=t}}}})))()}var ht;function gt(){return(gt=e((()=>{ht=`*,
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
    /* Deep scrim akin to Material background */
    background: radial-gradient(
        1200px 700px at 12% -8%,
        color-mix(in oklch, var(--wf-md-primary) 18%, --u2-color-mod(var(--wf-md-primary), 940)),
        --u2-color-mod(var(--wf-md-primary), 960)
    );
    overflow: clip;
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
.env-shell-root.wf-demo-root {
  background: transparent;
}

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
   * \`core/misc/_tokens.scss\`. \`--env-launcher-fg*\` aliases \`--wallpaper-contrast-color\`
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

/*
 * WHY: Env views live in light DOM under ui-window — force view tokens from concrete
 * html[data-theme] surfaces so Markdown/Settings never keep OS-dark light-dark() sides.
 */
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

/* WHY: Match window-frame print reset — flex + \`overflow: hidden\` hosts must not trap paginated prose. */
@media print {
  .wf-view-host,
  .wf-view-host > .wf-mounted-view {
    display: block !important;
    overflow: visible !important;
    flex: none !important;
    align-self: stretch !important;
    max-block-size: none !important;
    min-block-size: 0 !important;
    block-size: auto !important;
  }
}
/* Workspace is the flex stack for home + floating \`.wf-frame\`; padding/safe-area live in \`home-view\` SCSS. */
.env-shell-workspace {
  padding: 0;
  background-color: transparent !important;
}

/* Bridge: document chrome styles live next to the statusbar component after regroup. */
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
}
/* Bridge: chrome/taskbar host styles live next to the taskbar component after regroup. */
/*
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
}
/* Bridge: mobile process-switcher styles live next to the taskbar component after regroup. */
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
@layer ui-navbar {
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

/* Bridge: app-menu / launcher drawer styles live next to the app-menu component after regroup. */
/*
 * Filename: _launcher-icon-mask.scss
 * FullPath: modules/projects/subsystem/shells/environment/scss/_launcher-icon-mask.scss
 * Change date and time: 19.25.00_19.08.2026
 * Reason for changes: Shared Android icon mask — optical fill + wallpaper ink tokens.
 */
@layer launcher-icons {
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
@layer ui-app-menu {
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
}`})))()}function yt(){try{if(document.documentElement.dataset.cwspNativeShell===`capacitor`)return!0;let e=globalThis.Capacitor;return typeof e?.isNativePlatform==`function`&&!!e.isNativePlatform()}catch{return!1}}function bt(){try{let e=new URLSearchParams(globalThis.location?.search||``);if(e.get(`native`)!==`1`&&e.get(`native`)!==`true`)return[];let t=(e.get(`view`)||``).trim().toLowerCase(),n=String(globalThis.location?.pathname||``).replace(/^\/+|\/+$/g,``).toLowerCase(),r=n.match(/^(cwsp|markdown|kvm)\/(.+)$/);r?.[2]&&(n=r[2]);let i=n.split(`/`)[0]||``,a=((i&&i!==`home`?i:t)||`explorer`).split(`/`)[0]||`explorer`;return!a||a===`home`?[`explorer`]:[a===`markdown`?`viewer`:a]}catch{return[]}}function xt(e){let t=e||{};return t.native===1||t.native===`1`||t.native===!0||t.params?.native===`1`||t.params?.native===`true`}function St(e,t){if(!bt().includes(e)&&!xt(t))return t||{};let n={...t||{}};return n.native=`1`,n.params={...n.params||{},native:`1`},n}async function Ct(){try{let e=await l(()=>import(`./launcher-state-CTBiV1a1.js`).then(e=>(e.d(),e.p)),[],import.meta.url),t=e.speedDialItems;if(!t||typeof t.findIndex!=`function`)return;let n=!1;for(let e=t.length-1;e>=0;e--){let r=t[e],i=String(r?.meta?.view||``).toLowerCase(),a=String(r?.id||``).toLowerCase();(i===`airpad`||a.includes(`airpad`))&&(t.splice(e,1),n=!0)}n&&e.persistSpeedDialItems?.()}catch(e){console.warn(`[EnvironmentShell] speed-dial seed skipped`,e)}}function wt(e){return new Dt}var Tt,Et,Dt;function Ot(){return(Ot=e((()=>{h(),r(),C(),v(),p(),ee(),w(),i(),s(),ut(),mt(),gt(),vt(),c(),Ee(),Tt={network:()=>l(()=>import(`./src-CCzHiGS9.js`),[],import.meta.url),settings:()=>l(()=>import(`./src-DObrKtQk.js`),[],import.meta.url),explorer:()=>l(()=>import(`./_cwsp-disabled-entry_view-explorer-CgPWJ5lY.js`),[],import.meta.url),viewer:()=>l(()=>import(`./_cwsp-disabled-entry_view-viewer-D_Fv3iM1.js`),[],import.meta.url),markdown:()=>l(()=>import(`./_cwsp-disabled-entry_view-viewer-D_Fv3iM1.js`),[],import.meta.url),history:()=>l(()=>import(`./src-fylNXeQW.js`),[],import.meta.url),workcenter:()=>l(()=>import(`./_cwsp-disabled-entry_view-workcenter-wO1gmAI3.js`),[],import.meta.url),editor:()=>l(()=>import(`./_cwsp-disabled-entry_view-editor-072I_-zB.js`),[],import.meta.url),home:()=>l(()=>import(`./_cwsp-disabled-entry_view-home-DFq7GfDB.js`),[],import.meta.url)},Et=[`home`,`network`,`settings`,`explorer`,`viewer`,`history`,`workcenter`,`editor`],Dt=class extends te{id=`environment`;name=`Environment`;layout={hasSidebar:!1,hasToolbar:!1,hasTabs:!1,supportsMultiView:!0,supportsWindowing:!0};workspaceEl=null;homeMountEl=null;windowLayer=null;chromeDispose=null;wallpaperLifecycleDispose=null;homeUnmount=null;shellActivityDispose=null;focusedTaskId=_(`home`);setFocusedTaskId=null;syncWindowTasks=null;navEcho=_(``);mqLabel=_(`desktop`);_monoNativeBoot=!1;_pendingHomeMount=null;createLayout(){return document.createElement(`div`)}getStylesheet(){return _t}async mount(e){if(this.mounted){console.warn(`[${this.id}] Shell already mounted`);return}this.container=e,st(`/assets/wallpaper.jpg`),Ee();try{await t(ht),n(ht)}catch(e){console.warn(`[EnvironmentShell] wf-demo tokens failed`,e)}let r=this.getStylesheet();if(r)try{await t(r),n(r)}catch(e){console.warn(`[EnvironmentShell] env shell styles failed`,e)}try{S()}catch{}try{document.documentElement.dataset.cwspSurface=`environment`}catch{}let i=De();i.className=`env-shell-root wf-demo-root`,i.setAttribute(`data-shell`,`environment`),i.setAttribute(`data-shell-system`,`task-tab`),i.style.gridColumn=`content-column`,i.style.gridRow=`content-row`,i.style.alignSelf=`stretch`,i.style.justifySelf=`stretch`,i.style.minInlineSize=`0`,i.style.minBlockSize=`0`,i.style.inlineSize=`100%`,i.style.blockSize=`100%`,i.style.pointerEvents=`auto`;let s=document.createElement(`div`);s.slot=T.underlying,s.className=`env-shell-wallpaper`,s.setAttribute(`data-env-wallpaper`,``);let c=document.createElement(`div`);c.className=`env-shell-workspace`,c.setAttribute(`data-shell-content`,``);let l=document.createElement(`div`);l.className=`env-shell-home-mount`,l.style.display=`flex`,l.style.flex=`1 1 auto`,l.style.flexDirection=`column`,l.style.alignSelf=`stretch`,l.style.minHeight=`0`,l.style.minWidth=`0`,c.appendChild(l),i.append(s,c),e.replaceChildren(i),this.rootElement=i,this.workspaceEl=c,this.homeMountEl=l,this.contentContainer=c,this.overlayContainer=i.overlayMount??i.shadowRoot?.querySelector?.(`[data-shell-overlays]`)??null,this.mounted=!0,this.shellActivityDispose=o(this.id);let u=yt();u&&(i.dataset.capacitorNative=``,document.documentElement.dataset.cwspNativeShell=document.documentElement.dataset.cwspNativeShell||`capacitor`);try{b(),u&&st(`/assets/wallpaper.jpg`),y(s);let e=()=>{if(document.visibilityState===`visible`)try{x()}catch{}};window.addEventListener(`pageshow`,e),document.addEventListener(`visibilitychange`,e),this.wallpaperLifecycleDispose=()=>{window.removeEventListener(`pageshow`,e),document.removeEventListener(`visibilitychange`,e)}}catch(e){console.warn(`[EnvironmentShell] wallpaper init failed`,e)}let d={};for(let e of Et){if(e===`home`||!a(e)&&e!==`viewer`)continue;let t=Tt[e];t&&(d[e]=t)}d.viewer&&(d.markdown=d.viewer);let p=matchMedia(`(max-width: 640px)`);this.mqLabel.value=p.matches?`mobile`:`desktop`,p.addEventListener(`change`,()=>{this.mqLabel.value=p.matches?`mobile`:`desktop`});let h=ct(i,{shell:{selectedPath:_(``),viewerStatus:_(``),navEcho:this.navEcho,mqLabel:this.mqLabel},introHtml:`<p><strong>CWSP environment</strong> — Speed Dial / desktop launcher. Views open in <code>ui-window</code>.</p>`,taskbar:{focusedTaskId:this.focusedTaskId,onHome:()=>this.focusHome(),onViewer:()=>{this.openInWindow(`viewer`)},onWindowTask:e=>{this.openInWindow(e)},onMinimizeWindow:e=>{let t=String(e||``).trim().toLowerCase();t&&this.windowLayer?.minimizeWindow?.(t)&&(this.setFocusedTaskId?.(`home`),this.focusedTaskId.value=`home`)},onCloseWindow:e=>{let t=String(e||``).trim().toLowerCase();t&&(this.windowLayer?.closeWindow?.(t),String(this.focusedTaskId.value||``)===t&&(this.setFocusedTaskId?.(`home`),this.focusedTaskId.value=`home`))}}});this.setFocusedTaskId=h.taskbar?.setFocusedTaskId??null,this.syncWindowTasks=h.taskbar?.syncWindowTasks??null,(document.documentElement.dataset.cwspShellRole===`launcher`||globalThis.__RS_SHELL_ROLE__===`launcher`)&&dt({navigateHome:()=>this.focusHome(),openAppMenu:()=>h.taskbar?.openAppMenu?.(),openAppMenuPage:()=>h.taskbar?.openAppMenuPage?.()??h.taskbar?.appMenu?.openPage?.(),closeAppMenu:()=>h.taskbar?.appMenu?.close(),isAppMenuOpen:()=>!!h.taskbar?.appMenu?.isOpen(),tryConsumeBack:()=>m()?f()!=null:h.taskbar?.isSwitcherOpen?.()?(h.taskbar.closeSwitcher?.(),!0):!1}),this.chromeDispose=()=>{h.disposeDevice(),h.taskbar?.dispose?.(),h.root.remove()};let g=bt();this.windowLayer=it(c,{overlayMountHost:i,environmentShellHost:i,viewLoaders:d,startNativeViewIds:g,viewTitles:{network:`Network`,settings:`Settings`,explorer:`Explorer`,viewer:`Markdown`,browser:`Browser`,history:`History`,workcenter:`Work Center`,editor:`Editor`},onTaskingChange:e=>{this.syncWindowTasks?.(e);let t=e.find(e=>e.focused);t&&this.setFocusedTaskId?.(t.id)}});let v={...this.windowLayer.shellContext,navigate:(e,t)=>{this.navEcho.value=`shell.navigate("${e}")`,this.routeView(String(e),t)},openView:(e,t)=>{this.navEcho.value=`shell.openView("${e}")`,this.routeView(String(e),t)},showMessage:e=>{this.showMessage(typeof e==`string`?e:String(e??``))}};if(Ct(),g.length>0){for(let e of g)this.openInWindow(e,{native:`1`,params:{native:`1`}});this._monoNativeBoot=!0,this._pendingHomeMount={homeMount:l,shellContext:{shellContext:v}}}else this.mountHomeDesktop(l,v)}mountHomeDesktop(e,t){Ke(()=>l(()=>import(`./_cwsp-disabled-entry_view-home-DFq7GfDB.js`),[],import.meta.url),e,{shellContext:t}).then(e=>{this.homeUnmount=e}).catch(t=>{console.warn(`[EnvironmentShell] home-view failed`,t),e.innerHTML=`<p style="color:#eee;padding:1rem;font-family:system-ui">Home view failed to load.</p>`})}ensureHomeMounted(){let e=this._pendingHomeMount;!e||this.homeUnmount||(this._pendingHomeMount=null,this._monoNativeBoot=!1,this.mountHomeDesktop(e.homeMount,e.shellContext.shellContext))}syncLauncherHomeAddressBar(){if(!(typeof location>`u`||typeof history>`u`))try{let e=new URLSearchParams(location.search||``);e.set(`shell`,this.id),e.delete(`native`),e.delete(`view`);let t=e.toString()?`?${e.toString()}`:``,n=location.pathname||`/`,r=n.replace(/^\/+|\/+$/g,``).split(`/`)[0]?.toLowerCase()||``;new Set([`settings`,`explorer`,`viewer`,`markdown`,`network`,`history`,`workcenter`,`editor`]).has(r)&&(n=`/`);let i=`${n}${t}`;`${location.pathname}${location.search}`!==i&&history.replaceState({viewId:`home`,params:Object.fromEntries(e)},``,i)}catch{}}focusHome(){if(this.ensureHomeMounted(),typeof this.windowLayer?.minimizeAllWindows==`function`)this.windowLayer.minimizeAllWindows();else{for(let e of this.windowLayer?.listWindowTasks?.()??[])this.windowLayer?.minimizeWindow?.(e.id);this.windowLayer?.blurWindows?.()}this.setFocusedTaskId?.(`home`),this.focusedTaskId.value=`home`,this.currentView.value=`home`,this.syncLauncherHomeAddressBar();try{x()}catch{}}openInWindow(e,t){let n=String(e||``).trim().toLowerCase();if(!n||n===`airpad`)return;let r=St(n,t);if(n===`browser`||n===`web`||n===`iframe`||n===`webview`?this.windowLayer?.shellContext.openView?.(n,r):this.windowLayer?.focusWindow(n)||this.windowLayer?.shellContext.openView?.(n,r),xt(r)){let e=()=>{this.windowLayer?.enterNative?.(n),this.preserveNativeDeepLink(n)};e(),requestAnimationFrame(e),setTimeout(e,0)}this.setFocusedTaskId?.(n===`markdown`?`viewer`:n),this.currentView.value=n}preserveNativeDeepLink(e){if(!(typeof location>`u`||typeof history>`u`))try{let t=String(e||``).trim().toLowerCase();if(!t||t===`home`)return;let n=new URLSearchParams(location.search||``);n.set(`shell`,this.id),n.set(`native`,`1`),n.set(`view`,t);let r=`${`/${t}`}?${n.toString()}`;`${location.pathname}${location.search}${location.hash||``}`!==r&&history.replaceState({viewId:t,params:Object.fromEntries(n)},``,r)}catch{}}async routeView(e,t){let n=String(e||``).trim().toLowerCase();if(!(!n||n===`airpad`)){if(n===`home`){this.focusHome();return}this.openInWindow(n,t)}}async navigate(e,t,n){let r=String(e||`home`).toLowerCase();if(r===`airpad`){this.showMessage(`AirPad view is disabled in environment shell`);return}if(r===`home`){let e=bt();if(e.length){for(let n of e)this.openInWindow(n,{native:`1`,params:{native:`1`,...t||{}}});return}this.focusHome();return}let i={};try{i=Object.fromEntries(new URLSearchParams(location.search||``))}catch{i={}}let a={...i,...t||{}},o={params:a};(a.native===`1`||a.native===`true`||bt().includes(r))&&(o.native=`1`,o.params={...a,native:`1`}),this.openInWindow(r,o)}unmount(){try{this.homeUnmount?.()}catch{}this.homeUnmount=null;try{this.windowLayer?.dispose()}catch{}this.windowLayer=null;try{this.chromeDispose?.()}catch{}this.chromeDispose=null;try{this.shellActivityDispose?.()}catch{}this.shellActivityDispose=null;try{this.wallpaperLifecycleDispose?.()}catch{}if(this.wallpaperLifecycleDispose=null,(document.documentElement.dataset.cwspShellRole===`launcher`||globalThis.__RS_SHELL_ROLE__===`launcher`)&&dt(null),this.mounted&&this.container&&this.rootElement)try{this.container.contains(this.rootElement)&&this.rootElement.remove()}catch{}this.rootElement=null,this.contentContainer=null,this.overlayContainer=null,this.workspaceEl=null,this.homeMountEl=null,this.container=null,this.mounted=!1}}})))()}export{wt as n,Ot as r,Dt as t};