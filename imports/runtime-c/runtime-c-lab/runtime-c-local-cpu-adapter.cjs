#!/usr/bin/env node
const cp=require("child_process");
const [,,lane,root]=process.argv;
if(!lane||!root){console.error("usage: runtime-c-local-cpu-adapter.cjs <lane> <root>");process.exit(2);}
// endpoint controlled by POD_RESOLUTION only
process.env.EILA_FACTORY_LLM_MODEL="qwen2.5-coder:14b";
cp.execFileSync("node",["/opt/eila-os/factory-xyz/runtime-c/tools/runtime-c-lab/runtime-c-lane-real.cjs",lane,root],{stdio:"inherit"});
