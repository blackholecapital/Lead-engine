#!/usr/bin/env node
const fs=require("fs"), path=require("path");
const root=process.argv[2]; if(!root){console.error("usage: runtime-c-verify-prompt-ready.cjs <run_root>");process.exit(2);}
const required=["RUN_STATE.json","EVENT_LOG.jsonl","POD_RESOLUTION.json","PROMPT_WA.json","PROMPT_WB.json","PROMPT_WC.json","PROMPT_WD.json","PROMPT_WE.json","PROMPT_WF.json","POD_COMMAND_WA.json","POD_COMMAND_WB.json","POD_COMMAND_WC.json","POD_COMMAND_WD.json","POD_COMMAND_WE.json","POD_COMMAND_WF.json"];
const missing=required.filter(f=>!fs.existsSync(path.join(root,f)));
const status=missing.length?"FAIL":"PASS";
fs.writeFileSync(path.join(root,"VERIFY_PROMPT_READY.json"),JSON.stringify({status,missing,checked_at:new Date().toISOString()},null,2)+"\n");
console.log(`${status} runtime-c-verify-prompt-ready`);
if(status==="FAIL") process.exit(1);
