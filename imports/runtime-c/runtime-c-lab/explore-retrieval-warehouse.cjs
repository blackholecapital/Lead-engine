const fs = require("fs");
const path = require("path");
const lancedb = require("@lancedb/lancedb");

const ROOT = "/mnt/eila-hot-sidecar/factory-xyz/runtime-c";
const DB_PATH = path.join(ROOT, "warehouse/retrieval/lancedb");
const TABLE = "runtime_c_assets";

function exists(p) {
  return fs.existsSync(p);
}

function walk(dir, maxDepth = 4, depth = 0, out = []) {
  if (!exists(dir) || depth > maxDepth) return out;
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    let st;
    try { st = fs.statSync(p); } catch { continue; }
    out.push(p);
    if (st.isDirectory()) walk(p, maxDepth, depth + 1, out);
  }
  return out;
}

function topCounts(rows, field, n = 30) {
  const m = {};
  for (const r of rows) {
    const v = r[field] || "none";
    m[v] = (m[v] || 0) + 1;
  }
  return Object.entries(m).sort((a,b) => b[1]-a[1]).slice(0,n);
}

function tokenHits(rows, terms) {
  const out = {};
  for (const term of terms) {
    const t = term.toLowerCase();
    out[term] = rows.filter(r =>
      `${r.repo || ""} ${r.domain || ""} ${r.tags || ""} ${r.tags_text || ""} ${r.kind || ""} ${r.path || ""} ${r.text || ""}`
        .toLowerCase()
        .includes(t)
    ).length;
  }
  return out;
}

(async () => {
  console.log("# Runtime-C Retrieval Warehouse Exploration\n");

  console.log("## Paths");
  for (const p of [
    ROOT,
    DB_PATH,
    path.join(ROOT, "QWEN_INDEX.json"),
    path.join(ROOT, "QWEN_BUNDLES_INDEX.json"),
    path.join(ROOT, "RESOURCE_MAP.md"),
    path.join(ROOT, "runtime-c-assets/indexes/qwen"),
    path.join(ROOT, "runtime-c-assets/registries"),
    path.join(ROOT, "tools/runtime-c-lab/runtime-c-lane-real.cjs"),
  ]) {
    console.log(`${exists(p) ? "OK  " : "MISS"} ${p}`);
  }

  console.log("\n## Candidate service/app directories");
  const serviceRoots = [
    "dashboard-patterns",
    "crm-platforms",
    "workflow-platforms",
    "database",
    "auth",
    "runtime-c-assets",
    "tools",
    "warehouse",
  ];
  for (const s of serviceRoots) {
    const p = path.join(ROOT, s);
    if (exists(p)) {
      console.log(`\n### ${s}`);
      for (const x of walk(p, 2).slice(0, 80)) console.log(path.relative(ROOT, x));
    }
  }

  console.log("\n## LanceDB");
  const db = await lancedb.connect(DB_PATH);
  const table = await db.openTable(TABLE);
  const rows = await table.query().limit(50000).toArray();

  console.log(`rows: ${rows.length}`);

  console.log("\n### By kind");
  console.table(topCounts(rows, "kind"));

  console.log("\n### By domain");
  console.table(topCounts(rows, "domain"));

  console.log("\n### By repo");
  console.table(topCounts(rows, "repo", 50));

  console.log("\n### Useful token hit counts");
  console.table(tokenHits(rows, [
    "supabase",
    "crm",
    "dashboard",
    "auth",
    "database",
    "migration",
    "schema",
    "sql",
    "react-admin",
    "budibase",
    "tooljet",
    "n8n",
    "golden",
    "template",
    "bi",
    "analytics",
    "clm",
    "score",
    "rank"
  ]));

  console.log("\n### Top app_score rows");
  const scored = rows
    .filter(r => Number.isFinite(Number(r.app_score)))
    .sort((a,b) => Number(b.app_score) - Number(a.app_score))
    .slice(0, 40)
    .map(r => ({
      app_score: r.app_score,
      repo: r.repo,
      domain: r.domain,
      kind: r.kind,
      path: r.path
    }));
  console.table(scored);

  console.log("\n### Suggested upgrade path");
  console.log(`
1. Add bundle retriever:
   tools/runtime-c-lab/runtime-c-bundle-retriever.cjs

2. Score repo clusters, not individual files:
   objective token overlap
   + repo/path/tag/domain matches
   + app_score boost
   + CLM/BI domain boost when present

3. Emit:
   QWEN_CONTEXT_BUNDLE.md

4. Wire centralized provider into:
   tools/runtime-c-lab/runtime-c-lane-real.cjs

5. Add vector search later as one extra feature:
   metadata_score + vector_score
`);
})();
