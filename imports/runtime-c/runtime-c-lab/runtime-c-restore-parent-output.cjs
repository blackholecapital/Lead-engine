#!/usr/bin/env node
const fs=require("fs"), path=require("path");

const root=process.argv[2];
if(!root) throw new Error("usage: runtime-c-restore-parent-output.cjs <run_root>");

const full=JSON.parse(fs.readFileSync(path.join(root,"buildsheet.full.json"),"utf8"));

const src =
  full?.parent?.output ||
  full?.parent_context?.source_output ||
  full?.inherits_from?.parent_output_path;

if(!src){
  if(String(full.mode||full.workflow||"") === "iteration_pass"){
    throw new Error("PARENT_OUTPUT_PATH_MISSING");
  }
  process.exit(0);
}

if(!fs.existsSync(src)) throw new Error(`parent output missing: ${src}`);

const dst=path.join(root,"output");
fs.mkdirSync(dst,{recursive:true});
fs.cpSync(src,dst,{recursive:true});

fs.writeFileSync(path.join(root,"LINEAGE.json"),JSON.stringify({
  status:"PASS",
  restored:true,
  parent_run:full?.parent?.run_id || full?.parent_context?.source_run_id || full?.inherits_from?.parent_run_id || null,
  parent_pass:full?.parent?.pass || full?.inherits_from?.parent_pass || null,
  copied_from:src,
  copied_to:dst,
  created_at:new Date().toISOString()
},null,2)+"\n");

console.log("PASS parent output restored", src);
