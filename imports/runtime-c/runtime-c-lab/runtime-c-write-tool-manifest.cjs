#!/usr/bin/env node
const fs=require("fs"), path=require("path"), crypto=require("crypto");
const root=process.argv[2] || null;
const lab="/opt/eila-os/factory-xyz/runtime-c/tools/runtime-c-lab";
const files=fs.readdirSync(lab).filter(f=>/\.(cjs|sh|json|md)$/.test(f)).sort();
const tools=files.map(f=>{
  const p=path.join(lab,f), b=fs.readFileSync(p);
  return {file:f,path:p,bytes:b.length,sha256:crypto.createHash("sha256").update(b).digest("hex")};
});
const out={schema_version:"factory67.runtime_c.tool_manifest.v1",status:"PASS",lab,tool_count:tools.length,tools,generated_at:new Date().toISOString()};
const dest=root ? path.join(root,"RUNTIME_C_TOOL_MANIFEST.json") : path.join(lab,"RUNTIME_C_TOOL_MANIFEST.json");
fs.writeFileSync(dest,JSON.stringify(out,null,2)+"\n");
console.log("PASS runtime-c-write-tool-manifest");
