#!/usr/bin/env node
const fs=require("fs"), path=require("path");
const [,,root,lane,event,status="PASS",detail=""] = process.argv;
if(!root||!lane||!event){console.error("usage: runtime-c-stream-append.cjs <run_root> <lane> <event> [status] [detail]");process.exit(2);}
const dir=path.join(root,"stream"); fs.mkdirSync(dir,{recursive:true});
const rec={ts:new Date().toISOString(),lane,event,status,detail};
fs.appendFileSync(path.join(dir,`${lane}.jsonl`),JSON.stringify(rec)+"\n");
fs.appendFileSync(path.join(root,"EVENT_LOG.jsonl"),JSON.stringify({ts:rec.ts,event:`STREAM_${event}`,lane,status,detail})+"\n");
console.log("PASS runtime-c-stream-append");
