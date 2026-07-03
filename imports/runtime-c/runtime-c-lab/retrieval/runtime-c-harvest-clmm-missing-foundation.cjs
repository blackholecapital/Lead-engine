const fs=require("fs"), path=require("path"), {spawnSync}=require("child_process");

const RC="/mnt/eila-hot-sidecar/factory-xyz/runtime-c";
const OUT="/mnt/eila-hot-sidecar/runtime-c-assets/10-clmm-trading-lab";
const TOOL=path.join(RC,"tools/runtime-c-lab/retrieval/runtime-c-retrieve-context-auto.cjs");

const packs={
  "D-database-foundation":
    "postgres pgvector duckdb lancedb sqlite parquet arrow timeseries sql schema migrations indexes analytics local first database",

  "D-sql-graph-foundation":
    "sql graph apache age postgres graph cypher memgraph neo4j graph relationships wallet token pool position transaction edge node",

  "D-market-data-ingestion":
    "market data candles ohlcv swaps trades prices oracle token pairs pool snapshots volume fees liquidity rpc websocket indexer",

  "D-subgraph-indexers":
    "subgraph graph node uniswap v3 subgraph pancake subgraph schema mappings events pool tick position liquidity fees",

  "D-backtesting-engines":
    "backtesting trading simulator vectorbt backtrader freqtrade nautilus trader hummingbot paper trading pnl slippage fees",

  "D-agent-frameworks":
    "ai agent trading assistant langgraph pydanticai autogen crewai memory tools monitor alerts recommendations",

  "D-risk-execution-safety":
    "trading risk guardrails slippage max loss exposure approval simulation transaction safety wallet limits circuit breaker",

  "D-observability-monitoring":
    "monitoring metrics alerts logs dashboard health check rpc latency subgraph lag position monitor anomaly detection"
};

fs.mkdirSync(OUT,{recursive:true});

for (const [pack,objective] of Object.entries(packs)) {
  const runId=`CLMM-MISSING-${pack.toUpperCase()}`;
  const packDir=path.join(OUT,pack);
  fs.mkdirSync(packDir,{recursive:true});

  const r=spawnSync("node",[TOOL,"--objective",objective,"--lane","WA","--run-id",runId,"--top-k","80"],{
    cwd:RC,encoding:"utf8",env:{...process.env,REST_TOP_K:"24"}
  });

  if (r.status!==0) {
    console.error("FAILED",pack,r.stderr);
    continue;
  }

  const runDir=path.join(RC,"sandbox/runs",runId,"retrieval");
  for (const f of ["RETRIEVAL_HITS.json","QWEN_CONTEXT_BUNDLE.md"]) {
    fs.copyFileSync(path.join(runDir,f),path.join(packDir,f));
  }

  const hits=JSON.parse(fs.readFileSync(path.join(runDir,"RETRIEVAL_HITS.json"),"utf8"));
  fs.writeFileSync(path.join(packDir,"manifest.json"),JSON.stringify({
    pack, objective, run_id:runId, source_run_dir:runDir,
    candidates:hits.slice(0,40)
  },null,2));

  console.log({pack,hits:hits.length,folder:packDir});
}

console.log({done:true,out:OUT});
