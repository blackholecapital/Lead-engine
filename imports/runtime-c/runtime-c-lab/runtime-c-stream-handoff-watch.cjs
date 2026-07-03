#!/usr/bin/env node
const fs=require("fs"), path=require("path");
const root=process.argv[2];
const threshold=Number(process.argv[3]||6);
if(!root){console.error("usage: runtime-c-stream-handoff-watch.cjs <run_root> [class_threshold]");process.exit(2);}
const wa=path.join(root,"stream","WA.jsonl");
const lines=fs.existsSync(wa)?fs.readFileSync(wa,"utf8").trim().split(/\n/).filter(Boolean).map(JSON.parse):[];
const partials=lines.filter(x=>x.event==="partial_manifest"||x.event==="wa_artifacts_written");
let class_count=0;
for(const x of partials){
  const m=String(x.detail||"").match(/classes(?:_seen)?=(\d+)/);
  if(m) class_count=Math.max(class_count,Number(m[1]));
}
const handoff_ready=class_count>=threshold;
const out={
  schema_version:"factory67.runtime_c.streaming_handoff_state.v1",
  status:handoff_ready?"PASS":"WAIT",
  root,
  source_lane:"WA",
  class_count,
  threshold,
  wb_may_start:handoff_ready,
  wc_may_start:handoff_ready,
  updated_at:new Date().toISOString()
};
fs.writeFileSync(path.join(root,"STREAMING_HANDOFF_STATE.json"),JSON.stringify(out,null,2)+"\n");
console.log(`${out.status} runtime-c-stream-handoff-watch`);
process.exit(0);
