const fs=require("fs");
const path=require("path");

module.exports=app=>app.get("/api/vectors",(req,res)=>{
const root="/mnt/eila-hot-sidecar/Tracer-Dev/imports/warehouse/generated/vector-manifests";

let files=[];
try{
files=fs.readdirSync(root).filter(f=>f.endsWith(".vector.json"));
}catch{}

res.json({
status:"ONLINE",
count:files.length,
vectors:files.sort()
});
});
