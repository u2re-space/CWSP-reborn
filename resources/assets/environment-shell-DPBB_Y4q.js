import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{At as t,J as n,Kt as r,Q as i,X as a,et as o,ft as s,jt as c,nt as l,tt as u}from"./HistoryManager-5Sa1FlA6.js";import{_ as d,d as f,g as p,u as m}from"./registry-CCrkZWZt.js";import{n as h,t as g}from"./preload-helper-NDuSAHbO.js";import{a as _,i as v,n as y,r as b,t as x}from"./Canvas-2-DPsy9ATD.js";import{t as ee}from"./src-BDKAvpBs.js";import{n as S}from"./CSSIconRegistry-D88SYH0A.js";import{n as C,t as w}from"./shells-Ca9NkwNJ.js";import{i as T,n as E,r as te,t as D}from"./shell-slots-CDiat5LT.js";import{a as ne,c as O,d as k,f as A,h as j,i as M,l as N,m as P,n as F,o as I,p as re,r as ie,s as ae,t as L,u as R}from"./src-PPkjbaQy.js";var z=e((()=>{})),B,V,H,U,oe,se,ce,le,ue,de=e((()=>{s(),B=new WeakMap,V=r(),H=e=>e?.naturalWidth||e?.width||1,U=e=>e?.naturalHeight||e?.height||1,oe=(e,t,n=1,r,i=0)=>{let a=e.canvas;e.translate(a.width/2,a.height/2),e.rotate((-i||0)*(Math.PI*.5)),e.rotate((1-r)*(Math.PI/2)),e.translate(-(H(t)/2)*n,-(U(t)/2)*n)},se=e=>(!B.has(e)&&(e instanceof Blob||e instanceof File||e instanceof OffscreenCanvas||e instanceof ImageBitmap||e instanceof Image)&&B.set(e,createImageBitmap(e)),B.get(e)),ce=new WeakMap,le=(e,t)=>ce?.getOrInsertComputed?.(e,()=>e?.bind?.(t)),ue=null,ue=typeof HTMLCanvasElement<`u`?class extends HTMLCanvasElement{static observedAttributes=[`data-src`,`data-orient`,`orient`];ctx=null;image=null;#e=[1,1];#t=``;#n=``;get#i(){let e=this.getAttribute(`data-orient`)??this.getAttribute(`orient`)??`0`,t=Number.parseInt(e,10);return Number.isFinite(t)?t:0}set#i(e){let t=String(e);this.setAttribute(`data-orient`,t),this.setAttribute(`orient`,t)}attributeChangedCallback(e,t,n){e==`data-src`&&this.#a(n),(e==`data-orient`||e==`orient`)&&this.#o(this.#n)}connectedCallback(){let e=this.parentNode;this.style.setProperty(`max-inline-size`,`min(100%, min(100cqi, 100dvi))`),this.style.setProperty(`max-block-size`,`min(100%, min(100cqb, 100dvb))`),this.#e=[Math.min(Math.min(Math.max(this.clientWidth||e?.clientWidth||1,1),e?.clientWidth||1)*(this.currentCSSZoom||1),screen?.width||1)*(devicePixelRatio||1),Math.min(Math.min(Math.max(this.clientHeight||e?.clientHeight||1,1),e?.clientHeight||1)*(this.currentCSSZoom||1),screen?.height||1)*(devicePixelRatio||1)],this.#a(this.#t=this.dataset.src||this.#t),this.image&&this.#o(this.#n)}constructor(){super();let e=this,t=this.parentNode,n=()=>{let e=this.#e;this.#e=[Math.min(Math.min(Math.max(this.clientWidth||t?.clientWidth||1,1),t?.clientWidth||1)*(this.currentCSSZoom||1),screen?.width||1)*(devicePixelRatio||1),Math.min(Math.min(Math.max(this.clientHeight||t?.clientHeight||1,1),t?.clientHeight||1)*(this.currentCSSZoom||1),screen?.height||1)*(devicePixelRatio||1)],(e?.[0]!=this.#e[0]||e?.[1]!=this.#e[1])&&this.#o(this.#n)};V?.shedule?.(()=>{this.ctx=e.getContext(`2d`,{alpha:!0,desynchronized:!0,powerPreference:`high-performance`,preserveDrawingBuffer:!0}),this.inert=!0,this.style.objectFit=`cover`,this.style.objectPosition=`center`,this.classList.add(`u-canvas`),this.classList.add(`u2-canvas`),this.classList.add(`ui-canvas`),this.style.setProperty(`max-inline-size`,`min(100%, min(100cqi, 100dvi))`),this.style.setProperty(`max-block-size`,`min(100%, min(100cqb, 100dvb))`),n(),new ResizeObserver(e=>{for(let t of e){let e=t?.devicePixelContentBoxSize?.[0];if(e){let t=this.#e;this.#e=[Math.max(e.inlineSize||this.width,1),Math.max(e.blockSize||this.height,1)],(t?.[0]!=this.#e[0]||t?.[1]!=this.#e[1])&&this.#o(this.#n)}}}).observe(this,{box:`device-pixel-content-box`}),this.#a(this.#t=this.dataset.src||this.#t)})}async $useImageAsSource(e,t){t||=this.#t;let n=e instanceof ImageBitmap?e:await se(e).catch(console.warn.bind(console));return n&&t==this.#t&&(this.image=n,this.#o(t)),e}$renderPass(e){let t=this,n=this.ctx,r=this.image;if(r&&n&&(e==this.#t||!e)){e&&(this.#n=e),this.width!=this.#e[0]&&(this.width=this.#e[0]),this.height!=this.#e[1]&&(this.height=this.#e[1]),this.style.aspectRatio=`${this.width||1} / ${this.height||1}`;let i=this.#i%2||0,a=+(H(r)<=U(r)),o=Math.max(t[[`height`,`width`][i]]/(a?U(r):H(r)),t[[`width`,`height`][i]]/(a?H(r):U(r)));n.save(),n.clearRect(0,0,t.width,t.height),oe(n,r,o,a,this.#i),n.drawImage(r,0,0,r.width*o,r.height*o),n.restore()}}#a(e){let t=e||this.#t;return this.#t=t,fetch(e,{cache:`force-cache`,mode:`same-origin`,priority:`high`})?.then?.(async e=>this.$useImageAsSource(await e.blob(),t)?.catch(console.warn.bind(console)))?.catch?.(console.warn.bind(console))}#o(e){let t=this.ctx;this.image&&t&&(e==this.#t||!e)&&V?.shedule?.(le(this.$renderPass,this))}}:class{constructor(){}$renderPass(e){}$useImageAsSource(e,t){return e}ctx=null;image=null};try{customElements.define(`ui-canvas`,ue,{extends:`canvas`})}catch{}})),fe=e((()=>{z(),_(),b(),de(),x()})),pe,me=e((()=>{pe=`/**
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
  min-block-size: 100dvb;
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

/* WHY: Wallpaper / canvas sits behind; never intercepts hits; clip bleed without clipping \`fixed\` overlays. */
.esc-underlying {
  z-index: 0;
  pointer-events: none;
  overflow: clip;
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
}`}));function he(){return!be&&!customElements.get(`env-shell-container`)&&(customElements.define(W,ye),be=!0),ye}function ge(){he();let e=customElements.get(W);if(e)try{return new e}catch(e){console.warn("[env-shell-container] `new` failed, falling back to createElement",e)}return document.createElement(W)}function _e(e){return e instanceof HTMLElement&&e.localName===`env-shell-container`}var W,ve,ye,be,xe=e((()=>{me(),E(),W=`env-shell-container`,ve=document.createElement(`template`),ve.innerHTML=`
<div class="esc-stack" part="stack">
  <div class="esc-layer esc-underlying" part="underlying">
    <slot name="${D.underlying}"></slot>
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
    <slot name="${D.overlay}"></slot>
  </div>
</div>`,ye=class extends HTMLElement{#e=!1;get overlayMount(){return this.#t(),this.shadowRoot?.querySelector(`[data-shell-overlays]`)??null}constructor(){super(),this.#t()}connectedCallback(){this.#t()}#t(){if(this.#e&&this.shadowRoot)return;let e=this.shadowRoot??this.attachShadow({mode:`open`});if(e.querySelector(`.esc-stack`)||e.appendChild(ve.content.cloneNode(!0)),e.adoptedStyleSheets.length===0){let t=new CSSStyleSheet;t.replaceSync(pe),e.adoptedStyleSheets=[t]}this.#e=!0}},be=!1}));function Se(e){let t=`[${Ce}]`,n=e.querySelector(t);if(n)return n.style.zIndex||(n.style.zIndex=G),n.style.position||(n.style.position=_e(e)?`absolute`:`fixed`),n;let r=document.createElement(`div`);return r.setAttribute(Ce,``),r.className=`env-shell-overlays`,r.setAttribute(`data-part`,`env-overlays`),_e(e)?(r.slot=D.overlay,r.style.cssText=`position:absolute;inset:0;pointer-events:none;z-index:${G};box-sizing:border-box;`,e.appendChild(r),r):(r.style.cssText=`position:fixed;inset:0;pointer-events:none;z-index:${G};box-sizing:border-box;`,e.appendChild(r),r)}var Ce,G,we=e((()=>{xe(),E(),Ce=`data-env-shell-overlays`,G=`2147483600`})),Te=e((()=>{fe()}));function Ee(e,t={}){let{x:n=48,y:r=48,w:a=640,h:s=480,z:c=10,demoRole:l}=t,u=matchMedia(`(max-width: 640px)`);return{demoRole:l,title:e,bounds:{x:o(n),y:o(r),w:o(a),h:o(s)},z:o(c),maximizedMobile:i(u.matches),minimized:i(!1),desktopMaximized:i(!1),nativeMode:i(!1),visible:i(!0),isMobileMq:u}}var De=e((()=>{n(),Object.freeze({w:360,h:240})}));function K(e){let t=String(e??``).trim().toLowerCase();t=t.replace(/^#/,``);let n=/^todo:\s*(.*)$/i.exec(t);return n&&(t=String(n[1]??``).trim().toLowerCase()),t=t.replace(/\s+/g,``),t?t===`viewer`||ke.has(t)?q:t:``}function Oe(e){return String(e||``).trim().toLowerCase()===q}var q,ke,Ae=e((()=>{q=`viewer`,ke=new Set([`markdown`,`markdown-view`,`markdown-viewer`,`reader`,`env-viewer`])}));function je(e){return!!(e&&typeof e==`object`&&typeof e.render==`function`)}function J(e,t){let n=e?.lifecycle?.[t];typeof n==`function`&&Promise.resolve(n())}function Me(e){if(typeof e!=`function`)return!1;try{let t=e.prototype;return!!(t!=null&&typeof HTMLElement<`u`&&HTMLElement.prototype.isPrototypeOf(t))}catch{return!1}}function Ne(e,t){let n=e.default??e.createView??e.createHomeView;if(!n||typeof n!=`function`)throw Error(`window-frame view-mount: module has no default/createView factory`);let r=Me(n)?new n(t):n(t);if(je(r)){let e=r,n=e.render(t);if(!(n instanceof HTMLElement))throw Error(`window-frame view-mount: view.render() must return HTMLElement`);return{root:n,view:e}}if(r instanceof HTMLElement)return{root:r};throw Error(`window-frame view-mount: factory did not return View or HTMLElement`)}function Pe(e,t){return e.replaceChildren(t),()=>{t.remove(),e.replaceChildren()}}async function Fe(e,t,n){let{root:r,view:i}=Ne(await e(),n);r.classList.add(`wf-mounted-view`);let a=Pe(t,r);return J(i,`onMount`),J(i,`onShow`),()=>{J(i,`onHide`),J(i,`onUnmount`),a()}}var Ie=e((()=>{}));function Le(e){let t=e?.closest?.(`.env-shell-root`)??e?.closest?.(`env-shell-container`);if(!(t instanceof HTMLElement))return 0;let n=getComputedStyle(t).getPropertyValue(`--env-window-z-boost`).trim(),r=Number.parseInt(n,10);return Number.isFinite(r)?r:0}function Re(e){let t=e.closest?.(`.env-shell-root`)??e.closest?.(`env-shell-container`)??document.querySelector?.(`.env-shell-root, env-shell-container`);return t instanceof HTMLElement?t:null}function Y(e){let t=Re(e);if(!t)return;let n=!!t.querySelector?.(`ui-window[native-mode], ui-window[data-native-active]`);t.toggleAttribute(`data-env-native-task`,n)}function ze(e,t,n,r,o={}){let{bounds:s,z:c,maximizedMobile:l,minimized:u,desktopMaximized:d,visible:f,isMobileMq:p}=t;t.nativeMode||=i(!!o.startNative);let m=t.nativeMode;o.startNative&&(m.value=!0);let h=document.createElement(`ui-window`);h.setAttribute(`managed`,``),h.className=`env-ui-window`,h.setAttribute(`part`,`window`);{let e=document.documentElement.getAttribute(`data-theme`)||document.documentElement.style.colorScheme||``;(e===`light`||e===`dark`)&&(h.dataset.theme=e,h.style.colorScheme=e)}let g=document.createElement(`span`);g.slot=`title`,g.className=`env-ui-window__title`,g.textContent=t.title,n.slot=`content`,n.classList.add(`env-ui-window__body`),h.append(g,n),e.appendChild(h);let _=String(o?.managedViewKey??``).trim();_&&(h.setAttribute(`data-ui-window-view`,_),h.setAttribute(`data-wf-managed-view`,_));let v=null,y=()=>{o.onChromeChange?.(),Y(e)},b=()=>{h.style.right=``,h.style.bottom=``},x=()=>{h.style.left=`${X}px`,h.style.top=`${X}px`,h.style.right=`${X}px`,h.style.bottom=`${X}px`,h.style.width=`auto`,h.style.height=`auto`,h.style.removeProperty(`--ui-win-width`),h.style.removeProperty(`--ui-win-height`)},ee=()=>{h.style.left=`0`,h.style.top=`0`,h.style.right=`0`,h.style.bottom=`0`,h.style.width=`100%`,h.style.height=`100%`,h.style.removeProperty(`--ui-win-width`),h.style.removeProperty(`--ui-win-height`)},S=()=>{let t=!!p.matches,n=Le(e),r=(c.value??10)+n;h.style.zIndex=String(r),t&&(d.value&&=!1,!u.value&&!m.value&&!l.value&&(l.value=!0));let i=!!m.value,a=!!u.value,o=!t&&!!d.value&&!i&&!a,g=t&&!i&&!a,_=e.closest?.(`.env-shell-root`)??e.closest?.(`env-shell-container`)??document.querySelector?.(`.env-shell-root, env-shell-container`),v=_ instanceof HTMLElement&&_.hasAttribute(`data-status-overlay`)||document.documentElement.hasAttribute(`data-env-status-overlay`),y=_ instanceof HTMLElement&&_.hasAttribute(`data-standalone`)||document.documentElement.hasAttribute(`data-env-standalone`),S=v&&!i&&!a&&(g||o),C=y&&t&&!i&&!a;if(h.toggleAttribute(`native-mode`,i&&!a),h.toggleAttribute(`minimized`,a),h.toggleAttribute(`data-mobile-max`,g),h.toggleAttribute(`data-desk-max`,o),h.toggleAttribute(`data-status-gap`,S),h.toggleAttribute(`data-no-titlebar`,C),h.toggleAttribute(`maximized`,!a&&(o||g||i)),a){h.setVisible(!1),Y(e);return}if(h.setVisible(!!f.value),!f.value){Y(e);return}if(i){ee(),Y(e);return}if(g){h.style.left=`0`,h.style.top=`0`,h.style.right=`0`,h.style.bottom=`var(--env-mobile-dock-reserve, 3.25rem)`,h.style.width=`100%`,h.style.height=`auto`,Y(e);return}if(o){x(),Y(e);return}b(),h.applyBounds({x:s.x.value,y:s.y.value,w:s.w.value,h:s.h.value,z:r}),Y(e)},C=()=>{p.matches&&(m.value||(l.value=!0),d.value&&(d.value=!1,v&&=(s.x.value=v.x,s.y.value=v.y,s.w.value=v.w,s.h.value=v.h,null))),S(),y()},w=a(()=>{S()},[s.x,s.y,s.w,s.h,c,l,u,d,m,f],{triggerImmediately:!0});p.addEventListener(`change`,C),C();let T=()=>{S(),y()},E=e.closest?.(`.env-shell-root`)??e.closest?.(`env-shell-container`)??document.documentElement;E?.addEventListener?.(`env-chrome-surface`,T);let te=()=>{u.value&&(u.value=!1,f.value=!0),r();let t=Le(e),n=(c.value??10)+t;typeof h.bringToFront==`function`?h.bringToFront(n):(h.style.zIndex=String(n),h.toggleAttribute(`data-focused`,!0)),y()},D=e=>{let t=e.detail;m.value||d.value||l.value||u.value||(typeof t?.x==`number`&&(s.x.value=t.x),typeof t?.y==`number`&&(s.y.value=t.y))},ne=e=>{let t=e.detail;m.value||d.value||l.value||u.value||(typeof t?.w==`number`&&(s.w.value=t.w),typeof t?.h==`number`&&(s.h.value=t.h))},O=()=>{m.value&&=!1,d.value&&(d.value=!1,v&&=(s.x.value=v.x,s.y.value=v.y,s.w.value=v.w,s.h.value=v.h,null)),u.value=!0,S(),y()},k=()=>{if(m.value){j();return}if(p.matches){u.value=!1,l.value=!0,S(),y();return}if(u.value&&=!1,d.value){M();return}v={x:s.x.value,y:s.y.value,w:s.w.value,h:s.h.value},d.value=!0,S(),y()},A=()=>{u.value&&(u.value=!1,f.value=!0),!m.value&&!d.value&&!l.value&&(v={x:s.x.value,y:s.y.value,w:s.w.value,h:s.h.value}),d.value=!1,l.value=!1,m.value=!0,S(),y()},j=()=>{m.value&&(m.value=!1,v&&=(s.x.value=v.x,s.y.value=v.y,s.w.value=v.w,s.h.value=v.h,null),p.matches&&(l.value=!0),S(),y())},M=()=>{if(m.value){j();return}u.value&&(u.value=!1,f.value=!0),p.matches?l.value&&=!1:d.value&&(d.value=!1,v&&=(s.x.value=v.x,s.y.value=v.y,s.w.value=v.w,s.h.value=v.h,null)),S(),y()},N=!1,P=!1,F=t=>{if(t.preventDefault(),!(N||P)){N=!0;try{m.value&&=!1,f.value=!1,o.onClose?.()}catch(e){console.error(`[mount-ui-window] onClose failed`,e)}finally{if(!P){P=!0,w?.(),p.removeEventListener(`change`,C),E?.removeEventListener?.(`env-chrome-surface`,T);try{h.isConnected&&h.remove()}catch{}}Y(e)}}},I=0,re=()=>{let e=typeof performance<`u`?performance.now():Date.now();return e-I<280?!1:(I=e,!0)},ie=e=>{if(!(N||P)&&re()){if(e===`close`){F(new Event(`window-close`,{cancelable:!0}));return}if(e===`exit-native`){j();return}if(e===`maximize`){m.value||d.value||l.value?M():k();return}u.value?M():O()}},ae=e=>{let t=typeof e.composedPath==`function`?e.composedPath():[];for(let e of t){if(!(e instanceof Element))continue;let t=e.getAttribute?.(`data-ui-win-action`);if(t===`close`||t===`exit-native`||t===`maximize`||t===`minimize`)return t;if(e.matches?.(`.title-close`))return`close`;if(e.matches?.(`.title-exit-native`))return`exit-native`;if(e.matches?.(`.title-maximize`))return`maximize`;if(e.matches?.(`.title-minimize`))return`minimize`}return null},L=e=>{if(N||P||e.defaultPrevented)return;let t=ae(e);t&&(e.preventDefault(),e.stopPropagation(),ie(t))},R=null,z=()=>{let e=h.shadowRoot;if(!e||N||P)return;let t=e.querySelectorAll(`[data-ui-win-action], .title-minimize, .title-maximize, .title-close, .title-exit-native`);for(let e of t){let t=e.getAttribute(`data-ui-win-action`);if(t||(e.classList.contains(`title-close`)?t=`close`:e.classList.contains(`title-exit-native`)?t=`exit-native`:e.classList.contains(`title-maximize`)?t=`maximize`:e.classList.contains(`title-minimize`)&&(t=`minimize`)),!t)continue;e.setAttribute(`data-ui-win-action`,t);let n=t,r=e=>{e.defaultPrevented||(e.preventDefault(),e.stopPropagation(),ie(n))};e.onclick=r,e.onpointerup=e=>{e.button===0&&r(e)}}};if(z(),queueMicrotask(z),requestAnimationFrame(z),typeof MutationObserver<`u`){R=new MutationObserver(()=>z());let e=()=>{h.shadowRoot?R?.observe(h.shadowRoot,{childList:!0,subtree:!0}):requestAnimationFrame(e)};e()}return h.addEventListener(`window-focus`,te),h.addEventListener(`window-move`,D),h.addEventListener(`window-resize`,ne),h.addEventListener(`window-minimize`,O),h.addEventListener(`window-maximize`,k),h.addEventListener(`window-restore`,M),h.addEventListener(`window-native`,A),h.addEventListener(`window-exit-native`,j),h.addEventListener(`window-close`,F),h.addEventListener(`click`,L),h.addEventListener(`pointerup`,L),()=>{if(!P){P=!0,N=!0,w?.(),R?.disconnect(),R=null,p.removeEventListener(`change`,C),E?.removeEventListener?.(`env-chrome-surface`,T),h.removeEventListener(`window-focus`,te),h.removeEventListener(`window-move`,D),h.removeEventListener(`window-resize`,ne),h.removeEventListener(`window-minimize`,O),h.removeEventListener(`window-maximize`,k),h.removeEventListener(`window-restore`,M),h.removeEventListener(`window-native`,A),h.removeEventListener(`window-exit-native`,j),h.removeEventListener(`window-close`,F),h.removeEventListener(`click`,L),h.removeEventListener(`pointerup`,L);try{m.value&&=!1,h.isConnected&&h.remove()}catch{}Y(e)}}}var X,Be=e((()=>{n(),L(),X=8}));function Z(e,t){let n=typeof CSS<`u`&&typeof CSS.escape==`function`?CSS.escape(t):t.replace(/\\/g,`\\\\`).replace(/"/g,`\\"`),r=e.querySelector(`:scope > ui-window[data-ui-window-view="${n}"]`)||e.querySelector(`:scope > ui-window[data-wf-managed-view="${n}"]`)||e.querySelector(`:scope > section.wf-frame[data-wf-managed-view="${n}"]`);return r instanceof HTMLElement?r:null}function Ve(e){let t=e.closest?.(`.env-shell-root`)??e.closest?.(`env-shell-container`)??e.parentElement;if(!(t instanceof HTMLElement))return 0;let n=getComputedStyle(t).getPropertyValue(`--env-window-z-boost`).trim(),r=Number.parseInt(n,10);return Number.isFinite(r)?r:0}function He(e){return null}function Q(e,t){let n=K(e)||String(e||``).trim().toLowerCase();if(t?.[n])return t[n];if(Ke[n])return Ke[n];let r=String(e||``).trim();return r?r.charAt(0).toUpperCase()+r.slice(1):`View`}function Ue(e,t){let n=document.createElement(`div`);return n.className=`wf-view-placeholder`,n.setAttribute(`part`,`placeholder`),n.innerHTML=`<p class="wf-view-placeholder__title">${Q(e,t)}</p>
<p class="wf-view-placeholder__hint">No window module is registered for this shortcut in environment-shell yet.</p>`,n}function We(e,t={}){let n=o(120),r=new Map,i=!1,a=null,s=()=>{t.onTaskingChange?.(c())},c=()=>{let n=[];for(let i of r.values())Z(e,i.key)&&n.push({id:i.key,title:i.model.title||Q(i.key,t.viewTitles),icon:Ge[i.key]||`app-window`,focused:a===i.key,minimized:!!i.model.minimized.value,visible:!!i.model.visible.value});return n},l=()=>{for(let t of r.values()){let n=Z(e,t.key);if(!n)continue;n.toggleAttribute(`data-focused`,!1);let r=n.clearFocused;typeof r==`function`&&r.call(n)}},u=e=>{for(let[t,n]of r)e&&t===e||n.model.nativeMode?.value&&(n.model.nativeMode.value=!1)},d=(t,r)=>{if(a===r&&!t.minimized.value){let t=Z(e,r);if(t&&t===e.lastElementChild)return}n.value+=1,t.z.value=n.value,t.minimized.value=!1,t.visible.value=!0,a=r,t.nativeMode?.value&&u(r);let i=Z(e,r);if(i){let n=Ve(e),r=(t.z.value??10)+n;l(),i.style.zIndex=String(r),i.toggleAttribute(`data-focused`,!0);let a=i.bringToFront;typeof a==`function`&&a.call(i,r),i.parentElement===e&&e.appendChild(i)}s()},f={},p=t.overlayMountHost?Se(t.overlayMountHost):null;f.resolveOverlayMountPoint=e=>{if(p)return p;if(t.environmentShellHost){let e=T(t.environmentShellHost);if(e)return e}return te(e??null)};let m=e=>{let n=K(e)||String(e||``).trim().toLowerCase();return t.viewLoaders?.[n]||He(n)},h=()=>{let i=t.readerWindow;if(!i?.content)return;let o=q,c=r.get(o);if(c&&Z(e,o)){d(c.model,o);return}if(c&&!Z(e,o)){r.delete(o);try{c.disposeFrame()}catch{}}let l=i.seed||{},u=Ee(i.title||Q(o,t.viewTitles),{x:l.x??96,y:l.y??96,w:l.w??420,h:l.h??340,z:l.z??n.value+1});n.value=u.z.value;let f=()=>{};f=ze(e,u,i.content,()=>d(u,o),{managedViewKey:o,onChromeChange:s,onClose:()=>{let e=r.get(o);if(e){r.delete(o),a===o&&(a=null);try{e.disposeFrame()}catch{}s()}}}),r.set(o,{key:o,model:u,disposeFrame:f}),d(u,o)},g=(o,c)=>{if(i)return;let l=K(String(o||``));if(!l||l===`home`||l===`airpad`)return;if(Oe(l)&&t.readerWindow?.content){h();return}let p=new Set((t.startNativeViewIds||[]).map(e=>K(String(e||``)))).has(l)||String(c?.native||``)===`1`||String(c?.params?.native||``)===`1`,g=r.get(l);if(g&&Z(e,l)){d(g.model,l),p&&g.model.nativeMode&&(g.model.nativeMode.value=!0,g.model.minimized.value=!1,g.model.visible.value=!0,u(l));return}if(g&&!Z(e,l)){g.disposeView?.(),r.delete(l);try{g.disposeFrame()}catch{}}let _=m(l),v=document.createElement(`div`);v.className=`wf-view-host env-ui-window__view-host`,v.setAttribute(`part`,`view-host`);{let e=document.createElement(`p`);e.className=`wf-view-placeholder__hint`,e.style.cssText=`margin:1rem;font:400 .9rem/1.4 system-ui,sans-serif;opacity:.8`,e.textContent=`Loading ${Q(l,t.viewTitles)}…`,v.append(e)}let y=r.size*24,b=Ee(Q(l,t.viewTitles),{x:72+y,y:72+y,w:640,h:480,z:n.value+1});n.value=b.z.value;let x=()=>{};x=ze(e,b,v,()=>d(b,l),{managedViewKey:l,startNative:p,onChromeChange:s,onClose:()=>{let e=r.get(l);if(e){r.delete(l),a===l&&(a=null);try{e.disposeView?.()}catch{}try{e.disposeFrame()}catch{}s()}}}),p&&(b.nativeMode.value=!0,u(l));let ee={key:l,model:b,disposeFrame:x,disposeView:void 0};r.set(l,ee),d(b,l);let S={...c||{},shellContext:f};if(!_){v.replaceChildren(Ue(l,t.viewTitles));return}Fe(_,v,S).then(e=>{if(i){e();return}let t=r.get(l);t&&(t.disposeView=e),(p||b.nativeMode?.value)&&(b.nativeMode.value=!0,b.minimized.value=!1,b.visible.value=!0,u(l),d(b,l))},e=>{console.error(`[workspace-window-layer] mountViewModule failed for view "${l}"`,e),v.replaceChildren(Ue(l,t.viewTitles))})};return f.navigate=(e,t)=>{g(String(e),t)},f.openView=(e,t)=>{g(String(e),t)},{shellContext:f,dispose:()=>{if(!i){i=!0;for(let e of r.values())e.disposeView?.(),e.disposeFrame();r.clear(),a=null,s()}},focusWindow:t=>{let n=K(String(t||``)),i=r.get(n);return!i||!Z(e,n)?!1:(d(i.model,n),!0)},minimizeWindow:t=>{let n=K(String(t||``)),i=r.get(n);return!i||!Z(e,n)?!1:(i.model.nativeMode?.value&&(i.model.nativeMode.value=!1),i.model.desktopMaximized?.value&&(i.model.desktopMaximized.value=!1),i.model.visible.value=!0,i.model.minimized.value=!0,a===n&&(a=null,l()),s(),!0)},minimizeAllWindows:()=>{if(!i){u(null),a=null,l();for(let t of r.values())Z(e,t.key)&&(t.model.desktopMaximized?.value&&(t.model.desktopMaximized.value=!1),t.model.visible.value=!0,t.model.minimized.value=!0);s()}},closeWindow:e=>{let t=K(String(e||``)),n=r.get(t);if(!n)return!1;r.delete(t),a===t&&(a=null);try{n.disposeView?.()}catch{}try{n.disposeFrame()}catch{}return s(),!0},blurWindows:()=>{u(null),a=null,l(),s()},closeAllWindows:()=>{if(!i){u(null);for(let e of[...r.values()]){try{e.disposeView?.()}catch{}try{e.disposeFrame()}catch{}}r.clear(),a=null,s()}},enterNative:t=>{let n=K(String(t||``)),i=r.get(n);return!i||!Z(e,n)?!1:(u(n),i.model.nativeMode.value=!0,i.model.minimized.value=!1,i.model.visible.value=!0,d(i.model,n),!0)},exitNative:e=>{if(e){let t=K(String(e||``)),n=r.get(t);n?.model.nativeMode&&(n.model.nativeMode.value=!1),s();return}u(null),s()},listWindowTasks:c,getFocusedKey:()=>a}}var Ge,Ke,qe=e((()=>{n(),E(),De(),Ae(),Ie(),we(),Be(),Ge={home:`house`,viewer:`article`,markdown:`article`,explorer:`books`,settings:`gear-six`,workcenter:`briefcase`,history:`clock-counter-clockwise`,editor:`pencil-simple-line`,network:`wifi-high`,task:`list-checks`,event:`calendar`,bonus:`gift`,person:`address-book`},Ke={home:`Home`,viewer:`Markdown`,explorer:`Explorer`,settings:`Settings`,workcenter:`Work Center`,history:`History`,editor:`Editor`,network:`Network`,task:`Plan`,event:`Events`,bonus:`Bonuses`,person:`Contacts`}}));function Je(e,t=Xe){try{localStorage.getItem(t)||localStorage.setItem(t,e)}catch{}}function Ye(e,t){let n=M(),{element:r,dispose:i}=N(t.shell,t.introHtml,n),a=document.createElement(`div`);a.className=`env-shell-chrome wf-chrome-no-select`;let o;t.taskbar?(o=ie({...t.taskbar,device:n}),a.append(o.element,r)):a.append(r);let s=(e.classList?.contains(`env-shell-root`)?e:null)||e.closest?.(`.env-shell-root`)||e.closest?.(`env-shell-container`)||e;j(s),globalThis.__ENV_OVERLAY_MOUNT__=Se,Se(s),A();let c=typeof matchMedia==`function`?matchMedia(`(min-width: 641px) and (not ((pointer: coarse) or (hover: none)))`):null,l=typeof matchMedia==`function`?[`(display-mode: standalone)`,`(display-mode: fullscreen)`,`(display-mode: minimal-ui)`,`(display-mode: browser)`,`(display-mode: window-controls-overlay)`].map(e=>matchMedia(e)):[],u=()=>{let e=!c||c.matches,t=O(),n=ae(),r=R({desktop:e,standalone:n,displayMode:t});a.toggleAttribute(`data-desktop`,e),a.toggleAttribute(`data-standalone`,n),a.toggleAttribute(`data-status-overlay`,r),a.dataset.chromeLayout=e?`desktop`:`mobile`,a.dataset.displayMode=t,s.toggleAttribute(`data-standalone`,n),s.toggleAttribute(`data-status-overlay`,r),s.dataset.displayMode=t,s.style.setProperty(`--env-status-inset-top`,r?`max(2rem, env(safe-area-inset-top, 0px))`:`0px`),document.documentElement.toggleAttribute(`data-env-status-overlay`,r),document.documentElement.toggleAttribute(`data-env-standalone`,n);try{s.dispatchEvent(new CustomEvent(`env-chrome-surface`,{bubbles:!0,detail:{statusOverlay:r,standalone:n,displayMode:t,desktop:e}}))}catch{}};u(),c?.addEventListener?.(`change`,u);for(let e of l)e.addEventListener?.(`change`,u);document.addEventListener(`fullscreenchange`,u),document.addEventListener(`webkitfullscreenchange`,u);let d=ne(s);return _e(e)&&(a.slot=D.overlay),e.appendChild(a),{root:a,device:n,statusBar:r,taskbar:o,disposeDevice:()=>{c?.removeEventListener?.(`change`,u);for(let e of l)e.removeEventListener?.(`change`,u);document.removeEventListener(`fullscreenchange`,u),document.removeEventListener(`webkitfullscreenchange`,u),d(),i(),n.dispose(),j(null)}}}var Xe,Ze=e((()=>{I(),F(),xe(),we(),E(),P(),re(),k(),I(),F(),Te(),P(),re(),k(),qe(),Be(),Xe=`rs-wallpaper-image`})),Qe,$e=e((()=>{Qe=`*,
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
`})),et,tt=e((()=>{et=`/* environment-shell — default layout + chrome for wallpaper / home / window-frame hosts.
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
  --env-status-fg: light-dark(#1c1c1e, #f5f5f7);
  --env-status-fg-muted: color-mix(in oklab, var(--env-status-fg) 78%, transparent);
  /* Launcher captions: wallpaper luminance probe overwrites these (attachStatusBarContrast). */
  --env-launcher-fg: #f7f7f8;
  --env-launcher-fg-shadow: rgb(0 0 0 / 0.88);
  --env-launcher-fg-glow: rgb(0 0 0 / 0.45);
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
  min-block-size: 100dvb;
  /* Sync with shadow \`:host\`: do not clip \`position:fixed\` descendants (overlay slot context menus). */
  overflow: visible;
  /* Added to \`mountWindowFrame\` z-index so \`.wf-frame\` stacks above the home layer. */
  --env-window-z-boost: 400;
  /*
   * WHY: Mobile chrome is a short Home nav (~3rem), not the tall desktop taskbar.
   * Home padding and ui-window bottom inset must share the same reserve or the grid
   * sits in a dead band and icons look “stuck” / nav appears missing.
   */
  --env-mobile-dock-reserve: calc(3rem + env(safe-area-inset-bottom, 0px));
  --env-shell-chrome-stack-reserve: var(--env-mobile-dock-reserve);
}
@media (min-width: 641px) {
  .env-shell-root {
    --env-shell-chrome-stack-reserve: 7.5rem;
    --env-mobile-dock-reserve: 0px;
  }
}
.env-shell-root {
  /* Overlay mode: top inset for home launcher under transparent statusband. */
}
.env-shell-root[data-status-overlay] {
  --env-status-inset-top: max(2rem, env(safe-area-inset-top, 0px));
  /* Overlay status sits on wallpaper — prefer light glyphs on photo, dark when light theme UI. */
  --env-status-fg: light-dark(#1c1c1e, #f5f5f7);
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
}

.env-shell-workspace {
  position: relative;
  z-index: 1;
  min-block-size: 100dvb;
  inline-size: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: stretch;
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
  --view-bg: var(--color-surface);
  --view-fg: var(--color-on-surface);
  --view-code-bg: var(--color-surface-container-low);
  background-color: var(--view-bg);
  color: var(--view-fg);
  color: contrast-color(var(--view-bg));
}
html[data-theme=light] {
  /* Launcher tiles: force dark glyph ink immediately (no wait for Settings sheet). */
}
html[data-theme=light] .env-shell-root .ui-ws-item-icon ui-icon {
  color-scheme: light only;
  --icon-color: --u2-color-mod(var(--base-color, var(--color-primary, #5a7fff)), 900);
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
html[data-theme=dark] .env-shell-root .ui-ws-item-icon ui-icon {
  color-scheme: dark only;
  --icon-color: --u2-color-mod(var(--base-color, var(--color-primary, #5a7fff)), 100);
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
}

/* Bridge: document chrome styles live next to the statusbar component after regroup. */
/*
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
    color: contrast-color(color-mix(in oklch, oklch(14% 0.02 280deg) 82%, transparent));
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
}
/* Bridge: chrome/taskbar host styles live next to the taskbar component after regroup. */
/*
 * Filename: statusbar.scss
 * FullPath: modules/projects/fl.ui/src/ui/navigation/statusbar/statusbar.scss
 * Change date and time: 14.00.00_31.07.2026
 * Reason for changes: Mobile/fullscreen transparent overlay statusbar + desktop footer.
 */
/*
 * Filename: TaskBar.scss
 * FullPath: modules/projects/fl.ui/src/ui/navigation/taskbar/scss/TaskBar.scss
 * Change date and time: 13.35.00_31.07.2026
 * Reason for changes: Reconnect after chrome.scss split — no cross-package Sass @use (use CSS var).
 */
/* Taskbar / env chrome (document + host). Former environment-shell/scss/chrome.scss. */
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
    color: contrast-color(var(--wf-md-on-surface-variant, oklch(78% 0.03 274deg)));
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
    color: contrast-color(color-mix(in oklab, #1a1a1a 72%, transparent));
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
    color: contrast-color(inherit(background-color));
    opacity: 1;
  }
  .env-shell-taskbar ui-task[data-env-active=true],
  .env-shell-taskbar ui-task[data-active],
  .env-shell-taskbar ui-task[data-focus] {
    outline: none;
    color: contrast-color(inherit(background-color));
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
    color: contrast-color(inherit(background-color));
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
    color: contrast-color(inherit(background-color));
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
/*
 * Filename: statusbar.scss
 * FullPath: modules/projects/fl.ui/src/ui/navigation/statusbar/statusbar.scss
 * Change date and time: 14.00.00_31.07.2026
 * Reason for changes: Mobile/fullscreen transparent overlay statusbar + desktop footer.
 */
@layer ui-navbar {
  /* Long-press process switcher sheet above the nav bar. */
  .env-shell-navbar__switcher {
    position: fixed;
    inset-inline: 0.75rem;
    /*inset-block-end: calc(100% + 0.4rem);*/
    inset-block-end: 4rem;
    z-index: 5;
    max-block-size: min(50dvb, 20rem);
    overflow: auto;
    padding: 0.35rem;
    border-radius: 0.85rem;
    background: color-mix(in oklch, #1c1c1e 96%, transparent);
    border: 1px solid color-mix(in oklch, #fff 12%, transparent);
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.45);
    backdrop-filter: blur(18px);
    -webkit-backdrop-filter: blur(18px);
    color: #f2f2f7;
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
    background: color-mix(in oklch, #fff 10%, transparent);
  }
  .env-shell-navbar__switcher-item[data-active] {
    background: color-mix(in oklch, #60cdff 18%, transparent);
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
    background: color-mix(in oklch, #ff6b6b 22%, transparent);
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

/* Reserved: start-menu / app-launcher host (mount beside taskbar or slide-over).
   Example: <div class="env-shell-app-menu" hidden>…</div> */
.env-shell-app-menu {
  /* Placeholder keeps selector stable for future SCSS without empty ruleset warnings. */
  pointer-events: auto;
}

.env-shell-app-menu:empty {
  display: none;
}

/* COMPAT: Extension / embed hosts may set \`data-env-crx="1"\` and extend in their bundle. */
.env-shell-root[data-env-crx="1"] {
  isolation: isolate;
}`}));function $(){try{let e=new URLSearchParams(globalThis.location?.search||``);if(e.get(`native`)!==`1`&&e.get(`native`)!==`true`)return[];let t=(e.get(`view`)||``).trim().toLowerCase(),n=String(globalThis.location?.pathname||``).replace(/^\/+|\/+$/g,``).toLowerCase(),r=n.match(/^(cwsp|markdown|kvm)\/(.+)$/);r?.[2]&&(n=r[2]);let i=n.split(`/`)[0]||``,a=((i&&i!==`home`?i:t)||`explorer`).split(`/`)[0]||`explorer`;return!a||a===`home`?[`explorer`]:[a===`markdown`?`viewer`:a]}catch{return[]}}function nt(e){let t=e||{};return t.native===1||t.native===`1`||t.native===!0||t.params?.native===`1`||t.params?.native===`true`}function rt(e,t){if(!$().includes(e)&&!nt(t))return t||{};let n={...t||{}};return n.native=`1`,n.params={...n.params||{},native:`1`},n}async function it(){try{let e=await g(()=>import(`./launcher-state-CLD5f3Yn.js`),[],import.meta.url),t=e.speedDialItems;if(!t||typeof t.findIndex!=`function`)return;let n=!1;for(let e=t.length-1;e>=0;e--){let r=t[e],i=String(r?.meta?.view||``).toLowerCase(),a=String(r?.id||``).toLowerCase();(i===`airpad`||a.includes(`airpad`))&&(t.splice(e,1),n=!0)}let r=(n,r,i,a,o)=>{!f(o)&&o!==`home`||t.find?.(e=>String(e?.id)===n||String(e?.meta?.view||``).toLowerCase()===o)||e.addSpeedDialItem({id:n,cell:u(r),icon:i,label:a,action:`open-view`,meta:{view:o}})};r(`shortcut-network`,[0,0],`wifi-high`,`Network`,`network`),r(`shortcut-settings`,[1,0],`gear-six`,`Settings`,`settings`),r(`shortcut-explorer`,[2,0],`books`,`Explorer`,`explorer`),r(`shortcut-viewer`,[3,0],`article`,`Markdown`,`viewer`),r(`shortcut-history`,[0,1],`clock-counter-clockwise`,`History`,`history`),n&&e.persistSpeedDialItems?.()}catch(e){console.warn(`[EnvironmentShell] speed-dial seed skipped`,e)}}function at(e){return new ct}var ot,st,ct,lt=e((()=>{n(),s(),ee(),fe(),C(),E(),d(),m(),Ze(),Ie(),$e(),tt(),h(),he(),ot={network:()=>g(()=>import(`./src-CbywOwNB.js`),[],import.meta.url),settings:()=>g(()=>import(`./src-Bqi3prai.js`),[],import.meta.url),explorer:()=>g(()=>import(`./_cwsp-disabled-entry_view-explorer-D-8MVImu.js`),[],import.meta.url),viewer:()=>g(()=>import(`./_cwsp-disabled-entry_view-viewer-CeLlddQ8.js`),[],import.meta.url),markdown:()=>g(()=>import(`./_cwsp-disabled-entry_view-viewer-CeLlddQ8.js`),[],import.meta.url),history:()=>g(()=>import(`./src-DmCn9x_C.js`),[],import.meta.url),workcenter:()=>g(()=>import(`./_cwsp-disabled-entry_view-workcenter-DV1PlEAR.js`),[],import.meta.url),editor:()=>g(()=>import(`./_cwsp-disabled-entry_view-editor-BtWewwh9.js`),[],import.meta.url),home:()=>g(()=>import(`./_cwsp-disabled-entry_view-home-gqgAY_Ff.js`),[],import.meta.url)},st=[`home`,`network`,`settings`,`explorer`,`viewer`,`history`,`workcenter`,`editor`],ct=class extends w{id=`environment`;name=`Environment`;layout={hasSidebar:!1,hasToolbar:!1,hasTabs:!1,supportsMultiView:!0,supportsWindowing:!0};workspaceEl=null;homeMountEl=null;windowLayer=null;chromeDispose=null;homeUnmount=null;shellActivityDispose=null;focusedTaskId=l(`home`);setFocusedTaskId=null;syncWindowTasks=null;navEcho=l(``);mqLabel=l(`desktop`);_monoNativeBoot=!1;_pendingHomeMount=null;createLayout(){return document.createElement(`div`)}getStylesheet(){return et}async mount(e){if(this.mounted){console.warn(`[${this.id}] Shell already mounted`);return}this.container=e,Je(`/assets/wallpaper.jpg`),he();try{await c(Qe),t(Qe)}catch(e){console.warn(`[EnvironmentShell] wf-demo tokens failed`,e)}let n=this.getStylesheet();if(n)try{await c(n),t(n)}catch(e){console.warn(`[EnvironmentShell] env shell styles failed`,e)}try{S()}catch{}try{document.documentElement.dataset.cwspSurface=`environment`}catch{}let r=ge();r.className=`env-shell-root wf-demo-root`,r.setAttribute(`data-shell`,`environment`),r.setAttribute(`data-shell-system`,`task-tab`),r.style.gridColumn=`content-column`,r.style.gridRow=`content-row`,r.style.alignSelf=`stretch`,r.style.justifySelf=`stretch`,r.style.minInlineSize=`0`,r.style.minBlockSize=`0`,r.style.inlineSize=`100%`,r.style.blockSize=`100%`,r.style.pointerEvents=`auto`;let i=document.createElement(`div`);i.slot=D.underlying,i.className=`env-shell-wallpaper`,i.setAttribute(`data-env-wallpaper`,``);let a=document.createElement(`div`);a.className=`env-shell-workspace`,a.setAttribute(`data-shell-content`,``);let o=document.createElement(`div`);o.className=`env-shell-home-mount`,o.style.display=`flex`,o.style.flex=`1 1 auto`,o.style.flexDirection=`column`,o.style.alignSelf=`stretch`,o.style.minHeight=`0`,o.style.minWidth=`0`,a.appendChild(o),r.append(i,a),e.replaceChildren(r),this.rootElement=r,this.workspaceEl=a,this.homeMountEl=o,this.contentContainer=a,this.overlayContainer=r.overlayMount??r.shadowRoot?.querySelector?.(`[data-shell-overlays]`)??null,this.mounted=!0,this.shellActivityDispose=p(this.id);try{v(),y(i)}catch(e){console.warn(`[EnvironmentShell] wallpaper init failed`,e)}let s={};for(let e of st){if(e===`home`||!f(e)&&e!==`viewer`)continue;let t=ot[e];t&&(s[e]=t)}s.viewer&&(s.markdown=s.viewer);let u=matchMedia(`(max-width: 640px)`);this.mqLabel.value=u.matches?`mobile`:`desktop`,u.addEventListener(`change`,()=>{this.mqLabel.value=u.matches?`mobile`:`desktop`});let d=Ye(r,{shell:{selectedPath:l(``),viewerStatus:l(``),navEcho:this.navEcho,mqLabel:this.mqLabel},introHtml:`<p><strong>CWSP environment</strong> — Speed Dial / desktop launcher. Views open in <code>ui-window</code>.</p>`,taskbar:{focusedTaskId:this.focusedTaskId,onHome:()=>this.focusHome(),onViewer:()=>{this.openInWindow(`viewer`)},onWindowTask:e=>{this.openInWindow(e)},onMinimizeWindow:e=>{let t=String(e||``).trim().toLowerCase();t&&this.windowLayer?.minimizeWindow?.(t)&&(this.setFocusedTaskId?.(`home`),this.focusedTaskId.value=`home`)},onCloseWindow:e=>{let t=String(e||``).trim().toLowerCase();t&&(this.windowLayer?.closeWindow?.(t),String(this.focusedTaskId.value||``)===t&&(this.setFocusedTaskId?.(`home`),this.focusedTaskId.value=`home`))}}});this.setFocusedTaskId=d.taskbar?.setFocusedTaskId??null,this.syncWindowTasks=d.taskbar?.syncWindowTasks??null,this.chromeDispose=()=>{d.disposeDevice(),d.taskbar?.dispose?.(),d.root.remove()};let m=$();this.windowLayer=We(a,{overlayMountHost:r,environmentShellHost:r,viewLoaders:s,startNativeViewIds:m,viewTitles:{network:`Network`,settings:`Settings`,explorer:`Explorer`,viewer:`Markdown`,history:`History`,workcenter:`Work Center`,editor:`Editor`},onTaskingChange:e=>{this.syncWindowTasks?.(e);let t=e.find(e=>e.focused);t&&this.setFocusedTaskId?.(t.id)}});let h={...this.windowLayer.shellContext,navigate:(e,t)=>{this.navEcho.value=`shell.navigate("${e}")`,this.routeView(String(e),t)},openView:(e,t)=>{this.navEcho.value=`shell.openView("${e}")`,this.routeView(String(e),t)},showMessage:e=>{this.showMessage(typeof e==`string`?e:String(e??``))}};if(it(),m.length>0){for(let e of m)this.openInWindow(e,{native:`1`,params:{native:`1`}});this._monoNativeBoot=!0,this._pendingHomeMount={homeMount:o,shellContext:{shellContext:h}}}else this.mountHomeDesktop(o,h)}mountHomeDesktop(e,t){Fe(()=>g(()=>import(`./_cwsp-disabled-entry_view-home-gqgAY_Ff.js`),[],import.meta.url),e,{shellContext:t}).then(e=>{this.homeUnmount=e}).catch(t=>{console.warn(`[EnvironmentShell] home-view failed`,t),e.innerHTML=`<p style="color:#eee;padding:1rem;font-family:system-ui">Home view failed to load.</p>`})}ensureHomeMounted(){let e=this._pendingHomeMount;!e||this.homeUnmount||(this._pendingHomeMount=null,this._monoNativeBoot=!1,this.mountHomeDesktop(e.homeMount,e.shellContext.shellContext))}focusHome(){if(this.ensureHomeMounted(),typeof this.windowLayer?.minimizeAllWindows==`function`)this.windowLayer.minimizeAllWindows();else{for(let e of this.windowLayer?.listWindowTasks?.()??[])this.windowLayer?.minimizeWindow?.(e.id);this.windowLayer?.blurWindows?.()}this.setFocusedTaskId?.(`home`),this.focusedTaskId.value=`home`,this.currentView.value=`home`}openInWindow(e,t){let n=String(e||``).trim().toLowerCase();if(!n||n===`airpad`)return;let r=rt(n,t);if(this.windowLayer?.focusWindow(n)||this.windowLayer?.shellContext.openView?.(n,r),nt(r)){let e=()=>{this.windowLayer?.enterNative?.(n),this.preserveNativeDeepLink(n)};e(),requestAnimationFrame(e),setTimeout(e,0)}this.setFocusedTaskId?.(n===`markdown`?`viewer`:n),this.currentView.value=n}preserveNativeDeepLink(e){if(!(typeof location>`u`||typeof history>`u`))try{let t=String(e||``).trim().toLowerCase();if(!t||t===`home`)return;let n=new URLSearchParams(location.search||``);n.set(`shell`,this.id),n.set(`native`,`1`),n.set(`view`,t);let r=`${`/${t}`}?${n.toString()}`;`${location.pathname}${location.search}${location.hash||``}`!==r&&history.replaceState({viewId:t,params:Object.fromEntries(n)},``,r)}catch{}}async routeView(e,t){let n=String(e||``).trim().toLowerCase();if(!(!n||n===`airpad`)){if(n===`home`){this.focusHome();return}this.openInWindow(n,t)}}async navigate(e,t,n){let r=String(e||`home`).toLowerCase();if(r===`airpad`){this.showMessage(`AirPad view is disabled in environment shell`);return}if(r===`home`){let e=$();if(e.length){for(let n of e)this.openInWindow(n,{native:`1`,params:{native:`1`,...t||{}}});return}this.focusHome();try{let e=new URLSearchParams(t||{});e.set(`shell`,this.id),e.delete(`native`);let n=e.toString()?`?${e.toString()}`:``,r=`${location.pathname}${n}`;`${location.pathname}${location.search}`!==r&&history.replaceState({viewId:`home`,params:t},``,r)}catch{}return}let i={};try{i=Object.fromEntries(new URLSearchParams(location.search||``))}catch{i={}}let a={...i,...t||{}},o={params:a};(a.native===`1`||a.native===`true`||$().includes(r))&&(o.native=`1`,o.params={...a,native:`1`}),this.openInWindow(r,o)}unmount(){try{this.homeUnmount?.()}catch{}this.homeUnmount=null;try{this.windowLayer?.dispose()}catch{}this.windowLayer=null;try{this.chromeDispose?.()}catch{}this.chromeDispose=null;try{this.shellActivityDispose?.()}catch{}if(this.shellActivityDispose=null,this.mounted&&this.container&&this.rootElement)try{this.container.contains(this.rootElement)&&this.rootElement.remove()}catch{}this.rootElement=null,this.contentContainer=null,this.overlayContainer=null,this.workspaceEl=null,this.homeMountEl=null,this.container=null,this.mounted=!1}}}));export{at as n,lt as r,ct as t};