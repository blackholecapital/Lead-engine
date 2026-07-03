const {execSync}=require("child_process");

module.exports=app=>app.get("/api/goldens",(req,res)=>{

const root="/mnt/eila-hot-sidecar/factory-xyz/runtime-c/golden";

let count=0;

try{
count=+execSync(`find "${root}" -mindepth 1 -maxdepth 1 -type d|wc -l`).toString().trim();
}catch{}

res.json({
status:"ONLINE",
goldens:count
});

});
