const fs=require("fs");
const path=require("path");

const run=process.argv[2];
if(!run){ console.error("usage: runtime-c-promote-family.cjs <run_root>"); process.exit(2); }

const runId=path.basename(run);
const family=runId.replace(/-\d{8}T\d{6}Z$/,"");

const ROOT="/opt/eila-os/factory-xyz/runtime-c";
const FAM=path.join(ROOT,"families",family);
const IDX=path.join(ROOT,"indexes");

fs.mkdirSync(path.join(FAM,"source-runs"),{recursive:true});
fs.mkdirSync(path.join(FAM,"passes"),{recursive:true});
fs.mkdirSync(path.join(FAM,"promoted"),{recursive:true});

const familyFile=path.join(FAM,"family.json");
let d={
  family,
  system:"runtime-c",
  storage_version:"factory_xyz_runtime_c_family_v1",
  status:"active",
  created_at:new Date().toISOString()
};

try{
  d=JSON.parse(fs.readFileSync(familyFile,"utf8"));
}catch{}

const full=JSON.parse(fs.readFileSync(path.join(run,"buildsheet.full.json"),"utf8"));
const pass=full.pass || d.latest_pass || 1;

d.latest_pass=pass;
d.promoted_pass=pass;
d.latest_run=runId;
d.promoted_run=runId;
d.updated_at=new Date().toISOString();

fs.writeFileSync(familyFile,JSON.stringify(d,null,2)+"\n");

fs.mkdirSync(path.join(FAM,"passes"),{recursive:true});
fs.mkdirSync(path.join(FAM,"promoted"),{recursive:true});

const sourceRun=path.join(FAM,"source-runs",runId);
if(!fs.existsSync(sourceRun)){
  fs.cpSync(run,sourceRun,{recursive:true});
}

const passName=`pass-${String(pass).padStart(4,"0")}`;
const passTmp=path.join(FAM,"passes",passName+".tmp");
const passLink=path.join(FAM,"passes",passName);
try{fs.unlinkSync(passTmp)}catch{}
try{fs.unlinkSync(passLink)}catch{}
fs.symlinkSync(`../source-runs/${runId}`,passTmp);
if(fs.existsSync(passLink)){
  fs.rmSync(passLink,{recursive:true,force:true});
}
fs.renameSync(passTmp,passLink);

const promotedTmp=path.join(FAM,"promoted","output.tmp");
const promotedLink=path.join(FAM,"promoted","output");
try{fs.unlinkSync(promotedTmp)}catch{}
fs.symlinkSync(`../passes/${passName}/merged_product/output`,promotedTmp);
if(fs.existsSync(promotedLink)){
  fs.rmSync(promotedLink,{recursive:true,force:true});
}
fs.renameSync(promotedTmp,promotedLink);

const artifact={
  family,
  latest_pass:pass,
  promoted_pass:pass,
  latest_run:runId,
  promoted_run:runId,
  status:"PASS",
  promoted_output:path.join(FAM,"promoted","output"),
  raw_output:path.join(run,"output"),
  merged_output:path.join(run,"merged_product","output"),
  urls:{
    raw:`/assets/ai-sandbox/runtime-c-runs/${runId}/output/index.html`,
    merged:`/assets/ai-sandbox/runtime-c-runs/${runId}/merged_product/output/index.html`,
    promoted:`/assets/ai-sandbox/runtime-c-merged/${family}/output/index.html`
  },
  updated_at:new Date().toISOString()
};

fs.mkdirSync(IDX,{recursive:true});
fs.writeFileSync(path.join(IDX,"latest.json"),JSON.stringify(artifact,null,2)+"\n");

let artifacts=[];
const artFile=path.join(IDX,"artifacts.json");
try{artifacts=JSON.parse(fs.readFileSync(artFile,"utf8"))}catch{}
artifacts=artifacts.filter(x=>x.family!==family);
artifacts.unshift(artifact);
fs.writeFileSync(artFile,JSON.stringify(artifacts,null,2)+"\n");

let families=[];
const famFile=path.join(IDX,"families.json");
try{families=JSON.parse(fs.readFileSync(famFile,"utf8"))}catch{}
families=families.filter(x=>x.family!==family);
families.unshift({
  family,
  latest_pass:pass,
  promoted_pass:pass,
  latest_run:runId,
  updated_at:artifact.updated_at
});
fs.writeFileSync(famFile,JSON.stringify(families,null,2)+"\n");

const histFile=path.join(IDX,"promotion_history.json");
let hist=[];
try{hist=JSON.parse(fs.readFileSync(histFile,"utf8"))}catch{}
hist.unshift({
  family,
  pass,
  run:runId,
  status:"PASS",
  promoted_output:artifact.promoted_output,
  updated_at:artifact.updated_at
});
fs.writeFileSync(histFile,JSON.stringify(hist,null,2)+"\n");

const publicRoot="/opt/eila-os/factory-xyz/runtime-c/products/runtime-c-merged";
fs.mkdirSync(publicRoot,{recursive:true});
const publicTmp=path.join(publicRoot,family+".tmp");
const publicLink=path.join(publicRoot,family);
try{fs.unlinkSync(publicTmp)}catch{}
try{fs.unlinkSync(publicLink)}catch{}
fs.symlinkSync(path.join(FAM,"promoted"),publicTmp);
if(fs.existsSync(publicLink)){
  fs.rmSync(publicLink,{recursive:true,force:true});
}
fs.renameSync(publicTmp,publicLink);

console.log("FAMILY_PROMOTED",JSON.stringify(artifact,null,2));
