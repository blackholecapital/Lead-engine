const fs=require("fs"), path=require("path"), {spawnSync}=require("child_process");

const RC="/mnt/eila-hot-sidecar/factory-xyz/runtime-c";
const OUT="/mnt/eila-hot-sidecar/runtime-c-assets/09-resource-packs";
const TOOL=path.join(RC,"tools/runtime-c-lab/retrieval/runtime-c-retrieve-context-auto.cjs");

const packs={
  invoices:"invoice billing payment pdf receipt quote estimate line items tax discount customer selector AOS_Invoices AOS_Quotes AOS_PDF_Templates",
  calendar:"calendar scheduler event meeting appointment task activity reminder drag drop month week day",
  tasks:"task list create edit status due date calendar activity reminder",
  contacts:"contact list create edit detail 360 notes activity company linking relationship",
  companies:"company account list create edit 360 documents notes activities contacts deals",
  deals:"deal opportunity pipeline stage activity notes documents contact company graph",
  documents:"document upload attach preview download relationship link file notes",
  notes:"note create edit delete timeline activity comments",
  automation:"workflow automation trigger action webhook email create record modify record n8n activepieces AOW_WorkFlow",
  reporting:"dashboard kpi metric pipeline revenue forecast reporting chart metabase"
};

fs.mkdirSync(OUT,{recursive:true});

for(const [pack,objective] of Object.entries(packs)){
  const runId=`HARVEST-${pack.toUpperCase()}`;
  const packDir=path.join(OUT,pack);
  fs.mkdirSync(packDir,{recursive:true});

  const r=spawnSync("node",[TOOL,"--objective",objective,"--lane","WA","--run-id",runId,"--top-k","60"],{
    cwd:RC,encoding:"utf8",env:{...process.env,REST_TOP_K:"20"}
  });

  if(r.status!==0){
    console.error(`FAILED ${pack}`,r.stderr);
    continue;
  }

  const runDir=path.join(RC,"sandbox/runs",runId,"retrieval");
  const hitsPath=path.join(runDir,"RETRIEVAL_HITS.json");
  const bundlePath=path.join(runDir,"QWEN_CONTEXT_BUNDLE.md");

  fs.copyFileSync(hitsPath,path.join(packDir,"RETRIEVAL_HITS.json"));
  fs.copyFileSync(bundlePath,path.join(packDir,"QWEN_CONTEXT_BUNDLE.md"));

  const hits=JSON.parse(fs.readFileSync(hitsPath,"utf8"));
  const manifest={
    pack,
    objective,
    run_id:runId,
    source_run_dir:runDir,
    candidates:hits.slice(0,25).map((h,i)=>({
      rank:i+1, score:h.score, dist:h.dist, kind:h.kind, key:h.key,
      repo:h.repo, domain:h.domain, path:h.path||null,
      text:String(h.text||"").slice(0,500)
    }))
  };
  fs.writeFileSync(path.join(packDir,"manifest.json"),JSON.stringify(manifest,null,2));
  console.log({pack,hits:hits.length,folder:packDir});
}

const index=Object.keys(packs).map(p=>`- [${p}](./${p}/manifest.json)`).join("\n");
fs.writeFileSync(path.join(OUT,"README.md"),`# Resource Pack Harvest\n\nGenerated candidate packs for CRM module assembly.\n\n${index}\n`);
console.log({done:true,out:OUT});
