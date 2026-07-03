#!/usr/bin/env node
const cp=require("child_process");
const root=process.argv[2];
if(!root){console.error("usage: runtime-c-write-debug-bundle.cjs <run_root>");process.exit(2);}
const tools="/opt/eila-os/factory-xyz/runtime-c/tools/runtime-c-lab";
const run=(name,args=[])=>cp.execFileSync(`${tools}/${name}`,args,{stdio:"inherit"});
run("runtime-c-verify-pods.cjs");
run("runtime-c-write-tool-manifest.cjs",[root]);
run("runtime-c-write-restore-command.cjs",[root]);
run("runtime-c-write-stage-matrix.cjs",[root]);
run("runtime-c-write-freeze-card.cjs",[root]);
console.log("PASS runtime-c-write-debug-bundle");
