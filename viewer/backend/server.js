const express=require("express");
const cors=require("cors");
const os=require("os");
const {execSync}=require("child_process");

const app=express();
app.use(cors());

app.get("/api/runtime",(req,res)=>{
let disk="Unknown";

try{
disk=execSync("df -h / | tail -1 | awk '{print $4}'").toString().trim();
}catch{}

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

app.listen(3001,"0.0.0.0",()=>console.log("Tracer API :3001"));

app.get("/api/retrieval",(req,res)=>{
res.json({status:"online",documents:0,queue:0});
});

app.get("/api/storage",(req,res)=>{
res.json({status:"online",drives:1,free:"Unknown"});
});

app.get("/api/indexes",(req,res)=>{
res.json({status:"healthy",indexes:0});
});

app.get("/api/warehouse",(req,res)=>{
res.json({status:"ready",datasets:0});
});

app.get("/api/review",(req,res)=>{
res.json({status:"idle",pending:0});
});

app.get("/api/agents",(req,res)=>{
res.json({status:"idle",running:0});
});
