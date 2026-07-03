#!/usr/bin/env node
const fs=require("fs"), path=require("path"), crypto=require("crypto");
const root=process.argv[2]; if(!root){console.error("usage: runtime-c-mutation-check.cjs <run_root>");process.exit(2);}
const base=JSON.parse(fs.readFileSync(path.join(root,"MUTATION_BASELINE.json"),"utf8"));
const hash=p=>fs.existsSync(p)?crypto.createHash("sha256").update(fs.readFileSync(p)).digest("hex"):null;
const rows=base.rows.map(r=>({path:r.path,before:r.sha256,after:hash(r.path),status:r.sha256===hash(r.path)?"PASS":"FAIL"}));
const status=rows.every(r=>r.status==="PASS")?"PASS":"FAIL";
fs.writeFileSync(path.join(root,"MUTATION_CHECK.json"),JSON.stringify({status,rows,checked_at:new Date().toISOString()},null,2)+"\n");
console.log(`${status} runtime-c-mutation-check`);
if(status==="FAIL") process.exit(1);
