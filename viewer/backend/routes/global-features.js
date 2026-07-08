const fs=require("fs");
const path=require("path");

const ROOT="/mnt/eila-hot-sidecar/Tracer-Dev/imports/warehouse/generated/global-features";

module.exports=app=>{

app.get("/api/features",(req,res)=>{

    const files=fs.readdirSync(ROOT)
        .filter(f=>f.endsWith(".json"))
        .sort();

    res.json(files.map(f=>{
        const j=JSON.parse(fs.readFileSync(path.join(ROOT,f),"utf8"));
        return {
            feature:j.feature,
            count:j.count
        };
    }));

});

app.get("/api/features/global/:feature",(req,res)=>{

    const file=path.join(ROOT,req.params.feature+".json");

    if(!fs.existsSync(file))
        return res.sendStatus(404);

    let data=JSON.parse(fs.readFileSync(file,"utf8"));

    if(req.query.repo){
        data.components=data.components.filter(
            c=>c.repo===req.query.repo
        );
        data.count=data.components.length;
    }

    res.json(data);

});

};
