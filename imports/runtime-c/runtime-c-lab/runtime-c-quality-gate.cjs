#!/usr/bin/env node
const fs=require("fs"), path=require("path");

const root=process.argv[2] || ".";
const out=path.join(root,"output");
const report=path.join(root,"QUALITY_GATE.json");

const read=p=>fs.existsSync(p)?fs.readFileSync(p,"utf8"):"";
const htmlFiles=fs.existsSync(out)
  ? fs.readdirSync(out).filter(f=>f.endsWith(".html"))
  : [];

const html=htmlFiles.map(f=>read(path.join(out,f))).join("\n");
const css=read(path.join(out,"styles.css"));
const js=read(path.join(out,"app.js"));

const scrub=x=>String(x||"")
  .replace(/placeholder=["'][^"']*["']/gi,"")
  .replace(/placeholder\s*[:=]\s*["'][^"']*["']/gi,"")
  .replace(/::placeholder/g,"");

const combined=scrub(html+"\n"+css+"\n"+js).toLowerCase();

const metrics={
  html_bytes:html.length,
  css_bytes:css.length,
  js_bytes:js.length,
  sections:(html.match(/<section\b/gi)||[]).length,
  buttons:(html.match(/<button\b/gi)||[]).length,
  forms:(html.match(/<form\b/gi)||[]).length,
  event_listeners:(js.match(/addEventListener/g)||[]).length,
  query_hooks:(js.match(/querySelector/g)||[]).length + (js.match(/getElementById/g)||[]).length,
  external_urls:(combined.match(/https?:\/\//g)||[]).length
};

const warnings=[];

if(metrics.html_bytes<4000) warnings.push("HTML_TOO_SMALL");
if(metrics.css_bytes<3500) warnings.push("CSS_TOO_SMALL");
if(metrics.js_bytes<1500) warnings.push("JS_TOO_SMALL");
if(metrics.sections<5) warnings.push("TOO_FEW_SECTIONS");
if((metrics.buttons+metrics.forms)<3) warnings.push("TOO_FEW_INTERACTIONS");

const banned=["lorem ipsum","todo","placeholder"];
for(const term of banned){
  if(combined.includes(term)) warnings.push("BANNED_CONTENT_"+term.replace(/\s+/g,"_"));
}

const tokenNames=[
 "--color-bg","--color-surface","--color-primary","--color-accent","--color-text","--color-muted","--color-border",
 "--space-1","--space-2","--space-3","--radius-sm","--radius-md","--shadow","--font"
];

const missingTokens=tokenNames.filter(t=>!css.includes(t));
if(missingTokens.length) warnings.push("MISSING_DESIGN_TOKENS_"+missingTokens.join(","));

const status=warnings.length?"FAIL":"PASS";
fs.writeFileSync(report,JSON.stringify({status,metrics,warnings},null,2)+"\n");

if(status==="FAIL"){
  console.error("FAIL runtime-c-quality-gate",warnings.join(","));
  process.exit(1);
}

console.log("PASS runtime-c-quality-gate clean");
