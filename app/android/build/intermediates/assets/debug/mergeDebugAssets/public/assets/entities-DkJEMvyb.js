import{n as e}from"./rolldown-runtime-aKtaBQYM.js";import{C as t}from"./src-BaOZveKG.js";import{t as n}from"./core-B2-fF3QG.js";import{a as r}from"./Settings-DMV-jO-S.js";import{t as i}from"./Runtime-CLdCyDua.js";import{n as a,t as o}from"./AIResponseParser-OXIxm1Ug.js";var s={math:`input_text`,url:`input_image`,text:`input_text`,input_text:`input_text`,output_text:`input_text`,image_url:`input_image`,image:`input_image`,input_image:`input_image`,input_url:`input_image`,json:`input_text`,markdown:`input_text`,code:`input_text`,entity:`input_text`,structured:`input_text`,unknown:`input_text`,svg:`input_text`,xml:`input_text`},c=e=>{if(!e)return`input_text`;let t=e.toLowerCase();return t.includes(`image`)?`input_image`:t.includes(`json`)?`json`:t.includes(`javascript`)||t.includes(`typescript`)?`code`:t.includes(`markdown`)||t.includes(`md`)?`markdown`:t.includes(`url`)?`input_url`:t.includes(`text/html`)?`markdown`:(t.includes(`text/plain`),`input_text`)},l=e=>{if(!e||typeof e!=`string`)return`input_text`;let t=e.trim();if(t.startsWith(`{`)&&t.endsWith(`}`)||t.startsWith(`[`)&&t.endsWith(`]`))try{return JSON.parse(t),`json`}catch{}if(i(t))return`url`;if(t.includes(`<svg`)&&t.includes(`</svg>`))return`xml`;if(t.startsWith(`data:image/`)&&t.includes(`;base64,`)&&!t.includes(`
`)&&t.length<1e5)try{let e=new URL(t);if(e.protocol===`data:`&&e.pathname.startsWith(`image/`))return`input_image`}catch{}return/\$\$[\s\S]+\$\$|\$[^$]+\$|\\begin\{equation\}/.test(t)?`math`:/```[\s\S]+```|^(function|const|let|var|class|import|export)\s/m.test(t)?`code`:/^#{1,6}\s|^\*\*|^-\s|\[.+\]\(.+\)|^>\s/m.test(t)?`markdown`:`input_text`},u=e=>{let t=e?.context,n=s?.[e?.dataKind||`input_text`],r=d(t);switch(n){case`input_image`:return`${r}

Recognize data from image, also preferred to orient by fonts in image.

After recognition, do not include or remember image itself.

---

In (\`recognized_data\` key), can be written phone numbers, emails, URLs, dates, times, codes, etc. Additional formatting rules:

In recognized from image data (what you seen in image), do:
- If textual content, format as Markdown string (multiline).
- If phone number, format as as correct phone number (in normalized format).
  - Also, if phone numbers (for example starts with +7, format as 8), replace to correct regional code.
  - Remove brackets, parentheses, spaces or other symbols from phone number.
  - Trim spaces from phone number.
- If email, format as as correct email (in normalized format), and trim spaces from email.
- If URL, format as as correct URL (in normalized format), and unicode codes to human readable, and trim spaces from URL.
- If date, format as as correct date (in normalized format).
- If time, format as as correct time (in normalized format).
- If math (expression, equation, formula), format as $KaTeX$
- If table (or looks alike table), format as | table |
- If image, format as [$image$]($image$)
- If code, format as \`\`\`$code$\`\`\` (multiline) or \`$code$\` (single-line)
- If JSON, format as correct JSON string, and trim spaces from JSON string.
- If other, format as $text$.
- If seen alike list, format as list (in markdown format).

---

Some additional actions:
- Collect some special data tags and keywords (if has any).
- Also, can you provide in markdown pre-formatted free-form analyzed or recognized verbose data (in \`verbose_data\` key).

---

CRITICAL OUTPUT FORMAT: Return ONLY valid JSON. No markdown code blocks, no explanations, no prose.
Your response must start with { or [ and end with } or ].

Expected output structure:
{
    "keywords_and_tags": ["string array"],
    "recognized_data": ["any array"],
    "verbose_data": "markdown string",
    "using_ready": true,
    "confidence": 0.95,
    "suggested_type": "document_type"
}
`;case`input_text`:return`${r}

Analyze text and extract specific or special data from it, also normalize data by those rules...

---

In (\`recognized_data\` key), can be written phone numbers, emails, URLs, dates, times, codes, etc. Additional formatting rules:

Normalize phone numbers, emails, URLs, dates, times, codes, etc for best efforts and by those rules.
- If phone number, format as as correct phone number (in normalized format).
  - If phone numbers (for example starts with +7, format as 8), replace to correct regional code.
  - Trim spaces from phone numbers, emails, URLs, dates, times, codes, etc.
  - Remove brackets, parentheses, spaces or other symbols from phone numbers.
- If email, format as as correct email (in normalized format), and trim spaces from email.
- If URL, format as as correct URL (in normalized format), and unicode codes to human readable, and trim spaces from URL.
- If date, format as as correct date (in normalized format).
- If time, format as as correct time (in normalized format).
- If math, format as $KaTeX$
- If table, format as | table |
- If image, format as [$image$]($image$)
- If code, format as \`\`\`$code$\`\`\` (multiline) or \`$code$\` (single-line)
- If JSON, format as correct JSON string, and trim spaces from JSON string.
- If other, format as $text$.
- If seen alike list, format as list (in markdown format).

---

Some additional actions:
- Collect some special data tags and keywords (if has any).
- Also, can you provide in markdown pre-formatted free-form analyzed or recognized verbose data (in \`verbose_data\` key).
- Detect entity type if applicable (task, event, person, place, service, item, etc.)

---

CRITICAL OUTPUT FORMAT: Return ONLY valid JSON. No markdown code blocks, no explanations, no prose.
Your response must start with { or [ and end with } or ].

Expected output structure:
{
    "keywords_and_tags": ["string array"],
    "recognized_data": ["any array"],
    "verbose_data": "markdown string",
    "using_ready": true,
    "confidence": 0.95,
    "suggested_type": "entity_type",
    "suggested_modifications": []
}
`}return r||``},d=e=>{if(!e)return``;let t=[];if(e.operation&&t.push(`Operation: ${{create:`Create new data entries based on provided information.`,modify:`Modify existing data with provided changes while preserving structure.`,merge:`Intelligently merge new data with existing data, avoiding duplicates.`,analyze:`Analyze and extract structured information from the data.`,extract:`Extract specific data points matching the criteria.`}[e.operation]||e.operation}`),e.entityType&&t.push(`Target entity type: ${e.entityType}`),e.existingData&&t.push(`Existing data context provided - consider for merge/update operations.`),e.filters?.length){let n=e.filters.map(e=>`${e.field} ${e.operator} ${JSON.stringify(e.value)}`).join(`, `);t.push(`Apply filters: ${n}`)}return e.searchTerms?.length&&t.push(`Search terms: ${e.searchTerms.join(`, `)}`),e.priority&&t.push(`Priority level: ${e.priority}`),t.length?`Context:\n${t.join(`
`)}\n\n---\n`:``},f=e=>{if(!e?.length)return``;let t=e.map((e,t)=>{let n=e.conditions?.length?` when ${e.conditions.map(e=>`${e.field} ${e.operator} ${JSON.stringify(e.value)}`).join(` AND `)}`:``;switch(e.action){case`update`:return`${t+1}. UPDATE field "${e.target}" to ${JSON.stringify(e.value)}${n}`;case`delete`:return`${t+1}. DELETE field "${e.target}"${n}`;case`merge`:return`${t+1}. MERGE into "${e.target}" with ${JSON.stringify(e.value)}${n}`;case`append`:return`${t+1}. APPEND ${JSON.stringify(e.value)} to "${e.target}"${n}`;case`replace`:return`${t+1}. REPLACE "${e.target}" with ${JSON.stringify(e.value)}${n}`;case`transform`:return`${t+1}. TRANSFORM "${e.target}" using: ${e.transformFn}${n}`;default:return``}}).filter(Boolean);return t.length?`\nModification instructions:\n${t.join(`
`)}\n`:``},p=`
You are a data modification assistant. Your task is to modify existing data based on the provided instructions.

Rules for modification:
1. Preserve the original data structure unless explicitly asked to change it.
2. Apply modifications in order, one by one.
3. Validate data types match the schema.
4. Return the complete modified entity, not just the changes.
5. If a modification cannot be applied, include it in the "errors" array with explanation.

CRITICAL: Output ONLY valid JSON. No markdown code blocks, no explanations, no prose.
Your response must start with { and end with }.

Expected output structure:
{
    "modified_entity": { /* complete modified entity */ },
    "changes_made": [ /* list of applied changes */ ],
    "errors": [ /* list of failed modifications with reasons */ ],
    "warnings": [ /* non-critical issues */ ]
}
`,m=`
You are a data selection and filtering assistant. Your task is to find and select data matching the criteria.

Selection rules:
1. Apply all filters in order (AND logic by default).
2. Rank results by relevance to search terms.
3. Include confidence scores for fuzzy matches.
4. Group similar results to avoid duplicates.

CRITICAL: Output ONLY valid JSON. No markdown code blocks, no explanations, no prose.
Your response must start with { and end with }.

Expected output structure:
{
    "selected_items": [ /* items matching criteria */ ],
    "total_matches": number,
    "filter_stats": { /* breakdown by filter */ },
    "suggestions": [ /* related items that might be relevant */ ]
}
`,h=`
You are an entity merging assistant. Your task is to intelligently merge multiple entities or data sources.

Merge rules:
1. Prefer newer/more complete data when conflicts arise.
2. Combine arrays without duplicates.
3. Merge nested objects recursively.
4. Preserve IDs and relationships.
5. Track the source of each merged field.

CRITICAL: Output ONLY valid JSON. No markdown code blocks, no explanations, no prose.
Your response must start with { and end with }.

Expected output structure:
{
    "merged_entity": { /* result of merge */ },
    "conflicts_resolved": [ /* list of conflicts and how they were resolved */ ],
    "sources_used": [ /* which source contributed what */ ],
    "merge_confidence": number
}
`,ee=`null`,g={comma:`,`,tab:`	`,pipe:`|`}.comma;function _(e){return e.replace(/\\/g,`\\\\`).replace(/"/g,`\\"`).replace(/\n/g,`\\n`).replace(/\r/g,`\\r`).replace(/\t/g,`\\t`).replace(/[\u0000-\u001F]/g,e=>`\\u${e.charCodeAt(0).toString(16).padStart(4,`0`)}`)}function te(e){return e===`true`||e===`false`||e===`null`}function v(e){if(e===null)return null;if(typeof e==`object`&&e&&`toJSON`in e&&typeof e.toJSON==`function`){let t=e.toJSON();if(t!==e)return v(t)}if(typeof e==`string`||typeof e==`boolean`)return e;if(typeof e==`number`)return Object.is(e,-0)?0:Number.isFinite(e)?e:null;if(typeof e==`bigint`)return e>=-(2**53-1)&&e<=2**53-1?Number(e):e.toString();if(e instanceof Date)return e.toISOString();if(Array.isArray(e))return e.map(v);if(e instanceof Set)return Array.from(e).map(v);if(e instanceof Map)return Object.fromEntries(Array.from(e,([e,t])=>[String(e),v(t)]));if(ne(e)){let t={};for(let n in e)Object.hasOwn(e,n)&&(t[n]=v(e[n]));return t}return null}function y(e){return e===null||typeof e==`string`||typeof e==`number`||typeof e==`boolean`}function b(e){return Array.isArray(e)}function x(e){return typeof e==`object`&&!!e&&!Array.isArray(e)}function S(e){return Object.keys(e).length===0}function ne(e){if(typeof e!=`object`||!e)return!1;let t=Object.getPrototypeOf(e);return t===null||t===Object.prototype}function C(e){return e.length===0||e.every(e=>y(e))}function w(e){return e.length===0||e.every(e=>b(e))}function T(e){return e.length===0||e.every(e=>x(e))}var re=/^-?\d+(?:\.\d+)?(?:e[+-]?\d+)?$/i,E=/^0\d+$/;function D(e){return/^[A-Z_][\w.]*$/i.test(e)}function ie(e){return/^[A-Z_]\w*$/i.test(e)}function ae(e,t=g){return!(!e||e!==e.trim()||te(e)||O(e)||e.includes(`:`)||e.includes(`"`)||e.includes(`\\`)||/[[\]{}]/.test(e)||/[\u0000-\u001F]/.test(e)||e.includes(t)||e.startsWith(`-`))}function O(e){return re.test(e)||E.test(e)}function oe(e,t,n,r,i,a,o){if(r.keyFolding!==`safe`||!x(t))return;let{segments:s,tail:c,leafValue:l}=se(e,t,o??r.flattenDepth);if(s.length<2||!s.every(e=>ie(e)))return;let u=k(s),d=a?`${a}.${u}`:u;if(!n.includes(u)&&!(i&&i.has(d)))return{foldedKey:u,remainder:c,leafValue:l,segmentCount:s.length}}function se(e,t,n){let r=[e],i=t;for(;r.length<n&&x(i);){let e=Object.keys(i);if(e.length!==1)break;let t=e[0],n=i[t];r.push(t),i=n}return!x(i)||S(i)?{segments:r,tail:void 0,leafValue:i}:{segments:r,tail:i,leafValue:i}}function k(e){return e.join(`.`)}function A(e,t){return e===null?ee:typeof e==`boolean`||typeof e==`number`?String(e):ce(e,t)}function ce(e,t=g){return ae(e,t)?e:`"${_(e)}"`}function j(e){return D(e)?e:`"${_(e)}"`}function M(e,t=g){return e.map(e=>A(e,t)).join(t)}function N(e,t){let n=t?.key,r=t?.fields,i=t?.delimiter??`,`,a=``;if(n!=null&&(a+=j(n)),a+=`[${e}${i===g?``:i}]`,r){let e=r.map(e=>j(e));a+=`{${e.join(i)}}`}return a+=`:`,a}function*le(e,t,n){if(y(e)){let n=A(e,t.delimiter);n!==``&&(yield n);return}b(e)?yield*F(void 0,e,n,t):x(e)&&(yield*P(e,n,t))}function*P(e,t,n,r,i,a){let o=Object.keys(e);t===0&&!r&&(r=new Set(o.filter(e=>e.includes(`.`))));let s=a??n.flattenDepth;for(let[a,c]of Object.entries(e))yield*ue(a,c,t,n,o,r,i,s)}function*ue(e,t,n,r,i,a,o,s){let c=o?`${o}.${e}`:e,l=s??r.flattenDepth;if(r.keyFolding===`safe`&&i){let s=oe(e,t,i,r,a,o,l);if(s){let{foldedKey:e,remainder:t,leafValue:i,segmentCount:c}=s,u=j(e);if(t===void 0){if(y(i)){yield G(n,`${u}: ${A(i,r.delimiter)}`,r.indent);return}else if(b(i)){yield*F(e,i,n,r);return}else if(x(i)&&S(i)){yield G(n,`${u}:`,r.indent);return}}if(x(t)){yield G(n,`${u}:`,r.indent);let i=l-c,s=o?`${o}.${e}`:e;yield*P(t,n+1,r,a,s,i);return}}}let u=j(e);y(t)?yield G(n,`${u}: ${A(t,r.delimiter)}`,r.indent):b(t)?yield*F(e,t,n,r):x(t)&&(yield G(n,`${u}:`,r.indent),S(t)||(yield*P(t,n+1,r,a,c,l)))}function*F(e,t,n,r){if(t.length===0){yield G(n,e==null?`[]`:`${j(e)}: []`,r.indent);return}if(C(t)){yield G(n,L(t,r.delimiter,e),r.indent);return}if(w(t)&&t.every(e=>C(e))){yield*I(e,t,n,r);return}if(T(t)){let i=z(t);i?yield*R(e,t,i,n,r):yield*H(e,t,n,r);return}yield*H(e,t,n,r)}function*I(e,t,n,r){yield G(n,N(t.length,{key:e,delimiter:r.delimiter}),r.indent);for(let e of t)if(C(e)){let t=L(e,r.delimiter);yield K(n+1,t,r.indent)}}function L(e,t,n){let r=N(e.length,{key:n,delimiter:t}),i=M(e,t);return e.length===0?r:`${r} ${i}`}function*R(e,t,n,r,i){yield G(r,N(t.length,{key:e,fields:n,delimiter:i.delimiter}),i.indent),yield*V(t,n,r+1,i)}function z(e){if(e.length===0)return;let t=e[0],n=Object.keys(t);if(n.length!==0&&B(e,n))return n}function B(e,t){for(let n of e){if(Object.keys(n).length!==t.length)return!1;for(let e of t)if(!(e in n)||!y(n[e]))return!1}return!0}function*V(e,t,n,r){for(let i of e)yield G(n,M(t.map(e=>i[e]),r.delimiter),r.indent)}function*H(e,t,n,r){yield G(n,N(t.length,{key:e,delimiter:r.delimiter}),r.indent);for(let e of t)yield*W(e,n+1,r)}function*U(e,t,n){if(S(e)){yield G(t,`-`,n.indent);return}let r=Object.entries(e),[i,a]=r[0],o=r.slice(1);if(b(a)&&T(a)){let e=z(a);if(e){yield K(t,N(a.length,{key:i,fields:e,delimiter:n.delimiter}),n.indent),yield*V(a,e,t+2,n),o.length>0&&(yield*P(Object.fromEntries(o),t+1,n));return}}let s=j(i);if(y(a))yield K(t,`${s}: ${A(a,n.delimiter)}`,n.indent);else if(b(a))if(a.length===0)yield K(t,`${s}: []`,n.indent);else if(C(a))yield K(t,`${s}${L(a,n.delimiter)}`,n.indent);else{yield K(t,`${s}${N(a.length,{delimiter:n.delimiter})}`,n.indent);for(let e of a)yield*W(e,t+2,n)}else x(a)&&(yield K(t,`${s}:`,n.indent),S(a)||(yield*P(a,t+2,n)));o.length>0&&(yield*P(Object.fromEntries(o),t+1,n))}function*W(e,t,n){if(y(e))yield K(t,A(e,n.delimiter),n.indent);else if(b(e))if(C(e))yield K(t,L(e,n.delimiter),n.indent);else{yield K(t,N(e.length,{delimiter:n.delimiter}),n.indent);for(let r of e)yield*W(r,t+1,n)}else x(e)&&(yield*U(e,t,n))}function G(e,t,n){return` `.repeat(n*e)+t}function K(e,t,n){return G(e,`- `+t,n)}function de(e,t){let n=t(``,e,[]);return q(n===void 0?e:v(n),t,[])}function q(e,t,n){return x(e)?fe(e,t,n):b(e)?pe(e,t,n):e}function fe(e,t,n){let r={};for(let[i,a]of Object.entries(e)){let e=[...n,i],o=t(i,a,e);o!==void 0&&(r[i]=q(v(o),t,e))}return r}function pe(e,t,n){let r=[];for(let i=0;i<e.length;i++){let a=e[i],o=[...n,i],s=t(String(i),a,o);if(s===void 0)continue;let c=v(s);r.push(q(c,t,o))}return r}function J(e,t){return Array.from(me(e,t)).join(`
`)}function me(e,t){let n=v(e),r=he(t);return le(r.replacer?de(n,r.replacer):n,r,0)}function he(e){return{indent:e?.indent??2,delimiter:e?.delimiter??g,keyFolding:e?.keyFolding??`off`,flattenDepth:e?.flattenDepth??1/0,replacer:e?.replacer}}var ge=()=>globalThis.File!==void 0,_e=()=>globalThis.Blob!==void 0,ve={low:60*1e3,medium:300*1e3,high:900*1e3},Y=2e3,X=()=>globalThis.runtimeSettings?.ai||{},ye=(e,t)=>typeof e!=`number`||!Number.isFinite(e)||e<=0?t:e<1e3?e*1e3:e;function be(e){let t=X(),n=t?.requestTimeout,r=typeof t?.maxRetries==`number`?Math.max(0,Math.floor(t.maxRetries)):2;return{timeout:ye(n?.[e],ve[e]),maxRetries:r}}var Z=e=>{if(globalThis.Buffer!==void 0)return globalThis.Buffer.from(e).toString(`base64`);let t=1024*1024;if(e.length>t){let n=``;for(let r=0;r<e.length;r+=t){let i=e.slice(r,r+t),a=``;for(let e=0;e<i.length;e++)a+=String.fromCharCode(i[e]);n+=typeof btoa==`function`?btoa(a):``}return n}let n=``;for(let t=0;t<e.length;t++)n+=String.fromCharCode(e[t]);return typeof btoa==`function`?btoa(n):``},Q=async e=>{let t=ge()?globalThis.File:void 0,n=_e()?globalThis.Blob:void 0;if(n&&e?.dataSource instanceof n||t&&e?.dataSource instanceof t){let t=e?.dataSource?.size||0,n=10*1024*1024;if(t>n)return console.warn(`[GPT-Responses] File too large: ${t} bytes > ${n} bytes`),{type:`input_text`,text:`[File too large: ${(t/1024/1024).toFixed(1)}MB. Maximum allowed: ${(n/1024/1024).toFixed(1)}MB]`};if(s?.[e?.dataKind||`input_text`]===`input_image`||e?.dataSource?.type?.startsWith?.(`image/`))try{let t=`data:${e?.dataSource?.type};base64,`,n=await e?.dataSource?.arrayBuffer();if(!n)throw Error(`Failed to read file as ArrayBuffer`);return{type:`input_image`,detail:`auto`,image_url:t+Z(new Uint8Array(n))}}catch(e){return console.error(`[GPT-Responses] Failed to process image file:`,e),{type:`input_text`,text:`[Failed to process image file: ${e}]`}}try{let t=await e?.dataSource?.text?.();if(t)return{type:`input_text`,text:t}}catch(e){return console.error(`[GPT-Responses] Failed to read text file:`,e),{type:`input_text`,text:`[Failed to read text file: ${e}]`}}}else if(typeof e?.dataSource==`string`){let t=e?.dataKind||l(e.dataSource);if(s?.[t]==`input_image`){let t=e?.dataSource?.trim?.()||``;if(t.startsWith(`data:image/`)&&t.includes(`;base64,`))try{let e=new URL(t);if(e.protocol===`data:`&&e.pathname.startsWith(`image/`))return{type:`input_image`,image_url:t,detail:`auto`}}catch{}else if(i(t))return{type:`input_image`,image_url:t,detail:`auto`}}return{type:`input_text`,text:e?.dataSource}}let r=e?.dataSource;try{r=typeof e?.dataSource==`object`?J(e?.dataSource):e?.dataSource}catch(e){console.warn(e)}return{type:s?.[e?.dataKind||`input_text`]||`text`,text:r}},xe=class{apiKey;apiSecret;apiUrl=`https://api.proxyapi.ru/openai/v1`;model=`gpt-5.6-luna`;responseId=null;pending=[];messages=[];tools=new Map;context=null;responseMap=new Map;constructor(e,t,n,r){this.apiKey=e||``,this.apiUrl=t||this.apiUrl,this.apiSecret=n||``,this.model=r||this.model}setContext(e){return this.context=e,this}async useMCP(e,t,n,r){return this.tools.set(t?.trim?.(),{type:`mcp`,server_label:e,server_url:t,headers:{authorization:`Bearer ${n}:${r}`},require_approval:`never`}),this.tools.get(t?.trim?.())}async convertPlainToInput(e,t=null,n=null){t??=c(e?.type)||`input_text`;let r={dataSource:e,dataKind:t,context:this.context},i=await Q(r);return{type:`message`,role:`user`,content:[{type:`input_text`,text:`What to do: `+u(r)},n?{type:`text`,text:`Additional request data: `+n}:null,{type:`input_text`,text:`
 === BEGIN:ATTACHED_DATA === 
`},{...i},{type:`input_text`,text:`
 === END:ATTACHED_DATA === 
`}].filter?.(e=>e!==null)}}async attachToRequest(e,t=null,n=null){return this.pending.push(await this.convertPlainToInput(e,t??=c(e?.type)||`input_text`)),n&&this.pending.push(await this.askToDoAction(n)),this.pending[this.pending.length-1]}async attachExistingData(e,t){return this.context={...this.context,existingData:e,entityType:t||this.context?.entityType},await this.giveForRequest(`existing_data: \`${J(e)}\`\n`),this}async giveForRequest(e){if(typeof e!=`string`)try{let t=c(e?.type)||`input_text`,n=await Q({dataSource:e,dataKind:t,context:this.context});return this?.pending?.push?.({type:`message`,role:`user`,content:[{type:`input_text`,text:`Additional data for request:`},{type:`input_text`,text:`
 === BEGIN:ATTACHED_DATA === 
`},{...n},{type:`input_text`,text:`
 === END:ATTACHED_DATA === 
`}]}),this?.pending?.[this?.pending?.length-1]}catch{e=String(e)}return this?.pending?.push?.({type:`message`,role:`user`,content:[{type:`input_text`,text:`Additional data for request:`},{type:`input_text`,text:String(e)}]}),this?.pending?.[this?.pending?.length-1]}async askToDoAction(e){return this?.pending?.push?.({type:`message`,role:`user`,content:[{type:`input_text`,text:e}]}),this?.pending?.[this?.pending?.length-1]}beginFromResponseId(e=null){return this.responseId=this.responseId=e||this.responseId,this}async sendRequest(e=`low`,n=`low`,r=null,i={}){e??=`low`,n??=`low`;let a=new Map;for(let e of this.pending)if(e)try{let n=typeof e==`object`?t.stringify(e):String(e);a.has(n)||a.set(n,e)}catch{a.set(Math.random().toString(),e)}let s=Array.from(a.values()),c=i?.responseFormat===`json`?o:void 0,l=X(),u=typeof l?.maxOutputTokens==`number`&&Number.isFinite(l.maxOutputTokens)?Math.max(1,Math.floor(l.maxOutputTokens)):void 0,d={model:this.model,tools:Array.from(this?.tools?.values?.()||[])?.filter?.(e=>!!e),input:s,reasoning:{effort:e},text:{verbosity:n},max_output_tokens:i?.maxTokens||u||4e5,previous_response_id:this.responseId=r||this?.responseId,instructions:c};(l?.contextTruncation===`auto`||l?.contextTruncation===`disabled`)&&(d.truncation=l.contextTruncation),(l?.promptCacheRetention===`in-memory`||l?.promptCacheRetention===`24h`)&&(d.prompt_cache_retention=l.promptCacheRetention),typeof l?.maxToolCalls==`number`&&Number.isFinite(l.maxToolCalls)&&(d.max_tool_calls=Math.max(1,Math.floor(l.maxToolCalls))),typeof l?.parallelToolCalls==`boolean`&&(d.parallel_tool_calls=l.parallelToolCalls);let{timeout:f,maxRetries:p}=be(e);console.log(`[GPT] Making request to:`,`${this?.apiUrl}/responses`),console.log(`[GPT] API key present:`,!!this?.apiKey),console.log(`[GPT] Request timeout:`,`${f}ms (${f/1e3}s) (${e} effort)`),console.log(`[GPT] Max retries:`,p),console.log(`[GPT] Request body size:`,JSON.stringify(d).length,`characters`),console.log(`[GPT] Request input count:`,s.length,`items`);let m=null;for(let e=0;e<=p;e++){e>0&&(console.log(`[GPT] Retry attempt ${e}/${p} after ${Y}ms delay`),await new Promise(e=>setTimeout(e,Y)));try{let t=new AbortController,n=setTimeout(()=>{console.warn(`[GPT] Request timeout after ${f}ms (attempt ${e+1}) - aborting request`),t.abort(`timeout`)},f);console.log(`[GPT] Sending request (attempt ${e+1})...`);let r=await fetch(`${this?.apiUrl}/responses`,{method:`POST`,priority:`auto`,signal:t.signal,headers:{"Content-Type":`application/json`,...this?.apiKey?{Authorization:`Bearer ${this?.apiKey}`}:{}},body:JSON.stringify(d)});if(console.log(`[GPT] Request sent successfully (attempt ${e+1})`),clearTimeout(n),console.log(`[GPT] Response status:`,r.status,`(attempt ${e+1})`),r.status!==200){let e=await r?.json?.()?.catch?.(e=>(console.error(`[GPT] Failed to parse error response:`,e),null)),t=e?.error?.message||e?.message||`HTTP ${r.status}`;if(m=Error(`API error (${r.status}): ${t}`),console.error(`[GPT] API error:`,t),r.status>=400&&r.status<500)throw m;continue}return await this.processSuccessfulResponse(r)}catch(t){if(m=t instanceof Error?t:Error(String(t)),console.error(`[GPT] Request failed (attempt ${e+1}):`,m.message),m.name===`AbortError`||m.message.includes(`HTTP 4`))break}}let h=m?m.message:`Unknown error after all retries`;throw console.error(`[GPT] All retry attempts failed:`,h),Error(`Request failed after ${p+1} attempts: ${h}`)}async processSuccessfulResponse(e){let n=await e?.json?.()?.catch?.(e=>(console.warn(`[GPT] Failed to parse successful response:`,e),null));if(!n)return null;console.log(`[GPT] Raw API response structure:`,{type:typeof n,isArray:Array.isArray(n),keys:Object.keys(n).slice(0,10),keysLength:Object.keys(n).length,sample:JSON.stringify(n).substring(0,300)}),this.responseMap.set(this.responseId=n?.id||n?.response_id||this.responseId,n),this?.messages?.push?.(...this?.pending||[]),this?.pending?.splice?.(0,this?.pending?.length),this.messages.push(...n?.output||[]);let r=e=>{try{if(!e)return null;if(typeof e==`string`){if(e.startsWith(`"`)&&e.endsWith(`"`)&&e.includes(`\\n`))try{let t=JSON.parse(e);if(console.log(`[GPT] Parsed JSON string response:`,typeof t,t?.substring?.(0,100)||`object`),typeof t==`string`)return t;if(typeof t==`object`)return r(t)}catch{console.log(`[GPT] Failed to parse JSON string, treating as plain text`)}return e}if(Array.isArray(e)){console.log(`[GPT] Response is array with`,e.length,`items`),console.log(`[GPT] First few array items:`,e.slice(0,3).map(e=>({type:typeof e,keys:typeof e==`object`?Object.keys(e||{}):`N/A`,sample:typeof e==`string`?e.substring(0,50):JSON.stringify(e).substring(0,100)})));let t=[];for(let n of e)typeof n==`string`?t.push(n):n?.text?t.push(n.text):n?.content?t.push(n.content):n?.message?.content&&t.push(n.message.content);if(t.length)return t.join(`

`)}if(typeof e==`object`&&Object.keys(e).every(e=>!isNaN(Number(e)))){console.log(`[GPT] Response looks like array with`,Object.keys(e).length,`numeric keys`);let t=[];for(let n of Object.keys(e).sort((e,t)=>Number(e)-Number(t))){let r=e[n];typeof r==`string`?t.push(r):r?.text?t.push(r.text):r?.content?t.push(r.content):r?.message?.content&&t.push(r.message.content)}if(t.length)return t.join(`

`)}if(e.output_text&&Array.isArray(e.output_text)&&e.output_text.length)return e.output_text.join(`

`);let t=e.output||e.choices||[],n=[];for(let e of t){let t=e?.content||e?.message?.content||[];if(t){if(typeof t==`string`)n.push(t);else if(Array.isArray(t))for(let e of t)typeof e?.text==`string`?n.push(e.text):e?.text?.value&&n.push(e.text.value)}}if(n.length)return n.join(`

`)}catch(e){console.warn(`[GPT] Error extracting text:`,e)}return null},i=r(n);if(console.log(`[GPT] Extracted text result:`,i?`"${i.substring(0,100)}..."`:`null`),i!=null)return JSON.stringify({choices:[{message:{content:i}}],usage:n?.usage||{},id:this.responseId,object:`chat.completion`});try{let e=t.parse(n?.output??n);if(e)return JSON.stringify({choices:[{message:{content:typeof e==`string`?e:JSON.stringify(e)}}],usage:n?.usage||{},id:this.responseId,object:`chat.completion`})}catch{}return JSON.stringify({choices:[{message:{content:`No text content available`}}],usage:{},id:this.responseId,object:`chat.completion`})}async modifyExistingData(e,t,n=[]){try{this.setContext({operation:`modify`,existingData:e}),await this.giveForRequest(p),await this.giveForRequest(`existing_entity: \`${J(e)}\`\n`),n.length&&await this.giveForRequest(f(n)),await this.askToDoAction(t);let r=a(await this.sendRequest(`high`,`medium`,null,{responseFormat:`json`,temperature:.2}));return r.ok?{ok:!0,data:r.data?.modified_entity||r.data,responseId:this.responseId}:(console.warn(`JSON extraction failed:`,r.error,`Raw:`,r.raw),{ok:!1,error:r.error||`Failed to parse AI response`})}catch(e){return console.error(`Error in modifyExistingData:`,e),{ok:!1,error:String(e)}}}async selectAndFilterData(e,t,n=[]){try{this.setContext({operation:`extract`,filters:t,searchTerms:n}),await this.giveForRequest(m),await this.giveForRequest(`data_set: \`${J(e)}\`\n`);let r=t.map(e=>`Filter: ${e.field} ${e.operator} ${JSON.stringify(e.value)}`).join(`
`);await this.askToDoAction(`
Select items from the provided data set matching these criteria:
${r}
${n.length?`\nSearch terms: ${n.join(`, `)}`:``}

Return matching items with relevance scores.
            `);let i=a(await this.sendRequest(`medium`,`low`,null,{responseFormat:`json`,temperature:.1}));return i.ok?{ok:!0,data:i.data?.selected_items||i.data,responseId:this.responseId}:(console.warn(`JSON extraction failed:`,i.error,`Raw:`,i.raw),{ok:!1,error:i.error||`Failed to parse AI response`})}catch(e){return console.error(`Error in selectAndFilterData:`,e),{ok:!1,error:String(e)}}}async mergeEntities(e,t,n=`prefer_primary`){try{this.setContext({operation:`merge`,existingData:e}),await this.giveForRequest(h),await this.giveForRequest(`primary_entity: \`${J(e)}\`\n`),await this.giveForRequest(`secondary_data: \`${J(t)}\`\n`),await this.askToDoAction(`
Merge the secondary data into the primary entity using "${n}" strategy:
- prefer_primary: Keep primary values when conflicts occur
- prefer_secondary: Use secondary values when conflicts occur
- prefer_newer: Compare timestamps and use newer values
- merge_all: Combine all unique values (arrays concatenated, objects deeply merged)

Return the merged entity with conflict resolution details.
            `);let r=a(await this.sendRequest(`high`,`medium`,null,{responseFormat:`json`,temperature:.2}));return r.ok?{ok:!0,data:r.data?.merged_entity||r.data,responseId:this.responseId}:(console.warn(`JSON extraction failed:`,r.error,`Raw:`,r.raw),{ok:!1,error:r.error||`Failed to parse AI response`})}catch(e){return console.error(`Error in mergeEntities:`,e),{ok:!1,error:String(e)}}}async searchSimilar(e,t,n=.7){try{this.setContext({operation:`analyze`}),await this.giveForRequest(`reference_entity: \`${J(e)}\`\n`),await this.giveForRequest(`candidate_set: \`${J(t)}\`\n`),await this.askToDoAction(`
Find items in the candidate set that are similar to the reference entity.
Consider semantic similarity, not just exact matches.
Compare:
- Names/titles (fuzzy match)
- Types/kinds
- Properties overlap
- Relationships

Return items with similarity score >= ${n}

Expected output structure:
{
    "similar_items": [
        { "item": {...}, "similarity": 0.85, "match_reasons": [...] }
    ],
    "potential_duplicates": [...],
    "related_but_different": [...]
}
            `);let r=a(await this.sendRequest(`medium`,`medium`,null,{responseFormat:`json`,temperature:.3}));return r.ok?{ok:!0,data:r.data?.similar_items||[],responseId:this.responseId}:(console.warn(`JSON extraction failed:`,r.error,`Raw:`,r.raw),{ok:!1,error:r.error||`Failed to parse AI response`})}catch(e){return console.error(`Error in searchSimilar:`,e),{ok:!1,error:String(e)}}}async batchProcess(e,t,n=10){let r=[],i=[];for(let o=0;o<e.length;o+=n){let s=e.slice(o,o+n);await this.giveForRequest(`batch_items: \`${J(s)}\`\n`),await this.askToDoAction(`
Process this batch of ${s.length} items:
${t}

Return processed items in same order.
Expected output: { "processed": [...], "failed": [...] }
            `);let c=await this.sendRequest(`medium`,`low`,null,{responseFormat:`json`});if(c){let e=a(c);e.ok&&e.data?(r.push(...e.data?.processed||[]),e.data?.failed?.length&&i.push(...e.data.failed.map(e=>e?.error||`Unknown error`))):console.warn(`Batch parsing failed:`,e.error)}}return{ok:i.length===0,data:r,error:i.length?i.join(`; `):void 0,responseId:this.responseId}}clearPending(){return this.pending.splice(0,this.pending.length),this}getResponseId(){return this?.responseId}getMessages(){return this?.messages}getPending(){return this?.pending}getContext(){return this?.context}getResponse(e){return this?.responseMap?.get?.(e)}},Se=(e,t,n)=>new xe(e,t||`https://api.proxyapi.ru/openai/v1`,``,n||`gpt-5.6-luna`),Ce=e=>{if(!Array.isArray(e))return[];let t=[];for(let n of e){let e=n;if(!e||typeof e!=`object`)continue;let r=String(e?.origin||``).trim(),i=String(e?.clientKey||``).trim(),a=String(e?.secretKey||``).trim();if(!r||!i||!a)continue;let o=String(e?.serverLabel||e?.label||r).trim()||r;t.push({id:String(e?.id||r),serverLabel:o,origin:r,clientKey:i,secretKey:a})}return t},we=async(e,t)=>{let n=Ce(t);if(n.length)for(let t of n)await e.useMCP(t.serverLabel,t.origin,t.clientKey,t.secretKey)},Te=(e,t)=>{let n=String(e||``).trim(),r=String(t||``).trim();return n===`custom`?r||`gpt-5.6-luna`:n||r||`gpt-5.6-luna`},$=async e=>{let t=await r(),n=e?.apiKey||t?.ai?.apiKey;if(!n)return null;let i=Se(n,e?.baseUrl||t?.ai?.baseUrl||`https://api.proxyapi.ru/openai/v1`,Te(e?.model||t?.ai?.model,e?.customModel||t?.ai?.customModel));return await we(i,e?.mcp??t?.ai?.mcp),i};function Ee(e){if(!e)return e;let t=e.trim().match(/^```(?:katex|md|markdown|html|xml|json|text)?\n([\s\S]*?)\n```$/);if(t){let n=t[1].trim(),r=n.split(`
`);return r.length===1||n.includes(`<math`)||n.includes(`<span class="katex`)||n.includes(`<content`)||n.startsWith(`<`)&&n.endsWith(`>`)||/^\s*<[^>]+>/.test(n)?n:r.length>3||r.some(e=>e.match(/^\s{4,}/)||e.includes(`function`)||e.includes(`const `)||e.includes(`let `))?e:n}return e}function De(e){return e instanceof File&&e.type.startsWith(`image/`)||e instanceof Blob&&e.type?.startsWith(`image/`)||typeof e==`string`&&(e.startsWith(`data:image/`)||e.startsWith(`http`)||e.startsWith(`https://`))}function Oe(e){return[`json`,`xml`,`yaml`].includes(e)?`json`:`text`}var ke=e({extractEntities:()=>Ae}),Ae=async(e,t)=>{try{let r=await $(t);if(!r)return{ok:!1,error:`No GPT instance`};let i=typeof e==`string`?l(e):(e instanceof File||e instanceof Blob)&&e.type.startsWith(`image/`)?`input_image`:`input_text`;Array.isArray(e)&&(e?.[0]?.type===`message`||e?.[0]?.role)?await r?.getPending?.()?.push?.(...e):await r?.attachToRequest?.(e,i),await r.askToDoAction(n);let o=await r.sendRequest(`high`,`medium`,null,{responseFormat:`json`,temperature:.2});if(!o)return{ok:!1,error:`No response`};let s=a(o);return s.ok?{ok:!0,data:s.data?.entities||[],responseId:r.getResponseId()}:{ok:!1,error:s.error||`Failed to parse AI response`}}catch(e){return{ok:!1,error:String(e)}}};export{Ee as a,De as i,$ as n,Z as o,Oe as r,ke as t};