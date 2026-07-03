#!/usr/bin/env node
const fs=require("fs"), path=require("path");

const root=process.argv[2];
if(!root) process.exit(2);

const out=path.join(root,"output");
const registry=path.join(out,"PAGE_REGISTRY.json");
const routeGraph=path.join(out,"ROUTE_GRAPH.json");

fs.mkdirSync(out,{recursive:true});

function titleFromHtml(file){
  try{
    const html=fs.readFileSync(file,"utf8");
    const m=html.match(/<title[^>]*>([^<]+)<\/title>/i);
    if(m) return m[1].trim();
    const h=html.match(/<h1[^>]*>([^<]+)<\/h1>/i);
    if(h) return h[1].trim();
  }catch{}
  return path.basename(file,".html")
    .replace(/[-_]+/g," ")
    .replace(/\b\w/g,c=>c.toUpperCase());
}

function routeFromEntry(entry){
  if(entry==="index.html") return "/";
  return "/" + entry.replace(/\.html$/,"").replace(/^index$/,"");
}

const pages=fs.readdirSync(out)
  .filter(f=>f.endsWith(".html"))
  .sort((a,b)=>(a==="index.html"?-1:b==="index.html"?1:a.localeCompare(b)))
  .map(entry=>({
    route:routeFromEntry(entry),
    title:titleFromHtml(path.join(out,entry)),
    entry,
    source:`output/${entry}`,
    primary:entry==="index.html"
  }));

const links=[];
for(const p of pages){
  try{
    const html=fs.readFileSync(path.join(out,p.entry),"utf8");
    const hrefs=[...html.matchAll(/href=["']([^"']+)["']/gi)].map(x=>x[1]);
    for(const href of hrefs){
      if(href.startsWith("#") || href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("tel:")) continue;
      if(/\.(css|js|png|jpg|jpeg|svg|webp|gif|ico|json)$/i.test(href)) continue;
      links.push({from:p.entry,to:href});
    }
  }catch{}
}

fs.writeFileSync(registry,JSON.stringify({
  schema:"runtime-c.page_registry.v2",
  generated_at:new Date().toISOString(),
  page_count:pages.length,
  pages
},null,2)+"\n");

fs.writeFileSync(routeGraph,JSON.stringify({
  schema:"runtime-c.route_graph.v2",
  generated_at:new Date().toISOString(),
  routes:pages.map(p=>({route:p.route,entry:p.entry,title:p.title,primary:p.primary})),
  links
},null,2)+"\n");

console.log("PASS runtime-c-page-registry", pages.length);
