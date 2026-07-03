#!/usr/bin/env node
const fs=require("fs"), path=require("path");
const root=process.argv[2]; if(!root){console.error("usage: runtime-c-write-tps.cjs <run_root>");process.exit(2);}
const read=(p,d=null)=>fs.existsSync(p)?JSON.parse(fs.readFileSync(p,"utf8")):d;
const full=read(path.join(root,"buildsheet.full.json"),{});
const gate=read(path.join(root,"CLASS_COVERAGE_GATE.json"),{ok:false,coverage_pct:0,missing:["gate_missing"]});
const telemetry=read(path.join(root,"LANE_TELEMETRY.json"),{lanes:[]});
const podResolution=read(path.join(root,"POD_RESOLUTION.json"),{});
const streaming=read(path.join(root,"STREAMING_REPORT.json"),{});
const events=fs.existsSync(path.join(root,"EVENT_LOG.jsonl"))?fs.readFileSync(path.join(root,"EVENT_LOG.jsonl"),"utf8").trim().split(/\n/).filter(Boolean).map(JSON.parse):[];
const out=path.join(root,"output");
const files=fs.existsSync(out)?fs.readdirSync(out).sort():[];
const metric=(f)=>{const p=path.join(out,f); if(!fs.existsSync(p)) return {exists:"FAIL",bytes:0,lines:0,path:p}; const s=fs.readFileSync(p,"utf8"); return {exists:"PASS",bytes:Buffer.byteLength(s),lines:s.split(/\n/).length,path:p};};
const m={html:metric("index.html"),css:metric("styles.css"),js:metric("app.js")};
const status=gate.ok?"PASS":"FAIL";
const md=[
`# Runtime C TPS Report`,
``,
`STATUS=${status}`,
`RUN_ROOT=${root}`,
`JOB_ID=${full.job_meta?.job_id||"unknown"}`,
`PRODUCT=${full.product_slug||"unknown"}`,
`POD=${full.lane_cell_backend||"unknown"}`,
`POD_RESOLUTION_STATUS=${podResolution.status||"UNKNOWN"}`,
`POD_RESOURCE=${podResolution.resolved?.resource||"unknown"}`,
`POD_MODEL=${podResolution.resolved?.model||"unknown"}`,
`RUNTIME_ENDPOINT=${podResolution.resolved?.base_url||"UNRESOLVED"}`,
`STREAMING_STATUS=${streaming.status||"UNKNOWN"}`,
`STREAMING_HANDOFF=${streaming.handoff?.status||"UNKNOWN"}`,
`STREAMING_THRESHOLD=${streaming.handoff?.threshold||"unknown"}`,
`MODE=${full.mode||"unknown"}`,
`PASS_NUMBER=${full.pass||"unknown"}`,
``,
`## SECTION 1 · CLASSIFICATION`,
`Runtime C staggered class-handoff run.`,
``,
`## SECTION 2 · STATUS HISTORY`,
...events.map(e=>`- ${e.ts} ${e.event} ${e.status||""} ${e.phase||e.lane||""}`),
``,
`## SECTION 3 · LANE TELEMETRY`,
...telemetry.lanes.map(l=>`- ${l.lane}: ${l.status} duration_ms=${l.duration_ms} pod=${l.pod||""} resource=${l.resource||""} model=${l.model||""} prompt=${l.prompt_path||""} stream=${l.stream}`),
``,
`## SECTION 4 · ARTIFACT METRICS`,
`HTML exists=${m.html.exists} bytes=${m.html.bytes} lines=${m.html.lines} path=${m.html.path}`,
`CSS  exists=${m.css.exists} bytes=${m.css.bytes} lines=${m.css.lines} path=${m.css.path}`,
`JS   exists=${m.js.exists} bytes=${m.js.bytes} lines=${m.js.lines} path=${m.js.path}`,
`CSS coverage=${gate.coverage_pct}`,
`Missing classes=${(gate.missing||[]).join(",")||"none"}`,
`Missing declared HTML=${(gate.missing_declared_in_html||[]).join(",")||"none"}`,
`Missing declared CSS=${(gate.missing_declared_in_css||[]).join(",")||"none"}`,
``,
`## SECTION 5 · OUTPUT FILES`,
...files.map(f=>`- output/${f}`),
``,
`## SECTION 6 · BUILDSHEET`,
"```json",
JSON.stringify(full,null,2),
"```",
``,
`## SECTION 7 · NEXT FIXES`,
status==="PASS" ? `- None. Runtime C gates passed.` : `- Fix missing classes/artifacts and rerun Runtime C checker.`,
``,
`FINAL_STATUS=${status}`
].join("\n");
fs.writeFileSync(path.join(root,"TPS_REPORT.md"),md+"\n");
fs.writeFileSync(path.join(root,"TPS_REPORT.json"),JSON.stringify({status,root,job_id:full.job_meta?.job_id,product:full.product_slug,pod:full.lane_cell_backend,mode:full.mode,pass:full.pass,coverage_pct:gate.coverage_pct,missing:gate.missing||[],metrics:m,lanes:telemetry.lanes,events},null,2)+"\n");
console.log(`PASS runtime-c-write-tps ${path.join(root,"TPS_REPORT.md")}`);
