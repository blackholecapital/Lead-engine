#!/usr/bin/env node
const fs=require("fs"), path=require("path");

const outDir="/opt/eila-os/factory-xyz/runtime-c/apps/web-public/assets/runtime-c-artifacts";
fs.mkdirSync(outDir,{recursive:true});

const uiRoot="/opt/eila-os/factory-xyz/runtime-c/apps/web-public/assets/runtime-c-operator";
const snapPtr="/tmp/runtime-c-operator-ui-hardened-readonly-latest.txt";

const exists=f=>fs.existsSync(f);
const stat=f=>exists(f)?fs.statSync(f):null;
const read=f=>{try{return fs.readFileSync(f,"utf8").trim()}catch{return null}};

const files=[
  "index.html",
  "styles.css",
  "app.js",
  "RUNTIME_C_UI_BOUNDARY.md",
  "RUNTIME_C_OPERATOR_UI_SPEC.md"
];

const artifacts=files.map(name=>{
  const full=path.join(uiRoot,name);
  const s=stat(full);
  return {
    name,
    runtime:"C",
    group:"runtime-c-operator-ui",
    type:name.endsWith(".md")?"proof_doc":name.endsWith(".js")?"frontend_js":name.endsWith(".css")?"frontend_css":"frontend_html",
    status:s?"PASS":"MISSING",
    path:`/assets/runtime-c-operator/${name}`,
    bytes:s?.size||0,
    updated_at:s?.mtime?.toISOString?.()||null
  };
});

const card={
  schema_version:"factory67.runtime_c.artifact_index.v1",
  runtime:"C",
  status:artifacts.every(a=>a.status==="PASS")?"PASS":"WARN",
  title:"Runtime C Operator UI",
  group:"runtime-c-operator-ui",
  open_ui:"/assets/runtime-c-operator/index.html",
  artifact_page:"/assets/runtime-c-artifacts/index.html",
  snapshot:read(snapPtr),
  artifacts,
  generated_at:new Date().toISOString()
};

fs.writeFileSync(path.join(outDir,"runtime-c-artifacts.json"),JSON.stringify(card,null,2)+"\n");
console.log(`${card.status} runtime-c-write-ui-artifact-index`);
if(card.status!=="PASS") process.exit(1);
