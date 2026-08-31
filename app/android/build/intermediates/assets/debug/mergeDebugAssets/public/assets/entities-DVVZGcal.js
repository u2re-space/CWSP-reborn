import{r as e}from"./rolldown-runtime-C0FnF6B9.js";import{ct as t}from"./src-DS4R4W78.js";import{t as n}from"./core-B2-fF3QG.js";import{a as r}from"./Settings-TtEuZHH4.js";import{t as i}from"./Runtime-CLdCyDua.js";var a={math:`input_text`,url:`input_image`,text:`input_text`,input_text:`input_text`,output_text:`input_text`,image_url:`input_image`,image:`input_image`,input_image:`input_image`,input_url:`input_image`,json:`input_text`,markdown:`input_text`,code:`input_text`,entity:`input_text`,structured:`input_text`,unknown:`input_text`,svg:`input_text`,xml:`input_text`},o=e=>{if(!e)return`input_text`;let t=e.toLowerCase();return t.includes(`image`)?`input_image`:t.includes(`json`)?`json`:t.includes(`javascript`)||t.includes(`typescript`)?`code`:t.includes(`markdown`)||t.includes(`md`)?`markdown`:t.includes(`url`)?`input_url`:t.includes(`text/html`)?`markdown`:(t.includes(`text/plain`),`input_text`)},s=e=>{if(!e||typeof e!=`string`)return`input_text`;let t=e.trim();if(t.startsWith(`{`)&&t.endsWith(`}`)||t.startsWith(`[`)&&t.endsWith(`]`))try{return JSON.parse(t),`json`}catch{}if(i(t))return`url`;if(t.includes(`<svg`)&&t.includes(`</svg>`))return`xml`;if(t.startsWith(`data:image/`)&&t.includes(`;base64,`)&&!t.includes(`
`)&&t.length<1e5)try{let e=new URL(t);if(e.protocol===`data:`&&e.pathname.startsWith(`image/`))return`input_image`}catch{}return/\$\$[\s\S]+\$\$|\$[^$]+\$|\\begin\{equation\}/.test(t)?`math`:/```[\s\S]+```|^(function|const|let|var|class|import|export)\s/m.test(t)?`code`:/^#{1,6}\s|^\*\*|^-\s|\[.+\]\(.+\)|^>\s/m.test(t)?`markdown`:`input_text`},c=e=>{let t=e?.context,n=a?.[e?.dataKind||`input_text`],r=l(t);switch(n){case`input_image`:return`${r}

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
`}return r||``},l=e=>{if(!e)return``;let t=[];if(e.operation&&t.push(`Operation: ${{create:`Create new data entries based on provided information.`,modify:`Modify existing data with provided changes while preserving structure.`,merge:`Intelligently merge new data with existing data, avoiding duplicates.`,analyze:`Analyze and extract structured information from the data.`,extract:`Extract specific data points matching the criteria.`}[e.operation]||e.operation}`),e.entityType&&t.push(`Target entity type: ${e.entityType}`),e.existingData&&t.push(`Existing data context provided - consider for merge/update operations.`),e.filters?.length){let n=e.filters.map(e=>`${e.field} ${e.operator} ${JSON.stringify(e.value)}`).join(`, `);t.push(`Apply filters: ${n}`)}return e.searchTerms?.length&&t.push(`Search terms: ${e.searchTerms.join(`, `)}`),e.priority&&t.push(`Priority level: ${e.priority}`),t.length?`Context:\n${t.join(`
`)}\n\n---\n`:``},u=e=>{if(!e?.length)return``;let t=e.map((e,t)=>{let n=e.conditions?.length?` when ${e.conditions.map(e=>`${e.field} ${e.operator} ${JSON.stringify(e.value)}`).join(` AND `)}`:``;switch(e.action){case`update`:return`${t+1}. UPDATE field "${e.target}" to ${JSON.stringify(e.value)}${n}`;case`delete`:return`${t+1}. DELETE field "${e.target}"${n}`;case`merge`:return`${t+1}. MERGE into "${e.target}" with ${JSON.stringify(e.value)}${n}`;case`append`:return`${t+1}. APPEND ${JSON.stringify(e.value)} to "${e.target}"${n}`;case`replace`:return`${t+1}. REPLACE "${e.target}" with ${JSON.stringify(e.value)}${n}`;case`transform`:return`${t+1}. TRANSFORM "${e.target}" using: ${e.transformFn}${n}`;default:return``}}).filter(Boolean);return t.length?`\nModification instructions:\n${t.join(`
`)}\n`:``},d=`
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
`,f=`
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
`,p=`
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
`,m=[/```json\s*\n?([\s\S]*?)\n?```/i,/```toon\s*\n?([\s\S]*?)\n?```/i,/```\s*\n?([\s\S]*?)\n?```/,/(\{[\s\S]*\})/,/(\[[\s\S]*\])/],h=e=>!e||typeof e!=`string`?``:e.replace(/^\uFEFF/,``).replace(/[\u200B-\u200D\uFEFF]/g,``).replace(/\r\n/g,`
`).replace(/\r/g,`
`).trim(),g=e=>{let t=e;return t=t.replace(/,(\s*[}\]])/g,`$1`),t=t.replace(/:\s*"([^"]*)\n([^"]*)"/g,(e,t,n)=>`: "${t}\\n${n}"`),t=t.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g,``),t},_=e=>{if(!e)return{ok:!1,error:`Empty input`};try{return{ok:!0,data:t.parse(e)}}catch{}try{return{ok:!0,data:JSON.parse(e)}}catch{}try{let n=g(e);return{ok:!0,data:t.parse(n)}}catch{}try{let n=e.match(/^[^{[]*([{\[][\s\S]*[}\]])[^}\]]*$/);if(n?.[1])return{ok:!0,data:t.parse(n[1])}}catch{}return{ok:!1,error:`Failed to parse JSON with all strategies`}},v=e=>{if(e==null)return{ok:!1,error:`Response is null or undefined`};if(typeof e!=`string`)return typeof e==`object`?{ok:!0,data:e,source:`direct`}:{ok:!1,error:`Expected string, got ${typeof e}`};let t=h(e);if(!t)return{ok:!1,error:`Response is empty after cleaning`,raw:e};let n=_(t);if(n.ok)return{ok:!0,data:n.data,raw:e,source:`direct`};for(let n of m){let r=t.match(n);if(r?.[1]){let t=_(h(r[1]));if(t.ok)return{ok:!0,data:t.data,raw:e,source:`markdown_block`}}}let r=t.match(/(\{[\s\S]+\}|\[[\s\S]+\])/);if(r?.[1]){let t=_(g(r[1]));if(t.ok)return{ok:!0,data:t.data,raw:e,source:`recovered`}}return{ok:!1,error:`Could not extract valid JSON from response`,raw:e}},ee=`
CRITICAL OUTPUT FORMAT REQUIREMENTS:

1. Your response MUST be ONLY valid JSON - no markdown, no explanations, no prose.
2. Do NOT wrap the JSON in code blocks (\`\`\`json or \`\`\`).
3. Do NOT include any text before or after the JSON object.
4. The response must start with { or [ and end with } or ].
5. All strings must be properly escaped (newlines as \\n, quotes as \\").
6. Use null for missing/unknown values, not undefined or empty strings.
7. Numbers should be unquoted. Booleans should be true/false (lowercase).
8. Arrays should not have trailing commas.
9. The JSON must be parseable by JSON.parse() without modification.

If you cannot provide the requested data, return: {"error": "description of the issue", "ok": false}
`,te=`null`,y={comma:`,`,tab:`	`,pipe:`|`},b=y.comma;function x(e){return e.replace(/\\/g,`\\\\`).replace(/"/g,`\\"`).replace(/\n/g,`\\n`).replace(/\r/g,`\\r`).replace(/\t/g,`\\t`).replace(/[\u0000-\u001F]/g,e=>`\\u${e.charCodeAt(0).toString(16).padStart(4,`0`)}`)}function ne(e){return e===`true`||e===`false`||e===`null`}function S(e,t,n){if(t===`__proto__`){Object.defineProperty(e,t,{value:n,enumerable:!0,writable:!0,configurable:!0});return}e[t]=n}var re=RegExp(`(?:^﻿?|\\n) *#`),ie=class{constructor(e){if(re.test(e))throw TypeError(`Raw string must not contain a line starting with "#": ${JSON.stringify(e)}`);this.value=e}};function C(e){return e instanceof ie}var ae=/[\uD800-\uDFFF]/;function w(e){if(e===null)return null;if(C(e))return e;if(typeof e==`object`&&e&&`toJSON`in e&&typeof e.toJSON==`function`){let t=e.toJSON();if(t!==e)return w(t)}if(typeof e==`string`)return T(e,`string value`),e;if(typeof e==`boolean`)return e;if(typeof e==`number`)return Object.is(e,-0)?0:Number.isFinite(e)?e:null;if(typeof e==`bigint`)return e>=-(2**53-1)&&e<=2**53-1?Number(e):e.toString();if(e instanceof Date)return e.toISOString();if(Array.isArray(e))return e.map(w);if(e instanceof Set)return Array.from(e).map(w);if(e instanceof Map)return Object.fromEntries(Array.from(e,([e,t])=>[String(e),w(t)]));if(se(e)){let t={};for(let n in e)Object.hasOwn(e,n)&&(T(n,`object key`),S(t,n,w(e[n])));return t}return null}function T(e,t){if(ae.test(e))for(let n=0;n<e.length;n++){let r=e.charCodeAt(n);if(r<55296||r>57343)continue;let i=r<=56319,a=e.charCodeAt(n+1);if(i&&a>=56320&&a<=57343){n++;continue}throw TypeError(`Cannot encode ${t} containing an unpaired surrogate U+${r.toString(16).toUpperCase()} at index ${n}`)}}function oe(e){return e===null||typeof e==`string`||typeof e==`number`||typeof e==`boolean`}function E(e){return oe(e)||C(e)}function D(e){return Array.isArray(e)}function O(e){return typeof e==`object`&&!!e&&!Array.isArray(e)&&!C(e)}function k(e){return Object.keys(e).length===0}function se(e){if(typeof e!=`object`||!e)return!1;let t=Object.getPrototypeOf(e);return t===null||t===Object.prototype}function A(e){return e.length===0||e.every(e=>E(e))}function ce(e){return e.length===0||e.every(e=>D(e))}function j(e){return e.length===0||e.every(e=>O(e))}var le=/^[+-]?\d+(?:\.\d+)?(?:e[+-]?\d+)?$/i;function ue(e){if(!Object.values(y).includes(e))throw TypeError(`Invalid delimiter ${JSON.stringify(e)}. Valid delimiters are: comma (,), tab (\\t), pipe (|)`)}function de(e){return/^[A-Z_][\w.]*$/i.test(e)}function fe(e,t=b){return!(!e||/^[ \t]|[ \t]$/.test(e)||ne(e)||pe(e)||e.includes(`:`)||e.includes(`"`)||e.includes(`\\`)||/[[\]{}]/.test(e)||/[\u0000-\u001F]/.test(e)||e.includes(t)||e.startsWith(`-`)||e.startsWith(`#`))}function pe(e){return le.test(e)}function M(e,t){return C(e)?e.value:e===null?te:typeof e==`boolean`||typeof e==`number`?String(e):me(e,t)}function me(e,t=b){return fe(e,t)?e:`"${x(e)}"`}function N(e){return de(e)?e:`"${x(e)}"`}function P(e,t=b){return e.map(e=>M(e,t)).join(t)}function F(e,t){let n=t?.key,r=t?.fields,i=t?.delimiter??`,`,a=``;return n!=null&&(a+=N(n)),a+=`[${e}${t?.keyed?`:`:``}${i===b?``:i}]`,r&&(a+=`{${I(r,i)}}`),a+=`:`,a}function I(e,t){return e.map(e=>N(e.name)+(e.children?`{${I(e.children,t)}}`:``)).join(t)}function L(e){if(e.length===0)return;let t=Object.keys(e[0]);if(t.length===0)return;for(let n of e){if(Object.keys(n).length!==t.length)return;for(let e of t)if(!Object.hasOwn(n,e))return}let n=[];for(let r of t){let t=he(r,e.map(e=>e[r]));if(!t)return;n.push(t)}return n}function R(e){let t=Object.values(e);if(!(t.length<2)&&t.every(e=>O(e)&&!k(e)))return L(t)}function z(e,t){let n=[];return B(e,t,n),n}function he(e,t){if(t.every(e=>E(e)))return{name:e};if(!t.every(e=>O(e)&&!k(e)))return;let n=L(t);if(n)return{name:e,children:n}}function B(e,t,n){for(let r of t){let t=e[r.name];r.children?B(t,r.children,n):n.push(t)}}function*ge(e,t,n){if(E(e)){let n=M(e,t.delimiter);n!==``&&(yield n);return}if(D(e))yield*W(void 0,e,n,t);else if(O(e)){let r=R(e);if(r){yield*H(void 0,e,r,n,t);return}yield*V(e,n,t)}}function*V(e,t,n){for(let[r,i]of Object.entries(e))yield*_e(r,i,t,n)}function*_e(e,t,n,r){let i=N(e);if(E(t))yield J(n,`${i}: ${M(t,r.delimiter)}`,r.indentSize);else if(D(t))yield*W(e,t,n,r);else if(O(t)){let a=R(t);if(a){yield*H(e,t,a,n,r);return}yield J(n,`${i}:`,r.indentSize),k(t)||(yield*V(t,n+1,r))}}function*H(e,t,n,r,i){let a=Object.entries(t);yield J(r,F(a.length,{key:e,fields:n,delimiter:i.delimiter,keyed:!0}),i.indentSize),yield*U(a,n,r+1,i)}function*U(e,t,n,r){for(let[i,a]of e){let e=z(a,t);yield J(n,`${N(i)}: ${P(e,r.delimiter)}`,r.indentSize)}}function*W(e,t,n,r){if(t.length===0){yield J(n,e==null?`[]`:`${N(e)}: []`,r.indentSize);return}if(A(t)){yield J(n,G(t,r.delimiter,e),r.indentSize);return}if(ce(t)&&t.every(e=>A(e))){yield*ve(e,t,n,r);return}if(j(t)){let i=L(t);i?yield*ye(e,t,i,n,r):yield*be(e,t,n,r);return}yield*be(e,t,n,r)}function*ve(e,t,n,r){yield J(n,F(t.length,{key:e,delimiter:r.delimiter}),r.indentSize);for(let e of t)if(A(e)){let t=G(e,r.delimiter);yield Y(n+1,t,r.indentSize)}}function G(e,t,n){let r=F(e.length,{key:n,delimiter:t}),i=P(e,t);return e.length===0?r:`${r} ${i}`}function*ye(e,t,n,r,i){yield J(r,F(t.length,{key:e,fields:n,delimiter:i.delimiter}),i.indentSize),yield*K(t,n,r+1,i)}function*K(e,t,n,r){for(let i of e)yield J(n,P(z(i,t),r.delimiter),r.indentSize)}function*be(e,t,n,r){yield J(n,F(t.length,{key:e,delimiter:r.delimiter}),r.indentSize);for(let e of t)yield*q(e,n+1,r)}function*xe(e,t,n){if(k(e)){yield J(t,`-`,n.indentSize);return}let r=Object.entries(e),[i,a]=r[0],o=r.slice(1);if(D(a)&&j(a)){let e=L(a);if(e){yield Y(t,F(a.length,{key:i,fields:e,delimiter:n.delimiter}),n.indentSize),yield*K(a,e,t+2,n),o.length>0&&(yield*V(Object.fromEntries(o),t+1,n));return}}if(O(a)){let e=R(a);if(e){let r=Object.entries(a);yield Y(t,F(r.length,{key:i,fields:e,delimiter:n.delimiter,keyed:!0}),n.indentSize),yield*U(r,e,t+2,n),o.length>0&&(yield*V(Object.fromEntries(o),t+1,n));return}}let s=N(i);if(E(a))yield Y(t,`${s}: ${M(a,n.delimiter)}`,n.indentSize);else if(D(a)){if(a.length===0)yield Y(t,`${s}: []`,n.indentSize);else if(A(a))yield Y(t,`${s}${G(a,n.delimiter)}`,n.indentSize);else{yield Y(t,`${s}${F(a.length,{delimiter:n.delimiter})}`,n.indentSize);for(let e of a)yield*q(e,t+2,n)}}else O(a)&&(yield Y(t,`${s}:`,n.indentSize),k(a)||(yield*V(a,t+2,n)));o.length>0&&(yield*V(Object.fromEntries(o),t+1,n))}function*q(e,t,n){if(E(e))yield Y(t,M(e,n.delimiter),n.indentSize);else if(D(e)){if(A(e))yield Y(t,G(e,n.delimiter),n.indentSize);else{yield Y(t,F(e.length,{delimiter:n.delimiter}),n.indentSize);for(let r of e)yield*q(r,t+1,n)}}else O(e)&&(yield*xe(e,t,n))}function J(e,t,n){return` `.repeat(n*e)+t}function Y(e,t,n){return J(e,`- `+t,n)}function Se(e,t){let n=t(``,e,[]);return n===void 0?Z(e,t,[]):X(e,n,t,[])}function X(e,t,n,r){return C(t)&&!E(e)?Z(e,n,r):Z(w(t),n,r)}function Z(e,t,n){return O(e)?Ce(e,t,n):D(e)?we(e,t,n):e}function Ce(e,t,n){let r={};for(let[i,a]of Object.entries(e)){let e=[...n,i],o=t(i,a,e);o!==void 0&&S(r,i,X(a,o,t,e))}return r}function we(e,t,n){let r=[];for(let i=0;i<e.length;i++){let a=e[i],o=[...n,i],s=t(String(i),a,o);s!==void 0&&r.push(X(a,s,t,o))}return r}function Q(e,t){return Array.from(Te(e,t)).join(`
`)}function Te(e,t){let n=w(e),r=Ee(t);return ge(r.replacer?Se(n,r.replacer):n,r,0)}function Ee(e){let t=e?.delimiter??b;return ue(t),{indentSize:e?.indentSize??e?.indent??2,delimiter:t,replacer:e?.replacer}}var De=()=>globalThis.File!==void 0,Oe=()=>globalThis.Blob!==void 0,ke={low:6e4,medium:3e5,high:9e5},$=2e3,Ae=()=>globalThis.runtimeSettings?.ai||{},je=(e,t)=>typeof e!=`number`||!Number.isFinite(e)||e<=0?t:e<1e3?e*1e3:e;function Me(e){let t=Ae(),n=t?.requestTimeout,r=typeof t?.maxRetries==`number`?Math.max(0,Math.floor(t.maxRetries)):2;return{timeout:je(n?.[e],ke[e]),maxRetries:r}}var Ne=e=>{if(globalThis.Buffer!==void 0)return globalThis.Buffer.from(e).toString(`base64`);let t=1048576;if(e.length>t){let n=``;for(let r=0;r<e.length;r+=t){let i=e.slice(r,r+t),a=``;for(let e=0;e<i.length;e++)a+=String.fromCharCode(i[e]);n+=typeof btoa==`function`?btoa(a):``}return n}let n=``;for(let t=0;t<e.length;t++)n+=String.fromCharCode(e[t]);return typeof btoa==`function`?btoa(n):``},Pe=async e=>{let t=De()?globalThis.File:void 0,n=Oe()?globalThis.Blob:void 0;if(n&&e?.dataSource instanceof n||t&&e?.dataSource instanceof t){let t=e?.dataSource?.size||0,n=10485760;if(t>n)return console.warn(`[GPT-Responses] File too large: ${t} bytes > ${n} bytes`),{type:`input_text`,text:`[File too large: ${(t/1024/1024).toFixed(1)}MB. Maximum allowed: ${(n/1024/1024).toFixed(1)}MB]`};if(a?.[e?.dataKind||`input_text`]===`input_image`||e?.dataSource?.type?.startsWith?.(`image/`))try{let t=`data:${e?.dataSource?.type};base64,`,n=await e?.dataSource?.arrayBuffer();if(!n)throw Error(`Failed to read file as ArrayBuffer`);return{type:`input_image`,detail:`auto`,image_url:t+Ne(new Uint8Array(n))}}catch(e){return console.error(`[GPT-Responses] Failed to process image file:`,e),{type:`input_text`,text:`[Failed to process image file: ${e}]`}}try{let t=await e?.dataSource?.text?.();if(t)return{type:`input_text`,text:t}}catch(e){return console.error(`[GPT-Responses] Failed to read text file:`,e),{type:`input_text`,text:`[Failed to read text file: ${e}]`}}}else if(typeof e?.dataSource==`string`){let t=e?.dataKind||s(e.dataSource);if(a?.[t]==`input_image`){let t=e?.dataSource?.trim?.()||``;if(t.startsWith(`data:image/`)&&t.includes(`;base64,`))try{let e=new URL(t);if(e.protocol===`data:`&&e.pathname.startsWith(`image/`))return{type:`input_image`,image_url:t,detail:`auto`}}catch{}else if(i(t))return{type:`input_image`,image_url:t,detail:`auto`}}return{type:`input_text`,text:e?.dataSource}}let r=e?.dataSource;try{r=typeof e?.dataSource==`object`?Q(e?.dataSource):e?.dataSource}catch(e){console.warn(e)}return{type:a?.[e?.dataKind||`input_text`]||`text`,text:r}},Fe=class{apiKey;apiSecret;apiUrl=`https://api.proxyapi.ru/openai/v1`;model=`gpt-5.6-luna`;responseId=null;pending=[];messages=[];tools=new Map;context=null;responseMap=new Map;constructor(e,t,n,r){this.apiKey=e||``,this.apiUrl=t||this.apiUrl,this.apiSecret=n||``,this.model=r||this.model}setContext(e){return this.context=e,this}async useMCP(e,t,n,r){return this.tools.set(t?.trim?.(),{type:`mcp`,server_label:e,server_url:t,headers:{authorization:`Bearer ${n}:${r}`},require_approval:`never`}),this.tools.get(t?.trim?.())}async convertPlainToInput(e,t=null,n=null){t??=o(e?.type)||`input_text`;let r={dataSource:e,dataKind:t,context:this.context},i=await Pe(r);return{type:`message`,role:`user`,content:[{type:`input_text`,text:`What to do: `+c(r)},n?{type:`text`,text:`Additional request data: `+n}:null,{type:`input_text`,text:`
 === BEGIN:ATTACHED_DATA === 
`},{...i},{type:`input_text`,text:`
 === END:ATTACHED_DATA === 
`}].filter?.(e=>e!==null)}}async attachToRequest(e,t=null,n=null){return this.pending.push(await this.convertPlainToInput(e,t??=o(e?.type)||`input_text`)),n&&this.pending.push(await this.askToDoAction(n)),this.pending[this.pending.length-1]}async attachExistingData(e,t){return this.context={...this.context,existingData:e,entityType:t||this.context?.entityType},await this.giveForRequest(`existing_data: \`${Q(e)}\`\n`),this}async giveForRequest(e){if(typeof e!=`string`)try{let t=o(e?.type)||`input_text`,n=await Pe({dataSource:e,dataKind:t,context:this.context});return this?.pending?.push?.({type:`message`,role:`user`,content:[{type:`input_text`,text:`Additional data for request:`},{type:`input_text`,text:`
 === BEGIN:ATTACHED_DATA === 
`},{...n},{type:`input_text`,text:`
 === END:ATTACHED_DATA === 
`}]}),this?.pending?.[this?.pending?.length-1]}catch{e=String(e)}return this?.pending?.push?.({type:`message`,role:`user`,content:[{type:`input_text`,text:`Additional data for request:`},{type:`input_text`,text:String(e)}]}),this?.pending?.[this?.pending?.length-1]}async askToDoAction(e){return this?.pending?.push?.({type:`message`,role:`user`,content:[{type:`input_text`,text:e}]}),this?.pending?.[this?.pending?.length-1]}beginFromResponseId(e=null){return this.responseId=this.responseId=e||this.responseId,this}async sendRequest(e=`low`,n=`low`,r=null,i={}){e??=`low`,n??=`low`;let a=new Map;for(let e of this.pending)if(e)try{let n=typeof e==`object`?t.stringify(e):String(e);a.has(n)||a.set(n,e)}catch{a.set(Math.random().toString(),e)}let o=Array.from(a.values()),s=i?.responseFormat===`json`?ee:void 0,c=Ae(),l=typeof c?.maxOutputTokens==`number`&&Number.isFinite(c.maxOutputTokens)?Math.max(1,Math.floor(c.maxOutputTokens)):void 0,u={model:this.model,tools:Array.from(this?.tools?.values?.()||[])?.filter?.(e=>!!e),input:o,reasoning:{effort:e},text:{verbosity:n},max_output_tokens:i?.maxTokens||l||4e5,previous_response_id:this.responseId=r||this?.responseId,instructions:s};(c?.contextTruncation===`auto`||c?.contextTruncation===`disabled`)&&(u.truncation=c.contextTruncation),(c?.promptCacheRetention===`in-memory`||c?.promptCacheRetention===`24h`)&&(u.prompt_cache_retention=c.promptCacheRetention),typeof c?.maxToolCalls==`number`&&Number.isFinite(c.maxToolCalls)&&(u.max_tool_calls=Math.max(1,Math.floor(c.maxToolCalls))),typeof c?.parallelToolCalls==`boolean`&&(u.parallel_tool_calls=c.parallelToolCalls);let{timeout:d,maxRetries:f}=Me(e);console.log(`[GPT] Making request to:`,`${this?.apiUrl}/responses`),console.log(`[GPT] API key present:`,!!this?.apiKey),console.log(`[GPT] Request timeout:`,`${d}ms (${d/1e3}s) (${e} effort)`),console.log(`[GPT] Max retries:`,f),console.log(`[GPT] Request body size:`,JSON.stringify(u).length,`characters`),console.log(`[GPT] Request input count:`,o.length,`items`);let p=null;for(let e=0;e<=f;e++){if(i.signal?.aborted)throw new DOMException(`Cancelled`,`AbortError`);e>0&&(console.log(`[GPT] Retry attempt ${e}/${f} after ${$}ms delay`),await new Promise((e,t)=>{let n=setTimeout(e,$);i.signal?.addEventListener(`abort`,()=>{clearTimeout(n),t(new DOMException(`Cancelled`,`AbortError`))},{once:!0})}));let t=new AbortController,n=()=>t.abort(i.signal?.reason||`cancelled`);i.signal?.addEventListener(`abort`,n,{once:!0});let r=setTimeout(()=>{console.warn(`[GPT] Request timeout after ${d}ms (attempt ${e+1}) - aborting request`),t.abort(`timeout`)},d);try{console.log(`[GPT] Sending request (attempt ${e+1})...`);let n=await fetch(`${this?.apiUrl}/responses`,{method:`POST`,priority:`auto`,signal:t.signal,headers:{"Content-Type":`application/json`,...this?.apiKey?{Authorization:`Bearer ${this?.apiKey}`}:{}},body:JSON.stringify(u)});if(console.log(`[GPT] Request sent successfully (attempt ${e+1})`),console.log(`[GPT] Response status:`,n.status,`(attempt ${e+1})`),n.status!==200){let e=await n?.json?.()?.catch?.(e=>(console.error(`[GPT] Failed to parse error response:`,e),null)),t=e?.error?.message||e?.message||`HTTP ${n.status}`;if(p=Error(`API error (${n.status}): ${t}`),console.error(`[GPT] API error:`,t),n.status>=400&&n.status<500)throw p;continue}return await this.processSuccessfulResponse(n)}catch(t){if(p=t instanceof Error?t:Error(String(t)),console.error(`[GPT] Request failed (attempt ${e+1}):`,p.message),i.signal?.aborted||p.name===`AbortError`||/API error \(4\d{2}\)/.test(p.message))break}finally{clearTimeout(r),i.signal?.removeEventListener(`abort`,n)}}let m=p?p.message:`Unknown error after all retries`;throw console.error(`[GPT] All retry attempts failed:`,m),Error(`Request failed after ${f+1} attempts: ${m}`)}async processSuccessfulResponse(e){let n=await e?.json?.()?.catch?.(e=>(console.warn(`[GPT] Failed to parse successful response:`,e),null));if(!n)return null;console.log(`[GPT] Raw API response structure:`,{type:typeof n,isArray:Array.isArray(n),keys:Object.keys(n).slice(0,10),keysLength:Object.keys(n).length,sample:JSON.stringify(n).substring(0,300)}),this.responseMap.set(this.responseId=n?.id||n?.response_id||this.responseId,n),this?.messages?.push?.(...this?.pending||[]),this?.pending?.splice?.(0,this?.pending?.length),this.messages.push(...n?.output||[]);let r=e=>{try{if(!e)return null;if(typeof e==`string`){if(e.startsWith(`"`)&&e.endsWith(`"`)&&e.includes(`\\n`))try{let t=JSON.parse(e);if(console.log(`[GPT] Parsed JSON string response:`,typeof t,t?.substring?.(0,100)||`object`),typeof t==`string`)return t;if(typeof t==`object`)return r(t)}catch{console.log(`[GPT] Failed to parse JSON string, treating as plain text`)}return e}if(Array.isArray(e)){console.log(`[GPT] Response is array with`,e.length,`items`),console.log(`[GPT] First few array items:`,e.slice(0,3).map(e=>({type:typeof e,keys:typeof e==`object`?Object.keys(e||{}):`N/A`,sample:typeof e==`string`?e.substring(0,50):JSON.stringify(e).substring(0,100)})));let t=[];for(let n of e)typeof n==`string`?t.push(n):n?.text?t.push(n.text):n?.content?t.push(n.content):n?.message?.content&&t.push(n.message.content);if(t.length)return t.join(`

`)}if(typeof e==`object`&&Object.keys(e).every(e=>!isNaN(Number(e)))){console.log(`[GPT] Response looks like array with`,Object.keys(e).length,`numeric keys`);let t=[];for(let n of Object.keys(e).sort((e,t)=>Number(e)-Number(t))){let r=e[n];typeof r==`string`?t.push(r):r?.text?t.push(r.text):r?.content?t.push(r.content):r?.message?.content&&t.push(r.message.content)}if(t.length)return t.join(`

`)}if(e.output_text&&Array.isArray(e.output_text)&&e.output_text.length)return e.output_text.join(`

`);let t=e.output||e.choices||[],n=[];for(let e of t){let t=e?.content||e?.message?.content||[];if(t){if(typeof t==`string`)n.push(t);else if(Array.isArray(t))for(let e of t)typeof e?.text==`string`?n.push(e.text):e?.text?.value&&n.push(e.text.value)}}if(n.length)return n.join(`

`)}catch(e){console.warn(`[GPT] Error extracting text:`,e)}return null},i=r(n);if(console.log(`[GPT] Extracted text result:`,i?`"${i.substring(0,100)}..."`:`null`),i!=null)return JSON.stringify({choices:[{message:{content:i}}],usage:n?.usage||{},id:this.responseId,object:`chat.completion`});try{let e=t.parse(n?.output??n);if(e)return JSON.stringify({choices:[{message:{content:typeof e==`string`?e:JSON.stringify(e)}}],usage:n?.usage||{},id:this.responseId,object:`chat.completion`})}catch{}return JSON.stringify({choices:[{message:{content:`No text content available`}}],usage:{},id:this.responseId,object:`chat.completion`})}async modifyExistingData(e,t,n=[]){try{this.setContext({operation:`modify`,existingData:e}),await this.giveForRequest(d),await this.giveForRequest(`existing_entity: \`${Q(e)}\`\n`),n.length&&await this.giveForRequest(u(n)),await this.askToDoAction(t);let r=v(await this.sendRequest(`high`,`medium`,null,{responseFormat:`json`,temperature:.2}));return r.ok?{ok:!0,data:r.data?.modified_entity||r.data,responseId:this.responseId}:(console.warn(`JSON extraction failed:`,r.error,`Raw:`,r.raw),{ok:!1,error:r.error||`Failed to parse AI response`})}catch(e){return console.error(`Error in modifyExistingData:`,e),{ok:!1,error:String(e)}}}async selectAndFilterData(e,t,n=[]){try{this.setContext({operation:`extract`,filters:t,searchTerms:n}),await this.giveForRequest(f),await this.giveForRequest(`data_set: \`${Q(e)}\`\n`);let r=t.map(e=>`Filter: ${e.field} ${e.operator} ${JSON.stringify(e.value)}`).join(`
`);await this.askToDoAction(`
Select items from the provided data set matching these criteria:
${r}
${n.length?`\nSearch terms: ${n.join(`, `)}`:``}

Return matching items with relevance scores.
            `);let i=v(await this.sendRequest(`medium`,`low`,null,{responseFormat:`json`,temperature:.1}));return i.ok?{ok:!0,data:i.data?.selected_items||i.data,responseId:this.responseId}:(console.warn(`JSON extraction failed:`,i.error,`Raw:`,i.raw),{ok:!1,error:i.error||`Failed to parse AI response`})}catch(e){return console.error(`Error in selectAndFilterData:`,e),{ok:!1,error:String(e)}}}async mergeEntities(e,t,n=`prefer_primary`){try{this.setContext({operation:`merge`,existingData:e}),await this.giveForRequest(p),await this.giveForRequest(`primary_entity: \`${Q(e)}\`\n`),await this.giveForRequest(`secondary_data: \`${Q(t)}\`\n`),await this.askToDoAction(`
Merge the secondary data into the primary entity using "${n}" strategy:
- prefer_primary: Keep primary values when conflicts occur
- prefer_secondary: Use secondary values when conflicts occur
- prefer_newer: Compare timestamps and use newer values
- merge_all: Combine all unique values (arrays concatenated, objects deeply merged)

Return the merged entity with conflict resolution details.
            `);let r=v(await this.sendRequest(`high`,`medium`,null,{responseFormat:`json`,temperature:.2}));return r.ok?{ok:!0,data:r.data?.merged_entity||r.data,responseId:this.responseId}:(console.warn(`JSON extraction failed:`,r.error,`Raw:`,r.raw),{ok:!1,error:r.error||`Failed to parse AI response`})}catch(e){return console.error(`Error in mergeEntities:`,e),{ok:!1,error:String(e)}}}async searchSimilar(e,t,n=.7){try{this.setContext({operation:`analyze`}),await this.giveForRequest(`reference_entity: \`${Q(e)}\`\n`),await this.giveForRequest(`candidate_set: \`${Q(t)}\`\n`),await this.askToDoAction(`
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
            `);let r=v(await this.sendRequest(`medium`,`medium`,null,{responseFormat:`json`,temperature:.3}));return r.ok?{ok:!0,data:r.data?.similar_items||[],responseId:this.responseId}:(console.warn(`JSON extraction failed:`,r.error,`Raw:`,r.raw),{ok:!1,error:r.error||`Failed to parse AI response`})}catch(e){return console.error(`Error in searchSimilar:`,e),{ok:!1,error:String(e)}}}async batchProcess(e,t,n=10){let r=[],i=[];for(let a=0;a<e.length;a+=n){let o=e.slice(a,a+n);await this.giveForRequest(`batch_items: \`${Q(o)}\`\n`),await this.askToDoAction(`
Process this batch of ${o.length} items:
${t}

Return processed items in same order.
Expected output: { "processed": [...], "failed": [...] }
            `);let s=await this.sendRequest(`medium`,`low`,null,{responseFormat:`json`});if(s){let e=v(s);e.ok&&e.data?(r.push(...e.data?.processed||[]),e.data?.failed?.length&&i.push(...e.data.failed.map(e=>e?.error||`Unknown error`))):console.warn(`Batch parsing failed:`,e.error)}}return{ok:i.length===0,data:r,error:i.length?i.join(`; `):void 0,responseId:this.responseId}}clearPending(){return this.pending.splice(0,this.pending.length),this}getResponseId(){return this?.responseId}getMessages(){return this?.messages}getPending(){return this?.pending}getContext(){return this?.context}getResponse(e){return this?.responseMap?.get?.(e)}},Ie=(e,t,n)=>new Fe(e,t||`https://api.proxyapi.ru/openai/v1`,``,n||`gpt-5.6-luna`),Le=e=>{if(!Array.isArray(e))return[];let t=[];for(let n of e){let e=n;if(!e||typeof e!=`object`)continue;let r=String(e?.origin||``).trim(),i=String(e?.clientKey||``).trim(),a=String(e?.secretKey||``).trim();if(!r||!i||!a)continue;let o=String(e?.serverLabel||e?.label||r).trim()||r;t.push({id:String(e?.id||r),serverLabel:o,origin:r,clientKey:i,secretKey:a})}return t},Re=async(e,t)=>{let n=Le(t);if(n.length)for(let t of n)await e.useMCP(t.serverLabel,t.origin,t.clientKey,t.secretKey)},ze=(e,t)=>{let n=String(e||``).trim(),r=String(t||``).trim();return n===`custom`?r||`gpt-5.6-luna`:n||r||`gpt-5.6-luna`},Be=async e=>{let t=await r(),n=e?.apiKey||t?.ai?.apiKey;if(!n)return null;let i=Ie(n,e?.baseUrl||t?.ai?.baseUrl||`https://api.proxyapi.ru/openai/v1`,ze(e?.model||t?.ai?.model,e?.customModel||t?.ai?.customModel));return await Re(i,e?.mcp??t?.ai?.mcp),i};function Ve(e){if(!e)return e;let t=e.trim().match(/^```(?:katex|md|markdown|html|xml|json|text)?\n([\s\S]*?)\n```$/);if(t){let n=t[1].trim(),r=n.split(`
`);return r.length===1||n.includes(`<math`)||n.includes(`<span class="katex`)||n.includes(`<content`)||n.startsWith(`<`)&&n.endsWith(`>`)||/^\s*<[^>]+>/.test(n)?n:r.length>3||r.some(e=>e.match(/^\s{4,}/)||e.includes(`function`)||e.includes(`const `)||e.includes(`let `))?e:n}return e}function He(e){return e instanceof File&&e.type.startsWith(`image/`)||e instanceof Blob&&e.type?.startsWith(`image/`)||typeof e==`string`&&(e.startsWith(`data:image/`)||e.startsWith(`http`)||e.startsWith(`https://`))}function Ue(e){return[`json`,`xml`,`yaml`].includes(e)?`json`:`text`}var We=e({extractEntities:()=>Ge}),Ge=async(e,t)=>{try{let r=await Be(t);if(!r)return{ok:!1,error:`No GPT instance`};let i=typeof e==`string`?s(e):(e instanceof File||e instanceof Blob)&&e.type.startsWith(`image/`)?`input_image`:`input_text`;Array.isArray(e)&&(e?.[0]?.type===`message`||e?.[0]?.role)?await r?.getPending?.()?.push?.(...e):await r?.attachToRequest?.(e,i),await r.askToDoAction(n);let a=await r.sendRequest(`high`,`medium`,null,{responseFormat:`json`,temperature:.2});if(!a)return{ok:!1,error:`No response`};let o=v(a);return o.ok?{ok:!0,data:o.data?.entities||[],responseId:r.getResponseId()}:{ok:!1,error:o.error||`Failed to parse AI response`}}catch(e){return{ok:!1,error:String(e)}}};export{Ve as a,He as i,Be as n,v as o,Ue as r,We as t};