#!/usr/bin/env node
const fs=require("fs"), path=require("path");
const root=process.argv[2]; if(!root) process.exit(2);
const lanes=["WA","WB","WC","WD","WE","WF"];
const out=path.join(root,"output"), stream=path.join(root,"stream");
const artifacts={WA:["index.html","CLASS_MANIFEST.json"],WB:["styles.css","CSS_COVERAGE_REPORT.json"],WC:["app.js"],WD:["PRODUCT_MANIFEST.md"],WE:["REGRESSION_PROOF.md"],WF:["OPERATOR_REVIEW_CARD.md"]};
const podResPath=path.join(root,"POD_RESOLUTION.json");
const podRes=fs.existsSync(podResPath)?JSON.parse(fs.readFileSync(podResPath,"utf8")):null;
function promptMeta(lane){
 const f=path.join(root,`PROMPT_${lane}.json`);
 if(!fs.existsSync(f)) return {};
 try{return JSON.parse(fs.readFileSync(f,"utf8"));}catch{return {};}
}
const data={schema_version:"factory67.runtime_c.lane_telemetry.v1",root,pod_resolution:podRes,lanes:[]};
for(const lane of lanes){
 const sf=path.join(stream,`${lane}.jsonl`);
 const eventFile=path.join(root,"EVENT_LOG.jsonl");
 const lines=fs.existsSync(eventFile)?fs.readFileSync(eventFile,"utf8").trim().split(/\n/).filter(Boolean).map(JSON.parse):[];
 const start=(lines.find(x=>x.lane===lane && ["LANE_START","LANE_EXEC_START","lane_start"].includes(x.event)) || lines.find(x=>x.lane===lane && x.event==="LANE_EXEC_DONE") || {}).ts||null;
 const doneEvt=lines.find(x=>x.lane===lane && ["LANE_DONE","LANE_EXEC_DONE","lane_done"].includes(x.event) && x.status==="PASS") || lines.find(x=>x.lane===lane && x.event==="LANE_EXEC_DONE" && x.status==="PASS");
 const done=doneEvt?.ts||null;
 const bytes={}; for(const f of artifacts[lane]||[]) { const p=path.join(out,f); if(fs.existsSync(p)) bytes[`output/${f}`]=fs.statSync(p).size; }
 data.lanes.push({lane,status:(start? (done?"PASS":"ACTIVE") : "WAIT"),verdict:done?"PASS":"PENDING",started_at:start,completed_at:done,duration_ms:start&&done?Date.parse(done)-Date.parse(start):null,stream:`stream/${lane}.jsonl`,pod:podRes?.selected_pod||promptMeta(lane).pod||null,backend:podRes?.resolved?.backend||null,resource:podRes?.resolved?.resource||null,model:podRes?.resolved?.model||promptMeta(lane).model||null,runtime_endpoint:podRes?.resolved?.base_url||promptMeta(lane).runtime_endpoint||"local_default",prompt_path:`PROMPT_${lane}.json`,artifact_bytes:bytes});
}
fs.writeFileSync(path.join(root,"LANE_TELEMETRY.json"),JSON.stringify(data,null,2)+"\n");
console.log(JSON.stringify({ok:true,telemetry:path.join(root,"LANE_TELEMETRY.json")}));
