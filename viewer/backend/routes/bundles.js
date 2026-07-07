const fs=require("fs");

module.exports=app=>app.get("/api/bundles",(req,res)=>{

const dir="/mnt/eila-hot-sidecar/Tracer-Dev/imports/warehouse/generated/resource-bundles";

let files=[];

try{
files=fs.readdirSync(dir);
}catch{}

res.json({
status:"ONLINE",
bundles:files.length,
files
});

});
