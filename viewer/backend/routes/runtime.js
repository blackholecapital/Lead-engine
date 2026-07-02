const os=require("os");
const {execSync}=require("child_process");

module.exports=(app)=>{
app.get("/api/runtime",(req,res)=>{

const disk=execSync("df -h /mnt/eila-hot-sidecar | tail -1 | awk '{print $4}'").toString().trim();

res.json({
runtime:"ONLINE",
hostname:os.hostname(),
uptime:Math.floor(os.uptime()),
cpu:os.loadavg()[0].toFixed(2),
memory:Math.round((1-os.freemem()/os.totalmem())*100),
storage:disk,
jobs:0,
warehouse:"Ready",
indexes:"Healthy",
agents:"Idle"
});

});
};
