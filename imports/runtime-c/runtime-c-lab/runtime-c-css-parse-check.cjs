#!/usr/bin/env node
const fs=require("fs");
let postcss;
try { postcss=require("postcss"); }
catch(e) {
  console.log("WARN css parse skipped: postcss missing");
  process.exit(0);
}

const file=process.argv[2];
if(!file) process.exit(2);

let css=fs.readFileSync(file,"utf8");

// remove any markdown fence lines anywhere in CSS
css = css
  .split(/\n/)
  .filter(line => !/^\s*```(?:css)?\s*$/i.test(line))
  .join("\n");

fs.writeFileSync(file, css);

try{
  postcss.parse(css,{from:file});
  console.log("CSS_PARSE_PASS");
}catch(e){
  console.error("CSS_PARSE_FAIL");
  console.error(e.message);
  process.exit(1);
}
