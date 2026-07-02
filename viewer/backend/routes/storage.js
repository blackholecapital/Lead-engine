const {execSync}=require("child_process");

module.exports=(app)=>{
app.get("/api/storage",(req,res)=>{

const d=execSync("df -h /mnt/eila-hot-sidecar | tail -1").toString().trim().split(/\s+/);

res.json({
total:d[1],
used:d[2],
free:d[3],
percent:d[4].replace("%","")
});

});
};
