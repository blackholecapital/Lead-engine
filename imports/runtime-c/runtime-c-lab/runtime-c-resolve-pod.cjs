#!/usr/bin/env node
const fs=require("fs"), path=require("path");
const [,,root]=process.argv;
if(!root){console.error("usage: runtime-c-resolve-pod.cjs <root>");process.exit(2);}
const full=JSON.parse(fs.readFileSync(path.join(root,"buildsheet.full.json"),"utf8"));
const selected=String(full.lane_cell_backend||full.pod||"?").toUpperCase();
const reg="/mnt/eila-hot-sidecar/factory-xyz/runtime-c/tools/runtime-c-lab/runtime-c-pods.json";
const pods=JSON.parse(fs.readFileSync(reg,"utf8"));
const resolved=pods.pods?.[selected];
if(!resolved){console.error("FAIL unknown_pod "+selected);process.exit(1);}
fs.writeFileSync(path.join(root,"POD_RESOLUTION.json"),JSON.stringify({
  status:"PASS",selected_pod:selected,resolved,registry:reg,resolved_at:new Date().toISOString()
},null,2)+"\n");
console.log(`PASS runtime-c-resolve-pod ${selected}`);
