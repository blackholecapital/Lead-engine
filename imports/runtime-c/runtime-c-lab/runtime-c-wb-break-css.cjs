#!/usr/bin/env node
const fs=require("fs"), path=require("path");
const root=process.argv[2]; if(!root){console.error("usage: runtime-c-wb-break-css.cjs <run_root>");process.exit(2);}
const css=path.join(root,"output","styles.css");
if(!fs.existsSync(css)){console.error("FAIL missing styles.css");process.exit(1);}
let s=fs.readFileSync(css,"utf8");
s=s.split(/\n/).filter(line=>!line.startsWith(".primary-action")&&!line.startsWith(".toast")).join("\n")+"\n";
fs.writeFileSync(css,s);
console.log("PASS runtime-c-wb-break-css");
