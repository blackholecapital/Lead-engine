const fs=require("fs");
const path=require("path");

const ROOT="/mnt/eila-hot-sidecar/tracer-platform/imports/warehouse/generated/vector-manifests";

module.exports=app=>app.get("/api/assets",(req,res)=>{
    let files=[];
    try{
        files=fs.readdirSync(ROOT).filter(f=>f.endsWith(".vector.json"));
    }catch{}

    const assets=files.map(f=>{
        const j=JSON.parse(fs.readFileSync(path.join(ROOT,f),"utf8"));
        return{
            id:j.id,
            title:j.title,
            category:j.category,
            tags:j.tags||[],
            source:j.source
        };
    });

    res.json(assets.sort((a,b)=>a.title.localeCompare(b.title)));
});
