import{n as e}from"./rolldown-runtime-DkW27tQK.js";import{n as t,t as n}from"./core-thUVhBW7.js";import{$ as r,et as i}from"./src-DOA8CgFN.js";import{a,o}from"./Settings-Rm8i74oE.js";import{n as s,t as c}from"./Runtime-ByQtxokK.js";import{n as l,r as u,t as ee}from"./AIResponseParser-DRibMbxh.js";var d,f,p,m,te,ne,h,re,ie;function g(){return(g=e((()=>{s(),d={math:`input_text`,url:`input_image`,text:`input_text`,input_text:`input_text`,output_text:`input_text`,image_url:`input_image`,image:`input_image`,input_image:`input_image`,input_url:`input_image`,json:`input_text`,markdown:`input_text`,code:`input_text`,entity:`input_text`,structured:`input_text`,unknown:`input_text`,svg:`input_text`,xml:`input_text`},f=e=>{if(!e)return`input_text`;let t=e.toLowerCase();return t.includes(`image`)?`input_image`:t.includes(`json`)?`json`:t.includes(`javascript`)||t.includes(`typescript`)?`code`:t.includes(`markdown`)||t.includes(`md`)?`markdown`:t.includes(`url`)?`input_url`:t.includes(`text/html`)?`markdown`:(t.includes(`text/plain`),`input_text`)},p=e=>{if(!e||typeof e!=`string`)return`input_text`;let t=e.trim();if(t.startsWith(`{`)&&t.endsWith(`}`)||t.startsWith(`[`)&&t.endsWith(`]`))try{return JSON.parse(t),`json`}catch{}if(c(t))return`url`;if(t.includes(`<svg`)&&t.includes(`</svg>`))return`xml`;if(t.startsWith(`data:image/`)&&t.includes(`;base64,`)&&!t.includes(`
`)&&t.length<1e5)try{let e=new URL(t);if(e.protocol===`data:`&&e.pathname.startsWith(`image/`))return`input_image`}catch{}return/\$\$[\s\S]+\$\$|\$[^$]+\$|\\begin\{equation\}/.test(t)?`math`:/```[\s\S]+```|^(function|const|let|var|class|import|export)\s/m.test(t)?`code`:/^#{1,6}\s|^\*\*|^-\s|\[.+\]\(.+\)|^>\s/m.test(t)?`markdown`:`input_text`},m=e=>{let t=e?.context,n=d?.[e?.dataKind||`input_text`],r=te(t);switch(n){case`input_image`:return`${r}

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
`}return r||``},te=e=>{if(!e)return``;let t=[];if(e.operation&&t.push(`Operation: ${{create:`Create new data entries based on provided information.`,modify:`Modify existing data with provided changes while preserving structure.`,merge:`Intelligently merge new data with existing data, avoiding duplicates.`,analyze:`Analyze and extract structured information from the data.`,extract:`Extract specific data points matching the criteria.`}[e.operation]||e.operation}`),e.entityType&&t.push(`Target entity type: ${e.entityType}`),e.existingData&&t.push(`Existing data context provided - consider for merge/update operations.`),e.filters?.length){let n=e.filters.map(e=>`${e.field} ${e.operator} ${JSON.stringify(e.value)}`).join(`, `);t.push(`Apply filters: ${n}`)}return e.searchTerms?.length&&t.push(`Search terms: ${e.searchTerms.join(`, `)}`),e.priority&&t.push(`Priority level: ${e.priority}`),t.length?`Context:\n${t.join(`
`)}\n\n---\n`:``},ne=e=>{if(!e?.length)return``;let t=e.map((e,t)=>{let n=e.conditions?.length?` when ${e.conditions.map(e=>`${e.field} ${e.operator} ${JSON.stringify(e.value)}`).join(` AND `)}`:``;switch(e.action){case`update`:return`${t+1}. UPDATE field "${e.target}" to ${JSON.stringify(e.value)}${n}`;case`delete`:return`${t+1}. DELETE field "${e.target}"${n}`;case`merge`:return`${t+1}. MERGE into "${e.target}" with ${JSON.stringify(e.value)}${n}`;case`append`:return`${t+1}. APPEND ${JSON.stringify(e.value)} to "${e.target}"${n}`;case`replace`:return`${t+1}. REPLACE "${e.target}" with ${JSON.stringify(e.value)}${n}`;case`transform`:return`${t+1}. TRANSFORM "${e.target}" using: ${e.transformFn}${n}`;default:return``}}).filter(Boolean);return t.length?`\nModification instructions:\n${t.join(`
`)}\n`:``},h=`
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
`,re=`
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
`,ie=`
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
`})))()}function ae(e){return e.replace(/\\/g,`\\\\`).replace(/"/g,`\\"`).replace(/\n/g,`\\n`).replace(/\r/g,`\\r`).replace(/\t/g,`\\t`).replace(/[\u0000-\u001F]/g,e=>`\\u${e.charCodeAt(0).toString(16).padStart(4,`0`)}`)}function oe(e){return e===`true`||e===`false`||e===`null`}function se(e,t,n){if(t===`__proto__`){Object.defineProperty(e,t,{value:n,enumerable:!0,writable:!0,configurable:!0});return}e[t]=n}function _(e){return e instanceof Pe}function v(e){if(e===null)return null;if(_(e))return e;if(typeof e==`object`&&e&&`toJSON`in e&&typeof e.toJSON==`function`){let t=e.toJSON();if(t!==e)return v(t)}if(typeof e==`string`)return ce(e,`string value`),e;if(typeof e==`boolean`)return e;if(typeof e==`number`)return Object.is(e,-0)?0:Number.isFinite(e)?e:null;if(typeof e==`bigint`)return e>=-(2**53-1)&&e<=2**53-1?Number(e):e.toString();if(e instanceof Date)return e.toISOString();if(Array.isArray(e))return e.map(v);if(e instanceof Set)return Array.from(e).map(v);if(e instanceof Map)return Object.fromEntries(Array.from(e,([e,t])=>[String(e),v(t)]));if(ue(e)){let t={};for(let n in e)Object.hasOwn(e,n)&&(ce(n,`object key`),se(t,n,v(e[n])));return t}return null}function ce(e,t){if(Fe.test(e))for(let n=0;n<e.length;n++){let r=e.charCodeAt(n);if(r<55296||r>57343)continue;let i=r<=56319,a=e.charCodeAt(n+1);if(i&&a>=56320&&a<=57343){n++;continue}throw TypeError(`Cannot encode ${t} containing an unpaired surrogate U+${r.toString(16).toUpperCase()} at index ${n}`)}}function le(e){return e===null||typeof e==`string`||typeof e==`number`||typeof e==`boolean`}function y(e){return le(e)||_(e)}function b(e){return Array.isArray(e)}function x(e){return typeof e==`object`&&!!e&&!Array.isArray(e)&&!_(e)}function S(e){return Object.keys(e).length===0}function ue(e){if(typeof e!=`object`||!e)return!1;let t=Object.getPrototypeOf(e);return t===null||t===Object.prototype}function C(e){return e.length===0||e.every(e=>y(e))}function de(e){return e.length===0||e.every(e=>b(e))}function fe(e){return e.length===0||e.every(e=>x(e))}function pe(e){if(!Object.values(U).includes(e))throw TypeError(`Invalid delimiter ${JSON.stringify(e)}. Valid delimiters are: comma (,), tab (\\t), pipe (|)`)}function me(e){return/^[A-Z_][\w.]*$/i.test(e)}function he(e,t=W){return!(!e||/^[ \t]|[ \t]$/.test(e)||oe(e)||ge(e)||e.includes(`:`)||e.includes(`"`)||e.includes(`\\`)||/[[\]{}]/.test(e)||/[\u0000-\u001F]/.test(e)||e.includes(t)||e.startsWith(`-`)||e.startsWith(`#`))}function ge(e){return Ie.test(e)}function w(e,t){return _(e)?e.value:e===null?Me:typeof e==`boolean`||typeof e==`number`?String(e):_e(e,t)}function _e(e,t=W){return he(e,t)?e:`"${ae(e)}"`}function T(e){return me(e)?e:`"${ae(e)}"`}function E(e,t=W){return e.map(e=>w(e,t)).join(t)}function D(e,t){let n=t?.key,r=t?.fields,i=t?.delimiter??`,`,a=``;return n!=null&&(a+=T(n)),a+=`[${e}${t?.keyed?`:`:``}${i===W?``:i}]`,r&&(a+=`{${ve(r,i)}}`),a+=`:`,a}function ve(e,t){return e.map(e=>T(e.name)+(e.children?`{${ve(e.children,t)}}`:``)).join(t)}function O(e){if(e.length===0)return;let t=Object.keys(e[0]);if(t.length===0)return;for(let n of e){if(Object.keys(n).length!==t.length)return;for(let e of t)if(!Object.hasOwn(n,e))return}let n=[];for(let r of t){let t=ye(r,e.map(e=>e[r]));if(!t)return;n.push(t)}return n}function k(e){let t=Object.values(e);if(!(t.length<2)&&t.every(e=>x(e)&&!S(e)))return O(t)}function A(e,t){let n=[];return j(e,t,n),n}function ye(e,t){if(t.every(e=>y(e)))return{name:e};if(!t.every(e=>x(e)&&!S(e)))return;let n=O(t);if(n)return{name:e,children:n}}function j(e,t,n){for(let r of t){let t=e[r.name];r.children?j(t,r.children,n):n.push(t)}}function*be(e,t,n){if(y(e)){let n=w(e,t.delimiter);n!==``&&(yield n);return}if(b(e))yield*F(void 0,e,n,t);else if(x(e)){let r=k(e);if(r){yield*N(void 0,e,r,n,t);return}yield*M(e,n,t)}}function*M(e,t,n){for(let[r,i]of Object.entries(e))yield*xe(r,i,t,n)}function*xe(e,t,n,r){let i=T(e);if(y(t))yield R(n,`${i}: ${w(t,r.delimiter)}`,r.indentSize);else if(b(t))yield*F(e,t,n,r);else if(x(t)){let a=k(t);if(a){yield*N(e,t,a,n,r);return}yield R(n,`${i}:`,r.indentSize),S(t)||(yield*M(t,n+1,r))}}function*N(e,t,n,r,i){let a=Object.entries(t);yield R(r,D(a.length,{key:e,fields:n,delimiter:i.delimiter,keyed:!0}),i.indentSize),yield*P(a,n,r+1,i)}function*P(e,t,n,r){for(let[i,a]of e){let e=A(a,t);yield R(n,`${T(i)}: ${E(e,r.delimiter)}`,r.indentSize)}}function*F(e,t,n,r){if(t.length===0){yield R(n,e==null?`[]`:`${T(e)}: []`,r.indentSize);return}if(C(t)){yield R(n,I(t,r.delimiter,e),r.indentSize);return}if(de(t)&&t.every(e=>C(e))){yield*Se(e,t,n,r);return}if(fe(t)){let i=O(t);i?yield*Ce(e,t,i,n,r):yield*Te(e,t,n,r);return}yield*Te(e,t,n,r)}function*Se(e,t,n,r){yield R(n,D(t.length,{key:e,delimiter:r.delimiter}),r.indentSize);for(let e of t)if(C(e)){let t=I(e,r.delimiter);yield z(n+1,t,r.indentSize)}}function I(e,t,n){let r=D(e.length,{key:n,delimiter:t}),i=E(e,t);return e.length===0?r:`${r} ${i}`}function*Ce(e,t,n,r,i){yield R(r,D(t.length,{key:e,fields:n,delimiter:i.delimiter}),i.indentSize),yield*we(t,n,r+1,i)}function*we(e,t,n,r){for(let i of e)yield R(n,E(A(i,t),r.delimiter),r.indentSize)}function*Te(e,t,n,r){yield R(n,D(t.length,{key:e,delimiter:r.delimiter}),r.indentSize);for(let e of t)yield*L(e,n+1,r)}function*Ee(e,t,n){if(S(e)){yield R(t,`-`,n.indentSize);return}let r=Object.entries(e),[i,a]=r[0],o=r.slice(1);if(b(a)&&fe(a)){let e=O(a);if(e){yield z(t,D(a.length,{key:i,fields:e,delimiter:n.delimiter}),n.indentSize),yield*we(a,e,t+2,n),o.length>0&&(yield*M(Object.fromEntries(o),t+1,n));return}}if(x(a)){let e=k(a);if(e){let r=Object.entries(a);yield z(t,D(r.length,{key:i,fields:e,delimiter:n.delimiter,keyed:!0}),n.indentSize),yield*P(r,e,t+2,n),o.length>0&&(yield*M(Object.fromEntries(o),t+1,n));return}}let s=T(i);if(y(a))yield z(t,`${s}: ${w(a,n.delimiter)}`,n.indentSize);else if(b(a)){if(a.length===0)yield z(t,`${s}: []`,n.indentSize);else if(C(a))yield z(t,`${s}${I(a,n.delimiter)}`,n.indentSize);else{yield z(t,`${s}${D(a.length,{delimiter:n.delimiter})}`,n.indentSize);for(let e of a)yield*L(e,t+2,n)}}else x(a)&&(yield z(t,`${s}:`,n.indentSize),S(a)||(yield*M(a,t+2,n)));o.length>0&&(yield*M(Object.fromEntries(o),t+1,n))}function*L(e,t,n){if(y(e))yield z(t,w(e,n.delimiter),n.indentSize);else if(b(e)){if(C(e))yield z(t,I(e,n.delimiter),n.indentSize);else{yield z(t,D(e.length,{delimiter:n.delimiter}),n.indentSize);for(let r of e)yield*L(r,t+1,n)}}else x(e)&&(yield*Ee(e,t,n))}function R(e,t,n){return` `.repeat(n*e)+t}function z(e,t,n){return R(e,`- `+t,n)}function De(e,t){let n=t(``,e,[]);return n===void 0?V(e,t,[]):B(e,n,t,[])}function B(e,t,n,r){return _(t)&&!y(e)?V(e,n,r):V(v(t),n,r)}function V(e,t,n){return x(e)?Oe(e,t,n):b(e)?ke(e,t,n):e}function Oe(e,t,n){let r={};for(let[i,a]of Object.entries(e)){let e=[...n,i],o=t(i,a,e);o!==void 0&&se(r,i,B(a,o,t,e))}return r}function ke(e,t,n){let r=[];for(let i=0;i<e.length;i++){let a=e[i],o=[...n,i],s=t(String(i),a,o);s!==void 0&&r.push(B(a,s,t,o))}return r}function H(e,t){return Array.from(Ae(e,t)).join(`
`)}function Ae(e,t){let n=v(e),r=je(t);return be(r.replacer?De(n,r.replacer):n,r,0)}function je(e){let t=e?.delimiter??W;return pe(t),{indentSize:e?.indentSize??e?.indent??2,delimiter:t,replacer:e?.replacer}}var Me,U,W,Ne,Pe,Fe,Ie;function Le(){return(Le=e((()=>{Me=`null`,U={comma:`,`,tab:`	`,pipe:`|`},W=U.comma,Ne=RegExp(`(?:^﻿?|\\n) *#`),Pe=class{constructor(e){if(Ne.test(e))throw TypeError(`Raw string must not contain a line starting with "#": ${JSON.stringify(e)}`);this.value=e}},Fe=/[\uD800-\uDFFF]/,Ie=/^[+-]?\d+(?:\.\d+)?(?:e[+-]?\d+)?$/i})))()}function Re(e){let t=K(),n=t?.requestTimeout,r=typeof t?.maxRetries==`number`?Math.max(0,Math.floor(t.maxRetries)):2;return{timeout:He(n?.[e],Ve[e]),maxRetries:r}}var ze,Be,Ve,G,K,He,q,J,Ue,We;function Y(){return(Y=e((()=>{Le(),g(),i(),u(),s(),ze=()=>globalThis.File!==void 0,Be=()=>globalThis.Blob!==void 0,Ve={low:6e4,medium:3e5,high:9e5},G=2e3,K=()=>globalThis.runtimeSettings?.ai||{},He=(e,t)=>typeof e!=`number`||!Number.isFinite(e)||e<=0?t:e<1e3?e*1e3:e,q=e=>{if(globalThis.Buffer!==void 0)return globalThis.Buffer.from(e).toString(`base64`);let t=1048576;if(e.length>t){let n=``;for(let r=0;r<e.length;r+=t){let i=e.slice(r,r+t),a=``;for(let e=0;e<i.length;e++)a+=String.fromCharCode(i[e]);n+=typeof btoa==`function`?btoa(a):``}return n}let n=``;for(let t=0;t<e.length;t++)n+=String.fromCharCode(e[t]);return typeof btoa==`function`?btoa(n):``},J=async e=>{let t=ze()?globalThis.File:void 0,n=Be()?globalThis.Blob:void 0;if(n&&e?.dataSource instanceof n||t&&e?.dataSource instanceof t){let t=e?.dataSource?.size||0,n=10485760;if(t>n)return console.warn(`[GPT-Responses] File too large: ${t} bytes > ${n} bytes`),{type:`input_text`,text:`[File too large: ${(t/1024/1024).toFixed(1)}MB. Maximum allowed: ${(n/1024/1024).toFixed(1)}MB]`};if(d?.[e?.dataKind||`input_text`]===`input_image`||e?.dataSource?.type?.startsWith?.(`image/`))try{let t=`data:${e?.dataSource?.type};base64,`,n=await e?.dataSource?.arrayBuffer();if(!n)throw Error(`Failed to read file as ArrayBuffer`);let r=new Uint8Array(n);return{type:`input_image`,detail:`auto`,image_url:t+q(r)}}catch(e){return console.error(`[GPT-Responses] Failed to process image file:`,e),{type:`input_text`,text:`[Failed to process image file: ${e}]`}}try{let t=await e?.dataSource?.text?.();if(t)return{type:`input_text`,text:t}}catch(e){return console.error(`[GPT-Responses] Failed to read text file:`,e),{type:`input_text`,text:`[Failed to read text file: ${e}]`}}}else if(typeof e?.dataSource==`string`){let t=e?.dataKind||p(e.dataSource);if(d?.[t]==`input_image`){let t=e?.dataSource?.trim?.()||``;if(t.startsWith(`data:image/`)&&t.includes(`;base64,`))try{let e=new URL(t);if(e.protocol===`data:`&&e.pathname.startsWith(`image/`))return{type:`input_image`,image_url:t,detail:`auto`}}catch{}else if(c(t))return{type:`input_image`,image_url:t,detail:`auto`}}return{type:`input_text`,text:e?.dataSource}}let r=e?.dataSource;try{r=typeof e?.dataSource==`object`?H(e?.dataSource):e?.dataSource}catch(e){console.warn(e)}return{type:d?.[e?.dataKind||`input_text`]||`text`,text:r}},Ue=class{apiKey;apiSecret;apiUrl=`https://api.proxyapi.ru/openai/v1`;model=`gpt-5.6-luna`;responseId=null;pending=[];messages=[];tools=new Map;context=null;responseMap=new Map;constructor(e,t,n,r){this.apiKey=e||``,this.apiUrl=t||this.apiUrl,this.apiSecret=n||``,this.model=r||this.model}setContext(e){return this.context=e,this}async useMCP(e,t,n,r){return this.tools.set(t?.trim?.(),{type:`mcp`,server_label:e,server_url:t,headers:{authorization:`Bearer ${n}:${r}`},require_approval:`never`}),this.tools.get(t?.trim?.())}async convertPlainToInput(e,t=null,n=null){t??=f(e?.type)||`input_text`;let r={dataSource:e,dataKind:t,context:this.context},i=await J(r);return{type:`message`,role:`user`,content:[{type:`input_text`,text:`What to do: `+m(r)},n?{type:`text`,text:`Additional request data: `+n}:null,{type:`input_text`,text:`
 === BEGIN:ATTACHED_DATA === 
`},{...i},{type:`input_text`,text:`
 === END:ATTACHED_DATA === 
`}].filter?.(e=>e!==null)}}async attachToRequest(e,t=null,n=null){return this.pending.push(await this.convertPlainToInput(e,t??=f(e?.type)||`input_text`)),n&&this.pending.push(await this.askToDoAction(n)),this.pending[this.pending.length-1]}async attachExistingData(e,t){return this.context={...this.context,existingData:e,entityType:t||this.context?.entityType},await this.giveForRequest(`existing_data: \`${H(e)}\`\n`),this}async giveForRequest(e){if(typeof e!=`string`)try{let t=f(e?.type)||`input_text`,n=await J({dataSource:e,dataKind:t,context:this.context});return this?.pending?.push?.({type:`message`,role:`user`,content:[{type:`input_text`,text:`Additional data for request:`},{type:`input_text`,text:`
 === BEGIN:ATTACHED_DATA === 
`},{...n},{type:`input_text`,text:`
 === END:ATTACHED_DATA === 
`}]}),this?.pending?.[this?.pending?.length-1]}catch{e=String(e)}return this?.pending?.push?.({type:`message`,role:`user`,content:[{type:`input_text`,text:`Additional data for request:`},{type:`input_text`,text:String(e)}]}),this?.pending?.[this?.pending?.length-1]}async askToDoAction(e){return this?.pending?.push?.({type:`message`,role:`user`,content:[{type:`input_text`,text:e}]}),this?.pending?.[this?.pending?.length-1]}beginFromResponseId(e=null){return this.responseId=this.responseId=e||this.responseId,this}async sendRequest(e=`low`,t=`low`,n=null,i={}){e??=`low`,t??=`low`;let a=new Map;for(let e of this.pending)if(e)try{let t=typeof e==`object`?r.stringify(e):String(e);a.has(t)||a.set(t,e)}catch{a.set(Math.random().toString(),e)}let o=Array.from(a.values()),s=i?.responseFormat===`json`?ee:void 0,c=K(),l=typeof c?.maxOutputTokens==`number`&&Number.isFinite(c.maxOutputTokens)?Math.max(1,Math.floor(c.maxOutputTokens)):void 0,u={model:this.model,tools:Array.from(this?.tools?.values?.()||[])?.filter?.(e=>!!e),input:o,reasoning:{effort:e},text:{verbosity:t},max_output_tokens:i?.maxTokens||l||4e5,previous_response_id:this.responseId=n||this?.responseId,instructions:s};(c?.contextTruncation===`auto`||c?.contextTruncation===`disabled`)&&(u.truncation=c.contextTruncation),(c?.promptCacheRetention===`in-memory`||c?.promptCacheRetention===`24h`)&&(u.prompt_cache_retention=c.promptCacheRetention),typeof c?.maxToolCalls==`number`&&Number.isFinite(c.maxToolCalls)&&(u.max_tool_calls=Math.max(1,Math.floor(c.maxToolCalls))),typeof c?.parallelToolCalls==`boolean`&&(u.parallel_tool_calls=c.parallelToolCalls);let{timeout:d,maxRetries:f}=Re(e);console.log(`[GPT] Making request to:`,`${this?.apiUrl}/responses`),console.log(`[GPT] API key present:`,!!this?.apiKey),console.log(`[GPT] Request timeout:`,`${d}ms (${d/1e3}s) (${e} effort)`),console.log(`[GPT] Max retries:`,f),console.log(`[GPT] Request body size:`,JSON.stringify(u).length,`characters`),console.log(`[GPT] Request input count:`,o.length,`items`);let p=null;for(let e=0;e<=f;e++){e>0&&(console.log(`[GPT] Retry attempt ${e}/${f} after ${G}ms delay`),await new Promise(e=>setTimeout(e,G)));try{let t=new AbortController,n=setTimeout(()=>{console.warn(`[GPT] Request timeout after ${d}ms (attempt ${e+1}) - aborting request`),t.abort(`timeout`)},d);console.log(`[GPT] Sending request (attempt ${e+1})...`);let r=await fetch(`${this?.apiUrl}/responses`,{method:`POST`,priority:`auto`,signal:t.signal,headers:{"Content-Type":`application/json`,...this?.apiKey?{Authorization:`Bearer ${this?.apiKey}`}:{}},body:JSON.stringify(u)});if(console.log(`[GPT] Request sent successfully (attempt ${e+1})`),clearTimeout(n),console.log(`[GPT] Response status:`,r.status,`(attempt ${e+1})`),r.status!==200){let e=await r?.json?.()?.catch?.(e=>(console.error(`[GPT] Failed to parse error response:`,e),null)),t=e?.error?.message||e?.message||`HTTP ${r.status}`;if(p=Error(`API error (${r.status}): ${t}`),console.error(`[GPT] API error:`,t),r.status>=400&&r.status<500)throw p;continue}return await this.processSuccessfulResponse(r)}catch(t){if(p=t instanceof Error?t:Error(String(t)),console.error(`[GPT] Request failed (attempt ${e+1}):`,p.message),p.name===`AbortError`||p.message.includes(`HTTP 4`))break}}let m=p?p.message:`Unknown error after all retries`;throw console.error(`[GPT] All retry attempts failed:`,m),Error(`Request failed after ${f+1} attempts: ${m}`)}async processSuccessfulResponse(e){let t=await e?.json?.()?.catch?.(e=>(console.warn(`[GPT] Failed to parse successful response:`,e),null));if(!t)return null;console.log(`[GPT] Raw API response structure:`,{type:typeof t,isArray:Array.isArray(t),keys:Object.keys(t).slice(0,10),keysLength:Object.keys(t).length,sample:JSON.stringify(t).substring(0,300)}),this.responseMap.set(this.responseId=t?.id||t?.response_id||this.responseId,t),this?.messages?.push?.(...this?.pending||[]),this?.pending?.splice?.(0,this?.pending?.length),this.messages.push(...t?.output||[]);let n=e=>{try{if(!e)return null;if(typeof e==`string`){if(e.startsWith(`"`)&&e.endsWith(`"`)&&e.includes(`\\n`))try{let t=JSON.parse(e);if(console.log(`[GPT] Parsed JSON string response:`,typeof t,t?.substring?.(0,100)||`object`),typeof t==`string`)return t;if(typeof t==`object`)return n(t)}catch{console.log(`[GPT] Failed to parse JSON string, treating as plain text`)}return e}if(Array.isArray(e)){console.log(`[GPT] Response is array with`,e.length,`items`),console.log(`[GPT] First few array items:`,e.slice(0,3).map(e=>({type:typeof e,keys:typeof e==`object`?Object.keys(e||{}):`N/A`,sample:typeof e==`string`?e.substring(0,50):JSON.stringify(e).substring(0,100)})));let t=[];for(let n of e)typeof n==`string`?t.push(n):n?.text?t.push(n.text):n?.content?t.push(n.content):n?.message?.content&&t.push(n.message.content);if(t.length)return t.join(`

`)}if(typeof e==`object`&&Object.keys(e).every(e=>!isNaN(Number(e)))){console.log(`[GPT] Response looks like array with`,Object.keys(e).length,`numeric keys`);let t=[];for(let n of Object.keys(e).sort((e,t)=>Number(e)-Number(t))){let r=e[n];typeof r==`string`?t.push(r):r?.text?t.push(r.text):r?.content?t.push(r.content):r?.message?.content&&t.push(r.message.content)}if(t.length)return t.join(`

`)}if(e.output_text&&Array.isArray(e.output_text)&&e.output_text.length)return e.output_text.join(`

`);let t=e.output||e.choices||[],r=[];for(let e of t){let t=e?.content||e?.message?.content||[];if(t){if(typeof t==`string`)r.push(t);else if(Array.isArray(t))for(let e of t)typeof e?.text==`string`?r.push(e.text):e?.text?.value&&r.push(e.text.value)}}if(r.length)return r.join(`

`)}catch(e){console.warn(`[GPT] Error extracting text:`,e)}return null},i=n(t);if(console.log(`[GPT] Extracted text result:`,i?`"${i.substring(0,100)}..."`:`null`),i!=null)return JSON.stringify({choices:[{message:{content:i}}],usage:t?.usage||{},id:this.responseId,object:`chat.completion`});try{let e=r.parse(t?.output??t);if(e)return JSON.stringify({choices:[{message:{content:typeof e==`string`?e:JSON.stringify(e)}}],usage:t?.usage||{},id:this.responseId,object:`chat.completion`})}catch{}return JSON.stringify({choices:[{message:{content:`No text content available`}}],usage:{},id:this.responseId,object:`chat.completion`})}async modifyExistingData(e,t,n=[]){try{this.setContext({operation:`modify`,existingData:e}),await this.giveForRequest(h),await this.giveForRequest(`existing_entity: \`${H(e)}\`\n`),n.length&&await this.giveForRequest(ne(n)),await this.askToDoAction(t);let r=await this.sendRequest(`high`,`medium`,null,{responseFormat:`json`,temperature:.2}),i=l(r);return i.ok?{ok:!0,data:i.data?.modified_entity||i.data,responseId:this.responseId}:(console.warn(`JSON extraction failed:`,i.error,`Raw:`,i.raw),{ok:!1,error:i.error||`Failed to parse AI response`})}catch(e){return console.error(`Error in modifyExistingData:`,e),{ok:!1,error:String(e)}}}async selectAndFilterData(e,t,n=[]){try{this.setContext({operation:`extract`,filters:t,searchTerms:n}),await this.giveForRequest(re),await this.giveForRequest(`data_set: \`${H(e)}\`\n`);let r=t.map(e=>`Filter: ${e.field} ${e.operator} ${JSON.stringify(e.value)}`).join(`
`);await this.askToDoAction(`
Select items from the provided data set matching these criteria:
${r}
${n.length?`\nSearch terms: ${n.join(`, `)}`:``}

Return matching items with relevance scores.
            `);let i=await this.sendRequest(`medium`,`low`,null,{responseFormat:`json`,temperature:.1}),a=l(i);return a.ok?{ok:!0,data:a.data?.selected_items||a.data,responseId:this.responseId}:(console.warn(`JSON extraction failed:`,a.error,`Raw:`,a.raw),{ok:!1,error:a.error||`Failed to parse AI response`})}catch(e){return console.error(`Error in selectAndFilterData:`,e),{ok:!1,error:String(e)}}}async mergeEntities(e,t,n=`prefer_primary`){try{this.setContext({operation:`merge`,existingData:e}),await this.giveForRequest(ie),await this.giveForRequest(`primary_entity: \`${H(e)}\`\n`),await this.giveForRequest(`secondary_data: \`${H(t)}\`\n`),await this.askToDoAction(`
Merge the secondary data into the primary entity using "${n}" strategy:
- prefer_primary: Keep primary values when conflicts occur
- prefer_secondary: Use secondary values when conflicts occur
- prefer_newer: Compare timestamps and use newer values
- merge_all: Combine all unique values (arrays concatenated, objects deeply merged)

Return the merged entity with conflict resolution details.
            `);let r=await this.sendRequest(`high`,`medium`,null,{responseFormat:`json`,temperature:.2}),i=l(r);return i.ok?{ok:!0,data:i.data?.merged_entity||i.data,responseId:this.responseId}:(console.warn(`JSON extraction failed:`,i.error,`Raw:`,i.raw),{ok:!1,error:i.error||`Failed to parse AI response`})}catch(e){return console.error(`Error in mergeEntities:`,e),{ok:!1,error:String(e)}}}async searchSimilar(e,t,n=.7){try{this.setContext({operation:`analyze`}),await this.giveForRequest(`reference_entity: \`${H(e)}\`\n`),await this.giveForRequest(`candidate_set: \`${H(t)}\`\n`),await this.askToDoAction(`
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
            `);let r=await this.sendRequest(`medium`,`medium`,null,{responseFormat:`json`,temperature:.3}),i=l(r);return i.ok?{ok:!0,data:i.data?.similar_items||[],responseId:this.responseId}:(console.warn(`JSON extraction failed:`,i.error,`Raw:`,i.raw),{ok:!1,error:i.error||`Failed to parse AI response`})}catch(e){return console.error(`Error in searchSimilar:`,e),{ok:!1,error:String(e)}}}async batchProcess(e,t,n=10){let r=[],i=[];for(let a=0;a<e.length;a+=n){let o=e.slice(a,a+n);await this.giveForRequest(`batch_items: \`${H(o)}\`\n`),await this.askToDoAction(`
Process this batch of ${o.length} items:
${t}

Return processed items in same order.
Expected output: { "processed": [...], "failed": [...] }
            `);let s=await this.sendRequest(`medium`,`low`,null,{responseFormat:`json`});if(s){let e=l(s);e.ok&&e.data?(r.push(...e.data?.processed||[]),e.data?.failed?.length&&i.push(...e.data.failed.map(e=>e?.error||`Unknown error`))):console.warn(`Batch parsing failed:`,e.error)}}return{ok:i.length===0,data:r,error:i.length?i.join(`; `):void 0,responseId:this.responseId}}clearPending(){return this.pending.splice(0,this.pending.length),this}getResponseId(){return this?.responseId}getMessages(){return this?.messages}getPending(){return this?.pending}getContext(){return this?.context}getResponse(e){return this?.responseMap?.get?.(e)}},We=(e,t,n)=>new Ue(e,t||`https://api.proxyapi.ru/openai/v1`,``,n||`gpt-5.6-luna`)})))()}function Ge(e){if(!e)return e;let t=e.trim().match(/^```(?:katex|md|markdown|html|xml|json|text)?\n([\s\S]*?)\n```$/);if(t){let n=t[1].trim(),r=n.split(`
`);return r.length===1||n.includes(`<math`)||n.includes(`<span class="katex`)||n.includes(`<content`)||n.startsWith(`<`)&&n.endsWith(`>`)||/^\s*<[^>]+>/.test(n)?n:r.length>3||r.some(e=>e.match(/^\s{4,}/)||e.includes(`function`)||e.includes(`const `)||e.includes(`let `))?e:n}return e}function Ke(e){return e instanceof File&&e.type.startsWith(`image/`)||e instanceof Blob&&e.type?.startsWith(`image/`)||typeof e==`string`&&(e.startsWith(`data:image/`)||e.startsWith(`http`)||e.startsWith(`https://`))}function qe(e){return[`json`,`xml`,`yaml`].includes(e)?`json`:`text`}var X,Je,Ye,Z;function Q(){return(Q=e((()=>{a(),Y(),X=e=>{if(!Array.isArray(e))return[];let t=[];for(let n of e){let e=n;if(!e||typeof e!=`object`)continue;let r=String(e?.origin||``).trim(),i=String(e?.clientKey||``).trim(),a=String(e?.secretKey||``).trim();if(!r||!i||!a)continue;let o=String(e?.serverLabel||e?.label||r).trim()||r;t.push({id:String(e?.id||r),serverLabel:o,origin:r,clientKey:i,secretKey:a})}return t},Je=async(e,t)=>{let n=X(t);if(n.length)for(let t of n)await e.useMCP(t.serverLabel,t.origin,t.clientKey,t.secretKey)},Ye=(e,t)=>{let n=String(e||``).trim(),r=String(t||``).trim();return n===`custom`?r||`gpt-5.6-luna`:n||r||`gpt-5.6-luna`},Z=async e=>{let t=await o(),n=e?.apiKey||t?.ai?.apiKey;if(!n)return null;let r=e?.baseUrl||t?.ai?.baseUrl||`https://api.proxyapi.ru/openai/v1`,i=Ye(e?.model||t?.ai?.model,e?.customModel||t?.ai?.customModel),a=We(n,r,i);return await Je(a,e?.mcp??t?.ai?.mcp),a}})))()}var Xe;function $(){return($=e((()=>{g(),u(),a(),Q(),t(),Xe=async(e,t)=>{try{let r=await Z(t);if(!r)return{ok:!1,error:`No GPT instance`};let i=typeof e==`string`?p(e):(e instanceof File||e instanceof Blob)&&e.type.startsWith(`image/`)?`input_image`:`input_text`;Array.isArray(e)&&(e?.[0]?.type===`message`||e?.[0]?.role)?await r?.getPending?.()?.push?.(...e):await r?.attachToRequest?.(e,i),await r.askToDoAction(n);let a=await r.sendRequest(`high`,`medium`,null,{responseFormat:`json`,temperature:.2});if(!a)return{ok:!1,error:`No response`};let o=l(a);return o.ok?{ok:!0,data:o.data?.entities||[],responseId:r.getResponseId()}:{ok:!1,error:o.error||`Failed to parse AI response`}}catch(e){return{ok:!1,error:String(e)}}}})))()}export{Q as a,Y as c,qe as i,q as l,$ as n,Ke as o,Z as r,Ge as s,Xe as t};