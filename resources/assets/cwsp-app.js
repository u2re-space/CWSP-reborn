import{n as e,r as t}from"./rolldown-runtime-DaJ6WEGw.js";import{G as n,J as r,L as i,Q as a,U as o,V as s,X as c,Y as l,q as u,t as d,w as f}from"./src-kpjtbscK.js";import{c as p,l as m,m as ee,n as te,nt as ne,o as h,t as re}from"./src-XPMlSw8I.js";import{n as ie,t as g}from"./preload-helper-NDuSAHbO.js";import{_ as ae,a as _,f as oe,g as v,h as se,i as ce,l as y,m as le,n as ue,o as b,p as x,r as de,t as fe}from"./UniformInterop-0fYt3kIh.js";import{a as pe,c as me,f as he,l as ge,m as _e,o as ve,r as ye,u as be}from"./UnifiedMessaging-Bb5xrVpZ.js";import{k as xe,n as Se,o as Ce,s as we,t as Te,u as Ee}from"./airpad-cwsp-client-parity-DrmbeIAT.js";import{n as De,r as Oe}from"./SettingsTypes-BL3S2Z7F.js";import{a as ke,i as Ae,n as je,s as Me}from"./Settings-_zeU2dzM.js";import{C as Ne,T as Pe,g as Fe,t as Ie,w as Le,x as Re,y as ze}from"./config-3CjwWmU9.js";function Be(e){return e===`faint`?`tabbed`:e===`base`||e===`minimal`||e===`window`||e===`tabbed`||e===`environment`||e===`content`||e===`immersive`?e:`minimal`}function Ve(e){try{let t={shell:Be(e),t:Date.now()};globalThis.localStorage?.setItem(Ue,JSON.stringify(t))}catch{}}function He(e){let t=Be(e),n=()=>Ve(t),r=()=>Ve(t),i=globalThis;return i.addEventListener(`focus`,n),i.addEventListener(`pointerdown`,r,{capture:!0,passive:!0}),queueMicrotask(()=>Ve(t)),()=>{i.removeEventListener(`focus`,n),i.removeEventListener(`pointerdown`,r,{capture:!0})}}var Ue,We=e((()=>{Ue=`rs-boot-shell-last-active`}));function Ge(){return qe||=te({channels:Ke,logPrefix:`[ServiceChannels]`}),qe}var Ke,qe,Je,Ye=e((()=>{re(),x(),Ke={workcenter:{broadcastName:_.WORK_CENTER,routeHash:y.WORKCENTER,component:b.WORK_CENTER,description:`AI work center for processing files and content`},settings:{broadcastName:_.SETTINGS,routeHash:y.SETTINGS,component:b.SETTINGS,description:`Application settings and configuration`},airpad:{broadcastName:_.SERVICE_AIRPAD,routeHash:y.AIRPAD,component:b.AIRPAD,description:`AirPad remote trackpad/keyboard + clipboard`},network:{broadcastName:_.SERVICE_NETWORK,routeHash:y.NETWORK,component:b.NETWORK,description:`CWSP network status, probes, and endpoint routing`},viewer:{broadcastName:_.MARKDOWN_VIEWER,routeHash:y.MARKDOWN_VIEWER,component:b.MARKDOWN_VIEWER,description:`Content viewer for markdown and files`},explorer:{broadcastName:_.FILE_EXPLORER,routeHash:y.FILE_EXPLORER,component:b.FILE_EXPLORER,description:`File explorer and browser`},print:{broadcastName:_.PRINT_CHANNEL,routeHash:y.PRINT,component:b.BASIC_PRINT,description:`Print preview and export`},history:{broadcastName:_.HISTORY_CHANNEL,routeHash:y.HISTORY,component:b.HISTORY,description:`Action history and undo/redo`},editor:{broadcastName:`rs-editor`,routeHash:y.MARKDOWN_EDITOR,component:b.MARKDOWN_EDITOR,description:`Content editor`},home:{broadcastName:`rs-home`,routeHash:`#home`,component:`home`,description:`Home/landing view`}},qe=null,Je=Ge()})),Xe,S,Ze,Qe,$e=e((()=>{x(),Xe={viewer:[`content-view`,`content-load`,`markdown-content`],workcenter:[`content-attach`,`file-attach`,`share-target-input`,`content-share`],explorer:[`file-save`,`navigate-path`,`content-explorer`],editor:[`content-load`,`content-edit`],settings:[`settings-update`],history:[`history-update`],home:[`home-update`],print:[`content-view`]},S=e=>v(e),Ze=(e,t)=>{let n=[t,...Xe[e.id]||[]];for(let t of n)if(t&&(!e.canHandleMessage||e.canHandleMessage(t)))return t;return null},Qe=(e,t)=>{let n=Ze(e,t.type);if(!n)return null;let r=typeof t.id==`string`&&t.id.trim()?t.id:void 0;return{...r?{id:r}:{},type:n,data:t.data,metadata:t.metadata}}}));function et(e,t){if(typeof BroadcastChannel>`u`)return()=>{};let n=new BroadcastChannel(ae(v(e)));return n.addEventListener(`message`,t),()=>{n.removeEventListener(`message`,t),n.close()}}var tt=e((()=>{x(),pe()}));function nt(e){try{if(typeof HTMLElement<`u`&&e instanceof HTMLElement)return e}catch{}return null}function rt(e){if(!e||typeof e!=`object`)return!1;let t=e,n=e=>typeof File<`u`&&e instanceof File||typeof Blob<`u`&&e instanceof Blob;if(n(t.file)||n(t.blob))return!0;let r=t.files;if(Array.isArray(r)&&r.some(e=>n(e)))return!0;let i=t.attachments;if(Array.isArray(i))for(let e of i){if(!e||typeof e!=`object`)continue;let t=e.data;if(n(t))return!0}return!1}function it(e){if(!e||typeof e!=`object`)return!1;let t=e;if(rt(t))return!0;let n=t.data;if(n&&typeof n==`object`&&rt(n))return!0;let r=t.attachments;if(Array.isArray(r))for(let e of r){if(!e||typeof e!=`object`)continue;let t=e.data;if(typeof File<`u`&&t instanceof File||typeof Blob<`u`&&t instanceof Blob)return!0}return!1}function at(e,t){return _t.has(String(t||``).toLowerCase())?it(e):!1}function ot(e,t){return!vt.has(String(t||``).toLowerCase())}async function st(){await new Promise(e=>requestAnimationFrame(()=>e())),await new Promise(e=>queueMicrotask(e))}async function ct(){await new Promise(e=>requestAnimationFrame(()=>requestAnimationFrame(e))),await new Promise(e=>queueMicrotask(e))}async function lt(){await st()}async function ut(e,t=yt){let n=nt(e);if(!n||n.isConnected)return;let r=typeof document<`u`&&document.documentElement instanceof HTMLElement?document.documentElement:null;r&&await new Promise(e=>{let i=!1,a=()=>{if(!i){i=!0;try{o.disconnect()}catch{}clearTimeout(s),e()}},o=new MutationObserver(()=>{n.isConnected&&a()});o.observe(r,{childList:!0,subtree:!0});let s=setTimeout(a,t)})}function dt(e){for(let t of Ct)try{if(e.querySelector(t)||e.shadowRoot?.querySelector(t))return!0}catch{}return!1}function ft(e,t){let n=String(e||``).toLowerCase();return n===`content-load`||n===`markdown-content`||n===`content-view`||at(t,e)}async function pt(e,t=bt){let n=nt(e);n&&(dt(n)||await new Promise(e=>{let r=!1,i=[],a=()=>{if(!r){r=!0;for(let e of i)try{e.disconnect()}catch{}clearTimeout(c),e()}},o=()=>{dt(n)&&a()},s=e=>{let t=new MutationObserver(o);t.observe(e,{childList:!0,subtree:!0}),i.push(t)};s(n),n.shadowRoot&&s(n.shadowRoot);let c=setTimeout(a,t);o()}))}async function mt(e,t=xt){let n=nt(e);if(n?.isConnected)try{let e=typeof n.getAnimations==`function`?n.getAnimations.bind(n):null,r=e?e({subtree:!0}).filter(e=>e.playState===`running`):[];if(r.length===0)return;await Promise.race([Promise.all(r.map(e=>typeof e?.finished?.then==`function`?e.finished.catch(()=>void 0):Promise.resolve())),new Promise(e=>setTimeout(e,t))])}catch{}}async function ht(e,t,n){let r=nt(e),i=ft(n,t);if(r?.isConnected&&(!i||dt(r))){await st(),await mt(e,St);return}await ct(),await ut(e,yt),i&&await pt(e,bt),await mt(e,xt),await st()}function gt(e,t){let n=(wt.get(e)??Promise.resolve()).then(()=>t()).catch(t=>{console.warn(`[ViewIngress] delivery failed:`,e?.id,t)});return wt.set(e,n),n}var _t,vt,yt,bt,xt,St,Ct,wt,Tt=e((()=>{_t=new Set([`content-share`,`share-target-input`,`share-target-result`,`content-attach`,`file-attach`]),vt=new Set([`settings-update`,`history-update`,`home-update`]),yt=220,bt=280,xt=160,St=90,Ct=[`[data-render-target]`,`[data-raw-target]`],wt=new WeakMap}));function Et(e){let t=e.data;return t&&typeof t==`object`&&!Array.isArray(t)?t:{}}function Dt(e){return typeof File<`u`&&e instanceof File||typeof Blob<`u`&&e instanceof Blob}function Ot(e){if(Dt(e.file)||Dt(e.blob))return!0;let t=e.files;return Array.isArray(t)&&t.some(e=>Dt(e))||String(e.path??e.into??``).trim().length>0||String(e.text??e.content??``).trim().length>0?!0:String(e.url??``).trim().length>0}function kt(e,t){let n=String(t||``).toLowerCase();if(!Nt.has(n))return{ok:!0};let r=Et(e);if(!Ot(r))return{ok:!1,reason:`missing-body-carrier`};let i=r.file;if(typeof File<`u`&&i instanceof File&&i.size>C)return{ok:!1,reason:`file-too-large>${C}`};if(Array.isArray(r.files)){for(let e of r.files)if(typeof File<`u`&&e instanceof File&&e.size>C)return{ok:!1,reason:`files-array-too-large>${C}`}}return{ok:!0}}function At(e){if(!e||e.length===0)return!1;let t=Math.min(e.length,16384),n=0,r=0;for(let i=0;i<t;i++){let t=e.charCodeAt(i);t===0&&n++,t<32&&t!==9&&t!==10&&t!==13&&r++}if(n>2||r/t>.02&&e.length<64*1024)return!0;let i=e.slice(0,512).trimStart();return!!(i.startsWith(`%PDF`)||i.startsWith(`PK`))}function jt(e,t){let n=e.filter(e=>e instanceof File);if(n.length===0)return null;let r=(t.hintFilename||``).trim().toLowerCase();if(r){let e=n.find(e=>String(e.name||``).trim().toLowerCase()===r);if(e)return e;let t=n.find(e=>String(e.name||``).trim().toLowerCase().endsWith(r));if(t)return t}return n.find(e=>t.isTextLike(e))||(n.find(e=>/\.(md|markdown|mdown|mkdn|mkd)(?:$|\?)/i.test(e.name||``))??n[0]??null)}function Mt(e){return e instanceof File?e.size>C?{ok:!1,reason:`file-too-large`}:{ok:!0}:{ok:!1,reason:`not-a-file`}}var C,Nt,Pt=e((()=>{C=48*1024*1024,Nt=new Set([`content-load`,`content-view`,`markdown-content`,`content-share`,`content-attach`,`file-attach`].map(e=>e.toLowerCase()))})),Ft,It,Lt,Rt,zt,Bt,Vt,Ht,Ut,Wt,Gt=e((()=>{x(),Ft=`share-target-data`,It=`/share-target-data`,Lt=`/share-target-files`,Rt=`/share-target-file/`,zt=()=>typeof globalThis<`u`&&`caches`in globalThis,Bt=async e=>{if(!zt())return!1;let t=Array.isArray(e.files)?e.files:[],n=e.meta??{};try{let e=await caches.open(Ft),r=Number(n?.timestamp)||Date.now();await e.put(It,new Response(JSON.stringify({...n,title:n?.title,text:n?.text,url:n?.url,sharedUrl:n?.sharedUrl,source:n?.source||`share-target`,route:n?.route||n?.source||`share-target`,timestamp:r,fileCount:t.length,imageCount:t.filter(e=>(e?.type||``).toLowerCase().startsWith(`image/`)).length}),{headers:{"Content-Type":`application/json`}}));let i=[];for(let n=0;n<t.length;n++){let a=t[n],o=`${Rt}${r}-${n}`,s=new Headers;s.set(`Content-Type`,a.type||`application/octet-stream`),s.set(`X-File-Name`,encodeURIComponent(a.name||`file-${n}`)),s.set(`X-File-Size`,String(a.size||0)),s.set(`X-File-LastModified`,String(a.lastModified??0)),await e.put(o,new Response(a,{headers:s})),i.push({key:o,name:a.name||`file-${n}`,type:a.type||`application/octet-stream`,size:a.size||0,lastModified:a.lastModified??void 0})}return await e.put(Lt,new Response(JSON.stringify({files:i,timestamp:r}),{headers:{"Content-Type":`application/json`}})),!0}catch(e){return console.warn(`[ShareTargetGateway] Failed to store payload to cache:`,e),!1}},Vt=async(e={})=>{let t=e.clear!==!1;if(!zt())return null;try{let e=await caches.open(Ft),n=await e.match(It),r=await e.match(Lt);if(!n&&!r)return null;let i=n?await n.json().catch(()=>null):null,a=r?await r.json().catch(()=>null):null,o=Array.isArray(a?.files)?a.files:[],s=[];for(let t of o){let n=typeof t?.key==`string`?t.key.trim():String(t?.key??``).trim();if(!n)continue;let r=await e.match(n);if(!r)continue;let i=await r.blob();s.push(new File([i],t.name||`shared-file`,{type:t.type||i.type||`application/octet-stream`,lastModified:Number(t.lastModified)||Date.now()}))}if(t){await e.delete(It).catch(()=>{}),await e.delete(Lt).catch(()=>{});for(let t of o)t?.key&&await e.delete(t.key).catch(()=>{})}return{meta:i||{},files:s,fileMeta:o}}catch(e){return console.warn(`[ShareTargetGateway] Failed to consume cached payload:`,e),null}},Ht=e=>{let t=e?.meta||{},n=Array.isArray(e?.files)?e.files:[],r=Array.isArray(e?.fileMeta)?e.fileMeta:[],i=typeof r[0]?.name==`string`&&r[0].name.trim().length>0?r[0].name.trim():void 0,a=t.hint,o=a&&typeof a==`object`&&!Array.isArray(a)?{...a}:{},s=Object.keys(o).length>0?{...o}:void 0;i&&!n.length&&(typeof o.filename==`string`&&String(o.filename).trim()||(s={...s||o,filename:i}));let c={...t,title:typeof t.title==`string`?t.title:void 0,text:typeof t.text==`string`?t.text:void 0,url:typeof t.url==`string`?t.url:void 0,sharedUrl:typeof t.sharedUrl==`string`?t.sharedUrl:void 0,source:typeof t.source==`string`?t.source:`share-target`,route:typeof t.route==`string`?t.route:typeof t.source==`string`?t.source:`share-target`,timestamp:Number(t.timestamp||Date.now()),files:n,fileCount:n.length||Number(t.fileCount||0),imageCount:Number(t.imageCount||n.filter(e=>(e?.type||``).toLowerCase().startsWith(`image/`)).length)};return s!==void 0&&(c.hint=s),c},Ut=async()=>{try{let e=await fetch(ce.SW_CONTENT_AVAILABLE);if(!e.ok)return[];let t=await e.json(),n=Array.isArray(t?.cacheKeys)?t.cacheKeys:[],r=[];for(let e of n){let t=String(e?.key||``);if(t)try{let n=await fetch(`${ce.SW_CONTENT}/${t}`);if(!n.ok)continue;r.push({key:t,context:String(e?.context||``),content:await n.json()})}catch(e){console.warn(`[ShareTargetGateway] Failed to fetch SW cache item:`,e)}}return r}catch(e){return console.warn(`[ShareTargetGateway] Failed to fetch SW cache entries:`,e),[]}},Wt=async(e=`latest`)=>{try{let t=await fetch(`/share-target-files?cacheKey=${encodeURIComponent(e)}`);if(!t.ok)return[];let n=await t.json(),r=Array.isArray(n?.files)?n.files:[],i=[];for(let e of r){let t=typeof e?.key==`string`?e.key:``;if(t)try{let n=await fetch(t);if(!n.ok)continue;let r=await n.blob();i.push(new File([r],e.name||`shared-file`,{type:e.type||r.type||`application/octet-stream`}))}catch(e){console.warn(`[ShareTargetGateway] Failed to fetch file from cache:`,e)}}return i}catch(e){return console.warn(`[ShareTargetGateway] Failed to fetch cached share files:`,e),[]}}}));function Kt(e,t){return typeof t!=`number`||!Number.isFinite(t)?!1:(w.get(e)??0)!==t}function qt(e,t){let n=e.metadata&&typeof e.metadata==`object`&&!Array.isArray(e.metadata)?e.metadata:{};return{...e,metadata:{...n,[Zt]:t}}}function Jt(e,t={}){if(!e.handleMessage)return()=>{};let n=t.destination||S(String(e.id||``)),r=t.componentId||`view:${e.id}`,i=oe(n),a={canHandle:e=>le(e.destination,n),handle:async t=>{await $t(e,t)}},o=new Set;for(let e of i){let t=`${r}:${e}`;me(t,e),ge(e,a);let n=ve(t);if(n.length>0)for(let e of n)o.has(e.id)||(o.add(e.id),a.handle(e))}let s=et(v(n),t=>{let r=t.data;if(!(!r||typeof r!=`object`)){if(r.type===`view-transfer`&&r.message&&typeof r.message==`object`){$t(e,de(r.message));return}if(r.type===`view-post`){let t=v(r.viewId);if(t!==v(String(e.id||n)))return;let i={id:typeof r.id==`string`?String(r.id):crypto.randomUUID(),type:`view-post`,destination:t,source:`view-channel`,data:{bodyText:String(r.bodyText||``),contentType:String(r.contentType||``),viewId:t},metadata:{source:`view-channel`,destination:t}},a=Yt(e);gt(e,async()=>{w.get(e)===a&&(ot(i,`view-post`)&&await ht(e,i,`view-post`),w.get(e)===a&&await e.handleMessage?.(qt({type:`view-post`,data:{bodyText:String(r.bodyText||``),contentType:String(r.contentType||``),viewId:t},metadata:i.metadata},a)))})}}});return()=>{for(let e of i)_e(e,a);s()}}var w,Yt,T,Xt,Zt,Qt,$t,en=e((()=>{$e(),tt(),Tt(),Pt(),Ye(),x(),Gt(),pe(),ue(),w=new WeakMap,Yt=e=>{let t=(w.get(e)??0)+1;return w.set(e,t),t},T=new Map,Xt=600,Zt=`__ingressStamp`,Qt=e=>{for(let[t,n]of T)e-n>Xt&&T.delete(t)},$t=async(e,t)=>{let n=typeof t.id==`string`?t.id.trim():``;if(n){let t=v(S(String(e.id||``))),r=Date.now();Qt(r);let i=`${t}::${n}`,a=T.get(i);if(a!==void 0&&r-a<Xt)return;T.set(i,r)}let r=Qe(e,t);if(!r)return;let i=kt(t,r.type);if(!i.ok){console.warn(`[ViewIngress] Skipped malformed envelope:`,i.reason,r.type);return}let a=Yt(e);await gt(e,async()=>{w.get(e)===a&&(ot(t,r.type)&&await ht(e,t,r.type),w.get(e)===a&&await e.handleMessage?.(qt(r,a)))})}}));function tn(e){if(!e||typeof e!=`object`)return!1;let t=e;return typeof t.handleMessage==`function`&&typeof t.id==`string`&&t.id.trim().length>0}function nn(e){if(!e?.trim())return null;try{let t=JSON.parse(e);return t&&typeof t==`object`?t:null}catch{return null}}function rn(e){let t=se(String(e.destination??``))||String(e.destination??``).trim();return t?{id:typeof e.id==`string`?e.id:crypto.randomUUID(),type:String(e.type||`content-share`),source:typeof e.source==`string`?e.source:`dom-staged-unified`,destination:t,contentType:typeof e.contentType==`string`?e.contentType:void 0,data:e.data??e.payload??{},metadata:{timestamp:Date.now(),...typeof e.metadata==`object`&&e.metadata?e.metadata:{}}}:null}function an(e){let t=e.getAttribute(`data-cw-unified-defer-flush`);if(!t?.trim())return null;let n=t.trim();if(n.startsWith(`{`)){let e=nn(n)?.destination;return typeof e==`string`?e:null}return n}function on(e){let t=an(e);t&&(be(se(t)||v(t)).catch(()=>void 0),e.removeAttribute(`data-cw-unified-defer-flush`))}function sn(e){let t=nn(e.getAttribute(`data-cw-unified-pending`));if(!t)return;let n=rn(t);n?.destination&&(ye(n.destination,n),e.removeAttribute(`data-cw-unified-pending`))}function cn(e){let t=nn(e.getAttribute(`data-cw-unified-mail`));if(!t)return;let n=se(String(t.destination||``))||String(t.destination||``).trim();n&&(he({type:String(t.type||`dispatch`),destination:n,source:typeof t.source==`string`?t.source:`dom-staged-mail`,data:t.data??t.payload??{},contentType:typeof t.contentType==`string`?t.contentType:void 0,metadata:typeof t.metadata==`object`&&t.metadata?t.metadata:{},purpose:Array.isArray(t.purpose)?t.purpose:typeof t.purpose==`string`?[t.purpose]:[`mail`,`deliver`],op:typeof t.op==`string`?t.op:`deliver`,protocol:typeof t.protocol==`string`?t.protocol:void 0}).catch(()=>void 0),e.removeAttribute(`data-cw-unified-mail`))}function ln(e){let t=new Set;e.matches(`[data-cw-unified-pending], [data-cw-unified-mail], [data-cw-unified-defer-flush]`)&&t.add(e);for(let n of e.querySelectorAll(_n))t.add(n);for(let e of t)e.isConnected&&(on(e),sn(e),cn(e))}function un(e,t){let n=t||S(String(e.id||``)),r=oe(n),i=new Set;for(let e of[n,...r]){let t=se(e)||String(e||``).trim();t&&i.add(v(t))}(async()=>{for(let e of i)try{await be(e)}catch{}})()}function dn(e,t,n){let r=!1;return()=>{r||(r=!0,n(),E.delete(e),D.get(t)===e&&D.delete(t))}}function fn(e,t={}){if(!e.handleMessage)return()=>{};let n=E.get(e);if(n)return n;let r=t.destination||S(String(e.id||``)),i=v(r),a=D.get(i);a&&a!==e&&E.get(a)?.();let o=Jt(e,{...t,destination:r});un(e,r);let s=dn(e,i,o);return E.set(e,s),D.set(i,e),s}function pn(e){E.get(e)?.()}function mn(e,t){let n=[e];for(;n.length;){let e=n.pop();if(e.nodeType===Node.ELEMENT_NODE){let r=e;t(r);let i=r.shadowRoot;if(i)for(let e=i.childNodes.length-1;e>=0;e--)n.push(i.childNodes[e]);for(let e=r.childNodes.length-1;e>=0;e--)n.push(r.childNodes[e])}}}function hn(e,t,n){t.has(n)||(t.add(n),e.observe(n,{childList:!0,subtree:!0}))}function gn(e={}){let t=e.root instanceof Document?e.root.documentElement:e.root??document.documentElement;if(!t||typeof MutationObserver>`u`)return()=>{};let n=new WeakSet,r=()=>{},i=e=>{mn(e,e=>{tn(e)&&(e.isConnected||pn(e))})},a=new MutationObserver(e=>{for(let t of e)t.addedNodes.forEach(r),t.removedNodes.forEach(i)});return r=e=>{if(e.nodeType===Node.ELEMENT_NODE){let t=e;t.isConnected&&ln(t)}mn(e,e=>{e.shadowRoot&&hn(a,n,e.shadowRoot),!(!e.isConnected||!tn(e))&&fn(e)})},hn(a,n,t),r(t),()=>{a.disconnect(),mn(t,e=>{tn(e)&&pn(e)})}}var _n,E,D,vn=e((()=>{x(),pe(),en(),$e(),_n=`[data-cw-unified-pending], [data-cw-unified-mail], [data-cw-unified-defer-flush]`,E=new WeakMap,D=new Map})),yn,bn,xn,Sn,Cn,wn,Tn,En,Dn,On,kn,An,jn,Mn,Nn,Pn,Fn,In,Ln,O,Rn,zn=e((()=>{yn=`viewer`,bn=`editor`,xn=`workcenter`,Sn=`explorer`,Cn=`settings`,wn=`history`,Tn=`home`,En=`print`,Dn=`airpad`,On=`network`,kn=`viewer`,An={network:On,airpad:Dn,settings:Cn,viewer:yn,editor:bn,workcenter:xn,explorer:Sn,history:wn,home:Tn,print:En},jn=()=>{let e=``;try{let t=globalThis?.location?.search;if(t){let n=new URLSearchParams(t);e=String(n.get(`views`)||n.get(`enabledViews`)||``)}}catch{}if(!e)try{e=String(globalThis?.localStorage?.getItem?.(`rs-enabled-views`)??``)}catch{}if(!e)try{e=`minimal,network,settings`}catch{}if(!e)try{e=String({}.VITE_ENABLED_VIEWS??``)}catch{}let t=e.split(/[\s,;]+/).map(e=>e.trim().toLowerCase()).filter(Boolean);if(!t.length)return null;t.push(`settings`);try{let e=globalThis?.location?.search;e&&new URLSearchParams(e).get(`views`)&&globalThis?.localStorage?.setItem?.(`rs-enabled-views`,Array.from(new Set(t)).join(`,`))}catch{}return new Set(t)},Mn=jn(),Nn={viewer:!1,editor:!1,workcenter:!1,explorer:!1,settings:!0,history:!1,home:!1,print:!1,airpad:!1,network:!0},Pn=e=>Nn[String(e).toLowerCase()]!==!1,Fn=e=>!Mn||Mn.has(String(e).toLowerCase()),In=e=>Pn(e)&&Fn(e),Ln=Object.entries(An).filter(([e,t])=>!!t&&In(e)).map(([e])=>e),O=e=>!!An[e]&&In(e),Rn=(e=kn,t=kn)=>O(e)?e:O(t)?t:Ln.length>0?Ln[0]:`viewer`}));function Bn(e){if(e instanceof HTMLElement)return e;let t=e;if(t&&typeof t.render==`function`&&typeof t.id==`string`)return t;throw Error(`View factory must return an HTMLElement or a legacy view with render() and id`)}function Vn(){k.register({id:`immersive`,name:`Immersive`,description:"Chromeless immersive shell (standalone pages, extensions, embedded); legacy boot id `base` aliases here.",loader:()=>g(()=>import(`./_cwsp-disabled-entry_shell-immersive-CZayJgAL.js`),[],import.meta.url)}),k.register({id:`minimal`,name:`Minimal`,description:`Minimal toolbar-based navigation`,loader:()=>g(()=>import(`./preview-DuTvRVa9.js`),[],import.meta.url)}),k.register({id:`content`,name:`Content`,description:`CRX content shell with overlay-focused layering`,loader:()=>g(()=>import(`./_cwsp-disabled-entry_shell-content-Cb9BwHbt.js`),[],import.meta.url)}),k.register({id:`immersive`,name:`Immersive`,description:`Chromeless immersive host (extensions / embedded)`,loader:()=>g(()=>import(`./_cwsp-disabled-entry_shell-immersive-CZayJgAL.js`),[],import.meta.url)})}function Hn(){A.register({id:`viewer`,name:`Viewer`,icon:`eye`,loader:()=>g(()=>import(`./_cwsp-disabled-entry_view-viewer-CeLlddQ8.js`),[],import.meta.url)}),A.register({id:`workcenter`,name:`Work Center`,icon:`lightning`,loader:()=>g(()=>import(`./_cwsp-disabled-entry_view-workcenter-DV1PlEAR.js`),[],import.meta.url)}),A.register({id:`settings`,name:`Settings`,icon:`gear`,loader:()=>g(()=>import(`./src-BU-LBFxK.js`),[],import.meta.url)}),A.register({id:`airpad`,name:`AirPad`,icon:`hand-pointing`,loader:()=>g(()=>import(`./_cwsp-disabled-entry_view-airpad-moeIfx22.js`),[],import.meta.url)}),A.register({id:`network`,name:`Network`,icon:`wifi-high`,loader:()=>g(()=>import(`./src-u_qrcLJZ.js`),[],import.meta.url)}),A.register({id:`history`,name:`History`,icon:`clock-counter-clockwise`,loader:()=>g(()=>import(`./_cwsp-disabled-entry_view-history-Cj5aZTmP.js`),[],import.meta.url)}),A.register({id:`explorer`,name:`Explorer`,icon:`folder`,loader:()=>g(()=>import(`./_cwsp-disabled-entry_view-explorer-D-8MVImu.js`),[],import.meta.url)}),A.register({id:`editor`,name:`Editor`,icon:`pencil`,loader:()=>g(()=>import(`./_cwsp-disabled-entry_view-editor-BtWewwh9.js`),[],import.meta.url)}),A.register({id:`home`,name:`Home`,icon:`house`,loader:()=>g(()=>import(`./_cwsp-disabled-entry_view-home-gqgAY_Ff.js`),[],import.meta.url)}),A.register({id:`print`,name:`Print`,icon:`printer`,loader:()=>g(()=>import(`./_cwsp-disabled-entry_view-viewer-CeLlddQ8.js`),[],import.meta.url)})}function Un(){Vn(),Hn()}var Wn,k,Gn,A,Kn,qn,Jn,Yn=e((()=>{vn(),zn(),ie(),Wn=class{shells=new Map;loadedShells=new Map;resolveShellRegistrationKey(e){return e===`base`?`immersive`:e}register(e){this.shells.set(e.id,e)}get(e){return this.shells.get(this.resolveShellRegistrationKey(e))}getAll(){return Array.from(this.shells.values())}async load(e,t){let n=this.resolveShellRegistrationKey(e),r=this.loadedShells.get(n);if(r)return r;let i=this.shells.get(n);if(!i)throw Error(`Shell not found: ${n}`);let a=await i.loader(),o=a.default||a.createShell;if(typeof o!=`function`)throw Error(`Invalid shell module: ${n}`);let s=o(t);return this.loadedShells.set(n,s),s}unload(e){let t=this.resolveShellRegistrationKey(e),n=this.loadedShells.get(t);n&&(n.unmount(),this.loadedShells.delete(t))}isLoaded(e){return this.loadedShells.has(this.resolveShellRegistrationKey(e))}getLoaded(e){return this.loadedShells.get(this.resolveShellRegistrationKey(e))}},k=new Wn,Gn=class e{static isCustomElementClassCtor(e){if(typeof e!=`function`)return!1;try{let t=e.prototype;return t!=null&&typeof HTMLElement<`u`&&HTMLElement.prototype.isPrototypeOf(t)}catch{return!1}}resolveViewFactory(t){let n=[t?.default,t?.createView,t?.createAirpadView,t?.createWorkCenterView,t?.createViewerView,t?.createExplorerView,t?.createSettingsView,t?.createNetworkView,t?.createHistoryView,t?.createHomeView];for(let t of n)if(typeof t==`function`){if(e.isCustomElementClassCtor(t)){let e=t;return(t=>new e(t))}return t}let r=Object.values(t||{});for(let e of r)if(typeof e==`function`&&e.prototype&&typeof e.prototype.render==`function`){let t=e;return e=>new t(e)}return null}views=new Map;loadedViews=new Map;viewReceiveCleanup=new Map;register(e){this.views.set(e.id,e)}get(e){return this.views.get(e)}getAll(){return Array.from(this.views.values())}async load(e,t){let n=this.loadedViews.get(e);if(n)return n;let r=this.views.get(e);if(!r)throw Error(`View not found: ${e}`);let i=await r.loader(),a=this.resolveViewFactory(i);if(!a)throw Error(`Invalid view module: ${e}`);let o=Bn(await a(t)),s=this.viewReceiveCleanup.get(e);return s&&(s(),this.viewReceiveCleanup.delete(e)),this.loadedViews.set(e,o),this.viewReceiveCleanup.set(e,fn(o,{destination:String(e),componentId:`view:${e}`})),o}unload(e){let t=this.loadedViews.get(e);t?.lifecycle?.onUnmount&&t.lifecycle.onUnmount();let n=this.viewReceiveCleanup.get(e);n&&(n(),this.viewReceiveCleanup.delete(e)),this.loadedViews.delete(e)}isLoaded(e){return this.loadedViews.has(e)}getLoaded(e){return this.loadedViews.get(e)}prefetchModule(e){let t=this.views.get(e);t&&t.loader().catch(()=>{})}},A=new Gn,Kn={id:`auto`,name:`Auto`,colorScheme:`auto`},qn={id:`light`,name:`Light`,colorScheme:`light`},Jn={id:`dark`,name:`Dark`,colorScheme:`dark`}}));function Xn(){if(Qn){console.debug(`[LayerManager] Already initialized`);return}if(typeof document>`u`){console.warn(`[LayerManager] No document available (SSR context?)`);return}let e=[...Zn].sort((e,t)=>e.order-t.order).map(e=>e.name),t=`@layer ${e.join(`, `)};`,n=document.createElement(`style`);n.id=`css-layer-init`,n.setAttribute(`data-layer-manager`,`true`),n.textContent=t;let r=document.head;r.insertBefore(n,r.firstChild),$n=n,Qn=!0,console.log(`[LayerManager] Initialized ${e.length} layers`)}var Zn,Qn,$n,er=e((()=>{Zn=[{name:`ux-normalize`,category:`system`,order:0,description:`Veela normalize layer`},{name:`layer.reset`,category:`system`,order:0,description:`CSS reset rules`},{name:`layer.normalize`,category:`system`,order:10,description:`Normalize browser defaults`},{name:`tokens`,category:`system`,order:20,description:`Legacy tokens layer`},{name:`ux-tokens`,category:`system`,order:20,description:`Veela token layer`},{name:`layer.tokens`,category:`system`,order:20,description:`CSS custom properties (variables)`},{name:`base`,category:`system`,order:30,description:`Legacy base layer`},{name:`ux-base`,category:`system`,order:30,description:`Veela base layer`},{name:`layout`,category:`system`,order:40,description:`Legacy layout layer`},{name:`ux-layout`,category:`system`,order:40,description:`Veela layout layer`},{name:`components`,category:`system`,order:50,description:`Legacy components layer`},{name:`ux-components`,category:`system`,order:50,description:`Veela components layer`},{name:`utilities`,category:`system`,order:60,description:`Legacy utilities layer`},{name:`ux-utilities`,category:`system`,order:60,description:`Veela utilities layer`},{name:`ux-theme`,category:`system`,order:70,description:`Veela theme layer`},{name:`ux-overrides`,category:`system`,order:80,description:`Veela overrides layer`},{name:`layer.properties.shell`,category:`system`,order:30,description:`Shell context custom properties`},{name:`layer.properties.views`,category:`system`,order:35,description:`View context custom properties`},{name:`layer.runtime.base`,category:`runtime`,order:100,description:`Veela runtime base styles`},{name:`layer.runtime.components`,category:`runtime`,order:110,description:`Reusable component styles`},{name:`layer.runtime.forms`,category:`runtime`,order:115,description:`Form element base styles`},{name:`layer.runtime.utilities`,category:`runtime`,order:120,description:`Utility classes`},{name:`layer.runtime.animations`,category:`runtime`,order:130,description:`Keyframes and animation definitions`},{name:`layer.boot`,category:`runtime`,order:140,description:`Boot/choice screen styles`},{name:`boot.tokens`,category:`runtime`,order:142,description:`Boot tokens layer`},{name:`boot.base`,category:`runtime`,order:144,description:`Boot base layer`},{name:`boot.components`,category:`runtime`,order:146,description:`Boot components layer`},{name:`boot.responsive`,category:`runtime`,order:148,description:`Boot responsive adjustments`},{name:`layer.shell.common`,category:`shell`,order:200,description:`Shared shell styles`},{name:`shell.tokens`,category:`shell`,order:202,description:`Legacy shell tokens`},{name:`shell.base`,category:`shell`,order:204,description:`Legacy shell base`},{name:`shell.components`,category:`shell`,order:206,description:`Legacy shell components`},{name:`shell.utilities`,category:`shell`,order:208,description:`Legacy shell utilities`},{name:`shell.overrides`,category:`shell`,order:209,description:`Legacy shell overrides`},{name:`layer.shell.raw`,category:`shell`,order:210,description:`Raw shell (minimal)`},{name:`layer.shell.minimal`,category:`shell`,order:220,description:`Minimal shell (toolbar navigation)`},{name:`layer.shell.minimal.layout`,category:`shell`,order:222,description:`Minimal shell layout rules`},{name:`layer.shell.minimal.components`,category:`shell`,order:224,description:`Minimal shell component styles`},{name:`layer.shell.window`,category:`shell`,order:226,description:`Window shell (desktop/process frames)`},{name:`layer.shell.faint`,category:`shell`,order:230,description:`Faint shell (tabbed sidebar)`},{name:`layer.shell.faint.layout`,category:`shell`,order:232,description:`Faint shell layout`},{name:`layer.shell.faint.sidebar`,category:`shell`,order:234,description:`Faint shell sidebar`},{name:`layer.shell.faint.toolbar`,category:`shell`,order:236,description:`Faint shell toolbar`},{name:`layer.shell.faint.forms`,category:`shell`,order:238,description:`Faint shell form components`},{name:`layer.view.common`,category:`view`,order:300,description:`Shared view styles`},{name:`layer.view.viewer`,category:`view`,order:310,description:`Markdown viewer`},{name:`layer.view.workcenter`,category:`view`,order:320,description:`Work center (AI prompts)`},{name:`layer.view.workcenter.keyframes`,category:`view`,order:322,description:`Work center animations`},{name:`view.workcenter`,category:`view`,order:324,description:`Work center styles (legacy name)`},{name:`view.workcenter.animations`,category:`view`,order:326,description:`Work center animations (legacy name)`},{name:`layer.view.settings`,category:`view`,order:330,description:`Settings view`},{name:`layer.view.explorer`,category:`view`,order:340,description:`File explorer`},{name:`layer.view.history`,category:`view`,order:350,description:`History view`},{name:`layer.view.editor`,category:`view`,order:360,description:`Editor view`},{name:`layer.view.editor.markdown`,category:`view`,order:362,description:`Markdown editor sublayer`},{name:`layer.view.editor.quill`,category:`view`,order:364,description:`Quill editor sublayer`},{name:`layer.view.home`,category:`view`,order:380,description:`Home/landing view`},{name:`layer.view.print`,category:`view`,order:390,description:`Print view`},{name:`view-explorer`,category:`view`,order:392,description:`Explorer legacy layered scope`},{name:`view-transitions`,category:`override`,order:850,description:`View Transition API named targets and keyframes`},{name:`layer.override.theme`,category:`override`,order:900,description:`Theme customizations`},{name:`layer.override.print`,category:`override`,order:910,description:`Print media styles`},{name:`layer.override.a11y`,category:`override`,order:920,description:`Accessibility enhancements`}],Qn=!1})),j,tr,nr,rr,ir,M,N,P,ar,or,sr,cr,lr,ur,dr,fr,pr,mr,hr,gr=e((()=>{(function(e){e.Unimplemented=`UNIMPLEMENTED`,e.Unavailable=`UNAVAILABLE`})(j||={}),tr=class extends Error{constructor(e,t,n){super(e),this.message=e,this.code=t,this.data=n}},nr=e=>e?.androidBridge?`android`:e?.webkit?.messageHandlers?.bridge?`ios`:`web`,rr=e=>{let t=e.CapacitorCustomPlatform||null,n=e.Capacitor||{},r=n.Plugins=n.Plugins||{},i=()=>t===null?nr(e):t.name,a=()=>i()!==`web`,o=e=>!!(l.get(e)?.platforms.has(i())||s(e)),s=e=>n.PluginHeaders?.find(t=>t.name===e),c=t=>e.console.error(t),l=new Map;return n.convertFileSrc||=e=>e,n.getPlatform=i,n.handleError=c,n.isNativePlatform=a,n.isPluginAvailable=o,n.registerPlugin=(e,a={})=>{let o=l.get(e);if(o)return console.warn(`Capacitor plugin "${e}" already registered. Cannot register plugins twice.`),o.proxy;let c=i(),u=s(e),d,f=async()=>(!d&&c in a?d=d=typeof a[c]==`function`?await a[c]():a[c]:t!==null&&!d&&`web`in a&&(d=d=typeof a.web==`function`?await a.web():a.web),d),p=(t,r)=>{if(u){let i=u?.methods.find(e=>r===e.name);if(i)return i.rtype===`promise`?t=>n.nativePromise(e,r.toString(),t):(t,i)=>n.nativeCallback(e,r.toString(),t,i);if(t)return t[r]?.bind(t)}else if(t)return t[r]?.bind(t);else throw new tr(`"${e}" plugin is not implemented on ${c}`,j.Unimplemented)},m=t=>{let n,r=(...r)=>{let i=f().then(i=>{let a=p(i,t);if(a){let e=a(...r);return n=e?.remove,e}else throw new tr(`"${e}.${t}()" is not implemented on ${c}`,j.Unimplemented)});return t===`addListener`&&(i.remove=async()=>n()),i};return r.toString=()=>`${t.toString()}() { [capacitor code] }`,Object.defineProperty(r,"name",{value:t,writable:!1,configurable:!1}),r},ee=m(`addListener`),te=m(`removeListener`),ne=(e,t)=>{let n=ee({eventName:e},t),r=async()=>{let r=await n;te({eventName:e,callbackId:r},t)},i=new Promise(e=>n.then(()=>e({remove:r})));return i.remove=async()=>{console.warn(`Using addListener() without 'await' is deprecated.`),await r()},i},h=new Proxy({},{get(e,t){switch(t){case`$$typeof`:return;case`toJSON`:return()=>({});case`addListener`:return u?ne:ee;case`removeListener`:return te;default:return m(t)}}});return r[e]=h,l.set(e,{name:e,proxy:h,platforms:new Set([...Object.keys(a),...u?[c]:[]])}),h},n.Exception=tr,n.DEBUG=!!n.DEBUG,n.isLoggingEnabled=!!n.isLoggingEnabled,n},ir=e=>e.Capacitor=rr(e),M=ir(typeof globalThis<`u`?globalThis:typeof self<`u`?self:typeof window<`u`?window:typeof global<`u`?global:{}),N=M.registerPlugin,P=class{constructor(){this.listeners={},this.retainedEventArguments={},this.windowListeners={}}addListener(e,t){let n=!1;this.listeners[e]||(this.listeners[e]=[],n=!0),this.listeners[e].push(t);let r=this.windowListeners[e];return r&&!r.registered&&this.addWindowListener(r),n&&this.sendRetainedArgumentsForEvent(e),Promise.resolve({remove:async()=>this.removeListener(e,t)})}async removeAllListeners(){this.listeners={};for(let e in this.windowListeners)this.removeWindowListener(this.windowListeners[e]);this.windowListeners={}}notifyListeners(e,t,n){let r=this.listeners[e];if(!r){if(n){let n=this.retainedEventArguments[e];n||=[],n.push(t),this.retainedEventArguments[e]=n}return}r.forEach(e=>e(t))}hasListeners(e){return!!this.listeners[e]?.length}registerWindowListener(e,t){this.windowListeners[t]={registered:!1,windowEventName:e,pluginEventName:t,handler:e=>{this.notifyListeners(t,e)}}}unimplemented(e=`not implemented`){return new M.Exception(e,j.Unimplemented)}unavailable(e=`not available`){return new M.Exception(e,j.Unavailable)}async removeListener(e,t){let n=this.listeners[e];if(!n)return;let r=n.indexOf(t);this.listeners[e].splice(r,1),this.listeners[e].length||this.removeWindowListener(this.windowListeners[e])}addWindowListener(e){window.addEventListener(e.windowEventName,e.handler),e.registered=!0}removeWindowListener(e){e&&(window.removeEventListener(e.windowEventName,e.handler),e.registered=!1)}sendRetainedArgumentsForEvent(e){let t=this.retainedEventArguments[e];t&&(delete this.retainedEventArguments[e],t.forEach(t=>{this.notifyListeners(e,t)}))}},ar=e=>encodeURIComponent(e).replace(/%(2[346B]|5E|60|7C)/g,decodeURIComponent).replace(/[()]/g,escape),or=e=>e.replace(/(%[\dA-F]{2})+/gi,decodeURIComponent),sr=class extends P{async getCookies(){let e=document.cookie,t={};return e.split(`;`).forEach(e=>{if(e.length<=0)return;let[n,r]=e.replace(/=/,`CAP_COOKIE`).split(`CAP_COOKIE`);n=or(n).trim(),r=or(r).trim(),t[n]=r}),t}async setCookie(e){try{let t=ar(e.key),n=ar(e.value),r=e.expires?`; expires=${e.expires.replace(`expires=`,``)}`:``,i=(e.path||`/`).replace(`path=`,``),a=e.url!=null&&e.url.length>0?`domain=${e.url}`:``;document.cookie=`${t}=${n||``}${r}; path=${i}; ${a};`}catch(e){return Promise.reject(e)}}async deleteCookie(e){try{document.cookie=`${e.key}=; Max-Age=0`}catch(e){return Promise.reject(e)}}async clearCookies(){try{let e=document.cookie.split(`;`)||[];for(let t of e)document.cookie=t.replace(/^ +/,``).replace(/=.*/,`=;expires=${new Date().toUTCString()};path=/`)}catch(e){return Promise.reject(e)}}async clearAllCookies(){try{await this.clearCookies()}catch(e){return Promise.reject(e)}}},N(`CapacitorCookies`,{web:()=>new sr}),cr=async e=>new Promise((t,n)=>{let r=new FileReader;r.onload=()=>{let e=r.result;t(e.indexOf(`,`)>=0?e.split(`,`)[1]:e)},r.onerror=e=>n(e),r.readAsDataURL(e)}),lr=(e={})=>{let t=Object.keys(e);return Object.keys(e).map(e=>e.toLocaleLowerCase()).reduce((n,r,i)=>(n[r]=e[t[i]],n),{})},ur=(e,t=!0)=>e?Object.entries(e).reduce((e,n)=>{let[r,i]=n,a,o;return Array.isArray(i)?(o=``,i.forEach(e=>{a=t?encodeURIComponent(e):e,o+=`${r}=${a}&`}),o.slice(0,-1)):(a=t?encodeURIComponent(i):i,o=`${r}=${a}`),`${e}&${o}`},``).substr(1):null,dr=(e,t={})=>{let n=Object.assign({method:e.method||`GET`,headers:e.headers},t),r=lr(e.headers)[`content-type`]||``;if(typeof e.data==`string`)n.body=e.data;else if(r.includes(`application/x-www-form-urlencoded`)){let t=new URLSearchParams;for(let[n,r]of Object.entries(e.data||{}))t.set(n,r);n.body=t.toString()}else if(r.includes(`multipart/form-data`)||e.data instanceof FormData){let t=new FormData;if(e.data instanceof FormData)e.data.forEach((e,n)=>{t.append(n,e)});else for(let n of Object.keys(e.data))t.append(n,e.data[n]);n.body=t;let r=new Headers(n.headers);r.delete(`content-type`),n.headers=r}else(r.includes(`application/json`)||typeof e.data==`object`)&&(n.body=JSON.stringify(e.data));return n},fr=class extends P{async request(e){let t=dr(e,e.webFetchExtra),n=ur(e.params,e.shouldEncodeUrlParams),r=n?`${e.url}?${n}`:e.url,i=await fetch(r,t),a=i.headers.get(`content-type`)||``,{responseType:o=`text`}=i.ok?e:{};a.includes(`application/json`)&&(o=`json`);let s,c;switch(o){case`arraybuffer`:case`blob`:c=await i.blob(),s=await cr(c);break;case`json`:s=await i.json();break;default:s=await i.text()}let l={};return i.headers.forEach((e,t)=>{l[t]=e}),{data:s,headers:l,status:i.status,url:i.url}}async get(e){return this.request(Object.assign(Object.assign({},e),{method:`GET`}))}async post(e){return this.request(Object.assign(Object.assign({},e),{method:`POST`}))}async put(e){return this.request(Object.assign(Object.assign({},e),{method:`PUT`}))}async patch(e){return this.request(Object.assign(Object.assign({},e),{method:`PATCH`}))}async delete(e){return this.request(Object.assign(Object.assign({},e),{method:`DELETE`}))}},N(`CapacitorHttp`,{web:()=>new fr}),(function(e){e.Dark=`DARK`,e.Light=`LIGHT`,e.Default=`DEFAULT`})(pr||={}),(function(e){e.StatusBar=`StatusBar`,e.NavigationBar=`NavigationBar`})(mr||={}),hr=class extends P{async setStyle(){this.unavailable(`not available for web`)}async setAnimation(){this.unavailable(`not available for web`)}async show(){this.unavailable(`not available for web`)}async hide(){this.unavailable(`not available for web`)}},N(`SystemBars`,{web:()=>new hr})})),_r=t({CwsBridge:()=>F,getNativeUnifiedSettings:()=>xr,initCwsNativeBridge:()=>vr,invokeCwsNative:()=>yr,invokeCwsPlatformIPC:()=>br,isCapacitorCwsNativeShell:()=>L,isCwsNativeIpcAvailable:()=>Dr,isElectronCwsNativeShell:()=>Er,patchNativeUnifiedSettingsDetailed:()=>Sr});async function vr(){if(wr)return globalThis.window===void 0?null:globalThis.window.__CWS_SHELL_INFO__??null;wr=!0;let e=globalThis.window?.electronBridge?.getShellInfo;if(typeof e==`function`)try{let t=await e();return globalThis.window!==void 0&&(globalThis.window.__CWS_SHELL_INFO__=t),t}catch{}try{let e=await F.getShellInfo();globalThis.window!==void 0&&(globalThis.window.__CWS_SHELL_INFO__=e);try{await F.addListener(`nativeMessage`,e=>{let t=e&&typeof e.payload==`object`&&e.payload!=null?e.payload:{},n=t?.envelope,r=n&&typeof n==`object`&&p(n)?m(n):h(fe({purpose:`mail`,protocol:`service`,transport:`service-worker`,type:`act`,op:`deliver`,source:`native`,destination:`webview`,srcChannel:`native`,dstChannel:`webview`,payload:t,data:t}));globalThis.dispatchEvent(new CustomEvent(`cws-native-message`,{detail:{event:e,envelope:r,payload:t}}))})}catch{}return e}catch{return null}}async function yr(e,t){let n=Tr(e,t),r=await F.invoke({channel:e,payload:t,envelope:n});return{...r,envelope:I(e,t??{},r)}}async function br(e){let t=(e.channel||``).trim()||(Array.isArray(e.envelope?.path)&&e.envelope?.path.length?String(e.envelope.path[e.envelope.path.length-1]||``).trim():``)||`default`,n=e.payload&&typeof e.payload==`object`?e.payload:{},r=Tr(t,n,e.envelope),i=globalThis.window?.electronBridge?.invoke;if(typeof i==`function`){let e=await i({channel:t,payload:n,envelope:r});return{...e,envelope:I(t,n,e)}}if(!Dr()){let e=await F.invoke({channel:t,payload:n,envelope:r});return{...e,envelope:I(t,n,e)}}try{let e=await F.invoke({channel:t,payload:n,envelope:r});return{...e,envelope:I(t,n,e)}}catch(e){if(console.warn(`[cws-bridge] native invoke failed:`,e),L())return{ok:!1,channel:t,echo:{...n??{},error:String(e instanceof Error?e.message:e)},envelope:I(t,n,{ok:!1,channel:t,echo:n??{}})};let i=await new Cr().invoke({channel:t,payload:n,envelope:r});return{...i,envelope:I(t,n,i)}}}async function xr(){try{let e=await br({channel:`settings:get`});return e?.ok&&e.appSettings&&typeof e.appSettings==`object`?e.appSettings:null}catch{return null}}async function Sr(e){try{let t=xe(we(e)),n=Ce(e);try{globalThis.localStorage?.setItem?.(Te,t)}catch{}try{let e=new BroadcastChannel(Se);e.postMessage({airpadJson:t,shellPatch:n}),e.close()}catch{}let r=await ne(br({channel:`settings:patch`,payload:{appSettings:e,airpadJson:t,shellPatch:n}}),6e3,`settings:patch timed out`).catch(e=>({ok:!1,channel:`settings:patch`,echo:{error:String(e instanceof Error?e.message:e)}})),i=r?.echo;return r?.ok===!0||r?.ok!==!1&&!i?.error&&r?.channel===`settings:patch`?{ok:!0}:{ok:!1,error:String(i?.error??`settings:patch rejected`)}}catch(e){return{ok:!1,error:String(e instanceof Error?e.message:e)}}}var Cr,F,wr,Tr,I,L,Er,Dr,Or=e((()=>{gr(),re(),ee(),Ee(),ue(),Cr=class extends P{async getShellInfo(){return{shell:`browser`,bridge:`cws-bridge`,native:!1,platform:globalThis.navigator===void 0?`unknown`:`web`}}async invoke(e){let t=Tr(e.channel,e.payload,e.envelope);return{ok:!0,channel:e.channel,echo:{...e.payload??{}},envelope:t}}},F=N(`CwsBridge`,{web:()=>new Cr}),wr=!1,Tr=(e,t,n)=>n&&p(n)?m(n):h({...fe({purpose:`invoke`,protocol:`service`,transport:`service-worker`,type:`invoke`,op:`invoke`,source:`webview`,destination:`native`,srcChannel:`webview`,dstChannel:`native`,payload:t??{},data:t??{}}),path:[`cws-bridge`,e]}),I=(e,t,n)=>n?.envelope&&p(n.envelope)?m(n.envelope):h({...fe({purpose:`invoke`,protocol:`service`,transport:`service-worker`,type:n.ok?`response`:`ack`,op:`invoke`,source:`native`,destination:`webview`,srcChannel:`native`,dstChannel:`webview`,payload:t,data:t}),path:[`cws-bridge`,e]}),L=()=>{try{let e=globalThis.Capacitor;return typeof e?.isNativePlatform==`function`&&!!e.isNativePlatform()}catch{return!1}},Er=()=>{try{return!!globalThis.window?.electronBridge?.invoke}catch{return!1}},Dr=()=>{if(Er()||L())return!0;try{return!!globalThis.window?.__CWS_SHELL_INFO__?.native}catch{return!1}}})),kr=e((()=>{})),Ar,jr,Mr,Nr,Pr=e((()=>{Ar=()=>globalThis?.location,jr=()=>Ar()?.origin,Mr=(e,t)=>{let n=e?.trim?.()||``;if(!n)return!1;let r=t??jr();if(typeof URL?.canParse==`function`)return URL.canParse(n,r);try{return new URL(n,r),!0}catch{return!1}},Nr=e=>{if(typeof globalThis?.requestAnimationFrame==`function`){globalThis.requestAnimationFrame(e);return}globalThis.setTimeout(e,0)}})),Fr=e((()=>{d()})),Ir,Lr,Rr,zr,Br,Vr,Hr,Ur,Wr,R,Gr,Kr,qr,Jr,Yr,Xr,Zr,Qr,$r,ei,ti,ni,ri,z,B,ii,V,ai,H,oi,si,ci,li,ui,di,U,fi,pi,mi=e((()=>{i(),d(),l(),Fr(),Pr(),Ir=`cw::workspace::speed-dial`,Lr=`${Ir}::meta`,Rr=e=>typeof structuredClone==`function`?structuredClone(u(e)):r.parse(r.stringify(e)),zr=()=>typeof crypto<`u`&&typeof crypto.randomUUID==`function`?crypto.randomUUID():`sd-${Date.now().toString(36)}-${Math.floor(Math.random()*1e3)}`,Br=[{id:`shortcut-docs`,cell:s([0,1]),icon:`book-open-text`,label:`Docs`,action:`open-link`,meta:{href:`https://github.com/fest-live`,description:`Project documentation`}},{id:`shortcut-roadmap`,cell:s([1,1]),icon:`signpost`,label:`Roadmap`,action:`open-link`,meta:{href:`https://github.com/u2re-space/unite-2.man`,description:`Manifest notes`}},{id:`shortcut-fest-live`,cell:s([2,1]),icon:`github-logo`,label:`Fest Live`,action:`open-link`,meta:{href:`https://github.com/fest-live`,description:`Fest Live Organization`}},{id:`shortcut-l2ne-dev`,cell:s([3,1]),icon:`user`,label:`L2NE Dev`,action:`open-link`,meta:{href:`https://github.com/L2NE-dev`,description:`L2NE Developer Profile`}},{id:`shortcut-u2re-space`,cell:s([0,2]),icon:`planet`,label:`U2RE Space`,action:`open-link`,meta:{href:`https://github.com/u2re-space/`,description:`U2RE Space Organization`}},{id:`shortcut-telegram`,cell:s([1,2]),icon:`telegram-logo`,label:`Telegram`,action:`open-link`,meta:{href:`https://t.me/u2re_space`,description:`U2RE Space Telegram`}}],Vr=[{id:`shortcut-explorer`,cell:s([2,0]),icon:`books`,label:`Explorer`,action:`open-view`,meta:{view:`explorer`}},{id:`shortcut-settings`,cell:s([3,0]),icon:`gear-six`,label:`Settings`,action:`open-view`,meta:{view:`settings`}},...Br],Hr=e=>{let t=[],n=[];return e.forEach(e=>{let{meta:r,...i}=e;t.push(i);let a={action:e.action,...r||{}};n.push([e.id,a])}),{records:t,metaEntries:n}},{records:Ur,metaEntries:Wr}=Hr(Vr),R=[],Gr=e=>e&&Array.isArray(e)&&e.length>=2?s([Number(e[0])||0,Number(e[1])||0]):s([0,0]),Kr=(e={})=>n(s({action:e.action||`open-view`,view:e.view||``,href:e.href||``,description:e.description||``,entityType:e.entityType||``,tags:Array.isArray(e.tags)?[...e.tags]:[],...e})),qr=e=>{let t=new Map;for(let[n,r]of e)t.set(n,Kr(r));return t},Jr=e=>e?e instanceof Map?Array.from(e.entries()):Array.isArray(e)?e.map(e=>e&&typeof e==`object`&&`id`in e?[e.id,e.meta||e]:null).filter(Boolean):typeof e==`object`?Object.entries(e):[]:[],Yr=e=>{let t={};return e?.forEach((e,n)=>{t[n]=Rr(e??{})}),t},Xr=()=>qr(Wr),Zr=e=>{let t=Jr(e);return qr(t.length?t:Wr)},Qr=(e,t)=>e&&typeof e==`object`&&`value`in e?e.value??t:e??t,$r=e=>({id:e.id,cell:s([e.cell?.[0]??0,e.cell?.[1]??0]),icon:Qr(e.icon,`sparkle`),label:Qr(e.label,`Shortcut`),action:e.action}),ei=e=>s({id:e.id||zr(),cell:s(Gr(e.cell)),icon:o(e.icon||`sparkle`),label:o(e.label||`Shortcut`),action:e.action||`open-view`}),ti=()=>s(Ur.map(ei)),ni=e=>s((Array.isArray(e)&&e.length?e:Vr).map(e=>{let{meta:t,...n}=e;return t?R.push([e.id,{action:e.action,...t}]):R.push([e.id,{action:e.action}]),n}).map(ei)),ri=e=>e.map($r),z=f(Lr,Xr,Zr,Yr),B=f(Ir,ti,ni,ri),ii=()=>B?.$save?.(),V=()=>z?.$save?.(),ai=e=>e?z?.get?.(e)??null:null,H=(e,t={})=>{let n=z?.get?.(e);return n||(n=Kr(t),z?.set?.(e,n),V()),t?.action&&n.action!==t.action&&(n.action=t.action),n},oi=e=>{if(!e)return!1;let t=e.action||`open-view`,n=H(e.id,{action:t});return n.action===t?!1:(n.action=t,!0)},si=()=>{let e=!1;B?.forEach?.(t=>{oi(t)&&(e=!0)}),e&&V()},ci=()=>{R.length&&(R.forEach(([e,t])=>{let n=H(e,t);Object.assign(n,t)}),R.length=0,V())},ci(),si(),li=()=>{let e=!1;Br.forEach(t=>{if(B?.find?.(e=>e?.id===t.id)){let n=ai(t.id);t.meta&&n?(t.meta.href!==n.href&&(n.href=t.meta.href,e=!0),t.meta.description!==n.description&&(n.description=t.meta.description,e=!0)):t.meta&&!n&&(H(t.id,t.meta),e=!0)}else{let n=ei(t);t.label&&n.label&&typeof n.label==`object`&&`value`in n.label&&(n.label.value=t.label),t.icon&&n.icon&&typeof n.icon==`object`&&`value`in n.icon&&(n.icon.value=t.icon),B.push(s(n)),H(n.id,t.meta),e=!0}}),e&&(ii(),V())},li(),ui=`cw::workspace::wallpaper`,f(ui,()=>s({src:`/assets/wallpaper.jpg`,opacity:1,blur:0}),e=>s(e||{src:`/assets/wallpaper.jpg`,opacity:1,blur:0}),e=>({...e})),di=`cw::workspace::grid-layout`,U=f(di,()=>s({columns:4,rows:8,shape:`square`}),e=>s(e||{columns:4,rows:8,shape:`square`}),e=>({...e})),fi=()=>U?.$save?.(),pi=e=>{let t=e?.grid||U,n=t?.columns??4,r=t?.rows??8,i=t?.shape??`square`;U&&(U.columns=n,U.rows=r,U.shape=i,fi()),!(typeof document>`u`)&&(document.querySelectorAll(`.speed-dial-grid`).forEach(e=>{let t=e;t.dataset.gridColumns=String(n),t.dataset.gridRows=String(r),t.dataset.gridShape=i}),document.documentElement.dataset.gridColumns=String(n),document.documentElement.dataset.gridRows=String(r),document.documentElement.dataset.gridShape=i)},typeof globalThis<`u`&&typeof document<`u`&&Nr(()=>pi())})),hi=t({applyTheme:()=>W,cssBackgroundToOpaqueHex:()=>gi,initTheme:()=>Ci,resyncThemeAfterAdoptedViewSheet:()=>Si,samplePwaToolbarBackgroundColor:()=>_i,syncBrowserChromeTheme:()=>xi}),gi,_i,vi,yi,bi,xi,W,Si,Ci,wi=e((()=>{Ae(),mi(),gi=e=>{let t=e.trim();if(!t||t===`transparent`)return null;let n=t.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);if(n){let e=n[1];return e.length===3&&(e=e[0]+e[0]+e[1]+e[1]+e[2]+e[2]),`#${e.toLowerCase()}`}let r=t.match(/^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)(?:\s*,\s*([\d.]+))?\s*\)$/i);if(!r)return null;let i=r[4]===void 0?1:Number(r[4]);return!Number.isFinite(i)||i<.98?null:`#${[Math.max(0,Math.min(255,Math.round(Number(r[1])))),Math.max(0,Math.min(255,Math.round(Number(r[2])))),Math.max(0,Math.min(255,Math.round(Number(r[3]))))].map(e=>e.toString(16).padStart(2,`0`)).join(``)}`},_i=()=>{if(typeof document>`u`)return null;let e=document.querySelectorAll(`[data-shell]`);for(let t of e){let e=t.shadowRoot;if(!e)continue;let n=e.querySelector(`.app-shell__nav, .app-shell__toolbar`);if(!n)continue;let r=getComputedStyle(n).backgroundColor,i=gi(r);if(i)return i}return null},vi=e=>e===`dark`||e===`light`?e:globalThis.matchMedia?.(`(prefers-color-scheme: dark)`)?.matches?`dark`:`light`,yi=e=>{switch(e){case`small`:return`14px`;case`large`:return`18px`;default:return`16px`}},bi=e=>{try{document.querySelectorAll(`[data-shell]`).forEach(t=>{let n=t;n.dataset.theme=e,n.style.colorScheme=e;let r=n.shadowRoot?.querySelector?.(`.app-shell`);r&&(r.dataset.theme=e,r.style.colorScheme=e)})}catch{}},xi=(e,t)=>{if(typeof document>`u`)return;let n=document.documentElement,r=t===`dark`?`dark`:t===`light`?`light`:`auto`;n.setAttribute(`data-scheme`,r),n.setAttribute(`data-theme`,e),n.style.colorScheme=e;try{let t=document.body;t&&(t.style.colorScheme=e)}catch{}try{document.querySelectorAll(`[data-shell='content']`).forEach(t=>{t.style.colorScheme=e})}catch{}if(globalThis?.__LURE_DYNAMIC_THEME_PRIORITY__!==!0){let t=()=>{if(globalThis?.__LURE_DYNAMIC_THEME_PRIORITY__===!0)return;let t=document.querySelector(`meta[name="theme-color"]`);if(!t)return;let n=_i(),r=e===`dark`?`#0f1419`:`#007acc`;t.setAttribute(`content`,n??r)};t(),requestAnimationFrame(t)}bi(e)},W=e=>{if(typeof document>`u`||!e)return;let t=document.documentElement,n=e.appearance?.theme||`auto`,r=vi(n);xi(r,n),t.style.fontSize=yi(e.appearance?.fontSize),e.appearance?.color&&(document.body.style.setProperty(`--current`,e.appearance.color),document.body.style.setProperty(`--primary`,e.appearance.color),t.style.setProperty(`--current`,e.appearance.color),t.style.setProperty(`--primary`,e.appearance.color)),e.grid&&pi(e)},Si=()=>{if(typeof document>`u`)return;let e=async()=>{try{W(await ke())}catch{}try{document.documentElement.offsetHeight}catch{}};(async()=>{await e(),queueMicrotask(()=>{e()}),requestAnimationFrame(()=>{e();try{document.documentElement.dispatchEvent(new CustomEvent(`u2-theme-change`,{bubbles:!0}))}catch{}requestAnimationFrame(()=>{e();let t=globalThis.requestIdleCallback;typeof t==`function`?t(()=>{e()},{timeout:200}):globalThis.setTimeout(()=>{e()},50)})})})()},Ci=async()=>{try{if(typeof document>`u`)return;let e=await ke();W(e),globalThis.matchMedia?.(`(prefers-color-scheme: dark)`)?.addEventListener?.(`change`,async()=>{W(await ke())})}catch(e){console.warn(`Failed to init theme`,e)}}})),Ti=e((()=>{})),Ei=e((()=>{kr(),Pr(),wi(),Ti()})),Di,Oi=e((()=>{Di=`@function --hsv(--src-color <color>) returns <color> {
  result: hsl(from var(--src-color, black) h calc(calc((calc(l / 100) - calc(calc(l / 100) * (1 - calc(s / 100) / 2))) / clamp(0.0001, min(calc(calc(l / 100) * (1 - calc(s / 100) / 2)), calc(1 - calc(calc(l / 100) * (1 - calc(s / 100) / 2)))), 1)) * 100) calc(calc(calc(l / 100) * (1 - calc(s / 100) / 2)) * 100) / alpha);
}
/* ai-refactor: optimized/refactored at 2026-02-13T02:50:43Z */
/* ==========================================================================
    Meta / Declarations
   ========================================================================== */
/* ==========================================================================
    Tokens / Mixins (global, not layered)
   ========================================================================== */
/* ai-refactor: optimized/refactored at 2026-02-13T00:48:23Z */
@layer tokens, base, layout, utilities, shells, shell, views, view, viewer, components, ux-layer, markdown, essentials, print, print-breaks, overrides;
@layer tokens {
  :root,
  :host,
  :scope {
    color-scheme: light dark;
    --color-primary: #5a7fff;
    --color-on-primary: #ffffff;
    --color-secondary: #6b7280;
    --color-on-secondary: #ffffff;
    --color-tertiary: #64748b;
    --color-on-tertiary: #ffffff;
    --color-error: #ef4444;
    --color-on-error: #ffffff;
    --color-success: #4caf50;
    --color-warning: #ff9800;
    --color-info: #2196f3;
    --color-background: #fafbfc;
    --color-on-background: #1e293b;
    --color-surface: #fafbfc;
    --color-on-surface: #1e293b;
    --color-surface-variant: #f1f5f9;
    --color-on-surface-variant: #64748b;
    --color-outline: #cbd5e1;
    --color-outline-variant: #94a3b8;
    --color-surface-container-low: color-mix(in oklab, var(--color-surface) 96%, var(--color-primary) 4%);
    --color-surface-container: color-mix(in oklab, var(--color-surface) 92%, var(--color-primary) 8%);
    --color-surface-container-high: color-mix(in oklab, var(--color-surface) 88%, var(--color-primary) 12%);
    --color-surface-container-highest: color-mix(in oklab, var(--color-surface) 84%, var(--color-primary) 16%);
    --color-border: color-mix(in oklab, var(--color-outline-variant) 75%, transparent);
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
    --view-input-bg: light-dark(#ffffff, var(--color-surface-container-high));
    --view-files-bg: light-dark(rgba(0, 0, 0, 0.02), var(--color-surface-container-low));
    --view-file-bg: light-dark(rgba(0, 0, 0, 0.03), var(--color-surface-container-lowest, var(--color-surface-container-low)));
    --view-results-bg: light-dark(rgba(0, 0, 0, 0.01), var(--color-surface-container-low));
    --view-result-bg: light-dark(rgba(0, 0, 0, 0.03), var(--color-surface-container-lowest, var(--color-surface-container-low)));
    --color-surface-elevated: var(--color-surface-container);
    --color-surface-hover: var(--color-surface-container-low);
    --color-surface-active: var(--color-surface-container-high);
    --color-on-surface-muted: var(--color-on-surface-variant);
    --color-background-alt: var(--color-surface-variant);
    --color-primary-hover: color-mix(in oklab, var(--color-primary) 80%, black);
    --color-primary-active: color-mix(in oklab, var(--color-primary) 65%, black);
    --color-accent: var(--color-secondary);
    --color-accent-hover: color-mix(in oklab, var(--color-secondary) 80%, black);
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
    --color-link-hover: color-mix(in oklab, var(--color-primary) 80%, black);
    --color-success-light: color-mix(in oklab, var(--color-success) 60%, white);
    --color-success-dark: color-mix(in oklab, var(--color-success) 70%, black);
    --color-warning-light: color-mix(in oklab, var(--color-warning) 60%, white);
    --color-warning-dark: color-mix(in oklab, var(--color-warning) 70%, black);
    --color-error-light: color-mix(in oklab, var(--color-error) 60%, white);
    --color-error-dark: color-mix(in oklab, var(--color-error) 70%, black);
    --color-info-light: color-mix(in oklab, var(--color-info) 60%, white);
    --color-info-dark: color-mix(in oklab, var(--color-info) 70%, black);
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
  @media (prefers-color-scheme: dark) {
    :root,
    :host,
    :scope {
      --color-primary: #7ca7ff;
      --color-on-primary: #0f172a;
      --color-secondary: #94a3b8;
      --color-on-secondary: #1e293b;
      --color-tertiary: #94a3b8;
      --color-on-tertiary: #0f172a;
      --color-error: #f87171;
      --color-on-error: #450a0a;
      --color-success: #66bb6a;
      --color-warning: #ffa726;
      --color-info: #42a5f5;
      --color-background: #0f1419;
      --color-on-background: #f1f5f9;
      --color-surface: #0f1419;
      --color-on-surface: #f1f5f9;
      --color-surface-variant: #1e293b;
      --color-on-surface-variant: #cbd5e1;
      --color-outline: #475569;
      --color-outline-variant: #334155;
      --color-surface-container-low: color-mix(in oklab, var(--color-surface) 92%, var(--color-primary) 8%);
      --color-surface-container: color-mix(in oklab, var(--color-surface) 88%, var(--color-primary) 12%);
      --color-surface-container-high: color-mix(in oklab, var(--color-surface) 84%, var(--color-primary) 16%);
      --color-surface-container-highest: color-mix(in oklab, var(--color-surface) 80%, var(--color-primary) 20%);
      --color-border: color-mix(in oklab, var(--color-outline-variant) 70%, transparent);
    }
  }
  [data-theme=light] {
    color-scheme: light;
    --color-primary: #5a7fff;
    --color-on-primary: #ffffff;
    --color-secondary: #6b7280;
    --color-on-secondary: #ffffff;
    --color-tertiary: #64748b;
    --color-on-tertiary: #ffffff;
    --color-error: #ef4444;
    --color-on-error: #ffffff;
    --color-success: #4caf50;
    --color-warning: #ff9800;
    --color-info: #2196f3;
    --color-background: #fafbfc;
    --color-on-background: #1e293b;
    --color-surface: #fafbfc;
    --color-on-surface: #1e293b;
    --color-surface-variant: #f1f5f9;
    --color-on-surface-variant: #64748b;
    --color-outline: #cbd5e1;
    --color-outline-variant: #94a3b8;
    --color-surface-container-low: color-mix(in oklab, var(--color-surface) 96%, var(--color-primary) 4%);
    --color-surface-container: color-mix(in oklab, var(--color-surface) 92%, var(--color-primary) 8%);
    --color-surface-container-high: color-mix(in oklab, var(--color-surface) 88%, var(--color-primary) 12%);
    --color-surface-container-highest: color-mix(in oklab, var(--color-surface) 84%, var(--color-primary) 16%);
    --color-border: color-mix(in oklab, var(--color-outline-variant) 75%, transparent);
  }
  [data-theme=dark] {
    color-scheme: dark;
    --color-primary: #7ca7ff;
    --color-on-primary: #0f172a;
    --color-secondary: #94a3b8;
    --color-on-secondary: #1e293b;
    --color-tertiary: #94a3b8;
    --color-on-tertiary: #0f172a;
    --color-error: #f87171;
    --color-on-error: #450a0a;
    --color-success: #66bb6a;
    --color-warning: #ffa726;
    --color-info: #42a5f5;
    --color-background: #0f1419;
    --color-on-background: #f1f5f9;
    --color-surface: #0f1419;
    --color-on-surface: #f1f5f9;
    --color-surface-variant: #1e293b;
    --color-on-surface-variant: #cbd5e1;
    --color-outline: #475569;
    --color-outline-variant: #334155;
    --color-surface-container-low: color-mix(in oklab, var(--color-surface) 92%, var(--color-primary) 8%);
    --color-surface-container: color-mix(in oklab, var(--color-surface) 88%, var(--color-primary) 12%);
    --color-surface-container-high: color-mix(in oklab, var(--color-surface) 84%, var(--color-primary) 16%);
    --color-surface-container-highest: color-mix(in oklab, var(--color-surface) 80%, var(--color-primary) 20%);
    --color-border: color-mix(in oklab, var(--color-outline-variant) 70%, transparent);
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
}`})),ki,Ai=e((()=>{ki=`@function --hsv(--src-color <color>) returns <color> {
  result: hsl(from var(--src-color, black) h calc(calc((calc(l / 100) - calc(calc(l / 100) * (1 - calc(s / 100) / 2))) / clamp(0.0001, min(calc(calc(l / 100) * (1 - calc(s / 100) / 2)), calc(1 - calc(calc(l / 100) * (1 - calc(s / 100) / 2)))), 1)) * 100) calc(calc(calc(l / 100) * (1 - calc(s / 100) / 2)) * 100) / alpha);
}
/* ai-refactor: optimized/refactored at 2026-02-13T02:50:43Z */
/* ==========================================================================
    Meta / Declarations
   ========================================================================== */
/* ==========================================================================
    Tokens / Mixins (global, not layered)
   ========================================================================== */
/* ai-refactor: optimized/refactored at 2026-02-13T00:48:23Z */
@layer tokens, base, layout, utilities, shells, shell, views, view, viewer, components, ux-layer, markdown, essentials, print, print-breaks, overrides;
@layer tokens {
  :root,
  :host,
  :scope {
    color-scheme: light dark;
    --color-primary: #5a7fff;
    --color-on-primary: #ffffff;
    --color-secondary: #6b7280;
    --color-on-secondary: #ffffff;
    --color-tertiary: #64748b;
    --color-on-tertiary: #ffffff;
    --color-error: #ef4444;
    --color-on-error: #ffffff;
    --color-success: #4caf50;
    --color-warning: #ff9800;
    --color-info: #2196f3;
    --color-background: #fafbfc;
    --color-on-background: #1e293b;
    --color-surface: #fafbfc;
    --color-on-surface: #1e293b;
    --color-surface-variant: #f1f5f9;
    --color-on-surface-variant: #64748b;
    --color-outline: #cbd5e1;
    --color-outline-variant: #94a3b8;
    --color-surface-container-low: color-mix(in oklab, var(--color-surface) 96%, var(--color-primary) 4%);
    --color-surface-container: color-mix(in oklab, var(--color-surface) 92%, var(--color-primary) 8%);
    --color-surface-container-high: color-mix(in oklab, var(--color-surface) 88%, var(--color-primary) 12%);
    --color-surface-container-highest: color-mix(in oklab, var(--color-surface) 84%, var(--color-primary) 16%);
    --color-border: color-mix(in oklab, var(--color-outline-variant) 75%, transparent);
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
    --view-input-bg: light-dark(#ffffff, var(--color-surface-container-high));
    --view-files-bg: light-dark(rgba(0, 0, 0, 0.02), var(--color-surface-container-low));
    --view-file-bg: light-dark(rgba(0, 0, 0, 0.03), var(--color-surface-container-lowest, var(--color-surface-container-low)));
    --view-results-bg: light-dark(rgba(0, 0, 0, 0.01), var(--color-surface-container-low));
    --view-result-bg: light-dark(rgba(0, 0, 0, 0.03), var(--color-surface-container-lowest, var(--color-surface-container-low)));
    --color-surface-elevated: var(--color-surface-container);
    --color-surface-hover: var(--color-surface-container-low);
    --color-surface-active: var(--color-surface-container-high);
    --color-on-surface-muted: var(--color-on-surface-variant);
    --color-background-alt: var(--color-surface-variant);
    --color-primary-hover: color-mix(in oklab, var(--color-primary) 80%, black);
    --color-primary-active: color-mix(in oklab, var(--color-primary) 65%, black);
    --color-accent: var(--color-secondary);
    --color-accent-hover: color-mix(in oklab, var(--color-secondary) 80%, black);
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
    --color-link-hover: color-mix(in oklab, var(--color-primary) 80%, black);
    --color-success-light: color-mix(in oklab, var(--color-success) 60%, white);
    --color-success-dark: color-mix(in oklab, var(--color-success) 70%, black);
    --color-warning-light: color-mix(in oklab, var(--color-warning) 60%, white);
    --color-warning-dark: color-mix(in oklab, var(--color-warning) 70%, black);
    --color-error-light: color-mix(in oklab, var(--color-error) 60%, white);
    --color-error-dark: color-mix(in oklab, var(--color-error) 70%, black);
    --color-info-light: color-mix(in oklab, var(--color-info) 60%, white);
    --color-info-dark: color-mix(in oklab, var(--color-info) 70%, black);
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
  @media (prefers-color-scheme: dark) {
    :root,
    :host,
    :scope {
      --color-primary: #7ca7ff;
      --color-on-primary: #0f172a;
      --color-secondary: #94a3b8;
      --color-on-secondary: #1e293b;
      --color-tertiary: #94a3b8;
      --color-on-tertiary: #0f172a;
      --color-error: #f87171;
      --color-on-error: #450a0a;
      --color-success: #66bb6a;
      --color-warning: #ffa726;
      --color-info: #42a5f5;
      --color-background: #0f1419;
      --color-on-background: #f1f5f9;
      --color-surface: #0f1419;
      --color-on-surface: #f1f5f9;
      --color-surface-variant: #1e293b;
      --color-on-surface-variant: #cbd5e1;
      --color-outline: #475569;
      --color-outline-variant: #334155;
      --color-surface-container-low: color-mix(in oklab, var(--color-surface) 92%, var(--color-primary) 8%);
      --color-surface-container: color-mix(in oklab, var(--color-surface) 88%, var(--color-primary) 12%);
      --color-surface-container-high: color-mix(in oklab, var(--color-surface) 84%, var(--color-primary) 16%);
      --color-surface-container-highest: color-mix(in oklab, var(--color-surface) 80%, var(--color-primary) 20%);
      --color-border: color-mix(in oklab, var(--color-outline-variant) 70%, transparent);
    }
  }
  [data-theme=light] {
    color-scheme: light;
    --color-primary: #5a7fff;
    --color-on-primary: #ffffff;
    --color-secondary: #6b7280;
    --color-on-secondary: #ffffff;
    --color-tertiary: #64748b;
    --color-on-tertiary: #ffffff;
    --color-error: #ef4444;
    --color-on-error: #ffffff;
    --color-success: #4caf50;
    --color-warning: #ff9800;
    --color-info: #2196f3;
    --color-background: #fafbfc;
    --color-on-background: #1e293b;
    --color-surface: #fafbfc;
    --color-on-surface: #1e293b;
    --color-surface-variant: #f1f5f9;
    --color-on-surface-variant: #64748b;
    --color-outline: #cbd5e1;
    --color-outline-variant: #94a3b8;
    --color-surface-container-low: color-mix(in oklab, var(--color-surface) 96%, var(--color-primary) 4%);
    --color-surface-container: color-mix(in oklab, var(--color-surface) 92%, var(--color-primary) 8%);
    --color-surface-container-high: color-mix(in oklab, var(--color-surface) 88%, var(--color-primary) 12%);
    --color-surface-container-highest: color-mix(in oklab, var(--color-surface) 84%, var(--color-primary) 16%);
    --color-border: color-mix(in oklab, var(--color-outline-variant) 75%, transparent);
  }
  [data-theme=dark] {
    color-scheme: dark;
    --color-primary: #7ca7ff;
    --color-on-primary: #0f172a;
    --color-secondary: #94a3b8;
    --color-on-secondary: #1e293b;
    --color-tertiary: #94a3b8;
    --color-on-tertiary: #0f172a;
    --color-error: #f87171;
    --color-on-error: #450a0a;
    --color-success: #66bb6a;
    --color-warning: #ffa726;
    --color-info: #42a5f5;
    --color-background: #0f1419;
    --color-on-background: #f1f5f9;
    --color-surface: #0f1419;
    --color-on-surface: #f1f5f9;
    --color-surface-variant: #1e293b;
    --color-on-surface-variant: #cbd5e1;
    --color-outline: #475569;
    --color-outline-variant: #334155;
    --color-surface-container-low: color-mix(in oklab, var(--color-surface) 92%, var(--color-primary) 8%);
    --color-surface-container: color-mix(in oklab, var(--color-surface) 88%, var(--color-primary) 12%);
    --color-surface-container-high: color-mix(in oklab, var(--color-surface) 84%, var(--color-primary) 16%);
    --color-surface-container-highest: color-mix(in oklab, var(--color-surface) 80%, var(--color-primary) 20%);
    --color-border: color-mix(in oklab, var(--color-outline-variant) 70%, transparent);
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
}`}));async function ji(e){if(G===e)return;console.log(`[Veela] Loading variant:`,e);let t=async e=>{typeof e==`string`&&e.length&&await a(e)};if(e===`core`){await t(Di),G=e;return}await t(ki),G=e}var G,Mi=e((()=>{c(),Oi(),Ai(),G=null}));async function Ni(e){let t=Pi[e]||Pi[`vl-basic`];if(!t)throw Error(`Unknown style system: ${e}`);if(Fi===e){console.log(`[Styles] Style system '${e}' already loaded`);return}console.log(`[Styles] Loading style system: ${t.name}`),t.initFn&&await t.initFn(),Fi=e,console.log(`[Styles] Style system ${t.name} loaded`)}var Pi,Fi,Ii=e((()=>{Mi(),Pi={"vl-advanced":{id:`vl-advanced`,name:`Veela Advanced`,description:`Full-featured CSS framework with design tokens and effects`,variant:`advanced`,initFn:async()=>{try{await ji(`advanced`),console.log(`[Styles] Veela Advanced loaded`)}catch{}}},"vl-basic":{id:`vl-basic`,name:`Veela Basic Styles`,description:`Lightweight minimal styling for basic functionality`,variant:`basic`,initFn:async()=>{try{await ji(`basic`),console.log(`[Styles] Veela Basic Styles loaded`)}catch(e){console.warn(`[Styles] Failed to load Veela Basic Styles:`,e)}}},"vl-beercss":{id:`vl-beercss`,name:`Veela BeerCSS`,description:`Beer CSS compatible styling with Material Design 3`,variant:`beercss`,initFn:async()=>{try{await ji(`beercss`),console.log(`[Styles] Veela BeerCSS loaded`)}catch(e){console.warn(`[Styles] Failed to load Veela BeerCSS:`,e)}}},"vl-core":{id:`vl-core`,name:`Veela Core`,description:`Shared foundation styles for all veela variants`,variant:`core`,initFn:async()=>{try{await ji(`core`),console.log(`[Styles] Veela Core loaded`)}catch(e){console.warn(`[Styles] Failed to load Veela Core:`,e)}}},raw:{id:`raw`,name:`Raw`,description:`No styling framework, browser defaults`,variant:`core`,initFn:async()=>{console.log(`[Styles] Raw mode - no styles loaded`)}}},Fi=null})),Li=t({applyHubSocketFromSettings:()=>Ui,backendOwnsExclusiveHubWebsocket:()=>Bi,installAirpadHubLifecycleRecovery:()=>Hi,nativeShellOwnsExclusiveHubWebsocket:()=>Ri,nodeClipboardHubOwnsExclusiveWebsocket:()=>zi});function Ri(){if(!Pe())return!1;try{if(globalThis.__CWS_NATIVE__===!0)return!0}catch{}return qi()}function zi(){return Le()}function Bi(){return Ri()||zi()}function Vi(){return!(Bi()||!Ne()&&!Re()||!Fe().trim())}function Hi(){if(Gi||typeof window>`u`||typeof document>`u`)return;Gi=!0,document.addEventListener(`visibilitychange`,()=>{document.visibilityState===`hidden`&&(Ki=Date.now())});let e=e=>{globalThis.setTimeout(e,280)},t=()=>{Vi()&&(async()=>{let{connectWS:e,getWS:t,initWebSocket:n,isWSConnected:r,reconnectTransportAfterLifecycleResume:i}=await g(async()=>{let{connectWS:e,getWS:t,initWebSocket:n,isWSConnected:r,reconnectTransportAfterLifecycleResume:i}=await import(`./websocket-DOCbpCr1.js`).then(e=>(e.i(),e.s));return{connectWS:e,getWS:t,initWebSocket:n,isWSConnected:r,reconnectTransportAfterLifecycleResume:i}},[],import.meta.url);n(null);let a=!!t()?.connected;if(Ki>0&&Date.now()-Ki>=Wi&&(a||r())){i(`visibility`);return}!a&&!r()&&e()})()},n=e=>{Vi()&&(async()=>{let{initWebSocket:t,reconnectTransportAfterLifecycleResume:n}=await g(async()=>{let{initWebSocket:e,reconnectTransportAfterLifecycleResume:t}=await import(`./websocket-DOCbpCr1.js`).then(e=>(e.i(),e.s));return{initWebSocket:e,reconnectTransportAfterLifecycleResume:t}},[],import.meta.url);t(null),n(e)})()};document.addEventListener(`visibilitychange`,()=>{document.visibilityState===`visible`&&e(t)}),window.addEventListener(`online`,()=>e(()=>n(`online`))),window.addEventListener(`pageshow`,t=>{t.persisted&&e(()=>n(`bfcache`))})}async function Ui(e){if(Hi(),await Me(e)||(Ie(e),Ri())||zi()||!Ne()&&!Re()||!Fe().trim())return;let{initWebSocket:t,connectWS:n}=await g(async()=>{let{initWebSocket:e,connectWS:t}=await import(`./websocket-DOCbpCr1.js`).then(e=>(e.i(),e.s));return{initWebSocket:e,connectWS:t}},[],import.meta.url);t(null),n()}var Wi,Gi,Ki,qi,Ji=e((()=>{Ae(),ze(),ie(),Wi=12e3,Gi=!1,Ki=0,qi=()=>{try{let e=globalThis.Capacitor;return typeof e?.isNativePlatform==`function`&&!!e.isNativePlatform()}catch{return!1}}})),Yi=t({ensureCapacitorPermissions:()=>Qi,isCapacitorNative:()=>K}),Xi,K,q,J,Zi,Qi,$i=e((()=>{Xi=()=>{try{let e=globalThis?.Capacitor;return e&&typeof e==`object`?e:null}catch{return null}},K=()=>{let e=Xi();try{return!!(e?.isNativePlatform?.()??(e?.platform&&e.platform!==`web`))}catch{return!1}},q=e=>{let t=Xi()?.Plugins?.[e];return t&&typeof t==`object`?t:null},J=async(e,...t)=>{try{return typeof e==`function`?await e(...t):void 0}catch{return}},Zi=!1,Qi=async()=>{if(!K())return{native:!1,requested:[]};if(Zi)return{native:!0,requested:[]};Zi=!0;let e=[],t=q(`Clipboard`);t&&(await J(t.read),e.push(`clipboard`));let n=q(`CwsPlatform`);if(n)await J(n.requestRuntimePermissions),e.push(`CwsPlatform.requestRuntimePermissions`);else{let t=q(`DevicePermissions`)||q(`Permissions`);t&&typeof t.requestPermissions==`function`&&(await J(t.requestPermissions,{permissions:[`POST_NOTIFICATIONS`]}),e.push(`legacy-permissions`))}let r=q(`LocalNotifications`);return r&&typeof r.requestPermissions==`function`&&(await J(r.requestPermissions),e.push(`notifications`)),{native:!0,requested:e}}})),ea,Y,X,ta,na,ra=e((()=>{$i(),ea=()=>{try{let e=globalThis?.Capacitor;return e&&typeof e==`object`?e:null}catch{return null}},Y=e=>{let t=ea()?.Plugins?.[e];return t&&typeof t==`object`?t:null},X=async(e,...t)=>{try{return typeof e==`function`?await e(...t):void 0}catch(e){console.warn(`[capacitor-settings-permissions]`,e);return}},ta=async e=>{let t=[],n=[],r=!1;if(!K())return{lines:t,results:n,prompted:r};e.shell&&(e.shell.acceptSmsBridgeData=!1,e.shell.enableNativeSms=!1);let i=e.shell||{},a=i.acceptContactsBridgeData===!0,o=(i.bridgeDaemonEnabled??!0)!==!1,s=(i.enableRemoteClipboardBridge??!0)!==!1,c=o||s,l=Y(`CwsPlatform`);if(a||c)if(l?.requestSettingsPermissions){let e=await X(l.requestSettingsPermissions,{contacts:a,sms:!1,notifications:c,overlay:!1}),i=!1;if(e&&typeof e==`object`){i=e.prompted===!0,r=i;let t=e.results;if(Array.isArray(t)){for(let e of t)if(e&&typeof e==`object`){let t=String(e.permission??``);if(t===`SYSTEM_ALERT_WINDOW`||t===`READ_SMS`||t===`RECEIVE_SMS`||t===`SEND_SMS`)continue;n.push({permission:t,granted:!!e.granted})}}}let o=n.filter(e=>e.granted===!1);o.length?t.push(`Permission denied: ${o.map(e=>e.permission).filter(Boolean).join(`, `)}`):i&&t.push(`Runtime permissions requested`)}else{let e=Y(`DevicePermissions`)||Y(`Permissions`),n=[];a&&n.push(`READ_CONTACTS`),c&&n.push(`POST_NOTIFICATIONS`),e?.requestPermissions&&n.length&&(await X(e.requestPermissions,{permissions:n}),t.push(`Runtime permissions requested (legacy plugin)`))}return o&&l?.startCwspBridge?(await X(l.startCwspBridge),t.push(`CWSP foreground service started`)):!o&&l?.stopCwspBridge&&(await X(l.stopCwspBridge),t.push(`CWSP foreground service stopped`)),{lines:t,results:n,prompted:r}},na=async e=>{if(!K()||((e?.shell||{}).bridgeDaemonEnabled??!0)===!1)return!1;e?.shell&&(e.shell.acceptSmsBridgeData=!1,e.shell.enableNativeSms=!1);let t=Y(`CwsPlatform`);return t?.startCwspBridge?(await X(t.startCwspBridge),!0):!1}})),ia=t({BootLoader:()=>ca,bootLoader:()=>la,bootMinimal:()=>aa,default:()=>la});async function aa(e,t=`viewer`,n){let r=Rn(t,`viewer`),i=O(r)?[r]:[`viewer`],a=i[0];return la.boot(e,{styleSystem:`vl-basic`,shell:`minimal`,defaultView:r,channels:i,channelPriorityId:a,rememberChoice:n?.rememberChoice??!0,skipInitialNavigate:n?.skipInitialNavigate??!1})}var oa,sa,ca,la,ua=e((()=>{c(),We(),Ye(),Yn(),er(),Or(),Ae(),Oe(),Ei(),vn(),Ii(),zn(),Ji(),ra(),ie(),oa=e=>e===`faint`?`tabbed`:e===`base`?`immersive`:e,sa={raw:{name:`Raw (No Framework)`,stylesheets:[],description:`No CSS framework, raw browser defaults`,recommendedShells:[`immersive`]},"vl-core":{name:`Core (Shared Foundation)`,stylesheets:[],description:`Shared foundation styles for all veela variants`,recommendedShells:[`immersive`,`minimal`]},"vl-basic":{name:`Basic Veela Styles`,stylesheets:[],description:`Minimal styling for basic functionality`,recommendedShells:[`window`,`tabbed`,`minimal`,`environment`,`immersive`,`content`]},"vl-advanced":{name:`Advanced (Full-Featured Styling)`,stylesheets:[],description:`Full-featured styling with design tokens and effects`,recommendedShells:[`tabbed`,`minimal`,`environment`]},"vl-beercss":{name:`BeerCSS (Beer CSS Compatible)`,stylesheets:[],description:`Beer CSS compatible styling with Material Design 3`,recommendedShells:[`tabbed`]}},ca=class e{static instance;state={phase:`idle`,styleSystem:null,shell:null,view:null,error:null};stateChangeHandlers=new Set;shellInstance=null;implicitBridgeCleanup=null;phaseHandlers=new Map;constructor(){Un()}static getInstance(){return e.instance||=new e,e.instance}async boot(e,t){console.log(`[BootLoader] Starting boot sequence:`,t);try{if(this.shellInstance)try{this.implicitBridgeCleanup?.(),this.implicitBridgeCleanup=null,k.unload(this.shellInstance.id)}catch(e){console.warn(`[BootLoader] Failed to unload previous shell:`,e)}finally{this.shellInstance=null}Xn(),vr().catch(()=>{});try{let{initFrontendDebugCapture:e}=await g(async()=>{let{initFrontendDebugCapture:e}=await import(`./frontend-debug-capture-DNrY09BI.js`).then(e=>(e.i(),e.t));return{initFrontendDebugCapture:e}},[],import.meta.url);e()}catch{}let n=await ke().catch(e=>(console.warn(`[BootLoader] Failed to load settings:`,e),null)),r=n;if(L()){let e=await je().catch(()=>null);e&&(r=e)}if(r&&Ui(r).catch(()=>void 0),L()&&na(r).catch(e=>{console.warn(`[BootLoader] CWSP bridge daemon auto-start skipped:`,e)}),W(r??De),!(()=>{try{let e=globalThis;return!!(e.__CWS_NEUTRALINO_BOOT__||e.__CWS_WEBNATIVE_BOOT__||e.Neutralino||typeof e.NL_OS==`string`)}catch{return!1}})())try{let{initIngressPWA:e}=await g(async()=>{let{initIngressPWA:e}=await import(`./sw-handling-1lpAdbho.js`);return{initIngressPWA:e}},[],import.meta.url);await e()}catch(e){console.warn(`[BootLoader] Share-target / service worker ingress failed (non-fatal):`,e)}await this.loadStyles(t.styleSystem);let i=this.resolveThemeFromSettings(n),a=await this.loadShell(t.shell,e);return a.setTheme(t.theme||i),await a.mount(e),this.implicitBridgeCleanup?.(),this.implicitBridgeCleanup=gn(),t.channels&&t.channels.length>0&&await this.initChannels(t.channels,t.channelPriorityId),t.skipInitialNavigate?this.dismissShellLoadingSpinner(a):await a.navigate(t.defaultView),this.setPhase(`ready`),t.rememberChoice&&this.savePreferences(t),console.log(`[BootLoader] Boot complete`),a}catch(e){throw console.error(`[BootLoader] Boot failed:`,e),this.updateState({phase:`error`,error:e}),e}}resolveThemeFromSettings(e){let t=e?.appearance?.theme||`auto`;return t===`dark`?Jn:t===`light`?qn:Kn}dismissShellLoadingSpinner(e){try{let t=e.getElement().shadowRoot?.querySelector(`.app-shell__loading`);t&&(t.hidden=!0)}catch{}}async loadStyles(e){this.setPhase(`styles`),console.log(`[BootLoader] Loading style system: ${e}`);let t=sa[e]||sa[`vl-basic`];try{await Ni(e)}catch(t){throw console.error(`[BootLoader] Failed to load style system: ${e}`,t),t}for(let e of t.stylesheets)try{await a(e)}catch(t){console.warn(`[BootLoader] Failed to load stylesheet: ${e}`,t)}this.updateState({styleSystem:e}),console.log(`[BootLoader] Style system ${e} loaded`)}async loadShell(e,t){this.setPhase(`shell`);let n=oa(e);n!==e&&console.warn(`[BootLoader] Shell "${e}" is temporarily disabled, redirecting to "${n}"`),console.log(`[BootLoader] Loading shell: ${n}`);let r=await k.load(n,t);return this.shellInstance=r,this.updateState({shell:n}),console.log(`[BootLoader] Shell ${n} loaded`),r}async initChannels(e,t){this.setPhase(`channels`);let n=[...new Set(e)];if(n.length===0)return;let r=(t&&n.includes(t)?t:null)??n[0],i=n.filter(e=>e!==r);console.log(`[BootLoader] Initializing primary channel:`,r,i.length?`(+${i.length} deferred)`:``);try{await Je.initChannel(r)}catch(e){console.warn(`[BootLoader] Failed to init primary channel ${r}:`,e)}if(i.length===0){console.log(`[BootLoader] Channels initialized`);return}let a=()=>{(async()=>{for(let e of i)try{await Je.initChannel(e)}catch(t){console.warn(`[BootLoader] Failed to init channel ${e}:`,t)}console.log(`[BootLoader] Deferred channels initialized:`,i)})()};typeof globalThis.requestIdleCallback==`function`?globalThis.requestIdleCallback(a,{timeout:5e3}):globalThis.setTimeout?.(a,0)}updateState(e){Object.assign(this.state,e),this.notifyStateChange()}setPhase(e){this.updateState({phase:e});let t=this.phaseHandlers.get(e);if(t)for(let e of t)try{e(this.state)}catch(e){console.error(`[BootLoader] Phase handler error:`,e)}}notifyStateChange(){for(let e of this.stateChangeHandlers)try{e(this.state)}catch(e){console.error(`[BootLoader] State handler error:`,e)}}onStateChange(e){return this.stateChangeHandlers.add(e),()=>{this.stateChangeHandlers.delete(e)}}onPhase(e,t){return this.phaseHandlers.has(e)||this.phaseHandlers.set(e,new Set),this.phaseHandlers.get(e).add(t),()=>{this.phaseHandlers.get(e)?.delete(t)}}getState(){return{...this.state}}getShell(){return this.shellInstance}savePreferences(e){try{let t=oa(e.shell);localStorage.setItem(`rs-boot-style`,e.styleSystem),localStorage.setItem(`rs-boot-shell`,t),localStorage.setItem(`rs-boot-view`,e.defaultView),localStorage.setItem(`rs-boot-remember`,`1`)}catch(e){console.warn(`[BootLoader] Failed to save preferences:`,e)}}loadPreferences(){try{if(localStorage.getItem(`rs-boot-remember`)!==`1`)return null;let e=oa(localStorage.getItem(`rs-boot-shell`)||`minimal`);return{styleSystem:localStorage.getItem(`rs-boot-style`)||void 0,shell:e,defaultView:localStorage.getItem(`rs-boot-view`)||void 0}}catch{return null}}clearPreferences(){try{localStorage.removeItem(`rs-boot-style`),localStorage.removeItem(`rs-boot-shell`),localStorage.removeItem(`rs-boot-view`),localStorage.removeItem(`rs-boot-remember`),localStorage.removeItem(Ue)}catch{}}},la=ca.getInstance()}));function da(e){if(e&&typeof e.port==`number`)return e;try{let e=globalThis.__WEBNATIVE_AUTH__;if(e&&typeof e.port==`number`)return e}catch{}return null}function fa(e){if(e&&typeof e.port==`number`)return e;try{let e=globalThis,t=e.__NEUTRALINO_AUTH__;if(t&&typeof t.port==`number`){let n=Number(e.NL_PORT);if(!Number.isFinite(n)||t.port!==n)return t}}catch{}return null}async function Z(e,t){try{let n=new Headers(t?.headers);n.set(`Content-Type`,`application/json`),e.key&&n.set(`X-API-Key`,e.key);let r=await fetch(`http://127.0.0.1:${e.port}/service/config`,{...t,headers:n,cache:`no-store`});return r.ok?await r.json():null}catch{return null}}async function pa(e,t){try{let n=new Headers(t?.headers);n.set(`Content-Type`,`application/json`),e.key&&n.set(`X-API-Key`,e.key);let r=await fetch(`http://127.0.0.1:${e.port}/neutralino/config`,{...t,headers:n,cache:`no-store`});return r.ok?await r.json():null}catch{return null}}function ma(e){let t=da(e);return t?{get:async()=>{let e=await Z(t,{method:`GET`});return e?.settings??e?.portable??{}},patch:async e=>{let n=await Z(t,{method:`POST`,body:JSON.stringify(e)});return n?.settings??n?.portable??{}},defaults:async()=>(await Z(t,{method:`GET`}))?.defaults??{},snapshot:async()=>(await Z(t,{method:`GET`}))?.snapshot??{}}:null}function ha(e){let t=fa(e);return t?{get:async()=>{let[e,n]=await Promise.all([Z(t,{method:`GET`}),pa(t,{method:`GET`})]),r=e?.settings??e?.portable??{},i=n?.config??{};return{...r,neutralino:i}},patch:async e=>{let n=await Z(t,{method:`POST`,body:JSON.stringify(e)});return n?.settings??n?.portable??{}},defaults:async()=>(await Z(t,{method:`GET`}))?.defaults??{},snapshot:async()=>(await Z(t,{method:`GET`}))?.snapshot??{}}:null}function ga(){try{globalThis.__CWS_NEUTRALINO_BOOT__=!0}catch{}}function _a(){try{globalThis.__CWS_WEBNATIVE_BOOT__=!0}catch{}}var va=e((()=>{}));function ya(){let e=globalThis;return e.__CWS_WEBNATIVE_BOOT__?`webnative`:e.Capacitor===void 0?e.chrome!==void 0&&e.chrome?.runtime?`crx`:`web`:`capacitor`}function ba(e){ja=e}function xa(e,t){$[e]=t}function Sa(e){delete $[e]}function Ca(){for(let e of Object.keys($))delete $[e]}function wa(e,t){let n={...e};for(let[e,r]of Object.entries(t)){let t=n[e];typeof r==`object`&&r&&!Array.isArray(r)&&typeof t==`object`&&t&&!Array.isArray(t)?n[e]={...t,...r}:n[e]=r}return n}function Ta(e={},t={}){let n={...e};return{get:async()=>({...n}),patch:async e=>(n=wa(n,e),{...n}),...t}}function Ea(){return ja()}function Q(){let e=ja();return $[e]||$.web||null}async function Da(){let e=Q();if(!e)return{};try{return await e.get()}catch{return{}}}async function Oa(e){let t=Q();return t?t.patch(e):{}}async function ka(){let e=Q();if(!e?.defaults)return{};try{return await e.defaults()}catch{return{}}}async function Aa(){let e=Q();if(!e?.snapshot)return{};try{return await e.snapshot()}catch{return{}}}var $,ja,Ma=e((()=>{$={},ja=ya}));function Na(e){let t={port:e.port,key:e.key},n=globalThis;return n.__WEBNATIVE_AUTH__={port:e.port,key:e.key},n.__NEUTRALINO_AUTH__=t,n.__CWS_WEBNATIVE_BOOT__=!0,n.__CWS_NEUTRALINO_BOOT__=!0,n.__CWS_NODE_CLIPBOARD_HUB__=!0,t}async function Pa(e){try{let{getRemoteHost:t,getAccessToken:n,getAirPadClientId:r}=await g(async()=>{let{getRemoteHost:e,getAccessToken:t,getAirPadClientId:n}=await import(`./config-3CjwWmU9.js`).then(e=>(e.y(),e.n));return{getRemoteHost:e,getAccessToken:t,getAirPadClientId:n}},[],import.meta.url),i=t().trim(),a=n().trim(),o=r().trim(),s={};if(i&&(s.remoteHost=i),a&&(s.accessToken=a,s.clientToken=a),o&&(s.clientId=o),s.reload=!1,!Object.keys(s).filter(e=>e!==`reload`).length)return;let c=typeof AbortSignal<`u`&&typeof AbortSignal.timeout==`function`?AbortSignal.timeout(2e3):void 0;await fetch(`http://127.0.0.1:${e.port}/service/clipboard-hub`,{method:`POST`,headers:{"Content-Type":`application/json`,"X-API-Key":e.key},body:JSON.stringify(s),cache:`no-store`,signal:c});try{let e=globalThis,t=typeof e.NL_PATH==`string`?e.NL_PATH:``,n=e.Neutralino?.filesystem?.writeFile;t&&n&&await n(`${t}/.tmp/cwsp-hub-auth.json`,JSON.stringify({remoteHost:i||void 0,accessToken:a||void 0,clientToken:a||void 0,clientId:o||void 0,writtenAt:new Date().toISOString()},null,2))}catch{}}catch(e){console.warn(`[CWSP Neutralino] clipboard-hub credential sync skipped`,e)}}function Fa(e){try{let t=ha(e);t&&xa(`webnative`,t)}catch(e){console.warn(`[CWSP] settings arm registration skipped`,e)}}function Ia(){let e=fa();return e&&typeof e.port==`number`&&e.key&&e.port!==8434&&Number(e.port)>1024?{port:e.port,key:String(e.key)}:{port:Va,key:Ha}}async function La(){try{let e=globalThis,t=typeof e.NL_PATH==`string`?e.NL_PATH:``,n=e.Neutralino?.filesystem?.readFile;if(!t||!n)return null;let r=await n(`${t}/.tmp/cwsp-control-auth.json`),i=JSON.parse(r);if(typeof i.port==`number`&&typeof i.key==`string`)return{port:i.port,key:i.key}}catch{}return null}function Ra(e=15e3){let t=Date.now()+e;(async()=>{for(;Date.now()<t;){let e=await La();if(e){Fa(Na(e));try{let t=await fetch(`http://127.0.0.1:${e.port}/service/config`,{headers:{"X-API-Key":e.key},cache:`no-store`});if(t.ok){console.log(`[CWSP Neutralino] control host ready`,e.port);try{let e=await t.json(),n=e.settings||e.portable||{},{syncAirpadRemoteConfigFromAppSettings:r}=await g(async()=>{let{syncAirpadRemoteConfigFromAppSettings:e}=await import(`./config-3CjwWmU9.js`).then(e=>(e.y(),e.n));return{syncAirpadRemoteConfigFromAppSettings:e}},[],import.meta.url);r(n,{persist:!0})}catch(e){console.warn(`[CWSP Neutralino] airpad hydrate from portable skipped`,e)}await Pa(e);return}}catch{}}await new Promise(e=>setTimeout(e,400))}console.warn(`[CWSP Neutralino] control host still warming — clipboard/settings will retry on use`)})()}async function za(){let e=Ia();try{let t=await Promise.race([La(),new Promise(e=>setTimeout(()=>e(null),400))]);t&&(e=t)}catch{}let t=Na(e);Fa(t);try{let e=ma();e&&!t&&xa(`webnative`,e)}catch{}Ra(),await aa(document.body,`network`);try{document.getElementById(`cwsp-boot-fallback`)?.remove()}catch{}(async()=>{let e=await La()||t;Na(e),await Pa(e)})()}var Ba,Va,Ha,Ua=e((()=>{ua(),va(),Ma(),ie(),Ba=[`minimal`,`network`,`settings`],Va=29110,Ha=`cwsp-neutralino-local`,document.documentElement.dataset.cwspEnabledViews=Ba.join(`,`),ga(),_a(),za().catch(e=>{console.error(`[CWSP Neutralino] minimal-shell boot failed`,e);try{let t=document.getElementById(`cwsp-boot-fallback`);t&&(t.textContent=`CWSP boot failed: ${e instanceof Error?e.message:String(e)}`)}catch{}})}));e((()=>{Ua()}))();export{Gt as $,Mr as A,A as B,Ri as C,Si as D,wi as E,yr as F,O as G,kn as H,br as I,en as J,Rn as K,L,F as M,_r as N,xi as O,Or as P,Ut as Q,M as R,Ji as S,W as T,Ln as U,Yn as V,zn as W,Vt as X,Ht as Y,Wt as Z,ta as _,Aa as a,Mt as at,K as b,wa as c,Ye as ct,Q as d,We as dt,Bt as et,ba as f,ra as g,ua as h,ka as i,kt as it,Pr as j,Fr as k,Oa as l,Je as lt,ia as m,Ta as n,jt as nt,Da as o,Tt as ot,Sa as p,Kt as q,Ea as r,At as rt,Ma as s,lt as st,Ca as t,Pt as tt,xa as u,He as ut,Yi as v,hi as w,Li as x,$i as y,gr as z};