const fs=require("fs");
const path=require("path");

const CATALOG="/mnt/eila-hot-sidecar/tracer-platform/imports/warehouse/generated/component-catalog";

module.exports=app=>app.get("/api/component/:repo/:name",(req,res)=>{
  const f=path.join(CATALOG,req.params.repo+".json");
  if(!fs.existsSync(f)) return res.sendStatus(404);

  const j=JSON.parse(fs.readFileSync(f,"utf8"));
  const c=j.components.find(x=>x.name===req.params.name);
  if(!c) return res.sendStatus(404);

  const full=path.join(j.root,c.path);
  const source=fs.existsSync(full)
    ? fs.readFileSync(full,"utf8").split("\n").slice(0,220).join("\n")
    : "";

  res.json({repo:j.id,component:c.name,path:c.path,story:c.story,source});
});
