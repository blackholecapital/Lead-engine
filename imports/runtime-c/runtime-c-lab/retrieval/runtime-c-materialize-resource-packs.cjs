const fs=require("fs"), path=require("path");

const OUT="/mnt/eila-hot-sidecar/runtime-c-assets/09-resource-packs";
const packs=fs.readdirSync(OUT).filter(f=>fs.statSync(path.join(OUT,f)).isDirectory());

function sourcePath(c){
  if(c.path && fs.existsSync(c.path)) return c.path;
  const m=String(c.text||"").match(/\/mnt\/eila-hot-sidecar\/runtime-c-assets\/[^\s]+/);
  return m && fs.existsSync(m[0]) ? m[0] : null;
}

for(const pack of packs){
  const dir=path.join(OUT,pack);
  const manifestPath=path.join(dir,"manifest.json");
  if(!fs.existsSync(manifestPath)) continue;

  const manifest=JSON.parse(fs.readFileSync(manifestPath,"utf8"));
  const filesDir=path.join(dir,"files");
  fs.mkdirSync(filesDir,{recursive:true});

  const copied=[];
  for(const c of manifest.candidates){
    const src=sourcePath(c);
    c.source_path=src;
    if(!src || !fs.statSync(src).isFile()) continue;

    const safe=`${String(c.rank).padStart(2,"0")}_${c.kind}_${path.basename(src)}`.replace(/[^a-zA-Z0-9._-]/g,"_");
    const dst=path.join(filesDir,safe);
    fs.copyFileSync(src,dst);
    copied.push({...c,copied_to:dst});
  }

  manifest.copied_files=copied;
  fs.writeFileSync(manifestPath,JSON.stringify(manifest,null,2));

  fs.writeFileSync(path.join(dir,"FILES.md"),
    [`# ${pack} copied files`, "", ...copied.map(f=>`- ${f.rank}. ${f.key}\n  - source: ${f.source_path}\n  - copied: ${f.copied_to}`)].join("\n")
  );

  console.log({pack,copied:copied.length});
}
