const {execSync}=require("child_process");
module.exports=app=>app.get("/api/indexes",(q,r)=>{
const db="/mnt/eila-hot-sidecar/runtime-c-assets/indexes/runtime_c_assets.sqlite";
const rows=+execSync(`sqlite3 ${db} "select count(*) from registry_lines"`).toString().trim();
const cats=+execSync(`sqlite3 ${db} "select count(distinct category) from registry_lines"`).toString().trim();
r.json({status:"ONLINE",rows,categories:cats});
});
