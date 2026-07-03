const fs=require("fs");
const path=require("path");

const ROOT="/mnt/eila-hot-sidecar/tracer-platform/imports/warehouse";

const MAP={
  vector:"generated/vector-manifests",
  rank:"ranking",
  score:"scores/bootstrap",
  node:"graphs/nodes"
};

function load(dir,prefix){
    try{
        const full=path.join(ROOT,dir);
        const file=fs.readdirSync(full).find(f=>f.startsWith(prefix+"."));
        if(!file) return null;

        return {
            file,
            data:JSON.parse(
                fs.readFileSync(path.join(full,file),"utf8")
            )
        };
    }catch{
        return null;
    }
}

module.exports=app=>app.get("/api/related/:asset",(req,res)=>{

    const id=req.params.asset;

    res.json({
        id,
        vector:load(MAP.vector,id),
        rank:load(MAP.rank,id),
        score:load(MAP.score,id),
        node:load(MAP.node,id)
    });

});
