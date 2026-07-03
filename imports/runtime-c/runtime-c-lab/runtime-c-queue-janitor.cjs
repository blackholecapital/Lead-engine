#!/usr/bin/env node
const fs=require("fs"), path=require("path");

const base="/opt/eila-os/factory-xyz/runtime-c";
const bulk=path.join(base,"warehouse/bulk-builds");

const TTL_HOURS=12;
const DELETE_DAYS=3;
const now=Date.now();

const staleMs=TTL_HOURS*60*60*1000;

const watched=[
  "inbox",
  "queued",
  "running",
  "done/submitted"
];

const expired=path.join(bulk,"failed/expired");
const trash=path.join(bulk,"trash");
fs.mkdirSync(expired,{recursive:true});
fs.mkdirSync(trash,{recursive:true});

function ageMs(file){
  return now - fs.statSync(file).mtimeMs;
}

function safeMove(src,destDir,reason){
  fs.mkdirSync(destDir,{recursive:true});
  const name=path.basename(src);
  const stamp=new Date().toISOString().replace(/[:.]/g,"");
  const dest=path.join(destDir,`${stamp}-${reason}-${name}`);

  let payload={};
  try { payload=JSON.parse(fs.readFileSync(src,"utf8")); } catch {}

  payload.queue_expired=true;
  payload.expired_reason=reason;
  payload.expired_at=new Date().toISOString();
  payload.original_path=src;

  fs.writeFileSync(src,JSON.stringify(payload,null,2)+"\n");
  fs.renameSync(src,dest);
  console.log("EXPIRED",src,"->",dest);
}

for(const rel of watched){
  const dir=path.join(bulk,rel);
  if(!fs.existsSync(dir)) continue;

  for(const f of fs.readdirSync(dir).filter(x=>x.endsWith(".json"))){
    const p=path.join(dir,f);
    if(ageMs(p) > staleMs){
      safeMove(p,expired,rel.replace(/\//g,"-"));
    }
  }
}

// purge old failed/trash/quarantine
for(const rel of ["failed","trash","quarantine","archive"]){
  const dir=path.join(bulk,rel);
  if(!fs.existsSync(dir)) continue;

  const walk=d=>{
    for(const item of fs.readdirSync(d)){
      const p=path.join(d,item);
      const st=fs.statSync(p);
      if(st.isDirectory()) walk(p);
      else if(st.isFile() && now-st.mtimeMs > DELETE_DAYS*24*60*60*1000){
        fs.unlinkSync(p);
        console.log("DELETED",p);
      }
    }
  };
  walk(dir);
}
