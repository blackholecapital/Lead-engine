#!/usr/bin/env node
const fs=require("fs"), path=require("path");
const root=process.argv[2]; if(!root){console.error("usage: runtime-c-write-repair-smoke-report.cjs <run_root>");process.exit(2);}
const gate=JSON.parse(fs.readFileSync(path.join(root,"CLASS_COVERAGE_GATE.json"),"utf8"));
const repair=JSON.parse(fs.readFileSync(path.join(root,"WB_REPAIR_ATTEMPT.json"),"utf8"));
const status=gate.ok===true && gate.coverage_pct===100 ? "PASS" : "FAIL";
const md=[
"# Runtime C Repair Smoke Report",
"",
`STATUS=${status}`,
`RUN_ROOT=${root}`,
`REPAIRED_CLASSES=${(repair.missing_repaired||[]).join(",")||"none"}`,
`FINAL_COVERAGE=${gate.coverage_pct}`,
`FINAL_MISSING=${(gate.missing||[]).join(",")||"none"}`,
"",
`FINAL_STATUS=${status}`
].join("\n");
fs.writeFileSync(path.join(root,"REPAIR_SMOKE_REPORT.md"),md+"\n");
fs.writeFileSync(path.join(root,"REPAIR_SMOKE_REPORT.json"),JSON.stringify({status,root,repair,final_gate:gate},null,2)+"\n");
console.log(`${status} runtime-c-write-repair-smoke-report`);
if(status==="FAIL") process.exit(1);
