#!/usr/bin/env node
const fs=require("fs"), path=require("path");

const root=process.argv[2];
if(!root){console.error("usage: runtime-c-route-asset-parity.cjs <run_root>");process.exit(2);}

const output=path.join(root,"output");
if(!fs.existsSync(output)){console.error("missing output dir");process.exit(1);}

const pages=fs.readdirSync(output).filter(f=>f.endsWith(".html"));
const failures=[];

for(const page of pages){
  const p=path.join(output,page);
  let html=fs.readFileSync(p,"utf8");

  if(!/<head[\s>]/i.test(html)){
    html=html.replace(/<html[^>]*>/i, m=>`${m}\n<head></head>`);
  }

  if(!/<meta\s+name=["']viewport["']/i.test(html)){
    html=html.replace(/<\/head>/i,'  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n</head>');
  }

  if(!/<title>/i.test(html)){
    html=html.replace(/<\/head>/i,'  <title>Loose Lips Gentleman\'s Club</title>\n</head>');
  }

  if(!/styles\.css/i.test(html)){
    html=html.replace(/<\/head>/i,'  <link rel="stylesheet" href="styles.css">\n</head>');
  }

  if(!/app\.js/i.test(html)){
    html=html.replace(/<\/body>/i,'  <script src="app.js"></script>\n</body>');
  }

  fs.writeFileSync(p,html);

  const check=fs.readFileSync(p,"utf8");
  for(const need of ["styles.css","app.js","viewport","<title>"]){
    if(!check.includes(need)) failures.push(`${page}: missing ${need}`);
  }
}

const report={status:failures.length?"FAIL":"PASS",pages,failures};
fs.writeFileSync(path.join(root,"ROUTE_ASSET_PARITY.json"),JSON.stringify(report,null,2)+"\n");

if(failures.length){
  console.error("FAIL route asset parity",failures);
  process.exit(1);
}

console.log("PASS route asset parity");
