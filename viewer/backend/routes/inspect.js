const fs=require("fs"),path=require("path");
const ROOT="/mnt/eila-hot-sidecar/tracer-platform/imports/warehouse";
const MAP={
vector:"generated/vector-manifests",
rank:"ranking",
node:"graphs/nodes",
score:"scores/bootstrap"
};
module.exports=app=>app.get("/api/inspect/:type/:name",(q,r)=>{
const dir=MAP[q.params.type]; if(!dir) return r.status(404).json({error:"type"});
const f=path.join(ROOT,dir,q.params.name);
try{r.json(JSON.parse(fs.readFileSync(f,"utf8")));}catch(e){r.status(404).json({error:"missing",file:f});}
});
