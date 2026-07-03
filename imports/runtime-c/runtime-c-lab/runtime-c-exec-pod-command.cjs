#!/usr/bin/env node
const fs=require("fs"), cp=require("child_process"), path=require("path");
const [,,lane,root]=process.argv;
if(!lane||!root){console.error("usage: runtime-c-exec-pod-command.cjs <lane> <root>");process.exit(2);}
const cmdFile=path.join(root,`POD_COMMAND_${lane}.json`);
if(!fs.existsSync(cmdFile)){console.error(`FAIL missing ${cmdFile}`);process.exit(1);}
const spec=JSON.parse(fs.readFileSync(cmdFile,"utf8"));
if (!spec.command.trim().startsWith("echo ") && process.env.RUNTIME_C_ALLOW_REAL_EXEC !== "1") {
  const out={status:"FAIL",lane,command:spec.command,exit_code:126,stdout:"",stderr:"REAL_EXEC_BLOCKED: set RUNTIME_C_ALLOW_REAL_EXEC=1",started_at:new Date().toISOString(),completed_at:new Date().toISOString(),duration_ms:0};
  fs.writeFileSync(path.join(root,`LANE_EXEC_${lane}.json`),JSON.stringify(out,null,2)+"\n");
  console.log(`FAIL runtime-c-exec-pod-command ${lane} REAL_EXEC_BLOCKED`);
  process.exit(1);
}
const started_at=new Date().toISOString();
let stdout="", stderr="", exit_code=0, status="PASS";
try {
  stdout=cp.execSync(spec.command,{encoding:"utf8",timeout:(spec.timeout_sec||900)*1000});
} catch(e) {
  status="FAIL"; exit_code=e.status ?? 1; stdout=e.stdout?.toString()||""; stderr=e.stderr?.toString()||e.message;
}
const completed_at=new Date().toISOString();
const out={status,lane,command:spec.command,exit_code,stdout,stderr,started_at,completed_at,duration_ms:Date.parse(completed_at)-Date.parse(started_at)};
fs.writeFileSync(path.join(root,`LANE_EXEC_${lane}.json`),JSON.stringify(out,null,2)+"\n");
fs.appendFileSync(path.join(root,"EVENT_LOG.jsonl"),JSON.stringify({ts:completed_at,event:"LANE_EXEC_DONE",lane,status,exit_code})+"\n");
console.log(`${status} runtime-c-exec-pod-command ${lane}`);
if(status==="FAIL") process.exit(1);
