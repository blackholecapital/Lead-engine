const fs=require("fs");

module.exports=app=>app.get("/api/graphs",(req,res)=>{

const root="/mnt/eila-hot-sidecar/tracer-platform/imports/warehouse/graphs/nodes";
const edgeRoot="/mnt/eila-hot-sidecar/tracer-platform/imports/warehouse/graphs/edges";

let files=[];
let edges=[];

try{files=fs.readdirSync(root).filter(f=>f.endsWith(".node.json"));}catch{}
try{edges=fs.readdirSync(edgeRoot).filter(f=>f.endsWith(".json"));}catch{}

res.json({
status:"ONLINE",
nodes:files.length,
edgeFiles:edges.length,
files:files.sort()
});

});
