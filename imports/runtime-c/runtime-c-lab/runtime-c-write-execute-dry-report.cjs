#!/usr/bin/env node
const fs=require("fs"), path=require("path");
const root=process.argv[2]; if(!root){console.error("usage: runtime-c-write-execute-dry-report.cjs <run_root>");process.exit(2);}
const lanes=["WA","WB","WC","WD","WE","WF"];
const execs=lanes.map(l=>JSON.parse(fs.readFileSync(path.join(root,`LANE_EXEC_${l}.json`),"utf8")));
const status=execs.every(x=>x.status==="PASS" && x.exit_code===0)?"PASS":"FAIL";
const md=[
"# Runtime C Execute Dry Report",
"",
`STATUS=${status}`,
"STATE=EXECUTE_DRY_COMPLETE",
`RUN_ROOT=${root}`,
"",
"## Lane Exec Receipts",
...execs.map(x=>`- ${x.lane}: ${x.status} exit=${x.exit_code} duration_ms=${x.duration_ms}`),
"",
`FINAL_STATUS=${status}`
].join("\n");
fs.writeFileSync(path.join(root,"EXECUTE_DRY_REPORT.md"),md+"\n");
fs.writeFileSync(path.join(root,"EXECUTE_DRY_REPORT.json"),JSON.stringify({status,state:"EXECUTE_DRY_COMPLETE",root,execs},null,2)+"\n");
console.log(`${status} runtime-c-write-execute-dry-report`);
if(status==="FAIL") process.exit(1);
