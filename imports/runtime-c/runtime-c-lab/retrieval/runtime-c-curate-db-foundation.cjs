const fs=require("fs"), path=require("path");

const ROOT="/mnt/eila-hot-sidecar/runtime-c-assets/10-clmm-trading-lab/repos-extra";
const OUT="/mnt/eila-hot-sidecar/runtime-c-assets/10-clmm-trading-packs/database-foundation-curated";

const targets={
  "duckdb": [
    "README.md","docs/**/*.md","extension/*/README.md","src/include/duckdb.hpp"
  ],
  "pgvector": [
    "README.md","sql/*.sql","src/hnsw*.c","src/ivf*.c","src/vector.c"
  ],
  "apache-age": [
    "README.md","doc/**/*.md","drivers/**/*.md","src/include/**/*.h"
  ],
  "memgraph": [
    "README.md","docs/**/*.md","mage/README.md"
  ],
  "graph-node": [
    "README.md","docker-compose.yml","docs/**/*.md","store/**/*.rs","graphql/**/*.rs"
  ],
  "uniswap-v3-subgraph": [
    "README.md","schema.graphql","subgraph.yaml","src/**/*.ts"
  ]
};

function walk(dir){
  if(!fs.existsSync(dir)) return [];
  const out=[];
  for(const e of fs.readdirSync(dir,{withFileTypes:true})){
    const p=path.join(dir,e.name);
    if(e.isDirectory()){
      if([".git","node_modules","target","dist","build"].includes(e.name)) continue;
      out.push(...walk(p));
    } else out.push(p);
  }
  return out;
}

function wanted(file, patterns){
  const rel=file.replace(ROOT+"/","");
  return patterns.some(p=>{
    const re="^"+p
      .replace(/[.+^${}()|[\]\\]/g,"\\$&")
      .replace(/\*\*/g,".*")
      .replace(/\*/g,"[^/]*")+"$";
    return new RegExp(re).test(rel.split("/").slice(1).join("/"));
  });
}

for(const [repo,patterns] of Object.entries(targets)){
  const srcDir=path.join(ROOT,repo);
  const dstDir=path.join(OUT,repo);
  fs.mkdirSync(dstDir,{recursive:true});

  const files=walk(srcDir)
    .filter(f=>wanted(f,patterns))
    .filter(f=>fs.statSync(f).size < 500000)
    .slice(0,80);

  const copied=[];
  for(const f of files){
    const rel=path.relative(srcDir,f);
    const safe=rel.replace(/[\/\\]/g,"__");
    const dst=path.join(dstDir,safe);
    fs.copyFileSync(f,dst);
    copied.push({repo,source:f,copied_to:dst,bytes:fs.statSync(f).size});
  }

  fs.writeFileSync(path.join(dstDir,"FILES.json"),JSON.stringify(copied,null,2));
  fs.writeFileSync(path.join(dstDir,"FILES.md"),
    [`# ${repo} curated files`, "", ...copied.map((x,i)=>`- ${i+1}. ${x.source}\n  - copied: ${x.copied_to}`)].join("\n")
  );
  console.log({repo,copied:copied.length});
}

const handoff=`# Database Foundation Curated Pack

Use this pack before building CLMM storage.

Location:

\`${OUT}\`

## Included

- DuckDB: local analytics / parquet / time-series reporting
- pgvector: vector memory and semantic strategy retrieval
- Apache AGE: SQL-native graph layer
- Memgraph: graph modeling / optional external graph engine
- Graph Node: subgraph indexing patterns
- Uniswap V3 Subgraph: pool, token, position, tick, swap entity model

## Build Target

Postgres should be the system of record.

Recommended foundation:

- PostgreSQL for canonical state
- pgvector for AI memory / strategy embeddings
- Apache AGE for SQL graph traversal
- DuckDB for local analytics and backtests
- Graph Node / Uniswap V3 Subgraph for event indexing patterns
- Memgraph as reference for graph modeling and graph algorithms

## Rule

Do not build live trading first.

Build:

1. schema
2. historical ingestion
3. graph relationships
4. analytics queries
5. paper simulation
6. AI monitoring
7. risk gates
8. live execution
`;

fs.writeFileSync(path.join(OUT,"DATABASE_FOUNDATION_HANDOFF.md"),handoff);
