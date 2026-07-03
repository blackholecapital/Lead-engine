#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const RC = "/mnt/eila-hot-sidecar/factory-xyz/runtime-c";
const CFG = JSON.parse(fs.readFileSync(path.join(RC, "factory/config/RUNTIME_C_RETRIEVAL.json"), "utf8"));
const SEED = path.join(RC, "warehouse/retrieval/corpus/runtime_c_assets.seed.json");

function arg(name, fallback = "") {
  const i = process.argv.indexOf(`--${name}`);
  return i >= 0 ? process.argv[i + 1] : fallback;
}

const startedAt = Date.now();
const objective = arg("objective", "").trim();
const lane = arg("lane", "WA").trim();
const runId = arg("run-id", new Date().toISOString().replace(/[:.]/g, "-"));
const topK = Number(arg("top-k", CFG.top_k || 5));

if (!objective) {
  console.error("usage: runtime-c-retrieve-context.cjs --objective <text> [--lane WA|WB|WC] [--run-id ID] [--top-k N]");
  process.exit(2);
}

const runDir = path.join(RC, "sandbox/runs", runId, "retrieval");
fs.mkdirSync(runDir, { recursive: true });

const seed = JSON.parse(fs.readFileSync(SEED, "utf8"));
const records = seed.records || [];

function tokens(s) {
  return String(s || "")
    .toLowerCase()
    .split(/[^a-z0-9_@./-]+/)
    .filter(t => t.length > 2);
}

const qTokens = new Set(tokens(`${objective} ${lane}`));

function scoreRecord(r) {
  const text = `${r.key || ""} ${(r.tags || []).join(" ")} ${r.path || ""} ${r.text || ""}`;
  const toks = tokens(text);
  let overlap = 0;
  for (const t of toks) if (qTokens.has(t)) overlap++;

  const tagBoost = (r.tags || []).filter(t => qTokens.has(String(t).toLowerCase())).length * 20;
  const appBoost = Math.min(Number(r.app_score || 0), 200) / 10;
  const qwenBoost = /qwen|bundle|golden|crm|dashboard|supabase|auth/i.test(r.path || "") ? 5 : 0;
  const manifestPenalty =
    /QWEN_TOP_ROOTS|QWEN_INDEX_SYSTEM|FACTORY_INDEX|MAP_INDEX|RETRIEVAL_CORPUS_INDEX|RUNTIME_C_RETRIEVAL/i.test(r.path || "")
      ? -100
      : 0;

  return overlap + tagBoost + appBoost + qwenBoost + manifestPenalty;
}

const seen = new Set();

const hits = records
  .map(r => ({ ...r, score: scoreRecord(r) }))
  .filter(r => r.score > 0)
  .filter(r => {
    const key = r.repo || r.path || r.id;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  })
  .sort((a, b) => b.score - a.score)
  .slice(0, topK);

let total = 0;
const sections = [];
for (const h of hits) {
  const body = String(h.text || "").slice(0, Math.max(0, CFG.max_chars_per_hit || 6000));
  if (total >= (CFG.max_total_chars || 24000)) break;
  const allowed = Math.min(body.length, (CFG.max_total_chars || 24000) - total);
  const chunk = body.slice(0, allowed);
  total += chunk.length;

  sections.push([
    `## Hit: ${h.key}`,
    ``,
    `- score: ${h.score}`,
    `- kind: ${h.kind}`,
    `- path: ${h.path}`,
    `- tags: ${(h.tags || []).join(", ")}`,
    `- app_score: ${h.app_score || 0}`,
    ``,
    "```text",
    chunk,
    "```",
    ""
  ].join("\n"));
}

const query = {
  objective,
  lane,
  top_k: topK,
  run_id: runId,
  generated_at: new Date().toISOString(),
  engine: "lexical_seed_before_lancedb",
  retrieval_ms: Date.now() - startedAt,
  candidate_rows: records.length,
  hit_kinds: hits.reduce((m, h) => {
    m[h.kind] = (m[h.kind] || 0) + 1;
    return m;
  }, {})
};

fs.writeFileSync(path.join(runDir, "RETRIEVAL_QUERY.json"), JSON.stringify(query, null, 2));
fs.writeFileSync(path.join(runDir, "RETRIEVAL_HITS.json"), JSON.stringify(hits, null, 2));
fs.writeFileSync(path.join(runDir, "QWEN_CONTEXT_BUNDLE.md"), [
  `# Qwen Context Bundle`,
  ``,
  `Objective: ${objective}`,
  `Lane: ${lane}`,
  `Engine: lexical_seed_before_lancedb`,
  ``,
  ...sections
].join("\n"));

console.log(JSON.stringify({
  run_id: runId,
  run_dir: runDir,
  hits: hits.length,
  context_bundle: path.join(runDir, "QWEN_CONTEXT_BUNDLE.md")
}, null, 2));
