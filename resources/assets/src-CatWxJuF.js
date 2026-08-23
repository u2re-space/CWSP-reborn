import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{O as t,t as n}from"./src-C7QuTtnr.js";import{a as r,c as i,o as a,s as o,t as s}from"./cws-bridge-CJBOA0Wb.js";import{B as c,J as l,L as u,R as d,U as f,W as p,q as ee}from"./airpad-cwsp-client-parity-C1fUeWnY.js";import{t as te}from"./src-R3RI73pV.js";import{a as ne,r as re}from"./SettingsTypes-BEJR80_L.js";import{a as ie}from"./HistoryManager-B52KbQG4.js";import{C as m,S as ae,v as oe,w as h}from"./remote-connection-runtime-Bsibrymc.js";import{a as se,c as ce,i as le,l as ue,o as de,s as fe}from"./hub-socket-boot-crn8yrMC.js";import{a as pe,o as g}from"./Settings-CahzB18o.js";import{n as me,o as he}from"./clipboard-device-DaJ_Uxk7.js";import{i as ge,n as _e,r as ve}from"./frontend-debug-capture-jxKOmsWN.js";var ye,_,v,be;function y(){return(y=e((()=>{c(),ye=e=>typeof e==`string`?e.trim():``,_=e=>{let t=ye(e).replace(/\/lna-probe\/?$/i,``).replace(/\/+$/,``);if(!t)return``;let n=f(t);if(!n?.host)return t;let r=n.protocol??`https`;return n.port?`${r}://${n.host}:${n.port}`:`${r}://${n.host}:8434`},v=(e,t,n)=>{let r=new Set(l(n.relay??``).map(e=>_(e))),i=new Set(l(n.direct??``).map(e=>_(e))),a=_(e);if(r.has(a))return t===0?`Relay / gateway`:`Relay (alt)`;if(i.has(a))return`Direct peer`;if(a.includes(`192.168.0.200`))return`Gateway LAN fallback`;let o=ee({relay:n.relay,extras:[n.direct]}).toLowerCase(),s=(()=>{try{return new URL(a).hostname.toLowerCase()}catch{return a.toLowerCase()}})();return s===o||s===`45.147.121.152`||a.includes(`45.147.121.152`)?`Gateway WAN fallback`:a.includes(`127.0.0.1`)||a.includes(`localhost`)?`Loopback`:`Candidate ${t+1}`},be=(e,t)=>{let n=e.find(e=>e.ok)?.origin;if(n)return _(n);let r=d(t);return r[0]?r[0]:e[0]?.origin?_(e[0].origin):``}})))()}async function xe(e){if(!i())return null;let t=d(e);try{let n=await o({channel:`network:probe`,payload:{relay:_(b(e.relay)),direct:_(b(e.direct)),candidates:t}}),r=n.echo,i=n.results??r?.results;if(!Array.isArray(i)||!i.length)return null;let a=new Set,s=[];for(let t=0;t<i.length;t++){let n=i[t],r=_(String(n.url??``));if(!r||a.has(r))continue;a.add(r);let o=!!n.reachable,c=typeof n.statusCode==`number`?n.statusCode:void 0;s.push({label:v(r,s.length,e),origin:r,ok:o,status:c,error:T(n,o,c)})}return s.length?s:null}catch{return null}}async function Se(e,t){if(!i())return null;let n=_(e);if(!n)return null;let r=Date.now();try{let e=await o({channel:`network:dispatch-probe`,payload:{origin:n,clientId:b(t.clientId),token:b(t.token),accessToken:b(t.accessToken)}}),i=typeof e.statusCode==`number`?e.statusCode:void 0,a=!!e.ok,s=typeof e.error==`string`?e.error.trim():``,c=typeof e.bodySnippet==`string`?e.bodySnippet:``;return{origin:n,ok:a,status:i,latencyMs:Date.now()-r,bodySnippet:c,error:a?void 0:s||(i==null?`dispatch failed`:`HTTP ${i}`)}}catch{return null}}async function Ce(e,t={}){let n=await xe(e);if(n?.length)return n;let r=await E(e);if(r?.length)return r;let i=t.timeoutMs??3500,a=t.maxCandidates??6,o=[],s=d(e);for(let t=0;t<s.length;t++){let n=s[t],r=v(n,t,e),c=u(n).slice(0,a);if(!c.length){o.push({label:r,origin:n,ok:!1,error:`invalid host`});continue}for(let e of c){let t=await p(e,{timeoutMs:i});if(o.push({label:r,...t}),t.ok)break}}return o}async function we(e,t){if(!S())return null;let n=C(`/service/endpoint-probe`);if(!n)return null;let r=globalThis.__WEBNATIVE_AUTH__?.key,i=d(e),a=typeof AbortController<`u`?new AbortController:void 0,o=a?globalThis.setTimeout(()=>a.abort(),12e3):void 0;try{let o=await fetch(n,{method:`POST`,headers:r?{"Content-Type":`application/json`,"X-API-Key":r}:{"Content-Type":`application/json`},body:JSON.stringify({origins:i,dispatch:!0,auth:t}),signal:a?.signal});if(!o.ok)return null;let s=await o.json();return{probes:(s.rows??[]).map((t,n)=>({label:v(t.origin,n,e),origin:t.origin,ok:t.ok,status:t.status,error:t.error,latencyMs:t.latencyMs})),dispatch:s.dispatch?{origin:s.dispatch.origin,ok:s.dispatch.ok,status:s.dispatch.status,error:s.dispatch.error,bodySnippet:s.dispatch.bodySnippet,latencyMs:s.dispatch.latencyMs}:void 0}}catch{return null}finally{o&&clearTimeout(o)}}async function Te(e,t,n,r=8e3){let i=e.filter(e=>e.ok).map(e=>_(e.origin)),a=i.length?i:d(t),o={origin:``,ok:!1,error:`no origin`};for(let e of a)if(o=await Ee(e,n,r),o.ok)return o;return o}async function Ee(e,t,n=8e3){let r=_(e),i=Date.now();if(!r)return{origin:``,ok:!1,error:`no origin`};let a=await Se(r,t);if(a)return a;let o=typeof AbortController<`u`?new AbortController:void 0,s=o&&n>0?globalThis.setTimeout(()=>o.abort(),n):void 0,c=b(t.clientId),l=b(t.token),u=b(t.accessToken),d={"Content-Type":`application/json`};u&&(d[`x-auth-token`]=u),l&&(d[`x-cws-token`]=l);let f={userId:c,byId:c,from:c,clientId:c,userKey:u||l,token:l||u,accessToken:u||l,op:`ask`,what:`debug:isReady`,payload:{}};try{let e=await fetch(`${r}/api/network/dispatch`,{method:`POST`,mode:`cors`,cache:`no-store`,credentials:`omit`,headers:d,body:JSON.stringify(f),signal:o?.signal}),t=await e.text().catch(()=>``),n=Date.now()-i,a=e.ok;return{origin:r,ok:a,status:e.status,statusText:e.statusText,latencyMs:n,bodySnippet:t.slice(0,240),error:a?void 0:`HTTP ${e.status}${e.statusText?` ${e.statusText}`:``}`.trim()}}catch(e){return{origin:r,ok:!1,error:w(e),latencyMs:Date.now()-i}}finally{s&&clearTimeout(s)}}async function De(e,t,n,r={}){let a=e.map(e=>e.trim()).filter(Boolean);if(!a.length)return[];let s=r.timeoutMs??8e3,c=[_(r.originHint||``),...d(t).map(_)].filter(Boolean)[0]||``;if(!c)return a.map(e=>({id:e,ok:!1,origin:``,error:`no gateway origin`}));let l=b(n.clientId),u=b(n.token),f=b(n.accessToken),p=[];for(let e of a){let t=Date.now(),n={"Content-Type":`application/json`};f&&(n[`x-auth-token`]=f),u&&(n[`x-cws-token`]=u);let r={userId:l,byId:l,from:l,clientId:l,userKey:f||u,token:u||f,accessToken:f||u,op:`ask`,what:`clipboard:isReady`,purpose:`clipboard`,nodes:[e],destinations:[e],payload:{probe:!0,destination:e}};if(i())try{let n=await o({channel:`network:dispatch-probe`,payload:{origin:c,clientId:l,token:u,accessToken:f,what:`clipboard:isReady`,nodes:[e],destinations:[e]}}),r=typeof n.statusCode==`number`?n.statusCode:void 0,i=!!n.ok,a=typeof n.error==`string`?n.error.trim():``;p.push({id:e,origin:c,ok:i,status:r,latencyMs:Date.now()-t,bodySnippet:typeof n.bodySnippet==`string`?n.bodySnippet:void 0,error:i?void 0:a||(r==null?`dispatch failed`:`HTTP ${r}`)});continue}catch{}let a=typeof AbortController<`u`?new AbortController:void 0,d=a&&s>0?globalThis.setTimeout(()=>a.abort(),s):void 0;try{let i=await fetch(`${c}/api/network/dispatch`,{method:`POST`,mode:`cors`,cache:`no-store`,credentials:`omit`,headers:n,body:JSON.stringify(r),signal:a?.signal}),o=await i.text().catch(()=>``),s=i.ok;p.push({id:e,origin:c,ok:s,status:i.status,latencyMs:Date.now()-t,bodySnippet:o.slice(0,240),error:s?void 0:`HTTP ${i.status}${i.statusText?` ${i.statusText}`:``}`.trim()})}catch(n){p.push({id:e,origin:c,ok:!1,error:w(n),latencyMs:Date.now()-t})}finally{d&&clearTimeout(d)}}return p}var b,x,S,C,w,T,E,D;function Oe(){return(Oe=e((()=>{c(),r(),y(),b=e=>typeof e==`string`?e.trim():``,x=()=>{try{let e=globalThis;return!!(e.__CWS_NEUTRALINO_BOOT__||e.NL_OS!=null||e.Neutralino)}catch{return!1}},S=()=>{try{if(x())return!1;let e=globalThis;return!!(e.__WEBNATIVE_AUTH__||e.__CWS_WEBNATIVE_BOOT__)}catch{return!1}},C=e=>{try{let t=globalThis.__WEBNATIVE_AUTH__;return t?.port?`http://127.0.0.1:${t.port}${e}`:null}catch{return null}},w=e=>{let t=e instanceof Error?e.message:String(e??`fetch failed`);return/abort/i.test(t)?`timeout`:/refused|ECONNREFUSED/i.test(t)?`connection refused`:/ENOTFOUND|NAME_NOT_RESOLVED/i.test(t)?`host not found`:/certificate|cert\.|ssl|tls|ERR_CERT/i.test(t)?`TLS: ${t}`:/failed to fetch/i.test(t)&&i()?`WebView fetch blocked (CORS/TLS) — use native bridge`:t},T=(e,t,n)=>{if(t)return;let r=[];return e.error&&r.push(String(e.error)),n!=null&&n>=0&&n!==204&&r.push(`HTTP ${n}`),r.join(` · `)||`unreachable`},E=async e=>{let t=await we(e,{});return t?.probes.length?t.probes:null},D=e=>{let t=String(e||``).trim();if(!t)return[];let n=new Set,r=[];for(let e of t.split(/[,;\s\n\r]+/)){let t=e.trim();!t||n.has(t)||(n.add(t),r.push(t))}return r}})))()}var ke,O,k,Ae,je,A,j,Me;function Ne(){return(Ne=e((()=>{ge(),r(),me(),ke=e=>`${new Date(e.ts).toISOString()} [${e.level}] (${e.scope}) ${e.msg}`,O=(e=400)=>{let t=_e()?.tail(e)??[];return t.length?t.map(ke).join(`
`)+`
`:`(no frontend log entries — boot WebView debug capture first)
`},k=async(e=400)=>{try{let t=await o({channel:`debug:logcat`,payload:{limit:e}}),n=t.echo,r=typeof t.text==`string`?t.text:``,i=typeof n?.text==`string`?n.text:``,a=(r||i).trim();if(a)return a.endsWith(`
`)?a:`${a}\n`}catch(e){return`(logcat failed: ${e instanceof Error?e.message:String(e)})\n`}return`(logcat unavailable — native bridge missing or not on Android)
`},Ae=async(e=400)=>{try{let t=await o({channel:`debug:frontend`,payload:{limit:e}}),n=t.echo,r=typeof t.text==`string`?t.text:typeof n?.text==`string`?n.text:``;if(r.trim())return r.endsWith(`
`)?r:`${r}\n`}catch{}return``},je=async(e,t=``)=>{let n=[`CWSP Network diagnostics export`,`generated: ${new Date().toISOString()}`,`userAgent: ${navigator.userAgent}`,``].join(`
`),r=O(500),i=await Ae(500),a=await k(500);return[n,`=== Page log ===`,e||`(empty)`,``,t?`=== Probe summary ===
`+t+`
`:``,`=== Frontend log (WebView ring) ===`,r,i.trim()?`=== Frontend log (native ring) ===
`+i+`
`:``,`=== Logcat (native) ===`,a].filter(Boolean).join(`
`)},A=async e=>{let t=e||`(empty log)`;try{return await he(t),!0}catch{return!1}},j=(e,t)=>{let n=new Blob([t],{type:`text/plain;charset=utf-8`}),r=URL.createObjectURL(n),i=document.createElement(`a`);i.href=r,i.download=e,i.rel=`noopener`,document.body.append(i),i.click(),i.remove(),URL.revokeObjectURL(r)},Me=e=>`${e}-${new Date().toISOString().replace(/[:.]/g,`-`)}.txt`})))()}var M,N,Pe,Fe;function P(){return(P=e((()=>{M={root:{selector:`.cw-network-view`,role:`main`,label:`CWSP Network`},statusGrid:{selector:`.cw-network-status-grid`,role:`status`,ariaLive:`polite`,ariaAtomic:`false`},activityLog:{selector:`[data-log]`,ariaLive:`polite`,ariaRelevant:`additions text`,role:`log`},probeList:{selector:`[data-probe-list]`,role:`list`},actions:[{action:`test`,label:`Run network test`},{action:`reconnect`,label:`Reconnect WebSocket`},{action:`open-settings`,label:`Open settings`},{action:`copy-frontend-log`,label:`Copy frontend log`},{action:`copy-logcat`,label:`Copy logcat`},{action:`save-page-logs`,label:`Save page logs`}],minTouchTargetPx:44},N=e=>{let{root:t,statusGrid:n,activityLog:r,probeList:i,actions:a}=M;e.setAttribute(`role`,t.role),!e.getAttribute(`aria-label`)&&!e.getAttribute(`aria-labelledby`)&&e.setAttribute(`aria-label`,t.label);let o=e.querySelector(`h1`);o&&!o.id&&(o.id=`cw-network-view-title`,e.setAttribute(`aria-labelledby`,o.id),e.removeAttribute(`aria-label`));let s=e.querySelector(n.selector);s instanceof HTMLElement&&(s.setAttribute(`role`,n.role),s.setAttribute(`aria-live`,n.ariaLive),s.setAttribute(`aria-atomic`,n.ariaAtomic));let c=e.querySelector(r.selector);c instanceof HTMLElement&&(c.setAttribute(`role`,r.role),c.setAttribute(`aria-live`,r.ariaLive),c.setAttribute(`aria-relevant`,r.ariaRelevant));let l=e.querySelector(i.selector);l instanceof HTMLElement&&l.setAttribute(`role`,i.role);for(let t of a){let n=e.querySelector(`[data-action="${t.action}"]`);n instanceof HTMLElement&&(!n.getAttribute(`aria-label`)&&!n.textContent?.trim()&&n.setAttribute(`aria-label`,t.label),n instanceof HTMLButtonElement&&!n.type&&(n.type=`button`))}},Pe=e=>{let t=[],{root:n,statusGrid:r,activityLog:i,probeList:a,actions:o}=M;e.getAttribute(`role`)!==n.role&&t.push({code:`root-role`,message:`root role must be "${n.role}"`}),!e.getAttribute(`aria-label`)&&!e.getAttribute(`aria-labelledby`)&&t.push({code:`root-label`,message:`root needs aria-label or aria-labelledby`});let s=e.querySelector(r.selector);s?(s.getAttribute(`role`)!==r.role&&t.push({code:`status-role`,message:`status grid role must be "${r.role}"`}),s.getAttribute(`aria-live`)!==r.ariaLive&&t.push({code:`status-live`,message:`status grid aria-live must be "${r.ariaLive}"`})):t.push({code:`status-grid-missing`,message:`status grid missing`});let c=e.querySelector(i.selector);c?(c.getAttribute(`aria-live`)!==i.ariaLive&&t.push({code:`log-live`,message:`log aria-live must be "${i.ariaLive}"`}),c.getAttribute(`role`)!==i.role&&t.push({code:`log-role`,message:`log role must be "${i.role}"`})):t.push({code:`log-missing`,message:`activity log [data-log] missing`});let l=e.querySelector(a.selector);l?l.getAttribute(`role`)!==a.role&&t.push({code:`probe-list-role`,message:`probe list role must be "${a.role}"`}):t.push({code:`probe-list-missing`,message:`probe list missing`});for(let n of o){let r=e.querySelector(`[data-action="${n.action}"]`);if(!r){t.push({code:`action-missing:${n.action}`,message:`action button data-action="${n.action}" missing`});continue}r.getAttribute(`aria-label`)||r.textContent?.trim()||t.push({code:`action-label:${n.action}`,message:`action "${n.action}" needs accessible name`})}return t},Fe=(e=document)=>{let t=e.createElement(`div`);return t.className=`cw-network-view`,t.dataset.view=`network`,t.innerHTML=`
        <header class="cw-network-view__header">
            <p>Connection status, reachability probes, and dispatch errors.</p>
        </header>
        <div class="cw-network-body">
            <div class="cw-network-status-grid"></div>
            <div class="cw-network-actions">
                <button type="button" data-action="test">Run network test</button>
                <button type="button" data-action="reconnect">Reconnect WS</button>
                <button type="button" data-action="open-settings">Settings</button>
            </div>
            <div class="cw-network-actions cw-network-actions--logs">
                <button type="button" data-action="copy-frontend-log">Copy Frontend Log</button>
                <button type="button" data-action="copy-logcat">Copy Logcat</button>
                <button type="button" data-action="save-page-logs">Save page logs</button>
            </div>
            <section class="cw-network-probes">
                <h2>Probe results</h2>
                <div data-probe-list></div>
            </section>
        </div>
        <section class="cw-network-log-panel">
            <h2 class="cw-network-log-panel__title">Activity log</h2>
            <pre class="cw-network-log" data-log></pre>
        </section>
    `,N(t),t}})))()}var Ie;function Le(){return(Le=e((()=>{Ie=`/* Network view — same adaptive \`--sv-*\` layer as Settings (veela \`--base-color\`).
 * WHY: \`--c2-*\` + \`#121212\` / \`#1e1e1e\` / \`#2563eb\` forked a slate palette while
 * Settings followed Material You. Pin \`color-scheme\` so \`--u2-color-mod\` fallbacks
 * do not follow OS when veela tokens are not yet on the adopted sheet.
 */
@layer ui-network {
  :is(html[data-theme=light] .cw-network-view-host, html[data-theme=light] .cw-network-view) {
    color-scheme: light only;
    --sv-bg: var(--color-surface, --u2-color-mod(var(--base-color, #5a9ec8), 40));
    --sv-fg: var(--color-on-surface, --u2-color-mod(var(--base-color, #5a9ec8), 900));
    --sv-muted: var(--color-on-surface-variant, --u2-color-mod(var(--base-color, #5a9ec8), 700));
    --sv-outline: var(--color-outline-variant, --u2-color-mod(var(--base-color, #5a9ec8), 400));
    --sv-surface-1: var(--color-surface-container-low, --u2-color-mod(var(--base-color, #5a9ec8), 10));
    --sv-surface-2: var(--color-surface-container, --u2-color-mod(var(--base-color, #5a9ec8), 80));
  }
  :is(html[data-theme=dark] .cw-network-view-host, html[data-theme=dark] .cw-network-view) {
    color-scheme: dark only;
    --sv-bg: var(--color-surface, --u2-color-mod(var(--base-color, #5a9ec8), 1000));
    --sv-fg: var(--color-on-surface, --u2-color-mod(var(--base-color, #5a9ec8), 100));
    --sv-muted: var(--color-on-surface-variant, --u2-color-mod(var(--base-color, #5a9ec8), 280));
    --sv-outline: var(--color-outline-variant, --u2-color-mod(var(--base-color, #5a9ec8), 640));
    --sv-surface-1: var(--color-surface-container-low, --u2-color-mod(var(--base-color, #5a9ec8), 900));
    --sv-surface-2: var(--color-surface-container, --u2-color-mod(var(--base-color, #5a9ec8), 960));
  }
  /* Host fills minimal-shell absolute view slot */
  .cw-network-view-host {
    display: flex;
    flex-direction: column;
    block-size: 100%;
    min-block-size: 0;
    overflow: hidden;
    background: var(--sv-bg, var(--color-surface));
    color: var(--sv-fg, var(--color-on-surface));
  }
  .cw-network-view {
    display: flex;
    flex-direction: column;
    gap: 0;
    block-size: 100%;
    min-block-size: 0;
    overflow: hidden;
    color-scheme: inherit;
    color: var(--sv-fg, var(--color-on-surface));
    background: var(--sv-bg, var(--color-surface));
    font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
    --sv-accent: light-dark(
        --u2-color-mod(oklch(from var(--sv-primary, var(--color-primary, #5a9ec8)) calc(l * 1.6) calc(c * 2) h), 600),
        --u2-color-mod(oklch(from var(--sv-primary, var(--color-primary, #5a9ec8)) calc(l * 1.6) calc(c * 2) h), 400)
    );
    --sv-on-primary: var(
        --color-on-primary,
        light-dark(
            --u2-color-mod(var(--sv-primary, #5a9ec8), 10),
            --u2-color-mod(var(--sv-primary, #5a9ec8), 990)
        )
    );
  }
  .cw-network-view__header {
    flex: 0 0 auto;
    padding: 0.85rem 1rem 0.65rem;
  }
  .cw-network-view__header h1 {
    margin: 0;
    font-size: 1.15rem;
    font-weight: 650;
    color: var(--sv-fg, var(--color-on-surface));
  }
  .cw-network-view__header p {
    margin: 0.25rem 0 0;
    color: var(--sv-muted, var(--color-on-surface-variant));
    font-size: 0.88rem;
  }
  .cw-network-body {
    flex: 1 1 auto;
    min-block-size: 0;
    overflow: auto;
    overscroll-behavior: contain;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    padding: 0 1rem 0.75rem;
  }
  .cw-network-status-grid {
    display: grid;
    gap: 0.55rem;
  }
  .cw-network-status-card {
    display: grid;
    gap: 0.35rem;
    padding: 0.65rem 0.75rem;
    border-radius: 16px;
    border: none;
    background: var(--sv-surface-1, var(--color-surface-container-low));
    color: var(--sv-fg, var(--color-on-surface));
    text-align: start;
    justify-content: start;
    justify-items: start;
  }
  .cw-network-status-card[data-state=ok] {
    background: color-mix(in oklab, var(--color-success, #66bb6a) 16%, var(--sv-surface-1, var(--color-surface-container-low)));
    box-shadow: inset 0 0 0 1px color-mix(in oklab, var(--color-success, #66bb6a) 45%, transparent);
  }
  .cw-network-status-card[data-state=bad] {
    background: color-mix(in oklab, var(--color-error, #f87171) 14%, var(--sv-surface-1, var(--color-surface-container-low)));
    box-shadow: inset 0 0 0 1px color-mix(in oklab, var(--color-error, #f87171) 45%, transparent);
  }
  .cw-network-status-card[data-state=warn] {
    background: color-mix(in oklab, var(--sv-primary, var(--color-primary, #5a9ec8)) 12%, var(--sv-surface-1, var(--color-surface-container-low)));
    box-shadow: inset 0 0 0 1px color-mix(in oklab, var(--sv-primary, var(--color-primary, #5a9ec8)) 28%, transparent);
  }
  .cw-network-status-card__title {
    font-size: 0.78rem;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: var(--sv-muted, var(--color-on-surface-variant));
  }
  .cw-network-status-card__value {
    font-size: 1rem;
    font-weight: 600;
    word-break: break-word;
  }
  .cw-network-status-card__detail {
    font-size: 0.82rem;
    color: var(--sv-muted, var(--color-on-surface-variant));
    word-break: break-word;
  }
  .cw-network-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }
  .cw-network-actions button {
    appearance: none;
    border: none;
    background: var(--sv-surface-2, var(--color-surface-container));
    color: var(--sv-fg, var(--color-on-surface));
    color: contrast-color(var(--sv-surface-2, var(--color-surface-container)));
    border-radius: 999px;
    padding: 0.5rem 1.125rem;
    min-block-size: 2.5rem;
    font-size: 0.8125rem;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.12s ease, filter 0.12s ease;
  }
  .cw-network-actions button:hover {
    background: color-mix(in oklab, var(--sv-fg, var(--color-on-surface)) 6%, var(--sv-surface-1, var(--color-surface-container-low)));
  }
  .cw-network-actions button.primary {
    background: var(--sv-accent, var(--sv-primary, var(--color-primary, #5a9ec8)));
    color: contrast-color(var(--sv-accent, var(--sv-primary, #5a9ec8)));
  }
  .cw-network-actions button.primary:hover {
    filter: brightness(1.1);
    background: var(--sv-accent, var(--sv-primary, var(--color-primary, #5a9ec8)));
  }
  .cw-network-actions button:disabled {
    opacity: 0.55;
    cursor: wait;
    filter: none;
  }
  .cw-network-actions--logs button {
    font-size: 0.75rem;
    min-block-size: 2rem;
    padding: 0.35rem 0.85rem;
  }
  .cw-network-dest-field {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
    font-size: 0.88rem;
    color: var(--sv-muted, var(--color-on-surface-variant));
  }
  .cw-network-dest-field input {
    appearance: none;
    border: none;
    background: var(--sv-surface-2, var(--color-surface-container));
    color: var(--sv-fg, var(--color-on-surface));
    border-radius: 10px;
    padding: 0.5rem 0.75rem;
    font-size: 0.9rem;
  }
  .cw-network-dest-field input:focus-visible {
    outline: 2px solid var(--sv-accent, var(--color-primary, #5a9ec8));
    outline-offset: 2px;
  }
  .cw-network-dest-hint {
    margin: 0;
    font-size: 0.8rem;
    color: var(--sv-muted, var(--color-on-surface-variant));
  }
  .cw-network-probes {
    display: flex;
    flex-direction: column;
    gap: 0.45rem;
    min-block-size: 0;
    flex-wrap: nowrap;
    min-block-size: max-content;
  }
  .cw-network-probes [data-probe-list] {
    display: flex;
    flex-direction: column;
    gap: 0.45rem;
    flex-wrap: nowrap;
    min-block-size: max-content;
  }
  .cw-network-probes h2 {
    margin: 0;
    font-size: 0.95rem;
    color: var(--sv-fg, var(--color-on-surface));
  }
  .cw-network-probe-row {
    display: grid;
    gap: 0.15rem;
    padding: 0.55rem 0.65rem;
    border-radius: 12px;
    background: var(--sv-surface-1, var(--color-surface-container-low));
    font-size: 0.82rem;
    min-block-size: max-content;
  }
  .cw-network-probe-row[data-ok=true] {
    box-shadow: inset 3px 0 0 var(--color-success, #66bb6a);
  }
  .cw-network-probe-row[data-ok=false] {
    box-shadow: inset 3px 0 0 var(--color-error, #f87171);
  }
  .cw-network-probe-row__head {
    display: flex;
    justify-content: space-between;
    gap: 0.5rem;
    font-weight: 600;
  }
  .cw-network-probe-row__error {
    color: var(--color-error, #f87171);
    word-break: break-word;
  }
  .cw-network-log-panel {
    flex: 0 0 auto;
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
    min-block-size: 0;
    max-block-size: min(32vh, 11rem);
    padding: 0.55rem 1rem 0.85rem;
    border-block-start: 1px solid color-mix(in oklab, var(--sv-outline, var(--color-outline-variant)) 35%, transparent);
    background: var(--sv-surface-2, var(--color-surface-container));
    text-align: start;
    justify-content: start;
    justify-items: start;
    flex-direction: column;
    flex-wrap: nowrap;
    min-block-size: max-content;
  }
  .cw-network-log-panel__title {
    flex: 0 0 auto;
    margin: 0;
    font-size: 0.72rem;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: var(--sv-muted, var(--color-on-surface-variant));
  }
  .cw-network-log {
    flex: 1 1 auto;
    margin: 0;
    padding: 0.55rem 0.65rem;
    border-radius: 12px;
    min-block-size: 3.5rem;
    overflow: auto;
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: 0.75rem;
    line-height: 1.35;
    background: var(--sv-surface-1, var(--color-surface-container-low));
    color: var(--sv-fg, var(--color-on-surface));
    white-space: pre-wrap;
    word-break: break-word;
    text-align: start;
    justify-content: start;
    justify-items: start;
  }
  /* Neutralino desk: drag/paste files onto Network to Open-for-Share */
  .cw-network-dropzone {
    margin: 0.75rem 1rem 0;
    padding: 1rem 1.1rem;
    border: 1.5px dashed color-mix(in oklab, var(--sv-primary, var(--color-primary, #5a9ec8)) 45%, var(--sv-outline, var(--color-outline-variant)));
    border-radius: 16px;
    background: color-mix(in oklab, var(--sv-primary, var(--color-primary, #5a9ec8)) 12%, var(--sv-surface-1, var(--color-surface-container-low)));
    color: var(--sv-fg, var(--color-on-surface));
    transition: border-color 0.15s ease, background 0.15s ease;
    outline: none;
  }
  .cw-network-dropzone:focus-visible {
    border-color: var(--sv-accent, var(--color-primary, #5a9ec8));
    box-shadow: 0 0 0 2px color-mix(in oklab, var(--sv-accent, var(--color-primary, #5a9ec8)) 35%, transparent);
  }
  .cw-network-dropzone.is-dragover {
    border-color: var(--sv-accent, var(--color-primary, #5a9ec8));
    background: color-mix(in oklab, var(--sv-primary, var(--color-primary, #5a9ec8)) 22%, var(--sv-surface-1, var(--color-surface-container-low)));
  }
  .cw-network-dropzone__title {
    font-weight: 650;
    font-size: 0.95rem;
  }
  .cw-network-dropzone__hint {
    margin: 0.35rem 0 0;
    font-size: 0.82rem;
    color: var(--sv-muted, var(--color-on-surface-variant));
  }
  .cw-network-dropzone__status {
    margin-top: 0.55rem;
    font-size: 0.8rem;
    color: var(--sv-muted, var(--color-on-surface-variant));
    min-block-size: 1.1em;
  }
}`})))()}var F,I,L,R,z,B,Re,V,H,U,W,G,K,q,J;function ze(){return(ze=e((()=>{te(),n(),pe(),fe(),oe(),r(),Oe(),re(),Ne(),ge(),P(),Le(),F=()=>{try{let e=globalThis.Capacitor;return typeof e?.isNativePlatform==`function`&&!!e.isNativePlatform()}catch{return!1}},I=()=>{try{if(F()||m())return!1;let e=String(document.documentElement?.dataset?.cwspSurface||``).toLowerCase(),t=String(location.hostname||``).toLowerCase();return e===`cwsp-control`||t===`cwsp.u2re.space`||t===`www.cwsp.u2re.space`||location.protocol===`https:`&&t!==`localhost`&&t!==`127.0.0.1`}catch{return!1}},L=29110,R=`cwsp-neutralino-local`,z=()=>{try{let e=globalThis,t=e.__WEBNATIVE_AUTH__||e.__NEUTRALINO_AUTH__;return{port:Number(t?.port)||L,key:String(t?.key||R)}}catch{return{port:L,key:R}}},B=async()=>{try{let e=globalThis,t=typeof e.NL_PATH==`string`?e.NL_PATH:``,n=e.Neutralino?.filesystem?.readFile;if(!t||!n)return;let r=await n(`${t}/.tmp/cwsp-control-auth.json`),i=JSON.parse(r),a=Number(i?.port);if(!Number.isFinite(a)||a<1024||a===8434)return;let o={port:a,key:String(i?.key||`cwsp-neutralino-local`)};e.__WEBNATIVE_AUTH__=o,e.__NEUTRALINO_AUTH__=o}catch{}},Re=async(e,t)=>{let n=typeof AbortSignal<`u`&&typeof AbortSignal.timeout==`function`?AbortSignal.timeout(1500):void 0;try{let r=await fetch(`http://127.0.0.1:${e}/service/clipboard-hub`,{method:`GET`,headers:{"X-API-Key":t},cache:`no-store`,signal:n});if(!r.ok)return null;let i=await r.json();return typeof i?.running!=`boolean`&&typeof i?.connected!=`boolean`?null:i}catch{return null}},V=async()=>{try{let e=globalThis;if(document.documentElement?.dataset?.cwspSurface===`cwsp-control`&&!e.__CWS_NODE_CLIPBOARD_HUB__)return null}catch{}await B();let e=z(),t=Array.from(new Set([e.port,L,29110].filter(e=>e>1024)));for(let n of t){let t=await Re(n,e.key);if(t){let r=globalThis;return r.__WEBNATIVE_AUTH__={port:n,key:e.key},r.__NEUTRALINO_AUTH__={port:n,key:e.key},t}}return null},H=async()=>{let e=await V(),{port:t,key:n}=z(),r=typeof AbortSignal<`u`&&typeof AbortSignal.timeout==`function`?AbortSignal.timeout(3e3):void 0;try{let i=await fetch(`http://127.0.0.1:${t}/service/clipboard-hub`,{method:`POST`,headers:{"Content-Type":`application/json`,"X-API-Key":n},body:JSON.stringify({reload:!0,force:!0}),cache:`no-store`,signal:r});return i.ok?await i.json():e}catch{return e}},U=0,W=0,G=async()=>{let e=Date.now();if(e-U<8e3)return!1;U=e;try{let e=globalThis.Neutralino;return e?.extensions?.dispatch?(await e.extensions.dispatch(`extNode`,`runNode`,{function:`backend.ensure`,parameter:null}),!0):!1}catch{return!1}},K=async()=>{let e=Date.now();return e-W<1e4?null:(W=e,H())},q=e=>{let t=[`${e.label}: ${e.origin}`];return e.ok?t.push(`OK (${e.latencyMs??`?`}ms)`):e.status&&t.push(`FAIL HTTP ${e.status}`),e.error&&t.push(e.error),t.join(` — `)},J=class{root=null;sheet=null;wsUnsub=null;nodeHubPoll=null;running=!1;logLines=[];probeSummary=``;els={wsCard:null,wsValue:null,wsDetail:null,nativeCard:null,nativeValue:null,configDetail:null,probeList:null,log:null,testBtn:null,destBtn:null,destInput:null,reconnectBtn:null,filesDropzone:null,filesDropStatus:null};mount(e){return this.sheet??=t(Ie),this.root=ie`
            <div class="cw-network-view" data-view="network">
                <header class="cw-network-view__header">
                    <p>Connection status, reachability probes, and dispatch errors.</p>
                </header>

                <div class="cw-network-body">
                    <div class="cw-network-status-grid">
                        <section class="cw-network-status-card" data-state="warn" data-ws-card>
                            <div class="cw-network-status-card__title">WebSocket hub</div>
                            <div class="cw-network-status-card__value" data-ws-value>…</div>
                            <div class="cw-network-status-card__detail" data-ws-detail></div>
                        </section>
                        <section class="cw-network-status-card" data-state="warn" data-native-card hidden>
                            <div class="cw-network-status-card__title">Native runtime</div>
                            <div class="cw-network-status-card__value" data-native-value>…</div>
                        </section>
                        <section class="cw-network-status-card">
                            <div class="cw-network-status-card__title">Configuration</div>
                            <div class="cw-network-status-card__detail" data-config-detail>Loading…</div>
                        </section>
                    </div>

                    <div class="cw-network-actions">
                        <button type="button" class="primary" data-action="test">Run network test</button>
                        <button type="button" data-action="check-destinations">Check destinations</button>
                        <button type="button" data-action="reconnect">Reconnect WS</button>
                        <button type="button" data-action="open-settings">Settings</button>
                    </div>

                    <label class="cw-network-dest-field">
                        <span>Destination node ids</span>
                        <input type="text" data-dest-ids placeholder="L-196;L-210;L-208" autocomplete="off" />
                    </label>
                    <p class="cw-network-dest-hint">Probe clipboard:isReady to each id via gateway (45.147 / .200) — works for Android↔Android on LAN too.</p>

                    <div class="cw-network-dropzone" data-files-dropzone hidden tabindex="0" role="region" aria-label="Open for Share drop or paste zone">
                        <div class="cw-network-dropzone__title">Drop or paste files to share</div>
                        <p class="cw-network-dropzone__hint">Drop or paste (Ctrl+V) files here to Open for Share to configured peers (Neutralino desk).</p>
                        <div class="cw-network-dropzone__status" data-files-drop-status aria-live="polite"></div>
                    </div>

                    <div class="cw-network-actions cw-network-actions--logs">
                        <button type="button" data-action="copy-frontend-log">Copy Frontend Log</button>
                        <button type="button" data-action="copy-logcat">Copy Logcat</button>
                        <button type="button" data-action="save-page-logs">Save page logs</button>
                    </div>

                    <section class="cw-network-probes">
                        <h2>Probe results</h2>
                        <div data-probe-list></div>
                    </section>
                </div>

                <section class="cw-network-log-panel">
                    <h2 class="cw-network-log-panel__title">Activity log</h2>
                    <pre class="cw-network-log" data-log aria-live="polite"></pre>
                </section>
            </div>
        `,this.els.wsCard=this.root.querySelector(`[data-ws-card]`),this.els.wsValue=this.root.querySelector(`[data-ws-value]`),this.els.wsDetail=this.root.querySelector(`[data-ws-detail]`),this.els.nativeCard=this.root.querySelector(`[data-native-card]`),this.els.nativeValue=this.root.querySelector(`[data-native-value]`),this.els.configDetail=this.root.querySelector(`[data-config-detail]`),this.els.probeList=this.root.querySelector(`[data-probe-list]`),this.els.log=this.root.querySelector(`[data-log]`),this.els.testBtn=this.root.querySelector(`[data-action="test"]`),this.els.destBtn=this.root.querySelector(`[data-action="check-destinations"]`),this.els.destInput=this.root.querySelector(`[data-dest-ids]`),this.els.reconnectBtn=this.root.querySelector(`[data-action="reconnect"]`),this.els.filesDropzone=this.root.querySelector(`[data-files-dropzone]`),this.els.filesDropStatus=this.root.querySelector(`[data-files-drop-status]`),N(this.root),this.els.testBtn?.addEventListener(`click`,()=>void this.runFullTest()),this.els.destBtn?.addEventListener(`click`,()=>void this.runDestinationCheck()),this.els.reconnectBtn?.addEventListener(`click`,()=>void this.reconnectWs()),this.wireFilesDropzone(),this.root.querySelector(`[data-action="open-settings"]`)?.addEventListener(`click`,()=>{globalThis.dispatchEvent(new CustomEvent(`cw:view-open-request`,{detail:{viewId:`settings`,target:`minimal`}}))}),this.root.querySelector(`[data-action="copy-frontend-log"]`)?.addEventListener(`click`,()=>{this.copyFrontendLog()}),this.root.querySelector(`[data-action="copy-logcat"]`)?.addEventListener(`click`,()=>{this.copyLogcat()}),this.root.querySelector(`[data-action="save-page-logs"]`)?.addEventListener(`click`,()=>{this.savePageLogs()}),e.replaceChildren(this.root),this.bootstrap(),this.root}unmount(){this.wsUnsub?.(),this.wsUnsub=null,this.nodeHubPoll&&=(clearInterval(this.nodeHubPoll),null),this.root?.remove(),this.root=null}appendLog(e){let t=new Date().toLocaleTimeString();this.logLines.unshift(`[${t}] ${e}`),this.logLines=this.logLines.slice(0,40),this.els.log&&(this.els.log.textContent=this.logLines.join(`
`))}setWsUi(e,t){if(!(!this.els.wsCard||!this.els.wsValue)){if(I()){this.els.wsCard.dataset.state=`warn`,this.els.wsValue.textContent=`N/A — Control SPA`,this.els.wsDetail&&(this.els.wsDetail.textContent=t||`Hub lives on Neutralino/Capacitor → gateway :8434. This page only runs HTTP probes.`);return}if(F()&&h()){this.els.wsCard.dataset.state=e?`ok`:`bad`,this.els.wsValue.textContent=e?`Java CwspBridge Connected`:`Java CwspBridge Disconnected`,this.els.wsDetail&&(this.els.wsDetail.textContent=t||"CwspBridgeService holds `/ws` — WebView browser WebSocket is not used.");return}if(m()){this.els.wsCard.dataset.state=e?`ok`:`bad`,this.els.wsValue.textContent=e?`Node clipboard-hub Connected`:`Node clipboard-hub Disconnected`,this.els.wsDetail&&(this.els.wsDetail.textContent=t||"LAN clipboard uses Node `/service/clipboard-hub` — not the WebView WebSocket API.");return}this.els.wsCard.dataset.state=e?`ok`:`bad`,this.els.wsValue.textContent=e?`Connected`:`Disconnected`,this.els.wsDetail&&(this.els.wsDetail.textContent=t||``)}}async refreshJavaHubStatus(){try{let e=await a(`coordinator:status`,{}),t=e.echo??{},n=!!(t.wsOpen??t.connected??e.ok),r=[t.daemon===!1?`daemon-stopped`:`daemon`,n?`ws-open`:`ws-closed`];this.setWsUi(n,r.join(` · `))}catch(e){this.setWsUi(!1,`Java coordinator:status unreachable`),this.appendLog(String(e instanceof Error?e.message:e))}}applyNodeHubStatus(e){if(!e){this.setWsUi(!1,`Node clipboard-hub unreachable (:${z().port})`);return}let t=!!e.connected,n=[e.running?`running`:`stopped`,e.localId?`id=${e.localId}`:``,e.hasToken===!1?`no-token`:``,e.hubUrl?e.hubUrl:``,e.lastError?`err=${e.lastError}`:``].filter(Boolean);this.setWsUi(t,n.join(` · `))}renderConfig(e){if(!this.els.configDetail)return;let t=e?.core,n=String(t?.endpointUrl??`—`),r=String(t?.ops?.directUrl??`—`),i=String(t?.userId??`—`),a=String(t?.socket?.routeTarget??`*`);if(this.els.configDetail.textContent=[`Relay: ${n}`,`Direct: ${r}`,`Client: ${i}`,`Route: ${a}`].join(`
`),this.els.destInput&&!this.els.destInput.value.trim()){let t=String(e?.shell?.clipboardShareDestinationIds||``).trim();this.els.destInput.value=a&&a!==`*`?a:t||`L-196;L-210;L-208`}}renderProbes(e){if(!this.els.probeList)return;this.els.probeList.replaceChildren();let t=[...e.probes];if(e.dispatch){let n=e.dispatch;t.push({label:`Dispatch /api/network/dispatch`,origin:n.origin,ok:n.ok,status:n.status,statusText:n.statusText,error:n.error||(n.bodySnippet?n.bodySnippet.slice(0,120):void 0),latencyMs:n.latencyMs})}for(let n of e.destinations||[])t.push({label:`Destination ${n.id}`,origin:n.origin||n.id,ok:n.ok,status:n.status,error:n.error||(n.bodySnippet?n.bodySnippet.slice(0,120):void 0),latencyMs:n.latencyMs});if(!t.length){let e=document.createElement(`p`);e.textContent=`No probes yet — tap Run network test.`,e.style.opacity=`0.75`,e.style.fontSize=`0.85rem`,this.els.probeList.append(e);return}for(let e of t){let t=ie`
                <div class="cw-network-probe-row" data-ok="${e.ok?`true`:`false`}">
                    <div class="cw-network-probe-row__head">
                        <span>${e.label}</span>
                        <span>${e.ok?`OK`:`FAIL`}${e.latencyMs==null?``:` · ${e.latencyMs}ms`}</span>
                    </div>
                    <div>${e.origin}</div>
                    ${e.error?`<div class="cw-network-probe-row__error">${e.error}</div>`:``}
                </div>
            `;this.els.probeList.append(t)}}wireFilesDropzone(){let e=this.els.filesDropzone;if(!e)return;if(!m()||I()){e.hidden=!0;return}e.hidden=!1;let t=e=>{this.els.filesDropStatus&&(this.els.filesDropStatus.textContent=e),this.appendLog(e)},n=(e,n,r)=>{this.ingressFilesForShare(n,r).then(e=>t(e),n=>t(`${e} failed: ${n instanceof Error?n.message:String(n)}`))},r=t=>{t.preventDefault(),t.stopPropagation(),e.classList.toggle(`is-dragover`,t.type===`dragover`||t.type===`dragenter`),(t.type===`dragleave`||t.type===`drop`)&&e.classList.remove(`is-dragover`)};e.addEventListener(`dragenter`,r),e.addEventListener(`dragover`,r),e.addEventListener(`dragleave`,r),e.addEventListener(`drop`,e=>{r(e),n(`Drop`,this.pathsFromFileList(e.dataTransfer?.files),!1)});let i=t=>{let r=t.target;if(r&&(r.closest(`input, textarea, [contenteditable='true']`)||r.tagName===`INPUT`||r.tagName===`TEXTAREA`))return;let i=this.pathsFromFileList(t.clipboardData?.files),a=Array.from(t.clipboardData?.items||[]).some(e=>e.kind===`file`),o=Array.from(t.clipboardData?.types||[]),s=String(t.clipboardData?.getData(`text/plain`)||``).trim();(a||i.length>0||o.some(e=>/Files|text\/uri-list|CF_HDROP/i.test(e))||e.contains(r)||r===e||!s&&this.root.contains(r))&&(t.preventDefault(),t.stopPropagation(),n(`Paste`,i,i.length===0))};e.addEventListener(`paste`,i),this.root.addEventListener(`paste`,i)}pathsFromFileList(e){if(!e||e.length===0)return[];let t=[];for(let n=0;n<e.length;n++){let r=e.item(n);if(!r)continue;let i=String(r.path||``).trim();i&&t.push(i)}return t}async ingressFilesForShare(e,t){if(!t&&e.length===0)return`No files to share.`;await B();let n=z(),r=await fetch(`http://127.0.0.1:${n.port}/service/files-ingress`,{method:`POST`,headers:{"Content-Type":`application/json`,"X-API-Key":n.key},body:JSON.stringify(t?{fromClipboard:!0,paths:e}:{paths:e})}),i=await r.json().catch(()=>({}));if(!r.ok||i.ok===!1)throw Error(String(i.error||`HTTP ${r.status}`));return`Shared ${Number(i.fileCount||e.length||0)} file(s) → transfer ${String(i.transferId||`?`)} (${String(i.phase||`ok`)})`}async bootstrap(){ve();let e=I();if(e){this.els.nativeCard?.removeAttribute(`hidden`),this.els.nativeValue&&(this.els.nativeValue.textContent=`Browser · no local hub`),this.els.nativeCard&&(this.els.nativeCard.dataset.state=`warn`),this.setWsUi(!1),this.els.reconnectBtn&&(this.els.reconnectBtn.disabled=!0,this.els.reconnectBtn.title=`Fleet /ws is owned by Neutralino/Capacitor — use Run network test here.`);let e=await g().catch(()=>null);this.renderConfig(e),this.appendLog(`Control SPA — WebSocket hub N/A (use Neutralino/Capacitor for live /ws).`),this.appendLog(`Ready — tap Run network test for HTTP/dispatch probes.`);return}if(!e&&m()){this.els.nativeCard?.removeAttribute(`hidden`),this.els.nativeValue&&(this.els.nativeValue.textContent=`Node clipboard-hub`),this.els.nativeCard&&(this.els.nativeCard.dataset.state=`ok`);let e=async()=>{try{await B();let e=await V();if(e?.running&&!e.connected){let t=await K();t&&(e=t)}this.applyNodeHubStatus(e),e||await G()&&this.appendLog(`Requested backend.ensure (control unreachable).`)}catch(e){this.applyNodeHubStatus(null),G(),this.appendLog(String(e instanceof Error?e.message:e))}};await e(),this.nodeHubPoll=setInterval(()=>void e(),2500);let t=()=>{document.visibilityState===`visible`&&(async()=>{let e=await V();if(!e){await G()&&this.appendLog(`Wake: backend.ensure (control was down).`);return}if(e.running&&!e.connected){let e=await K();e&&(this.applyNodeHubStatus(e),this.appendLog(`Wake: clipboard-hub reload requested.`))}})()};document.addEventListener(`visibilitychange`,t),window.addEventListener(`pageshow`,t);let n=await g().catch(()=>null);this.renderConfig(n),this.appendLog(`Ready — WebSocket status from Node clipboard-hub (not WebView).`);return}if(F()&&h()){this.els.nativeCard?.removeAttribute(`hidden`);try{let e=await s.getShellInfo();this.els.nativeValue&&(this.els.nativeValue.textContent=e.native?`Capacitor · Java /ws · ${e.platform??`android`}`:`Web fallback`),this.els.nativeCard&&(this.els.nativeCard.dataset.state=e.native?`ok`:`warn`)}catch(e){this.els.nativeValue&&(this.els.nativeValue.textContent=`Bridge unavailable`),this.appendLog(String(e instanceof Error?e.message:e))}await this.refreshJavaHubStatus(),this.nodeHubPoll=setInterval(()=>void this.refreshJavaHubStatus(),2500);let e=()=>{document.visibilityState===`visible`&&(async()=>{if(await this.refreshJavaHubStatus(),this.els.wsCard?.dataset.state!==`ok`){this.appendLog(`Wake: Java /ws reconnect…`);try{let e=await a(`runtime:reload-settings`,{});await this.refreshJavaHubStatus(),this.appendLog(e?.ok?`Wake: Java /ws reconnect requested.`:`Wake: Java /ws reconnect failed.`)}catch(e){this.appendLog(String(e instanceof Error?e.message:e))}}})()};document.addEventListener(`visibilitychange`,e),window.addEventListener(`pageshow`,e);let t=await g().catch(()=>null);this.renderConfig(t),this.appendLog(`Ready — WebSocket status from Java CwspBridgeService (not WebView).`);return}if(de(null),this.wsUnsub=ue(e=>{this.setWsUi(e)}),this.setWsUi(ce()),F()){this.els.nativeCard?.removeAttribute(`hidden`);try{let e=await s.getShellInfo();this.els.nativeValue&&(this.els.nativeValue.textContent=e.native?`Capacitor · ${e.platform??`android`}`:`Web fallback`),this.els.nativeCard&&(this.els.nativeCard.dataset.state=e.native?`ok`:`warn`)}catch(e){this.els.nativeValue&&(this.els.nativeValue.textContent=`Bridge unavailable`),this.appendLog(String(e instanceof Error?e.message:e))}}let t=await g().catch(()=>null);this.renderConfig(t),this.appendLog(`Ready — tap Run network test for full probe.`)}async reconnectWs(){if(I()){this.appendLog(`Reconnect WS skipped — Control SPA does not own fleet /ws (would kick Capacitor/Neutralino).`),this.appendLog(`Use Run network test / Check destinations, or reconnect from the desk/phone app.`),this.setWsUi(!1);return}if(F()&&h()){this.appendLog(`Reconnecting Java CwspBridge /ws…`);try{let e=await a(`runtime:reload-settings`,{});await this.refreshJavaHubStatus(),this.appendLog(e?.ok?`Java /ws reconnect requested`:`Java /ws reconnect failed`)}catch(e){this.appendLog(String(e instanceof Error?e.message:e))}return}if(m()){this.appendLog(`Reloading Node clipboard-hub…`);try{let e=await H();this.applyNodeHubStatus(e),this.appendLog(e?.connected?`Node clipboard-hub reconnected`:`Node clipboard-hub not connected${e?.lastError?`: ${e.lastError}`:``}`)}catch(e){this.applyNodeHubStatus(null),this.appendLog(String(e instanceof Error?e.message:e))}return}this.appendLog(`Reconnecting WebSocket…`),se(),le()}async runFullTest(){if(!this.running){this.running=!0,this.els.testBtn&&(this.els.testBtn.disabled=!0);try{let e=await g().catch(()=>null);this.renderConfig(e);let t=e?.core,n=String(t?.endpointUrl??``),r=String(t?.ops?.directUrl??``),i=String(t?.userId??``),a=ne(e),o=a,s=a;this.appendLog(`Running /lna-probe on relay, direct, and fallback hosts…`);let c=await we({relay:n,direct:r},{clientId:i,token:o,accessToken:s}),l,u;c?.probes.length?(l=c.probes,u=c.dispatch,this.appendLog(`Probes via WebNative backend control RPC (/service/endpoint-probe).`)):(l=await Ce({relay:n,direct:r}),F()&&l.length&&l[0]?.label.startsWith(`Relay`)&&this.appendLog(`Probes via native Java bridge (network:probe).`));for(let e of l)this.appendLog(q(e));let d=l.filter(e=>e.ok).length;if(!u&&(d||n||r)&&(this.appendLog(d?`Testing dispatch on ${d} reachable host(s)…`:`Testing dispatch on configured hosts (all probes failed)…`),u=await Te(l,{relay:n,direct:r},{clientId:i,token:o,accessToken:s})),u&&(u.ok?this.appendLog(`Dispatch OK (${u.latencyMs??`?`}ms)`):this.appendLog(`Dispatch FAIL: ${u.error??u.status}${u.bodySnippet?` — ${u.bodySnippet.slice(0,80)}`:``}`)),this.renderProbes({probes:l,dispatch:u}),this.probeSummary=[...l.map(q),u?`Dispatch: ${u.ok?`OK`:`FAIL`} ${u.origin} ${u.error??u.status??``}`:``].filter(Boolean).join(`
`),I())this.setWsUi(!1);else if(!m()&&(!F()||!h()))!ce()&&ae()&&le();else if(m())try{this.applyNodeHubStatus(await V())}catch{}else F()&&h()&&await this.refreshJavaHubStatus()}catch(e){this.appendLog(String(e instanceof Error?e.message:e))}finally{this.running=!1,this.els.testBtn&&(this.els.testBtn.disabled=!1)}}}async runDestinationCheck(){if(!this.running){this.running=!0,this.els.destBtn&&(this.els.destBtn.disabled=!0),this.els.testBtn&&(this.els.testBtn.disabled=!0);try{let e=await g().catch(()=>null);this.renderConfig(e);let t=e?.core,n=String(t?.endpointUrl??``),r=String(t?.ops?.directUrl??``),i=String(t?.userId??``),a=ne(e),o=this.els.destInput?.value?.trim()||String(t?.socket?.routeTarget||``)||String(e?.shell?.clipboardShareDestinationIds||``),s=D(o);if(!s.length){this.appendLog(`No destination ids — enter L-196;L-210;… or set routeTarget in Settings.`);return}this.appendLog(`Checking ${s.length} destination(s) via gateway: ${s.join(`, `)}`);let c=await De(s,{relay:n,direct:r},{clientId:i,token:a,accessToken:a});for(let e of c)this.appendLog(`Dest ${e.id}: ${e.ok?`OK`:`FAIL`}${e.latencyMs==null?``:` (${e.latencyMs}ms)`}${e.error?` — ${e.error}`:``}`);this.renderProbes({probes:[],destinations:c}),this.probeSummary=c.map(e=>`Dest ${e.id}: ${e.ok?`OK`:`FAIL`} ${e.origin} ${e.error??e.status??``}`).join(`
`)}catch(e){this.appendLog(String(e instanceof Error?e.message:e))}finally{this.running=!1,this.els.destBtn&&(this.els.destBtn.disabled=!1),this.els.testBtn&&(this.els.testBtn.disabled=!1)}}}pageLogText(){return[...this.logLines].reverse().join(`
`)}async copyFrontendLog(){try{await ve().flush?.()}catch{}let e=O(600),t=await A(e);this.appendLog(t?`Frontend log copied to clipboard.`:`Copy failed — check clipboard permission.`)}async copyLogcat(){this.appendLog(`Reading logcat…`);let e=await k(600),t=await A(e);this.appendLog(t?`Logcat copied to clipboard.`:`Logcat copy failed.`)}async savePageLogs(){this.appendLog(`Building page log export…`);let e=await je(this.pageLogText(),this.probeSummary),t=Me(`cwsp-network`);j(t,e),this.appendLog(`Saved ${t}`)}}})))()}var Be,Y,X,Z,Ve;function He(){return(He=e((()=>{Be=(e=globalThis)=>{try{if(typeof e.Capacitor?.isNativePlatform==`function`&&e.Capacitor.isNativePlatform())return`capacitor`}catch{}try{if(e.__CWS_NEUTRALINO_BOOT__||e.NL_OS!=null||e.Neutralino)return`web`;if(e.__WEBNATIVE_AUTH__||e.__CWS_WEBNATIVE_BOOT__)return`webnative`}catch{}return`web`},Y=(e,t,n,r={})=>({id:e,layer:t,state:n,...r}),X=(e,t={})=>{let n=e===`capacitor`&&!!t.preferNativeWebsocket,r=n?t.nativeBridgeReady?`available`:`degraded`:t.wsConnected?`available`:`unavailable`,i=[Y(`transport.ws`,`transport`,r,{implementation:n?`native-java-ws`:`webview-ws`,reason:n?t.nativeBridgeReady?`CwspRuntime owns /ws`:`Native WS preferred but bridge not ready`:t.wsConnected?`WebView hub connected`:`WebView hub disconnected`}),Y(`transport.http-probe`,`transport`,t.httpProbeReady===!1?`unavailable`:`available`,{implementation:e===`capacitor`?`native-bridge-or-fetch`:e===`webnative`?`webnative-control-rpc`:`browser-fetch`,reason:t.httpProbeReady===!1?`No reachable /lna-probe candidate`:`Probe path enabled for surface`}),Y(`transport.dispatch`,`transport`,t.dispatchReady===!1?`unavailable`:`available`,{implementation:e===`capacitor`?`network:dispatch-probe`:e===`webnative`?`webnative-endpoint-probe`:`http-dispatch`,reason:t.dispatchReady===!1?`Dispatch probe path not ready`:`Dispatch probe path enabled`})],a=e===`capacitor`?[Y(`platform.native-bridge`,`platform`,t.nativeBridgeReady?`available`:`unavailable`,{implementation:`CwsBridge`,reason:t.nativeBridgeReady?`Native IPC ready`:`Native bridge unavailable`}),Y(`platform.webnative-control`,`platform`,`unsupported`,{reason:`WebNative control RPC is desktop-only`})]:e===`webnative`?[Y(`platform.native-bridge`,`platform`,`unsupported`,{reason:`Capacitor native bridge is Android-only`}),Y(`platform.webnative-control`,`platform`,t.webnativeControlReady===!1?`unavailable`:`available`,{implementation:`/service/endpoint-probe`,reason:t.webnativeControlReady===!1?`WebNative auth/control port missing`:`WebNative control RPC available`})]:[Y(`platform.native-bridge`,`platform`,`unsupported`,{reason:`Browser surface has no native bridge`}),Y(`platform.webnative-control`,`platform`,`unsupported`,{reason:`Browser surface has no WebNative control RPC`})],o=[Y(`diagnostics.frontend-log`,`diagnostics`,t.frontendLogReady===!1?`degraded`:`available`,{implementation:`__CWSP_FRONTEND_DEBUG__`,reason:t.frontendLogReady===!1?`Frontend debug capture not started`:`Frontend log ring available`}),Y(`diagnostics.logcat`,`diagnostics`,e===`capacitor`?t.nativeBridgeReady?`available`:`unavailable`:`unsupported`,{implementation:e===`capacitor`?`debug:logcat`:void 0,reason:e===`capacitor`?t.nativeBridgeReady?`Native logcat channel available`:`Logcat requires native bridge`:`Logcat is Capacitor/Android-only`}),Y(`diagnostics.page-export`,`diagnostics`,`available`,{implementation:`download-blob`,reason:`Page log download always available in Network view`})];return[...i,...a,...o]},Z=(e,t)=>{let n=new Map(t.map(e=>[e.id,e])),r=n.get(`transport.http-probe`);return!r||r.state===`unavailable`?!1:e===`capacitor`?n.get(`platform.native-bridge`)?.state===`available`||r.state===`available`:e===`webnative`?n.get(`platform.webnative-control`)?.state===`available`:r.state===`available`},Ve=(e,t={})=>{let n=X(e,t),r=n.filter(e=>e.layer===`transport`),i=n.filter(e=>e.layer===`platform`),a=n.filter(e=>e.layer===`diagnostics`),o=Z(e,n);return{surface:e,ready:o,transport:r,platform:i,diagnostics:a,blocker:o?void 0:n.find(e=>e.state===`unavailable`&&(e.id===`transport.http-probe`||e.id===`platform.native-bridge`||e.id===`platform.webnative-control`))}}})))()}function Ue(e){return new Q(e)}var Q;function $(){return($=e((()=>{ze(),He(),P(),y(),Q=class{id=`network`;name=`Network`;icon=`wifi-high`;options;element=null;panel=null;lifecycle={onMount:()=>{this.element&&(this.panel??=new J,this.panel.mount(this.element))},onUnmount:()=>{this.panel?.unmount(),this.panel=null,this.element=null},onShow:()=>{!this.panel&&this.element&&(this.panel=new J,this.panel.mount(this.element))}};constructor(e={}){this.options=e}render=e=>(e&&(this.options={...this.options,...e}),this.panel?.unmount(),this.panel=null,this.element=document.createElement(`div`),this.element.className=`cw-network-view-host`,this.element.dataset.view=`network`,this.element);getToolbar(){return null}}})))()}$();export{M as NETWORK_A11Y,Q as NetworkView,N as applyNetworkA11y,Pe as auditNetworkA11y,Fe as createNetworkA11yFixture,Ue as createNetworkView,Ue as default,Be as detectNetworkSurface,Z as isNetworkProbePathReady,v as labelForProbeCandidate,_ as normalizeProbeOrigin,be as pickDispatchOrigin,X as resolveNetworkCapabilities,Ve as summarizeNetworkCapabilities};