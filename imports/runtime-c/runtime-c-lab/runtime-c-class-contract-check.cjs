#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
function readText(p){ try { return fs.readFileSync(p,"utf8"); } catch { return ""; } }
function readJson(p, d=null){ try { return JSON.parse(readText(p)); } catch { return d; } }
function writeJson(p,o){ fs.mkdirSync(path.dirname(p),{recursive:true}); fs.writeFileSync(p, JSON.stringify(o,null,2)+"\n"); }
function uniq(a){ return [...new Set(a.filter(Boolean))]; }
function ignoreClass(x){
  x=String(x||"");
  return x==="fas" || x==="fab" || x==="far" || x==="fal" || x==="fad" ||
         x.startsWith("fa-") ||
         x==="unsplash" || x==="com";
}
function htmlClasses(html){
  return uniq([...String(html).matchAll(/class\s*=\s*["']([^"']+)["']/g)]
    .flatMap(m => m[1].split(/\s+/).map(x => x.trim()).filter(Boolean)));
}
function cssClasses(css){
  const out = [];
  for (const m of String(css).matchAll(/\.(-?[_a-zA-Z]+[_a-zA-Z0-9-]*)/g)) out.push(m[1]);
  return uniq(out);
}
const args = process.argv.slice(2);
if (args.length < 2) {
  console.error("usage: runtime-c-class-contract-check.cjs <artifact_dir> <out_json> [buildsheet_json]");
  process.exit(2);
}
const artifactDir = args[0];
const outPath = args[1];
const buildsheetPath = args[2] || "";
const buildsheet = buildsheetPath ? readJson(buildsheetPath, {}) : {};
function findOne(names){
  for (const n of names) {
    const p = path.join(artifactDir, n);
    if (fs.existsSync(p)) return p;
  }
  return path.join(artifactDir, names[0]);
}
const htmlPath = findOne(["index.html","output/index.html","ui-1/index.html","merged_product/output/ui-1/index.html","merged_product/output/index.html"]);
const cssPath  = findOne(["styles.css","output/styles.css","ui-1/styles.css","merged_product/output/ui-1/styles.css","merged_product/output/styles.css"]);
const htxt = readText(htmlPath);
const ctxt = readText(cssPath);
const h = htmlClasses(htxt).filter(x=>!ignoreClass(x));
const c = cssClasses(ctxt).filter(x=>!ignoreClass(x));
const missing = h.filter(x => !c.includes(x));
const extraCss = c.filter(x => !h.includes(x));
const matched = h.length - missing.length;
const pct = h.length ? Math.round((matched / h.length) * 100) : 100;
const declared = Array.isArray(buildsheet.class_contract)
  ? buildsheet.class_contract
  : Array.isArray(buildsheet.shared_context?.class_contract)
    ? buildsheet.shared_context.class_contract
    : [];
const missingDeclaredInHtml = declared.filter(x => !h.includes(x));
const missingDeclaredInCss = declared.filter(x => !c.includes(x));
const report = {
  schema_version: "factory67.runtime_c.class_contract_check.v1",
  artifact_dir: artifactDir,
  html_artifact: htmlPath,
  css_artifact: cssPath,
  html_exists: fs.existsSync(htmlPath),
  css_exists: fs.existsSync(cssPath),
  html_bytes: Buffer.byteLength(htxt),
  css_bytes: Buffer.byteLength(ctxt),
  html_class_count: h.length,
  css_class_count: c.length,
  matched,
  missing,
  extra_css_selectors: extraCss,
  coverage_pct: pct,
  declared_class_contract: declared,
  declared_count: declared.length,
  missing_declared_in_html: missingDeclaredInHtml,
  missing_declared_in_css: missingDeclaredInCss,
  ok: pct >= 85 && missingDeclaredInHtml.length === 0 && missingDeclaredInCss.length === 0,
  generated_at: new Date().toISOString()
};
writeJson(outPath, report);
console.log(JSON.stringify(report,null,2));
process.exit(report.ok ? 0 : 1);
