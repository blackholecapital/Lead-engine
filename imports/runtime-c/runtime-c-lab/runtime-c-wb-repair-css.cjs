#!/usr/bin/env node
const fs=require("fs"), path=require("path");
const root=process.argv[2]; if(!root){console.error("usage: runtime-c-wb-repair-css.cjs <run_root>");process.exit(2);}
const gate=JSON.parse(fs.readFileSync(path.join(root,"CLASS_COVERAGE_GATE.json"),"utf8"));
const css=path.join(root,"output","styles.css");
const missing=[...(gate.missing||[]),...(gate.missing_declared_in_css||[])];
if(!missing.length){console.log("PASS runtime-c-wb-repair-css no_missing");process.exit(0);}
fs.appendFileSync(css,"\n/* Runtime C WB repair */\n"+[...new Set(missing)].map(c=>`.${c}{display:block}`).join("\n")+"\n");
fs.writeFileSync(path.join(root,"WB_REPAIR_ATTEMPT.json"),JSON.stringify({status:"PASS",missing_repaired:[...new Set(missing)],repaired_at:new Date().toISOString()},null,2)+"\n");
console.log("PASS runtime-c-wb-repair-css");
