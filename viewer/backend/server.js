const express=require("express");
const cors=require("cors");
const os=require("os");
const {execSync}=require("child_process");

const app=express();
app.use(cors());

require("./routes/runtime")(app);
require("./routes/retrieval")(app);
require("./routes/indexes")(app);
require("./routes/storage")(app);
require("./routes/vectors")(app);
require("./routes/graphs")(app);
require("./routes/ranking")(app);
require("./routes/goldens")(app);
require("./routes/families")(app);
require("./routes/runs")(app);
require("./routes/bundles")(app);
require("./routes/search")(app);
require("./routes/inspect")(app);
require("./routes/previews")(app);
require("./routes/scores")(app);
require("./routes/warehouse")(app);

app.get("/api/review",(req,res)=>{

const files=execSync(
"find /mnt/eila-hot-sidecar/tracer-platform/review-center -type f 2>/dev/null | wc -l"
).toString().trim();

res.json({
status:"READY",
pending:Number(files),
files:Number(files)
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
