const fs=require("fs");
const path=require("path");
const cp=require("child_process");

const run=process.argv[2];
if(!run){process.exit(1)}

const RUNROOT=`factory-xyz/runtime-c/sandbox/runs/${run}`;
const OUT=`${RUNROOT}/output`;

const REPO="/opt/eila-os";

if(!fs.existsSync(REPO)){
  console.error("repo missing");
  process.exit(1);
}

cp.execSync(`mkdir -p ${REPO}/runtime/${run}`);

cp.execSync(`cp ${OUT}/index.html ${REPO}/runtime/${run}/`);
cp.execSync(`cp ${OUT}/styles.css ${REPO}/runtime/${run}/`);
cp.execSync(`cp ${OUT}/app.js ${REPO}/runtime/${run}/`);

cp.execSync(`
cd ${REPO} &&
git add . &&
git commit -m "runtime export ${run}" || true
`);

console.log("PASS runtime export");
