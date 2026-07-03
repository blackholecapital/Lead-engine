#!/usr/bin/env node
const fs=require("fs");
const p="/opt/eila-os/factory-xyz/runtime-c/tools/runtime-c-lab/runtime-c-pods.json";
const d=JSON.parse(fs.readFileSync(p,"utf8"));
const lanes=["WA","WB","WC","WD","WE","WF"];
const fail=[];
for(const [id,pod] of Object.entries(d.pods||{})){
  if(!pod.backend) fail.push(`${id}:missing_backend`);
  if(!pod.resource) fail.push(`${id}:missing_resource`);
  if(!pod.model_profile) fail.push(`${id}:missing_model_profile`);
  if(!pod.command_template && !pod.lane_command_templates) fail.push(`${id}:missing_command_template`);
  for(const l of Object.keys(pod.lane_command_templates||{})) if(!lanes.includes(l)) fail.push(`${id}:bad_lane_${l}`);
  const c=pod.capabilities||{};
  for(const k of ["factory_manuals_injected","foreman_rules_injected","worker_rules_injected","supports_streaming","supports_prompt_ready","supports_execute_dry"]) {
    if(c[k] === undefined) fail.push(`${id}:missing_capability_${k}`);
  }
}
const status=fail.length?"FAIL":"PASS";
console.log(`${status} runtime-c-verify-pods`);
if(fail.length) console.log(JSON.stringify({status,fail},null,2));
if(fail.length) process.exit(1);
