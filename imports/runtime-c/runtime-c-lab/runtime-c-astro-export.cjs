#!/usr/bin/env node
const fs=require("fs"), path=require("path");

const root=process.argv[2];
if(!root) process.exit(2);

const out=path.join(root,"output");
const astro=path.join(root,"astro-target");
const src=path.join(astro,"src");
const pagesDir=path.join(src,"pages");
const publicDir=path.join(astro,"public");

fs.rmSync(astro,{recursive:true,force:true});
fs.mkdirSync(pagesDir,{recursive:true});
fs.mkdirSync(path.join(src,"styles"),{recursive:true});
fs.mkdirSync(publicDir,{recursive:true});

const read=p=>fs.existsSync(p)?fs.readFileSync(p,"utf8"):"";

const htmlFiles=fs.readdirSync(out).filter(f=>f.endsWith(".html")).sort();

for(const file of htmlFiles){
  let html=read(path.join(out,file));
  const body=(html.match(/<body[^>]*>([\s\S]*?)<\/body>/i)||[])[1] || html;
  const name=file==="index.html" ? "index.astro" : file.replace(/\.html$/,".astro");

  fs.writeFileSync(path.join(pagesDir,name),`---
import "../styles/global.css";
---

${body.replace(/<script[^>]*src=["']\.\/app\.js["'][^>]*><\/script>/gi,"")}
<script src="/app.js"></script>
`);
}

fs.writeFileSync(path.join(src,"styles","global.css"), read(path.join(out,"styles.css")));
fs.copyFileSync(path.join(out,"app.js"), path.join(publicDir,"app.js"));

fs.writeFileSync(path.join(astro,"package.json"),JSON.stringify({
  scripts:{dev:"astro dev",build:"astro build",preview:"astro preview"},
  dependencies:{astro:"latest"}
},null,2)+"\n");

fs.writeFileSync(path.join(astro,"astro.config.mjs"),`import { defineConfig } from 'astro/config';

export default defineConfig({
  output: 'static'
});
`);

console.log("PASS runtime-c-astro-export", htmlFiles.length);
