const fs=require("fs");
const path=require("path");

const ROOT="/mnt/eila-hot-sidecar/Tracer-Dev/imports/warehouse/generated/readiness";

module.exports=app=>{

app.get("/api/readiness/:repo",(req,res)=>{

    const file=path.join(ROOT,req.params.repo+".json");

    if(!fs.existsSync(file))
        return res.sendStatus(404);

    res.json(JSON.parse(fs.readFileSync(file,"utf8")));

});

};
