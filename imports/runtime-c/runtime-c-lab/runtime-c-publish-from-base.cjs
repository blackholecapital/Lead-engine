const fs=require("fs");
const path=require("path");
const cp=require("child_process");

const run=process.argv[2];
if(!run){
  console.error("usage: runtime-c-publish-from-base.cjs <run-id>");
  process.exit(2);
}

const ROOT="/opt/eila-os";
const RUN=path.join(ROOT,"factory-xyz/runtime-c/sandbox/runs",run);
const OUT=path.join(RUN,"output");

const JOBS="/mnt/eila-hot-sidecar/Factory-xyz/git/runner/jobs";
const BASE_REPO="/srv/eila/forgejo/repositories/factory-admin/eila_os.git";
const DEST=path.join(JOBS,run);

if(!fs.existsSync(BASE_REPO)){
  console.error("missing base repo: "+BASE_REPO);
  process.exit(1);
}
if(!fs.existsSync(path.join(OUT,"index.html"))){
  console.error("missing runtime output: "+OUT);
  process.exit(1);
}
if(fs.existsSync(DEST)){
  console.error("destination exists: "+DEST);
  process.exit(1);
}

cp.execFileSync("git",["clone",BASE_REPO,DEST],{stdio:"inherit"});

fs.mkdirSync(path.join(DEST,"output"),{recursive:true});
for(const f of ["index.html","styles.css","app.js"]){
  cp.execFileSync("cp",["-a",path.join(OUT,f),path.join(DEST,"output",f)]);
}

fs.mkdirSync(path.join(DEST,"runtime",run),{recursive:true});
for(const f of ["RUN_STATE.json","TPS_REPORT.md","TPS_REPORT.json","LANE_TELEMETRY.json","EVENT_LOG.jsonl","POD_RESOLUTION.json","buildsheet.full.json"]){
  const src=path.join(RUN,f);
  if(fs.existsSync(src)) cp.execFileSync("cp",["-a",src,path.join(DEST,"runtime",run,f)]);
}

fs.writeFileSync(path.join(DEST,"build-sheet.txt"),
`Runtime-C lineage build
base=factory-admin/EILA_OS
run=${run}
source=${RUN}
output=${OUT}
published_at=${new Date().toISOString()}
`);

cp.execSync("git add .",{cwd:DEST,stdio:"inherit"});
cp.execSync(`git commit -m "runtime-c pass from EILA_OS ${run}"`,{cwd:DEST,stdio:"inherit"});

console.log("PASS lineage repo staged: "+DEST);
