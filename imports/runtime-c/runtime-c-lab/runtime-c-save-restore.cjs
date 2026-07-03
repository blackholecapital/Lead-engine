const fs=require("fs");
const path=require("path");

const ROOT="/opt/eila-os/factory-xyz/runtime-c";
const stamp=new Date().toISOString().replace(/[:.]/g,"-");
const name=process.argv[2] || `runtime-c-${stamp}`;
const out=path.join(ROOT,"restore-points",name);

fs.mkdirSync(out,{recursive:true});

function cp(src,dst){
  if(fs.existsSync(src)) fs.cpSync(src,dst,{recursive:true});
}

cp(path.join(ROOT,"families"),path.join(out,"families"));
cp(path.join(ROOT,"indexes"),path.join(out,"indexes"));

fs.writeFileSync(path.join(out,"metadata.json"),JSON.stringify({
  name,
  created_at:new Date().toISOString(),
  root:ROOT,
  contents:["families","indexes"]
},null,2)+"\n");

console.log("RESTORE_POINT_CREATED",out);
