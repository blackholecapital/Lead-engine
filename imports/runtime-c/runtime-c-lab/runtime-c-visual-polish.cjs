#!/usr/bin/env node
const fs=require("fs"), path=require("path");

const root=process.argv[2];
if(!root) process.exit(2);

const out=path.join(root,"output");
const htmlPath=path.join(out,"index.html");
const cssPath=path.join(out,"styles.css");
const eventLog=path.join(root,"EVENT_LOG.jsonl");

const read=p=>{try{return fs.readFileSync(p,"utf8")}catch{return ""}};
const emit=(extra={})=>{
  fs.appendFileSync(eventLog,JSON.stringify({
    ts:new Date().toISOString(),
    event:"VISUAL_POLISH",
    ...extra
  })+"\n");
};

let html=read(htmlPath);
let css=read(cssPath);

// sanitize accidental markdown fences from model CSS
css = css
  .replace(/^```(?:css)?\s*/i, "")
  .replace(/\s*```\s*$/i, "");
fs.writeFileSync(cssPath, css);

if(!html || !css){
  emit({status:"SKIP",reason:"missing html/css"});
  process.exit(0);
}

const tokenUses=(css.match(/var\(--/g)||[]).length;
const needsTokens=!/:root\s*\{/.test(css) || tokenUses<12;

let patch="";

if(needsTokens){
patch+=`
/* Runtime-C generic token enrichment */
:root {
  --color-bg: #0f172a;
  --color-surface: #111827;
  --color-surface-2: #1f2937;
  --color-primary: #6366f1;
  --color-accent: #14b8a6;
  --color-success: #22c55e;
  --color-warning: #f59e0b;
  --color-danger: #ef4444;
  --color-text: #f8fafc;
  --color-muted: #94a3b8;
  --color-border: rgba(148,163,184,.22);
  --space-1: .25rem;
  --space-2: .5rem;
  --space-3: .75rem;
  --space-4: 1rem;
  --space-5: 1.5rem;
  --space-6: 2rem;
  --radius-sm: .375rem;
  --radius-md: .75rem;
  --radius-lg: 1rem;
  --radius-xl: 1.5rem;
  --shadow-sm: 0 1px 2px rgba(0,0,0,.16);
  --shadow-md: 0 12px 30px rgba(15,23,42,.22);
  --shadow-lg: 0 22px 60px rgba(15,23,42,.34);
  --font-sm: .875rem;
  --font-base: 1rem;
  --font-lg: 1.125rem;
  --font-xl: 1.35rem;
  --font-2xl: 1.75rem;
}
`;
}

patch+=`
/* Runtime-C generic visual polish */
body {
  background: var(--color-bg);
  color: var(--color-text);
  font-size: var(--font-base);
}

main, section, article, aside, header, nav, form, table,
[class*="card"], [class*="panel"], [class*="widget"], [class*="table"], [class*="detail"] {
  box-sizing: border-box;
}

section, article, [class*="card"], [class*="panel"], [class*="widget"], [class*="detail"] {
  border-radius: var(--radius-lg);
}

button, input, select, textarea {
  font: inherit;
}

button, [role="button"] {
  border-radius: var(--radius-md);
  transition: transform .16s ease, box-shadow .16s ease, background .16s ease;
}

button:hover, [role="button"]:hover {
  transform: translateY(-1px);
}

input, select, textarea {
  border-radius: var(--radius-md);
}

table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
}

th, td {
  padding: var(--space-3);
}

@media (max-width: 900px) {
  main, section, article, aside, header, nav {
    max-width: 100%;
  }
}
`;

fs.appendFileSync(cssPath,"\n"+patch+"\n");

emit({status:"PASS",patched:true,token_fallback:needsTokens});
console.log("PASS runtime-c-visual-polish");
