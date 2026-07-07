const fs=require("fs");
const path=require("path");

const ROOT="/mnt/eila-hot-sidecar/Tracer-Dev/imports/warehouse/previews";

module.exports=app=>app.get("/api/preview/:name",(req,res)=>{
    const file=path.join(ROOT,req.params.name);

    if(!fs.existsSync(file))
        return res.status(404).json({error:"missing"});

    res.sendFile(file);
});
