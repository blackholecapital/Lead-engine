#!/usr/bin/env node
const fs=require("fs"), path=require("path");

const root=process.argv[2];
if(!root){console.error("usage: runtime-c-image-context-bridge.cjs <run_root>");process.exit(2);}

const base="/opt/eila-os/factory-xyz/runtime-c";
const full=path.join(root,"buildsheet.full.json");
const ctx=path.join(base,"warehouse/image-analysis/context/IMAGE_CONTEXT.json");

if(!fs.existsSync(full)) process.exit(0);

const sheet=JSON.parse(fs.readFileSync(full,"utf8"));
const ref=sheet.reference||{};
if(!ref.use_image || !ref.image_file) process.exit(0);

const img=path.join(base,"warehouse/image-analysis/inbox",ref.image_file);
if(!fs.existsSync(img)) throw new Error("REFERENCE_IMAGE_NOT_FOUND: "+img);

const report={
  status:"PASS",
  image_file:ref.image_file,
  image_path:img,
  carry_forward:ref.carry_forward!==false,
  scanned_at:new Date().toISOString(),
  guidance:"Use this screenshot as the visual source of truth for layout, hierarchy, spacing, dark command-center style, cards, panels, nav, dashboard structure, and interaction density."
};

fs.mkdirSync(path.dirname(ctx),{recursive:true});
fs.writeFileSync(ctx,JSON.stringify(report,null,2)+"\n");
fs.writeFileSync(path.join(root,"IMAGE_REFERENCE.json"),JSON.stringify(report,null,2)+"\n");

console.log("PASS image context bridge");
