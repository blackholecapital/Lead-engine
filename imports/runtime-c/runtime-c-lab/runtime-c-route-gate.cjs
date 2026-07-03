#!/usr/bin/env node
const fs=require("fs"), path=require("path");

const root=process.argv[2];
if(!root) process.exit(2);

const out=path.join(root,"output");
const regPath=path.join(out,"PAGE_REGISTRY.json");
const graphPath=path.join(out,"ROUTE_GRAPH.json");
const reportPath=path.join(root,"ROUTE_GATE.json");

const fail=(warnings)=>{
  fs.writeFileSync(reportPath,JSON.stringify({status:"FAIL",warnings},null,2)+"\n");
  console.error("ROUTE_GATE_FAIL",warnings.join(","));
  process.exit(1);
};

const warnings=[];

if(!fs.existsSync(regPath)) warnings.push("MISSING_PAGE_REGISTRY");
if(!fs.existsSync(graphPath)) warnings.push("MISSING_ROUTE_GRAPH");
if(warnings.length) fail(warnings);

const reg=JSON.parse(fs.readFileSync(regPath,"utf8"));
const pages=Array.isArray(reg.pages)?reg.pages:[];

if(!pages.length) warnings.push("NO_PAGES");
if(!pages.some(p=>p.primary && p.entry==="index.html")) warnings.push("MISSING_PRIMARY_INDEX");

for(const p of pages){
  if(!p.entry || !fs.existsSync(path.join(out,p.entry))){
    warnings.push(`MISSING_PAGE_FILE_${p.entry||"unknown"}`);
  }
}

const graph=JSON.parse(fs.readFileSync(graphPath,"utf8"));
for(const link of graph.links||[]){
  const to=String(link.to||"");
  if(to.endsWith(".html") && !fs.existsSync(path.join(out,to))){
    warnings.push(`BROKEN_LINK_${link.from}_TO_${to}`);
  }
}

const status=warnings.length?"FAIL":"PASS";
fs.writeFileSync(reportPath,JSON.stringify({
  status,
  page_count:pages.length,
  warnings
},null,2)+"\n");

if(status==="FAIL"){
  console.error("ROUTE_GATE_FAIL",warnings.join(","));
  process.exit(1);
}

console.log("PASS runtime-c-route-gate",pages.length);
