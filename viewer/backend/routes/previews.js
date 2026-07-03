const {execSync}=require("child_process");
module.exports=app=>app.get("/api/previews",(q,r)=>{
const n=+execSync('find /mnt/eila-hot-sidecar/tracer-platform/imports/warehouse/previews -type f 2>/dev/null|wc -l').toString().trim();
r.json({status:"ONLINE",previews:n});
});
