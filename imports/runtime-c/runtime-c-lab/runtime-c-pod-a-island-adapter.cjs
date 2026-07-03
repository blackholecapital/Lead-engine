#!/usr/bin/env node
const { spawnSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const [,, promptPath, root] = process.argv;
if (!promptPath || !root) {
  console.error("usage: runtime-c-pod-a-island-adapter.cjs PROMPT_PATH RUN_ROOT");
  process.exit(2);
}

const runId = path.basename(root);
const buildsheet = path.join(root, "buildsheet.runtime-c-island.json");
const prompt = JSON.parse(fs.readFileSync(promptPath, "utf8"));
let full = {};
try { full = JSON.parse(fs.readFileSync(path.join(root, "buildsheet.full.json"), "utf8")); } catch {}

fs.writeFileSync(buildsheet, JSON.stringify({
  product_slug: full.product_slug || prompt.product_slug || runId,
  mode: full.mode || "initial_build",
  lane_cell_backend: "A",
  operator_goal: full.operator_goal || full.goal || prompt.task || "Runtime C island build.",
  outputs: full.outputs || [
    "output/index.html",
    "output/styles.css",
    "output/app.js",
    "output/CLASS_MANIFEST.json",
    "output/OPERATOR_REVIEW_CARD.md",
    "output/REGRESSION_PROOF.md"
  ]
}, null, 2));

const jobId = runId;
const script = "/opt/eila-os/factory-xyz/runtime-c/tools/runtime-c-lab/bin/runtime-c-pod-a-handoff.sh";
const res = spawnSync(script, [buildsheet, jobId], {
  encoding: "utf8",
  env: {
    ...process.env,
    RUNTIME_C_ISLAND: "/opt/eila-os/factory-xyz/runtime-c/tools/runtime-c-lab",
    RUNTIME_C_ISLAND_RUNROOT: "/opt/eila-os/factory-xyz/runtime-c/sandbox"
  }
});

fs.writeFileSync(path.join(root, "ISLAND_STDOUT.log"), res.stdout || "");
fs.writeFileSync(path.join(root, "ISLAND_STDERR.log"), res.stderr || "");

if (res.stdout) process.stdout.write(res.stdout);
if (res.stderr) process.stderr.write(res.stderr);


const islandArt = `/opt/eila-os/factory-xyz/runtime-c/sandbox/artifacts/${jobId}`;
function cpdir(src,dst){
  if (!fs.existsSync(src)) return false;
  fs.mkdirSync(dst,{recursive:true});
  for (const name of fs.readdirSync(src)) {
    const a=path.join(src,name), b=path.join(dst,name);
    const st=fs.statSync(a);
    if (st.isDirectory()) cpdir(a,b); else fs.copyFileSync(a,b);
  }
  return true;
}
cpdir(path.join(islandArt,"output"), path.join(root,"output"));
cpdir(path.join(islandArt,"proof"), path.join(root,"island_proof"));
cpdir(path.join(islandArt,"worker_packets"), path.join(root,"worker_packets"));
fs.writeFileSync(path.join(root,"ISLAND_IMPORT.json"), JSON.stringify({
  status: res.status === 0 ? "PASS" : "FAIL",
  island_artifacts: islandArt,
  imported_output: fs.existsSync(path.join(root,"output")),
  imported_proof: fs.existsSync(path.join(root,"island_proof"))
}, null, 2));


process.exit(res.status || 0);
