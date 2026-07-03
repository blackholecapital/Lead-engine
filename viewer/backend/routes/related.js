const fs=require("fs");
const path=require("path");

const ROOT="/mnt/eila-hot-sidecar/tracer-platform/imports/warehouse";

const MAP={
  vector:"generated/vector-manifests",
  rank:"ranking",
  score:"scores/bootstrap",
  node:"graphs/nodes"
};

module.exports=app=>app.get("/api/related/:asset",(req,res)=>{

  const asset=req.params.asset;
  const out={id:asset};

  for(const [type,dir] of Object.entries(MAP)){
    try{
      const full=path.join(ROOT,dir);
      const match=fs.readdirSync(full).find(f=>f.startsWith(asset+"."));
      if(match) out[type]=match;
    }catch(e){}
  }

  res.json(out);

});
