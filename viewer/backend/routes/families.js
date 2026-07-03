const {execSync}=require("child_process");

module.exports=app=>app.get("/api/families",(req,res)=>{

const root="/mnt/eila-hot-sidecar/factory-xyz/runtime-c/families";

let count=0;

try{
count=+execSync(`find "${root}" -mindepth 1 -maxdepth 1 -type d|wc -l`).toString().trim();
}catch{}

res.json({
status:"ONLINE",
families:count
});

});
