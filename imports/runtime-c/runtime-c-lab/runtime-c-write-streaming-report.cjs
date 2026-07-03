#!/usr/bin/env node
const fs=require("fs"), path=require("path");
const root=process.argv[2]; if(!root){console.error("usage: runtime-c-write-streaming-report.cjs <run_root>");process.exit(2);}
const read=(f,d={})=>{try{return JSON.parse(fs.readFileSync(path.join(root,f),"utf8"))}catch{return d}};
const state=read("RUN_STATE.json"), stream=read("STREAM_STATUS.json",{lane_status:[]}), handoff=read("STREAMING_HANDOFF_STATE.json",{});
const status=state.status||stream.status||"UNKNOWN";
const md=[
"# Runtime C Streaming Report",
"",
`STATUS=${status}`,
`STATE=${state.state||"UNKNOWN"}`,
`RUN_ROOT=${root}`,
`HANDOFF_STATUS=${handoff.status||"UNKNOWN"}`,
`HANDOFF_CLASS_COUNT=${handoff.class_count??"unknown"}`,
`HANDOFF_THRESHOLD=${handoff.threshold??"unknown"}`,
`WB_MAY_START=${handoff.wb_may_start??"unknown"}`,
`WC_MAY_START=${handoff.wc_may_start??"unknown"}`,
"",
"## Lane stream status",
...(stream.lane_status||[]).map(l=>`- ${l.lane}: ${l.status} events=${l.event_count} last=${l.last_event||"none"}`),
"",
`FINAL_STATUS=${status}`
].join("\n");
fs.writeFileSync(path.join(root,"STREAMING_REPORT.md"),md+"\n");
fs.writeFileSync(path.join(root,"STREAMING_REPORT.json"),JSON.stringify({status,state,stream,handoff,root},null,2)+"\n");
console.log(`${status==="PASS"||status==="FAIL"?"PASS":"FAIL"} runtime-c-write-streaming-report`);
