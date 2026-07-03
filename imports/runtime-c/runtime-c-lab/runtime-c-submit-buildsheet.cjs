#!/usr/bin/env node
const fs=require("fs"), path=require("path"), cp=require("child_process");

const input=process.argv[2];
if(!input){
  console.error("usage: runtime-c-submit-buildsheet.cjs <buildsheet_json_path>");
  process.exit(2);
}

const tools="/mnt/eila-hot-sidecar/factory-xyz/runtime-c/tools/runtime-c-lab";
const inbox="/mnt/eila-hot-sidecar/factory-xyz/runtime-c/runtime-c-submit-inbox";
fs.mkdirSync(inbox,{recursive:true});

let parsed;
try {
  parsed=JSON.parse(fs.readFileSync(input,"utf8"));
} catch(e) {
  console.error("FAIL invalid buildsheet json");
  
console.error("=== FULL STACK ===")
console.error(e?.stack||e)

console.error("=== BUILDSHEET STACK ===")
console.error(e?.stack||e)
process.exit(1)

;
}

const slug=(parsed.product_slug||parsed.job_meta?.job_id||"runtime-c-job")
  .toString()
  .replace(/[^a-zA-Z0-9._-]+/g,"-")
  .replace(/^-+|-+$/g,"")
  .slice(0,80) || "runtime-c-job";

const ts=new Date().toISOString().replace(/[-:]/g,"").replace(/\.\d+Z$/,"Z");
// Normalize short UI buildsheets into the current Runtime C runner contract.
parsed.title = parsed.title || parsed.job_name || parsed.product_slug || slug;
parsed.job_name = parsed.job_name || slug;
parsed.product_slug = parsed.product_slug || slug;
parsed.mode = parsed.mode || "initial_build";
parsed.pass = parsed.pass ?? 1;
parsed.pod = parsed.pod || parsed.lane_cell_backend || "A";
parsed.lane_cell_backend = parsed.lane_cell_backend || parsed.pod || "A";
parsed.goal = parsed.goal || parsed.objective || parsed.operator_goal || "Runtime C operator submitted build.";
parsed.operator_goal = parsed.operator_goal || parsed.goal || "Runtime C operator submitted build.";
parsed.outputs = parsed.outputs || ["output/index.html","output/CLASS_MANIFEST.json"];

const staged=path.join(inbox,`${slug}-${ts}.json`);
fs.writeFileSync(staged,JSON.stringify(parsed,null,2)+"\n");

const env={...process.env,RUNTIME_C_MODE:"real",RUNTIME_C_REAL_STAGE:"qwen3_artifact",RUNTIME_C_ALLOW_REAL_EXEC:process.env.RUNTIME_C_ALLOW_REAL_EXEC||"1"};
const args=[path.join(tools,"runtime-c-runner.cjs"),staged]; if(process.env.RUNTIME_C_FIXED_ROOT) args.push(process.env.RUNTIME_C_FIXED_ROOT); const out=cp.execFileSync("node",args,{env,encoding:"utf8"});
process.stdout.write(out);

const match=out.match(/"root":\s*"([^"]+)"/);
const root=match?.[1] || null;
const result={status:"PASS",staged,root,submitted_at:new Date().toISOString()};
fs.writeFileSync(path.join(inbox,`${slug}-${ts}.result.json`),JSON.stringify(result,null,2)+"\n");

console.log("PASS runtime-c-submit-buildsheet");
