import{n as e}from"./rolldown-runtime-DaJ6WEGw.js";import{J as t,Y as n}from"./src-CXiRKMoF.js";var r,i,a,o,s,c,l=e((()=>{n(),r=[/```json\s*\n?([\s\S]*?)\n?```/i,/```toon\s*\n?([\s\S]*?)\n?```/i,/```\s*\n?([\s\S]*?)\n?```/,/(\{[\s\S]*\})/,/(\[[\s\S]*\])/],i=e=>!e||typeof e!=`string`?``:e.replace(/^\uFEFF/,``).replace(/[\u200B-\u200D\uFEFF]/g,``).replace(/\r\n/g,`
`).replace(/\r/g,`
`).trim(),a=e=>{let t=e;return t=t.replace(/,(\s*[}\]])/g,`$1`),t=t.replace(/:\s*"([^"]*)\n([^"]*)"/g,(e,t,n)=>`: "${t}\\n${n}"`),t=t.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g,``),t},o=e=>{if(!e)return{ok:!1,error:`Empty input`};try{return{ok:!0,data:t.parse(e)}}catch{}try{return{ok:!0,data:JSON.parse(e)}}catch{}try{let n=a(e);return{ok:!0,data:t.parse(n)}}catch{}try{let n=e.match(/^[^{[]*([{\[][\s\S]*[}\]])[^}\]]*$/);if(n?.[1])return{ok:!0,data:t.parse(n[1])}}catch{}return{ok:!1,error:`Failed to parse JSON with all strategies`}},s=e=>{if(e==null)return{ok:!1,error:`Response is null or undefined`};if(typeof e!=`string`)return typeof e==`object`?{ok:!0,data:e,source:`direct`}:{ok:!1,error:`Expected string, got ${typeof e}`};let t=i(e);if(!t)return{ok:!1,error:`Response is empty after cleaning`,raw:e};let n=o(t);if(n.ok)return{ok:!0,data:n.data,raw:e,source:`direct`};for(let n of r){let r=t.match(n);if(r?.[1]){let t=i(r[1]),n=o(t);if(n.ok)return{ok:!0,data:n.data,raw:e,source:`markdown_block`}}}let s=t.match(/(\{[\s\S]+\}|\[[\s\S]+\])/);if(s?.[1]){let t=a(s[1]),n=o(t);if(n.ok)return{ok:!0,data:n.data,raw:e,source:`recovered`}}return{ok:!1,error:`Could not extract valid JSON from response`,raw:e}},c=`
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
`}));export{s as n,l as r,c as t};