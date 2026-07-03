const fs=require("fs"), crypto=require("crypto"), lancedb=require("./node_modules/@lancedb/lancedb");

const infile=process.argv[2];
const tableName=process.argv[3]||"runtime_c_vectors";
const cfg=JSON.parse(fs.readFileSync("factory/config/RUNTIME_C_RETRIEVAL.json","utf8"));

function hashVec(text, dims=384){
  const v=new Array(dims).fill(0);
  for(const tok of String(text).toLowerCase().split(/[^a-z0-9_]+/).filter(Boolean)){
    const h=crypto.createHash("sha256").update(tok).digest();
    const idx=h.readUInt32LE(0)%dims;
    const sign=(h[4]&1)?1:-1;
    v[idx]+=sign;
  }
  const n=Math.sqrt(v.reduce((a,b)=>a+b*b,0))||1;
  return v.map(x=>x/n);
}

async function embed(text){
  const host=process.env.OLLAMA_HOST||"http://127.0.0.1:11434";
  const model=process.env.OLLAMA_EMBED_MODEL||"nomic-embed-text";
  try{
    const res=await fetch(`${host}/api/embeddings`,{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({model,prompt:text})});
    if(res.ok){const j=await res.json(); if(Array.isArray(j.embedding)) return j.embedding;}
  }catch(e){}
  return hashVec(text);
}

(async()=>{
  const lines=fs.readFileSync(infile,"utf8").trim().split(/\n/).filter(Boolean);
  const db=await lancedb.connect(cfg.db_path);
  const batchSize=128;
  let made=0, table=null;
  for(let i=0;i<lines.length;i+=batchSize){
    const batch=[];
    for(const l of lines.slice(i,i+batchSize)){
      const r=JSON.parse(l);
      batch.push({...r, vector:await embed(r.text)});
    }
    if(!table){
      const names=await db.tableNames();
      if(names.includes(tableName)) await db.dropTable(tableName);
      table=await db.createTable(tableName,batch);
    }else await table.add(batch);
    made+=batch.length;
    console.log({table:tableName,made,total:lines.length});
  }
})();
