#!/usr/bin/env node
const fs = require("fs");
const input = process.argv[2], output = process.argv[3];
if (!input || !output) { console.error("usage: runtime-c-patch-buildsheet.cjs <input.json> <output.json>"); process.exit(2); }
const bs = JSON.parse(fs.readFileSync(input,"utf8"));
bs.extension = String(bs.extension || "RUNTIME_B").includes("CLASS_HANDOFF") ? bs.extension : String(bs.extension || "RUNTIME_B") + "_CLASS_HANDOFF_STAGGERED_V1";
bs.runtime_c = {
  enabled: true,
  mode: "staggered-two-phase",
  contract: "factory67.runtime_c.staggered_class_handoff.v1",
  phase_order: [
    { phase: "producer", lanes: ["WA"], required_before_next: ["output/index.html", "output/CLASS_MANIFEST.json"] },
    { phase: "dependent_parallel", lanes: ["WB","WC","WD","WE","WF"], required_inputs: ["output/CLASS_MANIFEST.json"] },
    { phase: "checker", tools: ["runtime-c-class-contract-check.cjs"], required_before_publish: ["output/CSS_COVERAGE_REPORT.json"] },
    { phase: "policy", tools: ["opa/conftest"] }
  ]
};
if (!Array.isArray(bs.class_contract) && Array.isArray(bs.shared_context?.class_contract)) bs.class_contract = bs.shared_context.class_contract;
bs.quality_gates = bs.quality_gates || {};
bs.quality_gates.require_html_size_min = Number(bs.quality_gates.require_html_size_min ?? 5000);
bs.quality_gates.require_css_size_min = Number(bs.quality_gates.require_css_size_min ?? 2600);
bs.quality_gates.require_js_size_min = Number(bs.quality_gates.require_js_size_min ?? 1000);
bs.quality_gates.require_css_coverage_min = Number(bs.quality_gates.require_css_coverage_min ?? 70);
const req = new Set(Array.isArray(bs.required_artifacts) ? bs.required_artifacts : []);
bs.mode==="iteration_pass" ? ["output/CLASS_MANIFEST.json","output/CSS_COVERAGE_REPORT.json"] : ["output/index.html","output/styles.css","output/app.js","output/CLASS_MANIFEST.json","output/CSS_COVERAGE_REPORT.json"].forEach(x => req.add(x));
bs.required_artifacts = [...req];
bs.artifact_contract = bs.artifact_contract || {};
const ac = new Map((bs.artifact_contract.required_artifacts || []).map(x => [x.path || x, x]));
bs.required_artifacts.forEach(p => ac.set(p, {path:p}));
bs.artifact_contract.required_artifacts = [...ac.values()];
bs.workers = bs.workers || {};
const WA = bs.workers.WA || {};
WA.enabled = WA.enabled !== false;
WA.allowed_paths = [...new Set([...(WA.allowed_paths || []), "output/index.html", "output/CLASS_MANIFEST.json"])];
WA.expected_artifacts = [...new Set([...(WA.expected_artifacts || []), "output/index.html", "output/CLASS_MANIFEST.json"])];
WA.outputs = [...new Set([...(WA.outputs || []), "output/index.html", "output/CLASS_MANIFEST.json"])];
if(!WA.task){ WA.task = ["Write output/index.html.",
"RUNTIME_C_CLASS_HANDOFF_REQUIRED:",
"Use class_contract as source of truth. Prefer only class_contract classes.",
"If additional HTML classes are required, include them in output/CLASS_MANIFEST.json under extra_classes.",
"Write output/CLASS_MANIFEST.json with schema_version=factory67.class_manifest.v1, owner_lane=WA, html_artifact=output/index.html, declared_class_contract, html_classes, extra_classes, forbidden_extra_classes=false.",
"The manifest must list every class used in output/index.html."].join(" ");}
bs.workers.WA = WA;
const WB = bs.workers.WB || {};
WB.enabled = WB.enabled !== false;
WB.allowed_paths = [...new Set([...(WB.allowed_paths || []), "output/styles.css", "output/CSS_COVERAGE_REPORT.json"])];
WB.expected_artifacts = [...new Set([...(WB.expected_artifacts || []), "output/styles.css", "output/CSS_COVERAGE_REPORT.json"])];
WB.outputs = [...new Set([...(WB.outputs || []), "output/styles.css", "output/CSS_COVERAGE_REPORT.json"])];
if(!WB.task){ WB.task = ["Write output/styles.css.",
"RUNTIME_C_CSS_COVERAGE_REQUIRED:",
"Read output/CLASS_MANIFEST.json if available.",
"Style every class listed in CLASS_MANIFEST.html_classes and every class from class_contract.",
"Also inspect output/index.html and style every class found there.",
"Write output/CSS_COVERAGE_REPORT.json with schema_version=factory67.css_coverage_report.v1, owner_lane=WB, source_manifest=output/CLASS_MANIFEST.json, css_artifact=output/styles.css, html_class_count, css_class_count, matched, missing, coverage_pct.",
"The missing list must be empty before completion."].join(" ");}
bs.workers.WB = WB;
if(bs.workers.WC && !bs.workers.WC.task){ bs.workers.WC.task = ["Write output/app.js.", "Use class names from CLASS_MANIFEST.json and class_contract where relevant. Do not invent selectors that are absent from HTML."].join(" ");}
bs.checkpoints = [...new Set([...(bs.checkpoints || []), "runtime_c_staggered_class_handoff", "class_manifest_handoff", "css_coverage_report"])];
fs.writeFileSync(output, JSON.stringify(bs,null,2)+"\n");
console.log(JSON.stringify({ ok:true, input, output, required_artifacts: bs.required_artifacts, runtime_c: bs.runtime_c }, null, 2));
