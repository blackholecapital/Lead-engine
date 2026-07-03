const fs=require("fs");
const path=require("path");

const root=process.argv[2];
const runId=path.basename(root);
const family=runId.replace(/-\d{8}T\d{6}Z$/,"");

const merged=path.join(root,"merged_product","output");
const CORE="/opt/eila-os/factory-xyz/runtime-c/core7";

const sandbox=path.join(CORE,"sandbox","candidates",runId);
const reportDir=path.join(CORE,"sandbox","reports");

fs.mkdirSync(sandbox,{recursive:true});
fs.mkdirSync(reportDir,{recursive:true});

function read(f){
 try{return fs.readFileSync(path.join(merged,f),"utf8")}
 catch{return ""}
}

const html=read("index.html");
const css=read("styles.css");
const js=read("app.js");

const duplicateIds=(html.match(/id=/g)||[]).length;
const scriptTags=(html.match(/<script/gi)||[]).length;
const viewport=html.includes('name="viewport"');

let score=100;

if(!viewport) score-=10;
if(scriptTags>5) score-=5;
if(duplicateIds>20) score-=5;

const report={
 family,
 run_id:runId,
 status:score>=80?"PASS":"FAIL",
 score,
 duplicate_ids:duplicateIds,
 script_tags:scriptTags,
 viewport,
 generated_at:new Date().toISOString()
};

fs.cpSync(merged,sandbox,{recursive:true});

fs.writeFileSync(
 path.join(reportDir,runId+".json"),
 JSON.stringify(report,null,2)+"\n"
);


console.log("CORE7_COMPLETE",report);

