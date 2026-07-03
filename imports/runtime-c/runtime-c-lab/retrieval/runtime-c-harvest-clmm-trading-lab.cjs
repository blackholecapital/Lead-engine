const fs=require("fs"), path=require("path"), {spawnSync}=require("child_process");

const RC="/mnt/eila-hot-sidecar/factory-xyz/runtime-c";
const OUT="/mnt/eila-hot-sidecar/runtime-c-assets/10-clmm-trading-lab";
const TOOL=path.join(RC,"tools/runtime-c-lab/retrieval/runtime-c-retrieve-context-auto.cjs");

const packs={
  "A-clmm-rebalancer-foundation":
    "clmm concentrated liquidity liquidity position nft range rebalance harvest compound deposit withdraw pool farm apr tvl fees tick price range vfat aerodrome uniswap v3 pancake v3 raydium meteora balancer dashboard portfolio",

  "A-clmm-ui-vfat-clone":
    "vfat yield farms pools deposits portfolio swap farm table pool detail deposit panel increase rebalance withdraw compound harvest apr rewards range chart filter dark dashboard",

  "A-clmm-data-indexing":
    "pool state tick liquidity swaps fees candles token pair price oracle subgraph events position nft graph sql postgres timeseries",

  "A-clmm-strategy-engine":
    "range strategy rebalance threshold volatility fee apr impermanent loss position manager backtest simulator optimizer",

  "B-paper-trading-platform":
    "paper trading backtesting simulator fake wallet virtual positions portfolio pnl orders fills slippage fees risk limits nautilus freqtrade hummingbot vectorbt backtrader",

  "B-paper-clmm-sandbox":
    "clmm simulator virtual liquidity position deposit withdraw rebalance harvest fees impermanent loss range nft paper account",

  "C-ai-trading-assistant":
    "ai trading assistant agent memory observations alerts recommendations risk monitor positions token pairs strategy outcome lancedb embeddings",

  "C-risk-and-guardrails":
    "risk engine max exposure max loss stop loss drawdown wallet approval human approval execution safety trading guardrails"
};

fs.mkdirSync(OUT,{recursive:true});

for (const [pack,objective] of Object.entries(packs)) {
  const runId=`CLMM-${pack.toUpperCase()}`;
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

fs.writeFileSync(path.join(OUT,"README.md"),
`# CLMM Trading Lab Resource Harvest

Root:

\`${OUT}\`

Systems:

## System A — CLMM Rebalancer / VFAT Clone
- A-clmm-rebalancer-foundation
- A-clmm-ui-vfat-clone
- A-clmm-data-indexing
- A-clmm-strategy-engine

## System B — Paper Trading Platform
- B-paper-trading-platform
- B-paper-clmm-sandbox

## System C — AI Trading Assistant
- C-ai-trading-assistant
- C-risk-and-guardrails

Each folder contains:

- manifest.json
- RETRIEVAL_HITS.json
- QWEN_CONTEXT_BUNDLE.md
`
);

console.log({done:true,out:OUT});
