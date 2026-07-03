#!/usr/bin/env node
const cp=require("child_process");
const cmds=[
  "node tools/runtime-c-lab/runtime-c-bulk-tracker.cjs",
  "node tools/runtime-c-lab/runtime-c-repair-loop.cjs",
  "node tools/runtime-c-lab/runtime-c-bulk-scheduler.cjs"
];
for(const cmd of cmds){
  try{ console.log(cp.execSync(cmd,{encoding:"utf8"}).trim()); }
  catch(e){ console.error(e.stdout?.toString()||e.message); process.exit(1); }
}
