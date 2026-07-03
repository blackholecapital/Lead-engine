#!/usr/bin/env node
const fs=require("fs"), path=require("path");

const base="/opt/eila-os/factory-xyz/runtime-c";
const bulk=path.join(base,"warehouse/bulk-builds");

const submitted=path.join(bulk,"done/submitted");
const passDir=path.join(bulk,"done/pass");
const failDir=path.join(bulk,"done/fail");
const repairDir=path.join(bulk,"repair");
const locks=path.join(bulk,"locks");

for(const d of [submitted,passDir,failDir,repairDir]){
  fs.mkdirSync(d,{recursive:true});
}

const files=fs.readdirSync(submitted).filter(f=>f.endsWith(".json"));

for(const f of files){

  const p=path.join(submitted,f);
  const job=JSON.parse(fs.readFileSync(p,"utf8"));

  const root=job?.last_response?.root
    || job?.response?.root
    || job?.run_root;

  if(!root) continue;

  const stateFile=path.join(root,"RUN_STATE.json");

  if(!fs.existsSync(stateFile)){
    console.log("WAITING",f);
    continue;
  }

  const state=JSON.parse(fs.readFileSync(stateFile,"utf8"));

  if(state.status==="PASS"){
    fs.rmSync(path.join(locks,`${String(job.pod||job.lane_cell_backend||"A").toUpperCase()}.lock`),{force:true});
    fs.renameSync(p,path.join(passDir,f));
    console.log("PASS",f);
    continue;
  }

  if(state.status==="FAIL"){
    fs.rmSync(path.join(locks,`${String(job.pod||job.lane_cell_backend||"A").toUpperCase()}.lock`),{force:true});

    const failedJob={
      ...job,
      retry_count:(job.retry_count||0)+1,
      repaired_from:f,
      repaired_at:new Date().toISOString()
    };

    fs.writeFileSync(
      path.join(repairDir,f),
      JSON.stringify(failedJob,null,2)+"\n"
    );

    fs.renameSync(p,path.join(failDir,f));

    console.log("FAIL",f);
  }
}
