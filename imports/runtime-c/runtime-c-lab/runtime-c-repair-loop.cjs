#!/usr/bin/env node
const fs=require("fs"), path=require("path");

const base="/opt/eila-os/factory-xyz/runtime-c";
const repair=path.join(base,"warehouse/bulk-builds/repair");
const inbox=path.join(base,"warehouse/bulk-builds/inbox");

const MAX_RETRY=2;

const files=fs.readdirSync(repair)
  .filter(f=>f.endsWith(".json"))
  .sort();

for(const f of files){

  const src=path.join(repair,f);

  const job=JSON.parse(fs.readFileSync(src,"utf8"));

  const retry=job.retry_count||0;

  if(retry>MAX_RETRY){
    console.log("RETRY_LIMIT",f);
    continue;
  }

  job.repair_cycle=(job.repair_cycle||0)+1;
  job.requeued_at=new Date().toISOString();

  fs.writeFileSync(
    path.join(inbox,f),
    JSON.stringify(job,null,2)+"\n"
  );

  fs.unlinkSync(src);

  console.log("REQUEUED",f);
}
