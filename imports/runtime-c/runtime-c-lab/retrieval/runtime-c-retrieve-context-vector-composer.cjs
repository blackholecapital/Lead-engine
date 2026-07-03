#!/usr/bin/env node
const fs=require("fs"), path=require("path"), {spawnSync}=require("child_process");

const args=process.argv.slice(2);
const get=(k,d="")=>{const i=args.indexOf(k); return i>=0 ? args[i+1] : d};
const objective=get("--objective", args.join(" "));
const runId=get("--run-id", `VECTOR-${Date.now()}`);
const topK=get("--top-k","40");

const RC="/mnt/eila-hot-sidecar/factory-xyz/runtime-c";
const runDir=path.join(RC,"sandbox/runs",runId,"retrieval");
fs.mkdirSync(runDir,{recursive:true});

const r=spawnSync("node",[
  path.join(RC,"tools/runtime-c-lab/retrieval/runtime-c-vector-composer-search.cjs"),
  objective
],{encoding:"utf8",env:{...process.env,TOP_K:topK}});

if(r.status!==0){ process.stderr.write(r.stderr||""); process.exit(r.status||1); }


const hits=JSON.parse(r.stdout);

const rr=spawnSync("node",[
  path.join(RC,"tools/runtime-c-lab/retrieval/runtime-c-vector-rest-search.cjs"),
  objective
],{encoding:"utf8",env:{...process.env,TOP_K:process.env.REST_TOP_K||"12"}});

const restHits = process.env.NO_REST==="1" ? [] : (rr.status===0 ? JSON.parse(rr.stdout).map(h=>({...h, kind:`rest_${h.kind}`})) : []);
hits.push(...restHits);

fs.writeFileSync(path.join(runDir,"RETRIEVAL_HITS.json"),JSON.stringify(hits,null,2));

const md=[
  `# QWEN CONTEXT BUNDLE`,
  ``,
  `Run: ${runId}`,
  `Objective: ${objective}`,
  `Retriever: vector-composer+rest`,
  ``,
  ...hits.map((h,i)=>[
    `## ${i+1}. ${h.kind} ${h.key}`,
    `score=${h.score} dist=${h.dist} repo=${h.repo} domain=${h.domain}`,
    ``,
    h.text || "",
    ``
  ].join("\n"))
].join("\n");

const bundle=path.join(runDir,"QWEN_CONTEXT_BUNDLE.md");
fs.writeFileSync(bundle,md);

console.log(JSON.stringify({run_id:runId,run_dir:runDir,hits:hits.length,context_bundle:bundle,retriever:"vector-composer+rest"},null,2));
