#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const groupDir = process.argv[2];
const intervalMs = Number(process.argv[3] || 3000);
if (!groupDir) { console.error("usage: runtime-c-handoff-watch.cjs <group_dir> [interval_ms]"); process.exit(2); }
const handoff = path.join(groupDir, "handoff");
fs.mkdirSync(handoff, {recursive:true});
function readText(p){ try { return fs.readFileSync(p,"utf8"); } catch { return ""; } }
function readJson(p,d=null){ try { return JSON.parse(readText(p)); } catch { return d; } }
function writeJson(p,o){ fs.mkdirSync(path.dirname(p),{recursive:true}); fs.writeFileSync(p, JSON.stringify(o,null,2)+"\n"); }
function uniq(a){ return [...new Set(a.filter(Boolean))]; }
function htmlClasses(html){ return uniq([...String(html).matchAll(/class\s*=\s*["']([^"']+)["']/g)].flatMap(m => m[1].split(/\s+/).map(x => x.trim()).filter(Boolean))); }
function cssClasses(css){ return uniq([...String(css).matchAll(/\.(-?[_a-zA-Z]+[_a-zA-Z0-9-]*)/g)].map(m => m[1])); }
function findFiles(names){
  const out = [];
  function walk(d, depth=0) {
    if (depth > 7) return;
    let ents = [];
    try { ents = fs.readdirSync(d,{withFileTypes:true}); } catch { return; }
    for (const e of ents) {
      const p = path.join(d,e.name);
      if (e.isDirectory()) walk(p, depth+1);
      else if (names.includes(e.name)) out.push(p);
    }
  }
  walk(groupDir);
  return out.sort((a,b) => fs.statSync(b).mtimeMs - fs.statSync(a).mtimeMs);
}
function newest(name){ return findFiles([name])[0] || ""; }
function tick(){
  const htmlPath = newest("index.html");
  const cssPath = newest("styles.css");
  const html = htmlPath ? readText(htmlPath) : "";
  const css = cssPath ? readText(cssPath) : "";
  const h = htmlClasses(html);
  const c = cssClasses(css);
  const missing = h.filter(x => !c.includes(x));
  const pct = h.length ? Math.round(((h.length-missing.length)/h.length)*100) : 100;
  const laneReports = findFiles(["lane_cell_report.json"]).map(p => readJson(p,{}));
  const waDone = laneReports.some(r => String(r.lane_id||"").toUpperCase() === "WA" && (r.ok === true || /pass|ok/i.test(String(r.status||r.verdict||""))));
  const manifest = {
    schema_version: "factory67.runtime_c.streaming_class_manifest.v1",
    mode: waDone ? "final-ish" : "partial",
    group_dir: groupDir,
    html_artifact: htmlPath || null,
    html_exists: !!htmlPath,
    html_bytes: Buffer.byteLength(html),
    html_classes: h,
    html_class_count: h.length,
    wa_done: waDone,
    generated_at: new Date().toISOString()
  };
  const coverage = {
    schema_version: "factory67.runtime_c.streaming_css_coverage.v1",
    group_dir: groupDir,
    html_artifact: htmlPath || null,
    css_artifact: cssPath || null,
    html_class_count: h.length,
    css_class_count: c.length,
    matched: h.length - missing.length,
    missing,
    coverage_pct: pct,
    generated_at: new Date().toISOString()
  };
  writeJson(path.join(handoff, "CLASS_MANIFEST.partial.json"), manifest);
  writeJson(path.join(handoff, "CSS_COVERAGE.partial.json"), coverage);
  if (waDone) {
    writeJson(path.join(handoff, "CLASS_MANIFEST.final.json"), manifest);
    fs.writeFileSync(path.join(handoff, "HTML_FINAL_READY"), new Date().toISOString()+"\n");
  }
  fs.writeFileSync(path.join(handoff, "WATCH_HEARTBEAT"), new Date().toISOString()+"\n");
  console.log(JSON.stringify({ts:new Date().toISOString(), group_dir:groupDir, html:htmlPath, css:cssPath, html_classes:h.length, coverage_pct:pct, missing_count:missing.length, wa_done:waDone}));
}
tick();
setInterval(tick, intervalMs);
