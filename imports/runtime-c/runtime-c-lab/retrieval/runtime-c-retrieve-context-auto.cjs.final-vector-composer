#!/usr/bin/env node
const fs = require("fs");
const { spawnSync } = require("child_process");
const path = require("path");

const RC = "/mnt/eila-hot-sidecar/factory-xyz/runtime-c";
const TOOL_DIR = path.join(RC, "tools/runtime-c-lab/retrieval");
const SEED = path.join(RC, "warehouse/retrieval/corpus/runtime_c_assets.seed.json");

function run(script) {
  return spawnSync("node", [path.join(TOOL_DIR, script), ...process.argv.slice(2)], {
    stdio: "inherit",
    env: process.env
  });
}

function runNoArgs(script) {
  return spawnSync("node", [path.join(TOOL_DIR, script)], {
    stdio: "inherit",
    env: process.env
  });
}

let r = run("runtime-c-retrieve-context-vector-composer.cjs");

if (r.status !== 0) {
  console.error("[retrieval:auto] vector composer unavailable; falling back to LanceDB scorer");
  r = run("runtime-c-retrieve-context-lancedb.cjs");
}

if (r.status !== 0 && fs.existsSync(SEED)) {
  console.error("[retrieval:auto] LanceDB failed; rebuilding table from corpus seed");
  const rebuild = runNoArgs("runtime-c-build-lancedb-table.cjs");
  if (rebuild.status === 0) {
    console.error("[retrieval:auto] rebuild complete; retrying LanceDB retrieval");
    r = run("runtime-c-retrieve-context-lancedb.cjs");
  }
}

if (r.status !== 0) {
  console.error("[retrieval:auto] LanceDB unavailable; falling back to lexical retriever");
  r = run("runtime-c-retrieve-context.cjs");
}

process.exit(r.status || 0);
