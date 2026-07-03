#!/usr/bin/env node
const fs=require("fs"), path=require("path"), http=require("http"), https=require("https"), cp=require("child_process");
const root=process.argv[2];
if(!root) throw new Error("usage: runtime-c-context-enricher.cjs <run_root>");
const fullPath=path.join(root,"buildsheet.full.json");
const full=JSON.parse(fs.readFileSync(fullPath,"utf8"));
const write=(p,s)=>fs.writeFileSync(path.join(root,p),s);

function fetchUrl(url, timeoutMs=12000){
  return new Promise((resolve)=>{
    try{
      const mod=url.startsWith("https:")?https:http;
      const req=mod.get(url,{timeout:timeoutMs,headers:{"user-agent":"Runtime-C-Context-Enricher/1.0"}},res=>{
        let data="";
        res.setEncoding("utf8");
        res.on("data",c=>{ if(data.length<60000) data+=c; });
        res.on("end",()=>resolve({ok:true,url,status:res.statusCode,text:data.replace(/<script[\s\S]*?<\/script>/gi,"").replace(/<style[\s\S]*?<\/style>/gi,"").replace(/<[^>]+>/g," ").replace(/\s+/g," ").slice(0,12000)}));
      });
      req.on("timeout",()=>{req.destroy(); resolve({ok:false,url,error:"timeout"});});
      req.on("error",e=>resolve({ok:false,url,error:String(e.message||e)}));
    }catch(e){ resolve({ok:false,url,error:String(e.message||e)}); }
  });
}

function maybeRunSearch(query){
  const cmd=process.env.RUNTIME_C_SEARCH_CMD;
  if(!cmd || !query) return null;
  try{
    const out=cp.execFileSync(cmd,{input:query,encoding:"utf8",timeout:20000,maxBuffer:1024*1024});
    return out.slice(0,20000);
  }catch(e){ return "SEARCH_CMD_FAIL: "+String(e.message||e); }
}

async function ollamaVision(imagePath, prompt){
  if(!imagePath || !fs.existsSync(imagePath)) return null;
  const base=process.env.RUNTIME_C_VISION_BASE || process.env.OLLAMA_HOST || "";
  const model=process.env.RUNTIME_C_VISION_MODEL || process.env.OLLAMA_VISION_MODEL || "";
  if(!base || !model) return {ok:false,error:"vision not configured; set RUNTIME_C_VISION_BASE and RUNTIME_C_VISION_MODEL",image:imagePath};
  const img=fs.readFileSync(imagePath).toString("base64");
  const payload=JSON.stringify({model,prompt:prompt||"Analyze this reference image for website layout, colors, UI elements, style, and content cues. Return concise implementation notes.",images:[img],stream:false});
  const url=new URL("/api/generate",base);
  const mod=url.protocol==="https:"?https:http;
  return await new Promise(resolve=>{
    const req=mod.request({hostname:url.hostname,port:url.port||(url.protocol==="https:"?443:80),path:url.pathname,method:"POST",headers:{"content-type":"application/json","content-length":Buffer.byteLength(payload)},timeout:120000},res=>{
      let data="";
      res.on("data",c=>data+=c);
      res.on("end",()=>{try{const j=JSON.parse(data); resolve({ok:true,model,base,response:j.response||""});}catch(e){resolve({ok:false,error:String(e.message||e),raw:data.slice(0,1000)})}});
    });
    req.on("timeout",()=>{req.destroy(); resolve({ok:false,error:"vision timeout"});});
    req.on("error",e=>resolve({ok:false,error:String(e.message||e)}));
    req.write(payload); req.end();
  });
}

(async()=>{
  const enrich=full.context_enrichment || full.enrichment || full.tools_context || {};
  const urls=[...(enrich.urls||[]), ...(full.reference_urls||[]), ...(full.research_urls||[])].filter(Boolean);
  const queries=[...(enrich.search_queries||[]), ...(full.search_queries||[])].filter(Boolean);
  const imagePaths=[...(enrich.images||[]), ...(full.reference_images||[]), ...(full.uploaded_images||[]), ...(full.image_paths||[])].filter(Boolean);

  const web=[];
  for(const q of queries){ const r=maybeRunSearch(q); if(r) web.push({type:"search",query:q,result:r}); }
  for(const u of urls.slice(0,5)) web.push({type:"url",...(await fetchUrl(u))});

  const images=[];
  for(const img of imagePaths.slice(0,3)) images.push({image:img,analysis:await ollamaVision(img, enrich.image_prompt || full.objective_delta || full.objective || "")});

  const parentNotes=full.parent_context?.source_output ? {
    source_output:full.parent_context.source_output,
    files:["index.html","styles.css","app.js"].map(f=>{
      const p=path.join(full.parent_context.source_output,f);
      try{return {file:f,bytes:fs.statSync(p).size};}catch{return {file:f,missing:true};}
    })
  } : null;

  const ctx={status:"PASS",created_at:new Date().toISOString(),web,images,parent:parentNotes};
  write("CONTEXT_ENRICHMENT.json",JSON.stringify(ctx,null,2)+"\n");

  let md="# Runtime-C Context Enrichment\n\n";
  if(web.length){
    md+="## Web / Search Context\n";
    for(const w of web) md+=`\n### ${w.type}: ${w.query||w.url}\n${String(w.result||w.text||w.error||"").slice(0,4000)}\n`;
  }
  if(images.length){
    md+="\n## Image Context\n";
    for(const im of images) md+=`\n### ${im.image}\n${JSON.stringify(im.analysis,null,2).slice(0,6000)}\n`;
  }
  if(parentNotes) md+=`\n## Parent Context\n${JSON.stringify(parentNotes,null,2)}\n`;
  write("CONTEXT_ENRICHMENT.md",md);

  full.context_enrichment_result={status:"PASS",json:path.join(root,"CONTEXT_ENRICHMENT.json"),md:path.join(root,"CONTEXT_ENRICHMENT.md")};
  fs.writeFileSync(fullPath,JSON.stringify(full,null,2)+"\n");
  fs.appendFileSync(path.join(root,"EVENT_LOG.jsonl"),JSON.stringify({ts:new Date().toISOString(),event:"CONTEXT_ENRICHED",status:"PASS",web:web.length,images:images.length})+"\n");
  console.log("PASS runtime-c-context-enricher");
})().catch(e=>{
  fs.appendFileSync(path.join(root,"EVENT_LOG.jsonl"),JSON.stringify({ts:new Date().toISOString(),event:"CONTEXT_ENRICHED",status:"WARN",error:String(e.message||e)})+"\n");
  console.error("WARN runtime-c-context-enricher",e.message);
  process.exit(0);
});
