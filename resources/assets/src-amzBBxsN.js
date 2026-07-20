import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{F as t,Q as n,X as r,t as i}from"./src-kpjtbscK.js";import{a,c as o,o as s,s as c,t as l}from"./cws-bridge-CRDA1GOm.js";import{F as u,G as d,H as f,I as p,R as m,V as ee}from"./airpad-cwsp-client-parity-BenwfXdR.js";import{a as te,r as ne}from"./SettingsTypes-CYs_ErWW.js";import{C as re,T as h,w as g,y as ie}from"./config-qtVXAJOy.js";import{a as ae,o as _}from"./Settings-D17BDtwb.js";import{C as oe,D as se,E as ce,M as le,O as ue,T as de,j as fe,w as pe}from"./cwsp-app.js";import{i as v,n as me,r as he}from"./frontend-debug-capture-BNPCucC4.js";var ge,y,b,_e,ve=e((()=>{m(),ge=e=>typeof e==`string`?e.trim():``,y=e=>{let t=ge(e).replace(/\/lna-probe\/?$/i,``).replace(/\/+$/,``);if(!t)return``;let n=ee(t);if(!n?.host)return t;let r=n.protocol??`https`;return n.port?`${r}://${n.host}:${n.port}`:`${r}://${n.host}:8434`},b=(e,t,n)=>{let r=new Set(d(n.relay??``).map(e=>y(e))),i=new Set(d(n.direct??``).map(e=>y(e))),a=y(e);return r.has(a)?t===0?`Relay / gateway`:`Relay (alt)`:i.has(a)?`Direct peer`:a.includes(`192.168.0.200`)?`Gateway LAN fallback`:a.includes(`45.147.121.152`)?`Gateway WAN fallback`:a.includes(`127.0.0.1`)||a.includes(`localhost`)?`Loopback`:`Candidate ${t+1}`},_e=(e,t)=>{let n=e.find(e=>e.ok)?.origin;if(n)return y(n);let r=p(t);return r[0]?r[0]:e[0]?.origin?y(e[0].origin):``}}));async function ye(e){if(!o())return null;let t=p(e);try{let n=await c({channel:`network:probe`,payload:{relay:y(S(e.relay)),direct:y(S(e.direct)),candidates:t}}),r=n.echo,i=n.results??r?.results;if(!Array.isArray(i)||!i.length)return null;let a=new Set,o=[];for(let t=0;t<i.length;t++){let n=i[t],r=y(String(n.url??``));if(!r||a.has(r))continue;a.add(r);let s=!!n.reachable,c=typeof n.statusCode==`number`?n.statusCode:void 0;o.push({label:b(r,o.length,e),origin:r,ok:s,status:c,error:E(n,s,c)})}return o.length?o:null}catch{return null}}async function be(e,t){if(!o())return null;let n=y(e);if(!n)return null;let r=Date.now();try{let e=await c({channel:`network:dispatch-probe`,payload:{origin:n,clientId:S(t.clientId),token:S(t.token),accessToken:S(t.accessToken)}}),i=typeof e.statusCode==`number`?e.statusCode:void 0,a=!!e.ok,o=typeof e.error==`string`?e.error.trim():``,s=typeof e.bodySnippet==`string`?e.bodySnippet:``;return{origin:n,ok:a,status:i,latencyMs:Date.now()-r,bodySnippet:s,error:a?void 0:o||(i==null?`dispatch failed`:`HTTP ${i}`)}}catch{return null}}async function xe(e,t={}){let n=await ye(e);if(n?.length)return n;let r=await D(e);if(r?.length)return r;let i=t.timeoutMs??3500,a=t.maxCandidates??6,o=[],s=p(e);for(let t=0;t<s.length;t++){let n=s[t],r=b(n,t,e),c=u(n).slice(0,a);if(!c.length){o.push({label:r,origin:n,ok:!1,error:`invalid host`});continue}for(let e of c){let t=await f(e,{timeoutMs:i});if(o.push({label:r,...t}),t.ok)break}}return o}async function x(e,t){if(!C())return null;let n=w(`/service/endpoint-probe`);if(!n)return null;let r=globalThis.__WEBNATIVE_AUTH__?.key,i=p(e),a=typeof AbortController<`u`?new AbortController:void 0,o=a?globalThis.setTimeout(()=>a.abort(),12e3):void 0;try{let o=await fetch(n,{method:`POST`,headers:r?{"Content-Type":`application/json`,"X-API-Key":r}:{"Content-Type":`application/json`},body:JSON.stringify({origins:i,dispatch:!0,auth:t}),signal:a?.signal});if(!o.ok)return null;let s=await o.json();return{probes:(s.rows??[]).map((t,n)=>({label:b(t.origin,n,e),origin:t.origin,ok:t.ok,status:t.status,error:t.error,latencyMs:t.latencyMs})),dispatch:s.dispatch?{origin:s.dispatch.origin,ok:s.dispatch.ok,status:s.dispatch.status,error:s.dispatch.error,bodySnippet:s.dispatch.bodySnippet,latencyMs:s.dispatch.latencyMs}:void 0}}catch{return null}finally{o&&clearTimeout(o)}}async function Se(e,t,n,r=8e3){let i=e.filter(e=>e.ok).map(e=>y(e.origin)),a=i.length?i:p(t),o={origin:``,ok:!1,error:`no origin`};for(let e of a)if(o=await Ce(e,n,r),o.ok)return o;return o}async function Ce(e,t,n=8e3){let r=y(e),i=Date.now();if(!r)return{origin:``,ok:!1,error:`no origin`};let a=await be(r,t);if(a)return a;let o=typeof AbortController<`u`?new AbortController:void 0,s=o&&n>0?globalThis.setTimeout(()=>o.abort(),n):void 0,c=S(t.clientId),l=S(t.token),u=S(t.accessToken),d={"Content-Type":`application/json`};u&&(d[`x-auth-token`]=u),l&&(d[`x-cws-token`]=l);let f={userId:c,byId:c,from:c,clientId:c,userKey:u||l,token:l||u,accessToken:u||l,op:`ask`,what:`debug:isReady`,payload:{}};try{let e=await fetch(`${r}/api/network/dispatch`,{method:`POST`,mode:`cors`,cache:`no-store`,credentials:`omit`,headers:d,body:JSON.stringify(f),signal:o?.signal}),t=await e.text().catch(()=>``),n=Date.now()-i,a=e.ok;return{origin:r,ok:a,status:e.status,statusText:e.statusText,latencyMs:n,bodySnippet:t.slice(0,240),error:a?void 0:`HTTP ${e.status}${e.statusText?` ${e.statusText}`:``}`.trim()}}catch(e){return{origin:r,ok:!1,error:T(e),latencyMs:Date.now()-i}}finally{s&&clearTimeout(s)}}async function we(e,t,n,r={}){let i=e.map(e=>e.trim()).filter(Boolean);if(!i.length)return[];let a=r.timeoutMs??8e3,s=[y(r.originHint||``),...p(t).map(y)].filter(Boolean)[0]||``;if(!s)return i.map(e=>({id:e,ok:!1,origin:``,error:`no gateway origin`}));let l=S(n.clientId),u=S(n.token),d=S(n.accessToken),f=[];for(let e of i){let t=Date.now(),n={"Content-Type":`application/json`};d&&(n[`x-auth-token`]=d),u&&(n[`x-cws-token`]=u);let r={userId:l,byId:l,from:l,clientId:l,userKey:d||u,token:u||d,accessToken:d||u,op:`ask`,what:`clipboard:isReady`,purpose:`clipboard`,nodes:[e],destinations:[e],payload:{probe:!0,destination:e}};if(o())try{let n=await c({channel:`network:dispatch-probe`,payload:{origin:s,clientId:l,token:u,accessToken:d,what:`clipboard:isReady`,nodes:[e],destinations:[e]}}),r=typeof n.statusCode==`number`?n.statusCode:void 0,i=!!n.ok,a=typeof n.error==`string`?n.error.trim():``;f.push({id:e,origin:s,ok:i,status:r,latencyMs:Date.now()-t,bodySnippet:typeof n.bodySnippet==`string`?n.bodySnippet:void 0,error:i?void 0:a||(r==null?`dispatch failed`:`HTTP ${r}`)});continue}catch{}let i=typeof AbortController<`u`?new AbortController:void 0,p=i&&a>0?globalThis.setTimeout(()=>i.abort(),a):void 0;try{let a=await fetch(`${s}/api/network/dispatch`,{method:`POST`,mode:`cors`,cache:`no-store`,credentials:`omit`,headers:n,body:JSON.stringify(r),signal:i?.signal}),o=await a.text().catch(()=>``),c=a.ok;f.push({id:e,origin:s,ok:c,status:a.status,latencyMs:Date.now()-t,bodySnippet:o.slice(0,240),error:c?void 0:`HTTP ${a.status}${a.statusText?` ${a.statusText}`:``}`.trim()})}catch(n){f.push({id:e,origin:s,ok:!1,error:T(n),latencyMs:Date.now()-t})}finally{p&&clearTimeout(p)}}return f}var S,C,w,T,E,D,O,Te=e((()=>{m(),a(),ve(),S=e=>typeof e==`string`?e.trim():``,C=()=>{try{let e=globalThis;return!!(e.__WEBNATIVE_AUTH__||e.__CWS_WEBNATIVE_BOOT__)}catch{return!1}},w=e=>{try{let t=globalThis.__WEBNATIVE_AUTH__;return t?.port?`http://127.0.0.1:${t.port}${e}`:null}catch{return null}},T=e=>{let t=e instanceof Error?e.message:String(e??`fetch failed`);return/abort/i.test(t)?`timeout`:/refused|ECONNREFUSED/i.test(t)?`connection refused`:/ENOTFOUND|NAME_NOT_RESOLVED/i.test(t)?`host not found`:/certificate|cert\.|ssl|tls|ERR_CERT/i.test(t)?`TLS: ${t}`:/failed to fetch/i.test(t)&&o()?`WebView fetch blocked (CORS/TLS) — use native bridge`:t},E=(e,t,n)=>{if(t)return;let r=[];return e.error&&r.push(String(e.error)),n!=null&&n>=0&&n!==204&&r.push(`HTTP ${n}`),r.join(` · `)||`unreachable`},D=async e=>{let t=await x(e,{});return t?.probes.length?t.probes:null},O=e=>{let t=String(e||``).trim();if(!t)return[];let n=new Set,r=[];for(let e of t.split(/[,;\s\n\r]+/)){let t=e.trim();!t||n.has(t)||(n.add(t),r.push(t))}return r}})),k,A,j,M,N,P,F,Ee,De=e((()=>{v(),a(),fe(),k=e=>`${new Date(e.ts).toISOString()} [${e.level}] (${e.scope}) ${e.msg}`,A=(e=400)=>{let t=me()?.tail(e)??[];return t.length?t.map(k).join(`
`)+`
`:`(no frontend log entries — boot WebView debug capture first)
`},j=async(e=400)=>{try{let t=await c({channel:`debug:logcat`,payload:{limit:e}}),n=t.echo,r=typeof t.text==`string`?t.text:``,i=typeof n?.text==`string`?n.text:``,a=(r||i).trim();if(a)return a.endsWith(`
`)?a:`${a}\n`}catch(e){return`(logcat failed: ${e instanceof Error?e.message:String(e)})\n`}return`(logcat unavailable — native bridge missing or not on Android)
`},M=async(e=400)=>{try{let t=await c({channel:`debug:frontend`,payload:{limit:e}}),n=t.echo,r=typeof t.text==`string`?t.text:typeof n?.text==`string`?n.text:``;if(r.trim())return r.endsWith(`
`)?r:`${r}\n`}catch{}return``},N=async(e,t=``)=>{let n=[`CWSP Network diagnostics export`,`generated: ${new Date().toISOString()}`,`userAgent: ${navigator.userAgent}`,``].join(`
`),r=A(500),i=await M(500),a=await j(500);return[n,`=== Page log ===`,e||`(empty)`,``,t?`=== Probe summary ===
`+t+`
`:``,`=== Frontend log (WebView ring) ===`,r,i.trim()?`=== Frontend log (native ring) ===
`+i+`
`:``,`=== Logcat (native) ===`,a].filter(Boolean).join(`
`)},P=async e=>{let t=e||`(empty log)`;try{return await le(t),!0}catch{return!1}},F=(e,t)=>{let n=new Blob([t],{type:`text/plain;charset=utf-8`}),r=URL.createObjectURL(n),i=document.createElement(`a`);i.href=r,i.download=e,i.rel=`noopener`,document.body.append(i),i.click(),i.remove(),URL.revokeObjectURL(r)},Ee=e=>`${e}-${new Date().toISOString().replace(/[:.]/g,`-`)}.txt`})),I,L,Oe,ke,Ae=e((()=>{I={root:{selector:`.cw-network-view`,role:`main`,label:`CWSP Network`},statusGrid:{selector:`.cw-network-status-grid`,role:`status`,ariaLive:`polite`,ariaAtomic:`false`},activityLog:{selector:`[data-log]`,ariaLive:`polite`,ariaRelevant:`additions text`,role:`log`},probeList:{selector:`[data-probe-list]`,role:`list`},actions:[{action:`test`,label:`Run network test`},{action:`reconnect`,label:`Reconnect WebSocket`},{action:`open-settings`,label:`Open settings`},{action:`copy-frontend-log`,label:`Copy frontend log`},{action:`copy-logcat`,label:`Copy logcat`},{action:`save-page-logs`,label:`Save page logs`}],minTouchTargetPx:44},L=e=>{let{root:t,statusGrid:n,activityLog:r,probeList:i,actions:a}=I;e.setAttribute(`role`,t.role),!e.getAttribute(`aria-label`)&&!e.getAttribute(`aria-labelledby`)&&e.setAttribute(`aria-label`,t.label);let o=e.querySelector(`h1`);o&&!o.id&&(o.id=`cw-network-view-title`,e.setAttribute(`aria-labelledby`,o.id),e.removeAttribute(`aria-label`));let s=e.querySelector(n.selector);s instanceof HTMLElement&&(s.setAttribute(`role`,n.role),s.setAttribute(`aria-live`,n.ariaLive),s.setAttribute(`aria-atomic`,n.ariaAtomic));let c=e.querySelector(r.selector);c instanceof HTMLElement&&(c.setAttribute(`role`,r.role),c.setAttribute(`aria-live`,r.ariaLive),c.setAttribute(`aria-relevant`,r.ariaRelevant));let l=e.querySelector(i.selector);l instanceof HTMLElement&&l.setAttribute(`role`,i.role);for(let t of a){let n=e.querySelector(`[data-action="${t.action}"]`);n instanceof HTMLElement&&(!n.getAttribute(`aria-label`)&&!n.textContent?.trim()&&n.setAttribute(`aria-label`,t.label),n instanceof HTMLButtonElement&&!n.type&&(n.type=`button`))}},Oe=e=>{let t=[],{root:n,statusGrid:r,activityLog:i,probeList:a,actions:o}=I;e.getAttribute(`role`)!==n.role&&t.push({code:`root-role`,message:`root role must be "${n.role}"`}),!e.getAttribute(`aria-label`)&&!e.getAttribute(`aria-labelledby`)&&t.push({code:`root-label`,message:`root needs aria-label or aria-labelledby`});let s=e.querySelector(r.selector);s?(s.getAttribute(`role`)!==r.role&&t.push({code:`status-role`,message:`status grid role must be "${r.role}"`}),s.getAttribute(`aria-live`)!==r.ariaLive&&t.push({code:`status-live`,message:`status grid aria-live must be "${r.ariaLive}"`})):t.push({code:`status-grid-missing`,message:`status grid missing`});let c=e.querySelector(i.selector);c?(c.getAttribute(`aria-live`)!==i.ariaLive&&t.push({code:`log-live`,message:`log aria-live must be "${i.ariaLive}"`}),c.getAttribute(`role`)!==i.role&&t.push({code:`log-role`,message:`log role must be "${i.role}"`})):t.push({code:`log-missing`,message:`activity log [data-log] missing`});let l=e.querySelector(a.selector);l?l.getAttribute(`role`)!==a.role&&t.push({code:`probe-list-role`,message:`probe list role must be "${a.role}"`}):t.push({code:`probe-list-missing`,message:`probe list missing`});for(let n of o){let r=e.querySelector(`[data-action="${n.action}"]`);if(!r){t.push({code:`action-missing:${n.action}`,message:`action button data-action="${n.action}" missing`});continue}r.getAttribute(`aria-label`)||r.textContent?.trim()||t.push({code:`action-label:${n.action}`,message:`action "${n.action}" needs accessible name`})}return t},ke=(e=document)=>{let t=e.createElement(`div`);return t.className=`cw-network-view`,t.dataset.view=`network`,t.innerHTML=`
        <header class="cw-network-view__header">
            <h1>CWSP Network</h1>
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
    `,L(t),t}})),je,Me=e((()=>{je=`@layer ui-network {
  /* Host fills minimal-shell absolute view slot */
  .cw-network-view-host {
    display: flex;
    flex-direction: column;
    block-size: 100%;
    min-block-size: 0;
    overflow: hidden;
  }
  .cw-network-view {
    display: flex;
    flex-direction: column;
    gap: 0;
    block-size: 100%;
    min-block-size: 0;
    overflow: hidden;
    color: var(--c2-on-surface, light-dark(#1a1a1a, #e8e8e8));
    background: var(--c2-surface, light-dark(#f5f5f5, #121212));
    font-family: system-ui, sans-serif;
  }
  .cw-network-view__header {
    flex: 0 0 auto;
    padding: 0.85rem 1rem 0.65rem;
  }
  .cw-network-view__header h1 {
    margin: 0;
    font-size: 1.15rem;
    font-weight: 650;
  }
  .cw-network-view__header p {
    margin: 0.25rem 0 0;
    opacity: 0.78;
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
    border-radius: 10px;
    border: 1px solid light-dark(rgba(0, 0, 0, 0.08), rgba(255, 255, 255, 0.1));
    background: light-dark(rgba(255, 255, 255, 0.72), rgba(255, 255, 255, 0.04));
  }
  .cw-network-status-card[data-state=ok] {
    border-color: color-mix(in oklab, #2e7d32 55%, transparent);
  }
  .cw-network-status-card[data-state=bad] {
    border-color: color-mix(in oklab, #c62828 55%, transparent);
  }
  .cw-network-status-card[data-state=warn] {
    border-color: color-mix(in oklab, #ef6c00 55%, transparent);
  }
  .cw-network-status-card__title {
    font-size: 0.78rem;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    opacity: 0.72;
  }
  .cw-network-status-card__value {
    font-size: 1rem;
    font-weight: 600;
    word-break: break-word;
  }
  .cw-network-status-card__detail {
    font-size: 0.82rem;
    opacity: 0.88;
    word-break: break-word;
  }
  .cw-network-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }
  .cw-network-actions button {
    appearance: none;
    border: 1px solid light-dark(rgba(0, 0, 0, 0.12), rgba(255, 255, 255, 0.14));
    background: light-dark(#fff, #1e1e1e);
    color: inherit;
    border-radius: 999px;
    padding: 0.45rem 0.85rem;
    font-size: 0.88rem;
    cursor: pointer;
  }
  .cw-network-actions button:disabled {
    opacity: 0.55;
    cursor: wait;
  }
  .cw-network-actions--logs button {
    font-size: 0.8rem;
  }
  .cw-network-dest-field {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
    font-size: 0.88rem;
  }
  .cw-network-dest-field input {
    appearance: none;
    border: 1px solid light-dark(rgba(0, 0, 0, 0.12), rgba(255, 255, 255, 0.14));
    background: light-dark(#fff, #1e1e1e);
    color: inherit;
    border-radius: 0.5rem;
    padding: 0.5rem 0.75rem;
    font-size: 0.9rem;
  }
  .cw-network-dest-hint {
    margin: 0;
    font-size: 0.8rem;
    opacity: 0.8;
  }
  .cw-network-probes {
    display: flex;
    flex-direction: column;
    gap: 0.45rem;
    min-block-size: 0;
  }
  .cw-network-probes [data-probe-list] {
    display: flex;
    flex-direction: column;
    gap: 0.45rem;
  }
  .cw-network-probes h2 {
    margin: 0;
    font-size: 0.95rem;
  }
  .cw-network-probe-row {
    display: grid;
    gap: 0.15rem;
    padding: 0.55rem 0.65rem;
    border-radius: 8px;
    background: light-dark(rgba(0, 0, 0, 0.04), rgba(255, 255, 255, 0.05));
    font-size: 0.82rem;
  }
  .cw-network-probe-row[data-ok=true] {
    box-shadow: inset 3px 0 0 #2e7d32;
  }
  .cw-network-probe-row[data-ok=false] {
    box-shadow: inset 3px 0 0 #c62828;
  }
  .cw-network-probe-row__head {
    display: flex;
    justify-content: space-between;
    gap: 0.5rem;
    font-weight: 600;
  }
  .cw-network-probe-row__error {
    color: #c62828;
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
    border-block-start: 1px solid light-dark(rgba(0, 0, 0, 0.1), rgba(255, 255, 255, 0.12));
    background: light-dark(rgba(0, 0, 0, 0.03), rgba(0, 0, 0, 0.22));
  }
  .cw-network-log-panel__title {
    flex: 0 0 auto;
    margin: 0;
    font-size: 0.72rem;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    opacity: 0.72;
  }
  .cw-network-log {
    flex: 1 1 auto;
    margin: 0;
    padding: 0.55rem 0.65rem;
    border-radius: 8px;
    min-block-size: 3.5rem;
    overflow: auto;
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: 0.75rem;
    line-height: 1.35;
    background: light-dark(rgba(0, 0, 0, 0.05), rgba(0, 0, 0, 0.35));
    white-space: pre-wrap;
    word-break: break-word;
  }
}`})),R,z,B,V,H,Ne,U,W,G,K,q,Pe,J,Y,Fe=e((()=>{i(),r(),ae(),ce(),ie(),a(),Te(),ne(),De(),v(),Ae(),Me(),R=()=>{try{let e=globalThis.Capacitor;return typeof e?.isNativePlatform==`function`&&!!e.isNativePlatform()}catch{return!1}},z=29110,B=`cwsp-neutralino-local`,V=()=>{try{let e=globalThis,t=e.__WEBNATIVE_AUTH__||e.__NEUTRALINO_AUTH__;return{port:Number(t?.port)||z,key:String(t?.key||B)}}catch{return{port:z,key:B}}},H=async()=>{try{let e=globalThis,t=typeof e.NL_PATH==`string`?e.NL_PATH:``,n=e.Neutralino?.filesystem?.readFile;if(!t||!n)return;let r=await n(`${t}/.tmp/cwsp-control-auth.json`),i=JSON.parse(r),a=Number(i?.port);if(!Number.isFinite(a)||a<1024||a===8434)return;let o={port:a,key:String(i?.key||`cwsp-neutralino-local`)};e.__WEBNATIVE_AUTH__=o,e.__NEUTRALINO_AUTH__=o}catch{}},Ne=async(e,t)=>{let n=typeof AbortSignal<`u`&&typeof AbortSignal.timeout==`function`?AbortSignal.timeout(1500):void 0;try{let r=await fetch(`http://127.0.0.1:${e}/service/clipboard-hub`,{method:`GET`,headers:{"X-API-Key":t},cache:`no-store`,signal:n});if(!r.ok)return null;let i=await r.json();return typeof i?.running!=`boolean`&&typeof i?.connected!=`boolean`?null:i}catch{return null}},U=async()=>{try{let e=globalThis;if(document.documentElement?.dataset?.cwspSurface===`cwsp-control`&&!e.__CWS_NODE_CLIPBOARD_HUB__)return null}catch{}await H();let e=V(),t=typeof document<`u`&&document.documentElement?.dataset?.cwspSurface===`cwsp-control`,n=Array.from(new Set((t?[e.port,z,29110]:[e.port,z,29110,19875,19876]).filter(e=>e>1024)));for(let t of n){let n=await Ne(t,e.key);if(n){let r=globalThis;return r.__WEBNATIVE_AUTH__={port:t,key:e.key},r.__NEUTRALINO_AUTH__={port:t,key:e.key},n}}return null},W=async()=>{let e=await U(),{port:t,key:n}=V(),r=typeof AbortSignal<`u`&&typeof AbortSignal.timeout==`function`?AbortSignal.timeout(3e3):void 0;try{let i=await fetch(`http://127.0.0.1:${t}/service/clipboard-hub`,{method:`POST`,headers:{"Content-Type":`application/json`,"X-API-Key":n},body:JSON.stringify({reload:!0,force:!0}),cache:`no-store`,signal:r});return i.ok?await i.json():e}catch{return e}},G=0,K=0,q=async()=>{let e=Date.now();if(e-G<8e3)return!1;G=e;try{let e=globalThis.Neutralino;return e?.extensions?.dispatch?(await e.extensions.dispatch(`extNode`,`runNode`,{function:`backend.ensure`,parameter:null}),!0):!1}catch{return!1}},Pe=async()=>{let e=Date.now();return e-K<1e4?null:(K=e,W())},J=e=>{let t=[`${e.label}: ${e.origin}`];return e.ok?t.push(`OK (${e.latencyMs??`?`}ms)`):e.status&&t.push(`FAIL HTTP ${e.status}`),e.error&&t.push(e.error),t.join(` — `)},Y=class{root=null;sheet=null;wsUnsub=null;nodeHubPoll=null;running=!1;logLines=[];probeSummary=``;els={wsCard:null,wsValue:null,wsDetail:null,nativeCard:null,nativeValue:null,configDetail:null,probeList:null,log:null,testBtn:null,destBtn:null,destInput:null,reconnectBtn:null};mount(e){return this.sheet??=n(je),this.root=t`
            <div class="cw-network-view" data-view="network">
                <header class="cw-network-view__header">
                    <h1>CWSP Network</h1>
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
                        <button type="button" data-action="test">Run network test</button>
                        <button type="button" data-action="check-destinations">Check destinations</button>
                        <button type="button" data-action="reconnect">Reconnect WS</button>
                        <button type="button" data-action="open-settings">Settings</button>
                    </div>

                    <label class="cw-network-dest-field">
                        <span>Destination node ids</span>
                        <input type="text" data-dest-ids placeholder="L-196;L-210;L-208" autocomplete="off" />
                    </label>
                    <p class="cw-network-dest-hint">Probe clipboard:isReady to each id via gateway (45.147 / .200) — works for Android↔Android on LAN too.</p>

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
        `,this.els.wsCard=this.root.querySelector(`[data-ws-card]`),this.els.wsValue=this.root.querySelector(`[data-ws-value]`),this.els.wsDetail=this.root.querySelector(`[data-ws-detail]`),this.els.nativeCard=this.root.querySelector(`[data-native-card]`),this.els.nativeValue=this.root.querySelector(`[data-native-value]`),this.els.configDetail=this.root.querySelector(`[data-config-detail]`),this.els.probeList=this.root.querySelector(`[data-probe-list]`),this.els.log=this.root.querySelector(`[data-log]`),this.els.testBtn=this.root.querySelector(`[data-action="test"]`),this.els.destBtn=this.root.querySelector(`[data-action="check-destinations"]`),this.els.destInput=this.root.querySelector(`[data-dest-ids]`),this.els.reconnectBtn=this.root.querySelector(`[data-action="reconnect"]`),L(this.root),this.els.testBtn?.addEventListener(`click`,()=>void this.runFullTest()),this.els.destBtn?.addEventListener(`click`,()=>void this.runDestinationCheck()),this.els.reconnectBtn?.addEventListener(`click`,()=>void this.reconnectWs()),this.root.querySelector(`[data-action="open-settings"]`)?.addEventListener(`click`,()=>{globalThis.dispatchEvent(new CustomEvent(`cw:view-open-request`,{detail:{viewId:`settings`,target:`minimal`}}))}),this.root.querySelector(`[data-action="copy-frontend-log"]`)?.addEventListener(`click`,()=>{this.copyFrontendLog()}),this.root.querySelector(`[data-action="copy-logcat"]`)?.addEventListener(`click`,()=>{this.copyLogcat()}),this.root.querySelector(`[data-action="save-page-logs"]`)?.addEventListener(`click`,()=>{this.savePageLogs()}),e.replaceChildren(this.root),this.bootstrap(),this.root}unmount(){this.wsUnsub?.(),this.wsUnsub=null,this.nodeHubPoll&&=(clearInterval(this.nodeHubPoll),null),this.root?.remove(),this.root=null}appendLog(e){let t=new Date().toLocaleTimeString();this.logLines.unshift(`[${t}] ${e}`),this.logLines=this.logLines.slice(0,40),this.els.log&&(this.els.log.textContent=this.logLines.join(`
`))}setWsUi(e,t){if(!(!this.els.wsCard||!this.els.wsValue)){if(R()&&h()){this.els.wsCard.dataset.state=e?`ok`:`bad`,this.els.wsValue.textContent=e?`Java CwspBridge Connected`:`Java CwspBridge Disconnected`,this.els.wsDetail&&(this.els.wsDetail.textContent=t||"CwspBridgeService holds `/ws` — WebView browser WebSocket is not used.");return}if(g()){this.els.wsCard.dataset.state=e?`ok`:`bad`,this.els.wsValue.textContent=e?`Node clipboard-hub Connected`:`Node clipboard-hub Disconnected`,this.els.wsDetail&&(this.els.wsDetail.textContent=t||"LAN clipboard uses Node `/service/clipboard-hub` — not the WebView WebSocket API.");return}this.els.wsCard.dataset.state=e?`ok`:`bad`,this.els.wsValue.textContent=e?`Connected`:`Disconnected`,this.els.wsDetail&&(this.els.wsDetail.textContent=t||``)}}async refreshJavaHubStatus(){try{let e=await s(`coordinator:status`,{}),t=e.echo??{},n=!!(t.wsOpen??t.connected??e.ok),r=[t.daemon===!1?`daemon-stopped`:`daemon`,n?`ws-open`:`ws-closed`];this.setWsUi(n,r.join(` · `))}catch(e){this.setWsUi(!1,`Java coordinator:status unreachable`),this.appendLog(String(e instanceof Error?e.message:e))}}applyNodeHubStatus(e){if(!e){this.setWsUi(!1,`Node clipboard-hub unreachable (:${V().port})`);return}let t=!!e.connected,n=[e.running?`running`:`stopped`,e.localId?`id=${e.localId}`:``,e.hasToken===!1?`no-token`:``,e.hubUrl?e.hubUrl:``,e.lastError?`err=${e.lastError}`:``].filter(Boolean);this.setWsUi(t,n.join(` · `))}renderConfig(e){if(!this.els.configDetail)return;let t=e?.core,n=String(t?.endpointUrl??`—`),r=String(t?.ops?.directUrl??`—`),i=String(t?.userId??`—`),a=String(t?.socket?.routeTarget??`*`);if(this.els.configDetail.textContent=[`Relay: ${n}`,`Direct: ${r}`,`Client: ${i}`,`Route: ${a}`].join(`
`),this.els.destInput&&!this.els.destInput.value.trim()){let t=String(e?.shell?.clipboardShareDestinationIds||``).trim();this.els.destInput.value=a&&a!==`*`?a:t||`L-196;L-210;L-208`}}renderProbes(e){if(!this.els.probeList)return;this.els.probeList.replaceChildren();let n=[...e.probes];if(e.dispatch){let t=e.dispatch;n.push({label:`Dispatch /api/network/dispatch`,origin:t.origin,ok:t.ok,status:t.status,statusText:t.statusText,error:t.error||(t.bodySnippet?t.bodySnippet.slice(0,120):void 0),latencyMs:t.latencyMs})}for(let t of e.destinations||[])n.push({label:`Destination ${t.id}`,origin:t.origin||t.id,ok:t.ok,status:t.status,error:t.error||(t.bodySnippet?t.bodySnippet.slice(0,120):void 0),latencyMs:t.latencyMs});if(!n.length){let e=document.createElement(`p`);e.textContent=`No probes yet — tap Run network test.`,e.style.opacity=`0.75`,e.style.fontSize=`0.85rem`,this.els.probeList.append(e);return}for(let e of n){let n=t`
                <div class="cw-network-probe-row" data-ok="${e.ok?`true`:`false`}">
                    <div class="cw-network-probe-row__head">
                        <span>${e.label}</span>
                        <span>${e.ok?`OK`:`FAIL`}${e.latencyMs==null?``:` · ${e.latencyMs}ms`}</span>
                    </div>
                    <div>${e.origin}</div>
                    ${e.error?`<div class="cw-network-probe-row__error">${e.error}</div>`:``}
                </div>
            `;this.els.probeList.append(n)}}async bootstrap(){if(he(),g()){this.els.nativeCard?.removeAttribute(`hidden`),this.els.nativeValue&&(this.els.nativeValue.textContent=`Node clipboard-hub`),this.els.nativeCard&&(this.els.nativeCard.dataset.state=`ok`);let e=async()=>{try{await H();let e=await U();if(e?.running&&!e.connected){let t=await Pe();t&&(e=t)}this.applyNodeHubStatus(e),e||await q()&&this.appendLog(`Requested backend.ensure (control unreachable).`)}catch(e){this.applyNodeHubStatus(null),q(),this.appendLog(String(e instanceof Error?e.message:e))}};await e(),this.nodeHubPoll=setInterval(()=>void e(),2500);let t=await _().catch(()=>null);this.renderConfig(t),this.appendLog(`Ready — WebSocket status from Node clipboard-hub (not WebView).`);return}if(R()&&h()){this.els.nativeCard?.removeAttribute(`hidden`);try{let e=await l.getShellInfo();this.els.nativeValue&&(this.els.nativeValue.textContent=e.native?`Capacitor · Java /ws · ${e.platform??`android`}`:`Web fallback`),this.els.nativeCard&&(this.els.nativeCard.dataset.state=e.native?`ok`:`warn`)}catch(e){this.els.nativeValue&&(this.els.nativeValue.textContent=`Bridge unavailable`),this.appendLog(String(e instanceof Error?e.message:e))}await this.refreshJavaHubStatus(),this.nodeHubPoll=setInterval(()=>void this.refreshJavaHubStatus(),2500);let e=await _().catch(()=>null);this.renderConfig(e),this.appendLog(`Ready — WebSocket status from Java CwspBridgeService (not WebView).`);return}if(de(null),this.wsUnsub=ue(e=>{this.setWsUi(e)}),this.setWsUi(se()),R()){this.els.nativeCard?.removeAttribute(`hidden`);try{let e=await l.getShellInfo();this.els.nativeValue&&(this.els.nativeValue.textContent=e.native?`Capacitor · ${e.platform??`android`}`:`Web fallback`),this.els.nativeCard&&(this.els.nativeCard.dataset.state=e.native?`ok`:`warn`)}catch(e){this.els.nativeValue&&(this.els.nativeValue.textContent=`Bridge unavailable`),this.appendLog(String(e instanceof Error?e.message:e))}}let e=await _().catch(()=>null);this.renderConfig(e),this.appendLog(`Ready — tap Run network test for full probe.`)}async reconnectWs(){if(R()&&h()){this.appendLog(`Reconnecting Java CwspBridge /ws…`);try{let e=await s(`runtime:reload-settings`,{});await this.refreshJavaHubStatus(),this.appendLog(e?.ok?`Java /ws reconnect requested`:`Java /ws reconnect failed`)}catch(e){this.appendLog(String(e instanceof Error?e.message:e))}return}if(g()){this.appendLog(`Reloading Node clipboard-hub…`);try{let e=await W();this.applyNodeHubStatus(e),this.appendLog(e?.connected?`Node clipboard-hub reconnected`:`Node clipboard-hub not connected${e?.lastError?`: ${e.lastError}`:``}`)}catch(e){this.applyNodeHubStatus(null),this.appendLog(String(e instanceof Error?e.message:e))}return}this.appendLog(`Reconnecting WebSocket…`),pe(),oe()}async runFullTest(){if(!this.running){this.running=!0,this.els.testBtn&&(this.els.testBtn.disabled=!0);try{let e=await _().catch(()=>null);this.renderConfig(e);let t=e?.core,n=String(t?.endpointUrl??``),r=String(t?.ops?.directUrl??``),i=String(t?.userId??``),a=te(e),o=a,s=a;this.appendLog(`Running /lna-probe on relay, direct, and fallback hosts…`);let c=await x({relay:n,direct:r},{clientId:i,token:o,accessToken:s}),l,u;c?.probes.length?(l=c.probes,u=c.dispatch,this.appendLog(`Probes via WebNative backend control RPC (/service/endpoint-probe).`)):(l=await xe({relay:n,direct:r}),R()&&l.length&&l[0]?.label.startsWith(`Relay`)&&this.appendLog(`Probes via native Java bridge (network:probe).`));for(let e of l)this.appendLog(J(e));let d=l.filter(e=>e.ok).length;if(!u&&(d||n||r)&&(this.appendLog(d?`Testing dispatch on ${d} reachable host(s)…`:`Testing dispatch on configured hosts (all probes failed)…`),u=await Se(l,{relay:n,direct:r},{clientId:i,token:o,accessToken:s})),u&&(u.ok?this.appendLog(`Dispatch OK (${u.latencyMs??`?`}ms)`):this.appendLog(`Dispatch FAIL: ${u.error??u.status}${u.bodySnippet?` — ${u.bodySnippet.slice(0,80)}`:``}`)),this.renderProbes({probes:l,dispatch:u}),this.probeSummary=[...l.map(J),u?`Dispatch: ${u.ok?`OK`:`FAIL`} ${u.origin} ${u.error??u.status??``}`:``].filter(Boolean).join(`
`),!g()&&(!R()||!h()))!se()&&re()&&oe();else if(g())try{this.applyNodeHubStatus(await U())}catch{}else R()&&h()&&await this.refreshJavaHubStatus()}catch(e){this.appendLog(String(e instanceof Error?e.message:e))}finally{this.running=!1,this.els.testBtn&&(this.els.testBtn.disabled=!1)}}}async runDestinationCheck(){if(!this.running){this.running=!0,this.els.destBtn&&(this.els.destBtn.disabled=!0),this.els.testBtn&&(this.els.testBtn.disabled=!0);try{let e=await _().catch(()=>null);this.renderConfig(e);let t=e?.core,n=String(t?.endpointUrl??``),r=String(t?.ops?.directUrl??``),i=String(t?.userId??``),a=te(e),o=O(this.els.destInput?.value?.trim()||String(t?.socket?.routeTarget||``)||String(e?.shell?.clipboardShareDestinationIds||``));if(!o.length){this.appendLog(`No destination ids — enter L-196;L-210;… or set routeTarget in Settings.`);return}this.appendLog(`Checking ${o.length} destination(s) via gateway: ${o.join(`, `)}`);let s=await we(o,{relay:n,direct:r},{clientId:i,token:a,accessToken:a});for(let e of s)this.appendLog(`Dest ${e.id}: ${e.ok?`OK`:`FAIL`}${e.latencyMs==null?``:` (${e.latencyMs}ms)`}${e.error?` — ${e.error}`:``}`);this.renderProbes({probes:[],destinations:s}),this.probeSummary=s.map(e=>`Dest ${e.id}: ${e.ok?`OK`:`FAIL`} ${e.origin} ${e.error??e.status??``}`).join(`
`)}catch(e){this.appendLog(String(e instanceof Error?e.message:e))}finally{this.running=!1,this.els.destBtn&&(this.els.destBtn.disabled=!1),this.els.testBtn&&(this.els.testBtn.disabled=!1)}}}pageLogText(){return[...this.logLines].reverse().join(`
`)}async copyFrontendLog(){try{await he().flush?.()}catch{}let e=await P(A(600));this.appendLog(e?`Frontend log copied to clipboard.`:`Copy failed — check clipboard permission.`)}async copyLogcat(){this.appendLog(`Reading logcat…`);let e=await P(await j(600));this.appendLog(e?`Logcat copied to clipboard.`:`Logcat copy failed.`)}async savePageLogs(){this.appendLog(`Building page log export…`);let e=await N(this.pageLogText(),this.probeSummary),t=Ee(`cwsp-network`);F(t,e),this.appendLog(`Saved ${t}`)}}})),Ie,X,Z,Q,Le,Re=e((()=>{Ie=(e=globalThis)=>{try{if(typeof e.Capacitor?.isNativePlatform==`function`&&e.Capacitor.isNativePlatform())return`capacitor`}catch{}try{if(e.__WEBNATIVE_AUTH__||e.__CWS_WEBNATIVE_BOOT__)return`webnative`}catch{}return`web`},X=(e,t,n,r={})=>({id:e,layer:t,state:n,...r}),Z=(e,t={})=>{let n=e===`capacitor`&&!!t.preferNativeWebsocket,r=n?t.nativeBridgeReady?`available`:`degraded`:t.wsConnected?`available`:`unavailable`,i=[X(`transport.ws`,`transport`,r,{implementation:n?`native-java-ws`:`webview-ws`,reason:n?t.nativeBridgeReady?`CwspRuntime owns /ws`:`Native WS preferred but bridge not ready`:t.wsConnected?`WebView hub connected`:`WebView hub disconnected`}),X(`transport.http-probe`,`transport`,t.httpProbeReady===!1?`unavailable`:`available`,{implementation:e===`capacitor`?`native-bridge-or-fetch`:e===`webnative`?`webnative-control-rpc`:`browser-fetch`,reason:t.httpProbeReady===!1?`No reachable /lna-probe candidate`:`Probe path enabled for surface`}),X(`transport.dispatch`,`transport`,t.dispatchReady===!1?`unavailable`:`available`,{implementation:e===`capacitor`?`network:dispatch-probe`:e===`webnative`?`webnative-endpoint-probe`:`http-dispatch`,reason:t.dispatchReady===!1?`Dispatch probe path not ready`:`Dispatch probe path enabled`})],a=e===`capacitor`?[X(`platform.native-bridge`,`platform`,t.nativeBridgeReady?`available`:`unavailable`,{implementation:`CwsBridge`,reason:t.nativeBridgeReady?`Native IPC ready`:`Native bridge unavailable`}),X(`platform.webnative-control`,`platform`,`unsupported`,{reason:`WebNative control RPC is desktop-only`})]:e===`webnative`?[X(`platform.native-bridge`,`platform`,`unsupported`,{reason:`Capacitor native bridge is Android-only`}),X(`platform.webnative-control`,`platform`,t.webnativeControlReady===!1?`unavailable`:`available`,{implementation:`/service/endpoint-probe`,reason:t.webnativeControlReady===!1?`WebNative auth/control port missing`:`WebNative control RPC available`})]:[X(`platform.native-bridge`,`platform`,`unsupported`,{reason:`Browser surface has no native bridge`}),X(`platform.webnative-control`,`platform`,`unsupported`,{reason:`Browser surface has no WebNative control RPC`})],o=[X(`diagnostics.frontend-log`,`diagnostics`,t.frontendLogReady===!1?`degraded`:`available`,{implementation:`__CWSP_FRONTEND_DEBUG__`,reason:t.frontendLogReady===!1?`Frontend debug capture not started`:`Frontend log ring available`}),X(`diagnostics.logcat`,`diagnostics`,e===`capacitor`?t.nativeBridgeReady?`available`:`unavailable`:`unsupported`,{implementation:e===`capacitor`?`debug:logcat`:void 0,reason:e===`capacitor`?t.nativeBridgeReady?`Native logcat channel available`:`Logcat requires native bridge`:`Logcat is Capacitor/Android-only`}),X(`diagnostics.page-export`,`diagnostics`,`available`,{implementation:`download-blob`,reason:`Page log download always available in Network view`})];return[...i,...a,...o]},Q=(e,t)=>{let n=new Map(t.map(e=>[e.id,e])),r=n.get(`transport.http-probe`);return!r||r.state===`unavailable`?!1:e===`capacitor`?n.get(`platform.native-bridge`)?.state===`available`||r.state===`available`:e===`webnative`?n.get(`platform.webnative-control`)?.state===`available`:r.state===`available`},Le=(e,t={})=>{let n=Z(e,t),r=n.filter(e=>e.layer===`transport`),i=n.filter(e=>e.layer===`platform`),a=n.filter(e=>e.layer===`diagnostics`),o=Q(e,n);return{surface:e,ready:o,transport:r,platform:i,diagnostics:a,blocker:o?void 0:n.find(e=>e.state===`unavailable`&&(e.id===`transport.http-probe`||e.id===`platform.native-bridge`||e.id===`platform.webnative-control`))}}}));function ze(e){return new $(e)}var $;e((()=>{Fe(),Re(),Ae(),ve(),$=class{id=`network`;name=`Network`;icon=`wifi-high`;options;element=null;panel=null;lifecycle={onMount:()=>{this.element&&(this.panel??=new Y,this.panel.mount(this.element))},onUnmount:()=>{this.panel?.unmount(),this.panel=null,this.element=null},onShow:()=>{!this.panel&&this.element&&(this.panel=new Y,this.panel.mount(this.element))}};constructor(e={}){this.options=e}render=e=>(e&&(this.options={...this.options,...e}),this.panel?.unmount(),this.panel=null,this.element=document.createElement(`div`),this.element.className=`cw-network-view-host`,this.element.dataset.view=`network`,this.element);getToolbar(){return null}}}))();export{I as NETWORK_A11Y,$ as NetworkView,L as applyNetworkA11y,Oe as auditNetworkA11y,ke as createNetworkA11yFixture,ze as createNetworkView,ze as default,Ie as detectNetworkSurface,Q as isNetworkProbePathReady,b as labelForProbeCandidate,y as normalizeProbeOrigin,_e as pickDispatchOrigin,Z as resolveNetworkCapabilities,Le as summarizeNetworkCapabilities};