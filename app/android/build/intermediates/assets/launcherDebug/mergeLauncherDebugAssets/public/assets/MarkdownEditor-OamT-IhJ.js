const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./DocxExport-CA2Ly5_f.js","./rolldown-runtime-Dd_uD5pT.js","./marked.esm-CXgXpO0c.js","./src-B6nYdbRq.js","./katex-2bhCeX8m.js","./auto-render-CjAFB_Rp.js"])))=>i.map(i=>d[i]);
import{t as e}from"./preload-helper-HclGiUj8.js";import{C as t}from"./lure-BrM1MaxP.js";import{t as n}from"./needs-to-API-Cqdxdtbv.js";var r=class r{options;container=null;editor=null;preview=null;autoSaveTimeout=null;previewStatsDebounce=null;static PREVIEW_STATS_DEBOUNCE_MS=160;constructor(e={}){this.options={initialContent:``,placeholder:`Start writing your markdown here...`,autoSave:!0,autoSaveDelay:1e3,...e}}render(){return this.container=t`<div class="markdown-editor-container">
      <div class="editor-header">
        <h3>Markdown Editor</h3>
        <div class="editor-actions">
          <button class="btn" data-action="clear">Clear</button>
          <button class="btn primary" data-action="save">Save</button>
        </div>
      </div>

      <div class="editor-layout">
        <div class="editor-panel">
          <div class="editor-toolbar">
            <div class="toolbar-group">
              <button class="btn small" data-action="bold" title="Bold">**bold**</button>
              <button class="btn small" data-action="italic" title="Italic">*italic*</button>
              <button class="btn small" data-action="code" title="Code">\`code\`</button>
            </div>
            <div class="toolbar-group">
              <button class="btn small" data-action="link" title="Link">[link](url)</button>
              <button class="btn small" data-action="image" title="Image">![alt](url)</button>
              <button class="btn small" data-action="list" title="List">- item</button>
            </div>
            <div class="toolbar-group">
              <button class="btn small" data-action="heading" title="Heading"># Heading</button>
              <button class="btn small" data-action="quote" title="Quote">> quote</button>
              <button class="btn small" data-action="codeblock" title="Code Block">\`\`\`</button>
            </div>
          </div>

          <textarea
            class="markdown-textarea"
            placeholder="${this.options.placeholder}"
            spellcheck="false"
          >${this.options.initialContent}</textarea>

          <div class="editor-footer">
            <div class="editor-stats">
              <span class="char-count">0 characters</span>
              <span class="word-count">0 words</span>
              <span class="line-count">0 lines</span>
            </div>
            <div class="editor-actions">
              <button class="btn small" data-action="print" title="Print content">
                <ui-icon icon="printer" size="16" icon-style="duotone"></ui-icon>
                Print
              </button>
              <button class="btn small" data-action="export-docx" title="Export as DOCX">
                <ui-icon icon="file-doc" size="16" icon-style="duotone"></ui-icon>
                DOCX
              </button>
            </div>
            <div class="editor-mode">
              <button class="btn small active" data-mode="edit">Edit</button>
              <button class="btn small" data-mode="preview">Preview</button>
              <button class="btn small" data-mode="split">Split</button>
            </div>
          </div>
        </div>

        <div class="preview-panel">
          <div class="preview-header">
            <h4>Live Preview</h4>
          </div>
          <div class="preview-content"></div>
        </div>
      </div>
    </div>`,this.initializeEditor(this.container),this.container}getContent(){return this.editor?.value||``}printContent(){if(!this.getContent().trim()){console.warn(`[MarkdownEditor] No content to print`);return}try{let e=this.container?.querySelector(`.markdown-viewer-content`);if(!e){console.error(`[MarkdownEditor] Could not find preview content for printing`);return}let t=new URL(`/print`,globalThis?.location?.origin);if(t.searchParams.set(`content`,e.innerHTML),t.searchParams.set(`title`,`Markdown Editor Content`),!globalThis?.open(t.toString(),`_blank`,`width=800,height=600`)){console.warn(`[MarkdownEditor] Failed to open print window - popup blocked?`),this.printCurrentContent();return}console.log(`[MarkdownEditor] Print window opened successfully`)}catch(e){console.error(`[MarkdownEditor] Error printing content:`,e),this.printCurrentContent()}}async exportDocx(){let t=this.getContent();if(!t.trim())return;let{downloadMarkdownAsDocx:n}=await e(async()=>{let{downloadMarkdownAsDocx:e}=await import(`./DocxExport-CA2Ly5_f.js`);return{downloadMarkdownAsDocx:e}},__vite__mapDeps([0,1,2,3,4,5]),import.meta.url);await n(t,{title:`Markdown Editor Content`,filename:`markdown-editor-${new Date().toISOString().split(`T`)[0]}.docx`})}printCurrentContent(){let e=this.container?.querySelector(`.markdown-viewer-content`);e&&(e.setAttribute(`data-print`,`true`),globalThis?.print?.(),setTimeout(()=>{e.removeAttribute(`data-print`)},1e3))}setContent(e){this.editor&&(this.editor.value=e,this.previewStatsDebounce!==null&&(globalThis.clearTimeout(this.previewStatsDebounce),this.previewStatsDebounce=null),this.updatePreview(),this.updateStats())}focus(){this.editor?.focus()}clear(){this.setContent(``),this.options.onContentChange?.(``)}save(){let e=this.getContent();this.options.onSave?.(e)}initializeEditor(e){this.editor=e.querySelector(`.markdown-textarea`);let t=e.querySelector(`.preview-content`);this.preview=new n({initialContent:``});let r=this.preview.render();t.append(r),this.setupEventListeners(e),this.updatePreview(),this.updateStats()}setupEventListeners(e){this.editor&&(this.editor.addEventListener(`input`,()=>{this.handleContentChange()}),this.editor.addEventListener(`change`,()=>{this.handleContentChange()}),e.addEventListener(`click`,e=>{let t=(e.target?.closest?.(`[data-action]`))?.getAttribute(`data-action`);t&&(e.preventDefault(),this.handleToolbarAction(t))}),e.addEventListener(`click`,e=>{let t=e.target.getAttribute(`data-mode`);t&&this.switchMode(t)}))}handleContentChange(){let e=this.getContent();this.options.onContentChange?.(e),this.options.autoSave&&this.scheduleAutoSave(),this.schedulePreviewAndStatsUpdate()}schedulePreviewAndStatsUpdate(){this.previewStatsDebounce!==null&&globalThis.clearTimeout(this.previewStatsDebounce),this.previewStatsDebounce=globalThis.setTimeout(()=>{this.previewStatsDebounce=null,this.updatePreview(),this.updateStats()},r.PREVIEW_STATS_DEBOUNCE_MS)}handleToolbarAction(e){let t=this.editor;if(!t)return;let n=t.selectionStart,r=t.selectionEnd,i=t.value.substring(n,r),a=``;switch(e){case`bold`:a=i?`**${i}**`:`**bold text**`;break;case`italic`:a=i?`*${i}*`:`*italic text*`;break;case`code`:a=i?`\`${i}\``:"`code`";break;case`link`:a=i?`[${i}](url)`:`[link text](url)`;break;case`image`:a=i?`![${i}](image-url)`:`![alt text](image-url)`;break;case`list`:a=i?`- ${i}`:`- list item`;break;case`heading`:a=i?`# ${i}`:`# Heading`;break;case`quote`:a=i?`> ${i}`:`> quote`;break;case`codeblock`:a=i?`\`\`\`\n${i}\n\`\`\``:"```\ncode block\n```";break;case`clear`:this.clear();return;case`save`:this.save();return;case`print`:this.printContent();return;case`export-docx`:this.exportDocx();return}a&&this.insertText(a,n,r)}insertText(e,t,n){let r=this.editor;if(!r)return;let i=t??r.selectionStart,a=n??r.selectionEnd;r.setRangeText(e,i,a,`end`),r.focus(),r.dispatchEvent(new Event(`input`,{bubbles:!0}))}switchMode(e){let t=this.editor?.closest(`.markdown-editor-container`);if(!t)return;let n=t.querySelector(`.editor-panel`),r=t.querySelector(`.preview-panel`);switch(t.querySelectorAll(`[data-mode]`).forEach(e=>e.classList.remove(`active`)),t.querySelector(`[data-mode="${e}"]`)?.classList.add(`active`),e){case`edit`:n.style.display=`block`,r.style.display=`none`,this.editor?.focus();break;case`preview`:n.style.display=`none`,r.style.display=`block`;break;case`split`:n.style.display=`block`,r.style.display=`block`,this.editor?.focus()}}updatePreview(){this.preview&&this.editor&&this.preview.setContent(this.editor.value)}updateStats(){let e=this.editor?.closest(`.markdown-editor-container`);if(!e||!this.editor)return;let t=this.editor.value,n=t.length,r=t.trim()?t.trim().split(/\s+/).length:0,i=t.split(`
`).length,a=e.querySelector(`.char-count`),o=e.querySelector(`.word-count`),s=e.querySelector(`.line-count`);a&&(a.textContent=`${n} characters`),o&&(o.textContent=`${r} words`),s&&(s.textContent=`${i} lines`)}scheduleAutoSave(){this.autoSaveTimeout&&globalThis?.clearTimeout?.(this.autoSaveTimeout),this.autoSaveTimeout=globalThis?.setTimeout?.(()=>{this.save()},this.options.autoSaveDelay)}};function i(e){return new r(e)}export{r as MarkdownEditor,i as createMarkdownEditor};