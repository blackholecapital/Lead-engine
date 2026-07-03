#!/usr/bin/env node
const fs=require("fs"), path=require("path");
const root=process.argv[2]; if(!root){console.error("usage: runtime-c-write-sql-event.cjs <run_root>");process.exit(2);}
const read=(f,d=null)=>fs.existsSync(path.join(root,f))?JSON.parse(fs.readFileSync(path.join(root,f),"utf8")):d;
const bs=read("buildsheet.full.json",{}), gate=read("CLASS_COVERAGE_GATE.json",{}), telemetry=read("LANE_TELEMETRY.json",{lanes:[]}), tps=read("TPS_REPORT.json",{}), pod_resolution=read("POD_RESOLUTION.json",{}), streaming=read("STREAMING_REPORT.json",{});
const event={
  schema_version:"factory67.runtime_c.sql_event.v1",
  runtime:"C",
  status:tps.status||"UNKNOWN",
  run_root:root,
  job_id:bs.job_meta?.job_id||"unknown",
  product_slug:bs.product_slug||"unknown",
  pod:bs.lane_cell_backend||"unknown",
  pod_resolution,
  streaming,
  mode:bs.mode||"unknown",
  pass:bs.pass||"unknown",
  coverage_pct:gate.coverage_pct||0,
  missing_classes:gate.missing||[],
  html_bytes:tps.metrics?.html?.bytes||0,
  css_bytes:tps.metrics?.css?.bytes||0,
  js_bytes:tps.metrics?.js?.bytes||0,
  lanes:telemetry.lanes||[],
  tps_report:path.join(root,"TPS_REPORT.md"),
  created_at:new Date().toISOString()
};
fs.writeFileSync(path.join(root,"SQL_EXPORT_EVENT.json"),JSON.stringify(event,null,2)+"\n");
fs.mkdirSync("/opt/eila-os/factory-xyz/runtime-c/metrics",{recursive:true});
fs.appendFileSync("/opt/eila-os/factory-xyz/runtime-c/metrics/runtime_c_runs.jsonl",JSON.stringify(event)+"\n");
console.log("PASS runtime-c-write-sql-event");
