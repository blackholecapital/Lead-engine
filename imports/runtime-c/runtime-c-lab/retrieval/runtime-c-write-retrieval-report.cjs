#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

function normalizeTags(v) {
  if (Array.isArray(v)) return v.join(", ");

  if (typeof v === "string") {
    try {
      const parsed = JSON.parse(v);
      if (Array.isArray(parsed)) return parsed.join(", ");
    } catch {}
    return v;
  }

  return "";
}



const RC = "/mnt/eila-hot-sidecar/factory-xyz/runtime-c";

function arg(name, fallback = "") {
  const i = process.argv.indexOf(`--${name}`);
  return i >= 0 ? process.argv[i + 1] : fallback;
}

const runId = arg("run-id", "");
if (!runId) {
  console.error("usage: runtime-c-write-retrieval-report.cjs --run-id ID");
  process.exit(2);
}

const dir = path.join(RC, "sandbox/runs", runId, "retrieval");
const queryPath = path.join(dir, "RETRIEVAL_QUERY.json");
const hitsPath = path.join(dir, "RETRIEVAL_HITS.json");

if (!fs.existsSync(queryPath) || !fs.existsSync(hitsPath)) {
  console.error(`[retrieval:report] missing retrieval artifacts for run_id=${runId}`);
  console.error(`[retrieval:report] expected: ${queryPath}`);
  console.error(`[retrieval:report] expected: ${hitsPath}`);
  process.exit(2);
}

const query = JSON.parse(fs.readFileSync(queryPath, "utf8"));
const hits = JSON.parse(fs.readFileSync(hitsPath, "utf8"));

const byKind = hits.reduce((m, h) => {
  m[h.kind] = (m[h.kind] || 0) + 1;
  return m;
}, {});


const report = [
  `# Retrieval Report`,
  ``,
  `- run_id: ${query.run_id}`,
  `- generated_at: ${query.generated_at}`,
  `- engine: ${query.engine}`,
  `- retrieval_ms: ${query.retrieval_ms ?? "unknown"}`,
  `- candidate_rows: ${query.candidate_rows ?? "unknown"}`,
  `- lane: ${query.lane}`,
  `- objective: ${query.objective}`,
  `- hits: ${hits.length}`,
  `- hit_kinds: ${JSON.stringify(byKind)}`,
  ``,
  `## Top Hits`,
  ``,
  ...hits.map((h, i) => [
    `### ${i + 1}. ${h.key}`,
    ``,
    `- score: ${h.score}`,
    `- kind: ${h.kind}`,
    `- path: ${h.path}`,
    `- tags: ${normalizeTags(h.tags)}`,
    `- app_score: ${h.app_score || 0}`,
    ``
  ].join("\n"))
].join("\n");

fs.writeFileSync(path.join(dir, "RETRIEVAL_REPORT.md"), report);
console.log(path.join(dir, "RETRIEVAL_REPORT.md"));
