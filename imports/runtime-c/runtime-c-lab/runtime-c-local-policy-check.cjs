#!/usr/bin/env node
const fs=require("fs");

const input=process.argv[2];
const x=JSON.parse(fs.readFileSync(input,"utf8"));

const semanticIgnore=new Set([
  "html","body","main","header","footer","nav","section","article","aside",
  "form","table","thead","tbody","tr","th","td","button","input","select",
  "textarea","label"
]);

const softMissingIgnore=new Set(["submit-button"]);

const missing=Array.isArray(x.missing)
  ? x.missing.filter(v=>{
      const k=String(v).toLowerCase();
      return !semanticIgnore.has(k) && !softMissingIgnore.has(k);
    })
  : [];

const failures=[];
if(missing.length>1){
  failures.push({msg:`RUNTIME_C_MISSING_CLASSES: ${JSON.stringify(missing)}`});
}
if(Array.isArray(x.missing_declared_in_html)&&x.missing_declared_in_html.length){
  failures.push({msg:`RUNTIME_C_MISSING_DECLARED_HTML: ${JSON.stringify(x.missing_declared_in_html)}`});
}
if(Array.isArray(x.missing_declared_in_css)&&x.missing_declared_in_css.length){
  failures.push({msg:`RUNTIME_C_MISSING_DECLARED_CSS: ${JSON.stringify(x.missing_declared_in_css)}`});
}

console.log(JSON.stringify([{
  filename:input,
  namespace:"runtime_c_local",
  successes:failures.length?0:1,
  failures
}],null,2));

process.exit(failures.length?1:0);
