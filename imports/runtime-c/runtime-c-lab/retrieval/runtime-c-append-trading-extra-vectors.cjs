const fs=require("fs"), crypto=require("crypto");
const lancedb=require("./node_modules/@lancedb/lancedb");

const cfg=JSON.parse(fs.readFileSync("factory/config/RUNTIME_C_RETRIEVAL.json","utf8"));
const rows=JSON.parse(fs.readFileSync("warehouse/retrieval/TRADING_EXTRA_LANCEDB_ROWS.json","utf8"));

function hashVec(text,dims=384){
  const v=new Array(dims).fill(0);
  for(const tok of String(text).toLowerCase().split(/[^a-z0-9_]+/).filter(Boolean)){
    const h=crypto.createHash("sha256").update(tok).digest();
    v[h.readUInt32LE(0)%dims]+=(h[4]&1)?1:-1;
  }
  const n=Math.sqrt(v.reduce((a,b)=>a+b*b,0))||1;
  return v.map(x=>x/n);
}

(async()=>{
  const db=await lancedb.connect(cfg.db_path);
  const t=await db.openTable("runtime_c_vectors_composer");

  const mapped=rows.map(r=>({
    id:r.id,
    kind:r.kind,
    key:r.key||"",
    name:r.name||"",
    repo:r.repo||"",
    domain:r.domain||"",
    path:r.path||"",
    text:[r.name,r.key,r.domain,r.repo,r.tags_text,r.text].filter(Boolean).join(" ").slice(0,4000),
    vector:hashVec([r.name,r.key,r.domain,r.repo,r.tags_text,r.text].filter(Boolean).join(" ").slice(0,4000))
  }));

  for(let i=0;i<mapped.length;i+=500){
    await t.add(mapped.slice(i,i+500));
    console.log({added:Math.min(i+500,mapped.length),total:mapped.length});
  }
})();
