const fs=require("fs");
const path=require("path");

const COMPONENTS="/mnt/eila-hot-sidecar/Tracer-Dev/imports/warehouse/generated/component-catalog";
const BROWSER="/mnt/eila-hot-sidecar/Tracer-Dev/imports/warehouse/generated/asset-browser";

const REPO_ROOTS={
  chatwoot:"/opt/eila-os/factory-xyz/runtime-c-assets/vendor-source/comms/chatwoot",
  memgraph:"/opt/eila-os/factory-xyz/runtime-c-assets/vendor-source/graph/memgraph",
  qdrant:"/opt/eila-os/factory-xyz/runtime-c-assets/vendor-source/retrieval/qdrant"
};

module.exports=app=>app.get("/api/component/:repo/:name",(req,res)=>{
  const compFile=path.join(COMPONENTS,req.params.repo+".json");
  if(!fs.existsSync(compFile)) return res.sendStatus(404);

  const catalog=JSON.parse(fs.readFileSync(compFile,"utf8"));

  const requestedPath=decodeURIComponent(req.query.path||"");

  const component=
    catalog.components.find(c=>c.path===requestedPath) ||
    catalog.components.find(c=>c.name===req.params.name);

  if(!component) return res.sendStatus(404);

  const repoRoot=REPO_ROOTS[req.params.repo] || catalog.root;
  const sourcePath=path.join(repoRoot,component.path);

  let source="";
  if(fs.existsSync(sourcePath))
    source=fs.readFileSync(sourcePath,"utf8");

  const imports=[...source.matchAll(/import .*?['"](.*?)['"]/g)].map(x=>x[1]);

  let images=[];
  const browserFile=path.join(BROWSER,req.params.repo+".json");

  if(fs.existsSync(browserFile)){
    const browser=JSON.parse(fs.readFileSync(browserFile,"utf8"));
    images=(browser.images||[]).filter(img=>{
      const n=path.basename(img).toLowerCase();
      return source.toLowerCase().includes(n);
    });
  }

  const related=catalog.components
    .filter(c=>
      c.path.split("/").slice(0,-1).join("/") ===
      component.path.split("/").slice(0,-1).join("/")
    )
    .slice(0,50);

  let previewFiles=[];
  const componentDir=path.dirname(sourcePath);

  if(fs.existsSync(componentDir)){
    previewFiles=fs.readdirSync(componentDir)
      .filter(f=>/\.(vue|tsx|jsx|ts|js|png|jpg|jpeg|gif|svg|webp)$/i.test(f))
      .sort();
  }

  res.json({
    repo:catalog.id,
    component,
    path:component.path,
    story:component.story,
    source,
    imports,
    images,
    related,
    previewFiles
  });
});
