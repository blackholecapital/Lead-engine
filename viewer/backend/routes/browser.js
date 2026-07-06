const fs=require("fs");
const path=require("path");

const COMPONENTS="/mnt/eila-hot-sidecar/Tracer-Dev/imports/warehouse/generated/component-catalog";
const BROWSER="/mnt/eila-hot-sidecar/Tracer-Dev/imports/warehouse/generated/asset-browser";

module.exports=app=>app.get("/api/browser/:id",(req,res)=>{

    const componentFile=path.join(COMPONENTS,req.params.id+".json");

    if(!fs.existsSync(componentFile))
        return res.status(404).json({error:"missing component catalog"});

    const catalog=JSON.parse(fs.readFileSync(componentFile,"utf8"));

    let browser={};

    const browserFile=path.join(BROWSER,req.params.id+".json");

    if(fs.existsSync(browserFile)){
        browser=JSON.parse(fs.readFileSync(browserFile,"utf8"));
    }

    res.json({
        id:catalog.id,
        root:catalog.root,
        readmes:browser.readmes || [],
        stories:browser.stories || [],
        images:browser.images || [],
        components:catalog.components
    });

});
