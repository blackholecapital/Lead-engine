const fs=require("fs"), path=require("path");

const BASE="/mnt/eila-hot-sidecar/runtime-c-assets/10-clmm-trading-packs";
const packs=["database-foundation","clmm-foundation","paper-trading","ai-trading-assistant"];

function sourcePath(c){
  if(c.path && fs.existsSync(c.path)) return c.path;
  const m=String(c.text||"").match(/\/mnt\/eila-hot-sidecar\/runtime-c-assets\/[^\s]+/);
  return m && fs.existsSync(m[0]) ? m[0] : null;
}

for(const pack of packs){
  const dir=path.join(BASE,pack);
  const hitsPath=path.join(dir,"RETRIEVAL_HITS.json");
  if(!fs.existsSync(hitsPath)) continue;

  const filesDir=path.join(dir,"files");
  fs.mkdirSync(filesDir,{recursive:true});

  const hits=JSON.parse(fs.readFileSync(hitsPath,"utf8"));
  const copied=[];

  hits.forEach((h,i)=>{
    const src=sourcePath(h);
    if(!src || !fs.existsSync(src) || !fs.statSync(src).isFile()) return;

    const safe=`${String(i+1).padStart(2,"0")}_${h.kind}_${path.basename(src)}`
      .replace(/[^a-zA-Z0-9._-]/g,"_");

    const dst=path.join(filesDir,safe);
    fs.copyFileSync(src,dst);
    copied.push({rank:i+1,kind:h.kind,key:h.key,repo:h.repo,source:src,copied_to:dst});
  });

  fs.writeFileSync(path.join(dir,"FILES.md"),
    [`# ${pack} copied files`, "", ...copied.map(f =>
      `- ${f.rank}. ${f.kind} ${f.key}\n  - repo: ${f.repo}\n  - source: ${f.source}\n  - copied: ${f.copied_to}`
    )].join("\n")
  );

  fs.writeFileSync(path.join(dir,"manifest.json"),JSON.stringify({pack,copied_files:copied},null,2));
  console.log({pack,copied:copied.length});
}
