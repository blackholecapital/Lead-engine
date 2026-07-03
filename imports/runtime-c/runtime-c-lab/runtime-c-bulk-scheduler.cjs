#!/usr/bin/env node
const fs=require("fs"), path=require("path"), cp=require("child_process");

const base="/opt/eila-os/factory-xyz/runtime-c";
const bulk=path.join(base,"warehouse/bulk-builds");
const inbox=path.join(bulk,"inbox");
const queued=path.join(bulk,"queued");
const submitted=path.join(bulk,"done/submitted");
const failed=path.join(bulk,"failed");
const locks=path.join(bulk,"locks");
const submitUrl="http://127.0.0.1:8767/submit";

for(const d of [inbox,queued,submitted,failed,locks]) fs.mkdirSync(d,{recursive:true});

for(const f of fs.readdirSync(inbox).filter(f=>f.endsWith(".json")).sort()){
  fs.renameSync(path.join(inbox,f),path.join(queued,f));
}

function readJson(p){ return JSON.parse(fs.readFileSync(p,"utf8")); }

const activePods=new Set(
  fs.readdirSync(locks)
    .filter(f=>f.endsWith(".lock"))
    .map(f=>path.basename(f,".lock").toUpperCase())
);

let sent=0;

for(const f of fs.readdirSync(queued).filter(f=>f.endsWith(".json")).sort()){
  const src=path.join(queued,f);
  const job=readJson(src);
  const pod=String(job.pod||job.lane_cell_backend||"A").toUpperCase();

  if(activePods.has(pod)) continue;

  const lockFile=path.join(locks,`${pod}.lock`);
  fs.writeFileSync(lockFile,JSON.stringify({pod,file:f,locked_at:new Date().toISOString()},null,2)+"\n");

  try{
    const out=cp.execFileSync("curl",[
      "-sS","-H","content-type: application/json",
      "--data-binary","@"+src,
      submitUrl
    ],{encoding:"utf8"});

    const parsed=JSON.parse(out);
    job.last_response=parsed;
    job.submitted_at=new Date().toISOString();

    fs.writeFileSync(src,JSON.stringify(job,null,2)+"\n");

    if(parsed.ok){
      fs.renameSync(src,path.join(submitted,f));
      console.log("SUBMITTED",pod,f,parsed.status,parsed.root);
    }else{
      fs.rmSync(lockFile,{force:true});
      fs.renameSync(src,path.join(failed,f));
      console.log("FAILED_SUBMIT",pod,f,parsed.error);
    }

    activePods.add(pod);
    sent++;
  }catch(e){
    fs.rmSync(lockFile,{force:true});
    fs.renameSync(src,path.join(failed,f));
    console.error("SUBMIT_ERROR",pod,f,e.message);
  }
}

if(!sent) console.log("BULK_SCHEDULER_IDLE_OR_WAIT per-pod");
