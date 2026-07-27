var e=(e,t)=>t?.trim()?`${e}

---

USER CUSTOM INSTRUCTIONS:
${t.trim()}

---

Apply the user's custom instructions above when processing the data. Prioritize user instructions when they conflict with default behavior.
`:e,t=`
---

GRAPHICS GENERATION (when applicable):
When the problem involves functions, graphs, geometric shapes, diagrams, or data that can be visualized:

Generate inline SVG as Markdown image with data URI:
![<title>](data:image/svg+xml,<encodeURIComponent_encoded_svg>)

SVG Requirements:
- Use encodeURIComponent() encoding for the entire SVG string
- viewBox="0 0 400 300" (or appropriate dimensions)
- Colors: #3b82f6 (blue), #10b981 (green), #f59e0b (orange), #ef4444 (red)
- Include axis labels, tick marks, and legends
- Use <text> elements for annotations
- Keep SVG minimal but informative

Apply to:
• Function graphs: f(x), parametric, polar
• Geometric constructions and proofs
• Data visualizations and charts
• Diagrams and flowcharts
• Coordinate systems and number lines

Always include both the mathematical solution AND the visualization.
`,n=()=>`ci_${Date.now()}_${Math.random().toString(36).slice(2,8)}`,r={auto:``,follow:`

IMPORTANT: Follow the language of the source/context data. Preserve the original language unless explicitly asked to translate or change language.`,en:`

IMPORTANT: Respond in English. All explanations, answers, and comments must be in English.`,ru:`

ВАЖНО: Отвечай на русском языке. Все объяснения, ответы и комментарии должны быть на русском языке.`},i=`

Additionally, translate the recognized content to the response language if it differs from the source.`;function a(e){return e===`auto`||e===void 0?``:{auto:``,markdown:`

Output the result in GitHub-compatible Markdown.

Markdown structure:
- Use headings for structure:
  - Main sections: start from ### (H3) minimum
  - Subsections: #### / ##### when needed
- Avoid long paragraphs: prefer lists and sub-lists.

KaTeX / math:
- Prefer inline formulas: $...$
- Avoid $$...$$ blocks; only use block math if strictly necessary.
  - Prefer block math as \\[ ... \\] instead of $$...$$.
- Inside KaTeX, write a vertical bar as \\| (example: $A \\| B$).

Tables:
- Use strict GitHub Markdown table syntax.
- Inside table cells:
  - Use <br> for line breaks (no real newlines inside cells).
  - If source data uses ';' as a separator, replace ';' with <br>.

Colon formatting:
- For "key: value" style lines, make the part before ':' bold:
  - **Key**: value`,html:`

Output the result in HTML format.`,json:`

Output the result as valid JSON.`,text:`

Output the result as plain text.`,typescript:`

Output the result as TypeScript code.`,javascript:`

Output the result as JavaScript code.`,python:`

Output the result as Python code.`,java:`

Output the result as Java code.`,cpp:`

Output the result as C++ code.`,csharp:`

Output the result as C# code.`,php:`

Output the result as PHP code.`,ruby:`

Output the result as Ruby code.`,go:`

Output the result as Go code.`,rust:`

Output the result as Rust code.`,xml:`

Output the result as XML.`,yaml:`

Output the result as YAML.`,css:`

Output the result as CSS.`,scss:`

Output the result as SCSS.`,"most-suitable":`

Choose the most suitable output format for the content and task.`,"most-optimized":`

Choose the most optimized output format for clarity and usability.`,"most-legibility":`

Choose the most legible output format for human readability.`}[e]||``}function o(e){return e===`markdown`?`Extract all readable text, equations, and data from this image. Focus on accuracy and completeness. Format the extracted content as clean Markdown.`:e===`html`?`Extract all readable text, equations, and data from this image. Focus on accuracy and completeness. Format the extracted content as semantic HTML.`:e===`text`?`Extract all readable text, equations, and data from this image. Focus on accuracy and completeness. Extract as plain text only.`:e===`most-suitable`?`Analyze this image and extract all readable content in the most appropriate format for further processing.`:e===`most-optimized`?`Extract content from this image in the most efficient format for token usage and processing.`:e===`most-legibility`?`Extract content from this image with maximum legibility and human readability.`:`Extract all readable text, equations, and data from this image. Focus on accuracy and completeness. Format appropriately for the content type.`}export{n as a,e as i,t as n,o,i as r,a as s,r as t};