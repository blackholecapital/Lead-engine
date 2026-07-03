const fs=require("fs");
const path=require("path");
const cp=require("child_process");

const run=process.argv[2];
if(!run){
  console.error("usage: runtime-c-publish-full-repo.cjs <run-id>");
  process.exit(2);
}

const root="/opt/eila-os";
const runRoot=path.join(root,"factory-xyz/runtime-c/sandbox/runs",run);
const out=path.join(runRoot,"output");

if(!fs.existsSync(path.join(out,"index.html"))){
  console.error("missing output/index.html");
  process.exit(1);
}

const repoName=run.replace(/[^a-zA-Z0-9._-]/g,"-");
const stageBase="/mnt/eila-hot-sidecar/Factory-xyz/git/runner/jobs";
const dest=path.join(stageBase,repoName);

if(fs.existsSync(dest)){
  console.error("destination exists: "+dest);
  process.exit(1);
}

fs.mkdirSync(dest,{recursive:true});

const include=[
  ".factory",
  "apps",
  "builds",
  "config/local",
  "contracts/local",
  "deploy/local",
  "docs",
  "packages",
  "runtime",
  "scripts",
  "tests",
  "worker-wb",
  "xyz-factory-system"
];

for(const item of include){
  const src=path.join(root,item);
  const dst=path.join(dest,item);
  if(fs.existsSync(src)){
    fs.mkdirSync(path.dirname(dst),{recursive:true});
    cp.execFileSync("cp",["-a",src,dst]);
  }
}

fs.mkdirSync(path.join(dest,"output"),{recursive:true});
cp.execFileSync("cp",["-a",path.join(out,"index.html"),path.join(dest,"output/index.html")]);
cp.execFileSync("cp",["-a",path.join(out,"styles.css"),path.join(dest,"output/styles.css")]);
cp.execFileSync("cp",["-a",path.join(out,"app.js"),path.join(dest,"output/app.js")]);

if(fs.existsSync(path.join(runRoot,"buildsheet.full.json"))){
  cp.execFileSync("cp",["-a",path.join(runRoot,"buildsheet.full.json"),path.join(dest,"buildsheet.full.json")]);
}

fs.writeFileSync(path.join(dest,"build-sheet.txt"),
`Runtime-C published repo
RUN=${run}
SOURCE=${runRoot}
OUTPUT=${out}
PUBLISHED_AT=${new Date().toISOString()}
`);

cp.execSync("git init",{cwd:dest,stdio:"ignore"});
cp.execSync("git add .",{cwd:dest,stdio:"ignore"});
cp.execSync(`git commit -m "factory: auto publish ${repoName}"`,{cwd:dest,stdio:"ignore"});

console.log("PASS full repo staged: "+dest);
