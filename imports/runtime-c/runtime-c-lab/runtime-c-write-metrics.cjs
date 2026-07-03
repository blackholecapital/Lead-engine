const fs=require("fs");
const path=require("path");

const root=process.argv[2];
const output=path.join(root,"output");

function exists(f){
  return fs.existsSync(path.join(output,f));
}

const metrics={
  html:exists("index.html"),
  css:exists("styles.css"),
  js:exists("app.js"),
  ts:new Date().toISOString()
};

metrics.coverage=
(metrics.html?1:0)+
(metrics.css?1:0)+
(metrics.js?1:0);

fs.writeFileSync(
 path.join(root,"RUNTIME_METRICS.json"),
 JSON.stringify(metrics,null,2)
);

console.log("METRICS_WRITTEN");
