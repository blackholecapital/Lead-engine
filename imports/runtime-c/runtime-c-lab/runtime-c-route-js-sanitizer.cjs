#!/usr/bin/env node
const fs=require("fs"), path=require("path");

const root=process.argv[2];
if(!root) process.exit(2);

const out=path.join(root,"output");
const app=path.join(out,"app.js");
const reg=path.join(out,"PAGE_REGISTRY.json");
const log=path.join(root,"EVENT_LOG.jsonl");

const emit=o=>fs.appendFileSync(log,JSON.stringify({
  ts:new Date().toISOString(),
  event:"ROUTE_JS_SANITIZER",
  ...o
})+"\n");

if(!fs.existsSync(app) || !fs.existsSync(reg)){
  emit({status:"SKIP"});
  process.exit(0);
}

const pageCount=JSON.parse(fs.readFileSync(reg,"utf8")).page_count || 0;
if(pageCount < 2){
  emit({status:"SKIP",page_count:pageCount});
  process.exit(0);
}

let js=fs.readFileSync(app,"utf8");

js = js.replace(
  /\/\/ Navigation Tabs[\s\S]*?\/\/ Hero CTA Button/,
  `// Navigation Tabs disabled for multipage output
  // Hero CTA Button`
);

js = js.replace(
  /section\.classList\.remove\("active"\);/g,
  `// section active mutation disabled`
);

fs.writeFileSync(app,js);
emit({status:"PASS",page_count:pageCount});
console.log("PASS runtime-c-route-js-sanitizer",pageCount);
