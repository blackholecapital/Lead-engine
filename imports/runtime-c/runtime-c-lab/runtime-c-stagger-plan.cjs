#!/usr/bin/env node
const fs = require("fs");
const input = process.argv[2];
if (!input) { console.error("usage: runtime-c-stagger-plan.cjs <buildsheet.json>"); process.exit(2); }
const bs = JSON.parse(fs.readFileSync(input,"utf8"));
const plan = {
  schema_version: "factory67.runtime_c.stagger_plan.v1",
  product_slug: bs.product_slug || bs.product || bs.job,
  job_id: bs.job_meta?.job_id || bs.job || null,
  lane_cell_backend: bs.lane_cell_backend || bs.operator_meta?.lane_cell_backend || null,
  phases: [
    { id: "phase_1_WA_producer", mode: "single-lane", lanes: ["WA"], must_produce: ["output/index.html","output/CLASS_MANIFEST.json"], rationale: "WA is source of truth for HTML classes." },
    { id: "phase_2_dependents_parallel", mode: "parallel-after-manifest", lanes: ["WB","WC","WD","WE","WF"], must_read: ["output/CLASS_MANIFEST.json"], must_produce: ["output/styles.css","output/CSS_COVERAGE_REPORT.json","output/app.js"], rationale: "WB/WC consume actual WA class inventory instead of guessing." },
    { id: "phase_3_authoritative_check", mode: "tool", command: "runtime-c-class-contract-check.cjs <artifact_dir> CLASS_COVERAGE_GATE.json <buildsheet.json>", must_pass: true },
    { id: "phase_4_policy_gate", mode: "opa", command: "conftest test runtime_c_policy_input.json --policy job_site/policies", must_pass_before_publish: true }
  ],
  generated_at: new Date().toISOString()
};
console.log(JSON.stringify(plan,null,2));
