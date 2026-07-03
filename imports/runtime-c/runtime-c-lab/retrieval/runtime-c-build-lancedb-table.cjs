#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const lancedb = require("@lancedb/lancedb");

const RC = "/mnt/eila-hot-sidecar/factory-xyz/runtime-c";
const CONFIG = JSON.parse(fs.readFileSync(path.join(RC, "factory/config/RUNTIME_C_RETRIEVAL.json"), "utf8"));
const SEED = path.join(RC, "warehouse/retrieval/corpus/runtime_c_assets.seed.json");
const STATS = path.join(RC, "warehouse/retrieval/lancedb/runtime_c_assets.table.stats.json");
const HEALTH = path.join(RC, "warehouse/retrieval/lancedb/runtime_c_assets.health.json");

function safeText(v, max = 12000) {
  return String(v || "").slice(0, max);
}

async function main() {
  const seed = JSON.parse(fs.readFileSync(SEED, "utf8"));
  const db = await lancedb.connect(CONFIG.db_path);

  const rows = (seed.records || []).map((r, i) => ({
    id: String(r.id || `row_${i}`),
    kind: String(r.kind || ""),
    source_file: String(r.source_file || ""),
    path: String(r.path || ""),
    repo: String(r.repo || ""),
    package: String(r.package || ""),
    key: String(r.key || ""),
    name: String(r.name || ""),
    domain: String(r.domain || ""),
    tags: JSON.stringify(r.tags || []),
    tags_text: Array.isArray(r.tags) ? r.tags.join(" ") : String(r.tags || ""),
    deps: JSON.stringify(r.deps || []),
    deps_text: Array.isArray(r.deps) ? r.deps.join(" ") : String(r.deps || ""),
    scripts: JSON.stringify(r.scripts || []),
    app_markers: JSON.stringify(r.app_markers || []),
    app_score: Number(r.app_score || 0),
    text: safeText(r.text)
  }));

  try {
    await db.dropTable(CONFIG.table);
  } catch {}

  const table = await db.createTable(CONFIG.table, rows);

  const stats = {
    generated_at: new Date().toISOString(),
    db_path: CONFIG.db_path,
    table: CONFIG.table,
    rows: rows.length,
    seed_engine: seed.engine,
    by_kind: rows.reduce((m, r) => {
      m[r.kind] = (m[r.kind] || 0) + 1;
      return m;
    }, {})
  };

  fs.writeFileSync(STATS, JSON.stringify(stats, null, 2));
  fs.writeFileSync(HEALTH, JSON.stringify({
    healthy: true,
    table: CONFIG.table,
    rows: rows.length,
    seed_rows: (seed.records || []).length,
    db_path: CONFIG.db_path,
    last_build: stats.generated_at,
    seed_engine: seed.engine
  }, null, 2));

  console.log(JSON.stringify(stats, null, 2));
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
