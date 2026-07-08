const fs=require("fs");

module.exports=app=>app.get("/api/scores",(req,res)=>{

const dir="/mnt/eila-hot-sidecar/Tracer-Dev/imports/warehouse/scores/bootstrap";

let files=[];

try{
files=fs.readdirSync(dir).filter(f=>f.endsWith(".score.json"));
}catch{}

res.json({
status:"ONLINE",
count:files.length,
files:files.sort()
});

});
