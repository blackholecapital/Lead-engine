#!/usr/bin/env node
const fs=require("fs"), path=require("path");
const root=process.argv[2]; if(!root){console.error("usage: runtime-c-verify-run.cjs <run_root>");process.exit(2);}
const required=[
 "RUN_STATE.json","EVENT_LOG.jsonl","LANE_TELEMETRY.json","TPS_REPORT.md","TPS_REPORT.json",
 "SQL_EXPORT_EVENT.json","CLASS_COVERAGE_GATE.json","POD_RESOLUTION.json","PROMPT_WA.json","PROMPT_WB.json","PROMPT_WC.json","PROMPT_WD.json","PROMPT_WE.json","PROMPT_WF.json",
 "output/index.html","output/styles.css","output/app.js","output/CLASS_MANIFEST.json","output/CSS_COVERAGE_REPORT.json",
 "stream/WA.jsonl","stream/WB.jsonl","stream/WC.jsonl","stream/WD.jsonl","stream/WE.jsonl","stream/WF.jsonl"
];
const missing=required.filter(f=>!fs.existsSync(path.join(root,f)));
const status=missing.length?"FAIL":"PASS";
fs.writeFileSync(path.join(root,"VERIFY_RUN.json"),JSON.stringify({status,missing,checked_at:new Date().toISOString()},null,2)+"\n");
console.log(`${status} runtime-c-verify-run`);
if(status==="FAIL") process.exit(1);
