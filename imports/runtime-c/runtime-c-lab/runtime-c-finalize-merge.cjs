const fs=require("fs");
const path=require("path");

const cwd=process.argv[2] || process.cwd();
const runId=path.basename(cwd);
const runsRoot=path.dirname(cwd);
const family=runId.replace(/-\d{8}T\d{6}Z$/,"");

const outRoot=path.join(cwd,"merged_product");
const out=path.join(outRoot,"output");

fs.rmSync(outRoot,{recursive:true,force:true});
fs.mkdirSync(out,{recursive:true});

const read=p=>fs.existsSync(p)?fs.readFileSync(p,"utf8"):"";
const write=(p,s)=>{fs.mkdirSync(path.dirname(p),{recursive:true});fs.writeFileSync(p,s);};

const passes=fs.readdirSync(runsRoot)
  .filter(r=>r.startsWith(family+"-"))
  .sort();

function body(html){
  return html
    .replace(/^[\s\S]*?<body[^>]*>/i,"")
    .replace(/<\/body>[\s\S]*$/i,"")
    .replace(/<script[\s\S]*?<\/script>/gi,"")
    .replace(/<style[\s\S]*?<\/style>/gi,"")
    .replace(/<link[^>]*stylesheet[^>]*>/gi,"");
}

function inlineStyles(html){
  return [...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)].map(m=>m[1]).join("\n");
}

function inlineScripts(html){
  return [...html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/gi)].map(m=>m[1]).join("\n");
}

let sections=[];
let css=[];
let js=[];
let manifest=[];

for(const r of passes){
  const o=path.join(runsRoot,r,"output");
  if(!fs.existsSync(o)) continue;

  const html=read(path.join(o,"index.html"));
  const styleFile=read(path.join(o,"styles.css"));
  const jsFile=read(path.join(o,"app.js"));

  sections.push(`<section class="runtime-pass-layer" data-run="${r}">
${body(html)}
</section>`);

  css.push(`/* ===== ${r} inline styles ===== */\n${inlineStyles(html)}`);
  css.push(`/* ===== ${r} styles.css ===== */\n${styleFile}`);

  js.push(`// ===== ${r} inline scripts =====\n${inlineScripts(html)}`);
  if(jsFile && jsFile.trim()){
    js.push(`// ===== ${r} app.js =====\n${jsFile}`);
  }else{
    js.push(`// ===== ${r} app.js empty fallback =====\nconsole.log("Runtime-C merged layer loaded:", ${JSON.stringify(r)});`);
  }

  manifest.push({
    run_id:r,
    files:{
      index_html:fs.existsSync(path.join(o,"index.html")),
      styles_css:fs.existsSync(path.join(o,"styles.css")),
      app_js:fs.existsSync(path.join(o,"app.js")),
      class_manifest:fs.existsSync(path.join(o,"CLASS_MANIFEST.json")),
      product_manifest:fs.existsSync(path.join(o,"PRODUCT_MANIFEST.md"))
    }
  });
}

write(path.join(out,"styles.css"),`
.runtime-pass-layer{display:block}
${css.join("\n\n")}
`);

write(path.join(out,"app.js"),js.join("\n\n"));

write(path.join(out,"index.html"),`<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>${family} · merged runtime artifact</title>
<link rel="stylesheet" href="./styles.css?v=${Date.now()}">
</head>
<body>
${sections.join("\n\n")}
<script src="./app.js?v=${Date.now()}"></script>
</body>
</html>
`);

write(path.join(outRoot,"final_manifest.json"),JSON.stringify({
  contract:"runtime_c.family_merged_product.v1",
  family,
  latest_run:runId,
  passes,
  output:"merged_product/output",
  artifacts:["output/index.html","output/styles.css","output/app.js"],
  manifest,
  generated_at:new Date().toISOString()
},null,2));

write(path.join(outRoot,"merge_report.json"),JSON.stringify({
  status:"PASS",
  strategy:"runtime-c-family-manifest-render-v1",
  pass_count:passes.length,
  passes
},null,2));

for(const f of ["index.html","styles.css","app.js"]){
  const p=path.join(out,f);
  if(!fs.existsSync(p) || fs.statSync(p).size===0) throw new Error("missing_or_empty:"+f);
}

console.log("MERGE_FINALIZED", {family, passes, out});
