const fs=require("fs");
const path=require("path");

const ROOT="/mnt/eila-hot-sidecar/Tracer-Dev/imports/warehouse/generated/story-catalog";

module.exports=app=>{

app.get("/api/stories/:repo",(req,res)=>{

    const f=path.join(ROOT,req.params.repo+".json");

    if(!fs.existsSync(f))
        return res.sendStatus(404);

    res.json(JSON.parse(fs.readFileSync(f,"utf8")));

});

};
