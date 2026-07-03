#!/usr/bin/env node
const fs=require("fs"), path=require("path");
const RUNTIME_C_HOME=process.env.RUNTIME_C_HOME||"/opt/eila-os/factory-xyz/runtime-c";
const runsRoot=process.env.RUNTIME_C_RUNS||`${RUNTIME_C_HOME}/sandbox/runs`;
const outDir="/opt/eila-os/factory-xyz/runtime-c/apps/web-public/assets/ai-sandbox/runtime-c-runs";
fs.mkdirSync(outDir,{recursive:true});
const dirs=fs.existsSync(runsRoot)
  ? fs.readdirSync(runsRoot)
      .map(d=>path.join(runsRoot,d))
      .filter(p=>fs.statSync(p).isDirectory() && !path.basename(p).startsWith("_"))
      .sort((a,b)=>String(path.basename(b).match(/\d{8}T\d{6}Z/)?.[0]||'').localeCompare(String(path.basename(a).match(/\d{8}T\d{6}Z/)?.[0]||'')))
      .slice(0,50)
  : [];
const runtimeActive=(()=>{try{return require("child_process").execFileSync("pgrep",["-f","runtime-c-(runner|lane-real).cjs"],{encoding:"utf8"}).trim().length>0}catch{return false}})();
const runs=dirs.map(root=>{
 const read=f=>{try{return JSON.parse(fs.readFileSync(path.join(root,f),"utf8"))}catch{return null}};
 const st=read("RUN_STATE.json"), tps=read("TPS_REPORT.json"), sql=read("SQL_EXPORT_EVENT.json"), stream=read("STREAM_STATUS.json"), full=read("buildsheet.full.json");
 const statFile=f=>{try{const txt=fs.readFileSync(path.join(root,f),"utf8");return {path:f,chars:txt.length,lines:txt.split(/\n/).length,status:"PASS"}}catch{return {path:f,chars:0,lines:0,status:"MISSING"}}};
 const laneExec=l=>{try{return JSON.parse(fs.readFileSync(path.join(root,`LANE_EXEC_${l}.json`),"utf8"))}catch{return {}}};
 const laneDurations={WA:laneExec("WA").duration_ms||0,WB:laneExec("WB").duration_ms||0,WC:laneExec("WC").duration_ms||0,WD:laneExec("WD").duration_ms||0,WE:laneExec("WE").duration_ms||0,WF:laneExec("WF").duration_ms||0};
 const totalDurationMs=Object.values(laneDurations).reduce((a,b)=>a+b,0);
 let status=st?.status||tps?.status||"UNKNOWN"; let state=st?.state||null; if(!runtimeActive && status==="ACTIVE"){status="STALE"; state="STALE_NOT_RUNNING";}
 return {run_id:path.basename(root),root,status,state,job_id:sql?.job_id||null,product_slug:sql?.product_slug||st?.full?.match?.(/runtime-c-runs\/([^\/]+)/)?.[1]?.replace(/-\d{8}T\d{6}Z$/,"")||path.basename(root).replace(/-\d{8}T\d{6}Z$/,""),pod:st?.pod||sql?.pod||full?.lane_cell_backend||full?.pod||null,coverage_pct:sql?.coverage_pct??null,stream_status:stream?.status||null,stream_lanes:stream?.lane_status||[],lane_artifacts:{WA:statFile("output/index.html"),WB:statFile("output/styles.css"),WC:statFile("output/app.js"),WD:statFile("output/CLASS_MANIFEST.json"),WE:statFile("output/REGRESSION_PROOF.md"),WF:statFile("output/OPERATOR_REVIEW_CARD.md")},lane_durations_ms:laneDurations,total_duration_ms:totalDurationMs,tps:fs.existsSync(path.join(root,"TPS_REPORT.md"))?path.join(root,"TPS_REPORT.md"):null,updated_at:st?.completed_at||stream?.updated_at||null};
}).filter(r=>r.run_id&&r.status!=="UNKNOWN"&&!["STALE"].includes(String(r.status||"").toUpperCase())&&!String(r.state||"").toUpperCase().includes("STALE"));
const familyOf=r=>{
  const base=(r.product_slug||r.run_id||"runtime-c-ui").replace(/-(initial-build|full-build|heavy-build|iteration-[0-9]+)$/,"");
  return base || r.product_slug || r.run_id;
};
const fams={};
for(const r of runs.slice().reverse()){
  const family=familyOf(r);
  fams[family]=fams[family]||[];
  let pass=1;
  const m=(r.product_slug||r.run_id||"").match(/iteration-([0-9]+)/);
  if(m) pass=Number(m[1]);
  Object.assign(r,{family,pass,ui_ref:"pass-"+pass});
  fams[family].push(r);
}
const families=Object.fromEntries(Object.entries(fams).map(([k,v])=>{const m={}; for(const x of v){m[x.pass]=x;} const vv=Object.values(m).sort((a,b)=>a.pass-b.pass); return [k,{family:k,latest_pass:Math.max(...vv.map(x=>x.pass)),passes:vv.map(x=>({run_id:x.run_id,pass:x.pass,status:x.status,state:x.state,updated_at:x.updated_at}))}];}));

const latestPayload={status:"PASS",count:runs.length,runs,families};
fs.writeFileSync(path.join(outDir,"latest.json"),JSON.stringify(latestPayload,null,2)+"\n");
fs.writeFileSync(path.join(runsRoot,"latest.json"),JSON.stringify(latestPayload,null,2)+"\n");

console.log("PASS runtime-c-write-index");
