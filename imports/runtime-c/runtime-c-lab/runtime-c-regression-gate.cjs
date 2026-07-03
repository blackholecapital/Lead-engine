#!/usr/bin/env node
const fs=require("fs"), path=require("path");

const run=process.argv[2];
if(!run) throw new Error("usage: runtime-c-regression-gate.cjs <run_root>");

const readJson=(p)=>{try{return JSON.parse(fs.readFileSync(p,"utf8"));}catch{return null;}};
const full=readJson(path.join(run,"buildsheet.full.json"))||{};
const lineage=readJson(path.join(run,"LINEAGE.json"))||{};

const childOut=path.join(run,"output");
const childHtml=path.join(childOut,"index.html");

const parentOut =
  lineage.copied_from ||
  full?.parent_context?.source_output ||
  full?.inherits_from?.parent_output_path ||
  full?.parent?.output ||
  null;

if(String(full.mode||full.workflow||"")!=="iteration_pass"){
  fs.writeFileSync(path.join(run,"REGRESSION_GATE.json"),JSON.stringify({
    status:"PASS",
    reason:"initial_build_no_parent_required"
  },null,2)+"\n");
  console.log("REGRESSION_GATE_PASS initial_build");
  process.exit(0);
}

if(!parentOut) throw new Error("REGRESSION_GATE_PARENT_OUTPUT_MISSING");

const parentHtml=path.join(parentOut,"index.html");
if(!fs.existsSync(parentHtml)) throw new Error(`REGRESSION_GATE_PARENT_HTML_MISSING ${parentHtml}`);
if(!fs.existsSync(childHtml)) throw new Error(`REGRESSION_GATE_CHILD_HTML_MISSING ${childHtml}`);

const parent=fs.readFileSync(parentHtml,"utf8");
const child=fs.readFileSync(childHtml,"utf8");

function classes(html){
  const out=new Set();
  for(const m of html.matchAll(/class=["']([^"']+)["']/g)){
    for(const c of m[1].split(/\s+/).map(x=>x.trim()).filter(Boolean)) out.add(c);
  }
  return [...out].sort();
}

const pc=classes(parent);
const cc=new Set(classes(child));
const removed=pc.filter(c=>!cc.has(c));

const report={
  status:removed.length ? "FAIL" : "PASS",
  parent_run: lineage.parent_run || full?.inherits_from?.parent_run_id || full?.parent_context?.source_run_id || null,
  parent_output: parentOut,
  child_run:path.basename(run),
  parent_bytes:parent.length,
  child_bytes:child.length,
  removed_classes:removed
};

fs.writeFileSync(path.join(run,"REGRESSION_GATE.json"),JSON.stringify(report,null,2)+"\n");

if(removed.length){
  console.error(JSON.stringify(report,null,2));
  throw new Error("REGRESSION_GATE_FAIL");
}

console.log("REGRESSION_GATE_PASS");
