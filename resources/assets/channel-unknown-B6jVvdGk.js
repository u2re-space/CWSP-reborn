import{n as e}from"./rolldown-runtime-C0FnF6B9.js";import{I as t,Jt as n,L as r,R as i,Rt as a,ft as o,r as s,t as c,v as l}from"./src-DaqdrrCE.js";import{n as u,t as d}from"./preload-helper-DFTwEg7x.js";import{c as f,n as p,u as m}from"./Names-D5qspMxH.js";import{a as h,c as g,i as ee,n as te,o as _,p as v,r as ne,s as y}from"./UnifiedMessaging-CNtaQBln.js";import{r as b,t as re}from"./view-inbound-timing-CxhYQUp2.js";import{a as ie,i as ae,n as oe,r as se,t as x}from"./view-ingress-validation-BFwuw_Yo.js";import{a as S,i as ce}from"./ShareTargetGateway-OOEofy89.js";import{a as le,o as ue}from"./Settings-D_-YuEG2.js";import{a as de,i as C,n as w,o as fe,r as pe,s as T,t as me}from"./icon-DwAFT1ZT.js";var E;function D(){return(D=e((()=>{E=`@layer layout {
  /*
   * Isolate view subtree from shell chrome inheritance while Veela / theme settle after first paint.
   * Tokens use --view-* first; shell --shell-* must not win here via late cascade.
   */
  :where([data-cw-view-host=true]) {
    display: block;
    box-sizing: border-box;
    inline-size: 100%;
    block-size: 100%;
    min-inline-size: 0;
    min-block-size: 0;
    isolation: isolate;
    position: relative;
    z-index: 0;
    color-scheme: light dark;
    color: var(--view-fg, var(--color-on-surface, canvasText));
    color: contrast-color(var(--view-bg, var(--color-surface, canvas)));
    background-color: var(--view-bg, var(--color-container, canvas));
  }
}
/*
 * Boot-time viewer layout only (subsystem shells + channel preload).
 * Toolbar/spacing/button chrome lives in markdown-view \`layer.view.viewer\` — keep this file
 * structural to avoid padding/gap/border fights when both sheets load.
 */
@layer components {
  .cw-view-viewer-shell {
    display: flex;
    flex-direction: column;
    inline-size: 100%;
    block-size: 100%;
    min-inline-size: 0;
    min-block-size: max(100%, 100cqb);
    max-block-size: none;
  }
  @media print {
    :where([data-cw-view-host=true]),
    .cw-view-viewer-shell,
    .view-viewer,
    .view-viewer__content {
      overflow: visible !important;
      contain: none !important;
      container-type: normal !important;
      position: static !important;
      inset: auto !important;
      display: block !important;
      block-size: auto !important;
      min-block-size: 0 !important;
      max-block-size: none !important;
      height: auto !important;
    }
  }
  .view-viewer {
    display: grid;
    grid-template-rows: [toolbar-row] max-content [content-row] minmax(0, 1fr);
    flex: 1 1 0%;
    inline-size: 100%;
    block-size: 100%;
    min-inline-size: 0;
    min-block-size: 0;
    color: var(--view-fg, var(--color-on-surface, light-dark(#1a1a1a, #e5e7eb)));
    background: var(--view-bg, var(--color-container, light-dark(#f4f6fa, #060d17)));
    color: contrast-color(var(--view-bg, var(--color-surface, light-dark(#f4f6fa, #060d17))));
  }
  .view-viewer__content {
    grid-row: content-row;
    position: relative;
    min-inline-size: 0;
    min-block-size: 0;
    overflow: auto;
    padding: 0;
  }
}`})))()}var O,k,A,j,M,N,P,F,I,L,R,he,ge,z,B,V,H,U,_e,W;function G(){return(G=e((()=>{c(),T(),h(),x(),re(),r(),m(),a(),le(),S(),D(),u(),O={SHARE_TARGET:p.SHARE_TARGET,TOAST:p.TOAST,CLIPBOARD:p.CLIPBOARD,MINIMAL_APP:p.MINIMAL_APP,MAIN_APP:p.MAIN_APP,FILE_EXPLORER:p.FILE_EXPLORER,PRINT_VIEWER:p.PRINT_VIEWER},k={get:(e,t=``)=>{try{return localStorage.getItem(e)||t}catch{return t}},set:(e,t)=>{try{localStorage.setItem(e,t)}catch{}}},A=async(e,t,n={componentName:e})=>{try{return await s(e,t,n)}catch(t){throw console.error(`Failed to load ${e}:`,t),t}},j=!1,M=`rs-history`,N=`rs-last-src`,P=`# CWSP-shell (Basic)

Open a markdown file or paste content here.
`,F=/\.(?:md|markdown|mdown|mkd|mkdn|mdtxt|mdtext)(?:$|[?#])/i,I={"#viewer":`markdown-viewer`,"#editor":`markdown-editor`,"#workcenter":`workcenter`,"#settings":`settings`,"#history":`history`,"#explorer":`file-explorer`,"#rich-editor":`rich-editor`,"#share-target-text":`workcenter`,"#share-target-files":`workcenter`,"#share-target-url":`workcenter`,"#share-target-image":`workcenter`},L={"markdown-viewer":`#viewer`,"markdown-editor":`#editor`,workcenter:`#workcenter`,settings:`#settings`,history:`#history`,"file-explorer":`#explorer`,"rich-editor":`#rich-editor`},R={viewer:`markdown-viewer`,editor:`markdown-editor`,"rich-editor":`rich-editor`,workcenter:`workcenter`,settings:`settings`,history:`history`,explorer:`file-explorer`},he=()=>{if(typeof window>`u`)return null;let e=(globalThis?.location?.pathname||``).replace(/^\/+|\/+$/g,``).toLowerCase();return e&&R[e]||null},ge=()=>k.get(N),z=e=>k.set(N,e),B=()=>{try{return typeof chrome<`u`&&!!chrome?.runtime?.id&&globalThis?.location?.protocol===`chrome-extension:`}catch{return!1}},V=()=>{if(typeof window>`u`)return null;let e=globalThis?.location?.hash;return I[e]||null},H=e=>{if(typeof window>`u`)return;let t=L[e];t&&globalThis?.history?.replaceState?.(null,``,t)},U=(e,t)=>{let n=typeof window<`u`&&globalThis?.matchMedia?.(`(prefers-color-scheme: dark)`)?.matches,r=t===`dark`?`dark`:t===`light`?`light`:n?`dark`:`light`;e.dataset.theme=r;try{e.style.colorScheme=r}catch{}},_e=async e=>{let t=e.trim();if(!t)return null;try{let e=new URL(t);if(!F.test(e.pathname))return null;let n=await fetch(e.href,{credentials:`include`,cache:`no-store`});return n.ok?await n.text():null}catch{return null}},W=(e,r={})=>{n(E);let a=o`<div class="app-shell" />`;e.replaceChildren(a);try{let e=fe();C(),console.log(`[Icons] Initialized stylesheet:`,e)}catch(e){console.error(`[Icons] Failed to initialize stylesheet:`,e)}typeof window<`u`&&typeof window<`u`&&(globalThis.clearIconCaches=()=>{w(),me().catch(console.error),console.log(`[Debug] Icon caches cleared`)},globalThis.invalidateIconCache=w,globalThis.testIconRacing=pe,globalThis.reinitializeIconRegistry=C,globalThis.debugIconSystem=de);let c=B(),u=l({onFilesAdded:e=>{for(let t of e){let e=t.type?.startsWith(`text/`)?`text`:t.type?.startsWith(`image/`)?`image`:t.name?.toLowerCase().endsWith(`.md`)?`markdown`:`file`,n=T.view===`workcenter`?`drag-drop`:(T.view,`file-open`);y({content:{file:t,filename:t.name,type:t.type},contentType:e,context:n,source:`manual`,metadata:{title:`File: ${t.name}`,filename:t.name,mimeType:t.type}}).then(()=>{D(`Processed ${t.name}`)}).catch(e=>{console.warn(`[Main] Failed to process file ${t.name}:`,e),D(`Failed to process ${t.name}`)})}},onError:e=>{D(`File error: ${e}`)}}),p=t(),m=globalThis?.localStorage?.getItem?.(`rs-markdown`)||r.initialMarkdown,h=he(),re=r.initialView||h||(m?`markdown-viewer`:`file-picker`),x=e=>{let t=String(e?.type||``).trim().toLowerCase();return t===`content-attach`||t===`file-attach`},S=async(e,t,n,r,i,a=!1)=>{if(j){console.log(`[Shell] Work center attachment already in progress, ignoring duplicate request`);return}j=!0;try{t.view!==`workcenter`&&(t.view=`workcenter`,n(`workcenter`));let o=[];try{if(e.data.file instanceof File)o.push(e.data.file);else if(Array.isArray(e.data.files)){let t=e.data.files.filter(e=>e instanceof File);t.length>0&&o.push(...t)}else if(e.data.blob instanceof Blob){let t=e.data.filename||`attachment-${Date.now()}.${e.contentType===`markdown`?`md`:`txt`}`;o.push(new File([e.data.blob],t,{type:e.data.blob.type}))}else if(e.data.text||e.data.content){let t=e.data.text||e.data.content,n=typeof t==`string`?t:JSON.stringify(t,null,2),r=e.data.filename||`content-${Date.now()}.${e.contentType===`markdown`?`md`:`txt`}`,i=e.contentType===`markdown`?`text/markdown`:`text/plain`;o.push(new File([n],r,{type:i})),console.log(`[Shell] Created file for attachment:`,{filename:r,mimeType:i,size:n.length})}}catch(e){console.warn(`[Shell] Failed to create file from message data:`,e),i(`Failed to process content`);return}if(o.length===0){console.warn(`[Shell] No valid file content found in message`);return}a||r();for(let e of o)await le(e,t,i)}finally{j=!1}},le=async(e,t,n)=>{try{if(t.managers.workCenter.instance){t.managers.workCenter.instance.getState().files.push(e),t.managers.workCenter.instance.ui.updateFileList(t.managers.workCenter.instance.getState()),t.managers.workCenter.instance.ui.updateFileCounter(t.managers.workCenter.instance.getState()),n(`Attached ${e.name} to Work Center`);return}let r=0;for(;!t.managers.workCenter.instance&&r<50;)await new Promise(e=>setTimeout(e,100)),r++;if(t.managers.workCenter.instance)t.managers.workCenter.instance.getState().files.push(e),t.managers.workCenter.instance.ui.updateFileList(t.managers.workCenter.instance.getState()),t.managers.workCenter.instance.ui.updateFileCounter(t.managers.workCenter.instance.getState()),n(`Attached ${e.name} to Work Center`);else throw Error(`Work center failed to load`)}catch(e){console.warn(`[Shell] Failed to attach content to workcenter:`,e),n(`Failed to attach content`)}},T={view:re,markdown:typeof r.initialMarkdown==`string`?r.initialMarkdown:localStorage.getItem(`rs-markdown`)??P,editing:!1,busy:!1,message:``,history:[],lastSavedTheme:`auto`,services:{fileHandler:u,templateManager:p},managers:{workCenter:{instance:null,initialized:!1},history:{instance:null}},components:{settings:{view:null},markdown:{viewer:null,editor:null},quill:{editor:null},explorer:{element:null}}},D=(e,t=3e3)=>{T.message=e,setTimeout(()=>{T.message===e&&J()},0),setTimeout(()=>{T.message===e&&(T.message=``,J())},t)},k=async(e,t)=>{let n=e?.data&&typeof e.data==`object`?e.data:{},r=String(e?.type||``),i=r===`content-load`||r===`content-view`||r===`markdown-content`;if(!i)return!1;let a=ae(e,r);if(!a.ok)return console.warn(`[Shell] Markdown hydrator skipped:`,a.reason),!1;let o=e?.metadata&&typeof e.metadata==`object`?e.metadata:{},s=typeof o.source==`string`?o.source:``,c=typeof o.route==`string`?o.route:``,l=s.includes(`launch-queue`)||c.includes(`launch-queue`),u=e=>{let t=(e.name||``).toLowerCase(),n=(e.type||``).toLowerCase();return!n||n.startsWith(`text/`)||n.includes(`markdown`)||n.includes(`json`)||n.includes(`xml`)?!0:[`.md`,`.markdown`,`.mdown`,`.mkd`,`.mkdn`,`.txt`,`.html`,`.htm`].some(e=>t.endsWith(e))},d=typeof n.filename==`string`&&n.filename.trim().length>0?String(n.filename).trim():typeof n.hint?.filename==`string`?String(n.hint.filename).trim():void 0,f=n.file instanceof File?n.file:null,p=Array.isArray(n.files)?n.files.filter(e=>e instanceof File):[];if(p.length>0&&(f=oe(p,{hintFilename:d,isTextLike:u})??f),f){let e=ie(f);e.ok||(console.warn(`[Shell] Ingress file skipped:`,e.reason,f.name),f=null)}let m=l&&!!(f&&u(f));if(i&&f&&u(f)){try{let e=await f.text();if(t!==I)return!1;if(typeof e==`string`)return e.trim().length===0?!1:se(e)?(T.markdown=`> Received content does not look like UTF-8 text/markdown (binary or unsupported format).

`,!0):(T.markdown=e,!0)}catch{}if(l&&f)return T.markdown=`> Failed to read transferred file:\n> ${f.name}`,!0}let h=n.text??n.content;if(!m&&h!=null&&String(h).trim()){let e=typeof h==`string`?h:JSON.stringify(h,null,2);return se(e)?(T.markdown=`> Inline payload looks like binary data — try opening a \`.md\` file or copying as plain text.

`,!0):(T.markdown=e,!0)}return!1},N=new Map,F=(e,t)=>{let n=(N.get(e)??Promise.resolve()).then(()=>t()).catch(t=>console.warn(`[Shell] Minimal ingress failed:`,e,t));return N.set(e,n),n},I=0;if(v.registerHandler(`markdown-viewer`,{canHandle:e=>e.destination===`markdown-viewer`,handle:async e=>{let t=++I;await F(`markdown-surface`,async()=>{t===I&&(await b(),t===I&&await k(e,t)&&(T.view=`markdown-viewer`,L(),$()))})}}),v.registerHandler(`viewer`,{canHandle:e=>e.destination===`viewer`,handle:async e=>{let t=++I;await F(`markdown-surface`,async()=>{t===I&&(await b(),t===I&&await k(e,t)&&(T.view=`markdown-viewer`,H(`markdown-viewer`),L(),$(),D(`Content loaded in viewer`)))})}}),v.registerHandler(`workcenter`,{canHandle:e=>e.destination===`workcenter`,handle:async e=>{await F(`workcenter`,async()=>{await b();let t=T.managers?.workCenter?.instance;if(t){try{x(e)?await S(e,T,H,$,D,!0):t?.handleExternalMessage&&await t.handleExternalMessage(e)}catch(e){console.error(`[Shell] WorkCenter message handling failed:`,e)}return}try{ne(`workcenter`,e)}catch(e){console.warn(`[Shell] Failed to enqueue pending workcenter message:`,e)}T.view!==`workcenter`&&(T.view=`workcenter`,H(`workcenter`),$())})}}),v.registerHandler(`explorer`,{canHandle:e=>e.destination===`explorer`,handle:async e=>{await F(`explorer`,async()=>{await b(),T.view!==`file-explorer`&&(T.view=`file-explorer`,H(`file-explorer`),$()),await new Promise(t=>{setTimeout(async()=>{try{let t=e.data?.action||`save`,n=e.data?.path||e.data?.into||`/`;if(t===`save`&&(e.data?.file||e.data?.text||e.data?.content)){let t=null;if(e.data.file instanceof File)t=e.data.file;else if(e.data.blob instanceof Blob){let n=e.data.filename||`file-${Date.now()}`;t=new File([e.data.blob],n,{type:e.data.blob.type})}else if(e.data.text||e.data.content){let n=e.data.text||e.data.content,r=typeof n==`string`?n:JSON.stringify(n,null,2),i=e.data.filename||`content-${Date.now()}.txt`;t=new File([r],i,{type:`text/plain`})}t&&T.components.explorer.element&&(n&&n!==T.components.explorer.element.path&&(T.components.explorer.element.path=n),console.log(`[Shell] Saving file ${t.name} to Explorer at: ${n}`),T.message=`Saved ${t.name} to Explorer`,J(),setTimeout(()=>{T.message=``,J()},3e3))}else if(t===`view`&&e.data?.path)T.components.explorer.element&&n&&(T.components.explorer.element.path=n,console.log(`[Shell] Navigated Explorer to path: ${n}`),T.message=`Opened Explorer at ${n}`,J(),setTimeout(()=>{T.message=``,J()},2e3));else if(t===`place`&&e.data?.place&&e.data?.into){let t=e.data.into;T.components.explorer.element&&t&&(T.components.explorer.element.path=t,console.log(`[Shell] Navigated Explorer to place data at: ${t}`),T.message=`Explorer ready at ${t}`,J(),setTimeout(()=>{T.message=``,J()},3e3))}else t===`navigate`&&n&&T.components.explorer.element&&(T.components.explorer.element.path=n,T.message=`Explorer navigated to ${n}`,J(),setTimeout(()=>{T.message=``,J()},2e3))}catch(e){console.warn(`[Shell] Failed to handle explorer action:`,e),T.message=`Failed to perform Explorer action`,J(),setTimeout(()=>{T.message=``,J()},3e3)}finally{t()}},100)})})}}),v.registerHandler(`print`,{canHandle:e=>e.destination===`print`,handle:async e=>{await F(`print`,async()=>{if(await b(),e.data?.text||e.data?.content){let t=e.data.text||e.data.content,n=typeof t==`string`?t:JSON.stringify(t,null,2),r=globalThis?.open?.(``,`_blank`,`width=800,height=600`);r&&(r.document.write(`
                        <!DOCTYPE html>
                        <html>
                        <head>
                            <title>Print - CWSP-shell</title>
                            <style>
                                body { font-family: system-ui, -apple-system, sans-serif; margin: 2rem; line-height: 1.6; }
                                pre { white-space: pre-wrap; word-wrap: break-word; }
                                @media print { body { margin: 1rem; } }
                            </style>
                        </head>
                        <body>
                            <pre>${n.replace(/</g,`&lt;`).replace(/>/g,`&gt;`)}</pre>
                        </body>
                        </html>
                    `),r.document.close(),r.print())}})}}),typeof window<`u`){globalThis?.addEventListener?.(`hashchange`,()=>{let e=V();e&&e!==T.view&&(console.log(`[HashChange] Switching to view: ${e} from hash`),T.view=e,$())});let e=V();if(e){T.view=e;let t={"markdown-viewer":`viewer`,"markdown-editor":`markdown-editor`,"rich-editor":`rich-editor`,workcenter:`workcenter`,"file-explorer":`explorer`}[e];t&&ee(t)&&console.log(`[Main] Found pending messages for initial view ${e}`)}}if(Array.isArray(r.initialFiles)&&r.initialFiles.length>0){console.log(`[Main] Processing ${r.initialFiles.length} initial files`);for(let e of r.initialFiles){let t=e.type?.startsWith(`text/`)?`text`:e.type?.startsWith(`image/`)?`image`:e.name?.toLowerCase().endsWith(`.md`)?`markdown`:`file`;y({content:{file:e,filename:e.name,type:e.type},contentType:t,context:`launch-queue`,source:`launch-queue`,metadata:{title:`Launch Queue: ${e.name}`,filename:e.name,mimeType:e.type}}).then(()=>{T.message=`Processed ${e.name}`,J()}).catch(t=>{console.warn(`[Main] Failed to process initial file ${e.name}:`,t)})}}ce().then(e=>{let t=e.map(e=>({...e.content&&typeof e.content==`object`?e.content:{},content:e.content,timestamp:e.content?.timestamp,cacheKey:e.key,swContext:e.context}));if(t.length>0){console.log(`[Main] Processing ${t.length} cached content items from SW`);for(let e of t)try{let t=`text`,n=`share-target`,r=e.content||{};r.files?.length>0?t=`file`:r.url&&(t=`url`),e.swContext&&(n=e.swContext),y({content:r,contentType:t,context:n,source:`service-worker`,metadata:{title:`SW Cached: ${e.swContext||`content`}`,fromSW:!0,cacheKey:e.cacheKey,timestamp:e.timestamp}}).then(()=>{T.message=`Processed cached content`,J(),setTimeout(()=>{T.message=``,J()},2e3)}).catch(e=>{console.warn(`[Main] Failed to process SW cached content:`,e)})}catch(e){console.warn(`[Main] Failed to process cached item:`,e)}}}).catch(e=>{console.warn(`[Main] Failed to retrieve SW cached content:`,e)});let L=()=>{try{T.markdown&&localStorage.setItem(`rs-markdown`,T.markdown)}catch{}},R=()=>{try{localStorage.setItem(M,JSON.stringify(T.history.slice(-50)))}catch{}},W=()=>{let e=T.view===`markdown-viewer`||T.view===`markdown-editor`,t=T.view===`markdown-editor`,n=T.view===`workcenter`;return o`<div class="toolbar">
      <div class="left">
        <button class="btn ${T.view===`markdown-viewer`?`active`:``}" data-action="view-markdown-viewer" type="button" title="Markdown Viewer">
          <ui-icon icon="eye" icon-style="duotone"></ui-icon>
          <span>Viewer</span>
        </button>
        <button class="btn ${T.view===`file-explorer`?`active`:``}" data-action="view-file-explorer" type="button" title="File Explorer">
          <ui-icon icon="folder" icon-style="duotone"></ui-icon>
          <span>Explorer</span>
        </button>
        <button class="btn ${T.view===`workcenter`?`active`:``}" data-action="view-workcenter" type="button" title="AI Work Center">
          <ui-icon icon="lightning" icon-style="duotone"></ui-icon>
          <span>Work Center</span>
          ${T.managers.workCenter.instance&&T.managers.workCenter.instance.getState().files.length>0?o`<span class="workcenter-badge" title="${T.managers.workCenter.instance.getState().files.length} files ready for processing">${T.managers.workCenter.instance.getState().files.length}</span>`:``}
        </button>
        <button class="btn ${T.view===`settings`?`active`:``}" data-action="view-settings" type="button" title="Settings">
          <ui-icon icon="gear" icon-style="duotone"></ui-icon>
          <span>Settings</span>
        </button>
        <button class="btn ${T.view===`history`?`active`:``}" data-action="view-history" type="button" title="History">
          <ui-icon icon="clock-counter-clockwise" icon-style="duotone"></ui-icon>
          <span>History</span>
        </button>
      </div>
      <div class="right">
        ${t?o`<button class="btn btn-icon" data-action="open-md" type="button" title="Open Markdown File">
          <ui-icon icon="folder-open" size="18" icon-style="duotone"></ui-icon>
          <span class="btn-text">Open</span>
        </button>
        <button class="btn btn-icon" data-action="save-md" type="button" title="Save to File">
          <ui-icon icon="floppy-disk" size="18" icon-style="duotone"></ui-icon>
          <span class="btn-text">Save</span>
        </button>
        <button class="btn btn-icon" data-action="export-md" type="button" title="Export as Markdown">
          <ui-icon icon="download" size="18" icon-style="duotone"></ui-icon>
          <span class="btn-text">Export</span>
        </button>
        <button class="btn btn-icon" data-action="export-docx" type="button" title="Export as DOCX">
          <ui-icon icon="file-doc" size="18" icon-style="duotone"></ui-icon>
          <span class="btn-text">DOCX</span>
        </button>`:``}
        ${e?o`<button class="btn" data-action="voice" type="button" title="Voice Input">
          <ui-icon icon="microphone" icon-style="duotone"></ui-icon>
          <span>Voice</span>
        </button>`:``}
        ${n?o`<button class="btn" data-action="process-content" type="button" title="Process Content">
          <ui-icon icon="brain" icon-style="duotone"></ui-icon>
          <span>Process</span>
        </button>
        <button class="btn" data-action="save-to-explorer" type="button" title="Save Results to Explorer">
          <ui-icon icon="floppy-disk" icon-style="duotone"></ui-icon>
          <span>Save to Explorer</span>
        </button>`:``}
        ${c?o`<button class="btn" data-action="snip" type="button" title="Screen Capture">
          <ui-icon icon="camera" icon-style="duotone"></ui-icon>
          <span>Snip</span>
        </button>`:``}
      </div>
    </div>`},G=W(),ve=o`<div class="status" aria-live="polite"></div>`,K=o`<div class="content"></div>`;a.append(G,K);let q=o`<input class="file-input" type="file" accept=".md,text/markdown,text/plain" />`;q.style.display=`none`,a.append(q),T.services.fileHandler.setupCompleteFileHandling(a,o`<button style="display:none">File Select</button>`,void 0,`*`);let J=()=>{ve.textContent=T.message||(T.busy?`Working…`:``),a.toggleAttribute(`data-busy`,T.busy)},ye=async()=>{let e=o`<div class="component-loading">
      <div class="loading-spinner"></div>
      <span>Loading Markdown Viewer...</span>
    </div>`;K.append(e);try{let t=(await s(`markdown-viewer`,()=>d(()=>import(`./_cwsp-disabled-entry_view-viewer-eo9jCha0.js`),[],import.meta.url),{componentName:`MarkdownViewer`})).component.createMarkdownView({content:T.markdown||P,title:`Markdown Viewer`,onOpen:()=>{q.click()},onCopy:e=>{T.message=`Content copied to clipboard`,J(),setTimeout(()=>{T.message=``,J()},2e3)},onDownload:e=>{T.message=`Content downloaded as markdown file`,J(),setTimeout(()=>{T.message=``,J()},2e3)},onAttachToWorkCenter:async e=>{try{let t=te(`content-share`,`main-app`,`markdown`,{text:e,filename:`content-${Date.now()}.md`},[`explicit-workcenter`],`button-attach-workcenter`);t.metadata={title:`Content from Viewer`,timestamp:Date.now(),source:`markdown-viewer`},await v.sendMessage(t)}catch(e){e instanceof Error&&e.message.includes(`throttled`)?console.log(`[Main] Message creation throttled - ignoring duplicate action`):(console.error(`[Main] Failed to create attach message:`,e),D(`Failed to attach content - please wait a moment`))}},onPrint:async e=>{await v.sendMessage({id:crypto.randomUUID(),type:`content-print`,source:`viewer`,destination:`print`,contentType:`markdown`,data:{text:e,filename:`print-${Date.now()}.md`},metadata:{title:`Print Content`,timestamp:Date.now(),source:`markdown-viewer`}})}}),n=t.render();u.setupDragAndDrop(n),u.setupPasteHandling(n),g(`markdown-viewer`,`viewer`);let r=_(`markdown-viewer`),i=!1;for(let e of r){let t=e;if(console.log(`[Viewer] Processing pending message:`,t),t.data?.text||t.data?.content){let e=t.data.text||t.data.content;T.markdown=typeof e==`string`?e:JSON.stringify(e,null,2),L(),i=!0}}return i&&(t?.updateContent?.(T.markdown),D(`Content loaded in viewer`)),e.replaceWith(n),n}catch(t){console.error(`Failed to load markdown viewer:`,t);let n=o`<div class="component-error">
        <h3>Failed to load Markdown Viewer</h3>
        <p>Please try refreshing the page.</p>
      </div>`;return e.replaceWith(n),n}},be=async()=>{let e=o`<div class="component-loading">
      <div class="loading-spinner"></div>
      <span>Loading Markdown Editor...</span>
    </div>`;K.append(e);try{let t=(await s(`markdown-editor`,()=>d(()=>import(`./MarkdownEditor-D0d5i-p9.js`),[],import.meta.url),{componentName:`MarkdownEditor`})).component.createMarkdownEditor({initialContent:T.markdown||``,onContentChange:e=>{T.markdown=e,L()},onSave:e=>{T.markdown=e,L(),T.message=`Content saved`,J(),setTimeout(()=>{T.message=``,J()},2e3)},placeholder:`Start writing your markdown here...`,autoSave:!0,autoSaveDelay:2e3}),n=t.render();g(`markdown-editor`,`markdown-editor`);let r=_(`markdown-editor`),i=!1;for(let e of r){let t=e;if(console.log(`[Editor] Processing pending message:`,t),t.data?.text||t.data?.content){let e=t.data.text||t.data.content;T.markdown=typeof e==`string`?e:JSON.stringify(e,null,2),L(),i=!0}}return i&&(t?.updateContent?.(T.markdown),D(`Content loaded in editor`)),e.replaceWith(n),n}catch(t){console.error(`Failed to load markdown editor:`,t);let n=o`<div class="component-error">
        <h3>Failed to load Markdown Editor</h3>
        <p>Please try refreshing the page.</p>
      </div>`;return e.replaceWith(n),n}},xe=async()=>{let e=o`<div class="component-loading">
      <div class="loading-spinner"></div>
      <span>Loading Rich Editor...</span>
    </div>`;K.append(e);try{let t=(await s(`quill-editor`,()=>d(()=>import(`./QuillEditor-B09J_Rri.js`),[],import.meta.url),{componentName:`QuillEditor`})).component.createQuillEditor({initialContent:T.markdown||``,onContentChange:e=>{T.markdown=e,L()},onSave:e=>{T.markdown=e,L(),T.message=`Content saved`,J(),setTimeout(()=>{T.message=``,J()},2e3)},placeholder:`Start writing your rich text here...`,autoSave:!0,autoSaveDelay:2e3}),n=t.render();g(`rich-editor`,`rich-editor`);let r=_(`rich-editor`),i=!1;for(let e of r){let t=e;if(console.log(`[RichEditor] Processing pending message:`,t),t.data?.text||t.data?.content){let e=t.data.text||t.data.content;T.markdown=typeof e==`string`?e:JSON.stringify(e,null,2),L(),i=!0}}return i&&(t?.updateContent?.(T.markdown),D(`Content loaded in rich editor`)),e.replaceWith(n),n}catch(t){console.error(`Failed to load rich editor:`,t);let n=o`<div class="component-error">
        <h3>Failed to load Rich Editor</h3>
        <p>Please try refreshing the page.</p>
      </div>`;return e.replaceWith(n),n}},Se=async()=>{let e=o`<div class="component-loading">
      <div class="loading-spinner"></div>
      <span>Loading History...</span>
    </div>`;K.append(e);try{let t=(await s(`history-manager`,()=>d(()=>import(`./src-DaqdrrCE.js`).then(e=>(e.t(),e.n)),[],import.meta.url),{componentName:`HistoryManager`})).component.createHistoryManager();T.history.length===0&&(T.history=t.getAllEntries());let n=t.createHistoryView(e=>{T.view===`workcenter`&&s(`workcenter`,()=>d(()=>import(`./WorkCenter-f_XVuUMu.js`).then(e=>e.WorkCenterManager),[],import.meta.url),{componentName:`WorkCenter`}).then(()=>{T.managers.workCenter.instance&&(T.managers.workCenter.instance.getState().currentPrompt=e.prompt)})});g(`history-view`,`history`);let r=_(`history-view`);for(let e of r)console.log(`[History] Processing pending message:`,e),e.type===`navigation`&&(T.view=`history`,setTimeout(()=>$(),0));return e.replaceWith(n),n}catch(t){console.error(`Failed to load history view:`,t);let n=o`<div class="component-error">
        <h3>Failed to load History View</h3>
        <p>Please try refreshing the page.</p>
      </div>`;return e.replaceWith(n),n}};if(typeof BroadcastChannel<`u`)try{new BroadcastChannel(O.SHARE_TARGET).addEventListener(`message`,e=>{let{type:t,data:n}=e.data||{};t===`share-received`&&n&&(T.history.push({ts:Date.now(),prompt:`Share Target`,before:n.title||n.text||n.url||`Shared content`,after:n.title||n.text||n.url||`Shared content`,ok:!0}),R())}),new BroadcastChannel(O.CLIPBOARD).addEventListener(`message`,e=>{let{type:t,data:n}=e.data||{};t===`copy`&&n&&(T.history.push({ts:Date.now(),prompt:`Clipboard Copy`,before:``,after:typeof n==`string`?n:JSON.stringify(n),ok:!0}),R())}),new BroadcastChannel(`app-shell`).addEventListener(`message`,e=>{let t=e.data;if(console.log(`[Shell] Received message:`,t),t.type===`content-view`){if(t.data?.text||t.data?.content){let e=t.data.text||t.data.content;T.markdown=typeof e==`string`?e:JSON.stringify(e,null,2),T.view=`markdown-viewer`,H(`markdown-viewer`),L(),$(),D(`Content loaded in viewer`)}}else t.type===`content-attach`?S(t,T,H,$,D):t.type===`navigation`&&(t.destination===`settings`?(T.view=`settings`,H(`settings`),$()):t.destination===`history`&&(T.view=`history`,H(`history`),$()))}),new BroadcastChannel(`main-app`).addEventListener(`message`,e=>{let t=e.data;console.log(`[MainApp] Received message:`,t),t.type===`navigation`&&(t.destination===`settings`?(T.view=`settings`,H(`settings`),$()):t.destination===`history`&&(T.view=`history`,H(`history`),$()))}),new BroadcastChannel(f(`explorer`)||`file-explorer`).addEventListener(`message`,e=>{let t=e.data;console.log(`[FileExplorer] Received message:`,t),t.type===`content-explorer`&&(T.view!==`file-explorer`&&(T.view=`file-explorer`,H(`file-explorer`),$()),setTimeout(async()=>{try{let e=t.data?.action||`save`,n=t.data?.path||t.data?.into||`/`;if(e===`save`&&(t.data?.file||t.data?.text||t.data?.content)){let e=null;if(t.data.file instanceof File)e=t.data.file;else if(t.data.blob instanceof Blob){let n=t.data.filename||`file-${Date.now()}`;e=new File([t.data.blob],n,{type:t.data.blob.type})}else if(t.data.text||t.data.content){let n=t.data.text||t.data.content,r=typeof n==`string`?n:JSON.stringify(n,null,2),i=t.data.filename||`content-${Date.now()}.txt`;e=new File([r],i,{type:`text/plain`})}e&&T.components.explorer.element&&(n&&n!==T.components.explorer.element.path&&(T.components.explorer.element.path=n),D(`Saved ${e.name} to Explorer`))}else e===`view`&&t.data?.path&&T.components.explorer.element&&n&&(T.components.explorer.element.path=n,D(`Opened Explorer at ${n}`))}catch(e){console.warn(`[FileExplorer] Failed to handle message:`,e),D(`Failed to perform Explorer action`)}},100))}),new BroadcastChannel(f(`print`)||`print-viewer`).addEventListener(`message`,e=>{let t=e.data;if(console.log(`[PrintViewer] Received message:`,t),t.type===`content-print`&&(t.data?.text||t.data?.content)){let e=t.data.text||t.data.content,n=typeof e==`string`?e:JSON.stringify(e,null,2),r=globalThis?.open?.(``,`_blank`,`width=800,height=600`);r&&(r.document.write(`
                                <!DOCTYPE html>
                                <html>
                                <head>
                                    <title>Print - CWSP-shell</title>
                                    <style>
                                        body { font-family: system-ui, -apple-system, sans-serif; margin: 2rem; line-height: 1.6; }
                                        pre { white-space: pre-wrap; word-wrap: break-word; }
                                        @media print { body { margin: 1rem; } }
                                    </style>
                                </head>
                                <body>
                                    <pre>${n.replace(/</g,`&lt;`).replace(/>/g,`&gt;`)}</pre>
                                </body>
                                </html>
                            `),r.document.close(),r.print())}})}catch(e){console.error(`[Broadcast] Failed to initialize broadcast listeners:`,e)}let Y=()=>{let e=new Blob([T.markdown||``],{type:`text/markdown;charset=utf-8`}),t=URL.createObjectURL(e),n=document.createElement(`a`);n.href=t,n.download=`crossword-${Date.now()}.md`,n.rel=`noopener`,n.click(),setTimeout(()=>URL.revokeObjectURL(t),250)},Ce=async()=>{let e=T.markdown;if(e?.trim())try{if(`showSaveFilePicker`in globalThis){let t=await(await globalThis?.showSaveFilePicker?.({suggestedName:`document.md`,types:[{description:`Markdown Files`,accept:{"text/markdown":[`.md`]}}]})).createWritable();await t.write(e),await t.close(),T.message=`File saved successfully!`,J(),setTimeout(()=>{T.message=``,J()},3e3)}else Y()}catch(e){console.error(`Failed to save file:`,e),e.name!==`AbortError`&&Y()}},X=async(e,t)=>{if(!e.trim())return;T.busy=!0,T.message=t?`Processing…`:`Generating markdown…`,J();let n=T.markdown||``,r=[{role:`user`,content:`Prompt:\n${e}\n\nCurrent markdown:\n${n}`}];try{let i=t?await t(r,{useActiveInstruction:!0}):await(await d(async()=>{let{recognizeByInstructions:e}=await import(`./unified-D17TnO_K.js`).then(e=>(e.t(),e.r));return{recognizeByInstructions:e}},[],import.meta.url)).recognizeByInstructions(r,`Generate a NEW markdown document.
Requirements:
- Output ONLY markdown.
- Use the prompt and the current markdown as context.
- Keep it concise, structured with headings and lists.
- If you need to keep prior content, integrate it rather than repeating verbatim.
`),a=i?.ok&&i?.data?String(i.data):``;T.history.push({ts:Date.now(),prompt:e,before:n,after:a||n,ok:!!(i?.ok&&a),error:i?.ok?void 0:i?.error||`Failed`}),R(),a?(T.markdown=a,L(),z(``),T.message=`Done.`):T.message=i?.error||`No output.`}catch(t){T.history.push({ts:Date.now(),prompt:e,before:n,after:n,ok:!1,error:String(t)}),R(),T.message=String(t)}finally{T.busy=!1,J(),$(),setTimeout(()=>{T.message===`Done.`&&(T.message=``,J())},1200)}},Z=!1,Q=!1,$=async()=>{if(Z){Q=!0;return}Z=!0,Q=!1;try{let e=W();G.replaceWith(e),G=e,we(),H(T.view),K.replaceChildren();let t=(e,t)=>{console.error(`Failed to load ${e}:`,t),K.innerHTML=`<div class="component-error"><h3>Failed to load ${e}</h3><p>Please try refreshing the page.</p></div>`,J()},n=e=>{K.append(e),J()},r={settings:async()=>{K.innerHTML=`<div class="component-loading"><div class="loading-spinner"></div><span>Loading Settings...</span></div>`;let e=(await A(`settings`,()=>d(()=>import(`./src-B9P3Wp-v.js`),[],import.meta.url),{componentName:`Settings`})).component.createSettingsView({isExtension:B(),onTheme:e=>U(a,e)});g(`settings-view`,`settings`);let t=_(`settings-view`);for(let e of t)console.log(`[Settings] Processing pending message:`,e),e.type===`navigation`&&(T.view=`settings`,setTimeout(()=>$(),0));return K.innerHTML=``,e},"file-explorer":async()=>{K.innerHTML=`<div class="component-loading"><div class="loading-spinner"></div><span>Loading File Explorer...</span></div>`,await A(`file-explorer`,()=>d(()=>import(`./_cwsp-disabled-entry_view-explorer-CUvWHUlh.js`),[],import.meta.url),{componentName:`FileManager`});let e=document.createElement(`ui-file-manager`);e.addEventListener(`open-item`,async t=>{let{item:n}=t.detail;n?.kind===`file`&&n?.file&&await v.sendMessage({id:crypto.randomUUID(),type:`content-share`,source:`explorer`,destination:`workcenter`,contentType:`file`,data:{file:n.file,filename:n.name,path:e.path},metadata:{title:n.name,timestamp:Date.now(),source:`file-explorer`}})}),e.addEventListener(`open`,async t=>{let{item:n}=t.detail;if(n?.kind===`file`&&n?.file){let t=u.isMarkdownFile(n.file),r=t?`viewer`:`workcenter`;await v.sendMessage({id:crypto.randomUUID(),type:`content-share`,source:`explorer`,destination:r,contentType:t?`markdown`:`file`,data:{file:n.file,filename:n.name,path:e.path},metadata:{title:n.name,timestamp:Date.now(),source:`file-explorer`}})}}),e.addEventListener(`context-action`,async t=>{let{action:n,item:r}=t.detail;if(n===`attach-workcenter`&&r?.kind===`file`&&r?.file)await v.sendMessage({id:crypto.randomUUID(),type:`content-share`,source:`explorer`,destination:`workcenter`,contentType:`file`,data:{file:r.file,filename:r.name,path:e.path},metadata:{title:`Attach ${r.name} to Work Center`,timestamp:Date.now(),source:`file-explorer`}});else if(n===`view`&&r?.kind===`file`&&r?.file){let t=u.isMarkdownFile(r.file),n=t?`viewer`:`workcenter`;await v.sendMessage({id:crypto.randomUUID(),type:`content-share`,source:`explorer`,destination:n,contentType:t?`markdown`:`file`,data:{file:r.file,filename:r.name,path:e.path},metadata:{title:`View ${r.name}`,timestamp:Date.now(),source:`file-explorer`}})}}),g(`file-explorer`,`explorer`),T.components.explorer.element=e;let t=_(`file-explorer`);for(let n of t){let t=n;if(console.log(`[Explorer] Processing pending message:`,t),t.type===`content-explorer`){let n=t.data?.action||`save`,r=t.data?.path||t.data?.into||`/`;setTimeout(async()=>{try{if(n===`save`&&(t.data?.file||t.data?.text||t.data?.content)){let n=null;if(t.data.file instanceof File)n=t.data.file;else if(t.data.blob instanceof Blob){let e=t.data.filename||`file-${Date.now()}`;n=new File([t.data.blob],e,{type:t.data.blob.type})}else if(t.data.text||t.data.content){let e=t.data.text||t.data.content,r=typeof e==`string`?e:JSON.stringify(e,null,2),i=t.data.filename||`content-${Date.now()}.txt`;n=new File([r],i,{type:`text/plain`})}n&&e&&(r&&r!==e.path&&(e.path=r),D(`Saved ${n.name} to Explorer`))}else n===`view`&&t.data?.path&&e&&r&&(e.path=r,D(`Opened Explorer at ${r}`))}catch(e){console.warn(`[Explorer] Failed to handle pending message:`,e),D(`Failed to perform Explorer action`)}},100)}}return K.innerHTML=``,e},history:()=>Se(),"markdown-viewer":()=>ye(),"markdown-editor":()=>be(),"rich-editor":()=>xe()}[T.view];if(r){try{let e=await r();e&&n(e)}catch(e){t(T.view.replace(`-`,` `).replace(/\b\w/g,e=>e.toUpperCase()),e)}return}if(T.view===`file-picker`){K.innerHTML=`
                <div class="file-picker">
                    <div class="file-picker-header">
                        <h2>Open File</h2>
                        <p>Select a file to open in the viewer or editor</p>
                    </div>
                    <div class="file-picker-actions">
                        <button class="btn btn-primary" data-action="open-markdown" type="button">
                            <ui-icon icon="file-text" size="18" icon-style="duotone"></ui-icon>
                            <span>Open Markdown</span>
                        </button>
                        <button class="btn" data-action="open-any" type="button">
                            <ui-icon icon="file" size="18" icon-style="duotone"></ui-icon>
                            <span>Open Any File</span>
                        </button>
                    </div>
                    <div class="file-picker-info">
                        <p><strong>Markdown files</strong> will open in the viewer/editor</p>
                        <p><strong>Other files</strong> will be processed by the work center</p>
                    </div>
                </div>
            `;let e=K.querySelector(`[data-action="open-markdown"]`),t=K.querySelector(`[data-action="open-any"]`);e&&e.addEventListener(`click`,()=>{q.accept=`.md,.markdown,.txt,text/markdown`,q.click()}),t&&t.addEventListener(`click`,()=>{q.accept=`*`,q.click()}),J();return}if(T.view===`workcenter`){K.innerHTML=`<div class="component-loading"><div class="loading-spinner"></div><span>Loading Work Center...</span></div>`,s(`workcenter`,()=>d(()=>import(`./WorkCenter-f_XVuUMu.js`).then(e=>e.WorkCenterManager),[],import.meta.url),{componentName:`WorkCenter`}).then(async e=>{if(T.managers.workCenter.instance||(T.managers.workCenter.instance=new e.component({state:T,history:T.history,onFilesChanged:()=>{W()},getSpeechPrompt:i,showMessage:e=>D(e),render:()=>$()})),!T.managers.workCenter.initialized){T.managers.workCenter.initialized=!0,g(`workcenter-manager`,`workcenter`);let e=_(`workcenter-manager`);for(let t of e){console.log(`[WorkCenter] Processing pending message:`,t);try{x(t)?await S(t,T,H,$,D,!0):T.managers.workCenter.instance?.handleExternalMessage?await T.managers.workCenter.instance.handleExternalMessage(t):await S(t,T,H,$,D,!0)}catch(e){console.warn(`[WorkCenter] Failed to replay pending message:`,e)}}}let t=T.managers.workCenter.instance.renderWorkCenterView();K.innerHTML=``,K.append(t),J()}).catch(e=>{console.error(`Failed to load work center:`,e),K.innerHTML=`<div class="component-error"><h3>Failed to load Work Center</h3><p>Please try refreshing the page.</p></div>`,J()});return}ye().then(e=>{K.append(e),J()}).catch(e=>{console.error(`Failed to load default markdown viewer:`,e),K.innerHTML=`<div class="component-error"><h3>Failed to load Markdown Viewer</h3><p>Please try refreshing the page.</p></div>`,J()})}finally{Z=!1,Q&&setTimeout(()=>$(),0)}},we=()=>{G.addEventListener(`click`,async e=>{let t=(e.target?.closest?.(`button[data-action]`))?.dataset?.action;if(!t)return;let n=null;if(t===`view-markdown-viewer`&&(n=`markdown-viewer`),t===`view-markdown-editor`&&(n=`markdown-editor`),t===`view-rich-editor`&&(n=`rich-editor`),t===`view-workcenter`&&(n=`workcenter`),t===`view-settings`&&(n=`settings`),t===`view-history`&&(n=`history`),t===`view-file-explorer`&&(n=`file-explorer`),n&&(T.view=n,H(n)),t===`open-md`&&q.click(),t===`save-md`&&Ce(),t===`export-md`&&Y(),t===`export-docx`){let e=T.markdown||``;if(e.trim()){let{downloadMarkdownAsDocx:t}=await d(async()=>{let{downloadMarkdownAsDocx:e}=await import(`./DocxExport-DDt-HL8o.js`);return{downloadMarkdownAsDocx:e}},[],import.meta.url);await t(e,{title:`CWSP-shell`,filename:`crossword-${Date.now()}.docx`})}}if(t===`toggle-edit`){if(T.view!==`markdown-viewer`&&T.view!==`markdown-editor`)return;T.editing=!T.editing}if(t===`snip`){if(!c)return;try{chrome.tabs.query({active:!0,lastFocusedWindow:!0,currentWindow:!0},e=>{let t=e?.[0]?.id;t!=null&&chrome.tabs.sendMessage(t,{type:`START_SNIP`})?.catch?.(()=>void 0);try{globalThis?.close?.()}catch{}})}catch{}}if(t===`process-content`&&T.managers.workCenter.instance&&await v.sendMessage({id:crypto.randomUUID(),type:`content-process`,source:`main-app`,destination:`workcenter`,data:{prompt:T.markdown||`Process this content`},metadata:{timestamp:Date.now(),correlationId:`main-${Date.now()}`}}),t===`save-to-explorer`&&T.managers.workCenter.instance){let e=T.managers.workCenter.instance.getState().results||[];if(e.length>0){let t=e[e.length-1];await v.sendMessage({id:crypto.randomUUID(),type:`content-save`,source:`main-app`,destination:`explorer`,data:{action:`save`,text:typeof t==`string`?t:JSON.stringify(t,null,2),filename:`workcenter-result-${Date.now()}.txt`,path:`/workcenter-results/`},metadata:{title:`Work Center Result`,timestamp:Date.now(),source:`workcenter`}})}else T.message=`No results to save`,J(),setTimeout(()=>{T.message=``,J()},2e3)}t===`solve`&&await X(`Solve equations and answer questions from the content above`,solveAndAnswer),t===`code`&&await X(`Generate code based on the description or requirements above`,writeCode),t===`css`&&await X(`Extract or generate CSS from the content or image above`,extractCSS),t===`voice`&&(async()=>{let e=await i();e&&await X(e)})(),$()})};we(),q.addEventListener(`change`,()=>{let e=q.files?.[0];e&&e.text().then(t=>{T.markdown=t||``,L(),z(``),T.view!==`markdown-viewer`&&(T.view=`markdown-viewer`,H(`markdown-viewer`)),T.message=`Loaded ${e.name}`,J(),$(),setTimeout(()=>{T.message=``,J()},3e3)}).catch(()=>void 0).finally(()=>{q.value=``})}),ue().then(e=>{T.lastSavedTheme=e?.appearance?.theme||`auto`,U(a,T.lastSavedTheme)}).catch(()=>U(a,`auto`));let Te=ge();Te&&_e(Te).then(e=>{e&&(T.markdown=e,L(),$())}),$()}})))()}G();export{W as mountShellApp};