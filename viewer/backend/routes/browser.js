const fs=require("fs");
const path=require("path");

const ROOT="/mnt/eila-hot-sidecar/tracer-platform/imports/warehouse/generated/asset-browser";

module.exports=app=>app.get("/api/browser/:id",(req,res)=>{
    const f=path.join(ROOT,req.params.id+".json");

    if(!fs.existsSync(f))
        return res.status(404).json({error:"missing"});

    res.json(JSON.parse(fs.readFileSync(f,"utf8")));
});
