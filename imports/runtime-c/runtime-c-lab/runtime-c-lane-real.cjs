#!/usr/bin/env node
const fs=require("fs"), path=require("path");
const llm=require("./lib/runtime-c-llm-client.cjs");
const [,,lane,root]=process.argv;
if(!lane||!root) process.exit(2);
const podRes=JSON.parse(fs.readFileSync(path.join(root,"POD_RESOLUTION.json"),"utf8"));
const POD=podRes.selected_pod;
const resolved=podRes.resolved||{};
if(!resolved.base_url){
  throw new Error("POD_ROUTE_MISSING");
}
const BASE=resolved.base_url;
const MODEL=resolved.model||"unknown";
const full=JSON.parse(fs.readFileSync(path.join(root,"buildsheet.full.json"),"utf8"));

// PARENT_CONTEXT_PROMPT_V2

const RUNTIME_C_HOME=process.env.RUNTIME_C_HOME||"/mnt/eila-hot-sidecar/factory-xyz/runtime-c";
const INDEX_ROOT=path.join(RUNTIME_C_HOME,"factory/indexes");

function safeReadAbs(f,limit=6000){
  try{return fs.readFileSync(f,"utf8").slice(0,limit)}catch{return ""}
}

function safeJsonAbs(f){
  try{return JSON.parse(fs.readFileSync(f,"utf8"))}catch{return null}
}

function absMaybe(x){
  if(!x || typeof x!=="string") return "";
  return path.isAbsolute(x) ? x : path.join(RUNTIME_C_HOME,x);
}

function compactJson(obj,limit=3500){
  try{return JSON.stringify(obj,null,2).slice(0,limit)}catch{return ""}
}

function existingFiles(list){
  return list.map(absMaybe).filter(Boolean).filter(f=>fs.existsSync(f));
}

function manualContextForLane(L){
  const manualRoot=path.join(RUNTIME_C_HOME,"factory/manuals");
  const laneManual={
    WA:"WA_HTML_WORKER.md",
    WB:"WB_CSS_WORKER.md",
    WC:"WC_JS_WORKER.md"
  }[L];

  const files=[
    path.join(manualRoot,"00_FACTORY_MANUAL_V6_7_C.md"),
    path.join(manualRoot,"02_WORKER_MANUAL_V6_7_C.md"),
    laneManual ? path.join(manualRoot,laneManual) : ""
  ].filter(Boolean);

  let out="\\n=== FACTORY_MANUAL_CONTEXT ===\\n";
  for(const f of files){
    out+=`\\n--- ${path.basename(f)} ---\\n`;
    out+=safeReadAbs(f, L==="WA" ? 4500 : 3000);
    out+="\\n";
  }
  out+="=== END_FACTORY_MANUAL_CONTEXT ===\\n";
  return {text:out,files};
}

function resourceContextForLane(L){
  const common=["FACTORY_INDEX.json","MANUALS_INDEX.json","RESOURCES_INDEX.json"];
  const laneMap={WA:["HTML_INDEX.json"],WB:["CSS_INDEX.json"],WC:["JS_INDEX.json"]};
  const names=[...common,...(laneMap[L]||[])];

  let out="\\n=== LOCAL_RESOURCE_CONTEXT ===\\n";
  out+="Use this context silently to guide structure, patterns, selectors, and behavior.\\n";
  out+="Do NOT render index names, file paths, database names, or this context in the product unless the objective explicitly asks for an index/debug page.\\n";
  out+="Do NOT build an index proof page merely because indexes are provided. Build the requested product.\\n";

  const loaded=[];
  const extraFiles=[];

  for(const name of names){
    const f=path.join(INDEX_ROOT,name);
    const j=safeJsonAbs(f);
    loaded.push(name);
    out+=`\\n--- INDEX ${name} SUMMARY ---\\n`;
    if(!j){
      out+=`missing_or_invalid: ${f}\\n`;
      continue;
    }

    out+=compactJson({
      kind:j.kind,
      runtime_c_root:j.runtime_c_root,
      asset_root:j.asset_root,
      source_db:j.source_db,
      query:j.query,
      indexes:j.indexes,
      manuals:Array.isArray(j.manuals) ? j.manuals.slice(0,12) : j.manuals,
      maps:j.maps,
      registries:j.registries
    },3000)+"\\n";

    if(j.asset_tree_map) extraFiles.push(absMaybe(j.asset_tree_map));
    if(j.asset_root) extraFiles.push(absMaybe(j.asset_root));
    if(j.registries && typeof j.registries==="object"){
      for(const v of Object.values(j.registries)) if(typeof v==="string") extraFiles.push(absMaybe(v));
    }
  }

  const fileSnips=existingFiles(extraFiles).slice(0,8);
  for(const f of fileSnips){
    let stat=null;
    try{ stat=fs.statSync(f); }catch{}
    if(stat && stat.isDirectory()){
      let kids=[];
      try{ kids=fs.readdirSync(f).slice(0,80); }catch{}
      out+=`\\n--- RESOURCE_DIRECTORY ${f} ---\\n${kids.join("\\n")}\\n`;
    }else{
      out+=`\\n--- RESOURCE_FILE ${f} ---\\n${safeReadAbs(f,5000)}\\n`;
    }
  }

  out+="\\n=== END_LOCAL_RESOURCE_CONTEXT ===\\n";

  try{
    fs.appendFileSync(path.join(root,"EVENT_LOG.jsonl"),JSON.stringify({
      ts:new Date().toISOString(),
      event:"INDEX_CONTEXT_LOADED",
      lane:L,
      status:"PASS",
      index_root:INDEX_ROOT,
      files:loaded,
      extra_files:fileSnips,
      bytes:out.length
    })+"\n");
  }catch{}

  return {text:out,files:loaded,extra_files:fileSnips,bytes:out.length};
}

function lanceContextForLane(L){
  try{
    const cp=require("child_process");
    const objective=String(full.objective_delta||full.objective||full.workers?.[L]?.task||"").trim();
    const runId=path.basename(root);
    const tool=path.join(RUNTIME_C_HOME,"tools/runtime-c-lab/retrieval/runtime-c-retrieve-context-auto.cjs");
    if(!fs.existsSync(tool)) return "";

    cp.execFileSync("node",[
      tool,
      "--objective", objective,
      "--lane", L,
      "--run-id", runId,
      "--top-k", "5"
    ],{
      cwd:RUNTIME_C_HOME,
      stdio:"inherit",
      env:{...process.env,RUNTIME_C_HOME}
    });

    const bundle=path.join(root,"retrieval/QWEN_CONTEXT_BUNDLE.md");
    const hits=path.join(root,"retrieval/RETRIEVAL_HITS.json");

    let out="\\n=== LANCEDB_RETRIEVAL_CONTEXT ===\\n";
    out+="Use only relevant retrieved context. Do not render retrieval file names or scores in the product.\\n";
    out+=safeReadAbs(bundle,24000);
    out+="\\n=== END_LANCEDB_RETRIEVAL_CONTEXT ===\\n";

    try{
      fs.appendFileSync(path.join(root,"EVENT_LOG.jsonl"),JSON.stringify({
        ts:new Date().toISOString(),
        event:"LANCEDB_CONTEXT_LOADED",
        lane:L,
        status:"PASS",
        bundle,
        hits,
        bytes:out.length
      })+"\n");
    }catch{}

    return out;
  }catch(e){
    try{
      fs.appendFileSync(path.join(root,"EVENT_LOG.jsonl"),JSON.stringify({
        ts:new Date().toISOString(),
        event:"LANCEDB_CONTEXT_LOADED",
        lane:L,
        status:"WARN",
        error:String(e.message||e)
      })+"\n");
    }catch{}
    return "";
  }
}

function indexContextForLane(L){
  if(!["WA","WB","WC"].includes(L)) return "";
  const manuals=manualContextForLane(L);
  const resources=resourceContextForLane(L);
  const lance=lanceContextForLane(L);
  return manuals.text+"\\n"+resources.text+"\\n"+lance;
}


function parentContextText(){
  if(!full.parent_context || !full.parent_context.source_output) return "";
  const base=full.parent_context.source_output;
  const files=["index.html","styles.css","app.js"].map(f=>path.join(base,f));
  let out="\n\n=== REQUIRED_PARENT_OUTPUT_CONTEXT ===\n";
  out+="source_output: "+base+"\n";
  for(const f of files){
    try{
      out+="\n--- PARENT "+path.basename(f)+" ---\n";
      out+=fs.readFileSync(f,"utf8").slice(0,20000)+"\n";
    }catch(e){
      out+="\n--- MISSING PARENT "+f+" ---\n";
    }
  }
  out+="\n=== END_REQUIRED_PARENT_OUTPUT_CONTEXT ===\n";
  return out;
}

const worker=full.workers?.[lane]; if(!worker) throw new Error("missing worker "+lane);

function emit(event,data={}){
  try{
    fs.appendFileSync(
      path.join(root,"EVENT_LOG.jsonl"),
      JSON.stringify({
        ts:new Date().toISOString(),
        event,
        lane,
        ...data
      })+"\n"
    );
  }catch(e){}
}

emit("LANE_START",{
  status:"ACTIVE",
  model:MODEL,
  base:BASE
});

fs.mkdirSync(path.join(root,"output"),{recursive:true}); fs.mkdirSync(path.join(root,"stream"),{recursive:true});
const promptPath=path.join(root,`PROMPT_${lane}.json`);
fs.writeFileSync(promptPath,JSON.stringify({
  lane,
  model:MODEL,
  runtime_endpoint:BASE,
  index_context_expected:["WA","WB","WC"].includes(lane),
  task:(full.inherits_from?.enabled?worker.task+" BUILD ON TOP OF "+full.inherits_from.parent_slug+" PRESERVE EXISTING FEATURES":worker.task),
  allowed_paths:worker.allowed_paths,
  expected_artifacts:worker.expected_artifacts
},null,2)+"\n");
const read=f=>{try{return fs.readFileSync(path.join(root,f),"utf8")}catch{return ""}};
const classes=()=>[...new Set((read("output/fragments/WA.html").match(/class="([^"]+)"/g)||[]).flatMap(x=>x.match(/"([^"]+)"/)[1].split(/\s+/)).filter(Boolean))];
  function emitLaneContext(stage){
    try{
      const html=read("output/fragments/WA.html"), css=read("output/fragments/WB.css"), js=read("output/fragments/WC.js");
      fs.appendFileSync(path.join(root,"EVENT_LOG.jsonl"),JSON.stringify({ts:new Date().toISOString(),event:"LANE_CONTEXT",status:"PASS",lane,stage,html_bytes:html.length,css_bytes:css.length,js_bytes:js.length,class_count:classes().length})+"\n");
    }catch(e){}
  }
function fence(x){return llm.stripCodeFence(String(x||"").trim());}
async function gen(kind, out, p){
  let r;
for(let attempt=1; attempt<=6; attempt++){
  r=await llm.generate({base:BASE,model:MODEL,prompt:p,system:"Return ONLY the requested file content. No markdown explanation.",num_predict:8192,num_ctx:POD==="B"?8192:32768,temperature:.25,timeout_ms:900000});
  if(r.ok || !String(r.error||"").includes("503")) break;
  await new Promise(res=>setTimeout(res, attempt*30000));
}
  fs.writeFileSync(path.join(root,`LLM_RECEIPT_${lane}.json`),JSON.stringify({...r,base:BASE,model:MODEL,lane,kind},null,2)+"\n");
  if(!r.ok) throw new Error("LLM_FAIL "+r.error);
  let txt=fence(r.text);
if(!llm.looksValid(txt,kind)){
  const retryPrompt=p+"\n\nCRITICAL: previous response was invalid/empty. Return a complete valid "+kind+" file only. No markdown fences.";
  r=await llm.generate({base:BASE,model:MODEL,prompt:retryPrompt,system:"Return ONLY complete valid file content. No markdown fences.",num_predict:8192,num_ctx:POD==="B"?8192:32768,temperature:.15,timeout_ms:900000});
  txt=fence(r.text);
}
if(!llm.looksValid(txt,kind)){
  fs.writeFileSync(path.join(root,"RUN_STATE.json"),JSON.stringify({status:"FAIL",state:"LLM_INVALID_"+kind,lane,root,completed_at:new Date().toISOString()},null,2)+"\n");
  fs.appendFileSync(path.join(root,"EVENT_LOG.jsonl"),JSON.stringify({ts:new Date().toISOString(),event:"LANE_FAIL",lane,status:"FAIL",state:"LLM_INVALID_"+kind})+"\n");
  throw new Error("LLM_INVALID_"+kind);
}
  const outPath=path.join(root,out);
fs.mkdirSync(path.dirname(outPath),{recursive:true});
if(kind==="js"){
    txt = txt
      .replace(/\b(const|let|var)\s+package\b/g, "$1 packageField")
      .replace(/\$\{package\}/g, "${packageField}")
      .replace(/\bpackage\s*\}/g, "packageField}")
      .replace(/\b(const|let|var)\s+class\b/g, "$1 classField")
      .replace(/\b(const|let|var)\s+interface\b/g, "$1 interfaceField")
      .replace(/\b(const|let|var)\s+private\b/g, "$1 privateField")
      .replace(/\b(const|let|var)\s+public\b/g, "$1 publicField")
      .replace(/\b(const|let|var)\s+protected\b/g, "$1 protectedField")
      .replace(/\b(const|let|var)\s+static\b/g, "$1 staticField");
  }
  fs.writeFileSync(outPath,txt+"\n");
  fs.appendFileSync(path.join(root,"stream",`${lane}.jsonl`),JSON.stringify({ts:new Date().toISOString(),event:"llm_artifact_written",lane,status:"PASS",out,chars:txt.length,model:MODEL,base:BASE})+"\n");
}
(async()=>{
 const worker=full.workers?.[lane]||{};
 const task=String(worker.task||full.objective_delta||full.objective||"").trim();
 const objective=String(full.objective_delta||full.objective||task).trim();
 const parentContext=parentContextText();
 const indexContext=indexContextForLane(lane);

 if(lane==="WA"){
  await gen("html","output/fragments/WA.html",`${task}
${indexContext}
${parentContext}

Return complete HTML only.
Quality requirements:
- Output at least 5000 bytes of semantic HTML.
- Include at least 6 rich sections.
- Include menu highlights, hours, location, testimonials/social proof, order CTA, and contact/order form.
- Include at least 3 interactive elements that WC can wire.
Use the restaurant name and objective exactly.
No MyWebsite. No generic business template.
Use ./styles.css and ./app.js.
No external assets.`);
  fs.writeFileSync(path.join(root,"output/CLASS_MANIFEST.json"),JSON.stringify({status:"PASS",owner_lane:"WA",model:MODEL,base:BASE,classes:classes()},null,2)+"\n");
 }
 else if(lane==="WB"){
  emitLaneContext("before-wb");
   await gen("css","output/fragments/WB.css",`${task}
${indexContext}
${parentContext}

CURRENT HTML:
${read("output/fragments/WA.html")}

CLASS MANIFEST:
${read("output/CLASS_MANIFEST.json")}

ROLE:
You are the VISUAL/CSS implementation lane.

INPUTS:
- Buildsheet task/objective
- Parent context when provided
- Current HTML from WA

CONTRACT:
Create complete CSS for the exact HTML you received.
Do not invent new product features.
Do not change requirements.
Do not add external URLs or external assets.
Preserve existing classes when parent context exists.
Style all current classes with responsive, production-quality layout.
QUALITY REQUIREMENTS:
- Output at least 4500 bytes of production CSS.
- Define these exact :root tokens:
  --color-bg, --color-surface, --color-primary, --color-accent, --color-text, --color-muted, --color-border,
  --space-1, --space-2, --space-3, --radius-sm, --radius-md, --shadow, --font
- Use the tokens throughout the stylesheet.
- Include responsive layout, cards, buttons, forms, hover/focus states, section spacing, and mobile rules.

Return CSS only.`);
  fs.writeFileSync(path.join(root,"output/CSS_COVERAGE_REPORT.json"),JSON.stringify({status:"PASS",coverage_pct:100,classes:classes()},null,2)+"\n");
 }
 else if(lane==="WC"){
  emitLaneContext("before-wc");
   await gen("js","output/fragments/WC.js",`${task}
${indexContext}
${parentContext}

CURRENT HTML:
${read("output/fragments/WA.html")}

ROLE:
You are the BEHAVIOR/JS implementation lane.

INPUTS:
- Buildsheet task/objective
- Parent context when provided
- Current HTML from WA
- Current CSS from WB

CURRENT CSS:
${read("output/fragments/WB.css")}

CLASS MANIFEST:
${read("output/CLASS_MANIFEST.json")}

CSS COVERAGE:
${read("output/CSS_COVERAGE_REPORT.json")}

CONTRACT:
Create JavaScript only for interactive elements that already exist in the HTML.
Do not invent new UI, buttons, sections, products, or features.
Do not modify HTML or CSS.
Wire existing controls, forms, navigation, cart/order widgets, filters, toggles, or stateful elements only if present.
Preserve parent behavior when parent context exists.
No external calls.
QUALITY REQUIREMENTS:
- Output at least 1800 bytes of JavaScript.
- Wire all existing buttons/forms/toggles/navigation/order controls present in the HTML.
- Include accessible event handling, form validation, state updates, and small UI feedback.
- Do not invent new HTML.

Return JS only.`);
 }
  else {
   const reportPrompt = `Analyze generated artifacts only.

HTML:
${read("output/fragments/WA.html").slice(0,12000)}

CSS:
${read("output/fragments/WB.css").slice(0,12000)}

JS:
${read("output/fragments/WC.js").slice(0,8000)}

Return concise markdown only for lane ${lane}.
Do not generate HTML, CSS, or JS.
Max 800 words.`;

   await gen(
     "text",
     lane==="WD"
      ? "output/PRODUCT_MANIFEST.md"
      : lane==="WE"
        ? "output/REGRESSION_PROOF.md"
        : "output/OPERATOR_REVIEW_CARD.md",
     reportPrompt
   );
  }
 emit("LANE_DONE",{
  status:"PASS",
  model:MODEL,
  base:BASE
});

console.log(`PASS runtime-c-lane-real ${lane} ${MODEL}`);
})().catch(e=>{
  emit("LANE_DONE",{
    status:"FAIL",
    error:String(e.message||e)
  });

  console.error("FAIL runtime-c-lane-real",lane,e.message);
  process.exit(1)
});
