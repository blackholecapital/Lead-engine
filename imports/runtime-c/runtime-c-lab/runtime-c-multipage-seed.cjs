#!/usr/bin/env node
const fs=require("fs"), path=require("path");

const root=process.argv[2];
if(!root) process.exit(2);

const out=path.join(root,"output");
const index=path.join(out,"index.html");
const services=path.join(out,"services.html");
const log=path.join(root,"EVENT_LOG.jsonl");

const emit=(data={})=>fs.appendFileSync(log,JSON.stringify({
  ts:new Date().toISOString(),
  event:"MULTIPAGE_SEED",
  ...data
})+"\n");

if(!fs.existsSync(index)){
  emit({status:"SKIP",reason:"missing index"});
  process.exit(0);
}

if(fs.existsSync(services)){
  emit({status:"PASS",created:false,page:"services.html"});
  process.exit(0);
}

const html=fs.readFileSync(index,"utf8");
const title=(html.match(/<title[^>]*>([^<]+)<\/title>/i)||[])[1] || "Runtime-C Product";

const servicesHtml=`<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${title} Services</title>
  <link rel="stylesheet" href="./styles.css">
</head>
<body>
  <main class="page page-services">
    <header class="page-header">
      <nav class="page-nav">
        <a href="./index.html">Home</a>
        <a href="./services.html" aria-current="page">Services</a>
      </nav>
      <h1>${title} Services</h1>
      <p>Explore service options, packages, and next-step actions for this local product experience.</p>
    </header>

    <section class="service-panel">
      <h2>Featured Services</h2>
      <article class="card service-card">
        <h3>Core Package</h3>
        <p>Primary service path with clear deliverables and local-first workflow.</p>
      </article>
      <article class="card service-card">
        <h3>Premium Package</h3>
        <p>Expanded service path with deeper support, scheduling, and guided review.</p>
      </article>
    </section>

    <section class="service-panel">
      <h2>Request Details</h2>
      <form class="service-form">
        <label>Name <input name="name" autocomplete="name"></label>
        <label>Service <select name="service"><option>Core Package</option><option>Premium Package</option></select></label>
        <button type="submit">Save Request Locally</button>
      </form>
    </section>
  </main>
  <script src="./app.js"></script>
</body>
</html>
`;

fs.writeFileSync(services,servicesHtml);
emit({status:"PASS",created:true,page:"services.html"});
console.log("PASS runtime-c-multipage-seed services.html");
