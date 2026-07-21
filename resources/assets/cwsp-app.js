import{n as e,r as t}from"./rolldown-runtime-DaJ6WEGw.js";import{G as n,J as r,L as i,Q as a,U as o,V as s,X as c,Y as l,q as u,t as d,w as f}from"./src-CXiRKMoF.js";import{m as p,n as m,nt as h,t as g}from"./src-XPMlSw8I.js";import{n as _,t as v}from"./preload-helper-NDuSAHbO.js";import{_ as y,a as b,f as ee,g as x,h as S,i as C,l as w,m as te,n as T,o as E,p as D,r as ne}from"./UniformInterop-0fYt3kIh.js";import{a as re,c as ie,f as ae,l as oe,m as se,o as ce,r as le,u as ue}from"./UnifiedMessaging-Bb5xrVpZ.js";import{a as de,c as fe,i as pe,o as O}from"./cws-bridge-CRDA1GOm.js";import{D as me,E as he,G as ge,N as _e,O as ve,P as ye,R as be,T as xe,_ as Se,d as Ce,f as we,g as Te,h as Ee,m as De,p as Oe,r as ke,u as Ae,v as je,w as Me,y as Ne}from"./airpad-cwsp-client-parity-BenwfXdR.js";import{n as Pe,r as Fe}from"./SettingsTypes-D6q9S6cT.js";import{C as Ie,D as Le,E as Re,S as ze,T as Be,_ as Ve,a as He,b as Ue,c as We,d as Ge,f as Ke,g as qe,h as Je,i as Ye,k as Xe,l as Ze,m as Qe,o as $e,p as et,r as tt,s as nt,t as rt,u as it,v as at,w as ot,x as st,y as ct}from"./config-DRIOcGx0.js";import{a as k,l as lt,n as A,o as ut}from"./Settings-dFf1YBl9.js";function j(e){return e===`faint`?`tabbed`:e===`base`||e===`minimal`||e===`window`||e===`tabbed`||e===`environment`||e===`content`||e===`immersive`?e:`minimal`}function dt(e){try{let t={shell:j(e),t:Date.now()};globalThis.localStorage?.setItem(pt,JSON.stringify(t))}catch{}}function ft(e){let t=j(e),n=()=>dt(t),r=()=>dt(t),i=globalThis;return i.addEventListener(`focus`,n),i.addEventListener(`pointerdown`,r,{capture:!0,passive:!0}),queueMicrotask(()=>dt(t)),()=>{i.removeEventListener(`focus`,n),i.removeEventListener(`pointerdown`,r,{capture:!0})}}var pt,mt=e((()=>{pt=`rs-boot-shell-last-active`}));function ht(){return _t||=m({channels:gt,logPrefix:`[ServiceChannels]`}),_t}var gt,_t,vt,yt=e((()=>{g(),D(),gt={workcenter:{broadcastName:b.WORK_CENTER,routeHash:w.WORKCENTER,component:E.WORK_CENTER,description:`AI work center for processing files and content`},settings:{broadcastName:b.SETTINGS,routeHash:w.SETTINGS,component:E.SETTINGS,description:`Application settings and configuration`},airpad:{broadcastName:b.SERVICE_AIRPAD,routeHash:w.AIRPAD,component:E.AIRPAD,description:`AirPad remote trackpad/keyboard + clipboard`},network:{broadcastName:b.SERVICE_NETWORK,routeHash:w.NETWORK,component:E.NETWORK,description:`CWSP network status, probes, and endpoint routing`},viewer:{broadcastName:b.MARKDOWN_VIEWER,routeHash:w.MARKDOWN_VIEWER,component:E.MARKDOWN_VIEWER,description:`Content viewer for markdown and files`},explorer:{broadcastName:b.FILE_EXPLORER,routeHash:w.FILE_EXPLORER,component:E.FILE_EXPLORER,description:`File explorer and browser`},print:{broadcastName:b.PRINT_CHANNEL,routeHash:w.PRINT,component:E.BASIC_PRINT,description:`Print preview and export`},history:{broadcastName:b.HISTORY_CHANNEL,routeHash:w.HISTORY,component:E.HISTORY,description:`Action history and undo/redo`},editor:{broadcastName:`rs-editor`,routeHash:w.MARKDOWN_EDITOR,component:E.MARKDOWN_EDITOR,description:`Content editor`},home:{broadcastName:`rs-home`,routeHash:`#home`,component:`home`,description:`Home/landing view`}},_t=null,vt=ht()})),bt,xt,St,Ct,wt=e((()=>{D(),bt={viewer:[`content-view`,`content-load`,`markdown-content`],workcenter:[`content-attach`,`file-attach`,`share-target-input`,`content-share`],explorer:[`file-save`,`navigate-path`,`content-explorer`],editor:[`content-load`,`content-edit`],settings:[`settings-update`],history:[`history-update`],home:[`home-update`],print:[`content-view`]},xt=e=>x(e),St=(e,t)=>{let n=[t,...bt[e.id]||[]];for(let t of n)if(t&&(!e.canHandleMessage||e.canHandleMessage(t)))return t;return null},Ct=(e,t)=>{let n=St(e,t.type);if(!n)return null;let r=typeof t.id==`string`&&t.id.trim()?t.id:void 0;return{...r?{id:r}:{},type:n,data:t.data,metadata:t.metadata}}}));function Tt(e,t){if(typeof BroadcastChannel>`u`)return()=>{};let n=new BroadcastChannel(y(x(e)));return n.addEventListener(`message`,t),()=>{n.removeEventListener(`message`,t),n.close()}}var Et=e((()=>{D(),re()}));function Dt(e){try{if(typeof HTMLElement<`u`&&e instanceof HTMLElement)return e}catch{}return null}function Ot(e){if(!e||typeof e!=`object`)return!1;let t=e,n=e=>typeof File<`u`&&e instanceof File||typeof Blob<`u`&&e instanceof Blob;if(n(t.file)||n(t.blob))return!0;let r=t.files;if(Array.isArray(r)&&r.some(e=>n(e)))return!0;let i=t.attachments;if(Array.isArray(i))for(let e of i){if(!e||typeof e!=`object`)continue;let t=e.data;if(n(t))return!0}return!1}function kt(e){if(!e||typeof e!=`object`)return!1;let t=e;if(Ot(t))return!0;let n=t.data;if(n&&typeof n==`object`&&Ot(n))return!0;let r=t.attachments;if(Array.isArray(r))for(let e of r){if(!e||typeof e!=`object`)continue;let t=e.data;if(typeof File<`u`&&t instanceof File||typeof Blob<`u`&&t instanceof Blob)return!0}return!1}function At(e,t){return Ht.has(String(t||``).toLowerCase())?kt(e):!1}function jt(e,t){return!Ut.has(String(t||``).toLowerCase())}async function Mt(){await new Promise(e=>requestAnimationFrame(()=>e())),await new Promise(e=>queueMicrotask(e))}async function Nt(){await new Promise(e=>requestAnimationFrame(()=>requestAnimationFrame(e))),await new Promise(e=>queueMicrotask(e))}async function Pt(){await Mt()}async function Ft(e,t=Wt){let n=Dt(e);if(!n||n.isConnected)return;let r=typeof document<`u`&&document.documentElement instanceof HTMLElement?document.documentElement:null;r&&await new Promise(e=>{let i=!1,a=()=>{if(!i){i=!0;try{o.disconnect()}catch{}clearTimeout(s),e()}},o=new MutationObserver(()=>{n.isConnected&&a()});o.observe(r,{childList:!0,subtree:!0});let s=setTimeout(a,t)})}function It(e){for(let t of Jt)try{if(e.querySelector(t)||e.shadowRoot?.querySelector(t))return!0}catch{}return!1}function Lt(e,t){let n=String(e||``).toLowerCase();return n===`content-load`||n===`markdown-content`||n===`content-view`||At(t,e)}async function Rt(e,t=Gt){let n=Dt(e);n&&(It(n)||await new Promise(e=>{let r=!1,i=[],a=()=>{if(!r){r=!0;for(let e of i)try{e.disconnect()}catch{}clearTimeout(c),e()}},o=()=>{It(n)&&a()},s=e=>{let t=new MutationObserver(o);t.observe(e,{childList:!0,subtree:!0}),i.push(t)};s(n),n.shadowRoot&&s(n.shadowRoot);let c=setTimeout(a,t);o()}))}async function zt(e,t=Kt){let n=Dt(e);if(n?.isConnected)try{let e=typeof n.getAnimations==`function`?n.getAnimations.bind(n):null,r=e?e({subtree:!0}).filter(e=>e.playState===`running`):[];if(r.length===0)return;await Promise.race([Promise.all(r.map(e=>typeof e?.finished?.then==`function`?e.finished.catch(()=>void 0):Promise.resolve())),new Promise(e=>setTimeout(e,t))])}catch{}}async function Bt(e,t,n){let r=Dt(e),i=Lt(n,t);if(r?.isConnected&&(!i||It(r))){await Mt(),await zt(e,qt);return}await Nt(),await Ft(e,Wt),i&&await Rt(e,Gt),await zt(e,Kt),await Mt()}function Vt(e,t){let n=(Yt.get(e)??Promise.resolve()).then(()=>t()).catch(t=>{console.warn(`[ViewIngress] delivery failed:`,e?.id,t)});return Yt.set(e,n),n}var Ht,Ut,Wt,Gt,Kt,qt,Jt,Yt,Xt=e((()=>{Ht=new Set([`content-share`,`share-target-input`,`share-target-result`,`content-attach`,`file-attach`]),Ut=new Set([`settings-update`,`history-update`,`home-update`]),Wt=220,Gt=280,Kt=160,qt=90,Jt=[`[data-render-target]`,`[data-raw-target]`],Yt=new WeakMap}));function Zt(e){let t=e.data;return t&&typeof t==`object`&&!Array.isArray(t)?t:{}}function Qt(e){return typeof File<`u`&&e instanceof File||typeof Blob<`u`&&e instanceof Blob}function $t(e){if(Qt(e.file)||Qt(e.blob))return!0;let t=e.files;return Array.isArray(t)&&t.some(e=>Qt(e))||String(e.path??e.into??``).trim().length>0||String(e.text??e.content??``).trim().length>0?!0:String(e.url??``).trim().length>0}function en(e,t){let n=String(t||``).toLowerCase();if(!on.has(n))return{ok:!0};let r=Zt(e);if(!$t(r))return{ok:!1,reason:`missing-body-carrier`};let i=r.file;if(typeof File<`u`&&i instanceof File&&i.size>an)return{ok:!1,reason:`file-too-large>${an}`};if(Array.isArray(r.files)){for(let e of r.files)if(typeof File<`u`&&e instanceof File&&e.size>an)return{ok:!1,reason:`files-array-too-large>${an}`}}return{ok:!0}}function tn(e){if(!e||e.length===0)return!1;let t=Math.min(e.length,16384),n=0,r=0;for(let i=0;i<t;i++){let t=e.charCodeAt(i);t===0&&n++,t<32&&t!==9&&t!==10&&t!==13&&r++}if(n>2||r/t>.02&&e.length<64*1024)return!0;let i=e.slice(0,512).trimStart();return!!(i.startsWith(`%PDF`)||i.startsWith(`PK`))}function nn(e,t){let n=e.filter(e=>e instanceof File);if(n.length===0)return null;let r=(t.hintFilename||``).trim().toLowerCase();if(r){let e=n.find(e=>String(e.name||``).trim().toLowerCase()===r);if(e)return e;let t=n.find(e=>String(e.name||``).trim().toLowerCase().endsWith(r));if(t)return t}return n.find(e=>t.isTextLike(e))||(n.find(e=>/\.(md|markdown|mdown|mkdn|mkd)(?:$|\?)/i.test(e.name||``))??n[0]??null)}function rn(e){return e instanceof File?e.size>an?{ok:!1,reason:`file-too-large`}:{ok:!0}:{ok:!1,reason:`not-a-file`}}var an,on,sn=e((()=>{an=48*1024*1024,on=new Set([`content-load`,`content-view`,`markdown-content`,`content-share`,`content-attach`,`file-attach`].map(e=>e.toLowerCase()))})),cn,ln,un,dn,fn,pn,mn,hn,gn,_n,vn=e((()=>{D(),cn=`share-target-data`,ln=`/share-target-data`,un=`/share-target-files`,dn=`/share-target-file/`,fn=()=>typeof globalThis<`u`&&`caches`in globalThis,pn=async e=>{if(!fn())return!1;let t=Array.isArray(e.files)?e.files:[],n=e.meta??{};try{let e=await caches.open(cn),r=Number(n?.timestamp)||Date.now();await e.put(ln,new Response(JSON.stringify({...n,title:n?.title,text:n?.text,url:n?.url,sharedUrl:n?.sharedUrl,source:n?.source||`share-target`,route:n?.route||n?.source||`share-target`,timestamp:r,fileCount:t.length,imageCount:t.filter(e=>(e?.type||``).toLowerCase().startsWith(`image/`)).length}),{headers:{"Content-Type":`application/json`}}));let i=[];for(let n=0;n<t.length;n++){let a=t[n],o=`${dn}${r}-${n}`,s=new Headers;s.set(`Content-Type`,a.type||`application/octet-stream`),s.set(`X-File-Name`,encodeURIComponent(a.name||`file-${n}`)),s.set(`X-File-Size`,String(a.size||0)),s.set(`X-File-LastModified`,String(a.lastModified??0)),await e.put(o,new Response(a,{headers:s})),i.push({key:o,name:a.name||`file-${n}`,type:a.type||`application/octet-stream`,size:a.size||0,lastModified:a.lastModified??void 0})}return await e.put(un,new Response(JSON.stringify({files:i,timestamp:r}),{headers:{"Content-Type":`application/json`}})),!0}catch(e){return console.warn(`[ShareTargetGateway] Failed to store payload to cache:`,e),!1}},mn=async(e={})=>{let t=e.clear!==!1;if(!fn())return null;try{let e=await caches.open(cn),n=await e.match(ln),r=await e.match(un);if(!n&&!r)return null;let i=n?await n.json().catch(()=>null):null,a=r?await r.json().catch(()=>null):null,o=Array.isArray(a?.files)?a.files:[],s=[];for(let t of o){let n=typeof t?.key==`string`?t.key.trim():String(t?.key??``).trim();if(!n)continue;let r=await e.match(n);if(!r)continue;let i=await r.blob();s.push(new File([i],t.name||`shared-file`,{type:t.type||i.type||`application/octet-stream`,lastModified:Number(t.lastModified)||Date.now()}))}if(t){await e.delete(ln).catch(()=>{}),await e.delete(un).catch(()=>{});for(let t of o)t?.key&&await e.delete(t.key).catch(()=>{})}return{meta:i||{},files:s,fileMeta:o}}catch(e){return console.warn(`[ShareTargetGateway] Failed to consume cached payload:`,e),null}},hn=e=>{let t=e?.meta||{},n=Array.isArray(e?.files)?e.files:[],r=Array.isArray(e?.fileMeta)?e.fileMeta:[],i=typeof r[0]?.name==`string`&&r[0].name.trim().length>0?r[0].name.trim():void 0,a=t.hint,o=a&&typeof a==`object`&&!Array.isArray(a)?{...a}:{},s=Object.keys(o).length>0?{...o}:void 0;i&&!n.length&&(typeof o.filename==`string`&&String(o.filename).trim()||(s={...s||o,filename:i}));let c={...t,title:typeof t.title==`string`?t.title:void 0,text:typeof t.text==`string`?t.text:void 0,url:typeof t.url==`string`?t.url:void 0,sharedUrl:typeof t.sharedUrl==`string`?t.sharedUrl:void 0,source:typeof t.source==`string`?t.source:`share-target`,route:typeof t.route==`string`?t.route:typeof t.source==`string`?t.source:`share-target`,timestamp:Number(t.timestamp||Date.now()),files:n,fileCount:n.length||Number(t.fileCount||0),imageCount:Number(t.imageCount||n.filter(e=>(e?.type||``).toLowerCase().startsWith(`image/`)).length)};return s!==void 0&&(c.hint=s),c},gn=async()=>{try{let e=await fetch(C.SW_CONTENT_AVAILABLE);if(!e.ok)return[];let t=await e.json(),n=Array.isArray(t?.cacheKeys)?t.cacheKeys:[],r=[];for(let e of n){let t=String(e?.key||``);if(t)try{let n=await fetch(`${C.SW_CONTENT}/${t}`);if(!n.ok)continue;r.push({key:t,context:String(e?.context||``),content:await n.json()})}catch(e){console.warn(`[ShareTargetGateway] Failed to fetch SW cache item:`,e)}}return r}catch(e){return console.warn(`[ShareTargetGateway] Failed to fetch SW cache entries:`,e),[]}},_n=async(e=`latest`)=>{try{let t=await fetch(`/share-target-files?cacheKey=${encodeURIComponent(e)}`);if(!t.ok)return[];let n=await t.json(),r=Array.isArray(n?.files)?n.files:[],i=[];for(let e of r){let t=typeof e?.key==`string`?e.key:``;if(t)try{let n=await fetch(t);if(!n.ok)continue;let r=await n.blob();i.push(new File([r],e.name||`shared-file`,{type:e.type||r.type||`application/octet-stream`}))}catch(e){console.warn(`[ShareTargetGateway] Failed to fetch file from cache:`,e)}}return i}catch(e){return console.warn(`[ShareTargetGateway] Failed to fetch cached share files:`,e),[]}}}));function yn(e,t){return typeof t!=`number`||!Number.isFinite(t)?!1:(M.get(e)??0)!==t}function bn(e,t){let n=e.metadata&&typeof e.metadata==`object`&&!Array.isArray(e.metadata)?e.metadata:{};return{...e,metadata:{...n,[Tn]:t}}}function xn(e,t={}){if(!e.handleMessage)return()=>{};let n=t.destination||xt(String(e.id||``)),r=t.componentId||`view:${e.id}`,i=ee(n),a={canHandle:e=>te(e.destination,n),handle:async t=>{await Dn(e,t)}},o=new Set;for(let e of i){let t=`${r}:${e}`;ie(t,e),oe(e,a);let n=ce(t);if(n.length>0)for(let e of n)o.has(e.id)||(o.add(e.id),a.handle(e))}let s=Tt(x(n),t=>{let r=t.data;if(!(!r||typeof r!=`object`)){if(r.type===`view-transfer`&&r.message&&typeof r.message==`object`){Dn(e,ne(r.message));return}if(r.type===`view-post`){let t=x(r.viewId);if(t!==x(String(e.id||n)))return;let i={id:typeof r.id==`string`?String(r.id):crypto.randomUUID(),type:`view-post`,destination:t,source:`view-channel`,data:{bodyText:String(r.bodyText||``),contentType:String(r.contentType||``),viewId:t},metadata:{source:`view-channel`,destination:t}},a=Sn(e);Vt(e,async()=>{M.get(e)===a&&(jt(i,`view-post`)&&await Bt(e,i,`view-post`),M.get(e)===a&&await e.handleMessage?.(bn({type:`view-post`,data:{bodyText:String(r.bodyText||``),contentType:String(r.contentType||``),viewId:t},metadata:i.metadata},a)))})}}});return()=>{for(let e of i)se(e,a);s()}}var M,Sn,Cn,wn,Tn,En,Dn,On=e((()=>{wt(),Et(),Xt(),sn(),yt(),D(),vn(),re(),T(),M=new WeakMap,Sn=e=>{let t=(M.get(e)??0)+1;return M.set(e,t),t},Cn=new Map,wn=600,Tn=`__ingressStamp`,En=e=>{for(let[t,n]of Cn)e-n>wn&&Cn.delete(t)},Dn=async(e,t)=>{let n=typeof t.id==`string`?t.id.trim():``;if(n){let t=x(xt(String(e.id||``))),r=Date.now();En(r);let i=`${t}::${n}`,a=Cn.get(i);if(a!==void 0&&r-a<wn)return;Cn.set(i,r)}let r=Ct(e,t);if(!r)return;let i=en(t,r.type);if(!i.ok){console.warn(`[ViewIngress] Skipped malformed envelope:`,i.reason,r.type);return}let a=Sn(e);await Vt(e,async()=>{M.get(e)===a&&(jt(t,r.type)&&await Bt(e,t,r.type),M.get(e)===a&&await e.handleMessage?.(bn(r,a)))})}}));function kn(e){if(!e||typeof e!=`object`)return!1;let t=e;return typeof t.handleMessage==`function`&&typeof t.id==`string`&&t.id.trim().length>0}function An(e){if(!e?.trim())return null;try{let t=JSON.parse(e);return t&&typeof t==`object`?t:null}catch{return null}}function jn(e){let t=S(String(e.destination??``))||String(e.destination??``).trim();return t?{id:typeof e.id==`string`?e.id:crypto.randomUUID(),type:String(e.type||`content-share`),source:typeof e.source==`string`?e.source:`dom-staged-unified`,destination:t,contentType:typeof e.contentType==`string`?e.contentType:void 0,data:e.data??e.payload??{},metadata:{timestamp:Date.now(),...typeof e.metadata==`object`&&e.metadata?e.metadata:{}}}:null}function Mn(e){let t=e.getAttribute(`data-cw-unified-defer-flush`);if(!t?.trim())return null;let n=t.trim();if(n.startsWith(`{`)){let e=An(n)?.destination;return typeof e==`string`?e:null}return n}function Nn(e){let t=Mn(e);t&&(ue(S(t)||x(t)).catch(()=>void 0),e.removeAttribute(`data-cw-unified-defer-flush`))}function Pn(e){let t=An(e.getAttribute(`data-cw-unified-pending`));if(!t)return;let n=jn(t);n?.destination&&(le(n.destination,n),e.removeAttribute(`data-cw-unified-pending`))}function Fn(e){let t=An(e.getAttribute(`data-cw-unified-mail`));if(!t)return;let n=S(String(t.destination||``))||String(t.destination||``).trim();n&&(ae({type:String(t.type||`dispatch`),destination:n,source:typeof t.source==`string`?t.source:`dom-staged-mail`,data:t.data??t.payload??{},contentType:typeof t.contentType==`string`?t.contentType:void 0,metadata:typeof t.metadata==`object`&&t.metadata?t.metadata:{},purpose:Array.isArray(t.purpose)?t.purpose:typeof t.purpose==`string`?[t.purpose]:[`mail`,`deliver`],op:typeof t.op==`string`?t.op:`deliver`,protocol:typeof t.protocol==`string`?t.protocol:void 0}).catch(()=>void 0),e.removeAttribute(`data-cw-unified-mail`))}function In(e){let t=new Set;e.matches(`[data-cw-unified-pending], [data-cw-unified-mail], [data-cw-unified-defer-flush]`)&&t.add(e);for(let n of e.querySelectorAll(Wn))t.add(n);for(let e of t)e.isConnected&&(Nn(e),Pn(e),Fn(e))}function Ln(e,t){let n=t||xt(String(e.id||``)),r=ee(n),i=new Set;for(let e of[n,...r]){let t=S(e)||String(e||``).trim();t&&i.add(x(t))}(async()=>{for(let e of i)try{await ue(e)}catch{}})()}function Rn(e,t,n){let r=!1;return()=>{r||(r=!0,n(),Gn.delete(e),Kn.get(t)===e&&Kn.delete(t))}}function zn(e,t={}){if(!e.handleMessage)return()=>{};let n=Gn.get(e);if(n)return n;let r=t.destination||xt(String(e.id||``)),i=x(r),a=Kn.get(i);a&&a!==e&&Gn.get(a)?.();let o=xn(e,{...t,destination:r});Ln(e,r);let s=Rn(e,i,o);return Gn.set(e,s),Kn.set(i,e),s}function Bn(e){Gn.get(e)?.()}function Vn(e,t){let n=[e];for(;n.length;){let e=n.pop();if(e.nodeType===Node.ELEMENT_NODE){let r=e;t(r);let i=r.shadowRoot;if(i)for(let e=i.childNodes.length-1;e>=0;e--)n.push(i.childNodes[e]);for(let e=r.childNodes.length-1;e>=0;e--)n.push(r.childNodes[e])}}}function Hn(e,t,n){t.has(n)||(t.add(n),e.observe(n,{childList:!0,subtree:!0}))}function Un(e={}){let t=e.root instanceof Document?e.root.documentElement:e.root??document.documentElement;if(!t||typeof MutationObserver>`u`)return()=>{};let n=new WeakSet,r=()=>{},i=e=>{Vn(e,e=>{kn(e)&&(e.isConnected||Bn(e))})},a=new MutationObserver(e=>{for(let t of e)t.addedNodes.forEach(r),t.removedNodes.forEach(i)});return r=e=>{if(e.nodeType===Node.ELEMENT_NODE){let t=e;t.isConnected&&In(t)}Vn(e,e=>{e.shadowRoot&&Hn(a,n,e.shadowRoot),!(!e.isConnected||!kn(e))&&zn(e)})},Hn(a,n,t),r(t),()=>{a.disconnect(),Vn(t,e=>{kn(e)&&Bn(e)})}}var Wn,Gn,Kn,qn=e((()=>{D(),re(),On(),wt(),Wn=`[data-cw-unified-pending], [data-cw-unified-mail], [data-cw-unified-defer-flush]`,Gn=new WeakMap,Kn=new Map})),Jn,Yn,Xn,Zn,Qn,$n,er,tr,nr,rr,ir,ar,or,sr,cr,lr,ur,dr,fr,pr,mr,hr=e((()=>{Jn=`viewer`,Yn=`editor`,Xn=`workcenter`,Zn=`explorer`,Qn=`settings`,$n=`history`,er=`home`,tr=`print`,nr=`airpad`,rr=`network`,ir=`viewer`,ar={network:rr,airpad:nr,settings:Qn,viewer:Jn,editor:Yn,workcenter:Xn,explorer:Zn,history:$n,home:er,print:tr},or=()=>{let e=``;try{let t=globalThis?.location?.search;if(t){let n=new URLSearchParams(t);e=String(n.get(`views`)||n.get(`enabledViews`)||``)}}catch{}if(!e)try{e=String(globalThis?.localStorage?.getItem?.(`rs-enabled-views`)??``)}catch{}if(!e)try{e=`minimal,network,settings`}catch{}if(!e)try{e=String({}.VITE_ENABLED_VIEWS??``)}catch{}let t=e.split(/[\s,;]+/).map(e=>e.trim().toLowerCase()).filter(Boolean);if(!t.length)return null;t.push(`settings`);try{let e=globalThis?.location?.search;e&&new URLSearchParams(e).get(`views`)&&globalThis?.localStorage?.setItem?.(`rs-enabled-views`,Array.from(new Set(t)).join(`,`))}catch{}return new Set(t)},sr=or(),cr={viewer:!1,editor:!1,workcenter:!1,explorer:!1,settings:!0,history:!1,home:!1,print:!1,airpad:!1,network:!0},lr=e=>cr[String(e).toLowerCase()]!==!1,ur=e=>!sr||sr.has(String(e).toLowerCase()),dr=e=>lr(e)&&ur(e),fr=Object.entries(ar).filter(([e,t])=>!!t&&dr(e)).map(([e])=>e),pr=e=>!!ar[e]&&dr(e),mr=(e=ir,t=ir)=>pr(e)?e:pr(t)?t:fr.length>0?fr[0]:`viewer`}));function gr(e){if(e instanceof HTMLElement)return e;let t=e;if(t&&typeof t.render==`function`&&typeof t.id==`string`)return t;throw Error(`View factory must return an HTMLElement or a legacy view with render() and id`)}function _r(){xr.register({id:`immersive`,name:`Immersive`,description:"Chromeless immersive shell (standalone pages, extensions, embedded); legacy boot id `base` aliases here.",loader:()=>v(()=>import(`./_cwsp-disabled-entry_shell-immersive-CZayJgAL.js`),[],import.meta.url)}),xr.register({id:`minimal`,name:`Minimal`,description:`Minimal toolbar-based navigation`,loader:()=>v(()=>import(`./preview-BrXeDNvv.js`),[],import.meta.url)}),xr.register({id:`content`,name:`Content`,description:`CRX content shell with overlay-focused layering`,loader:()=>v(()=>import(`./_cwsp-disabled-entry_shell-content-Cb9BwHbt.js`),[],import.meta.url)}),xr.register({id:`immersive`,name:`Immersive`,description:`Chromeless immersive host (extensions / embedded)`,loader:()=>v(()=>import(`./_cwsp-disabled-entry_shell-immersive-CZayJgAL.js`),[],import.meta.url)})}function vr(){N.register({id:`viewer`,name:`Viewer`,icon:`eye`,loader:()=>v(()=>import(`./_cwsp-disabled-entry_view-viewer-CeLlddQ8.js`),[],import.meta.url)}),N.register({id:`workcenter`,name:`Work Center`,icon:`lightning`,loader:()=>v(()=>import(`./_cwsp-disabled-entry_view-workcenter-DV1PlEAR.js`),[],import.meta.url)}),N.register({id:`settings`,name:`Settings`,icon:`gear`,loader:()=>v(()=>import(`./src-Ly5EK2r1.js`),[],import.meta.url)}),N.register({id:`airpad`,name:`AirPad`,icon:`hand-pointing`,loader:()=>v(()=>import(`./_cwsp-disabled-entry_view-airpad-moeIfx22.js`),[],import.meta.url)}),N.register({id:`network`,name:`Network`,icon:`wifi-high`,loader:()=>v(()=>import(`./src-BwianA21.js`),[],import.meta.url)}),N.register({id:`history`,name:`History`,icon:`clock-counter-clockwise`,loader:()=>v(()=>import(`./_cwsp-disabled-entry_view-history-Cj5aZTmP.js`),[],import.meta.url)}),N.register({id:`explorer`,name:`Explorer`,icon:`folder`,loader:()=>v(()=>import(`./_cwsp-disabled-entry_view-explorer-D-8MVImu.js`),[],import.meta.url)}),N.register({id:`editor`,name:`Editor`,icon:`pencil`,loader:()=>v(()=>import(`./_cwsp-disabled-entry_view-editor-BtWewwh9.js`),[],import.meta.url)}),N.register({id:`home`,name:`Home`,icon:`house`,loader:()=>v(()=>import(`./_cwsp-disabled-entry_view-home-gqgAY_Ff.js`),[],import.meta.url)}),N.register({id:`print`,name:`Print`,icon:`printer`,loader:()=>v(()=>import(`./_cwsp-disabled-entry_view-viewer-CeLlddQ8.js`),[],import.meta.url)})}function yr(){_r(),vr()}var br,xr,Sr,N,Cr,wr,Tr,Er=e((()=>{qn(),hr(),_(),br=class{shells=new Map;loadedShells=new Map;resolveShellRegistrationKey(e){return e===`base`?`immersive`:e}register(e){this.shells.set(e.id,e)}get(e){return this.shells.get(this.resolveShellRegistrationKey(e))}getAll(){return Array.from(this.shells.values())}async load(e,t){let n=this.resolveShellRegistrationKey(e),r=this.loadedShells.get(n);if(r)return r;let i=this.shells.get(n);if(!i)throw Error(`Shell not found: ${n}`);let a=await i.loader(),o=a.default||a.createShell;if(typeof o!=`function`)throw Error(`Invalid shell module: ${n}`);let s=o(t);return this.loadedShells.set(n,s),s}unload(e){let t=this.resolveShellRegistrationKey(e),n=this.loadedShells.get(t);n&&(n.unmount(),this.loadedShells.delete(t))}isLoaded(e){return this.loadedShells.has(this.resolveShellRegistrationKey(e))}getLoaded(e){return this.loadedShells.get(this.resolveShellRegistrationKey(e))}},xr=new br,Sr=class e{static isCustomElementClassCtor(e){if(typeof e!=`function`)return!1;try{let t=e.prototype;return t!=null&&typeof HTMLElement<`u`&&HTMLElement.prototype.isPrototypeOf(t)}catch{return!1}}resolveViewFactory(t){let n=[t?.default,t?.createView,t?.createAirpadView,t?.createWorkCenterView,t?.createViewerView,t?.createExplorerView,t?.createSettingsView,t?.createNetworkView,t?.createHistoryView,t?.createHomeView];for(let t of n)if(typeof t==`function`){if(e.isCustomElementClassCtor(t)){let e=t;return(t=>new e(t))}return t}let r=Object.values(t||{});for(let e of r)if(typeof e==`function`&&e.prototype&&typeof e.prototype.render==`function`){let t=e;return e=>new t(e)}return null}views=new Map;loadedViews=new Map;viewReceiveCleanup=new Map;register(e){this.views.set(e.id,e)}get(e){return this.views.get(e)}getAll(){return Array.from(this.views.values())}async load(e,t){let n=this.loadedViews.get(e);if(n)return n;let r=this.views.get(e);if(!r)throw Error(`View not found: ${e}`);let i=await r.loader(),a=this.resolveViewFactory(i);if(!a)throw Error(`Invalid view module: ${e}`);let o=gr(await a(t)),s=this.viewReceiveCleanup.get(e);return s&&(s(),this.viewReceiveCleanup.delete(e)),this.loadedViews.set(e,o),this.viewReceiveCleanup.set(e,zn(o,{destination:String(e),componentId:`view:${e}`})),o}unload(e){let t=this.loadedViews.get(e);t?.lifecycle?.onUnmount&&t.lifecycle.onUnmount();let n=this.viewReceiveCleanup.get(e);n&&(n(),this.viewReceiveCleanup.delete(e)),this.loadedViews.delete(e)}isLoaded(e){return this.loadedViews.has(e)}getLoaded(e){return this.loadedViews.get(e)}prefetchModule(e){let t=this.views.get(e);t&&t.loader().catch(()=>{})}},N=new Sr,Cr={id:`auto`,name:`Auto`,colorScheme:`auto`},wr={id:`light`,name:`Light`,colorScheme:`light`},Tr={id:`dark`,name:`Dark`,colorScheme:`dark`}}));function Dr(){if(kr){console.debug(`[LayerManager] Already initialized`);return}if(typeof document>`u`){console.warn(`[LayerManager] No document available (SSR context?)`);return}let e=[...Or].sort((e,t)=>e.order-t.order).map(e=>e.name),t=`@layer ${e.join(`, `)};`,n=document.createElement(`style`);n.id=`css-layer-init`,n.setAttribute(`data-layer-manager`,`true`),n.textContent=t;let r=document.head;r.insertBefore(n,r.firstChild),Ar=n,kr=!0,console.log(`[LayerManager] Initialized ${e.length} layers`)}var Or,kr,Ar,jr=e((()=>{Or=[{name:`ux-normalize`,category:`system`,order:0,description:`Veela normalize layer`},{name:`layer.reset`,category:`system`,order:0,description:`CSS reset rules`},{name:`layer.normalize`,category:`system`,order:10,description:`Normalize browser defaults`},{name:`tokens`,category:`system`,order:20,description:`Legacy tokens layer`},{name:`ux-tokens`,category:`system`,order:20,description:`Veela token layer`},{name:`layer.tokens`,category:`system`,order:20,description:`CSS custom properties (variables)`},{name:`base`,category:`system`,order:30,description:`Legacy base layer`},{name:`ux-base`,category:`system`,order:30,description:`Veela base layer`},{name:`layout`,category:`system`,order:40,description:`Legacy layout layer`},{name:`ux-layout`,category:`system`,order:40,description:`Veela layout layer`},{name:`components`,category:`system`,order:50,description:`Legacy components layer`},{name:`ux-components`,category:`system`,order:50,description:`Veela components layer`},{name:`utilities`,category:`system`,order:60,description:`Legacy utilities layer`},{name:`ux-utilities`,category:`system`,order:60,description:`Veela utilities layer`},{name:`ux-theme`,category:`system`,order:70,description:`Veela theme layer`},{name:`ux-overrides`,category:`system`,order:80,description:`Veela overrides layer`},{name:`layer.properties.shell`,category:`system`,order:30,description:`Shell context custom properties`},{name:`layer.properties.views`,category:`system`,order:35,description:`View context custom properties`},{name:`layer.runtime.base`,category:`runtime`,order:100,description:`Veela runtime base styles`},{name:`layer.runtime.components`,category:`runtime`,order:110,description:`Reusable component styles`},{name:`layer.runtime.forms`,category:`runtime`,order:115,description:`Form element base styles`},{name:`layer.runtime.utilities`,category:`runtime`,order:120,description:`Utility classes`},{name:`layer.runtime.animations`,category:`runtime`,order:130,description:`Keyframes and animation definitions`},{name:`layer.boot`,category:`runtime`,order:140,description:`Boot/choice screen styles`},{name:`boot.tokens`,category:`runtime`,order:142,description:`Boot tokens layer`},{name:`boot.base`,category:`runtime`,order:144,description:`Boot base layer`},{name:`boot.components`,category:`runtime`,order:146,description:`Boot components layer`},{name:`boot.responsive`,category:`runtime`,order:148,description:`Boot responsive adjustments`},{name:`layer.shell.common`,category:`shell`,order:200,description:`Shared shell styles`},{name:`shell.tokens`,category:`shell`,order:202,description:`Legacy shell tokens`},{name:`shell.base`,category:`shell`,order:204,description:`Legacy shell base`},{name:`shell.components`,category:`shell`,order:206,description:`Legacy shell components`},{name:`shell.utilities`,category:`shell`,order:208,description:`Legacy shell utilities`},{name:`shell.overrides`,category:`shell`,order:209,description:`Legacy shell overrides`},{name:`layer.shell.raw`,category:`shell`,order:210,description:`Raw shell (minimal)`},{name:`layer.shell.minimal`,category:`shell`,order:220,description:`Minimal shell (toolbar navigation)`},{name:`layer.shell.minimal.layout`,category:`shell`,order:222,description:`Minimal shell layout rules`},{name:`layer.shell.minimal.components`,category:`shell`,order:224,description:`Minimal shell component styles`},{name:`layer.shell.window`,category:`shell`,order:226,description:`Window shell (desktop/process frames)`},{name:`layer.shell.faint`,category:`shell`,order:230,description:`Faint shell (tabbed sidebar)`},{name:`layer.shell.faint.layout`,category:`shell`,order:232,description:`Faint shell layout`},{name:`layer.shell.faint.sidebar`,category:`shell`,order:234,description:`Faint shell sidebar`},{name:`layer.shell.faint.toolbar`,category:`shell`,order:236,description:`Faint shell toolbar`},{name:`layer.shell.faint.forms`,category:`shell`,order:238,description:`Faint shell form components`},{name:`layer.view.common`,category:`view`,order:300,description:`Shared view styles`},{name:`layer.view.viewer`,category:`view`,order:310,description:`Markdown viewer`},{name:`layer.view.workcenter`,category:`view`,order:320,description:`Work center (AI prompts)`},{name:`layer.view.workcenter.keyframes`,category:`view`,order:322,description:`Work center animations`},{name:`view.workcenter`,category:`view`,order:324,description:`Work center styles (legacy name)`},{name:`view.workcenter.animations`,category:`view`,order:326,description:`Work center animations (legacy name)`},{name:`layer.view.settings`,category:`view`,order:330,description:`Settings view`},{name:`layer.view.explorer`,category:`view`,order:340,description:`File explorer`},{name:`layer.view.history`,category:`view`,order:350,description:`History view`},{name:`layer.view.editor`,category:`view`,order:360,description:`Editor view`},{name:`layer.view.editor.markdown`,category:`view`,order:362,description:`Markdown editor sublayer`},{name:`layer.view.editor.quill`,category:`view`,order:364,description:`Quill editor sublayer`},{name:`layer.view.home`,category:`view`,order:380,description:`Home/landing view`},{name:`layer.view.print`,category:`view`,order:390,description:`Print view`},{name:`view-explorer`,category:`view`,order:392,description:`Explorer legacy layered scope`},{name:`view-transitions`,category:`override`,order:850,description:`View Transition API named targets and keyframes`},{name:`layer.override.theme`,category:`override`,order:900,description:`Theme customizations`},{name:`layer.override.print`,category:`override`,order:910,description:`Print media styles`},{name:`layer.override.a11y`,category:`override`,order:920,description:`Accessibility enhancements`}],kr=!1})),Mr=e((()=>{})),Nr,Pr,Fr,Ir,Lr=e((()=>{Nr=()=>globalThis?.location,Pr=()=>Nr()?.origin,Fr=(e,t)=>{let n=e?.trim?.()||``;if(!n)return!1;let r=t??Pr();if(typeof URL?.canParse==`function`)return URL.canParse(n,r);try{return new URL(n,r),!0}catch{return!1}},Ir=e=>{if(typeof globalThis?.requestAnimationFrame==`function`){globalThis.requestAnimationFrame(e);return}globalThis.setTimeout(e,0)}})),Rr=e((()=>{d()})),zr,Br,Vr,Hr,Ur,Wr,Gr,Kr,qr,Jr,Yr,Xr,Zr,Qr,$r,ei,ti,ni,ri,ii,ai,oi,si,ci,li,ui,di,fi,pi,mi,hi,gi,_i,vi,yi,bi,xi,Si,Ci=e((()=>{i(),d(),l(),Rr(),Lr(),zr=`cw::workspace::speed-dial`,Br=`${zr}::meta`,Vr=e=>typeof structuredClone==`function`?structuredClone(u(e)):r.parse(r.stringify(e)),Hr=()=>typeof crypto<`u`&&typeof crypto.randomUUID==`function`?crypto.randomUUID():`sd-${Date.now().toString(36)}-${Math.floor(Math.random()*1e3)}`,Ur=[{id:`shortcut-docs`,cell:s([0,1]),icon:`book-open-text`,label:`Docs`,action:`open-link`,meta:{href:`https://github.com/fest-live`,description:`Project documentation`}},{id:`shortcut-roadmap`,cell:s([1,1]),icon:`signpost`,label:`Roadmap`,action:`open-link`,meta:{href:`https://github.com/u2re-space/unite-2.man`,description:`Manifest notes`}},{id:`shortcut-fest-live`,cell:s([2,1]),icon:`github-logo`,label:`Fest Live`,action:`open-link`,meta:{href:`https://github.com/fest-live`,description:`Fest Live Organization`}},{id:`shortcut-l2ne-dev`,cell:s([3,1]),icon:`user`,label:`L2NE Dev`,action:`open-link`,meta:{href:`https://github.com/L2NE-dev`,description:`L2NE Developer Profile`}},{id:`shortcut-u2re-space`,cell:s([0,2]),icon:`planet`,label:`U2RE Space`,action:`open-link`,meta:{href:`https://github.com/u2re-space/`,description:`U2RE Space Organization`}},{id:`shortcut-telegram`,cell:s([1,2]),icon:`telegram-logo`,label:`Telegram`,action:`open-link`,meta:{href:`https://t.me/u2re_space`,description:`U2RE Space Telegram`}}],Wr=[{id:`shortcut-explorer`,cell:s([2,0]),icon:`books`,label:`Explorer`,action:`open-view`,meta:{view:`explorer`}},{id:`shortcut-settings`,cell:s([3,0]),icon:`gear-six`,label:`Settings`,action:`open-view`,meta:{view:`settings`}},...Ur],Gr=e=>{let t=[],n=[];return e.forEach(e=>{let{meta:r,...i}=e;t.push(i);let a={action:e.action,...r||{}};n.push([e.id,a])}),{records:t,metaEntries:n}},{records:Kr,metaEntries:qr}=Gr(Wr),Jr=[],Yr=e=>e&&Array.isArray(e)&&e.length>=2?s([Number(e[0])||0,Number(e[1])||0]):s([0,0]),Xr=(e={})=>n(s({action:e.action||`open-view`,view:e.view||``,href:e.href||``,description:e.description||``,entityType:e.entityType||``,tags:Array.isArray(e.tags)?[...e.tags]:[],...e})),Zr=e=>{let t=new Map;for(let[n,r]of e)t.set(n,Xr(r));return t},Qr=e=>e?e instanceof Map?Array.from(e.entries()):Array.isArray(e)?e.map(e=>e&&typeof e==`object`&&`id`in e?[e.id,e.meta||e]:null).filter(Boolean):typeof e==`object`?Object.entries(e):[]:[],$r=e=>{let t={};return e?.forEach((e,n)=>{t[n]=Vr(e??{})}),t},ei=()=>Zr(qr),ti=e=>{let t=Qr(e);return Zr(t.length?t:qr)},ni=(e,t)=>e&&typeof e==`object`&&`value`in e?e.value??t:e??t,ri=e=>({id:e.id,cell:s([e.cell?.[0]??0,e.cell?.[1]??0]),icon:ni(e.icon,`sparkle`),label:ni(e.label,`Shortcut`),action:e.action}),ii=e=>s({id:e.id||Hr(),cell:s(Yr(e.cell)),icon:o(e.icon||`sparkle`),label:o(e.label||`Shortcut`),action:e.action||`open-view`}),ai=()=>s(Kr.map(ii)),oi=e=>s((Array.isArray(e)&&e.length?e:Wr).map(e=>{let{meta:t,...n}=e;return t?Jr.push([e.id,{action:e.action,...t}]):Jr.push([e.id,{action:e.action}]),n}).map(ii)),si=e=>e.map(ri),ci=f(Br,ei,ti,$r),li=f(zr,ai,oi,si),ui=()=>li?.$save?.(),di=()=>ci?.$save?.(),fi=e=>e?ci?.get?.(e)??null:null,pi=(e,t={})=>{let n=ci?.get?.(e);return n||(n=Xr(t),ci?.set?.(e,n),di()),t?.action&&n.action!==t.action&&(n.action=t.action),n},mi=e=>{if(!e)return!1;let t=e.action||`open-view`,n=pi(e.id,{action:t});return n.action===t?!1:(n.action=t,!0)},hi=()=>{let e=!1;li?.forEach?.(t=>{mi(t)&&(e=!0)}),e&&di()},gi=()=>{Jr.length&&(Jr.forEach(([e,t])=>{let n=pi(e,t);Object.assign(n,t)}),Jr.length=0,di())},gi(),hi(),_i=()=>{let e=!1;Ur.forEach(t=>{if(li?.find?.(e=>e?.id===t.id)){let n=fi(t.id);t.meta&&n?(t.meta.href!==n.href&&(n.href=t.meta.href,e=!0),t.meta.description!==n.description&&(n.description=t.meta.description,e=!0)):t.meta&&!n&&(pi(t.id,t.meta),e=!0)}else{let n=ii(t);t.label&&n.label&&typeof n.label==`object`&&`value`in n.label&&(n.label.value=t.label),t.icon&&n.icon&&typeof n.icon==`object`&&`value`in n.icon&&(n.icon.value=t.icon),li.push(s(n)),pi(n.id,t.meta),e=!0}}),e&&(ui(),di())},_i(),vi=`cw::workspace::wallpaper`,f(vi,()=>s({src:`/assets/wallpaper.jpg`,opacity:1,blur:0}),e=>s(e||{src:`/assets/wallpaper.jpg`,opacity:1,blur:0}),e=>({...e})),yi=`cw::workspace::grid-layout`,bi=f(yi,()=>s({columns:4,rows:8,shape:`square`}),e=>s(e||{columns:4,rows:8,shape:`square`}),e=>({...e})),xi=()=>bi?.$save?.(),Si=e=>{let t=e?.grid||bi,n=t?.columns??4,r=t?.rows??8,i=t?.shape??`square`;bi&&(bi.columns=n,bi.rows=r,bi.shape=i,xi()),!(typeof document>`u`)&&(document.querySelectorAll(`.speed-dial-grid`).forEach(e=>{let t=e;t.dataset.gridColumns=String(n),t.dataset.gridRows=String(r),t.dataset.gridShape=i}),document.documentElement.dataset.gridColumns=String(n),document.documentElement.dataset.gridRows=String(r),document.documentElement.dataset.gridShape=i)},typeof globalThis<`u`&&typeof document<`u`&&Ir(()=>Si())})),wi=t({applyTheme:()=>ji,cssBackgroundToOpaqueHex:()=>Ti,initTheme:()=>Ni,resyncThemeAfterAdoptedViewSheet:()=>Mi,samplePwaToolbarBackgroundColor:()=>Ei,syncBrowserChromeTheme:()=>Ai}),Ti,Ei,Di,Oi,ki,Ai,ji,Mi,Ni,Pi=e((()=>{k(),Ci(),Ti=e=>{let t=e.trim();if(!t||t===`transparent`)return null;let n=t.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);if(n){let e=n[1];return e.length===3&&(e=e[0]+e[0]+e[1]+e[1]+e[2]+e[2]),`#${e.toLowerCase()}`}let r=t.match(/^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)(?:\s*,\s*([\d.]+))?\s*\)$/i);if(!r)return null;let i=r[4]===void 0?1:Number(r[4]);return!Number.isFinite(i)||i<.98?null:`#${[Math.max(0,Math.min(255,Math.round(Number(r[1])))),Math.max(0,Math.min(255,Math.round(Number(r[2])))),Math.max(0,Math.min(255,Math.round(Number(r[3]))))].map(e=>e.toString(16).padStart(2,`0`)).join(``)}`},Ei=()=>{if(typeof document>`u`)return null;let e=document.querySelectorAll(`[data-shell]`);for(let t of e){let e=t.shadowRoot;if(!e)continue;let n=e.querySelector(`.app-shell__nav, .app-shell__toolbar`);if(!n)continue;let r=getComputedStyle(n).backgroundColor,i=Ti(r);if(i)return i}return null},Di=e=>e===`dark`||e===`light`?e:globalThis.matchMedia?.(`(prefers-color-scheme: dark)`)?.matches?`dark`:`light`,Oi=e=>{switch(e){case`small`:return`14px`;case`large`:return`18px`;default:return`16px`}},ki=e=>{try{document.querySelectorAll(`[data-shell]`).forEach(t=>{let n=t;n.dataset.theme=e,n.style.colorScheme=e;let r=n.shadowRoot?.querySelector?.(`.app-shell`);r&&(r.dataset.theme=e,r.style.colorScheme=e)})}catch{}},Ai=(e,t)=>{if(typeof document>`u`)return;let n=document.documentElement,r=t===`dark`?`dark`:t===`light`?`light`:`auto`;n.setAttribute(`data-scheme`,r),n.setAttribute(`data-theme`,e),n.style.colorScheme=e;try{let t=document.body;t&&(t.style.colorScheme=e)}catch{}try{document.querySelectorAll(`[data-shell='content']`).forEach(t=>{t.style.colorScheme=e})}catch{}if(globalThis?.__LURE_DYNAMIC_THEME_PRIORITY__!==!0){let t=()=>{if(globalThis?.__LURE_DYNAMIC_THEME_PRIORITY__===!0)return;let t=document.querySelector(`meta[name="theme-color"]`);if(!t)return;let n=Ei(),r=e===`dark`?`#0f1419`:`#007acc`;t.setAttribute(`content`,n??r)};t(),requestAnimationFrame(t)}ki(e)},ji=e=>{if(typeof document>`u`||!e)return;let t=document.documentElement,n=e.appearance?.theme||`auto`,r=Di(n);Ai(r,n),t.style.fontSize=Oi(e.appearance?.fontSize),e.appearance?.color&&(document.body.style.setProperty(`--current`,e.appearance.color),document.body.style.setProperty(`--primary`,e.appearance.color),t.style.setProperty(`--current`,e.appearance.color),t.style.setProperty(`--primary`,e.appearance.color)),e.grid&&Si(e)},Mi=()=>{if(typeof document>`u`)return;let e=async()=>{try{ji(await ut())}catch{}try{document.documentElement.offsetHeight}catch{}};(async()=>{await e(),queueMicrotask(()=>{e()}),requestAnimationFrame(()=>{e();try{document.documentElement.dispatchEvent(new CustomEvent(`u2-theme-change`,{bubbles:!0}))}catch{}requestAnimationFrame(()=>{e();let t=globalThis.requestIdleCallback;typeof t==`function`?t(()=>{e()},{timeout:200}):globalThis.setTimeout(()=>{e()},50)})})})()},Ni=async()=>{try{if(typeof document>`u`)return;let e=await ut();ji(e),globalThis.matchMedia?.(`(prefers-color-scheme: dark)`)?.addEventListener?.(`change`,async()=>{ji(await ut())})}catch(e){console.warn(`Failed to init theme`,e)}}})),Fi=e((()=>{})),Ii=e((()=>{Mr(),Lr(),Pi(),Fi()})),Li,Ri=e((()=>{Li=`@function --hsv(--src-color <color>) returns <color> {
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
}`})),zi,Bi=e((()=>{zi=`@function --hsv(--src-color <color>) returns <color> {
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
}`}));async function Vi(e){if(Hi===e)return;console.log(`[Veela] Loading variant:`,e);let t=async e=>{typeof e==`string`&&e.length&&await a(e)};if(e===`core`){await t(Li),Hi=e;return}await t(zi),Hi=e}var Hi,Ui=e((()=>{c(),Ri(),Bi(),Hi=null}));async function Wi(e){let t=Gi[e]||Gi[`vl-basic`];if(!t)throw Error(`Unknown style system: ${e}`);if(Ki===e){console.log(`[Styles] Style system '${e}' already loaded`);return}console.log(`[Styles] Loading style system: ${t.name}`),t.initFn&&await t.initFn(),Ki=e,console.log(`[Styles] Style system ${t.name} loaded`)}var Gi,Ki,qi=e((()=>{Ui(),Gi={"vl-advanced":{id:`vl-advanced`,name:`Veela Advanced`,description:`Full-featured CSS framework with design tokens and effects`,variant:`advanced`,initFn:async()=>{try{await Vi(`advanced`),console.log(`[Styles] Veela Advanced loaded`)}catch{}}},"vl-basic":{id:`vl-basic`,name:`Veela Basic Styles`,description:`Lightweight minimal styling for basic functionality`,variant:`basic`,initFn:async()=>{try{await Vi(`basic`),console.log(`[Styles] Veela Basic Styles loaded`)}catch(e){console.warn(`[Styles] Failed to load Veela Basic Styles:`,e)}}},"vl-beercss":{id:`vl-beercss`,name:`Veela BeerCSS`,description:`Beer CSS compatible styling with Material Design 3`,variant:`beercss`,initFn:async()=>{try{await Vi(`beercss`),console.log(`[Styles] Veela BeerCSS loaded`)}catch(e){console.warn(`[Styles] Failed to load Veela BeerCSS:`,e)}}},"vl-core":{id:`vl-core`,name:`Veela Core`,description:`Shared foundation styles for all veela variants`,variant:`core`,initFn:async()=>{try{await Vi(`core`),console.log(`[Styles] Veela Core loaded`)}catch(e){console.warn(`[Styles] Failed to load Veela Core:`,e)}}},raw:{id:`raw`,name:`Raw`,description:`No styling framework, browser defaults`,variant:`core`,initFn:async()=>{console.log(`[Styles] Raw mode - no styles loaded`)}}},Ki=null}));function Ji(e,t,n){let r=new URL(e.includes(`://`)?e:`https://${e}`);r.protocol===`http:`?r.protocol=`ws:`:(r.protocol===`https:`||r.protocol!==`ws:`&&r.protocol!==`wss:`)&&(r.protocol=`wss:`),(!r.pathname||r.pathname===`/`||/^\/socket\.io\/?$/i.test(r.pathname))&&(r.pathname=`/ws`);for(let e of[`EIO`,`transport`,`sid`])r.searchParams.delete(e);return Xi(r,t),Xi(r,n),r.toString()}function Yi(e,t){return new Zi(e,t)}var Xi,Zi,Qi=e((()=>{Xi=(e,t)=>{if(!(!t||typeof t!=`object`))for(let[n,r]of Object.entries(t))!n||r==null||r===``||e.searchParams.set(n,String(r))},Zi=class{url;options;connected=!1;connecting=!1;id=``;ws=null;listeners=new Map;connectTimeout;constructor(e,t={}){this.url=e,this.options=t,this.connect()}connect(){try{let e=Ji(this.url,this.options.query,this.options.auth);this.connecting=!0,this.ws=new WebSocket(e),this.ws.onopen=()=>{this.connected=!0,this.connecting=!1,this.connectTimeout&&clearTimeout(this.connectTimeout),this.emitLocal(`connect`)},this.ws.onclose=e=>{this.connected=!1,this.connecting=!1,this.connectTimeout&&clearTimeout(this.connectTimeout),this.emitLocal(`disconnect`,e.reason||`closed`),this.emitLocal(`close`,e.code,e.reason)},this.ws.onerror=e=>{this.connecting=!1,this.emitLocal(`connect_error`,Error(`WebSocket error`)),this.emitLocal(`error`,e)},this.ws.onmessage=e=>{if(e.data instanceof ArrayBuffer){this.emitLocal(`binary`,e.data);return}if(typeof Blob<`u`&&e.data instanceof Blob){e.data.arrayBuffer().then(e=>this.emitLocal(`binary`,e));return}try{let t=JSON.parse(String(e.data));t.event&&t.payload?this.emitLocal(t.event,t.payload):this.emitLocal(`data`,t)}catch{this.emitLocal(`data`,e.data)}},this.options.timeout&&(this.connectTimeout=setTimeout(()=>{this.connected||(this.connecting=!1,this.ws?.close(),this.emitLocal(`connect_error`,Error(`timeout`)))},this.options.timeout))}catch(e){this.connecting=!1,setTimeout(()=>this.emitLocal(`connect_error`,e),0)}}on(e,t){this.listeners.has(e)||this.listeners.set(e,new Set),this.listeners.get(e).add(t)}off(e,t){this.listeners.get(e)?.delete(t)}send(e){this.connected&&this.ws&&this.ws.send(typeof e==`string`?e:JSON.stringify(e))}sendBinary(e){!this.connected||!this.ws||this.ws.send(e)}emit(e,...t){this.send(t[0])}emitLocal(e,...t){let n=this.listeners.get(e);if(n)for(let e of n)e(...t)}removeAllListeners(){this.listeners.clear()}close(){this.connectTimeout&&clearTimeout(this.connectTimeout),this.ws&&=(this.ws.close(),null),this.connected=!1,this.connecting=!1}disconnect(){this.close()}}}));function $i(e){let t=ea;if(!t)return null;try{return t.querySelector(`#${CSS.escape(e)}`)}catch{return null}}function P(e){let t=ea?.ownerDocument??(typeof document<`u`?document:null);if(!t){console.log(`[LOG]`,e);return}let n=t.createElement(`div`);n.textContent=`[${new Date().toLocaleTimeString()}] ${e}`;let r=na();r&&(r.appendChild(n),r.scrollTop=r.scrollHeight),console.log(`[LOG]`,e)}var ea,ta,na,ra=e((()=>{ea=null,ta=()=>$i(`wsStatus`),na=()=>$i(`logContainer`)}));async function ia(){let e=await sa();if(!e?.Clipboard?.read)return``;try{let t=(await e.Clipboard.read())?.value;if(typeof t==`string`&&t.trim())return t}catch{}return``}async function aa(e){let t=await sa();if(!t?.Clipboard?.write)return!1;try{return await t.Clipboard.write({string:String(e??``),label:`cwsp`}),!0}catch{return!1}}var oa,sa,ca=e((()=>{_(),oa=[`@supernotes/capacitor-clipboard`,`@capacitor/clipboard`],sa=async()=>{try{if(globalThis.document===void 0)return null}catch{return null}for(let e of oa)try{return await v(()=>import(e),[],import.meta.url)}catch{}return null}})),la=t({isCapacitorNativeShell:()=>Ca,openAppClipboardRelatedSettings:()=>xa,openNativeNotificationSettings:()=>ba,readClipboardTextFromDevice:()=>ya,writeClipboardImageToDevice:()=>ga,writeClipboardTextToDevice:()=>va});async function ua(){let e=await Ta(`/service/clipboard?kind=text`);if(!e||e.ok===!1)return null;let t=typeof e.text==`string`&&e.text||typeof e.content==`string`&&e.content||typeof e.data==`string`&&e.data||``;return e.ok===!0||`text`in e||`data`in e?t:null}async function da(e){let t=await Ta(`/service/clipboard`,{method:`POST`,body:JSON.stringify({kind:`text`,text:e,content:e,data:e})});return!!(t&&t.ok!==!1)}async function fa(e,t,n){let r=await Ta(`/service/clipboard`,{method:`POST`,body:JSON.stringify({kind:`image`,mimeType:t,hash:n||void 0,imageBase64:e,asset:{mimeType:t,hash:n||void 0,data:e,source:`base64`}})});return!!(r&&r.ok!==!1)}async function pa(){if(!fe())return``;try{let e=await O(`clipboard:read-local`,{});return Ea(e)}catch{return``}}async function ma(e,t,n){if(!fe())return!1;try{return!!(await O(`clipboard:write-local-image`,{mimeType:t,hash:n||``,data:e}))?.ok}catch{return!1}}async function ha(e){if(!fe())return!1;try{return!!(await O(`clipboard:write-local`,{text:e}))?.ok}catch{return!1}}async function ga(e,t=`image/png`,n){let r=String(e??``).trim();if(!r)throw Error(`Clipboard image payload empty`);let i=String(t||`image/png`).trim()||`image/png`;if(ka()){for(let e=0;e<4;e++){if(await fa(r,i,n))return;e+1<4&&await new Promise(t=>globalThis.setTimeout(t,120*(e+1)))}throw Error(`Desktop control clipboard image write failed`)}if(!await fa(r,i,n)&&!await ma(r,i,n)){if(Sa()&&globalThis.navigator?.clipboard?.write)try{let e=Da(r);if(e?.length){let t=new Blob([e],{type:i}),n=i===`image/png`?t:await Oa(t);await globalThis.navigator.clipboard.write([new ClipboardItem({[n.type]:n})]);return}}catch{}throw Error(`Clipboard image write unavailable`)}}async function _a(e,t=4){for(let n=0;n<t;n++){if(await da(e))return!0;n+1<t&&await new Promise(e=>globalThis.setTimeout(e,120*(n+1)))}return!1}async function va(e){let t=String(e??``);if(ka()){if(await _a(t))return;throw Error(`Desktop control clipboard write failed`)}if(!await da(t)&&!await ha(t)&&!(Sa()&&await aa(t))){if(globalThis.navigator?.clipboard?.writeText){await globalThis.navigator.clipboard.writeText(t);return}throw Error(`Clipboard write unavailable`)}}async function ya(){if(ka()){for(let e=0;e<4;e++){let t=await ua();if(t!==null)return t;e+1<4&&await new Promise(t=>globalThis.setTimeout(t,120*(e+1)))}throw Error(`Desktop control clipboard read failed`)}let e=await ua();if(e!==null)return e;let t=await pa();if(t)return t;if(Sa()){let e=await ia();if(e)return e}if(globalThis.navigator?.clipboard?.readText)return String(await globalThis.navigator.clipboard.readText());throw Error(`Clipboard read unavailable`)}async function ba(){if(Sa())try{let{NativeSettings:e,AndroidSettings:t,IOSSettings:n}=await v(async()=>{let{NativeSettings:e,AndroidSettings:t,IOSSettings:n}=await import(`capacitor-native-settings`);return{NativeSettings:e,AndroidSettings:t,IOSSettings:n}},[],import.meta.url);await e.open({optionAndroid:t.AppNotification,optionIOS:n.AppNotification})}catch{}}async function xa(){if(Sa())try{let{NativeSettings:e,AndroidSettings:t,IOSSettings:n}=await v(async()=>{let{NativeSettings:e,AndroidSettings:t,IOSSettings:n}=await import(`capacitor-native-settings`);return{NativeSettings:e,AndroidSettings:t,IOSSettings:n}},[],import.meta.url);await e.open({optionAndroid:t.ApplicationDetails,optionIOS:n.App})}catch{}}var Sa,Ca,wa,Ta,Ea,Da,Oa,ka,Aa=e((()=>{ca(),de(),_(),Sa=()=>{try{let e=globalThis.Capacitor;return typeof e?.isNativePlatform==`function`&&!!e.isNativePlatform()}catch{return!1}},Ca=()=>Sa(),wa=()=>{try{let e=globalThis,t=e.__WEBNATIVE_AUTH__||e.__NEUTRALINO_AUTH__;return!t||typeof t.port!=`number`||(e.__CWS_WEBNATIVE_BOOT__||e.__CWS_NEUTRALINO_BOOT__||t.key,!t.key)?null:{port:t.port,key:String(t.key)}}catch{return null}},Ta=async(e,t)=>{let n=wa();if(!n)return null;try{let r=new Headers(t?.headers);r.set(`Content-Type`,`application/json`),r.set(`X-API-Key`,n.key);let i=await fetch(`http://127.0.0.1:${n.port}${e}`,{...t,headers:r,cache:`no-store`});return i.ok?await i.json():null}catch{return null}},Ea=e=>{if(!e||typeof e!=`object`)return``;let t=e,n=t.echo;if(n&&typeof n==`object`){let e=n;if(typeof e.text==`string`)return e.text;if(typeof e.value==`string`)return e.value}return typeof t.text==`string`?t.text:typeof t.value==`string`?t.value:typeof t.data==`string`?t.data:``},Da=e=>{let t=e.trim();if(!t)return null;if(t.startsWith(`data:`)){let e=t.indexOf(`,`);if(e<0)return null;t=t.slice(e+1)}try{let e=globalThis.atob(t.replace(/\s+/g,``)),n=new Uint8Array(e.length);for(let t=0;t<e.length;t++)n[t]=e.charCodeAt(t);return n}catch{return null}},Oa=async e=>{if(e.type===`image/png`)return e;if(typeof createImageBitmap==`function`&&typeof OffscreenCanvas<`u`){let t=await createImageBitmap(e),n=new OffscreenCanvas(t.width,t.height),r=n.getContext(`2d`);return r?(r.drawImage(t,0,0),t.close(),await n.convertToBlob({type:`image/png`})):e}return e},ka=()=>{try{let e=globalThis;if(e.__CWS_NEUTRALINO_BOOT__||e.__CWS_WEBNATIVE_BOOT__||typeof e.NL_OS==`string`)return!0;let t=e.__WEBNATIVE_AUTH__||e.__NEUTRALINO_AUTH__;return!!(t&&typeof t.port==`number`&&t.key)}catch{return!1}}})),ja,Ma=e((()=>{ja=4e3})),F,Na,Pa,Fa,Ia,La,Ra,I,za,Ba,Va,Ha=e((()=>{F=1e6,Na=0,Pa=0,Fa=()=>{if(Pa=Date.now(),typeof process<`u`&&typeof process.hrtime?.bigint==`function`){Na=Number(process.hrtime.bigint()/1000n)%F;return}try{let e=globalThis.performance;if(typeof e?.now==`function`){Na=Math.floor(e.now()%1*F)%F;return}}catch{}Na=0},Fa(),Ia=()=>{let e=Date.now(),t=0;if(typeof process<`u`&&typeof process.hrtime?.bigint==`function`){let n=e-Pa;(n<0||n>6e4)&&Fa(),t=(Na+Number(process.hrtime.bigint()/1000n))%F}else try{let e=globalThis.performance;typeof e?.now==`function`&&(t=Math.floor(e.now()%1*F)%F)}catch{t=0}let n=String(BigInt(e)*BigInt(F)+BigInt(t));return{ts:e,subUs:t,wireTime64:n,ts64:n,wireTs:n}},La=e=>{let t=Ia(),n=String(e.wireTime64??e.ts64??e.wireTs??t.wireTime64);return{...e,ts:Number(e.ts??t.ts),subUs:Number(e.subUs??t.subUs),wireTime64:n,ts64:n,wireTs:n}},Ra=e=>e&&typeof e==`object`&&!Array.isArray(e)?e:{},I=e=>{let t=Number(e);return Number.isFinite(t)&&t>0?t:0},za=e=>{let t=Ra(e.flags),n=Ra(e.payload??e.data),r=Va(e.originTs??t.originTs??n.originTs);return r?.ts?r.ts:I(e.originTs)||I(t.originTs)||I(n.originTs)||I(e.timestamp)||I(e.ts)||I(t.timestamp)||I(t.ts)||I(n.timestamp)||I(n.ts)||0},Ba=e=>{let t=Ia(),n=za(e)||I(e.timestamp)||I(e.ts)||t.ts,r=I(e.timestamp)||I(e.ts)||n,i=Number(e.subUs??t.subUs),a=String(e.wireTime64??e.ts64??e.wireTs??t.wireTime64),o=Ra(e.flags),s={...o,originTs:o.originTs??e.originTs??n,wireTime64:o.wireTime64??a,ts64:o.ts64??o.wireTime64??a,wireTs:o.wireTs??o.wireTime64??a};return{...e,originTs:e.originTs??n,ts:r,subUs:i,wireTime64:a,ts64:a,wireTs:a,timestamp:r,flags:s}},Va=e=>{let t=String(e??``).trim();if(!/^\d+$/.test(t))return null;try{let e=BigInt(t),n=Number(e/BigInt(F)),r=Number(e%BigInt(F));return Number.isFinite(n)?{ts:n,subUs:r,wireTime64:t,ts64:t,wireTs:t}:null}catch{return null}}})),Ua,Wa,Ga,Ka,qa,Ja,Ya,Xa,Za,Qa,$a=e((()=>{Ha(),Ua=e=>e&&typeof e==`object`&&!Array.isArray(e)?e:{},Wa=()=>{try{let e=globalThis.performance;if(typeof e?.now==`function`)return e.now()}catch{}return Date.now()},Ga=(e=Wa())=>Math.round(e*10)&65535,Ka=e=>{let t=String(e||``).trim().toLowerCase();return t.startsWith(`mouse:`)||t.startsWith(`keyboard:`)||t.startsWith(`airpad:mouse`)||t.startsWith(`airpad:keyboard`)},qa=e=>{let t=String(e||``).trim().toLowerCase();return t===`mouse:click`||t===`mouse:down`||t===`mouse:up`||t===`keyboard:tap`||t===`keyboard:type`||t===`keyboard:toggle`},Ja=e=>{let t=Ua(e.payload??e.data??e.body),n=String(t.op??t.action??t.type??``).trim().toLowerCase();if(n)return n;let r=t.params;return Array.isArray(r)&&r.length>0?String(r[0]??``).trim().toLowerCase():``},Ya=e=>{if(typeof e==`string`)return qa(e);let t=String(e.what||e.type||``).trim().toLowerCase();if(qa(t))return!0;if(t===`airpad:mouse`||t.startsWith(`airpad:mouse`)){let t=Ja(e)||`move`;return t===`click`||t===`mouse:click`||t===`down`||t===`mouse:down`||t===`up`||t===`mouse:up`}return!!(t===`airpad:keyboard`||t.startsWith(`airpad:keyboard`))},Xa=e=>{let t=String(e||``).trim().toLowerCase();return t.startsWith(`clipboard:`)||t.startsWith(`airpad:clipboard:`)},Za=e=>Ka(e)||Xa(e),Qa=e=>{let t=Ua(e),n=Number(t.perfTs??Wa());return{...La(t),perfTs:n,perfTsLo:Number(t.perfTsLo??Ga(n))}}})),eo,to,no,ro,io,ao,oo,so,co,lo,uo,fo,po,mo,ho,go,_o,vo,yo,bo,xo=e((()=>{Ma(),Ha(),$a(),eo=`wireHash`,to=new Set([`ts`,`subUs`,`wireTime64`,`ts64`,`wireTs`,`perfTs`,`perfTsLo`,eo,`source`,`from`,`clientId`,`userId`,`sender`]),no=e=>e&&typeof e==`object`&&!Array.isArray(e)?e:{},ro=e=>{if(!e)return``;let t=5381;for(let n=0;n<e.length;n+=1)t=(t<<5)+t+e.charCodeAt(n)|0;return(t>>>0).toString(36)},io=e=>String(e??``).replace(/\r\n/g,`
`).trim(),ao=e=>{if(e==null)return``;if(typeof e!=`object`)return JSON.stringify(e);if(Array.isArray(e))return`[${e.map(ao).join(`,`)}]`;let t=e;return`{${Object.keys(t).filter(e=>!to.has(e)).sort().map(e=>`${JSON.stringify(e)}:${ao(t[e])}`).join(`,`)}}`},oo=e=>{for(let t of[`asset`,`dataAsset`,`file`,`image`]){let n=no(e[t]),r=String(n.hash??``).trim();if(r)return r}return``},so=(e,t)=>{for(let t of[`text`,`content`,`body`]){let n=e[t];if(typeof n==`string`&&n.trim())return n}for(let e of[`payload`,`data`,`result`]){let n=t[e];if(typeof n==`string`&&n.trim())return n}return``},co=e=>{let t=String(e||``).trim().toLowerCase();return t?t.startsWith(`clipboard:`)||t.startsWith(`airpad:clipboard:`)?`clipboard`:t.startsWith(`mouse:`)||t.startsWith(`keyboard:`)||t.startsWith(`airpad:mouse`)||t.startsWith(`airpad:keyboard`)?`input`:`general`:`general`},lo=e=>e===`clipboard`?250:e===`input`?180:400,uo=(e,t)=>!!(t===`ask`||t===`request`||!e||e.endsWith(`:read`)||e.endsWith(`:get`)||e.endsWith(`:isready`)),fo=e=>{let t=no(e.flags),n=no(e.payload??e.data);return String(t.wireHash??e.wireHash??n.wireHash??``).trim()},po=e=>{let t=String(e.op||`act`).trim().toLowerCase(),n=String(e.what||e.type||``).trim().toLowerCase();if(uo(n,t))return``;let r=String(e.byId||e.from||e.sender||``).trim().toLowerCase(),i=no(e.payload??e.data??e.body??{});if(n.includes(`clipboard`)){let a=so(i,e),o=a?``:oo(i),s=a?ro(io(a)):o?`asset:${o}`:ro(ao(i));if(!s)return``;let c=String(e.uuid??``).trim(),l=c?`|u:${c}`:``;return ro(`${t}|${n}|${r}|${s}${l}`)}if(co(n)===`input`){let e=i.perfTs??i.perfTsLo??``;return ro(`${t}|${n}|${r}|${ao(i)}|p:${e}`)}return ro(`${t}|${n}|${r}|${ao(i)}`)},mo=e=>{let t=Ba(e),n=po(t);if(!n||fo(t)===n)return t;let r={...no(t.flags),[eo]:n},i=t.payload??t.data,a=i;return i&&typeof i==`object`&&!Array.isArray(i)&&(a={...i,[eo]:n}),t.payload===void 0?t.data===void 0?{...t,flags:r,payload:a}:{...t,flags:r,data:a}:{...t,flags:r,payload:a}},ho=class{maxEntries;seen=new Map;constructor(e=512){this.maxEntries=e}shouldSuppress(e,t){let n=String(e.what||e.type||``).trim().toLowerCase(),r=String(e.op||`act`).trim().toLowerCase();if(uo(n,r))return!1;let i=fo(e)||po(e);if(!i)return!1;let a=t??co(n),o=lo(a),s=Date.now(),c=`${a}|${i}`,l=this.seen.get(c);return this.seen.set(c,s),this.prune(s,o),l!==void 0&&s-l<o}clear(){this.seen.clear()}prune(e,t){let n=Math.max(t*4,4e3);for(let[t,r]of this.seen.entries())e-r>n&&this.seen.delete(t);if(this.seen.size<=this.maxEntries)return;let r=[...this.seen.entries()].sort((e,t)=>e[1]-t[1]);for(let e=0;e<r.length-this.maxEntries;e+=1)this.seen.delete(r[e][0])}},go=new ho,_o=class{maxEntries;seen=new Map;constructor(e=512){this.maxEntries=e}shouldSuppress(e){if(bo(e)||Ya(e))return!1;let t=String(e.what||e.type||``).trim().toLowerCase(),n=String(e.op||`act`).trim().toLowerCase();if(uo(t,n))return!1;let r=fo(e)||po(e);if(!r)return!1;let i=Date.now(),a=`relay|${r}`,o=this.seen.get(a);return this.seen.set(a,i),this.prune(i),o!==void 0&&i-o<4e3}clear(){this.seen.clear()}prune(e){let t=Math.max(ja*4,4e3);for(let[n,r]of this.seen.entries())e-r>t&&this.seen.delete(n);if(this.seen.size<=this.maxEntries)return;let n=[...this.seen.entries()].sort((e,t)=>e[1]-t[1]);for(let e=0;e<n.length-this.maxEntries;e+=1)this.seen.delete(n[e][0])}},new _o,vo=e=>{let t=String(e||``).trim().toLowerCase();return t===`mouse:move`||t===`mouse:scroll`},yo=e=>{let t=no(e.payload??e.data??e.body),n=String(t.op??t.action??t.type??``).trim().toLowerCase();if(n)return n;let r=t.params;return Array.isArray(r)&&r.length>0?String(r[0]??``).trim().toLowerCase():``},bo=e=>{if(typeof e==`string`)return vo(e);let t=String(e.what||e.type||``).trim().toLowerCase();if(vo(t))return!0;if(t!==`airpad:mouse`&&!t.startsWith(`airpad:mouse`))return!1;let n=yo(e)||`move`;return n===`move`||n===`mouse:move`||n===`scroll`||n===`mouse:scroll`}}));function So(e){Co=e}var Co,wo=e((()=>{})),L,R,To,z,Eo,Do,Oo,ko,Ao,jo,Mo,No,Po,Fo,Io,Lo=e((()=>{de(),p(),$a(),ct(),Zc(),L=!1,R=0,To=1200,z=()=>Bc()&&fe()&&Be(),Eo=6e3,Do=async()=>{if(!z())return L=!1,!1;try{let e=await h(O(`coordinator:status`,{}),Eo,`coordinator:status timed out`),t=!!(e.echo?.connected??e.ok);return L=t,R=Date.now(),t}catch{return L=!1,R=Date.now(),!1}},Oo=async()=>{if(!z())return!1;try{return(await h(O(`runtime:reload-settings`,{}),Eo,`runtime:reload-settings timed out`))?.ok?(L=!1,R=0,Do()):(L=!1,R=Date.now(),!1)}catch{return L=!1,R=Date.now(),!1}},ko=()=>z()?(Date.now()-R>To&&Do(),L):!1,Ao=(e,t)=>!Za(e)||!t||typeof t!=`object`||Array.isArray(t)?t??{}:Qa(t),jo=async e=>{if(!z())return!1;let t=e instanceof Uint8Array?e:new Uint8Array(e),n=``;for(let e=0;e<t.length;e++)n+=String.fromCharCode(t[e]??0);let r=btoa(n);try{let e=await O(`coordinator:binary`,{data:r,encoding:`base64`}),t=!!(e?.sent??e.echo?.sent??e.ok);return t&&(L=!0,R=Date.now()),t}catch{return L=!1,R=Date.now(),!1}},Mo=async e=>{if(!z())return!1;try{let t=await O(e?`airmouse:start`:`airmouse:stop`,{}),n=t.echo??{},r=!!t.ok;return r&&(L=!0,R=Date.now()),e?r&&n.active!==!1:r}catch{return!1}},No=()=>Mo(!0),Po=()=>Mo(!1),Fo=async e=>{let t=(await O(`coordinator:dispatch`,{what:e.what,payload:Ao(e.what,e.payload),nodes:e.nodes??[],uuid:e.uuid??``,op:e.op})).echo??{};if(t.result!==void 0)return t.result;if(typeof t.body==`string`&&t.body.trim())try{let e=JSON.parse(t.body);return e.result??e.payload??e.data??t.body}catch{return t.body}return t.result??null},Io=async e=>{if(!z())return!1;let t=e.op===`ask`?`coordinator:ask`:`coordinator:act`;try{let n=await O(t,{what:e.what,payload:Ao(e.what,e.payload),nodes:e.nodes??[],uuid:e.uuid??``,op:e.op}),r=!!(n.echo?.sent??n.ok);return r&&(L=!0,R=Date.now()),r}catch{return L=!1,R=Date.now(),!1}}})),Ro=t({connectWS:()=>W,disconnectWS:()=>us,getLastServerClipboard:()=>Wo,getWS:()=>zo,initWebSocket:()=>ds,isWSConnected:()=>Bo,markTransportDisconnected:()=>Uo,onServerClipboardUpdate:()=>Go,onVoiceResult:()=>Ko,onWSConnectionChange:()=>Vo,reconnectNativeCoordinatorTransport:()=>Oo,reconnectTransportAfterLifecycleResume:()=>ls,refreshNativeCoordinatorStatus:()=>Do,refreshTransportConnectionStatus:()=>Ho,sendCoordinatorAct:()=>ns,sendCoordinatorAsk:()=>is,sendCoordinatorRequest:()=>as,sendWsBinary:()=>rs,shouldUseNativeCoordinatorTransport:()=>z,startNativeAirMouse:()=>No,stopNativeAirMouse:()=>Po});function zo(){return G}function Bo(){return z()?ko():ps}function Vo(e){js.add(e);try{e(Bo())}catch{}return()=>js.delete(e)}async function Ho(){if(z()){let e=await Do();return U(e),e}let e=!!(ps||G?.connected);return U(e),e}function Uo(){U(!1)}function Wo(){return Ms}function Go(e){return Ns.add(e),()=>Ns.delete(e)}function Ko(e){return Ps.add(e),()=>Ps.delete(e)}function qo(e,t){for(let n of Ns)try{n(e,t)}catch{}}async function Jo(){if(!G?.connected||!Le()||!Re())return;let e=Qe();if(e.length)try{let t=await ya(),n=String(t??``).trim();if(!n)return;let r=Date.now();if(r<Zs&&n===Xs||n===Js&&r-Ys<qs)return;Js=n,Ys=r;let i=groupWireTargetsByAccessToken(e,vc());for(let e of i)ns(`clipboard:update`,{text:n},e.nodeIds,{accessToken:e.accessToken})}catch{}}async function Yo(e,t){if(!Le())return;let n=typeof e==`string`?e:``,r=n.trim();if(r.toLowerCase().startsWith(`data:image/`)){await Xo({mimeType:`image/png`,data:r},t);return}let i=Date.now();if(!(r&&r===Qs&&i-$s<qs)&&(Qs=r,$s=i,Ms=n,qo(n,t),!(!Ue()||!r)&&!(r===Xs&&i<Zs)))try{await va(r),Xs=r,Js=r,Ys=i,Zs=i+qs}catch(e){console.warn(`[cwsp:clipboard] device write failed`,{length:n.length,source:t?.source,error:lc(e)})}}async function Xo(e,t){if(!Le())return;let n=String(e.data??``).trim();if(!n)return;let r=String(e.mimeType||`image/png`).trim()||`image/png`,i=e.hash?.trim()||n.slice(0,96),a=Date.now();if(!(i&&i===Qs&&a-$s<qs)&&(Qs=i,$s=a,qo(``,t),Ue()&&!(i===Xs&&a<Zs)))try{await ga(n,r,e.hash),Xs=i,Js=i,Ys=a,Zs=a+qs}catch(n){console.warn(`[cwsp:clipboard] device image write failed`,{mimeType:r,hash:e.hash,source:t?.source,error:lc(n)})}}function Zo(e){try{return JSON.stringify(e)}catch{return String(e)}}function Qo(){return it()===`secure`?`secure`:`plaintext`}function B(e){let t=e.trim();return/^l-/i.test(t)?t.slice(2).trim():t}function $o(e){let t=B(e.trim()).toLowerCase();return t===`localhost`||t===`127.0.0.1`||t===`::1`}function es(e){if(!e)return!1;let t=B(e);return t===`localhost`||e===`localhost`||e.endsWith(`.local`)?!0:/^\d{1,3}(?:\.\d{1,3}){3}$/.test(t)?t.startsWith(`10.`)||t.startsWith(`192.168.`)||/^172\.(1[6-9]|2\d|3[01])\./.test(t)||t.startsWith(`127.`)||/^100\.(6[4-9]|[7-9]\d|1[01]\d|12[0-7])\./.test(t):!1}async function ts(e,t){if(!(!e||!t)&&es(t)&&location.protocol===`https:`&&!Ss.has(e)){Ss.add(e);try{await fetch(`${e}/lna-probe`,{method:`GET`,mode:`cors`,cache:`no-store`,credentials:`omit`,targetAddressSpace:`local`})}catch(e){P(`LNA probe: ${String(e?.message||e||``)||`request failed`}`)}}}function ns(e,t,n,r){let i=Ic(e,t),a=Dc(`act`,e,i,{nodes:n,accessToken:r?.accessToken});return Ec(a)?!0:Gs(e)?(W(),!1):(Hs.length>=Us&&Hs.shift(),Hs.push(a),W(),!0)}function rs(e){if(z())return jo(e),ko();if(!G?.connected)return!1;let t=G;return typeof t.sendBinary==`function`?(t.sendBinary(e),!0):!1}function is(e,t,n){return new Promise((r,i)=>{(async()=>{if(z()){try{if(!await Ks()){i({ok:!1,error:`Native WS not connected`});return}r(await Fo({op:`ask`,what:e,payload:Ic(e,t),nodes:n}))}catch(e){i({ok:!1,error:String(e?.message||e)})}return}if(!await Ks()||!G?.connected){i({ok:!1,error:`WS not connected`});return}let a=bc(),o=globalThis.setTimeout(()=>{Z.delete(a),i({ok:!1,error:`Timeout waiting for ${e}`})},Os);Z.set(a,{resolve:r,reject:i,timeoutId:o}),Ec(Dc(`ask`,e,Ic(e,t),{nodes:n,uuid:a}))})()})}function as(e,t,n){return new Promise((r,i)=>{(async()=>{if(z()){try{if(!await Ks()){i({ok:!1,error:`Native WS not connected`});return}r(await Fo({op:`act`,what:e,payload:Ic(e,t),nodes:n}))}catch(e){i({ok:!1,error:String(e?.message||e)})}return}if(!await Ks()||!G?.connected){i({ok:!1,error:`WS not connected`});return}let a=bc(),o=globalThis.setTimeout(()=>{Z.delete(a),i({ok:!1,error:`Timeout waiting for ${e}`})},Os);Z.set(a,{resolve:r,reject:i,timeoutId:o}),Ec(Dc(`act`,e,Ic(e,t),{nodes:n,uuid:a}))})()})}function V(){if(hs){if(K||G&&G.connected===!1){hs.textContent=`WS…`;return}ps||G&&G.connected?hs.textContent=`WS ✓`:hs.textContent=`WS ↔`}}function H(e,t){let n=t.trim();P(`[ws-state] event=${e}${n?` ${n}`:``}`)}function os(e){let t=ta();t&&(t.textContent=Ca()?`TLS failed — install your CA in Android Settings → Security → Encryption & credentials (or use Remote host = name on the cert). Try HTTP :8080 if the server allows. ${e}`:`Untrusted cert — open ${e} in this browser, accept, then retry`,t.classList.add(Lc),t.classList.remove(`ws-status-ok`),t.classList.add(`ws-status-bad`))}function ss(e){let t=ta();t&&(t.textContent=`TLS name mismatch for raw IP — set Remote host to ${e} (name on certificate), keep ports as needed`,t.classList.add(Lc),t.classList.remove(`ws-status-ok`),t.classList.add(`ws-status-bad`))}function U(e){ps=e,e&&Ws();let t=ta();t&&(t.classList.remove(Lc),e?(t.textContent=`connected`,t.classList.remove(`ws-status-bad`),t.classList.add(`ws-status-ok`)):(t.textContent=`disconnected`,t.classList.remove(`ws-status-ok`),t.classList.add(`ws-status-bad`))),V();for(let t of js)try{t(e)}catch{}}function cs(e){if(e.type===`voice_result`||e.type===`voice_error`){let t=e.error||e.message||`Actions: `+JSON.stringify(e.actions||[]);for(let n of Ps)try{n({text:t,type:e.type===`voice_error`?`voice_error`:`voice_result`,actions:e.actions,error:e.error})}catch{}P(`Voice result: `+t)}}function ls(e){if(globalThis.window){try{let t=String(document.documentElement?.dataset?.cwspSurface||``).toLowerCase(),n=String(location.hostname||``).toLowerCase();if(t===`cwsp-control`||n===`cwsp.u2re.space`||n===`www.cwsp.u2re.space`){H(`lifecycle-reconnect-skip-control-spa`,e);return}}catch{}H(`lifecycle-reconnect`,e),tc(),ks(),q+=1,_s=!1;for(let[e,t]of Z.entries())clearTimeout(t.timeoutId),t.reject({ok:!1,error:`Disconnected before response for ${e}`}),Z.delete(e);for(let e of[...J])Y(e),e.removeAllListeners(),e.close(),J.delete(e);if(K=!1,G)try{G.removeAllListeners(),G.disconnect()}catch{}G=null,ms(null),U(!1),vs=0,go.clear(),W()}}function W(){try{let e=String(document.documentElement?.dataset?.cwspSurface||``).toLowerCase(),t=String(location.hostname||``).toLowerCase();if(e===`cwsp-control`||t===`cwsp.u2re.space`||t===`www.cwsp.u2re.space`){P(`WS skip: Control SPA — use paired Control RPC, not browser hub /ws`);return}}catch{}if(ot()){P(`WS skip: Node clipboard-hub owns fleet /ws (WebView must not connect)`);return}if(Bc()){P(`WS skip: Java CwspBridgeService owns fleet /ws (WebView must not connect)`);return}if(K||G&&(G.connected||G.connecting)||J.size>0)return;ks(),q+=1;let e=q;_s=!1;let t=qe().trim(),n=$e().trim(),r=t||n||``,i=Ve(),a=e=>!!e&&/^\d{1,3}(?:\.\d{1,3}){3}$/.test(e),o=e=>!e||!a(e)?!1:e.startsWith(`10.`)||e.startsWith(`192.168.`)||/^172\.(1[6-9]|2\d|3[01])\./.test(e)||/^100\.(6[4-9]|[7-9]\d|1[01]\d|12[0-7])\./.test(e),s=e=>a(e)&&e.startsWith(`192.168.0.`),c=e=>B(e).trim().toLowerCase()===`192.168.0.200`,l=e=>B(e).trim().toLowerCase().includes(`45.147.`),u=e=>c(e)||l(e),d=location.hostname||``,f=B(d)||d,p=Se(f),m=at().trim(),h=Me(m,n||t)||m,g=he(n||t,h),_=me(h,n||t,He()),v=je(f),y=p||Ee(f)||ve(n,f)||g&&!v||De(n)&&p,b=e=>{let t=[],n=[],r=[],i=[],u=[],d=[],f=[];for(let p of e)a(p.host)?c(p.host)?i.push(p):l(p.host)?u.push(p):s(p.host)||p.host===`127.0.0.1`?r.push(p):o(p.host)?f.push(p):d.push(p):p.source===`page`?n.push(p):t.push(p);return y?[...u,...i,...t,...d,...r,...n,...f]:v?[...r,...i,...u,...t,...n,...d,...f]:[...u,...i,...r,...t,...n,...d,...f]},ee=e=>/^\d{1,5}$/.test(e),x=e=>e.trim().replace(/^[a-z][a-z0-9+.-]*:\/\//i,``).split(`/`)[0],S=e=>{let t=x(e).trim();if(!t)return null;let n=t.lastIndexOf(`:`);if(n<=0)return{host:t};let r=t.slice(0,n),i=t.slice(n+1);return!r||!ee(i)?{host:t}:{host:r,port:i}},C=ge(t).map(e=>S(e)).filter(e=>!!e&&!!e.host);if(p&&De(n)&&!g){let e=C.filter(e=>{let t=B(e.host).trim();return t?u(t)?!0:!(a(t)&&s(t)):!1});e.length&&(C=e)}if(!C.length&&n){let e=S(n);e?.host&&(C=[e])}let w=(C[0]?.port||``).trim(),te=h?S(h):void 0,T=d,E=/^(localhost|127\.0\.0\.1)$/.test(T)||/^\d{1,3}(?:\.\d{1,3}){3}$/.test(T)&&(T.startsWith(`10.`)||T.startsWith(`192.168.`)||/^172\.(1[6-9]|2\d|3[01])\./.test(T));if(location.protocol===`https:`&&i===`http`&&!Ca()){P(`WebSocket error: browser blocks ws/http from https page (mixed content). Open Airpad via http:// or use valid HTTPS cert on endpoint.`),K=!1,U(!1),V();return}let D=C[0],ne=D?.host||r,re=D?.port,ie=(()=>{if(Oe(h))return Ne(h);if(Oe(m))return Ne(m);if(we(h)||Ce(h))return Ne(h);if(g&&we(m))return Ne(m);if(_||De(n)||De(t))return ke;let e=te?.host||``;return e&&Te(e)?Ne(e):e||h||``})(),ae=(te?.port||``).trim(),oe=(ne||r||``).trim(),se=oe.length>0?B(oe)||oe:``,ce=(()=>{let e=se.trim();if(!e)return``;let t=e.lastIndexOf(`:`);return t>0&&ee(e.slice(t+1))?e.slice(0,t):e})(),le=i===`http`||i===`https`?i:w===`443`||w===`8434`||w===`8444`?`https`:w===`80`||w===`8080`||w===`8081`?`http`:Ca()&&location.protocol===`https:`&&ce&&a(ce)&&o(ce)?`https`:Ca()&&location.protocol!==`https:`&&ce&&a(ce)&&o(ce)?`http`:location.protocol===`https:`?`https`:`http`,ue=oe,de=B(ue)||ue,fe=w||(le===`https`?`8434`:`8080`);if(ts(`${le}://${de}:${fe}`,de),T&&$o(de)&&!$o(T)&&es(T)){let e=B(T)||T;ts(`${le}://${e}:${fe}`,e)}let pe=le===`https`?`http`:`https`,O={http:[...ye],https:[..._e]},be=location.port?.trim?.()||``,xe=be||(location.protocol===`https:`?`443`:location.protocol===`http:`?`80`:``),Ae=i===`http`?[`http`]:i===`https`?[`https`]:[le,pe],Pe=e=>_e.includes(e),Fe=e=>ye.includes(e),Ie=(e,t)=>{let n=[],r=(t&&ee(t)?t:``)||(w&&ee(w)?w:``);if(r&&(e===`https`?(Pe(r)||i===`https`||i===`auto`)&&n.push(r):(Fe(r)||i===`http`||i===`auto`)&&n.push(r),!n.length&&i===e&&n.push(r),n.length))return n.filter((e,t)=>n.indexOf(e)===t);for(let t of O[e])n.push(t);return be&&n.push(be),n.filter((e,t)=>n.indexOf(e)===t)},Le=e=>B(e.trim())||e.trim(),Re=[];for(let e of C){let t=Le(e.host);t&&Re.push({host:t,source:`remote`,preferPort:e.port})}if(C.length===0&&t){let e=Le(t);e&&Re.push({host:e,source:`remote`})}let Be=new Set;for(let e of C)e.host&&Be.add(e.host.toLowerCase());if(C.length===0&&t.trim())for(let e of ge(t.trim())){let t=S(e);t?.host&&Be.add(t.host.toLowerCase())}let Ue=()=>{for(let e of Be){let t=B(e).toLowerCase();if(t===`localhost`||t===`127.0.0.1`||a(t)&&o(t))return!0}return!1},Ge=T.toLowerCase(),Ke=B(T)||T,Je=String(location.protocol||``).toLowerCase(),Ye=Je===`chrome-extension:`||Je===`moz-extension:`||Je===`safari-web-extension:`||/^[a-p]{32}$/.test(Ge),Xe=!!Ge&&Ee(Ke)&&!Be.has(Ge),Qe=!!T&&Be.size>0&&Ue()&&!E&&!Be.has(Ge),tt=p&&!!T&&$o(T);location.hostname&&!Ye&&!Qe&&!Xe&&!tt&&Re.push({host:location.hostname,source:`page`,...xe?{preferPort:xe}:{}});let rt=new Map;for(let e of Re)e.host&&!rt.has(e.host)&&rt.set(e.host,e);let it=Array.from(rt.values()),st=b(it),ct=[];for(let e of Ae){if(location.protocol===`https:`&&e===`http`)continue;let t=e===`https`?st:it;for(let n of t){let{host:t,source:r,preferPort:i}=n,s=T&&t===T&&xe&&(!i||i===xe)?xe:i;for(let n of Ie(e,s)){let i=B(t).trim()||t.trim(),s=a(i)&&o(i),c=location.protocol===`https:`&&!E&&s,l=Ca()&&s||location.protocol===`https:`&&E&&s||c&&s;ct.push({url:`${e}://${t}:${n}`,protocol:e,host:t,source:r,port:n,privateLanHint:l})}}}let k=ct.filter((e,t)=>ct.findIndex(t=>t.url===e.url)===t);if(k.length===0){K=!1,U(!1),V();return}let lt=k.length>0?xs%k.length:0,A=k.slice(lt).concat(k.slice(0,lt));xs=lt,bs=A,bs.length<=1&&(xs=0);let ut=()=>{bs.length>1&&(xs=(xs+1)%bs.length)};K=!0,V();let j=Le(ne||t||``),dt=ae||re||w||(le===`https`?`8434`:`8080`),ft=ie,pt=ft||j||``,mt=()=>{if(!j)return!0;let e=Ne(ft);if(!e)return!u(j);let t=j.trim().toLowerCase(),n=B(e).toLowerCase();return!n||!t||n===t||e.toLowerCase()===`l-${t}`?!0:(Ce(e),!1)},ht=e=>{let n=e.url,r=_c(),i=vc(),a=et(),o=gc(),s=Ze().trim(),c={};r&&(c.token=r,c.userKey=r),i&&(c.accessToken=i),a&&(c.clientAccessToken=a),o&&(c.clientId=o),s&&(c.peerInstanceId=s,c.deviceInstanceId=s);let l={};s&&(l.peerInstanceId=s,l.deviceInstanceId=s),l.connectionType=We(),l.archetype=nt(),l.cwspEnvelope=`v2`,o&&(l.clientId=o,l.userId=o),r&&(l.token=r,l.userKey=r),l[X.via]=mt()?e.source||`unknown`:`tunnel`,l[X.localEndpoint]=mt()?`1`:`0`;let u=ft||(Oe(m)?`L-200`:``)||``,d=u||pt,f=u||ft||j||pt,p=B(e.host||``).trim(),h=B(T||``).trim();return e.source===`page`&&p&&h&&p.toLowerCase()===h.toLowerCase()&&$o(d)&&(d=p,f=p),d&&(l[X.route]=d,l[X.routeTarget]=f),As()&&(l[X.hop]=e.host||t||`unknown`,l[X.host]=e.host||t||``,l[X.target]=j||``,l[X.targetPort]=dt,l[X.viaPort]=e.port||``,l[X.protocol]=e.protocol||`https`),a&&(l.clientAccessToken=a),i&&(l.accessToken=i),{url:n,clientToken:r,accessToken:i,clientId:o,peerInstanceId:s,handshakeAuth:c,queryParams:l}},gt=(e,t,n,r)=>{G=e,H(`connected`,`candidate=${n+1}/${A.length} candidate_url=${r} transport=${t.protocol} parallel=${Es}`),K=!1,vs=0,ks(),U(!0),nc(),G.on(`disconnect`,e=>{tc(),H(`disconnected`,`candidate=${n+1}/${A.length} candidate_url=${r} reason=${e||`unknown`}`),K=!1,U(!1),V();let t=_s;_s=!1;for(let[e,t]of Z.entries())clearTimeout(t.timeoutId),t.reject({ok:!1,error:`Disconnected before response for ${e}`}),Z.delete(e);if(G=null,t){vs=0;return}mc(e)&&(ut(),bs.length>1&&P(`WebSocket disconnect reason "${e||`unknown`}", trying next candidate on reconnect`));let i=vs+1;if(!pc(e))return;vs=i;let a=Math.min(Cs*i,5e3);ks(),ys=globalThis.setTimeout(()=>{ys=null,!(K||ps||G&&G.connected||G?.connecting)&&(H(`auto-reconnect`,`attempt=${`${i}/unlimited`} reason=${e||`unknown reason`}`),W())},a)}),G.on(`connect_error`,e=>{H(`socket-connect-error`,`candidate=${n+1}/${A.length} candidate_url=${r} reason=${e?.message||`unknown`}`),K=!1,V()}),G.on(`voice_result`,async e=>{cs(await Ac(e))}),G.on(`voice_error`,async e=>{cs(await Ac(e))}),G.on(`clipboard:update`,async e=>{let t=await Ac(e);if(!ze(sc(t)))return;let n=oc(t);if(n){Xo(n,{source:t?.source});return}Yo(ac(t),{source:t?.source})}),G.on(`data`,async e=>{let t=await Ac(e);xc(t)&&Tc(t)}),G.on(`message`,async e=>{let t=await Ac(e);xc(t)&&Tc(t)}),G.on(`network.fetch`,async(e,t)=>{let n=await Fc(e);typeof t==`function`&&t(n)}),ms(G)},_t=(t,n)=>new Promise(r=>{if(e!==q){r(!1);return}let i=A.slice(t,t+Es);if(!i.length){r(!1);return}if(t===0&&n===0){let e=ta();e&&(e.classList.remove(Lc),e.textContent=`connecting…`)}let s=!1,c=!1,l=0,u=i.length,d=null,f=null,p=(e,t,n,i,a)=>{if(!c){c=!0,s=!0;for(let t of[...J])t!==e&&(Y(t),t.removeAllListeners(),t.close(),J.delete(t));Y(e),J.delete(e),gt(e,t,n,i),r(!0)}},m=()=>{c||s||(l++,!(l<u)&&(c=!0,d?os(d):f&&ss(f),r(!1)))};for(let n=0;n<i.length;n++){let r=i[n],l=t+n,h=ht(r),{url:g,handshakeAuth:_,queryParams:v}=h;H(`connecting`,`batch=${t}-${t+u-1} candidate=${l+1}/${A.length} candidate_url=${g} transport=${r.protocol} source=${r.source} host=${r.host}:${r.port} target=${j}:${dt}`);let y=Yi(g,{auth:_,query:v,timeout:ws});J.add(y),y.__cwspProbeTimer=globalThis.setTimeout(()=>{if(e!==q){Y(y),y.removeAllListeners(),y.close(),J.delete(y);return}s||c||y.connected||(Y(y),y.removeAllListeners(),y.close(),J.delete(y),H(`connect-failed`,`candidate=${l+1}/${A.length} candidate_url=${g} reason=probe-hard-timeout`),m())},Ts),y.on(`connect`,()=>{if(Y(y),e!==q){y.removeAllListeners(),y.close(),J.delete(y);return}if(s||c){y.removeAllListeners(),y.close(),J.delete(y);return}p(y,r,l,g,h)}),y.on(`connect_error`,e=>{if(Y(y),J.delete(y),s||c){y.removeAllListeners(),y.close();return}y.removeAllListeners(),y.close();let t=e?.description||e?.context||``,n=String(e?.message||e||``),i=`${n} ${String(t)}`,u=r.protocol===`https`&&o(r.host)&&/xhr poll error|websocket error/i.test(n),p=/certificate|cert\.|ssl|tls|trust|ERR_CERT|ERR_SSL|handshake|authority|SELF_SIGNED|unknown.*cert|invalid.*cert|unable to verify|pkix|hostname|name mismatch/i.test(i),h=/refused|ECONNREFUSED|ENOTFOUND|timed out|timeout|unreachable|ERR_CONNECTION|ADDRESS_UNREACHABLE|NAME_NOT_RESOLVED|INTERNET_DISCONNECTED|network.*lost/i.test(i),_=Ca();u&&!d&&(p||!_&&!h)&&(d=g);let v=r.protocol===`https`&&a(r.host)&&!o(r.host)&&r.host!==`127.0.0.1`,b=`${n} ${String(t)}`;if(v&&/xhr poll error|websocket error|certificate|CERT|common name|ssl|tls|failed to fetch|name invalid/i.test(b)&&!f){let e=T&&!a(T)&&T!==`localhost`?T:``;e&&(f=e)}r.privateLanHint&&/cors|private network|address space|failed fetch/i.test(n)&&H(`connect-failed`,`candidate=${l+1}/${A.length} candidate_url=${g} reason=${n} hint=private-network-cors`),H(`connect-failed`,`candidate=${l+1}/${A.length} candidate_url=${g} reason=${n} details=${t?Zo(t):`none`}`),m()})}});(async()=>{for(let t=0;t<3;t++){for(let n=0;n<A.length;n+=Es)if(e!==q||await _t(n,t))return;t+1<3&&(H(`retry`,`round=${t+2}/3 next=0`),await new Promise(e=>globalThis.setTimeout(e,450)))}e===q&&(H(`failed`,`round=3/3 all-candidates`),K=!1,U(!1),V())})()}function us(){tc(),ks(),q+=1,_s=!0;for(let e of[...J])Y(e),e.removeAllListeners(),e.close(),J.delete(e);if(K=!1,!G){U(!1),V();return}P(`Disconnecting WebSocket...`),G.disconnect(),G=null,ms(null),U(!1)}function ds(e){hs=e,V(),e&&gs!==e&&(gs&&gs.removeEventListener(`click`,fs),gs=e,gs.addEventListener(`click`,fs))}function fs(){K||ps||G&&G.connected||G?.connecting?us():W()}var G,ps,K,ms,hs,gs,q,J,_s,vs,ys,bs,xs,Ss,Cs,ws,Ts,Es,Ds,Os,ks,Y,X,As,js,Ms,Ns,Ps,Fs,Is,Ls,Rs,zs,Bs,Vs,Z,Hs,Us,Ws,Gs,Ks,qs,Js,Ys,Xs,Zs,Qs,$s,ec,tc,nc,rc,ic,ac,oc,sc,cc,lc,uc,dc,fc,pc,mc,hc,gc,_c,vc,yc,bc,xc,Sc,Cc,wc,Tc,Ec,Dc,Oc,kc,Ac,jc,Mc,Nc,Pc,Fc,Ic,Lc,Rc=e((()=>{Qi(),ra(),ct(),Zc(),Aa(),be(),Xe(),$a(),xo(),Ae(),Ha(),wo(),Lo(),G=null,ps=!1,K=!1,ms=e=>{try{let t=globalThis;t.__socket=e;let n=t.window;n&&(n.__socket=e)}catch{}},hs=null,gs=null,q=0,J=new Set,_s=!1,vs=0,ys=null,bs=[],xs=0,Ss=new Set,Cs=800,ws=4800,Ts=5600,Es=3,Ds=`CWS_AIRPAD_VERBOSE_QUERY`,Os=8e3,ks=()=>{ys&&=(globalThis.clearTimeout(ys),null)},Y=e=>{let t=e;t.__cwspProbeTimer&&(globalThis.clearTimeout(t.__cwspProbeTimer),delete t.__cwspProbeTimer)},X={via:`cwsp_via`,localEndpoint:`cwsp_local_endpoint`,route:`cwsp_route`,routeTarget:`cwsp_route_target`,hop:`cwsp_hop`,host:`cwsp_host`,target:`cwsp_target`,targetPort:`cwsp_target_port`,viaPort:`cwsp_via_port`,protocol:`cwsp_protocol`},As=()=>{try{let e=String(globalThis?.localStorage?.getItem?.(Ds)||``).trim().toLowerCase();if([`1`,`true`,`yes`,`on`].includes(e))return!0}catch{}let e=String(globalThis?.[Ds]||``).trim().toLowerCase();return[`1`,`true`,`yes`,`on`].includes(e)},js=new Set,Ms=``,Ns=new Set,Ps=new Set,Fs=`ws`,Is=`ws`,Ls=e=>{let t=String(e||``).trim().toLowerCase();return!t||t===`ws`||t===`wss`||t===`socket`||t===`socket.io`||t===`socketio`?Fs:t},Rs=new TextEncoder,zs=new TextDecoder,Bs=new Map,Vs=new Map,So(()=>{Bs.clear(),Vs.clear()}),Z=new Map,Hs=[],Us=128,Ws=()=>{if(G?.connected)for(;Hs.length>0;){let e=Hs.shift();e&&Ec(e)}},Gs=e=>{let t=String(e||``).trim().toLowerCase();return t===`mouse:move`||t===`mouse:scroll`},Ks=async(e=7e3)=>z()?ko()||await Do():G?.connected?!0:(W(),await new Promise(t=>{let n=!1,r=e=>{if(!n){n=!0;try{i?.()}catch{}globalThis.clearTimeout(a),t(e)}},i=Vo(e=>{e&&r(!0)}),a=globalThis.setTimeout(()=>r(!!G?.connected),e)})),qs=3500,Js=``,Ys=0,Xs=``,Zs=0,Qs=``,$s=0,ec=null,tc=()=>{ec&&=(globalThis.clearInterval(ec),null)},nc=()=>{if(tc(),!Re()||!Le())return;let e=Je();ec=globalThis.setInterval(()=>{Jo()},e)},rc=e=>{if(typeof e==`string`)return e;if(!e||typeof e!=`object`)return``;let t=e;for(let e of[`text`,`content`,`body`]){let n=t[e];if(typeof n==`string`)return n}if(typeof t.result==`string`)return t.result;let n=t.payload??t.data;if(n&&n!==e){let e=rc(n);if(e)return e}return``},ic=e=>{let t=String(e||``).trim().toLowerCase();return t===`clipboard:update`||t===`clipboard:write`||t.startsWith(`airpad:clipboard:`)},ac=e=>{let t=e.payload??e.data??e.result??e.results;return rc(t)||rc(e)},oc=e=>{let t=[e.payload,e.data,e.result,e.results,e];for(let e of t){if(!e||typeof e!=`object`)continue;let t=e,n=t.asset??t.dataAsset??t.file??t.image;if(!n||typeof n!=`object`)continue;let r=n,i=typeof r.data==`string`?r.data.trim():``;if(!i)continue;let a=typeof r.mimeType==`string`&&r.mimeType.trim()||typeof r.type==`string`&&r.type.trim()||`image/png`;if(a.toLowerCase().startsWith(`image/`))return{hash:typeof r.hash==`string`?r.hash.trim():``,mimeType:a,data:i}}return null},sc=e=>{let t=e;return!t||typeof t!=`object`?``:String(t.from||t.byId||t.sender||``).trim()},cc=e=>{let t=String(e||``).trim().toLowerCase();return t.startsWith(`clipboard:`)?`clipboard`:t.startsWith(`files:`)?`storage`:t.startsWith(`mouse:`)?`mouse`:t.startsWith(`keyboard:`)?`input`:t.startsWith(`airpad:`)?`airpad`:t.startsWith(`sms:`)?`sms`:t.startsWith(`contacts:`)?`contact`:(t.startsWith(`notification:`)||t.startsWith(`notifications:`),`general`)},lc=e=>e?typeof e==`string`?e:e instanceof Error?`${e.name}: ${e.message}`:Zo(e):String(e),uc=e=>{try{let t=atob(e),n=new Uint8Array(t.length);for(let e=0;e<t.length;e+=1)n[e]=t.charCodeAt(e);return n}catch{return null}},dc=e=>typeof e==`object`&&!!e&&typeof e.cipher==`string`&&typeof e.sig==`string`,fc=e=>{if(!e||typeof e!=`string`)return null;try{return JSON.parse(e)}catch{return null}},pc=e=>!e||!(e===`io client disconnect`||e===`forced close`),mc=e=>!e||!(e===`io server disconnect`||e===`io client disconnect`),hc=()=>(Ge()||``).trim(),gc=()=>xe((Ye()||``).trim())||`airpad-client`,_c=()=>(Ke()||``).trim(),vc=()=>(tt()||``).trim(),yc=()=>wireTargetNodeIds(parseWireTargetList(at().trim())),bc=()=>globalThis.crypto?.randomUUID?globalThis.crypto.randomUUID():`airpad-${Date.now()}-${Math.random().toString(16).slice(2)}`,xc=e=>!!e&&typeof e==`object`&&(`op`in e||`what`in e||`uuid`in e||`result`in e||`error`in e),Sc=e=>e===`request`?`ask`:e===`response`?`result`:e===`signal`||e===`notify`||e===`redirect`?`act`:e,Cc=e=>e,wc=e=>{let t=gc(),n=_c(),r=(typeof e.accessToken==`string`&&e.accessToken.trim()?e.accessToken.trim():typeof e.airpadToken==`string`&&e.airpadToken.trim()?e.airpadToken.trim():``)||vc(),i=String(e.sender||e.byId||e.from||t||``).trim()||void 0,a=String(e.from||i||``).trim()||void 0,o=String(e.byId||i||``).trim()||void 0,s=Array.isArray(e.destinations)&&e.destinations.length?e.destinations:Array.isArray(e.nodes)?e.nodes:yc(),c=typeof e.uuid==`string`&&e.uuid.trim()?e.uuid.trim():bc(),l=Date.now();return{...e,op:Cc(e.op),type:String(e.type||e.what||``).trim()||e.what,protocol:Ls(e.protocol),transport:String(e.transport||Is).trim()||Is,purpose:String(e.purpose||cc(String(e.what||e.type||``))).trim()||`general`,sender:i,byId:o,from:a,nodes:s,destinations:s,ids:typeof e.ids==`object`&&e.ids!=null?e.ids:{byId:o,from:a,sender:i,destinations:s},urls:Array.isArray(e.urls)&&e.urls.length?e.urls:[qe()],tokens:Array.isArray(e.tokens)&&e.tokens.length?e.tokens:n?[n]:[],token:e.token||n||void 0,userKey:typeof e.userKey==`string`&&e.userKey.trim()?e.userKey:n||void 0,accessToken:r||void 0,flags:{...e.flags,canonicalV2:!0},uuid:c,timestamp:Number(e.timestamp||0)>0?Number(e.timestamp):l}},Tc=async e=>{let t=Sc(e.op),n=(e.what||e.type||``).trim(),r=typeof e.uuid==`string`?e.uuid:``;if(r&&Z.has(r)){let n=Z.get(r);n&&(clearTimeout(n.timeoutId),Z.delete(r),t===`error`||e.error!==void 0?n.reject(e.error??{ok:!1,error:`Unknown coordinator error`}):n.resolve(e.result??e.results));return}if(t===`ask`&&n===`clipboard:get`){try{let t=await ya();Ec({...Dc(`result`,n,null,{uuid:r,nodes:e.from?[e.from]:void 0}),result:typeof t==`string`?t:String(t||``)})}catch(t){Ec({...Dc(`error`,n,null,{uuid:r,nodes:e.from?[e.from]:void 0}),error:t?.message||String(t)})}return}if(t===`act`&&n){let t=ic(n)?`clipboard`:co(n);if(go.shouldSuppress(e,t))return}if(ic(n)){if(!ze(sc(e)))return;let t=e.payload??e.data??e.result??e.results,n=oc(e);if(n){Xo(n,{source:typeof t==`object`&&t?String(t.source||``):void 0});return}Yo(ac(e),{source:typeof t==`object`&&t?String(t.source||``):void 0});return}if(n===`files:offer`||n===`files:error`){let t=e.payload??e.data??e.result??e.results;try{globalThis.dispatchEvent(new CustomEvent(`cws:filesIncomingOffer`,{detail:{what:n,payload:t,sender:sc(e),uuid:r,from:e.from}}))}catch{}return}},Ec=e=>{if(z()){let t=String(e.what||e.type||``),n=e.payload??e.data??{},r=Array.isArray(e.nodes)?e.nodes.map(String):void 0;return Io({op:e.op===`ask`||e.op===`request`?`ask`:`act`,what:t,payload:n,nodes:r,uuid:typeof e.uuid==`string`?e.uuid:void 0}),ko()}return!G||!G.connected?!1:(G.send(wc(e)),!0)},Dc=(e,t,n,r={})=>{let i=gc(),a=_c(),o=r.accessToken===void 0?vc():String(r.accessToken).trim()||vc();return mo(Ba({op:Cc(e),what:t,type:t,purpose:cc(t),protocol:Fs,transport:Is,payload:n,nodes:r.nodes??yc(),destinations:r.nodes??yc(),uuid:r.uuid,sender:i,byId:i,from:i,ids:{byId:i,from:i,sender:i,destinations:r.nodes??yc()},urls:[qe()],tokens:a?[a]:[],flags:{canonicalV2:!0},token:a||void 0,userKey:a||void 0,accessToken:o||void 0,timestamp:Date.now()}))},Oc=async e=>{if(!e||!globalThis.crypto?.subtle)return null;if(Bs.has(e))return Bs.get(e)||null;let t=Rs.encode(e),n=await globalThis.crypto.subtle.digest(`SHA-256`,t),r=await globalThis.crypto.subtle.importKey(`raw`,n,`AES-GCM`,!1,[`encrypt`,`decrypt`]);return Bs.set(e,r),r},kc=async e=>{if(!dc(e))return e;let t=hc(),n=uc(e.cipher);if(!n)return e;if(!t||!globalThis.crypto?.subtle){let t=zs.decode(n);return fc(t)??e}let r=await Oc(t);if(!r)return e;if(n.length<28){let t=zs.decode(n);return fc(t)??e}let i=n.slice(0,12),a=n.slice(12);try{let t=new Uint8Array(await globalThis.crypto.subtle.decrypt({name:`AES-GCM`,iv:i},r,a)),n=zs.decode(t);return fc(n)??e}catch{return e}},Ac=async e=>!dc(e)||Qo()!==`secure`?e:kc(e),jc=()=>{try{return String(new URL(location.href).hostname).toLowerCase()}catch{return``}},Mc=e=>{if(!e||typeof e!=`string`)return!1;let t;try{t=new URL(e,location.href)}catch{return!1}let n=t.hostname.toLowerCase(),r=t.protocol.toLowerCase();if(r!==`http:`&&r!==`https:`)return!1;let i=jc();return es(n)||n===`localhost`||n===i},Nc=e=>{let t={};if(!e)return t;for(let[n,r]of Object.entries(e))typeof n!=`string`||!n.trim()||typeof r==`string`&&(t[n]=r);return t},Pc=e=>{let t={};return e.forEach((e,n)=>{t[n]=e}),t},Fc=async e=>{let t=typeof e?.requestId==`string`?e.requestId.trim():``,n=typeof e?.method==`string`?e.method.toUpperCase():`GET`,r=typeof e?.url==`string`?e.url:``,i=e&&typeof e.timeoutMs==`number`?e.timeoutMs:12e3,a=Number.isFinite(i)&&i>0?Math.min(Math.max(Math.round(i),1e3),6e4):12e3;if(!t)return{ok:!1,status:400,statusText:`Bad Request`,error:`Missing requestId`};if(!Mc(r))return{requestId:t,ok:!1,status:400,statusText:`Bad Request`,error:`URL not allowed`};let o=new AbortController,s=globalThis.setTimeout(()=>o.abort(),a);try{let i=Nc(e?.headers),a=![`GET`,`HEAD`].includes(n),s=e?.body,c=a?typeof s==`string`?s:Zo(s):void 0,l=await fetch(r,{method:n,headers:i,body:c,signal:o.signal}),u=await l.text();return{requestId:t,ok:l.ok,status:l.status,statusText:l.statusText,headers:Pc(l.headers),body:u}}catch(e){return{requestId:t,ok:!1,status:0,statusText:`Network Error`,error:lc(e)}}finally{clearTimeout(s)}},Ic=(e,t)=>!Za(e)||!t||typeof t!=`object`||Array.isArray(t)?t:Qa(t),Lc=`ws-status-tls-hint`})),zc=t({applyHubSocketFromSettings:()=>Gc,backendOwnsExclusiveHubWebsocket:()=>Hc,installAirpadHubLifecycleRecovery:()=>Wc,nativeShellOwnsExclusiveHubWebsocket:()=>Bc,nodeClipboardHubOwnsExclusiveWebsocket:()=>Vc});function Bc(){if(!Be())return!1;try{if(globalThis.__CWS_NATIVE__===!0)return!0}catch{}return Xc()}function Vc(){return ot()}function Hc(){return Bc()||Vc()}function Uc(){return!(Hc()||!Ie()&&!st()||!qe().trim())}function Wc(){if(qc||!Yc())return;qc=!0;let e=globalThis.document,t=globalThis.window;e.addEventListener(`visibilitychange`,()=>{e.visibilityState===`hidden`&&(Jc=Date.now())});let n=e=>{globalThis.setTimeout(e,280)},r=()=>{Uc()&&(async()=>{ds(null);let e=!!zo()?.connected;if(Jc>0&&Date.now()-Jc>=Kc&&(e||Bo())){ls(`visibility`);return}!e&&!Bo()&&W()})()},i=e=>{Uc()&&(ds(null),ls(e))};e.addEventListener(`visibilitychange`,()=>{e.visibilityState===`visible`&&n(r)}),t.addEventListener(`online`,()=>n(()=>i(`online`))),t.addEventListener(`pageshow`,e=>{e.persisted&&n(()=>i(`bfcache`))})}async function Gc(e){if(Wc(),await lt(e))return;rt(e);try{let e=String(document.documentElement?.dataset?.cwspSurface||``).toLowerCase(),t=String(location.hostname||``).toLowerCase();if(e===`cwsp-control`||t===`cwsp.u2re.space`||t===`www.cwsp.u2re.space`)return}catch{}if(Bc()||Vc()||!Ie()&&!st())return;let t=qe().trim();if(t){try{let e=/^https?:\/\//i.test(t)?t.split(`,`)[0].trim():`https://${t}`,n=new URL(e).hostname.toLowerCase();if(n===`cwsp.u2re.space`||n===`www.cwsp.u2re.space`||n===`md.u2re.space`||n===`www.md.u2re.space`){console.warn(`[hub-socket-boot] refusing Control SPA host as /ws target`,t);return}}catch{}ds(null),W()}}var Kc,qc,Jc,Yc,Xc,Zc=e((()=>{k(),ct(),Rc(),Kc=12e3,qc=!1,Jc=0,Yc=()=>{try{let e=globalThis;return!!(e.window&&e.document)}catch{return!1}},Xc=()=>{try{let e=globalThis.Capacitor;return typeof e?.isNativePlatform==`function`&&!!e.isNativePlatform()}catch{return!1}}})),Qc=t({ensureCapacitorPermissions:()=>il,isCapacitorNative:()=>el}),$c,el,tl,nl,rl,il,al=e((()=>{$c=()=>{try{let e=globalThis?.Capacitor;return e&&typeof e==`object`?e:null}catch{return null}},el=()=>{let e=$c();try{return!!(e?.isNativePlatform?.()??(e?.platform&&e.platform!==`web`))}catch{return!1}},tl=e=>{let t=$c()?.Plugins?.[e];return t&&typeof t==`object`?t:null},nl=async(e,...t)=>{try{return typeof e==`function`?await e(...t):void 0}catch{return}},rl=!1,il=async()=>{if(!el())return{native:!1,requested:[]};if(rl)return{native:!0,requested:[]};rl=!0;let e=[],t=tl(`Clipboard`);t&&(await nl(t.read),e.push(`clipboard`));let n=tl(`CwsPlatform`);if(n)await nl(n.requestRuntimePermissions),e.push(`CwsPlatform.requestRuntimePermissions`);else{let t=tl(`DevicePermissions`)||tl(`Permissions`);t&&typeof t.requestPermissions==`function`&&(await nl(t.requestPermissions,{permissions:[`POST_NOTIFICATIONS`]}),e.push(`legacy-permissions`))}let r=tl(`LocalNotifications`);return r&&typeof r.requestPermissions==`function`&&(await nl(r.requestPermissions),e.push(`notifications`)),{native:!0,requested:e}}})),ol,sl,cl,ll,ul,dl=e((()=>{al(),ol=()=>{try{let e=globalThis?.Capacitor;return e&&typeof e==`object`?e:null}catch{return null}},sl=e=>{let t=ol()?.Plugins?.[e];return t&&typeof t==`object`?t:null},cl=async(e,...t)=>{try{return typeof e==`function`?await e(...t):void 0}catch(e){console.warn(`[capacitor-settings-permissions]`,e);return}},ll=async e=>{let t=[],n=[],r=!1;if(!el())return{lines:t,results:n,prompted:r};e.shell&&(e.shell.acceptSmsBridgeData=!1,e.shell.enableNativeSms=!1);let i=e.shell||{},a=i.acceptContactsBridgeData===!0,o=(i.bridgeDaemonEnabled??!0)!==!1,s=(i.enableRemoteClipboardBridge??!0)!==!1,c=o||s,l=sl(`CwsPlatform`);if(a||c)if(l?.requestSettingsPermissions){let e=await cl(l.requestSettingsPermissions,{contacts:a,sms:!1,notifications:c,overlay:!1}),i=!1;if(e&&typeof e==`object`){i=e.prompted===!0,r=i;let t=e.results;if(Array.isArray(t)){for(let e of t)if(e&&typeof e==`object`){let t=String(e.permission??``);if(t===`SYSTEM_ALERT_WINDOW`||t===`READ_SMS`||t===`RECEIVE_SMS`||t===`SEND_SMS`)continue;n.push({permission:t,granted:!!e.granted})}}}let o=n.filter(e=>e.granted===!1);o.length?t.push(`Permission denied: ${o.map(e=>e.permission).filter(Boolean).join(`, `)}`):i&&t.push(`Runtime permissions requested`)}else{let e=sl(`DevicePermissions`)||sl(`Permissions`),n=[];a&&n.push(`READ_CONTACTS`),c&&n.push(`POST_NOTIFICATIONS`),e?.requestPermissions&&n.length&&(await cl(e.requestPermissions,{permissions:n}),t.push(`Runtime permissions requested (legacy plugin)`))}return o&&l?.startCwspBridge?(await cl(l.startCwspBridge),t.push(`CWSP foreground service started`)):!o&&l?.stopCwspBridge&&(await cl(l.stopCwspBridge),t.push(`CWSP foreground service stopped`)),{lines:t,results:n,prompted:r}},ul=async e=>{if(!el()||((e?.shell||{}).bridgeDaemonEnabled??!0)===!1)return!1;e?.shell&&(e.shell.acceptSmsBridgeData=!1,e.shell.enableNativeSms=!1);let t=sl(`CwsPlatform`);return t?.startCwspBridge?(await cl(t.startCwspBridge),!0):!1}})),fl=t({BootLoader:()=>gl,bootLoader:()=>_l,bootMinimal:()=>pl,default:()=>_l});async function pl(e,t=`viewer`,n){let r=mr(t,`viewer`),i=pr(r)?[r]:[`viewer`],a=i[0];return _l.boot(e,{styleSystem:`vl-basic`,shell:`minimal`,defaultView:r,channels:i,channelPriorityId:a,rememberChoice:n?.rememberChoice??!0,skipInitialNavigate:n?.skipInitialNavigate??!1})}var ml,hl,gl,_l,vl=e((()=>{c(),mt(),yt(),Er(),jr(),de(),k(),Fe(),Ii(),qn(),qi(),hr(),Zc(),dl(),_(),ml=e=>e===`faint`?`tabbed`:e===`base`?`immersive`:e,hl={raw:{name:`Raw (No Framework)`,stylesheets:[],description:`No CSS framework, raw browser defaults`,recommendedShells:[`immersive`]},"vl-core":{name:`Core (Shared Foundation)`,stylesheets:[],description:`Shared foundation styles for all veela variants`,recommendedShells:[`immersive`,`minimal`]},"vl-basic":{name:`Basic Veela Styles`,stylesheets:[],description:`Minimal styling for basic functionality`,recommendedShells:[`window`,`tabbed`,`minimal`,`environment`,`immersive`,`content`]},"vl-advanced":{name:`Advanced (Full-Featured Styling)`,stylesheets:[],description:`Full-featured styling with design tokens and effects`,recommendedShells:[`tabbed`,`minimal`,`environment`]},"vl-beercss":{name:`BeerCSS (Beer CSS Compatible)`,stylesheets:[],description:`Beer CSS compatible styling with Material Design 3`,recommendedShells:[`tabbed`]}},gl=class e{static instance;state={phase:`idle`,styleSystem:null,shell:null,view:null,error:null};stateChangeHandlers=new Set;shellInstance=null;implicitBridgeCleanup=null;phaseHandlers=new Map;constructor(){yr()}static getInstance(){return e.instance||=new e,e.instance}async boot(e,t){console.log(`[BootLoader] Starting boot sequence:`,t);try{if(this.shellInstance)try{this.implicitBridgeCleanup?.(),this.implicitBridgeCleanup=null,xr.unload(this.shellInstance.id)}catch(e){console.warn(`[BootLoader] Failed to unload previous shell:`,e)}finally{this.shellInstance=null}Dr(),pe().catch(()=>{});try{let{initFrontendDebugCapture:e}=await v(async()=>{let{initFrontendDebugCapture:e}=await import(`./frontend-debug-capture-BNPCucC4.js`).then(e=>(e.i(),e.t));return{initFrontendDebugCapture:e}},[],import.meta.url);e()}catch{}let n=await ut().catch(e=>(console.warn(`[BootLoader] Failed to load settings:`,e),null)),r=n;if(fe()){let e=await A().catch(()=>null);e&&(r=e)}if(r&&Gc(r).catch(()=>void 0),fe()&&ul(r).catch(e=>{console.warn(`[BootLoader] CWSP bridge daemon auto-start skipped:`,e)}),ji(r??Pe),!(()=>{try{let e=globalThis,t=typeof document<`u`?String(document.documentElement?.dataset?.cwspSurface||``):``;return!!(e.__CWS_SKIP_PWA__||e.__CWS_NEUTRALINO_BOOT__||e.__CWS_WEBNATIVE_BOOT__||e.Neutralino||typeof e.NL_OS==`string`||t===`cwsp-control`||t===`gateway`)}catch{return!1}})())try{let{initIngressPWA:e}=await v(async()=>{let{initIngressPWA:e}=await import(`./sw-handling-DzZPyl3Z.js`);return{initIngressPWA:e}},[],import.meta.url);await e()}catch(e){console.warn(`[BootLoader] Share-target / service worker ingress failed (non-fatal):`,e)}await this.loadStyles(t.styleSystem);let i=this.resolveThemeFromSettings(n),a=await this.loadShell(t.shell,e);return a.setTheme(t.theme||i),await a.mount(e),this.implicitBridgeCleanup?.(),this.implicitBridgeCleanup=Un(),t.channels&&t.channels.length>0&&await this.initChannels(t.channels,t.channelPriorityId),t.skipInitialNavigate?this.dismissShellLoadingSpinner(a):await a.navigate(t.defaultView),this.setPhase(`ready`),t.rememberChoice&&this.savePreferences(t),console.log(`[BootLoader] Boot complete`),a}catch(e){throw console.error(`[BootLoader] Boot failed:`,e),this.updateState({phase:`error`,error:e}),e}}resolveThemeFromSettings(e){let t=e?.appearance?.theme||`auto`;return t===`dark`?Tr:t===`light`?wr:Cr}dismissShellLoadingSpinner(e){try{let t=e.getElement().shadowRoot?.querySelector(`.app-shell__loading`);t&&(t.hidden=!0)}catch{}}async loadStyles(e){this.setPhase(`styles`),console.log(`[BootLoader] Loading style system: ${e}`);let t=hl[e]||hl[`vl-basic`];try{await Wi(e)}catch(t){throw console.error(`[BootLoader] Failed to load style system: ${e}`,t),t}for(let e of t.stylesheets)try{await a(e)}catch(t){console.warn(`[BootLoader] Failed to load stylesheet: ${e}`,t)}this.updateState({styleSystem:e}),console.log(`[BootLoader] Style system ${e} loaded`)}async loadShell(e,t){this.setPhase(`shell`);let n=ml(e);n!==e&&console.warn(`[BootLoader] Shell "${e}" is temporarily disabled, redirecting to "${n}"`),console.log(`[BootLoader] Loading shell: ${n}`);let r=await xr.load(n,t);return this.shellInstance=r,this.updateState({shell:n}),console.log(`[BootLoader] Shell ${n} loaded`),r}async initChannels(e,t){this.setPhase(`channels`);let n=[...new Set(e)];if(n.length===0)return;let r=(t&&n.includes(t)?t:null)??n[0],i=n.filter(e=>e!==r);console.log(`[BootLoader] Initializing primary channel:`,r,i.length?`(+${i.length} deferred)`:``);try{await vt.initChannel(r)}catch(e){console.warn(`[BootLoader] Failed to init primary channel ${r}:`,e)}if(i.length===0){console.log(`[BootLoader] Channels initialized`);return}let a=()=>{(async()=>{for(let e of i)try{await vt.initChannel(e)}catch(t){console.warn(`[BootLoader] Failed to init channel ${e}:`,t)}console.log(`[BootLoader] Deferred channels initialized:`,i)})()};typeof globalThis.requestIdleCallback==`function`?globalThis.requestIdleCallback(a,{timeout:5e3}):globalThis.setTimeout?.(a,0)}updateState(e){Object.assign(this.state,e),this.notifyStateChange()}setPhase(e){this.updateState({phase:e});let t=this.phaseHandlers.get(e);if(t)for(let e of t)try{e(this.state)}catch(e){console.error(`[BootLoader] Phase handler error:`,e)}}notifyStateChange(){for(let e of this.stateChangeHandlers)try{e(this.state)}catch(e){console.error(`[BootLoader] State handler error:`,e)}}onStateChange(e){return this.stateChangeHandlers.add(e),()=>{this.stateChangeHandlers.delete(e)}}onPhase(e,t){return this.phaseHandlers.has(e)||this.phaseHandlers.set(e,new Set),this.phaseHandlers.get(e).add(t),()=>{this.phaseHandlers.get(e)?.delete(t)}}getState(){return{...this.state}}getShell(){return this.shellInstance}savePreferences(e){try{let t=ml(e.shell);localStorage.setItem(`rs-boot-style`,e.styleSystem),localStorage.setItem(`rs-boot-shell`,t),localStorage.setItem(`rs-boot-view`,e.defaultView),localStorage.setItem(`rs-boot-remember`,`1`)}catch(e){console.warn(`[BootLoader] Failed to save preferences:`,e)}}loadPreferences(){try{if(localStorage.getItem(`rs-boot-remember`)!==`1`)return null;let e=ml(localStorage.getItem(`rs-boot-shell`)||`minimal`);return{styleSystem:localStorage.getItem(`rs-boot-style`)||void 0,shell:e,defaultView:localStorage.getItem(`rs-boot-view`)||void 0}}catch{return null}}clearPreferences(){try{localStorage.removeItem(`rs-boot-style`),localStorage.removeItem(`rs-boot-shell`),localStorage.removeItem(`rs-boot-view`),localStorage.removeItem(`rs-boot-remember`),localStorage.removeItem(pt)}catch{}}},_l=gl.getInstance()}));function yl(e){if(e&&typeof e.port==`number`)return e;try{let e=globalThis,t=e.__WEBNATIVE_AUTH__||e.__NEUTRALINO_AUTH__;if(t&&typeof t.port==`number`)return t}catch{}return null}function bl(e){if(!e||typeof e!=`object`)return{};let t=$(e.settings||e.portable),n=$(e.snapshot);if(!Object.keys(t).length&&!Object.keys(n).length)return{};let r=$(t.cwsp||n.cwsp),i=$(t.bridge||n.bridge||$(t.core).bridge),a={...$(r),...$(t.shell||n.shell)},o=$(t.core),s=Array.isArray(i.endpoints)?i.endpoints.map(e=>String(e||``).trim()).filter(Boolean):[],c=String(o.endpointUrl||i.endpointUrl||a.remoteHost||a.endpointUrl||r.endpointUrl||r.endpoint||r.origin||r.gatewayUrl||s[0]||``).trim(),l=String(o.userId||i.userId||i.deviceId||a.clientId||a.userId||r.clientId||r.userId||r.nodeId||``).trim(),u=String(o.ecosystemToken||o.userKey||i.userKey||a.accessToken||a.clientToken||r.accessToken||r.clientToken||``).trim(),d=i.allowInsecureTls===void 0?o.allowInsecureTls===void 0?void 0:!!o.allowInsecureTls:!!i.allowInsecureTls,f=$(o.socket),p={...o};c&&(p.endpointUrl=c),l&&(p.userId=l),u?(p.userKey=u,p.ecosystemToken=u,p.socket={...f,accessToken:u}):Object.keys(f).length&&(p.socket=f),d!==void 0&&(p.allowInsecureTls=d),p.preferBackendSync===void 0&&(p.preferBackendSync=!0),c&&!a.remoteHost&&(a.remoteHost=c),l&&!a.clientId&&(a.clientId=l);let m=$(e.control),h={...t,core:p,shell:{...a}};return Object.keys(m).length&&(h.control=m),h}function xl(e){if(e&&typeof e.port==`number`)return e;try{let e=globalThis,t=e.__NEUTRALINO_AUTH__;if(t&&typeof t.port==`number`)return t;let n=e.NL_PORT,r=typeof n==`number`?n:n?Number(n):NaN;if(Number.isFinite(r)){let t=e.NL_KEY??e.NL_TOKEN;return{port:r,key:typeof t==`string`?t:void 0}}}catch{}return null}async function Q(e,t){try{let n=typeof e.port==`number`&&e.port>0?e.port:29110;if(n===8434){let t=String(e.key||``);t&&t!==`cwsp-neutralino-local`||(n=29110)}let r=new Headers(t?.headers);r.set(`Content-Type`,`application/json`),e.key&&r.set(`X-API-Key`,e.key);let i=t?.signal??(typeof AbortSignal<`u`&&typeof AbortSignal.timeout==`function`?AbortSignal.timeout(2e3):void 0),a={...t,headers:r,cache:`no-store`,signal:i,mode:`cors`,credentials:`omit`,targetAddressSpace:`loopback`},o=await fetch(`http://127.0.0.1:${n}/service/config`,a);if(!o.ok)return null;let s=await o.json();return n===8434&&(s&&typeof s==`object`?s.control?.surface:void 0)!==`capacitor-android`?null:s}catch{return null}}async function Sl(e,t){try{let n=new Headers(t?.headers);n.set(`Content-Type`,`application/json`),e.key&&n.set(`X-API-Key`,e.key);let r=await fetch(`http://127.0.0.1:${e.port}/neutralino/config`,{...t,headers:n,cache:`no-store`});return r.ok?await r.json():null}catch{return null}}function Cl(e){let t=yl(e);return t?{get:async()=>bl(await Q(t,{method:`GET`})),patch:async e=>bl(await Q(t,{method:`POST`,body:JSON.stringify(e)})),defaults:async()=>(await Q(t,{method:`GET`}))?.defaults??{},snapshot:async()=>(await Q(t,{method:`GET`}))?.snapshot??{}}:null}function wl(e){let t=xl(e);return t?{get:async()=>{let[e,n]=await Promise.all([Q(t,{method:`GET`}),Sl(t,{method:`GET`})]),r=bl(e),i=n?.config??{};return{...r,neutralino:i}},patch:async e=>bl(await Q(t,{method:`POST`,body:JSON.stringify(e)})),defaults:async()=>(await Q(t,{method:`GET`}))?.defaults??{},snapshot:async()=>(await Q(t,{method:`GET`}))?.snapshot??{}}:null}function Tl(){try{globalThis.__CWS_NEUTRALINO_BOOT__=!0}catch{}}function El(){try{globalThis.__CWS_WEBNATIVE_BOOT__=!0}catch{}}var $,Dl=e((()=>{$=e=>typeof e==`object`&&e&&!Array.isArray(e)?e:{}}));function Ol(){let e=globalThis;return e.__CWS_WEBNATIVE_BOOT__||e.__CWS_NEUTRALINO_BOOT__?`webnative`:e.Capacitor===void 0?e.chrome!==void 0&&e.chrome?.runtime?`crx`:`web`:`capacitor`}function kl(e){Hl=e}function Al(e,t){Vl[e]=t}function jl(e){delete Vl[e]}function Ml(){for(let e of Object.keys(Vl))delete Vl[e]}function Nl(e,t){let n={...e};for(let[e,r]of Object.entries(t)){let t=n[e];typeof r==`object`&&r&&!Array.isArray(r)&&typeof t==`object`&&t&&!Array.isArray(t)?n[e]={...t,...r}:n[e]=r}return n}function Pl(e={},t={}){let n={...e};return{get:async()=>({...n}),patch:async e=>(n=Nl(n,e),{...n}),...t}}function Fl(){return Hl()}function Il(){let e=Hl();return Vl[e]||Vl.web||null}async function Ll(){let e=Il();if(!e)return{};try{return await e.get()}catch{return{}}}async function Rl(e){let t=Il();return t?t.patch(e):{}}async function zl(){let e=Il();if(!e?.defaults)return{};try{return await e.defaults()}catch{return{}}}async function Bl(){let e=Il();if(!e?.snapshot)return{};try{return await e.snapshot()}catch{return{}}}var Vl,Hl,Ul=e((()=>{Vl={},Hl=Ol}));function Wl(e){let t={port:e.port,key:e.key},n=globalThis;return n.__WEBNATIVE_AUTH__={port:e.port,key:e.key},n.__NEUTRALINO_AUTH__=t,n.__CWS_WEBNATIVE_BOOT__=!0,n.__CWS_NEUTRALINO_BOOT__=!0,n.__CWS_NODE_CLIPBOARD_HUB__=!0,t}async function Gl(e){try{let{getRemoteHost:t,getAccessToken:n,getAirPadClientId:r}=await v(async()=>{let{getRemoteHost:e,getAccessToken:t,getAirPadClientId:n}=await import(`./config-DRIOcGx0.js`).then(e=>(e.y(),e.n));return{getRemoteHost:e,getAccessToken:t,getAirPadClientId:n}},[],import.meta.url),i=t().trim(),a=n().trim(),o=r().trim(),s={};if(i&&(s.remoteHost=i),a&&(s.accessToken=a,s.clientToken=a),o&&(s.clientId=o),s.reload=!1,!Object.keys(s).filter(e=>e!==`reload`).length)return;let c=typeof AbortSignal<`u`&&typeof AbortSignal.timeout==`function`?AbortSignal.timeout(2e3):void 0;await fetch(`http://127.0.0.1:${e.port}/service/clipboard-hub`,{method:`POST`,headers:{"Content-Type":`application/json`,"X-API-Key":e.key},body:JSON.stringify(s),cache:`no-store`,signal:c});try{let e=globalThis,t=typeof e.NL_PATH==`string`?e.NL_PATH:``,n=e.Neutralino?.filesystem?.writeFile;t&&n&&await n(`${t}/.tmp/cwsp-hub-auth.json`,JSON.stringify({remoteHost:i||void 0,accessToken:a||void 0,clientToken:a||void 0,clientId:o||void 0,writtenAt:new Date().toISOString()},null,2))}catch{}}catch(e){console.warn(`[CWSP Neutralino] clipboard-hub credential sync skipped`,e)}}function Kl(e){try{let t=wl(e);t&&Al(`webnative`,t)}catch(e){console.warn(`[CWSP] settings arm registration skipped`,e)}}function ql(){let e=xl();return e&&typeof e.port==`number`&&e.key&&e.port!==8434&&Number(e.port)>1024?{port:e.port,key:String(e.key)}:{port:Ql,key:$l}}async function Jl(){try{let e=globalThis,t=typeof e.NL_PATH==`string`?e.NL_PATH:``,n=e.Neutralino?.filesystem?.readFile;if(!t||!n)return null;let r=await n(`${t}/.tmp/cwsp-control-auth.json`),i=JSON.parse(r);if(typeof i.port==`number`&&typeof i.key==`string`)return{port:i.port,key:i.key}}catch{}return null}function Yl(e=15e3){let t=Date.now()+e;(async()=>{for(;Date.now()<t;){let e=await Jl();if(e){Kl(Wl(e));try{let t=await fetch(`http://127.0.0.1:${e.port}/service/config`,{headers:{"X-API-Key":e.key},cache:`no-store`});if(t.ok){console.log(`[CWSP Neutralino] control host ready`,e.port);try{let e=await t.json(),n=e.settings||e.portable||{},{syncAirpadRemoteConfigFromAppSettings:r}=await v(async()=>{let{syncAirpadRemoteConfigFromAppSettings:e}=await import(`./config-DRIOcGx0.js`).then(e=>(e.y(),e.n));return{syncAirpadRemoteConfigFromAppSettings:e}},[],import.meta.url);r(n,{persist:!0})}catch(e){console.warn(`[CWSP Neutralino] airpad hydrate from portable skipped`,e)}await Gl(e);return}}catch{}}await new Promise(e=>setTimeout(e,400))}console.warn(`[CWSP Neutralino] control host still warming — clipboard/settings will retry on use`)})()}async function Xl(){let e=ql();try{let t=await Promise.race([Jl(),new Promise(e=>setTimeout(()=>e(null),400))]);t&&(e=t)}catch{}let t=Wl(e);Kl(t);try{let e=Cl();e&&!t&&Al(`webnative`,e)}catch{}Yl(),await pl(document.body,`network`);try{document.getElementById(`cwsp-boot-fallback`)?.remove()}catch{}(async()=>{let e=await Jl()||t;Wl(e),await Gl(e)})()}var Zl,Ql,$l,eu=e((()=>{vl(),Dl(),Ul(),_(),Zl=[`minimal`,`network`,`settings`],Ql=29110,$l=`cwsp-neutralino-local`,document.documentElement.dataset.cwspEnabledViews=Zl.join(`,`),Tl(),El(),Xl().catch(e=>{console.error(`[CWSP Neutralino] minimal-shell boot failed`,e);try{let t=document.getElementById(`cwsp-boot-fallback`);t&&(t.textContent=`CWSP boot failed: ${e instanceof Error?e.message:String(e)}`)}catch{}})}));e((()=>{eu()}))();export{gn as $,la as A,Lr as B,W as C,Bo as D,Rc as E,Pi as F,hr as G,Er as H,Mi as I,yn as J,pr as K,Ai as L,va as M,wi as N,Vo as O,ji as P,_n as Q,Rr as R,Zc as S,ds as T,ir as U,N as V,fr as W,hn as X,On as Y,mn as Z,ll as _,Bl as a,en as at,el as b,Nl as c,Pt as ct,Il as d,ft as dt,vn as et,kl as f,mt as ft,dl as g,vl as h,zl as i,tn as it,Aa as j,Ro as k,Rl as l,yt as lt,fl as m,Pl as n,sn as nt,Ll as o,rn as ot,jl as p,mr as q,Fl as r,nn as rt,Ul as s,Xt as st,Ml as t,pn as tt,Al as u,vt as ut,Qc as v,us as w,zc as x,al as y,Fr as z};