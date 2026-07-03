const fs=require("fs");
const path=require("path");

const root=process.argv[2] ? require("path").resolve(process.argv[2]) : process.cwd();
const runId=require("path").basename(root);
const runsRoot=require("path").dirname(root);
const family=runId.replace(/-\d{8}T\d{6}Z$/,"");


const out=path.join(root,"output");
fs.mkdirSync(out,{recursive:true});

function read(p){ return fs.existsSync(p)?fs.readFileSync(p,"utf8"):""; }
function write(p,s){ fs.mkdirSync(path.dirname(p),{recursive:true}); fs.writeFileSync(p,s); }

const H=read(path.join(out,"fragments","WA.html")) || read(path.join(out,"index.html"));
const C=read(path.join(out,"fragments","WB.css")) || read(path.join(out,"styles.css"));
const J=read(path.join(out,"fragments","WC.js")) || read(path.join(out,"app.js"));

let cleanH = H
  .replace(/\/\*\s*styles\.css\s*\*\/[\s\S]*$/m,"")
  .replace(/\/\*\s*app\.js\s*\*\/[\s\S]*$/m,"")
  .replace(/<link[^>]*styles\.css[^>]*>/g,"")
  .replace(/<script[^>]*app\.js[^>]*><\/script>/g,"")
  .trim();

write(path.join(out,"index.html"),`${cleanH}\n<link rel="stylesheet" href="./styles.css">\n<script src="./app.js"></script>`);
write(path.join(out,"styles.css"),C);
write(path.join(out,"app.js"),J);


const siblings=fs.readdirSync(runsRoot)
  .filter(x=>x.startsWith(family+"-"))
  .sort();

const merged=path.join(
  "/opt/eila-os/factory-xyz/runtime-c/products/runtime-c-merged",
  family,
  "output"
);

fs.rmSync(merged,{recursive:true,force:true});
fs.mkdirSync(merged,{recursive:true});

let htmlParts=[], cssParts=[], jsParts=[], sources=[];

for(const r of siblings){
  const ro=path.join(runsRoot,r,"output");
  if(!fs.existsSync(ro)) continue;
  htmlParts.push(read(path.join(ro,"index.html")));
  cssParts.push(read(path.join(ro,"styles.css")));
  jsParts.push(read(path.join(ro,"app.js")));
  sources.push(r);
}

write(path.join(merged,"index.html"), htmlParts.join("\n\n<!-- PASS SPLIT -->\n\n"));
write(path.join(merged,"styles.css"), cssParts.join("\n\n/* PASS SPLIT */\n\n"));
write(path.join(merged,"app.js"), jsParts.join("\n\n// PASS SPLIT\n\n"));

write(path.join(merged,"final_manifest.json"), JSON.stringify({
  family,
  run_id: runId,
  sources,
  output: {
    index_html:"index.html",
    styles_css:"styles.css",
    app_js:"app.js"
  },
  generated_at:new Date().toISOString()
}, null, 2));

console.log("COMPOSE PASS", {family, sources, merged});
