#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const lancedb = require("@lancedb/lancedb");

const RC = "/mnt/eila-hot-sidecar/factory-xyz/runtime-c";
const CFG = JSON.parse(fs.readFileSync(path.join(RC, "factory/config/RUNTIME_C_RETRIEVAL.json"), "utf8"));

const seedPath = path.join(RC, "warehouse/retrieval/corpus/runtime_c_assets.seed.json");
const healthPath = path.join(RC, "warehouse/retrieval/lancedb/runtime_c_assets.health.json");

async function main() {
  const result = {
    healthy: false,
    seed_exists: fs.existsSync(seedPath),
    health_exists: fs.existsSync(healthPath),
    seed_rows: 0,
    health_rows: 0,
    table_rows_checked: false,
    table_open: false,
    table: CFG.table,
    db_path: CFG.db_path,
    checked_at: new Date().toISOString()
  };

  if (result.seed_exists) {
    const seed = JSON.parse(fs.readFileSync(seedPath, "utf8"));
    result.seed_rows = (seed.records || []).length;
  }

  if (result.health_exists) {
    const health = JSON.parse(fs.readFileSync(healthPath, "utf8"));
    result.health_rows = Number(health.rows || 0);
    result.last_build = health.last_build || "";
  }

  try {
    const db = await lancedb.connect(CFG.db_path);
    await db.openTable(CFG.table);
    result.table_open = true;
  } catch (e) {
    result.error = String(e.message || e);
  }

  result.healthy =
    result.seed_exists &&
    result.health_exists &&
    result.table_open &&
    result.seed_rows > 0 &&
    result.seed_rows === result.health_rows;

  console.log(JSON.stringify(result, null, 2));
  process.exit(result.healthy ? 0 : 1);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
