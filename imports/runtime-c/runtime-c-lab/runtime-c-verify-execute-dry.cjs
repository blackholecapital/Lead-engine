#!/usr/bin/env node
const fs=require("fs"), path=require("path");
const root=process.argv[2]; if(!root){console.error("usage: runtime-c-verify-execute-dry.cjs <run_root>");process.exit(2);}
const required=["RUN_STATE.json","EVENT_LOG.jsonl","POD_RESOLUTION.json"];
for(const l of ["WA","WB","WC","WD","WE","WF"]){
  required.push(`PROMPT_${l}.json`, `POD_COMMAND_${l}.json`, `LANE_EXEC_${l}.json`);
}
const missing=required.filter(f=>!fs.existsSync(path.join(root,f)));
const bad=[];
for(const l of ["WA","WB","WC","WD","WE","WF"]){
  const p=path.join(root,`LANE_EXEC_${l}.json`);
  if(fs.existsSync(p)){
    const x=JSON.parse(fs.readFileSync(p,"utf8"));
    if(x.status!=="PASS" || x.exit_code!==0) bad.push(l);
  }
}
const status=(missing.length||bad.length)?"FAIL":"PASS";
fs.writeFileSync(path.join(root,"VERIFY_EXECUTE_DRY.json"),JSON.stringify({status,missing,bad,checked_at:new Date().toISOString()},null,2)+"\n");
console.log(`${status} runtime-c-verify-execute-dry`);
if(status==="FAIL") process.exit(1);
