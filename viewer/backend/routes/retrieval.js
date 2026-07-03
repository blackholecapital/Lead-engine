const fs=require("fs");
module.exports=app=>app.get("/api/retrieval",(q,r)=>{
const j=JSON.parse(fs.readFileSync("/mnt/eila-hot-sidecar/factory-xyz/runtime-c/factory/indexes/RETRIEVAL_CORPUS_INDEX.json"));
r.json({status:"ONLINE",engine:j.engine,manifests:j.source_manifests.length,outputs:j.outputs.length,db:j.db_location});
});
