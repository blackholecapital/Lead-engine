const express=require("express");
const cors=require("cors");
const os=require("os");
const {execSync}=require("child_process");

const app=express();
app.use(cors());

app.get("/api/runtime",(req,res)=>{

const disk=execSync("df -h / | tail -1 | awk '{print $4}'").toString().trim();

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

app.get("/api/retrieval",(req,res)=>{
res.json({
status:"ONLINE",
documents:18342,
embeddings:18342,
qps:0
});
});

app.get("/api/storage",(req,res)=>{

const d=execSync("df -h / | tail -1").toString().trim().split(/\s+/);

res.json({
total:d[1],
used:d[2],
free:d[3],
percent:d[4].replace("%","")
});

});

app.get("/api/indexes",(req,res)=>{
const {execSync}=require("child_process");
const count=execSync("find /mnt/eila-hot-sidecar/tracer-platform/indexes -type f 2>/dev/null | wc -l").toString().trim();
res.json({status:"Healthy",indexes:Number(count)});
});
});

app.get("/api/warehouse",(req,res)=>{
res.json({
status:"ONLINE",
collections:8,
vectors:18342,
lastSync:new Date().toLocaleTimeString()
});
});

app.get("/api/review",(req,res)=>{
res.json({
status:"Idle",
pending:0
});
});

app.get("/api/agents",(req,res)=>{
res.json({
status:"Idle",
running:0
});
});

app.listen(3001,"0.0.0.0",()=>{
console.log("Tracer API listening on :3001");
});
