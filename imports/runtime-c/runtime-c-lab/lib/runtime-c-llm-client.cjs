"use strict";
// PATCH_FACTORY67_LLM_CLIENT_V1
// Lightweight ollama client for factory workers. Designed to be called from
// inside the podman lane container OR from the host. Uses 127.0.0.1 because
// run-stage9-compiled-lane.cjs runs containers with --network=host.
//
// Public API:
//   const llm = require('./factory67-llm-client.cjs');
//   const result = await llm.generate({
//     model: 'qwen2.5-coder:14b',
//     prompt: '...',
//     system: '...',         // optional system prompt
//     num_predict: 4000,     // optional max tokens
//     temperature: 0.4,      // optional
//     timeout_ms: 240000,    // optional, default 4 min per call
//   });
//   // result = { ok: true, text: '...', model, ms, total_chars }
//   // OR     = { ok: false, error: '...', ms }
//
// Designed for retry-once-on-failure. Caller decides whether to fall back
// to template generator.

const http = require("http");

const DEFAULT_BASE = null; // endpoint supplied by POD_RESOLUTION
const DEFAULT_TIMEOUT_MS = Number(process.env.EILA_LLM_TIMEOUT_MS || 900000); // PATCH_LLM_CLIENT_TIMEOUT_15MIN_V1 — bumped from 10min (WA hit 10:03 on long prompts)

function postJson(url, payload, timeoutMs) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const body = Buffer.from(JSON.stringify(payload), "utf8");
    const req = http.request({
      method: "POST",
      hostname: u.hostname,
      port: u.port || 80,
      path: u.pathname + (u.search || ""),
      headers: {
        "content-type": "application/json",
        "content-length": body.length
      },
      timeout: timeoutMs
    }, (res) => {
      const chunks = [];
      res.on("data", c => chunks.push(c));
      res.on("end", () => {
        const text = Buffer.concat(chunks).toString("utf8");
        if (res.statusCode < 200 || res.statusCode >= 300) {
          return reject(new Error(`http_${res.statusCode}: ${text.slice(0,200)}`));
        }
        try { resolve(JSON.parse(text)); }
        catch (e) { reject(new Error("json_parse_failed: " + e.message)); }
      });
    });
    req.on("error", reject);
    req.on("timeout", () => { req.destroy(new Error("request_timeout")); });
    req.write(body);
    req.end();
  });
}

async function generate({
  model,
  prompt,
  system = null,
  num_predict = 4000,
  temperature = 0.4,
  num_ctx = 8192,
  think = false,
  timeout_ms = DEFAULT_TIMEOUT_MS,
  base = DEFAULT_BASE
}) {
  if (!model) return { ok: false, error: "model_required", ms: 0 };
  if (!prompt) return { ok: false, error: "prompt_required", ms: 0 };

  const started = Date.now();
  const payload = {
    model,
    prompt,
    stream: false,
    think,
    keep_alive: "24h",
    options: { num_predict, temperature, num_ctx }
  };
  if (system) payload.system = system;

  try {
    const result = await postJson(`${base}/api/generate`, payload, timeout_ms);
    const text = String(result.response || "");
    return {
      ok: true,
      text,
      model,
      ms: Date.now() - started,
      total_chars: text.length,
      eval_count: result.eval_count || null,
      prompt_eval_count: result.prompt_eval_count || null
    };
  } catch (err) {
    return {
      ok: false,
      error: String(err && err.message || err),
      model,
      ms: Date.now() - started
    };
  }
}

// Helper: strip code-fence markdown if model wraps output in ```html ... ```
function stripCodeFence(text, expectedLang = null) {
  if (!text) return text;
  // Match leading ```lang\n...\n``` or ```\n...\n```
  const fenceRe = /^\s*```(?:[a-zA-Z0-9_+-]*)\s*\n([\s\S]*?)\n```\s*$/;
  const m = text.match(fenceRe);
  if (m) return m[1];
  return text;
}

// Helper: validate artifact looks plausible (not empty, not pure error text)
function looksValid(text, kind) {
  if (!text || text.trim().length < 30) return false;
  const lower = text.toLowerCase();
  // Reject obvious refusals or apologies as the entire output
  if (/^(i cannot|i can't|i'm sorry|sorry,|i apologize)/i.test(text.trim())) return false;
  // Lane-kind-specific shape checks
  if (kind === "html" && !/<html|<!doctype|<body|<main|<section|<header/i.test(lower)) return false;
  if (kind === "css" && !/[{};]/.test(text)) return false;
  if (kind === "js" && !/(function|=>|const |let |var |document|window)/i.test(text)) return false;
  return true;
}

module.exports = { generate, stripCodeFence, looksValid };
