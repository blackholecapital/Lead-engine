const fs=require("fs"),P=require("../lib/paths");
module.exports=app=>app.get("/api/warehouse",(q,r)=>{
const w=JSON.parse(fs.readFileSync("/mnt/eila-hot-sidecar/factory-xyz/runtime-c/factory/indexes/WAREHOUSE_INDEX.json"));
r.json({status:"ONLINE",kind:w.kind,root:w.root,categories:w.top_dirs.length,generated:w.generated_at});
});
