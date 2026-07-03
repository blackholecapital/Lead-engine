const fs=require("fs");

module.exports=app=>app.get("/api/graphs",(req,res)=>{

const nodes="/mnt/eila-hot-sidecar/tracer-platform/imports/warehouse/graphs/nodes";
const edges="/mnt/eila-hot-sidecar/tracer-platform/imports/warehouse/graphs/edges";

let n=0,e=0;

try{n=fs.readdirSync(nodes).length;}catch{}
try{e=fs.readdirSync(edges).length;}catch{}

res.json({
status:"ONLINE",
nodes:n,
edgeFiles:e
});

});
