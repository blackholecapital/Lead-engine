#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const RC = "/mnt/eila-hot-sidecar/factory-xyz/runtime-c";
const CONFIG = path.join(RC, "factory/config/RUNTIME_C_RETRIEVAL.json");
const CORPUS = path.join(RC, "factory/indexes/RETRIEVAL_CORPUS_INDEX.json");
const OUT = path.join(RC, "warehouse/retrieval/corpus/runtime_c_assets.seed.json");

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}

function uniq(a) {
  return [...new Set((a || []).filter(Boolean).map(String))];
}

function inferDomain(s) {
  s = String(s || "").toLowerCase();
  const domains = ["crm", "dashboard", "supabase", "auth", "react", "admin", "astro", "workflow", "ecommerce", "tailwind", "mui", "next", "vite"];
  return domains.filter(d => s.includes(d));
}

function sourceKind(file) {
  const base = path.basename(file);
  if (/QWEN_(GOLDEN_REPOS|TARGET_APPS|APP_REPOS)\.json$/.test(base)) return "qwen_app";
  if (/QWEN_REACT_ADMIN_EXAMPLES\.json$/.test(base)) return "react_admin_example";
  if (/QWEN_SUPABASE_EXAMPLES\.json$/.test(base)) return "supabase_example";
  if (/QWEN_.*APPS\.json$/.test(base)) return "qwen_domain_app";
  return "generic";
}

function textOfJson(obj) {
  return JSON.stringify(obj, null, 2).slice(0, 12000);
}

function recordText(v) {
  return uniq([
    v.repo,
    v.name,
    v.package,
    ...(v.tags || []),
    ...(v.deps || []),
    ...(v.scripts || []),
    ...(v.app_markers || []),
    v.path,
    v.kind,
    v.hint
  ]).join(" ");
}

function normalizeJson(file, obj) {
  const records = [];
  const sk = sourceKind(file);
  const base = path.basename(file);

  function pushApp(v, i) {
    const tags = uniq([...(v.tags || []), ...inferDomain(`${v.repo} ${v.name} ${v.package}`)]);
    records.push({
      id: `${sk}:${base}:${i}:${v.repo || v.package || v.path || "unknown"}`,
      kind: sk,
      source_file: file,
      path: v.package || v.path || file,
      repo: v.repo || "",
      package: v.package || "",
      key: v.name || v.repo || v.package || `record_${i}`,
      name: v.name || "",
      domain: tags[0] || "",
      tags,
      deps: uniq(v.deps || []),
      scripts: uniq(v.scripts || []),
      app_markers: uniq(v.app_markers || []),
      app_score: Number(v.app_score || v.score || v.rank || 0),
      text: recordText(v)
    });
  }

  function pushExample(v, i) {
    const inferred = inferDomain(`${v.path} ${v.hint} ${base}`);
    const tags = uniq([
      ...inferred,
      sk === "react_admin_example" ? "react-admin" : "",
      sk === "supabase_example" ? "supabase" : "",
      v.hint
    ]);
    records.push({
      id: `${sk}:${base}:${i}:${v.path || "unknown"}`,
      kind: sk,
      source_file: file,
      path: v.path || file,
      repo: "",
      package: "",
      key: path.basename(v.path || `record_${i}`),
      name: path.basename(v.path || ""),
      domain: tags[0] || "",
      tags,
      deps: [],
      scripts: [],
      app_markers: [],
      app_score: Number(v.app_score || 0),
      text: recordText(v)
    });
  }

  function pushGeneric(kind, key, value) {
    records.push({
      id: `${kind}:${base}:${key}`,
      kind,
      source_file: file,
      path: file,
      repo: value?.repo || "",
      package: value?.package || "",
      key: String(key),
      name: value?.name || "",
      domain: "",
      tags: Array.isArray(value?.tags) ? uniq(value.tags) : inferDomain(`${key} ${file}`),
      deps: Array.isArray(value?.deps) ? uniq(value.deps) : [],
      scripts: Array.isArray(value?.scripts) ? uniq(value.scripts) : [],
      app_markers: Array.isArray(value?.app_markers) ? uniq(value.app_markers) : [],
      app_score: Number(value?.app_score || value?.score || value?.rank || 0),
      text: typeof value === "string" ? value : textOfJson(value)
    });
  }

  if (Array.isArray(obj)) {
    obj.forEach((v, i) => {
      if (sk === "qwen_app" || sk === "qwen_domain_app") pushApp(v, i);
      else if (sk === "react_admin_example" || sk === "supabase_example") pushExample(v, i);
      else pushGeneric("json_array_item", i, v);
    });
  } else if (obj && typeof obj === "object") {
    for (const [k, v] of Object.entries(obj)) {
      if (Array.isArray(v)) v.forEach((x, i) => pushGeneric(k, `${k}.${i}`, x));
      else pushGeneric("json_object_entry", k, v);
    }
  }

  return records;
}

const cfg = readJson(CONFIG);
const corpus = readJson(CORPUS);

const sourceFiles = [];
for (const src of corpus.source_manifests || cfg.sources || []) {
  if (!fs.existsSync(src)) continue;
  const st = fs.statSync(src);
  if (st.isDirectory()) {
    sourceFiles.push(...walk(src).filter(f =>
      /\.(json|md|txt)$/i.test(f) &&
      !/node_modules|\.git/i.test(f) &&
      !/bundles\/[^/]+\/src\//i.test(f)
    ));
  } else {
    sourceFiles.push(src);
  }
}

const records = [];
for (const file of [...new Set(sourceFiles)]) {
  try {
    if (file.endsWith(".json")) {
      records.push(...normalizeJson(file, readJson(file)));
    } else {
      const text = fs.readFileSync(file, "utf8").slice(0, 12000);
      records.push({
        id: `text:${file}`,
        kind: path.extname(file).slice(1) || "text",
        source_file: file,
        path: file,
        repo: "",
        package: "",
        key: path.basename(file),
        name: path.basename(file),
        domain: "",
        tags: inferDomain(`${file} ${text.slice(0, 1000)}`),
        deps: [],
        scripts: [],
        app_markers: [],
        app_score: 0,
        text
      });
    }
  } catch (e) {
    records.push({
      id: `error:${file}`,
      kind: "ingest_error",
      source_file: file,
      path: file,
      repo: "",
      package: "",
      key: path.basename(file),
      name: path.basename(file),
      domain: "",
      tags: [],
      deps: [],
      scripts: [],
      app_markers: [],
      app_score: 0,
      text: String(e.message || e)
    });
  }
}

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify({
  generated_at: new Date().toISOString(),
  engine: "enriched_seed_before_lancedb",
  count: records.length,
  records
}, null, 2));

const byKind = records.reduce((m, r) => {
  m[r.kind] = (m[r.kind] || 0) + 1;
  return m;
}, {});

console.log(JSON.stringify({ out: OUT, count: records.length, byKind }, null, 2));
