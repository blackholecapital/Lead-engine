#!/usr/bin/env node
const fs=require("fs"), path=require("path");

const root=process.argv[2];
if(!root) process.exit(2);

const out=path.join(root,"output");
const index=path.join(out,"index.html");
const log=path.join(root,"EVENT_LOG.jsonl");

const emit=o=>fs.appendFileSync(log,JSON.stringify({
  ts:new Date().toISOString(),
  event:"ROUTE_SPLITTER",
  ...o
})+"\n");

if(!fs.existsSync(index)){
  emit({status:"SKIP",reason:"missing index"});
  process.exit(0);
}

let html=fs.readFileSync(index,"utf8");

const title=(html.match(/<title[^>]*>([^<]+)<\/title>/i)||[])[1] || "Runtime C Site";
const head=(html.match(/<head[\s\S]*?<\/head>/i)||[])[0] || `<head><title>${title}</title><link rel="stylesheet" href="./styles.css"></head>`;
const nav=(html.match(/<nav[\s\S]*?<\/nav>/i)||[])[0] || "";

const routeMap=[
  ["events","Events"],
  ["packages","VIP Tables"],
  ["rules","House Rules"],
  ["contact","Contact"]
];

function extractSection(id){
  const re=new RegExp(`<section[^>]*(?:id=["']${id}["'][^>]*)>[\\s\\S]*?<\\/section>`,"i");
  const m=html.match(re);
  return m ? m[0] : "";
}

let created=0;

for(const [id,label] of routeMap){
  const section=extractSection(id);
  if(!section) continue;

  const pageNav=nav
    .replace(/href=["']#events["']/gi,'href="./events.html"')
    .replace(/href=["']#packages["']/gi,'href="./packages.html"')
    .replace(/href=["']#rules["']/gi,'href="./rules.html"')
    .replace(/href=["']#contact["']/gi,'href="./contact.html"')
    .replace(/href=["']#home["']/gi,'href="./index.html"')
    .replace(/href=["']\/["']/gi,'href="./index.html"');

  const page=`<!doctype html>
<html lang="en">
${head}
<body>
${pageNav}
<main class="route-page route-${id}">
${section}
</main>
<script src="./app.js"></script>
</body>
</html>
`;

  fs.writeFileSync(path.join(out,`${id}.html`),page);
  created++;
}

html=html
  .replace(/href=["']#events["']/gi,'href="./events.html"')
  .replace(/href=["']#packages["']/gi,'href="./packages.html"')
  .replace(/href=["']#rules["']/gi,'href="./rules.html"')
  .replace(/href=["']#contact["']/gi,'href="./contact.html"')
  .replace(/href=["']#home["']/gi,'href="./index.html"');

fs.writeFileSync(index,html);

emit({status:"PASS",created});
console.log("PASS runtime-c-route-splitter",created);
