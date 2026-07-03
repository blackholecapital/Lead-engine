#!/usr/bin/env node
const fs=require("fs"), path=require("path");
const [,,a,b]=process.argv;
if(!a||!b){console.error("usage: runtime-c-compare-runs.cjs <run_a> <run_b>");process.exit(2);}
const read=(root,f,d=null)=>fs.existsSync(path.join(root,f))?JSON.parse(fs.readFileSync(path.join(root,f),"utf8")):d;
const metric=(root,f)=>fs.existsSync(path.join(root,f))?fs.statSync(path.join(root,f)).size:0;
const row=root=>({
  run:path.basename(root),
  state:read(root,"RUN_STATE.json",{})?.state||"UNKNOWN",
  status:read(root,"RUN_STATE.json",{})?.status||"UNKNOWN",
  coverage:read(root,"CLASS_COVERAGE_GATE.json",{})?.coverage_pct ?? null,
  html_bytes:metric(root,"output/index.html"),
  css_bytes:metric(root,"output/styles.css"),
  js_bytes:metric(root,"output/app.js")
});
const out={status:"PASS",a:row(a),b:row(b),generated_at:new Date().toISOString()};
console.log(JSON.stringify(out,null,2));
