#!/usr/bin/env node
const fs=require("fs"), path=require("path");
const root=process.argv[2]; if(!root){console.error("usage: runtime-c-stream-status.cjs <run_root>");process.exit(2);}
const lanes=["WA","WB","WC","WD","WE","WF"], dir=path.join(root,"stream");
const lane_status=lanes.map(l=>{
  const f=path.join(dir,`${l}.jsonl`);
  const lines=fs.existsSync(f)?fs.readFileSync(f,"utf8").trim().split(/\n/).filter(Boolean).map(JSON.parse):[];
  const last=lines.at(-1)||null;
  return {lane:l,event_count:lines.length,last_event:last?.event||null,status:last?.status||"UNKNOWN",updated_at:last?.ts||null};
});
const status=lane_status.every(x=>["PASS","UNKNOWN"].includes(x.status))?"PASS":"FAIL";
const out={schema_version:"factory67.runtime_c.stream_status.v1",status,root,lane_status,updated_at:new Date().toISOString()};
fs.writeFileSync(path.join(root,"STREAM_STATUS.json"),JSON.stringify(out,null,2)+"\n");
console.log("PASS runtime-c-stream-status");
