#!/usr/bin/env node
const fs=require("fs"), path=require("path");
const root=process.argv[2]; if(!root){console.error("usage: runtime-c-verify-wa-artifacts.cjs <run_root>");process.exit(2);}
const island=fs.existsSync(path.join(root,"ISLAND_IMPORT.json"))?JSON.parse(fs.readFileSync(path.join(root,"ISLAND_IMPORT.json"),"utf8")):{};
const req=["output/index.html","output/CLASS_MANIFEST.json","PROMPT_WA.json"];
let missing=req.filter(f=>!fs.existsSync(path.join(root,f)));
const has_command_exec=fs.existsSync(path.join(root,"POD_COMMAND_WA.json"))&&fs.existsSync(path.join(root,"LANE_EXEC_WA.json"));
const has_direct_real=fs.existsSync(path.join(root,"LLM_RECEIPT_WA.json"))&&fs.existsSync(path.join(root,"stream/WA.jsonl"));
if(!has_command_exec && !has_direct_real) missing.push("WA_EXEC_PROOF");
let manifest_status="UNKNOWN";
try { JSON.parse(fs.readFileSync(path.join(root,"output/CLASS_MANIFEST.json"),"utf8")); manifest_status="PASS"; } catch { manifest_status="FAIL"; }
const status=missing.length||manifest_status==="FAIL"?"FAIL":"PASS";
fs.writeFileSync(path.join(root,"VERIFY_WA_ARTIFACTS.json"),JSON.stringify({status,missing,manifest_status,checked_at:new Date().toISOString()},null,2)+"\n");
console.log(`${status} runtime-c-verify-wa-artifacts`);
if(status==="FAIL") process.exit(1);
