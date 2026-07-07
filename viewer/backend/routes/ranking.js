const fs=require("fs");

module.exports=app=>app.get("/api/ranking",(req,res)=>{

const dir="/mnt/eila-hot-sidecar/Tracer-Dev/imports/warehouse/ranking";

let files=[];

try{
files=fs.readdirSync(dir).filter(f=>f.endsWith(".rank.json"));
}catch{}

res.json({
status:"ONLINE",
count:files.length,
files:files.sort()
});

});
