import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";var t,n,r,i,a,o,s,c,l,u,d,f,p,m,h,g,_=e((()=>{t={containerId:`rs-toast-layer`,position:`bottom`,maxToasts:5,zIndex:2147483647},n=3e3,r=200,i=400,a=``,o=0,s=e=>`${e.kind||`info`}\0${e.position||t.position}\0${e.message}`,c=(e,t,n)=>{for(let r of Array.from(e?.children??[]))if(r instanceof HTMLElement&&r.classList.contains(`rs-toast`)&&r.getAttribute(`data-kind`)===n&&r.textContent===t)return!0;return!1},l=`
:host {
    all: initial !important;
    position: fixed !important;
    inset: 0 !important;
    display: block !important;
    pointer-events: none !important;
    z-index: var(--shell-toast-z, 2147483647) !important;
    overflow: visible !important;
}

.rs-toast-layer {
    position: fixed;
    z-index: 1;
    pointer-events: none;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 16px 20px;
    gap: 8px;
    max-block-size: 80dvh;
    max-block-size: 80dvb;
    overflow: hidden;
    box-sizing: border-box;
    margin: 0;
    border: none;
    background: transparent;
}

.rs-toast-layer[data-position="bottom"],
.rs-toast-layer:not([data-position]) {
    inset-block-end: 24px;
    inset-block-start: auto;
    inset-inline: 0;
    justify-content: flex-end;
}

.rs-toast-layer[data-position="top"] {
    inset-block-start: 24px;
    inset-block-end: auto;
    inset-inline: 0;
    justify-content: flex-start;
}

.rs-toast-layer[data-position="top-left"] {
    inset-block-start: 24px;
    inset-inline-start: 16px;
    inset-inline-end: auto;
    align-items: flex-start;
}

.rs-toast-layer[data-position="top-right"] {
    inset-block-start: 24px;
    inset-inline-end: 16px;
    inset-inline-start: auto;
    align-items: flex-end;
}

.rs-toast-layer[data-position="bottom-left"] {
    inset-block-end: 24px;
    inset-inline-start: 16px;
    inset-inline-end: auto;
    align-items: flex-start;
}

.rs-toast-layer[data-position="bottom-right"] {
    inset-block-end: 24px;
    inset-inline-end: 16px;
    inset-inline-start: auto;
    align-items: flex-end;
}

.rs-toast {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 10px 14px;
    max-inline-size: min(90vw, 28rem);
    inline-size: fit-content;
    min-block-size: 2.25rem;
    box-sizing: border-box;

    border-radius: 10px;
    border: 1px solid rgba(248, 250, 252, 0.14);
    background-color: #0f172a;
    color: #f8fafc;
    box-shadow: 0 10px 28px rgba(2, 6, 23, 0.45);

    font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    font-size: 13px;
    font-weight: 500;
    letter-spacing: 0.01em;
    line-height: 1.4;
    white-space: pre-wrap;
    overflow-wrap: anywhere;
    word-break: break-word;
    text-align: center;

    pointer-events: auto;
    user-select: none;
    -webkit-user-select: none;
    cursor: default;

    opacity: 0;
    transform: translateY(12px) scale(0.96);
    transition:
        opacity 180ms ease-out,
        transform 180ms cubic-bezier(0.16, 1, 0.3, 1);
}

.rs-toast[data-visible] {
    opacity: 1;
    transform: translateY(0) scale(1);
}

.rs-toast:active {
    transform: scale(0.98);
}

.rs-toast[data-kind="info"] {
    background-color: #0f172a;
    color: #f8fafc;
    border-color: rgba(148, 163, 184, 0.35);
}

.rs-toast[data-kind="success"] {
    background-color: #166534;
    color: #f0fdf4;
    border-color: rgba(187, 247, 208, 0.35);
}

.rs-toast[data-kind="warning"] {
    background-color: #b45309;
    color: #fffbeb;
    border-color: rgba(253, 230, 138, 0.4);
}

.rs-toast[data-kind="error"] {
    background-color: #b91c1c;
    color: #fef2f2;
    border-color: rgba(254, 202, 202, 0.4);
}

@media (prefers-reduced-motion: reduce) {
    .rs-toast,
    .rs-toast[data-visible] {
        transition-duration: 0ms;
        transform: none;
    }
}

@media print {
    :host,
    .rs-toast-layer,
    .rs-toast {
        display: none !important;
    }
}
`,u=new Map,d=new Map,f=(e,t=document)=>{let n=`${e.containerId}-${e.position}`,r=u.get(n),i=d.get(n);if(r?.isConnected&&i?.isConnected)return r.setAttribute(`data-position`,e.position),i.style.setProperty(`--shell-toast-z`,String(e.zIndex)),{host:i,layer:r};u.delete(n),d.delete(n);let a=t.getElementById(e.containerId);a||(a=t.createElement(`div`),a.id=e.containerId,a.setAttribute(`data-cwsp-toast-host`,``),a.style.cssText=[`all: initial`,`position: fixed`,`inset: 0`,`display: block`,`pointer-events: none`,`z-index: ${e.zIndex}`,`overflow: visible`,`margin: 0`,`padding: 0`,`border: none`,`background: transparent`].join(`;`),(t.body||t.documentElement).appendChild(a)),a.style.setProperty(`--shell-toast-z`,String(e.zIndex));let o=a.shadowRoot;o||=a.attachShadow({mode:`open`});let s=o.querySelector(`style[data-rs-toast]`);s?s.textContent=l:(s=t.createElement(`style`),s.setAttribute(`data-rs-toast`,``),s.textContent=l,o.insertBefore(s,o.firstChild));let c=o.querySelector(`.rs-toast-layer`);return c||(c=t.createElement(`div`),c.className=`rs-toast-layer`,c.setAttribute(`aria-live`,`polite`),c.setAttribute(`aria-atomic`,`true`),o.appendChild(c)),c.setAttribute(`data-position`,e.position),u.set(n,c),d.set(n,a),{host:a,layer:c}},p=e=>{try{let t=new BroadcastChannel(`rs-toast`);t.postMessage({type:`show-toast`,options:e}),t.close()}catch(e){console.warn(`[Toast] Broadcast failed:`,e)}},m=e=>{let l=typeof e==`string`?{message:e}:e,{message:d,kind:m=`info`,duration:h=n,persistent:g=!1,position:_=t.position,onClick:v}=l;if(!d)return null;let y=s(l),b=Date.now();if(y===a&&b-o<i)return null;if(typeof document>`u`)return a=y,o=b,p(l),null;let x={...t,position:_},{layer:S}=f(x);if(c(S,d,m))return a=y,o=b,null;for(a=y,o=b;S.children.length>=x.maxToasts;)S.firstChild?.remove();let C=document.createElement(`div`);C.className=`rs-toast`,C.setAttribute(`data-kind`,m),C.setAttribute(`role`,m===`error`||m===`warning`?`alert`:`status`),C.setAttribute(`aria-live`,m===`error`?`assertive`:`polite`),C.textContent=d,S.appendChild(C),globalThis?.requestAnimationFrame?.(()=>{C.setAttribute(`data-visible`,``)});let w=null,T=()=>{w!==null&&(globalThis.clearTimeout(w),w=null),C.removeAttribute(`data-visible`),globalThis?.setTimeout?.(()=>{if(C.remove(),!S.childElementCount){let e=`${x.containerId}-${x.position}`;u.delete(e)}},r)};return g||(w=globalThis?.setTimeout?.(T,h)),C.addEventListener(`click`,()=>{v?.(),T()}),C.addEventListener(`pointerdown`,()=>{w!==null&&(globalThis.clearTimeout(w),w=null),T()},{once:!0}),C},h=()=>{if(typeof BroadcastChannel>`u`)return()=>{};let e=new BroadcastChannel(`rs-toast`),t=e=>{e.data?.type===`show-toast`&&e.data?.options&&m(e.data.options)};return e.addEventListener(`message`,t),()=>{e.removeEventListener(`message`,t),e.close()}},g=()=>h()}));export{_ as n,m as r,g as t};