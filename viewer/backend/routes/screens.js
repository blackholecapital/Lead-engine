const fs=require("fs");
const path=require("path");

const ROOT="/mnt/eila-hot-sidecar/tracer-platform/imports/warehouse/previews";

module.exports=app=>app.get("/api/assets/:id/screens",(req,res)=>{

    const id=req.params.id;

    let files=[];

    try{
        files=fs.readdirSync(ROOT)
            .filter(f=>f.startsWith(id+"."))
            .filter(f=>/\.(png|jpg|jpeg|webp)$/i.test(f))
            .sort();
    }catch{}

    res.json({
        id,
        count:files.length,
        images:files.map(f=>({
            name:f,
            url:`/api/preview/${f}`
        }))
    });

});
