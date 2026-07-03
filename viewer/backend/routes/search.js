const fs=require("fs");

module.exports=app=>app.get("/api/search",(req,res)=>{

const file="/mnt/eila-hot-sidecar/tracer-platform/imports/warehouse/generated/search-index/assets.jsonl";

let lines=0;

try{
lines=fs.readFileSync(file,"utf8").split("\n").filter(Boolean).length;
}catch{}

res.json({
status:"ONLINE",
documents:lines
});

});
