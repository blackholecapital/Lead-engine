#!/usr/bin/env node
const fs=require("fs"), path=require("path");
const root=process.argv[2], lane=process.argv[3]||"";
if(!root) throw new Error("usage: runtime-c-persist-fragments.cjs <run_root> [lane]");
const out=path.join(root,"output");
const frag=path.join(out,"fragments");
fs.mkdirSync(frag,{recursive:true});
const copy=(src,dst)=>{const s=path.join(out,src); if(fs.existsSync(s)) fs.copyFileSync(s,path.join(frag,dst));};
if(!lane || lane==="WA") copy("index.html","WA.html");
if(!lane || lane==="WB") copy("styles.css","WB.css");
if(!lane || lane==="WC") copy("app.js","WC.js");
const manifestPath=path.join(out,"CLASS_MANIFEST.json");
let manifest=null; try{manifest=JSON.parse(fs.readFileSync(manifestPath,"utf8"));}catch{}
const files=fs.readdirSync(frag).sort().map(f=>({file:"output/fragments/"+f,bytes:fs.statSync(path.join(frag,f)).size}));
const lineage={status:"PASS",created_at:new Date().toISOString(),run:path.basename(root),lane:lane||"ALL",fragments:files,class_manifest:manifest?{status:manifest.status,owner_lane:manifest.owner_lane,classes:manifest.classes||[]}:null};
fs.writeFileSync(path.join(root,"FRAGMENT_LINEAGE.json"),JSON.stringify(lineage,null,2)+"\n");
fs.appendFileSync(path.join(root,"EVENT_LOG.jsonl"),JSON.stringify({ts:new Date().toISOString(),event:"FRAGMENTS_PERSISTED",status:"PASS",lane:lane||"ALL",count:files.length})+"\n");
console.log("PASS runtime-c-persist-fragments", lane||"ALL");
