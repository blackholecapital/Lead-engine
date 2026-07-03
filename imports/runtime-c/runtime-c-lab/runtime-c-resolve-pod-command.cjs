#!/usr/bin/env node
const fs=require("fs"), path=require("path");
const [,,lane,root]=process.argv;
if(!lane||!root){console.error("usage: runtime-c-resolve-pod-command.cjs <lane> <root>");process.exit(2);}
const pod=JSON.parse(fs.readFileSync(path.join(root,"POD_RESOLUTION.json"),"utf8")).resolved;
const promptPath=path.join(root,`PROMPT_${lane}.json`);
let template=(pod.lane_command_templates && pod.lane_command_templates[lane]) ? pod.lane_command_templates[lane] : pod.command_template;
let cmd=template
  .replaceAll("{pod}", pod.resource||"unknown")
  .replaceAll("{lane}", lane)
  .replaceAll("{prompt_path}", promptPath)
  .replaceAll("{root}", root);
const out={status:"PASS",lane,command:cmd,timeout_sec:pod.timeout_sec||900,stream_mode:pod.stream_mode||"jsonl"};
fs.writeFileSync(path.join(root,`POD_COMMAND_${lane}.json`),JSON.stringify(out,null,2)+"\n");
console.log(`PASS runtime-c-resolve-pod-command ${lane}`);
