const fs=require("fs"), crypto=require("crypto"), lancedb=require("./node_modules/@lancedb/lancedb");

const query=process.argv.slice(2).join(" ") || "create invoice from account contact quote";
const tableName=process.env.VECTOR_TABLE || "runtime_c_vectors_composer";
const cfg=JSON.parse(fs.readFileSync("factory/config/RUNTIME_C_RETRIEVAL.json","utf8"));

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
  const t=await db.openTable(tableName);
  const hits=await t.search(hashVec(query)).limit(Number(process.env.TOP_K||20)).toArray();
  console.log(JSON.stringify(hits.map(h=>({score:h._distance,kind:h.kind,key:h.key,repo:h.repo,domain:h.domain,text:String(h.text||"").slice(0,180)})),null,2));
})();
