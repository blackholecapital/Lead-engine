#!/usr/bin/env node
const fs=require("fs"), path=require("path");
const root=process.argv[2]; if(!root){console.error("usage: runtime-c-write-prompt-ready-report.cjs <run_root>");process.exit(2);}
const read=f=>JSON.parse(fs.readFileSync(path.join(root,f),"utf8"));
const state=read("RUN_STATE.json"), pod=read("POD_RESOLUTION.json");
const lanes=["WA","WB","WC","WD","WE","WF"];
const prompts=lanes.map(l=>`PROMPT_${l}.json`);
const commands=lanes.map(l=>`POD_COMMAND_${l}.json`);
const md=[
"# Runtime C Prompt Ready Report",
"",
"STATUS=PASS",
"STATE=PROMPT_READY",
`RUN_ROOT=${root}`,
`POD=${pod.selected_pod}`,
`POD_RESOURCE=${pod.resolved.resource}`,
`POD_MODEL=${pod.resolved.model}`,
"",
"## Prompts",
...prompts.map(p=>`- ${p}`),
"",
"## Pod Commands",
...commands.map(c=>`- ${c}`),
"",
"FINAL_STATUS=PASS"
].join("\n");
fs.writeFileSync(path.join(root,"PROMPT_READY_REPORT.md"),md+"\n");
fs.writeFileSync(path.join(root,"PROMPT_READY_REPORT.json"),JSON.stringify({status:"PASS",state:"PROMPT_READY",root,pod,prompts,commands,run_state:state},null,2)+"\n");
console.log("PASS runtime-c-write-prompt-ready-report");
