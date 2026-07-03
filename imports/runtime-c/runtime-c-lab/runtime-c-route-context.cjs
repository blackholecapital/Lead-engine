#!/usr/bin/env node
const fs=require("fs"), path=require("path");

const root=process.argv[2];
if(!root) process.exit(2);

const out=path.join(root,"output");
const reg=path.join(out,"PAGE_REGISTRY.json");
const graph=path.join(out,"ROUTE_GRAPH.json");
const dest=path.join(root,"ROUTE_CONTEXT.json");

const readJson=p=>fs.existsSync(p)?JSON.parse(fs.readFileSync(p,"utf8")):null;

const pageRegistry=readJson(reg);
const routeGraph=readJson(graph);

const pages=(pageRegistry?.pages||[]).map(p=>({
  route:p.route,
  entry:p.entry,
  title:p.title,
  primary:!!p.primary,
  exists:fs.existsSync(path.join(out,p.entry||""))
}));

fs.writeFileSync(dest,JSON.stringify({
  schema:"runtime-c.route_context.v1",
  generated_at:new Date().toISOString(),
  page_count:pages.length,
  primary:pages.find(p=>p.primary)||null,
  pages,
  links:routeGraph?.links||[]
},null,2)+"\n");

console.log("PASS runtime-c-route-context",pages.length);
