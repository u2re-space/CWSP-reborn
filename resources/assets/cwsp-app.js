import{n as e,r as t}from"./rolldown-runtime-DaJ6WEGw.js";import{G as n,J as r,L as i,Q as a,U as o,V as s,X as c,Y as l,q as u,t as d,w as f}from"./src-kpjtbscK.js";import{m as p,n as m,nt as h,t as g}from"./src-XPMlSw8I.js";import{n as ee,t as _}from"./preload-helper-NDuSAHbO.js";import{_ as v,a as y,f as te,g as b,h as x,i as S,l as C,m as ne,n as w,o as T,p as E,r as re}from"./UniformInterop-0fYt3kIh.js";import{a as ie,c as ae,f as oe,l as se,m as ce,o as le,r as ue,u as de}from"./UnifiedMessaging-Bb5xrVpZ.js";import{a as fe,c as D,i as pe,o as O}from"./cws-bridge-CRDA1GOm.js";import{D as me,E as he,G as ge,N as _e,O as ve,P as ye,R as be,T as xe,_ as Se,d as Ce,f as we,g as Te,h as Ee,m as De,p as Oe,r as ke,u as Ae,v as je,w as Me,y as Ne}from"./airpad-cwsp-client-parity-BenwfXdR.js";import{n as Pe,r as Fe}from"./SettingsTypes-DQqXW8GR.js";import{C as Ie,D as Le,E as Re,S as ze,T as k,_ as Be,a as Ve,b as He,c as Ue,d as We,f as Ge,g as Ke,h as qe,i as Je,k as Ye,l as Xe,m as Ze,o as Qe,p as $e,r as et,s as tt,t as nt,u as rt,v as it,w as at,x as ot,y as st}from"./config-CZGbDUv1.js";import{a as A,i as ct,n as j,s as lt}from"./Settings-BNgb-neR.js";function M(e){return e===`faint`?`tabbed`:e===`base`||e===`minimal`||e===`window`||e===`tabbed`||e===`environment`||e===`content`||e===`immersive`?e:`minimal`}function ut(e){try{let t={shell:M(e),t:Date.now()};globalThis.localStorage?.setItem(ft,JSON.stringify(t))}catch{}}function dt(e){let t=M(e),n=()=>ut(t),r=()=>ut(t),i=globalThis;return i.addEventListener(`focus`,n),i.addEventListener(`pointerdown`,r,{capture:!0,passive:!0}),queueMicrotask(()=>ut(t)),()=>{i.removeEventListener(`focus`,n),i.removeEventListener(`pointerdown`,r,{capture:!0})}}var ft,pt=e((()=>{ft=`rs-boot-shell-last-active`}));function mt(){return gt||=m({channels:ht,logPrefix:`[ServiceChannels]`}),gt}var ht,gt,_t,vt=e((()=>{g(),E(),ht={workcenter:{broadcastName:y.WORK_CENTER,routeHash:C.WORKCENTER,component:T.WORK_CENTER,description:`AI work center for processing files and content`},settings:{broadcastName:y.SETTINGS,routeHash:C.SETTINGS,component:T.SETTINGS,description:`Application settings and configuration`},airpad:{broadcastName:y.SERVICE_AIRPAD,routeHash:C.AIRPAD,component:T.AIRPAD,description:`AirPad remote trackpad/keyboard + clipboard`},network:{broadcastName:y.SERVICE_NETWORK,routeHash:C.NETWORK,component:T.NETWORK,description:`CWSP network status, probes, and endpoint routing`},viewer:{broadcastName:y.MARKDOWN_VIEWER,routeHash:C.MARKDOWN_VIEWER,component:T.MARKDOWN_VIEWER,description:`Content viewer for markdown and files`},explorer:{broadcastName:y.FILE_EXPLORER,routeHash:C.FILE_EXPLORER,component:T.FILE_EXPLORER,description:`File explorer and browser`},print:{broadcastName:y.PRINT_CHANNEL,routeHash:C.PRINT,component:T.BASIC_PRINT,description:`Print preview and export`},history:{broadcastName:y.HISTORY_CHANNEL,routeHash:C.HISTORY,component:T.HISTORY,description:`Action history and undo/redo`},editor:{broadcastName:`rs-editor`,routeHash:C.MARKDOWN_EDITOR,component:T.MARKDOWN_EDITOR,description:`Content editor`},home:{broadcastName:`rs-home`,routeHash:`#home`,component:`home`,description:`Home/landing view`}},gt=null,_t=mt()})),yt,bt,xt,St,Ct=e((()=>{E(),yt={viewer:[`content-view`,`content-load`,`markdown-content`],workcenter:[`content-attach`,`file-attach`,`share-target-input`,`content-share`],explorer:[`file-save`,`navigate-path`,`content-explorer`],editor:[`content-load`,`content-edit`],settings:[`settings-update`],history:[`history-update`],home:[`home-update`],print:[`content-view`]},bt=e=>b(e),xt=(e,t)=>{let n=[t,...yt[e.id]||[]];for(let t of n)if(t&&(!e.canHandleMessage||e.canHandleMessage(t)))return t;return null},St=(e,t)=>{let n=xt(e,t.type);if(!n)return null;let r=typeof t.id==`string`&&t.id.trim()?t.id:void 0;return{...r?{id:r}:{},type:n,data:t.data,metadata:t.metadata}}}));function wt(e,t){if(typeof BroadcastChannel>`u`)return()=>{};let n=new BroadcastChannel(v(b(e)));return n.addEventListener(`message`,t),()=>{n.removeEventListener(`message`,t),n.close()}}var Tt=e((()=>{E(),ie()}));function Et(e){try{if(typeof HTMLElement<`u`&&e instanceof HTMLElement)return e}catch{}return null}function Dt(e){if(!e||typeof e!=`object`)return!1;let t=e,n=e=>typeof File<`u`&&e instanceof File||typeof Blob<`u`&&e instanceof Blob;if(n(t.file)||n(t.blob))return!0;let r=t.files;if(Array.isArray(r)&&r.some(e=>n(e)))return!0;let i=t.attachments;if(Array.isArray(i))for(let e of i){if(!e||typeof e!=`object`)continue;let t=e.data;if(n(t))return!0}return!1}function Ot(e){if(!e||typeof e!=`object`)return!1;let t=e;if(Dt(t))return!0;let n=t.data;if(n&&typeof n==`object`&&Dt(n))return!0;let r=t.attachments;if(Array.isArray(r))for(let e of r){if(!e||typeof e!=`object`)continue;let t=e.data;if(typeof File<`u`&&t instanceof File||typeof Blob<`u`&&t instanceof Blob)return!0}return!1}function kt(e,t){return Vt.has(String(t||``).toLowerCase())?Ot(e):!1}function At(e,t){return!Ht.has(String(t||``).toLowerCase())}async function jt(){await new Promise(e=>requestAnimationFrame(()=>e())),await new Promise(e=>queueMicrotask(e))}async function Mt(){await new Promise(e=>requestAnimationFrame(()=>requestAnimationFrame(e))),await new Promise(e=>queueMicrotask(e))}async function Nt(){await jt()}async function Pt(e,t=Ut){let n=Et(e);if(!n||n.isConnected)return;let r=typeof document<`u`&&document.documentElement instanceof HTMLElement?document.documentElement:null;r&&await new Promise(e=>{let i=!1,a=()=>{if(!i){i=!0;try{o.disconnect()}catch{}clearTimeout(s),e()}},o=new MutationObserver(()=>{n.isConnected&&a()});o.observe(r,{childList:!0,subtree:!0});let s=setTimeout(a,t)})}function Ft(e){for(let t of qt)try{if(e.querySelector(t)||e.shadowRoot?.querySelector(t))return!0}catch{}return!1}function It(e,t){let n=String(e||``).toLowerCase();return n===`content-load`||n===`markdown-content`||n===`content-view`||kt(t,e)}async function Lt(e,t=Wt){let n=Et(e);n&&(Ft(n)||await new Promise(e=>{let r=!1,i=[],a=()=>{if(!r){r=!0;for(let e of i)try{e.disconnect()}catch{}clearTimeout(c),e()}},o=()=>{Ft(n)&&a()},s=e=>{let t=new MutationObserver(o);t.observe(e,{childList:!0,subtree:!0}),i.push(t)};s(n),n.shadowRoot&&s(n.shadowRoot);let c=setTimeout(a,t);o()}))}async function Rt(e,t=Gt){let n=Et(e);if(n?.isConnected)try{let e=typeof n.getAnimations==`function`?n.getAnimations.bind(n):null,r=e?e({subtree:!0}).filter(e=>e.playState===`running`):[];if(r.length===0)return;await Promise.race([Promise.all(r.map(e=>typeof e?.finished?.then==`function`?e.finished.catch(()=>void 0):Promise.resolve())),new Promise(e=>setTimeout(e,t))])}catch{}}async function zt(e,t,n){let r=Et(e),i=It(n,t);if(r?.isConnected&&(!i||Ft(r))){await jt(),await Rt(e,Kt);return}await Mt(),await Pt(e,Ut),i&&await Lt(e,Wt),await Rt(e,Gt),await jt()}function Bt(e,t){let n=(Jt.get(e)??Promise.resolve()).then(()=>t()).catch(t=>{console.warn(`[ViewIngress] delivery failed:`,e?.id,t)});return Jt.set(e,n),n}var Vt,Ht,Ut,Wt,Gt,Kt,qt,Jt,Yt=e((()=>{Vt=new Set([`content-share`,`share-target-input`,`share-target-result`,`content-attach`,`file-attach`]),Ht=new Set([`settings-update`,`history-update`,`home-update`]),Ut=220,Wt=280,Gt=160,Kt=90,qt=[`[data-render-target]`,`[data-raw-target]`],Jt=new WeakMap}));function Xt(e){let t=e.data;return t&&typeof t==`object`&&!Array.isArray(t)?t:{}}function Zt(e){return typeof File<`u`&&e instanceof File||typeof Blob<`u`&&e instanceof Blob}function Qt(e){if(Zt(e.file)||Zt(e.blob))return!0;let t=e.files;return Array.isArray(t)&&t.some(e=>Zt(e))||String(e.path??e.into??``).trim().length>0||String(e.text??e.content??``).trim().length>0?!0:String(e.url??``).trim().length>0}function $t(e,t){let n=String(t||``).toLowerCase();if(!an.has(n))return{ok:!0};let r=Xt(e);if(!Qt(r))return{ok:!1,reason:`missing-body-carrier`};let i=r.file;if(typeof File<`u`&&i instanceof File&&i.size>rn)return{ok:!1,reason:`file-too-large>${rn}`};if(Array.isArray(r.files)){for(let e of r.files)if(typeof File<`u`&&e instanceof File&&e.size>rn)return{ok:!1,reason:`files-array-too-large>${rn}`}}return{ok:!0}}function en(e){if(!e||e.length===0)return!1;let t=Math.min(e.length,16384),n=0,r=0;for(let i=0;i<t;i++){let t=e.charCodeAt(i);t===0&&n++,t<32&&t!==9&&t!==10&&t!==13&&r++}if(n>2||r/t>.02&&e.length<64*1024)return!0;let i=e.slice(0,512).trimStart();return!!(i.startsWith(`%PDF`)||i.startsWith(`PK`))}function tn(e,t){let n=e.filter(e=>e instanceof File);if(n.length===0)return null;let r=(t.hintFilename||``).trim().toLowerCase();if(r){let e=n.find(e=>String(e.name||``).trim().toLowerCase()===r);if(e)return e;let t=n.find(e=>String(e.name||``).trim().toLowerCase().endsWith(r));if(t)return t}return n.find(e=>t.isTextLike(e))||(n.find(e=>/\.(md|markdown|mdown|mkdn|mkd)(?:$|\?)/i.test(e.name||``))??n[0]??null)}function nn(e){return e instanceof File?e.size>rn?{ok:!1,reason:`file-too-large`}:{ok:!0}:{ok:!1,reason:`not-a-file`}}var rn,an,on=e((()=>{rn=48*1024*1024,an=new Set([`content-load`,`content-view`,`markdown-content`,`content-share`,`content-attach`,`file-attach`].map(e=>e.toLowerCase()))})),sn,cn,ln,un,dn,fn,pn,mn,hn,gn,_n=e((()=>{E(),sn=`share-target-data`,cn=`/share-target-data`,ln=`/share-target-files`,un=`/share-target-file/`,dn=()=>typeof globalThis<`u`&&`caches`in globalThis,fn=async e=>{if(!dn())return!1;let t=Array.isArray(e.files)?e.files:[],n=e.meta??{};try{let e=await caches.open(sn),r=Number(n?.timestamp)||Date.now();await e.put(cn,new Response(JSON.stringify({...n,title:n?.title,text:n?.text,url:n?.url,sharedUrl:n?.sharedUrl,source:n?.source||`share-target`,route:n?.route||n?.source||`share-target`,timestamp:r,fileCount:t.length,imageCount:t.filter(e=>(e?.type||``).toLowerCase().startsWith(`image/`)).length}),{headers:{"Content-Type":`application/json`}}));let i=[];for(let n=0;n<t.length;n++){let a=t[n],o=`${un}${r}-${n}`,s=new Headers;s.set(`Content-Type`,a.type||`application/octet-stream`),s.set(`X-File-Name`,encodeURIComponent(a.name||`file-${n}`)),s.set(`X-File-Size`,String(a.size||0)),s.set(`X-File-LastModified`,String(a.lastModified??0)),await e.put(o,new Response(a,{headers:s})),i.push({key:o,name:a.name||`file-${n}`,type:a.type||`application/octet-stream`,size:a.size||0,lastModified:a.lastModified??void 0})}return await e.put(ln,new Response(JSON.stringify({files:i,timestamp:r}),{headers:{"Content-Type":`application/json`}})),!0}catch(e){return console.warn(`[ShareTargetGateway] Failed to store payload to cache:`,e),!1}},pn=async(e={})=>{let t=e.clear!==!1;if(!dn())return null;try{let e=await caches.open(sn),n=await e.match(cn),r=await e.match(ln);if(!n&&!r)return null;let i=n?await n.json().catch(()=>null):null,a=r?await r.json().catch(()=>null):null,o=Array.isArray(a?.files)?a.files:[],s=[];for(let t of o){let n=typeof t?.key==`string`?t.key.trim():String(t?.key??``).trim();if(!n)continue;let r=await e.match(n);if(!r)continue;let i=await r.blob();s.push(new File([i],t.name||`shared-file`,{type:t.type||i.type||`application/octet-stream`,lastModified:Number(t.lastModified)||Date.now()}))}if(t){await e.delete(cn).catch(()=>{}),await e.delete(ln).catch(()=>{});for(let t of o)t?.key&&await e.delete(t.key).catch(()=>{})}return{meta:i||{},files:s,fileMeta:o}}catch(e){return console.warn(`[ShareTargetGateway] Failed to consume cached payload:`,e),null}},mn=e=>{let t=e?.meta||{},n=Array.isArray(e?.files)?e.files:[],r=Array.isArray(e?.fileMeta)?e.fileMeta:[],i=typeof r[0]?.name==`string`&&r[0].name.trim().length>0?r[0].name.trim():void 0,a=t.hint,o=a&&typeof a==`object`&&!Array.isArray(a)?{...a}:{},s=Object.keys(o).length>0?{...o}:void 0;i&&!n.length&&(typeof o.filename==`string`&&String(o.filename).trim()||(s={...s||o,filename:i}));let c={...t,title:typeof t.title==`string`?t.title:void 0,text:typeof t.text==`string`?t.text:void 0,url:typeof t.url==`string`?t.url:void 0,sharedUrl:typeof t.sharedUrl==`string`?t.sharedUrl:void 0,source:typeof t.source==`string`?t.source:`share-target`,route:typeof t.route==`string`?t.route:typeof t.source==`string`?t.source:`share-target`,timestamp:Number(t.timestamp||Date.now()),files:n,fileCount:n.length||Number(t.fileCount||0),imageCount:Number(t.imageCount||n.filter(e=>(e?.type||``).toLowerCase().startsWith(`image/`)).length)};return s!==void 0&&(c.hint=s),c},hn=async()=>{try{let e=await fetch(S.SW_CONTENT_AVAILABLE);if(!e.ok)return[];let t=await e.json(),n=Array.isArray(t?.cacheKeys)?t.cacheKeys:[],r=[];for(let e of n){let t=String(e?.key||``);if(t)try{let n=await fetch(`${S.SW_CONTENT}/${t}`);if(!n.ok)continue;r.push({key:t,context:String(e?.context||``),content:await n.json()})}catch(e){console.warn(`[ShareTargetGateway] Failed to fetch SW cache item:`,e)}}return r}catch(e){return console.warn(`[ShareTargetGateway] Failed to fetch SW cache entries:`,e),[]}},gn=async(e=`latest`)=>{try{let t=await fetch(`/share-target-files?cacheKey=${encodeURIComponent(e)}`);if(!t.ok)return[];let n=await t.json(),r=Array.isArray(n?.files)?n.files:[],i=[];for(let e of r){let t=typeof e?.key==`string`?e.key:``;if(t)try{let n=await fetch(t);if(!n.ok)continue;let r=await n.blob();i.push(new File([r],e.name||`shared-file`,{type:e.type||r.type||`application/octet-stream`}))}catch(e){console.warn(`[ShareTargetGateway] Failed to fetch file from cache:`,e)}}return i}catch(e){return console.warn(`[ShareTargetGateway] Failed to fetch cached share files:`,e),[]}}}));function vn(e,t){return typeof t!=`number`||!Number.isFinite(t)?!1:(N.get(e)??0)!==t}function yn(e,t){let n=e.metadata&&typeof e.metadata==`object`&&!Array.isArray(e.metadata)?e.metadata:{};return{...e,metadata:{...n,[wn]:t}}}function bn(e,t={}){if(!e.handleMessage)return()=>{};let n=t.destination||bt(String(e.id||``)),r=t.componentId||`view:${e.id}`,i=te(n),a={canHandle:e=>ne(e.destination,n),handle:async t=>{await En(e,t)}},o=new Set;for(let e of i){let t=`${r}:${e}`;ae(t,e),se(e,a);let n=le(t);if(n.length>0)for(let e of n)o.has(e.id)||(o.add(e.id),a.handle(e))}let s=wt(b(n),t=>{let r=t.data;if(!(!r||typeof r!=`object`)){if(r.type===`view-transfer`&&r.message&&typeof r.message==`object`){En(e,re(r.message));return}if(r.type===`view-post`){let t=b(r.viewId);if(t!==b(String(e.id||n)))return;let i={id:typeof r.id==`string`?String(r.id):crypto.randomUUID(),type:`view-post`,destination:t,source:`view-channel`,data:{bodyText:String(r.bodyText||``),contentType:String(r.contentType||``),viewId:t},metadata:{source:`view-channel`,destination:t}},a=xn(e);Bt(e,async()=>{N.get(e)===a&&(At(i,`view-post`)&&await zt(e,i,`view-post`),N.get(e)===a&&await e.handleMessage?.(yn({type:`view-post`,data:{bodyText:String(r.bodyText||``),contentType:String(r.contentType||``),viewId:t},metadata:i.metadata},a)))})}}});return()=>{for(let e of i)ce(e,a);s()}}var N,xn,Sn,Cn,wn,Tn,En,Dn=e((()=>{Ct(),Tt(),Yt(),on(),vt(),E(),_n(),ie(),w(),N=new WeakMap,xn=e=>{let t=(N.get(e)??0)+1;return N.set(e,t),t},Sn=new Map,Cn=600,wn=`__ingressStamp`,Tn=e=>{for(let[t,n]of Sn)e-n>Cn&&Sn.delete(t)},En=async(e,t)=>{let n=typeof t.id==`string`?t.id.trim():``;if(n){let t=b(bt(String(e.id||``))),r=Date.now();Tn(r);let i=`${t}::${n}`,a=Sn.get(i);if(a!==void 0&&r-a<Cn)return;Sn.set(i,r)}let r=St(e,t);if(!r)return;let i=$t(t,r.type);if(!i.ok){console.warn(`[ViewIngress] Skipped malformed envelope:`,i.reason,r.type);return}let a=xn(e);await Bt(e,async()=>{N.get(e)===a&&(At(t,r.type)&&await zt(e,t,r.type),N.get(e)===a&&await e.handleMessage?.(yn(r,a)))})}}));function On(e){if(!e||typeof e!=`object`)return!1;let t=e;return typeof t.handleMessage==`function`&&typeof t.id==`string`&&t.id.trim().length>0}function kn(e){if(!e?.trim())return null;try{let t=JSON.parse(e);return t&&typeof t==`object`?t:null}catch{return null}}function An(e){let t=x(String(e.destination??``))||String(e.destination??``).trim();return t?{id:typeof e.id==`string`?e.id:crypto.randomUUID(),type:String(e.type||`content-share`),source:typeof e.source==`string`?e.source:`dom-staged-unified`,destination:t,contentType:typeof e.contentType==`string`?e.contentType:void 0,data:e.data??e.payload??{},metadata:{timestamp:Date.now(),...typeof e.metadata==`object`&&e.metadata?e.metadata:{}}}:null}function jn(e){let t=e.getAttribute(`data-cw-unified-defer-flush`);if(!t?.trim())return null;let n=t.trim();if(n.startsWith(`{`)){let e=kn(n)?.destination;return typeof e==`string`?e:null}return n}function Mn(e){let t=jn(e);t&&(de(x(t)||b(t)).catch(()=>void 0),e.removeAttribute(`data-cw-unified-defer-flush`))}function Nn(e){let t=kn(e.getAttribute(`data-cw-unified-pending`));if(!t)return;let n=An(t);n?.destination&&(ue(n.destination,n),e.removeAttribute(`data-cw-unified-pending`))}function Pn(e){let t=kn(e.getAttribute(`data-cw-unified-mail`));if(!t)return;let n=x(String(t.destination||``))||String(t.destination||``).trim();n&&(oe({type:String(t.type||`dispatch`),destination:n,source:typeof t.source==`string`?t.source:`dom-staged-mail`,data:t.data??t.payload??{},contentType:typeof t.contentType==`string`?t.contentType:void 0,metadata:typeof t.metadata==`object`&&t.metadata?t.metadata:{},purpose:Array.isArray(t.purpose)?t.purpose:typeof t.purpose==`string`?[t.purpose]:[`mail`,`deliver`],op:typeof t.op==`string`?t.op:`deliver`,protocol:typeof t.protocol==`string`?t.protocol:void 0}).catch(()=>void 0),e.removeAttribute(`data-cw-unified-mail`))}function Fn(e){let t=new Set;e.matches(`[data-cw-unified-pending], [data-cw-unified-mail], [data-cw-unified-defer-flush]`)&&t.add(e);for(let n of e.querySelectorAll(Un))t.add(n);for(let e of t)e.isConnected&&(Mn(e),Nn(e),Pn(e))}function In(e,t){let n=t||bt(String(e.id||``)),r=te(n),i=new Set;for(let e of[n,...r]){let t=x(e)||String(e||``).trim();t&&i.add(b(t))}(async()=>{for(let e of i)try{await de(e)}catch{}})()}function Ln(e,t,n){let r=!1;return()=>{r||(r=!0,n(),Wn.delete(e),Gn.get(t)===e&&Gn.delete(t))}}function Rn(e,t={}){if(!e.handleMessage)return()=>{};let n=Wn.get(e);if(n)return n;let r=t.destination||bt(String(e.id||``)),i=b(r),a=Gn.get(i);a&&a!==e&&Wn.get(a)?.();let o=bn(e,{...t,destination:r});In(e,r);let s=Ln(e,i,o);return Wn.set(e,s),Gn.set(i,e),s}function zn(e){Wn.get(e)?.()}function Bn(e,t){let n=[e];for(;n.length;){let e=n.pop();if(e.nodeType===Node.ELEMENT_NODE){let r=e;t(r);let i=r.shadowRoot;if(i)for(let e=i.childNodes.length-1;e>=0;e--)n.push(i.childNodes[e]);for(let e=r.childNodes.length-1;e>=0;e--)n.push(r.childNodes[e])}}}function Vn(e,t,n){t.has(n)||(t.add(n),e.observe(n,{childList:!0,subtree:!0}))}function Hn(e={}){let t=e.root instanceof Document?e.root.documentElement:e.root??document.documentElement;if(!t||typeof MutationObserver>`u`)return()=>{};let n=new WeakSet,r=()=>{},i=e=>{Bn(e,e=>{On(e)&&(e.isConnected||zn(e))})},a=new MutationObserver(e=>{for(let t of e)t.addedNodes.forEach(r),t.removedNodes.forEach(i)});return r=e=>{if(e.nodeType===Node.ELEMENT_NODE){let t=e;t.isConnected&&Fn(t)}Bn(e,e=>{e.shadowRoot&&Vn(a,n,e.shadowRoot),!(!e.isConnected||!On(e))&&Rn(e)})},Vn(a,n,t),r(t),()=>{a.disconnect(),Bn(t,e=>{On(e)&&zn(e)})}}var Un,Wn,Gn,Kn=e((()=>{E(),ie(),Dn(),Ct(),Un=`[data-cw-unified-pending], [data-cw-unified-mail], [data-cw-unified-defer-flush]`,Wn=new WeakMap,Gn=new Map})),qn,Jn,Yn,Xn,Zn,Qn,$n,er,tr,nr,rr,ir,ar,or,sr,cr,lr,ur,dr,fr,pr,mr=e((()=>{qn=`viewer`,Jn=`editor`,Yn=`workcenter`,Xn=`explorer`,Zn=`settings`,Qn=`history`,$n=`home`,er=`print`,tr=`airpad`,nr=`network`,rr=`viewer`,ir={network:nr,airpad:tr,settings:Zn,viewer:qn,editor:Jn,workcenter:Yn,explorer:Xn,history:Qn,home:$n,print:er},ar=()=>{let e=``;try{let t=globalThis?.location?.search;if(t){let n=new URLSearchParams(t);e=String(n.get(`views`)||n.get(`enabledViews`)||``)}}catch{}if(!e)try{e=String(globalThis?.localStorage?.getItem?.(`rs-enabled-views`)??``)}catch{}if(!e)try{e=`minimal,network,settings`}catch{}if(!e)try{e=String({}.VITE_ENABLED_VIEWS??``)}catch{}let t=e.split(/[\s,;]+/).map(e=>e.trim().toLowerCase()).filter(Boolean);if(!t.length)return null;t.push(`settings`);try{let e=globalThis?.location?.search;e&&new URLSearchParams(e).get(`views`)&&globalThis?.localStorage?.setItem?.(`rs-enabled-views`,Array.from(new Set(t)).join(`,`))}catch{}return new Set(t)},or=ar(),sr={viewer:!1,editor:!1,workcenter:!1,explorer:!1,settings:!0,history:!1,home:!1,print:!1,airpad:!1,network:!0},cr=e=>sr[String(e).toLowerCase()]!==!1,lr=e=>!or||or.has(String(e).toLowerCase()),ur=e=>cr(e)&&lr(e),dr=Object.entries(ir).filter(([e,t])=>!!t&&ur(e)).map(([e])=>e),fr=e=>!!ir[e]&&ur(e),pr=(e=rr,t=rr)=>fr(e)?e:fr(t)?t:dr.length>0?dr[0]:`viewer`}));function hr(e){if(e instanceof HTMLElement)return e;let t=e;if(t&&typeof t.render==`function`&&typeof t.id==`string`)return t;throw Error(`View factory must return an HTMLElement or a legacy view with render() and id`)}function gr(){br.register({id:`immersive`,name:`Immersive`,description:"Chromeless immersive shell (standalone pages, extensions, embedded); legacy boot id `base` aliases here.",loader:()=>_(()=>import(`./_cwsp-disabled-entry_shell-immersive-CZayJgAL.js`),[],import.meta.url)}),br.register({id:`minimal`,name:`Minimal`,description:`Minimal toolbar-based navigation`,loader:()=>_(()=>import(`./preview-FhFnSKeB.js`),[],import.meta.url)}),br.register({id:`content`,name:`Content`,description:`CRX content shell with overlay-focused layering`,loader:()=>_(()=>import(`./_cwsp-disabled-entry_shell-content-Cb9BwHbt.js`),[],import.meta.url)}),br.register({id:`immersive`,name:`Immersive`,description:`Chromeless immersive host (extensions / embedded)`,loader:()=>_(()=>import(`./_cwsp-disabled-entry_shell-immersive-CZayJgAL.js`),[],import.meta.url)})}function _r(){P.register({id:`viewer`,name:`Viewer`,icon:`eye`,loader:()=>_(()=>import(`./_cwsp-disabled-entry_view-viewer-CeLlddQ8.js`),[],import.meta.url)}),P.register({id:`workcenter`,name:`Work Center`,icon:`lightning`,loader:()=>_(()=>import(`./_cwsp-disabled-entry_view-workcenter-DV1PlEAR.js`),[],import.meta.url)}),P.register({id:`settings`,name:`Settings`,icon:`gear`,loader:()=>_(()=>import(`./src-Cpd2sYma.js`),[],import.meta.url)}),P.register({id:`airpad`,name:`AirPad`,icon:`hand-pointing`,loader:()=>_(()=>import(`./_cwsp-disabled-entry_view-airpad-moeIfx22.js`),[],import.meta.url)}),P.register({id:`network`,name:`Network`,icon:`wifi-high`,loader:()=>_(()=>import(`./src-DR5D7PqX.js`),[],import.meta.url)}),P.register({id:`history`,name:`History`,icon:`clock-counter-clockwise`,loader:()=>_(()=>import(`./_cwsp-disabled-entry_view-history-Cj5aZTmP.js`),[],import.meta.url)}),P.register({id:`explorer`,name:`Explorer`,icon:`folder`,loader:()=>_(()=>import(`./_cwsp-disabled-entry_view-explorer-D-8MVImu.js`),[],import.meta.url)}),P.register({id:`editor`,name:`Editor`,icon:`pencil`,loader:()=>_(()=>import(`./_cwsp-disabled-entry_view-editor-BtWewwh9.js`),[],import.meta.url)}),P.register({id:`home`,name:`Home`,icon:`house`,loader:()=>_(()=>import(`./_cwsp-disabled-entry_view-home-gqgAY_Ff.js`),[],import.meta.url)}),P.register({id:`print`,name:`Print`,icon:`printer`,loader:()=>_(()=>import(`./_cwsp-disabled-entry_view-viewer-CeLlddQ8.js`),[],import.meta.url)})}function vr(){gr(),_r()}var yr,br,xr,P,Sr,Cr,wr,Tr=e((()=>{Kn(),mr(),ee(),yr=class{shells=new Map;loadedShells=new Map;resolveShellRegistrationKey(e){return e===`base`?`immersive`:e}register(e){this.shells.set(e.id,e)}get(e){return this.shells.get(this.resolveShellRegistrationKey(e))}getAll(){return Array.from(this.shells.values())}async load(e,t){let n=this.resolveShellRegistrationKey(e),r=this.loadedShells.get(n);if(r)return r;let i=this.shells.get(n);if(!i)throw Error(`Shell not found: ${n}`);let a=await i.loader(),o=a.default||a.createShell;if(typeof o!=`function`)throw Error(`Invalid shell module: ${n}`);let s=o(t);return this.loadedShells.set(n,s),s}unload(e){let t=this.resolveShellRegistrationKey(e),n=this.loadedShells.get(t);n&&(n.unmount(),this.loadedShells.delete(t))}isLoaded(e){return this.loadedShells.has(this.resolveShellRegistrationKey(e))}getLoaded(e){return this.loadedShells.get(this.resolveShellRegistrationKey(e))}},br=new yr,xr=class e{static isCustomElementClassCtor(e){if(typeof e!=`function`)return!1;try{let t=e.prototype;return t!=null&&typeof HTMLElement<`u`&&HTMLElement.prototype.isPrototypeOf(t)}catch{return!1}}resolveViewFactory(t){let n=[t?.default,t?.createView,t?.createAirpadView,t?.createWorkCenterView,t?.createViewerView,t?.createExplorerView,t?.createSettingsView,t?.createNetworkView,t?.createHistoryView,t?.createHomeView];for(let t of n)if(typeof t==`function`){if(e.isCustomElementClassCtor(t)){let e=t;return(t=>new e(t))}return t}let r=Object.values(t||{});for(let e of r)if(typeof e==`function`&&e.prototype&&typeof e.prototype.render==`function`){let t=e;return e=>new t(e)}return null}views=new Map;loadedViews=new Map;viewReceiveCleanup=new Map;register(e){this.views.set(e.id,e)}get(e){return this.views.get(e)}getAll(){return Array.from(this.views.values())}async load(e,t){let n=this.loadedViews.get(e);if(n)return n;let r=this.views.get(e);if(!r)throw Error(`View not found: ${e}`);let i=await r.loader(),a=this.resolveViewFactory(i);if(!a)throw Error(`Invalid view module: ${e}`);let o=hr(await a(t)),s=this.viewReceiveCleanup.get(e);return s&&(s(),this.viewReceiveCleanup.delete(e)),this.loadedViews.set(e,o),this.viewReceiveCleanup.set(e,Rn(o,{destination:String(e),componentId:`view:${e}`})),o}unload(e){let t=this.loadedViews.get(e);t?.lifecycle?.onUnmount&&t.lifecycle.onUnmount();let n=this.viewReceiveCleanup.get(e);n&&(n(),this.viewReceiveCleanup.delete(e)),this.loadedViews.delete(e)}isLoaded(e){return this.loadedViews.has(e)}getLoaded(e){return this.loadedViews.get(e)}prefetchModule(e){let t=this.views.get(e);t&&t.loader().catch(()=>{})}},P=new xr,Sr={id:`auto`,name:`Auto`,colorScheme:`auto`},Cr={id:`light`,name:`Light`,colorScheme:`light`},wr={id:`dark`,name:`Dark`,colorScheme:`dark`}}));function Er(){if(Or){console.debug(`[LayerManager] Already initialized`);return}if(typeof document>`u`){console.warn(`[LayerManager] No document available (SSR context?)`);return}let e=[...Dr].sort((e,t)=>e.order-t.order).map(e=>e.name),t=`@layer ${e.join(`, `)};`,n=document.createElement(`style`);n.id=`css-layer-init`,n.setAttribute(`data-layer-manager`,`true`),n.textContent=t;let r=document.head;r.insertBefore(n,r.firstChild),kr=n,Or=!0,console.log(`[LayerManager] Initialized ${e.length} layers`)}var Dr,Or,kr,Ar=e((()=>{Dr=[{name:`ux-normalize`,category:`system`,order:0,description:`Veela normalize layer`},{name:`layer.reset`,category:`system`,order:0,description:`CSS reset rules`},{name:`layer.normalize`,category:`system`,order:10,description:`Normalize browser defaults`},{name:`tokens`,category:`system`,order:20,description:`Legacy tokens layer`},{name:`ux-tokens`,category:`system`,order:20,description:`Veela token layer`},{name:`layer.tokens`,category:`system`,order:20,description:`CSS custom properties (variables)`},{name:`base`,category:`system`,order:30,description:`Legacy base layer`},{name:`ux-base`,category:`system`,order:30,description:`Veela base layer`},{name:`layout`,category:`system`,order:40,description:`Legacy layout layer`},{name:`ux-layout`,category:`system`,order:40,description:`Veela layout layer`},{name:`components`,category:`system`,order:50,description:`Legacy components layer`},{name:`ux-components`,category:`system`,order:50,description:`Veela components layer`},{name:`utilities`,category:`system`,order:60,description:`Legacy utilities layer`},{name:`ux-utilities`,category:`system`,order:60,description:`Veela utilities layer`},{name:`ux-theme`,category:`system`,order:70,description:`Veela theme layer`},{name:`ux-overrides`,category:`system`,order:80,description:`Veela overrides layer`},{name:`layer.properties.shell`,category:`system`,order:30,description:`Shell context custom properties`},{name:`layer.properties.views`,category:`system`,order:35,description:`View context custom properties`},{name:`layer.runtime.base`,category:`runtime`,order:100,description:`Veela runtime base styles`},{name:`layer.runtime.components`,category:`runtime`,order:110,description:`Reusable component styles`},{name:`layer.runtime.forms`,category:`runtime`,order:115,description:`Form element base styles`},{name:`layer.runtime.utilities`,category:`runtime`,order:120,description:`Utility classes`},{name:`layer.runtime.animations`,category:`runtime`,order:130,description:`Keyframes and animation definitions`},{name:`layer.boot`,category:`runtime`,order:140,description:`Boot/choice screen styles`},{name:`boot.tokens`,category:`runtime`,order:142,description:`Boot tokens layer`},{name:`boot.base`,category:`runtime`,order:144,description:`Boot base layer`},{name:`boot.components`,category:`runtime`,order:146,description:`Boot components layer`},{name:`boot.responsive`,category:`runtime`,order:148,description:`Boot responsive adjustments`},{name:`layer.shell.common`,category:`shell`,order:200,description:`Shared shell styles`},{name:`shell.tokens`,category:`shell`,order:202,description:`Legacy shell tokens`},{name:`shell.base`,category:`shell`,order:204,description:`Legacy shell base`},{name:`shell.components`,category:`shell`,order:206,description:`Legacy shell components`},{name:`shell.utilities`,category:`shell`,order:208,description:`Legacy shell utilities`},{name:`shell.overrides`,category:`shell`,order:209,description:`Legacy shell overrides`},{name:`layer.shell.raw`,category:`shell`,order:210,description:`Raw shell (minimal)`},{name:`layer.shell.minimal`,category:`shell`,order:220,description:`Minimal shell (toolbar navigation)`},{name:`layer.shell.minimal.layout`,category:`shell`,order:222,description:`Minimal shell layout rules`},{name:`layer.shell.minimal.components`,category:`shell`,order:224,description:`Minimal shell component styles`},{name:`layer.shell.window`,category:`shell`,order:226,description:`Window shell (desktop/process frames)`},{name:`layer.shell.faint`,category:`shell`,order:230,description:`Faint shell (tabbed sidebar)`},{name:`layer.shell.faint.layout`,category:`shell`,order:232,description:`Faint shell layout`},{name:`layer.shell.faint.sidebar`,category:`shell`,order:234,description:`Faint shell sidebar`},{name:`layer.shell.faint.toolbar`,category:`shell`,order:236,description:`Faint shell toolbar`},{name:`layer.shell.faint.forms`,category:`shell`,order:238,description:`Faint shell form components`},{name:`layer.view.common`,category:`view`,order:300,description:`Shared view styles`},{name:`layer.view.viewer`,category:`view`,order:310,description:`Markdown viewer`},{name:`layer.view.workcenter`,category:`view`,order:320,description:`Work center (AI prompts)`},{name:`layer.view.workcenter.keyframes`,category:`view`,order:322,description:`Work center animations`},{name:`view.workcenter`,category:`view`,order:324,description:`Work center styles (legacy name)`},{name:`view.workcenter.animations`,category:`view`,order:326,description:`Work center animations (legacy name)`},{name:`layer.view.settings`,category:`view`,order:330,description:`Settings view`},{name:`layer.view.explorer`,category:`view`,order:340,description:`File explorer`},{name:`layer.view.history`,category:`view`,order:350,description:`History view`},{name:`layer.view.editor`,category:`view`,order:360,description:`Editor view`},{name:`layer.view.editor.markdown`,category:`view`,order:362,description:`Markdown editor sublayer`},{name:`layer.view.editor.quill`,category:`view`,order:364,description:`Quill editor sublayer`},{name:`layer.view.home`,category:`view`,order:380,description:`Home/landing view`},{name:`layer.view.print`,category:`view`,order:390,description:`Print view`},{name:`view-explorer`,category:`view`,order:392,description:`Explorer legacy layered scope`},{name:`view-transitions`,category:`override`,order:850,description:`View Transition API named targets and keyframes`},{name:`layer.override.theme`,category:`override`,order:900,description:`Theme customizations`},{name:`layer.override.print`,category:`override`,order:910,description:`Print media styles`},{name:`layer.override.a11y`,category:`override`,order:920,description:`Accessibility enhancements`}],Or=!1})),jr=e((()=>{})),Mr,Nr,Pr,Fr,Ir=e((()=>{Mr=()=>globalThis?.location,Nr=()=>Mr()?.origin,Pr=(e,t)=>{let n=e?.trim?.()||``;if(!n)return!1;let r=t??Nr();if(typeof URL?.canParse==`function`)return URL.canParse(n,r);try{return new URL(n,r),!0}catch{return!1}},Fr=e=>{if(typeof globalThis?.requestAnimationFrame==`function`){globalThis.requestAnimationFrame(e);return}globalThis.setTimeout(e,0)}})),Lr=e((()=>{d()})),Rr,zr,Br,Vr,Hr,Ur,Wr,Gr,Kr,qr,Jr,Yr,Xr,Zr,Qr,$r,ei,ti,ni,ri,ii,ai,oi,si,ci,li,ui,di,fi,pi,mi,hi,gi,_i,vi,yi,bi,xi,Si=e((()=>{i(),d(),l(),Lr(),Ir(),Rr=`cw::workspace::speed-dial`,zr=`${Rr}::meta`,Br=e=>typeof structuredClone==`function`?structuredClone(u(e)):r.parse(r.stringify(e)),Vr=()=>typeof crypto<`u`&&typeof crypto.randomUUID==`function`?crypto.randomUUID():`sd-${Date.now().toString(36)}-${Math.floor(Math.random()*1e3)}`,Hr=[{id:`shortcut-docs`,cell:s([0,1]),icon:`book-open-text`,label:`Docs`,action:`open-link`,meta:{href:`https://github.com/fest-live`,description:`Project documentation`}},{id:`shortcut-roadmap`,cell:s([1,1]),icon:`signpost`,label:`Roadmap`,action:`open-link`,meta:{href:`https://github.com/u2re-space/unite-2.man`,description:`Manifest notes`}},{id:`shortcut-fest-live`,cell:s([2,1]),icon:`github-logo`,label:`Fest Live`,action:`open-link`,meta:{href:`https://github.com/fest-live`,description:`Fest Live Organization`}},{id:`shortcut-l2ne-dev`,cell:s([3,1]),icon:`user`,label:`L2NE Dev`,action:`open-link`,meta:{href:`https://github.com/L2NE-dev`,description:`L2NE Developer Profile`}},{id:`shortcut-u2re-space`,cell:s([0,2]),icon:`planet`,label:`U2RE Space`,action:`open-link`,meta:{href:`https://github.com/u2re-space/`,description:`U2RE Space Organization`}},{id:`shortcut-telegram`,cell:s([1,2]),icon:`telegram-logo`,label:`Telegram`,action:`open-link`,meta:{href:`https://t.me/u2re_space`,description:`U2RE Space Telegram`}}],Ur=[{id:`shortcut-explorer`,cell:s([2,0]),icon:`books`,label:`Explorer`,action:`open-view`,meta:{view:`explorer`}},{id:`shortcut-settings`,cell:s([3,0]),icon:`gear-six`,label:`Settings`,action:`open-view`,meta:{view:`settings`}},...Hr],Wr=e=>{let t=[],n=[];return e.forEach(e=>{let{meta:r,...i}=e;t.push(i);let a={action:e.action,...r||{}};n.push([e.id,a])}),{records:t,metaEntries:n}},{records:Gr,metaEntries:Kr}=Wr(Ur),qr=[],Jr=e=>e&&Array.isArray(e)&&e.length>=2?s([Number(e[0])||0,Number(e[1])||0]):s([0,0]),Yr=(e={})=>n(s({action:e.action||`open-view`,view:e.view||``,href:e.href||``,description:e.description||``,entityType:e.entityType||``,tags:Array.isArray(e.tags)?[...e.tags]:[],...e})),Xr=e=>{let t=new Map;for(let[n,r]of e)t.set(n,Yr(r));return t},Zr=e=>e?e instanceof Map?Array.from(e.entries()):Array.isArray(e)?e.map(e=>e&&typeof e==`object`&&`id`in e?[e.id,e.meta||e]:null).filter(Boolean):typeof e==`object`?Object.entries(e):[]:[],Qr=e=>{let t={};return e?.forEach((e,n)=>{t[n]=Br(e??{})}),t},$r=()=>Xr(Kr),ei=e=>{let t=Zr(e);return Xr(t.length?t:Kr)},ti=(e,t)=>e&&typeof e==`object`&&`value`in e?e.value??t:e??t,ni=e=>({id:e.id,cell:s([e.cell?.[0]??0,e.cell?.[1]??0]),icon:ti(e.icon,`sparkle`),label:ti(e.label,`Shortcut`),action:e.action}),ri=e=>s({id:e.id||Vr(),cell:s(Jr(e.cell)),icon:o(e.icon||`sparkle`),label:o(e.label||`Shortcut`),action:e.action||`open-view`}),ii=()=>s(Gr.map(ri)),ai=e=>s((Array.isArray(e)&&e.length?e:Ur).map(e=>{let{meta:t,...n}=e;return t?qr.push([e.id,{action:e.action,...t}]):qr.push([e.id,{action:e.action}]),n}).map(ri)),oi=e=>e.map(ni),si=f(zr,$r,ei,Qr),ci=f(Rr,ii,ai,oi),li=()=>ci?.$save?.(),ui=()=>si?.$save?.(),di=e=>e?si?.get?.(e)??null:null,fi=(e,t={})=>{let n=si?.get?.(e);return n||(n=Yr(t),si?.set?.(e,n),ui()),t?.action&&n.action!==t.action&&(n.action=t.action),n},pi=e=>{if(!e)return!1;let t=e.action||`open-view`,n=fi(e.id,{action:t});return n.action===t?!1:(n.action=t,!0)},mi=()=>{let e=!1;ci?.forEach?.(t=>{pi(t)&&(e=!0)}),e&&ui()},hi=()=>{qr.length&&(qr.forEach(([e,t])=>{let n=fi(e,t);Object.assign(n,t)}),qr.length=0,ui())},hi(),mi(),gi=()=>{let e=!1;Hr.forEach(t=>{if(ci?.find?.(e=>e?.id===t.id)){let n=di(t.id);t.meta&&n?(t.meta.href!==n.href&&(n.href=t.meta.href,e=!0),t.meta.description!==n.description&&(n.description=t.meta.description,e=!0)):t.meta&&!n&&(fi(t.id,t.meta),e=!0)}else{let n=ri(t);t.label&&n.label&&typeof n.label==`object`&&`value`in n.label&&(n.label.value=t.label),t.icon&&n.icon&&typeof n.icon==`object`&&`value`in n.icon&&(n.icon.value=t.icon),ci.push(s(n)),fi(n.id,t.meta),e=!0}}),e&&(li(),ui())},gi(),_i=`cw::workspace::wallpaper`,f(_i,()=>s({src:`/assets/wallpaper.jpg`,opacity:1,blur:0}),e=>s(e||{src:`/assets/wallpaper.jpg`,opacity:1,blur:0}),e=>({...e})),vi=`cw::workspace::grid-layout`,yi=f(vi,()=>s({columns:4,rows:8,shape:`square`}),e=>s(e||{columns:4,rows:8,shape:`square`}),e=>({...e})),bi=()=>yi?.$save?.(),xi=e=>{let t=e?.grid||yi,n=t?.columns??4,r=t?.rows??8,i=t?.shape??`square`;yi&&(yi.columns=n,yi.rows=r,yi.shape=i,bi()),!(typeof document>`u`)&&(document.querySelectorAll(`.speed-dial-grid`).forEach(e=>{let t=e;t.dataset.gridColumns=String(n),t.dataset.gridRows=String(r),t.dataset.gridShape=i}),document.documentElement.dataset.gridColumns=String(n),document.documentElement.dataset.gridRows=String(r),document.documentElement.dataset.gridShape=i)},typeof globalThis<`u`&&typeof document<`u`&&Fr(()=>xi())})),Ci=t({applyTheme:()=>Ai,cssBackgroundToOpaqueHex:()=>wi,initTheme:()=>Mi,resyncThemeAfterAdoptedViewSheet:()=>ji,samplePwaToolbarBackgroundColor:()=>Ti,syncBrowserChromeTheme:()=>ki}),wi,Ti,Ei,Di,Oi,ki,Ai,ji,Mi,Ni=e((()=>{ct(),Si(),wi=e=>{let t=e.trim();if(!t||t===`transparent`)return null;let n=t.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);if(n){let e=n[1];return e.length===3&&(e=e[0]+e[0]+e[1]+e[1]+e[2]+e[2]),`#${e.toLowerCase()}`}let r=t.match(/^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)(?:\s*,\s*([\d.]+))?\s*\)$/i);if(!r)return null;let i=r[4]===void 0?1:Number(r[4]);return!Number.isFinite(i)||i<.98?null:`#${[Math.max(0,Math.min(255,Math.round(Number(r[1])))),Math.max(0,Math.min(255,Math.round(Number(r[2])))),Math.max(0,Math.min(255,Math.round(Number(r[3]))))].map(e=>e.toString(16).padStart(2,`0`)).join(``)}`},Ti=()=>{if(typeof document>`u`)return null;let e=document.querySelectorAll(`[data-shell]`);for(let t of e){let e=t.shadowRoot;if(!e)continue;let n=e.querySelector(`.app-shell__nav, .app-shell__toolbar`);if(!n)continue;let r=getComputedStyle(n).backgroundColor,i=wi(r);if(i)return i}return null},Ei=e=>e===`dark`||e===`light`?e:globalThis.matchMedia?.(`(prefers-color-scheme: dark)`)?.matches?`dark`:`light`,Di=e=>{switch(e){case`small`:return`14px`;case`large`:return`18px`;default:return`16px`}},Oi=e=>{try{document.querySelectorAll(`[data-shell]`).forEach(t=>{let n=t;n.dataset.theme=e,n.style.colorScheme=e;let r=n.shadowRoot?.querySelector?.(`.app-shell`);r&&(r.dataset.theme=e,r.style.colorScheme=e)})}catch{}},ki=(e,t)=>{if(typeof document>`u`)return;let n=document.documentElement,r=t===`dark`?`dark`:t===`light`?`light`:`auto`;n.setAttribute(`data-scheme`,r),n.setAttribute(`data-theme`,e),n.style.colorScheme=e;try{let t=document.body;t&&(t.style.colorScheme=e)}catch{}try{document.querySelectorAll(`[data-shell='content']`).forEach(t=>{t.style.colorScheme=e})}catch{}if(globalThis?.__LURE_DYNAMIC_THEME_PRIORITY__!==!0){let t=()=>{if(globalThis?.__LURE_DYNAMIC_THEME_PRIORITY__===!0)return;let t=document.querySelector(`meta[name="theme-color"]`);if(!t)return;let n=Ti(),r=e===`dark`?`#0f1419`:`#007acc`;t.setAttribute(`content`,n??r)};t(),requestAnimationFrame(t)}Oi(e)},Ai=e=>{if(typeof document>`u`||!e)return;let t=document.documentElement,n=e.appearance?.theme||`auto`,r=Ei(n);ki(r,n),t.style.fontSize=Di(e.appearance?.fontSize),e.appearance?.color&&(document.body.style.setProperty(`--current`,e.appearance.color),document.body.style.setProperty(`--primary`,e.appearance.color),t.style.setProperty(`--current`,e.appearance.color),t.style.setProperty(`--primary`,e.appearance.color)),e.grid&&xi(e)},ji=()=>{if(typeof document>`u`)return;let e=async()=>{try{Ai(await A())}catch{}try{document.documentElement.offsetHeight}catch{}};(async()=>{await e(),queueMicrotask(()=>{e()}),requestAnimationFrame(()=>{e();try{document.documentElement.dispatchEvent(new CustomEvent(`u2-theme-change`,{bubbles:!0}))}catch{}requestAnimationFrame(()=>{e();let t=globalThis.requestIdleCallback;typeof t==`function`?t(()=>{e()},{timeout:200}):globalThis.setTimeout(()=>{e()},50)})})})()},Mi=async()=>{try{if(typeof document>`u`)return;let e=await A();Ai(e),globalThis.matchMedia?.(`(prefers-color-scheme: dark)`)?.addEventListener?.(`change`,async()=>{Ai(await A())})}catch(e){console.warn(`Failed to init theme`,e)}}})),Pi=e((()=>{})),Fi=e((()=>{jr(),Ir(),Ni(),Pi()})),Ii,Li=e((()=>{Ii=`@function --hsv(--src-color <color>) returns <color> {
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
}`})),Ri,zi=e((()=>{Ri=`@function --hsv(--src-color <color>) returns <color> {
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
}`}));async function Bi(e){if(Vi===e)return;console.log(`[Veela] Loading variant:`,e);let t=async e=>{typeof e==`string`&&e.length&&await a(e)};if(e===`core`){await t(Ii),Vi=e;return}await t(Ri),Vi=e}var Vi,Hi=e((()=>{c(),Li(),zi(),Vi=null}));async function Ui(e){let t=Wi[e]||Wi[`vl-basic`];if(!t)throw Error(`Unknown style system: ${e}`);if(Gi===e){console.log(`[Styles] Style system '${e}' already loaded`);return}console.log(`[Styles] Loading style system: ${t.name}`),t.initFn&&await t.initFn(),Gi=e,console.log(`[Styles] Style system ${t.name} loaded`)}var Wi,Gi,Ki=e((()=>{Hi(),Wi={"vl-advanced":{id:`vl-advanced`,name:`Veela Advanced`,description:`Full-featured CSS framework with design tokens and effects`,variant:`advanced`,initFn:async()=>{try{await Bi(`advanced`),console.log(`[Styles] Veela Advanced loaded`)}catch{}}},"vl-basic":{id:`vl-basic`,name:`Veela Basic Styles`,description:`Lightweight minimal styling for basic functionality`,variant:`basic`,initFn:async()=>{try{await Bi(`basic`),console.log(`[Styles] Veela Basic Styles loaded`)}catch(e){console.warn(`[Styles] Failed to load Veela Basic Styles:`,e)}}},"vl-beercss":{id:`vl-beercss`,name:`Veela BeerCSS`,description:`Beer CSS compatible styling with Material Design 3`,variant:`beercss`,initFn:async()=>{try{await Bi(`beercss`),console.log(`[Styles] Veela BeerCSS loaded`)}catch(e){console.warn(`[Styles] Failed to load Veela BeerCSS:`,e)}}},"vl-core":{id:`vl-core`,name:`Veela Core`,description:`Shared foundation styles for all veela variants`,variant:`core`,initFn:async()=>{try{await Bi(`core`),console.log(`[Styles] Veela Core loaded`)}catch(e){console.warn(`[Styles] Failed to load Veela Core:`,e)}}},raw:{id:`raw`,name:`Raw`,description:`No styling framework, browser defaults`,variant:`core`,initFn:async()=>{console.log(`[Styles] Raw mode - no styles loaded`)}}},Gi=null}));function qi(e,t,n){let r=new URL(e.includes(`://`)?e:`https://${e}`);r.protocol===`http:`?r.protocol=`ws:`:(r.protocol===`https:`||r.protocol!==`ws:`&&r.protocol!==`wss:`)&&(r.protocol=`wss:`),(!r.pathname||r.pathname===`/`||/^\/socket\.io\/?$/i.test(r.pathname))&&(r.pathname=`/ws`);for(let e of[`EIO`,`transport`,`sid`])r.searchParams.delete(e);return Yi(r,t),Yi(r,n),r.toString()}function Ji(e,t){return new Xi(e,t)}var Yi,Xi,Zi=e((()=>{Yi=(e,t)=>{if(!(!t||typeof t!=`object`))for(let[n,r]of Object.entries(t))!n||r==null||r===``||e.searchParams.set(n,String(r))},Xi=class{url;options;connected=!1;connecting=!1;id=``;ws=null;listeners=new Map;connectTimeout;constructor(e,t={}){this.url=e,this.options=t,this.connect()}connect(){try{let e=qi(this.url,this.options.query,this.options.auth);this.connecting=!0,this.ws=new WebSocket(e),this.ws.onopen=()=>{this.connected=!0,this.connecting=!1,this.connectTimeout&&clearTimeout(this.connectTimeout),this.emitLocal(`connect`)},this.ws.onclose=e=>{this.connected=!1,this.connecting=!1,this.connectTimeout&&clearTimeout(this.connectTimeout),this.emitLocal(`disconnect`,e.reason||`closed`),this.emitLocal(`close`,e.code,e.reason)},this.ws.onerror=e=>{this.connecting=!1,this.emitLocal(`connect_error`,Error(`WebSocket error`)),this.emitLocal(`error`,e)},this.ws.onmessage=e=>{if(e.data instanceof ArrayBuffer){this.emitLocal(`binary`,e.data);return}if(typeof Blob<`u`&&e.data instanceof Blob){e.data.arrayBuffer().then(e=>this.emitLocal(`binary`,e));return}try{let t=JSON.parse(String(e.data));t.event&&t.payload?this.emitLocal(t.event,t.payload):this.emitLocal(`data`,t)}catch{this.emitLocal(`data`,e.data)}},this.options.timeout&&(this.connectTimeout=setTimeout(()=>{this.connected||(this.connecting=!1,this.ws?.close(),this.emitLocal(`connect_error`,Error(`timeout`)))},this.options.timeout))}catch(e){this.connecting=!1,setTimeout(()=>this.emitLocal(`connect_error`,e),0)}}on(e,t){this.listeners.has(e)||this.listeners.set(e,new Set),this.listeners.get(e).add(t)}off(e,t){this.listeners.get(e)?.delete(t)}send(e){this.connected&&this.ws&&this.ws.send(typeof e==`string`?e:JSON.stringify(e))}sendBinary(e){!this.connected||!this.ws||this.ws.send(e)}emit(e,...t){this.send(t[0])}emitLocal(e,...t){let n=this.listeners.get(e);if(n)for(let e of n)e(...t)}removeAllListeners(){this.listeners.clear()}close(){this.connectTimeout&&clearTimeout(this.connectTimeout),this.ws&&=(this.ws.close(),null),this.connected=!1,this.connecting=!1}disconnect(){this.close()}}}));function Qi(e){let t=$i;if(!t)return null;try{return t.querySelector(`#${CSS.escape(e)}`)}catch{return null}}function F(e){let t=$i?.ownerDocument??(typeof document<`u`?document:null);if(!t){console.log(`[LOG]`,e);return}let n=t.createElement(`div`);n.textContent=`[${new Date().toLocaleTimeString()}] ${e}`;let r=ta();r&&(r.appendChild(n),r.scrollTop=r.scrollHeight),console.log(`[LOG]`,e)}var $i,ea,ta,na=e((()=>{$i=null,ea=()=>Qi(`wsStatus`),ta=()=>Qi(`logContainer`)}));async function ra(){let e=await oa();if(!e?.Clipboard?.read)return``;try{let t=(await e.Clipboard.read())?.value;if(typeof t==`string`&&t.trim())return t}catch{}return``}async function ia(e){let t=await oa();if(!t?.Clipboard?.write)return!1;try{return await t.Clipboard.write({string:String(e??``),label:`cwsp`}),!0}catch{return!1}}var aa,oa,sa=e((()=>{ee(),aa=[`@supernotes/capacitor-clipboard`,`@capacitor/clipboard`],oa=async()=>{try{if(globalThis.document===void 0)return null}catch{return null}for(let e of aa)try{return await _(()=>import(e),[],import.meta.url)}catch{}return null}})),ca=t({isCapacitorNativeShell:()=>I,openAppClipboardRelatedSettings:()=>ba,openNativeNotificationSettings:()=>ya,readClipboardTextFromDevice:()=>va,writeClipboardImageToDevice:()=>ha,writeClipboardTextToDevice:()=>_a});async function la(){let e=await Ca(`/service/clipboard?kind=text`);if(!e||e.ok===!1)return null;let t=typeof e.text==`string`&&e.text||typeof e.content==`string`&&e.content||typeof e.data==`string`&&e.data||``;return e.ok===!0||`text`in e||`data`in e?t:null}async function ua(e){let t=await Ca(`/service/clipboard`,{method:`POST`,body:JSON.stringify({kind:`text`,text:e,content:e,data:e})});return!!(t&&t.ok!==!1)}async function da(e,t,n){let r=await Ca(`/service/clipboard`,{method:`POST`,body:JSON.stringify({kind:`image`,mimeType:t,hash:n||void 0,imageBase64:e,asset:{mimeType:t,hash:n||void 0,data:e,source:`base64`}})});return!!(r&&r.ok!==!1)}async function fa(){if(!D())return``;try{let e=await O(`clipboard:read-local`,{});return wa(e)}catch{return``}}async function pa(e,t,n){if(!D())return!1;try{return!!(await O(`clipboard:write-local-image`,{mimeType:t,hash:n||``,data:e}))?.ok}catch{return!1}}async function ma(e){if(!D())return!1;try{return!!(await O(`clipboard:write-local`,{text:e}))?.ok}catch{return!1}}async function ha(e,t=`image/png`,n){let r=String(e??``).trim();if(!r)throw Error(`Clipboard image payload empty`);let i=String(t||`image/png`).trim()||`image/png`;if(Da()){for(let e=0;e<4;e++){if(await da(r,i,n))return;e+1<4&&await new Promise(t=>globalThis.setTimeout(t,120*(e+1)))}throw Error(`Desktop control clipboard image write failed`)}if(!await da(r,i,n)&&!await pa(r,i,n)){if(xa()&&globalThis.navigator?.clipboard?.write)try{let e=Ta(r);if(e?.length){let t=new Blob([e],{type:i}),n=i===`image/png`?t:await Ea(t);await globalThis.navigator.clipboard.write([new ClipboardItem({[n.type]:n})]);return}}catch{}throw Error(`Clipboard image write unavailable`)}}async function ga(e,t=4){for(let n=0;n<t;n++){if(await ua(e))return!0;n+1<t&&await new Promise(e=>globalThis.setTimeout(e,120*(n+1)))}return!1}async function _a(e){let t=String(e??``);if(Da()){if(await ga(t))return;throw Error(`Desktop control clipboard write failed`)}if(!await ua(t)&&!await ma(t)&&!(xa()&&await ia(t))){if(globalThis.navigator?.clipboard?.writeText){await globalThis.navigator.clipboard.writeText(t);return}throw Error(`Clipboard write unavailable`)}}async function va(){if(Da()){for(let e=0;e<4;e++){let t=await la();if(t!==null)return t;e+1<4&&await new Promise(t=>globalThis.setTimeout(t,120*(e+1)))}throw Error(`Desktop control clipboard read failed`)}let e=await la();if(e!==null)return e;let t=await fa();if(t)return t;if(xa()){let e=await ra();if(e)return e}if(globalThis.navigator?.clipboard?.readText)return String(await globalThis.navigator.clipboard.readText());throw Error(`Clipboard read unavailable`)}async function ya(){if(xa())try{let{NativeSettings:e,AndroidSettings:t,IOSSettings:n}=await _(async()=>{let{NativeSettings:e,AndroidSettings:t,IOSSettings:n}=await import(`capacitor-native-settings`);return{NativeSettings:e,AndroidSettings:t,IOSSettings:n}},[],import.meta.url);await e.open({optionAndroid:t.AppNotification,optionIOS:n.AppNotification})}catch{}}async function ba(){if(xa())try{let{NativeSettings:e,AndroidSettings:t,IOSSettings:n}=await _(async()=>{let{NativeSettings:e,AndroidSettings:t,IOSSettings:n}=await import(`capacitor-native-settings`);return{NativeSettings:e,AndroidSettings:t,IOSSettings:n}},[],import.meta.url);await e.open({optionAndroid:t.ApplicationDetails,optionIOS:n.App})}catch{}}var xa,I,Sa,Ca,wa,Ta,Ea,Da,Oa=e((()=>{sa(),fe(),ee(),xa=()=>{try{let e=globalThis.Capacitor;return typeof e?.isNativePlatform==`function`&&!!e.isNativePlatform()}catch{return!1}},I=()=>xa(),Sa=()=>{try{let e=globalThis,t=e.__WEBNATIVE_AUTH__||e.__NEUTRALINO_AUTH__;return!t||typeof t.port!=`number`||(e.__CWS_WEBNATIVE_BOOT__||e.__CWS_NEUTRALINO_BOOT__||t.key,!t.key)?null:{port:t.port,key:String(t.key)}}catch{return null}},Ca=async(e,t)=>{let n=Sa();if(!n)return null;try{let r=new Headers(t?.headers);r.set(`Content-Type`,`application/json`),r.set(`X-API-Key`,n.key);let i=await fetch(`http://127.0.0.1:${n.port}${e}`,{...t,headers:r,cache:`no-store`});return i.ok?await i.json():null}catch{return null}},wa=e=>{if(!e||typeof e!=`object`)return``;let t=e,n=t.echo;if(n&&typeof n==`object`){let e=n;if(typeof e.text==`string`)return e.text;if(typeof e.value==`string`)return e.value}return typeof t.text==`string`?t.text:typeof t.value==`string`?t.value:typeof t.data==`string`?t.data:``},Ta=e=>{let t=e.trim();if(!t)return null;if(t.startsWith(`data:`)){let e=t.indexOf(`,`);if(e<0)return null;t=t.slice(e+1)}try{let e=globalThis.atob(t.replace(/\s+/g,``)),n=new Uint8Array(e.length);for(let t=0;t<e.length;t++)n[t]=e.charCodeAt(t);return n}catch{return null}},Ea=async e=>{if(e.type===`image/png`)return e;if(typeof createImageBitmap==`function`&&typeof OffscreenCanvas<`u`){let t=await createImageBitmap(e),n=new OffscreenCanvas(t.width,t.height),r=n.getContext(`2d`);return r?(r.drawImage(t,0,0),t.close(),await n.convertToBlob({type:`image/png`})):e}return e},Da=()=>{try{let e=globalThis;if(e.__CWS_NEUTRALINO_BOOT__||e.__CWS_WEBNATIVE_BOOT__||typeof e.NL_OS==`string`)return!0;let t=e.__WEBNATIVE_AUTH__||e.__NEUTRALINO_AUTH__;return!!(t&&typeof t.port==`number`&&t.key)}catch{return!1}}})),ka,Aa=e((()=>{ka=4e3})),L,ja,Ma,Na,Pa,Fa,Ia,R,La,Ra,za,Ba=e((()=>{L=1e6,ja=0,Ma=0,Na=()=>{if(Ma=Date.now(),typeof process<`u`&&typeof process.hrtime?.bigint==`function`){ja=Number(process.hrtime.bigint()/1000n)%L;return}try{let e=globalThis.performance;if(typeof e?.now==`function`){ja=Math.floor(e.now()%1*L)%L;return}}catch{}ja=0},Na(),Pa=()=>{let e=Date.now(),t=0;if(typeof process<`u`&&typeof process.hrtime?.bigint==`function`){let n=e-Ma;(n<0||n>6e4)&&Na(),t=(ja+Number(process.hrtime.bigint()/1000n))%L}else try{let e=globalThis.performance;typeof e?.now==`function`&&(t=Math.floor(e.now()%1*L)%L)}catch{t=0}let n=String(BigInt(e)*BigInt(L)+BigInt(t));return{ts:e,subUs:t,wireTime64:n,ts64:n,wireTs:n}},Fa=e=>{let t=Pa(),n=String(e.wireTime64??e.ts64??e.wireTs??t.wireTime64);return{...e,ts:Number(e.ts??t.ts),subUs:Number(e.subUs??t.subUs),wireTime64:n,ts64:n,wireTs:n}},Ia=e=>e&&typeof e==`object`&&!Array.isArray(e)?e:{},R=e=>{let t=Number(e);return Number.isFinite(t)&&t>0?t:0},La=e=>{let t=Ia(e.flags),n=Ia(e.payload??e.data),r=za(e.originTs??t.originTs??n.originTs);return r?.ts?r.ts:R(e.originTs)||R(t.originTs)||R(n.originTs)||R(e.timestamp)||R(e.ts)||R(t.timestamp)||R(t.ts)||R(n.timestamp)||R(n.ts)||0},Ra=e=>{let t=Pa(),n=La(e)||R(e.timestamp)||R(e.ts)||t.ts,r=R(e.timestamp)||R(e.ts)||n,i=Number(e.subUs??t.subUs),a=String(e.wireTime64??e.ts64??e.wireTs??t.wireTime64),o=Ia(e.flags),s={...o,originTs:o.originTs??e.originTs??n,wireTime64:o.wireTime64??a,ts64:o.ts64??o.wireTime64??a,wireTs:o.wireTs??o.wireTime64??a};return{...e,originTs:e.originTs??n,ts:r,subUs:i,wireTime64:a,ts64:a,wireTs:a,timestamp:r,flags:s}},za=e=>{let t=String(e??``).trim();if(!/^\d+$/.test(t))return null;try{let e=BigInt(t),n=Number(e/BigInt(L)),r=Number(e%BigInt(L));return Number.isFinite(n)?{ts:n,subUs:r,wireTime64:t,ts64:t,wireTs:t}:null}catch{return null}}})),Va,Ha,Ua,Wa,Ga,Ka,qa,Ja,Ya,Xa,Za=e((()=>{Ba(),Va=e=>e&&typeof e==`object`&&!Array.isArray(e)?e:{},Ha=()=>{try{let e=globalThis.performance;if(typeof e?.now==`function`)return e.now()}catch{}return Date.now()},Ua=(e=Ha())=>Math.round(e*10)&65535,Wa=e=>{let t=String(e||``).trim().toLowerCase();return t.startsWith(`mouse:`)||t.startsWith(`keyboard:`)||t.startsWith(`airpad:mouse`)||t.startsWith(`airpad:keyboard`)},Ga=e=>{let t=String(e||``).trim().toLowerCase();return t===`mouse:click`||t===`mouse:down`||t===`mouse:up`||t===`keyboard:tap`||t===`keyboard:type`||t===`keyboard:toggle`},Ka=e=>{let t=Va(e.payload??e.data??e.body),n=String(t.op??t.action??t.type??``).trim().toLowerCase();if(n)return n;let r=t.params;return Array.isArray(r)&&r.length>0?String(r[0]??``).trim().toLowerCase():``},qa=e=>{if(typeof e==`string`)return Ga(e);let t=String(e.what||e.type||``).trim().toLowerCase();if(Ga(t))return!0;if(t===`airpad:mouse`||t.startsWith(`airpad:mouse`)){let t=Ka(e)||`move`;return t===`click`||t===`mouse:click`||t===`down`||t===`mouse:down`||t===`up`||t===`mouse:up`}return!!(t===`airpad:keyboard`||t.startsWith(`airpad:keyboard`))},Ja=e=>{let t=String(e||``).trim().toLowerCase();return t.startsWith(`clipboard:`)||t.startsWith(`airpad:clipboard:`)},Ya=e=>Wa(e)||Ja(e),Xa=e=>{let t=Va(e),n=Number(t.perfTs??Ha());return{...Fa(t),perfTs:n,perfTsLo:Number(t.perfTsLo??Ua(n))}}})),Qa,$a,eo,to,no,ro,io,ao,oo,so,co,lo,uo,fo,po,mo,ho,go,_o,vo,yo=e((()=>{Aa(),Ba(),Za(),Qa=`wireHash`,$a=new Set([`ts`,`subUs`,`wireTime64`,`ts64`,`wireTs`,`perfTs`,`perfTsLo`,Qa,`source`,`from`,`clientId`,`userId`,`sender`]),eo=e=>e&&typeof e==`object`&&!Array.isArray(e)?e:{},to=e=>{if(!e)return``;let t=5381;for(let n=0;n<e.length;n+=1)t=(t<<5)+t+e.charCodeAt(n)|0;return(t>>>0).toString(36)},no=e=>String(e??``).replace(/\r\n/g,`
`).trim(),ro=e=>{if(e==null)return``;if(typeof e!=`object`)return JSON.stringify(e);if(Array.isArray(e))return`[${e.map(ro).join(`,`)}]`;let t=e;return`{${Object.keys(t).filter(e=>!$a.has(e)).sort().map(e=>`${JSON.stringify(e)}:${ro(t[e])}`).join(`,`)}}`},io=e=>{for(let t of[`asset`,`dataAsset`,`file`,`image`]){let n=eo(e[t]),r=String(n.hash??``).trim();if(r)return r}return``},ao=(e,t)=>{for(let t of[`text`,`content`,`body`]){let n=e[t];if(typeof n==`string`&&n.trim())return n}for(let e of[`payload`,`data`,`result`]){let n=t[e];if(typeof n==`string`&&n.trim())return n}return``},oo=e=>{let t=String(e||``).trim().toLowerCase();return t?t.startsWith(`clipboard:`)||t.startsWith(`airpad:clipboard:`)?`clipboard`:t.startsWith(`mouse:`)||t.startsWith(`keyboard:`)||t.startsWith(`airpad:mouse`)||t.startsWith(`airpad:keyboard`)?`input`:`general`:`general`},so=e=>e===`clipboard`?250:e===`input`?180:400,co=(e,t)=>!!(t===`ask`||t===`request`||!e||e.endsWith(`:read`)||e.endsWith(`:get`)||e.endsWith(`:isready`)),lo=e=>{let t=eo(e.flags),n=eo(e.payload??e.data);return String(t.wireHash??e.wireHash??n.wireHash??``).trim()},uo=e=>{let t=String(e.op||`act`).trim().toLowerCase(),n=String(e.what||e.type||``).trim().toLowerCase();if(co(n,t))return``;let r=String(e.byId||e.from||e.sender||``).trim().toLowerCase(),i=eo(e.payload??e.data??e.body??{});if(n.includes(`clipboard`)){let a=ao(i,e),o=a?``:io(i),s=a?to(no(a)):o?`asset:${o}`:to(ro(i));if(!s)return``;let c=String(e.uuid??``).trim(),l=c?`|u:${c}`:``;return to(`${t}|${n}|${r}|${s}${l}`)}if(oo(n)===`input`){let e=i.perfTs??i.perfTsLo??``;return to(`${t}|${n}|${r}|${ro(i)}|p:${e}`)}return to(`${t}|${n}|${r}|${ro(i)}`)},fo=e=>{let t=Ra(e),n=uo(t);if(!n||lo(t)===n)return t;let r={...eo(t.flags),[Qa]:n},i=t.payload??t.data,a=i;return i&&typeof i==`object`&&!Array.isArray(i)&&(a={...i,[Qa]:n}),t.payload===void 0?t.data===void 0?{...t,flags:r,payload:a}:{...t,flags:r,data:a}:{...t,flags:r,payload:a}},po=class{maxEntries;seen=new Map;constructor(e=512){this.maxEntries=e}shouldSuppress(e,t){let n=String(e.what||e.type||``).trim().toLowerCase(),r=String(e.op||`act`).trim().toLowerCase();if(co(n,r))return!1;let i=lo(e)||uo(e);if(!i)return!1;let a=t??oo(n),o=so(a),s=Date.now(),c=`${a}|${i}`,l=this.seen.get(c);return this.seen.set(c,s),this.prune(s,o),l!==void 0&&s-l<o}clear(){this.seen.clear()}prune(e,t){let n=Math.max(t*4,4e3);for(let[t,r]of this.seen.entries())e-r>n&&this.seen.delete(t);if(this.seen.size<=this.maxEntries)return;let r=[...this.seen.entries()].sort((e,t)=>e[1]-t[1]);for(let e=0;e<r.length-this.maxEntries;e+=1)this.seen.delete(r[e][0])}},mo=new po,ho=class{maxEntries;seen=new Map;constructor(e=512){this.maxEntries=e}shouldSuppress(e){if(vo(e)||qa(e))return!1;let t=String(e.what||e.type||``).trim().toLowerCase(),n=String(e.op||`act`).trim().toLowerCase();if(co(t,n))return!1;let r=lo(e)||uo(e);if(!r)return!1;let i=Date.now(),a=`relay|${r}`,o=this.seen.get(a);return this.seen.set(a,i),this.prune(i),o!==void 0&&i-o<4e3}clear(){this.seen.clear()}prune(e){let t=Math.max(ka*4,4e3);for(let[n,r]of this.seen.entries())e-r>t&&this.seen.delete(n);if(this.seen.size<=this.maxEntries)return;let n=[...this.seen.entries()].sort((e,t)=>e[1]-t[1]);for(let e=0;e<n.length-this.maxEntries;e+=1)this.seen.delete(n[e][0])}},new ho,go=e=>{let t=String(e||``).trim().toLowerCase();return t===`mouse:move`||t===`mouse:scroll`},_o=e=>{let t=eo(e.payload??e.data??e.body),n=String(t.op??t.action??t.type??``).trim().toLowerCase();if(n)return n;let r=t.params;return Array.isArray(r)&&r.length>0?String(r[0]??``).trim().toLowerCase():``},vo=e=>{if(typeof e==`string`)return go(e);let t=String(e.what||e.type||``).trim().toLowerCase();if(go(t))return!0;if(t!==`airpad:mouse`&&!t.startsWith(`airpad:mouse`))return!1;let n=_o(e)||`move`;return n===`move`||n===`mouse:move`||n===`scroll`||n===`mouse:scroll`}}));function bo(e){xo=e}var xo,So=e((()=>{})),z,B,Co,V,wo,To,Eo,Do,Oo,ko,Ao,jo,Mo,No,Po,Fo=e((()=>{fe(),p(),Za(),st(),Yc(),z=!1,B=0,Co=1200,V=()=>Rc()&&D()&&k(),wo=6e3,To=async()=>{if(!V())return z=!1,!1;try{let e=await h(O(`coordinator:status`,{}),wo,`coordinator:status timed out`),t=!!(e.echo?.connected??e.ok);return z=t,B=Date.now(),t}catch{return z=!1,B=Date.now(),!1}},Eo=async()=>{if(!V())return!1;try{return(await h(O(`runtime:reload-settings`,{}),wo,`runtime:reload-settings timed out`))?.ok?(z=!1,B=0,To()):(z=!1,B=Date.now(),!1)}catch{return z=!1,B=Date.now(),!1}},Do=()=>V()?(Date.now()-B>Co&&To(),z):!1,Oo=(e,t)=>!Ya(e)||!t||typeof t!=`object`||Array.isArray(t)?t??{}:Xa(t),ko=async e=>{if(!V())return!1;let t=e instanceof Uint8Array?e:new Uint8Array(e),n=``;for(let e=0;e<t.length;e++)n+=String.fromCharCode(t[e]??0);let r=btoa(n);try{let e=await O(`coordinator:binary`,{data:r,encoding:`base64`}),t=!!(e?.sent??e.echo?.sent??e.ok);return t&&(z=!0,B=Date.now()),t}catch{return z=!1,B=Date.now(),!1}},Ao=async e=>{if(!V())return!1;try{let t=await O(e?`airmouse:start`:`airmouse:stop`,{}),n=t.echo??{},r=!!t.ok;return r&&(z=!0,B=Date.now()),e?r&&n.active!==!1:r}catch{return!1}},jo=()=>Ao(!0),Mo=()=>Ao(!1),No=async e=>{let t=(await O(`coordinator:dispatch`,{what:e.what,payload:Oo(e.what,e.payload),nodes:e.nodes??[],uuid:e.uuid??``,op:e.op})).echo??{};if(t.result!==void 0)return t.result;if(typeof t.body==`string`&&t.body.trim())try{let e=JSON.parse(t.body);return e.result??e.payload??e.data??t.body}catch{return t.body}return t.result??null},Po=async e=>{if(!V())return!1;let t=e.op===`ask`?`coordinator:ask`:`coordinator:act`;try{let n=await O(t,{what:e.what,payload:Oo(e.what,e.payload),nodes:e.nodes??[],uuid:e.uuid??``,op:e.op}),r=!!(n.echo?.sent??n.ok);return r&&(z=!0,B=Date.now()),r}catch{return z=!1,B=Date.now(),!1}}})),Io=t({connectWS:()=>K,disconnectWS:()=>cs,getLastServerClipboard:()=>Ho,getWS:()=>Lo,initWebSocket:()=>ls,isWSConnected:()=>Ro,markTransportDisconnected:()=>Vo,onServerClipboardUpdate:()=>Uo,onVoiceResult:()=>Wo,onWSConnectionChange:()=>zo,reconnectNativeCoordinatorTransport:()=>Eo,reconnectTransportAfterLifecycleResume:()=>ss,refreshNativeCoordinatorStatus:()=>To,refreshTransportConnectionStatus:()=>Bo,sendCoordinatorAct:()=>es,sendCoordinatorAsk:()=>ns,sendCoordinatorRequest:()=>rs,sendWsBinary:()=>ts,shouldUseNativeCoordinatorTransport:()=>V,startNativeAirMouse:()=>jo,stopNativeAirMouse:()=>Mo});function Lo(){return q}function Ro(){return V()?Do():ds}function zo(e){ks.add(e);try{e(Ro())}catch{}return()=>ks.delete(e)}async function Bo(){if(V()){let e=await To();return G(e),e}let e=!!(ds||q?.connected);return G(e),e}function Vo(){G(!1)}function Ho(){return As}function Uo(e){return js.add(e),()=>js.delete(e)}function Wo(e){return Ms.add(e),()=>Ms.delete(e)}function Go(e,t){for(let n of js)try{n(e,t)}catch{}}async function Ko(){if(!q?.connected||!Le()||!Re())return;let e=Ze();if(e.length)try{let t=await va(),n=String(t??``).trim();if(!n)return;let r=Date.now();if(r<Ys&&n===Js||n===Ks&&r-qs<Gs)return;Ks=n,qs=r;let i=groupWireTargetsByAccessToken(e,gc());for(let e of i)es(`clipboard:update`,{text:n},e.nodeIds,{accessToken:e.accessToken})}catch{}}async function qo(e,t){if(!Le())return;let n=typeof e==`string`?e:``,r=n.trim();if(r.toLowerCase().startsWith(`data:image/`)){await Jo({mimeType:`image/png`,data:r},t);return}let i=Date.now();if(!(r&&r===Xs&&i-Zs<Gs)&&(Xs=r,Zs=i,As=n,Go(n,t),!(!He()||!r)&&!(r===Js&&i<Ys)))try{await _a(r),Js=r,Ks=r,qs=i,Ys=i+Gs}catch(e){console.warn(`[cwsp:clipboard] device write failed`,{length:n.length,source:t?.source,error:sc(e)})}}async function Jo(e,t){if(!Le())return;let n=String(e.data??``).trim();if(!n)return;let r=String(e.mimeType||`image/png`).trim()||`image/png`,i=e.hash?.trim()||n.slice(0,96),a=Date.now();if(!(i&&i===Xs&&a-Zs<Gs)&&(Xs=i,Zs=a,Go(``,t),He()&&!(i===Js&&a<Ys)))try{await ha(n,r,e.hash),Js=i,Ks=i,qs=a,Ys=a+Gs}catch(n){console.warn(`[cwsp:clipboard] device image write failed`,{mimeType:r,hash:e.hash,source:t?.source,error:sc(n)})}}function Yo(e){try{return JSON.stringify(e)}catch{return String(e)}}function Xo(){return rt()===`secure`?`secure`:`plaintext`}function H(e){let t=e.trim();return/^l-/i.test(t)?t.slice(2).trim():t}function Zo(e){let t=H(e.trim()).toLowerCase();return t===`localhost`||t===`127.0.0.1`||t===`::1`}function Qo(e){if(!e)return!1;let t=H(e);return t===`localhost`||e===`localhost`||e.endsWith(`.local`)?!0:/^\d{1,3}(?:\.\d{1,3}){3}$/.test(t)?t.startsWith(`10.`)||t.startsWith(`192.168.`)||/^172\.(1[6-9]|2\d|3[01])\./.test(t)||t.startsWith(`127.`)||/^100\.(6[4-9]|[7-9]\d|1[01]\d|12[0-7])\./.test(t):!1}async function $o(e,t){if(!(!e||!t)&&Qo(t)&&location.protocol===`https:`&&!bs.has(e)){bs.add(e);try{await fetch(`${e}/lna-probe`,{method:`GET`,mode:`cors`,cache:`no-store`,credentials:`omit`,targetAddressSpace:`local`})}catch(e){F(`LNA probe: ${String(e?.message||e||``)||`request failed`}`)}}}function es(e,t,n,r){let i=Pc(e,t),a=Tc(`act`,e,i,{nodes:n,accessToken:r?.accessToken});return wc(a)?!0:Us(e)?(K(),!1):(Bs.length>=Vs&&Bs.shift(),Bs.push(a),K(),!0)}function ts(e){if(V())return ko(e),Do();if(!q?.connected)return!1;let t=q;return typeof t.sendBinary==`function`?(t.sendBinary(e),!0):!1}function ns(e,t,n){return new Promise((r,i)=>{(async()=>{if(V()){try{if(!await Ws()){i({ok:!1,error:`Native WS not connected`});return}r(await No({op:`ask`,what:e,payload:Pc(e,t),nodes:n}))}catch(e){i({ok:!1,error:String(e?.message||e)})}return}if(!await Ws()||!q?.connected){i({ok:!1,error:`WS not connected`});return}let a=vc(),o=globalThis.setTimeout(()=>{$.delete(a),i({ok:!1,error:`Timeout waiting for ${e}`})},Es);$.set(a,{resolve:r,reject:i,timeoutId:o}),wc(Tc(`ask`,e,Pc(e,t),{nodes:n,uuid:a}))})()})}function rs(e,t,n){return new Promise((r,i)=>{(async()=>{if(V()){try{if(!await Ws()){i({ok:!1,error:`Native WS not connected`});return}r(await No({op:`act`,what:e,payload:Pc(e,t),nodes:n}))}catch(e){i({ok:!1,error:String(e?.message||e)})}return}if(!await Ws()||!q?.connected){i({ok:!1,error:`WS not connected`});return}let a=vc(),o=globalThis.setTimeout(()=>{$.delete(a),i({ok:!1,error:`Timeout waiting for ${e}`})},Es);$.set(a,{resolve:r,reject:i,timeoutId:o}),wc(Tc(`act`,e,Pc(e,t),{nodes:n,uuid:a}))})()})}function U(){if(ps){if(J||q&&q.connected===!1){ps.textContent=`WS…`;return}ds||q&&q.connected?ps.textContent=`WS ✓`:ps.textContent=`WS ↔`}}function W(e,t){let n=t.trim();F(`[ws-state] event=${e}${n?` ${n}`:``}`)}function is(e){let t=ea();t&&(t.textContent=I()?`TLS failed — install your CA in Android Settings → Security → Encryption & credentials (or use Remote host = name on the cert). Try HTTP :8080 if the server allows. ${e}`:`Untrusted cert — open ${e} in this browser, accept, then retry`,t.classList.add(Fc),t.classList.remove(`ws-status-ok`),t.classList.add(`ws-status-bad`))}function as(e){let t=ea();t&&(t.textContent=`TLS name mismatch for raw IP — set Remote host to ${e} (name on certificate), keep ports as needed`,t.classList.add(Fc),t.classList.remove(`ws-status-ok`),t.classList.add(`ws-status-bad`))}function G(e){ds=e,e&&Hs();let t=ea();t&&(t.classList.remove(Fc),e?(t.textContent=`connected`,t.classList.remove(`ws-status-bad`),t.classList.add(`ws-status-ok`)):(t.textContent=`disconnected`,t.classList.remove(`ws-status-ok`),t.classList.add(`ws-status-bad`))),U();for(let t of ks)try{t(e)}catch{}}function os(e){if(e.type===`voice_result`||e.type===`voice_error`){let t=e.error||e.message||`Actions: `+JSON.stringify(e.actions||[]);for(let n of Ms)try{n({text:t,type:e.type===`voice_error`?`voice_error`:`voice_result`,actions:e.actions,error:e.error})}catch{}F(`Voice result: `+t)}}function ss(e){if(globalThis.window){W(`lifecycle-reconnect`,e),$s(),Ds(),Y+=1,hs=!1;for(let[e,t]of $.entries())clearTimeout(t.timeoutId),t.reject({ok:!1,error:`Disconnected before response for ${e}`}),$.delete(e);for(let e of[...X])Z(e),e.removeAllListeners(),e.close(),X.delete(e);if(J=!1,q)try{q.removeAllListeners(),q.disconnect()}catch{}q=null,fs(null),G(!1),gs=0,mo.clear(),K()}}function K(){if(at()){F(`WS skip: Node clipboard-hub owns fleet /ws (WebView must not connect)`);return}if(Rc()){F(`WS skip: Java CwspBridgeService owns fleet /ws (WebView must not connect)`);return}if(J||q&&(q.connected||q.connecting)||X.size>0)return;Ds(),Y+=1;let e=Y;hs=!1;let t=Ke().trim(),n=Qe().trim(),r=t||n||``,i=Be(),a=e=>!!e&&/^\d{1,3}(?:\.\d{1,3}){3}$/.test(e),o=e=>!e||!a(e)?!1:e.startsWith(`10.`)||e.startsWith(`192.168.`)||/^172\.(1[6-9]|2\d|3[01])\./.test(e)||/^100\.(6[4-9]|[7-9]\d|1[01]\d|12[0-7])\./.test(e),s=e=>a(e)&&e.startsWith(`192.168.0.`),c=e=>H(e).trim().toLowerCase()===`192.168.0.200`,l=e=>H(e).trim().toLowerCase().includes(`45.147.`),u=e=>c(e)||l(e),d=location.hostname||``,f=H(d)||d,p=Se(f),m=it().trim(),h=Me(m,n||t)||m,g=he(n||t,h),ee=me(h,n||t,Ve()),_=je(f),v=p||Ee(f)||ve(n,f)||g&&!_||De(n)&&p,y=e=>{let t=[],n=[],r=[],i=[],u=[],d=[],f=[];for(let p of e)a(p.host)?c(p.host)?i.push(p):l(p.host)?u.push(p):s(p.host)||p.host===`127.0.0.1`?r.push(p):o(p.host)?f.push(p):d.push(p):p.source===`page`?n.push(p):t.push(p);return v?[...u,...i,...t,...d,...r,...n,...f]:_?[...r,...i,...u,...t,...n,...d,...f]:[...u,...i,...r,...t,...n,...d,...f]},te=e=>/^\d{1,5}$/.test(e),b=e=>e.trim().replace(/^[a-z][a-z0-9+.-]*:\/\//i,``).split(`/`)[0],x=e=>{let t=b(e).trim();if(!t)return null;let n=t.lastIndexOf(`:`);if(n<=0)return{host:t};let r=t.slice(0,n),i=t.slice(n+1);return!r||!te(i)?{host:t}:{host:r,port:i}},S=ge(t).map(e=>x(e)).filter(e=>!!e&&!!e.host);if(p&&De(n)&&!g){let e=S.filter(e=>{let t=H(e.host).trim();return t?u(t)?!0:!(a(t)&&s(t)):!1});e.length&&(S=e)}if(!S.length&&n){let e=x(n);e?.host&&(S=[e])}let C=(S[0]?.port||``).trim(),ne=h?x(h):void 0,w=d,T=/^(localhost|127\.0\.0\.1)$/.test(w)||/^\d{1,3}(?:\.\d{1,3}){3}$/.test(w)&&(w.startsWith(`10.`)||w.startsWith(`192.168.`)||/^172\.(1[6-9]|2\d|3[01])\./.test(w));if(location.protocol===`https:`&&i===`http`&&!I()){F(`WebSocket error: browser blocks ws/http from https page (mixed content). Open Airpad via http:// or use valid HTTPS cert on endpoint.`),J=!1,G(!1),U();return}let E=S[0],re=E?.host||r,ie=E?.port,ae=(()=>{if(Oe(h))return Ne(h);if(Oe(m))return Ne(m);if(we(h)||Ce(h))return Ne(h);if(g&&we(m))return Ne(m);if(ee||De(n)||De(t))return ke;let e=ne?.host||``;return e&&Te(e)?Ne(e):e||h||``})(),oe=(ne?.port||``).trim(),se=(re||r||``).trim(),ce=se.length>0?H(se)||se:``,le=(()=>{let e=ce.trim();if(!e)return``;let t=e.lastIndexOf(`:`);return t>0&&te(e.slice(t+1))?e.slice(0,t):e})(),ue=i===`http`||i===`https`?i:C===`443`||C===`8434`||C===`8444`?`https`:C===`80`||C===`8080`||C===`8081`?`http`:I()&&location.protocol===`https:`&&le&&a(le)&&o(le)?`https`:I()&&location.protocol!==`https:`&&le&&a(le)&&o(le)?`http`:location.protocol===`https:`?`https`:`http`,de=se,fe=H(de)||de,D=C||(ue===`https`?`8434`:`8080`);if($o(`${ue}://${fe}:${D}`,fe),w&&Zo(fe)&&!Zo(w)&&Qo(w)){let e=H(w)||w;$o(`${ue}://${e}:${D}`,e)}let pe=ue===`https`?`http`:`https`,O={http:[...ye],https:[..._e]},be=location.port?.trim?.()||``,xe=be||(location.protocol===`https:`?`443`:location.protocol===`http:`?`80`:``),Ae=i===`http`?[`http`]:i===`https`?[`https`]:[ue,pe],Pe=e=>_e.includes(e),Fe=e=>ye.includes(e),Ie=(e,t)=>{let n=[],r=(t&&te(t)?t:``)||(C&&te(C)?C:``);if(r&&(e===`https`?(Pe(r)||i===`https`||i===`auto`)&&n.push(r):(Fe(r)||i===`http`||i===`auto`)&&n.push(r),!n.length&&i===e&&n.push(r),n.length))return n.filter((e,t)=>n.indexOf(e)===t);for(let t of O[e])n.push(t);return be&&n.push(be),n.filter((e,t)=>n.indexOf(e)===t)},Le=e=>H(e.trim())||e.trim(),Re=[];for(let e of S){let t=Le(e.host);t&&Re.push({host:t,source:`remote`,preferPort:e.port})}if(S.length===0&&t){let e=Le(t);e&&Re.push({host:e,source:`remote`})}let k=new Set;for(let e of S)e.host&&k.add(e.host.toLowerCase());if(S.length===0&&t.trim())for(let e of ge(t.trim())){let t=x(e);t?.host&&k.add(t.host.toLowerCase())}let He=()=>{for(let e of k){let t=H(e).toLowerCase();if(t===`localhost`||t===`127.0.0.1`||a(t)&&o(t))return!0}return!1},We=w.toLowerCase(),Ge=H(w)||w,qe=String(location.protocol||``).toLowerCase(),Je=qe===`chrome-extension:`||qe===`moz-extension:`||qe===`safari-web-extension:`||/^[a-p]{32}$/.test(We),Ye=!!We&&Ee(Ge)&&!k.has(We),Ze=!!w&&k.size>0&&He()&&!T&&!k.has(We),et=p&&!!w&&Zo(w);location.hostname&&!Je&&!Ze&&!Ye&&!et&&Re.push({host:location.hostname,source:`page`,...xe?{preferPort:xe}:{}});let nt=new Map;for(let e of Re)e.host&&!nt.has(e.host)&&nt.set(e.host,e);let rt=Array.from(nt.values()),ot=y(rt),st=[];for(let e of Ae){if(location.protocol===`https:`&&e===`http`)continue;let t=e===`https`?ot:rt;for(let n of t){let{host:t,source:r,preferPort:i}=n,s=w&&t===w&&xe?xe:i;for(let n of Ie(e,s)){let i=H(t).trim()||t.trim(),s=a(i)&&o(i),c=location.protocol===`https:`&&!T&&s,l=I()&&s||location.protocol===`https:`&&T&&s||c&&s;st.push({url:`${e}://${t}:${n}`,protocol:e,host:t,source:r,port:n,privateLanHint:l})}}}let A=st.filter((e,t)=>st.findIndex(t=>t.url===e.url)===t);if(A.length===0){J=!1,G(!1),U();return}let ct=A.length>0?ys%A.length:0,j=A.slice(ct).concat(A.slice(0,ct));ys=ct,vs=j,vs.length<=1&&(ys=0);let lt=()=>{vs.length>1&&(ys=(ys+1)%vs.length)};J=!0,U();let M=Le(re||t||``),ut=oe||ie||C||(ue===`https`?`8434`:`8080`),dt=ae,ft=dt||M||``,pt=()=>{if(!M)return!0;let e=Ne(dt);if(!e)return!u(M);let t=M.trim().toLowerCase(),n=H(e).toLowerCase();return!n||!t||n===t||e.toLowerCase()===`l-${t}`?!0:(Ce(e),!1)},mt=e=>{let n=e.url,r=hc(),i=gc(),a=$e(),o=mc(),s=Xe().trim(),c={};r&&(c.token=r,c.userKey=r),i&&(c.accessToken=i),a&&(c.clientAccessToken=a),o&&(c.clientId=o),s&&(c.peerInstanceId=s,c.deviceInstanceId=s);let l={};s&&(l.peerInstanceId=s,l.deviceInstanceId=s),l.connectionType=Ue(),l.archetype=tt(),l.cwspEnvelope=`v2`,o&&(l.clientId=o,l.userId=o),r&&(l.token=r,l.userKey=r),l[Q.via]=pt()?e.source||`unknown`:`tunnel`,l[Q.localEndpoint]=pt()?`1`:`0`;let u=dt||(Oe(m)?`L-200`:``)||``,d=u||ft,f=u||dt||M||ft,p=H(e.host||``).trim(),h=H(w||``).trim();return e.source===`page`&&p&&h&&p.toLowerCase()===h.toLowerCase()&&Zo(d)&&(d=p,f=p),d&&(l[Q.route]=d,l[Q.routeTarget]=f),Os()&&(l[Q.hop]=e.host||t||`unknown`,l[Q.host]=e.host||t||``,l[Q.target]=M||``,l[Q.targetPort]=ut,l[Q.viaPort]=e.port||``,l[Q.protocol]=e.protocol||`https`),a&&(l.clientAccessToken=a),i&&(l.accessToken=i),{url:n,clientToken:r,accessToken:i,clientId:o,peerInstanceId:s,handshakeAuth:c,queryParams:l}},ht=(e,t,n,r)=>{q=e,W(`connected`,`candidate=${n+1}/${j.length} candidate_url=${r} transport=${t.protocol} parallel=${ws}`),J=!1,gs=0,Ds(),G(!0),ec(),q.on(`disconnect`,e=>{$s(),W(`disconnected`,`candidate=${n+1}/${j.length} candidate_url=${r} reason=${e||`unknown`}`),J=!1,G(!1),U();let t=hs;hs=!1;for(let[e,t]of $.entries())clearTimeout(t.timeoutId),t.reject({ok:!1,error:`Disconnected before response for ${e}`}),$.delete(e);if(q=null,t){gs=0;return}fc(e)&&(lt(),vs.length>1&&F(`WebSocket disconnect reason "${e||`unknown`}", trying next candidate on reconnect`));let i=gs+1;if(!dc(e))return;gs=i;let a=Math.min(xs*i,5e3);Ds(),_s=globalThis.setTimeout(()=>{_s=null,!(J||ds||q&&q.connected||q?.connecting)&&(W(`auto-reconnect`,`attempt=${`${i}/unlimited`} reason=${e||`unknown reason`}`),K())},a)}),q.on(`connect_error`,e=>{W(`socket-connect-error`,`candidate=${n+1}/${j.length} candidate_url=${r} reason=${e?.message||`unknown`}`),J=!1,U()}),q.on(`voice_result`,async e=>{os(await Oc(e))}),q.on(`voice_error`,async e=>{os(await Oc(e))}),q.on(`clipboard:update`,async e=>{let t=await Oc(e);if(!ze(ac(t)))return;let n=ic(t);if(n){Jo(n,{source:t?.source});return}qo(rc(t),{source:t?.source})}),q.on(`data`,async e=>{let t=await Oc(e);yc(t)&&Cc(t)}),q.on(`message`,async e=>{let t=await Oc(e);yc(t)&&Cc(t)}),q.on(`network.fetch`,async(e,t)=>{let n=await Nc(e);typeof t==`function`&&t(n)}),fs(q)},gt=(t,n)=>new Promise(r=>{if(e!==Y){r(!1);return}let i=j.slice(t,t+ws);if(!i.length){r(!1);return}if(t===0&&n===0){let e=ea();e&&(e.classList.remove(Fc),e.textContent=`connecting…`)}let s=!1,c=!1,l=0,u=i.length,d=null,f=null,p=(e,t,n,i,a)=>{if(!c){c=!0,s=!0;for(let t of[...X])t!==e&&(Z(t),t.removeAllListeners(),t.close(),X.delete(t));Z(e),X.delete(e),ht(e,t,n,i),r(!0)}},m=()=>{c||s||(l++,!(l<u)&&(c=!0,d?is(d):f&&as(f),r(!1)))};for(let n=0;n<i.length;n++){let r=i[n],l=t+n,h=mt(r),{url:g,handshakeAuth:ee,queryParams:_}=h;W(`connecting`,`batch=${t}-${t+u-1} candidate=${l+1}/${j.length} candidate_url=${g} transport=${r.protocol} source=${r.source} host=${r.host}:${r.port} target=${M}:${ut}`);let v=Ji(g,{auth:ee,query:_,timeout:Ss});X.add(v),v.__cwspProbeTimer=globalThis.setTimeout(()=>{if(e!==Y){Z(v),v.removeAllListeners(),v.close(),X.delete(v);return}s||c||v.connected||(Z(v),v.removeAllListeners(),v.close(),X.delete(v),W(`connect-failed`,`candidate=${l+1}/${j.length} candidate_url=${g} reason=probe-hard-timeout`),m())},Cs),v.on(`connect`,()=>{if(Z(v),e!==Y){v.removeAllListeners(),v.close(),X.delete(v);return}if(s||c){v.removeAllListeners(),v.close(),X.delete(v);return}p(v,r,l,g,h)}),v.on(`connect_error`,e=>{if(Z(v),X.delete(v),s||c){v.removeAllListeners(),v.close();return}v.removeAllListeners(),v.close();let t=e?.description||e?.context||``,n=String(e?.message||e||``),i=`${n} ${String(t)}`,u=r.protocol===`https`&&o(r.host)&&/xhr poll error|websocket error/i.test(n),p=/certificate|cert\.|ssl|tls|trust|ERR_CERT|ERR_SSL|handshake|authority|SELF_SIGNED|unknown.*cert|invalid.*cert|unable to verify|pkix|hostname|name mismatch/i.test(i),h=/refused|ECONNREFUSED|ENOTFOUND|timed out|timeout|unreachable|ERR_CONNECTION|ADDRESS_UNREACHABLE|NAME_NOT_RESOLVED|INTERNET_DISCONNECTED|network.*lost/i.test(i),ee=I();u&&!d&&(p||!ee&&!h)&&(d=g);let _=r.protocol===`https`&&a(r.host)&&!o(r.host)&&r.host!==`127.0.0.1`,y=`${n} ${String(t)}`;if(_&&/xhr poll error|websocket error|certificate|CERT|common name|ssl|tls|failed to fetch|name invalid/i.test(y)&&!f){let e=w&&!a(w)&&w!==`localhost`?w:``;e&&(f=e)}r.privateLanHint&&/cors|private network|address space|failed fetch/i.test(n)&&W(`connect-failed`,`candidate=${l+1}/${j.length} candidate_url=${g} reason=${n} hint=private-network-cors`),W(`connect-failed`,`candidate=${l+1}/${j.length} candidate_url=${g} reason=${n} details=${t?Yo(t):`none`}`),m()})}});(async()=>{for(let t=0;t<3;t++){for(let n=0;n<j.length;n+=ws)if(e!==Y||await gt(n,t))return;t+1<3&&(W(`retry`,`round=${t+2}/3 next=0`),await new Promise(e=>globalThis.setTimeout(e,450)))}e===Y&&(W(`failed`,`round=3/3 all-candidates`),J=!1,G(!1),U())})()}function cs(){$s(),Ds(),Y+=1,hs=!0;for(let e of[...X])Z(e),e.removeAllListeners(),e.close(),X.delete(e);if(J=!1,!q){G(!1),U();return}F(`Disconnecting WebSocket...`),q.disconnect(),q=null,fs(null),G(!1)}function ls(e){ps=e,U(),e&&ms!==e&&(ms&&ms.removeEventListener(`click`,us),ms=e,ms.addEventListener(`click`,us))}function us(){J||ds||q&&q.connected||q?.connecting?cs():K()}var q,ds,J,fs,ps,ms,Y,X,hs,gs,_s,vs,ys,bs,xs,Ss,Cs,ws,Ts,Es,Ds,Z,Q,Os,ks,As,js,Ms,Ns,Ps,Fs,Is,Ls,Rs,zs,$,Bs,Vs,Hs,Us,Ws,Gs,Ks,qs,Js,Ys,Xs,Zs,Qs,$s,ec,tc,nc,rc,ic,ac,oc,sc,cc,lc,uc,dc,fc,pc,mc,hc,gc,_c,vc,yc,bc,xc,Sc,Cc,wc,Tc,Ec,Dc,Oc,kc,Ac,jc,Mc,Nc,Pc,Fc,Ic=e((()=>{Zi(),na(),st(),Yc(),Oa(),be(),Ye(),Za(),yo(),Ae(),Ba(),So(),Fo(),q=null,ds=!1,J=!1,fs=e=>{try{let t=globalThis;t.__socket=e;let n=t.window;n&&(n.__socket=e)}catch{}},ps=null,ms=null,Y=0,X=new Set,hs=!1,gs=0,_s=null,vs=[],ys=0,bs=new Set,xs=800,Ss=4800,Cs=5600,ws=3,Ts=`CWS_AIRPAD_VERBOSE_QUERY`,Es=8e3,Ds=()=>{_s&&=(globalThis.clearTimeout(_s),null)},Z=e=>{let t=e;t.__cwspProbeTimer&&(globalThis.clearTimeout(t.__cwspProbeTimer),delete t.__cwspProbeTimer)},Q={via:`cwsp_via`,localEndpoint:`cwsp_local_endpoint`,route:`cwsp_route`,routeTarget:`cwsp_route_target`,hop:`cwsp_hop`,host:`cwsp_host`,target:`cwsp_target`,targetPort:`cwsp_target_port`,viaPort:`cwsp_via_port`,protocol:`cwsp_protocol`},Os=()=>{try{let e=String(globalThis?.localStorage?.getItem?.(Ts)||``).trim().toLowerCase();if([`1`,`true`,`yes`,`on`].includes(e))return!0}catch{}let e=String(globalThis?.[Ts]||``).trim().toLowerCase();return[`1`,`true`,`yes`,`on`].includes(e)},ks=new Set,As=``,js=new Set,Ms=new Set,Ns=`ws`,Ps=`ws`,Fs=e=>{let t=String(e||``).trim().toLowerCase();return!t||t===`ws`||t===`wss`||t===`socket`||t===`socket.io`||t===`socketio`?Ns:t},Is=new TextEncoder,Ls=new TextDecoder,Rs=new Map,zs=new Map,bo(()=>{Rs.clear(),zs.clear()}),$=new Map,Bs=[],Vs=128,Hs=()=>{if(q?.connected)for(;Bs.length>0;){let e=Bs.shift();e&&wc(e)}},Us=e=>{let t=String(e||``).trim().toLowerCase();return t===`mouse:move`||t===`mouse:scroll`},Ws=async(e=7e3)=>V()?Do()||await To():q?.connected?!0:(K(),await new Promise(t=>{let n=!1,r=e=>{if(!n){n=!0;try{i?.()}catch{}globalThis.clearTimeout(a),t(e)}},i=zo(e=>{e&&r(!0)}),a=globalThis.setTimeout(()=>r(!!q?.connected),e)})),Gs=3500,Ks=``,qs=0,Js=``,Ys=0,Xs=``,Zs=0,Qs=null,$s=()=>{Qs&&=(globalThis.clearInterval(Qs),null)},ec=()=>{if($s(),!Re()||!Le())return;let e=qe();Qs=globalThis.setInterval(()=>{Ko()},e)},tc=e=>{if(typeof e==`string`)return e;if(!e||typeof e!=`object`)return``;let t=e;for(let e of[`text`,`content`,`body`]){let n=t[e];if(typeof n==`string`)return n}if(typeof t.result==`string`)return t.result;let n=t.payload??t.data;if(n&&n!==e){let e=tc(n);if(e)return e}return``},nc=e=>{let t=String(e||``).trim().toLowerCase();return t===`clipboard:update`||t===`clipboard:write`||t.startsWith(`airpad:clipboard:`)},rc=e=>{let t=e.payload??e.data??e.result??e.results;return tc(t)||tc(e)},ic=e=>{let t=[e.payload,e.data,e.result,e.results,e];for(let e of t){if(!e||typeof e!=`object`)continue;let t=e,n=t.asset??t.dataAsset??t.file??t.image;if(!n||typeof n!=`object`)continue;let r=n,i=typeof r.data==`string`?r.data.trim():``;if(!i)continue;let a=typeof r.mimeType==`string`&&r.mimeType.trim()||typeof r.type==`string`&&r.type.trim()||`image/png`;if(a.toLowerCase().startsWith(`image/`))return{hash:typeof r.hash==`string`?r.hash.trim():``,mimeType:a,data:i}}return null},ac=e=>{let t=e;return!t||typeof t!=`object`?``:String(t.from||t.byId||t.sender||``).trim()},oc=e=>{let t=String(e||``).trim().toLowerCase();return t.startsWith(`clipboard:`)?`clipboard`:t.startsWith(`mouse:`)?`mouse`:t.startsWith(`keyboard:`)?`input`:t.startsWith(`airpad:`)?`airpad`:t.startsWith(`sms:`)?`sms`:t.startsWith(`contacts:`)?`contact`:(t.startsWith(`notification:`)||t.startsWith(`notifications:`),`general`)},sc=e=>e?typeof e==`string`?e:e instanceof Error?`${e.name}: ${e.message}`:Yo(e):String(e),cc=e=>{try{let t=atob(e),n=new Uint8Array(t.length);for(let e=0;e<t.length;e+=1)n[e]=t.charCodeAt(e);return n}catch{return null}},lc=e=>typeof e==`object`&&!!e&&typeof e.cipher==`string`&&typeof e.sig==`string`,uc=e=>{if(!e||typeof e!=`string`)return null;try{return JSON.parse(e)}catch{return null}},dc=e=>!e||!(e===`io client disconnect`||e===`forced close`),fc=e=>!e||!(e===`io server disconnect`||e===`io client disconnect`),pc=()=>(We()||``).trim(),mc=()=>xe((Je()||``).trim())||`airpad-client`,hc=()=>(Ge()||``).trim(),gc=()=>(et()||``).trim(),_c=()=>wireTargetNodeIds(parseWireTargetList(it().trim())),vc=()=>globalThis.crypto?.randomUUID?globalThis.crypto.randomUUID():`airpad-${Date.now()}-${Math.random().toString(16).slice(2)}`,yc=e=>!!e&&typeof e==`object`&&(`op`in e||`what`in e||`uuid`in e||`result`in e||`error`in e),bc=e=>e===`request`?`ask`:e===`response`?`result`:e===`signal`||e===`notify`||e===`redirect`?`act`:e,xc=e=>e,Sc=e=>{let t=mc(),n=hc(),r=(typeof e.accessToken==`string`&&e.accessToken.trim()?e.accessToken.trim():typeof e.airpadToken==`string`&&e.airpadToken.trim()?e.airpadToken.trim():``)||gc(),i=String(e.sender||e.byId||e.from||t||``).trim()||void 0,a=String(e.from||i||``).trim()||void 0,o=String(e.byId||i||``).trim()||void 0,s=Array.isArray(e.destinations)&&e.destinations.length?e.destinations:Array.isArray(e.nodes)?e.nodes:_c(),c=typeof e.uuid==`string`&&e.uuid.trim()?e.uuid.trim():vc(),l=Date.now();return{...e,op:xc(e.op),type:String(e.type||e.what||``).trim()||e.what,protocol:Fs(e.protocol),transport:String(e.transport||Ps).trim()||Ps,purpose:String(e.purpose||oc(String(e.what||e.type||``))).trim()||`general`,sender:i,byId:o,from:a,nodes:s,destinations:s,ids:typeof e.ids==`object`&&e.ids!=null?e.ids:{byId:o,from:a,sender:i,destinations:s},urls:Array.isArray(e.urls)&&e.urls.length?e.urls:[Ke()],tokens:Array.isArray(e.tokens)&&e.tokens.length?e.tokens:n?[n]:[],token:e.token||n||void 0,userKey:typeof e.userKey==`string`&&e.userKey.trim()?e.userKey:n||void 0,accessToken:r||void 0,flags:{...e.flags,canonicalV2:!0},uuid:c,timestamp:Number(e.timestamp||0)>0?Number(e.timestamp):l}},Cc=async e=>{let t=bc(e.op),n=(e.what||e.type||``).trim(),r=typeof e.uuid==`string`?e.uuid:``;if(r&&$.has(r)){let n=$.get(r);n&&(clearTimeout(n.timeoutId),$.delete(r),t===`error`||e.error!==void 0?n.reject(e.error??{ok:!1,error:`Unknown coordinator error`}):n.resolve(e.result??e.results));return}if(t===`ask`&&n===`clipboard:get`){try{let t=await va();wc({...Tc(`result`,n,null,{uuid:r,nodes:e.from?[e.from]:void 0}),result:typeof t==`string`?t:String(t||``)})}catch(t){wc({...Tc(`error`,n,null,{uuid:r,nodes:e.from?[e.from]:void 0}),error:t?.message||String(t)})}return}if(t===`act`&&n){let t=nc(n)?`clipboard`:oo(n);if(mo.shouldSuppress(e,t))return}if(nc(n)){if(!ze(ac(e)))return;let t=e.payload??e.data??e.result??e.results,n=ic(e);if(n){Jo(n,{source:typeof t==`object`&&t?String(t.source||``):void 0});return}qo(rc(e),{source:typeof t==`object`&&t?String(t.source||``):void 0})}},wc=e=>{if(V()){let t=String(e.what||e.type||``),n=e.payload??e.data??{},r=Array.isArray(e.nodes)?e.nodes.map(String):void 0;return Po({op:e.op===`ask`||e.op===`request`?`ask`:`act`,what:t,payload:n,nodes:r,uuid:typeof e.uuid==`string`?e.uuid:void 0}),Do()}return!q||!q.connected?!1:(q.send(Sc(e)),!0)},Tc=(e,t,n,r={})=>{let i=mc(),a=hc(),o=r.accessToken===void 0?gc():String(r.accessToken).trim()||gc();return fo(Ra({op:xc(e),what:t,type:t,purpose:oc(t),protocol:Ns,transport:Ps,payload:n,nodes:r.nodes??_c(),destinations:r.nodes??_c(),uuid:r.uuid,sender:i,byId:i,from:i,ids:{byId:i,from:i,sender:i,destinations:r.nodes??_c()},urls:[Ke()],tokens:a?[a]:[],flags:{canonicalV2:!0},token:a||void 0,userKey:a||void 0,accessToken:o||void 0,timestamp:Date.now()}))},Ec=async e=>{if(!e||!globalThis.crypto?.subtle)return null;if(Rs.has(e))return Rs.get(e)||null;let t=Is.encode(e),n=await globalThis.crypto.subtle.digest(`SHA-256`,t),r=await globalThis.crypto.subtle.importKey(`raw`,n,`AES-GCM`,!1,[`encrypt`,`decrypt`]);return Rs.set(e,r),r},Dc=async e=>{if(!lc(e))return e;let t=pc(),n=cc(e.cipher);if(!n)return e;if(!t||!globalThis.crypto?.subtle){let t=Ls.decode(n);return uc(t)??e}let r=await Ec(t);if(!r)return e;if(n.length<28){let t=Ls.decode(n);return uc(t)??e}let i=n.slice(0,12),a=n.slice(12);try{let t=new Uint8Array(await globalThis.crypto.subtle.decrypt({name:`AES-GCM`,iv:i},r,a)),n=Ls.decode(t);return uc(n)??e}catch{return e}},Oc=async e=>!lc(e)||Xo()!==`secure`?e:Dc(e),kc=()=>{try{return String(new URL(location.href).hostname).toLowerCase()}catch{return``}},Ac=e=>{if(!e||typeof e!=`string`)return!1;let t;try{t=new URL(e,location.href)}catch{return!1}let n=t.hostname.toLowerCase(),r=t.protocol.toLowerCase();if(r!==`http:`&&r!==`https:`)return!1;let i=kc();return Qo(n)||n===`localhost`||n===i},jc=e=>{let t={};if(!e)return t;for(let[n,r]of Object.entries(e))typeof n!=`string`||!n.trim()||typeof r==`string`&&(t[n]=r);return t},Mc=e=>{let t={};return e.forEach((e,n)=>{t[n]=e}),t},Nc=async e=>{let t=typeof e?.requestId==`string`?e.requestId.trim():``,n=typeof e?.method==`string`?e.method.toUpperCase():`GET`,r=typeof e?.url==`string`?e.url:``,i=e&&typeof e.timeoutMs==`number`?e.timeoutMs:12e3,a=Number.isFinite(i)&&i>0?Math.min(Math.max(Math.round(i),1e3),6e4):12e3;if(!t)return{ok:!1,status:400,statusText:`Bad Request`,error:`Missing requestId`};if(!Ac(r))return{requestId:t,ok:!1,status:400,statusText:`Bad Request`,error:`URL not allowed`};let o=new AbortController,s=globalThis.setTimeout(()=>o.abort(),a);try{let i=jc(e?.headers),a=![`GET`,`HEAD`].includes(n),s=e?.body,c=a?typeof s==`string`?s:Yo(s):void 0,l=await fetch(r,{method:n,headers:i,body:c,signal:o.signal}),u=await l.text();return{requestId:t,ok:l.ok,status:l.status,statusText:l.statusText,headers:Mc(l.headers),body:u}}catch(e){return{requestId:t,ok:!1,status:0,statusText:`Network Error`,error:sc(e)}}finally{clearTimeout(s)}},Pc=(e,t)=>!Ya(e)||!t||typeof t!=`object`||Array.isArray(t)?t:Xa(t),Fc=`ws-status-tls-hint`})),Lc=t({applyHubSocketFromSettings:()=>Uc,backendOwnsExclusiveHubWebsocket:()=>Bc,installAirpadHubLifecycleRecovery:()=>Hc,nativeShellOwnsExclusiveHubWebsocket:()=>Rc,nodeClipboardHubOwnsExclusiveWebsocket:()=>zc});function Rc(){if(!k())return!1;try{if(globalThis.__CWS_NATIVE__===!0)return!0}catch{}return Jc()}function zc(){return at()}function Bc(){return Rc()||zc()}function Vc(){return!(Bc()||!Ie()&&!ot()||!Ke().trim())}function Hc(){if(Gc||!qc())return;Gc=!0;let e=globalThis.document,t=globalThis.window;e.addEventListener(`visibilitychange`,()=>{e.visibilityState===`hidden`&&(Kc=Date.now())});let n=e=>{globalThis.setTimeout(e,280)},r=()=>{Vc()&&(async()=>{ls(null);let e=!!Lo()?.connected;if(Kc>0&&Date.now()-Kc>=Wc&&(e||Ro())){ss(`visibility`);return}!e&&!Ro()&&K()})()},i=e=>{Vc()&&(ls(null),ss(e))};e.addEventListener(`visibilitychange`,()=>{e.visibilityState===`visible`&&n(r)}),t.addEventListener(`online`,()=>n(()=>i(`online`))),t.addEventListener(`pageshow`,e=>{e.persisted&&n(()=>i(`bfcache`))})}async function Uc(e){Hc(),!await lt(e)&&(nt(e),!Rc()&&(zc()||!Ie()&&!ot()||Ke().trim()&&(ls(null),K())))}var Wc,Gc,Kc,qc,Jc,Yc=e((()=>{ct(),st(),Ic(),Wc=12e3,Gc=!1,Kc=0,qc=()=>{try{let e=globalThis;return!!(e.window&&e.document)}catch{return!1}},Jc=()=>{try{let e=globalThis.Capacitor;return typeof e?.isNativePlatform==`function`&&!!e.isNativePlatform()}catch{return!1}}})),Xc=t({ensureCapacitorPermissions:()=>nl,isCapacitorNative:()=>Qc}),Zc,Qc,$c,el,tl,nl,rl=e((()=>{Zc=()=>{try{let e=globalThis?.Capacitor;return e&&typeof e==`object`?e:null}catch{return null}},Qc=()=>{let e=Zc();try{return!!(e?.isNativePlatform?.()??(e?.platform&&e.platform!==`web`))}catch{return!1}},$c=e=>{let t=Zc()?.Plugins?.[e];return t&&typeof t==`object`?t:null},el=async(e,...t)=>{try{return typeof e==`function`?await e(...t):void 0}catch{return}},tl=!1,nl=async()=>{if(!Qc())return{native:!1,requested:[]};if(tl)return{native:!0,requested:[]};tl=!0;let e=[],t=$c(`Clipboard`);t&&(await el(t.read),e.push(`clipboard`));let n=$c(`CwsPlatform`);if(n)await el(n.requestRuntimePermissions),e.push(`CwsPlatform.requestRuntimePermissions`);else{let t=$c(`DevicePermissions`)||$c(`Permissions`);t&&typeof t.requestPermissions==`function`&&(await el(t.requestPermissions,{permissions:[`POST_NOTIFICATIONS`]}),e.push(`legacy-permissions`))}let r=$c(`LocalNotifications`);return r&&typeof r.requestPermissions==`function`&&(await el(r.requestPermissions),e.push(`notifications`)),{native:!0,requested:e}}})),il,al,ol,sl,cl,ll=e((()=>{rl(),il=()=>{try{let e=globalThis?.Capacitor;return e&&typeof e==`object`?e:null}catch{return null}},al=e=>{let t=il()?.Plugins?.[e];return t&&typeof t==`object`?t:null},ol=async(e,...t)=>{try{return typeof e==`function`?await e(...t):void 0}catch(e){console.warn(`[capacitor-settings-permissions]`,e);return}},sl=async e=>{let t=[],n=[],r=!1;if(!Qc())return{lines:t,results:n,prompted:r};e.shell&&(e.shell.acceptSmsBridgeData=!1,e.shell.enableNativeSms=!1);let i=e.shell||{},a=i.acceptContactsBridgeData===!0,o=(i.bridgeDaemonEnabled??!0)!==!1,s=(i.enableRemoteClipboardBridge??!0)!==!1,c=o||s,l=al(`CwsPlatform`);if(a||c)if(l?.requestSettingsPermissions){let e=await ol(l.requestSettingsPermissions,{contacts:a,sms:!1,notifications:c,overlay:!1}),i=!1;if(e&&typeof e==`object`){i=e.prompted===!0,r=i;let t=e.results;if(Array.isArray(t)){for(let e of t)if(e&&typeof e==`object`){let t=String(e.permission??``);if(t===`SYSTEM_ALERT_WINDOW`||t===`READ_SMS`||t===`RECEIVE_SMS`||t===`SEND_SMS`)continue;n.push({permission:t,granted:!!e.granted})}}}let o=n.filter(e=>e.granted===!1);o.length?t.push(`Permission denied: ${o.map(e=>e.permission).filter(Boolean).join(`, `)}`):i&&t.push(`Runtime permissions requested`)}else{let e=al(`DevicePermissions`)||al(`Permissions`),n=[];a&&n.push(`READ_CONTACTS`),c&&n.push(`POST_NOTIFICATIONS`),e?.requestPermissions&&n.length&&(await ol(e.requestPermissions,{permissions:n}),t.push(`Runtime permissions requested (legacy plugin)`))}return o&&l?.startCwspBridge?(await ol(l.startCwspBridge),t.push(`CWSP foreground service started`)):!o&&l?.stopCwspBridge&&(await ol(l.stopCwspBridge),t.push(`CWSP foreground service stopped`)),{lines:t,results:n,prompted:r}},cl=async e=>{if(!Qc()||((e?.shell||{}).bridgeDaemonEnabled??!0)===!1)return!1;e?.shell&&(e.shell.acceptSmsBridgeData=!1,e.shell.enableNativeSms=!1);let t=al(`CwsPlatform`);return t?.startCwspBridge?(await ol(t.startCwspBridge),!0):!1}})),ul=t({BootLoader:()=>ml,bootLoader:()=>hl,bootMinimal:()=>dl,default:()=>hl});async function dl(e,t=`viewer`,n){let r=pr(t,`viewer`),i=fr(r)?[r]:[`viewer`],a=i[0];return hl.boot(e,{styleSystem:`vl-basic`,shell:`minimal`,defaultView:r,channels:i,channelPriorityId:a,rememberChoice:n?.rememberChoice??!0,skipInitialNavigate:n?.skipInitialNavigate??!1})}var fl,pl,ml,hl,gl=e((()=>{c(),pt(),vt(),Tr(),Ar(),fe(),ct(),Fe(),Fi(),Kn(),Ki(),mr(),Yc(),ll(),ee(),fl=e=>e===`faint`?`tabbed`:e===`base`?`immersive`:e,pl={raw:{name:`Raw (No Framework)`,stylesheets:[],description:`No CSS framework, raw browser defaults`,recommendedShells:[`immersive`]},"vl-core":{name:`Core (Shared Foundation)`,stylesheets:[],description:`Shared foundation styles for all veela variants`,recommendedShells:[`immersive`,`minimal`]},"vl-basic":{name:`Basic Veela Styles`,stylesheets:[],description:`Minimal styling for basic functionality`,recommendedShells:[`window`,`tabbed`,`minimal`,`environment`,`immersive`,`content`]},"vl-advanced":{name:`Advanced (Full-Featured Styling)`,stylesheets:[],description:`Full-featured styling with design tokens and effects`,recommendedShells:[`tabbed`,`minimal`,`environment`]},"vl-beercss":{name:`BeerCSS (Beer CSS Compatible)`,stylesheets:[],description:`Beer CSS compatible styling with Material Design 3`,recommendedShells:[`tabbed`]}},ml=class e{static instance;state={phase:`idle`,styleSystem:null,shell:null,view:null,error:null};stateChangeHandlers=new Set;shellInstance=null;implicitBridgeCleanup=null;phaseHandlers=new Map;constructor(){vr()}static getInstance(){return e.instance||=new e,e.instance}async boot(e,t){console.log(`[BootLoader] Starting boot sequence:`,t);try{if(this.shellInstance)try{this.implicitBridgeCleanup?.(),this.implicitBridgeCleanup=null,br.unload(this.shellInstance.id)}catch(e){console.warn(`[BootLoader] Failed to unload previous shell:`,e)}finally{this.shellInstance=null}Er(),pe().catch(()=>{});try{let{initFrontendDebugCapture:e}=await _(async()=>{let{initFrontendDebugCapture:e}=await import(`./frontend-debug-capture-BNPCucC4.js`).then(e=>(e.i(),e.t));return{initFrontendDebugCapture:e}},[],import.meta.url);e()}catch{}let n=await A().catch(e=>(console.warn(`[BootLoader] Failed to load settings:`,e),null)),r=n;if(D()){let e=await j().catch(()=>null);e&&(r=e)}if(r&&Uc(r).catch(()=>void 0),D()&&cl(r).catch(e=>{console.warn(`[BootLoader] CWSP bridge daemon auto-start skipped:`,e)}),Ai(r??Pe),!(()=>{try{let e=globalThis;return!!(e.__CWS_NEUTRALINO_BOOT__||e.__CWS_WEBNATIVE_BOOT__||e.Neutralino||typeof e.NL_OS==`string`)}catch{return!1}})())try{let{initIngressPWA:e}=await _(async()=>{let{initIngressPWA:e}=await import(`./sw-handling-Dc1xzgG2.js`);return{initIngressPWA:e}},[],import.meta.url);await e()}catch(e){console.warn(`[BootLoader] Share-target / service worker ingress failed (non-fatal):`,e)}await this.loadStyles(t.styleSystem);let i=this.resolveThemeFromSettings(n),a=await this.loadShell(t.shell,e);return a.setTheme(t.theme||i),await a.mount(e),this.implicitBridgeCleanup?.(),this.implicitBridgeCleanup=Hn(),t.channels&&t.channels.length>0&&await this.initChannels(t.channels,t.channelPriorityId),t.skipInitialNavigate?this.dismissShellLoadingSpinner(a):await a.navigate(t.defaultView),this.setPhase(`ready`),t.rememberChoice&&this.savePreferences(t),console.log(`[BootLoader] Boot complete`),a}catch(e){throw console.error(`[BootLoader] Boot failed:`,e),this.updateState({phase:`error`,error:e}),e}}resolveThemeFromSettings(e){let t=e?.appearance?.theme||`auto`;return t===`dark`?wr:t===`light`?Cr:Sr}dismissShellLoadingSpinner(e){try{let t=e.getElement().shadowRoot?.querySelector(`.app-shell__loading`);t&&(t.hidden=!0)}catch{}}async loadStyles(e){this.setPhase(`styles`),console.log(`[BootLoader] Loading style system: ${e}`);let t=pl[e]||pl[`vl-basic`];try{await Ui(e)}catch(t){throw console.error(`[BootLoader] Failed to load style system: ${e}`,t),t}for(let e of t.stylesheets)try{await a(e)}catch(t){console.warn(`[BootLoader] Failed to load stylesheet: ${e}`,t)}this.updateState({styleSystem:e}),console.log(`[BootLoader] Style system ${e} loaded`)}async loadShell(e,t){this.setPhase(`shell`);let n=fl(e);n!==e&&console.warn(`[BootLoader] Shell "${e}" is temporarily disabled, redirecting to "${n}"`),console.log(`[BootLoader] Loading shell: ${n}`);let r=await br.load(n,t);return this.shellInstance=r,this.updateState({shell:n}),console.log(`[BootLoader] Shell ${n} loaded`),r}async initChannels(e,t){this.setPhase(`channels`);let n=[...new Set(e)];if(n.length===0)return;let r=(t&&n.includes(t)?t:null)??n[0],i=n.filter(e=>e!==r);console.log(`[BootLoader] Initializing primary channel:`,r,i.length?`(+${i.length} deferred)`:``);try{await _t.initChannel(r)}catch(e){console.warn(`[BootLoader] Failed to init primary channel ${r}:`,e)}if(i.length===0){console.log(`[BootLoader] Channels initialized`);return}let a=()=>{(async()=>{for(let e of i)try{await _t.initChannel(e)}catch(t){console.warn(`[BootLoader] Failed to init channel ${e}:`,t)}console.log(`[BootLoader] Deferred channels initialized:`,i)})()};typeof globalThis.requestIdleCallback==`function`?globalThis.requestIdleCallback(a,{timeout:5e3}):globalThis.setTimeout?.(a,0)}updateState(e){Object.assign(this.state,e),this.notifyStateChange()}setPhase(e){this.updateState({phase:e});let t=this.phaseHandlers.get(e);if(t)for(let e of t)try{e(this.state)}catch(e){console.error(`[BootLoader] Phase handler error:`,e)}}notifyStateChange(){for(let e of this.stateChangeHandlers)try{e(this.state)}catch(e){console.error(`[BootLoader] State handler error:`,e)}}onStateChange(e){return this.stateChangeHandlers.add(e),()=>{this.stateChangeHandlers.delete(e)}}onPhase(e,t){return this.phaseHandlers.has(e)||this.phaseHandlers.set(e,new Set),this.phaseHandlers.get(e).add(t),()=>{this.phaseHandlers.get(e)?.delete(t)}}getState(){return{...this.state}}getShell(){return this.shellInstance}savePreferences(e){try{let t=fl(e.shell);localStorage.setItem(`rs-boot-style`,e.styleSystem),localStorage.setItem(`rs-boot-shell`,t),localStorage.setItem(`rs-boot-view`,e.defaultView),localStorage.setItem(`rs-boot-remember`,`1`)}catch(e){console.warn(`[BootLoader] Failed to save preferences:`,e)}}loadPreferences(){try{if(localStorage.getItem(`rs-boot-remember`)!==`1`)return null;let e=fl(localStorage.getItem(`rs-boot-shell`)||`minimal`);return{styleSystem:localStorage.getItem(`rs-boot-style`)||void 0,shell:e,defaultView:localStorage.getItem(`rs-boot-view`)||void 0}}catch{return null}}clearPreferences(){try{localStorage.removeItem(`rs-boot-style`),localStorage.removeItem(`rs-boot-shell`),localStorage.removeItem(`rs-boot-view`),localStorage.removeItem(`rs-boot-remember`),localStorage.removeItem(ft)}catch{}}},hl=ml.getInstance()}));function _l(e){if(e&&typeof e.port==`number`)return e;try{let e=globalThis,t=e.__WEBNATIVE_AUTH__||e.__NEUTRALINO_AUTH__;if(t&&typeof t.port==`number`)return t}catch{}return null}function vl(e){if(!e||typeof e!=`object`)return{};let t=El(e.settings||e.portable),n=El(e.snapshot);if(!Object.keys(t).length&&!Object.keys(n).length)return{};let r=El(t.bridge||n.bridge||El(t.core).bridge),i=El(t.shell||n.shell),a=El(t.core),o=Array.isArray(r.endpoints)?r.endpoints.map(e=>String(e||``).trim()).filter(Boolean):[],s=String(a.endpointUrl||r.endpointUrl||i.remoteHost||o[0]||``).trim(),c=String(a.userId||r.userId||r.deviceId||``).trim(),l=String(a.ecosystemToken||a.userKey||r.userKey||i.accessToken||i.clientToken||``).trim(),u=r.allowInsecureTls===void 0?a.allowInsecureTls===void 0?void 0:!!a.allowInsecureTls:!!r.allowInsecureTls,d=El(a.socket),f={...a};return s&&(f.endpointUrl=s),c&&(f.userId=c),l?(f.userKey=l,f.ecosystemToken=l,f.socket={...d,accessToken:l}):Object.keys(d).length&&(f.socket=d),u!==void 0&&(f.allowInsecureTls=u),f.preferBackendSync===void 0&&(f.preferBackendSync=!0),{...t,core:f,shell:{...i}}}function yl(e){if(e&&typeof e.port==`number`)return e;try{let e=globalThis,t=e.__NEUTRALINO_AUTH__;if(t&&typeof t.port==`number`)return t;let n=e.NL_PORT,r=typeof n==`number`?n:n?Number(n):NaN;if(Number.isFinite(r)){let t=e.NL_KEY??e.NL_TOKEN;return{port:r,key:typeof t==`string`?t:void 0}}}catch{}return null}async function bl(e,t){try{let n=new Headers(t?.headers);n.set(`Content-Type`,`application/json`),e.key&&n.set(`X-API-Key`,e.key);let r=t?.signal??(typeof AbortSignal<`u`&&typeof AbortSignal.timeout==`function`?AbortSignal.timeout(2e3):void 0),i=await fetch(`http://127.0.0.1:${e.port}/service/config`,{...t,headers:n,cache:`no-store`,signal:r});return i.ok?await i.json():null}catch{return null}}async function xl(e,t){try{let n=new Headers(t?.headers);n.set(`Content-Type`,`application/json`),e.key&&n.set(`X-API-Key`,e.key);let r=await fetch(`http://127.0.0.1:${e.port}/neutralino/config`,{...t,headers:n,cache:`no-store`});return r.ok?await r.json():null}catch{return null}}function Sl(e){let t=_l(e);return t?{get:async()=>vl(await bl(t,{method:`GET`})),patch:async e=>vl(await bl(t,{method:`POST`,body:JSON.stringify(e)})),defaults:async()=>(await bl(t,{method:`GET`}))?.defaults??{},snapshot:async()=>(await bl(t,{method:`GET`}))?.snapshot??{}}:null}function Cl(e){let t=yl(e);return t?{get:async()=>{let[e,n]=await Promise.all([bl(t,{method:`GET`}),xl(t,{method:`GET`})]),r=vl(e),i=n?.config??{};return{...r,neutralino:i}},patch:async e=>vl(await bl(t,{method:`POST`,body:JSON.stringify(e)})),defaults:async()=>(await bl(t,{method:`GET`}))?.defaults??{},snapshot:async()=>(await bl(t,{method:`GET`}))?.snapshot??{}}:null}function wl(){try{globalThis.__CWS_NEUTRALINO_BOOT__=!0}catch{}}function Tl(){try{globalThis.__CWS_WEBNATIVE_BOOT__=!0}catch{}}var El,Dl=e((()=>{El=e=>typeof e==`object`&&e&&!Array.isArray(e)?e:{}}));function Ol(){let e=globalThis;return e.__CWS_WEBNATIVE_BOOT__||e.__CWS_NEUTRALINO_BOOT__?`webnative`:e.Capacitor===void 0?e.chrome!==void 0&&e.chrome?.runtime?`crx`:`web`:`capacitor`}function kl(e){Hl=e}function Al(e,t){Vl[e]=t}function jl(e){delete Vl[e]}function Ml(){for(let e of Object.keys(Vl))delete Vl[e]}function Nl(e,t){let n={...e};for(let[e,r]of Object.entries(t)){let t=n[e];typeof r==`object`&&r&&!Array.isArray(r)&&typeof t==`object`&&t&&!Array.isArray(t)?n[e]={...t,...r}:n[e]=r}return n}function Pl(e={},t={}){let n={...e};return{get:async()=>({...n}),patch:async e=>(n=Nl(n,e),{...n}),...t}}function Fl(){return Hl()}function Il(){let e=Hl();return Vl[e]||Vl.web||null}async function Ll(){let e=Il();if(!e)return{};try{return await e.get()}catch{return{}}}async function Rl(e){let t=Il();return t?t.patch(e):{}}async function zl(){let e=Il();if(!e?.defaults)return{};try{return await e.defaults()}catch{return{}}}async function Bl(){let e=Il();if(!e?.snapshot)return{};try{return await e.snapshot()}catch{return{}}}var Vl,Hl,Ul=e((()=>{Vl={},Hl=Ol}));function Wl(e){let t={port:e.port,key:e.key},n=globalThis;return n.__WEBNATIVE_AUTH__={port:e.port,key:e.key},n.__NEUTRALINO_AUTH__=t,n.__CWS_WEBNATIVE_BOOT__=!0,n.__CWS_NEUTRALINO_BOOT__=!0,n.__CWS_NODE_CLIPBOARD_HUB__=!0,t}async function Gl(e){try{let{getRemoteHost:t,getAccessToken:n,getAirPadClientId:r}=await _(async()=>{let{getRemoteHost:e,getAccessToken:t,getAirPadClientId:n}=await import(`./config-CZGbDUv1.js`).then(e=>(e.y(),e.n));return{getRemoteHost:e,getAccessToken:t,getAirPadClientId:n}},[],import.meta.url),i=t().trim(),a=n().trim(),o=r().trim(),s={};if(i&&(s.remoteHost=i),a&&(s.accessToken=a,s.clientToken=a),o&&(s.clientId=o),s.reload=!1,!Object.keys(s).filter(e=>e!==`reload`).length)return;let c=typeof AbortSignal<`u`&&typeof AbortSignal.timeout==`function`?AbortSignal.timeout(2e3):void 0;await fetch(`http://127.0.0.1:${e.port}/service/clipboard-hub`,{method:`POST`,headers:{"Content-Type":`application/json`,"X-API-Key":e.key},body:JSON.stringify(s),cache:`no-store`,signal:c});try{let e=globalThis,t=typeof e.NL_PATH==`string`?e.NL_PATH:``,n=e.Neutralino?.filesystem?.writeFile;t&&n&&await n(`${t}/.tmp/cwsp-hub-auth.json`,JSON.stringify({remoteHost:i||void 0,accessToken:a||void 0,clientToken:a||void 0,clientId:o||void 0,writtenAt:new Date().toISOString()},null,2))}catch{}}catch(e){console.warn(`[CWSP Neutralino] clipboard-hub credential sync skipped`,e)}}function Kl(e){try{let t=Cl(e);t&&Al(`webnative`,t)}catch(e){console.warn(`[CWSP] settings arm registration skipped`,e)}}function ql(){let e=yl();return e&&typeof e.port==`number`&&e.key&&e.port!==8434&&Number(e.port)>1024?{port:e.port,key:String(e.key)}:{port:Ql,key:$l}}async function Jl(){try{let e=globalThis,t=typeof e.NL_PATH==`string`?e.NL_PATH:``,n=e.Neutralino?.filesystem?.readFile;if(!t||!n)return null;let r=await n(`${t}/.tmp/cwsp-control-auth.json`),i=JSON.parse(r);if(typeof i.port==`number`&&typeof i.key==`string`)return{port:i.port,key:i.key}}catch{}return null}function Yl(e=15e3){let t=Date.now()+e;(async()=>{for(;Date.now()<t;){let e=await Jl();if(e){Kl(Wl(e));try{let t=await fetch(`http://127.0.0.1:${e.port}/service/config`,{headers:{"X-API-Key":e.key},cache:`no-store`});if(t.ok){console.log(`[CWSP Neutralino] control host ready`,e.port);try{let e=await t.json(),n=e.settings||e.portable||{},{syncAirpadRemoteConfigFromAppSettings:r}=await _(async()=>{let{syncAirpadRemoteConfigFromAppSettings:e}=await import(`./config-CZGbDUv1.js`).then(e=>(e.y(),e.n));return{syncAirpadRemoteConfigFromAppSettings:e}},[],import.meta.url);r(n,{persist:!0})}catch(e){console.warn(`[CWSP Neutralino] airpad hydrate from portable skipped`,e)}await Gl(e);return}}catch{}}await new Promise(e=>setTimeout(e,400))}console.warn(`[CWSP Neutralino] control host still warming — clipboard/settings will retry on use`)})()}async function Xl(){let e=ql();try{let t=await Promise.race([Jl(),new Promise(e=>setTimeout(()=>e(null),400))]);t&&(e=t)}catch{}let t=Wl(e);Kl(t);try{let e=Sl();e&&!t&&Al(`webnative`,e)}catch{}Yl(),await dl(document.body,`network`);try{document.getElementById(`cwsp-boot-fallback`)?.remove()}catch{}(async()=>{let e=await Jl()||t;Wl(e),await Gl(e)})()}var Zl,Ql,$l,eu=e((()=>{gl(),Dl(),Ul(),ee(),Zl=[`minimal`,`network`,`settings`],Ql=29110,$l=`cwsp-neutralino-local`,document.documentElement.dataset.cwspEnabledViews=Zl.join(`,`),wl(),Tl(),Xl().catch(e=>{console.error(`[CWSP Neutralino] minimal-shell boot failed`,e);try{let t=document.getElementById(`cwsp-boot-fallback`);t&&(t.textContent=`CWSP boot failed: ${e instanceof Error?e.message:String(e)}`)}catch{}})}));e((()=>{eu()}))();export{hn as $,ca as A,Ir as B,K as C,Ro as D,Ic as E,Ni as F,mr as G,Tr as H,ji as I,vn as J,fr as K,ki as L,_a as M,Ci as N,zo as O,Ai as P,gn as Q,Lr as R,Yc as S,ls as T,rr as U,P as V,dr as W,mn as X,Dn as Y,pn as Z,sl as _,Bl as a,$t as at,Qc as b,Nl as c,Nt as ct,Il as d,dt,_n as et,kl as f,pt as ft,ll as g,gl as h,zl as i,en as it,Oa as j,Io as k,Rl as l,vt as lt,ul as m,Pl as n,on as nt,Ll as o,nn as ot,jl as p,pr as q,Fl as r,tn as rt,Ul as s,Yt as st,Ml as t,fn as tt,Al as u,_t as ut,Xc as v,cs as w,Lc as x,rl as y,Pr as z};