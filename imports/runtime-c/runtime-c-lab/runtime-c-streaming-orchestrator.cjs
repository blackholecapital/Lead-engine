#!/usr/bin/env node
const fs = require("fs");
const cp = require("child_process");
const buildsheet = process.argv[2];
const groupDir = process.argv[3] || "";
if (!buildsheet) { console.error("usage: runtime-c-streaming-orchestrator.cjs <buildsheet.json> [group_dir]"); process.exit(2); }
const bs = JSON.parse(fs.readFileSync(buildsheet,"utf8"));
const plan = {
  schema_version: "factory67.runtime_c.streaming_orchestrator_plan.v1",
  warning: "Safe Foreman sandbox adapter. It prints/executes only if RUNTIME_C_EXEC=1 and RUNTIME_C_LANE_RUNNER_CMD is set.",
  buildsheet,
  group_dir: groupDir || null,
  delay_seconds: { WA_start: 0, WB_start_after_manifest_or: 3, WC_start_after_manifest_or: 6 },
  lanes: [
    {lane:"WA", role:"producer", starts_at_s:0, produces:["output/index.html","output/CLASS_MANIFEST.json"]},
    {lane:"WB", role:"css_follower", starts_at_s:3, waits_for:["handoff/CLASS_MANIFEST.partial.json"], produces:["output/styles.css","output/CSS_COVERAGE_REPORT.json"]},
    {lane:"WC", role:"js_follower", starts_at_s:6, waits_for:["handoff/CLASS_MANIFEST.partial.json"], produces:["output/app.js"]},
    {lane:"WD", role:"proof", starts_at_s:6},
    {lane:"WE", role:"regression", starts_at_s:6},
    {lane:"WF", role:"operator_review", starts_at_s:6}
  ],
  env_contract: {
    RUNTIME_C_EXEC: "set to 1 to execute lane runner command",
    RUNTIME_C_LANE_RUNNER_CMD: "template command. {lane} {buildsheet} {group_dir} are replaced"
  },
  generated_at: new Date().toISOString()
};
console.log(JSON.stringify(plan,null,2));
if (process.env.RUNTIME_C_EXEC !== "1") process.exit(0);
const tmpl = process.env.RUNTIME_C_LANE_RUNNER_CMD;
if (!tmpl) { console.error("RUNTIME_C_EXEC=1 but RUNTIME_C_LANE_RUNNER_CMD is empty"); process.exit(2); }
function runLane(lane){
  const cmd = tmpl.replaceAll("{lane}", lane).replaceAll("{buildsheet}", buildsheet).replaceAll("{group_dir}", groupDir);
  console.error(`[runtime-c] exec ${lane}: ${cmd}`);
  return cp.spawn("bash", ["-lc", cmd], {stdio:"inherit"});
}
runLane("WA");
setTimeout(() => runLane("WB"), 3000);
setTimeout(() => runLane("WC"), 6000);
setTimeout(() => runLane("WD"), 6000);
setTimeout(() => runLane("WE"), 6000);
setTimeout(() => runLane("WF"), 6000);
