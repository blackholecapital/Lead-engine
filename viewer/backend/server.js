const express=require("express");
const cors=require("cors");

const app=express();
app.use(cors());

app.get("/api/runtime",(req,res)=>{
res.json({
runtime:"ONLINE",
retrievalJobs:0,
warehouse:"Ready",
storage:"48 GB",
indexes:"Healthy",
agents:"Idle",
cpu:0,
memory:0,
uptime:process.uptime()
});
});

app.listen(3001,()=>console.log("Tracer API listening on :3001"));
