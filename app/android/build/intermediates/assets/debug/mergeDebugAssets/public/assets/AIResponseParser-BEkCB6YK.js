import{C as e}from"./src-_S6Dc7FO.js";var t=[/```json\s*\n?([\s\S]*?)\n?```/i,/```toon\s*\n?([\s\S]*?)\n?```/i,/```\s*\n?([\s\S]*?)\n?```/,/(\{[\s\S]*\})/,/(\[[\s\S]*\])/],n=e=>!e||typeof e!=`string`?``:e.replace(/^\uFEFF/,``).replace(/[\u200B-\u200D\uFEFF]/g,``).replace(/\r\n/g,`
`).replace(/\r/g,`
`).trim(),r=e=>{let t=e;return t=t.replace(/,(\s*[}\]])/g,`$1`),t=t.replace(/:\s*"([^"]*)\n([^"]*)"/g,(e,t,n)=>`: "${t}\\n${n}"`),t=t.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g,``),t},i=t=>{if(!t)return{ok:!1,error:`Empty input`};try{return{ok:!0,data:e.parse(t)}}catch{}try{return{ok:!0,data:JSON.parse(t)}}catch{}try{let n=r(t);return{ok:!0,data:e.parse(n)}}catch{}try{let n=t.match(/^[^{[]*([{\[][\s\S]*[}\]])[^}\]]*$/);if(n?.[1])return{ok:!0,data:e.parse(n[1])}}catch{}return{ok:!1,error:`Failed to parse JSON with all strategies`}},a=e=>{if(e==null)return{ok:!1,error:`Response is null or undefined`};if(typeof e!=`string`)return typeof e==`object`?{ok:!0,data:e,source:`direct`}:{ok:!1,error:`Expected string, got ${typeof e}`};let a=n(e);if(!a)return{ok:!1,error:`Response is empty after cleaning`,raw:e};let o=i(a);if(o.ok)return{ok:!0,data:o.data,raw:e,source:`direct`};for(let r of t){let t=a.match(r);if(t?.[1]){let r=i(n(t[1]));if(r.ok)return{ok:!0,data:r.data,raw:e,source:`markdown_block`}}}let s=a.match(/(\{[\s\S]+\}|\[[\s\S]+\])/);if(s?.[1]){let t=i(r(s[1]));if(t.ok)return{ok:!0,data:t.data,raw:e,source:`recovered`}}return{ok:!1,error:`Could not extract valid JSON from response`,raw:e}},o=`
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
`;export{a as n,o as t};